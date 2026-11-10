import { chromium } from "playwright-core";
import path from "path";

async function testScreenshots() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark"
  });

  await page.goto("https://appforge-studios.vercel.app/builder/demo", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const askAiBtn = page.locator("text=Ask AI");
  await askAiBtn.click();
  await page.waitForTimeout(800);

  const textareas = page.locator("textarea");
  const count = await textareas.count();
  const input = textareas.nth(count - 1);

  await input.click();
  const promptText = "Generate a fleet logistics dashboard with incident cards and dispatch status";
  await input.fill(promptText);
  await page.waitForTimeout(800);

  // 1. Full page
  await page.screenshot({ path: "shots/test-modal-fullpage.png" });

  // 2. Modal element directly
  const modal = page.locator("div.animate-in").first();
  if (await modal.count() > 0) {
    await modal.screenshot({ path: "shots/test-modal-only.png" });
  }

  // 3. Left pane (editor + modal)
  await page.screenshot({
    path: "shots/test-modal-context.png",
    clip: { x: 0, y: 56, width: 720, height: 700 }
  });

  console.log("Screenshots captured!");
  await browser.close();
}

testScreenshots().catch(console.error);
