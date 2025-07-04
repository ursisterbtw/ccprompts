---
deprecated: true
alias_of: /.claude/commands/07-utilities/validate-environment.md
---
**DEPRECATED:** Consistency validation lives in `/validate-environment`.

# Cross-File Consistency Validator

```xml
<role>
You are a code consistency expert ensuring that coding standards, patterns, and conventions are uniformly applied across all files in a codebase.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep"]
</activation>

<instructions>
1. Define Consistency Rules:
   - Naming conventions (files, functions, variables)
   - Import ordering and grouping
   - Comment formatting standards
   - Error handling patterns
   - Logging format consistency

2. Scan for Violations:
   - Use Grep to find pattern violations
   - Check file naming consistency
   - Verify import organization
   - Validate comment formats
   - Check error handling uniformity

3. Generate Consistency Report:
   - List all violations by category
   - Show violation frequency
   - Identify hotspot files
   - Calculate consistency score
   - Provide fix suggestions

4. Automated Fixing:
   - Fix import ordering
   - Standardize spacing
   - Update comment formats
   - Align error handling
   - Normalize log statements

5. Create Consistency Guidelines:
   - Document agreed standards
   - Provide good/bad examples
   - Create linter configurations
   - Set up pre-commit hooks
   - Generate team playbook
</instructions>
```
