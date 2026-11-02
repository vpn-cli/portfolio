import { chromium } from "playwright-core";

async function inspectSportz() {
  console.log("Launching Edge/Chrome...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log("Navigating to https://sportz-rho.vercel.app ...");
  await page.goto("https://sportz-rho.vercel.app", { waitUntil: "networkidle", timeout: 60000 });

  console.log("Page loaded. Title:", await page.title());

  // Wait up to 60s for backend or live indicators
  console.log("Waiting up to 30s to allow backend to wake...");
  await page.waitForTimeout(5000);

  // Take a full screenshot to see initial state
  await page.screenshot({ path: "shots/sportz-initial.png", fullPage: true });
  console.log("Saved shots/sportz-initial.png");

  // Inspect page text and elements
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("Body text sample:", bodyText.slice(0, 500));

  await browser.close();
}

inspectSportz().catch(console.error);

