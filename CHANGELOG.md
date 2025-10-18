# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- 70 slash commands organized across 12 development phases
- Containerized safety system using Dagger for secure execution
- Multi-dimensional validation with quality scoring and security scanning
- Agent creation system with template wizard for specialized agents
- MCP integration and multi-agent coordination features
- Comprehensive CI/CD pipeline with security scanning

### Changed

- Reorganized commands into designated .claude/commands/tasks directory
- Enhanced agent initialization documentation with critical directory guidelines
- Updated security scanning to exclude test files from hardcoded secret detection

### Fixed

- CI pipeline failures related to hardcoded secrets in test files
- Documentation completeness requirements

### Removed

- Obsolete prompts and related references from documentation
- Package.json file as part of project cleanup
- Obsolete config and testing files for MCP integration

## [0.1.0] - 2025-08-07

### Added

- Initial release with core command ecosystem
- Safety validation system with Dagger
- Jest testing suite with 30-second timeouts
- Multi-level documentation including developer guides
- GitHub Actions workflow for security scanning
