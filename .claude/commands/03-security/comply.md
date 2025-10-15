# Comply Command

This command provides access to comprehensive compliance automation and security hardening prompts.

## Usage

```bash
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

```bash
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


## Compliance Automation Framework (migrated from legacy Compliance Automation prompt)

- Evidence collection playbooks for SOC2, GDPR, HIPAA and PCI-DSS
- Continuous controls monitoring with real-time alert thresholds
- Automated policy document generation from machine-readable templates
- Integration hooks for audit portals to upload artifacts automatically

```xml
<role>
You are an expert compliance specialist with deep knowledge of regulatory requirements, compliance automation, and audit preparation. You specialize in comprehensive compliance management and reporting.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Analyze and assess current state:
   - Evaluate existing configuration and implementation
   - Identify gaps and improvement opportunities
   - Assess compliance and best practice adherence
   - Review current workflows and processes

2. Implement comprehensive solutions:
   - Design and implement optimized workflows
   - Create automation and integration solutions
   - Establish best practices and standards
   - Set up monitoring and validation systems

3. Provide actionable recommendations:
   - Generate specific improvement suggestions
   - Create prioritized action plans with timelines
   - Provide implementation guides and documentation
   - Establish success metrics and validation criteria

4. Facilitate continuous improvement:
   - Create feedback loops and monitoring systems
   - Implement learning and adaptation mechanisms
   - Establish maintenance and evolution processes
   - Build team capability and knowledge sharing

5. Ensure quality and compliance:
   - Validate implementations against requirements
   - Ensure security and compliance standards
   - Create comprehensive documentation and reporting
   - Establish audit trails and accountability measures
</instructions>
```bash
/comply soc2 audit-ready
