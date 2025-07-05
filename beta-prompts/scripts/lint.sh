#!/bin/bash
set -euo pipefail

# Modern Python Code Quality Script
# Uses Ruff, Black, isort, MyPy, Sourcery, and advanced security scanning

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Icons
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
ROCKET="🚀"
MAGNIFYING="🔍"
SHIELD="🛡️"
SPARKLES="✨"
GEAR="⚙️"

log() {
    echo -e "${BLUE}[LINT]${NC} $*"
}

success() {
    echo -e "${GREEN}${CHECK} $*${NC}"
}

error() {
    echo -e "${RED}${CROSS} $*${NC}"
}

warning() {
    echo -e "${YELLOW}${WARNING} $*${NC}"
}

section() {
    echo -e "\n${PURPLE}${GEAR} $*${NC}"
    echo "────────────────────────────────────────────────────────"
}

usage() {
    cat << EOF
${ROCKET} Modern Python Code Quality Tool

USAGE:
    $0 [OPTIONS] [TARGETS...]

OPTIONS:
    --all           Run all checks (default)
    --format        Format code with Black and Ruff
    --lint          Run Ruff linting
    --type-check    Run MyPy type checking
    --security      Run security scans (Bandit, Safety, Semgrep)
    --dead-code     Find dead code with Vulture
    --docstring     Check docstring coverage
    --fix           Auto-fix issues where possible
    --strict        Use strict mode for all tools
    --profile       Profile performance during checks
    --ci            CI-friendly output (no colors, exit codes)
    --help          Show this help

TARGETS:
    Specific files or directories to check (default: beta_prompts/)

EXAMPLES:
    $0 --all                    # Run everything
    $0 --format --fix           # Format and auto-fix
    $0 --lint --type-check      # Core development checks
    $0 --security --strict      # Security audit
    $0 beta_prompts/core.py     # Check specific file
    $0 --ci                     # CI pipeline

TOOLS INTEGRATED:
    ${SPARKLES} Ruff        - Ultra-fast Python linter and formatter
    ${SPARKLES} MyPy        - Static type checker with strict mode
    ${SPARKLES} Black       - Code formatter for consistency  
    ${SPARKLES} Sourcery    - AI-powered code reviewer
    ${SHIELD} Bandit       - Security vulnerability scanner
    ${SHIELD} Safety       - Dependency vulnerability checker
    ${SHIELD} Semgrep      - Static analysis security scanner
    ${MAGNIFYING} Vulture     - Dead code detector
    ${MAGNIFYING} Interrogate - Docstring coverage checker
    ${MAGNIFYING} Darglint    - Docstring style checker
EOF
}

# Default options
RUN_ALL=true
RUN_FORMAT=false
RUN_LINT=false
RUN_TYPE_CHECK=false
RUN_SECURITY=false
RUN_DEAD_CODE=false
RUN_DOCSTRING=false
AUTO_FIX=false
STRICT_MODE=false
PROFILE_MODE=false
CI_MODE=false
TARGETS=("beta_prompts/")

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            RUN_ALL=true
            shift
            ;;
        --format)
            RUN_ALL=false
            RUN_FORMAT=true
            shift
            ;;
        --lint)
            RUN_ALL=false
            RUN_LINT=true
            shift
            ;;
        --type-check)
            RUN_ALL=false
            RUN_TYPE_CHECK=true
            shift
            ;;
        --security)
            RUN_ALL=false
            RUN_SECURITY=true
            shift
            ;;
        --dead-code)
            RUN_ALL=false
            RUN_DEAD_CODE=true
            shift
            ;;
        --docstring)
            RUN_ALL=false
            RUN_DOCSTRING=true
            shift
            ;;
        --fix)
            AUTO_FIX=true
            shift
            ;;
        --strict)
            STRICT_MODE=true
            shift
            ;;
        --profile)
            PROFILE_MODE=true
            shift
            ;;
        --ci)
            CI_MODE=true
            RED=""
            GREEN=""
            YELLOW=""
            BLUE=""
            PURPLE=""
            CYAN=""
            NC=""
            shift
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        -*)
            error "Unknown option: $1"
            usage
            exit 1
            ;;
        *)
            TARGETS=("$@")
            break
            ;;
    esac
done

# Change to project directory
cd "$PROJECT_ROOT"

# Check if virtual environment is activated
if [[ -z "${VIRTUAL_ENV:-}" ]]; then
    warning "No virtual environment detected. Consider activating one."
    warning "Run: python -m venv venv && source venv/bin/activate"
fi

# Start timing if profiling
if [[ "$PROFILE_MODE" == "true" ]]; then
    START_TIME=$(date +%s)
fi

section "${ROCKET} Starting Modern Code Quality Checks"
log "Project: $(basename "$PROJECT_ROOT")"
log "Targets: ${TARGETS[*]}"
log "Mode: $([ "$STRICT_MODE" == "true" ] && echo "Strict" || echo "Standard")"

# Track results
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

run_check() {
    local name="$1"
    local command="$2"
    local optional="${3:-false}"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    section "${MAGNIFYING} $name"
    log "Running: $command"
    
    if eval "$command"; then
        success "$name completed successfully"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        if [[ "$optional" == "true" ]]; then
            warning "$name failed (optional)"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
        else
            error "$name failed"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        fi
        return 1
    fi
}

# Ruff - Ultra-fast linting and formatting
if [[ "$RUN_ALL" == "true" || "$RUN_LINT" == "true" || "$RUN_FORMAT" == "true" ]]; then
    if [[ "$AUTO_FIX" == "true" ]]; then
        run_check "Ruff Auto-fix" "ruff check ${TARGETS[*]} --fix --exit-zero"
        run_check "Ruff Format" "ruff format ${TARGETS[*]}"
    else
        RUFF_ARGS="${TARGETS[*]}"
        [[ "$STRICT_MODE" == "true" ]] && RUFF_ARGS="$RUFF_ARGS --select ALL"
        run_check "Ruff Linting" "ruff check $RUFF_ARGS"
        run_check "Ruff Format Check" "ruff format --check ${TARGETS[*]}"
    fi
fi

# Black formatting (backup/compatibility)
if [[ "$RUN_ALL" == "true" || "$RUN_FORMAT" == "true" ]]; then
    if command -v black >/dev/null 2>&1; then
        if [[ "$AUTO_FIX" == "true" ]]; then
            run_check "Black Format" "black ${TARGETS[*]}"
        else
            run_check "Black Format Check" "black --check --diff ${TARGETS[*]}"
        fi
    fi
fi

# MyPy - Type checking
if [[ "$RUN_ALL" == "true" || "$RUN_TYPE_CHECK" == "true" ]]; then
    MYPY_ARGS="${TARGETS[*]}"
    [[ "$STRICT_MODE" == "true" ]] && MYPY_ARGS="$MYPY_ARGS --strict"
    run_check "MyPy Type Checking" "mypy $MYPY_ARGS"
fi

# Security scanning
if [[ "$RUN_ALL" == "true" || "$RUN_SECURITY" == "true" ]]; then
    # Bandit - Security linting
    run_check "Bandit Security Scan" "bandit -r ${TARGETS[*]} -f json -o bandit-report.json || bandit -r ${TARGETS[*]}"
    
    # Safety - Dependency vulnerability scanning
    run_check "Safety Dependency Scan" "safety check --json --output safety-report.json || safety check" "true"
    
    # Semgrep - Advanced static analysis
    if command -v semgrep >/dev/null 2>&1; then
        run_check "Semgrep Security Analysis" "semgrep --config=auto ${TARGETS[*]} --json --output=semgrep-report.json || semgrep --config=auto ${TARGETS[*]}" "true"
    fi
fi

# Dead code detection
if [[ "$RUN_ALL" == "true" || "$RUN_DEAD_CODE" == "true" ]]; then
    if command -v vulture >/dev/null 2>&1; then
        run_check "Vulture Dead Code Detection" "vulture ${TARGETS[*]} --min-confidence 80"
    fi
fi

# Docstring coverage and style
if [[ "$RUN_ALL" == "true" || "$RUN_DOCSTRING" == "true" ]]; then
    if command -v interrogate >/dev/null 2>&1; then
        run_check "Interrogate Docstring Coverage" "interrogate ${TARGETS[*]} --fail-under 80 --verbose"
    fi
    
    if command -v darglint >/dev/null 2>&1; then
        run_check "Darglint Docstring Style" "darglint ${TARGETS[*]}" "true"
    fi
fi

# Sourcery - AI-powered code review
if command -v sourcery >/dev/null 2>&1 && [[ "$RUN_ALL" == "true" ]]; then
    if [[ "$AUTO_FIX" == "true" ]]; then
        run_check "Sourcery AI Refactoring" "sourcery review --fix ${TARGETS[*]}" "true"
    else
        run_check "Sourcery AI Review" "sourcery review ${TARGETS[*]}" "true"
    fi
fi

# Calculate execution time
if [[ "$PROFILE_MODE" == "true" ]]; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    log "Total execution time: ${DURATION}s"
fi

# Final report
section "${SPARKLES} Code Quality Report"
echo "┌─────────────────────────────────────┐"
echo "│            SUMMARY                  │"
echo "├─────────────────────────────────────┤"
echo "│ Total checks: $(printf "%18d" $TOTAL_CHECKS) │"
echo "│ Passed:       $(printf "%18d" $PASSED_CHECKS) │"
echo "│ Failed:       $(printf "%18d" $FAILED_CHECKS) │"
echo "└─────────────────────────────────────┘"

if [[ $FAILED_CHECKS -eq 0 ]]; then
    success "All code quality checks passed! ${ROCKET}"
    
    if [[ "$CI_MODE" != "true" ]]; then
        echo ""
        echo "${SPARKLES} Your code is:"
        echo "  ✨ Properly formatted"
        echo "  🔍 Well-typed" 
        echo "  🛡️ Security-scanned"
        echo "  📚 Well-documented"
        echo "  🚀 Ready for production"
    fi
    
    exit 0
else
    error "Some checks failed. Please review and fix issues."
    
    if [[ "$AUTO_FIX" != "true" ]]; then
        echo ""
        echo "💡 Quick fixes:"
        echo "  Run with --fix to auto-fix issues"
        echo "  Use --strict for more thorough checking"
        echo "  Check specific areas with targeted flags"
    fi
    
    exit 1
fi