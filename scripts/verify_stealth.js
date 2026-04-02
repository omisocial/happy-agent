

(async () => {
  const { launch } = await import('cloakbrowser');
  console.log('🚀 Spawning CloakBrowser stealth profile...');
  // CloakBrowser will download the ~200MB binary if it does not exist locally.
  const browser = await launch({ 
    humanize: true,
    humanPreset: 'careful',
    headless: false // Run headed so user can observe if needed
  });
  
  const page = await browser.newPage();

  try {
    console.log('🌐 Visiting BrowserScan Bot Detection Test...');
    await page.goto('https://www.browserscan.net/bot-detection', { waitUntil: 'load' });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'test_browserscan.png' });
    console.log('✅ BrowserScan screenshot saved.');

    console.log('🌐 Visiting CreepJS fingerprint test...');
    await page.goto('https://abrahamjuliot.github.io/creepjs/', { waitUntil: 'load' });
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'test_creepjs.png' });
    console.log('✅ CreepJS screenshot saved.');

  } catch (e) {
    console.error('❌ Test failed:', e);
  } finally {
    await browser.close();
    console.log('🛑 Stealth Browser Closed. Check the test_*.png files in the root folder.');
  }
})();
