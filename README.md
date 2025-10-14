<p align="center">
  <img src="docs/assets/banner.svg" width="720" height="120" alt="ccprompts banner" />
</p>

<div align="center">

  [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ursisterbtw/ccprompts)
  
</div>

# ccprompts – claude code command collection

**ccprompts** is a collection of ~70 Claude Code commands for software development workflows with agent generation capabilities baked in. Commands include safety validation and can be used directly with Claude Code or adapted for specific needs. The agent template system provides a wizard for creating specialized subagents (e.g., security auditors, systems architects) with standardized formatting and proper tool access. For more info on subagents, see [subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents).

> Development Notice: This repository is under active development. Commands may contain bugs, breaking changes can occur between versions, and the structure may evolve. Use with caution in production environments.

## Quick start

### 🚀 Plugin Installation (Recommended)

Install as a Claude Code plugin for the easiest experience:

```bash
# 1. Add local marketplace
/plugin marketplace add ./test-marketplace

# 2. Install plugin
/plugin install ccprompts@test-marketplace

# 3. Restart Claude Code
```

> 📖 **Detailed Plugin Guide**: See [PLUGIN_INSTALLATION.md](PLUGIN_INSTALLATION.md) for complete setup and usage instructions.

### 📦 Manual Installation

Install Dagger (not *explicitly* required, but recommended to enable containerized command execution):

**Linux:**

```bash
curl -fsSL https://dl.dagger.io/dagger/install.sh | BIN_DIR=$HOME/.local/bin sh
```

**macOS:**

```bash
brew install dagger/tap/dagger
```

**Windows:**

```powershell
winget install Dagger.Cli
```

```fish
git clone https://github.com/ursisterbtw/ccprompts.git; and cd ccprompts; and bun i; and bun run validate
```

### Adding a new command

1. Copy an existing command from `.claude/commands/` to your desired phase folder.
2. Update the structure and content for your specific use case.
3. Include safety validation steps.
4. Run `bun run validate` before committing.

### Creating specialized agents

The repository includes an agent creation system using [`templates/SUBAGENT_TEMPLATE.md`](templates/SUBAGENT_TEMPLATE.md):

1. Use the [`agent-template-wizard`](.claude/agents/agent-template-wizard.md) agent to create new specialized agents
2. Provide domain expertise and specific capabilities needed
3. Wizard fills template placeholders with consistent structure
4. Generated agents follow 7-step methodology with proper categorization
5. Agents include examples, color coding, and validation approaches

The template system ensures consistent agent structure while allowing domain-specific customization.

---

## Repository layout

### Plugin Structure
```text
.claude-plugin/        # Plugin configuration
└── plugin.json        # Plugin metadata and capabilities

commands/              # ~70 commands across 12 phases (00-11)
├── 00-initial-workflow/     # Project analysis and workflow (2 commands)
├── 01-project-setup/        # Documentation, learning, MCP (3 commands)
├── 02-development/          # Backup, debug, optimize, refactor (5 commands)
├── 03-security/             # Security auditing and compliance (4 commands)
├── 04-testing/              # Testing and troubleshooting (2 commands)
├── 05-deployment/           # Deployment and CI/CD (4 commands)
├── 06-collaboration/        # Code review and team workflow (4 commands)
├── 07-utilities/            # Productivity and management tools (10 commands)
├── 08-extras/               # Health checks and modernization (4 commands)
├── 09-agentic-capabilities/ # MCP and agent orchestration (12 commands)
├── 10-ai-native-development/ # AI-powered development tools (10 commands)
└── 11-enterprise-scale/     # Governance and multi-repo (8 commands)

agents/               # 10 specialized agents for domain expertise
├── agent-template-wizard.md
├── bash-shell-scripting.md
├── documentation-writer.md
├── fastapi-optimizer.md
├── golang-pro.md
├── javascript-expert.md
├── performance-optimizer.md
├── python-pro.md
├── rust-expert.md
└── systems-architect.md

.claude/               # Internal configuration (preserved for compatibility)
├── commands/          # Original command location
├── agents/            # Original agent location
├── workflows/         # Automated workflow definitions
├── README.md
├── settings.json
└── command-registry.json

scripts/              # Safety system + validation utilities
templates/            # subagent template files
tests/                # Jest testing suite
docs/                 # Multi-level documentation
```

---

## Usage Examples

### Plugin Usage (Recommended)
```bash
# Commands available immediately after plugin installation
/mcp-discover install filesystem --path=/project/data
/ai-pair-program advanced typescript --context-aware
/governance policy organization soc2 --enforce-automatically
/analyze-project
/intelligent-chain
/security-audit
```

### Manual Usage
```bash
cat .claude/commands/09-agentic-capabilities/mcp-discover.md
cat .claude/commands/10-ai-native-development/ai-pair-program.md
cat .claude/commands/11-enterprise-scale/governance.md
```

### Safe command execution

```bash
./scripts/safe-run.sh "command"
```

See [SAFETY.md](SAFETY.md) for full safety system documentation.

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
