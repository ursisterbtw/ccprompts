#!/usr/bin/env node

/**
 * Command Validator for CI Pipeline
 * Validates all 38 commands in the ccprompts ecosystem
 */

const fs = require('fs');
const path = require('path');

class CommandValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      passed: true,
      commands: {},
      summary: {
        total: 0,
        valid: 0,
        invalid: 0,
        warnings: 0
      },
      issues: [],
      recommendations: []
    };
    
    this.requiredSections = [
      'role',
      'activation', 
      'instructions',
      'output-format'
    ];
    
    this.ensureReportsDir();
  }

  ensureReportsDir() {
    const reportsDir = path.join(process.cwd(), 'ci', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
  }

  /**
   * Discover all command files
   */
  discoverCommands() {
    console.log('🔍 Discovering command files...');
    
    const commandsDir = path.join('.claude', 'commands');
    const commands = [];
    
    if (!fs.existsSync(commandsDir)) {
      this.results.passed = false;
      this.results.issues.push({
        type: 'critical',
        message: 'Commands directory not found',
        path: commandsDir
      });
      return commands;
    }
    
    const scanDirectory = (dir, category = '') => {
      const entries = fs.readdirSync(dir);
      
      entries.forEach(entry => {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath, entry);
        } else if (entry.endsWith('.md')) {
          const commandName = entry.replace('.md', '');
          commands.push({
            name: commandName,
            category: category || 'root',
            path: fullPath,
            relativePath: path.relative(process.cwd(), fullPath)
          });
        }
      });
    };
    
    scanDirectory(commandsDir);
    
    console.log(`  Found ${commands.length} command files`);
    return commands;
  }

  /**
   * Validate XML structure in command files
   */
  validateXMLStructure(content, commandPath) {
    const issues = [];
    
    // Check for required XML sections
    this.requiredSections.forEach(section => {
      const openTag = `<${section}>`;
      const closeTag = `</${section}>`;
      
      if (!content.includes(openTag) || !content.includes(closeTag)) {
        issues.push({
          type: 'error',
          section,
          message: `Missing required section: ${section}`,
          path: commandPath
        });
      } else {
        // Check for proper nesting
        const openIndex = content.indexOf(openTag);
        const closeIndex = content.indexOf(closeTag);
        
        if (openIndex >= closeIndex) {
          issues.push({
            type: 'error',
            section,
            message: `Malformed XML: ${section} tags not properly nested`,
            path: commandPath
          });
        }
      }
    });
    
    // Check for common XML issues
    const xmlPatterns = [
      { pattern: /<\w+>.*?<\/\w+>/gs, name: 'basic XML structure' },
      { pattern: /&lt;|&gt;|&amp;/g, name: 'HTML entity encoding' }
    ];
    
    xmlPatterns.forEach(({ pattern, name }) => {
      if (!pattern.test(content)) {
        issues.push({
          type: 'warning',
          message: `Potential issue with ${name}`,
          path: commandPath
        });
      }
    });
    
    return issues;
  }

  /**
   * Validate command content quality
   */
  validateContentQuality(content, commandInfo) {
    const issues = [];
    
    // Check content length (should be substantial)
    if (content.length < 500) {
      issues.push({
        type: 'warning',
        message: 'Command content seems too short (< 500 chars)',
        path: commandInfo.path,
        actual: content.length
      });
    }
    
    // Check for activation patterns
    const activationSection = this.extractSection(content, 'activation');
    if (activationSection) {
      const hasSlashCommand = activationSection.includes('/') || activationSection.includes('command');
      if (!hasSlashCommand) {
        issues.push({
          type: 'warning',
          message: 'Activation section may be missing slash command pattern',
          path: commandInfo.path
        });
      }
    }
    
    // Check instructions section depth
    const instructionsSection = this.extractSection(content, 'instructions');
    if (instructionsSection) {
      const wordCount = instructionsSection.split(/\s+/).length;
      if (wordCount < 50) {
        issues.push({
          type: 'warning',
          message: `Instructions section seems brief (${wordCount} words)`,
          path: commandInfo.path
        });
      }
      
      // Check for step-by-step structure
      const hasSteps = /\d+\.|\-|\*/.test(instructionsSection);
      if (!hasSteps) {
        issues.push({
          type: 'info',
          message: 'Consider adding step-by-step structure to instructions',
          path: commandInfo.path
        });
      }
    }
    
    // Check output format section
    const outputSection = this.extractSection(content, 'output-format');
    if (outputSection) {
      const hasSpecificFormat = /markdown|json|yaml|table|list/i.test(outputSection);
      if (!hasSpecificFormat) {
        issues.push({
          type: 'info',
          message: 'Consider specifying explicit output format (markdown, JSON, etc.)',
          path: commandInfo.path
        });
      }
    }
    
    return issues;
  }

  /**
   * Extract content between XML tags
   */
  extractSection(content, sectionName) {
    const openTag = `<${sectionName}>`;
    const closeTag = `</${sectionName}>`;
    
    const startIndex = content.indexOf(openTag);
    const endIndex = content.indexOf(closeTag);
    
    if (startIndex === -1 || endIndex === -1) return null;
    
    return content.substring(
      startIndex + openTag.length,
      endIndex
    ).trim();
  }

  /**
   * Validate command metadata and categorization
   */
  validateMetadata(commandInfo, content) {
    const issues = [];
    
    // Validate category mapping
    const expectedCategories = [
      'category-commands',
      'workflow-commands', 
      'context-aware-commands',
      'utility-commands',
      'lifecycle-commands',
      'learning-commands',
      'specialized-commands'
    ];
    
    if (commandInfo.category === 'root') {
      // Root level commands should be specialized
      if (!['git', 'mcp'].includes(commandInfo.name)) {
        issues.push({
          type: 'warning',
          message: 'Root-level command detected - consider categorizing',
          path: commandInfo.path
        });
      }
    }
    
    // Check for proper command naming
    if (commandInfo.name.includes('_') || commandInfo.name.includes(' ')) {
      issues.push({
        type: 'warning',
        message: 'Command name contains underscores or spaces - prefer hyphens',
        path: commandInfo.path
      });
    }
    
    // Validate role section matches command purpose
    const roleSection = this.extractSection(content, 'role');
    if (roleSection) {
      const isContextAware = roleSection.toLowerCase().includes('context') || 
                            roleSection.toLowerCase().includes('intelligent') ||
                            roleSection.toLowerCase().includes('adaptive');
      
      if (commandInfo.category === 'context-aware-commands' && !isContextAware) {
        issues.push({
          type: 'warning',
          message: 'Context-aware command may need context/intelligence in role description',
          path: commandInfo.path
        });
      }
    }
    
    return issues;
  }

  /**
   * Validate a single command file
   */
  async validateCommand(commandInfo) {
    console.log(`  Validating: ${commandInfo.name}`);
    
    const validation = {
      name: commandInfo.name,
      category: commandInfo.category,
      path: commandInfo.relativePath,
      valid: true,
      issues: [],
      metadata: {
        size: 0,
        sections: {},
        wordCount: 0
      }
    };
    
    try {
      // Read command file
      const content = fs.readFileSync(commandInfo.path, 'utf8');
      validation.metadata.size = content.length;
      validation.metadata.wordCount = content.split(/\s+/).length;
      
      // Validate XML structure
      const xmlIssues = this.validateXMLStructure(content, commandInfo.path);
      validation.issues.push(...xmlIssues);
      
      // Validate content quality
      const contentIssues = this.validateContentQuality(content, commandInfo);
      validation.issues.push(...contentIssues);
      
      // Validate metadata
      const metadataIssues = this.validateMetadata(commandInfo, content);
      validation.issues.push(...metadataIssues);
      
      // Extract section metadata
      this.requiredSections.forEach(section => {
        const sectionContent = this.extractSection(content, section);
        validation.metadata.sections[section] = {
          present: !!sectionContent,
          length: sectionContent ? sectionContent.length : 0,
          wordCount: sectionContent ? sectionContent.split(/\s+/).length : 0
        };
      });
      
      // Determine if command is valid
      const errorCount = validation.issues.filter(i => i.type === 'error').length;
      if (errorCount > 0) {
        validation.valid = false;
        this.results.passed = false;
      }
      
    } catch (error) {
      validation.valid = false;
      validation.issues.push({
        type: 'error',
        message: `Failed to read/parse command file: ${error.message}`,
        path: commandInfo.path
      });
      this.results.passed = false;
    }
    
    return validation;
  }

  /**
   * Run complete command validation
   */
  async validate() {
    console.log('🚀 Starting command validation...\n');
    
    const commands = this.discoverCommands();
    
    if (commands.length === 0) {
      this.results.passed = false;
      this.results.issues.push({
        type: 'critical',
        message: 'No command files found'
      });
      return this.results.passed;
    }
    
    // Validate each command
    for (const commandInfo of commands) {
      const validation = await this.validateCommand(commandInfo);
      this.results.commands[commandInfo.name] = validation;
      
      // Update summary
      this.results.summary.total++;
      if (validation.valid) {
        this.results.summary.valid++;
      } else {
        this.results.summary.invalid++;
      }
      
      const warningCount = validation.issues.filter(i => i.type === 'warning').length;
      this.results.summary.warnings += warningCount;
    }
    
    // Generate recommendations
    this.generateRecommendations();
    
    // Save results
    this.saveResults();
    this.printSummary();
    
    return this.results.passed;
  }

  /**
   * Generate improvement recommendations
   */
  generateRecommendations() {
    const { commands, summary } = this.results;
    
    // Overall ecosystem recommendations
    if (summary.total < 38) {
      this.results.recommendations.push(
        `📊 Command completeness: ${summary.total}/38 commands found - consider implementing missing commands`
      );
    }
    
    if (summary.invalid > 0) {
      this.results.recommendations.push(
        `🔧 Fix ${summary.invalid} invalid commands before deployment`
      );
    }
    
    if (summary.warnings > 10) {
      this.results.recommendations.push(
        `⚠️ Address ${summary.warnings} warnings to improve command quality`
      );
    }
    
    // Category-specific recommendations
    const categories = {};
    Object.values(commands).forEach(cmd => {
      categories[cmd.category] = (categories[cmd.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      if (count < 3) {
        this.results.recommendations.push(
          `📁 Category "${category}" has only ${count} commands - consider expanding`
        );
      }
    });
    
    // Quality recommendations
    const shortCommands = Object.values(commands).filter(
      cmd => cmd.metadata.wordCount < 100
    );
    if (shortCommands.length > 0) {
      this.results.recommendations.push(
        `📝 ${shortCommands.length} commands have brief content - consider expanding for better guidance`
      );
    }
    
    // Best practice recommendations
    this.results.recommendations.push('');
    this.results.recommendations.push('💡 **Best Practices:**');
    this.results.recommendations.push('- Ensure all commands follow the XML structure pattern');
    this.results.recommendations.push('- Include specific activation patterns and examples');
    this.results.recommendations.push('- Provide step-by-step instructions with clear outcomes');
    this.results.recommendations.push('- Specify output formats for consistent results');
    this.results.recommendations.push('- Regular review and updates based on user feedback');
  }

  /**
   * Save validation results
   */
  saveResults() {
    const resultsPath = path.join('ci', 'reports', 'command-validation.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    
    // Create summary report
    this.generateSummaryReport();
    
    // Create flag file if validation failed
    if (!this.results.passed) {
      const flagPath = path.join('ci', 'reports', 'command-validation-failed.flag');
      fs.writeFileSync(flagPath, JSON.stringify({
        reason: 'Command validation failed',
        invalidCommands: Object.entries(this.results.commands)
          .filter(([, cmd]) => !cmd.valid)
          .map(([name]) => name),
        timestamp: this.results.timestamp
      }, null, 2));
    }
  }

  /**
   * Generate summary report
   */
  generateSummaryReport() {
    const { summary, commands } = this.results;
    
    let report = `# Command Validation Report\n\n`;
    report += `**Status:** ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `**Timestamp:** ${this.results.timestamp}\n\n`;
    
    report += `## Summary\n\n`;
    report += `- **Total Commands:** ${summary.total}\n`;
    report += `- **Valid:** ${summary.valid}\n`;
    report += `- **Invalid:** ${summary.invalid}\n`;
    report += `- **Warnings:** ${summary.warnings}\n\n`;
    
    if (summary.invalid > 0) {
      report += `## Invalid Commands\n\n`;
      Object.entries(commands)
        .filter(([, cmd]) => !cmd.valid)
        .forEach(([name, cmd]) => {
          report += `### ${name}\n`;
          report += `- **Category:** ${cmd.category}\n`;
          report += `- **Path:** ${cmd.path}\n`;
          
          const errors = cmd.issues.filter(i => i.type === 'error');
          if (errors.length > 0) {
            report += `- **Errors:**\n`;
            errors.forEach(error => {
              report += `  - ${error.message}\n`;
            });
          }
          report += `\n`;
        });
    }
    
    if (this.results.recommendations.length > 0) {
      report += `## Recommendations\n\n`;
      report += this.results.recommendations.join('\n') + '\n';
    }
    
    fs.writeFileSync(path.join('ci', 'reports', 'command-validation-summary.md'), report);
  }

  /**
   * Print validation summary
   */
  printSummary() {
    console.log('\n📊 Command Validation Complete');
    console.log('==================================');
    
    const { summary } = this.results;
    
    if (this.results.passed) {
      console.log('✅ All commands valid');
    } else {
      console.log('❌ Validation failed');
    }
    
    console.log(`📁 Commands: ${summary.valid}/${summary.total} valid`);
    console.log(`⚠️  Warnings: ${summary.warnings}`);
    
    if (summary.invalid > 0) {
      console.log('\n❌ Invalid Commands:');
      Object.entries(this.results.commands)
        .filter(([, cmd]) => !cmd.valid)
        .forEach(([name, cmd]) => {
          const errorCount = cmd.issues.filter(i => i.type === 'error').length;
          console.log(`  - ${name}: ${errorCount} errors`);
        });
    }
  }
}

// Run if called directly
if (require.main === module) {
  const validator = new CommandValidator();
  validator.validate().then(passed => {
    process.exit(passed ? 0 : 1);
  }).catch(error => {
    console.error('Command validation failed:', error);
    process.exit(1);
  });
}

module.exports = CommandValidator;