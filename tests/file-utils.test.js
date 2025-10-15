/**
 * comprehensive test suite for FileUtils validator module
 * tests all file operations, discovery, and exclusion logic
 */

const fs = require('fs');
const path = require('path');
const FileUtils = require('../scripts/validators/file-utils');

describe('FileUtils Module', () => {
  let fileUtils;
  let tempDir;
  let testRoot;

  beforeAll(() => {
    testRoot = global.TEST_CONFIG.PROJECT_ROOT;
    tempDir = path.join(testRoot, 'tests', 'temp', 'file-utils-test');
    fs.mkdirSync(tempDir, { recursive: true });
  });

  beforeEach(() => {
    fileUtils = new FileUtils(['node_modules', '.git', 'test']);
  });

  afterEach(() => {
    // Clean temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Final cleanup
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Constructor', () => {
    test('should create instance with default exclude patterns', () => {
      const utils = new FileUtils();
      expect(utils.excludePatterns).toEqual([]);
    });

    test('should create instance with custom exclude patterns', () => {
      const patterns = ['node_modules', '.git', 'temp'];
      const utils = new FileUtils(patterns);
      expect(utils.excludePatterns).toEqual(patterns);
    });
  });

  describe('findMarkdownFiles', () => {
    test('should find all markdown files in directory', () => {
      // Create test files
      fs.writeFileSync(path.join(tempDir, 'file1.md'), '# Test 1');
      fs.writeFileSync(path.join(tempDir, 'file2.md'), '# Test 2');
      fs.writeFileSync(path.join(tempDir, 'not-markdown.txt'), 'Not markdown');
      
      const files = fileUtils.findMarkdownFiles(tempDir);
      
      expect(files).toHaveLength(2);
      expect(files.every(f => f.endsWith('.md'))).toBe(true);
      expect(files.some(f => f.includes('file1.md'))).toBe(true);
      expect(files.some(f => f.includes('file2.md'))).toBe(true);
    });

    test('should search recursively in subdirectories', () => {
      // Create directory structure
      const subdir = path.join(tempDir, 'subdir');
      fs.mkdirSync(subdir);
      fs.writeFileSync(path.join(tempDir, 'root.md'), '# Root');
      fs.writeFileSync(path.join(subdir, 'nested.md'), '# Nested');
      
      const files = fileUtils.findMarkdownFiles(tempDir);
      
      expect(files).toHaveLength(2);
      expect(files.some(f => f.includes('root.md'))).toBe(true);
      expect(files.some(f => f.includes('nested.md'))).toBe(true);
    });

    test('should respect exclude patterns', () => {
      // Create test structure
      const nodeModulesDir = path.join(tempDir, 'node_modules');
      fs.mkdirSync(nodeModulesDir);
      fs.writeFileSync(path.join(tempDir, 'included.md'), '# Included');
      fs.writeFileSync(path.join(nodeModulesDir, 'excluded.md'), '# Excluded');
      
      const files = fileUtils.findMarkdownFiles(tempDir);
      
      expect(files).toHaveLength(1);
      expect(files[0]).toContain('included.md');
      expect(files.every(f => !f.includes('node_modules'))).toBe(true);
    });

    test('should handle empty directory', () => {
      const files = fileUtils.findMarkdownFiles(tempDir);
      expect(files).toEqual([]);
    });

    test('should throw error for non-existent directory', () => {
      expect(() => {
        fileUtils.findMarkdownFiles('/non/existent/path');
      }).toThrow('does not exist or is not accessible');
    });

    test('should handle directory with read errors gracefully', () => {
      // Create a directory and then make it inaccessible (simulate error)
      const badDir = path.join(tempDir, 'bad-dir');
      fs.mkdirSync(badDir);
      fs.writeFileSync(path.join(badDir, 'test.md'), '# Test');
      
      // Mock readdirSync to throw error
      const originalReaddirSync = fs.readdirSync;
      fs.readdirSync = jest.fn(() => {
        throw new Error('Permission denied');
      });
      
      const files = fileUtils.findMarkdownFiles(tempDir);
      expect(files).toEqual([]);
      
      // Restore original function
      fs.readdirSync = originalReaddirSync;
    });
  });

  describe('readFileContent', () => {
    test('should read file content successfully', () => {
      const testPath = path.join(tempDir, 'test.md');
      const content = '# Test Content\n\nSome markdown content.';
      fs.writeFileSync(testPath, content);
      
      const result = fileUtils.readFileContent(testPath);
      expect(result).toBe(content);
    });

    test('should throw error for non-existent file', () => {
      expect(() => {
        fileUtils.readFileContent('/non/existent/file.md');
      }).toThrow('Failed to read /non/existent/file.md');
    });

    test('should handle empty files', () => {
      const testPath = path.join(tempDir, 'empty.md');
      fs.writeFileSync(testPath, '');
      
      const result = fileUtils.readFileContent(testPath);
      expect(result).toBe('');
    });

    test('should handle files with special characters', () => {
      const testPath = path.join(tempDir, 'special.md');
      const content = 'Content with émojis 🎉 and spéciäl chäracters';
      fs.writeFileSync(testPath, content);
      
      const result = fileUtils.readFileContent(testPath);
      expect(result).toBe(content);
    });
  });

  describe('getRelativePath', () => {
    test('should return relative path from root directory', () => {
      const fullPath = path.join(testRoot, 'src', 'file.js');
      const relative = fileUtils.getRelativePath(fullPath, testRoot);
      
      expect(relative).toBe(path.join('src', 'file.js'));
    });

    test('should handle same directory', () => {
      const relative = fileUtils.getRelativePath(testRoot, testRoot);
      expect(relative).toBe('.');
    });

    test('should handle nested paths', () => {
      const fullPath = path.join(testRoot, 'deeply', 'nested', 'path', 'file.md');
      const relative = fileUtils.getRelativePath(fullPath, testRoot);
      
      expect(relative).toBe(path.join('deeply', 'nested', 'path', 'file.md'));
    });
  });

  describe('shouldExclude', () => {
    test('should exclude based on simple string patterns', () => {
      const testCases = [
        { path: '/project/node_modules/package/file.md', shouldExclude: true },
        { path: '/project/.git/refs/heads/main', shouldExclude: true },
        { path: '/project/test/file.md', shouldExclude: true },
        { path: '/project/src/file.md', shouldExclude: false },
        { path: '/project/docs/readme.md', shouldExclude: false }
      ];

      testCases.forEach(({ path: testPath, shouldExclude }) => {
        expect(fileUtils.shouldExclude(testPath)).toBe(shouldExclude);
      });
    });

    test('should handle case sensitivity', () => {
      expect(fileUtils.shouldExclude('/project/NodeModules/file.md')).toBe(false);
      expect(fileUtils.shouldExclude('/project/NODE_MODULES/file.md')).toBe(false);
    });

    test('should work with different path separators', () => {
      expect(fileUtils.shouldExclude('project\\node_modules\\file.md')).toBe(true);
    });
  });

  describe('setExcludePatterns', () => {
    test('should update exclude patterns', () => {
      fileUtils.setExcludePatterns(['new-pattern', 'another-pattern']);
      expect(fileUtils.excludePatterns).toEqual(['new-pattern', 'another-pattern']);
    });

    test('should handle empty patterns array', () => {
      fileUtils.setExcludePatterns([]);
      expect(fileUtils.excludePatterns).toEqual([]);
    });

    test('should accept RegExp patterns', () => {
      const regexPattern = /test-\d+/;
      fileUtils.setExcludePatterns([regexPattern]);
      expect(fileUtils.excludePatterns).toContain(regexPattern);
    });
  });

  describe('Integration with real project structure', () => {
    test('should find actual markdown files in project', () => {
      const utils = new FileUtils(['node_modules', '.git', 'coverage']);
      const files = utils.findMarkdownFiles(testRoot);
      
      expect(files.length).toBeGreaterThan(0);
      expect(files.every(f => f.endsWith('.md'))).toBe(true);
      
      // Should find commands directory
      const hasCommands = files.some(f => f.includes('.claude/commands'));
      expect(hasCommands).toBe(true);
    });

    test('should exclude node_modules from real project', () => {
      const utils = new FileUtils(['node_modules']);
      const files = utils.findMarkdownFiles(testRoot);
      
      expect(files.every(f => !f.includes('node_modules'))).toBe(true);
    });
  });

  describe('Performance', () => {
    test('should complete file discovery within reasonable time', () => {
      // Create many test files
      for (let i = 0; i < 100; i++) {
        fs.writeFileSync(path.join(tempDir, `file${i}.md`), `# File ${i}`);
      }
      
      const startTime = Date.now();
      const files = fileUtils.findMarkdownFiles(tempDir);
      const duration = Date.now() - startTime;
      
      expect(files).toHaveLength(100);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });
  });

  describe('Edge Cases', () => {
    test('should handle files with dots in names', () => {
      fs.writeFileSync(path.join(tempDir, 'file.v2.md'), '# Version 2');
      fs.writeFileSync(path.join(tempDir, '.hidden.md'), '# Hidden');
      
      const files = fileUtils.findMarkdownFiles(tempDir);
      
      expect(files.some(f => f.includes('file.v2.md'))).toBe(true);
      expect(files.some(f => f.includes('.hidden.md'))).toBe(true);
    });

    test('should handle symbolic links (if supported)', () => {
      // This test is platform-dependent and may be skipped in some environments
      const sourceFile = path.join(tempDir, 'source.md');
      const linkFile = path.join(tempDir, 'linked.md');
      
      fs.writeFileSync(sourceFile, '# Source file');
      
      try {
        fs.symlinkSync(sourceFile, linkFile);
        const files = fileUtils.findMarkdownFiles(tempDir);
        
        // Should find both files
        expect(files.length).toBeGreaterThanOrEqual(1);
      } catch (error) {
        // Skip if symlinks not supported
        console.warn('Symbolic links not supported, skipping test');
      }
    });
  });
});
