#!/usr/bin/env python3
"""
Adaptive Prompt Optimization Engine
==================================

An intelligent system that continuously learns from prompt execution patterns
and automatically optimizes prompts for better performance, accuracy, and efficiency.

Features:
- Real-time performance monitoring and analysis
- Automatic prompt enhancement based on success patterns
- Context-aware optimization strategies
- A/B testing framework for prompt variations
- Machine learning-driven optimization recommendations
- Feedback loop integration for continuous improvement
"""

import asyncio
import json
import logging
import time
import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Callable, Tuple, Union
import uuid
import statistics
import hashlib
from pathlib import Path
import numpy as np
from collections import defaultdict, deque

logger = logging.getLogger(__name__)


class OptimizationStrategy(Enum):
    """Types of optimization strategies"""
    PERFORMANCE = "performance"
    ACCURACY = "accuracy"
    TOKEN_EFFICIENCY = "token_efficiency"
    CONTEXT_CLARITY = "context_clarity"
    INSTRUCTION_PRECISION = "instruction_precision"
    OUTPUT_STRUCTURE = "output_structure"
    ERROR_REDUCTION = "error_reduction"


class PromptPattern(Enum):
    """Common prompt patterns for optimization"""
    CHAIN_OF_THOUGHT = "chain_of_thought"
    STEP_BY_STEP = "step_by_step"
    ROLE_PLAYING = "role_playing"
    EXAMPLES_BASED = "examples_based"
    STRUCTURED_OUTPUT = "structured_output"
    CONSTRAINT_BASED = "constraint_based"
    CONTEXT_FIRST = "context_first"


@dataclass
class OptimizationMetrics:
    """Metrics for tracking prompt optimization performance"""
    original_performance: float = 0.0
    optimized_performance: float = 0.0
    improvement_percentage: float = 0.0
    token_reduction: float = 0.0
    error_rate_reduction: float = 0.0
    response_time_improvement: float = 0.0
    success_rate_improvement: float = 0.0
    quality_score_improvement: float = 0.0
    
    def calculate_overall_improvement(self) -> float:
        """Calculate overall improvement score"""
        factors = [
            self.improvement_percentage,
            self.token_reduction * 0.3,
            self.error_rate_reduction * 0.4,
            self.response_time_improvement * 0.2,
            self.success_rate_improvement * 0.5,
            self.quality_score_improvement * 0.6
        ]
        return sum(factors) / len(factors)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'original_performance': self.original_performance,
            'optimized_performance': self.optimized_performance,
            'improvement_percentage': self.improvement_percentage,
            'token_reduction': self.token_reduction,
            'error_rate_reduction': self.error_rate_reduction,
            'response_time_improvement': self.response_time_improvement,
            'success_rate_improvement': self.success_rate_improvement,
            'quality_score_improvement': self.quality_score_improvement,
            'overall_improvement': self.calculate_overall_improvement()
        }


@dataclass
class PromptVersion:
    """Represents a version of a prompt with its performance data"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    content: str = ""
    version_number: int = 1
    optimization_strategy: OptimizationStrategy = OptimizationStrategy.PERFORMANCE
    patterns_used: List[PromptPattern] = field(default_factory=list)
    
    # Performance tracking
    execution_count: int = 0
    success_count: int = 0
    total_tokens: int = 0
    total_time: float = 0.0
    error_count: int = 0
    quality_scores: List[float] = field(default_factory=list)
    
    # Metadata
    created_at: datetime = field(default_factory=datetime.now)
    last_used: Optional[datetime] = None
    is_active: bool = True
    
    def get_success_rate(self) -> float:
        """Calculate success rate"""
        if self.execution_count == 0:
            return 0.0
        return self.success_count / self.execution_count
    
    def get_average_tokens(self) -> float:
        """Calculate average tokens per execution"""
        if self.execution_count == 0:
            return 0.0
        return self.total_tokens / self.execution_count
    
    def get_average_time(self) -> float:
        """Calculate average execution time"""
        if self.execution_count == 0:
            return 0.0
        return self.total_time / self.execution_count
    
    def get_error_rate(self) -> float:
        """Calculate error rate"""
        if self.execution_count == 0:
            return 0.0
        return self.error_count / self.execution_count
    
    def get_average_quality(self) -> float:
        """Calculate average quality score"""
        if not self.quality_scores:
            return 0.0
        return statistics.mean(self.quality_scores)
    
    def update_performance(self, success: bool, tokens: int, execution_time: float, quality_score: float = 0.0) -> None:
        """Update performance metrics"""
        self.execution_count += 1
        self.total_tokens += tokens
        self.total_time += execution_time
        self.last_used = datetime.now()
        
        if success:
            self.success_count += 1
        else:
            self.error_count += 1
        
        if quality_score > 0:
            self.quality_scores.append(quality_score)
            # Keep only last 100 scores
            if len(self.quality_scores) > 100:
                self.quality_scores = self.quality_scores[-100:]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'content': self.content,
            'version_number': self.version_number,
            'optimization_strategy': self.optimization_strategy.value,
            'patterns_used': [p.value for p in self.patterns_used],
            'execution_count': self.execution_count,
            'success_count': self.success_count,
            'total_tokens': self.total_tokens,
            'total_time': self.total_time,
            'error_count': self.error_count,
            'quality_scores': self.quality_scores,
            'created_at': self.created_at.isoformat(),
            'last_used': self.last_used.isoformat() if self.last_used else None,
            'is_active': self.is_active,
            'performance_metrics': {
                'success_rate': self.get_success_rate(),
                'average_tokens': self.get_average_tokens(),
                'average_time': self.get_average_time(),
                'error_rate': self.get_error_rate(),
                'average_quality': self.get_average_quality()
            }
        }


@dataclass
class PromptOptimizationRequest:
    """Request for prompt optimization"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    original_prompt: str = ""
    target_strategy: OptimizationStrategy = OptimizationStrategy.PERFORMANCE
    context_requirements: Dict[str, Any] = field(default_factory=dict)
    performance_constraints: Dict[str, Any] = field(default_factory=dict)
    success_criteria: Dict[str, Any] = field(default_factory=dict)
    
    # A/B testing configuration
    test_variants: int = 3
    test_duration: int = 100  # number of executions
    confidence_threshold: float = 0.95
    
    # Results
    optimized_versions: List[PromptVersion] = field(default_factory=list)
    best_version: Optional[PromptVersion] = None
    optimization_metrics: Optional[OptimizationMetrics] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'original_prompt': self.original_prompt,
            'target_strategy': self.target_strategy.value,
            'context_requirements': self.context_requirements,
            'performance_constraints': self.performance_constraints,
            'success_criteria': self.success_criteria,
            'test_variants': self.test_variants,
            'test_duration': self.test_duration,
            'confidence_threshold': self.confidence_threshold,
            'optimized_versions': [v.to_dict() for v in self.optimized_versions],
            'best_version': self.best_version.to_dict() if self.best_version else None,
            'optimization_metrics': self.optimization_metrics.to_dict() if self.optimization_metrics else None
        }


class AdaptiveOptimizationEngine:
    """
    Main engine for adaptive prompt optimization with continuous learning
    """
    
    def __init__(self):
        self.optimization_requests: Dict[str, PromptOptimizationRequest] = {}
        self.prompt_versions: Dict[str, List[PromptVersion]] = defaultdict(list)
        self.pattern_performance: Dict[PromptPattern, List[float]] = defaultdict(list)
        self.strategy_effectiveness: Dict[OptimizationStrategy, List[float]] = defaultdict(list)
        self.learning_history: List[Dict[str, Any]] = []
        self.optimization_rules: Dict[str, Callable] = {}
        self.pattern_templates: Dict[PromptPattern, str] = {}
        
        # Initialize optimization patterns and rules
        self._initialize_pattern_templates()
        self._initialize_optimization_rules()
        
        logger.info("Adaptive Optimization Engine initialized")
    
    def _initialize_pattern_templates(self) -> None:
        """Initialize prompt pattern templates"""
        
        self.pattern_templates = {
            PromptPattern.CHAIN_OF_THOUGHT: """
Let's think through this step by step:

1. First, I need to understand: {context}
2. Then, I should analyze: {analysis_focus}
3. Next, I will determine: {decision_point}
4. Finally, I will provide: {output_format}

{original_instruction}
""",
            
            PromptPattern.STEP_BY_STEP: """
Please approach this systematically:

Step 1: {step_1}
Step 2: {step_2}
Step 3: {step_3}

{original_instruction}
""",
            
            PromptPattern.ROLE_PLAYING: """
You are an expert {role} with {expertise} years of experience in {domain}.

Your task: {original_instruction}

Please respond as this expert would, drawing on your deep knowledge and experience.
""",
            
            PromptPattern.EXAMPLES_BASED: """
Here are some examples to guide your response:

Example 1: {example_1}
Example 2: {example_2}

Now, please handle this similar case:
{original_instruction}
""",
            
            PromptPattern.STRUCTURED_OUTPUT: """
Please provide your response in the following structure:

{output_structure}

Task: {original_instruction}
""",
            
            PromptPattern.CONSTRAINT_BASED: """
Please complete this task while adhering to these constraints:

{constraints}

Task: {original_instruction}
""",
            
            PromptPattern.CONTEXT_FIRST: """
Context: {context}

Given this context, please: {original_instruction}
"""
        }
    
    def _initialize_optimization_rules(self) -> None:
        """Initialize optimization rules for different strategies"""
        
        def optimize_for_performance(prompt: str) -> str:
            """Optimize prompt for faster execution"""
            optimizations = [
                ("Please be concise and direct in your response.", ""),
                ("Provide a detailed analysis", "Analyze"),
                ("Please provide a comprehensive", "Provide"),
                ("I would like you to", "Please"),
                ("Could you please", "Please"),
            ]
            
            optimized = prompt
            for verbose, concise in optimizations:
                optimized = optimized.replace(verbose, concise)
            
            if "concise" not in optimized.lower():
                optimized += "\n\nPlease be concise and direct."
            
            return optimized.strip()
        
        def optimize_for_accuracy(prompt: str) -> str:
            """Optimize prompt for better accuracy"""
            if "step by step" not in prompt.lower():
                prompt = "Please approach this step by step:\n\n" + prompt
            
            if "verify" not in prompt.lower():
                prompt += "\n\nPlease verify your response before providing it."
            
            return prompt
        
        def optimize_for_token_efficiency(prompt: str) -> str:
            """Optimize prompt for token efficiency"""
            # Remove redundant words and phrases
            redundant_patterns = [
                r'\b(please|kindly)\s+',
                r'\b(I would like|I want|I need)\s+',
                r'\b(could you|would you|can you)\s+',
                r'\s+and\s+also\s+',
                r'\s+as well as\s+',
                r'\s+in addition to\s+',
            ]
            
            optimized = prompt
            for pattern in redundant_patterns:
                optimized = re.sub(pattern, '', optimized, flags=re.IGNORECASE)
            
            # Clean up multiple spaces
            optimized = re.sub(r'\s+', ' ', optimized)
            
            return optimized.strip()
        
        def optimize_for_context_clarity(prompt: str) -> str:
            """Optimize prompt for better context clarity"""
            if not prompt.startswith("Context:"):
                prompt = "Context: [Please provide relevant context]\n\n" + prompt
            
            if "format" not in prompt.lower():
                prompt += "\n\nOutput format: [Specify desired format]"
            
            return prompt
        
        def optimize_for_instruction_precision(prompt: str) -> str:
            """Optimize prompt for more precise instructions"""
            vague_terms = {
                "analyze": "identify patterns and provide insights about",
                "review": "examine and evaluate",
                "check": "verify and validate",
                "improve": "enhance by identifying specific improvements for",
                "handle": "process and respond to",
                "deal with": "address and resolve"
            }
            
            optimized = prompt
            for vague, precise in vague_terms.items():
                optimized = re.sub(rf'\b{vague}\b', precise, optimized, flags=re.IGNORECASE)
            
            return optimized
        
        def optimize_for_output_structure(prompt: str) -> str:
            """Optimize prompt for better output structure"""
            if "format" not in prompt.lower() and "structure" not in prompt.lower():
                prompt += "\n\nPlease structure your response with clear headings and bullet points."
            
            return prompt
        
        def optimize_for_error_reduction(prompt: str) -> str:
            """Optimize prompt to reduce errors"""
            prompt += "\n\nBefore responding, please double-check your work for accuracy and completeness."
            
            if "example" not in prompt.lower():
                prompt += "\nIf unsure about any aspect, please ask for clarification."
            
            return prompt
        
        self.optimization_rules = {
            OptimizationStrategy.PERFORMANCE: optimize_for_performance,
            OptimizationStrategy.ACCURACY: optimize_for_accuracy,
            OptimizationStrategy.TOKEN_EFFICIENCY: optimize_for_token_efficiency,
            OptimizationStrategy.CONTEXT_CLARITY: optimize_for_context_clarity,
            OptimizationStrategy.INSTRUCTION_PRECISION: optimize_for_instruction_precision,
            OptimizationStrategy.OUTPUT_STRUCTURE: optimize_for_output_structure,
            OptimizationStrategy.ERROR_REDUCTION: optimize_for_error_reduction,
        }
    
    def create_optimization_request(self, prompt: str, strategy: OptimizationStrategy, 
                                  context_requirements: Dict[str, Any] = None,
                                  performance_constraints: Dict[str, Any] = None) -> PromptOptimizationRequest:
        """Create a new optimization request"""
        
        request = PromptOptimizationRequest(
            original_prompt=prompt,
            target_strategy=strategy,
            context_requirements=context_requirements or {},
            performance_constraints=performance_constraints or {}
        )
        
        self.optimization_requests[request.id] = request
        logger.info(f"Created optimization request {request.id} for strategy {strategy.value}")
        
        return request
    
    async def optimize_prompt(self, request: PromptOptimizationRequest) -> List[PromptVersion]:
        """Generate optimized versions of a prompt"""
        
        optimized_versions = []
        
        # Apply primary optimization strategy
        primary_optimized = self._apply_optimization_strategy(
            request.original_prompt, 
            request.target_strategy
        )
        
        primary_version = PromptVersion(
            content=primary_optimized,
            version_number=1,
            optimization_strategy=request.target_strategy
        )
        optimized_versions.append(primary_version)
        
        # Generate pattern-based variations
        for pattern in [PromptPattern.CHAIN_OF_THOUGHT, PromptPattern.STEP_BY_STEP, PromptPattern.STRUCTURED_OUTPUT]:
            pattern_optimized = self._apply_pattern_template(
                request.original_prompt,
                pattern,
                request.context_requirements
            )
            
            pattern_version = PromptVersion(
                content=pattern_optimized,
                version_number=len(optimized_versions) + 1,
                optimization_strategy=request.target_strategy,
                patterns_used=[pattern]
            )
            optimized_versions.append(pattern_version)
        
        # Generate hybrid optimizations
        if len(optimized_versions) >= 2:
            hybrid_content = self._create_hybrid_optimization(
                optimized_versions[0].content,
                optimized_versions[1].content,
                request.target_strategy
            )
            
            hybrid_version = PromptVersion(
                content=hybrid_content,
                version_number=len(optimized_versions) + 1,
                optimization_strategy=request.target_strategy,
                patterns_used=[PromptPattern.CHAIN_OF_THOUGHT, PromptPattern.STRUCTURED_OUTPUT]
            )
            optimized_versions.append(hybrid_version)
        
        request.optimized_versions = optimized_versions
        logger.info(f"Generated {len(optimized_versions)} optimized versions for request {request.id}")
        
        return optimized_versions
    
    def _apply_optimization_strategy(self, prompt: str, strategy: OptimizationStrategy) -> str:
        """Apply a specific optimization strategy to a prompt"""
        
        if strategy in self.optimization_rules:
            return self.optimization_rules[strategy](prompt)
        
        return prompt
    
    def _apply_pattern_template(self, prompt: str, pattern: PromptPattern, 
                               context: Dict[str, Any]) -> str:
        """Apply a pattern template to a prompt"""
        
        if pattern not in self.pattern_templates:
            return prompt
        
        template = self.pattern_templates[pattern]
        
        # Fill in template variables
        template_vars = {
            'original_instruction': prompt,
            'context': context.get('context', 'the given information'),
            'analysis_focus': context.get('analysis_focus', 'the key aspects'),
            'decision_point': context.get('decision_point', 'the best approach'),
            'output_format': context.get('output_format', 'a clear response'),
            'role': context.get('role', 'professional'),
            'expertise': context.get('expertise', '10'),
            'domain': context.get('domain', 'this field'),
            'step_1': context.get('step_1', 'analyze the requirements'),
            'step_2': context.get('step_2', 'develop a solution'),
            'step_3': context.get('step_3', 'validate the results'),
            'example_1': context.get('example_1', '[Example 1]'),
            'example_2': context.get('example_2', '[Example 2]'),
            'output_structure': context.get('output_structure', '1. Summary\n2. Analysis\n3. Recommendations'),
            'constraints': context.get('constraints', '- Be accurate\n- Be concise\n- Be actionable')
        }
        
        try:
            return template.format(**template_vars)
        except KeyError as e:
            logger.warning(f"Missing template variable {e}, using original prompt")
            return prompt
    
    def _create_hybrid_optimization(self, prompt1: str, prompt2: str, strategy: OptimizationStrategy) -> str:
        """Create a hybrid optimization combining two prompts"""
        
        # Extract the best elements from both prompts
        lines1 = prompt1.split('\n')
        lines2 = prompt2.split('\n')
        
        # Simple heuristic: combine unique sentences
        combined_lines = []
        seen_lines = set()
        
        for line in lines1 + lines2:
            line = line.strip()
            if line and line not in seen_lines:
                combined_lines.append(line)
                seen_lines.add(line)
        
        hybrid = '\n'.join(combined_lines)
        
        # Apply the target strategy to the hybrid
        return self._apply_optimization_strategy(hybrid, strategy)
    
    def record_execution_result(self, version_id: str, success: bool, tokens: int, 
                               execution_time: float, quality_score: float = 0.0) -> None:
        """Record the result of executing a prompt version"""
        
        # Find the version
        version = None
        for versions in self.prompt_versions.values():
            for v in versions:
                if v.id == version_id:
                    version = v
                    break
            if version:
                break
        
        if not version:
            logger.warning(f"Version {version_id} not found")
            return
        
        # Update performance metrics
        version.update_performance(success, tokens, execution_time, quality_score)
        
        # Record pattern performance
        for pattern in version.patterns_used:
            performance_score = quality_score if quality_score > 0 else (1.0 if success else 0.0)
            self.pattern_performance[pattern].append(performance_score)
        
        # Record strategy effectiveness
        performance_score = quality_score if quality_score > 0 else (1.0 if success else 0.0)
        self.strategy_effectiveness[version.optimization_strategy].append(performance_score)
        
        logger.info(f"Recorded execution result for version {version_id}: success={success}, tokens={tokens}")
    
    def get_best_version(self, request_id: str) -> Optional[PromptVersion]:
        """Get the best performing version for a request"""
        
        if request_id not in self.optimization_requests:
            return None
        
        request = self.optimization_requests[request_id]
        if not request.optimized_versions:
            return None
        
        # Calculate composite scores for each version
        best_version = None
        best_score = -1
        
        for version in request.optimized_versions:
            if version.execution_count < 10:  # Need minimum data
                continue
            
            # Composite score based on multiple factors
            success_rate = version.get_success_rate()
            avg_quality = version.get_average_quality()
            token_efficiency = 1.0 / (version.get_average_tokens() / 1000 + 1)  # Normalize
            time_efficiency = 1.0 / (version.get_average_time() + 1)  # Normalize
            
            composite_score = (
                success_rate * 0.4 +
                avg_quality * 0.3 +
                token_efficiency * 0.15 +
                time_efficiency * 0.15
            )
            
            if composite_score > best_score:
                best_score = composite_score
                best_version = version
        
        if best_version:
            request.best_version = best_version
            logger.info(f"Best version for request {request_id}: {best_version.id} (score: {best_score:.3f})")
        
        return best_version
    
    def analyze_optimization_patterns(self) -> Dict[str, Any]:
        """Analyze optimization patterns and effectiveness"""
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'pattern_effectiveness': {},
            'strategy_effectiveness': {},
            'optimization_trends': {},
            'recommendations': []
        }
        
        # Analyze pattern effectiveness
        for pattern, scores in self.pattern_performance.items():
            if scores:
                analysis['pattern_effectiveness'][pattern.value] = {
                    'average_score': statistics.mean(scores),
                    'median_score': statistics.median(scores),
                    'usage_count': len(scores),
                    'consistency': 1.0 - statistics.stdev(scores) if len(scores) > 1 else 1.0
                }
        
        # Analyze strategy effectiveness
        for strategy, scores in self.strategy_effectiveness.items():
            if scores:
                analysis['strategy_effectiveness'][strategy.value] = {
                    'average_score': statistics.mean(scores),
                    'median_score': statistics.median(scores),
                    'usage_count': len(scores),
                    'consistency': 1.0 - statistics.stdev(scores) if len(scores) > 1 else 1.0
                }
        
        # Generate recommendations
        recommendations = []
        
        # Find best performing patterns
        best_patterns = sorted(
            [(p, data['average_score']) for p, data in analysis['pattern_effectiveness'].items()],
            key=lambda x: x[1],
            reverse=True
        )
        
        if best_patterns:
            recommendations.append(f"Best performing pattern: {best_patterns[0][0]} (score: {best_patterns[0][1]:.3f})")
        
        # Find best performing strategies
        best_strategies = sorted(
            [(s, data['average_score']) for s, data in analysis['strategy_effectiveness'].items()],
            key=lambda x: x[1],
            reverse=True
        )
        
        if best_strategies:
            recommendations.append(f"Best performing strategy: {best_strategies[0][0]} (score: {best_strategies[0][1]:.3f})")
        
        analysis['recommendations'] = recommendations
        
        return analysis
    
    def get_optimization_suggestions(self, prompt: str, context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Get optimization suggestions for a prompt"""
        
        suggestions = []
        context = context or {}
        
        # Analyze prompt characteristics
        prompt_length = len(prompt)
        word_count = len(prompt.split())
        
        # Length-based suggestions
        if prompt_length > 1000:
            suggestions.append({
                'type': 'token_efficiency',
                'suggestion': 'Consider shortening the prompt to reduce token usage',
                'priority': 'high',
                'expected_improvement': 'token_reduction'
            })
        
        # Structure-based suggestions
        if 'step' not in prompt.lower() and 'process' in context.get('task_type', ''):
            suggestions.append({
                'type': 'step_by_step',
                'suggestion': 'Add step-by-step structure for better clarity',
                'priority': 'medium',
                'expected_improvement': 'accuracy'
            })
        
        # Context-based suggestions
        if 'context' not in prompt.lower():
            suggestions.append({
                'type': 'context_clarity',
                'suggestion': 'Add explicit context section',
                'priority': 'medium',
                'expected_improvement': 'clarity'
            })
        
        # Pattern-based suggestions
        pattern_scores = []
        for pattern, scores in self.pattern_performance.items():
            if scores:
                avg_score = statistics.mean(scores)
                pattern_scores.append((pattern, avg_score))
        
        pattern_scores.sort(key=lambda x: x[1], reverse=True)
        
        if pattern_scores:
            best_pattern = pattern_scores[0][0]
            suggestions.append({
                'type': 'pattern_application',
                'suggestion': f'Consider applying {best_pattern.value} pattern',
                'priority': 'low',
                'expected_improvement': 'performance'
            })
        
        return suggestions
    
    def save_optimization_state(self, filepath: str) -> None:
        """Save the optimization engine state"""
        
        state_data = {
            'optimization_requests': {k: v.to_dict() for k, v in self.optimization_requests.items()},
            'prompt_versions': {k: [v.to_dict() for v in versions] for k, versions in self.prompt_versions.items()},
            'pattern_performance': {k.value: v for k, v in self.pattern_performance.items()},
            'strategy_effectiveness': {k.value: v for k, v in self.strategy_effectiveness.items()},
            'learning_history': self.learning_history,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(filepath, 'w') as f:
            json.dump(state_data, f, indent=2)
        
        logger.info(f"Optimization state saved to {filepath}")
    
    def load_optimization_state(self, filepath: str) -> None:
        """Load optimization engine state"""
        
        try:
            with open(filepath, 'r') as f:
                state_data = json.load(f)
            
            # Reconstruct optimization requests
            self.optimization_requests = {}
            for req_id, req_data in state_data.get('optimization_requests', {}).items():
                request = PromptOptimizationRequest(
                    id=req_data['id'],
                    original_prompt=req_data['original_prompt'],
                    target_strategy=OptimizationStrategy(req_data['target_strategy']),
                    context_requirements=req_data['context_requirements'],
                    performance_constraints=req_data['performance_constraints']
                )
                self.optimization_requests[req_id] = request
            
            # Reconstruct pattern performance
            self.pattern_performance = defaultdict(list)
            for pattern_str, scores in state_data.get('pattern_performance', {}).items():
                pattern = PromptPattern(pattern_str)
                self.pattern_performance[pattern] = scores
            
            # Reconstruct strategy effectiveness
            self.strategy_effectiveness = defaultdict(list)
            for strategy_str, scores in state_data.get('strategy_effectiveness', {}).items():
                strategy = OptimizationStrategy(strategy_str)
                self.strategy_effectiveness[strategy] = scores
            
            self.learning_history = state_data.get('learning_history', [])
            
            logger.info(f"Optimization state loaded from {filepath}")
            
        except Exception as e:
            logger.error(f"Failed to load optimization state: {e}")


# High-level convenience functions
class OptimizationWorkflow:
    """High-level workflow for prompt optimization"""
    
    def __init__(self, engine: AdaptiveOptimizationEngine):
        self.engine = engine
    
    async def optimize_and_test(self, prompt: str, strategy: OptimizationStrategy, 
                               test_executions: int = 50) -> Dict[str, Any]:
        """Complete optimization and testing workflow"""
        
        # Create optimization request
        request = self.engine.create_optimization_request(prompt, strategy)
        
        # Generate optimized versions
        versions = await self.engine.optimize_prompt(request)
        
        # Simulate testing (in real implementation, these would be actual executions)
        for version in versions:
            for _ in range(test_executions):
                # Simulate execution results
                success = np.random.random() > 0.2  # 80% success rate
                tokens = int(np.random.normal(500, 100))
                execution_time = np.random.exponential(2.0)
                quality_score = np.random.beta(2, 1)  # Skewed towards higher scores
                
                self.engine.record_execution_result(
                    version.id, success, tokens, execution_time, quality_score
                )
        
        # Get best version
        best_version = self.engine.get_best_version(request.id)
        
        return {
            'request_id': request.id,
            'original_prompt': prompt,
            'optimized_versions': len(versions),
            'best_version': best_version.to_dict() if best_version else None,
            'optimization_analysis': self.engine.analyze_optimization_patterns()
        }


# Example usage
async def main():
    """Example usage of the Adaptive Optimization Engine"""
    
    # Initialize engine
    engine = AdaptiveOptimizationEngine()
    workflow = OptimizationWorkflow(engine)
    
    # Test prompt
    test_prompt = """
    Please analyze the provided code and identify any security vulnerabilities.
    Look for common issues like SQL injection, XSS, and authentication problems.
    Provide recommendations for fixing any issues found.
    """
    
    # Optimize and test
    result = await workflow.optimize_and_test(
        test_prompt, 
        OptimizationStrategy.ACCURACY,
        test_executions=100
    )
    
    print("Optimization Results:")
    print(json.dumps(result, indent=2))
    
    # Get optimization suggestions
    suggestions = engine.get_optimization_suggestions(
        test_prompt, 
        {'task_type': 'security_analysis'}
    )
    
    print("\nOptimization Suggestions:")
    for suggestion in suggestions:
        print(f"- {suggestion['suggestion']} (Priority: {suggestion['priority']})")
    
    # Save state
    engine.save_optimization_state("optimization_engine_state.json")


if __name__ == "__main__":
    asyncio.run(main())