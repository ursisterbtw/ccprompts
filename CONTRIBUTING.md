# Contributing to ccprompts

Thank you for your interest in contributing to this collection of Claude Code-specific developer commands and prompts! This guide will help you get started.

## Quick Start

1. **Fork and Clone**

   ```bash
   git clone https://github.com/ursisterbtw/ccprompts.git
   cd ccprompts
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Validate Your Changes**

   ```bash
   npm run validate
   ```

## Development Workflow

### 1. Branch Strategy

- Create feature branches from `main`
- Use descriptive branch names: `feature/new-command`, `fix/validation-issue`
- Keep branches focused on single features or fixes

### 2. Making Changes

#### Adding New Commands

- Place commands in `.claude/commands/`
- Follow the required structure:

  ```markdown
  # Command Name

  Brief description

  ## Usage
  ```bash
  /command-name [parameters]

  ## Description
  Detailed explanation

  ## Parameters
  - `param1`: Description (type, default)

  ## Examples
  ```bash
  /command-name example1
  /command-name param1=value
  ```

  ```

#### Adding New Prompts

- Place prompts in appropriate `prompts/` subdirectories
- Follow XML structure:

  ```xml
  <role>
  Your role description
  </role>

  <activation>
  CLAUDE.CONFIG:
    setting: "value"
  </activation>

  <instructions>
  Step-by-step instructions
  </instructions>
  ```

### 3. Validation Requirements

All contributions must pass:

- **Markdown validation**: `npm run lint`
- **Link checking**: `npm run check-links`
- **Structure validation**: `npm run validate`
- **Security scanning**: Automated in CI/CD

### 4. Quality Standards

#### Commands (37+ files)

- ✅ Required sections: Usage, Description, Parameters, Examples
- ✅ Clear parameter documentation with types and defaults
- ✅ Realistic examples showing different use cases
- ✅ Brief but comprehensive examples sections

#### Prompts (19+ files)

- ✅ Required XML structure: `<role>`, `<activation>`, `<instructions>`
- ✅ Domain-appropriate activation configurations
- ✅ Comprehensive examples sections
- ✅ Output requirements clearly defined

## Testing

### Run Full Validation Suite

```bash
npm test                    # Full validation
npm run validate           # Structure and content validation
npm run lint               # Markdown linting
npm run check-links        # Link validation
npm run security-scan      # Security checks
```

### Local Development

```bash
# Quick validation during development
node scripts/validate-commands.js

# Test specific command sections
grep -l "## Examples" .claude/commands/*.md
```

## Submission Guidelines

### Pull Request Process

1. **Pre-submission Checklist**
   - [ ] All validation passes (`npm test`)
   - [ ] New commands have all required sections
   - [ ] New prompts have complete XML structure
   - [ ] Examples are realistic and comprehensive
   - [ ] Documentation is clear and concise

2. **PR Description Template**

   ```markdown
   ## Summary
   Brief description of changes

   ## Type of Change
   - [ ] New command
   - [ ] New prompt
   - [ ] Bug fix
   - [ ] Documentation improvement
   - [ ] Validation enhancement

   ## Testing
   - [ ] `npm test` passes
   - [ ] Manual testing completed

   ## Validation Results
   - Errors: X → Y
   - Quality grade: A/B/C/D/F
   ```

3. **Review Process**
   - Automated CI/CD validation runs
   - Community review for content quality
   - Maintainer approval for merge

### Coding Standards

#### File Organization

```
ccprompts/
├── .claude/commands/           # Slash command documentation
├── prompts/XX-category/        # Prompt collections by category
├── scripts/                    # Validation and tooling
└── .github/workflows/          # CI/CD configuration
```

#### Naming Conventions

- **Commands**: `kebab-case.md` (e.g., `analyze-project.md`)
- **Prompts**: `descriptive-name.md` (e.g., `security-quality-audit.md`)
- **Categories**: `NN-category-name/` (e.g., `01-project-initialization/`)

#### Content Standards

- **Concise but comprehensive**: Cover all essential information
- **Example-driven**: Show, don't just tell
- **Security-conscious**: No hardcoded secrets or sensitive data
- **Enterprise-ready**: Production-grade quality and practices

## Command Ecosystem

### Current Statistics

- **Total Commands**: 37+ slash commands
- **Total Prompts**: 19+ comprehensive prompts
- **Categories**: 10+ specialized categories
- **Quality Grade**: C (70/100) - improving toward A grade

### Architecture

1. **Phase 1**: Category Commands (project operations)
2. **Phase 2**: Workflow Commands (development lifecycle)
3. **Phase 3**: Context-Aware Commands (intelligent analysis)
4. **Phase 4**: Utility Commands (tooling and discovery)
5. **Phase 5**: Developer Lifecycle (team coordination)
6. **Phase 6**: Learning Commands (skill development)

## Getting Help

### Community Support

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Questions and community help
- **Wiki**: Extended documentation and tutorials

### Development Resources

- **Validation Guide**: `scripts/validate-commands.js`
- **Command Template**: `.claude/commands/TEMPLATE.md`
- **Prompt Template**: `prompts/TEMPLATE.md`
- **CI/CD Workflows**: `.github/workflows/`

### Troubleshooting

#### Common Issues

1. **Validation Failures**

   ```bash
   # Check specific error types
   npm run validate | grep "❌ Errors"

   # Fix common issues
   grep -l "Missing XML sections" prompts/**/*.md
   ```

2. **Link Check Failures**

   ```bash
   # Test specific files
   markdown-link-check README.md

   # Update broken links
   npm run check-links 2>&1 | grep "✖"
   ```

3. **Missing Sections**

   ```bash
   # Check command structure
   for file in .claude/commands/*.md; do
     echo "=== $file ==="
     grep "^## " "$file"
   done
   ```

## Recognition

Contributors are recognized through:

- **GitHub Contributors Graph**: Automatic recognition for commits
- **Release Notes**: Significant contributions highlighted
- **Community Recognition**: Outstanding contributions featured in documentation

## License

By contributing to ccprompts, you agree that your contributions will be licensed under the MIT License.

---

## Quality Metrics Goals

We're working toward these quality targets:

| Metric | Current | Target |
|--------|---------|--------|
| Validation Errors | 0 | 0 |
| Quality Grade | C (70/100) | A (90/100) |
| Command Coverage | 37 | 40+ |
| Prompt Coverage | 19 | 25+ |
| Example Quality | Basic | Comprehensive |

**Together, we're building the definitive resource for Claude Code development!** 🚀
