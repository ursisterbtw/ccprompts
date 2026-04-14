#!/usr/bin/env node

/**
 * Audit Results Parser
 * Parses bun audit results and generates structured reports
 */

const fs = require('fs');
const path = require('path');
const logger = require('../lib/logger');

const args = process.argv.slice(2);
const auditFile = args[0];

if (!auditFile) {
    logger.error('Usage: node parse-audit.js <audit-file>');
    process.exit(1);
}

if (!fs.existsSync(auditFile)) {
    logger.error(`Audit file not found: ${auditFile}`);
    process.exit(1);
}

try {
    const content = fs.readFileSync(auditFile, 'utf8');

    // Parse audit results for vulnerabilities
    const vulnerabilities = content.match(/(\d+) vulnerabilities?/gi);
    const highVulns = content.match(/(\d+) high/gi);
    const moderateVulns = content.match(/(\d+) moderate/gi);
    const lowVulns = content.match(/(\d+) low/gi);

    // Generate structured report
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            total: vulnerabilities ? parseInt(vulnerabilities[0]) : 0,
            high: highVulns ? parseInt(highVulns[0]) : 0,
            moderate: moderateVulns ? parseInt(moderateVulns[0]) : 0,
            low: lowVulns ? parseInt(lowVulns[0]) : 0
        },
        raw: content
    };

    // Output results
    if (report.summary.total === 0) {
        logger.success('No vulnerabilities found');
    } else {
        logger.warn(`Security scan found: ${report.summary.total} vulnerabilities`);
        if (report.summary.high > 0) {
            logger.error(`High severity: ${report.summary.high}`);
        }
        if (report.summary.moderate > 0) {
            logger.warn(`Moderate severity: ${report.summary.moderate}`);
        }
        if (report.summary.low > 0) {
            logger.info(`Low severity: ${report.summary.low}`);
        }
    }

    // Write JSON report for CI/CD consumption
    const reportPath = path.join(process.cwd(), 'audit-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Exit with appropriate code
    process.exit(report.summary.high > 0 ? 1 : 0);

} catch (error) {
    logger.error(`Failed to parse audit results: ${error.message}`);
    process.exit(1);
}
