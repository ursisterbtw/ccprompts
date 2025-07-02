#!/bin/bash
# mcp-init.sh - Comprehensive MCP Development Server Initialization
# Starts the most critical development servers with exactly 30 tools total

set -euo pipefail

echo "🚀 Initializing CCPrompts MCP Development Environment"
echo "===================================================="

# Environment variables
export MCP_LOG_LEVEL="${MCP_LOG_LEVEL:-info}"
export MCP_PORT_BASE="${MCP_PORT_BASE:-9000}"
export MCP_CONFIG_DIR="/workspace/.devcontainer/mcp"
export MCP_LOGS_DIR="/workspace/.devcontainer/logs/mcp"

# Create necessary directories
mkdir -p "$MCP_CONFIG_DIR" "$MCP_LOGS_DIR"

# Function to start MCP server with logging
start_mcp_server() {
    local name="$1"
    local port="$2"
    local tools_count="$3"
    local description="$4"
    local command="$5"
    
    echo "📡 Starting $name server (Port: $port, Tools: $tools_count)"
    echo "   Description: $description"
    
    # Start server in background with logging
    nohup bash -c "$command" > "$MCP_LOGS_DIR/$name.log" 2>&1 &
    local pid=$!
    echo "$pid" > "$MCP_LOGS_DIR/$name.pid"
    
    # Wait a moment and check if it started successfully
    sleep 2
    if kill -0 "$pid" 2>/dev/null; then
        echo "   ✅ $name server started successfully (PID: $pid)"
    else
        echo "   ❌ $name server failed to start"
        return 1
    fi
}

# Function to create MCP server configuration
create_mcp_config() {
    local name="$1"
    local port="$2"
    local tools="$3"
    
    cat > "$MCP_CONFIG_DIR/${name}-config.json" << EOF
{
  "name": "$name",
  "port": $port,
  "host": "0.0.0.0",
  "cors": true,
  "logging": {
    "level": "$MCP_LOG_LEVEL",
    "file": "$MCP_LOGS_DIR/$name.log"
  },
  "tools": $tools
}
EOF
}

echo ""
echo "🔧 Creating MCP server configurations..."

# Server 1: Core Development Tools (8 tools)
# File operations, git, process management, environment
create_mcp_config "core-dev" "9001" '[
  {
    "name": "read_file",
    "description": "Read file contents with syntax highlighting support"
  },
  {
    "name": "write_file", 
    "description": "Write or create files with backup and validation"
  },
  {
    "name": "list_directory",
    "description": "List directory contents with detailed file information"
  },
  {
    "name": "git_status",
    "description": "Get comprehensive git repository status and changes"
  },
  {
    "name": "git_commit",
    "description": "Create git commits with automated message generation"
  },
  {
    "name": "run_command",
    "description": "Execute system commands with output capture and timeout"
  },
  {
    "name": "get_env_vars",
    "description": "Retrieve and manage environment variables securely"
  },
  {
    "name": "watch_files",
    "description": "Monitor file changes with real-time notifications"
  }
]'

# Server 2: Database Operations (6 tools)
# PostgreSQL, Redis, migrations, queries
create_mcp_config "database" "9002" '[
  {
    "name": "execute_sql",
    "description": "Execute SQL queries with result formatting and validation"
  },
  {
    "name": "describe_table",
    "description": "Get detailed database table schema and relationships"
  },
  {
    "name": "run_migration",
    "description": "Execute database migrations with rollback support"
  },
  {
    "name": "redis_get",
    "description": "Retrieve values from Redis cache with type detection"
  },
  {
    "name": "redis_set",
    "description": "Store values in Redis with TTL and serialization options"
  },
  {
    "name": "backup_database",
    "description": "Create database backups with compression and verification"
  }
]'

# Server 3: Container & Infrastructure (6 tools)
# Docker, Kubernetes, services, logs
create_mcp_config "infrastructure" "9003" '[
  {
    "name": "docker_ps",
    "description": "List running containers with detailed status information"
  },
  {
    "name": "docker_logs",
    "description": "Retrieve container logs with filtering and streaming"
  },
  {
    "name": "docker_exec",
    "description": "Execute commands inside containers with session management"
  },
  {
    "name": "kubectl_get",
    "description": "Get Kubernetes resources with YAML/JSON output options"
  },
  {
    "name": "service_health",
    "description": "Check health status of all development services"
  },
  {
    "name": "resource_monitor",
    "description": "Monitor system resources and container performance"
  }
]'

# Server 4: Testing & Quality Assurance (5 tools)
# Test execution, coverage, linting, security
create_mcp_config "testing" "9004" '[
  {
    "name": "run_tests",
    "description": "Execute test suites with coverage reporting and parallelization"
  },
  {
    "name": "lint_code",
    "description": "Run code linting with auto-fix suggestions and reporting"
  },
  {
    "name": "security_scan",
    "description": "Perform security vulnerability scanning with detailed reports"
  },
  {
    "name": "generate_coverage",
    "description": "Generate code coverage reports with visual highlighting"
  },
  {
    "name": "validate_config",
    "description": "Validate configuration files with schema checking"
  }
]'

# Server 5: API & Web Services (5 tools)
# HTTP requests, API testing, webhook handling
create_mcp_config "api-web" "9005" '[
  {
    "name": "http_request",
    "description": "Make HTTP requests with authentication and response parsing"
  },
  {
    "name": "test_endpoint",
    "description": "Test API endpoints with validation and performance metrics"
  },
  {
    "name": "webhook_server",
    "description": "Start temporary webhook server for testing integrations"
  },
  {
    "name": "proxy_request",
    "description": "Proxy HTTP requests through development environment"
  },
  {
    "name": "mock_server",
    "description": "Create mock HTTP servers with configurable responses"
  }
]'

echo ""
echo "🚀 Starting MCP development servers..."

# Start Core Development Server (8 tools)
start_mcp_server "core-dev" "9001" "8" "Core file operations, git, and process management" \
"python3 -m uvicorn mcp_core_dev:app --host 0.0.0.0 --port 9001 --log-level $MCP_LOG_LEVEL"

# Start Database Server (6 tools) 
start_mcp_server "database" "9002" "6" "PostgreSQL, Redis, and database operations" \
"python3 -m uvicorn mcp_database:app --host 0.0.0.0 --port 9002 --log-level $MCP_LOG_LEVEL"

# Start Infrastructure Server (6 tools)
start_mcp_server "infrastructure" "9003" "6" "Docker, Kubernetes, and service management" \
"python3 -m uvicorn mcp_infrastructure:app --host 0.0.0.0 --port 9003 --log-level $MCP_LOG_LEVEL"

# Start Testing Server (5 tools)
start_mcp_server "testing" "9004" "5" "Testing, linting, and quality assurance" \
"python3 -m uvicorn mcp_testing:app --host 0.0.0.0 --port 9004 --log-level $MCP_LOG_LEVEL"

# Start API/Web Server (5 tools)
start_mcp_server "api-web" "9005" "5" "HTTP requests, API testing, and web services" \
"python3 -m uvicorn mcp_api_web:app --host 0.0.0.0 --port 9005 --log-level $MCP_LOG_LEVEL"

echo ""
echo "📊 MCP Server Summary:"
echo "======================"
echo "• Core Development:   8 tools (Port 9001)"
echo "• Database:           6 tools (Port 9002)"  
echo "• Infrastructure:     6 tools (Port 9003)"
echo "• Testing & QA:       5 tools (Port 9004)"
echo "• API & Web:          5 tools (Port 9005)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "• Total Tools:       30 tools"
echo "• Total Servers:      5 servers"

# Create MCP client configuration
echo ""
echo "🔧 Creating MCP client configuration..."

cat > "$MCP_CONFIG_DIR/client-config.json" << 'EOF'
{
  "mcpServers": {
    "core-dev": {
      "command": "stdio",
      "args": ["--server", "http://localhost:9001"],
      "description": "Core development tools for file operations and git",
      "tools": 8
    },
    "database": {
      "command": "stdio", 
      "args": ["--server", "http://localhost:9002"],
      "description": "Database operations for PostgreSQL and Redis",
      "tools": 6
    },
    "infrastructure": {
      "command": "stdio",
      "args": ["--server", "http://localhost:9003"], 
      "description": "Container and infrastructure management",
      "tools": 6
    },
    "testing": {
      "command": "stdio",
      "args": ["--server", "http://localhost:9004"],
      "description": "Testing, linting, and quality assurance",
      "tools": 5
    },
    "api-web": {
      "command": "stdio",
      "args": ["--server", "http://localhost:9005"],
      "description": "HTTP requests, API testing, and web services", 
      "tools": 5
    }
  }
}
EOF

# Create management scripts
echo ""
echo "🛠️  Creating MCP management utilities..."

# Stop script
cat > "$MCP_CONFIG_DIR/stop-servers.sh" << 'EOF'
#!/bin/bash
# Stop all MCP servers

echo "🛑 Stopping MCP servers..."
for pid_file in /workspace/.devcontainer/logs/mcp/*.pid; do
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        server_name=$(basename "$pid_file" .pid)
        
        if kill -0 "$pid" 2>/dev/null; then
            echo "  Stopping $server_name (PID: $pid)"
            kill "$pid"
            rm -f "$pid_file"
        else
            echo "  $server_name was not running"
            rm -f "$pid_file"
        fi
    fi
done
echo "✅ All MCP servers stopped"
EOF

# Status script
cat > "$MCP_CONFIG_DIR/status.sh" << 'EOF'
#!/bin/bash
# Check status of all MCP servers

echo "📊 MCP Server Status:"
echo "===================="

total_tools=0
running_servers=0

for pid_file in /workspace/.devcontainer/logs/mcp/*.pid; do
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        server_name=$(basename "$pid_file" .pid)
        
        if kill -0 "$pid" 2>/dev/null; then
            echo "✅ $server_name (PID: $pid) - Running"
            running_servers=$((running_servers + 1))
            
            # Add tool counts
            case "$server_name" in
                "core-dev") total_tools=$((total_tools + 8)) ;;
                "database") total_tools=$((total_tools + 6)) ;;
                "infrastructure") total_tools=$((total_tools + 6)) ;;
                "testing") total_tools=$((total_tools + 5)) ;;
                "api-web") total_tools=$((total_tools + 5)) ;;
            esac
        else
            echo "❌ $server_name - Not running"
            rm -f "$pid_file"
        fi
    fi
done

echo ""
echo "Summary: $running_servers/5 servers running, $total_tools tools available"
EOF

# Make scripts executable
chmod +x "$MCP_CONFIG_DIR/stop-servers.sh" "$MCP_CONFIG_DIR/status.sh"

# Health check function
echo ""
echo "🏥 Running health checks..."

sleep 5  # Give servers time to fully start

for port in 9001 9002 9003 9004 9005; do
    if curl -s "http://localhost:$port/health" >/dev/null 2>&1; then
        echo "✅ Server on port $port is healthy"
    else
        echo "⚠️  Server on port $port may need more time to start"
    fi
done

# Add aliases to Fish shell
echo ""
echo "🐟 Adding Fish shell aliases..."

mkdir -p ~/.config/fish/conf.d
cat > ~/.config/fish/conf.d/mcp-aliases.fish << 'EOF'
# MCP Development Server Aliases

# Server management
abbr -a mcp-start '/workspace/.devcontainer/scripts/mcp-init.sh'
abbr -a mcp-stop '/workspace/.devcontainer/mcp/stop-servers.sh'  
abbr -a mcp-status '/workspace/.devcontainer/mcp/status.sh'
abbr -a mcp-logs 'tail -f /workspace/.devcontainer/logs/mcp/*.log'

# Quick tool access
abbr -a mcp-read 'curl -X POST http://localhost:9001/tools/read_file'
abbr -a mcp-git 'curl -X POST http://localhost:9001/tools/git_status'
abbr -a mcp-sql 'curl -X POST http://localhost:9002/tools/execute_sql'
abbr -a mcp-docker 'curl -X POST http://localhost:9003/tools/docker_ps'
abbr -a mcp-test 'curl -X POST http://localhost:9004/tools/run_tests'

# Development shortcuts
abbr -a mcp-health 'for port in 9001 9002 9003 9004 9005; curl -s http://localhost:$port/health; end'
abbr -a mcp-config 'cat /workspace/.devcontainer/mcp/client-config.json'
EOF

# Create VS Code settings for MCP integration
echo ""
echo "⚙️  Configuring VS Code MCP integration..."

mkdir -p ~/.vscode-server/data/User
cat > ~/.vscode-server/data/User/mcp-settings.json << 'EOF'
{
  "mcp.servers": {
    "core-dev": {
      "url": "http://localhost:9001",
      "description": "Core development tools",
      "enabled": true
    },
    "database": {
      "url": "http://localhost:9002", 
      "description": "Database operations",
      "enabled": true
    },
    "infrastructure": {
      "url": "http://localhost:9003",
      "description": "Container management", 
      "enabled": true
    },
    "testing": {
      "url": "http://localhost:9004",
      "description": "Testing and QA",
      "enabled": true
    },
    "api-web": {
      "url": "http://localhost:9005",
      "description": "API and web services",
      "enabled": true
    }
  }
}
EOF

echo ""
echo "🎉 MCP Development Environment Initialized Successfully!"
echo "========================================================"
echo ""
echo "📡 Available Services:"
echo "  • Core Development:    http://localhost:9001  (8 tools)"
echo "  • Database Operations: http://localhost:9002  (6 tools)"
echo "  • Infrastructure:      http://localhost:9003  (6 tools)"
echo "  • Testing & QA:        http://localhost:9004  (5 tools)"
echo "  • API & Web Services:  http://localhost:9005  (5 tools)"
echo ""
echo "🛠️  Management Commands:"
echo "  • mcp-status    - Check server status"
echo "  • mcp-stop      - Stop all servers"
echo "  • mcp-logs      - View server logs"
echo "  • mcp-health    - Health check all servers"
echo ""
echo "📁 Configuration Files:"
echo "  • Client Config: $MCP_CONFIG_DIR/client-config.json"
echo "  • Server Logs:   $MCP_LOGS_DIR/"
echo "  • VS Code:       ~/.vscode-server/data/User/mcp-settings.json"
echo ""
echo "Total: 30 tools across 5 specialized servers"
echo "Ready for Claude Code integration! 🚀"