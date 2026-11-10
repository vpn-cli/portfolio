import { chromium } from "playwright-core";

async function testWaitGen() {
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

  const promptText = "Generate a fleet logistics dashboard with incident cards and dispatch status";
  await input.fill(promptText);
  await page.waitForTimeout(500);

  const submitBtn = page.locator("button:has(svg.lucide-send), button:has(svg[class*='lucide-send'])").first();
  await submitBtn.click();

  // Wait until "• Ready" appears or up to 20s
  try {
    await page.waitForSelector("text=Ready", { timeout: 20000 });
    console.log("Ready state reached!");
  } catch (e) {
    console.log("Timed out waiting for Ready");
  }

  await page.screenshot({ path: "shots/test-after-complete.png" });
  console.log("Captured shots/test-after-complete.png");

  await browser.close();
}

testWaitGen().catch(console.error);
