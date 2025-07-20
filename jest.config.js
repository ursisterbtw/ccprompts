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
      branches: 35,
      functions: 45,
      lines: 40,
      statements: 40
    }
  },
  
  // Module and path configuration
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Setup and teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test timeout (30 seconds for validation tests)
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Transform configuration
  transform: {},
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/build/'
  ]
};