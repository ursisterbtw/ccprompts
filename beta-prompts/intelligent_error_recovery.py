#!/usr/bin/env python3
"""
Intelligent Error Recovery System
===============================

A comprehensive system for automatic error detection, diagnosis, and recovery
with machine learning-based pattern recognition and adaptive recovery strategies.

Features:
- Real-time error detection and classification
- Intelligent root cause analysis
- Adaptive recovery strategy selection
- Self-learning error pattern recognition
- Automated rollback and restoration
- Proactive error prevention
- Circuit breaker patterns for system protection
- Comprehensive error reporting and analytics
"""

import asyncio
import json
import logging
import time
import traceback
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Callable, Tuple, Union, Type
import uuid
from collections import defaultdict, deque
import hashlib
import re
from pathlib import Path
import pickle

logger = logging.getLogger(__name__)


class ErrorSeverity(Enum):
    """Error severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
    FATAL = "fatal"


class ErrorCategory(Enum):
    """Categories of errors"""
    SYSTEM = "system"
    NETWORK = "network"
    AUTHENTICATION = "authentication"
    VALIDATION = "validation"
    TIMEOUT = "timeout"
    RESOURCE = "resource"
    LOGIC = "logic"
    DATA = "data"
    CONFIGURATION = "configuration"
    EXTERNAL = "external"


class RecoveryStrategy(Enum):
    """Types of recovery strategies"""
    RETRY = "retry"
    FALLBACK = "fallback"
    ROLLBACK = "rollback"
    RESET = "reset"
    ESCALATE = "escalate"
    IGNORE = "ignore"
    CIRCUIT_BREAK = "circuit_break"
    GRACEFUL_DEGRADE = "graceful_degrade"


class ErrorState(Enum):
    """States of error handling"""
    DETECTED = "detected"
    ANALYZING = "analyzing"
    RECOVERING = "recovering"
    RESOLVED = "resolved"
    FAILED = "failed"
    ESCALATED = "escalated"


@dataclass
class ErrorPattern:
    """Pattern for error recognition and matching"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    category: ErrorCategory = ErrorCategory.SYSTEM
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
    
    # Pattern matching
    error_message_patterns: List[str] = field(default_factory=list)
    exception_types: List[str] = field(default_factory=list)
    context_patterns: Dict[str, Any] = field(default_factory=dict)
    
    # Recovery configuration
    recovery_strategies: List[RecoveryStrategy] = field(default_factory=list)
    max_retry_attempts: int = 3
    retry_delay_base: float = 1.0
    timeout_seconds: float = 30.0
    
    # Learning data
    occurrence_count: int = 0
    successful_recoveries: int = 0
    last_seen: Optional[datetime] = None
    
    def matches(self, error_info: Dict[str, Any]) -> float:
        """Calculate match confidence for this pattern"""
        confidence = 0.0
        factors = 0
        
        error_message = error_info.get('message', '')
        exception_type = error_info.get('exception_type', '')
        context = error_info.get('context', {})
        
        # Check message patterns
        if self.error_message_patterns:
            factors += 1
            for pattern in self.error_message_patterns:
                if re.search(pattern, error_message, re.IGNORECASE):
                    confidence += 0.4
                    break
        
        # Check exception types
        if self.exception_types:
            factors += 1
            if exception_type in self.exception_types:
                confidence += 0.3
        
        # Check context patterns
        if self.context_patterns:
            factors += 1
            context_match = 0.0
            for key, expected_value in self.context_patterns.items():
                if key in context:
                    if isinstance(expected_value, str):
                        if expected_value.lower() in str(context[key]).lower():
                            context_match += 0.1
                    elif context[key] == expected_value:
                        context_match += 0.1
            confidence += min(0.3, context_match)
        
        # Normalize by number of factors
        return confidence if factors == 0 else confidence
    
    def update_statistics(self, recovery_successful: bool) -> None:
        """Update pattern statistics"""
        self.occurrence_count += 1
        self.last_seen = datetime.now()
        if recovery_successful:
            self.successful_recoveries += 1
    
    def get_success_rate(self) -> float:
        """Get recovery success rate for this pattern"""
        if self.occurrence_count == 0:
            return 0.0
        return self.successful_recoveries / self.occurrence_count
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category.value,
            'severity': self.severity.value,
            'error_message_patterns': self.error_message_patterns,
            'exception_types': self.exception_types,
            'context_patterns': self.context_patterns,
            'recovery_strategies': [s.value for s in self.recovery_strategies],
            'max_retry_attempts': self.max_retry_attempts,
            'retry_delay_base': self.retry_delay_base,
            'timeout_seconds': self.timeout_seconds,
            'occurrence_count': self.occurrence_count,
            'successful_recoveries': self.successful_recoveries,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None,
            'success_rate': self.get_success_rate()
        }


@dataclass
class ErrorIncident:
    """Represents an error incident with full context"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = field(default_factory=datetime.now)
    
    # Error information
    error_message: str = ""
    exception_type: str = ""
    stack_trace: str = ""
    error_code: Optional[str] = None
    
    # Context
    context: Dict[str, Any] = field(default_factory=dict)
    system_state: Dict[str, Any] = field(default_factory=dict)
    operation_id: Optional[str] = None
    user_id: Optional[str] = None
    
    # Classification
    category: ErrorCategory = ErrorCategory.SYSTEM
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
    matched_patterns: List[str] = field(default_factory=list)
    
    # Recovery
    state: ErrorState = ErrorState.DETECTED
    recovery_attempts: List[Dict[str, Any]] = field(default_factory=list)
    recovery_strategy: Optional[RecoveryStrategy] = None
    resolution_time: Optional[datetime] = None
    
    # Outcome
    resolved: bool = False
    escalated: bool = False
    impact_assessment: Dict[str, Any] = field(default_factory=dict)
    
    def add_recovery_attempt(self, strategy: RecoveryStrategy, result: Dict[str, Any]) -> None:
        """Add a recovery attempt record"""
        attempt = {
            'strategy': strategy.value,
            'timestamp': datetime.now().isoformat(),
            'result': result,
            'attempt_number': len(self.recovery_attempts) + 1
        }
        self.recovery_attempts.append(attempt)
    
    def get_duration(self) -> timedelta:
        """Get duration of the incident"""
        end_time = self.resolution_time or datetime.now()
        return end_time - self.timestamp
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'error_message': self.error_message,
            'exception_type': self.exception_type,
            'stack_trace': self.stack_trace,
            'error_code': self.error_code,
            'context': self.context,
            'system_state': self.system_state,
            'operation_id': self.operation_id,
            'user_id': self.user_id,
            'category': self.category.value,
            'severity': self.severity.value,
            'matched_patterns': self.matched_patterns,
            'state': self.state.value,
            'recovery_attempts': self.recovery_attempts,
            'recovery_strategy': self.recovery_strategy.value if self.recovery_strategy else None,
            'resolution_time': self.resolution_time.isoformat() if self.resolution_time else None,
            'resolved': self.resolved,
            'escalated': self.escalated,
            'impact_assessment': self.impact_assessment,
            'duration_seconds': self.get_duration().total_seconds()
        }


@dataclass
class CircuitBreaker:
    """Circuit breaker for protecting system resources"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    failure_threshold: int = 5
    timeout_duration: timedelta = field(default_factory=lambda: timedelta(minutes=5))
    
    # State
    failure_count: int = 0
    last_failure_time: Optional[datetime] = None
    state: str = "closed"  # closed, open, half-open
    
    def record_success(self) -> None:
        """Record a successful operation"""
        self.failure_count = 0
        self.state = "closed"
    
    def record_failure(self) -> None:
        """Record a failed operation"""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "open"
    
    def can_execute(self) -> bool:
        """Check if operation can be executed"""
        if self.state == "closed":
            return True
        elif self.state == "open":
            if self.last_failure_time and datetime.now() - self.last_failure_time > self.timeout_duration:
                self.state = "half-open"
                return True
            return False
        elif self.state == "half-open":
            return True
        return False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'failure_threshold': self.failure_threshold,
            'timeout_duration': self.timeout_duration.total_seconds(),
            'failure_count': self.failure_count,
            'last_failure_time': self.last_failure_time.isoformat() if self.last_failure_time else None,
            'state': self.state
        }


class IntelligentErrorRecovery:
    """
    Main system for intelligent error recovery with machine learning capabilities
    """
    
    def __init__(self):
        self.error_patterns: Dict[str, ErrorPattern] = {}
        self.error_incidents: List[ErrorIncident] = []
        self.circuit_breakers: Dict[str, CircuitBreaker] = {}
        self.recovery_handlers: Dict[RecoveryStrategy, Callable] = {}
        self.error_history: deque = deque(maxlen=10000)
        
        # Learning and analytics
        self.pattern_learning_enabled = True
        self.auto_pattern_creation = True
        self.success_threshold = 0.8
        
        # Performance metrics
        self.recovery_stats = defaultdict(int)
        self.strategy_effectiveness = defaultdict(list)
        
        # Initialize default patterns and handlers
        self._initialize_default_patterns()
        self._initialize_recovery_handlers()
        
        logger.info("Intelligent Error Recovery System initialized")
    
    def _initialize_default_patterns(self) -> None:
        """Initialize common error patterns"""
        
        # Network timeout pattern
        network_timeout = ErrorPattern(
            name="Network Timeout",
            description="Network operation timeout errors",
            category=ErrorCategory.NETWORK,
            severity=ErrorSeverity.MEDIUM,
            error_message_patterns=[
                r"timeout",
                r"connection.*timeout",
                r"read.*timeout",
                r"request.*timeout"
            ],
            exception_types=["TimeoutError", "ConnectionTimeout", "ReadTimeout"],
            recovery_strategies=[RecoveryStrategy.RETRY, RecoveryStrategy.FALLBACK],
            max_retry_attempts=3,
            retry_delay_base=2.0
        )
        self.add_error_pattern(network_timeout)
        
        # Authentication error pattern
        auth_error = ErrorPattern(
            name="Authentication Error",
            description="Authentication and authorization failures",
            category=ErrorCategory.AUTHENTICATION,
            severity=ErrorSeverity.HIGH,
            error_message_patterns=[
                r"unauthorized",
                r"authentication.*failed",
                r"invalid.*credentials",
                r"access.*denied"
            ],
            exception_types=["AuthenticationError", "PermissionError"],
            recovery_strategies=[RecoveryStrategy.ESCALATE],
            max_retry_attempts=1
        )
        self.add_error_pattern(auth_error)
        
        # Resource exhaustion pattern
        resource_error = ErrorPattern(
            name="Resource Exhaustion",
            description="System resource exhaustion errors",
            category=ErrorCategory.RESOURCE,
            severity=ErrorSeverity.HIGH,
            error_message_patterns=[
                r"out of memory",
                r"disk.*full",
                r"too many.*connections",
                r"resource.*unavailable"
            ],
            exception_types=["MemoryError", "OSError"],
            recovery_strategies=[RecoveryStrategy.CIRCUIT_BREAK, RecoveryStrategy.GRACEFUL_DEGRADE],
            max_retry_attempts=1
        )
        self.add_error_pattern(resource_error)
        
        # Validation error pattern
        validation_error = ErrorPattern(
            name="Input Validation Error",
            description="Input validation and data format errors",
            category=ErrorCategory.VALIDATION,
            severity=ErrorSeverity.LOW,
            error_message_patterns=[
                r"invalid.*input",
                r"validation.*failed",
                r"bad.*format",
                r"parse.*error"
            ],
            exception_types=["ValueError", "ValidationError", "ParseError"],
            recovery_strategies=[RecoveryStrategy.FALLBACK, RecoveryStrategy.RESET],
            max_retry_attempts=2
        )
        self.add_error_pattern(validation_error)
        
        # External service error pattern
        external_error = ErrorPattern(
            name="External Service Error",
            description="External service dependency failures",
            category=ErrorCategory.EXTERNAL,
            severity=ErrorSeverity.MEDIUM,
            error_message_patterns=[
                r"service.*unavailable",
                r"api.*error",
                r"external.*service.*error",
                r"dependency.*failure"
            ],
            recovery_strategies=[RecoveryStrategy.RETRY, RecoveryStrategy.FALLBACK, RecoveryStrategy.CIRCUIT_BREAK],
            max_retry_attempts=3,
            retry_delay_base=1.5
        )
        self.add_error_pattern(external_error)
    
    def _initialize_recovery_handlers(self) -> None:
        """Initialize recovery strategy handlers"""
        
        self.recovery_handlers = {
            RecoveryStrategy.RETRY: self._handle_retry,
            RecoveryStrategy.FALLBACK: self._handle_fallback,
            RecoveryStrategy.ROLLBACK: self._handle_rollback,
            RecoveryStrategy.RESET: self._handle_reset,
            RecoveryStrategy.ESCALATE: self._handle_escalate,
            RecoveryStrategy.IGNORE: self._handle_ignore,
            RecoveryStrategy.CIRCUIT_BREAK: self._handle_circuit_break,
            RecoveryStrategy.GRACEFUL_DEGRADE: self._handle_graceful_degrade
        }
    
    def add_error_pattern(self, pattern: ErrorPattern) -> None:
        """Add an error pattern to the system"""
        self.error_patterns[pattern.id] = pattern
        logger.info(f"Added error pattern: {pattern.name}")
    
    def add_circuit_breaker(self, name: str, failure_threshold: int = 5, 
                          timeout_minutes: int = 5) -> CircuitBreaker:
        """Add a circuit breaker for a specific operation"""
        breaker = CircuitBreaker(
            name=name,
            failure_threshold=failure_threshold,
            timeout_duration=timedelta(minutes=timeout_minutes)
        )
        self.circuit_breakers[name] = breaker
        logger.info(f"Added circuit breaker: {name}")
        return breaker
    
    async def handle_error(self, error: Exception, context: Dict[str, Any] = None, 
                          operation_id: str = None) -> Dict[str, Any]:
        """Main error handling entry point"""
        
        # Create error incident
        incident = ErrorIncident(
            error_message=str(error),
            exception_type=type(error).__name__,
            stack_trace=traceback.format_exc(),
            context=context or {},
            operation_id=operation_id
        )
        
        # Add system state
        incident.system_state = await self._capture_system_state()
        
        # Classify error
        await self._classify_error(incident)
        
        # Add to incidents list
        self.error_incidents.append(incident)
        
        # Record in history
        self.error_history.append({
            'incident_id': incident.id,
            'timestamp': incident.timestamp.isoformat(),
            'error_type': incident.exception_type,
            'category': incident.category.value,
            'severity': incident.severity.value
        })
        
        logger.error(f"Error detected: {incident.error_message} (ID: {incident.id})")
        
        # Attempt recovery
        recovery_result = await self._attempt_recovery(incident)
        
        # Update statistics
        self.recovery_stats['total_errors'] += 1
        if recovery_result.get('recovered', False):
            self.recovery_stats['successful_recoveries'] += 1
        
        return {
            'incident_id': incident.id,
            'recovered': recovery_result.get('recovered', False),
            'strategy_used': recovery_result.get('strategy'),
            'attempts': len(incident.recovery_attempts),
            'resolution_time': incident.resolution_time.isoformat() if incident.resolution_time else None
        }
    
    async def _capture_system_state(self) -> Dict[str, Any]:
        """Capture current system state for diagnosis"""
        import psutil
        import os
        
        try:
            return {
                'timestamp': datetime.now().isoformat(),
                'cpu_percent': psutil.cpu_percent(),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_usage': psutil.disk_usage('/').percent,
                'process_count': len(psutil.pids()),
                'load_average': os.getloadavg() if hasattr(os, 'getloadavg') else None,
                'uptime': time.time() - psutil.boot_time()
            }
        except Exception as e:
            logger.warning(f"Failed to capture system state: {e}")
            return {'error': str(e)}
    
    async def _classify_error(self, incident: ErrorIncident) -> None:
        """Classify error using pattern matching"""
        
        error_info = {
            'message': incident.error_message,
            'exception_type': incident.exception_type,
            'context': incident.context
        }
        
        best_match = None
        best_confidence = 0.0
        
        # Find best matching pattern
        for pattern in self.error_patterns.values():
            confidence = pattern.matches(error_info)
            if confidence > best_confidence:
                best_confidence = confidence
                best_match = pattern
        
        # Apply classification
        if best_match and best_confidence > 0.3:
            incident.category = best_match.category
            incident.severity = best_match.severity
            incident.matched_patterns.append(best_match.id)
            
            # Update pattern statistics
            best_match.update_statistics(False)  # Will update with actual result later
            
            logger.info(f"Error classified as {incident.category.value} (confidence: {best_confidence:.2f})")
        else:
            # Auto-create pattern if enabled and no good match found
            if self.auto_pattern_creation and best_confidence < 0.3:
                await self._create_pattern_from_error(incident)
    
    async def _create_pattern_from_error(self, incident: ErrorIncident) -> None:
        """Automatically create a new error pattern from an unmatched error"""
        
        # Extract pattern from error message
        error_words = incident.error_message.lower().split()
        pattern_words = [word for word in error_words if len(word) > 3]
        
        if not pattern_words:
            return
        
        # Create new pattern
        new_pattern = ErrorPattern(
            name=f"Auto-generated: {incident.exception_type}",
            description=f"Auto-generated pattern for {incident.exception_type} errors",
            category=self._infer_category_from_error(incident),
            severity=self._infer_severity_from_error(incident),
            error_message_patterns=[rf"\b{'|'.join(pattern_words[:3])}\b"],
            exception_types=[incident.exception_type],
            recovery_strategies=[RecoveryStrategy.RETRY, RecoveryStrategy.FALLBACK]
        )
        
        self.add_error_pattern(new_pattern)
        
        # Apply to current incident
        incident.matched_patterns.append(new_pattern.id)
        incident.category = new_pattern.category
        incident.severity = new_pattern.severity
        
        logger.info(f"Auto-created error pattern: {new_pattern.name}")
    
    def _infer_category_from_error(self, incident: ErrorIncident) -> ErrorCategory:
        """Infer error category from error information"""
        
        error_msg = incident.error_message.lower()
        exception_type = incident.exception_type.lower()
        
        if any(word in error_msg for word in ['timeout', 'connection', 'network']):
            return ErrorCategory.NETWORK
        elif any(word in error_msg for word in ['auth', 'permission', 'unauthorized']):
            return ErrorCategory.AUTHENTICATION
        elif any(word in error_msg for word in ['validation', 'invalid', 'format']):
            return ErrorCategory.VALIDATION
        elif any(word in error_msg for word in ['memory', 'resource', 'limit']):
            return ErrorCategory.RESOURCE
        elif 'config' in error_msg:
            return ErrorCategory.CONFIGURATION
        else:
            return ErrorCategory.SYSTEM
    
    def _infer_severity_from_error(self, incident: ErrorIncident) -> ErrorSeverity:
        """Infer error severity from error information"""
        
        error_msg = incident.error_message.lower()
        
        if any(word in error_msg for word in ['critical', 'fatal', 'crash']):
            return ErrorSeverity.CRITICAL
        elif any(word in error_msg for word in ['memory', 'disk', 'resource']):
            return ErrorSeverity.HIGH
        elif any(word in error_msg for word in ['validation', 'format']):
            return ErrorSeverity.LOW
        else:
            return ErrorSeverity.MEDIUM
    
    async def _attempt_recovery(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Attempt to recover from the error"""
        
        incident.state = ErrorState.ANALYZING
        
        # Get recovery strategies from matched patterns
        strategies = self._get_recovery_strategies(incident)
        
        if not strategies:
            strategies = [RecoveryStrategy.RETRY]  # Default fallback
        
        # Try each strategy in order
        for strategy in strategies:
            incident.state = ErrorState.RECOVERING
            incident.recovery_strategy = strategy
            
            try:
                handler = self.recovery_handlers.get(strategy)
                if handler:
                    result = await handler(incident)
                    incident.add_recovery_attempt(strategy, result)
                    
                    if result.get('success', False):
                        incident.resolved = True
                        incident.state = ErrorState.RESOLVED
                        incident.resolution_time = datetime.now()
                        
                        # Update pattern success statistics
                        for pattern_id in incident.matched_patterns:
                            if pattern_id in self.error_patterns:
                                self.error_patterns[pattern_id].update_statistics(True)
                        
                        # Record strategy effectiveness
                        self.strategy_effectiveness[strategy].append(1.0)
                        
                        logger.info(f"Error {incident.id} recovered using {strategy.value}")
                        return {
                            'recovered': True,
                            'strategy': strategy.value,
                            'result': result
                        }
                    else:
                        # Record failed attempt
                        self.strategy_effectiveness[strategy].append(0.0)
                        
            except Exception as recovery_error:
                logger.error(f"Recovery strategy {strategy.value} failed: {recovery_error}")
                incident.add_recovery_attempt(strategy, {
                    'success': False,
                    'error': str(recovery_error)
                })
        
        # All recovery attempts failed
        incident.state = ErrorState.FAILED
        
        # Update pattern failure statistics
        for pattern_id in incident.matched_patterns:
            if pattern_id in self.error_patterns:
                self.error_patterns[pattern_id].update_statistics(False)
        
        # Check if escalation is needed
        if incident.severity in [ErrorSeverity.HIGH, ErrorSeverity.CRITICAL]:
            await self._escalate_incident(incident)
        
        return {
            'recovered': False,
            'attempts': len(incident.recovery_attempts)
        }
    
    def _get_recovery_strategies(self, incident: ErrorIncident) -> List[RecoveryStrategy]:
        """Get recovery strategies for an incident"""
        
        strategies = []
        
        # Get strategies from matched patterns
        for pattern_id in incident.matched_patterns:
            if pattern_id in self.error_patterns:
                pattern = self.error_patterns[pattern_id]
                strategies.extend(pattern.recovery_strategies)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_strategies = []
        for strategy in strategies:
            if strategy not in seen:
                seen.add(strategy)
                unique_strategies.append(strategy)
        
        # Sort by effectiveness (if we have data)
        if unique_strategies:
            strategy_scores = {}
            for strategy in unique_strategies:
                if strategy in self.strategy_effectiveness:
                    scores = self.strategy_effectiveness[strategy]
                    strategy_scores[strategy] = sum(scores) / len(scores) if scores else 0.5
                else:
                    strategy_scores[strategy] = 0.5  # Default score
            
            unique_strategies.sort(key=lambda s: strategy_scores[s], reverse=True)
        
        return unique_strategies
    
    # Recovery strategy handlers
    async def _handle_retry(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Handle retry recovery strategy"""
        
        max_attempts = 3
        delay = 1.0
        
        # Get parameters from matched patterns
        for pattern_id in incident.matched_patterns:
            if pattern_id in self.error_patterns:
                pattern = self.error_patterns[pattern_id]
                max_attempts = pattern.max_retry_attempts
                delay = pattern.retry_delay_base
                break
        
        # Check circuit breaker
        if incident.operation_id and incident.operation_id in self.circuit_breakers:
            breaker = self.circuit_breakers[incident.operation_id]
            if not breaker.can_execute():
                return {'success': False, 'reason': 'circuit_breaker_open'}
        
        attempt_count = len([a for a in incident.recovery_attempts if a['strategy'] == 'retry'])
        
        if attempt_count >= max_attempts:
            return {'success': False, 'reason': 'max_retries_exceeded'}
        
        # Wait before retry (exponential backoff)
        wait_time = delay * (2 ** attempt_count)
        await asyncio.sleep(wait_time)
        
        # Simulate retry logic (in real implementation, this would re-execute the failed operation)
        # For now, we'll simulate with a probability of success
        import random
        success_probability = 0.6 - (attempt_count * 0.1)  # Decreasing probability
        success = random.random() < success_probability
        
        if success and incident.operation_id and incident.operation_id in self.circuit_breakers:
            self.circuit_breakers[incident.operation_id].record_success()
        elif not success and incident.operation_id and incident.operation_id in self.circuit_breakers:
            self.circuit_breakers[incident.operation_id].record_failure()
        
        return {
            'success': success,
            'attempt': attempt_count + 1,
            'wait_time': wait_time
        }
    
    async def _handle_fallback(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Handle fallback recovery strategy"""
        
        # Implement fallback logic
        fallback_options = incident.context.get('fallback_options', [])
        
        if not fallback_options:
            # Default fallback behavior
            return {
                'success': True,
                'fallback_used': 'default_response',
                'degraded_service': True
            }
        
        # Try fallback options
        for option in fallback_options:
            try:
                # Simulate fallback execution
                await asyncio.sleep(0.1)
                return {
                    'success': True,
                    'fallback_used': option,
                    'degraded_service': False
                }
            except Exception as e:
                continue
        
        return {'success': False, 'reason': 'all_fallbacks_failed'}
    
    async def _handle_rollback(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Handle rollback recovery strategy"""
        
        # Check if rollback is possible
        checkpoint = incident.context.get('checkpoint')
        if not checkpoint:
            return {'success': False, 'reason': 'no_checkpoint_available'}
        
        try:
            # Simulate rollback operation
            await asyncio.sleep(0.5)
            
            return {
                'success': True,
                'rolled_back_to': checkpoint,
                'data_loss': False
            }
        except Exception as e:
            return {
                'success': False,
                'reason': str(e)
            }
    
    async def _handle_reset(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Handle reset recovery strategy"""
        
        try:
            # Simulate component reset
            await asyncio.sleep(1.0)
            
            return {
                'success': True,
                'reset_component': incident.context.get('component', 'unknown'),
                'downtime_seconds': 1.0
            }
        except Exception as e:
            return {
                'success': False,
                'reason': str(e)
            }
    
    async def _handle_escalate(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Handle escalation recovery strategy"""
        
        incident.escalated = True
        incident.state = ErrorState.ESCALATED
        
        # Log escalation
        logger.critical(f"Incident {incident.id} escalated: {incident.error_message}")
        
        # In real implementation, this would notify administrators, create tickets, etc.
        
        return {
            'success': True,
            'escalated_to': 'system_administrators',
            'ticket_id': f"TICKET-{incident.id[:8]}"
        }
    
    async def _handle_ignore(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Handle ignore recovery strategy"""
        
        return {
            'success': True,
            'action': 'ignored',
            'reason': 'non_critical_error'
        }
    
    async def _handle_circuit_break(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Handle circuit breaker recovery strategy"""
        
        operation_name = incident.context.get('operation', 'unknown')
        
        if operation_name not in self.circuit_breakers:
            self.add_circuit_breaker(operation_name)
        
        breaker = self.circuit_breakers[operation_name]
        breaker.record_failure()
        
        return {
            'success': True,
            'circuit_breaker_opened': breaker.state == 'open',
            'failure_count': breaker.failure_count
        }
    
    async def _handle_graceful_degrade(self, incident: ErrorIncident) -> Dict[str, Any]:
        """Handle graceful degradation recovery strategy"""
        
        # Reduce service quality to maintain availability
        degradation_level = incident.context.get('degradation_level', 'minimal')
        
        return {
            'success': True,
            'degradation_level': degradation_level,
            'features_disabled': ['advanced_processing', 'real_time_updates'],
            'performance_impact': '30%'
        }
    
    async def _escalate_incident(self, incident: ErrorIncident) -> None:
        """Escalate an incident to higher levels"""
        
        incident.escalated = True
        incident.state = ErrorState.ESCALATED
        
        # Create escalation record
        escalation_data = {
            'incident_id': incident.id,
            'severity': incident.severity.value,
            'error_message': incident.error_message,
            'failed_strategies': [attempt['strategy'] for attempt in incident.recovery_attempts],
            'escalation_time': datetime.now().isoformat()
        }
        
        logger.critical(f"Incident escalated: {escalation_data}")
        
        # In real implementation, this would:
        # - Send notifications to administrators
        # - Create support tickets
        # - Trigger automated response procedures
        # - Update monitoring dashboards
    
    def get_error_analytics(self) -> Dict[str, Any]:
        """Get comprehensive error analytics"""
        
        now = datetime.now()
        day_ago = now - timedelta(days=1)
        week_ago = now - timedelta(days=7)
        
        recent_incidents = [i for i in self.error_incidents if i.timestamp > day_ago]
        weekly_incidents = [i for i in self.error_incidents if i.timestamp > week_ago]
        
        analytics = {
            'timestamp': now.isoformat(),
            'summary': {
                'total_incidents': len(self.error_incidents),
                'incidents_last_24h': len(recent_incidents),
                'incidents_last_7d': len(weekly_incidents),
                'recovery_rate_24h': self._calculate_recovery_rate(recent_incidents),
                'recovery_rate_7d': self._calculate_recovery_rate(weekly_incidents),
                'average_resolution_time': self._calculate_average_resolution_time(recent_incidents)
            },
            'category_breakdown': self._get_category_breakdown(recent_incidents),
            'severity_breakdown': self._get_severity_breakdown(recent_incidents),
            'pattern_effectiveness': self._get_pattern_effectiveness(),
            'strategy_effectiveness': self._get_strategy_effectiveness(),
            'circuit_breaker_status': {name: breaker.to_dict() for name, breaker in self.circuit_breakers.items()},
            'top_error_patterns': self._get_top_error_patterns(),
            'recovery_stats': dict(self.recovery_stats)
        }
        
        return analytics
    
    def _calculate_recovery_rate(self, incidents: List[ErrorIncident]) -> float:
        """Calculate recovery rate for a set of incidents"""
        if not incidents:
            return 0.0
        
        recovered = len([i for i in incidents if i.resolved])
        return recovered / len(incidents)
    
    def _calculate_average_resolution_time(self, incidents: List[ErrorIncident]) -> float:
        """Calculate average resolution time in seconds"""
        resolved_incidents = [i for i in incidents if i.resolved and i.resolution_time]
        
        if not resolved_incidents:
            return 0.0
        
        total_time = sum(i.get_duration().total_seconds() for i in resolved_incidents)
        return total_time / len(resolved_incidents)
    
    def _get_category_breakdown(self, incidents: List[ErrorIncident]) -> Dict[str, int]:
        """Get breakdown of incidents by category"""
        breakdown = defaultdict(int)
        for incident in incidents:
            breakdown[incident.category.value] += 1
        return dict(breakdown)
    
    def _get_severity_breakdown(self, incidents: List[ErrorIncident]) -> Dict[str, int]:
        """Get breakdown of incidents by severity"""
        breakdown = defaultdict(int)
        for incident in incidents:
            breakdown[incident.severity.value] += 1
        return dict(breakdown)
    
    def _get_pattern_effectiveness(self) -> Dict[str, Dict[str, Any]]:
        """Get effectiveness metrics for error patterns"""
        effectiveness = {}
        
        for pattern_id, pattern in self.error_patterns.items():
            if pattern.occurrence_count > 0:
                effectiveness[pattern.name] = {
                    'success_rate': pattern.get_success_rate(),
                    'occurrence_count': pattern.occurrence_count,
                    'last_seen': pattern.last_seen.isoformat() if pattern.last_seen else None
                }
        
        return effectiveness
    
    def _get_strategy_effectiveness(self) -> Dict[str, float]:
        """Get effectiveness metrics for recovery strategies"""
        effectiveness = {}
        
        for strategy, scores in self.strategy_effectiveness.items():
            if scores:
                effectiveness[strategy.value] = sum(scores) / len(scores)
        
        return effectiveness
    
    def _get_top_error_patterns(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get top error patterns by occurrence"""
        patterns_with_counts = [
            {
                'name': pattern.name,
                'occurrence_count': pattern.occurrence_count,
                'success_rate': pattern.get_success_rate(),
                'category': pattern.category.value,
                'severity': pattern.severity.value
            }
            for pattern in self.error_patterns.values()
            if pattern.occurrence_count > 0
        ]
        
        patterns_with_counts.sort(key=lambda x: x['occurrence_count'], reverse=True)
        return patterns_with_counts[:limit]
    
    def save_recovery_state(self, filepath: str) -> None:
        """Save error recovery system state"""
        
        state_data = {
            'error_patterns': {k: v.to_dict() for k, v in self.error_patterns.items()},
            'error_incidents': [incident.to_dict() for incident in self.error_incidents],
            'circuit_breakers': {k: v.to_dict() for k, v in self.circuit_breakers.items()},
            'recovery_stats': dict(self.recovery_stats),
            'strategy_effectiveness': {k.value: v for k, v in self.strategy_effectiveness.items()},
            'error_history': list(self.error_history),
            'timestamp': datetime.now().isoformat()
        }
        
        with open(filepath, 'w') as f:
            json.dump(state_data, f, indent=2)
        
        logger.info(f"Recovery state saved to {filepath}")


# Example usage
async def main():
    """Example usage of the Intelligent Error Recovery System"""
    
    # Initialize system
    recovery_system = IntelligentErrorRecovery()
    
    # Add a circuit breaker
    recovery_system.add_circuit_breaker("external_api", failure_threshold=3, timeout_minutes=2)
    
    # Simulate some errors
    test_errors = [
        (TimeoutError("Connection timeout after 30 seconds"), {"operation": "external_api"}),
        (ValueError("Invalid input format"), {"user_input": "malformed_data"}),
        (PermissionError("Access denied to resource"), {"user_id": "user123"}),
        (MemoryError("Out of memory"), {"component": "data_processor"}),
    ]
    
    results = []
    for error, context in test_errors:
        result = await recovery_system.handle_error(error, context)
        results.append(result)
        print(f"Error handled: {result}")
    
    # Get analytics
    analytics = recovery_system.get_error_analytics()
    print("\nError Analytics:")
    print(json.dumps(analytics, indent=2))
    
    # Save state
    recovery_system.save_recovery_state("error_recovery_state.json")


if __name__ == "__main__":
    asyncio.run(main())