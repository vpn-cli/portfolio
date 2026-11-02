import { chromium } from "playwright-core";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("public/projects/appforge");
const TEMP_DIR = path.resolve("shots/temp-appforge");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

async function captureAppForge() {
  console.log("Starting AppForge capture...");

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
  console.log("Loading AppForge builder demo...");
  await page.goto("https://appforge-studios.vercel.app/builder/demo", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  // --- CAPTURE 1: Code / Editor View (JSON AST Editor) ---
  console.log("Capturing code editor view...");
  // Left half of the builder is the Monaco / code editor container
  const editorPane = page.locator(".monaco-editor, .h-full.border-r, [class*='code-editor']").first();
  if (await editorPane.count() > 0) {
    await editorPane.screenshot({ path: path.join(TEMP_DIR, "editor.png") });
  } else {
    // Capture left side of split pane
    await page.screenshot({
      path: path.join(TEMP_DIR, "editor.png"),
      clip: { x: 0, y: 56, width: 680, height: 844 },
    });
  }
  execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "editor.png")}" "${path.join(OUT_DIR, "appforge-editor-view.webp")}"`);
  console.log("Captured: appforge-editor-view.webp");

  // --- CAPTURE 2: Rendered Application Preview ---
  console.log("Capturing rendered app preview...");
  await page.screenshot({
    path: path.join(TEMP_DIR, "app-preview.png"),
    clip: { x: 680, y: 56, width: 760, height: 844 },
  });
  execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "app-preview.png")}" "${path.join(OUT_DIR, "appforge-app-preview.webp")}"`);
  console.log("Captured: appforge-app-preview.webp");

  // --- Open Ask AI Modal ---
  console.log("Opening Ask AI modal...");
  await page.locator("text=Ask AI").click();
  await page.waitForTimeout(1200);

  const input = page.locator("textarea[placeholder*='Generate']").first();
  await input.click();
  await page.waitForTimeout(500);

  // Type prompt character by character to create realistic interaction in the video
  const promptText = "Generate a fleet logistics dashboard with incident cards and dispatch status";
  await input.pressSequentially(promptText, { delay: 35 });
  await page.waitForTimeout(1000);

  // --- CAPTURE 3: Prompt Input View ---
  const modalBox = page.locator("[role='dialog'], .fixed.inset-0").first();
  if (await modalBox.count() > 0) {
    await modalBox.screenshot({ path: path.join(TEMP_DIR, "prompt-input.png") });
  } else {
    await page.screenshot({
      path: path.join(TEMP_DIR, "prompt-input.png"),
      clip: { x: 260, y: 220, width: 920, height: 460 },
    });
  }
  execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "prompt-input.png")}" "${path.join(OUT_DIR, "appforge-prompt-input.webp")}"`);
  console.log("Captured: appforge-prompt-input.webp");

  // --- Submit Prompt & Capture Generating State ---
  console.log("Submitting prompt...");
  const submitBtn = page.locator("button[type='submit']").first();
  if (await submitBtn.count() > 0) {
    await submitBtn.click();
  } else {
    await input.press("Enter");
  }

  await page.waitForTimeout(1000);

  // --- CAPTURE 4: Generation in progress ---
  await page.screenshot({ path: path.join(TEMP_DIR, "generating.png") });
  execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "generating.png")}" "${path.join(OUT_DIR, "appforge-generating.webp")}"`);
  console.log("Captured: appforge-generating.webp");

  // Wait for generation to complete and new app to appear
  console.log("Waiting 5s for UI to stream and render...");
  await page.waitForTimeout(5000);

  await page.close();
  await context.close();

  // Process Video Recording
  const videoFiles = fs.readdirSync(TEMP_DIR).filter(f => f.endsWith(".webm"));
  if (videoFiles.length > 0) {
    const rawVideo = path.join(TEMP_DIR, videoFiles[0]);
    console.log("Raw video recorded:", rawVideo);

    const outMp4 = path.join(OUT_DIR, "appforge-prompt-to-app.mp4");
    const outWebm = path.join(OUT_DIR, "appforge-prompt-to-app.webm");
    const outPoster = path.join(OUT_DIR, "appforge-prompt-to-app-poster.webp");

    // Clip starting from when prompt typing finishes to when app renders (~8s)
    execSync(`ffmpeg -y -ss 00:00:05 -i "${rawVideo}" -t 8 -an -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p "${outMp4}"`);
    execSync(`ffmpeg -y -ss 00:00:05 -i "${rawVideo}" -t 8 -an -c:v libvpx-vp9 -crf 30 -b:v 0 "${outWebm}"`);
    execSync(`ffmpeg -y -i "${outMp4}" -vframes 1 -q:v 2 "${outPoster}"`);
    console.log("Encoded AppForge video clips and poster!");
  }

  // --- CAPTURE 5: Mobile 390x844 ---
  console.log("Capturing AppForge mobile 390x844...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("https://appforge-studios.vercel.app/builder/demo", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(3000);

  await mobilePage.screenshot({ path: path.join(TEMP_DIR, "mobile.png"), fullPage: false });
  execSync(`ffmpeg -y -i "${path.join(TEMP_DIR, "mobile.png")}" "${path.join(OUT_DIR, "appforge-mobile.webp")}"`);
  console.log("Captured: appforge-mobile.webp");

  await mobileContext.close();
  await browser.close();
  console.log("AppForge capture finished successfully!");
}

captureAppForge().catch(console.error);

