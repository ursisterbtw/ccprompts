#!/usr/bin/env python3
"""
Comprehensive tests for PromptScorer class
Tests all public methods with happy path and edge cases
"""

# Import the classes to test
import time
from datetime import datetime
from unittest.mock import mock_open, patch

import pytest
# Remove sys.path manipulation - use proper imports
from beta_prompts.scorer import PromptScorer, TaskMetrics


class TestTaskMetrics:
    """Test TaskMetrics dataclass"""

    def test_task_metrics_creation(self):
        """Test creating TaskMetrics with valid data"""
        metrics = TaskMetrics(
            task_id="test_001",
            task_type="code_review",
            start_time=1000.0,
            end_time=1300.0,
            success=True,
            iterations=2,
            tokens_used=500,
            errors=["minor issue"],
            prompt_method="manual",
        )

        assert metrics.task_id == "test_001"
        assert metrics.task_type == "code_review"
        assert metrics.duration == 300.0
        assert metrics.error_count == 1
        assert metrics.success is True
        assert metrics.prompt_method == "manual"

    def test_task_metrics_properties(self):
        """Test calculated properties"""
        metrics = TaskMetrics(
            task_id="test_002",
            task_type="testing",
            start_time=500.0,
            end_time=750.0,
            success=False,
            iterations=3,
            tokens_used=1000,
            errors=["error1", "error2", "error3"],
            prompt_method="generated",
        )

        assert metrics.duration == 250.0
        assert metrics.error_count == 3

    def test_task_metrics_empty_errors(self):
        """Test TaskMetrics with no errors"""
        metrics = TaskMetrics(
            task_id="test_003",
            task_type="refactoring",
            start_time=100.0,
            end_time=200.0,
            success=True,
            iterations=1,
            tokens_used=200,
            errors=[],
            prompt_method="generated",
        )

        assert metrics.error_count == 0
        assert metrics.duration == 100.0


class TestPromptScorer:
    """Test PromptScorer class"""

    def setup_method(self):
        """Setup fresh PromptScorer instance for each test"""
        self.scorer = PromptScorer()

        # Create sample baseline metrics
        self.baseline_metrics = [
            TaskMetrics(
                task_id="baseline_001",
                task_type="code_review",
                start_time=1000.0,
                end_time=1600.0,  # 10 minutes
                success=True,
                iterations=3,
                tokens_used=5000,
                errors=["issue1", "issue2"],
                prompt_method="manual",
            ),
            TaskMetrics(
                task_id="baseline_002",
                task_type="code_review",
                start_time=2000.0,
                end_time=2480.0,  # 8 minutes
                success=False,
                iterations=4,
                tokens_used=6000,
                errors=["issue1", "issue2", "issue3"],
                prompt_method="manual",
            ),
        ]

        # Create sample enhanced metrics
        self.enhanced_metrics = [
            TaskMetrics(
                task_id="enhanced_001",
                task_type="code_review",
                start_time=3000.0,
                end_time=3300.0,  # 5 minutes
                success=True,
                iterations=1,
                tokens_used=3500,
                errors=[],
                prompt_method="generated",
            ),
            TaskMetrics(
                task_id="enhanced_002",
                task_type="code_review",
                start_time=4000.0,
                end_time=4240.0,  # 4 minutes
                success=True,
                iterations=2,
                tokens_used=4000,
                errors=["minor issue"],
                prompt_method="generated",
            ),
        ]

    def test_initial_state(self):
        """Test PromptScorer initial state"""
        assert len(self.scorer.baseline_metrics) == 0
        assert len(self.scorer.enhanced_metrics) == 0

    def test_add_baseline_metric(self):
        """Test adding baseline metrics"""
        metric = self.baseline_metrics[0]
        self.scorer.add_baseline_metric(metric)

        assert len(self.scorer.baseline_metrics) == 1
        assert self.scorer.baseline_metrics[0] == metric

    def test_add_enhanced_metric(self):
        """Test adding enhanced metrics"""
        metric = self.enhanced_metrics[0]
        self.scorer.add_enhanced_metric(metric)

        assert len(self.scorer.enhanced_metrics) == 1
        assert self.scorer.enhanced_metrics[0] == metric

    def test_calculate_efficiency_score_empty_data(self):
        """Test efficiency score with no data"""
        result = self.scorer.calculate_efficiency_score()
        assert result == 0.0

    def test_calculate_efficiency_score_missing_baseline(self):
        """Test efficiency score with missing baseline data"""
        self.scorer.add_enhanced_metric(self.enhanced_metrics[0])
        result = self.scorer.calculate_efficiency_score()
        assert result == 0.0

    def test_calculate_efficiency_score_missing_enhanced(self):
        """Test efficiency score with missing enhanced data"""
        self.scorer.add_baseline_metric(self.baseline_metrics[0])
        result = self.scorer.calculate_efficiency_score()
        assert result == 0.0

    def test_calculate_efficiency_score_happy_path(self):
        """Test efficiency score calculation with valid data"""
        # Add all metrics
        for metric in self.baseline_metrics:
            self.scorer.add_baseline_metric(metric)
        for metric in self.enhanced_metrics:
            self.scorer.add_enhanced_metric(metric)

        result = self.scorer.calculate_efficiency_score()

        # Expected: baseline avg = 540s, enhanced avg = 270s
        # Efficiency = (540 - 270) / 540 * 100 = 50%
        assert result == 50.0

    def test_calculate_efficiency_score_negative_improvement(self):
        """Test efficiency score when enhanced is slower than baseline"""
        # Create metrics where enhanced is slower
        slow_enhanced = TaskMetrics(
            task_id="slow_001",
            task_type="code_review",
            start_time=1000.0,
            end_time=2200.0,  # 20 minutes (slower than baseline)
            success=True,
            iterations=1,
            tokens_used=3000,
            errors=[],
            prompt_method="generated",
        )

        self.scorer.add_baseline_metric(self.baseline_metrics[0])  # 10 minutes
        self.scorer.add_enhanced_metric(slow_enhanced)  # 20 minutes

        result = self.scorer.calculate_efficiency_score()
        assert result == 0.0  # Should be clamped to non-negative

    def test_calculate_efficiency_score_empty_metrics(self):
        """Test efficiency score when both baseline and enhanced metrics are empty"""
        result = self.scorer.calculate_efficiency_score()
        assert result == 0.0  # Should return 0.0 without errors

    def test_calculate_quality_score_empty_data(self):
        """Test quality score with no data"""
        result = self.scorer.calculate_quality_score()
        assert result == 0.0

    def test_calculate_quality_score_happy_path(self):
        """Test quality score calculation with valid data"""
        # Add all metrics
        for metric in self.baseline_metrics:
            self.scorer.add_baseline_metric(metric)
        for metric in self.enhanced_metrics:
            self.scorer.add_enhanced_metric(metric)

        result = self.scorer.calculate_quality_score()

        # Expected: baseline success = 50%, enhanced success = 100%
        # Success improvement = 50%
        # Baseline avg errors = 2.5, enhanced avg errors = 0.5
        # Error reduction = ((2.5 - 0.5) / 2.5) * 100 = 80%
        # Quality score = (50 + 80) / 2 = 65%
        assert result == 65.0

    def test_calculate_token_efficiency_empty_data(self):
        """Test token efficiency with no data"""
        result = self.scorer.calculate_token_efficiency()
        assert result == 0.0

    def test_calculate_token_efficiency_happy_path(self):
        """Test token efficiency calculation with valid data"""
        # Add all metrics
        for metric in self.baseline_metrics:
            self.scorer.add_baseline_metric(metric)
        for metric in self.enhanced_metrics:
            self.scorer.add_enhanced_metric(metric)

        result = self.scorer.calculate_token_efficiency()

        # Expected: baseline tokens per success = 5000 (only one success)
        # Enhanced tokens per success = (3500 + 4000) / 2 = 3750
        # Efficiency = (5000 - 3750) / 5000 * 100 = 25%
        assert result == 25.0

    def test_calculate_token_efficiency_no_successes(self):
        """Test token efficiency when no enhanced tasks succeeded"""
        # Create failing enhanced metric
        failing_metric = TaskMetrics(
            task_id="fail_001",
            task_type="code_review",
            start_time=1000.0,
            end_time=1300.0,
            success=False,
            iterations=1,
            tokens_used=1000,
            errors=["failure"],
            prompt_method="generated",
        )

        self.scorer.add_baseline_metric(self.baseline_metrics[0])
        self.scorer.add_enhanced_metric(failing_metric)

        result = self.scorer.calculate_token_efficiency()
        assert result == 100.0  # Should return 100% when enhanced tokens = 0

    def test_calculate_iteration_improvement_empty_data(self):
        """Test iteration improvement with no data"""
        result = self.scorer.calculate_iteration_improvement()
        assert result == 0.0

    def test_calculate_iteration_improvement_happy_path(self):
        """Test iteration improvement calculation with valid data"""
        # Add all metrics
        for metric in self.baseline_metrics:
            self.scorer.add_baseline_metric(metric)
        for metric in self.enhanced_metrics:
            self.scorer.add_enhanced_metric(metric)

        result = self.scorer.calculate_iteration_improvement()

        # Expected: baseline avg = 3.5, enhanced avg = 1.5
        # Improvement = (3.5 - 1.5) / 3.5 * 100 = 57.14%
        assert abs(result - 57.14) < 0.01

    def test_get_overall_score_empty_data(self):
        """Test overall score with no data"""
        result = self.scorer.get_overall_score()

        expected_keys = [
            "efficiency_score",
            "quality_score",
            "token_efficiency",
            "iteration_improvement",
            "overall_score",
            "timestamp",
        ]

        for key in expected_keys:
            assert key in result

        # All scores should be 0
        assert result["efficiency_score"] == 0.0
        assert result["quality_score"] == 0.0
        assert result["token_efficiency"] == 0.0
        assert result["iteration_improvement"] == 0.0
        assert result["overall_score"] == 0.0

        # Should have valid timestamp
        assert "timestamp" in result
        datetime.fromisoformat(result["timestamp"])  # Should not raise

    def test_get_overall_score_happy_path(self):
        """Test overall score calculation with valid data"""
        # Add all metrics
        for metric in self.baseline_metrics:
            self.scorer.add_baseline_metric(metric)
        for metric in self.enhanced_metrics:
            self.scorer.add_enhanced_metric(metric)

        result = self.scorer.get_overall_score()

        # Verify all components are calculated correctly
        assert result["efficiency_score"] == 50.0
        assert result["quality_score"] == 65.0
        assert result["token_efficiency"] == 25.0
        assert abs(result["iteration_improvement"] - 57.14) < 0.01

        # Calculate expected overall score
        expected_overall = (50 * 0.3) + (65 * 0.4) + (25 * 0.15) + (57.14 * 0.15)
        assert abs(result["overall_score"] - expected_overall) < 0.01

    def test_get_detailed_comparison_empty_data(self):
        """Test detailed comparison with no data"""
        result = self.scorer.get_detailed_comparison()

        assert "error" in result
        assert result["error"] == "Insufficient data for comparison"

    def test_get_detailed_comparison_happy_path(self):
        """Test detailed comparison with valid data"""
        # Add all metrics
        for metric in self.baseline_metrics:
            self.scorer.add_baseline_metric(metric)
        for metric in self.enhanced_metrics:
            self.scorer.add_enhanced_metric(metric)

        result = self.scorer.get_detailed_comparison()

        # Check structure
        assert "baseline" in result
        assert "enhanced" in result
        assert "improvements" in result
        assert "scores" in result

        # Check baseline stats
        baseline = result["baseline"]
        assert baseline["total_tasks"] == 2
        assert baseline["successful_tasks"] == 1
        assert baseline["avg_duration"] == 540.0  # (600 + 480) / 2
        assert baseline["avg_iterations"] == 3.5  # (3 + 4) / 2
        assert baseline["avg_tokens"] == 5500.0  # (5000 + 6000) / 2
        assert baseline["total_errors"] == 5  # 2 + 3

        # Check enhanced stats
        enhanced = result["enhanced"]
        assert enhanced["total_tasks"] == 2
        assert enhanced["successful_tasks"] == 2
        assert enhanced["avg_duration"] == 270.0  # (300 + 240) / 2
        assert enhanced["avg_iterations"] == 1.5  # (1 + 2) / 2
        assert enhanced["avg_tokens"] == 3750.0  # (3500 + 4000) / 2
        assert enhanced["total_errors"] == 1  # 0 + 1

        # Check improvements
        improvements = result["improvements"]
        assert improvements["time_saved_per_task"] == 270.0  # 540 - 270
        assert improvements["success_rate_increase"] == 0.5  # 1.0 - 0.5
        assert improvements["iteration_reduction"] == 2.0  # 3.5 - 1.5
        assert improvements["token_savings"] == 1750.0  # 5500 - 3750
        assert improvements["error_reduction"] == 4  # 5 - 1

    @patch("builtins.open", new_callable=mock_open)
    @patch("json.dump")
    def test_save_results_success(self, mock_json_dump, mock_file):
        """Test saving results to file"""
        # Add some metrics
        self.scorer.add_baseline_metric(self.baseline_metrics[0])
        self.scorer.add_enhanced_metric(self.enhanced_metrics[0])

        filename = self.scorer.save_results("test_results.json")

        # Verify file operations
        mock_file.assert_called_once_with("test_results.json", "w")
        mock_json_dump.assert_called_once()

        # Verify return value
        assert filename == "test_results.json"

    @patch("builtins.open", new_callable=mock_open)
    @patch("json.dump")
    def test_save_results_default_filename(self, mock_json_dump, mock_file):
        """Test saving results with default filename"""
        # Add some metrics
        self.scorer.add_baseline_metric(self.baseline_metrics[0])
        self.scorer.add_enhanced_metric(self.enhanced_metrics[0])

        filename = self.scorer.save_results()

        # Verify default filename
        mock_file.assert_called_once_with("prompt_impact_results.json", "w")
        assert filename == "prompt_impact_results.json"

    def test_edge_case_division_by_zero(self):
        """Test edge cases that might cause division by zero"""
        # Create metrics where baseline has zero errors
        zero_error_baseline = TaskMetrics(
            task_id="zero_001",
            task_type="perfect_task",
            start_time=1000.0,
            end_time=1100.0,
            success=True,
            iterations=1,
            tokens_used=1000,
            errors=[],
            prompt_method="manual",
        )

        # Create enhanced metric with some errors
        error_enhanced = TaskMetrics(
            task_id="error_001",
            task_type="perfect_task",
            start_time=2000.0,
            end_time=2050.0,
            success=True,
            iterations=1,
            tokens_used=1000,
            errors=["some error"],
            prompt_method="generated",
        )

        self.scorer.add_baseline_metric(zero_error_baseline)
        self.scorer.add_enhanced_metric(error_enhanced)

        # Should handle division by zero gracefully
        quality_score = self.scorer.calculate_quality_score()
        assert quality_score >= 0  # Should not crash

    def test_large_dataset_performance(self):
        """Test performance with a large number of metrics"""
        # Create 1000 metrics of each type
        for i in range(1000):
            baseline = TaskMetrics(
                task_id=f"baseline_{i}",
                task_type="performance_test",
                start_time=float(i * 1000),
                end_time=float(i * 1000 + 300),
                success=True,
                iterations=2,
                tokens_used=1000,
                errors=[],
                prompt_method="manual",
            )

            enhanced = TaskMetrics(
                task_id=f"enhanced_{i}",
                task_type="performance_test",
                start_time=float(i * 1000 + 500),
                end_time=float(i * 1000 + 650),
                success=True,
                iterations=1,
                tokens_used=800,
                errors=[],
                prompt_method="generated",
            )

            self.scorer.add_baseline_metric(baseline)
            self.scorer.add_enhanced_metric(enhanced)

        # Should complete calculations without issues
        start_time = time.time()
        result = self.scorer.get_overall_score()
        end_time = time.time()

        # Should complete within reasonable time (< 1 second)
        assert end_time - start_time < 1.0

        # Should have reasonable results
        assert result["efficiency_score"] == 50.0  # 300 -> 150 seconds
        assert result["quality_score"] == 0.0  # Same quality
        assert result["token_efficiency"] == 20.0  # 1000 -> 800 tokens
        assert result["iteration_improvement"] == 50.0  # 2 -> 1 iterations


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
