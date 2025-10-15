/**
 * security validation module for prompt files
 * scans for hardcoded secrets, vulnerabilities, and security anti-patterns
 */

const safetyPatterns = require('../config/safety-patterns');

const SKIP_KEYWORDS = ['example', 'placeholder', 'your-', 'replace_with'];
const SECRET_DEFINITIONS = [
  {
    keyword: '(?:password)',
    minLength: 7,
    message: 'Hardcoded password detected',
    requiresEntropy: false
  },
  {
    keyword: '(?:secret)',
    minLength: 7,
    message: 'Hardcoded secret detected',
    requiresEntropy: false
  },
  {
    keyword: '(?:api(?:[_-]?|\\s*)key)',
    minLength: 4,
    message: 'Hardcoded API key detected',
    requiresEntropy: true
  },
  {
    keyword: '(?:token)',
    minLength: 6,
    message: 'Hardcoded token detected',
    requiresEntropy: true
  },
  {
    keyword: '(?:key)',
    minLength: 4,
    message: 'Hardcoded API key detected',
    requiresEntropy: false,
    valuePattern: /^(?:sk|pk|rk)-[0-9a-z-]{8,}$/i
  }
];

class SecurityValidator {
  constructor() {
    this.securityIssues = [];
  }

  validateSecurity(content, filename) {
    this.securityIssues = [];

    if (!content || typeof content !== 'string') {
      return this.securityIssues;
    }

    const codeBlocks = this.extractCodeBlocks(content);

    if (codeBlocks.length === 0) {
      return this.securityIssues;
    }

    // create unified patterns array
    const allPatterns = this.buildAllPatterns();

    for (const block of codeBlocks) {
      this.scanPatterns(block, filename, allPatterns);
    }

    return this.securityIssues;
  }

  // build unified patterns array for scanning
  buildAllPatterns = () => {
    const privateKeyPattern = {
      regex: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
      message: 'Private key detected',
      skipIfIncludes: ['example', 'placeholder']
    };

    const secretPatterns = SECRET_DEFINITIONS.map(def => ({
      regex: new RegExp(
        `\\b(?:export\\s+)?(?:const|let|var)\\s+[\\w-]*${def.keyword}[\\w-]*\\s*[:=]\\s*(['"])([^'"]{${def.minLength},})\\1`,
        'gi'
      ),
      message: def.message,
      skipIfIncludes: SKIP_KEYWORDS,
      filter: (match) => {
        const [, , value] = match;
        return (!def.requiresEntropy || this.hasEntropy(value))
            && (!def.valuePattern || def.valuePattern.test(value));
      }
    }));

    const safetyPatterns = require('../config/safety-patterns').getAllPatterns()
      .map(p => ({
        regex: p.pattern,
        message: p.message,
        skipIfIncludes: p.skipIfIncludes
      }));

    return [privateKeyPattern, ...secretPatterns, ...safetyPatterns];
  }

  // unified pattern scanning method
  scanPatterns = (block, filename, patterns) => {
    for (const { regex, message, skipIfIncludes = [], filter } of patterns) {
      // clone regex to avoid mutating shared objects, ensure global flag
      const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
      const clonedRegex = new RegExp(regex.source, flags);
      let match;
      while ((match = clonedRegex.exec(block)) !== null) {
        const fullMatch = match[0];
        if (skipIfIncludes.some(keyword => this.shouldSkip(fullMatch, [keyword]))) continue;
        if (filter && !filter(match)) continue;
        this.addIssue(filename, message, this.truncateMatch(fullMatch.trim()));
      }
    }
  }

  extractCodeBlocks = (content) => {
    if (!content) {
      return [];
    }

    const normalized = content.replace(/\r\n?/g, '\n');
    const blocks = [];
    const fencedRegex = /```(?:[\w+-]*)\n([\s\S]*?)```/g;
    let match;

    while ((match = fencedRegex.exec(normalized)) !== null) {
      const [, block] = match;
      const trimmedBlock = block.trim();
      if (trimmedBlock) {
        blocks.push(trimmedBlock);
      }
    }

    const contentWithoutFenced = normalized.replace(/```(?:[\w+-]*)\n[\s\S]*?```/g, '');
    const lines = contentWithoutFenced.split('\n');
    let buffer = [];

    lines.forEach(line => {
      if (/^( {4}|\t)/.test(line)) {
        buffer.push(line.replace(/^( {4}|\t)/, ''));
      } else if (buffer.length > 0) {
        const block = buffer.join('\n').trim();
        if (block) {
          blocks.push(block);
        }
        buffer = [];
      }
    });

    if (buffer.length > 0) {
      const block = buffer.join('\n').trim();
      if (block) {
        blocks.push(block);
      }
    }

    return blocks;
  }

  
  addIssue(filename, issue, match) {
    const payload = { file: filename, issue };
    if (match) {
      payload.match = match;
    }
    this.securityIssues.push(payload);
  }

  truncateMatch(text, limit = 50) {
    if (!text) {
      return '';
    }
    if (text.length <= limit) {
      return text;
    }
    return `${text.slice(0, limit)}...`;
  }

  shouldSkip(text, keywords = []) {
    if (!text) {
      return false;
    }
    const lower = text.toLowerCase();
    return keywords.some(keyword => lower.includes(keyword.toLowerCase()));
  }

  hasEntropy(value) {
    if (!value) {
      return false;
    }
    return /[0-9]/.test(value) || /[_\-]/.test(value) || /[A-Z]/.test(value);
  }

  getIssues() {
    return this.securityIssues;
  }
}

module.exports = SecurityValidator;
