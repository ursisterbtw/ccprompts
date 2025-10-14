# Tech-Debt Command

This command provides comprehensive technical debt management with automated detection, prioritization, and resolution tracking.

## Usage

```
/tech-debt [action] [scope] [priority]
```

## Parameters

- `action`: assess, prioritize, plan, track, resolve, report
- `scope`: file, module, service, full-codebase, architecture
- `priority`: critical, high, medium, low, all

## Examples

```
/tech-debt assess full-codebase all
/tech-debt prioritize service high
/tech-debt plan module critical
/tech-debt track full-codebase all
/tech-debt resolve file critical
```

## Description

Comprehensive technical debt management and resolution system:

1. Automated technical debt detection and quantification
2. ROI-based prioritization and impact analysis
3. Strategic debt reduction planning and execution
4. Continuous monitoring and trend analysis
5. Team education and prevention strategies
6. Integration with development workflows and planning

## Technical Debt Assessment

### Automated Detection

```python
# Technical Debt Analysis Results
tech_debt_analysis = {
    "overall_score": {
        "debt_ratio": 23.4,  # percentage of total codebase
        "maintenance_burden": "Medium-High",
        "estimated_resolution_time": "156 hours",
        "business_impact": "High"
    },

    "debt_categories": {
        "code_quality": {
            "score": 78,
            "issues": 234,
            "time_to_fix": "45 hours",
            "examples": ["complex functions", "code duplication", "naming issues"]
        },

        "architecture": {
            "score": 65,
            "issues": 12,
            "time_to_fix": "89 hours",
            "examples": ["tight coupling", "circular dependencies", "monolithic components"]
        },

        "documentation": {
            "score": 82,
            "issues": 67,
            "time_to_fix": "22 hours",
            "examples": ["missing API docs", "outdated comments", "no ADRs"]
        },

        "testing": {
            "score": 71,
            "issues": 89,
            "time_to_fix": "34 hours",
            "examples": ["low coverage", "brittle tests", "no integration tests"]
        },

        "security": {
            "score": 85,
            "issues": 23,
            "time_to_fix": "18 hours",
            "examples": ["outdated dependencies", "weak crypto", "missing validation"]
        },

        "performance": {
            "score": 69,
            "issues": 45,
            "time_to_fix": "28 hours",
            "examples": ["N+1 queries", "large bundles", "memory leaks"]
        }
    }
}
```

### Quantification Metrics

```
Technical Debt Quantification Report
===================================

[STATS] Overall Debt Assessment:
├── Total Debt Score: 73/100 (Good, with room for improvement)
├── Estimated Resolution Cost: $31,200 (156 hours × $200/hour)
├── Monthly Interest Cost: $4,680 (maintenance overhead)
├── ROI for Resolution: 340% (over 12 months)

[SCAN] Debt Distribution by Component:

Authentication Service:
├── Debt Ratio: 31% (highest in system)
├── Primary Issues: Legacy authentication, complex conditional logic
├── Estimated Fix Time: 34 hours
├── Business Impact: High (security and user experience)
├── Priority: Critical

Payment Processing:
├── Debt Ratio: 28%
├── Primary Issues: No error handling, tight coupling to external APIs
├── Estimated Fix Time: 42 hours
├── Business Impact: Critical (revenue impact)
├── Priority: Critical

User Dashboard:
├── Debt Ratio: 22%
├── Primary Issues: Large components, duplicated logic
├── Estimated Fix Time: 28 hours
├── Business Impact: Medium (user experience)
├── Priority: High

API Gateway:
├── Debt Ratio: 18%
├── Primary Issues: Missing documentation, complex routing
├── Estimated Fix Time: 16 hours
├── Business Impact: Medium (developer productivity)
├── Priority: Medium

Admin Panel:
├── Debt Ratio: 15%
├── Primary Issues: Outdated frameworks, minimal testing
├── Estimated Fix Time: 24 hours
├── Business Impact: Low (internal tool)
├── Priority: Low

Target: Debt Trend Analysis:
├── Last Month: +2.3% (debt accumulated faster than resolved)
├── Last Quarter: +8.7% (significant accumulation during feature push)
├── Velocity Impact: -15% (estimated productivity loss)
├── Quality Impact: +23% bug rate correlation with high-debt areas
```

### Code Quality Analysis

```
Code Quality Deep Dive
======================

Tool: Code Complexity Issues (89 locations):

High Complexity Functions (15 functions):
├── calculatePaymentFees() - Cyclomatic Complexity: 23
│   ├── Location: src/payment/calculator.js:156
│   ├── Issues: Multiple nested conditions, business logic scattered
│   ├── Impact: Hard to test, frequent bugs, difficult maintenance
│   ├── Effort: 6 hours (extract strategy pattern)
│   └── Priority: High

├── validateUserPermissions() - Cyclomatic Complexity: 19
│   ├── Location: src/auth/permissions.js:89
│   ├── Issues: Deep nesting, multiple responsibility violation
│   ├── Impact: Security risk, maintenance difficulty
│   ├── Effort: 4 hours (break into smaller functions)
│   └── Priority: Critical

├── processDataImport() - Cyclomatic Complexity: 17
│   ├── Location: src/data/import.js:234
│   ├── Issues: Large function, error handling mixed with logic
│   ├── Impact: Data corruption risk, debugging difficulty
│   ├── Effort: 8 hours (refactor into pipeline pattern)
│   └── Priority: High

[PROCESS] Code Duplication (34 instances):

Duplicated Validation Logic:
├── Pattern: Email validation repeated in 8 files
├── Total LOC: 156 lines duplicated
├── Maintenance Risk: Inconsistent validation rules
├── Solution: Create shared validation utility
├── Effort: 3 hours
├── Savings: 4 hours/month in maintenance

Duplicated API Error Handling:
├── Pattern: Similar try-catch blocks in 12 controllers
├── Total LOC: 234 lines duplicated
├── Maintenance Risk: Inconsistent error responses
├── Solution: Implement error handling middleware
├── Effort: 5 hours
├── Savings: 6 hours/month in debugging

Database Connection Boilerplate:
├── Pattern: Connection setup repeated in 15 modules
├── Total LOC: 89 lines duplicated
├── Maintenance Risk: Configuration drift
├── Solution: Create database service class
├── Effort: 2 hours
├── Savings: 3 hours/month in configuration
```

## Prioritization Framework

### ROI-Based Prioritization

```
Technical Debt ROI Analysis
==========================

Target: Priority Matrix (Impact vs Effort):

Critical Priority (High Impact, Low-Medium Effort):
├── Authentication Service Refactoring
│   ├── Business Impact: $8,400/month (security incidents, support load)
│   ├── Effort: 34 hours ($6,800 cost)
│   ├── ROI: 18.5% monthly return
│   ├── Payback Period: 5.4 months
│   └── Risk Reduction: 85% fewer security-related incidents

├── Payment Error Handling
│   ├── Business Impact: $12,600/month (failed transactions, support)
│   ├── Effort: 18 hours ($3,600 cost)
│   ├── ROI: 35% monthly return
│   ├── Payback Period: 2.9 months
│   └── Risk Reduction: 90% fewer payment failures

High Priority (High Impact, Medium-High Effort):
├── Dashboard Component Refactoring
│   ├── Business Impact: $4,200/month (user satisfaction, churn)
│   ├── Effort: 28 hours ($5,600 cost)
│   ├── ROI: 7.5% monthly return
│   ├── Payback Period: 13.3 months
│   └── Performance Gain: 40% faster page loads

├── API Documentation Generation
│   ├── Business Impact: $3,900/month (developer productivity)
│   ├── Effort: 16 hours ($3,200 cost)
│   ├── ROI: 22% monthly return
│   ├── Payback Period: 4.6 months
│   └── Productivity Gain: 25% faster API integration

Medium Priority (Medium Impact, Low-Medium Effort):
├── Test Coverage Improvement
│   ├── Business Impact: $2,100/month (reduced debugging time)
│   ├── Effort: 24 hours ($4,800 cost)
│   ├── ROI: 4.4% monthly return
│   ├── Payback Period: 22.9 months
│   └── Quality Improvement: 60% fewer regression bugs

Low Priority (Low Impact or High Effort):
├── Legacy Framework Migration
│   ├── Business Impact: $1,800/month (long-term maintainability)
│   ├── Effort: 89 hours ($17,800 cost)
│   ├── ROI: 1.0% monthly return
│   ├── Payback Period: 99 months
│   └── Future-proofing: 5-year framework support
```

### Risk Assessment

```
Technical Debt Risk Analysis
===========================

[ALERT] Critical Risk Areas:

Security Vulnerabilities (Risk Score: 9.2/10):
├── Outdated authentication system using deprecated crypto
├── SQL injection potential in admin queries
├── Hardcoded API keys in configuration files
├── Missing input validation in file upload
├── Impact: Data breach, compliance violations, reputation damage
├── Probability: High (known attack vectors)
├── Mitigation: Immediate security audit and fixes

System Stability (Risk Score: 7.8/10):
├── Payment processing has no proper error recovery
├── Database connection pooling issues under load
├── Memory leaks in long-running background jobs
├── No circuit breakers for external service calls
├── Impact: Service outages, data loss, revenue loss
├── Probability: Medium-High (stress testing shows issues)
├── Mitigation: Infrastructure hardening sprint

Developer Productivity (Risk Score: 6.5/10):
├── Build times increased by 400% over 6 months
├── Test suite takes 45 minutes (target: 10 minutes)
├── Complex deployment process (8 manual steps)
├── Documentation 40% outdated
├── Impact: Slower feature delivery, developer frustration
├── Probability: Already occurring (velocity down 25%)
├── Mitigation: Developer experience improvement initiative

Compliance Risk (Risk Score: 5.2/10):
├── Data retention policies not automated
├── Audit trail incomplete for user actions
├── GDPR data deletion not fully implemented
├── Access logging insufficient for SOC2
├── Impact: Compliance failures, legal issues, customer loss
├── Probability: Medium (audit findings pending)
├── Mitigation: Compliance automation project
```

## Debt Resolution Planning

### Strategic Debt Reduction Plan

```
6-Month Technical Debt Reduction Roadmap
=======================================

Target: Overall Goal: Reduce debt ratio from 23.4% to 15% (target: <20%)

Month 1: Critical Security & Stability (Focus: Risk Reduction)
├── Week 1-2: Authentication system security hardening
├── Week 3-4: Payment processing error handling implementation
├── Estimated Effort: 52 hours
├── Expected Debt Reduction: 3.2%
├── Business Impact: 85% reduction in security incidents

Month 2: Core Architecture Improvements (Focus: Foundation)
├── Week 1-2: Database connection and query optimization
├── Week 3-4: API error handling middleware implementation
├── Estimated Effort: 36 hours
├── Expected Debt Reduction: 2.8%
├── Business Impact: 60% improvement in system stability

Month 3: Developer Productivity (Focus: Velocity)
├── Week 1-2: Build and test performance optimization
├── Week 3-4: Deployment automation and simplification
├── Estimated Effort: 28 hours
├── Expected Debt Reduction: 1.9%
├── Business Impact: 30% improvement in development velocity

Month 4: Code Quality & Testing (Focus: Maintainability)
├── Week 1-2: Complex function refactoring
├── Week 3-4: Test coverage improvement for critical paths
├── Estimated Effort: 42 hours
├── Expected Debt Reduction: 2.1%
├── Business Impact: 50% reduction in bug rates

Month 5: Documentation & Knowledge (Focus: Sustainability)
├── Week 1-2: API documentation automation
├── Week 3-4: Architecture decision records and runbooks
├── Estimated Effort: 24 hours
├── Expected Debt Reduction: 1.2%
├── Business Impact: 40% faster onboarding and debugging

Month 6: Long-term Maintenance (Focus: Prevention)
├── Week 1-2: Code quality automation and gates
├── Week 3-4: Technical debt monitoring and alerting
├── Estimated Effort: 18 hours
├── Expected Debt Reduction: 1.3%
├── Business Impact: 70% reduction in new debt accumulation

[STATS] Expected Outcomes:
├── Total Effort Investment: 200 hours ($40,000)
├── Debt Reduction: 8.4% (23.4% → 15.0%)
├── Monthly Savings: $7,200 (reduced maintenance costs)
├── ROI: 215% over 12 months
├── Velocity Improvement: +35% team productivity
```

### Sprint Integration Strategy

```
Technical Debt Integration with Feature Development
==================================================

[PROCESS] Debt-to-Feature Ratio Strategy:
├── Target Allocation: 70% features, 30% technical debt
├── Minimum Debt Work: 20% per sprint (non-negotiable)
├── Maximum Debt Work: 50% per sprint (for critical issues)
├── Buffer Allocation: 10% for urgent debt that blocks features

Sprint 24 Example Integration:
├── Feature Work: 10.5 points (70%)
├── Technical Debt: 4.5 points (30%)
├── Debt Items Selected:
│   ├── Payment error handling (2 points) - blocks new payment features
│   ├── API documentation (1.5 points) - enables faster integration
│   └── Test coverage for auth (1 point) - prevents regression
├── Synergy Benefits:
│   ├── Payment work enables safer feature development
│   ├── Documentation reduces future support burden
│   └── Tests prevent bugs in upcoming auth changes

Target: Debt Selection Criteria:
├── Directly enables upcoming features (weight: 40%)
├── Reduces immediate business risk (weight: 30%)
├── Improves team velocity (weight: 20%)
├── Learning opportunity for team (weight: 10%)

[LIST] Implementation Guidelines:
├── Pair debt work with junior developers for knowledge transfer
├── Document before/after metrics for each debt item
├── Include debt stories in sprint demo to show value
├── Celebrate debt reduction wins equally with feature delivery
```

## Monitoring and Prevention

### Continuous Debt Monitoring

```python
# Technical Debt Monitoring Dashboard
debt_monitoring = {
    "daily_metrics": {
        "new_debt_introduced": 0.3,  # hours per day
        "debt_resolved": 0.8,        # hours per day
        "net_debt_change": -0.5,     # improvement
        "debt_velocity": "improving"
    },

    "quality_gates": {
        "cyclomatic_complexity": {
            "threshold": 10,
            "violations": 3,
            "trend": "stable"
        },
        "code_duplication": {
            "threshold": 5,  # percentage
            "current": 3.2,
            "trend": "improving"
        },
        "test_coverage": {
            "threshold": 80,  # percentage
            "current": 84.2,
            "trend": "stable"
        }
    },

    "architectural_health": {
        "coupling_score": 6.8,      # out of 10
        "cohesion_score": 7.2,     # out of 10
        "dependency_cycles": 2,     # count
        "api_consistency": 8.1      # out of 10
    }
}
```

### Automated Prevention

```yaml
# Debt Prevention Automation
prevention_rules:
  pre_commit_hooks:
    - complexity_check: "fail if function complexity > 10"
    - duplication_check: "warn if duplicate code > 6 lines"
    - test_coverage: "require 80% coverage for new code"
    - documentation: "require docstrings for public APIs"

  ci_cd_gates:
    - code_quality_score: "minimum 7.5/10"
    - security_scan: "no high severity vulnerabilities"
    - performance_regression: "no response time increase > 10%"
    - dependency_audit: "no known vulnerabilities"

  automated_refactoring:
    - import_organization: "auto-organize imports on save"
    - code_formatting: "auto-format with prettier/black"
    - simple_refactoring: "auto-extract constants and simple functions"

  monitoring_alerts:
    - debt_accumulation: "alert if debt ratio increases > 2% in week"
    - complexity_increase: "alert if average complexity > threshold"
    - test_coverage_drop: "alert if coverage drops > 5%"
    - build_time_increase: "alert if build time increases > 20%"
```

### Team Education and Culture

```
Technical Debt Education Program
===============================

[DOCS] Educational Components:

Monthly Tech Talks (30 minutes each):
├── "The True Cost of Technical Debt" - Business impact analysis
├── "Refactoring Techniques" - Hands-on code improvement workshop
├── "Architecture Patterns" - Design patterns that prevent debt
├── "Test-Driven Development" - Quality prevention through testing

Quarterly Debt Days (Full team, 1 day):
├── Team debt assessment and planning session
├── Collaborative refactoring on high-impact debt items
├── Knowledge sharing on debt prevention techniques
├── Retrospective on debt management effectiveness

Code Review Guidelines:
├── Debt Awareness: Flag potential debt in all reviews
├── Prevention Focus: Suggest improvements, not just bug fixes
├── Knowledge Sharing: Explain reasoning behind debt concerns
├── Incremental Improvement: Encourage "leave code better than you found it"

Target: Cultural Changes:

Debt Ownership:
├── Each team member owns one debt category (architecture, testing, etc.)
├── Monthly debt owner reports on category health and improvements
├── Recognition for debt reduction contributions in team meetings
├── Include debt resolution in performance review criteria

Definition of Done Enhancement:
├── Technical debt assessment required for all stories
├── Refactoring opportunities must be identified and documented
├── New code must not increase debt metrics beyond thresholds
├── Documentation must be updated for all architectural changes

Sprint Planning Integration:
├── Reserve 30% of sprint capacity for debt work (minimum 20%)
├── Include debt stories in sprint planning and estimation
├── Celebrate debt reduction achievements in sprint reviews
├── Track debt metrics alongside velocity and business metrics
```

## Reporting and Analytics

### Executive Reporting

```
Technical Debt Executive Summary
===============================

[STATS] Current State (Q1 2024):
├── Overall Debt Score: 73/100 (Good)
├── Estimated Debt Cost: $31,200 (down from $45,600 in Q4 2023)
├── Monthly Interest: $4,680 (maintenance overhead)
├── Team Velocity Impact: -15% (improvement from -25% in Q4)

[COST] Business Impact:
├── Development Velocity: 15% slower feature delivery
├── Bug Resolution Cost: $18,000/month (debt-related issues)
├── Customer Support Load: +23% (complexity-related tickets)
├── Security Risk: Medium (down from High in Q4)

Target: Q1 Achievements:
├── Debt Reduction: 6.8% (from 30.2% to 23.4%)
├── Critical Issues Resolved: 8 out of 12
├── Security Vulnerabilities: Reduced from 15 to 3
├── Build Time Improvement: 40% faster (from 12 min to 7 min)

[METRICS] ROI of Debt Reduction:
├── Investment: $28,500 (142.5 hours of engineering time)
├── Savings: $52,800 (reduced maintenance and support costs)
├── Net Benefit: $24,300 (85% ROI in Q1 alone)
├── Projected Annual ROI: 340%

Action: Q2 Priorities:
├── Complete authentication system modernization
├── Reduce payment processing complexity by 60%
├── Achieve 85% automated test coverage
├── Target debt ratio: 18% (5.4% additional reduction)

[LIST] Resource Requirements:
├── Engineering Time: 25% allocation (increased from 20%)
├── Budget: $35,000 for Q2 debt reduction initiatives
├── Timeline: 12 weeks for high-priority items
├── Success Metrics: <20% debt ratio, +25% velocity improvement
```

### Team Performance Impact

```python
# Debt Impact on Team Metrics
team_impact_analysis = {
    "velocity_correlation": {
        "high_debt_periods": {"avg_velocity": 14.2, "confidence": 0.65},
        "low_debt_periods": {"avg_velocity": 18.7, "confidence": 0.89},
        "improvement_potential": "32% velocity increase"
    },

    "quality_correlation": {
        "bug_rate_high_debt": 3.4,  # bugs per story point
        "bug_rate_low_debt": 1.2,   # bugs per story point
        "quality_improvement": "183% fewer bugs"
    },

    "team_satisfaction": {
        "high_debt_satisfaction": 6.2,  # out of 10
        "low_debt_satisfaction": 8.1,   # out of 10
        "morale_impact": "31% higher satisfaction"
    },

    "onboarding_efficiency": {
        "high_debt_ramp_time": 8.5,  # weeks to productivity
        "low_debt_ramp_time": 5.2,   # weeks to productivity
        "onboarding_improvement": "63% faster ramp-up"
    }
}
```

## Integration Features

### Development Workflow Integration

```bash
# Git Hook Integration
# .git/hooks/pre-commit
#!/bin/bash
echo "Analyzing technical debt impact..."

# Run debt analysis on changed files
claude-code /tech-debt assess staged critical

# Check for debt threshold violations
if [ $? -eq 1 ]; then
    echo "[WARNING]  Technical debt threshold exceeded"
    echo "Consider refactoring before committing"
    echo "Run 'claude-code /tech-debt resolve file critical' for suggestions"
fi

# Continue with commit (warning only)
exit 0
```

### CI/CD Pipeline Integration

```yaml
# GitHub Actions Workflow
name: Technical Debt Monitoring
on: [push, pull_request]

jobs:
  debt-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Analyze Technical Debt
        run: |
          claude-code /tech-debt assess full-codebase all

      - name: Update Debt Dashboard
        run: |
          claude-code /tech-debt report full-codebase all

      - name: Check Debt Thresholds
        run: |
          claude-code /tech-debt track full-codebase critical
```

### Project Management Integration

- **Jira Integration**: Automatic debt story creation and tracking
- **Azure DevOps**: Work item generation for debt reduction tasks
- **GitHub Issues**: Debt issue templates and automated labeling
- **Confluence**: Debt documentation and architectural decision records
- **Slack**: Debt threshold alerts and team notifications

## Related Commands

- `/code-review` - Identify debt during review process
- `/sprint-planning` - Integrate debt work into sprint planning
- `/audit-security` - Focus on security-related technical debt
- `/optimize` - Performance debt identification and resolution
- `/health-check` - Overall system health including debt assessment

```xml
<role>
You are an expert technical debt analyst with deep knowledge of code quality metrics, refactoring strategies, and technical debt quantification. You specialize in identifying and prioritizing technical debt remediation.
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
