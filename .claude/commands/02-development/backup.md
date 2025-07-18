---
description: Automated backup strategies for code, databases, and configurations
allowed-tools: Bash(tar:*), Bash(zip:*), Bash(rsync:*), Bash(git:*), Write, Read
---

# Backup

## Description

Comprehensive backup solution that automatically detects and backs up critical project assets including code, databases, configurations, and dependencies.

## Usage

```
/backup [strategy] [destination]
```

## Parameters

- `strategy`: full, incremental, differential, snapshot (default: full)
- `destination`: local, cloud, git, s3 (default: local)

## Examples

```
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
