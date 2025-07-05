#!/usr/bin/env python3
"""
MCP Integration Engine - Intelligent MCP Server Orchestration
===========================================================

A comprehensive system for intelligently coordinating multiple MCP servers
with context-aware routing, automatic fallbacks, and performance optimization.

Features:
- Automatic server capability detection and routing
- Context-aware server selection
- Intelligent fallback mechanisms
- Performance monitoring and optimization
- Adaptive caching and context management
- Self-healing server connections
"""

import asyncio
import json
import logging
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Callable, Union, Tuple
import uuid
from pathlib import Path
import statistics
import hashlib

logger = logging.getLogger(__name__)


class ServerType(Enum):
    """Types of MCP servers available"""
    FILESYSTEM = "filesystem"
    MEMORY = "memory"
    SEQUENTIAL_THINKING = "sequential_thinking"
    CONTEXT7 = "context7"
    PUPPETEER = "puppeteer"
    FETCH = "fetch"
    DESKTOP_COMMANDER = "desktop_commander"


class OperationType(Enum):
    """Types of operations servers can perform"""
    READ = "read"
    WRITE = "write"
    EXECUTE = "execute"
    ANALYZE = "analyze"
    TRANSFORM = "transform"
    COORDINATE = "coordinate"
    MONITOR = "monitor"


@dataclass
class ServerCapability:
    """Capability definition for an MCP server"""
    server_type: ServerType
    operation_type: OperationType
    description: str
    performance_score: float = 0.0
    reliability_score: float = 0.0
    cost_efficiency: float = 0.0
    context_requirements: Dict[str, Any] = field(default_factory=dict)
    output_format: str = "json"
    max_concurrent: int = 5
    timeout: float = 30.0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'server_type': self.server_type.value,
            'operation_type': self.operation_type.value,
            'description': self.description,
            'performance_score': self.performance_score,
            'reliability_score': self.reliability_score,
            'cost_efficiency': self.cost_efficiency,
            'context_requirements': self.context_requirements,
            'output_format': self.output_format,
            'max_concurrent': self.max_concurrent,
            'timeout': self.timeout
        }


@dataclass
class ServerMetrics:
    """Performance metrics for a server"""
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    average_response_time: float = 0.0
    last_used: Optional[datetime] = None
    uptime_percentage: float = 100.0
    error_rate: float = 0.0
    throughput: float = 0.0
    
    def update_metrics(self, success: bool, response_time: float) -> None:
        """Update metrics with new request data"""
        self.total_requests += 1
        self.last_used = datetime.now()
        
        if success:
            self.successful_requests += 1
        else:
            self.failed_requests += 1
        
        # Update moving average for response time
        if self.average_response_time == 0.0:
            self.average_response_time = response_time
        else:
            self.average_response_time = (self.average_response_time * 0.9) + (response_time * 0.1)
        
        # Calculate error rate
        self.error_rate = self.failed_requests / self.total_requests
        
        # Calculate uptime percentage
        self.uptime_percentage = (self.successful_requests / self.total_requests) * 100
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'total_requests': self.total_requests,
            'successful_requests': self.successful_requests,
            'failed_requests': self.failed_requests,
            'average_response_time': self.average_response_time,
            'last_used': self.last_used.isoformat() if self.last_used else None,
            'uptime_percentage': self.uptime_percentage,
            'error_rate': self.error_rate,
            'throughput': self.throughput
        }


@dataclass
class MCPOperation:
    """Represents an operation to be performed via MCP servers"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    operation_type: OperationType = OperationType.READ
    description: str = ""
    parameters: Dict[str, Any] = field(default_factory=dict)
    context: Dict[str, Any] = field(default_factory=dict)
    priority: int = 1
    timeout: float = 30.0
    retry_count: int = 0
    max_retries: int = 3
    
    # Server routing
    preferred_servers: List[ServerType] = field(default_factory=list)
    fallback_servers: List[ServerType] = field(default_factory=list)
    
    # Results
    result: Optional[Any] = None
    error: Optional[str] = None
    execution_time: float = 0.0
    server_used: Optional[ServerType] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'operation_type': self.operation_type.value,
            'description': self.description,
            'parameters': self.parameters,
            'context': self.context,
            'priority': self.priority,
            'timeout': self.timeout,
            'retry_count': self.retry_count,
            'max_retries': self.max_retries,
            'preferred_servers': [s.value for s in self.preferred_servers],
            'fallback_servers': [s.value for s in self.fallback_servers],
            'result': self.result,
            'error': self.error,
            'execution_time': self.execution_time,
            'server_used': self.server_used.value if self.server_used else None
        }


class MCPIntegrationEngine:
    """
    Main engine for coordinating MCP server operations with intelligent routing
    """
    
    def __init__(self):
        self.servers: Dict[ServerType, ServerMetrics] = {}
        self.capabilities: Dict[ServerType, List[ServerCapability]] = {}
        self.operation_queue: List[MCPOperation] = []
        self.active_operations: Dict[str, asyncio.Task] = {}
        self.routing_cache: Dict[str, ServerType] = {}
        self.performance_history: List[Dict[str, Any]] = []
        
        # Initialize server capabilities
        self._initialize_server_capabilities()
        
        # Initialize server metrics
        for server_type in ServerType:
            self.servers[server_type] = ServerMetrics()
        
        logger.info("MCP Integration Engine initialized")
    
    def _initialize_server_capabilities(self) -> None:
        """Initialize known capabilities for each MCP server"""
        
        # Filesystem server capabilities
        filesystem_caps = [
            ServerCapability(
                ServerType.FILESYSTEM, OperationType.READ,
                "Read files and directories with encoding handling",
                context_requirements={"path": "required"}
            ),
            ServerCapability(
                ServerType.FILESYSTEM, OperationType.WRITE,
                "Write and create files with proper encoding",
                context_requirements={"path": "required", "content": "required"}
            ),
            ServerCapability(
                ServerType.FILESYSTEM, OperationType.EXECUTE,
                "File system operations like move, search, create directories",
                context_requirements={"operation": "required"}
            )
        ]
        
        # Memory server capabilities
        memory_caps = [
            ServerCapability(
                ServerType.MEMORY, OperationType.READ,
                "Read knowledge graph entities and relations",
                context_requirements={"query": "optional"}
            ),
            ServerCapability(
                ServerType.MEMORY, OperationType.WRITE,
                "Create entities, relations, and observations",
                context_requirements={"entities": "required"}
            ),
            ServerCapability(
                ServerType.MEMORY, OperationType.ANALYZE,
                "Search and analyze knowledge graph patterns",
                context_requirements={"search_query": "required"}
            )
        ]
        
        # Sequential thinking server capabilities
        thinking_caps = [
            ServerCapability(
                ServerType.SEQUENTIAL_THINKING, OperationType.ANALYZE,
                "Complex multi-step reasoning and problem solving",
                context_requirements={"problem": "required", "total_thoughts": "optional"}
            ),
            ServerCapability(
                ServerType.SEQUENTIAL_THINKING, OperationType.TRANSFORM,
                "Structured thinking with revision and branching",
                context_requirements={"thought": "required"}
            )
        ]
        
        # Context7 server capabilities
        context7_caps = [
            ServerCapability(
                ServerType.CONTEXT7, OperationType.READ,
                "Fetch library documentation and resolve library IDs",
                context_requirements={"library_name": "required"}
            ),
            ServerCapability(
                ServerType.CONTEXT7, OperationType.ANALYZE,
                "Analyze library documentation and provide context",
                context_requirements={"library_id": "required", "topic": "optional"}
            )
        ]
        
        # Puppeteer server capabilities
        puppeteer_caps = [
            ServerCapability(
                ServerType.PUPPETEER, OperationType.READ,
                "Navigate web pages and capture screenshots",
                context_requirements={"url": "required"}
            ),
            ServerCapability(
                ServerType.PUPPETEER, OperationType.EXECUTE,
                "Interact with web pages - click, fill, select",
                context_requirements={"action": "required", "selector": "required"}
            ),
            ServerCapability(
                ServerType.PUPPETEER, OperationType.ANALYZE,
                "Execute JavaScript and analyze page content",
                context_requirements={"script": "required"}
            )
        ]
        
        # Fetch server capabilities
        fetch_caps = [
            ServerCapability(
                ServerType.FETCH, OperationType.READ,
                "Fetch web content with image processing",
                context_requirements={"url": "required"}
            ),
            ServerCapability(
                ServerType.FETCH, OperationType.TRANSFORM,
                "Convert web content to markdown with image handling",
                context_requirements={"url": "required", "enable_images": "optional"}
            )
        ]
        
        # Desktop Commander server capabilities
        desktop_caps = [
            ServerCapability(
                ServerType.DESKTOP_COMMANDER, OperationType.READ,
                "Read files and directories on desktop",
                context_requirements={"path": "required"}
            ),
            ServerCapability(
                ServerType.DESKTOP_COMMANDER, OperationType.WRITE,
                "Write files with chunking support",
                context_requirements={"path": "required", "content": "required"}
            ),
            ServerCapability(
                ServerType.DESKTOP_COMMANDER, OperationType.EXECUTE,
                "Execute terminal commands with safety controls",
                context_requirements={"command": "required"}
            ),
            ServerCapability(
                ServerType.DESKTOP_COMMANDER, OperationType.ANALYZE,
                "Search files and analyze code patterns",
                context_requirements={"search_pattern": "required"}
            )
        ]
        
        self.capabilities.update({
            ServerType.FILESYSTEM: filesystem_caps,
            ServerType.MEMORY: memory_caps,
            ServerType.SEQUENTIAL_THINKING: thinking_caps,
            ServerType.CONTEXT7: context7_caps,
            ServerType.PUPPETEER: puppeteer_caps,
            ServerType.FETCH: fetch_caps,
            ServerType.DESKTOP_COMMANDER: desktop_caps
        })
    
    def find_optimal_server(self, operation: MCPOperation) -> Optional[ServerType]:
        """Find the optimal server for an operation based on capabilities and performance"""
        
        # Create cache key for routing decisions
        cache_key = hashlib.md5(
            f"{operation.operation_type.value}_{str(sorted(operation.parameters.items()))}"
            .encode()
        ).hexdigest()
        
        # Check cache first
        if cache_key in self.routing_cache:
            cached_server = self.routing_cache[cache_key]
            if self._is_server_healthy(cached_server):
                return cached_server
        
        # Find servers that can handle this operation
        candidate_servers = []
        
        for server_type, capabilities in self.capabilities.items():
            for capability in capabilities:
                if capability.operation_type == operation.operation_type:
                    # Check if server meets context requirements
                    if self._meets_context_requirements(operation, capability):
                        score = self._calculate_server_score(server_type, capability)
                        candidate_servers.append((server_type, score))
        
        # Sort by score (descending)
        candidate_servers.sort(key=lambda x: x[1], reverse=True)
        
        # Consider preferred servers
        for preferred in operation.preferred_servers:
            for server_type, score in candidate_servers:
                if server_type == preferred:
                    self.routing_cache[cache_key] = server_type
                    return server_type
        
        # Return best scoring server
        if candidate_servers:
            best_server = candidate_servers[0][0]
            self.routing_cache[cache_key] = best_server
            return best_server
        
        return None
    
    def _meets_context_requirements(self, operation: MCPOperation, capability: ServerCapability) -> bool:
        """Check if operation context meets server capability requirements"""
        for req_key, req_type in capability.context_requirements.items():
            if req_type == "required" and req_key not in operation.context and req_key not in operation.parameters:
                return False
        return True
    
    def _calculate_server_score(self, server_type: ServerType, capability: ServerCapability) -> float:
        """Calculate a score for server selection based on performance and capability"""
        metrics = self.servers[server_type]
        
        # Base score from capability
        base_score = capability.performance_score
        
        # Performance factor (0.0 to 1.0)
        performance_factor = min(1.0, (100.0 - metrics.average_response_time) / 100.0)
        
        # Reliability factor (0.0 to 1.0)
        reliability_factor = (100.0 - metrics.error_rate) / 100.0
        
        # Availability factor (recent usage)
        availability_factor = 1.0
        if metrics.last_used:
            hours_since_use = (datetime.now() - metrics.last_used).total_seconds() / 3600
            availability_factor = max(0.1, 1.0 - (hours_since_use / 24.0))
        
        # Combined score
        score = (base_score * 0.3) + (performance_factor * 0.3) + (reliability_factor * 0.3) + (availability_factor * 0.1)
        
        return score
    
    def _is_server_healthy(self, server_type: ServerType) -> bool:
        """Check if a server is healthy and available"""
        metrics = self.servers[server_type]
        
        # Check error rate
        if metrics.error_rate > 0.5:  # More than 50% errors
            return False
        
        # Check if server has been used recently without major issues
        if metrics.last_used and metrics.total_requests > 10:
            if metrics.uptime_percentage < 80:
                return False
        
        return True
    
    async def execute_operation(self, operation: MCPOperation) -> Dict[str, Any]:
        """Execute an operation with intelligent server routing and fallbacks"""
        
        start_time = time.time()
        
        # Find optimal server
        server_type = self.find_optimal_server(operation)
        if not server_type:
            return {
                'success': False,
                'error': 'No suitable server found for operation',
                'operation_id': operation.id
            }
        
        # Try primary server
        try:
            result = await self._execute_on_server(operation, server_type)
            
            # Update metrics
            execution_time = time.time() - start_time
            self.servers[server_type].update_metrics(True, execution_time)
            
            operation.result = result
            operation.execution_time = execution_time
            operation.server_used = server_type
            
            return {
                'success': True,
                'result': result,
                'server_used': server_type.value,
                'execution_time': execution_time,
                'operation_id': operation.id
            }
            
        except Exception as e:
            # Update metrics for failure
            execution_time = time.time() - start_time
            self.servers[server_type].update_metrics(False, execution_time)
            
            # Try fallback servers
            for fallback_server in operation.fallback_servers:
                if fallback_server != server_type and self._is_server_healthy(fallback_server):
                    try:
                        result = await self._execute_on_server(operation, fallback_server)
                        
                        # Update metrics for successful fallback
                        fallback_time = time.time() - start_time
                        self.servers[fallback_server].update_metrics(True, fallback_time)
                        
                        operation.result = result
                        operation.execution_time = fallback_time
                        operation.server_used = fallback_server
                        
                        return {
                            'success': True,
                            'result': result,
                            'server_used': fallback_server.value,
                            'execution_time': fallback_time,
                            'operation_id': operation.id,
                            'fallback_used': True
                        }
                        
                    except Exception as fallback_error:
                        self.servers[fallback_server].update_metrics(False, time.time() - start_time)
                        continue
            
            # All servers failed
            operation.error = str(e)
            operation.execution_time = time.time() - start_time
            
            return {
                'success': False,
                'error': str(e),
                'server_attempted': server_type.value,
                'execution_time': time.time() - start_time,
                'operation_id': operation.id
            }
    
    async def _execute_on_server(self, operation: MCPOperation, server_type: ServerType) -> Any:
        """Execute operation on a specific server type"""
        
        # This would contain the actual MCP server calls
        # For now, we'll create a mapping structure
        
        if server_type == ServerType.FILESYSTEM:
            return await self._execute_filesystem_operation(operation)
        elif server_type == ServerType.MEMORY:
            return await self._execute_memory_operation(operation)
        elif server_type == ServerType.SEQUENTIAL_THINKING:
            return await self._execute_thinking_operation(operation)
        elif server_type == ServerType.CONTEXT7:
            return await self._execute_context7_operation(operation)
        elif server_type == ServerType.PUPPETEER:
            return await self._execute_puppeteer_operation(operation)
        elif server_type == ServerType.FETCH:
            return await self._execute_fetch_operation(operation)
        elif server_type == ServerType.DESKTOP_COMMANDER:
            return await self._execute_desktop_operation(operation)
        else:
            raise ValueError(f"Unknown server type: {server_type}")
    
    async def _execute_filesystem_operation(self, operation: MCPOperation) -> Any:
        """Execute filesystem operation"""
        # This would call the actual mcp__filesystem__ functions
        # For now, return a placeholder
        await asyncio.sleep(0.1)  # Simulate execution
        return f"Filesystem operation: {operation.description}"
    
    async def _execute_memory_operation(self, operation: MCPOperation) -> Any:
        """Execute memory operation"""
        # This would call the actual mcp__memory__ functions
        await asyncio.sleep(0.1)
        return f"Memory operation: {operation.description}"
    
    async def _execute_thinking_operation(self, operation: MCPOperation) -> Any:
        """Execute sequential thinking operation"""
        # This would call the actual mcp__sequential-thinking__ functions
        await asyncio.sleep(0.2)
        return f"Thinking operation: {operation.description}"
    
    async def _execute_context7_operation(self, operation: MCPOperation) -> Any:
        """Execute Context7 operation"""
        # This would call the actual mcp__context7__ functions
        await asyncio.sleep(0.1)
        return f"Context7 operation: {operation.description}"
    
    async def _execute_puppeteer_operation(self, operation: MCPOperation) -> Any:
        """Execute Puppeteer operation"""
        # This would call the actual mcp__puppeteer__ functions
        await asyncio.sleep(0.3)
        return f"Puppeteer operation: {operation.description}"
    
    async def _execute_fetch_operation(self, operation: MCPOperation) -> Any:
        """Execute Fetch operation"""
        # This would call the actual mcp__fetch__ functions
        await asyncio.sleep(0.2)
        return f"Fetch operation: {operation.description}"
    
    async def _execute_desktop_operation(self, operation: MCPOperation) -> Any:
        """Execute Desktop Commander operation"""
        # This would call the actual mcp__desktop-commander__ functions
        await asyncio.sleep(0.1)
        return f"Desktop operation: {operation.description}"
    
    def create_operation(self, operation_type: OperationType, description: str, 
                        parameters: Dict[str, Any], context: Dict[str, Any] = None) -> MCPOperation:
        """Create a new operation with intelligent server routing"""
        
        operation = MCPOperation(
            operation_type=operation_type,
            description=description,
            parameters=parameters,
            context=context or {}
        )
        
        # Suggest optimal servers based on operation type
        if operation_type == OperationType.READ:
            if 'path' in parameters or 'file' in parameters:
                operation.preferred_servers = [ServerType.FILESYSTEM, ServerType.DESKTOP_COMMANDER]
            elif 'url' in parameters:
                operation.preferred_servers = [ServerType.FETCH, ServerType.PUPPETEER]
            elif 'query' in parameters:
                operation.preferred_servers = [ServerType.MEMORY]
        
        elif operation_type == OperationType.WRITE:
            if 'path' in parameters or 'file' in parameters:
                operation.preferred_servers = [ServerType.FILESYSTEM, ServerType.DESKTOP_COMMANDER]
            elif 'entities' in parameters:
                operation.preferred_servers = [ServerType.MEMORY]
        
        elif operation_type == OperationType.EXECUTE:
            if 'command' in parameters:
                operation.preferred_servers = [ServerType.DESKTOP_COMMANDER]
            elif 'script' in parameters or 'selector' in parameters:
                operation.preferred_servers = [ServerType.PUPPETEER]
        
        elif operation_type == OperationType.ANALYZE:
            if 'problem' in parameters or 'thought' in parameters:
                operation.preferred_servers = [ServerType.SEQUENTIAL_THINKING]
            elif 'search_query' in parameters:
                operation.preferred_servers = [ServerType.MEMORY]
            elif 'library_name' in parameters:
                operation.preferred_servers = [ServerType.CONTEXT7]
        
        return operation
    
    def get_server_health_report(self) -> Dict[str, Any]:
        """Get comprehensive health report for all servers"""
        
        health_report = {
            'timestamp': datetime.now().isoformat(),
            'servers': {},
            'overall_health': 'healthy'
        }
        
        total_error_rate = 0
        healthy_servers = 0
        
        for server_type, metrics in self.servers.items():
            server_health = {
                'status': 'healthy' if self._is_server_healthy(server_type) else 'unhealthy',
                'metrics': metrics.to_dict(),
                'capabilities': [cap.to_dict() for cap in self.capabilities[server_type]]
            }
            
            health_report['servers'][server_type.value] = server_health
            
            total_error_rate += metrics.error_rate
            if self._is_server_healthy(server_type):
                healthy_servers += 1
        
        # Calculate overall health
        if healthy_servers == 0:
            health_report['overall_health'] = 'critical'
        elif healthy_servers < len(self.servers) * 0.5:
            health_report['overall_health'] = 'degraded'
        elif total_error_rate / len(self.servers) > 0.2:
            health_report['overall_health'] = 'warning'
        
        return health_report
    
    def optimize_routing(self) -> None:
        """Optimize server routing based on performance history"""
        
        # Clear cache for poorly performing routes
        routes_to_clear = []
        
        for cache_key, server_type in self.routing_cache.items():
            if not self._is_server_healthy(server_type):
                routes_to_clear.append(cache_key)
        
        for key in routes_to_clear:
            del self.routing_cache[key]
        
        # Update capability scores based on recent performance
        for server_type, metrics in self.servers.items():
            if metrics.total_requests > 10:
                performance_score = 1.0 - metrics.error_rate
                
                for capability in self.capabilities[server_type]:
                    capability.performance_score = (capability.performance_score * 0.7) + (performance_score * 0.3)
                    capability.reliability_score = metrics.uptime_percentage / 100.0
        
        logger.info("Server routing optimization completed")
    
    def save_state(self, filepath: str) -> None:
        """Save engine state to file"""
        state_data = {
            'servers': {k.value: v.to_dict() for k, v in self.servers.items()},
            'capabilities': {k.value: [cap.to_dict() for cap in caps] for k, caps in self.capabilities.items()},
            'routing_cache': {k: v.value for k, v in self.routing_cache.items()},
            'performance_history': self.performance_history,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(filepath, 'w') as f:
            json.dump(state_data, f, indent=2)
        
        logger.info(f"Engine state saved to {filepath}")


# High-level convenience functions
class MCPWorkflowBuilder:
    """High-level workflow builder for common MCP operations"""
    
    def __init__(self, engine: MCPIntegrationEngine):
        self.engine = engine
        self.workflows: Dict[str, List[MCPOperation]] = {}
    
    def create_file_analysis_workflow(self, file_path: str) -> List[MCPOperation]:
        """Create a workflow for comprehensive file analysis"""
        
        operations = [
            self.engine.create_operation(
                OperationType.READ,
                "Read file content",
                {"path": file_path}
            ),
            self.engine.create_operation(
                OperationType.ANALYZE,
                "Analyze file structure and patterns",
                {"search_pattern": "class|function|import", "path": file_path}
            ),
            self.engine.create_operation(
                OperationType.ANALYZE,
                "Perform security analysis",
                {"problem": f"Analyze {file_path} for security vulnerabilities"}
            )
        ]
        
        # Set dependencies
        operations[1].context = {"file_content": "from_previous"}
        operations[2].context = {"file_content": "from_previous"}
        
        return operations
    
    def create_web_research_workflow(self, url: str, topic: str) -> List[MCPOperation]:
        """Create a workflow for web research and documentation"""
        
        operations = [
            self.engine.create_operation(
                OperationType.READ,
                "Fetch web content",
                {"url": url, "enableFetchImages": True}
            ),
            self.engine.create_operation(
                OperationType.ANALYZE,
                "Analyze content for key insights",
                {"problem": f"Extract key insights about {topic} from the web content"}
            ),
            self.engine.create_operation(
                OperationType.WRITE,
                "Store insights in memory",
                {"entities": [{"name": topic, "entityType": "research_topic", "observations": ["from_analysis"]}]}
            )
        ]
        
        return operations
    
    def create_code_optimization_workflow(self, code_path: str) -> List[MCPOperation]:
        """Create a workflow for code optimization"""
        
        operations = [
            self.engine.create_operation(
                OperationType.READ,
                "Read code file",
                {"path": code_path}
            ),
            self.engine.create_operation(
                OperationType.ANALYZE,
                "Analyze code performance",
                {"problem": "Identify performance bottlenecks and optimization opportunities"}
            ),
            self.engine.create_operation(
                OperationType.TRANSFORM,
                "Generate optimized code",
                {"thought": "Create optimized version of the code"}
            ),
            self.engine.create_operation(
                OperationType.WRITE,
                "Write optimized code",
                {"path": code_path.replace(".py", "_optimized.py"), "content": "from_previous"}
            )
        ]
        
        return operations


# Example usage
async def main():
    """Example usage of the MCP Integration Engine"""
    
    # Initialize engine
    engine = MCPIntegrationEngine()
    
    # Create workflow builder
    builder = MCPWorkflowBuilder(engine)
    
    # Create a file analysis workflow
    file_operations = builder.create_file_analysis_workflow("/home/user/test.py")
    
    # Execute operations
    results = []
    for operation in file_operations:
        result = await engine.execute_operation(operation)
        results.append(result)
        print(f"Operation {operation.id}: {result}")
    
    # Get health report
    health_report = engine.get_server_health_report()
    print("\nServer Health Report:")
    print(json.dumps(health_report, indent=2))
    
    # Optimize routing
    engine.optimize_routing()
    
    # Save state
    engine.save_state("mcp_engine_state.json")


if __name__ == "__main__":
    asyncio.run(main())