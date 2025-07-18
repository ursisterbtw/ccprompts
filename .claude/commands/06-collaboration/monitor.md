---
description: Production monitoring setup with alerts, dashboards, and observability
allowed-tools: Bash(npm:*), Bash(curl:*), Write, Edit, Read
---

# Monitor

## Description

Comprehensive monitoring setup that implements observability best practices including metrics, logs, traces, and alerts for production systems.

## Usage

```
/monitor [component] [provider]
```

## Parameters

- `component`: app, infra, database, api, all (default: all)
- `provider`: datadog, prometheus, newrelic, grafana, cloudwatch (default: auto-detect)

## Examples

```
/monitor
/monitor app datadog
/monitor database prometheus
/monitor all grafana
```

## Features

### Application Monitoring

- Performance metrics (response time, throughput)
- Error tracking and reporting
- User experience monitoring
- Custom business metrics

### Infrastructure Monitoring

- Resource utilization (CPU, memory, disk)
- Network performance
- Container orchestration metrics
- Cloud service health

### Database Monitoring

- Query performance analysis
- Connection pool monitoring
- Replication lag tracking
- Storage utilization

### Alerting Configuration

- Intelligent threshold setting
- Alert routing and escalation
- PagerDuty/Slack integration
- Runbook automation

### Dashboard Creation

- Auto-generated dashboards
- SLI/SLO tracking
- Executive summaries
- Team-specific views
