const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tempDir = path.join(__dirname, '..', 'shots', 'video-temp');
const outDir = path.join(__dirname, '..', 'public', 'videos');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  console.log('Starting Playwright recording for 3D Cat Companion...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: tempDir,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // 1. Page load
  console.log('Step 1: Page load (Light mode)...');
  await page.goto('http://localhost:3000/?theme=light', { waitUntil: 'domcontentloaded' });
  const tile = page.locator('.tile-byte');
  await tile.waitFor({ state: 'visible', timeout: 10000 });
  await tile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const box = await tile.boundingBox();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  // 2. Idle tracking
  console.log('Step 2: Idle gaze tracking...');
  await page.mouse.move(centerX - 150, centerY - 60, { steps: 15 });
  await page.waitForTimeout(600);
  await page.mouse.move(centerX + 150, centerY - 60, { steps: 15 });
  await page.waitForTimeout(600);
  await page.mouse.move(centerX, centerY, { steps: 12 });
  await page.waitForTimeout(800);

  // 3. Poke reaction
  console.log('Step 3: Poke (click) reaction...');
  await page.mouse.click(centerX, centerY);
  await page.waitForTimeout(1600);

  // 4. Theme toggle
  console.log('Step 4: Theme toggle (switching to Dark mode)...');
  const themeBtn = page.locator('button[aria-label^="Switch to"]');
  await themeBtn.click();
  await page.waitForTimeout(1500);

  // Idle and poke in dark mode
  await page.mouse.move(centerX + 120, centerY - 40, { steps: 12 });
  await page.waitForTimeout(600);
  await page.mouse.click(centerX, centerY);
  await page.waitForTimeout(1600);

  // 5. Window resize tests
  console.log('Step 5: Window resize (1280 -> 1024 -> 768)...');
  await page.setViewportSize({ width: 1024, height: 720 });
  await tile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  await page.setViewportSize({ width: 768, height: 900 });
  await tile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  await page.setViewportSize({ width: 1280, height: 720 });
  await tile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  console.log('Finished interaction sequence. Closing context to finalize recording...');
  await page.close();
  await context.close();
  await browser.close();

  // Find latest recorded video in tempDir
  const videoFiles = fs.readdirSync(tempDir)
    .filter(f => f.endsWith('.webm'))
    .map(f => ({ name: f, time: fs.statSync(path.join(tempDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);

  if (videoFiles.length > 0) {
    const rawWebm = path.join(tempDir, videoFiles[0].name);
    const targetWebm = path.join(outDir, 'cat-companion-demo.webm');
    const targetMp4 = path.join(outDir, 'cat-companion-demo.mp4');

    fs.copyFileSync(rawWebm, targetWebm);
    console.log(`Saved WebM video: ${targetWebm}`);

    try {
      execSync(`ffmpeg -y -i "${rawWebm}" -c:v libx264 -pix_fmt yuv420p "${targetMp4}"`, { stdio: 'inherit' });
      console.log(`Saved MP4 video: ${targetMp4}`);
    } catch (e) {
      console.warn('FFmpeg conversion note:', e.message);
    }
  }

  console.log('Recording complete!');
})();

