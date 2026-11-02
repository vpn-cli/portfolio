import { chromium } from "playwright-core";

async function testAskAi() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto("https://appforge-studios.vercel.app/builder/demo", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  console.log("Clicking Ask AI...");
  await page.locator("text=Ask AI").click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: "shots/appforge-ask-ai.png", fullPage: true });
  console.log("Saved shots/appforge-ask-ai.png");

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("input, textarea")).map(el => ({
      tag: el.tagName,
      placeholder: el.getAttribute("placeholder"),
      value: el.value,
    }));
  });
  console.log("Inputs after Ask AI:", inputs);

  await browser.close();
}

testAskAi().catch(console.error);
