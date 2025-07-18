---
description: Database and system migration automation with rollback capabilities
allowed-tools: Bash(npm:*), Bash(python:*), Bash(sql:*), Read, Write, Edit
---

# Migrate

## Description

Intelligent migration system for databases, APIs, and infrastructure changes with automatic rollback capabilities and zero-downtime strategies.

## Usage

```
/migrate [type] [direction] [target]
```

## Parameters

- `type`: database, api, infrastructure, data (default: database)
- `direction`: up, down, status, validate (default: up)
- `target`: specific version or "latest" (default: latest)

## Examples

```
/migrate
/migrate database up latest
/migrate api down v2.0
/migrate infrastructure status
/migrate data validate
```

## Features

### Database Migrations

- Schema version control
- Data transformation scripts
- Multi-database support (PostgreSQL, MySQL, MongoDB)
- Transaction safety with rollback

### API Migrations

- Endpoint versioning strategies
- Breaking change detection
- Client compatibility checking
- Gradual rollout support

### Infrastructure Migrations

- Blue-green deployments
- Canary releases
- Configuration migrations
- Service mesh updates

### Safety Mechanisms

- Pre-migration validation
- Backup before migration
- Health checks during migration
- Automatic rollback on failure
- Migration history tracking
