# Comply Command

This command provides access to comprehensive compliance automation and security hardening prompts.

## Usage
```
/comply [framework] [depth]
```

## Description
Implements comprehensive compliance automation and security hardening:
- Automated compliance monitoring and evidence collection
- Security hardening following industry best practices
- Regulatory framework implementation (SOC2, GDPR, HIPAA)
- Continuous compliance drift detection
- Audit trail generation and reporting

## Parameters
- `framework`: soc2, gdpr, hipaa, pci, iso27001, custom
- `depth`: basic, thorough, audit-ready, paranoid

## Examples
```
/comply soc2 audit-ready
/comply gdpr thorough
/comply hipaa basic
/comply custom paranoid
```

## Use Cases
- **SOC2 Compliance**: `/comply soc2 audit-ready` - Complete SOC2 compliance automation
- **GDPR Implementation**: `/comply gdpr thorough` - Comprehensive GDPR compliance framework
- **HIPAA Security**: `/comply hipaa audit-ready` - Healthcare data protection compliance
- **Security Hardening**: `/comply custom paranoid` - Maximum security hardening implementation
- **Multi-Framework**: `/comply iso27001 thorough` - ISO 27001 compliance automation
- **Basic Compliance**: `/comply soc2 basic` - Essential compliance measures

## Related Prompts
- `prompts/10-security-compliance/compliance-automation.md` - Automated compliance monitoring frameworks
- `prompts/10-security-compliance/security-hardening.md` - Comprehensive security hardening implementation
- `prompts/02-code-analysis/security-quality-audit.md` - Security vulnerability assessment