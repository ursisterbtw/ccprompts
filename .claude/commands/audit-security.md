# Security Audit Command

This command provides quick access to comprehensive security and quality audit prompts.

## Usage
```
/audit-security [scope] [severity-filter]
```

## Description
Performs comprehensive security vulnerability assessment following OWASP Top 10 guidelines, industry best practices, and compliance frameworks. Delivers actionable security findings with risk prioritization and remediation guidance.

## Parameters
- `scope`: `full-codebase` | `component` | `api` | `dependencies` | `infrastructure`
- `severity-filter`: `critical` | `high` | `medium` | `low` | `paranoid` (all levels)

## Examples

### Example 1: Full Codebase Security Audit
```
/audit-security full-codebase paranoid
```
**Output**: Complete security assessment covering:
- OWASP Top 10 vulnerability analysis
- Dependency vulnerability scanning
- Code security pattern analysis
- Configuration security review
- Infrastructure security assessment

### Example 2: Critical Vulnerabilities Only
```
/audit-security component critical
```
**Output**: Focused analysis on critical security issues in specific component:
- SQL injection vulnerabilities
- Authentication bypasses
- Authorization flaws
- Remote code execution risks

### Example 3: API Security Assessment
```
/audit-security api high
```
**Output**: API-specific security analysis:
- Authentication/authorization weaknesses
- Input validation gaps
- Rate limiting issues
- Data exposure risks
- CORS misconfigurations

### Example 4: Dependencies Security Scan
```
/audit-security dependencies medium
```
**Output**: Dependency security review:
- Known vulnerability detection
- License compliance check
- Outdated package identification
- Supply chain risk assessment

## Related Prompts
- `prompts/02-code-analysis/security-quality-audit.md`
- `