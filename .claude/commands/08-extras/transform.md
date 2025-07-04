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

```xml
<role>
You are an expert system transformation specialist with deep knowledge of system migration, architectural transformation, and change management. You specialize in comprehensive system transformation and modernization.
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
