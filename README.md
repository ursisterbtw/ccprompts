# ccprompts

A trimmed-down Claude Code prompt library. Everything lives in plain Markdown so you can copy, remix, or drop commands straight into Claude without tooling overhead.

## What's inside
- `commands/` - ready-to-use slash commands grouped by focus area
- `agents/` - small persona playbooks for specialized sessions
- `playbooks/` - longer-form flows when you need a guided sequence

## How to use
1. Browse the folders and open a Markdown file.
2. Copy the fenced command snippet into Claude Code.
3. Skim the intent, steps, and safety notes to adapt it to your project.

## Adding your own
- Drop a new `.md` file into the matching folder.
- Keep titles short, explain the intent, and show one or two realistic invocations.
- When referencing project work, describe expected outputs instead of hard requirements.

## Why so minimal?
The previous setup relied on custom validators, Dagger containers, and 70-command count checks. That overhead made maintenance harder than adding new prompts. The library is now intentionally simple: no build step, no dependencies, just Markdown you can read, edit, and share.