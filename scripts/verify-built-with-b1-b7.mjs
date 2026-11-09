import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("shots/about-built-with");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function parseRgb(colorStr) {
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) {
    return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  }
  return [0, 0, 0];
}

function getContrast(rgb1, rgb2) {
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const viewports = [
    { name: "1440px", width: 1440, height: 900 },
    { name: "1024px", width: 1024, height: 800 },
    { name: "390px", width: 390, height: 844 },
  ];

  const results = {
    B1: { pass: false, details: [] },
    B2: { pass: false, details: {} },
    B3: { pass: false, details: {} },
    B4: { pass: false, details: {} },
    B5: { pass: false, details: {} },
    B6: { pass: false, details: {} },
    B7: { pass: false, details: [] },
  };

  // 1. Capture Screenshots and measure static visual criteria
  for (const vp of viewports) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });
      const page = await context.newPage();

      await page.addInitScript(() => {
        window.__debugTransitions = true;
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      });

      await page.goto("http://localhost:3100/about", { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

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

      // Screenshot the Built With block
      const builtWithEl = await page.$("div[data-reveal-order='5']");
      if (builtWithEl) {
        await builtWithEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const shotPath = path.join(OUT_DIR, `built-with-${vp.name}-${theme}.png`);
        await builtWithEl.screenshot({ path: shotPath });
        console.log(`Saved: built-with-${vp.name}-${theme}.png`);
      }

      // If 1440px dark, evaluate B2, B3, B4
      if (vp.name === "1440px" && theme === "dark") {
        // B2: Zero pill/chip elements, zero borders, zero icons
        const b2Data = await page.evaluate(() => {
          const block = document.querySelector("div[data-reveal-order='5']");
          if (!block) return { error: "Block not found" };

          const svgs = block.querySelectorAll("svg");
          const allEls = block.querySelectorAll("*");
          let borderCount = 0;
          let pillCount = 0;
          const bgBoxes = [];

          allEls.forEach((el) => {
            const cs = window.getComputedStyle(el);
            const bt = parseFloat(cs.borderTopWidth) || 0;
            const br = parseFloat(cs.borderRightWidth) || 0;
            const bb = parseFloat(cs.borderBottomWidth) || 0;
            const bl = parseFloat(cs.borderLeftWidth) || 0;
            if (bt > 0 || br > 0 || bb > 0 || bl > 0) {
              borderCount++;
            }
            // check pill/chip
            if (cs.borderRadius && parseFloat(cs.borderRadius) > 4 && cs.backgroundColor !== "rgba(0, 0, 0, 0)") {
              pillCount++;
            }
          });

          return {
            svgCount: svgs.length,
            borderCount,
            pillCount,
          };
        });

        results.B2 = {
          pass: b2Data.svgCount === 0 && b2Data.borderCount === 0 && b2Data.pillCount === 0,
          details: b2Data,
        };

        // B3: No uppercase text or letter-spacing anywhere in the block
        const b3Data = await page.evaluate(() => {
          const block = document.querySelector("div[data-reveal-order='5']");
          if (!block) return { error: "Block not found" };

          const h2 = block.querySelector("h2");
          const h2Cs = window.getComputedStyle(h2);
          const allEls = Array.from(block.querySelectorAll("*"));
          const uppercaseEls = [];
          const letterSpacingEls = [];

          allEls.forEach((el) => {
            const cs = window.getComputedStyle(el);
            if (cs.textTransform === "uppercase") {
              uppercaseEls.push({ tag: el.tagName, text: el.textContent?.slice(0, 30) });
            }
            if (cs.letterSpacing !== "normal" && parseFloat(cs.letterSpacing) !== 0) {
              letterSpacingEls.push({ tag: el.tagName, ls: cs.letterSpacing, text: el.textContent?.slice(0, 30) });
            }
          });

          return {
            headingText: h2?.textContent?.trim(),
            headingTransform: h2Cs.textTransform,
            headingLetterSpacing: h2Cs.letterSpacing,
            uppercaseCount: uppercaseEls.length,
            uppercaseEls,
            letterSpacingCount: letterSpacingEls.length,
            letterSpacingEls,
          };
        });

        results.B3 = {
          pass: b3Data.uppercaseCount === 0 && b3Data.letterSpacingCount === 0 && b3Data.headingText === "Built with",
          details: b3Data,
        };

        // B4: Each project's tools fit on at most 2 lines at 1440px
        const b4Data = await page.evaluate(() => {
          const block = document.querySelector("div[data-reveal-order='5']");
          const cols = Array.from(block.querySelectorAll(".grid > div"));
          return cols.map((col, idx) => {
            const name = col.querySelector("a, span")?.textContent?.trim();
            const toolsP = col.querySelectorAll("p")[1]; // 2nd p is tools
            const lineCount = toolsP ? toolsP.getClientRects().length : 0;
            const text = toolsP ? toolsP.textContent?.trim() : "";
            return {
              idx,
              name,
              text,
              lineCount,
              pass: lineCount <= 2,
            };
          });
        });

        results.B4 = {
          pass: b4Data.every((c) => c.pass),
          details: b4Data,
        };
      }

      // B5: Text contrast check for both light and dark
      const b5ThemeData = await page.evaluate(() => {
        const block = document.querySelector("div[data-reveal-order='5']");
        // Effective background of container / page
        const parent = block.closest(".rounded-\\[32px\\], .rounded-\\[36px\\]") || block.parentElement;
        const bgCs = window.getComputedStyle(parent);
        const bgCol = bgCs.backgroundColor;

        const h2 = block.querySelector("h2");
        const links = Array.from(block.querySelectorAll(".grid > div > div a, .grid > div > div span"));
        const taglines = Array.from(block.querySelectorAll(".grid > div > p:first-of-type"));
        const tools = Array.from(block.querySelectorAll(".grid > div > p:last-of-type"));

        return {
          bgColor: bgCol,
          h2Color: window.getComputedStyle(h2).color,
          nameColors: links.map((l) => window.getComputedStyle(l).color),
          taglineColors: taglines.map((t) => window.getComputedStyle(t).color),
          toolColors: tools.map((t) => window.getComputedStyle(t).color),
        };
      });

      const bgRgb = parseRgb(b5ThemeData.bgColor);
      const h2Ratio = getContrast(parseRgb(b5ThemeData.h2Color), bgRgb);
      const nameRatios = b5ThemeData.nameColors.map((c) => getContrast(parseRgb(c), bgRgb));
      const taglineRatios = b5ThemeData.taglineColors.map((c) => getContrast(parseRgb(c), bgRgb));
      const toolRatios = b5ThemeData.toolColors.map((c) => getContrast(parseRgb(c), bgRgb));

      const themePass =
        h2Ratio >= 4.5 &&
        nameRatios.every((r) => r >= 4.5) &&
        taglineRatios.every((r) => r >= 4.5) &&
        toolRatios.every((r) => r >= 4.5);

      results.B5.details[theme] = {
        bg: b5ThemeData.bgColor,
        h2Ratio: h2Ratio.toFixed(2),
        nameRatios: nameRatios.map((r) => r.toFixed(2)),
        taglineRatios: taglineRatios.map((r) => r.toFixed(2)),
        toolRatios: toolRatios.map((r) => r.toFixed(2)),
        pass: themePass,
      };

      // B6: Clean single-column stack at 390px, no horizontal scroll
      if (vp.name === "390px" && theme === "light") {
        const b6Data = await page.evaluate(() => {
          const doc = document.documentElement;
          const scrollWidth = doc.scrollWidth;
          const clientWidth = doc.clientWidth;
          const hasHScroll = scrollWidth > clientWidth;

          const block = document.querySelector("div[data-reveal-order='5']");
          const cols = Array.from(block.querySelectorAll(".grid > div"));
          const rects = cols.map((c) => {
            const r = c.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height };
          });

          // Verify clean vertical stacking
          let stacked = true;
          for (let i = 1; i < rects.length; i++) {
            if (rects[i].y <= rects[i - 1].y + 10) {
              stacked = false;
            }
          }

          return {
            scrollWidth,
            clientWidth,
            hasHScroll,
            stacked,
            rects,
          };
        });

        results.B6 = {
          pass: !b6Data.hasHScroll && b6Data.stacked,
          details: b6Data,
        };
      }

      await context.close();
    }
  }

  results.B5.pass = results.B5.details.light?.pass && results.B5.details.dark?.pass;

  // 2. Test B1 and B7: Navigation and nav_click event firing
  const projectTests = [
    { name: "StreamMart", expectedUrl: "/work/stream-mart", expectedLabel: "Built with: StreamMart" },
    { name: "Sportz", expectedUrl: "/work/sockets", expectedLabel: "Built with: Sportz" },
    { name: "AppForge", expectedUrl: "/work/appforge", expectedLabel: "Built with: AppForge" },
  ];

  for (const pt of projectTests) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    await page.addInitScript(() => {
      window.__debugTransitions = true;
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    await page.goto("http://localhost:3100/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Find project link
    const link = await page.$(`div[data-reveal-order='5'] a[href='${pt.expectedUrl}']`);
    if (!link) {
      results.B1.details.push({ project: pt.name, pass: false, error: "Link element not found" });
      await context.close();
      continue;
    }

    // Click link and wait for navigation
    await link.click();
    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    const cleanUrl = currentUrl.replace("http://localhost:3100", "");
    const landedCorrectly = cleanUrl === pt.expectedUrl;

    // Check captured events
    const events = await page.evaluate(() => window.__posthogEvents || []);
    const navClickEvent = events.find(
      (e) => e.name === "nav_click" && e.properties.location === "about_built_with" && e.properties.to_path === pt.expectedUrl
    );

    const eventLabelCorrect = navClickEvent?.properties?.label === pt.expectedLabel;

    results.B1.details.push({
      project: pt.name,
      landedUrl: cleanUrl,
      expectedUrl: pt.expectedUrl,
      pass: landedCorrectly,
    });

    results.B7.details.push({
      project: pt.name,
      fired: !!navClickEvent,
      label: navClickEvent?.properties?.label,
      expectedLabel: pt.expectedLabel,
      location: navClickEvent?.properties?.location,
      pass: eventLabelCorrect,
    });

    await context.close();
  }

  // Also check Clairvyn AI has NO link
  const clairvynContext = await browser.newContext();
  const clairvynPage = await clairvynContext.newPage();
  await clairvynPage.goto("http://localhost:3100/about", { waitUntil: "domcontentloaded" });
  const clairvynHasNoLink = await clairvynPage.evaluate(() => {
    const block = document.querySelector("div[data-reveal-order='5']");
    const clairvynCol = Array.from(block.querySelectorAll(".grid > div")).find((c) =>
      c.textContent?.includes("Clairvyn AI")
    );
    const link = clairvynCol?.querySelector("a");
    return link === null;
  });
  results.B1.details.push({
    project: "Clairvyn AI",
    hasNoLink: clairvynHasNoLink,
    pass: clairvynHasNoLink,
  });
  await clairvynContext.close();

  results.B1.pass = results.B1.details.every((d) => d.pass);
  results.B7.pass = results.B7.details.every((d) => d.pass);

  await browser.close();

  fs.writeFileSync(path.join(OUT_DIR, "results.json"), JSON.stringify(results, null, 2));
  console.log("\n=================== VERIFICATION RESULTS ===================");
  console.log(`B1 (Navigation to correct routes): ${results.B1.pass ? "PASS" : "FAIL"}`);
  results.B1.details.forEach((d) => console.log(`   - ${d.project}: ${d.landedUrl || (d.hasNoLink ? "No link (Plain text)" : "Failed")}`));

  console.log(`B2 (Zero pills, zero borders, zero icons): ${results.B2.pass ? "PASS" : "FAIL"}`);
  console.log(`   Details: svgs=${results.B2.details.svgCount}, borders=${results.B2.details.borderCount}, pills=${results.B2.details.pillCount}`);

  console.log(`B3 (No uppercase, no letter-spacing): ${results.B3.pass ? "PASS" : "FAIL"}`);
  console.log(`   Heading: "${results.B3.details.headingText}", uppercaseCount=${results.B3.details.uppercaseCount}, letterSpacingCount=${results.B3.details.letterSpacingCount}`);

  console.log(`B4 (Tools fit <= 2 lines at 1440px): ${results.B4.pass ? "PASS" : "FAIL"}`);
  results.B4.details.forEach((d) => console.log(`   - ${d.name}: ${d.lineCount} line(s) (${d.pass ? "PASS" : "FAIL"})`));

  console.log(`B5 (Contrast passes WCAG AA): ${results.B5.pass ? "PASS" : "FAIL"}`);
  console.log(`   Light: h2=${results.B5.details.light.h2Ratio}:1, names=${results.B5.details.light.nameRatios.join(", ")}, taglines=${results.B5.details.light.taglineRatios.join(", ")}, tools=${results.B5.details.light.toolRatios.join(", ")}`);
  console.log(`   Dark:  h2=${results.B5.details.dark.h2Ratio}:1, names=${results.B5.details.dark.nameRatios.join(", ")}, taglines=${results.B5.details.dark.taglineRatios.join(", ")}, tools=${results.B5.details.dark.toolRatios.join(", ")}`);

  console.log(`B6 (Clean single-col at 390px, no h-scroll): ${results.B6.pass ? "PASS" : "FAIL"}`);
  console.log(`   scrollWidth=${results.B6.details.scrollWidth}, clientWidth=${results.B6.details.clientWidth}, stacked=${results.B6.details.stacked}`);

  console.log(`B7 (nav_click event with right label): ${results.B7.pass ? "PASS" : "FAIL"}`);
  results.B7.details.forEach((d) => console.log(`   - ${d.project}: label="${d.label}", location="${d.location}" (${d.pass ? "PASS" : "FAIL"})`));
  console.log("============================================================\n");
}

run().catch((err) => {
  console.error("Test run error:", err);
  process.exit(1);
});
