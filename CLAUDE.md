# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the **most comprehensive collection of Claude Code-specific developer commands and prompts** ever created. The project delivers **39 production-ready commands** across **9 organized directories**

## Development Commands

### Node.js/JavaScript Development

```bash
# Install dependencies
npm ci                          # Clean install from lock file

# Validation and Testing
npm run validate                # Validate all prompts (expected count: 39)
npm test                        # Same as validate
npm run security-scan           # Run security-only validation

# Linting and Code Quality
npm run lint                    # Check markdown formatting
npm run lint:fix                # Auto-fix markdown formatting issues
npm run check-links             # Verify all markdown links are valid

# CI/CD
npm run ci                      # Run full CI pipeline (validate + lint + check-links)
npm run precommit               # Pre-commit hook (runs validate)
```

### Python Development (beta-prompts)

```bash
# Navigate to beta-prompts
cd beta-prompts

# Install with development dependencies
pip install -e ".[dev,test,docs,viz,interactive]"

# Testing
pytest                          # Run all tests
pytest -xvs                     # Verbose with stop on first failure
pytest --cov=beta_prompts       # With coverage report
pytest -m "not slow"            # Skip slow tests

# Code Quality
ruff check .                    # Fast linting
ruff check . --fix              # Auto-fix linting issues
black .                         # Format code
mypy .                          # Type checking

# Documentation
sphinx-build -b html docs docs/_build/html  # Build documentation
```

### Container Safety (Python Execution)

```bash
# Safe Python execution in containers
./scripts/quick-safe.sh <script.py>    # Quick containerized run
./scripts/safe-run.sh <script.py>      # Full safety container
```

## High-Level Architecture

### Dual-Language Ecosystem

The project operates as a **dual-language system**:

1. **JavaScript/Node.js Layer**: Handles all validation, CI/CD, and markdown processing
   - Custom validators in `scripts/validators/` ensure prompt quality
   - Markdown linting and link checking for documentation integrity
   - Security scanning for sensitive information

2. **Python Layer**: Powers the prompt optimization and research tools
   - Advanced prompt engineering in `beta-prompts/beta_prompts/`
   - Real Claude API integration for testing and optimization
   - Statistical analysis and visualization capabilities
   - Containerized execution via Dagger for safety

### Command Distribution Architecture

The **39 commands** are strategically distributed across **9 directories** based on workflow phases:

- **Initial Workflow** (00): Entry points for complex automation chains
- **Project Setup** (01): Foundation-building commands
- **Development** (02): Core coding workflow commands
- **Security** (03): Security hardening and compliance
- **Testing** (04): Quality assurance automation
- **Deployment** (05): Release and deployment management
- **Collaboration** (06): Team coordination tools
- **Utilities** (07): Discovery and management commands
- **Extras** (08): Specialized domain-specific commands

### Prompt Template Architecture

All prompts follow a strict **XML-structured format**:

```xml
<role>System role definition</role>
<activation>User trigger phrase</activation>
<instructions>
  Multi-agent coordinated instructions
  with safety checks and rollback procedures
</instructions>
<output_format>Expected deliverables</output_format>
```

This enables:

- Consistent validation via automated tooling
- Easy parsing for integration with other systems
- Clear separation of concerns
- Machine-readable prompt metadata

### Safety and Compliance Architecture

1. **Containerized Execution**: Python code runs in Dagger containers
2. **Multi-Level Validation**: Structure, security, quality checks
3. **Audit Trails**: All commands maintain operation logs
4. **Rollback Procedures**: Every destructive operation is reversible
5. **Compliance Automation**: Built-in SOC2, GDPR, HIPAA support

## Key Commands and Workflows

The repository provides 39 slash commands in `.claude/commands/` organized by workflow phase. Key commands include:

- `/analyze-project` - Comprehensive project analysis
- `/bootstrap-project` - Project initialization
- `/pre-commit` - Quality gates and validation
- `/code-review` - AI-powered code analysis
- `/test` - Automated test generation
- `/list-prompts` - Command discovery
- `/workflow-builder` - Custom workflow creation

## Critical Development Notes

### Validation System

The project uses a sophisticated JavaScript-based validation system that checks:

- **Prompt Structure**: XML format compliance, required sections
- **Security**: No exposed secrets, API keys, or sensitive data
- **Quality**: Scoring based on clarity, specificity, and safety
- **Command Count**: Expected 38 commands (enforced in CI)

Run `npm run validate` before any commit to ensure compliance.

### Beta-Prompts Module

The `beta-prompts/` directory contains advanced Python tools for prompt optimization:

- Real Claude API integration for testing
- Statistical analysis of prompt performance
- Interactive dashboards for optimization
- Template generation framework

These tools require an Anthropic API key and should be run in containerized environments for safety.

## Workflow Integration

Commands can be chained for complex operations. Examples:

```bash
# Project setup workflow
/bootstrap-project → /harden → /setup-ci → /validate-environment

# Security audit workflow
/audit-security → /pre-commit → /code-review → /comply

# Development workflow
/analyze-project → /refactor → /test → /code-review
```

Workflows are defined in `.claude/workflows/` as YAML files.

## Important Implementation Details

### Command Structure

All commands follow XML format with required sections:

- `<role>` - System role definition
- `<activation>` - User trigger phrase
- `<instructions>` - Multi-step instructions with safety checks
- `<output_format>` - Expected deliverables

### Contributing

When adding new prompts or commands:

1. Follow the XML structure template
2. Include rollback procedures for destructive operations
3. Add comprehensive error handling
4. Run `npm run validate` before committing
5. Update expected command count in package.json if adding commands

### Python Module Usage

The `beta-prompts` module provides:

- `improvement_engine.py` - Optimize existing prompts
- `generation_system.py` - Generate new prompts from templates
- `scorer.py` - Score prompt quality and effectiveness
- `interactive_dashboard.py` - Analyze prompt performance

Requires `ANTHROPIC_API_KEY` environment variable for API features.

## Related Documentation

- **[.claude/README.md](.claude/README.md)** - Command usage examples
- **[prompts/INDEX.md](prompts/INDEX.md)** - Prompt categories
- **[beta-prompts/README.md](beta-prompts/README.md)** - Python tools guide

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
