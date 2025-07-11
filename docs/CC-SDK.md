# Claude Code SDK comprehensive guide

Claude Code SDK is Anthropic's **extensible CLI-based agentic coding tool** that enables Claude to work as an autonomous development assistant capable of understanding entire codebases, performing multi-file operations, and executing complex development workflows directly in your terminal. Unlike regular Claude API usage, it features automatic context gathering, built-in file operations, git integration, and a permission-based security system - making it a useful tool for automated code review, refactoring, and development tasks.

## Core capabilities and features

The Claude Code SDK fundamentally differs from regular Claude through its **agentic architecture** and deep integration with development environments. It automatically maps and understands entire codebases without manual context selection, using Claude Opus 4 as an autonomous agent rather than just a conversational AI.

**Key capabilities** include multi-file operations that maintain consistency across codebases, complete git workflow handling (history search, commit creation, PR generation, merge conflict resolution), direct command execution for tests and builds, and real-time file operations with a permission-based approval system. The SDK offers three interfaces: a command-line interface (`claude` command), TypeScript SDK (`@anthropic-ai/claude-code`), and Python SDK (`claude-code-sdk`), plus it can function as an MCP server for other applications.

What sets Claude Code apart is its **context automation** - it automatically pulls relevant code context without manual file selection, maintains persistent sessions that can be resumed, and implements a tiered permission system for different operation types. Enterprise features include integration with Amazon Bedrock and Google Vertex AI, development container support for enhanced security, and beta IDE extensions for VS Code and JetBrains.

## Best practices for writing effective prompts

Successful Claude Code prompting relies on **structured organization** and clear task decomposition. The most effective approach uses XML tags to organize prompts into distinct sections:

```xml
<instructions>
Your specific task instructions here
</instructions>

<context>
Project context, audience, constraints
</context>

<examples>
<example>
Input: Example input
Output: Expected output format
</example>
</examples>
```

An important feature is the **CLAUDE.md configuration file** placed in your project root. This file loads automatically and should contain frequently used commands, code style preferences, and project structure information. For monorepos or global settings, place it in parent directories or `~/.claude/CLAUDE.md`.

The recommended **4-step development workflow** maximizes Claude Code's capabilities: First, use a research phase ("Analyze the codebase structure and identify the best approach"), then planning ("Create a detailed implementation plan"), followed by implementation ("Implement the solution following the plan"), and finally finalization ("Create appropriate commit messages and PR documentation").

For automation, leverage **custom slash commands** by storing prompt templates in `.claude/commands/` as Markdown files. Headless mode enables scripted workflows: `claude -p "Fix all linting errors" --output-format json` for single executions or `--output-format stream-json` for real-time processing.

## Limitations and constraints vs regular Claude

Claude Code operates under **strict security boundaries** that differ significantly from regular Claude. Directory access is limited to the folder where Claude Code was started and its subfolders - it cannot traverse to parent directories. This creates clear security boundaries but means you must start Claude Code from the appropriate project root.

**Platform limitations** include native support only for macOS 10.15+ and Ubuntu 20.04+/Debian 10+, with Windows requiring WSL (which can have Node.js dependency issues). Usage limits are shared between claude.ai and Claude Code for Max plan users, with more frequent rate limiting warnings due to autonomous operations.

**Functional constraints** include file upload limits of 30MB per file and maximum 20 files per chat session, output length limitations around 2048 tokens per response, and context window restrictions of 200K tokens for Claude 3.7 Sonnet. The system can experience "unexpected capacity constraints" during peak usage and doesn't provide automatic file system snapshots, requiring manual git staging.

The **permission system** adds another layer of difference - command injection detection requires manual approval for suspicious bash commands, with fail-closed matching that defaults unmatched commands to requiring approval. Trust verification is required for first-time codebase runs and new MCP servers.

## Leveraging MCP servers and file operations

The **Model Context Protocol (MCP)** forms the backbone of Claude Code's extensibility. MCP provides three core components: Resources (file-like data readable by clients), Tools (LLM-callable functions with user approval), and Prompts (pre-written task templates).

Claude Code functions as both MCP client and server. As a client, it connects to external MCP servers configured via `.mcp.json` files, supporting stdio, SSE, and HTTP transport protocols. As a server, start it with `claude mcp serve` to expose Claude's capabilities to other MCP clients.

**Built-in file tools** provide comprehensive file system access: Read (with automatic encoding detection), Write (with permission checks), Edit (surgical modifications to specific sections), LS (directory exploration), Grep (content search), and Glob (pattern-based selection). Advanced operations include batch editing with "Accept Edits" mode, automatic git integration, and working directory control via the `cwd` parameter.

Popular MCP integrations expand capabilities significantly: **Puppeteer MCP** for browser automation, **GitHub MCP** for repository management, **Sentry MCP** for error monitoring, and **DigitalOcean MCP** for cloud deployment. Enterprise integrations include enhanced filesystem operations, database connectors, API gateways, and monitoring tools.

Implementation is straightforward in both TypeScript and Python:

```typescript
import { query } from '@anthropic-ai/claude-code';

const options = {
  allowedTools: ['Read', 'Write', 'Bash', 'GitHub'],
  mcpServers: ['github', 'puppeteer'],
  permissionMode: 'acceptEdits'
};

for await (const message of query('Deploy this app', options)) {
  // Process deployment workflow
}
```

## Optimal prompt format and structure

The most effective prompt structure for Claude Code follows a **role-context-instructions pattern** with XML tags for clarity. Start with role definition, provide clear numbered instructions, include relevant context, and specify exact output requirements:

```xml
<role>
You are a senior full-stack developer working on a production application
</role>

<instructions>
1. Analyze the current implementation
2. Identify improvement opportunities
3. Implement changes with testing
4. Document modifications
</instructions>

<context>
- Target audience: Enterprise users
- Constraints: Must maintain backward compatibility
- Success criteria: 100% test coverage
</context>

<output_format>
Provide implementation with inline documentation
</output_format>
```

**Claude Code specific patterns** emphasize natural language over technical jargon, include coding style preferences in system prompts, specify tool usage policies, and define error handling procedures. The system prompt optimization should prioritize maintainability and establish clear boundaries for architectural changes.

For complex tasks, implement **chain of thought patterns** with explicit thinking sections before implementation. Multi-agent coordination uses the Task tool for spawning sub-agents with different expertise areas, implementing supervisor patterns for workflows spanning multiple domains.

**Output formatting** supports multiple modes: JSON for automation (`--output-format json`), streaming JSON for real-time processing (`--output-format stream-json`), and structured message schemas including assistant messages, user messages, result messages with metadata, and error messages with debugging details.

## Additional capabilities and best practices

**File handling** in Claude Code excels at multi-file refactoring while maintaining consistency. Use glob patterns for bulk operations, leverage git integration for safe experimentation, and implement staged approvals for critical changes. The system automatically detects file encodings and handles binary files appropriately.

**Directory traversal** is intentionally restricted for security but can be managed effectively by starting Claude Code from the appropriate root directory, using relative paths within the allowed scope, and leveraging git worktrees for parallel development in different directories.

**Code analysis capabilities** include automatic dependency mapping, cross-file reference tracking, pattern detection and refactoring suggestions, and comprehensive test coverage analysis. Claude Code understands project structures, build systems, and can suggest architectural improvements.

**Performance optimization** strategies include starting new conversations for distinct tasks to manage token usage, using targeted file selection rather than full codebase ingestion, implementing headless mode for automated workflows, and monitoring resource consumption with verbose flags.

For **enterprise deployments**, implement development containers for additional security, integrate with existing CI/CD pipelines through GitHub Actions, use custom firewall rules for network isolation, and leverage audit logging for compliance requirements. Cost management involves monitoring API token consumption, using appropriate models for different tasks (Haiku for simple operations, Sonnet for complex analysis), and implementing budget alerts through usage tracking.

## Conclusion

Claude Code SDK represents a paradigm shift in AI-assisted development, moving from conversational assistance to autonomous development capabilities. Success requires understanding its unique architecture, respecting security boundaries, and leveraging its extensive tool ecosystem. By following the structured prompting patterns, utilizing MCP servers effectively, and implementing proper workflow integration, developers can achieve significant productivity gains while maintaining code quality and security standards. The platform's strength lies not just in its technical capabilities but in its thoughtful design that balances power with safety, making it suitable for both individual developers and enterprise teams.
