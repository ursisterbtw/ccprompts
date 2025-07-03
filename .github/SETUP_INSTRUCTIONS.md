# Branch Protection Setup Instructions

Follow these steps to implement the branch protection rules before making the repository public.

## 🚀 Quick Setup (Recommended)6

### 1. Push All Files First

```bash
# Add all the new GitHub files
git add .github/
git commit -m "feat: add comprehensive GitHub workflows and branch protection setup"
git push origin main
```

### 2. Set Up Branch Protection via GitHub Web Interface

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Click **Add rule**
4. Configure for `main` branch:

**Branch name pattern:** `main`

**Protect matching branches:**

- ✅ Require a pull request before merging
  - Required number of reviewers: **1**
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - **Required status checks:**
    - `validate-markdown`
    - `validate-commands`
    - `validate-config`
    - `security-scan`
    - `quality-gates`
    - `check-branch-name`
- ✅ Require conversation resolution before merging
- ✅ Require signed commits
- ✅ Require linear history
- ✅ Include administrators
- ❌ Allow force pushes
- ❌ Allow deletions

### 3. Create develop Branch Protection (Optional)

Repeat the process for `develop` branch with slightly relaxed rules:

- Same as main, but don't require code owner reviews
- Only require these status checks: `validate-markdown`, `validate-commands`, `validate-config`, `security-scan`

## 🛠️ Advanced Setup via GitHub CLI

If you prefer command-line setup:

```bash
# Install GitHub CLI if not already installed
# brew install gh  # macOS
# sudo apt install gh  # Ubuntu

# Login to GitHub
gh auth login

# Set up main branch protection
gh api repos/:ursisterbtw/:repo/branches/main/protection \
  --method PUT \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "validate-markdown",
      "validate-commands",
      "validate-config",
      "security-scan",
      "quality-gates",
      "check-branch-name"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": true,
  "required_conversation_resolution": true
}
EOF
```

## 🧪 Testing the Setup

### 1. Create a Test Branch

```bash
# Create a feature branch following naming convention
git checkout -b feature/test-branch-protection
```

### 2. Make a Test Change

```bash
# Make a small change to test the workflow
echo "# Test Change" >> TEST.md
git add TEST.md
git commit -m "test: verify branch protection rules"
git push origin feature/test-branch-protection
```

### 3. Create a Pull Request

```bash
# Create PR via GitHub CLI
gh pr create --title "Test: Branch Protection Rules" --body "Testing branch protection setup"
```

### 4. Verify Checks Run

- Go to the PR page on GitHub
- Verify that all required status checks run:
  - ✅ validate-markdown
  - ✅ validate-commands
  - ✅ validate-config
  - ✅ security-scan
  - ✅ quality-gates
  - ✅ check-branch-name

### 5. Test Protection Rules

Try to:

- [ ] Merge without approval (should be blocked)
- [ ] Force push to main (should be blocked)
- [ ] Push directly to main (should be blocked)

## 📋 Pre-Public Checklist

Before making the repository public, ensure:

### Repository Settings

- [ ] Repository description is set
- [ ] Topics/tags are added for discoverability
- [ ] README.md is comprehensive and up-to-date
- [ ] License is set (if applicable)
- [ ] Repository social preview image is set

### Security

- [ ] All workflows are tested and passing
- [ ] No secrets are hardcoded anywhere
- [ ] .env.example is properly configured
- [ ] .gitignore excludes sensitive files

### Quality Assurance

- [ ] All 38 commands are documented and functional
- [ ] All prompts follow the established XML structure
- [ ] Links in documentation are working
- [ ] MCP configuration is tested

### Community

- [ ] Contributing guidelines are clear
- [ ] Issue templates cover common scenarios
- [ ] Pull request template guides contributors
- [ ] Code of conduct is established (if applicable)

## 🔧 Maintenance

### Regular Tasks

- **Weekly:** Review and update MCP server versions
- **Monthly:** Security scan and dependency updates
- **Quarterly:** Review and update branch protection rules

### Monitoring

- Set up GitHub notifications for:
  - Failed workflow runs
  - Security alerts
  - Dependency vulnerabilities

## 🆘 Troubleshooting

### Common Issues

**"Required status check not found"**

- Wait for the first PR to trigger all workflows
- Status checks only appear after they run at least once

**"Cannot merge - protection rules"**

- Ensure all required status checks are passing
- Verify you have the required approvals
- Check that conversations are resolved

**"Workflow fails on markdown validation"**

- Run `markdownlint` locally first
- Check for broken links with `markdown-link-check`
- Validate JSON syntax in configuration files

### Getting Help

1. Check the workflow logs in the **Actions** tab
2. Review the `.github/BRANCH_PROTECTION.md` file
3. Test locally using the commands in the workflow files
4. Open an issue using the provided templates

---

**Once complete, your repository will have enterprise-grade branch protection suitable for public collaboration while maintaining the highest quality standards for the ccprompts ecosystem.**
