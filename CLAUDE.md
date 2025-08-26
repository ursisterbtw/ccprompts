# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ccprompts** is a collection of 70+ Claude Code slash commands for software development workflows, featuring:

- **Comprehensive command ecosystem** across 12 development phases (00-11)
- **Dagger-based safety system** for secure execution of potentially dangerous commands
- **Multi-dimensional validation** with quality, security, and performance metrics
- **Agent template system** for creating specialized sub-agents
- **MCP integration** and workflow automation capabilities

## Essential Commands

### Core Development Commands

```bash
# Validation and quality assurance
bun run validate              # Validates all 70+ commands (expects exact count)
bun run ci                    # Full pipeline: validate + lint + link-check
bun run lint                  # Markdownlint on all documentation
bun run lint:fix              # Auto-fix markdown formatting
bun run check-links           # Validate all markdown links

# Security and safety
bun run security-scan         # Security-focused validation only
bun run safety-validate       # Dagger container safety system
bun run precommit             # Pre-commit validation hooks

# Testing (Jest compatibility issues with Node 24+)
bun run test:jest             # Jest test suite (may fail on newer Node.js)
bun run test:validate         # Command validation only
```

### Safety System Operations

```bash
# Execute dangerous commands safely in Dagger containers
./scripts/safe-run.sh "rm -rf dangerous-path" --test
./scripts/safe-run.sh "npm install untrusted-package" --project-path "/my/project"
./scripts/safe-run.sh "bun install" --project-path "/my/project"

# Quick safety shortcuts
./scripts/quick-safe.sh install    # Safe npm/bun install
./scripts/quick-safe.sh build      # Safe build operations
./scripts/quick-safe.sh rm-rf      # Safe file deletion
```

## Architecture Overview

### Command Organization (12 Phases, 70+ Commands)

```
.claude/commands/
├── 00-initial-workflow/      # Project analysis & intelligent chaining (2)
├── 01-project-setup/         # Documentation, learning, MCP setup (3)
├── 02-development/           # Backup, debug, migrate, optimize, refactor (5)
├── 03-security/              # Security auditing & compliance (4)
├── 04-testing/               # Testing & troubleshooting (2)
├── 05-deployment/            # CI/CD & deployment (4)
├── 06-collaboration/         # Code review & team workflows (4)
├── 07-utilities/             # Development utilities & best practices (6+)
├── 08-extras/                # Health checks & modernization (4)
├── 09-agentic-capabilities/  # MCP & agent orchestration (12)
├── 10-ai-native-development/ # AI-powered development tools (10)
└── 11-enterprise-scale/      # Governance & multi-repo (8)
```

### Core Infrastructure

- **`scripts/validate-commands.js`** - Multi-dimensional validation engine
- **`src/index.ts`** - Dagger TypeScript safety container system
- **`scripts/safety-validator.js`** - Command safety pattern detection
- **`templates/SUB_AGENT_TEMPLATE.md`** - Standardized agent creation template
- **`.claude/settings.json`** - Claude Code permissions and environment config

### Safety Container System (Dagger-Based)

The project uses a sophisticated 3-layer safety system:

1. **Pattern Detection** - Identifies dangerous commands automatically
2. **Container Isolation** - Ubuntu 22.04 containers with resource limits
3. **Rollback Validation** - Comprehensive verification and cleanup

Key safety features:
- Read-only project mounting protects source code
- Automatic container cleanup after execution
- Network restrictions and resource constraints
- 65.7% safety rate across 517+ container validations

## Key Development Patterns

### Command Structure

All commands follow a consistent markdown structure:
- Clear usage examples with `/command-name` syntax
- Comprehensive descriptions with auto-detection capabilities
- Safety measures and verification steps included
- Educational components for learning

### Agent Template System

Creating new agents:
1. Use the `agent-template-wizard` agent
2. Provide domain expertise and capabilities
3. Wizard fills `SUB_AGENT_TEMPLATE.md` placeholders automatically
4. Follows 7-step methodology with proper categorization
5. Color-coded by category (blue=dev, green=ops, yellow=data/AI, etc.)

### Validation Requirements

The system expects exactly 70 commands and validates:
- **Structure**: XML/markdown format compliance
- **Security**: Secret detection, dangerous pattern identification
- **Quality**: Educational value, completeness, examples (scoring rubric)
- **Performance**: <100ms discovery, <2s validation targets
- **Safety**: Dagger container testing with rollback verification

## Technology Stack

### Runtime Requirements
- **Node.js ≥18.0.0** (package.json engine requirement)
- **Dagger ^18.12** for safety container orchestration
- **Jest ^29.7.0** (known compatibility issues with Node 24+)

### Development Tools
- **markdownlint** for documentation quality
- **markdown-link-check** for link validation
- **Custom validators** in `scripts/validators/` directory
- **TypeScript ^5.0.0** for Dagger module development

## Current Quality Metrics

Based on validation system output:
- ✅ **70/70 commands** discovered and validated
- ✅ **95.0% structural** validation success rate
- ❌ **Security score failing** (requires remediation)
- ⚠️  **Quality score 27.1/100** (needs improvement)
- ✅ **Performance targets met** (3ms discovery, 28ms total validation)

## Known Issues & Limitations

1. **Jest Compatibility**: Test suite has issues with Node.js v24+
2. **Security Validation**: Currently failing security checks (19 errors, 41 warnings)
3. **Quality Scoring**: Low educational value scores across commands
4. **Documentation Sync**: Some outdated command counts in documentation

This repository represents a sophisticated, safety-first approach to AI-assisted development with comprehensive validation, containerized execution, and enterprise-grade security features.
