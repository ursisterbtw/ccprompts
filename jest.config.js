module.exports = {
  // test env
  testEnvironment: 'node',
  
  // test dirs and patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  
  // coverage config
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
  
  // module and path config
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // setup and teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // test timeout (45s for validation tests)
  testTimeout: 45000,
  
  // verbose output
  verbose: true,
  
  // transform config
  transform: {},
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/build/',
    '/scripts/validators/node_modules/'
  ],

  // env vars for testing
  setupFiles: ['<rootDir>/tests/jest-env-setup.js'],

  // test result processors
  reporters: ['default'],

  // global teardown
  globalTeardown: '<rootDir>/tests/jest-teardown.js'
};