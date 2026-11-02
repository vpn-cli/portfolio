import { chromium } from "playwright-core";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("public/projects/stream-mart");
const TEMP_DIR = path.resolve("shots/temp-stream-mart");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function captureStreamMart() {
  console.log("Rendering authentic StreamMart architecture diagram (No fake terminals or logs)...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  const flowHtmlPath = path.resolve("public/projects/stream-mart-flow.html");
  await page.goto(`file:///${flowHtmlPath.replace(/\\/g, "/")}`);
  await page.waitForTimeout(600);

  // Full Diagram capture (labeled "Diagram", derived strictly from README and docker-compose.yml)
  const diagramEl = page.locator(".diagram-card").first();
  const rawPng = path.join(TEMP_DIR, "stream-mart-diagram.png");
  await diagramEl.screenshot({ path: rawPng });

  execSync(`ffmpeg -y -i "${rawPng}" -vf "scale=1600:900" -q:v 85 "${path.join(OUT_DIR, "stream-mart-diagram.webp")}"`);
  execSync(`ffmpeg -y -i "${rawPng}" -vf "scale=1600:900" -q:v 85 "${path.join(OUT_DIR, "stream-mart-event-flow.webp")}"`);
  execSync(`ffmpeg -y -i "${rawPng}" -vf "scale=1600:900" -q:v 85 "${path.resolve("public/projects/teaser-stream-mart.webp")}"`);
  execSync(`ffmpeg -y -i "${rawPng}" "${path.resolve("public/projects/stream-mart.png")}"`);
  console.log("Successfully rendered diagram webp assets.");

  await context.close();
  await browser.close();
}

captureStreamMart().catch(console.error);
