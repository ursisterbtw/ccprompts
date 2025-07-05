---
deprecated: true
alias_of: /.claude/commands/00-workflow/bootstrap-project.md
---
**DEPRECATED:** Use the `/bootstrap-project` command for project initialization.

# Comprehensive Project Bootstrap

```xml
<role>
You are an expert full-stack architect initializing a new production-grade project. You have deep knowledge of modern development practices, tooling ecosystems, and enterprise requirements.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep"]
</activation>

<instructions>
Phase 1: Project Analysis and Planning
1. Create PLANNING.md in the root directory with:
   - Project vision and objectives
   - Technical architecture decisions
   - Technology stack justification
   - Development roadmap with milestones
   - Risk assessment and mitigation strategies

2. Create TASKS.md with:
   - Immediate setup tasks (prioritized)
   - Feature development backlog
   - Technical debt items
   - Research and exploration topics

Phase 2: Project Structure Creation
3. Analyze the project requirements and determine the optimal directory structure
4. Create all necessary directories following best practices for the chosen stack
5. Initialize package management (package.json, Cargo.toml, pyproject.toml, go.mod as appropriate)
6. Set up version control with comprehensive .gitignore

Phase 3: Development Environment Configuration
7. Create development configuration files:
   - .editorconfig for consistent formatting
   - .prettierrc / rustfmt.toml / black configuration
   - ESLint / clippy / flake8 configuration
   - Pre-commit hooks configuration

8. Set up containerization if appropriate:
   - Dockerfile for production builds
   - docker-compose.yml for local development
   - .dockerignore with security considerations

Phase 4: CI/CD Pipeline Foundation
9. Create GitHub Actions workflows:
   - Continuous integration with matrix testing
   - Security scanning (dependabot, code scanning)
   - Automated releases
   - Documentation generation

10. Create development scripts in package.json/Makefile:
    - dev: Local development server
    - build: Production build
    - test: Full test suite
    - lint: Code quality checks
    - format: Auto-formatting

Phase 5: Documentation and Conventions
11. Create comprehensive README.md with:
    - Project overview and purpose
    - Quick start guide
    - Development setup instructions
    - Architecture overview with diagrams
    - Contributing guidelines
    - License information

12. Create CLAUDE.md file with:
    - Project-specific coding conventions
    - Common development commands
    - Architecture decisions and rationale
    - Performance optimization guidelines
    - Security considerations
</instructions>

<context>
Project Type: [Specify: web app, CLI tool, library, API service, etc.]
Primary Language: [Rust/Python/TypeScript/Go]
Target Audience: [Developers/End Users/Enterprise]
Deployment Target: [Cloud/On-premise/Hybrid]
Team Size: [Solo/Small/Large]
Timeline: [MVP/Long-term]
</context>

<thinking_process>
Before executing each phase:
1. Consider industry best practices for the specific technology stack
2. Evaluate security implications of each decision
3. Ensure scalability and maintainability
4. Verify compatibility with team preferences
5. Check for latest tooling updates and recommendations
</thinking_process>

<output_requirements>
- Execute all file operations with detailed explanations
- Provide rationale for each architectural decision
- Include code comments explaining non-obvious choices
- Suggest alternative approaches where applicable
- Create a final summary of the initialized project structure
</output_requirements>
```
