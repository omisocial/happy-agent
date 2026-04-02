/**
 * CSV Reader/Writer — Manage creators list with status tracking
 * 
 * Reads creators.csv → returns array of creator objects
 * Updates status after successful/failed invites
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const logger = require('./logger');

const CSV_PATH = path.join(__dirname, '../../config/creators.csv');

/**
 * Read all creators from CSV
 * @returns {Array<{username: string, status: string, invited_at: string, profile_used: string, error_reason: string}>}
 */
function readCreators() {
  if (!fs.existsSync(CSV_PATH)) {
    logger.error('Creator CSV not found', { path: CSV_PATH });
    throw new Error(`Creator CSV not found: ${CSV_PATH}`);
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  logger.info(`Loaded ${records.length} creators from CSV`);
  return records;
}

/**
 * Get only pending creators (not yet invited)
 * @returns {Array}
 */
function getPendingCreators() {
  const all = readCreators();
  const pending = all.filter((c) => c.status === 'pending');
  logger.info(`Found ${pending.length} pending creators (out of ${all.length} total)`);
  return pending;
}

/**
 * Update a creator's status in the CSV
 * @param {string} username
 * @param {'invited'|'error'|'skipped'} status
 * @param {string} profileName
 * @param {string} [errorReason]
 */
function updateCreatorStatus(username, status, profileName, errorReason = '') {
  const all = readCreators();
  const idx = all.findIndex((c) => c.username === username);

  if (idx === -1) {
    logger.warn(`Creator not found in CSV: ${username}`);
    return;
  }

  all[idx].status = status;
  all[idx].invited_at = status === 'invited' ? new Date().toISOString() : '';
  all[idx].profile_used = profileName;
  all[idx].error_reason = errorReason;

  const csv = stringify(all, { header: true });
  fs.writeFileSync(CSV_PATH, csv);

  logger.info(`Updated creator status`, { username, status, profileName });
}

/**
 * Get summary stats from CSV
 * @returns {{total: number, pending: number, invited: number, error: number, skipped: number}}
 */
function getStats() {
  const all = readCreators();
  return {
    total: all.length,
    pending: all.filter((c) => c.status === 'pending').length,
    invited: all.filter((c) => c.status === 'invited').length,
    error: all.filter((c) => c.status === 'error').length,
    skipped: all.filter((c) => c.status === 'skipped').length,
  };
}

module.exports = { readCreators, getPendingCreators, updateCreatorStatus, getStats };
