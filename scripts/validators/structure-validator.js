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
    this.errors = [];
    this.warnings = [];
    // Command files should have specific sections
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

    // Validate usage format
    const usageSectionMatch = content.match(/## Usage([\s\S]*?)(^##\s|\Z)/m);
    if (usageSectionMatch) {
      const usageSection = usageSectionMatch[1];
      if (!usageSection.includes('```')) {
        this.warnings.push(`${filename}: Usage section should include command format example`);
      }
    }
    const usageSectionMatch = content.match(/^\s*##\s*Usage\s*([\s\S]*?)(^\s*##\s|\Z)/im);
    if (usageSectionMatch) {
      const usageSection = usageSectionMatch[1];
      if (!usageSection.includes('```')) {
        this.warnings.push(`${filename}: Usage section should include command format example`);
      }
    }

    return missingSections.length === 0;
  }

  // Extract markdown section by heading
  extractMarkdownSection(content, heading) {
    // Normalize heading by trimming whitespace and converting to lowercase for comparison
    const normalizedHeading = heading.trim().toLowerCase();
    const headingLevel = heading.match(/^#+/)?.[0].length || 2;
    
    // Create a regex that handles variations in whitespace and casing
    const headingPattern = normalizedHeading
      .replace(/^#+\s*/, '') // Remove leading hashes
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special characters
      .split(/\s+/) // Split by whitespace
      .join('\\s+'); // Join with flexible whitespace pattern
    
    // Build regex to match content until next heading at same or higher level
    let nextHeadingPattern = '';
    for (let i = 1; i <= headingLevel; i++) {
      if (i > 1) nextHeadingPattern += '|';
      nextHeadingPattern += `^#{${i}}\\s`;
    }
    
    // Create regex that's case-insensitive and handles flexible whitespace
    const regex = new RegExp(
      `^#{${headingLevel}}\\s+${headingPattern}\\s*\\n([\\s\\S]*?)(?=(${nextHeadingPattern})|\\s*$)`,
      'gmi'
    );
    
    // Find all matches for the section
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1].trim());
    }
    if (matches.length > 1) {
      // Add a warning for duplicate sections
      if (this && this.errors) {
        this.errors.push(`Warning: Multiple sections found for heading "${heading}". Only the first will be used.`);
      } else {
        // fallback: log to console if errors array is not available
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