import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  const cssInfo = await page.evaluate(() => {
    const root = document.querySelector('.bento-grid-root');
    const cs = window.getComputedStyle(root);
    return {
      innerWidth: window.innerWidth,
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
      styleSheetsCount: document.styleSheets.length
    };
  });
  console.log('cssInfo:', cssInfo);
  await browser.close();
}

main().catch(console.error);
