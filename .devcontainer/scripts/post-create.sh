#!/bin/bash
# post-create.sh - Post container creation setup
set -euo pipefail

echo "🔧 CCPrompts DevContainer - Post Creation Setup"
echo "==============================================="

# Wait for container to be fully ready
sleep 2

# Ensure workspace permissions are correct
echo "🔒 Setting workspace permissions..."
sudo chown -R vscode:vscode /workspace
sudo chmod -R 755 /workspace

# Install project dependencies if package files exist
if [ -f "/workspace/package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    cd /workspace && npm install --silent
fi

if [ -f "/workspace/requirements.txt" ]; then
    echo "🐍 Installing Python dependencies..."
    python3 -m pip install --user -r /workspace/requirements.txt
fi

if [ -f "/workspace/Cargo.toml" ]; then
    echo "🦀 Installing Rust dependencies..."
    cd /workspace && cargo fetch
fi

if [ -f "/workspace/go.mod" ]; then
    echo "🐹 Installing Go dependencies..."
    cd /workspace && go mod download
fi

# Setup pre-commit hooks if .pre-commit-config.yaml exists
if [ -f "/workspace/.pre-commit-config.yaml" ]; then
    echo "🪝 Setting up pre-commit hooks..."
    cd /workspace && pre-commit install --install-hooks
fi

# Initialize git hooks for the project
echo "📝 Setting up git hooks..."
mkdir -p /workspace/.git/hooks

# Create commit message template
cat > /workspace/.git/hooks/prepare-commit-msg << 'EOF'
#!/bin/bash
# Prepare commit message template for CCPrompts

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# Only add template for new commits (not amends, merges, etc.)
if [ -z "$COMMIT_SOURCE" ]; then
    cat > "$COMMIT_MSG_FILE" << 'TEMPLATE'
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>
#
# Type should be one of:
# feat: A new feature
# fix: A bug fix
# docs: Documentation only changes
# style: Changes that do not affect the meaning of the code
# refactor: A code change that neither fixes a bug nor adds a feature
# perf: A code change that improves performance
# test: Adding missing tests or correcting existing tests
# chore: Changes to the build process or auxiliary tools
#
# Examples:
# feat(commands): add new /optimize command for performance analysis
# fix(security): resolve XSS vulnerability in markdown parser
# docs(readme): update installation instructions
TEMPLATE
fi
EOF

chmod +x /workspace/.git/hooks/prepare-commit-msg

# Create development configuration files
echo "⚙️  Creating development configuration..."

# EditorConfig
cat > /workspace/.editorconfig << 'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.{py,pyi}]
indent_size = 4

[*.{md,markdown}]
trim_trailing_whitespace = false

[*.{go,mod,sum}]
indent_style = tab
indent_size = 4

[Makefile]
indent_style = tab
EOF

# Create markdown link check configuration
cat > /workspace/.markdown-link-check.json << 'EOF'
{
  "ignorePatterns": [
    {
      "pattern": "^http://localhost"
    },
    {
      "pattern": "^https://localhost"
    },
    {
      "pattern": "^http://127.0.0.1"
    }
  ],
  "httpHeaders": [
    {
      "urls": ["https://github.com"],
      "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
      }
    }
  ],
  "timeout": "10s",
  "retryOn429": true,
  "retryCount": 3,
  "fallbackRetryDelay": "30s",
  "aliveStatusCodes": [200, 206, 999]
}
EOF

# Create markdownlint configuration
cat > /workspace/.markdownlint.json << 'EOF'
{
  "default": true,
  "MD013": {
    "line_length": 120,
    "heading_line_length": 120,
    "code_block_line_length": 120
  },
  "MD024": {
    "siblings_only": true
  },
  "MD033": {
    "allowed_elements": ["details", "summary", "br", "sub", "sup"]
  },
  "MD041": false
}
EOF

# Create direnv configuration
cat > /workspace/.envrc << 'EOF'
# Load .env file if it exists
if [ -f .env ]; then
  dotenv .env
fi

# Add local bin to PATH
PATH_add ./bin
PATH_add ./.devcontainer/scripts

# Set development environment
export NODE_ENV=development
export PYTHONPATH="$PWD:$PYTHONPATH"
export WORKSPACE="$PWD"

# Enable better debugging
export DEBUG=1
export RUST_BACKTRACE=1
export RUST_LOG=debug

echo "🔧 Development environment loaded for CCPrompts"
EOF

# Make scripts executable
echo "🔑 Making scripts executable..."
find /workspace/.devcontainer/scripts -name "*.sh" -exec chmod +x {} \;

# Create development database if needed
if command -v psql >/dev/null 2>&1; then
    echo "🗄️  Setting up development database..."
    # This will be handled by the docker-compose postgres service
fi

# Setup monitoring dashboards
echo "📊 Setting up monitoring configuration..."
mkdir -p /workspace/.devcontainer/monitoring/grafana/provisioning/{dashboards,datasources}

# Create Grafana datasource configuration
cat > /workspace/.devcontainer/monitoring/grafana/provisioning/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

# Create Prometheus configuration
cat > /workspace/.devcontainer/monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'devcontainer'
    static_configs:
      - targets: ['devcontainer:8080']
    scrape_interval: 30s
    metrics_path: /metrics

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
EOF

# Create nginx configuration
cat > /workspace/.devcontainer/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    include /etc/nginx/conf.d/*.conf;
}
EOF

cat > /workspace/.devcontainer/nginx/conf.d/default.conf << 'EOF'
# Development services proxy configuration

upstream grafana {
    server grafana:3000;
}

upstream prometheus {
    server prometheus:9090;
}

upstream minio {
    server minio:9000;
}

upstream jaeger {
    server jaeger:16686;
}

server {
    listen 80;
    server_name localhost;
    
    # Grafana
    location /grafana/ {
        proxy_pass http://grafana/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Prometheus
    location /prometheus/ {
        proxy_pass http://prometheus/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # MinIO
    location /minio/ {
        proxy_pass http://minio/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Jaeger
    location /jaeger/ {
        proxy_pass http://jaeger/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Default location
    location / {
        return 200 "CCPrompts Development Environment\nAvailable services:\n- Grafana: /grafana/\n- Prometheus: /prometheus/\n- MinIO: /minio/\n- Jaeger: /jaeger/\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Create database initialization script
cat > /workspace/.devcontainer/init-scripts/01-create-databases.sql << 'EOF'
-- Create additional databases for development
CREATE DATABASE sonarqube;
CREATE DATABASE ccprompts_test;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE sonarqube TO developer;
GRANT ALL PRIVILEGES ON DATABASE ccprompts_test TO developer;
EOF

# Set up development tools
echo "🛠️  Installing additional development tools..."
if command -v cargo >/dev/null 2>&1; then
    source ~/.cargo/env
    cargo install --quiet --locked bat exa fd-find ripgrep || true
fi

# Create development makefile
cat > /workspace/Makefile << 'EOF'
.PHONY: help setup lint test security validate pipeline clean docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Set up the development environment
	@echo "🚀 Setting up CCPrompts development environment..."
	@.devcontainer/scripts/post-create.sh

lint: ## Run markdown linting
	@echo "🔍 Running markdown linting..."
	@python3 .devcontainer/dagger.py lint

test: ## Run tests
	@echo "🧪 Running tests..."
	@python3 .devcontainer/dagger.py test

security: ## Run security scan
	@echo "🛡️ Running security scan..."
	@python3 .devcontainer/dagger.py security

validate: ## Validate prompt structures
	@echo "✅ Validating prompt structures..."
	@python3 .devcontainer/dagger.py validate

pipeline: ## Run full CI/CD pipeline
	@echo "🚀 Running full CI/CD pipeline..."
	@python3 .devcontainer/dagger.py full

clean: ## Clean up temporary files
	@echo "🧹 Cleaning up..."
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name "__pycache__" -delete
	@find . -type d -name ".pytest_cache" -delete
	@find . -type d -name ".mypy_cache" -delete

docker-up: ## Start all Docker services
	@echo "🐳 Starting Docker services..."
	@cd .devcontainer && docker-compose up -d

docker-down: ## Stop all Docker services
	@echo "🐳 Stopping Docker services..."
	@cd .devcontainer && docker-compose down

docker-logs: ## Show Docker service logs
	@echo "📋 Showing Docker service logs..."
	@cd .devcontainer && docker-compose logs -f
EOF

echo "✅ Post-creation setup completed successfully!"
echo "🎉 Your CCPrompts development environment is ready!"