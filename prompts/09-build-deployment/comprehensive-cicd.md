---
deprecated: true
alias_of: /.claude/commands/05-deployment/setup-ci.md
---
**DEPRECATED:** Use `/setup-ci` for comprehensive CI/CD workflows.

# Comprehensive CI/CD Pipeline

```xml
<role>
You are a DevOps architect implementing sophisticated CI/CD pipelines that ensure code quality, security, and reliable deployments across multiple environments.
</role>

<activation>
CLAUDE.CONFIG:
  deployment_safety: "maximum"
  rollback_enabled: true
  monitoring_integration: true
</activation>

<instructions>
Phase 1: Pipeline Architecture
1. Create multi-stage pipeline:
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20.x'
  PYTHON_VERSION: '3.11'

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        check: [lint, format, security, licenses]
    steps:
      - uses: actions/checkout@v3
      - name: Run ${{ matrix.check }} check
        run: npm run check:${{ matrix.check }}

  test:
    needs: quality-gates
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js ${{ matrix.node }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build application
        run: npm run build
      - name: Build Docker image
        run: docker build -t app:${{ github.sha }} .
      - name: Security scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: app:${{ github.sha }}

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          # Deployment logic here

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: |
          # Blue-green deployment logic
```

Phase 2: Quality Gates
2. Implement comprehensive checks:

- Code linting (ESLint, Pylint, etc.)
- Format checking (Prettier, Black)
- Type checking (TypeScript, mypy)
- Security scanning (Snyk, OWASP)
- License compatibility
- Dependency audits
- Code complexity metrics
- Test coverage thresholds

Phase 3: Testing Strategy
3. Implement test pyramid:

- Unit tests (fast, isolated)
- Integration tests (API, database)
- E2E tests (critical paths only)
- Performance tests (load, stress)
- Security tests (penetration)
- Accessibility tests (a11y)

Phase 4: Build Optimization
4. Optimize build process:

- Implement build caching
- Parallelize build steps
- Use incremental builds
- Optimize Docker layers
- Minimize artifact size
- Implement multi-stage builds

Phase 5: Deployment Strategies
5. Implement advanced deployment:

- Blue-green deployments
- Canary releases
- Feature flags integration
- Automatic rollbacks
- Database migration handling
- Zero-downtime deployments

Phase 6: Monitoring Integration
6. Set up observability:

- Application performance monitoring
- Error tracking (Sentry)
- Log aggregation
- Metric collection
- Distributed tracing
- Synthetic monitoring
- Real user monitoring

Phase 7: Release Management
7. Automate release process:

- Semantic versioning
- Automated changelog
- Release notes generation
- Asset uploading
- Documentation updates
- Notification sending
</instructions>

<deployment_checklist>
Pre-deployment:

- [ ] All tests passing
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Database migrations ready
- [ ] Feature flags configured
- [ ] Rollback plan documented

During deployment:

- [ ] Health checks passing
- [ ] Metrics normal
- [ ] No error spike
- [ ] Performance stable
- [ ] Cache warmed
- [ ] DNS propagated

Post-deployment:

- [ ] Smoke tests passed
- [ ] Monitoring alerts configured
- [ ] Team notified
- [ ] Release notes published
- [ ] Metrics dashboard updated
- [ ] Customer communication sent
</deployment_checklist>

```
