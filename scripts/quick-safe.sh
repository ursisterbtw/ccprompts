#!/bin/bash

# Quick safety wrapper for common dangerous commands
# Usage: ./scripts/quick-safe.sh <command>

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAFE_RUN="$SCRIPT_DIR/safe-run.sh"

# Quick aliases for common dangerous operations
case "$1" in
"install")
    shift
    exec "$SAFE_RUN" "npm install $*"
    ;;
"build")
    shift
    exec "$SAFE_RUN" "npm run build $*"
    ;;
"test")
    shift
    exec "$SAFE_RUN" "npm test $*"
    ;;
"curl-install")
    shift
    echo "[WARNING]  Executing curl pipe to bash in container for safety"
    exec "$SAFE_RUN" "$*"
    ;;
"rm-rf")
    shift
    echo "[WARNING]  Executing rm -rf in container for safety"
    exec "$SAFE_RUN" "rm -rf $*"
    ;;
"chmod-recursive")
    shift
    echo "[WARNING]  Executing chmod -R in container for safety"
    exec "$SAFE_RUN" "chmod -R $*"
    ;;
"system-update")
    echo "[WARNING]  Executing system update in container for safety"
    exec "$SAFE_RUN" "apt-get update && apt-get upgrade -y"
    ;;
*)
    echo "Unknown quick command: $1"
    echo "Available quick commands:"
    echo "  install           - npm install"
    echo "  build            - npm run build"
    echo "  test             - npm test"
    echo "  curl-install     - curl pipe to bash"
    echo "  rm-rf            - rm -rf"
    echo "  chmod-recursive  - chmod -R"
    echo "  system-update    - apt update && upgrade"
    echo ""
    echo "Or use the full safe-run.sh script directly"
    exit 1
    ;;
esac
