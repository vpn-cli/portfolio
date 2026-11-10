import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const SHOTS_DIR = path.resolve("shots/verification");
if (!fs.existsSync(SHOTS_DIR)) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

async function run() {
  console.log("=== Starting Verification on http://localhost:3100 ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const viewports = [
    { name: "1440px", width: 1440, height: 900 },
    { name: "390px", width: 390, height: 844 },
  ];
  const themes = ["light", "dark"];

  // 1. Capture Background tile screenshots
  for (const vp of viewports) {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });
      const page = await context.newPage();
      await page.goto("http://localhost:3100/", { waitUntil: "domcontentloaded" });

      await page.evaluate((t) => {
        if (t === "dark") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("portfolio-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("portfolio-theme", "light");
        }
      }, theme);
      await page.waitForTimeout(400);

      const aboutTile = page.locator(".tile-about");
      await aboutTile.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const shotPath = path.join(SHOTS_DIR, `background-tile-${vp.name}-${theme}.png`);
      await aboutTile.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);

      // Check whether round arrow button exists
      const roundButtonsCount = await aboutTile.locator(".rounded-full:has(svg)").count();
      const textLinkCount = await aboutTile.locator("text='Read background'").count();
      console.log(`[${vp.name} - ${theme}] Background tile: textLinkCount=${textLinkCount}, roundButtonsCount=${roundButtonsCount}`);

      await context.close();
    }
  }

  // 2. Capture Top of /about screenshots & inspect spacing
  for (const vp of viewports) {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });
      const page = await context.newPage();
      await page.goto("http://localhost:3100/about", { waitUntil: "domcontentloaded" });

      await page.evaluate((t) => {
        if (t === "dark") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("portfolio-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("portfolio-theme", "light");
        }
      }, theme);
      await page.waitForTimeout(400);

      // Verify "Built with" is gone
      const builtWithCount = await page.locator("text='Built with'").count();
      console.log(`[${vp.name} - ${theme}] /about 'Built with' count=${builtWithCount}`);

      // Spacing analysis
      const spacingInfo = await page.evaluate(() => {
        const heroSection = document.querySelector("section[aria-labelledby='about-intro-heading']");
        const workbenchSection = document.querySelector("section[aria-labelledby='workbench-heading']");
        const experienceSection = document.querySelector("section[aria-labelledby='experience-heading']");

        const heroRect = heroSection?.getBoundingClientRect();
        const workbenchRect = workbenchSection?.getBoundingClientRect();
        const experienceRect = experienceSection?.getBoundingClientRect();

        const gapHeroToWorkbench = workbenchRect && heroRect ? workbenchRect.top - heroRect.bottom : null;
        const gapWorkbenchToExperience = experienceRect && workbenchRect ? experienceRect.top - workbenchRect.bottom : null;

        return {
          gapHeroToWorkbench,
          gapWorkbenchToExperience,
        };
      });
      console.log(`[${vp.name} - ${theme}] Spacing: hero-to-workbench=${spacingInfo.gapHeroToWorkbench}px, workbench-to-experience=${spacingInfo.gapWorkbenchToExperience}px`);

      // Take screenshot of top of /about (hero + top of workbench)
      const shotPath = path.join(SHOTS_DIR, `about-top-${vp.name}-${theme}.png`);
      await page.screenshot({
        path: shotPath,
        clip: {
          x: 0,
          y: 0,
          width: vp.width,
          height: Math.min(vp.height, 900),
        },
      });
      console.log(`Saved screenshot: ${shotPath}`);

      await context.close();
    }
  }

  // 3. Test navigation from Background tile to /about and nav_click event firing
  console.log("=== Testing Navigation & nav_click event ===");
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    await page.addInitScript(() => {
      window.__debugTransitions = true;
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    });

    await page.goto("http://localhost:3100/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(600);

    const aboutTileLink = page.locator(".tile-about a[href='/about']");
    await aboutTileLink.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Click the Background tile
    await aboutTileLink.click();
    await page.waitForTimeout(1200);

    const currentUrl = page.url();
    const cleanUrl = currentUrl.replace("http://localhost:3100", "");
    console.log(`Landed on URL: ${cleanUrl} (expected: /about)`);

    const events = await page.evaluate(() => window.__posthogEvents || []);
    console.log("Captured events count:", events.length);
    const navClickEvents = events.filter((e) => e.name === "nav_click");
    console.log("nav_click events:", JSON.stringify(navClickEvents, null, 2));

    const aboutTileEvent = navClickEvents.find(
      (e) => e.properties?.location === "about_tile" && e.properties?.to_path === "/about"
    );

    console.log("About tile nav_click event found:", Boolean(aboutTileEvent));
    if (aboutTileEvent) {
      console.log("About tile label:", aboutTileEvent.properties?.label);
      console.log("About tile location:", aboutTileEvent.properties?.location);
      console.log("About tile to_path:", aboutTileEvent.properties?.to_path);
    }

    await context.close();
  }

  await browser.close();
  console.log("=== Verification Script Completed Successfully ===");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
