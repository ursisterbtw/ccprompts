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

    for (const block of codeBlocks) {
      this.scanForSecrets(block, filename);
      this.scanForDangerousPatterns(block, filename);
    }

    return this.securityIssues;
  }

  extractCodeBlocks(content) {
    if (!content) {
      return [];
    }

    const normalized = content.replace(/\r\n?/g, '\n');
    const blocks = [];
    const fencedRegex = /```(?:[\w+-]*)\n([\s\S]*?)```/g;
    let match;

    while ((match = fencedRegex.exec(normalized)) !== null) {
      const block = match[1].trim();
      if (block) {
        blocks.push(block);
      }
    }

    const contentWithoutFenced = normalized.replace(/```(?:[\w+-]*)\n[\s\S]*?```/g, '');
    const lines = contentWithoutFenced.split('\n');
    let buffer = [];

    lines.forEach(line => {
      if (/^( {4}|\t)/.test(line)) {
        buffer.push(line.replace(/^( {4}|\t)/, ''));
      } else {
        if (buffer.length > 0) {
          const block = buffer.join('\n').trim();
          if (block) {
            blocks.push(block);
          }
          buffer = [];
        }
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

  scanForSecrets(block, filename) {
    const text = block;

    // private keys
    const privateKeyRegex = /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi;
    let keyMatch;
    while ((keyMatch = privateKeyRegex.exec(text)) !== null) {
      const matchedText = keyMatch[0];
      if (!this.shouldSkip(matchedText, ['example', 'placeholder'])) {
        this.addIssue(filename, 'Private key detected', this.truncateMatch(matchedText.trim()));
      }
    }

    const prefix = '(?:export\\s+)?(?:const\\s+|let\\s+|var\\s+)?';

    SECRET_DEFINITIONS.forEach(definition => {
      const variablePattern = `[A-Za-z0-9_-]*${definition.keyword}[A-Za-z0-9_-]*`;
      const secretRegex = new RegExp(`\\b${prefix}(${variablePattern})\\s*[:=]\\s*(["'])([^"']+)\\2`, 'gi');
      let match;

      while ((match = secretRegex.exec(text)) !== null) {
        const fullMatch = match[0].trim();
        const value = match[3];

        if (!value) {
          continue;
        }

        if (this.shouldSkip(fullMatch, SKIP_KEYWORDS) || this.shouldSkip(value, SKIP_KEYWORDS)) {
          continue;
        }

        if (value.length < definition.minLength) {
          continue;
        }

        if (definition.requiresEntropy && !this.hasEntropy(value)) {
          continue;
        }

        if (definition.valuePattern && !definition.valuePattern.test(value)) {
          continue;
        }

        const valueStart = fullMatch.indexOf(value);
        const prefixPart = fullMatch.slice(0, valueStart);
        const suffixPart = fullMatch.slice(valueStart + value.length);
        const truncatedValue = value.length > 50 ? `${value.slice(0, 50)}...` : value;
        const truncatedMatch = `${prefixPart}${truncatedValue}${suffixPart}`;

        this.addIssue(filename, definition.message, truncatedMatch);
      }
    });
  }

  scanForDangerousPatterns(block, filename) {
    const patterns = safetyPatterns.getAllPatterns();
    const text = block;

    patterns.forEach(patternDefinition => {
      const original = patternDefinition.pattern;
      const flags = original.flags.includes('g') ? original.flags : `${original.flags}g`;
      const regex = new RegExp(original.source, flags);
      regex.lastIndex = 0;

      let match;
      while ((match = regex.exec(text)) !== null) {
        const matchedText = match[0];

        if (patternDefinition.skipIfIncludes && this.shouldSkip(matchedText, patternDefinition.skipIfIncludes)) {
          continue;
        }

        this.addIssue(filename, patternDefinition.message, this.truncateMatch(matchedText.trim()));
      }
    });
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
