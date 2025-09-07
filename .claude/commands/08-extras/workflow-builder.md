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

## Predefined Workflow Templates

### 1. New Project Setup Workflow

```yaml
name: New Project Setup
description: Complete project initialization and foundation setup
category: foundation
complexity: intermediate
estimated_time: 2-4 hours

parameters:
  - project_type: {type: string, options: [web-app, api, mobile, desktop, library]}
  - tech_stack: {type: string, options: [python, javascript, java, go, rust]}
  - team_size: {type: string, options: [solo, small, medium, large]}
  - compliance_level: {type: string, options: [basic, standard, enterprise]}

steps:
  1. Project Analysis
     - prompt: analyze-project.md
     - inputs: {scope: "initialization"}
     - capture_output: project_profile
     - timeout: 15 minutes

  2. Environment Validation
     - prompt: validate-environment.md
     - inputs: {tech_stack: "${tech_stack}"}
     - parallel_with: project_bootstrap
     - timeout: 10 minutes

  3. Project Bootstrap
     - prompt: comprehensive-bootstrap.md
     - inputs: {project_type: "${project_type}", stack: "${tech_stack}"}
     - depends_on: project_analysis
     - timeout: 30 minutes

  4. Security Baseline
     - prompt: harden.md
     - inputs: {level: "${compliance_level}"}
     - condition: compliance_level != "basic"
     - timeout: 45 minutes

  5. Quality Gates
     - prompt: pre-commit.md
     - inputs: {strictness: "standard"}
     - depends_on: project_bootstrap
     - timeout: 20 minutes

  6. Documentation Foundation
     - prompt: document.md
     - inputs: {type: "auto-generated"}
     - parallel_with: testing_setup
     - timeout: 30 minutes

  7. Testing Setup
     - prompt: test.md
     - inputs: {coverage_target: 70, type: "unit-integration"}
     - parallel_with: documentation_foundation
     - timeout: 45 minutes

  8. Health Check
     - prompt: health-check.md
     - inputs: {scope: "comprehensive"}
     - depends_on: [quality_gates, testing_setup]
     - timeout: 15 minutes

success_criteria:
  - project_structure_created: true
  - security_baseline_established: true
  - quality_gates_active: true
  - documentation_generated: true
  - tests_passing: true
```

### 2. Security Audit Workflow

```yaml
name: Security Audit & Hardening
description: Comprehensive security assessment and hardening
category: security
complexity: advanced
estimated_time: 4-8 hours

parameters:
  - audit_scope: {type: string, options: [dependencies, codebase, infrastructure, full]}
  - compliance_standards: {type: array, options: [SOC2, GDPR, HIPAA, PCI-DSS]}
  - environment: {type: string, options: [development, staging, production]}
  - paranoia_level: {type: string, options: [standard, thorough, paranoid]}

steps:
  1. Security Baseline Assessment
     - prompt: health-check.md
     - inputs: {focus: "security"}
     - capture_output: baseline_report
     - timeout: 20 minutes

  2. Vulnerability Scanning
     - prompt: audit-security.md
     - inputs: {scope: "${audit_scope}", depth: "${paranoia_level}"}
     - capture_output: vulnerability_report
     - timeout: 60 minutes

  3. Dependency Analysis
     - prompt: analyze-dependencies.md
     - parallel_with: code_quality_scan
     - capture_output: dependency_report
     - timeout: 30 minutes

  4. Code Quality Security Scan
     - prompt: code-review.md
     - inputs: {focus: "security", depth: "thorough"}
     - parallel_with: dependency_analysis
     - capture_output: code_security_report
     - timeout: 45 minutes

  5. Compliance Validation
     - prompt: comply.md
     - inputs: {standards: "${compliance_standards}", environment: "${environment}"}
     - depends_on: [vulnerability_scanning, dependency_analysis]
     - condition: vulnerability_count < 10
     - timeout: 90 minutes

  6. Security Hardening
     - prompt: harden.md
     - inputs: {
         environment: "${environment}",
         findings: "${vulnerability_report}",
         compliance: "${compliance_standards}"
       }
     - depends_on: compliance_validation
     - timeout: 120 minutes

  7. Incident Response Preparation
     - prompt: incident-response.md
     - inputs: {scope: "security", environment: "${environment}"}
     - condition: environment == "production"
     - timeout: 45 minutes

  8. Security Verification
     - prompt: audit-security.md
     - inputs: {scope: "verification", depth: "standard"}
     - depends_on: security_hardening
     - retry_on_failure: 2
     - timeout: 30 minutes

success_criteria:
  - critical_vulnerabilities: 0
  - high_vulnerabilities: < 3
  - compliance_score: > 90%
  - security_controls_implemented: true
  - incident_response_ready: true
```

### 3. Code Quality Improvement Workflow

```yaml
name: Code Quality Enhancement
description: Comprehensive code quality analysis and improvement
category: development
complexity: intermediate
estimated_time: 3-6 hours

parameters:
  - quality_target: {type: string, options: [basic, standard, high, excellent]}
  - coverage_target: {type: number, min: 50, max: 95, default: 80}
  - refactor_scope: {type: string, options: [critical, moderate, comprehensive]}
  - performance_focus: {type: boolean, default: true}

steps:
  1. Current State Analysis
     - prompt: analyze-project.md
     - inputs: {focus: "quality"}
     - capture_output: quality_baseline
     - timeout: 20 minutes

  2. Code Review Analysis
     - prompt: code-review.md
     - inputs: {scope: "full", depth: "thorough"}
     - capture_output: review_report
     - timeout: 60 minutes

  3. Technical Debt Assessment
     - prompt: tech-debt.md
     - inputs: {scope: "prioritize"}
     - parallel_with: test_analysis
     - capture_output: debt_report
     - timeout: 45 minutes

  4. Test Coverage Analysis
     - prompt: test.md
     - inputs: {action: "analyze", target_coverage: "${coverage_target}"}
     - parallel_with: technical_debt_assessment
     - capture_output: test_report
     - timeout: 30 minutes

  5. Performance Profiling
     - prompt: optimize.md
     - inputs: {action: "analyze", scope: "performance"}
     - condition: performance_focus == true
     - depends_on: current_state_analysis
     - capture_output: performance_report
     - timeout: 45 minutes

  6. Refactoring Implementation
     - prompt: refactor.md
     - inputs: {
         scope: "${refactor_scope}",
         findings: "${review_report}",
         debt_priorities: "${debt_report}"
       }
     - depends_on: [code_review_analysis, technical_debt_assessment]
     - timeout: 180 minutes

  7. Test Enhancement
     - prompt: test.md
     - inputs: {
         action: "enhance",
         target_coverage: "${coverage_target}",
         focus_areas: "${test_report}"
       }
     - depends_on: test_coverage_analysis
     - parallel_with: refactoring_implementation
     - timeout: 120 minutes

  8. Performance Optimization
     - prompt: optimize.md
     - inputs: {
         action: "implement",
         findings: "${performance_report}"
       }
     - condition: performance_focus == true
     - depends_on: performance_profiling
     - timeout: 90 minutes

  9. Quality Validation
     - prompt: code-review.md
     - inputs: {scope: "validation", baseline: "${quality_baseline}"}
     - depends_on: [refactoring_implementation, test_enhancement]
     - timeout: 30 minutes

success_criteria:
  - code_quality_score: > 85%
  - test_coverage: >= "${coverage_target}"%
  - technical_debt_reduced: > 30%
  - performance_improved: > 20%
  - all_tests_passing: true
```

### 4. Deployment Pipeline Workflow

```yaml
name: Production Deployment Pipeline
description: Complete CI/CD setup and production deployment
category: deployment
complexity: advanced
estimated_time: 4-8 hours

parameters:
  - platform: {type: string, options: [github, gitlab, jenkins, azure-devops]}
  - environment: {type: string, options: [staging, production, both]}
  - deployment_strategy: {type: string, options: [blue-green, rolling, canary]}
  - monitoring_level: {type: string, options: [basic, standard, comprehensive]}

steps:
  1. Pre-deployment Validation
     - prompt: validate-environment.md
     - inputs: {scope: "deployment"}
     - capture_output: validation_report
     - timeout: 15 minutes

  2. Security Pre-check
     - prompt: audit-security.md
     - inputs: {scope: "pre-deployment", depth: "standard"}
     - parallel_with: quality_gates
     - timeout: 30 minutes

  3. Quality Gates Validation
     - prompt: pre-commit.md
     - inputs: {action: "validate", strictness: "production"}
     - parallel_with: security_precheck
     - timeout: 20 minutes

  4. CI/CD Pipeline Setup
     - prompt: setup-ci.md
     - inputs: {
         platform: "${platform}",
         environment: "${environment}",
         strategy: "${deployment_strategy}"
       }
     - depends_on: [pre_deployment_validation, security_precheck]
     - timeout: 120 minutes

  5. Backup Strategy
     - prompt: backup.md
     - inputs: {scope: "production", strategy: "comprehensive"}
     - condition: environment in ["production", "both"]
     - timeout: 45 minutes

  6. Monitoring Setup
     - prompt: monitor.md
     - inputs: {
         level: "${monitoring_level}",
         environment: "${environment}"
       }
     - parallel_with: backup_strategy
     - timeout: 60 minutes

  7. Deployment Execution
     - prompt: deploy.md
     - inputs: {
         environment: "${environment}",
         strategy: "${deployment_strategy}",
         monitoring: true
       }
     - depends_on: [ci_cd_pipeline_setup, monitoring_setup]
     - rollback_on_failure: true
     - timeout: 90 minutes

  8. Post-deployment Validation
     - prompt: health-check.md
     - inputs: {scope: "post-deployment", environment: "${environment}"}
     - depends_on: deployment_execution
     - retry_on_failure: 3
     - timeout: 20 minutes

  9. Incident Response Setup
     - prompt: incident-response.md
     - inputs: {scope: "deployment", environment: "${environment}"}
     - condition: environment == "production"
     - timeout: 30 minutes

success_criteria:
  - pipeline_created: true
  - deployment_successful: true
  - monitoring_active: true
  - backup_configured: true
  - health_checks_passing: true
  - rollback_tested: true
```

### 5. Learning & Skill Development Workflow

```yaml
name: Team Learning & Development
description: Structured learning path with hands-on practice
category: learning
complexity: beginner
estimated_time: 2-4 weeks

parameters:
  - skill_area: {type: string, options: [security, testing, performance, architecture]}
  - experience_level: {type: string, options: [beginner, intermediate, advanced]}
  - learning_style: {type: string, options: [hands-on, theoretical, mixed]}
  - time_commitment: {type: string, options: [light, moderate, intensive]}

steps:
  1. Skill Assessment
     - prompt: analyze-project.md
     - inputs: {focus: "team-skills", area: "${skill_area}"}
     - capture_output: skill_baseline
     - timeout: 30 minutes

  2. Learning Path Creation
     - prompt: learn.md
     - inputs: {
         area: "${skill_area}",
         level: "${experience_level}",
         style: "${learning_style}",
         commitment: "${time_commitment}"
       }
     - depends_on: skill_assessment
     - capture_output: learning_plan
     - timeout: 45 minutes

  3. Best Practices Study
     - prompt: best-practices.md
     - inputs: {
         domain: "${skill_area}",
         level: "${experience_level}",
         project_context: true
       }
     - parallel_with: hands_on_practice
     - timeout: 60 minutes

  4. Hands-on Practice
     - prompt: troubleshoot.md
     - inputs: {
         area: "${skill_area}",
         mode: "guided-practice",
         difficulty: "${experience_level}"
       }
     - parallel_with: best_practices_study
     - timeout: 120 minutes

  5. Knowledge Base Contribution
     - prompt: knowledge-base.md
     - inputs: {
         action: "contribute",
         area: "${skill_area}",
         learnings: "${learning_plan}"
       }
     - depends_on: [best_practices_study, hands_on_practice]
     - timeout: 45 minutes

  6. Skill Validation
     - prompt: analyze-project.md
     - inputs: {
         focus: "skill-validation",
         area: "${skill_area}",
         baseline: "${skill_baseline}"
       }
     - depends_on: knowledge_base_contribution
     - timeout: 30 minutes

success_criteria:
  - learning_objectives_met: true
  - hands_on_practice_completed: true
  - knowledge_shared: true
  - skill_improvement_measured: > 25%
  - team_knowledge_updated: true
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

### Advanced Workflow Validation

#### Dependency Validation

- **Circular Dependency Detection**: Prevents infinite loops in workflow execution
- **Missing Dependency Identification**: Ensures all required steps are present
- **Resource Conflict Resolution**: Detects competing resource usage
- **Parameter Flow Validation**: Verifies data compatibility between steps
- **Timing Constraint Checking**: Validates execution order and timing requirements

```bash
# Example validation output:
Workflow Validation Results:
✅ No circular dependencies detected
✅ All step dependencies satisfied
⚠️  Warning: Steps 3 and 4 may compete for database resources
❌ Error: Step 5 requires output from Step 2, but Step 2 doesn't produce that output
✅ Estimated execution time: 2.5 hours (within acceptable range)
⚠️  Risk: Step 6 has 15% historical failure rate in similar environments
```

#### Parameter Compatibility Matrix

```yaml
compatibility_rules:
  - source_step: "audit-security"
    output_type: "vulnerability_report"
    compatible_inputs:
      - step: "harden"
        parameter: "findings"
        transformation: "json_to_structured"
      - step: "comply"
        parameter: "security_issues"
        transformation: "filter_critical"

  - source_step: "analyze-project"
    output_type: "project_profile"
    compatible_inputs:
      - step: "smart-suggest"
        parameter: "context"
        transformation: "direct"
      - step: "setup-ci"
        parameter: "project_config"
        transformation: "extract_tech_stack"
```

#### Resource Availability Verification

- **Tool Dependencies**: Verify required tools are installed and accessible
- **API Access**: Check external service availability and authentication
- **Compute Resources**: Estimate and verify available CPU, memory, and disk space
- **Network Requirements**: Validate connectivity to required services
- **Permission Checks**: Ensure necessary permissions for file and system operations

#### Risk Assessment Engine

```yaml
risk_factors:
  - factor: "step_complexity"
    weight: 0.3
    calculation: "based on historical execution time variance"
  
  - factor: "dependency_chain_length"
    weight: 0.2
    calculation: "number of sequential dependencies"
  
  - factor: "external_dependencies"
    weight: 0.25
    calculation: "number of external API calls or services"
  
  - factor: "data_transformation_complexity"
    weight: 0.15
    calculation: "complexity of parameter transformations"
  
  - factor: "historical_failure_rate"
    weight: 0.1
    calculation: "failure rate in similar environments"

risk_levels:
  - low: 0-30% (Green)
  - medium: 31-60% (Yellow)
  - high: 61-80% (Orange)
  - critical: 81-100% (Red)
```

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
