import { chromium } from "playwright-core";

async function audit() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const slugs = ["sockets", "appforge", "stream-mart"];

  console.log("==================================================");
  console.log("VISIBLE UNEXPANDED WORD COUNT AUDIT (BUDGET: ≤350)");
  console.log("==================================================");

  for (const slug of slugs) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:3000/work/${slug}`, { waitUntil: "networkidle" });

    const result = await page.evaluate(() => {
      const sections = ["hook", "problem", "architecture", "decisions", "bugs", "next"];
      const counts = {};
      let total = 0;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) {
          counts[id] = 0;
          continue;
        }

        const clone = el.cloneNode(true);

        // Remove collapsed regions
        clone.querySelectorAll("#problem-details-panel, #try-it-details, [id*='panel']").forEach((e) => e.remove());
        clone.querySelectorAll("[aria-expanded='false']").forEach((btn) => {
          const ctrl = btn.getAttribute("aria-controls");
          if (ctrl) {
            const tgt = clone.querySelector("#" + ctrl);
            if (tgt) tgt.remove();
          }
        });

        // Split text into words
        const text = clone.innerText || "";
        const words = text.trim().split(/\s+/).filter(Boolean);
        counts[id] = words.length;
        total += words.length;
      }

      counts.total = total;
      return counts;
    });

    console.log(`\nProject: ${slug.toUpperCase()}`);
    console.log(`- 01. Hook:         ${result.hook} words`);
    console.log(`- 02. The problem:  ${result.problem} words`);
    console.log(`- 03. How it works: ${result.architecture} words`);
    console.log(`- 04. Decisions:    ${result.decisions} words`);
    console.log(`- 05. Bugs I fixed: ${result.bugs} words`);
    console.log(`- 06. Try it:       ${result.next} words`);
    console.log(`=> TOTAL VISIBLE:   ${result.total} words (Budget: ≤350) -> ${result.total <= 350 ? "PASS" : "OVER BUDGET"}`);

    await page.close();
  }

  await browser.close();
}

audit().catch(console.error);

