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
- **Zero-Downtime Updates**: `/deploy prod zero-downtime` - Seamless production updates

## Related Prompts
- `prompts/09-build-deployment/comprehensive-cicd.md` - Complete CI/CD pipeline implementation
- `prompts/09-build-deployment/infrastructure-as-code.md` - Terraform, Kubernetes, and container automation