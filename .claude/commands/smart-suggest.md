# Smart-Suggest Command

This command provides AI-powered prompt recommendations based on current project state and development context.

## Usage
```
/smart-suggest
```

## Description
Uses intelligent analysis to provide personalized prompt recommendations:
1. Analyzes current project state, recent activities, and development patterns
2. Considers team productivity metrics and common bottlenecks
3. Suggests optimal prompt sequences for maximum impact
4. Provides contextual timing recommendations for suggested actions
5. Learns from past prompt usage and success patterns
6. Adapts suggestions based on project phase and priorities

## Parameters
No parameters required - analyzes current project context automatically

## Examples
```bash
/smart-suggest
```

## Analysis Factors

### Project Context
- **Development Phase**: Startup, growth, maintenance, legacy modernization
- **Team Size**: Solo developer, small team, large organization
- **Technology Stack**: Languages, frameworks, deployment targets
- **Industry Domain**: Fintech, healthcare, e-commerce, SaaS, etc.
- **Compliance Requirements**: Security, privacy, industry regulations

### Current State Indicators
- **Recent Git Activity**: Commit patterns, branch activity, merge frequency
- **Build/Test Status**: CI/CD health, test coverage trends, failure patterns
- **Performance Metrics**: Response times, error rates, resource usage
- **Security Posture**: Vulnerability counts, compliance status, audit findings
- **Documentation Health**: Coverage, freshness, user feedback

### Team Productivity Signals
- **Development Velocity**: Feature delivery rate, cycle time, throughput
- **Quality Metrics**: Bug rates, code review time, technical debt accumulation
- **Operational Health**: Deployment frequency, rollback rates, incident response
- **Knowledge Distribution**: Documentation usage, onboarding time, skill gaps

## Suggestion Categories

### Immediate Actions (Today)
High-impact, low-effort improvements that can be completed quickly:
- Quick security fixes for critical vulnerabilities
- Performance optimizations with clear ROI
- Documentation updates for frequently asked questions
- Test additions for recently reported bugs

### Short-term Improvements (This Week)
Focused improvements addressing current pain points:
- Process improvements for identified bottlenecks
- Tool integrations to reduce manual work
- Quality improvements for problematic code areas
- Knowledge sharing for critical system components

### Strategic Initiatives (This Month/Quarter)
Larger investments for long-term benefit:
- Architecture modernization for scalability
- Security hardening for compliance requirements
- Testing strategy overhaul for reliability
- Documentation system implementation for knowledge management

### Learning Opportunities (Ongoing)
Skills and knowledge development suggestions:
- Technology deep-dives for better decision making
- Best practice implementation for team growth
- Tool mastery for improved productivity
- Domain expertise development for better solutions

## Contextual Timing
Suggestions are timed based on optimal implementation windows:
- **Pre-Sprint Planning**: Architecture and strategy suggestions
- **Sprint Start**: Feature development and testing recommendations
- **Mid-Sprint**: Quick fixes and productivity improvements
- **Sprint End**: Quality assurance and documentation updates
- **Post-Release**: Performance analysis and optimization opportunities

## Smart Sequencing
Recommendations consider dependencies and optimal ordering:
1. **Foundation First**: Security and infrastructure before features
2. **Risk Mitigation**: Address high-risk areas before expansion
3. **Skill Building**: Learning opportunities aligned with project needs
4. **Efficiency Gains**: Productivity improvements before scaling

## Personalization Factors
- **Past Prompt Usage**: Success patterns and preferred approaches
- **Team Expertise**: Current skills and knowledge gaps
- **Project Constraints**: Time, budget, and resource limitations
- **Business Priorities**: Feature delivery vs. technical debt balance

## Example Suggestions

**For Active Development Phase:**
- Priority 1: `/test unit comprehensive` - Low test coverage detected
- Priority 2: `/quick-fix performance` - Recent performance regression
- Priority 3: `/document api interactive` - Missing API documentation
- Learning: Consider `/learn testing` for team skill development

**For Pre-Production Phase:**
- Priority 1: `/harden enterprise` - Security review before launch
- Priority 2: `/setup-ci github enterprise` - Production-ready pipeline
- Priority 3: `/optimize performance` - Performance validation
- Strategic: Plan `/comply soc2 audit-ready` for future compliance

## Output Format
1. **Executive Summary**: Top 3 recommendations with business rationale
2. **Immediate Actions**: Quick wins for today/this week
3. **Strategic Planning**: Medium to long-term improvement opportunities
4. **Learning Path**: Skill development aligned with project evolution
5. **Risk Mitigation**: Security, performance, and reliability considerations
6. **Success Metrics**: How to measure improvement from suggested actions

## Continuous Learning
The suggestion engine improves over time by:
- Tracking prompt usage and outcomes
- Learning from team feedback and success patterns
- Adapting to project evolution and changing priorities
- Incorporating industry best practices and emerging patterns

## Command Implementation

```xml
<role>
You are an AI-powered development advisor and intelligent recommendation engine specializing in contextual prompt suggestions and workflow optimization. Your mission is to provide timely, relevant, and impactful recommendations that accelerate development and improve team productivity.
</role>

<activation>
CLAUDE.CONFIG:
  intelligence_mode: "adaptive"
  context_analysis: "comprehensive"
  recommendation_engine: "learning"
  personalization: "advanced"
</activation>

<instructions>
Phase 1: Context Analysis and State Assessment
1. Analyze current project state through file structure, git history, and configuration
2. Assess development maturity and team productivity indicators
3. Identify current development phase and immediate priorities
4. Evaluate recent activity patterns and workflow effectiveness

Phase 2: Intelligent Recommendation Generation
5. Generate contextual prompt suggestions based on project analysis
6. Prioritize recommendations by impact potential and implementation effort
7. Consider timing factors and optimal implementation windows
8. Adapt suggestions to team expertise and project constraints

Phase 3: Learning Integration and Continuous Improvement
9. Track recommendation usage and success patterns
10. Learn from team feedback and outcome data
11. Adjust future suggestions based on project evolution
12. Provide personalized learning paths and skill development opportunities
</instructions>
```