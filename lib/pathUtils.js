/**
 * Path Utilities
 * Secure path handling with dynamic directory support and path traversal prevention
 */

const path = require('path');

// Documented allowed directories that serve legitimate purposes
const documentedDirs = [
  '.claude/commands',
  '.claude/agents',
  '.claude-plugin',
  'commands',  // symlink
  'agents',    // symlink
  'docs',
  'lib',
  'scripts',
  'templates',
  'tests',
  '.github'
];

// Whitelist of allowed root-level files
const allowedRootFiles = [
  'package.json',
  'README.md',
  'PLUGIN.md',
  'CLAUDE.md',
  'PLANNING.md',
  'TASKS.md',
  'CHANGELOG.md',
  'LICENSE',
  'CONTRIBUTING.md'
];

/**
 * Check if a directory is in the documented directories list
 * @param {string} dirPath - The directory path to check
 * @returns {boolean} True if the directory is documented/allowed
 */
const isDocumentedDirectory = (dirPath) => {
  // normalize path separators to forward slashes for consistency
  const normalized = dirPath.replace(/\\/g, '/');

  // check exact matches
  if (documentedDirs.includes(normalized)) {
    return true;
  }

  // check if it's a subdirectory of a documented directory
  for (const docDir of documentedDirs) {
    const prefix = docDir + '/';
    if (normalized.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};

/**
 * Check for path traversal attempts using path.relative validation
 * @param {string} requestedPath - The requested file path
 * @param {string} projectRoot - The project root directory
 * @returns {boolean} True if the path is safe (no traversal detected)
 */
const isSafePath = (requestedPath, projectRoot) => {
  try {
    const resolvedPath = path.resolve(projectRoot, requestedPath);
    const normalizedRoot = path.resolve(projectRoot);

    // Use path.relative to detect traversal attempts
    const relative = path.relative(normalizedRoot, resolvedPath);

    // Path traversal attempts will have '..' in the relative path
    if (relative.startsWith('..') || relative === '..') {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Security utility to get safe file paths with dynamic directory support
 * Prevents path traversal while allowing documented directories
 * @param {string} filePath - The file path to validate
 * @param {string} projectRoot - The project root directory
 * @returns {string} The validated, resolved path
 * @throws {Error} If path traversal detected or access denied
 */
const getSafePath = (filePath, projectRoot) => {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path: must be a non-empty string');
  }

  if (!projectRoot || typeof projectRoot !== 'string') {
    throw new Error('Invalid project root: must be a non-empty string');
  }

  // normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Detect obvious path traversal attempts early
  if (normalizedPath.startsWith('..') || normalizedPath.includes('/../')) {
    throw new Error('Path traversal detected: ' + filePath);
  }

  // Block absolute paths
  if (normalizedPath.startsWith('/') || /^[a-z]:/i.test(normalizedPath)) {
    throw new Error('Absolute paths not allowed: ' + filePath);
  }

  // Check if it's a root-level allowed file
  if (allowedRootFiles.includes(normalizedPath)) {
    const resolvedPath = path.resolve(projectRoot, normalizedPath);
    if (isSafePath(normalizedPath, projectRoot)) {
      return resolvedPath;
    }
    throw new Error('Path traversal detected in file: ' + filePath);
  }

  // Check if it's in a documented directory
  if (isDocumentedDirectory(normalizedPath)) {
    if (!isSafePath(normalizedPath, projectRoot)) {
      throw new Error('Path traversal detected: ' + filePath);
    }
    return path.resolve(projectRoot, normalizedPath);
  }

  // check if it's a subdirectory of a documented directory
  const firstSegment = normalizedPath.split('/')[0];
  if (documentedDirs.includes(firstSegment)) {
    if (!isSafePath(normalizedPath, projectRoot)) {
      throw new Error('Path traversal detected: ' + filePath);
    }
    return path.resolve(projectRoot, normalizedPath);
  }

  throw new Error('Access denied: ' + filePath);
};

module.exports = {
  getSafePath,
  allowedRootFiles,
  documentedDirs,
  isDocumentedDirectory,
  isSafePath
};