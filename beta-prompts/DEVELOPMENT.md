# Development Guide for Beta-Prompts

## 🚀 Modern Python Development Setup

This project uses cutting-edge Python development tools for maximum code quality, security, and maintainability.

### ⚡ Quick Start

```bash
# Clone and setup
git clone <repository>
cd beta-prompts

# Complete development setup
make dev-setup

# Verify everything works
make dev-check
```

## 🛠️ Development Tools Stack

### **Core Tools**

| Tool | Purpose | Why We Use It |
|------|---------|---------------|
| **Ruff** | Ultra-fast linting & formatting | 10-100x faster than existing tools |
| **MyPy** | Static type checking | Catch bugs before runtime |
| **Black** | Code formatting | Consistent code style |
| **Sourcery** | AI-powered code review | Advanced refactoring suggestions |

### **Security & Quality**

| Tool | Purpose | Coverage |
|------|---------|----------|
| **Bandit** | Security vulnerability scanning | Python security issues |
| **Safety** | Dependency vulnerability checking | Known CVEs in dependencies |
| **Semgrep** | Advanced static analysis | Complex security patterns |
| **Vulture** | Dead code detection | Unused code elimination |

### **Documentation & Standards**

| Tool | Purpose | Benefit |
|------|---------|---------|
| **Interrogate** | Docstring coverage | Ensure comprehensive documentation |
| **Darglint** | Docstring style checking | Google-style docstring compliance |
| **Commitizen** | Conventional commits | Standardized commit messages |

## 📋 Development Workflow

### **Daily Development**

```bash
# Format and fix issues
make q-fix

# Quick quality check
make q-check

# Run specific checks
make lint
make type-check
make security
```

### **Pre-commit Integration**

```bash
# Setup hooks (run once)
make setup-hooks

# Manually run all hooks
make pre-commit

# Update hook versions
make pre-commit-update
```

### **Comprehensive Quality Assurance**

```bash
# Full quality suite
make dev-check

# Individual tool runs
make ruff           # Fast linting
make mypy           # Type checking  
make bandit         # Security scan
make sourcery       # AI review
```

## 🔧 Tool Configurations

### **Ruff Configuration**

Located in `pyproject.toml`:

```toml
[tool.ruff]
target-version = "py39"
line-length = 100
select = [
    "A",    # flake8-builtins
    "B",    # flake8-bugbear
    "C",    # flake8-comprehensions
    "E",    # pycodestyle Error
    "F",    # Pyflakes
    "I",    # isort
    "N",    # pep8-naming
    "S",    # flake8-bandit
    "UP",   # pyupgrade
    # ... and many more
]
```

**Key Features:**
- ✅ 100+ rules enabled
- ✅ Auto-fixing capabilities
- ✅ Import sorting integrated
- ✅ Security checks included

### **MyPy Configuration**

Strict type checking enabled:

```toml
[tool.mypy]
strict = true
warn_return_any = true
disallow_untyped_defs = true
show_error_codes = true
```

**Benefits:**
- 🔍 Catch type errors early
- 📚 Better IDE support
- 🛡️ Runtime error prevention
- 📖 Self-documenting code

### **Sourcery Integration**

AI-powered code improvements:

```toml
[tool.sourcery]
rules = ["default", "gpsg", "pep8"]
github_sourcery_teammate = true
refactor = {
    simplify_conditional_assignments = true,
    merge_duplicate_blocks = true,
    remove_redundant_fstring = true,
}
```

**Capabilities:**
- 🤖 AI-powered refactoring
- 🎯 Performance optimizations
- 🧹 Code simplification
- 📈 Maintainability improvements

## 📊 Code Quality Metrics

### **Coverage Requirements**

- **Unit Tests**: ≥ 90%
- **Integration Tests**: ≥ 80%
- **Docstring Coverage**: ≥ 80%
- **Type Coverage**: 100% (strict mode)

### **Security Standards**

- **Bandit**: No high-severity issues
- **Safety**: No known vulnerabilities
- **Semgrep**: No security anti-patterns

### **Performance Standards**

- **Ruff**: < 1s for full codebase
- **MyPy**: < 10s for incremental checks
- **Test Suite**: < 30s for full run

## 🔄 Continuous Integration

### **Pre-commit Hooks**

Automatically run on every commit:

1. **Ruff** - Linting and formatting
2. **MyPy** - Type checking
3. **Bandit** - Security scanning
4. **File validation** - Syntax and formatting
5. **Conventional commits** - Message format

### **CI Pipeline**

GitHub Actions workflow:

```yaml
- name: Lint with Ruff
  run: ruff check . --output-format=github

- name: Type check with MyPy  
  run: mypy beta_prompts/

- name: Security scan
  run: bandit -r beta_prompts/ -f json
```

## 🎯 Best Practices

### **Type Hints**

```python
# ✅ Good - Comprehensive type hints
def process_data(
    items: list[dict[str, Any]], 
    config: Config | None = None
) -> ProcessResult:
    """Process data with proper typing."""
    ...

# ❌ Avoid - Missing type information  
def process_data(items, config=None):
    ...
```

### **Error Handling**

```python
# ✅ Good - Specific exceptions with context
try:
    result = api_call()
except APIError as e:
    raise ProcessingError(f"API call failed: {e}") from e

# ❌ Avoid - Bare except clauses
try:
    result = api_call()
except:
    pass
```

### **Security Practices**

```python
# ✅ Good - Safe file operations
from pathlib import Path

def read_config(path: Path) -> dict[str, Any]:
    """Read configuration safely."""
    if not path.exists():
        raise FileNotFoundError(f"Config not found: {path}")
    
    with path.open() as f:
        return json.load(f)

# ❌ Avoid - Unsafe operations
def read_config(filename):
    return eval(open(filename).read())  # Security risk!
```

## 🐛 Debugging & Profiling

### **Performance Profiling**

```bash
# Profile linting performance
make profile-lint

# Profile test performance  
make profile-tests

# Profile application code
py-spy top --pid <process_id>
```

### **Memory Analysis**

```bash
# Memory profiling
python -m memory_profiler script.py

# Line-by-line memory usage
@profile
def memory_intensive_function():
    ...
```

## 📝 Documentation Standards

### **Docstring Format**

Use Google-style docstrings:

```python
def optimize_prompt(
    prompt: str,
    target_metrics: list[str],
    constraints: dict[str, Any] | None = None,
) -> OptimizationResult:
    """Optimize a prompt for specified metrics.

    Args:
        prompt: The input prompt to optimize.
        target_metrics: List of metrics to optimize for.
        constraints: Optional constraints for optimization.

    Returns:
        Optimization result with improved prompt and metrics.

    Raises:
        OptimizationError: If optimization fails.
        
    Example:
        >>> result = optimize_prompt(
        ...     "Analyze this data",
        ...     ["clarity", "specificity"]
        ... )
        >>> print(result.optimized_prompt)
    """
```

### **Code Comments**

```python
# ✅ Good - Explain why, not what
# Use exponential backoff to handle API rate limits
await asyncio.sleep(2 ** attempt)

# ❌ Avoid - Obvious comments
# Increment counter by 1
counter += 1
```

## 🚨 Troubleshooting

### **Common Issues**

1. **MyPy Errors**
   ```bash
   # Install missing type stubs
   pip install types-pyyaml types-requests
   
   # Use type: ignore for third-party issues
   import some_library  # type: ignore[import]
   ```

2. **Ruff Conflicts**
   ```bash
   # Fix formatting conflicts
   ruff format .
   
   # Disable specific rules if needed
   # ruff: noqa: E501
   ```

3. **Pre-commit Issues**
   ```bash
   # Update hooks
   pre-commit autoupdate
   
   # Clear cache
   pre-commit clean
   ```

### **Performance Issues**

1. **Slow MyPy**
   ```bash
   # Use mypy daemon for faster checks
   dmypy start
   dmypy check beta_prompts/
   ```

2. **Large Files**
   ```bash
   # Exclude large files from checks
   # In pyproject.toml
   extend-exclude = ["large_file.py"]
   ```

## 📈 Continuous Improvement

### **Tool Updates**

```bash
# Update all development tools
pip install --upgrade ruff mypy black bandit safety

# Update pre-commit hooks
pre-commit autoupdate
```

### **Monitoring Quality**

- 📊 Track coverage trends
- 🎯 Monitor security scan results  
- ⚡ Measure build performance
- 🔍 Review code quality metrics

### **Team Collaboration**

- 🤝 Consistent tool versions in CI
- 📋 Shared configuration files
- 🎓 Regular tool training sessions
- 📖 Updated documentation

---

## 🎉 Benefits of This Setup

### **Developer Experience**
- ⚡ **Fast feedback** - Instant linting with Ruff
- 🔍 **Early bug detection** - MyPy catches issues before runtime
- 🤖 **AI assistance** - Sourcery suggests improvements
- 🛡️ **Security confidence** - Comprehensive scanning

### **Code Quality**
- 📏 **Consistent style** - Automated formatting
- 🧪 **Type safety** - Strict type checking
- 📚 **Documentation** - Enforced docstring coverage
- 🔒 **Security** - Multi-layer vulnerability detection

### **Team Productivity**
- 🚀 **Faster reviews** - Automated quality checks
- 📖 **Better onboarding** - Clear standards and tooling
- 🐛 **Fewer bugs** - Catch issues early
- 🔄 **Consistent workflow** - Standardized processes

This modern development setup ensures **enterprise-grade code quality** while maintaining **developer productivity** and **security best practices**.