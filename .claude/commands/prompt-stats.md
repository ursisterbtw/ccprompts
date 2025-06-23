# Prompt-Stats Command

This command provides comprehensive usage analytics and effectiveness metrics for prompts and workflows.

## Usage
```
/prompt-stats [scope] [timeframe] [format]
```

## Parameters
- `scope`: personal, team, project, global, prompt-name
- `timeframe`: today, week, month, quarter, year, all-time
- `format`: summary, detailed, export, dashboard

## Examples
```
/prompt-stats
/prompt-stats team month
/prompt-stats personal week detailed
/prompt-stats security-audit.md quarter
/prompt-stats global all-time export
```

## Description
Advanced analytics system for prompt usage and effectiveness:
1. Comprehensive usage statistics and trends
2. Success rate analysis and performance metrics
3. Comparative analysis across prompts and timeframes
4. User behavior patterns and adoption metrics
5. ROI calculation and productivity impact measurement
6. Predictive analytics for optimization recommendations

## Analytics Categories

### Usage Statistics
- **Execution Frequency**: How often prompts are used
- **Completion Rates**: Percentage of successful executions
- **Duration Metrics**: Average time to completion
- **Retry Patterns**: Failure and retry analysis
- **User Adoption**: New user onboarding and engagement
- **Geographic Distribution**: Usage patterns across locations

### Effectiveness Metrics
- **Success Rate**: Percentage of prompts achieving intended outcomes
- **Quality Scores**: User satisfaction and output quality ratings
- **Time to Value**: Speed of achieving business objectives
- **Error Reduction**: Impact on bug rates and quality issues
- **Productivity Gains**: Developer velocity improvements
- **Cost Savings**: Resource optimization and efficiency gains

### Performance Analysis
- **Execution Time**: Prompt completion time distributions
- **Resource Usage**: CPU, memory, and network utilization
- **Scalability Metrics**: Performance under different loads
- **Bottleneck Identification**: Slowest steps and optimization opportunities
- **Capacity Planning**: Resource requirements for different usage patterns
- **SLA Compliance**: Meeting defined performance targets

## Report Formats

### Summary Dashboard
```
Claude Code Prompt Analytics Dashboard
=====================================

📊 Usage Overview (Last 30 Days)
├── Total Executions: 1,247 (+23% vs. previous month)
├── Unique Users: 87 (+15% vs. previous month)
├── Success Rate: 91.2% (+2.1% vs. previous month)
└── Avg. Completion Time: 42 minutes (-8% vs. previous month)

🏆 Top Performing Prompts
1. security-audit.md           (Success: 96%, Usage: 156 times)
2. test-comprehensive.md       (Success: 94%, Usage: 143 times)
3. setup-ci.md                 (Success: 89%, Usage: 134 times)
4. document-auto-generated.md  (Success: 98%, Usage: 112 times)
5. harden-enterprise.md        (Success: 87%, Usage: 89 times)

📈 Trending Prompts (+50% usage this month)
├── mcp-custom-server.md       (+127% usage)
├── optimize-performance.md    (+89% usage)
└── comply-gdpr.md            (+67% usage)

⚠️  Attention Needed
├── modernize-legacy.md        (Success: 67%, needs optimization)
├── deploy-kubernetes.md       (Avg. time: 3.2 hours, investigate)
└── migrate-database.md        (High retry rate: 23%)
```

### Detailed Analytics
```
Detailed Analysis: security-audit.md
===================================

📊 Usage Statistics (Last Quarter)
├── Total Executions: 234
├── Unique Users: 45
├── Success Rate: 89.3%
├── Average Duration: 2.3 hours
├── Completion Distribution:
│   ├── < 1 hour: 12%
│   ├── 1-2 hours: 34%
│   ├── 2-4 hours: 41%
│   └── > 4 hours: 13%

🎯 Effectiveness Metrics
├── User Satisfaction: 4.6/5.0 (142 ratings)
├── Vulnerabilities Found: 1,847 total (avg: 7.9 per execution)
├── Critical Issues: 234 total (avg: 1.0 per execution)
├── Time to Fix: 4.2 days average
├── Repeat Usage Rate: 78% (users run again within 90 days)

📉 Failure Analysis
├── Common Failure Points:
│   ├── Environment setup: 31% of failures
│   ├── Permission issues: 24% of failures
│   ├── Tool dependencies: 19% of failures
│   └── Configuration errors: 26% of failures
├── Most Common Error Messages:
│   ├── "Docker not found": 15% of failures
│   ├── "Insufficient permissions": 12% of failures
│   └── "Network timeout": 8% of failures

🔄 Usage Patterns
├── Peak Usage Hours: 9-11 AM, 2-4 PM UTC
├── Day of Week Distribution:
│   ├── Monday-Friday: 82%
│   └── Weekend: 18%
├── Seasonal Trends: +40% usage before major releases
├── Team Size Correlation: Higher success rate with teams of 3-8
```

### Comparative Analysis
```
Prompt Comparison: Security Category (Last Month)
================================================

                     │ Executions │ Success │ Avg Time │ Satisfaction
─────────────────────┼────────────┼─────────┼──────────┼─────────────
security-audit.md    │    156     │  96.2%  │  2.3h    │    4.6/5
harden-enterprise.md │     89     │  87.1%  │  3.1h    │    4.4/5
comply-soc2.md       │     67     │  92.5%  │  4.2h    │    4.8/5
penetration-test.md  │     43     │  81.4%  │  5.1h    │    4.2/5
access-control.md    │     34     │  94.1%  │  1.8h    │    4.5/5

📊 Category Performance
├── Average Success Rate: 90.3%
├── Total Time Investment: 712 hours
├── Estimated Value Generated: $142,400 (avg $200/hour)
├── ROI: 340% (based on prevented security incidents)
```

## Predictive Analytics

### Usage Forecasting
- Predict future prompt usage based on historical trends
- Identify seasonal patterns and capacity planning needs
- Forecast user adoption rates for new prompts
- Estimate resource requirements for different growth scenarios

### Success Optimization
- Identify factors contributing to prompt success
- Recommend optimal timing for prompt execution
- Suggest personalized prompt sequences for better outcomes
- Predict likelihood of success before execution

### Trend Analysis
- Identify emerging usage patterns and requirements
- Predict which prompts will become popular
- Analyze technology adoption impact on prompt usage
- Forecast team productivity improvements

## User Behavior Analysis

### Adoption Patterns
```
User Adoption Analysis
=====================

🆕 New User Journey (Last 90 Days)
├── Most Common First Prompts:
│   1. comprehensive-bootstrap.md (34% of new users)
│   2. analyze-project.md (28% of new users)
│   3. setup-ci.md (19% of new users)
├── Time to Second Prompt: 3.2 days average
├── 30-Day Retention Rate: 67%
├── Power User Conversion: 23% (>10 prompts/month)

👥 Team Collaboration Patterns
├── Team Size vs. Success Rate:
│   ├── Solo developers: 85% success rate
│   ├── 2-5 developers: 91% success rate
│   ├── 6-15 developers: 94% success rate
│   └── 16+ developers: 89% success rate
├── Knowledge Sharing Indicators:
│   ├── Prompt reuse across team members: 78%
│   ├── Workflow template sharing: 45%
│   └── Custom prompt creation: 12%
```

### Expertise Development
- Track user skill progression over time
- Identify learning paths and successful patterns
- Measure time to proficiency for different prompts
- Recommend next steps for skill development

## Business Impact Metrics

### Productivity Measurements
- Developer velocity improvements
- Time saved through automation
- Reduction in manual processes
- Quality improvements and defect reduction

### Cost-Benefit Analysis
- Time investment vs. value generated
- Resource optimization savings
- Incident prevention value
- Training and onboarding cost reduction

### ROI Calculations
```
Return on Investment Analysis
============================

📈 Productivity Gains (Last Quarter)
├── Total Time Invested: 2,340 hours
├── Estimated Value Generated: $468,000
├── Direct Cost Savings: $187,200
├── Indirect Benefits: $124,800
├── Net ROI: 340%

💰 Cost Breakdown
├── Developer Time: $234,000 (2,340 hours × $100/hour)
├── Tool and Infrastructure: $12,000
├── Training and Setup: $8,000
├── Total Investment: $254,000

🎯 Value Generation
├── Faster Development: $156,000 (780 hours saved)
├── Reduced Bugs: $89,000 (445 incidents prevented)
├── Security Improvements: $98,000 (estimated incident prevention)
├── Documentation Value: $45,000 (knowledge creation)
├── Process Improvements: $80,000 (efficiency gains)
```

## Export and Integration

### Data Export Formats
- CSV for spreadsheet analysis
- JSON for API integration
- PDF for executive reporting
- XML for system integration
- Interactive dashboards for ongoing monitoring

### Integration Capabilities
- Business intelligence tools (Tableau, Power BI)
- Project management systems (Jira, Asana)
- Communication platforms (Slack, Teams)
- Monitoring systems (Grafana, DataDog)
- Custom reporting tools and APIs

## Privacy and Security
- Anonymized usage data for privacy protection
- Configurable data retention policies
- Secure aggregation for team statistics
- Opt-out capabilities for privacy-conscious users
- Compliance with data protection regulations

## Related Commands
- `/analyze-project` - Get analytics-driven project recommendations
- `/workflow-builder` - Use analytics to optimize workflow design
- `/health-check` - Compare project health with benchmark statistics
- `/smart-suggest` - Leverage usage patterns for personalized recommendations