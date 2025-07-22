# Command Reference

**Complete reference for all 70 commands in the ccprompts ecosystem**

This document provides detailed specifications for each command across all 11 strategic phases, including parameters, usage patterns, and integration examples.

---

## Table of Contents

- [Phase Organization](#phase-organization)
- [Command Quick Reference](#command-quick-reference)
- [Phase 00-02: Initial Workflow & Setup](#phase-00-02-initial-workflow--setup)
- [Phase 03-05: Development & Quality](#phase-03-05-development--quality)
- [Phase 06-08: Deployment & Operations](#phase-06-08-deployment--operations)
- [Phase 09: Advanced Agentic Capabilities](#phase-09-advanced-agentic-capabilities)
- [Phase 10: AI-Native Development](#phase-10-ai-native-development)
- [Phase 11: Enterprise & Scale](#phase-11-enterprise--scale)
- [Parameter Conventions](#parameter-conventions)
- [Integration Patterns](#integration-patterns)

---

## Phase Organization

The 70 commands are organized into 11 strategic phases representing the complete software development lifecycle:

- **Phase 00-02**: Foundation (10 commands)
- **Phase 03-05**: Development (12 commands)  
- **Phase 06-08**: Operations (18 commands)
- **Phase 09**: Agentic AI (12 commands)
- **Phase 10**: AI-Native (10 commands)
- **Phase 11**: Enterprise (8 commands)

---

## Command Quick Reference

### By Complexity Level

#### **Basic Commands** (Quick execution, minimal setup)

```bash
/analyze-project        # Project analysis and assessment
/health-check          # System health validation
/validate-environment  # Environment verification
/list-prompts         # Browse available commands
/search-prompts       # Find specific functionality
```

#### **Intermediate Commands** (Multi-step workflows)

```bash
/setup-ci             # CI/CD pipeline configuration
/audit-security       # Security assessment and hardening
/test                 # Comprehensive testing workflows
/document            # Documentation generation
/refactor            # Code refactoring and modernization
```

#### **Advanced Commands** (Complex operations, enterprise features)

```bash
/deploy              # Production deployment workflows
/governance          # Enterprise governance and compliance
/multi-repo          # Multi-repository coordination
/agent-orchestrate   # Multi-agent workflow coordination
/ai-pair-program     # Advanced AI-assisted development
```

#### **Expert Commands** (Specialized enterprise operations)

```bash
/compliance-enterprise # Enterprise compliance automation
/scale-optimize        # Performance optimization at scale
/resource-manage       # Enterprise resource management
/mcp-extend           # Custom MCP server development
/workflow-visual      # Visual workflow design and automation
```

---

## Phase 00-02: Initial Workflow & Setup

Foundation commands for project initialization and analysis.

### `/analyze-project`

**AI-powered comprehensive project assessment**

```bash
/analyze-project [--scope=<level>] [--focus=<areas>] [--output=<format>]
```

**Parameters:**

- `--scope`: Analysis depth (`basic`|`comprehensive`|`deep`) [default: `comprehensive`]
- `--focus`: Focus areas (`architecture`|`security`|`performance`|`quality`) [default: `all`]
- `--output`: Output format (`summary`|`detailed`|`diagnostic`|`json`) [default: `detailed`]

**Examples:**

```bash
# Basic project overview
/analyze-project --scope=basic --output=summary

# Comprehensive security-focused analysis
/analyze-project --scope=deep --focus=security --output=detailed

# Machine-readable output for automation
/analyze-project --scope=comprehensive --output=json
```

**Returns:** Project health report, architecture analysis, recommendations

---

### `/intelligent-chain`

**Natural language workflow automation**

```bash
/intelligent-chain "<workflow-description>" [--complexity=<level>] [--safety=<mode>]
```

**Parameters:**

- `workflow-description`: Natural language description of desired workflow
- `--complexity`: Workflow complexity (`simple`|`intermediate`|`complex`) [default: `intermediate`]
- `--safety`: Safety mode (`strict`|`balanced`|`permissive`) [default: `balanced`]

**Examples:**

```bash
# Simple development workflow
/intelligent-chain "set up testing and deploy to staging" --complexity=simple

# Complex multi-step automation
/intelligent-chain "analyze security, fix vulnerabilities, and deploy with monitoring" --complexity=complex --safety=strict
```

**Returns:** Automated workflow execution with step-by-step results

---

### `/document`

**Comprehensive documentation generation**

```bash
/document [--type=<doc-type>] [--audience=<target>] [--format=<format>] [--scope=<scope>]
```

**Parameters:**

- `--type`: Documentation type (`api`|`user-guide`|`technical`|`comprehensive`) [default: `comprehensive`]
- `--audience`: Target audience (`developers`|`users`|`stakeholders`|`all`) [default: `developers`]
- `--format`: Output format (`markdown`|`html`|`pdf`|`confluence`) [default: `markdown`]
- `--scope`: Documentation scope (`current-project`|`full-codebase`|`specific-module`) [default: `current-project`]

**Examples:**

```bash
# API documentation for developers
/document --type=api --audience=developers --format=markdown

# User guide in HTML format
/document --type=user-guide --audience=users --format=html

# Comprehensive technical documentation
/document --type=comprehensive --audience=all --format=markdown --scope=full-codebase
```

**Returns:** Generated documentation files with navigation and search

---

### `/learn`

**Interactive skill development**

```bash
/learn [<topic>] [--level=<level>] [--mode=<mode>] [--hands-on=<enabled>]
```

**Parameters:**

- `topic`: Learning topic (`recommended`|`<technology-name>`) [default: `recommended`]
- `--level`: Skill level (`beginner`|`intermediate`|`advanced`|`expert`) [default: `intermediate`]
- `--mode`: Learning mode (`guided`|`self-paced`|`interactive`) [default: `interactive`]
- `--hands-on`: Enable practical exercises (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Recommended learning path for current project
/learn --level=intermediate --hands-on=true

# Advanced TypeScript learning
/learn typescript --level=advanced --mode=guided

# Self-paced security learning
/learn security --level=beginner --mode=self-paced
```

**Returns:** Interactive learning sessions with exercises and validation

---

### `/mcp`

**MCP server integration and testing**

```bash
/mcp <action> [<server-name>] [--config=<config-file>] [--test=<enabled>]
```

**Parameters:**

- `action`: MCP action (`install`|`configure`|`test`|`discover`|`remove`)
- `server-name`: MCP server identifier [required for most actions]
- `--config`: Configuration file path [default: `.mcp.json`]
- `--test`: Enable testing mode (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Discover available MCP servers
/mcp discover

# Install and configure filesystem MCP server
/mcp install filesystem --test=true

# Test existing MCP server configuration
/mcp test github --config=custom-mcp.json
```

**Returns:** MCP server status, configuration details, test results

---

## Phase 03-05: Development & Quality

Core development workflow commands for building and maintaining quality code.

### `/debug-session`

**Advanced troubleshooting and debugging**

```bash
/debug-session [--mode=<mode>] [--target=<target>] [--interactive=<enabled>]
```

**Parameters:**

- `--mode`: Debug mode (`guided`|`autonomous`|`collaborative`) [default: `guided`]
- `--target`: Debug target (`error`|`performance`|`behavior`|`all`) [default: `error`]
- `--interactive`: Enable interactive debugging (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Guided error debugging
/debug-session --mode=guided --target=error

# Autonomous performance debugging
/debug-session --mode=autonomous --target=performance --interactive=false

# Collaborative debugging session
/debug-session --mode=collaborative --target=all
```

**Returns:** Debug analysis, solution recommendations, fix implementation

---

### `/refactor`

**Safe multi-file code transformations**

```bash
/refactor [--scope=<scope>] [--strategy=<strategy>] [--preserve=<elements>] [--dry-run=<enabled>]
```

**Parameters:**

- `--scope`: Refactoring scope (`file`|`module`|`codebase`) [default: `module`]
- `--strategy`: Strategy (`conservative`|`moderate`|`aggressive`) [default: `conservative`]
- `--preserve`: Elements to preserve (`comments`|`formatting`|`api`|`all`) [default: `all`]
- `--dry-run`: Preview changes without applying (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Conservative module refactoring with preview
/refactor --scope=module --strategy=conservative --dry-run=true

# Aggressive codebase refactoring preserving API
/refactor --scope=codebase --strategy=aggressive --preserve=api --dry-run=false

# File-level refactoring with all preservation
/refactor --scope=file --strategy=moderate --preserve=all
```

**Returns:** Refactoring plan, change preview, implementation results

---

### `/optimize`

**Performance optimization across stack**

```bash
/optimize [--focus=<areas>] [--level=<intensity>] [--measure=<enabled>] [--target=<metrics>]
```

**Parameters:**

- `--focus`: Optimization focus (`performance`|`memory`|`network`|`database`|`all`) [default: `all`]
- `--level`: Optimization intensity (`conservative`|`moderate`|`aggressive`) [default: `moderate`]
- `--measure`: Enable performance measurement (`true`|`false`) [default: `true`]
- `--target`: Target metrics (comma-separated list) [default: `latency,throughput,memory`]

**Examples:**

```bash
# Conservative performance optimization with measurement
/optimize --focus=performance --level=conservative --measure=true

# Aggressive memory optimization
/optimize --focus=memory --level=aggressive --target=memory,heap

# Full-stack optimization
/optimize --focus=all --level=moderate --target=latency,throughput,memory,network
```

**Returns:** Performance analysis, optimization recommendations, implementation

---

### `/test`

**Comprehensive testing workflows**

```bash
/test [--strategy=<strategy>] [--types=<test-types>] [--coverage=<target>] [--parallel=<enabled>]
```

**Parameters:**

- `--strategy`: Testing strategy (`basic`|`comprehensive`|`performance`|`security`) [default: `comprehensive`]
- `--types`: Test types (`unit`|`integration`|`e2e`|`all`) [default: `all`]
- `--coverage`: Coverage target (percentage) [default: `80`]
- `--parallel`: Enable parallel execution (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Comprehensive testing with 90% coverage
/test --strategy=comprehensive --types=all --coverage=90

# Security-focused testing
/test --strategy=security --types=integration,e2e --parallel=true

# Basic unit testing
/test --strategy=basic --types=unit --coverage=70 --parallel=false
```

**Returns:** Test results, coverage report, quality metrics

---

### `/troubleshoot`

**Systematic debugging assistance**

```bash
/troubleshoot [--area=<domain>] [--guided=<enabled>] [--complexity=<level>]
```

**Parameters:**

- `--area`: Problem domain (`build`|`runtime`|`deployment`|`performance`|`general`) [default: `general`]
- `--guided`: Enable guided troubleshooting (`true`|`false`) [default: `true`]
- `--complexity`: Problem complexity (`simple`|`intermediate`|`complex`) [default: `intermediate`]

**Examples:**

```bash
# Guided build troubleshooting
/troubleshoot --area=build --guided=true --complexity=intermediate

# Complex performance issue resolution
/troubleshoot --area=performance --complexity=complex --guided=false

# General troubleshooting with guidance
/troubleshoot --area=general --guided=true --complexity=simple
```

**Returns:** Problem diagnosis, solution steps, verification procedures

---

## Phase 06-08: Deployment & Operations

Production-focused commands for deployment, operations, and team collaboration.

### `/deploy`

**Production deployment workflows**

```bash
/deploy [--environment=<env>] [--strategy=<strategy>] [--validation=<level>] [--rollback=<enabled>]
```

**Parameters:**

- `--environment`: Target environment (`staging`|`production`|`dev`|`test`) [default: `staging`]
- `--strategy`: Deployment strategy (`blue-green`|`rolling`|`canary`|`recreate`) [default: `rolling`]
- `--validation`: Validation level (`basic`|`comprehensive`|`extensive`) [default: `comprehensive`]
- `--rollback`: Enable automatic rollback (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Production deployment with blue-green strategy
/deploy --environment=production --strategy=blue-green --validation=extensive

# Staging deployment with comprehensive validation
/deploy --environment=staging --strategy=rolling --validation=comprehensive

# Canary deployment with rollback
/deploy --environment=production --strategy=canary --rollback=true
```

**Returns:** Deployment status, health checks, rollback procedures

---

### `/setup-ci`

**CI/CD pipeline automation**

```bash
/setup-ci [--platform=<platform>] [--features=<feature-list>] [--complexity=<level>]
```

**Parameters:**

- `--platform`: CI/CD platform (`github`|`gitlab`|`jenkins`|`azure`|`aws`) [default: `github`]
- `--features`: Feature list (comma-separated: `testing,security,deployment,monitoring`) [default: `testing,security`]
- `--complexity`: Pipeline complexity (`basic`|`standard`|`advanced`|`enterprise`) [default: `standard`]

**Examples:**

```bash
# GitHub Actions with comprehensive features
/setup-ci --platform=github --features=testing,security,deployment,monitoring --complexity=advanced

# Basic GitLab CI setup
/setup-ci --platform=gitlab --features=testing --complexity=basic

# Enterprise Jenkins configuration
/setup-ci --platform=jenkins --features=testing,security,deployment,monitoring,compliance --complexity=enterprise
```

**Returns:** Pipeline configuration files, setup instructions, validation

---

### `/pre-commit`

**Quality gates and validation**

```bash
/pre-commit [--level=<strictness>] [--checks=<check-list>] [--fix=<auto-fix>]
```

**Parameters:**

- `--level`: Strictness level (`permissive`|`standard`|`strict`|`paranoid`) [default: `standard`]
- `--checks`: Check types (`formatting`|`linting`|`security`|`testing`|`all`) [default: `all`]
- `--fix`: Enable automatic fixes (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Strict pre-commit with all checks
/pre-commit --level=strict --checks=all --fix=true

# Paranoid security-focused checks
/pre-commit --level=paranoid --checks=security,linting --fix=false

# Standard checks with formatting fixes
/pre-commit --level=standard --checks=formatting,linting --fix=true
```

**Returns:** Pre-commit configuration, hook setup, validation results

---

### `/code-review`

**AI-powered code analysis**

```bash
/code-review [--type=<review-type>] [--focus=<areas>] [--educational=<enabled>]
```

**Parameters:**

- `--type`: Review type (`comprehensive`|`security`|`performance`|`style`|`architecture`) [default: `comprehensive`]
- `--focus`: Focus areas (`security`|`performance`|`maintainability`|`testing`|`all`) [default: `all`]
- `--educational`: Include educational explanations (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Comprehensive educational code review
/code-review --type=comprehensive --focus=all --educational=true

# Security-focused code review
/code-review --type=security --focus=security --educational=true

# Performance optimization review
/code-review --type=performance --focus=performance,maintainability --educational=false
```

**Returns:** Code review report, recommendations, educational content

---

### `/git`

**Advanced Git operations and workflows**

```bash
/git <action> [<parameters>] [--interactive=<enabled>] [--safe=<enabled>]
```

**Parameters:**

- `action`: Git action (`workflow`|`cleanup`|`merge`|`rebase`|`analyze`) [required]
- `parameters`: Action-specific parameters [varies by action]
- `--interactive`: Enable interactive mode (`true`|`false`) [default: `true`]
- `--safe`: Enable safety checks (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Interactive workflow setup
/git workflow feature-branch --interactive=true --safe=true

# Safe repository cleanup
/git cleanup --interactive=true --safe=true

# Analyze repository history
/git analyze --interactive=false
```

**Returns:** Git operation results, workflow setup, analysis reports

---

## Phase 09: Advanced Agentic Capabilities

Next-generation AI-powered development features using multi-agent coordination.

### `/agent-orchestrate`

**Multi-agent coordination and workflows**

```bash
/agent-orchestrate [--agents=<agent-types>] [--coordination=<mode>] [--objective=<goal>]
```

**Parameters:**

- `--agents`: Agent types (`specialist`|`generalist`|`hybrid`|`custom`) [default: `hybrid`]
- `--coordination`: Coordination mode (`sequential`|`parallel`|`hierarchical`) [default: `hierarchical`]
- `--objective`: High-level objective description [required]

**Examples:**

```bash
# Hierarchical multi-agent development
/agent-orchestrate --agents=specialist --coordination=hierarchical --objective="implement secure user authentication system"

# Parallel generalist agents
/agent-orchestrate --agents=generalist --coordination=parallel --objective="code review and optimization"

# Custom specialist coordination
/agent-orchestrate --agents=custom --coordination=sequential --objective="database migration and testing"
```

**Returns:** Agent coordination results, task distribution, quality metrics

---

### `/mcp-discover`

**MCP server discovery and integration**

```bash
/mcp-discover [--scope=<scope>] [--categories=<categories>] [--install=<auto-install>]
```

**Parameters:**

- `--scope`: Discovery scope (`local`|`remote`|`registry`|`all`) [default: `all`]
- `--categories`: Server categories (`filesystem`|`api`|`database`|`cloud`|`all`) [default: `all`]
- `--install`: Auto-install discovered servers (`true`|`false`) [default: `false`]

**Examples:**

```bash
# Discover all available MCP servers
/mcp-discover --scope=all --categories=all --install=false

# Discover and install filesystem servers
/mcp-discover --scope=local --categories=filesystem --install=true

# Remote registry discovery
/mcp-discover --scope=registry --categories=api,database --install=false
```

**Returns:** Available MCP servers, capabilities, integration instructions

---

### `/context-manager`

**Advanced context management**

```bash
/context-manager <action> [--scope=<scope>] [--semantic=<enabled>] [--persist=<enabled>]
```

**Parameters:**

- `action`: Context action (`analyze`|`optimize`|`persist`|`restore`|`clear`) [required]
- `--scope`: Context scope (`session`|`project`|`global`) [default: `project`]
- `--semantic`: Enable semantic understanding (`true`|`false`) [default: `true`]
- `--persist`: Enable persistence (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Analyze current context with semantic understanding
/context-manager analyze --scope=project --semantic=true --persist=true

# Optimize context for performance
/context-manager optimize --scope=session --semantic=true

# Restore persisted context
/context-manager restore --scope=global --persist=true
```

**Returns:** Context analysis, optimization results, persistence status

---

### `/workflow-automate`

**Multi-step workflow automation**

```bash
/workflow-automate "<workflow-description>" [--complexity=<level>] [--coordination=<mode>]
```

**Parameters:**

- `workflow-description`: Natural language workflow description [required]
- `--complexity`: Workflow complexity (`simple`|`intermediate`|`advanced`|`expert`) [default: `intermediate`]
- `--coordination`: Agent coordination (`single`|`multi`|`intelligent`) [default: `intelligent`]

**Examples:**

```bash
# Advanced multi-agent workflow
/workflow-automate "analyze security vulnerabilities, implement fixes, and deploy with monitoring" --complexity=advanced --coordination=intelligent

# Simple single-agent workflow
/workflow-automate "run tests and generate coverage report" --complexity=simple --coordination=single

# Expert-level intelligent coordination
/workflow-automate "migrate legacy system to microservices architecture" --complexity=expert --coordination=intelligent
```

**Returns:** Workflow execution results, agent coordination metrics, success status

---

## Phase 10: AI-Native Development

Cutting-edge AI-assisted development capabilities for next-generation programming.

### `/ai-pair-program`

**Advanced AI pair programming**

```bash
/ai-pair-program [--mode=<mode>] [--focus=<area>] [--context-aware=<enabled>] [--learning=<enabled>]
```

**Parameters:**

- `--mode`: Programming mode (`collaborative`|`mentoring`|`autonomous`|`review`) [default: `collaborative`]
- `--focus`: Focus area (`architecture`|`implementation`|`optimization`|`testing`) [default: `implementation`]
- `--context-aware`: Enable context awareness (`true`|`false`) [default: `true`]
- `--learning`: Enable learning mode (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Collaborative AI pair programming
/ai-pair-program --mode=collaborative --focus=implementation --context-aware=true

# Mentoring mode for architecture design
/ai-pair-program --mode=mentoring --focus=architecture --learning=true

# Autonomous optimization with context
/ai-pair-program --mode=autonomous --focus=optimization --context-aware=true --learning=false
```

**Returns:** Programming session results, code improvements, learning insights

---

### `/semantic-understand`

**Deep semantic code analysis**

```bash
/semantic-understand [--depth=<level>] [--focus=<areas>] [--visualization=<enabled>]
```

**Parameters:**

- `--depth`: Analysis depth (`surface`|`deep`|`comprehensive`) [default: `deep`]
- `--focus`: Analysis focus (`patterns`|`dependencies`|`architecture`|`quality`) [default: `patterns,dependencies`]
- `--visualization`: Generate visualizations (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Comprehensive semantic analysis with visualization
/semantic-understand --depth=comprehensive --focus=patterns,dependencies,architecture --visualization=true

# Deep pattern analysis
/semantic-understand --depth=deep --focus=patterns --visualization=false

# Surface-level quality analysis
/semantic-understand --depth=surface --focus=quality --visualization=true
```

**Returns:** Semantic analysis report, architectural insights, visualizations

---

### `/predictive-dev`

**Predictive development and suggestions**

```bash
/predictive-dev [--horizon=<timeframe>] [--areas=<focus-areas>] [--confidence=<threshold>]
```

**Parameters:**

- `--horizon`: Prediction horizon (`immediate`|`short-term`|`long-term`) [default: `short-term`]
- `--areas`: Focus areas (`bugs`|`features`|`architecture`|`performance`) [default: `bugs,features`]
- `--confidence`: Confidence threshold (0.1-1.0) [default: `0.7`]

**Examples:**

```bash
# Short-term bug and feature predictions
/predictive-dev --horizon=short-term --areas=bugs,features --confidence=0.8

# Long-term architectural predictions
/predictive-dev --horizon=long-term --areas=architecture --confidence=0.6

# Immediate performance predictions
/predictive-dev --horizon=immediate --areas=performance --confidence=0.9
```

**Returns:** Predictive analysis, recommendations, confidence metrics

---

### `/code-generate`

**Advanced AI-powered code generation**

```bash
/code-generate "<description>" [--language=<lang>] [--style=<style>] [--testing=<included>]
```

**Parameters:**

- `description`: Code description or requirements [required]
- `--language`: Target language [detected from project if not specified]
- `--style`: Code style (`functional`|`object-oriented`|`procedural`|`mixed`) [default: `mixed`]
- `--testing`: Include tests (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Generate REST API with tests
/code-generate "REST API for user management with authentication" --language=typescript --style=object-oriented --testing=true

# Functional utility functions
/code-generate "data transformation utilities for analytics" --style=functional --testing=true

# Performance-optimized algorithms
/code-generate "graph traversal algorithms with optimization" --style=procedural --testing=false
```

**Returns:** Generated code, tests, documentation, usage examples

---

## Phase 11: Enterprise & Scale

Enterprise-grade commands for organizational development and large-scale operations.

### `/governance`

**Enterprise governance and policy enforcement**

```bash
/governance [--framework=<framework>] [--scope=<scope>] [--enforcement=<mode>] [--audit=<enabled>]
```

**Parameters:**

- `--framework`: Governance framework (`soc2`|`gdpr`|`hipaa`|`nist`|`custom`) [default: `soc2`]
- `--scope`: Governance scope (`project`|`team`|`organization`) [default: `project`]
- `--enforcement`: Enforcement mode (`advisory`|`strict`|`automated`) [default: `strict`]
- `--audit`: Enable audit trail (`true`|`false`) [default: `true`]

**Examples:**

```bash
# SOC2 compliance with strict enforcement
/governance --framework=soc2 --scope=organization --enforcement=strict --audit=true

# GDPR privacy governance
/governance --framework=gdpr --scope=project --enforcement=automated --audit=true

# Custom governance framework
/governance --framework=custom --scope=team --enforcement=advisory --audit=false
```

**Returns:** Governance implementation, policy enforcement, audit trails

---

### `/multi-repo`

**Multi-repository coordination**

```bash
/multi-repo <operation> [--scope=<scope>] [--strategy=<strategy>] [--parallel=<enabled>]
```

**Parameters:**

- `operation`: Repository operation (`sync`|`deploy`|`analyze`|`standardize`) [required]
- `--scope`: Operation scope (`team`|`organization`|`custom`) [default: `team`]
- `--strategy`: Coordination strategy (`centralized`|`distributed`|`hybrid`) [default: `hybrid`]
- `--parallel`: Enable parallel execution (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Synchronize team repositories
/multi-repo sync --scope=team --strategy=centralized --parallel=true

# Deploy across organization
/multi-repo deploy --scope=organization --strategy=distributed --parallel=true

# Analyze repository health
/multi-repo analyze --scope=team --strategy=hybrid --parallel=false
```

**Returns:** Multi-repository operation results, coordination status, metrics

---

### `/scale-optimize`

**Performance optimization at enterprise scale**

```bash
/scale-optimize [--focus=<areas>] [--level=<scale>] [--automation=<enabled>] [--monitoring=<enabled>]
```

**Parameters:**

- `--focus`: Optimization focus (`performance`|`costs`|`resources`|`scalability`) [default: `performance,resources`]
- `--level`: Scale level (`team`|`organization`|`enterprise`|`global`) [default: `organization`]
- `--automation`: Enable automation (`true`|`false`) [default: `true`]
- `--monitoring`: Enable monitoring (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Enterprise performance optimization
/scale-optimize --focus=performance,scalability --level=enterprise --automation=true --monitoring=true

# Cost optimization at organization level
/scale-optimize --focus=costs --level=organization --automation=true --monitoring=false

# Resource optimization with monitoring
/scale-optimize --focus=resources --level=team --automation=false --monitoring=true
```

**Returns:** Optimization analysis, implementation plan, monitoring setup

---

### `/resource-manage`

**Enterprise resource management**

```bash
/resource-manage [--operation=<op>] [--scope=<scope>] [--optimization=<enabled>] [--forecasting=<enabled>]
```

**Parameters:**

- `--operation`: Management operation (`analyze`|`optimize`|`forecast`|`allocate`) [default: `analyze`]
- `--scope`: Resource scope (`compute`|`storage`|`network`|`human`|`all`) [default: `all`]
- `--optimization`: Enable optimization (`true`|`false`) [default: `true`]
- `--forecasting`: Enable forecasting (`true`|`false`) [default: `true`]

**Examples:**

```bash
# Comprehensive resource analysis
/resource-manage --operation=analyze --scope=all --optimization=true --forecasting=true

# Compute resource optimization
/resource-manage --operation=optimize --scope=compute --optimization=true --forecasting=false

# Storage forecasting
/resource-manage --operation=forecast --scope=storage --forecasting=true
```

**Returns:** Resource analysis, optimization recommendations, forecasting data

---

## Parameter Conventions

### Common Parameter Patterns

#### **Scope Parameters**

- `basic`: Minimal functionality, quick execution
- `comprehensive`: Full feature set with moderate depth  
- `deep`: Maximum depth analysis with all capabilities
- `enterprise`: Full enterprise features and compliance

#### **Safety Levels**

- `safe`: Read-only operations, no modifications
- `requires-approval`: Write operations requiring confirmation
- `high-risk`: Administrative operations with safety checks

#### **Output Formats**

- `summary`: Concise key findings and results
- `detailed`: Comprehensive results with explanations
- `diagnostic`: Debug information and execution traces
- `json`: Structured data for programmatic use

#### **Complexity Levels**

- `basic`: Simple operations, minimal setup
- `intermediate`: Multi-step workflows
- `advanced`: Complex operations with dependencies
- `expert`: Maximum capability utilization

### Environment Variables

Commands support configuration via environment variables:

```bash
# Global configuration
export CCPROMPTS_SAFETY_LEVEL="strict"
export CCPROMPTS_DEFAULT_SCOPE="comprehensive"
export CCPROMPTS_OUTPUT_FORMAT="detailed"

# Platform-specific settings
export CCPROMPTS_CI_PLATFORM="github"
export CCPROMPTS_DEPLOY_ENVIRONMENT="staging"

# Enterprise settings
export CCPROMPTS_COMPLIANCE_FRAMEWORK="soc2"
export CCPROMPTS_AUDIT_ENABLED="true"
```

---

## Integration Patterns

### Command Chaining

Commands can be chained for complex workflows:

```bash
# Security workflow
/analyze-project --scope=security → /audit-security --level=strict → /harden --strategy=defense-in-depth

# Development workflow  
/setup-ci --features=testing,security → /test --strategy=comprehensive → /deploy --environment=staging

# AI-native workflow
/ai-pair-program --mode=collaborative → /semantic-understand --depth=deep → /predictive-dev --horizon=short-term
```

### Batch Operations

Multiple commands can be executed in parallel:

```bash
# Parallel analysis
/analyze-project & /health-check & /validate-environment

# Concurrent optimization
/optimize --focus=performance & /scale-optimize --level=organization & /resource-manage --operation=optimize
```

### Configuration Files

Commands can be configured via YAML files:

```yaml
# .ccprompts.yaml
defaults:
  safety_level: "strict"
  output_format: "detailed"
  scope: "comprehensive"

commands:
  analyze-project:
    scope: "deep" 
    focus: ["security", "architecture"]
  
  deploy:
    environment: "production"
    strategy: "blue-green"
    validation: "extensive"
```

---

This command reference provides comprehensive documentation for all 70 commands in the ccprompts ecosystem. Each command is designed to work independently or as part of larger workflows, with consistent parameter conventions and safety features throughout.
