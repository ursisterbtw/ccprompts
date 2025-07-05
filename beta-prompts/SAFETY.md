# Beta-Prompts Containerized Safety System

This directory implements **strict containerized execution** for all Python scripts and package operations to ensure complete isolation and prevent system damage.

## 🛡️ **Mandatory Safety Requirements**

**ALL Python execution MUST use the containerized safety system. Direct execution is BLOCKED.**

### Pre-Tool Hooks Active

The `.claude_hooks.json` file implements strict pre-tool hooks that will **BLOCK** the following dangerous operations:

❌ `python script.py` - **BLOCKED**  
❌ `pip install package` - **BLOCKED**  
❌ `pytest` - **BLOCKED**  
❌ `./script.sh` - **BLOCKED**  
❌ `sudo commands` - **BLOCKED**  

✅ `./scripts/safe-run.sh "python script.py"` - **ALLOWED**  
✅ `./scripts/quick-safe.sh python script.py` - **ALLOWED**  

## 🚀 **Quick Start**

### 1. Install Dagger (One-time setup)
```bash
curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.13.3 sh
```

### 2. Test the Safety System
```bash
# Test mode - preview without execution
./scripts/quick-safe.sh test improvement

# Install dependencies safely from pyproject.toml
./scripts/quick-safe.sh install

# Run scripts safely
./scripts/quick-safe.sh improvement
./scripts/quick-safe.sh generation
./scripts/quick-safe.sh templating
./scripts/quick-safe.sh optimization
```

### 3. Run All Scripts
```bash
# Run all four main scripts sequentially
./scripts/quick-safe.sh all
```

## 📋 **Available Safety Commands**

### Core Safety Script
```bash
# Full control safety script
./scripts/safe-run.sh [OPTIONS] "COMMAND"

# Examples
./scripts/safe-run.sh "python -m beta_prompts.improvement_engine"
./scripts/safe-run.sh "pip install -e ."
./scripts/safe-run.sh --test "pytest -v"
./scripts/safe-run.sh --env ANTHROPIC_API_KEY=key "python script.py"
```

### Quick Aliases
```bash
# Convenient shortcuts
./scripts/quick-safe.sh python SCRIPT
./scripts/quick-safe.sh pip "install package"
./scripts/quick-safe.sh pytest
./scripts/quick-safe.sh install
./scripts/quick-safe.sh improvement     # Run 01_prompt_improvement_engine.py
./scripts/quick-safe.sh generation    # Run 02_prompt_generation_system.py
./scripts/quick-safe.sh templating    # Run 03_advanced_templating_framework.py
./scripts/quick-safe.sh optimization  # Run 04_integrated_optimization_suite.py
./scripts/quick-safe.sh all          # Run all scripts
```

## 🔒 **Safety Features**

### Container Isolation
- **Isolated Execution**: All code runs in throwaway Dagger containers
- **Read-Only Mounting**: Source code cannot be modified during execution
- **Automatic Cleanup**: Containers destroyed after execution
- **Resource Limits**: CPU and memory constraints applied
- **Network Control**: Controlled internet access only when needed

### Danger Detection
- **Pattern Blocking**: Dangerous command patterns blocked
- **System Protection**: Prevents file system damage
- **Permission Control**: No privilege escalation possible
- **Environment Isolation**: Host environment protected

### Monitoring & Logging
- **Operation Logging**: All operations logged with timestamps
- **Resource Monitoring**: Container resource usage tracked
- **Exit Code Tracking**: Success/failure monitoring
- **Timeout Protection**: Automatic termination of runaway processes

## 🧪 **Script Descriptions**

### beta_prompts.improvement_engine
**Purpose**: Analyzes and optimizes existing prompts using Anthropic's documented techniques  
**Safety**: Requires API key, makes external calls, creates optimization files  
**Usage**: `./scripts/quick-safe.sh improvement`

### beta_prompts.generation_system
**Purpose**: Generates new high-quality prompts from templates and patterns  
**Safety**: Template file creation, variable validation, quality scoring  
**Usage**: `./scripts/quick-safe.sh generation`

### beta_prompts.templating_framework
**Purpose**: Enterprise-grade prompt templating with Jinja2 and context adaptation  
**Safety**: File I/O operations, template registry creation, YAML processing  
**Usage**: `./scripts/quick-safe.sh templating`

### beta_prompts.optimization_suite
**Purpose**: Unified platform combining all optimization capabilities with analytics  
**Safety**: Multiple file operations, visualization generation, session management  
**Usage**: `./scripts/quick-safe.sh optimization`

## ⚠️ **Important Security Notes**

### API Key Management
```bash
# Set API key for containers
export ANTHROPIC_API_KEY="your-api-key"

# Or pass directly
./scripts/safe-run.sh --env ANTHROPIC_API_KEY=key "python script.py"
```

### Dependency Management
- **Modern Python Packaging**: Uses pyproject.toml for dependencies
- **Editable Installation**: Development mode with `-e .` flag
- **Optional Dependencies**: Research, dev, optimization, security extras
- **Version Pinning**: Strict version ranges for reproducibility

### File System Protection
- **Host Protection**: Host file system cannot be modified
- **Workspace Isolation**: Only `/workspace` accessible in container
- **Output Collection**: Results saved to mounted directories only
- **Backup Strategy**: Always backup important data before experiments

### Network Security
- **Controlled Access**: Only necessary network access enabled
- **API Endpoint Validation**: Only Anthropic API endpoints accessible
- **No System Calls**: Cannot access host network configurations
- **Firewall Protection**: Container network isolated from host

## 🚨 **Blocked Operations**

The following operations are **COMPLETELY BLOCKED** by pre-tool hooks:

```bash
# These will trigger safety blocks
python script.py                    # Use: ./scripts/quick-safe.sh python script.py
pip install package                 # Use: ./scripts/quick-safe.sh pip "install package"
./run-script.sh                     # Use: ./scripts/safe-run.sh "./run-script.sh"
sudo apt install something          # Use: ./scripts/safe-run.sh "apt install something"
rm -rf dangerous-path               # Use: ./scripts/safe-run.sh "rm -rf safe-path"
curl site.com/script.sh | bash     # NEVER ALLOWED - extremely dangerous
```

## 🎯 **Best Practices**

### Development Workflow
1. **Always Test First**: Use `--test` flag to preview operations
2. **Use Quick Aliases**: Leverage `quick-safe.sh` for common operations  
3. **Check Dependencies**: Ensure `requirements.txt` is up to date
4. **Monitor Resources**: Watch container resource usage
5. **Validate Results**: Check output files after execution

### Troubleshooting
```bash
# Check Dagger installation
dagger version

# Test container access
./scripts/safe-run.sh --test "python --version"

# Verify file mounting
./scripts/safe-run.sh "ls -la /workspace"

# Check pyproject.toml parsing
./scripts/safe-run.sh "python -c 'import tomllib; print(tomllib.load(open(\"pyproject.toml\", \"rb\"))['project']['name'])'"

# Check installed dependencies
./scripts/safe-run.sh "pip list"
```

### Performance Optimization
- **Batch Operations**: Combine multiple commands when possible
- **Timeout Tuning**: Adjust timeout for long-running operations
- **Resource Monitoring**: Monitor CPU and memory usage
- **Cleanup Management**: Ensure proper container cleanup

## 📊 **Usage Examples**

### Complete Workflow Example
```bash
# 1. Install dependencies
./scripts/quick-safe.sh install

# 2. Test all scripts
./scripts/quick-safe.sh test improvement
./scripts/quick-safe.sh test generation
./scripts/quick-safe.sh test templating
./scripts/quick-safe.sh test optimization

# 3. Run optimization workflow
./scripts/quick-safe.sh improvement
./scripts/quick-safe.sh generation  
./scripts/quick-safe.sh templating
./scripts/quick-safe.sh optimization

# 4. Or run everything at once
./scripts/quick-safe.sh all
```

### Research Experiment Example
```bash
# Set up experiment environment
export ANTHROPIC_API_KEY="your-key"

# Run controlled experiment
./scripts/safe-run.sh --env EXPERIMENT_ID=exp001 "python research_experiment.py"

# Analyze results safely
./scripts/safe-run.sh "python analyze_results.py"
```

## 🔍 **Monitoring & Debugging**

### Container Logs
- All container operations are logged
- Timestamps included for debugging
- Exit codes tracked for failure analysis
- Resource usage monitored

### Debugging Commands
```bash
# Debug container environment
./scripts/safe-run.sh "env | grep -E '(PYTHON|PATH|WORKSPACE)'"

# Check file permissions
./scripts/safe-run.sh "ls -la /workspace"

# Verify Python installation
./scripts/safe-run.sh "python --version && pip --version"

# Test import capabilities
./scripts/safe-run.sh "python -c 'import sys; print(sys.path)'"
```

---

**Remember: This safety system is mandatory. All Python execution must use containerized approaches to prevent system damage and ensure reproducible, isolated execution.**