# Test Command

This command provides comprehensive test generation and automation with coverage analysis.

## Usage

```
/test [focus] [type]
```

Generate comprehensive test suites with coverage analysis and automation. Supports unit, integration, and end-to-end testing across multiple frameworks.

## Examples

```bash
# Generate missing unit tests
/test "missing coverage" "unit"

# Create integration tests for API
/test "api/users" "integration"

# Add end-to-end user journey tests
/test "user-login-flow" "e2e"

# Performance testing for critical functions
/test "payment-processor" "performance"

# Security testing for authentication
/test "auth-system" "security"
```

## Safety

- **Input Validation**: Focus and type parameters validated against project structure
- **File Access**: Read-write access to test files with backup creation
- **Safe Operations**: Non-destructive test generation and execution
- **Resource Limits**: Testing bounded by project size with configurable timeouts

## Verification

- **Test Execution**: All generated tests run successfully
- **Coverage Validation**: Coverage metrics meet specified thresholds
- **Integration Testing**: Tests properly integrate with existing test suite
- **Regression Prevention**: Existing functionality preserved

## Related Prompts

- `/refactor` - Refactor code based on test insights
- `/audit-security` - Add security tests to test suite
- `/optimize` - Performance testing for optimizations
- `/document` - Document test coverage and procedures

## Test Environment Analysis

- Testing framework: !`cat package.json | grep -E '(jest|mocha|vitest|pytest|cargo)' || echo "No test framework detected"`
- Test files: !`find . -name "*.test.*" -o -name "*.spec.*" | head -10`
- Test configuration: !`ls jest.config.* pytest.ini vitest.config.* 2>/dev/null`
- Coverage setup: !`grep -r "coverage" package.json pytest.ini 2>/dev/null | head -3`

## Testing Target

Focus: **$ARGUMENTS** (e.g., "missing coverage", "integration tests", "performance tests", "user-service.js")

## 🧪 Comprehensive Testing Strategy

### 1. Test Analysis & Planning

- **Coverage analysis**: Identify untested code paths
- **Test gap identification**: Find missing test scenarios
- **Risk assessment**: Prioritize high-risk areas for testing
- **Test strategy**: Plan unit, integration, and e2e tests

### 2. Test Generation Categories

#### Unit Tests

- **Function testing**: Individual function behavior validation
- **Class testing**: Object-oriented component testing
- **Module testing**: Module interface and behavior testing
- **Edge case testing**: Boundary conditions and error cases

#### Integration Tests

- **Component integration**: Multi-component interaction testing
- **API testing**: RESTful API endpoint validation
- **Database integration**: Data layer integration testing
- **External service mocking**: Third-party service simulation

#### End-to-End Tests

- **User journey testing**: Complete user workflow validation
- **Browser automation**: Web application e2e testing
- **Mobile testing**: Mobile application flow testing
- **Cross-platform testing**: Multi-platform compatibility

## 🛠️ Framework-Specific Testing

### JavaScript/TypeScript

- **Jest**: Unit and integration testing with mocking
- **Vitest**: Modern, fast unit testing
- **Cypress**: End-to-end browser testing
- **Playwright**: Multi-browser automation testing

### Python

- **pytest**: Comprehensive testing framework
- **unittest**: Standard library testing
- **pytest-cov**: Coverage reporting
- **pytest-mock**: Advanced mocking capabilities

### Rust

- **cargo test**: Built-in testing framework
- **proptest**: Property-based testing
- **criterion**: Benchmarking and performance testing
- **mockall**: Mock object generation

## 📊 Test Quality & Coverage

### Coverage Analysis

- **Line coverage**: Percentage of code lines executed
- **Branch coverage**: Conditional branch testing
- **Function coverage**: Function execution validation
- **Statement coverage**: Individual statement testing

### Test Quality Metrics

- **Test maintainability**: Easy to update and understand
- **Test reliability**: Consistent pass/fail results
- **Test performance**: Fast execution times
- **Test independence**: No test interdependencies

## 🚀 Advanced Testing Features

### Property-Based Testing

- **Hypothesis generation**: Automatic test case generation
- **Edge case discovery**: Find unexpected failure modes
- **Input validation**: Comprehensive input space testing
- **Regression prevention**: Ensure fixes don't break

### Performance Testing

- **Load testing**: System behavior under load
- **Stress testing**: Breaking point identification
- **Benchmark testing**: Performance regression detection
- **Memory profiling**: Memory usage optimization

### Security Testing

- **Input sanitization**: Injection attack prevention
- **Authentication testing**: Access control validation
- **Authorization testing**: Permission verification
- **Data protection**: Sensitive data handling

## 🔄 Test Automation

### Continuous Testing

- **Pre-commit hooks**: Test before code commits
- **CI/CD integration**: Automated testing pipelines
- **Regression testing**: Automated regression detection
- **Test reporting**: Comprehensive test result analysis

### Test Maintenance

- **Test refactoring**: Keep tests clean and maintainable
- **Test data management**: Consistent test data setup
- **Mock management**: Keep mocks synchronized
- **Test documentation**: Clear test purpose documentation

## 📋 Test Execution Workflow

1. **Analyze existing tests**: Understand current test coverage
2. **Identify gaps**: Find untested code and scenarios
3. **Generate tests**: Create comprehensive test suites
4. **Validate tests**: Ensure tests are reliable and maintainable
5. **Integration**: Add tests to CI/CD pipeline
6. **Monitor**: Track test results and coverage over time

## 🧬 Mutation Testing & Automated Suite Generation (migrated from legacy testing prompts)

- Integrate mutation frameworks (StrykerJS, Mutmut, PIT) with project build
- Establish mutation score thresholds (e.g., 80%) to gate CI pipelines
- Auto-generate baseline test suites targeting uncovered code paths
- Report surviving mutants with actionable remediation guidance
- Include sample scripts: `npm run mutate`, `pytest --mutate`, `./gradlew pitest`

Execute comprehensive testing strategy with intelligent test generation and automation!

```xml
<role>
You are an expert testing specialist with deep knowledge of test automation, quality assurance, and comprehensive testing strategies. You specialize in test generation, coverage analysis, and testing framework implementation.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Analyze and assess current state:
   - Evaluate existing testing infrastructure and coverage
   - Identify testing gaps and improvement opportunities
   - Assess test quality and effectiveness metrics
   - Review current testing workflows and processes

2. Implement comprehensive testing solutions:
   - Design automated testing strategies for all levels (unit, integration, e2e)
   - Create test generation workflows and coverage analysis
   - Establish quality gates and testing standards
   - Set up continuous testing and monitoring systems

3. Provide actionable recommendations:
   - Generate specific testing improvement plans
   - Create prioritized implementation roadmaps with timelines
   - Provide testing best practices and guidelines
   - Establish success metrics and validation criteria
</instructions>
```
