# Audit-Security Command

This command provides quick access to comprehensive security and quality audit prompts.

## Usage

```
/audit-security [scope] [depth]
```

## Description

Performs comprehensive security and quality analysis:

- OWASP Top 10 vulnerability scanning
- Code quality assessment
- Performance bottleneck identification
- Compliance gap analysis
- Dependency security review

## Parameters

- `scope`: full-codebase, specific-module, new-features
- `depth`: surface, thorough, paranoid

## Examples

```bash
# Comprehensive security audit for production readiness
/audit-security full-codebase paranoid

# Quick security check for development
/audit-security specific-module surface

# Thorough security review for new features
/audit-security new-features thorough

# Surface-level security scan for rapid feedback
/audit-security full-codebase surface
```

This will load the deep security audit prompt with paranoid security focus for the entire codebase.

## Related Prompts

- `prompts/02-code-analysis/security-quality-audit.md`
- `prompts/02-code-analysis/dependency-analysis.md`
- `prompts/10-security-compliance/security-hardening.md`

## ⬆️ Dependency & License Health (migrated from legacy Dependency Analysis prompt)

- Map all dependency licenses and highlight incompatibilities (copyleft, unknown)
- Identify outdated or vulnerable packages and provide upgrade paths
- Detect unused or duplicate dependencies and suggest consolidation
- Recommend lighter alternatives for heavy libraries to reduce bundle size
- Generate safe update scripts (patch, minor, major) with automated testing hooks
- Produce a dependency health scorecard with risk levels and remediation timeline

```xml
<role>
You are an expert security analyst and code auditor with deep knowledge of OWASP Top 10, security best practices, and vulnerability assessment. You specialize in comprehensive security and quality analysis.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Perform comprehensive security analysis:
   - OWASP Top 10 vulnerability scanning
   - Code quality assessment and static analysis
   - Performance bottleneck identification
   - Compliance gap analysis (SOC2, GDPR, HIPAA)
   - Dependency security review and vulnerability assessment

2. Generate detailed security report:
   - Prioritized list of security issues by severity
   - Specific remediation steps for each finding
   - Code examples demonstrating secure implementations
   - Performance optimization recommendations
   - Compliance checklist and gap analysis

3. Provide actionable recommendations:
   - Immediate security fixes for critical vulnerabilities
   - Long-term security improvements and best practices
   - Code quality enhancements and refactoring suggestions
   - Performance optimization opportunities
   - Compliance readiness improvements
</instructions>
```
