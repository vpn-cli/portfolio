import { chromium } from "playwright-core";

async function testPromptGeneration() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto("https://appforge-studios.vercel.app/builder/demo", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  // Click Ask AI
  await page.locator("text=Ask AI").click();
  await page.waitForTimeout(1000);

  // Locate the input textarea
  const input = page.locator("textarea[placeholder*='Generate']").first();
  console.log("Input found:", await input.count());

  await input.fill("Generate an analytics dashboard with revenue metrics and customer table");
  await page.waitForTimeout(1000);

  // Take screenshot of prompt input state
  await page.screenshot({ path: "shots/temp-appforge-prompt.png" });

  // Find submit button in the modal
  const submitBtns = await page.evaluate(() => {
    const modal = document.querySelector("[role='dialog']") || document.body;
    return Array.from(modal.querySelectorAll("button")).map(b => ({
      text: b.innerText.trim(),
      ariaLabel: b.getAttribute("aria-label"),
      type: b.getAttribute("type"),
      classes: b.className
    }));
  });
  console.log("Submit buttons in modal:", submitBtns);

  // Press Enter to submit
  console.log("Submitting prompt...");
  await input.press("Enter");
  await page.waitForTimeout(2000);

  await page.screenshot({ path: "shots/temp-appforge-generating.png" });
  console.log("Saved shots/temp-appforge-generating.png");

  // Wait for generation to stream and finish
  console.log("Waiting 6 seconds for generation...");
  await page.waitForTimeout(6000);

  await page.screenshot({ path: "shots/temp-appforge-generated.png" });
  console.log("Saved shots/temp-appforge-generated.png");

  await browser.close();
}

testPromptGeneration().catch(console.error);
