/**
 * Security utilities for CI pipeline
 * Provides safe command execution and input sanitization
 */

const { spawn } = require('child_process');

class SecurityUtils {
  /**
   * Sanitize input for shell commands
   * @param {string} input - Input to sanitize
   * @returns {string} Sanitized input
   */
  static sanitizeShellInput(input) {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }
    
    // Remove or escape dangerous characters
    return input
      .replace(/[`$\\]/g, '\\$&')  // Escape backticks, dollar signs, backslashes
      .replace(/[;&|><]/g, '')     // Remove command separators and redirects
      .replace(/\s+/g, ' ')        // Normalize whitespace
      .trim();
  }

  /**
   * Validate version string format
   * @param {string} version - Version to validate
   * @returns {boolean} True if valid semver format
   */
  static isValidVersion(version) {
    const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
    return semverRegex.test(version);
  }

  /**
   * Safely execute git commands with sanitized inputs
   * @param {string[]} args - Git command arguments
   * @param {Object} options - Spawn options
   * @returns {Promise<string>} Command output
   */
  static async safeGitCommand(args, options = {}) {
    return new Promise((resolve, reject) => {
      // Validate git arguments
      const safeArgs = args.map(arg => {
        if (typeof arg !== 'string') {
          throw new Error('All git arguments must be strings');
        }
        return this.sanitizeShellInput(arg);
      });

      const child = spawn('git', safeArgs, {
        stdio: ['ignore', 'pipe', 'pipe'],
        ...options
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Git command failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to execute git command: ${error.message}`));
      });
    });
  }

  /**
   * Safely execute tar commands with sanitized inputs
   * @param {string[]} args - Tar command arguments
   * @param {Object} options - Spawn options
   * @returns {Promise<string>} Command output
   */
  static async safeTarCommand(args, options = {}) {
    return new Promise((resolve, reject) => {
      // Validate tar arguments and ensure they are safe
      const safeArgs = args.map(arg => {
        if (typeof arg !== 'string') {
          throw new Error('All tar arguments must be strings');
        }
        
        // For tar, be more restrictive about allowed characters
        const sanitized = arg.replace(/[^a-zA-Z0-9._/-]/g, '');
        if (sanitized !== arg) {
          throw new Error(`Unsafe characters in tar argument: ${arg}`);
        }
        
        return sanitized;
      });

      const child = spawn('tar', safeArgs, {
        stdio: ['ignore', 'pipe', 'pipe'],
        ...options
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Tar command failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to execute tar command: ${error.message}`));
      });
    });
  }

  /**
   * Validate server command for MCP testing
   * @param {string} command - Command to validate
   * @returns {boolean} True if command is safe
   */
  static validateServerCommand(command) {
    if (typeof command !== 'string') {
      return false;
    }

    // Allow only specific safe commands
    const allowedCommands = [
      'node',
      'bun',
      'python',
      'python3',
      'deno',
      '/usr/bin/node',
      '/usr/bin/python3',
      '/usr/local/bin/node',
      '/usr/local/bin/python3'
    ];

    // Extract the base command (first part)
    const baseCommand = command.split(' ')[0];
    
    return allowedCommands.includes(baseCommand) || 
           allowedCommands.some(allowed => baseCommand.endsWith(allowed));
  }

  /**
   * Sanitize environment variables
   * @param {Object} env - Environment variables object
   * @returns {Object} Sanitized environment variables
   */
  static sanitizeEnvironment(env) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(env)) {
      // Validate key format
      if (!/^[A-Z_][A-Z0-9_]*$/i.test(key)) {
        continue; // Skip invalid keys
      }
      
      // Sanitize value
      if (typeof value === 'string') {
        sanitized[key] = value.replace(/[`$\\]/g, '\\$&');
      } else {
        sanitized[key] = String(value);
      }
    }
    
    return sanitized;
  }
}

module.exports = SecurityUtils;