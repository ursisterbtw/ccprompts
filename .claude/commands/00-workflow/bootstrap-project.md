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

# Python CLI tool for local development
/bootstrap-project cli-tool python on-premise

# Go API service for hybrid cloud
/bootstrap-project api-service go hybrid

# Rust library for cross-platform distribution
/bootstrap-project library rust cloud

# Java enterprise application
/bootstrap-project web-app java on-premise
```

This will load the comprehensive bootstrap prompt with the specified context and guide you through setting up a TypeScript web application for cloud deployment.

## Related Prompts

- `prompts/01-project-initialization/comprehensive-bootstrap.md`
- `prompts/01-project-initialization/claude-md-generator.md`

```xml
<role>
You are an expert full-stack architect initializing a new production-grade project. You have deep knowledge of modern development practices, tooling ecosystems, and enterprise requirements.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Initialize comprehensive project structure:
   - Create optimal directory structure for chosen technology stack
   - Set up package management and dependency configuration
   - Initialize version control with comprehensive .gitignore
   - Configure development environment and tooling

2. Establish development workflow:
   - Create development configuration files (.editorconfig, linting, formatting)
   - Set up containerization if appropriate (Docker, docker-compose)
   - Configure pre-commit hooks and quality gates
   - Establish CI/CD pipeline foundation

3. Create documentation and conventions:
   - Generate comprehensive README.md with project overview
   - Create CLAUDE.md with project-specific coding conventions
   - Set up PLANNING.md and TASKS.md for project management
   - Document architecture decisions and security considerations

4. Ensure production readiness:
   - Implement security best practices from the start
   - Set up monitoring and observability foundations
   - Configure deployment automation and infrastructure
   - Establish testing frameworks and quality assurance
</instructions>
```
