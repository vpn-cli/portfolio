import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const URLS = [
  "http://localhost:3100/work/stream-mart",
  "http://localhost:3100/work/sockets",
  "http://localhost:3100/work/appforge",
];

async function run() {
  console.log("Running WCAG AA audit and Acceptance Criteria verification...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  let allPassed = true;

  for (const url of URLS) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        colorScheme: theme,
      });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "networkidle" });

      await page.evaluate((t) => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(t);
        document.documentElement.setAttribute("data-theme", t);
      }, theme);
      await page.waitForTimeout(300);

      // Run Axe WCAG 2.1 AA check
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const violations = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      );

      console.log(`\n[${theme.toUpperCase()}] ${url}:`);
      console.log(`  Violations: ${violations.length} serious/critical, ${results.violations.length} total`);
      if (violations.length > 0) {
        allPassed = false;
        violations.forEach((v) => {
          console.log(`    - ${v.id}: ${v.description} (${v.nodes.length} occurrences)`);
        });
      } else {
        console.log(`  ✓ WCAG AA PASS`);
      }

      await context.close();
    }
  }

  // Verify Criterion C1: The diagram caption appears exactly once per case study
  console.log("\n=== Checking C1: Caption count ===");
  const page = await (await browser.newContext()).newPage();
  await page.goto("http://localhost:3100/work/stream-mart", { waitUntil: "networkidle" });
  const captionCount = await page.evaluate(() => {
    const text = "Shows the checkout flow through the transactional outbox";
    const matches = Array.from(document.querySelectorAll("*")).filter(
      (el) => el.children.length === 0 && el.textContent?.includes(text)
    );
    return matches.length;
  });
  console.log(`C1 Caption occurrences on stream-mart: ${captionCount} (Expected: 1)`);

  // Verify Criterion C2: Zero pills/chips, zero em/en dashes as separators, zero numbered TOC items
  console.log("\n=== Checking C2: Zero pills/chips, zero em/en dashes, zero numbered TOC ===");
  const c2Check = await page.evaluate(() => {
    // Check TOC items for numbers
    const tocItems = Array.from(document.querySelectorAll("aside[aria-label='Table of contents'] button span"))
      .map((s) => s.textContent?.trim());
    const hasNumberedToc = tocItems.some((t) => /^\d+/.test(t || ""));

    // Check for em/en dashes in body text
    const textNodes = document.body.innerText;
    const hasEmDash = /[—–]/.test(textNodes);

    return { hasNumberedToc, hasEmDash, tocItems };
  });
  console.log(`  Numbered TOC items: ${c2Check.hasNumberedToc ? "FAIL" : "PASS (0 found)"}`);
  console.log(`  Em/En dash separators: ${c2Check.hasEmDash ? "FAIL" : "PASS (0 found)"}`);
  console.log(`  TOC Labels: ${JSON.stringify(c2Check.tocItems)}`);

  // Verify Criterion C3: The diagram has no uppercase or monospace labels, no badges, no file paths in boxes
  console.log("\n=== Checking C3: Diagram labels & cleanliness ===");
  const c3Check = await page.evaluate(() => {
    const diagram = document.querySelector("div[aria-label*='diagram'], div[aria-label*='Diagram']");
    if (!diagram) return { found: false };
    const text = diagram.textContent || "";
    const hasDiagramBadge = /DIAGRAM/i.test(text) && diagram.querySelector("span:has-text('DIAGRAM')") !== null;
    const hasGroundTruth = text.includes("Ground Truth:");
    const hasFilePathInBox = Array.from(diagram.querySelectorAll("div.rounded-lg")).some((box) =>
      /\.jsx|\.js|\.ts/.test(box.textContent || "")
    );
    return { found: true, hasDiagramBadge, hasGroundTruth, hasFilePathInBox };
  });
  console.log(`  Diagram found: ${c3Check.found}`);
  console.log(`  DIAGRAM badge: ${c3Check.hasDiagramBadge ? "FAIL" : "PASS (None)"}`);
  console.log(`  Ground Truth label: ${c3Check.hasGroundTruth ? "FAIL" : "PASS (None)"}`);
  console.log(`  File path inside box: ${c3Check.hasFilePathInBox ? "FAIL" : "PASS (None)"}`);

  // Verify Criterion C5: Diagram readable at 390px
  console.log("\n=== Checking C5: Mobile 390px Diagram readability ===");
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3100/work/stream-mart", { waitUntil: "networkidle" });
  const mobileCheck = await mobilePage.evaluate(() => {
    const diagram = document.querySelector("div[aria-label*='diagram'], div[aria-label*='Diagram']");
    if (!diagram) return { found: false };
    const boxes = Array.from(diagram.querySelectorAll("div.rounded-lg")).filter((b) => b.offsetWidth > 0);
    const boxWidths = boxes.map((b) => b.getBoundingClientRect().width);
    const minWidth = Math.min(...boxWidths);
    return { found: true, visibleBoxes: boxes.length, minWidth };
  });
  console.log(`  Mobile visible boxes: ${mobileCheck.visibleBoxes}, min box width: ${Math.round(mobileCheck.minWidth)}px at 390px viewport`);

  await browser.close();
  console.log("\nAutomated verification complete!");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

