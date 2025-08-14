# ccprompts API Reference

**Complete reference for the 70-command Claude Code ecosystem across 11 strategic phases**

This document provides detailed API specifications, usage patterns, and integration examples for all commands in the ccprompts ecosystem.

---

## Table of Contents

- [Command Structure](#command-structure)
- [Phase Organization](#phase-organization)
- [Command Categories](#command-categories)
- [Parameter Specification](#parameter-specification)
- [Integration Patterns](#integration-patterns)
- [Safety System](#safety-system)
- [Error Handling](#error-handling)

---

## Command Structure

All commands follow the standardized XML structure with four core sections:

### Standard Command Format

```xml
<role>
Expert role definition for task specialization
</role>

<activation>
Claude Code configuration and tool requirements:
- Required tools: [List of essential Claude Code tools]
- MCP servers: [External integrations if needed]
- Permission level: [read-only|write|admin]
</activation>

<instructions>
Numbered implementation steps:
1. Analysis and preparation phase
2. Implementation phase  
3. Validation and testing phase
4. Documentation and cleanup phase
</instructions>

<output_format>
Specific deliverable requirements and success criteria
</output_format>
```

### Command Metadata

Each command includes:

- **Phase classification** (00-11)
- **Complexity level** (basic|intermediate|advanced|expert)
- **Execution time** (quick|medium|extended|long-running)
- **Dependencies** (standalone|requires-git|requires-build|requires-network)
- **Safety level** (safe|requires-approval|high-risk)

---

## Phase Organization

### **Phase 00-02: Initial Workflow & Setup (10 commands)**

Foundation commands for project initialization and analysis:

#### `/analyze-project`

- **Purpose**: AI-powered comprehensive project assessment
- **Parameters**: `scope=[basic|comprehensive|deep]`, `output=[summary|detailed|diagnostic]`
- **Dependencies**: read-only filesystem access
- **Returns**: Project health report with recommendations

```bash
# Basic project analysis
/analyze-project --scope=basic --output=summary

# Comprehensive analysis with detailed recommendations  
/analyze-project --scope=comprehensive --output=detailed
```

#### `/intelligent-chain`

- **Purpose**: Natural language workflow automation and command chaining
- **Parameters**: `workflow=<description>`, `complexity=[simple|complex]`, `safety=[strict|balanced]`
- **Dependencies**: multiple command execution capability
- **Returns**: Automated workflow execution results

```bash
# Chain multiple development tasks
/intelligent-chain --workflow="setup testing environment with coverage reports" --complexity=complex

# Simple automation chain
/intelligent-chain --workflow="format code and run basic tests" --safety=strict
```

### **Phase 03-05: Development & Quality (12 commands)**

Core development workflow commands:

#### `/debug-session`

- **Purpose**: Advanced troubleshooting with interactive debugging
- **Parameters**: `mode=[guided|autonomous|collaborative]`, `target=[error|performance|behavior]`
- **Dependencies**: bash execution, file analysis tools
- **Returns**: Debug session report with resolution steps

#### `/refactor`

- **Purpose**: Safe multi-file code transformations
- **Parameters**: `scope=[file|module|codebase]`, `strategy=[conservative|aggressive]`, `preserve=[comments|formatting|structure]`
- **Dependencies**: git integration, backup capabilities
- **Returns**: Refactoring summary with rollback instructions

### **Phase 06-08: Deployment & Operations (18 commands)**

Production-focused commands for deployment and maintenance:

#### `/deploy`

- **Purpose**: Production deployment workflows
- **Parameters**: `environment=[staging|production]`, `strategy=[blue-green|rolling|canary]`, `validation=[basic|comprehensive]`
- **Dependencies**: CI/CD integration, network access
- **Returns**: Deployment status and monitoring links

#### `/setup-ci`

- **Purpose**: CI/CD pipeline automation
- **Parameters**: `platform=[github|gitlab|jenkins]`, `features=[testing|security|deployment]`, `complexity=[basic|advanced]`
- **Dependencies**: repository access, platform API keys
- **Returns**: Pipeline configuration files and setup instructions

### **Phase 09: Advanced Agentic Capabilities (12 commands)**

Next-generation AI-powered development features:

#### `/agent-orchestrate`

- **Purpose**: Multi-agent coordination and workflow management
- **Parameters**: `agents=[specialist|generalist|hybrid]`, `coordination=[sequential|parallel|hierarchical]`
- **Dependencies**: MCP server integration, advanced context management
- **Returns**: Agent workflow results and coordination metrics

#### `/mcp-discover`

- **Purpose**: MCP server discovery and integration setup
- **Parameters**: `scope=[local|remote|registry]`, `categories=[filesystem|api|database|cloud]`
- **Dependencies**: MCP client capabilities, network access for remote servers
- **Returns**: Available MCP servers list with integration instructions

### **Phase 10: AI-Native Development (10 commands)**

AI-assisted development capabilities:

#### `/ai-pair-program`

- **Purpose**: Advanced AI pair programming with contextual awareness
- **Parameters**: `mode=[collaborative|mentoring|autonomous]`, `focus=[architecture|implementation|optimization]`
- **Dependencies**: real-time code analysis, semantic understanding
- **Returns**: Code improvements with educational explanations

#### `/semantic-understand`

- **Purpose**: Deep semantic code analysis and architectural insights
- **Parameters**: `depth=[surface|deep|comprehensive]`, `focus=[patterns|dependencies|quality]`
- **Dependencies**: advanced code parsing, pattern recognition
- **Returns**: Semantic analysis report with architectural recommendations

### **Phase 11: Enterprise & Scale (8 commands)**

Enterprise-grade commands for organizational development:

#### `/governance`

- **Purpose**: Enterprise governance and policy enforcement
- **Parameters**: `framework=[soc2|gdpr|hipaa|custom]`, `scope=[project|organization]`, `enforcement=[advisory|strict]`
- **Dependencies**: compliance frameworks, audit trail capabilities
- **Returns**: Governance implementation plan with compliance checklist

#### `/multi-repo`

- **Purpose**: Multi-repository coordination and management
- **Parameters**: `operation=[sync|deploy|analyze]`, `scope=[team|organization]`, `strategy=[centralized|distributed]`
- **Dependencies**: multiple repository access, coordination tools
- **Returns**: Multi-repo operation status and synchronization report

---

## Parameter Specification

### Common Parameter Types

#### **Scope Parameters**

- `basic`: Essential functionality only
- `comprehensive`: Full feature set with moderate depth
- `deep`: Maximum depth analysis with all available tools
- `diagnostic`: Troubleshooting-focused with detailed logging

#### **Complexity Levels**

- `simple`: Single-step operations, minimal dependencies
- `intermediate`: Multi-step workflows, moderate complexity
- `advanced`: Complex workflows, multiple tool integration
- `expert`: Maximum capability utilization, enterprise features

#### **Safety Levels**

- `safe`: Read-only operations, no system modifications
- `requires-approval`: Write operations requiring user confirmation
- `high-risk`: System-level changes, administrative operations

#### **Output Formats**

- `summary`: Concise results with key findings
- `detailed`: Comprehensive results with explanations
- `diagnostic`: Debug-focused output with execution traces
- `json`: Structured data for programmatic consumption

---

## Integration Patterns

### Command Chaining

Commands can be chained for complex workflows:

```bash
# Security-focused development workflow
/analyze-project --scope=comprehensive
→ /audit-security --level=paranoid
→ /harden --strategy=defense-in-depth  
→ /setup-ci --features=security
→ /deploy --environment=staging --validation=comprehensive

# Learning-driven development
/analyze-project --output=diagnostic
→ /learn --path=recommended --level=intermediate
→ /best-practices --domain=current-stack
→ /code-review --focus=educational
```

### MCP Server Integration

Commands integrate with MCP servers for extended capabilities:

```json
{
  "mcp_servers": {
    "filesystem": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-filesystem", "/project/path"]
    },
    "github": {
      "command": "npx", 
      "args": ["@anthropic-ai/mcp-server-github"],
      "env": {"GITHUB_TOKEN": "${GITHUB_TOKEN}"}
    },
    "docker": {
      "command": "docker",
      "args": ["run", "--rm", "mcp-docker-server"]
    }
  }
}
```

### Workflow Automation

Complex multi-step workflows can be automated:

```yaml
# .claude/workflows/full-development-cycle.yaml
name: "Full Development Cycle"
description: "Complete development workflow from analysis to deployment"

steps:
  - command: "/analyze-project"
    parameters:
      scope: "comprehensive"
      output: "detailed"
    
  - command: "/setup-ci" 
    parameters:
      platform: "github"
      features: ["testing", "security", "deployment"]
      
  - command: "/audit-security"
    parameters:
      level: "strict"
      compliance: ["soc2", "gdpr"]
      
  - command: "/deploy"
    parameters:
      environment: "staging"
      strategy: "blue-green"
      validation: "comprehensive"
```

---

## Safety System

### Containerized Execution

All potentially dangerous operations can be executed in isolated containers:

```bash
# Safe command execution
./scripts/safe-run.sh "/command-with-parameters"

# Quick safety aliases  
./scripts/quick-safe.sh install "npm install unknown-package"
./scripts/quick-safe.sh rm-rf "rm -rf /tmp/dangerous-directory"
```

### Permission Levels

Commands operate under different permission levels:

- **read-only**: Safe analysis operations
- **write**: File system modifications with approval
- **admin**: System-level operations requiring explicit confirmation

### Rollback Procedures

All commands include rollback capabilities:

```xml
<rollback_procedure>
1. Git reset to pre-command state: `git reset --hard <commit-hash>`
2. Restore backup files from: `/tmp/command-backup-<timestamp>`
3. Revert configuration changes: `./rollback-config.sh`
4. Validate system state: `/health-check --comprehensive`
</rollback_procedure>
```

---

## Error Handling

### Standard Error Codes

- `0`: Success
- `1`: General error
- `2`: Invalid parameters
- `3`: Permission denied
- `4`: Resource not found
- `5`: Network error
- `6`: MCP server error
- `7`: Safety validation failed

### Error Recovery

Commands include automatic error recovery:

```xml
<error_recovery>
<on_failure>
1. Stop current operation safely
2. Log detailed error information
3. Suggest corrective actions
4. Offer rollback options
5. Update CLAUDE.md with failure patterns
</on_failure>
</error_recovery>
```

### Diagnostic Information

Enhanced error reporting includes:

- Command parameters and context
- System state at time of error
- Suggested resolution steps
- Related documentation links
- Contact information for complex issues

---

## Usage Examples

### Development Workflow

```bash
# Start new feature development
/analyze-project --scope=basic
/new-feature web-app typescript --complexity=intermediate
/setup-ci --platform=github --features=testing
/test --strategy=comprehensive
/deploy --environment=staging

# Code quality improvement
/audit-security --level=strict
/refactor --scope=codebase --strategy=conservative
/optimize --focus=performance
/document --type=api --format=markdown
```

### Learning and Growth

```bash
# Skill development workflow
/learn --path=recommended --level=beginner
/best-practices --domain=javascript --focus=security
/troubleshoot --mode=guided --complexity=intermediate
/knowledge-base --action=contribute --type=runbook
```

### Enterprise Operations

```bash
# Governance and compliance
/governance --framework=soc2 --scope=organization
/compliance-enterprise --audit=quarterly --automation=full
/multi-repo --operation=analyze --scope=team
/scale-optimize --focus=performance --level=enterprise
```

---

This API reference provides documentation for integrating and using the ccprompts command ecosystem. For specific implementation examples and advanced usage patterns, see the individual command documentation in `.claude/commands/`.
