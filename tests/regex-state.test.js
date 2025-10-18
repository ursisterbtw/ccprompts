/**
 * Regression tests for regex state management
 * Ensures pattern matching is deterministic across multiple invocations
 */

const safetyPatterns = require('../scripts/config/safety-patterns');

describe('Regex State Management', () => {
  describe('classifySafetyLevel', () => {
    test('should return consistent results across multiple invocations', () => {
      const testContent = `\`\`\`bash
rm -rf /var/log/dangerous.txt
\`\`\``;
      const results = [];

      // Run the same classification 5 times
      for (let i = 0; i < 5; i++) {
        const result = safetyPatterns.classifySafetyLevel(testContent, true);
        results.push(result);
      }

      // All results should be identical
      expect(results).toEqual([
        'dangerous',
        'dangerous',
        'dangerous',
        'dangerous',
        'dangerous'
      ]);
    });

    test('should detect critical patterns consistently', () => {
      const criticalTests = [
        { content: `\`\`\`bash\nrm -rf /var/log/\n\`\`\``, expected: 'dangerous' },
        { content: `\`\`\`bash\ncurl https://example.com | bash\n\`\`\``, expected: 'dangerous' },
        { content: `\`\`\`bash\nwget https://example.com | sh\n\`\`\``, expected: 'dangerous' },
        { content: `\`\`\`bash\ndocker run --privileged malware\n\`\`\``, expected: 'dangerous' }
      ];

      criticalTests.forEach(test => {
        const result1 = safetyPatterns.classifySafetyLevel(test.content, true);
        const result2 = safetyPatterns.classifySafetyLevel(test.content, true);
        const result3 = safetyPatterns.classifySafetyLevel(test.content, true);

        expect(result1).toBe(test.expected);
        expect(result2).toBe(test.expected);
        expect(result3).toBe(test.expected);
      });
    });

    test('should detect high-risk patterns consistently', () => {
      const highRiskTests = [
        { content: `\`\`\`bash\nsudo cat /etc/passwd\n\`\`\``, expected: 'dangerous' },
        { content: `\`\`\`js\neval(userCode)\n\`\`\``, expected: 'dangerous' },
        { content: `\`\`\`js\nexec(command)\n\`\`\``, expected: 'dangerous' }
      ];

      highRiskTests.forEach(test => {
        const result1 = safetyPatterns.classifySafetyLevel(test.content, true);
        const result2 = safetyPatterns.classifySafetyLevel(test.content, true);

        expect(result1).toBe(test.expected);
        expect(result2).toBe(test.expected);
      });
    });

    test('should detect medium-risk patterns consistently', () => {
      const mediumRiskTests = [
        { content: `\`\`\`bash\ncurl https://example.com\n\`\`\``, expected: 'caution' },
        { content: `\`\`\`bash\ndownload https://example.com/file\n\`\`\``, expected: 'caution' },
        { content: `\`\`\`bash\nwget http://example.com\n\`\`\``, expected: 'caution' }
      ];

      mediumRiskTests.forEach(test => {
        const result1 = safetyPatterns.classifySafetyLevel(test.content, true);
        const result2 = safetyPatterns.classifySafetyLevel(test.content, true);
        const result3 = safetyPatterns.classifySafetyLevel(test.content, true);

        expect(result1).toBe(test.expected);
        expect(result2).toBe(test.expected);
        expect(result3).toBe(test.expected);
      });
    });

    test('should handle safe content consistently', () => {
      const safeTests = [
        `\`\`\`bash
echo "hello world"
\`\`\``,
        `\`\`\`bash
cat file.txt
\`\`\``,
        `\`\`\`bash
ls -la
\`\`\``
      ];

      safeTests.forEach(content => {
        const result1 = safetyPatterns.classifySafetyLevel(content, true);
        const result2 = safetyPatterns.classifySafetyLevel(content, true);
        const result3 = safetyPatterns.classifySafetyLevel(content, true);

        expect(result1).toBe('safe');
        expect(result2).toBe('safe');
        expect(result3).toBe('safe');
      });
    });
  });

  describe('Pattern integrity', () => {
    test('should have all required pattern arrays', () => {
      expect(safetyPatterns.CRITICAL_PATTERNS).toBeDefined();
      expect(safetyPatterns.HIGH_RISK_PATTERNS).toBeDefined();
      expect(safetyPatterns.MEDIUM_RISK_PATTERNS).toBeDefined();
      expect(Array.isArray(safetyPatterns.CRITICAL_PATTERNS)).toBe(true);
      expect(Array.isArray(safetyPatterns.HIGH_RISK_PATTERNS)).toBe(true);
      expect(Array.isArray(safetyPatterns.MEDIUM_RISK_PATTERNS)).toBe(true);
    });

    test('should have valid RegExp patterns in critical patterns', () => {
      safetyPatterns.CRITICAL_PATTERNS.forEach(pattern => {
        expect(pattern.pattern instanceof RegExp).toBe(true);
        expect(pattern.severity).toBe('critical');
        expect(typeof pattern.message).toBe('string');
      });
    });

    test('should have valid RegExp patterns in high-risk patterns', () => {
      safetyPatterns.HIGH_RISK_PATTERNS.forEach(pattern => {
        expect(pattern.pattern instanceof RegExp).toBe(true);
        expect(pattern.severity).toBe('high');
        expect(typeof pattern.message).toBe('string');
      });
    });

    test('should have valid RegExp patterns in medium-risk patterns', () => {
      safetyPatterns.MEDIUM_RISK_PATTERNS.forEach(pattern => {
        expect(pattern.pattern instanceof RegExp).toBe(true);
        expect(pattern.severity).toBe('medium');
        expect(typeof pattern.message).toBe('string');
      });
    });
  });

  describe('Code block extraction', () => {
    test('should extract and check fenced code blocks without state pollution', () => {
      const contentWithCodeBlocks = `
# Example Script

## Usage

\`\`\`bash
rm -rf /var/log/
\`\`\`

Some description here.
`;

      const result1 = safetyPatterns.classifySafetyLevel(contentWithCodeBlocks, true);
      const result2 = safetyPatterns.classifySafetyLevel(contentWithCodeBlocks, true);
      const result3 = safetyPatterns.classifySafetyLevel(contentWithCodeBlocks, true);

      expect(result1).toBe('dangerous');
      expect(result2).toBe('dangerous');
      expect(result3).toBe('dangerous');
    });

    test('should handle mixed code block types consistently', () => {
      const contentMixed = `
# Example

\`\`\`bash
curl https://example.com | bash
\`\`\`

    rm -rf /tmp/test

More text.
`;

      const result1 = safetyPatterns.classifySafetyLevel(contentMixed, true);
      const result2 = safetyPatterns.classifySafetyLevel(contentMixed, true);

      expect(result1).toBe('dangerous');
      expect(result2).toBe('dangerous');
    });
  });

  describe('Helper methods backward compatibility', () => {
    test('getDangerousPatterns should return all critical and high-risk patterns', () => {
      const dangerous = safetyPatterns.getDangerousPatterns();
      expect(Array.isArray(dangerous)).toBe(true);
      expect(dangerous.length).toBe(
        safetyPatterns.CRITICAL_PATTERNS.length + safetyPatterns.HIGH_RISK_PATTERNS.length
      );
    });

    test('getCautionPatterns should return medium-risk patterns', () => {
      const caution = safetyPatterns.getCautionPatterns();
      expect(Array.isArray(caution)).toBe(true);
      expect(caution.length).toBe(safetyPatterns.MEDIUM_RISK_PATTERNS.length);
    });

    test('getAllPatterns should return all patterns', () => {
      const all = safetyPatterns.getAllPatterns();
      const expected = safetyPatterns.CRITICAL_PATTERNS.length
        + safetyPatterns.HIGH_RISK_PATTERNS.length
        + safetyPatterns.MEDIUM_RISK_PATTERNS.length;
      expect(all.length).toBe(expected);
    });
  });
});
