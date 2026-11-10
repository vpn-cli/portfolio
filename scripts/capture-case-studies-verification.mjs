import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const OUTPUT_DIR = path.resolve("shots/case-studies-redesign");

const PROJECTS = [
  { slug: "stream-mart", title: "StreamMart" },
  { slug: "sockets", title: "Sockets" },
  { slug: "appforge", title: "AppForge" },
];

const VIEWPORTS = [
  { name: "1440px", width: 1440, height: 900 },
  { name: "390px", width: 390, height: 844 },
];

const THEMES = ["light", "dark"];

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Starting case studies verification against ${BASE_URL}...`);
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      console.log(`\n=== Capturing in ${theme} mode at ${vp.name} (${vp.width}x${vp.height}) ===`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });

      const page = await context.newPage();

      for (const proj of PROJECTS) {
        const url = `${BASE_URL}/work/${proj.slug}`;
        console.log(`Loading ${url}...`);

        await page.goto(url, { waitUntil: "networkidle" });
        await page.evaluate((t) => {
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(t);
          document.documentElement.setAttribute("data-theme", t);
        }, theme);
        await page.waitForTimeout(500);

        // 1. Top section screenshot
        const topShotName = `${proj.slug}-top-${vp.name}-${theme}.png`;
        await page.screenshot({
          path: path.join(OUTPUT_DIR, topShotName),
          clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) },
        });
        console.log(`  Saved: ${topShotName}`);

        // 2. Stack line screenshot
        // The stack line is in the hook section: role · timeline · stack
        const stackEl = page.locator("#hook p:has-text(',')").first();
        const stackVisible = await stackEl.isVisible().catch(() => false);
        if (stackVisible) {
          const stackContainer = page.locator("#hook .pt-3.border-t").first();
          const stackShotName = `${proj.slug}-stack-${vp.name}-${theme}.png`;
          await stackContainer.screenshot({
            path: path.join(OUTPUT_DIR, stackShotName),
          });
          console.log(`  Saved: ${stackShotName}`);
        }

        // 3. Diagram screenshots
        if (proj.slug === "stream-mart") {
          const diagramContainer = page.locator("div[aria-label*='diagram'], div[aria-label*='Diagram']").first();
          if (await diagramContainer.isVisible().catch(() => false)) {
            // Scroll diagram into view
            await diagramContainer.scrollIntoViewIfNeeded();
            await page.waitForTimeout(300);

            // Step 1 diagram screenshot
            // Click previous/first to ensure Step 1
            const nextBtn = diagramContainer.locator("button[aria-label='Next step']");
            const prevBtn = diagramContainer.locator("button[aria-label='Previous step']");
            const playBtn = diagramContainer.locator("button[aria-label*='simulation']");

            // Pause autoplay if running
            const pauseBtn = diagramContainer.locator("button[aria-label='Pause simulation']");
            if (await pauseBtn.isVisible().catch(() => false)) {
              await pauseBtn.click();
            }

            // Go to step 1 (cycle until step 1)
            for (let i = 0; i < 5; i++) {
              const text = await diagramContainer.textContent();
              if (text && text.includes("1 of 5")) break;
              await prevBtn.click();
              await page.waitForTimeout(100);
            }

            const step1ShotName = `stream-mart-diagram-step1-${vp.name}-${theme}.png`;
            await diagramContainer.screenshot({
              path: path.join(OUTPUT_DIR, step1ShotName),
            });
            console.log(`  Saved: ${step1ShotName}`);

            // Go to Step 3
            await nextBtn.click();
            await page.waitForTimeout(100);
            await nextBtn.click();
            await page.waitForTimeout(100);

            const step3ShotName = `stream-mart-diagram-step3-${vp.name}-${theme}.png`;
            await diagramContainer.screenshot({
              path: path.join(OUTPUT_DIR, step3ShotName),
            });
            console.log(`  Saved: ${step3ShotName}`);
          }
        } else {
          // For sockets and appforge: capture their hero visual and interactive architecture
          const heroVisual = page.locator("#hook video, #hook img, #hook [class*='aspect']").first();
          if (await heroVisual.isVisible().catch(() => false)) {
            const heroShotName = `${proj.slug}-hero-visual-${vp.name}-${theme}.png`;
            await heroVisual.screenshot({
              path: path.join(OUTPUT_DIR, heroShotName),
            });
            console.log(`  Saved: ${heroShotName}`);
          }

          // Section 3 Architecture component
          const archSection = page.locator("#architecture").first();
          if (await archSection.isVisible().catch(() => false)) {
            await archSection.scrollIntoViewIfNeeded();
            await page.waitForTimeout(300);

            const archShot1Name = `${proj.slug}-architecture-step1-${vp.name}-${theme}.png`;
            await archSection.screenshot({
              path: path.join(OUTPUT_DIR, archShot1Name),
            });
            console.log(`  Saved: ${archShot1Name}`);

            // Click second architecture node if available
            const secondNodeBtn = archSection.locator("button[aria-label*='Inspect']").nth(1);
            if (await secondNodeBtn.isVisible().catch(() => false)) {
              await secondNodeBtn.click();
              await page.waitForTimeout(300);

              const archShot2Name = `${proj.slug}-architecture-step2-${vp.name}-${theme}.png`;
              await archSection.screenshot({
                path: path.join(OUTPUT_DIR, archShot2Name),
              });
              console.log(`  Saved: ${archShot2Name}`);
            }
          }
        }
      }

      await context.close();
    }
  }

  await browser.close();
  console.log("\nAll screenshots captured successfully in shots/case-studies-redesign!");
}

main().catch((err) => {
  console.error("Error during capture:", err);
  process.exit(1);
});

