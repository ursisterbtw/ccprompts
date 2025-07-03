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

  // Find all markdown files recursively
  findMarkdownFiles(directory) {
    const files = [];
    
    const walk = (dir) => {
      // Skip excluded directories
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

  // Read file content with error handling
  readFileContent(filepath) {
    try {
      return fs.readFileSync(filepath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read ${filepath}: ${error.message}`);
    }
  }

  // Get relative path from project root
  getRelativePath(filepath, rootDir) {
    return path.relative(rootDir, filepath);
  }

  // Check if path matches any exclude pattern (by segment or RegExp)
  shouldExclude(filepath) {
    const segments = filepath.split(path.sep);
    return this.excludePatterns.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(filepath);
      }
      // Match full path segments only
      return segments.includes(pattern);
    });
  }

  // Update exclude patterns
  setExcludePatterns(patterns) {
    this.excludePatterns = patterns;
  }
}

module.exports = FileUtils;