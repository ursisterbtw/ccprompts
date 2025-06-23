# Security Audit Command

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

## Example
```
/audit-security full-codebase paranoid
```

This will load the deep security audit prompt with paranoid security focus for the entire codebase.

## Related Prompts
- `prompts/02-code-analysis/security-quality-audit.md`
- `prompts/02-code-analysis/dependency-analysis.md`
- `prompts/10-security-compliance/security-hardening.md`