#!/usr/bin/env node
/**
 * Plugin Structure Validator
 * Validates that the ccprompts repository is properly configured as a Claude Code plugin
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for output
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
      error: '✗',
      warning: '⚠',
      success: '✓',
      info: 'ℹ'
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
    return fs.existsSync(path.join(this.projectRoot, filePath));
  }

  isSymlink(linkPath) {
    try {
      const fullPath = path.join(this.projectRoot, linkPath);
      return fs.lstatSync(fullPath).isSymbolicLink();
    } catch (error) {
      return false;
    }
    }
  }

  readJSON(filePath) {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (e) {
      this.error(`Failed to read ${filePath}: ${e.message}`);
      return null;
    }
  }

  countFiles(dir, pattern) {
    // Use fs and path to recursively count files matching the pattern
    const fullPath = path.join(this.projectRoot, dir);
    let count = 0;
    const regex = new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
    function walk(currentPath) {
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
    }
    try {
    } catch (error) {
      return 0;
    }
    }
    return count;
  }

  // Validation checks
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

    // Check commands symlink
    if (!this.fileExists('commands')) {
      this.error('commands/ symlink not found at project root');
      allValid = false;
    } else if (!this.isSymlink('commands')) {
      this.error('commands/ exists but is not a symlink');
      allValid = false;
    } else {
      const target = fs.readlinkSync(path.join(this.projectRoot, 'commands'));
      if (target !== '.claude/commands' && target !== '.claude/commands/') {
        this.warning(`commands/ points to ${target}, expected .claude/commands/`);
      }
      this.success('commands/ symlink is valid');
    }

    // Check agents symlink
    if (!this.fileExists('agents')) {
      this.error('agents/ symlink not found at project root');
      allValid = false;
    } else if (!this.isSymlink('agents')) {
      this.error('agents/ exists but is not a symlink');
      allValid = false;
    } else {
      const target = fs.readlinkSync(path.join(this.projectRoot, 'agents'));
      if (target !== '.claude/agents' && target !== '.claude/agents/') {
        this.warning(`agents/ points to ${target}, expected .claude/agents/`);
      }
      this.success('agents/ symlink is valid');
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

    // Validate phase directories
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
  validateGitStatus() {
    this.info('Checking git status...');

    try {
      // Ensure cwd is within projectRoot to prevent command injection
      const resolvedCwd = path.resolve(this.projectRoot);
      if (!resolvedCwd.startsWith(process.cwd())) {
        this.warning('Project root is outside the current working directory. Skipping git status checks for safety.');
        return true;
      }

      // Check if symlinks are tracked
      const status = execSync('git ls-files commands agents', {
        cwd: resolvedCwd,
        encoding: 'utf8'
  validateGitStatus() {
    this.info('Checking git status...');

    // Validate that the working directory is a git repository
    try {
      const isGitRepo = execSync('git rev-parse --is-inside-work-tree', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim() === 'true';

      if (!isGitRepo) {
        this.warning('Not inside a git repository. Skipping git status checks.');
        return true;
      }
    } catch {
      this.warning('Not inside a git repository. Skipping git status checks.');
      return true;
    }

    try {
      // Check if symlinks are tracked
      const status = execSync('git ls-files commands agents', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      }).trim();

      if (!status.includes('commands') || !status.includes('agents')) {
        this.warning('Symlinks may not be tracked in git. Consider adding them with: git add commands agents');
      } else {
        this.success('Symlinks are tracked in git');
      }

      // Check for untracked plugin files
      const untracked = execSync('git status --short', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      });

      if (untracked.includes('.claude-plugin/')) {
        this.warning('Plugin configuration files are untracked. Consider: git add .claude-plugin/');
      }

    } catch (e) {
      this.warning('Could not check git status (error running git commands)');
    }

    return true;
  }

    } catch (e) {
      this.warning('Could not check git status (not a git repository?)');
    }

    return true;
  }

  validatePackageJson() {
    this.info('Validating package.json...');

    if (!this.fileExists('package.json')) {
      this.error('package.json not found');
      return false;
  run() {
    console.log(`${colors.cyan}╔════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║   CC Prompts Plugin Structure Validator   ║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════════╝${colors.reset}\n`);

    // Run all validations
    this.validatePackageJson();
    this.validatePluginManifest();
    this.validateMarketplaceConfig();
    this.validateSymlinks();
    this.validateCommands();
    this.validateAgents();
    this.validateDocumentation();
    this.validateGitStatus();

    // Summary
    console.log(`\n${colors.cyan}════════════════ Summary ═══════════════${colors.reset}`);
    console.log(`${colors.green}✓ Successes: ${this.successes.length}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Warnings:  ${this.warnings.length}${colors.reset}`);
    console.log(`${colors.red}✗ Errors:    ${this.errors.length}${colors.reset}`);

    if (this.errors.length === 0) {
      console.log(`\n${colors.green}✓ Plugin structure is valid and ready for distribution!${colors.reset}`);
      console.log(`\nNext steps:`);
      console.log(`  1. Test locally: ./scripts/test-plugin-local.sh`);
      console.log(`  2. Commit changes: git add . && git commit -m "feat: configure as Claude Code plugin"`);
      console.log(`  3. Push to GitHub: git push`);
      console.log(`  4. Install in other projects: /plugin marketplace add ursisterbtw/ccprompts`);
      return 0;
    } else {
      console.log(`\n${colors.red}✗ Plugin structure has errors that need to be fixed${colors.reset}`);
      return 1;
    }
  }
    console.log(`\n${colors.cyan}════════════════ Summary ═══════════════${colors.reset}`);
    console.log(`${colors.green}✓ Successes: ${this.successes.length}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Warnings:  ${this.warnings.length}${colors.reset}`);
const validator = new PluginValidator();
process.exit(validator.run());
    if (this.errors.length === 0) {
      console.log(`\n${colors.green}✓ Plugin structure is valid and ready for distribution!${colors.reset}`);
      console.log(`\nNext steps:`);
      console.log(`  1. Test locally: ./scripts/test-plugin-local.sh`);
      console.log(`  2. Commit changes: git add . && git commit -m "feat: configure as Claude Code plugin"`);
      console.log(`  3. Push to GitHub: git push`);
      console.log(`  4. Install in other projects: /plugin marketplace add ursisterbtw/ccprompts`);
      return 0;
    } else {
      console.log(`\n${colors.red}✗ Plugin structure has errors that need to be fixed${colors.reset}`);
      return 1;
    }
  }
}

// Run validator
const validator = new PluginValidator();
validator.run().then(code => process.exit(code));
