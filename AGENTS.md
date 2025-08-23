# AGENTS.md - Development Guidelines for ccprompts

## Build/Lint/Test Commands

### Core Commands
- `npm run test` - Run Jest tests + validate all 70+ commands
- `npm run test:jest` - Run Jest tests only
- `npm run test:validate` - Run command validation only
- `npm run validate` - Validate all 70+ commands (expects exact count)
- `npm run lint` - Run markdownlint on documentation
- `npm run lint:fix` - Auto-fix markdown formatting issues
- `npm run ci` - Full pipeline: validate + lint + link-check

### Security & Safety
- `npm run security-scan` - Security-focused validation only
- `npm run safety-validate` - Dagger container safety system
- `./scripts/safe-run.sh "command"` - Execute dangerous commands safely

### Running Single Tests
- `npm run test:jest -- tests/validators/file-utils.test.js`
- `npm run test:jest -- --testNamePattern="specific test name"`
- `npm run test:jest -- --testPathPattern="validators"`

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