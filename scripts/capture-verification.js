const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const shotsDir = path.join(process.cwd(), 'shots');
  if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });

  console.log('1. Taking Screenshots (Desktop & Mobile, Dark & Light)...');

  // Desktop (1440x900)
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1500);

  // Desktop Dark
  await desktopPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(shotsDir, 'homepage-desktop-dark.png') });
  console.log('Captured homepage-desktop-dark.png');

  // Desktop Light
  await desktopPage.evaluate(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(shotsDir, 'homepage-desktop-light.png') });
  console.log('Captured homepage-desktop-light.png');
  await desktopPage.close();

  // Mobile (390x844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);

  // Mobile Dark
  await mobilePage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(shotsDir, 'homepage-mobile-dark.png'), fullPage: true });
  console.log('Captured homepage-mobile-dark.png');

  // Mobile Light
  await mobilePage.evaluate(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(shotsDir, 'homepage-mobile-light.png'), fullPage: true });
  console.log('Captured homepage-mobile-light.png');
  await mobilePage.close();

  // Project Pages Screenshots
  console.log('1b. Taking Project Pages Screenshots (Desktop, Dark & Light)...');
  const projPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // /projects (dark)
  await projPage.goto('http://localhost:3000/projects', { waitUntil: 'networkidle' });
  await projPage.waitForTimeout(1000);
  await projPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await projPage.waitForTimeout(500);
  await projPage.screenshot({ path: path.join(shotsDir, 'projects-desktop-dark.png') });
  console.log('Captured projects-desktop-dark.png');

  // /projects (light)
  await projPage.evaluate(() => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await projPage.waitForTimeout(500);
  await projPage.screenshot({ path: path.join(shotsDir, 'projects-desktop-light.png') });
  console.log('Captured projects-desktop-light.png');

  // /work/sockets (dark)
  await projPage.goto('http://localhost:3000/work/sockets', { waitUntil: 'networkidle' });
  await projPage.waitForTimeout(1000);
  await projPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await projPage.waitForTimeout(500);
  await projPage.screenshot({ path: path.join(shotsDir, 'work-sockets-desktop-dark.png') });
  console.log('Captured work-sockets-desktop-dark.png');

  // /work/appforge (dark)
  await projPage.goto('http://localhost:3000/work/appforge', { waitUntil: 'networkidle' });
  await projPage.waitForTimeout(1000);
  await projPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await projPage.waitForTimeout(500);
  await projPage.screenshot({ path: path.join(shotsDir, 'work-appforge-desktop-dark.png') });
  console.log('Captured work-appforge-desktop-dark.png');

  await projPage.close();

  console.log('2. Recording 3D Keycap Interaction Video...');
  const videoDir = path.join(shotsDir, 'video-temp');
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const recContext = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 800 },
    },
    viewport: { width: 1280, height: 800 },
  });

  const recPage = await recContext.newPage();
  await recPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await recPage.waitForTimeout(1200);

  // Ensure dark mode for cinematic video
  await recPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await recPage.waitForTimeout(800);

  const keycapTile = recPage.locator('.tile-keycap');
  await keycapTile.scrollIntoViewIfNeeded();
  await recPage.waitForTimeout(500);

  const box = await keycapTile.boundingBox();
  if (box) {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    // Hover into the keycap tile
    await recPage.mouse.move(box.x + 20, box.y + 20);
    await recPage.waitForTimeout(400);

    // Hover across to show tilt toward cursor
    await recPage.mouse.move(cx - 40, cy - 30, { steps: 15 });
    await recPage.waitForTimeout(300);
    await recPage.mouse.move(cx + 40, cy + 30, { steps: 15 });
    await recPage.waitForTimeout(300);
    await recPage.mouse.move(cx, cy, { steps: 10 });
    await recPage.waitForTimeout(400);

    // Click 1 (Squash and bounce back with overshoot)
    await recPage.mouse.down();
    await recPage.waitForTimeout(120);
    await recPage.mouse.up();
    await recPage.waitForTimeout(500);

    // Click 2 (Delightful double press)
    await recPage.mouse.down();
    await recPage.waitForTimeout(120);
    await recPage.mouse.up();
    await recPage.waitForTimeout(400);

    // Click 3
    await recPage.mouse.down();
    await recPage.waitForTimeout(120);
    await recPage.mouse.up();
    await recPage.waitForTimeout(500);

    // Drag to rotate keycap
    await recPage.mouse.move(cx, cy);
    await recPage.mouse.down();
    await recPage.waitForTimeout(100);
    await recPage.mouse.move(cx + 90, cy - 40, { steps: 20 });
    await recPage.waitForTimeout(200);
    await recPage.mouse.up(); // Release drag: inertia + ease back to resting angle
    await recPage.waitForTimeout(1000);

    // Drag another direction
    await recPage.mouse.move(cx, cy);
    await recPage.mouse.down();
    await recPage.waitForTimeout(100);
    await recPage.mouse.move(cx - 80, cy + 30, { steps: 20 });
    await recPage.waitForTimeout(150);
    await recPage.mouse.up();
    await recPage.waitForTimeout(1000);

    // Keyboard trigger (Focus and press Space)
    await keycapTile.focus();
    await recPage.waitForTimeout(400);
    await recPage.keyboard.press('Space');
    await recPage.waitForTimeout(600);
    await recPage.keyboard.press('Enter');
    await recPage.waitForTimeout(800);
  }

  // Close context to finalize video save
  await recPage.close();
  await recContext.close();

  // Find saved video file and rename to keycap-interaction.webm
  const videoFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const src = path.join(videoDir, videoFiles[0]);
    const dest = path.join(shotsDir, 'keycap-interaction.webm');
    fs.copyFileSync(src, dest);
    console.log(`Recorded video saved to ${dest}`);
  }

  await browser.close();
  console.log('Verification capture complete!');
})();
