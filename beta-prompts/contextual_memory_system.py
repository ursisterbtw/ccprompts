#!/usr/bin/env python3
"""
Contextual Memory Integration System
===================================

An intelligent system for managing contextual memory using the MCP memory server,
with automatic knowledge graph construction, semantic clustering, and adaptive context retrieval.

Features:
- Intelligent knowledge graph construction and management
- Semantic context clustering and retrieval
- Adaptive memory consolidation and pruning
- Context-aware prompt enhancement
- Real-time learning and knowledge updates
- Multi-dimensional similarity matching
- Automatic relationship discovery
"""

import asyncio
import json
import logging
import time
import hashlib
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Tuple, Set, Union
import uuid
from collections import defaultdict, deque
import numpy as np
import re
from pathlib import Path

logger = logging.getLogger(__name__)


class MemoryType(Enum):
    """Types of memory entities"""
    FACTUAL = "factual"
    PROCEDURAL = "procedural"
    EPISODIC = "episodic"
    SEMANTIC = "semantic"
    CONTEXTUAL = "contextual"
    PATTERN = "pattern"
    EXPERIENCE = "experience"


class RelationType(Enum):
    """Types of relationships between entities"""
    CONTAINS = "contains"
    RELATES_TO = "relates_to"
    DEPENDS_ON = "depends_on"
    SIMILAR_TO = "similar_to"
    CONTRADICTS = "contradicts"
    ENABLES = "enables"
    FOLLOWS = "follows"
    PRECEDES = "precedes"
    EXEMPLIFIES = "exemplifies"
    GENERALIZES = "generalizes"


class ContextScope(Enum):
    """Scope of context for retrieval"""
    LOCAL = "local"          # Immediate context
    DOMAIN = "domain"        # Domain-specific context
    GLOBAL = "global"        # Cross-domain context
    TEMPORAL = "temporal"    # Time-based context
    SEMANTIC = "semantic"    # Semantically related context


@dataclass
class MemoryEntity:
    """Represents a memory entity with metadata"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    entity_type: MemoryType = MemoryType.FACTUAL
    content: str = ""
    observations: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    # Temporal information
    created_at: datetime = field(default_factory=datetime.now)
    last_accessed: datetime = field(default_factory=datetime.now)
    access_count: int = 0
    
    # Relevance scoring
    relevance_score: float = 1.0
    confidence_score: float = 1.0
    importance_score: float = 1.0
    
    # Relationships
    related_entities: Set[str] = field(default_factory=set)
    
    def update_access(self) -> None:
        """Update access information"""
        self.last_accessed = datetime.now()
        self.access_count += 1
    
    def calculate_recency_score(self) -> float:
        """Calculate recency score based on last access"""
        hours_since_access = (datetime.now() - self.last_accessed).total_seconds() / 3600
        return max(0.1, 1.0 / (1.0 + hours_since_access / 24.0))  # Decay over days
    
    def calculate_composite_score(self) -> float:
        """Calculate composite relevance score"""
        recency = self.calculate_recency_score()
        frequency = min(1.0, self.access_count / 100.0)  # Normalize to 0-1
        
        return (
            self.relevance_score * 0.4 +
            self.confidence_score * 0.3 +
            self.importance_score * 0.2 +
            recency * 0.05 +
            frequency * 0.05
        )
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'entity_type': self.entity_type.value,
            'content': self.content,
            'observations': self.observations,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'last_accessed': self.last_accessed.isoformat(),
            'access_count': self.access_count,
            'relevance_score': self.relevance_score,
            'confidence_score': self.confidence_score,
            'importance_score': self.importance_score,
            'related_entities': list(self.related_entities),
            'composite_score': self.calculate_composite_score()
        }


@dataclass
class MemoryRelation:
    """Represents a relationship between memory entities"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    from_entity: str = ""
    to_entity: str = ""
    relation_type: RelationType = RelationType.RELATES_TO
    strength: float = 1.0
    confidence: float = 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'from_entity': self.from_entity,
            'to_entity': self.to_entity,
            'relation_type': self.relation_type.value,
            'strength': self.strength,
            'confidence': self.confidence,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat()
        }


@dataclass
class ContextQuery:
    """Represents a context retrieval query"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    query_text: str = ""
    scope: ContextScope = ContextScope.LOCAL
    max_results: int = 10
    min_relevance: float = 0.3
    entity_types: List[MemoryType] = field(default_factory=list)
    temporal_window: Optional[timedelta] = None
    semantic_threshold: float = 0.5
    
    # Results
    retrieved_entities: List[MemoryEntity] = field(default_factory=list)
    retrieved_relations: List[MemoryRelation] = field(default_factory=list)
    context_summary: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'query_text': self.query_text,
            'scope': self.scope.value,
            'max_results': self.max_results,
            'min_relevance': self.min_relevance,
            'entity_types': [t.value for t in self.entity_types],
            'temporal_window': self.temporal_window.total_seconds() if self.temporal_window else None,
            'semantic_threshold': self.semantic_threshold,
            'retrieved_entities': [e.to_dict() for e in self.retrieved_entities],
            'retrieved_relations': [r.to_dict() for r in self.retrieved_relations],
            'context_summary': self.context_summary
        }


class ContextualMemorySystem:
    """
    Main system for contextual memory management with MCP integration
    """
    
    def __init__(self):
        self.entities: Dict[str, MemoryEntity] = {}
        self.relations: Dict[str, MemoryRelation] = {}
        self.entity_index: Dict[str, Set[str]] = defaultdict(set)  # Content -> entity IDs
        self.relation_index: Dict[str, Set[str]] = defaultdict(set)  # Entity ID -> relation IDs
        self.context_cache: Dict[str, Tuple[List[MemoryEntity], datetime]] = {}
        self.learning_patterns: Dict[str, List[float]] = defaultdict(list)
        
        # Configuration
        self.max_cache_size = 1000
        self.cache_ttl = timedelta(hours=1)
        self.consolidation_threshold = 100
        self.similarity_threshold = 0.8
        
        logger.info("Contextual Memory System initialized")
    
    async def add_entity(self, entity: MemoryEntity, update_mcp: bool = True) -> str:
        """Add an entity to the memory system"""
        
        # Store locally
        self.entities[entity.id] = entity
        
        # Update indices
        self._update_entity_index(entity)
        
        # Update MCP memory server if requested
        if update_mcp:
            await self._sync_entity_to_mcp(entity)
        
        logger.info(f"Added entity {entity.id}: {entity.name}")
        return entity.id
    
    async def add_relation(self, relation: MemoryRelation, update_mcp: bool = True) -> str:
        """Add a relationship to the memory system"""
        
        # Store locally
        self.relations[relation.id] = relation
        
        # Update indices
        self.relation_index[relation.from_entity].add(relation.id)
        self.relation_index[relation.to_entity].add(relation.id)
        
        # Update entity relationships
        if relation.from_entity in self.entities:
            self.entities[relation.from_entity].related_entities.add(relation.to_entity)
        if relation.to_entity in self.entities:
            self.entities[relation.to_entity].related_entities.add(relation.from_entity)
        
        # Update MCP memory server if requested
        if update_mcp:
            await self._sync_relation_to_mcp(relation)
        
        logger.info(f"Added relation {relation.id}: {relation.from_entity} -> {relation.to_entity}")
        return relation.id
    
    def _update_entity_index(self, entity: MemoryEntity) -> None:
        """Update the entity content index"""
        # Extract keywords from content and observations
        keywords = self._extract_keywords(entity.content)
        for obs in entity.observations:
            keywords.update(self._extract_keywords(obs))
        
        # Update index
        for keyword in keywords:
            self.entity_index[keyword].add(entity.id)
    
    def _extract_keywords(self, text: str) -> Set[str]:
        """Extract keywords from text"""
        # Simple keyword extraction (could be enhanced with NLP)
        words = re.findall(r'\b\w+\b', text.lower())
        # Filter out common words and short words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'}
        keywords = {word for word in words if len(word) > 2 and word not in stop_words}
        return keywords
    
    async def _sync_entity_to_mcp(self, entity: MemoryEntity) -> None:
        """Sync entity to MCP memory server"""
        # This would call the actual MCP memory functions
        # For now, this is a placeholder
        logger.debug(f"Syncing entity {entity.id} to MCP memory server")
    
    async def _sync_relation_to_mcp(self, relation: MemoryRelation) -> None:
        """Sync relation to MCP memory server"""
        # This would call the actual MCP memory functions
        # For now, this is a placeholder
        logger.debug(f"Syncing relation {relation.id} to MCP memory server")
    
    async def retrieve_context(self, query: ContextQuery) -> ContextQuery:
        """Retrieve contextual information based on a query"""
        
        # Check cache first
        cache_key = self._generate_cache_key(query)
        if cache_key in self.context_cache:
            cached_entities, cached_time = self.context_cache[cache_key]
            if datetime.now() - cached_time < self.cache_ttl:
                query.retrieved_entities = cached_entities
                logger.debug(f"Retrieved context from cache for query {query.id}")
                return query
        
        # Perform search
        candidate_entities = await self._search_entities(query)
        
        # Filter and rank results
        ranked_entities = self._rank_entities(candidate_entities, query)
        
        # Limit results
        query.retrieved_entities = ranked_entities[:query.max_results]
        
        # Retrieve related relations
        query.retrieved_relations = await self._get_related_relations(query.retrieved_entities)
        
        # Generate context summary
        query.context_summary = self._generate_context_summary(query)
        
        # Cache results
        self.context_cache[cache_key] = (query.retrieved_entities, datetime.now())
        self._cleanup_cache()
        
        # Update access patterns
        for entity in query.retrieved_entities:
            entity.update_access()
        
        logger.info(f"Retrieved {len(query.retrieved_entities)} entities for query {query.id}")
        return query
    
    def _generate_cache_key(self, query: ContextQuery) -> str:
        """Generate a cache key for a query"""
        key_data = f"{query.query_text}_{query.scope.value}_{query.max_results}_{query.min_relevance}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    async def _search_entities(self, query: ContextQuery) -> List[MemoryEntity]:
        """Search for entities matching the query"""
        
        candidates = set()
        query_keywords = self._extract_keywords(query.query_text)
        
        # Keyword-based search
        for keyword in query_keywords:
            if keyword in self.entity_index:
                candidates.update(self.entity_index[keyword])
        
        # Convert to entity objects
        candidate_entities = []
        for entity_id in candidates:
            if entity_id in self.entities:
                entity = self.entities[entity_id]
                
                # Filter by entity type if specified
                if query.entity_types and entity.entity_type not in query.entity_types:
                    continue
                
                # Filter by temporal window if specified
                if query.temporal_window:
                    age = datetime.now() - entity.created_at
                    if age > query.temporal_window:
                        continue
                
                candidate_entities.append(entity)
        
        # Add semantic similarity search (simplified)
        for entity in self.entities.values():
            if entity not in candidate_entities:
                similarity = self._calculate_semantic_similarity(query.query_text, entity.content)
                if similarity >= query.semantic_threshold:
                    candidate_entities.append(entity)
        
        return candidate_entities
    
    def _calculate_semantic_similarity(self, text1: str, text2: str) -> float:
        """Calculate semantic similarity between two texts"""
        # Simplified similarity calculation using keyword overlap
        keywords1 = self._extract_keywords(text1)
        keywords2 = self._extract_keywords(text2)
        
        if not keywords1 or not keywords2:
            return 0.0
        
        intersection = keywords1.intersection(keywords2)
        union = keywords1.union(keywords2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def _rank_entities(self, entities: List[MemoryEntity], query: ContextQuery) -> List[MemoryEntity]:
        """Rank entities by relevance to the query"""
        
        scored_entities = []
        
        for entity in entities:
            # Calculate relevance score
            relevance = self._calculate_relevance_score(entity, query)
            
            if relevance >= query.min_relevance:
                # Update entity relevance score
                entity.relevance_score = relevance
                scored_entities.append((entity, relevance))
        
        # Sort by relevance (descending)
        scored_entities.sort(key=lambda x: x[1], reverse=True)
        
        return [entity for entity, score in scored_entities]
    
    def _calculate_relevance_score(self, entity: MemoryEntity, query: ContextQuery) -> float:
        """Calculate relevance score for an entity given a query"""
        
        # Semantic similarity
        semantic_score = self._calculate_semantic_similarity(query.query_text, entity.content)
        
        # Observation relevance
        obs_scores = []
        for obs in entity.observations:
            obs_score = self._calculate_semantic_similarity(query.query_text, obs)
            obs_scores.append(obs_score)
        avg_obs_score = sum(obs_scores) / len(obs_scores) if obs_scores else 0.0
        
        # Entity composite score
        composite_score = entity.calculate_composite_score()
        
        # Scope-based weighting
        scope_weight = 1.0
        if query.scope == ContextScope.LOCAL:
            scope_weight = 1.2 if entity.entity_type in [MemoryType.CONTEXTUAL, MemoryType.EPISODIC] else 0.8
        elif query.scope == ContextScope.DOMAIN:
            scope_weight = 1.1 if entity.entity_type in [MemoryType.SEMANTIC, MemoryType.FACTUAL] else 0.9
        elif query.scope == ContextScope.GLOBAL:
            scope_weight = 1.0  # No preference
        
        # Combine scores
        relevance = (
            semantic_score * 0.4 +
            avg_obs_score * 0.3 +
            composite_score * 0.3
        ) * scope_weight
        
        return min(1.0, relevance)
    
    async def _get_related_relations(self, entities: List[MemoryEntity]) -> List[MemoryRelation]:
        """Get relations involving the retrieved entities"""
        
        related_relations = []
        entity_ids = {entity.id for entity in entities}
        
        for entity_id in entity_ids:
            if entity_id in self.relation_index:
                for relation_id in self.relation_index[entity_id]:
                    if relation_id in self.relations:
                        relation = self.relations[relation_id]
                        # Include relation if both entities are in our result set
                        if relation.from_entity in entity_ids and relation.to_entity in entity_ids:
                            related_relations.append(relation)
        
        return related_relations
    
    def _generate_context_summary(self, query: ContextQuery) -> str:
        """Generate a summary of the retrieved context"""
        
        if not query.retrieved_entities:
            return "No relevant context found."
        
        # Group entities by type
        type_groups = defaultdict(list)
        for entity in query.retrieved_entities:
            type_groups[entity.entity_type].append(entity)
        
        summary_parts = []
        
        for entity_type, entities in type_groups.items():
            count = len(entities)
            summary_parts.append(f"{count} {entity_type.value} entit{'y' if count == 1 else 'ies'}")
        
        summary = f"Retrieved {', '.join(summary_parts)} related to '{query.query_text}'"
        
        # Add key insights
        if query.retrieved_relations:
            summary += f" with {len(query.retrieved_relations)} interconnections"
        
        return summary
    
    def _cleanup_cache(self) -> None:
        """Clean up expired cache entries"""
        if len(self.context_cache) <= self.max_cache_size:
            return
        
        # Remove expired entries
        current_time = datetime.now()
        expired_keys = [
            key for key, (entities, cached_time) in self.context_cache.items()
            if current_time - cached_time > self.cache_ttl
        ]
        
        for key in expired_keys:
            del self.context_cache[key]
        
        # Remove oldest entries if still over limit
        if len(self.context_cache) > self.max_cache_size:
            sorted_cache = sorted(
                self.context_cache.items(),
                key=lambda x: x[1][1]  # Sort by cached time
            )
            
            entries_to_remove = len(self.context_cache) - self.max_cache_size
            for key, _ in sorted_cache[:entries_to_remove]:
                del self.context_cache[key]
    
    async def consolidate_memory(self) -> Dict[str, Any]:
        """Consolidate memory by merging similar entities and strengthening relationships"""
        
        consolidation_report = {
            'timestamp': datetime.now().isoformat(),
            'entities_before': len(self.entities),
            'relations_before': len(self.relations),
            'merged_entities': 0,
            'strengthened_relations': 0,
            'pruned_entities': 0
        }
        
        # Find similar entities for consolidation
        entities_to_merge = await self._find_similar_entities()
        
        for primary_id, similar_ids in entities_to_merge.items():
            if primary_id in self.entities:
                await self._merge_entities(primary_id, similar_ids)
                consolidation_report['merged_entities'] += len(similar_ids)
        
        # Strengthen frequently co-occurring relationships
        strengthened = await self._strengthen_relationships()
        consolidation_report['strengthened_relations'] = strengthened
        
        # Prune low-relevance entities
        pruned = await self._prune_entities()
        consolidation_report['pruned_entities'] = pruned
        
        consolidation_report['entities_after'] = len(self.entities)
        consolidation_report['relations_after'] = len(self.relations)
        
        logger.info(f"Memory consolidation completed: {consolidation_report}")
        return consolidation_report
    
    async def _find_similar_entities(self) -> Dict[str, List[str]]:
        """Find entities that are similar enough to be merged"""
        
        entities_to_merge = {}
        processed = set()
        
        for entity_id, entity in self.entities.items():
            if entity_id in processed:
                continue
            
            similar_entities = []
            
            for other_id, other_entity in self.entities.items():
                if other_id == entity_id or other_id in processed:
                    continue
                
                # Check similarity
                similarity = self._calculate_semantic_similarity(entity.content, other_entity.content)
                
                if similarity >= self.similarity_threshold:
                    similar_entities.append(other_id)
                    processed.add(other_id)
            
            if similar_entities:
                entities_to_merge[entity_id] = similar_entities
                processed.add(entity_id)
        
        return entities_to_merge
    
    async def _merge_entities(self, primary_id: str, similar_ids: List[str]) -> None:
        """Merge similar entities into the primary entity"""
        
        if primary_id not in self.entities:
            return
        
        primary_entity = self.entities[primary_id]
        
        for similar_id in similar_ids:
            if similar_id not in self.entities:
                continue
            
            similar_entity = self.entities[similar_id]
            
            # Merge observations
            primary_entity.observations.extend(similar_entity.observations)
            
            # Merge metadata
            primary_entity.metadata.update(similar_entity.metadata)
            
            # Update scores (weighted average)
            total_access = primary_entity.access_count + similar_entity.access_count
            if total_access > 0:
                primary_entity.relevance_score = (
                    (primary_entity.relevance_score * primary_entity.access_count +
                     similar_entity.relevance_score * similar_entity.access_count) / total_access
                )
                primary_entity.confidence_score = (
                    (primary_entity.confidence_score * primary_entity.access_count +
                     similar_entity.confidence_score * similar_entity.access_count) / total_access
                )
            
            # Update access information
            primary_entity.access_count += similar_entity.access_count
            primary_entity.last_accessed = max(primary_entity.last_accessed, similar_entity.last_accessed)
            
            # Merge relationships
            primary_entity.related_entities.update(similar_entity.related_entities)
            
            # Update relations to point to primary entity
            for relation_id in list(self.relation_index.get(similar_id, [])):
                if relation_id in self.relations:
                    relation = self.relations[relation_id]
                    if relation.from_entity == similar_id:
                        relation.from_entity = primary_id
                        self.relation_index[primary_id].add(relation_id)
                    if relation.to_entity == similar_id:
                        relation.to_entity = primary_id
                        self.relation_index[primary_id].add(relation_id)
            
            # Remove similar entity
            del self.entities[similar_id]
            if similar_id in self.relation_index:
                del self.relation_index[similar_id]
            
            # Update entity index
            for keyword_set in self.entity_index.values():
                if similar_id in keyword_set:
                    keyword_set.remove(similar_id)
                    keyword_set.add(primary_id)
        
        # Update primary entity index
        self._update_entity_index(primary_entity)
        
        logger.info(f"Merged {len(similar_ids)} entities into {primary_id}")
    
    async def _strengthen_relationships(self) -> int:
        """Strengthen relationships that occur frequently"""
        
        strengthened_count = 0
        
        # Count relationship patterns
        relation_patterns = defaultdict(int)
        
        for relation in self.relations.values():
            pattern_key = f"{relation.from_entity}_{relation.relation_type.value}_{relation.to_entity}"
            relation_patterns[pattern_key] += 1
        
        # Strengthen relationships that occur frequently
        for relation in self.relations.values():
            pattern_key = f"{relation.from_entity}_{relation.relation_type.value}_{relation.to_entity}"
            frequency = relation_patterns[pattern_key]
            
            if frequency > 1:  # Multiple occurrences
                old_strength = relation.strength
                relation.strength = min(1.0, relation.strength + (frequency - 1) * 0.1)
                relation.confidence = min(1.0, relation.confidence + (frequency - 1) * 0.05)
                
                if relation.strength > old_strength:
                    strengthened_count += 1
        
        return strengthened_count
    
    async def _prune_entities(self) -> int:
        """Remove entities with very low relevance or access"""
        
        pruned_count = 0
        entities_to_remove = []
        
        for entity_id, entity in self.entities.items():
            # Prune criteria
            if (entity.access_count == 0 and 
                (datetime.now() - entity.created_at).days > 30):
                entities_to_remove.append(entity_id)
            elif (entity.calculate_composite_score() < 0.1 and
                  entity.access_count < 2):
                entities_to_remove.append(entity_id)
        
        for entity_id in entities_to_remove:
            # Remove from entities
            del self.entities[entity_id]
            
            # Remove from indices
            if entity_id in self.relation_index:
                # Remove related relations
                for relation_id in list(self.relation_index[entity_id]):
                    if relation_id in self.relations:
                        del self.relations[relation_id]
                del self.relation_index[entity_id]
            
            # Update entity index
            for keyword_set in self.entity_index.values():
                keyword_set.discard(entity_id)
            
            pruned_count += 1
        
        return pruned_count
    
    async def enhance_prompt_with_context(self, prompt: str, scope: ContextScope = ContextScope.LOCAL,
                                        max_context_entities: int = 5) -> str:
        """Enhance a prompt with relevant contextual information"""
        
        # Create context query
        query = ContextQuery(
            query_text=prompt,
            scope=scope,
            max_results=max_context_entities,
            min_relevance=0.4
        )
        
        # Retrieve context
        query = await self.retrieve_context(query)
        
        if not query.retrieved_entities:
            return prompt
        
        # Build context section
        context_parts = []
        context_parts.append("## Relevant Context:")
        
        for entity in query.retrieved_entities:
            context_parts.append(f"- **{entity.name}** ({entity.entity_type.value}): {entity.content}")
            
            # Add key observations
            if entity.observations:
                for obs in entity.observations[:2]:  # Limit to 2 observations
                    context_parts.append(f"  * {obs}")
        
        # Add relationship information
        if query.retrieved_relations:
            context_parts.append("\n## Relationships:")
            for relation in query.retrieved_relations[:3]:  # Limit to 3 relations
                from_name = self.entities.get(relation.from_entity, type('obj', (object,), {'name': 'Unknown'})).name
                to_name = self.entities.get(relation.to_entity, type('obj', (object,), {'name': 'Unknown'})).name
                context_parts.append(f"- {from_name} {relation.relation_type.value} {to_name}")
        
        # Combine context with original prompt
        enhanced_prompt = "\n".join(context_parts) + "\n\n## Task:\n" + prompt
        
        logger.info(f"Enhanced prompt with {len(query.retrieved_entities)} context entities")
        return enhanced_prompt
    
    def get_memory_statistics(self) -> Dict[str, Any]:
        """Get comprehensive memory system statistics"""
        
        entity_types = defaultdict(int)
        relation_types = defaultdict(int)
        access_counts = []
        composite_scores = []
        
        for entity in self.entities.values():
            entity_types[entity.entity_type.value] += 1
            access_counts.append(entity.access_count)
            composite_scores.append(entity.calculate_composite_score())
        
        for relation in self.relations.values():
            relation_types[relation.relation_type.value] += 1
        
        stats = {
            'timestamp': datetime.now().isoformat(),
            'total_entities': len(self.entities),
            'total_relations': len(self.relations),
            'entity_types': dict(entity_types),
            'relation_types': dict(relation_types),
            'cache_size': len(self.context_cache),
            'index_size': sum(len(entity_set) for entity_set in self.entity_index.values()),
            'performance_metrics': {
                'average_access_count': np.mean(access_counts) if access_counts else 0,
                'average_composite_score': np.mean(composite_scores) if composite_scores else 0,
                'median_composite_score': np.median(composite_scores) if composite_scores else 0
            }
        }
        
        return stats
    
    async def save_memory_state(self, filepath: str) -> None:
        """Save memory system state to file"""
        
        state_data = {
            'entities': {k: v.to_dict() for k, v in self.entities.items()},
            'relations': {k: v.to_dict() for k, v in self.relations.items()},
            'learning_patterns': dict(self.learning_patterns),
            'statistics': self.get_memory_statistics(),
            'timestamp': datetime.now().isoformat()
        }
        
        with open(filepath, 'w') as f:
            json.dump(state_data, f, indent=2)
        
        logger.info(f"Memory state saved to {filepath}")


# High-level convenience functions
class MemoryWorkflowBuilder:
    """High-level workflow builder for memory operations"""
    
    def __init__(self, memory_system: ContextualMemorySystem):
        self.memory_system = memory_system
    
    async def learn_from_conversation(self, conversation: List[Dict[str, str]]) -> Dict[str, Any]:
        """Learn from a conversation and extract knowledge"""
        
        entities_created = 0
        relations_created = 0
        
        for i, message in enumerate(conversation):
            role = message.get('role', 'user')
            content = message.get('content', '')
            
            # Create episodic memory for each message
            entity = MemoryEntity(
                name=f"conversation_message_{i}",
                entity_type=MemoryType.EPISODIC,
                content=content,
                metadata={
                    'role': role,
                    'sequence': i,
                    'conversation_id': f"conv_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                }
            )
            
            await self.memory_system.add_entity(entity)
            entities_created += 1
            
            # Create sequential relationships
            if i > 0:
                prev_entity_id = f"conversation_message_{i-1}"
                relation = MemoryRelation(
                    from_entity=prev_entity_id,
                    to_entity=entity.id,
                    relation_type=RelationType.FOLLOWS,
                    strength=1.0
                )
                
                await self.memory_system.add_relation(relation)
                relations_created += 1
        
        return {
            'entities_created': entities_created,
            'relations_created': relations_created,
            'conversation_length': len(conversation)
        }
    
    async def create_knowledge_domain(self, domain_name: str, 
                                    facts: List[str], 
                                    procedures: List[str]) -> Dict[str, Any]:
        """Create a knowledge domain with facts and procedures"""
        
        # Create domain entity
        domain_entity = MemoryEntity(
            name=domain_name,
            entity_type=MemoryType.SEMANTIC,
            content=f"Knowledge domain: {domain_name}",
            metadata={'domain_type': 'knowledge_base'}
        )
        
        domain_id = await self.memory_system.add_entity(domain_entity)
        
        entities_created = 1
        relations_created = 0
        
        # Add facts
        for i, fact in enumerate(facts):
            fact_entity = MemoryEntity(
                name=f"{domain_name}_fact_{i}",
                entity_type=MemoryType.FACTUAL,
                content=fact,
                metadata={'domain': domain_name, 'type': 'fact'}
            )
            
            fact_id = await self.memory_system.add_entity(fact_entity)
            entities_created += 1
            
            # Link to domain
            relation = MemoryRelation(
                from_entity=domain_id,
                to_entity=fact_id,
                relation_type=RelationType.CONTAINS,
                strength=1.0
            )
            
            await self.memory_system.add_relation(relation)
            relations_created += 1
        
        # Add procedures
        for i, procedure in enumerate(procedures):
            proc_entity = MemoryEntity(
                name=f"{domain_name}_procedure_{i}",
                entity_type=MemoryType.PROCEDURAL,
                content=procedure,
                metadata={'domain': domain_name, 'type': 'procedure'}
            )
            
            proc_id = await self.memory_system.add_entity(proc_entity)
            entities_created += 1
            
            # Link to domain
            relation = MemoryRelation(
                from_entity=domain_id,
                to_entity=proc_id,
                relation_type=RelationType.CONTAINS,
                strength=1.0
            )
            
            await self.memory_system.add_relation(relation)
            relations_created += 1
        
        return {
            'domain_id': domain_id,
            'entities_created': entities_created,
            'relations_created': relations_created
        }


# Example usage
async def main():
    """Example usage of the Contextual Memory System"""
    
    # Initialize system
    memory_system = ContextualMemorySystem()
    workflow = MemoryWorkflowBuilder(memory_system)
    
    # Create a knowledge domain
    domain_result = await workflow.create_knowledge_domain(
        "Python Programming",
        [
            "Python is a high-level programming language",
            "Python uses indentation to define code blocks",
            "Python supports multiple programming paradigms"
        ],
        [
            "To create a function, use the 'def' keyword",
            "To import a module, use the 'import' statement",
            "To handle exceptions, use try-except blocks"
        ]
    )
    
    print("Knowledge Domain Creation:")
    print(json.dumps(domain_result, indent=2))
    
    # Simulate a conversation
    conversation = [
        {"role": "user", "content": "How do I create a function in Python?"},
        {"role": "assistant", "content": "To create a function in Python, use the 'def' keyword followed by the function name and parameters."},
        {"role": "user", "content": "Can you show me an example?"},
        {"role": "assistant", "content": "Sure! Here's an example: def greet(name): return f'Hello, {name}!'"}
    ]
    
    conversation_result = await workflow.learn_from_conversation(conversation)
    
    print("\nConversation Learning:")
    print(json.dumps(conversation_result, indent=2))
    
    # Test context retrieval
    query = ContextQuery(
        query_text="Python function creation",
        scope=ContextScope.DOMAIN,
        max_results=5
    )
    
    enhanced_query = await memory_system.retrieve_context(query)
    
    print("\nContext Retrieval:")
    print(f"Query: {query.query_text}")
    print(f"Summary: {enhanced_query.context_summary}")
    print(f"Retrieved {len(enhanced_query.retrieved_entities)} entities")
    
    # Test prompt enhancement
    original_prompt = "Explain how to create and use functions in Python"
    enhanced_prompt = await memory_system.enhance_prompt_with_context(original_prompt)
    
    print("\nPrompt Enhancement:")
    print("Original:", original_prompt)
    print("\nEnhanced:")
    print(enhanced_prompt)
    
    # Get statistics
    stats = memory_system.get_memory_statistics()
    print("\nMemory Statistics:")
    print(json.dumps(stats, indent=2))
    
    # Save state
    await memory_system.save_memory_state("memory_system_state.json")


if __name__ == "__main__":
    asyncio.run(main())