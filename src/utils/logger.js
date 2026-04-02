/**
 * Logger — Structured logging with Winston
 * 
 * - Console output with color + emoji
 * - File output as JSON (for machine parsing)
 * - Separate error log file
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const LOG_DIR = path.join(__dirname, '../../data/logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

// Custom format for console: emoji + colored
const consoleFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  const icons = {
    error: '❌',
    warn: '⚠️',
    info: '✅',
    debug: '🔍',
  };
  const icon = icons[level] || '📋';
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${icon} [${timestamp}] ${message}${metaStr}`;
});

const logger = winston.createLogger({
  level: 'debug',
  defaultMeta: { service: 'tiktok-connect' },
  transports: [
    // Console — human readable
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.colorize(),
        consoleFormat,
      ),
    }),

    // File — JSON (machine readable)
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),

    // Errors only
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'errors.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

module.exports = logger;
