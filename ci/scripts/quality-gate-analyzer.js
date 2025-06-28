#!/usr/bin/env node

/**
 * Quality Gate Analyzer for CI Pipeline
 * Makes final pass/fail decision based on all quality checks
 */

const fs = require('fs');
const path = require('path');

class QualityGateAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      passed: true,
      checks: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      recommendations: []
    };
    
    this.ensureReportsDir();
  }

  ensureReportsDir() {
    const reportsDir = path.join(process.cwd(), 'ci', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
  }

  /**
   * Analyze security scan results
   */
  analyzeSecurityResults() {
    console.log('🔍 Analyzing security scan results...');
    
    const securityPath = path.join('ci', 'reports', 'security-scan.json');
    
    if (fs.existsSync(securityPath)) {
      const securityData = JSON.parse(fs.readFileSync(securityPath, 'utf8'));
      
      this.results.checks.security = {
        name: 'Security Scan',
        passed: securityData.passed,
        vulnerabilities: securityData.vulnerabilities?.length || 0,
        warnings: securityData.warnings?.length || 0,
        critical: securityData.vulnerabilities?.filter(v => v.severity === 'critical').length || 0,
        high: securityData.vulnerabilities?.filter(v => v.severity === 'high').length || 0
      };
      
      if (!securityData.passed) {
        this.results.passed = false;
        this.results.recommendations.push('🚨 Address critical and high-severity security vulnerabilities');
      }
      
      if (securityData.vulnerabilities?.length > 0) {
        console.log(`  ❌ ${securityData.vulnerabilities.length} vulnerabilities found`);
      } else {
        console.log('  ✅ No security vulnerabilities detected');
      }
    } else {
      console.log('  ⚠️  Security scan results not found');
      this.results.checks.security = { name: 'Security Scan', passed: false, missing: true };
      this.results.passed = false;
    }
  }

  /**
   * Analyze code quality results
   */
  analyzeCodeQualityResults() {
    console.log('📝 Analyzing code quality results...');
    
    const eslintPath = path.join('ci', 'reports', 'eslint-results.json');
    
    if (fs.existsSync(eslintPath)) {
      const eslintData = JSON.parse(fs.readFileSync(eslintPath, 'utf8'));
      
      const totalErrors = eslintData.reduce((sum, file) => sum + file.errorCount, 0);
      const totalWarnings = eslintData.reduce((sum, file) => sum + file.warningCount, 0);
      
      this.results.checks.codeQuality = {
        name: 'Code Quality',
        passed: totalErrors === 0,
        errors: totalErrors,
        warnings: totalWarnings,
        files: eslintData.length
      };
      
      if (totalErrors > 0) {
        this.results.passed = false;
        this.results.recommendations.push('🔧 Fix all ESLint errors before deployment');
      }
      
      if (totalWarnings > 10) {
        this.results.recommendations.push('⚠️ Consider addressing ESLint warnings for better code quality');
      }
      
      console.log(`  ${totalErrors === 0 ? '✅' : '❌'} ${totalErrors} errors, ${totalWarnings} warnings`);
    } else {
      console.log('  ⚠️  Code quality results not found');
      this.results.checks.codeQuality = { name: 'Code Quality', passed: false, missing: true };
      this.results.passed = false;
    }
  }

  /**
   * Analyze test coverage results
   */
  analyzeCoverageResults() {
    console.log('📊 Analyzing test coverage results...');
    
    const coveragePath = path.join('ci', 'reports', 'coverage-validation.json');
    
    if (fs.existsSync(coveragePath)) {
      const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      
      this.results.checks.coverage = {
        name: 'Test Coverage',
        passed: coverageData.passed,
        violations: coverageData.violations?.length || 0,
        statements: coverageData.coverage?.statements?.pct || 0,
        branches: coverageData.coverage?.branches?.pct || 0,
        functions: coverageData.coverage?.functions?.pct || 0,
        lines: coverageData.coverage?.lines?.pct || 0
      };
      
      if (!coverageData.passed) {
        this.results.passed = false;
        this.results.recommendations.push('📈 Increase test coverage to meet minimum thresholds');
      }
      
      const overallCoverage = (
        this.results.checks.coverage.statements +
        this.results.checks.coverage.branches +
        this.results.checks.coverage.functions +
        this.results.checks.coverage.lines
      ) / 4;
      
      console.log(`  ${coverageData.passed ? '✅' : '❌'} ${overallCoverage.toFixed(1)}% overall coverage`);
    } else {
      console.log('  ⚠️  Coverage results not found');
      this.results.checks.coverage = { name: 'Test Coverage', passed: false, missing: true };
      this.results.passed = false;
    }
  }

  /**
   * Analyze performance baseline results
   */
  analyzePerformanceResults() {
    console.log('⚡ Analyzing performance results...');
    
    const performancePath = path.join('ci', 'reports', 'performance');
    
    if (fs.existsSync(performancePath)) {
      const files = fs.readdirSync(performancePath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      let latestResult = null;
      if (jsonFiles.length > 0) {
        latestResult = jsonFiles
          .map(f => ({
            file: f,
            mtime: fs.statSync(path.join(performancePath, f)).mtime
          }))
          .sort((a, b) => b.mtime - a.mtime)[0].file;
      }
      
      if (latestResult) {
        const perfData = JSON.parse(fs.readFileSync(path.join(performancePath, latestResult), 'utf8'));
        
        this.results.checks.performance = {
          name: 'Performance',
          passed: !perfData.regressions || perfData.regressions.length === 0,
          regressions: perfData.regressions?.length || 0,
          improvements: perfData.improvements?.length || 0,
          benchmarks: perfData.benchmarks?.length || 0
        };
        
        if (perfData.regressions && perfData.regressions.length > 0) {
          this.results.recommendations.push('⚡ Investigate and fix performance regressions');
          
          // Only fail for significant regressions (>20% slower)
          const significantRegressions = perfData.regressions.filter(r => r.degradation > 20);
          if (significantRegressions.length > 0) {
            this.results.passed = false;
          }
        }
        
        console.log(`  ${this.results.checks.performance.passed ? '✅' : '❌'} ${perfData.regressions?.length || 0} regressions detected`);
      } else {
        console.log('  ⚠️  No performance results found');
        this.results.checks.performance = { name: 'Performance', passed: true, missing: true };
      }
    } else {
      console.log('  ⚠️  Performance results directory not found');
      this.results.checks.performance = { name: 'Performance', passed: true, missing: true };
    }
  }

  /**
   * Check for test results across environments
   */
  analyzeTestResults() {
    console.log('🧪 Analyzing test results...');
    
    const testResultsPattern = /test-results-.*\.xml/;
    const reportsDir = path.join('ci', 'reports');
    
    if (fs.existsSync(reportsDir)) {
      const testFiles = fs.readdirSync(reportsDir).filter(f => testResultsPattern.test(f));
      
      if (testFiles.length > 0) {
        // Simple check - if tests-passed.flag exists, tests passed
        const testsPassed = fs.existsSync(path.join(reportsDir, 'tests-passed.flag'));
        
        this.results.checks.tests = {
          name: 'Multi-Environment Tests',
          passed: testsPassed,
          environments: testFiles.length,
          results: testFiles
        };
        
        if (!testsPassed) {
          this.results.passed = false;
          this.results.recommendations.push('🧪 Fix failing tests across all environments');
        }
        
        console.log(`  ${testsPassed ? '✅' : '❌'} Tests across ${testFiles.length} environments`);
      } else {
        console.log('  ⚠️  No test result files found');
        this.results.checks.tests = { name: 'Multi-Environment Tests', passed: false, missing: true };
        this.results.passed = false;
      }
    }
  }

  /**
   * Calculate summary statistics
   */
  calculateSummary() {
    Object.values(this.results.checks).forEach(check => {
      this.results.summary.total++;
      
      if (check.missing) {
        this.results.summary.warnings++;
      } else if (check.passed) {
        this.results.summary.passed++;
      } else {
        this.results.summary.failed++;
      }
    });
  }

  /**
   * Generate final quality score
   */
  calculateQualityScore() {
    const weights = {
      security: 30,      // Security is most important
      coverage: 25,      // Coverage indicates quality
      codeQuality: 20,   // Code quality for maintainability
      tests: 15,         // Multi-environment testing
      performance: 10    // Performance regressions
    };
    
    let score = 0;
    let totalWeight = 0;
    
    Object.entries(weights).forEach(([checkName, weight]) => {
      const check = this.results.checks[checkName];
      if (check && !check.missing) {
        score += check.passed ? weight : 0;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
  }

  /**
   * Generate comprehensive recommendations
   */
  generateRecommendations() {
    // Check if there are failures before adding success message
    const hasFailures = !this.results.security.passed || 
                       !this.results.testing.passed || 
                       !this.results.performance.passed ||
                       !this.results.quality.passed;
    
    // Only clear and add success message if there are no failures
    if (!hasFailures && this.results.recommendations.length === 0) {
      this.results.recommendations = ['🎉 All quality checks passed! Ready for deployment.'];
    }
    
    // Add general recommendations only if they don't already exist
    const improvementSection = '💡 **Continuous Improvement:**';
    if (!this.results.recommendations.includes(improvementSection)) {
      this.results.recommendations.push('');
      this.results.recommendations.push(improvementSection);
      this.results.recommendations.push('- Review and enhance test coverage for edge cases');
      this.results.recommendations.push('- Consider adding more integration tests');
      this.results.recommendations.push('- Keep dependencies updated and secure');
      this.results.recommendations.push('- Monitor performance trends over time');
    }
  }

  /**
   * Save comprehensive results
   */
  saveResults() {
    const qualityScore = this.calculateQualityScore();
    this.results.qualityScore = qualityScore;
    
    // Save detailed results
    const resultsPath = path.join('ci', 'reports', 'quality-gate-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    
    // Create flag files for CI pipeline
    if (!this.results.passed) {
      const flagPath = path.join('ci', 'reports', 'quality-gate-failed.flag');
      fs.writeFileSync(flagPath, JSON.stringify({
        reason: 'Quality gate failed',
        failedChecks: Object.entries(this.results.checks)
          .filter(([, check]) => !check.passed)
          .map(([name]) => name),
        qualityScore,
        timestamp: this.results.timestamp
      }, null, 2));
    }
    
    // Generate summary report
    this.generateSummaryReport();
  }

  /**
   * Generate summary report for easy consumption
   */
  generateSummaryReport() {
    const qualityScore = this.results.qualityScore;
    
    let summary = `# Quality Gate Report\n\n`;
    summary += `**Status:** ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    summary += `**Quality Score:** ${qualityScore}/100\n`;
    summary += `**Timestamp:** ${this.results.timestamp}\n\n`;
    
    summary += `## Check Results\n\n`;
    
    Object.entries(this.results.checks).forEach(([name, check]) => {
      const status = check.missing ? '⚠️ MISSING' : (check.passed ? '✅ PASSED' : '❌ FAILED');
      summary += `- **${check.name}:** ${status}\n`;
    });
    
    summary += `\n## Summary\n\n`;
    summary += `- **Total Checks:** ${this.results.summary.total}\n`;
    summary += `- **Passed:** ${this.results.summary.passed}\n`;
    summary += `- **Failed:** ${this.results.summary.failed}\n`;
    summary += `- **Warnings:** ${this.results.summary.warnings}\n`;
    
    if (this.results.recommendations.length > 0) {
      summary += `\n## Recommendations\n\n`;
      summary += this.results.recommendations.join('\n') + '\n';
    }
    
    fs.writeFileSync(path.join('ci', 'reports', 'quality-gate-summary.md'), summary);
  }

  /**
   * Print results to console
   */
  printResults() {
    console.log('\n📊 Quality Gate Analysis Complete');
    console.log('=====================================');
    
    const qualityScore = this.results.qualityScore;
    
    if (this.results.passed) {
      console.log('✅ Quality Gate: PASSED');
    } else {
      console.log('❌ Quality Gate: FAILED');
    }
    
    console.log(`🎯 Quality Score: ${qualityScore}/100`);
    console.log(`📈 Checks: ${this.results.summary.passed}/${this.results.summary.total} passed`);
    
    if (this.results.summary.failed > 0) {
      console.log('\n❌ Failed Checks:');
      Object.entries(this.results.checks)
        .filter(([, check]) => !check.passed && !check.missing)
        .forEach(([name, check]) => {
          console.log(`  - ${check.name}`);
        });
    }
    
    if (this.results.summary.warnings > 0) {
      console.log('\n⚠️  Missing Checks:');
      Object.entries(this.results.checks)
        .filter(([, check]) => check.missing)
        .forEach(([name, check]) => {
          console.log(`  - ${check.name}`);
        });
    }
  }

  /**
   * Run complete quality gate analysis
   */
  async analyze() {
    console.log('🚀 Starting Quality Gate Analysis...\n');
    
    this.analyzeSecurityResults();
    this.analyzeCodeQualityResults();
    this.analyzeCoverageResults();
    this.analyzePerformanceResults();
    this.analyzeTestResults();
    
    this.calculateSummary();
    this.generateRecommendations();
    this.saveResults();
    this.printResults();
    
    return this.results.passed;
  }
}

// Run if called directly
if (require.main === module) {
  const analyzer = new QualityGateAnalyzer();
  analyzer.analyze().then(passed => {
    process.exit(passed ? 0 : 1);
  }).catch(error => {
    console.error('Quality gate analysis failed:', error);
    process.exit(1);
  });
}

module.exports = QualityGateAnalyzer;