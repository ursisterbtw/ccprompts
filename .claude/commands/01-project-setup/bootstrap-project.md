---
description: Complete project initialization with intelligent technology detection
allowed-tools: Bash(npm:*), Bash(pip:*), Bash(cargo:*), Bash(git:*), Write, Edit, Read
---

# Bootstrap Project

## Project Analysis
- Current directory: !`pwd`
- Existing files: !`find . -maxdepth 2 -type f -name "*.json" -o -name "*.md" -o -name "*.toml" -o -name "*.lock" | head -10`
- Git status: !`git status 2>/dev/null || echo "Not a git repository"`
- Technology indicators: !`ls package.json requirements.txt Cargo.toml pom.xml composer.json go.mod 2>/dev/null`

## Intelligent Bootstrapping

Target setup: **$ARGUMENTS** (e.g., "web-app typescript", "python-api fastapi", "rust-cli")

Based on detected/specified technology, I'll set up:

### 🏗️ Project Structure
- Appropriate directory structure for the technology stack
- Configuration files (linting, formatting, type checking)
- Environment and dependency management
- Documentation templates

### 🔒 Security Foundations
- Dependency vulnerability scanning setup
- Security linting configuration
- Environment variable management
- Access control and permissions

### 🧪 Quality Assurance
- Testing framework configuration
- Code quality tools (linters, formatters)
- Pre-commit hooks
- CI/CD pipeline templates

### 📚 Documentation
- README with setup instructions
- Contributing guidelines
- API documentation templates
- Deployment guides

### 🚀 Development Environment
- Development scripts and automation
- Debug configurations
- Local development setup
- Team onboarding documentation

## Technology-Specific Features

**Web Applications**: React/Vue/Angular setup, bundling, deployment
**APIs**: Framework setup, database integration, documentation
**CLI Tools**: Argument parsing, packaging, distribution
**Libraries**: Package configuration, testing, publishing

Let me analyze your project and set up the optimal foundation!