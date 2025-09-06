/**
 * Jest environment setup for Node.js v24.x compatibility
 * Sets up environment variables and Node.js compatibility fixes
 */

// node.js env vars
process.env.NODE_ENV = 'test';
process.env.EXPECTED_COMMAND_COUNT = '70';
process.env.CI = process.env.CI || 'false';

// perf test vars
process.env.PERF_DISCOVERY_MS = process.env.PERF_DISCOVERY_MS || '100';
process.env.PERF_VALIDATION_MS = process.env.PERF_VALIDATION_MS || '2000';

// skip perf tests in CI by default
if (process.env.CI === 'true' && !process.env.RUN_PERF_TESTS) {
  process.env.SKIP_PERF_TESTS = 'true';
}

// dagger for safety testing
process.env.DAGGER_AVAILABLE = process.env.DAGGER_AVAILABLE || 'auto';

// gc for memory tests if available
if (typeof global.gc === 'function') {
  process.env.NODE_GC_AVAILABLE = 'true';
}

// node v24.x compat fixes
if (process.version.startsWith('v24.')) {
  // bump memory limit for large validation
  if (!process.env.NODE_OPTIONS) {
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  }

  // experimental features if needed
  process.env.NODE_NO_WARNINGS = '1';
}

// test timing
process.env.TEST_START_TIME = Date.now().toString();

console.log(`Jest environment setup completed for Node.js ${process.version}`);
console.log(`Expected command count: ${process.env.EXPECTED_COMMAND_COUNT}`);
console.log(`Performance tests: ${process.env.SKIP_PERF_TESTS === 'true' ? 'SKIPPED' : 'ENABLED'}`);