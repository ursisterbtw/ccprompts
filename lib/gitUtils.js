/**
 * Git Utilities
 * Git-related operations for validation
 */

const { execSync } = require('child_process');

/**
 * Check if a directory is a git repository
 * @param {string} cwd - Directory to check
 * @returns {boolean} True if directory is a git repository
 */
const isGitRepo = (cwd) => {
  try {
    return execSync('git rev-parse --is-inside-work-tree', {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim() === 'true';
  } catch {
    return false;
  }
};

/**
 * Get git status output
 * @param {string} cwd - Directory to check
 * @returns {string|null} Git status output or null if error
 */
const getGitStatus = (cwd) => {
  try {
    return execSync('git status --short', {
      cwd,
      encoding: 'utf8'
    });
  } catch (error) {
    return null;
  }
};

/**
 * Check if files are tracked by git
 * @param {string} files - Files to check (space-separated)
 * @param {string} cwd - Directory to check
 * @returns {string|null} Git ls-files output or null if error
 */
const getTrackedFiles = (files, cwd) => {
  try {
    return execSync(`git ls-files ${files}`, {
      cwd,
      encoding: 'utf8'
    }).trim();
  } catch (error) {
    return null;
  }
};

/**
 * Check for untracked files matching a pattern
 * @param {string} pattern - Pattern to search for in untracked files
 * @param {string} cwd - Directory to check
 * @returns {boolean} True if untracked files matching pattern exist
 */
const hasUntrackedFiles = (pattern, cwd) => {
  try {
    const status = execSync('git status --short', {
      cwd,
      encoding: 'utf8'
    });
    return status.includes(pattern);
  } catch (error) {
    return false;
  }
};

module.exports = {
  isGitRepo,
  getGitStatus,
  getTrackedFiles,
  hasUntrackedFiles
};