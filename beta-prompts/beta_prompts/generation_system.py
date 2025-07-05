#!/usr/bin/env python3
"""
Prompt Generation System
Generates high-quality prompts using Anthropic's documented patterns and best practices
"""

import json
import random
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import anthropic
from anthropic import Anthropic


@dataclass
class PromptBlueprint:
    """Blueprint for generating structured prompts"""
    task_type: str
    domain: str
    complexity: str  # 'simple', 'intermediate', 'complex'
    elements: List[str]
    template: str
    variables: Dict[str, List[str]]
    quality_criteria: List[str]


@dataclass
class GeneratedPrompt:
    """Generated prompt with metadata"""
    prompt: str
    task_type: str
    domain: str
    complexity: str
    elements_used: List[str]
    quality_score: float
    variables_used: Dict[str, str]
    generation_method: str
    timestamp: str


class PromptGenerationSystem:
    """
    Generates high-quality prompts using Anthropic's documented patterns:
    - 10-element prompt structure
    - Domain-specific templates
    - Variable substitution system
    - Quality scoring framework
    - Batch generation capabilities
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        if api_key:
            self.client = Anthropic(api_key=api_key)
        
        # Initialize prompt blueprints based on Anthropic's patterns
        self.blueprints = self._initialize_blueprints()
        
        # Domain-specific knowledge bases
        self.domain_knowledge = self._load_domain_knowledge()
        
        # Quality evaluation criteria
        self.quality_criteria = {
            'clarity': ['specific', 'unambiguous', 'well-structured'],
            'completeness': ['comprehensive', 'detailed', 'thorough'],
            'actionability': ['executable', 'practical', 'implementable'],
            'optimization': ['role_defined', 'structured', 'examples_included']
        }
    
    def _initialize_blueprints(self) -> Dict[str, PromptBlueprint]:
        """Initialize prompt blueprints for different task types"""
        
        blueprints = {}
        
        # Analysis Task Blueprint
        blueprints['analysis'] = PromptBlueprint(
            task_type='analysis',
            domain='general',
            complexity='intermediate',
            elements=['role', 'task', 'instructions', 'thinking', 'output_format'],
            template='''<role>
You are an expert {domain} analyst with {experience} years of experience in {specialization}.
</role>

<task>
{task_description}
</task>

<instructions>
Follow this systematic analysis approach:
1. **Initial Assessment** - {assessment_focus}
2. **Detailed Analysis** - {analysis_method}
3. **Evaluation** - {evaluation_criteria}
4. **Recommendations** - {recommendation_type}
</instructions>

<thinking>
Let me approach this analysis systematically:
1. First, I'll {first_step}
2. Then, I'll {second_step}
3. Next, I'll {third_step}
4. Finally, I'll {final_step}
</thinking>

<output_format>
Structure your analysis as:
1. **Executive Summary** - {summary_focus}
2. **Detailed Findings** - {findings_structure}
3. **Supporting Evidence** - {evidence_type}
4. **Recommendations** - {recommendation_format}
5. **Conclusion** - {conclusion_elements}
</output_format>

{input_data}''',
            variables={
                'domain': ['business', 'technical', 'financial', 'strategic', 'operational'],
                'experience': ['5', '10', '15', '20'],
                'specialization': ['performance analysis', 'risk assessment', 'market research', 'competitive analysis'],
                'task_description': ['Analyze the provided data/content', 'Evaluate the performance metrics', 'Assess the strategic implications'],
                'assessment_focus': ['key metrics and indicators', 'core components and relationships', 'critical success factors'],
                'analysis_method': ['quantitative and qualitative evaluation', 'comparative analysis', 'trend identification'],
                'evaluation_criteria': ['industry standards and benchmarks', 'best practices and frameworks', 'performance indicators'],
                'recommendation_type': ['strategic recommendations', 'operational improvements', 'risk mitigation strategies'],
                'first_step': ['examine the overall context and scope', 'identify key stakeholders and objectives'],
                'second_step': ['break down the core components', 'analyze the data patterns and trends'],
                'third_step': ['evaluate against relevant criteria', 'identify gaps and opportunities'],
                'final_step': ['synthesize findings into actionable insights', 'prioritize recommendations by impact'],
                'summary_focus': ['key findings and critical insights', 'main conclusions and implications'],
                'findings_structure': ['organized by priority and impact', 'categorized by functional area'],
                'evidence_type': ['quantitative data and metrics', 'qualitative observations and examples'],
                'recommendation_format': ['prioritized action items', 'specific implementation steps'],
                'conclusion_elements': ['summary of key takeaways', 'next steps and follow-up actions']
            },
            quality_criteria=['clarity', 'completeness', 'actionability', 'optimization']
        )
        
        # Technical Task Blueprint
        blueprints['technical'] = PromptBlueprint(
            task_type='technical',
            domain='software_engineering',
            complexity='complex',
            elements=['role', 'technical_context', 'requirements', 'thinking', 'output_format'],
            template='''<role>
You are a senior {role_type} with {experience} years of experience in {technology_stack} and expertise in {specialization}.
</role>

<technical_context>
{context_description}
</technical_context>

<requirements>
{requirement_list}
</requirements>

<constraints>
{constraint_list}
</constraints>

<thinking>
Let me approach this technical challenge systematically:
1. **Architecture Analysis** - {architecture_focus}
2. **Implementation Strategy** - {implementation_approach}
3. **Testing Approach** - {testing_strategy}
4. **Optimization Considerations** - {optimization_areas}
</thinking>

<output_format>
Provide your technical solution with:
1. **Solution Overview** - {overview_elements}
2. **Technical Implementation** - {implementation_details}
3. **Code Examples** - {code_requirements}
4. **Testing Strategy** - {testing_approach}
5. **Documentation** - {documentation_requirements}
</output_format>

{technical_input}''',
            variables={
                'role_type': ['software engineer', 'system architect', 'DevOps engineer', 'full-stack developer'],
                'experience': ['5', '10', '15', '20'],
                'technology_stack': ['Python/Django', 'JavaScript/React', 'Java/Spring', 'Go/Kubernetes', 'AWS/Cloud'],
                'specialization': ['scalable systems', 'microservices', 'performance optimization', 'security implementation'],
                'context_description': ['Building a scalable web application', 'Designing a microservices architecture', 'Implementing a CI/CD pipeline'],
                'requirement_list': ['Functional requirements and specifications', 'Performance and scalability requirements', 'Security and compliance requirements'],
                'constraint_list': ['Budget and timeline constraints', 'Technology stack limitations', 'Team skill and resource constraints'],
                'architecture_focus': ['system design patterns and trade-offs', 'scalability and performance considerations'],
                'implementation_approach': ['modular design and clean architecture', 'test-driven development methodology'],
                'testing_strategy': ['unit, integration, and end-to-end testing', 'performance and load testing'],
                'optimization_areas': ['performance bottlenecks and caching', 'security vulnerabilities and hardening'],
                'overview_elements': ['high-level architecture and design decisions', 'key technical approaches and patterns'],
                'implementation_details': ['complete code implementation with explanations', 'step-by-step technical instructions'],
                'code_requirements': ['working code with proper error handling', 'well-commented and documented examples'],
                'testing_approach': ['comprehensive test suite with coverage', 'testing strategy and validation methods'],
                'documentation_requirements': ['API documentation and usage examples', 'deployment and configuration guides']
            },
            quality_criteria=['clarity', 'completeness', 'actionability', 'optimization']
        )
        
        # Creative Task Blueprint
        blueprints['creative'] = PromptBlueprint(
            task_type='creative',
            domain='content_creation',
            complexity='intermediate',
            elements=['role', 'context', 'tone', 'constraints', 'examples', 'output_format'],
            template='''<role>
You are a {creative_role} with extensive experience in {creative_domain} and a proven track record in {achievement_area}.
</role>

<context>
{context_information}
</context>

<tone>
{tone_specification}
</tone>

<constraints>
{constraint_list}
</constraints>

<examples>
{example_content}
</examples>

<output_format>
Create {deliverable_type} that includes:
1. **{element_1}** - {element_1_description}
2. **{element_2}** - {element_2_description}
3. **{element_3}** - {element_3_description}
4. **{element_4}** - {element_4_description}
</output_format>

{creative_brief}''',
            variables={
                'creative_role': ['content strategist', 'copywriter', 'creative director', 'brand specialist'],
                'creative_domain': ['digital marketing', 'brand development', 'content creation', 'social media'],
                'achievement_area': ['driving engagement', 'increasing conversions', 'building brand awareness'],
                'context_information': ['Target audience and market analysis', 'Brand positioning and competitive landscape', 'Campaign objectives and success metrics'],
                'tone_specification': ['Professional and authoritative', 'Friendly and conversational', 'Inspiring and motivational'],
                'constraint_list': ['Brand guidelines and voice requirements', 'Platform-specific formatting requirements', 'Legal and compliance considerations'],
                'example_content': ['Example of successful similar content', 'Reference materials and inspiration', 'Style guide and formatting examples'],
                'deliverable_type': ['compelling content', 'engaging campaign', 'comprehensive strategy'],
                'element_1': ['Main Message', 'Core Concept', 'Primary Hook'],
                'element_1_description': ['clear value proposition', 'central creative idea', 'attention-grabbing opener'],
                'element_2': ['Supporting Content', 'Development', 'Body'],
                'element_2_description': ['detailed explanation and benefits', 'creative execution and details', 'comprehensive information'],
                'element_3': ['Call to Action', 'Next Steps', 'Engagement'],
                'element_3_description': ['specific action for audience', 'clear next steps', 'interaction opportunities'],
                'element_4': ['Variations', 'Alternatives', 'Adaptations'],
                'element_4_description': ['different format options', 'alternative approaches', 'platform-specific versions']
            },
            quality_criteria=['clarity', 'completeness', 'actionability', 'optimization']
        )
        
        return blueprints
    
    def _load_domain_knowledge(self) -> Dict[str, Dict[str, List[str]]]:
        """Load domain-specific knowledge bases"""
        
        return {
            'software_engineering': {
                'technologies': ['Python', 'JavaScript', 'Java', 'Go', 'Rust', 'TypeScript'],
                'frameworks': ['Django', 'React', 'Spring Boot', 'Express', 'FastAPI'],
                'patterns': ['MVC', 'Microservices', 'Event-Driven', 'CQRS', 'Hexagonal'],
                'practices': ['TDD', 'CI/CD', 'Code Review', 'Pair Programming', 'Agile']
            },
            'data_science': {
                'tools': ['Python', 'R', 'SQL', 'Jupyter', 'Tableau', 'Power BI'],
                'libraries': ['pandas', 'scikit-learn', 'TensorFlow', 'PyTorch', 'numpy'],
                'methods': ['Machine Learning', 'Statistical Analysis', 'Data Visualization', 'Feature Engineering'],
                'domains': ['Predictive Analytics', 'NLP', 'Computer Vision', 'Time Series']
            },
            'business': {
                'areas': ['Strategy', 'Operations', 'Finance', 'Marketing', 'HR'],
                'frameworks': ['SWOT', 'Porter\'s Five Forces', 'OKRs', 'Balanced Scorecard'],
                'metrics': ['ROI', 'KPIs', 'Conversion Rate', 'Customer Lifetime Value'],
                'processes': ['Agile', 'Lean', 'Six Sigma', 'Design Thinking']
            },
            'marketing': {
                'channels': ['Digital', 'Social Media', 'Email', 'Content', 'SEO', 'PPC'],
                'strategies': ['Inbound', 'Outbound', 'Account-Based', 'Growth Hacking'],
                'metrics': ['CTR', 'Conversion Rate', 'CAC', 'LTV', 'ROAS'],
                'tools': ['Google Analytics', 'HubSpot', 'Salesforce', 'Mailchimp']
            }
        }
    
    def generate_prompt(self, task_type: str, domain: str = 'general', 
                       complexity: str = 'intermediate', custom_variables: Optional[Dict[str, str]] = None) -> GeneratedPrompt:
        """Generate a high-quality prompt based on specifications"""
        
        # Get appropriate blueprint
        blueprint = self.blueprints.get(task_type, self.blueprints['analysis'])
        
        # Select variables
        variables_used = self._select_variables(blueprint, domain, custom_variables)
        
        # Generate prompt from template
        prompt = self._generate_from_template(blueprint.template, variables_used)
        
        # Calculate quality score
        quality_score = self._calculate_quality_score(prompt, blueprint.quality_criteria)
        
        return GeneratedPrompt(
            prompt=prompt,
            task_type=task_type,
            domain=domain,
            complexity=complexity,
            elements_used=blueprint.elements,
            quality_score=quality_score,
            variables_used=variables_used,
            generation_method='template_based',
            timestamp=datetime.now().isoformat()
        )
    
    def _select_variables(self, blueprint: PromptBlueprint, domain: str, 
                         custom_variables: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        """Select appropriate variables for prompt generation"""
        
        variables_used = {}
        
        # Use custom variables if provided
        if custom_variables:
            variables_used.update(custom_variables)
        
        # Fill in missing variables with random selection
        for var_name, var_options in blueprint.variables.items():
            if var_name not in variables_used:
                # Domain-specific selection logic
                if domain in self.domain_knowledge:
                    domain_data = self.domain_knowledge[domain]
                    if var_name in domain_data:
                        variables_used[var_name] = random.choice(domain_data[var_name])
                    else:
                        variables_used[var_name] = random.choice(var_options)
                else:
                    variables_used[var_name] = random.choice(var_options)
        
        return variables_used
    
    def _generate_from_template(self, template: str, variables: Dict[str, str]) -> str:
        """Generate prompt from template with variable substitution"""
        
        try:
            return template.format(**variables)
        except KeyError as e:
            # Handle missing variables gracefully
            print(f"Warning: Missing variable {e}")
            return template
    
    def _calculate_quality_score(self, prompt: str, criteria: List[str]) -> float:
        """Calculate quality score based on defined criteria"""
        
        score = 0.0
        total_criteria = len(criteria)
        
        for criterion in criteria:
            if criterion == 'clarity':
                # Check for clear structure and specific language
                clarity_score = self._assess_clarity(prompt)
                score += clarity_score
            elif criterion == 'completeness':
                # Check for comprehensive coverage
                completeness_score = self._assess_completeness(prompt)
                score += completeness_score
            elif criterion == 'actionability':
                # Check for specific, actionable instructions
                actionability_score = self._assess_actionability(prompt)
                score += actionability_score
            elif criterion == 'optimization':
                # Check for optimization elements
                optimization_score = self._assess_optimization(prompt)
                score += optimization_score
        
        return score / total_criteria if total_criteria > 0 else 0.0
    
    def _assess_clarity(self, prompt: str) -> float:
        """Assess clarity of the prompt"""
        
        clarity_indicators = [
            '<' in prompt and '>' in prompt,  # Has XML structure
            len(prompt.split('.')) > 3,  # Multiple sentences
            any(word in prompt.lower() for word in ['specific', 'clear', 'detailed']),
            len(prompt.split()) > 50  # Substantial length
        ]
        
        return sum(clarity_indicators) / len(clarity_indicators)
    
    def _assess_completeness(self, prompt: str) -> float:
        """Assess completeness of the prompt"""
        
        completeness_indicators = [
            '<role>' in prompt,
            '<instructions>' in prompt or '<task>' in prompt,
            '<output_format>' in prompt,
            '<thinking>' in prompt,
            len(prompt.split()) > 100  # Comprehensive length
        ]
        
        return sum(completeness_indicators) / len(completeness_indicators)
    
    def _assess_actionability(self, prompt: str) -> float:
        """Assess actionability of the prompt"""
        
        actionability_indicators = [
            any(word in prompt.lower() for word in ['create', 'analyze', 'implement', 'generate']),
            any(word in prompt.lower() for word in ['step', 'approach', 'method', 'process']),
            any(word in prompt.lower() for word in ['specific', 'detailed', 'comprehensive']),
            '1.' in prompt or '2.' in prompt  # Has numbered steps
        ]
        
        return sum(actionability_indicators) / len(actionability_indicators)
    
    def _assess_optimization(self, prompt: str) -> float:
        """Assess optimization elements in the prompt"""
        
        optimization_indicators = [
            '<role>' in prompt,
            '<thinking>' in prompt,
            '<output_format>' in prompt,
            '<example>' in prompt or '<examples>' in prompt,
            len([tag for tag in ['<role>', '<task>', '<instructions>', '<thinking>', '<output_format>'] if tag in prompt]) >= 3
        ]
        
        return sum(optimization_indicators) / len(optimization_indicators)
    
    def generate_prompt_variations(self, base_prompt: GeneratedPrompt, 
                                  num_variations: int = 3) -> List[GeneratedPrompt]:
        """Generate variations of a base prompt"""
        
        variations = []
        
        # Get the blueprint used for the base prompt
        blueprint = self.blueprints.get(base_prompt.task_type, self.blueprints['analysis'])
        
        for i in range(num_variations):
            # Generate new variable combinations
            variables_used = self._select_variables(blueprint, base_prompt.domain)
            
            # Generate new prompt
            prompt = self._generate_from_template(blueprint.template, variables_used)
            quality_score = self._calculate_quality_score(prompt, blueprint.quality_criteria)
            
            variation = GeneratedPrompt(
                prompt=prompt,
                task_type=base_prompt.task_type,
                domain=base_prompt.domain,
                complexity=base_prompt.complexity,
                elements_used=blueprint.elements,
                quality_score=quality_score,
                variables_used=variables_used,
                generation_method=f'variation_{i+1}',
                timestamp=datetime.now().isoformat()
            )
            
            variations.append(variation)
        
        return variations
    
    def batch_generate_prompts(self, specifications: List[Dict[str, str]]) -> List[GeneratedPrompt]:
        """Generate multiple prompts in batch"""
        
        prompts = []
        
        for spec in specifications:
            prompt = self.generate_prompt(
                task_type=spec.get('task_type', 'analysis'),
                domain=spec.get('domain', 'general'),
                complexity=spec.get('complexity', 'intermediate'),
                custom_variables=spec.get('custom_variables')
            )
            prompts.append(prompt)
        
        return prompts
    
    def optimize_generated_prompt(self, prompt: GeneratedPrompt) -> GeneratedPrompt:
        """Further optimize a generated prompt"""
        
        # Apply additional optimization techniques
        optimized_prompt = prompt.prompt
        
        # Enhance role definition
        if '<role>' in optimized_prompt:
            optimized_prompt = self._enhance_role_definition(optimized_prompt)
        
        # Add examples if missing
        if '<example>' not in optimized_prompt and '<examples>' not in optimized_prompt:
            optimized_prompt = self._add_examples(optimized_prompt, prompt.task_type)
        
        # Enhance output format
        if '<output_format>' in optimized_prompt:
            optimized_prompt = self._enhance_output_format(optimized_prompt)
        
        # Recalculate quality score
        blueprint = self.blueprints.get(prompt.task_type, self.blueprints['analysis'])
        quality_score = self._calculate_quality_score(optimized_prompt, blueprint.quality_criteria)
        
        return GeneratedPrompt(
            prompt=optimized_prompt,
            task_type=prompt.task_type,
            domain=prompt.domain,
            complexity=prompt.complexity,
            elements_used=prompt.elements_used + ['enhanced_optimization'],
            quality_score=quality_score,
            variables_used=prompt.variables_used,
            generation_method='optimized_' + prompt.generation_method,
            timestamp=datetime.now().isoformat()
        )
    
    def _enhance_role_definition(self, prompt: str) -> str:
        """Enhance role definition with more specific expertise"""
        
        # Add more specific expertise and credentials
        enhanced_prompt = prompt.replace(
            'You are an expert',
            'You are a highly experienced expert'
        )
        
        return enhanced_prompt
    
    def _add_examples(self, prompt: str, task_type: str) -> str:
        """Add examples to the prompt"""
        
        example_content = f"""
<examples>
<example>
Example for {task_type}:
Input: [Sample input demonstrating the task]
Process: [Step-by-step approach]
Output: [Expected output format and quality]
</example>
</examples>"""
        
        # Insert before output format
        if '<output_format>' in prompt:
            return prompt.replace('<output_format>', example_content + '\n\n<output_format>')
        else:
            return prompt + example_content
    
    def _enhance_output_format(self, prompt: str) -> str:
        """Enhance output format with more specific requirements"""
        
        # Add quality criteria to output format
        enhanced_prompt = prompt.replace(
            '</output_format>',
            '\n\n**Quality Requirements:**\n- Be specific and actionable\n- Include relevant examples\n- Maintain professional tone\n- Ensure completeness and accuracy\n</output_format>'
        )
        
        return enhanced_prompt
    
    def save_generated_prompts(self, prompts: List[GeneratedPrompt], 
                              filename: str = 'generated_prompts.json') -> str:
        """Save generated prompts to file"""
        
        data = {
            'generation_date': datetime.now().isoformat(),
            'total_prompts': len(prompts),
            'average_quality_score': sum(p.quality_score for p in prompts) / len(prompts) if prompts else 0,
            'prompts': [asdict(prompt) for prompt in prompts]
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        
        return filename


def main():
    """Test the prompt generation system"""
    
    # Create generation system
    generator = PromptGenerationSystem()
    
    print("=== PROMPT GENERATION SYSTEM ===")
    
    # Test single prompt generation
    print("\n--- Single Prompt Generation ---")
    prompt = generator.generate_prompt(
        task_type='analysis',
        domain='software_engineering',
        complexity='intermediate'
    )
    
    print(f"Generated Prompt (Quality: {prompt.quality_score:.2f}):")
    print(prompt.prompt[:300] + "..." if len(prompt.prompt) > 300 else prompt.prompt)
    
    # Test batch generation
    print("\n--- Batch Generation ---")
    specifications = [
        {'task_type': 'analysis', 'domain': 'business', 'complexity': 'intermediate'},
        {'task_type': 'technical', 'domain': 'software_engineering', 'complexity': 'complex'},
        {'task_type': 'creative', 'domain': 'marketing', 'complexity': 'intermediate'}
    ]
    
    batch_prompts = generator.batch_generate_prompts(specifications)
    
    print(f"Generated {len(batch_prompts)} prompts:")
    for i, prompt in enumerate(batch_prompts):
        print(f"  {i+1}. {prompt.task_type} ({prompt.domain}) - Quality: {prompt.quality_score:.2f}")
    
    # Test prompt variations
    print("\n--- Prompt Variations ---")
    variations = generator.generate_prompt_variations(prompt, num_variations=2)
    
    print(f"Generated {len(variations)} variations:")
    for i, variation in enumerate(variations):
        print(f"  Variation {i+1} - Quality: {variation.quality_score:.2f}")
    
    # Test optimization
    print("\n--- Prompt Optimization ---")
    optimized = generator.optimize_generated_prompt(prompt)
    
    print(f"Original Quality: {prompt.quality_score:.2f}")
    print(f"Optimized Quality: {optimized.quality_score:.2f}")
    print(f"Improvement: {(optimized.quality_score - prompt.quality_score):.2f}")
    
    # Save results
    all_prompts = [prompt] + batch_prompts + variations + [optimized]
    filename = generator.save_generated_prompts(all_prompts)
    print(f"\nAll prompts saved to: {filename}")
    
    return all_prompts


if __name__ == "__main__":
    main()