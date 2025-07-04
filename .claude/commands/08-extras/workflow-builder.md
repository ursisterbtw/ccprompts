# Workflow-Builder Command

This command provides an interactive workflow creation and management interface for chaining multiple prompts.

## Usage

```
/workflow-builder [action] [workflow-name]
```

## Parameters

- `action`: create, edit, run, list, export, import, delete
- `workflow-name`: Name of the workflow to operate on

## Examples

```
/workflow-builder create
/workflow-builder edit production-deployment
/workflow-builder run full-security-audit
/workflow-builder list
/workflow-builder export ci-cd-setup
```

## Description

Interactive workflow creation and management system:

1. Visual workflow builder with drag-and-drop interface
2. Conditional logic and branching support
3. Parameter passing between workflow steps
4. Error handling and rollback capabilities
5. Workflow templates and sharing
6. Execution monitoring and progress tracking

## Workflow Components

### Workflow Steps

- **Prompt Execution**: Run specific prompts with parameters
- **Conditional Logic**: If/then/else branching based on results
- **Data Transformation**: Process outputs from previous steps
- **External Commands**: Execute shell commands or API calls
- **User Input**: Interactive prompts for user decisions
- **Notification**: Send alerts, emails, or messages

### Flow Control

- **Sequential Execution**: Steps run in defined order
- **Parallel Execution**: Multiple steps run simultaneously
- **Conditional Branching**: Different paths based on conditions
- **Loop Constructs**: Repeat steps until conditions are met
- **Error Handling**: Graceful failure and recovery options
- **Retry Logic**: Automatic retry with exponential backoff

### Parameter Management

- **Input Parameters**: Workflow-level configuration
- **Step Parameters**: Individual step configuration
- **Output Capture**: Collect results from each step
- **Variable Interpolation**: Use previous step outputs as inputs
- **Environment Variables**: Access system and project variables
- **Secret Management**: Secure handling of sensitive data

## Workflow Templates

### Development Lifecycle

```yaml
name: Full Development Cycle
description: Complete workflow from setup to deployment

steps:
  1. Project Bootstrap
     - prompt: comprehensive-bootstrap.md
     - inputs: {project_type: "${PROJECT_TYPE}", stack: "${TECH_STACK}"}

  2. Security Baseline
     - prompt: harden-enterprise.md
     - condition: security_required == true
     - inputs: {compliance: "${COMPLIANCE_LEVEL}"}

  3. Testing Setup
     - prompt: test-comprehensive.md
     - parallel_with: documentation_setup
     - inputs: {coverage_target: 80}

  4. Documentation Setup
     - prompt: document-auto-generated.md
     - parallel_with: testing_setup

  5. CI/CD Pipeline
     - prompt: setup-ci.md
     - inputs: {platform: "github", environment: "production"}

  6. Deployment
     - prompt: deploy-production.md
     - condition: all_tests_passed == true
     - rollback_on_failure: true
```

### Security Hardening

```yaml
name: Security Hardening Workflow
description: Comprehensive security assessment and hardening

steps:
  1. Vulnerability Scan
     - prompt: audit-security.md
     - inputs: {scope: "full-codebase", depth: "paranoid"}
     - capture_output: vulnerability_report

  2. Dependency Analysis
     - prompt: analyze-dependencies.md
     - parallel_with: code_quality_check
     - capture_output: dependency_report

  3. Code Quality Check
     - prompt: analyze-code-quality.md
     - parallel_with: dependency_analysis

  4. Compliance Validation
     - prompt: comply-enterprise.md
     - inputs: {standards: ["SOC2", "GDPR", "HIPAA"]}
     - condition: vulnerability_count < 5

  5. Hardening Implementation
     - prompt: harden-production.md
     - inputs: {findings: "${vulnerability_report}"}

  6. Verification
     - prompt: verify-security.md
     - retry_on_failure: 3
```

## Interactive Builder Interface

### Visual Editor

- Drag-and-drop workflow design
- Visual connection between steps
- Real-time validation and error checking
- Step configuration panels
- Workflow preview and simulation

### Step Configuration

```
Step Configuration: Security Audit
================================

Prompt: audit-security.md
Timeout: 30 minutes
Retry Policy: 3 attempts with 5-minute intervals

Input Parameters:
├── scope: full-codebase
├── depth: thorough
└── output_format: json

Conditions:
├── Run if: project_type == "production"
└── Skip if: last_audit_date < 7 days

Error Handling:
├── On timeout: Continue with warning
├── On failure: Pause workflow for manual review
└── Rollback: None required
```

### Workflow Validation

- Parameter compatibility checking
- Circular dependency detection
- Resource availability verification
- Estimated execution time calculation
- Risk assessment and warnings

## Execution Management

### Execution Modes

- **Interactive**: Pause for user input and approval at key steps
- **Automated**: Full automation with minimal user intervention
- **Dry Run**: Simulate execution without making changes
- **Step-by-Step**: Manual advancement through each step
- **Resume**: Continue from last successful step after failure

### Progress Tracking

```
Workflow: Production Deployment (Step 3 of 6)
============================================

✅ Step 1: Security Audit        [Completed in 45 minutes]
✅ Step 2: Test Suite           [Completed in 1.2 hours]
🔄 Step 3: Build & Package      [In Progress - 15 minutes elapsed]
⏳ Step 4: Deploy to Staging    [Waiting]
⏳ Step 5: Integration Tests    [Waiting]
⏳ Step 6: Production Deploy    [Waiting]

Current Status: Building application package...
Estimated Completion: 2.5 hours remaining
```

### Real-time Monitoring

- Live step execution status
- Resource usage monitoring
- Performance metrics collection
- Error and warning aggregation
- Notification delivery

## Error Handling and Recovery

### Failure Strategies

- **Fail Fast**: Stop execution on first error
- **Continue on Error**: Log errors but continue workflow
- **Retry**: Automatic retry with configurable attempts
- **Rollback**: Undo changes made by failed steps
- **Manual Intervention**: Pause for user decision

### Recovery Options

- Resume from last successful step
- Skip failed steps and continue
- Rollback to previous known good state
- Restart entire workflow with modifications
- Export partial results for manual completion

## Workflow Sharing and Templates

### Template Library

- Community-contributed workflow templates
- Organization-specific workflow collections
- Industry-specific compliance workflows
- Technology stack-specific development workflows
- Best practice implementation workflows

### Sharing Capabilities

- Export workflows as YAML or JSON
- Import workflows from files or URLs
- Version control integration for workflow management
- Team collaboration with workflow review process
- Public/private workflow sharing options

### Template Customization

- Parameter substitution for different environments
- Conditional logic based on project characteristics
- Modular workflow components for reuse
- Inheritance and composition patterns
- A/B testing different workflow variations

## Integration Features

### CI/CD Integration

- GitHub Actions workflow generation
- GitLab CI/CD pipeline creation
- Jenkins pipeline configuration
- Azure DevOps pipeline setup
- Custom CI/CD system integration

### API Access

- RESTful API for workflow management
- Webhook triggers for automated execution
- GraphQL interface for complex queries
- Command-line interface for scripting
- SDK for custom integrations

### Monitoring Integration

- Workflow execution metrics
- Step performance analytics
- Success rate tracking
- Resource usage monitoring
- Cost analysis and optimization

## Security and Compliance

- Workflow approval processes
- Audit trail for all executions
- Secure parameter handling
- Role-based access control
- Compliance workflow templates

## Related Commands

- `/list-prompts` - Discover prompts for workflow steps
- `/search-prompts` - Find specific prompts for workflow needs
- `/validate-environment` - Verify prerequisites before workflow execution
- `/export-config` - Share workflow configurations and templates

```xml
<role>
You are an expert workflow automation specialist with deep knowledge of process design, automation frameworks, and workflow optimization. You specialize in visual workflow creation and automation.
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
