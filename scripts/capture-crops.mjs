import { chromium } from "playwright-core";

async function run() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
  });

  console.log("Loading AppForge...");
  await page.goto("https://appforge-studios.vercel.app", { waitUntil: "load" });
  await page.waitForTimeout(2500);

  // Capture the generated app UI (right side of hero card)
  // Box: x: 720, y: 480, w: 624, h: 450
  await page.screenshot({
    path: "public/projects/appforge-generated-app.png",
    clip: { x: 720, y: 481, width: 624, height: 448 },
  });
  console.log("Saved appforge-generated-app.png");

  // Also capture the whole interactive card (config + generated app)
  await page.screenshot({
    path: "public/projects/appforge-hero-full.png",
    clip: { x: 96, y: 481, width: 1248, height: 448 },
  });
  console.log("Saved appforge-hero-full.png");

  // Now Sportz live dashboard
  console.log("Loading Sportz...");
  await page.goto("https://sportz-rho.vercel.app", { waitUntil: "load" });
  await page.waitForTimeout(3500);

  // The match cards & telemetry section:
  // x: 80, y: 170, w: 1280, h: 560
  await page.screenshot({
    path: "public/projects/sportz-dashboard.png",
    clip: { x: 80, y: 160, width: 1280, height: 600 },
  });
  console.log("Saved sportz-dashboard.png");

  // Also capture just the live matches grid:
  await page.screenshot({
    path: "public/projects/sportz-matches.png",
    clip: { x: 80, y: 240, width: 850, height: 480 },
  });
  console.log("Saved sportz-matches.png");

  await browser.close();
}

run().catch(console.error);

