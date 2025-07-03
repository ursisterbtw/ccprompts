#!/usr/bin/env node

/**
 * Modularized validation script for ccprompts ecosystem
 * Uses separate modules for different validation concerns
 */

const path = require('path');
const { execSync } = require('child_process');
const MainValidator = require('./validators/main-validator');

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

// Validate system integrity
function validateSystemIntegrity() {
  log('cyan', '\n🔍 Validating System Integrity...\n');
  
  const expectedCommandCount = 38; // From CLAUDE.md
  let actualCommandCount = 0;
  
  try {
    actualCommandCount = execSync('find .claude/commands -name "*.md" -type f | wc -l', { encoding: 'utf8' }).trim();
    
    if (parseInt(actualCommandCount) !== expectedCommandCount) {
      log('red', `❌ Command count mismatch! Expected ${expectedCommandCount}, found ${actualCommandCount}`);
      return false;
    }
    
    log('green', `✅ Command count verified: ${actualCommandCount} commands`);
  } catch (error) {
    log('red', `❌ Failed to count commands: ${error.message}`);
    return false;
  }
  
  // Verify critical files exist
  const criticalFiles = [
    'README.md',
    'CLAUDE.md',
    '.claude/commands/bootstrap-project.md',
    '.claude/config.json'
  ];
  
  for (const file of criticalFiles) {
    try {
      execSync(`test -f "${file}"`);
      log('green', `✅ Critical file exists: ${file}`);
    } catch {
      log('red', `❌ Missing critical file: ${file}`);
      return false;
    }
  }
  
  return true;
}

// Generate detailed report
function reportResults(validator, duration) {
  const results = validator.getResults();
  const summary = validator.generateSummary();
  
  console.log('\n' + '='.repeat(80));
  log('cyan', '📊 VALIDATION SUMMARY');
  console.log('='.repeat(80) + '\n');
  
  // File statistics
  log('blue', '📁 File Statistics:');
  console.log(`  Total files scanned: ${summary.totalFiles}`);
  console.log(`  Valid files: ${summary.validFiles}`);
  console.log(`  Command files: ${summary.commandFiles}`);
  console.log(`  Prompt files: ${summary.promptFiles}`);
  
  // File type breakdown
  log('blue', '\n📝 File Type Breakdown:');
  Object.entries(summary.fileTypeBreakdown).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  // Quality metrics
  log('blue', '\n📈 Quality Metrics:');
  console.log(`  Average quality score: ${summary.averageQualityScore}/100`);
  console.log(`  Security issues found: ${summary.securityIssues}`);
  
  // Issues summary
  log('blue', '\n⚠️  Issues Summary:');
  console.log(`  Errors: ${summary.errorCount}`);
  console.log(`  Warnings: ${summary.warningCount}`);
  
  // Detailed errors
  if (results.errors.length > 0) {
    log('red', '\n❌ ERRORS:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  // Detailed warnings
  if (results.warnings.length > 0) {
    log('yellow', '\n⚠️  WARNINGS:');
    results.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  // Security report
  if (results.securityReport.length > 0) {
    log('red', '\n🔒 SECURITY ISSUES:');
    results.securityReport.forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.issue}`);
      if (issue.match) {
        console.log(`    Match: ${issue.match}`);
      }
    });
  }
  
  // Overall status
  console.log('\n' + '='.repeat(80));
  const overallStatus = results.errors.length === 0 && summary.securityIssues === 0 ? 'PASSED' : 'FAILED';
  const statusColor = overallStatus === 'PASSED' ? 'green' : 'red';
  const statusEmoji = overallStatus === 'PASSED' ? '✅' : '❌';
  
  log(statusColor, `${statusEmoji} OVERALL STATUS: ${overallStatus}`);
  console.log('='.repeat(80));
  
  // Performance
  log('cyan', `\n⏱️  Validation completed in ${duration}ms`);
  
  // Exit with appropriate code
  process.exit(overallStatus === 'PASSED' ? 0 : 1);
}

// Load configuration
function loadConfig() {
  const configPath = path.join(__dirname, 'validation-config.json');
  try {
    const fs = require('fs');
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    log('yellow', `⚠️ Using default configuration (${error.message})`);
    return {
      excludePatterns: ['node_modules', '.git', 'test', '__pycache__', 'coverage', 'dist'],
      thresholds: {
        maxErrors: 5,
        minQualityScore: 70,
        maxSecurityIssues: 0
      }
    };
  }
}

// Main execution
async function main() {
  const startTime = Date.now();
  
  log('cyan', '🚀 Starting ccprompts Validation Suite (Modular Version)\n');
  
  // Load configuration
  const config = loadConfig();
  
  // First validate system integrity
  if (!validateSystemIntegrity()) {
    log('red', '\n❌ System integrity check failed!');
    process.exit(1);
  }
  
  // Create validator with configuration
  const validator = new MainValidator({
    excludePatterns: config.excludePatterns
  });
  
  // Run validation
  log('cyan', '\n🔍 Validating prompt files...\n');
  
  try {
    await validator.validateDirectory('.');
    const duration = Date.now() - startTime;
    
    // Check against thresholds
    const summary = validator.generateSummary();
    
    if (summary.errorCount > config.thresholds.maxErrors) {
      log('red', `\n❌ Error threshold exceeded: ${summary.errorCount} > ${config.thresholds.maxErrors}`);
    }
    
    if (summary.averageQualityScore < config.thresholds.minQualityScore) {
      log('red', `\n❌ Quality score below threshold: ${summary.averageQualityScore} < ${config.thresholds.minQualityScore}`);
    }
    
    if (summary.securityIssues > config.thresholds.maxSecurityIssues) {
      log('red', `\n❌ Security issues exceed threshold: ${summary.securityIssues} > ${config.thresholds.maxSecurityIssues}`);
    }
    
    reportResults(validator, duration);
  } catch (error) {
    log('red', `\n❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    log('red', `\n❌ Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { MainValidator };