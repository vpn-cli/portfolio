import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  const projectsTile = await page.$('.tile-projects');
  if (projectsTile) {
    const box = await projectsTile.boundingBox();
    console.log('ProjectsTile boundingBox:', box);
    await projectsTile.screenshot({ path: 'shots/current-projects-tile.png' });
  }

  const linksTile = await page.$('.tile-links');
  if (linksTile) {
    const box = await linksTile.boundingBox();
    console.log('LinksTile boundingBox:', box);
    await linksTile.screenshot({ path: 'shots/current-links-tile.png' });
  }

  const bentoGrid = await page.$('.bento-grid-root');
  if (bentoGrid) {
    const gridBox = await bentoGrid.boundingBox();
    console.log('bento-grid-root boundingBox:', gridBox);
  }

  const bentoOuter = await page.$('.bento-outer-container');
  if (bentoOuter) {
    const outerBox = await bentoOuter.boundingBox();
    console.log('bentoOuter boundingBox:', outerBox);
  }

  await browser.close();
}

main().catch(console.error);
