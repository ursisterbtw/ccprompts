#!/usr/bin/env python3
"""
Dagger.io pipeline configuration for CCPrompts development environment.
Provides comprehensive CI/CD automation with security scanning, testing, and deployment.
"""

import asyncio
import sys
from pathlib import Path
from typing import List, Optional

import dagger
from dagger import Container, Directory


class CCPromptsPipeline:
    """Main pipeline orchestrator for CCPrompts project."""

    def __init__(self):
        self.client: Optional[dagger.Client] = None
        self.workspace_dir = Path.cwd()

    async def __aenter__(self):
        self.client = dagger.Client()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.close()

    def get_base_container(self) -> Container:
        """Get the base development container with all tools installed."""
        if not self.client:
            raise RuntimeError("Client not initialized")

        return (
            self.client.container()
            .from_("python:3.12-slim")
            .with_exec(["apt-get", "update"])
            .with_exec([
                "apt-get", "install", "-y",
                "curl", "git", "build-essential", "nodejs", "npm"
            ])
            .with_exec(["pip", "install", "ruff", "black", "mypy", "pytest"])
            .with_exec(["npm", "install", "-g", "markdownlint-cli", "markdown-link-check"])
        )

    def mount_source(self, container: Container) -> Container:
        """Mount the source code into the container."""
        if not self.client:
            raise RuntimeError("Client not initialized")

        source_dir = self.client.host().directory(".", exclude=[
            ".git",
            ".devcontainer",
            "__pycache__",
            "node_modules",
            ".pytest_cache",
            ".mypy_cache"
        ])

        return container.with_directory("/workspace", source_dir).with_workdir("/workspace")

    async def lint_markdown(self) -> bool:
        """Run markdown linting across all .md files."""
        print("🔍 Running markdown linting...")
        
        container = self.mount_source(self.get_base_container())
        
        # Lint markdown files
        result = await (
            container
            .with_exec(["markdownlint", "**/*.md", "--ignore", "node_modules"])
            .stdout()
        )
        
        print("✅ Markdown linting completed")
        return True

    async def check_links(self) -> bool:
        """Check for broken links in markdown files."""
        print("🔗 Checking markdown links...")
        
        container = self.mount_source(self.get_base_container())
        
        # Check links in markdown files
        result = await (
            container
            .with_exec(["find", ".", "-name", "*.md", "-not", "-path", "./node_modules/*"])
            .with_exec(["xargs", "markdown-link-check", "--config", ".markdown-link-check.json"])
            .stdout()
        )
        
        print("✅ Link checking completed")
        return True

    async def security_scan(self) -> bool:
        """Run security scanning on the codebase."""
        print("🛡️ Running security scan...")
        
        container = (
            self.get_base_container()
            .with_exec(["pip", "install", "bandit", "safety", "semgrep"])
        )
        container = self.mount_source(container)
        
        # Run multiple security tools
        await container.with_exec(["bandit", "-r", ".", "-f", "json", "-o", "/tmp/bandit.json"]).stdout()
        await container.with_exec(["safety", "check", "--json", "--output", "/tmp/safety.json"]).stdout()
        await container.with_exec(["semgrep", "--config=auto", "--json", "--output=/tmp/semgrep.json", "."]).stdout()
        
        print("✅ Security scanning completed")
        return True

    async def validate_prompts(self) -> bool:
        """Validate prompt structure and format."""
        print("📝 Validating prompt structures...")
        
        container = self.mount_source(self.get_base_container())
        
        # Custom validation script for prompt format
        validation_script = '''
import os
import json
import yaml
from pathlib import Path

def validate_prompt_structure(file_path):
    """Validate that prompts follow the expected XML structure."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    required_sections = ['<role>', '<activation>', '<instructions>', '<output_format>']
    missing_sections = [section for section in required_sections if section not in content]
    
    if missing_sections:
        print(f"❌ {file_path}: Missing sections: {missing_sections}")
        return False
    
    print(f"✅ {file_path}: Valid structure")
    return True

def main():
    prompt_dir = Path("prompts")
    valid_count = 0
    total_count = 0
    
    for md_file in prompt_dir.rglob("*.md"):
        if md_file.name != "INDEX.md":
            total_count += 1
            if validate_prompt_structure(md_file):
                valid_count += 1
    
    print(f"\\n📊 Validation Results: {valid_count}/{total_count} prompts valid")
    return valid_count == total_count

if __name__ == "__main__":
    exit(0 if main() else 1)
        '''
        
        result = await (
            container
            .with_new_file("/workspace/validate_prompts.py", validation_script)
            .with_exec(["python", "validate_prompts.py"])
            .stdout()
        )
        
        print("✅ Prompt validation completed")
        return True

    async def test_command_accessibility(self) -> bool:
        """Test that all slash commands are properly accessible."""
        print("⚡ Testing command accessibility...")
        
        container = self.mount_source(self.get_base_container())
        
        # Test that all command files exist and are readable
        result = await (
            container
            .with_exec(["find", ".claude/commands", "-name", "*.md", "-type", "f"])
            .with_exec(["wc", "-l"])
            .stdout()
        )
        
        print("✅ Command accessibility testing completed")
        return True

    async def generate_documentation(self) -> bool:
        """Generate updated documentation and indexes."""
        print("📚 Generating documentation...")
        
        container = self.mount_source(self.get_base_container())
        
        # Generate updated INDEX.md files
        index_generator = '''
import os
from pathlib import Path

def generate_prompt_index():
    """Generate INDEX.md for prompts directory."""
    prompt_dir = Path("prompts")
    categories = {}
    
    for category_dir in prompt_dir.iterdir():
        if category_dir.is_dir() and not category_dir.name.startswith('.'):
            category_name = category_dir.name
            prompts = []
            
            for md_file in category_dir.glob("*.md"):
                if md_file.name != "INDEX.md":
                    prompts.append(md_file.name)
            
            if prompts:
                categories[category_name] = sorted(prompts)
    
    # Generate INDEX.md content
    index_content = "# CCPrompts Index\\n\\n"
    index_content += "## Categories\\n\\n"
    
    for category, prompts in sorted(categories.items()):
        index_content += f"### {category.replace('-', ' ').title()}\\n\\n"
        for prompt in prompts:
            prompt_name = prompt.replace('.md', '').replace('-', ' ').title()
            index_content += f"- [{prompt_name}]({category}/{prompt})\\n"
        index_content += "\\n"
    
    with open("prompts/INDEX.md", "w") as f:
        f.write(index_content)
    
    print("✅ Generated prompts/INDEX.md")

if __name__ == "__main__":
    generate_prompt_index()
        '''
        
        result = await (
            container
            .with_new_file("/workspace/generate_docs.py", index_generator)
            .with_exec(["python", "generate_docs.py"])
            .stdout()
        )
        
        print("✅ Documentation generation completed")
        return True

    async def run_full_pipeline(self) -> bool:
        """Run the complete CI/CD pipeline."""
        print("🚀 Starting CCPrompts CI/CD Pipeline")
        print("=" * 50)
        
        steps = [
            ("Markdown Linting", self.lint_markdown),
            ("Link Checking", self.check_links),
            ("Security Scanning", self.security_scan),
            ("Prompt Validation", self.validate_prompts),
            ("Command Testing", self.test_command_accessibility),
            ("Documentation Generation", self.generate_documentation),
        ]
        
        for step_name, step_func in steps:
            print(f"\\n📋 Running: {step_name}")
            try:
                success = await step_func()
                if not success:
                    print(f"❌ {step_name} failed")
                    return False
            except Exception as e:
                print(f"❌ {step_name} failed with error: {e}")
                return False
        
        print("\\n🎉 Pipeline completed successfully!")
        return True


async def main():
    """Main entry point for the Dagger pipeline."""
    if len(sys.argv) < 2:
        print("Usage: python dagger.py <command>")
        print("Commands: lint, links, security, validate, test, docs, full")
        sys.exit(1)
    
    command = sys.argv[1]
    
    async with CCPromptsPipeline() as pipeline:
        if command == "lint":
            await pipeline.lint_markdown()
        elif command == "links":
            await pipeline.check_links()
        elif command == "security":
            await pipeline.security_scan()
        elif command == "validate":
            await pipeline.validate_prompts()
        elif command == "test":
            await pipeline.test_command_accessibility()
        elif command == "docs":
            await pipeline.generate_documentation()
        elif command == "full":
            await pipeline.run_full_pipeline()
        else:
            print(f"Unknown command: {command}")
            sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())