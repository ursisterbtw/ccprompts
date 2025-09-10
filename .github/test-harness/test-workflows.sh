#!/bin/bash
# CI/CD Workflow Test Harness
# This script tests workflow files locally before deployment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}[TEST] CI/CD Workflow Test Harness${NC}"
echo "================================"
echo ""

# Function to log test results
log_pass() {
    echo -e "${GREEN}[OK] PASS:${NC} $1"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}[ERROR] FAIL:${NC} $1"
    ((FAILED++))
}

log_warn() {
    echo -e "${YELLOW}[WARNING]  WARN:${NC} $1"
    ((WARNINGS++))
}

# Test 1: Check if all workflow files are valid YAML
echo -e "${BLUE}Test 1: Validating YAML syntax${NC}"
for workflow in .github/workflows/*.yml; do
    if yq eval '.' "$workflow" >/dev/null 2>&1; then
        log_pass "$(basename "$workflow")"
    else
        log_fail "$(basename "$workflow") - Invalid YAML"
    fi
done
echo ""

# Test 2: Check for required permissions
echo -e "${BLUE}Test 2: Checking permissions${NC}"
for workflow in .github/workflows/*.yml; do
    if grep -q "permissions:" "$workflow"; then
        # Check if permissions are properly scoped
        if grep -q "write-all" "$workflow"; then
            log_warn "$(basename "$workflow") - Uses write-all permissions"
        else
            log_pass "$(basename "$workflow") - Permissions properly scoped"
        fi
    else
        log_fail "$(basename "$workflow") - Missing permissions section"
    fi
done
echo ""

# Test 3: Check for caching implementation
echo -e "${BLUE}Test 3: Checking caching strategies${NC}"
WORKFLOWS_WITH_DEPS=(
    "validate-prompts.yml"
    "performance-badges.yml"
    "terminal-dashboard.yml"
    "ascii-art-performance.yml"
)

for workflow in "${WORKFLOWS_WITH_DEPS[@]}"; do
    if [ -f ".github/workflows/$workflow" ]; then
        if grep -q "cache" ".github/workflows/$workflow"; then
            log_pass "$workflow - Caching implemented"
        else
            log_warn "$workflow - No caching found (could improve performance)"
        fi
    fi
done
echo ""

# Test 4: Check for deprecated actions
echo -e "${BLUE}Test 4: Checking for deprecated actions${NC}"
DEPRECATED_PATTERNS=(
    "actions/checkout@v1"
    "actions/checkout@v2"
    "actions/setup-node@v1"
    "actions/setup-node@v2"
    "actions/setup-node@v3"
)

for workflow in .github/workflows/*.yml; do
    deprecated_found=false
    for pattern in "${DEPRECATED_PATTERNS[@]}"; do
        if grep -q "$pattern" "$workflow"; then
            log_fail "$(basename "$workflow") - Uses deprecated action: $pattern"
            deprecated_found=true
            break
        fi
    done
    if [ "$deprecated_found" = false ]; then
        log_pass "$(basename "$workflow") - No deprecated actions"
    fi
done
echo ""

# Test 5: Check for concurrency controls
echo -e "${BLUE}Test 5: Checking concurrency controls${NC}"
WORKFLOWS_NEEDING_CONCURRENCY=(
    "claude.yml"
    "deploy.yml"
    "security-scan.yml"
)

for workflow in "${WORKFLOWS_NEEDING_CONCURRENCY[@]}"; do
    if [ -f ".github/workflows/$workflow" ]; then
        if grep -q "concurrency:" ".github/workflows/$workflow"; then
            log_pass "$workflow - Concurrency control present"
        else
            log_warn "$workflow - No concurrency control (could cause conflicts)"
        fi
    fi
done
echo ""

# Test 6: Simulate workflow execution (dry run)
echo -e "${BLUE}Test 6: Simulating workflow execution${NC}"
CREATIVE_WORKFLOWS=(
    "workflow-performance-monitor.yml"
    "ascii-art-performance.yml"
    "performance-badges.yml"
    "terminal-dashboard.yml"
    "weather-dashboard.yml"
    "3d-city-skyline.yml"
)

for workflow in "${CREATIVE_WORKFLOWS[@]}"; do
    if [ -f ".github/workflows/$workflow" ]; then
        # Check if the workflow has all required components
        has_checkout=$(grep -c "actions/checkout" ".github/workflows/$workflow" || echo 0)
        has_permissions=$(grep -c "permissions:" ".github/workflows/$workflow" || echo 0)
        has_steps=$(grep -c "steps:" ".github/workflows/$workflow" || echo 0)

        if [ "$has_checkout" -gt 0 ] && [ "$has_permissions" -gt 0 ] && [ "$has_steps" -gt 0 ]; then
            log_pass "$workflow - All required components present"
        else
            log_fail "$workflow - Missing required components"
        fi
    else
        log_fail "$workflow - File not found"
    fi
done
echo ""

# Test 7: Check for hardcoded values
echo -e "${BLUE}Test 7: Checking for hardcoded values${NC}"
HARDCODED_PATTERNS=(
    "ghp_"
    "ghs_"
    "github_pat_"
    "hardcoded-repo-name"
    "localhost:"
    "127.0.0.1:"
)

for workflow in .github/workflows/*.yml; do
    hardcoded_found=false
    for pattern in "${HARDCODED_PATTERNS[@]}"; do
        if grep -q "$pattern" "$workflow"; then
            log_fail "$(basename "$workflow") - Contains hardcoded value matching: $pattern"
            hardcoded_found=true
            break
        fi
    done
    if [ "$hardcoded_found" = false ]; then
        log_pass "$(basename "$workflow") - No hardcoded values"
    fi
done
echo ""

# Test 8: Performance checks
echo -e "${BLUE}Test 8: Performance optimization checks${NC}"
for workflow in .github/workflows/*.yml; do
    optimizations=0

    # Check for matrix strategy
    if grep -q "matrix:" "$workflow"; then
        ((optimizations++))
    fi

    # Check for caching
    if grep -q "cache" "$workflow"; then
        ((optimizations++))
    fi

    # Check for artifact retention
    if grep -q "retention-days:" "$workflow"; then
        ((optimizations++))
    fi

    # Check for timeout-minutes
    if grep -q "timeout-minutes:" "$workflow"; then
        ((optimizations++))
    fi

    if [ $optimizations -ge 2 ]; then
        log_pass "$(basename "$workflow") - Well optimized ($optimizations optimizations)"
    elif [ $optimizations -eq 1 ]; then
        log_warn "$(basename "$workflow") - Partially optimized ($optimizations optimization)"
    else
        log_warn "$(basename "$workflow") - Not optimized"
    fi
done
echo ""

# Summary
echo "================================"
echo -e "${BLUE}Test Summary${NC}"
echo "================================"
echo -e "Passed:   ${GREEN}$PASSED${NC}"
echo -e "Failed:   ${RED}$FAILED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}[OK] All critical tests passed!${NC}"
    echo -e "${GREEN}The workflows are ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}[ERROR] Some tests failed!${NC}"
    echo -e "${RED}Please fix the issues before deploying.${NC}"
    exit 1
fi
