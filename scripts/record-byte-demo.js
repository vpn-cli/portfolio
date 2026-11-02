const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const videoDir = path.join(__dirname, '..', 'public', 'videos', 'byte');
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

(async () => {
  console.log('Launching browser for Byte interaction demo recording...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  const PORT = process.env.PORT || 3005;

  console.log(`Navigating to http://localhost:${PORT}/ ...`);
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const byteTile = page.locator('.tile-byte');
  await byteTile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const box = await byteTile.boundingBox();
  if (!box) {
    throw new Error('Byte tile bounding box not found!');
  }

  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  console.log('--- 1. Ambient Eye & Head Tracking ---');
  // Smooth sweep across screen
  await page.mouse.move(cx - 300, cy - 120, { steps: 20 });
  await page.waitForTimeout(400);
  await page.mouse.move(cx + 300, cy - 120, { steps: 25 });
  await page.waitForTimeout(400);
  await page.mouse.move(cx + 250, cy + 180, { steps: 20 });
  await page.waitForTimeout(400);
  await page.mouse.move(cx - 250, cy + 180, { steps: 20 });
  await page.waitForTimeout(500);

  console.log('--- 2. Link Hover Glance ---');
  // Hover over another tile / button on page
  const projectLink = page.locator('a[href*="github"], a[href*="linkedin"], button').first();
  if (await projectLink.count() > 0) {
    const lBox = await projectLink.boundingBox();
    if (lBox) {
      await page.mouse.move(lBox.x + lBox.width / 2, lBox.y + lBox.height / 2, { steps: 20 });
      await page.waitForTimeout(1000);
    }
  }

  console.log('--- 3. Hover Perk-Up ---');
  await page.mouse.move(cx, cy, { steps: 20 });
  await page.waitForTimeout(800);

  console.log('--- 4. Poke (Squash & Stretch + Hearts + "hehe") ---');
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(1500);

  console.log('--- 5. Double Click (Wave Arm + "hi!" Speech Bubble) ---');
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(150);
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(1800);

  console.log('--- 6. Rapid Pokes (4x -> Dizzy Spiral Eyes + Spin) ---');
  for (let i = 0; i < 4; i++) {
    await page.mouse.click(cx, cy);
    await page.waitForTimeout(110);
  }
  // Let dizzy spin and recovery head-shake play
  await page.waitForTimeout(2600);

  console.log('--- 7. Long Press (Charging Glow -> Happy 360 Spin Jump) ---');
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  // Hold for 900ms to trigger charging state
  await page.waitForTimeout(950);
  // Release to trigger big spin jump
  await page.mouse.up();
  await page.waitForTimeout(1800);

  console.log('--- 8. Drag + Fling Interaction ---');
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx - 60, cy + 10, { steps: 10 });
  await page.waitForTimeout(150);
  // Fling fast to the right
  await page.mouse.move(cx + 120, cy, { steps: 4 });
  await page.mouse.up();
  await page.waitForTimeout(2000);

  console.log('--- 9. Sleep State & Wakeup ---');
  // Trigger sleep via custom event
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('byte-sleep')));
  await page.waitForTimeout(2200);
  // Wake up with cursor movement
  await page.mouse.move(cx - 200, cy - 80, { steps: 15 });
  await page.waitForTimeout(1500);

  console.log('--- 10. Theme Toggle Reactions (Yawn / Stretch) ---');
  // Toggle to dark mode -> yawn reaction
  const themeToggle = page.locator('button[aria-label*="theme" i], button[title*="theme" i], .theme-toggle').first();
  if (await themeToggle.count() > 0) {
    await themeToggle.click();
    await page.waitForTimeout(1800);
    // Toggle back to light mode -> stretch reaction
    await themeToggle.click();
    await page.waitForTimeout(1800);
  }

  console.log('--- 11. "byte" Easter Egg (Happy Dance) ---');
  await page.mouse.move(cx, cy + 150); // move away from inputs
  await page.keyboard.type('byte', { delay: 100 });
  await page.waitForTimeout(2200);

  console.log('All demo steps completed! Finalizing video...');
  await page.close();
  await context.close();
  await browser.close();

  // Find latest recorded video and rename
  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    files.sort((a, b) => {
      return fs.statSync(path.join(videoDir, b)).mtimeMs - fs.statSync(path.join(videoDir, a)).mtimeMs;
    });
    const latest = files[0];
    const finalPath = path.join(videoDir, 'byte-interactions.webm');
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    fs.copyFileSync(path.join(videoDir, latest), finalPath);
    console.log(`Demo video successfully saved to: ${finalPath}`);
  }
})();
