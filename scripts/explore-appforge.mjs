import { chromium } from "playwright-core";

async function exploreAppForge() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log("Navigating to AppForge...");
  await page.goto("https://appforge-studios.vercel.app", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  // Check navigation links
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a")).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
    }));
  });
  console.log("AppForge Links:", links);

  // Check if Builder page loads
  console.log("Navigating to /builder or clicking Start Building...");
  const startBtn = page.locator("text=Start Building").first();
  if (await startBtn.count() > 0) {
    await startBtn.click();
    await page.waitForTimeout(4000);
    console.log("Current URL after click:", page.url());
    await page.screenshot({ path: "shots/appforge-builder-view.png", fullPage: true });
    console.log("Saved shots/appforge-builder-view.png");

    const text = await page.evaluate(() => document.body.innerText);
    console.log("Builder innerText sample:\n", text.slice(0, 800));
  }

  await browser.close();
}

exploreAppForge().catch(console.error);
