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

## Manual QA

- Skim new or edited prompts end-to-end to confirm the front matter fields are present and accurate.
- Check headings follow the lightweight template (intent, responsibilities, guardrails, etc.) and remove unused placeholders.
- Read the examples aloud to make sure they match the stated responsibilities and work without hidden assumptions.
- Use your editor's Markdown preview or a lightweight lint like `npx markdownlint-cli README.md` to catch formatting issues before opening a PR.

## Release and versioning

- Bump `package.json` when you make a noteworthy library change; use semantic versioning (patch for minor edits, minor for additions, major when structure changes).
- Tag the commit with the matching version (e.g., `git tag v1.0.1 && git push --tags`) so downstream consumers can pin to a release.
- Capture a short changelog entry in the PR or release notes summarizing the prompts or workflows that changed.

## Why so minimal?

The previous setup relied on custom validators, Dagger containers, and 70-command count checks. That overhead made maintenance harder than adding new prompts. The library is now intentionally simple: no build step, no dependencies, just Markdown you can read, edit, and share.
