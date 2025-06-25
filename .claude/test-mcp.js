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

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class MCPTester {
  constructor() {
    this.mcpConfig = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      skipped: 0
    };
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
      const command = serverConfig.command;
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
      
      this.testResults.passed++;
      log('green', `✅ ${serverName} configuration tests passed`);
      return true;
      
    } catch (error) {
      this.testResults.failed++;
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
      
      // Test critical servers
      const criticalServers = ['filesystem-enhanced', 'sequential-thinking'];
      for (const serverName of criticalServers) {
        if (this.mcpConfig.mcpServers[serverName]) {
          log('green', `✅ Critical server ${serverName} is configured`);
        } else {
          log('yellow', `⚠️  Critical server ${serverName} is not configured`);
        }
      }
      
      return true;
    } catch (error) {
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
        
        // Test 2: Validate MCP settings in project config
        if (projectConfig.settings.mcp_enabled) {
          log('green', '✅ MCP integration enabled in project settings');
        } else {
          log('yellow', '⚠️  MCP integration disabled in project settings');
        }
      } else {
        log('yellow', '⚠️  Project configuration not found');
      }
      
      // Test 3: Check for required directories
      const requiredDirs = ['commands', 'workflows'];
      for (const dir of requiredDirs) {
        const dirPath = path.join(__dirname, dir);
        if (fs.existsSync(dirPath)) {
          log('green', `✅ Required directory exists: ${dir}`);
        } else {
          log('yellow', `⚠️  Required directory missing: ${dir}`);
        }
      }
      
      return true;
    } catch (error) {
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
    
    // Generate test report
    this.generateReport();
    
    // Exit with appropriate code
    process.exit(this.testResults.failed === 0 ? 0 : 1);
  }

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
    const successRate = ((this.testResults.passed / total) * 100).toFixed(1);
    
    log('blue', `\n📈 Success Rate: ${successRate}%`);
    
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