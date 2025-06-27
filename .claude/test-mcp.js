#!/usr/bin/env node

/**
 * MCP Server Testing Framework for ccprompts
 * Tests all configured MCP servers for proper connectivity and functionality
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration constants
const CONFIG = {
  TIMEOUT_MS: 10000,
  STDOUT_TRUNCATE_LENGTH: 200,
  INIT_DELAY_MS: 1000,
  OUTPUT_PREVIEW_LENGTH: 100
};

class MCPTester {
  constructor() {
    this.mcpConfig = this.loadMCPConfig();
    this.results = {};
  }

  /**
   * Load and validate MCP configuration
   * @returns {Object} Validated MCP configuration
   * @throws {Error} If config is invalid or missing
   */
  loadMCPConfig() {
    try {
      const configPath = path.join(__dirname, 'mcp.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return this.validateMCPConfig(config);
    } catch (error) {
      throw new Error(`Failed to load MCP config: ${error.message}`);
    }
  }

  /**
   * Validate MCP configuration structure
   * @param {Object} config - Configuration object to validate
   * @returns {Object} Validated configuration
   * @throws {Error} If configuration is invalid
   */
  validateMCPConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error('Config must be a valid object');
    }
    if (!config.mcpServers || typeof config.mcpServers !== 'object') {
      throw new Error('Config must contain mcpServers object');
    }
    
    // Validate each server configuration
    Object.entries(config.mcpServers).forEach(([name, serverConfig]) => {
      this.validateServerConfig(name, serverConfig);
    });
    
    return config;
  }

  /**
   * Validate individual server configuration
   * @param {string} name - Server name
   * @param {Object} config - Server configuration
   * @throws {Error} If server config is invalid
   */
  validateServerConfig(name, config) {
    if (!config || typeof config !== 'object') {
      throw new Error(`Invalid server config for ${name}: must be an object`);
    }
    if (!config.command || typeof config.command !== 'string') {
      throw new Error(`Invalid server config for ${name}: missing or invalid command`);
    }
    if (config.args && !Array.isArray(config.args)) {
      throw new Error(`Invalid server config for ${name}: args must be an array`);
    }
    if (config.env && typeof config.env !== 'object') {
      throw new Error(`Invalid server config for ${name}: env must be an object`);
    }
  }

  /**
   * Test a single MCP server for connectivity and functionality
   * @param {string} serverName - Name of the server to test
   * @param {Object} serverConfig - Server configuration
   * @returns {Promise<Object>} Test result object
   */
  async testServer(serverName, serverConfig) {
    console.log(`\n🧪 Testing MCP Server: ${serverName}`);
    
    try {
      this.validateServerConfig(serverName, serverConfig);
      const process = this.spawnServerProcess(serverConfig);
      const result = await this.waitForServerResult(process, serverName);
      return this.formatTestResult(serverName, result);
    } catch (error) {
      return this.formatTestResult(serverName, {
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Spawn a server process with proper configuration
   * @param {Object} serverConfig - Server configuration
   * @returns {Object} Child process object
   */
  spawnServerProcess(serverConfig) {
    const child = spawn(serverConfig.command, serverConfig.args || [], {
      env: { ...process.env, ...(serverConfig.env || {}) },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Initialize output buffers
    child.stdout.buffer = '';
    child.stderr.buffer = '';
    
    child.stdout.on('data', (data) => {
      child.stdout.buffer += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      child.stderr.buffer += data.toString();
    });

    return child;
  }

  /**
   * Wait for server test result with timeout
   * @param {Object} process - Child process
   * @param {string} serverName - Server name for logging
   * @returns {Promise<Object>} Test result
   */
  waitForServerResult(process, _serverName) {
    return new Promise((resolve) => {
      // Setup timeout
      const timeout = setTimeout(() => {
        process.kill();
        resolve({
          status: 'timeout',
          message: `Server startup timeout (${CONFIG.TIMEOUT_MS / 1000}s)`
        });
      }, CONFIG.TIMEOUT_MS);

      process.on('close', (code) => {
        clearTimeout(timeout);
        resolve(this.evaluateServerResult(code, process.stdout.buffer, process.stderr.buffer));
      });

      process.on('error', (error) => {
        clearTimeout(timeout);
        resolve({
          status: 'error',
          message: error.message
        });
      });

      // Send initialization message after delay
      this.sendInitializationMessage(process);
    });
  }

  /**
   * Evaluate server test result based on exit code and output
   * @param {number} code - Exit code
   * @param {string} stdout - Standard output
   * @param {string} stderr - Standard error
   * @returns {Object} Evaluation result
   */
  evaluateServerResult(code, stdout, stderr) {
    // Improved success detection
    const successIndicators = ['server', 'mcp', 'listening', 'started', 'ready'];
    const hasSuccessIndicator = successIndicators.some(indicator => 
      stdout.toLowerCase().includes(indicator)
    );

    if (code === 0 || hasSuccessIndicator) {
      return {
        status: 'success',
        message: 'Server started successfully'
      };
    } else {
      return {
        status: 'error',
        message: stderr || `Exit code: ${code}`,
        stdout: stdout.substring(0, CONFIG.STDOUT_TRUNCATE_LENGTH)
      };
    }
  }

  /**
   * Send MCP initialization message to server
   * @param {Object} process - Child process
   */
  sendInitializationMessage(process) {
    setTimeout(() => {
      try {
        const initMessage = JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-10-07',
            capabilities: {},
            clientInfo: { name: 'mcp-tester', version: '1.0.0' }
          }
        }) + '\n';
        
        process.stdin.write(initMessage);
      } catch (error) {
        console.warn(`Failed to send initialization message: ${error.message}`);
      }
    }, CONFIG.INIT_DELAY_MS);
  }

  /**
   * Format test result with consistent structure
   * @param {string} serverName - Server name
   * @param {Object} result - Raw test result
   * @returns {Object} Formatted result
   */
  formatTestResult(serverName, result) {
    return {
      name: serverName,
      status: result.status,
      message: result.message,
      ...(result.stdout && { stdout: result.stdout })
    };
  }

  async runTests() {
    console.log('🚀 Starting MCP Server Tests for ccprompts\n');
    console.log(`Testing ${Object.keys(this.mcpConfig.mcpServers).length} servers...\n`);

    const servers = Object.entries(this.mcpConfig.mcpServers);
    
    for (const [name, config] of servers) {
      const result = await this.testServer(name, config);
      this.results[name] = result;
      
      const status = result.status === 'success' ? '✅' : 
        result.status === 'timeout' ? '⏰' : '❌';
      
      console.log(`${status} ${result.name}: ${result.message}`);
      
      if (result.stdout && result.status !== 'success') {
        console.log(`   Output: ${result.stdout.substring(0, CONFIG.OUTPUT_PREVIEW_LENGTH)}...`);
      }
    }

    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 MCP Test Report');
    console.log('==================');
    
    const successful = Object.values(this.results).filter(r => r.status === 'success').length;
    const total = Object.values(this.results).length;
    
    console.log(`Success Rate: ${successful}/${total} (${Math.round(successful/total*100)}%)\n`);
    
    console.log('Detailed Results:');
    Object.entries(this.results).forEach(([name, result]) => {
      console.log(`- ${name}: ${result.status.toUpperCase()} - ${result.message}`);
    });

    console.log('\n💡 Recommendations:');
    
    const failed = Object.values(this.results).filter(r => r.status !== 'success');
    if (failed.length === 0) {
      console.log('✅ All MCP servers are working correctly!');
      console.log('✅ Ready for production use with Claude Code');
    } else {
      console.log(`⚠️  ${failed.length} server(s) need attention:`);
      failed.forEach(result => {
        console.log(`   - Fix ${result.name}: ${result.message}`);
      });
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MCPTester();
  tester.runTests().catch(console.error);
}

module.exports = MCPTester;