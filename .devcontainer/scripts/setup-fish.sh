#!/usr/bin/fish
# setup-fish.sh - Comprehensive Fish shell configuration
# This script sets up Fish shell with modern features and development tools

echo "🐟 Setting up comprehensive Fish shell configuration..."

# Create Fish configuration directories
mkdir -p ~/.config/fish/{functions,completions,conf.d}

# Create main Fish configuration
cat > ~/.config/fish/config.fish << 'EOF'
# CCPrompts Fish Configuration
# Modern Fish shell setup for development

# Environment variables
set -gx EDITOR vim
set -gx BROWSER open
set -gx WORKSPACE /workspace
set -gx FISH_CONFIG_DIR ~/.config/fish

# Add development paths
set -gx PATH $HOME/.bun/bin $PATH
set -gx PATH $HOME/.cargo/bin $PATH
set -gx PATH /usr/local/go/bin $PATH
set -gx PATH $HOME/go/bin $PATH
set -gx PATH $HOME/.local/bin $PATH

# Development environment
set -gx NODE_ENV development
set -gx PYTHONPATH "$PWD:$PYTHONPATH"
set -gx RUST_BACKTRACE 1
set -gx RUST_LOG debug
set -gx DEBUG 1

# Fish-specific settings
set fish_greeting "🎉 Welcome to CCPrompts Development Environment!"
set fish_color_normal normal
set fish_color_autosuggestion 555 brblack
set fish_color_command 005fd7
set fish_color_comment 990000
set fish_color_cwd green
set fish_color_cwd_root red
set fish_color_end 009900
set fish_color_error ff0000
set fish_color_escape 00a6b2
set fish_color_history_current --bold
set fish_color_host normal
set fish_color_match --background=brblue
set fish_color_operator 00a6b2
set fish_color_param 00afff
set fish_color_quote 999900
set fish_color_redirection 00afff
set fish_color_search_match bryellow --background=brblack
set fish_color_selection white --bold --background=brblack
set fish_color_status red
set fish_color_user brgreen
set fish_color_valid_path --underline

# Enable vi mode
fish_vi_key_bindings

# Load direnv if available
if command -v direnv >/dev/null 2>&1
    direnv hook fish | source
end

# Source all configuration files
for file in ~/.config/fish/conf.d/*.fish
    if test -f $file
        source $file
    end
end
EOF

# Create development aliases and abbreviations
cat > ~/.config/fish/conf.d/aliases.fish << 'EOF'
# Development aliases and abbreviations for CCPrompts

# Modern CLI replacements
if command -v exa >/dev/null 2>&1
    alias ls='exa'
    alias ll='exa -la --git --group-directories-first'
    alias tree='exa --tree --git-ignore'
else
    alias ll='ls -la'
end

if command -v bat >/dev/null 2>&1
    alias cat='bat --paging=never'
end

if command -v fd >/dev/null 2>&1
    alias find='fd'
end

if command -v rg >/dev/null 2>&1
    alias grep='rg'
end

# Docker and containerization
abbr -a dc 'docker-compose'
abbr -a dcu 'docker-compose up -d'
abbr -a dcd 'docker-compose down'
abbr -a dcl 'docker-compose logs -f'
abbr -a dps 'docker ps'
abbr -a dimg 'docker images'

# Kubernetes
abbr -a k 'kubectl'
abbr -a kp 'kubectl get pods'
abbr -a ks 'kubectl get services'
abbr -a kd 'kubectl describe'
abbr -a kl 'kubectl logs'

# Git abbreviations
abbr -a g 'git'
abbr -a gs 'git status'
abbr -a ga 'git add'
abbr -a gc 'git commit'
abbr -a gp 'git push'
abbr -a gl 'git pull'
abbr -a gd 'git diff'
abbr -a gb 'git branch'
abbr -a gco 'git checkout'
abbr -a gm 'git merge'
abbr -a gr 'git rebase'
abbr -a glog 'git log --oneline --graph --decorate'

# Development tools
abbr -a py 'python3'
abbr -a pip 'pip3'
abbr -a tf 'terraform'
abbr -a tg 'terragrunt'

# CCPrompts specific commands
abbr -a cclint 'python3 .devcontainer/dagger.py lint'
abbr -a cctest 'python3 .devcontainer/dagger.py test'
abbr -a ccsec 'python3 .devcontainer/dagger.py security'
abbr -a ccval 'python3 .devcontainer/dagger.py validate'
abbr -a ccpipe 'python3 .devcontainer/dagger.py full'

# Navigation shortcuts
abbr -a workspace 'cd /workspace'
abbr -a prompts 'cd /workspace/prompts'
abbr -a commands 'cd /workspace/.claude/commands'
abbr -a scripts 'cd /workspace/.devcontainer/scripts'

# Quick editing
abbr -a vf 'vim ~/.config/fish/config.fish'
abbr -a sf 'source ~/.config/fish/config.fish'
EOF

# Create custom functions
cat > ~/.config/fish/functions/ccprompts_status.fish << 'EOF'
function ccprompts_status -d "Show CCPrompts development environment status"
    echo "🎯 CCPrompts Development Environment Status"
    echo "=========================================="
    echo ""
    
    # Show current directory and git status
    echo "📂 Current directory: "(pwd)
    if test -d .git
        echo "🌳 Git branch: "(git branch --show-current 2>/dev/null || echo "Not in git repo")
        set dirty_files (git status --porcelain | wc -l)
        if test $dirty_files -gt 0
            echo "📝 Uncommitted changes: $dirty_files files"
        else
            echo "✅ Working directory clean"
        end
    end
    echo ""
    
    # Show system resources
    echo "💻 System Resources:"
    if command -v free >/dev/null 2>&1
        set mem_usage (free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
        echo "  Memory usage: $mem_usage%"
    end
    
    if command -v df >/dev/null 2>&1
        set disk_usage (df /workspace | tail -1 | awk '{print $5}' | sed 's/%//')
        echo "  Disk usage: $disk_usage%"
    end
    echo ""
    
    # Show Docker services if available
    if command -v docker-compose >/dev/null 2>&1; and test -f .devcontainer/docker-compose.yml
        echo "🐳 Docker Services:"
        cd .devcontainer
        docker-compose ps --format "table {{.Name}}\t{{.State}}" 2>/dev/null || echo "  No services running"
        cd - >/dev/null
    end
    echo ""
    
    # Show available commands
    echo "🛠️  Quick Commands:"
    echo "  cclint     - Run markdown linting"
    echo "  cctest     - Run tests"
    echo "  ccsec      - Run security scan"
    echo "  ccval      - Validate prompt structures"
    echo "  ccpipe     - Run full CI/CD pipeline"
end
EOF

cat > ~/.config/fish/functions/ccprompts_update.fish << 'EOF'
function ccprompts_update -d "Update CCPrompts development environment"
    echo "🔄 Updating CCPrompts development environment..."
    
    # Update Fish plugins
    echo "🐟 Updating Fish plugins..."
    fisher update
    
    # Update system packages
    echo "📦 Updating system packages..."
    sudo apt-get update -qq && sudo apt-get upgrade -y -qq
    
    # Update development tools
    echo "🔧 Updating development tools..."
    if command -v npm >/dev/null 2>&1
        npm update -g
    end
    
    if command -v pip3 >/dev/null 2>&1
        pip3 install --user --upgrade pip setuptools wheel
        pip3 install --user --upgrade dagger-io ruff black mypy pytest
    end
    
    if command -v rustup >/dev/null 2>&1
        rustup update
    end
    
    echo "✅ Environment updated successfully!"
end
EOF

cat > ~/.config/fish/functions/ccprompts_services.fish << 'EOF'
function ccprompts_services -d "Manage CCPrompts development services"
    if test (count $argv) -eq 0
        echo "Usage: ccprompts_services [start|stop|status|logs]"
        return 1
    end
    
    set action $argv[1]
    
    if not test -f /workspace/.devcontainer/docker-compose.yml
        echo "❌ Docker Compose file not found"
        return 1
    end
    
    cd /workspace/.devcontainer
    
    switch $action
        case start
            echo "🚀 Starting CCPrompts services..."
            docker-compose up -d
        case stop
            echo "🛑 Stopping CCPrompts services..."
            docker-compose down
        case status
            echo "📊 Service status:"
            docker-compose ps
        case logs
            set service $argv[2]
            if test -n "$service"
                docker-compose logs -f $service
            else
                docker-compose logs -f
            end
        case '*'
            echo "Unknown action: $action"
            echo "Available actions: start, stop, status, logs [service]"
    end
    
    cd - >/dev/null
end
EOF

cat > ~/.config/fish/functions/ccprompts_prompt.fish << 'EOF'
function ccprompts_prompt -d "Show detailed CCPrompts prompt information"
    if test (count $argv) -eq 0
        echo "Usage: ccprompts_prompt [search_term]"
        echo "Shows information about CCPrompts prompts"
        return 1
    end
    
    set search_term $argv[1]
    
    if test -d /workspace/prompts
        echo "🔍 Searching for prompts matching: $search_term"
        echo ""
        
        for file in /workspace/prompts/**/*.md
            if string match -qi "*$search_term*" (basename $file)
                echo "📄 "(string replace /workspace/ '' $file)
                # Show first few lines of the file
                head -5 $file | grep -E '(^#|^##|<role>|<activation>)' || head -2 $file
                echo ""
            end
        end
    else
        echo "❌ Prompts directory not found"
    end
end
EOF

# Create Fish completions for custom commands
cat > ~/.config/fish/completions/ccprompts_services.fish << 'EOF'
complete -c ccprompts_services -n '__fish_use_subcommand' -a 'start' -d 'Start all services'
complete -c ccprompts_services -n '__fish_use_subcommand' -a 'stop' -d 'Stop all services'
complete -c ccprompts_services -n '__fish_use_subcommand' -a 'status' -d 'Show service status'
complete -c ccprompts_services -n '__fish_use_subcommand' -a 'logs' -d 'Show service logs'
EOF

# Create welcome message for Fish
cat > ~/.config/fish/conf.d/welcome.fish << 'EOF'
# CCPrompts welcome message for Fish shell

function fish_greeting
    echo ""
    echo "🐟 Welcome to CCPrompts Development Environment!"
    echo "==============================================="
    echo ""
    echo "🔧 Available Fish functions:"
    echo "  ccprompts_status   - Show environment status"
    echo "  ccprompts_update   - Update development environment"
    echo "  ccprompts_services - Manage Docker services"
    echo "  ccprompts_prompt   - Search and explore prompts"
    echo ""
    echo "📂 Quick navigation:"
    echo "  workspace  - Go to workspace root"
    echo "  prompts    - Go to prompts directory"
    echo "  commands   - Go to slash commands directory"
    echo ""
    echo "🚀 Development commands:"
    echo "  cclint     - Run markdown linting"
    echo "  cctest     - Run command tests"
    echo "  ccsec      - Run security scan"
    echo "  ccval      - Validate prompt structures"
    echo "  ccpipe     - Run full CI/CD pipeline"
    echo ""
    echo "🌐 Available services (when running):"
    echo "  • Grafana:     http://localhost:3000 (admin/admin)"
    echo "  • Prometheus:  http://localhost:9090"
    echo "  • MinIO:       http://localhost:9001 (minioadmin/minioadmin)"
    echo "  • Adminer:     http://localhost:8080"
    echo "  • Jaeger:      http://localhost:16686"
    echo ""
    echo "💡 Type 'ccprompts_status' for current environment status"
    echo "Happy coding! 🚀"
    echo ""
end
EOF

echo "✅ Fish shell configuration completed!"
echo "🔄 Reload Fish with: exec fish"