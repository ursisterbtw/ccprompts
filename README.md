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

## Why use this repo?

- **Comprehensive Command Ecosystem** – 39 production-ready commands across 9 directories covering the complete development lifecycle
- **Prompt Optimization Tools** – Python modules for intelligent prompt optimization, scoring, and validation
- **Enterprise-Grade Quality** – Built-in security scanning, compliance checking, and audit trails
- **Learning-Integrated Automation** – Every command teaches while it automates, transforming routine tasks into skill development
- **Zero vendor lock-in** – Pure text-based prompts + tooling, freely forkable and adaptable

---

## Quick start

```bash
# Clone
git clone https://github.com/ursisterbtw/ccprompts.git
cd ccprompts

# Validate all prompts
npm ci
npm run validate

# Browse available prompts
ls prompts/*/*.md | less
```

### Adding a new prompt

1. Copy `prompts/01-project-initialization/claude-md-generator.md` to your desired folder.
2. Update the YAML header and content – keep the required `<role>`, `<activation>`, and `<instructions>` sections.
3. Run `npm run validate` before committing. Zero errors = good to go.

---

## Repository layout 

```text
prompts/               # 8 organized prompt categories (01-8)
beta-prompts/          # Prompt optimization tools
.claude/               # 39 slash commands across 9 directories
├── commands/          # All production-ready commands
│   ├── 00-initial-workflow/    # Initial workflow automation
│   ├── 01-project-setup/       # Project setup and initialization
│   ├── 02-development/         # Development workflow commands
│   ├── 03-security/            # Security and compliance
│   ├── 04-testing/             # Testing and validation
│   ├── 05-deployment/          # Deployment and release
│   ├── 06-collaboration/       # Team collaboration
│   ├── 07-utilities/           # Utility commands
│   └── 08-extras/              # Additional specialized commands
├── workflows/         # Automated workflow definitions
└── config.json        # Enterprise-grade configuration
docs/                  # Documentation and SDK guide
scripts/               # Validation utilities
.github/workflows/     # CI / deployment pipelines
README.md              # This file
LICENSE                # MIT
```

---

## Usage Examples

### Browse and use commands

```bash
# Browse available commands
ls .claude/commands/*/*.md

# Use a specific command (copy content into Claude Code)
cat .claude/commands/01-project-setup/bootstrap-project.md

# Browse prompt templates
cat prompts/02-code-analysis/security-quality-audit.md
```


---

## Community & Support

- [Open an issue](https://github.com/ursisterbtw/ccprompts/issues) for bugs, feature requests, or questions
- [Start a discussion](https://github.com/ursisterbtw/ccprompts/discussions) for ideas and feedback
- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

---

## Contributing

Pull requests are welcome! Please:

1. Run the validator and ensure no errors.
2. Follow conventional commit messages (`feat: …`, `fix: …`, etc.).
3. Keep marketing language out of prompts—clarity beats hype.

---

## License

MIT. See [LICENSE](LICENSE) for details.

---
