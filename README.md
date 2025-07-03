<p align="center">
  <img src="docs/assets/banner.svg" width="720" height="120" alt="ccprompts banner: practical Claude code commands and prompts" />
</p>

<div align="center">

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

# ccprompts – practical claude code commands and prompts

**ccprompts** is a curated set of prompt templates and supporting tooling for developers who want to extend Claude-powered automation into their own projects. Each prompt is production-ready, peer-reviewed, and versioned so you can drop it into an existing workflow—or use it as a starting point for your own commands.

---

## Why use this repo?

- **Breadth without bloat** – Prompts cover common phases of the SDLC (bootstrap, testing, refactoring, CI/CD, security) but stay laser-focused on useful output.
- **Quality gates built-in** – The [`scripts/validate-prompts.js`](scripts/validate-prompts.js) validator enforces length, structure, and security guards for every prompt.
- **Composable** – Prompts are plain Markdown with a minimal YAML header (`id`, `tags`, `description`). Use them as is, or compose them in your own workflows.
- **Zero vendor lock-in** – No proprietary wrappers or hidden services; the repo is pure text + Node.js tooling so you can fork and adapt freely.

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
scripts/               # Validation + helper utilities
.github/workflows/     # CI / deployment pipelines
README.md              # This file
LICENSE                # MIT
```

---

## Usage Example

Browse and use a prompt in your workflow:

```bash
cat prompts/02-code-analysis/security-quality-audit.md
# Copy-paste the YAML and instructions into your Claude workflow or automation tool
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
