#!/bin/bash
# update-content.sh - Content update script
set -euo pipefail

echo "🔄 CCPrompts DevContainer - Content Update"
echo "=========================================="

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -qq && sudo apt-get upgrade -y -qq

# Update development tools
echo "🔧 Updating development tools..."

# Update Node.js global packages
if command -v npm >/dev/null 2>&1; then
    echo "📦 Updating Node.js packages..."
    npm update -g --silent || true
fi

# Update Python packages
if command -v pip3 >/dev/null 2>&1; then
    echo "🐍 Updating Python packages..."
    pip3 install --user --upgrade pip setuptools wheel || true
    pip3 install --user --upgrade \
        dagger-io \
        ruff \
        black \
        mypy \
        pytest \
        pre-commit || true
fi

# Update Rust toolchain and packages
if command -v rustup >/dev/null 2>&1; then
    echo "🦀 Updating Rust toolchain..."
    source ~/.cargo/env
    rustup update || true
    cargo install-update -a || true
fi

# Update Go tools
if command -v go >/dev/null 2>&1; then
    echo "🐹 Updating Go tools..."
    export PATH="/usr/local/go/bin:$PATH"
    go install github.com/cosmtrek/air@latest || true
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest || true
    go install golang.org/x/tools/cmd/goimports@latest || true
fi

# Update Oh My Zsh
if [ -d ~/.oh-my-zsh ]; then
    echo "🎨 Updating Oh My Zsh..."
    cd ~/.oh-my-zsh && git pull --quiet || true
    
    # Update plugins
    if [ -d ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions ]; then
        cd ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions && git pull --quiet || true
    fi
    
    if [ -d ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting ]; then
        cd ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting && git pull --quiet || true
    fi
fi

# Update VS Code extensions
echo "🔌 Updating VS Code extensions..."
code --update-extensions || true

# Update project dependencies if needed
cd /workspace

if [ -f "package.json" ]; then
    echo "📦 Updating Node.js project dependencies..."
    npm update || true
fi

if [ -f "requirements.txt" ]; then
    echo "🐍 Updating Python project dependencies..."
    pip3 install --user --upgrade -r requirements.txt || true
fi

if [ -f "Cargo.toml" ]; then
    echo "🦀 Updating Rust project dependencies..."
    cargo update || true
fi

if [ -f "go.mod" ]; then
    echo "🐹 Updating Go project dependencies..."
    go get -u all || true
fi

# Update pre-commit hooks
if [ -f ".pre-commit-config.yaml" ]; then
    echo "🪝 Updating pre-commit hooks..."
    pre-commit autoupdate || true
fi

# Clean up old packages and caches
echo "🧹 Cleaning up..."
sudo apt-get autoremove -y -qq
sudo apt-get autoclean -qq
npm cache clean --force --silent 2>/dev/null || true
pip3 cache purge 2>/dev/null || true

echo "✅ Content update completed successfully!"