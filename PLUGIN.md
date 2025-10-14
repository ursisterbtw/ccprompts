# CC Prompts - Claude Code Plugin Installation Guide

> Transform your Claude Code experience with 70+ production-ready commands, 10 specialized agents,
> and enterprise-grade workflows.

## Quick Start

### Installation via GitHub

```bash
# Add the CC Prompts marketplace
/plugin marketplace add ursisterbtw/ccprompts

# Install the plugin
/plugin install ccprompts@ursisterbtw
```

That's it! Restart Claude Code and you'll have access to all commands and agents.

### Verification

After installation, verify with:

```bash
# Check available commands
/help

# Try the intelligent project analyzer
/analyze-project

# View available agents
/agents
```

## What You Get

### 70+ Commands Across 12 Development Phases

#### Phase 00: Initial Workflow (2 commands)
- `/analyze-project` - Intelligent project analysis with personalized recommendations
- `/intelligent-chain` - Smart command sequencing based on project context

#### Phase 01: Project Setup (3 commands)
- `/document` - Comprehensive documentation generation
- `/learn` - Interactive learning and onboarding
- `/mcp` - Model Context Protocol setup and configuration

#### Phase 02: Development (5 commands)
- `/backup` - Version control and backup strategies
- `/debug-session` - Advanced debugging workflows
- `/migrate` - Database and framework migrations
- `/optimize` - Performance optimization analysis
- `/refactor` - Safe code refactoring with tests

#### Phase 03: Security (4 commands)
- `/audit-security` - Comprehensive security auditing
- `/harden` - System and application hardening
- `/compliance` - Compliance framework implementation
- `/penetration-test` - Security testing workflows

#### Phase 04: Testing (2 commands)
- `/test` - Comprehensive testing strategies
- `/troubleshoot` - Advanced troubleshooting workflows

#### Phase 05: Deployment (4 commands)
- `/setup-ci` - CI/CD pipeline configuration
- `/deploy` - Deployment automation
- `/rollback` - Safe rollback procedures
- `/monitor` - Monitoring and observability setup

#### Phase 06: Collaboration (4 commands)
- `/code-review` - Intelligent code review automation
- `/pair-program` - Pair programming assistance
- `/knowledge-transfer` - Team knowledge sharing
- `/handoff` - Project handoff documentation

#### Phase 07: Utilities (7 commands)
- `/scaffold` - Project scaffolding and templates
- `/convert` - Format and code conversion
- `/search` - Advanced codebase search
- `/visualize` - Architecture visualization
- `/estimate` - Project estimation and planning
- `/dependency-analysis` - Dependency management
- `/tech-debt` - Technical debt tracking

#### Phase 08: Extras (4 commands)
- `/health-check` - System health monitoring
- `/modernize` - Technology stack modernization
- `/benchmark` - Performance benchmarking
- `/accessibility` - Accessibility compliance

#### Phase 09: Agentic Capabilities (12 commands)
- `/agent-create` - Custom agent creation
- `/agent-orchestrate` - Multi-agent coordination
- `/mcp-integrate` - MCP server integration
- `/workflow-automate` - Workflow automation
- And 8 more advanced agentic commands...

#### Phase 10: AI-Native Development (10 commands)
- `/ai-pair` - AI pair programming
- `/ai-review` - AI-powered code review
- `/ai-suggest` - Intelligent suggestions
- `/ai-refactor` - AI-assisted refactoring
- And 6 more AI-native commands...

#### Phase 11: Enterprise Scale (8 commands)
- `/governance` - Enterprise governance
- `/multi-repo` - Multi-repository management
- `/compliance-audit` - Compliance auditing
- `/architecture-review` - Architecture validation
- And 4 more enterprise commands...

### 10 Specialized Agents

- **rust-expert** - Rust programming, ownership, and systems development
- **python-expert** - Modern Python development and ecosystem
- **golang-pro** - Go concurrency and systems programming
- **javascript-expert** - JavaScript and modern web development
- **bash-shell-scripting** - Shell automation and scripting
- **fastapi-optimizer** - FastAPI performance and patterns
- **documentation-writer** - Technical documentation creation
- **performance-optimizer** - System-wide performance optimization
- **systems-architect** - Architecture design and patterns
- **agent-template-wizard** - Custom agent creation assistant

## Installation Methods

### Method 1: Direct GitHub Installation (Recommended)

```bash
# In Claude Code
/plugin marketplace add ursisterbtw/ccprompts
/plugin install ccprompts@ursisterbtw
```

### Method 2: Local Development Installation

```bash
# Clone the repository
git clone https://github.com/ursisterbtw/ccprompts.git
cd ccprompts

# Install dependencies
bun install

# Add as local marketplace
/plugin marketplace add /path/to/ccprompts

# Install the plugin
/plugin install ccprompts@ccprompts
```

### Method 3: Team Repository Configuration

For automatic installation across your team:

```json
// .claude/settings.json in your project
{
  "pluginMarketplaces": [
    "ursisterbtw/ccprompts"
  ],
  "plugins": [
    "ccprompts@ursisterbtw"
  ]
}
```

Team members who trust the repository folder will automatically get the plugins installed.

## Configuration

### Permissions

The plugin requires these permissions (automatically configured):

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(pip:*)",
      "Bash(cargo:*)",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(sudo:*)"
    ]
  }
}
```

### Environment Variables

Optional environment configuration:

```json
{
  "env": {
    "CLAUDE_CODE_PROJECT_TYPE": "command-ecosystem",
    "CLAUDE_CODE_ENABLE_MCP": "1"
  }
}
```

## Safety Features

CC Prompts includes a comprehensive safety system:

- **Dagger Container Isolation** - Dangerous commands run in isolated containers
- **Multi-dimensional Validation** - Structural, security, quality, and performance checks
- **Read-only Project Mounting** - Source code protection during execution
- **Automatic Cleanup** - Container resources released after execution
- **65.7% Safety Rate** - Validated across 517+ container executions

## Usage Examples

### Quick Project Analysis

```bash
/analyze-project
```

Gets intelligent recommendations based on your project's characteristics.

### Intelligent Command Chaining

```bash
/intelligent-chain "prepare for production deployment"
```

Automatically executes the right sequence of commands for your goal.

### Security Audit

```bash
/audit-security full-codebase paranoid
```

Comprehensive security analysis with detailed recommendations.

### CI/CD Setup

```bash
/setup-ci github professional
```

Production-ready CI/CD configuration for GitHub Actions.

### Custom Agent Creation

```bash
/agent-create
```

Interactive wizard for creating specialized agents for your domain.

## Troubleshooting

### Commands Not Available After Installation

1. **Restart Claude Code** - Required after plugin installation
2. **Check Installation** - Run `/plugin` to verify ccprompts is installed
3. **Verify Marketplace** - Ensure marketplace was added correctly

### Permission Errors

If you encounter permission errors:

1. Check your `.claude/settings.json` permissions
2. Trust the repository folder if using team configuration
3. Review the command's required permissions

### Symlink Issues (Local Development)

If symlinks don't work on your system:

```bash
# Windows: Use directory junctions instead
mklink /J commands .claude\commands
mklink /J agents .claude\agents

# Or copy directories (not recommended for development)
cp -r .claude/commands commands
cp -r .claude/agents agents
```

## Development

### Running Validation

```bash
# Validate all 70 commands
bun run validate

# Run full CI pipeline
bun run ci

# Security-focused validation
bun run security-scan

# Safety container validation
bun run safety-validate
```

### Testing Changes

```bash
# Run Jest tests
bun run test:jest

# Validate command structure
bun run test:validate
```

### Contributing

For contribution guidelines:
- Check the repository documentation for command addition patterns
- Follow existing agent templates in `.claude/agents/`
- Maintain safety standards in validation scripts
- Use consistent markdown formatting across all commands

## Support and Community

- **Documentation**: [GitHub Repository](https://github.com/ursisterbtw/ccprompts)
- **Issues**: [Report Bugs](https://github.com/ursisterbtw/ccprompts/issues)
- **Discussions**: [Community Forum](https://github.com/ursisterbtw/ccprompts/discussions)

## Roadmap

Planned features and improvements:

- [ ] Additional language-specific agents (Kotlin, Swift, etc.)
- [ ] Enhanced MCP server integrations
- [ ] Interactive command builder UI
- [ ] Advanced analytics and metrics
- [ ] Cloud-native deployment commands
- [ ] AI model fine-tuning workflows

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built by the Claude Code community for developers who demand comprehensive, safe, and intelligent development workflows.

---

**Version**: 0.2.0
**Last Updated**: 2024-10-14
**Compatibility**: Claude Code >= 1.0.0, Node.js >= 18.0.0
