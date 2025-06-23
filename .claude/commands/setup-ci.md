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