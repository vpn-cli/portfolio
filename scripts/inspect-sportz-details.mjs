import { chromium } from "playwright-core";

async function inspectMatchDetails() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto("https://sportz-rho.vercel.app", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  // Click Watch Live
  await page.locator("text=Watch Live").first().click();
  await page.waitForTimeout(2000);

  // Click Simulate
  console.log("Clicking Simulate...");
  await page.locator("text=Simulate").click();
  await page.waitForTimeout(3000);

  // Take screenshot after simulate
  await page.screenshot({ path: "shots/sportz-simulated.png", fullPage: true });

  // Get all text content
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log("Full text after simulate:\n", fullText);

  await browser.close();
}

inspectMatchDetails().catch(console.error);

