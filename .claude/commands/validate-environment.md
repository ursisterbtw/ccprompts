# Validate-Environment Command

This command checks if the development environment is properly configured for executing Claude Code prompts.

## Usage

```
/validate-environment
```

## Description

Performs comprehensive validation of the development environment and tooling:

1. Verifies Claude Code configuration and permissions
2. Validates required development tools and dependencies
3. Checks integration with external services and APIs
4. Tests MCP server connectivity and functionality
5. Validates security configurations and access controls
6. Provides remediation steps for any identified issues

## Validation Categories

### Claude Code Environment

- **Installation**: Claude Code version and update status
- **Configuration**: .claude/ directory structure and settings
- **Permissions**: File system access and tool permissions
- **Commands**: Custom command availability and functionality
- **Workflows**: Workflow definition validation and dependencies
- **Memory**: Session memory and context management

### Development Tools

- **Version Control**: Git installation, configuration, and authentication
- **Package Managers**: npm/yarn, pip, cargo, go mod availability and configuration
- **Build Tools**: Compiler/interpreter versions and build system setup
- **Testing Frameworks**: Test runner installation and configuration
- **Linting/Formatting**: Code quality tool setup and configuration
- **IDE Integration**: Editor/IDE Claude Code plugin status

### External Integrations

- **GitHub/GitLab**: API access and authentication status
- **Cloud Providers**: AWS/GCP/Azure CLI tools and authentication
- **Container Platforms**: Docker/Podman installation and access
- **Monitoring Services**: APM and logging service integrations
- **Security Tools**: Security scanner availability and configuration
- **Database Connections**: Database client tools and connectivity

### MCP Server Status

- **Server Availability**: Configured MCP servers running status
- **Tool Functionality**: MCP tool responsiveness and permissions
- **Resource Access**: MCP resource availability and data freshness
- **Authentication**: MCP server authentication and token validity
- **Performance**: MCP server response times and reliability
- **Error Handling**: MCP server error rates and recovery mechanisms

### Security Configuration

- **Secrets Management**: Environment variable and secret handling
- **Access Controls**: File permissions and user access validation
- **Network Security**: Firewall and proxy configurations
- **Certificate Validation**: SSL/TLS certificate status and expiration
- **Compliance Tools**: Security scanning and compliance checking tools
- **Backup Systems**: Data backup and recovery system status

### Project-Specific Requirements

- **Dependencies**: Project dependency installation and compatibility
- **Environment Variables**: Required configuration variables presence
- **Database Schema**: Database connectivity and schema validation
- **Service Dependencies**: External service availability and configuration
- **Performance Tools**: Profiling and monitoring tool availability
- **Documentation Tools**: Documentation generation system status

## Validation Results

### Health Score (0-100%)

- **90-100%**: Excellent - Ready for all prompt operations
- **80-89%**: Good - Minor issues, most prompts will work
- **70-79%**: Fair - Some limitations, targeted prompts recommended
- **60-69%**: Poor - Significant gaps, setup required before prompt usage
- **Below 60%**: Critical - Environment setup required

### Issue Severity Levels

- **Critical**: Blocks essential Claude Code functionality
- **High**: Limits advanced prompt capabilities
- **Medium**: Reduces efficiency or reliability
- **Low**: Minor improvements for optimal experience
- **Info**: Recommendations for enhanced functionality

## Remediation Guidance

### Automatic Fixes

Issues that can be resolved automatically:

- Missing configuration files creation
- Package installation and updates
- Permission adjustments
- Basic tool configuration

### Guided Setup

Step-by-step instructions for manual resolution:

- Authentication setup for external services
- Complex tool configuration
- Integration setup procedures
- Security configuration hardening

### Environment-Specific Instructions

Platform and OS-specific guidance:

- macOS development environment setup
- Linux distribution-specific instructions
- Windows/WSL configuration
- Container-based development environments

## Example Validation Report

```
Claude Code Environment Validation Report
==========================================

Overall Health Score: 85/100 (Good)

✅ Claude Code Installation: v1.2.3 (Latest)
✅ Configuration: .claude/ directory properly configured
⚠️  MCP Servers: GitHub server authentication expired
✅ Development Tools: All required tools available
❌ Security Configuration: Secrets in environment variables
✅ Project Dependencies: All dependencies satisfied

Priority Actions:
1. [High] Renew GitHub token for MCP server
2. [Medium] Move secrets to secure secret management
3. [Low] Update Docker to latest version

Estimated Setup Time: 30 minutes
```

## Integration with Other Commands

- **Auto-validation**: Runs automatically before executing complex workflows
- **Smart routing**: Redirects to appropriate setup commands when issues detected
- **Progress tracking**: Monitors environment health improvements over time
- **Command prerequisites**: Validates requirements before specific prompt execution

## Parameters

No parameters required. The command automatically performs comprehensive environment validation.

## Examples

```bash
# Validate current development environment
/validate-environment

# Example output:
# Environment Health Score: 85/100 (Good)
# ✅ Claude Code: v1.2.3 (Latest)
# ✅ Git: v2.39.1 with authentication
# ⚠️  MCP: GitHub server token expires in 5 days
# ❌ Security: Environment variables contain secrets
# ✅ Dependencies: All project dependencies satisfied
# 
# Priority Actions:
# 1. [High] Renew GitHub MCP server token
# 2. [Medium] Move secrets to secure storage
# 3. [Low] Update Docker to latest version
```

## Continuous Monitoring

- **Daily health checks**: Automated environment status monitoring
- **Proactive alerts**: Notifications for expiring tokens or failing services
- **Trend analysis**: Environment health trends and degradation patterns
- **Team dashboards**: Shared environment status for development teams

```xml
<role>
You are an expert environment validation specialist with deep knowledge of system configuration, environment consistency, and validation automation. You specialize in comprehensive environment verification and setup.
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
