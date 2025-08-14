/**
 * Test suite for command structure validation
 * Tests individual command files for proper structure and content
 */

const fs = require('fs');
const path = require('path');
const CommandValidator = require('../scripts/validate-commands');

describe('Command Structure Validation', () => {
  let validator;
  let commandFiles;
  
  beforeAll(() => {
    validator = new CommandValidator();
    
    // Discover all command files using the validator's method
    const commandDir = path.join(global.TEST_CONFIG.PROJECT_ROOT, '.claude', 'commands');
    if (fs.existsSync(commandDir)) {
      commandFiles = validator.findMarkdownFiles(commandDir);
    } else {
      commandFiles = [];
    }
  });

  describe('Command File Discovery', () => {
    test('should find expected number of command files', () => {
      expect(commandFiles.length).toBe(global.TEST_CONFIG.EXPECTED_COMMAND_COUNT);
    });

    test('should have commands organized in proper directory structure', () => {
      const directoryStructure = {};
      
      commandFiles.forEach(file => {
        const relativePath = path.relative(
          path.join(global.TEST_CONFIG.PROJECT_ROOT, '.claude', 'commands'),
          file
        );
        const directory = path.dirname(relativePath);
        
        if (!directoryStructure[directory]) {
          directoryStructure[directory] = [];
        }
        directoryStructure[directory].push(path.basename(file));
      });
      
      // Should have multiple directories (phases)
      expect(Object.keys(directoryStructure).length).toBeGreaterThan(1);
      
      // Each directory should follow naming convention, allow 'tasks' folder as an exception
      Object.keys(directoryStructure).forEach(dir => {
        if (dir !== '.' && dir !== 'tasks') {
          expect(dir).toMatch(/^\d{2}-[a-z-]+$/);
        }
      });
    });
  });

  describe('Individual Command Validation', () => {
    test('should validate all command structures', async () => {
      if (commandFiles.length === 0) {
        console.warn('No command files found - skipping validation tests');
        return;
      }

      for (const commandFile of commandFiles) {
        const content = fs.readFileSync(commandFile, 'utf8');
        const filename = path.relative(global.TEST_CONFIG.PROJECT_ROOT, commandFile);
        
        // Reset validator state for each test
        validator.errors = [];
        validator.warnings = [];
        
        // Validate the command
        await validator.validateFile(commandFile);
        
        // Check for critical errors
        const criticalErrors = validator.errors.filter(error => 
          error.includes(filename) && !error.includes('Missing XML sections')
        );
        
        if (criticalErrors.length > 0) {
          console.log(`Critical errors in ${filename}:`, criticalErrors);
        }
        
        // Commands should not have critical structural errors
        expect(criticalErrors.length).toBe(0);
      }
    });

    test('should have proper command naming', () => {
      commandFiles.forEach(file => {
        const basename = path.basename(file, '.md');
        
        // Command names should be kebab-case
        expect(basename).toMatch(/^[a-z0-9-_]+$/);
        
        // Should not be too long
        expect(basename.length).toBeLessThan(50);
      });
    });

    test('should have required metadata extractable', () => {
      commandFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.relative(global.TEST_CONFIG.PROJECT_ROOT, file);
        
        const metadata = validator.extractCommandMetadata(content, filename);
        
        expect(metadata).toBeDefined();
        expect(metadata.id).toBeDefined();
        expect(metadata.name).toBeDefined();
        expect(metadata.category).toBeDefined();
        // Phases can be 0..11 based on folder prefix; allow 0
        expect(metadata.phase).toBeGreaterThanOrEqual(0);
        expect(metadata.safety_level).toMatch(/^(safe|caution|dangerous)$/);
      });
    });
  });

  describe('Command Content Quality', () => {
    test('should have meaningful descriptions', () => {
      commandFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        // Should have a description section or reasonable content length
        const hasDescription = content.includes('## Description') || 
                              content.includes('description:') ||
                              content.length > 120;
        
        expect(hasDescription).toBe(true);
      });
    });

    test('should have proper safety classifications', () => {
      const safetyDistribution = { safe: 0, caution: 0, dangerous: 0 };
      
      commandFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.relative(global.TEST_CONFIG.PROJECT_ROOT, file);
        
        const metadata = validator.extractCommandMetadata(content, filename);
        safetyDistribution[metadata.safety_level]++;
      });
      
      // Should have a mix of safety levels
      expect(safetyDistribution.safe).toBeGreaterThan(0);
      expect(safetyDistribution.safe + safetyDistribution.caution + safetyDistribution.dangerous)
        .toBe(global.TEST_CONFIG.EXPECTED_COMMAND_COUNT);
    });

    test('should have consistent usage patterns', () => {
      const usagePatterns = new Set();
      
      commandFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.relative(global.TEST_CONFIG.PROJECT_ROOT, file);
        
        const metadata = validator.extractCommandMetadata(content, filename);
        
        // Usage should start with /
        expect(metadata.usage).toMatch(/^\//);
        
        // Collect patterns for consistency analysis
        const pattern = metadata.usage.split(' ')[0]; // First word
        usagePatterns.add(pattern);
      });
      
      // Should have reasonable number of unique command patterns
      expect(usagePatterns.size).toBe(global.TEST_CONFIG.EXPECTED_COMMAND_COUNT);
    });
  });

  describe('Command Dependencies', () => {
    test('should not have circular dependencies', () => {
      const commandGraph = new Map();
      
      // Build dependency graph
      commandFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.relative(global.TEST_CONFIG.PROJECT_ROOT, file);
        
        const metadata = validator.extractCommandMetadata(content, filename);
        commandGraph.set(metadata.id, metadata.dependencies || []);
      });
      
      // Check for circular dependencies using DFS
      const visited = new Set();
      const recursionStack = new Set();
      
      const hasCycle = (commandId) => {
        if (recursionStack.has(commandId)) {
          return true;
        }
        if (visited.has(commandId)) {
          return false;
        }
        
        visited.add(commandId);
        recursionStack.add(commandId);
        
        const dependencies = commandGraph.get(commandId) || [];
        for (const dep of dependencies) {
          if (commandGraph.has(dep) && hasCycle(dep)) {
            return true;
          }
        }
        
        recursionStack.delete(commandId);
        return false;
      };
      
      for (const commandId of commandGraph.keys()) {
        expect(hasCycle(commandId)).toBe(false);
      }
    });
  });

  describe('Phase Organization', () => {
    test('should have commands distributed across phases', () => {
      const phaseDistribution = {};
      
      commandFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.relative(global.TEST_CONFIG.PROJECT_ROOT, file);
        
        const metadata = validator.extractCommandMetadata(content, filename);
        const {phase} = metadata;
        
        if (!phaseDistribution[phase]) {
          phaseDistribution[phase] = 0;
        }
        phaseDistribution[phase]++;
      });
      
      // Should have multiple phases
      expect(Object.keys(phaseDistribution).length).toBeGreaterThan(1);
      
      // Each phase should have at least one command
      Object.values(phaseDistribution).forEach(count => {
        expect(count).toBeGreaterThan(0);
      });
    });

    test('should have logical phase progression', () => {
      const phases = new Set();
      
      commandFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const filename = path.relative(global.TEST_CONFIG.PROJECT_ROOT, file);
        
        const metadata = validator.extractCommandMetadata(content, filename);
        phases.add(metadata.phase);
      });
      
      const sortedPhases = Array.from(phases).sort((a, b) => a - b);
      
      // Phases should be reasonable (0-11 based on folder prefixes)
      if (sortedPhases.length > 0) {
        expect(sortedPhases[0]).toBeGreaterThanOrEqual(0);
        expect(sortedPhases[sortedPhases.length - 1]).toBeLessThanOrEqual(11);
      }
    });
  });
});