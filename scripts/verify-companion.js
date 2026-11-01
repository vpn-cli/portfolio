const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'shots', 'companion-verification');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1024', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  for (const theme of ['light', 'dark']) {
    for (const vp of viewports) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:3000/?theme=${theme}`, { waitUntil: 'domcontentloaded' });
      
      const tile = page.locator('.tile-byte');
      await tile.waitFor({ state: 'visible', timeout: 10000 });
      await tile.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      
      const shotPath = path.join(outDir, `tile-${vp.name}-${theme}.png`);
      await tile.screenshot({ path: shotPath });
      console.log('Saved:', shotPath);
      await page.close();
    }
  }
  
  await browser.close();
  console.log('All verification screenshots saved successfully!');
})();
