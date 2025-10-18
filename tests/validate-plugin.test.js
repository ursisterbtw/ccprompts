/**
 * Test suite for validate-plugin.js
 * Tests plugin structure validation functionality
 */

const path = require('path');

// Mock the lib utilities before requiring the validator
const mockFsUtils = {
  fileExists: jest.fn(),
  isSymlink: jest.fn(),
  readJSON: jest.fn(),
  readFile: jest.fn(),
  countFiles: jest.fn(),
  readSymlinkTarget: jest.fn()
};

const mockGitUtils = {
  isGitRepo: jest.fn(),
  getTrackedFiles: jest.fn(),
  hasUntrackedFiles: jest.fn()
};

jest.mock('../lib/fsUtils', () => mockFsUtils);
jest.mock('../lib/gitUtils', () => mockGitUtils);

// Import the validator class
const PluginValidator = require('../scripts/validate-plugin');

describe('Plugin Validator', () => {
  let validator;
  let consoleLogSpy;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Create new validator instance
    validator = new PluginValidator();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('Constructor', () => {
    test('should initialize with empty error, warning, and success arrays', () => {
      expect(validator.errors).toEqual([]);
      expect(validator.warnings).toEqual([]);
      expect(validator.successes).toEqual([]);
    });

    test('should set projectRoot to parent directory of scripts', () => {
      expect(validator.projectRoot).toBe(path.resolve(__dirname, '..'));
    });
  });

  describe('Logging methods', () => {
    test('error() should add to errors array and log', () => {
      validator.error('Test error');
      expect(validator.errors).toContain('Test error');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    test('warning() should add to warnings array and log', () => {
      validator.warning('Test warning');
      expect(validator.warnings).toContain('Test warning');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    test('success() should add to successes array and log', () => {
      validator.success('Test success');
      expect(validator.successes).toContain('Test success');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    test('info() should log without adding to any array', () => {
      validator.info('Test info');
      expect(validator.errors).toHaveLength(0);
      expect(validator.warnings).toHaveLength(0);
      expect(validator.successes).toHaveLength(0);
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('File utility wrappers', () => {
    describe('fileExists()', () => {
      test('should return true when file exists', () => {
        mockFsUtils.fileExists.mockReturnValue(true);
        expect(validator.fileExists('test.txt')).toBe(true);
        expect(mockFsUtils.fileExists).toHaveBeenCalledWith('test.txt', validator.projectRoot);
      });

      test('should return false and log error on exception', () => {
        mockFsUtils.fileExists.mockImplementation(() => {
          throw new Error('Invalid path');
        });
        expect(validator.fileExists('invalid')).toBe(false);
        expect(validator.errors).toContain('Invalid file path: invalid');
      });
    });

    describe('isSymlink()', () => {
      test('should return true when path is a symlink', () => {
        mockFsUtils.isSymlink.mockReturnValue(true);
        expect(validator.isSymlink('link')).toBe(true);
      });

      test('should return false on exception', () => {
        mockFsUtils.isSymlink.mockImplementation(() => {
          throw new Error('Not a symlink');
        });
        expect(validator.isSymlink('notlink')).toBe(false);
      });
    });

    describe('readJSON()', () => {
      test('should return parsed JSON on success', () => {
        const mockData = { test: 'data' };
        mockFsUtils.readJSON.mockReturnValue(mockData);
        expect(validator.readJSON('test.json')).toEqual(mockData);
      });

      test('should return null and log error on exception', () => {
        mockFsUtils.readJSON.mockImplementation(() => {
          throw new Error('Parse error');
        });
        expect(validator.readJSON('bad.json')).toBeNull();
        expect(validator.errors.length).toBeGreaterThan(0);
      });
    });

    describe('readFile()', () => {
      test('should return file contents on success', () => {
        mockFsUtils.readFile.mockReturnValue('file contents');
        expect(validator.readFile('test.txt')).toBe('file contents');
      });

      test('should return null and log error on exception', () => {
        mockFsUtils.readFile.mockImplementation(() => {
          throw new Error('Read error');
        });
        expect(validator.readFile('missing.txt')).toBeNull();
        expect(validator.errors.length).toBeGreaterThan(0);
      });
    });

    describe('countFiles()', () => {
      test('should return file count on success', () => {
        mockFsUtils.countFiles.mockReturnValue(5);
        expect(validator.countFiles('dir', '*.md')).toBe(5);
      });

      test('should return 0 and log error on exception', () => {
        mockFsUtils.countFiles.mockImplementation(() => {
          throw new Error('Count error');
        });
        expect(validator.countFiles('baddir', '*.md')).toBe(0);
        expect(validator.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validatePluginManifest()', () => {
    test('should succeed with valid manifest', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        name: 'ccprompts',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author'
      });

      const result = validator.validatePluginManifest();
      expect(result).toBe(true);
      expect(validator.successes).toContain('Plugin manifest is valid');
      expect(validator.errors).toHaveLength(0);
    });

    test('should fail when manifest file does not exist', () => {
      mockFsUtils.fileExists.mockReturnValue(false);

      const result = validator.validatePluginManifest();
      expect(result).toBe(false);
      expect(validator.errors).toContain('Plugin manifest (.claude-plugin/plugin.json) not found');
    });

    test('should fail when manifest is missing required fields', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        name: 'ccprompts',
        version: '1.0.0'
        // missing description and author
      });

      const result = validator.validatePluginManifest();
      expect(result).toBe(false);
      expect(validator.errors.some(e => e.includes('missing required fields'))).toBe(true);
    });

    test('should warn when plugin name is not ccprompts', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        name: 'different-name',
        version: '1.0.0',
        description: 'Test',
        author: 'Author'
      });

      validator.validatePluginManifest();
      expect(validator.warnings.some(w => w.includes('expected "ccprompts"'))).toBe(true);
    });

    test('should fail when readJSON returns null', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue(null);

      const result = validator.validatePluginManifest();
      expect(result).toBe(false);
    });
  });

  describe('validateMarketplaceConfig()', () => {
    test('should succeed with valid marketplace config', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        plugins: [
          { name: 'ccprompts', version: '1.0.0' }
        ]
      });

      const result = validator.validateMarketplaceConfig();
      expect(result).toBe(true);
      expect(validator.successes).toContain('Marketplace configuration is valid');
    });

    test('should succeed with warning when marketplace config does not exist', () => {
      mockFsUtils.fileExists.mockReturnValue(false);

      const result = validator.validateMarketplaceConfig();
      expect(result).toBe(true);
      expect(validator.warnings.some(w => w.includes('optional but recommended'))).toBe(true);
    });

    test('should fail when plugins array is missing', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({});

      const result = validator.validateMarketplaceConfig();
      expect(result).toBe(false);
      expect(validator.errors).toContain('Marketplace configuration missing plugins array');
    });

    test('should fail when ccprompts plugin is not in plugins array', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        plugins: [
          { name: 'other-plugin', version: '1.0.0' }
        ]
      });

      const result = validator.validateMarketplaceConfig();
      expect(result).toBe(false);
      expect(validator.errors).toContain('Marketplace configuration does not include ccprompts plugin');
    });
  });

  describe('validateSymlinks()', () => {
    test('should succeed when both symlinks are valid', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.isSymlink.mockReturnValue(true);
      mockFsUtils.readSymlinkTarget
        .mockReturnValueOnce('.claude/commands')
        .mockReturnValueOnce('.claude/agents');

      const result = validator.validateSymlinks();
      expect(result).toBe(true);
      expect(validator.successes.filter(s => s.includes('symlink is valid'))).toHaveLength(2);
    });

    test('should fail when commands symlink does not exist', () => {
      mockFsUtils.fileExists.mockReturnValueOnce(false); // commands
      mockFsUtils.fileExists.mockReturnValueOnce(true);  // agents
      mockFsUtils.isSymlink.mockReturnValue(true);
      mockFsUtils.readSymlinkTarget.mockReturnValue('.claude/agents');

      const result = validator.validateSymlinks();
      expect(result).toBe(false);
      expect(validator.errors).toContain('commands/ symlink not found at project root');
    });

    test('should fail when commands exists but is not a symlink', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.isSymlink
        .mockReturnValueOnce(false) // commands is not a symlink
        .mockReturnValueOnce(true);  // agents is a symlink
      mockFsUtils.readSymlinkTarget.mockReturnValue('.claude/agents');

      const result = validator.validateSymlinks();
      expect(result).toBe(false);
      expect(validator.errors).toContain('commands/ exists but is not a symlink');
    });

    test('should warn when symlink points to unexpected target', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.isSymlink.mockReturnValue(true);
      mockFsUtils.readSymlinkTarget
        .mockReturnValueOnce('wrong/path')
        .mockReturnValueOnce('.claude/agents');

      validator.validateSymlinks();
      expect(validator.warnings.some(w => w.includes('expected .claude/commands/'))).toBe(true);
    });

    test('should fail when readSymlinkTarget throws error', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.isSymlink.mockReturnValue(true);
      mockFsUtils.readSymlinkTarget.mockImplementation(() => {
        throw new Error('Read error');
      });

      const result = validator.validateSymlinks();
      expect(result).toBe(false);
      expect(validator.errors.some(e => e.includes('Failed to read'))).toBe(true);
    });
  });

  describe('validateCommands()', () => {
    test('should succeed when commands are found', () => {
      mockFsUtils.countFiles.mockReturnValue(70);
      mockFsUtils.fileExists.mockReturnValue(true);

      const result = validator.validateCommands();
      expect(result).toBe(true);
      expect(validator.successes.some(s => s.includes('70 command files'))).toBe(true);
      expect(validator.successes).toContain('All 12 phase directories are present');
    });

    test('should fail when no commands are found', () => {
      mockFsUtils.countFiles.mockReturnValue(0);

      const result = validator.validateCommands();
      expect(result).toBe(false);
      expect(validator.errors).toContain('No command files found in .claude/commands/');
    });

    test('should warn when phase directories are missing', () => {
      mockFsUtils.countFiles.mockReturnValue(10);
      mockFsUtils.fileExists.mockReturnValue(false);

      const result = validator.validateCommands();
      expect(result).toBe(true);
      expect(validator.warnings.some(w => w.includes('Phase directory not found'))).toBe(true);
    });
  });

  describe('validateAgents()', () => {
    test('should succeed when agents are found', () => {
      mockFsUtils.countFiles.mockReturnValue(5);

      const result = validator.validateAgents();
      expect(result).toBe(true);
      expect(validator.successes.some(s => s.includes('5 agent files'))).toBe(true);
    });

    test('should succeed with warning when no agents are found', () => {
      mockFsUtils.countFiles.mockReturnValue(0);

      const result = validator.validateAgents();
      expect(result).toBe(true);
      expect(validator.warnings).toContain('No agent files found in .claude/agents/');
    });
  });

  describe('validateDocumentation()', () => {
    test('should succeed when all required docs exist', () => {
      mockFsUtils.fileExists.mockReturnValue(true);

      const result = validator.validateDocumentation();
      expect(result).toBe(true);
      expect(validator.successes.filter(s => s.includes('found'))).toHaveLength(3);
    });

    test('should fail when required docs are missing', () => {
      mockFsUtils.fileExists.mockReturnValue(false);

      const result = validator.validateDocumentation();
      expect(result).toBe(false);
      expect(validator.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateGitStatus()', () => {
    test('should succeed when symlinks are tracked', () => {
      mockGitUtils.isGitRepo.mockReturnValue(true);
      mockGitUtils.getTrackedFiles.mockReturnValue('commands\nagents\n');
      mockGitUtils.hasUntrackedFiles.mockReturnValue(false);

      const result = validator.validateGitStatus();
      expect(result).toBe(true);
      expect(validator.successes).toContain('Symlinks are tracked in git');
    });

    test('should succeed with warning when not a git repo', () => {
      mockGitUtils.isGitRepo.mockReturnValue(false);

      const result = validator.validateGitStatus();
      expect(result).toBe(true);
      expect(validator.warnings.some(w => w.includes('Not inside a git repository'))).toBe(true);
    });

    test('should warn when symlinks are not tracked', () => {
      mockGitUtils.isGitRepo.mockReturnValue(true);
      mockGitUtils.getTrackedFiles.mockReturnValue('other-files\n');
      mockGitUtils.hasUntrackedFiles.mockReturnValue(false);

      validator.validateGitStatus();
      expect(validator.warnings.some(w => w.includes('may not be tracked'))).toBe(true);
    });

    test('should warn when plugin files are untracked', () => {
      mockGitUtils.isGitRepo.mockReturnValue(true);
      mockGitUtils.getTrackedFiles.mockReturnValue('commands\nagents\n');
      mockGitUtils.hasUntrackedFiles.mockReturnValue(true);

      validator.validateGitStatus();
      expect(validator.warnings.some(w => w.includes('untracked'))).toBe(true);
    });

    test('should warn when git commands fail', () => {
      mockGitUtils.isGitRepo.mockReturnValue(true);
      mockGitUtils.getTrackedFiles.mockImplementation(() => {
        throw new Error('Git error');
      });

      validator.validateGitStatus();
      expect(validator.warnings.some(w => w.includes('Could not check git status'))).toBe(true);
    });
  });

  describe('validatePackageJson()', () => {
    test('should succeed with valid package.json', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        name: 'ccprompts',
        version: '1.0.0',
        description: 'Test package',
        scripts: {
          'validate:plugin': 'node scripts/validate-plugin.js'
        }
      });

      const result = validator.validatePackageJson();
      expect(result).toBe(true);
      expect(validator.successes).toContain('package.json validation passed');
    });

    test('should fail when package.json does not exist', () => {
      mockFsUtils.fileExists.mockReturnValue(false);

      const result = validator.validatePackageJson();
      expect(result).toBe(false);
      expect(validator.errors).toContain('package.json not found');
    });

    test('should fail when required fields are missing', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        name: 'ccprompts'
        // missing version and description
      });

      const result = validator.validatePackageJson();
      expect(result).toBe(false);
      expect(validator.errors.some(e => e.includes('missing required field'))).toBe(true);
    });

    test('should warn when name is not ccprompts', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        name: 'other-name',
        version: '1.0.0',
        description: 'Test'
      });

      validator.validatePackageJson();
      expect(validator.warnings.some(w => w.includes('expected "ccprompts"'))).toBe(true);
    });

    test('should warn when validate:plugin script is missing', () => {
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.readJSON.mockReturnValue({
        name: 'ccprompts',
        version: '1.0.0',
        description: 'Test',
        scripts: {}
      });

      validator.validatePackageJson();
      expect(validator.warnings.some(w => w.includes('validate:plugin script'))).toBe(true);
    });
  });

  describe('run()', () => {
    beforeEach(() => {
      // Setup default mocks for successful validation
      mockFsUtils.fileExists.mockReturnValue(true);
      mockFsUtils.isSymlink.mockReturnValue(true);
      mockFsUtils.readJSON.mockImplementation((file) => {
        if (file.includes('plugin.json')) {
          return {
            name: 'ccprompts',
            version: '1.0.0',
            description: 'Test',
            author: 'Author'
          };
        }
        if (file.includes('package.json')) {
          return {
            name: 'ccprompts',
            version: '1.0.0',
            description: 'Test',
            scripts: { 'validate:plugin': 'test' }
          };
        }
        return {};
      });
      mockFsUtils.countFiles.mockReturnValue(70);
      mockFsUtils.readSymlinkTarget.mockReturnValue('.claude/commands');
      mockGitUtils.isGitRepo.mockReturnValue(true);
      mockGitUtils.getTrackedFiles.mockReturnValue('commands\nagents\n');
      mockGitUtils.hasUntrackedFiles.mockReturnValue(false);
    });

    test('should return 0 when all validations pass', () => {
      const result = validator.run();
      expect(result).toBe(0);
      expect(validator.errors).toHaveLength(0);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Plugin structure is valid'));
    });

    test('should return 1 when validations fail', () => {
      mockFsUtils.fileExists.mockReturnValue(false);

      const result = validator.run();
      expect(result).toBe(1);
      expect(validator.errors.length).toBeGreaterThan(0);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('has errors'));
    });

    test('should display summary with counts', () => {
      validator.run();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Successes:'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Warnings:'));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Errors:'));
    });

    test('should run all validation methods', () => {
      const spies = {
        validatePackageJson: jest.spyOn(validator, 'validatePackageJson'),
        validatePluginManifest: jest.spyOn(validator, 'validatePluginManifest'),
        validateMarketplaceConfig: jest.spyOn(validator, 'validateMarketplaceConfig'),
        validateSymlinks: jest.spyOn(validator, 'validateSymlinks'),
        validateCommands: jest.spyOn(validator, 'validateCommands'),
        validateAgents: jest.spyOn(validator, 'validateAgents'),
        validateDocumentation: jest.spyOn(validator, 'validateDocumentation'),
        validateGitStatus: jest.spyOn(validator, 'validateGitStatus')
      };

      validator.run();

      Object.values(spies).forEach(spy => {
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
