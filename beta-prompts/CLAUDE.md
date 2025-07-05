# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a **prompt optimization research framework** for measuring and improving AI prompt effectiveness using real Claude API calls. The system provides experimental tools to analyze baseline performance, test optimization techniques, and generate reproducible metrics with statistical rigor.

## Development Commands

### Environment Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Set API key for real experiments
export ANTHROPIC_API_KEY='your-actual-api-key'

# Run tests
pytest
```

### Core Experimental Workflow
```bash
# 1. Collect baseline metrics from simple prompts
python real_baseline_collector.py

# 2. Test optimized prompts with documented techniques
python real_enhanced_collector.py

# 3. Analyze results with statistical analysis
python real_comparison_analysis.py

# 4. Generate visualizations
# (automatically created by analysis script)
```

### Development Tools
```bash
# Test individual components
python prompt_scorer.py  # Test scoring metrics
python 01_prompt_improvement_engine.py  # Test optimization engine

# Run analysis on existing data
python real_comparison_analysis.py --existing-data
```

## Architecture

### Core Components

**Data Collection Layer:**
- `real_baseline_collector.py` - Collects baseline metrics from manual prompts using real Claude API calls
- `real_enhanced_collector.py` - Tests optimized prompts using documented Anthropic techniques
- `prompt_scorer.py` - Shared data structures and metrics calculation engine

**Analysis Layer:**
- `real_comparison_analysis.py` - Statistical analysis engine comparing baseline vs optimized performance
- `01_prompt_improvement_engine.py` - Prompt optimization engine implementing Anthropic's best practices
- `02_prompt_generation_system.py` - Advanced prompt generation system

**Experimental Framework:**
- 5 real coding tasks: code review, refactoring, test generation, documentation, bug fixing
- Metrics: response time, token usage, success rate, iteration count, quality indicators
- Optimization techniques: role definitions, XML tags, structured instructions, chain-of-thought

### Data Flow

1. **Baseline Collection** → `real_baseline_metrics.json`
2. **Enhanced Collection** → `real_enhanced_metrics.json`
3. **Statistical Analysis** → `real_optimization_analysis.json`
4. **Visualization** → `real_prompt_optimization_results.png`

### Key Classes

- `RealTaskMetrics` - Captures real API call performance data
- `PromptScorer` - Calculates efficiency, quality, and token optimization scores
- `PromptImprovementEngine` - Implements concrete optimization techniques
- `RealBaselineCollector` - Orchestrates baseline data collection with real API calls

## Research Methodology

### Test Cases
The framework evaluates 5 real-world coding scenarios:
1. **Security Analysis** - Vulnerability detection in code
2. **SOLID Refactoring** - Applying design principles
3. **Unit Test Generation** - Creating comprehensive test suites
4. **API Documentation** - Generating technical documentation
5. **Systematic Debugging** - Structured problem-solving

### Optimization Techniques Applied
- Role definitions with XML tags (`<role>`, `<instructions>`)
- Structured instruction format with clear sections
- Chain-of-thought reasoning patterns
- Explicit output format specifications
- Task-specific optimization patterns

### Metrics Measured
- **Response Time** - API call duration in seconds
- **Token Usage** - Input + output token consumption
- **Success Rate** - Task completion percentage
- **Iteration Count** - Number of retries needed
- **Quality Indicators** - Response completeness and accuracy

## Cost Management

Full experimental runs:
- ~10-15 Claude API calls per experiment
- ~50,000-100,000 tokens total
- Estimated cost: $5-15 USD per complete experiment

## Data Integrity

✅ **Real API calls only** - No simulated or mocked data
✅ **Reproducible methodology** - Consistent experimental design
✅ **Statistical rigor** - Proper analysis of results
✅ **Transparent reporting** - Complete methodology documentation

## File Organization

```
beta-prompts/
├── real_baseline_collector.py     # Baseline data collection
├── real_enhanced_collector.py     # Optimized prompt testing
├── real_comparison_analysis.py    # Statistical analysis
├── prompt_scorer.py              # Metrics calculation
├── 01_prompt_improvement_engine.py # Optimization algorithms
├── 02_prompt_generation_system.py # Advanced generation
├── requirements.txt              # Dependencies
├── README.md                     # Usage documentation
└── ANTHROPIC_PROMPT_OPTIMIZATION_GUIDE.md # Reference guide
```

## Extension Points

- **Additional Test Cases**: Add new coding scenarios to the experimental framework
- **New Optimization Techniques**: Implement additional prompt improvement strategies
- **Custom Metrics**: Define domain-specific success measures
- **Alternative Models**: Test optimization techniques across different AI models

## Important Notes

- All experiments use real Claude API calls - no simulated data
- API key must be set in environment for data collection
- Results are saved as JSON files for reproducibility
- Statistical analysis includes confidence intervals and significance tests
- Visualization generation requires matplotlib for charts and graphs