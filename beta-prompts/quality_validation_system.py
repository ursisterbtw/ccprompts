#!/usr/bin/env python3
"""
Automated Quality Validation System
===================================

A comprehensive system for continuous quality monitoring, validation, and improvement
of prompt chains, workflows, and system performance with automated feedback loops.

Features:
- Real-time quality monitoring with configurable thresholds
- Multi-dimensional quality metrics and scoring
- Automated validation workflows and test suites
- Continuous feedback loops for improvement
- Quality trend analysis and predictive monitoring
- Integration with optimization and memory systems
- Automated quality reports and alerts
"""

import asyncio
import json
import logging
import time
import statistics
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Callable, Tuple, Union
import uuid
from collections import defaultdict, deque
import numpy as np
from pathlib import Path
import hashlib

logger = logging.getLogger(__name__)


class QualityMetric(Enum):
    """Types of quality metrics"""
    ACCURACY = "accuracy"
    COMPLETENESS = "completeness"
    RELEVANCE = "relevance"
    CONSISTENCY = "consistency"
    EFFICIENCY = "efficiency"
    RELIABILITY = "reliability"
    USABILITY = "usability"
    MAINTAINABILITY = "maintainability"
    SECURITY = "security"
    PERFORMANCE = "performance"


class ValidationLevel(Enum):
    """Levels of validation rigor"""
    BASIC = "basic"
    STANDARD = "standard"
    COMPREHENSIVE = "comprehensive"
    EXHAUSTIVE = "exhaustive"


class QualityStatus(Enum):
    """Quality status indicators"""
    EXCELLENT = "excellent"
    GOOD = "good"
    ACCEPTABLE = "acceptable"
    POOR = "poor"
    CRITICAL = "critical"


class AlertSeverity(Enum):
    """Alert severity levels"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


@dataclass
class QualityThresholds:
    """Quality thresholds for different metrics"""
    excellent: float = 0.95
    good: float = 0.85
    acceptable: float = 0.70
    poor: float = 0.50
    critical: float = 0.30
    
    def get_status(self, score: float) -> QualityStatus:
        """Get quality status based on score"""
        if score >= self.excellent:
            return QualityStatus.EXCELLENT
        elif score >= self.good:
            return QualityStatus.GOOD
        elif score >= self.acceptable:
            return QualityStatus.ACCEPTABLE
        elif score >= self.poor:
            return QualityStatus.POOR
        else:
            return QualityStatus.CRITICAL
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'excellent': self.excellent,
            'good': self.good,
            'acceptable': self.acceptable,
            'poor': self.poor,
            'critical': self.critical
        }


@dataclass
class QualityMeasurement:
    """Individual quality measurement"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    metric: QualityMetric = QualityMetric.ACCURACY
    score: float = 0.0
    raw_data: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.now)
    source: str = ""
    confidence: float = 1.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'metric': self.metric.value,
            'score': self.score,
            'raw_data': self.raw_data,
            'metadata': self.metadata,
            'timestamp': self.timestamp.isoformat(),
            'source': self.source,
            'confidence': self.confidence
        }


@dataclass
class QualityReport:
    """Comprehensive quality report"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    target_id: str = ""  # ID of what was evaluated
    target_type: str = ""  # Type of target (prompt, chain, workflow, etc.)
    validation_level: ValidationLevel = ValidationLevel.STANDARD
    
    # Measurements
    measurements: List[QualityMeasurement] = field(default_factory=list)
    overall_score: float = 0.0
    metric_scores: Dict[QualityMetric, float] = field(default_factory=dict)
    
    # Status and analysis
    overall_status: QualityStatus = QualityStatus.ACCEPTABLE
    metric_statuses: Dict[QualityMetric, QualityStatus] = field(default_factory=dict)
    trends: Dict[QualityMetric, str] = field(default_factory=dict)  # "improving", "stable", "declining"
    
    # Recommendations
    recommendations: List[str] = field(default_factory=list)
    action_items: List[Dict[str, Any]] = field(default_factory=list)
    
    # Metadata
    created_at: datetime = field(default_factory=datetime.now)
    execution_time: float = 0.0
    validator_version: str = "1.0.0"
    
    def add_measurement(self, measurement: QualityMeasurement) -> None:
        """Add a quality measurement to the report"""
        self.measurements.append(measurement)
        self.metric_scores[measurement.metric] = measurement.score
    
    def calculate_overall_score(self, weights: Dict[QualityMetric, float] = None) -> float:
        """Calculate weighted overall score"""
        if not self.metric_scores:
            return 0.0
        
        if weights is None:
            # Default weights
            weights = {
                QualityMetric.ACCURACY: 0.25,
                QualityMetric.COMPLETENESS: 0.20,
                QualityMetric.RELEVANCE: 0.15,
                QualityMetric.CONSISTENCY: 0.10,
                QualityMetric.EFFICIENCY: 0.10,
                QualityMetric.RELIABILITY: 0.10,
                QualityMetric.USABILITY: 0.05,
                QualityMetric.PERFORMANCE: 0.05
            }
        
        weighted_sum = 0.0
        total_weight = 0.0
        
        for metric, score in self.metric_scores.items():
            weight = weights.get(metric, 0.1)  # Default weight
            weighted_sum += score * weight
            total_weight += weight
        
        self.overall_score = weighted_sum / total_weight if total_weight > 0 else 0.0
        return self.overall_score
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'target_id': self.target_id,
            'target_type': self.target_type,
            'validation_level': self.validation_level.value,
            'measurements': [m.to_dict() for m in self.measurements],
            'overall_score': self.overall_score,
            'metric_scores': {k.value: v for k, v in self.metric_scores.items()},
            'overall_status': self.overall_status.value,
            'metric_statuses': {k.value: v.value for k, v in self.metric_statuses.items()},
            'trends': {k.value: v for k, v in self.trends.items()},
            'recommendations': self.recommendations,
            'action_items': self.action_items,
            'created_at': self.created_at.isoformat(),
            'execution_time': self.execution_time,
            'validator_version': self.validator_version
        }


@dataclass
class QualityAlert:
    """Quality alert for threshold violations"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    severity: AlertSeverity = AlertSeverity.WARNING
    metric: QualityMetric = QualityMetric.ACCURACY
    target_id: str = ""
    target_type: str = ""
    message: str = ""
    current_score: float = 0.0
    threshold: float = 0.0
    trend: str = ""
    timestamp: datetime = field(default_factory=datetime.now)
    acknowledged: bool = False
    resolved: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'severity': self.severity.value,
            'metric': self.metric.value,
            'target_id': self.target_id,
            'target_type': self.target_type,
            'message': self.message,
            'current_score': self.current_score,
            'threshold': self.threshold,
            'trend': self.trend,
            'timestamp': self.timestamp.isoformat(),
            'acknowledged': self.acknowledged,
            'resolved': self.resolved
        }


@dataclass
class ValidationRule:
    """Rule for automated validation"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    metric: QualityMetric = QualityMetric.ACCURACY
    validator_function: Optional[Callable] = None
    thresholds: QualityThresholds = field(default_factory=QualityThresholds)
    enabled: bool = True
    weight: float = 1.0
    
    # Configuration
    parameters: Dict[str, Any] = field(default_factory=dict)
    target_types: List[str] = field(default_factory=list)  # What this rule applies to
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'metric': self.metric.value,
            'thresholds': self.thresholds.to_dict(),
            'enabled': self.enabled,
            'weight': self.weight,
            'parameters': self.parameters,
            'target_types': self.target_types
        }


class QualityValidationSystem:
    """
    Main system for automated quality validation and monitoring
    """
    
    def __init__(self):
        self.validation_rules: Dict[str, ValidationRule] = {}
        self.quality_reports: Dict[str, List[QualityReport]] = defaultdict(list)
        self.quality_alerts: List[QualityAlert] = []
        self.quality_history: deque = deque(maxlen=10000)  # Recent quality measurements
        self.metric_thresholds: Dict[QualityMetric, QualityThresholds] = {}
        self.monitoring_active: bool = False
        self.monitoring_interval: float = 60.0  # seconds
        
        # Performance tracking
        self.validation_stats: Dict[str, Any] = defaultdict(int)
        
        # Initialize default rules and thresholds
        self._initialize_default_rules()
        self._initialize_default_thresholds()
        
        logger.info("Quality Validation System initialized")
    
    def _initialize_default_thresholds(self) -> None:
        """Initialize default quality thresholds for each metric"""
        
        default_thresholds = QualityThresholds()
        
        # Customize thresholds for specific metrics
        custom_thresholds = {
            QualityMetric.ACCURACY: QualityThresholds(0.98, 0.90, 0.75, 0.60, 0.40),
            QualityMetric.PERFORMANCE: QualityThresholds(0.95, 0.85, 0.70, 0.50, 0.30),
            QualityMetric.SECURITY: QualityThresholds(0.99, 0.95, 0.85, 0.70, 0.50),
            QualityMetric.RELIABILITY: QualityThresholds(0.97, 0.90, 0.80, 0.65, 0.45)
        }
        
        for metric in QualityMetric:
            self.metric_thresholds[metric] = custom_thresholds.get(metric, default_thresholds)
    
    def _initialize_default_rules(self) -> None:
        """Initialize default validation rules"""
        
        # Accuracy validation rule
        accuracy_rule = ValidationRule(
            name="Accuracy Validator",
            description="Validates response accuracy against expected outcomes",
            metric=QualityMetric.ACCURACY,
            validator_function=self._validate_accuracy,
            target_types=["prompt", "chain", "workflow"]
        )
        self.add_validation_rule(accuracy_rule)
        
        # Completeness validation rule
        completeness_rule = ValidationRule(
            name="Completeness Validator",
            description="Validates response completeness and coverage",
            metric=QualityMetric.COMPLETENESS,
            validator_function=self._validate_completeness,
            target_types=["prompt", "chain", "workflow"]
        )
        self.add_validation_rule(completeness_rule)
        
        # Performance validation rule
        performance_rule = ValidationRule(
            name="Performance Validator",
            description="Validates execution performance and efficiency",
            metric=QualityMetric.PERFORMANCE,
            validator_function=self._validate_performance,
            target_types=["chain", "workflow", "system"]
        )
        self.add_validation_rule(performance_rule)
        
        # Consistency validation rule
        consistency_rule = ValidationRule(
            name="Consistency Validator",
            description="Validates consistency across multiple executions",
            metric=QualityMetric.CONSISTENCY,
            validator_function=self._validate_consistency,
            target_types=["prompt", "chain"]
        )
        self.add_validation_rule(consistency_rule)
        
        # Security validation rule
        security_rule = ValidationRule(
            name="Security Validator",
            description="Validates security and safety aspects",
            metric=QualityMetric.SECURITY,
            validator_function=self._validate_security,
            target_types=["prompt", "chain", "workflow", "system"]
        )
        self.add_validation_rule(security_rule)
    
    def add_validation_rule(self, rule: ValidationRule) -> None:
        """Add a validation rule to the system"""
        self.validation_rules[rule.id] = rule
        logger.info(f"Added validation rule: {rule.name}")
    
    def remove_validation_rule(self, rule_id: str) -> bool:
        """Remove a validation rule"""
        if rule_id in self.validation_rules:
            rule_name = self.validation_rules[rule_id].name
            del self.validation_rules[rule_id]
            logger.info(f"Removed validation rule: {rule_name}")
            return True
        return False
    
    async def validate_target(self, target_id: str, target_type: str, 
                            target_data: Dict[str, Any],
                            validation_level: ValidationLevel = ValidationLevel.STANDARD) -> QualityReport:
        """Validate a target (prompt, chain, workflow, etc.) and generate a quality report"""
        
        start_time = time.time()
        
        # Create quality report
        report = QualityReport(
            target_id=target_id,
            target_type=target_type,
            validation_level=validation_level
        )
        
        # Get applicable rules for this target type
        applicable_rules = [
            rule for rule in self.validation_rules.values()
            if rule.enabled and (not rule.target_types or target_type in rule.target_types)
        ]
        
        logger.info(f"Validating {target_type} {target_id} with {len(applicable_rules)} rules")
        
        # Execute validation rules
        for rule in applicable_rules:
            try:
                measurement = await self._execute_validation_rule(rule, target_data, validation_level)
                if measurement:
                    report.add_measurement(measurement)
                    
                    # Check for threshold violations
                    await self._check_quality_thresholds(measurement, target_id, target_type)
                    
            except Exception as e:
                logger.error(f"Validation rule {rule.name} failed: {e}")
                continue
        
        # Calculate overall score and statuses
        report.calculate_overall_score()
        report.overall_status = self.metric_thresholds[QualityMetric.ACCURACY].get_status(report.overall_score)
        
        for metric, score in report.metric_scores.items():
            if metric in self.metric_thresholds:
                report.metric_statuses[metric] = self.metric_thresholds[metric].get_status(score)
        
        # Generate trends
        report.trends = await self._calculate_quality_trends(target_id, report.metric_scores)
        
        # Generate recommendations
        report.recommendations = await self._generate_recommendations(report)
        
        # Generate action items
        report.action_items = await self._generate_action_items(report)
        
        # Record execution time
        report.execution_time = time.time() - start_time
        
        # Store report
        self.quality_reports[target_id].append(report)
        
        # Update statistics
        self.validation_stats['total_validations'] += 1
        self.validation_stats['rules_executed'] += len(applicable_rules)
        
        logger.info(f"Validation completed for {target_id}: {report.overall_score:.3f} ({report.overall_status.value})")
        
        return report
    
    async def _execute_validation_rule(self, rule: ValidationRule, target_data: Dict[str, Any],
                                     validation_level: ValidationLevel) -> Optional[QualityMeasurement]:
        """Execute a single validation rule"""
        
        if not rule.validator_function:
            logger.warning(f"No validator function for rule {rule.name}")
            return None
        
        try:
            # Execute the validator function
            result = await rule.validator_function(target_data, rule.parameters, validation_level)
            
            if isinstance(result, dict):
                score = result.get('score', 0.0)
                raw_data = result.get('raw_data', {})
                metadata = result.get('metadata', {})
                confidence = result.get('confidence', 1.0)
            else:
                score = float(result)
                raw_data = {}
                metadata = {}
                confidence = 1.0
            
            measurement = QualityMeasurement(
                metric=rule.metric,
                score=score,
                raw_data=raw_data,
                metadata=metadata,
                source=rule.name,
                confidence=confidence
            )
            
            # Add to quality history
            self.quality_history.append({
                'measurement': measurement.to_dict(),
                'rule_id': rule.id,
                'timestamp': datetime.now().isoformat()
            })
            
            return measurement
            
        except Exception as e:
            logger.error(f"Error executing validation rule {rule.name}: {e}")
            return None
    
    async def _check_quality_thresholds(self, measurement: QualityMeasurement, 
                                      target_id: str, target_type: str) -> None:
        """Check if measurement violates quality thresholds and generate alerts"""
        
        if measurement.metric not in self.metric_thresholds:
            return
        
        thresholds = self.metric_thresholds[measurement.metric]
        status = thresholds.get_status(measurement.score)
        
        # Generate alerts for poor or critical quality
        if status in [QualityStatus.POOR, QualityStatus.CRITICAL]:
            severity = AlertSeverity.ERROR if status == QualityStatus.POOR else AlertSeverity.CRITICAL
            
            alert = QualityAlert(
                severity=severity,
                metric=measurement.metric,
                target_id=target_id,
                target_type=target_type,
                message=f"{measurement.metric.value} score ({measurement.score:.3f}) below {status.value} threshold",
                current_score=measurement.score,
                threshold=thresholds.poor if status == QualityStatus.POOR else thresholds.critical
            )
            
            self.quality_alerts.append(alert)
            logger.warning(f"Quality alert generated: {alert.message}")
    
    async def _calculate_quality_trends(self, target_id: str, 
                                      current_scores: Dict[QualityMetric, float]) -> Dict[QualityMetric, str]:
        """Calculate quality trends for metrics"""
        
        trends = {}
        
        # Get historical reports for this target
        historical_reports = self.quality_reports.get(target_id, [])
        
        if len(historical_reports) < 2:
            # Not enough history
            return {metric: "stable" for metric in current_scores.keys()}
        
        # Compare with recent reports (last 5)
        recent_reports = historical_reports[-5:]
        
        for metric in current_scores.keys():
            historical_scores = []
            for report in recent_reports:
                if metric in report.metric_scores:
                    historical_scores.append(report.metric_scores[metric])
            
            if len(historical_scores) >= 2:
                # Calculate trend
                if len(historical_scores) == 2:
                    trend_value = historical_scores[-1] - historical_scores[0]
                else:
                    # Linear regression for trend
                    x = np.arange(len(historical_scores))
                    y = np.array(historical_scores)
                    trend_value = np.polyfit(x, y, 1)[0]  # Slope of linear fit
                
                # Classify trend
                if trend_value > 0.05:
                    trends[metric] = "improving"
                elif trend_value < -0.05:
                    trends[metric] = "declining"
                else:
                    trends[metric] = "stable"
            else:
                trends[metric] = "stable"
        
        return trends
    
    async def _generate_recommendations(self, report: QualityReport) -> List[str]:
        """Generate recommendations based on quality report"""
        
        recommendations = []
        
        # Overall score recommendations
        if report.overall_score < 0.7:
            recommendations.append("Overall quality is below acceptable threshold. Consider comprehensive review and optimization.")
        
        # Metric-specific recommendations
        for metric, score in report.metric_scores.items():
            if score < 0.6:
                if metric == QualityMetric.ACCURACY:
                    recommendations.append("Low accuracy detected. Review prompt clarity and add validation steps.")
                elif metric == QualityMetric.PERFORMANCE:
                    recommendations.append("Performance issues detected. Optimize for speed and resource usage.")
                elif metric == QualityMetric.COMPLETENESS:
                    recommendations.append("Incomplete responses detected. Enhance prompts with comprehensive instructions.")
                elif metric == QualityMetric.CONSISTENCY:
                    recommendations.append("Inconsistent results detected. Add deterministic elements and validation.")
                elif metric == QualityMetric.SECURITY:
                    recommendations.append("Security concerns detected. Review for potential vulnerabilities.")
        
        # Trend-based recommendations
        for metric, trend in report.trends.items():
            if trend == "declining":
                recommendations.append(f"{metric.value} is declining. Investigate root causes and implement corrective measures.")
        
        return recommendations
    
    async def _generate_action_items(self, report: QualityReport) -> List[Dict[str, Any]]:
        """Generate specific action items based on quality report"""
        
        action_items = []
        
        for metric, status in report.metric_statuses.items():
            if status in [QualityStatus.POOR, QualityStatus.CRITICAL]:
                action_items.append({
                    'priority': 'high' if status == QualityStatus.CRITICAL else 'medium',
                    'metric': metric.value,
                    'action': f"Improve {metric.value}",
                    'description': f"Address {metric.value} issues to meet quality standards",
                    'target_score': self.metric_thresholds[metric].acceptable,
                    'current_score': report.metric_scores[metric]
                })
        
        return action_items
    
    # Default validation functions
    async def _validate_accuracy(self, target_data: Dict[str, Any], 
                               parameters: Dict[str, Any],
                               validation_level: ValidationLevel) -> Dict[str, Any]:
        """Validate accuracy of responses"""
        
        # Simulate accuracy validation
        # In real implementation, this would compare against ground truth, 
        # use evaluation metrics, or perform other accuracy checks
        
        content = target_data.get('content', '')
        expected = target_data.get('expected_output', '')
        
        # Simple similarity-based accuracy (placeholder)
        if expected:
            # Calculate word overlap
            content_words = set(content.lower().split())
            expected_words = set(expected.lower().split())
            
            if expected_words:
                overlap = len(content_words.intersection(expected_words))
                accuracy = overlap / len(expected_words)
            else:
                accuracy = 0.5  # Default for empty expected
        else:
            # Without expected output, use heuristics
            accuracy = 0.8 if len(content) > 50 else 0.5
        
        return {
            'score': min(1.0, accuracy),
            'raw_data': {
                'content_length': len(content),
                'expected_length': len(expected) if expected else 0,
                'word_overlap': len(content.split()) if content else 0
            },
            'confidence': 0.7
        }
    
    async def _validate_completeness(self, target_data: Dict[str, Any],
                                   parameters: Dict[str, Any],
                                   validation_level: ValidationLevel) -> Dict[str, Any]:
        """Validate completeness of responses"""
        
        content = target_data.get('content', '')
        requirements = target_data.get('requirements', [])
        
        # Check if all requirements are addressed
        if requirements:
            addressed_count = 0
            for req in requirements:
                if req.lower() in content.lower():
                    addressed_count += 1
            
            completeness = addressed_count / len(requirements)
        else:
            # Heuristic based on content length and structure
            if len(content) < 50:
                completeness = 0.3
            elif len(content) < 200:
                completeness = 0.6
            else:
                completeness = 0.8
        
        return {
            'score': completeness,
            'raw_data': {
                'requirements_count': len(requirements),
                'addressed_count': addressed_count if requirements else 0,
                'content_length': len(content)
            },
            'confidence': 0.8
        }
    
    async def _validate_performance(self, target_data: Dict[str, Any],
                                  parameters: Dict[str, Any],
                                  validation_level: ValidationLevel) -> Dict[str, Any]:
        """Validate performance metrics"""
        
        execution_time = target_data.get('execution_time', 0.0)
        token_usage = target_data.get('token_usage', 0)
        memory_usage = target_data.get('memory_usage', 0.0)
        
        # Performance scoring based on thresholds
        time_score = 1.0 if execution_time < 2.0 else max(0.1, 2.0 / execution_time)
        token_score = 1.0 if token_usage < 1000 else max(0.1, 1000.0 / token_usage)
        memory_score = 1.0 if memory_usage < 100.0 else max(0.1, 100.0 / memory_usage)
        
        performance = statistics.mean([time_score, token_score, memory_score])
        
        return {
            'score': performance,
            'raw_data': {
                'execution_time': execution_time,
                'token_usage': token_usage,
                'memory_usage': memory_usage,
                'time_score': time_score,
                'token_score': token_score,
                'memory_score': memory_score
            },
            'confidence': 0.9
        }
    
    async def _validate_consistency(self, target_data: Dict[str, Any],
                                  parameters: Dict[str, Any],
                                  validation_level: ValidationLevel) -> Dict[str, Any]:
        """Validate consistency across multiple executions"""
        
        executions = target_data.get('multiple_executions', [])
        
        if len(executions) < 2:
            return {
                'score': 0.5,
                'raw_data': {'execution_count': len(executions)},
                'confidence': 0.3
            }
        
        # Calculate variance in outputs
        output_lengths = [len(str(exec.get('output', ''))) for exec in executions]
        scores = [exec.get('score', 0.0) for exec in executions]
        
        # Consistency based on variance
        length_variance = statistics.variance(output_lengths) if len(output_lengths) > 1 else 0
        score_variance = statistics.variance(scores) if len(scores) > 1 else 0
        
        # Lower variance = higher consistency
        length_consistency = 1.0 / (1.0 + length_variance / 1000.0)
        score_consistency = 1.0 / (1.0 + score_variance * 10.0)
        
        consistency = statistics.mean([length_consistency, score_consistency])
        
        return {
            'score': consistency,
            'raw_data': {
                'execution_count': len(executions),
                'length_variance': length_variance,
                'score_variance': score_variance,
                'length_consistency': length_consistency,
                'score_consistency': score_consistency
            },
            'confidence': 0.8
        }
    
    async def _validate_security(self, target_data: Dict[str, Any],
                               parameters: Dict[str, Any],
                               validation_level: ValidationLevel) -> Dict[str, Any]:
        """Validate security aspects"""
        
        content = target_data.get('content', '')
        prompt = target_data.get('prompt', '')
        
        security_issues = 0
        total_checks = 0
        
        # Check for potential security issues
        security_patterns = [
            r'eval\s*\(',
            r'exec\s*\(',
            r'__import__',
            r'subprocess',
            r'os\.system',
            r'shell=True',
            r'rm\s+-rf',
            r'DROP\s+TABLE',
            r'DELETE\s+FROM',
        ]
        
        import re
        for pattern in security_patterns:
            total_checks += 1
            if re.search(pattern, content + prompt, re.IGNORECASE):
                security_issues += 1
        
        # Security score (1.0 = no issues, 0.0 = all checks failed)
        security_score = 1.0 - (security_issues / total_checks) if total_checks > 0 else 1.0
        
        return {
            'score': security_score,
            'raw_data': {
                'security_issues': security_issues,
                'total_checks': total_checks,
                'issues_found': security_issues > 0
            },
            'confidence': 0.9
        }
    
    async def start_monitoring(self, targets: List[Dict[str, Any]], 
                              interval: float = None) -> None:
        """Start continuous quality monitoring"""
        
        if interval:
            self.monitoring_interval = interval
        
        self.monitoring_active = True
        logger.info(f"Starting quality monitoring with {self.monitoring_interval}s interval")
        
        # Start monitoring task
        asyncio.create_task(self._monitoring_loop(targets))
    
    def stop_monitoring(self) -> None:
        """Stop continuous quality monitoring"""
        self.monitoring_active = False
        logger.info("Quality monitoring stopped")
    
    async def _monitoring_loop(self, targets: List[Dict[str, Any]]) -> None:
        """Main monitoring loop"""
        
        while self.monitoring_active:
            try:
                for target in targets:
                    target_id = target.get('id', str(uuid.uuid4()))
                    target_type = target.get('type', 'unknown')
                    target_data = target.get('data', {})
                    
                    # Validate target
                    report = await self.validate_target(target_id, target_type, target_data)
                    
                    # Log monitoring result
                    logger.info(f"Monitoring {target_id}: {report.overall_score:.3f}")
                
                # Wait for next monitoring cycle
                await asyncio.sleep(self.monitoring_interval)
                
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                await asyncio.sleep(self.monitoring_interval)
    
    def get_quality_dashboard(self) -> Dict[str, Any]:
        """Get comprehensive quality dashboard data"""
        
        dashboard = {
            'timestamp': datetime.now().isoformat(),
            'overview': {
                'total_targets': len(self.quality_reports),
                'total_reports': sum(len(reports) for reports in self.quality_reports.values()),
                'active_alerts': len([a for a in self.quality_alerts if not a.resolved]),
                'monitoring_active': self.monitoring_active
            },
            'quality_summary': {},
            'alerts_summary': {
                'critical': len([a for a in self.quality_alerts if a.severity == AlertSeverity.CRITICAL]),
                'error': len([a for a in self.quality_alerts if a.severity == AlertSeverity.ERROR]),
                'warning': len([a for a in self.quality_alerts if a.severity == AlertSeverity.WARNING]),
                'info': len([a for a in self.quality_alerts if a.severity == AlertSeverity.INFO])
            },
            'recent_reports': [],
            'validation_stats': dict(self.validation_stats)
        }
        
        # Calculate quality summary
        all_scores = []
        metric_scores = defaultdict(list)
        
        for reports in self.quality_reports.values():
            for report in reports[-5:]:  # Last 5 reports per target
                all_scores.append(report.overall_score)
                for metric, score in report.metric_scores.items():
                    metric_scores[metric].append(score)
        
        if all_scores:
            dashboard['quality_summary'] = {
                'average_score': statistics.mean(all_scores),
                'median_score': statistics.median(all_scores),
                'min_score': min(all_scores),
                'max_score': max(all_scores),
                'score_distribution': {
                    'excellent': len([s for s in all_scores if s >= 0.95]),
                    'good': len([s for s in all_scores if 0.85 <= s < 0.95]),
                    'acceptable': len([s for s in all_scores if 0.70 <= s < 0.85]),
                    'poor': len([s for s in all_scores if 0.50 <= s < 0.70]),
                    'critical': len([s for s in all_scores if s < 0.50])
                },
                'metric_averages': {
                    metric.value: statistics.mean(scores) 
                    for metric, scores in metric_scores.items()
                }
            }
        
        # Get recent reports
        recent_reports = []
        for target_id, reports in self.quality_reports.items():
            if reports:
                latest_report = reports[-1]
                recent_reports.append({
                    'target_id': target_id,
                    'target_type': latest_report.target_type,
                    'overall_score': latest_report.overall_score,
                    'overall_status': latest_report.overall_status.value,
                    'timestamp': latest_report.created_at.isoformat()
                })
        
        # Sort by timestamp and take last 10
        recent_reports.sort(key=lambda x: x['timestamp'], reverse=True)
        dashboard['recent_reports'] = recent_reports[:10]
        
        return dashboard
    
    def save_validation_state(self, filepath: str) -> None:
        """Save validation system state"""
        
        state_data = {
            'validation_rules': {k: v.to_dict() for k, v in self.validation_rules.items()},
            'quality_reports': {
                k: [report.to_dict() for report in reports]
                for k, reports in self.quality_reports.items()
            },
            'quality_alerts': [alert.to_dict() for alert in self.quality_alerts],
            'metric_thresholds': {
                k.value: v.to_dict() for k, v in self.metric_thresholds.items()
            },
            'validation_stats': dict(self.validation_stats),
            'quality_history': list(self.quality_history),
            'timestamp': datetime.now().isoformat()
        }
        
        with open(filepath, 'w') as f:
            json.dump(state_data, f, indent=2)
        
        logger.info(f"Validation state saved to {filepath}")


# Example usage
async def main():
    """Example usage of the Quality Validation System"""
    
    # Initialize system
    validator = QualityValidationSystem()
    
    # Test data
    test_target_data = {
        'content': 'This is a comprehensive response that addresses all the key points mentioned in the original query.',
        'expected_output': 'A comprehensive response addressing key points',
        'execution_time': 1.5,
        'token_usage': 500,
        'memory_usage': 25.0,
        'requirements': ['comprehensive', 'key points', 'original query'],
        'multiple_executions': [
            {'output': 'Response 1', 'score': 0.85},
            {'output': 'Response 2', 'score': 0.87},
            {'output': 'Response 3', 'score': 0.83}
        ]
    }
    
    # Validate a target
    report = await validator.validate_target(
        target_id="test_prompt_001",
        target_type="prompt",
        target_data=test_target_data,
        validation_level=ValidationLevel.COMPREHENSIVE
    )
    
    print("Quality Validation Report:")
    print(json.dumps(report.to_dict(), indent=2))
    
    # Get quality dashboard
    dashboard = validator.get_quality_dashboard()
    print("\nQuality Dashboard:")
    print(json.dumps(dashboard, indent=2))
    
    # Save state
    validator.save_validation_state("quality_validation_state.json")


if __name__ == "__main__":
    asyncio.run(main())