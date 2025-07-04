---
description: Safe multi-file refactoring with automated testing and rollback capability
allowed-tools: Bash(git:*), Read, Write, Edit, MultiEdit, Bash(npm test:*), Bash(pytest:*)
---

# Safe Refactoring

## Pre-Refactoring Analysis
- Current branch: !`git branch --show-current`
- Uncommitted changes: !`git status --porcelain`
- Recent commits: !`git log --oneline -5`
- Test status: !`npm test 2>/dev/null || pytest 2>/dev/null || echo "No test command detected"`

## Refactoring Target
Target: **$ARGUMENTS** (e.g., "utils.js to modern ES2024", "legacy API endpoints", "database schema")

## 🔄 Safe Refactoring Process

### 1. Pre-Refactoring Safety
- **Create backup branch**: Ensure clean rollback point
- **Run full test suite**: Establish baseline functionality
- **Analyze dependencies**: Map all affected code references
- **Document current behavior**: Capture existing functionality

### 2. Intelligent Code Analysis
- **Pattern detection**: Identify refactoring opportunities
- **Impact analysis**: Determine scope of changes
- **Breaking change assessment**: Evaluate compatibility risks
- **Performance implications**: Analyze performance impact

### 3. Safe Transformation Strategy
- **Incremental changes**: Small, testable refactoring steps
- **Atomic commits**: Each refactoring step as separate commit
- **Continuous testing**: Run tests after each change
- **Rollback readiness**: Immediate rollback if issues detected

## 🛠️ Refactoring Categories

### Code Modernization
- **Language features**: Upgrade to modern syntax and features
- **Framework updates**: Migrate to newer framework versions
- **API improvements**: Replace deprecated APIs
- **Performance optimization**: Implement efficient algorithms

### Architecture Improvements
- **Design patterns**: Apply better architectural patterns
- **Separation of concerns**: Improve code organization
- **Dependency injection**: Reduce coupling between components
- **Modularity**: Break down monolithic structures

### Technical Debt Reduction
- **Dead code removal**: Eliminate unused code and imports
- **Duplication elimination**: Consolidate repeated logic
- **Complex method simplification**: Break down large functions
- **Configuration improvements**: Externalize hardcoded values

## 🧪 Testing Strategy

### Pre-Refactoring Validation
- **Baseline tests**: Ensure all tests pass before starting
- **Coverage analysis**: Identify untested code paths
- **Integration testing**: Verify system-level functionality
- **Performance benchmarks**: Establish performance baselines

### During Refactoring
- **Unit test updates**: Modify tests for new implementations
- **Regression testing**: Continuous validation of existing functionality
- **Integration validation**: Ensure refactored components integrate properly
- **Performance monitoring**: Watch for performance regressions

### Post-Refactoring Verification
- **Full test suite**: Complete testing of refactored system
- **Manual testing**: Human verification of critical paths
- **Performance comparison**: Compare against pre-refactoring benchmarks
- **Documentation updates**: Update relevant documentation

## 🚨 Rollback Strategy

### Automatic Rollback Triggers
- **Test failures**: Any test regression triggers rollback consideration
- **Performance degradation**: Significant performance impact
- **Build failures**: Compilation or build errors
- **Integration issues**: System integration problems

### Manual Rollback Process
- **Staged rollback**: Roll back in reverse order of changes
- **Selective rollback**: Keep beneficial changes, revert problematic ones
- **Communication**: Notify team of rollback and reasons
- **Learning documentation**: Document lessons learned

Execute safe, incremental refactoring with comprehensive testing and rollback protection!