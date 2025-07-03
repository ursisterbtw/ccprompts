# Reusable GitHub Actions Workflows

This directory contains reusable workflow components that can be called from other workflows to reduce duplication and improve maintainability.

## Available Reusable Workflows

### 1. `setup-node.yml`

**Purpose**: Standardized Node.js environment setup with caching

**Inputs**:

- `node-version` (optional): Node.js version to use (default: '20')
- `cache-dependency-path` (optional): Path to dependency file for caching (default: 'package-lock.json')
- `install-dependencies` (optional): Whether to install dependencies (default: true)

**Usage Example**:

```yaml
jobs:
  setup:
    uses: ./.github/workflows/reusable/setup-node.yml
    with:
      node-version: '20'
      install-dependencies: true
```

### 2. `validate-prompts.yml`

**Purpose**: Run prompt validation with configurable thresholds

**Inputs**:

- `validation-script` (optional): Path to validation script (default: 'scripts/validate-prompts.js')
- `fail-on-warnings` (optional): Whether to fail on warnings (default: false)
- `max-errors` (optional): Maximum allowed errors (default: 5)

**Outputs**:

- `validation-status`: Overall validation status ('passed' or 'failed')
- `error-count`: Number of validation errors
- `warning-count`: Number of validation warnings

**Usage Example**:

```yaml
jobs:
  validate:
    uses: ./.github/workflows/reusable/validate-prompts.yml
    with:
      max-errors: 10
      fail-on-warnings: false
```

### 3. `security-scan.yml`

**Purpose**: Comprehensive security scanning for vulnerabilities

**Inputs**:

- `enable-dependency-scan` (optional): Enable dependency vulnerability scanning (default: true)
- `enable-secret-scan` (optional): Enable secret scanning (default: true)
- `enable-file-permission-check` (optional): Enable file permission security check (default: true)

**Outputs**:

- `vulnerabilities-found`: Whether vulnerabilities were found (boolean)
- `security-status`: Overall security scan status ('passed' or 'failed')

**Usage Example**:

```yaml
jobs:
  security:
    uses: ./.github/workflows/reusable/security-scan.yml
    with:
      enable-dependency-scan: true
      enable-secret-scan: true
```

### 4. `artifact-handling.yml`

**Purpose**: Standardized artifact creation, compression, and upload

**Inputs**:

- `artifact-name` (required): Name of the artifact
- `artifact-path` (required): Path to artifacts (comma-separated for multiple)
- `retention-days` (optional): Number of days to retain artifacts (default: 7)
- `create-release-asset` (optional): Whether to create a release asset (default: false)
- `compression-level` (optional): Compression level 0-9 (default: 6)

**Usage Example**:

```yaml
jobs:
  artifacts:
    uses: ./.github/workflows/reusable/artifact-handling.yml
    with:
      artifact-name: deployment-package
      artifact-path: dist,docs
      retention-days: 30
```

## Benefits of Using Reusable Workflows

1. **DRY Principle**: Eliminate duplicate code across workflows
2. **Consistency**: Ensure all workflows follow the same patterns
3. **Maintainability**: Update logic in one place affects all consumers
4. **Modularity**: Mix and match components as needed
5. **Testing**: Test workflow components in isolation

## Best Practices

1. **Version Control**: Consider versioning reusable workflows with tags
2. **Documentation**: Always document inputs, outputs, and usage examples
3. **Error Handling**: Include proper error handling and status reporting
4. **Flexibility**: Make workflows configurable with sensible defaults
5. **Security**: Be careful with secrets and permissions in reusable workflows

## Migration Guide

To migrate existing workflows to use reusable components:

1. Identify common patterns in existing workflows
2. Replace duplicated steps with calls to reusable workflows
3. Test thoroughly to ensure functionality is preserved
4. Remove old duplicate code

## Future Enhancements

- Add reusable workflow for Docker builds
- Create reusable workflow for deployment to different environments
- Add performance benchmarking workflow
- Create notification/reporting workflow
