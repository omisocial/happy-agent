/**
 * Orchestrator — Main Entry Point
 * 
 * Coordinates the full invite flow:
 * 1. Load configuration (profiles, creators, message)
 * 2. For each enabled profile:
 *    a. Filter pending creators
 *    b. Run the invite automation
 *    c. Update CSV with results
 * 3. Report summary
 * 
 * Exit codes:
 *   0 — All done (or no pending creators)
 *   1 — Selector error (Healer should fix) 
 *   2 — Fatal error (manual intervention needed)
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { runProfile } = require('./runner');
const { getPendingCreators, updateCreatorStatus, getStats } = require('./utils/csv-reader');
const { cleanOldErrors } = require('./tracer');
const logger = require('./utils/logger');

async function main() {
  logger.info('╔══════════════════════════════════════════╗');
  logger.info('║   TikTok Connect — Auto Invite System    ║');
  logger.info('╚══════════════════════════════════════════╝');

  // ── Load Config ──
  const profilesConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../config/profiles.json'), 'utf-8'),
  );
  const messageTemplate = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../config/message-template.json'), 'utf-8'),
  );

  const enabledProfiles = profilesConfig.profiles.filter((p) => p.enabled);
  if (enabledProfiles.length === 0) {
    logger.warn('No enabled profiles found. Please enable profiles in config/profiles.json');
    process.exit(0);
  }

  // ── Get Pending Creators ──
  const pendingCreators = getPendingCreators();
  if (pendingCreators.length === 0) {
    logger.info('🎉 No pending creators — all done!');
    const stats = getStats();
    logger.info('Final stats', stats);
    process.exit(0);
  }

  // ── Options from .env ──
  const options = {
    headless: process.env.HEADLESS === 'true',
    dryRun: process.env.DRY_RUN === 'true',
    delayBetweenCreators: parseInt(process.env.DELAY_BETWEEN_CREATORS || '5000', 10),
    tiktokUrl: process.env.TIKTOK_AFFILIATE_URL || 'https://partner.tiktokshop.com/affiliate-cmp/creator/market=7',
  };

  logger.info('Configuration loaded', {
    profiles: enabledProfiles.map((p) => p.name),
    pendingCreators: pendingCreators.length,
    dryRun: options.dryRun,
    headless: options.headless,
  });

  if (options.dryRun) {
    logger.warn('⚠️  DRY RUN MODE — invites will NOT be sent');
  }

  // ── Run Each Profile ──
  let hasSelectError = false;
  const delayBetweenProfiles = parseInt(process.env.DELAY_BETWEEN_PROFILES || '10000', 10);

  for (const profile of enabledProfiles) {
    logger.info(`\n${'─'.repeat(50)}`);
    logger.info(`Profile: ${profile.name}`);
    logger.info(`${'─'.repeat(50)}`);

    try {
      const results = await runProfile(profile, pendingCreators, messageTemplate, options);

      // Update CSV with results
      for (const username of results.success) {
        updateCreatorStatus(username, 'invited', profile.name);
      }
      for (const failure of results.failed) {
        updateCreatorStatus(failure.username, 'error', profile.name, failure.error);

        // Check if it's a selector error (needs healing)
        if (failure.step && failure.error.includes('Timeout')) {
          hasSelectError = true;
        }
      }

      // If selector error occurred, stop all profiles (need healing first)
      if (hasSelectError) {
        logger.warn('🔧 Selector error detected — stopping for AI healing');
        break;
      }

    } catch (profileErr) {
      logger.error(`Profile "${profile.name}" crashed`, { error: profileErr.message });
      hasSelectError = true;
      break;
    }

    // Delay between profiles
    if (enabledProfiles.indexOf(profile) < enabledProfiles.length - 1) {
      logger.info(`Waiting ${delayBetweenProfiles / 1000}s before next profile...`);
      await new Promise((r) => setTimeout(r, delayBetweenProfiles));
    }
  }

  // ── Summary ──
  const stats = getStats();
  logger.info('\n📊 Session Summary:');
  logger.info(`   Total creators: ${stats.total}`);
  logger.info(`   ✅ Invited: ${stats.invited}`);
  logger.info(`   ⏳ Pending: ${stats.pending}`);
  logger.info(`   ❌ Errors:  ${stats.error}`);
  logger.info(`   ⏭️  Skipped: ${stats.skipped}`);

  // Clean old error files
  cleanOldErrors(10);

  // Exit with appropriate code
  if (hasSelectError) {
    logger.error('Exiting with code 1 — selector healing needed');
    process.exit(1);
  }

  logger.info('🎉 All done!');
  process.exit(0);
}

// ── Run ──
main().catch((err) => {
  logger.error('Fatal orchestrator error', { error: err.message, stack: err.stack });
  process.exit(2);
});
