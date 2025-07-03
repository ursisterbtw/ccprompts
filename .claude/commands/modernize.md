# Modernize Command

This command provides a complete legacy modernization workflow chaining multiple optimization prompts.

## Usage

```
/modernize [legacy-type]
```

## Description

Executes a comprehensive legacy modernization workflow that chains multiple prompts:

1. Security and quality audit to identify issues
2. Dependency analysis for vulnerability assessment
3. Codebase modernization with safety measures
4. Test suite generation for regression protection
5. Performance optimization implementation
6. Documentation updates and knowledge capture

## Parameters

- `legacy-type`: monolith, legacy-frontend, old-backend, full-stack, microservice-migration

## Examples

```
/modernize monolith
/modernize legacy-frontend
/modernize full-stack
/modernize microservice-migration
```

## Workflow Steps

1. **Analysis Phase**: Security audit + dependency analysis
2. **Planning Phase**: Modernization strategy + risk assessment
3. **Implementation Phase**: Safe refactoring + performance optimization
4. **Validation Phase**: Comprehensive testing + quality verification
5. **Documentation Phase**: Updated docs + architectural decisions
6. **Deployment Phase**: CI/CD setup + monitoring integration

## Use Cases

- **Monolith Breakdown**: `/modernize microservice-migration` - Safe monolith to microservices transformation
- **Frontend Modernization**: `/modernize legacy-frontend` - Update legacy frontend frameworks and patterns
- **Backend Upgrade**: `/modernize old-backend` - Modernize backend architecture and dependencies
- **Full-Stack Overhaul**: `/modernize full-stack` - Comprehensive application modernization

## Estimated Timeline

- **Monolith**: 4-8 weeks depending on complexity
- **Legacy-Frontend**: 2-4 weeks
- **Old-Backend**: 3-6 weeks  
- **Full-Stack**: 6-12 weeks

## Related Prompts

- `prompts/02-code-analysis/security-quality-audit.md`
- `prompts/03-refactoring/codebase-modernization.md`
- `prompts/04-testing/test-suite-generation.md`
- `prompts/05-documentation/documentation-generator.md`

```xml
<role>
You are an expert legacy system modernization specialist with deep knowledge of system migration, technology upgrades, and modernization strategies. You specialize in comprehensive legacy system transformation.
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
