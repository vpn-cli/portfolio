import { chromium } from "playwright-core";

async function dump() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const slugs = ["sockets", "appforge", "stream-mart"];

  for (const slug of slugs) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:3000/work/${slug}`, { waitUntil: "networkidle" });
    
    const textDump = await page.evaluate(() => {
      const sections = ["hook", "problem", "architecture", "decisions", "bugs", "next"];
      const out = {};
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const clone = el.cloneNode(true);
        clone.querySelectorAll("#problem-details-panel, #try-it-details, [id*='panel']").forEach(e => e.remove());
        clone.querySelectorAll("[aria-expanded='false']").forEach(btn => {
          const ctrl = btn.getAttribute("aria-controls");
          if (ctrl) {
            const tgt = clone.querySelector("#" + ctrl);
            if (tgt) tgt.remove();
          }
        });
        out[id] = clone.innerText;
      }
      return out;
    });

    console.log(`\n=================== ${slug.toUpperCase()} ===================`);
    for (const [k, v] of Object.entries(textDump)) {
      console.log(`\n--- ${k} (${v.trim().split(/\s+/).filter(Boolean).length} words) ---`);
      console.log(v.replace(/\n+/g, " "));
    }

    await page.close();
  }

  await browser.close();
}

dump().catch(console.error);
