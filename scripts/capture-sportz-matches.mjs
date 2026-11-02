import { chromium } from "playwright-core";
import { execSync } from "child_process";
import path from "path";

async function captureMatchList() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto("https://sportz-rho.vercel.app", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  // Match list container
  const el = page.locator("h2:has-text('Current Matches')").locator("../..");
  await el.screenshot({ path: "shots/temp-sportz/match-list.png" });
  execSync(`ffmpeg -y -i "shots/temp-sportz/match-list.png" "public/projects/sockets/sportz-match-list.webp"`);
  console.log("Captured sportz-match-list.webp!");
  await browser.close();
}

captureMatchList().catch(console.error);

