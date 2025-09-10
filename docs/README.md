# ccprompts Documentation

**Documentation for the Claude Code command collection**

This directory contains documentation for the ccprompts project - a collection of 70 Claude Code commands organized into 12 phases for software development workflows.

---

## Documentation Overview

### **Quick Start**

- **[README.md](../README.md)** - Project overview and quick start guide
- **[USAGE-EXAMPLES.md](USAGE-EXAMPLES.md)** - Real-world examples and tutorials

### **Reference Documentation**

- **[API-REFERENCE.md](API-REFERENCE.md)** - API specifications for all 70 commands
- **[COMMAND-REFERENCE.md](COMMAND-REFERENCE.md)** - Command documentation with parameters
- **[WORKFLOW-GUIDE.md](WORKFLOW-GUIDE.md)** - Workflow patterns and automation

### **Developer Resources**

- **[DEVELOPER-GUIDE.md](DEVELOPER-GUIDE.md)** - Development environment setup and contribution guide
- **[CC-SDK.md](CC-SDK.md)** - Advanced Claude Code SDK reference

### **Project Management**

- **[CI-CD-ROLLBACK-PLAN.md](CI-CD-ROLLBACK-PLAN.md)** - CI/CD and rollback procedures

---

## Getting Started

### **For New Users**

1. Start with **[README.md](../README.md)** for project overview
2. Browse **[USAGE-EXAMPLES.md](USAGE-EXAMPLES.md)** for practical examples
3. Reference **[COMMAND-REFERENCE.md](COMMAND-REFERENCE.md)** for specific commands
4. For ideas/feedback, use **[GitHub Issues](https://github.com/ursisterbtw/ccprompts/issues)**

### **For Developers**

1. Read **[DEVELOPER-GUIDE.md](DEVELOPER-GUIDE.md)** for setup instructions
2. Study **[API-REFERENCE.md](API-REFERENCE.md)** for integration patterns
3. Review **[CC-SDK.md](CC-SDK.md)** for advanced SDK usage

### **For Team Leads**

1. Explore **[WORKFLOW-GUIDE.md](WORKFLOW-GUIDE.md)** for team collaboration patterns
2. Reference **[USAGE-EXAMPLES.md](USAGE-EXAMPLES.md)** for enterprise scenarios
3. Review **[DEVELOPER-GUIDE.md](DEVELOPER-GUIDE.md)** for quality assurance processes

---

## Documentation Structure

### **API Reference (API-REFERENCE.md)**

Specifications for the 70-command collection including:

- Command structure standards
- Phase organization (00-11)
- Parameter specifications
- Integration patterns
- Safety system documentation
- Error handling procedures

### **Command Reference (COMMAND-REFERENCE.md)**

Detailed documentation for each command including:

- Usage syntax and parameters
- Real-world examples
- Integration patterns
- Environment variables
- Configuration options

### **Usage Examples (USAGE-EXAMPLES.md)**

Practical tutorials and examples covering:

- Quick start scenarios (5-10 minutes)
- Development workflows (full-stack, legacy modernization)
- Learning pathways (beginner to expert)
- Security-first development
- Team collaboration
- Enterprise scenarios

### **Workflow Guide (WORKFLOW-GUIDE.md)**

Workflow documentation including:

- Workflow fundamentals and components
- Common patterns (Analysis-Plan-Execute, Validate-Implement-Test)
- Multi-agent coordination and context-aware workflows
- Team collaboration workflows
- Automation and best practices

### **Developer Guide (DEVELOPER-GUIDE.md)**

Development documentation including:

- Architecture overview and design principles
- Development environment setup
- Command and prompt development
- Quality assurance framework
- Testing and CI/CD pipeline
- Integration patterns and customization

---

## [SEARCH] Finding Information

### **By Use Case**

#### **New Project Setup**

- [Quick Start Examples](USAGE-EXAMPLES.md#quick-start-examples)
- [Project Initialization Workflow](WORKFLOW-GUIDE.md#development-lifecycle-workflows)
- [Phase 00-02 Commands](COMMAND-REFERENCE.md#phase-00-02-initial-workflow--setup)

#### **Security Implementation**

- [Security-First Development](USAGE-EXAMPLES.md#security-first-development)
- [Security Hardening Pipeline](WORKFLOW-GUIDE.md#security-first-workflows)
- [Security Commands](COMMAND-REFERENCE.md) (search for `/audit-security`, `/harden`, `/comply`)

#### **Team Collaboration**

- [Team Collaboration](USAGE-EXAMPLES.md#team-collaboration)
- [Team Collaboration Workflows](WORKFLOW-GUIDE.md#team-collaboration-workflows)
- [Collaboration Commands](COMMAND-REFERENCE.md) (search for `/code-review`, `/daily-standup`)

#### **AI-Native Development**

- [AI-Powered Development](USAGE-EXAMPLES.md#ai-powered-development-session)
- [Advanced Orchestration](WORKFLOW-GUIDE.md#advanced-orchestration)
- [Phase 10 AI-Native Commands](COMMAND-REFERENCE.md#phase-10-ai-native-development)

#### **Enterprise Operations**

- [Enterprise Scenarios](USAGE-EXAMPLES.md#enterprise-scenarios)
- [Enterprise Workflows](WORKFLOW-GUIDE.md#enterprise-workflows)
- [Phase 11 Enterprise Commands](COMMAND-REFERENCE.md#phase-11-enterprise--scale)

### **By Command Phase**

#### **Foundation (Phase 00-02)**

- `/analyze-project` - [Command Ref](COMMAND-REFERENCE.md#analyze-project) | [Examples](USAGE-EXAMPLES.md#new-project-setup-5-minutes)
- `/document` - [Command Ref](COMMAND-REFERENCE.md#document) | [Workflows](WORKFLOW-GUIDE.md#quality-assurance-workflows)

#### **Development (Phase 03-05)**  

- `/debug-session` - [Command Ref](COMMAND-REFERENCE.md#debug-session) | [Troubleshooting](WORKFLOW-GUIDE.md#troubleshooting-workflows)
- `/refactor` - [Command Ref](COMMAND-REFERENCE.md#refactor) | [Examples](USAGE-EXAMPLES.md#legacy-system-modernization)

#### **Operations (Phase 06-08)**

- `/deploy` - [Command Ref](COMMAND-REFERENCE.md#deploy) | [Workflows](WORKFLOW-GUIDE.md#development-lifecycle-workflows)
- `/setup-ci` - [Command Ref](COMMAND-REFERENCE.md#setup-ci) | [Examples](USAGE-EXAMPLES.md#new-project-setup-5-minutes)

#### **AI-Native (Phase 09-11)**

- `/agent-orchestrate` - [Command Ref](COMMAND-REFERENCE.md#agent-orchestrate) | [Advanced](WORKFLOW-GUIDE.md#multi-agent-workflows)
- `/ai-pair-program` - [Command Ref](COMMAND-REFERENCE.md#ai-pair-program) | [Examples](USAGE-EXAMPLES.md#ai-powered-development-session)

---

## [TOOLS] Integration Resources

### **Claude Code SDK Integration**

- [Advanced SDK Guide](CC-SDK.md)
- [Integration Patterns](API-REFERENCE.md#integration-patterns)
- [Custom Development](DEVELOPER-GUIDE.md#integration-patterns)

### **MCP Server Integration**

- [MCP Development](DEVELOPER-GUIDE.md#mcp-server-development)
- [Custom MCP Servers](COMMAND-REFERENCE.md#mcp)
- [Advanced Tool Chains](WORKFLOW-GUIDE.md#advanced-orchestration)

### **CI/CD Integration**

- [CI/CD Pipeline](DEVELOPER-GUIDE.md#cicd-pipeline)
- [GitHub Actions](WORKFLOW-GUIDE.md#automated-workflow-triggers)
- [Quality Gates](API-REFERENCE.md#safety-system)

---

## Tool: Development and Contributing

### **Setting Up Development Environment**

1. Follow [Development Environment](DEVELOPER-GUIDE.md#development-environment) setup
2. Review [Command Development](DEVELOPER-GUIDE.md#command-development) guidelines
3. Study [Quality Assurance](DEVELOPER-GUIDE.md#quality-assurance) requirements

### **Contributing New Commands**

1. Use [Command Structure](DEVELOPER-GUIDE.md#command-structure) standards
2. Follow [Command Development Workflow](DEVELOPER-GUIDE.md#command-development-workflow)
3. Review [Quality Guidelines](DEVELOPER-GUIDE.md#prompt-quality-guidelines)

### **Contributing Documentation**

1. Follow [Documentation Standards](DEVELOPER-GUIDE.md#documentation-maintenance)
2. Use established [Content Standards](../CONTRIBUTING.md#quality-standards)
3. Run validation: `bun run validate`

---

## [STATS] Project Statistics

### **Command Collection**

- **70 Commands** across 12 phases
- **21 Prompts** across 10 categories
- Safety validation and rollback capabilities
- Agent creation system with template wizard

### **Documentation Coverage**

- **API Reference**: Specification for all 70 commands
- Community Discussions: use GitHub Issues for ideas and feedback
- **Usage Examples**: Real-world scenarios and tutorials
- **Workflow Guide**: Workflow patterns
- **Developer Guide**: Development and integration documentation

### **Quality Metrics**

- **Validation**: Multi-dimensional validation system
- **Link Checking**: Internal and external links verified
- **Structure**: Consistent format and organization
- **Safety**: Dagger-based containerized execution

---

## 🆘 Getting Help

### **Documentation Issues**

- **Missing Information**: Check multiple documentation files - information may be distributed
- **Outdated Examples**: Reference the most recent command versions in [COMMAND-REFERENCE.md](COMMAND-REFERENCE.md)
- **Integration Problems**: Consult [DEVELOPER-GUIDE.md](DEVELOPER-GUIDE.md) for troubleshooting

### **Command Usage Help**

- **Syntax Questions**: See [COMMAND-REFERENCE.md](COMMAND-REFERENCE.md) for complete parameter documentation
- **Workflow Questions**: Browse [WORKFLOW-GUIDE.md](WORKFLOW-GUIDE.md) for pattern examples
- **Examples**: Check [USAGE-EXAMPLES.md](USAGE-EXAMPLES.md) for similar use cases

### **Community Support**

- **GitHub Issues**: [Report bugs or request features](https://github.com/ursisterbtw/ccprompts/issues)
- Community Discussions: use GitHub Issues for questions and ideas
- **Contributing**: See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

---

## [REFERENCE] Quick Reference

### **Essential Commands**

```bash
# Project analysis and setup
/analyze-project --scope=comprehensive
/setup-ci --platform=github --features=testing,security,deployment

# Development workflow
/ai-pair-program --mode=collaborative --context-aware=true
/test --strategy=comprehensive --coverage=90
/code-review --type=comprehensive --educational=true

# Security and compliance
/audit-security --level=strict --compliance=soc2
/harden --strategy=defense-in-depth
/comply --framework=soc2 --automation=full

# Deployment and operations
/deploy --environment=production --strategy=blue-green --validation=extensive
/monitor --security-focus=true --performance=true
/health-check --comprehensive=true --continuous=true
```

### **Common Workflows**

```bash
# Security-first development
/analyze-project → /audit-security → /harden → /setup-ci → /deploy

# AI-native development  
/ai-pair-program → /semantic-understand → /predictive-dev → /deploy

# Enterprise coordination
/multi-repo analyze → /governance enforce → /scale-optimize → /monitor
```

---

This documentation covers the ccprompts command collection. Each document focuses on specific aspects while maintaining cross-references for navigation. The documentation supports users from beginners learning basic commands to teams implementing workflows.
