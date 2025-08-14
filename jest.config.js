module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test directories and patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'scripts/**/*.js',
    '!scripts/test/**/*.js',
    '!**/node_modules/**',
    '!coverage/**'
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    },
    './scripts/validate-commands.js': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    },
    './scripts/safety-validator.js': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  
  // Module and path configuration
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Setup and teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test timeout (45 seconds for comprehensive validation tests)
  testTimeout: 45000,
  
  // Verbose output
  verbose: true,
  
  // Transform configuration
  transform: {},
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/build/',
    '/scripts/validators/node_modules/'
  ],

  // Environment variables for testing
  setupFiles: ['<rootDir>/tests/jest-env-setup.js'],

  // Test result processors
  reporters: ['default'],

  // Global teardown
  globalTeardown: '<rootDir>/tests/jest-teardown.js'
};