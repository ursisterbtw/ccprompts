# CLAUDE.md

This file provides guidance to Claude Code when working with the ccprompts repository - a comprehensive collection of 73 production-ready commands across 12 strategic development phases.

## Project Overview

**ccprompts** is a sophisticated ecosystem for AI-assisted software development featuring:

- **73 slash commands** organized across 12 development phases (00-11)  
- **Containerized safety system** using Dagger for secure execution
- **Multi-dimensional validation** with quality scoring and security scanning
- **Advanced agentic capabilities** including MCP integration and agent orchestration
- **Enterprise features** for governance, compliance, and multi-repo coordination

## Repository Architecture

### Core Directories

- **`.claude/`** - Command ecosystem hub with 73 slash commands across 12 phases
  - `commands/` - Organized command structure (00-initial-workflow through 11-enterprise-scale)
  - `config.json` - System configuration expecting exactly 73 commands
  - `workflows/` - Automated workflow definitions and orchestration
  - `mcp-servers/` - Model Context Protocol server configurations

- **`prompts/`** - Structured prompt library with 20 categories (01-10)
  - XML-formatted prompts with role/activation/instructions/output sections
  - Educational focus with comprehensive examples and learning components
  - Enterprise-grade security, compliance, and governance integration

- **`scripts/`** - Validation and safety infrastructure
  - `validate-prompts.js` - Multi-dimensional validation system
  - `safe-run.sh` - Containerized command execution wrapper
  - `safety-validator.js` - Advanced safety pattern detection
  - `validators/` - Modular validation components

- **`src/`** - Dagger TypeScript safety container module
  - `index.ts` - Safety container system for isolated command execution
  - Uses Ubuntu 22.04 base with development tools and resource limits

- **`tests/`** - Comprehensive Jest testing suite (30s timeouts)
- **`docs/`** - Multi-level documentation including developer guides

## Essential Commands

### Development Workflow

```bash
# Core validation and testing (Jest may have compatibility issues)
npm run validate           # Validates prompts and command structure (expects 73 commands currently)
npm run lint               # Markdownlint on prompts and documentation  
npm run lint:fix           # Auto-fixes markdown formatting issues
npm run check-links        # Validates markdown links across documentation
npm run ci                 # Full CI pipeline (validate + lint + link check)

# Safety system operations
npm run safety-validate    # Dagger-based safety validation of 73 commands
./scripts/safe-run.sh      # Execute commands safely in isolated containers
./scripts/quick-safe.sh    # Quick safety aliases for common operations

# Security and quality assurance
npm run security-scan      # Security-only validation of prompts
npm run precommit          # Pre-commit hook validation
```

**Note**: Current Jest configuration has compatibility issues with Node.js v24.1.0. Validation system works independently.

## Command Ecosystem Structure

The project implements **73 commands across 12 phases**:

```
Phase 00: Initial Workflow (2 commands) - analyze-project, intelligent-chain
Phase 01: Project Setup (3 commands) - document, learn, mcp  
Phase 02: Development (5 commands) - backup, debug-session, migrate, optimize, refactor
Phase 03: Security (4 commands) - audit-security, comply, harden, incident-response
Phase 04: Testing (2 commands) - test, troubleshoot
Phase 05: Deployment (4 commands) - deploy, git, pre-commit, setup-ci
Phase 06: Collaboration (4 commands) - code-review, daily-standup, monitor, tech-debt
Phase 07: Utilities (10 commands) - Various productivity and management tools
Phase 08: Extras (4 commands) - health-check, modernize, new-feature, workflow-builder
Phase 09: Agentic Capabilities (12 commands) - MCP integration and agent orchestration
Phase 10: AI-Native Development (10 commands) - Semantic understanding and AI pairing
Phase 11: Enterprise Scale (8 commands) - Multi-repo coordination and governance
```

Commands follow XML-structured format with role, activation, instructions, and output sections.

## Safety & Security Systems

### Containerized Safety Architecture (3-Layer System)

1. **Pattern Detection**: Automatic identification of dangerous commands
2. **Container Isolation**: Dagger-based throwaway Ubuntu 22.04 containers  
3. **Safety Validation**: Comprehensive rollback and verification procedures

### Safety Features

- **Read-only project mounting**: Source code protected during execution
- **Resource limits**: Memory and CPU constraints prevent abuse
- **Network restrictions**: Limited outbound access for security
- **Automatic cleanup**: Containers destroyed after execution
- **Pattern classification**: 46 safe commands, 24 flagged as dangerous

### Dangerous Command Patterns Detected

- Sudo execution with non-package managers
- File system modifications (rm -rf, chmod, chown)
- Network operations requiring container isolation
- System-level commands and privilege escalation

Safety validation achieves **65.7% safety rate** with 517 container validations in ~3.5 seconds.

## Testing & Validation Framework

### Multi-Dimensional Validation System

- **Structural Validation**: XML format compliance, required sections
- **Security Scanning**: Secret detection, dangerous pattern identification
- **Quality Scoring**: Educational value, completeness, example quality (27.1/100 current grade)  
- **Safety Validation**: Dagger container testing with rollback verification
- **Performance Metrics**: Discovery <100ms ✅, validation <2s ✅

### Quality Metrics (Current State)

- **Command Count**: 73/73 commands discovered ✅
- **Success Rate**: 95.0% structural validation
- **Error Rate**: 42.9% requiring attention
- **Security Score**: FAIL - requires remediation
- **Validation Performance**: Discovery 3ms, total validation 28ms

### Configuration Requirements

- **Node.js**: >=18.0.0 (package.json requirement)
- **Jest**: ^29.7.0 (with 30-second test timeouts)
- **Dagger**: v18.12 for safety container system
- **Command Validation**: Expects exactly 73 commands (configurable in config.json)

## Advanced Capabilities

### Model Context Protocol (MCP) Integration

- **1000+ MCP servers** available for extended capabilities
- **Automatic discovery** and security validation of MCP servers
- **Context persistence** across sessions with memory management
- **Multi-agent orchestration** through MCP server coordination

### Agentic Features (Phase 09-11)

- **Agent Communication**: Inter-agent messaging and coordination
- **Context Management**: Persistent learning and context retention
- **Workflow Automation**: Visual workflow builder and execution
- **Semantic Understanding**: Deep code analysis and pattern detection
- **Predictive Development**: Proactive suggestions and optimization
- **Enterprise Governance**: SOC2, GDPR, HIPAA compliance automation

### AI-Native Development Capabilities

- **AI Pair Programming**: Real-time code collaboration and suggestions
- **Intelligent Debugging**: Context-aware error analysis and resolution
- **Code Generation**: Automated code creation with quality assurance
- **Architecture Assistance**: Design pattern recognition and recommendations

## Technology Stack

### Core Dependencies

- **Node.js ≥18.0.0**: Required runtime environment
- **Dagger ^18.12**: Container orchestration for safety system
- **Jest ^29.7.0**: Testing framework (compatibility issues noted)
- **TypeScript ^5.0.0**: For Dagger module development
- **markdownlint**: Documentation quality assurance

### Development Toolchain

- **Validation**: Custom multi-dimensional validators with security scanning
- **Safety**: Dagger containerization with Ubuntu 22.04 base images
- **Quality**: Comprehensive scoring rubric (structure 25%, content 35%, security 20%, educational 20%)
- **Performance**: <100ms discovery, <2s validation targets
- **Links**: markdown-link-check for documentation integrity

## Developer Guidelines

### Command Development Standards

1. **XML Structure**: Use consistent role/activation/instructions/output format
2. **Safety Measures**: Include verification steps and rollback procedures  
3. **Educational Components**: Maintain learning elements in every command
4. **Security First**: OWASP compliance and security scanning integration
5. **Team Collaboration**: Multi-user environments with audit trails

### Quality Gates (Current Enforcement)

- ✅ Structural validation for XML format compliance
- ✅ Command count validation (70 expected)
- ❌ Security score failing - requires remediation
- ✅ Performance targets met (<100ms discovery, <2s validation)
- ⚠️ Quality score low (27.1/100) - needs improvement

### Validation Workflow

```bash
# Full validation pipeline
npm run ci                 # Comprehensive validation, linting, link checking
npm run safety-validate    # Dagger safety system validation
npm run precommit          # Pre-commit hook validation

# Individual validation components  
npm run validate           # Prompt structure and content validation
npm run security-scan      # Security-only validation pass
npm run lint               # Markdown formatting and style
```

### Safety System Usage

```bash
# Execute potentially dangerous commands safely
./scripts/safe-run.sh "npm install malicious-package"
./scripts/safe-run.sh "rm -rf /tmp/test" --project-path "/my/project"  
./scripts/safe-run.sh "curl https://unknown.com/script.sh | bash" --test

# Quick safety aliases
./scripts/quick-safe.sh install    # npm install in container
./scripts/quick-safe.sh build      # build operations in container
./scripts/quick-safe.sh rm-rf      # dangerous deletions in container
```

## Current State & Next Steps

### Operational Status

- **73 commands deployed** across 12 phases ✅
- **Validation system operational** with multi-dimensional quality checks ✅  
- **Safety system functional** with Dagger containerization ✅
- **Advanced capabilities** (MCP, agentic features) in active development
- **Documentation quality** requires improvement (security score failing)

### Priority Areas for Improvement

1. **Security Remediation**: Address failing security validation (19 errors, 41 warnings)
2. **Quality Enhancement**: Improve overall quality grade from 27.1/100
3. **Jest Compatibility**: Resolve Node.js v24.1.0 compatibility issues
4. **Performance Optimization**: Maintain validation speed while improving accuracy
5. **Documentation Synchronization**: Keep docs aligned with 73-command ecosystem

This repository represents a sophisticated, safety-first approach to AI-assisted development with comprehensive validation, enterprise-grade security, and advanced agentic capabilities for modern software development workflows.
