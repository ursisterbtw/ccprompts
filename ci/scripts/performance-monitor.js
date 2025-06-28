#!/usr/bin/env node

/**
 * Performance Monitor for CI Pipeline
 * Detects performance regressions and tracks benchmarks over time
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class PerformanceMonitor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      passed: true,
      benchmarks: [],
      regressions: [],
      improvements: [],
      baseline: null,
      summary: {
        totalBenchmarks: 0,
        regressionCount: 0,
        improvementCount: 0,
        averageChange: 0
      }
    };
    
    this.thresholds = {
      regression: 20,  // 20% slower is a regression
      improvement: 10, // 10% faster is an improvement
      significance: 5  // 5% minimum change to be significant
    };
    
    this.ensureReportsDir();
  }

  ensureReportsDir() {
    const reportsDir = path.join(process.cwd(), 'ci', 'reports', 'performance');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
  }

  /**
   * Load baseline performance data
   */
  loadBaseline() {
    const baselinePath = path.join('ci', 'reports', 'performance', 'baseline.json');
    
    if (fs.existsSync(baselinePath)) {
      try {
        this.results.baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
        console.log(`📊 Loaded baseline with ${this.results.baseline.benchmarks.length} benchmarks`);
      } catch (error) {
        console.log('⚠️  Failed to load baseline, will create new one');
        this.results.baseline = null;
      }
    } else {
      console.log('📊 No baseline found, will create initial baseline');
      this.results.baseline = null;
    }
  }

  /**
   * Benchmark file operations performance
   */
  async benchmarkFileOperations() {
    console.log('📁 Benchmarking file operations...');
    
    const tempDir = path.join('ci', 'reports', 'temp');
    
    try {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const benchmarks = [];
      
      // File write performance
      const writeStart = performance.now();
      const testData = 'x'.repeat(10000); // 10KB test data
      for (let i = 0; i < 100; i++) {
        fs.writeFileSync(path.join(tempDir, `test-${i}.txt`), testData);
      }
      const writeEnd = performance.now();
      
      benchmarks.push({
        name: 'file_write_100x10kb',
        duration: writeEnd - writeStart,
        unit: 'ms',
        category: 'io'
      });
      
      // File read performance
      const readStart = performance.now();
      for (let i = 0; i < 100; i++) {
        fs.readFileSync(path.join(tempDir, `test-${i}.txt`), 'utf8');
      }
      const readEnd = performance.now();
      
      benchmarks.push({
        name: 'file_read_100x10kb',
        duration: readEnd - readStart,
        unit: 'ms',
        category: 'io'
      });
      
      // Directory traversal performance
      const traversalStart = performance.now();
      this.traverseDirectory('.claude');
      const traversalEnd = performance.now();
      
      benchmarks.push({
        name: 'directory_traversal_claude',
        duration: traversalEnd - traversalStart,
        unit: 'ms',
        category: 'io'
      });
      
      return benchmarks;
    } finally {
      // Cleanup in finally block to ensure removal even on error
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true });
        }
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp directory:', cleanupError.message);
      }
    }
  }

  /**
   * Benchmark JSON processing performance
   */
  async benchmarkJSONProcessing() {
    console.log('🔄 Benchmarking JSON processing...');
    
    const benchmarks = [];
    
    // Create test data
    const largeObject = {
      commands: {},
      timestamp: new Date().toISOString(),
      metadata: {}
    };
    
    // Generate large command structure
    for (let i = 0; i < 100; i++) {
      largeObject.commands[`command-${i}`] = {
        name: `test-command-${i}`,
        description: 'Test command '.repeat(50),
        parameters: {
          input: { type: 'string', required: true },
          output: { type: 'object', required: false }
        },
        metadata: {
          category: 'test',
          examples: new Array(10).fill('example').map((e, j) => `${e}-${j}`)
        }
      };
    }
    
    // JSON stringify performance
    const stringifyStart = performance.now();
    for (let i = 0; i < 50; i++) {
      JSON.stringify(largeObject);
    }
    const stringifyEnd = performance.now();
    
    benchmarks.push({
      name: 'json_stringify_50x_large_object',
      duration: stringifyEnd - stringifyStart,
      unit: 'ms',
      category: 'processing'
    });
    
    // JSON parse performance
    const jsonString = JSON.stringify(largeObject);
    const parseStart = performance.now();
    for (let i = 0; i < 50; i++) {
      JSON.parse(jsonString);
    }
    const parseEnd = performance.now();
    
    benchmarks.push({
      name: 'json_parse_50x_large_object',
      duration: parseEnd - parseStart,
      unit: 'ms',
      category: 'processing'
    });
    
    return benchmarks;
  }

  /**
   * Benchmark command loading performance
   */
  async benchmarkCommandLoading() {
    console.log('📋 Benchmarking command loading...');
    
    const benchmarks = [];
    
    try {
      // Simulate command registry loading
      const CommandRegistry = require('../../.claude/core/CommandRegistry');
      
      const loadStart = performance.now();
      const registry = new CommandRegistry();
      await registry.loadAllCommands();
      const loadEnd = performance.now();
      
      benchmarks.push({
        name: 'command_registry_load_all',
        duration: loadEnd - loadStart,
        unit: 'ms',
        category: 'application',
        metadata: {
          commandCount: Object.keys(registry.commands).length
        }
      });
      
      // Benchmark command search
      const searchStart = performance.now();
      for (let i = 0; i < 100; i++) {
        registry.searchCommands('test');
      }
      const searchEnd = performance.now();
      
      benchmarks.push({
        name: 'command_search_100x',
        duration: searchEnd - searchStart,
        unit: 'ms',
        category: 'application'
      });
      
    } catch (error) {
      console.log('⚠️  Could not benchmark command loading:', error.message);
    }
    
    return benchmarks;
  }

  /**
   * Benchmark MCP testing performance
   */
  async benchmarkMCPTesting() {
    console.log('🔌 Benchmarking MCP testing...');
    
    const benchmarks = [];
    
    try {
      // Simulate MCP tester operations
      const MCPTester = require('../../.claude/core/MCPTester');
      
      const initStart = performance.now();
      const tester = new MCPTester();
      const initEnd = performance.now();
      
      benchmarks.push({
        name: 'mcp_tester_initialization',
        duration: initEnd - initStart,
        unit: 'ms',
        category: 'application'
      });
      
      // Benchmark validation
      const mockConfig = {
        'test-server': {
          command: 'node',
          args: ['test.js']
        }
      };
      
      const validateStart = performance.now();
      for (let i = 0; i < 10; i++) {
        await tester.validateConfiguration(mockConfig);
      }
      const validateEnd = performance.now();
      
      benchmarks.push({
        name: 'mcp_validation_10x',
        duration: validateEnd - validateStart,
        unit: 'ms',
        category: 'application'
      });
      
    } catch (error) {
      console.log('⚠️  Could not benchmark MCP testing:', error.message);
    }
    
    return benchmarks;
  }

  /**
   * Helper method to traverse directory
   */
  traverseDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return [];
    
    const items = [];
    const entries = fs.readdirSync(dirPath);
    
    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry);
      const stat = fs.statSync(fullPath);
      
      items.push({ path: fullPath, isDirectory: stat.isDirectory() });
      
      if (stat.isDirectory() && !entry.startsWith('.')) {
        items.push(...this.traverseDirectory(fullPath));
      }
    });
    
    return items;
  }

  /**
   * Compare current benchmarks with baseline
   */
  compareWithBaseline(currentBenchmarks) {
    if (!this.results.baseline) {
      console.log('📊 No baseline for comparison, current run will become baseline');
      return;
    }
    
    console.log('🔍 Comparing with baseline...');
    
    const baselineMap = new Map(
      this.results.baseline.benchmarks.map(b => [b.name, b])
    );
    
    currentBenchmarks.forEach(current => {
      const baseline = baselineMap.get(current.name);
      
      if (!baseline) {
        console.log(`  📊 New benchmark: ${current.name}`);
        return;
      }
      
      const change = ((current.duration - baseline.duration) / baseline.duration) * 100;
      const changeAbs = Math.abs(change);
      
      const comparison = {
        name: current.name,
        category: current.category,
        current: current.duration,
        baseline: baseline.duration,
        change: change,
        changePercent: changeAbs,
        significant: changeAbs >= this.thresholds.significance
      };
      
      if (changeAbs >= this.thresholds.regression && change > 0) {
        comparison.type = 'regression';
        comparison.severity = changeAbs >= 50 ? 'critical' : 
                            changeAbs >= 30 ? 'high' : 'medium';
        this.results.regressions.push(comparison);
        
        if (comparison.severity === 'critical') {
          this.results.passed = false;
        }
        
        console.log(`  ❌ Regression: ${current.name} (+${change.toFixed(1)}%)`);
        
      } else if (changeAbs >= this.thresholds.improvement && change < 0) {
        comparison.type = 'improvement';
        this.results.improvements.push(comparison);
        console.log(`  ✅ Improvement: ${current.name} (${change.toFixed(1)}%)`);
        
      } else if (comparison.significant) {
        comparison.type = 'change';
        console.log(`  ℹ️  Change: ${current.name} (${change > 0 ? '+' : ''}${change.toFixed(1)}%)`);
      }
    });
  }

  /**
   * Run all performance benchmarks
   */
  async runBenchmarks() {
    console.log('🚀 Running performance benchmarks...\n');
    
    // Load baseline for comparison
    this.loadBaseline();
    
    // Run all benchmark suites
    const allBenchmarks = [
      ...await this.benchmarkFileOperations(),
      ...await this.benchmarkJSONProcessing(),
      ...await this.benchmarkCommandLoading(),
      ...await this.benchmarkMCPTesting()
    ];
    
    this.results.benchmarks = allBenchmarks;
    this.results.summary.totalBenchmarks = allBenchmarks.length;
    
    // Compare with baseline
    this.compareWithBaseline(allBenchmarks);
    
    // Update summary
    this.results.summary.regressionCount = this.results.regressions.length;
    this.results.summary.improvementCount = this.results.improvements.length;
    
    // Calculate average change
    const significantChanges = [...this.results.regressions, ...this.results.improvements];
    if (significantChanges.length > 0) {
      this.results.summary.averageChange = 
        significantChanges.reduce((sum, c) => sum + Math.abs(c.change), 0) / significantChanges.length;
    }
    
    return this.results.passed;
  }

  /**
   * Save performance results and update baseline
   */
  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsPath = path.join('ci', 'reports', 'performance', `performance-${timestamp}.json`);
    
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    
    // Update baseline if this run is clean (no critical regressions)
    const criticalRegressions = this.results.regressions.filter(r => r.severity === 'critical');
    if (criticalRegressions.length === 0) {
      const baselinePath = path.join('ci', 'reports', 'performance', 'baseline.json');
      const baselineData = {
        timestamp: this.results.timestamp,
        benchmarks: this.results.benchmarks,
        metadata: {
          createdFrom: resultsPath,
          previousBaseline: this.results.baseline?.timestamp
        }
      };
      fs.writeFileSync(baselinePath, JSON.stringify(baselineData, null, 2));
      console.log('📊 Updated performance baseline');
    }
    
    // Generate reports
    this.generateSummaryReport();
    
    // Create flag file for regressions
    if (this.results.regressions.length > 0) {
      const flagPath = path.join('ci', 'reports', 'performance-regressions.flag');
      fs.writeFileSync(flagPath, JSON.stringify({
        reason: 'Performance regressions detected',
        regressionCount: this.results.regressions.length,
        criticalCount: criticalRegressions.length,
        timestamp: this.results.timestamp
      }, null, 2));
    }
  }

  /**
   * Generate performance summary report
   */
  generateSummaryReport() {
    const { summary, regressions, improvements } = this.results;
    
    let report = `# Performance Monitor Report\n\n`;
    report += `**Status:** ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `**Timestamp:** ${this.results.timestamp}\n\n`;
    
    report += `## Summary\n\n`;
    report += `- **Total Benchmarks:** ${summary.totalBenchmarks}\n`;
    report += `- **Regressions:** ${summary.regressionCount}\n`;
    report += `- **Improvements:** ${summary.improvementCount}\n`;
    report += `- **Average Change:** ${summary.averageChange.toFixed(1)}%\n\n`;
    
    if (regressions.length > 0) {
      report += `## ⚠️ Performance Regressions\n\n`;
      regressions.forEach(reg => {
        report += `### ${reg.name}\n`;
        report += `- **Category:** ${reg.category}\n`;
        report += `- **Severity:** ${reg.severity}\n`;
        report += `- **Change:** +${reg.change.toFixed(1)}% (${reg.current.toFixed(1)}ms vs ${reg.baseline.toFixed(1)}ms)\n\n`;
      });
    }
    
    if (improvements.length > 0) {
      report += `## ✅ Performance Improvements\n\n`;
      improvements.forEach(imp => {
        report += `### ${imp.name}\n`;
        report += `- **Category:** ${imp.category}\n`;
        report += `- **Change:** ${imp.change.toFixed(1)}% (${imp.current.toFixed(1)}ms vs ${imp.baseline.toFixed(1)}ms)\n\n`;
      });
    }
    
    report += `## Benchmark Details\n\n`;
    report += `| Benchmark | Duration (ms) | Category |\n`;
    report += `|-----------|---------------|----------|\n`;
    
    this.results.benchmarks.forEach(benchmark => {
      report += `| ${benchmark.name} | ${benchmark.duration.toFixed(2)} | ${benchmark.category} |\n`;
    });
    
    fs.writeFileSync(path.join('ci', 'reports', 'performance-summary.md'), report);
  }

  /**
   * Print performance summary
   */
  printSummary() {
    console.log('\n⚡ Performance Monitor Complete');
    console.log('=================================');
    
    if (this.results.passed) {
      console.log('✅ No critical performance regressions');
    } else {
      console.log('❌ Critical performance regressions detected');
    }
    
    console.log(`📊 Benchmarks: ${this.results.summary.totalBenchmarks} completed`);
    console.log(`📈 Improvements: ${this.results.summary.improvementCount}`);
    console.log(`📉 Regressions: ${this.results.summary.regressionCount}`);
    
    if (this.results.summary.averageChange > 0) {
      console.log(`🔄 Average change: ${this.results.summary.averageChange.toFixed(1)}%`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.runBenchmarks().then(passed => {
    monitor.saveResults();
    monitor.printSummary();
    process.exit(passed ? 0 : 1);
  }).catch(error => {
    console.error('Performance monitoring failed:', error);
    process.exit(1);
  });
}

module.exports = PerformanceMonitor;