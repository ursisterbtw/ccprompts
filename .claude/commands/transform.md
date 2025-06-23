# Transform Command

This command provides access to multi-file operations and cross-codebase consistency prompts.

## Usage
```
/transform [scope] [safety]
```

## Description
Performs safe multi-file transformations and enforces consistency across codebases:
- Large-scale renaming and restructuring operations
- Cross-file consistency validation and enforcement
- Multi-file refactoring with dependency tracking
- Codebase standardization and pattern implementation
- Architecture transformation and migration

## Parameters
- `scope`: rename, restructure, standardize, migrate, validate
- `safety`: preview, safe, aggressive, atomic

## Examples
```
/transform rename safe
/transform restructure preview
/transform standardize atomic
/transform migrate safe
```

## Use Cases
- **Safe Renaming**: `/transform rename safe` - Multi-file renaming with dependency tracking
- **Code Restructuring**: `/transform restructure preview` - Preview architectural changes before applying
- **Standards Enforcement**: `/transform standardize atomic` - Enforce coding standards across entire codebase
- **Architecture Migration**: `/transform migrate safe` - Migrate between architectural patterns safely
- **Consistency Validation**: `/transform validate safe` - Validate and fix consistency issues across files
- **Aggressive Cleanup**: `/transform standardize aggressive` - Comprehensive code standardization

## Related Prompts
- `prompts/07-multi-file-operations/codebase-refactoring-engine.md` - Multi-file refactoring automation engine
- `prompts/07-multi-file-operations/consistency-validator.md` - Cross-file consistency validation and enforcement
- `prompts/03-refactoring/codebase-modernization.md` - Codebase modernization strategies