// Beta-Prompts Safety Module
// Provides containerized execution for Python scripts with safety controls

package main

import (
	"context"
	"fmt"
)

type BetaPromptsSafety struct{}

// Container returns a container for safe Python execution
func (m *BetaPromptsSafety) Container(
	ctx context.Context,
	// +optional
	platform string,
) *Container {
	if platform == "" {
		platform = "linux/amd64"
	}
	
	return dag.Container(ContainerOpts{Platform: Platform(platform)}).
		From("python:3.11-slim").
		WithExec([]string{"apt-get", "update"}).
		WithExec([]string{"apt-get", "install", "-y", "git", "curl", "build-essential"}).
		WithExec([]string{"pip", "install", "--upgrade", "pip"}).
		WithWorkdir("/workspace").
		WithEnvVariable("PYTHONPATH", "/workspace").
		WithEnvVariable("PYTHONUNBUFFERED", "1")
}

// PythonScript executes a Python script safely in an isolated container
func (m *BetaPromptsSafety) PythonScript(
	ctx context.Context,
	// Source directory containing the script
	source *Directory,
	// Script filename to execute
	script string,
	// +optional
	// Environment variables
	env []string,
) (string, error) {
	container := m.Container(ctx, "linux/amd64").
		WithDirectory("/workspace", source)
	
	// Add environment variables
	for _, e := range env {
		container = container.WithEnvVariable(e, e)
	}
	
	// Install dependencies from pyproject.toml
	container = container.
		WithExec([]string{"sh", "-c", "if [ -f pyproject.toml ]; then pip install -e .; fi"})
	
	// Execute the Python script
	return container.
		WithExec([]string{"python", script}).
		Stdout(ctx)
}

// InstallDependencies installs Python dependencies from pyproject.toml
func (m *BetaPromptsSafety) InstallDependencies(
	ctx context.Context,
	// Source directory containing pyproject.toml
	source *Directory,
) (string, error) {
	return m.Container(ctx, "linux/amd64").
		WithDirectory("/workspace", source).
		WithExec([]string{"pip", "install", "-e", "."}).
		Stdout(ctx)
}

// RunTests executes pytest in the container
func (m *BetaPromptsSafety) RunTests(
	ctx context.Context,
	// Source directory containing tests
	source *Directory,
	// +optional
	// Additional pytest arguments
	args []string,
) (string, error) {
	container := m.Container(ctx, "linux/amd64").
		WithDirectory("/workspace", source).
		WithExec([]string{"pip", "install", "-e", "."})
	
	if len(args) == 0 {
		args = []string{"-v"}
	}
	
	pytestArgs := append([]string{"pytest"}, args...)
	
	return container.
		WithExec(pytestArgs).
		Stdout(ctx)
}

// ValidateScript performs safety validation on a Python script
func (m *BetaPromptsSafety) ValidateScript(
	ctx context.Context,
	// Source directory
	source *Directory,
	// Script to validate
	script string,
) (string, error) {
	return m.Container(ctx, "linux/amd64").
		WithDirectory("/workspace", source).
		WithExec([]string{"python", "-m", "py_compile", script}).
		WithExec([]string{"python", "-c", fmt.Sprintf("import ast; ast.parse(open('%s').read())", script)}).
		Stdout(ctx)
}

// ShellCommand executes a shell command safely in the container
func (m *BetaPromptsSafety) ShellCommand(
	ctx context.Context,
	// Source directory
	source *Directory,
	// Command to execute
	command string,
	// +optional
	// Environment variables
	env []string,
) (string, error) {
	container := m.Container(ctx, "linux/amd64").
		WithDirectory("/workspace", source)
	
	// Add environment variables
	for _, e := range env {
		container = container.WithEnvVariable(e, e)
	}
	
	return container.
		WithExec([]string{"sh", "-c", command}).
		Stdout(ctx)
}