# Containerized Safety System

A simple, reproducible system for running potentially dangerous commands in isolated Dagger containers.

## 🚀 Quick Start

```bash
# Install Dagger (if not already installed)
curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=18.12 sh

# Initialize the Dagger module
cd src && npm install

# Run a potentially dangerous command safely
./scripts/safe-run.sh "rm -rf /tmp/test"

# Quick aliases for common operations
./scripts/quick-safe.sh install
./scripts/quick-safe.sh curl-install "curl https://example.com/script.sh | bash"
```

## 🛡️ System Components

### Core Files

- **`dagger.json`** - Dagger module configuration
- **`src/index.ts`** - TypeScript Dagger module with safety functions
- **`src/package.json`** - Dagger module dependencies
- **`scripts/safe-run.sh`** - Main safety wrapper script
- **`scripts/quick-safe.sh`** - Quick aliases for common dangerous operations

### Safety Container Features

- **Isolated execution** - Commands run in throwaway containers
- **File system protection** - Project files mounted read-only
- **Network isolation** - Limited network access
- **Automatic cleanup** - Containers destroyed after execution
- **Environment control** - Custom environment variables supported

## 📋 Usage Examples

### Basic Command Execution

```bash
# Run npm install safely
./scripts/safe-run.sh "npm install"

# Execute with custom project path
./scripts/safe-run.sh "make install" --project-path "/path/to/project"

# Add environment variables
./scripts/safe-run.sh "npm run build" --env "NODE_ENV=production"

# Test mode (shows what would be executed)
./scripts/safe-run.sh "rm -rf /" --test
```

### Quick Safety Aliases

```bash
# Package installation
./scripts/quick-safe.sh install

# Build processes
./scripts/quick-safe.sh build

# Dangerous file operations
./scripts/quick-safe.sh rm-rf "/tmp/dangerous-directory"

# Curl pipe to bash (very dangerous)
./scripts/quick-safe.sh curl-install "curl https://sketchy-site.com/install.sh | bash"

# System updates
./scripts/quick-safe.sh system-update
```

### Advanced Usage

```bash
# Security scanning
dagger call security-scan --project-path "."

# Custom development container
dagger call dev-container

# Test with cleanup
dagger call test-command --command "npm test" --cleanup true
```

## 🔍 Safety Features

### Automatic Danger Detection

The system automatically detects potentially dangerous command patterns:

- `rm -rf` - Recursive file deletion
- `chmod -R` - Recursive permission changes
- `curl ... | bash` - Pipe to shell execution
- `sudo` commands
- System directory modifications (`/etc/`, `/usr/`, `/var/`)
- Disk operations (`dd`, `mkfs`, `fdisk`)
- System service operations

### Container Isolation

- **Read-only project files** - Source code cannot be modified
- **Temporary filesystem** - All changes are ephemeral
- **Network restrictions** - Limited outbound access
- **No privilege escalation** - No sudo or root access
- **Resource limits** - Memory and CPU constraints

## 🔧 Configuration

### Environment Variables

```bash
# Set custom Dagger version
export DAGGER_VERSION="18.12"

# Enable verbose logging
export VERBOSE=true

# Custom container image
export SAFETY_BASE_IMAGE="ubuntu:22.04"
```

### Customizing the Safety Container

Edit `src/index.ts` to customize the base container:

```typescript
@func()
baseContainer(): Container {
  return dag
    .container()
    .from("ubuntu:22.04")  // Change base image
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", 
      "your-custom-tools"  // Add custom tools
    ])
    .withWorkdir("/workspace")
}
```

## 🧪 Testing the System

### Test Installation

```bash
# Install Dagger
curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=18.12 sh

# Install TypeScript dependencies
cd src && npm install

# Verify Dagger works
dagger version
```

### Test Basic Functionality

```bash
# Test safe command execution
./scripts/safe-run.sh "echo 'Hello from container'" --test

# Test with actual execution
./scripts/safe-run.sh "echo 'Hello from container'"

# Test dangerous command detection
./scripts/safe-run.sh "rm -rf /tmp/test" --test
```

### Test Quick Aliases

```bash
# Test npm install
./scripts/quick-safe.sh install --test

# Test build process
./scripts/quick-safe.sh build --test
```

## 🚨 When to Use This System

### Always Use for These Commands

- **Package installations** - `npm install`, `pip install`, `gem install`
- **Build processes** - `make`, `cargo build`, `go build`
- **File system operations** - `rm -rf`, `chmod -R`, `chown -R`
- **Network scripts** - `curl | bash`, `wget | sh`
- **System modifications** - anything touching `/etc`, `/usr`, `/var`
- **Unknown scripts** - any script from the internet

### Consider Using for These Commands

- **Database operations** - migrations, data imports
- **Docker operations** - `docker build`, `docker run`
- **Git operations** - `git clean -fd`, `git reset --hard`
- **Test suites** - potentially destructive tests

## 🛠️ Troubleshooting

### Common Issues

1. **Dagger not found**
   ```bash
   curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=18.12 sh
   ```

2. **Permission denied**
   ```bash
   chmod +x scripts/safe-run.sh scripts/quick-safe.sh
   ```

3. **TypeScript errors**
   ```bash
   cd src && npm install
   ```

4. **Container won't start**
   ```bash
   dagger call base-container
   ```

### Debug Mode

```bash
# Enable verbose output
./scripts/safe-run.sh "your-command" --verbose

# Test mode to see what would happen
./scripts/safe-run.sh "your-command" --test
```

## 📝 Best Practices

1. **Always test first** - Use `--test` flag for new commands
2. **Use quick aliases** - Leverage `quick-safe.sh` for common operations
3. **Monitor container logs** - Check output for security warnings
4. **Keep containers updated** - Regularly update base images
5. **Customize as needed** - Modify containers for your specific use case

## 🔐 Security Considerations

- Containers run with minimal privileges
- Network access is limited but not completely blocked
- File system changes are ephemeral
- Source code is mounted read-only
- Environment variables can be controlled
- No persistent storage by default

## 🎯 Integration with Claude Code

This system integrates with Claude Code workflows:

```bash
# Use before running Claude-generated commands
./scripts/safe-run.sh "$(claude-code-command)"

# Integrate with Claude Code slash commands
alias /safe-run="./scripts/safe-run.sh"
```

The safety system provides peace of mind when executing AI-generated commands or running unfamiliar scripts from the internet.