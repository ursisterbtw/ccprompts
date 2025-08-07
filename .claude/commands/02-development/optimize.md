# Optimize Command

This command provides comprehensive optimization workflows for performance, security, maintainability, and cost.

## Usage

```
/optimize [target]
```

## Description

Executes systematic optimization workflows targeting specific improvement areas:

1. Current state analysis and baseline measurement
2. Bottleneck identification and impact assessment
3. Optimization strategy development and implementation
4. Performance validation and regression testing
5. Monitoring setup and continuous optimization
6. Documentation of improvements and lessons learned

## Parameters

- `target`: performance, security, maintainability, cost, bundle-size, database

## Examples

```
/optimize performance
/optimize security
/optimize cost
/optimize maintainability
```

## Workflow Steps

1. **Analysis Phase**: Current state assessment + bottleneck identification + impact analysis
2. **Strategy Phase**: Optimization planning + risk assessment + success metrics
3. **Implementation Phase**: Targeted optimizations + safety measures + incremental improvements
4. **Validation Phase**: Performance testing + regression testing + impact measurement
5. **Monitoring Phase**: Continuous monitoring + alerting + optimization tracking
6. **Documentation Phase**: Optimization guide + lessons learned + maintenance procedures

## Optimization Targets

- **Performance**: CPU, memory, I/O, network, and rendering optimizations
- **Security**: Vulnerability fixes, hardening measures, and security architecture improvements
- **Maintainability**: Code quality, documentation, testing, and architectural improvements
- **Cost**: Resource optimization, cloud cost reduction, and efficiency improvements
- **Bundle-Size**: Frontend bundle optimization and loading performance
- **Database**: Query optimization, indexing, and data architecture improvements

## Use Cases

- **Performance Optimization**: `/optimize performance` - Full-stack performance improvements
- **Security Enhancement**: `/optimize security` - Comprehensive security improvements
- **Cost Reduction**: `/optimize cost` - Cloud cost optimization and resource efficiency
- **Code Quality**: `/optimize maintainability` - Code quality and maintainability improvements

## Estimated Timeline

- **Performance**: 2-4 weeks
- **Security**: 3-5 weeks
- **Maintainability**: 3-6 weeks
- **Cost**: 2-3 weeks


## 🚀 Full-Stack Performance Toolkit (migrated from legacy Performance Optimization prompt)

- End-to-end profiling strategy covering backend & frontend traces
- Database query optimisation and intelligent caching check-list
- Client-side performance budgets with bundle-size regression guardrails
- Automated load-test scripts and threshold gates in CI
- Performance regression dashboard generation

```xml
<role>
You are an expert performance optimization specialist with deep knowledge of system performance, bottleneck analysis, and optimization strategies. You specialize in comprehensive performance improvement and monitoring.
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
