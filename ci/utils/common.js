/**
 * Common utilities for CI pipeline
 * Shared functionality across CI scripts
 */

const fs = require('fs');
const path = require('path');

class CommonUtils {
  /**
   * Ensure reports directory exists
   * @param {string} subDir - Optional subdirectory
   */
  static ensureReportsDir(subDir = '') {
    const reportsDir = path.join(process.cwd(), 'ci', 'reports', subDir);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    return reportsDir;
  }

  /**
   * Safe JSON parse with error handling
   * @param {string} filePath - Path to JSON file
   * @returns {Object} Parsed JSON object
   * @throws {Error} If file doesn't exist or is malformed
   */
  static safeJSONParse(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      throw new Error(`Malformed JSON file at ${filePath}: ${err.message}`);
    }
  }

  /**
   * Safe file write with directory creation
   * @param {string} filePath - Path to write file
   * @param {string} content - Content to write
   */
  static safeFileWrite(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  }

  /**
   * Get files sorted by modification time
   * @param {string} directory - Directory to scan
   * @param {string} extension - File extension filter
   * @returns {Array} Array of file objects with name and mtime
   */
  static getFilesByModTime(directory, extension = '') {
    if (!fs.existsSync(directory)) {
      return [];
    }

    const files = fs.readdirSync(directory)
      .filter(f => !extension || f.endsWith(extension))
      .map(f => {
        const fullPath = path.join(directory, f);
        return {
          name: f,
          path: fullPath,
          mtime: fs.statSync(fullPath).mtime
        };
      })
      .sort((a, b) => b.mtime - a.mtime);

    return files;
  }

  /**
   * Check file permissions using bitwise operations
   * @param {string} filePath - Path to file
   * @returns {Object} Permission analysis
   */
  static checkFilePermissions(filePath) {
    const stats = fs.statSync(filePath);
    const mode = stats.mode;

    return {
      isWorldReadable: (mode & 0o004) !== 0,
      isWorldWritable: (mode & 0o002) !== 0,
      isWorldExecutable: (mode & 0o001) !== 0,
      octal: mode.toString(8),
      dangerous: (mode & 0o002) !== 0 // World writable is dangerous
    };
  }

  /**
   * Create standard results object
   * @param {string} type - Type of operation
   * @returns {Object} Standard results structure
   */
  static createResults(type) {
    return {
      timestamp: new Date().toISOString(),
      type,
      passed: true,
      errors: [],
      warnings: [],
      summary: {}
    };
  }

  /**
   * Add error to results object
   * @param {Object} results - Results object
   * @param {string} type - Error type
   * @param {string} message - Error message
   * @param {Object} metadata - Additional metadata
   */
  static addError(results, type, message, metadata = {}) {
    results.errors.push({
      type,
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    });
    results.passed = false;
  }

  /**
   * Add warning to results object
   * @param {Object} results - Results object
   * @param {string} type - Warning type
   * @param {string} message - Warning message
   * @param {Object} metadata - Additional metadata
   */
  static addWarning(results, type, message, metadata = {}) {
    results.warnings.push({
      type,
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }

  /**
   * Normalize filename for cross-platform compatibility
   * @param {string} name - Original filename
   * @returns {string} Normalized filename
   */
  static normalizeFilename(name) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
   * Format category title
   * @param {string} category - Category string
   * @returns {string} Formatted title
   */
  static formatCategoryTitle(category) {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Generate anchor for markdown headers
   * @param {string} text - Header text
   * @returns {string} Anchor string
   */
  static generateAnchor(text) {
    return text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  /**
   * Print summary with consistent formatting
   * @param {string} title - Summary title
   * @param {Object} results - Results object
   */
  static printSummary(title, results) {
    console.log(`\n${title}`);
    console.log('='.repeat(title.length));
    
    if (results.passed) {
      console.log('✅ Operation completed successfully');
    } else {
      console.log('❌ Operation failed');
    }
    
    if (results.errors.length > 0) {
      console.log(`❌ Errors: ${results.errors.length}`);
    }
    
    if (results.warnings.length > 0) {
      console.log(`⚠️  Warnings: ${results.warnings.length}`);
    }
  }

  /**
   * Save results to JSON file
   * @param {Object} results - Results object
   * @param {string} filename - Output filename
   */
  static saveResults(results, filename) {
    const resultsPath = path.join('ci', 'reports', filename);
    this.safeFileWrite(resultsPath, JSON.stringify(results, null, 2));
  }

  /**
   * Deduplicate array by property
   * @param {Array} array - Array to deduplicate
   * @param {string} property - Property to use for deduplication
   * @returns {Array} Deduplicated array
   */
  static deduplicateBy(array, property) {
    const seen = new Set();
    return array.filter(item => {
      const key = item[property];
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

module.exports = CommonUtils;