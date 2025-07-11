#!/usr/bin/env python3
"""
Prompt Generation Impact Scorer
Measures the effectiveness of using Anthropic's prompt generation endpoints
"""

import json
import time
from dataclasses import dataclass
from datetime import datetime


@dataclass
class TaskMetrics:
    """Metrics for a single task execution"""

    task_id: str
    task_type: str
    start_time: float
    end_time: float
    success: bool
    iterations: int
    tokens_used: int
    errors: list[str]
    prompt_method: str  # 'manual' or 'generated'

    @property
    def duration(self) -> float:
        return self.end_time - self.start_time

    @property
    def error_count(self) -> int:
        return len(self.errors)


class PromptScorer:
    """Main scoring engine for prompt generation impact"""

    def __init__(self):
        self.baseline_metrics: list[TaskMetrics] = []
        self.enhanced_metrics: list[TaskMetrics] = []

    def add_baseline_metric(self, metric: TaskMetrics):
        """Add a metric from baseline (manual) workflow"""
        self.baseline_metrics.append(metric)

    def add_enhanced_metric(self, metric: TaskMetrics):
        """Add a metric from enhanced (generated) workflow"""
        self.enhanced_metrics.append(metric)

    def calculate_efficiency_score(self) -> float:
        """Calculate time efficiency improvement"""
        if not self.baseline_metrics or not self.enhanced_metrics:
            return 0.0

        baseline_avg_time = sum(m.duration for m in self.baseline_metrics) / len(
            self.baseline_metrics
        )
        enhanced_avg_time = sum(m.duration for m in self.enhanced_metrics) / len(
            self.enhanced_metrics
        )

        time_saved = baseline_avg_time - enhanced_avg_time
        efficiency_score = (time_saved / baseline_avg_time) * 100

        return max(0, efficiency_score)  # Ensure non-negative

    def calculate_quality_score(self) -> float:
        """Calculate quality improvement based on success rate and errors"""
        if not self.baseline_metrics or not self.enhanced_metrics:
            return 0.0

        baseline_success_rate = sum(
            bool(m.success) for m in self.baseline_metrics
        ) / len(self.baseline_metrics)
        enhanced_success_rate = sum(
            bool(m.success) for m in self.enhanced_metrics
        ) / len(self.enhanced_metrics)

        baseline_avg_errors = sum(m.error_count for m in self.baseline_metrics) / len(
            self.baseline_metrics
        )
        enhanced_avg_errors = sum(m.error_count for m in self.enhanced_metrics) / len(
            self.enhanced_metrics
        )

        success_improvement = (enhanced_success_rate - baseline_success_rate) * 100
        error_reduction = (
            (baseline_avg_errors - enhanced_avg_errors) / max(baseline_avg_errors, 1)
        ) * 100

        quality_score = (success_improvement + error_reduction) / 2
        return max(0, quality_score)

    def calculate_token_efficiency(self) -> float:
        """Calculate token usage efficiency"""
        if not self.baseline_metrics or not self.enhanced_metrics:
            return 0.0

        baseline_tokens_per_success = sum(
            m.tokens_used for m in self.baseline_metrics if m.success
        ) / max(sum(bool(m.success) for m in self.baseline_metrics), 1)

        enhanced_tokens_per_success = sum(
            m.tokens_used for m in self.enhanced_metrics if m.success
        ) / max(sum(bool(m.success) for m in self.enhanced_metrics), 1)

        if enhanced_tokens_per_success == 0:
            return 100.0

        efficiency = (
            (baseline_tokens_per_success - enhanced_tokens_per_success)
            / baseline_tokens_per_success
        ) * 100
        return max(0, efficiency)

    def calculate_iteration_improvement(self) -> float:
        """Calculate reduction in iterations needed"""
        if not self.baseline_metrics or not self.enhanced_metrics:
            return 0.0

        baseline_avg_iterations = sum(
            m.iterations for m in self.baseline_metrics
        ) / len(self.baseline_metrics)
        enhanced_avg_iterations = sum(
            m.iterations for m in self.enhanced_metrics
        ) / len(self.enhanced_metrics)

        improvement = (
            (baseline_avg_iterations - enhanced_avg_iterations)
            / baseline_avg_iterations
        ) * 100
        return max(0, improvement)

    def get_overall_score(self) -> dict:
        """Calculate overall impact score"""
        efficiency = self.calculate_efficiency_score()
        quality = self.calculate_quality_score()
        token_eff = self.calculate_token_efficiency()
        iteration_imp = self.calculate_iteration_improvement()

        # Weighted average
        weights = {
            "efficiency": 0.3,
            "quality": 0.4,
            "token_efficiency": 0.15,
            "iteration_improvement": 0.15,
        }

        overall = (
            efficiency * weights["efficiency"]
            + quality * weights["quality"]
            + token_eff * weights["token_efficiency"]
            + iteration_imp * weights["iteration_improvement"]
        )

        return {
            "efficiency_score": round(efficiency, 2),
            "quality_score": round(quality, 2),
            "token_efficiency": round(token_eff, 2),
            "iteration_improvement": round(iteration_imp, 2),
            "overall_score": round(overall, 2),
            "timestamp": datetime.now().isoformat(),
        }

    def get_detailed_comparison(self) -> dict:
        """Get detailed comparison metrics"""
        if not self.baseline_metrics or not self.enhanced_metrics:
            return {"error": "Insufficient data for comparison"}

        baseline_stats = {
            "total_tasks": len(self.baseline_metrics),
            "successful_tasks": sum(bool(m.success) for m in self.baseline_metrics),
            "avg_duration": sum(m.duration for m in self.baseline_metrics)
            / len(self.baseline_metrics),
            "avg_iterations": sum(m.iterations for m in self.baseline_metrics)
            / len(self.baseline_metrics),
            "avg_tokens": sum(m.tokens_used for m in self.baseline_metrics)
            / len(self.baseline_metrics),
            "total_errors": sum(m.error_count for m in self.baseline_metrics),
        }

        enhanced_stats = {
            "total_tasks": len(self.enhanced_metrics),
            "successful_tasks": sum(bool(m.success) for m in self.enhanced_metrics),
            "avg_duration": sum(m.duration for m in self.enhanced_metrics)
            / len(self.enhanced_metrics),
            "avg_iterations": sum(m.iterations for m in self.enhanced_metrics)
            / len(self.enhanced_metrics),
            "avg_tokens": sum(m.tokens_used for m in self.enhanced_metrics)
            / len(self.enhanced_metrics),
            "total_errors": sum(m.error_count for m in self.enhanced_metrics),
        }

        return {
            "baseline": baseline_stats,
            "enhanced": enhanced_stats,
            "improvements": {
                "time_saved_per_task": baseline_stats["avg_duration"]
                - enhanced_stats["avg_duration"],
                "success_rate_increase": (
                    enhanced_stats["successful_tasks"] / enhanced_stats["total_tasks"]
                )
                - (baseline_stats["successful_tasks"] / baseline_stats["total_tasks"]),
                "iteration_reduction": baseline_stats["avg_iterations"]
                - enhanced_stats["avg_iterations"],
                "token_savings": baseline_stats["avg_tokens"]
                - enhanced_stats["avg_tokens"],
                "error_reduction": baseline_stats["total_errors"]
                - enhanced_stats["total_errors"],
            },
            "scores": self.get_overall_score(),
        }

    def save_results(self, filename: str = "prompt_impact_results.json"):
        """Save results to JSON file"""
        results = self.get_detailed_comparison()
        with open(filename, "w") as f:
            json.dump(results, f, indent=2)
        return filename


# Example usage
if __name__ == "__main__":
    scorer = PromptScorer()

    # Example baseline metric
    baseline = TaskMetrics(
        task_id="task_001",
        task_type="code_review",
        start_time=time.time(),
        end_time=time.time() + 300,  # 5 minutes
        success=True,
        iterations=3,
        tokens_used=5000,
        errors=["Initial misunderstanding", "Missed edge case"],
        prompt_method="manual",
    )
    scorer.add_baseline_metric(baseline)

    # Example enhanced metric
    enhanced = TaskMetrics(
        task_id="task_002",
        task_type="code_review",
        start_time=time.time(),
        end_time=time.time() + 180,  # 3 minutes
        success=True,
        iterations=1,
        tokens_used=3500,
        errors=[],
        prompt_method="generated",
    )
    scorer.add_enhanced_metric(enhanced)

    # Get results
    print(json.dumps(scorer.get_overall_score(), indent=2))
