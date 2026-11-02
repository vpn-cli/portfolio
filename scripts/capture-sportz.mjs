import { chromium } from "playwright-core";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("public/projects/sockets");
const TEMP_DIR = path.resolve("shots/temp-sportz");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

async function captureSportz() {
  console.log("Starting Sportz capture...");

  // 1. Launch with video recording enabled
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
    recordVideo: {
      dir: TEMP_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();
  console.log("Loading https://sportz-rho.vercel.app ...");
  await page.goto("https://sportz-rho.vercel.app", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);

  // --- CAPTURE 1: Connection status badge ---
  const badgeLocator = page.locator("text=LIVE CONNECTED").first();
  if (await badgeLocator.count() > 0) {
    const badgeParent = badgeLocator.locator("..");
    await badgeParent.screenshot({ path: path.join(TEMP_DIR, "badge.png") });
    execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "badge.png")}" "${path.join(OUT_DIR, "sportz-connection-badge.webp")}"`);
    console.log("Captured: sportz-connection-badge.webp");
  }

  // --- CAPTURE 2: Match list (cards) ---
  const matchSection = page.locator("section:has-text('Current Matches')").first();
  if (await matchSection.count() > 0) {
    await matchSection.screenshot({ path: path.join(TEMP_DIR, "match-list.png") });
    execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "match-list.png")}" "${path.join(OUT_DIR, "sportz-match-list.webp")}"`);
    console.log("Captured: sportz-match-list.webp");
  }

  // --- Open Match View ---
  const watchLiveBtn = page.locator("text=Watch Live").first();
  await watchLiveBtn.click();
  await page.waitForTimeout(2000);

  // --- Open Simulator to prepare live score update ---
  await page.locator("text=Simulate").click();
  await page.waitForTimeout(1500);

  // Click quick event triggers to change score live!
  console.log("Triggering live score changes...");
  const fourRunBtn = page.locator("text=Boundary (+4)").first();
  if (await fourRunBtn.count() > 0) {
    await fourRunBtn.click();
    await page.waitForTimeout(1200);
    await fourRunBtn.click();
    await page.waitForTimeout(1200);
  }

  const sixRunBtn = page.locator("text=Maximum (+6)").first();
  if (await sixRunBtn.count() > 0) {
    await sixRunBtn.click();
    await page.waitForTimeout(1500);
  }

  // Close simulator modal to see scoreboard and commentary
  const closeSimBtn = page.locator("text=✕").first();
  if (await closeSimBtn.count() > 0) {
    await closeSimBtn.click();
    await page.waitForTimeout(1500);
  }

  // --- CAPTURE 3: Live match view (Scoreboard & Win Probability) ---
  const liveMatchArea = page.locator("main").first();
  if (await liveMatchArea.count() > 0) {
    await liveMatchArea.screenshot({ path: path.join(TEMP_DIR, "live-match.png") });
    execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "live-match.png")}" "${path.join(OUT_DIR, "sportz-live-match.webp")}"`);
    console.log("Captured: sportz-live-match.webp");
  }

  // --- CAPTURE 4: Commentary feed ---
  const commentaryLocator = page.locator("text=Live Commentary").locator("../..");
  if (await commentaryLocator.count() > 0) {
    await commentaryLocator.screenshot({ path: path.join(TEMP_DIR, "commentary.png") });
    execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "commentary.png")}" "${path.join(OUT_DIR, "sportz-commentary-feed.webp")}"`);
    console.log("Captured: sportz-commentary-feed.webp");
  }

  // Keep page open for 2 more seconds to complete video buffer
  await page.waitForTimeout(2000);

  // Close page and context so Playwright saves video
  await page.close();
  await context.close();

  // Find the recorded video in TEMP_DIR
  const videoFiles = fs.readdirSync(TEMP_DIR).filter(f => f.endsWith(".webm"));
  if (videoFiles.length > 0) {
    const rawVideo = path.join(TEMP_DIR, videoFiles[0]);
    console.log("Raw video recorded:", rawVideo);

    // Convert to 6-8s clean mp4 and webm without audio, crop if needed or scale to clean 1440x900
    // Trim from second 6 to 13 (around when simulate happened)
    const outMp4 = path.join(OUT_DIR, "sportz-live-score-update.mp4");
    const outWebm = path.join(OUT_DIR, "sportz-live-score-update.webm");
    const outPoster = path.join(OUT_DIR, "sportz-live-score-update-poster.webp");

    console.log("Encoding video clips with ffmpeg...");
    execSync(`ffmpeg -y -ss 00:00:06 -i "${rawVideo}" -t 7 -an -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p "${outMp4}"`);
    execSync(`ffmpeg -y -ss 00:00:06 -i "${rawVideo}" -t 7 -an -c:v libvpx-vp9 -crf 30 -b:v 0 "${outWebm}"`);
    execSync(`ffmpeg -y -i "${outMp4}" -vframes 1 -q:v 2 "${outPoster}"`);
    console.log("Encoded clips and poster for Sportz!");
  }

  // --- CAPTURE 5: Mobile shot (390x844) ---
  console.log("Capturing Sportz mobile 390x844...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("https://sportz-rho.vercel.app", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(3000);
  await mobilePage.locator("text=Watch Live").first().click();
  await mobilePage.waitForTimeout(2000);

  await mobilePage.screenshot({ path: path.join(TEMP_DIR, "mobile.png"), fullPage: false });
  execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "mobile.png")}" "${path.join(OUT_DIR, "sportz-mobile.webp")}"`);
  console.log("Captured: sportz-mobile.webp");

  await mobileContext.close();
  await browser.close();
  console.log("Sportz capture finished successfully!");
}

captureSportz().catch(console.error);
