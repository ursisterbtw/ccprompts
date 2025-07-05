# Beta-Prompts: Advanced Prompt Optimization Research Framework

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Safety: Dagger](https://img.shields.io/badge/Safety-Dagger%20Containers-green.svg)](https://dagger.io/)

A comprehensive suite of tools for **prompt engineering, optimization, and research** using real Claude API integration with **safety-first containerized execution**.

## 🚀 **Quick Start**

### 1. Setup Safety System
```bash
# Install Dagger (one-time)
curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.13.3 sh

# Install dependencies
./scripts/quick-safe.sh install
```

### 2. Run Individual Modules
```bash
# Test before running
./scripts/quick-safe.sh test improvement

# Run prompt improvement engine
./scripts/quick-safe.sh improvement

# Run prompt generation system  
./scripts/quick-safe.sh generation

# Run templating framework
./scripts/quick-safe.sh templating

# Run optimization suite
./scripts/quick-safe.sh optimization
```

### 3. Run Complete Workflow
```bash
# Run all modules sequentially
./scripts/quick-safe.sh all
```

## 📦 **Package Structure**

```
beta-prompts/
├── beta_prompts/                    # Python package
│   ├── __init__.py                  # Package exports
│   ├── improvement_engine.py        # Prompt optimization engine
│   ├── generation_system.py         # Prompt generation system  
│   ├── templating_framework.py      # Advanced templating
│   ├── optimization_suite.py        # Integrated optimization
│   └── scorer.py                    # Shared scoring utilities
├── scripts/                         # Safety execution scripts
│   ├── safe-run.sh                  # Full control safety script
│   └── quick-safe.sh                # Convenient aliases
├── dagger-src/                      # Dagger containerization
│   └── main.go                      # Go module for containers
├── run_*.py                         # Convenience wrappers
├── pyproject.toml                   # Modern Python packaging
├── dagger.json                      # Dagger configuration
├── .claude_hooks.json               # Safety pre-tool hooks
├── SAFETY.md                        # Safety documentation
└── README.md                        # This file
```

## 🛡️ **Safety System**

### **Mandatory Containerized Execution**

All Python execution is **strictly controlled** through Dagger containers:

✅ **Isolated Execution** - Cannot access host system  
✅ **Read-Only Source** - Cannot modify your code  
✅ **Automatic Cleanup** - Containers destroyed after use  
✅ **Pre-Tool Hooks** - Block dangerous direct execution  

### **Blocked Operations**
```bash
❌ python script.py                  # BLOCKED
❌ pip install package               # BLOCKED  
❌ ./script.sh                       # BLOCKED

✅ ./scripts/quick-safe.sh python script.py  # ALLOWED
✅ ./scripts/safe-run.sh "pip install -e ."  # ALLOWED
```

## 🧠 **Core Modules**

### 1. **Prompt Improvement Engine** (`beta_prompts.improvement_engine`)
- **Analyzes existing prompts** for optimization potential
- **Applies Anthropic's techniques**: XML tags, role definitions, structured instructions
- **Predicts performance improvements** with confidence scores
- **Batch optimization** for multiple prompts

**Usage:**
```python
from beta_prompts import PromptImprovementEngine

engine = PromptImprovementEngine(api_key="your-key")
result = engine.optimize_prompt("Review this code", "analysis", "software_engineering")
print(f"Improvement: {result.performance_prediction['overall_improvement']:.1%}")
```

### 2. **Prompt Generation System** (`beta_prompts.generation_system`)
- **Generates high-quality prompts** using Anthropic's 10-element structure
- **Domain-specific templates** for analysis, technical, creative tasks
- **Quality scoring framework** with validation
- **Prompt variations** and alternatives

**Usage:**
```python
from beta_prompts import PromptGenerationSystem

generator = PromptGenerationSystem()
prompt = generator.generate_prompt("technical", "data_science", "complex")
print(f"Quality Score: {prompt.quality_score:.2f}")
```

### 3. **Templating Framework** (`beta_prompts.templating_framework`)
- **Enterprise-grade template management** with versioning
- **Context-aware adaptation** for domains and complexity
- **Jinja2-powered templating** with custom filters
- **Variable validation** and constraint checking

**Usage:**
```python
from beta_prompts import AdvancedTemplatingFramework

framework = AdvancedTemplatingFramework()
templates = framework.search_templates(task_type="analysis")
compiled = framework.compile_template(templates[0]['template_id'], variables)
```

### 4. **Optimization Suite** (`beta_prompts.optimization_suite`)
- **Unified platform** combining all optimization capabilities
- **A/B testing framework** for comparing variants
- **Advanced analytics** with pattern detection
- **Performance dashboards** and insights

**Usage:**
```python
from beta_prompts import IntegratedOptimizationSuite

suite = IntegratedOptimizationSuite(api_key="your-key")
suite.start_optimization_session()
result = suite.optimize_prompt_comprehensive(prompt, "analysis", "business")
suite.end_optimization_session()
```

## 🎯 **Key Features**

### **Anthropic Best Practices Implementation**
- ✅ **XML tag optimization** (`<role>`, `<thinking>`, `<output_format>`)
- ✅ **Structured instruction patterns** with numbered steps
- ✅ **Chain-of-thought reasoning** integration  
- ✅ **Context-aware domain adaptation**
- ✅ **10-element prompt structure** from Anthropic courses

### **Research-Grade Analytics**
- ✅ **Performance prediction algorithms** with confidence intervals
- ✅ **Statistical significance testing** for A/B experiments
- ✅ **Quality scoring frameworks** based on documented criteria
- ✅ **Pattern detection** and learning insights
- ✅ **Comprehensive reporting** and visualization

### **Enterprise-Ready Safety**
- ✅ **Complete container isolation** via Dagger
- ✅ **Pre-tool hook enforcement** blocking unsafe operations
- ✅ **Read-only source mounting** preventing code modification
- ✅ **Resource limits** and timeout protection
- ✅ **Audit trails** and operation logging

## 📊 **Dependencies**

### **Core Dependencies**
- `anthropic>=0.21.0` - Claude API client
- `numpy>=1.24.0` - Numerical computing
- `matplotlib>=3.7.0` - Visualization
- `jinja2>=3.1.0` - Advanced templating
- `pydantic>=2.0.0` - Data validation

### **Optional Dependencies**
```bash
# Development tools
pip install -e .[dev]

# Research capabilities  
pip install -e .[research]

# Optimization algorithms
pip install -e .[optimization]

# Security scanning
pip install -e .[security]

# Everything
pip install -e .[all]
```

## 🚦 **Usage Examples**

### **Complete Research Workflow**
```bash
# 1. Setup environment
export ANTHROPIC_API_KEY="your-api-key"
./scripts/quick-safe.sh install

# 2. Run comprehensive analysis
./scripts/quick-safe.sh optimization

# 3. Generate specific prompt types
./scripts/quick-safe.sh generation

# 4. Apply templates for consistency
./scripts/quick-safe.sh templating

# 5. Optimize existing prompts
./scripts/quick-safe.sh improvement
```

### **Safety-First Development**
```bash
# Always test first
./scripts/quick-safe.sh test improvement

# Run with custom environment
./scripts/safe-run.sh --env CUSTOM_VAR=value "python -m beta_prompts.improvement_engine"

# Debug container environment
./scripts/safe-run.sh "python -c 'import sys; print(sys.path)'"
```

### **Programmatic Usage**
```python
# Use as library
import beta_prompts

# Get package info
info = beta_prompts.get_info()
print(f"Version: {info['version']}")

# Access all components
engine = beta_prompts.PromptImprovementEngine()
generator = beta_prompts.PromptGenerationSystem()
framework = beta_prompts.AdvancedTemplatingFramework()
suite = beta_prompts.IntegratedOptimizationSuite()
```

## 🔧 **Configuration**

### **Environment Variables**
- `ANTHROPIC_API_KEY` - Required for API calls
- `BETA_PROMPTS_TIMEOUT` - Container timeout (default: 300s)
- `BETA_PROMPTS_LOG_LEVEL` - Logging level (default: INFO)

### **Container Configuration**
Edit `dagger.json` to customize:
- Container image (default: `python:3.11-slim`)
- Resource limits
- Network access
- Mount points

### **Pre-Tool Hooks**
Customize `.claude_hooks.json` to adjust:
- Blocked command patterns
- Warning thresholds
- Safety requirements

## 📈 **Performance & Analytics**

### **Optimization Metrics**
- **Response Time**: API call duration
- **Token Efficiency**: Input/output token usage
- **Quality Score**: Automated quality assessment
- **Success Rate**: Task completion percentage
- **Improvement Rate**: Performance gains achieved

### **Research Capabilities**
- **A/B Testing**: Statistical comparison of prompt variants
- **Pattern Detection**: Automated insight discovery
- **Trend Analysis**: Performance tracking over time
- **Batch Processing**: High-throughput optimization
- **Export/Import**: Reproducible research workflows

## 🛠️ **Development**

### **Running Tests**
```bash
# Run all tests safely
./scripts/quick-safe.sh pytest

# Run specific test categories
./scripts/safe-run.sh "pytest -m unit"
./scripts/safe-run.sh "pytest -m integration"
./scripts/safe-run.sh "pytest -m api"
```

### **Code Quality**
```bash
# Format code
./scripts/safe-run.sh "black beta_prompts/"

# Sort imports  
./scripts/safe-run.sh "isort beta_prompts/"

# Type checking
./scripts/safe-run.sh "mypy beta_prompts/"

# Security scanning
./scripts/safe-run.sh "bandit -r beta_prompts/"
```

### **Documentation**
```bash
# Build docs
./scripts/safe-run.sh "sphinx-build docs/ docs/_build/"

# Live reload during development
./scripts/safe-run.sh "sphinx-autobuild docs/ docs/_build/"
```

## 🔐 **Security**

### **Built-in Security Features**
- **Container Isolation**: Complete host system protection
- **Dependency Scanning**: Automated vulnerability detection
- **Code Analysis**: Static security analysis with Bandit
- **Access Controls**: Restricted API and file system access

### **Security Scanning**
```bash
# Scan dependencies
./scripts/safe-run.sh "safety check"
./scripts/safe-run.sh "pip-audit"

# Scan code
./scripts/safe-run.sh "bandit -r beta_prompts/"
```

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Use safety system**: Always use `./scripts/quick-safe.sh` for development
4. **Add tests**: Include tests for new functionality
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Anthropic** for Claude API and documented best practices
- **Dagger** for containerized execution framework
- **Jinja2** for powerful templating capabilities
- **Community** for feedback and contributions

---

**🔒 Remember: All execution must use the containerized safety system. Direct Python execution is blocked for your protection.**