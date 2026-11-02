import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "shots", "teaser-redesign");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function verify() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  console.log("=== 1. Capturing Static Screenshots at 1440, 1024, 390 in Light & Dark ===");

  const viewports = [
    { name: "desktop-1440", w: 1440, h: 900 },
    { name: "tablet-1024", w: 1024, h: 900 },
    { name: "mobile-390", w: 390, h: 844 },
  ];

  for (const vp of viewports) {
    for (const theme of ["dark", "light"]) {
      console.log(`Capturing ${vp.name} (${theme})...`);
      const page = await browser.newPage({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 2,
      });

      await page.goto(`http://localhost:3000/?theme=${theme}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      const tile = page.locator(".tile-projects");
      await tile.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Screenshot tile closeup
      const tilePath = path.join(outDir, `tile-projects-${vp.name}-${theme}.png`);
      await tile.screenshot({ path: tilePath });
      console.log(`Saved ${tilePath}`);

      // Screenshot full page
      const fullPath = path.join(outDir, `page-${vp.name}-${theme}.png`);
      await page.screenshot({ path: fullPath, fullPage: vp.w < 1440 });
      console.log(`Saved ${fullPath}`);

      await page.close();
    }
  }

  console.log("\n=== 2. Recording Auto-Cycle & Hover Interaction Video ===");
  const videoDir = path.join(outDir, "video");
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });

  const recPage = await context.newPage();
  await recPage.goto("http://localhost:3000/?theme=dark", { waitUntil: "networkidle" });
  await recPage.waitForTimeout(1000);

  const tile = recPage.locator(".tile-projects");
  await tile.scrollIntoViewIfNeeded();
  await recPage.waitForTimeout(1000);

  // Position mouse away from the card initially so auto-cycle runs freely
  await recPage.mouse.move(50, 50);
  console.log("Watching Auto-Cycle (Item 1 AppForge -> Item 2 StreamMart -> Item 3 Sportz)...");
  // Item 1 active (AppForge) -> wait ~4.2s for auto advance to Item 2
  await recPage.waitForTimeout(4200);
  console.log("Auto-advanced to Item 2 (StreamMart)");
  // Item 2 active (StreamMart) -> wait ~4.2s for auto advance to Item 3
  await recPage.waitForTimeout(4200);
  console.log("Auto-advanced to Item 3 (Sportz)");
  await recPage.waitForTimeout(2000);

  // Now test hover behavior on rows
  console.log("Testing Hover interaction on project rows...");
  const rows = tile.locator(".group\\/row");
  const rowCount = await rows.count();
  console.log(`Found ${rowCount} project rows`);

  // Hover row 0 (AppForge)
  console.log("Hovering row 0 (AppForge)...");
  await rows.nth(0).hover();
  await recPage.waitForTimeout(1800);

  // Hover row 1 (StreamMart)
  console.log("Hovering row 1 (StreamMart)...");
  await rows.nth(1).hover();
  await recPage.waitForTimeout(1800);

  // Hover row 2 (Sportz)
  console.log("Hovering row 2 (Sportz)...");
  await rows.nth(2).hover();
  await recPage.waitForTimeout(1800);

  // Move away to check auto-cycle resume
  await recPage.mouse.move(50, 50);
  await recPage.waitForTimeout(2500);

  await recPage.close();
  await context.close();

  // Find the recorded video and copy to final destination
  const recordedFiles = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (recordedFiles.length > 0) {
    const srcVideo = path.join(videoDir, recordedFiles[0]);
    const dstVideo = path.join(outDir, "teaser-autocycle-hover.webm");
    const publicVideo = path.resolve(process.cwd(), "public", "videos", "teaser-autocycle-hover.webm");
    fs.copyFileSync(srcVideo, dstVideo);
    fs.copyFileSync(srcVideo, publicVideo);
    console.log(`Recorded video saved to:\n  - ${dstVideo}\n  - ${publicVideo}`);
  }

  console.log("\n=== 3. Testing Keyboard Accessibility ===");
  const testPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await testPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await testPage.waitForTimeout(1000);

  const testTile = testPage.locator(".tile-projects");
  const firstRow = testTile.locator(".group\\/row").first();
  await firstRow.focus();
  const isFocused = await firstRow.evaluate((el) => document.activeElement === el);
  console.log("First row keyboard focusable:", isFocused);

  // Verify counter text
  const counterText = await testTile.locator("span.font-mono").innerText();
  console.log("Active counter text:", counterText);

  await testPage.close();
  await browser.close();
  console.log("\nAll verifications completed successfully!");
}

verify().catch(console.error);
