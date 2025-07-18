---
deprecated: true
alias_of: /.claude/commands/04-testing/test.md
---
**DEPRECATED:** Test suite generation is part of `/test`.

# Comprehensive Test Suite Generation

```xml
<role>
You are a test automation architect creating a comprehensive testing strategy that ensures code quality, prevents regressions, and enables confident deployments. You follow testing best practices and understand various testing paradigms.
</role>

<activation>
CLAUDE.CONFIG:
  test_framework_preference: "modern"
  coverage_target: 90
  test_isolation: true
</activation>

<instructions>
Phase 1: Test Strategy Development
1. Analyze current test coverage and identify gaps:
   - Unit test coverage by module
   - Integration test presence
   - E2E test scenarios
   - Performance test suites
   - Security test cases

2. Create TEST_STRATEGY.md documenting:
   - Testing pyramid implementation
   - Test naming conventions
   - Mocking strategies
   - Test data management
   - CI/CD integration approach

Phase 2: Unit Test Implementation
3. Create comprehensive unit tests:
   - Test each public method/function
   - Cover happy path scenarios
   - Test edge cases and error conditions
   - Verify error messages and codes
   - Test boundary conditions
   - Implement parameterized tests for similar scenarios

4. Unit test best practices:
   - Arrange-Act-Assert pattern
   - One assertion per test method
   - Descriptive test names
   - Test isolation (no shared state)
   - Deterministic tests (no randomness)
   - Fast execution (<100ms per test)

Phase 3: Integration Test Development
5. Create integration tests for:
   - API endpoint testing
   - Database operations
   - External service interactions
   - Message queue operations
   - File system operations
   - Multi-component workflows

6. Integration test patterns:
   - Use test containers for databases
   - Mock external services
   - Test transaction rollbacks
   - Verify data persistence
   - Test concurrent operations
   - Validate error propagation

Phase 4: End-to-End Test Automation
7. Implement E2E tests:
   - Critical user journeys
   - Cross-browser compatibility
   - Mobile responsiveness
   - Multi-step workflows
   - Payment flows
   - Authentication flows

8. E2E best practices:
   - Page Object Model pattern
   - Explicit waits over implicit
   - Screenshot on failure
   - Parallel execution support
   - Retry mechanisms for flakiness
   - Test data cleanup

Phase 5: Specialized Testing
9. Performance tests:
   - Load testing scenarios
   - Stress testing limits
   - Spike testing
   - Endurance testing
   - Scalability testing

10. Security tests:
    - Input validation testing
    - Authentication testing
    - Authorization testing
    - Session management
    - SQL injection attempts
    - XSS prevention verification

Phase 6: Test Infrastructure
11. Set up test automation:
    - Continuous test execution
    - Parallel test running
    - Test result reporting
    - Coverage tracking
    - Flaky test detection
    - Test execution time optimization
</instructions>

<test_templates>
## Unit Test Template
```javascript
describe('[ComponentName]', () => {
  describe('[methodName]', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = ...;
      const expected = ...;

      // Act
      const result = methodName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should throw [ErrorType] when [invalid condition]', () => {
      // Arrange
      const invalidInput = ...;

      // Act & Assert
      expect(() => methodName(invalidInput))
        .toThrow(ErrorType);
    });
  });
});
```

## Integration Test Template

```javascript
describe('[Feature] Integration Tests', () => {
  let testDatabase;
  let testServer;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
    testServer = await startTestServer(testDatabase);
  });

  afterAll(async () => {
    await testDatabase.cleanup();
    await testServer.close();
  });

  beforeEach(async () => {
    await testDatabase.reset();
  });

  it('should [complete workflow] successfully', async () => {
    // Arrange
    const testData = await seedTestData();

    // Act
    const response = await request(testServer)
      .post('/api/endpoint')
      .send(testData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({...});

    // Verify side effects
    const dbRecord = await testDatabase.findOne(...);
    expect(dbRecord).toBeDefined();
  });
});
```

<coverage_requirements>

- Line coverage: minimum 80%
- Branch coverage: minimum 75%
- Function coverage: minimum 90%
- Critical paths: 100% coverage required
</coverage_requirements>
</xml>

```
