import { chromium } from 'playwright-core';
import fs from 'node:fs';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '1280', width: 1280, height: 800 },
    { name: '1024', width: 1024, height: 768 },
    { name: '768', width: 768, height: 1024 },
    { name: '390', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    for (const theme of ['dark', 'light']) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto('http://localhost:3000');
      await page.evaluate((t) => {
        if (t === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      }, theme);
      await page.waitForTimeout(600);

      const tile = await page.$('.tile-projects');
      if (tile) {
        await tile.screenshot({ path: `shots/diag-tile-${vp.name}-${theme}.png` });
      }
      await page.screenshot({ path: `shots/diag-page-${vp.name}-${theme}.png` });
      await page.close();
    }
  }

  await browser.close();
  console.log('Diagnostic screenshots saved!');
}

main().catch(console.error);
