/**
 * File System Utilities
 * Secure file system operations with path validation
 */

const fs = require('fs');
const path = require('path');
const { getSafePath } = require('./pathUtils');

/**
 * Check if a file exists safely
 * @param {string} filePath - The file path to check
 * @param {string} projectRoot - The project root directory
 * @returns {boolean} True if file exists, false otherwise
 */
const fileExists = (filePath, projectRoot) => {
  try {
    const fullPath = getSafePath(filePath, projectRoot);
    return fs.existsSync(fullPath);
  } catch (error) {
    return false;
  }
};

/**
 * Check if a path is a symbolic link
 * @param {string} linkPath - The path to check
 * @param {string} projectRoot - The project root directory
 * @returns {boolean} True if path is a symlink, false otherwise
 */
const isSymlink = (linkPath, projectRoot) => {
  try {
    const fullPath = getSafePath(linkPath, projectRoot);
    return fs.lstatSync(fullPath).isSymbolicLink();
  } catch (error) {
    return false;
  }
};

/**
 * Read and parse a JSON file safely
 * @param {string} filePath - The JSON file path to read
 * @param {string} projectRoot - The project root directory
 * @returns {object|null} Parsed JSON object or null if error
 */
const readJSON = (filePath, projectRoot) => {
  try {
    const fullPath = getSafePath(filePath, projectRoot);
    const content = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`readJSON(${filePath}): ${e.message}`);
  }
};

/**
 * Read a text file safely
 * @param {string} filePath - The file path to read
 * @param {string} projectRoot - The project root directory
 * @returns {string|null} File content or null if error
 */
const readFile = (filePath, projectRoot) => {
  try {
    const fullPath = getSafePath(filePath, projectRoot);
    return fs.readFileSync(fullPath, 'utf8');
  } catch (e) {
    throw new Error(`readFile(${filePath}): ${e.message}`);
  }
};

/**
 * Count files matching a pattern in a directory recursively
 * @param {string} dir - The directory to search
 * @param {string} pattern - The file pattern (e.g., '*.md')
 * @param {string} projectRoot - The project root directory
 * @returns {number} Number of matching files
 */
const countFiles = (dir, pattern, projectRoot) => {
  try {
    const fullPath = getSafePath(dir, projectRoot);
    let count = 0;
    const regex = new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');

    const walk = (currentPath) => {
      if (!fs.existsSync(currentPath)) return;
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          walk(entryPath);
        } else if (entry.isFile() && regex.test(entry.name)) {
          count++;
        }
      }
    };

    walk(fullPath);
    return count;
  } catch (error) {
    throw new Error(`countFiles(${dir}): ${error.message}`);
  }
};

/**
 * Read symlink target safely
 * @param {string} linkPath - The symlink path
 * @param {string} projectRoot - The project root directory
 * @returns {string|null} Symlink target or null if error
 */
const readSymlinkTarget = (linkPath, projectRoot) => {
  try {
    const fullPath = getSafePath(linkPath, projectRoot);
    return fs.readlinkSync(fullPath);
  } catch (error) {
    return null;
  }
};

module.exports = {
  fileExists,
  isSymlink,
  readJSON,
  readFile,
  countFiles,
  readSymlinkTarget
};