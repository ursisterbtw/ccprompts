#!/usr/bin/env node

/**
 * Comprehensive validation script for ccprompts ecosystem
 * Validates XML structure, prompt quality, and command consistency
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color output for better readability
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

class PromptValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalFiles: 0,
      validFiles: 0,
      commandFiles: 0,
      promptFiles: 0
    };
  }

  // Validate XML structure in markdown files using stack-based parsing
  validateXMLStructure(content, filename) {
    const xmlSections = ['<role>', '<activation>', '<instructions>'];
    const missingSections = [];

    xmlSections.forEach(section => {
      if (!content.includes(section)) {
        missingSections.push(section);
      }
    });

    if (missingSections.length > 0) {
      this.errors.push(`${filename}: Missing XML sections: ${missingSections.join(', ')}`);
      return false;
    }

    // Stack-based XML tag validation for proper nesting
    const tagStack = [];
    const xmlTagRegex = /<\/?([a-zA-Z][a-zA-Z0-9_-]*)(?:\s[^>]*)?>|<!--[\s\S]*?-->/g;
    let match;
    
    while ((match = xmlTagRegex.exec(content)) !== null) {
      const fullTag = match[0];
      const tagName = match[1];
      
      // Skip comments
      if (fullTag.startsWith('<!--')) {
        continue;
      }
      
      // Self-closing tag or processing instruction
      if (fullTag.endsWith('/>') || fullTag.startsWith('<?')) {
        continue;
      }
      
      // Closing tag
      if (fullTag.startsWith('</')) {
        if (tagStack.length === 0) {
          this.errors.push(`${filename}: Unexpected closing tag: ${fullTag}`);
          return false;
        }
        
        const expectedTag = tagStack.pop();
        if (expectedTag !== tagName) {
          this.errors.push(`${filename}: Mismatched XML tags - expected </${expectedTag}>, found </${tagName}>`);
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

  // Determine prompt type based on filename and content
  determinePromptType(filename, content) {
    if (filename.includes('commands/')) {
      return 'command';
    }
    if (filename.includes('bootstrap') || filename.includes('setup')) {
      return 'setup';
    }
    if (content.toLowerCase().includes('security') || content.toLowerCase().includes('audit')) {
      return 'security';
    }
    if (content.length < 300) {
      return 'short-answer';
    }
    return 'default';
  }

  // Validate prompt quality and structure with configurable checks
  validatePromptQuality(content, filename, promptType = null) {
    const detectedType = promptType || this.determinePromptType(filename, content);
    
    const allQualityChecks = {
      default: [
        {
          name: 'Minimum content length',
          test: c => c.length > 500,
          message: 'Content too short - prompts should be comprehensive'
        },
        {
          name: 'Has examples section',
          test: c => c.toLowerCase().includes('example'),
          message: 'Missing examples - prompts should include usage examples'
        },
        {
          name: 'Has clear instructions',
          test: c => c.includes('<instructions>') && c.includes('</instructions>'),
          message: 'Missing or malformed instructions section'
        },
        {
          name: 'Security considerations',
          test: c => c.toLowerCase().includes('security') || c.toLowerCase().includes('safety'),
          message: 'Missing security considerations'
        }
      ],
      'short-answer': [
        {
          name: 'Minimum content length',
          test: c => c.length > 200,
          message: 'Content too short for short-answer prompt'
        },
        {
          name: 'Has clear instructions',
          test: c => c.includes('<instructions>') && c.includes('</instructions>'),
          message: 'Missing or malformed instructions section'
        }
      ],
      'command': [
        {
          name: 'Adequate command length',
          test: c => c.length > 300,
          message: 'Command documentation too brief'
        },
        {
          name: 'Has usage examples',
          test: c => c.toLowerCase().includes('usage') || c.toLowerCase().includes('example'),
          message: 'Missing usage examples for command'
        }
      ],
      'security': [
        {
          name: 'Comprehensive security content',
          test: c => c.length > 800,
          message: 'Security prompts should be comprehensive'
        },
        {
          name: 'Security-focused instructions',
          test: c => c.includes('<instructions>') && c.includes('</instructions>'),
          message: 'Missing or malformed instructions section'
        },
        {
          name: 'Compliance considerations',
          test: c => c.toLowerCase().includes('compliance') || c.toLowerCase().includes('audit') || c.toLowerCase().includes('security'),
          message: 'Security prompts should include compliance considerations'
        }
      ],
      'setup': [
        {
          name: 'Setup content length',
          test: c => c.length > 400,
          message: 'Setup prompts should provide detailed guidance'
        },
        {
          name: 'Step-by-step instructions',
          test: c => c.toLowerCase().includes('step') || c.toLowerCase().includes('install') || c.toLowerCase().includes('setup'),
          message: 'Setup prompts should include step-by-step instructions'
        }
      ]
    };

    const checks = allQualityChecks[detectedType] || allQualityChecks['default'];

    checks.forEach(check => {
      if (!check.test(content)) {
        this.warnings.push(`${filename} [${detectedType}]: ${check.message}`);
      }
    });
  }

  // Validate command consistency
  validateCommandStructure(content, filename) {
    const requiredSections = [
      '## Usage',
      '## Description',
      '## Parameters',
      '## Examples'
    ];

    const missingSections = requiredSections.filter(section => 
      !content.includes(section)
    );

    if (missingSections.length > 0) {
      this.errors.push(`${filename}: Missing command sections: ${missingSections.join(', ')}`);
    }

    // Validate usage format
    if (content.includes('## Usage') && !content.includes('```\n/')) {
      this.warnings.push(`${filename}: Usage section should include command format example`);
    }
  }

  // Process individual file
  async validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filename = path.relative(process.cwd(), filePath);
      
      this.stats.totalFiles++;

      // Determine file type
      const isCommand = filePath.includes('.claude/commands/');
      const isPrompt = filePath.includes('prompts/');

      if (isCommand) {
        this.stats.commandFiles++;
        this.validateCommandStructure(content, filename);
      }

      if (isPrompt) {
        this.stats.promptFiles++;
        this.validateXMLStructure(content, filename);
        this.validatePromptQuality(content, filename);
      }

      // Common validations for all markdown files
      if (content.trim().length === 0) {
        this.errors.push(`${filename}: File is empty`);
        return;
      }

      if (!content.includes('# ')) {
        this.warnings.push(`${filename}: No main heading found`);
      }

      this.stats.validFiles++;
      
    } catch (error) {
      this.errors.push(`${filePath}: Failed to read file - ${error.message}`);
    }
  }

  // Find all markdown files
  findMarkdownFiles(directory) {
    const files = [];
    
    function traverse(dir) {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.git') && item !== 'node_modules') {
          traverse(fullPath);
        } else if (item.endsWith('.md')) {
          files.push(fullPath);
        }
      });
    }
    
    traverse(directory);
    return files;
  }

  // Run all validations
  async validate() {
    log('blue', '🧪 Starting ccprompts validation...\n');

    const projectRoot = process.cwd();
    const markdownFiles = this.findMarkdownFiles(projectRoot);

    log('blue', `Found ${markdownFiles.length} markdown files to validate\n`);

    // Validate each file
    for (const file of markdownFiles) {
      await this.validateFile(file);
    }

    // Report results
    this.reportResults();
    
    // Return exit code
    return this.errors.length === 0 ? 0 : 1;
  }

  // Generate validation report
  reportResults() {
    log('blue', '\n📊 Validation Results');
    log('blue', '==================');
    
    log('green', `✅ Total files processed: ${this.stats.totalFiles}`);
    log('green', `✅ Command files: ${this.stats.commandFiles}`);
    log('green', `✅ Prompt files: ${this.stats.promptFiles}`);
    log('green', `✅ Valid files: ${this.stats.validFiles}`);

    if (this.warnings.length > 0) {
      log('yellow', `\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => log('yellow', `   ${warning}`));
    }

    if (this.errors.length > 0) {
      log('red', `\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach(error => log('red', `   ${error}`));
      log('red', `\n💥 Validation failed with ${this.errors.length} errors`);
    } else {
      log('green', '\n🎉 All validations passed!');
    }

    // Generate metrics
    log('blue', '\n📈 Quality Metrics:');
    const successRate = ((this.stats.validFiles / this.stats.totalFiles) * 100).toFixed(1);
    log('blue', `   Success rate: ${successRate}%`);
    log('blue', `   Error rate: ${((this.errors.length / this.stats.totalFiles) * 100).toFixed(1)}%`);
    log('blue', `   Warning rate: ${((this.warnings.length / this.stats.totalFiles) * 100).toFixed(1)}%`);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new PromptValidator();
  validator.validate().then(exitCode => {
    process.exit(exitCode);
  });
}

module.exports = PromptValidator;