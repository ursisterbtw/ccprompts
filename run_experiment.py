#!/usr/bin/env python3
"""
Main Experiment Runner
Orchestrates the complete A/B test between baseline and enhanced workflows
"""

import time
import json
import os
import sys
from datetime import datetime
from prompt_scorer import PromptScorer, TaskMetrics
from baseline_collector import BaselineCollector
from enhanced_collector import EnhancedCollector
from compare_results import ResultsComparator


class ExperimentRunner:
    """Main orchestrator for prompt generation impact experiments"""
    
    def __init__(self, experiment_name: str = None):
        self.experiment_name = experiment_name or f"experiment_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.scorer = PromptScorer()
        self.baseline_collector = BaselineCollector(self.scorer)
        self.enhanced_collector = EnhancedCollector(self.scorer)
        self.comparator = ResultsComparator(self.scorer)
        
        # Create experiment directory
        self.output_dir = f"./experiments/{self.experiment_name}"
        os.makedirs(self.output_dir, exist_ok=True)
        
    def run_full_experiment(self, task_types: list = None, samples_per_type: int = 10):
        """Run complete A/B test experiment"""
        if task_types is None:
            task_types = [
                'code_review',
                'refactoring',
                'test_generation',
                'documentation',
                'bug_fix',
                'security_audit'
            ]
            
        print(f"\n{'='*60}")
        print(f"PROMPT GENERATION IMPACT EXPERIMENT")
        print(f"Experiment: {self.experiment_name}")
        print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}\n")
        
        experiment_log = {
            'experiment_name': self.experiment_name,
            'start_time': datetime.now().isoformat(),
            'task_types': task_types,
            'samples_per_type': samples_per_type,
            'phases': {}
        }
        
        # Phase 1: Baseline Collection
        print("PHASE 1: BASELINE COLLECTION")
        print("-" * 40)
        phase1_start = time.time()
        
        baseline_results = self.baseline_collector.collect_baseline_metrics(
            task_types, samples_per_type
        )
        baseline_file = os.path.join(self.output_dir, 'baseline_metrics.json')
        self.baseline_collector.save_baseline_results(baseline_results, baseline_file)
        
        phase1_duration = time.time() - phase1_start
        experiment_log['phases']['baseline'] = {
            'duration': phase1_duration,
            'metrics_collected': baseline_results['total_metrics']
        }
        
        # Phase 2: Enhanced Collection
        print("\nPHASE 2: ENHANCED COLLECTION")
        print("-" * 40)
        phase2_start = time.time()
        
        enhanced_results = self.enhanced_collector.collect_enhanced_metrics(
            task_types, samples_per_type
        )
        enhanced_file = os.path.join(self.output_dir, 'enhanced_metrics.json')
        self.enhanced_collector.save_enhanced_results(enhanced_results, enhanced_file)
        
        phase2_duration = time.time() - phase2_start
        experiment_log['phases']['enhanced'] = {
            'duration': phase2_duration,
            'metrics_collected': enhanced_results['total_metrics']
        }
        
        # Phase 3: Analysis and Comparison
        print("\nPHASE 3: ANALYSIS AND COMPARISON")
        print("-" * 40)
        phase3_start = time.time()
        
        # Load results for comparison
        self.comparator.load_results(baseline_file, enhanced_file)
        
        # Generate comparison report
        report = self.comparator.generate_comparison_report()
        report_file = os.path.join(self.output_dir, 'comparison_report.json')
        self.comparator.save_report(report, report_file)
        
        # Create visualizations
        self.comparator.create_visualizations(self.output_dir)
        
        # Save scorer results
        scorer_file = os.path.join(self.output_dir, 'prompt_impact_results.json')
        self.scorer.save_results(scorer_file)
        
        phase3_duration = time.time() - phase3_start
        experiment_log['phases']['analysis'] = {
            'duration': phase3_duration,
            'report_generated': True
        }
        
        # Complete experiment log
        experiment_log['end_time'] = datetime.now().isoformat()
        experiment_log['total_duration'] = sum(
            phase['duration'] for phase in experiment_log['phases'].values()
        )
        experiment_log['results_summary'] = report['summary']
        
        # Save experiment log
        log_file = os.path.join(self.output_dir, 'experiment_log.json')
        with open(log_file, 'w') as f:
            json.dump(experiment_log, f, indent=2)
            
        # Print final summary
        self.comparator.print_summary(report)
        
        print(f"\n{'='*60}")
        print("EXPERIMENT COMPLETE")
        print(f"{'='*60}")
        print(f"Total Duration: {experiment_log['total_duration']:.2f} seconds")
        print(f"Results saved to: {self.output_dir}")
        print(f"\nFiles generated:")
        print(f"  - baseline_metrics.json")
        print(f"  - enhanced_metrics.json")
        print(f"  - comparison_report.json")
        print(f"  - prompt_impact_results.json")
        print(f"  - prompt_impact_comparison.png")
        print(f"  - prompt_impact_summary.png")
        print(f"  - experiment_log.json")
        
        return report
        
    def run_quick_demo(self):
        """Run a quick demonstration with fewer samples"""
        print("\n🚀 Running Quick Demo...")
        
        task_types = ['code_review', 'refactoring', 'test_generation']
        report = self.run_full_experiment(task_types, samples_per_type=3)
        
        print("\n✨ Quick Demo Complete!")
        return report
        
    def run_real_world_simulation(self, workflow_name: str, steps: list):
        """Simulate a real-world workflow comparing manual vs enhanced approaches"""
        print(f"\n{'='*60}")
        print(f"REAL-WORLD WORKFLOW SIMULATION: {workflow_name}")
        print(f"{'='*60}\n")
        
        # Run workflow with manual prompts
        print("Running workflow with MANUAL prompts...")
        manual_start = time.time()
        manual_metrics = []
        
        for i, step in enumerate(steps):
            print(f"  Step {i+1}: {step['description']}")
            metric = self.baseline_collector.simulate_manual_task(step['type'])
            manual_metrics.append(metric)
            self.scorer.add_baseline_metric(metric)
            
        manual_duration = time.time() - manual_start
        manual_success = all(m.success for m in manual_metrics)
        
        print(f"\nManual workflow completed in {manual_duration:.1f}s")
        print(f"Success: {manual_success}")
        print(f"Total tokens used: {sum(m.tokens_used for m in manual_metrics)}")
        
        # Run workflow with enhanced prompts
        print("\n" + "-"*40)
        print("Running workflow with ENHANCED prompts...")
        enhanced_start = time.time()
        enhanced_metrics = []
        
        for i, step in enumerate(steps):
            print(f"  Step {i+1}: {step['description']}")
            metric = self.enhanced_collector.simulate_enhanced_task(step['type'])
            enhanced_metrics.append(metric)
            self.scorer.add_enhanced_metric(metric)
            
        enhanced_duration = time.time() - enhanced_start
        enhanced_success = all(m.success for m in enhanced_metrics)
        
        print(f"\nEnhanced workflow completed in {enhanced_duration:.1f}s")
        print(f"Success: {enhanced_success}")
        print(f"Total tokens used: {sum(m.tokens_used for m in enhanced_metrics)}")
        
        # Compare results
        print(f"\n{'='*40}")
        print("WORKFLOW COMPARISON")
        print(f"{'='*40}")
        print(f"Time saved: {manual_duration - enhanced_duration:.1f}s ({(manual_duration - enhanced_duration) / manual_duration * 100:.1f}%)")
        print(f"Token savings: {sum(m.tokens_used for m in manual_metrics) - sum(m.tokens_used for m in enhanced_metrics)}")
        print(f"Iteration reduction: {sum(m.iterations for m in manual_metrics)} → {sum(m.iterations for m in enhanced_metrics)}")
        
        return {
            'workflow_name': workflow_name,
            'manual': {
                'duration': manual_duration,
                'success': manual_success,
                'total_tokens': sum(m.tokens_used for m in manual_metrics),
                'total_iterations': sum(m.iterations for m in manual_metrics)
            },
            'enhanced': {
                'duration': enhanced_duration,
                'success': enhanced_success,
                'total_tokens': sum(m.tokens_used for m in enhanced_metrics),
                'total_iterations': sum(m.iterations for m in enhanced_metrics)
            }
        }


def main():
    """Main entry point"""
    print("🔬 Prompt Generation Impact Measurement Tool")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == '--demo':
        # Run quick demo
        runner = ExperimentRunner("quick_demo")
        runner.run_quick_demo()
        
    elif len(sys.argv) > 1 and sys.argv[1] == '--workflow':
        # Run real-world workflow simulation
        runner = ExperimentRunner("workflow_simulation")
        
        # Example: Full Stack Feature Implementation
        workflow = runner.run_real_world_simulation(
            "Full Stack Feature Implementation",
            [
                {'type': 'code_review', 'description': 'Review existing codebase'},
                {'type': 'refactoring', 'description': 'Refactor database models'},
                {'type': 'bug_fix', 'description': 'Fix authentication bug'},
                {'type': 'test_generation', 'description': 'Generate unit tests'},
                {'type': 'documentation', 'description': 'Update API documentation'},
                {'type': 'security_audit', 'description': 'Security review'}
            ]
        )
        
    else:
        # Run full experiment
        runner = ExperimentRunner()
        
        # You can customize task types and sample sizes
        runner.run_full_experiment(
            task_types=[
                'code_review',
                'refactoring',
                'test_generation',
                'documentation',
                'bug_fix',
                'security_audit'
            ],
            samples_per_type=10
        )
        
        print("\n💡 Tip: Use --demo for a quick demonstration")
        print("💡 Tip: Use --workflow for real-world workflow simulation")


if __name__ == "__main__":
    main()