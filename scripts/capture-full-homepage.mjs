import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme
      });

      await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      // Force theme class on <html> if necessary to guarantee theme rendering
      if (theme === 'dark') {
        await page.evaluate(() => {
          document.documentElement.classList.add('dark');
        });
      } else {
        await page.evaluate(() => {
          document.documentElement.classList.remove('dark');
        });
      }
      await page.waitForTimeout(500);

      const filename = `shots/full-homepage-${vp.name}-${theme}.png`;
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`Saved ${filename}`);
      await page.close();
    }
  }

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
