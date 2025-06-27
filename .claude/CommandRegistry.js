/**
 * Command Registry System for ccprompts
 * Manages discovery, loading, and execution of all 38 commands
 */

const fs = require('fs');
const path = require('path');
const ConfigManager = require('./config/ConfigManager');

class CommandRegistry {
  constructor(baseDir = __dirname) {
    this.baseDir = baseDir;
    this.configManager = new ConfigManager(path.join(baseDir, 'config'));
    this.registry = this.loadRegistry();
    this.commandCache = new Map();
  }

  /**
   * Load command registry from commands.json
   * @returns {Object} Command registry data
   */
  loadRegistry() {
    try {
      const registryPath = path.join(this.baseDir, 'commands.json');
      const registryData = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      this.validateRegistry(registryData);
      return registryData;
    } catch (error) {
      throw new Error(`Failed to load command registry: ${error.message}`);
    }
  }

  /**
   * Validate registry structure
   * @param {Object} registry - Registry data to validate
   */
  validateRegistry(registry) {
    if (!registry.commands) {
      throw new Error('Registry must contain commands object');
    }
    if (!registry.version) {
      throw new Error('Registry must specify version');
    }
  }

  /**
   * Get all available commands organized by phase
   * @returns {Object} Commands organized by phase
   */
  getAllCommands() {
    const commands = {};
    
    Object.entries(this.registry.commands).forEach(([phase, phaseData]) => {
      if (phase.startsWith('phase-') || phase === 'specialized') {
        commands[phase] = {
          description: phaseData.description,
          count: phaseData.count,
          commands: Object.keys(phaseData.commands || {})
        };
      }
    });

    return commands;
  }

  /**
   * Get detailed information about a specific command
   * @param {string} commandName - Name of the command
   * @returns {Object|null} Command details or null if not found
   */
  getCommand(commandName) {
    // Search through all phases for the command
    for (const [phase, phaseData] of Object.entries(this.registry.commands)) {
      if (phaseData.commands && phaseData.commands[commandName]) {
        return {
          name: commandName,
          phase: phase,
          ...phaseData.commands[commandName],
          metadata: {
            phase_description: phaseData.description,
            phase_count: phaseData.count
          }
        };
      }
    }
    return null;
  }

  /**
   * Search commands by name, description, or tags
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Array} Array of matching commands
   */
  searchCommands(query, options = {}) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(this.registry.commands).forEach(([phase, phaseData]) => {
      if (phaseData.commands) {
        Object.entries(phaseData.commands).forEach(([commandName, commandData]) => {
          const matches = [
            commandName.toLowerCase().includes(lowerQuery),
            commandData.description?.toLowerCase().includes(lowerQuery),
            phaseData.description?.toLowerCase().includes(lowerQuery),
            commandData.prompt_file?.toLowerCase().includes(lowerQuery)
          ].some(Boolean);

          if (matches) {
            results.push({
              name: commandName,
              phase: phase,
              description: commandData.description,
              complexity: commandData.complexity,
              estimated_time: commandData.estimated_time,
              score: this.calculateRelevanceScore(query, commandName, commandData)
            });
          }
        });
      }
    });

    // Sort by relevance score (highest first)
    results.sort((a, b) => b.score - a.score);

    // Apply filters
    if (options.phase) {
      return results.filter(cmd => cmd.phase === options.phase);
    }
    if (options.complexity) {
      return results.filter(cmd => cmd.complexity === options.complexity);
    }

    return results.slice(0, options.limit || 20);
  }

  /**
   * Calculate relevance score for search results
   * @param {string} query - Search query
   * @param {string} commandName - Command name
   * @param {Object} commandData - Command data
   * @returns {number} Relevance score
   */
  calculateRelevanceScore(query, commandName, commandData) {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Exact name match gets highest score
    if (commandName.toLowerCase() === lowerQuery) {
      score += 100;
    } else if (commandName.toLowerCase().includes(lowerQuery)) {
      score += 50;
    }

    // Description match
    if (commandData.description?.toLowerCase().includes(lowerQuery)) {
      score += 25;
    }

    // Complexity bonus (prefer simpler commands)
    const complexityBonus = {
      'low': 10,
      'medium': 5,
      'high': 0
    };
    score += complexityBonus[commandData.complexity] || 0;

    return score;
  }

  /**
   * Get commands by phase
   * @param {string} phase - Phase name (e.g., 'phase-1-category')
   * @returns {Object} Commands in the specified phase
   */
  getCommandsByPhase(phase) {
    const phaseData = this.registry.commands[phase];
    if (!phaseData) {
      throw new Error(`Phase ${phase} not found in registry`);
    }

    const commands = {};
    Object.entries(phaseData.commands || {}).forEach(([name, data]) => {
      commands[name] = {
        name,
        phase,
        ...data,
        metadata: {
          phase_description: phaseData.description,
          phase_count: phaseData.count
        }
      };
    });

    return commands;
  }

  /**
   * Get command dependencies
   * @param {string} commandName - Name of the command
   * @returns {Array} Array of dependency command names
   */
  getCommandDependencies(commandName) {
    const command = this.getCommand(commandName);
    return command?.dependencies || [];
  }

  /**
   * Validate command parameters against schema
   * @param {string} commandName - Name of the command
   * @param {Object} parameters - Parameters to validate
   * @returns {Object} Validation result with errors array
   */
  validateCommandParameters(commandName, parameters) {
    const command = this.getCommand(commandName);
    if (!command) {
      return { valid: false, errors: [`Command ${commandName} not found`] };
    }

    const errors = [];
    const paramSchema = command.parameters || {};

    // Check required parameters
    Object.entries(paramSchema).forEach(([paramName, paramConfig]) => {
      if (paramConfig.required && !parameters.hasOwnProperty(paramName)) {
        errors.push(`Required parameter '${paramName}' is missing`);
      }

      if (parameters.hasOwnProperty(paramName)) {
        const value = parameters[paramName];
        
        // Type validation
        if (paramConfig.type === 'string' && typeof value !== 'string') {
          errors.push(`Parameter '${paramName}' must be a string`);
        }
        if (paramConfig.type === 'number' && typeof value !== 'number') {
          errors.push(`Parameter '${paramName}' must be a number`);
        }
        if (paramConfig.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Parameter '${paramName}' must be a boolean`);
        }

        // Enum validation
        if (paramConfig.enum && !paramConfig.enum.includes(value)) {
          errors.push(`Parameter '${paramName}' must be one of: ${paramConfig.enum.join(', ')}`);
        }

        // Range validation
        if (paramConfig.minimum !== undefined && value < paramConfig.minimum) {
          errors.push(`Parameter '${paramName}' must be at least ${paramConfig.minimum}`);
        }
        if (paramConfig.maximum !== undefined && value > paramConfig.maximum) {
          errors.push(`Parameter '${paramName}' must be at most ${paramConfig.maximum}`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Load command implementation from file
   * @param {string} commandName - Name of the command
   * @returns {string} Command implementation content
   */
  loadCommandImplementation(commandName) {
    const command = this.getCommand(commandName);
    if (!command) {
      throw new Error(`Command ${commandName} not found`);
    }

    // Check cache first
    if (this.commandCache.has(commandName)) {
      return this.commandCache.get(commandName);
    }

    try {
      // Try to load from phase directory first
      const phaseDir = path.join(this.baseDir, 'commands', command.phase);
      const commandFile = path.join(phaseDir, `${commandName}.md`);
      
      let content;
      if (fs.existsSync(commandFile)) {
        content = fs.readFileSync(commandFile, 'utf8');
      } else if (command.prompt_file) {
        // Fallback to prompt file
        const promptPath = path.join(this.baseDir, '..', command.prompt_file);
        content = fs.readFileSync(promptPath, 'utf8');
      } else {
        throw new Error(`No implementation found for command ${commandName}`);
      }

      // Cache the content
      this.commandCache.set(commandName, content);
      return content;
    } catch (error) {
      throw new Error(`Failed to load command ${commandName}: ${error.message}`);
    }
  }

  /**
   * Get command statistics and analytics
   * @returns {Object} Registry statistics
   */
  getRegistryStats() {
    const stats = {
      total_commands: 0,
      phases: {},
      complexity_distribution: { low: 0, medium: 0, high: 0 },
      dependency_graph: {},
      average_time: 0
    };

    let totalTimeMinutes = 0;
    let commandCount = 0;

    Object.entries(this.registry.commands).forEach(([phase, phaseData]) => {
      if (phaseData.commands) {
        const phaseStats = {
          count: Object.keys(phaseData.commands).length,
          description: phaseData.description,
          commands: []
        };

        Object.entries(phaseData.commands).forEach(([name, data]) => {
          commandCount++;
          stats.total_commands++;
          
          // Complexity distribution
          if (data.complexity) {
            stats.complexity_distribution[data.complexity]++;
          }

          // Time estimation (parse estimated_time string)
          if (data.estimated_time) {
            const timeMatch = data.estimated_time.match(/(\\d+)-(\\d+)/);
            if (timeMatch) {
              const avgTime = (parseInt(timeMatch[1]) + parseInt(timeMatch[2])) / 2;
              totalTimeMinutes += avgTime;
            }
          }

          // Dependencies
          if (data.dependencies) {
            stats.dependency_graph[name] = data.dependencies;
          }

          phaseStats.commands.push({
            name,
            complexity: data.complexity,
            estimated_time: data.estimated_time,
            dependencies: data.dependencies?.length || 0
          });
        });

        stats.phases[phase] = phaseStats;
      }
    });

    stats.average_time = commandCount > 0 ? Math.round(totalTimeMinutes / commandCount) : 0;

    return stats;
  }

  /**
   * Export command registry in various formats
   * @param {string} format - Export format ('json', 'yaml', 'markdown')
   * @returns {string} Exported registry content
   */
  exportRegistry(format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(this.registry, null, 2);
      
      case 'markdown':
        return this.generateMarkdownDocs();
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Generate markdown documentation for all commands
   * @returns {string} Markdown documentation
   */
  generateMarkdownDocs() {
    let markdown = `# ccprompts Command Registry\\n\\n`;
    markdown += `Total Commands: ${this.getRegistryStats().total_commands}\\n\\n`;

    Object.entries(this.registry.commands).forEach(([phase, phaseData]) => {
      if (phaseData.commands) {
        markdown += `## ${phase.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}\\n\\n`;
        markdown += `${phaseData.description}\\n\\n`;
        markdown += `Commands: ${Object.keys(phaseData.commands).length}\\n\\n`;

        Object.entries(phaseData.commands).forEach(([name, data]) => {
          markdown += `### /${name}\\n\\n`;
          markdown += `${data.description}\\n\\n`;
          markdown += `- **Complexity**: ${data.complexity}\\n`;
          markdown += `- **Estimated Time**: ${data.estimated_time}\\n`;
          if (data.dependencies && data.dependencies.length > 0) {
            markdown += `- **Dependencies**: ${data.dependencies.join(', ')}\\n`;
          }
          markdown += `\\n`;
        });
      }
    });

    return markdown;
  }
}

module.exports = CommandRegistry;