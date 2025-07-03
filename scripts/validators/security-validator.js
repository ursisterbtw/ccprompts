/**
 * Security validation module for prompt files
 * Scans for hardcoded secrets, vulnerabilities, and security anti-patterns
 */

class SecurityValidator {
  constructor() {
    this.securityIssues = [];
  }

  // Enhanced security scanning
  validateSecurity(content, filename) {
    this.securityIssues = [];
    
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
      {
        pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi,
        message: 'Private key detected',
        skipIfIncludes: ['example', 'placeholder']
      }
    ];

    securityPatterns.forEach(({ pattern, message, skipIfIncludes }) => {
      const matches = combinedCode.match(pattern) || [];
      matches.forEach(match => {
        // Check if it's a placeholder or example
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

    // Check for dangerous operations in prompts
    const dangerousPatterns = [
      { pattern: /rm\s+-rf\s+\//gi, message: 'Dangerous rm -rf command on root' },
      { pattern: /curl.*\|\s*sh/gi, message: 'Pipe to shell from curl (security risk)' },
      { pattern: /wget.*\|\s*bash/gi, message: 'Pipe to shell from wget (security risk)' },
      { pattern: /eval\s*\(/gi, message: 'Use of eval() function' },
      { pattern: /exec\s*\(/gi, message: 'Use of exec() function' }
    ];

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