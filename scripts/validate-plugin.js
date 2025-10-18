#!/usr/bin/env node
/**
 * Plugin Structure Validator
 * Validates that the ccprompts repository is properly configured as a Claude Code plugin
 */

const path = require('path');

// import utility modules
const { fileExists, isSymlink, readJSON, readFile, countFiles, readSymlinkTarget } = require('../lib/fsUtils');
const { isGitRepo, getTrackedFiles, hasUntrackedFiles } = require('../lib/gitUtils');

// colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class PluginValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.successes = [];
    this.projectRoot = path.resolve(__dirname, '..');
  }

  log(level, message) {
    const symbols = {
      error: 'x',
      warning: '!',
      success: '+',
      info: 'i'
    };

    const colorMap = {
      error: colors.red,
      warning: colors.yellow,
      success: colors.green,
      info: colors.blue
    };

    console.log(`${colorMap[level]}${symbols[level]}${colors.reset} ${message}`);
  }

  error(message) {
    this.errors.push(message);
    this.log('error', message);
  }

  warning(message) {
    this.warnings.push(message);
    this.log('warning', message);
  }

  success(message) {
    this.successes.push(message);
    this.log('success', message);
  }

  info(message) {
    this.log('info', message);
  }

  fileExists(filePath) {
    try {
      return fileExists(filePath, this.projectRoot);
    } catch (error) {
      this.error(`Invalid file path: ${filePath}`);
      return false;
    }
  }

  isSymlink(linkPath) {
    try {
      return isSymlink(linkPath, this.projectRoot);
    } catch (error) {
      return false;
    }
  }

  readJSON(filePath) {
    try {
      return readJSON(filePath, this.projectRoot);
    } catch (e) {
      this.error(`Failed to read ${filePath}: ${e.message}`);
      return null;
    }
  }

  readFile(filePath) {
    try {
      return readFile(filePath, this.projectRoot);
    } catch (e) {
      this.error(`Failed to read ${filePath}: ${e.message}`);
      return null;
    }
  }

  countFiles(dir, pattern) {
    try {
      return countFiles(dir, pattern, this.projectRoot);
    } catch (error) {
      this.error(`Failed to count files in ${dir}: ${error.message}`);
      return 0;
    }
  }

  // validation checks
  validatePluginManifest() {
    this.info('Validating plugin manifest...');

    if (!this.fileExists('.claude-plugin/plugin.json')) {
      this.error('Plugin manifest (.claude-plugin/plugin.json) not found');
      return false;
    }

    const manifest = this.readJSON('.claude-plugin/plugin.json');
    if (!manifest) return false;

    const requiredFields = ['name', 'version', 'description', 'author'];
    const missingFields = requiredFields.filter(field => !manifest[field]);

    if (missingFields.length > 0) {
      this.error(`Plugin manifest missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (manifest.name !== 'ccprompts') {
      this.warning(`Plugin name is "${manifest.name}", expected "ccprompts"`);
    }

    this.success('Plugin manifest is valid');
    return true;
  }

  validateMarketplaceConfig() {
    this.info('Validating marketplace configuration...');

    if (!this.fileExists('.claude-plugin/marketplace.json')) {
      this.warning('Marketplace configuration (.claude-plugin/marketplace.json) not found - optional but recommended for testing');
      return true;
    }

    const marketplace = this.readJSON('.claude-plugin/marketplace.json');
    if (!marketplace) return false;

    if (!marketplace.plugins || !Array.isArray(marketplace.plugins)) {
      this.error('Marketplace configuration missing plugins array');
      return false;
    }

    const ccpromptsPlugin = marketplace.plugins.find(p => p.name === 'ccprompts');
    if (!ccpromptsPlugin) {
      this.error('Marketplace configuration does not include ccprompts plugin');
      return false;
    }

    this.success('Marketplace configuration is valid');
    return true;
  }

  validateSymlinks() {
    this.info('Validating directory symlinks...');

    let allValid = true;

    // check commands symlink
    if (!this.fileExists('commands')) {
      this.error('commands/ symlink not found at project root');
      allValid = false;
    } else if (!this.isSymlink('commands')) {
      this.error('commands/ exists but is not a symlink');
      allValid = false;
    } else {
      try {
        const target = readSymlinkTarget('commands', this.projectRoot);
        if (target && target !== '.claude/commands' && target !== '.claude/commands/') {
          this.warning(`commands/ points to ${target}, expected .claude/commands/`);
        }
        this.success('commands/ symlink is valid');
      } catch (error) {
        this.error('Failed to read commands symlink target');
        allValid = false;
      }
    }

    // check agents symlink
    if (!this.fileExists('agents')) {
      this.error('agents/ symlink not found at project root');
      allValid = false;
    } else if (!this.isSymlink('agents')) {
      this.error('agents/ exists but is not a symlink');
      allValid = false;
    } else {
      try {
        const target = readSymlinkTarget('agents', this.projectRoot);
        if (target && target !== '.claude/agents' && target !== '.claude/agents/') {
          this.warning(`agents/ points to ${target}, expected .claude/agents/`);
        }
        this.success('agents/ symlink is valid');
      } catch (error) {
        this.error('Failed to read agents symlink target');
        allValid = false;
      }
    }

    return allValid;
  }

  validateCommands() {
    this.info('Validating commands structure...');

    const commandsInClaudeDir = this.countFiles('.claude/commands', '*.md');

    if (commandsInClaudeDir === 0) {
      this.error('No command files found in .claude/commands/');
      return false;
    }

    this.success(`Found ${commandsInClaudeDir} command files in .claude/commands/`);

    // validate phase directories
    const expectedPhases = [
      '00-initial-workflow',
      '01-project-setup',
      '02-development',
      '03-security',
      '04-testing',
      '05-deployment',
      '06-collaboration',
      '07-utilities',
      '08-extras',
      '09-agentic-capabilities',
      '10-ai-native-development',
      '11-enterprise-scale'
    ];

    let allPhasesExist = true;
    for (const phase of expectedPhases) {
      const phasePath = `.claude/commands/${phase}`;
      if (!this.fileExists(phasePath)) {
        this.warning(`Phase directory not found: ${phase}`);
        allPhasesExist = false;
      }
    }

    if (allPhasesExist) {
      this.success('All 12 phase directories are present');
    }

    return true;
  }

  validateAgents() {
    this.info('Validating agents structure...');

    const agentFiles = this.countFiles('.claude/agents', '*.md');

    if (agentFiles === 0) {
      this.warning('No agent files found in .claude/agents/');
      return true; // Agents are optional
    }

    this.success(`Found ${agentFiles} agent files in .claude/agents/`);
    return true;
  }

  validateDocumentation() {
    this.info('Validating documentation...');

    const requiredDocs = [
      { file: 'README.md', desc: 'Main README' },
      { file: 'PLUGIN.md', desc: 'Plugin installation guide' },
      { file: 'CLAUDE.md', desc: 'Claude Code configuration' }
    ];

    let allValid = true;
    for (const doc of requiredDocs) {
      if (!this.fileExists(doc.file)) {
        this.error(`${doc.desc} (${doc.file}) not found`);
        allValid = false;
      } else {
        this.success(`${doc.desc} found`);
      }
    }

    return allValid;
  }

  validateGitStatus() {
    this.info('Checking git status...');

    // validate that the working directory is a git repository
    if (!isGitRepo(this.projectRoot)) {
      this.warning('Not inside a git repository. Skipping git status checks.');
      return true;
    }

    try {
      // check if symlinks are tracked
      const trackedFiles = getTrackedFiles('commands agents', this.projectRoot);

      if (!trackedFiles || !trackedFiles.includes('commands') || !trackedFiles.includes('agents')) {
        this.warning('Symlinks may not be tracked in git. Consider adding them with: git add commands agents');
      } else {
        this.success('Symlinks are tracked in git');
      }

      // check for untracked plugin files
      if (hasUntrackedFiles('.claude-plugin/', this.projectRoot)) {
        this.warning('Plugin configuration files are untracked. Consider: git add .claude-plugin/');
      }

    } catch (e) {
      this.warning('Could not check git status (error running git commands)');
    }

    return true;
  }

  validatePackageJson() {
    this.info('Validating package.json...');

    if (!this.fileExists('package.json')) {
      this.error('package.json not found');
      return false;
    }

    const pkg = this.readJSON('package.json');
    if (!pkg) return false;

    const requiredFields = ['name', 'version', 'description'];
    let valid = true;

    for (const field of requiredFields) {
      if (!pkg[field]) {
        this.error(`package.json missing required field: ${field}`);
        valid = false;
      }
    }

    if (pkg.name !== 'ccprompts') {
      this.warning(`package.json name is "${pkg.name}", expected "ccprompts"`);
    }

    // check for plugin validation script
    if (!pkg.scripts || !pkg.scripts['validate:plugin']) {
      this.warning('package.json missing validate:plugin script');
    }

    if (valid) {
      this.success('package.json validation passed');
    }

    return valid;
  }

  run() {
    console.log(`${colors.cyan}+--------------------------------------------+${colors.reset}`);
    console.log(`${colors.cyan}|   CC Prompts Plugin Structure Validator    |${colors.reset}`);
    console.log(`${colors.cyan}+--------------------------------------------+${colors.reset}\n`);

    // run all validations
    this.validatePackageJson();
    this.validatePluginManifest();
    this.validateMarketplaceConfig();
    this.validateSymlinks();
    this.validateCommands();
    this.validateAgents();
    this.validateDocumentation();
    this.validateGitStatus();

    // summary
    console.log(`\n${colors.cyan}================ Summary ===============${colors.reset}`);
    console.log(`${colors.green}+ Successes: ${this.successes.length}${colors.reset}`);
    console.log(`${colors.yellow}! Warnings:  ${this.warnings.length}${colors.reset}`);
    console.log(`${colors.red}x Errors:    ${this.errors.length}${colors.reset}`);

    if (this.errors.length === 0) {
      console.log(`\n${colors.green}+ Plugin structure is valid and ready for distribution!${colors.reset}`);
      console.log(`\nNext steps:`);
      console.log(`  1. Test locally: ./scripts/test-plugin-local.sh`);
      console.log(`  2. Commit changes: git add . && git commit -m "feat: configure as Claude Code plugin"`);
      console.log(`  3. Push to GitHub: git push`);
      console.log(`  4. Install in other projects: /plugin marketplace add ursisterbtw/ccprompts`);
      return 0;
    } else {
      console.log(`\n${colors.red}x Plugin structure has errors that need to be fixed${colors.reset}`);
      return 1;
    }
  }
}

// export for testing
module.exports = PluginValidator;

// run validator only if executed directly
if (require.main === module) {
  const validator = new PluginValidator();
  process.exit(validator.run());
}
