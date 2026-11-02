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
    console.log(`Capturing Selected Work tile in ${theme} mode...`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:3005/?theme=${theme}`, { waitUntil: 'load' });
    await page.waitForTimeout(1200);

    const workTile = page.locator('.tile-projects');
    await workTile.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Initial state (first row active)
    const shotPath = path.join(outDir, `selected-work-${theme}.png`);
    await workTile.screenshot({ path: shotPath });
    console.log(`Saved ${shotPath}`);

    // Hover second row (StreamMart)
    const rows = workTile.locator('.group\\/row');
    if (await rows.count() > 1) {
      await rows.nth(1).hover();
      await page.waitForTimeout(600);
      const hoverPath = path.join(outDir, `selected-work-hover-${theme}.png`);
      await workTile.screenshot({ path: hoverPath });
      console.log(`Saved ${hoverPath}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('Selected Work captures complete!');
})();
