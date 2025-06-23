# Code-Review Command

This command provides comprehensive automated code review capabilities with intelligent analysis and feedback.

## Usage
```
/code-review [scope] [focus] [depth]
```

## Parameters
- `scope`: pr, branch, commit, file, directory
- `focus`: security, performance, maintainability, style, architecture, all
- `depth`: quick, thorough, comprehensive, expert

## Examples
```
/code-review pr security thorough
/code-review branch all comprehensive
/code-review commit performance quick
/code-review file maintainability expert
```

## Description
AI-powered code review system with multi-dimensional analysis:
1. Automated code quality assessment and improvement suggestions
2. Security vulnerability detection and remediation guidance
3. Performance optimization opportunities identification
4. Architecture and design pattern validation
5. Best practice compliance and style guide enforcement
6. Knowledge transfer and learning opportunity highlighting

## Review Categories

### Code Quality Assessment
- **Complexity Analysis**: Cyclomatic complexity and cognitive load evaluation
- **Maintainability**: Code readability, structure, and long-term maintainability
- **DRY Principle**: Identification of code duplication and refactoring opportunities
- **SOLID Principles**: Object-oriented design principle compliance
- **Error Handling**: Exception handling patterns and resilience
- **Testing**: Test coverage, quality, and maintainability

### Security Analysis
- **Vulnerability Detection**: OWASP Top 10 and common security issues
- **Input Validation**: Data sanitization and injection prevention
- **Authentication**: Access control and permission validation
- **Cryptography**: Proper use of encryption and hashing
- **Secrets Management**: Hardcoded credentials and sensitive data exposure
- **Dependencies**: Third-party library security vulnerabilities

### Performance Optimization
- **Algorithmic Efficiency**: Big O complexity analysis and optimization
- **Resource Usage**: Memory leaks, CPU usage, and resource management
- **Database Queries**: Query optimization and N+1 problem detection
- **Caching Strategies**: Effective caching implementation
- **Network Optimization**: API calls, bundling, and data transfer efficiency
- **Scalability**: Horizontal and vertical scaling considerations

### Architecture Review
- **Design Patterns**: Appropriate pattern usage and implementation
- **Separation of Concerns**: Proper layering and responsibility distribution
- **API Design**: RESTful principles and interface consistency
- **Database Schema**: Normalization, indexing, and relationship design
- **System Integration**: Service boundaries and coupling analysis
- **Technology Choices**: Framework and library selection rationale

## Review Depth Levels

### Quick Review (5-15 minutes)
```
Quick Code Review Summary
========================

📊 Overall Assessment: B+ (82/100)
├── Code Quality: 85/100 (Good)
├── Security: 78/100 (Needs Attention)
├── Performance: 88/100 (Very Good)
└── Style: 90/100 (Excellent)

🔍 Key Findings (Top 5):
1. [High] Potential SQL injection in UserService.findByEmail()
2. [Medium] Missing error handling in payment processing
3. [Medium] Inefficient database query in dashboard load
4. [Low] Inconsistent naming convention in helper functions
5. [Low] Missing JSDoc comments for public methods

⚡ Quick Wins:
- Add input validation to prevent SQL injection
- Implement proper error boundaries
- Add database index for frequently queried fields
```

### Thorough Review (30-60 minutes)
```
Thorough Code Review Analysis
============================

📋 Detailed Assessment:

🔒 Security Analysis (78/100)
├── ✅ HTTPS enforcement properly implemented
├── ✅ CSRF protection in place
├── ⚠️  SQL injection vulnerability in user search
├── ⚠️  API keys hardcoded in configuration
├── ❌ Missing input validation on file uploads
└── ❌ Weak password policy implementation

🚀 Performance Analysis (88/100)
├── ✅ Efficient algorithms used throughout
├── ✅ Proper caching strategy implemented
├── ✅ Database queries optimized
├── ⚠️  Memory usage could be optimized in data processing
├── ⚠️  API response times variable under load
└── ❌ Large bundle size affecting load times

🏗️ Architecture Analysis (85/100)
├── ✅ Clear separation of concerns
├── ✅ Appropriate design patterns used
├── ✅ Consistent API design
├── ⚠️  Some components have too many responsibilities
├── ⚠️  Database schema could be normalized
└── ❌ Missing error handling strategy

📝 Code Quality (85/100)
├── ✅ Consistent code style throughout
├── ✅ Good variable and function naming
├── ✅ Appropriate use of comments
├── ⚠️  Some functions are too long and complex
├── ⚠️  Missing unit tests for new features
└── ❌ Code duplication in validation logic
```

### Comprehensive Review (2-4 hours)
```
Comprehensive Code Review Report
===============================

Executive Summary:
This code review covers 47 files with 2,847 lines of code across
the user authentication and payment processing modules. The code
demonstrates good architectural decisions but has several security
and performance concerns that should be addressed.

🔍 Detailed Analysis:

Security Assessment (Score: 78/100)
===================================

Critical Issues (2):
1. SQL Injection Vulnerability (Line 156, UserService.js)
   - Risk: High
   - Impact: Database compromise, data theft
   - Fix: Use parameterized queries or ORM
   - Effort: 2 hours
   
2. Hardcoded API Keys (Line 23, config.js)
   - Risk: High  
   - Impact: Unauthorized access to external services
   - Fix: Use environment variables or secrets manager
   - Effort: 1 hour

High Priority Issues (3):
1. Missing Input Validation (FileUpload.js)
   - Risk: Medium-High
   - Impact: Malicious file upload, system compromise
   - Fix: Implement file type and size validation
   - Effort: 4 hours
   
2. Weak Password Policy (AuthService.js)
   - Risk: Medium
   - Impact: Account compromise
   - Fix: Enforce strong password requirements
   - Effort: 2 hours
   
3. Missing HTTPS Enforcement (server.js)
   - Risk: Medium
   - Impact: Data interception
   - Fix: Redirect HTTP to HTTPS
   - Effort: 1 hour

Performance Assessment (Score: 88/100)
=====================================

Optimization Opportunities (5):
1. Database Query Optimization (UserController.js:89)
   - Current: N+1 query problem
   - Impact: 400ms+ response time
   - Fix: Use JOIN or eager loading
   - Improvement: 80% faster queries
   
2. Bundle Size Optimization (webpack.config.js)
   - Current: 2.1MB bundle size
   - Impact: 8s load time on 3G
   - Fix: Code splitting and tree shaking
   - Improvement: 60% smaller bundle
   
3. Memory Usage (DataProcessor.js:134)
   - Current: 150MB memory usage for large datasets
   - Impact: Potential out-of-memory errors
   - Fix: Implement streaming processing
   - Improvement: 70% memory reduction

Architecture Assessment (Score: 85/100)
======================================

Design Strengths:
✅ Clean separation between controllers and services
✅ Consistent error handling patterns
✅ Proper use of dependency injection
✅ Well-defined API contracts

Areas for Improvement:
⚠️  UserService has grown too large (violation of SRP)
⚠️  Database schema normalization opportunities
⚠️  Missing circuit breaker pattern for external APIs
⚠️  Inconsistent logging strategy across modules
```

### Expert Review (1-2 days)
```
Expert Code Review & Architectural Analysis
==========================================

Deep Technical Analysis:

System Architecture Evaluation:
- Microservices decomposition strategy assessment
- Data flow and system boundary analysis
- Scalability bottleneck identification
- Technology stack optimization opportunities
- Infrastructure as Code review

Code Quality Deep Dive:
- Advanced static analysis with custom rules
- Cyclomatic complexity heat map
- Technical debt quantification
- Maintainability index calculation
- Code evolution trend analysis

Security Threat Modeling:
- Complete STRIDE analysis
- Attack surface mapping
- Privilege escalation vectors
- Data flow security assessment
- Compliance gap analysis (GDPR, HIPAA, SOC2)

Performance Engineering:
- Detailed profiling and benchmarking
- Load testing scenario development
- Capacity planning recommendations
- Optimization roadmap with ROI analysis
- Monitoring and alerting strategy
```

## Automated Analysis Features

### Static Code Analysis
```python
# Automated Code Quality Metrics
quality_metrics = {
    "cyclomatic_complexity": {
        "average": 4.2,
        "max": 12.0,
        "violations": 3,
        "threshold": 10.0
    },
    "maintainability_index": {
        "score": 78.5,
        "trend": "+2.3 vs last month",
        "threshold": 70.0
    },
    "technical_debt": {
        "ratio": 12.3,
        "hours": 34.5,
        "trend": "-5.2 hours vs last month"
    },
    "test_coverage": {
        "line_coverage": 84.2,
        "branch_coverage": 76.8,
        "function_coverage": 91.3
    }
}
```

### Pattern Recognition
- **Anti-patterns**: Detection of common code smells and anti-patterns
- **Best Practices**: Identification of industry best practice violations
- **Framework Compliance**: Framework-specific pattern validation
- **Performance Patterns**: Recognition of performance optimization opportunities
- **Security Patterns**: Security best practice implementation verification

### Intelligent Suggestions
```
AI-Powered Improvement Suggestions
=================================

🤖 Refactoring Opportunities:
1. Extract Method (UserService.validateAndCreateUser)
   - Current: 45-line method with multiple responsibilities
   - Suggestion: Extract validation and creation logic
   - Benefit: Improved testability and maintainability
   - Confidence: 95% | Effort: 2 hours

2. Replace Magic Numbers (PaymentProcessor.processPayment)
   - Current: Hardcoded values throughout payment logic
   - Suggestion: Create PaymentConstants class
   - Benefit: Better maintainability and clarity
   - Confidence: 88% | Effort: 1 hour

3. Implement Strategy Pattern (NotificationService)
   - Current: Large switch statement for notification types
   - Suggestion: Use strategy pattern for notification handlers
   - Benefit: Extensibility and maintainability
   - Confidence: 92% | Effort: 4 hours

🔍 Code Quality Improvements:
1. Add Missing Null Checks (15 locations)
   - Risk: NullPointerException potential
   - Fix: Add null safety checks and early returns
   - Effort: 3 hours | Auto-fix available: Yes

2. Improve Error Messages (8 locations)
   - Current: Generic error messages
   - Suggestion: Add context-specific error details
   - Benefit: Better debugging and user experience
   - Effort: 2 hours
```

## Integration Features

### Version Control Integration
```yaml
# GitHub Integration Example
github:
  pull_request_reviews:
    auto_review: true
    block_merge_on_issues: true
    severity_threshold: "high"
    
  commit_analysis:
    enable: true
    check_commit_messages: true
    analyze_diff_only: true
    
  status_checks:
    required_checks:
      - "security-scan"
      - "performance-check"
      - "code-quality"
    
  review_assignment:
    auto_assign: true
    expertise_matching: true
    workload_balancing: true
```

### IDE Integration
- **Real-time Analysis**: Live code analysis while typing
- **Inline Suggestions**: Contextual improvement recommendations
- **Quick Fixes**: One-click resolution for common issues
- **Refactoring Support**: Automated refactoring suggestions
- **Learning Mode**: Educational explanations for suggestions

### CI/CD Integration
- **Automated Review Gates**: Block deployments on critical issues
- **Quality Metrics Tracking**: Trend analysis over time
- **Review Report Generation**: Automated documentation
- **Performance Regression Detection**: Automated benchmarking
- **Security Scanning Integration**: SAST/DAST tool integration

## Collaborative Features

### Team Review Workflows
```
Team Code Review Workflow
=========================

1. Automated Pre-Review (2-5 minutes)
   ├── Static analysis and basic checks
   ├── Security vulnerability scanning
   ├── Performance regression detection
   └── Style guide compliance verification

2. Expert System Review (10-30 minutes)
   ├── Architecture and design analysis
   ├── Best practice compliance checking
   ├── Advanced security analysis
   └── Performance optimization suggestions

3. Human Review Assignment (varies)
   ├── Intelligent reviewer assignment
   ├── Expertise-based routing
   ├── Workload balancing
   └── Knowledge sharing opportunities

4. Collaborative Review Process
   ├── Inline comments and suggestions
   ├── Discussion threads and resolution
   ├── Approval workflows and sign-offs
   └── Knowledge transfer and mentoring
```

### Knowledge Transfer
- **Learning Opportunities**: Identify teaching moments during review
- **Best Practice Sharing**: Highlight exemplary code patterns
- **Skill Development**: Suggest learning resources for improvement areas
- **Mentoring Support**: Connect junior developers with experts
- **Documentation**: Auto-generate documentation from review insights

## Customization and Configuration

### Team Standards Configuration
```yaml
# Team Code Review Standards
review_standards:
  security:
    severity_threshold: "medium"
    required_checks:
      - "owasp_top_10"
      - "dependency_vulnerabilities"
      - "secrets_detection"
  
  performance:
    response_time_threshold: "2s"
    memory_usage_threshold: "100mb"
    bundle_size_threshold: "500kb"
    
  code_quality:
    complexity_threshold: 8
    coverage_threshold: 80
    duplication_threshold: 5
    
  style:
    enforce_style_guide: true
    auto_fix_enabled: true
    custom_rules: "team-eslint-config"
```

### Custom Review Checklists
- **Project-Specific Rules**: Tailored analysis for specific projects
- **Industry Compliance**: Healthcare, finance, or other industry standards
- **Technology Standards**: Framework-specific best practices
- **Team Preferences**: Customizable review focus areas
- **Learning Objectives**: Educational review goals and outcomes

## Reporting and Analytics

### Review Metrics Dashboard
```
Code Review Analytics Dashboard
==============================

📊 Review Statistics (Last 30 Days)
├── Total Reviews: 127
├── Average Review Time: 2.3 hours
├── Issues Found: 342 (2.7 per review)
├── Fix Rate: 89% (305 issues resolved)
├── False Positive Rate: 8%

🎯 Quality Trends
├── Security Issues: -15% vs last month
├── Performance Issues: -22% vs last month
├── Code Quality: +12% improvement
├── Test Coverage: +5% improvement

👥 Team Performance
├── Most Active Reviewer: Sarah Chen (23 reviews)
├── Fastest Reviewer: Mike Johnson (avg 1.2 hours)
├── Most Thorough: Lisa Wong (avg 4.2 issues found)
├── Best Mentor: David Kim (15 knowledge transfers)

🔍 Issue Categories
├── Security: 89 issues (26%)
├── Performance: 67 issues (20%)
├── Code Quality: 123 issues (36%)
├── Style: 63 issues (18%)
```

### ROI Analysis
- **Time Saved**: Automated review vs manual review comparison
- **Quality Improvement**: Defect reduction and customer satisfaction
- **Knowledge Transfer**: Skill development and team capabilities
- **Compliance**: Regulatory compliance and audit readiness
- **Technical Debt**: Debt reduction and maintenance cost savings

## Related Commands
- `/pre-commit` - Automated pre-commit quality checks
- `/test` - Comprehensive testing and coverage analysis
- `/audit-security` - Deep security analysis and vulnerability assessment
- `/optimize` - Performance optimization recommendations
- `/document` - Documentation generation and maintenance