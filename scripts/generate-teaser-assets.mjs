import { chromium } from "playwright-core";
import path from "node:path";
import { execSync } from "node:child_process";

async function generate() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  // 1. StreamMart Flow
  console.log("Generating StreamMart Flow screenshot...");
  const streamPage = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  });
  const htmlPath = path.resolve("public/projects/stream-mart-flow.html");
  await streamPage.goto("file:///" + htmlPath.replace(/\\/g, "/"));
  await streamPage.waitForTimeout(600);
  await streamPage.screenshot({ path: "public/projects/stream-mart-teaser.png" });
  console.log("Saved stream-mart-teaser.png");
  await streamPage.close();

  await browser.close();

  // 2. Run Python to produce 1600x900 2x WebP images for all three
  console.log("Running Python to create normalized 16:9 WebP and PNG assets...");
  execSync("python scripts/normalize-previews.py", { stdio: "inherit" });
}

generate().catch(console.error);

