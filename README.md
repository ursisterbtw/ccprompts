<p align="center">
  <svg width="720" height="120" viewBox="0 0 720 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#7F5AF0">
          <animate attributeName="stop-color" values="#7F5AF0;#2CB67D;#7F5AF0" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stop-color="#2CB67D">
          <animate attributeName="stop-color" values="#2CB67D;#7F5AF0;#2CB67D" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <text id="title" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'Fira Code', monospace" font-size="48" fill="url(#grad)" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="500" stroke-dashoffset="500">
      ccprompts
      <animate attributeName="stroke-dashoffset" from="500" to="0" dur="3s" fill="freeze" />
      <animate attributeName="fill-opacity" values="0;1" dur="3s" fill="freeze" />
    </text>
  </svg>
</p>

# ccprompts – Practical Claude Command Library

**ccprompts** is a curated set of prompt templates and supporting tooling for developers who want to extend Claude-powered automation into their own projects.  Each prompt is production-ready, peer-reviewed and versioned so you can drop it into an existing workflow—or use it as a starting point for your own commands.

---

## Why use this repo?

* **Breadth without bloat** – prompts cover common phases of the SDLC (bootstrap, testing, refactoring, CI/CD, security) but stay laser-focused on useful output.
* **Quality gates built-in** – the `scripts/validate-prompts.js` validator enforces length, structure and security guards for every prompt.
* **Composable** – prompts are plain Markdown with a minimal YAML header (id, tags, description).  Use them as is, or compose them in your own workflows.
* **Zero vendor lock-in** – no proprietary wrappers or hidden services; the repo is pure text + Node.js tooling so you can fork and adapt freely.

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
3. Run `npm run validate` before committing.  Zero errors = good to go.

---

## Repository layout (trimmed)

```
prompts/               # Organized by phase (01–10)
scripts/               # Validation + helper utilities
.github/workflows/     # CI / deployment pipelines
README.md              # This file
LICENSE                # MIT
```

---

## Contributing

Pull-requests are welcome.  Please:

1. Run the validator and ensure no errors.
2. Follow conventional commit messages (`feat: …`, `fix: …`, etc.).
3. Keep marketing language out of prompts—clarity beats hype.

---

## License

MIT.  See `LICENSE` for details.
