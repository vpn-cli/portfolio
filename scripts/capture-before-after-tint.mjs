import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const SHOTS_DIR = path.resolve("shots/tint-verification");

const PAGES = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/work/sockets", name: "case-study-sockets" },
];

const THEMES = ["light", "dark"];

export async function capture(prefix) {
  if (!fs.existsSync(SHOTS_DIR)) {
    fs.mkdirSync(SHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: "chrome", headless: true });

  for (const pageInfo of PAGES) {
    for (const theme of THEMES) {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
        colorScheme: theme,
      });

      const url = `${BASE_URL}${pageInfo.path}`;
      console.log(`[${prefix}] Navigating to ${url} in ${theme}...`);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      await page.evaluate((t) => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(t);
        document.documentElement.setAttribute("data-theme", t);
        localStorage.setItem("portfolio-theme", t);
      }, theme);

      // Give time for layout, fonts, and transitions to settle
      await page.waitForTimeout(800);

      const filename = `${prefix}-${pageInfo.name}-${theme}-1440px.png`;
      const filepath = path.join(SHOTS_DIR, filename);

      await page.screenshot({
        path: filepath,
        clip: { x: 0, y: 0, width: 1440, height: 900 },
      });

      console.log(`Saved: ${filename}`);
      await page.close();
    }
  }

  await browser.close();
}

export async function createSideBySide() {
  for (const pageInfo of PAGES) {
    for (const theme of THEMES) {
      const beforeFile = path.join(SHOTS_DIR, `before-${pageInfo.name}-${theme}-1440px.png`);
      const afterFile = path.join(SHOTS_DIR, `after-${pageInfo.name}-${theme}-1440px.png`);
      const diffFile = path.join(SHOTS_DIR, `comparison-${pageInfo.name}-${theme}-1440px.png`);

      if (!fs.existsSync(beforeFile) || !fs.existsSync(afterFile)) {
        console.warn(`Missing before or after file for ${pageInfo.name} ${theme}`);
        continue;
      }

      const beforeImg = sharp(beforeFile);
      const afterImg = sharp(afterFile);

      const beforeMeta = await beforeImg.metadata();
      const afterMeta = await afterImg.metadata();

      const width = beforeMeta.width;
      const height = beforeMeta.height;

      // Create side-by-side: 2 * width x height + header banner
      const bannerHeight = 60;
      const totalWidth = width * 2 + 20; // 20px gap
      const totalHeight = height + bannerHeight;

      const titleSvg = `
        <svg width="${totalWidth}" height="${bannerHeight}">
          <rect width="100%" height="100%" fill="#1a1c23" />
          <text x="20" y="38" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff">
            BEFORE (Original) - ${pageInfo.name} (${theme})
          </text>
          <text x="${width + 30}" y="38" font-family="sans-serif" font-size="20" font-weight="bold" fill="#6793fa">
            AFTER (Subtle Blue Tint) - ${pageInfo.name} (${theme})
          </text>
        </svg>
      `;

      await sharp({
        create: {
          width: totalWidth,
          height: totalHeight,
          channels: 4,
          background: { r: 26, g: 28, b: 35, alpha: 1 },
        },
      })
        .composite([
          { input: Buffer.from(titleSvg), top: 0, left: 0 },
          { input: beforeFile, top: bannerHeight, left: 0 },
          { input: afterFile, top: bannerHeight, left: width + 20 },
        ])
        .png()
        .toFile(diffFile);

      console.log(`Created comparison: comparison-${pageInfo.name}-${theme}-1440px.png`);
    }
  }
}

const mode = process.argv[2] || "before";
if (mode === "before") {
  capture("before").then(() => console.log("Before captures complete."));
} else if (mode === "after") {
  capture("after").then(() => console.log("After captures complete."));
} else if (mode === "compare") {
  createSideBySide().then(() => console.log("Side-by-side generation complete."));
}
