const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'shots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  for (const vp of [
    { name: '1440', width: 1440, height: 900 },
    { name: '1024', width: 1024, height: 768 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3005/?theme=light', { waitUntil: 'load' });
    await page.waitForTimeout(1000);

    const linksTile = page.locator('.tile-links, [aria-label="Profiles and Résumé Links"]').first();
    await linksTile.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const shotPath = path.join(outDir, `links-${vp.name}.png`);
    await linksTile.screenshot({ path: shotPath });
    console.log(`Saved ${shotPath}`);
    await page.close();
  }

  await browser.close();
  console.log('Links tile captures complete!');
})();
