import { chromium } from "playwright-core";

async function measure() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  for (const w of [1440, 1024, 390]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p.goto("http://localhost:3000", { waitUntil: "load" });
    await p.waitForTimeout(2000);
    const box = await p.locator(".tile-projects").boundingBox();
    console.log(`Viewport ${w}px -> tile-projects: width=${box?.width}, height=${box?.height}`);
    await p.close();
  }
  await browser.close();
}

measure().catch(console.error);
