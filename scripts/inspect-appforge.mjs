import { chromium } from "playwright-core";

async function run() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("https://appforge-studios.vercel.app", { waitUntil: "load" });
  await p.waitForTimeout(2000);
  const elements = await p.evaluate(() => {
    return Array.from(document.querySelectorAll("section, div, img, pre"))
      .filter((el) => el.getBoundingClientRect().height > 200)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: String(el.className).slice(0, 60),
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          text: el.innerText ? el.innerText.slice(0, 100).replace(/\n/g, " ") : "",
        };
      });
  });
  console.log("Elements count:", elements.length);
  for (const el of elements.slice(0, 15)) {
    console.log(el.rect, el.tag, el.className, "->", el.text.slice(0, 50));
  }
  await browser.close();
}

run().catch(console.error);

