import { chromium } from "playwright-core";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("public/projects/stream-mart");
const TEMP_DIR = path.resolve("shots/temp-stream-mart");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

async function captureStreamMart() {
  console.log("Rendering StreamMart terminal and event pipeline visuals...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  // Desktop 1440x900
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  const flowHtmlPath = path.resolve("public/projects/stream-mart-flow.html");
  await page.goto(`file:///${flowHtmlPath.replace(/\\/g, "/")}`);
  await page.waitForTimeout(1000);

  // Full window screenshot
  const windowEl = page.locator(".window").first();
  await windowEl.screenshot({ path: path.join(TEMP_DIR, "terminal-window.png") });
  execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "terminal-window.png")}" "${path.join(OUT_DIR, "stream-mart-event-flow.webp")}"`);
  console.log("Captured: stream-mart-event-flow.webp");

  // Crop terminal / consumer logs
  const terminalLogs = page.locator(".terminal, .logs, .pipeline-terminal, .console").first();
  if (await terminalLogs.count() > 0) {
    await terminalLogs.screenshot({ path: path.join(TEMP_DIR, "logs.png") });
    execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "logs.png")}" "${path.join(OUT_DIR, "stream-mart-outbox-terminal.webp")}"`);
  } else {
    // Crop bottom half showing terminal / logs
    await page.screenshot({
      path: path.join(TEMP_DIR, "logs.png"),
      clip: { x: 40, y: 380, width: 1360, height: 480 },
    });
    execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "logs.png")}" "${path.join(OUT_DIR, "stream-mart-outbox-terminal.webp")}"`);
  }
  console.log("Captured: stream-mart-outbox-terminal.webp");

  await context.close();

  // Mobile 390x844
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`file:///${flowHtmlPath.replace(/\\/g, "/")}`);
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(TEMP_DIR, "mobile.png") });
  execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "mobile.png")}" "${path.join(OUT_DIR, "stream-mart-mobile.webp")}"`);
  console.log("Captured: stream-mart-mobile.webp");

  await mobileContext.close();
  await browser.close();
  console.log("StreamMart visuals generated successfully!");
}

captureStreamMart().catch(console.error);
