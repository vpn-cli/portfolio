import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'shots', 'contact-check');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function verify() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = {};

  try {
    // 1. Desktop 1440px Verification
    const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page1440.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page1440.waitForTimeout(1000);

    // Verify clock tile is gone
    const clockTileExists = await page1440.$('.tile-clock');
    results.clockTileRemoved = clockTileExists === null;

    // Verify grid bounding boxes on row 3
    const stackBox = await page1440.$eval('.tile-stack', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    const contactBox1440 = await page1440.$eval('.tile-contact', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    const byteBox1440 = await page1440.$eval('.tile-byte', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right };
    });

    results.stackBox1440 = stackBox;
    results.contactBox1440 = contactBox1440;
    // Contact right edge should align with Byte right edge (col 6)
    results.contactAlignedToCol6 = Math.abs((contactBox1440.x + contactBox1440.width) - (byteBox1440.x + byteBox1440.width)) < 2;
    results.row3HeightEqual = Math.abs(stackBox.height - contactBox1440.height) < 2;
    results.row3TopAligned = Math.abs(stackBox.y - contactBox1440.y) < 2;

    // Check live time text
    const liveTimeText = await page1440.$eval('.tile-contact', (el) => {
      const statusLine = el.querySelector('.min-h-\\[24px\\]') || el.querySelectorAll('div')[2];
      return statusLine ? statusLine.innerText : '';
    });
    results.liveTimeText = liveTimeText;

    // Check email visibility & ellipsis
    const emailInfo1440 = await page1440.$eval('.tile-contact button', (el) => {
      const style = window.getComputedStyle(el);
      return {
        text: el.innerText,
        textOverflow: style.textOverflow,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        isTruncated: el.scrollWidth > el.clientWidth,
      };
    });
    results.emailInfo1440 = emailInfo1440;

    // Check duplicate "Open to SDE roles" is NOT in contact tile
    const contactFullText = await page1440.$eval('.tile-contact', (el) => el.innerText);
    results.noDuplicateOpenToRoles = !contactFullText.includes('Open to SDE roles');

    // Screenshot Row 3 at 1440px (Dark mode)
    // We clip to the bottom row bounding box or take screenshots of .tile-contact
    const bottomRowClip1440 = {
      x: Math.min(stackBox.x, contactBox1440.x) - 10,
      y: Math.min(stackBox.y, contactBox1440.y) - 10,
      width: (contactBox1440.x + contactBox1440.width) - Math.min(stackBox.x, contactBox1440.x) + 20,
      height: Math.max(stackBox.height, contactBox1440.height) + 20,
    };
    await page1440.screenshot({
      path: path.join(outDir, 'bottom-row-1440px-dark.png'),
      clip: bottomRowClip1440,
    });
    const contactEl1440 = await page1440.$('.tile-contact');
    await contactEl1440.screenshot({ path: path.join(outDir, 'contact-card-1440px-dark.png') });

    // Test Copy Button Interaction
    const copyBtn = await page1440.$('button[aria-label*="Copy email"]');
    if (copyBtn) {
      await copyBtn.click();
      await page1440.waitForTimeout(200);
      results.copyButtonTextCopied = await page1440.$eval('button[aria-label*="copied" i], button[aria-label*="Copy email"]', (el) => el.innerText);
      // Wait for revert (1.5s timeout)
      await page1440.waitForTimeout(1600);
      results.copyButtonTextReverted = await page1440.$eval('button[aria-label*="Copy email"]', (el) => el.innerText);
    }

    // Switch to Light Mode at 1440px
    await page1440.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page1440.waitForTimeout(300);
    await page1440.screenshot({
      path: path.join(outDir, 'bottom-row-1440px-light.png'),
      clip: bottomRowClip1440,
    });
    await contactEl1440.screenshot({ path: path.join(outDir, 'contact-card-1440px-light.png') });
    await page1440.close();

    // 2. Tablet 1024px Verification
    const page1024 = await browser.newPage({ viewport: { width: 1024, height: 1050 } });
    await page1024.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page1024.waitForTimeout(1000);

    const stackBox1024 = await page1024.$eval('.tile-stack', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    const contactBox1024 = await page1024.$eval('.tile-contact', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    const byteBox1024 = await page1024.$eval('.tile-byte', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right };
    });

    results.stackBox1024 = stackBox1024;
    results.contactBox1024 = contactBox1024;
    results.contactAlignedToCol6Tablet = Math.abs((contactBox1024.x + contactBox1024.width) - (byteBox1024.x + byteBox1024.width)) < 2;

    const emailInfo1024 = await page1024.$eval('.tile-contact button', (el) => {
      const style = window.getComputedStyle(el);
      return {
        text: el.innerText,
        textOverflow: style.textOverflow,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        isTruncated: el.scrollWidth > el.clientWidth,
      };
    });
    results.emailInfo1024 = emailInfo1024;

    const bottomRowClip1024 = {
      x: Math.min(stackBox1024.x, contactBox1024.x) - 10,
      y: Math.min(stackBox1024.y, contactBox1024.y) - 10,
      width: (contactBox1024.x + contactBox1024.width) - Math.min(stackBox1024.x, contactBox1024.x) + 20,
      height: Math.max(stackBox1024.height, contactBox1024.height) + 20,
    };
    await page1024.screenshot({
      path: path.join(outDir, 'bottom-row-1024px-dark.png'),
      clip: bottomRowClip1024,
    });
    const contactEl1024 = await page1024.$('.tile-contact');
    await contactEl1024.screenshot({ path: path.join(outDir, 'contact-card-1024px-dark.png') });

    // Light Mode at 1024px
    await page1024.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page1024.waitForTimeout(300);
    await page1024.screenshot({
      path: path.join(outDir, 'bottom-row-1024px-light.png'),
      clip: bottomRowClip1024,
    });
    await contactEl1024.screenshot({ path: path.join(outDir, 'contact-card-1024px-light.png') });
    await page1024.close();

    // 3. Mobile 390px Verification
    const page390 = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page390.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page390.waitForTimeout(1000);

    const emailBox390 = await page390.$eval('.tile-contact button[title="Click to copy email address"]', (el) => {
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        fontSize: style.fontSize,
        textOverflow: style.textOverflow,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        isTruncated: el.scrollWidth > el.clientWidth,
      };
    });
    const copyBtnBox390 = await page390.$eval('.tile-contact button[aria-label*="Copy email"]', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    // Check that email sits above copy button
    results.emailAboveCopyMobile = emailBox390.y + emailBox390.height <= copyBtnBox390.y + 2;
    results.emailInfo390 = emailBox390;

    const contactEl390 = await page390.$('.tile-contact');
    await contactEl390.scrollIntoViewIfNeeded();
    await page390.waitForTimeout(500);

    await page390.screenshot({
      path: path.join(outDir, 'bottom-row-390px-dark.png'),
    });
    await contactEl390.screenshot({ path: path.join(outDir, 'contact-card-390px-dark.png') });

    // Light Mode at 390px
    await page390.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page390.waitForTimeout(300);
    await page390.screenshot({
      path: path.join(outDir, 'bottom-row-390px-light.png'),
    });
    await contactEl390.screenshot({ path: path.join(outDir, 'contact-card-390px-light.png') });
    await page390.close();

    // 4. Night Mode / Sun-Moon swap verification with mockHour=23
    const pageNight = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageNight.goto('http://localhost:3000?mockHour=23', { waitUntil: 'networkidle' });
    await pageNight.waitForTimeout(1000);

    const nightTimeText = await pageNight.$eval('.tile-contact', (el) => {
      const statusLine = el.querySelector('.min-h-\\[24px\\]') || el.querySelectorAll('div')[2];
      return statusLine ? statusLine.innerText : '';
    });
    const nightHasMoon = await pageNight.$eval('.tile-contact', (el) => {
      return el.querySelector('svg.lucide-moon') !== null;
    });
    results.nightTimeText = nightTimeText;
    results.nightHasMoon = nightHasMoon;

    const contactElNight = await pageNight.$('.tile-contact');
    await contactElNight.screenshot({ path: path.join(outDir, 'contact-card-night-mode-mock.png') });
    await pageNight.close();

    // 5. Day mode verification check
    const pageDay = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDay.goto('http://localhost:3000?mockHour=10', { waitUntil: 'networkidle' });
    await pageDay.waitForTimeout(1000);

    const dayTimeText = await pageDay.$eval('.tile-contact', (el) => {
      const statusLine = el.querySelector('.min-h-\\[24px\\]') || el.querySelectorAll('div')[2];
      return statusLine ? statusLine.innerText : '';
    });
    const dayHasSun = await pageDay.$eval('.tile-contact', (el) => {
      return el.querySelector('svg.lucide-sun') !== null;
    });
    results.dayTimeText = dayTimeText;
    results.dayHasSun = dayHasSun;
    await pageDay.close();

    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
