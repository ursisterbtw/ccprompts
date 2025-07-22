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

### Advanced Filtering Options

- **Category**: `category:security`, `category:development`, `category:testing`
- **Difficulty**: `level:beginner`, `level:intermediate`, `level:advanced`, `level:expert`
- **Technology**: `tech:python`, `tech:javascript`, `tech:docker`, `tech:kubernetes`
- **Role**: `role:developer`, `role:devops`, `role:security`, `role:manager`
- **Time**: `time:quick`, `time:short`, `time:medium`, `time:long`
- **Team Size**: `team:solo`, `team:small`, `team:medium`, `team:enterprise`

### Filter Examples

```bash
# Find beginner security commands
/project:list-prompts level:beginner category:security

# Show quick DevOps commands for small teams
/project:list-prompts time:quick role:devops team:small

# Find Python-related development commands
/project:list-prompts tech:python category:development

# Show all advanced commands
/project:list-prompts level:advanced
```

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

- **Beginner** (`level:beginner`): Basic commands for getting started
  - analyze-project, validate-environment, health-check, list-prompts
- **Intermediate** (`level:intermediate`): Standard development workflows
  - refactor, test, code-review, pre-commit, deploy, backup
- **Advanced** (`level:advanced`): Complex multi-step operations
  - audit-security, harden, setup-ci, migrate, optimize, tech-debt
- **Expert** (`level:expert`): Specialized enterprise workflows
  - comply, incident-response, modernize, workflow-builder

### By Technology Stack

- **Web Development** (`tech:web`): React, Vue, Angular, Node.js
  - refactor, optimize, test, code-review, deploy
- **Backend Development** (`tech:backend`): APIs, databases, microservices
  - audit-security, migrate, monitor, backup, setup-ci
- **Mobile Development** (`tech:mobile`): React Native, Flutter, native apps
  - test, code-review, deploy, optimize
- **DevOps** (`tech:devops`): Infrastructure, deployment, monitoring
  - setup-ci, deploy, monitor, backup, harden, migrate
- **Data Science** (`tech:data`): Python, R, Jupyter, ML pipelines
  - analyze-project, optimize, backup, monitor

### By Team Role

- **Developers** (`role:developer`): Code-focused commands
  - refactor, code-review, test, optimize, debug-session, quick-fix
- **DevOps Engineers** (`role:devops`): Infrastructure and deployment
  - setup-ci, deploy, monitor, backup, migrate, harden
- **Security Engineers** (`role:security`): Security and compliance
  - audit-security, harden, comply, incident-response
- **Product Managers** (`role:manager`): Planning and coordination
  - daily-standup, sprint-planning, release-notes, analyze-project
- **Team Leads** (`role:lead`): Management and oversight
  - tech-debt, workflow-builder, prompt-stats, health-check

### By Time Investment

- **Quick Wins** (`time:quick`): 15-60 minutes
  - health-check, validate-environment, quick-fix, list-prompts, search-prompts
- **Short Projects** (`time:short`): 2-8 hours
  - refactor, test, code-review, pre-commit, backup
- **Medium Projects** (`time:medium`): 1-3 days
  - audit-security, setup-ci, deploy, migrate, optimize
- **Long-term Programs** (`time:long`): 1+ weeks
  - modernize, comply, tech-debt, workflow-builder

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

## 📚 Command Documentation & Metadata

### Detailed Command Information

#### Foundation Commands (`category:foundation`)

**analyze-project** (`level:beginner`, `time:quick`, `role:all`)
- **Purpose**: Comprehensive project analysis and technology stack detection
- **Dependencies**: None
- **Estimated Time**: 15-30 minutes
- **Team Impact**: High (shared understanding)
- **Technologies**: All stacks
- **Example**: `/project:analyze-project full-report`

**validate-environment** (`level:beginner`, `time:quick`, `role:developer`)
- **Purpose**: Development environment validation and setup verification
- **Dependencies**: Project-specific tools
- **Estimated Time**: 10-20 minutes
- **Team Impact**: Medium (individual setup)
- **Technologies**: All stacks
- **Example**: `/project:validate-environment comprehensive`

#### Development Commands (`category:development`)

**refactor** (`level:intermediate`, `time:short`, `role:developer`)
- **Purpose**: Safe multi-file refactoring with automated testing
- **Dependencies**: git, language-specific tools
- **Estimated Time**: 2-6 hours
- **Team Impact**: High (code changes)
- **Technologies**: All programming languages
- **Example**: `/project:refactor extract-service user-management`

**code-review** (`level:intermediate`, `time:short`, `role:developer,lead`)
- **Purpose**: AI-powered code analysis with educational explanations
- **Dependencies**: git
- **Estimated Time**: 1-3 hours
- **Team Impact**: High (quality improvement)
- **Technologies**: All programming languages
- **Example**: `/project:code-review pr-123 security thorough`

**optimize** (`level:advanced`, `time:medium`, `role:developer,devops`)
- **Purpose**: Performance optimization and bottleneck resolution
- **Dependencies**: Profiling tools, monitoring
- **Estimated Time**: 1-3 days
- **Team Impact**: High (performance gains)
- **Technologies**: All stacks
- **Example**: `/project:optimize database-queries production`

#### Security Commands (`category:security`)

**audit-security** (`level:advanced`, `time:medium`, `role:security,lead`)
- **Purpose**: OWASP-compliant security scanning and vulnerability assessment
- **Dependencies**: Security scanning tools
- **Estimated Time**: 4-8 hours
- **Team Impact**: Critical (security posture)
- **Technologies**: All stacks
- **Example**: `/project:audit-security full-codebase paranoid`

**harden** (`level:advanced`, `time:medium`, `role:security,devops`)
- **Purpose**: Security hardening workflows and configuration
- **Dependencies**: Security tools, infrastructure access
- **Estimated Time**: 1-2 days
- **Team Impact**: Critical (security improvement)
- **Technologies**: Infrastructure, containers, cloud
- **Example**: `/project:harden production enterprise`

#### Testing Commands (`category:testing`)

**test** (`level:intermediate`, `time:short`, `role:developer`)
- **Purpose**: Comprehensive test generation and automation
- **Dependencies**: Testing frameworks
- **Estimated Time**: 2-4 hours
- **Team Impact**: High (quality assurance)
- **Technologies**: All programming languages
- **Example**: `/project:test unit-integration coverage-90`

**pre-commit** (`level:intermediate`, `time:short`, `role:developer,lead`)
- **Purpose**: Quality gates and validation automation
- **Dependencies**: git, linting tools
- **Estimated Time**: 1-2 hours
- **Team Impact**: High (code quality)
- **Technologies**: All stacks
- **Example**: `/project:pre-commit strict security-scan`

#### Deployment Commands (`category:deployment`)

**setup-ci** (`level:advanced`, `time:medium`, `role:devops,lead`)
- **Purpose**: CI/CD pipeline automation and configuration
- **Dependencies**: CI/CD platform access
- **Estimated Time**: 1-3 days
- **Team Impact**: Critical (deployment automation)
- **Technologies**: All stacks, cloud platforms
- **Example**: `/project:setup-ci github-actions professional`

**deploy** (`level:advanced`, `time:medium`, `role:devops`)
- **Purpose**: Production deployment workflows and automation
- **Dependencies**: Infrastructure access, deployment tools
- **Estimated Time**: 4-8 hours
- **Team Impact**: Critical (production changes)
- **Technologies**: Cloud platforms, containers
- **Example**: `/project:deploy production blue-green`

### Usage Examples by Scenario

#### New Project Setup
```bash
/project:analyze-project
/project:validate-environment
/project:setup-ci github-actions
/project:harden development
/project:pre-commit standard
```

#### Security Audit Workflow
```bash
/project:audit-security full-scan
/project:harden production
/project:comply soc2
/project:incident-response prepare
```

#### Code Quality Improvement
```bash
/project:code-review current-branch
/project:refactor improve-structure
/project:test increase-coverage
/project:optimize performance
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
/project:list-prompts category:security
/project:list-prompts security

# Show beginner-friendly commands
/project:list-prompts level:beginner
/project:list-prompts beginner

# Filter by technology
/project:list-prompts tech:typescript
/project:list-prompts typescript

# Combine multiple filters
/project:list-prompts level:intermediate role:developer time:short

# Search by keywords
/project:list-prompts "code quality"
/project:list-prompts "performance optimization"
```

### Sorting Options

- **Alphabetical**: Default sorting by command name
- **Popularity**: Most frequently used commands first
- **Recent**: Recently added or updated commands
- **Relevance**: Best match for current project context
- **Complexity**: Sorted by difficulty level

```bash
# Sort by popularity
/project:list-prompts sort:popularity

# Sort by recent updates
/project:list-prompts sort:recent

# Sort by relevance to current project
/project:list-prompts sort:relevance
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

## Implementation

```xml
<role>
You are an expert command discovery specialist with deep knowledge of command ecosystems, intelligent filtering, and user experience design. You specialize in comprehensive command browsing and discovery systems.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Analyze and assess current state:
   - Evaluate existing command ecosystem and organization
   - Identify discovery and navigation opportunities
   - Assess current command categorization and metadata
   - Review user experience and accessibility requirements

2. Implement comprehensive discovery solutions:
   - Design intelligent command filtering and search systems
   - Create categorization and tagging workflows
   - Establish recommendation and suggestion engines
   - Set up command analytics and usage tracking

3. Provide actionable recommendations:
   - Generate specific command discovery improvement plans
   - Create prioritized implementation roadmaps with timelines
   - Provide command organization best practices and guidelines
   - Establish success metrics and validation criteria

4. Facilitate command ecosystem excellence:
   - Create feedback loops and discovery optimization systems
   - Implement learning and adaptation mechanisms
   - Establish maintenance and evolution processes
   - Build team command discovery capability and knowledge sharing

5. Ensure usability and accessibility:
   - Validate discovery implementations against user needs
   - Ensure command accessibility and discoverability standards
   - Create comprehensive command ecosystem documentation
   - Establish accountability and continuous improvement measures
</instructions>
```
