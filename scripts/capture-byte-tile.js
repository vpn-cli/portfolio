const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'shots', 'byte-tile');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const theme of ['dark', 'light']) {
    await page.goto(`http://localhost:3002/?theme=${theme}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Allow 3D canvas and idle float to render

    const byteTile = page.locator('.tile-byte');
    await byteTile.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const shotPath = path.join(outDir, `byte-tile-initial-${theme}.png`);
    await byteTile.screenshot({ path: shotPath });
    console.log(`Saved screenshot: ${shotPath}`);
  }

  await browser.close();
})();

