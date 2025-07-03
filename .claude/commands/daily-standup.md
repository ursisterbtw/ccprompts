# Daily-Standup Command

This command automates daily standup preparation and facilitates efficient team communication.

## Usage

```
/daily-standup [mode] [scope] [format]
```

## Parameters

- `mode`: prepare, facilitate, summarize, async
- `scope`: personal, team, project, cross-team
- `format`: slack, teams, zoom, email, markdown

## Examples

```
/daily-standup prepare personal markdown
/daily-standup facilitate team slack
/daily-standup summarize project email
/daily-standup async team slack
```

## Description

Comprehensive daily standup automation and facilitation system:

1. Automated preparation of standup updates and progress summaries
2. Intelligent blocking issue identification and resolution suggestions
3. Goal tracking and progress visualization
4. Action item management and follow-up coordination
5. Cross-team communication and dependency management
6. Asynchronous standup support for distributed teams

## Standup Preparation

### Automated Update Generation

```
Personal Standup Update - January 15, 2024
==========================================

👋 Good morning team!

✅ Yesterday's Accomplishments:
├── Completed user authentication refactoring (Issue #234)
├── Fixed performance bottleneck in API pagination (Issue #198)
├── Reviewed and merged 3 pull requests
├── Updated documentation for new auth flow
└── Participated in architecture review meeting

🎯 Today's Goals:
├── Implement two-factor authentication (Issue #245)
├── Optimize database queries for user dashboard (Issue #201)
├── Code review for payment processing PR (#156)
├── Team planning session at 3 PM
└── Update test coverage for auth module

🚫 Blockers & Issues:
├── Waiting for security team approval on 2FA implementation
├── Database migration needs DBA review before proceeding
└── External API rate limiting affecting testing

⏱️ Capacity Today: 7/8 hours (1 hour blocked on external dependencies)

📊 Sprint Progress:
├── Completed: 13/20 story points
├── In Progress: 4/20 story points  
├── Blocked: 3/20 story points
└── On track for sprint goal: ✅ Yes

🔄 Follow-ups Needed:
├── @security-team: 2FA implementation review
├── @database-team: Migration approval
└── @product-team: Clarification on user flow edge cases
```

### Intelligent Blocking Detection

```python
# Automated Blocker Detection
blocking_patterns = {
    "external_dependency": {
        "indicators": [
            "waiting for approval",
            "blocked by external team",
            "third-party service issue"
        ],
        "severity": "high",
        "auto_actions": [
            "escalate_to_team_lead",
            "find_alternative_approach",
            "update_timeline_estimates"
        ]
    },
    
    "technical_blocker": {
        "indicators": [
            "environment not working",
            "build failing",
            "test suite broken"
        ],
        "severity": "critical",
        "auto_actions": [
            "create_incident_ticket",
            "assign_to_platform_team",
            "suggest_workarounds"
        ]
    },
    
    "knowledge_gap": {
        "indicators": [
            "need help with",
            "don't understand",
            "unclear requirements"
        ],
        "severity": "medium",
        "auto_actions": [
            "suggest_knowledge_resources",
            "identify_subject_matter_expert",
            "schedule_pairing_session"
        ]
    }
}
```

### Progress Tracking

- **Sprint Goal Alignment**: Track progress toward sprint objectives
- **Story Point Completion**: Visualize work completed vs. planned
- **Velocity Tracking**: Historical velocity comparison and trends
- **Deadline Monitoring**: Identify at-risk deliverables and dependencies
- **Quality Metrics**: Test coverage, code review, and technical debt

## Team Facilitation

### Automated Standup Facilitation

```
Daily Standup Facilitation - Dev Team Alpha
==========================================

🕐 Meeting Started: 9:00 AM | Duration: 15 minutes max

📋 Today's Agenda:
1. Quick wins and accomplishments (5 min)
2. Today's priorities and commitments (5 min)
3. Blockers and support needed (5 min)

👥 Team Member Updates:

[1/6] Sarah Chen - Frontend Engineer
├── ✅ Completed: Mobile responsive design for dashboard
├── 🎯 Today: Implement dark mode toggle, accessibility testing
├── 🚫 Blockers: None
├── 📈 Sprint Progress: 8/10 points completed

[2/6] Mike Johnson - Backend Engineer  
├── ✅ Completed: API rate limiting implementation
├── 🎯 Today: Database optimization, payment webhook handling
├── 🚫 Blockers: Waiting for third-party API documentation
├── 📈 Sprint Progress: 12/15 points completed

[3/6] Lisa Wong - DevOps Engineer
├── ✅ Completed: Production deployment pipeline updates
├── 🎯 Today: Monitoring dashboard setup, SSL certificate renewal
├── 🚫 Blockers: None
├── 📈 Sprint Progress: 6/8 points completed

⚠️ Identified Issues:
├── Mike blocked on external API documentation
├── Team velocity slightly behind (65% vs 70% target)
└── Two PRs waiting for review for 2+ days

🎯 Action Items:
├── @mike Follow up with vendor for API documentation (by noon)
├── @team-lead Prioritize PR reviews to unblock progress
└── @lisa Share monitoring dashboard setup guide

📊 Team Health Check:
├── Velocity: On track (minor concern)
├── Blockers: 1 external dependency
├── Morale: Good (no concerns raised)
└── Sprint Goal: Achievable with current pace
```

### Cross-Team Coordination

```
Cross-Team Standup Summary
=========================

🏢 Platform Engineering Team
├── Completed: Kubernetes cluster upgrade
├── Today: Service mesh implementation, monitoring setup
├── Blockers: None
├── Impacts: Improved performance for all product teams

🛡️ Security Team
├── Completed: Vulnerability assessment report
├── Today: Penetration testing, security training prep
├── Blockers: Waiting for compliance team input
├── Impacts: Authentication changes affect all teams

💼 Product Team
├── Completed: User research synthesis, feature prioritization
├── Today: Roadmap planning, stakeholder meetings
├── Blockers: Waiting for technical feasibility analysis
├── Impacts: New feature requests for Q2

🔗 Dependencies & Handoffs:
├── Security → Dev Teams: 2FA implementation guidelines (today)
├── Platform → Dev Teams: New deployment process (tomorrow)
├── Product → Dev Teams: Feature requirements (end of week)
└── Dev Teams → QA: Feature testing (ongoing)
```

## Asynchronous Standup Support

### Distributed Team Management

```
Async Standup - Global Development Team
======================================

🌍 Team Distribution:
├── 🇺🇸 San Francisco (3 members) - PST
├── 🇬🇧 London (4 members) - GMT
├── 🇮🇳 Bangalore (5 members) - IST
└── 🇦🇺 Sydney (2 members) - AEST

📅 Update Schedule:
├── Monday-Friday: Daily async updates
├── Tuesday/Thursday: Live sync at 9 AM GMT
├── Weekly: Cross-timezone team sync
└── Monthly: Full team video standup

🔄 Async Update Format:
Team members post updates when starting their day:

@sarah.chen (SF - 9:00 AM PST)
✅ Yesterday: Completed user onboarding flow
🎯 Today: Mobile app testing, team sync at 5 PM
🚫 Blockers: Need API spec from @raj.patel

@raj.patel (Bangalore - 9:30 AM IST)  
✅ Yesterday: API documentation, performance testing
🎯 Today: Database optimization, code review
🚫 Blockers: None, will unblock @sarah.chen

@emma.wilson (London - 9:00 AM GMT)
✅ Yesterday: Security review, deployment scripts
🎯 Today: Monitoring setup, team planning
🚫 Blockers: AWS access permissions needed

🤖 AI Summary (generated at 12:00 PM GMT):
- Progress: 85% team completed their planned work
- Blockers: 2 active (1 resolved during async updates)
- Handoffs: 3 completed, 1 pending
- Concerns: None identified
```

### Follow-up Automation

```yaml
# Automated Follow-up Configuration
async_standup:
  notifications:
    missing_update:
      trigger: "2 hours after team start time"
      reminder: "gentle"
      escalation: "team_lead after 4 hours"
    
    blocker_resolution:
      track_progress: true
      auto_check_in: "24 hours"
      escalate_if_stuck: "48 hours"
    
    action_items:
      auto_create_tickets: true
      assign_to_owners: true
      due_date_reminders: true
    
  analysis:
    velocity_tracking: true
    blocker_patterns: true
    team_health_metrics: true
    communication_effectiveness: true
```

## Progress Visualization

### Sprint Dashboard

```
Sprint 23 Dashboard - Week 2 of 2
=================================

📊 Overall Progress:
████████████████░░░░ 80% Complete (16/20 story points)

🎯 Sprint Goals:
├── ✅ User authentication overhaul (Complete)
├── 🔄 Payment system integration (80% complete)
├── 🔄 Mobile app performance (60% complete)
└── ⏳ Admin dashboard updates (Not started)

📈 Velocity Tracking:
├── Planned: 20 story points
├── Completed: 16 story points
├── Burned: 8 days (2 days remaining)
├── Trend: On track (+2 points ahead of schedule)

🚫 Blocker Analysis:
├── Total blockers this sprint: 5
├── Average resolution time: 1.2 days
├── Currently blocked: 1 item (external dependency)
├── Blocker impact: -1 story point

👥 Team Contributions:
├── Sarah: 6 points (125% of capacity)
├── Mike: 5 points (100% of capacity)
├── Lisa: 3 points (75% of capacity)
├── David: 2 points (50% of capacity - planned vacation)

🔮 Sprint Forecast:
├── Completion probability: 95%
├── Risk factors: 1 external dependency
├── Mitigation: Alternative approach identified
└── Recommendation: Proceed with confidence
```

### Team Health Metrics

```
Team Health & Engagement Metrics
================================

📈 Communication Effectiveness:
├── Standup Participation: 96% (14/14 days)
├── Blocker Resolution Rate: 85% (within 24 hours)
├── Cross-team Coordination: Good (3 successful handoffs)
├── Knowledge Sharing: 12 sessions this sprint

🎯 Goal Achievement:
├── Personal Goals Met: 78% average
├── Team Goals Met: 85% average
├── Sprint Goals Met: 92% (last 3 sprints)
├── Deadline Adherence: 94%

😊 Wellbeing Indicators:
├── Workload Balance: Good (no overtime concerns)
├── Skill Development: 3 learning sessions completed
├── Team Satisfaction: 4.2/5.0 (monthly survey)
├── Stress Level: Normal (no burnout indicators)

🔄 Process Improvements:
├── Standup Duration: 12 min avg (within 15 min target)
├── Action Items: 89% completion rate
├── Follow-up Effectiveness: Improved (+15% vs last sprint)
└── Retrospective Items: 85% implemented
```

## Integration Features

### Communication Platform Integration

```typescript
// Slack Integration Example
const slackIntegration = {
  channels: {
    standup: "#daily-standup",
    blockers: "#help-needed", 
    announcements: "#team-updates"
  },
  
  automation: {
    daily_reminder: "8:45 AM",
    update_collection: "9:00-10:00 AM",
    summary_posting: "10:30 AM",
    blocker_escalation: "2 hours"
  },
  
  templates: {
    personal_update: "standup-template.md",
    team_summary: "team-summary.md",
    action_items: "action-items.md"
  }
};
```

### Project Management Integration

- **Jira**: Automatic story point tracking and velocity calculation
- **Azure DevOps**: Work item status and progress reporting
- **Asana**: Task completion and milestone tracking
- **Trello**: Board updates and card movement tracking
- **GitHub**: PR status, issue tracking, and milestone progress

### Calendar Integration

- **Google Calendar**: Automatic meeting scheduling and reminders
- **Outlook**: Team availability and meeting coordination
- **Calendly**: Flexible scheduling for cross-timezone teams
- **Zoom**: Automatic meeting creation and recording
- **Teams**: Seamless video conferencing integration

## Analytics and Insights

### Team Performance Analytics

```python
# Standup Analytics Dashboard
analytics_metrics = {
    "participation": {
        "attendance_rate": 0.94,
        "on_time_rate": 0.87,
        "engagement_score": 4.2
    },
    
    "efficiency": {
        "avg_duration": 12.3,  # minutes
        "action_items_per_standup": 2.1,
        "blocker_resolution_time": 1.4,  # days
        "follow_up_completion": 0.89
    },
    
    "outcomes": {
        "sprint_goal_achievement": 0.85,
        "velocity_consistency": 0.92,
        "blocker_prevention": 0.78,
        "team_satisfaction": 4.1
    }
}
```

### Predictive Analytics

- **Blocker Prediction**: AI-powered identification of potential blockers
- **Velocity Forecasting**: Sprint completion probability calculation
- **Risk Assessment**: Early warning system for project delays
- **Team Health**: Burnout and engagement trend analysis
- **Process Optimization**: Data-driven standup improvement suggestions

## Customization Options

### Team-Specific Templates

```yaml
# Team Configuration Example
team_config:
  name: "Frontend Development Team"
  standup_time: "9:00 AM PST"
  duration_target: 15  # minutes
  
  update_format:
    include_yesterday: true
    include_today: true
    include_blockers: true
    include_metrics: true
    include_mood: false
    
  automation:
    preparation_reminder: "30 minutes before"
    blocker_escalation: "2 hours"
    summary_distribution: "all team members"
    
  integrations:
    project_management: "jira"
    communication: "slack"
    calendar: "google"
    
  metrics:
    track_velocity: true
    track_blockers: true
    track_satisfaction: true
    track_skills: false
```

### Custom Workflows

- **Retrospective Integration**: Connect standup insights to retrospectives
- **Performance Reviews**: Use standup data for performance evaluation
- **Capacity Planning**: Historical data for future sprint planning
- **Skill Development**: Identify learning opportunities from blockers
- **Process Improvement**: Continuous optimization based on metrics

## Related Commands

- `/code-review` - Code review automation and quality gates
- `/incident-response` - Handle production issues and blockers
- `/workflow-builder` - Create custom standup workflows
- `/prompt-stats` - Analyze standup effectiveness and improvements
- `/health-check` - Team and project health assessment

```xml
<role>
You are an expert agile coach with deep knowledge of team coordination, communication facilitation, and daily standup optimization. You specialize in efficient team coordination and progress tracking.
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
