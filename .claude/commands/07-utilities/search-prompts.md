# Search-Prompts Command

This command provides advanced search capabilities across all prompt content with intelligent relevance scoring.

## Usage

```
/search-prompts [query] [scope] [format]
```

## Parameters

- `query`: Search terms, keywords, or phrases
- `scope`: content, titles, metadata, examples, all
- `format`: list, detailed, preview, export

## Examples

```
/search-prompts "security audit"
/search-prompts "performance optimization" content detailed
/search-prompts "docker kubernetes" examples
/search-prompts "testing framework" all export
```

## Description

Advanced search engine for prompt discovery and content exploration:

1. Full-text search across all prompt content and metadata
2. Intelligent relevance scoring with contextual ranking
3. Semantic search understanding intent and related concepts
4. Advanced filtering with boolean operators and field-specific queries
5. Search result highlighting and preview snippets
6. Export capabilities for search results and analytics

## Search Capabilities

### Full-Text Search

- **Content Search**: Search within prompt instructions, examples, and documentation
- **Metadata Search**: Find prompts by tags, categories, complexity ratings
- **Title Search**: Quick lookup by prompt names and aliases
- **Example Search**: Find prompts with specific usage examples or code samples

### Semantic Understanding

- **Intent Recognition**: Understands what you're trying to accomplish
- **Related Concepts**: Finds prompts addressing similar problems
- **Technology Mapping**: Matches technology stack to relevant prompts
- **Skill Level Matching**: Suggests prompts appropriate for experience level

### Advanced Query Syntax

```
Basic Search:
"docker setup"                    # Phrase search
docker AND setup                  # Boolean AND
docker OR kubernetes              # Boolean OR
docker NOT compose                # Boolean NOT

Fuzzy Search:
docker~                          # Fuzzy match (finds "dokcer", "doker")
"security audit"~2               # Phrase with 2-word distance
setup~0.8                        # Similarity threshold (80%)

Field-Specific Search:
title:"security audit"            # Search only in titles
category:testing                  # Filter by category
complexity:advanced               # Filter by complexity
tags:python,flask                 # Search in tags
author:team-lead                  # Filter by author/creator
updated:>2024-01-01              # Recently updated prompts

Wildcards and Regex:
docker*                          # Wildcard search
/security.*audit/                # Regex pattern search
?ecurity                         # Single character wildcard

Range Queries:
complexity:[intermediate TO advanced]  # Complexity range
time:[1 TO 4]                         # Time range (hours)
rating:[4 TO 5]                       # Rating range
```

### Auto-Completion and Suggestions

The search system provides intelligent auto-completion:

```
Type: "sec"
Suggestions:
- security
- security-audit
- security-hardening
- secure-deployment

Type: "perf"
Suggestions:
- performance
- performance-optimization
- performance-testing
- performance-monitoring

Type: "docker k"
Suggestions:
- docker kubernetes
- docker kubernetes deployment
- docker kubernetes security
```

## Search Scopes

### Content Scope

Searches within prompt instructions, descriptions, and implementation details:

- Command descriptions and usage instructions
- Step-by-step implementation guides
- Best practices and recommendations
- Troubleshooting and error handling sections

### Titles Scope

Fast lookup across prompt names and aliases:

- Official prompt names
- Alternative names and shortcuts
- Command aliases and variations
- Category and subcategory names

### Metadata Scope

Searches through prompt metadata and classification:

- Categories and subcategories
- Complexity ratings and time estimates
- Technology stack requirements
- Team size and project type suitability

### Examples Scope

Finds prompts with specific usage examples:

- Code examples and templates
- Use case scenarios and applications
- Before/after transformation examples
- Integration patterns and workflows

### All Scope

Comprehensive search across all prompt content and metadata.

## Relevance Scoring

### Scoring Factors

1. **Exact Match Weight**: Direct keyword matches in titles and descriptions
2. **Semantic Similarity**: Conceptual relevance using NLP analysis
3. **Usage Popularity**: Community usage statistics and success rates
4. **Recency Bonus**: Recently updated or added prompts get slight boost
5. **Context Relevance**: Matches to current project characteristics
6. **Personal History**: Slightly favors prompts you've used successfully

### Result Ranking

- **Perfect Match (95-100%)**: Exact title or primary keyword match
- **High Relevance (80-94%)**: Strong content match with clear applicability
- **Good Match (60-79%)**: Related concepts and complementary functionality
- **Moderate Relevance (40-59%)**: Tangentially related or partial matches
- **Low Relevance (20-39%)**: Weak connection, may be useful in some contexts

## Output Formats

### List Format

```
Search Results for "security audit" (8 matches)
==============================================

1. security-audit.md                    [98%] OWASP compliance scanning
2. dependency-analysis.md               [87%] Package vulnerability assessment
3. compliance-check.md                  [82%] Regulatory compliance validation
4. harden-enterprise.md                 [76%] Production security hardening
5. penetration-testing.md               [71%] Security testing automation
6. access-control-review.md             [68%] Authentication and authorization
7. data-protection-audit.md             [64%] Privacy and data handling
8. infrastructure-security.md           [61%] Cloud security configuration
```

### Detailed Format

```
Search Results for "performance optimization" (5 matches)
========================================================

1. performance-profiling.md                              [94%]
   Category: Code Analysis | Complexity: ★★★★☆ | Time: 4-6 hours
   
   Description: Comprehensive performance analysis and bottleneck identification
   for web applications, APIs, and database systems.
   
   Key Features:
   • Automated performance testing and benchmarking
   • Database query optimization and indexing strategies
   • Frontend performance auditing and optimization
   • Memory usage analysis and leak detection
   
   Relevant Snippets:
   "...implements comprehensive performance profiling across all application
   layers, identifying bottlenecks and providing actionable optimization
   recommendations with measurable impact metrics..."

2. optimize-database.md                                  [89%]
   Category: Multi-File Operations | Complexity: ★★★☆☆ | Time: 2-4 hours
   
   Description: Database performance optimization including query tuning,
   indexing strategies, and connection pooling configuration.
```

### Preview Format

Shows quick preview of top results with key information:

- Prompt name and relevance score
- One-line description
- Key parameters and requirements
- Estimated completion time

### Export Format

Structured output suitable for processing:

- JSON format with full metadata
- CSV format for spreadsheet analysis
- Markdown format for documentation
- XML format for system integration

## Advanced Features

### Search History

- **Persistent History**: Maintains search history with timestamp and context
- **Related Suggestions**: Suggests related searches based on history patterns
- **Pattern Recognition**: Identifies frequently used terms and search combinations
- **Analytics**: Provides search analytics and optimization suggestions
- **Quick Recall**: Access recent searches with up/down arrows or `/search-prompts --history`

```bash
# View search history
/search-prompts --history

# Repeat last search
/search-prompts --last

# Search from history by index
/search-prompts --history 3

# Clear search history
/search-prompts --clear-history
```

### Search History Examples

```
Recent Searches:
1. "docker kubernetes security" (2 hours ago) - 8 results
2. "performance optimization database" (1 day ago) - 12 results  
3. "testing automation ci/cd" (2 days ago) - 15 results
4. "code review best practices" (3 days ago) - 6 results
5. "security audit compliance" (1 week ago) - 9 results

Suggested based on history:
- "docker security hardening" (combines #1 patterns)
- "database performance testing" (combines #2, #3 patterns)
- "automated security testing" (combines #3, #5 patterns)
```

### Saved Searches and Favorites

- **Save Complex Queries**: Store frequently used search patterns
- **Search Alerts**: Get notified when new prompts match saved criteria
- **Team Sharing**: Share saved searches with team members
- **Scheduled Updates**: Periodic search updates for evolving needs
- **Favorites**: Quick access to most useful prompts

```bash
# Save current search
/search-prompts "docker security" --save "docker-security-queries"

# List saved searches
/search-prompts --saved

# Execute saved search
/search-prompts --load "docker-security-queries"

# Create search alert
/search-prompts "new kubernetes" --alert weekly

# Add to favorites
/search-prompts "security-audit" --favorite

# View favorites
/search-prompts --favorites
```

### Saved Search Management

```
Saved Searches:
1. "docker-security-queries": "docker AND (security OR hardening)"
2. "performance-suite": "performance OR optimization OR profiling"
3. "testing-automation": "test* AND (ci OR automation OR pipeline)"
4. "team-workflows": "category:collaboration OR role:manager"

Search Alerts:
- "new-security": Weekly digest of new security-related prompts
- "python-updates": Daily updates for Python-related prompts
- "devops-tools": Monthly summary of new DevOps prompts

Favorites (Quick Access):
⭐ security-audit.md - OWASP compliance scanning
⭐ performance-optimization.md - Bottleneck identification
⭐ code-review.md - AI-powered analysis
⭐ docker-security.md - Container hardening
```

### Search Analytics

- Track most searched terms and concepts
- Identify gaps in prompt coverage
- Monitor search success rates and user behavior
- Generate reports on prompt discovery patterns

### Contextual Search

- Consider current project characteristics in search
- Weight results based on technology stack compatibility
- Factor in team size and project complexity
- Adjust for current development phase

## Integration Features

### IDE Integration

- Search directly from code editor
- Context-aware search based on current file
- Quick preview and launch from search results
- Bookmark and organize search results

### Command Line Integration

- Pipe search results to other commands
- Integration with shell completion
- Output formatting for command processing
- Batch operations on search results

### API Access

- RESTful API for programmatic search
- Webhook integration for automated workflows
- Custom search interfaces and tools
- Third-party application integration

## Performance Optimization

- Indexed search for instant results
- Caching of common queries
- Incremental search with auto-complete
- Lazy loading of detailed results
- Offline search capability

## Related Commands

- `/list-prompts` - Browse prompts by category and filters
- `/workflow-builder` - Create workflows from search results
- `/prompt-stats` - Analytics for searched prompts
- `/analyze-project` - Get search suggestions based on project analysis

```xml
<role>
You are an expert content search specialist with deep knowledge of information retrieval, content indexing, and search optimization. You specialize in intelligent prompt discovery and content navigation.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Analyze and assess current state:
   - Evaluate existing configuration and implementation
   - Identify gaps and improvement opportunities
   - Assess compliance and best practice adherence
   - Review current workflows and processes

2. Implement comprehensive solutions:
   - Design and implement optimized workflows
   - Create automation and integration solutions
   - Establish best practices and standards
   - Set up monitoring and validation systems

3. Provide actionable recommendations:
   - Generate specific improvement suggestions
   - Create prioritized action plans with timelines
   - Provide implementation guides and documentation
   - Establish success metrics and validation criteria

4. Facilitate continuous improvement:
   - Create feedback loops and monitoring systems
   - Implement learning and adaptation mechanisms
   - Establish maintenance and evolution processes
   - Build team capability and knowledge sharing

5. Ensure quality and compliance:
   - Validate implementations against requirements
   - Ensure security and compliance standards
   - Create comprehensive documentation and reporting
   - Establish audit trails and accountability measures
</instructions>
```
