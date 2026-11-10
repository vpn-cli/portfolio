import { chromium } from "playwright-core";

async function testSubmit() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark"
  });

  await page.goto("https://appforge-studios.vercel.app/builder/demo", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Initial right pane text
  const initialText = await page.locator(".w-full.md\\:w-1\\/2").last().innerText();
  console.log("Initial preview text excerpt:", initialText.slice(0, 150));

  const askAiBtn = page.locator("text=Ask AI");
  await askAiBtn.click();
  await page.waitForTimeout(800);

  const textareas = page.locator("textarea");
  const count = await textareas.count();
  const input = textareas.nth(count - 1);

  const promptText = "Generate a fleet logistics dashboard with incident cards and dispatch status";
  await input.fill(promptText);
  await page.waitForTimeout(500);

  // Click submit (purple button or enter)
  const submitBtn = page.locator("button:has(svg.lucide-send), button:has(svg[class*='lucide-send'])").first();
  if (await submitBtn.count() > 0) {
    console.log("Clicking submit button...");
    await submitBtn.click();
  } else {
    console.log("Pressing Enter...");
    await input.press("Enter");
  }

  // Monitor changes for 6 seconds
  for (let s = 1; s <= 6; s++) {
    await page.waitForTimeout(1000);
    const modalVisible = await page.locator("div.animate-in").count();
    const currentText = await page.locator(".w-full.md\\:w-1\\/2").last().innerText();
    console.log(`After ${s}s - modal visible: ${modalVisible}, preview excerpt: ${currentText.slice(0, 100).replace(/\n/g, ' ')}`);
  }

  await page.screenshot({ path: "shots/test-after-submit.png" });
  console.log("Captured shots/test-after-submit.png");

  await browser.close();
}

testSubmit().catch(console.error);
