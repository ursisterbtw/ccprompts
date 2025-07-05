# Document Command

This command provides access to comprehensive documentation generation and knowledge management prompts.

## Usage

```
/document [target] [format]
```

## Description

Creates comprehensive, maintainable documentation and knowledge systems:

- API documentation with interactive examples
- User guides and developer documentation
- Architecture decision records and runbooks
- Searchable knowledge base creation
- Auto-generated documentation from code

## Parameters

- `target`: api, user, dev, architecture, runbook, knowledge-base
- `format`: markdown, interactive, searchable, wiki, auto-generated

## Examples

```
/document api interactive
/document user markdown
/document architecture searchable
/document runbook wiki
```

## Use Cases

- **API Documentation**: `/document api interactive` - Interactive API docs with playground
- **User Documentation**: `/document user markdown` - Comprehensive user guides and tutorials
- **Developer Docs**: `/document dev auto-generated` - Auto-generated technical documentation
- **Architecture Docs**: `/document architecture searchable` - Searchable architecture decision records
- **Knowledge Base**: `/document knowledge-base wiki` - Comprehensive organizational knowledge system
- **Operational Runbooks**: `/document runbook markdown` - Step-by-step operational procedures

## Related Prompts

- `prompts/05-documentation/documentation-generator.md` - Comprehensive documentation creation
- `prompts/05-documentation/knowledge-base-creation.md` - Searchable knowledge systems
- `prompts/01-project-initialization/claude-md-generator.md` - CLAUDE.md documentation

## 📓 CLAUDE.md Template Automation (migrated from legacy CLAUDE.md Generator prompt)

- Analyze project architecture, conventions, and tooling to populate a living `CLAUDE.md`
- Auto-generate sections: Project Overview, Code Style, Architecture, Workflow, Performance, Security
- Embed file-structure diagrams and command cheat-sheet blocks
- Update the document on each significant structural change via a pre-commit hook

```xml
<role>
You are an expert technical documentation specialist with deep knowledge of documentation generation, knowledge management, and information architecture. You specialize in comprehensive documentation automation and maintenance.
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
