#!/usr/bin/env python3
"""
Real Enhanced Metrics Collector
Tests actual prompt optimization techniques with real API calls
"""

import time
import json
import os
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import anthropic
from anthropic import Anthropic
from real_baseline_collector import RealTaskMetrics


class RealEnhancedCollector:
    """Collects real metrics from optimized prompts using actual API calls"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY must be set for real data collection")
        
        self.client = Anthropic(
            api_key=self.api_key,
            default_headers={
                "anthropic-beta": "prompt-caching-2024-07-31"
            }
        )
        self.metrics: List[RealTaskMetrics] = []
        
    def create_optimized_prompt(self, task_type: str, base_prompt: str) -> str:
        """Create an actually optimized prompt using documented techniques"""
        
        optimization_templates = {
            'code_review': '''<role>
You are an expert code security auditor and performance specialist with deep knowledge of common vulnerabilities and optimization patterns.
</role>

<instructions>
Perform a comprehensive code review focusing on:

1. **Security Issues** (Priority: CRITICAL)
   - SQL injection vulnerabilities
   - Input validation flaws
   - Authentication/authorization issues
   - Data exposure risks

2. **Bugs and Logic Errors**
   - Null pointer exceptions
   - Off-by-one errors
   - Race conditions
   - Edge case handling

3. **Performance Concerns**
   - Inefficient algorithms
   - Database query optimization
   - Memory leaks
   - Resource management

4. **Code Quality**
   - SOLID principles violations
   - Code duplication
   - Error handling patterns
   - Maintainability issues
</instructions>

<thinking>
Let me analyze this code step by step:
1. First, I'll scan for immediate security vulnerabilities
2. Then check for logic errors and edge cases
3. Finally, assess performance and maintainability
</thinking>

<output_format>
For each issue found:
- **Location**: [specific line or section]
- **Severity**: [Critical|High|Medium|Low]
- **Issue**: [clear description]
- **Fix**: [specific solution with code example]
- **Rationale**: [why this fix is needed]
</output_format>

{original_prompt}

This analysis is critical for production system security and reliability.''',

            'refactoring': '''<role>
You are a senior software architect specializing in clean code principles, SOLID design patterns, and maintainable software architecture.
</role>

<instructions>
Refactor the provided code following these principles:

1. **Single Responsibility Principle**
   - Each class should have one reason to change
   - Separate concerns into distinct modules

2. **Dependency Injection**
   - Remove hard dependencies
   - Use interfaces for loose coupling

3. **Error Handling**
   - Consistent error handling strategy
   - Proper exception hierarchy

4. **Testability**
   - Make code easily unit testable
   - Clear separation of concerns
</instructions>

<thinking>
Let me break down the refactoring approach:
1. Identify current responsibilities and coupling issues
2. Design new structure following SOLID principles
3. Implement dependency injection
4. Add proper error handling
5. Ensure testability
</thinking>

<output_format>
Provide:
1. **Analysis**: Current issues with the code structure
2. **Refactored Code**: Complete, working implementation
3. **Key Improvements**: List of specific improvements made
4. **Testing Strategy**: How to test the refactored code
</output_format>

{original_prompt}

Focus on creating maintainable, production-ready code.''',

            'test_generation': '''<role>
You are a test automation expert with expertise in comprehensive test coverage, edge case identification, and test-driven development practices.
</role>

<test_strategy>
Generate tests covering:

1. **Happy Path Tests**
   - Normal operation scenarios
   - Expected input ranges
   - Typical use cases

2. **Edge Cases**
   - Boundary conditions
   - Empty/null inputs
   - Maximum/minimum values

3. **Error Conditions**
   - Invalid inputs
   - Exception scenarios
   - System failures

4. **Performance Tests**
   - Load testing scenarios
   - Resource consumption
   - Timeout conditions
</test_strategy>

<thinking>
For comprehensive test coverage, I need to:
1. Analyze the function's behavior and inputs
2. Identify all possible code paths
3. Create test cases for normal and exceptional flows
4. Ensure edge cases are covered
5. Add performance and integration tests where relevant
</thinking>

<output_format>
Provide:
1. **Test Structure**: Organized test classes/methods
2. **Test Data**: Comprehensive test datasets
3. **Assertions**: Specific, meaningful assertions
4. **Coverage Analysis**: Explanation of what's tested
5. **Mock Strategy**: How to handle dependencies
</output_format>

{original_prompt}

Aim for 100% code coverage with meaningful tests.''',

            'documentation': '''<role>
You are a technical documentation specialist creating developer-friendly, comprehensive API documentation that follows industry best practices.
</role>

<documentation_structure>
Create documentation with:

1. **Overview**
   - Purpose and functionality
   - Authentication requirements
   - Rate limiting information

2. **Endpoint Details**
   - HTTP methods and URLs
   - Request/response formats
   - Parameter specifications

3. **Examples**
   - cURL commands
   - Multiple programming languages
   - Real-world use cases

4. **Error Handling**
   - Complete error code reference
   - Troubleshooting guide
   - Common issues and solutions
</documentation_structure>

<thinking>
To create excellent API documentation, I need to:
1. Understand the endpoint's full functionality
2. Document all parameters and their constraints
3. Provide comprehensive examples
4. Cover all possible responses and error states
5. Make it scannable and practical for developers
</thinking>

<output_format>
Structure the documentation as:
1. **Endpoint Summary**: Brief description and purpose
2. **Request Details**: Parameters, headers, body format
3. **Response Details**: Success and error responses
4. **Code Examples**: Multiple languages with real examples
5. **Error Reference**: Complete list with solutions
</output_format>

{original_prompt}

Make this documentation comprehensive enough that a developer can successfully integrate without additional support.''',

            'bug_fix': '''<role>
You are a debugging expert with deep experience in systematic problem-solving, root cause analysis, and production issue resolution.
</role>

<debugging_approach>
Follow this systematic debugging process:

1. **Symptom Analysis**
   - Understand the reported behavior
   - Identify patterns in failures
   - Gather relevant context

2. **Hypothesis Generation**
   - List possible root causes
   - Prioritize by likelihood
   - Consider edge cases

3. **Code Analysis**
   - Trace through execution paths
   - Identify potential failure points
   - Check assumptions and invariants

4. **Solution Implementation**
   - Fix the root cause
   - Add safeguards against similar issues
   - Include comprehensive testing
</debugging_approach>

<thinking>
Let me systematically debug this issue:
1. Analyze the symptoms and expected vs actual behavior
2. Trace through the code execution with the failing case
3. Identify where the logic breaks down
4. Determine the root cause
5. Implement a comprehensive fix
6. Add tests to prevent regression
</thinking>

<output_format>
Provide:
1. **Root Cause Analysis**: Exactly what's causing the bug
2. **Fixed Code**: Complete, corrected implementation
3. **Explanation**: Why the fix solves the problem
4. **Test Cases**: Tests that would have caught this bug
5. **Prevention**: How to avoid similar issues
</output_format>

{original_prompt}

This is a production issue that needs a reliable, tested fix.'''
        }
        
        template = optimization_templates.get(task_type, optimization_templates['code_review'])
        return template.format(original_prompt=base_prompt)
    
    def execute_optimized_task(self, task_type: str, base_prompt: str, max_retries: int = 3) -> RealTaskMetrics:
        """Execute task with optimized prompt and collect real metrics"""
        
        # Create optimized prompt
        optimized_prompt = self.create_optimized_prompt(task_type, base_prompt)
        
        task_id = f"optimized_{task_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        start_time = time.time()
        
        errors = []
        iterations = 0
        success = False
        response_content = ""
        total_tokens = 0
        
        for attempt in range(max_retries):
            iterations += 1
            
            try:
                print(f"Executing optimized {task_type} (attempt {attempt + 1}/{max_retries})...")
                
                response = self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=4000,
                    messages=[
                        {"role": "user", "content": optimized_prompt}
                    ]
                )
                
                response_content = response.content[0].text
                total_tokens += response.usage.input_tokens + response.usage.output_tokens
                
                # Enhanced success criteria for optimized prompts
                success_indicators = [
                    len(response_content) > 200,  # Substantial response
                    not "I cannot" in response_content,  # Not a refusal
                    task_type.lower() in response_content.lower() or "analysis" in response_content.lower(),  # Relevant content
                ]
                
                if all(success_indicators):
                    success = True
                    break
                else:
                    errors.append(f"Attempt {attempt + 1}: Response quality insufficient")
                    
            except Exception as e:
                error_msg = f"Attempt {attempt + 1}: {str(e)}"
                errors.append(error_msg)
                print(f"Error: {error_msg}")
                
                # Wait before retry
                if attempt < max_retries - 1:
                    time.sleep(2)
        
        end_time = time.time()
        
        return RealTaskMetrics(
            task_id=task_id,
            task_type=task_type,
            prompt=optimized_prompt,
            start_time=start_time,
            end_time=end_time,
            success=success,
            iterations=iterations,
            tokens_used=total_tokens,
            response_content=response_content,
            errors=errors,
            prompt_method='optimized'
        )
    
    def collect_real_enhanced_data(self, test_cases: List[Dict[str, str]]) -> Dict:
        """Collect real enhanced metrics using optimized prompts"""
        
        print("Collecting REAL enhanced metrics using optimized prompts...")
        print(f"Test cases: {len(test_cases)}")
        
        results = {
            'collection_start': time.time(),
            'task_results': [],
            'optimization_details': [],
            'summary': {
                'total_tasks': 0,
                'successful_tasks': 0,
                'total_tokens': 0,
                'total_duration': 0,
                'success_rate': 0
            }
        }
        
        for i, test_case in enumerate(test_cases):
            print(f"\n--- Enhanced Test Case {i+1}/{len(test_cases)} ---")
            print(f"Task: {test_case['task_type']}")
            print(f"Applying optimization techniques...")
            
            metric = self.execute_optimized_task(
                test_case['task_type'], 
                test_case['prompt']
            )
            
            self.metrics.append(metric)
            
            result = {
                'task_id': metric.task_id,
                'task_type': metric.task_type,
                'duration': metric.duration,
                'success': metric.success,
                'iterations': metric.iterations,
                'tokens_used': metric.tokens_used,
                'errors': metric.errors,
                'response_length': len(metric.response_content),
                'optimization_applied': True
            }
            
            results['task_results'].append(result)
            
            # Track optimization details
            optimization_detail = {
                'task_type': test_case['task_type'],
                'original_prompt_length': len(test_case['prompt']),
                'optimized_prompt_length': len(metric.prompt),
                'techniques_applied': [
                    'role_definition',
                    'structured_instructions', 
                    'thinking_process',
                    'output_format',
                    'xml_tags'
                ]
            }
            results['optimization_details'].append(optimization_detail)
            
            print(f"Result: {'SUCCESS' if metric.success else 'FAILED'}")
            print(f"Duration: {metric.duration:.2f}s")
            print(f"Tokens: {metric.tokens_used}")
            print(f"Iterations: {metric.iterations}")
            print(f"Optimized prompt length: {len(metric.prompt)} chars")
            
            # Rate limiting
            time.sleep(1)
        
        # Calculate summary statistics
        successful_tasks = [m for m in self.metrics if m.success]
        
        results['summary'] = {
            'total_tasks': len(self.metrics),
            'successful_tasks': len(successful_tasks),
            'total_tokens': sum(m.tokens_used for m in self.metrics),
            'total_duration': sum(m.duration for m in self.metrics),
            'success_rate': len(successful_tasks) / len(self.metrics) if self.metrics else 0,
            'avg_duration': sum(m.duration for m in self.metrics) / len(self.metrics) if self.metrics else 0,
            'avg_tokens': sum(m.tokens_used for m in self.metrics) / len(self.metrics) if self.metrics else 0,
            'avg_iterations': sum(m.iterations for m in self.metrics) / len(self.metrics) if self.metrics else 0
        }
        
        results['collection_end'] = time.time()
        results['collection_duration'] = results['collection_end'] - results['collection_start']
        
        return results
    
    def save_real_enhanced_results(self, results: Dict, filename: str = 'real_enhanced_metrics.json'):
        """Save real enhanced results to JSON file"""
        
        # Add detailed metrics for analysis
        detailed_results = results.copy()
        detailed_results['detailed_metrics'] = [asdict(m) for m in self.metrics]
        
        with open(filename, 'w') as f:
            json.dump(detailed_results, f, indent=2)
            
        print(f"\nReal enhanced results saved to {filename}")
        return filename


if __name__ == "__main__":
    # Import test cases from baseline collector
    from real_baseline_collector import create_real_test_cases
    
    # Verify API key is available
    if not os.getenv('ANTHROPIC_API_KEY'):
        print("Error: ANTHROPIC_API_KEY environment variable must be set")
        print("Export your API key: export ANTHROPIC_API_KEY='your-key-here'")
        exit(1)
    
    # Create collector
    collector = RealEnhancedCollector()
    
    # Use same test cases as baseline for fair comparison
    test_cases = create_real_test_cases()
    
    print("=== REAL ENHANCED DATA COLLECTION ===")
    print("This will apply actual optimization techniques and make real API calls")
    
    # Collect real enhanced data
    results = collector.collect_real_enhanced_data(test_cases)
    
    # Save results
    filename = collector.save_real_enhanced_results(results)
    
    # Print summary
    print("\n=== REAL ENHANCED COLLECTION SUMMARY ===")
    summary = results['summary']
    print(f"Total tasks: {summary['total_tasks']}")
    print(f"Successful tasks: {summary['successful_tasks']}")
    print(f"Success rate: {summary['success_rate']:.2%}")
    print(f"Total duration: {summary['total_duration']:.2f} seconds")
    print(f"Average duration per task: {summary['avg_duration']:.2f} seconds")
    print(f"Total tokens used: {summary['total_tokens']}")
    print(f"Average tokens per task: {summary['avg_tokens']:.0f}")
    print(f"Average iterations: {summary['avg_iterations']:.1f}")
    
    print(f"\nOptimization techniques applied:")
    for detail in results['optimization_details']:
        print(f"  {detail['task_type']}: {', '.join(detail['techniques_applied'])}")
    
    print(f"\nDetailed results saved to: {filename}")
    print("This is REAL data from actual optimized prompts using Claude API.")