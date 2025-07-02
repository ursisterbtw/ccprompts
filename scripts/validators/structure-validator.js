/**
 * Structure validation module for prompt files
 * Validates XML structure, markdown format, and required sections
 */

class StructureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  // Validate XML structure
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
      this.errors.push(`${filename}: Missing XML sections: ${missingSections.join(', ')}`);
      return false;
    }

    // Remove code blocks and inline code to avoid false positives with XML-like content in examples
    const contentWithoutCodeBlocks = content
      .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
      .replace(/`[^`]*`/g, '');        // Remove inline code
    
    // Enhanced stack-based XML tag validation
    const tagStack = [];
    const xmlTagRegex = /<\/?([a-zA-Z][a-zA-Z0-9_-]*)(?:\s[^>]*)?>|<!--[\s\S]*?-->/g;
    let match;
    let lineNumber = 1;
    let lastIndex = 0;
    
    while ((match = xmlTagRegex.exec(contentWithoutCodeBlocks)) !== null) {
      // Calculate line number for better error reporting
      const currentLineNum = content.substring(lastIndex, match.index).split('\n').length - 1 + lineNumber;
      lastIndex = match.index;
      
      const fullTag = match[0];
      const tagName = match[1];
      
      // Skip comments and self-closing tags
      if (fullTag.startsWith('<!--') || fullTag.endsWith('/>') || fullTag.startsWith('<?')) {
        continue;
      }
      
      // Closing tag
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
      } 
      // Opening tag
      else {
        tagStack.push(tagName);
      }
    }

    // Check for unclosed tags
    if (tagStack.length > 0) {
      this.errors.push(`${filename}: Unclosed XML tags: ${tagStack.join(', ')}`);
      return false;
    }

    return true;
  }

  // Validate command structure
  validateCommandStructure(content, filename) {
    // Command files should have specific sections
    const requiredCommandSections = [
      '## Description',
      '## Usage',
      '## Examples'
    ];

    const missingSections = requiredCommandSections.filter(section => 
      !content.includes(section)
    );

    if (missingSections.length > 0) {
      this.errors.push(`${filename}: Missing command sections: ${missingSections.join(', ')}`);
    }

    // Validate usage format
    if (content.includes('## Usage') && !content.includes('```')) {
      this.warnings.push(`${filename}: Usage section should include command format example`);
    }

    return missingSections.length === 0;
  }

  // Extract markdown section by heading
  extractMarkdownSection(content, heading) {
    // Try to match section with content until next heading of same or higher level
    const headingLevel = heading.match(/^#+/)?.[0].length || 2;
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Build regex to match content until next heading at same or higher level
    let nextHeadingPattern = '';
    for (let i = 1; i <= headingLevel; i++) {
      if (i > 1) nextHeadingPattern += '|';
      nextHeadingPattern += `^#{${i}}\\s`;
    }
    
    const regex = new RegExp(
      `${escapedHeading}\\s*\\n([\\s\\S]*?)(?=(${nextHeadingPattern})|\\s*$)`,
      'gm'
    );
    
    const match = regex.exec(content);
    return match ? match[1].trim() : null;
  }

  getErrors() {
    return this.errors;
  }

  getWarnings() {
    return this.warnings;
  }
}

module.exports = StructureValidator;