/**
 * File utilities module for validation scripts
 * Handles file discovery and path operations
 */

const fs = require('fs');
const path = require('path');

class FileUtils {
  constructor(excludePatterns = []) {
    this.excludePatterns = excludePatterns;
  }

  findMarkdownFiles(directory) {
    const files = [];

    const walk = (dir) => {
      const dirName = path.basename(dir);
      if (this.excludePatterns.some(pattern => dirName.includes(pattern))) {
        return;
      }

      try {
        const items = fs.readdirSync(dir);

        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            walk(fullPath);
          } else if (item.endsWith('.md')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
      }
    };

    walk(directory);
    return files;
  }

  readFileContent(filepath) {
    try {
      return fs.readFileSync(filepath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read ${filepath}: ${error.message}`);
    }
  }

  getRelativePath(filepath, rootDir) {
    return path.relative(rootDir, filepath);
  }

  shouldExclude(filepath) {
    const segments = filepath.split(path.sep);
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
