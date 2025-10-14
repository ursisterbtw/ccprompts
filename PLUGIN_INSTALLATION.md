# CCPrompts Plugin Installation Guide

**CCPrompts** is now available as a Claude Code plugin, providing easy installation and access to 70+ slash commands and 10 specialized agents.

## Quick Installation

### 1. Add Local Marketplace
```bash
/plugin marketplace add ./test-marketplace
```

### 2. Install Plugin
```bash
/plugin install ccprompts@test-marketplace
```

### 3. Restart Claude Code
Close and restart Claude Code to load the plugin.

## Plugin Features

### 🚀 70+ Slash Commands
Organized across 12 development phases:

- **00-Initial Workflow** (2): Project analysis, intelligent chaining
- **01-Project Setup** (3): Documentation, learning, MCP setup
- **02-Development** (5): Backup, debug, migrate, optimize, refactor
- **03-Security** (4): Security auditing & compliance
- **04-Testing** (2): Testing & troubleshooting
- **05-Deployment** (4): CI/CD & deployment
- **06-Collaboration** (4): Code review & team workflows
- **07-Utilities** (6+): Development utilities & best practices
- **08-Extras** (4): Health checks & modernization
- **09-Agentic Capabilities** (12): MCP & agent orchestration
- **10-AI-Native Development** (10): AI-powered development tools
- **11-Enterprise Scale** (8): Governance & multi-repo

### 🤖 10 Specialized Agents
- `agent-template-wizard` - Create new agents from templates
- `bash-shell-scripting` - Shell scripting and automation
- `documentation-writer` - Technical documentation specialist
- `fastapi-optimizer` - FastAPI performance and async patterns
- `golang-pro` - Go concurrency and scalable systems
- `javascript-expert` - Modern JavaScript and async programming
- `performance-optimizer` - System-wide performance optimization
- `python-pro` - Advanced Python patterns and metaprogramming
- `rust-expert` - Memory safety and systems programming
- `systems-architect` - Architecture design and scalability

### 🔒 Dagger-Based Safety System
- Containerized execution for dangerous commands
- 65.7% safety rate across 517+ validations
- Automatic rollback and cleanup
- Resource limits and network restrictions

## Usage Examples

### Basic Commands
```bash
/analyze-project          # Analyze your codebase structure
/intelligent-chain        # Chain multiple AI operations
/document                 # Generate project documentation
/learn                    # Learn new codebases interactively
/security-audit           # Comprehensive security analysis
/performance-optimize     # System performance optimization
```

### Agent Collaboration
```bash
# Use specialized agents for complex tasks
"Please use the rust-expert agent to review this memory safety code"
"Deploy the documentation-writer agent to create API docs"
"Engage the performance-optimizer agent for system analysis"
```

### Safety-First Operations
```bash
# Dangerous operations are automatically containerized
/safe-run "rm -rf node_modules" --test
/quick-safe install
/quick-safe build
```

## Development Workflow Integration

### 1. Project Setup
```bash
/learn                    # Understand existing codebase
/document                 # Generate documentation
/mcp-setup               # Configure Model Context Protocol
```

### 2. Development Cycle
```bash
/debug-session           # Structured debugging
/backup                 # Create intelligent backups
/refactor               # Safe refactoring workflows
/optimize               # Performance improvements
```

### 3. Quality Assurance
```bash
/security-audit          # Security vulnerability scanning
/test-strategy          # Comprehensive testing approach
/code-review            # Automated code review
```

### 4. Deployment & Operations
```bash
/ci-cd                  # CI/CD pipeline setup
/deploy-safe            # Safe deployment practices
/monitor                # System monitoring setup
```

## Validation and Quality

The plugin includes comprehensive validation:

```bash
# Built-in validation commands
bun run validate         # Validate all 70+ commands
bun run security-scan   # Security-focused validation
bun run ci              # Full pipeline validation
```

### Quality Metrics
- ✅ **70/70 commands** validated
- ✅ **95.0% structural** compliance
- ⚠️ **Security score** - actively improving
- ⚠️ **Quality score** - educational enhancement ongoing

## Advanced Features

### MCP Integration
```bash
/mcp-status             # Check MCP server status
/mcp-restart           # Restart MCP servers
/mcp-logs              # View MCP logs
```

### Enterprise Scale
```bash
/multi-repo-sync       # Multi-repository operations
/governance-check      # Governance compliance
/dependency-update     # Safe dependency management
```

### AI-Native Development
```bash
/prompt-optimize       # AI prompt optimization
/agent-orchestrate     # Multi-agent workflows
/ai-code-review        # AI-assisted code review
```

## Troubleshooting

### Plugin Installation Issues
```bash
# Verify plugin structure
/plugin list
/plugin info ccprompts

# Reinstall if needed
/plugin uninstall ccprompts@test-marketplace
/plugin install ccprompts@test-marketplace
```

### Command Not Found
```bash
# Restart Claude Code to reload commands
# Check plugin is loaded: /plugin list
```

### Validation Errors
```bash
# Run diagnostics
bun run validate
bun run security-scan
```

## Contributing

The CCPrompts plugin welcomes contributions:

1. **Fork the repository**
2. **Create feature branch** for new commands
3. **Follow validation standards** (70+ commands expected)
4. **Test thoroughly** with built-in validation
5. **Submit pull request** with detailed description

### Development Setup
```bash
git clone https://github.com/ursisterbtw/ccprompts.git
cd ccprompts
bun install
bun run validate        # Ensure all commands work
bun run test            # Run test suite
```

## Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/ursisterbtw/ccprompts/issues)
- **Documentation**: [Full command reference](https://github.com/ursisterbtw/ccprompts#readme)
- **Community**: Join the Claude Code community discussions

## License

MIT License - see [LICENSE](https://github.com/ursisterbtw/ccprompts/blob/main/LICENSE) for details.

---

**Note**: This plugin provides access to powerful development tools. Always review command documentation and use safety features when working with production systems.