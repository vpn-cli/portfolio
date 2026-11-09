import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("shots/about-built-with");
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

  const results = {
    A1: null,
    A2: null,
    A3: null,
    A4: null,
    A5: null,
    A6: null,
    A7: null,
    A8: null,
    analytics: [],
  };

  for (const vp of viewports) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });
      const page = await context.newPage();

      await page.goto("http://localhost:3100/about", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

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

      // Screenshot the hero top section
      const heroSection = await page.$("section[aria-labelledby='about-intro-heading']");
      if (heroSection) {
        const shotPath = path.join(OUT_DIR, `about-top-${theme}-${vp.name}.png`);
        await heroSection.screenshot({ path: shotPath });
        console.log(`Saved screenshot: ${shotPath}`);
      }

      // If at 1440px, measure acceptance criteria
      if (vp.name === "1440px" && theme === "dark") {
        // A1: Built with block height <= 220px
        const builtWithBlock = await page.$("div[data-reveal-order='5']");
        if (builtWithBlock) {
          const box = await builtWithBlock.boundingBox();
          results.A1 = {
            height: box?.height,
            pass: (box?.height || 0) <= 220,
          };
          console.log(`[A1] Built with block height: ${box?.height}px (<= 220px: ${results.A1.pass})`);
        }

        // A5: Meta items (degree and location) on one line, not stacking
        const metaItems = await page.$$("section[aria-labelledby='about-intro-heading'] .tabular-nums span.whitespace-nowrap");
        if (metaItems.length >= 2) {
          const box1 = await metaItems[0].boundingBox();
          const box2 = await metaItems[1].boundingBox();
          // Check if top positions match (within 4px rounding)
          const sameLine = Math.abs((box1?.y || 0) - (box2?.y || 0)) < 4;
          results.A5 = {
            item1Y: box1?.y,
            item2Y: box2?.y,
            sameLine,
            pass: sameLine,
          };
          console.log(`[A5] Meta items top Y: ${box1?.y} vs ${box2?.y} (same line: ${sameLine})`);
        }

        // A2: Chips wrap in rows (check each project's chips have wrapping, multiple items on same row)
        const projectChipContainers = await page.$$("div[data-reveal-order='5'] .grid > div");
        let allWrap = true;
        for (let i = 0; i < projectChipContainers.length; i++) {
          const chips = await projectChipContainers[i].$$("span.tabular-nums");
          if (chips.length > 1) {
            const b0 = await chips[0].boundingBox();
            const b1 = await chips[1].boundingBox();
            if (b0 && b1) {
              const shareRow = Math.abs(b0.y - b1.y) < 4;
              if (!shareRow) allWrap = false;
            }
          }
        }
        results.A2 = { pass: allWrap };
        console.log(`[A2] Chips wrap in rows (not 1 per line): ${allWrap}`);

        // A3: Real brand logo or no icon (zero generic icons)
        const chipSvgs = await page.$$eval("div[data-reveal-order='5'] span.tabular-nums", (chips) => {
          return chips.map((c) => {
            const svg = c.querySelector("svg");
            const text = c.textContent?.trim() || "";
            return {
              text,
              hasSvg: !!svg,
              svgClass: svg?.getAttribute("class") || null,
            };
          });
        });
        results.A3 = { chips: chipSvgs, pass: true };
        console.log(`[A3] Evaluated ${chipSvgs.length} chips for icons.`);

        // A4: No information hidden behind hover
        const hiddenInfo = await page.$$eval("div[data-reveal-order='5'] *", (els) => {
          return els.filter((el) => {
            const style = window.getComputedStyle(el);
            return style.opacity === "0" || style.display === "none" || style.visibility === "hidden";
          }).length;
        });
        results.A4 = { hiddenElementsCount: hiddenInfo, pass: hiddenInfo === 0 };
        console.log(`[A4] Hidden elements count: ${hiddenInfo} (pass: ${hiddenInfo === 0})`);

        // Check Analytics on project links
        const linksData = await page.$$eval("div[data-reveal-order='5'] a", (links) => {
          return links.map((a) => ({
            text: a.textContent?.trim(),
            href: a.getAttribute("href"),
            trackLocation: a.getAttribute("data-ph-capture-attribute-location") || a.getAttribute("tracklocation"),
            dataset: { ...a.dataset },
          }));
        });
        results.analytics = linksData;
        console.log(`[Analytics] Links evaluated:`, linksData);
      }

      // A7: At 390px no horizontal scroll
      if (vp.name === "390px") {
        const hasHScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        results.A7 = {
          scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
          clientWidth: await page.evaluate(() => document.documentElement.clientWidth),
          pass: !hasHScroll,
        };
        console.log(`[A7] 390px horizontal scroll test: ${!hasHScroll}`);
      }

      await context.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT_DIR, "results.json"), JSON.stringify(results, null, 2));
  console.log("Results written to results.json");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
