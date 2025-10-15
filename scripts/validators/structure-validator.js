/**
 * structure validation module for prompt files
 * validates XML structure, markdown format, and required sections
 */

class StructureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateXMLStructure(content, filename) {
    this.errors = [];
    this.warnings = [];

    const source = typeof content === 'string' ? content : '';
    // output_format is optional, only role/activation/instructions are required
    const requiredSections = [
      '<role>',
      '<activation>',
      '<instructions>'
    ];

    const missingSections = [];
    requiredSections.forEach(section => {
      if (!source.includes(section)) {
        missingSections.push(section);
      }
    });

    if (missingSections.length > 0) {
      this.errors.push(`${filename}: Missing XML sections: ${missingSections.join(', ')}`);
      return false;
    }

    const contentWithoutCodeBlocks = source
      .replace(/```[\s\S]*?```/g, block => {
        const newlineCount = (block.match(/\n/g) || []).length;
        return '\n'.repeat(newlineCount);
      })
      .replace(/`[^`]*`/g, '');

    const tagStack = [];
    const xmlTagRegex = /<\/?([a-zA-Z][a-zA-Z0-9_-]*)(?:\s[^>]*)?>|<!--[\s\S]*?-->/g;
    let match;
    let lineNumber = 1;
    let lastIndex = 0;

    while ((match = xmlTagRegex.exec(contentWithoutCodeBlocks)) !== null) {
      const segment = contentWithoutCodeBlocks.slice(lastIndex, match.index);
      lineNumber += (segment.match(/\n/g) || []).length;
      const fullTag = match[0];
      const tagName = match[1];
      const tagLineNumber = lineNumber;

      if (fullTag.startsWith('<!--') || fullTag.endsWith('/>') || fullTag.startsWith('<?')) {
        lineNumber += (fullTag.match(/\n/g) || []).length;
        lastIndex = match.index + fullTag.length;
        continue;
      }

      if (fullTag.startsWith('</')) {
        if (tagStack.length === 0) {
          this.errors.push(`${filename}:${tagLineNumber}: Unexpected closing tag: ${fullTag}`);
          return false;
        }

        const expectedTag = tagStack.pop();
        if (expectedTag.name !== tagName) {
          this.errors.push(`${filename}:${tagLineNumber}: Mismatched XML tags - expected </${expectedTag.name}>, found </${tagName}>`);
          return false;
        }
      } else {
        tagStack.push({ name: tagName, line: tagLineNumber });
      }

      lineNumber += (fullTag.match(/\n/g) || []).length;
      lastIndex = match.index + fullTag.length;
    }

    if (tagStack.length > 0) {
      const unclosedTags = tagStack.map(tag => tag.name);
      const firstLine = tagStack[0].line;
      this.errors.push(`${filename}:${firstLine}: Unclosed XML tags: ${unclosedTags.join(', ')}`);
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
      this.errors.push(`${filename}: Missing command sections: ${missingSections.join(', ')}`);
    }

    const usageSectionMatch = content.match(/^\s*##\s*Usage\s*([\s\S]*?)(^\s*##\s|$)/im);
    let isValid = missingSections.length === 0;

    if (usageSectionMatch) {
      const usageSection = usageSectionMatch[1];
      const hasFencedCode = usageSection.includes('```');
      const hasIndentedCode = /^\s{4,}\S/m.test(usageSection);
      const hasCodeBlock = hasFencedCode || hasIndentedCode;
      const hasContent = usageSection.trim().length > 0;

      if (!hasCodeBlock) {
        this.warnings.push(`${filename}: Usage section should include command format example`);
        if (hasContent) {
          isValid = false;
        }
      }
    }

    return isValid;
  }

  extractMarkdownSection(content, heading) {
    if (typeof content !== 'string' || typeof heading !== 'string' || heading.trim() === '') {
      return null;
    }

    const normalizeHeading = value =>
      value
        .trim()
        .replace(/^#+\s*/, '')
        .toLowerCase()
        .replace(/\s+/g, ' ');

    const targetLevel = heading.match(/^#+/)?.[0].length || 2;
    const targetHeading = normalizeHeading(heading);

    const lines = content.split(/\r?\n/);
    const sections = [];
    let collecting = false;
    let buffer = [];

    const flushBuffer = () => {
      if (!collecting) {
        return;
      }
      let sectionContent = buffer.join('\n');
      sectionContent = sectionContent.replace(/^(?:\r?\n)+/, '');
      sectionContent = sectionContent.replace(/(?:\r?\n)+$/, '');
      sections.push(sectionContent);
      collecting = false;
      buffer = [];
    };

    for (const line of lines) {
      const headingMatch = line.match(/^\s*(#+)\s+(.*)$/);
      if (headingMatch) {
        const lineLevel = headingMatch[1].length;
        const normalizedLineHeading = normalizeHeading(line);

        const shouldStop =
          lineLevel <= targetLevel || (targetLevel === 1 && lineLevel > targetLevel);

        if (collecting && shouldStop) {
          flushBuffer();
        }

        if (lineLevel === targetLevel && normalizedLineHeading === targetHeading) {
          flushBuffer();
          collecting = true;
          buffer = [];
          continue;
        }
      }

      if (collecting) {
        buffer.push(line);
      }
    }

    if (collecting) {
      flushBuffer();
    }

    if (sections.length > 1) {
      if (!Array.isArray(this?.warnings)) {
        this.warnings = [];
      }
      this.warnings.push(`Warning: Multiple sections found for heading "${heading}". Only the first will be used.`);
    }

    if (sections.length === 0) {
      return null;
    }

    return sections[0];
  }

  getErrors() {
    return this.errors;
  }

  getWarnings() {
    return this.warnings;
  }
}

module.exports = StructureValidator;
