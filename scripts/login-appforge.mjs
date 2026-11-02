import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const AUTH_FILE = path.resolve("scripts/appforge-auth.json");
const TRIGGER_FILE = path.resolve("scripts/.confirm-login");
const SAVED_FILE = path.resolve("scripts/.login-saved");

// Clean up any stale trigger/saved files
if (fs.existsSync(TRIGGER_FILE)) fs.unlinkSync(TRIGGER_FILE);
if (fs.existsSync(SAVED_FILE)) fs.unlinkSync(SAVED_FILE);

async function runLogin() {
  console.log("Launching headed browser (viewport: 1440x900)...");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: false,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
  });

  const page = await context.newPage();

  console.log("Navigating to https://appforge-studios.vercel.app/builder ...");
  await page.goto("https://appforge-studios.vercel.app/builder", {
    waitUntil: "domcontentloaded",
  });

  console.log("Current URL after navigation:", page.url());
  console.log("Waiting for Clerk sign-in screen to settle...");
  await page.waitForTimeout(2000);

  console.log("CLERK_SIGN_IN_READY: Browser is on", page.url());
  console.log("Please log in in the open browser window. Waiting for session...");

  const startTime = Date.now();
  const MAX_WAIT_MS = 2 * 60 * 60 * 1000; // 2 hours

  while (Date.now() - startTime < MAX_WAIT_MS) {
    const currentUrl = page.url();

    // Check if user confirmed via trigger file
    if (fs.existsSync(TRIGGER_FILE)) {
      console.log("Confirmation trigger detected! Saving session...");
      await page.waitForTimeout(2000);
      await context.storageState({ path: AUTH_FILE });
      fs.writeFileSync(SAVED_FILE, "ok");
      console.log("AUTH_STATE_SAVED_SUCCESSFULLY to", AUTH_FILE);
      await page.waitForTimeout(2000);
      await browser.close();
      return;
    }

    // Check if URL returned to appforge-studios.vercel.app and is no longer on sign-in
    if (
      currentUrl.includes("appforge-studios.vercel.app") &&
      !currentUrl.includes("sign-in") &&
      !currentUrl.includes("accounts.dev")
    ) {
      console.log("Redirect back to appforge detected! URL:", currentUrl);
      console.log("Waiting 4 seconds for authentication tokens to store...");
      await page.waitForTimeout(4000);
      await context.storageState({ path: AUTH_FILE });
      fs.writeFileSync(SAVED_FILE, "ok");
      console.log("AUTH_STATE_SAVED_SUCCESSFULLY to", AUTH_FILE);
      await page.waitForTimeout(2000);
      await browser.close();
      return;
    }

    await page.waitForTimeout(1000);
  }

  console.error("Timed out waiting for login after 10 minutes.");
  await browser.close();
}

runLogin().catch((err) => {
  console.error("Login script error:", err);
  process.exit(1);
});

