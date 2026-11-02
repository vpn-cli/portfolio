import { chromium } from "playwright-core";

async function inspectBento() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  for (const w of [1440, 1024, 390]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const data = await page.evaluate(() => {
      const tiles = [
        "tile-intro",
        "tile-projects",
        "tile-about",
        "tile-portrait",
        "tile-links",
        "tile-stack",
        "tile-byte",
        "tile-contact",
      ];
      const res = {};
      for (const t of tiles) {
        const el = document.querySelector("." + t);
        if (el) {
          const r = el.getBoundingClientRect();
          res[t] = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        }
      }
      return res;
    });

    console.log(`\n=== Viewport ${w}px ===`);
    console.table(data);
    await page.close();
  }
  await browser.close();
}

inspectBento().catch(console.error);

