#!/usr/bin/env node

/**
 * Coverage Validator for CI Pipeline
 * Validates test coverage meets quality thresholds and generates reports
 */

const fs = require('fs');
const path = require('path');
const CommonUtils = require('../utils/common');

class CoverageValidator {
  constructor() {
    this.thresholds = {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90
    };
    
    this.results = {
      passed: true,
      coverage: {},
      violations: [],
      summary: ''
    };
    
    this.ensureReportsDir();
  }

  ensureReportsDir() {
    return CommonUtils.ensureReportsDir();
  }

  /**
   * Load coverage data from Jest output
   */
  loadCoverageData() {
    const coveragePath = path.join('coverage', 'coverage-summary.json');
    
    if (!fs.existsSync(coveragePath)) {
      throw new Error('Coverage summary not found. Ensure tests run with --coverage flag.');
    }
    
    const coverageData = CommonUtils.safeJSONParse(coveragePath);
    this.results.coverage = coverageData.total;
    
    return coverageData;
  }

  /**
   * Validate coverage against thresholds
   */
  validateThresholds() {
    console.log('📊 Validating coverage thresholds...');
    
    const { coverage } = this.results;
    
    Object.entries(this.thresholds).forEach(([metric, threshold]) => {
      const actual = coverage[metric]?.pct || 0;
      
      if (actual < threshold) {
        this.results.violations.push({
          metric,
          threshold,
          actual,
          difference: threshold - actual
        });
        this.results.passed = false;
      }
      
      console.log(`${metric}: ${actual}% (threshold: ${threshold}%) ${actual >= threshold ? '✅' : '❌'}`);
    });
  }

  /**
   * Analyze coverage trends (if previous data exists)
   */
  analyzeTrends() {
    const previousCoveragePath = path.join('ci', 'reports', 'previous-coverage.json');
    
    if (fs.existsSync(previousCoveragePath)) {
      const previousCoverage = JSON.parse(fs.readFileSync(previousCoveragePath, 'utf8'));
      const { coverage: current } = this.results;
      
      console.log('\n📈 Coverage Trends:');
      
      Object.entries(this.thresholds).forEach(([metric]) => {
        const currentPct = current[metric]?.pct || 0;
        const previousPct = previousCoverage[metric]?.pct || 0;
        const change = currentPct - previousPct;
        
        const arrow = change > 0 ? '↗️' : change < 0 ? '↘️' : '➡️';
        const changeStr = change !== 0 ? ` (${change > 0 ? '+' : ''}${change.toFixed(2)}%)` : '';
        
        console.log(`${metric}: ${currentPct}%${changeStr} ${arrow}`);
      });
    }
    
    // Save current coverage for next run
    const currentCoveragePath = path.join('ci', 'reports', 'previous-coverage.json');
    fs.writeFileSync(currentCoveragePath, JSON.stringify(this.results.coverage, null, 2));
  }

  /**
   * Generate detailed file-level coverage analysis
   */
  analyzeFileCoverage() {
    const coveragePath = path.join('coverage', 'coverage-summary.json');
    const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    
    console.log('\n📁 File Coverage Analysis:');
    
    const files = Object.entries(coverageData)
      .filter(([path]) => path !== 'total')
      .map(([path, data]) => ({
        path,
        statements: data.statements.pct,
        branches: data.branches.pct,
        functions: data.functions.pct,
        lines: data.lines.pct,
        overall: (data.statements.pct + data.branches.pct + data.functions.pct + data.lines.pct) / 4
      }))
      .sort((a, b) => a.overall - b.overall);

    // Show lowest coverage files
    const lowCoverageFiles = files.filter(file => file.overall < 80);
    if (lowCoverageFiles.length > 0) {
      console.log('\n⚠️  Files with low coverage (< 80%):');
      lowCoverageFiles.slice(0, 10).forEach(file => {
        console.log(`  ${file.path}: ${file.overall.toFixed(1)}% overall`);
      });
    }

    // Show highest coverage files
    const highCoverageFiles = files.filter(file => file.overall >= 95);
    if (highCoverageFiles.length > 0) {
      console.log('\n✅ Well-tested files (>= 95%):');
      highCoverageFiles.slice(-5).forEach(file => {
        console.log(`  ${file.path}: ${file.overall.toFixed(1)}% overall`);
      });
    }

    return {
      totalFiles: files.length,
      lowCoverageFiles: lowCoverageFiles.length,
      highCoverageFiles: highCoverageFiles.length,
      averageCoverage: files.reduce((sum, file) => sum + file.overall, 0) / files.length
    };
  }

  /**
   * Generate coverage recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.violations.length > 0) {
      recommendations.push('📝 **Priority Actions:**');
      
      this.results.violations.forEach(violation => {
        const action = this.getActionForMetric(violation.metric, violation.difference);
        recommendations.push(`- ${violation.metric}: Add ${action} (need ${violation.difference.toFixed(1)}% more coverage)`);
      });
    }
    
    recommendations.push('');
    recommendations.push('💡 **General Recommendations:**');
    recommendations.push('- Focus on testing edge cases and error conditions');
    recommendations.push('- Add integration tests for complex workflows');
    recommendations.push('- Consider property-based testing for data validation');
    recommendations.push('- Review and improve existing test quality');
    
    return recommendations;
  }

  /**
   * Get specific action recommendation for a metric
   */
  getActionForMetric(metric, difference) {
    switch (metric) {
      case 'statements':
        return `~${Math.ceil(difference * 2)} test assertions`;
      case 'branches':
        return `tests for ${Math.ceil(difference / 10)} conditional paths`;
      case 'functions':
        return `tests for ${Math.ceil(difference / 5)} uncovered functions`;
      case 'lines':
        return `tests covering ${Math.ceil(difference * 1.5)} more lines`;
      default:
        return 'additional test coverage';
    }
  }

  /**
   * Generate Markdown report for PR comments
   */
  generateMarkdownReport() {
    const { coverage, violations } = this.results;
    const fileAnalysis = this.analyzeFileCoverage();
    
    let report = '## 📊 Test Coverage Report\n\n';
    
    // Overall status
    if (this.results.passed) {
      report += '✅ **Coverage thresholds met!**\n\n';
    } else {
      report += '❌ **Coverage thresholds not met**\n\n';
    }
    
    // Coverage summary table
    report += '### Coverage Summary\n\n';
    report += '| Metric | Coverage | Threshold | Status |\n';
    report += '|--------|----------|-----------|--------|\n';
    
    Object.entries(this.thresholds).forEach(([metric, threshold]) => {
      const actual = coverage[metric]?.pct || 0;
      const status = actual >= threshold ? '✅' : '❌';
      report += `| ${metric} | ${actual}% | ${threshold}% | ${status} |\n`;
    });
    
    // File analysis
    report += '\n### File Analysis\n\n';
    report += `- **Total files:** ${fileAnalysis.totalFiles}\n`;
    report += `- **Well-tested files (≥95%):** ${fileAnalysis.highCoverageFiles}\n`;
    report += `- **Files needing attention (<80%):** ${fileAnalysis.lowCoverageFiles}\n`;
    report += `- **Average coverage:** ${fileAnalysis.averageCoverage.toFixed(1)}%\n`;
    
    // Violations and recommendations
    if (violations.length > 0) {
      report += '\n### ⚠️ Coverage Violations\n\n';
      violations.forEach(violation => {
        report += `- **${violation.metric}**: ${violation.actual}% (need ${violation.difference.toFixed(1)}% more)\n`;
      });
      
      const recommendations = this.generateRecommendations();
      report += '\n### 🎯 Recommendations\n\n';
      report += recommendations.join('\n') + '\n';
    }
    
    // Save report
    fs.writeFileSync(path.join('ci', 'reports', 'coverage-summary.md'), report);
    
    return report;
  }

  /**
   * Save detailed results
   */
  saveResults() {
    const resultsPath = path.join('ci', 'reports', 'coverage-validation.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    
    // Create flag file for CI pipeline
    if (!this.results.passed) {
      const flagPath = path.join('ci', 'reports', 'coverage-failed.flag');
      fs.writeFileSync(flagPath, 'Coverage validation failed');
    }
  }

  /**
   * Run complete coverage validation
   */
  async validate() {
    console.log('🚀 Starting coverage validation...\n');
    
    try {
      this.loadCoverageData();
      this.validateThresholds();
      this.analyzeTrends();
      const fileAnalysis = this.analyzeFileCoverage();
      
      console.log('\n📋 Generating reports...');
      this.generateMarkdownReport();
      this.saveResults();
      
      console.log('\n✅ Coverage validation completed');
      return this.results.passed;
      
    } catch (error) {
      console.error('❌ Coverage validation failed:', error.message);
      this.results.passed = false;
      this.saveResults();
      return false;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const validator = new CoverageValidator();
  validator.validate().then(passed => {
    process.exit(passed ? 0 : 1);
  }).catch(error => {
    console.error('Coverage validation error:', error);
    process.exit(1);
  });
}

module.exports = CoverageValidator;