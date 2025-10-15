/**
 * file utilities module for validation scripts
 * handles file discovery and path operations
 */

const fs = require('fs');
const path = require('path');

class FileUtils {
  constructor(excludePatterns = []) {
    this.excludePatterns = excludePatterns;
  }

  // validate path to prevent directory traversal attacks
  validatePath(inputPath) {
    if (!inputPath || typeof inputPath !== 'string') {
      throw new Error('Invalid path: path must be a non-empty string');
    }

    // normalize the path and resolve any relative components
    const normalized = path.normalize(inputPath);

    // check for path traversal attempts
    if (normalized.includes('..') || normalized.includes('\0')) {
      throw new Error(`Invalid path: potential path traversal detected in "${inputPath}"`);
    }

    return normalized;
  }

  findMarkdownFiles(directory) {
    if (!directory) {
      throw new Error('Directory parameter is required');
    }

    // validate the path to prevent security issues
    const validatedPath = this.validatePath(directory);

    if (!fs.existsSync(validatedPath)) {
      throw new Error(`Directory "${validatedPath}" does not exist or is not accessible`);
    }

    const results = [];
    const visited = new Set();
    const startPath = path.resolve(validatedPath);

    const walk = (dir) => {
      // prevent infinite loops and exclude unwanted directories
      if (this.shouldExclude(dir) || visited.has(dir)) {
        return;
      }

      try {
        const realDir = fs.realpathSync(dir);
        if (visited.has(realDir)) {
          return;
        }
        visited.add(dir);
        visited.add(realDir);
      } catch {
        // if we can't resolve realpath, still add the original path
        visited.add(dir);
      }

      try {
        const items = fs.readdirSync(dir);

        for (const item of items) {
          const fullPath = path.join(dir, item);

          if (this.shouldExclude(fullPath)) {
            continue;
          }

          try {
            const stats = fs.lstatSync(fullPath);

            if (stats.isDirectory()) {
              walk(fullPath);
            } else if (stats.isSymbolicLink()) {
              const linkStats = fs.statSync(fullPath);
              if (linkStats.isDirectory()) {
                walk(fullPath);
              } else if (linkStats.isFile() && fullPath.toLowerCase().endsWith('.md')) {
                results.push(fullPath);
              }
            } else if (stats.isFile() && fullPath.toLowerCase().endsWith('.md')) {
              results.push(fullPath);
            }
          } catch {
            // skip files/directories we can't access
            continue;
          }
        }
      } catch {
        // skip directories we can't read
        return;
      }
    };

    walk(startPath);
    return results;
  }

  readFileContent(filepath) {
    try {
      return fs.readFileSync(filepath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read ${filepath}: ${error.message}`);
    }
  }

  getRelativePath(filepath, rootDir) {
    const relativePath = path.relative(rootDir, filepath);
    return relativePath === '' ? '.' : relativePath;
  }

  shouldExclude(filepath) {
    if (!this.excludePatterns || this.excludePatterns.length === 0) {
      return false;
    }

    const segments = filepath.split(/[/\\]+/).filter(Boolean);
    return this.excludePatterns.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(filepath);
      }
      return segments.includes(pattern);
    });
  }

  setExcludePatterns(patterns) {
    this.excludePatterns = patterns;
  }
}

module.exports = FileUtils;
