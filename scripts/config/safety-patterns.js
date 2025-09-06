/**
 * Centralized Safety Pattern Configuration
 *
 * This module provides a single source of truth for dangerous code patterns
 * and their classifications across all validation systems.
 */

module.exports = {
  /**
   * Critical danger patterns - immediate security threats
   */
  CRITICAL_PATTERNS: [
    {
      pattern: /rm\s+-rf\s+[\/\$]/gi,
      severity: 'critical',
      message: 'Recursive file deletion with system paths',
      category: 'filesystem'
    },
    {
      pattern: /curl.*\|\s*(sh|bash)/gi,
      severity: 'critical',
      message: 'Pipe to shell from curl (remote code execution)',
      category: 'network'
    },
    {
      pattern: /wget.*\|\s*(sh|bash)/gi,
      severity: 'critical',
      message: 'Pipe to shell from wget (remote code execution)',
      category: 'network'
    },
    {
      pattern: /docker.*--privileged/gi,
      severity: 'critical',
      message: 'Docker privileged mode execution',
      category: 'container'
    }
  ],

  /**
   * High-risk patterns - significant security concerns
   */
  HIGH_RISK_PATTERNS: [
    {
      pattern: /sudo\s+(?!apt|npm|pip|yum|dnf)/gi,
      severity: 'high',
      message: 'Sudo execution with non-package managers',
      category: 'privilege'
    },
    {
      pattern: /chmod\s+[0-7]{3}/gi,
      severity: 'high',
      message: 'File permission changes',
      category: 'filesystem'
    },
    {
      pattern: /eval\s*\(/gi,
      severity: 'high',
      message: 'Dynamic code evaluation',
      category: 'execution'
    },
    {
      pattern: /exec\s*\(/gi,
      severity: 'high',
      message: 'Direct command execution',
      category: 'execution'
    }
  ],

  /**
   * Medium-risk patterns - caution required
   */
  MEDIUM_RISK_PATTERNS: [
    {
      pattern: /(?:rm\s+-rf|delete\s+.*\/|destroy\s+.*\/|remove\s+.*\/)/gi,
      severity: 'medium',
      message: 'Potentially destructive file operations',
      category: 'filesystem',
      skipIfIncludes: ['example', 'placeholder', 'test', 'demo']
    },
    {
      pattern: /(?:curl|wget).*install|download.*\|\s*(?:sh|bash)|install.*(?:curl|wget)/gi,
      severity: 'medium',
      message: 'Potentially unsafe software installation or download',
      category: 'network',
      skipIfIncludes: ['example', 'placeholder', 'test']
    },
    {
      pattern: /(?:curl|wget).*http|fetch.*http|download.*http/gi,
      severity: 'medium',
      message: 'Network operations with external resources',
      category: 'network',
      skipIfIncludes: ['example', 'placeholder', 'test', 'demo']
    },
    {
      pattern: /(?:write|modify|create).*file|file.*(?:write|modify|create)/gi,
      severity: 'medium',
      message: 'File write or modification operations',
      category: 'filesystem',
      skipIfIncludes: ['example', 'placeholder', 'test', 'demo', 'template']
    },
    {
      pattern: /sudo\s+(?!apt|npm|pip|yum|dnf|brew)/gi,
      severity: 'medium',
      message: 'Sudo execution with non-package managers',
      category: 'privilege',
      skipIfIncludes: ['example', 'placeholder', 'test']
    },
    {
      pattern: /chmod\s+[0-7]{3}\s+[^\/\s]/gi,
      severity: 'medium',
      message: 'File permission changes on specific files',
      category: 'filesystem',
      skipIfIncludes: ['example', 'placeholder', 'test']
    }
  ],

  /**
   * Get all patterns for a specific severity level
   */
  getPatternsBySeverity(severity) {
    const severityMap = {
      'critical': this.CRITICAL_PATTERNS,
      'high': this.HIGH_RISK_PATTERNS,
      'medium': this.MEDIUM_RISK_PATTERNS
    };
    return severityMap[severity] || [];
  },

  /**
   * Get all patterns combined
   */
  getAllPatterns() {
    return [
      ...this.CRITICAL_PATTERNS,
      ...this.HIGH_RISK_PATTERNS,
      ...this.MEDIUM_RISK_PATTERNS
    ];
  },

  /**
   * Get patterns for simple boolean checks (backward compatibility)
   */
  getDangerousPatterns() {
    return [
      ...this.CRITICAL_PATTERNS,
      ...this.HIGH_RISK_PATTERNS
    ].map(p => p.pattern);
  },

  /**
   * Get caution patterns (backward compatibility)
   */
  getCautionPatterns() {
    return this.MEDIUM_RISK_PATTERNS.map(p => p.pattern);
  },

  /**
   * Classify safety level based on patterns found
   */
  classifySafetyLevel(content, codeBlocksOnly = false) {
    let textToCheck = content;

    if (codeBlocksOnly) {
      // Extract code blocks only
      const codeBlocks = [];
      const codeBlockRegex = /```(?:[\w+-]*)\n([\s\S]*?)```/g;
      let match;
      while ((match = codeBlockRegex.exec(content)) !== null) {
        codeBlocks.push(match[1]);
      }

      // Also extract indented code
      const indentedCodeRegex = /^(?: {4}|\t)(.+)$/gm;
      let indentedMatch;
      while ((indentedMatch = indentedCodeRegex.exec(content)) !== null) {
        codeBlocks.push(indentedMatch[1]);
      }

      textToCheck = codeBlocks.join('\n');
    }

    // Check critical patterns first
    for (const pattern of this.CRITICAL_PATTERNS) {
      if (pattern.pattern.test(textToCheck)) {
        return 'dangerous';
      }
    }

    // Check high-risk patterns
    for (const pattern of this.HIGH_RISK_PATTERNS) {
      if (pattern.pattern.test(textToCheck)) {
        return 'dangerous';
      }
    }

    // Check medium-risk patterns
    for (const pattern of this.MEDIUM_RISK_PATTERNS) {
      if (pattern.pattern.test(textToCheck)) {
        return 'caution';
      }
    }

    return 'safe';
  }
};