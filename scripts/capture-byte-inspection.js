const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'shots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  for (const theme of ['light', 'dark']) {
    for (const vp of [
      { name: '1440', width: 1440, height: 900 },
      { name: '1024', width: 1024, height: 768 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.goto(`http://localhost:3005/?theme=${theme}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.tile-byte', { timeout: 10000 });
      await page.waitForTimeout(1000);

      const byteTile = page.locator('.tile-byte');
      await byteTile.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);

      const shotPath = path.join(outDir, `byte-${theme}-${vp.name}.png`);
      await byteTile.screenshot({ path: shotPath });
      console.log(`Saved ${shotPath}`);

      if (vp.name === '1440') {
        const fullPath = path.join(outDir, `full-${theme}-1440.png`);
        await page.screenshot({ path: fullPath });
        console.log(`Saved ${fullPath}`);
      }

      await context.close();
    }
  }

  await browser.close();
  console.log('Capture finished!');
})();
