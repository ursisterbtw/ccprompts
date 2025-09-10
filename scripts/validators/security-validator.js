/**
 * security validation module for prompt files
 * scans for hardcoded secrets, vulnerabilities, and security anti-patterns
 */

const safetyPatterns = require('../config/safety-patterns');

class SecurityValidator {
  constructor() {
    this.securityIssues = [];
  }

  validateSecurity(content, filename) {
    this.securityIssues = [];

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
      {
        pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi,
        message: 'Private key detected',
        skipIfIncludes: ['example', 'placeholder']
      }
    ];

    securityPatterns.forEach(({ pattern, message, skipIfIncludes }) => {
      const matches = combinedCode.match(pattern) || [];
      matches.forEach(match => {
        const shouldSkip = skipIfIncludes?.some(skip =>
          match.toLowerCase().includes(skip.toLowerCase())
        );

        if (!shouldSkip) {
          this.securityIssues.push({
            file: filename,
            issue: message,
            match: match.substring(0, 50) + '...'
          });
        }
      });
    });

    const dangerousPatterns = safetyPatterns.getAllPatterns();

    dangerousPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(combinedCode)) {
        this.securityIssues.push({
          file: filename,
          issue: message
        });
      }
    });

    return this.securityIssues;
  }

  getIssues() {
    return this.securityIssues;
  }
}

module.exports = SecurityValidator;
