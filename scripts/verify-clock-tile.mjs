import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'shots', 'clock');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // 1. Desktop Layout Verification
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  const stackBox = await page.$eval('.tile-stack', (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  const contactBox = await page.$eval('.tile-contact', (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  const clockBox = await page.$eval('.tile-clock', (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  const byteBox = await page.$eval('.tile-byte', (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  console.log('--- GRID ALIGNMENT CHECK ---');
  console.log('Stack Tile (cols 1-3):', stackBox);
  console.log('Contact Tile (cols 4-5):', contactBox);
  console.log('Clock Tile (col 6):', clockBox);
  console.log('Byte Tile (col 6 row 2):', byteBox);
  console.log('Clock X matches Byte X:', Math.abs(clockBox.x - byteBox.x) < 1);
  console.log('Clock Width matches Byte Width:', Math.abs(clockBox.width - byteBox.width) < 1);
  console.log('Stack + Contact + Clock aligned on Row 3:', Math.abs(stackBox.y - contactBox.y) < 2 && Math.abs(contactBox.y - clockBox.y) < 2);

  // Check live time text
  const liveClockText = await page.$eval('.tile-clock', (el) => el.innerText);
  console.log('Live Clock Tile text:\n', liveClockText);

  // 2. Desktop Screenshots in Dark and Light mode
  // Dark mode
  await page.screenshot({ path: path.join(outDir, 'desktop-dark.png') });
  const clockElDark = await page.$('.tile-clock');
  await clockElDark.screenshot({ path: path.join(outDir, 'tile-clock-dark-live.png') });

  // Light mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, 'desktop-light.png') });
  const clockElLight = await page.$('.tile-clock');
  await clockElLight.screenshot({ path: path.join(outDir, 'tile-clock-light-live.png') });

  // 3. Three Time-of-day States (Mocked) in Light and Dark
  const states = [
    { name: 'working-hours', time: '14:30', expected: 'Working hours · quick replies' },
    { name: 'evening', time: '20:15', expected: 'Evening · replies soon' },
    { name: 'night-asleep', time: '02:45', expected: 'Probably asleep · replies by morning' },
  ];

  for (const s of states) {
    // With visitor timezone America/New_York to verify offset
    await page.goto(`http://localhost:3000?mockTime=${s.time}&mockTz=America/New_York`);
    await page.waitForTimeout(1000);

    // Dark
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(300);
    const tileDark = await page.$('.tile-clock');
    await tileDark.screenshot({ path: path.join(outDir, `tile-${s.name}-dark.png`) });

    // Light
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(300);
    const tileLight = await page.$('.tile-clock');
    await tileLight.screenshot({ path: path.join(outDir, `tile-${s.name}-light.png`) });

    const statusText = await page.$eval('.tile-clock', (el) => el.innerText);
    console.log(`State [${s.name}]: contains expected status?`, statusText.includes(s.expected));
  }

  // 4. Mobile (390x844) Screenshots in Dark & Light
  await page.close();
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForTimeout(2000);

  // Mobile Dark
  await mobilePage.screenshot({ path: path.join(outDir, 'mobile-dark-full.png'), fullPage: true });

  // Mobile Light
  await mobilePage.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(outDir, 'mobile-light-full.png'), fullPage: true });

  // 5. Tablet (768x1024) Screenshots in Dark & Light
  await mobilePage.close();
  const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await tabletPage.goto('http://localhost:3000');
  await tabletPage.waitForTimeout(2000);

  // Tablet Dark
  await tabletPage.screenshot({ path: path.join(outDir, 'tablet-dark-full.png'), fullPage: true });

  // Tablet Light
  await tabletPage.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await tabletPage.waitForTimeout(500);
  await tabletPage.screenshot({ path: path.join(outDir, 'tablet-light-full.png'), fullPage: true });

  await tabletPage.close();
  await browser.close();
  console.log('All verification checks and screenshots completed!');
}

main().catch(console.error);
