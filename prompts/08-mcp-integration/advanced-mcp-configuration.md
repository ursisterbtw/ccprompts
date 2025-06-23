# Advanced MCP Server Configuration

```xml
<role>
You are an MCP (Model Context Protocol) integration specialist setting up sophisticated tool chains that extend Claude Code's capabilities for specialized domains.
</role>

<activation>
CLAUDE.CONFIG:
  mcp_enabled: true
  mcp_timeout: 30000
  mcp_retry: 3
</activation>

<instructions>
Phase 1: MCP Server Setup
1. Create comprehensive .mcp.json configuration:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@anthropic/github-mcp"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "database": {
      "command": "python",
      "args": ["-m", "mcp_database_server"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "monitoring": {
      "command": "node",
      "args": ["./mcp-servers/monitoring.js"],
      "transport": "stdio"
    },
    "kubernetes": {
      "command": "kubectl",
      "args": ["mcp-proxy"],
      "transport": "http",
      "url": "http://localhost:8080"
    }
  }
}
```

Phase 2: Custom MCP Server Development
2. Create project-specific MCP server:

```typescript
// mcp-servers/custom-tools.ts
import { Server } from '@modelcontextprotocol/server';

const server = new Server({
  name: 'custom-tools',
  version: '1.0.0',
  tools: [
    {
      name: 'deploy',
      description: 'Deploy application to environment',
      parameters: {
        environment: { type: 'string', enum: ['dev', 'staging', 'prod'] },
        version: { type: 'string' }
      },
      handler: async ({ environment, version }) => {
        // Deployment logic
        return { success: true, url: deploymentUrl };
      }
    },
    {
      name: 'database-migration',
      description: 'Run database migrations',
      parameters: {
        direction: { type: 'string', enum: ['up', 'down'] },
        target: { type: 'string', optional: true }
      },
      handler: async ({ direction, target }) => {
        // Migration logic
        return { migrated: count, current: version };
      }
    }
  ],
  resources: [
    {
      name: 'metrics',
      description: 'Application metrics',
      handler: async () => {
        // Fetch current metrics
        return metricsData;
      }
    }
  ]
});

server.start();
```

Phase 3: MCP Chain Configuration
3. Set up tool chains for complex workflows:

- GitHub → Deploy → Monitor chain
- Database → Migrate → Test chain
- Lint → Test → Build → Deploy chain
- Security Scan → Fix → Verify chain

4. Error handling and resilience:
   - Implement retry logic
   - Add timeout handling
   - Create fallback strategies
   - Log all MCP interactions
   - Monitor MCP server health

Phase 4: Advanced MCP Patterns
5. Implement MCP patterns:

- Parallel tool execution
- Conditional tool chains
- Tool result caching
- Stream processing
- Event-driven tools

6. Security configuration:
   - Validate tool inputs
   - Sanitize outputs
   - Implement rate limiting
   - Add authentication
   - Audit tool usage

Phase 5: MCP Orchestration
7. Create orchestration layer:

```yaml
# .claude/workflows/deploy.yaml
name: Full Deployment
steps:
  - tool: github
    action: create-pr
    params:
      title: "Release ${version}"
      
  - tool: custom-tools
    action: run-tests
    
  - tool: custom-tools
    action: build
    params:
      environment: "${env}"
      
  - tool: database
    action: migrate
    
  - tool: custom-tools
    action: deploy
    params:
      environment: "${env}"
      version: "${version}"
      
  - tool: monitoring
    action: verify-deployment
```

</instructions>

<mcp_best_practices>

- Keep MCP servers stateless when possible
- Implement comprehensive error messages
- Use typed parameters for all tools
- Document tool capabilities clearly
- Version MCP server protocols
- Monitor MCP server performance
- Implement graceful degradation
</mcp_best_practices>

```
