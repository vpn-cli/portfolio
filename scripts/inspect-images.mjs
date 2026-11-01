import { chromium } from 'playwright-core';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  const images = [
    'public/videos/appforge/brag.jpg',
    'public/videos/sockets/brag.jpg',
    'public/projects/stream-mart.png',
    'public/stageshow-sockets-dark.png',
    'public/projects/appforge-live.png',
  ];

  for (const img of images) {
    const abs = path.resolve(process.cwd(), img).replace(/\\/g, '/');
    await page.setContent(`<img id="target" src="file:///${abs}" />`);
    const dims = await page.evaluate(() => {
      const el = document.getElementById('target');
      return { width: el.naturalWidth, height: el.naturalHeight };
    });
    console.log(img, dims);
  }
  await browser.close();
}

main().catch(console.error);
