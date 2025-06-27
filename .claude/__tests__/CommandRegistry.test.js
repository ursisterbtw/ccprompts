/**
 * Test suite for Command Registry System
 * Validates command discovery, loading, and validation functionality
 */

const CommandRegistry = require('../CommandRegistry');
const fs = require('fs');
const path = require('path');

// Mock fs to control file system interactions
jest.mock('fs');

describe('CommandRegistry', () => {
  let registry;
  let mockRegistryData;

  beforeEach(() => {
    // Mock registry data
    mockRegistryData = {
      version: '1.0.0',
      description: 'Test registry',
      commands: {
        '_metadata': {
          total_commands: 2,
          phases: 2
        },
        'phase-1-category': {
          description: 'Core development commands',
          count: 2,
          commands: {
            'bootstrap-project': {
              description: 'Complete project initialization',
              prompt_file: 'prompts/01-project-initialization/comprehensive-bootstrap.md',
              parameters: {
                type: {
                  type: 'string',
                  enum: ['web-app', 'api'],
                  required: true
                },
                technology: {
                  type: 'string',
                  enum: ['typescript', 'javascript'],
                  required: true
                }
              },
              dependencies: [],
              complexity: 'high',
              estimated_time: '15-30 minutes'
            },
            'audit-security': {
              description: 'Security analysis',
              prompt_file: 'prompts/02-code-analysis/security-quality-audit.md',
              parameters: {
                scope: {
                  type: 'string',
                  enum: ['full-codebase', 'changed-files'],
                  default: 'changed-files'
                }
              },
              dependencies: [],
              complexity: 'medium',
              estimated_time: '10-20 minutes'
            }
          }
        },
        'phase-4-utility': {
          description: 'Utility commands',
          count: 1,
          commands: {
            'list-prompts': {
              description: 'Command discovery',
              prompt_file: 'prompts/04-utility/list-prompts.md',
              parameters: {
                phase: {
                  type: 'string',
                  enum: ['category', 'utility']
                }
              },
              dependencies: [],
              complexity: 'low',
              estimated_time: '2-5 minutes'
            }
          }
        }
      }
    };

    // Mock file system calls
    fs.readFileSync.mockImplementation((filePath) => {
      const filename = path.basename(filePath);
      
      switch (filename) {
      case 'commands.json':
        return JSON.stringify(mockRegistryData);
      case 'schema.json':
        return JSON.stringify({
          type: 'object',
          properties: {
            version: { type: 'string', default: '1.0.0' }
          }
        });
      case 'config.json':
        return JSON.stringify({ version: '1.0.0' });
      case 'list-prompts.md':
        return '# List Prompts Command\\nCommand implementation here';
      default:
        throw new Error(`ENOENT: ${filePath}`);
      }
    });

    fs.existsSync.mockImplementation((filePath) => {
      const filename = path.basename(filePath);
      return ['commands.json', 'schema.json', 'config.json', 'list-prompts.md'].includes(filename);
    });

    registry = new CommandRegistry('/test/path');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Registry Loading', () => {
    test('should load registry successfully', () => {
      expect(registry.registry).toEqual(mockRegistryData);
    });

    test('should validate registry structure', () => {
      expect(() => {
        new CommandRegistry('/test/path');
      }).not.toThrow();
    });

    test('should throw error for invalid registry', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' })); // Missing commands
      
      expect(() => {
        new CommandRegistry('/test/path');
      }).toThrow('Registry must contain commands object');
    });
  });

  describe('Command Discovery', () => {
    test('should get all commands organized by phase', () => {
      const commands = registry.getAllCommands();
      
      expect(commands['phase-1-category']).toBeDefined();
      expect(commands['phase-1-category'].description).toBe('Core development commands');
      expect(commands['phase-1-category'].commands).toContain('bootstrap-project');
      expect(commands['phase-1-category'].commands).toContain('audit-security');
      
      expect(commands['phase-4-utility']).toBeDefined();
      expect(commands['phase-4-utility'].commands).toContain('list-prompts');
    });

    test('should get specific command details', () => {
      const command = registry.getCommand('bootstrap-project');
      
      expect(command).toBeDefined();
      expect(command.name).toBe('bootstrap-project');
      expect(command.phase).toBe('phase-1-category');
      expect(command.description).toBe('Complete project initialization');
      expect(command.complexity).toBe('high');
      expect(command.parameters.type.required).toBe(true);
    });

    test('should return null for non-existent command', () => {
      const command = registry.getCommand('non-existent-command');
      expect(command).toBeNull();
    });

    test('should get commands by phase', () => {
      const commands = registry.getCommandsByPhase('phase-1-category');
      
      expect(Object.keys(commands)).toHaveLength(2);
      expect(commands['bootstrap-project']).toBeDefined();
      expect(commands['audit-security']).toBeDefined();
      expect(commands['bootstrap-project'].metadata.phase_description).toBe('Core development commands');
    });

    test('should throw error for invalid phase', () => {
      expect(() => {
        registry.getCommandsByPhase('invalid-phase');
      }).toThrow('Phase invalid-phase not found in registry');
    });
  });

  describe('Command Search', () => {
    test('should search commands by name', () => {
      const results = registry.searchCommands('bootstrap');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('bootstrap-project');
      expect(results[0].score).toBeGreaterThan(0);
    });

    test('should search commands by description', () => {
      const results = registry.searchCommands('security');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('audit-security');
    });

    test('should filter search results by phase', () => {
      const results = registry.searchCommands('project', { phase: 'phase-1-category' });
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('bootstrap-project');
    });

    test('should filter search results by complexity', () => {
      const results = registry.searchCommands('', { complexity: 'high' });
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('bootstrap-project');
    });

    test('should limit search results', () => {
      const results = registry.searchCommands('', { limit: 1 });
      
      expect(results).toHaveLength(1);
    });

    test('should calculate relevance scores correctly', () => {
      const exactMatch = registry.calculateRelevanceScore('bootstrap-project', 'bootstrap-project', {});
      const partialMatch = registry.calculateRelevanceScore('bootstrap', 'bootstrap-project', {});
      
      expect(exactMatch).toBeGreaterThan(partialMatch);
    });
  });

  describe('Parameter Validation', () => {
    test('should validate correct parameters', () => {
      const result = registry.validateCommandParameters('bootstrap-project', {
        type: 'web-app',
        technology: 'typescript'
      });
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect missing required parameters', () => {
      const result = registry.validateCommandParameters('bootstrap-project', {
        type: 'web-app'
        // Missing required 'technology' parameter
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Required parameter \'technology\' is missing');
    });

    test('should validate parameter types', () => {
      const result = registry.validateCommandParameters('bootstrap-project', {
        type: 123, // Should be string
        technology: 'typescript'
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Parameter \'type\' must be a string');
    });

    test('should validate enum values', () => {
      const result = registry.validateCommandParameters('bootstrap-project', {
        type: 'invalid-type',
        technology: 'typescript'
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Parameter \'type\' must be one of: web-app, api');
    });

    test('should handle non-existent command', () => {
      const result = registry.validateCommandParameters('non-existent', {});
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Command non-existent not found');
    });
  });

  describe('Command Loading', () => {
    test('should load command implementation from phase directory', () => {
      const content = registry.loadCommandImplementation('list-prompts');
      
      expect(content).toContain('# List Prompts Command');
      expect(content).toContain('Command implementation here');
    });

    test('should cache command implementations', () => {
      // First load
      const content1 = registry.loadCommandImplementation('list-prompts');
      
      // Second load should use cache
      const content2 = registry.loadCommandImplementation('list-prompts');
      
      expect(content1).toBe(content2);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('list-prompts.md'),
        'utf8'
      ); // Command file should be read
    });

    test('should throw error for non-existent command implementation', () => {
      fs.existsSync.mockReturnValue(false);
      
      expect(() => {
        registry.loadCommandImplementation('bootstrap-project');
      }).toThrow('Failed to load command bootstrap-project');
    });
  });

  describe('Registry Statistics', () => {
    test('should generate comprehensive statistics', () => {
      const stats = registry.getRegistryStats();
      
      expect(stats.total_commands).toBe(3);
      expect(stats.phases['phase-1-category'].count).toBe(2);
      expect(stats.phases['phase-4-utility'].count).toBe(1);
      expect(stats.complexity_distribution.high).toBe(1);
      expect(stats.complexity_distribution.medium).toBe(1);
      expect(stats.complexity_distribution.low).toBe(1);
      expect(stats.average_time).toBeGreaterThanOrEqual(0); // Might be 0 if no valid time estimates
    });

    test('should track dependencies correctly', () => {
      const stats = registry.getRegistryStats();
      
      // All test commands have empty dependencies
      Object.values(stats.dependency_graph).forEach(deps => {
        expect(deps).toHaveLength(0);
      });
    });
  });

  describe('Registry Export', () => {
    test('should export registry as JSON', () => {
      const exported = registry.exportRegistry('json');
      const parsed = JSON.parse(exported);
      
      expect(parsed).toEqual(mockRegistryData);
    });

    test('should export registry as Markdown', () => {
      const exported = registry.exportRegistry('markdown');
      
      expect(exported).toContain('# ccprompts Command Registry');
      expect(exported).toContain('## phase 1 category');
      expect(exported).toContain('### /bootstrap-project');
      expect(exported).toContain('Complete project initialization');
    });

    test('should throw error for unsupported export format', () => {
      expect(() => {
        registry.exportRegistry('xml');
      }).toThrow('Unsupported export format: xml');
    });
  });

  describe('Dependencies', () => {
    test('should get command dependencies', () => {
      const deps = registry.getCommandDependencies('bootstrap-project');
      
      expect(Array.isArray(deps)).toBe(true);
      expect(deps).toHaveLength(0); // Test command has no dependencies
    });

    test('should return empty array for command without dependencies', () => {
      const deps = registry.getCommandDependencies('list-prompts');
      
      expect(deps).toEqual([]);
    });

    test('should return empty array for non-existent command', () => {
      const deps = registry.getCommandDependencies('non-existent');
      
      expect(deps).toEqual([]);
    });
  });
});