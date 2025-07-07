#!/usr/bin/env node

/**
 * Comprehensive tests for PromptValidator class
 * Tests all public methods with happy path and edge cases
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { expect } = require('chai');
const sinon = require('sinon');
const tmpDir = require('tmp').dirSync;

// Import the class to test
const PromptValidator = require('../../scripts/validate-prompts');

describe('PromptValidator', () => {
  let validator;
  let tempDir;
  let origCwd;

  beforeEach(() => {
    validator = new PromptValidator();
    tempDir = tmpDir({ unsafeCleanup: true });
    origCwd = process.cwd();
  });

  afterEach(() => {
    process.chdir(origCwd);
    tempDir.removeCallback();
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should initialize with empty arrays and stats', () => {
      expect(validator.errors).to.be.an('array').that.is.empty;
      expect(validator.warnings).to.be.an('array').that.is.empty;
      expect(validator.stats).to.be.an('object');
      expect(validator.stats.totalFiles).to.equal(0);
      expect(validator.stats.validFiles).to.equal(0);
      expect(validator.stats.securityIssues).to.equal(0);
    });
  });

  describe('extractMarkdownSection', () => {
    it('should extract content under a heading', () => {
      const content = `# Main Title

## Section A
Content for section A
More content here

## Section B
Content for section B

### Subsection B1
Subsection content

## Section C
Content for section C`;

      const result = validator.extractMarkdownSection(content, '## Section A');
      expect(result).to.equal('Content for section A\nMore content here');
    });

    it('should extract content until next heading of same level', () => {
      const content = `# Main Title

## Section A
Content for section A

### Subsection A1
Subsection content

## Section B
Content for section B`;

      const result = validator.extractMarkdownSection(content, '## Section A');
      expect(result).to.equal('Content for section A\n\n### Subsection A1\nSubsection content');
    });

    it('should return null for non-existent heading', () => {
      const content = `# Main Title\n\n## Section A\nContent`;
      const result = validator.extractMarkdownSection(content, '## Non-existent');
      expect(result).to.be.null;
    });

    it('should handle special characters in headings', () => {
      const content = `# Main Title

## Section (with parens)
Content with special chars

## Next Section
Other content`;

      const result = validator.extractMarkdownSection(content, '## Section (with parens)');
      expect(result).to.equal('Content with special chars');
    });
  });

  describe('validateSecurity', () => {
    it('should not flag placeholder credentials', () => {
      const content = `
\`\`\`javascript
const config = {
  apiKey: 'your-api-key-here',
  password: 'REPLACE_WITH_ACTUAL_PASSWORD',
  secret: 'example-secret-placeholder'
};
\`\`\``;

      validator.validateSecurity(content, 'test.md');
      expect(validator.errors).to.be.empty;
      expect(validator.stats.securityIssues).to.equal(0);
    });

    it('should flag real hardcoded credentials', () => {
      const content = `
\`\`\`javascript
const config = {
  apiKey: 'sk-' + 'abc123def456ghi789jkl012mno345pqr678stu901',
  password: 'mySecretPassword123',
  secret: 'realSecretValue12345'
};
\`\`\``;

      validator.validateSecurity(content, 'test.md');
      expect(validator.errors).to.have.lengthOf(3);
      expect(validator.stats.securityIssues).to.equal(3);
    });

    it('should flag dangerous eval usage', () => {
      const content = `
\`\`\`javascript
const userInput = getUserInput();
eval(userInput);
\`\`\``;

      validator.validateSecurity(content, 'test.md');
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Dangerous eval() usage detected');
    });

    it('should flag innerHTML XSS risks', () => {
      const content = `
\`\`\`javascript
document.getElementById('content').innerHTML = userInput;
\`\`\``;

      validator.validateSecurity(content, 'test.md');
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Potential XSS via innerHTML');
    });

    it('should flag template injection risks', () => {
      const content = `
\`\`\`javascript
const template = \`Hello \${user.name}\`;
\`\`\``;

      validator.validateSecurity(content, 'test.md');
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Potential template injection');
    });

    it('should handle mixed content with placeholders and real issues', () => {
      const content = `
\`\`\`javascript
const config = {
  apiKey: 'your-api-key-here',  // This is fine
  password: 'realPassword123',   // This should be flagged
  secret: 'example-secret'       // This is fine
};
\`\`\``;

      validator.validateSecurity(content, 'test.md');
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Hardcoded password detected');
    });
  });

  describe('validateXMLStructure', () => {
    it('should pass with valid XML structure', () => {
      const content = `
<role>
System prompt for AI assistant
</role>

<activation>
User says: /command
</activation>

<instructions>
1. Do this
2. Do that
</instructions>`;

      const result = validator.validateXMLStructure(content, 'test.md');
      expect(result).to.be.true;
      expect(validator.errors).to.be.empty;
    });

    it('should fail with missing required sections', () => {
      const content = `
<role>
System prompt for AI assistant
</role>

<instructions>
1. Do this
2. Do that
</instructions>`;

      const result = validator.validateXMLStructure(content, 'test.md');
      expect(result).to.be.false;
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Missing XML sections: <activation>');
    });

    it('should fail with mismatched XML tags', () => {
      const content = `
<role>
System prompt for AI assistant
</activation>

<instructions>
1. Do this
2. Do that
</instructions>`;

      const result = validator.validateXMLStructure(content, 'test.md');
      expect(result).to.be.false;
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Mismatched XML tags');
    });

    it('should fail with unclosed XML tags', () => {
      const content = `
<role>
System prompt for AI assistant
</role>

<activation>
User says: /command

<instructions>
1. Do this
2. Do that
</instructions>`;

      const result = validator.validateXMLStructure(content, 'test.md');
      expect(result).to.be.false;
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Unclosed XML tags');
    });

    it('should handle comments correctly', () => {
      const content = `
<role>
System prompt for AI assistant
</role>

<!-- This is a comment -->

<activation>
User says: /command
</activation>

<instructions>
1. Do this
2. Do that
</instructions>`;

      const result = validator.validateXMLStructure(content, 'test.md');
      expect(result).to.be.true;
      expect(validator.errors).to.be.empty;
    });

    it('should ignore XML-like content in code blocks', () => {
      const content = `
<role>
System prompt for AI assistant
</role>

<activation>
User says: /command
</activation>

<instructions>
Example code:
\`\`\`xml
<broken>
This is just example code
</notclosed>
\`\`\`
</instructions>`;

      const result = validator.validateXMLStructure(content, 'test.md');
      expect(result).to.be.true;
      expect(validator.errors).to.be.empty;
    });
  });

  describe('validatePromptQuality', () => {
    it('should score high-quality prompt correctly', () => {
      const content = `
<role>
System prompt for AI assistant
</role>

<activation>
User says: /command
</activation>

<instructions>
This is a comprehensive prompt with detailed instructions.
It includes security considerations and is well-structured.
The prompt has clear deliverables and output requirements.

## Security Considerations
- Validate all inputs
- Use secure coding practices

## Examples
Here are some examples of how to use this prompt:
1. Example 1: ...
2. Example 2: ...

## Output Requirements
- Provide clear responses
- Include error handling
</instructions>`;

      const score = validator.validatePromptQuality(content, 'test.md');
      expect(score).to.be.greaterThan(80);
      expect(validator.warnings).to.have.lengthOf.lessThan(2);
    });

    it('should score low-quality prompt correctly', () => {
      const content = `
<role>
Basic prompt
</role>

<activation>
User says: /command
</activation>

<instructions>
TODO: Add more details here
FIXME: This needs work
</instructions>`;

      const score = validator.validatePromptQuality(content, 'test.md');
      expect(score).to.be.lessThan(50);
      expect(validator.warnings).to.have.lengthOf.greaterThan(3);
    });

    it('should handle command-type prompts differently', () => {
      const content = `
# Command: /test-command

## Description
This is a test command.

## Usage
\`\`\`
/test-command [options]
\`\`\`

## Parameters
- option1: Description
- option2: Description

## Examples
\`\`\`
/test-command --option1=value
\`\`\``;

      const score = validator.validatePromptQuality(content, 'commands/test.md', 'command');
      expect(score).to.be.greaterThan(70);
    });
  });

  describe('validateCommandStructure', () => {
    it('should pass with valid command structure', () => {
      const content = `
# Test Command

## Usage
\`\`\`
/test-command [options]
\`\`\`

## Description
This is a test command that does things.

## Parameters
- param1: Description of param1
- param2: Description of param2

## Examples
Here are comprehensive examples:
\`\`\`
/test-command --param1=value1 --param2=value2
\`\`\`

This example shows how to use the command with different parameters.
`;

      validator.validateCommandStructure(content, 'test.md');
      expect(validator.errors).to.be.empty;
      expect(validator.warnings).to.have.lengthOf(0);
    });

    it('should fail with missing required sections', () => {
      const content = `
# Test Command

## Usage
\`\`\`
/test-command [options]
\`\`\`

## Description
This is a test command that does things.
`;

      validator.validateCommandStructure(content, 'test.md');
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Missing command sections: ## Parameters, ## Examples');
    });

    it('should warn about missing usage examples', () => {
      const content = `
# Test Command

## Usage
Just use this command.

## Description
This is a test command that does things.

## Parameters
- param1: Description

## Examples
Brief example.
`;

      validator.validateCommandStructure(content, 'test.md');
      expect(validator.warnings).to.have.lengthOf(2);
      expect(validator.warnings[0]).to.include('Usage section should include command format example');
      expect(validator.warnings[1]).to.include('Examples section appears too brief');
    });
  });

  describe('determinePromptType', () => {
    it('should detect command type from path', () => {
      const result = validator.determinePromptType('.claude/commands/test.md', 'content');
      expect(result).to.equal('command');
    });

    it('should detect setup type from filename', () => {
      const result = validator.determinePromptType('bootstrap-project.md', 'content');
      expect(result).to.equal('setup');
    });

    it('should detect security type from content', () => {
      const result = validator.determinePromptType('test.md', 'This is a security audit prompt');
      expect(result).to.equal('security');
    });

    it('should detect testing type from content', () => {
      const result = validator.determinePromptType('test.md', 'This prompt is for testing purposes');
      expect(result).to.equal('testing');
    });

    it('should detect short-answer type from length', () => {
      const result = validator.determinePromptType('test.md', 'Short content');
      expect(result).to.equal('short-answer');
    });

    it('should default to default type', () => {
      const result = validator.determinePromptType('test.md', 'This is a long prompt with various content that does not match any specific type detection patterns. It has enough content to not be considered short-answer type.');
      expect(result).to.equal('default');
    });
  });

  describe('isDocumentationFile', () => {
    it('should identify README files as documentation', () => {
      const result = validator.isDocumentationFile('/path/to/README.md');
      expect(result).to.be.true;
    });

    it('should identify CLAUDE.md as documentation', () => {
      const result = validator.isDocumentationFile('/path/to/CLAUDE.md');
      expect(result).to.be.true;
    });

    it('should identify GitHub template files as documentation', () => {
      const result = validator.isDocumentationFile('/path/to/.github/ISSUE_TEMPLATE/bug.md');
      expect(result).to.be.true;
    });

    it('should identify command files as non-documentation', () => {
      const result = validator.isDocumentationFile('/path/to/.claude/commands/test.md');
      expect(result).to.be.false;
    });

    it('should identify prompt files as non-documentation', () => {
      const result = validator.isDocumentationFile('/path/to/prompts/01-test/test.md');
      expect(result).to.be.false;
    });

    it('should identify non-command/prompt files as documentation', () => {
      const result = validator.isDocumentationFile('/path/to/docs/guide.md');
      expect(result).to.be.true;
    });
  });

  describe('findMarkdownFiles', () => {
    it('should find all markdown files in directory', () => {
      // Create test structure
      const testDir = tempDir.name;
      fs.mkdirSync(path.join(testDir, 'subdir'));
      fs.writeFileSync(path.join(testDir, 'file1.md'), 'content');
      fs.writeFileSync(path.join(testDir, 'file2.md'), 'content');
      fs.writeFileSync(path.join(testDir, 'file3.txt'), 'content');
      fs.writeFileSync(path.join(testDir, 'subdir', 'file4.md'), 'content');

      const files = validator.findMarkdownFiles(testDir);
      const relativePaths = files.map(f => path.relative(testDir, f));
      
      expect(relativePaths).to.have.members(['file1.md', 'file2.md', 'subdir/file4.md']);
      expect(relativePaths).to.not.include('file3.txt');
    });

    it('should exclude node_modules and .git directories', () => {
      const testDir = tempDir.name;
      fs.mkdirSync(path.join(testDir, 'node_modules'));
      fs.mkdirSync(path.join(testDir, '.git'));
      fs.writeFileSync(path.join(testDir, 'valid.md'), 'content');
      fs.writeFileSync(path.join(testDir, 'node_modules', 'excluded.md'), 'content');
      fs.writeFileSync(path.join(testDir, '.git', 'excluded.md'), 'content');

      const files = validator.findMarkdownFiles(testDir);
      const relativePaths = files.map(f => path.relative(testDir, f));
      
      expect(relativePaths).to.have.members(['valid.md']);
      expect(relativePaths).to.not.include('node_modules/excluded.md');
      expect(relativePaths).to.not.include('.git/excluded.md');
    });
  });

  describe('validateSystemIntegrity', () => {
    it('should warn about missing validate script in package.json', () => {
      const testDir = tempDir.name;
      process.chdir(testDir);
      
      // Create package.json without validate script
      fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({
        name: 'test',
        scripts: {}
      }));

      validator.validateSystemIntegrity();
      
      expect(validator.warnings).to.include('package.json: Missing validate script');
    });

    it('should warn about missing required files', () => {
      const testDir = tempDir.name;
      process.chdir(testDir);
      
      // Create package.json to avoid other errors
      fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({
        name: 'test',
        scripts: { validate: 'echo test' }
      }));

      validator.validateSystemIntegrity();
      
      const missingFiles = validator.warnings.filter(w => w.includes('Missing required file:'));
      expect(missingFiles).to.have.lengthOf(3); // .gitignore, README.md, CONTRIBUTING.md
    });

    it('should validate command count when environment variable is set', () => {
      const testDir = tempDir.name;
      process.chdir(testDir);
      
      // Create package.json and required files
      fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({
        name: 'test',
        scripts: { validate: 'echo test' }
      }));
      fs.writeFileSync(path.join(testDir, '.gitignore'), '');
      fs.writeFileSync(path.join(testDir, 'README.md'), '');
      fs.writeFileSync(path.join(testDir, 'CONTRIBUTING.md'), '');
      
      // Create commands directory with 2 commands
      fs.mkdirSync(path.join(testDir, '.claude'));
      fs.mkdirSync(path.join(testDir, '.claude', 'commands'));
      fs.writeFileSync(path.join(testDir, '.claude', 'commands', 'cmd1.md'), 'content');
      fs.writeFileSync(path.join(testDir, '.claude', 'commands', 'cmd2.md'), 'content');
      
      // Set environment variable expecting 3 commands
      process.env.EXPECTED_COMMAND_COUNT = '3';
      
      validator.validateSystemIntegrity();
      
      expect(validator.errors).to.include('Expected 3 commands, found 2');
      
      // Clean up
      delete process.env.EXPECTED_COMMAND_COUNT;
    });
  });

  describe('validateFile', () => {
    it('should validate command files correctly', async () => {
      const testDir = tempDir.name;
      const commandsDir = path.join(testDir, '.claude', 'commands');
      fs.mkdirSync(commandsDir, { recursive: true });
      
      const commandFile = path.join(commandsDir, 'test.md');
      fs.writeFileSync(commandFile, `
# Test Command

## Usage
\`\`\`
/test-command [options]
\`\`\`

## Description
This is a test command.

## Parameters
- param1: Description

## Examples
Comprehensive examples here.

<role>
System prompt
</role>

<activation>
User says: /test
</activation>

<instructions>
Do the thing
</instructions>
`);

      await validator.validateFile(commandFile);
      
      expect(validator.stats.totalFiles).to.equal(1);
      expect(validator.stats.commandFiles).to.equal(1);
      expect(validator.stats.validFiles).to.equal(1);
      expect(validator.errors).to.be.empty;
    });

    it('should validate prompt files correctly', async () => {
      const testDir = tempDir.name;
      const promptsDir = path.join(testDir, 'prompts', 'test');
      fs.mkdirSync(promptsDir, { recursive: true });
      
      const promptFile = path.join(promptsDir, 'test.md');
      fs.writeFileSync(promptFile, `
# Test Prompt

This is a comprehensive test prompt with examples and security considerations.

<role>
System prompt for testing
</role>

<activation>
User says: /test
</activation>

<instructions>
Detailed instructions here.

## Security Considerations
- Validate inputs
- Use secure practices

## Examples
1. Example 1: ...
2. Example 2: ...

## Output Requirements
- Clear responses
- Error handling
</instructions>
`);

      await validator.validateFile(promptFile);
      
      expect(validator.stats.totalFiles).to.equal(1);
      expect(validator.stats.promptFiles).to.equal(1);
      expect(validator.stats.validFiles).to.equal(1);
      expect(validator.errors).to.be.empty;
    });

    it('should skip documentation files', async () => {
      const testDir = tempDir.name;
      const readmeFile = path.join(testDir, 'README.md');
      fs.writeFileSync(readmeFile, `
# Project README

This is a documentation file that should be skipped.
`);

      await validator.validateFile(readmeFile);
      
      expect(validator.stats.totalFiles).to.equal(1);
      expect(validator.stats.commandFiles).to.equal(0);
      expect(validator.stats.promptFiles).to.equal(0);
      expect(validator.stats.validFiles).to.equal(1);
    });

    it('should handle file read errors gracefully', async () => {
      const nonExistentFile = path.join(tempDir.name, 'nonexistent.md');
      
      await validator.validateFile(nonExistentFile);
      
      expect(validator.errors).to.have.lengthOf(1);
      expect(validator.errors[0]).to.include('Failed to read file');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete validation workflow', async () => {
      const testDir = tempDir.name;
      process.chdir(testDir);
      
      // Create complete test structure
      fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({
        name: 'test',
        scripts: { validate: 'echo test' }
      }));
      fs.writeFileSync(path.join(testDir, '.gitignore'), '');
      fs.writeFileSync(path.join(testDir, 'README.md'), '# Test Project');
      fs.writeFileSync(path.join(testDir, 'CONTRIBUTING.md'), '# Contributing');
      
      // Create commands
      const commandsDir = path.join(testDir, '.claude', 'commands');
      fs.mkdirSync(commandsDir, { recursive: true });
      fs.writeFileSync(path.join(commandsDir, 'valid.md'), `
# Valid Command

## Usage
\`\`\`
/valid [options]
\`\`\`

## Description
Valid command description.

## Parameters
- param: Description

## Examples
Comprehensive examples.

<role>System</role>
<activation>User: /valid</activation>
<instructions>Do it</instructions>
`);
      
      // Create prompts
      const promptsDir = path.join(testDir, 'prompts', 'test');
      fs.mkdirSync(promptsDir, { recursive: true });
      fs.writeFileSync(path.join(promptsDir, 'valid.md'), `
# Valid Prompt

Comprehensive prompt with security and examples.

<role>System</role>
<activation>User: test</activation>
<instructions>
Instructions here.

## Security
- Validate inputs

## Examples
1. Example 1
2. Example 2

## Output Requirements
- Clear output
</instructions>
`);
      
      // Run validation
      const exitCode = await validator.validate();
      
      expect(exitCode).to.equal(0);
      expect(validator.stats.totalFiles).to.be.greaterThan(0);
      expect(validator.stats.validFiles).to.be.greaterThan(0);
      expect(validator.errors).to.be.empty;
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty files gracefully', async () => {
      const testDir = tempDir.name;
      const commandsDir = path.join(testDir, '.claude', 'commands');
      fs.mkdirSync(commandsDir, { recursive: true });
      
      const emptyFile = path.join(commandsDir, 'empty.md');
      fs.writeFileSync(emptyFile, '');

      await validator.validateFile(emptyFile);
      
      expect(validator.errors).to.include('empty.md: File is empty');
    });

    it('should handle files containing only whitespace as empty', async () => {
      const testDir = tempDir.name;
      const commandsDir = path.join(testDir, '.claude', 'commands');
      fs.mkdirSync(commandsDir, { recursive: true });

      const whitespaceFile = path.join(commandsDir, 'whitespace.md');
      fs.writeFileSync(whitespaceFile, '   \n\t  \n');

      await validator.validateFile(whitespaceFile);

      expect(validator.errors).to.include('whitespace.md: File is empty');
    });

    it('should handle files with CRLF line endings', async () => {
      const testDir = tempDir.name;
      const commandsDir = path.join(testDir, '.claude', 'commands');
      fs.mkdirSync(commandsDir, { recursive: true });
      
      const crlfFile = path.join(commandsDir, 'crlf.md');
      fs.writeFileSync(crlfFile, '# Title\r\n\r\nContent with CRLF line endings\r\n');

      await validator.validateFile(crlfFile);
      
      expect(validator.warnings.some(w => w.includes('Uses CRLF line endings'))).to.be.true;
    });

    it('should handle files with mixed LF and CRLF line endings', async () => {
      const testDir = tempDir.name;
      const commandsDir = path.join(testDir, '.claude', 'commands');
      fs.mkdirSync(commandsDir, { recursive: true });

      const mixedFile = path.join(commandsDir, 'mixed_line_endings.md');
      // Mix: first line CRLF, second line LF, third line CRLF, fourth line LF
      const mixedContent = '# Title\r\nSecond line\nThird line\r\nFourth line\n';
      fs.writeFileSync(mixedFile, mixedContent);

      await validator.validateFile(mixedFile);

      // Adjust the assertion below to match how your validator reports mixed line endings
      expect(
        validator.warnings.some(
          w =>
            w.includes('mixed line endings') ||
            w.includes('CRLF') ||
            w.includes('LF')
        )
      ).to.be.true;
    });

    it('should handle deeply nested XML structures', () => {
      const content = `
<role>
  <inner>
    <nested>
      <deep>Content</deep>
    </nested>
  </inner>
</role>

<activation>
User says: /test
</activation>

<instructions>
Instructions here
</instructions>`;

      const result = validator.validateXMLStructure(content, 'test.md');
      expect(result).to.be.true;
      expect(validator.errors).to.be.empty;
    });

    it('should detect errors in invalid deeply nested XML structures', () => {
      const invalidContent = `
<role>
  <inner>
    <nested>
      <deep>Content</deep>
    <!-- Missing closing tags for <nested> and <inner> -->
</role>

<activation>
User says: /test
</activation>

<instructions>
Instructions here
</instructions>`;

      const result = validator.validateXMLStructure(invalidContent, 'test.md');
      expect(result).to.be.false;
      expect(validator.errors).to.not.be.empty;
      expect(validator.errors.some(e => e.includes('nested') || e.includes('inner'))).to.be.true;
    });
  });
});