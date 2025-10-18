/**
 * comprehensive test suite for StructureValidator validator module
 * tests XML structure validation, command structure validation, and markdown section extraction
 */

const StructureValidator = require('../scripts/validators/structure-validator');

describe('StructureValidator Module', () => {
  let structureValidator;

  beforeEach(() => {
    structureValidator = new StructureValidator();
  });

  describe('Constructor', () => {
    test('should initialize with empty errors and warnings arrays', () => {
      expect(structureValidator.errors).toEqual([]);
      expect(structureValidator.warnings).toEqual([]);
    });
  });

  describe('validateXMLStructure', () => {
    describe('Required sections validation', () => {
      test('should pass with all required XML sections', () => {
        const validXML = `
<role>System role description</role>
<activation>Activation criteria</activation>
<instructions>Detailed instructions</instructions>
<output_format>Expected output format</output_format>
`;
        const result = structureValidator.validateXMLStructure(validXML, 'test.md');
        
        expect(result).toBe(true);
        expect(structureValidator.errors).toEqual([]);
      });

      test('should fail when role section is missing', () => {
        const invalidXML = `
<activation>Activation criteria</activation>
<instructions>Detailed instructions</instructions>
<output_format>Expected output format</output_format>
`;
        const result = structureValidator.validateXMLStructure(invalidXML, 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors).toContain(
          'test.md: Missing XML sections: <role>'
        );
      });

      test('should fail when multiple sections are missing', () => {
        const invalidXML = `
<role>System role description</role>
`;
        const result = structureValidator.validateXMLStructure(invalidXML, 'test.md');

        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain(
          'Missing XML sections: <activation>, <instructions>'
        );
      });

      test('should fail when all sections are missing', () => {
        const invalidXML = 'No XML sections at all.';
        const result = structureValidator.validateXMLStructure(invalidXML, 'test.md');

        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain(
          'Missing XML sections: <role>, <activation>, <instructions>'
        );
      });
    });

    describe('XML tag balancing', () => {
      test('should pass with properly nested tags', () => {
        const content = `
<role>
  <nested>Nested content</nested>
  More role content
</role>
<activation>Simple activation</activation>
<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });

      test('should fail with unclosed tags', () => {
        const content = `
<role>Unclosed role
<activation>Activation</activation>
<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain('Unclosed XML tags: role');
      });

      test('should fail with multiple unclosed tags', () => {
        const content = `
<role>Unclosed role
<activation>Unclosed activation
<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain('Unclosed XML tags: role, activation');
      });

      test('should fail with mismatched closing tags', () => {
        const content = `
<role>Role content</instructions>
<activation>Activation</activation>
<instructions>Instructions</role>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain('Mismatched XML tags');
      });

      test('should fail with unexpected closing tag', () => {
        const content = `
<role>Role</role>
<activation>Activation</activation>
<instructions>Instructions</instructions>
<output_format>Format</output_format>
</unexpected>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain('Unexpected closing tag: </unexpected>');
      });

      test('should handle self-closing tags correctly', () => {
        const content = `
<role>Role with <self-closing-tag/> content</role>
<activation>Activation</activation>
<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });

      test('should handle XML comments correctly', () => {
        const content = `
<!-- This is a comment -->
<role>Role content</role>
<activation>Activation</activation>
<!-- Another comment -->
<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });

      test('should handle XML declaration correctly', () => {
        const content = `
<?xml version="1.0" encoding="UTF-8"?>
<role>Role content</role>
<activation>Activation</activation>
<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });
    });

    describe('Code block exclusion', () => {
      test('should ignore XML-like content in code blocks', () => {
        const content = `
<role>Real role</role>
<activation>Real activation</activation>

\`\`\`xml
<fake>Content in code block</fake>
<unclosed>
</activation> <!-- This should be ignored -->
\`\`\`

<instructions>Real instructions</instructions>
<output_format>Real format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });

      test('should ignore inline code', () => {
        const content = `
<role>Role with \`<fake>\` inline code</role>
<activation>Activation</activation>
<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });

      test('should handle code blocks with XML syntax', () => {
        const content = `
<role>Real role</role>
<activation>Real activation</activation>

\`\`\`html
<div class="example">
  <p>This is valid HTML in a code block</p>
  <span>Unclosed span
</div>
\`\`\`

<instructions>Real instructions</instructions>
<output_format>Real format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });
    });

    describe('Edge cases', () => {
      test('should handle empty content', () => {
        const result = structureValidator.validateXMLStructure('', 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain('Missing XML sections');
      });

      test('should handle content with only whitespace', () => {
        const result = structureValidator.validateXMLStructure('   \n\n   ', 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain('Missing XML sections');
      });

      test('should handle nested tags with same name', () => {
        const content = `
<role>
  <role>Nested role (unusual but valid)</role>
  Outer role
</role>
<activation>Activation</activation>
<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });

      test('should handle special characters in tag names', () => {
        const content = `
<role>Role</role>
<activation>Activation</activation>
<instructions>Instructions</instructions>
<output_format>Format</output_format>
<custom_tag>Valid tag with underscore</custom_tag>
`;
        const result = structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(result).toBe(true);
      });
    });

    describe('Line number tracking', () => {
      test('should report correct line numbers for errors', () => {
        const content = `<role>Role</role>
<activation>Activation</activation>

Line 4: <unclosed>
Line 5: More content

<instructions>Instructions</instructions>
<output_format>Format</output_format>
`;
        structureValidator.validateXMLStructure(content, 'test.md');
        
        expect(structureValidator.errors[0]).toContain('test.md:4: Unclosed XML tags');
      });
    });
  });

  describe('validateCommandStructure', () => {
    describe('Required sections validation', () => {
      test('should pass with all required command sections', () => {
        const validCommand = `
# Test Command

## Description
This is a test command.

## Usage
\`\`\`bash
/test-command --option value
\`\`\`

## Parameters
- **option**: Test parameter

## Examples
\`\`\`bash
/test-command --example
\`\`\`
Example usage.
`;
        const result = structureValidator.validateCommandStructure(validCommand, 'test.md');
        
        expect(result).toBe(true);
        expect(structureValidator.errors).toEqual([]);
      });

      test('should fail when Description section is missing', () => {
        const invalidCommand = `
# Test Command

## Usage
\`\`\`bash
/test-command
\`\`\`

## Parameters
- **param**: Test parameter

## Examples
Example usage.
`;
        const result = structureValidator.validateCommandStructure(invalidCommand, 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors).toContain(
          'test.md: Missing command sections: ## Description'
        );
      });

      test('should fail when multiple sections are missing', () => {
        const invalidCommand = `
# Test Command

## Description
Just description.
`;
        const result = structureValidator.validateCommandStructure(invalidCommand, 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain(
          'Missing command sections: ## Usage, ## Parameters, ## Examples'
        );
      });
    });

    describe('Usage section validation', () => {
      test('should warn when Usage section has no code blocks', () => {
        const content = `
# Test Command

## Description
Test description.

## Usage
Just text without code block.

## Parameters
- **param**: Test parameter

## Examples
\`\`\`bash
/test-command
\`\`\`
`;
        const result = structureValidator.validateCommandStructure(content, 'test.md');
        
        expect(result).toBe(false); // Still fails validation but has warning
        expect(structureValidator.warnings).toContain(
          'test.md: Usage section should include command format example'
        );
      });

      test('should not warn when Usage section has triple backtick blocks', () => {
        const content = `
# Test Command

## Description
Test description.

## Usage
\`\`\`bash
/test-command --option
\`\`\`

## Parameters
- **param**: Test parameter

## Examples
Example usage.
`;
        const result = structureValidator.validateCommandStructure(content, 'test.md');
        
        expect(structureValidator.warnings).not.toContain(
          expect.stringContaining('Usage section should include command format example')
        );
      });

      test('should not warn when Usage section has indented code blocks', () => {
        const content = `
# Test Command

## Description
Test description.

## Usage
    /test-command --option

## Parameters
- **param**: Test parameter

## Examples
Example usage.
`;
        const result = structureValidator.validateCommandStructure(content, 'test.md');
        
        expect(structureValidator.warnings).not.toContain(
          expect.stringContaining('Usage section should include command format example')
        );
      });
    });

    describe('Edge cases', () => {
      test('should handle empty content', () => {
        const result = structureValidator.validateCommandStructure('', 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain('Missing command sections');
      });

      test('should handle content with only headings', () => {
        const content = `
# Test

## Description
## Usage
## Parameters
## Examples
`;
        const result = structureValidator.validateCommandStructure(content, 'test.md');
        
        expect(result).toBe(true);
        expect(structureValidator.warnings).toContain(
          'test.md: Usage section should include command format example'
        );
      });

      test('should handle case sensitivity in headings', () => {
        const content = `
# Test Command

## DESCRIPTION
This has uppercase description.

## USAGE
\`\`\`bash
/test-command
\`\`\`

## PARAMETERS
- **param**: Test parameter

## EXAMPLES
Example usage.
`;
        const result = structureValidator.validateCommandStructure(content, 'test.md');
        
        expect(result).toBe(false);
        expect(structureValidator.errors[0]).toContain('Missing command sections');
      });
    });
  });

  describe('extractMarkdownSection', () => {
    describe('Basic extraction', () => {
      test('should extract section content correctly', () => {
        const content = `
# Document

## Section 1
Content of section 1.
Line 2 of section 1.

## Section 2
Content of section 2.

## Section 3
Content of section 3.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Section 1');
        
        expect(result).toBe('Content of section 1.\nLine 2 of section 1.');
      });

      test('should extract section with heading level 1', () => {
        const content = `
# Title

# Section 1
Content of section 1.

## Section 2
Content of section 2.
`;
        const result = structureValidator.extractMarkdownSection(content, '# Section 1');
        
        expect(result).toBe('Content of section 1.');
      });

      test('should extract section with heading level 3', () => {
        const content = `
# Title

## Section 1
Content of section 1.

### Subsection
Content of subsection.
`;
        const result = structureValidator.extractMarkdownSection(content, '### Subsection');
        
        expect(result).toBe('Content of subsection.');
      });

      test('should return null when section not found', () => {
        const content = `
# Title

## Section 1
Content.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Missing Section');
        
        expect(result).toBeNull();
      });
    });

    describe('Section boundaries', () => {
      test('should stop at next heading of same level', () => {
        const content = `
## Section 1
Content of section 1.
Still section 1.

## Section 2
Content of section 2.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Section 1');
        
        expect(result).toBe('Content of section 1.\nStill section 1.');
        expect(result).not.toContain('Content of section 2');
      });

      test('should include lower-level headings in section', () => {
        const content = `
## Section 1
Content of section 1.

### Subsection
Content of subsection.

## Section 2
Content of section 2.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Section 1');
        
        expect(result).toContain('Content of section 1.');
        expect(result).toContain('### Subsection');
        expect(result).toContain('Content of subsection.');
        expect(result).not.toContain('Content of section 2');
      });

      test('should stop at end of document', () => {
        const content = `
## Section 1
Content of section 1.
Last line.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Section 1');
        
        expect(result).toBe('Content of section 1.\nLast line.');
      });

      test('should handle sections at beginning of document', () => {
        const content = `## Section 1
Content of section 1.

## Section 2
Content of section 2.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Section 1');
        
        expect(result).toBe('Content of section 1.');
      });
    });

    describe('Multiple matches', () => {
      const multipleMatchContent = `
## Section 1
First instance.

## Other Section
Other content.

## Section 1
Second instance.
`;
      test('should return first section when multiple matches exist', () => {
        const result = structureValidator.extractMarkdownSection(multipleMatchContent, '## Section 1');

        expect(result).toBe('First instance.');
        expect(structureValidator.warnings).toContain(
          'Warning: Multiple sections found for heading "## Section 1". Only the first will be used.'
        );
      });

      test('should not warn for multiple matches when errors array not available', () => {
        // call extractMarkdownSection without context
        const result = StructureValidator.prototype.extractMarkdownSection.call(
          { errors: null },
          multipleMatchContent,
          '## Section 1'
        );
        
        expect(result).toBe('First instance.');
      });
    });

    describe('Pattern normalization', () => {
      test('should handle extra spaces in heading', () => {
        const content = `
##   Section   With   Extra   Spaces   
Content of section.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Section With Extra Spaces');
        
        expect(result).toBe('Content of section.');
      });

      test('should handle special characters in heading', () => {
        const content = `
## Section with Special Characters: @#$%^&*()
Content of section.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Section with Special Characters: @#$%^&*()');
        
        expect(result).toBe('Content of section.');
      });

      test('should handle case sensitivity', () => {
        const content = `
## SECTION TITLE (UPPERCASE)
Content of section.
`;
        const result = structureValidator.extractMarkdownSection(content, '## section title (uppercase)');
        
        expect(result).toBe('Content of section.');
      });
    });

    describe('Edge cases', () => {
      test('should handle empty content', () => {
        const result = structureValidator.extractMarkdownSection('', '## Section');
        
        expect(result).toBeNull();
      });

      test('should handle content with no headings', () => {
        const content = 'Just plain text.\nNo headings here.';
        const result = structureValidator.extractMarkdownSection(content, '## Section');
        
        expect(result).toBeNull();
      });

      test('should handle section with only heading', () => {
        const content = `
## Empty Section

## Next Section
Content.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Empty Section');
        
        expect(result).toBe('');
      });

      test('should preserve whitespace in section', () => {
        const content = `
## Code Section

\`\`\`javascript
console.log("Hello");
\`\`\`

Some text.

    Indented text.
`;
        const result = structureValidator.extractMarkdownSection(content, '## Code Section');
        
        expect(result).toContain('console.log("Hello");');
        expect(result).toContain('    Indented text.');
      });
    });
  });

  describe('getErrors and getWarnings', () => {
    test('should return current errors', () => {
      structureValidator.errors = ['Error 1', 'Error 2'];
      expect(structureValidator.getErrors()).toEqual(['Error 1', 'Error 2']);
    });

    test('should return current warnings', () => {
      structureValidator.warnings = ['Warning 1', 'Warning 2'];
      expect(structureValidator.getWarnings()).toEqual(['Warning 1', 'Warning 2']);
    });

    test('should return empty arrays when no errors/warnings', () => {
      structureValidator.errors = [];
      structureValidator.warnings = [];
      expect(structureValidator.getErrors()).toEqual([]);
      expect(structureValidator.getWarnings()).toEqual([]);
    });
  });

  describe('Integration scenarios', () => {
    test('should validate complete command document', () => {
      const command = `
# Backup Command

## Description
Creates backups of important files and directories.

## Usage
\`\`\`bash
/backup --source /path/to/source --destination /path/to/backup
\`\`\`

## Parameters
- **source**: Source directory to backup (required)
- **destination**: Backup destination path (required)
- **exclude**: Comma-separated list of patterns to exclude (optional)
- **compress**: Compress backup (default: true)

## Examples
\`\`\`bash
# Basic backup
/backup --source /home/user/documents --destination /backups/docs

# With exclusions
/backup --source /project --destination /backups/project --exclude "node_modules,.git"
\`\`\`

## Notes
- Requires sufficient disk space
- Backup process preserves file permissions
`;
        const result = structureValidator.validateCommandStructure(command, 'backup.md');
        
        expect(result).toBe(true);
        expect(structureValidator.errors).toEqual([]);
        expect(structureValidator.warnings).toEqual([]);
    });

    test('should validate complete prompt document', () => {
      const prompt = `
# Code Review Assistant

<role>
You are an expert code reviewer with deep knowledge of software architecture, best practices, and common pitfalls.
</role>

<activation>
When users request code review, analysis of code quality, or suggestions for improvement.
</activation>

<instructions>
1. First, understand the context and purpose of the code
2. Review for bugs, security issues, and performance problems
3. Suggest improvements for readability and maintainability
4. Provide specific, actionable feedback with examples
5. Consider edge cases and error handling
</instructions>

<output_format>
Provide structured feedback with:
- Summary of findings
- Specific issues with line numbers
- Code suggestions (when applicable)
- Priority levels (critical/high/medium/low)
</output_format>
`;
        const result = structureValidator.validateXMLStructure(prompt, 'code-review.md');
        
        expect(result).toBe(true);
        expect(structureValidator.errors).toEqual([]);
        expect(structureValidator.warnings).toEqual([]);
    });

    test('should extract sections from complex document', () => {
      const content = `
# Complex Document

## Overview
This is a complex document with multiple sections.

## Configuration
### Database Settings
Host: localhost
Port: 5432

### API Settings
Timeout: 30 seconds
Retry count: 3

## Deployment
Instructions for deployment.

## Troubleshooting
Common issues and solutions.
`;
        
        const overview = structureValidator.extractMarkdownSection(content, '## Overview');
        const config = structureValidator.extractMarkdownSection(content, '## Configuration');
        const deploy = structureValidator.extractMarkdownSection(content, '## Deployment');
        
        expect(overview).toBe('This is a complex document with multiple sections.');
        expect(config).toContain('Database Settings');
        expect(config).toContain('API Settings');
        expect(deploy).toBe('Instructions for deployment.');
    });
  });
});
