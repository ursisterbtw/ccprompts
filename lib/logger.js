const winston = require('winston');

/**
 * Winston-based structured logging system
 * Provides color-coded output with configurable log levels
 */
const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    debug: 4
  },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message }) => {
      const symbols = {
        error: '✗',
        warn: '⚠',
        success: '✓',
        info: 'ℹ',
        debug: '○'
      };
      return `${symbols[level] || '•'} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info'
    })
  ]
});

module.exports = logger;
