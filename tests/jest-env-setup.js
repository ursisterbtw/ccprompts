/**
 * Jest environment setup for Node.js v24.x compatibility
 * Sets up environment variables and Node.js compatibility fixes
 */

// Set Node.js specific environment variables
process.env.NODE_ENV = 'test';
process.env.EXPECTED_COMMAND_COUNT = '70';
process.env.CI = process.env.CI || 'false';

// Performance test environment variables
process.env.PERF_DISCOVERY_MS = process.env.PERF_DISCOVERY_MS || '100';
process.env.PERF_VALIDATION_MS = process.env.PERF_VALIDATION_MS || '2000';

// Skip performance tests in CI by default (can be overridden)
if (process.env.CI === 'true' && !process.env.RUN_PERF_TESTS) {
  process.env.SKIP_PERF_TESTS = 'true';
}

// Dagger availability for safety testing
process.env.DAGGER_AVAILABLE = process.env.DAGGER_AVAILABLE || 'auto';

// Set up garbage collection for memory tests if available
if (typeof global.gc === 'function') {
  process.env.NODE_GC_AVAILABLE = 'true';
}

// Node.js v24.x compatibility fixes
if (process.version.startsWith('v24.')) {
  // Increase memory limit for large validation operations
  if (!process.env.NODE_OPTIONS) {
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  }
  
  // Set up experimental features if needed
  process.env.NODE_NO_WARNINGS = '1';
}

// Set up test timing
process.env.TEST_START_TIME = Date.now().toString();

console.log(`Jest environment setup completed for Node.js ${process.version}`);
console.log(`Expected command count: ${process.env.EXPECTED_COMMAND_COUNT}`);
console.log(`Performance tests: ${process.env.SKIP_PERF_TESTS === 'true' ? 'SKIPPED' : 'ENABLED'}`);