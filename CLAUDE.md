# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

This repository contains a collection of Claude Code-specific developer commands and prompts. The project includes **40 production-ready commands** across **8 strategic phases**, helping teams with AI-assisted development through automation, learning resources, and quality assurance tools.

## Command Ecosystem

### **40 Commands Across 8 Strategic Phases**

```tree
📁 Phase 1: Initial Workflow (2 commands)
   ├── /analyze-project     # AI-powered project assessment
   └── /intelligent-chain   # Natural language workflow automation

🏗️ Phase 2: Project Setup (4 commands)
   ├── /document           # Auto-generated documentation
   ├── /learn              # Interactive skill development
   ├── /mcp                # MCP server integration and testing
   └── /new-feature        # Feature implementation workflow

🛠️ Phase 3: Development (6 commands)
   ├── /backup             # Backup strategies
   ├── /debug-session      # Advanced troubleshooting
   ├── /migrate            # Database and system migrations
   ├── /optimize           # Performance optimization
   ├── /refactor           # Safe multi-file transformations
   └── /monitor            # Production monitoring setup

🔒 Phase 4: Security & Compliance (4 commands)
   ├── /audit-security     # OWASP-compliant security analysis
   ├── /comply             # Regulatory compliance automation
   ├── /harden             # Security hardening workflows
   └── /incident-response  # Production incident management

🧪 Phase 5: Testing & Quality (2 commands)
   ├── /test               # Test automation
   └── /troubleshoot       # Systematic debugging assistance

🚀 Phase 6: Deployment & Operations (4 commands)
   ├── /deploy             # Production deployment workflows
   ├── /git                # Advanced Git operations and workflows
   ├── /pre-commit         # Quality gates and validation
   └── /setup-ci           # CI/CD pipeline automation

👥 Phase 7: Collaboration & Management (8 commands)
   ├── /code-review        # AI-powered code analysis
   ├── /daily-standup      # Team coordination automation
   ├── /release-notes      # Multi-audience communication
   ├── /sprint-planning    # Sprint management
   ├── /tech-debt          # Technical debt optimization
   ├── /best-practices     # Technology-specific guidance
   ├── /knowledge-base     # Organizational knowledge management
   └── /modernize          # Legacy system modernization

📊 Phase 8: Utilities & Analytics (6 commands)
   ├── /health-check       # System health checks
   ├── /list-prompts       # Command discovery and browsing
   ├── /prompt-stats       # Usage analytics and metrics
   ├── /quick-fix          # Targeted issue resolution
   ├── /search-prompts     # Content search
   ├── /smart-suggest      # Contextual recommendations
   ├── /validate-environment # Environment verification
   └── /workflow-builder   # Visual workflow creation
```

## Repository Architecture

```
ccprompts/
├── prompts/                           # 20 organized prompt categories
│   ├── 01-project-initialization/     # Bootstrap & CLAUDE.md generation
│   │   ├── comprehensive-bootstrap.md  # Complete project setup
│   │   └── claude-md-generator.md     # Project guidance creation
│   ├── 02-code-analysis/             # Security audits & dependency analysis
│   │   ├── security-quality-audit.md  # OWASP compliance scanning
│   │   └── dependency-analysis.md     # Vulnerability assessment
│   ├── 03-refactoring/               # Modernization & performance optimization
│   │   ├── codebase-modernization.md  # Legacy code transformation
│   │   └── performance-optimization.md # Bottleneck resolution
│   ├── 04-testing/                   # Test suite generation & mutation testing
│   │   ├── test-suite-generation.md   # Test suite creation
│   │   └── mutation-testing.md       # Quality validation
│   ├── 05-documentation/             # Documentation & knowledge management
│   │   ├── interactive-documentation.md # Auto-generated docs
│   │   └── knowledge-base-generation.md # Team knowledge systems
│   ├── 06-git-workflows/             # Git automation & repository management
│   │   ├── advanced-git-automation.md # Workflow optimization
│   │   └── repository-optimization.md # Performance tuning
│   ├── 07-multi-file-operations/     # Cross-codebase refactoring
│   │   ├── consistency-validation.md  # Pattern enforcement
│   │   └── cross-codebase-refactoring.md # Safe transformations
│   ├── 08-mcp-integration/           # MCP server configuration & testing
│   │   ├── mcp-custom-server.md       # Custom server development
│   │   └── advanced-tool-chains.md   # Tool integration
│   ├── 09-build-deployment/          # CI/CD pipelines & Infrastructure as Code
│   │   ├── comprehensive-cicd.md      # CI/CD pipeline setup
│   │   └── infrastructure-as-code.md  # IaC automation
│   └── 10-security-compliance/       # Security hardening & compliance
│       ├── security-hardening.md     # Production security
│       └── compliance-automation.md  # Regulatory compliance

├── .claude/                          # Complete command ecosystem
│   ├── commands/                     # All 40 slash commands
│   │   ├── [Phase 1: Category Commands]
│   │   │   ├── bootstrap-project.md
│   │   │   ├── audit-security.md
│   │   │   ├── refactor.md
│   │   │   ├── test.md
│   │   │   ├── document.md
│   │   │   ├── setup-ci.md
│   │   │   ├── deploy.md
│   │   │   └── optimize.md
│   │   ├── [Phase 2: Workflow Commands]
│   │   │   ├── backup.md
│   │   │   ├── migrate.md
│   │   │   ├── monitor.md
│   │   │   ├── comply.md
│   │   │   ├── modernize.md
│   │   │   └── harden.md
│   │   ├── [Phase 3: Context-Aware Commands]
│   │   │   ├── analyze-project.md
│   │   │   ├── health-check.md
│   │   │   ├── quick-fix.md
│   │   │   ├── smart-suggest.md
│   │   │   └── validate-environment.md
│   │   ├── [Phase 4: Utility Commands]
│   │   │   ├── list-prompts.md
│   │   │   ├── search-prompts.md
│   │   │   ├── workflow-builder.md
│   │   │   ├── prompt-stats.md
│   │   │   ├── export-config.md
│   │   │   └── debug-session.md
│   │   ├── [Phase 5: Developer Lifecycle Commands]
│   │   │   ├── pre-commit.md
│   │   │   ├── incident-response.md
│   │   │   ├── code-review.md
│   │   │   ├── daily-standup.md
│   │   │   ├── release-notes.md
│   │   │   ├── sprint-planning.md
│   │   │   └── tech-debt.md
│   │   └── [Phase 6: Learning Commands]
│   │       ├── learn.md
│   │       ├── best-practices.md
│   │       ├── troubleshoot.md
│   │       └── knowledge-base.md
│   ├── workflows/                    # Automated workflow definitions
│   │   ├── full-development-cycle.yaml
│   │   ├── security-hardening.yaml
│   │   ├── legacy-modernization.yaml
│   │   └── team-onboarding.yaml
│   └── config.json                   # Project configuration

├── scripts/                          # Safety and validation tools
│   ├── safe-run.sh                   # Containerized command execution
│   ├── quick-safe.sh                 # Quick safety aliases
│   └── validate-prompts.js           # Prompt validation
├── src/                              # Dagger safety container module
│   ├── index.ts                      # TypeScript safety functions
│   └── package.json                  # Dagger module dependencies
├── dagger.json                       # Dagger configuration
├── SAFETY.md                         # Containerized safety system guide
├── README.md                         # Project guide
├── CLAUDE.md                         # This guidance file
├── CC-SDK-Guide.md                   # Advanced Claude Code SDK reference
└── .gitignore                        # Optimized for .claude directory
```

## Key Features

### **🤖 AI-Powered Features**

- **Contextual Adaptation**: Commands adjust to project characteristics
- **Pattern Recognition**: Detection of code patterns, issues, and opportunities
- **Analytics**: Identify potential issues and optimization opportunities
- **Learning Integration**: Commands include educational components

### **🔗 Ecosystem Integration**

- **Command Chaining**: Commands work together for complex multi-step operations
- **Workflow Automation**: Visual workflow builder for custom processes
- **Team Collaboration**: Features for team coordination
- **Tool Integration**: Support for CI/CD, monitoring, and collaboration tools

### **📈 Continuous Learning & Growth**

- **Interactive Tutorials**: Hands-on learning integrated with real project work
- **Skill Development**: Learning paths and skill building
- **Knowledge Management**: Documentation and knowledge sharing
- **Best Practices**: Updated recommendations

### **🛡️ Safety & Compliance**

- **Atomic Operations**: All changes are versioned, tested, and reversible
- **Security Features**: Built-in security scanning and compliance checking
- **Quality Checks**: Automated quality assurance with customizable thresholds
- **Audit Trails**: Detailed logging for compliance
- **Containerized Safety**: Isolated execution of dangerous commands via Dagger containers

## Command Discovery & Usage

### **Quick Access Patterns**

```bash
# Instant project setup and analysis
/analyze-project
/new-feature web-app typescript cloud
/health-check full

# Development workflow automation
/pre-commit strict
/code-review pr security thorough
/daily-standup prepare team slack

# Learning and skill development
/learn react advanced project
/best-practices security javascript project
/troubleshoot error production critical

# Discovery and management
/list-prompts security advanced
/search-prompts "performance optimization"
/workflow-builder create
```

### **Command Ecosystem Navigation**

1. **Start with Discovery**: Use `/analyze-project` and `/list-prompts` to understand current state
2. **Build Foundation**: Use `/new-feature` and `/harden` for solid project setup
3. **Establish Quality**: Implement `/pre-commit`, `/code-review`, and `/best-practices`
4. **Enable Learning**: Use `/learn` and `/troubleshoot` for continuous development
5. **Scale Operations**: Leverage `/workflow-builder` and `/sprint-planning` for team coordination

### **Workflow Integration Examples**

#### **Complete Project Setup Workflow**

```bash
/analyze-project
→ /new-feature web-app typescript
→ /harden enterprise
→ /setup-ci github professional
→ /document auto-generated
→ /validate-environment
```

#### **Security-First Development Workflow**

```bash
/audit-security full-codebase paranoid
→ /pre-commit strict
→ /code-review security thorough
→ /incident-response security high
→ /comply soc2 audit-ready
```

#### **Learning-Driven Growth Workflow**

```bash
/analyze-project
→ /learn recommended intermediate
→ /best-practices domain technology
→ /troubleshoot guided practice
→ /knowledge-base contribute team
```

## Development Guidelines

### **Content Standards for Contributors**

1. **XML-Structured Format**: All prompts use role, activation, instructions, and output format sections
2. **Safety-First Approach**: Include verification steps and rollback procedures
3. **Educational Integration**: Every command should teach while it automates
4. **Production Focus**: Maintain security and compliance standards
5. **Team Collaboration**: Design for team environments and knowledge sharing

### **Command Design Principles**

- **Contextual Intelligence**: Commands adapt to specific project characteristics
- **Progressive Enhancement**: Start with analysis before making modifications
- **Multi-Agent Coordination**: Enable complex workflows through command chaining
- **Compliance Automation**: Built-in SOC2, GDPR, HIPAA considerations
- **Documentation First**: Always update knowledge files before major changes

### **Quality Assurance Requirements**

```bash
# Validate markdown formatting
markdownlint prompts/**/*.md .claude/commands/*.md

# Check for broken links
markdown-link-check prompts/**/*.md .claude/commands/*.md

# Verify prompt XML structure
xmllint --noout prompts/**/*.md .claude/commands/*.md

# Test command functionality
/debug-session commands configuration diagnostic
```

## Key Innovations

### **1. Modular Architecture**

Commands work independently or can be combined, allowing teams to adopt features gradually.

### **2. Educational Components**

Commands include educational elements to support skill development alongside automation.

### **3. Compliance Support**

Built-in support for SOC2, GDPR, HIPAA, and other regulatory frameworks, with automated compliance checking and audit trail generation.

### **4. Contextual Adaptation**

Commands adapt to project characteristics, technology stacks, and team needs, providing relevant recommendations and workflows.

### **5. Integrated Command System**

The 40 commands work together as a system supporting discovery, implementation, and learning.

## Advanced Usage Patterns

### **Team Leadership**

- **Project Health Monitoring**: Continuous assessment using `/health-check` and `/prompt-stats`
- **Team Skill Development**: Coordinated learning paths via `/learn` and `/knowledge-base`
- **Process Optimization**: Data-driven improvements through `/workflow-builder` and analytics
- **Compliance Management**: Automated regulatory compliance via `/comply` and `/audit-security`

### **Senior Developer Productivity**

- **Code Review**: AI-powered analysis with `/code-review` and educational explanations
- **Technical Debt Management**: ROI-based prioritization using `/tech-debt` and `/optimize`
- **Knowledge Sharing**: Automated documentation via `/document` and `/knowledge-base`
- **Continuous Integration**: CI/CD via `/setup-ci` and `/deploy`

### **Growing Developer Support**

- **Interactive Learning**: Hands-on tutorials via `/learn` integrated with real project work
- **Debugging Assistance**: Systematic troubleshooting via `/troubleshoot` with skill development
- **Best Practice Guidance**: Recommendations via `/best-practices`
- **Collaborative Development**: Team coordination via `/daily-standup` and `/sprint-planning`

## Technology Integration

### **Multi-Language Support**

- **Primary**: Python, TypeScript, JavaScript, Go, Rust, Java, C#, PHP, Ruby
- **Frameworks**: React, Vue, Angular, Django, FastAPI, Express, Spring Boot, Rails
- **Infrastructure**: Docker, Kubernetes, Terraform, AWS, GCP, Azure
- **Development Tools**: Git, GitHub Actions, GitLab CI, Jenkins, VS Code, JetBrains

### **Platform Integration**

- **Collaboration**: Slack, Teams, Jira, Confluence, Notion, Linear
- **Monitoring**: DataDog, New Relic, Grafana, Prometheus, Splunk
- **Security**: Snyk, Veracode, Checkmarx, SonarQube, GitHub Security
- **Compliance**: ServiceNow, Archer, MetricStream, LogicGate

## Success Metrics & Analytics

### **Command Effectiveness Tracking**

- **Usage Analytics**: Track command adoption and success rates via `/prompt-stats`
- **Learning Progress**: Monitor skill development through `/learn` progress tracking
- **Quality Improvements**: Measure code quality gains via `/code-review` and `/tech-debt`
- **Team Productivity**: Assess velocity improvements through workflow analytics

### **Continuous Improvement Framework**

- **Feedback Integration**: Commands learn from usage patterns and outcomes
- **Best Practices**: Recommendations based on industry trends
- **Performance Optimization**: Command efficiency improvements through analytics
- **Knowledge Enhancement**: Automated knowledge base updates via team interactions

## Important Usage Notes

### **Command Ecosystem Assumptions**

- All commands assume Claude Code's extended capabilities (file operations, MCP servers, git integration)
- Commands are designed for team environments with security requirements
- Safety and rollback procedures are emphasized throughout all operational commands
- The ecosystem is designed for both standalone command use and complex workflow chaining

### **Customization Guidelines**

- Commands serve as templates and should be customized for specific technology stacks
- Organizational standards can be integrated through configuration files and workflow definitions
- Compliance requirements can be enhanced through custom validation and audit procedures
- Learning paths can be adapted for team-specific skill development goals

### **Security and Compliance Considerations**

- All commands include security-first design principles
- Compliance automation is built into operational workflows
- Audit trails and change tracking are maintained throughout all operations
- Access controls and permission management are integrated where applicable

---

**This repository provides tools for AI-assisted development with a focus on automation, learning, and team capability building. The 40 commands extend Claude Code's capabilities to support development workflows and team collaboration.**

## Containerized Safety System

This repository includes a safety system for executing potentially dangerous commands in isolated Dagger containers. **Use this system whenever running unfamiliar commands or scripts from the internet.**

### **Quick Safety Usage**

```bash
# Install Dagger (one-time setup)
curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=18.12 sh

# Run dangerous commands safely
./scripts/safe-run.sh "rm -rf /tmp/dangerous-directory"
./scripts/quick-safe.sh curl-install "curl sketchy-site.com/install.sh | bash"

# Test mode to preview actions
./scripts/safe-run.sh "sudo apt update" --test
```

### **Safety Features**

- **Isolated Execution** - Commands run in throwaway containers
- **Read-Only Project Files** - Source code cannot be modified
- **Automatic Cleanup** - Containers destroyed after execution
- **Danger Detection** - Warns about potentially risky commands
- **Environment Control** - Custom environment variables supported

### **Integration with Claude Code**

```bash
# Always use safety system for Claude-generated commands
./scripts/safe-run.sh "$(claude-code-generated-command)"

# Quick aliases for common operations
./scripts/quick-safe.sh install    # npm install
./scripts/quick-safe.sh build      # npm run build
./scripts/quick-safe.sh rm-rf      # rm -rf operations
```

**See [SAFETY.md](SAFETY.md) for complete setup and usage instructions.**

## Related Documentation

- **[SAFETY.md](SAFETY.md)** - Complete containerized safety system guide
- **[.claude/README.md](.claude/README.md)** - Complete command ecosystem guide with usage examples
- **[prompts/INDEX.md](prompts/INDEX.md)** - Detailed prompt directory and category descriptions
- **[CC-SDK-Guide.md](CC-SDK-Guide.md)** - Advanced Claude Code SDK reference and integration guide
