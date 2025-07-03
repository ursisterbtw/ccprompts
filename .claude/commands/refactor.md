# Refactor Command

This command provides access to comprehensive codebase modernization and performance optimization prompts.

## Usage

```
/refactor [scope] [approach]
```

## Description

Performs safe codebase modernization and performance optimization:

- Legacy code transformation with safety measures
- Performance bottleneck identification and resolution
- Modern language feature adoption
- Architecture pattern implementation
- Code quality improvement

## Parameters

- `scope`: file, module, full-codebase, legacy-component
- `approach`: safe, aggressive, performance-focused, modernization

## Examples

```
/refactor full-codebase modernization
/refactor legacy-component safe
/refactor module performance-focused
```

## Use Cases

- **Legacy Modernization**: `/refactor full-codebase modernization` - Transform entire legacy codebase
- **Performance Focus**: `/refactor module performance-focused` - Optimize specific performance bottlenecks
- **Safe Incremental**: `/refactor file safe` - Careful file-by-file improvements
- **Aggressive Cleanup**: `/refactor legacy-component aggressive` - Comprehensive legacy component overhaul

## Related Prompts

- `prompts/03-refactoring/codebase-modernization.md` - Complete modernization strategy
- `prompts/03-refactoring/performance-optimization.md` - Performance-focused improvements
- `prompts/07-multi-file-operations/codebase-refactoring-engine.md` - Multi-file refactoring automation

```xml
<role>
You are an expert code refactoring specialist with deep knowledge of code modernization, architectural improvements, and safe refactoring techniques. You specialize in comprehensive codebase transformation and modernization.
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
