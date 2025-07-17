#!/usr/bin/env python3
"""
Advanced Templating Framework
Implements sophisticated prompt templating with dynamic adaptation, context-aware generation,
and enterprise-grade template management based on Anthropic's documented patterns.
"""

import json
import re
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Optional, Union

import yaml
from jinja2 import BaseLoader, Environment


@dataclass
class TemplateVariable:
    """Template variable definition with validation and constraints"""

    name: str
    type: str  # 'string', 'list', 'number', 'boolean', 'enum'
    description: str
    required: bool = True
    default: Optional[Any] = None
    constraints: dict[str, Any] = field(default_factory=dict)
    validation_rules: list[str] = field(default_factory=list)
    context_dependent: bool = False


@dataclass
class TemplateMetadata:
    """Comprehensive template metadata"""

    name: str
    version: str
    description: str
    author: str
    created_date: str
    last_modified: str
    task_types: list[str]
    domains: list[str]
    complexity_levels: list[str]
    quality_score: float
    usage_count: int = 0
    performance_metrics: dict[str, float] = field(default_factory=dict)
    tags: list[str] = field(default_factory=list)


@dataclass
class CompiledTemplate:
    """Compiled template ready for execution"""

    template_id: str
    compiled_prompt: str
    variables_used: dict[str, Any]
    metadata: TemplateMetadata
    compilation_timestamp: str
    quality_predictions: dict[str, float]
    performance_estimates: dict[str, float]


class TemplateRegistry:
    """Registry for managing template storage, versioning, and retrieval"""

    def __init__(self, registry_path: str = "./template_registry"):
        self.registry_path = Path(registry_path)
        self.registry_path.mkdir(exist_ok=True)

        self.templates: dict[str, dict[str, Any]] = {}
        self.metadata_index: dict[str, TemplateMetadata] = {}

        # Load existing templates
        self._load_registry()

    def _load_registry(self):
        """Load templates from registry directory"""

        registry_file = self.registry_path / "registry.json"
        if registry_file.exists():
            with open(registry_file) as f:
                registry_data = json.load(f)

            for template_id, template_data in registry_data.get(
                "templates", {}
            ).items():
                self.templates[template_id] = template_data

                # Load metadata with defaults
                metadata_data = template_data.get("metadata", {})
                self.metadata_index[template_id] = TemplateMetadata(
                    name=metadata_data.get("name", template_id),
                    version=metadata_data.get("version", "1.0.0"),
                    description=metadata_data.get("description", ""),
                    author=metadata_data.get("author", "Unknown"),
                    created_date=metadata_data.get("created_date", ""),
                    last_modified=metadata_data.get("last_modified", ""),
                    task_types=metadata_data.get("task_types", []),
                    domains=metadata_data.get("domains", []),
                    complexity_levels=metadata_data.get("complexity_levels", []),
                    quality_score=metadata_data.get("quality_score", 0.0),
                    usage_count=metadata_data.get("usage_count", 0),
                    performance_metrics=metadata_data.get("performance_metrics", {}),
                    tags=metadata_data.get("tags", []),
                )

    def register_template(
        self,
        template_id: str,
        template_content: str,
        metadata: TemplateMetadata,
        variables: list[TemplateVariable],
    ):
        """Register a new template"""

        template_data = {
            "template_id": template_id,
            "content": template_content,
            "metadata": asdict(metadata),
            "variables": [asdict(var) for var in variables],
            "registered_date": datetime.now().isoformat(),
        }

        self.templates[template_id] = template_data
        self.metadata_index[template_id] = metadata

        # Save to disk
        self._save_registry()

        return template_id

    def get_template(self, template_id: str) -> Optional[dict[str, Any]]:
        """Get template by ID"""
        return self.templates.get(template_id)

    def search_templates(
        self,
        task_type: Optional[str] = None,
        domain: Optional[str] = None,
        complexity: Optional[str] = None,
        tags: Optional[list[str]] = None,
    ) -> list[str]:
        """Search templates by criteria"""

        matching_templates = []

        for template_id, metadata in self.metadata_index.items():
            match = True

            if task_type and task_type not in metadata.task_types:
                match = False
            if domain and domain not in metadata.domains:
                match = False
            if complexity and complexity not in metadata.complexity_levels:
                match = False
            if tags and all(tag not in metadata.tags for tag in tags):
                match = False

            if match:
                matching_templates.append(template_id)

        # Sort by quality score
        matching_templates.sort(
            key=lambda tid: self.metadata_index[tid].quality_score, reverse=True
        )

        return matching_templates

    def _save_registry(self):
        """Save registry to disk"""

        registry_data = {
            "version": "1.0",
            "updated": datetime.now().isoformat(),
            "templates": self.templates,
        }

        registry_file = self.registry_path / "registry.json"
        with open(registry_file, "w") as f:
            json.dump(registry_data, f, indent=2)


class ContextEngine:
    """Engine for context-aware template adaptation"""

    def __init__(self):
        self.context_processors = {
            "domain_adaptation": self._process_domain_context,
            "task_complexity": self._process_complexity_context,
            "user_expertise": self._process_expertise_context,
            "performance_optimization": self._process_performance_context,
        }

        # Domain-specific context data
        self.domain_contexts = {
            "software_engineering": {
                "common_patterns": ["MVC", "Microservices", "Event-Driven", "SOLID"],
                "tools": ["Git", "Docker", "Kubernetes", "CI/CD"],
                "languages": ["Python", "JavaScript", "Java", "Go", "TypeScript"],
                "best_practices": ["TDD", "Code Review", "Documentation", "Testing"],
            },
            "data_science": {
                "methodologies": ["CRISP-DM", "KDD", "SEMMA", "Agile Analytics"],
                "tools": ["Python", "R", "SQL", "Jupyter", "Tableau"],
                "techniques": [
                    "Machine Learning",
                    "Statistical Analysis",
                    "Visualization",
                ],
                "lifecycle": [
                    "Data Collection",
                    "Exploration",
                    "Modeling",
                    "Validation",
                ],
            },
            "business_analysis": {
                "frameworks": ["SWOT", "Porter's Five Forces", "Value Chain", "PEST"],
                "methodologies": ["Agile", "Waterfall", "Lean", "Six Sigma"],
                "deliverables": [
                    "Requirements",
                    "Process Maps",
                    "User Stories",
                    "Acceptance Criteria",
                ],
                "stakeholders": [
                    "Product Owner",
                    "Developers",
                    "End Users",
                    "Management",
                ],
            },
        }

    def adapt_template_to_context(
        self, template_content: str, context: dict[str, Any]
    ) -> str:
        """Adapt template based on context"""

        adapted_content = template_content

        for _processor_name, processor_func in self.context_processors.items():
            adapted_content = processor_func(adapted_content, context)

        return adapted_content

    def _process_domain_context(self, content: str, context: dict[str, Any]) -> str:
        """Process domain-specific context"""

        domain = context.get("domain", "general")

        if domain in self.domain_contexts:
            domain_data = self.domain_contexts[domain]

            # Replace generic placeholders with domain-specific content
            for key, values in domain_data.items():
                placeholder = f"{{{key}_example}}"
                if placeholder in content:
                    content = content.replace(
                        placeholder, values[0] if values else "example"
                    )

        return content

    def _process_complexity_context(self, content: str, context: dict[str, Any]) -> str:
        """Process complexity-level context"""

        complexity = context.get("complexity", "intermediate")

        if complexity == "simple":
            # Simplify language and reduce detail
            content = re.sub(r"comprehensive|thorough|detailed", "clear", content)
            content = re.sub(r"systematic|methodical", "step-by-step", content)
        elif complexity == "complex":
            # Add more sophisticated language and detail
            content = re.sub(r"\bbasic\b", "comprehensive", content)
            content = re.sub(r"\bsimple\b", "sophisticated", content)

        return content

    def _process_expertise_context(self, content: str, context: dict[str, Any]) -> str:
        """Process user expertise context"""

        expertise = context.get("user_expertise", "intermediate")

        if expertise == "beginner":
            # Add more explanations and guidance
            content = content.replace(
                "<instructions>",
                "<instructions>\nNote: This task includes detailed guidance for beginners.",
            )
        elif expertise == "expert":
            # Assume higher level of knowledge
            content = content.replace("detailed", "concise")
            content = content.replace("step-by-step", "high-level")

        return content

    def _process_performance_context(
        self, content: str, context: dict[str, Any]
    ) -> str:
        """Process performance optimization context"""

        performance_focus = context.get("performance_focus", [])

        if "speed" in performance_focus:
            content = content.replace(
                "<thinking>", "<thinking>\nFocus on efficiency and quick execution."
            )
        if "quality" in performance_focus:
            content = content.replace(
                "<output_format>",
                "<output_format>\nEnsure high quality and thorough validation.",
            )

        return content


class AdvancedTemplatingFramework:
    """
    Advanced templating framework implementing Anthropic's best practices:
    - Dynamic template compilation
    - Context-aware adaptation
    - Variable validation and substitution
    - Performance optimization
    - Template versioning and management
    """

    def __init__(self, registry_path: str = "./template_registry"):
        self.registry = TemplateRegistry(registry_path)
        self.context_engine = ContextEngine()

        # Initialize Jinja2 environment
        self.jinja_env = Environment(
            loader=BaseLoader(), trim_blocks=True, lstrip_blocks=True
        )

        # Register custom filters
        self._register_custom_filters()

        # Built-in template collection
        self._initialize_builtin_templates()

    def _register_custom_filters(self):
        """Register custom Jinja2 filters for prompt templating"""

        def format_list(items, style="numbered"):
            """Format list with different styles"""
            if style == "numbered":
                return "\n".join(f"{i+1}. {item}" for i, item in enumerate(items))
            if style == "bulleted":
                return "\n".join(f"• {item}" for item in items)
            if style == "dash":
                return "\n".join(f"- {item}" for item in items)
            return "\n".join(items)

        def xml_wrap(content, tag):
            """Wrap content in XML tags"""
            return f"<{tag}>\n{content}\n</{tag}>"

        def conditional_section(content, condition):
            """Include section only if condition is met"""
            return content if condition else ""

        self.jinja_env.filters["format_list"] = format_list
        self.jinja_env.filters["xml_wrap"] = xml_wrap
        self.jinja_env.filters["conditional_section"] = conditional_section

    def _initialize_builtin_templates(self):
        """Initialize built-in template collection"""

        # Comprehensive Analysis Template
        analysis_template = """
{%- set role_definition -%}
You are an expert {{ domain }} analyst with {{ experience|default("10") }} years of experience in {{ specialization|default("comprehensive analysis") }}.
{%- endset -%}

{%- set task_definition -%}
{{ task_description|default("Perform a comprehensive analysis of the provided content") }}.
{%- endset -%}

{%- set instructions -%}
Follow this systematic analysis methodology:
{{ analysis_steps|format_list('numbered') }}
{%- endset -%}

{%- set thinking_process -%}
Let me approach this analysis systematically:
{{ thinking_steps|format_list('dash') }}
{%- endset -%}

{%- set output_format -%}
Structure your analysis as follows:
{{ output_sections|format_list('numbered') }}
{%- endset -%}

{{ role_definition|xml_wrap('role') }}

{{ task_definition|xml_wrap('task') }}

{{ instructions|xml_wrap('instructions') }}

{{ thinking_process|xml_wrap('thinking') }}

{% if examples -%}
{{ examples|xml_wrap('examples') }}
{% endif -%}

{{ output_format|xml_wrap('output_format') }}

{{ input_data|default("[Input data will be provided here]") }}
""".strip()

        analysis_variables = [
            TemplateVariable(
                "domain",
                "string",
                "Analysis domain (e.g., business, technical, financial)",
                True,
            ),
            TemplateVariable(
                "experience", "string", "Years of experience", False, "10"
            ),
            TemplateVariable(
                "specialization",
                "string",
                "Area of specialization",
                False,
                "comprehensive analysis",
            ),
            TemplateVariable(
                "task_description", "string", "Specific task description", True
            ),
            TemplateVariable(
                "analysis_steps", "list", "Analysis methodology steps", True
            ),
            TemplateVariable("thinking_steps", "list", "Thinking process steps", True),
            TemplateVariable(
                "output_sections", "list", "Output structure sections", True
            ),
            TemplateVariable("examples", "string", "Example content", False),
            TemplateVariable("input_data", "string", "Input data placeholder", False),
        ]

        analysis_metadata = TemplateMetadata(
            name="comprehensive_analysis",
            version="1.0",
            description="Comprehensive analysis template with systematic methodology",
            author="AdvancedTemplatingFramework",
            created_date=datetime.now().isoformat(),
            last_modified=datetime.now().isoformat(),
            task_types=["analysis", "evaluation", "assessment"],
            domains=["business", "technical", "financial", "strategic"],
            complexity_levels=["intermediate", "complex"],
            quality_score=0.92,
            tags=["analysis", "systematic", "comprehensive", "structured"],
        )

        self.registry.register_template(
            "comprehensive_analysis",
            analysis_template,
            analysis_metadata,
            analysis_variables,
        )

        # Technical Implementation Template
        technical_template = """
{%- set role_definition -%}
You are a senior {{ role_type|default("software engineer") }} with {{ experience|default("10") }} years of experience in {{ technology_stack }} and expertise in {{ specialization|default("scalable system design") }}.
{%- endset -%}

{%- set technical_context -%}
Technical Context:
{{ context_elements|format_list('bulleted') }}
{%- endset -%}

{%- set requirements -%}
Requirements:
{{ requirement_list|format_list('numbered') }}
{%- endset -%}

{%- set constraints -%}
Constraints:
{{ constraint_list|format_list('bulleted') }}
{%- endset -%}

{%- set implementation_approach -%}
Let me approach this technical challenge systematically:

1. **Architecture Analysis** - {{ architecture_focus|default("Analyze current system design and identify optimization opportunities") }}
2. **Implementation Strategy** - {{ implementation_strategy|default("Design modular, testable, and maintainable solution") }}
3. **Testing Approach** - {{ testing_strategy|default("Implement comprehensive testing at unit, integration, and system levels") }}
4. **Performance Optimization** - {{ optimization_approach|default("Identify and address performance bottlenecks") }}
{%- endset -%}

{%- set output_specification -%}
Provide your technical solution with:
{{ output_elements|format_list('numbered') }}
{%- endset -%}

{{ role_definition|xml_wrap('role') }}

{{ technical_context|xml_wrap('technical_context') }}

{{ requirements|xml_wrap('requirements') }}

{{ constraints|xml_wrap('constraints') }}

{{ implementation_approach|xml_wrap('thinking') }}

{% if code_examples -%}
{{ code_examples|xml_wrap('examples') }}
{% endif -%}

{{ output_specification|xml_wrap('output_format') }}

{{ technical_input|default("[Technical specifications and requirements will be provided here]") }}
""".strip()

        technical_variables = [
            TemplateVariable(
                "role_type", "string", "Technical role type", False, "software engineer"
            ),
            TemplateVariable(
                "experience", "string", "Years of experience", False, "10"
            ),
            TemplateVariable(
                "technology_stack", "string", "Primary technology stack", True
            ),
            TemplateVariable(
                "specialization",
                "string",
                "Area of technical specialization",
                False,
                "scalable system design",
            ),
            TemplateVariable(
                "context_elements", "list", "Technical context elements", True
            ),
            TemplateVariable(
                "requirement_list", "list", "Technical requirements", True
            ),
            TemplateVariable("constraint_list", "list", "Technical constraints", True),
            TemplateVariable(
                "architecture_focus", "string", "Architecture analysis focus", False
            ),
            TemplateVariable(
                "implementation_strategy", "string", "Implementation approach", False
            ),
            TemplateVariable(
                "testing_strategy", "string", "Testing methodology", False
            ),
            TemplateVariable(
                "optimization_approach",
                "string",
                "Performance optimization strategy",
                False,
            ),
            TemplateVariable(
                "output_elements", "list", "Output structure elements", True
            ),
            TemplateVariable("code_examples", "string", "Code example content", False),
            TemplateVariable(
                "technical_input", "string", "Technical input placeholder", False
            ),
        ]

        technical_metadata = TemplateMetadata(
            name="technical_implementation",
            version="1.0",
            description="Technical implementation template with systematic approach",
            author="AdvancedTemplatingFramework",
            created_date=datetime.now().isoformat(),
            last_modified=datetime.now().isoformat(),
            task_types=["technical", "implementation", "development"],
            domains=["software_engineering", "system_design", "development"],
            complexity_levels=["intermediate", "complex"],
            quality_score=0.94,
            tags=["technical", "implementation", "systematic", "development"],
        )

        self.registry.register_template(
            "technical_implementation",
            technical_template,
            technical_metadata,
            technical_variables,
        )

    def compile_template(
        self,
        template_id: str,
        variables: dict[str, Any],
        context: Optional[dict[str, Any]] = None,
    ) -> CompiledTemplate:
        """Compile template with variables and context"""

        # Get template from registry
        template_data = self.registry.get_template(template_id)
        if not template_data:
            raise ValueError(f"Template {template_id} not found in registry")

        template_content = template_data["content"]
        metadata_data = template_data["metadata"]
        metadata = TemplateMetadata(
            name=metadata_data.get("name", template_id),
            version=metadata_data.get("version", "1.0.0"),
            description=metadata_data.get("description", ""),
            author=metadata_data.get("author", "Unknown"),
            created_date=metadata_data.get("created_date", ""),
            last_modified=metadata_data.get("last_modified", ""),
            task_types=metadata_data.get("task_types", []),
            domains=metadata_data.get("domains", []),
            complexity_levels=metadata_data.get("complexity_levels", []),
            quality_score=metadata_data.get("quality_score", 0.0),
            usage_count=metadata_data.get("usage_count", 0),
            performance_metrics=metadata_data.get("performance_metrics", {}),
            tags=metadata_data.get("tags", []),
        )

        # Apply context adaptation
        if context:
            template_content = self.context_engine.adapt_template_to_context(
                template_content, context
            )

        # Validate variables
        template_variables = [
            TemplateVariable(
                name=var_data.get("name", ""),
                type=var_data.get("type", "string"),
                description=var_data.get("description", ""),
                required=var_data.get("required", True),
                default=var_data.get("default"),
                constraints=var_data.get("constraints", {}),
                validation_rules=var_data.get("validation_rules", []),
                context_dependent=var_data.get("context_dependent", False),
            )
            for var_data in template_data["variables"]
        ]
        validated_variables = self._validate_variables(template_variables, variables)

        # Compile with Jinja2
        template = self.jinja_env.from_string(template_content)
        compiled_prompt = template.render(**validated_variables)

        # Calculate quality predictions
        quality_predictions = self._predict_quality(compiled_prompt, metadata)

        # Estimate performance
        performance_estimates = self._estimate_performance(compiled_prompt, metadata)

        return CompiledTemplate(
            template_id=template_id,
            compiled_prompt=compiled_prompt,
            variables_used=validated_variables,
            metadata=metadata,
            compilation_timestamp=datetime.now().isoformat(),
            quality_predictions=quality_predictions,
            performance_estimates=performance_estimates,
        )

    def _validate_variables(
        self,
        template_variables: list[TemplateVariable],
        provided_variables: dict[str, Any],
    ) -> dict[str, Any]:
        """Validate and process template variables"""

        validated = {}

        for var in template_variables:
            if var.required and var.name not in provided_variables:
                if var.default is not None:
                    validated[var.name] = var.default
                else:
                    raise ValueError(f"Required variable '{var.name}' not provided")
            elif var.name in provided_variables:
                value = provided_variables[var.name]

                # Type validation
                if var.type == "list" and not isinstance(value, list):
                    if isinstance(value, str):
                        value = [item.strip() for item in value.split(",")]
                    else:
                        raise ValueError(f"Variable '{var.name}' must be a list")
                elif var.type == "number" and not isinstance(value, (int, float)):
                    try:
                        value = float(value)
                    except ValueError as e:
                        raise ValueError(
                            f"Variable '{var.name}' must be a number"
                        ) from e
                elif var.type == "boolean" and not isinstance(value, bool):
                    value = str(value).lower() in {"true", "1", "yes", "on"}

                # Constraint validation
                if (
                    "min_length" in var.constraints
                    and len(str(value)) < var.constraints["min_length"]
                ):
                    raise ValueError(
                        f"Variable '{var.name}' must be at least {var.constraints['min_length']} characters"
                    )
                if (
                    "max_length" in var.constraints
                    and len(str(value)) > var.constraints["max_length"]
                ):
                    raise ValueError(
                        f"Variable '{var.name}' must be at most {var.constraints['max_length']} characters"
                    )

                validated[var.name] = value
            elif var.default is not None:
                validated[var.name] = var.default

        return validated

    def _predict_quality(
        self, compiled_prompt: str, metadata: TemplateMetadata
    ) -> dict[str, float]:
        """Predict quality metrics for compiled prompt"""

        # Analyze prompt structure
        has_role = "<role>" in compiled_prompt
        has_instructions = "<instructions>" in compiled_prompt
        has_thinking = "<thinking>" in compiled_prompt
        has_output_format = "<output_format>" in compiled_prompt
        has_examples = "<examples>" in compiled_prompt or "<example>" in compiled_prompt

        structure_score = (
            sum(
                [
                    has_role,
                    has_instructions,
                    has_thinking,
                    has_output_format,
                    has_examples,
                ]
            )
            / 5
        )

        # Analyze content quality
        word_count = len(compiled_prompt.split())
        sentence_count = compiled_prompt.count(".")
        avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0

        content_score = min(
            1.0, (word_count / 200) * 0.7 + (avg_sentence_length / 20) * 0.3
        )

        # Overall quality prediction
        overall_quality = (
            structure_score * 0.6 + content_score * 0.4
        ) * metadata.quality_score

        return {
            "structure_quality": structure_score,
            "content_quality": content_score,
            "overall_quality": overall_quality,
            "template_base_quality": metadata.quality_score,
        }

    def _estimate_performance(
        self, compiled_prompt: str, metadata: TemplateMetadata
    ) -> dict[str, float]:
        """Estimate performance characteristics"""

        # Token estimation (rough approximation)
        estimated_tokens = (
            len(compiled_prompt.split()) * 1.3
        )  # Account for tokenization

        # Complexity estimation
        xml_tags = len(re.findall(r"<\w+>", compiled_prompt))
        structure_complexity = min(1.0, xml_tags / 10)

        # Performance estimates
        return {
            "estimated_input_tokens": estimated_tokens,
            "estimated_processing_time": estimated_tokens * 0.01,  # Rough estimate
            "complexity_score": structure_complexity,
            "clarity_score": min(1.0, len(compiled_prompt.split()) / 300),
        }

    def create_custom_template(
        self,
        name: str,
        content: str,
        variables: list[TemplateVariable],
        task_types: list[str],
        domains: list[str],
        complexity_levels: list[str],
    ) -> str:
        """Create and register a custom template"""

        metadata = TemplateMetadata(
            name=name,
            version="1.0",
            description=f"Custom template: {name}",
            author="User",
            created_date=datetime.now().isoformat(),
            last_modified=datetime.now().isoformat(),
            task_types=task_types,
            domains=domains,
            complexity_levels=complexity_levels,
            quality_score=0.8,  # Initial score
            tags=["custom", "user_created"],
        )

        template_id = f"custom_{name.lower().replace(' ', '_')}"
        return self.registry.register_template(
            template_id, content, metadata, variables
        )

    def search_templates(self, **criteria) -> list[dict[str, Any]]:
        """Search templates with detailed results"""

        matching_ids = self.registry.search_templates(**criteria)

        results = []
        for template_id in matching_ids:
            template_data = self.registry.get_template(template_id)
            metadata = self.registry.metadata_index[template_id]

            results.append(
                {
                    "template_id": template_id,
                    "name": metadata.name,
                    "description": metadata.description,
                    "quality_score": metadata.quality_score,
                    "task_types": metadata.task_types,
                    "domains": metadata.domains,
                    "complexity_levels": metadata.complexity_levels,
                    "tags": metadata.tags,
                }
            )

        return results

    def export_template(self, template_id: str, format: str = "json") -> str:
        """Export template in specified format"""

        template_data = self.registry.get_template(template_id)
        if not template_data:
            raise ValueError(f"Template {template_id} not found")

        if format == "json":
            return json.dumps(template_data, indent=2)
        if format == "yaml":
            return yaml.dump(template_data, default_flow_style=False)
        raise ValueError(f"Unsupported export format: {format}")

    def import_template(
        self, template_data: Union[str, dict], format: str = "json"
    ) -> str:
        """Import template from data"""

        if isinstance(template_data, str):
            if format == "json":
                data = json.loads(template_data)
            elif format == "yaml":
                data = yaml.safe_load(template_data)
            else:
                raise ValueError(f"Unsupported import format: {format}")
        else:
            data = template_data

        # Extract components
        template_id = data["template_id"]
        content = data["content"]
        metadata_data = data["metadata"]
        metadata = TemplateMetadata(
            name=metadata_data.get("name", template_id),
            version=metadata_data.get("version", "1.0.0"),
            description=metadata_data.get("description", ""),
            author=metadata_data.get("author", "Unknown"),
            created_date=metadata_data.get("created_date", ""),
            last_modified=metadata_data.get("last_modified", ""),
            task_types=metadata_data.get("task_types", []),
            domains=metadata_data.get("domains", []),
            complexity_levels=metadata_data.get("complexity_levels", []),
            quality_score=metadata_data.get("quality_score", 0.0),
            usage_count=metadata_data.get("usage_count", 0),
            performance_metrics=metadata_data.get("performance_metrics", {}),
            tags=metadata_data.get("tags", []),
        )
        variables = [
            TemplateVariable(
                name=var_data.get("name", ""),
                type=var_data.get("type", "string"),
                description=var_data.get("description", ""),
                required=var_data.get("required", True),
                default=var_data.get("default"),
                constraints=var_data.get("constraints", {}),
                validation_rules=var_data.get("validation_rules", []),
                context_dependent=var_data.get("context_dependent", False),
            )
            for var_data in data["variables"]
        ]

        return self.registry.register_template(
            template_id, content, metadata, variables
        )


def main():
    """Test the advanced templating framework"""

    # Create framework
    framework = AdvancedTemplatingFramework()

    print("=== ADVANCED TEMPLATING FRAMEWORK ===")

    # Test template search
    print("\n--- Template Search ---")
    templates = framework.search_templates(task_type="analysis", domain="business")

    print(f"Found {len(templates)} templates:")
    for template in templates:
        print(f"  - {template['name']} (Quality: {template['quality_score']:.2f})")

    # Test template compilation
    print("\n--- Template Compilation ---")

    analysis_variables = {
        "domain": "business",
        "task_description": "Analyze the company's quarterly performance",
        "analysis_steps": [
            "Review financial metrics and KPIs",
            "Compare against industry benchmarks",
            "Identify trends and patterns",
            "Assess strategic implications",
        ],
        "thinking_steps": [
            "Examine revenue and profit trends",
            "Analyze market position",
            "Evaluate operational efficiency",
            "Consider future opportunities",
        ],
        "output_sections": [
            "Executive Summary with key findings",
            "Financial Performance Analysis",
            "Market Position Assessment",
            "Strategic Recommendations",
            "Risk Assessment and Mitigation",
        ],
    }

    context = {
        "domain": "business",
        "complexity": "intermediate",
        "user_expertise": "intermediate",
        "performance_focus": ["quality"],
    }

    compiled = framework.compile_template(
        "comprehensive_analysis", analysis_variables, context
    )

    print(
        f"Compiled template (Quality: {compiled.quality_predictions['overall_quality']:.2f}):"
    )
    print(
        f"{compiled.compiled_prompt[:500]}..."
        if len(compiled.compiled_prompt) > 500
        else compiled.compiled_prompt
    )

    # Test custom template creation
    print("\n--- Custom Template Creation ---")

    custom_content = """
{{ role_definition|xml_wrap('role') }}

{{ task_definition|xml_wrap('task') }}

{{ methodology|xml_wrap('methodology') }}

{{ output_format|xml_wrap('output_format') }}

{{ input_placeholder|default("[Input will be provided here]") }}
""".strip()

    custom_variables = [
        TemplateVariable("role_definition", "string", "Role definition", True),
        TemplateVariable("task_definition", "string", "Task definition", True),
        TemplateVariable("methodology", "string", "Methodology description", True),
        TemplateVariable(
            "output_format", "string", "Output format specification", True
        ),
        TemplateVariable("input_placeholder", "string", "Input placeholder", False),
    ]

    custom_id = framework.create_custom_template(
        "Simple Task Template",
        custom_content,
        custom_variables,
        ["general"],
        ["general"],
        ["simple", "intermediate"],
    )

    print(f"Created custom template: {custom_id}")

    # Test export/import
    print("\n--- Template Export/Import ---")

    exported = framework.export_template("comprehensive_analysis", "json")
    print(f"Exported template size: {len(exported)} characters")

    # Performance summary
    print("\n--- Performance Summary ---")
    print(f"Template Compilation Time: {compiled.compilation_timestamp}")
    print(
        f"Estimated Processing Time: {compiled.performance_estimates['estimated_processing_time']:.2f}s"
    )
    print(
        f"Estimated Input Tokens: {compiled.performance_estimates['estimated_input_tokens']:.0f}"
    )
    print(f"Complexity Score: {compiled.performance_estimates['complexity_score']:.2f}")

    return framework


if __name__ == "__main__":
    main()
