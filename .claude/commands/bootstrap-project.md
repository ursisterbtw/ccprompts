# Bootstrap Project Command

**Rapid project initialization and setup**

## Usage
```
/bootstrap-project [project-type] [technology] [scope]
```

## Description
Comprehensive project bootstrap with modern development practices, security configurations, and production-ready infrastructure. Creates complete project structure with CI/CD, testing, documentation, and compliance frameworks.

## Parameters
- `project-type`: `web-app` | `api` | `microservice` | `library` | `cli` | `mobile`
- `technology`: `typescript` | `python` | `go` | `rust` | `java` | `csharp`
- `scope`: `minimal` | `standard` | `enterprise` | `cloud`

## Examples

### Example 1: Modern Web Application
```
/bootstrap-project web-app typescript enterprise
```
**Output**: Complete web application setup with:
- TypeScript configuration with strict mode
- React/Next.js boilerplate with security headers
- Comprehensive testing suite (Jest, Playwright)
- ESLint/Prettier with security rules
- GitHub Actions CI/CD pipeline
- Docker containerization
- Security scanning and dependency updates

### Example 2: Cloud-Native API Service
```
/bootstrap-project api python cloud
```
**Output**: Production-ready API service featuring:
- FastAPI/Django REST framework
- OpenAPI/Swagger documentation
- PostgreSQL with migrations
- Redis caching layer
- Kubernetes deployment manifests
- Helm charts for configuration
- Monitoring and logging setup
- OAuth2/JWT authentication

### Example 3: Microservice Architecture
```
/bootstrap-project microservice go standard
```
**Output**: Microservice implementation with:
- Go modules with dependency management
- gRPC/HTTP API endpoints
- Circuit breaker patterns
- Distributed tracing (Jaeger)
- Prometheus metrics
- Health check endpoints
- Service mesh configuration

### Example 4: Enterprise Library
```
/bootstrap-project library typescript enterprise
```
**Output**: Enterprise-grade library setup:
- TypeScript with declaration files
- Comprehensive test coverage
- API documentation generation
- Semantic versioning automation
- Multiple distribution formats (CJS, ESM, UMD)
- Benchmark testing
- Security vulnerability scanning

## Related Prompts
- `prompts/01-project-initialization/comprehensive-bootstrap.md`
- `prompts/01-project-initialization/claude-md-generator.md`