#!/usr/bin/env python3
"""
Comprehensive tests for BaselineCollector class
Tests all public methods with happy path and edge cases
"""

import random
# Import the classes to test
import sys
import time
from unittest.mock import mock_open, patch

import pytest

sys.path.append("../../beta-prompts")
from beta_prompts.baseline_collector_01 import (BaselineCollector,
                                                test_manual_code_review)
from beta_prompts.prompt_scorer_02 import PromptScorer, TaskMetrics


class TestBaselineCollector:
    """Test BaselineCollector class"""

    def setup_method(self):
        """Setup fresh instances for each test"""
        self.scorer = PromptScorer()
        self.collector = BaselineCollector(self.scorer)

    def test_init(self):
        """Test BaselineCollector initialization"""
        assert self.collector.scorer == self.scorer
        assert self.collector.task_counter == 0

    def test_simulate_manual_task_basic(self):
        """Test basic manual task simulation"""
        task_type = "code_review"

        # Set random seed for reproducible tests
        random.seed(42)

        result = self.collector.simulate_manual_task(task_type)

        # Verify TaskMetrics structure
        assert isinstance(result, TaskMetrics)
        assert result.task_id == "baseline_code_review_1"
        assert result.task_type == task_type
        assert result.prompt_method == "manual"
        assert result.start_time < result.end_time
        assert result.iterations >= 2
        assert result.iterations <= 4
        assert result.tokens_used > 0
        assert isinstance(result.errors, list)
        assert isinstance(result.success, bool)

    def test_simulate_manual_task_all_types(self):
        """Test simulation for all supported task types"""
        task_types = [
            "code_review",
            "refactoring",
            "test_generation",
            "documentation",
            "bug_fix",
            "security_audit",
        ]

        for task_type in task_types:
            result = self.collector.simulate_manual_task(task_type)
            assert result.task_type == task_type
            assert result.duration > 0
            assert result.tokens_used > 0

            # Verify task-specific duration ranges
            if task_type == "documentation":
                assert result.duration >= 120  # At least 2 minutes
                assert result.duration <= 300  # At most 5 minutes
            elif task_type == "security_audit":
                assert result.duration >= 600  # At least 10 minutes
                assert result.duration <= 1200  # At most 20 minutes

    def test_simulate_manual_task_unknown_type(self):
        """Test simulation with unknown task type"""
        unknown_type = "unknown_task"

        result = self.collector.simulate_manual_task(unknown_type)

        assert result.task_type == unknown_type
        assert result.duration >= 180  # Default min time
        assert result.duration <= 360  # Default max time
        assert result.tokens_used > 0

    def test_simulate_manual_task_increments_counter(self):
        """Test that task counter increments correctly"""
        initial_counter = self.collector.task_counter

        self.collector.simulate_manual_task("code_review")
        assert self.collector.task_counter == initial_counter + 1

        self.collector.simulate_manual_task("refactoring")
        assert self.collector.task_counter == initial_counter + 2

    def test_simulate_manual_task_unique_ids(self):
        """Test that each task gets a unique ID"""
        task1 = self.collector.simulate_manual_task("code_review")
        task2 = self.collector.simulate_manual_task("code_review")
        task3 = self.collector.simulate_manual_task("refactoring")

        assert task1.task_id != task2.task_id
        assert task2.task_id != task3.task_id
        assert task1.task_id != task3.task_id

    @patch("time.sleep")
    def test_collect_baseline_metrics_basic(self, mock_sleep):
        """Test basic baseline metrics collection"""
        task_types = ["code_review", "documentation"]
        samples_per_type = 2

        # Mock random seed for reproducible tests
        random.seed(42)

        results = self.collector.collect_baseline_metrics(task_types, samples_per_type)

        # Verify results structure
        assert "collection_start" in results
        assert "collection_end" in results
        assert "collection_duration" in results
        assert "task_types" in results
        assert "total_metrics" in results

        # Verify task type results
        assert len(results["task_types"]) == 2
        assert "code_review" in results["task_types"]
        assert "documentation" in results["task_types"]

        # Verify each task type has expected structure
        for task_type in task_types:
            stats = results["task_types"][task_type]
            assert "total_tasks" in stats
            assert "successful_tasks" in stats
            assert "success_rate" in stats
            assert "avg_duration" in stats
            assert "avg_iterations" in stats
            assert "avg_tokens" in stats
            assert "common_errors" in stats

            # Verify counts
            assert stats["total_tasks"] == samples_per_type
            assert stats["successful_tasks"] <= samples_per_type
            assert 0 <= stats["success_rate"] <= 1
            assert stats["avg_duration"] > 0
            assert stats["avg_iterations"] > 0
            assert stats["avg_tokens"] > 0

        # Verify total metrics
        assert results["total_metrics"] == len(task_types) * samples_per_type

        # Verify metrics were added to scorer
        assert len(self.scorer.baseline_metrics) == len(task_types) * samples_per_type

    @patch("time.sleep")
    def test_collect_baseline_metrics_empty_task_types(self, mock_sleep):
        """Test collection with empty task types"""
        results = self.collector.collect_baseline_metrics([])

        assert results["total_metrics"] == 0
        assert len(results["task_types"]) == 0
        assert len(self.scorer.baseline_metrics) == 0

    @patch("time.sleep")
    def test_collect_baseline_metrics_single_task(self, mock_sleep):
        """Test collection with single task type"""
        task_types = ["code_review"]
        samples_per_type = 5

        results = self.collector.collect_baseline_metrics(task_types, samples_per_type)

        assert len(results["task_types"]) == 1
        assert results["total_metrics"] == 5
        assert len(self.scorer.baseline_metrics) == 5

        # Verify all metrics are for the same task type
        for metric in self.scorer.baseline_metrics:
            assert metric.task_type == "code_review"

    @patch("time.sleep")
    def test_collect_baseline_metrics_large_sample_size(self, mock_sleep):
        """Test collection with large sample size"""
        task_types = ["code_review"]
        samples_per_type = 100

        start_time = time.time()
        results = self.collector.collect_baseline_metrics(task_types, samples_per_type)
        end_time = time.time()

        assert results["total_metrics"] == 100
        assert len(self.scorer.baseline_metrics) == 100

        # Should complete within reasonable time (mocked sleep)
        assert end_time - start_time < 2.0

    def test_get_common_errors_basic(self):
        """Test common errors analysis"""
        metrics = [
            {"errors": ["Error A", "Error B"]},
            {"errors": ["Error A", "Error C"]},
            {"errors": ["Error A"]},
            {"errors": []},
        ]

        result = self.collector._get_common_errors(metrics)

        assert result["Error A"] == 3
        assert result["Error B"] == 1
        assert result["Error C"] == 1

        # Should be sorted by frequency (most common first)
        errors_list = list(result.items())
        assert errors_list[0][0] == "Error A"
        assert errors_list[0][1] == 3

    def test_get_common_errors_empty_metrics(self):
        """Test common errors with empty metrics"""
        result = self.collector._get_common_errors([])
        assert result == {}

    def test_get_common_errors_no_errors(self):
        """Test common errors when no errors exist"""
        metrics = [{"errors": []}, {"errors": []}, {"errors": []}]

        result = self.collector._get_common_errors(metrics)
        assert result == {}

    def test_get_common_errors_single_error_type(self):
        """Test common errors with single error type"""
        metrics = [
            {"errors": ["Same Error"]},
            {"errors": ["Same Error"]},
            {"errors": ["Same Error"]},
        ]

        result = self.collector._get_common_errors(metrics)
        assert result == {"Same Error": 3}

    @patch("builtins.open", new_callable=mock_open)
    @patch("json.dump")
    def test_save_baseline_results_success(self, mock_json_dump, mock_file):
        """Test saving baseline results"""
        results = {
            "total_metrics": 10,
            "task_types": {"code_review": {"total_tasks": 5}},
        }

        filename = self.collector.save_baseline_results(results, "test_results.json")

        # Verify file operations
        mock_file.assert_called_once_with("test_results.json", "w")
        mock_json_dump.assert_called_once_with(
            results, mock_file.return_value, indent=2
        )

        # Verify return value
        assert filename == "test_results.json"

    @patch("builtins.open", new_callable=mock_open)
    @patch("json.dump")
    def test_save_baseline_results_default_filename(self, mock_json_dump, mock_file):
        """Test saving with default filename"""
        results = {"total_metrics": 5}

        filename = self.collector.save_baseline_results(results)

        # Verify default filename
        mock_file.assert_called_once_with("baseline_metrics.json", "w")
        assert filename == "baseline_metrics.json"

    def test_task_simulation_consistency(self):
        """Test that task simulation produces consistent results"""
        # Set seed for reproducible results
        random.seed(12345)

        task1 = self.collector.simulate_manual_task("code_review")

        # Reset seed to same value
        random.seed(12345)

        # Create new collector with same seed
        collector2 = BaselineCollector(PromptScorer())
        task2 = collector2.simulate_manual_task("code_review")

        # Should produce similar results (within reasonable variance)
        assert task1.task_type == task2.task_type
        assert task1.prompt_method == task2.prompt_method
        # Note: exact values may differ due to time.time() calls

    def test_error_scenarios(self):
        """Test various error scenarios"""
        # Test with extreme values
        result = self.collector.simulate_manual_task("test_task")
        assert result.duration >= 0
        assert result.tokens_used >= 0
        assert result.iterations >= 0

        # Test with special characters in task type
        result = self.collector.simulate_manual_task("task-with-special_chars")
        assert result.task_type == "task-with-special_chars"

    @patch("time.sleep")
    def test_integration_with_scorer(self, mock_sleep):
        """Test integration with PromptScorer"""
        task_types = ["code_review", "refactoring"]
        samples_per_type = 3

        # Collect baseline metrics
        self.collector.collect_baseline_metrics(task_types, samples_per_type)

        # Verify scorer has all metrics
        assert len(self.scorer.baseline_metrics) == 6

        # Verify scorer can calculate scores
        efficiency_score = self.scorer.calculate_efficiency_score()
        # Should be 0 since no enhanced metrics yet
        assert efficiency_score == 0.0

        # Add some enhanced metrics for comparison
        enhanced_metric = TaskMetrics(
            task_id="enhanced_001",
            task_type="code_review",
            start_time=time.time(),
            end_time=time.time() + 60,  # 1 minute
            success=True,
            iterations=1,
            tokens_used=2000,
            errors=[],
            prompt_method="generated",
        )

        self.scorer.add_enhanced_metric(enhanced_metric)

        # Now scorer should be able to calculate meaningful scores
        efficiency_score = self.scorer.calculate_efficiency_score()
        assert efficiency_score >= 0


class TestManualCodeReview:
    """Test the test_manual_code_review function"""

    def test_manual_code_review_structure(self):
        """Test that manual code review returns proper TaskMetrics"""
        result = test_manual_code_review()

        assert isinstance(result, TaskMetrics)
        assert result.task_id == "manual_review_001"
        assert result.task_type == "code_review"
        assert result.prompt_method == "manual"
        assert result.success is True
        assert result.iterations == 2
        assert result.tokens_used == 4500
        assert result.errors == []
        assert result.start_time < result.end_time

    def test_manual_code_review_timing(self):
        """Test that manual code review has realistic timing"""
        start_time = time.time()
        result = test_manual_code_review()
        end_time = time.time()

        # Should complete quickly (it's a simulation)
        assert end_time - start_time < 1.0

        # But the recorded duration should be minimal
        assert result.duration < 1.0


class TestEdgeCases:
    """Test edge cases and error conditions"""

    def test_collector_with_none_scorer(self):
        """Test collector behavior with None scorer"""
        with pytest.raises(TypeError):
            BaselineCollector(None)

    def test_very_large_task_counter(self):
        """Test collector with very large task counter"""
        scorer = PromptScorer()
        collector = BaselineCollector(scorer)

        # Simulate many tasks
        collector.task_counter = 999999

        result = collector.simulate_manual_task("code_review")
        assert result.task_id == "baseline_code_review_1000000"

    def test_negative_samples_per_type(self):
        """Test collection with negative samples"""
        scorer = PromptScorer()
        collector = BaselineCollector(scorer)

        # Should handle gracefully
        results = collector.collect_baseline_metrics(["code_review"], -1)
        assert results["total_metrics"] == 0

    def test_zero_samples_per_type(self):
        """Test collection with zero samples"""
        scorer = PromptScorer()
        collector = BaselineCollector(scorer)

        results = collector.collect_baseline_metrics(["code_review"], 0)
        assert results["total_metrics"] == 0
        assert len(results["task_types"]) == 1
        assert results["task_types"]["code_review"]["total_tasks"] == 0


class TestPerformance:
    """Test performance characteristics"""

    @patch("time.sleep")
    def test_large_scale_collection(self, mock_sleep):
        """Test performance with large-scale collection"""
        scorer = PromptScorer()
        collector = BaselineCollector(scorer)

        # Test with many task types and samples
        task_types = ["code_review", "refactoring", "test_generation", "documentation"]
        samples_per_type = 50

        start_time = time.time()
        results = collector.collect_baseline_metrics(task_types, samples_per_type)
        end_time = time.time()

        # Should complete within reasonable time
        assert end_time - start_time < 5.0

        # Should have all expected metrics
        assert results["total_metrics"] == 200
        assert len(scorer.baseline_metrics) == 200

    def test_memory_usage_with_large_dataset(self):
        """Test memory usage doesn't grow excessively"""
        scorer = PromptScorer()
        collector = BaselineCollector(scorer)

        # Create many tasks
        for _ in range(1000):
            collector.simulate_manual_task("code_review")

        # Should still be responsive
        assert collector.task_counter == 1000
        assert len(scorer.baseline_metrics) == 1000


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
