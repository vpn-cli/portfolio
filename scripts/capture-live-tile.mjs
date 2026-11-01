import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(1000);

  const tile = await page.$('.tile-projects');
  if (tile) {
    await tile.screenshot({ path: 'shots/live-3001-projects.png' });
    console.log('Saved shots/live-3001-projects.png');
  }

  const links = await page.$('.tile-links');
  if (links) {
    await links.screenshot({ path: 'shots/live-3001-links.png' });
    console.log('Saved shots/live-3001-links.png');
  }

  await page.screenshot({ path: 'shots/live-3001-page.png' });

  await browser.close();
}

main().catch(console.error);
