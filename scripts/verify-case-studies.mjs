import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const VERIFY_DIR = path.resolve("shots/redesign-verification");
if (!fs.existsSync(VERIFY_DIR)) fs.mkdirSync(VERIFY_DIR, { recursive: true });

async function verify() {
  console.log("Launching Edge/Chrome to verify case studies...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const slugs = ["sockets", "appforge", "stream-mart"];
  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 375, height: 812 },
  ];
  const themes = ["dark", "light"];

  const wordCountReport = {};

  for (const slug of slugs) {
    wordCountReport[slug] = {};

    for (const vp of viewports) {
      for (const theme of themes) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 2,
          colorScheme: theme,
        });

        const page = await context.newPage();

        // Listen for CSS requests
        let cssOk = false;
        page.on("response", (res) => {
          if (res.request().resourceType() === "stylesheet" && res.status() === 200) {
            cssOk = true;
          }
        });

        const url = `http://localhost:3000/work/${slug}`;
        console.log(`Loading ${url} [${vp.name}, ${theme}]...`);
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForTimeout(2000);

        // Ensure theme class is applied if needed
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        } else {
          await page.evaluate(() => document.documentElement.classList.remove("dark"));
        }
        await page.waitForTimeout(500);

        // Full page screenshot
        await page.screenshot({
          path: path.join(VERIFY_DIR, `${slug}-${vp.name}-${theme}-full.png`),
          fullPage: true,
        });

        // Screenshot sections individually for desktop dark
        if (vp.name === "desktop" && theme === "dark") {
          const sections = ["hook", "problem", "architecture", "decisions", "bugs", "next"];
          for (const sId of sections) {
            const sectionEl = page.locator(`#${sId}`);
            if (await sectionEl.count() > 0) {
              await sectionEl.first().screenshot({
                path: path.join(VERIFY_DIR, `${slug}-section-${sId}-desktop-dark.png`),
              });
            }
          }
        }

        // Measure visible word counts (desktop unexpanded)
        if (vp.name === "desktop" && theme === "dark") {
          const counts = await page.evaluate(() => {
            const getWords = (text) => text.trim().split(/\s+/).filter(Boolean);

            const sections = ["hook", "problem", "architecture", "decisions", "bugs", "next"];
            const result = {};
            let total = 0;

            for (const sId of sections) {
              const el = document.getElementById(sId);
              if (!el) continue;

              // Clone element to remove collapsed accordions/details before counting visible words
              const clone = el.cloneNode(true);
              const hiddenOrCollapsible = clone.querySelectorAll("[aria-expanded='false'], #problem-details-panel, [role='region'][id*='panel']");
              hiddenOrCollapsible.forEach(h => h.remove());

              const visibleText = clone.innerText || "";
              const words = getWords(visibleText);
              result[sId] = {
                wordCount: words.length,
                preview: words.slice(0, 10).join(" ") + "...",
              };
              total += words.length;
            }

            result.totalVisibleWords = total;
            return result;
          });

          wordCountReport[slug] = counts;
        }

        await context.close();
      }
    }
  }

  // Also verify /projects listing page
  for (const theme of ["dark", "light"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: theme,
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
    if (theme === "dark") {
      await page.evaluate(() => document.documentElement.classList.add("dark"));
    } else {
      await page.evaluate(() => document.documentElement.classList.remove("dark"));
    }
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(VERIFY_DIR, `projects-listing-desktop-${theme}.png`),
      fullPage: true,
    });
    await context.close();
  }

  // Mobile listing page 375px
  const mobileListingContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const mPage = await mobileListingContext.newPage();
  await mPage.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
  await mPage.evaluate(() => document.documentElement.classList.add("dark"));
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({
    path: path.join(VERIFY_DIR, "projects-listing-mobile-dark.png"),
    fullPage: true,
  });
  await mobileListingContext.close();

  await browser.close();

  console.log("=== WORD COUNT REPORT ===");
  console.log(JSON.stringify(wordCountReport, null, 2));

  fs.writeFileSync(
    path.join(VERIFY_DIR, "word-count-report.json"),
    JSON.stringify(wordCountReport, null, 2)
  );
}

verify().catch(console.error);
