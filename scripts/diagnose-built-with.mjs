import { chromium } from "playwright-core";

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3100/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  const blockInfo = await page.evaluate(() => {
    const block = document.querySelector("div[data-reveal-order='5']");
    const h2 = block.querySelector("h2");
    const grid = block.querySelector(".grid");
    const cols = Array.from(grid.children).map((c, i) => {
      const title = c.children[0];
      const tagline = c.children[1];
      const chips = c.children[2];
      return {
        idx: i,
        colHeight: c.getBoundingClientRect().height,
        titleHeight: title?.getBoundingClientRect().height,
        taglineHeight: tagline?.getBoundingClientRect().height,
        chipsHeight: chips?.getBoundingClientRect().height,
      };
    });
    const computed = window.getComputedStyle(block);
    return {
      blockHeight: block.getBoundingClientRect().height,
      paddingTop: computed.paddingTop,
      marginTop: computed.marginTop,
      h2Height: h2?.getBoundingClientRect().height,
      h2MarginBottom: window.getComputedStyle(h2).marginBottom,
      cols,
    };
  });
  console.log("Built-with block breakdown:", JSON.stringify(blockInfo, null, 2));
  await browser.close();
}

run();
