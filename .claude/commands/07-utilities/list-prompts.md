---
description: Discover and browse all available commands with intelligent filtering and search
allowed-tools: Read, Bash(find:*), Bash(grep:*)
---

# Command Discovery & Browsing

## Command Ecosystem Analysis

- Available commands: !`find .claude/commands -name "*.md" 2>/dev/null | wc -l || echo "0"` commands
- Command categories: !`find .claude/commands -type d -mindepth 1 -maxdepth 1 2>/dev/null | wc -l || echo "0"` categories
- Personal commands: !`find ~/.claude/commands -name "*.md" 2>/dev/null | wc -l || echo "0"` personal commands
- MCP commands: !`claude mcp list 2>/dev/null | grep -c "prompts:" || echo "0"` MCP prompts

## Search Parameters

Filter: **$ARGUMENTS** (e.g., "security", "development", "advanced", "team")

## 🔍 Command Discovery System

### 1. Command Categories Overview

#### 00-workflow/ (Meta-orchestration)

- **intelligent-chain**: Smart command sequencing with natural language
- **workflow-builder**: Visual workflow creation and automation
- **smart-suggest**: Context-aware command recommendations

#### 01-foundation/ (Project Setup)

- **bootstrap-project**: Complete project initialization
- **analyze-project**: Comprehensive project analysis
- **validate-environment**: Development environment validation
- **modernize**: Legacy system modernization

#### 02-development/ (Code Quality)

- **refactor**: Safe multi-file refactoring
- **code-review**: AI-powered code analysis
- **optimize**: Performance optimization
- **tech-debt**: Technical debt management
- **health-check**: System health assessment

#### 03-security/ (Protection)

- **audit-security**: OWASP-compliant security scanning
- **harden**: Security hardening workflows
- **comply**: Regulatory compliance automation
- **incident-response**: Security incident management

#### 04-testing/ (Validation)

- **test**: Comprehensive test generation
- **pre-commit**: Quality gates and validation
- **quick-fix**: Targeted issue resolution

#### 05-deployment/ (Operations)

- **setup-ci**: CI/CD pipeline automation
- **deploy**: Production deployment workflows
- **backup**: Comprehensive backup strategies
- **migrate**: Database and system migrations
- **monitor**: Production monitoring setup

#### 06-collaboration/ (Teamwork)

- **daily-standup**: Team coordination automation
- **sprint-planning**: Intelligent sprint management
- **release-notes**: Multi-audience communication
- **workflow-builder**: Team workflow automation

#### 07-utilities/ (System Tools)

- **list-prompts**: Command discovery (this command)
- **search-prompts**: Intelligent content search
- **prompt-stats**: Usage analytics and metrics
- **export-config**: Configuration sharing
- **debug-session**: Advanced troubleshooting
- **git**: Advanced Git operations
- **mcp**: MCP server integration

## 📊 Command Analytics & Filtering

### By Complexity Level

- **Beginner**: Basic commands for getting started
- **Intermediate**: Standard development workflows
- **Advanced**: Complex multi-step operations
- **Expert**: Specialized enterprise workflows

### By Technology Stack

- **Web Development**: React, Vue, Angular, Node.js
- **Backend Development**: APIs, databases, microservices
- **Mobile Development**: React Native, Flutter, native apps
- **DevOps**: Infrastructure, deployment, monitoring
- **Data Science**: Python, R, Jupyter, ML pipelines

### By Team Role

- **Developers**: Code-focused commands
- **DevOps Engineers**: Infrastructure and deployment
- **Security Engineers**: Security and compliance
- **Product Managers**: Planning and coordination
- **Team Leads**: Management and oversight

## 🎯 Smart Command Recommendations

### Context-Aware Suggestions

Based on your current project:

- **Project type detection**: Recommend relevant commands
- **Recent activity analysis**: Suggest next logical steps
- **Team workflow patterns**: Align with team practices
- **Technology stack optimization**: Stack-specific recommendations

### Workflow Chaining

- **Command sequences**: Natural progression patterns
- **Dependency mapping**: Required prerequisite commands
- **Optimization paths**: Efficient workflow combinations
- **Learning progressions**: Skill-building command sequences

## 📚 Command Documentation

### Command Metadata

```
Command: /project:bootstrap-project
Category: Foundation
Complexity: Intermediate
Dependencies: git, npm/pip/cargo
Estimated Time: 5-15 minutes
Team Impact: High (shared setup)
```

### Usage Examples

```bash
# Quick project setup
/project:bootstrap-project web-app typescript

# Security-focused analysis
/project:audit-security dependencies

# Team coordination
/project:daily-standup slack team-alpha
```

## 🔗 Integration Discovery

### MCP Server Commands

- **Available servers**: List connected MCP servers
- **Server capabilities**: Show tools and prompts per server
- **Authentication status**: OAuth and connection health
- **Resource mapping**: Available MCP resources

### Personal vs Project Commands

- **Personal commands** (`/user:`): Available across all projects
- **Project commands** (`/project:`): Shared with team
- **MCP commands** (`/mcp__`): Dynamic server capabilities

## 🚀 Advanced Discovery Features

### Command Search & Filtering

```bash
# Find security-related commands
/project:list-prompts security

# Show beginner-friendly commands
/project:list-prompts beginner

# Filter by technology
/project:list-prompts typescript
```

### Interactive Command Explorer

- **Category browsing**: Navigate by functional area
- **Tag-based filtering**: Multiple criteria search
- **Usage frequency**: Popular command highlighting
- **Recent commands**: Quick access to recently used

### Command Comparison

- **Similar commands**: Alternative approaches
- **Complexity comparison**: Effort vs. benefit analysis
- **Prerequisites**: Required setup or knowledge
- **Output expectations**: What each command produces

## 📋 Command Discovery Workflow

1. **Assess current needs**: What are you trying to accomplish?
2. **Browse categories**: Find relevant functional area
3. **Filter by criteria**: Complexity, technology, role
4. **Review documentation**: Understand command capabilities
5. **Try commands**: Start with simpler versions first
6. **Chain workflows**: Combine commands for complex tasks

Discover and navigate the complete command ecosystem with intelligent filtering and recommendations!

## 🆕 Extended Browsing Categories (migrated from legacy extras command)

### By Development Stage

- **Project Setup**: Bootstrap, initialization, and configuration prompts
- **Development**: Active coding, refactoring, and feature development
- **Quality Assurance**: Testing, security, and compliance prompts
- **Deployment**: CI/CD, infrastructure, and release management
- **Maintenance**: Monitoring, optimization, and legacy modernization

### By Complexity Level

- **Beginner**: Simple, single-purpose prompts with clear instructions
- **Intermediate**: Multi-step prompts requiring some technical knowledge
- **Advanced**: Complex workflows requiring deep technical expertise
- **Enterprise**: Comprehensive prompts for large-scale operations

### By Time Investment

- **Quick Wins**: 15-60 minutes, immediate impact
- **Short Projects**: 2-8 hours, focused improvements
- **Strategic Initiatives**: 1-5 days, comprehensive changes
- **Long-term Programs**: 1+ weeks, major transformations

### By Team Size

- **Solo Developer**: Individual productivity and learning focused
- **Small Team**: 2-10 developers, coordination and standards
- **Medium Team**: 10-50 developers, process and governance
- **Enterprise**: 50+ developers, compliance and scale
