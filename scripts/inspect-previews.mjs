import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.goto('http://localhost:3000/projects/stream-mart.png');
  await page.screenshot({ path: 'shots/inspect-streammart.png' });

  await page.goto('http://localhost:3000/videos/appforge/brag.jpg');
  await page.screenshot({ path: 'shots/inspect-appforge-brag.png' });

  await page.goto('http://localhost:3000/videos/sockets/brag.jpg');
  await page.screenshot({ path: 'shots/inspect-sockets-brag.png' });

  await browser.close();
  console.log('Saved inspection screenshots');
}

main().catch(console.error);
