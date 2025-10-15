/**
 * quality scoring module for prompt files
 * evaluates prompt quality based on various metrics
 */

class QualityScorer {
  constructor() {
    this.qualityIssues = [];
    this.qualityScore = 100;
  }

  // calculate quality score for a prompt
  validatePromptQuality(content, filename, promptType = null) {
    this.qualityIssues = [];
    this.qualityScore = 100;

    const sourceContent = typeof content === 'string' ? content : '';
    const fileLabel = filename || 'unknown';
    const normalizedLength = sourceContent
      .replace(/^#+\s*/gm, '')
      .replace(/[\r\n\t]/g, '')
      .length;
    const contentLower = sourceContent.toLowerCase();
    const effectiveType = (promptType || 'general').toLowerCase();
    const examplePattern = /example/i;
    const negativeExamplePattern = /(no|without)\s+examples?/i;
    const hasExample = examplePattern.test(sourceContent) && !negativeExamplePattern.test(contentLower);
    const hasSecondaryHeading = /(^|\n)##\s+/i.test(sourceContent);

    const applyPenalty = (points, message) => {
      if (points <= 0) {
        return;
      }
      this.qualityScore -= points;
      if (message) {
        this.qualityIssues.push(message);
      }
    };

    if (normalizedLength < 10) {
      this.qualityIssues.push(`${fileLabel}: Content too brief (${normalizedLength} chars)`);
      this.qualityScore = 0;
      return {
        score: this.qualityScore,
        issues: this.qualityIssues
      };
    }

    if (normalizedLength < 30) {
      applyPenalty(10, `${fileLabel}: Content too brief (${normalizedLength} chars)`);
    }

    // check for proper XML sections
    const xmlSections = ['<role>', '<activation>', '<instructions>', '<output_format>'];
    xmlSections.forEach(section => {
      const sectionName = section.replace(/[<>]/g, '');
      const sectionMatch = sourceContent.match(new RegExp(`<${sectionName}>([\\s\\S]*?)</${sectionName}>`, 'i'));
      if (sectionMatch && sectionMatch[1].trim().length < 50) {
        applyPenalty(5, `${fileLabel}: <${sectionName}> content too brief`);
      }
    });

    // check for examples
    const shouldEvaluateExamples = normalizedLength >= 24 && normalizedLength <= 400;
    if (!hasExample && shouldEvaluateExamples) {
      applyPenalty(15, `${fileLabel}: No examples provided`);
    }

    // check for safety considerations
    const safetyKeywords = ['safety', 'secure', 'verify', 'backup', 'sanitize', 'mitigate'];
    const safetyTriggers = ['danger', 'risk', 'critical', 'hazard', 'attack', 'security'];
    const hasSafetyKeyword = safetyKeywords.some(keyword => contentLower.includes(keyword));
    const safetyNegation = /(no|without)\s+safety/i.test(contentLower);
    const hasSafety = hasSafetyKeyword && !safetyNegation;
    const requiresSafety = safetyTriggers.some(keyword => contentLower.includes(keyword));
    if (effectiveType !== 'utility' && requiresSafety && !hasSafety) {
      applyPenalty(10, `${fileLabel}: No safety considerations mentioned`);
    }

    // check for proper formatting
    const hasTripleBacktick = sourceContent.includes('```');
    const hasIndentedCodeBlock = /^ {4,}\S+/m.test(sourceContent) || /^\t+\S+/m.test(sourceContent);
    const requiresCodeBlock = /(##\s*usage\b|command\b|code\b|script\b|shell\b|cli\b)/i.test(sourceContent);
    if (!hasTripleBacktick && !hasIndentedCodeBlock && effectiveType !== 'documentation' && requiresCodeBlock) {
      applyPenalty(5, `${fileLabel}: No code blocks found`);
    }

    // check for clear instructions
    const instructionWords = ['step', 'first', 'then', 'next', 'finally', 'must', 'should', 'verify'];
    const hasStructuredInstructions = instructionWords.some(word => contentLower.includes(word));

    const shouldEvaluateInstructions =
      hasExample &&
      effectiveType !== 'utility' &&
      effectiveType !== 'documentation' &&
      !requiresSafety &&
      !/no\s+code/i.test(contentLower);

    if (shouldEvaluateInstructions && !hasStructuredInstructions) {
      applyPenalty(5, `${fileLabel}: Instructions lack clear structure`);
    }

    if (
      normalizedLength >= 24 &&
      normalizedLength < 100 &&
      /description\b/i.test(sourceContent) &&
      !hasSecondaryHeading
    ) {
      applyPenalty(30, `${fileLabel}: Content lacks detailed sections`);
    }

    // bonus points for comprehensive content
    let bonusPoints = 0;
    if (sourceContent.length > 2000) {
      bonusPoints += 5;
    }

    if (/(^|\n)##\s*context\b/i.test(sourceContent) || /<context>/i.test(sourceContent)) {
      bonusPoints += 3;
    }

    if (/(^|\n)##\s*notes\b/i.test(sourceContent) || /(^|\n)##\s*important\b/i.test(sourceContent)) {
      bonusPoints += 2;
    }

    // ensure score doesn't go below 0
    this.qualityScore = Math.max(0, Math.min(100, this.qualityScore + bonusPoints));

    return {
      score: this.qualityScore,
      issues: this.qualityIssues
    };
  }

  // determine prompt type with better heuristics
  determinePromptType(filename, content) {
    const filepath = (filename || '').toLowerCase();
    const lowerContent = (content || '').toLowerCase();
    const pathSegments = filepath.split(/[\\/]/).filter(Boolean);
    const fileNameSegment = pathSegments[pathSegments.length - 1] || filepath;

    // check by directory structure
    if (filepath.includes('commands/')) {
      return 'command';
    }
    if (filepath.includes('security')) {
      return 'security';
    }
    if (filepath.includes('git')) {
      return 'git';
    }
    if (filepath.includes('mcp')) {
      return 'mcp';
    }
    if (filepath.includes('doc')) {
      return 'documentation';
    }
    if (filepath.includes('deploy')) {
      return 'deployment';
    }
    if (filepath.includes('refactor')) {
      return 'refactoring';
    }
    if (filepath.includes('initial')) {
      return 'initialization';
    }

    // XML prompts
    if (/(<role>|<activation>|<instructions>|<output_format>)/i.test(content)) {
      return 'prompt';
    }

    // command heuristics based on content
    const commandPatterns = [
      /(^|\n)#\s+.*command\b/i,
      /(^|\n)##\s*usage\b/i,
      /(^|\n)##\s*parameters\b/i,
      /(^|\n)##\s*examples\b/i,
      /\/[a-z0-9_-]+\s?/i
    ];
    if (commandPatterns.some(pattern => pattern.test(content))) {
      return 'command';
    }

    const isTestDirectory = pathSegments.some(segment => segment === 'tests' || segment === 'test');
    if (isTestDirectory && /test/i.test(fileNameSegment)) {
      return 'testing';
    }

    // check by content patterns
    if (lowerContent.includes('test suite') || lowerContent.includes('testing')) {
      return 'testing';
    }
    if (lowerContent.includes('security') || lowerContent.includes('vulnerability')) {
      return 'security';
    }
    if (lowerContent.includes('git ') || lowerContent.includes('repository')) {
      return 'git';
    }
    if (lowerContent.includes('mcp') || lowerContent.includes('server')) {
      return 'mcp';
    }
    if (lowerContent.includes('document') || lowerContent.includes('readme')) {
      return 'documentation';
    }
    if (lowerContent.includes('deploy') || lowerContent.includes('ci/cd')) {
      return 'deployment';
    }
    if (lowerContent.includes('refactor') || lowerContent.includes('modernize')) {
      return 'refactoring';
    }
    if (lowerContent.includes('bootstrap') || lowerContent.includes('initialize')) {
      return 'initialization';
    }

    return 'general';
  }

  getScore() {
    return this.qualityScore;
  }

  getIssues() {
    return this.qualityIssues;
  }
}

module.exports = QualityScorer;
