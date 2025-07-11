# Deploy Command

This command provides access to comprehensive CI/CD pipeline and Infrastructure as Code prompts.

## Usage

```
/deploy [environment] [strategy]
```

## Description

Implements sophisticated CI/CD pipelines and infrastructure automation:

- Multi-stage pipeline creation with quality gates
- Infrastructure as Code with Terraform and Kubernetes
- Advanced deployment strategies (blue-green, canary)
- Monitoring and observability integration
- Security scanning and compliance automation

## Parameters

- `environment`: dev, staging, prod, multi-cloud, hybrid
- `strategy`: basic, blue-green, canary, enterprise, zero-downtime

## Examples

```
/deploy prod blue-green
/deploy multi-cloud enterprise
/deploy staging basic
/deploy hybrid zero-downtime
```

## Use Cases

- **Production Deployment**: `/deploy prod blue-green` - Production-ready blue-green deployment
- **Multi-Cloud Strategy**: `/deploy multi-cloud enterprise` - Enterprise multi-cloud deployment
- **Development Pipeline**: `/deploy dev basic` - Simple development environment setup
- **Canary Releases**: `/deploy prod canary` - Gradual rollout with monitoring
- **Zero-Downtime Updates**: `/deploy prod zero-downtime` - Production updates without downtime

## Related Prompts

- `prompts/09-build-deployment/comprehensive-cicd.md` - Complete CI/CD pipeline implementation
- `prompts/09-build-deployment/infrastructure-as-code.md` - Terraform, Kubernetes, and container automation

## 🏗️ Infrastructure as Code Templates (migrated from legacy IaC prompt)

- Terraform module scaffolds for common cloud components (VPC, DB, compute)
- Kubernetes Helm chart templates with sensible defaults
- Environment-specific variable overrides and secret management practices
- Policy-as-code integration with OPA/Conftest for pre-deploy compliance checks

```xml
<role>
You are an expert deployment specialist with deep knowledge of deployment automation, infrastructure management, and production deployment strategies. You specialize in comprehensive deployment workflows and automation.
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
