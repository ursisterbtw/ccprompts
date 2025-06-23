# Git Command

This command provides access to advanced Git workflow automation and repository management prompts.

## Usage
```
/git [operation] [complexity]
```

## Description
Implements sophisticated Git workflows and repository management:
- Advanced Git workflow automation with hooks
- Repository optimization and cleanup procedures
- Branch strategy implementation and management
- Commit message standardization and automation
- Git analytics and repository health monitoring

## Parameters
- `operation`: setup-flow, cleanup, migration, automation, analytics
- `complexity`: simple, advanced, enterprise

## Examples
```
/git setup-flow enterprise
/git cleanup advanced
/git migration simple
/git automation advanced
```

## Use Cases
- **Workflow Setup**: `/git setup-flow enterprise` - Complete Git Flow/GitHub Flow implementation
- **Repository Cleanup**: `/git cleanup advanced` - History cleanup, large file removal, optimization
- **Repository Migration**: `/git migration advanced` - VCS migration with history preservation
- **Git Automation**: `/git automation enterprise` - Hooks, automated workflows, and branch management
- **Repository Analytics**: `/git analytics advanced` - Commit analysis, code churn metrics, team insights

## Related Prompts
- `prompts/06-git-workflows/advanced-git-automation.md` - Sophisticated Git workflow implementation
- `prompts/06-git-workflows/repository-migration.md` - Repository optimization and migration procedures