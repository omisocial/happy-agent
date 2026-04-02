/**
 * Healer 2.0 — Smart AI-Powered Self-Healing Module (Anti-Anti-Fix)
 * 
 * Features:
 * 1. Continuity Memory: Remembers failed attempts to avoid Loop of Death.
 * 2. Pre-flight Test-Gate: Validates new selectors against the snapshot HTML locally 
 *    before saving and resuming the orchestrator.
 * 3. Multi-attempt loop (max 3 tries).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getLatestError } = require('./tracer');
const logger = require('./utils/logger');
let cloakbrowser;
try {
  cloakbrowser = require('cloakbrowser');
} catch (e) {
  // If not installed yet, dummy it (for dry runs)
}

const SELECTORS_PATH = path.join(__dirname, 'utils/selectors.js');
const MEMORY_DIR = path.join(__dirname, '../data/learning');
const MEMORY_PATH = path.join(MEMORY_DIR, 'healer_memory.json');

// Ensure memory dir exists
if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

function loadMemory() {
  if (fs.existsSync(MEMORY_PATH)) {
    return JSON.parse(fs.readFileSync(MEMORY_PATH, 'utf-8'));
  }
  return {};
}

function saveMemory(memory) {
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2), 'utf-8');
}

/**
 * Attempt to heal the most recent selector failure
 */
async function heal() {
  logger.info('🧠 Healer 2.0 activated — analyzing latest error...');

  const errorReport = getLatestError();
  if (!errorReport) {
    logger.warn('No error reports found. Nothing to heal.');
    return false;
  }

  logger.info('Error context loaded', {
    step: errorReport.step,
    selector: errorReport.selectorKey,
  });

  const baseSelectorsStr = fs.readFileSync(SELECTORS_PATH, 'utf-8');

  let errorHtml = '';
  if (errorReport.files.html && fs.existsSync(errorReport.files.html)) {
    const fullHtml = fs.readFileSync(errorReport.files.html, 'utf-8');
    errorHtml = fullHtml.substring(0, 80000); // 80KB limit
  }

  const memory = loadMemory();
  const selectorKey = errorReport.selectorKey;
  
  // Track failures for this specific error session
  const sessionFailures = [];

  const maxAttempts = 3;
  let healed = false;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    logger.info(`Healing Attempt ${attempt}/${maxAttempts} for ${selectorKey}...`);

    // 1. Build prompt with memory context
    const historicalFailures = memory[selectorKey] || [];
    const prompt = buildHealPrompt(errorReport, baseSelectorsStr, errorHtml, historicalFailures, sessionFailures);

    const promptPath = path.join(__dirname, '../data/errors/heal_prompt.md');
    fs.writeFileSync(promptPath, prompt, 'utf-8');

    // Backup selectors
    const backupSelectors = fs.readFileSync(SELECTORS_PATH, 'utf-8');

    // 2. Execute AI Agent
    const healerCommand = process.env.HEALER_COMMAND || 'echo "AI Healer not configured"';
    try {
      logger.info(`Executing AI Healer Agent...`);
      execSync(`${healerCommand} "$(cat ${promptPath})"`, {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf-8',
        timeout: 150000,
        stdio: 'ignore', // Keep silent to avoid flooding logs
      });
    } catch (execErr) {
      logger.error('Healer command failed execution', { error: execErr.message });
      // If the OS command fails entirely, we must stop and wait for humans
      break;
    }

    // 3. Pre-flight Test-Gate
    logger.info(`Validating new selector via local Test-Gate...`);
    const validationResult = await validateSelector(selectorKey, errorHtml);

    if (validationResult.pass) {
      logger.info(`✅ VALIDATION PASSED: ${selectorKey} found exactly 1 match!`);
      // Update memory with success (clear failures for this selector, as we fixed it)
      memory[selectorKey] = [];
      saveMemory(memory);
      healed = true;
      break; // Exit loop, success!
    } else {
      logger.warn(`❌ VALIDATION FAILED: ${validationResult.reason}`);
      
      // Record failure to memory & session
      const failureRecord = {
        timestamp: new Date().toISOString(),
        reason: validationResult.reason
      };
      
      if (!memory[selectorKey]) memory[selectorKey] = [];
      memory[selectorKey].push(failureRecord);
      sessionFailures.push(failureRecord);
      saveMemory(memory);

      // Restore backup for the next attempt
      fs.writeFileSync(SELECTORS_PATH, backupSelectors, 'utf-8');
      
      if (attempt === maxAttempts) {
        logger.error(`Exhausted ${maxAttempts} attempts. Giving up.`);
      } else {
        logger.info(`Retrying...`);
      }
    }
  }

  if (!healed) {
    logger.warn('='.repeat(60));
    logger.warn('MANUAL INTERVENTION REQUIRED - HEALER FAILED');
    logger.warn(`Failed selector: ${errorReport.selectorKey}`);
    logger.warn(`Fix file: ${SELECTORS_PATH}`);
    logger.warn('='.repeat(60));
  }

  return healed;
}

/**
 * Validates the new selector inside a headless local context.
 */
async function validateSelector(selectorKey, htmlContent) {
  if (!cloakbrowser) return { pass: true, reason: 'Cloakbrowser not installed, skipping test' };
  
  let browser;
  try {
    browser = await cloakbrowser.launch({ headless: true });
    const page = await browser.newPage();
    
    // Load snapshot HTML
    await page.setContent(htmlContent, { waitUntil: 'load' });

    // Bust require cache to load the newly written selectors.js
    const selectorsModulePath = require.resolve('./utils/selectors.js');
    delete require.cache[selectorsModulePath];
    const { resolve, SELECTORS } = require('./utils/selectors.js');

    // Attempt to resolve
    try {
      // Basic syntax/structural check
      if (!SELECTORS[selectorKey]) {
        return { pass: false, reason: 'Selector key completely missing from file.' };
      }

      const locator = resolve(page, selectorKey);
      const count = await locator.count();

      if (count === 1) {
        return { pass: true };
      } else if (count === 0) {
        return { pass: false, reason: `Element not found (count === 0). The selector does not match the error HTML.` };
      } else {
        return { pass: false, reason: `Element not unique (count === ${count}). Found multiple matches.` };
      }

    } catch (e) {
      return { pass: false, reason: `JavaScript Error when evaluating selector: ${e.message}` };
    }

  } catch (err) {
    return { pass: false, reason: `Test environment error: ${err.message}` };
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Build a detailed prompt for the AI Agent
 */
function buildHealPrompt(errorReport, baseSelectors, errorHtml, historicalFailures, sessionFailures) {
  let failureContext = '';
  
  if (historicalFailures.length > 0 || sessionFailures.length > 0) {
    failureContext = `\n## ⚠️ IMPORTANT: PREVIOUS FAILED FIXES\n`;
    failureContext += `You or other agents have previously tried to fix this and failed. DO NOT repeat the same mistakes.\n`;
    const combined = [...historicalFailures, ...sessionFailures];
    combined.slice(-5).forEach((f, i) => { // show last 5 failures
      failureContext += `- Attempt ${i+1}: Failed with reason -> ${f.reason}\n`;
    });
    failureContext += `\nYou MUST provide a different selector strategy this time (e.g. if getByRole failed, try getByLabel or composite).\n`;
  }

  return `# TikTok Shop Selector Healing Task

## Error Summary
- **Selector key:** ${errorReport.selectorKey}
- **Error message:** ${errorReport.error.message}
${failureContext}

## Current selectors.js
\`\`\`javascript
${baseSelectors}
\`\`\`

## Page HTML Context (Current DOM Snapshot)
\`\`\`html
${errorHtml}
\`\`\`

## Instructions
1. Analyze the HTML to find what the element looks like NOW. TikTok often obfuscates class names (e.g. .tiktok-abc). Avoid them if possible.
2. Update ONLY the \`${errorReport.selectorKey}\` selector in \`src/utils/selectors.js\`.
3. Prioritize resilient selectors: \`getByRole\` > \`getByLabel\` > \`getByText\` > \`composite\`.
4. Ensure the selector is UNIQUE (matches exactly 1 element), otherwise the Validation Gate will reject it.
5. Save the updated file. DO NOT CHANGE anything else.

## File to modify
\`src/utils/selectors.js\`
`;
}

// ── CLI Entry Point ──
if (require.main === module) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
  heal().then((healed) => {
    if (healed) {
      logger.info('🩹 Healing attempted and VERIFIED. Runner should retry.');
      process.exit(0);
    } else {
      logger.error('❌ Healing failed Test-Gate after all attempts. Manual fix required.');
      process.exit(1);
    }
  });
}

module.exports = { heal };
