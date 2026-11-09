import { chromium } from "playwright-core";

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3100/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  const info = await page.evaluate(() => {
    const hero = document.querySelector("section[aria-labelledby='about-intro-heading']");
    const metaContainer = hero.querySelector(".tabular-nums");
    const spans = Array.from(metaContainer.querySelectorAll("span.whitespace-nowrap"));
    const header = hero.children[0];
    const leftCol = header.children[0];
    const textCol = leftCol.children[1];
    const rightCol = header.children[1];
    return {
      headerWidth: header.getBoundingClientRect().width,
      leftColWidth: leftCol.getBoundingClientRect().width,
      textColWidth: textCol.getBoundingClientRect().width,
      rightColWidth: rightCol.getBoundingClientRect().width,
      metaContainerWidth: metaContainer.getBoundingClientRect().width,
      span0: spans[0] ? spans[0].getBoundingClientRect().width : null,
      span1: spans[1] ? spans[1].getBoundingClientRect().width : null,
      gap: 14,
    };
  });
  console.log("Diagnostic info:", info);
  console.log("Required width:", (info.span0 || 0) + (info.span1 || 0) + info.gap);
  console.log("Available width:", info.metaContainerWidth);
  await browser.close();
}

run();
