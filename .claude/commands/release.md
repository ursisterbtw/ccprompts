# Release Command

This command provides complete release preparation workflows for different version types.

## Usage
```
/release [version-type]
```

## Description
Executes comprehensive release preparation ensuring quality, security, and deployment readiness:
1. Pre-release quality assurance and security validation
2. Version management and changelog generation
3. Release documentation and communication preparation
4. Deployment strategy implementation and testing
5. Monitoring and rollback procedure setup
6. Post-release validation and metrics tracking

## Parameters
- `version-type`: patch, minor, major, hotfix, beta, rc

## Examples
```
/release major
/release hotfix
/release beta
/release patch
```

## Workflow Steps
1. **Pre-Release Validation**: Test suite + security scan + performance validation + quality gates
2. **Version Management**: Semantic versioning + changelog generation + release notes
3. **Documentation Preparation**: Release documentation + API changes + migration guides
4. **Deployment Preparation**: Release strategy + feature flags + rollback procedures
5. **Communication Setup**: Team notifications + user communications + support preparation
6. **Post-Release Monitoring**: Deployment monitoring + performance tracking + issue tracking

## Version Types
- **Patch**: Bug fixes and security updates with minimal risk
- **Minor**: New features with backward compatibility
- **Major**: Breaking changes requiring migration planning
- **Hotfix**: Emergency fixes for critical issues
- **Beta**: Pre-release testing with selected users
- **RC (Release Candidate)**: Final testing before production release

## Use Cases
- **Major Release**: `/release major` - Breaking changes with comprehensive migration support
- **Hotfix Release**: `/release hotfix` - Emergency patch with expedited validation
- **Feature Release**: `/release minor` - New features with full testing and documentation
- **Security Patch**: `/release patch` - Security updates with immediate deployment

## Estimated Timeline
- **Patch**: 1-2 days
- **Minor**: 1-2 weeks
- **Major**: 2-4 weeks
- **Hotfix**: 4-8 hours
- **Beta/RC**: 1-3 weeks

## Release Checklist
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Changelog generated
- [ ] Deployment strategy tested
- [ ] Rollback procedures verified
- [ ] Monitoring configured

## Related Prompts
- `prompts/04-testing/test-suite-generation.md`
- `prompts/02-code-analysis/security-quality-audit.md`
- `prompts/09-build-deployment/comprehensive-cicd.md`
- `prompts/05-documentation/documentation-generator.md`