#!/usr/bin/env python3
"""
Intelligent Prompt Orchestrator with Self-Healing Loops
======================================================

A comprehensive system for creating, optimizing, and managing prompt chains
with automatic error recovery, performance monitoring, and adaptive optimization.

Key Features:
- Self-healing execution loops with automatic retry mechanisms
- Intelligent context management and memory integration
- Real-time performance monitoring and optimization
- Adaptive prompt enhancement based on execution results
- Multi-modal MCP server integration
- Contextual error recovery and fallback strategies
"""

import asyncio
import json
import logging
import time
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any, Callable, Union
from pathlib import Path
import uuid
import statistics
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ExecutionStatus(Enum):
    """Execution status for prompt chains"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    OPTIMIZING = "optimizing"
    RECOVERING = "recovering"


class PromptType(Enum):
    """Types of prompts in the system"""
    ANALYSIS = "analysis"
    GENERATION = "generation"
    OPTIMIZATION = "optimization"
    VALIDATION = "validation"
    COORDINATION = "coordination"
    RECOVERY = "recovery"


@dataclass
class ExecutionMetrics:
    """Metrics for prompt execution"""
    execution_time: float = 0.0
    token_usage: Dict[str, int] = field(default_factory=dict)
    success_rate: float = 0.0
    retry_count: int = 0
    error_count: int = 0
    optimization_iterations: int = 0
    context_efficiency: float = 0.0
    memory_usage: float = 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'execution_time': self.execution_time,
            'token_usage': self.token_usage,
            'success_rate': self.success_rate,
            'retry_count': self.retry_count,
            'error_count': self.error_count,
            'optimization_iterations': self.optimization_iterations,
            'context_efficiency': self.context_efficiency,
            'memory_usage': self.memory_usage
        }


@dataclass
class PromptNode:
    """Individual prompt node in a chain"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    prompt_type: PromptType = PromptType.ANALYSIS
    content: str = ""
    dependencies: List[str] = field(default_factory=list)
    fallback_prompts: List[str] = field(default_factory=list)
    max_retries: int = 3
    timeout: float = 30.0
    optimization_enabled: bool = True
    context_requirements: Dict[str, Any] = field(default_factory=dict)
    expected_output_format: str = ""
    validation_criteria: Dict[str, Any] = field(default_factory=dict)
    
    # Execution state
    status: ExecutionStatus = ExecutionStatus.PENDING
    metrics: ExecutionMetrics = field(default_factory=ExecutionMetrics)
    output: Optional[str] = None
    error_history: List[str] = field(default_factory=list)
    last_executed: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'prompt_type': self.prompt_type.value,
            'content': self.content,
            'dependencies': self.dependencies,
            'fallback_prompts': self.fallback_prompts,
            'max_retries': self.max_retries,
            'timeout': self.timeout,
            'optimization_enabled': self.optimization_enabled,
            'context_requirements': self.context_requirements,
            'expected_output_format': self.expected_output_format,
            'validation_criteria': self.validation_criteria,
            'status': self.status.value,
            'metrics': self.metrics.to_dict(),
            'output': self.output,
            'error_history': self.error_history,
            'last_executed': self.last_executed.isoformat() if self.last_executed else None
        }


@dataclass
class PromptChain:
    """A chain of interconnected prompts with execution orchestration"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    nodes: Dict[str, PromptNode] = field(default_factory=dict)
    execution_order: List[str] = field(default_factory=list)
    global_context: Dict[str, Any] = field(default_factory=dict)
    healing_enabled: bool = True
    optimization_threshold: float = 0.8
    memory_integration: bool = True
    
    # Execution state
    status: ExecutionStatus = ExecutionStatus.PENDING
    metrics: ExecutionMetrics = field(default_factory=ExecutionMetrics)
    execution_history: List[Dict[str, Any]] = field(default_factory=list)
    
    def add_node(self, node: PromptNode) -> None:
        """Add a node to the chain"""
        self.nodes[node.id] = node
        if node.id not in self.execution_order:
            self.execution_order.append(node.id)
    
    def add_dependency(self, node_id: str, depends_on: str) -> None:
        """Add a dependency between nodes"""
        if node_id in self.nodes:
            self.nodes[node_id].dependencies.append(depends_on)
    
    def validate_chain(self) -> List[str]:
        """Validate the chain structure and return any issues"""
        issues = []
        
        # Check for missing dependencies
        for node_id, node in self.nodes.items():
            for dep in node.dependencies:
                if dep not in self.nodes:
                    issues.append(f"Node {node_id} depends on missing node {dep}")
        
        # Check for circular dependencies
        visited = set()
        rec_stack = set()
        
        def has_cycle(node_id: str) -> bool:
            visited.add(node_id)
            rec_stack.add(node_id)
            
            if node_id in self.nodes:
                for dep in self.nodes[node_id].dependencies:
                    if dep not in visited:
                        if has_cycle(dep):
                            return True
                    elif dep in rec_stack:
                        return True
            
            rec_stack.remove(node_id)
            return False
        
        for node_id in self.nodes:
            if node_id not in visited:
                if has_cycle(node_id):
                    issues.append(f"Circular dependency detected involving node {node_id}")
        
        return issues
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'nodes': {k: v.to_dict() for k, v in self.nodes.items()},
            'execution_order': self.execution_order,
            'global_context': self.global_context,
            'healing_enabled': self.healing_enabled,
            'optimization_threshold': self.optimization_threshold,
            'memory_integration': self.memory_integration,
            'status': self.status.value,
            'metrics': self.metrics.to_dict(),
            'execution_history': self.execution_history
        }


class PromptOrchestrator:
    """
    Main orchestrator for managing prompt chains with self-healing capabilities
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.chains: Dict[str, PromptChain] = {}
        self.execution_queue: List[str] = []
        self.active_executions: Dict[str, asyncio.Task] = {}
        self.performance_history: List[Dict[str, Any]] = []
        self.optimization_rules: Dict[str, Callable] = {}
        self.healing_strategies: Dict[str, Callable] = {}
        self.memory_context: Dict[str, Any] = {}
        
        # Initialize built-in strategies
        self._initialize_healing_strategies()
        self._initialize_optimization_rules()
        
        logger.info("Prompt Orchestrator initialized")
    
    def _initialize_healing_strategies(self) -> None:
        """Initialize built-in healing strategies"""
        
        def retry_with_backoff(node: PromptNode, error: Exception) -> bool:
            """Exponential backoff retry strategy"""
            if node.metrics.retry_count < node.max_retries:
                wait_time = 2 ** node.metrics.retry_count
                time.sleep(wait_time)
                node.metrics.retry_count += 1
                return True
            return False
        
        def fallback_prompt_strategy(node: PromptNode, error: Exception) -> bool:
            """Use fallback prompts on failure"""
            if node.fallback_prompts and node.metrics.retry_count < len(node.fallback_prompts):
                fallback_content = node.fallback_prompts[node.metrics.retry_count]
                node.content = fallback_content
                node.metrics.retry_count += 1
                return True
            return False
        
        def context_reduction_strategy(node: PromptNode, error: Exception) -> bool:
            """Reduce context size on token limit errors"""
            if "token" in str(error).lower() and len(node.content) > 1000:
                # Truncate content to 80% of original size
                new_length = int(len(node.content) * 0.8)
                node.content = node.content[:new_length]
                node.metrics.retry_count += 1
                return True
            return False
        
        self.healing_strategies.update({
            'retry_backoff': retry_with_backoff,
            'fallback_prompts': fallback_prompt_strategy,
            'context_reduction': context_reduction_strategy
        })
    
    def _initialize_optimization_rules(self) -> None:
        """Initialize built-in optimization rules"""
        
        def optimize_for_speed(node: PromptNode) -> PromptNode:
            """Optimize prompt for faster execution"""
            if node.metrics.execution_time > 10.0:
                # Add instructions for concise responses
                if "be concise" not in node.content.lower():
                    node.content += "\n\nPlease provide a concise response."
            return node
        
        def optimize_for_accuracy(node: PromptNode) -> PromptNode:
            """Optimize prompt for better accuracy"""
            if node.metrics.success_rate < 0.8:
                # Add step-by-step instructions
                if "step by step" not in node.content.lower():
                    node.content = "Please approach this step by step:\n\n" + node.content
            return node
        
        def optimize_token_usage(node: PromptNode) -> PromptNode:
            """Optimize for token efficiency"""
            total_tokens = sum(node.metrics.token_usage.values())
            if total_tokens > 4000:
                # Add token usage instructions
                if "efficient" not in node.content.lower():
                    node.content += "\n\nPlease be token-efficient in your response."
            return node
        
        self.optimization_rules.update({
            'speed_optimization': optimize_for_speed,
            'accuracy_optimization': optimize_for_accuracy,
            'token_optimization': optimize_token_usage
        })
    
    def create_chain(self, name: str, description: str = "") -> PromptChain:
        """Create a new prompt chain"""
        chain = PromptChain(name=name, description=description)
        self.chains[chain.id] = chain
        logger.info(f"Created prompt chain: {name} ({chain.id})")
        return chain
    
    def add_healing_strategy(self, name: str, strategy: Callable[[PromptNode, Exception], bool]) -> None:
        """Add a custom healing strategy"""
        self.healing_strategies[name] = strategy
        logger.info(f"Added healing strategy: {name}")
    
    def add_optimization_rule(self, name: str, rule: Callable[[PromptNode], PromptNode]) -> None:
        """Add a custom optimization rule"""
        self.optimization_rules[name] = rule
        logger.info(f"Added optimization rule: {name}")
    
    async def execute_chain(self, chain_id: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Execute a prompt chain with self-healing capabilities
        """
        if chain_id not in self.chains:
            raise ValueError(f"Chain {chain_id} not found")
        
        chain = self.chains[chain_id]
        chain.status = ExecutionStatus.IN_PROGRESS
        
        # Update global context
        if context:
            chain.global_context.update(context)
        
        # Validate chain before execution
        issues = chain.validate_chain()
        if issues:
            chain.status = ExecutionStatus.FAILED
            return {
                'status': 'failed',
                'errors': issues,
                'chain_id': chain_id
            }
        
        start_time = time.time()
        results = {}
        
        try:
            # Execute nodes in dependency order
            execution_order = self._calculate_execution_order(chain)
            
            for node_id in execution_order:
                node = chain.nodes[node_id]
                
                # Check if dependencies are satisfied
                deps_satisfied = all(
                    dep in results and results[dep].get('status') == 'completed'
                    for dep in node.dependencies
                )
                
                if not deps_satisfied:
                    logger.warning(f"Dependencies not satisfied for node {node_id}")
                    continue
                
                # Execute node with healing
                node_result = await self._execute_node_with_healing(node, chain, results)
                results[node_id] = node_result
                
                # Update chain context with results
                chain.global_context[f"node_{node_id}_output"] = node_result.get('output')
                
                # Trigger optimization if enabled
                if node.optimization_enabled and node_result.get('status') == 'completed':
                    await self._optimize_node(node, chain)
            
            # Calculate overall metrics
            chain.metrics.execution_time = time.time() - start_time
            chain.metrics.success_rate = len([r for r in results.values() if r.get('status') == 'completed']) / len(results)
            chain.status = ExecutionStatus.COMPLETED if chain.metrics.success_rate > 0.5 else ExecutionStatus.FAILED
            
            # Store execution history
            execution_record = {
                'timestamp': datetime.now().isoformat(),
                'chain_id': chain_id,
                'results': results,
                'metrics': chain.metrics.to_dict()
            }
            chain.execution_history.append(execution_record)
            self.performance_history.append(execution_record)
            
            logger.info(f"Chain {chain_id} executed with {chain.metrics.success_rate:.2%} success rate")
            
            return {
                'status': 'completed',
                'chain_id': chain_id,
                'results': results,
                'metrics': chain.metrics.to_dict()
            }
            
        except Exception as e:
            chain.status = ExecutionStatus.FAILED
            logger.error(f"Chain execution failed: {e}")
            return {
                'status': 'failed',
                'chain_id': chain_id,
                'error': str(e),
                'traceback': traceback.format_exc()
            }
    
    async def _execute_node_with_healing(self, node: PromptNode, chain: PromptChain, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single node with healing strategies"""
        node.status = ExecutionStatus.IN_PROGRESS
        start_time = time.time()
        
        for attempt in range(node.max_retries + 1):
            try:
                # Build context for this node
                node_context = {
                    **chain.global_context,
                    **context,
                    'node_requirements': node.context_requirements
                }
                
                # Execute the prompt (this would interface with actual MCP servers)
                result = await self._execute_prompt(node, node_context)
                
                # Validate result
                if self._validate_node_output(node, result):
                    node.status = ExecutionStatus.COMPLETED
                    node.output = result
                    node.metrics.execution_time = time.time() - start_time
                    node.metrics.success_rate = 1.0
                    node.last_executed = datetime.now()
                    
                    return {
                        'status': 'completed',
                        'output': result,
                        'metrics': node.metrics.to_dict()
                    }
                else:
                    raise ValueError("Output validation failed")
                    
            except Exception as e:
                node.error_history.append(str(e))
                node.metrics.error_count += 1
                
                if attempt < node.max_retries:
                    node.status = ExecutionStatus.RETRYING
                    
                    # Apply healing strategies
                    healed = False
                    for strategy_name, strategy in self.healing_strategies.items():
                        try:
                            if strategy(node, e):
                                healed = True
                                logger.info(f"Applied healing strategy {strategy_name} to node {node.id}")
                                break
                        except Exception as healing_error:
                            logger.error(f"Healing strategy {strategy_name} failed: {healing_error}")
                    
                    if not healed:
                        logger.warning(f"No healing strategy worked for node {node.id}")
                        time.sleep(1)  # Basic backoff
                else:
                    node.status = ExecutionStatus.FAILED
                    node.metrics.execution_time = time.time() - start_time
                    
                    return {
                        'status': 'failed',
                        'error': str(e),
                        'error_history': node.error_history,
                        'metrics': node.metrics.to_dict()
                    }
        
        node.status = ExecutionStatus.FAILED
        return {
            'status': 'failed',
            'error': 'Max retries exceeded',
            'metrics': node.metrics.to_dict()
        }
    
    async def _execute_prompt(self, node: PromptNode, context: Dict[str, Any]) -> str:
        """
        Execute a prompt - this would interface with actual MCP servers
        For now, this is a placeholder that simulates execution
        """
        # This would be replaced with actual MCP server integration
        # For example:
        # - Use mcp__sequential-thinking for complex reasoning
        # - Use mcp__memory for context management
        # - Use mcp__filesystem for file operations
        # - Use mcp__desktop-commander for system interactions
        
        # Simulate execution delay
        await asyncio.sleep(0.1)
        
        # Return simulated result
        return f"Executed: {node.name} with context keys: {list(context.keys())}"
    
    def _validate_node_output(self, node: PromptNode, output: str) -> bool:
        """Validate node output against criteria"""
        if not node.validation_criteria:
            return True
        
        # Basic validation examples
        if 'min_length' in node.validation_criteria:
            if len(output) < node.validation_criteria['min_length']:
                return False
        
        if 'required_keywords' in node.validation_criteria:
            keywords = node.validation_criteria['required_keywords']
            if not all(keyword.lower() in output.lower() for keyword in keywords):
                return False
        
        return True
    
    async def _optimize_node(self, node: PromptNode, chain: PromptChain) -> None:
        """Apply optimization rules to a node"""
        node.status = ExecutionStatus.OPTIMIZING
        
        # Apply all optimization rules
        for rule_name, rule in self.optimization_rules.items():
            try:
                optimized_node = rule(node)
                if optimized_node != node:
                    node.metrics.optimization_iterations += 1
                    logger.info(f"Applied optimization rule {rule_name} to node {node.id}")
            except Exception as e:
                logger.error(f"Optimization rule {rule_name} failed: {e}")
        
        node.status = ExecutionStatus.COMPLETED
    
    def _calculate_execution_order(self, chain: PromptChain) -> List[str]:
        """Calculate optimal execution order based on dependencies"""
        # Topological sort implementation
        in_degree = {node_id: 0 for node_id in chain.nodes}
        
        # Calculate in-degrees
        for node_id, node in chain.nodes.items():
            for dep in node.dependencies:
                if dep in in_degree:
                    in_degree[node_id] += 1
        
        # Kahn's algorithm
        queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
        result = []
        
        while queue:
            current = queue.pop(0)
            result.append(current)
            
            if current in chain.nodes:
                for node_id, node in chain.nodes.items():
                    if current in node.dependencies:
                        in_degree[node_id] -= 1
                        if in_degree[node_id] == 0:
                            queue.append(node_id)
        
        return result
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get comprehensive performance metrics"""
        if not self.performance_history:
            return {}
        
        execution_times = [record['metrics']['execution_time'] for record in self.performance_history]
        success_rates = [record['metrics']['success_rate'] for record in self.performance_history]
        
        return {
            'total_executions': len(self.performance_history),
            'average_execution_time': statistics.mean(execution_times),
            'median_execution_time': statistics.median(execution_times),
            'average_success_rate': statistics.mean(success_rates),
            'overall_success_rate': sum(success_rates) / len(success_rates),
            'chains_managed': len(self.chains),
            'healing_strategies': len(self.healing_strategies),
            'optimization_rules': len(self.optimization_rules)
        }
    
    def save_configuration(self, filepath: str) -> None:
        """Save orchestrator configuration and chains"""
        config_data = {
            'config': self.config,
            'chains': {k: v.to_dict() for k, v in self.chains.items()},
            'performance_history': self.performance_history,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(filepath, 'w') as f:
            json.dump(config_data, f, indent=2)
        
        logger.info(f"Configuration saved to {filepath}")
    
    def load_configuration(self, filepath: str) -> None:
        """Load orchestrator configuration and chains"""
        with open(filepath, 'r') as f:
            config_data = json.load(f)
        
        self.config = config_data.get('config', {})
        self.performance_history = config_data.get('performance_history', [])
        
        # Reconstruct chains
        for chain_id, chain_data in config_data.get('chains', {}).items():
            chain = PromptChain(
                id=chain_data['id'],
                name=chain_data['name'],
                description=chain_data['description'],
                execution_order=chain_data['execution_order'],
                global_context=chain_data['global_context'],
                healing_enabled=chain_data['healing_enabled'],
                optimization_threshold=chain_data['optimization_threshold'],
                memory_integration=chain_data['memory_integration']
            )
            
            # Reconstruct nodes
            for node_id, node_data in chain_data['nodes'].items():
                node = PromptNode(
                    id=node_data['id'],
                    name=node_data['name'],
                    prompt_type=PromptType(node_data['prompt_type']),
                    content=node_data['content'],
                    dependencies=node_data['dependencies'],
                    fallback_prompts=node_data['fallback_prompts'],
                    max_retries=node_data['max_retries'],
                    timeout=node_data['timeout'],
                    optimization_enabled=node_data['optimization_enabled'],
                    context_requirements=node_data['context_requirements'],
                    expected_output_format=node_data['expected_output_format'],
                    validation_criteria=node_data['validation_criteria']
                )
                chain.nodes[node_id] = node
            
            self.chains[chain_id] = chain
        
        logger.info(f"Configuration loaded from {filepath}")


# Example usage and testing
async def main():
    """Example usage of the Intelligent Prompt Orchestrator"""
    
    # Initialize orchestrator
    orchestrator = PromptOrchestrator()
    
    # Create a sample chain
    chain = orchestrator.create_chain("Code Analysis Chain", "Analyze code for security and optimization")
    
    # Add analysis node
    analysis_node = PromptNode(
        name="Security Analysis",
        prompt_type=PromptType.ANALYSIS,
        content="Analyze the provided code for security vulnerabilities and suggest improvements.",
        context_requirements={"code_content": "required"},
        validation_criteria={"min_length": 100, "required_keywords": ["security", "vulnerability"]},
        fallback_prompts=["Provide a basic security assessment of the code."]
    )
    chain.add_node(analysis_node)
    
    # Add optimization node
    optimization_node = PromptNode(
        name="Performance Optimization",
        prompt_type=PromptType.OPTIMIZATION,
        content="Suggest performance optimizations for the analyzed code.",
        dependencies=[analysis_node.id],
        context_requirements={"analysis_results": "required"},
        validation_criteria={"min_length": 50}
    )
    chain.add_node(optimization_node)
    
    # Add report generation node
    report_node = PromptNode(
        name="Report Generation",
        prompt_type=PromptType.GENERATION,
        content="Generate a comprehensive report combining security analysis and optimization suggestions.",
        dependencies=[analysis_node.id, optimization_node.id],
        expected_output_format="markdown",
        validation_criteria={"min_length": 200}
    )
    chain.add_node(report_node)
    
    # Execute the chain
    context = {
        "code_content": "def process_user_input(user_input): return eval(user_input)",
        "target_language": "python"
    }
    
    result = await orchestrator.execute_chain(chain.id, context)
    
    print("Execution Result:")
    print(json.dumps(result, indent=2))
    
    # Show performance metrics
    metrics = orchestrator.get_performance_metrics()
    print("\nPerformance Metrics:")
    print(json.dumps(metrics, indent=2))
    
    # Save configuration
    orchestrator.save_configuration("orchestrator_config.json")


if __name__ == "__main__":
    asyncio.run(main())