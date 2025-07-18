<p align="center">
  <img src="docs/assets/banner.svg" width="720" height="120" alt="ccprompts banner" />
</p>

<div align="center">

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  [![Sourcery](https://img.shields.io/badge/Sourcery-enabled-brightgreen)](https://sourcery.ai)

</div>

# ccprompts – practical claude code commands and prompts

**ccprompts** is a collection of structured prompt templates for common development tasks.
The templates are organized into 10 categories covering the software development lifecycle,
from project initialization to security compliance. Each prompt includes validation and can be
used directly with Claude Code or adapted for your own workflows.

> **⚠️ Development Notice**: This repository is under active development. Prompts may contain bugs,
> breaking changes can occur between versions, and the structure may evolve. Use with caution in
> production environments.

---

## What's included

**10 categories of development prompts:**

- Project initialization & documentation
- Code analysis & security audits
- Refactoring & performance optimization
- Testing & quality assurance
- Documentation generation
- Git workflows & automation
- Multi-file operations
- MCP integration
- Build & deployment pipelines
- Security & compliance

**Key features:**

- **Validated prompts** – Built-in validation ensures prompt quality and security
- **Plain Markdown** – Simple format with minimal YAML headers, easy to modify
- **Safety system** – Containerized execution for potentially dangerous commands via Dagger
- **No dependencies** – Pure text files with Node.js tooling for validation

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

## Repository layout (trimmed)

```text
prompts/               # Organized by phase (01–10)
scripts/               # Safety system + validation utilities
src/                   # Dagger safety container module
dagger.json            # Dagger configuration
SAFETY.md              # Containerized safety system guide
.github/workflows/     # CI / deployment pipelines
README.md              # This file
LICENSE                # MIT
```

---

## Usage Examples

### Browse and use prompts

```bash
cat prompts/02-code-analysis/security-quality-audit.md
# Copy-paste the YAML and instructions into your Claude workflow or automation tool
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

**See [SAFETY.md](SAFETY.md) for complete safety system documentation.**

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
3. Keep prompts clear and focused—avoid unnecessary complexity.

---

## License

MIT. See [LICENSE](LICENSE) for details.

---
