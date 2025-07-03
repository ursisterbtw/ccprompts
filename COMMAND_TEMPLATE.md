# Command Template for ccprompts Ecosystem

This document provides the standardized template for creating new commands in the ccprompts ecosystem, ensuring consistency, quality, and proper integration with the validation framework.

## Command File Structure

Every command file in `.claude/commands/` must follow this exact structure:

### 1. Command Header

```markdown
# [Command-Name] Command

[Brief one-line description of what the command does]
```

### 2. Required Sections (in order)

#### **Usage Section**

```markdown
## Usage

```bash
/[command-name] [parameter1] [parameter2] [optional-parameter]

#### **Description Section**

```markdown
## Description
[Detailed description of command functionality]:
1. [Primary function with specific details]
2. [Secondary function with specific details]
3. [Additional features with specific details]
4. [Integration capabilities with specific details]
5. [Learning/educational components with specific details]
6. [Safety and validation features with specific details]
```

#### **Parameters Section**

```markdown
## Parameters
- `parameter1`: [description with valid values/format]
- `parameter2`: [description with valid values/format]
- `optional-parameter`: [description with default behavior]
```

#### **Examples Section**

```markdown
## Examples
```bash
/[command-name] [example1-params]
/[command-name] [example2-params]
/[command-name] [example3-params]
```

```

### 3. Extended Documentation Sections

#### **Use Cases Section (Recommended)**
```markdown
## Use Cases
- **[Use Case 1]**: `/[command-name] [params]` - [detailed scenario description]
- **[Use Case 2]**: `/[command-name] [params]` - [detailed scenario description]
- **[Use Case 3]**: `/[command-name] [params]` - [detailed scenario description]
```

#### **Related Prompts Section (Required)**

```markdown
## Related Prompts
- `prompts/[category]/[prompt-file].md` - [Brief description of related prompt]
- `prompts/[category]/[prompt-file].md` - [Brief description of related prompt]
```

### 4. Command Implementation Section (Required)

Every command must include the XML implementation structure:

```markdown
## Command Implementation

```xml
<role>
You are a [specific expert role] specializing in [domain expertise]. Your mission is to [specific objective] while [teaching/learning component] and [safety consideration].
</role>

<activation>
CLAUDE.CONFIG:
  [domain]_mode: "[specialized_mode]"
  [safety_level]: "[appropriate_level]"
  [automation_level]: "[suitable_scope]"
  [validation]: "[validation_approach]"
  [learning_integration]: "[learning_mode]"
</activation>

<instructions>
Phase 1: [Analysis/Planning Phase]
1. [Specific step with clear outcome]
2. [Specific step with clear outcome]
3. [Validation step]

Phase 2: [Implementation Phase]
4. [Implementation step with safety checks]
5. [Implementation step with progress tracking]
6. [Quality assurance step]

Phase 3: [Validation/Documentation Phase]
7. [Validation step with clear criteria]
8. [Documentation step for knowledge capture]
9. [Learning objective completion]
10. [Handoff and next steps]
</instructions>
```

```

## Content Guidelines

### Writing Standards

#### **Clarity and Precision**
- Use clear, action-oriented language
- Provide specific examples for all parameters
- Include realistic usage scenarios
- Avoid jargon without explanation

#### **Consistency**
- Follow the exact section order specified above
- Use consistent formatting for code blocks, parameters, and examples
- Maintain consistent tone across all commands
- Use standardized command naming conventions

#### **Completeness**
- Every command must have all required sections
- Examples must cover common use cases
- Related prompts must be accurately linked
- Implementation XML must be comprehensive

### Technical Requirements

#### **Parameter Documentation**
```markdown
- `parameter`: `type` | `valid_values` - Description with default behavior
```

**Examples:**

```markdown
- `issue-type`: `security` | `performance` | `quality` | `dependencies` - Type of issue to fix
- `coverage`: `basic` | `comprehensive` | `enterprise` - Scope of testing to implement  
- `urgency`: `low` | `medium` | `high` | `critical` - Priority level for execution
```

#### **Example Format**

```markdown
```bash
/command-name param1 param2
/command-name different-param1 different-param2
/command-name advanced-usage complex-params
```

```

#### **Use Case Format**
```markdown
- **[Scenario Name]**: `/command params` - [Business context and expected outcome]
```

## XML Implementation Standards

### Role Definition Requirements

- Specify exact expertise domain
- Include teaching/learning mission
- Mention safety and quality objectives
- Reference specific methodologies or frameworks

### Activation Configuration

- Domain-specific mode settings
- Appropriate safety levels for command type
- Automation scope matching command complexity
- Validation approach suitable for command purpose
- Learning integration matching user development goals

### Instructions Structure

- **Phase 1**: Always analysis, planning, or preparation
- **Phase 2**: Core implementation with safety checks
- **Phase 3**: Validation, documentation, and knowledge transfer
- Each phase should have 3-4 specific, actionable steps
- Include validation criteria and success metrics

## Quality Assurance Checklist

### Pre-Submission Validation

- [ ] All required sections present and properly formatted
- [ ] Usage examples cover common scenarios
- [ ] Parameters clearly documented with types and defaults
- [ ] XML implementation follows phase structure
- [ ] Related prompts accurately linked
- [ ] Command integrates with ecosystem workflows

### Content Quality Checks  

- [ ] Examples are realistic and actionable
- [ ] Description explains business value and technical approach
- [ ] Safety considerations appropriate for command complexity
- [ ] Learning objectives align with target user development
- [ ] Command fits within existing ecosystem without duplication

### Technical Validation

- [ ] Command name follows kebab-case convention
- [ ] Parameters use consistent naming patterns
- [ ] XML structure validates without errors
- [ ] File passes automated validation script
- [ ] Integration with existing commands documented

## Integration Requirements

### Ecosystem Integration

Every command must:

1. **Reference related prompts** from the prompts/ directory
2. **Integrate with workflow sequences** for common development scenarios  
3. **Support command chaining** with appropriate parameter passing
4. **Include appropriate safety measures** for the command's scope and impact
5. **Provide learning opportunities** that build user capabilities

### Documentation Integration

Commands must integrate with:

- **CLAUDE.md** - Overall project guidance and command ecosystem explanation
- **README.md** - User-facing documentation and getting started guides
- **Workflow definitions** - Automated sequences using multiple commands
- **Validation framework** - Automated quality assurance and testing

## Example Command Template

```markdown
# Example-Command Command

Provides comprehensive example functionality for demonstration purposes.

## Usage
```

/example-command [action] [scope] [complexity]

```

## Description
Demonstrates command template standards and integration patterns:
1. Shows proper parameter handling and validation
2. Illustrates comprehensive documentation structure
3. Provides realistic examples and use cases
4. Demonstrates XML implementation standards
5. Shows ecosystem integration patterns
6. Includes appropriate safety and learning components

## Parameters
- `action`: `create` | `update` | `validate` | `export` - Type of action to perform
- `scope`: `basic` | `comprehensive` | `enterprise` - Scope of operation
- `complexity`: `low` | `medium` | `high` - Complexity level for customization

## Examples
```bash
/example-command create basic low
/example-command update comprehensive medium  
/example-command validate enterprise high
/example-command export basic medium
```

## Use Cases

- **Learning Template Structure**: `/example-command create basic low` - Understand command template requirements
- **Validation Reference**: `/example-command validate comprehensive high` - Check command against quality standards
- **Integration Example**: `/example-command export enterprise medium` - See ecosystem integration patterns

## Related Prompts

- `prompts/01-project-initialization/comprehensive-bootstrap.md` - Project setup and initialization
- `prompts/05-documentation/documentation-generator.md` - Documentation creation and management

## Command Implementation

```xml
<role>
You are a documentation and template expert specializing in creating consistent, high-quality command interfaces. Your mission is to demonstrate best practices while teaching proper command development patterns.
</role>

<activation>
CLAUDE.CONFIG:
  template_mode: "demonstration"
  validation_level: "comprehensive"
  documentation: "detailed"
  learning_integration: "hands_on"
</activation>

<instructions>
Phase 1: Template Analysis and Setup
1. Analyze command requirements and integration needs
2. Validate template structure and content standards
3. Prepare demonstration environment and examples

Phase 2: Template Implementation
4. Implement command functionality following template standards
5. Generate comprehensive examples and use cases
6. Apply quality assurance and validation checks

Phase 3: Documentation and Learning
7. Create detailed documentation and integration guides
8. Validate command against ecosystem standards
9. Provide learning objectives and next steps
10. Generate template artifacts for reuse and reference
</instructions>
```

```

## Validation Integration

This template is validated by the `scripts/validate-prompts.js` framework. Commands following this template should pass all validation checks for:

- **Structure Validation**: All required sections present
- **Content Quality**: Examples, descriptions, and documentation complete
- **XML Validation**: Proper XML structure and content
- **Integration Testing**: Proper ecosystem integration and referencing

---

**This template ensures consistency, quality, and proper integration across the entire ccprompts command ecosystem while maintaining educational value and safety standards.**
