const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'shots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    for (const theme of ['light', 'dark']) {
      console.log(`Capturing full homepage ${vp.name} in ${theme} mode...`);
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });

      await page.goto(`http://localhost:3005/?theme=${theme}`, { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      if (theme === 'dark') {
        await page.evaluate(() => {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        });
      } else {
        await page.evaluate(() => {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        });
      }
      await page.waitForTimeout(600);

      const shotPath = path.join(outDir, `full-homepage-${vp.name}-${theme}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      console.log(`Saved ${shotPath}`);

      await page.close();
    }
  }

  await browser.close();
  console.log('All full homepage screenshots captured successfully.');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
