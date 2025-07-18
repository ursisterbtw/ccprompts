---
description: Intelligent command chaining with natural language workflow automation
allowed-tools: Bash(git:*), Read, Write, Edit, mcp__*
---

# Intelligent Command Chain

## Context Analysis

- Current project: !`pwd | xargs basename`
- Git status: !`git status --porcelain | head -5`
- Recent activity: !`git log --oneline -3`
- Project type: !`ls package.json requirements.txt Cargo.toml pom.xml composer.json 2>/dev/null | head -1`

## Workflow Intelligence

Analyze your request: **$ARGUMENTS**

Based on the context above and your intent, I'll execute an intelligent sequence of commands that:

1. **Understand Intent**: Parse what you want to accomplish
2. **Analyze Context**: Examine current project state and patterns
3. **Plan Sequence**: Determine optimal command chain
4. **Execute Safely**: Run commands with validation and rollback capability
5. **Validate Results**: Ensure each step completed successfully

## Common Workflow Patterns

### Development Workflows

- `new feature authentication` → analyze → bootstrap → security audit → test → document
- `fix bug in user service` → locate → analyze → test → fix → validate
- `deploy to production` → audit → test → backup → deploy → monitor

### Quality Workflows  

- `improve code quality` → analyze → refactor → test → document
- `security hardening` → audit → harden → compliance → validate
- `performance optimization` → profile → optimize → benchmark → validate

### Team Workflows

- `prepare for sprint` → analyze backlog → estimate → plan → communicate
- `release preparation` → test → audit → document → package → notify

## Execution

Tell me what you want to accomplish, and I'll chain the appropriate commands intelligently!
