#!/usr/bin/env node

/**
 * comprehensive validation script for ccprompts ecosystem
 * validates command structure, quality, consistency, and security
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const SafetyValidator = require('./safety-validator');
const safetyPatterns = require('./config/safety-patterns');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

class CommandValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.commandRegistry = {
      version: '1.0.0',
      last_updated: new Date().toISOString(),
      commands: {},
      categories: {},
      phases: [],
      validation_results: null
    };
    this.stats = {
      totalFiles: 0,
      validFiles: 0,
      commandFiles: 0,
      securityIssues: 0,
      qualityScores: []
    };
  }

  extractMarkdownSection(content, heading) {
    const headingLevel = heading.match(/^#+/)?.[0].length || 2;
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let nextHeadingPattern = '';
    for (let i = 1; i <= headingLevel; i++) {
      if (i > 1) {
        nextHeadingPattern += '|';
      }
      nextHeadingPattern += `^#{${i}}\\s`;
    }

    const regex = new RegExp(
      `${escapedHeading}\\s*\\n([\\s\\S]*?)(?=(${nextHeadingPattern})|\\s*$)`,
      'gm'
    );

    const match = regex.exec(content);
    return match ? match[1].trim() : null;
  }

  validateSecurity(content, filename) {
    const fencedBlocks = content.match(/```(?:[a-zA-Z0-9_+-]*\n)?[\s\S]*?```/g) || [];
    const indentedBlocks = content.match(/(?:^|\n)((?:    |\t).*(?:\n(?:    |\t).*)*)/gm) || [];

    const codeBlocks = [...fencedBlocks, ...indentedBlocks];
    const combinedCode = codeBlocks.join('\n');

    const securityPatterns = [
      {
        pattern: /password\s*=\s*["'][^"']{8,}["']/gi,
        message: 'Hardcoded password detected',
        skipIfIncludes: ['example', 'placeholder', 'your-', 'REPLACE_WITH']
      },
      {
        pattern: /api[_-]?key\s*=\s*["'][^"']{16,}["']/gi,
        message: 'Hardcoded API key detected',
        skipIfIncludes: ['example', 'placeholder', 'your-', 'REPLACE_WITH']
      },
      {
        pattern: /secret\s*=\s*["'][^"']{8,}["']/gi,
        message: 'Hardcoded secret detected',
        skipIfIncludes: ['example', 'placeholder', 'your-', 'REPLACE_WITH']
      },
      {
        pattern: /token\s*=\s*["'][^"']{16,}["']/gi,
        message: 'Hardcoded token detected',
        skipIfIncludes: ['example', 'placeholder', 'your-', 'REPLACE_WITH']
      },
      { pattern: /eval\s*\(/gi, message: 'Dangerous eval() usage detected' },
      { pattern: /innerHTML\s*=/gi, message: 'Potential XSS via innerHTML' },
      { pattern: /\$\{[^}]*user[^}]*\}/gi, message: 'Potential template injection' }
    ];

    securityPatterns.forEach(({ pattern, message, skipIfIncludes }) => {
      const matches = combinedCode.match(pattern) || [];

      matches.forEach(match => {
        if (skipIfIncludes && skipIfIncludes.some(skip => match.toLowerCase().includes(skip.toLowerCase()))) {
          return;
        }

        this.errors.push(`${filename}: SECURITY - ${message}`);
        this.stats.securityIssues++;
      });
    });
  }

  validateXMLStructure(content, filename) {
    const requiredSections = ['<role>', '<activation>', '<instructions>'];
    const missingSections = [];

    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        missingSections.push(section);
      }
    });

    if (missingSections.length > 0) {
      this.errors.push(`${filename}: Missing XML sections: ${missingSections.join(', ')}`);
      return false;
    }

    const contentWithoutCodeBlocks = content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '');

    const tagStack = [];
    const xmlTagRegex = /<\/?([a-zA-Z][a-zA-Z0-9_-]*)(?:\s[^>]*)?>|<!--[\s\S]*?-->/g;
    let match;
    let lineNumber = 1;
    let lastIndex = 0;

    while ((match = xmlTagRegex.exec(contentWithoutCodeBlocks)) !== null) {
      const currentLineNum = content.substring(lastIndex, match.index).split('\n').length - 1 + lineNumber;
      lastIndex = match.index;

      const fullTag = match[0];
      const tagName = match[1];

      if (fullTag.startsWith('<!--') || fullTag.endsWith('/>') || fullTag.startsWith('<?')) {
        continue;
      }

      if (fullTag.startsWith('</')) {
        if (tagStack.length === 0) {
          this.errors.push(`${filename}:${currentLineNum}: Unexpected closing tag: ${fullTag}`);
          return false;
        }

        const expectedTag = tagStack.pop();
        if (expectedTag !== tagName) {
          this.errors.push(`${filename}:${currentLineNum}: Mismatched XML tags - expected </${expectedTag}>, found </${tagName}>`);
          return false;
        }
      } else {
        tagStack.push(tagName);
      }
    }

    if (tagStack.length > 0) {
      this.errors.push(`${filename}: Unclosed XML tags: ${tagStack.join(', ')}`);
      return false;
    }

    return true;
  }

  validateCommandQuality(content, filename, commandType = null) {
    const detectedType = commandType || this.determineCommandType(filename, content);
    let qualityScore = 100;

    const qualityChecks = {
      default: [
        {
          name: 'Minimum content length',
          test: c => c.length > 500,
          weight: 15,
          message: 'Content too short - commands should be comprehensive'
        },
        {
          name: 'Has examples section',
          test: c => c.toLowerCase().includes('example'),
          weight: 20,
          message: 'Missing examples - commands should include usage examples'
        },
        {
          name: 'Has clear instructions',
          test: c => c.includes('<instructions>') && c.includes('</instructions>'),
          weight: 25,
          message: 'Missing or malformed instructions section'
        },
        {
          name: 'Security considerations',
          test: c => c.toLowerCase().includes('security') || c.toLowerCase().includes('safety'),
          weight: 15,
          message: 'Missing security considerations'
        },
        {
          name: 'Has output requirements',
          test: c => c.includes('output_requirements') || c.includes('deliverables'),
          weight: 10,
          message: 'Missing output requirements'
        },
        {
          name: 'Professional language',
          test: c => !/(TODO|FIXME|XXX|HACK)/i.test(c),
          weight: 10,
          message: 'Contains TODO/FIXME markers'
        }
      ],
      'command': [
        {
          name: 'Has usage section',
          test: c => c.includes('## Usage'),
          weight: 25,
          message: 'Missing Usage section'
        },
        {
          name: 'Has description section',
          test: c => c.includes('## Description'),
          weight: 20,
          message: 'Missing Description section'
        },
        {
          name: 'Has parameters section',
          test: c => c.includes('## Parameters'),
          weight: 20,
          message: 'Missing Parameters section'
        },
        {
          name: 'Has examples section',
          test: c => c.includes('## Examples'),
          weight: 25,
          message: 'Missing Examples section'
        },
        {
          name: 'Professional formatting',
          test: c => !/(TODO|FIXME|XXX|HACK)/i.test(c),
          weight: 10,
          message: 'Contains TODO/FIXME markers'
        }
      ]
    };

    const checks = qualityChecks[detectedType] || qualityChecks['default'];

    checks.forEach(check => {
      if (!check.test(content)) {
        qualityScore -= check.weight;
        this.warnings.push(`${filename} [${detectedType}]: ${check.message} (-${check.weight} points)`);
      }
    });

    if (!this.stats.qualityScores) {
      this.stats.qualityScores = [];
    }
    this.stats.qualityScores.push(qualityScore);

    return qualityScore;
  }

  validateCommandStructure(content, filename) {
    const metadata = this.extractCommandMetadata(content, filename);

    if (metadata) {
      this.commandRegistry.commands[metadata.id] = metadata;

      if (!this.commandRegistry.categories[metadata.category]) {
        this.commandRegistry.categories[metadata.category] = {
          id: metadata.category,
          name: metadata.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `${metadata.category} commands`,
          phase: metadata.phase,
          command_count: 0,
          completion_percentage: 0
        };
      }
      this.commandRegistry.categories[metadata.category].command_count++;
    }

    const hasDescription = content.includes('## Description') ||
                          content.includes('# ') ||
                          content.match(/^description:/m);

    if (!hasDescription) {
      this.errors.push(`${filename}: Command file missing description`);
    }

    const hasUsageSection = content.includes('## Usage');
    const hasExamplesSection = content.includes('## Examples');
    // reduce noise: only warn if both Usage and Examples are missing
    if (!hasUsageSection && !hasExamplesSection) {
      this.warnings.push(`${filename}: Consider adding sections: ## Usage, ## Examples`);
    }

    if (content.includes('## Usage') && !content.includes('```')) {
      this.warnings.push(`${filename}: Usage section should include command format example`);
    }

    // skip brevity warning to reduce noise; presence is enough
  }

  extractCommandMetadata(content, filename) {
    const relativePath = path.relative(process.cwd(), filename);
    const commandName = path.basename(filename, '.md');

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : commandName;

    let description = this.extractMarkdownSection(content, '## Description');
    if (!description) {
      const paragraphs = content.split('\n\n');
      description = paragraphs.find(p => p.trim() && !p.startsWith('#') && p.length > 50);
    }
    if (description) {
      const trimmed = description.substring(0, 200).trim();
      description = description.length > 200 ? trimmed + '...' : trimmed;
    } else {
      description = `${commandName} command`;
    }

    const category = this.extractCategoryFromPath(relativePath);
    // prefer phase derived from folder prefix (e.g., .claude/commands/09-agentic-capabilities/)
    const derivedPhase = this.extractPhaseFromPath(relativePath);
    const phase = derivedPhase !== null && derivedPhase !== undefined
      ? derivedPhase
      : this.extractPhaseFromCategory(category);

    const usageSection = this.extractMarkdownSection(content, '## Usage');
    const usageMatch = usageSection ? usageSection.match(/`\/?([^`]+)`/) : null;
    const usage = usageMatch ? usageMatch[1] : `/${commandName}`;

    const parameters = this.extractParameters(content);
    const examples = this.extractExamples(content);
    const safetyLevel = this.determineSafetyLevel(content);

    return {
      id: commandName,
      name: title,
      category: category,
      phase: phase,
      description: description,
      usage: usage,
      parameters: parameters,
      examples: examples,
      dependencies: [],
      safety_level: safetyLevel,
      claude_code_version: '>=1.0.0',
      file_path: relativePath,
      last_modified: new Date().toISOString()
    };
  }

  /**
   * extract phase number from the file path based on directory prefix.
   * example: .claude/commands/09-agentic-capabilities/foo.md -> 9
   * returns null if no phase prefix is found.
   */
  extractPhaseFromPath(filePath) {
    try {
      const normalized = filePath.replace(/\\/g, '/');
      const match = normalized.match(/\.claude\/commands\/(\d{2})-[^/]+/);
      if (match) {
        const phaseNum = parseInt(match[1], 10);
        if (!Number.isNaN(phaseNum)) {
          return phaseNum; // 0..11 as encoded in folder name
        }
      }
    } catch (_) {
      // ignore and fall back
    }
    return null;
  }

  extractCategoryFromPath(filePath) {
    if (filePath.includes('01-project-initialization')) {
      return 'project-setup';
    }
    if (filePath.includes('02-code-analysis')) {
      return 'analysis';
    }
    if (filePath.includes('03-refactoring')) {
      return 'development';
    }
    if (filePath.includes('04-testing')) {
      return 'testing';
    }
    if (filePath.includes('05-documentation')) {
      return 'documentation';
    }
    if (filePath.includes('06-git-workflows')) {
      return 'git';
    }
    if (filePath.includes('07-multi-file-operations')) {
      return 'operations';
    }
    if (filePath.includes('08-mcp-integration')) {
      return 'integration';
    }
    if (filePath.includes('09-build-deployment')) {
      return 'deployment';
    }
    if (filePath.includes('10-security-compliance')) {
      return 'security';
    }
    if (filePath.includes('commands')) {
      return 'command';
    }
    return 'utility';
  }

  extractPhaseFromCategory(category) {
    const phaseMap = {
      'project-setup': 1,
      'analysis': 2,
      'development': 3,
      'testing': 5,
      'documentation': 7,
      'git': 6,
      'operations': 3,
      'integration': 8,
      'deployment': 6,
      'security': 4,
      'command': 1,
      'utility': 8
    };
    return phaseMap[category] || 8;
  }

  extractParameters(content) {
    const parametersSection = this.extractMarkdownSection(content, '## Parameters');
    if (!parametersSection) {
      return [];
    }

    const parameters = [];
    const paramLines = parametersSection.split('\n').filter(line => line.trim());

    paramLines.forEach(line => {
      const paramMatch = line.match(/[-*]\s*`?([^`\s:]+)`?\s*:?\s*(.+)/);
      if (paramMatch) {
        parameters.push({
          name: paramMatch[1],
          type: 'string',
          required: !line.includes('optional'),
          description: paramMatch[2].trim()
        });
      }
    });

    return parameters;
  }

  extractExamples(content) {
    const examplesSection = this.extractMarkdownSection(content, '## Examples');
    if (!examplesSection) {
      return [];
    }

    const examples = [];
    const codeBlocks = examplesSection.match(/```[\s\S]*?```/g) || [];

    codeBlocks.forEach((block, index) => {
      const command = block.replace(/```[\w]*\n?|```/g, '').trim();
      if (command) {
        examples.push({
          title: `Example ${index + 1}`,
          command: command,
          description: `Usage example ${index + 1}`,
          expected_outcome: 'Command execution with expected results'
        });
      }
    });

    return examples;
  }

  determineSafetyLevel(content) {
    return safetyPatterns.classifySafetyLevel(content, true);
  }

  determineCommandType(filename, content) {
    if (filename.includes('commands/')) {
      return 'command';
    }
    if (filename.includes('bootstrap') || filename.includes('setup')) {
      return 'setup';
    }
    if (content.toLowerCase().includes('security') || content.toLowerCase().includes('audit')) {
      return 'security';
    }
    if (content.toLowerCase().includes('test') || content.toLowerCase().includes('testing')) {
      return 'testing';
    }
    if (content.length < 300) {
      return 'short-answer';
    }
    return 'default';
  }

  async validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filename = path.relative(process.cwd(), filePath);

      this.stats.totalFiles++;

      const relativePath = path.relative(process.cwd(), filePath);
      const isCommand = relativePath.includes('.claude/commands/');
      const isDocumentation = this.isDocumentationFile(filePath);

      this.validateSecurity(content, filename);

      if (isCommand) {
        this.stats.commandFiles++;
        this.validateCommandStructure(content, filename);
      } else {
        return;
      }

      if (isCommand) {
        if (content.trim().length === 0) {
          this.errors.push(`${filename}: File is empty`);
          return;
        }

        if (!content.includes('# ')) {
          this.warnings.push(`${filename}: No main heading found`);
        }

        if (content.includes('\r\n')) {
          this.warnings.push(`${filename}: Uses CRLF line endings (should be LF)`);
        }
      }

      this.stats.validFiles++;

    } catch (error) {
      this.errors.push(`${filePath}: Failed to read file - ${error.message}`);
    }
  }

  isDocumentationFile(filePath) {
    const documentationFiles = [
      'README.md',
      'CLAUDE.md',
      'CONTRIBUTING.md',
      'CHANGELOG.md',
      'LICENSE.md',
      'docs/CC-SDK.md',
      '.claude/README.md',
    ];

    const githubFiles = [
      '.github/',
      'pull_request_template.md',
      'ISSUE_TEMPLATE/',
      'SETUP_INSTRUCTIONS.md',
      'BRANCH_PROTECTION.md',
      'workflows/'
    ];

    const relativePath = path.relative(process.cwd(), filePath);

    if (documentationFiles.some(doc => relativePath.endsWith(doc))) {
      return true;
    }

    if (githubFiles.some(github => relativePath.includes(github))) {
      return true;
    }

    const normalizedPath = path.normalize(filePath);
    const isCommand = relativePath.startsWith('.claude/commands/');

    if (!isCommand) {
      return true;
    }

    return false;
  }

  findMarkdownFiles(directory) {
    const files = [];
    const excludePatterns = ['.git', 'node_modules', '.vscode', '.idea', 'dist', 'build'];

    function traverse(dir) {
      const items = fs.readdirSync(dir);

      items.forEach(item => {
        if (excludePatterns.some(pattern => item === pattern)) {
          return;
        }

        const fullPath = path.join(dir, item);

        try {
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            traverse(fullPath);
          } else if (item.endsWith('.md')) {
            files.push(fullPath);
          }
        } catch (error) {
          return;
        }
      });
    }

    traverse(directory);
    return files;
  }

  async validate() {
    const startTime = Date.now();
    const performanceMetrics = {
      discovery_time: 0,
      validation_time: 0,
      registry_generation_time: 0,
      file_processing_times: [],
      memory_usage: process.memoryUsage()
    };

    try {
      log('blue', '[TEST] Starting comprehensive ccprompts validation...\n');

      const projectRoot = process.cwd();
      const discoveryStart = Date.now();

      let markdownFiles;
      try {
        markdownFiles = this.findMarkdownFiles(projectRoot);
      } catch (error) {
        this.errors.push(`File discovery failed: ${error.message}`);
        log('red', `[ERROR] File discovery failed: ${error.message}`);
        return 1;
      }

      performanceMetrics.discovery_time = Date.now() - discoveryStart;

      log('blue', `Found ${markdownFiles.length} markdown files to validate`);
      log('cyan', `[STATS] Discovery: ${performanceMetrics.discovery_time}ms`);

      const validationStart = Date.now();
      for (const file of markdownFiles) {
        const fileStart = Date.now();
        try {
          await this.validateFile(file);
        } catch (error) {
          this.errors.push(`Validation failed for ${file}: ${error.message}`);
          log('red', `[ERROR] Validation failed for ${file}: ${error.message}`);
        }
        performanceMetrics.file_processing_times.push({
          file: file,
          duration: Date.now() - fileStart
        });
      }
      performanceMetrics.validation_time = Date.now() - validationStart;

      try {
        this.validateSystemIntegrity();
      } catch (error) {
        this.errors.push(`System integrity validation failed: ${error.message}`);
        log('red', `[ERROR] System integrity validation failed: ${error.message}`);
      }

      const registryStart = Date.now();
      try {
        await this.generateCommandRegistry();
      } catch (error) {
        this.errors.push(`Command registry generation failed: ${error.message}`);
        log('red', `[ERROR] Command registry generation failed: ${error.message}`);
      }
      performanceMetrics.registry_generation_time = Date.now() - registryStart;

      try {
        await this.runSafetyValidation(performanceMetrics);
      } catch (error) {
        this.errors.push(`Safety validation failed: ${error.message}`);
        log('red', `[ERROR] Safety validation failed: ${error.message}`);
      }

      const duration = Date.now() - startTime;
      this.reportResults(duration, performanceMetrics);

      return this.errors.length === 0 ? 0 : 1;
    } catch (error) {
      this.errors.push(`Critical validation error: ${error.message}`);
      log('red', `[ERROR] Critical validation error: ${error.message}`);
      log('red', `Stack trace: ${error.stack}`);
      return 1;
    }
  }

  validateSystemIntegrity() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (!packageJson.scripts || !packageJson.scripts.validate) {
        this.warnings.push('package.json: Missing validate script');
      }

      const requiredFiles = ['.gitignore', 'README.md', 'CONTRIBUTING.md'];
      requiredFiles.forEach(file => {
        if (!fs.existsSync(file)) {
          this.warnings.push(`Missing required file: ${file}`);
        }
      });

      const commandDir = path.join(process.cwd(), '.claude', 'commands');
      const expectedCommandCount = process.env.EXPECTED_COMMAND_COUNT
        ? parseInt(process.env.EXPECTED_COMMAND_COUNT, 10)
        : null;

      if (fs.existsSync(commandDir)) {
        const countMarkdownFiles = (dir) => {
          let count = 0;
          const items = fs.readdirSync(dir);

          for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
              count += countMarkdownFiles(fullPath);
            } else if (item.endsWith('.md')) {
              count++;
            }
          }

          return count;
        };

        const commandFiles = countMarkdownFiles(commandDir);
        if (expectedCommandCount !== null) {
          if (commandFiles !== expectedCommandCount) {
            this.errors.push(`Expected ${expectedCommandCount} commands, found ${commandFiles}`);
          }
        } else {
          this.warnings.push(
            `EXPECTED_COMMAND_COUNT not set; skipping strict command count validation (found ${commandFiles} commands)`
          );
        }
      } else {
        this.errors.push('Commands directory (.claude/commands) not found');
      }

    } catch (error) {
      this.warnings.push(`System integrity check failed: ${error.message}`);
    }
  }

  reportResults(duration, performanceMetrics = null) {
    log('blue', '\n[STATS] Validation Results');
    log('blue', '==================');

    log('green', `[OK] Total files processed: ${this.stats.totalFiles}`);
    log('green', `[OK] Command files: ${this.stats.commandFiles}`);
    log('green', `[OK] Valid files: ${this.stats.validFiles}`);
    log('cyan', `Validation completed in ${duration}ms`);

    if (this.stats.securityIssues > 0) {
      log('red', `[SECURITY]  Security issues found: ${this.stats.securityIssues}`);
    } else {
      log('green', '[SECURITY]  No security issues detected');
    }

    if (this.warnings.length > 0) {
      log('yellow', `\n[WARNING]  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => log('yellow', `   ${warning}`));
    }

    if (this.errors.length > 0) {
      log('red', `\n[ERROR] Errors (${this.errors.length}):`);
      this.errors.forEach(error => log('red', `   ${error}`));
      log('red', `\n[CRITICAL] Validation failed with ${this.errors.length} errors`);
    } else {
      log('green', '\n[SUCCESS] All validations passed!');
    }

    log('blue', '\n[METRICS] Quality Metrics:');
    const successRate = ((this.stats.validFiles / this.stats.totalFiles) * 100).toFixed(1);
    const errorRate = ((this.errors.length / this.stats.totalFiles) * 100).toFixed(1);
    const warningRate = ((this.warnings.length / this.stats.totalFiles) * 100).toFixed(1);

    log('cyan', `   Success rate: ${successRate}%`);
    log('cyan', `   Error rate: ${errorRate}%`);
    log('cyan', `   Warning rate: ${warningRate}%`);
    log('cyan', `   Security score: ${this.stats.securityIssues === 0 ? '100%' : 'FAIL'}`);

    const errorPenalty = Math.min(50, (this.errors.length / Math.max(1, this.stats.totalFiles)) * 100);
    const warningPenalty = Math.min(30, (this.warnings.length / Math.max(1, this.stats.totalFiles)) * 50);
    const overallScore = Math.max(0, 100 - errorPenalty - warningPenalty);
    let grade = 'F';
    if (overallScore >= 90) {
      grade = 'A';
    } else if (overallScore >= 80) {
      grade = 'B';
    } else if (overallScore >= 70) {
      grade = 'C';
    } else if (overallScore >= 60) {
      grade = 'D';
    }

    log('cyan', `   Overall quality grade: ${grade} (${overallScore.toFixed(1)}/100)`);

    if (performanceMetrics) {
      log('blue', '\n[PERF] Performance Metrics:');
      log('cyan', `   File discovery: ${performanceMetrics.discovery_time}ms`);
      log('cyan', `   Validation time: ${performanceMetrics.validation_time}ms`);
      log('cyan', `   Registry generation: ${performanceMetrics.registry_generation_time}ms`);

      const avgFileTime = performanceMetrics.file_processing_times.length > 0
        ? (performanceMetrics.file_processing_times.reduce((sum, f) => sum + f.duration, 0) / performanceMetrics.file_processing_times.length).toFixed(1)
        : 0;
      log('cyan', `   Average file processing: ${avgFileTime}ms`);

      const memoryAfter = process.memoryUsage();
      const memoryDelta = ((memoryAfter.heapUsed - performanceMetrics.memory_usage.heapUsed) / 1024 / 1024).toFixed(1);
      log('cyan', `   Memory usage: ${(memoryAfter.heapUsed / 1024 / 1024).toFixed(1)}MB (Δ${memoryDelta}MB)`);

      if (performanceMetrics.safety_validation_time !== undefined) {
        log('cyan', `   Safety validation: ${performanceMetrics.safety_validation_time}ms`);
        if (performanceMetrics.safety_commands_analyzed > 0) {
          log('cyan', `   Commands analyzed: ${performanceMetrics.safety_commands_analyzed}`);
          log('cyan', `   Dangerous patterns: ${performanceMetrics.safety_dangerous_commands || 0}`);
          log('cyan', `   Container tests: ${performanceMetrics.safety_container_tests || 0}`);
          log('cyan', `   Dagger available: ${performanceMetrics.dagger_available ? '[OK]' : '[ERROR]'}`);
        }
      }

      const discoveryTarget = 100;
      const validationTarget = 2000;
      log('cyan', `   Discovery target: ${performanceMetrics.discovery_time < discoveryTarget ? '[OK]' : '[ERROR]'} (<${discoveryTarget}ms)`);
      log('cyan', `   Validation target: ${performanceMetrics.validation_time < validationTarget ? '[OK]' : '[ERROR]'} (<${validationTarget}ms)`);
    }

    const commandCount = Object.keys(this.commandRegistry.commands).length;
    const categoryCount = Object.keys(this.commandRegistry.categories).length;
    if (commandCount > 0) {
      log('blue', '\n[REGISTRY] Command Registry:');
      log('cyan', `   Commands discovered: ${commandCount}`);
      log('cyan', `   Categories: ${categoryCount}`);
      log('cyan', `   Registry saved to: .claude/command-registry.json`);
    }
  }

  async generateCommandRegistry() {
    try {
      this.commandRegistry.validation_results = {
        last_run: new Date().toISOString(),
        total_files: this.stats.totalFiles,
        valid_files: this.stats.validFiles,
        errors: this.errors.map(error => ({ message: error, severity: 'error' })),
        warnings: this.warnings.map(warning => ({ message: warning, severity: 'warning' })),
        security_issues: this.errors.filter(e => e.includes('SECURITY')),
        quality_metrics: this.stats.qualityScores
      };

      const phases = {};
      Object.values(this.commandRegistry.commands).forEach(cmd => {
        if (!phases[cmd.phase]) {
          phases[cmd.phase] = {
            id: cmd.phase,
            name: this.getPhaseNameById(cmd.phase),
            description: this.getPhaseDescriptionById(cmd.phase),
            commands: []
          };
        }
        phases[cmd.phase].commands.push(cmd.id);
      });
      this.commandRegistry.phases = Object.values(phases).sort((a, b) => a.id - b.id);

      const claudeDir = path.join(process.cwd(), '.claude');
      if (!fs.existsSync(claudeDir)) {
        fs.mkdirSync(claudeDir, { recursive: true });
      }

      const registryPath = path.join(claudeDir, 'command-registry.json');
      fs.writeFileSync(registryPath, JSON.stringify(this.commandRegistry, null, 2));

      log('green', `[OK] Command registry generated: ${registryPath}`);

    } catch (error) {
      this.warnings.push(`Failed to generate command registry: ${error.message}`);
    }
  }

  getPhaseNameById(phaseId) {
    const phaseNames = {
      1: 'Initial Workflow',
      2: 'Project Setup',
      3: 'Development',
      4: 'Security & Compliance',
      5: 'Testing & Quality',
      6: 'Deployment & Operations',
      7: 'Collaboration & Management',
      8: 'Utilities & Analytics'
    };
    return phaseNames[phaseId] || `Phase ${phaseId}`;
  }

  getPhaseDescriptionById(phaseId) {
    const descriptions = {
      1: 'Initial project workflow and analysis commands',
      2: 'Project initialization and setup automation',
      3: 'Core development and refactoring tools',
      4: 'Security auditing and compliance validation',
      5: 'Testing automation and quality assurance',
      6: 'Deployment pipelines and operational tools',
      7: 'Team collaboration and project management',
      8: 'Utility commands and analytics tools'
    };
    return descriptions[phaseId] || `Phase ${phaseId} commands`;
  }

  /**
   * run Dagger safety validation on commands
   */
  async runSafetyValidation(performanceMetrics) {
    const safetyStart = Date.now();

    try {
      log('blue', '\n[SECURITY]  Running Dagger safety validation...');

      const safetyValidator = new SafetyValidator();
      const safetyReport = await safetyValidator.validateAllCommands();

      if (safetyReport.errors.length > 0) {
        this.errors = this.errors.concat(safetyReport.errors);
      }

      if (safetyReport.warnings.length > 0) {
        this.warnings = this.warnings.concat(safetyReport.warnings);
      }

      performanceMetrics.safety_validation_time = Date.now() - safetyStart;
      performanceMetrics.safety_commands_analyzed = safetyReport.summary.totalCommands;
      performanceMetrics.safety_dangerous_commands = safetyReport.summary.dangerousCommands;
      performanceMetrics.safety_container_tests = safetyReport.summary.containerTests;
      performanceMetrics.dagger_available = safetyReport.daggerAvailable;

      log('cyan', `[SECURITY]  Safety validation completed in ${performanceMetrics.safety_validation_time}ms`);

      if (safetyReport.summary.dangerousCommands > 0) {
        log('yellow', `[WARNING]  Found ${safetyReport.summary.dangerousCommands} commands with dangerous patterns`);
      }

      if (safetyReport.daggerAvailable && safetyReport.summary.containerTests > 0) {
        log('green', `[OK] Validated ${safetyReport.summary.containerTests} commands in Dagger containers`);
      } else if (!safetyReport.daggerAvailable) {
        log('yellow', '[WARNING]  Dagger not available - install from https://dagger.io for container validation');
      }

    } catch (error) {
      this.warnings.push(`Safety validation failed: ${error.message}`);
      performanceMetrics.safety_validation_time = Date.now() - safetyStart;
      performanceMetrics.safety_error = error.message;

      log('yellow', `[WARNING]  Safety validation encountered an error: ${error.message}`);
    }
  }
}

if (require.main === module) {
  const validator = new CommandValidator();
  validator.validate().then(exitCode => {
    process.exit(exitCode);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = CommandValidator;
