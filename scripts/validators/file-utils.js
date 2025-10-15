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

  findMarkdownFiles(directory) {
    if (!directory || !fs.existsSync(directory)) {
      return [];
    }

    const results = [];
    const visited = new Set();

    const walk = (dir) => {
      if (this.shouldExclude(dir)) {
        return;
      }

      let realDir;
      try {
        realDir = fs.realpathSync(dir);
      } catch (error) {
        realDir = dir;
      }

      if (visited.has(realDir)) {
        return;
      }
      visited.add(realDir);

      let items;
      try {
        items = fs.readdirSync(dir);
      } catch (error) {
        return;
      }

      for (const item of items) {
        const fullPath = path.join(dir, item);

        if (this.shouldExclude(fullPath)) {
          continue;
        }

        let stats;
        try {
          stats = fs.lstatSync(fullPath);
        } catch (error) {
          continue;
        }

        if (stats.isDirectory()) {
          walk(fullPath);
          continue;
        }

        if (stats.isSymbolicLink()) {
          try {
            const linkStats = fs.statSync(fullPath);
            if (linkStats.isDirectory()) {
              walk(fullPath);
              continue;
            }

            if (linkStats.isFile() && fullPath.toLowerCase().endsWith('.md')) {
              results.push(fullPath);
            }
          } catch (error) {
            continue;
          }
          continue;
        }

        if (stats.isFile() && fullPath.toLowerCase().endsWith('.md')) {
          results.push(fullPath);
        }
      }
    };

    walk(path.resolve(directory));
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
