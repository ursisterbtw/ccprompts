#!/usr/bin/env node

/**
 * Documentation Generator for CI Pipeline
 * Auto-generates comprehensive documentation from command registry and codebase
 */

const fs = require('fs');
const path = require('path');

class DocumentationGenerator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      passed: true,
      generated: [],
      updated: [],
      errors: [],
      summary: {
        totalDocs: 0,
        generatedDocs: 0,
        updatedDocs: 0,
        errorCount: 0
      }
    };
    
    this.ensureDocsDir();
  }

  ensureDocsDir() {
    const docsDir = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    const reportsDir = path.join(process.cwd(), 'ci', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
  }

  /**
   * Generate command reference documentation
   */
  async generateCommandReference() {
    console.log('📖 Generating command reference documentation...');
    
    try {
      const CommandRegistry = require('../../.claude/core/CommandRegistry');
      const registry = new CommandRegistry();
      await registry.loadAllCommands();
      
      const commands = registry.commands;
      const categories = this.organizeCommandsByCategory(commands);
      
      // Generate main command reference
      let content = this.generateCommandReferenceContent(categories);
      
      const refPath = path.join('docs', 'COMMAND-REFERENCE.md');
      fs.writeFileSync(refPath, content);
      
      this.results.generated.push({
        file: 'COMMAND-REFERENCE.md',
        type: 'command-reference',
        commands: Object.keys(commands).length
      });
      
      // Generate category-specific documentation
      for (const [category, categoryCommands] of Object.entries(categories)) {
        await this.generateCategoryDocumentation(category, categoryCommands);
      }
      
      console.log(`  ✅ Generated reference for ${Object.keys(commands).length} commands`);
      
    } catch (error) {
      console.error('  ❌ Failed to generate command reference:', error.message);
      this.results.errors.push({
        type: 'command-reference',
        error: error.message
      });
      this.results.passed = false;
    }
  }

  /**
   * Generate API documentation from code
   */
  async generateAPIDocumentation() {
    console.log('🔧 Generating API documentation...');
    
    try {
      const coreFiles = this.discoverCoreFiles();
      const apiDocs = [];
      
      for (const filePath of coreFiles) {
        const docInfo = await this.extractAPIDocumentation(filePath);
        if (docInfo) {
          apiDocs.push(docInfo);
        }
      }
      
      const content = this.generateAPIDocumentationContent(apiDocs);
      const apiPath = path.join('docs', 'API-REFERENCE.md');
      fs.writeFileSync(apiPath, content);
      
      this.results.generated.push({
        file: 'API-REFERENCE.md',
        type: 'api-reference',
        modules: apiDocs.length
      });
      
      console.log(`  ✅ Generated API docs for ${apiDocs.length} modules`);
      
    } catch (error) {
      console.error('  ❌ Failed to generate API documentation:', error.message);
      this.results.errors.push({
        type: 'api-documentation',
        error: error.message
      });
    }
  }

  /**
   * Generate workflow documentation
   */
  async generateWorkflowDocumentation() {
    console.log('🔄 Generating workflow documentation...');
    
    try {
      const workflowFiles = this.discoverWorkflowFiles();
      const workflowDocs = [];
      
      for (const filePath of workflowFiles) {
        const workflowInfo = await this.extractWorkflowDocumentation(filePath);
        if (workflowInfo) {
          workflowDocs.push(workflowInfo);
        }
      }
      
      const content = this.generateWorkflowDocumentationContent(workflowDocs);
      const workflowPath = path.join('docs', 'WORKFLOWS.md');
      fs.writeFileSync(workflowPath, content);
      
      this.results.generated.push({
        file: 'WORKFLOWS.md',
        type: 'workflow-documentation',
        workflows: workflowDocs.length
      });
      
      console.log(`  ✅ Generated workflow docs for ${workflowDocs.length} workflows`);
      
    } catch (error) {
      console.error('  ❌ Failed to generate workflow documentation:', error.message);
      this.results.errors.push({
        type: 'workflow-documentation',
        error: error.message
      });
    }
  }

  /**
   * Generate configuration documentation
   */
  async generateConfigurationDocumentation() {
    console.log('⚙️ Generating configuration documentation...');
    
    try {
      const ConfigManager = require('../../.claude/core/ConfigManager');
      const config = new ConfigManager();
      
      const configSchema = this.extractConfigurationSchema(config);
      const content = this.generateConfigurationDocumentationContent(configSchema);
      
      const configPath = path.join('docs', 'CONFIGURATION.md');
      fs.writeFileSync(configPath, content);
      
      this.results.generated.push({
        file: 'CONFIGURATION.md',
        type: 'configuration',
        settings: Object.keys(configSchema).length
      });
      
      console.log(`  ✅ Generated configuration docs for ${Object.keys(configSchema).length} settings`);
      
    } catch (error) {
      console.error('  ❌ Failed to generate configuration documentation:', error.message);
      this.results.errors.push({
        type: 'configuration-documentation',
        error: error.message
      });
    }
  }

  /**
   * Update main README with current information
   */
  async updateMainREADME() {
    console.log('📄 Updating main README...');
    
    try {
      const readmePath = 'README.md';
      let content = '';
      
      if (fs.existsSync(readmePath)) {
        content = fs.readFileSync(readmePath, 'utf8');
      }
      
      // Update statistics in README
      const stats = await this.gatherProjectStatistics();
      const updatedContent = this.updateREADMEStatistics(content, stats);
      
      if (updatedContent !== content) {
        fs.writeFileSync(readmePath, updatedContent);
        this.results.updated.push({
          file: 'README.md',
          type: 'statistics-update',
          changes: 'Updated project statistics'
        });
        console.log('  ✅ Updated README with current statistics');
      } else {
        console.log('  ℹ️  README already up to date');
      }
      
    } catch (error) {
      console.error('  ❌ Failed to update README:', error.message);
      this.results.errors.push({
        type: 'readme-update',
        error: error.message
      });
    }
  }

  /**
   * Organize commands by category
   */
  organizeCommandsByCategory(commands) {
    const categories = {};
    
    Object.entries(commands).forEach(([name, command]) => {
      const category = command.category || 'uncategorized';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({ name, ...command });
    });
    
    return categories;
  }

  /**
   * Generate command reference content
   */
  generateCommandReferenceContent(categories) {
    let content = `# Command Reference\n\n`;
    content += `**Generated:** ${new Date().toISOString()}\n\n`;
    content += `This document provides a comprehensive reference for all commands in the ccprompts ecosystem.\n\n`;
    
    content += `## Overview\n\n`;
    content += `The ccprompts ecosystem contains **${this.getTotalCommandCount(categories)} commands** across **${Object.keys(categories).length} categories**.\n\n`;
    
    // Table of contents
    content += `## Table of Contents\n\n`;
    Object.keys(categories).forEach(category => {
      const categoryTitle = this.formatCategoryTitle(category);
      content += `- [${categoryTitle}](#${this.generateAnchor(categoryTitle)})\n`;
    });
    content += `\n`;
    
    // Category sections
    Object.entries(categories).forEach(([category, commands]) => {
      content += this.generateCategorySection(category, commands);
    });
    
    return content;
  }

  /**
   * Generate category documentation
   */
  async generateCategoryDocumentation(category, commands) {
    const categoryTitle = this.formatCategoryTitle(category);
    // Normalize category to kebab-case for portability
    const normalizedCategory = category
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const fileName = `${normalizedCategory}-commands.md`;
    
    let content = `# ${categoryTitle} Commands\n\n`;
    content += `**Generated:** ${new Date().toISOString()}\n\n`;
    content += `This document details all commands in the ${categoryTitle} category.\n\n`;
    
    content += `## Commands in this Category\n\n`;
    commands.forEach(command => {
      content += this.generateCommandDetailSection(command);
    });
    
    const categoryPath = path.join('docs', 'commands', fileName);
    
    // Ensure commands directory exists
    const commandsDir = path.join('docs', 'commands');
    if (!fs.existsSync(commandsDir)) {
      fs.mkdirSync(commandsDir, { recursive: true });
    }
    
    fs.writeFileSync(categoryPath, content);
    
    this.results.generated.push({
      file: `commands/${fileName}`,
      type: 'category-documentation',
      category: category,
      commands: commands.length
    });
  }

  /**
   * Generate category section
   */
  generateCategorySection(category, commands) {
    const categoryTitle = this.formatCategoryTitle(category);
    let content = `## ${categoryTitle}\n\n`;
    content += `**${commands.length} commands** in this category.\n\n`;
    
    commands.forEach(command => {
      content += `### /${command.name}\n\n`;
      content += `${command.description || 'No description available'}\n\n`;
      
      if (command.category) {
        content += `**Category:** ${command.category}\n\n`;
      }
      
      if (command.parameters && Object.keys(command.parameters).length > 0) {
        content += `**Parameters:**\n`;
        Object.entries(command.parameters).forEach(([param, info]) => {
          content += `- \`${param}\`: ${info.description || 'No description'}\n`;
        });
        content += `\n`;
      }
    });
    
    return content;
  }

  /**
   * Generate command detail section
   */
  generateCommandDetailSection(command) {
    let content = `## /${command.name}\n\n`;
    content += `${command.description || 'No description available'}\n\n`;
    
    if (command.usage) {
      content += `### Usage\n\n`;
      content += `\`\`\`\n${command.usage}\n\`\`\`\n\n`;
    }
    
    if (command.parameters && Object.keys(command.parameters).length > 0) {
      content += `### Parameters\n\n`;
      content += `| Parameter | Type | Required | Description |\n`;
      content += `|-----------|------|----------|-------------|\n`;
      
      Object.entries(command.parameters).forEach(([param, info]) => {
        content += `| \`${param}\` | ${info.type || 'string'} | ${info.required ? 'Yes' : 'No'} | ${info.description || 'No description'} |\n`;
      });
      content += `\n`;
    }
    
    if (command.examples && command.examples.length > 0) {
      content += `### Examples\n\n`;
      command.examples.forEach((example, index) => {
        content += `#### Example ${index + 1}\n\n`;
        content += `\`\`\`\n${example}\n\`\`\`\n\n`;
      });
    }
    
    return content;
  }

  /**
   * Generate API documentation content
   */
  generateAPIDocumentationContent(apiDocs) {
    let content = `# API Reference\n\n`;
    content += `**Generated:** ${new Date().toISOString()}\n\n`;
    content += `This document provides API reference for the ccprompts core modules.\n\n`;
    
    content += `## Modules\n\n`;
    apiDocs.forEach(doc => {
      content += `- [${doc.name}](#${this.generateAnchor(doc.name)})\n`;
    });
    content += `\n`;
    
    apiDocs.forEach(doc => {
      content += `## ${doc.name}\n\n`;
      content += `${doc.description}\n\n`;
      
      if (doc.methods && doc.methods.length > 0) {
        content += `### Methods\n\n`;
        doc.methods.forEach(method => {
          content += `#### ${method.name}\n\n`;
          content += `${method.description}\n\n`;
          
          if (method.parameters && method.parameters.length > 0) {
            content += `**Parameters:**\n`;
            method.parameters.forEach(param => {
              content += `- \`${param.name}\` (${param.type}): ${param.description}\n`;
            });
            content += `\n`;
          }
          
          if (method.returns) {
            content += `**Returns:** ${method.returns}\n\n`;
          }
        });
      }
    });
    
    return content;
  }

  /**
   * Generate workflow documentation content
   */
  generateWorkflowDocumentationContent(workflowDocs) {
    let content = `# Workflow Documentation\n\n`;
    content += `**Generated:** ${new Date().toISOString()}\n\n`;
    content += `This document describes the CI/CD workflows and automation in the ccprompts ecosystem.\n\n`;
    
    workflowDocs.forEach(workflow => {
      content += `## ${workflow.name}\n\n`;
      content += `${workflow.description}\n\n`;
      
      if (workflow.triggers && workflow.triggers.length > 0) {
        content += `**Triggers:**\n`;
        workflow.triggers.forEach(trigger => {
          content += `- ${trigger}\n`;
        });
        content += `\n`;
      }
      
      if (workflow.jobs && workflow.jobs.length > 0) {
        content += `**Jobs:**\n`;
        workflow.jobs.forEach(job => {
          content += `- **${job.name}**: ${job.description}\n`;
        });
        content += `\n`;
      }
    });
    
    return content;
  }

  /**
   * Generate configuration documentation content
   */
  generateConfigurationDocumentationContent(configSchema) {
    let content = `# Configuration Reference\n\n`;
    content += `**Generated:** ${new Date().toISOString()}\n\n`;
    content += `This document describes all configuration options available in the ccprompts ecosystem.\n\n`;
    
    Object.entries(configSchema).forEach(([section, settings]) => {
      content += `## ${this.formatCategoryTitle(section)}\n\n`;
      
      if (typeof settings === 'object' && settings !== null) {
        Object.entries(settings).forEach(([key, value]) => {
          content += `### ${key}\n\n`;
          content += `**Type:** ${typeof value}\n`;
          content += `**Default:** \`${JSON.stringify(value)}\`\n\n`;
        });
      }
    });
    
    return content;
  }

  /**
   * Discover core files for API documentation
   */
  discoverCoreFiles() {
    const coreDir = path.join('.claude', 'core');
    const files = [];
    
    if (fs.existsSync(coreDir)) {
      const entries = fs.readdirSync(coreDir);
      entries.forEach(entry => {
        if (entry.endsWith('.js')) {
          files.push(path.join(coreDir, entry));
        }
      });
    }
    
    return files;
  }

  /**
   * Extract API documentation from file
   */
  async extractAPIDocumentation(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const className = path.basename(filePath, '.js');
      
      // Simple extraction - in a real implementation, you'd use AST parsing
      const methods = [];
      const methodMatches = content.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*{/gm) || [];
      
      methodMatches.forEach(match => {
        const methodName = match.trim().split('(')[0];
        if (methodName && !methodName.includes('constructor')) {
          methods.push({
            name: methodName,
            description: `Method in ${className}`,
            parameters: [],
            returns: 'unknown'
          });
        }
      });
      
      return {
        name: className,
        description: `Core module: ${className}`,
        methods: methods.slice(0, 10) // Limit to first 10 methods
      };
      
    } catch (error) {
      console.log(`  ⚠️  Could not extract API docs from ${filePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Discover workflow files
   */
  discoverWorkflowFiles() {
    const workflowDir = path.join('.github', 'workflows');
    const files = [];
    
    if (fs.existsSync(workflowDir)) {
      const entries = fs.readdirSync(workflowDir);
      entries.forEach(entry => {
        if (entry.endsWith('.yml') || entry.endsWith('.yaml')) {
          files.push(path.join(workflowDir, entry));
        }
      });
    }
    
    return files;
  }

  /**
   * Extract workflow documentation
   */
  async extractWorkflowDocumentation(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, path.extname(filePath));
      
      // Extract workflow name
      const nameMatch = content.match(/^name:\s*['"]?([^'"\\n]+)['"]?/m);
      const name = nameMatch ? nameMatch[1] : fileName;
      
      // Extract triggers
      const triggers = [];
      if (content.includes('on:')) {
        if (content.includes('push:')) triggers.push('Push to repository');
        if (content.includes('pull_request:')) triggers.push('Pull request');
        if (content.includes('schedule:')) triggers.push('Scheduled');
        if (content.includes('workflow_dispatch:')) triggers.push('Manual trigger');
      }
      
      // Extract jobs (simplified)
      const jobMatches = content.match(/^\s+([a-zA-Z-_]+):\s*$/gm) || [];
      const jobs = jobMatches.map(match => {
        const jobName = match.trim().replace(':', '');
        return {
          name: jobName,
          description: `Job: ${jobName}`
        };
      });
      
      return {
        name,
        description: `CI/CD workflow: ${name}`,
        triggers,
        jobs: jobs.slice(0, 5) // Limit to first 5 jobs
      };
      
    } catch (error) {
      console.log(`  ⚠️  Could not extract workflow docs from ${filePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Extract configuration schema
   */
  extractConfigurationSchema(config) {
    // In a real implementation, this would introspect the ConfigManager
    return {
      commands: {
        directory: '.claude/commands',
        autoLoad: true
      },
      mcp: {
        servers: {},
        timeout: 30000
      },
      ci: {
        enabled: true,
        reports: 'ci/reports'
      }
    };
  }

  /**
   * Gather project statistics
   */
  async gatherProjectStatistics() {
    const stats = {
      commands: 0,
      categories: 0,
      workflows: 0,
      coreModules: 0,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      // Count commands
      const commandsDir = path.join('.claude', 'commands');
      if (fs.existsSync(commandsDir)) {
        const countCommands = (dir) => {
          let count = 0;
          const entries = fs.readdirSync(dir);
          entries.forEach(entry => {
            const fullPath = path.join(dir, entry);
            if (fs.statSync(fullPath).isDirectory()) {
              count += countCommands(fullPath);
            } else if (entry.endsWith('.md')) {
              count++;
            }
          });
          return count;
        };
        
        stats.commands = countCommands(commandsDir);
      }
      
      // Count categories
      const categoryDirs = fs.readdirSync(commandsDir).filter(entry => 
        fs.statSync(path.join(commandsDir, entry)).isDirectory()
      );
      stats.categories = categoryDirs.length;
      
      // Count workflows
      const workflowDir = path.join('.github', 'workflows');
      if (fs.existsSync(workflowDir)) {
        stats.workflows = fs.readdirSync(workflowDir).filter(f => 
          f.endsWith('.yml') || f.endsWith('.yaml')
        ).length;
      }
      
      // Count core modules
      const coreDir = path.join('.claude', 'core');
      if (fs.existsSync(coreDir)) {
        stats.coreModules = fs.readdirSync(coreDir).filter(f => 
          f.endsWith('.js')
        ).length;
      }
      
    } catch (error) {
      console.log('  ⚠️  Could not gather all statistics:', error.message);
    }
    
    return stats;
  }

  /**
   * Update README with statistics
   */
  updateREADMEStatistics(content, stats) {
    // Simple replacement - in a real implementation, you'd use more sophisticated parsing
    let updatedContent = content;
    
    // Update command count
    updatedContent = updatedContent.replace(
      /(\*\*Total Commands:\*\*\s+)\d+/g,
      `$1${stats.commands}`
    );
    
    // Update last updated
    updatedContent = updatedContent.replace(
      /(\*\*Last Updated:\*\*\s+)[^\n]+/g,
      `$1${stats.lastUpdated.split('T')[0]}`
    );
    
    return updatedContent;
  }

  /**
   * Utility methods
   */
  getTotalCommandCount(categories) {
    return Object.values(categories).reduce((total, commands) => total + commands.length, 0);
  }

  formatCategoryTitle(category) {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  generateAnchor(text) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  /**
   * Run complete documentation generation
   */
  async generate() {
    console.log('🚀 Starting documentation generation...\n');
    
    await this.generateCommandReference();
    await this.generateAPIDocumentation();
    await this.generateWorkflowDocumentation();
    await this.generateConfigurationDocumentation();
    await this.updateMainREADME();
    
    // Update summary
    this.results.summary.totalDocs = this.results.generated.length + this.results.updated.length;
    this.results.summary.generatedDocs = this.results.generated.length;
    this.results.summary.updatedDocs = this.results.updated.length;
    this.results.summary.errorCount = this.results.errors.length;
    
    // Save results
    this.saveResults();
    this.printSummary();
    
    return this.results.passed;
  }

  /**
   * Save documentation generation results
   */
  saveResults() {
    const resultsPath = path.join('ci', 'reports', 'documentation-generation.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    
    // Generate summary report
    this.generateSummaryReport();
  }

  /**
   * Generate summary report
   */
  generateSummaryReport() {
    const { summary, generated, updated, errors } = this.results;
    
    let report = `# Documentation Generation Report\n\n`;
    report += `**Status:** ${this.results.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `**Timestamp:** ${this.results.timestamp}\n\n`;
    
    report += `## Summary\n\n`;
    report += `- **Total Documents:** ${summary.totalDocs}\n`;
    report += `- **Generated:** ${summary.generatedDocs}\n`;
    report += `- **Updated:** ${summary.updatedDocs}\n`;
    report += `- **Errors:** ${summary.errorCount}\n\n`;
    
    if (generated.length > 0) {
      report += `## Generated Documents\n\n`;
      generated.forEach(doc => {
        report += `- **${doc.file}** (${doc.type})\n`;
      });
      report += `\n`;
    }
    
    if (updated.length > 0) {
      report += `## Updated Documents\n\n`;
      updated.forEach(doc => {
        report += `- **${doc.file}**: ${doc.changes}\n`;
      });
      report += `\n`;
    }
    
    if (errors.length > 0) {
      report += `## Errors\n\n`;
      errors.forEach(error => {
        report += `- **${error.type}**: ${error.error}\n`;
      });
      report += `\n`;
    }
    
    fs.writeFileSync(path.join('ci', 'reports', 'documentation-summary.md'), report);
  }

  /**
   * Print documentation summary
   */
  printSummary() {
    console.log('\n📚 Documentation Generation Complete');
    console.log('=====================================');
    
    if (this.results.passed) {
      console.log('✅ Documentation generation successful');
    } else {
      console.log('❌ Documentation generation failed');
    }
    
    console.log(`📄 Documents: ${this.results.summary.generatedDocs} generated, ${this.results.summary.updatedDocs} updated`);
    
    if (this.results.summary.errorCount > 0) {
      console.log(`❌ Errors: ${this.results.summary.errorCount}`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new DocumentationGenerator();
  generator.generate().then(passed => {
    process.exit(passed ? 0 : 1);
  }).catch(error => {
    console.error('Documentation generation failed:', error);
    process.exit(1);
  });
}

module.exports = DocumentationGenerator;