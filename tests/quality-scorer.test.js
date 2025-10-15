/**
 * comprehensive test suite for QualityScorer validator module
 * tests quality scoring logic, prompt type detection, and edge cases
 */

const QualityScorer = require('../scripts/validators/quality-scorer');

describe('QualityScorer Module', () => {
  let qualityScorer;

  beforeEach(() => {
    qualityScorer = new QualityScorer();
  });

  describe('Constructor', () => {
    test('should initialize with default values', () => {
      expect(qualityScorer.qualityIssues).toEqual([]);
      expect(qualityScorer.qualityScore).toBe(100);
    });
  });

  describe('validatePromptQuality', () => {
    describe('Length-based scoring', () => {
      test('should penalize content shorter than 500 characters', () => {
        const shortContent = '# Short\nToo brief content.';
        const result = qualityScorer.validatePromptQuality(shortContent, 'short.md');
        
        expect(result.score).toBe(90); // 100 - 10
        expect(result.issues).toContain('short.md: Content too brief (23 chars)');
      });

      test('should not penalize content 500 characters or longer', () => {
        const longContent = '# Long\nExample content. First step:\n' + 'a'.repeat(500);
        const result = qualityScorer.validatePromptQuality(longContent, 'long.md');

        expect(result.score).toBe(100);
        expect(result.issues).not.toContain(
          expect.stringContaining('Content too brief')
        );
      });

      test('should give bonus points for content over 2000 characters', () => {
        const veryLongContent = '# Very Long\nExample:\n' + 'a'.repeat(2000);
        const result = qualityScorer.validatePromptQuality(veryLongContent, 'verylong.md');

        expect(result.score).toBe(100); // Max capped at 100
      });
    });

    describe('XML section validation', () => {
      test('should penalize brief XML sections', () => {
        const content = `
<role>Role</role>
<activation>Act</activation>
<instructions>Too brief</instructions>
<output_format>Format</output_format>
`;
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.score).toBeLessThan(100);
        expect(result.issues.some(issue => issue.includes('content too brief'))).toBe(true);
      });

      test('should not penalize substantial XML sections', () => {
        const content = `
<role>
This is a comprehensive role description with sufficient detail to meet the minimum requirements for quality assessment.
</role>
<activation>
The system should activate when users request specific functionality that requires this specialized processing capability.
</activation>
<instructions>
Follow these detailed steps:
1. First, analyze the user's request thoroughly
2. Then, identify the appropriate response pattern
3. Finally, execute the response with proper validation

Example: When a user asks for help, activate and respond.
</instructions>
<output_format>
Provide structured output with clear sections and proper formatting for maximum readability.
</output_format>
`;
        const result = qualityScorer.validatePromptQuality(content, 'test.md');

        expect(result.score).toBe(100);
        expect(result.issues).not.toContain(
          expect.stringContaining('content too brief')
        );
      });

      test('should handle content without XML sections gracefully', () => {
        const content = '# Just Markdown\n\nNo XML tags here.';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.score).toBe(85); // 100 - 15 (no examples)
      });
    });

    describe('Examples requirement', () => {
      test('should penalize content without examples', () => {
        const content = '# No Examples\n\nJust content without examples.';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.score).toBe(85); // 100 - 15
        expect(result.issues).toContain('test.md: No examples provided');
      });

      test('should not penalize content with examples', () => {
        const content = '# With Examples\n\nHere is an example:\n\nExample 1: Something';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.issues).not.toContain('test.md: No examples provided');
      });

      test('should recognize "Example" with capital E', () => {
        const content = '# With Examples\n\nExample usage:\nDo something';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.issues).not.toContain('test.md: No examples provided');
      });
    });

    describe('Safety considerations', () => {
      test('should penalize non-utility prompts without safety mentions', () => {
        const content = '# Dangerous Prompt\n\nNo safety mentioned.\n\nExample: Do something dangerous';
        const result = qualityScorer.validatePromptQuality(content, 'test.md', 'general');
        
        expect(result.score).toBe(90); // 100 - 10
        expect(result.issues).toContain('test.md: No safety considerations mentioned');
      });

      test('should not penalize utility prompts without safety mentions', () => {
        const content = '# Utility Function\n\nJust does utility stuff.\n\nExample: Utility usage';
        const result = qualityScorer.validatePromptQuality(content, 'test.md', 'utility');
        
        expect(result.score).toBe(100);
        expect(result.issues).not.toContain(
          expect.stringContaining('No safety considerations mentioned')
        );
      });

      test('should not penalize prompts with safety mentions', () => {
        const content = '# Safe Prompt\n\nSafety is important.\n\nVerify inputs.\n\nExample: Safe usage';
        const result = qualityScorer.validatePromptQuality(content, 'test.md', 'general');
        
        expect(result.score).toBe(100);
        expect(result.issues).not.toContain(
          expect.stringContaining('No safety considerations mentioned')
        );
      });
    });

    describe('Code block requirements', () => {
      test('should penalize non-documentation prompts without code blocks', () => {
        const content = '# No Code\n\nJust text content.\n\nExample: Text example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md', 'general');
        
        expect(result.score).toBe(95); // 100 - 5
        expect(result.issues).toContain('test.md: No code blocks found');
      });

      test('should not penalize documentation without code blocks', () => {
        const content = '# Documentation\n\nJust docs.\n\nExample: Doc example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md', 'documentation');
        
        expect(result.score).toBe(100);
        expect(result.issues).not.toContain(
          expect.stringContaining('No code blocks found')
        );
      });

      test('should not penalize content with triple backtick blocks', () => {
        const content = '# With Code\n\n```javascript\nconsole.log("hello");\n```\n\nExample: Code example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md', 'general');
        
        expect(result.issues).not.toContain(
          expect.stringContaining('No code blocks found')
        );
      });

      test('should not penalize content with indented code blocks', () => {
        const content = '# With Indented Code\n\n    indented code here\n    more code\n\nExample: Indented example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md', 'general');
        
        expect(result.issues).not.toContain(
          expect.stringContaining('No code blocks found')
        );
      });
    });

    describe('Instruction structure', () => {
      test('should penalize content without structured instructions', () => {
        const content = '# Unstructured\n\nJust random content.\n\nExample: Something';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.score).toBe(95); // 100 - 5
        expect(result.issues).toContain('test.md: Instructions lack clear structure');
      });

      test('should not penalize content with step instructions', () => {
        const content = '# With Steps\n\nFirst do this.\nThen do that.\n\nExample: Step example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.issues).not.toContain(
          expect.stringContaining('Instructions lack clear structure')
        );
      });

      test('should not penalize content with should instructions', () => {
        const content = '# With Should\n\nYou should do this.\n\nExample: Should example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.issues).not.toContain(
          expect.stringContaining('Instructions lack clear structure')
        );
      });
    });

    describe('Bonus points', () => {
      test('should give bonus points for Context section', () => {
        const content = '# With Context\n\n## Context\nSome context.\n\nExample: Context example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        // Base score 95 (no structure), bonus 3 = 98
        expect(result.score).toBe(98);
      });

      test('should give bonus points for <context> tag', () => {
        const content = '# With Context Tag\n\n<context>Some context.</context>\n\nExample: Context example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.score).toBe(98);
      });

      test('should give bonus points for Notes section', () => {
        const content = '# With Notes\n\n## Notes\nSome notes.\n\nExample: Notes example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        // Base score 95, bonus 2 = 97
        expect(result.score).toBe(97);
      });

      test('should give bonus points for Important section', () => {
        const content = '# With Important\n\n## Important\nImportant info.\n\nExample: Important example';
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.score).toBe(97);
      });

      test('should cap score at maximum 100', () => {
        const content = `
# Perfect Score

## Context
${'a'.repeat(2000)}

## Important
Important notes.

\`\`\`javascript
console.log("example");
\`\`\`

First step one, then step two.

Example: Perfect example
`;
        const result = qualityScorer.validatePromptQuality(content, 'test.md', 'utility');
        
        expect(result.score).toBe(100);
      });
    });

    describe('Score floor', () => {
      test('should not allow score below 0', () => {
        const content = ''; // Triggers multiple penalties
        const result = qualityScorer.validatePromptQuality(content, 'test.md');
        
        expect(result.score).toBe(0);
      });
    });
  });

  describe('determinePromptType', () => {
    describe('Directory-based detection', () => {
      test('should detect command type from commands directory', () => {
        const type = qualityScorer.determinePromptType(
          '.claude/commands/test-command.md',
          'content'
        );
        expect(type).toBe('command');
      });

      test('should detect security type from security directory', () => {
        const type = qualityScorer.determinePromptType(
          'security/check-security.md',
          'content'
        );
        expect(type).toBe('security');
      });

      test('should detect test type from test directory', () => {
        const type = qualityScorer.determinePromptType(
          'tests/unit-test.md',
          'content'
        );
        expect(type).toBe('testing');
      });

      test('should detect git type from git directory', () => {
        const type = qualityScorer.determinePromptType(
          'git/branch-management.md',
          'content'
        );
        expect(type).toBe('git');
      });

      test('should detect mcp type from mcp directory', () => {
        const type = qualityScorer.determinePromptType(
          'mcp/server-setup.md',
          'content'
        );
        expect(type).toBe('mcp');
      });

      test('should detect documentation type from doc directory', () => {
        const type = qualityScorer.determinePromptType(
          'docs/api-reference.md',
          'content'
        );
        expect(type).toBe('documentation');
      });

      test('should detect deployment type from deploy directory', () => {
        const type = qualityScorer.determinePromptType(
          'deploy/production.md',
          'content'
        );
        expect(type).toBe('deployment');
      });

      test('should detect refactoring type from refactor directory', () => {
        const type = qualityScorer.determinePromptType(
          'refactor/code-cleanup.md',
          'content'
        );
        expect(type).toBe('refactoring');
      });

      test('should detect initialization type from initial directory', () => {
        const type = qualityScorer.determinePromptType(
          'initial/project-setup.md',
          'content'
        );
        expect(type).toBe('initialization');
      });
    });

    describe('Content-based detection', () => {
      test('should detect testing type from content', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/test-file.md',
          'This file contains test suite and testing procedures.'
        );
        expect(type).toBe('testing');
      });

      test('should detect security type from content', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/security-file.md',
          'Security vulnerability assessment and protection measures.'
        );
        expect(type).toBe('security');
      });

      test('should detect git type from content', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/git-file.md',
          'Git repository management and branch operations.'
        );
        expect(type).toBe('git');
      });

      test('should detect mcp type from content', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/mcp-file.md',
          'MCP server configuration and API endpoints.'
        );
        expect(type).toBe('mcp');
      });

      test('should detect documentation type from content', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/doc-file.md',
          'Documentation for README and API references.'
        );
        expect(type).toBe('documentation');
      });

      test('should detect deployment type from content', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/deploy-file.md',
          'Deployment strategies and CI/CD pipeline setup.'
        );
        expect(type).toBe('deployment');
      });

      test('should detect refactoring type from content', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/refactor-file.md',
          'Refactoring and modernize legacy code patterns.'
        );
        expect(type).toBe('refactoring');
      });

      test('should detect initialization type from content', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/init-file.md',
          'Bootstrap and initialize new project structure.'
        );
        expect(type).toBe('initialization');
      });

      test('should default to general type when no patterns match', () => {
        const type = qualityScorer.determinePromptType(
          'unknown/general-file.md',
          'Just some general content without specific patterns.'
        );
        expect(type).toBe('general');
      });
    });

    describe('Priority handling', () => {
      test('should prioritize directory-based detection over content', () => {
        const type = qualityScorer.determinePromptType(
          'commands/test-command.md',
          'This is actually about documentation and README files.'
        );
        expect(type).toBe('command'); // Directory takes precedence
      });
    });
  });

  describe('getScore', () => {
    test('should return current quality score', () => {
      qualityScorer.qualityScore = 85;
      expect(qualityScorer.getScore()).toBe(85);
    });
  });

  describe('getIssues', () => {
    test('should return current quality issues', () => {
      const issues = ['Issue 1', 'Issue 2'];
      qualityScorer.qualityIssues = issues;
      expect(qualityScorer.getIssues()).toEqual(issues);
    });
  });

  describe('Integration scenarios', () => {
    test('should score comprehensive high-quality content', () => {
      const highQualityContent = `
# Comprehensive Command

## Description
This is a detailed command description with comprehensive explanations of functionality, use cases, and implementation details.

## Usage
\`\`\`bash
/command --parameter value --option flag
\`\`\`

## Parameters
- **parameter**: Required parameter with detailed explanation of usage and constraints
- **option**: Optional flag that modifies command behavior in specific ways
- **verbose**: Enable verbose output for debugging and troubleshooting

## Examples
\`\`\`bash
/command --parameter example --verbose
\`\`\`
This demonstrates standard usage with verbose output enabled.

## Context
This command operates within the broader context of system administration and should be used with appropriate permissions.

## Important
Always verify system requirements before execution and ensure proper backup procedures are in place.

## Security Considerations
Input validation is performed on all parameters. The command operates with least privilege principles and includes proper error handling.

## Expected Output
Detailed output showing execution progress, results, and any recommended follow-up actions.
`;

      const result = qualityScorer.validatePromptQuality(highQualityContent, 'comprehensive.md', 'command');
      
      expect(result.score).toBe(100);
      expect(result.issues).toEqual([]);
    });

    test('should score low-quality content appropriately', () => {
      const lowQualityContent = '# Simple\n\nBrief description.';
      
      const result = qualityScorer.validatePromptQuality(lowQualityContent, 'simple.md', 'general');
      
      expect(result.score).toBeLessThan(50);
      expect(result.issues.length).toBeGreaterThan(2);
    });

    test('should handle mixed quality content', () => {
      const mixedContent = `
# Mixed Quality Command

## Description
Adequate description with some detail.

## Usage
\`\`\`bash
/command param
\`\`\`

## Parameters
- param: A parameter
`;
      
      const result = qualityScorer.validatePromptQuality(mixedContent, 'mixed.md', 'command');
      
      expect(result.score).toBeGreaterThan(70);
      expect(result.score).toBeLessThan(100);
    });
  });

  describe('Edge cases', () => {
    test('should handle empty content', () => {
      const result = qualityScorer.validatePromptQuality('', 'empty.md');
      
      expect(result.score).toBe(0);
      expect(result.issues).toContain('empty.md: Content too brief (0 chars)');
    });

    test('should handle content with only whitespace', () => {
      const result = qualityScorer.validatePromptQuality('   \n\n   \t\n   ', 'whitespace.md');
      
      expect(result.score).toBe(0);
      expect(result.issues).toContain('whitespace.md: Content too brief (9 chars)');
    });

    test('should handle very long content', () => {
      const longContent = '# Long\nExample: First step\n' + 'a'.repeat(10000);
      const result = qualityScorer.validatePromptQuality(longContent, 'long.md');

      expect(result.score).toBe(100);
      expect(result.issues).toEqual([]);
    });

    test('should handle content with special characters', () => {
      const specialContent = `# Special Characters\n\nContent with émojis 🎉 and spéciäl chäracters.\n\nExample: Special usage`;
      const result = qualityScorer.validatePromptQuality(specialContent, 'special.md');
      
      expect(result.score).toBe(95); // No structure
    });
  });
});