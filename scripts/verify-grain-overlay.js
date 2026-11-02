const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'shots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  // 1. Proof screenshot with opacity temporarily at 0.5
  console.log('Capturing proof screenshot with grain opacity at 0.5...');
  const page1 = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  await page1.goto('http://localhost:3005/?theme=light', { waitUntil: 'load' });
  await page1.waitForTimeout(1000);
  
  // Temporarily force grain opacity to 0.5
  await page1.evaluate(() => {
    document.documentElement.style.setProperty('--grain-opacity', '0.5');
  });
  await page1.waitForTimeout(500);
  const shot05 = path.join(outDir, 'grain-proof-0.5.png');
  await page1.screenshot({ path: shot05 });
  console.log(`Saved ${shot05}`);
  await page1.close();

  // 2. Final values at 200% zoom in both themes
  for (const theme of ['light', 'dark']) {
    console.log(`Capturing 200% zoom grain crop for ${theme} theme...`);
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:3005/?theme=${theme}`, { waitUntil: 'load' });
    await page.waitForTimeout(1000);

    // Zoom 200% into top-left canvas area
    const shotPath = path.join(outDir, `grain-final-${theme}-200.png`);
    await page.screenshot({
      path: shotPath,
      clip: { x: 40, y: 40, width: 300, height: 300 },
    });
    console.log(`Saved ${shotPath}`);
    await page.close();
  }

  await browser.close();
  console.log('Grain verification finished!');
})();
