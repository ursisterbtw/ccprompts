#!/usr/bin/env node

/**
 * Script to split EXAMPLES.md into per-category files
 */

const fs = require('fs');
const path = require('path');

// Read the main EXAMPLES.md file
const examplesPath = path.join(__dirname, '..', 'EXAMPLES.md');
const content = fs.readFileSync(examplesPath, 'utf8');

// Define sections to extract with their output filenames
const sections = [
  {
    title: 'Getting Started Examples',
    filename: '01-getting-started.md',
    description: 'Examples for project initialization and setup'
  },
  {
    title: 'Development Workflow Examples',
    filename: '02-development-workflow.md',
    description: 'Examples for daily development tasks and workflows'
  },
  {
    title: 'Security & Compliance Examples',
    filename: '03-security-compliance.md',
    description: 'Examples for security hardening and compliance automation'
  },
  {
    title: 'Performance & Optimization Examples',
    filename: '04-performance-optimization.md',
    description: 'Examples for performance analysis and optimization'
  },
  {
    title: 'Learning & Skill Development Examples',
    filename: '05-learning-development.md',
    description: 'Examples for continuous learning and skill building'
  },
  {
    title: 'Team Coordination Examples',
    filename: '06-team-coordination.md',
    description: 'Examples for team collaboration and project management'
  },
  {
    title: 'Advanced Integration Examples',
    filename: '07-advanced-integration.md',
    description: 'Examples for complex integrations and workflows'
  },
  {
    title: 'Troubleshooting Examples',
    filename: '08-troubleshooting.md',
    description: 'Examples for debugging and problem resolution'
  },
  {
    title: 'Command Chaining Patterns',
    filename: '09-command-chaining.md',
    description: 'Examples of effective command combinations'
  },
  {
    title: 'Success Metrics and ROI',
    filename: '10-success-metrics.md',
    description: 'Examples showing measurable outcomes and ROI'
  },
  {
    title: 'Best Practices for Command Usage',
    filename: '11-best-practices.md',
    description: 'Guidelines and recommendations for effective command usage'
  }
];

// Extract header content (before first section)
const headerMatch = content.match(/^([\s\S]*?)(?=^## Getting Started Examples)/m);

// Function to extract section content
function extractSection(content, sectionTitle, nextSectionTitle = null) {
  const escapedTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let pattern;
  
  if (nextSectionTitle) {
    const escapedNext = nextSectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    pattern = new RegExp(`^## ${escapedTitle}\\s*\\n([\\s\\S]*?)(?=^## ${escapedNext})`, 'm');
  } else {
    // Last section - match until end of file
    pattern = new RegExp(`^## ${escapedTitle}\\s*\\n([\\s\\S]*?)$`, 'm');
  }
  
  const match = content.match(pattern);
  return match ? match[1].trim() : '';
}

// Create examples directory
const examplesDir = path.join(__dirname, '..', 'examples');
if (!fs.existsSync(examplesDir)) {
  fs.mkdirSync(examplesDir, { recursive: true });
}

// Process each section
sections.forEach((section, index) => {
  const nextSection = sections[index + 1];
  const nextTitle = nextSection ? nextSection.title : null;
  
  const sectionContent = extractSection(content, section.title, nextTitle);
  
  if (sectionContent) {
    // Create file content with header
    const fileContent = `# ${section.title}

${section.description}

---

${sectionContent}

---

[← Back to Examples Index](README.md) | [Next: ${nextSection ? nextSection.title : 'Examples Index'} →](${nextSection ? nextSection.filename : 'README.md'})
`;
    
    // Write to file
    const filePath = path.join(examplesDir, section.filename);
    fs.writeFileSync(filePath, fileContent);
    console.log(`✅ Created: ${section.filename}`);
  } else {
    console.log(`⚠️  No content found for: ${section.title}`);
  }
});

// Create index file
const indexContent = `# ccprompts Examples

Welcome to the comprehensive examples repository for the ccprompts command ecosystem. These examples demonstrate real-world usage scenarios for all 38+ commands across various development contexts.

## 📚 Example Categories

${sections.map(section => {
  return `### [${section.title}](${section.filename})
  ${section.description}
  `;
}).join('\n')}

## 🚀 Quick Start

1. **New to ccprompts?** Start with [Getting Started Examples](01-getting-started.md)
2. **Setting up workflows?** Check [Development Workflow Examples](02-development-workflow.md)
3. **Need security guidance?** See [Security & Compliance Examples](03-security-compliance.md)
4. **Learning resources?** Visit [Learning & Skill Development Examples](05-learning-development.md)

## 📖 How to Use These Examples

Each example includes:
- **Scenario**: Real-world context for the command usage
- **Commands**: Exact commands to run with parameters
- **Expected Outcome**: What you should see after running
- **Time Investment**: Estimated time to complete
- **Prerequisites**: Any required setup or dependencies

## 🔗 Additional Resources

- [Main README](../README.md) - Project overview and installation
- [Command Reference](../.claude/commands/README.md) - Detailed command documentation
- [CLAUDE.md](../CLAUDE.md) - AI assistant guidance
- [Workflows](../.claude/workflows/README.md) - Automated workflow definitions

---

*These examples are continuously updated based on community feedback and new use cases. Contributions welcome!*
`;

// Write index file
fs.writeFileSync(path.join(examplesDir, 'README.md'), indexContent);
console.log('✅ Created: README.md (index)');

// Create a simplified EXAMPLES.md that references the split files
const newExamplesContent = `# ccprompts Examples

The comprehensive examples have been organized into category-specific files for better navigation and maintainability.

## 📁 Example Categories

All examples have been moved to the \`examples/\` directory:

${sections.map(section => `- [${section.title}](examples/${section.filename})`).join('\n')}

## 🚀 Quick Navigation

- **Start Here**: [Examples Index](examples/README.md)
- **Getting Started**: [Project Setup Examples](examples/01-getting-started.md)
- **Best Practices**: [Command Usage Guidelines](examples/11-best-practices.md)

---

*For the complete examples documentation, please visit the [examples directory](examples/).*
`;

// Backup original EXAMPLES.md
fs.copyFileSync(examplesPath, examplesPath + '.backup');
console.log('✅ Backed up original EXAMPLES.md');

// Write new simplified EXAMPLES.md
fs.writeFileSync(examplesPath, newExamplesContent);
console.log('✅ Updated EXAMPLES.md with references to split files');

console.log('\n✨ Successfully split EXAMPLES.md into category files!');
console.log(`📁 Created ${sections.length} category files + 1 index file`);