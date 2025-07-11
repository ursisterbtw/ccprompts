<p align="center">
  <img src="docs/assets/banner.svg" width="720" height="120" alt="ccprompts banner: practical Claude code commands and prompts" />
</p>

<div align="center">

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  [![Sourcery](https://img.shields.io/badge/Sourcery-enabled-brightgreen)](https://sourcery.ai)

</div>

# ccprompts – practical claude code commands and prompts

**ccprompts** is a comprehensive collection of Claude Code-specific developer commands and prompts. The project delivers **39 production-ready commands** across **9 organized directories**, plus prompt optimization tools for intelligent automation, continuous learning, and enterprise-grade quality assurance.

---

## Key Features

- **39 slash commands** organized by workflow phase for Claude Code
- **10 prompt categories** covering all development aspects
- **Python optimization tools** for prompt engineering and analysis
- **Enterprise validation** with security and quality checks
- **Zero vendor lock-in** – Pure text-based, freely forkable

---

## Quick start

### Initial Setup

```bash
# Clone repository
git clone https://github.com/ursisterbtw/ccprompts.git
cd ccprompts

# Install Node.js dependencies
npm ci

# Validate prompt collection
npm run validate
```

### Using Slash Commands

```bash
# Browse available commands
ls .claude/commands/*/*.md

# Copy a command to use in Claude Code
cat .claude/commands/01-project-setup/bootstrap-project.md

# Common workflow: project initialization
cat .claude/commands/00-initial-workflow/project-init.md
```

### Using Prompt Templates

```bash
# Browse prompt categories
ls prompts/*/

# View a specific prompt
cat prompts/02-code-analysis/security-quality-audit.md
```

### Beta-Prompts Setup (Optional)

```bash
cd beta-prompts

# Install with safety container support
pip install -e ".[dev,test]"

# Run optimization tools safely
./scripts/quick-safe.sh improvement
```

### Adding New Prompts

1. Copy a template: `prompts/01-project-initialization/claude-md-generator.md`
2. Follow the XML structure:

   ```xml
   <role>System role definition</role>
   <activation>User trigger phrase</activation>
   <instructions>Step-by-step instructions</instructions>
   <output_format>Expected deliverables</output_format>
   ```

3. Run `npm run validate` to ensure compliance
4. Update command count in `package.json` if adding to `.claude/commands/`

---

## Development Setup

### Node.js Commands

```bash
npm run validate      # Validate all prompts (expected: 39)
npm run lint          # Check markdown formatting
npm run lint:fix      # Auto-fix formatting issues
npm run check-links   # Verify all links are valid
npm run security-scan # Security-only validation
npm run ci            # Full CI pipeline
```

### Python Development

```bash
cd beta-prompts
pip install -e ".[dev,test,docs]"

# Testing
pytest                        # Run all tests
pytest --cov=beta_prompts     # With coverage

# Code quality
ruff check . --fix            # Lint and auto-fix
black .                       # Format code
mypy .                        # Type checking
```

---

## Repository Structure

```text
prompts/               # 10 prompt template categories
├── 01-project-initialization/   # Bootstrap, CLAUDE.md generation
├── 02-code-analysis/           # Security audits, dependency analysis
├── 03-refactoring/             # Code modernization, optimization
├── 04-testing/                 # Test generation, mutation testing
├── 05-documentation/           # Auto-docs, knowledge bases
├── 06-git-workflows/           # Git automation, repo optimization
├── 07-multi-file-operations/   # Cross-codebase refactoring
├── 08-mcp-integration/         # MCP server configuration
├── 09-build-deployment/        # CI/CD, Infrastructure as Code
└── 10-security-compliance/     # Security hardening, compliance

.claude/               # 39 slash commands for Claude Code
├── commands/          # Organized by workflow phase (00-08)
├── workflows/         # YAML workflow definitions
└── config.json        # Command configuration

beta-prompts/          # Python-based optimization tools
├── beta_prompts/      # Core Python modules
├── scripts/           # Safety execution scripts
└── dagger-src/        # Container safety system

scripts/               # JavaScript validation system
├── validators/        # Structure, security, quality checks
└── validate-prompts.js # Main validation entry point

docs/                  # Documentation
├── CC-SDK.md          # Claude Code SDK reference
└── assets/            # Documentation resources
```

---

## Architecture Overview

### Dual-Language Ecosystem

The project uses two complementary technology stacks:

1. **JavaScript/Node.js** - Validation and tooling
   - Markdown validation and linting
   - Security scanning for sensitive data
   - Quality scoring and structure validation
   - CI/CD pipeline automation

2. **Python** - Prompt optimization and research
   - Real Claude API integration
   - Statistical analysis and scoring
   - Template generation and management
   - Containerized execution for safety

### Command Organization

The 39 slash commands are organized by workflow phase:

- **Initial (00)**: Entry points for automation chains
- **Setup (01)**: Project initialization and configuration
- **Development (02)**: Core development workflows
- **Security (03)**: Security hardening and compliance
- **Testing (04)**: Quality assurance automation
- **Deployment (05)**: Release and deployment management
- **Collaboration (06)**: Team coordination tools
- **Utilities (07)**: Discovery and analysis commands
- **Extras (08)**: Specialized domain commands

---

## Usage Examples

### Common Workflows

```bash
# Project initialization workflow
/project-init → /bootstrap-project → /setup-ci → /validate-environment

# Security audit workflow
/audit-security → /pre-commit → /code-review → /comply

# Development workflow
/analyze-project → /refactor → /test → /code-review
```

### Using Commands

```bash
# List all available commands
/list-prompts

# Search for specific functionality
/search-prompts "security"

# Build custom workflows
/workflow-builder
```

### Prompt Optimization

```bash
cd beta-prompts

# Optimize an existing prompt
./scripts/quick-safe.sh improvement

# Generate new prompts from templates
./scripts/quick-safe.sh generation

# Run full optimization suite
./scripts/quick-safe.sh optimization
```


---

## Safety & Validation

### Validation System

All prompts and commands undergo multi-level validation:

- **Structure**: XML format compliance, required sections
- **Security**: No exposed secrets or sensitive data
- **Quality**: Scoring based on clarity and specificity
- **Count**: Expected 38 commands (CI enforced)

Always run `npm run validate` before committing.

### Container Safety (Beta-Prompts)

Python code execution is containerized for safety:

```bash
# Never run Python directly
❌ python script.py

# Always use safety containers
✅ ./scripts/quick-safe.sh python script.py
```

### Contributing Standards

1. Follow XML structure for all prompts
2. Include rollback procedures for destructive operations
3. Add comprehensive error handling
4. Update command count if adding new commands
5. Keep prompts focused and actionable

---

## Community & Support

- [Open an issue](https://github.com/ursisterbtw/ccprompts/issues) for bugs, feature requests, or questions
- [Start a discussion](https://github.com/ursisterbtw/ccprompts/discussions) for ideas and feedback
- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

---

## Getting Started with Commands

1. **Discover**: Use `/list-prompts` to browse available commands
2. **Analyze**: Run `/analyze-project` to understand your codebase
3. **Initialize**: Use `/bootstrap-project` for new projects
4. **Secure**: Apply `/harden` and `/audit-security` early
5. **Automate**: Chain commands with `/workflow-builder`

For detailed command documentation, see [.claude/README.md](.claude/README.md).

---

## Related Documentation

- **[CLAUDE.md](CLAUDE.md)** - Detailed guidance for Claude Code instances
- **[.claude/README.md](.claude/README.md)** - Complete command reference
- **[prompts/INDEX.md](prompts/INDEX.md)** - Prompt category descriptions
- **[beta-prompts/README.md](beta-prompts/README.md)** - Optimization tools guide
- **[docs/CC-SDK.md](docs/CC-SDK.md)** - Claude Code SDK reference

---

## License

MIT. See [LICENSE](LICENSE) for details.

---
