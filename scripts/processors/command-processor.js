const fs = require('fs');
const path = require('path');

/**
 * Command Processor Module
 * Handles individual command file processing and validation
 */
class CommandProcessor {
  constructor(projectRoot, logger) {
    this.projectRoot = projectRoot;
    this.logger = logger;
  }

  /**
   * Process a single command file
   * @param {string} filePath - Path to command file
   * @returns {Object} Processing result with metadata and validation status
   */
  processSingleCommand(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filename = path.relative(this.projectRoot, filePath);
      const relativePath = path.relative(process.cwd(), filePath);
      const isCommand = relativePath.includes('.claude/commands/');

      return {
        filePath,
        filename,
        relativePath,
        isCommand,
        content,
        valid: true,
        errors: [],
        warnings: []
      };
    } catch (error) {
      return {
        filePath,
        valid: false,
        errors: [`Failed to read file: ${error.message}`],
        warnings: []
      };
    }
  }

  /**
   * Process multiple command files
   * @param {Array<string>} files - Array of file paths to process
   * @returns {Array<Object>} Array of processing results
   */
  processCommands(files) {
    return files.map(file => this.processSingleCommand(file));
  }

  /**
   * Extract command metadata from content
   * @param {string} content - File content
   * @param {string} filename - File name
   * @returns {Object} Command metadata
   */
  extractMetadata(content, filename) {
    const metadata = {
      id: filename.replace(/\.md$/, ''),
      filename,
      title: this.extractTitle(content),
      description: this.extractDescription(content),
      phase: this.extractPhase(filename),
      category: this.extractCategory(filename),
      parameters: this.extractParameters(content),
      examples: this.extractExamples(content)
    };

    return metadata;
  }

  /**
   * Extract title from content
   * @param {string} content - File content
   * @returns {string} Extracted title
   */
  extractTitle(content) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  /**
   * Extract a markdown section by heading name
   * @param {string} content - File content
   * @param {string} heading - Section heading name
   * @returns {string} Section content or empty string
   */
  getSection(content, heading) {
    const sectionRegex = new RegExp(
      `##\\s+${heading}\\s*\\n([\\s\\S]+?)(?=\\n##|$)`,
      'i'
    );
    const match = content.match(sectionRegex);
    return match ? match[1].trim() : '';
  }

  /**
   * Extract description from content
   * @param {string} content - File content
   * @returns {string} Extracted description
   */
  extractDescription(content) {
    return this.getSection(content, 'Description');
  }

  /**
   * Extract phase from filename
   * @param {string} filename - File name
   * @returns {number} Phase number
   */
  extractPhase(filename) {
    const phaseMatch = filename.match(/(\d+)-/);
    return phaseMatch ? parseInt(phaseMatch[1]) : 0;
  }

  /**
   * Extract category from filename
   * @param {string} filename - File name
   * @returns {string} Category name
   */
  extractCategory(filename) {
    const pathParts = filename.split(path.sep);
    if (pathParts.length > 1) {
      return pathParts[pathParts.length - 2];
    }
    return 'general';
  }

  /**
   * Extract parameters from content
   * @param {string} content - File content
   * @returns {Array} Array of parameters
   */
  extractParameters(content) {
    const section = this.getSection(content, 'Parameters');
    if (!section) return [];

    const params = [];
    const lines = section.split('\n');
    for (const line of lines) {
      const paramMatch = line.match(/^\*\s*\**([^*]+)\*\*:\s*(.+)$/);
      if (paramMatch) {
        params.push({
          name: paramMatch[1],
          description: paramMatch[2]
        });
      }
    }

    return params;
  }

  /**
   * Extract examples from content
   * @param {string} content - File content
   * @returns {Array} Array of examples
   */
  extractExamples(content) {
    const section = this.getSection(content, 'Examples');
    if (!section) return [];

    const examples = [];
    const codeBlocks = section.match(/```[\s\S]*?```/g) || [];

    for (const block of codeBlocks) {
      examples.push({
        code: block.replace(/```\w*\n?/g, '').trim()
      });
    }

    return examples;
  }
}

module.exports = CommandProcessor;
