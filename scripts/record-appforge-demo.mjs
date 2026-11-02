import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const TEMP_DIR = path.resolve("shots/temp-appforge-record");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Clean old webm in temp
for (const f of fs.readdirSync(TEMP_DIR)) {
  if (f.endsWith(".webm") || f.endsWith(".png")) {
    fs.unlinkSync(path.join(TEMP_DIR, f));
  }
}

async function record() {
  console.log("Launching browser for video recording (1440x900)...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    recordVideo: {
      dir: TEMP_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  console.log("Navigating to https://appforge-studios.vercel.app/builder/demo ...");
  await page.goto("https://appforge-studios.vercel.app/builder/demo", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2000);

  // 1. Click "Ask AI"
  console.log("Clicking 'Ask AI' button...");
  const askAiBtn = page.locator("button:has-text('Ask AI'), span:has-text('Ask AI')").first();
  await askAiBtn.click();
  await page.waitForTimeout(1000);

  // 2. Locate textarea
  const input = page.locator("textarea[placeholder*='Generate']").first();
  await input.click();
  await page.waitForTimeout(400);

  // Type prompt at ~40ms per character
  const promptText =
    "Build an analytics dashboard for a SaaS company with monthly revenue, active users, churn rate, and a table of recent signups.";
  console.log("Typing prompt with human speed (~40ms/char)...");
  await input.pressSequentially(promptText, { delay: 40 });
  await page.waitForTimeout(600);

  // 3. Submit
  console.log("Submitting prompt...");
  const submitBtn = page.locator("button[type='submit'], button svg.lucide-send").first();
  if ((await submitBtn.count()) > 0) {
    await submitBtn.click();
  } else {
    await input.press("Enter");
  }

  const submitTime = Date.now();
  console.log("Prompt submitted at:", new Date(submitTime).toISOString());

  // 4. Wait for generation to complete and React UI to fully render
  // Let's watch for the presence of the generated SaaS Analytics Dashboard or Recent Signups
  console.log("Waiting for generated UI to render in preview...");
  await page.waitForSelector("text=SaaS Analytics Dashboard", { timeout: 30000 });
  await page.waitForSelector("text=Recent Signups", { timeout: 30000 });
  
  const finishTime = Date.now();
  const durationWait = (finishTime - submitTime) / 1000;
  console.log(`Generation finished in ${durationWait.toFixed(2)} seconds!`);

  // 4. Hold on the finished dashboard for 2 seconds, then stop
  console.log("Holding on finished dashboard for 2.5 seconds...");
  await page.waitForTimeout(2500);

  // Take screenshot of the finished dashboard frame for poster
  await page.screenshot({ path: path.join(TEMP_DIR, "finished-frame.png") });
  console.log("Saved finished frame for poster.");

  await page.close();
  await context.close();
  await browser.close();

  const videoFiles = fs.readdirSync(TEMP_DIR).filter((f) => f.endsWith(".webm"));
  if (videoFiles.length > 0) {
    console.log("Recorded video file:", videoFiles[0]);
  }
}

record().catch((err) => {
  console.error("Recording error:", err);
  process.exit(1);
});
