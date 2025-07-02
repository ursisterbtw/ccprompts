#!/bin/bash
# on-create.sh - Initial container setup script
set -euo pipefail

echo "🚀 CCPrompts DevContainer - Initial Setup"
echo "==========================================="

# Update package lists
echo "📦 Updating package lists..."
sudo apt-get update -qq

# Install additional development tools
echo "🔧 Installing additional development tools..."
sudo apt-get install -y -qq \
    bat \
    exa \
    fd-find \
    ripgrep \
    fzf \
    direnv \
    shellcheck \
    yamllint

# Setup direnv for automatic environment loading
echo "🔄 Configuring direnv..."
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# Configure git with better defaults
echo "📝 Configuring Git..."
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global push.autoSetupRemote true
git config --global rerere.enabled true
git config --global column.ui auto
git config --global branch.sort -committerdate
git config --global tag.sort -version:refname

# Install and configure Fish shell with modern features
echo "🐟 Setting up Fish shell..."

# Run comprehensive Fish setup
if [ -f "/workspace/.devcontainer/scripts/setup-fish.sh" ]; then
    chmod +x /workspace/.devcontainer/scripts/setup-fish.sh
    fish /workspace/.devcontainer/scripts/setup-fish.sh
fi

# Install Fisher (Fish plugin manager) and plugins
fish -c '
curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher
fisher install jorgebucaran/nvm.fish
fisher install PatrickF1/fzf.fish
fisher install franciscolourenco/done
fisher install gazorby/fish-abbreviation-tips
fisher install jethrokuan/z
fisher install oh-my-fish/plugin-foreign-env
fisher install laughedelic/pisces
fisher install edc/bass
fisher install IlanCosman/tide@v5
'

# Setup Oh My Zsh plugins and theme (for compatibility)
echo "🎨 Configuring Zsh..."
sed -i 's/plugins=(git)/plugins=(git docker docker-compose kubectl terraform golang python rust zsh-autosuggestions zsh-syntax-highlighting colored-man-pages z)/' ~/.zshrc
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="agnoster"/' ~/.zshrc

# Install additional language-specific tools
echo "🔨 Installing language-specific tools..."

# Python tools
python3 -m pip install --user --upgrade \
    poetry \
    pipenv \
    virtualenv \
    pre-commit \
    jupyterlab \
    ipython

# Node.js tools
npm install -g \
    @types/node \
    typescript \
    ts-node \
    nodemon \
    pm2 \
    yarn \
    pnpm

# Go tools
export PATH="/usr/local/go/bin:$PATH"
go install github.com/cosmtrek/air@latest
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
go install golang.org/x/tools/cmd/goimports@latest

# Rust tools
source ~/.cargo/env
cargo install cargo-watch cargo-edit cargo-audit

# Setup workspace directories
echo "📁 Setting up workspace directories..."
mkdir -p /workspace/{tmp,logs,data,cache}

# Install Dagger SDK
echo "🐍 Installing Dagger SDK..."
python3 -m pip install --user dagger-io

# Configure VS Code settings
echo "⚙️  Configuring VS Code settings..."
mkdir -p ~/.vscode-server/data/User
cat > ~/.vscode-server/data/User/settings.json << 'EOF'
{
    "terminal.integrated.defaultProfile.linux": "zsh",
    "workbench.colorTheme": "GitHub Dark",
    "editor.fontFamily": "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
    "editor.fontLigatures": true,
    "editor.fontSize": 14,
    "editor.lineHeight": 1.5,
    "workbench.tree.indent": 20,
    "editor.guides.indentation": true,
    "breadcrumbs.enabled": true,
    "explorer.confirmDelete": false,
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true
}
EOF

# Setup environment file template
echo "🔐 Creating environment template..."
cat > /workspace/.env.example << 'EOF'
# Development Environment Variables
# Copy this file to .env and customize for your setup

# Development Mode
NODE_ENV=development
DEBUG=true

# Database Configuration
DATABASE_URL=postgresql://developer:devpass@postgres:5432/ccprompts_dev

# Redis Configuration
REDIS_URL=redis://redis:6379

# MinIO Configuration
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# API Keys and Tokens
GITHUB_TOKEN=your_github_token_here
DAGGER_CLOUD_TOKEN=your_dagger_token_here

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# Monitoring
PROMETHEUS_URL=http://prometheus:9090
GRAFANA_URL=http://grafana:3000

# External Services
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
EOF

# Create development aliases for Zsh (Fish aliases are configured separately)
echo "🔗 Setting up development aliases..."
cat >> ~/.zshrc << 'EOF'

# CCPrompts Development Aliases
alias ll='exa -la --git --group-directories-first'
alias tree='exa --tree --git-ignore'
alias cat='bat --paging=never'
alias find='fd'
alias grep='rg'
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias k='kubectl'
alias tf='terraform'
alias py='python3'
alias pip='pip3'

# CCPrompts specific commands
alias ccprompts-lint='python3 .devcontainer/dagger.py lint'
alias ccprompts-test='python3 .devcontainer/dagger.py test'
alias ccprompts-security='python3 .devcontainer/dagger.py security'
alias ccprompts-validate='python3 .devcontainer/dagger.py validate'
alias ccprompts-pipeline='python3 .devcontainer/dagger.py full'

# Quick navigation
alias workspace='cd /workspace'
alias prompts='cd /workspace/prompts'
alias commands='cd /workspace/.claude/commands'

# Fish shell function aliases for Zsh compatibility
alias ccprompts_status='fish -c ccprompts_status'
alias ccprompts_update='fish -c ccprompts_update'
alias ccprompts_services='fish -c "ccprompts_services $*"'
alias ccprompts_prompt='fish -c "ccprompts_prompt $*"'
EOF

# Set proper permissions
echo "🔒 Setting permissions..."
chmod +x /workspace/.devcontainer/scripts/*.sh

# Create welcome message
echo "✨ Creating welcome message..."
cat > ~/.welcome.sh << 'EOF'
#!/bin/bash
echo ""
echo "🎉 Welcome to CCPrompts Development Environment!"
echo "==============================================="
echo ""
echo "🔧 Available commands:"
echo "  ccprompts-lint      - Run markdown linting"
echo "  ccprompts-test      - Run command tests"
echo "  ccprompts-security  - Run security scan"
echo "  ccprompts-validate  - Validate prompt structures"
echo "  ccprompts-pipeline  - Run full CI/CD pipeline"
echo ""
echo "📂 Quick navigation:"
echo "  workspace  - Go to workspace root"
echo "  prompts    - Go to prompts directory"
echo "  commands   - Go to slash commands directory"
echo ""
echo "🐳 Docker services:"
echo "  dc up -d          - Start all services"
echo "  dc ps             - Show service status"
echo "  dc logs -f <svc>  - Follow service logs"
echo ""
echo "🌐 Available services:"
echo "  • Grafana:     http://localhost:3000 (admin/admin)"
echo "  • Prometheus:  http://localhost:9090"
echo "  • MinIO:       http://localhost:9001 (minioadmin/minioadmin)"
echo "  • Adminer:     http://localhost:8080"
echo "  • Jaeger:      http://localhost:16686"
echo "  • SonarQube:   http://localhost:9001"
echo "  • Vault:       http://localhost:8200"
echo ""
echo "Happy coding! 🚀"
echo ""
EOF

chmod +x ~/.welcome.sh
echo 'source ~/.welcome.sh' >> ~/.zshrc

echo "✅ Initial setup completed successfully!"
echo "🔄 Please restart your terminal or run 'source ~/.zshrc' to apply changes."