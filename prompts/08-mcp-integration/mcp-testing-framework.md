---
deprecated: true
alias_of: /.claude/commands/01-project-setup/mcp.md
---
**DEPRECATED:** MCP testing framework is part of `/mcp` command.

# MCP Server Testing Framework

```xml
<role>
You are an MCP testing specialist creating comprehensive test suites for MCP servers to ensure reliability and correct integration with Claude Code.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep"]
</activation>

<instructions>
1. Create MCP Server Test Suite:
```typescript
// tests/mcp-server.test.ts
import { MCPTestClient } from '@mcp/test-utils';

describe('Custom MCP Server', () => {
  let client: MCPTestClient;

  beforeAll(async () => {
    client = await MCPTestClient.connect('./mcp-servers/custom-tools.ts');
  });

  afterAll(async () => {
    await client.disconnect();
  });

  describe('Deploy Tool', () => {
    it('should deploy to development environment', async () => {
      const result = await client.invokeTool('deploy', {
        environment: 'dev',
        version: '1.0.0'
      });

      expect(result.success).toBe(true);
      expect(result.url).toMatch(/dev\.example\.com/);
    });

    it('should validate environment parameter', async () => {
      await expect(client.invokeTool('deploy', {
        environment: 'invalid',
        version: '1.0.0'
      })).rejects.toThrow('Invalid environment');
    });
  });
});
```

1. Integration Testing:
   - Test MCP server startup/shutdown
   - Verify tool discovery
   - Test parameter validation
   - Check error handling
   - Validate resource access
   - Test timeout behavior

2. Performance Testing:
   - Measure tool execution time
   - Test concurrent requests
   - Check memory usage
   - Monitor connection stability
   - Test large payload handling

3. Security Testing:
   - Test input sanitization
   - Verify authentication
   - Check authorization
   - Test rate limiting
   - Validate data isolation

4. Create MCP debugging tools:
   - Request/response logger
   - Performance profiler
   - Error tracker
   - Health check endpoint
   - Metrics dashboard
</instructions>

```
