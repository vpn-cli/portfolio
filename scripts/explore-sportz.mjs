import { chromium } from "playwright-core";

async function exploreSportz() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log("Navigating to Sportz...");
  await page.goto("https://sportz-rho.vercel.app", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);

  // Check buttons and links
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("button, a")).map(b => ({
      text: b.innerText.trim(),
      tag: b.tagName,
      className: b.className,
    }));
  });
  console.log("Found buttons/links count:", buttons.length);
  console.log("Sample buttons:", buttons.filter(b => b.text.length > 0 && b.text.length < 30).slice(0, 15));

  // Find "Watch Live" buttons
  const watchLiveButtons = page.locator("text=Watch Live");
  const count = await watchLiveButtons.count();
  console.log("Watch Live buttons count:", count);

  if (count > 0) {
    console.log("Clicking first Watch Live button...");
    await watchLiveButtons.first().click();
    await page.waitForTimeout(3000);
    console.log("Clicked! Current URL:", page.url());
    await page.screenshot({ path: "shots/sportz-match-view.png", fullPage: true });
    console.log("Saved shots/sportz-match-view.png");

    const innerText = await page.evaluate(() => document.body.innerText);
    console.log("Match view innerText:", innerText.slice(0, 600));
  }

  await browser.close();
}

exploreSportz().catch(console.error);

