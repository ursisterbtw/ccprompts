---
deprecated: true
alias_of: ../../07-utilities/list-prompts.md
---
**DEPRECATED:** This duplicate command has been superseded by the canonical version in `/07-utilities/list-prompts.md`.

# List-Prompts Command

This command provides comprehensive browsing and filtering of available prompts with advanced categorization.

## Usage

```
/list-prompts [category] [filter]
```

## Parameters

- `category`: all, initialization, analysis, refactoring, testing, documentation, git, multi-file, mcp, build, security
- `filter`: recent, popular, advanced, beginner, enterprise, quick-win

## Examples

```
/list-prompts
/list-prompts testing
/list-prompts security advanced
/list-prompts all recent
```

## Description

Provides intelligent prompt discovery and navigation:

1. Lists all available prompts with metadata and descriptions
2. Supports advanced filtering by category, complexity, and usage patterns
3. Shows prompt relationships and recommended sequences
4. Displays usage statistics and effectiveness ratings
5. Provides quick preview of prompt capabilities
6. Enables rapid navigation to specific prompts

## Browsing Categories

### By Development Stage

- **Project Setup**: Bootstrap, initialization, and configuration prompts
- **Development**: Active coding, refactoring, and feature development
- **Quality Assurance**: Testing, security, and compliance prompts
- **Deployment**: CI/CD, infrastructure, and release management
- **Maintenance**: Monitoring, optimization, and legacy modernization

### By Complexity Level

- **Beginner**: Simple, single-purpose prompts with clear instructions
- **Intermediate**: Multi-step prompts requiring some technical knowledge
- **Advanced**: Complex workflows requiring deep technical expertise
- **Enterprise**: Comprehensive prompts for large-scale operations

### By Time Investment

- **Quick Wins**: 15-60 minutes, immediate impact
- **Short Projects**: 2-8 hours, focused improvements
- **Strategic Initiatives**: 1-5 days, comprehensive changes
- **Long-term Programs**: 1+ weeks, major transformations

### By Team Size

- **Solo Developer**: Individual productivity and learning focused
- **Small Team**: 2-10 developers, coordination and standards
- **Medium Team**: 10-50 developers, process and governance
- **Enterprise**: 50+ developers, compliance and scale

## Output Format

### Standard List View

```
Available Claude Code Prompts (42 total)
==========================================

PROJECT INITIALIZATION (4 prompts)
├── comprehensive-bootstrap.md          [★★★★☆] Enterprise setup with full stack
├── rapid-prototype.md                  [★★★☆☆] Quick MVP development setup
├── legacy-migration.md                 [★★★★★] Modernize existing codebases
└── team-onboarding.md                  [★★★☆☆] New team member setup

CODE ANALYSIS (6 prompts)
├── security-audit.md                   [★★★★☆] OWASP compliance scanning
├── dependency-analysis.md              [★★★☆☆] Package vulnerability assessment
├── performance-profiling.md            [★★★★☆] Bottleneck identification
├── code-quality.md                     [★★☆☆☆] Maintainability metrics
├── architecture-review.md              [★★★★★] System design evaluation
└── compliance-check.md                 [★★★★☆] Regulatory compliance validation
```

### Detailed View

```
Prompt: comprehensive-bootstrap.md
Category: Project Initialization
Complexity: ★★★★☆ (Advanced)
Estimated Time: 4-8 hours
Success Rate: 94% (based on 127 uses)

Description:
Complete project setup with production-grade tooling, security hardening,
testing framework, CI/CD pipeline, and documentation generation.

Prerequisites:
- Git repository initialized
- Development environment configured
- Package manager available

Outputs:
- Fully configured project structure
- Production-ready CI/CD pipeline
- Comprehensive documentation
- Security and compliance baseline

Related Prompts:
- team-onboarding.md (follow-up)
- security-audit.md (validation)
- setup-ci.md (enhancement)

Usage Examples:
- New product development
- Client project kickoff
- Internal tool development
```

## Filter Options

### Recent Prompts

Shows prompts added or updated in the last 30 days with change highlights.

### Popular Prompts

Lists most frequently used prompts based on community usage statistics.

### Advanced Prompts

Filters for complex, multi-step prompts requiring significant technical expertise.

### Beginner Prompts

Shows simple, well-documented prompts ideal for learning and getting started.

### Enterprise Prompts

Displays prompts designed for large-scale, production environments with compliance requirements.

### Quick-Win Prompts

Lists prompts that deliver immediate value with minimal time investment.

## Search and Discovery Features

### Smart Suggestions

- Suggests prompts based on current project analysis
- Recommends complementary prompt sequences
- Identifies gaps in current development process

### Usage Analytics

- Shows personal usage patterns and favorites
- Displays team adoption metrics
- Tracks prompt effectiveness over time

### Learning Paths

- Groups related prompts into learning sequences
- Provides progressive skill development tracks
- Suggests next steps based on completed prompts

## Integration Features

### Command Line Integration

- Tab completion for prompt names and categories
- Quick launch with `/list-prompts | grep [term]`
- Pipe output to other commands for processing

### IDE Integration

- Sidebar panel with searchable prompt library
- Context-aware prompt suggestions
- Quick preview and launch capabilities

### Team Sharing

- Export filtered lists for team sharing
- Create custom collections and bookmarks
- Share usage statistics and recommendations

## Customization Options

### Personal Collections

- Create custom prompt collections
- Tag prompts with personal keywords
- Build reusable workflow sequences

### Team Libraries

- Curate team-specific prompt collections
- Add internal prompts and customizations
- Maintain team-specific usage analytics

### Project-Specific Views

- Filter prompts relevant to current project type
- Show only prompts compatible with current tech stack
- Hide prompts that don't match project constraints

## Performance Features

- Lazy loading for large prompt collections
- Cached metadata for fast browsing
- Incremental search with instant results
- Offline availability for core prompt information

## Related Commands

- `/search-prompts` - Advanced content search across prompts
- `/workflow-builder` - Create sequences from discovered prompts
- `/prompt-stats` - Detailed analytics for listed prompts
- `/analyze-project` - Get personalized prompt recommendations

```xml
<role>
You are an expert content discovery specialist with deep knowledge of information organization, content categorization, and user interface design. You specialize in efficient prompt discovery and navigation.
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
