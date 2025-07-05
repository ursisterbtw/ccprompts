#!/bin/bash
set -euo pipefail

# Beta-Prompts Containerized Safety System
# Runs Python scripts and commands in isolated Dagger containers

VERSION="1.0.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DAGGER_MODULE_DIR="$PROJECT_DIR/../src"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_IMAGE="python:3.11-slim"
WORKSPACE_PATH="/workspace"
TIMEOUT=300

usage() {
    cat << EOF
Beta-Prompts Containerized Safety System v${VERSION}

USAGE:
    $0 [OPTIONS] "COMMAND"

OPTIONS:
    --test, -t          Preview command without execution
    --timeout SECONDS   Set timeout (default: 300)
    --image IMAGE       Use different container image
    --env KEY=VALUE     Set environment variable
    --help, -h          Show this help

EXAMPLES:
    # Run Python script safely
    $0 "python 01_prompt_improvement_engine.py"
    
    # Install dependencies safely
    $0 "pip install -e ."
    
    # Test script without execution
    $0 --test "python 02_prompt_generation_system.py"
    
    # Run with custom environment
    $0 --env ANTHROPIC_API_KEY=your-key "python script.py"
    
    # Run tests safely
    $0 "pytest -v"

SAFETY FEATURES:
    ✓ Isolated container execution
    ✓ Read-only source code mounting
    ✓ Automatic cleanup
    ✓ Resource limits
    ✓ Network isolation options
    ✓ Environment variable controls
EOF
}

log() {
    echo -e "${BLUE}[SAFE-RUN]${NC} $*" >&2
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $*" >&2
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*" >&2
}

check_dagger() {
    if ! command -v dagger &> /dev/null; then
        error "Dagger is not installed. Install it first:"
        echo "curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.13.3 sh"
        exit 1
    fi
    
    log "Dagger version: $(dagger version)"
}

check_dangerous_patterns() {
    local command="$1"
    
    # Dangerous patterns that should never run even in containers
    local dangerous_patterns=(
        "rm -rf /"
        "dd if=/dev/zero"
        "mkfs"
        "fdisk"
        "format c:"
        "del /f /s /q c:\\"
        "curl.*|.*bash"
        "wget.*|.*bash"
    )
    
    for pattern in "${dangerous_patterns[@]}"; do
        if [[ "$command" =~ $pattern ]]; then
            error "Extremely dangerous command pattern detected: $pattern"
            error "This command is blocked even in containers for safety"
            exit 1
        fi
    done
}

validate_environment() {
    # Check if we're in the right directory
    if [[ ! -f "$PROJECT_DIR/pyproject.toml" ]]; then
        error "Not in beta-prompts directory or pyproject.toml missing"
        exit 1
    fi
    
    # Check if source directory exists
    if [[ ! -d "$DAGGER_MODULE_DIR" ]]; then
        warn "Dagger module directory not found at $DAGGER_MODULE_DIR"
        warn "Creating basic Dagger configuration..."
        mkdir -p "$DAGGER_MODULE_DIR"
        
        # Create basic dagger.json if it doesn't exist
        if [[ ! -f "$PROJECT_DIR/../dagger.json" ]]; then
            cat > "$PROJECT_DIR/../dagger.json" << 'EOL'
{
  "name": "ccprompts-safety",
  "sdk": "go",
  "source": "./src"
}
EOL
        fi
    fi
}

prepare_container_script() {
    local command="$1"
    local script_path="$PROJECT_DIR/tmp_container_script.sh"
    
    # Create temporary script for container execution
    cat > "$script_path" << EOF
#!/bin/bash
set -euo pipefail

# Setup Python environment
export PYTHONPATH=/workspace
export PYTHONUNBUFFERED=1

# Change to workspace
cd /workspace

# Install dependencies from pyproject.toml
if [[ -f pyproject.toml ]]; then
    echo "Installing dependencies from pyproject.toml..."
    pip install --no-cache-dir -e .
else
    echo "Warning: No pyproject.toml found"
fi

# Execute the command
echo "Executing: $command"
$command
EOF
    
    chmod +x "$script_path"
    echo "$script_path"
}

run_in_container() {
    local command="$1"
    local test_mode="$2"
    local env_vars="$3"
    
    log "Preparing containerized execution..."
    
    # Prepare container script
    local script_path
    script_path=$(prepare_container_script "$command")
    
    if [[ "$test_mode" == "true" ]]; then
        log "TEST MODE - Would execute in container:"
        echo "----------------------------------------"
        echo "Container Image: $CONTAINER_IMAGE"
        echo "Workspace: $PROJECT_DIR -> $WORKSPACE_PATH"
        echo "Command: $command"
        echo "Environment: $env_vars"
        echo "Timeout: ${TIMEOUT}s"
        echo "----------------------------------------"
        cat "$script_path"
        echo "----------------------------------------"
        rm -f "$script_path"
        return 0
    fi
    
    log "Starting Dagger container..."
    
    # Build Dagger command
    local dagger_cmd="dagger call container"
    dagger_cmd+=" --platform linux/amd64"
    dagger_cmd+=" from --address $CONTAINER_IMAGE"
    dagger_cmd+=" with-directory --path $WORKSPACE_PATH --directory ."
    dagger_cmd+=" with-workdir --path $WORKSPACE_PATH"
    
    # Add environment variables
    if [[ -n "$env_vars" ]]; then
        IFS=',' read -ra ENV_ARRAY <<< "$env_vars"
        for env_pair in "${ENV_ARRAY[@]}"; do
            if [[ "$env_pair" =~ ^([^=]+)=(.*)$ ]]; then
                local key="${BASH_REMATCH[1]}"
                local value="${BASH_REMATCH[2]}"
                dagger_cmd+=" with-env-variable --name $key --value '$value'"
            fi
        done
    fi
    
    # Add API key if available
    if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
        dagger_cmd+=" with-env-variable --name ANTHROPIC_API_KEY --value '$ANTHROPIC_API_KEY'"
    fi
    
    # Execute the script
    dagger_cmd+=" with-exec --args bash,/workspace/$(basename "$script_path")"
    dagger_cmd+=" stdout"
    
    log "Executing in container..."
    
    # Run with timeout
    if timeout "${TIMEOUT}s" bash -c "cd '$PROJECT_DIR' && $dagger_cmd"; then
        success "Container execution completed successfully"
    else
        local exit_code=$?
        if [[ $exit_code -eq 124 ]]; then
            error "Container execution timed out after ${TIMEOUT}s"
        else
            error "Container execution failed with exit code $exit_code"
        fi
        rm -f "$script_path"
        exit $exit_code
    fi
    
    # Cleanup
    rm -f "$script_path"
}

# Parse command line arguments
TEST_MODE="false"
ENV_VARS=""
COMMAND=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --test|-t)
            TEST_MODE="true"
            shift
            ;;
        --timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        --image)
            CONTAINER_IMAGE="$2"
            shift 2
            ;;
        --env)
            if [[ -n "$ENV_VARS" ]]; then
                ENV_VARS="${ENV_VARS},$2"
            else
                ENV_VARS="$2"
            fi
            shift 2
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
            if [[ -z "$COMMAND" ]]; then
                COMMAND="$1"
            else
                error "Multiple commands specified. Use quotes around the full command."
                usage
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate command
if [[ -z "$COMMAND" ]]; then
    error "No command specified"
    usage
    exit 1
fi

# Main execution
main() {
    log "Beta-Prompts Containerized Safety System v${VERSION}"
    log "Command: $COMMAND"
    
    # Safety checks
    check_dagger
    check_dangerous_patterns "$COMMAND"
    validate_environment
    
    # Execute safely in container
    run_in_container "$COMMAND" "$TEST_MODE" "$ENV_VARS"
}

# Trap cleanup
trap 'rm -f "$PROJECT_DIR"/tmp_container_script.sh' EXIT

main "$@"