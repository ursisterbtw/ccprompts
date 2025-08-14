# CI/CD Optimization Rollback Plan

## Overview

This document provides a rollback strategy for the CI/CD optimizations implemented in this repository. Use this guide if any issues arise after deploying the workflow changes.

## Quick Rollback (Emergency)

If critical issues occur, immediately rollback:

```bash
# 1. Revert the merge commit
git revert -m 1 <merge-commit-sha>

# 2. Create and push the revert
git push origin HEAD:hotfix/revert-cicd-changes

# 3. Create PR and merge immediately
gh pr create --title "Revert: CI/CD optimizations" --body "Emergency rollback of CI/CD changes" --base main
```

## Identified Changes

### Modified Workflows

1. `.github/workflows/claude-code-review.yml` - Added permissions, caching, Node.js setup
2. `.github/workflows/claude.yml` - Added concurrency, permissions, caching
3. `.github/workflows/deploy.yml` - Added permissions, concurrency, cache outputs
4. `.github/workflows/security-scan.yml` - Added matrix strategy, parallelization
5. `.github/workflows/semgrep.yml` - Added permissions, caching, concurrency
6. `.github/workflows/validate-prompts.yml` - Added matrix strategy, parallelization
7. `.github/workflows/reusable/setup-node.yml` - Enhanced caching, added outputs
8. `.github/workflows/reusable/security-scan.yml` - Added SARIF support, thresholds

### New Workflows (Creative Visualizations)

1. `.github/workflows/workflow-performance-monitor.yml` - Flamegraph generation
2. `.github/workflows/ascii-art-performance.yml` - ASCII performance reports
3. `.github/workflows/performance-badges.yml` - Dynamic SVG badges
4. `.github/workflows/terminal-dashboard.yml` - Terminal UI dashboard
5. `.github/workflows/weather-dashboard.yml` - Weather metaphor dashboard
6. `.github/workflows/3d-city-skyline.yml` - 3D performance visualization

### New Configuration Files

1. `.yamllint.yml` - YAML linting configuration
2. `.pre-commit-config.yaml` - Pre-commit hooks for validation
3. `.github/test-harness/test-workflows.sh` - Local testing script

## Rollback Procedures by Issue Type

### Issue: Workflow Syntax Errors

**Symptoms**: Workflows fail to start, "Invalid workflow file" errors

**Fix**:

```bash
# Validate syntax locally
yamllint .github/workflows/*.yml
actionlint

# Fix syntax errors and push
git add .github/workflows/
git commit -m "fix: correct workflow syntax errors"
git push
```

### Issue: Permission Errors

**Symptoms**: "Resource not accessible by integration" errors

**Fix**:

1. Check if the workflow has appropriate permissions
2. Ensure repository settings allow GitHub Actions
3. If needed, temporarily add broader permissions:

```yaml
permissions:
  contents: write
  actions: read
  pull-requests: write
```

### Issue: Cache Problems

**Symptoms**: Cache restore failures, out of space errors

**Fix**:

```bash
# Clear all caches via GitHub UI or API
gh api -X DELETE /repos/$OWNER/$REPO/actions/caches

# Or selectively remove problem caches
gh api /repos/$OWNER/$REPO/actions/caches --jq '.actions_caches[] | select(.key | contains("problem-cache"))'
```

### Issue: Parallel Job Conflicts

**Symptoms**: Resource conflicts, race conditions

**Fix**:

1. Reduce parallelization in matrix strategies
2. Add stricter concurrency controls:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false  # Don't cancel, queue instead
```

### Issue: Performance Degradation

**Symptoms**: Workflows running slower than before

**Fix**:

1. Disable new visualizations temporarily
2. Review cache hit rates
3. Reduce matrix job counts
4. Check for resource exhaustion

## Partial Rollback Strategy

If only specific workflows are problematic:

```bash
# Revert specific file
git checkout origin/main -- .github/workflows/problem-workflow.yml
git commit -m "revert: rollback problem-workflow.yml"
git push
```

## Monitoring During Rollback

1. **Check Active Runs**:

   ```bash
   gh run list --workflow=<workflow-name>
   ```

2. **Monitor Performance**:
   - Watch the Actions tab for execution times
   - Check cache hit rates
   - Monitor resource usage

3. **Verify Fixes**:
   - Run test workflow: `gh workflow run verify-ci-changes.yml`
   - Check dependent workflows still function

## Post-Rollback Actions

1. **Document Issues**:

   ```markdown
   ## Rollback Report - [Date]
   
   ### Issue
   - Description of what went wrong
   - Affected workflows
   - Error messages
   
   ### Resolution
   - Steps taken to resolve
   - Files reverted
   - Temporary fixes applied
   
   ### Lessons Learned
   - Root cause
   - Prevention measures
   ```

2. **Create Fix Branch**:

   ```bash
   git checkout -b fix/cicd-issues
   # Apply fixes
   git push origin fix/cicd-issues
   ```

3. **Test Thoroughly**:

   ```bash
   # Run local tests
   ./.github/test-harness/test-workflows.sh
   
   # Run verification workflow
   gh workflow run verify-ci-changes.yml -f dry_run=true
   ```

## Gradual Re-deployment

After fixing issues:

1. **Phase 1**: Deploy infrastructure workflows
   - `setup-node.yml`
   - `security-scan.yml`

2. **Phase 2**: Deploy core workflows
   - `claude.yml`
   - `validate-prompts.yml`
   - `deploy.yml`

3. **Phase 3**: Deploy optimizations
   - Matrix strategies
   - Advanced caching
   - Concurrency controls

4. **Phase 4**: Deploy creative visualizations
   - Start with simple ones (badges)
   - Progress to complex (3D visualization)

## Emergency Contacts

If you need assistance:

1. Check GitHub Actions documentation
2. Review the original optimization report at `reports/ci-cd-expert.json`
3. Consult the verification workflow logs
4. Use the test harness for local validation

## Prevention Checklist

Before future CI/CD changes:

- [ ] Run pre-commit hooks locally
- [ ] Test with `verify-ci-changes.yml` workflow
- [ ] Review changes in a separate branch
- [ ] Test one workflow at a time
- [ ] Monitor initial runs closely
- [ ] Have rollback plan ready
- [ ] Document all changes

---

Remember: It's always better to rollback quickly and fix properly than to debug in production.
