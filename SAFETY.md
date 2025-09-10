# Safety System Documentation

## Overview

The ccprompts repository implements a comprehensive 3-layer safety system to ensure secure execution of potentially dangerous commands. This system uses Dagger containers for isolation, pattern detection for risk assessment, and validation pipelines for quality assurance.

## Safety Architecture

### Layer 1: Pattern Detection
- **Location**: `scripts/config/safety-patterns.js`
- **Purpose**: Identifies dangerous command patterns before execution
- **Coverage**: Critical, high-risk, and medium-risk patterns across multiple categories

### Layer 2: Container Isolation
- **Location**: `scripts/safety-validator.js`
- **Purpose**: Executes dangerous commands in isolated Dagger containers
- **Features**: Ubuntu 22.04 base, resource limits, read-only project mounting

### Layer 3: Validation Pipeline
- **Location**: `scripts/validate-commands.js`
- **Purpose**: Comprehensive validation of all commands and safety measures
- **Metrics**: 70 commands analyzed, 67.1% safety rate, 25 container validations

## Safety Patterns

### Critical Patterns (Immediate Security Threats)
- Recursive file deletion with system paths (`rm -rf /`)
- Remote code execution via curl/wget pipes
- Docker privileged mode execution

### High-Risk Patterns (Significant Security Concerns)
- Sudo execution with non-package managers
- File permission modifications
- Network operations with external resources

### Medium-Risk Patterns (Moderate Security Concerns)
- File write operations
- Network connectivity tests
- Potentially destructive operations

## Safe Command Execution

### Using the Safe Runner
```bash
# Execute any command safely in a container
./scripts/safe-run.sh "your-command-here"

# Test mode (dry run)
./scripts/safe-run.sh "rm -rf dangerous-path" --test

# Project-specific execution
./scripts/safe-run.sh "bun install" --project-path "/my/project"
```

### Quick Safety Shortcuts
```bash
# Safe package installation
./scripts/quick-safe.sh install

# Safe build operations
./scripts/quick-safe.sh build

# Safe file deletion
./scripts/quick-safe.sh rm-rf
```

## Safety Metrics

### Current Status
- **Total Commands**: 70
- **Safe Commands**: 47 (67.1%)
- **Dangerous Commands**: 23 (32.9%)
- **Container Validations**: 25
- **Safety Rate**: 67.1%

### Performance Metrics
- **Discovery Time**: <100ms [OK]
- **Validation Time**: <2000ms [OK]
- **Safety Validation**: 553ms (optimization target)
- **Memory Usage**: 7.2MB

## Safety Validation Process

### 1. Pattern Analysis
```bash
# Run security-focused validation
bun run security-scan
```

### 2. Container Testing
```bash
# Validate commands in Dagger containers
bun run safety-validate
```

### 3. Full Validation
```bash
# Complete safety and quality validation
bun run validate
```

## Safety Configuration

### Dagger Configuration
- **Engine Version**: v0.18.16
- **Base Image**: Ubuntu 22.04
- **Resource Limits**: CPU, memory, storage constraints
- **Network Restrictions**: Limited external access

### Safety Patterns Configuration
- **Critical Patterns**: 4 patterns
- **High-Risk Patterns**: 8 patterns  
- **Medium-Risk Patterns**: 12 patterns
- **Custom Patterns**: Extensible via configuration

## Best Practices

### For Command Developers
1. **Always include safety considerations** in command documentation
2. **Use the safe-run.sh script** for potentially dangerous operations
3. **Test commands in containers** before deployment
4. **Follow the safety pattern guidelines** in `scripts/config/safety-patterns.js`

### For Repository Maintainers
1. **Regular safety audits** using `bun run security-scan`
2. **Monitor safety metrics** and aim for >80% safety rate
3. **Update safety patterns** as new threats emerge
4. **Review dangerous commands** quarterly

## Troubleshooting

### Common Issues

#### Container Execution Failures
```bash
# Check Dagger installation
dagger version

# Verify container permissions
./scripts/safe-run.sh "ls -la" --test
```

#### Safety Pattern False Positives
- Review patterns in `scripts/config/safety-patterns.js`
- Add exceptions for legitimate use cases
- Update pattern specificity

#### Performance Issues
- Monitor validation times
- Optimize pattern matching algorithms
- Consider caching for repeated validations

## Security Considerations

### Container Security
- **Isolation**: Commands run in isolated containers
- **Resource Limits**: CPU, memory, and storage constraints
- **Network Restrictions**: Limited external connectivity
- **Read-Only Mounting**: Project files protected from modification

### Pattern Security
- **Regular Updates**: Safety patterns updated with new threats
- **False Positive Management**: Balance security with usability
- **Custom Patterns**: Support for project-specific security requirements

## Contributing to Safety

### Adding New Safety Patterns
1. Identify the dangerous pattern
2. Add to appropriate category in `scripts/config/safety-patterns.js`
3. Test with existing commands
4. Update documentation

### Improving Safety Metrics
1. Review dangerous commands regularly
2. Implement safer alternatives where possible
3. Add container validation for new commands
4. Monitor safety rate trends

## Emergency Procedures

### Security Incident Response
1. **Immediate**: Stop all automated processes
2. **Assessment**: Run `bun run security-scan` for current status
3. **Containment**: Use `./scripts/safe-run.sh` for any necessary fixes
4. **Recovery**: Validate all commands before resuming operations

### Safety System Recovery
1. **Backup**: Ensure command registry is backed up
2. **Validation**: Run full validation suite
3. **Testing**: Test critical commands in containers
4. **Monitoring**: Watch safety metrics during recovery

---

For more information, see:
- [Command Development Guide](docs/DEVELOPER-GUIDE.md)
- [Validation System](scripts/validate-commands.js)
- [Safety Patterns](scripts/config/safety-patterns.js)
- [Container Configuration](dagger.json)