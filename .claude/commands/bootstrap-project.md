# Bootstrap Project Command

This command provides quick access to the comprehensive project bootstrap prompt.

## Usage
```
/bootstrap-project [project-type] [language] [deployment-target]
```

## Description
Initializes a new production-grade project with:
- Project structure and configuration
- Development environment setup
- CI/CD pipeline foundation
- Documentation and conventions
- CLAUDE.md generation

## Parameters
- `project-type`: web-app, cli-tool, library, api-service
- `language`: rust, python, typescript, go, java
- `deployment-target`: cloud, on-premise, hybrid

## Example
```
/bootstrap-project web-app typescript cloud
```

This will load the comprehensive bootstrap prompt with the specified context and guide you through setting up a TypeScript web application for cloud deployment.

## Related Prompts
- `prompts/01-project-initialization/comprehensive-bootstrap.md`
- `prompts/01-project-initialization/claude-md-generator.md`