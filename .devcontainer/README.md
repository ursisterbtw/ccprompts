# CCPrompts Development Container

This directory contains a highly optimized development container setup for the CCPrompts project, featuring Docker, Dagger.io, and comprehensive development tools.

## 🚀 Features

### **Multi-Stage Docker Build**
- Optimized Ubuntu 22.04 base with multi-stage builds
- Pre-installed development languages: Python, Node.js, Rust, Go
- Essential CLI tools: git, docker, kubectl, terraform, dagger
- Configured for non-root development with proper permissions

### **Comprehensive Tool Integration**
- **Languages**: Python 3.12, Node.js 20, Rust, Go 1.21+
- **Package Managers**: npm, pip, uv, cargo, apt
- **Development Tools**: VS Code extensions, Oh My Zsh, git hooks
- **Monitoring**: Prometheus, Grafana, Jaeger tracing
- **Databases**: PostgreSQL, Redis, Elasticsearch
- **Storage**: MinIO object storage
- **Security**: Vault secrets management, SonarQube code analysis

### **Dagger.io CI/CD Pipeline**
- Automated markdown linting and link checking
- Security scanning with multiple tools
- Prompt structure validation
- Command accessibility testing
- Documentation generation
- Parallel execution and caching

## 📁 Directory Structure

```
.devcontainer/
├── Dockerfile                 # Multi-stage development container
├── devcontainer.json         # VS Code devcontainer configuration
├── docker-compose.yml        # Multi-service development stack
├── dagger.py                 # Dagger.io pipeline orchestrator
├── dagger.json               # Dagger configuration
├── scripts/                  # Lifecycle automation scripts
│   ├── on-create.sh         # Initial container setup
│   ├── post-create.sh       # Post-creation configuration
│   ├── update-content.sh    # Content and dependency updates
│   └── post-start.sh        # Container startup tasks
├── monitoring/               # Monitoring configuration
│   ├── prometheus.yml       # Prometheus configuration
│   └── grafana/             # Grafana dashboards and datasources
├── nginx/                   # Reverse proxy configuration
│   ├── nginx.conf          # Main nginx configuration
│   └── conf.d/             # Service-specific configurations
└── init-scripts/           # Database initialization scripts
```

## 🛠️ Quick Start

### **Option 1: VS Code DevContainer**
1. Open the project in VS Code
2. Install the "Remote - Containers" extension
3. Press `Ctrl+Shift+P` and select "Reopen in Container"
4. Wait for the container to build and initialize

### **Option 2: Docker Compose**
```bash
# Start all services
cd .devcontainer
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### **Option 3: Standalone Dagger**
```bash
# Install Dagger CLI
curl -L https://dl.dagger.io/dagger/install.sh | sh

# Run pipeline commands
python3 .devcontainer/dagger.py lint
python3 .devcontainer/dagger.py security
python3 .devcontainer/dagger.py full
```

## 🔧 Available Commands

### **Development Commands**
```bash
# Quick aliases (available in shell)
ccprompts-lint      # Run markdown linting
ccprompts-test      # Run command tests
ccprompts-security  # Run security scan
ccprompts-validate  # Validate prompt structures
ccprompts-pipeline  # Run full CI/CD pipeline

# Make targets
make help           # Show all available commands
make setup          # Set up development environment
make lint           # Run linting
make test           # Run tests
make security       # Run security scan
make validate       # Validate structures
make pipeline       # Run full pipeline
make docker-up      # Start Docker services
make docker-down    # Stop Docker services
```

### **Dagger Pipeline Commands**
```bash
python3 .devcontainer/dagger.py lint       # Markdown linting
python3 .devcontainer/dagger.py links      # Link checking
python3 .devcontainer/dagger.py security   # Security scanning
python3 .devcontainer/dagger.py validate   # Prompt validation
python3 .devcontainer/dagger.py test       # Command testing
python3 .devcontainer/dagger.py docs       # Documentation generation
python3 .devcontainer/dagger.py full       # Complete pipeline
```

## 🌐 Available Services

When using docker-compose, the following services are available:

| Service | URL | Credentials | Description |
|---------|-----|-------------|-------------|
| Grafana | http://localhost:3000 | admin/admin | Metrics visualization |
| Prometheus | http://localhost:9090 | - | Metrics collection |
| MinIO | http://localhost:9001 | minioadmin/minioadmin | Object storage |
| Adminer | http://localhost:8080 | - | Database administration |
| Jaeger | http://localhost:16686 | - | Distributed tracing |
| SonarQube | http://localhost:9001 | admin/admin | Code quality analysis |
| Vault | http://localhost:8200 | dev-root-token | Secrets management |
| PostgreSQL | localhost:5432 | developer/devpass | Primary database |
| Redis | localhost:6379 | - | Caching and sessions |
| Elasticsearch | localhost:9200 | - | Search functionality |

## ⚙️ Configuration

### **Environment Variables**
Copy `.env.example` to `.env` and customize:

```bash
# Database
DATABASE_URL=postgresql://developer:devpass@postgres:5432/ccprompts_dev

# Redis
REDIS_URL=redis://redis:6379

# API Keys
GITHUB_TOKEN=your_github_token
DAGGER_CLOUD_TOKEN=your_dagger_token

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

### **VS Code Customization**
The devcontainer includes extensive VS Code configuration:
- 30+ pre-installed extensions
- Optimized settings for all supported languages
- Integrated debugging and testing
- Git integration with commit signing
- Terminal customization with Zsh

### **Security Features**
- Non-root user execution
- Docker socket mounting for Docker-in-Docker
- Secrets management with Vault
- Security scanning with multiple tools
- Pre-commit hooks for quality gates

## 🚀 Advanced Usage

### **Custom Dagger Functions**
Add custom functions to `dagger.py`:

```python
async def custom_workflow(self) -> bool:
    """Custom development workflow."""
    container = self.mount_source(self.get_base_container())
    
    # Your custom logic here
    result = await container.with_exec(["your-command"]).stdout()
    
    return True
```

### **Adding Services**
Extend `docker-compose.yml` with additional services:

```yaml
  your-service:
    image: your-image:latest
    ports:
      - "9999:9999"
    environment:
      - CONFIG=value
    depends_on:
      - postgres
```

### **Custom Lifecycle Scripts**
Modify scripts in the `scripts/` directory:
- `on-create.sh`: Initial setup
- `post-create.sh`: Post-creation configuration
- `update-content.sh`: Dependency updates
- `post-start.sh`: Startup tasks

## 🔍 Monitoring and Observability

### **Metrics Collection**
- Prometheus scrapes metrics from all services
- Custom metrics can be added via `/metrics` endpoints
- Grafana dashboards for visualization

### **Distributed Tracing**
- Jaeger for request tracing
- OpenTelemetry integration
- Performance monitoring

### **Logging**
- Centralized logging with structured formats
- Log aggregation across all services
- Development session tracking

## 🛡️ Security Considerations

### **Container Security**
- Non-root user execution
- Minimal attack surface
- Regular security updates
- Secrets management with Vault

### **Code Security**
- Automated security scanning
- Dependency vulnerability checks
- Pre-commit security hooks
- SAST/DAST integration

### **Network Security**
- Service isolation with Docker networks
- Reverse proxy with nginx
- TLS termination ready
- Environment-based configuration

## 🤝 Contributing

To contribute to the development environment:

1. Test changes locally with `make test`
2. Run security scan with `make security`
3. Validate all configurations
4. Update documentation as needed
5. Submit pull request with pipeline passing

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Dagger.io Documentation](https://docs.dagger.io/)
- [VS Code DevContainers](https://code.visualstudio.com/docs/remote/containers)
- [CCPrompts Project Documentation](../README.md)

---

**This development environment represents a production-ready, enterprise-grade setup for modern software development with comprehensive tooling, monitoring, and automation.**