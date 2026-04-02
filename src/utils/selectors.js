/**
 * TikTok Shop Selectors — Single Source of Truth
 * 
 * AI Healer modifies ONLY this file when TikTok changes their DOM.
 * Each selector uses Playwright's recommended locator strategies:
 * - getByRole, getByLabel, getByPlaceholder (most resilient)
 * - locator with CSS (fallback)
 * 
 * Format: { method, value, options?, scope? }
 *   method  — Playwright method name
 *   value   — Primary argument
 *   options — Additional options object (e.g., { name: 'Button' })
 *   scope   — If set, locator is scoped inside this parent selector first
 */

const SELECTORS = {
  // ============================================================
  // STEP 1: SEARCH
  // ============================================================
  SEARCH_INPUT: {
    method: 'getByPlaceholder',
    value: 'Search products, hashtags, or creators...',
    description: 'Search bar at the top of Creator Marketplace',
  },

  // ============================================================
  // STEP 2: SAVE CREATOR (from search results table)
  // ============================================================
  FIRST_ROW: {
    method: 'locator',
    value: 'table tbody tr',
    description: 'First row in creator search results table',
    index: 0, // .first()
  },
  SAVE_BUTTON: {
    method: 'locator',
    value: 'button',
    description: 'Save/bookmark button in the first result row',
    scope: 'FIRST_ROW',
    index: 1, // .nth(1) — second button in the row
  },

  // ============================================================
  // STEP 3: OPEN SAVED CREATORS & SELECT
  // ============================================================
  SAVED_CREATORS_BTN: {
    method: 'getByRole',
    value: 'button',
    options: { name: 'Saved creators' },
    description: 'Button to open Saved Creators drawer',
  },
  DRAWER: {
    method: 'locator',
    value: 'div[role="dialog"]',
    description: 'The slide-out drawer/dialog for saved creators',
  },
  DRAWER_CHECKBOX: {
    method: 'locator',
    value: 'input[type="checkbox"]',
    description: 'First checkbox inside the saved creators drawer',
    scope: 'DRAWER',
    index: 0,
  },
  DRAWER_INVITE_BTN: {
    method: 'getByRole',
    value: 'button',
    options: { name: /Invite/ },
    description: 'Invite button inside the saved creators drawer',
    scope: 'DRAWER',
  },

  // ============================================================
  // STEP 4: INVITE FORM
  // ============================================================
  INVITE_MODAL_TITLE: {
    method: 'locator',
    value: 'text="Invite creators"',
    description: 'Title of the invite modal — used to wait for modal to appear',
  },
  PRODUCT_DISTRIBUTION_RADIO: {
    method: 'getByLabel',
    value: 'Inviting the creator for product distribution',
    description: 'Radio button for invite type',
  },
  MESSAGE_TEXTAREA: {
    method: 'locator',
    value: 'textarea',
    description: 'Textarea for invite message',
  },
  ZALO_INPUT: {
    method: 'composite',
    steps: [
      { method: 'locator', value: 'div' },
      { method: 'filter', options: { hasText: /^Zalo$/ } },
      { method: 'locator', value: 'input' },
    ],
    description: 'Zalo contact input field',
  },
  PHONE_INPUT: {
    method: 'composite',
    steps: [
      { method: 'locator', value: 'div' },
      { method: 'filter', options: { hasText: /^Phone number \(optional\)$/ } },
      { method: 'locator', value: 'input' },
    ],
    description: 'Phone number input field',
  },

  // ============================================================
  // STEP 5: SUBMIT
  // ============================================================
  SEND_INVITE_BTN: {
    method: 'getByRole',
    value: 'button',
    options: { name: 'Send invite' },
    description: 'Final submit button to send the invite',
  },
};

/**
 * Resolve a selector definition into a Playwright locator on the given page.
 * Handles: getByRole, getByLabel, getByPlaceholder, locator, filter, composite
 * 
 * @param {import('playwright').Page} page — Playwright page instance
 * @param {string} selectorKey — Key from SELECTORS object
 * @returns {import('playwright').Locator}
 */
function resolve(page, selectorKey) {
  const sel = SELECTORS[selectorKey];
  if (!sel) throw new Error(`Unknown selector: ${selectorKey}`);

  // Composite selectors chain multiple steps
  if (sel.method === 'composite') {
    let locator = page;
    for (const step of sel.steps) {
      if (step.method === 'filter') {
        locator = locator.filter(step.options);
      } else {
        locator = locator[step.method](step.value, step.options || {});
      }
    }
    return locator;
  }

  // Scoped selectors resolve parent first
  let base = page;
  if (sel.scope) {
    base = resolve(page, sel.scope);
  }

  // Standard Playwright methods
  let locator;
  switch (sel.method) {
    case 'getByRole':
      locator = base.getByRole(sel.value, sel.options || {});
      break;
    case 'getByLabel':
      locator = base.getByLabel(sel.value);
      break;
    case 'getByPlaceholder':
      locator = base.getByPlaceholder(sel.value);
      break;
    case 'getByText':
      locator = base.getByText(sel.value, sel.options || {});
      break;
    case 'locator':
      locator = base.locator(sel.value);
      break;
    default:
      throw new Error(`Unsupported selector method: ${sel.method}`);
  }

  // Apply index (first, nth) if specified
  if (sel.index !== undefined) {
    locator = sel.index === 0 ? locator.first() : locator.nth(sel.index);
  }

  return locator;
}

module.exports = { SELECTORS, resolve };
