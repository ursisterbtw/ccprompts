# CLAUDE.md - Advanced Development Container Guide

This file provides comprehensive guidance to Claude Code when working with the CCPrompts advanced development container environment. This setup represents a **bleeding-edge, enterprise-grade development platform** with comprehensive tooling, monitoring, and automation.

## 🏗️ Development Container Architecture

### **Multi-Stage Container Design**

The development environment uses a sophisticated multi-stage Docker build optimized for performance and development productivity:

```text
┌─────────────────────────────────────────────────────────────┐
│                    Ubuntu 25.04 Base                        │
├─────────────────────────────────────────────────────────────┤
│  Languages: Python 3.12 | Node.js 20 | Rust | Go 1.21+      │
├─────────────────────────────────────────────────────────────┤
│  Tools: Docker | kubectl | Terraform | Dagger | GitHub CLI  │
├─────────────────────────────────────────────────────────────┤
│  Shells: Fish (primary) | Zsh | Bash with modern plugins    │
├─────────────────────────────────────────────────────────────┤
│  Monitoring: Prometheus | Grafana | Jaeger | Alertmanager   │
└─────────────────────────────────────────────────────────────┘
```

### **Service Ecosystem (12 Services)**

The environment includes a comprehensive service stack for full-stack development:

| Service | Port | Purpose | Credentials |
|---------|------|---------|-------------|
| **Grafana** | 3000 | Metrics visualization & dashboards | admin/admin |
| **Prometheus** | 9090 | Metrics collection & monitoring | - |
| **PostgreSQL** | 5432 | Primary development database | developer/devpass |
| **Redis** | 6379 | Caching & session management | - |
| **MinIO** | 9001 | Object storage (S3-compatible) | minioadmin/minioadmin |
| **Elasticsearch** | 9200 | Search & analytics engine | - |
| **Jaeger** | 16686 | Distributed tracing UI | - |
| **SonarQube** | 9001 | Code quality analysis | admin/admin |
| **Vault** | 8200 | Secrets management | dev-root-token |
| **Adminer** | 8080 | Database administration | - |
| **NGINX** | 80/443 | Reverse proxy & load balancer | - |
| **Alertmanager** | 9093 | Alert routing & notifications | - |

## 🐟 Fish Shell Environment

### **Primary Shell Configuration**

Fish shell is configured as the primary development shell with advanced features:

**Key Features:**

- **Tide prompt** with git integration and performance indicators
- **Smart abbreviations** for common development tasks
- **Auto-suggestions** based on command history and context
- **Syntax highlighting** with error detection
- **Custom functions** for CCPrompts-specific workflows

### **Essential Fish Commands**

```fish
# Environment status and management
ccprompts_status          # Show comprehensive environment status
ccprompts_update         # Update all development tools and dependencies
ccprompts_services start # Start all Docker services
ccprompts_services stop  # Stop all services gracefully
ccprompts_prompt search  # Search and explore prompt library

# Development workflow shortcuts
cclint                   # Run markdown linting pipeline
cctest                   # Execute comprehensive test suites
ccsec                    # Perform security vulnerability scanning
ccval                    # Validate prompt structures and formats
ccpipe                   # Run complete CI/CD pipeline

# Navigation and productivity
workspace               # Navigate to workspace root
prompts                 # Navigate to prompts directory
commands                # Navigate to slash commands directory
```

### **Fish Plugin Ecosystem**

- **Fisher** - Modern plugin manager with auto-updates
- **fzf.fish** - Fuzzy finding integration for files and commands
- **z** - Smart directory jumping based on frequency
- **done** - Desktop notifications for long-running commands
- **nvm.fish** - Node.js version management
- **bass** - Bash utility compatibility layer

## 🔧 MCP (Model Context Protocol) Integration

### **MCP Server Architecture (30 Tools)**

The environment includes 5 specialized MCP servers with exactly 30 tools total:

#### **Server 1: Core Development (8 tools) - Port 9001**

```json
{
  "tools": [
    "read_file",           // File reading with syntax highlighting
    "write_file",          // File writing with backup validation
    "list_directory",      // Directory listing with metadata
    "git_status",          // Comprehensive git repository status
    "git_commit",          // Automated commit message generation
    "run_command",         // System command execution with timeout
    "get_env_vars",        // Secure environment variable access
    "watch_files"          // Real-time file change monitoring
  ]
}
```

#### **Server 2: Database Operations (6 tools) - Port 9002**

```json
{
  "tools": [
    "execute_sql",         // SQL execution with result formatting
    "describe_table",      // Schema analysis and relationships
    "run_migration",       // Database migrations with rollback
    "redis_get",           // Redis retrieval with type detection
    "redis_set",           // Redis storage with TTL options
    "backup_database"      // Database backup with verification
  ]
}
```

#### **Server 3: Infrastructure (6 tools) - Port 9003**

```json
{
  "tools": [
    "docker_ps",           // Container status with detailed info
    "docker_logs",         // Log retrieval with filtering
    "docker_exec",         // Container command execution
    "kubectl_get",         // Kubernetes resource management
    "service_health",      // Development service health checks
    "resource_monitor"     // Performance monitoring
  ]
}
```

#### **Server 4: Testing & QA (5 tools) - Port 9004**

```json
{
  "tools": [
    "run_tests",           // Test execution with coverage
    "lint_code",           // Code linting with auto-fixes
    "security_scan",       // Vulnerability scanning
    "generate_coverage",   // Coverage reporting with visualization
    "validate_config"      // Configuration validation
  ]
}
```

#### **Server 5: API & Web (5 tools) - Port 9005**

```json
{
  "tools": [
    "http_request",        // HTTP requests with auth support
    "test_endpoint",       // API testing with metrics
    "webhook_server",      // Temporary webhook servers
    "proxy_request",       // Request proxying
    "mock_server"          // Mock server creation
  ]
}
```

### **MCP Management Commands**

```bash
# Server lifecycle management
mcp-start               # Initialize all MCP servers
mcp-stop                # Gracefully stop all servers
mcp-status              # Check server health and tool count
mcp-logs                # View real-time server logs
mcp-health              # Comprehensive health check

# Direct tool access (examples)
mcp-read                # Quick file reading via core-dev server
mcp-sql                 # SQL execution via database server
mcp-docker              # Container management via infrastructure
mcp-test                # Test execution via testing server
```

## 📊 Monitoring & Observability

### **Grafana Dashboard Ecosystem**

The environment includes professional monitoring dashboards:

#### **Development Overview Dashboard**

- **System Metrics**: CPU, memory, disk, and network utilization
- **Service Health**: Real-time status of all development services
- **Performance Indicators**: Response times and throughput metrics
- **Resource Allocation**: Container and host resource usage

#### **CCPrompts Performance Dashboard**

- **API Metrics**: Request rates, response times, error rates
- **Command Analytics**: Most used commands and prompt categories
- **Development Metrics**: Pipeline success rates, test coverage
- **User Activity**: Session metrics and feature usage patterns

#### **Security & Compliance Dashboard**

- **Vulnerability Tracking**: Security scan results and trends
- **Access Monitoring**: Authentication and authorization events
- **Compliance Metrics**: Policy adherence and audit trail
- **Threat Detection**: Anomaly detection and alert status

### **Prometheus Monitoring Configuration**

The monitoring stack includes comprehensive metric collection:

```yaml
# Key metric categories
system_metrics:         # CPU, memory, disk, network
application_metrics:    # API performance, error rates
container_metrics:      # Docker resource usage
database_metrics:       # PostgreSQL and Redis performance
development_metrics:    # CI/CD pipeline, test results
business_metrics:       # User activity, feature usage
```

### **Alert Management**

Sophisticated alerting with team-based routing:

- **Critical Alerts**: Immediate notification for system failures
- **Performance Alerts**: Response time and error rate thresholds
- **Security Alerts**: Vulnerability detection and access anomalies
- **Development Alerts**: Pipeline failures and test regressions
- **Resource Alerts**: System resource exhaustion warnings

## 🗄️ Database Development Environment

### **PostgreSQL Advanced Setup**

The development database includes enterprise-grade features:

#### **Schema Organization**

```sql
ccprompts     -- Main application data
analytics     -- Usage metrics and analytics
audit         -- Change tracking and compliance
config        -- Application configuration
testing       -- Development and test data
temp_dev      -- Experimental development schema
```

#### **Advanced Extensions**

```sql
uuid-ossp           -- UUID generation
pg_trgm            -- Advanced text search
btree_gin/gist     -- Enhanced indexing
pgcrypto           -- Cryptographic functions
pg_stat_statements -- Performance monitoring
```

#### **Development Functions**

The database includes custom functions for development productivity:

```sql
get_database_stats()           -- Comprehensive database metrics
analyze_table_performance()    -- Table performance analysis
cleanup_old_audit_logs()      -- Automated audit log maintenance
log_analytics_event()         -- Event tracking for development
get_config_value()            -- Configuration management
```

### **Sample Development Data**

The environment includes realistic sample data for immediate development:

- **Prompts**: 5 sample prompts across different categories
- **Commands**: CCPrompts slash command usage data
- **Users**: Development user profiles with preferences
- **Analytics**: Simulated usage events and metrics
- **Audit Logs**: Sample change tracking data

## 🔒 Security & Compliance Framework

### **Container Security**

- **Non-root execution**: All services run with appropriate user privileges
- **Secret management**: Vault integration for sensitive data
- **Network isolation**: Service-specific network segmentation
- **Image scanning**: Automated vulnerability scanning for all images

### **Access Control & Authentication**

- **Role-based access**: Different access levels for different services
- **API authentication**: Secure API access with token management
- **Database security**: Encrypted connections and access controls
- **Audit logging**: Comprehensive audit trail for all operations

### **Development Security Practices**

- **Pre-commit hooks**: Automated security scanning before commits
- **Dependency scanning**: Continuous monitoring of package vulnerabilities
- **Code analysis**: Static analysis with security rule enforcement
- **Secrets detection**: Automated scanning for exposed credentials

## 🚀 CI/CD Pipeline Integration

### **Dagger.io Pipeline Architecture**

The environment includes a sophisticated CI/CD pipeline with Dagger.io:

#### **Pipeline Stages**

```python
# Available pipeline commands
python3 .devcontainer/dagger.py lint       # Markdown linting
python3 .devcontainer/dagger.py links      # Link validation
python3 .devcontainer/dagger.py security   # Security scanning
python3 .devcontainer/dagger.py validate   # Prompt validation
python3 .devcontainer/dagger.py test       # Command testing
python3 .devcontainer/dagger.py docs       # Documentation generation
python3 .devcontainer/dagger.py full       # Complete pipeline
```

#### **Pipeline Features**

- **Parallel execution**: Multiple stages run concurrently for speed
- **Intelligent caching**: Dependency caching for faster subsequent runs
- **Comprehensive reporting**: Detailed reports for each pipeline stage
- **Integration testing**: Full-stack testing across all components
- **Quality gates**: Automated quality thresholds and blocking conditions

### **Make-based Workflow**

Simplified workflow management through Make targets:

```makefile
make setup              # Complete environment setup
make lint               # Run linting across all files
make test               # Execute comprehensive test suites
make security           # Perform security vulnerability scanning
make validate           # Validate all configurations and structures
make pipeline           # Run complete CI/CD pipeline
make docker-up          # Start all development services
make docker-down        # Stop all services gracefully
make clean              # Clean temporary files and caches
```

## 🌐 Network & Service Discovery

### **NGINX Reverse Proxy Configuration**

The environment includes sophisticated reverse proxy setup:

#### **API Gateway (api.conf)**

- **Load balancing**: Upstream server configuration with health checks
- **Rate limiting**: Configurable rate limits per endpoint type
- **Security headers**: Comprehensive security header injection
- **CORS handling**: Cross-origin request management for development
- **Metrics exposure**: Prometheus metrics endpoint with access control

#### **Frontend Proxy (frontend.conf)**

- **Development mode**: Hot Module Replacement (HMR) support
- **Production mode**: Optimized caching and compression
- **Static assets**: Long-term caching with cache busting
- **Service workers**: Proper handling for Progressive Web Apps

#### **Monitoring Proxy (monitoring.conf)**

- **Service routing**: Intelligent routing to monitoring services
- **WebSocket support**: Real-time updates for dashboards
- **Access control**: Network-based access restrictions
- **SSL termination**: HTTPS handling for production-like testing

#### **Security Configuration (security.conf)**

- **Rate limiting**: Multi-tier rate limiting by endpoint and user
- **Attack prevention**: Common attack pattern blocking
- **Access logging**: Comprehensive request logging for analysis
- **IP filtering**: Whitelist/blacklist functionality

## 🛠️ Development Workflow Optimization

### **Lifecycle Script Automation**

The environment includes comprehensive lifecycle automation:

#### **on-create.sh** - Initial Environment Setup

- **Package updates**: Latest development tools and dependencies
- **Shell configuration**: Fish shell with plugins and themes
- **Development tools**: Language-specific toolchain installation
- **Git configuration**: Optimized git settings and hooks
- **Environment variables**: Development-specific configuration

#### **post-create.sh** - Post-Creation Configuration

- **Project dependencies**: Installation of project-specific packages
- **Database setup**: Schema creation and sample data loading
- **Service configuration**: Development service initialization
- **Git hooks**: Pre-commit hooks and commit message templates
- **VS Code setup**: Extension installation and workspace configuration

#### **update-content.sh** - Continuous Updates

- **Package updates**: Automated updating of all development tools
- **Plugin updates**: Fish shell and editor plugin updates
- **Security updates**: Critical security patch installation
- **Cache cleanup**: Removal of outdated caches and temporary files

#### **post-start.sh** - Startup Optimization

- **Service health checks**: Verification of all service availability
- **Environment validation**: Configuration and dependency verification
- **Performance monitoring**: Resource usage assessment
- **Development status**: Git status and project health overview

## 📚 Advanced Usage Patterns

### **Multi-Container Development**

The environment supports complex multi-service development:

```bash
# Start specific service groups
docker-compose up -d postgres redis        # Database services only
docker-compose up -d grafana prometheus    # Monitoring stack only
docker-compose up -d nginx                 # Reverse proxy only

# Scale services for load testing
docker-compose up -d --scale api=3         # Scale API service
docker-compose up -d --scale worker=5      # Scale background workers

# Service-specific operations
docker-compose exec postgres psql -U developer -d ccprompts_dev
docker-compose exec redis redis-cli
docker-compose logs -f grafana
```

### **Advanced Fish Shell Workflows**

Leverage Fish shell's advanced features for productivity:

```fish
# Smart directory navigation with z
z prompts              # Jump to prompts directory based on frequency
z doc                  # Jump to most-used documentation directory

# Fuzzy finding integration
Ctrl+R                 # Fuzzy search command history
Ctrl+T                 # Fuzzy find files in current directory
Alt+C                  # Fuzzy find and cd to directory

# Abbreviation expansion
git sta[TAB]           # Expands to 'git status'
dc up[TAB]             # Expands to 'docker-compose up -d'
k get pods[TAB]        # Expands to 'kubectl get pods'

# Custom function chaining
ccprompts_status | grep -E "(Error|Warning|Critical)"
ccprompts_services status | jq '.services[] | select(.health != "healthy")'
```

### **Database Development Workflows**

Advanced database operations for development:

```sql
-- Performance analysis
SELECT * FROM get_database_stats();
SELECT * FROM analyze_table_performance('ccprompts');

-- Configuration management
SELECT get_config_value('debug_mode', 'false');
SELECT set_config_value('cache_ttl', '3600', 'Cache TTL in seconds');

-- Analytics and monitoring
SELECT * FROM get_analytics_summary(7);  -- Last 7 days
SELECT * FROM monitoring.database_health;

-- Development utilities
SELECT cleanup_old_audit_logs(30);       -- Keep 30 days
SELECT log_analytics_event('user_action', '{"action": "test"}');
```

## 🔍 Troubleshooting & Debugging

### **Common Issues & Solutions**

#### **Service Startup Issues**

```bash
# Check service health
ccprompts_services status
docker-compose ps
docker-compose logs [service_name]

# Restart specific services
docker-compose restart postgres
docker-compose restart grafana

# Rebuild containers if needed
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### **MCP Server Issues**

```bash
# Check MCP server status
mcp-status
mcp-health

# View server logs
mcp-logs
tail -f /workspace/.devcontainer/logs/mcp/*.log

# Restart MCP servers
mcp-stop
mcp-start
```

#### **Database Connection Issues**

```bash
# Test database connectivity
docker-compose exec postgres pg_isready -U developer
psql -h localhost -U developer -d ccprompts_dev -c "SELECT 1;"

# Check database logs
docker-compose logs postgres

# Reset database if needed
docker-compose down postgres
docker volume rm ccprompts_postgres-data
docker-compose up -d postgres
```

#### **Network Connectivity Issues**

```bash
# Check port availability
netstat -tlnp | grep -E "(3000|9090|5432|6379)"

# Test service endpoints
curl -f http://localhost:3000/api/health
curl -f http://localhost:9090/-/healthy
curl -f http://localhost:9001/health

# Check NGINX configuration
nginx -t
docker-compose exec nginx nginx -s reload
```

### **Performance Optimization**

#### **Container Resource Optimization**

```bash
# Monitor resource usage
docker stats
ccprompts_services status

# Optimize container limits
# Edit docker-compose.yml to adjust memory/CPU limits
# Example:
# deploy:
#   resources:
#     limits:
#       memory: 512M
#       cpus: '0.5'
```

#### **Database Performance Tuning**

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM ccprompts.prompts WHERE category = 'development';

-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE relname = 'prompts';

-- Monitor slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

## 🎯 Best Practices

### **Development Workflow**

1. **Always start with environment status**: Run `ccprompts_status` before beginning work
2. **Use MCP tools for file operations**: Leverage the 30-tool MCP ecosystem for efficiency
3. **Monitor resource usage**: Keep an eye on system resources during development
4. **Leverage Fish shell features**: Use abbreviations and custom functions for productivity
5. **Run health checks regularly**: Use `mcp-health` and service status checks

### **Security Practices**

1. **Never commit secrets**: Use Vault for sensitive data management
2. **Run security scans regularly**: Use `ccsec` command for vulnerability scanning
3. **Keep dependencies updated**: Use `ccprompts_update` for maintenance
4. **Monitor audit logs**: Review audit trails for security events
5. **Use proper access controls**: Leverage role-based access for different services

### **Performance Guidelines**

1. **Monitor database performance**: Use built-in performance analysis functions
2. **Optimize container resource allocation**: Adjust limits based on usage patterns
3. **Leverage caching effectively**: Use Redis for appropriate caching strategies
4. **Monitor network traffic**: Keep an eye on service-to-service communication
5. **Use monitoring dashboards**: Leverage Grafana for performance insights

## 📈 Advanced Monitoring & Analytics

### **Custom Metrics Collection**

The environment supports custom metrics for development insights:

```python
# Example: Custom metrics in your application
from prometheus_client import Counter, Histogram, Gauge

# Command execution metrics
command_executions = Counter('ccprompts_command_executions_total', 
                            'Total command executions', ['command', 'status'])

# Prompt usage metrics  
prompt_usage = Counter('ccprompts_prompt_usage_total',
                      'Total prompt usage', ['category', 'user'])

# Performance metrics
response_time = Histogram('ccprompts_response_time_seconds',
                         'Response time for operations', ['operation'])

# Active development sessions
active_sessions = Gauge('ccprompts_active_sessions',
                       'Number of active development sessions')
```

### **Business Intelligence Dashboard**

Create custom dashboards for development insights:

```sql
-- Development productivity metrics
CREATE VIEW development_productivity AS
SELECT 
    DATE(timestamp) as date,
    COUNT(DISTINCT user_id) as active_developers,
    COUNT(*) FILTER (WHERE event_type = 'command_used') as commands_executed,
    COUNT(*) FILTER (WHERE event_type = 'prompt_created') as prompts_created,
    AVG(EXTRACT(EPOCH FROM session_duration)) as avg_session_duration
FROM analytics.events 
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Feature adoption tracking
CREATE VIEW feature_adoption AS
SELECT 
    event_data->>'feature' as feature_name,
    COUNT(*) as usage_count,
    COUNT(DISTINCT user_id) as unique_users,
    DATE(timestamp) as date
FROM analytics.events 
WHERE event_type = 'feature_used'
GROUP BY feature_name, DATE(timestamp)
ORDER BY usage_count DESC;
```

## 🔮 Future Enhancements

### **Planned Improvements**

1. **AI-Powered Development Assistant**: Integration with Claude Code for intelligent development assistance
2. **Advanced Service Mesh**: Istio integration for microservice development
3. **Machine Learning Pipeline**: MLflow integration for ML model development
4. **Advanced Security Scanning**: Integration with additional security tools
5. **Performance Profiling**: Advanced profiling tools for optimization

### **Extensibility Framework**

The environment is designed for easy extension:

```yaml
# Example: Adding new MCP server
new_mcp_server:
  name: "ai-assistant"
  port: 9006
  tools: 8
  description: "AI-powered development assistance"
  capabilities:
    - code_generation
    - documentation_creation
    - test_generation
    - refactoring_suggestions
    - performance_optimization
    - security_analysis
    - architecture_design
    - best_practice_recommendations
```

---

**This development environment represents the pinnacle of modern development container technology, providing Claude Code with unparalleled capabilities for productive, secure, and monitored development workflows. Every component is optimized for performance, security, and developer experience.**

## 📞 Support & Resources

### **Environment Health Monitoring**

- **Status Dashboard**: `ccprompts_status` for comprehensive overview
- **Service Health**: `ccprompts_services status` for service-specific status
- **MCP Servers**: `mcp-status` for tool availability
- **System Resources**: Grafana dashboards for real-time monitoring

### **Documentation References**

- **Main Project Guide**: `/workspace/CLAUDE.md`
- **Command Ecosystem**: `/workspace/.claude/README.md`
- **Prompt Library**: `/workspace/prompts/INDEX.md`
- **SDK Reference**: `/workspace/CC-SDK-Guide.md`

### **Emergency Procedures**

1. **Complete Environment Reset**: `docker-compose down -v && docker-compose up -d`
2. **Service Recovery**: `ccprompts_services stop && ccprompts_services start`
3. **Database Recovery**: Use database backup functions and restore procedures
4. **Configuration Restore**: Git reset to last known good configuration

This development environment is your comprehensive platform for building, testing, and deploying the CCPrompts ecosystem with enterprise-grade reliability and security.
