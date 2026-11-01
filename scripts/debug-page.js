const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001');

  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  console.log('HTML snippet:', (await page.content()).slice(0, 1000));

  await browser.close();
})();
