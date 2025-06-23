# Pre-Commit Command

This command automates comprehensive pre-commit checks and quality gates to ensure code quality before commits.

## Usage
```
/pre-commit [scope] [strictness]
```

## Parameters
- `scope`: staged, all-changes, full-project, affected-files
- `strictness`: basic, standard, strict, enterprise

## Examples
```
/pre-commit
/pre-commit staged strict
/pre-commit all-changes standard
/pre-commit full-project enterprise
```

## Description
Comprehensive pre-commit automation system:
1. Automated code quality checks and linting
2. Security vulnerability scanning and validation
3. Test execution and coverage verification
4. Documentation consistency and completeness
5. Dependency audit and license compliance
6. Performance impact assessment and optimization

## Quality Gates

### Code Quality Checks
- **Linting**: ESLint, Pylint, RuboCop, Clippy based on project type
- **Formatting**: Prettier, Black, rustfmt, gofmt automatic formatting
- **Type Checking**: TypeScript, mypy, Flow static analysis
- **Complexity Analysis**: Cyclomatic complexity and maintainability metrics
- **Code Duplication**: Identify and flag duplicated code blocks
- **Naming Conventions**: Enforce consistent naming standards

### Security Validation
- **Dependency Scanning**: Known vulnerabilities in packages and libraries
- **Secret Detection**: Hardcoded passwords, API keys, and sensitive data
- **SAST Analysis**: Static application security testing
- **License Compliance**: Verify license compatibility and requirements
- **Security Headers**: Web application security configuration
- **Input Validation**: Identify potential injection vulnerabilities

### Testing Requirements
- **Unit Tests**: Execute affected unit tests with coverage requirements
- **Integration Tests**: Run integration tests for modified components
- **Coverage Thresholds**: Enforce minimum code coverage percentages
- **Test Quality**: Analyze test effectiveness and assertion quality
- **Performance Tests**: Execute performance benchmarks for critical paths
- **Contract Tests**: Validate API contracts and schemas

### Documentation Standards
- **API Documentation**: Ensure public APIs are properly documented
- **Code Comments**: Verify complex logic has explanatory comments
- **README Updates**: Check if README reflects recent changes
- **Architecture Decisions**: Validate ADR updates for significant changes
- **Changelog Maintenance**: Ensure CHANGELOG.md is updated appropriately
- **Documentation Build**: Verify documentation builds without errors

## Strictness Levels

### Basic Level
```
Basic Pre-Commit Checks
======================

✅ Code Formatting: Prettier/Black auto-formatting applied
✅ Basic Linting: Critical errors and syntax issues resolved
✅ Compile Check: Code compiles without errors
✅ Basic Tests: Modified files have corresponding tests
⏳ Security: High-severity vulnerabilities only
⏳ Documentation: Critical API changes documented

Estimated Time: 2-5 minutes
Gate Policy: Block on critical errors only
```

### Standard Level
```
Standard Pre-Commit Checks
=========================

✅ Code Quality: ESLint/Pylint with standard rules
✅ Type Safety: TypeScript/mypy type checking
✅ Unit Tests: 80% coverage on modified code
✅ Integration Tests: Affected integration tests pass
✅ Security Scan: Medium+ vulnerabilities addressed
✅ Dependency Audit: No high-risk dependencies
✅ Documentation: Public APIs documented
⚠️ Performance: Performance regression check

Estimated Time: 8-15 minutes
Gate Policy: Block on standard quality thresholds
```

### Strict Level
```
Strict Pre-Commit Checks
=======================

✅ Advanced Linting: All style and quality rules enforced
✅ Complexity Analysis: Cyclomatic complexity < 10
✅ Test Coverage: 90% coverage including edge cases
✅ Security: All vulnerabilities addressed
✅ Performance: No performance regressions
✅ Documentation: Comprehensive documentation updates
✅ Code Review: Automated code review suggestions
✅ Dependency Freshness: Dependencies up-to-date

Estimated Time: 15-30 minutes
Gate Policy: Block on any quality threshold violations
```

### Enterprise Level
```
Enterprise Pre-Commit Checks
===========================

✅ Full Security Suite: SAST, DAST, dependency scanning
✅ Compliance Validation: SOC2, GDPR, HIPAA requirements
✅ Performance Benchmarking: Load testing for critical paths
✅ Accessibility Testing: WCAG 2.1 compliance validation
✅ Cross-Platform Testing: Multi-environment compatibility
✅ License Audit: Legal compliance and attribution
✅ Architecture Compliance: Design pattern adherence
✅ Operational Readiness: Monitoring and logging checks

Estimated Time: 30-60 minutes
Gate Policy: Block on any enterprise standard violations
```

## Automated Fixes

### Auto-Fixable Issues
```
Auto-Fix Report
===============

🔧 Applied Automatic Fixes (12 issues):
├── Code Formatting: 8 files reformatted
├── Import Organization: 4 files organized
├── Unused Imports: 3 imports removed
├── Missing Semicolons: 7 semicolons added
├── Trailing Whitespace: 12 lines cleaned
└── Documentation: 2 missing JSDoc blocks added

⚠️ Manual Review Required (3 issues):
├── Potential SQL injection in user-service.js:42
├── High cyclomatic complexity in data-processor.js:156
└── Missing unit test for new feature in auth-handler.js

🚫 Blocking Issues (1 issue):
└── High-severity vulnerability in lodash@4.17.20
```

### Smart Suggestions
- **Refactoring Opportunities**: Identify code that could be improved
- **Performance Optimizations**: Suggest optimizations for slow operations
- **Security Enhancements**: Recommend security best practices
- **Testing Improvements**: Suggest additional test cases and scenarios
- **Documentation Enhancements**: Identify areas needing better documentation

## Integration Features

### Git Integration
```bash
# .git/hooks/pre-commit (automatically generated)
#!/bin/bash
# Claude Code Pre-Commit Hook
# Generated by /pre-commit command

echo "Running Claude Code pre-commit checks..."

# Execute pre-commit validation
claude-code /pre-commit staged standard

# Check exit code
if [ $? -ne 0 ]; then
    echo "❌ Pre-commit checks failed. Commit blocked."
    echo "Run 'claude-code /pre-commit --fix' to auto-resolve issues."
    exit 1
fi

echo "✅ All pre-commit checks passed. Proceeding with commit."
exit 0
```

### CI/CD Integration
- Generate GitHub Actions workflows for pre-commit checks
- Create GitLab CI/CD pipeline definitions
- Configure Jenkins build steps
- Integrate with Azure DevOps pipelines
- Support custom CI/CD systems

### IDE Integration
- Real-time feedback in code editors
- Inline suggestions and quick fixes
- Progress indicators for long-running checks
- Integrated test running and coverage display
- Documentation preview and validation

## Customization Options

### Project-Specific Rules
```yaml
# .claude/pre-commit-config.yaml
pre_commit:
  strictness: standard
  
  quality_gates:
    code_coverage: 85
    complexity_threshold: 8
    security_level: medium
    performance_regression: 5%
  
  custom_checks:
    - name: "API Schema Validation"
      command: "npm run validate-schemas"
      required: true
    
    - name: "Database Migration Check"
      command: "rails db:migrate:status"
      condition: "migration_files_changed"
  
  exclusions:
    files:
      - "*.generated.js"
      - "vendor/**/*"
    checks:
      - "spell-check"  # Exclude for legacy code
  
  integrations:
    slack_notifications: true
    jira_ticket_updates: true
    sonarqube_analysis: true
```

### Team Standards
- Shared configuration across team members
- Organization-wide policy enforcement
- Role-based check requirements
- Approval workflows for standard changes
- Exception handling and override procedures

## Performance Optimization

### Incremental Checks
- Only check files modified since last commit
- Cache results for unchanged dependencies
- Parallel execution of independent checks
- Smart dependency analysis for affected tests
- Incremental type checking and linting

### Resource Management
- CPU and memory usage monitoring
- Timeout handling for long-running checks
- Graceful degradation for resource constraints
- Priority-based check ordering
- Background processing for non-blocking checks

## Reporting and Analytics

### Check Results Summary
```
Pre-Commit Summary Report
========================

📊 Check Results (15 total checks)
├── ✅ Passed: 12 checks
├── ⚠️  Warnings: 2 checks  
├── ❌ Failed: 1 check
└── ⏭️  Skipped: 0 checks

⏱️ Performance Metrics
├── Total Execution Time: 8m 34s
├── Fastest Check: TypeScript (0.8s)
├── Slowest Check: Integration Tests (3m 12s)
└── Parallel Efficiency: 73%

🎯 Quality Metrics
├── Code Coverage: 87% (+2% from last commit)
├── Technical Debt: 2.3 hours (-0.5h from last commit)
├── Security Score: 94/100 (no change)
└── Documentation Coverage: 78% (+5% from last commit)
```

### Trend Analysis
- Track quality metrics over time
- Identify patterns in check failures
- Monitor team compliance rates
- Measure impact on development velocity
- Benchmark against industry standards

## Error Handling and Recovery

### Failure Recovery
- Detailed error messages with fix suggestions
- Automatic retry for transient failures
- Rollback capabilities for auto-applied fixes
- Manual override options for urgent commits
- Emergency bypass procedures with audit trail

### Common Issues Resolution
```
Common Pre-Commit Issues and Solutions
=====================================

Issue: Test Coverage Below Threshold
Solution: Add unit tests for new functions
Command: /test unit [affected-files]

Issue: Security Vulnerability Detected  
Solution: Update vulnerable dependencies
Command: npm audit fix --force

Issue: Linting Errors
Solution: Apply automatic formatting and fixes
Command: /pre-commit --auto-fix

Issue: Performance Regression
Solution: Profile and optimize affected code
Command: /optimize performance [changed-files]
```

## Related Commands
- `/test` - Run comprehensive test suites
- `/audit-security` - Detailed security analysis
- `/optimize` - Performance optimization workflows
- `/document` - Documentation generation and updates
- `/deploy` - Deployment readiness validation