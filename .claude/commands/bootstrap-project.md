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

## Examples

```bash
# TypeScript web application for cloud deployment
/bootstrap-project web-app typescript cloud

# Rust CLI tool for on-premise deployment
/bootstrap-project cli-tool rust on-premise

# Python library for hybrid deployment
/bootstrap-project library python hybrid

# Go API service for cloud deployment
/bootstrap-project api-service go cloud

# Java web application with enterprise features
/bootstrap-project web-app java cloud
```

The first example will load the comprehensive bootstrap prompt with TypeScript web application context, setting up a modern development environment with React/Next.js, testing framework, CI/CD pipeline, and cloud deployment configuration.

## Related Prompts
- `prompts/01-project-initialization/comprehensive-bootstrap.md`
- `prompts/01-project-initialization/claude-md-generator.md`