# AGENTS.md - Coding Agent Guidelines for ccprompts

## Build/Test/Lint Commands

```bash
npm test                    # Run all tests (Jest + validation)
npm run test:jest -- tests/validation.test.js  # Run single test file
npm run test:validate       # Run validation only (expects 70 commands)
npm run lint               # Check markdown formatting
npm run lint:fix           # Auto-fix markdown issues
npm run validate           # Validate all commands
npm run security-scan      # Security-only validation
npm run safety-validate    # Run Dagger safety validation
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
- **File structure**: Follow existing patterns in .claude/commands/
- **Test timeout**: 30s for validation tests (Jest config)
- **Coverage**: Minimum 40% lines, 35% branches, 45% functions
- **XML format**: Commands use XML with role/activation/instructions/output sections
- **Validation**: Expects exactly 70 commands (configurable via EXPECTED_COMMAND_COUNT)
