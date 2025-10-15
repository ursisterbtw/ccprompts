# Health-Check Command

This command provides comprehensive project health assessment across multiple dimensions.

## Usage

```bash
/health-check [depth]
```

## Description

Performs systematic health assessment across all critical project dimensions:

1. Code quality and architecture health evaluation
2. Security posture and vulnerability assessment
3. Performance and scalability analysis
4. Development process and tooling evaluation
5. Documentation and knowledge management review
6. Team productivity and collaboration assessment

## Parameters

- `depth`: quick, thorough, enterprise

## Examples

```bash
/health-check quick
/health-check thorough
/health-check enterprise
```

## Assessment Dimensions

### Code Quality (25%)

- Code complexity and maintainability metrics
- Test coverage and test quality
- Code duplication and technical debt
- Dependency management and security
- Code review process effectiveness

### Security (25%)

- Vulnerability assessment and threat modeling
- Access control and authentication review
- Data protection and privacy compliance
- Security monitoring and incident response
- Security training and awareness

### Performance (20%)

- Application performance metrics and bottlenecks
- Scalability assessment and capacity planning
- Resource utilization and cost optimization
- Monitoring and alerting effectiveness
- Performance testing coverage

### Development Process (15%)

- CI/CD pipeline effectiveness and quality gates
- Branching strategy and release management
- Development workflow efficiency
- Tool integration and automation level
- Deployment reliability and rollback capabilities

### Documentation (10%)

- API documentation completeness and accuracy
- Architecture decision records and knowledge base
- User documentation and developer guides
- Operational runbooks and troubleshooting guides
- Knowledge sharing and onboarding materials

### Team & Collaboration (5%)

- Development velocity and productivity metrics
- Knowledge distribution and bus factor
- Communication effectiveness and tools
- Skill development and learning culture
- Work-life balance and sustainability

## Health Score Calculation

- **90-100%**: Excellent - Industry-leading practices
- **80-89%**: Good - Strong foundation with minor gaps
- **70-79%**: Fair - Solid base needing focused improvements
- **60-69%**: Poor - Significant gaps requiring attention
- **Below 60%**: Critical - Immediate intervention needed

## Report Output

1. **Executive Summary**: Overall health score and critical findings
2. **Dimension Breakdown**: Detailed scores with specific issues
3. **Priority Actions**: Ranked list of improvement recommendations
4. **Implementation Roadmap**: Timeline and effort estimates
5. **Trend Analysis**: Health score trends over time (if historical data available)
6. **Benchmarking**: Comparison with industry standards and best practices

## Depth Levels

- **Quick (30 min)**: Essential health indicators and critical issues
- **Thorough (2-4 hours)**: Comprehensive assessment with detailed analysis
- **Enterprise (1-2 days)**: Complete evaluation with compliance and governance review

## Related Prompts

- Recommendations are dynamically generated based on identified gaps
- Each issue links to specific prompts for remediation
- Prioritized by business impact and implementation complexity

```xml
<role>
You are an expert system health analyst with deep knowledge of system monitoring, performance analysis, and health assessment. You specialize in comprehensive system health evaluation and optimization.
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
```bash
/health-check quick
