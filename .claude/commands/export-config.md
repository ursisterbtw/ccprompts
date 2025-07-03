# Export-Config Command

This command enables export and sharing of Claude Code configurations, setups, and customizations.

## Usage

```
/export-config [type] [scope] [format]
```

## Parameters

- `type`: full, commands, workflows, settings, prompts, templates
- `scope`: personal, project, team, organization
- `format`: zip, tar, json, yaml, portable

## Examples

```
/export-config
/export-config full project zip
/export-config commands team json
/export-config workflows personal yaml
/export-config settings organization portable
```

## Description

Comprehensive configuration export and sharing system:

1. Complete Claude Code environment export and backup
2. Selective export of specific configuration components
3. Cross-platform portable configuration packages
4. Team and organization-wide configuration sharing
5. Version control integration for configuration management
6. Automated setup scripts for rapid environment replication

## Export Types

### Full Configuration Export

Complete Claude Code environment including:

- All custom commands and aliases
- Workflow definitions and templates
- Project-specific settings and configurations
- Custom prompts and modifications
- MCP server configurations
- Integration settings and API keys (sanitized)

### Selective Component Export

- **Commands Only**: Custom command definitions and usage patterns
- **Workflows Only**: Workflow templates and execution history
- **Settings Only**: Configuration files and preferences
- **Prompts Only**: Custom and modified prompt definitions
- **Templates Only**: Reusable templates and scaffolds

## Export Scopes

### Personal Configuration

Individual developer settings and customizations:

```
Personal Claude Code Configuration Export
========================================

📁 Commands (12 custom commands)
├── /quick-deploy
├── /local-test
├── /sync-docs
└── ... (9 more)

📁 Workflows (8 personal workflows)
├── morning-standup-prep.yaml
├── pre-commit-checks.yaml
├── weekend-maintenance.yaml
└── ... (5 more)

📁 Settings
├── personal-preferences.json
├── tool-integrations.yaml
├── notification-config.json
└── environment-variables.env (sanitized)

📁 Custom Prompts (3 modifications)
├── enhanced-security-audit.md
├── team-specific-bootstrap.md
└── custom-documentation.md

Export Size: 2.3 MB
Created: 2024-01-15 14:30:00 UTC
Compatibility: Claude Code v1.2.0+
```

### Project Configuration

Project-specific settings and team configurations:

- CLAUDE.md project guidance files
- Project-specific command definitions
- Workflow templates tailored to project needs
- Technology stack-specific configurations
- CI/CD integration settings

### Team Configuration

Shared team standards and workflows:

- Standard command library for team consistency
- Approved workflow templates and best practices
- Team coding standards and quality gates
- Shared prompt modifications and enhancements
- Integration configurations for team tools

### Organization Configuration

Enterprise-wide standards and compliance:

- Corporate compliance and security templates
- Organization-wide development standards
- Approved tool integrations and configurations
- Security policies and access controls
- Audit trails and governance configurations

## Export Formats

### ZIP Archive (.zip)

```
claude-config-export-2024-01-15.zip
├── README.md                    # Setup instructions
├── metadata.json               # Export metadata and compatibility
├── .claude/
│   ├── config.json            # Main configuration
│   ├── commands/              # Custom commands
│   │   ├── deploy.md
│   │   ├── test-suite.md
│   │   └── ... (more commands)
│   ├── workflows/             # Workflow definitions
│   │   ├── ci-cd.yaml
│   │   ├── security-review.yaml
│   │   └── ... (more workflows)
│   └── templates/             # Reusable templates
├── prompts/                   # Custom prompts
│   ├── modified/              # Modified existing prompts
│   └── custom/                # Completely custom prompts
├── scripts/                   # Setup and installation scripts
│   ├── install.sh            # Unix setup script
│   ├── install.ps1           # Windows setup script
│   └── verify.py             # Configuration verification
└── docs/                     # Documentation
    ├── SETUP.md              # Installation guide
    ├── CUSTOMIZATIONS.md     # Customization details
    └── CHANGELOG.md          # Configuration history
```

### Portable Package (.portable)

Self-contained package with automatic setup:

- Embedded Claude Code version compatibility checker
- Automatic dependency resolution and installation
- Interactive setup wizard for first-time users
- Rollback capabilities for failed installations
- Cross-platform compatibility layer

### JSON Configuration (.json)

```json
{
  "export_metadata": {
    "version": "1.0.0",
    "created": "2024-01-15T14:30:00Z",
    "creator": "user@company.com",
    "scope": "team",
    "compatibility": "claude-code>=1.2.0"
  },
  "configuration": {
    "settings": {
      "extended_thinking": "always",
      "permission_mode": "acceptEdits",
      "allowed_tools": ["Read", "Write", "Edit", "Bash"]
    },
    "commands": [
      {
        "name": "deploy",
        "description": "Deploy to staging environment",
        "file": "commands/deploy.md",
        "usage_count": 45,
        "success_rate": 0.94
      }
    ],
    "workflows": [
      {
        "name": "CI/CD Pipeline",
        "file": "workflows/ci-cd.yaml",
        "dependencies": ["docker", "kubernetes"],
        "execution_count": 23
      }
    ]
  }
}
```

### YAML Configuration (.yaml)

Human-readable format optimized for version control:

- Comments and documentation embedded
- Easy diff and merge capabilities
- Template variable support
- Environment-specific overrides

## Setup and Installation

### Automated Installation Scripts

Generated scripts for different platforms:

```bash
#!/bin/bash
# Claude Code Configuration Setup Script
# Generated: 2024-01-15 14:30:00 UTC

echo "Installing Claude Code Configuration..."

# Verify Claude Code installation
if ! command -v claude-code &> /dev/null; then
    echo "Error: Claude Code not found. Please install Claude Code first."
    exit 1
fi

# Backup existing configuration
if [ -d ".claude" ]; then
    echo "Backing up existing configuration..."
    cp -r .claude .claude.backup.$(date +%s)
fi

# Extract and install configuration
echo "Installing configuration files..."
mkdir -p .claude/{commands,workflows,templates}
cp -r extracted/commands/* .claude/commands/
cp -r extracted/workflows/* .claude/workflows/
cp -r extracted/templates/* .claude/templates/
cp extracted/config.json .claude/

# Verify installation
echo "Verifying configuration..."
python3 scripts/verify.py

echo "Configuration installed successfully!"
echo "Run 'claude-code --help' to see available commands."
```

### Interactive Setup Wizard

```
Claude Code Configuration Setup Wizard
=====================================

Welcome! This wizard will help you install and configure your
Claude Code environment.

Step 1/5: Environment Detection
✅ Claude Code v1.2.3 detected
✅ Git repository detected
✅ Required permissions available

Step 2/5: Configuration Scope
Choose installation scope:
1. Personal (current user only)
2. Project (current repository only)
3. Team (shared team configuration)

Selection: 2

Step 3/5: Component Selection
Select components to install:
☑ Custom Commands (12 commands)
☑ Workflows (8 workflows)  
☑ Modified Prompts (3 prompts)
☐ Templates (5 templates)
☐ Integration Settings

Step 4/5: Customization
Configure settings for your environment:
- Project Type: Web Application
- Team Size: 5-10 developers
- Tech Stack: TypeScript, React, Node.js
- Deployment: AWS, Docker

Step 5/5: Installation
Installing configuration...
✅ Commands installed (12/12)
✅ Workflows installed (8/8)
✅ Prompts installed (3/3)
✅ Configuration validated

Installation complete! Run '/help' to see available commands.
```

## Configuration Management

### Version Control Integration

- Git hooks for automatic configuration backup
- Configuration change tracking and history
- Merge conflict resolution for team configurations
- Branch-specific configuration variations
- Automated synchronization across team members

### Configuration Validation

- Compatibility checking with Claude Code versions
- Dependency validation for workflows and commands
- Security scanning for sensitive data exposure
- Performance impact assessment
- Best practice compliance checking

### Update Management

- Automatic update notifications for shared configurations
- Incremental updates with change summaries
- Rollback capabilities for problematic updates
- A/B testing for configuration changes
- Usage analytics for configuration effectiveness

## Security and Privacy

### Data Sanitization

- Automatic removal of sensitive information (API keys, passwords)
- Environment variable placeholder generation
- Personal information redaction
- Access token revocation and regeneration
- Secure sharing protocols

### Access Control

- Role-based configuration sharing
- Encrypted configuration packages
- Digital signatures for authenticity verification
- Audit trails for configuration access
- Compliance with enterprise security policies

## Integration Features

### Team Collaboration

- Configuration sharing via GitHub/GitLab
- Team configuration templates and standards
- Change approval workflows
- Usage analytics and optimization recommendations
- Knowledge base integration

### Enterprise Features

- Central configuration management
- Policy enforcement and compliance checking
- Bulk deployment to multiple environments
- Configuration as code workflows
- Integration with enterprise tools (LDAP, SSO)

## Related Commands

- `/validate-environment` - Verify configuration after import
- `/workflow-builder` - Create workflows with imported templates
- `/prompt-stats` - Analyze usage of imported configurations
- `/health-check` - Assess configuration effectiveness

```xml
<role>
You are an expert configuration management specialist with deep knowledge of configuration formats, deployment automation, and system integration. You specialize in configuration export and sharing workflows.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Analyze and assess current state:
   - Evaluate existing configuration and implementation
   - Identify gaps and improvement opportunities
   - Assess compliance and best practice adherence
   - Review current workflows and processes

2. Implement comprehensive solutions:
   - Design and implement optimized workflows
   - Create automation and integration solutions
   - Establish best practices and standards
   - Set up monitoring and validation systems

3. Provide actionable recommendations:
   - Generate specific improvement suggestions
   - Create prioritized action plans with timelines
   - Provide implementation guides and documentation
   - Establish success metrics and validation criteria

4. Facilitate continuous improvement:
   - Create feedback loops and monitoring systems
   - Implement learning and adaptation mechanisms
   - Establish maintenance and evolution processes
   - Build team capability and knowledge sharing

5. Ensure quality and compliance:
   - Validate implementations against requirements
   - Ensure security and compliance standards
   - Create comprehensive documentation and reporting
   - Establish audit trails and accountability measures
</instructions>
```
