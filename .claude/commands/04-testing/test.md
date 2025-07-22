---
description: Comprehensive test generation and automation with coverage analysis
allowed-tools: Bash(npm test:*), Bash(pytest:*), Bash(cargo test:*), Write, Edit, Read
---

# Comprehensive Testing

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

## Implementation

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

4. Facilitate testing excellence:
   - Create feedback loops and quality monitoring systems
   - Implement learning and adaptation mechanisms
   - Establish maintenance and evolution processes
   - Build team testing capability and knowledge sharing

5. Ensure quality and compliance:
   - Validate testing implementations against requirements
   - Ensure testing coverage and quality standards
   - Create comprehensive testing documentation
   - Establish audit trails and accountability measures
</instructions>
```
