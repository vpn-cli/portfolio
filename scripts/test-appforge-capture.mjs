import { chromium } from "playwright-core";

async function inspectAppForge() {
  console.log("Launching Edge/Chrome...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log("Navigating to https://appforge-studios.vercel.app ...");
  await page.goto("https://appforge-studios.vercel.app", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(4000);

  console.log("AppForge Loaded. Title:", await page.title());
  await page.screenshot({ path: "shots/appforge-initial.png", fullPage: true });
  console.log("Saved shots/appforge-initial.png");

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("Body text sample:", bodyText.slice(0, 600));

  await browser.close();
}

inspectAppForge().catch(console.error);

