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