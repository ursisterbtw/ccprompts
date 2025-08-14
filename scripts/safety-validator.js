#!/usr/bin/env node

/**
 * Dagger Safety System Integration for Command Validation
 * Validates commands using containerized safety checks
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const safetyPatterns = require('./config/safety-patterns');

class SafetyValidator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.daggerModulePath = path.join(this.projectRoot, 'src');
    this.safetyResults = {
      totalCommands: 0,
      safeCommands: 0,
      dangerousCommands: 0,
      validatedCommands: 0,
      containerTests: 0,
      errors: [],
      warnings: [],
      validationTime: 0
    };
    this._daggerAvailable = undefined;
  }

  /**
   * Check if Dagger is available and properly configured
   */
  checkDaggerAvailability() {
    try {
      execSync('dagger version', { stdio: 'pipe' });
      return true;
    } catch (error) {
      this.safetyResults.errors.push('Dagger is not available - safety validation disabled');
      return false;
    }
  }

  /**
   * Analyze command content for dangerous patterns
   */
  analyzeDangerousPatterns(content, filename) {
    const findings = [];
    const codeBlocks = this.extractCodeBlocks(content);
    const allPatterns = safetyPatterns.getAllPatterns();

    codeBlocks.forEach((block, index) => {
      allPatterns.forEach(({ pattern, severity, message }) => {
        const matches = block.match(pattern);
        if (matches) {
          findings.push({
            filename,
            blockIndex: index,
            pattern: pattern.source,
            severity,
            message,
            matches: matches.slice(0, 3),
            codeSnippet: block.substring(0, 100) + (block.length > 100 ? '...' : '')
          });
        }
      });
    });

    return findings;
  }

  /**
   * Extract code blocks from markdown content
   */
  extractCodeBlocks(content) {
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push(match[1].trim());
    }

    return blocks;
  }

  /**
   * Validate a command using Dagger container
   */
  async validateCommandInContainer(command, filename) {
    if (this._daggerAvailable === undefined) {
      this._daggerAvailable = this.checkDaggerAvailability();
    }
    if (!this._daggerAvailable) {
      return {
        success: false,
        error: 'Dagger not available',
        containerValidated: false
      };
    }

    try {
      const startTime = Date.now();
      
      const safeRunScript = path.join(this.projectRoot, 'scripts', 'safe-run.sh');
      
      const result = execSync(
        `"${safeRunScript}" "${command}" --test`,
        { 
          encoding: 'utf8',
          timeout: 10000,
          cwd: this.projectRoot
        }
      );

      const executionTime = Date.now() - startTime;
      this.safetyResults.containerTests++;

      return {
        success: true,
        output: result,
        executionTime,
        containerValidated: true,
        safetyLevel: this.determineSafetyLevel(command),
        recommendations: this.generateSafetyRecommendations(command)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        containerValidated: false,
        stderr: error.stderr ? error.stderr.toString() : null
      };
    }
  }

  /**
   * Determine safety level based on command content
   */
  determineSafetyLevel(command) {
    const criticalPatterns = ['rm -rf', 'curl.*|.*bash', 'sudo'];
    const highPatterns = ['chmod', 'docker.*--privileged', 'eval'];
    const mediumPatterns = ['npm install -g', 'systemctl', 'wget'];

    if (criticalPatterns.some(pattern => new RegExp(pattern, 'i').test(command))) {
      return 'critical';
    }
    if (highPatterns.some(pattern => new RegExp(pattern, 'i').test(command))) {
      return 'high';
    }
    if (mediumPatterns.some(pattern => new RegExp(pattern, 'i').test(command))) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Generate safety recommendations for commands
   */
  generateSafetyRecommendations(command) {
    const recommendations = [];

    if (/rm\s+-rf/i.test(command)) {
      recommendations.push('Consider using specific file paths instead of wildcards');
      recommendations.push('Always run in containers when dealing with file deletion');
    }

    if (/curl.*\|.*bash/i.test(command)) {
      recommendations.push('Download scripts to temporary files and inspect before execution');
      recommendations.push('Use signature verification when available');
    }

    if (/sudo/i.test(command)) {
      recommendations.push('Consider using rootless alternatives when possible');
      recommendations.push('Always validate the need for elevated privileges');
    }

    if (/docker.*--privileged/i.test(command)) {
      recommendations.push('Avoid privileged mode unless absolutely necessary');
      recommendations.push('Use specific capabilities instead of --privileged');
    }

    if (recommendations.length === 0) {
      recommendations.push('Command appears safe for standard execution');
    }

    return recommendations;
  }

  /**
   * Validate all commands in a file for safety
   */
  async validateFile(filePath) {
    const filename = path.relative(this.projectRoot, filePath);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.safetyResults.totalCommands++;

      const dangerousFindings = this.analyzeDangerousPatterns(content, filename);
      
      if (dangerousFindings.length > 0) {
        this.safetyResults.dangerousCommands++;
        
        dangerousFindings.forEach(finding => {
          const message = `${filename} [${finding.severity}]: ${finding.message} - "${finding.codeSnippet}"`;
          
          if (finding.severity === 'critical' || finding.severity === 'high') {
            this.safetyResults.errors.push(message);
          } else {
            this.safetyResults.warnings.push(message);
          }
        });

        const codeBlocks = this.extractCodeBlocks(content);
        for (const block of codeBlocks) {
          if (block.length > 0) {
            const validationResult = await this.validateCommandInContainer(block, filename);
            
            if (validationResult.containerValidated) {
              this.safetyResults.validatedCommands++;
            }

            if (!validationResult.success && validationResult.error !== 'Dagger not available') {
              this.safetyResults.errors.push(
                `${filename}: Container validation failed - ${validationResult.error}`
              );
            }
          }
        }
      } else {
        this.safetyResults.safeCommands++;
      }

    } catch (error) {
      this.safetyResults.errors.push(`${filename}: Failed to read file - ${error.message}`);
    }
  }

  /**
   * Generate safety validation report
   */
  generateReport() {
    const successRate = this.safetyResults.totalCommands > 0 
      ? ((this.safetyResults.safeCommands / this.safetyResults.totalCommands) * 100).toFixed(1)
      : 0;

    const dangerRate = this.safetyResults.totalCommands > 0
      ? ((this.safetyResults.dangerousCommands / this.safetyResults.totalCommands) * 100).toFixed(1)
      : 0;

    return {
      summary: {
        totalCommands: this.safetyResults.totalCommands,
        safeCommands: this.safetyResults.safeCommands,
        dangerousCommands: this.safetyResults.dangerousCommands,
        validatedCommands: this.safetyResults.validatedCommands,
        containerTests: this.safetyResults.containerTests,
        successRate: `${successRate}%`,
        dangerRate: `${dangerRate}%`,
        validationTime: `${this.safetyResults.validationTime}ms`
      },
      errors: this.safetyResults.errors,
      warnings: this.safetyResults.warnings,
      daggerAvailable: this.checkDaggerAvailability()
    };
  }

  log(color, message) {
    const colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[color] || ''}${message}${colors.reset}`);
  }

  /**
   * Validate safety across all command files
   */
  async validateAllCommands() {
    const startTime = Date.now();
    this.log('blue', '🛡️  Starting Dagger safety validation...');

    const commandsDir = path.join(this.projectRoot, '.claude', 'commands');
    
    if (!fs.existsSync(commandsDir)) {
      this.log('yellow', '⚠️  Commands directory not found - skipping safety validation');
      return this.generateReport();
    }

    const commandFiles = this.findCommandFiles(commandsDir);
    
    this.log('cyan', `Found ${commandFiles.length} command files to validate`);

    for (const filePath of commandFiles) {
      await this.validateFile(filePath);
    }

    this.safetyResults.validationTime = Date.now() - startTime;

    const report = this.generateReport();
    this.displayReport(report);

    return report;
  }

  /**
   * Find all command files recursively
   */
  findCommandFiles(directory) {
    const files = [];
    
    const scan = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            scan(fullPath);
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        return;
      }
    };
    
    if (fs.existsSync(directory)) {
      scan(directory);
    }
    
    return files;
  }

  /**
   * Display safety validation report
   */
  displayReport(report) {
    this.log('blue', '\n🛡️  Safety Validation Report');
    this.log('blue', '=========================');
    
    this.log('green', `✅ Total commands analyzed: ${report.summary.totalCommands}`);
    this.log('green', `✅ Safe commands: ${report.summary.safeCommands}`);
    
    if (report.summary.dangerousCommands > 0) {
      this.log('yellow', `⚠️  Dangerous commands: ${report.summary.dangerousCommands}`);
    }
    
    if (report.summary.validatedCommands > 0) {
      this.log('cyan', `🧪 Container validated: ${report.summary.validatedCommands}`);
    }
    
    this.log('cyan', `📊 Safety rate: ${report.summary.successRate}`);
    this.log('cyan', `⚡ Validation time: ${report.summary.validationTime}`);
    
    if (!report.daggerAvailable) {
      this.log('yellow', '\n⚠️  Dagger not available - container validation disabled');
      this.log('cyan', '   Install Dagger from https://dagger.io for full safety validation');
    }

    if (report.errors.length > 0) {
      this.log('red', `\n💥 Safety Errors (${report.errors.length}):`);
      report.errors.slice(0, 10).forEach(error => {
        this.log('red', `   ${error}`);
      });
      
      if (report.errors.length > 10) {
        this.log('red', `   ... and ${report.errors.length - 10} more errors`);
      }
    }

    if (report.warnings.length > 0) {
      this.log('yellow', `\n⚠️  Safety Warnings (${report.warnings.length}):`);
      report.warnings.slice(0, 5).forEach(warning => {
        this.log('yellow', `   ${warning}`);
      });
      
      if (report.warnings.length > 5) {
        this.log('yellow', `   ... and ${report.warnings.length - 5} more warnings`);
      }
    }
  }
}

if (require.main === module) {
  const validator = new SafetyValidator();
  
  validator.validateAllCommands()
    .then(report => {
      const hasErrors = report.errors.length > 0;
      const hasHighSeverityWarnings = report.warnings.some(w => 
        w.includes('[critical]') || w.includes('[high]')
      );
      
      if (hasErrors || hasHighSeverityWarnings) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Safety validation failed:', error);
      process.exit(1);
    });
}

module.exports = SafetyValidator;
