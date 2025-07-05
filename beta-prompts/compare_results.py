#!/usr/bin/env python3
"""
Results Comparison and Visualization
Compares baseline vs enhanced metrics and generates reports
"""

import json
import os
from typing import Dict, List, Tuple
from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np
from prompt_scorer import PromptScorer


class ResultsComparator:
    """Compare and visualize baseline vs enhanced workflow results"""
    
    def __init__(self, scorer: PromptScorer):
        self.scorer = scorer
        self.baseline_data = None
        self.enhanced_data = None
        
    def load_results(self, baseline_file: str = 'baseline_metrics.json', 
                    enhanced_file: str = 'enhanced_metrics.json'):
        """Load baseline and enhanced results from files"""
        if os.path.exists(baseline_file):
            with open(baseline_file, 'r') as f:
                self.baseline_data = json.load(f)
                
        if os.path.exists(enhanced_file):
            with open(enhanced_file, 'r') as f:
                self.enhanced_data = json.load(f)
                
        return self.baseline_data is not None and self.enhanced_data is not None
        
    def generate_comparison_report(self) -> Dict:
        """Generate comprehensive comparison report"""
        if not self.baseline_data or not self.enhanced_data:
            return {"error": "Missing baseline or enhanced data"}
            
        # Get overall scores from scorer
        scores = self.scorer.get_overall_score()
        detailed = self.scorer.get_detailed_comparison()
        
        # Calculate improvements by task type
        task_improvements = {}
        for task_type in self.baseline_data['task_types']:
            if task_type in self.enhanced_data['task_types']:
                baseline = self.baseline_data['task_types'][task_type]
                enhanced = self.enhanced_data['task_types'][task_type]
                
                task_improvements[task_type] = {
                    'time_reduction': (baseline['avg_duration'] - enhanced['avg_duration']) / baseline['avg_duration'] * 100,
                    'success_rate_increase': (enhanced['success_rate'] - baseline['success_rate']) * 100,
                    'iteration_reduction': (baseline['avg_iterations'] - enhanced['avg_iterations']) / baseline['avg_iterations'] * 100,
                    'token_efficiency': (baseline['avg_tokens'] - enhanced['avg_tokens']) / baseline['avg_tokens'] * 100,
                    'error_reduction': len(baseline.get('common_errors', {})) - len(enhanced.get('common_errors', {}))
                }
                
        # Calculate ROI metrics
        total_baseline_time = sum(
            stats['avg_duration'] * stats['total_tasks'] 
            for stats in self.baseline_data['task_types'].values()
        )
        total_enhanced_time = sum(
            stats['avg_duration'] * stats['total_tasks'] 
            for stats in self.enhanced_data['task_types'].values()
        )
        
        time_saved_hours = (total_baseline_time - total_enhanced_time) / 3600
        
        # Assuming developer time cost
        hourly_rate = 75  # $75/hour average developer cost
        cost_savings = time_saved_hours * hourly_rate
        
        report = {
            'summary': {
                'overall_improvement_score': scores['overall_score'],
                'efficiency_gain': scores['efficiency_score'],
                'quality_improvement': scores['quality_score'],
                'token_savings': scores['token_efficiency'],
                'iteration_improvement': scores['iteration_improvement']
            },
            'task_improvements': task_improvements,
            'roi_metrics': {
                'total_time_saved_hours': round(time_saved_hours, 2),
                'estimated_cost_savings': round(cost_savings, 2),
                'productivity_increase': round(scores['efficiency_score'], 1),
                'quality_increase': round(scores['quality_score'], 1)
            },
            'detailed_comparison': detailed,
            'report_generated': datetime.now().isoformat()
        }
        
        return report
        
    def create_visualizations(self, output_dir: str = './'):
        """Create comparison charts and graphs"""
        if not self.baseline_data or not self.enhanced_data:
            print("Cannot create visualizations: missing data")
            return
            
        # Set up the plot style
        plt.style.use('seaborn-v0_8-darkgrid')
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. Task Duration Comparison
        task_types = list(self.baseline_data['task_types'].keys())
        baseline_durations = [self.baseline_data['task_types'][t]['avg_duration'] for t in task_types]
        enhanced_durations = [self.enhanced_data['task_types'][t]['avg_duration'] for t in task_types]
        
        x = np.arange(len(task_types))
        width = 0.35
        
        ax1.bar(x - width/2, baseline_durations, width, label='Baseline', color='#ff7f0e', alpha=0.8)
        ax1.bar(x + width/2, enhanced_durations, width, label='Enhanced', color='#2ca02c', alpha=0.8)
        ax1.set_xlabel('Task Type')
        ax1.set_ylabel('Average Duration (seconds)')
        ax1.set_title('Task Duration Comparison')
        ax1.set_xticks(x)
        ax1.set_xticklabels(task_types, rotation=45, ha='right')
        ax1.legend()
        
        # Add improvement percentages
        for i, (b, e) in enumerate(zip(baseline_durations, enhanced_durations)):
            improvement = (b - e) / b * 100
            ax1.text(i, max(b, e) + 10, f'-{improvement:.0f}%', ha='center', va='bottom', fontsize=9)
        
        # 2. Success Rate Comparison
        baseline_success = [self.baseline_data['task_types'][t]['success_rate'] * 100 for t in task_types]
        enhanced_success = [self.enhanced_data['task_types'][t]['success_rate'] * 100 for t in task_types]
        
        ax2.bar(x - width/2, baseline_success, width, label='Baseline', color='#ff7f0e', alpha=0.8)
        ax2.bar(x + width/2, enhanced_success, width, label='Enhanced', color='#2ca02c', alpha=0.8)
        ax2.set_xlabel('Task Type')
        ax2.set_ylabel('Success Rate (%)')
        ax2.set_title('Success Rate Comparison')
        ax2.set_xticks(x)
        ax2.set_xticklabels(task_types, rotation=45, ha='right')
        ax2.set_ylim(0, 105)
        ax2.legend()
        
        # 3. Token Usage Efficiency
        baseline_tokens = [self.baseline_data['task_types'][t]['avg_tokens'] for t in task_types]
        enhanced_tokens = [self.enhanced_data['task_types'][t]['avg_tokens'] for t in task_types]
        
        ax3.plot(task_types, baseline_tokens, 'o-', label='Baseline', linewidth=2, markersize=8, color='#ff7f0e')
        ax3.plot(task_types, enhanced_tokens, 's-', label='Enhanced', linewidth=2, markersize=8, color='#2ca02c')
        ax3.set_xlabel('Task Type')
        ax3.set_ylabel('Average Tokens Used')
        ax3.set_title('Token Usage Comparison')
        ax3.set_xticklabels(task_types, rotation=45, ha='right')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        
        # 4. Overall Improvement Scores
        scores = self.scorer.get_overall_score()
        metrics = ['Efficiency', 'Quality', 'Token\nEfficiency', 'Iteration\nImprovement', 'Overall']
        values = [
            scores['efficiency_score'],
            scores['quality_score'],
            scores['token_efficiency'],
            scores['iteration_improvement'],
            scores['overall_score']
        ]
        
        colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
        bars = ax4.bar(metrics, values, color=colors, alpha=0.8)
        ax4.set_ylabel('Improvement Score (%)')
        ax4.set_title('Overall Improvement Metrics')
        ax4.set_ylim(0, max(values) * 1.2)
        
        # Add value labels on bars
        for bar, value in zip(bars, values):
            height = bar.get_height()
            ax4.text(bar.get_x() + bar.get_width()/2., height,
                    f'{value:.1f}%', ha='center', va='bottom')
        
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'prompt_impact_comparison.png'), dpi=300, bbox_inches='tight')
        plt.close()
        
        # Create a summary infographic
        self._create_summary_infographic(output_dir)
        
    def _create_summary_infographic(self, output_dir: str):
        """Create a summary infographic of key metrics"""
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.axis('off')
        
        scores = self.scorer.get_overall_score()
        
        # Title
        ax.text(0.5, 0.95, 'Prompt Generation Impact Summary', 
                ha='center', va='top', fontsize=24, fontweight='bold')
        
        # Key metrics in boxes
        metrics = [
            ('Overall Improvement', f"{scores['overall_score']:.1f}%", '#2ca02c'),
            ('Time Saved', f"{scores['efficiency_score']:.1f}%", '#1f77b4'),
            ('Quality Gain', f"{scores['quality_score']:.1f}%", '#ff7f0e'),
            ('Token Efficiency', f"{scores['token_efficiency']:.1f}%", '#d62728')
        ]
        
        y_pos = 0.7
        for i, (label, value, color) in enumerate(metrics):
            x_pos = 0.125 + i * 0.25
            
            # Create colored box
            rect = plt.Rectangle((x_pos - 0.1, y_pos - 0.15), 0.2, 0.25, 
                               facecolor=color, alpha=0.2, edgecolor=color, linewidth=2)
            ax.add_patch(rect)
            
            # Add text
            ax.text(x_pos, y_pos + 0.05, value, ha='center', va='center', 
                   fontsize=28, fontweight='bold', color=color)
            ax.text(x_pos, y_pos - 0.08, label, ha='center', va='center', 
                   fontsize=12, style='italic')
        
        # ROI section
        if hasattr(self, 'report') and self.report:
            roi = self.report.get('roi_metrics', {})
            ax.text(0.5, 0.3, 'Return on Investment', 
                   ha='center', va='center', fontsize=16, fontweight='bold')
            ax.text(0.5, 0.2, f"Time Saved: {roi.get('total_time_saved_hours', 0):.1f} hours", 
                   ha='center', va='center', fontsize=14)
            ax.text(0.5, 0.1, f"Estimated Cost Savings: ${roi.get('estimated_cost_savings', 0):.0f}", 
                   ha='center', va='center', fontsize=14, color='green')
        
        plt.savefig(os.path.join(output_dir, 'prompt_impact_summary.png'), 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        
    def save_report(self, report: Dict, filename: str = 'comparison_report.json'):
        """Save comparison report to file"""
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        return filename
        
    def print_summary(self, report: Dict):
        """Print a formatted summary of the comparison"""
        print("\n" + "="*60)
        print("PROMPT GENERATION IMPACT ANALYSIS")
        print("="*60)
        
        summary = report['summary']
        print(f"\n📊 Overall Improvement Score: {summary['overall_improvement_score']:.1f}%")
        print(f"⚡ Efficiency Gain: {summary['efficiency_gain']:.1f}%")
        print(f"✨ Quality Improvement: {summary['quality_improvement']:.1f}%")
        print(f"💰 Token Savings: {summary['token_savings']:.1f}%")
        print(f"🔄 Iteration Improvement: {summary['iteration_improvement']:.1f}%")
        
        print("\n" + "-"*60)
        print("TASK-SPECIFIC IMPROVEMENTS")
        print("-"*60)
        
        for task_type, improvements in report['task_improvements'].items():
            print(f"\n{task_type.replace('_', ' ').title()}:")
            print(f"  Time Reduction: {improvements['time_reduction']:.1f}%")
            print(f"  Success Rate: +{improvements['success_rate_increase']:.1f}%")
            print(f"  Fewer Iterations: {improvements['iteration_reduction']:.1f}%")
            print(f"  Token Efficiency: {improvements['token_efficiency']:.1f}%")
            
        roi = report['roi_metrics']
        print("\n" + "-"*60)
        print("RETURN ON INVESTMENT")
        print("-"*60)
        print(f"Total Time Saved: {roi['total_time_saved_hours']:.2f} hours")
        print(f"Estimated Cost Savings: ${roi['estimated_cost_savings']:.2f}")
        print(f"Productivity Increase: {roi['productivity_increase']:.1f}%")
        print(f"Quality Increase: {roi['quality_increase']:.1f}%")
        
        print("\n" + "="*60)


if __name__ == "__main__":
    # Create scorer and comparator
    scorer = PromptScorer()
    comparator = ResultsComparator(scorer)
    
    # Load results if they exist
    if comparator.load_results():
        # Generate comparison report
        report = comparator.generate_comparison_report()
        comparator.report = report  # Store for visualization
        
        # Save report
        comparator.save_report(report)
        
        # Print summary
        comparator.print_summary(report)
        
        # Create visualizations
        comparator.create_visualizations()
        
        print("\n✅ Analysis complete!")
        print("📄 Report saved to: comparison_report.json")
        print("📊 Visualizations saved to: prompt_impact_comparison.png & prompt_impact_summary.png")
    else:
        print("⚠️  Could not load baseline or enhanced metrics.")
        print("Please run baseline_collector.py and enhanced_collector.py first.")