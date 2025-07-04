# Analyze-Project Command

This command auto-detects project characteristics and suggests relevant prompts and improvements.

## Usage

```
/analyze-project
```

## Description

Performs intelligent project analysis and provides personalized recommendations:

1. Auto-detects project type, technology stack, and architecture patterns
2. Identifies current development maturity level and gaps
3. Suggests relevant prompts based on project characteristics
4. Recommends improvement priorities and workflows
5. Provides timeline estimates for suggested improvements
6. Creates a personalized development roadmap

## Auto-Detection Capabilities

- **Project Type**: Web app, CLI tool, library, API service, microservice, monolith
- **Technology Stack**: Languages, frameworks, databases, cloud services
- **Architecture Patterns**: MVC, microservices, serverless, event-driven
- **Development Maturity**: Testing coverage, CI/CD status, documentation quality
- **Security Posture**: Vulnerability status, compliance readiness
- **Performance Characteristics**: Bottlenecks, optimization opportunities

## Analysis Output

1. **Project Profile**: Type, stack, architecture, team size estimation
2. **Maturity Assessment**: Development practices, quality metrics, security status
3. **Gap Analysis**: Missing components, improvement opportunities
4. **Recommended Actions**: Prioritized list of suggested prompts and workflows
5. **Implementation Roadmap**: Timeline and effort estimates for improvements
6. **Quick Wins**: Immediate improvements with high impact/low effort

## Example Recommendations

**For a Legacy Monolith:**

- Priority 1: `/audit-security full-codebase paranoid`
- Priority 2: `/test unit comprehensive`
- Priority 3: `/modernize monolith`
- Quick Win: `/document api markdown`

**For a New Startup Project:**

- Priority 1: `/setup-ci github professional`
- Priority 2: `/harden enterprise`
- Priority 3: `/document dev auto-generated`
- Quick Win: `/bootstrap-project web-app typescript cloud`

## Use Cases

- **Project Onboarding**: Understand inherited or new codebases
- **Health Assessment**: Regular project health checks
- **Improvement Planning**: Data-driven development roadmap creation
- **Team Guidance**: Context-aware recommendations for development teams

## Parameters

No parameters required. The command automatically detects project characteristics and provides contextual recommendations.

## Examples

```bash
# Basic project analysis
/analyze-project

# Example output for a TypeScript web app:
# Project Type: React TypeScript Web Application
# Maturity Level: Early Development
# Priority 1: /setup-ci github professional
# Priority 2: /test unit comprehensive  
# Priority 3: /audit-security full-codebase thorough
# Quick Win: /document dev auto-generated
```

## Related Prompts

- Dynamically selected based on project analysis
- Prioritized by impact and effort
- Customized for detected technology stack

```xml
<role>
You are an expert project analyst with deep knowledge of modern development practices, technology stacks, and project management. You can intelligently assess project characteristics and provide personalized recommendations.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Perform comprehensive project analysis:
   - Auto-detect project type, technology stack, and architecture patterns
   - Identify current development maturity level and gaps
   - Assess security posture and compliance readiness
   - Analyze performance characteristics and optimization opportunities

2. Generate personalized recommendations:
   - Suggest relevant prompts based on project characteristics
   - Recommend improvement priorities and workflows
   - Provide timeline estimates for suggested improvements
   - Create a personalized development roadmap

3. Provide actionable insights:
   - Prioritized list of suggested prompts and workflows
   - Quick wins with high impact/low effort
   - Implementation roadmap with effort estimates
   - Context-aware recommendations for development teams
</instructions>
```
