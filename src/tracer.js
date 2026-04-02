/**
 * Tracer — Error Context Capture Module
 * 
 * When Runner encounters an error, Tracer captures:
 * 1. Screenshot of the current page state
 * 2. Full HTML content of the page
 * 3. Structured error JSON with all context
 * 
 * This data is consumed by the Healer (AI Agent) to diagnose
 * and fix broken selectors.
 */

const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const ERRORS_DIR = path.join(__dirname, '../data/errors');

// Ensure errors directory exists
fs.mkdirSync(ERRORS_DIR, { recursive: true });

/**
 * Capture full error context from a failed Playwright step
 * 
 * @param {import('playwright').Page} page — Current Playwright page
 * @param {Object} context
 * @param {string} context.profileName — Which Chrome profile was running
 * @param {string} context.creator — Which creator was being processed
 * @param {string} context.step — Which step failed (e.g., 'SEARCH_INPUT')
 * @param {string} context.selectorKey — The selector key from selectors.js
 * @param {Error} context.error — The caught error
 * @returns {Object} — The error report object with file paths
 */
async function captureError(page, { profileName, creator, step, selectorKey, error }) {
  const timestamp = Date.now();
  const prefix = `${timestamp}_${profileName}_${creator}`;

  const screenshotPath = path.join(ERRORS_DIR, `${prefix}_screenshot.png`);
  const htmlPath = path.join(ERRORS_DIR, `${prefix}_page.html`);
  const errorJsonPath = path.join(ERRORS_DIR, `${prefix}_error.json`);

  // 1. Screenshot
  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
    logger.info('Screenshot captured', { path: screenshotPath });
  } catch (screenshotErr) {
    logger.warn('Failed to capture screenshot', { error: screenshotErr.message });
  }

  // 2. Page HTML
  try {
    const html = await page.content();
    fs.writeFileSync(htmlPath, html, 'utf-8');
    logger.info('Page HTML captured', { path: htmlPath, size: html.length });
  } catch (htmlErr) {
    logger.warn('Failed to capture HTML', { error: htmlErr.message });
  }

  // 3. Structured error report
  const { SELECTORS } = require('./utils/selectors');
  const currentSelector = SELECTORS[selectorKey] || null;

  const errorReport = {
    timestamp: new Date(timestamp).toISOString(),
    profile: profileName,
    creator,
    step,
    selectorKey,
    selectorDefinition: currentSelector,
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'),
    },
    pageUrl: page.url(),
    files: {
      screenshot: screenshotPath,
      html: htmlPath,
      errorJson: errorJsonPath,
    },
  };

  fs.writeFileSync(errorJsonPath, JSON.stringify(errorReport, null, 2), 'utf-8');
  logger.info('Error report saved', { path: errorJsonPath });

  return errorReport;
}

/**
 * Get the most recent error report
 * @returns {Object|null}
 */
function getLatestError() {
  if (!fs.existsSync(ERRORS_DIR)) return null;

  const files = fs.readdirSync(ERRORS_DIR)
    .filter((f) => f.endsWith('_error.json'))
    .sort()
    .reverse();

  if (files.length === 0) return null;

  const latest = JSON.parse(fs.readFileSync(path.join(ERRORS_DIR, files[0]), 'utf-8'));
  return latest;
}

/**
 * Clean old error files (keep last N reports)
 * @param {number} keep — Number of recent error sets to keep
 */
function cleanOldErrors(keep = 10) {
  if (!fs.existsSync(ERRORS_DIR)) return;

  const errorFiles = fs.readdirSync(ERRORS_DIR)
    .filter((f) => f.endsWith('_error.json'))
    .sort()
    .reverse();

  if (errorFiles.length <= keep) return;

  // Extract timestamps from files to delete
  const toDelete = errorFiles.slice(keep);
  for (const ef of toDelete) {
    const prefix = ef.replace('_error.json', '');
    // Delete all files with this prefix
    const related = fs.readdirSync(ERRORS_DIR).filter((f) => f.startsWith(prefix));
    for (const rf of related) {
      fs.unlinkSync(path.join(ERRORS_DIR, rf));
    }
  }

  logger.info(`Cleaned ${toDelete.length} old error reports, kept ${keep}`);
}

module.exports = { captureError, getLatestError, cleanOldErrors };
