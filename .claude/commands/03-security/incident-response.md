# Incident-Response Command

This command provides structured incident response workflows for production issues and system failures.

## Usage

```bash
/incident-response [severity] [type] [environment]
```

## Parameters

- `severity`: critical, high, medium, low
- `type`: outage, security, performance, data, integration
- `environment`: production, staging, development, all

## Examples

```bash
/incident-response critical outage production
/incident-response high security production
/incident-response medium performance staging
/incident-response low data development
```

## Description

Comprehensive incident response management system:

1. Automated incident detection and classification
2. Structured response workflows and communication
3. Real-time monitoring and status tracking
4. Root cause analysis and resolution documentation
5. Post-incident review and improvement planning
6. Integration with monitoring and alerting systems

## Incident Classification

### Severity Levels

#### Critical (SEV-1)

- **Impact**: Complete service outage or critical functionality unavailable
- **Customer Impact**: All or majority of customers affected
- **Revenue Impact**: Direct revenue loss occurring
- **Response Time**: Immediate (within 15 minutes)
- **Escalation**: Automatic escalation to leadership
- **Communication**: Real-time updates every 30 minutes

#### High (SEV-2)

- **Impact**: Major functionality degraded or limited outage
- **Customer Impact**: Significant portion of customers affected
- **Revenue Impact**: Potential revenue impact
- **Response Time**: Within 1 hour
- **Escalation**: Team lead and on-call engineer
- **Communication**: Updates every 2 hours

#### Medium (SEV-3)

- **Impact**: Minor functionality issues or performance degradation
- **Customer Impact**: Small subset of customers affected
- **Revenue Impact**: Minimal revenue impact
- **Response Time**: Within 4 hours (business hours)
- **Escalation**: Assigned team member
- **Communication**: Daily updates until resolved

#### Low (SEV-4)

- **Impact**: Cosmetic issues or non-critical functionality
- **Customer Impact**: Minimal or no customer impact
- **Revenue Impact**: No revenue impact
- **Response Time**: Within 5 business days
- **Escalation**: Normal prioritization
- **Communication**: Weekly updates in team meetings

### Incident Types

#### System Outage

```text
System Outage Response Workflow
==============================

Immediate Actions (0-15 minutes):
1. [OK] Confirm incident scope and impact
2. [OK] Activate incident response team
3. [OK] Establish communication channels
4. [OK] Implement emergency procedures
5. [OK] Begin status page updates

Investigation Phase (15-60 minutes):
1. [SCAN] Gather system metrics and logs
2. [SCAN] Identify root cause hypothesis
3. [SCAN] Test quick resolution strategies
4. [SCAN] Escalate to additional teams if needed
5. [SCAN] Document findings and actions

Resolution Phase (varies):
1. [TOOLS] Implement primary fix
2. [TOOLS] Verify system functionality
3. [TOOLS] Monitor for secondary issues
4. [TOOLS] Gradual traffic restoration
5. [TOOLS] Confirm full resolution
```

#### Security Incident

```text
Security Incident Response Workflow
==================================

Immediate Response (0-30 minutes):
1. [ALERT] Isolate affected systems
2. [ALERT] Preserve evidence and logs
3. [ALERT] Notify security team and management
4. [ALERT] Activate security incident procedures
5. [ALERT] Begin forensic data collection

Assessment Phase (30 minutes - 2 hours):
1. [SCAN] Assess scope of compromise
2. [SCAN] Identify attack vectors
3. [SCAN] Evaluate data exposure
4. [SCAN] Determine legal/regulatory implications
5. [SCAN] Coordinate with external parties if needed

Containment & Recovery (2-24 hours):
1. [SECURITY] Implement security controls
2. [SECURITY] Remove malicious elements
3. [SECURITY] Restore systems from clean backups
4. [SECURITY] Apply security patches
5. [SECURITY] Enhance monitoring and detection
```

## Automated Response Actions

### Detection and Alerting

```python
# Automated Incident Detection Example
incident_triggers = {
    "critical_outage": {
        "conditions": [
            "error_rate > 50%",
            "response_time > 30s",
            "availability < 95%"
        ],
        "duration": "5 minutes",
        "actions": [
            "create_incident(severity='critical')",
            "page_oncall_engineer()",
            "update_status_page('investigating')",
            "start_war_room()"
        ]
    },
    
    "security_anomaly": {
        "conditions": [
            "failed_login_attempts > 1000/hour",
            "unusual_traffic_patterns",
            "suspicious_file_access"
        ],
        "duration": "1 minute",
        "actions": [
            "create_security_incident()",
            "alert_security_team()",
            "begin_log_collection()",
            "isolate_suspicious_sources()"
        ]
    }
}
```

### Response Automation

- **System Health Checks**: Automated diagnosis of system components
- **Log Collection**: Automatic gathering of relevant logs and metrics
- **Backup Activation**: Emergency failover to backup systems
- **Traffic Rerouting**: Load balancer reconfiguration
- **Resource Scaling**: Automatic resource allocation adjustments
- **Communication**: Automated status updates and notifications

## Communication Management

### Stakeholder Communication

```
Incident Communication Matrix
============================

Stakeholder Group    │ SEV-1 │ SEV-2 │ SEV-3 │ SEV-4 │ Channel
────────────────────┼───────┼───────┼───────┼───────┼─────────────
Executive Team      │  [OK]   │  [OK]   │   -   │   -   │ Phone/SMS
Engineering Leads   │  [OK]   │  [OK]   │  [OK]   │   -   │ Slack/Email
On-Call Engineers   │  [OK]   │  [OK]   │  [OK]   │  [OK]   │ PagerDuty
Customer Support    │  [OK]   │  [OK]   │  [OK]   │   -   │ Slack/Email
External Customers  │  [OK]   │  [OK]   │   -   │   -   │ Status Page
Security Team       │  [OK]   │  [OK]   │  [OK]   │  [OK]   │ Secure Channel
Legal/Compliance    │  [OK]   │   -   │   -   │   -   │ Secure Channel
```

### Status Page Management

```
Status Page Update Template
==========================

[CRITICAL] [CRITICAL] Service Outage - Investigating
Posted: 2024-01-15 14:30 UTC
Affected: All users unable to access main application

We are currently investigating reports of users being unable to access 
our main application. Our engineering team has been notified and is 
actively working to identify the root cause.

Next Update: 15:00 UTC
Incident ID: INC-2024-0115-001

Updates:
- 14:30 UTC: Issue identified, implementing fix
- 14:45 UTC: Fix deployed, monitoring recovery
- 15:00 UTC: Service restored, monitoring stability
```

### Internal Communication

- **War Room Setup**: Dedicated communication channels for incident response
- **Role Assignment**: Clear responsibilities and decision-making authority
- **Progress Updates**: Regular internal status updates and coordination
- **Escalation Paths**: Clear escalation procedures and contact information
- **Documentation**: Real-time incident documentation and action tracking

## Monitoring and Diagnostics

### Real-Time Monitoring

```
Incident Monitoring Dashboard
============================

[ALERT] Active Incidents (2)
├── INC-001: Critical outage - 45 minutes elapsed
└── INC-002: Performance degradation - 2 hours elapsed

[STATS] System Health Overview
├── Error Rate: 12.3% ([UP] 8.1% from baseline)
├── Response Time: 2.4s ([UP] 1.8s from baseline)  
├── Throughput: 1,247 req/min ([DOWN] 45% from baseline)
├── CPU Usage: 89% ([UP] 34% from baseline)
└── Memory Usage: 76% ([UP] 12% from baseline)

[SCAN] Recent Anomalies
├── 14:25: Spike in database connection errors
├── 14:28: Load balancer health check failures
├── 14:30: Customer report surge (+300% support tickets)
└── 14:32: Third-party API response degradation

[TOOLS] Active Remediation
├── Database connection pool increased
├── Additional application instances deployed
├── CDN cache refresh initiated
└── Third-party vendor contacted
```

### Diagnostic Tools

- **Log Aggregation**: Centralized log collection and analysis
- **Performance Metrics**: Real-time application and infrastructure metrics
- **Distributed Tracing**: Request flow analysis across microservices
- **Database Monitoring**: Query performance and connection health
- **Network Analysis**: Traffic patterns and connectivity issues
- **External Dependencies**: Third-party service health monitoring

## Root Cause Analysis

### Investigation Framework

```
Root Cause Analysis Template
===========================

Incident Summary:
- ID: INC-2024-0115-001
- Severity: Critical
- Duration: 1h 15m
- Impact: 100% of users unable to access application

Timeline:
14:25 - First customer reports received
14:30 - Incident declared, war room activated
14:35 - Database connection issues identified
14:50 - Root cause determined: connection pool exhaustion
15:05 - Fix implemented: increased connection limits
15:15 - Service fully restored
15:40 - Post-incident review completed

Root Cause: Database connection pool misconfiguration
- Recent deployment changed default connection limits
- Load testing didn't simulate production traffic patterns
- Monitoring alerts for connection pool health were missing

Contributing Factors:
1. Inadequate load testing scenarios
2. Missing monitoring for database connections
3. Deployment checklist didn't include connection pool verification
4. No automated rollback for database configuration changes

Corrective Actions:
1. [Immediate] Add connection pool monitoring and alerting
2. [Short-term] Update load testing to include connection stress
3. [Long-term] Implement automated database configuration validation
4. [Process] Add database checklist items to deployment process
```

### Analysis Tools

- **Timeline Reconstruction**: Chronological event analysis
- **Failure Mode Analysis**: Systematic evaluation of failure points
- **Contributing Factor Identification**: Environmental and process factors
- **Impact Assessment**: Quantitative analysis of business impact
- **Prevention Strategy**: Long-term prevention and mitigation planning

## Post-Incident Activities

### Post-Incident Review (PIR)

```
Post-Incident Review Agenda
===========================

1. Incident Overview (10 minutes)
   - Timeline and impact summary
   - Response effectiveness evaluation
   - Communication assessment

2. Root Cause Analysis (20 minutes)
   - Technical root cause discussion
   - Contributing factors review
   - Detection and response gaps

3. Action Items (15 minutes)
   - Immediate remediation tasks
   - Process improvements
   - Technology enhancements
   - Responsibility assignments

4. Learning and Knowledge Sharing (10 minutes)
   - Key lessons learned
   - Best practices identified
   - Knowledge transfer needs
   - Documentation updates

5. Follow-up Planning (5 minutes)
   - Action item tracking
   - Progress review schedule
   - Success metrics definition
```

### Improvement Implementation

- **Action Item Tracking**: Systematic follow-up on improvement actions
- **Process Updates**: Revision of incident response procedures
- **Tool Enhancements**: Implementation of better monitoring and alerting
- **Training Programs**: Team training based on lessons learned
- **Documentation Updates**: Knowledge base and runbook improvements
- **Testing Improvements**: Enhanced testing scenarios and validation

## Integration Features

### Monitoring System Integration

- **PagerDuty**: Incident creation and escalation management
- **Datadog/New Relic**: Automated anomaly detection and alerting
- **Splunk/ELK**: Log analysis and correlation
- **Prometheus/Grafana**: Metrics collection and visualization
- **AWS CloudWatch**: Cloud infrastructure monitoring
- **Custom Webhooks**: Integration with proprietary systems

### Communication Platform Integration

```yaml
# Integration Configuration Example
integrations:
  slack:
    incident_channel: "#incidents"
    war_room_creation: true
    status_updates: true
    
  jira:
    project_key: "INC"
    auto_ticket_creation: true
    priority_mapping: true
    
  statuspage:
    auto_updates: true
    component_mapping: true
    
  email:
    executive_notifications: true
    customer_updates: false
    
  sms:
    critical_only: true
    on_call_contacts: true
```

### ITSM Integration

- **ServiceNow**: Incident ticket creation and workflow management
- **Remedy**: Change management and approval workflows
- **Cherwell**: Service desk integration and customer communication
- **Custom ITSM**: API integration with proprietary systems

## Compliance and Reporting

### Regulatory Compliance

- **GDPR**: Data breach notification procedures
- **HIPAA**: Healthcare incident reporting requirements  
- **SOX**: Financial controls and audit trails
- **PCI DSS**: Payment card industry incident handling
- **SOC 2**: Security incident documentation and reporting

### Reporting and Analytics

```text
Monthly Incident Report
======================

[STATS] Incident Statistics (January 2024)
├── Total Incidents: 47
├── SEV-1 (Critical): 2 incidents
├── SEV-2 (High): 8 incidents  
├── SEV-3 (Medium): 23 incidents
├── SEV-4 (Low): 14 incidents

[TIME] Response Time Metrics
├── Mean Time to Detection (MTTD): 8.3 minutes
├── Mean Time to Response (MTTR): 23.7 minutes
├── Mean Time to Resolution (MTTR): 2.4 hours

[METRICS] Trends and Improvements
├── Response time improved by 15% vs. December
├── Detection time reduced by 22% vs. December
├── 87% of incidents resolved within SLA
├── Customer satisfaction: 4.2/5.0 (+0.3 vs. December)

[TARGET] Key Improvements This Month
├── Implemented automated log collection
├── Enhanced monitoring for database connections
├── Updated incident response training
├── Improved status page automation
```

## Related Commands

- `/monitor` - Set up comprehensive monitoring and alerting
- `/debug-session` - Detailed system debugging and analysis
- `/health-check` - Proactive system health assessment
- `/deploy` - Safe deployment procedures with rollback capability
- `/audit-security` - Security incident investigation and response

```xml
<role>
You are an expert incident response specialist with deep knowledge of incident management, crisis communication, and post-incident analysis. You specialize in comprehensive incident response and system recovery.
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
```text
Monthly Incident Report
