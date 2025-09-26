# Sprint-Planning Command

This command automates comprehensive sprint planning with intelligent capacity management and goal optimization.

## Usage

```
/sprint-planning [phase] [team] [duration]
```

## Parameters

- `phase`: preparation, estimation, planning, commitment, retrospective
- `team`: current-team, cross-team, program-level, custom-team
- `duration`: 1-week, 2-week, 3-week, 4-week

## Examples

```
/sprint-planning preparation current-team 2-week
/sprint-planning estimation cross-team 3-week
/sprint-planning planning program-level 2-week
/sprint-planning commitment current-team 1-week
```

## Description

Comprehensive sprint planning automation and optimization system:

1. Intelligent backlog prioritization and story point estimation
2. Team capacity analysis and velocity-based planning
3. Goal setting and dependency management
4. Risk assessment and mitigation planning
5. Cross-team coordination and resource allocation
6. Automated documentation and communication

## Planning Phases

### Preparation Phase

```
Sprint Planning Preparation - Sprint 24
======================================

[STATS] Team Context Analysis:
├── Current Sprint (23) Status: 85% complete (17/20 points)
├── Velocity Trend: 18.5 points (3-sprint average)
├── Team Availability: 7/8 team members (1 on vacation)
├── Adjusted Capacity: 16.2 points (12% reduction for vacation)
├── Technical Debt: 2.3 hours (down from 4.1 hours)

Target: Business Priority Assessment:
├── Critical: User authentication security (P0)
├── High: Mobile app performance improvements (P1)
├── Medium: Admin dashboard enhancements (P2)
├── Low: Documentation updates (P3)

[LIST] Backlog Health Check:
├── Ready Stories: 23 stories (38 points total)
├── Story Clarity: 87% have clear acceptance criteria
├── Dependencies: 3 external dependencies identified
├── Technical Prerequisites: 2 environment setup tasks
├── Design Assets: 5 stories need design review

[WARNING] Identified Risks:
├── External API integration dependency (blocks 3 stories)
├── Performance testing environment not ready
├── Team member knowledge gap in new framework
└── Potential scope creep from stakeholder requests

[PROCESS] Preparation Actions:
├── [OK] Backlog grooming completed
├── [OK] Story points estimated for top 25 stories
├── ⏳ External dependency timeline clarification
├── ⏳ Performance testing environment setup
└── ⏳ Framework training scheduled for team member
```

### Estimation Phase

```
Story Point Estimation Session
==============================

Target: Estimation Method: Planning Poker with Modified Fibonacci
[TEAM] Participants: 6 team members (Development team only)
[TIME] Session Duration: 2 hours (target: 90 minutes)

[LIST] Stories Estimated (15 stories):

[AUTH] USER-234: Implement Two-Factor Authentication
├── Complexity: High (authentication, security, testing)
├── Estimates: [5, 8, 8, 5, 8, 13] 
├── Discussion: Security review process, multiple 2FA methods
├── Final Estimate: 8 points
├── Confidence: 75% (some unknowns in SMS provider integration)

[MOBILE] MOBILE-156: Optimize App Startup Performance  
├── Complexity: Medium (performance analysis, optimization)
├── Estimates: [3, 5, 5, 3, 5, 5]
├── Discussion: Profiling needed, bundle size optimization
├── Final Estimate: 5 points
├── Confidence: 85% (clear optimization path identified)

[UI] UI-189: Redesign Dashboard Layout
├── Complexity: Medium (frontend, responsive design)
├── Estimates: [3, 3, 5, 3, 5, 3]
├── Discussion: Design assets ready, component reuse
├── Final Estimate: 3 points
├── Confidence: 90% (design approved, components exist)

[PROCESS] API-198: Add Rate Limiting to Public APIs
├── Complexity: High (architecture, monitoring, testing)
├── Estimates: [8, 13, 8, 5, 8, 8]
├── Discussion: Multiple rate limiting strategies, Redis setup
├── Final Estimate: 8 points
├── Confidence: 70% (Redis infrastructure needs clarification)

[STATS] Estimation Summary:
├── Total Points Estimated: 67 points (15 stories)
├── Average Confidence: 78%
├── High Confidence (>85%): 6 stories (24 points)
├── Medium Confidence (70-85%): 7 stories (31 points)
├── Low Confidence (<70%): 2 stories (12 points)

Target: Recommendations:
├── Prioritize high-confidence stories for sprint commitment
├── Break down low-confidence stories further
├── Spike work needed for Redis infrastructure decision
└── Consider design review for complex UI stories
```

### Planning Phase

```
Sprint 24 Planning Session Results
=================================

Target: Sprint Goal: "Enhance Security and Performance Foundation"
Deliver two-factor authentication for enterprise users while improving 
core application performance by 25%.

[STATS] Capacity Planning:
├── Team Capacity: 16.2 points (adjusted for vacation)
├── Historical Velocity: 18.5 points (3-sprint average)
├── Confidence Buffer: 10% (1.6 points)
├── Planned Commitment: 15 points
├── Stretch Goals: 3 additional points available

[OK] Committed Stories (15 points):

[AUTH] Security Theme (8 points):
├── USER-234: Implement Two-Factor Authentication (8 pts)
│   ├── Owner: Sarah Chen (Security SME)
│   ├── Dependencies: SMS provider selection
│   └── Acceptance: 2FA working for admin users

[MOBILE] Performance Theme (7 points):
├── MOBILE-156: Optimize App Startup Performance (5 pts)
│   ├── Owner: Mike Johnson (Mobile Lead)
│   ├── Dependencies: Profiling tools setup
│   └── Acceptance: 50% faster startup time
├── PERF-167: Database Query Optimization (2 pts)
│   ├── Owner: Lisa Wong (Backend)
│   ├── Dependencies: None
│   └── Acceptance: 25% faster query response

[PROCESS] Stretch Goals (3 points):
├── UI-189: Redesign Dashboard Layout (3 pts)
│   ├── Owner: David Kim (Frontend)
│   ├── Dependencies: Design assets ready
│   └── Condition: If sprint tracking ahead

[LIST] Sprint Backlog Details:

Day 1-2: Setup and Investigation
├── Environment setup for 2FA testing
├── Mobile app profiling and baseline measurement
├── Database query analysis and optimization planning

Day 3-6: Core Development
├── 2FA implementation and integration
├── Mobile startup optimization implementation
├── Database query optimization execution

Day 7-8: Testing and Integration
├── Security testing for 2FA implementation
├── Performance testing and validation
├── Integration testing and bug fixes

Day 9-10: Polish and Documentation
├── Documentation updates
├── Code review and security review
├── Deployment preparation and validation

[LINK] Dependencies Management:
├── External: SMS provider API access (Day 1)
├── Internal: Design review for dashboard (Day 3)
├── Technical: Performance testing environment (Day 2)
└── Cross-team: Security team review (Day 7)

[WARNING] Risk Mitigation:
├── SMS Provider Backup: Twilio and AWS SNS both evaluated
├── Performance Tools: New Relic already configured
├── Knowledge Gap: Pair programming scheduled for framework
└── Scope Creep: Product owner committed to no new requests
```

### Commitment Phase

```
Sprint 24 Final Commitment
=========================

[COLLAB] Team Commitment Ceremony Results:

[TEAM] Individual Commitments:

Sarah Chen (Senior Developer):
├── Commitment: Lead 2FA implementation (8 points)
├── Capacity: 8/8 points
├── Confidence: 80% ("SMS provider integration is the risk")
├── Support Needed: Security team review by Day 7
├── Learning Goal: Become team expert in authentication

Mike Johnson (Mobile Lead):
├── Commitment: Mobile performance optimization (5 points)
├── Capacity: 8/8 points  
├── Confidence: 85% ("Clear optimization path identified")
├── Support Needed: Performance testing environment access
├── Learning Goal: Advanced mobile profiling techniques

Lisa Wong (Backend Engineer):
├── Commitment: Database optimization (2 points)
├── Capacity: 6/8 points (2 points reserved for production support)
├── Confidence: 95% ("Straightforward query optimization")
├── Support Needed: DBA review for index changes
├── Learning Goal: Query performance analysis

David Kim (Frontend Engineer):
├── Commitment: Available for stretch goal (3 points)
├── Capacity: 8/8 points
├── Confidence: 90% ("Design assets are ready")
├── Support Needed: Design team collaboration
├── Learning Goal: CSS Grid advanced techniques

Target: Team Commitment Summary:
├── Total Commitment: 15 points (within capacity)
├── Team Confidence: 88% average
├── Stretch Capacity: 3 points available
├── Support Dependencies: 4 identified and planned
├── Learning Objectives: 4 individual goals aligned

[LIST] Sprint Contract:
[OK] Sprint Goal: Unanimously agreed upon
[OK] Story Commitment: All stories have clear owners
[OK] Capacity Allocation: Realistic and consensus-based
[OK] Risk Mitigation: Plans in place for identified risks
[OK] Definition of Done: Reviewed and confirmed
[OK] Success Metrics: Performance targets defined

[SUCCESS] Sprint Kickoff Actions:
├── Environment access provisioned for all team members
├── Daily standup schedule confirmed (9 AM daily)
├── Sprint board configured with committed stories
├── Dependency tracking setup in project management tool
└── Sprint retrospective scheduled for final day
```

## Intelligent Planning Features

### Velocity-Based Forecasting

```python
# Sprint Planning AI Analytics
velocity_analysis = {
    "historical_data": {
        "last_6_sprints": [20, 18, 22, 16, 19, 21],
        "average_velocity": 19.3,
        "velocity_trend": "+5% (improving)",
        "consistency_score": 0.78
    },
    
    "capacity_factors": {
        "team_availability": 0.875,  # 7/8 members available
        "holiday_impact": 0.95,      # Minor holiday impact
        "new_member_ramp": 0.90,     # New team member learning
        "technical_debt": 0.95,      # Low technical debt burden
        "adjusted_capacity": 16.2    # Final capacity calculation
    },
    
    "risk_assessment": {
        "external_dependencies": 0.15,  # 15% risk from external deps
        "technology_risk": 0.10,        # 10% risk from new tech
        "scope_creep_risk": 0.05,       # 5% historical scope creep
        "overall_risk_factor": 0.25,    # 25% total risk
        "recommended_buffer": 0.10      # 10% safety buffer
    }
}
```

### Intelligent Story Prioritization

```
AI-Powered Backlog Prioritization
=================================

[AUTO] Prioritization Factors Analysis:

[METRICS] Business Value Scoring:
├── Revenue Impact: Weighted 40%
├── Customer Satisfaction: Weighted 25%
├── Strategic Alignment: Weighted 20%
├── Risk Mitigation: Weighted 15%

[PROCESS] Technical Factors:
├── Implementation Complexity: Effort required
├── Technical Dependencies: Blocking relationships
├── Knowledge Requirements: Team expertise alignment
├── Infrastructure Impact: System-wide effects

Target: Optimized Sprint Backlog:

Rank 1: USER-234 (Two-Factor Authentication)
├── Business Value: 95/100 (security compliance requirement)
├── Technical Complexity: 8 points
├── Dependencies: 1 external (SMS provider)
├── ROI Score: 11.9 (value/effort ratio)
├── Reasoning: Critical for enterprise sales, clear implementation path

Rank 2: MOBILE-156 (App Performance Optimization)
├── Business Value: 85/100 (customer satisfaction impact)
├── Technical Complexity: 5 points
├── Dependencies: 0 external
├── ROI Score: 17.0
├── Reasoning: High impact, moderate effort, no blocking dependencies

Rank 3: PERF-167 (Database Query Optimization)
├── Business Value: 70/100 (operational efficiency)
├── Technical Complexity: 2 points
├── Dependencies: 0 external
├── ROI Score: 35.0
├── Reasoning: Quick win with measurable performance impact

[STATS] Alternative Scenarios:
├── Scenario A: Focus on security (current plan)
├── Scenario B: Performance-first approach (+2 points capacity)
├── Scenario C: Feature-heavy sprint (-1 point performance)
├── Recommendation: Scenario A balances business needs with team capacity
```

### Cross-Team Coordination

```
Program-Level Sprint Planning
============================

[ENTERPRISE] Multi-Team Coordination (4 teams):

Action: Platform Team (Sprint 24):
├── Commitment: Infrastructure monitoring improvements
├── Deliverables: Performance monitoring dashboard
├── Dependencies To: None
├── Dependencies From: Dev Team A (performance metrics)
├── Impact: Enables performance optimization validation

[SECURITY] Security Team (Sprint 24):
├── Commitment: Security framework enhancements
├── Deliverables: 2FA security review and guidelines
├── Dependencies To: Dev Team A (2FA implementation)
├── Dependencies From: Platform Team (security monitoring)
├── Impact: Ensures enterprise-grade security compliance

[CODE] Dev Team A (Sprint 24) - Our Team:
├── Commitment: 2FA and performance optimization
├── Deliverables: Enterprise authentication and 25% perf improvement
├── Dependencies To: Security Team (review), Platform Team (monitoring)
├── Dependencies From: None (self-contained sprint)
├── Impact: Delivers key enterprise sales enabler

[MOBILE] Mobile Team (Sprint 24):
├── Commitment: iOS/Android app performance
├── Deliverables: Native app startup optimization
├── Dependencies To: Dev Team A (backend performance)
├── Dependencies From: Platform Team (monitoring integration)
├── Impact: Consistent performance experience across platforms

[LINK] Inter-Team Dependencies:
├── Day 3: Security guidelines delivery (Security → Dev A)
├── Day 5: Performance metrics API (Dev A → Platform)
├── Day 7: Security review completion (Security ← Dev A)
├── Day 8: Monitoring integration (Platform → Mobile)

[LIST] Dependency Risk Mitigation:
├── Daily inter-team standup at 10 AM
├── Shared Slack channel: #sprint-24-coordination
├── Escalation path: Team leads → Engineering Manager
├── Contingency plans: Alternative approaches documented
```

## Automated Documentation

### Sprint Planning Artifacts

```yaml
# Auto-Generated Sprint Documentation
sprint_artifacts:
  sprint_goal:
    title: "Enhance Security and Performance Foundation"
    description: "Deliver enterprise-grade authentication while improving core performance"
    success_metrics:
      - "2FA enabled for admin users"
      - "25% improvement in app startup time"
      - "Database query response 25% faster"
    
  story_breakdown:
    committed_stories: 3
    total_points: 15
    stretch_goals: 1
    stretch_points: 3
    
  capacity_planning:
    team_capacity: 16.2
    velocity_average: 18.5
    confidence_buffer: 1.6
    utilization_target: 93%
    
  risk_register:
    high_risks: 1
    medium_risks: 2
    low_risks: 1
    mitigation_plans: 4
    
  dependencies:
    external: 2
    internal: 2
    cross_team: 3
    blocking: 0
```

### Automated Communication

```
Sprint 24 Kickoff Communication
==============================

[EMAIL] Stakeholder Update:

Subject: Sprint 24 Begins - Security & Performance Focus

Dear Stakeholders,

We're excited to kick off Sprint 24 with a focus on enhancing our 
security foundation and improving application performance.

Target: Sprint Highlights:
- Two-factor authentication for enterprise customers
- 25% improvement in mobile app startup performance  
- Database optimization for faster query response
- Strong team commitment with 88% confidence level

[SCHEDULE] Key Milestones:
- Day 3: Security guidelines and SMS provider integration
- Day 7: 2FA security review completion
- Day 9: Performance testing and validation
- Day 10: Sprint review and demonstration

[COLLAB] How You Can Help:
- Product Team: Maintain scope stability (no new requirements)
- Security Team: Prioritize 2FA review by Day 7
- Customer Success: Prepare enterprise customers for 2FA rollout

We'll provide updates in our weekly sprint review. Questions welcome!

Best regards,
Sprint Planning Automation System

---

[MOBILE] Slack Notification:

Action: #announcements
Sprint 24 is underway! Target:

Goal: Security & Performance Foundation
- [AUTH] Two-factor authentication
- Quick: 25% faster mobile app startup
- [DATABASE] Database query optimization

Team commitment: 15 points with 88% confidence
Next update: Wednesday sprint review

 Let's make it happen!

---

[STATS] Jira/Project Tool Updates:
- Sprint board configured with committed stories
- Burndown chart initialized
- Dependency tracking activated
- Risk register published
- Daily standup reminders scheduled
```

## Analytics and Optimization

### Sprint Performance Tracking

```
Sprint Planning Effectiveness Analysis
=====================================

[STATS] Planning Accuracy (Last 6 Sprints):
├── Commitment vs Delivery: 94% accuracy
├── Story Point Estimation: ±15% variance (target: ±20%)
├── Sprint Goal Achievement: 83% success rate
├── Scope Change Rate: 8% (target: <10%)

Target: Velocity Predictability:
├── Velocity Variance: 12% standard deviation
├── Capacity Utilization: 91% average
├── Team Satisfaction: 4.3/5.0 with planning process
├── Stakeholder Satisfaction: 4.1/5.0 with delivery predictability

Quick: Planning Efficiency:
├── Planning Session Duration: 4.2 hours average (target: 4 hours)
├── Estimation Accuracy: 78% within ±1 story point
├── Dependency Identification: 89% of blockers identified in planning
├── Risk Prediction: 67% of actual issues were anticipated

[PROCESS] Continuous Improvement Insights:
├── Best Practice: Technical spike stories improve estimation accuracy
├── Opportunity: Cross-team dependency planning needs improvement
├── Success: Capacity buffer prevents overcommitment
├── Learning: Story breakdown quality correlates with delivery success

[METRICS] Recommendations for Next Sprint:
├── Increase cross-team coordination time by 30 minutes
├── Add technical feasibility review for complex stories
├── Implement risk scoring for better priority decisions
├── Continue current estimation and commitment practices
```

### Team Development Metrics

```python
# Team Growth and Learning Analytics
team_development = {
    "skill_progression": {
        "estimation_accuracy": {
            "sprint_20": 0.65,
            "sprint_21": 0.72,
            "sprint_22": 0.78,
            "sprint_23": 0.81,
            "trend": "improving +4% per sprint"
        },
        
        "planning_engagement": {
            "participation_rate": 0.96,
            "question_quality": 4.2,
            "solution_contributions": 3.8,
            "confidence_in_estimates": 4.1
        }
    },
    
    "collaboration_quality": {
        "cross_functional_discussion": 4.4,
        "consensus_building": 4.2,
        "conflict_resolution": 4.0,
        "knowledge_sharing": 4.3
    },
    
    "process_maturity": {
        "self_organization": 4.1,
        "problem_identification": 4.4,
        "solution_orientation": 4.2,
        "continuous_improvement": 4.0
    }
}
```

## Integration Features

### Agile Tool Integration

```yaml
# Integration Configuration
integrations:
  jira:
    auto_create_sprint: true
    import_backlog: true
    update_story_points: true
    track_burndown: true
    
  azure_devops:
    sync_capacity: true
    update_iterations: true
    track_velocity: true
    generate_reports: true
    
  github:
    link_pull_requests: true
    track_commit_activity: true
    monitor_code_review: true
    
  slack:
    daily_standup_reminders: true
    sprint_milestone_updates: true
    blocker_escalations: true
    
  confluence:
    auto_update_documentation: true
    create_sprint_pages: true
    track_decision_records: true
```

### Calendar and Resource Management

- **Google Calendar**: Automatic sprint ceremony scheduling
- **Outlook**: Team availability and capacity planning
- **Resource Planning**: Skills matrix and allocation optimization
- **Training Coordination**: Learning objectives and development planning
- **Performance Tracking**: Individual and team growth metrics

## Related Commands

- `/daily-standup` - Track daily progress against sprint commitments
- `/code-review` - Ensure quality standards during sprint development
- `/release-notes` - Prepare release communication for sprint deliverables
- `/incident-response` - Handle production issues that impact sprint work
- `/workflow-builder` - Create custom sprint processes and automation

```xml
<role>
You are an expert agile project manager with deep knowledge of sprint planning, team coordination, and project management methodologies. You specialize in efficient sprint planning and team productivity optimization.
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
