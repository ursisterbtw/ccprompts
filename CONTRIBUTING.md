# Contributing to ccprompts

Thank you for your interest in contributing to the **ccprompts** ecosystem! This guide will help you get started with contributing to the most comprehensive collection of Claude Code commands and prompts.

## 📋 Table of Contents

1. [How to Contribute](#how-to-contribute)
2. [Development Setup](#development-setup)
3. [Command Development](#command-development)
4. [Prompt Development](#prompt-development)
5. [Quality Standards](#quality-standards)
6. [Submission Process](#submission-process)
7. [Community Guidelines](#community-guidelines)

## 🤝 How to Contribute

### Ways to Contribute

- **🔧 New Commands**: Create commands for new development workflows
- **📚 New Prompts**: Add comprehensive prompts for specific development tasks
- **🐛 Bug Fixes**: Fix issues in existing commands or prompts
- **📖 Documentation**: Improve documentation, examples, and guides
- **🧪 Testing**: Add tests, improve validation, or enhance quality assurance
- **💡 Ideas & Feedback**: Suggest improvements or report issues

### What We're Looking For

- **Production-Ready Commands**: Commands that solve real developer problems
- **Educational Value**: Commands that teach while they automate
- **Enterprise Quality**: Commands suitable for professional development teams
- **Comprehensive Documentation**: Clear examples and thorough explanations
- **Safety-First Design**: Commands with proper validation and rollback capabilities

## 🛠️ Development Setup

### Prerequisites

- **Node.js 18+**: For running validation scripts and tools
- **Git**: For version control and contribution workflow
- **Claude Code**: For testing command functionality
- **Text Editor**: VS Code recommended for markdown editing

### Local Setup

1. **Fork the Repository**

   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/ccprompts.git
   cd ccprompts
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Validation**

   ```bash
   npm run validate
   npm run lint
   npm run check-links
   ```

4. **Test MCP Configuration**

   ```bash
   cd .claude
   node test-mcp.js
   ```

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/command-name

# Make your changes
# Add/edit commands in .claude/commands/
# Add/edit prompts in prompts/

# Validate your changes
npm run quality-check

# Commit and push
git add .
git commit -m "feat: add command for X functionality"
git push origin feature/command-name

# Create pull request
```

## 🔧 Command Development

### Command Template

All commands must follow the standardized template in [`COMMAND_TEMPLATE.md`](COMMAND_TEMPLATE.md).

### Required Sections

1. **Header & Description**: Clear command purpose
2. **Usage**: Correct parameter syntax
3. **Parameters**: Detailed parameter documentation
4. **Examples**: Real-world usage examples
5. **XML Implementation**: Proper role, activation, and instructions

### Command Naming

- Use **kebab-case**: `analyze-project`, `setup-ci`, `quick-fix`
- Be **descriptive**: Command name should clearly indicate functionality
- Avoid **duplication**: Check existing commands before naming
- Keep **concise**: Prefer shorter names that are still clear

### Example Command Structure

```markdown
# My-Command Command

Brief description of what this command does.

## Usage
```

/my-command [parameter1] [parameter2]

```

## Description
Detailed functionality description:
1. Primary function
2. Secondary features
3. Integration capabilities
4. Learning components
5. Safety measures

## Parameters
- `parameter1`: `type` | `valid_values` - Description
- `parameter2`: `type` | `valid_values` - Description (optional)

## Examples
```bash
/my-command basic example
/my-command advanced complex-example
```

## Command Implementation

```xml
<role>Expert role definition</role>
<activation>Configuration settings</activation>
<instructions>Phase-based implementation steps</instructions>
```

```

## 📚 Prompt Development

### Prompt Categories

Prompts are organized in 10 categories:

- **01-project-initialization**: Project setup and bootstrapping
- **02-code-analysis**: Security audits and dependency analysis
- **03-refactoring**: Code modernization and performance optimization
- **04-testing**: Test generation and quality assurance
- **05-documentation**: Documentation and knowledge management
- **06-git-workflows**: Git automation and repository management
- **07-multi-file-operations**: Cross-codebase refactoring
- **08-mcp-integration**: MCP server development and testing
- **09-build-deployment**: CI/CD and infrastructure automation
- **10-security-compliance**: Security hardening and compliance

### Prompt Structure

All prompts must include:

1. **XML Structure**: `<role>`, `<activation>`, `<instructions>`
2. **Comprehensive Instructions**: Step-by-step implementation guidance
3. **Safety Considerations**: Error handling and rollback procedures
4. **Output Requirements**: Clear deliverable specifications
5. **Educational Components**: Learning objectives and skill development

### Example Prompt Structure

```xml
<role>
You are a [specific expert role] specializing in [domain expertise]. Your mission is to [specific objective] while [teaching component] and [safety consideration].
</role>

<activation>
CLAUDE.CONFIG:
  domain_mode: "specialized_mode"
  safety_level: "appropriate_level"
  automation_level: "suitable_scope"
</activation>

<instructions>
Phase 1: Analysis and Planning
1. Specific step with clear outcome
2. Validation step with criteria
3. Safety check with procedures

Phase 2: Implementation
4. Implementation step with progress tracking
5. Quality assurance with validation
6. Error handling with recovery

Phase 3: Documentation and Learning
7. Documentation step for knowledge capture
8. Learning objective completion
9. Handoff and next steps
</instructions>

<output_requirements>
1. Primary deliverable with specifications
2. Secondary outputs with quality criteria
3. Documentation requirements
4. Validation procedures
</output_requirements>
```

## ✅ Quality Standards

### Validation Requirements

All contributions must pass:

- **Structure Validation**: Required sections and proper formatting
- **Content Quality**: Examples, descriptions, and completeness
- **XML Validation**: Proper XML structure and content
- **Link Checking**: All internal and external links working
- **Lint Checking**: Markdown formatting standards

### Testing Your Contribution

```bash
# Run full validation suite
npm run quality-check

# Individual validation steps
npm run validate          # Comprehensive validation
npm run lint             # Markdown linting
npm run check-links      # Link validation
```

### Quality Checklist

- [ ] Follows command/prompt template structure
- [ ] Includes realistic, actionable examples
- [ ] Has proper XML implementation (for commands)
- [ ] Passes all validation checks
- [ ] Includes security considerations
- [ ] Provides educational value
- [ ] Integrates with existing ecosystem

## 📤 Submission Process

### Before Submitting

1. **Read the Template**: Use [`COMMAND_TEMPLATE.md`](COMMAND_TEMPLATE.md) for commands
2. **Run Validation**: Ensure `npm run quality-check` passes
3. **Test Functionality**: Verify command works in Claude Code
4. **Check Integration**: Ensure proper ecosystem integration
5. **Review Examples**: Provide comprehensive, realistic examples

### Pull Request Guidelines

#### PR Title Format

```
type: brief description

Examples:
feat: add performance monitoring command
fix: resolve XML structure issue in audit-security
docs: improve contributing guidelines and examples
```

#### PR Description Template

```markdown
## Summary
Brief description of changes and motivation.

## Type of Change
- [ ] New command
- [ ] New prompt
- [ ] Bug fix
- [ ] Documentation update
- [ ] Quality improvement

## Testing
- [ ] Validation passes (`npm run quality-check`)
- [ ] Command tested in Claude Code
- [ ] Examples verified working
- [ ] Integration confirmed

## Checklist
- [ ] Follows template structure
- [ ] Includes proper documentation
- [ ] Has realistic examples
- [ ] Passes all quality checks
- [ ] Updates related documentation
```

### Review Process

1. **Automated Checks**: GitHub Actions run validation
2. **Maintainer Review**: Code review for quality and integration
3. **Community Feedback**: Input from other contributors
4. **Approval**: Final approval and merge

## 👥 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- **Be Respectful**: Treat all community members with respect and kindness
- **Be Collaborative**: Help others learn and grow
- **Be Patient**: Remember that everyone has different experience levels
- **Be Constructive**: Provide helpful feedback and suggestions
- **Be Inclusive**: Welcome contributors from all backgrounds

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests, discussions
- **Pull Requests**: Code contributions and reviews
- **Discussions**: General questions and community interaction

### Getting Help

- **Documentation**: Check [`README.md`](README.md) and [`COMMAND_REFERENCE.md`](COMMAND_REFERENCE.md)
- **Examples**: Review [`EXAMPLES.md`](EXAMPLES.md) for usage patterns
- **Issues**: Create a GitHub issue for questions or problems
- **Discussions**: Use GitHub Discussions for general questions

## 🎯 Contribution Ideas

### High-Priority Areas

- **Language-Specific Commands**: Python, Go, Rust, Java specific workflows
- **Framework Integration**: React, Vue, Django, FastAPI specific commands
- **Cloud Provider Commands**: AWS, GCP, Azure specific automation
- **Industry-Specific Workflows**: Fintech, healthcare, e-commerce patterns
- **Advanced Testing**: Chaos engineering, contract testing, property-based testing

### Community Needs

- **Video Tutorials**: Screen recordings of command usage
- **Integration Examples**: Real-world workflow demonstrations
- **Troubleshooting Guides**: Common problems and solutions
- **Performance Optimization**: Command execution speed improvements
- **Accessibility**: Making commands accessible to all developers

## 📈 Recognition

### Contributor Recognition

- **Contributors List**: All contributors recognized in README
- **Command Attribution**: Command authors credited in documentation
- **Community Highlights**: Outstanding contributions featured
- **Maintainer Path**: Active contributors invited to maintainer roles

### Impact Metrics

We track contribution impact through:

- **Usage Analytics**: How often contributed commands are used
- **Community Feedback**: User satisfaction and feedback
- **Quality Metrics**: Validation success rates and issue resolution
- **Ecosystem Growth**: New capabilities and integrations

---

## 🚀 Ready to Contribute?

1. **Fork the repository** and set up your development environment
2. **Choose your contribution type** - command, prompt, documentation, or improvement
3. **Follow the templates** and quality standards
4. **Test thoroughly** with our validation tools
5. **Submit a pull request** with clear description and examples

**Questions?** Create an issue or start a discussion - our community is here to help!

Thank you for helping make ccprompts the definitive Claude Code command ecosystem! 🎉
