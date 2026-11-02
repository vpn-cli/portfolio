import { chromium } from "playwright-core";
import path from "node:path";
import { execSync } from "node:child_process";
import fs from "node:fs";

async function renderDiagram() {
  console.log("Rendering authentic StreamMart architecture diagram...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });

  const htmlPath = path.resolve("public/projects/stream-mart-flow.html");
  await page.goto("file:///" + htmlPath.replace(/\\/g, "/"));
  await page.waitForTimeout(600);

  const outDir = path.resolve("public/projects/stream-mart");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const rawPng = path.resolve("public/projects/stream-mart.png");
  await page.screenshot({ path: rawPng });
  console.log("Saved: public/projects/stream-mart.png");

  // Generate webp versions with ffmpeg
  const diagramWebp = path.join(outDir, "stream-mart-diagram.webp");
  execSync(`ffmpeg -y -i "${rawPng}" -vf "scale=1600:900" -q:v 85 "${diagramWebp}"`);
  console.log("Saved: public/projects/stream-mart/stream-mart-diagram.webp");

  // Also replace stream-mart-event-flow.webp so any legacy link gets the clean diagram
  const eventFlowWebp = path.join(outDir, "stream-mart-event-flow.webp");
  execSync(`ffmpeg -y -i "${rawPng}" -vf "scale=1600:900" -q:v 85 "${eventFlowWebp}"`);
  console.log("Updated: public/projects/stream-mart/stream-mart-event-flow.webp");

  // Normalize teaser
  const teaserWebp = path.resolve("public/projects/teaser-stream-mart.webp");
  execSync(`ffmpeg -y -i "${rawPng}" -vf "scale=1600:900" -q:v 85 "${teaserWebp}"`);
  console.log("Saved: public/projects/teaser-stream-mart.webp");

  await browser.close();
  console.log("All StreamMart diagram visuals updated successfully!");
}

renderDiagram().catch((err) => {
  console.error("Render error:", err);
  process.exit(1);
});
