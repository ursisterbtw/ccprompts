/**
 * Jest Configuration for CI Pipeline
 * Optimized for speed, coverage, and reporting
 */

module.exports = {
  // Extend base Jest configuration
  ...require('../../package.json').jest,
  
  // CI-specific optimizations
  testEnvironment: 'node',
  verbose: true,
  
  // Performance optimizations for CI
  maxWorkers: '50%',  // Use half the available CPU cores
  cache: false,  // Disable cache in CI for clean runs
  bail: 1,  // Stop after first test failure (fast feedback)
  
  // Coverage configuration
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  
  // Coverage reporting optimized for CI
  coverageReporters: [
    'json-summary',  // For automated processing
    'lcov',          // For coverage visualization
    'text',          // For console output
    'cobertura',     // For CI integration
    'html'           // For detailed reports
  ],
  
  coverageDirectory: 'coverage',
  
  // Enhanced coverage collection
  collectCoverageFrom: [
    '.claude/**/*.js',
    'ci/scripts/**/*.js',
    '!.claude/cache/**',
    '!.claude/logs/**',
    '!.claude/temp/**',
    '!.claude/**/__tests__/**',
    '!.claude/**/*.test.js',
    '!.claude/**/*.spec.js',
    '!ci/reports/**',
    '!**/node_modules/**'
  ],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Setup files for CI environment
  setupFilesAfterEnv: [
    '<rootDir>/ci/configs/jest-setup.js'
  ],
  
  // Reporters for CI integration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'ci/reports',
        outputName: 'test-results.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: false,
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}'
      }
    ],
    [
      'jest-html-reporters',
      {
        publicPath: 'ci/reports',
        filename: 'test-report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'ccprompts Test Report'
      }
    ]
  ],
  
  // Global test configuration
  globals: {
    CI: true,
    NODE_ENV: 'test'
  },
  
  // Module name mapping for CI
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/.claude/$1',
    '^@ci/(.*)$': '<rootDir>/ci/$1'
  },
  
  // Test timeout for CI (longer due to resource constraints)
  testTimeout: 30000,
  
  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // CI-specific test environment variables
  testEnvironmentOptions: {
    NODE_ENV: 'test',
    CI: 'true'
  },
  
  // Error handling
  errorOnDeprecated: true,
  
  // Snapshot configuration
  updateSnapshot: false,  // Never update snapshots in CI
  
  // Watch mode (disabled in CI)
  watchman: false,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Detect open handles and prevent hanging
  detectOpenHandles: true,
  forceExit: true,
  
  // Notify configuration (disabled in CI)
  notify: false,
  
  // CI-specific patterns to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/ci/reports/',
    '\\.cache/',
    '\\.git/'
  ],
  
  // Module path ignore patterns
  modulePathIgnorePatterns: [
    '<rootDir>/coverage/',
    '<rootDir>/ci/reports/',
    '<rootDir>/node_modules/'
  ],
  
  // Preprocessor ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(module-to-transform)/)'
  ]
};