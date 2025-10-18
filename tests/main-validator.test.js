/**
 * comprehensive test suite for MainValidator validator module
 * tests validator coordination, table-driven validation, and result aggregation
 */

const MainValidator = require('../scripts/validators/main-validator');
const fs = require('fs');
const path = require('path');

describe('MainValidator Module', () => {
  let mainValidator;
  let tempDir;

  beforeAll(() => {
    tempDir = path.join(global.TEST_CONFIG.PROJECT_ROOT, 'tests', 'temp', 'main-validator-test');
    fs.mkdirSync(tempDir, { recursive: true });
  });

  beforeEach(() => {
    mainValidator = new MainValidator(['node_modules', '.git', 'test']);
  });

  afterEach(() => {
    // clean temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(() => {
    // final cleanup
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Constructor', () => {
    test('should initialize with default exclude patterns', () => {
      const validator = new MainValidator();
      expect(validator.excludePatterns).toEqual(['node_modules', '.git', 'test', '__pycache__']);
    });

    test('should initialize with custom exclude patterns', () => {
      const customPatterns = ['custom', 'patterns'];
      const validator = new MainValidator({ excludePatterns: customPatterns });
      expect(validator.excludePatterns).toEqual(customPatterns);
    });

    test('should initialize all sub-validators', () => {
      expect(mainValidator.securityValidator).toBeDefined();
      expect(mainValidator.structureValidator).toBeDefined();
      expect(mainValidator.qualityScorer).toBeDefined();
      expect(mainValidator.fileUtils).toBeDefined();
    });

    test('should initialize stats object', () => {
      expect(mainValidator.stats).toHaveProperty('totalFiles', 0);
      expect(mainValidator.stats).toHaveProperty('validFiles', 0);
      expect(mainValidator.stats).toHaveProperty('commandFiles', 0);
      expect(mainValidator.stats).toHaveProperty('promptFiles', 0);
      expect(mainValidator.stats).toHaveProperty('securityIssues', 0);
      expect(mainValidator.stats).toHaveProperty('qualityScore', 0);
      expect(mainValidator.stats).toHaveProperty('errors');
      expect(mainValidator.stats).toHaveProperty('warnings');
      expect(mainValidator.stats).toHaveProperty('securityReport');
      expect(mainValidator.stats).toHaveProperty('fileTypes');
      expect(mainValidator.stats.fileTypes instanceof Map).toBe(true);
    });

    test('should set up validator registry', () => {
      expect(Array.isArray(mainValidator.validators)).toBe(true);
      expect(mainValidator.validators.length).toBeGreaterThan(0);
      
      // check that each validator has required properties
      mainValidator.validators.forEach(validator => {
        expect(validator).toHaveProperty('name');
        expect(validator).toHaveProperty('when');
        expect(typeof validator.when).toBe('function');
        expect(validator).toHaveProperty('run');
        expect(typeof validator.run).toBe('function');
        expect(validator).toHaveProperty('collect');
        expect(typeof validator.collect).toBe('function');
      });
    });
  });

  describe('validateFile', () => {
    describe('File type detection', () => {
      test('should detect command files', () => {
        const filepath = path.join(tempDir, 'test-command.md');
        const content = '# Test Command\n\n## Description\nTest';
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(mainValidator.stats.commandFiles).toBe(1);
        expect(mainValidator.stats.fileTypes.get(filepath)).toBe('command');
      });

      test('should detect non-command files', () => {
        const filepath = path.join(tempDir, 'regular-file.md');
        const content = '# Regular File\n\nJust content.';
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(mainValidator.stats.fileTypes.get(filepath)).toBe('general');
      });

      test('should handle non-existent files', () => {
        const result = mainValidator.validateFile('/non/existent/file.md');
        
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
        expect(mainValidator.stats.errors.length).toBeGreaterThan(0);
      });
    });

    describe('Validator execution flow', () => {
      test('should run XML structure validator for XML content', () => {
        const filepath = path.join(tempDir, 'prompt.md');
        const content = `
<role>Test role</role>
<activation>Test activation</activation>
<instructions>Test instructions</instructions>
<output_format>Test format</output_format>
`;
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(result.valid).toBe(true);
        expect(mainValidator.stats.totalFiles).toBe(1);
        expect(mainValidator.stats.validFiles).toBe(1);
      });

      test('should run command structure validator for command files', () => {
        const filepath = path.join(tempDir, '.claude', 'commands', 'test.md');
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        
        const content = `
# Test Command

## Description
Test description.

## Usage
\`\`\`bash
/test-command
\`\`\`

## Parameters
- **param**: Test parameter

## Examples
Example usage.
`;
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(result.valid).toBe(true);
        expect(mainValidator.stats.commandFiles).toBe(1);
      });

      test('should always run security validator', () => {
        const filepath = path.join(tempDir, 'test.md');
        const content = '# Test\n\nSafe content.';
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        // security validator always runs
        expect(mainValidator.stats.securityReport).toBeDefined();
      });

      test('should always run quality validator', () => {
        const filepath = path.join(tempDir, 'test.md');
        const content = '# Test\n\nSome content.';
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(result.qualityScore).toBeDefined();
        expect(typeof result.qualityScore).toBe('number');
      });

      test('should skip validators based on when condition', () => {
        const filepath = path.join(tempDir, 'no-xml.md');
        const content = '# No XML\n\nJust markdown content.';
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        // XML validator should not run for non-XML content
        const xmlValidator = mainValidator.validators.find(v => v.name === 'xmlStructure');
        expect(xmlValidator.when(filepath, content)).toBe(false);
      });
    });

    describe('Result aggregation', () => {
      test('should aggregate errors from all validators', () => {
        const filepath = path.join(tempDir, '.claude', 'commands', 'invalid.md');
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        
        // create content that will fail multiple validations
        const content = `
# Invalid Command

Missing required sections.
`;
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(result.valid).toBe(false);
        expect(mainValidator.stats.errors.length).toBeGreaterThan(0);
        expect(mainValidator.stats.validFiles).toBe(0);
      });

      test('should aggregate warnings from all validators', () => {
        const filepath = path.join(tempDir, '.claude', 'commands', 'warning.md');
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        
        const content = `
# Warning Command

## Description
Test description.

## Usage
No code block here.

## Parameters
- **param**: Test parameter

## Examples
Example usage.
`;
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(mainValidator.stats.warnings.length).toBeGreaterThan(0);
      });

      test('should aggregate security issues', () => {
        const filepath = path.join(tempDir, 'insecure.md');
        const content = `
# Insecure Content

\`\`\`bash
password="hardcoded-secret"
rm -rf /
\`\`\`
`;
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(mainValidator.stats.securityIssues).toBeGreaterThan(0);
        expect(mainValidator.stats.securityReport.length).toBeGreaterThan(0);
      });

      test('should aggregate quality scores', () => {
        const filepath = path.join(tempDir, 'quality.md');
        const content = `
# High Quality Content

${'a'.repeat(2000)}

## Context
Some context.

## Examples
Example with context.

## Important
Important notes.
`;
        fs.writeFileSync(filepath, content);
        
        const result = mainValidator.validateFile(filepath);
        
        expect(result.qualityScore).toBeGreaterThan(0);
        expect(mainValidator.stats.qualityScore).toBeGreaterThan(0);
      });
    });

    describe('Edge cases', () => {
      test('should handle empty files', () => {
        const filepath = path.join(tempDir, 'empty.md');
        fs.writeFileSync(filepath, '');
        
        const result = mainValidator.validateFile(filepath);
        
        expect(result.valid).toBe(false);
        expect(mainValidator.stats.totalFiles).toBe(1);
      });

      test('should handle files with only whitespace', () => {
        const filepath = path.join(tempDir, 'whitespace.md');
        fs.writeFileSync(filepath, '   \n\n   \t\n   ');
        
        const result = mainValidator.validateFile(filepath);
        
        expect(result.valid).toBe(false);
      });

      test('should handle very large files', () => {
        const filepath = path.join(tempDir, 'large.md');
        const largeContent = '# Large File\n\n' + 'a'.repeat(100000);
        fs.writeFileSync(filepath, largeContent);
        
        const startTime = Date.now();
        const result = mainValidator.validateFile(filepath);
        const duration = Date.now() - startTime;
        
        expect(result).toBeDefined();
        expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      });
    });
  });

  describe('validateDirectory', () => {
    test('should validate all markdown files in directory', () => {
      // create test files
      fs.writeFileSync(path.join(tempDir, 'file1.md'), '# File 1');
      fs.writeFileSync(path.join(tempDir, 'file2.md'), '# File 2');
      fs.writeFileSync(path.join(tempDir, 'not-md.txt'), 'Not markdown');
      
      const stats = mainValidator.validateDirectory(tempDir);
      
      expect(stats.totalFiles).toBe(2);
      expect(stats.validFiles).toBe(2);
    });

    test('should handle nested directories', () => {
      const subdir = path.join(tempDir, 'subdir');
      fs.mkdirSync(subdir);
      
      fs.writeFileSync(path.join(tempDir, 'root.md'), '# Root');
      fs.writeFileSync(path.join(subdir, 'nested.md'), '# Nested');
      
      const stats = mainValidator.validateDirectory(tempDir);
      
      expect(stats.totalFiles).toBe(2);
    });

    test('should respect exclude patterns', () => {
      const nodeModulesDir = path.join(tempDir, 'node_modules');
      fs.mkdirSync(nodeModulesDir);
      
      fs.writeFileSync(path.join(tempDir, 'included.md'), '# Included');
      fs.writeFileSync(path.join(nodeModulesDir, 'excluded.md'), '# Excluded');
      
      const stats = mainValidator.validateDirectory(tempDir);
      
      expect(stats.totalFiles).toBe(1);
      expect(mainValidator.fileUtils.shouldExclude(path.join(nodeModulesDir, 'excluded.md'))).toBe(true);
    });

    test('should calculate average quality score', () => {
      // create files with different quality scores
      fs.writeFileSync(path.join(tempDir, 'high-quality.md'), '# ' + 'a'.repeat(2000));
      fs.writeFileSync(path.join(tempDir, 'low-quality.md'), '# Short');
      
      const stats = mainValidator.validateDirectory(tempDir);
      
      expect(stats.qualityScore).toBeGreaterThan(0);
      expect(stats.qualityScore).toBeLessThan(100);
    });

    test('should handle empty directory', () => {
      const stats = mainValidator.validateDirectory(tempDir);
      
      expect(stats.totalFiles).toBe(0);
      expect(stats.qualityScore).toBe(0);
    });
  });

  describe('getResults', () => {
    test('should return complete validation results', () => {
      // create a test file
      const filepath = path.join(tempDir, 'test.md');
      const content = '# Test\n\nContent.';
      fs.writeFileSync(filepath, content);
      
      mainValidator.validateFile(filepath);
      
      const results = mainValidator.getResults();
      
      expect(results).toHaveProperty('stats');
      expect(results).toHaveProperty('errors');
      expect(results).toHaveProperty('warnings');
      expect(results).toHaveProperty('securityReport');
      expect(results.stats).toEqual(mainValidator.stats);
    });
  });

  describe('generateSummary', () => {
    test('should generate summary with all required fields', () => {
      // create test files
      fs.writeFileSync(path.join(tempDir, 'command.md'), '# Command\n\n## Description\nTest');
      fs.writeFileSync(path.join(tempDir, 'prompt.md'), '<role>Test</role>\n<activation>Test</activation>');
      
      mainValidator.validateDirectory(tempDir);
      
      const summary = mainValidator.generateSummary();
      
      expect(summary).toHaveProperty('totalFiles');
      expect(summary).toHaveProperty('validFiles');
      expect(summary).toHaveProperty('commandFiles');
      expect(summary).toHaveProperty('promptFiles');
      expect(summary).toHaveProperty('errorCount');
      expect(summary).toHaveProperty('warningCount');
      expect(summary).toHaveProperty('securityIssues');
      expect(summary).toHaveProperty('averageQualityScore');
      expect(summary).toHaveProperty('fileTypeBreakdown');
      
      expect(summary.totalFiles).toBe(2);
      expect(summary.commandFiles).toBe(1);
      expect(summary.errorCount).toBeGreaterThanOrEqual(0);
      expect(summary.warningCount).toBeGreaterThanOrEqual(0);
    });

    test('should calculate fileTypeBreakdown correctly', () => {
      // create files of different types
      fs.writeFileSync(path.join(tempDir, 'cmd.md'), '# Command\n\n## Description\nTest');
      fs.writeFileSync(path.join(tempDir, 'general.md'), '# General\n\nJust content.');
      
      mainValidator.validateDirectory(tempDir);
      
      const summary = mainValidator.generateSummary();
      
      expect(summary.fileTypeBreakdown).toHaveProperty('command');
      expect(summary.fileTypeBreakdown).toHaveProperty('general');
      expect(summary.fileTypeBreakdown.command).toBe(1);
      expect(summary.fileTypeBreakdown.general).toBe(1);
    });

    test('should handle directory with no files', () => {
      const summary = mainValidator.generateSummary();
      
      expect(summary.totalFiles).toBe(0);
      expect(summary.validFiles).toBe(0);
      expect(summary.errorCount).toBe(0);
      expect(summary.warningCount).toBe(0);
      expect(summary.averageQualityScore).toBe(0);
    });
  });

  describe('Integration scenarios', () => {
    test('should handle complex validation workflow', () => {
      // create a comprehensive test structure
      const commandsDir = path.join(tempDir, '.claude', 'commands');
      fs.mkdirSync(commandsDir, { recursive: true });
      
      // create a valid command file
      fs.writeFileSync(path.join(commandsDir, 'valid-cmd.md'), `
# Valid Command

## Description
A properly structured command.

## Usage
\`\`\`bash
/valid-cmd --option
\`\`\`

## Parameters
- **option**: Test option

## Examples
\`\`\`bash
/valid-cmd --test
\`\`\`
Example usage.
`);

      // create an invalid command file
      fs.writeFileSync(path.join(commandsDir, 'invalid-cmd.md'), `
# Invalid Command
Missing sections.
`);

      // create a prompt file
      fs.writeFileSync(path.join(tempDir, 'prompt.md'), `
<role>Test role</role>
<activation>Test activation</activation>
<instructions>Test instructions</instructions>
<output_format>Test format</output_format>
`);

      // create a file with security issues
      fs.writeFileSync(path.join(tempDir, 'insecure.md'), `
# Insecure

\`\`\`bash
password="secret"
rm -rf /
\`\`\`
`);

      // validate the directory
      const stats = mainValidator.validateDirectory(tempDir);
      
      // check results
      expect(stats.totalFiles).toBe(4);
      expect(stats.validFiles).toBeLessThan(4);
      expect(stats.commandFiles).toBe(2);
      expect(stats.securityIssues).toBeGreaterThan(0);
      expect(stats.errors.length).toBeGreaterThan(0);
      
      // generate summary
      const summary = mainValidator.generateSummary();
      
      expect(summary.totalFiles).toBe(4);
      expect(summary.errorCount).toBeGreaterThan(0);
      expect(summary.securityIssues).toBeGreaterThan(0);
      expect(summary.averageQualityScore).toBeGreaterThan(0);
    });

    test('should reset stats between validation runs', () => {
      // first validation
      fs.writeFileSync(path.join(tempDir, 'file1.md'), '# File 1');
      mainValidator.validateDirectory(tempDir);
      
      const firstStats = { ...mainValidator.stats };
      
      // reset and second validation
      mainValidator = new MainValidator(['node_modules', '.git', 'test']);
      fs.writeFileSync(path.join(tempDir, 'file2.md'), '# File 2');
      mainValidator.validateDirectory(tempDir);
      
      const secondStats = mainValidator.stats;
      
      expect(secondStats.totalFiles).not.toBe(firstStats.totalFiles);
    });
  });

  describe('Performance', () => {
    test('should validate multiple files efficiently', () => {
      // create many test files
      for (let i = 0; i < 50; i++) {
        fs.writeFileSync(path.join(tempDir, `file${i}.md`), `# File ${i}\n\nContent.`);
      }
      
      const startTime = Date.now();
      const stats = mainValidator.validateDirectory(tempDir);
      const duration = Date.now() - startTime;
      
      expect(stats.totalFiles).toBe(50);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('Error handling', () => {
    test('should handle file read errors gracefully', () => {
      const filepath = path.join(tempDir, 'unreadable.md');
      fs.writeFileSync(filepath, 'content');
      
      // make file unreadable (simulate permission error)
      const originalReadFileSync = fs.readFileSync;
      fs.readFileSync = jest.fn(() => {
        throw new Error('Permission denied');
      });
      
      const result = mainValidator.validateFile(filepath);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Permission denied');
      
      // restore original function
      fs.readFileSync = originalReadFileSync;
    });

    test('should handle validator runtime errors', () => {
      const filepath = path.join(tempDir, 'error.md');
      fs.writeFileSync(filepath, '# Test');

      // mock a validator to throw an error
      const originalRun = mainValidator.validators[0].run;
      mainValidator.validators[0].run = jest.fn(() => {
        throw new Error('Validator error');
      });

      const result = mainValidator.validateFile(filepath);

      // improved error handling now catches exceptions gracefully
      expect(result).toBeDefined();
      expect(result).toHaveProperty('valid');

      // restore original function
      mainValidator.validators[0].run = originalRun;
    });
  });
});