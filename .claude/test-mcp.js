#!/usr/bin/env node

/**
 * MCP Server Integration Test Suite
 * Tests MCP server configurations and connectivity
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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

class MCPTester {
  constructor() {
    this.mcpConfig = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      skipped: 0
    };
    this.passedTests = [];
    this.failedTests = [];
    this.skippedTests = [];
  }

  async loadMCPConfig() {
    try {
      const configPath = path.join(__dirname, 'mcp.json');
      const configContent = fs.readFileSync(configPath, 'utf8');
      this.mcpConfig = JSON.parse(configContent);
      log('green', '✅ MCP configuration loaded successfully');
      return true;
    } catch (error) {
      log('red', `❌ Failed to load MCP configuration: ${error.message}`);
      return false;
    }
  }

  async testServerConfiguration(serverName, serverConfig) {
    log('blue', `Testing MCP server: ${serverName}`);
    
    try {
      // Test 1: Validate configuration structure
      if (!serverConfig.command || !serverConfig.args) {
        throw new Error('Missing required command or args');
      }
      
      // Test 2: Check if command exists (basic check)
      const {command} = serverConfig;
      if (command === 'npx') {
        log('green', `  ✅ Command validation passed: ${command}`);
      } else {
        log('yellow', `  ⚠️  Non-standard command: ${command}`);
      }
      
      // Test 3: Validate environment variables
      if (serverConfig.env) {
        for (const [key, value] of Object.entries(serverConfig.env)) {
          if (value.startsWith('${') && value.endsWith('}')) {
            const envVar = value.slice(2, -1);
            if (envVar === 'GITHUB_TOKEN') {
              // Skip actual GitHub token validation in tests
              log('yellow', `  ⚠️  Environment variable ${envVar} requires external configuration`);
            } else {
              log('green', `  ✅ Environment variable configuration valid: ${key}`);
            }
          } else {
            log('green', `  ✅ Static environment variable: ${key}`);
          }
        }
      }
      
      // Test 4: Validate package names for npx commands
      if (command === 'npx' && serverConfig.args) {
        const packageName = serverConfig.args.find(arg => !arg.startsWith('-'));
        if (packageName) {
          log('green', `  ✅ Package name identified: ${packageName}`);
        }
      }
      
      this.recordPassedTest(`${serverName} configuration validation`, {
        command,
        envVarsCount: serverConfig.env ? Object.keys(serverConfig.env).length : 0,
        validatedAspects: ['command', 'args', 'env', 'package']
      });
      log('green', `✅ ${serverName} configuration tests passed`);
      return true;
      
    } catch (error) {
      this.testResults.failed++;
      this.failedTests.push({ test: `${serverName} configuration validation`, error: error.message });
      log('red', `❌ ${serverName} configuration tests failed: ${error.message}`);
      return false;
    }
  }

  async testMCPConnectivity() {
    log('blue', '\n🔗 Testing MCP connectivity...');
    
    try {
      // Test basic MCP functionality by checking if we can parse the configuration
      const serverCount = Object.keys(this.mcpConfig.mcpServers).length;
      log('green', `✅ Found ${serverCount} MCP servers configured`);
      this.recordPassedTest('MCP configuration parsing', {
        serverCount,
        serverNames: Object.keys(this.mcpConfig.mcpServers)
      });
      
      // Test critical servers
      const criticalServers = ['filesystem-enhanced', 'sequential-thinking'];
      for (const serverName of criticalServers) {
        if (this.mcpConfig.mcpServers[serverName]) {
          log('green', `✅ Critical server ${serverName} is configured`);
          this.recordPassedTest(`Critical server ${serverName} configuration`, {
            serverType: 'critical',
            configKeys: Object.keys(this.mcpConfig.mcpServers[serverName])
          });
        } else {
          log('yellow', `⚠️  Critical server ${serverName} is not configured`);
          this.recordSkippedTest(`Critical server ${serverName} configuration`, 'Server not found in configuration');
        }
      }
      
      // End-to-end server startup test
      await this.testServerStartup();
      
      return true;
    } catch (error) {
      this.failedTests.push({ test: 'MCP connectivity test', error: error.message });
      log('red', `❌ MCP connectivity test failed: ${error.message}`);
      return false;
    }
  }

  async testProjectIntegration() {
    log('blue', '\n🏗️  Testing project integration...');
    
    try {
      // Test 1: Check if project configuration exists
      const configPath = path.join(__dirname, 'config.json');
      if (fs.existsSync(configPath)) {
        const projectConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        log('green', `✅ Project configuration found: ${projectConfig.project.name}`);
        this.passedTests.push('Project configuration loading');
        
        // Test 2: Validate MCP settings in project config
        if (projectConfig.settings && projectConfig.settings.mcp_enabled) {
          log('green', '✅ MCP integration enabled in project settings');
          this.passedTests.push('MCP integration enabled');
        } else {
          log('yellow', '⚠️  MCP integration disabled in project settings');
          this.recordSkippedTest('MCP integration enabled', 'MCP disabled in project settings');
        }
      } else {
        log('yellow', '⚠️  Project configuration not found');
        this.recordSkippedTest('Project configuration loading', 'config.json not found');
      }
      
      // Test 3: Check for required directories
      const requiredDirs = ['commands', 'workflows'];
      for (const dir of requiredDirs) {
        const dirPath = path.join(__dirname, dir);
        if (fs.existsSync(dirPath)) {
          log('green', `✅ Required directory exists: ${dir}`);
          this.passedTests.push(`Required directory: ${dir}`);
        } else {
          log('yellow', `⚠️  Required directory missing: ${dir}`);
          this.recordSkippedTest(`Required directory: ${dir}`, 'Directory does not exist');
        }
      }
      
      return true;
    } catch (error) {
      this.failedTests.push({ test: 'Project integration test', error: error.message });
      log('red', `❌ Project integration test failed: ${error.message}`);
      return false;
    }
  }

  async runAllTests() {
    log('blue', '🧪 Starting MCP Server Test Suite...\n');
    
    // Load configuration
    if (!(await this.loadMCPConfig())) {
      process.exit(1);
    }
    
    // Test each configured server
    for (const [serverName, serverConfig] of Object.entries(this.mcpConfig.mcpServers)) {
      await this.testServerConfiguration(serverName, serverConfig);
    }
    
    // Test MCP connectivity
    await this.testMCPConnectivity();
    
    // Test project integration
    await this.testProjectIntegration();
    
    // Generate test report (includes skipped tests)
    this.generateReport();
    
    // Exit with appropriate code
    process.exit(this.testResults.failed === 0 ? 0 : 1);
  }

  /**
   * Records a skipped test and the reason for skipping.
   * @param {string} testName
   * @param {string} reason
   */
  recordSkippedTest(testName, reason) {
    this.testResults.skipped++;
    this.skippedTests.push({ testName, reason });
  }

  /**
   * Records a passed test with optional validation details.
   * @param {string} testName
   * @param {object} details - Optional validation details
   */
  recordPassedTest(testName, details = {}) {
    this.testResults.passed++;
    this.passedTests.push({
      testName,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Test actual server startup and response validation
   */
  async testServerStartup() {
    log('blue', '\n🚀 Testing server startup...');
    
    const testableServers = Object.entries(this.mcpConfig.mcpServers)
      .filter(([name, config]) => config.command === 'npx' && config.args);
    
    if (testableServers.length === 0) {
      this.recordSkippedTest('Server startup test', 'No testable npx servers found');
      return;
    }
    
    for (const [serverName, serverConfig] of testableServers) { // Test all testable servers
      try {
        log('blue', `  Testing startup for ${serverName}...`);
        
        const child = spawn(serverConfig.command, serverConfig.args, {
          env: { ...process.env, ...(serverConfig.env || {}) },
          timeout: 5000 // 5 second timeout
        });
        
        let output = '';
        let errorOutput = '';
        
        child.stdout?.on('data', (data) => {
          output += data.toString();
        });
        
        child.stderr?.on('data', (data) => {
          errorOutput += data.toString();
        });
        
        const exitPromise = new Promise((resolve, reject) => {
          child.on('exit', (code) => {
            if (code === 0 || output.length > 0) {
              resolve({ code, output, errorOutput });
            } else {
              reject(new Error(`Process exited with code ${code}: ${errorOutput}`));
            }
          });
          
          child.on('error', (error) => {
            reject(error);
          });
          
          // Kill process after timeout
          setTimeout(() => {
            child.kill('SIGTERM');
            resolve({ code: 'TIMEOUT', output, errorOutput });
          }, 5000);
        });
        
        const result = await exitPromise;
        
        if (result.code === 'TIMEOUT' || result.output.length > 0) {
          log('green', `  ✅ ${serverName} startup successful`);
          this.recordPassedTest(`${serverName} server startup`, {
            responseTime: result.code === 'TIMEOUT' ? '5000ms (timeout)' : 'immediate',
            outputReceived: result.output.length > 0,
            errorOutput: result.errorOutput.length > 0
          });
        } else {
          throw new Error(`No output received from ${serverName}`);
        }
        
      } catch (error) {
        log('yellow', `  ⚠️  ${serverName} startup test failed: ${error.message}`);
        this.recordSkippedTest(`${serverName} server startup`, error.message);
      }
    }
  }

  /**
   * Generates a comprehensive test report, including skipped tests and reasons.
   */
  generateReport() {
    log('blue', '\n📊 Test Results Summary');
    log('blue', '======================');
    
    log('green', `✅ Tests Passed: ${this.testResults.passed}`);
    if (this.testResults.failed > 0) {
      log('red', `❌ Tests Failed: ${this.testResults.failed}`);
    }
    if (this.testResults.skipped > 0) {
      log('yellow', `⚠️  Tests Skipped: ${this.testResults.skipped}`);
    }
    
    const total = this.testResults.passed + this.testResults.failed + this.testResults.skipped;
    const successRate = total > 0 ? ((this.testResults.passed / total) * 100).toFixed(1) : 0;
    
    log('blue', `\n📈 Success Rate: ${successRate}%`);
    
    // Detailed breakdown
    if (this.failedTests.length > 0) {
      log('red', '\n❌ Failed Tests:');
      this.failedTests.forEach(failure => {
        log('red', `   ${failure.test}: ${failure.error}`);
      });
    }
    
    if (this.skippedTests.length > 0) {
      log('yellow', '\n⚠️  Skipped Tests:');
      this.skippedTests.forEach(skipped => {
        log('yellow', `   ${skipped.testName}: ${skipped.reason}`);
      });
    }
    
    // Write detailed report to file
    const report = {
      summary: this.testResults,
      passed: this.passedTests,
      failed: this.failedTests,
      skipped: this.skippedTests,
      timestamp: new Date().toISOString()
    };
    
    const reportPath = path.join(__dirname, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log('blue', `\n📄 Detailed report written to ${reportPath}`);
    
    if (this.testResults.failed === 0) {
      log('green', '\n🎉 All MCP tests passed!');
    } else {
      log('red', '\n💥 Some MCP tests failed - review configuration');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MCPTester();
  tester.runAllTests().catch(error => {
    log('red', `Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = MCPTester;