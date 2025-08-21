<p align="center">
  <img src="docs/assets/banner.svg" width="720" height="120" alt="ccprompts banner" />
</p>

<div align="center">

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  [![Sourcery](https://img.shields.io/badge/Sourcery-enabled-brightgreen)](https://sourcery.ai)

</div>

# ccprompts – claude code command collection

**ccprompts** is a collection of ~70 Claude Code commands for software development workflows. Commands include safety validation and can be used directly with Claude Code or adapted for specific needs.

> **Development Notice**: This repository is under active development. Commands may contain bugs,
> breaking changes can occur between versions, and the structure may evolve. Use with caution in
> production environments.

---

## What's included

**~70 Commands Across 12 Phases:**

### **Phase 00-08: Core Development (35 commands)**

- **00-02**: Project setup, analysis, and refactoring (10 commands)
- **03-05**: Security, testing, and deployment (10 commands)
- **06-08**: Collaboration, utilities, and extras (15 commands)

### **Phase 09: Agentic Capabilities (12 commands)**

- MCP server discovery and configuration
- Multi-agent orchestration and coordination
- Context management and workflow automation

### **Phase 10: AI-Native Development (10 commands)**

- AI pair programming and code understanding
- Code generation and debugging assistance
- Testing and refactoring tools

### **Phase 11: Enterprise Scale (8 commands)**

- Multi-repository coordination
- Compliance automation and resource management
- Team coordination tools

**Features:**

- ~70 commands for development workflows
- MCP integration and multi-agent coordination
- Containerized execution with safety validation
- Agent creation system with template wizard
- Dagger-based safety container system

---

## Quick start

```bash
# Clone
git clone https://github.com/ursisterbtw/ccprompts.git
cd ccprompts

# Validate all commands
npm ci
npm run validate

# Browse available commands
ls .claude/commands/*/*.md | less
```

### Adding a new command

1. Copy an existing command from `.claude/commands/` to your desired phase folder.
2. Update the structure and content for your specific use case.
3. Include safety validation steps.
4. Run `npm run validate` before committing.

### Creating specialized agents

The repository includes an agent creation system using `templates/SUB_AGENT_TEMPLATE.md`:

1. Use the `agent-template-wizard` agent to create new specialized agents
2. Provide domain expertise and specific capabilities needed
3. Wizard fills template placeholders with consistent structure
4. Generated agents follow 7-step methodology with proper categorization
5. Agents include examples, color coding, and validation approaches

The template system ensures consistent agent structure while allowing domain-specific customization.

---

## Repository layout

```text
.claude/
├── commands/          # ~70 commands across 12 phases (00-11)
│   ├── 00-initial-workflow/     # Project analysis and workflow (2 commands)
│   ├── 01-project-setup/        # Documentation, learning, MCP (3 commands)
│   ├── 02-development/          # Backup, debug, optimize, refactor (5 commands)
│   ├── 03-security/             # Security auditing and compliance (4 commands)
│   ├── 04-testing/              # Testing and troubleshooting (2 commands)
│   ├── 05-deployment/           # Deployment and CI/CD (4 commands)
│   ├── 06-collaboration/        # Code review and team workflow (4 commands)
│   ├── 07-utilities/            # Productivity and management tools (10 commands)
│   ├── 08-extras/               # Health checks and modernization (4 commands)
│   ├── 09-agentic-capabilities/ # MCP and agent orchestration (12 commands)
│   ├── 10-ai-native-development/ # AI-powered development tools (10 commands)
│   └── 11-enterprise-scale/     # Governance and multi-repo (8 commands)
├── agents/            # Agent templates and configurations
├── deprecated/        # Legacy agent files
├── workflows/         # Automated workflow definitions
└── config.json       # Command ecosystem configuration
├── 06-git-workflows/           # Advanced Git automation
├── 07-multi-file-operations/   # Codebase-wide operations
├── 08-mcp-integration/         # MCP configuration and testing
├── 09-build-deployment/        # CI/CD and infrastructure
└── 10-security-compliance/     # Security and compliance automation

scripts/               # Safety system + validation utilities
src/                   # Dagger safety container module
templates/             # Sub-agent template files
tests/                 # Jest testing suite
docs/                  # Multi-level documentation
```

---

## Usage Examples

### Browse and use commands

```bash
# Explore the command ecosystem
cat .claude/commands/09-agentic-capabilities/mcp-discover.md
cat .claude/commands/10-ai-native-development/ai-pair-program.md
cat .claude/commands/11-enterprise-scale/governance.md

# Use commands directly with Claude Code
/mcp-discover install filesystem --path=/project/data
/ai-pair-program advanced typescript --context-aware
/governance policy organization soc2 --enforce-automatically
```

### Safe command execution

```bash
# Install Dagger (one-time setup)
curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=18.12 sh

# Run potentially dangerous commands safely
./scripts/safe-run.sh "npm install"
./scripts/quick-safe.sh curl-install "curl unknown-site.com/install.sh | bash"

# Test mode to preview actions
./scripts/safe-run.sh "rm -rf /tmp/test" --test
```

**See [SAFETY.md](SAFETY.md) for safety system documentation.**

---

## Community & Support

- [Open an issue](https://github.com/ursisterbtw/ccprompts/issues) for bugs, feature requests, or questions
- Start a discussion by opening an issue for ideas and feedback
- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

---

## Contributing

Pull requests are welcome. Please:

1. Run the validator and ensure no errors.
2. Follow conventional commit messages (`feat: …`, `fix: …`, etc.).
3. Keep commands clear and focused—avoid unnecessary complexity.

---

## License

MIT. See [LICENSE](LICENSE) for details.

---
