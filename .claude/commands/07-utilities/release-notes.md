# Release-Notes Command

This command automates comprehensive release note generation with intelligent content curation and multi-audience formatting.

## Usage

```bash
/release-notes [version] [audience] [format]
```

## Parameters

- `version`: auto, major, minor, patch, specific-version
- `audience`: technical, business, customer, internal, all
- `format`: markdown, html, email, slack, pdf, changelog

## Examples

```bash
/release-notes auto customer markdown
/release-notes v2.1.0 technical html
/release-notes minor business email
/release-notes patch all slack
```

## Description

Intelligent release note automation system:

1. Automated content extraction from commits, PRs, and issues
2. AI-powered categorization and impact analysis
3. Multi-audience content adaptation and formatting
4. Visual asset generation and integration
5. Distribution automation across multiple channels
6. Feedback collection and continuous improvement

## Content Generation

### Automated Content Extraction

```python
# Release Content Analysis
release_analysis = {
    "version": "v2.1.0",
    "commits_analyzed": 147,
    "prs_merged": 23,
    "issues_closed": 18,
    "contributors": 8,
    
    "changes_by_type": {
        "features": 12,
        "bug_fixes": 8,
        "improvements": 15,
        "security": 3,
        "performance": 6,
        "breaking_changes": 2
    },
    
    "impact_analysis": {
        "customer_facing": 18,
        "internal_only": 5,
        "critical_fixes": 3,
        "performance_gains": "15-25%",
        "security_enhancements": 3
    }
}
```

### Intelligent Categorization

```
Release Content Analysis - Version 2.1.0
========================================

New Features (12 items):
├── Advanced Search Filters (Customer Impact: High)
│   ├── Commit: feat: implement advanced search with filters #234
│   ├── PR: #156 - Advanced Search Implementation
│   └── Impact: Improves user productivity by 35%
├── Real-time Notifications (Customer Impact: High)
│   ├── Commit: feat: add real-time notification system #198
│   ├── PR: #167 - WebSocket Notification System
│   └── Impact: Reduces response time for critical updates
├── API Rate Limiting (Customer Impact: Medium)
│   ├── Commit: feat: implement API rate limiting #245
│   ├── PR: #178 - Rate Limiting Middleware
│   └── Impact: Improved system stability and fair usage

Bug Fixes (8 items):
├── Payment Processing Timeout (Customer Impact: Critical)
│   ├── Issue: #189 - Payment processing failures
│   ├── PR: #192 - Fix payment timeout handling
│   └── Impact: Resolves 95% of payment processing issues
├── Dashboard Loading Performance (Customer Impact: High)
│   ├── Issue: #201 - Slow dashboard loading
│   ├── PR: #205 - Optimize dashboard queries
│   └── Impact: 60% faster dashboard load times
├── Mobile Responsive Layout (Customer Impact: Medium)
│   ├── Issue: #167 - Mobile layout broken
│   ├── PR: #171 - Fix mobile responsive design
│   └── Impact: Better mobile user experience

Performance Improvements (6 items):
├── Database Query Optimization (15% faster queries)
├── Frontend Bundle Size Reduction (40% smaller bundles)
├── API Response Time Improvement (25% faster responses)
├── Memory Usage Optimization (30% reduction)
├── CDN Integration (50% faster static asset loading)
└── Background Job Processing (2x faster processing)

Security Enhancements (3 items):
├── Two-Factor Authentication Implementation
├── API Security Headers Enhancement
└── Dependency Vulnerability Fixes (12 vulnerabilities)

Breaking Changes (2 items):
├── API Version Update (v2 to v3)
│   └── Migration Guide: docs/api-migration-v3.md
└── Authentication Token Format Change
    └── Auto-migration: Existing tokens valid for 30 days
```

## Multi-Audience Adaptation

### Customer-Facing Release Notes

```
What's New in Version 2.1.0
===============================

Latest improvements and new features:

New Features:

Advanced Search & Filtering
Find exactly what you're looking for with new search filters. 
Filter by date, category, status, and more to get results in seconds.
→ Available in all paid plans

[MOBILE] Real-Time Notifications  
Stay in the loop with instant notifications for important updates.
Get notified immediately when someone mentions you, assigns you a task, 
or when critical events happen.
→ Available for all users

Performance Improvements
Pages load 60% quicker and dashboard performance has been improved.

Bug Fixes:

Payment Processing Improvements
Fixed issues causing payment timeouts. Payment processing is now 95% more reliable.

Dashboard Loading Speed
Dashboard now loads 60% faster.

Mobile Experience Improvements
Fixed layout issues on mobile devices.

Security Enhancements:
Added two-factor authentication and strengthened platform security.

Questions? Check out our Help Center or contact support@company.com
```

### Technical Release Notes

```
Release 2.1.0 - Technical Documentation
=======================================

## API Changes

### Breaking Changes [WARNING]
- **API Version**: Upgraded from v2 to v3
  - Endpoint: `/api/v2/*` → `/api/v3/*`
  - Migration: See [API Migration Guide](docs/api-migration-v3.md)
  - Backward Compatibility: v2 supported until 2024-07-01

- **Authentication Token Format**: 
  - Old Format: JWT with 24h expiry
  - New Format: JWT with refresh token mechanism
  - Migration: Existing tokens valid for 30 days (auto-migration)

### New Features
- **Advanced Search API** (`GET /api/v3/search`)
  ```json
  {
    "filters": {
      "dateRange": { "start": "2024-01-01", "end": "2024-01-31" },
      "categories": ["feature", "bug"],
      "status": ["open", "in_progress"]
    },
    "pagination": { "page": 1, "limit": 50 },
    "sorting": { "field": "created_at", "order": "desc" }
  }
  ```

- **WebSocket Notifications** (`wss://api.company.com/ws`)
  - Real-time event streaming
  - Authentication: Bearer token in connection header
  - Events: `user.mentioned`, `task.assigned`, `system.alert`

- **Rate Limiting**
  - Default: 1000 requests/hour per API key
  - Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
  - Upgrade: Enterprise plans get 10,000 requests/hour

## Performance Improvements

### Database Optimizations

- Added composite indexes on frequently queried columns
- Query execution time: 15% improvement on average
- Connection pool optimization: Reduced connection overhead by 20%

### Frontend Optimizations  

- Bundle size reduction: 40% smaller (2.1MB → 1.3MB)
- Code splitting: Implemented route-based chunking
- Cache optimization: Improved browser caching strategy

### Infrastructure Changes

- CDN integration: CloudFront distribution for static assets
- API response caching: Redis-based caching for read-heavy endpoints
- Background job processing: Switched to Sidekiq with Redis

## Security Updates

### Enhancements

- **Two-Factor Authentication (2FA)**
  - TOTP support (Google Authenticator, Authy)
  - Backup codes generation
  - API endpoints: `/api/v3/auth/2fa/*`

- **Security Headers**
  - Added: `Strict-Transport-Security`, `Content-Security-Policy`
  - Enhanced: `X-Frame-Options`, `X-Content-Type-Options`

### Vulnerability Fixes

- Updated dependencies with known vulnerabilities (12 packages)
- Fixed: Potential XSS in user-generated content rendering
- Patched: SQL injection vulnerability in search functionality

## Deployment Notes

### Migration Steps

1. Database migrations: `npm run migrate`
2. Update environment variables (see `.env.example`)
3. Restart application services
4. Verify health checks: `GET /api/v3/health`

### Rollback Plan

- Database rollback: `npm run migrate:rollback`
- Application rollback: Previous Docker image available
- Estimated rollback time: 15 minutes

### Monitoring

- New metrics: API v3 usage, WebSocket connections, 2FA adoption
- Updated dashboards: Grafana dashboards for new features
- Alerts: Enhanced alerting for rate limiting and authentication

```

### Business Impact Release Notes
```

Q1 Release Summary - Business Impact Report
==========================================

Executive Summary:
This release delivers significant value across customer experience,
operational efficiency, and competitive positioning.

Business Value Delivered:

Customer Experience Improvements:
├── 35% increase in search efficiency (Advanced Search)
├── 60% faster page load times (Performance Optimization)
├── 95% reduction in payment processing failures
├── Enhanced mobile user experience (20% of our user base)
└── Real-time notifications improve engagement by 40%

Operational Efficiency Gains:
├── 30% reduction in server costs (Performance optimizations)
├── 50% reduction in customer support tickets (Bug fixes)
├── 15% improvement in system reliability
└── Enhanced security posture (Compliance readiness)

Revenue Impact:
├── Payment processing improvements: +$50K monthly revenue recovery
├── Performance improvements: Projected 15% user retention increase
├── Advanced search: Expected 25% increase in feature adoption
└── Mobile fixes: Captures previously lost mobile conversions

Strategic Objectives Achieved:

Market Position:
[OK] Advanced search capabilities match competitor offerings
[OK] Performance benchmarks now exceed industry standards
[OK] Security enhancements support enterprise client requirements
[OK] Mobile experience parity with native apps

Customer Satisfaction:
[OK] Payment reliability issues resolved (top customer complaint)
[OK] Performance concerns addressed (NPS improvement expected)
[OK] Mobile experience complaints eliminated
[OK] Real-time features enhance user engagement

Compliance & Risk:
[OK] Security vulnerabilities eliminated (12 CVEs patched)
[OK] Two-factor authentication for enterprise compliance
[OK] API rate limiting prevents abuse and ensures fair usage
[OK] Infrastructure improvements enhance disaster recovery

Key Metrics to Monitor:
├── Customer satisfaction scores (target: +10% in 30 days)
├── Feature adoption rates (advanced search, 2FA)
├── System performance metrics (load times, error rates)
├── Revenue recovery from payment processing fixes
└── Security incident reduction (target: 50% fewer incidents)

Next Steps:
├── Customer communication campaign for new features
├── Sales team training on enhanced capabilities
├── Customer success outreach for enterprise features
└── Performance monitoring and optimization continuation

```

## Visual Asset Generation

### Automated Screenshot Generation
```python
# Visual Documentation Generator
visual_assets = {
    "feature_screenshots": [
        {
            "feature": "advanced_search",
            "before_after": True,
            "annotations": True,
            "formats": ["png", "gif"]
        },
        {
            "feature": "real_time_notifications", 
            "demo_gif": True,
            "callouts": ["notification_badge", "popup_detail"]
        }
    ],
    
    "performance_charts": [
        {
            "metric": "page_load_time",
            "comparison": "before_vs_after",
            "chart_type": "bar"
        },
        {
            "metric": "api_response_time",
            "trend": "last_30_days",
            "chart_type": "line"
        }
    ],
    
    "architecture_diagrams": [
        {
            "component": "notification_system",
            "type": "sequence_diagram"
        },
        {
            "component": "api_rate_limiting",
            "type": "flow_diagram"
        }
    ]
}
```

### Interactive Release Showcase

```html
<!-- Interactive Release Demo -->
<div class="release-showcase">
  <div class="feature-tour">
    <h3>Try the New Advanced Search</h3>
    <iframe src="/demo/advanced-search" width="800" height="400"></iframe>
    <p>Click through the demo to see the new search functionality.</p>
  </div>
  
  <div class="performance-comparison">
    <h3>Performance Improvements</h3>
    <div class="before-after">
      <video autoplay muted loop>
        <source src="/assets/performance-comparison.mp4" type="video/mp4">
      </video>
      <div class="metrics">
        <span class="metric">60% faster loading</span>
        <span class="metric">40% smaller bundles</span>
      </div>
    </div>
  </div>
</div>
```

## Distribution Automation

### Multi-Channel Distribution

```yaml
# Release Distribution Configuration
distribution:
  channels:
    email:
      lists: ["customers", "beta_users", "enterprise"]
      template: "customer_release_email.html"
      schedule: "immediate"
      
    slack:
      channels: ["#announcements", "#general"]
      format: "slack_release_summary.md"
      mentions: ["@channel"]
      
    blog:
      auto_publish: true
      template: "technical_blog_post.md"
      seo_optimization: true
      
    social_media:
      twitter: true
      linkedin: true
      template: "social_media_snippets.txt"
      
    documentation:
      update_changelog: true
      update_api_docs: true
      create_migration_guides: true
      
    app_notifications:
      in_app_banner: true
      notification_message: "Check out what's new in v2.1.0!"
      duration: "7 days"
```

### Automated Scheduling

```typescript
// Release Communication Timeline
const releaseSchedule = {
  "T-1 week": [
    "Send heads-up to enterprise customers",
    "Publish beta release notes",
    "Update documentation preview"
  ],
  
  "T-3 days": [
    "Finalize release notes content",
    "Generate visual assets",
    "Prepare customer support materials"
  ],
  
  "T-1 day": [
    "Send internal team briefing",
    "Schedule social media posts",
    "Prepare customer success outreach"
  ],
  
  "Release Day": [
    "Publish release notes across all channels",
    "Send customer email notifications",
    "Update in-app notifications",
    "Post on social media",
    "Notify customer success team"
  ],
  
  "T+1 day": [
    "Monitor feedback and metrics",
    "Respond to customer questions",
    "Collect initial adoption data"
  ],
  
  "T+1 week": [
    "Analyze release impact",
    "Generate adoption report",
    "Plan follow-up communications"
  ]
};
```

## Feedback and Analytics

### Release Impact Tracking

```
Release 2.1.0 Impact Analysis
============================

Adoption Metrics (7 days post-release):
├── Feature Adoption:
│   ├── Advanced Search: 34% of active users
│   ├── Real-time Notifications: 67% enabled
│   ├── Two-Factor Authentication: 12% of users
│   └── Mobile App Usage: +25% engagement
├── Performance Impact:
│   ├── Page Load Time: 58% improvement achieved
│   ├── API Response Time: 23% improvement
│   ├── Error Rate: 45% reduction
│   └── User Session Duration: +18%

Customer Feedback:
├── Overall Satisfaction: 4.6/5.0 (+0.4 vs previous release)
├── Positive Feedback: 89% (advanced search, performance)
├── Feature Requests: 23 new requests (mostly enhancements)
├── Bug Reports: 3 minor issues (resolved within 24h)

Business Metrics:
├── Customer Support Tickets: -52% vs previous month
├── User Retention: +12% (7-day retention)
├── Feature Usage: +28% overall platform engagement
├── Payment Success Rate: 97.2% (+2% improvement)

Release Goals Achievement:
├── Performance Targets: [OK] Exceeded (58% vs 50% target)
├── Customer Satisfaction: [OK] Met (4.6/5.0 vs 4.5 target)
├── Feature Adoption: [OK] On track (34% vs 30% target)
├── Security Compliance: [OK] Achieved (100% vulnerability fixes)
```

### Continuous Improvement

```python
# Release Process Optimization
improvement_insights = {
    "communication_effectiveness": {
        "email_open_rate": 0.68,  # +15% vs last release
        "in_app_notification_engagement": 0.45,
        "social_media_reach": 12500,  # +35% vs last release
        "documentation_page_views": 8900
    },
    
    "content_quality": {
        "customer_feedback_score": 4.6,
        "technical_accuracy_rating": 4.8,
        "completeness_rating": 4.5,
        "clarity_rating": 4.7
    },
    
    "process_efficiency": {
        "time_to_publish": "2.5 hours",  # Target: 3 hours
        "review_cycles": 2,  # Down from 4
        "translation_time": "4 hours",  # For international releases
        "distribution_time": "30 minutes"  # Fully automated
    }
}
```

## Integration Features

### Development Workflow Integration

```bash
# Git Hook Integration
# .git/hooks/post-merge
#!/bin/bash
if [ "$1" = "main" ]; then
    echo "Generating release notes for merge to main..."
    claude-code /release-notes auto technical markdown
    
    # Auto-update changelog
    claude-code /release-notes auto internal changelog
    
    # Prepare customer communication
    claude-code /release-notes auto customer email
fi
```

### CI/CD Pipeline Integration

```yaml
# GitHub Actions Workflow
name: Release Notes Generation
on:
  release:
    types: [published]

jobs:
  generate-release-notes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate Release Notes
        run: |
          claude-code /release-notes ${{ github.event.release.tag_name }} all markdown
          claude-code /release-notes ${{ github.event.release.tag_name }} customer email
          
      - name: Distribute Release Notes
        run: |
          # Send to customer email list
          # Update documentation site
          # Post to Slack channels
          # Update in-app notifications
```

### Customer Communication Integration

- **CRM Integration**: Salesforce, HubSpot customer communication tracking
- **Support Integration**: Zendesk, Intercom knowledge base updates
- **Marketing Integration**: Mailchimp, Constant Contact email campaigns
- **Analytics Integration**: Google Analytics, Mixpanel event tracking
- **Feedback Collection**: In-app surveys, NPS score tracking

## Related Commands

- `/daily-standup` - Track progress and blockers for release planning
- `/code-review` - Ensure quality before releases
- `/deploy` - Coordinate release deployment and validation
- `/document` - Generate supporting documentation for releases
- `/workflow-builder` - Create custom release processes and automation

```xml
<role>
You are an expert technical communication specialist with deep knowledge of release communication, changelog generation, and stakeholder communication. You specialize in comprehensive release documentation and communication.
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

