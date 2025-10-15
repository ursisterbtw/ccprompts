# Debug-Session Command

This command provides comprehensive troubleshooting and debugging capabilities for Claude Code issues and session problems.

## Usage

```bash
/debug-session [issue-type] [scope] [verbosity]
```

## Parameters

- `issue-type`: connection, performance, commands, workflows, prompts, tools, mcp
- `scope`: current-session, environment, configuration, history
- `verbosity`: basic, detailed, diagnostic, trace

## Examples

```bash
/debug-session
/debug-session connection environment detailed
/debug-session performance current-session
/debug-session commands configuration diagnostic
/debug-session mcp environment trace
```

## Description

Advanced debugging and troubleshooting system for Claude Code:

1. Comprehensive session state analysis and diagnostics
2. Performance profiling and bottleneck identification
3. Configuration validation and error detection
4. Tool and MCP server connectivity troubleshooting
5. Historical issue analysis and pattern recognition
6. Automated fix suggestions and resolution guidance

## Diagnostic Categories

### Session State Analysis

- **Memory Usage**: Context window utilization and optimization
- **Tool Permissions**: Available tools and access restrictions
- **Configuration State**: Current settings and overrides
- **Session History**: Command history and execution patterns
- **Performance Metrics**: Response times and processing efficiency
- **Error Tracking**: Recent failures and warning patterns

### Connection Diagnostics

- **Network Connectivity**: Internet and service reachability
- **Authentication Status**: API keys and token validation
- **Service Health**: Claude API and related service status
- **Proxy Configuration**: Corporate proxy and firewall settings
- **SSL/TLS Issues**: Certificate validation and encryption problems
- **Rate Limiting**: API quota and throttling analysis

### Tool and MCP Integration

- **Tool Availability**: Installed and accessible tools
- **MCP Server Status**: Running servers and health checks
- **Permission Validation**: Tool access and security restrictions
- **Resource Access**: File system and external resource permissions
- **Integration Health**: Third-party service connectivity
- **Version Compatibility**: Tool and server version alignment

## Debug Reports

### Quick Diagnostic Summary

```text
Claude Code Debug Report
========================
Generated: 2024-01-15 14:30:00 UTC
Session ID: cc-session-a1b2c3d4

[SCAN] Overall Health: [WARNING] NEEDS ATTENTION

Critical Issues (2):
├── [ERROR] MCP Server 'github' not responding (timeout after 30s)
└── [ERROR] File permissions denied for /project/src/ directory

Warnings (3):
├── [WARNING]  High memory usage: 85% of context window used
├── [WARNING]  Slow response times: avg 15s (baseline: 3s)
└── [WARNING]  Configuration drift: .claude/config.json outdated

Performance:
├── Average Response Time: 15.2s (+400% from baseline)
├── Success Rate: 78% (-15% from baseline)
├── Memory Usage: 85% context window
└── Tool Execution: 12.3s average

Recommendations:
1. [Critical] Fix MCP server connection issue
2. [Critical] Resolve file permission problems
3. [High] Clear session context or start fresh session
4. [Medium] Update configuration to latest version
```

### Detailed Diagnostic Report

```text
Detailed Debug Analysis: Connection Issues
=========================================

[NETWORK] Network Connectivity
├── Internet Access: [OK] Connected
├── DNS Resolution: [OK] All hostnames resolved
├── Claude API Reachability: [OK] api.anthropic.com accessible
├── Response Time: [WARNING]  2.3s (slow, baseline: 0.8s)
├── Bandwidth: [OK] 45.2 Mbps download, 12.1 Mbps upload
└── Packet Loss: [OK] 0% loss over 100 packets

[AUTH] Authentication & Authorization
├── API Key Status: [OK] Valid and active
├── Token Expiration: [OK] Valid for 89 days
├── Rate Limit Status: [WARNING]  78% of hourly limit used
├── Permission Scope: [OK] All required permissions granted
└── Account Status: [OK] Active subscription

[CONFIG] MCP Server Analysis
├── Configured Servers: 3 (github, database, monitoring)
├── github: [ERROR] Connection timeout after 30s
│   ├── Last Successful: 2024-01-15 13:45:00 UTC (45 minutes ago)
│   ├── Error Count: 5 failures in last hour
│   ├── Port Status: 3001 - Connection refused
│   └── Logs: "Error: ECONNREFUSED 127.0.0.1:3001"
├── database: [OK] Connected and responsive (245ms)
└── monitoring: [OK] Connected and responsive (156ms)

[FOLDER] File System Access
├── Current Directory: /home/user/project
├── Read Access: [OK] All files readable
├── Write Access: [ERROR] Permission denied for src/ directory
│   ├── Owner: root (expected: user)
│   ├── Permissions: drwxr-xr-x (expected: drwxrwxr-x)
│   └── Fix: Request admin assistance or use proper permission management
├── Tool Execution: [OK] Bash, Git, npm available
└── Environment Variables: [OK] All required variables set

[ANALYZE] Session Memory Analysis
├── Context Window: 85% used (170k/200k tokens)
├── Conversation Length: 47 messages
├── File Content Cache: 34 files cached (23MB)
├── Recent Heavy Operations:
│   ├── Large codebase analysis: 15k tokens
│   ├── Multiple file reads: 12k tokens
│   └── Generated documentation: 8k tokens
└── Optimization Suggestions:
    ├── Clear file cache to reclaim 35% context
    ├── Summarize conversation history
    └── Use focused queries for large operations
```

### Performance Profiling

```text
Performance Analysis Report  
==========================

[STATS] Response Time Breakdown (Last 10 Commands)
Command                 │ Total Time │ Network │ Processing │ Tool Exec
───────────────────────┼────────────┼─────────┼────────────┼──────────
/read large-file.js    │    18.5s   │   2.1s  │    14.2s   │   2.2s
/edit complex-comp.tsx │    22.1s   │   1.8s  │    16.5s   │   3.8s
/search-prompts perf   │     4.2s   │   1.1s  │     2.8s   │   0.3s
/analyze-project       │    31.4s   │   2.3s  │    24.1s   │   5.0s

[CRITICAL] Performance Bottlenecks
1. Large File Processing (avg 16.2s)
   - Files > 1000 lines taking excessive time
   - Recommendation: Use targeted reads with line ranges
   
2. Complex Analysis Operations (avg 24.1s)
   - Multi-file analysis overwhelming context
   - Recommendation: Break into smaller scoped operations
   
3. Tool Execution Delays (avg 3.8s)
   - File system operations slower than expected
   - Recommendation: Check disk I/O and available space

[MEMORY] Memory Usage Patterns
├── Peak Usage: 92% (during large file analysis)
├── Average Usage: 67%
├── Memory Leaks: None detected
├── Cache Efficiency: 78% hit rate
└── Garbage Collection: 3 collections in last hour

[PROCESS] Session Stability
├── Uptime: 2h 34m
├── Reconnections: 0
├── Failed Commands: 3 (tool permission errors)
├── Recovery Time: avg 2.1s
└── Overall Stability: 94%
```

## Issue Resolution

### Automated Fixes

Issues that can be resolved automatically:

- Configuration file updates and repairs
- Permission corrections for accessible files
- Cache clearing and memory optimization
- Environment variable setup
- Basic tool installation and updates

### Guided Resolution

Step-by-step instructions for manual fixes:

- MCP server configuration and troubleshooting
- Network and firewall configuration
- Complex permission and access issues
- Performance optimization strategies
- Integration setup and authentication

### External Dependencies

Issues requiring external action:

- System-level permission changes
- Network infrastructure problems
- Third-party service outages
- Hardware resource limitations
- Corporate policy restrictions

## Common Issues and Solutions

### Connection Problems

```text
Issue: MCP Server Connection Failed
===================================

Symptoms:
- Tools from specific MCP server not available
- Timeout errors when accessing server resources
- "Connection refused" or "Server not found" errors

Diagnostic Steps:
1. Check if MCP server process is running
   → ps aux | grep mcp-server
   
2. Verify port availability
   → netstat -tlnp | grep 3001
   
3. Test manual connection
   → curl http://localhost:3001/health
   
4. Check server logs
   → tail -f ~/.mcp/logs/github-server.log

Common Solutions:
- Restart MCP server: systemctl restart mcp-github
- Check configuration: ~/.mcp/config.json
- Update server: npm update -g @mcp/github-server
- Verify authentication: check API tokens

Prevention:
- Set up health monitoring for MCP servers
- Regular updates and maintenance schedule
- Automated restart on failure
```

### Performance Issues

```text
Issue: Slow Response Times
=========================

Symptoms:
- Commands taking longer than usual to complete
- Timeouts on complex operations
- High memory usage warnings

Diagnostic Steps:
1. Check system resources
   → top, htop, or Activity Monitor
   
2. Analyze network connectivity
   → ping api.anthropic.com
   → traceroute api.anthropic.com
   
3. Review session context usage
   → Check context window utilization
   
4. Identify resource-intensive operations
   → Review recent command history

Optimization Strategies:
- Break large operations into smaller chunks
- Use targeted file reads instead of full file access
- Clear session context when reaching limits
- Optimize MCP server performance
- Consider local caching strategies
```

### Tool Access Problems

```bash
Issue: Tool Permission Denied
============================

Symptoms:
- "Permission denied" errors when accessing files
- Tools not available or non-functional
- Limited functionality compared to expected

Resolution Steps:
1. Check file permissions
   → ls -la problematic-directory/
   
2. Verify user ownership
   → whoami
   → ls -la | grep username
   
3. Fix permissions if needed
   → Request admin assistance for ownership changes
   → Use proper permission management tools
   
4. Verify tool availability
   → which git, docker, npm, etc.
   
5. Check PATH environment
   → echo $PATH
   → Check if tool directories are included
```

## Historical Analysis

### Issue Pattern Recognition

- Identify recurring problems and their triggers
- Analyze correlation between issues and system changes
- Track resolution effectiveness over time
- Predict potential issues based on usage patterns

### Performance Trend Analysis

- Monitor performance degradation over time
- Identify optimal usage patterns and configurations
- Track improvement from optimization efforts
- Benchmark against historical performance data

### Usage Analytics

- Analyze command usage patterns for optimization
- Identify most problematic operations
- Track user behavior leading to issues
- Recommend workflow improvements

## Integration Features

### Logging and Monitoring

- Comprehensive logging of all debug sessions
- Integration with system monitoring tools
- Automated alerting for critical issues
- Performance metrics export for analysis

### Support Integration

- Generate support tickets with diagnostic data
- Integration with help desk systems
- Automated escalation for critical issues
- Knowledge base integration for common solutions

### Team Collaboration

- Share debug reports with team members
- Collaborative troubleshooting workflows
- Team-wide issue tracking and resolution
- Best practice sharing for common problems

## Related Commands

- `/validate-environment` - Proactive environment health checking
- `/health-check` - Comprehensive project health assessment
- `/export-config` - Backup configurations before troubleshooting
- `/prompt-stats` - Analyze usage patterns affecting performance

```xml
<role>
You are an expert debugging specialist with deep knowledge of troubleshooting methodologies, diagnostic tools, and problem-solving techniques. You specialize in systematic debugging and issue resolution.
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

