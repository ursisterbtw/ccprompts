# AGENTS.md - Coding Agent Guidelines for ccprompts

## Build/Test/Lint Commands

```bash
npm test                    # Run all tests (Jest + validation)
npm run test:jest -- path/to/test.js  # Run single test file
npm run lint               # Check markdown formatting
npm run lint:fix           # Auto-fix markdown issues
npm run validate           # Validate all prompts/commands
npm run security-scan      # Security-only validation
npm run check-links        # Verify all markdown links
npm run ci                 # Full CI suite (validate + lint + links)
```

## Code Style Guidelines

- **Indentation**: 4 spaces (per .editorconfig)
- **Line endings**: LF only, trim trailing whitespace
- **Markdown**: Max 120 chars/line, allow <div>, <img>, <br>, <details>, <summary>
- **Node version**: >=18.0.0 required
- **Test naming**: Use `*.test.js` or `*.spec.js` in tests/ directory
- **Error handling**: Fail fast with actionable messages, reference task IDs
- **Security**: Never emit secrets/keys, validate all inputs, justify dangerous ops
- **Commits**: Atomic with conventional format: `<type>(scope): imperative summary`
- **File structure**: Follow existing patterns in .claude/commands/ and prompts/
