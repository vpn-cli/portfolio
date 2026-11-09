import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const SHOTS_DIR = path.resolve("shots/art-gallery");
if (!fs.existsSync(SHOTS_DIR)) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-1024", width: 1024, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
];

async function run() {
  console.log("=== Starting Art Gallery Verification ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  for (const vp of VIEWPORTS) {
    for (const theme of ["dark", "light"]) {
      console.log(`\nTesting ${vp.name} (${theme} mode)...`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });

      const page = await context.newPage();

      // Enable debug capture for bot test environment
      await page.addInitScript(() => {
        window.__POSTHOG_DEBUG = true;
      });

      // Go to /about on port 3100
      await page.goto("http://localhost:3100/about", { waitUntil: "networkidle" });

      // If needed, toggle theme via button or localStorage
      const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      if ((theme === "dark" && !isDark) || (theme === "light" && isDark)) {
        await page.evaluate((t) => {
          if (t === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }, theme);
      }

      // Scroll to Design heading
      const designHeading = page.locator("#design-art-heading");
      await designHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      // Screenshot gallery
      const galleryPath = path.join(SHOTS_DIR, `gallery-${vp.name}-${theme}.png`);
      await page.screenshot({ path: galleryPath });
      console.log(`  ✓ Gallery screenshot saved: ${galleryPath}`);

      // Click first artwork button
      const firstArtwork = page.locator('button[aria-label^="Open lightbox for"]').first();
      await firstArtwork.click();
      await page.waitForTimeout(400);

      // Verify dialog is visible
      const dialog = page.locator('div[role="dialog"]');
      const isDialogVisible = await dialog.isVisible();
      console.log(`  ✓ Lightbox opened: ${isDialogVisible}`);

      // Screenshot lightbox
      const lightboxPath = path.join(SHOTS_DIR, `lightbox-${vp.name}-${theme}.png`);
      await page.screenshot({ path: lightboxPath });
      console.log(`  ✓ Lightbox screenshot saved: ${lightboxPath}`);

      // Test keyboard navigation: ArrowRight
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(300);
      const secondTitle = await page.locator('div[role="dialog"] h3').textContent();
      console.log(`  ✓ ArrowRight advanced to: "${secondTitle}"`);

      // Test keyboard navigation: ArrowLeft
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(300);
      const firstTitle = await page.locator('div[role="dialog"] h3').textContent();
      console.log(`  ✓ ArrowLeft returned to: "${firstTitle}"`);

      // Test Esc key to close
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
      const isDialogClosed = !(await dialog.isVisible());
      console.log(`  ✓ Esc closed lightbox: ${isDialogClosed}`);

      // Verify focus returned to trigger
      const isTriggerFocused = await firstArtwork.evaluate((el) => document.activeElement === el);
      console.log(`  ✓ Focus returned to trigger: ${isTriggerFocused}`);

      // Check analytics events
      const events = await page.evaluate(() => {
        return (window.__posthogEvents || []).map((e) => ({
          name: e.name,
          properties: e.properties,
        }));
      });
      const artworkViews = events.filter((e) => e.name === "artwork_view");
      console.log(`  ✓ artwork_view events captured: ${artworkViews.length}`, artworkViews.map(e => e.properties?.artwork));

      await context.close();
    }
  }

  await browser.close();
  console.log("\n=== Art Gallery Verification Finished Successfully ===");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
