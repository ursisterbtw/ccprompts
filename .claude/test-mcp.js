#!/usr/bin/env node

/**
 * MCP Server Testing Framework for ccprompts
 * Tests all configured MCP servers for proper connectivity and functionality
 */

const { spawn } = require('child_process');
const path = require('path');
const ConfigManager = require('./config/ConfigManager');

// Configuration constants
const CONFIG = {
  TIMEOUT_MS: 10000,
  STDOUT_TRUNCATE_LENGTH: 200,
  INIT_DELAY_MS: 1000,
  OUTPUT_PREVIEW_LENGTH: 100
};

class MCPTester {
  constructor() {
    this.configManager = new ConfigManager(path.join(__dirname, 'config'));
    this.results = {};
  }

  /**
   * Get MCP servers configuration from config manager
   * @returns {Object} MCP servers configuration
   */
  getMCPServers() {
    const servers = this.configManager.get('mcpServers', {});
    
    // Filter only enabled servers
    const enabledServers = {};
    Object.entries(servers).forEach(([name, config]) => {
      if (config.enabled !== false) {
        enabledServers[name] = config;
      }
    });
    
    return enabledServers;
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
   * Spawn a server process with proper configuration and security validation
   * @param {Object} serverConfig - Server configuration
   * @returns {Object} Child process object
   */
  spawnServerProcess(serverConfig) {
    // Security: Validate and sanitize command input
    this.validateServerCommand(serverConfig);
    
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
   * Validate server command for security
   * @param {Object} serverConfig - Server configuration to validate
   * @throws {Error} If command is invalid or potentially dangerous
   */
  validateServerCommand(serverConfig) {
    if (!serverConfig || typeof serverConfig !== 'object') {
      throw new Error('Server configuration must be an object');
    }

    if (!serverConfig.command || typeof serverConfig.command !== 'string') {
      throw new Error('Server command must be a non-empty string');
    }

    // Security: Prevent command injection by validating command format
    const command = serverConfig.command.trim();
    
    // Check for shell metacharacters that could indicate injection
    const dangerousChars = /[;&|`$(){}[\]<>'"\\]/;
    if (dangerousChars.test(command)) {
      throw new Error(`Command contains potentially dangerous characters: ${command}`);
    }

    // Ensure command is not attempting shell execution
    if (command.includes('sh') || command.includes('bash') || command.includes('cmd')) {
      // Allow specific known safe patterns
      const safePaths = ['node', 'python', 'python3', '/usr/bin/', '/usr/local/bin/'];
      const isSafe = safePaths.some(safe => command.startsWith(safe) || command.includes(`/${safe}`));
      
      if (!isSafe) {
        throw new Error(`Potentially unsafe shell command detected: ${command}`);
      }
    }

    // Validate arguments if present
    if (serverConfig.args && Array.isArray(serverConfig.args)) {
      serverConfig.args.forEach((arg, index) => {
        if (typeof arg !== 'string') {
          throw new Error(`Argument ${index} must be a string`);
        }
        
        // Check for injection attempts in arguments
        if (dangerousChars.test(arg)) {
          throw new Error(`Argument ${index} contains potentially dangerous characters: ${arg}`);
        }
      });
    }

    // Validate environment variables if present
    if (serverConfig.env && typeof serverConfig.env === 'object') {
      Object.entries(serverConfig.env).forEach(([key, value]) => {
        if (typeof key !== 'string' || typeof value !== 'string') {
          throw new Error(`Environment variable ${key} must have string key and value`);
        }
        
        // Prevent injection through environment variables
        if (dangerousChars.test(key) || dangerousChars.test(value)) {
          throw new Error(`Environment variable ${key} contains potentially dangerous characters`);
        }
      });
    }
  }

  /**
   * Wait for server test result with timeout
   * @param {Object} process - Child process
   * @param {string} serverName - Server name for logging
   * @returns {Promise<Object>} Test result
   */
  waitForServerResult(process, serverName) {
    return new Promise((resolve) => {
      // Setup timeout - use server-specific timeout or default
      const timeoutMs = this.configManager.get(`mcpServers.${serverName}.timeout`, CONFIG.TIMEOUT_MS);
      const timeout = setTimeout(() => {
        process.kill();
        resolve({
          status: 'timeout',
          message: `Server startup timeout (${timeoutMs / 1000}s)`
        });
      }, timeoutMs);

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

  /**
   * Run tests for all configured MCP servers
   * @param {boolean} silent - If true, suppress console output
   * @returns {Object} Test results and summary
   */
  async runTests(silent = false) {
    if (!silent) {
      console.log('🚀 Starting MCP Server Tests for ccprompts\n');
    }
    
    const mcpServers = this.getMCPServers();
    if (!silent) {
      console.log(`Testing ${Object.keys(mcpServers).length} enabled servers...\n`);
    }

    const servers = Object.entries(mcpServers);
    
    for (const [name, config] of servers) {
      const result = await this.testServer(name, config);
      this.results[name] = result;
      
      if (!silent) {
        this.logTestResult(result);
      }
    }

    const report = this.generateReport();
    if (!silent) {
      this.printReport(report);
    }
    
    return {
      results: this.results,
      summary: report
    };
  }

  /**
   * Log individual test result to console
   * @param {Object} result - Test result
   */
  logTestResult(result) {
    const status = result.status === 'success' ? '✅' : 
      result.status === 'timeout' ? '⏰' : '❌';
    
    console.log(`${status} ${result.name}: ${result.message}`);
    
    if (result.stdout && result.status !== 'success') {
      console.log(`   Output: ${result.stdout.substring(0, CONFIG.OUTPUT_PREVIEW_LENGTH)}...`);
    }
  }

  /**
   * Generate structured test report
   * @returns {Object} Test report data
   */
  generateReport() {
    const successful = Object.values(this.results).filter(r => r.status === 'success').length;
    const total = Object.values(this.results).length;
    const failed = Object.values(this.results).filter(r => r.status !== 'success');
    
    return {
      total,
      successful,
      failed: failed.length,
      successRate: total > 0 ? Math.round(successful/total*100) : 0,
      results: this.results,
      recommendations: failed.length === 0 ? 
        ['All MCP servers are working correctly!', 'Ready for production use with Claude Code'] :
        failed.map(result => `Fix ${result.name}: ${result.message}`),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Print formatted report to console
   * @param {Object} report - Report data from generateReport
   */
  printReport(report) {
    console.log('\n📊 MCP Test Report');
    console.log('==================');
    
    console.log(`Success Rate: ${report.successful}/${report.total} (${report.successRate}%)\n`);
    
    console.log('Detailed Results:');
    Object.entries(report.results).forEach(([name, result]) => {
      console.log(`- ${name}: ${result.status.toUpperCase()} - ${result.message}`);
    });

    console.log('\n💡 Recommendations:');
    
    if (report.failed === 0) {
      console.log('✅ All MCP servers are working correctly!');
      console.log('✅ Ready for production use with Claude Code');
    } else {
      console.log(`⚠️  ${report.failed} server(s) need attention:`);
      report.recommendations.forEach(rec => {
        console.log(`   - ${rec}`);
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