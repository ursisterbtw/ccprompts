/**
 * jest global teardown
 * cleanup operations and test result reporting
 */

module.exports = async () => {
  const fs = require('fs');
  const path = require('path');

  console.log('\n[CLEANUP] Running Jest global teardown...');

  // clean up temporary test files
  const tempDir = path.join(process.cwd(), 'tests', 'temp');
  if (fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('[OK] Cleaned up temporary test files');
    } catch (error) {
      console.warn('[WARNING] Failed to clean up temporary files:', error.message);
    }
  }

  // report test execution time
  const startTime = parseInt(process.env.TEST_START_TIME || '0', 10);
  if (startTime > 0) {
    const duration = Date.now() - startTime;
    console.log(`[TIME] Total test execution time: ${duration}ms`);
  }

  // memory usage report
  if (global.gc) {
    global.gc();
    const memUsage = process.memoryUsage();
    console.log(`[MEMORY] Final memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
  }

  // generate test summary if in CI
  if (process.env.CI === 'true') {
    const coverageDir = path.join(process.cwd(), 'coverage');
    if (fs.existsSync(coverageDir)) {
      console.log('[COVERAGE] Coverage reports generated in coverage/ directory');
    }
  }

  console.log('[OK] Jest teardown completed');
};