# New-Feature Command

This command provides a complete feature development workflow from planning to deployment.

## Usage
```
/new-feature [type] [testing-level]
```

## Description
Executes a comprehensive feature development workflow following best practices:
1. Feature planning and architecture design
2. Test-driven development setup
3. Implementation with safety measures
4. Code quality and security validation
5. Documentation and knowledge capture
6. Deployment preparation and monitoring

## Parameters
- `type`: api, frontend, full-stack, microservice, integration
- `testing-level`: basic, comprehensive, tdd

## Examples
```
/new-feature api tdd
/new-feature full-stack comprehensive
/new-feature microservice tdd
/new-feature integration basic
```

## Workflow Steps
1. **Planning Phase**: Feature specification + architecture design + risk assessment
2. **Test Setup**: Test strategy + test harness + TDD setup (if applicable)
3. **Implementation Phase**: Feature development + code quality checks + security validation
4. **Integration Phase**: API integration + dependency updates + compatibility testing
5. **Documentation Phase**: Feature documentation + API docs + usage examples
6. **Deployment Phase**: Feature flags + deployment strategy + monitoring setup

## Testing Levels
- **Basic**: Unit tests + integration tests + basic E2E coverage
- **Comprehensive**: Full test pyramid + performance tests + security tests
- **TDD**: Test-driven development with comprehensive coverage and mutation testing

## Use Cases
- **API Development**: `/new-feature api tdd` - New API endpoint with test-driven development
- **Full-Stack Feature**: `/new-feature full-stack comprehensive` - Complete feature with frontend and backend
- **Microservice**: `/new-feature microservice tdd` - New microservice with comprehensive testing
- **Integration Feature**: `/new-feature integration basic` - Third-party integration with essential testing

## Estimated Timeline
- **API + Basic**: 1-2 weeks
- **API + TDD**: 2-3 weeks
- **Full-Stack + Comprehensive**: 3-5 weeks
- **Microservice + TDD**: 4-6 weeks

## Related Prompts
- `prompts/01-project-initialization/claude-md-generator.md`
- `prompts/04-testing/test-suite-generation.md`
- `prompts/02-code-analysis/security-quality-audit.md`
- `prompts/05-documentation/documentation-generator.md`