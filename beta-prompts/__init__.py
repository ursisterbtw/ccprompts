"""Beta-Prompts: Advanced Prompt Optimization Research Framework.

A comprehensive suite of tools for prompt engineering, optimization, and research
using real Claude API integration with safety-first containerized execution,
stunning dark-mode visualizations, and enterprise-grade quality assurance.

Features:
    - Real-time prompt optimization with Claude API
    - Advanced templating and generation systems  
    - Comprehensive visualization suite with dark mode aesthetics
    - Interactive dashboards and statistical analysis
    - Enterprise-grade safety and containerized execution
    - Modern Python tooling with strict type safety
"""

from __future__ import annotations

from typing import TYPE_CHECKING

__version__ = "1.0.0"
__author__ = "Beta-Prompts Research Team"
__email__ = "research@beta-prompts.org"
__license__ = "MIT"
__copyright__ = "2024 Beta-Prompts Research Team"
__description__ = "Advanced prompt optimization research framework with real Claude API integration"

# Type-only imports for better performance
if TYPE_CHECKING:
    from .improvement_engine import OptimizationResult, PromptAnalysis
    from .generation_system import GeneratedPrompt, PromptBlueprint
    from .optimization_suite import OptimizationExperiment, OptimizationRecommendation, OptimizationSession
    from .templating_framework import CompiledTemplate, TemplateMetadata, TemplateVariable

# Core modules with error handling
try:
    from .improvement_engine import PromptImprovementEngine
    from .improvement_engine import OptimizationResult
    from .improvement_engine import PromptAnalysis
except ImportError as e:
    raise ImportError(
        f"Failed to import improvement_engine: {e}. "
        "Ensure dependencies are installed with 'pip install -e .[dev]'"
    ) from e

try:
    from .generation_system import PromptGenerationSystem
    from .generation_system import GeneratedPrompt
    from .generation_system import PromptBlueprint
except ImportError as e:
    raise ImportError(
        f"Failed to import generation_system: {e}. "
        "Ensure core dependencies are installed."
    ) from e

try:
    from .templating_framework import AdvancedTemplatingFramework
    from .templating_framework import CompiledTemplate
    from .templating_framework import TemplateMetadata
    from .templating_framework import TemplateVariable
except ImportError as e:
    raise ImportError(
        f"Failed to import templating_framework: {e}. "
        "Ensure Jinja2 is installed."
    ) from e

try:
    from .optimization_suite import IntegratedOptimizationSuite
    from .optimization_suite import OptimizationExperiment
    from .optimization_suite import OptimizationRecommendation
    from .optimization_suite import OptimizationSession
except ImportError as e:
    raise ImportError(
        f"Failed to import optimization_suite: {e}. "
        "This requires all visualization dependencies."
    ) from e

# Visualization components (optional imports)
try:
    from .visualizations import DarkModeVisualizer, VisualizationData
    from .interactive_dashboard import InteractiveDashboard
    from .seaborn_analytics import SeabornAnalytics
    
    # Add to exports if successfully imported
    _VISUALIZATION_EXPORTS = [
        "DarkModeVisualizer", 
        "VisualizationData",
        "InteractiveDashboard", 
        "SeabornAnalytics"
    ]
except ImportError:
    # Visualization dependencies not available
    _VISUALIZATION_EXPORTS = []

# Utility functions with scoring (optional)
try:
    from .prompt_scorer import PromptScorer, RealTaskMetrics
    _SCORING_EXPORTS = ["PromptScorer", "RealTaskMetrics"]
except ImportError:
    _SCORING_EXPORTS = []

# Utility functions with proper type hints
def get_version() -> str:
    """Get the current version of beta-prompts.
    
    Returns:
        The semantic version string.
    """
    return __version__


def get_info() -> dict[str, str | list[str]]:
    """Get comprehensive package information.
    
    Returns:
        Dictionary containing package metadata and available modules.
    """
    available_modules = [
        "improvement_engine",
        "generation_system", 
        "templating_framework",
        "optimization_suite"
    ]
    
    # Add optional modules if available
    if _VISUALIZATION_EXPORTS:
        available_modules.extend(["visualizations", "interactive_dashboard", "seaborn_analytics"])
    if _SCORING_EXPORTS:
        available_modules.append("prompt_scorer")
    
    return {
        "name": "beta-prompts",
        "version": __version__,
        "author": __author__,
        "email": __email__,
        "license": __license__,
        "description": __description__,
        "modules": available_modules,
    }


def check_dependencies() -> dict[str, bool]:
    """Check availability of optional dependencies.
    
    Returns:
        Dictionary mapping dependency groups to availability status.
    """
    return {
        "core": True,  # Always available if package loads
        "visualization": bool(_VISUALIZATION_EXPORTS),
        "scoring": bool(_SCORING_EXPORTS),
        "anthropic_api": True,  # Assume available if core loads
    }


# Package-level configuration with type hints
DEFAULT_CONFIG: dict[str, str | int | bool] = {
    "container_image": "python:3.11-slim",
    "timeout_seconds": 300,
    "max_retries": 3,
    "api_timeout": 30,
    "safety_enabled": True,
    "logging_level": "INFO",
}

# Dynamic __all__ based on available components
__all__ = [
    # Core classes (always available)
    "PromptImprovementEngine",
    "PromptGenerationSystem", 
    "AdvancedTemplatingFramework",
    "IntegratedOptimizationSuite",
    # Result classes
    "OptimizationResult",
    "GeneratedPrompt",
    "CompiledTemplate",
    "OptimizationSession",
    # Data structures  
    "PromptAnalysis",
    "PromptBlueprint",
    "TemplateMetadata",
    "TemplateVariable",
    "OptimizationExperiment",
    "OptimizationRecommendation",
    # Utilities
    "get_version",
    "get_info",
    "check_dependencies",
    "DEFAULT_CONFIG",
    # Package metadata
    "__version__",
    "__author__",
    "__email__",
    "__license__",
    "__copyright__",
] + _VISUALIZATION_EXPORTS + _SCORING_EXPORTS