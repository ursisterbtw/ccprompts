/**
 * Jest Setup for CI Environment
 * Configure test environment and global mocks
 */

// Set CI environment variables
process.env.CI = 'true';
process.env.NODE_ENV = 'test';

// Extend default timeout for CI environment
jest.setTimeout(30000);

// Global test utilities
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock console methods to capture output for testing
global.mockConsole = () => {
  const originalConsole = global.console;
  
  return {
    log: jest.spyOn(console, 'log').mockImplementation(() => {}),
    warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
    error: jest.spyOn(console, 'error').mockImplementation(() => {}),
    info: jest.spyOn(console, 'info').mockImplementation(() => {}),
    
    restore: () => {
      console.log.mockRestore();
      console.warn.mockRestore();
      console.error.mockRestore();
      console.info.mockRestore();
    }
  };
};

// Global test data
global.testData = {
  validMCPConfig: {
    'test-server': {
      command: 'node',
      args: ['test-server.js'],
      env: {
        TEST_MODE: 'true'
      }
    }
  },
  
  validCommandConfig: {
    name: 'test-command',
    description: 'Test command for CI',
    category: 'test',
    parameters: {
      input: {
        type: 'string',
        required: true,
        description: 'Test input parameter'
      }
    }
  }
};

// Setup performance monitoring
global.performance = global.performance || {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {}
};

// CI-specific test helpers
global.ciHelpers = {
  /**
   * Create temporary test directory
   */
  createTempDir: () => {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    const tempDir = path.join(os.tmpdir(), `ccprompts-test-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    
    return tempDir;
  },
  
  /**
   * Clean up temporary directory
   */
  cleanupTempDir: (dir) => {
    const fs = require('fs');
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  },
  
  /**
   * Create mock file system structure
   */
  createMockFS: (structure, baseDir) => {
    const fs = require('fs');
    const path = require('path');
    
    Object.entries(structure).forEach(([filepath, content]) => {
      const fullPath = path.join(baseDir, filepath);
      const dirname = path.dirname(fullPath);
      
      fs.mkdirSync(dirname, { recursive: true });
      
      if (typeof content === 'string') {
        fs.writeFileSync(fullPath, content);
      } else if (content === null) {
        // Create directory
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }
};

// Mock external dependencies that may not be available in CI
jest.mock('child_process', () => ({
  spawn: jest.fn(() => ({
    stdout: { 
      on: jest.fn(),
      buffer: ''
    },
    stderr: { 
      on: jest.fn(),
      buffer: ''
    },
    on: jest.fn(),
    kill: jest.fn()
  })),
  exec: jest.fn(),
  execSync: jest.fn()
}));

// Mock file system operations for isolation
const mockFS = {};
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn((path, data) => {
    mockFS[path] = data;
  }),
  readFileSync: jest.fn((path) => {
    if (mockFS[path]) return mockFS[path];
    return jest.requireActual('fs').readFileSync(path);
  }),
  existsSync: jest.fn((path) => {
    return mockFS[path] !== undefined || jest.requireActual('fs').existsSync(path);
  })
}));

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Cleanup after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Clear mock file system
  Object.keys(mockFS).forEach(key => delete mockFS[key]);
  
  // Clear environment variables that might have been set during tests
  const testEnvVars = Object.keys(process.env).filter(key => key.startsWith('CCPROMPTS_TEST_'));
  testEnvVars.forEach(key => delete process.env[key]);
});

// Global setup completed
console.log('Jest CI setup completed');