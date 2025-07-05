#!/usr/bin/env python3
"""
Baseline Metrics Collector
Collects performance metrics from manual prompt creation workflows
"""

import time
import json
from typing import Dict, List, Callable, Any
from prompt_scorer import TaskMetrics, PromptScorer
import random


class BaselineCollector:
    """Collects metrics from manual prompt workflows"""
    
    def __init__(self, scorer: PromptScorer):
        self.scorer = scorer
        self.task_counter = 0
        
    def simulate_manual_task(self, task_type: str) -> TaskMetrics:
        """
        Simulate a manual task execution with realistic metrics.
        In real usage, this would wrap actual Claude Code operations.
        """
        self.task_counter += 1
        task_id = f"baseline_{task_type}_{self.task_counter}"
        
        # Simulate realistic manual prompt creation times
        task_times = {
            'code_review': (180, 420),      # 3-7 minutes
            'refactoring': (300, 600),      # 5-10 minutes
            'test_generation': (240, 480),   # 4-8 minutes
            'documentation': (120, 300),     # 2-5 minutes
            'bug_fix': (360, 900),          # 6-15 minutes
            'security_audit': (600, 1200),   # 10-20 minutes
        }
        
        min_time, max_time = task_times.get(task_type, (180, 360))
        duration = random.uniform(min_time, max_time)
        
        # Simulate manual workflow characteristics
        success_rate = 0.75  # 75% success rate for manual prompts
        avg_iterations = random.randint(2, 4)  # Usually takes 2-4 tries
        
        # Token usage is typically higher with manual prompts (more back-and-forth)
        base_tokens = {
            'code_review': 4000,
            'refactoring': 6000,
            'test_generation': 5000,
            'documentation': 3000,
            'bug_fix': 7000,
            'security_audit': 8000,
        }
        
        tokens_used = base_tokens.get(task_type, 5000) + random.randint(-1000, 2000)
        tokens_used *= avg_iterations  # More tokens for more iterations
        
        # Common errors in manual workflows
        potential_errors = [
            "Incomplete context provided",
            "Misunderstood requirements",
            "Missed edge case",
            "Formatting issues",
            "Incomplete implementation",
            "Wrong file targeted",
        ]
        
        errors = []
        if random.random() > success_rate:
            # Task failed - add errors
            errors = random.sample(potential_errors, random.randint(1, 3))
            success = False
        else:
            # Task succeeded but might still have minor issues
            if random.random() < 0.3:  # 30% chance of minor errors even on success
                errors = [random.choice(potential_errors)]
            success = True
            
        start_time = time.time()
        
        return TaskMetrics(
            task_id=task_id,
            task_type=task_type,
            start_time=start_time,
            end_time=start_time + duration,
            success=success,
            iterations=avg_iterations,
            tokens_used=tokens_used,
            errors=errors,
            prompt_method='manual'
        )
        
    def collect_baseline_metrics(self, task_types: List[str], samples_per_type: int = 10) -> Dict:
        """Collect baseline metrics for various task types"""
        print("Collecting baseline metrics for manual prompt workflows...")
        
        results = {
            'collection_start': time.time(),
            'task_types': {},
            'total_metrics': 0
        }
        
        for task_type in task_types:
            print(f"\nProcessing {task_type} tasks...")
            task_metrics = []
            
            for i in range(samples_per_type):
                metric = self.simulate_manual_task(task_type)
                self.scorer.add_baseline_metric(metric)
                task_metrics.append({
                    'task_id': metric.task_id,
                    'duration': metric.duration,
                    'success': metric.success,
                    'iterations': metric.iterations,
                    'tokens_used': metric.tokens_used,
                    'errors': metric.errors
                })
                
                # Simulate time between tasks
                time.sleep(0.1)  # In real usage, this would be actual task execution
                
            # Calculate task-specific stats
            successful_tasks = [m for m in task_metrics if m['success']]
            results['task_types'][task_type] = {
                'total_tasks': len(task_metrics),
                'successful_tasks': len(successful_tasks),
                'success_rate': len(successful_tasks) / len(task_metrics),
                'avg_duration': sum(m['duration'] for m in task_metrics) / len(task_metrics),
                'avg_iterations': sum(m['iterations'] for m in task_metrics) / len(task_metrics),
                'avg_tokens': sum(m['tokens_used'] for m in task_metrics) / len(task_metrics),
                'common_errors': self._get_common_errors(task_metrics)
            }
            
        results['collection_end'] = time.time()
        results['total_metrics'] = self.task_counter
        results['collection_duration'] = results['collection_end'] - results['collection_start']
        
        return results
        
    def _get_common_errors(self, metrics: List[Dict]) -> Dict[str, int]:
        """Analyze common errors from metrics"""
        error_counts = {}
        for metric in metrics:
            for error in metric['errors']:
                error_counts[error] = error_counts.get(error, 0) + 1
        return dict(sorted(error_counts.items(), key=lambda x: x[1], reverse=True))
        
    def save_baseline_results(self, results: Dict, filename: str = 'baseline_metrics.json'):
        """Save baseline collection results"""
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\nBaseline results saved to {filename}")
        return filename


# Example usage for testing manual workflows
def test_manual_code_review():
    """Example of how to wrap a real manual task"""
    start_time = time.time()
    
    # This is where you would actually perform a manual code review task
    # For example:
    # 1. Manually write a prompt for code review
    # 2. Submit to Claude Code
    # 3. Iterate based on responses
    # 4. Track errors and retries
    
    # Simulated result
    success = True
    iterations = 2
    tokens_used = 4500
    errors = []
    
    return TaskMetrics(
        task_id="manual_review_001",
        task_type="code_review",
        start_time=start_time,
        end_time=time.time(),
        success=success,
        iterations=iterations,
        tokens_used=tokens_used,
        errors=errors,
        prompt_method='manual'
    )


if __name__ == "__main__":
    # Create scorer and collector
    scorer = PromptScorer()
    collector = BaselineCollector(scorer)
    
    # Define task types to test
    task_types = [
        'code_review',
        'refactoring',
        'test_generation',
        'documentation',
        'bug_fix',
        'security_audit'
    ]
    
    # Collect baseline metrics
    results = collector.collect_baseline_metrics(task_types, samples_per_type=5)
    
    # Save results
    collector.save_baseline_results(results)
    
    # Display summary
    print("\n=== Baseline Collection Summary ===")
    print(f"Total tasks collected: {results['total_metrics']}")
    print(f"Collection duration: {results['collection_duration']:.2f} seconds")
    
    for task_type, stats in results['task_types'].items():
        print(f"\n{task_type}:")
        print(f"  Success rate: {stats['success_rate']:.2%}")
        print(f"  Avg duration: {stats['avg_duration']:.1f}s")
        print(f"  Avg iterations: {stats['avg_iterations']:.1f}")
        print(f"  Avg tokens: {stats['avg_tokens']:.0f}")