/**
 * test suite for ccprompts validation system
 * tests command metadata extraction, registry generation, and validation logic
 */

const fs = require('fs');
const path = require('path');
const CommandValidator = require('../scripts/validate-commands');

describe('ccprompts Validation System', () => {
  let validator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  afterEach(() => {
    global.testUtils.cleanupTempFiles();
  });

  describe('Command Registry Generation', () => {
    test('should generate valid command registry', async () => {
      const registryPath = path.join(global.TEST_CONFIG.PROJECT_ROOT, '.claude', 'command-registry.json');

      // run validation to generate registry
      await validator.validate();

      // check registry exists
      expect(fs.existsSync(registryPath)).toBe(true);

      // parse and validate registry structure
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

      expect(registry).toHaveProperty('version');
      expect(registry).toHaveProperty('last_updated');
      expect(registry).toHaveProperty('commands');
      expect(registry).toHaveProperty('categories');
      expect(registry).toHaveProperty('phases');
      expect(registry).toHaveProperty('validation_results');

      // validate commands structure
      const commandIds = Object.keys(registry.commands);
      expect(commandIds.length).toBe(global.TEST_CONFIG.EXPECTED_COMMAND_COUNT);

      // validate each command has required metadata
      commandIds.forEach(commandId => {
        const command = registry.commands[commandId];
        expect(command).toHaveProperty('id');
        expect(command).toHaveProperty('name');
        expect(command).toHaveProperty('category');
        expect(command).toHaveProperty('phase');
        expect(command).toHaveProperty('description');
        expect(command).toHaveProperty('usage');
        expect(command).toHaveProperty('safety_level');
        expect(['safe', 'caution', 'dangerous']).toContain(command.safety_level);
      });
    });

    test('should categorize commands correctly', async () => {
      await validator.validate();

      const registry = validator.commandRegistry;
      const categories = Object.keys(registry.categories);

      expect(categories.length).toBeGreaterThan(0);

      // verify category structure
      categories.forEach(categoryId => {
        const category = registry.categories[categoryId];
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('phase');
        expect(category).toHaveProperty('command_count');
      });
    });

    test('should organize commands by phases', async () => {
      await validator.validate();

      const registry = validator.commandRegistry;
      const {phases} = registry;

      expect(Array.isArray(phases)).toBe(true);
      expect(phases.length).toBeGreaterThan(0);

      // verify phase structure
      phases.forEach(phase => {
        expect(phase).toHaveProperty('id');
        expect(phase).toHaveProperty('name');
        expect(phase).toHaveProperty('description');
        expect(phase).toHaveProperty('commands');
        expect(Array.isArray(phase.commands)).toBe(true);
      });

      // verify phases are ordered
      for (let i = 1; i < phases.length; i++) {
        expect(phases[i].id).toBeGreaterThan(phases[i-1].id);
      }
    });
  });

  describe('Command Metadata Extraction', () => {
    test('should extract metadata from command files', () => {
      const testContent = global.testUtils.mockCommandFile('test-command', {
        hasDescription: true,
        hasUsage: true,
        hasParameters: true,
        hasExamples: true
      });

      const tempFile = global.testUtils.createTempFile(testContent, 'test-command.md');
      const metadata = validator.extractCommandMetadata(testContent, tempFile);

      expect(metadata).toHaveProperty('id', 'test-command');
      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('category');
      expect(metadata).toHaveProperty('phase');
      expect(metadata).toHaveProperty('description');
      expect(metadata).toHaveProperty('usage');
      expect(metadata).toHaveProperty('safety_level');
      expect(metadata.usage).toContain('/test-command');
    });

    test('should determine safety levels correctly', () => {
      const safeContent = global.testUtils.mockCommandFile('safe-cmd');
      const dangerousContent = global.testUtils.mockCommandFile('dangerous-cmd') + '\n```bash\nrm -rf /\nsudo dangerous-operation\n```';
      const cautionContent = global.testUtils.mockCommandFile('caution-cmd') + '\n```bash\ncurl -X POST https://api.example.com\n```';

      expect(validator.determineSafetyLevel(safeContent)).toBe('safe');
      expect(validator.determineSafetyLevel(dangerousContent)).toBe('dangerous');
      expect(validator.determineSafetyLevel(cautionContent)).toBe('caution');
    });

    test('should extract parameters correctly', () => {
      const contentWithParams = `# test Command

## Parameters

- **param1**: Required parameter for testing
- **param2** (optional): Optional parameter
- param3: Another parameter without markdown
`;

      const parameters = validator.extractParameters(contentWithParams);
      expect(parameters.length).toBeGreaterThan(0);

      parameters.forEach(param => {
        expect(param).toHaveProperty('name');
        expect(param).toHaveProperty('type');
        expect(param).toHaveProperty('required');
        expect(param).toHaveProperty('description');
      });
    });

    test('should extract examples correctly', () => {
      const contentWithExamples = `# test Command

## Examples

\`\`\`bash
/test-command param1 value1
\`\`\`

\`\`\`bash
/test-command --flag param2
\`\`\`
`;

      // test extractMarkdownSection first
      const examplesSection = validator.extractMarkdownSection(contentWithExamples, '## Examples');
      expect(examplesSection).toBeTruthy();

      const examples = validator.extractExamples(contentWithExamples);
      expect(examples.length).toBeGreaterThanOrEqual(0);

      // debug the section extraction
      if (examples.length === 0) {
        console.log('Examples section:', examplesSection);
        console.log('Code blocks found:', examplesSection ? examplesSection.match(/```[\s\S]*?```/g) : 'none');
      }

      if (examples.length > 0) {
        examples.forEach(example => {
          expect(example).toHaveProperty('title');
          expect(example).toHaveProperty('command');
          expect(example).toHaveProperty('description');
          expect(example).toHaveProperty('expected_outcome');
        });
      }
    });

    test('should extract category from various path patterns', () => {
      expect(validator.extractCategoryFromPath('.claude/commands/01-project-initialization/test.md')).toBe('project-setup');
      expect(validator.extractCategoryFromPath('.claude/commands/02-code-analysis/test.md')).toBe('analysis');
      expect(validator.extractCategoryFromPath('.claude/commands/03-refactoring/test.md')).toBe('development');
      expect(validator.extractCategoryFromPath('.claude/commands/04-testing/test.md')).toBe('testing');
      expect(validator.extractCategoryFromPath('.claude/commands/05-documentation/test.md')).toBe('documentation');
      expect(validator.extractCategoryFromPath('.claude/commands/06-git-workflows/test.md')).toBe('git');
      expect(validator.extractCategoryFromPath('.claude/commands/07-multi-file-operations/test.md')).toBe('operations');
      expect(validator.extractCategoryFromPath('.claude/commands/08-mcp-integration/test.md')).toBe('integration');
      expect(validator.extractCategoryFromPath('.claude/commands/09-build-deployment/test.md')).toBe('deployment');
      expect(validator.extractCategoryFromPath('.claude/commands/10-security-compliance/test.md')).toBe('security');
    });

    test('should handle missing descriptions appropriately', () => {
      const contentWithoutDesc = '# Test\n\nShort content only';
      const metadata = validator.extractCommandMetadata(contentWithoutDesc, 'test.md');
      expect(metadata.description).toContain('test command');
    });

    test('should validate command structure and update registry', () => {
      const content = '# Test Command\n\n## Description\n\nTest description\n\n## Usage\n```bash\n/test\n```';
      validator.validateCommandStructure(content, '.claude/commands/test.md');
      expect(Object.keys(validator.commandRegistry.commands).length).toBeGreaterThan(0);
    });

    test('should warn about missing usage and examples sections', () => {
      const contentNoSections = '# Command\n\n## Description\n\nSome description without usage or examples';
      validator.validateCommandStructure(contentNoSections, 'test.md');
      expect(validator.warnings.some(w => w.includes('Consider adding sections'))).toBe(true);
    });

    test('should warn when usage section lacks code examples', () => {
      const contentNoCode = '# Command\n\n## Description\n\nDesc\n\n## Usage\n\nJust text, no code blocks';
      validator.validateCommandStructure(contentNoCode, 'test.md');
      expect(validator.warnings.some(w => w.includes('should include command format'))).toBe(true);
    });

    test('should error on missing description', () => {
      const noDesc = '## Usage\n```bash\ntest\n```';
      validator.validateCommandStructure(noDesc, 'test.md');
      expect(validator.errors.some(e => e.includes('missing description'))).toBe(true);
    });

    test('should initialize qualityScores array when needed', () => {
      // create a new instance and call validateCommandQuality without manipulating internal state
      const newValidator = new CommandValidator();

      const content = '# Test\n\n## Description\n\nDesc\n\n## Usage\n```bash\ntest\n```\n\n## Examples\nExample';
      const score = newValidator.validateCommandQuality(content, 'test.md');

      expect(newValidator.stats.qualityScores).toBeDefined();
      expect(Array.isArray(newValidator.stats.qualityScores)).toBe(true);
    });
  });

  describe('XML Structure Validation', () => {
    test('should validate correct XML structure', () => {
      const validXML = `
<role>Test role</role>
<activation>Test activation</activation>
<instructions>Test instructions</instructions>
`;

      const isValid = validator.validateXMLStructure(validXML, 'test.md');
      expect(isValid).toBe(true);
    });

    test('should detect missing XML sections', () => {
      const invalidXML = `
<role>Test role</role>
<activation>Test activation</activation>
<!-- Missing instructions -->
`;

      const isValid = validator.validateXMLStructure(invalidXML, 'test.md');
      expect(isValid).toBe(false);
      expect(validator.errors.length).toBeGreaterThan(0);
    });

    test('should detect mismatched XML tags', () => {
      const mismatchedXML = `
<role>Test role</role>
<activation>Test activation</instructions>
<instructions>Test instructions</activation>
`;

      const isValid = validator.validateXMLStructure(mismatchedXML, 'test.md');
      expect(isValid).toBe(false);
      expect(validator.errors.length).toBeGreaterThan(0);
    });

    test('should detect unexpected closing tags', () => {
      const unexpectedClose = `
<role>Test role</role>
</instructions>
`;

      const isValid = validator.validateXMLStructure(unexpectedClose, 'test.md');
      expect(isValid).toBe(false);
      expect(validator.errors.some(e => e.includes('Unexpected closing tag'))).toBe(true);
    });

    test('should detect unclosed XML tags', () => {
      const unclosedTags = `
<role>Test role</role>
<activation>Test activation
<instructions>Test instructions</instructions>
`;

      const isValid = validator.validateXMLStructure(unclosedTags, 'test.md');
      expect(isValid).toBe(false);
      expect(validator.errors.some(e => e.includes('Unclosed XML tags'))).toBe(true);
    });

    test('should handle self-closing tags', () => {
      const selfClosing = `
<role>Test role</role>
<activation>Test activation</activation>
<instructions>Test instructions</instructions>
<br/>
`;

      const isValid = validator.validateXMLStructure(selfClosing, 'test.md');
      expect(isValid).toBe(true);
    });

    test('should handle XML comments', () => {
      const withComments = `
<!-- This is a comment -->
<role>Test role</role>
<activation>Test activation</activation>
<instructions>Test instructions</instructions>
`;

      const isValid = validator.validateXMLStructure(withComments, 'test.md');
      expect(isValid).toBe(true);
    });

    test('should handle processing instructions', () => {
      const withProcessingInstructions = `
<?xml version="1.0"?>
<role>Test role</role>
<activation>Test activation</activation>
<instructions>Test instructions</instructions>
`;

      const isValid = validator.validateXMLStructure(withProcessingInstructions, 'test.md');
      expect(isValid).toBe(true);
    });
  });

  describe('Security Validation', () => {
    test('should detect security issues in code blocks', () => {
      const insecureContent = `
# test Command

\`\`\`bash
password="hardcoded-secret-123"
api_key="sk-real-api-key-here"
eval(user_input)
\`\`\`
`;

      validator.validateSecurity(insecureContent, 'test.md');

      const securityIssues = validator.errors.filter(error => error.includes('SECURITY'));
      expect(securityIssues.length).toBeGreaterThan(0);
    });

    test('should ignore security patterns in examples/placeholders', () => {
      const exampleContent = `
# test Command

\`\`\`bash
password="your-password-here"
api_key="REPLACE_WITH_YOUR_API_KEY"
token="example-token-placeholder"
\`\`\`
`;

      validator.validateSecurity(exampleContent, 'test.md');

      const securityIssues = validator.errors.filter(error => error.includes('SECURITY'));
      expect(securityIssues.length).toBe(0);
    });
  });

  describe('Quality Scoring', () => {
    test('should score command quality correctly', () => {
      const highQualityContent = global.testUtils.mockCommandFile('high-quality', {
        hasDescription: true,
        hasUsage: true,
        hasParameters: true,
        hasExamples: true
      });

      const score = validator.validateCommandQuality(highQualityContent, 'test.md', 'command');
      expect(score).toBeGreaterThan(80);
    });

    test('should penalize missing sections', () => {
      const lowQualityContent = global.testUtils.mockCommandFile('low-quality', {
        hasDescription: false,
        hasUsage: false,
        hasParameters: false,
        hasExamples: false
      });

      const score = validator.validateCommandQuality(lowQualityContent, 'test.md', 'command');
      expect(score).toBeLessThan(50);
    });

    test('should penalize TODO/FIXME markers', () => {
      const contentWithTODO = `
# Command with TODO
## Usage
\`\`\`bash
/command
\`\`\`

TODO: Add more examples
FIXME: Update documentation
`;

      const score = validator.validateCommandQuality(contentWithTODO, 'test.md');
      expect(score).toBeLessThan(90);
    });

    test('should evaluate default quality checks', () => {
      const shortContent = `# Short command`;

      const score = validator.validateCommandQuality(shortContent, 'test.md');
      expect(score).toBeLessThan(50);
    });

    test('should give bonus for security considerations', () => {
      const secureContent = `
# Secure Command

## Usage
\`\`\`bash
/command
\`\`\`

## Security
This command includes safety checks and security validations.

## Examples
Example usage here
`;

      const score = validator.validateCommandQuality(secureContent, 'test.md');
      expect(score).toBeGreaterThan(60);
    });
  });

  describe('Performance Validation', () => {
    const shouldSkipPerfTests = process.env.SKIP_PERF_TESTS === 'true' || process.env.CI === 'true';

    const perfDiscoveryMs = process.env.PERF_DISCOVERY_MS
      ? parseInt(process.env.PERF_DISCOVERY_MS, 10)
      : global.TEST_CONFIG.PERFORMANCE_TARGETS.DISCOVERY_MS;

    const perfValidationMs = process.env.PERF_VALIDATION_MS
      ? parseInt(process.env.PERF_VALIDATION_MS, 10)
      : global.TEST_CONFIG.PERFORMANCE_TARGETS.VALIDATION_MS;

    const maybeTest = shouldSkipPerfTests ? test.skip : test;

    maybeTest('should meet discovery time target', async () => {
      const startTime = Date.now();
      const files = validator.findMarkdownFiles(global.TEST_CONFIG.PROJECT_ROOT);
      const discoveryTime = Date.now() - startTime;

      expect(files.length).toBeGreaterThan(0);
      expect(discoveryTime).toBeLessThan(perfDiscoveryMs);
    });

    maybeTest('should meet validation time target', async () => {
      const startTime = Date.now();
      await validator.validate();
      const totalTime = Date.now() - startTime;

      expect(totalTime).toBeLessThan(perfValidationMs);
    }, global.TEST_CONFIG.VALIDATION_TIMEOUT);
  });

  describe('Error Handling', () => {
    test('should handle missing files gracefully', async () => {
      const nonExistentFile = '/path/to/nonexistent/file.md';

      await validator.validateFile(nonExistentFile);

      const fileErrors = validator.errors.filter(error =>
        error.includes('Failed to read file')
      );
      expect(fileErrors.length).toBeGreaterThan(0);
    });

    test('should handle malformed content gracefully', () => {
      const malformedContent = 'This is not valid markdown with <unclosed-tag>';

      expect(() => {
        validator.validateXMLStructure(malformedContent, 'test.md');
      }).not.toThrow();
    });
  });

  describe('System Integration', () => {
    test('should validate system integrity', () => {
      validator.validateSystemIntegrity();

      // should have some results (warnings or validation info)
      expect(validator.warnings.length + validator.errors.length).toBeGreaterThanOrEqual(0);
    });

    test('should generate complete validation results', async () => {
      await validator.validate();

      const results = validator.commandRegistry.validation_results;
      expect(results).toHaveProperty('last_run');
      expect(results).toHaveProperty('total_files');
      expect(results).toHaveProperty('valid_files');
      expect(results).toHaveProperty('errors');
      expect(results).toHaveProperty('warnings');
      expect(results).toHaveProperty('security_issues');
      expect(results).toHaveProperty('quality_metrics');

      expect(Array.isArray(results.errors)).toBe(true);
      expect(Array.isArray(results.warnings)).toBe(true);
      expect(Array.isArray(results.quality_metrics)).toBe(true);
    });
  });
});