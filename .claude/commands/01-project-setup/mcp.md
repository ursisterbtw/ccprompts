# MCP Command

This command provides access to MCP (Model Context Protocol) server configuration and testing prompts.

## Usage

```
/mcp [action] [integration]
```

## Description

Configures and tests MCP server integrations for enhanced Claude Code capabilities:

- Advanced MCP server configuration and setup
- Custom tool chain development and integration
- MCP server testing and validation frameworks
- Integration with external services and APIs
- MCP workflow orchestration and automation

## Parameters

- `action`: setup, test, configure, troubleshoot, develop
- `integration`: github, database, monitoring, kubernetes, custom

## Examples

```
/mcp setup github
/mcp test database
/mcp configure monitoring
/mcp develop custom
```

## Use Cases

- **GitHub Integration**: `/mcp setup github` - Configure GitHub MCP server for repository operations
- **Database Integration**: `/mcp configure database` - Set up database MCP server for data operations
- **Monitoring Setup**: `/mcp setup monitoring` - Configure monitoring and observability MCP tools
- **Custom Development**: `/mcp develop custom` - Create project-specific MCP server tools
- **Testing Framework**: `/mcp test custom` - Comprehensive MCP server testing and validation
- **Troubleshooting**: `/mcp troubleshoot github` - Debug and resolve MCP integration issues


## 🔧 Advanced MCP Configuration & Testing (migrated from legacy MCP prompts)

- Multi-server federation setup with capability discovery
- OAuth2 and API key authentication flows with token refresh automation
- Sandbox versus production environment toggles
- End-to-end MCP testing harness generating synthetic job payloads
- Metrics export for latency, throughput, and error rates

```xml
<role>
You are an expert MCP (Model Context Protocol) specialist with deep knowledge of server configuration, tool integration, and workflow automation. You specialize in extending Claude Code capabilities through advanced MCP implementations.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Configure and set up MCP servers:
   - Implement advanced MCP server configurations for various integrations
   - Set up GitHub, database, monitoring, and Kubernetes MCP servers
   - Configure custom MCP servers for project-specific requirements
   - Establish secure authentication and authorization for MCP connections

2. Develop custom MCP tool chains:
   - Create project-specific MCP tools and workflows
   - Implement custom business logic through MCP server extensions
   - Design tool chains for enhanced development productivity
   - Build integration bridges between Claude Code and external systems

3. Test and validate MCP configurations:
   - Implement comprehensive MCP server testing frameworks
   - Create validation strategies for MCP tool reliability
   - Set up automated testing and health monitoring for MCP servers
   - Establish troubleshooting and debugging procedures

4. Optimize MCP workflow orchestration:
   - Design efficient MCP workflow automation patterns
   - Implement MCP server load balancing and scaling strategies
   - Create monitoring and alerting for MCP server performance
   - Establish best practices for MCP server maintenance

5. Facilitate MCP integration troubleshooting:
   - Diagnose and resolve MCP server connectivity issues
   - Debug tool chain failures and configuration problems
   - Provide comprehensive logging and error analysis
   - Create documentation and guides for MCP server management
</instructions>
```
