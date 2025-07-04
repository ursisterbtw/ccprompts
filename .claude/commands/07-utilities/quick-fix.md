# Quick-Fix Command

This command provides targeted fixes for common development issues with minimal effort and maximum impact.

## Usage

```
/quick-fix [issue-type]
```

## Description

Delivers rapid, targeted solutions for common development problems:

1. Auto-detects issue patterns and provides specific fixes
2. Implements quick wins with high impact and low risk
3. Provides immediate improvements while planning long-term solutions
4. Focuses on developer productivity and common pain points
5. Includes validation steps to ensure fixes work correctly
6. Documents changes for future reference and learning

## Parameters

- `issue-type`: security, performance, quality, dependencies, tests, docs, build

## Examples

```
/quick-fix security
/quick-fix performance
/quick-fix dependencies
/quick-fix build
```

## Issue Types & Quick Fixes

### Security Quick Fixes

- **Dependency Vulnerabilities**: Update packages with known security issues
- **Hardcoded Secrets**: Identify and externalize sensitive data
- **Basic Headers**: Implement essential security headers
- **Input Validation**: Add basic input sanitization
- **HTTPS Enforcement**: Redirect HTTP to HTTPS
- **Session Security**: Secure session configuration

### Performance Quick Fixes

- **Database Queries**: Add missing indexes for slow queries
- **Bundle Size**: Remove unused dependencies and code
- **Image Optimization**: Compress and optimize images
- **Caching Headers**: Add appropriate cache headers
- **Lazy Loading**: Implement lazy loading for non-critical resources
- **Memory Leaks**: Fix common memory leak patterns

### Code Quality Quick Fixes

- **Linting Issues**: Auto-fix linting errors and warnings
- **Code Formatting**: Apply consistent code formatting
- **Dead Code**: Remove unused variables, functions, and imports
- **Code Duplication**: Extract common code to utilities
- **Naming Consistency**: Standardize naming conventions
- **Error Handling**: Add proper error handling and logging

### Dependency Quick Fixes

- **Outdated Packages**: Update to latest stable versions
- **Security Patches**: Apply critical security updates
- **Unused Dependencies**: Remove unused packages
- **License Issues**: Identify and resolve license conflicts
- **Vulnerability Scanning**: Run and address security scans
- **Package Auditing**: Clean up package.json/requirements.txt

### Testing Quick Fixes

- **Missing Tests**: Add basic tests for untested critical functions
- **Broken Tests**: Fix failing tests blocking CI/CD
- **Test Coverage**: Identify and test uncovered critical paths
- **Test Performance**: Speed up slow-running tests
- **Test Data**: Clean up and standardize test data
- **Assertion Quality**: Improve test assertions and error messages

### Documentation Quick Fixes

- **Missing README**: Create basic project documentation
- **API Documentation**: Add missing API endpoint documentation
- **Code Comments**: Add comments to complex code sections
- **Environment Setup**: Document development environment setup
- **Deployment Guide**: Create basic deployment instructions
- **Troubleshooting**: Document common issues and solutions

### Build Quick Fixes

- **Build Failures**: Fix common build configuration issues
- **CI/CD Issues**: Resolve pipeline failures and timeouts
- **Environment Variables**: Fix missing or incorrect environment configuration
- **Deployment Issues**: Resolve common deployment problems
- **Docker Issues**: Fix containerization problems
- **Package Scripts**: Fix npm/yarn/pip script issues

## Fix Validation

Each quick fix includes validation steps:

1. **Pre-Fix Assessment**: Measure current state
2. **Implementation**: Apply targeted fix
3. **Validation**: Verify fix works correctly
4. **Impact Measurement**: Confirm improvement achieved
5. **Documentation**: Record what was changed and why
6. **Follow-up**: Suggest related improvements

## Estimated Time

- **Individual Fixes**: 15-60 minutes each
- **Category Sweep**: 2-4 hours per issue type
- **Full Quick-Fix Audit**: 1-2 days

## Success Metrics

- Issues resolved per time invested
- Developer productivity improvements
- Build time reductions
- Security vulnerability count reduction
- Performance metric improvements
- Code quality score increases

## Related Prompts

- Links to comprehensive solutions for deeper fixes
- Suggests follow-up prompts for long-term improvements
- Connects to relevant workflow commands for systematic addressing

```xml
<role>
You are an expert rapid problem resolution specialist with deep knowledge of quick diagnostics, targeted solutions, and emergency response. You specialize in efficient issue identification and rapid resolution.
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
