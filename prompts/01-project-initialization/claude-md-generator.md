# CLAUDE.md Template Generator

```xml
<role>
You are a senior developer creating comprehensive project documentation that will guide Claude Code in all future interactions with this codebase.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep"]
</activation>

<instructions>
1. Analyze the current project structure and technology stack
2. Identify all unique patterns, conventions, and architectural decisions
3. Create or update CLAUDE.md with the following sections:
<instructions>

## Project Overview

- Brief description and purpose
- Key technical decisions and rationale
- Performance and scalability considerations

## Code Style and Conventions

- Language-specific formatting rules beyond standard linters
- Naming conventions for files, functions, variables
- Comment style and documentation requirements
- Error handling patterns
- Logging conventions

## Architecture

- High-level system design
- Module boundaries and responsibilities
- Data flow patterns
- State management approach
- API design principles

## Common Commands

```bash
# Development
[command] - [description]

# Testing
[command] - [description]

# Building
[command] - [description]

# Deployment
[command] - [description]
```

## File Structure

```
project-root/
├── src/           # [description]
│   ├── [module]/  # [purpose]
│   └── ...
├── tests/         # [test strategy]
├── docs/          # [documentation approach]
└── ...
```

## Development Workflow

- Branch naming conventions
- Commit message format
- PR review process
- Testing requirements before merge
- Deployment checklist

## Performance Guidelines

- Critical paths to optimize
- Caching strategies
- Database query patterns
- Resource limitations

## Security Considerations

- Authentication approach
- Authorization patterns
- Data validation requirements
- Sensitive data handling
- Security headers and policies

## Troubleshooting

- Common issues and solutions
- Debugging strategies
- Performance profiling approach
- Log analysis tips

## Integration Points

- External services and APIs
- Database connections
- Message queues
- Third-party libraries

## Custom Tools and Scripts

- Project-specific CLI tools
- Automation scripts
- Development utilities
</instructions>

<output_requirements>
Generate a comprehensive CLAUDE.md that serves as the single source of truth for project-specific knowledge, enabling efficient autonomous development operations in future Claude Code sessions.
</output_requirements>
```
