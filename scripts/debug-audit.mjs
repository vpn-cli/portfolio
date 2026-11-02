import { chromium } from "playwright-core";

async function debugAudit() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/work/sockets", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const html = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll("section")).map(s => s.id);
    const bodySample = document.body.innerText.slice(0, 300);
    return { title: document.title, sectionIds: ids, bodySample };
  });

  console.log("Debug page info:", html);
  await browser.close();
}

debugAudit().catch(console.error);

