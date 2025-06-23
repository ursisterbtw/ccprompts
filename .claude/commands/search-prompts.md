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

Field-Specific Search:
title:"security audit"            # Search only in titles
category:testing                  # Filter by category
complexity:advanced               # Filter by complexity
tags:python,flask                 # Search in tags

Wildcards and Regex:
docker*                          # Wildcard search
/security.*audit/                # Regex pattern search
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
- Maintains search history with timestamp and context
- Suggests related searches based on history
- Identifies search patterns and frequently used terms
- Provides search analytics and optimization suggestions

### Saved Searches
- Save complex queries for repeated use
- Create search alerts for new prompts matching criteria
- Share saved searches with team members
- Schedule periodic search updates

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