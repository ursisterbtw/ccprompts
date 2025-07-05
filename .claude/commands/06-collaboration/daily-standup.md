---
description: Automated daily standup preparation with team coordination and progress tracking
allowed-tools: Bash(git:*), Read, Write, mcp__slack__*, mcp__jira__*, mcp__github__*
---

# Daily Standup Automation

## Team Context Analysis
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline --since="24 hours ago" --author="$(git config user.name)" | head -5`
- Modified files: !`git status --porcelain | head -10`
- Current sprint: !`git log --oneline --since="1 week ago" | wc -l` commits this week

## Standup Focus
Team/Format: **$ARGUMENTS** (e.g., "slack", "jira-integration", "team-alpha", "remote")

## 📊 Daily Standup Intelligence

### 1. Yesterday's Accomplishments
- **Completed work**: Analyze git commits and closed issues
- **Code contributions**: Pull requests merged and reviewed
- **Collaboration**: Code reviews, pair programming sessions
- **Problem solving**: Bug fixes and issue resolutions

### 2. Today's Planned Work
- **Current task analysis**: Branch name and commit context
- **Priority assessment**: High-impact work identification
- **Dependency mapping**: Blocked or blocking work
- **Collaboration needs**: Pair programming or review requests

### 3. Blockers & Impediments
- **Technical blockers**: Build failures, test issues, environment problems
- **Dependency blockers**: Waiting for external teams or services
- **Knowledge gaps**: Areas needing help or mentoring
- **Process issues**: Workflow or tooling problems

## 🤖 Intelligent Standup Generation

### Automated Progress Analysis
```
📈 **Yesterday's Progress:**
- Completed feature authentication module (3 commits)
- Fixed critical bug in user service (issue #123)
- Reviewed 2 pull requests for team members
- Updated documentation for API endpoints

🎯 **Today's Plan:**
- Implement user permission system
- Address performance issues in dashboard
- Code review session with Sarah at 2 PM
- Sprint planning preparation

🚫 **Blockers:**
- Waiting for database schema approval from DBA team
- Need clarification on user role requirements
- Local development environment Docker issues
```

## 🔗 Team Integration Features

### Slack Integration
If MCP Slack server available:
- **Automated posting**: Post standup to team channel
- **Status updates**: Update Slack status with current work
- **Thread management**: Respond to standup threads
- **Meeting scheduling**: Coordinate impromptu discussions

### Jira Integration
If MCP Jira server available:
- **Issue status sync**: Update ticket statuses automatically
- **Time logging**: Log work time against issues
- **Sprint tracking**: Update sprint progress
- **Backlog grooming**: Identify ready issues

### GitHub Integration
If MCP GitHub server available:
- **PR status**: Summarize pull request activity
- **Issue tracking**: Update issue comments and status
- **Code review metrics**: Track review participation
- **Release planning**: Identify release-ready features

## 📋 Standup Formats

### Scrum Format
- **Yesterday**: What did I complete?
- **Today**: What will I work on?
- **Blockers**: What's preventing progress?

### Kanban Format
- **In Progress**: Current work status
- **Done**: Recently completed work
- **Next**: Upcoming priorities
- **Help Needed**: Assistance requests

### Remote Team Format
- **Async updates**: Detailed written updates
- **Timezone coordination**: Schedule-aware planning
- **Documentation**: Comprehensive context sharing
- **Follow-up actions**: Clear next steps

## 🎯 Smart Recommendations

### Work Prioritization
- **High-impact tasks**: Critical path identification
- **Quick wins**: Low-effort, high-value opportunities
- **Technical debt**: Maintenance work scheduling
- **Learning goals**: Skill development opportunities

### Collaboration Opportunities
- **Pair programming**: Complex problem collaboration
- **Knowledge sharing**: Cross-team learning
- **Code review**: Quality improvement participation
- **Mentoring**: Junior developer support

### Process Improvements
- **Workflow optimization**: Efficiency improvements
- **Tool adoption**: Better development tools
- **Communication**: Team coordination enhancement
- **Documentation**: Knowledge capture improvement

## 📊 Team Analytics

### Individual Metrics
- **Commit frequency**: Development velocity tracking
- **Review participation**: Code quality contribution
- **Issue resolution**: Problem-solving efficiency
- **Knowledge sharing**: Team contribution measurement

### Team Health Indicators
- **Collaboration index**: Cross-team interaction levels
- **Blocker resolution time**: Process efficiency
- **Sprint velocity**: Delivery predictability
- **Work distribution**: Load balancing across team

## 🔄 Continuous Improvement

### Retrospective Integration
- **Pattern recognition**: Recurring blocker identification
- **Success analysis**: High-performing work patterns
- **Process gaps**: Workflow improvement opportunities
- **Team dynamics**: Collaboration effectiveness

### Action Item Tracking
- **Follow-up automation**: Ensure blocker resolution
- **Progress monitoring**: Track improvement initiatives
- **Success measurement**: Quantify process improvements
- **Learning capture**: Document lessons learned

Generate intelligent, context-aware daily standup updates with team coordination and progress tracking!

## 🚀 Advanced Standup Features (migrated from legacy extras command)

### Standup Preparation

#### Automated Update Generation

```
Personal Standup Update - TEMPLATE
=================================

✅ Yesterday's Accomplishments:
- Summarize key completed tasks

🎯 Today's Goals:
- Outline main objectives for the day

🚫 Blockers & Issues:
- List any impediments needing assistance

⏱️ Capacity Today: _hours available_
```

#### Intelligent Blocking Detection (sample logic)

```python
blocking_patterns = {
    "external_dependency": {
        "indicators": ["waiting for approval", "blocked by external team"],
        "auto_actions": ["escalate_to_team_lead", "find_alternative_approach"]
    },
    "technical_blocker": {
        "indicators": ["environment not working", "build failing"],
        "auto_actions": ["create_incident_ticket", "suggest_workarounds"]
    }
}
```

#### Progress Tracking Metrics
- **Sprint Goal Alignment**
- **Story Point Completion**
- **Velocity Trends**
- **Quality Metrics**

### Asynchronous & Cross-Team Support
- Distributed-team async update schedule examples
- Cross-team dependency hand-off template
- Automated follow-up reminders and escalation rules

> NOTE: The full legacy content has been condensed for brevity. See commit history if you need the verbatim original text.