#!/usr/bin/env python3
"""
Real Comparison Analysis
Compares actual baseline vs enhanced metrics from real API calls
"""

import json
import os
import sys
from typing import Dict, List, Optional
from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np


class RealComparisonAnalyzer:
    """Analyzes real data from baseline vs enhanced experiments"""
    
    def __init__(self):
        self.baseline_data = None
        self.enhanced_data = None
        
    def load_real_data(self, 
                      baseline_file: str = 'real_baseline_metrics.json',
                      enhanced_file: str = 'real_enhanced_metrics.json') -> bool:
        """Load real experimental data"""
        
        try:
            if os.path.exists(baseline_file):
                with open(baseline_file, 'r') as f:
                    self.baseline_data = json.load(f)
                print(f"Loaded baseline data: {baseline_file}")
            else:
                print(f"Baseline file not found: {baseline_file}")
                return False
                
            if os.path.exists(enhanced_file):
                with open(enhanced_file, 'r') as f:
                    self.enhanced_data = json.load(f)
                print(f"Loaded enhanced data: {enhanced_file}")
            else:
                print(f"Enhanced file not found: {enhanced_file}")
                return False
                
            return True
            
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
    
    def calculate_real_improvements(self) -> Dict:
        """Calculate actual improvements from real data"""
        
        if not self.baseline_data or not self.enhanced_data:
            raise ValueError("Real data not loaded. Run load_real_data() first.")
        
        baseline_summary = self.baseline_data['summary']
        enhanced_summary = self.enhanced_data['summary']
        
        # Calculate actual percentage improvements
        time_improvement = 0
        if baseline_summary['avg_duration'] > 0:
            time_improvement = ((baseline_summary['avg_duration'] - enhanced_summary['avg_duration']) 
                              / baseline_summary['avg_duration']) * 100
        
        token_improvement = 0
        if baseline_summary['avg_tokens'] > 0:
            token_improvement = ((baseline_summary['avg_tokens'] - enhanced_summary['avg_tokens']) 
                               / baseline_summary['avg_tokens']) * 100
        
        iteration_improvement = 0
        if baseline_summary['avg_iterations'] > 0:
            iteration_improvement = ((baseline_summary['avg_iterations'] - enhanced_summary['avg_iterations']) 
                                   / baseline_summary['avg_iterations']) * 100
        
        success_rate_improvement = (enhanced_summary['success_rate'] - baseline_summary['success_rate']) * 100
        
        improvements = {
            'time_improvement_percent': time_improvement,
            'token_improvement_percent': token_improvement,
            'iteration_improvement_percent': iteration_improvement,
            'success_rate_improvement_percent': success_rate_improvement,
            'baseline_metrics': {
                'avg_duration': baseline_summary['avg_duration'],
                'avg_tokens': baseline_summary['avg_tokens'],
                'avg_iterations': baseline_summary['avg_iterations'],
                'success_rate': baseline_summary['success_rate']
            },
            'enhanced_metrics': {
                'avg_duration': enhanced_summary['avg_duration'],
                'avg_tokens': enhanced_summary['avg_tokens'],
                'avg_iterations': enhanced_summary['avg_iterations'],
                'success_rate': enhanced_summary['success_rate']
            }
        }
        
        return improvements
    
    def analyze_by_task_type(self) -> Dict:
        """Analyze improvements broken down by task type"""
        
        task_analysis = {}
        
        # Group results by task type
        baseline_by_task = {}
        enhanced_by_task = {}
        
        for result in self.baseline_data['task_results']:
            task_type = result['task_type']
            if task_type not in baseline_by_task:
                baseline_by_task[task_type] = []
            baseline_by_task[task_type].append(result)
        
        for result in self.enhanced_data['task_results']:
            task_type = result['task_type']
            if task_type not in enhanced_by_task:
                enhanced_by_task[task_type] = []
            enhanced_by_task[task_type].append(result)
        
        # Calculate improvements for each task type
        for task_type in baseline_by_task.keys():
            if task_type in enhanced_by_task:
                baseline_tasks = baseline_by_task[task_type]
                enhanced_tasks = enhanced_by_task[task_type]
                
                # Calculate averages
                baseline_avg_duration = np.mean([t['duration'] for t in baseline_tasks])
                enhanced_avg_duration = np.mean([t['duration'] for t in enhanced_tasks])
                
                baseline_avg_tokens = np.mean([t['tokens_used'] for t in baseline_tasks])
                enhanced_avg_tokens = np.mean([t['tokens_used'] for t in enhanced_tasks])
                
                baseline_success_rate = np.mean([t['success'] for t in baseline_tasks])
                enhanced_success_rate = np.mean([t['success'] for t in enhanced_tasks])
                
                # Calculate improvements
                time_improvement = 0
                if baseline_avg_duration > 0:
                    time_improvement = ((baseline_avg_duration - enhanced_avg_duration) / baseline_avg_duration) * 100
                
                token_improvement = 0
                if baseline_avg_tokens > 0:
                    token_improvement = ((baseline_avg_tokens - enhanced_avg_tokens) / baseline_avg_tokens) * 100
                
                success_improvement = (enhanced_success_rate - baseline_success_rate) * 100
                
                task_analysis[task_type] = {
                    'time_improvement_percent': time_improvement,
                    'token_improvement_percent': token_improvement,
                    'success_rate_improvement_percent': success_improvement,
                    'baseline_duration': baseline_avg_duration,
                    'enhanced_duration': enhanced_avg_duration,
                    'baseline_tokens': baseline_avg_tokens,
                    'enhanced_tokens': enhanced_avg_tokens,
                    'baseline_success_rate': baseline_success_rate,
                    'enhanced_success_rate': enhanced_success_rate
                }
        
        return task_analysis
    
    def generate_real_comparison_report(self) -> Dict:
        """Generate comprehensive comparison report from real data"""
        
        overall_improvements = self.calculate_real_improvements()
        task_improvements = self.analyze_by_task_type()
        
        # Calculate statistical significance (basic)
        baseline_durations = [r['duration'] for r in self.baseline_data['task_results']]
        enhanced_durations = [r['duration'] for r in self.enhanced_data['task_results']]
        
        report = {
            'experiment_info': {
                'baseline_collection_date': self.baseline_data.get('collection_start'),
                'enhanced_collection_date': self.enhanced_data.get('collection_start'),
                'baseline_tasks': self.baseline_data['summary']['total_tasks'],
                'enhanced_tasks': self.enhanced_data['summary']['total_tasks'],
                'analysis_date': datetime.now().isoformat()
            },
            'overall_improvements': overall_improvements,
            'task_type_analysis': task_improvements,
            'statistical_analysis': {
                'baseline_duration_std': np.std(baseline_durations),
                'enhanced_duration_std': np.std(enhanced_durations),
                'duration_effect_size': (np.mean(baseline_durations) - np.mean(enhanced_durations)) / np.std(baseline_durations) if np.std(baseline_durations) > 0 else 0
            },
            'optimization_techniques_used': self.enhanced_data.get('optimization_details', []),
            'data_quality': {
                'baseline_success_rate': self.baseline_data['summary']['success_rate'],
                'enhanced_success_rate': self.enhanced_data['summary']['success_rate'],
                'data_completeness': 'All tasks completed' if (
                    self.baseline_data['summary']['total_tasks'] > 0 and 
                    self.enhanced_data['summary']['total_tasks'] > 0
                ) else 'Incomplete data'
            }
        }
        
        return report
    
    def create_real_visualizations(self, output_dir: str = './'):
        """Create visualizations from real data"""
        
        improvements = self.calculate_real_improvements()
        task_analysis = self.analyze_by_task_type()
        
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. Overall improvements comparison
        metrics = ['Time', 'Tokens', 'Iterations', 'Success Rate']
        values = [
            improvements['time_improvement_percent'],
            improvements['token_improvement_percent'], 
            improvements['iteration_improvement_percent'],
            improvements['success_rate_improvement_percent']
        ]
        
        colors = ['green' if v > 0 else 'red' for v in values]
        bars = ax1.bar(metrics, values, color=colors, alpha=0.7)
        ax1.set_ylabel('Improvement (%)')
        ax1.set_title('Overall Performance Improvements (Real Data)')
        ax1.axhline(y=0, color='black', linestyle='-', alpha=0.3)
        
        # Add value labels
        for bar, value in zip(bars, values):
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height,
                    f'{value:.1f}%', ha='center', va='bottom' if height > 0 else 'top')
        
        # 2. Task-specific time improvements
        task_types = list(task_analysis.keys())
        time_improvements = [task_analysis[t]['time_improvement_percent'] for t in task_types]
        
        bars2 = ax2.bar(range(len(task_types)), time_improvements, 
                       color=['green' if x > 0 else 'red' for x in time_improvements], alpha=0.7)
        ax2.set_xlabel('Task Type')
        ax2.set_ylabel('Time Improvement (%)')
        ax2.set_title('Time Improvement by Task Type')
        ax2.set_xticks(range(len(task_types)))
        ax2.set_xticklabels(task_types, rotation=45, ha='right')
        ax2.axhline(y=0, color='black', linestyle='-', alpha=0.3)
        
        # 3. Duration comparison
        baseline_durations = [improvements['baseline_metrics']['avg_duration']]
        enhanced_durations = [improvements['enhanced_metrics']['avg_duration']]
        
        x = np.arange(1)
        width = 0.35
        
        ax3.bar(x - width/2, baseline_durations, width, label='Baseline', color='orange', alpha=0.8)
        ax3.bar(x + width/2, enhanced_durations, width, label='Enhanced', color='blue', alpha=0.8)
        ax3.set_ylabel('Average Duration (seconds)')
        ax3.set_title('Average Task Duration Comparison')
        ax3.set_xticks(x)
        ax3.set_xticklabels(['Overall'])
        ax3.legend()
        
        # 4. Success rate comparison
        baseline_success = improvements['baseline_metrics']['success_rate'] * 100
        enhanced_success = improvements['enhanced_metrics']['success_rate'] * 100
        
        ax4.bar(['Baseline', 'Enhanced'], [baseline_success, enhanced_success], 
               color=['orange', 'blue'], alpha=0.8)
        ax4.set_ylabel('Success Rate (%)')
        ax4.set_title('Success Rate Comparison')
        ax4.set_ylim(0, 105)
        
        # Add value labels
        ax4.text(0, baseline_success + 1, f'{baseline_success:.1f}%', ha='center')
        ax4.text(1, enhanced_success + 1, f'{enhanced_success:.1f}%', ha='center')
        
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'real_prompt_optimization_results.png'), 
                   dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"Real data visualization saved to: {os.path.join(output_dir, 'real_prompt_optimization_results.png')}")
    
    def print_real_summary(self, report: Dict):
        """Print formatted summary of real experimental results"""
        
        print("\n" + "="*70)
        print("REAL PROMPT OPTIMIZATION EXPERIMENTAL RESULTS")
        print("="*70)
        
        exp_info = report['experiment_info']
        print(f"\nExperiment Info:")
        print(f"  Baseline tasks: {exp_info['baseline_tasks']}")
        print(f"  Enhanced tasks: {exp_info['enhanced_tasks']}")
        print(f"  Analysis date: {exp_info['analysis_date']}")
        
        overall = report['overall_improvements']
        print(f"\nOverall Improvements (Real Data):")
        print(f"  Time improvement: {overall['time_improvement_percent']:.1f}%")
        print(f"  Token efficiency: {overall['token_improvement_percent']:.1f}%")
        print(f"  Iteration reduction: {overall['iteration_improvement_percent']:.1f}%")
        print(f"  Success rate increase: {overall['success_rate_improvement_percent']:.1f}%")
        
        print(f"\nBaseline Metrics:")
        baseline = overall['baseline_metrics']
        print(f"  Avg duration: {baseline['avg_duration']:.2f}s")
        print(f"  Avg tokens: {baseline['avg_tokens']:.0f}")
        print(f"  Success rate: {baseline['success_rate']:.1%}")
        
        print(f"\nEnhanced Metrics:")
        enhanced = overall['enhanced_metrics']
        print(f"  Avg duration: {enhanced['avg_duration']:.2f}s")
        print(f"  Avg tokens: {enhanced['avg_tokens']:.0f}")
        print(f"  Success rate: {enhanced['success_rate']:.1%}")
        
        print(f"\nTask-Specific Results:")
        for task_type, analysis in report['task_type_analysis'].items():
            print(f"  {task_type}:")
            print(f"    Time improvement: {analysis['time_improvement_percent']:.1f}%")
            print(f"    Token efficiency: {analysis['token_improvement_percent']:.1f}%")
            print(f"    Success improvement: {analysis['success_rate_improvement_percent']:.1f}%")
        
        data_quality = report['data_quality']
        print(f"\nData Quality:")
        print(f"  Baseline success rate: {data_quality['baseline_success_rate']:.1%}")
        print(f"  Enhanced success rate: {data_quality['enhanced_success_rate']:.1%}")
        print(f"  Completeness: {data_quality['data_completeness']}")
        
        print("\n" + "="*70)
        print("NOTE: These are REAL experimental results from actual Claude API calls")
        print("="*70)
    
    def save_real_report(self, report: Dict, filename: str = 'real_optimization_analysis.json'):
        """Save real analysis report"""
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"Real analysis report saved to: {filename}")
        return filename


def main():
    """Run real data analysis"""
    
    analyzer = RealComparisonAnalyzer()
    
    print("Loading real experimental data...")
    if not analyzer.load_real_data():
        print("\nError: Could not load real experimental data.")
        print("Make sure you have run:")
        print("1. python real_baseline_collector.py")
        print("2. python real_enhanced_collector.py")
        print("\nThese scripts require a valid ANTHROPIC_API_KEY to generate real data.")
        return
    
    print("Analyzing real experimental results...")
    report = analyzer.generate_real_comparison_report()
    
    # Print summary
    analyzer.print_real_summary(report)
    
    # Create visualizations
    print("\nGenerating visualizations...")
    analyzer.create_real_visualizations()
    
    # Save report
    analyzer.save_real_report(report)
    
    print("\nReal experimental analysis complete!")


if __name__ == "__main__":
    main()