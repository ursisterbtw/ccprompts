#!/usr/bin/env node

/**
 * Comprehensive validation script for ccprompts ecosystem
 * Validates XML structure, prompt quality, command consistency, and security
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
  cyan: '\x1b[36m',
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
      promptFiles: 0,
      securityIssues: 0,
      qualityScores: 0
    };
  }

  // Enhanced security scanning
  validateSecurity(content, filename) {
    // Only scan actual code, not examples or placeholders
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    const combinedCode = codeBlocks.join('\n');
    
    const securityPatterns = [
      { 
        pattern: /password\s*=\s*["'][^"']{8,}["']/gi, 
        message: 'Hardcoded password detected',
        skipIfIncludes: ['example', 'placeholder', 'your-', 'REPLACE_WITH']
      },
      { 
        pattern: /api[_-]?key\s*=\s*["'][^"']{16,}["']/gi, 
        message: 'Hardcoded API key detected',
        skipIfIncludes: ['example', 'placeholder', 'your-', 'REPLACE_WITH']
      },
      { 
        pattern: /secret\s*=\s*["'][^"']{8,}["']/gi, 
        message: 'Hardcoded secret detected',
        skipIfIncludes: ['example', 'placeholder', 'your-', 'REPLACE_WITH']
      },
      { 
        pattern: /token\s*=\s*["'][^"']{16,}["']/gi, 
        message: 'Hardcoded token detected',
        skipIfIncludes: ['example', 'placeholder', 'your-', 'REPLACE_WITH']
      },
      { pattern: /eval\s*\(/gi, message: 'Dangerous eval() usage detected' },
      { pattern: /innerHTML\s*=/gi, message: 'Potential XSS via innerHTML' },
      { pattern: /\$\{[^}]*user[^}]*\}/gi, message: 'Potential template injection' }
    ];

    securityPatterns.forEach(({ pattern, message, skipIfIncludes }) => {
      const matches = combinedCode.match(pattern) || [];
      
      matches.forEach(match => {
        // Skip if it's clearly a placeholder or example
        if (skipIfIncludes && skipIfIncludes.some(skip => match.toLowerCase().includes(skip))) {
          return;
        }
        
        this.errors.push(`${filename}: SECURITY - ${message}`);
        this.stats.securityIssues++;
      });
    });
  }

  // Enhanced XML structure validation with better error reporting
  validateXMLStructure(content, filename) {
    const requiredSections = ['<role>', '<activation>', '<instructions>'];
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

  // Enhanced prompt quality validation with scoring
  validatePromptQuality(content, filename, promptType = null) {
    const detectedType = promptType || this.determinePromptType(filename, content);
    let qualityScore = 100;
    
    const qualityChecks = {
      default: [
        {
          name: 'Minimum content length',
          test: c => c.length > 500,
          weight: 15,
          message: 'Content too short - prompts should be comprehensive'
        },
        {
          name: 'Has examples section',
          test: c => c.toLowerCase().includes('example'),
          weight: 20,
          message: 'Missing examples - prompts should include usage examples'
        },
        {
          name: 'Has clear instructions',
          test: c => c.includes('<instructions>') && c.includes('</instructions>'),
          weight: 25,
          message: 'Missing or malformed instructions section'
        },
        {
          name: 'Security considerations',
          test: c => c.toLowerCase().includes('security') || c.toLowerCase().includes('safety'),
          weight: 15,
          message: 'Missing security considerations'
        },
        {
          name: 'Has output requirements',
          test: c => c.includes('output_requirements') || c.includes('deliverables'),
          weight: 10,
          message: 'Missing output requirements'
        },
        {
          name: 'Professional language',
          test: c => !/(TODO|FIXME|XXX|HACK)/i.test(c),
          weight: 10,
          message: 'Contains TODO/FIXME markers'
        }
      ],
      'command': [
        {
          name: 'Has usage section',
          test: c => c.includes('## Usage'),
          weight: 25,
          message: 'Missing Usage section'
        },
        {
          name: 'Has description section',
          test: c => c.includes('## Description'),
          weight: 20,
          message: 'Missing Description section'
        },
        {
          name: 'Has parameters section',
          test: c => c.includes('## Parameters'),
          weight: 20,
          message: 'Missing Parameters section'
        },
        {
          name: 'Has examples section',
          test: c => c.includes('## Examples'),
          weight: 25,
          message: 'Missing Examples section'
        },
        {
          name: 'Professional formatting',
          test: c => !/(TODO|FIXME|XXX|HACK)/i.test(c),
          weight: 10,
          message: 'Contains TODO/FIXME markers'
        }
      ]
    };

    const checks = qualityChecks[detectedType] || qualityChecks['default'];

    checks.forEach(check => {
      if (!check.test(content)) {
        qualityScore -= check.weight;
        this.warnings.push(`${filename} [${detectedType}]: ${check.message} (-${check.weight} points)`);
      }
    });

    // Aggregate quality scores
    if (!this.stats.qualityScores) {
      this.stats.qualityScores = [];
    }
    this.stats.qualityScores.push(qualityScore);
    
    return qualityScore;
  }

  // Enhanced command structure validation
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
    if (content.includes('## Usage') && !content.includes('```')) {
      this.warnings.push(`${filename}: Usage section should include command format example`);
    }

    // Validate examples are comprehensive
    if (content.includes('## Examples')) {
      const examplesSection = content.split('## Examples')[1];
      if (examplesSection && examplesSection.length < 200) {
        this.warnings.push(`${filename}: Examples section appears too brief`);
      }
    }
  }

  // Determine prompt type with better heuristics
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
    if (content.toLowerCase().includes('test') || content.toLowerCase().includes('testing')) {
      return 'testing';
    }
    if (content.length < 300) {
      return 'short-answer';
    }
    return 'default';
  }

  // Process individual file with enhanced validation
  async validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filename = path.relative(process.cwd(), filePath);
      
      this.stats.totalFiles++;

      // Determine file type
      const isCommand = filePath.includes('.claude/commands/');
      const isPrompt = filePath.includes('prompts/');

      // Security validation for all files
      this.validateSecurity(content, filename);

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

      // Check for consistent line endings
      if (content.includes('\r\n')) {
        this.warnings.push(`${filename}: Uses CRLF line endings (should be LF)`);
      }

      this.stats.validFiles++;
      
    } catch (error) {
      this.errors.push(`${filePath}: Failed to read file - ${error.message}`);
    }
  }

  // Find all markdown files with exclusions
  findMarkdownFiles(directory) {
    const files = [];
    const excludePatterns = ['.git', 'node_modules', '.vscode', '.idea', 'dist', 'build'];
    
    function traverse(dir) {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        if (excludePatterns.some(pattern => item === pattern)) {
          return;
        }
        
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (item.endsWith('.md')) {
          files.push(fullPath);
        }
      });
    }
    
    traverse(directory);
    return files;
  }

  // Enhanced validation with performance tracking
  async validate() {
    const startTime = Date.now();
    log('blue', '🧪 Starting comprehensive ccprompts validation...\n');

    const projectRoot = process.cwd();
    const markdownFiles = this.findMarkdownFiles(projectRoot);

    log('blue', `Found ${markdownFiles.length} markdown files to validate\n`);

    // Validate each file
    for (const file of markdownFiles) {
      await this.validateFile(file);
    }

    // Additional system-level validations
    this.validateSystemIntegrity();

    // Report results
    const duration = Date.now() - startTime;
    this.reportResults(duration);
    
    // Return exit code based on errors
    return this.errors.length === 0 ? 0 : 1;
  }

  // System integrity validation
  validateSystemIntegrity() {
    try {
      // Check package.json structure
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (!packageJson.scripts || !packageJson.scripts.validate) {
        this.warnings.push('package.json: Missing validate script');
      }

      // Check for required configuration files
      const requiredFiles = ['.gitignore', 'README.md', 'CONTRIBUTING.md'];
      requiredFiles.forEach(file => {
        if (!fs.existsSync(file)) {
          this.warnings.push(`Missing required file: ${file}`);
        }
      });

      // Validate command count matches documentation
      const commandDir = path.join(process.cwd(), '.claude', 'commands');
      const expectedCommandCount = process.env.EXPECTED_COMMAND_COUNT
        ? parseInt(process.env.EXPECTED_COMMAND_COUNT, 10)
        : null;

      if (fs.existsSync(commandDir)) {
        const commandFiles = fs.readdirSync(commandDir).filter(f => f.endsWith('.md')).length;
        if (expectedCommandCount !== null) {
          if (commandFiles !== expectedCommandCount) {
            this.errors.push(`Expected ${expectedCommandCount} commands, found ${commandFiles}`);
          }
        } else {
          this.warnings.push(
            `EXPECTED_COMMAND_COUNT not set; skipping strict command count validation (found ${commandFiles} commands)`
          );
        }
      } else {
        this.errors.push('Commands directory (.claude/commands) not found');
      }

    } catch (error) {
      this.warnings.push(`System integrity check failed: ${error.message}`);
    }
  }

  // Enhanced reporting with metrics
  reportResults(duration) {
    log('blue', '\n📊 Validation Results');
    log('blue', '==================');
    
    log('green', `✅ Total files processed: ${this.stats.totalFiles}`);
    log('green', `✅ Command files: ${this.stats.commandFiles}`);
    log('green', `✅ Prompt files: ${this.stats.promptFiles}`);
    log('green', `✅ Valid files: ${this.stats.validFiles}`);
    log('cyan', `⏱️  Validation completed in ${duration}ms`);

    if (this.stats.securityIssues > 0) {
      log('red', `🛡️  Security issues found: ${this.stats.securityIssues}`);
    } else {
      log('green', '🛡️  No security issues detected');
    }

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

    // Generate enhanced metrics
    log('blue', '\n📈 Quality Metrics:');
    const successRate = ((this.stats.validFiles / this.stats.totalFiles) * 100).toFixed(1);
    const errorRate = ((this.errors.length / this.stats.totalFiles) * 100).toFixed(1);
    const warningRate = ((this.warnings.length / this.stats.totalFiles) * 100).toFixed(1);
    
    log('cyan', `   Success rate: ${successRate}%`);
    log('cyan', `   Error rate: ${errorRate}%`);
    log('cyan', `   Warning rate: ${warningRate}%`);
    log('cyan', `   Security score: ${this.stats.securityIssues === 0 ? '100%' : 'FAIL'}`);
    
    // Quality grade (normalized by file count)
    const errorPenalty = Math.min(50, (this.errors.length / Math.max(1, this.stats.totalFiles)) * 100);
    const warningPenalty = Math.min(30, (this.warnings.length / Math.max(1, this.stats.totalFiles)) * 50);
    const overallScore = Math.max(0, 100 - errorPenalty - warningPenalty);
    let grade = 'F';
    if (overallScore >= 90) grade = 'A';
    else if (overallScore >= 80) grade = 'B';
    else if (overallScore >= 70) grade = 'C';
    else if (overallScore >= 60) grade = 'D';
    
    log('cyan', `   Overall quality grade: ${grade} (${overallScore.toFixed(1)}/100)`);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new PromptValidator();
  validator.validate().then(exitCode => {
    process.exit(exitCode);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = PromptValidator;