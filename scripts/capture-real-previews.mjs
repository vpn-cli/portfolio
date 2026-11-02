import { chromium } from "playwright-core";
import path from "node:path";

async function capture() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
  });

  console.log("Loading AppForge...");
  await page.goto("https://appforge-studios.vercel.app", { waitUntil: "load" });
  await page.waitForTimeout(2500);

  // Look for the rendered application container
  // From our earlier inspection:
  // { x: 720, y: 482, w: 623, h: 446 } DIV w-full md:w-1/2 min-w-0 bg-muted/60 p-6 md:p-8 relative flex -> RENDERED APPLICATION 👥 Active Workflows 1,244 +12% WORKFLOW TRIGGER STATUS...
  // Or the whole container { x: 96, y: 481, w: 1248, h: 448 }
  const renderedApp = page.locator("text=RENDERED APPLICATION").locator("..");
  const renderedCount = await renderedApp.count();
  console.log("Rendered app locator count:", renderedCount);

  if (renderedCount > 0) {
    const parent = renderedApp.first();
    const box = await parent.boundingBox();
    console.log("Rendered app box:", box);
    if (box) {
      await page.screenshot({
        path: "public/projects/appforge-ui-crop.png",
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: box.width + 20,
          height: box.height + 20,
        },
      });
      console.log("Saved public/projects/appforge-ui-crop.png");
    }
  }

  // Also let's capture the full hero interactive card (both JSON and rendered app, or just the app)
  const heroCard = page.locator(".shadow-\\[0_15px_35px_\\]");
  if ((await heroCard.count()) > 0) {
    await heroCard.first().screenshot({ path: "public/projects/appforge-hero-card.png" });
    console.log("Saved public/projects/appforge-hero-card.png");
  }

  // Now Sportz live dashboard
  console.log("Loading Sportz...");
  await page.goto("https://sportz-rho.vercel.app", { waitUntil: "load" });
  await page.waitForTimeout(3500);

  // Capture the dashboard main area
  const sportzMain = page.locator("main");
  if ((await sportzMain.count()) > 0) {
    const box = await sportzMain.first().boundingBox();
    console.log("Sportz main box:", box);
    if (box) {
      await page.screenshot({
        path: "public/projects/sportz-dashboard-crop.png",
        clip: {
          x: Math.max(0, box.x - 10),
          y: Math.max(0, box.y - 10),
          width: Math.min(box.width + 20, 1440),
          height: Math.min(box.height + 20, 750),
        },
      });
      console.log("Saved public/projects/sportz-dashboard-crop.png");
    }
  }

  // Also capture the match cards area
  const matchCards = page.locator("text=Current Matches").locator("..");
  if ((await matchCards.count()) > 0) {
    const box = await matchCards.first().boundingBox();
    console.log("Match cards box:", box);
  }

  await browser.close();
}

capture().catch(console.error);

