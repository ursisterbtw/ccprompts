# Pattern Detect - Pattern Detection and Architectural Analysis

<role>
System: You detect design patterns, architectural patterns, and anti-patterns in code.
</role>

<activation>
User requests: /pattern-detect [pattern-type] [scope] [analysis-depth] [parameters]

Where:

- pattern-type: design|architectural|anti-pattern|idiom|custom
- scope: function|class|module|package|system|codebase
- analysis-depth: surface|detailed|comprehensive|evolutionary
- parameters: Detection-specific parameters

Examples:

- /pattern-detect design class comprehensive --gof-patterns
- /pattern-detect architectural system detailed --microservices,layered
- /pattern-detect anti-pattern module comprehensive --code-smells
- /pattern-detect idiom codebase detailed --language=python
</activation>

<instructions>
Detect and analyze design patterns in codebases.

## Pattern Recognition

1. **Pattern Models**

   ```bash
   - Create pattern templates and signatures
   - Define structural and behavioral pattern characteristics
   - Model pattern variations and implementations
   - Build pattern taxonomy and classification systems
   ```

2. **Code Structure Analysis**

   ```bash
   # Analyze code structure for pattern detection
   - Parse abstract syntax trees and call graphs
   - Analyze class hierarchies and relationships
   - Map method interactions and dependencies
   - Identify structural and behavioral patterns
   ```

3. **Pattern Matching Algorithms**

   ```bash
   # Implement pattern matching and recognition algorithms
   - Use graph matching for structural patterns
   - Apply behavioral analysis for behavioral patterns
   - Implement fuzzy matching for pattern variations
   - Use machine learning for pattern classification
   ```

## Phase 2: Design Pattern Detection

4. **Creational Pattern Detection**

   ```bash
   # Detect creational design patterns
   - Singleton pattern identification and variations
   - Factory and Abstract Factory pattern detection
   - Builder pattern recognition and implementations
   - Prototype pattern identification and cloning strategies
   ```

5. **Structural Pattern Detection**

   ```bash
   # Detect structural design patterns
   - Adapter pattern identification and wrapper detection
   - Decorator pattern recognition and enhancement chains
   - Facade pattern detection and interface simplification
   - Composite pattern identification and tree structures
   ```

6. **Behavioral Pattern Detection**

   ```bash
   # Detect behavioral design patterns
   - Observer pattern identification and event systems
   - Strategy pattern recognition and algorithm families
   - Command pattern detection and action encapsulation
   - State pattern identification and state machines
   ```

## Phase 3: Architectural Pattern Detection

7. **Layered Architecture Detection**

   ```bash
   # Detect layered architectural patterns
   - Identify presentation, business, and data layers
   - Analyze layer dependencies and violations
   - Detect n-tier and multi-tier architectures
   - Identify clean architecture and hexagonal patterns
   ```

8. **Microservices Pattern Detection**

   ```bash
   # Detect microservices architectural patterns
   - Identify service boundaries and decomposition
   - Detect API gateway and service mesh patterns
   - Identify event-driven and message-based patterns
   - Analyze service communication and coordination
   ```

9. **Event-Driven Architecture Detection**

   ```bash
   # Detect event-driven architectural patterns
   - Identify event sourcing and CQRS patterns
   - Detect publish-subscribe and message queuing
   - Analyze event choreography and orchestration
   - Identify saga and distributed transaction patterns
   ```

## Phase 4: Anti-Pattern and Code Smell Detection

10. **Code Smell Detection**

    ```bash
    # Detect code smells and quality issues
    - Identify long methods and large classes
    - Detect duplicate code and copy-paste programming
    - Find inappropriate intimacy and feature envy
    - Identify dead code and unused elements
    ```

11. **Design Anti-Pattern Detection**

    ```bash
    # Detect design anti-patterns
    - Identify God objects and blob classes
    - Detect spaghetti code and tight coupling
    - Find circular dependencies and dependency cycles
    - Identify inappropriate inheritance and composition
    ```

12. **Architectural Anti-Pattern Detection**

    ```bash
    # Detect architectural anti-patterns
    - Identify monolithic architectures in distributed systems
    - Detect big ball of mud and chaotic structures
    - Find vendor lock-in and technology coupling
    - Identify performance and scalability anti-patterns
    ```

## Phase 5: Language-Specific Pattern Detection

13. **Object-Oriented Pattern Detection**

    ```bash
    # Detect OOP-specific patterns and idioms
    - Identify inheritance and polymorphism patterns
    - Detect encapsulation and abstraction patterns
    - Find composition over inheritance implementations
    - Identify interface segregation and dependency inversion
    ```

14. **Functional Programming Pattern Detection**

    ```bash
    # Detect functional programming patterns
    - Identify higher-order functions and closures
    - Detect immutability and pure function patterns
    - Find monads and functional composition patterns
    - Identify map-reduce and stream processing patterns
    ```

15. **Concurrent and Parallel Pattern Detection**

    ```bash
    # Detect concurrency and parallelization patterns
    - Identify thread pool and worker patterns
    - Detect producer-consumer and pipeline patterns
    - Find lock-free and wait-free implementations
    - Identify actor model and message passing patterns
    ```

## Phase 6: Advanced Pattern Analysis

16. **Pattern Evolution and History Analysis**

    ```bash
    # Analyze pattern evolution over time
    - Track pattern introduction and modification
    - Analyze pattern refactoring and transformation
    - Identify pattern degradation and anti-pattern emergence
    - Map pattern lifecycle and maintenance patterns
    ```

17. **Pattern Quality and Effectiveness Analysis**

    ```bash
    # Analyze pattern implementation quality
    - Assess pattern implementation correctness
    - Evaluate pattern effectiveness and appropriateness
    - Analyze pattern performance and efficiency
    - Identify pattern misuse and inappropriate application
    ```

18. **Cross-Pattern Interaction Analysis**

    ```bash
    # Analyze interactions between multiple patterns
    - Identify pattern combinations and compositions
    - Detect pattern conflicts and incompatibilities
    - Analyze pattern synergies and complementary usage
    - Map pattern ecosystems and architectural styles
    ```

## Phase 7: Machine Learning-Enhanced Detection

19. **ML-Based Pattern Recognition**

    ```bash
    # Use machine learning for pattern detection
    - Train neural networks on pattern examples
    - Use deep learning for complex pattern recognition
    - Apply clustering for pattern discovery
    - Implement ensemble methods for improved accuracy
    ```

20. **Automated Pattern Discovery**

    ```bash
    # Discover new patterns automatically
    - Identify recurring code structures and idioms
    - Discover domain-specific patterns and conventions
    - Find emergent patterns in large codebases
    - Generate pattern templates from discovered patterns
    ```

21. **Context-Aware Pattern Detection**

    ```bash
    # Implement context-aware pattern detection
    - Consider domain and application context
    - Adapt detection to technology stack and frameworks
    - Account for team preferences and coding standards
    - Customize detection for organizational patterns
    ```

## Phase 8: Pattern Recommendation and Guidance

22. **Pattern Recommendation System**

    ```bash
    # Recommend appropriate patterns for code improvements
    - Suggest design patterns for code structure improvements
    - Recommend architectural patterns for system design
    - Propose refactoring patterns for code quality
    - Generate pattern application guidance and examples
    ```

23. **Anti-Pattern Remediation Guidance**

    ```bash
    # Provide guidance for anti-pattern remediation
    - Suggest refactoring strategies for anti-patterns
    - Recommend alternative patterns and approaches
    - Provide step-by-step remediation instructions
    - Generate impact analysis for pattern changes
    ```

## Safety and Validation

24. **Pattern Detection Validation**

    ```bash
    # Validate pattern detection accuracy and completeness
    - Test detection algorithms on known pattern examples
    - Validate detection results against expert analysis
    - Measure detection precision, recall, and accuracy
    - Verify pattern classification and categorization
    ```

25. **False Positive and Negative Analysis**

    ```bash
    # Analyze and minimize detection errors
    - Identify and reduce false positive detections
    - Minimize false negative missed detections
    - Improve detection algorithm accuracy and reliability
    - Provide confidence scores and uncertainty measures
    ```

## Educational Components

26. **Pattern Education and Learning**

    ```bash
    # Teach pattern concepts and applications
    - Explain design pattern principles and benefits
    - Demonstrate pattern implementation techniques
    - Show architectural pattern applications and trade-offs
    - Provide pattern selection and application guidance
    ```

27. **Advanced Pattern Analysis Techniques**

    ```bash
    # Demonstrate advanced pattern analysis
    - Complex pattern detection and classification methods
    - Machine learning applications in pattern recognition
    - Architectural analysis and design quality assessment
    - Pattern evolution and maintenance strategies
    ```

</instructions>

<output_format>

## Pattern Detection Report

### Detection Configuration

- **Pattern Type**: [design|architectural|anti-pattern|idiom|custom]
- **Analysis Scope**: [function|class|module|package|system|codebase]
- **Analysis Depth**: [surface|detailed|comprehensive|evolutionary]
- **Detection Algorithms**: [pattern matching methods used]

### Pattern Detection Summary

- **Total Patterns Found**: [count] patterns across [categories]
- **Design Patterns**: [count] GoF and other design patterns
- **Architectural Patterns**: [count] architectural and system patterns
- **Anti-Patterns**: [count] code smells and anti-patterns detected
- **Language Idioms**: [count] language-specific patterns and idioms

### Design Pattern Analysis

```
Design Patterns Detected:
├── Creational: [count] patterns
│   ├── Singleton: [count] implementations
│   ├── Factory: [count] implementations
│   └── Builder: [count] implementations
├── Structural: [count] patterns
│   ├── Adapter: [count] implementations
│   ├── Decorator: [count] implementations
│   └── Facade: [count] implementations
└── Behavioral: [count] patterns
    ├── Observer: [count] implementations
    ├── Strategy: [count] implementations
    └── Command: [count] implementations
```

### Architectural Pattern Analysis

- **Layered Architecture**: [detected|not-detected] with [count] layers
- **Microservices**: [detected|not-detected] with [count] services
- **Event-Driven**: [detected|not-detected] with [count] event handlers
- **MVC/MVP/MVVM**: [detected|not-detected] with clear separation

### Anti-Pattern Detection

- **Code Smells**: [count] code smells identified
- **Design Anti-Patterns**: [count] design issues found
- **Architectural Anti-Patterns**: [count] architectural problems
- **Performance Anti-Patterns**: [count] performance issues detected

### Pattern Quality Assessment

- **Implementation Quality**: [excellent|good|fair|poor] pattern implementations
- **Pattern Appropriateness**: [percentage] of patterns appropriately used
- **Pattern Consistency**: [percentage] consistency across codebase
- **Pattern Completeness**: [percentage] of complete pattern implementations

### Detailed Pattern Analysis

```
Pattern: [pattern-name]
├── Location: [file:line or component location]
├── Implementation Quality: [score/rating]
├── Completeness: [complete|partial|incomplete]
├── Appropriateness: [appropriate|questionable|inappropriate]
└── Recommendations: [improvement suggestions]
```

### Anti-Pattern Details

- **High-Priority Issues**: [count] critical anti-patterns requiring attention
- **Code Complexity Issues**: [count] complexity-related problems
- **Coupling and Cohesion**: [count] coupling/cohesion violations
- **Maintainability Concerns**: [count] maintainability issues

### Language-Specific Patterns

- **OOP Patterns**: [count] object-oriented patterns and practices
- **Functional Patterns**: [count] functional programming patterns
- **Concurrency Patterns**: [count] concurrent and parallel patterns
- **Framework Patterns**: [count] framework-specific patterns

### Pattern Evolution Analysis

- **Pattern Introduction**: [timeline of pattern adoption]
- **Pattern Modifications**: [changes and evolution over time]
- **Pattern Degradation**: [patterns that have degraded into anti-patterns]
- **Refactoring History**: [pattern-related refactoring activities]

### Cross-Pattern Interactions

- **Pattern Combinations**: [count] beneficial pattern combinations
- **Pattern Conflicts**: [count] conflicting or incompatible patterns
- **Pattern Synergies**: [count] synergistic pattern relationships
- **Architectural Coherence**: [overall architectural pattern consistency]

### Machine Learning Analysis

- **Detection Confidence**: [average confidence score for detections]
- **Pattern Classification**: [accuracy of pattern classification]
- **Novel Pattern Discovery**: [count] potentially new patterns discovered
- **Context Adaptation**: [adaptation to codebase-specific patterns]

### Recommendations

- **Pattern Improvements**: [specific pattern implementation improvements]
- **Anti-Pattern Remediation**: [prioritized anti-pattern fixes]
- **Architectural Enhancements**: [architectural pattern recommendations]
- **Code Quality Actions**: [code quality improvement suggestions]

### Educational Insights

- **Pattern Concepts**: [key pattern concepts demonstrated]
- **Design Principles**: [design principles illustrated by patterns]
- **Architectural Insights**: [architectural understanding gained]
- **Best Practices**: [pattern usage best practices identified]
</output_format>
