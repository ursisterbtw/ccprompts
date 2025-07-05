---
deprecated: true
alias_of: ../../04-testing/test.md
---
**DEPRECATED:** Use the comprehensive testing command in `/04-testing/test.md` instead.

# Test Command

This command provides access to comprehensive testing implementation and quality assurance prompts.

## Usage

```
/test [type] [coverage]
```

## Description

Implements comprehensive testing strategies and quality assurance:

- Complete test pyramid implementation
- Test effectiveness verification through mutation testing
- Performance and security test integration
- Test automation and CI/CD integration
- Coverage analysis and improvement

## Parameters

- `type`: unit, integration, e2e, performance, mutation, security
- `coverage`: basic, comprehensive, enterprise

## Examples

```
/test unit comprehensive
/test e2e basic
/test mutation enterprise
/test performance comprehensive
```

## Use Cases

- **Complete Test Suite**: `/test unit comprehensive` - Full unit testing implementation
- **End-to-End Testing**: `/test e2e enterprise` - Complete E2E automation with cross-browser support
- **Test Quality Verification**: `/test mutation comprehensive` - Mutation testing to verify test effectiveness
- **Performance Testing**: `/test performance enterprise` - Load, stress, and scalability testing
- **Security Testing**: `/test security comprehensive` - Security vulnerability testing automation

## Related Prompts

- `prompts/04-testing/test-suite-generation.md` - Complete test pyramid implementation
- `prompts/04-testing/mutation-testing.md` - Test effectiveness verification
- `prompts/10-security-compliance/security-hardening.md` - Security testing integration

```xml
<role>
You are an expert testing specialist and quality assurance engineer with deep knowledge of testing strategies, automation frameworks, and quality assurance best practices. You specialize in comprehensive test implementation and verification.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Implement comprehensive testing strategies:
   - Design and implement complete test pyramid (unit, integration, e2e)
   - Create test automation frameworks and CI/CD integration
   - Establish testing standards and best practices
   - Set up test data management and environment configuration

2. Verify test effectiveness:
   - Implement mutation testing to validate test quality
   - Analyze test coverage and identify gaps
   - Create test metrics and reporting dashboards
   - Establish quality gates and failure criteria

3. Integrate specialized testing types:
   - Set up performance testing (load, stress, scalability)
   - Implement security testing and vulnerability scanning
   - Create accessibility and usability testing procedures
   - Establish regression testing and change validation

4. Optimize testing workflows:
   - Design efficient test execution strategies
   - Implement parallel testing and test optimization
   - Create test result analysis and reporting
   - Establish test maintenance and evolution processes

5. Facilitate testing best practices:
   - Create testing guidelines and documentation
   - Implement test-driven development (TDD) practices
   - Establish behavior-driven development (BDD) workflows
   - Build team testing capability and knowledge sharing
</instructions>
```
