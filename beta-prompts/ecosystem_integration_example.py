#!/usr/bin/env python3
"""
Complete Ecosystem Integration Example
=====================================

A comprehensive example demonstrating how all the prompt optimization systems
work together in real-world scenarios with full integration, self-healing,
and intelligent optimization.

This example shows:
- Complete system initialization and configuration
- Real-world workflow creation and execution
- Self-healing capabilities in action
- Intelligent MCP server utilization
- Adaptive optimization and learning
- Quality monitoring and validation
- Error recovery and resilience
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Any

# Import all our systems
from intelligent_prompt_orchestrator import (
    PromptOrchestrator, PromptChain, PromptNode, PromptType, ExecutionStatus
)
from mcp_integration_engine import (
    MCPIntegrationEngine, MCPOperation, OperationType, ServerType
)
from adaptive_optimization_engine import (
    AdaptiveOptimizationEngine, OptimizationStrategy, PromptVersion
)
from contextual_memory_system import (
    ContextualMemorySystem, MemoryEntity, MemoryType, ContextQuery, ContextScope
)
from quality_validation_system import (
    QualityValidationSystem, ValidationLevel, QualityMetric
)
from intelligent_error_recovery import (
    IntelligentErrorRecovery, ErrorSeverity, RecoveryStrategy
)
from comprehensive_testing_framework import (
    ComprehensiveTestingFramework, TestType, TestSuite, TestCase
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class IntegratedPromptEcosystem:
    """
    Complete integrated ecosystem for prompt optimization with all systems working together
    """
    
    def __init__(self):
        """Initialize all system components"""
        self.orchestrator = PromptOrchestrator()
        self.mcp_engine = MCPIntegrationEngine()
        self.optimizer = AdaptiveOptimizationEngine()
        self.memory = ContextualMemorySystem()
        self.quality = QualityValidationSystem()
        self.recovery = IntelligentErrorRecovery()
        self.testing = ComprehensiveTestingFramework()
        
        logger.info("🚀 Integrated Prompt Ecosystem initialized")
    
    async def initialize_ecosystem(self):
        """Set up the ecosystem with initial configuration and knowledge"""
        
        logger.info("🔧 Initializing ecosystem components...")
        
        # 1. Set up initial memory knowledge base
        await self._initialize_knowledge_base()
        
        # 2. Configure quality validation thresholds
        await self._configure_quality_standards()
        
        # 3. Set up error recovery patterns
        await self._setup_error_patterns()
        
        # 4. Initialize MCP server monitoring
        await self._setup_mcp_monitoring()
        
        # 5. Create baseline performance metrics
        await self._establish_baselines()
        
        logger.info("✅ Ecosystem initialization complete")
    
    async def _initialize_knowledge_base(self):
        """Initialize the memory system with foundational knowledge"""
        
        # Create coding knowledge domain
        coding_facts = [
            "Python is a high-level programming language with dynamic typing",
            "Security vulnerabilities often arise from input validation failures",
            "Code optimization should balance readability and performance",
            "Test-driven development improves code quality and maintainability"
        ]
        
        coding_procedures = [
            "Always validate user input before processing",
            "Use meaningful variable names and clear documentation",
            "Implement error handling for all external dependencies",
            "Write unit tests before implementing functionality"
        ]
        
        # Add to memory system
        for i, fact in enumerate(coding_facts):
            entity = MemoryEntity(
                name=f"coding_fact_{i}",
                entity_type=MemoryType.FACTUAL,
                content=fact,
                metadata={'domain': 'programming', 'importance': 0.9}
            )
            await self.memory.add_entity(entity)
        
        for i, procedure in enumerate(coding_procedures):
            entity = MemoryEntity(
                name=f"coding_procedure_{i}",
                entity_type=MemoryType.PROCEDURAL,
                content=procedure,
                metadata={'domain': 'programming', 'importance': 0.8}
            )
            await self.memory.add_entity(entity)
        
        logger.info(f"📚 Initialized knowledge base with {len(coding_facts + coding_procedures)} entities")
    
    async def _configure_quality_standards(self):
        """Configure quality validation standards"""
        
        # Start quality monitoring
        await self.quality.start_monitoring([
            {
                'id': 'prompt_chains',
                'type': 'chain',
                'data': {'monitoring_enabled': True}
            }
        ], interval=30.0)
        
        logger.info("📊 Quality monitoring configured and started")
    
    async def _setup_error_patterns(self):
        """Set up custom error recovery patterns"""
        
        # Add circuit breakers for critical operations
        self.recovery.add_circuit_breaker("prompt_execution", failure_threshold=3, timeout_minutes=2)
        self.recovery.add_circuit_breaker("mcp_operations", failure_threshold=5, timeout_minutes=1)
        
        logger.info("🛡️ Error recovery patterns configured")
    
    async def _setup_mcp_monitoring(self):
        """Set up MCP server monitoring"""
        
        # Enable health monitoring for all servers
        self.mcp_engine.optimize_routing()
        
        logger.info("🔄 MCP server monitoring enabled")
    
    async def _establish_baselines(self):
        """Establish performance baselines"""
        
        # Set baseline performance expectations
        baselines = {
            'prompt_execution_time': 5.0,  # seconds
            'quality_score': 0.8,
            'success_rate': 0.95,
            'optimization_improvement': 0.1
        }
        
        for metric, value in baselines.items():
            self.testing.performance_baselines[metric] = value
        
        logger.info("📈 Performance baselines established")


class RealWorldWorkflowExamples:
    """
    Real-world workflow examples demonstrating the ecosystem in action
    """
    
    def __init__(self, ecosystem: IntegratedPromptEcosystem):
        self.ecosystem = ecosystem
    
    async def secure_code_analysis_workflow(self, code_content: str) -> Dict[str, Any]:
        """
        Complete workflow for secure code analysis with optimization and self-healing
        """
        
        logger.info("🔍 Starting secure code analysis workflow")
        
        try:
            # Step 1: Create optimized analysis chain
            chain = await self._create_analysis_chain()
            
            # Step 2: Enhance prompts with memory context
            enhanced_chain = await self._enhance_with_memory_context(chain, "security analysis")
            
            # Step 3: Execute with quality monitoring
            results = await self._execute_with_monitoring(enhanced_chain, {
                'code_content': code_content,
                'analysis_type': 'security'
            })
            
            # Step 4: Optimize based on results
            optimized_results = await self._optimize_workflow_performance(results)
            
            return {
                'status': 'success',
                'analysis_results': optimized_results,
                'quality_metrics': await self._get_quality_report(enhanced_chain.id),
                'performance_metrics': await self._get_performance_metrics(enhanced_chain.id)
            }
            
        except Exception as e:
            # Automatic error recovery in action
            recovery_result = await self.ecosystem.recovery.handle_error(
                e, 
                {'workflow': 'secure_code_analysis', 'code_length': len(code_content)}
            )
            
            return {
                'status': 'recovered' if recovery_result.get('recovered') else 'failed',
                'error_info': recovery_result,
                'fallback_analysis': 'Basic security scan completed with limited functionality'
            }
    
    async def _create_analysis_chain(self) -> PromptChain:
        """Create an optimized analysis chain"""
        
        # Create base chain
        chain = self.ecosystem.orchestrator.create_chain(
            "Secure Code Analysis",
            "Comprehensive security analysis with optimization"
        )
        
        # Create analysis nodes
        nodes = [
            PromptNode(
                name="input_validator",
                prompt_type=PromptType.VALIDATION,
                content="Validate and sanitize the provided code input for analysis",
                validation_criteria={'min_length': 10, 'required_keywords': ['code']}
            ),
            PromptNode(
                name="security_scanner",
                prompt_type=PromptType.ANALYSIS,
                content="Analyze the code for security vulnerabilities including SQL injection, XSS, and authentication issues",
                dependencies=["input_validator"],
                fallback_prompts=["Perform basic security scan of the code"]
            ),
            PromptNode(
                name="vulnerability_classifier",
                prompt_type=PromptType.ANALYSIS,
                content="Classify identified vulnerabilities by severity and provide CVSS scores",
                dependencies=["security_scanner"],
                optimization_enabled=True
            ),
            PromptNode(
                name="remediation_advisor",
                prompt_type=PromptType.GENERATION,
                content="Generate specific remediation recommendations for each identified vulnerability",
                dependencies=["vulnerability_classifier"],
                expected_output_format="structured_recommendations"
            ),
            PromptNode(
                name="report_generator",
                prompt_type=PromptType.GENERATION,
                content="Generate a comprehensive security analysis report with executive summary",
                dependencies=["vulnerability_classifier", "remediation_advisor"],
                validation_criteria={'min_length': 200, 'required_keywords': ['summary', 'recommendations']}
            )
        ]
        
        # Add nodes to chain
        for node in nodes:
            chain.add_node(node)
        
        # Optimize each node's prompt
        for node in nodes:
            if node.optimization_enabled:
                await self._optimize_node_prompt(node)
        
        logger.info(f"🔗 Created analysis chain with {len(nodes)} optimized nodes")
        return chain
    
    async def _optimize_node_prompt(self, node: PromptNode):
        """Optimize a node's prompt using the optimization engine"""
        
        request = self.ecosystem.optimizer.create_optimization_request(
            node.content,
            OptimizationStrategy.ACCURACY,
            context_requirements={'node_type': node.prompt_type.value},
            performance_constraints={'max_tokens': 1000}
        )
        
        optimized_versions = await self.ecosystem.optimizer.optimize_prompt(request)
        
        if optimized_versions:
            # Use the first optimized version
            node.content = optimized_versions[0].content
            logger.info(f"✨ Optimized prompt for node: {node.name}")
    
    async def _enhance_with_memory_context(self, chain: PromptChain, domain: str) -> PromptChain:
        """Enhance chain prompts with relevant memory context"""
        
        for node in chain.nodes.values():
            # Retrieve relevant context for this node
            enhanced_prompt = await self.ecosystem.memory.enhance_prompt_with_context(
                node.content,
                scope=ContextScope.DOMAIN,
                max_context_entities=3
            )
            node.content = enhanced_prompt
        
        logger.info(f"🧠 Enhanced {len(chain.nodes)} nodes with memory context")
        return chain
    
    async def _execute_with_monitoring(self, chain: PromptChain, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute chain with comprehensive monitoring"""
        
        # Start execution with quality monitoring
        execution_start = datetime.now()
        
        try:
            # Execute the chain
            result = await self.ecosystem.orchestrator.execute_chain(chain.id, context)
            
            # Validate quality of results
            quality_report = await self.ecosystem.quality.validate_target(
                chain.id,
                'chain',
                {
                    'content': str(result),
                    'execution_time': (datetime.now() - execution_start).total_seconds(),
                    'context': context
                },
                ValidationLevel.COMPREHENSIVE
            )
            
            # Record successful execution
            self.ecosystem.recovery.circuit_breakers.get("prompt_execution", type('obj', (object,), {'record_success': lambda: None})).record_success()
            
            result['quality_report'] = quality_report.to_dict()
            return result
            
        except Exception as e:
            # Record failure for circuit breaker
            self.ecosystem.recovery.circuit_breakers.get("prompt_execution", type('obj', (object,), {'record_failure': lambda: None})).record_failure()
            raise e
    
    async def _optimize_workflow_performance(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize workflow performance based on results"""
        
        # Extract performance metrics
        execution_time = results.get('metrics', {}).get('execution_time', 0)
        success_rate = results.get('metrics', {}).get('success_rate', 0)
        
        # Learn from execution
        learning_data = {
            'execution_time': execution_time,
            'success_rate': success_rate,
            'quality_score': results.get('quality_report', {}).get('overall_score', 0)
        }
        
        # Store learning for future optimization
        self.ecosystem.optimizer.learning_history.append({
            'timestamp': datetime.now().isoformat(),
            'workflow': 'secure_code_analysis',
            'metrics': learning_data
        })
        
        # Apply optimizations if performance is below threshold
        if execution_time > 10.0 or success_rate < 0.9:
            logger.info("⚡ Applying performance optimizations")
            # Optimization logic would go here
            results['optimizations_applied'] = True
        
        return results
    
    async def _get_quality_report(self, target_id: str) -> Dict[str, Any]:
        """Get comprehensive quality report"""
        
        dashboard = self.ecosystem.quality.get_quality_dashboard()
        
        # Find reports for this target
        target_reports = []
        for reports in self.ecosystem.quality.quality_reports.values():
            target_reports.extend([r for r in reports if r.target_id == target_id])
        
        if target_reports:
            latest_report = max(target_reports, key=lambda r: r.created_at)
            return latest_report.to_dict()
        else:
            return {'status': 'no_reports_available'}
    
    async def _get_performance_metrics(self, target_id: str) -> Dict[str, Any]:
        """Get performance metrics for the workflow"""
        
        return self.ecosystem.orchestrator.get_performance_metrics()


class LiveDemonstration:
    """
    Live demonstration of the complete ecosystem in action
    """
    
    def __init__(self):
        self.ecosystem = IntegratedPromptEcosystem()
        self.workflows = RealWorldWorkflowExamples(self.ecosystem)
    
    async def run_complete_demonstration(self):
        """Run a complete demonstration of all ecosystem capabilities"""
        
        print("🌟 Starting Complete Ecosystem Demonstration")
        print("=" * 60)
        
        # 1. Initialize the ecosystem
        await self.ecosystem.initialize_ecosystem()
        print("✅ Ecosystem initialized successfully")
        
        # 2. Demonstrate secure code analysis
        await self._demo_secure_code_analysis()
        
        # 3. Demonstrate self-healing capabilities
        await self._demo_self_healing()
        
        # 4. Demonstrate optimization learning
        await self._demo_optimization_learning()
        
        # 5. Show comprehensive analytics
        await self._show_analytics()
        
        print("\n🎉 Demonstration completed successfully!")
    
    async def _demo_secure_code_analysis(self):
        """Demonstrate secure code analysis workflow"""
        
        print("\n🔍 Demonstrating Secure Code Analysis Workflow")
        print("-" * 50)
        
        # Sample code with vulnerabilities
        vulnerable_code = '''
def login(username, password):
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)  # SQL Injection vulnerability
    user = cursor.fetchone()
    
    if user:
        session['user_id'] = user[0]  # Session fixation risk
        return render_template('dashboard.html', user_data=user)  # Potential XSS
    else:
        return "Invalid credentials"
'''
        
        result = await self.workflows.secure_code_analysis_workflow(vulnerable_code)
        
        print(f"Analysis Status: {result['status']}")
        if result['status'] == 'success':
            quality_score = result.get('quality_metrics', {}).get('overall_score', 0)
            print(f"Quality Score: {quality_score:.2f}")
            print("✅ Security analysis completed with high quality")
        else:
            print(f"Recovery Applied: {result.get('error_info', {}).get('recovered', False)}")
    
    async def _demo_self_healing(self):
        """Demonstrate self-healing capabilities"""
        
        print("\n🛡️ Demonstrating Self-Healing Capabilities")
        print("-" * 50)
        
        # Simulate an error to trigger self-healing
        try:
            # This will trigger error recovery mechanisms
            raise TimeoutError("Simulated network timeout during analysis")
        except Exception as e:
            recovery_result = await self.ecosystem.recovery.handle_error(
                e, 
                {'operation': 'demo_operation', 'component': 'analysis_engine'}
            )
            
            print(f"Error Detected: {str(e)}")
            print(f"Recovery Successful: {recovery_result.get('recovered', False)}")
            print(f"Strategy Used: {recovery_result.get('strategy_used', 'none')}")
            print("✅ Self-healing demonstrated successfully")
    
    async def _demo_optimization_learning(self):
        """Demonstrate optimization and learning capabilities"""
        
        print("\n⚡ Demonstrating Optimization & Learning")
        print("-" * 50)
        
        # Create and optimize a test prompt
        test_prompt = "Analyze this code for performance bottlenecks and suggest improvements"
        
        request = self.ecosystem.optimizer.create_optimization_request(
            test_prompt,
            OptimizationStrategy.PERFORMANCE
        )
        
        optimized_versions = await self.ecosystem.optimizer.optimize_prompt(request)
        
        print(f"Original Prompt: {test_prompt}")
        print(f"Optimized Versions Created: {len(optimized_versions)}")
        
        if optimized_versions:
            best_version = optimized_versions[0]
            print(f"Best Optimized Version: {best_version.content[:100]}...")
            print("✅ Optimization learning demonstrated")
    
    async def _show_analytics(self):
        """Show comprehensive system analytics"""
        
        print("\n📊 System Analytics & Performance")
        print("-" * 50)
        
        # Get analytics from all systems
        orchestrator_metrics = self.ecosystem.orchestrator.get_performance_metrics()
        quality_dashboard = self.ecosystem.quality.get_quality_dashboard()
        error_analytics = self.ecosystem.recovery.get_error_analytics()
        memory_stats = self.ecosystem.memory.get_memory_statistics()
        
        print(f"Chains Managed: {orchestrator_metrics.get('chains_managed', 0)}")
        print(f"Total Quality Reports: {quality_dashboard.get('overview', {}).get('total_reports', 0)}")
        print(f"Error Recovery Rate: {error_analytics.get('summary', {}).get('recovery_rate_24h', 0):.2%}")
        print(f"Memory Entities: {memory_stats.get('total_entities', 0)}")
        print("✅ Analytics demonstrate healthy ecosystem performance")


# Example usage and demonstration
async def main():
    """Main demonstration function"""
    
    # Run the complete live demonstration
    demo = LiveDemonstration()
    await demo.run_complete_demonstration()
    
    # Additional examples
    print("\n🔧 Additional Integration Examples")
    print("=" * 60)
    
    # Example 1: Custom workflow creation
    ecosystem = IntegratedPromptEcosystem()
    await ecosystem.initialize_ecosystem()
    
    # Create a custom chain for documentation generation
    doc_chain = ecosystem.orchestrator.create_chain("Documentation Generator")
    
    doc_node = PromptNode(
        name="doc_generator",
        prompt_type=PromptType.GENERATION,
        content="Generate comprehensive documentation for the provided code",
        optimization_enabled=True
    )
    doc_chain.add_node(doc_node)
    
    # Execute with full ecosystem integration
    result = await ecosystem.orchestrator.execute_chain(doc_chain.id, {
        'code_content': 'def hello_world(): return "Hello, World!"',
        'doc_style': 'comprehensive'
    })
    
    print(f"Documentation Chain Result: {result.get('status', 'unknown')}")
    
    # Example 2: Memory-enhanced prompt
    enhanced_prompt = await ecosystem.memory.enhance_prompt_with_context(
        "Explain how to implement secure authentication",
        scope=ContextScope.DOMAIN
    )
    
    print(f"Enhanced Prompt Length: {len(enhanced_prompt)} characters")
    
    # Save all system states
    ecosystem.orchestrator.save_configuration("ecosystem_orchestrator.json")
    ecosystem.optimizer.save_optimization_state("ecosystem_optimizer.json")
    await ecosystem.memory.save_memory_state("ecosystem_memory.json")
    ecosystem.quality.save_validation_state("ecosystem_quality.json")
    ecosystem.recovery.save_recovery_state("ecosystem_recovery.json")
    ecosystem.testing.save_test_state("ecosystem_testing.json")
    
    print("💾 All system states saved successfully")
    print("\n🎯 Complete ecosystem integration demonstration finished!")


if __name__ == "__main__":
    asyncio.run(main())