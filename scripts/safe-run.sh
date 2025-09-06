#!/bin/bash

# Safe command execution wrapper using Dagger containers
# Usage: ./scripts/safe-run.sh <command> [project-path] [environment-vars]

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DAGGER_MODULE_PATH="$PROJECT_ROOT/src"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }

# Help function
show_help() {
    cat <<EOF
Safe Command Runner - Execute potentially dangerous commands in isolated containers

Usage: $0 <command> [options]

Arguments:
    <command>           The command to execute safely in container

Options:
    -p, --project-path  Path to project directory (default: current directory)
    -e, --env           Environment variables in KEY=VALUE format
    -t, --test          Test mode - shows what would be executed
    -v, --verbose       Verbose output
    -h, --help          Show this help message

Examples:
    $0 "npm install"
    $0 "rm -rf /tmp/test" --project-path "/my/project"
    $0 "curl https://example.com/script.sh | bash" --test
    $0 "make install" --env "NODE_ENV=production"

Dangerous commands that benefit from containerization:
    - System modifications (rm, chmod, chown)
    - Network requests (curl, wget)
    - Package installations (npm install, pip install)
    - Build processes (make, cargo build)
    - Database operations
    - File system operations

EOF
}

# Parse arguments
COMMAND=""
PROJECT_PATH="."
ENV_VARS=""
TEST_MODE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
    -p | --project-path)
        PROJECT_PATH="$2"
        shift 2
        ;;
    -e | --env)
        ENV_VARS="$2"
        shift 2
        ;;
    -t | --test)
        TEST_MODE=true
        shift
        ;;
    -v | --verbose)
        VERBOSE=true
        shift
        ;;
    -h | --help)
        show_help
        exit 0
        ;;
    *)
        if [ -z "$COMMAND" ]; then
            COMMAND="$1"
        else
            log_error "Unexpected argument: $1"
            show_help
            exit 1
        fi
        shift
        ;;
    esac
done

# Validate required arguments
if [ -z "$COMMAND" ]; then
    log_error "Command is required"
    show_help
    exit 1
fi

# Validate project path
if [ ! -d "$PROJECT_PATH" ]; then
    log_error "Project path does not exist: $PROJECT_PATH"
    exit 1
fi

# Check if Dagger is available
if ! command -v dagger &>/dev/null; then
    log_error "Dagger is not installed. Please install it from https://dagger.io"
    exit 1
fi

# Safety checks for dangerous commands
check_command_safety() {
    local cmd="$1"

    # Commands that should definitely be containerized
    local dangerous_patterns=(
        "rm -rf"
        "chmod -R"
        "chown -R"
        "curl.*|.*bash"
        "wget.*|.*bash"
        "sudo"
        "su "
        "dd if="
        "mkfs"
        "fdisk"
        "parted"
        "systemctl"
        "service "
        ">/etc/"
        ">/usr/"
        ">/var/"
        ">/bin/"
        ">/sbin/"
    )

    for pattern in "${dangerous_patterns[@]}"; do
        if [[ $cmd =~ $pattern ]]; then
            log_warn "Detected potentially dangerous command pattern: $pattern"
            return 0
        fi
    done

    return 1
}

# Main execution
main() {
    log_info "Safe Command Runner initialized"

    if [ "$VERBOSE" = true ]; then
        log_info "Command: $COMMAND"
        log_info "Project Path: $PROJECT_PATH"
        log_info "Environment: $ENV_VARS"
        log_info "Test Mode: $TEST_MODE"
    fi

    # Safety check
    if check_command_safety "$COMMAND"; then
        log_warn "Command contains potentially dangerous patterns"
        log_info "Running in isolated container for safety"
    fi

    # Test mode - show what would be executed
    if [ "$TEST_MODE" = true ]; then
        log_info "TEST MODE - Would execute:"
        echo "  Command: $COMMAND"
        echo "  Project Path: $PROJECT_PATH"
        echo "  Environment: $ENV_VARS"
        echo "  Container: Ubuntu 22.04 with basic tools"
        exit 0
    fi

    # Change to Dagger module directory
    cd "$DAGGER_MODULE_PATH"

    # Prepare environment variables for Dagger
    local env_args=""
    if [ -n "$ENV_VARS" ]; then
        env_args="--env '$ENV_VARS'"
    fi

    # Execute command using Dagger
    log_info "Executing command in container..."

    if [ "$VERBOSE" = true ]; then
        set -x
    fi

    # Run the command through Dagger
    if dagger call run-safe-command --command "$COMMAND" --project-path "$PROJECT_PATH" --environment "$ENV_VARS" 2>&1; then
        log_success "Command executed successfully in container"
    else
        log_error "Command failed in container"
        exit 1
    fi
}

# Trap for cleanup
cleanup() {
    log_info "Cleaning up..."
    # Dagger handles container cleanup automatically
}

trap cleanup EXIT

# Run main function
main "$@"
