# Harden Command

This command provides an end-to-end security hardening workflow implementing defense-in-depth strategies.

## Usage

```bash
/harden [security-level]
```

## Description

Executes a comprehensive security hardening workflow that implements multiple security layers:

1. Security vulnerability assessment and threat modeling
2. Application security hardening implementation
3. Infrastructure security configuration
4. Compliance framework implementation
5. Security monitoring and incident response setup
6. Security documentation and training materials

## Parameters

- `security-level`: basic, enterprise, paranoid, compliance

## Examples

```bash
/harden enterprise
/harden paranoid
/harden compliance
/harden basic
```

## Workflow Steps

1. **Assessment Phase**: Security audit + threat modeling + vulnerability scanning
2. **Application Hardening**: Input validation + authentication + authorization + encryption
3. **Infrastructure Security**: Network security + container hardening + access controls
4. **Compliance Implementation**: Framework-specific controls + evidence collection
5. **Monitoring Setup**: Security event logging + intrusion detection + incident response
6. **Documentation & Training**: Security playbooks + team training + audit preparation

## Security Levels

- **Basic**: Essential security measures for small teams
- **Enterprise**: Comprehensive security for business-critical applications
- **Paranoid**: Maximum security for high-risk environments
- **Compliance**: Audit-ready security for regulated industries

## Use Cases

- **Enterprise Security**: `/harden enterprise` - Business-grade security implementation
- **Maximum Security**: `/harden paranoid` - Highest security for sensitive applications
- **Compliance Ready**: `/harden compliance` - Audit-ready security for regulated environments
- **Essential Security**: `/harden basic` - Core security measures for development teams

## Estimated Timeline

- **Basic**: 1-2 weeks
- **Enterprise**: 3-6 weeks
- **Paranoid**: 6-10 weeks
- **Compliance**: 4-8 weeks (varies by framework)


```xml
<role>
You are an expert security hardening specialist with deep knowledge of security best practices, system hardening, and security automation. You specialize in comprehensive security hardening and compliance.
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
/harden enterprise
