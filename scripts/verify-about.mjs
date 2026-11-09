import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("shots/about-verify");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const viewports = [
    { name: "1440px", width: 1440, height: 900 },
    { name: "1024px", width: 1024, height: 800 },
    { name: "390px", width: 390, height: 844 },
  ];

  const consoleErrors = [];

  for (const vp of viewports) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });
      const page = await context.newPage();
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(`[${vp.name}][${theme}] ${msg.text()}`);
        }
      });

      await page.goto("http://localhost:3100/about", { waitUntil: "networkidle" });

      // Apply theme via local storage and class if needed
      if (theme === "dark") {
        await page.evaluate(() => {
          document.documentElement.classList.add("dark");
          localStorage.setItem("portfolio-theme", "dark");
        });
      } else {
        await page.evaluate(() => {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("portfolio-theme", "light");
        });
      }
      await page.waitForTimeout(300);

      // 1. Screenshot of Hero + "What I work with" card
      const heroEl = await page.$("section[aria-labelledby='about-intro-heading']");
      if (heroEl) {
        await heroEl.screenshot({
          path: path.join(OUT_DIR, `hero-${theme}-${vp.name}.png`),
        });
        console.log(`Saved hero screenshot: hero-${theme}-${vp.name}.png`);
      }

      // 2. Test hover / focus on a tool row
      const kafkaRow = await page.$("li[aria-label*='Kafka']");
      if (kafkaRow) {
        await kafkaRow.focus();
        await page.waitForTimeout(200);
        await heroEl.screenshot({
          path: path.join(OUT_DIR, `hero-focused-${theme}-${vp.name}.png`),
        });
      }

      // 3. Workbench tests for all 3 systems after pressing Emit Event
      const workbenchEl = await page.$("section[aria-labelledby='workbench-heading']");

      // System 1: Kafka
      const emitBtn = await page.getByRole("button", { name: /Emit Event/i });
      await emitBtn.click();
      await page.waitForTimeout(700); // Wait for Web Animations API ~600ms to complete and new row to appear
      await workbenchEl.screenshot({
        path: path.join(OUT_DIR, `workbench-kafka-${theme}-${vp.name}.png`),
      });
      console.log(`Saved workbench-kafka: workbench-kafka-${theme}-${vp.name}.png`);

      // System 2: Sportz (Sockets)
      const socketsTab = await page.getByRole("button", { name: /Sportz \(WebSockets\)/i });
      await socketsTab.click();
      await page.waitForTimeout(300);
      await emitBtn.click();
      await page.waitForTimeout(700);
      await workbenchEl.screenshot({
        path: path.join(OUT_DIR, `workbench-sockets-${theme}-${vp.name}.png`),
      });
      console.log(`Saved workbench-sockets: workbench-sockets-${theme}-${vp.name}.png`);

      // System 3: AppForge (AST)
      const astTab = await page.getByRole("button", { name: /AppForge \(AST parser\)/i });
      await astTab.click();
      await page.waitForTimeout(300);
      await emitBtn.click();
      await page.waitForTimeout(700);
      await workbenchEl.screenshot({
        path: path.join(OUT_DIR, `workbench-ast-${theme}-${vp.name}.png`),
      });
      console.log(`Saved workbench-ast: workbench-ast-${theme}-${vp.name}.png`);

      // Test Reset button
      const resetBtn = await page.getByRole("button", { name: /Reset simulation logs/i });
      await resetBtn.click();
      await page.waitForTimeout(300);

      // Test Design mode
      const designBtn = await page.getByRole("button", { name: /Design/i });
      await designBtn.click();
      await page.waitForTimeout(300);
      await workbenchEl.screenshot({
        path: path.join(OUT_DIR, `workbench-design-${theme}-${vp.name}.png`),
      });

      // Test Trade-offs mode
      const tradeoffsBtn = await page.getByRole("button", { name: /Trade-offs/i });
      await tradeoffsBtn.click();
      await page.waitForTimeout(300);
      await workbenchEl.screenshot({
        path: path.join(OUT_DIR, `workbench-tradeoffs-${theme}-${vp.name}.png`),
      });

      await context.close();
    }
  }

  // 4. Reduced Motion Test
  console.log("\nTesting Reduced Motion...");
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto("http://localhost:3100/about", { waitUntil: "networkidle" });
  const rmEmitBtn = await rmPage.getByRole("button", { name: /Emit Event/i });
  await rmEmitBtn.click();
  // Check marker opacity is 0
  const markerOpacity = await rmPage.evaluate(() => {
    const marker = document.querySelector("section[aria-labelledby='workbench-heading'] div[aria-hidden='true'].rounded-full");
    return marker ? window.getComputedStyle(marker).opacity : null;
  });
  console.log("Reduced motion marker opacity:", markerOpacity, "(expected 0)");
  await rmContext.close();

  await browser.close();

  console.log("\n--- Verification Summary ---");
  console.log("Console errors:", consoleErrors.length > 0 ? consoleErrors : "None");
  console.log("Screenshots captured in:", OUT_DIR);
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
