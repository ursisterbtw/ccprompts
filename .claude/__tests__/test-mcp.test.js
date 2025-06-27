/**
 * Test suite for MCP Testing Framework
 * Validates existing functionality before refactoring
 */

const MCPTester = require('../test-mcp');
const fs = require('fs');
const path = require('path');

// Mock child_process to avoid actual process spawning in tests
jest.mock('child_process');

describe('MCPTester', () => {
  let tester;
  let mockConfig;

  beforeEach(() => {
    // Mock MCP configuration
    mockConfig = {
      mcpServers: {
        'test-server': {
          command: 'node',
          args: ['test-server.js'],
          env: { TEST_MODE: 'true' }
        },
        'another-server': {
          command: 'python',
          args: ['-m', 'mcp_server'],
          env: {}
        }
      }
    };

    // Mock fs.readFileSync to return our test config
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockConfig));
    
    tester = new MCPTester();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getMCPServers', () => {
    test('should get enabled MCP servers from configuration', () => {
      const servers = tester.getMCPServers();
      expect(typeof servers).toBe('object');
      // Should filter out disabled servers if any exist
    });

    test('should handle empty server configuration', () => {
      // Mock empty configuration
      jest.spyOn(tester.configManager, 'get').mockReturnValue({});
      
      const servers = tester.getMCPServers();
      expect(servers).toEqual({});
    });
  });

  describe('testServer', () => {
    test('should handle server timeout', async () => {
      const { spawn } = require('child_process');
      const mockChild = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        stdin: { write: jest.fn() },
        on: jest.fn(),
        kill: jest.fn()
      };

      spawn.mockReturnValue(mockChild);

      // Mock timeout behavior
      setTimeout(() => {
        const timeoutCallback = mockChild.on.mock.calls.find(
          call => call[0] === 'close'
        );
        if (timeoutCallback) {
          timeoutCallback[1](1); // Exit with error code
        }
      }, 0);

      const result = await tester.testServer('test-server', mockConfig.mcpServers['test-server']);
      
      expect(result.name).toBe('test-server');
      expect(['timeout', 'error']).toContain(result.status);
    });

    test('should handle successful server start', async () => {
      const { spawn } = require('child_process');
      const mockChild = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        stdin: { write: jest.fn() },
        on: jest.fn(),
        kill: jest.fn()
      };

      spawn.mockReturnValue(mockChild);

      // Mock successful server response
      setTimeout(() => {
        const stdoutCallback = mockChild.stdout.on.mock.calls.find(
          call => call[0] === 'data'
        );
        if (stdoutCallback) {
          stdoutCallback[1]('server started successfully');
        }

        const closeCallback = mockChild.on.mock.calls.find(
          call => call[0] === 'close'
        );
        if (closeCallback) {
          closeCallback[1](0); // Exit successfully
        }
      }, 0);

      const result = await tester.testServer('test-server', mockConfig.mcpServers['test-server']);
      
      expect(result.name).toBe('test-server');
      expect(result.status).toBe('success');
    });
  });

  describe('generateReport', () => {
    test('should generate report with success metrics', () => {
      const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      tester.results = {
        'server1': { status: 'success', message: 'OK' },
        'server2': { status: 'success', message: 'OK' },
        'server3': { status: 'error', message: 'Failed' }
      };

      tester.generateReport();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Success Rate: 2/3 (67%)')
      );
    });
  });
});