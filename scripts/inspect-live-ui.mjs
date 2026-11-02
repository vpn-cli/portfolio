import { chromium } from "playwright-core";

async function run() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Loading AppForge...");
  await p.goto("https://appforge-studios.vercel.app", { waitUntil: "load" });
  await p.waitForTimeout(2000);
  const appforgeElements = await p.evaluate(() => {
    return Array.from(document.querySelectorAll("section, div, pre, main"))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: String(el.className).slice(0, 50),
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          text: el.innerText ? el.innerText.slice(0, 80).replace(/\n/g, " ") : "",
        };
      })
      .filter((e) => e.rect.w >= 300 && e.rect.h >= 200 && e.rect.y >= 0);
  });
  console.log("AppForge elements found:", appforgeElements.length);
  console.log(JSON.stringify(appforgeElements.slice(0, 8), null, 2));

  console.log("\nLoading Sportz...");
  await p.goto("https://sportz-rho.vercel.app", { waitUntil: "load" });
  await p.waitForTimeout(3000);
  const sportzElements = await p.evaluate(() => {
    return Array.from(document.querySelectorAll("main, section, div"))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: String(el.className).slice(0, 50),
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          text: el.innerText ? el.innerText.slice(0, 80).replace(/\n/g, " ") : "",
        };
      })
      .filter((e) => e.rect.w >= 300 && e.rect.h >= 200 && e.rect.y >= 0);
  });
  console.log("Sportz elements found:", sportzElements.length);
  console.log(JSON.stringify(sportzElements.slice(0, 8), null, 2));

  await browser.close();
}

run().catch(console.error);

