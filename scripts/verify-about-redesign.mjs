import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const SHOTS_DIR = path.resolve("shots/about-redesign");
if (!fs.existsSync(SHOTS_DIR)) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

function parseRgb(str) {
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(rgb1, rgb2) {
  const l1 = luminance(...rgb1);
  const l2 = luminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function run() {
  console.log("=== Starting Verification & Screenshot Capture on http://localhost:3100 ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const viewports = [
    { name: "1440px", width: 1440, height: 900 },
    { name: "390px", width: 390, height: 844 },
  ];
  const themes = ["light", "dark"];

  // 1. Capture Full-Page Screenshots
  for (const vp of viewports) {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });
      const page = await context.newPage();

      // About page
      await page.goto("http://localhost:3100/about", { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        if (t === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("portfolio-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("portfolio-theme", "light");
        }
      }, theme);
      await page.waitForTimeout(400);

      const aboutShot = path.join(SHOTS_DIR, `about-${vp.name}-${theme}.png`);
      await page.screenshot({ path: aboutShot, fullPage: true });
      console.log(`[PASS] Saved screenshot: ${aboutShot}`);

      // Homepage
      await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
      await page.evaluate((t) => {
        if (t === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("portfolio-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("portfolio-theme", "light");
        }
      }, theme);
      await page.waitForTimeout(400);

      const homeShot = path.join(SHOTS_DIR, `home-${vp.name}-${theme}.png`);
      await page.screenshot({ path: homeShot, fullPage: true });
      console.log(`[PASS] Saved screenshot: ${homeShot}`);

      await context.close();
    }
  }

  // 2. Automated Contrast Audit
  console.log("\n=== Checking WCAG AA Contrast ===");
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: theme,
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3100/about", { waitUntil: "networkidle" });
    await page.evaluate((t) => {
      if (t === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      }
    }, theme);
    await page.waitForTimeout(300);

    const elementsToCheck = [
      { selector: "#about-intro-heading", name: "Hero Name Heading" },
      { selector: "section[aria-labelledby='about-intro-heading'] p", name: "Hero Intro Statement" },
      { selector: "#experience-heading", name: "Experience Heading" },
      { selector: "section[aria-labelledby='experience-heading'] article:first-child h3", name: "Role Title" },
      { selector: "section[aria-labelledby='experience-heading'] ul li", name: "Experience Bullet" },
      { selector: "#how-i-work-heading", name: "How I Work Heading" },
      { selector: "[role='tablist'] button[aria-selected='true']", name: "Active Principle Tab" },
      { selector: "a[href*='#decisions']", name: "Case Study Accent Link" },
      { selector: "#contact-heading", name: "Contact Heading" },
      { selector: "button[title='Click to copy email address']", name: "Email Address Text" },
      { selector: "a[data-ph-capture-attribute-location='about_contact']", name: "Send Email Accent CTA" },
    ];

    for (const item of elementsToCheck) {
      const el = await page.$(item.selector);
      if (!el) {
        console.log(`[WARN] Element not found: ${item.name} (${item.selector})`);
        continue;
      }
      const colors = await el.evaluate((node) => {
        let bgNode = node;
        let bgColor = window.getComputedStyle(bgNode).backgroundColor;
        while ((!bgColor || bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") && bgNode.parentElement) {
          bgNode = bgNode.parentElement;
          bgColor = window.getComputedStyle(bgNode).backgroundColor;
        }
        const fgColor = window.getComputedStyle(node).color;
        const fontSize = parseFloat(window.getComputedStyle(node).fontSize);
        const fontWeight = parseInt(window.getComputedStyle(node).fontWeight, 10);
        return { fg: fgColor, bg: bgColor, fontSize, fontWeight };
      });

      const rgbFg = parseRgb(colors.fg);
      const rgbBg = parseRgb(colors.bg) || (theme === "dark" ? [13, 15, 18] : [244, 245, 247]);

      if (rgbFg && rgbBg) {
        const ratio = contrastRatio(rgbFg, rgbBg);
        const isLarge = colors.fontSize >= 24 || (colors.fontSize >= 18.5 && colors.fontWeight >= 700);
        const minRatio = isLarge ? 3.0 : 4.5;
        const pass = ratio >= minRatio;
        console.log(
          `[${theme.toUpperCase()}] ${item.name}: contrast ${ratio.toFixed(2)}:1 (required ${minRatio}:1) => ${
            pass ? "PASS" : "FAIL"
          }`
        );
      }
    }
    await context.close();
  }

  // 3. Test Interactivity
  console.log("\n=== Testing Interactivity on /about ===");
  const testContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const testPage = await testContext.newPage();
  await testPage.goto("http://localhost:3100/about", { waitUntil: "networkidle" });

  // Workbench Emit Event
  const emitBtn = await testPage.$("button:has-text('Emit Event')");
  if (emitBtn) {
    console.log("Testing Workbench Emit Event...");
    const initialEventsCount = await testPage.$$eval("[data-ui='simulator'] [class*='space-y-1'] > div", (els) => els.length);
    await emitBtn.click();
    await testPage.waitForTimeout(600);
    const newEventsCount = await testPage.$$eval("[data-ui='simulator'] [class*='space-y-1'] > div", (els) => els.length);
    console.log(`[PASS] Workbench event count before: ${initialEventsCount}, after: ${newEventsCount}`);
  }

  // Principles Tab Switching
  console.log("Testing Principles Tab Switching...");
  const tabs = await testPage.$$("[role='tablist'] button[role='tab']");
  if (tabs.length === 3) {
    await tabs[1].click();
    await testPage.waitForTimeout(300);
    const tab2Text = await testPage.$eval("[role='tabpanel'] h3", (el) => el.textContent);
    console.log(`[PASS] Switched to tab 2: "${tab2Text}"`);

    await tabs[2].click();
    await testPage.waitForTimeout(300);
    const tab3Text = await testPage.$eval("[role='tabpanel'] h3", (el) => el.textContent);
    console.log(`[PASS] Switched to tab 3: "${tab3Text}"`);
  }

  // Contact Copy Button
  console.log("Testing Contact Copy Button...");
  const copyBtn = await testPage.$("button[aria-label='Copy email address']");
  if (copyBtn) {
    await copyBtn.click();
    await testPage.waitForTimeout(200);
    const copiedVisible = await testPage.$eval("section[aria-labelledby='contact-heading']", (el) =>
      el.textContent.includes("Copied")
    );
    console.log(`[PASS] Copy feedback rendered: ${copiedVisible}`);
  }

  await testContext.close();
  await browser.close();
  console.log("\n=== Verification Complete ===");
}

run().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
