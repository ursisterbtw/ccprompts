/**
 * Path Utilities
 * Secure path handling utilities with whitelist-based validation
 */

const path = require('path');

// whitelist of allowed file paths only
const allowedFiles = {
  'package.json': 'package.json',
  'README.md': 'README.md',
  'PLUGIN.md': 'PLUGIN.md',
  'CLAUDE.md': 'CLAUDE.md',
  '.claude-plugin/plugin.json': '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json': '.claude-plugin/marketplace.json'
};

// whitelist of allowed directories
const allowedDirs = {
  '.claude/commands': '.claude/commands',
  '.claude/agents': '.claude/agents',
  'commands': 'commands',
  'agents': 'agents'
};

/**
 * Security utility to get safe file paths - whitelist approach with path.relative validation
 * @param {string} filePath - The file path to validate
 * @param {string} projectRoot - The project root directory
 * @returns {string} The validated, resolved path
 * @throws {Error} If path traversal or access denied
 */
const getSafePath = (filePath, projectRoot) => {
  // check if it's an allowed file
  if (allowedFiles[filePath]) {
    return path.join(projectRoot, allowedFiles[filePath]);
  }

  // check if it's an allowed directory
  if (allowedDirs[filePath]) {
    return path.join(projectRoot, allowedDirs[filePath]);
  }

  // check if it's a subdirectory of an allowed directory using path.relative for security
  for (const [dirName, dirPath] of Object.entries(allowedDirs)) {
    if (filePath.startsWith(dirName + path.sep) || filePath === dirName) {
      const resolvedPath = path.resolve(projectRoot, filePath);
      const normalizedProjectRoot = path.resolve(projectRoot);

      // use path.relative for proper cross-platform path traversal detection
      const rel = path.relative(normalizedProjectRoot, resolvedPath);

      // allow if rel is empty (same path) or doesn't start with '..' and is not '..'
      if (rel === '' || (rel && !rel.startsWith('..' + path.sep) && rel !== '..')) {
        return resolvedPath;
      } else {
        throw new Error('Path traversal detected: ' + filePath);
      }
    }
  }

  throw new Error('Access denied: ' + filePath);
};

module.exports = {
  getSafePath,
  allowedFiles,
  allowedDirs
};