import { chromium } from "playwright-core";

function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  const l1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function parseRgb(str) {
  const m = str.match(/\d+/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
}

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = {};

  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:3100/about", { waitUntil: "domcontentloaded" });
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
    await page.waitForTimeout(400);

    const colors = await page.evaluate(() => {
      const chip = document.querySelector("div[data-reveal-order='5'] span.tabular-nums");
      const cs = window.getComputedStyle(chip);
      return {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
      };
    });

    const textRgb = parseRgb(colors.color);
    const bgRgb = parseRgb(colors.backgroundColor);
    const ratio = contrast(textRgb, bgRgb);
    results[theme] = {
      color: colors.color,
      backgroundColor: colors.backgroundColor,
      ratio: ratio.toFixed(2),
      passAA: ratio >= 4.5,
    };
  }

  console.log("Contrast results:", results);
  await browser.close();
}

run();
