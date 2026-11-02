const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'shots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Zoomed-in stack row screenshots in light and dark mode (desktop & mobile)
  for (const theme of ['light', 'dark']) {
    for (const vp of [
      { name: '1440', width: 1440, height: 900 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      console.log(`Capturing Stack tile ${theme} ${vp.name}...`);
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      await page.goto(`http://localhost:3005/?theme=${theme}`, { waitUntil: 'load' });
      await page.waitForTimeout(1000);

      const tile = page.locator('.tile-stack').first();
      await tile.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const shotPath = path.join(outDir, `stack-${theme}-${vp.name}.png`);
      await tile.screenshot({ path: shotPath });
      console.log(`Saved ${shotPath}`);

      if (vp.name === '1440') {
        // Move mouse directly into one of the icons in the marquee to show hover glow & pause
        const box = await tile.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.65);
          await page.waitForTimeout(400);
          const hoverPath = path.join(outDir, `stack-hover-${theme}.png`);
          await tile.screenshot({ path: hoverPath });
          console.log(`Saved ${hoverPath}`);
        }
      }

      await page.close();
    }
  }

  // 2. Reduced motion screenshot (static grid)
  console.log('Capturing reduced-motion static wrapped grid...');
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto('http://localhost:3005/?theme=dark', { waitUntil: 'load' });
  await rmPage.waitForTimeout(1000);
  const rmTile = rmPage.locator('.tile-stack').first();
  await rmTile.scrollIntoViewIfNeeded();
  await rmPage.waitForTimeout(500);
  const rmPath = path.join(outDir, 'stack-reduced-motion.png');
  await rmTile.screenshot({ path: rmPath });
  console.log(`Saved ${rmPath}`);
  await rmContext.close();

  await browser.close();
  console.log('Stack captures completed!');
})();
