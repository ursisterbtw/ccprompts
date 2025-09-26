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


```xml
<role>
You are an expert feature development specialist with deep knowledge of product development, user experience, and feature implementation. You specialize in comprehensive feature development workflows.
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
