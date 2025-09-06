/**
 * Structure validation module for prompt files
 * Validates XML structure, markdown format, and required sections
 */

class StructureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateXMLStructure(content, filename) {
    this.errors = [];
    this.warnings = [];

    const requiredSections = [
      '<role>',
      '<activation>',
      '<instructions>',
      '<output_format>'
    ];

    const missingSections = [];
    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        missingSections.push(section);
      }
    });

    if (missingSections.length > 0) {
      this.errors.push(`${filename}: Missing XML sections: ` + missingSections.join(', '));
      return false;
    }

    const contentWithoutCodeBlocks = content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '');

    const tagStack = [];
    const xmlTagRegex = /<\/?([a-zA-Z][a-zA-Z0-9_-]*)(?:\s[^>]*)?>|<!--[\s\S]*?-->/g;
    let match;
    let lineNumber = 1;
    let lastIndex = 0;

    while ((match = xmlTagRegex.exec(contentWithoutCodeBlocks)) !== null) {
      const currentLineNum = content.substring(lastIndex, match.index).split('\n').length - 1 + lineNumber;
      lastIndex = match.index;

      const fullTag = match[0];
      const tagName = match[1];

      if (fullTag.startsWith('<!--') || fullTag.endsWith('/>') || fullTag.startsWith('<?')) {
        continue;
      }

      if (fullTag.startsWith('</')) {
        if (tagStack.length === 0) {
          this.errors.push(`${filename}:${currentLineNum}: Unexpected closing tag: ${fullTag}`);
          return false;
        }

        const expectedTag = tagStack.pop();
        if (expectedTag !== tagName) {
          this.errors.push(`${filename}:${currentLineNum}: Mismatched XML tags - expected </${expectedTag}>, found </${tagName}>`);
          return false;
        }
      } else {
        tagStack.push(tagName);
      }
    }

    if (tagStack.length > 0) {
      this.errors.push(`${filename}: Unclosed XML tags: ` + tagStack.join(', '));
      return false;
    }

    return true;
  }

  validateCommandStructure(content, filename) {
    this.errors = [];
    this.warnings = [];

    const requiredCommandSections = [
      '## Description',
      '## Usage',
      '## Parameters',
      '## Examples'
    ];

    const missingSections = requiredCommandSections.filter(section =>
      !content.includes(section)
    );

    if (missingSections.length > 0) {
      this.errors.push(`${filename}: Missing command sections: ` + missingSections.join(', '));
    }

    const usageSectionMatch = content.match(/^\s*##\s*Usage\s*([\s\S]*?)(^\s*##\s|$)/im);
    if (usageSectionMatch) {
      const usageSection = usageSectionMatch[1];
      if (!usageSection.includes('```')) {
        this.warnings.push(`${filename}: Usage section should include command format example`);
      }
    }

    return missingSections.length === 0;
  }

  extractMarkdownSection(content, heading) {
    const normalizedHeading = heading.trim().toLowerCase();
    const headingLevel = heading.match(/^#+/)?.[0].length || 2;

    const headingPattern = normalizedHeading
      .replace(/^#+\s*/, '')
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .split(/\s+/)
      .join('\\s+');

    let nextHeadingPattern = '';
    for (let i = 1; i <= headingLevel; i++) {
      if (i > 1) {
        nextHeadingPattern += '|';
      }
      nextHeadingPattern += `^#{${i}}\\s`;
    }

    const regex = new RegExp(
      `^#{${headingLevel}}\\s+${headingPattern}\\s*\\n([\\s\\S]*?)(?=(${nextHeadingPattern})|\\s*$)`,
      'gmi'
    );

    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1].trim());
    }
    if (matches.length > 1) {
      if (this && this.errors) {
        this.errors.push(`Warning: Multiple sections found for heading "${heading}". Only the first will be used.`);
      } else {
        console.warn(`Warning: Multiple sections found for heading "${heading}". Only the first will be used.`);
      }
    }
    return matches.length > 0 ? matches[0] : null;
  }

  getErrors() {
    return this.errors;
  }

  getWarnings() {
    return this.warnings;
  }
}

module.exports = StructureValidator;
