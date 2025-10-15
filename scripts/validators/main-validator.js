/**
 * main validation orchestrator
 * coordinates all validation modules and generates reports
 */

const path = require('path');
const SecurityValidator = require('./security-validator');
const StructureValidator = require('./structure-validator');
const QualityScorer = require('./quality-scorer');
const FileUtils = require('./file-utils');

class MainValidator {
  constructor(options = {}) {
    if (Array.isArray(options)) {
      this.excludePatterns = options;
    } else {
      this.excludePatterns = options.excludePatterns || ['node_modules', '.git', 'test', '__pycache__'];
    }

    // initialize sub-validators
    this.securityValidator = new SecurityValidator();
    this.structureValidator = new StructureValidator();
    this.qualityScorer = new QualityScorer();
    this.fileUtils = new FileUtils(this.excludePatterns);

    // aggregate results
    this.stats = {
      totalFiles: 0,
      validFiles: 0,
      commandFiles: 0,
      promptFiles: 0,
      securityIssues: 0,
      qualityScore: 0,
      qualityScoreTotal: 0,
      errors: [],
      warnings: [],
      securityReport: [],
      fileTypes: new Map()
    };
  }

  // helper function to safely invoke functions with error handling
  safeInvoke(fn, ...args) {
    try {
      return { value: fn(...args) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }

    // table-driven validator registry
    this.validators = [
      {
        name: 'xmlStructure',
        when: (f, c) => /(<role>|<activation>|<instructions>|<output_format>)/i.test(c),
        run: (f, c) => {
          if (!/(<role>|<activation>|<instructions>|<output_format>)/i.test(c)) {
            this.structureValidator.errors = [];
            this.structureValidator.warnings = [];
            return true;
          }
          return this.structureValidator.validateXMLStructure(c, f);
        },
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
          warnings: result.warnings,
          valid: Array.isArray(result.errors) ? result.errors.length === 0 : true
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

    this.validators.forEach(validator => {
      validator.originalRun = validator.run;
    });
  }

  // validate a single file
  validateFile(filepath) {
    const absolutePath = path.resolve(filepath);
    const filename = this.fileUtils.getRelativePath(absolutePath, process.cwd());
    let isValid = true;
    let lastQualityScore = 0;

    try {
      const content = this.fileUtils.readFileContent(absolutePath);
      this.stats.totalFiles++;

      const fileType = this.qualityScorer.determinePromptType(filename, content);
      this.stats.fileTypes.set(absolutePath, fileType);

      if (fileType === 'command' || absolutePath.includes('.claude/commands/')) {
        this.stats.commandFiles++;
      } else if (fileType === 'prompt') {
        this.stats.promptFiles++;
      }

      if (!content.trim()) {
        isValid = false;
        this.stats.errors.push(`${absolutePath}: Empty or whitespace-only file`);
      }

      for (const { when, run, collect } of this.validators) {
        // test eligibility
        const { value: shouldRun, error: whenErr } = this.safeInvoke(when, absolutePath, content);
        if (whenErr) {
          this.stats.errors.push(`${absolutePath}: ${whenErr}`);
          isValid = false;
          continue;
        }
        if (!shouldRun) continue;

        // run validation
        const { value: result, error: runErr } = this.safeInvoke(run, absolutePath, content, fileType);
        if (runErr) {
          this.stats.errors.push(`${absolutePath}: ${runErr}`);
          isValid = false;
          continue;
        }

        // collect results
        const collected = collect(result);
        this.stats.errors.push(...(collected.errors || []));
        this.stats.warnings.push(...(collected.warnings || []));
        if (collected.securityReport) {
          this.stats.securityReport.push(...collected.securityReport);
          this.stats.securityIssues += collected.securityCount || 0;
        }
        if (collected.qualityScore != null) {
          this.stats.qualityScoreTotal += collected.qualityScore;
          this.stats.qualityScore = collected.qualityScore;
          lastQualityScore = collected.qualityScore;
        }
        if (collected.valid === false) isValid = false;
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
      const message = error instanceof Error ? error.message : String(error);
      this.stats.errors.push(`${absolutePath}: ${message}`);
      return {
        valid: false,
        error: message
      };
    }
  }

  // validate all files in a directory
  validateDirectory(directory) {
    const files = this.fileUtils.findMarkdownFiles(directory);

    for (const file of files) {
      this.validateFile(file);
    }

    // calculate average quality score
    if (this.stats.totalFiles > 0) {
      this.stats.qualityScore = Math.round(this.stats.qualityScoreTotal / this.stats.totalFiles);
    }

    return this.stats;
  }

  // get validation results
  getResults() {
    return {
      stats: this.stats,
      errors: this.stats.errors,
      warnings: this.stats.warnings,
      securityReport: this.stats.securityReport
    };
  }

  // generate summary report
  generateSummary() {
    const averageQuality =
      this.stats.totalFiles > 0
        ? Math.round(this.stats.qualityScoreTotal / this.stats.totalFiles)
        : 0;

    const breakdownMap = Array.from(this.stats.fileTypes.values()).reduce((acc, type) => {
      const count = acc.get(type) || 0;
      acc.set(type, count + 1);
      return acc;
    }, new Map());

    return {
      totalFiles: this.stats.totalFiles,
      validFiles: this.stats.validFiles,
      commandFiles: this.stats.commandFiles,
      promptFiles: this.stats.promptFiles,
      errorCount: this.stats.errors.length,
      warningCount: this.stats.warnings.length,
      securityIssues: this.stats.securityIssues,
      averageQualityScore: averageQuality,
      fileTypeBreakdown: Object.fromEntries(breakdownMap)
    };

  }
}

module.exports = MainValidator;
