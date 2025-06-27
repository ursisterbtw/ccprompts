/**
 * Configuration Manager for ccprompts
 * Implements hierarchical configuration with validation and precedence rules
 */

const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor(baseDir = __dirname) {
    this.baseDir = baseDir;
    this.schema = this.loadSchema();
    this.config = this.loadHierarchicalConfig();
  }

  /**
   * Load and parse the configuration schema
   * @returns {Object} JSON schema for validation
   */
  loadSchema() {
    try {
      const schemaPath = path.join(this.baseDir, 'schema.json');
      return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to load configuration schema: ${error.message}`);
    }
  }

  /**
   * Load configuration with hierarchical precedence
   * Order of precedence (lowest to highest):
   * 1. Schema defaults
   * 2. Global config (.claude/config.json)
   * 3. Project config (.claude/project.json)
   * 4. Local config (.claude/local.json)
   * 5. Environment variables
   * @returns {Object} Merged configuration
   */
  loadHierarchicalConfig() {
    // Start with schema defaults
    let config = this.getSchemaDefaults();

    // Layer 1: Global configuration
    config = this.mergeConfig(config, this.loadConfigFile('config.json'));

    // Layer 2: Project configuration
    config = this.mergeConfig(config, this.loadConfigFile('project.json'));

    // Layer 3: Local configuration (git-ignored)
    config = this.mergeConfig(config, this.loadConfigFile('local.json'));

    // Layer 4: Environment variables
    config = this.mergeConfig(config, this.loadEnvironmentConfig());

    // Validate final configuration
    this.validateConfig(config);

    return config;
  }

  /**
   * Extract default values from schema
   * @returns {Object} Default configuration based on schema
   */
  getSchemaDefaults() {
    const defaults = {};
    
    if (this.schema.properties) {
      Object.entries(this.schema.properties).forEach(([key, prop]) => {
        if (prop.default !== undefined) {
          defaults[key] = JSON.parse(JSON.stringify(prop.default));
        }
      });
    }

    return defaults;
  }

  /**
   * Load configuration file safely
   * @param {string} filename - Configuration filename
   * @returns {Object} Configuration object or empty object if file doesn't exist
   */
  loadConfigFile(filename) {
    try {
      const configPath = path.join(this.baseDir, '..', filename);
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.warn(`Warning: Failed to load config file ${filename}: ${error.message}`);
    }
    return {};
  }

  /**
   * Load configuration from environment variables
   * Converts environment variables with CCPROMPTS_ prefix to config
   * @returns {Object} Configuration from environment
   */
  loadEnvironmentConfig() {
    const envConfig = {};
    const prefix = 'CCPROMPTS_';

    Object.entries(process.env).forEach(([key, value]) => {
      if (key.startsWith(prefix)) {
        const configKey = key.substring(prefix.length).toLowerCase();
        
        // Convert string values to appropriate types
        try {
          // Try to parse as JSON for complex values
          envConfig[configKey] = JSON.parse(value);
        } catch {
          // Use as string if JSON parsing fails
          envConfig[configKey] = value;
        }
      }
    });

    return envConfig;
  }

  /**
   * Deep merge two configuration objects
   * @param {Object} target - Target configuration
   * @param {Object} source - Source configuration to merge
   * @returns {Object} Merged configuration
   */
  mergeConfig(target, source) {
    const result = JSON.parse(JSON.stringify(target));

    Object.entries(source).forEach(([key, value]) => {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // Deep merge objects
        if (!result[key] || typeof result[key] !== 'object') {
          result[key] = {};
        }
        result[key] = this.mergeConfig(result[key], value);
      } else {
        // Override primitive values and arrays
        result[key] = value;
      }
    });

    return result;
  }

  /**
   * Validate configuration against schema
   * @param {Object} config - Configuration to validate
   * @throws {Error} If configuration is invalid
   */
  validateConfig(config) {
    const errors = this.validateObject(config, this.schema);
    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\\n${errors.join('\\n')}`);
    }
  }

  /**
   * Validate object against schema (simplified JSON Schema validation)
   * @param {*} value - Value to validate
   * @param {Object} schema - Schema to validate against
   * @param {string} path - Current path for error reporting
   * @returns {Array} Array of validation error messages
   */
  validateObject(value, schema, path = 'config') {
    const errors = [];

    if (schema.type) {
      const expectedType = schema.type;
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      
      if (expectedType !== actualType) {
        errors.push(`${path}: expected ${expectedType}, got ${actualType}`);
        return errors; // Early return for type mismatch
      }
    }

    if (schema.properties && typeof value === 'object' && value !== null) {
      // Validate object properties
      Object.entries(schema.properties).forEach(([key, propSchema]) => {
        if (value.hasOwnProperty(key)) {
          errors.push(...this.validateObject(value[key], propSchema, `${path}.${key}`));
        } else if (propSchema.required) {
          errors.push(`${path}.${key}: required property missing`);
        }
      });

      // Check for additional properties
      if (schema.additionalProperties === false) {
        Object.keys(value).forEach(key => {
          if (!schema.properties.hasOwnProperty(key)) {
            errors.push(`${path}.${key}: additional property not allowed`);
          }
        });
      }
    }

    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`${path}: value must be one of ${schema.enum.join(', ')}`);
    }

    if (schema.minimum !== undefined && typeof value === 'number' && value < schema.minimum) {
      errors.push(`${path}: value ${value} is below minimum ${schema.minimum}`);
    }

    if (schema.maximum !== undefined && typeof value === 'number' && value > schema.maximum) {
      errors.push(`${path}: value ${value} is above maximum ${schema.maximum}`);
    }

    if (schema.minLength !== undefined && typeof value === 'string' && value.length < schema.minLength) {
      errors.push(`${path}: string length ${value.length} is below minimum ${schema.minLength}`);
    }

    if (schema.pattern && typeof value === 'string') {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(value)) {
        errors.push(`${path}: string does not match pattern ${schema.pattern}`);
      }
    }

    return errors;
  }

  /**
   * Get configuration value by path
   * @param {string} keyPath - Dot-separated path to config value
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Configuration value
   */
  get(keyPath, defaultValue = undefined) {
    const keys = keyPath.split('.');
    let current = this.config;

    for (const key of keys) {
      if (current && typeof current === 'object' && current.hasOwnProperty(key)) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current;
  }

  /**
   * Set configuration value by path
   * @param {string} keyPath - Dot-separated path to config value
   * @param {*} value - Value to set
   */
  set(keyPath, value) {
    const keys = keyPath.split('.');
    let current = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * Get the entire configuration object
   * @returns {Object} Complete configuration
   */
  getAll() {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * Save current configuration to specified file
   * @param {string} filename - Target filename
   * @param {Object} configSubset - Subset of config to save (optional)
   */
  saveConfig(filename, configSubset = null) {
    try {
      const configToSave = configSubset || this.config;
      const configPath = path.join(this.baseDir, '..', filename);
      const configJson = JSON.stringify(configToSave, null, 2);
      
      fs.writeFileSync(configPath, configJson, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save configuration to ${filename}: ${error.message}`);
    }
  }

  /**
   * Get configuration precedence information for debugging
   * @returns {Object} Information about configuration sources
   */
  getConfigInfo() {
    return {
      baseDir: this.baseDir,
      loadedFiles: [
        'config.json',
        'project.json', 
        'local.json'
      ].map(filename => {
        const filePath = path.join(this.baseDir, '..', filename);
        return {
          filename,
          exists: fs.existsSync(filePath),
          path: filePath
        };
      }),
      environmentVariables: Object.keys(process.env)
        .filter(key => key.startsWith('CCPROMPTS_'))
        .map(key => ({ key, value: process.env[key] })),
      validationErrors: this.getValidationSummary()
    };
  }

  /**
   * Get validation summary for current configuration
   * @returns {Object} Validation status and any warnings
   */
  getValidationSummary() {
    try {
      this.validateConfig(this.config);
      return { valid: true, errors: [] };
    } catch (error) {
      return { 
        valid: false, 
        errors: error.message.split('\\n').filter(line => line.trim())
      };
    }
  }
}

module.exports = ConfigManager;