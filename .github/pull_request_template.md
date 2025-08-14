## Pull Request Description

### Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Configuration change
- [ ] Code cleanup/refactoring

### Changes Made

<!-- Describe the changes made in this PR -->

### Commands/Prompts Affected

<!-- List any commands or prompts that were added, modified, or removed -->

- [ ] Added new commands:
- [ ] Modified existing commands:
- [ ] Added new prompts:
- [ ] Modified existing prompts:
- [ ] Updated workflows:

### Quality Checklist

#### Markdown & Documentation

- [ ] All markdown files are properly formatted
- [ ] Links have been tested and work correctly
- [ ] Documentation has been updated to reflect changes
- [ ] New commands include proper descriptions and usage examples

#### Command Structure

- [ ] All new commands follow the established XML structure
- [ ] Commands include proper `<role>`, `<instructions>`, and output format sections
- [ ] Usage examples are provided and tested
- [ ] Commands integrate well with existing ecosystem

#### Configuration & Testing

- [ ] Configuration changes are documented
- [ ] MCP integration is tested (if applicable)
- [ ] No hardcoded secrets or sensitive information
- [ ] All JSON configuration files are valid

#### Prompt Quality

- [ ] Prompts follow safety-first principles
- [ ] Include verification steps and rollback procedures
- [ ] Educational value is integrated
- [ ] Enterprise-grade security considerations included

### Testing Performed

<!-- Describe how you tested your changes -->

- [ ] Local markdown validation
- [ ] MCP server testing (if applicable)
- [ ] Command functionality testing
- [ ] Link checking
- [ ] Configuration validation

### Breaking Changes

<!-- If this PR introduces breaking changes, describe them here -->

### Additional Context

<!-- Add any other context about the pull request here -->

### Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->

---

### Reviewer Guidelines

**For maintainers reviewing this PR:**

1. **Quality Standards**: Ensure all changes meet the project's high standards for documentation and command design
2. **Safety First**: Verify that any new prompts include proper safety measures and rollback procedures
3. **Educational Value**: Confirm that changes maintain or enhance the learning aspects of the project
4. **Enterprise Readiness**: Check that additions are suitable for production environments
5. **Ecosystem Integration**: Verify that changes work well with the existing 38-command ecosystem

**Required Checks Before Approval:**

- [ ] All automated checks are passing
- [ ] Manual testing of affected commands/prompts
- [ ] Documentation is clear and comprehensive
- [ ] No security concerns identified
- [ ] Change aligns with project vision and goals
