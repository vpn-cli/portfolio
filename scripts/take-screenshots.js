const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    
    // Dark mode
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `references/result-${vp.name}-dark.png`, fullPage: vp.name !== 'desktop' });

    // Light mode
    await page.evaluate(() => {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `references/result-${vp.name}-light.png`, fullPage: vp.name !== 'desktop' });

    await page.close();
  }

  await browser.close();
  console.log('Screenshots taken successfully!');
})();
