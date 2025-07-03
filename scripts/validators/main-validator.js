/**
 * Main validation orchestrator
 * Coordinates all validation modules and generates reports
 */

const SecurityValidator = require('./security-validator');
const StructureValidator = require('./structure-validator');
const QualityScorer = require('./quality-scorer');
const FileUtils = require('./file-utils');

class MainValidator {
  constructor(options = {}) {
    this.excludePatterns = options.excludePatterns || ['node_modules', '.git', 'test', '__pycache__'];
    
    // Initialize sub-validators
    this.securityValidator = new SecurityValidator();
    this.structureValidator = new StructureValidator();
    this.qualityScorer = new QualityScorer();
    this.fileUtils = new FileUtils(this.excludePatterns);
    
    // Aggregate results
    this.stats = {
      totalFiles: 0,
      validFiles: 0,
      commandFiles: 0,
      promptFiles: 0,
      securityIssues: 0,
      qualityScore: 0,
      errors: [],
      warnings: [],
      securityReport: [],
      fileTypes: new Map()
    };
  }

  // Validate a single file
  async validateFile(filepath) {
    const filename = this.fileUtils.getRelativePath(filepath, process.cwd());
    
    try {
      const content = this.fileUtils.readFileContent(filepath);
      this.stats.totalFiles++;
      
      // Determine file type
      const fileType = this.qualityScorer.determinePromptType(filename, content);
      this.stats.fileTypes.set(filename, fileType);
      
      // Track command vs prompt files
      if (filename.includes('.claude/commands/')) {
        this.stats.commandFiles++;
      } else if (filename.includes('prompts/')) {
        this.stats.promptFiles++;
      }
      
      let isValid = true;
      
      // Structure validation
      if (content.includes('<role>') || content.includes('<activation>')) {
        isValid = this.structureValidator.validateXMLStructure(content, filename);
        if (!isValid) {
          this.stats.errors.push(...this.structureValidator.getErrors());
        }
      }
      
      // Command structure validation
      if (filename.includes('.claude/commands/')) {
        this.structureValidator.validateCommandStructure(content, filename);
        this.stats.errors.push(...this.structureValidator.getErrors());
        this.stats.warnings.push(...this.structureValidator.getWarnings());
      }
      
      // Security validation
      const securityIssues = this.securityValidator.validateSecurity(content, filename);
      if (securityIssues.length > 0) {
        this.stats.securityIssues += securityIssues.length;
        this.stats.securityReport.push(...securityIssues);
        isValid = false;
      }
      
      // Quality scoring
      const qualityResult = this.qualityScorer.validatePromptQuality(content, filename, fileType);
      this.stats.qualityScore += qualityResult.score;
      
      if (qualityResult.issues.length > 0) {
        this.stats.warnings.push(...qualityResult.issues);
      }
      
      if (isValid) {
        this.stats.validFiles++;
      }
      
      return {
        valid: isValid,
        fileType,
        qualityScore: qualityResult.score
      };
      
    } catch (error) {
      this.stats.errors.push(`${filename}: ${error.message}`);
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Validate all files in a directory
  async validateDirectory(directory) {
    const files = this.fileUtils.findMarkdownFiles(directory);
    
    for (const file of files) {
      await this.validateFile(file);
    }
    
    // Calculate average quality score
    if (this.stats.totalFiles > 0) {
      this.stats.qualityScore = Math.round(this.stats.qualityScore / this.stats.totalFiles);
    }
    
    return this.stats;
  }

  // Get validation results
  getResults() {
    return {
      stats: this.stats,
      errors: this.stats.errors,
      warnings: this.stats.warnings,
      securityReport: this.stats.securityReport
    };
  }

  // Generate summary report
  generateSummary() {
    const summary = {
      totalFiles: this.stats.totalFiles,
      validFiles: this.stats.validFiles,
      commandFiles: this.stats.commandFiles,
      promptFiles: this.stats.promptFiles,
      errorCount: this.stats.errors.length,
      warningCount: this.stats.warnings.length,
      securityIssues: this.stats.securityIssues,
      averageQualityScore: this.stats.qualityScore,
      fileTypeBreakdown: Object.fromEntries(
        Array.from(this.stats.fileTypes.entries())
          .reduce((acc, [file, type]) => {
            acc.set(type, (acc.get(type) || 0) + 1);
            return acc;
          }, new Map())
      )
    };
    
    return summary;
  }
}

module.exports = MainValidator;