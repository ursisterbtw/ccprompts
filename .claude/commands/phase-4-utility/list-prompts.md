# /list-prompts - Command Discovery and Browsing

## Command Overview
**Phase**: Utility (Phase 4)  
**Purpose**: Intelligent command discovery with filtering and search capabilities  
**Complexity**: Medium  
**Estimated Time**: 2-5 minutes  

## Description
The `/list-prompts` command provides comprehensive discovery of all 38 commands in the ccprompts ecosystem. It offers intelligent filtering, search capabilities, and detailed command information to help users find the right command for their needs.

## Usage Patterns
```bash
# Basic command listing
/list-prompts

# Filter by phase
/list-prompts phase-1-category
/list-prompts workflow

# Filter by complexity
/list-prompts complexity low
/list-prompts complexity medium

# Search by keywords
/list-prompts search security
/list-prompts search "performance optimization"

# Combine filters
/list-prompts phase-1 complexity medium
/list-prompts security high-priority
```

## Parameters

### phase (optional)
- **Type**: string
- **Options**: `category`, `workflow`, `context-aware`, `utility`, `lifecycle`, `learning`, `specialized`
- **Default**: all phases
- **Description**: Filter commands by development phase

### complexity (optional)
- **Type**: string  
- **Options**: `low`, `medium`, `high`
- **Description**: Filter by command complexity level

### search (optional)
- **Type**: string
- **Description**: Search commands by name, description, or functionality

### format (optional)
- **Type**: string
- **Options**: `list`, `detailed`, `table`, `json`
- **Default**: `detailed`
- **Description**: Output format for command listing

### category (optional)
- **Type**: string
- **Options**: `initialization`, `analysis`, `refactoring`, `testing`, `documentation`, `deployment`, `security`, `collaboration`
- **Description**: Filter by functional category

## Command Implementation

<role>Command Discovery Specialist</role>

<activation>
When the user invokes `/list-prompts` with optional parameters, analyze their intent and provide an intelligent, well-organized listing of available commands that matches their criteria.
</activation>

<instructions>
1. **Parameter Analysis**:
   - Parse and validate all provided parameters
   - Handle abbreviated phase names (e.g., "category" for "phase-1-category")
   - Interpret search terms for broader matching
   - Apply intelligent defaults for missing parameters

2. **Command Discovery**:
   - Load the complete command registry
   - Apply all specified filters in logical order
   - Rank results by relevance to search terms
   - Include dependency information for complex commands

3. **Intelligent Filtering**:
   - **Phase Filtering**: Show commands from specified development phases
   - **Complexity Filtering**: Match user's skill level and available time
   - **Search Filtering**: Use fuzzy matching for command names and descriptions
   - **Category Filtering**: Group by functional areas (security, testing, etc.)

4. **Output Generation**:
   - **List Format**: Simple command names with one-line descriptions
   - **Detailed Format**: Full descriptions, parameters, and usage examples
   - **Table Format**: Structured comparison of commands
   - **JSON Format**: Machine-readable output for automation

5. **Enhancement Features**:
   - Show command dependencies and suggested workflows
   - Highlight recently used or popular commands
   - Provide usage time estimates for planning
   - Include links to related commands and documentation

6. **User Guidance**:
   - Suggest related commands based on current search
   - Provide tips for effective command usage
   - Recommend learning paths for skill development
   - Include examples of common command combinations
</instructions>

<output_format>
# Available Commands

## Search Results
{If search parameters were provided, show search summary}

## Commands by Phase

### {Phase Name} ({count} commands)
{Phase description}

**{command-name}** - {description}
- **Complexity**: {level}
- **Time**: {estimated_time}
- **Dependencies**: {dependencies if any}
- **Usage**: `/{command-name} {common_params}`

{Repeat for each matching command}

## Recommended Next Steps
{Based on the user's search, suggest:}
- Related commands to explore
- Typical workflow combinations
- Learning resources for unfamiliar commands
- Tips for effective usage

## Quick Reference
```bash
# Most common commands for new users
/bootstrap-project    # Start new projects
/analyze-project     # Understand existing code
/code-review         # Quality analysis
/test               # Generate tests

# Discovery commands
/list-prompts search {keyword}
/help {command-name}
```

{If format=json, provide structured JSON output instead}
</output_format>

## Related Commands
- `/search-prompts` - Advanced search with filters
- `/help` - Detailed help for specific commands
- `/workflow-builder` - Create custom command sequences
- `/prompt-stats` - Usage analytics and insights

## Implementation Notes
- Uses CommandRegistry for real-time command discovery
- Supports fuzzy search for improved user experience
- Caches command metadata for fast response times
- Integrates with team knowledge base for personalized recommendations

## Examples

### Basic Listing
```bash
/list-prompts
# Shows all commands organized by phase with brief descriptions
```

### Security-Focused Search
```bash
/list-prompts search security
# Returns: audit-security, harden, comply, incident-response
```

### Beginner-Friendly Commands
```bash
/list-prompts complexity low
# Shows simple commands suitable for new users
```

### Development Workflow Commands
```bash
/list-prompts phase-1-category format table
# Table showing all core development commands
```