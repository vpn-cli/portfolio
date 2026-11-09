import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("shots/about-timeline-removed");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  console.log("Navigating to http://localhost:3100/about ...");
  await page.goto("http://localhost:3100/about", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // 1. Verify timeline is gone
  const timelineHeading = await page.$("#timeline-heading");
  const timelineText = await page.evaluate(() => {
    return document.body.innerText.includes("How I got here");
  });

  console.log("Timeline heading present in DOM:", !!timelineHeading);
  console.log("Text 'How I got here' in body:", timelineText);

  // 2. Verify adjacent sections: Experience and Principles (How I work)
  const expHeading = await page.$("#experience-heading");
  const principlesHeading = await page.$("#how-i-work-heading");

  console.log("Experience heading present in DOM:", !!expHeading);
  console.log("How I work heading present in DOM:", !!principlesHeading);

  // 3. Take screenshot of the adjacent sections
  // Scroll to Experience section
  await page.evaluate(() => {
    const el = document.getElementById("experience-heading");
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(500);

  const adjacentScreenshotPath = path.join(OUT_DIR, "about-adjacent-sections.png");
  await page.screenshot({ path: adjacentScreenshotPath });
  console.log(`Saved screenshot: ${adjacentScreenshotPath}`);

  // 4. Take full page screenshot
  const fullScreenshotPath = path.join(OUT_DIR, "about-full.png");
  await page.screenshot({ path: fullScreenshotPath, fullPage: true });
  console.log(`Saved screenshot: ${fullScreenshotPath}`);

  await browser.close();

  if (timelineHeading || timelineText) {
    console.error("FAIL: Timeline section is still visible!");
    process.exit(1);
  }
  if (!expHeading || !principlesHeading) {
    console.error("FAIL: Experience or Principles heading is missing!");
    process.exit(1);
  }
  if (consoleErrors.length > 0) {
    console.warn("Console errors encountered:", consoleErrors);
  }

  console.log("SUCCESS: /about verified cleanly with timeline removed!");
}

run().catch((err) => {
  console.error("Error running verification:", err);
  process.exit(1);
});
