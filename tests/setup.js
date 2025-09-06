/**
 * Jest setup file for ccprompts test suite
 * Configures global test environment and utilities
 */

const fs = require('fs');
const path = require('path');

// Global test configuration
global.TEST_CONFIG = {
  PROJECT_ROOT: process.cwd(),
  EXPECTED_COMMAND_COUNT: 70,
  VALIDATION_TIMEOUT: 30000,
  PERFORMANCE_TARGETS: {
    DISCOVERY_MS: 100,
    VALIDATION_MS: 2000,
    REGISTRY_GENERATION_MS: 1000
  }
};

// Global utilities
global.testUtils = {
  // Create temporary test files
  createTempFile: (content, filename = 'test.md') => {
    const tempPath = path.join(global.TEST_CONFIG.PROJECT_ROOT, 'tests', 'temp', filename);
    fs.mkdirSync(path.dirname(tempPath), { recursive: true });
    fs.writeFileSync(tempPath, content);
    return tempPath;
  },

  // Clean up temporary files
  cleanupTempFiles: () => {
    const tempDir = path.join(global.TEST_CONFIG.PROJECT_ROOT, 'tests', 'temp');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  },

  // Mock command file content
  mockCommandFile: (commandName, options = {}) => {
    const defaults = {
      hasDescription: true,
      hasUsage: true,
      hasParameters: true,
      hasExamples: true,
      safetyLevel: 'safe'
    };
    const config = { ...defaults, ...options };

    let content = `# ${commandName} Command\n\n`;

    if (config.hasDescription) {
      content += `## Description\n\nThis is a test command for ${commandName}.\n\n`;
    }

    if (config.hasUsage) {
      content += `## Usage\n\n\`\`\`bash\n/${commandName} [options]\n\`\`\`\n\n`;
    }

    if (config.hasParameters) {
      content += `## Parameters\n\n- **param1**: Test parameter\n\n`;
    }

    if (config.hasExamples) {
      content += `## Examples\n\n\`\`\`bash\n/${commandName} example\n\`\`\`\n\nThis example demonstrates basic usage.\n\n`;
    }

    return content;
  },

  // Mock prompt file content
  mockPromptFile: (promptName, options = {}) => {
    const defaults = {
      hasXMLStructure: true,
      hasInstructions: true,
      hasExamples: true
    };
    const config = { ...defaults, ...options };

    let content = `# ${promptName}\n\n`;

    if (config.hasXMLStructure) {
      content += `<role>\nSystem prompt for ${promptName}\n</role>\n\n`;
      content += `<activation>\nWhen the user requests ${promptName}\n</activation>\n\n`;
    }

    if (config.hasInstructions) {
      content += `<instructions>\nExecute the ${promptName} workflow:\n1. Step one\n2. Step two\n</instructions>\n\n`;
    }

    if (config.hasExamples) {
      content += `## Examples\n\nExample usage of ${promptName}.\n\n`;
    }

    return content;
  }
};

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.EXPECTED_COMMAND_COUNT = '70';

// Global setup
beforeAll(() => {
  // Ensure test temp directory exists
  const tempDir = path.join(global.TEST_CONFIG.PROJECT_ROOT, 'tests', 'temp');
  fs.mkdirSync(tempDir, { recursive: true });
});

// Global cleanup
afterAll(() => {
  global.testUtils.cleanupTempFiles();
});

// Test timeout configuration
jest.setTimeout(global.TEST_CONFIG.VALIDATION_TIMEOUT);