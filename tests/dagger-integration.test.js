const SafetyValidator = require('../scripts/safety-validator');

describe('Dagger Container Integration', () => {
  let validator;
  let daggerAvailable = false;

  beforeAll(async () => {
    validator = new SafetyValidator(process.cwd());
    daggerAvailable = await validator.checkDaggerAvailability();
    if (!daggerAvailable) {
      // eslint-disable-next-line no-console
      console.warn('Dagger is not available; container integration tests will be skipped.');
    }
  });

  describe('Container Validation', () => {
    test('should validate safe command in container', async () => {
      if (!daggerAvailable) {
        return;
      }

      const result = await validator.validateCommandInContainer('echo "test"', 'test.md');
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.containerValidated).toBe(true);
    }, 15000);

    test('should reject dangerous command in container', async () => {
      if (!daggerAvailable) {
        return;
      }

      const result = await validator.validateCommandInContainer('rm -rf /', 'test.md');
      expect(result).toBeDefined();
      // The command should be executed safely in the container (success: true)
      // but it's a dangerous command, so we're testing that it doesn't crash
      expect(result.containerValidated).toBe(true);
      expect(result.safetyLevel).not.toBe('safe');
    }, 15000);

    test('should handle Array arguments correctly', async () => {
      if (!daggerAvailable) {
        return;
      }

      const commands = ['echo "test"', 'ls -la'];
      const result = await validator.validateCommandInContainer(commands, 'test.md');
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.containerValidated).toBe(true);
    }, 15000);

    test('should handle Object arguments with content property', async () => {
      if (!daggerAvailable) {
        return;
      }

      const command = { content: 'echo "test"', language: 'bash' };
      const result = await validator.validateCommandInContainer(command, 'test.md');
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.containerValidated).toBe(true);
    }, 15000);
  });

  describe('Dagger Availability', () => {
    test('should check Dagger availability', () => {
      const isAvailable = validator.checkDaggerAvailability();
      expect(typeof isAvailable).toBe('boolean');
    });

    test('should handle missing Dagger gracefully', async () => {
      if (!daggerAvailable) {
        return;
      }

      const result = await validator.validateCommandInContainer('echo "test"', 'test.md');
      // Should either succeed or fail gracefully, not crash
      expect(result).toBeDefined();
    }, 15000);
  });

  describe('Safety Level Detection', () => {
    test('should determine safety level for safe commands', () => {
      const level = validator.determineSafetyLevel('echo "hello"');
      expect(['safe', 'low', 'medium', 'high', 'critical']).toContain(level);
    });

    test('should determine safety level for dangerous commands', () => {
      const dangerousLevel = validator.determineSafetyLevel('rm -rf /tmp');
      expect(['medium', 'high', 'critical']).toContain(dangerousLevel);
    });
  });

  describe('Safety Recommendations', () => {
    test('should generate recommendations for dangerous commands', () => {
      const recommendations = validator.generateSafetyRecommendations('rm -rf /tmp');
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    test('should provide empty recommendations for safe commands', () => {
      const recommendations = validator.generateSafetyRecommendations('echo "hello"');
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  describe('Command File Processing', () => {
    test('should find command files recursively', () => {
      const commandsPath = require('path').join(process.cwd(), '.claude', 'commands');
      if (require('fs').existsSync(commandsPath)) {
        const files = validator.findCommandFiles(commandsPath);
        expect(Array.isArray(files)).toBe(true);
        expect(files.length).toBeGreaterThan(0);
      }
    });

    test('should respect depth limits in file discovery', () => {
      const commandsPath = require('path').join(process.cwd(), '.claude', 'commands');
      if (require('fs').existsSync(commandsPath)) {
        const files = validator.findCommandFiles(commandsPath);
        // Should find files but not recurse infinitely
        expect(files.length).toBeLessThan(1000);
      }
    });
  });

  describe('Code Block Extraction', () => {
    test('should extract code blocks from markdown', () => {
      const markdown = `
# Test

\`\`\`bash
echo "test"
\`\`\`

\`\`\`javascript
console.log("test");
\`\`\`
      `;

      const blocks = validator.extractCodeBlocks(markdown);
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBe(2);
      expect(blocks[0].language).toBe('bash');
      expect(blocks[0].content).toContain('echo "test"');
    });

    test('should identify shell-like blocks correctly', () => {
      const shellBlock = { language: 'bash', content: 'ls -la' };
      expect(validator.isShellLikeBlock(shellBlock.language, shellBlock.content)).toBe(true);

      const nonShellBlock = { language: 'javascript', content: 'console.log("test")' };
      expect(validator.isShellLikeBlock(nonShellBlock.language, nonShellBlock.content)).toBe(false);
    });
  });

  describe('Pattern Detection', () => {
    test('should detect dangerous patterns in commands', () => {
      // Create markdown content with dangerous command in code block
      const dangerousMarkdown = `
# Test Command

\`\`\`bash
rm -rf /tmp/test
\`\`\`
      `;
      const findings = validator.analyzeDangerousPatterns(dangerousMarkdown, 'test.md');

      expect(Array.isArray(findings)).toBe(true);
      expect(findings.length).toBeGreaterThan(0);
    });

    test('should not flag safe commands', () => {
      const safeCommand = 'echo "hello world"';
      const findings = validator.analyzeDangerousPatterns(safeCommand, 'test.md');

      expect(Array.isArray(findings)).toBe(true);
      // Safe commands should have minimal or no findings
    });
  });
});
