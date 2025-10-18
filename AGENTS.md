# AGENTS.md - Development Guidelines for ccprompts

## Build/Lint/Test Commands

### Core Commands

- `bun run test` - Run Jest tests + validate all 70+ commands
- `bun run test:jest` - Run Jest tests only
- `bun run test:validate` - Run command validation only
- `bun run validate` - Validate all 70+ commands (expects exact count)
- `bun run lint` - Run markdownlint on documentation
- `bun run lint:fix` - Auto-fix markdown formatting issues
- `bun run ci` - Full pipeline: validate + lint + link-check

### Security & Safety

- `bun run security-scan` - Security-focused validation only
- `bun run safety-validate` - Dagger container safety system
- `./scripts/safe-run.sh "command"` - Execute dangerous commands safely

### Running Single Tests

- `bun run test:jest -- tests/validators/file-utils.test.js`
- `bun run test:jest -- --testNamePattern="specific test name"`
- `bun run test:jest -- --testPathPattern="validators"`

## Environment Setup

### Bun Installation & Version Pinning

- Install Bun (macOS/Linux): `curl -fsSL https://bun.sh/install | bash` then add `~/.bun/bin` to `PATH`.
- Install Bun (Windows): use WSL with the script above or the official installer from bun.sh.
- Version pinning: this repo pins Bun via `package.json` → `"packageManager": "bun@1.1.34"` and a `.bun-version` file. Verify with `bun --version`.
- CI example (GitHub Actions):

  ```yaml
  - uses: oven-sh/setup-bun@v1
    with:
      bun-version: 1.1.34
  - run: bun install --frozen-lockfile
  - run: bun run test && bun run ci
  ```

## Code Style Guidelines

### TypeScript & JavaScript

- **Strict mode**: Always enabled in tsconfig.json
- **Target**: ES2020 with CommonJS modules
- **Imports**: External libraries first, then local modules
- **Types**: Use explicit typing, avoid `any`
- **Classes**: Use JSDoc comments for all public methods
- **Error handling**: Use try-catch with descriptive error messages

### Formatting

- **Indentation**: 4 spaces (EditorConfig)
- **Line length**: 120 characters for markdown, flexible for code
- **Trailing whitespace**: Trim automatically
- **Final newlines**: No final newlines in files

### Naming Conventions

- **Files**: kebab-case for scripts, camelCase for TypeScript
- **Variables**: camelCase
- **Classes**: PascalCase
- **Methods**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Testing

- **Framework**: Jest with TypeScript support
- **File patterns**: `*.test.js`, `*.test.ts`
- **Coverage**: Collect from `scripts/**/*.js` and `src/**/*.ts`
- **Setup**: Use `tests/setup.js` and `tests/jest-env-setup.js`

### Documentation

- **Markdown**: Follow .markdownlint.json rules
- **Line length**: 120 characters maximum
- **Headers**: Use consistent heading levels
- **Code blocks**: Use proper language tags
