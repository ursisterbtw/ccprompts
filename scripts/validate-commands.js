#!/usr/bin/env node

/**
 * Comprehensive validation script for ccprompts ecosystem
 * Validates command structure, quality, consistency, and security
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const SafetyValidator = require('./safety-validator');
const safetyPatterns = require('./config/safety-patterns');

// Color output for better readability
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

  // Extract markdown section by heading
  extractMarkdownSection(content, heading) {
    // Try to match section with content until next heading of same or higher level
    const headingLevel = heading.match(/^#+/)?.[0].length || 2;
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Build regex to match content until next heading at same or higher level
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

  // Enhanced security scanning
  validateSecurity(content, filename) {
    // Only scan actual code, not examples or placeholders
    // Match all code block formats:
    // - ```language\ncode\n```
    // - ```\ncode\n```
    // - Indented code blocks (4+ spaces)
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
        // Skip if it's clearly a placeholder or example
        if (skipIfIncludes && skipIfIncludes.some(skip => match.toLowerCase().includes(skip.toLowerCase()))) {
          return;
        }
        
        this.errors.push(`${filename}: SECURITY - ${message}`);
        this.stats.securityIssues++;
      });
    });
  }

  // Enhanced XML structure validation with better error reporting
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

    // Remove code blocks and inline code to avoid false positives with XML-like content in examples
    const contentWithoutCodeBlocks = content
      .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
      .replace(/`[^`]*`/g, '');        // Remove inline code
    
    // Enhanced stack-based XML tag validation
    const tagStack = [];
    const xmlTagRegex = /<\/?([a-zA-Z][a-zA-Z0-9_-]*)(?:\s[^>]*)?>|<!--[\s\S]*?-->/g;
    let match;
    let lineNumber = 1;
    let lastIndex = 0;
    
    while ((match = xmlTagRegex.exec(contentWithoutCodeBlocks)) !== null) {
      // Calculate line number for better error reporting
      const currentLineNum = content.substring(lastIndex, match.index).split('\n').length - 1 + lineNumber;
      lastIndex = match.index;
      
      const fullTag = match[0];
      const tagName = match[1];
      
      // Skip comments and self-closing tags
      if (fullTag.startsWith('<!--') || fullTag.endsWith('/>') || fullTag.startsWith('<?')) {
        continue;
      }
      
      // Closing tag
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
      } 
      // Opening tag
      else {
        tagStack.push(tagName);
      }
    }
    
    // Check for unclosed tags
    if (tagStack.length > 0) {
      this.errors.push(`${filename}: Unclosed XML tags: ${tagStack.join(', ')}`);
      return false;
    }

    return true;
  }

  // Enhanced command quality validation with scoring
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

    // Aggregate quality scores
    if (!this.stats.qualityScores) {
      this.stats.qualityScores = [];
    }
    this.stats.qualityScores.push(qualityScore);
    
    return qualityScore;
  }

  // Enhanced command structure validation with metadata extraction
  validateCommandStructure(content, filename) {
    // Extract command metadata
    const metadata = this.extractCommandMetadata(content, filename);
    
    // Store in registry
    if (metadata) {
      this.commandRegistry.commands[metadata.id] = metadata;
      
      // Update category tracking
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
    
    // Commands should have at least a description
    const hasDescription = content.includes('## Description') || 
                          content.includes('# ') || 
                          content.match(/^description:/m);
    
    if (!hasDescription) {
      this.errors.push(`${filename}: Command file missing description`);
    }
    
    // Warn about missing sections but don't error
    const recommendedSections = ['## Usage', '## Parameters', '## Examples'];
    const missingSections = recommendedSections.filter(section => 
      !content.includes(section)
    );
    
    if (missingSections.length > 0) {
      this.warnings.push(`${filename}: Consider adding sections: ${missingSections.join(', ')}`);
    }

    // Validate usage format
    if (content.includes('## Usage') && !content.includes('```')) {
      this.warnings.push(`${filename}: Usage section should include command format example`);
    }

    // Validate examples are comprehensive
    const examplesSection = this.extractMarkdownSection(content, '## Examples');
    if (examplesSection !== null && examplesSection.length < 200) {
      this.warnings.push(`${filename}: Examples section appears too brief`);
    }
  }

  // Extract command metadata from content
  extractCommandMetadata(content, filename) {
    const relativePath = path.relative(process.cwd(), filename);
    const commandName = path.basename(filename, '.md');
    
    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : commandName;
    
    // Extract description from ## Description section or first paragraph
    let description = this.extractMarkdownSection(content, '## Description');
    if (!description) {
      // Fallback to first paragraph after title
      const paragraphs = content.split('\n\n');
      description = paragraphs.find(p => p.trim() && !p.startsWith('#') && p.length > 50);
    }
    if (description) {
      const trimmed = description.substring(0, 200).trim();
      description = description.length > 200 ? trimmed + '...' : trimmed;
    } else {
      description = `${commandName} command`;
    }
    
    // Determine category and phase from file path
    const category = this.extractCategoryFromPath(relativePath);
    const phase = this.extractPhaseFromCategory(category);
    
    // Extract usage pattern
    const usageSection = this.extractMarkdownSection(content, '## Usage');
    const usageMatch = usageSection ? usageSection.match(/`\/?([^`]+)`/) : null;
    const usage = usageMatch ? usageMatch[1] : `/${commandName}`;
    
    // Extract parameters
    const parameters = this.extractParameters(content);
    
    // Extract examples
    const examples = this.extractExamples(content);
    
    // Determine safety level
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
  
  // Extract category from file path
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
  
  // Map category to phase number
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
  
  // Extract parameters from Parameters section
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
  
  // Extract examples from Examples section
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
  
  // Determine safety level based on content
  determineSafetyLevel(content) {
    return safetyPatterns.classifySafetyLevel(content, true);
  }
  
  // Determine command type with better heuristics
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

  // Process individual file with enhanced validation
  async validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filename = path.relative(process.cwd(), filePath);
      
      this.stats.totalFiles++;

      // Determine file type using relative path
      const relativePath = path.relative(process.cwd(), filePath);
      const isCommand = relativePath.includes('.claude/commands/');
      const isDocumentation = this.isDocumentationFile(filePath);

      // Security validation for all files
      this.validateSecurity(content, filename);

      // Only validate commands for structure
      if (isCommand) {
        this.stats.commandFiles++;
        this.validateCommandStructure(content, filename);
      } else {
        // Skip validation for documentation and other files
        return;
      }

      // Basic validation for commands only
      if (isCommand) {
        // Common validations for command files
        if (content.trim().length === 0) {
          this.errors.push(`${filename}: File is empty`);
          return;
        }

        if (!content.includes('# ')) {
          this.warnings.push(`${filename}: No main heading found`);
        }

        // Check for consistent line endings
        if (content.includes('\r\n')) {
          this.warnings.push(`${filename}: Uses CRLF line endings (should be LF)`);
        }
      }

      this.stats.validFiles++;
      
    } catch (error) {
      this.errors.push(`${filePath}: Failed to read file - ${error.message}`);
    }
  }

  // Determine if a file is documentation and should be excluded from strict validation
  isDocumentationFile(filePath) {
    const documentationFiles = [
      'README.md',
      'CLAUDE.md',
      'CONTRIBUTING.md',
      'CHANGELOG.md',
      'LICENSE.md',
      'CC-SDK-Guide.md',
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
    
    // Check if it's a known documentation file
    if (documentationFiles.some(doc => relativePath.endsWith(doc))) {
      return true;
    }
    
    // Check if it's a GitHub template file
    if (githubFiles.some(github => relativePath.includes(github))) {
      return true;
    }
    
    // Also exclude any file that's not a command
    const normalizedPath = path.normalize(filePath);
    const isCommand = relativePath.startsWith('.claude/commands/');
    
    // If it's not a command file, treat it as documentation
    if (!isCommand) {
      return true;
    }
    
    return false;
  }

  // Find all markdown files with exclusions
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
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (item.endsWith('.md')) {
          files.push(fullPath);
        }
      });
    }
    
    traverse(directory);
    return files;
  }

  // Enhanced validation with performance tracking
  async validate() {
    const startTime = Date.now();
    const performanceMetrics = {
      discovery_time: 0,
      validation_time: 0,
      registry_generation_time: 0,
      file_processing_times: [],
      memory_usage: process.memoryUsage()
    };
    
    log('blue', '🧪 Starting comprehensive ccprompts validation...\n');

    const projectRoot = process.cwd();
    const discoveryStart = Date.now();
    const markdownFiles = this.findMarkdownFiles(projectRoot);
    performanceMetrics.discovery_time = Date.now() - discoveryStart;

    log('blue', `Found ${markdownFiles.length} markdown files to validate`);
    log('cyan', `📊 Discovery: ${performanceMetrics.discovery_time}ms`);
    
    // Validate each file with performance tracking
    const validationStart = Date.now();
    for (const file of markdownFiles) {
      const fileStart = Date.now();
      await this.validateFile(file);
      performanceMetrics.file_processing_times.push({
        file: file,
        duration: Date.now() - fileStart
      });
    }
    performanceMetrics.validation_time = Date.now() - validationStart;

    // Additional system-level validations
    this.validateSystemIntegrity();
    
    // Generate command registry with performance tracking
    const registryStart = Date.now();
    await this.generateCommandRegistry();
    performanceMetrics.registry_generation_time = Date.now() - registryStart;

    // Run Dagger safety validation
    await this.runSafetyValidation(performanceMetrics);

    // Report results with performance metrics
    const duration = Date.now() - startTime;
    this.reportResults(duration, performanceMetrics);
    
    // Return exit code based on errors
    return this.errors.length === 0 ? 0 : 1;
  }

  // System integrity validation
  validateSystemIntegrity() {
    try {
      // Check package.json structure
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (!packageJson.scripts || !packageJson.scripts.validate) {
        this.warnings.push('package.json: Missing validate script');
      }

      // Check for required configuration files
      const requiredFiles = ['.gitignore', 'README.md', 'CONTRIBUTING.md'];
      requiredFiles.forEach(file => {
        if (!fs.existsSync(file)) {
          this.warnings.push(`Missing required file: ${file}`);
        }
      });

      // Validate command count matches documentation
      const commandDir = path.join(process.cwd(), '.claude', 'commands');
      const expectedCommandCount = process.env.EXPECTED_COMMAND_COUNT
        ? parseInt(process.env.EXPECTED_COMMAND_COUNT, 10)
        : null;

      if (fs.existsSync(commandDir)) {
        // Count all .md files recursively in subdirectories
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

  // Enhanced reporting with metrics
  reportResults(duration, performanceMetrics = null) {
    log('blue', '\n📊 Validation Results');
    log('blue', '==================');
    
    log('green', `✅ Total files processed: ${this.stats.totalFiles}`);
    log('green', `✅ Command files: ${this.stats.commandFiles}`);
    log('green', `✅ Valid files: ${this.stats.validFiles}`);
    log('cyan', `⏱️  Validation completed in ${duration}ms`);

    if (this.stats.securityIssues > 0) {
      log('red', `🛡️  Security issues found: ${this.stats.securityIssues}`);
    } else {
      log('green', '🛡️  No security issues detected');
    }

    if (this.warnings.length > 0) {
      log('yellow', `\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => log('yellow', `   ${warning}`));
    }

    if (this.errors.length > 0) {
      log('red', `\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach(error => log('red', `   ${error}`));
      log('red', `\n💥 Validation failed with ${this.errors.length} errors`);
    } else {
      log('green', '\n🎉 All validations passed!');
    }

    // Generate enhanced metrics
    log('blue', '\n📈 Quality Metrics:');
    const successRate = ((this.stats.validFiles / this.stats.totalFiles) * 100).toFixed(1);
    const errorRate = ((this.errors.length / this.stats.totalFiles) * 100).toFixed(1);
    const warningRate = ((this.warnings.length / this.stats.totalFiles) * 100).toFixed(1);
    
    log('cyan', `   Success rate: ${successRate}%`);
    log('cyan', `   Error rate: ${errorRate}%`);
    log('cyan', `   Warning rate: ${warningRate}%`);
    log('cyan', `   Security score: ${this.stats.securityIssues === 0 ? '100%' : 'FAIL'}`);
    
    // Quality grade (normalized by file count)
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
    
    // Performance metrics reporting
    if (performanceMetrics) {
      log('blue', '\n⚡ Performance Metrics:');
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
      
      // Safety validation metrics
      if (performanceMetrics.safety_validation_time !== undefined) {
        log('cyan', `   Safety validation: ${performanceMetrics.safety_validation_time}ms`);
        if (performanceMetrics.safety_commands_analyzed > 0) {
          log('cyan', `   Commands analyzed: ${performanceMetrics.safety_commands_analyzed}`);
          log('cyan', `   Dangerous patterns: ${performanceMetrics.safety_dangerous_commands || 0}`);
          log('cyan', `   Container tests: ${performanceMetrics.safety_container_tests || 0}`);
          log('cyan', `   Dagger available: ${performanceMetrics.dagger_available ? '✅' : '❌'}`);
        }
      }
      
      // Performance targets validation
      const discoveryTarget = 100; // ms
      const validationTarget = 2000; // ms for all files
      log('cyan', `   Discovery target: ${performanceMetrics.discovery_time < discoveryTarget ? '✅' : '❌'} (<${discoveryTarget}ms)`);
      log('cyan', `   Validation target: ${performanceMetrics.validation_time < validationTarget ? '✅' : '❌'} (<${validationTarget}ms)`);
    }
    
    // Report registry stats
    const commandCount = Object.keys(this.commandRegistry.commands).length;
    const categoryCount = Object.keys(this.commandRegistry.categories).length;
    if (commandCount > 0) {
      log('blue', '\n📋 Command Registry:');
      log('cyan', `   Commands discovered: ${commandCount}`);
      log('cyan', `   Categories: ${categoryCount}`);
      log('cyan', `   Registry saved to: .claude/command-registry.json`);
    }
  }
  
  // Generate and save command registry
  async generateCommandRegistry() {
    try {
      // Finalize validation results
      this.commandRegistry.validation_results = {
        last_run: new Date().toISOString(),
        total_files: this.stats.totalFiles,
        valid_files: this.stats.validFiles,
        errors: this.errors.map(error => ({ message: error, severity: 'error' })),
        warnings: this.warnings.map(warning => ({ message: warning, severity: 'warning' })),
        security_issues: this.errors.filter(e => e.includes('SECURITY')),
        quality_metrics: this.stats.qualityScores
      };
      
      // Generate phase information
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
      
      // Create .claude directory if it doesn't exist
      const claudeDir = path.join(process.cwd(), '.claude');
      if (!fs.existsSync(claudeDir)) {
        fs.mkdirSync(claudeDir, { recursive: true });
      }
      
      // Save registry to file
      const registryPath = path.join(claudeDir, 'command-registry.json');
      fs.writeFileSync(registryPath, JSON.stringify(this.commandRegistry, null, 2));
      
      log('green', `✅ Command registry generated: ${registryPath}`);
      
    } catch (error) {
      this.warnings.push(`Failed to generate command registry: ${error.message}`);
    }
  }
  
  // Get phase name by ID
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
  
  // Get phase description by ID
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
   * Run Dagger safety validation on commands
   */
  async runSafetyValidation(performanceMetrics) {
    const safetyStart = Date.now();
    
    try {
      log('blue', '\n🛡️  Running Dagger safety validation...');
      
      const safetyValidator = new SafetyValidator();
      const safetyReport = await safetyValidator.validateAllCommands();
      
      // Integrate safety results into main validation
      if (safetyReport.errors.length > 0) {
        this.errors = this.errors.concat(safetyReport.errors);
      }
      
      if (safetyReport.warnings.length > 0) {
        this.warnings = this.warnings.concat(safetyReport.warnings);
      }
      
      // Add safety metrics to performance tracking
      performanceMetrics.safety_validation_time = Date.now() - safetyStart;
      performanceMetrics.safety_commands_analyzed = safetyReport.summary.totalCommands;
      performanceMetrics.safety_dangerous_commands = safetyReport.summary.dangerousCommands;
      performanceMetrics.safety_container_tests = safetyReport.summary.containerTests;
      performanceMetrics.dagger_available = safetyReport.daggerAvailable;
      
      log('cyan', `🛡️  Safety validation completed in ${performanceMetrics.safety_validation_time}ms`);
      
      if (safetyReport.summary.dangerousCommands > 0) {
        log('yellow', `⚠️  Found ${safetyReport.summary.dangerousCommands} commands with dangerous patterns`);
      }
      
      if (safetyReport.daggerAvailable && safetyReport.summary.containerTests > 0) {
        log('green', `✅ Validated ${safetyReport.summary.containerTests} commands in Dagger containers`);
      } else if (!safetyReport.daggerAvailable) {
        log('yellow', '⚠️  Dagger not available - install from https://dagger.io for container validation');
      }
      
    } catch (error) {
      this.warnings.push(`Safety validation failed: ${error.message}`);
      performanceMetrics.safety_validation_time = Date.now() - safetyStart;
      performanceMetrics.safety_error = error.message;
      
      log('yellow', `⚠️  Safety validation encountered an error: ${error.message}`);
    }
  }
}

// Run validation if called directly
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