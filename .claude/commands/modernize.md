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