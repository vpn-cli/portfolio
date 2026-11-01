const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'shots', 'links-tile');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: '1440px', width: 1440, height: 900 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1024px', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  for (const theme of ['dark', 'light']) {
    const page = await browser.newPage();
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:3002/?theme=${theme}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const linksTile = page.locator('.tile-links');
      await linksTile.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const shotPath = path.join(outDir, `links-tile-${vp.name}-${theme}.png`);
      await linksTile.screenshot({ path: shotPath });
      console.log(`Saved screenshot: links-tile-${vp.name}-${theme}.png`);
    }
    await page.close();
  }

  await browser.close();
  console.log('All 8 Links tile screenshots captured successfully!');
})();
