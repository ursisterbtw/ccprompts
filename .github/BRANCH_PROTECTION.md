# Branch Protection Rules Configuration

This document outlines the recommended branch protection rules for the ccprompts repository before making it public.

## Main Branch Protection (main)

### Required Settings

1. **Require pull request reviews before merging**
   - Required approving reviews: **1**
   - Dismiss stale PR approvals when new commits are pushed: **Yes**
   - Require review from code owners: **Yes** (when CODEOWNERS file is added)
   - Restrict who can dismiss pull request reviews: **Repository administrators**

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging: **Yes**
   - Required status checks:
     - `validate-markdown`
     - `validate-commands`
     - `validate-config`
     - `security-scan`
     - `quality-gates`

3. **Require conversation resolution before merging**: **Yes**

4. **Require signed commits**: **Yes** (recommended for public repos)

5. **Require linear history**: **Yes** (keeps clean git history)

6. **Restrictions**
   - Restrict pushes that create files: **No restrictions**
   - Allow force pushes: **[NO]**
   - Allow deletions: **[NO]**

### Administrative Settings

1. **Include administrators**: **Yes** (admins must follow rules too)
2. **Allow force pushes**: **[NO]**
3. **Allow deletions**: **[NO]**

## Develop Branch Protection (develop)

### Required Settings (Slightly Relaxed)

1. **Require pull request reviews before merging**
   - Required approving reviews: **1**
   - Dismiss stale PR approvals when new commits are pushed: **Yes**
   - Require review from code owners: **No** (more flexible for development)

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging: **Yes**
   - Required status checks:
     - `validate-markdown`
     - `validate-commands`
     - `validate-config`
     - `security-scan`

3. **Require conversation resolution before merging**: **Yes**

4. **Allow force pushes**: **[NO]**
5. **Allow deletions**: **[NO]**

## Feature Branch Naming Convention

Enforce branch naming patterns through GitHub Actions:

- `feature/category-description` (e.g., `feature/commands-analytics`)
- `fix/issue-description` (e.g., `fix/markdown-validation`)
- `docs/section-updates` (e.g., `docs/readme-improvements`)
- `refactor/component-name` (e.g., `refactor/mcp-config`)

## Implementation Steps

### 1. Via GitHub Web Interface

1. Go to **Settings** → **Branches**
2. Click **Add rule** for `main` branch
3. Configure settings as outlined above
4. Repeat for `develop` branch

### 2. Via GitHub CLI (Alternative)

```bash
# Protect main branch
gh api repos/:ursisterbtw/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["validate-markdown","validate-commands","validate-config","security-scan","quality-gates"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_linear_history=true \
  --field required_conversation_resolution=true

# Protect develop branch
gh api repos/:owner/:repo/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["validate-markdown","validate-commands","validate-config","security-scan"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## Additional Recommendations

### 1. CODEOWNERS File

Create `.github/CODEOWNERS` to specify code ownership:

```
# Global ownership
* @ursisterbtw

# Specific areas
.claude/commands/ @ursisterbtw
.github/ @ursisterbtw
```

### 2. Issue Templates

Create issue templates in `.github/ISSUE_TEMPLATE/` for:

- Bug reports
- Feature requests
- Command improvements
- Documentation updates

### 3. Pull Request Template

Create `.github/pull_request_template.md` with:

- Checklist for prompt validation
- Command testing requirements
- Documentation updates
- Breaking change notifications

## Quality Gates Summary

Before any code reaches `main`:

1. [OK] All markdown files are properly formatted
2. [OK] All links are valid and working
3. [OK] All 38 commands have proper structure
4. [OK] JSON configuration files are valid
5. [OK] MCP servers can be initialized
6. [OK] No hardcoded secrets detected
7. [OK] File permissions are appropriate
8. [OK] At least 1 human review approved
9. [OK] All conversations resolved

This ensures the repository maintains high quality standards while being open for public contribution.
