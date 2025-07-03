/**
 * Quality scoring module for prompt files
 * Evaluates prompt quality based on various metrics
 */

class QualityScorer {
  constructor() {
    this.qualityIssues = [];
    this.qualityScore = 100;
  }

  // Calculate quality score for a prompt
  validatePromptQuality(content, filename, promptType = null) {
    this.qualityIssues = [];
    this.qualityScore = 100;
    
    // Length checks
    if (content.length < 500) {
      this.qualityIssues.push(`${filename}: Content too brief (${content.length} chars)`);
      this.qualityScore -= 10;
    }

    // Check for proper XML sections
    const xmlSections = ['<role>', '<activation>', '<instructions>', '<output_format>'];
    xmlSections.forEach(section => {
      const sectionMatch = content.match(new RegExp(`${section}([\\s\\S]*?)${section.replace('<', '</')}`, 'i'));
      if (sectionMatch && sectionMatch[1].trim().length < 50) {
        this.qualityIssues.push(`${filename}: ${section} content too brief`);
        this.qualityScore -= 5;
      }
    });

    // Check for examples
    if (!content.includes('example') && !content.includes('Example')) {
      this.qualityIssues.push(`${filename}: No examples provided`);
      this.qualityScore -= 15;
    }

    // Check for safety considerations
    if (promptType !== 'utility' && 
        !content.toLowerCase().includes('safety') && 
        !content.toLowerCase().includes('verify') &&
        !content.toLowerCase().includes('backup')) {
      this.qualityIssues.push(`${filename}: No safety considerations mentioned`);
      this.qualityScore -= 10;
    }

    // Check for proper formatting
    if (!content.includes('```') && promptType !== 'documentation') {
      this.qualityIssues.push(`${filename}: No code blocks found`);
      this.qualityScore -= 5;
    }

    // Check for clear instructions
    const instructionWords = ['step', 'first', 'then', 'next', 'finally', 'must', 'should'];
    const hasStructuredInstructions = instructionWords.some(word => 
      content.toLowerCase().includes(word)
    );
    
    if (!hasStructuredInstructions) {
      this.qualityIssues.push(`${filename}: Instructions lack clear structure`);
      this.qualityScore -= 5;
    }

    // Bonus points for comprehensive content
    if (content.length > 2000) {
      this.qualityScore = Math.min(100, this.qualityScore + 5);
    }
    
    if (content.includes('## Context') || content.includes('<context>')) {
      this.qualityScore = Math.min(100, this.qualityScore + 3);
    }

    if (content.includes('## Notes') || content.includes('## Important')) {
      this.qualityScore = Math.min(100, this.qualityScore + 2);
    }

    // Ensure score doesn't go below 0
    this.qualityScore = Math.max(0, this.qualityScore);
    
    return {
      score: this.qualityScore,
      issues: this.qualityIssues
    };
  }

  // Determine prompt type with better heuristics
  determinePromptType(filename, content) {
    const filepath = filename.toLowerCase();
    
    // Check by directory structure
    if (filepath.includes('commands/')) return 'command';
    if (filepath.includes('test')) return 'testing';
    if (filepath.includes('security')) return 'security';
    if (filepath.includes('git')) return 'git';
    if (filepath.includes('mcp')) return 'mcp';
    if (filepath.includes('doc')) return 'documentation';
    if (filepath.includes('deploy')) return 'deployment';
    if (filepath.includes('refactor')) return 'refactoring';
    if (filepath.includes('initial')) return 'initialization';
    
    // Check by content patterns
    if (content.includes('test suite') || content.includes('testing')) return 'testing';
    if (content.includes('security') || content.includes('vulnerability')) return 'security';
    if (content.includes('git ') || content.includes('repository')) return 'git';
    if (content.includes('MCP') || content.includes('server')) return 'mcp';
    if (content.includes('document') || content.includes('README')) return 'documentation';
    if (content.includes('deploy') || content.includes('CI/CD')) return 'deployment';
    if (content.includes('refactor') || content.includes('modernize')) return 'refactoring';
    if (content.includes('bootstrap') || content.includes('initialize')) return 'initialization';
    
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