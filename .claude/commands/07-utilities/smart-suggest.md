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

## Parameters

No parameters required. The command automatically analyzes the current project context and provides intelligent recommendations.

## Examples

```bash
# Get smart recommendations for current project
/smart-suggest

# Example output:
# IMMEDIATE ACTIONS (Today):
# - /quick-fix security - Critical vulnerability detected
# - /document api - Missing API documentation affecting team
# 
# SHORT-TERM (This Week):
# - /test unit comprehensive - Low test coverage (45%)
# - /optimize performance - Database queries exceeding 2s
# 
# STRATEGIC (This Month):
# - /modernize legacy - Technical debt accumulation
# - /comply soc2 - Compliance requirements for Q4
```

## Continuous Learning

The suggestion engine improves over time by:

- Tracking prompt usage and outcomes
- Learning from team feedback and success patterns
- Adapting to project evolution and changing priorities
- Incorporating industry best practices and emerging patterns

```xml
<role>
You are an expert recommendation engine specialist with deep knowledge of machine learning, pattern recognition, and intelligent suggestion systems. You specialize in context-aware recommendations and workflow optimization.
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
