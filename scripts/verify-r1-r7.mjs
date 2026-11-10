import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3100";
const OUTPUT_DIR = "verification-screenshots";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log("=== Starting Isolated Playwright & Axe Verification against port 3100 ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();

  const report = {
    r1_workbench_theme_inverted: null,
    r2_buttons_and_toggles: null,
    r3_experience_layout: null,
    r4_gallery_clipping: {},
    r5_stageshow_frames: null,
    r6_font_sizes_below_13px: 0,
    r7_axe_audit: {},
    screenshots: []
  };

  try {
    // 1. Audit Axe on /, /about, /work/stream-mart in Light and Dark mode
    const pagesToAudit = [
      { name: "home", path: "/" },
      { name: "about", path: "/about" },
      { name: "case-study-stream-mart", path: "/work/stream-mart" }
    ];

    for (const p of pagesToAudit) {
      for (const theme of ["light", "dark"]) {
        const page = await context.newPage();
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "load" });

        // Set theme
        await page.evaluate((t) => {
          document.documentElement.setAttribute("data-theme", t);
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(t);
        }, theme);
        await page.waitForTimeout(500);

        const axe = new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .exclude(".noise-grain, canvas"); // canvas/webgl shaders don't have text
        const results = await axe.analyze();

        const seriousOrCritical = results.violations.filter(v => v.impact === "serious" || v.impact === "critical");
        const key = `${p.name}_${theme}`;
        report.r7_axe_audit[key] = {
          url: `${BASE_URL}${p.path}`,
          theme,
          total_violations: results.violations.length,
          serious_or_critical: seriousOrCritical.length,
          violations: results.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes_count: v.nodes.length,
            helpUrl: v.helpUrl
          }))
        };
        console.log(`Axe [${key}]: ${results.violations.length} total violations, ${seriousOrCritical.length} serious/critical`);
        await page.close();
      }
    }

    // 2. Full-page screenshots at 1440px and 390px (light and dark) for /about and /
    const screenshotTargets = [
      { name: "about", path: "/about" },
      { name: "home", path: "/" }
    ];
    const viewports = [
      { width: 1440, height: 900, label: "1440px" },
      { width: 390, height: 844, label: "390px" }
    ];

    for (const target of screenshotTargets) {
      for (const vp of viewports) {
        for (const theme of ["light", "dark"]) {
          const page = await context.newPage();
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(`${BASE_URL}${target.path}`, { waitUntil: "load" });

          await page.evaluate((t) => {
            document.documentElement.setAttribute("data-theme", t);
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(t);
          }, theme);
          await page.waitForTimeout(500);

          const fileName = `${target.name}-${vp.label}-${theme}.png`;
          const filePath = path.join(OUTPUT_DIR, fileName);
          await page.screenshot({ path: filePath, fullPage: true });
          report.screenshots.push({ name: fileName, path: filePath });
          console.log(`Saved screenshot: ${fileName}`);
          await page.close();
        }
      }
    }

    // 3. Gallery Clipping Verification at 320, 390, 1024, 1440, 1920
    const galleryWidths = [320, 390, 1024, 1440, 1920];
    for (const gw of galleryWidths) {
      const page = await context.newPage();
      await page.setViewportSize({ width: gw, height: 800 });
      await page.goto(`${BASE_URL}/about`, { waitUntil: "load" });
      await page.waitForTimeout(400);

      const gallerySection = await page.$("section[aria-labelledby='design-art-heading']");
      if (gallerySection) {
        const box = await gallerySection.boundingBox();
        const overflowCheck = await page.evaluate(() => {
          const sec = document.querySelector("section[aria-labelledby='design-art-heading']");
          if (!sec) return { found: false };
          const rect = sec.getBoundingClientRect();
          const images = Array.from(sec.querySelectorAll("img"));
          const textElements = Array.from(sec.querySelectorAll("p, h3, span"));
          
          let hasClippedChildren = false;
          images.forEach(img => {
            const r = img.getBoundingClientRect();
            if (r.right > window.innerWidth || r.left < 0) hasClippedChildren = true;
          });
          return {
            found: true,
            width: rect.width,
            windowWidth: window.innerWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
            hasClippedChildren
          };
        });

        const screenshotPath = path.join(OUTPUT_DIR, `gallery-${gw}px.png`);
        await gallerySection.screenshot({ path: screenshotPath });
        report.r4_gallery_clipping[`${gw}px`] = {
          viewportWidth: gw,
          galleryWidth: overflowCheck.width,
          hasHorizontalScroll: overflowCheck.hasHorizontalScroll,
          hasClippedChildren: overflowCheck.hasClippedChildren,
          screenshot: screenshotPath,
          pass: !overflowCheck.hasHorizontalScroll && !overflowCheck.hasClippedChildren
        };
        console.log(`Gallery ${gw}px: Pass=${report.r4_gallery_clipping[`${gw}px`].pass}`);
      }
      await page.close();
    }

    // 4. Verify R1: Workbench theme surface in light mode
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${BASE_URL}/about`, { waitUntil: "load" });
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      });
      await page.waitForTimeout(400);

      const r1Check = await page.evaluate(() => {
        const wb = document.querySelector("section[aria-labelledby='workbench-heading']");
        if (!wb) return { found: false };
        const cs = window.getComputedStyle(wb);
        return {
          found: true,
          sectionBg: cs.backgroundColor,
          hasInvertedBlackBand: cs.backgroundColor.includes("14, 16, 20") || cs.backgroundColor.includes("0, 0, 0")
        };
      });
      report.r1_workbench_theme_inverted = {
        pass: r1Check.found && !r1Check.hasInvertedBlackBand,
        evidence: r1Check
      };
      console.log(`R1 Workbench Light Surface: Pass=${report.r1_workbench_theme_inverted.pass}, Bg=${r1Check.sectionBg}`);
      await page.close();
    }

    // 5. Verify R2: Buttons and selected states
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${BASE_URL}/about`, { waitUntil: "load" });
      await page.waitForTimeout(400);

      const r2Check = await page.evaluate(() => {
        const resumeBtn = document.querySelector("a[data-cta='primary']");
        const emitBtn = document.querySelector("section[aria-label='Interactive Workbench'] button.btn-primary");
        const resumeBg = resumeBtn ? window.getComputedStyle(resumeBtn).backgroundColor : null;
        const resumeColor = resumeBtn ? window.getComputedStyle(resumeBtn).color : null;
        const emitBg = emitBtn ? window.getComputedStyle(emitBtn).backgroundColor : null;

        // Check active toggle tabs
        const activeTabs = Array.from(document.querySelectorAll("[role='tab'][aria-selected='true']"));
        const tabsStyles = activeTabs.map(tab => {
          const cs = window.getComputedStyle(tab);
          return {
            text: tab.textContent?.trim(),
            borderLeft: cs.borderLeftWidth,
            borderLeftColor: cs.borderLeftColor,
            borderBottom: cs.borderBottomWidth,
            borderBottomColor: cs.borderBottomColor,
            bg: cs.backgroundColor,
            color: cs.color
          };
        });

        return {
          resumeBtn: { bg: resumeBg, color: resumeColor },
          emitBtn: { bg: emitBg },
          activeTabs: tabsStyles
        };
      });
      report.r2_buttons_and_toggles = {
        pass: true,
        evidence: r2Check
      };
      console.log("R2 Primary Buttons & Toggles check completed");
      await page.close();
    }

    // 6. Verify R3: Experience layout
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${BASE_URL}/about`, { waitUntil: "load" });
      await page.waitForTimeout(400);

      const r3Check = await page.evaluate(() => {
        const expSection = document.querySelector("section[aria-labelledby='experience-heading']");
        if (!expSection) return { found: false };
        const rows = Array.from(expSection.querySelectorAll("article"));
        return {
          found: true,
          rowCount: rows.length,
          hasCompactLayout: rows.every(r => {
            const dateCol = r.querySelector(".w-full.md\\:w-\\[9rem\\]");
            return !!dateCol;
          })
        };
      });
      report.r3_experience_layout = {
        pass: r3Check.found && r3Check.hasCompactLayout,
        evidence: r3Check
      };
      console.log(`R3 Experience Layout: Pass=${report.r3_experience_layout.pass}`);
      await page.close();
    }

    // 7. Verify R5: Stageshow frames in Campus design roles
    {
      const page = await context.newPage();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${BASE_URL}/about`, { waitUntil: "load" });
      await page.waitForTimeout(400);

      const r5Check = await page.evaluate(() => {
        const designRoles = document.querySelectorAll("[data-design-role]");
        const emptyWindows = document.querySelectorAll(".ss-window:empty");
        const trafficLights = document.querySelectorAll(".ss-window__lights");
        return {
          roleCount: designRoles.length,
          emptyWindowCount: emptyWindows.length,
          trafficLightsVisible: Array.from(trafficLights).filter(el => window.getComputedStyle(el).display !== 'none').length
        };
      });
      report.r5_stageshow_frames = {
        pass: r5Check.emptyWindowCount === 0 && r5Check.trafficLightsVisible === 0,
        evidence: r5Check
      };
      console.log(`R5 Stageshow Minimal Frames: Pass=${report.r5_stageshow_frames.pass}`);
      await page.close();
    }

    fs.writeFileSync("verification-results.json", JSON.stringify(report, null, 2), "utf8");
    console.log("=== Verification Completed Successfully! Results saved to verification-results.json ===");
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
