# Setup-CI Command

This command provides complete CI/CD pipeline implementation with quality gates and deployment automation.

## Usage

```
/setup-ci [platform] [complexity]
```

## Description

Implements a comprehensive CI/CD pipeline with integrated quality assurance and deployment automation:

1. Pipeline architecture design and implementation
2. Quality gates integration (testing, security, performance)
3. Multi-environment deployment configuration
4. Infrastructure as Code setup
5. Monitoring and observability integration
6. Security scanning and compliance automation

## Parameters

- `platform`: github, gitlab, jenkins, azure-devops, cloud-native
- `complexity`: starter, professional, enterprise

## Examples

```
/setup-ci github enterprise
/setup-ci gitlab professional
/setup-ci jenkins starter
/setup-ci cloud-native enterprise
```

## Workflow Steps

1. **Pipeline Design**: Architecture planning + branching strategy + quality gates
2. **Quality Integration**: Test automation + security scanning + code quality checks
3. **Build Optimization**: Caching strategies + parallel execution + artifact management
4. **Deployment Strategy**: Multi-environment + deployment strategies + rollback procedures
5. **Infrastructure Setup**: IaC integration + environment provisioning + configuration management
6. **Monitoring Integration**: Deployment monitoring + performance tracking + alerting

## Complexity Levels

- **Starter**: Basic CI/CD for small teams with essential quality checks
- **Professional**: Comprehensive pipeline with advanced testing and deployment strategies
- **Enterprise**: Full-featured pipeline with security, compliance, and multi-cloud support

## Use Cases

- **GitHub Enterprise**: `/setup-ci github enterprise` - Complete GitHub Actions enterprise pipeline
- **GitLab Professional**: `/setup-ci gitlab professional` - GitLab CI with advanced features
- **Cloud-Native**: `/setup-ci cloud-native enterprise` - Kubernetes-native CI/CD with cloud integrations
- **Jenkins Setup**: `/setup-ci jenkins professional` - Jenkins pipeline with modern practices

## Estimated Timeline

- **Starter**: 1-2 weeks
- **Professional**: 2-4 weeks
- **Enterprise**: 4-8 weeks

## Related Prompts

- `prompts/09-build-deployment/comprehensive-cicd.md`
- `prompts/09-build-deployment/infrastructure-as-code.md`
- `prompts/04-testing/test-suite-generation.md`
- `prompts/10-security-compliance/security-hardening.md`

```xml
<role>
You are an expert CI/CD specialist with deep knowledge of continuous integration, deployment automation, and DevOps best practices. You specialize in comprehensive CI/CD pipeline setup and optimization.
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
```
