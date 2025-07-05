#!/bin/bash
set -euo pipefail

# Quick Safety Aliases for Beta-Prompts
# Provides convenient shortcuts for common containerized operations

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAFE_RUN="$SCRIPT_DIR/safe-run.sh"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[QUICK-SAFE]${NC} $*" >&2
}

usage() {
    cat << EOF
Quick Safety Aliases for Beta-Prompts

USAGE:
    $0 ALIAS [ARGS...]

AVAILABLE ALIASES:
    python SCRIPT       - Run Python script safely
    pip COMMAND         - Run pip command safely  
    pytest [ARGS]       - Run pytest safely
    install             - Install from pyproject.toml
    test SCRIPT         - Test script without execution
    improvement         - Run prompt improvement engine
    generation         - Run prompt generation system
    templating         - Run templating framework
    optimization       - Run integrated optimization suite
    all                - Run all four main scripts
    
EXAMPLES:
    $0 python 01_prompt_improvement_engine.py
    $0 pip "install anthropic"
    $0 pytest -v
    $0 install
    $0 test improvement
    $0 improvement
    $0 all

SAFETY:
    All commands run in isolated Dagger containers
    Source code is mounted read-only
    Automatic cleanup after execution
EOF
}

# Validate safe-run.sh exists
if [[ ! -f "$SAFE_RUN" ]]; then
    echo "Error: safe-run.sh not found at $SAFE_RUN"
    exit 1
fi

# Parse alias and execute
if [[ $# -eq 0 ]]; then
    usage
    exit 1
fi

ALIAS="$1"
shift

case "$ALIAS" in
    python)
        if [[ $# -eq 0 ]]; then
            echo "Error: No Python script specified"
            exit 1
        fi
        log "Running Python script: $1"
        "$SAFE_RUN" "python $*"
        ;;
        
    pip)
        if [[ $# -eq 0 ]]; then
            echo "Error: No pip command specified"
            exit 1
        fi
        log "Running pip command: $*"
        "$SAFE_RUN" "pip $*"
        ;;
        
    pytest)
        log "Running pytest: $*"
        "$SAFE_RUN" "pytest $*"
        ;;
        
    install)
        log "Installing from pyproject.toml"
        "$SAFE_RUN" "pip install -e ."
        ;;
        
    test)
        if [[ $# -eq 0 ]]; then
            echo "Error: No script specified for testing"
            exit 1
        fi
        
        case "$1" in
            improvement)
                log "Testing prompt improvement engine"
                "$SAFE_RUN" --test "python -m beta_prompts.improvement_engine"
                ;;
            generation)
                log "Testing prompt generation system"
                "$SAFE_RUN" --test "python -m beta_prompts.generation_system"
                ;;
            templating)
                log "Testing templating framework"
                "$SAFE_RUN" --test "python -m beta_prompts.templating_framework"
                ;;
            optimization)
                log "Testing optimization suite"
                "$SAFE_RUN" --test "python -m beta_prompts.optimization_suite"
                ;;
            *)
                log "Testing script: $1"
                "$SAFE_RUN" --test "python $1"
                ;;
        esac
        ;;
        
    improvement)
    log "Running prompt improvement engine"
    "$SAFE_RUN" "python -m beta_prompts.improvement_engine"
    ;;
    
    generation)
    log "Running prompt generation system"
    "$SAFE_RUN" "python -m beta_prompts.generation_system"
    ;;
    
    templating)
    log "Running templating framework"
    "$SAFE_RUN" "python -m beta_prompts.templating_framework"
    ;;
    
    optimization)
    log "Running integrated optimization suite"
    "$SAFE_RUN" "python -m beta_prompts.optimization_suite"
    ;;
        
    all)
        log "Running all beta-prompts scripts"
        echo -e "${YELLOW}This will run all four main scripts sequentially...${NC}"
        read -p "Continue? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            "$SAFE_RUN" "python -m beta_prompts.improvement_engine"
            "$SAFE_RUN" "python -m beta_prompts.generation_system"  
            "$SAFE_RUN" "python -m beta_prompts.templating_framework"
            "$SAFE_RUN" "python -m beta_prompts.optimization_suite"
        else
            log "Cancelled"
        fi
        ;;
        
    help|--help|-h)
        usage
        ;;
        
    *)
        echo "Error: Unknown alias '$ALIAS'"
        echo "Use '$0 help' to see available aliases"
        exit 1
        ;;
esac