---
description: Comprehensive CI/CD pipeline setup with security, testing, and deployment automation
allowed-tools: Bash(git:*), Write, Edit, Read, mcp__github__*, mcp__gitlab__*
---

# CI/CD Pipeline Setup

## Repository Analysis
- Git hosting: !`git remote get-url origin 2>/dev/null | grep -o 'github\|gitlab\|bitbucket' | head -1`
- Current CI files: !`find . -name ".github" -o -name ".gitlab-ci.yml" -o -name "bitbucket-pipelines.yml" | head -5`
- Project type: !`ls package.json requirements.txt Cargo.toml pom.xml go.mod 2>/dev/null | head -1`
- Deployment hints: !`ls Dockerfile docker-compose.yml vercel.json netlify.toml 2>/dev/null`

## CI/CD Target
Platform: **$ARGUMENTS** (e.g., "github-actions", "gitlab-ci", "azure-devops", "jenkins")

## 🚀 Comprehensive CI/CD Pipeline

### 1. Pipeline Architecture Design
- **Multi-stage pipeline**: Build → Test → Security → Deploy
- **Parallel execution**: Optimize pipeline performance
- **Conditional workflows**: Smart triggering based on changes
- **Environment promotion**: Dev → Staging → Production

### 2. Build & Test Automation

#### Build Pipeline
- **Dependency management**: Cache and install dependencies
- **Code compilation**: Build artifacts with optimization
- **Asset optimization**: Bundle and optimize static assets
- **Build verification**: Validate successful compilation

#### Testing Pipeline
- **Unit tests**: Fast feedback on code changes
- **Integration tests**: Component interaction validation
- **End-to-end tests**: Full application workflow testing
- **Performance tests**: Regression and load testing

### 3. Security Integration

#### Static Analysis
- **Code scanning**: Security vulnerability detection
- **Dependency scanning**: Third-party vulnerability detection
- **Secret scanning**: Prevent credential exposure
- **License compliance**: Open source license validation

#### Dynamic Analysis
- **Runtime security**: Application security testing
- **Penetration testing**: Automated security validation
- **Compliance scanning**: Regulatory requirement validation
- **Container scanning**: Docker image security analysis

## 🛠️ Platform-Specific Implementation

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run lint
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - security
  - deploy

variables:
  NODE_VERSION: "20"

cache:
  paths:
    - node_modules/

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
```

## 🔐 Security & Compliance Pipeline

### Automated Security Checks
- **SAST**: Static Application Security Testing
- **DAST**: Dynamic Application Security Testing
- **SCA**: Software Composition Analysis
- **Container security**: Image vulnerability scanning

### Compliance Automation
- **SOC 2**: Security and availability controls
- **GDPR**: Data protection compliance
- **HIPAA**: Healthcare data protection
- **PCI DSS**: Payment card industry standards

## 🌐 Deployment Strategies

### Environment Management
- **Development**: Continuous deployment for rapid feedback
- **Staging**: Production-like environment for final validation
- **Production**: Stable, monitored production deployments
- **Feature branches**: Isolated testing environments

### Deployment Patterns
- **Blue-green deployment**: Zero-downtime deployments
- **Rolling deployment**: Gradual update rollout
- **Canary deployment**: Risk-minimized feature rollout
- **A/B testing**: Data-driven feature validation

## 📊 Monitoring & Observability

### Pipeline Monitoring
- **Build metrics**: Success rates, duration, failure analysis
- **Test metrics**: Coverage, flakiness, performance trends
- **Security metrics**: Vulnerability trends, compliance status
- **Deployment metrics**: Frequency, lead time, failure rates

### Application Monitoring
- **Performance monitoring**: Response times, throughput
- **Error tracking**: Exception monitoring and alerting
- **Infrastructure monitoring**: Resource usage and health
- **User experience monitoring**: Real user metrics

## 🔄 Workflow Optimization

### Performance Optimization
- **Caching strategies**: Dependency and build caching
- **Parallel execution**: Concurrent job execution
- **Conditional execution**: Skip unnecessary steps
- **Resource optimization**: Right-size compute resources

### Developer Experience
- **Fast feedback**: Quick failure detection
- **Clear reporting**: Actionable failure information
- **Easy debugging**: Accessible logs and artifacts
- **Self-service**: Developer autonomy in pipeline management

## 📋 Implementation Checklist

- [ ] **Repository setup**: Initialize CI/CD configuration
- [ ] **Build pipeline**: Automated build and artifact generation
- [ ] **Test automation**: Comprehensive test execution
- [ ] **Security integration**: Automated security scanning
- [ ] **Deployment automation**: Environment-specific deployments
- [ ] **Monitoring setup**: Pipeline and application observability
- [ ] **Documentation**: Team training and runbook creation

## 🚀 Multi-Stage Pipeline & Quality Gates (migrated from legacy CI/CD prompt)

- Matrix build strategies across language versions and OSes
- Security scanning, linting, and test stages gating merge actions
- Manual approval and progressive delivery environments (dev → staging → prod)
- Automatic changelog and release note generation on successful pipeline

Create CI/CD pipeline with security, testing, and deployment automation.