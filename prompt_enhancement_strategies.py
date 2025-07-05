#!/usr/bin/env python3
"""
Prompt Enhancement Strategies
Concrete implementations for leveraging Anthropic's prompt generation endpoints
"""

import json
import time
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from abc import ABC, abstractmethod


@dataclass
class PromptContext:
    """Context information for prompt generation"""
    project_type: str
    language: str
    framework: Optional[str]
    codebase_size: str
    team_size: int
    complexity: str
    specific_requirements: List[str]


class PromptEnhancer(ABC):
    """Base class for prompt enhancement strategies"""
    
    @abstractmethod
    def generate_prompt(self, task: str, context: PromptContext) -> Dict:
        """Generate enhanced prompt for specific task"""
        pass
    
    @abstractmethod
    def optimize_for_context(self, base_prompt: str, context: PromptContext) -> str:
        """Optimize prompt based on project context"""
        pass


class AdaptiveAgentOrchestrator(PromptEnhancer):
    """Dynamically create and coordinate agents based on codebase analysis"""
    
    def generate_prompt(self, task: str, context: PromptContext) -> Dict:
        """Generate specialized agent prompts"""
        
        # Analyze codebase to determine optimal agent configuration
        agent_config = self._analyze_agent_needs(context)
        
        # Generate specialized prompts for each agent
        prompts = {
            'coordinator': self._generate_coordinator_prompt(agent_config, context),
            'specialists': {}
        }
        
        # Create specialist agents based on needs
        for specialist_type in agent_config['required_specialists']:
            prompts['specialists'][specialist_type] = self._generate_specialist_prompt(
                specialist_type, context
            )
            
        return {
            'prompts': prompts,
            'execution_order': agent_config['execution_order'],
            'coordination_strategy': agent_config['coordination_strategy']
        }
    
    def _analyze_agent_needs(self, context: PromptContext) -> Dict:
        """Determine which specialized agents are needed"""
        config = {
            'required_specialists': [],
            'execution_order': [],
            'coordination_strategy': 'sequential'
        }
        
        # Large codebases need architecture specialist
        if context.codebase_size == 'large':
            config['required_specialists'].append('architecture_analyst')
            config['coordination_strategy'] = 'parallel_with_sync'
            
        # Complex projects need pattern detector
        if context.complexity == 'high':
            config['required_specialists'].append('pattern_detector')
            config['required_specialists'].append('complexity_reducer')
            
        # Framework-specific agents
        if context.framework:
            config['required_specialists'].append(f'{context.framework}_specialist')
            
        # Security-critical projects
        if 'security' in context.specific_requirements:
            config['required_specialists'].append('security_auditor')
            config['execution_order'].insert(0, 'security_auditor')  # Run first
            
        # Performance-critical projects
        if 'performance' in context.specific_requirements:
            config['required_specialists'].append('performance_optimizer')
            
        return config
    
    def _generate_coordinator_prompt(self, agent_config: Dict, context: PromptContext) -> str:
        """Generate prompt for coordinator agent"""
        return f"""
<role>
You are the coordinator agent for a {context.complexity} complexity {context.project_type} project.
You will orchestrate {len(agent_config['required_specialists'])} specialist agents.
</role>

<coordination_strategy>
Strategy: {agent_config['coordination_strategy']}
Execution order: {agent_config['execution_order']}
</coordination_strategy>

<instructions>
1. Analyze the task requirements
2. Distribute work to appropriate specialists
3. Synthesize results from all agents
4. Ensure consistency across all outputs
5. Handle conflicts between specialist recommendations
</instructions>

<context>
Project: {context.project_type}
Language: {context.language}
Framework: {context.framework or 'None'}
Team size: {context.team_size}
</context>
"""
    
    def _generate_specialist_prompt(self, specialist_type: str, context: PromptContext) -> str:
        """Generate prompts for specialist agents"""
        specialist_prompts = {
            'architecture_analyst': f"""
<role>
You are an architecture specialist analyzing a {context.codebase_size} {context.language} codebase.
Focus on identifying architectural patterns, dependencies, and improvement opportunities.
</role>

<specialized_tasks>
1. Map module dependencies
2. Identify architectural anti-patterns
3. Suggest refactoring opportunities
4. Analyze coupling and cohesion
5. Create architecture diagrams
</specialized_tasks>
""",
            'pattern_detector': f"""
<role>
You are a pattern detection specialist for {context.language} code.
Identify recurring patterns, both good and bad, across the codebase.
</role>

<pattern_categories>
1. Design patterns in use
2. Anti-patterns to refactor
3. Code duplication patterns
4. Performance patterns
5. Security patterns
</pattern_categories>
""",
            'security_auditor': f"""
<role>
You are a security specialist auditing {context.project_type} applications.
Focus on OWASP Top 10 and {context.language}-specific vulnerabilities.
</role>

<security_checks>
1. Input validation
2. Authentication/Authorization
3. Data exposure
4. Injection vulnerabilities
5. Configuration security
</security_checks>
"""
        }
        
        return specialist_prompts.get(
            specialist_type, 
            f"You are a {specialist_type} specialist for {context.project_type} projects."
        )
    
    def optimize_for_context(self, base_prompt: str, context: PromptContext) -> str:
        """Enhance prompt with context-specific optimizations"""
        optimizations = []
        
        # Add codebase-specific context
        if context.codebase_size == 'large':
            optimizations.append("Focus on high-impact changes and critical paths first.")
            
        # Add team-specific context
        if context.team_size > 10:
            optimizations.append("Ensure changes are well-documented for team coordination.")
            
        # Add framework-specific best practices
        if context.framework:
            optimizations.append(f"Follow {context.framework} best practices and conventions.")
            
        enhanced_prompt = base_prompt + "\n\n<optimizations>\n"
        for opt in optimizations:
            enhanced_prompt += f"- {opt}\n"
        enhanced_prompt += "</optimizations>"
        
        return enhanced_prompt


class IntelligentCodeReviewer(PromptEnhancer):
    """Generate context-aware code review prompts"""
    
    def generate_prompt(self, task: str, context: PromptContext) -> Dict:
        """Generate specialized code review prompts"""
        
        review_focus_areas = self._determine_review_focus(context)
        severity_weights = self._calculate_severity_weights(context)
        
        prompt = f"""
<role>
You are an expert code reviewer for {context.language} projects using {context.framework or 'standard libraries'}.
This is a {context.complexity} complexity project with {context.team_size} developers.
</role>

<review_priorities>
{json.dumps(review_focus_areas, indent=2)}
</review_priorities>

<severity_weights>
{json.dumps(severity_weights, indent=2)}
</severity_weights>

<review_approach>
1. Start with {review_focus_areas[0]} as highest priority
2. Use automated checks for: {', '.join(self._get_automatable_checks(context))}
3. Focus manual review on: {', '.join(self._get_manual_review_areas(context))}
4. Consider team size impact on code maintainability
5. Provide actionable feedback with code examples
</review_approach>

<context_specific_patterns>
{self._get_context_patterns(context)}
</context_specific_patterns>
"""
        
        return {
            'prompt': prompt,
            'review_checklist': self._generate_review_checklist(context),
            'automation_suggestions': self._get_automation_suggestions(context)
        }
    
    def _determine_review_focus(self, context: PromptContext) -> List[str]:
        """Determine what to focus on based on context"""
        focus_areas = []
        
        if 'security' in context.specific_requirements:
            focus_areas.append('Security vulnerabilities')
            
        if 'performance' in context.specific_requirements:
            focus_areas.append('Performance bottlenecks')
            
        if context.complexity == 'high':
            focus_areas.extend(['Code complexity', 'Maintainability'])
            
        if context.team_size > 5:
            focus_areas.extend(['Code consistency', 'Documentation'])
            
        # Language-specific focuses
        language_focus = {
            'Python': ['Type hints', 'PEP 8 compliance'],
            'JavaScript': ['Async patterns', 'Error handling'],
            'Rust': ['Memory safety', 'Error handling'],
            'Go': ['Error handling', 'Concurrency patterns']
        }
        
        focus_areas.extend(language_focus.get(context.language, []))
        
        return focus_areas
    
    def _calculate_severity_weights(self, context: PromptContext) -> Dict[str, float]:
        """Calculate severity weights based on project context"""
        weights = {
            'security': 1.0,
            'bugs': 0.9,
            'performance': 0.7,
            'maintainability': 0.6,
            'style': 0.3
        }
        
        # Adjust weights based on requirements
        if 'security' in context.specific_requirements:
            weights['security'] = 1.5
            
        if 'performance' in context.specific_requirements:
            weights['performance'] = 1.2
            
        if context.team_size > 10:
            weights['maintainability'] = 0.9
            weights['style'] = 0.5  # More important for large teams
            
        return weights
    
    def _get_automatable_checks(self, context: PromptContext) -> List[str]:
        """Identify checks that can be automated"""
        checks = ['Linting', 'Type checking', 'Import sorting']
        
        if context.language == 'Python':
            checks.extend(['Black formatting', 'isort', 'mypy'])
        elif context.language == 'JavaScript':
            checks.extend(['ESLint', 'Prettier', 'TypeScript'])
            
        return checks
    
    def _get_manual_review_areas(self, context: PromptContext) -> List[str]:
        """Identify areas requiring human review"""
        areas = ['Business logic', 'Architecture decisions', 'Algorithm efficiency']
        
        if context.complexity == 'high':
            areas.extend(['Complex state management', 'Concurrency issues'])
            
        return areas
    
    def _get_context_patterns(self, context: PromptContext) -> str:
        """Get context-specific patterns to look for"""
        patterns = []
        
        if context.framework == 'React':
            patterns.append("- Check for proper hook usage and dependencies")
            patterns.append("- Verify component composition patterns")
        elif context.framework == 'Django':
            patterns.append("- Verify proper ORM usage and N+1 query prevention")
            patterns.append("- Check security middleware configuration")
            
        return '\n'.join(patterns)
    
    def _generate_review_checklist(self, context: PromptContext) -> List[str]:
        """Generate context-specific review checklist"""
        checklist = [
            "Code follows project conventions",
            "Tests are comprehensive and meaningful",
            "Error handling is appropriate",
            "Performance implications considered"
        ]
        
        if 'security' in context.specific_requirements:
            checklist.insert(0, "Security vulnerabilities addressed")
            
        return checklist
    
    def _get_automation_suggestions(self, context: PromptContext) -> List[str]:
        """Suggest automation improvements"""
        suggestions = []
        
        if context.team_size > 5:
            suggestions.append("Implement pre-commit hooks for consistent formatting")
            
        if context.complexity == 'high':
            suggestions.append("Add complexity metrics to CI pipeline")
            
        return suggestions
    
    def optimize_for_context(self, base_prompt: str, context: PromptContext) -> str:
        """Optimize review prompt for specific context"""
        return base_prompt  # Already optimized in generate_prompt


class SmartDocumentationGenerator(PromptEnhancer):
    """Generate intelligent documentation prompts"""
    
    def generate_prompt(self, task: str, context: PromptContext) -> Dict:
        """Generate documentation prompts based on audience and purpose"""
        
        audiences = self._identify_audiences(context)
        doc_types = self._determine_doc_types(context)
        
        prompts = {}
        for audience in audiences:
            for doc_type in doc_types:
                key = f"{audience}_{doc_type}"
                prompts[key] = self._generate_audience_specific_prompt(
                    audience, doc_type, context
                )
                
        return {
            'prompts': prompts,
            'structure': self._generate_doc_structure(context),
            'automation_plan': self._create_automation_plan(context)
        }
    
    def _identify_audiences(self, context: PromptContext) -> List[str]:
        """Identify documentation audiences"""
        audiences = ['developers']
        
        if context.project_type in ['library', 'framework']:
            audiences.extend(['api_users', 'contributors'])
            
        if context.project_type == 'application':
            audiences.extend(['end_users', 'administrators'])
            
        if context.team_size > 10:
            audiences.append('new_team_members')
            
        return audiences
    
    def _determine_doc_types(self, context: PromptContext) -> List[str]:
        """Determine needed documentation types"""
        doc_types = ['readme', 'api_reference']
        
        if context.complexity == 'high':
            doc_types.extend(['architecture', 'design_decisions'])
            
        if 'deployment' in context.specific_requirements:
            doc_types.append('deployment_guide')
            
        return doc_types
    
    def _generate_audience_specific_prompt(self, audience: str, doc_type: str, 
                                         context: PromptContext) -> str:
        """Generate prompts tailored to specific audiences"""
        
        audience_prompts = {
            'developers': {
                'readme': f"""Create a developer-focused README for a {context.language} project.
Include: Quick start, Development setup, Architecture overview, Contributing guidelines.
Assume familiarity with {context.language} and {context.framework or 'standard tools'}.""",
                
                'api_reference': f"""Generate comprehensive API documentation for {context.language} code.
Include: Function signatures, Parameters, Return values, Examples, Edge cases.
Use {context.language}-specific documentation standards."""
            },
            'end_users': {
                'readme': """Create user-friendly documentation assuming no technical knowledge.
Focus on: What the software does, How to use it, Common tasks, Troubleshooting.
Use clear, simple language with screenshots where helpful."""
            }
        }
        
        return audience_prompts.get(audience, {}).get(
            doc_type, 
            f"Create {doc_type} documentation for {audience}"
        )
    
    def _generate_doc_structure(self, context: PromptContext) -> Dict:
        """Generate documentation structure"""
        structure = {
            'readme': ['Overview', 'Installation', 'Usage', 'Contributing'],
            'api_reference': ['Modules', 'Classes', 'Functions', 'Examples']
        }
        
        if context.complexity == 'high':
            structure['architecture'] = [
                'System Overview', 'Component Diagram', 
                'Data Flow', 'Design Decisions'
            ]
            
        return structure
    
    def _create_automation_plan(self, context: PromptContext) -> Dict:
        """Create plan for documentation automation"""
        plan = {
            'generation_tools': [],
            'update_triggers': [],
            'validation_checks': []
        }
        
        if context.language == 'Python':
            plan['generation_tools'].extend(['Sphinx', 'mkdocs'])
        elif context.language == 'JavaScript':
            plan['generation_tools'].extend(['JSDoc', 'TypeDoc'])
            
        plan['update_triggers'] = ['Code changes', 'API changes', 'Version releases']
        plan['validation_checks'] = ['Link checking', 'Example testing', 'Completeness']
        
        return plan
    
    def optimize_for_context(self, base_prompt: str, context: PromptContext) -> str:
        """Optimize documentation prompt"""
        optimizations = [
            f"Follow {context.language} documentation conventions",
            f"Consider team size of {context.team_size} for onboarding docs"
        ]
        
        if context.framework:
            optimizations.append(f"Include {context.framework}-specific patterns")
            
        return base_prompt + "\n" + "\n".join(f"- {opt}" for opt in optimizations)


class PerformanceOptimizationWizard(PromptEnhancer):
    """Generate performance optimization prompts"""
    
    def generate_prompt(self, task: str, context: PromptContext) -> Dict:
        """Generate performance-focused prompts"""
        
        bottlenecks = self._identify_likely_bottlenecks(context)
        optimization_strategies = self._get_optimization_strategies(context)
        
        prompt = f"""
<role>
You are a performance optimization expert for {context.language} applications.
Focus on {context.project_type} specific optimizations.
</role>

<likely_bottlenecks>
{json.dumps(bottlenecks, indent=2)}
</likely_bottlenecks>

<optimization_strategies>
{json.dumps(optimization_strategies, indent=2)}
</optimization_strategies>

<measurement_approach>
1. Profile before optimizing
2. Focus on {bottlenecks[0]} first (highest impact)
3. Measure improvement after each change
4. Consider trade-offs (readability vs performance)
</measurement_approach>

<context_specific_tools>
{self._get_profiling_tools(context)}
</context_specific_tools>
"""
        
        return {
            'prompt': prompt,
            'profiling_commands': self._get_profiling_commands(context),
            'optimization_checklist': self._create_optimization_checklist(context)
        }
    
    def _identify_likely_bottlenecks(self, context: PromptContext) -> List[str]:
        """Identify likely performance bottlenecks"""
        bottlenecks = []
        
        # Language-specific bottlenecks
        language_bottlenecks = {
            'Python': ['CPU-bound loops', 'Memory allocation', 'GIL contention'],
            'JavaScript': ['DOM manipulation', 'Async operations', 'Memory leaks'],
            'Rust': ['Unnecessary allocations', 'Lock contention', 'Cache misses'],
            'Go': ['Channel bottlenecks', 'GC pressure', 'Lock contention']
        }
        
        bottlenecks.extend(language_bottlenecks.get(context.language, []))
        
        # Project-type specific
        if context.project_type == 'web_app':
            bottlenecks.extend(['Database queries', 'API response times', 'Asset loading'])
        elif context.project_type == 'data_processing':
            bottlenecks.extend(['I/O operations', 'Memory usage', 'Algorithm complexity'])
            
        return bottlenecks
    
    def _get_optimization_strategies(self, context: PromptContext) -> Dict[str, List[str]]:
        """Get optimization strategies by category"""
        strategies = {
            'algorithmic': ['Use better data structures', 'Reduce complexity'],
            'caching': ['Implement memoization', 'Add Redis caching'],
            'parallelization': []
        }
        
        if context.language == 'Python':
            strategies['parallelization'].extend(['multiprocessing', 'asyncio'])
        elif context.language == 'Go':
            strategies['parallelization'].extend(['goroutines', 'channels'])
            
        return strategies
    
    def _get_profiling_tools(self, context: PromptContext) -> str:
        """Get language-specific profiling tools"""
        tools = {
            'Python': "- cProfile for CPU profiling\n- memory_profiler for memory\n- py-spy for production",
            'JavaScript': "- Chrome DevTools\n- Node.js --prof\n- clinic.js",
            'Rust': "- cargo flamegraph\n- perf\n- valgrind",
            'Go': "- pprof\n- trace\n- benchmarks"
        }
        
        return tools.get(context.language, "Use appropriate profiling tools")
    
    def _get_profiling_commands(self, context: PromptContext) -> List[str]:
        """Get specific profiling commands"""
        commands = {
            'Python': [
                "python -m cProfile -s cumulative script.py",
                "python -m memory_profiler script.py",
                "py-spy top -- python script.py"
            ],
            'JavaScript': [
                "node --prof app.js",
                "node --trace-deprecation app.js",
                "clinic doctor -- node app.js"
            ]
        }
        
        return commands.get(context.language, [])
    
    def _create_optimization_checklist(self, context: PromptContext) -> List[str]:
        """Create optimization checklist"""
        checklist = [
            "Profile before optimizing",
            "Identify hotspots",
            "Optimize algorithms first",
            "Consider caching",
            "Test for regressions"
        ]
        
        if context.complexity == 'high':
            checklist.append("Consider architectural changes")
            
        return checklist
    
    def optimize_for_context(self, base_prompt: str, context: PromptContext) -> str:
        """Add context-specific optimizations"""
        if context.codebase_size == 'large':
            return base_prompt + "\nFocus on architectural optimizations and caching strategies."
        return base_prompt


def demonstrate_prompt_enhancement():
    """Demonstrate the prompt enhancement strategies"""
    
    # Example context
    context = PromptContext(
        project_type="web_app",
        language="Python",
        framework="Django",
        codebase_size="large",
        team_size=15,
        complexity="high",
        specific_requirements=["security", "performance"]
    )
    
    print("🚀 Prompt Enhancement Strategies Demo")
    print("=" * 60)
    
    # Demonstrate Adaptive Agent Orchestration
    print("\n1. ADAPTIVE AGENT ORCHESTRATION")
    print("-" * 40)
    orchestrator = AdaptiveAgentOrchestrator()
    agent_result = orchestrator.generate_prompt("refactor_authentication", context)
    print(f"Required specialists: {agent_result['prompts']['specialists'].keys()}")
    print(f"Coordination strategy: {agent_result['coordination_strategy']}")
    
    # Demonstrate Intelligent Code Review
    print("\n2. INTELLIGENT CODE REVIEW")
    print("-" * 40)
    reviewer = IntelligentCodeReviewer()
    review_result = reviewer.generate_prompt("review_pull_request", context)
    print(f"Review priorities: {json.dumps(review_result['review_checklist'], indent=2)}")
    
    # Demonstrate Smart Documentation
    print("\n3. SMART DOCUMENTATION GENERATION")
    print("-" * 40)
    doc_gen = SmartDocumentationGenerator()
    doc_result = doc_gen.generate_prompt("generate_docs", context)
    print(f"Documentation types: {list(doc_result['structure'].keys())}")
    print(f"Automation tools: {doc_result['automation_plan']['generation_tools']}")
    
    # Demonstrate Performance Optimization
    print("\n4. PERFORMANCE OPTIMIZATION")
    print("-" * 40)
    perf_wizard = PerformanceOptimizationWizard()
    perf_result = perf_wizard.generate_prompt("optimize_performance", context)
    print(f"Profiling commands: {perf_result['profiling_commands'][:2]}")
    
    print("\n" + "=" * 60)
    print("✨ These strategies show how prompt generation can create")
    print("   highly specialized, context-aware prompts that dramatically")
    print("   improve development workflow efficiency!")


if __name__ == "__main__":
    demonstrate_prompt_enhancement()