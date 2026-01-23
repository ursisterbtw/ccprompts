# Skills Directory

This directory contains skills that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.

## What Are Skills?

Skills are modular, self-contained packages that transform Claude from a general-purpose agent into a specialized assistant. They provide:

- **Specialized workflows** - Multi-step procedures for specific domains
- **Tool integrations** - Instructions for working with specific file formats or APIs
- **Domain expertise** - Schemas, business logic, and procedural knowledge
- **Bundled resources** - Scripts, references, and assets for complex tasks

## Skill Structure

Each skill is a directory containing:

```text
skill-name/
├── SKILL.md           # Required - main skill file with instructions
├── scripts/           # Optional - executable code (Python/Bash)
├── references/        # Optional - documentation loaded as needed
└── assets/            # Optional - files used in output (templates, icons)
```

## Creating Skills

Use the skill-creator-wizard agent to create new skills:

```text
"Create a skill for [your use case]"
```

The wizard will:
1. Gather requirements and examples
2. Plan skill structure and resources
3. Create the directory and files
4. Generate SKILL.md from SKILL_TEMPLATE.md
5. Validate the result

## Progressive Disclosure

Skills use three-tier context management:

| Tier | Content | When Loaded | Size Limit |
|------|---------|-------------|------------|
| 1 | Metadata (frontmatter) | Always | ~100 words |
| 2 | SKILL.md body | When triggered | <5k words |
| 3 | Bundled resources | As needed | Unlimited |

## Template

See `templates/SKILL_TEMPLATE.md` for the full template structure.
