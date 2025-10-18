/**
 * Comprehensive tests for enhanced pathUtils functionality
 * Tests dynamic directory support and path traversal prevention
 */

const path = require('path');
const { getSafePath, isDocumentedDirectory, isSafePath, documentedDirs, allowedRootFiles } = require('../lib/pathUtils');

describe('Enhanced Path Utilities', () => {
  const projectRoot = '/home/user/project';

  describe('isDocumentedDirectory', () => {
    test('should recognize documented directories', () => {
      expect(isDocumentedDirectory('docs')).toBe(true);
      expect(isDocumentedDirectory('.claude/commands')).toBe(true);
      expect(isDocumentedDirectory('scripts')).toBe(true);
      expect(isDocumentedDirectory('lib')).toBe(true);
    });

    test('should recognize subdirectories of documented directories', () => {
      expect(isDocumentedDirectory('docs/API')).toBe(true);
      expect(isDocumentedDirectory('.claude/commands/01-setup')).toBe(true);
      expect(isDocumentedDirectory('scripts/validators/index.js')).toBe(true);
      expect(isDocumentedDirectory('lib/utils.js')).toBe(true);
    });

    test('should reject non-documented directories', () => {
      expect(isDocumentedDirectory('secret')).toBe(false);
      expect(isDocumentedDirectory('private_data')).toBe(false);
      expect(isDocumentedDirectory('etc')).toBe(false);
    });

    test('should normalize path separators', () => {
      expect(isDocumentedDirectory('docs\\API')).toBe(true);
      expect(isDocumentedDirectory('scripts\\validators')).toBe(true);
    });
  });

  describe('isSafePath', () => {
    test('should allow paths within project root', () => {
      expect(isSafePath('docs/API.md', projectRoot)).toBe(true);
      expect(isSafePath('lib/utils.js', projectRoot)).toBe(true);
      expect(isSafePath('.claude/commands/test.md', projectRoot)).toBe(true);
    });

    test('should reject path traversal attempts', () => {
      expect(isSafePath('../../../etc/passwd', projectRoot)).toBe(false);
      expect(isSafePath('..', projectRoot)).toBe(false);
      expect(isSafePath('docs/../../etc/passwd', projectRoot)).toBe(false);
      expect(isSafePath('lib/../../../../secrets', projectRoot)).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(isSafePath('.', projectRoot)).toBe(true);
      expect(isSafePath('', projectRoot)).toBe(true);
    });
  });

  describe('getSafePath', () => {
    test('should return safe paths for root-level files', () => {
      const result = getSafePath('README.md', projectRoot);
      expect(result).toContain('README.md');
      expect(result).toContain(projectRoot);
    });

    test('should return safe paths for documented directories', () => {
      const result1 = getSafePath('docs/guide.md', projectRoot);
      const result2 = getSafePath('.claude/commands/setup.md', projectRoot);
      const result3 = getSafePath('lib/utils.js', projectRoot);

      expect(result1).toContain('docs');
      expect(result2).toContain('.claude');
      expect(result3).toContain('lib');
    });

    test('should return safe paths for subdirectories', () => {
      const result = getSafePath('docs/api/endpoints.md', projectRoot);
      expect(result).toContain('docs');
      expect(result).toContain('api');
    });

    test('should reject path traversal attacks', () => {
      expect(() => getSafePath('../../../etc/passwd', projectRoot)).toThrow('Path traversal detected');
      expect(() => getSafePath('docs/../../etc/passwd', projectRoot)).toThrow('Path traversal detected');
      expect(() => getSafePath('lib/../../../../secrets', projectRoot)).toThrow('Path traversal detected');
    });

    test('should reject access to undocumented directories', () => {
      expect(() => getSafePath('secret/key.txt', projectRoot)).toThrow('Access denied');
      expect(() => getSafePath('private/data.json', projectRoot)).toThrow('Access denied');
    });

    test('should reject invalid inputs', () => {
      expect(() => getSafePath(null, projectRoot)).toThrow('Invalid file path');
      expect(() => getSafePath('', projectRoot)).toThrow('Invalid file path');
      expect(() => getSafePath('file.txt', null)).toThrow('Invalid project root');
    });

    test('should normalize path separators consistently', () => {
      const result1 = getSafePath('docs/guide.md', projectRoot);
      const result2 = getSafePath('docs\\guide.md', projectRoot);
      // Both should resolve to same canonical path
      expect(path.normalize(result1)).toEqual(path.normalize(result2));
    });
  });

  describe('Security boundary tests', () => {
    test('should block attempts to access /etc files', () => {
      expect(() => getSafePath('/etc/passwd', projectRoot)).toThrow();
      expect(() => getSafePath('docs/../../etc/passwd', projectRoot)).toThrow();
    });

    test('should block attempts to access system directories', () => {
      expect(() => getSafePath('/var/log/app.log', projectRoot)).toThrow();
      expect(() => getSafePath('/home/user/.ssh/id_rsa', projectRoot)).toThrow();
    });

    test('should block attempts to read outside project', () => {
      expect(() => getSafePath('../../sensitive', projectRoot)).toThrow();
      expect(() => getSafePath('../sibling_project/secret', projectRoot)).toThrow();
    });
  });

  describe('Documented directories configuration', () => {
    test('should have required documented directories', () => {
      expect(documentedDirs).toContain('.claude/commands');
      expect(documentedDirs).toContain('.claude/agents');
      expect(documentedDirs).toContain('docs');
      expect(documentedDirs).toContain('lib');
      expect(documentedDirs).toContain('scripts');
    });

    test('should have required allowed root files', () => {
      expect(allowedRootFiles).toContain('README.md');
      expect(allowedRootFiles).toContain('package.json');
      expect(allowedRootFiles).toContain('CLAUDE.md');
      expect(allowedRootFiles).toContain('PLANNING.md');
    });
  });

  describe('Real-world path patterns', () => {
    test('should allow documentation paths', () => {
      expect(() => getSafePath('docs/readme.md', projectRoot)).not.toThrow();
      expect(() => getSafePath('docs/guides/setup.md', projectRoot)).not.toThrow();
      expect(() => getSafePath('docs/api/endpoints.md', projectRoot)).not.toThrow();
    });

    test('should allow command paths', () => {
      expect(() => getSafePath('.claude/commands/00-initial/test.md', projectRoot)).not.toThrow();
      expect(() => getSafePath('.claude/agents/my-agent.md', projectRoot)).not.toThrow();
    });

    test('should allow library paths', () => {
      expect(() => getSafePath('lib/pathUtils.js', projectRoot)).not.toThrow();
      expect(() => getSafePath('lib/utils/helper.js', projectRoot)).not.toThrow();
    });

    test('should allow script paths', () => {
      expect(() => getSafePath('scripts/validate.js', projectRoot)).not.toThrow();
      expect(() => getSafePath('scripts/validators/quality.js', projectRoot)).not.toThrow();
    });
  });

  describe('Platform compatibility', () => {
    test('should work with Windows-style paths', () => {
      const windowsPath = 'docs\\guides\\setup.md';
      expect(() => getSafePath(windowsPath, projectRoot)).not.toThrow();
    });

    test('should work with Unix-style paths', () => {
      const unixPath = 'docs/guides/setup.md';
      expect(() => getSafePath(unixPath, projectRoot)).not.toThrow();
    });

    test('should work with mixed path separators', () => {
      const mixedPath = 'docs\\guides/setup.md';
      expect(() => getSafePath(mixedPath, projectRoot)).not.toThrow();
    });
  });
});
