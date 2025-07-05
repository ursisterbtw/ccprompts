# Beta-Prompts Development Makefile
# Modern Python development workflow with advanced linting

.PHONY: help install install-dev install-all clean lint format type-check security test coverage docs build publish pre-commit setup-hooks

# Default target
help: ## Show this help message
	@echo "🚀 Beta-Prompts Development Commands"
	@echo ""
	@echo "Setup:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "^  .*(install|setup)"
	@echo ""
	@echo "Development:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "^  .*(lint|format|type|test|docs)"
	@echo ""
	@echo "Build & Deploy:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "^  .*(build|publish|clean)"
	@echo ""
	@echo "Quality Assurance:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "^  .*(security|coverage|pre-commit)"

# Installation targets
install: ## Install package in development mode
	pip install -e .

install-dev: ## Install with development dependencies
	pip install -e ".[dev]"

install-all: ## Install all optional dependencies
	pip install -e ".[all]"

setup-hooks: ## Setup pre-commit hooks
	pre-commit install
	pre-commit install --hook-type commit-msg

# Code quality targets
lint: ## Run all linting checks
	./scripts/lint.sh --all

lint-fix: ## Run linting with auto-fix
	./scripts/lint.sh --all --fix

format: ## Format code with Black and Ruff
	./scripts/lint.sh --format --fix

format-check: ## Check code formatting
	./scripts/lint.sh --format

type-check: ## Run MyPy type checking
	./scripts/lint.sh --type-check

type-check-strict: ## Run strict MyPy type checking
	./scripts/lint.sh --type-check --strict

security: ## Run security scans
	./scripts/lint.sh --security

security-strict: ## Run comprehensive security audit
	./scripts/lint.sh --security --strict

dead-code: ## Find dead code with Vulture
	./scripts/lint.sh --dead-code

docstring: ## Check docstring coverage and style
	./scripts/lint.sh --docstring

# Advanced linting with individual tools
ruff: ## Run Ruff linter
	ruff check beta_prompts/
	ruff format --check beta_prompts/

ruff-fix: ## Fix Ruff issues
	ruff check beta_prompts/ --fix
	ruff format beta_prompts/

mypy: ## Run MyPy type checker
	mypy beta_prompts/

mypy-strict: ## Run MyPy in strict mode
	mypy beta_prompts/ --strict

bandit: ## Run Bandit security scanner
	bandit -r beta_prompts/ -f json -o reports/bandit-report.json || bandit -r beta_prompts/

safety: ## Check dependency vulnerabilities
	safety check --json --output reports/safety-report.json || safety check

sourcery: ## Run Sourcery AI code review
	@if command -v sourcery >/dev/null 2>&1; then \
		sourcery review beta_prompts/; \
	else \
		echo "⚠️  Sourcery not installed. Install with: pip install sourcery"; \
	fi

sourcery-fix: ## Apply Sourcery AI suggestions
	@if command -v sourcery >/dev/null 2>&1; then \
		sourcery review --fix beta_prompts/; \
	else \
		echo "⚠️  Sourcery not installed. Install with: pip install sourcery"; \
	fi

# Testing targets
test: ## Run tests with pytest
	pytest

test-verbose: ## Run tests with verbose output
	pytest -v

test-parallel: ## Run tests in parallel
	pytest -n auto

test-cov: ## Run tests with coverage report
	pytest --cov=beta_prompts --cov-report=html --cov-report=term-missing

test-integration: ## Run integration tests only
	pytest -m integration

test-unit: ## Run unit tests only
	pytest -m unit

test-api: ## Run API tests (requires API key)
	pytest -m api

# Coverage targets
coverage: ## Generate coverage report
	pytest --cov=beta_prompts --cov-report=html --cov-report=xml --cov-report=term-missing
	@echo "📊 Coverage report generated in htmlcov/"

coverage-open: coverage ## Open coverage report in browser
	@if command -v open >/dev/null 2>&1; then \
		open htmlcov/index.html; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open htmlcov/index.html; \
	else \
		echo "📊 Coverage report available at: htmlcov/index.html"; \
	fi

# Documentation targets
docs: ## Build documentation
	@if [ -d "docs" ]; then \
		cd docs && make html; \
		echo "📚 Documentation built in docs/_build/html/"; \
	else \
		echo "⚠️  No docs directory found"; \
	fi

docs-live: ## Serve documentation with live reload
	@if command -v sphinx-autobuild >/dev/null 2>&1; then \
		sphinx-autobuild docs docs/_build/html --open-browser; \
	else \
		echo "⚠️  sphinx-autobuild not installed. Install with: pip install sphinx-autobuild"; \
	fi

# Build targets
build: ## Build package
	python -m build

build-wheel: ## Build wheel only
	python -m build --wheel

build-sdist: ## Build source distribution only
	python -m build --sdist

# Development workflow targets
dev-setup: install-dev setup-hooks ## Complete development setup
	@echo "✅ Development environment ready!"
	@echo "💡 Next steps:"
	@echo "   make lint      # Check code quality"
	@echo "   make test      # Run tests"
	@echo "   make docs      # Build documentation"

dev-check: ## Run all development checks
	make lint
	make test-cov
	make security

dev-fix: ## Auto-fix all development issues
	make lint-fix
	make test

# CI/CD targets
ci: ## Run CI pipeline locally
	./scripts/lint.sh --ci --all
	pytest --cov=beta_prompts --cov-report=xml
	@echo "✅ CI pipeline completed successfully"

pre-commit: ## Run pre-commit hooks manually
	pre-commit run --all-files

pre-commit-update: ## Update pre-commit hooks
	pre-commit autoupdate

# Performance and profiling
profile-lint: ## Profile linting performance
	./scripts/lint.sh --all --profile

profile-tests: ## Profile test performance
	pytest --benchmark-only

profile-code: ## Profile code with py-spy
	@echo "🔍 Run your code and use 'py-spy top --pid <PID>' to profile"

# Cleanup targets
clean: ## Remove build artifacts and cache
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info/
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/
	rm -rf .ruff_cache/
	rm -rf htmlcov/
	rm -rf reports/
	find . -type d -name __pycache__ -delete
	find . -type f -name "*.pyc" -delete

clean-all: clean ## Remove all generated files including reports
	rm -rf .coverage
	rm -rf coverage.xml
	rm -rf bandit-report.json
	rm -rf safety-report.json
	rm -rf semgrep-report.json

# Utility targets
deps-update: ## Update dependencies
	pip-compile --upgrade requirements.in
	pip-compile --upgrade requirements-dev.in

deps-sync: ## Sync dependencies
	pip-sync requirements.txt requirements-dev.txt

deps-audit: ## Audit dependencies for security issues
	pip-audit
	safety check

version: ## Show version information
	@echo "Package version: $(shell python -c 'import tomllib; print(tomllib.load(open("pyproject.toml", "rb"))["project"]["version"])')"
	@echo "Python version: $(shell python --version)"
	@echo "Pip version: $(shell pip --version)"

env-info: ## Show environment information
	@echo "🐍 Python Environment Information"
	@echo "=================================="
	@echo "Python executable: $(shell which python)"
	@echo "Python version: $(shell python --version)"
	@echo "Virtual environment: $(VIRTUAL_ENV)"
	@echo "Installed packages:"
	@pip list | head -20

# Quick development shortcuts
q-lint: ruff-fix mypy ## Quick lint (Ruff + MyPy)

q-test: ## Quick test run
	pytest -x --ff

q-check: q-lint q-test ## Quick development check

q-fix: ## Quick fix all issues
	make ruff-fix
	make format
	pytest -x --ff

# Create reports directory
reports:
	mkdir -p reports

# Ensure reports directory exists for security scans
bandit safety: | reports

# Show tool versions
tools-version: ## Show versions of all tools
	@echo "🛠️  Development Tools Versions"
	@echo "==============================="
	@python --version
	@echo -n "Ruff: "; ruff --version || echo "Not installed"
	@echo -n "MyPy: "; mypy --version || echo "Not installed"
	@echo -n "Black: "; black --version || echo "Not installed"
	@echo -n "Bandit: "; bandit --version || echo "Not installed"
	@echo -n "Safety: "; safety --version || echo "Not installed"
	@echo -n "Pytest: "; pytest --version || echo "Not installed"
	@echo -n "Sourcery: "; sourcery --version || echo "Not installed"