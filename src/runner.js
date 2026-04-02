/**
 * Runner — Core Playwright Automation for TikTok Shop Creator Invite
 * 
 * Flow per creator:
 * 1. Navigate to Creator Marketplace
 * 2. Search for creator by username
 * 3. Save creator to list
 * 4. Open Saved Creators drawer → select → click Invite
 * 5. Fill invite form (type, message, contact info)
 * 6. Submit (or skip in dry-run mode)
 * 
 * On error: delegates to Tracer for context capture, then throws
 * for Orchestrator to decide (retry or heal).
 */


const { resolve } = require('./utils/selectors');
const { captureError } = require('./tracer');
const logger = require('./utils/logger');

/**
 * Run invite flow for a batch of creators using one Chrome profile
 * 
 * @param {Object} profile — { name, path, enabled }
 * @param {Array<{username: string}>} creators — Creator list
 * @param {Object} messageTemplate — { inviteType, message, contactInfo }
 * @param {Object} options — { headless, dryRun, delayBetweenCreators, tiktokUrl }
 * @returns {Object} — { success: string[], failed: Array<{username, error, errorReport}> }
 */
async function runProfile(profile, creators, messageTemplate, options = {}) {
  const {
    headless = false,
    dryRun = true,
    delayBetweenCreators = 5000,
    tiktokUrl = 'https://partner.tiktokshop.com/affiliate-cmp/creator/market=7',
  } = options;

  const results = { success: [], failed: [] };

  logger.info(`🚀 Starting profile: ${profile.name}`, { path: profile.path, creatorCount: creators.length });

  let browser;
  try {
    const { launchPersistentContext } = await import('cloakbrowser');
    browser = await launchPersistentContext({
      userDataDir: profile.path,
      headless,
      viewport: { width: 1280, height: 720 },
      humanize: process.env.HUMANIZE === 'true',
      humanPreset: process.env.HUMAN_PRESET || 'default',
      args: [
        `--fingerprint=${profile.fingerprintSeed || Date.now()}`,
        '--no-first-run',
        '--no-default-browser-check',
      ],
    });
  } catch (launchErr) {
    logger.error(`Failed to launch browser for profile: ${profile.name}`, { error: launchErr.message });
    throw launchErr;
  }

  const page = await browser.newPage();

  for (const creator of creators) {
    const { username } = creator;
    let currentStep = '';

    try {
      logger.info(`Processing creator: ${username}`, { profile: profile.name });

      // ── STEP 1: NAVIGATE ──
      currentStep = 'NAVIGATE';
      await page.goto(tiktokUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await randomDelay(1000, 2000);

      // ── STEP 2: SEARCH ──
      currentStep = 'SEARCH_INPUT';
      const searchInput = resolve(page, 'SEARCH_INPUT');
      await searchInput.waitFor({ state: 'visible', timeout: 10000 });
      await searchInput.fill(''); // Clear first
      await searchInput.fill(username);
      await searchInput.press('Enter');
      await page.waitForTimeout(3000);

      // ── STEP 3: SAVE CREATOR ──
      currentStep = 'SAVE_BUTTON';
      const saveBtn = resolve(page, 'SAVE_BUTTON');
      await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
      await saveBtn.click();
      await page.waitForTimeout(1000);

      // ── STEP 4: OPEN SAVED CREATORS ──
      currentStep = 'SAVED_CREATORS_BTN';
      const savedBtn = resolve(page, 'SAVED_CREATORS_BTN');
      await savedBtn.click();
      await page.waitForTimeout(2000);

      // ── STEP 5: SELECT & INVITE ──
      currentStep = 'DRAWER_CHECKBOX';
      const checkbox = resolve(page, 'DRAWER_CHECKBOX');
      await checkbox.check();

      currentStep = 'DRAWER_INVITE_BTN';
      const inviteBtn = resolve(page, 'DRAWER_INVITE_BTN');
      await inviteBtn.click();

      currentStep = 'INVITE_MODAL_TITLE';
      const modalTitle = resolve(page, 'INVITE_MODAL_TITLE');
      await modalTitle.waitFor({ state: 'visible', timeout: 10000 });

      // ── STEP 6: FILL FORM ──
      currentStep = 'PRODUCT_DISTRIBUTION_RADIO';
      const radio = resolve(page, 'PRODUCT_DISTRIBUTION_RADIO');
      await radio.check();

      currentStep = 'MESSAGE_TEXTAREA';
      const textarea = resolve(page, 'MESSAGE_TEXTAREA');
      await textarea.fill(messageTemplate.message);

      currentStep = 'ZALO_INPUT';
      const zaloInput = resolve(page, 'ZALO_INPUT');
      await zaloInput.fill(messageTemplate.contactInfo.zalo);

      currentStep = 'PHONE_INPUT';
      const phoneInput = resolve(page, 'PHONE_INPUT');
      await phoneInput.fill(messageTemplate.contactInfo.phone);

      // ── STEP 7: SUBMIT ──
      if (dryRun) {
        logger.info(`🏁 DRY RUN — skipping send for: ${username}`);
      } else {
        currentStep = 'SEND_INVITE_BTN';
        const sendBtn = resolve(page, 'SEND_INVITE_BTN');
        await sendBtn.click();
        logger.info(`📨 Invite sent to: ${username}`);
        await page.waitForTimeout(2000);
      }

      results.success.push(username);
      logger.info(`✅ Success: ${username}`);

      // Delay between creators (anti-detection)
      await randomDelay(delayBetweenCreators, delayBetweenCreators + 2000);

    } catch (error) {
      logger.error(`Failed at step "${currentStep}" for creator: ${username}`, {
        error: error.message,
        profile: profile.name,
      });

      // Capture full error context via Tracer
      const errorReport = await captureError(page, {
        profileName: profile.name,
        creator: username,
        step: currentStep,
        selectorKey: currentStep,
        error,
      });

      results.failed.push({ username, step: currentStep, error: error.message, errorReport });

      // If it's a selector/timeout error → stop this profile (need Healer)
      if (error.name === 'TimeoutError' || error.message.includes('locator')) {
        logger.warn('Selector error detected — stopping profile for AI healing');
        break; // Exit creator loop, let Orchestrator handle
      }

      // If it's a network error → continue with next creator
      logger.warn(`Skipping ${username} due to non-selector error, continuing...`);
    }
  }

  // Cleanup
  try {
    await browser.close();
  } catch (closeErr) {
    logger.warn('Browser close error', { error: closeErr.message });
  }

  logger.info(`Profile ${profile.name} complete`, {
    success: results.success.length,
    failed: results.failed.length,
  });

  return results;
}

// ── Helpers ──

/**
 * Type text with random delays to simulate human behavior
 */
async function typeHumanLike(locator, text) {
  for (const char of text) {
    await locator.type(char, { delay: 50 + Math.random() * 100 });
  }
}

/**
 * Random delay between min and max milliseconds
 */
function randomDelay(min, max) {
  const ms = Math.floor(min + Math.random() * (max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { runProfile };
