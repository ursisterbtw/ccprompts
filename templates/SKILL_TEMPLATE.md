---
name: {SKILL_NAME}
description: This skill should be used when {PRIMARY_USE_CASE}. It provides {SPECIFIC_CAPABILITIES}. Example contexts: {EXAMPLE_CONTEXT_1} with trigger "{EXAMPLE_USER_REQUEST_1}", {EXAMPLE_CONTEXT_2} with trigger "{EXAMPLE_USER_REQUEST_2}".
license: {SKILL_LICENSE}
---

<!--
NOTE: This is the template file used to create skills.
All skills in the development workflow should follow this structure.
Replace all {PLACEHOLDER} values with skill-specific content.

WRITING STYLE: Use imperative/infinitive form (verb-first instructions).
Write "To accomplish X, do Y" not "You should do X".

PROGRESSIVE DISCLOSURE DESIGN:
1. Metadata (frontmatter) - Always in context (~100 words)
2. SKILL.md body - When skill triggers (<5k words)
3. Bundled resources - As needed (unlimited)

SKILL DIRECTORY STRUCTURE:
skill-name/
├── SKILL.md (required) - This file
├── scripts/            - Executable code (Python/Bash)
├── references/         - Documentation loaded into context as needed
└── assets/             - Files used in output (templates, icons)

VALID LICENSES:
- MIT, Apache-2.0, GPL-3.0, or "Complete terms in LICENSE.txt"
-->

# {SKILL_TITLE}

{SHORT_DESCRIPTION}

## About This Skill

This skill provides {SKILL_PURPOSE}. It transforms Claude from a general-purpose agent into a specialized assistant equipped with procedural knowledge for {DOMAIN_SCOPE}.

### Key Features

- **{FEATURE_1_NAME}**: {FEATURE_1_DESCRIPTION}
- **{FEATURE_2_NAME}**: {FEATURE_2_DESCRIPTION}
- **{FEATURE_3_NAME}**: {FEATURE_3_DESCRIPTION}

## Quick Reference

{QUICK_REFERENCE_CONTENT}

<!--
Include essential commands, patterns, or syntax here.
This section should be scannable and immediately useful.
Example formats: code blocks, tables, bullet lists.
-->

## Workflow

To {PRIMARY_WORKFLOW_GOAL}:

### 1. {WORKFLOW_STEP_1_NAME}

{WORKFLOW_STEP_1_DESCRIPTION}

### 2. {WORKFLOW_STEP_2_NAME}

{WORKFLOW_STEP_2_DESCRIPTION}

### 3. {WORKFLOW_STEP_3_NAME}

{WORKFLOW_STEP_3_DESCRIPTION}

### 4. {WORKFLOW_STEP_4_NAME}

{WORKFLOW_STEP_4_DESCRIPTION}

## Integration

{INTEGRATION_DESCRIPTION}

### Example Usage

**{EXAMPLE_SCENARIO_1}:**
```{CODE_LANGUAGE_1}
{EXAMPLE_CODE_1}
```

**{EXAMPLE_SCENARIO_2}:**
```{CODE_LANGUAGE_2}
{EXAMPLE_CODE_2}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| {TROUBLESHOOTING_ISSUE_1} | {TROUBLESHOOTING_SOLUTION_1} |
| {TROUBLESHOOTING_ISSUE_2} | {TROUBLESHOOTING_SOLUTION_2} |
| {TROUBLESHOOTING_ISSUE_3} | {TROUBLESHOOTING_SOLUTION_3} |

## Bundled Resources

<!--
Remove this section if the skill has no bundled resources.
Only include resources that are actually present.
-->

### Scripts

{SCRIPTS_DESCRIPTION}

| Script | Purpose |
|--------|---------|
| `scripts/{SCRIPT_1_NAME}` | {SCRIPT_1_PURPOSE} |
| `scripts/{SCRIPT_2_NAME}` | {SCRIPT_2_PURPOSE} |

### References

{REFERENCES_DESCRIPTION}

| Reference | Content |
|-----------|---------|
| `references/{REFERENCE_1_NAME}` | {REFERENCE_1_CONTENT} |
| `references/{REFERENCE_2_NAME}` | {REFERENCE_2_CONTENT} |

### Assets

{ASSETS_DESCRIPTION}

| Asset | Usage |
|-------|-------|
| `assets/{ASSET_1_NAME}` | {ASSET_1_USAGE} |
| `assets/{ASSET_2_NAME}` | {ASSET_2_USAGE} |

## Best Practices

- {BEST_PRACTICE_1}
- {BEST_PRACTICE_2}
- {BEST_PRACTICE_3}

## Related Skills

- `{RELATED_SKILL_1}` - {RELATED_SKILL_1_RELATIONSHIP}
- `{RELATED_SKILL_2}` - {RELATED_SKILL_2_RELATIONSHIP}
