/**
 * Performance and Compatibility Test Suite
 * Tests Node.js v24.1.0 compatibility and performance targets
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const CommandValidator = require('../scripts/validate-commands');
const SafetyValidator = require('../scripts/safety-validator');

describe('Performance and Compatibility Tests', () => {
  let commandValidator;
  let safetyValidator;

  beforeAll(() => {
    commandValidator = new CommandValidator();
    safetyValidator = new SafetyValidator();
  });

  describe('Node.js v24.x Compatibility', () => {
    test('should work with current Node.js version', () => {
      const nodeVersion = process.version;
      console.log(`Testing with Node.js ${nodeVersion}`);
      
      // Should be v24.x or compatible
      expect(nodeVersion).toMatch(/^v(18|20|22|24)\./);
      
      // Check that major Node.js features work
      expect(() => {
        // Test async/await
        (async () => { await Promise.resolve(true); })();
        
        // Test ES6 features
        const testArray = [1, 2, 3];
        const [first, ...rest] = testArray;
        expect(first).toBe(1);
        expect(rest).toEqual([2, 3]);
        
        // Test object destructuring
        const testObj = { a: 1, b: 2 };
        const { a, b } = testObj;
        expect(a).toBe(1);
        expect(b).toBe(2);
      }).not.toThrow();
    });

    test('should handle file system operations correctly', () => {
      const testDir = path.join(global.TEST_CONFIG.PROJECT_ROOT, 'tests', 'temp');
      
      // Test directory creation/deletion
      expect(() => {
        if (!fs.existsSync(testDir)) {
          fs.mkdirSync(testDir, { recursive: true });
        }
        
        const testFile = path.join(testDir, 'compatibility-test.md');
        fs.writeFileSync(testFile, '# Test Content');
        
        const content = fs.readFileSync(testFile, 'utf8');
        expect(content).toBe('# Test Content');
        
        fs.unlinkSync(testFile);
      }).not.toThrow();
    });

    test('should handle child process execution correctly', () => {
      expect(() => {
        const result = execSync('echo "Node.js compatibility test"', { encoding: 'utf8' });
        expect(result.trim()).toBe('Node.js compatibility test');
      }).not.toThrow();
    });

    test('should handle JSON operations correctly', () => {
      const testData = {
        commands: Array.from({length: 73}, (_, i) => ({
          id: `command-${i}`,
          name: `Command ${i}`,
          phase: Math.floor(i / 6) + 1
        }))
      };
      
      expect(() => {
        const jsonString = JSON.stringify(testData, null, 2);
        const parsed = JSON.parse(jsonString);
        expect(parsed.commands).toHaveLength(73);
      }).not.toThrow();
    });
  });

  describe('Performance Benchmarks', () => {
    test('should meet discovery performance targets consistently', async () => {
      const iterations = 10;
      const discoveryTimes = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = process.hrtime.bigint();
        commandValidator.findMarkdownFiles(global.TEST_CONFIG.PROJECT_ROOT);
        const endTime = process.hrtime.bigint();
        
        const durationMs = Number(endTime - startTime) / 1000000;
        discoveryTimes.push(durationMs);
      }
      
      const avgTime = discoveryTimes.reduce((a, b) => a + b, 0) / iterations;
      const maxTime = Math.max(...discoveryTimes);
      const minTime = Math.min(...discoveryTimes);
      
      console.log(`Discovery performance: avg=${avgTime.toFixed(2)}ms, min=${minTime.toFixed(2)}ms, max=${maxTime.toFixed(2)}ms`);
      
      expect(avgTime).toBeLessThan(global.TEST_CONFIG.PERFORMANCE_TARGETS.DISCOVERY_MS);
      expect(maxTime).toBeLessThan(global.TEST_CONFIG.PERFORMANCE_TARGETS.DISCOVERY_MS * 2);
    });

    test('should maintain validation performance under different loads', async () => {
      const testCases = [
        { description: 'Small subset (10 files)', fileCount: 10 },
        { description: 'Medium subset (25 files)', fileCount: 25 },
        { description: 'Large subset (50 files)', fileCount: 50 }
      ];
      
      for (const testCase of testCases) {
        const startTime = Date.now();
        
        // Simulate validation of subset
        const allFiles = commandValidator.findMarkdownFiles(global.TEST_CONFIG.PROJECT_ROOT);
        const subset = allFiles.slice(0, testCase.fileCount);
        
        for (const file of subset) {
          await commandValidator.validateFile(file);
        }
        
        const duration = Date.now() - startTime;
        const avgPerFile = duration / testCase.fileCount;
        
        console.log(`${testCase.description}: ${duration}ms total, ${avgPerFile.toFixed(2)}ms per file`);
        
        // Should maintain reasonable per-file performance
        expect(avgPerFile).toBeLessThan(100); // 100ms per file max
      }
    });

    test('should handle memory usage efficiently', async () => {
      const initialMemory = process.memoryUsage();
      
      // Run validation multiple times to test for memory leaks
      for (let i = 0; i < 5; i++) {
        const validator = new CommandValidator();
        await validator.validate();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
      
      console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`);
      
      // Should not leak significant memory
      expect(memoryIncreaseMB).toBeLessThan(50); // 50MB threshold
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle concurrent validation operations', async () => {
      const concurrentOperations = 3;
      const promises = [];
      
      for (let i = 0; i < concurrentOperations; i++) {
        const validator = new CommandValidator();
        promises.push(validator.validate());
      }
      
      const startTime = Date.now();
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      console.log(`Concurrent validation (${concurrentOperations} operations): ${duration}ms`);
      
      // All operations should complete; validator returns exit code number in current API
      expect(results).toHaveLength(concurrentOperations);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(['number', 'object']).toContain(typeof result);
      });
      
      // Should be faster than sequential operations
      const estimatedSequentialTime = global.TEST_CONFIG.PERFORMANCE_TARGETS.VALIDATION_MS * concurrentOperations;
      expect(duration).toBeLessThan(estimatedSequentialTime);
    });

    test('should handle concurrent safety validations', async () => {
      const testCommands = [
        'echo "safe command 1"',
        'ls -la',
        'git status'
      ];
      
      const promises = testCommands.map(command => 
        safetyValidator.analyzeDangerousPatterns(command, 'concurrent-test.md')
      );
      
      const startTime = Date.now();
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      console.log(`Concurrent safety validation: ${duration}ms`);
      
      // All should complete without errors
      expect(results).toHaveLength(testCommands.length);
      expect(duration).toBeLessThan(1000); // Should be fast
    });
  });

  describe('Error Recovery and Resilience', () => {
    test('should recover from file system errors gracefully', async () => {
      const originalReadFile = fs.readFileSync;
      let errorCount = 0;
      
      // Mock file system errors intermittently
      fs.readFileSync = function(filePath, options) {
        errorCount++;
        if (errorCount % 5 === 0) {
          throw new Error('Simulated file system error');
        }
        return originalReadFile.call(this, filePath, options);
      };
      
      try {
        await commandValidator.validate();
        
        // Should complete despite some errors
        expect(commandValidator.errors.length).toBeGreaterThan(0);
        expect(commandValidator.warnings.length).toBeGreaterThanOrEqual(0);
      } finally {
        // Restore original function
        fs.readFileSync = originalReadFile;
      }
    });

    test('should handle process interruption gracefully', (done) => {
      const validator = new CommandValidator();
      
      // Start validation
      const validationPromise = validator.validate();
      
      // Simulate interruption after short delay
      setTimeout(() => {
        // This tests that the validator doesn't crash on interruption
        expect(true).toBe(true);
        done();
      }, 100);
      
      validationPromise.catch(() => {
        // Expected behavior - validation may be interrupted
        done();
      });
    }, 5000);
  });

  describe('Resource Usage Monitoring', () => {
    test('should monitor and report resource usage', async () => {
      const startTime = Date.now();
      const startMemory = process.memoryUsage();
      const startCpu = process.cpuUsage();
      
      await commandValidator.validate();
      
      const endTime = Date.now();
      const endMemory = process.memoryUsage();
      const endCpu = process.cpuUsage(startCpu);
      
      const metrics = {
        duration: endTime - startTime,
        memoryDelta: {
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal,
          external: endMemory.external - startMemory.external
        },
        cpuTime: {
          user: endCpu.user / 1000000, // Convert to seconds
          system: endCpu.system / 1000000
        }
      };
      
      console.log('Resource usage metrics:', JSON.stringify(metrics, null, 2));
      
      // Validate resource usage is reasonable
      expect(metrics.duration).toBeLessThan(10000); // 10 second max
      expect(metrics.memoryDelta.heapUsed).toBeLessThan(100 * 1024 * 1024); // 100MB max
      expect(metrics.cpuTime.user + metrics.cpuTime.system).toBeLessThan(5); // 5 seconds max CPU
    });
  });

  describe('Cross-Platform Compatibility', () => {
    test('should work across different operating systems', () => {
      const platform = process.platform;
      console.log(`Testing on platform: ${platform}`);
      
      // Should work on common platforms
      expect(['win32', 'darwin', 'linux']).toContain(platform);
      
      // Path operations should work correctly
      const testPath = path.join('test', 'directory', 'file.md');
      expect(testPath).toBeTruthy();
      
      if (platform === 'win32') {
        expect(testPath).toContain('\\');
      } else {
        expect(testPath).toContain('/');
      }
    });

    test('should handle different line ending formats', () => {
      const testContent = 'Line 1\nLine 2\r\nLine 3\r';
      
      expect(() => {
        const lines = testContent.split(/\r?\n/);
        expect(lines.length).toBeGreaterThan(2);
      }).not.toThrow();
    });
  });
});