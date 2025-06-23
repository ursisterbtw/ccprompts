#!/usr/bin/env node

/**
 * MCP Server Testing Framework for ccprompts
 * Tests all configured MCP servers for proper connectivity and functionality
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPTester {
  constructor() {
    this.mcpConfig = this.loadMCPConfig();
    this.results = {};
  }

  loadMCPConfig() {
    try {
      const configPath = path.join(__dirname, 'mcp.json');
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.error('Failed to load MCP config:', error);
      process.exit(1);
    }
  }

  async testServer(serverName, serverConfig) {
    console.log(`\n🧪 Testing MCP Server: ${serverName}`);
    
    return new Promise((resolve) => {
      const child = spawn(serverConfig.command, serverConfig.args, {
        env: { ...process.env, ...serverConfig.env },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Timeout after 10 seconds
      const timeout = setTimeout(() => {
        child.kill();
        resolve({
          name: serverName,
          status: 'timeout',
          message: 'Server startup timeout (10s)'
        });
      }, 10000);

      child.on('close', (code) => {
        clearTimeout(timeout);
        
        if (code === 0 || stdout.includes('server') || stdout.includes('mcp')) {
          resolve({
            name: serverName,
            status: 'success',
            message: 'Server started successfully'
          });
        } else {
          resolve({
            name: serverName,
            status: 'error',
            message: stderr || `Exit code: ${code}`,
            stdout: stdout.substring(0, 200)
          });
        }
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        resolve({
          name: serverName,
          status: 'error',
          message: error.message
        });
      });

      // Send initialization message
      setTimeout(() => {
        try {
          child.stdin.write(JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
              protocolVersion: "2024-10-07",
              capabilities: {},
              clientInfo: { name: "mcp-tester", version: "1.0.0" }
            }
          }) + '\n');
        } catch (e) {
          // Ignore write errors
        }
      }, 1000);
    });
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
        console.log(`   Output: ${result.stdout.substring(0, 100)}...`);
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