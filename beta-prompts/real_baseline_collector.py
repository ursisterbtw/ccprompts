#!/usr/bin/env python3
"""
Real Baseline Metrics Collector
Collects actual performance metrics from real prompt workflows
"""

import time
import json
import os
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import anthropic
from anthropic import Anthropic


@dataclass
class RealTaskMetrics:
    """Real metrics for actual task execution"""
    task_id: str
    task_type: str
    prompt: str
    start_time: float
    end_time: float
    success: bool
    iterations: int
    tokens_used: int
    response_content: str
    errors: List[str]
    prompt_method: str  # 'manual' or 'generated'
    
    @property
    def duration(self) -> float:
        return self.end_time - self.start_time


class RealBaselineCollector:
    """Collects real metrics from actual Claude API calls"""
    
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
        
    def execute_real_task(self, task_type: str, prompt: str, max_retries: int = 3) -> RealTaskMetrics:
        """Execute a real task using Claude API and collect actual metrics"""
        
        task_id = f"real_{task_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        start_time = time.time()
        
        errors = []
        iterations = 0
        success = False
        response_content = ""
        total_tokens = 0
        
        for attempt in range(max_retries):
            iterations += 1
            
            try:
                print(f"Executing {task_type} (attempt {attempt + 1}/{max_retries})...")
                
                response = self.client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=4000,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                
                response_content = response.content[0].text
                total_tokens += response.usage.input_tokens + response.usage.output_tokens
                
                # Simple success criteria - check if response is substantial and relevant
                if len(response_content) > 100 and not "I cannot" in response_content:
                    success = True
                    break
                else:
                    errors.append(f"Attempt {attempt + 1}: Response too short or refusal")
                    
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
            prompt=prompt,
            start_time=start_time,
            end_time=end_time,
            success=success,
            iterations=iterations,
            tokens_used=total_tokens,
            response_content=response_content,
            errors=errors,
            prompt_method='manual'
        )
    
    def collect_real_baseline_data(self, test_cases: List[Dict[str, str]]) -> Dict:
        """Collect real baseline metrics for various task types"""
        
        print("Collecting REAL baseline metrics from Claude API...")
        print(f"Test cases: {len(test_cases)}")
        
        results = {
            'collection_start': time.time(),
            'task_results': [],
            'summary': {
                'total_tasks': 0,
                'successful_tasks': 0,
                'total_tokens': 0,
                'total_duration': 0,
                'success_rate': 0
            }
        }
        
        for i, test_case in enumerate(test_cases):
            print(f"\n--- Test Case {i+1}/{len(test_cases)} ---")
            print(f"Task: {test_case['task_type']}")
            print(f"Prompt: {test_case['prompt'][:100]}...")
            
            metric = self.execute_real_task(
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
                'response_length': len(metric.response_content)
            }
            
            results['task_results'].append(result)
            
            print(f"Result: {'SUCCESS' if metric.success else 'FAILED'}")
            print(f"Duration: {metric.duration:.2f}s")
            print(f"Tokens: {metric.tokens_used}")
            print(f"Iterations: {metric.iterations}")
            
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
    
    def save_real_results(self, results: Dict, filename: str = 'real_baseline_metrics.json'):
        """Save real results to JSON file"""
        
        # Add detailed metrics for analysis
        detailed_results = results.copy()
        detailed_results['detailed_metrics'] = [asdict(m) for m in self.metrics]
        
        with open(filename, 'w') as f:
            json.dump(detailed_results, f, indent=2)
            
        print(f"\nReal baseline results saved to {filename}")
        return filename


def create_real_test_cases() -> List[Dict[str, str]]:
    """Create real test cases for baseline measurement"""
    
    return [
        {
            'task_type': 'code_review',
            'prompt': '''Review this Python function for bugs and security issues:

```python
def process_user_input(user_data):
    query = "SELECT * FROM users WHERE id = " + user_data['id']
    result = execute_query(query)
    return result
```

Identify any issues and suggest fixes.'''
        },
        
        {
            'task_type': 'refactoring',
            'prompt': '''Refactor this code to be more maintainable and follow SOLID principles:

```python
class UserManager:
    def __init__(self):
        self.db_connection = create_db_connection()
        self.email_service = EmailService()
        self.logger = Logger()
    
    def create_user(self, name, email, password):
        if not name or not email or not password:
            self.logger.log("Invalid input")
            return False
        
        hashed_password = hash_password(password)
        user_id = self.db_connection.insert_user(name, email, hashed_password)
        
        if user_id:
            self.email_service.send_welcome_email(email)
            self.logger.log(f"User {user_id} created")
            return True
        return False
```

Provide the refactored code.'''
        },
        
        {
            'task_type': 'test_generation',
            'prompt': '''Generate comprehensive unit tests for this function:

```python
def calculate_discount(price, customer_type, coupon_code=None):
    if price < 0:
        raise ValueError("Price cannot be negative")
    
    discount = 0
    
    if customer_type == "premium":
        discount = 0.15
    elif customer_type == "regular":
        discount = 0.05
    
    if coupon_code == "SAVE20":
        discount += 0.20
    elif coupon_code == "SAVE10":
        discount += 0.10
    
    if discount > 0.50:
        discount = 0.50
    
    return price * (1 - discount)
```

Include edge cases and error conditions.'''
        },
        
        {
            'task_type': 'documentation',
            'prompt': '''Create comprehensive API documentation for this endpoint:

```python
@app.route('/api/users/<int:user_id>/posts', methods=['GET', 'POST'])
def user_posts(user_id):
    if request.method == 'GET':
        posts = get_user_posts(user_id, limit=request.args.get('limit', 10))
        return jsonify(posts)
    elif request.method == 'POST':
        post_data = request.get_json()
        new_post = create_post(user_id, post_data)
        return jsonify(new_post), 201
```

Include parameters, responses, examples, and error codes.'''
        },
        
        {
            'task_type': 'bug_fix',
            'prompt': '''Debug this issue: Users report that their shopping cart total is sometimes incorrect.

```python
def calculate_cart_total(cart_items):
    total = 0
    for item in cart_items:
        item_total = item['price'] * item['quantity']
        if item['discount']:
            item_total = item_total - item['discount']
        total += item_total
    
    tax = total * 0.08
    return total + tax
```

Sample failing case:
- Item 1: price=100, quantity=2, discount=10%
- Item 2: price=50, quantity=1, discount=5
- Expected total with tax: ~$194.40
- Actual result: varies

Find and fix the bug.'''
        }
    ]


if __name__ == "__main__":
    # Verify API key is available
    if not os.getenv('ANTHROPIC_API_KEY'):
        print("Error: ANTHROPIC_API_KEY environment variable must be set")
        print("Export your API key: export ANTHROPIC_API_KEY='your-key-here'")
        exit(1)
    
    # Create collector
    collector = RealBaselineCollector()
    
    # Create real test cases
    test_cases = create_real_test_cases()
    
    print("=== REAL BASELINE DATA COLLECTION ===")
    print("This will make actual API calls to collect real performance metrics")
    
    # Collect real data
    results = collector.collect_real_baseline_data(test_cases)
    
    # Save results
    filename = collector.save_real_results(results)
    
    # Print summary
    print("\n=== REAL BASELINE COLLECTION SUMMARY ===")
    summary = results['summary']
    print(f"Total tasks: {summary['total_tasks']}")
    print(f"Successful tasks: {summary['successful_tasks']}")
    print(f"Success rate: {summary['success_rate']:.2%}")
    print(f"Total duration: {summary['total_duration']:.2f} seconds")
    print(f"Average duration per task: {summary['avg_duration']:.2f} seconds")
    print(f"Total tokens used: {summary['total_tokens']}")
    print(f"Average tokens per task: {summary['avg_tokens']:.0f}")
    print(f"Average iterations: {summary['avg_iterations']:.1f}")
    
    print(f"\nDetailed results saved to: {filename}")
    print("This is REAL data from actual Claude API calls.")