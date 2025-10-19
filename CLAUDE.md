# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ccprompts** is a collection of 70+ Claude Code slash commands for software development workflows, featuring:

- **Comprehensive command ecosystem** across 12 development phases (00-11)
- **Dagger-based safety system** for secure execution of potentially dangerous commands
- **Multi-dimensional validation** with quality, security, and performance metrics
- **Agent template system** for creating specialized subagents
- **MCP integration** and workflow automation capabilities

## Essential Commands

### Core Development Commands

```bash
# Validation and quality assurance
bun run validate              # Validates all 70+ commands (expects exact count)
bun run test                  # Run Jest tests + validate all commands
bun run ci                    # Full pipeline: validate + lint + link-check

# Single test runs (available due to Jest compatibility with Node <23)
bun run test:jest -- tests/validators/file-utils.test.js
bun run test:jest -- --testNamePattern="specific test name"

# Linting
bun run lint                  # Markdownlint on all documentation
bun run lint:fix              # Auto-fix markdown formatting
bun run check-links           # Validate all markdown links

# Security and safety
bun run security-scan         # Security-focused validation only
bun run safety-validate       # Dagger container safety validation
bun run precommit             # Pre-commit validation hooks
```

### Plugin Development

```bash
bun run validate:plugin       # Validates plugin.json and marketplace configuration
./scripts/test-plugin-local.sh # Test local plugin installation in Claude Code
```

### Safety System Operations

```bash
# Execute dangerous commands safely in Dagger containers
./scripts/safe-run.sh "rm -rf dangerous-path" --test
./scripts/safe-run.sh "bun add untrusted-package" --project-path "/my/project"

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
├── 07-utilities/             # Development utilities & best practices (7)
├── 08-extras/                # Health checks & modernization (4)
├── 09-agentic-capabilities/  # MCP & agent orchestration (12)
├── 10-ai-native-development/ # AI-powered development tools (10)
└── 11-enterprise-scale/      # Governance & multi-repo (8)
```

Each phase folder contains markdown files following Claude Code slash command format.

### Specialized Agents

Located in `.claude/agents/`, these define domain-specific subagent capabilities:

- **rust-expert** - Ownership, lifetimes, systems programming
- **python-expert** - Modern Python, decorators, async patterns
- **golang-pro** - Goroutines, channels, concurrent systems
- **javascript-expert** - ES6+, async/await, DOM optimization
- **bash-shell-scripting** - Shell automation, DevOps scripts
- **fastapi-optimizer** - Async patterns, performance tuning
- **documentation-writer** - Technical writing, API docs
- **performance-optimizer** - System-wide performance analysis
- **systems-architect** - Architecture patterns, scalability
- **agent-template-wizard** - Creates new agents from SUBAGENT_TEMPLATE.md

### Core Infrastructure

- **`scripts/validate-commands.js`** - Multi-dimensional validation engine with scoring
- **`scripts/validate-plugin.js`** - Plugin manifest and marketplace validation
- **`scripts/safety-validator.js`** - Command safety pattern detection
- **`scripts/config/safety-patterns.js`** - Dangerous command patterns definition
- **`lib/fsUtils.js`**, **`lib/gitUtils.js`**, **`lib/pathUtils.js`** - Utility modules
- **`templates/SUBAGENT_TEMPLATE.md`** - Standardized 7-step agent creation template
- **`tests/`** - Jest test suite (Node.js <23 only)
- **`.claude/settings.json`** - Claude Code permissions and environment config
- **`.claude-plugin/plugin.json`** - Plugin manifest (version, agents, phases)

### Validation System (Multi-Dimensional)

The validation engine validates across four dimensions:

1. **Structural** - Markdown format, frontmatter, section completeness (95%+ target)
2. **Security** - Secret detection, dangerous pattern identification, safety compliance
3. **Quality** - Educational value, example completeness, clarity scoring
4. **Performance** - Discovery <100ms, total validation <2s (currently 3ms + 28ms)

Each command receives a numeric `_score` field (0-100) reflecting validation pass rate across these dimensions. Commands with lower scores may pass validation but flag areas for improvement.

Validation expects exactly 70 command files. Count mismatch triggers CI failure.

### Safety Container System (Dagger-Based)

The project uses a 3-layer safety system for executing potentially dangerous commands:

1. **Pattern Detection** - Identifies dangerous commands automatically via regex patterns
2. **Container Isolation** - Ubuntu 22.04 containers with resource limits, read-only project mounts
3. **Rollback Validation** - Verifies execution safety before allowing persistence

Key features:

- Commands marked as "dangerous" execute in isolated Dagger containers
- Network restrictions and CPU/memory caps enforced
- Automatic cleanup and comprehensive audit logging
- 65.7% safety validation pass rate across 517+ test cases

## Key Development Patterns

### Command File Structure

All commands are markdown files in `.claude/commands/NN-phase-name/` with consistent structure:

1. **Title** - Command name as H1 heading
2. **Short description** - One-line summary of functionality
3. **Usage section** - Exact `/command-name` syntax and examples
4. **Description section** - Detailed explanation with capabilities
5. **Example scenarios** - Real-world use cases
6. **Safety considerations** - Warnings, prerequisites, validation steps
7. **Related commands** - Cross-references to complementary commands

Example: `/analyze-project` auto-detects project type, stack, architecture, and suggests relevant prompts.

### Adding New Commands

1. Create markdown file in appropriate phase directory (e.g., `.claude/commands/02-development/my-command.md`)
2. Follow the command structure template (see existing commands)
3. Include safety validation steps and examples
4. Run `bun run validate` to ensure 70+ count is maintained and all checks pass
5. Run `bun run lint:fix` to auto-format
6. Commit with conventional message: `feat(commands): add my-command for phase 02`

### Agent Template System

Creating new agents uses the wizard workflow:

1. Request `/agent-template-wizard` with domain expertise description
2. Wizard prompts for: category (blue=dev/green=ops/yellow=data/red=security), capabilities, tools
3. Fills `templates/SUBAGENT_TEMPLATE.md` with 7-step methodology
4. Agent placed in `.claude/agents/domain-name.md`
5. Color-coded frontmatter ensures consistent categorization
6. Generated agents become available for use in Claude Code

## Technology Stack & Environment

### Runtime Requirements

- **Node.js >=18.0.0 <23.0.0** - Enforced in package.json engines; Jest fails on Node 24+
- **Bun 1.1.34** - Package manager, version pinned in `.bun-version` and package.json
- **Dagger >=0.18.16** - For safe container orchestration (optional but recommended)

### Development Tools

- **Jest ^29.7.0** - Testing framework (compatibility issues with Node 24+)
- **markdownlint 0.38.0** - Markdown linting
- **markdown-link-check 3.13.7** - Link validation in markdown
- **markdownlint-cli 0.45.0** - CLI for lint:fix

### Development Workflow Notes

- Bun used throughout (faster resolution, deterministic lockfiles)
- All TypeScript/JavaScript follows 4-space indentation (EditorConfig)
- Variable naming: camelCase; files: kebab-case; classes: PascalCase
- JSDoc comments required for all public methods
- Line length: 120 characters maximum (markdown and code)
- Final newlines: Not included in files

### Test Structure & Conventions

Tests are located in `tests/` and organized by validator component:
- `tests/validators/` - Jest test files for validation modules
- Each test file mirrors its corresponding `scripts/validators/` module name
- Tests validate markdown parsing, frontmatter extraction, and scoring logic
- Run specific tests via: `bun run test:jest -- tests/validators/file-utils.test.js`

The validation system itself (`scripts/validate-commands.js`) serves as the primary integration test, checking all 70 commands comprehensively.

## Plugin Architecture

### Plugin Manifest (`.claude-plugin/plugin.json`)

Defines plugin metadata, 12 phases with command counts, 10 agents, permissions, and environment config. Updates when adding commands (ensure phase count matches actual file count).

### Team Installation

Add to project `.claude/settings.json` for automatic team-wide installation:

```json
{
  "pluginMarketplaces": ["ursisterbtw/ccprompts"],
  "plugins": ["ccprompts@ursisterbtw"]
}
```

Permissions configured to allow development tools (git, npm, pip, cargo, file operations) while denying destructive operations (rm -rf, sudo).

## Common Development Tasks

### Running Validation

```bash
# Full validation with all dimensions
bun run validate

# Security checks only
bun run security-scan

# Plugin validation
bun run validate:plugin

# Lint check and fix
bun run lint
bun run lint:fix
```

### Testing Workflow

```bash
# Complete test suite (Jest + validation)
bun run test

# Jest tests only
bun run test:jest

# Specific test file
bun run test:jest -- tests/validators/file-utils.test.js

# Tests matching pattern
bun run test:jest -- --testNamePattern="validation"
```

### Pre-Commit Workflow

```bash
# Validate before committing
bun run precommit

# Full CI simulation
bun run ci
```

## Known Issues & Constraints

1. **Node.js Compatibility** - Jest test suite incompatible with Node 24+ due to dependency issues
2. **Security Validation** - Currently reports warnings requiring manual remediation
3. **Quality Scoring** - Educational content scoring needs improvement across commands
4. **Plugin Count Sync** - Manual update required when command count changes (update `plugin.json` phases)
5. **Exact Command Count** - Validation requires exactly 70 commands; adding/removing requires updating both the command file count and `plugin.json` phase counts

## Troubleshooting Common Development Issues

### Validation fails with "Expected 70 commands, found X"

This occurs when commands are added or removed. Fix by:
1. Counting actual command files: `find .claude/commands -name "*.md" | wc -l`
2. If count doesn't match 70, verify all files are properly placed in phase directories
3. Update phase counts in `.claude-plugin/plugin.json` if adding new commands
4. Run `bun run validate` to verify the fix

### Jest tests fail on Node 24+

The project pins Node <23.0.0 in `package.json` engines. Use Node 22.x LTS:
```bash
node --version  # Should be v22.x.x
nvm use 22      # If using nvm
mise use node@22  # If using mise
```

### Markdown linting errors

Run `bun run lint:fix` to automatically fix formatting issues:
```bash
bun run lint:fix
```

### Plugin marketplace validation fails

Check `.claude-plugin/plugin.json` is in sync:
- Each phase count matches actual files in `.claude/commands/NN-phase-name/`
- All 10 agents are listed and correspond to actual files in `.claude/agents/`
- Version string follows semantic versioning

Run `bun run validate:plugin` to validate the manifest structure.

## Quality Gates for Commits

Before committing changes:

- [ ] `bun run validate` passes (70 commands found, no structural errors)
- [ ] `bun run lint` passes (no markdown style violations)
- [ ] `bun run check-links` passes (all links valid)
- [ ] `bun run test` passes if test files modified (Jest tests + validation)
- [ ] `bun run security-scan` checked for new security warnings
- [ ] Conventional commit message used (`feat:`, `fix:`, `docs:`, etc.)
- [ ] If adding/removing commands, `.claude-plugin/plugin.json` phases updated

This repository represents a sophisticated, safety-first approach to AI-assisted development with comprehensive validation, containerized execution, and enterprise-grade security features.
