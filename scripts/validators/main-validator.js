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
    
    // Table-driven validator registry
      {
        name: 'xmlStructure',
        when: (f, c) => c.includes('<role>') || c.includes('<activation>'),
        run: (f, c) => this.structureValidator.validateXMLStructure(c, f),
        collect: (result) => ({
          errors: result ? [] : this.structureValidator.getErrors(),
          valid: result
        })
      },
      {
        name: 'cmdStructure',
        when: (f, c) => f.includes('.claude/commands/'),
        run: (f, c) => {
          this.structureValidator.validateCommandStructure(c, f);
          return { errors: this.structureValidator.getErrors(), warnings: this.structureValidator.getWarnings() };
        },
        collect: (result) => ({
          errors: result.errors,
          warnings: result.warnings
        })
      },
      {
        name: 'security',
        when: () => true,
        run: (f, c) => this.securityValidator.validateSecurity(c, f),
        collect: (issues) => ({
          securityReport: issues,
          securityCount: issues.length,
          valid: issues.length === 0
        })
      },
      {
        name: 'quality',
        when: () => true,
        run: (f, c, t) => this.qualityScorer.validatePromptQuality(c, f, t),
        collect: (result) => ({
          warnings: result.issues,
          qualityScore: result.score
        })
      }
    ];
  }

  // Validate a single file
  async validateFile(filepath) {
    const filename = this.fileUtils.getRelativePath(filepath, process.cwd());
    let isValid = true;
    let lastQualityScore = 0;
    
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
      
      // Run all validators using table-driven approach
      for (const validator of this.validators) {
        if (!validator.when(filename, content)) continue;
        
        const result = validator.run(filename, content, fileType);
        const collected = validator.collect(result);
        
        // Process collected results
        if (collected.errors) {
          this.stats.errors.push(...collected.errors);
        }
        if (collected.warnings) {
          this.stats.warnings.push(...collected.warnings);
        }
        if (collected.securityReport) {
          this.stats.securityReport.push(...collected.securityReport);
          this.stats.securityIssues += collected.securityCount || 0;
        }
        if (collected.qualityScore !== undefined) {
          this.stats.qualityScore += collected.qualityScore;
          lastQualityScore = collected.qualityScore;
        }
        if (collected.valid === false) {
          isValid = false;
        }
      }
      
      if (isValid) {
        this.stats.validFiles++;
      }
      
      return {
        valid: isValid,
        fileType,
        qualityScore: lastQualityScore
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
    return {
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

  }
}

module.exports = MainValidator;