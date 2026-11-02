import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

const AUTH_FILE = path.resolve("scripts/appforge-auth.json");
const TRIGGER_FILE = path.resolve("scripts/.confirm-login");
const SAVED_FILE = path.resolve("scripts/.login-saved");

if (fs.existsSync(TRIGGER_FILE)) fs.unlinkSync(TRIGGER_FILE);
if (fs.existsSync(SAVED_FILE)) fs.unlinkSync(SAVED_FILE);

async function runLogin() {
  console.log("Launching headed Chrome browser at 1440x900...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    args: ["--window-position=50,50", "--window-size=1440,900"],
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

  await page.waitForTimeout(2000);

  // Function to show banner on the login screen
  async function injectBanner() {
    try {
      await page.evaluate(() => {
        document.title = ">>> PLEASE LOG IN HERE - AppForge <<<";
        if (!document.getElementById("agent-login-banner")) {
          const banner = document.createElement("div");
          banner.id = "agent-login-banner";
          banner.style =
            "position:fixed;top:0;left:0;right:0;background:#2563eb;color:#ffffff;padding:14px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;font-weight:600;z-index:9999999;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.4);letter-spacing:0.01em;";
          banner.innerText =
            "👋 Please log in to AppForge in this window. As soon as you log in, your session will automatically save.";
          document.body.prepend(banner);
        }
      });
    } catch (_) {}
  }

  await injectBanner();

  // Try to bring window to front
  exec(
    `powershell -Command "$wshell = New-Object -ComObject WScript.Shell; $wshell.AppActivate('PLEASE LOG IN HERE')"`
  );

  console.log("READY_FOR_USER: Login window is open and waiting for user credentials.");

  const startTime = Date.now();
  const MAX_WAIT_MS = 2 * 60 * 60 * 1000; // 2 hours

  while (Date.now() - startTime < MAX_WAIT_MS) {
    const currentUrl = page.url();

    // Check if user confirmed via trigger file
    if (fs.existsSync(TRIGGER_FILE)) {
      console.log("Trigger detected! Saving storageState...");
      await page.waitForTimeout(2000);
      await context.storageState({ path: AUTH_FILE });
      fs.writeFileSync(SAVED_FILE, "ok");
      console.log("AUTH_STATE_SAVED to", AUTH_FILE);
      await page.waitForTimeout(1000);
      await browser.close();
      return;
    }

    // Check if redirected back to AppForge builder or dashboard
    if (
      currentUrl.includes("appforge-studios.vercel.app") &&
      !currentUrl.includes("sign-in") &&
      !currentUrl.includes("accounts.dev")
    ) {
      console.log("Login detected! Current URL:", currentUrl);
      console.log("Waiting 3s for tokens and cookies to persist...");
      await page.waitForTimeout(3000);
      await context.storageState({ path: AUTH_FILE });
      fs.writeFileSync(SAVED_FILE, "ok");
      console.log("AUTH_STATE_SAVED to", AUTH_FILE);
      await page.waitForTimeout(1000);
      await browser.close();
      return;
    }

    await injectBanner();
    await page.waitForTimeout(2000);
  }

  console.error("Timed out waiting for login.");
  await browser.close();
}

runLogin().catch((err) => {
  console.error("Error in login script:", err);
  process.exit(1);
});
