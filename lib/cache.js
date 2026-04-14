const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Command Registry Cache System
 * Provides file-based caching with MD5 cache key based on file modification times
 */
class CommandCache {
  constructor(projectRoot) {
    this.cachePath = path.join(projectRoot, '.claude', 'command-registry-cache.json');
    this.registryPath = path.join(projectRoot, '.claude', 'command-registry.json');
  }

  /**
   * Generate cache key based on file modification times
   * @param {Array<string>} files - Array of file paths
   * @returns {string} MD5 hash of file modification times
   */
  getCacheKey(files) {
    try {
      const mtimes = files.map(f => {
        const stats = fs.statSync(f);
        return `${f}:${stats.mtimeMs}`;
      }).sort();
      return crypto.createHash('md5').update(mtimes.join('\n')).digest('hex');
    } catch (error) {
      return null;
    }
  }

  /**
   * Load cache from disk
   * @returns {Object|null} Cache object or null if not found
   */
  load() {
    if (!fs.existsSync(this.cachePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(this.cachePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  /**
   * Save cache to disk
   * @param {string} cacheKey - MD5 cache key
   * @param {Object} registry - Command registry object
   */
  save(cacheKey, registry) {
    try {
      const cache = {
        version: '1.0.0',
        cacheKey,
        generated_at: new Date().toISOString(),
        commands: registry
      };
      fs.writeFileSync(this.cachePath, JSON.stringify(cache, null, 2));
    } catch (error) {
      // Fail silently - caching is optional
    }
  }

  /**
   * Check if cache is valid
   * @param {string} cacheKey - MD5 cache key to validate
   * @returns {boolean} True if cache is valid
   */
  isValid(cacheKey) {
    const cache = this.load();
    return cache && cache.cacheKey === cacheKey;
  }

  /**
   * Clear cache file
   */
  clear() {
    if (fs.existsSync(this.cachePath)) {
      fs.unlinkSync(this.cachePath);
    }
  }
}

module.exports = CommandCache;
