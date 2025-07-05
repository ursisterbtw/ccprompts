# CI/CD Verification Guide

## 🚀 Overview
This guide helps you verify that all CI/CD optimizations and creative visualizations work correctly before shipping the changes to production.

## 📋 Pre-Deployment Verification Steps

### 1. Local Validation (5 minutes)

```bash
# Install required tools
pip install yamllint actionlint-py
npm install -g @github/actionlint

# Run the test harness
chmod +x .github/test-harness/test-workflows.sh
./.github/test-harness/test-workflows.sh

# Run YAML validation
yamllint -c .yamllint.yml .github/workflows/*.yml

# Run GitHub Actions linting
actionlint
```

### 2. Pre-commit Hooks Setup (2 minutes)

```bash
# Install pre-commit
pip install pre-commit

# Install the git hooks
pre-commit install

# Run against all files
pre-commit run --all-files
```

### 3. Create Test Branch (10 minutes)

```bash
# Create a test branch
git checkout -b test/cicd-verification

# Push to trigger workflows
git push origin test/cicd-verification

# Create a draft PR to see all checks
gh pr create --draft --title "Test: CI/CD Optimizations" \
  --body "Testing all workflow optimizations before production deployment"
```

### 4. Verification Workflow (15 minutes)

```bash
# Run the comprehensive verification workflow
gh workflow run verify-ci-changes.yml -f dry_run=true

# Check the results
gh run list --workflow=verify-ci-changes.yml --limit=1
gh run view  # Select the latest run
```

### 5. Monitor Test Executions

#### Check Core Workflows
- [ ] `claude.yml` - Runs without errors
- [ ] `claude-code-review.yml` - Triggers on PR
- [ ] `deploy.yml` - Executes with proper permissions
- [ ] `security-scan.yml` - Runs parallel scans
- [ ] `validate-prompts.yml` - Uses matrix strategy
- [ ] `semgrep.yml` - Caching works properly

#### Check Creative Visualizations
- [ ] `workflow-performance-monitor.yml` - Generates flamegraph
- [ ] `ascii-art-performance.yml` - Posts to PR
- [ ] `performance-badges.yml` - Creates SVG files
- [ ] `terminal-dashboard.yml` - Generates dashboard
- [ ] `weather-dashboard.yml` - Creates weather UI
- [ ] `3d-city-skyline.yml` - Builds 3D visualization

## 🔍 What to Look For

### ✅ Success Indicators
1. **All workflows show green checkmarks**
2. **Execution times are reduced** (check vs baseline)
3. **Cache hit rates > 50%** (visible in logs)
4. **No permission errors**
5. **Artifacts are generated** (for visualization workflows)

### ❌ Warning Signs
1. **Red X on any workflow**
2. **"Resource not accessible" errors**
3. **Timeouts or hanging jobs**
4. **Cache restoration failures**
5. **Missing artifacts**

## 📊 Performance Validation

### Check Optimization Metrics

```bash
# Compare execution times (before vs after)
gh run list --workflow=<workflow-name> --limit=10 --json databaseId,conclusion,createdAt,displayTitle,status,workflowName,updatedAt,runStartedAt | jq '.[] | {name: .workflowName, duration: (.updatedAt - .runStartedAt), status: .conclusion}'

# Check cache performance
# Look for "Cache hit" in workflow logs
gh run view <run-id> --log | grep -i "cache"

# Verify parallelization
# Check if matrix jobs run simultaneously
gh run view <run-id> --json jobs | jq '.jobs[] | {name: .name, started: .startedAt, completed: .completedAt}'
```

### Expected Improvements
- **Build times**: 20-30% faster with caching
- **Security scans**: 40-50% faster with parallelization  
- **Overall pipeline**: 30-40% improvement

## 🧪 Testing Creative Visualizations

### 1. Flamegraph Visualization
```bash
# Trigger manually
gh workflow run workflow-performance-monitor.yml

# Check artifacts
gh run download --name flamegraph-<date>
```

### 2. ASCII Art Reports
- Create a test PR
- Wait for ASCII report comment
- Verify formatting and data accuracy

### 3. Performance Badges
```bash
# Check if badges directory is created
git pull
ls -la badges/

# Verify SVG files are valid
file badges/*.svg
```

### 4. Terminal Dashboard
```bash
# Download and run locally
gh run download --name terminal-dashboard-<run-id>
chmod +x terminal_dashboard.sh
./terminal_dashboard.sh  # Ctrl+C to exit
```

### 5. Weather Dashboard
```bash
# Check HTML generation
gh run download --name weather-dashboard-<run-id>
open weather-dashboard.html  # or xdg-open on Linux
```

### 6. 3D City Skyline
```bash
# Verify Three.js visualization
gh run download --name 3d-city-skyline-<run-id>
open 3d-skyline.html  # Should show interactive 3D city
```

## 🚨 If Something Goes Wrong

### Quick Diagnostics
```bash
# Check recent workflow runs
gh run list --limit=20

# View specific failure logs
gh run view <run-id> --log-failed

# Check GitHub Actions status
# Visit: https://www.githubstatus.com/
```

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Permission denied | Add missing permissions to workflow |
| Cache not found | Normal on first run, will build cache |
| Artifact upload failed | Check size limits (500MB per artifact) |
| Timeout | Increase timeout-minutes in workflow |
| Node/Python version error | Update setup actions to latest versions |

## ✅ Final Checklist

Before merging to production:

- [ ] All workflows pass in test branch
- [ ] Performance improvements confirmed
- [ ] No security warnings
- [ ] Creative visualizations generate correctly
- [ ] Team reviewed changes
- [ ] Rollback plan documented and understood
- [ ] Monitoring plan in place

## 📈 Post-Deployment Monitoring

After merging:

1. **First 30 minutes**: Watch Actions tab closely
2. **First 24 hours**: Monitor for any failures
3. **First week**: Track performance metrics
4. **Ongoing**: Review weekly performance reports

## 🆘 Support

If you encounter issues:

1. Check `docs/CI-CD-ROLLBACK-PLAN.md`
2. Review workflow logs for specific errors
3. Use test harness for local debugging
4. Rollback if critical issues persist

---

Remember: Take time to verify thoroughly. A well-tested deployment is worth the extra time!