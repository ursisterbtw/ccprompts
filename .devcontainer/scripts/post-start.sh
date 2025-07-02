#!/bin/bash
# post-start.sh - Post container start script
set -euo pipefail

echo "🚀 CCPrompts DevContainer - Post Start"
echo "====================================="

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 5

# Check if Docker services are running (if docker-compose is being used)
if [ -f "/workspace/.devcontainer/docker-compose.yml" ]; then
    echo "🐳 Checking Docker services status..."
    cd /workspace/.devcontainer
    
    # Check if services are running
    if docker-compose ps --quiet | grep -q .; then
        echo "✅ Docker services are running:"
        docker-compose ps --format "table {{.Name}}\t{{.State}}\t{{.Ports}}"
    else
        echo "ℹ️  Docker services not started. Use 'make docker-up' to start them."
    fi
fi

# Ensure workspace ownership is correct
echo "🔒 Ensuring correct workspace permissions..."
sudo chown -R vscode:vscode /workspace/.vscode-server /workspace/.devcontainer 2>/dev/null || true

# Load environment if .env exists
if [ -f "/workspace/.env" ]; then
    echo "🔧 Loading environment variables from .env..."
    set -a
    source /workspace/.env
    set +a
else
    echo "ℹ️  No .env file found. Copy .env.example to .env if needed."
fi

# Update git safe directory (for security)
echo "🔐 Updating git safe directory..."
git config --global safe.directory /workspace

# Run health checks
echo "🏥 Running health checks..."

# Check disk space
DISK_USAGE=$(df /workspace | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "⚠️  Warning: Disk usage is at ${DISK_USAGE}%. Consider cleaning up."
else
    echo "✅ Disk usage: ${DISK_USAGE}%"
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
echo "✅ Memory usage: ${MEM_USAGE}%"

# Check if required tools are available
echo "🔧 Checking development tools..."

check_tool() {
    if command -v "$1" >/dev/null 2>&1; then
        VERSION=$($1 --version 2>/dev/null | head -1 | cut -d' ' -f1-2 || echo "unknown")
        echo "✅ $1: $VERSION"
    else
        echo "❌ $1: not found"
    fi
}

check_tool python3
check_tool node
check_tool npm
check_tool git
check_tool docker
check_tool kubectl
check_tool terraform
check_tool dagger

# Check Dagger functionality
if command -v dagger >/dev/null 2>&1; then
    echo "🐍 Testing Dagger connectivity..."
    if python3 -c "import dagger; print('✅ Dagger Python SDK available')" 2>/dev/null; then
        echo "✅ Dagger Python SDK is working"
    else
        echo "⚠️  Dagger Python SDK may need installation"
    fi
fi

# Show available services
echo "🌐 Available development services:"
echo "  • Workspace:    http://localhost:8080 (if applicable)"
echo "  • Grafana:      http://localhost:3000 (admin/admin)"
echo "  • Prometheus:   http://localhost:9090"
echo "  • MinIO:        http://localhost:9001 (minioadmin/minioadmin)"
echo "  • Adminer:      http://localhost:8080"
echo "  • Jaeger:       http://localhost:16686"
echo "  • SonarQube:    http://localhost:9001"
echo "  • Vault:        http://localhost:8200"

# Show quick commands
echo ""
echo "🛠️  Quick commands:"
echo "  make help       - Show all available commands"
echo "  make docker-up  - Start all Docker services"
echo "  make lint       - Run markdown linting"
echo "  make test       - Run tests"
echo "  make pipeline   - Run full CI/CD pipeline"

# Check for updates to development environment
echo "🔄 Checking for environment updates..."
if [ -f "/workspace/.devcontainer/scripts/update-content.sh" ]; then
    LAST_UPDATE_FILE="/workspace/.devcontainer/.last_update"
    if [ ! -f "$LAST_UPDATE_FILE" ] || [ $(find "$LAST_UPDATE_FILE" -mtime +7 -print) ]; then
        echo "ℹ️  Consider running 'make setup' to update your development environment."
        touch "$LAST_UPDATE_FILE"
    fi
fi

# Create development session log
echo "📝 Logging session start..."
SESSION_LOG="/workspace/.devcontainer/logs/sessions.log"
mkdir -p "$(dirname "$SESSION_LOG")"
echo "$(date -Iseconds) - Development session started" >> "$SESSION_LOG"

# Show git status if in a git repository
if [ -d "/workspace/.git" ]; then
    echo ""
    echo "📂 Git repository status:"
    cd /workspace
    git status --porcelain | head -10 || echo "  Clean working directory"
    
    # Show recent commits
    echo ""
    echo "📋 Recent commits:"
    git log --oneline --decorate --graph -5 2>/dev/null || echo "  No commits found"
fi

# Show project structure overview
echo ""
echo "📁 Project structure:"
if command -v tree >/dev/null 2>&1; then
    tree -L 2 -I 'node_modules|.git|__pycache__' /workspace | head -20
elif command -v exa >/dev/null 2>&1; then
    exa --tree --level=2 --git-ignore /workspace | head -20
else
    ls -la /workspace
fi

echo ""
echo "🎉 Development environment is ready!"
echo "✨ Happy coding with CCPrompts!"