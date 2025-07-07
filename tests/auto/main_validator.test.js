#!/usr/bin/env node

/**
 * Comprehensive tests for MainValidator class
 * Tests all public methods with happy path and edge cases
 */

const { expect } = require('chai');
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const tmpDir = require('tmp').dirSync;

// Mock the dependencies
const mockSecurityValidator = {
  validateSecurity: sinon.stub().returns([])
};

const mockStructureValidator = {
  validateXMLStructure: sinon.stub().returns(true),
  validateCommandStructure: sinon.stub(),
  getErrors: sinon.stub().returns([]),
  getWarnings: sinon.stub().returns([])
};

const mockQualityScorer = {
  validatePromptQuality: sinon.stub().returns({ score: 85, issues: [] }),
  determinePromptType: sinon.stub().returns('default')
};

const mockFileUtils = {
  getRelativePath: sinon.stub().callsFake((filepath, cwd) => path.relative(cwd, filepath)),
  readFileContent: sinon.stub().returns('mock file content'),
  findMarkdownFiles: sinon.stub().returns([])
};

// Mock the require calls
const originalRequire = require;
const moduleStubs = {
  './security-validator': function() { return mockSecurityValidator; },
  './structure-validator': function() { return mockStructureValidator; },
  './quality-scorer': function() { return mockQualityScorer; },
  './file-utils': function() { return mockFileUtils; }
};

// Override require for this test
require = function(moduleName) {
  if (moduleStubs[moduleName]) {
    return moduleStubs[moduleName];
  }
  return originalRequire.apply(this, arguments);
};

// Import the class to test
const MainValidator = require('../../scripts/validators/main-validator');

// Restore require
require = originalRequire;

describe('MainValidator', () => {
  let validator;
  let tempDir;

  beforeEach(() => {
    validator = new MainValidator();
    tempDir = tmpDir({ unsafeCleanup: true });
    
    // Reset all stubs
    Object.values(mockSecurityValidator).forEach(stub => stub.resetHistory && stub.resetHistory());
    Object.values(mockStructureValidator).forEach(stub => stub.resetHistory && stub.resetHistory());
    Object.values(mockQualityScorer).forEach(stub => stub.resetHistory && stub.resetHistory());
    Object.values(mockFileUtils).forEach(stub => stub.resetHistory && stub.resetHistory());
    
    // Set default return values
    mockSecurityValidator.validateSecurity.returns([]);
    mockStructureValidator.validateXMLStructure.returns(true);
    mockStructureValidator.getErrors.returns([]);
    mockStructureValidator.getWarnings.returns([]);
    mockQualityScorer.validatePromptQuality.returns({ score: 85, issues: [] });
    mockQualityScorer.determinePromptType.returns('default');
    mockFileUtils.readFileContent.returns('mock file content');
    mockFileUtils.findMarkdownFiles.returns([]);
  });

  afterEach(() => {
    tempDir.removeCallback();
  });

  describe('Constructor', () => {
    it('should initialize with default options', () => {
      const v = new MainValidator();
      
      expect(v.excludePatterns).to.include('node_modules');
      expect(v.excludePatterns).to.include('.git');
      expect(v.excludePatterns).to.include('test');
      expect(v.excludePatterns).to.include('__pycache__');
    });

    it('should accept custom exclude patterns', () => {
      const customPatterns = ['custom1', 'custom2'];
      const v = new MainValidator({ excludePatterns: customPatterns });
      
      expect(v.excludePatterns).to.deep.equal(customPatterns);
    });

    it('should initialize stats with correct structure', () => {
      expect(validator.stats).to.have.property('totalFiles', 0);
      expect(validator.stats).to.have.property('validFiles', 0);
      expect(validator.stats).to.have.property('commandFiles', 0);
      expect(validator.stats).to.have.property('promptFiles', 0);
      expect(validator.stats).to.have.property('securityIssues', 0);
      expect(validator.stats).to.have.property('qualityScore', 0);
      expect(validator.stats.errors).to.be.an('array').that.is.empty;
      expect(validator.stats.warnings).to.be.an('array').that.is.empty;
      expect(validator.stats.securityReport).to.be.an('array').that.is.empty;
      expect(validator.stats.fileTypes).to.be.instanceOf(Map);
    });

    it('should initialize validators array', () => {
      expect(validator.validators).to.be.an('array');
      expect(validator.validators).to.have.lengthOf(4);
      
      const validatorNames = validator.validators.map(v => v.name);
      expect(validatorNames).to.include('xmlStructure');
      expect(validatorNames).to.include('cmdStructure');
      expect(validatorNames).to.include('security');
      expect(validatorNames).to.include('quality');
    });
  });

  describe('validateFile', () => {
    it('should validate a basic file successfully', async () => {
      const filepath = '/test/file.md';
      mockFileUtils.getRelativePath.returns('file.md');
      mockFileUtils.readFileContent.returns('# Test File\n\nContent here');
      
      const result = await validator.validateFile(filepath);
      
      expect(result.valid).to.be.true;
      expect(result.fileType).to.equal('default');
      expect(result.qualityScore).to.equal(85);
      expect(validator.stats.totalFiles).to.equal(1);
      expect(validator.stats.validFiles).to.equal(1);
    });

    it('should detect command files correctly', async () => {
      const filepath = '/test/.claude/commands/test-command.md';
      mockFileUtils.getRelativePath.returns('.claude/commands/test-command.md');
      mockFileUtils.readFileContent.returns('# Test Command\n\n## Usage\n\nCommand usage here');
      
      await validator.validateFile(filepath);
      
      expect(validator.stats.commandFiles).to.equal(1);
      expect(validator.stats.promptFiles).to.equal(0);
    });

    it('should detect prompt files correctly', async () => {
      const filepath = '/test/prompts/01-test/test-prompt.md';
      mockFileUtils.getRelativePath.returns('prompts/01-test/test-prompt.md');
      mockFileUtils.readFileContent.returns('# Test Prompt\n\nPrompt content here');
      
      await validator.validateFile(filepath);
      
      expect(validator.stats.promptFiles).to.equal(1);
      expect(validator.stats.commandFiles).to.equal(0);
    });

    it('should run XML structure validation when appropriate', async () => {
      const filepath = '/test/file.md';
      const content = '<role>System</role>\n<activation>User: test</activation>';
      mockFileUtils.readFileContent.returns(content);
      
      await validator.validateFile(filepath);
      
      expect(mockStructureValidator.validateXMLStructure.calledOnce).to.be.true;
      expect(mockStructureValidator.validateXMLStructure.calledWith(content, 'file.md')).to.be.true;
    });

    it('should run command structure validation for command files', async () => {
      const filepath = '/test/.claude/commands/test.md';
      mockFileUtils.getRelativePath.returns('.claude/commands/test.md');
      
      await validator.validateFile(filepath);
      
      expect(mockStructureValidator.validateCommandStructure.calledOnce).to.be.true;
    });

    it('should run security validation for all files', async () => {
      const filepath = '/test/file.md';
      const content = 'File content';
      mockFileUtils.readFileContent.returns(content);
      
      await validator.validateFile(filepath);
      
      expect(mockSecurityValidator.validateSecurity.calledOnce).to.be.true;
      expect(mockSecurityValidator.validateSecurity.calledWith(content, 'file.md')).to.be.true;
    });

    it('should run quality validation for all files', async () => {
      const filepath = '/test/file.md';
      const content = 'File content';
      mockFileUtils.readFileContent.returns(content);
      mockQualityScorer.determinePromptType.returns('security');
      
      await validator.validateFile(filepath);
      
      expect(mockQualityScorer.validatePromptQuality.calledOnce).to.be.true;
      expect(mockQualityScorer.validatePromptQuality.calledWith(content, 'file.md', 'security')).to.be.true;
    });

    it('should handle validation errors correctly', async () => {
      const filepath = '/test/file.md';
      mockStructureValidator.validateXMLStructure.returns(false);
      mockStructureValidator.getErrors.returns(['XML error 1', 'XML error 2']);
      
      const result = await validator.validateFile(filepath);
      
      expect(result.valid).to.be.false;
      expect(validator.stats.errors).to.include('XML error 1');
      expect(validator.stats.errors).to.include('XML error 2');
      expect(validator.stats.validFiles).to.equal(0);
    });

    it('should handle validation warnings correctly', async () => {
      const filepath = '/test/file.md';
      mockStructureValidator.getWarnings.returns(['Warning 1', 'Warning 2']);
      mockQualityScorer.validatePromptQuality.returns({ score: 70, issues: ['Quality issue'] });
      
      await validator.validateFile(filepath);
      
      expect(validator.stats.warnings).to.include('Warning 1');
      expect(validator.stats.warnings).to.include('Warning 2');
      expect(validator.stats.warnings).to.include('Quality issue');
    });

    it('should handle security issues correctly', async () => {
      const filepath = '/test/file.md';
      const securityIssues = ['Security issue 1', 'Security issue 2'];
      mockSecurityValidator.validateSecurity.returns(securityIssues);
      
      const result = await validator.validateFile(filepath);
      
      expect(validator.stats.securityReport).to.include('Security issue 1');
      expect(validator.stats.securityReport).to.include('Security issue 2');
      expect(validator.stats.securityIssues).to.equal(2);
      expect(result.valid).to.be.false;
    });

    it('should track quality scores correctly', async () => {
      const filepath1 = '/test/file1.md';
      const filepath2 = '/test/file2.md';
      
      mockQualityScorer.validatePromptQuality.returns({ score: 80, issues: [] });
      await validator.validateFile(filepath1);
      
      mockQualityScorer.validatePromptQuality.returns({ score: 90, issues: [] });
      await validator.validateFile(filepath2);
      
      expect(validator.stats.qualityScore).to.equal(170); // 80 + 90
    });

    it('should handle file read errors gracefully', async () => {
      const filepath = '/test/nonexistent.md';
      const error = new Error('File not found');
      mockFileUtils.readFileContent.throws(error);
      
      const result = await validator.validateFile(filepath);
      
      expect(result.valid).to.be.false;
      expect(result.error).to.equal('File not found');
      expect(validator.stats.errors).to.include('nonexistent.md: File not found');
    });

    it('should track file types correctly', async () => {
      const filepath = '/test/file.md';
      mockQualityScorer.determinePromptType.returns('security');
      
      await validator.validateFile(filepath);
      
      expect(validator.stats.fileTypes.get('file.md')).to.equal('security');
    });
  });

  describe('validateDirectory', () => {
    it('should validate all markdown files in directory', async () => {
      const directory = '/test/directory';
      const files = ['/test/file1.md', '/test/file2.md', '/test/file3.md'];
      mockFileUtils.findMarkdownFiles.returns(files);
      
      const result = await validator.validateDirectory(directory);
      
      expect(mockFileUtils.findMarkdownFiles.calledWith(directory)).to.be.true;
      expect(result.totalFiles).to.equal(3);
      expect(result.validFiles).to.equal(3);
    });

    it('should calculate average quality score', async () => {
      const directory = '/test/directory';
      const files = ['/test/file1.md', '/test/file2.md'];
      mockFileUtils.findMarkdownFiles.returns(files);
      
      // Set up quality scores
      let callCount = 0;
      mockQualityScorer.validatePromptQuality.callsFake(() => {
        callCount++;
        return { score: callCount === 1 ? 80 : 90, issues: [] };
      });
      
      const result = await validator.validateDirectory(directory);
      
      expect(result.qualityScore).to.equal(85); // (80 + 90) / 2
    });

    it('should handle empty directory', async () => {
      const directory = '/test/empty';
      mockFileUtils.findMarkdownFiles.returns([]);
      
      const result = await validator.validateDirectory(directory);
      
      expect(result.totalFiles).to.equal(0);
      expect(result.validFiles).to.equal(0);
      expect(result.qualityScore).to.equal(0);
    });

    it('should aggregate errors from multiple files', async () => {
      const directory = '/test/directory';
      const files = ['/test/file1.md', '/test/file2.md'];
      mockFileUtils.findMarkdownFiles.returns(files);
      
      // Set up errors
      let callCount = 0;
      mockStructureValidator.getErrors.callsFake(() => {
        callCount++;
        return callCount === 1 ? ['Error 1'] : ['Error 2'];
      });
      
      await validator.validateDirectory(directory);
      
      expect(validator.stats.errors).to.include('Error 1');
      expect(validator.stats.errors).to.include('Error 2');
    });

    it('should handle validation errors in individual files', async () => {
      const directory = '/test/directory';
      const files = ['/test/good.md', '/test/bad.md'];
      mockFileUtils.findMarkdownFiles.returns(files);
      
      // Set up file read error for second file
      let callCount = 0;
      mockFileUtils.readFileContent.callsFake(() => {
        callCount++;
        if (callCount === 2) {
          throw new Error('Read error');
        }
        return 'content';
      });
      
      const result = await validator.validateDirectory(directory);
      
      expect(result.totalFiles).to.equal(2);
      expect(result.validFiles).to.equal(1);
      expect(validator.stats.errors).to.have.lengthOf(1);
    });
  });

  describe('getResults', () => {
    it('should return complete results structure', () => {
      // Set up some test data
      validator.stats.errors = ['Error 1'];
      validator.stats.warnings = ['Warning 1'];
      validator.stats.securityReport = ['Security issue'];
      
      const results = validator.getResults();
      
      expect(results).to.have.property('stats');
      expect(results).to.have.property('errors');
      expect(results).to.have.property('warnings');
      expect(results).to.have.property('securityReport');
      
      expect(results.errors).to.deep.equal(['Error 1']);
      expect(results.warnings).to.deep.equal(['Warning 1']);
      expect(results.securityReport).to.deep.equal(['Security issue']);
    });

    it('should return current stats', () => {
      validator.stats.totalFiles = 10;
      validator.stats.validFiles = 8;
      validator.stats.securityIssues = 2;
      
      const results = validator.getResults();
      
      expect(results.stats.totalFiles).to.equal(10);
      expect(results.stats.validFiles).to.equal(8);
      expect(results.stats.securityIssues).to.equal(2);
    });
  });

  describe('generateSummary', () => {
    it('should generate comprehensive summary', () => {
      // Set up test data
      validator.stats.totalFiles = 10;
      validator.stats.validFiles = 8;
      validator.stats.commandFiles = 3;
      validator.stats.promptFiles = 5;
      validator.stats.errors = ['Error 1', 'Error 2'];
      validator.stats.warnings = ['Warning 1'];
      validator.stats.securityIssues = 1;
      validator.stats.qualityScore = 85;
      validator.stats.fileTypes.set('file1.md', 'command');
      validator.stats.fileTypes.set('file2.md', 'command');
      validator.stats.fileTypes.set('file3.md', 'security');
      
      const summary = validator.generateSummary();
      
      expect(summary.totalFiles).to.equal(10);
      expect(summary.validFiles).to.equal(8);
      expect(summary.commandFiles).to.equal(3);
      expect(summary.promptFiles).to.equal(5);
      expect(summary.errorCount).to.equal(2);
      expect(summary.warningCount).to.equal(1);
      expect(summary.securityIssues).to.equal(1);
      expect(summary.averageQualityScore).to.equal(85);
      
      expect(summary.fileTypeBreakdown).to.have.property('command', 2);
      expect(summary.fileTypeBreakdown).to.have.property('security', 1);
    });

    it('should handle empty file type breakdown', () => {
      const summary = validator.generateSummary();
      
      expect(summary.fileTypeBreakdown).to.be.an('object');
      expect(Object.keys(summary.fileTypeBreakdown)).to.have.lengthOf(0);
    });

    it('should calculate file type breakdown correctly', () => {
      validator.stats.fileTypes.set('file1.md', 'command');
      validator.stats.fileTypes.set('file2.md', 'command');
      validator.stats.fileTypes.set('file3.md', 'command');
      validator.stats.fileTypes.set('file4.md', 'security');
      validator.stats.fileTypes.set('file5.md', 'security');
      validator.stats.fileTypes.set('file6.md', 'default');
      
      const summary = validator.generateSummary();
      
      expect(summary.fileTypeBreakdown.command).to.equal(3);
      expect(summary.fileTypeBreakdown.security).to.equal(2);
      expect(summary.fileTypeBreakdown.default).to.equal(1);
    });
  });

  describe('Validator Registry', () => {
    it('should have correct validator structure', () => {
      const xmlValidator = validator.validators.find(v => v.name === 'xmlStructure');
      
      expect(xmlValidator).to.have.property('name', 'xmlStructure');
      expect(xmlValidator).to.have.property('when');
      expect(xmlValidator).to.have.property('run');
      expect(xmlValidator).to.have.property('collect');
      
      expect(xmlValidator.when).to.be.a('function');
      expect(xmlValidator.run).to.be.a('function');
      expect(xmlValidator.collect).to.be.a('function');
    });

    it('should conditionally run XML validator', () => {
      const xmlValidator = validator.validators.find(v => v.name === 'xmlStructure');
      
      expect(xmlValidator.when('file.md', '<role>test</role>')).to.be.true;
      expect(xmlValidator.when('file.md', '<activation>test</activation>')).to.be.true;
      expect(xmlValidator.when('file.md', 'no xml here')).to.be.false;
    });

    it('should conditionally run command validator', () => {
      const cmdValidator = validator.validators.find(v => v.name === 'cmdStructure');
      
      expect(cmdValidator.when('.claude/commands/test.md', 'content')).to.be.true;
      expect(cmdValidator.when('prompts/test.md', 'content')).to.be.false;
    });

    it('should always run security validator', () => {
      const securityValidator = validator.validators.find(v => v.name === 'security');
      
      expect(securityValidator.when('any-file.md', 'any content')).to.be.true;
    });

    it('should always run quality validator', () => {
      const qualityValidator = validator.validators.find(v => v.name === 'quality');
      
      expect(qualityValidator.when('any-file.md', 'any content')).to.be.true;
    });
  });

  describe('Edge Cases', () => {
    it('should handle files with no validation needed', async () => {
      const filepath = '/test/simple.md';
      mockFileUtils.readFileContent.returns('Simple content with no special features');
      
      // Set up validators to not trigger
      mockQualityScorer.determinePromptType.returns('documentation');
      
      const result = await validator.validateFile(filepath);
      
      expect(result.valid).to.be.true;
      expect(validator.stats.totalFiles).to.equal(1);
    });

    it('should handle very large files', async () => {
      const filepath = '/test/large.md';
      const largeContent = 'a'.repeat(100000);
      mockFileUtils.readFileContent.returns(largeContent);
      
      const result = await validator.validateFile(filepath);
      
      expect(result.valid).to.be.true;
    });

    it('should handle special characters in filenames', async () => {
      const filepath = '/test/file with spaces & special chars.md';
      mockFileUtils.getRelativePath.returns('file with spaces & special chars.md');
      
      const result = await validator.validateFile(filepath);
      
      expect(result.valid).to.be.true;
      expect(validator.stats.fileTypes.has('file with spaces & special chars.md')).to.be.true;
    });

    it('should handle multiple validator failures', async () => {
      const filepath = '/test/bad-file.md';
      
      // Set up multiple failures
      mockStructureValidator.validateXMLStructure.returns(false);
      mockStructureValidator.getErrors.returns(['XML error']);
      mockSecurityValidator.validateSecurity.returns(['Security issue']);
      mockQualityScorer.validatePromptQuality.returns({ score: 30, issues: ['Quality issue'] });
      
      const result = await validator.validateFile(filepath);
      
      expect(result.valid).to.be.false;
      expect(validator.stats.errors).to.include('XML error');
      expect(validator.stats.warnings).to.include('Quality issue');
      expect(validator.stats.securityReport).to.include('Security issue');
      expect(validator.stats.securityIssues).to.equal(1);
    });

    it('should handle zero quality scores', async () => {
      const filepath = '/test/file.md';
      mockQualityScorer.validatePromptQuality.returns({ score: 0, issues: [] });
      
      await validator.validateFile(filepath);
      
      expect(validator.stats.qualityScore).to.equal(0);
    });
  });

  describe('Integration Tests', () => {
    it('should handle realistic validation scenario', async () => {
      const directory = '/test/project';
      const files = [
        '/test/project/.claude/commands/deploy.md',
        '/test/project/prompts/security/audit.md',
        '/test/project/README.md'
      ];
      
      mockFileUtils.findMarkdownFiles.returns(files);
      mockFileUtils.getRelativePath.callsFake((filepath, cwd) => path.relative(cwd, filepath));
      
      // Set up realistic responses
      let fileIndex = 0;
      mockFileUtils.readFileContent.callsFake(() => {
        const contents = [
          '# Deploy Command\n\n## Usage\n\nDeploy stuff',
          '<role>Security auditor</role>\n<activation>audit</activation>',
          '# Project README\n\nDocumentation'
        ];
        return contents[fileIndex++] || 'default content';
      });
      
      mockQualityScorer.determinePromptType.callsFake((filename) => {
        if (filename.includes('commands')) return 'command';
        if (filename.includes('security')) return 'security';
        return 'documentation';
      });
      
      const result = await validator.validateDirectory(directory);
      
      expect(result.totalFiles).to.equal(3);
      expect(result.commandFiles).to.equal(1);
      expect(result.promptFiles).to.equal(1);
      expect(validator.stats.fileTypes.size).to.equal(3);
    });
  });
});