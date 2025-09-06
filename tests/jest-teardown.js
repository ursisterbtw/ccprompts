/**
 * Jest global teardown
 * Cleanup operations and test result reporting
 */

module.exports = async () => {
  const fs = require('fs');
  const path = require('path');

  console.log('\n🧹 Running Jest global teardown...');

  // Clean up temporary test files
  const tempDir = path.join(process.cwd(), 'tests', 'temp');
  if (fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('✅ Cleaned up temporary test files');
    } catch (error) {
      console.warn('⚠️ Failed to clean up temporary files:', error.message);
    }
  }

  // Report test execution time
  const startTime = parseInt(process.env.TEST_START_TIME || '0', 10);
  if (startTime > 0) {
    const duration = Date.now() - startTime;
    console.log(`⏱️ Total test execution time: ${duration}ms`);
  }

  // Memory usage report
  if (global.gc) {
    global.gc();
    const memUsage = process.memoryUsage();
    console.log(`💾 Final memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
  }

  // Generate test summary if in CI
  if (process.env.CI === 'true') {
    const coverageDir = path.join(process.cwd(), 'coverage');
    if (fs.existsSync(coverageDir)) {
      console.log('📊 Coverage reports generated in coverage/ directory');
    }
  }

  console.log('✅ Jest teardown completed');
};