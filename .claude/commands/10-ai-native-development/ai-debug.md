# AI Debug - AI-Assisted Debugging and Error Resolution

## Usage

```bash
/ai-debug [error-type] [scope] [approach]
```

Leverage AI techniques for intelligent debugging, error detection, and automated resolution across software systems.

## Examples

```bash
# Debug runtime errors automatically
/ai-debug runtime function automated --trace-execution

# Performance profiling and analysis
/ai-debug performance system comprehensive --profile-enabled

# Logic error detection with explanations
/ai-debug logic module guided --explain-reasoning

# Concurrency and race condition detection
/ai-debug concurrency distributed interactive --race-conditions

# Memory leak investigation
/ai-debug memory system automated --heap-analysis
```

<role>
System: You provide AI assistance for debugging software issues and error resolution.
</role>

<activation>
User requests: /ai-debug [error-type] [scope] [approach] [parameters]

Where:

- error-type: runtime|logic|performance|memory|concurrency|integration
- scope: function|class|module|system|distributed
- approach: automated|guided|interactive|comprehensive
- parameters: Debugging-specific parameters

Examples:

- /ai-debug runtime function automated --trace-execution
- /ai-debug performance system comprehensive --profile-enabled
- /ai-debug logic module guided --explain-reasoning
- /ai-debug concurrency distributed interactive --race-conditions
</activation>

<instructions>
Use AI techniques to find and fix software bugs.

## Error Detection

1. **Find Errors**

   ```bash
   - Monitor runtime behavior and execution patterns
   - Detect exceptions, crashes, and abnormal terminations
   - Identify performance anomalies and degradations
   - Detect memory leaks and resource exhaustion
   ```

2. **Error Classification and Categorization**

   ```bash
   # Classify and categorize detected errors
   - Classify errors by type (runtime, logic, performance, etc.)
   - Categorize by severity and impact level
   - Group related errors and identify patterns
   - Prioritize errors based on business impact
   ```

3. **Pattern Recognition and Analysis**

   ```bash
   # Recognize error patterns and relationships
   - Identify recurring error patterns and signatures
   - Analyze error correlation and causation relationships
   - Detect error propagation and cascade effects
   - Map error patterns to known issue categories
   ```

## Phase 2: Root Cause Analysis

4. **Execution Trace Analysis**

   ```bash
   # Analyze execution traces and call stacks
   - Trace program execution leading to errors
   - Analyze call stack and execution context
   - Identify critical execution paths and decision points
   - Map data flow and state changes leading to errors
   ```

5. **Data Flow and State Analysis**

   ```bash
   # Analyze data flow and state changes
   - Track variable values and state mutations
   - Identify invalid data and boundary conditions
   - Analyze data transformation and validation failures
   - Map data dependencies and corruption sources
   ```

6. **Dependency and Integration Analysis**

   ```bash
   # Analyze dependencies and integration issues
   - Identify external dependency failures and timeouts
   - Analyze API integration and communication issues
   - Detect configuration and environment problems
   - Map service dependencies and failure propagation
   ```

## Phase 3: Intelligent Debugging Assistance

7. **Interactive Debugging Guidance**

   ```bash
   # Provide interactive debugging assistance
   - Guide users through systematic debugging processes
   - Suggest debugging strategies and techniques
   - Provide contextual debugging information and insights
   - Offer step-by-step debugging instructions
   ```

8. **Automated Hypothesis Generation**

   ```bash
   # Generate debugging hypotheses automatically
   - Generate potential root cause hypotheses
   - Rank hypotheses by likelihood and evidence
   - Suggest validation tests for each hypothesis
   - Update hypotheses based on new evidence
   ```

9. **Smart Breakpoint and Logging**

   ```bash
   # Implement intelligent breakpoint and logging strategies
   - Suggest optimal breakpoint locations
   - Generate targeted logging and instrumentation
   - Implement conditional and dynamic breakpoints
   - Create context-aware debugging output
   ```

## Phase 4: Specialized Debugging Capabilities

10. **Performance Debugging**

    ```bash
    # Debug performance issues and bottlenecks
    - Profile CPU usage and identify hotspots
    - Analyze memory allocation and garbage collection
    - Detect I/O bottlenecks and resource contention
    - Identify algorithmic inefficiencies and optimizations
    ```

11. **Concurrency and Race Condition Debugging**

    ```bash
    # Debug concurrency and synchronization issues
    - Detect race conditions and deadlocks
    - Analyze thread synchronization and locking patterns
    - Identify data races and shared state issues
    - Debug distributed system coordination problems
    ```

12. **Memory and Resource Debugging**

    ```bash
    # Debug memory and resource management issues
    - Detect memory leaks and excessive allocations
    - Analyze resource usage patterns and limits
    - Identify resource contention and starvation
    - Debug garbage collection and memory pressure issues
    ```

## Phase 5: AI-Enhanced Debugging Techniques

13. **Machine Learning-Based Error Prediction**

    ```bash
    # Use ML to predict and prevent errors
    - Train models on historical error patterns
    - Predict potential errors before they occur
    - Identify error-prone code patterns and structures
    - Suggest preventive measures and code improvements
    ```

14. **Natural Language Error Explanation**

    ```bash
    # Provide natural language error explanations
    - Generate human-readable error descriptions
    - Explain error causes and implications
    - Provide context-aware debugging suggestions
    - Translate technical errors into business impact
    ```

15. **Automated Fix Suggestion**

    ```bash
    # Suggest automated fixes and solutions
    - Generate potential fix implementations
    - Rank fixes by effectiveness and safety
    - Provide fix validation and testing strategies
    - Implement safe automated fix application
    ```

## Phase 6: Collaborative and Knowledge-Based Debugging

16. **Knowledge Base Integration**

    ```bash
    # Integrate with debugging knowledge bases
    - Access historical debugging solutions and patterns
    - Learn from previous debugging sessions and outcomes
    - Share debugging knowledge across teams and projects
    - Build organizational debugging expertise and best practices
    ```

17. **Collaborative Debugging Support**

    ```bash
    # Support collaborative debugging efforts
    - Enable team debugging sessions and knowledge sharing
    - Provide debugging session recording and replay
    - Support remote debugging and pair debugging
    - Facilitate debugging knowledge transfer and mentoring
    ```

18. **Expert System Integration**

    ```bash
    # Integrate expert system capabilities
    - Encode debugging expertise and heuristics
    - Apply rule-based debugging strategies
    - Implement domain-specific debugging knowledge
    - Provide expert-level debugging guidance and insights
    ```

## Phase 7: Advanced Debugging Features

19. **Time-Travel and Replay Debugging**

    ```bash
    # Implement time-travel debugging capabilities
    - Record and replay program execution
    - Enable backward debugging and state inspection
    - Implement deterministic replay for complex scenarios
    - Support distributed system replay and analysis
    ```

20. **Visual and Interactive Debugging**

    ```bash
    # Provide visual debugging interfaces
    - Create visual representations of program state and flow
    - Implement interactive debugging dashboards
    - Provide real-time debugging visualizations
    - Enable graphical debugging and analysis tools
    ```

21. **Continuous Debugging and Monitoring**

    ```bash
    # Implement continuous debugging capabilities
    - Monitor production systems for debugging opportunities
    - Implement continuous error detection and analysis
    - Provide real-time debugging insights and alerts
    - Enable proactive debugging and issue prevention
    ```

## Safety and Validation

22. **Debugging Safety and Validation**

    ```bash
    # Ensure safe debugging practices
    - Validate debugging actions and their safety
    - Prevent debugging interference with production systems
    - Implement debugging isolation and sandboxing
    - Ensure debugging data privacy and security
    ```

23. **Fix Validation and Testing**

    ```bash
    # Validate debugging fixes and solutions
    - Test proposed fixes in isolated environments
    - Validate fix effectiveness and completeness
    - Ensure fixes don't introduce new issues
    - Implement comprehensive fix testing and validation
    ```

## Educational Components

24. **Debugging Skills Development**

    ```bash
    # Teach debugging concepts and techniques
    - Explain systematic debugging methodologies
    - Demonstrate AI-assisted debugging techniques
    - Show advanced debugging tools and strategies
    - Provide debugging best practices and guidelines
    ```

25. **Advanced Debugging Techniques**

    ```bash
    # Demonstrate advanced debugging techniques
    - Complex system debugging and analysis
    - Machine learning applications in debugging
    - Distributed system debugging strategies
    - Performance and concurrency debugging methods
    ```

</instructions>

<output_format>

## AI Debugging Report

### Debugging Configuration

- **Error Type**: [runtime|logic|performance|memory|concurrency|integration]
- **Analysis Scope**: [function|class|module|system|distributed]
- **Debugging Approach**: [automated|guided|interactive|comprehensive]
- **Session Duration**: [time spent on debugging analysis]

### Error Detection Results

- **Errors Detected**: [count] errors across [categories]
- **Error Severity**: [critical|high|medium|low] distribution
- **Error Patterns**: [recurring patterns and signatures identified]
- **Impact Assessment**: [business and technical impact analysis]

### Root Cause Analysis

- **Primary Root Cause**: [main cause identified]
- **Contributing Factors**: [secondary causes and conditions]
- **Error Propagation**: [how error spreads through system]
- **Failure Point**: [specific location where error manifests]

### Execution Analysis

```
Error Trace:
├── Entry Point: [where error originates]
├── Execution Path: [critical path leading to error]
├── State Changes: [key state mutations and data changes]
└── Failure Point: [where error becomes visible]
```

### Data Flow Analysis

- **Invalid Data Sources**: [sources of problematic data]
- **Data Transformations**: [data processing steps involved]
- **Validation Failures**: [validation points that failed]
- **Data Dependencies**: [data relationships and dependencies]

### Performance Analysis

- **Performance Bottlenecks**: [identified performance issues]
- **Resource Usage**: [CPU, memory, I/O utilization patterns]
- **Timing Issues**: [timing-related problems and race conditions]
- **Scalability Concerns**: [scalability-related error factors]

### AI Analysis Results

- **Confidence Level**: [high|medium|low] confidence in analysis
- **Hypothesis Ranking**: [ranked list of potential causes]
- **Pattern Matching**: [similarity to known error patterns]
- **Prediction Accuracy**: [accuracy of error prediction models]

### Debugging Recommendations

- **Immediate Actions**: [urgent debugging steps to take]
- **Investigation Strategy**: [systematic debugging approach]
- **Tool Recommendations**: [debugging tools and techniques to use]
- **Monitoring Suggestions**: [monitoring and observability improvements]

### Fix Suggestions

- **Proposed Solutions**: [ranked list of potential fixes]
- **Fix Complexity**: [implementation difficulty and effort]
- **Risk Assessment**: [risks associated with each fix]
- **Validation Strategy**: [how to test and validate fixes]

### Code Analysis

- **Problematic Code Sections**: [specific code areas with issues]
- **Code Quality Issues**: [code quality problems contributing to errors]
- **Design Pattern Issues**: [architectural or design problems]
- **Best Practice Violations**: [coding best practices not followed]

### Environment and Dependencies

- **Environment Issues**: [configuration and environment problems]
- **Dependency Problems**: [external dependency issues]
- **Integration Issues**: [system integration and communication problems]
- **Infrastructure Concerns**: [infrastructure-related error factors]

### Learning and Knowledge

- **Similar Issues**: [historical similar issues and resolutions]
- **Knowledge Base Matches**: [relevant knowledge base entries]
- **Expert Insights**: [expert system recommendations]
- **Team Knowledge**: [relevant team experience and expertise]

### Validation Results

- **Fix Effectiveness**: [validation of proposed solutions]
- **Test Coverage**: [test coverage for error scenarios]
- **Regression Testing**: [regression test results]
- **Production Readiness**: [readiness for production deployment]

### Recommendations

- **Code Improvements**: [code quality and structure improvements]
- **Process Improvements**: [development process enhancements]
- **Tool Enhancements**: [debugging and development tool improvements]
- **Prevention Strategies**: [strategies to prevent similar errors]

### Educational Insights

- **Debugging Concepts**: [key debugging concepts demonstrated]
- **AI Techniques**: [AI and ML techniques used in debugging]
- **Problem-Solving Methods**: [systematic problem-solving approaches]
- **Best Practices**: [debugging and error resolution best practices]
</output_format>
