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

### Project Context Analysis

- **Development Phase**: Startup, growth, maintenance, legacy modernization
  - *Detection*: Git history, file age, dependency versions, architecture patterns
  - *Indicators*: New project (< 6 months), active development, maintenance mode
- **Team Size**: Solo developer, small team, large organization
  - *Detection*: Git contributors, code review patterns, documentation style
  - *Indicators*: Single contributor, 2-10 contributors, 10+ contributors
- **Technology Stack**: Languages, frameworks, deployment targets
  - *Detection*: File extensions, package.json, requirements.txt, Dockerfile
  - *Indicators*: Primary languages, frameworks, build tools, deployment targets
- **Industry Domain**: Fintech, healthcare, e-commerce, SaaS, etc.
  - *Detection*: Dependencies, compliance files, security patterns, data handling
  - *Indicators*: Regulatory requirements, security standards, data sensitivity
- **Compliance Requirements**: Security, privacy, industry regulations
  - *Detection*: Security configs, audit files, compliance documentation
  - *Indicators*: SOC2, HIPAA, GDPR, PCI-DSS requirements

### Current State Indicators

- **Recent Git Activity**: Commit patterns, branch activity, merge frequency
  - *Analysis*: Commit frequency, branch count, merge conflicts, contributor activity
  - *Signals*: High activity = active development, low activity = maintenance
- **Build/Test Status**: CI/CD health, test coverage trends, failure patterns
  - *Analysis*: CI success rates, test coverage %, build times, failure patterns
  - *Signals*: Failing tests = quality issues, low coverage = risk areas
- **Performance Metrics**: Response times, error rates, resource usage
  - *Analysis*: Log analysis, monitoring data, performance benchmarks
  - *Signals*: Slow queries, high error rates, resource bottlenecks
- **Security Posture**: Vulnerability counts, compliance status, audit findings
  - *Analysis*: Dependency scans, security configs, audit reports
  - *Signals*: Known vulnerabilities, misconfigurations, compliance gaps
- **Documentation Health**: Coverage, freshness, user feedback
  - *Analysis*: Doc coverage, last updated dates, issue reports
  - *Signals*: Missing docs, outdated content, user confusion

### Team Productivity Signals

- **Development Velocity**: Feature delivery rate, cycle time, throughput
  - *Metrics*: Commits per week, PR merge time, feature completion rate
  - *Trends*: Increasing velocity = good, decreasing = bottlenecks
- **Quality Metrics**: Bug rates, code review time, technical debt accumulation
  - *Metrics*: Bug reports, review duration, code complexity trends
  - *Trends*: Rising bugs = quality issues, long reviews = process problems
- **Operational Health**: Deployment frequency, rollback rates, incident response
  - *Metrics*: Deploy frequency, rollback %, incident resolution time
  - *Trends*: Frequent rollbacks = stability issues, slow response = process gaps
- **Knowledge Distribution**: Documentation usage, onboarding time, skill gaps
  - *Metrics*: Doc access patterns, new contributor ramp-up time
  - *Trends*: Long onboarding = knowledge gaps, repeated questions = doc issues

### Advanced Context Detection

#### Technology Stack Profiling
```bash
# Automatic detection examples:
- Python + Django + PostgreSQL → Web application
- React + Node.js + MongoDB → Full-stack JavaScript
- Go + Docker + Kubernetes → Microservices/Cloud-native
- Java + Spring + MySQL → Enterprise application
```

#### Project Maturity Assessment
```bash
# Maturity indicators:
- Startup (0-6 months): Basic structure, rapid changes, minimal docs
- Growth (6-18 months): Established patterns, scaling challenges
- Mature (18+ months): Stable architecture, optimization focus
- Legacy (3+ years): Modernization needs, technical debt
```

#### Risk Pattern Recognition
```bash
# Risk indicators:
- High complexity + Low test coverage = Quality risk
- Rapid growth + No monitoring = Operational risk  
- Multiple languages + Small team = Maintenance risk
- Compliance requirements + No security audit = Regulatory risk
```

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

## Intelligent Recommendation Examples

### Scenario 1: Early-Stage Startup (Python/Django)
**Context**: 2-person team, 3-month-old project, rapid feature development

```
🚨 IMMEDIATE ACTIONS (Today):
1. /pre-commit standard - No quality gates detected
   Impact: Prevent bugs before they reach main branch
   Effort: 30 minutes | Success Probability: 95%

2. /backup essential - No backup strategy found
   Impact: Protect against data loss during rapid development
   Effort: 1 hour | Success Probability: 90%

⚡ SHORT-TERM IMPROVEMENTS (This Week):
1. /test unit basic - Test coverage at 15% (target: 60%)
   Impact: Reduce debugging time, increase confidence
   Effort: 4-6 hours | Success Probability: 85%

2. /document api auto - API endpoints undocumented
   Impact: Enable frontend development, reduce communication overhead
   Effort: 2-3 hours | Success Probability: 90%

🎯 STRATEGIC INITIATIVES (This Month):
1. /setup-ci github basic - Manual deployment process
   Impact: Reduce deployment risk, enable faster iterations
   Effort: 1-2 days | Success Probability: 80%

📚 LEARNING OPPORTUNITIES:
- /learn testing python - Team skill gap in testing practices
- /learn security web-apps - Security fundamentals for web development
```

### Scenario 2: Growing SaaS Company (React/Node.js)
**Context**: 8-person team, 18-month-old product, scaling challenges

```
🚨 IMMEDIATE ACTIONS (Today):
1. /optimize performance database - Query times > 2s detected
   Impact: Improve user experience, reduce churn risk
   Effort: 2-4 hours | Success Probability: 85%

2. /monitor production - No monitoring system detected
   Impact: Proactive issue detection, reduce downtime
   Effort: 3-4 hours | Success Probability: 90%

⚡ SHORT-TERM IMPROVEMENTS (This Week):
1. /refactor extract-services - Monolith showing scaling stress
   Impact: Improve maintainability, enable team scaling
   Effort: 1-2 weeks | Success Probability: 75%

2. /code-review automated - Manual review process bottleneck
   Impact: Faster code reviews, consistent quality standards
   Effort: 4-6 hours | Success Probability: 85%

🎯 STRATEGIC INITIATIVES (This Quarter):
1. /audit-security comprehensive - Preparing for enterprise customers
   Impact: Enable enterprise sales, reduce security risk
   Effort: 1-2 weeks | Success Probability: 80%

2. /comply soc2 preparation - Enterprise customer requirements
   Impact: Unlock enterprise market, competitive advantage
   Effort: 2-3 months | Success Probability: 70%

📚 LEARNING OPPORTUNITIES:
- /learn microservices - Architecture evolution planning
- /learn security enterprise - Advanced security practices
```

### Scenario 3: Enterprise Legacy System (Java/Spring)
**Context**: 25-person team, 5-year-old system, modernization needs

```
🚨 IMMEDIATE ACTIONS (Today):
1. /audit-security dependencies - 15 high-severity vulnerabilities
   Impact: Reduce security risk, maintain compliance
   Effort: 4-6 hours | Success Probability: 95%

2. /health-check comprehensive - System stability concerns
   Impact: Identify critical issues before they impact users
   Effort: 1-2 hours | Success Probability: 90%

⚡ SHORT-TERM IMPROVEMENTS (This Sprint):
1. /tech-debt prioritize - Technical debt impacting velocity
   Impact: Improve development speed, reduce maintenance cost
   Effort: 1 week | Success Probability: 80%

2. /test mutation - Test quality concerns with legacy code
   Impact: Improve test effectiveness, reduce regression risk
   Effort: 1-2 weeks | Success Probability: 75%

🎯 STRATEGIC INITIATIVES (Next Quarter):
1. /modernize architecture - Microservices migration planning
   Impact: Improve scalability, enable team autonomy
   Effort: 3-6 months | Success Probability: 65%

2. /migrate cloud-native - Infrastructure modernization
   Impact: Reduce operational overhead, improve reliability
   Effort: 2-4 months | Success Probability: 70%

📚 LEARNING OPPORTUNITIES:
- /learn cloud-architecture - Modern deployment patterns
- /learn legacy-modernization - Systematic modernization approaches
```

### Scenario 4: High-Growth Fintech (Multi-language)
**Context**: 50+ person team, regulatory requirements, high availability needs

```
🚨 IMMEDIATE ACTIONS (Today):
1. /incident-response validate - Recent production incidents
   Impact: Improve incident response time, reduce customer impact
   Effort: 2-3 hours | Success Probability: 90%

2. /comply pci-dss audit - Compliance audit next month
   Impact: Pass compliance audit, avoid regulatory issues
   Effort: 1 day | Success Probability: 85%

⚡ SHORT-TERM IMPROVEMENTS (This Sprint):
1. /harden production - Security hardening for financial data
   Impact: Reduce security risk, improve compliance posture
   Effort: 1-2 weeks | Success Probability: 80%

2. /monitor advanced - Enhanced observability for complex system
   Impact: Faster issue detection, improved reliability
   Effort: 1 week | Success Probability: 85%

🎯 STRATEGIC INITIATIVES (Next Quarter):
1. /workflow-builder compliance - Automate compliance workflows
   Impact: Reduce compliance overhead, improve consistency
   Effort: 1-2 months | Success Probability: 75%

2. /knowledge-base security - Centralize security knowledge
   Impact: Improve security awareness, reduce training time
   Effort: 3-4 weeks | Success Probability: 80%

📚 LEARNING OPPORTUNITIES:
- /learn compliance-automation - Advanced compliance practices
- /learn incident-management - Enterprise incident response
```

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
