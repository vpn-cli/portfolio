const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const videoDir = path.join(__dirname, '..', 'public', 'videos', 'byte');
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  async function runDemoForTheme(theme) {
    console.log(`Starting Byte demo in ${theme} mode...`);
    await page.goto(`http://localhost:3002/?theme=${theme}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const byteTile = page.locator('.tile-byte');
    await byteTile.scrollIntoViewIfNeeded();
    const box = await byteTile.boundingBox();
    if (!box) {
      console.error('Byte tile bounding box not found!');
      return;
    }

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // 1. Eye Tracking: Smooth circular / diagonal gaze movements across page
    console.log(' - Eye tracking demo');
    await page.mouse.move(centerX - 350, centerY - 150, { steps: 20 });
    await page.waitForTimeout(400);
    await page.mouse.move(centerX + 350, centerY - 150, { steps: 25 });
    await page.waitForTimeout(400);
    await page.mouse.move(centerX + 300, centerY + 200, { steps: 25 });
    await page.waitForTimeout(400);
    await page.mouse.move(centerX - 300, centerY + 200, { steps: 25 });
    await page.waitForTimeout(400);

    // 2. Hover: Move cursor directly over Byte (perks up!)
    console.log(' - Hover perk up');
    await page.mouse.move(centerX, centerY, { steps: 20 });
    await page.waitForTimeout(700);

    // 3. Poke: Click once -> Squish, happy "^ ^" eyes, floating hearts!
    console.log(' - Poke reaction');
    await page.mouse.click(centerX, centerY);
    await page.waitForTimeout(1400);

    // 4. Drag: Rotate Byte slightly with inertia
    console.log(' - Drag interaction');
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 70, centerY - 20, { steps: 15 });
    await page.waitForTimeout(200);
    await page.mouse.up();
    await page.waitForTimeout(1000);

    // 5. Rapid pokes: 4 quick clicks -> Dizzy spirals + wobbly spin!
    console.log(' - Rapid pokes (dizzy)');
    await page.mouse.click(centerX, centerY);
    await page.waitForTimeout(120);
    await page.mouse.click(centerX, centerY);
    await page.waitForTimeout(120);
    await page.mouse.click(centerX, centerY);
    await page.waitForTimeout(120);
    await page.mouse.click(centerX, centerY);
    // Observe dizzy spin & recovery
    await page.waitForTimeout(2600);

    // 6. Sleep: trigger sleepy state
    console.log(' - Sleep state');
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('byte-sleep')));
    await page.waitForTimeout(2200);

    // 7. Wake up: Move cursor across screen -> Startled hop & wake!
    console.log(' - Wake up');
    await page.mouse.move(centerX + 250, centerY - 100, { steps: 15 });
    await page.waitForTimeout(1400);
  }

  // Run Dark Mode demo
  await runDemoForTheme('dark');

  // Run Light Mode demo
  await runDemoForTheme('light');

  console.log('Demo completed! Closing page and saving video...');
  await page.close();
  await context.close();
  await browser.close();

  // Find the saved video file and rename to byte-demo.webm
  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latest = files[files.length - 1];
    const finalPath = path.join(videoDir, 'byte-demo.webm');
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    fs.renameSync(path.join(videoDir, latest), finalPath);
    console.log(`Video saved successfully: ${finalPath}`);
  }
})();

