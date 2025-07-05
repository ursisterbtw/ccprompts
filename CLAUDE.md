# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

This repository contains the **most comprehensive collection of Claude Code-specific developer commands and prompts** ever created. The project delivers **39 production-ready commands** across **9 organized directories**, transforming how teams approach AI-assisted development through intelligent automation, continuous learning, and enterprise-grade quality assurance.

## Revolutionary Command Ecosystem

### **39 Commands Across 9 Organized Directories**

```tree
🚀 Initial Workflow (2 commands)
   ├── /intelligent-chain   # Multi-step intelligent automation
   └── /project-init        # Complete project initialization

🏗️ Project Setup (4 commands)
   ├── /bootstrap-project   # Complete project initialization
   ├── /audit-security      # OWASP-compliant security analysis
   ├── /setup-ci           # CI/CD pipeline automation
   └── /validate-environment # Environment verification

💻 Development (3 commands)
   ├── /refactor           # Safe multi-file transformations
   ├── /code-review        # AI-powered code analysis
   └── /optimize           # Performance optimization

🛡️ Security (4 commands)
   ├── /harden             # Security hardening workflows
   ├── /comply             # Regulatory compliance automation
   ├── /incident-response  # Production incident management
   └── /modernize          # Legacy system modernization

🧪 Testing (2 commands)
   ├── /test               # Comprehensive test automation
   └── /pre-commit         # Quality gates and validation

🚀 Deployment (5 commands)
   ├── /deploy             # Production deployment workflows
   ├── /release            # Release management automation
   ├── /daily-standup      # Team coordination automation
   ├── /release-notes      # Multi-audience communication
   └── /tech-debt          # Technical debt optimization

👥 Collaboration (3 commands)
   ├── /document           # Auto-generated documentation
   ├── /sprint-planning    # Intelligent sprint management
   └── /knowledge-base     # Organizational knowledge management

🛠️ Utilities (10 commands)
   ├── /list-prompts       # Command discovery and browsing
   ├── /search-prompts     # Intelligent content search
   ├── /workflow-builder   # Visual workflow creation
   ├── /prompt-stats       # Usage analytics and metrics
   ├── /export-config      # Configuration sharing
   ├── /debug-session      # Advanced troubleshooting
   ├── /analyze-project    # AI-powered project assessment
   ├── /health-check       # Comprehensive system health
   ├── /quick-fix          # Targeted issue resolution
   └── /smart-suggest      # Intelligent recommendations

🎯 Extras (6 commands)
   ├── /learn              # Interactive skill development
   ├── /best-practices     # Technology-specific guidance
   ├── /troubleshoot       # Systematic debugging assistance
   ├── /git                # Advanced Git operations and workflows
   ├── /mcp                # MCP server integration and testing
   ├── /new-feature        # Feature development workflow
   └── /transform          # Advanced transformation operations
```

## Repository Architecture

```
ccprompts/
├── prompts/                           # 10 organized prompt categories
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
│   │   ├── test-suite-generation.md   # Comprehensive test creation
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
│   │   ├── comprehensive-cicd.md      # Complete pipeline setup
│   │   └── infrastructure-as-code.md  # IaC automation
│   ├── 10-security-compliance/       # Security hardening & compliance
│   │   ├── security-hardening.md     # Production security
│   │   └── compliance-automation.md  # Regulatory compliance
│   └── INDEX.md                      # Comprehensive category index

├── beta-prompts/                     # Advanced prompt optimization system
│   ├── 01-context-analysis.py        # Context pattern analysis
│   ├── 02-semantic-clustering.py     # Semantic prompt clustering
│   ├── 03-performance-scoring.py     # Performance evaluation framework
│   ├── 04-optimization-engine.py     # Automated prompt optimization
│   ├── 05-quality-validation.py      # Quality assurance validation
│   ├── 06-batch-processing.py        # Batch optimization processing
│   ├── 07-metric-analysis.py         # Metric analysis and reporting
│   ├── 08-workflow-integration.py    # Workflow integration utilities
│   ├── 09-content-generation.py      # Content generation algorithms
│   ├── 10-evaluation-framework.py    # Evaluation framework
│   ├── 11-automated-testing.py       # Automated testing suite
│   └── 12-reporting-system.py        # Comprehensive reporting system

├── .claude/                          # Complete command ecosystem
│   ├── commands/                     # All 39 slash commands
│   │   ├── 00-initial-workflow/      # Initial workflow automation
│   │   │   ├── intelligent-chain.md
│   │   │   └── project-init.md
│   │   ├── 01-project-setup/         # Project setup and initialization
│   │   │   ├── bootstrap-project.md
│   │   │   ├── audit-security.md
│   │   │   ├── setup-ci.md
│   │   │   └── validate-environment.md
│   │   ├── 02-development/           # Development workflow commands
│   │   │   ├── refactor.md
│   │   │   ├── code-review.md
│   │   │   └── optimize.md
│   │   ├── 03-security/              # Security and compliance
│   │   │   ├── harden.md
│   │   │   ├── comply.md
│   │   │   ├── incident-response.md
│   │   │   └── modernize.md
│   │   ├── 04-testing/               # Testing and validation
│   │   │   ├── test.md
│   │   │   └── pre-commit.md
│   │   ├── 05-deployment/            # Deployment and release
│   │   │   ├── deploy.md
│   │   │   ├── release.md
│   │   │   ├── daily-standup.md
│   │   │   ├── release-notes.md
│   │   │   └── tech-debt.md
│   │   ├── 06-collaboration/         # Team collaboration
│   │   │   ├── document.md
│   │   │   ├── sprint-planning.md
│   │   │   └── knowledge-base.md
│   │   ├── 07-utilities/             # Utility commands
│   │   │   ├── list-prompts.md
│   │   │   ├── search-prompts.md
│   │   │   ├── workflow-builder.md
│   │   │   ├── prompt-stats.md
│   │   │   ├── export-config.md
│   │   │   ├── debug-session.md
│   │   │   ├── analyze-project.md
│   │   │   ├── health-check.md
│   │   │   ├── quick-fix.md
│   │   │   └── smart-suggest.md
│   │   └── 08-extras/                # Additional specialized commands
│   │       ├── learn.md
│   │       ├── best-practices.md
│   │       ├── troubleshoot.md
│   │       ├── git.md
│   │       ├── mcp.md
│   │       ├── new-feature.md
│   │       └── transform.md
│   ├── workflows/                    # Automated workflow definitions
│   │   ├── development-cycle.yaml    # Complete development workflow
│   │   ├── full-development-cycle.yaml # Full lifecycle automation
│   │   └── security-hardening.yaml   # Security hardening workflow
│   └── config.json                   # Enterprise-grade configuration

├── docs/                             # Documentation and guides
│   ├── assets/                       # Documentation assets
│   │   └── banner.svg               # Project banner
│   └── CC-SDK.md                    # Advanced Claude Code SDK reference

├── scripts/                          # Safety and validation tools
│   ├── safe-run.sh                   # Containerized command execution
│   ├── quick-safe.sh                 # Quick safety aliases
│   └── validate-prompts.js           # Prompt validation
├── src/                              # Dagger safety container module
│   ├── index.ts                      # TypeScript safety functions
│   └── package.json                  # Dagger module dependencies
├── dagger.json                       # Dagger configuration
├── SAFETY.md                         # Containerized safety system guide
├── README.md                         # Comprehensive ecosystem guide
├── CLAUDE.md                         # This guidance file
└── .gitignore                        # Optimized for .claude directory
```

## Revolutionary Features

### **🤖 AI-Powered Intelligence**

- **Contextual Adaptation**: Commands automatically adjust to project characteristics
- **Pattern Recognition**: Intelligent detection of code patterns, issues, and opportunities
- **Predictive Analytics**: Forecast potential issues and optimization opportunities
- **Learning Integration**: Every command teaches while it automates

### **🔗 Seamless Ecosystem Integration**

- **Command Chaining**: Commands work together for complex multi-step operations
- **Workflow Automation**: Visual workflow builder for custom processes
- **Real-Time Collaboration**: Team-aware features with live coordination
- **Enterprise Integration**: Native support for CI/CD, monitoring, and collaboration tools

### **📈 Continuous Learning & Growth**

- **Interactive Tutorials**: Hands-on learning integrated with real project work
- **Skill Progression**: Personalized learning paths and capability building
- **Knowledge Management**: Automated documentation and organizational learning
- **Best Practice Evolution**: Continuously updated recommendations

### **🛡️ Enterprise-Grade Safety & Compliance**

- **Atomic Operations**: All changes are versioned, tested, and reversible
- **Security-First Design**: Built-in security scanning and compliance checking
- **Quality Gates**: Automated quality assurance with customizable thresholds
- **Audit Trails**: Comprehensive logging for enterprise compliance
- **Containerized Safety**: Isolated execution of dangerous commands via Dagger containers

## Command Discovery & Usage

### **Quick Access Patterns**

```bash
# Instant project setup and analysis
/bootstrap-project web-app typescript cloud
/analyze-project
/health-check comprehensive

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
2. **Build Foundation**: Use `/bootstrap-project` and `/harden` for solid project setup  
3. **Establish Quality**: Implement `/pre-commit`, `/code-review`, and `/best-practices`
4. **Enable Learning**: Use `/learn` and `/troubleshoot` for continuous development
5. **Scale Operations**: Leverage `/workflow-builder` and `/sprint-planning` for team coordination

### **Advanced Prompt Optimization**

The `beta-prompts/` directory contains a comprehensive Python-based optimization system:

- **Context Analysis**: Automated analysis of prompt context patterns
- **Semantic Clustering**: Intelligent grouping of similar prompts
- **Performance Scoring**: Quantitative evaluation of prompt effectiveness
- **Optimization Engine**: Automated prompt improvement algorithms
- **Quality Validation**: Comprehensive validation and testing framework
- **Batch Processing**: Efficient processing of multiple prompts
- **Metric Analysis**: Detailed performance metrics and reporting
- **Workflow Integration**: Seamless integration with existing workflows

### **Workflow Integration Examples**

#### **Complete Project Setup Workflow**

```bash
/bootstrap-project web-app typescript cloud
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
2. **Safety-First Approach**: Include comprehensive verification steps and rollback procedures
3. **Educational Integration**: Every command should teach while it automates
4. **Enterprise Focus**: Maintain production-grade security and compliance standards
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

### **1. Progressive Enhancement Architecture**

Commands are designed to work independently but gain power when combined, allowing teams to adopt the ecosystem gradually while maintaining full functionality at every step.

### **2. Learning-Integrated Automation**

Every command includes educational components, transforming routine automation into continuous skill development opportunities for teams.

### **3. Enterprise-Ready Compliance**

Built-in support for SOC2, GDPR, HIPAA, and other regulatory frameworks, with automated compliance checking and audit trail generation.

### **4. AI-Powered Contextual Adaptation**

Commands intelligently adapt to project characteristics, technology stacks, and team dynamics, providing personalized recommendations and workflows.

### **5. Comprehensive Ecosystem Thinking**

The 39 commands form a cohesive ecosystem where discovery leads to implementation, implementation enables learning, and learning drives continuous improvement.

## Advanced Usage Patterns

### **Enterprise Team Leadership**

- **Project Health Monitoring**: Continuous assessment using `/health-check` and `/prompt-stats`
- **Team Skill Development**: Coordinated learning paths via `/learn` and `/knowledge-base`
- **Process Optimization**: Data-driven improvements through `/workflow-builder` and analytics
- **Compliance Management**: Automated regulatory compliance via `/comply` and `/audit-security`

### **Senior Developer Productivity**

- **Intelligent Code Review**: AI-powered analysis with `/code-review` and educational explanations
- **Technical Debt Management**: ROI-based prioritization using `/tech-debt` and `/optimize`
- **Knowledge Sharing**: Automated documentation via `/document` and `/knowledge-base`
- **Continuous Integration**: Seamless CI/CD via `/setup-ci` and `/deploy`

### **Growing Developer Support**

- **Interactive Learning**: Hands-on tutorials via `/learn` integrated with real project work
- **Debugging Assistance**: Systematic troubleshooting via `/troubleshoot` with skill development
- **Best Practice Guidance**: Context-aware recommendations via `/best-practices`
- **Collaborative Development**: Team coordination via `/daily-standup` and `/sprint-planning`

## Technology Integration

### **Multi-Language Support**

- **Primary**: Python, TypeScript, JavaScript, Go, Rust, Java, C#, PHP, Ruby
- **Frameworks**: React, Vue, Angular, Django, FastAPI, Express, Spring Boot, Rails
- **Infrastructure**: Docker, Kubernetes, Terraform, AWS, GCP, Azure
- **Development Tools**: Git, GitHub Actions, GitLab CI, Jenkins, VS Code, JetBrains

### **Enterprise Platform Integration**

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
- **Best Practice Evolution**: Recommendations update based on industry trends
- **Performance Optimization**: Command efficiency improvements through analytics
- **Knowledge Enhancement**: Automated knowledge base updates via team interactions

## Important Usage Notes

### **Command Ecosystem Assumptions**

- All commands assume Claude Code's extended capabilities (file operations, MCP servers, git integration)
- Commands are designed for team environments with enterprise-grade security requirements
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

**This repository represents the future of AI-assisted development: where automation teaches, workflows learn, and every interaction builds team capability. The 39-command ecosystem transforms Claude Code into a comprehensive development platform that elevates teams, accelerates learning, and ensures enterprise-grade quality at every step.**

## Containerized Safety System

This repository includes a comprehensive safety system for executing potentially dangerous commands in isolated Dagger containers. **Use this system whenever running unfamiliar commands or scripts from the internet.**

### **Quick Safety Usage**

```bash
# Install Dagger (one-time setup)
curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.13.3 sh

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
- **[docs/CC-SDK.md](docs/CC-SDK.md)** - Advanced Claude Code SDK reference and integration guide
