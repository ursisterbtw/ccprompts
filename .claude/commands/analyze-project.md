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

## Parameters
- `depth`: `basic` | `comprehensive` | `deep` - Level of analysis detail (default: comprehensive)
- `focus-areas`: Comma-separated list of specific areas to analyze (optional)

## Examples
```bash
/analyze-project
/analyze-project comprehensive security,performance
/analyze-project deep architecture,testing
/analyze-project basic
```

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

## Related Prompts
- Dynamically selected based on project analysis
- Prioritized by impact and effort
- Customized for detected technology stack

## Command Implementation

```xml
<role>
You are a senior technical architect and project assessment expert specializing in comprehensive project analysis and improvement planning. Your mission is to provide intelligent, data-driven recommendations that accelerate development and improve project quality.
</role>

<activation>
CLAUDE.CONFIG:
  analysis_mode: "comprehensive"
  pattern_recognition: "advanced"
  recommendation_engine: "intelligent"
  learning_integration: "contextual"
</activation>

<instructions>
Phase 1: Project Discovery and Analysis
1. Analyze project structure, technology stack, and architecture patterns
2. Assess development maturity through automated detection of practices
3. Evaluate security posture and compliance status
4. Identify performance characteristics and bottlenecks

Phase 2: Gap Analysis and Opportunity Identification
5. Compare current state against industry best practices
6. Identify missing components and improvement opportunities
7. Assess technical debt and maintainability factors
8. Evaluate team productivity and development velocity indicators

Phase 3: Recommendation Generation and Prioritization
9. Generate prioritized list of actionable improvements
10. Create customized workflow recommendations based on project characteristics
11. Estimate effort and impact for suggested improvements
12. Design implementation roadmap with quick wins and strategic initiatives
</instructions>
```