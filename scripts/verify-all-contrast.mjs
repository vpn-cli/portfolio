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

function oklchToRgb(L, C, h) {
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  function toSRGB(c) {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }

  return [
    Math.round(toSRGB(r) * 255),
    Math.round(toSRGB(g) * 255),
    Math.round(toSRGB(bl) * 255)
  ];
}

function parseColor(str) {
  if (str.startsWith("oklch")) {
    const m = str.match(/[\d.]+/g);
    if (m && m.length >= 3) {
      return oklchToRgb(Number(m[0]), Number(m[1]), Number(m[2]));
    }
  }
  const m = str.match(/\d+(\.\d+)?/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
}

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = {};

  for (const theme of ["light", "dark"]) {
    results[theme] = {};
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:3100/about", { waitUntil: "domcontentloaded" });

    await page.evaluate((t) => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(t);
      document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem("portfolio-theme", t);
    }, theme);

    await page.waitForTimeout(600);

    const tokenValues = await page.evaluate(() => {
      const cs = window.getComputedStyle(document.documentElement);
      const get = (v) => cs.getPropertyValue(v).trim();
      return {
        bgCanvas: get("--bg-canvas"),
        bgCanvasSubtle: get("--bg-canvas-subtle"),
        surfaceTile: get("--surface-tile"),
        surfaceTileHover: get("--surface-tile-hover"),
        surfaceTileElevated: get("--surface-tile-elevated"),
        borderSubtle: get("--border-subtle"),
        borderHover: get("--border-hover"),
        borderFocus: get("--border-focus"),
        textPrimary: get("--text-primary"),
        textSecondary: get("--text-secondary"),
        textTertiary: get("--text-tertiary"),
        accentColor: get("--accent-color"),
        accentHover: get("--accent-hover"),
        accentText: get("--accent-text"),
        accentContrast: get("--accent-contrast"),
      };
    });

    results[theme].tokens = tokenValues;

    // Check DOM elements contrast
    const domMeasurements = await page.evaluate(() => {
      function getEffectiveBg(el) {
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
            return bg;
          }
          cur = cur.parentElement;
        }
        return window.getComputedStyle(document.body).backgroundColor;
      }

      const items = [];

      // 1. Primary Heading / Text
      const h1 = document.querySelector("h1");
      if (h1) {
        const cs = window.getComputedStyle(h1);
        items.push({ role: "Primary Heading (h1)", fg: cs.color, bg: getEffectiveBg(h1) });
      }

      // 2. Primary Body Text
      const p = document.querySelector("p");
      if (p) {
        const cs = window.getComputedStyle(p);
        items.push({ role: "Body Text (p)", fg: cs.color, bg: getEffectiveBg(p) });
      }

      // 3. Secondary Text
      const sec = document.querySelector(".text-\\[var\\(--text-secondary\\)\\]");
      if (sec) {
        const cs = window.getComputedStyle(sec);
        items.push({ role: "Secondary Text", fg: cs.color, bg: getEffectiveBg(sec) });
      }

      // 4. Tertiary / Muted Text
      const tert = document.querySelector(".text-\\[var\\(--text-tertiary\\)\\]");
      if (tert) {
        const cs = window.getComputedStyle(tert);
        items.push({ role: "Tertiary/Muted Text", fg: cs.color, bg: getEffectiveBg(tert) });
      }

      // 5. Primary Button CTA
      const btn = document.querySelector(".btn-primary, [data-cta='primary']");
      if (btn) {
        const cs = window.getComputedStyle(btn);
        items.push({ role: "Primary Button Text on Accent", fg: cs.color, bg: cs.backgroundColor });
      }

      // 6. Secondary Button CTA
      const btnSec = document.querySelector(".btn-secondary, [data-cta='secondary']");
      if (btnSec) {
        const cs = window.getComputedStyle(btnSec);
        items.push({ role: "Secondary Button Text", fg: cs.color, bg: cs.backgroundColor });
      }

      // 7. Text Link
      const link = document.querySelector("a.text-link, a");
      if (link) {
        const cs = window.getComputedStyle(link);
        items.push({ role: "Link Text", fg: cs.color, bg: getEffectiveBg(link) });
      }

      return items;
    });

    results[theme].measurements = domMeasurements.map((m) => {
      const fgRgb = parseColor(m.fg);
      const bgRgb = parseColor(m.bg);
      const ratio = contrast(fgRgb, bgRgb);
      return {
        role: m.role,
        fg: m.fg,
        bg: m.bg,
        ratio: ratio.toFixed(2),
        passAA: ratio >= 4.5,
      };
    });

    await page.close();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

run();
