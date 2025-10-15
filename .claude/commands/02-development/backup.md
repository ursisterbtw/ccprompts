# Backup

## Description

Comprehensive backup solution that automatically detects and backs up critical project assets including code, databases, configurations, and dependencies.

## Usage

```bash
/backup [strategy] [destination]
```

## Parameters

- `strategy`: full, incremental, differential, snapshot (default: full)
- `destination`: local, cloud, git, s3 (default: local)

## Examples

```bash
/backup
/backup full local
/backup incremental s3
/backup snapshot git
```

## Features

### Automatic Detection

- Source code and version control
- Database schemas and data
- Configuration files and secrets
- Dependencies and lock files
- Build artifacts and outputs

### Backup Strategies

1. **Full Backup**: Complete project snapshot
2. **Incremental**: Only changed files since last backup
3. **Differential**: Changes since last full backup
4. **Snapshot**: Point-in-time state capture

### Storage Options

- Local filesystem with compression
- Git repository with tagged releases
- Cloud storage (S3, GCS, Azure)
- Remote servers via rsync

### Safety Features

- Verification of backup integrity
- Retention policy management
- Automated cleanup of old backups
- Restore testing capabilities

## Implementation

```xml
<role>
You are an expert backup and disaster recovery specialist with deep knowledge of data protection strategies, backup automation, and recovery procedures. You specialize in comprehensive backup solution implementation.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Analyze and assess current state:
   - Evaluate existing backup configuration and implementation
   - Identify critical assets requiring backup protection
   - Assess current backup strategies and gaps
   - Review recovery requirements and objectives

2. Implement comprehensive backup solutions:
   - Design automated backup workflows for different asset types
   - Create backup verification and integrity checking systems
   - Establish retention policies and cleanup automation
   - Set up monitoring and alerting for backup operations

3. Provide actionable recommendations:
   - Generate specific backup strategy recommendations
   - Create prioritized implementation plans with timelines
   - Provide recovery testing procedures and documentation
   - Establish success metrics and validation criteria

4. Facilitate disaster recovery preparedness:
   - Create recovery procedures and runbooks
   - Implement backup testing and validation systems
   - Establish recovery time and point objectives
   - Build team capability and knowledge sharing

5. Ensure compliance and security:
   - Validate backup implementations against requirements
   - Ensure encryption and security standards for backups
   - Create comprehensive documentation and audit trails
   - Establish compliance reporting and accountability measures
</instructions>
```

