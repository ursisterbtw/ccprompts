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