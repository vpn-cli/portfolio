import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const artifactDir = "C:\\Users\\vipin\\.gemini\\antigravity\\brain\\5faaebf7-27e0-465c-885c-07f87fa60484\\screenshots";
fs.mkdirSync(artifactDir, { recursive: true });

async function run() {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--headless=new"],
  });

  const viewports = [
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "desktop-1280", width: 1280, height: 800 },
    { name: "tablet-1024", width: 1024, height: 768 },
    { name: "mobile-390", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    for (const theme of ["dark", "light"]) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });

      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      if (theme === "light") {
        await page.evaluate(() => {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        });
        await page.waitForTimeout(300);
      } else {
        await page.evaluate(() => {
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
        });
        await page.waitForTimeout(300);
      }

      // Capture full viewport
      const fullPath = path.join(artifactDir, `${vp.name}-${theme}.png`);
      await page.screenshot({ path: fullPath });
      console.log(`Saved: ${fullPath}`);

      // Capture cropped Selected Work tile
      const tileProjects = page.locator(".tile-projects");
      if (await tileProjects.count() > 0) {
        const tilePath = path.join(artifactDir, `tile-projects-${vp.name}-${theme}.png`);
        await tileProjects.screenshot({ path: tilePath });
        console.log(`Saved: ${tilePath}`);
      }

      // For 1440, capture cropped Links tile
      if (vp.name === "desktop-1440") {
        const tileLinks = page.locator(".tile-links");
        if (await tileLinks.count() > 0) {
          const linksPath = path.join(artifactDir, `tile-links-${vp.name}-${theme}.png`);
          await tileLinks.screenshot({ path: linksPath });
          console.log(`Saved: ${linksPath}`);
        }
      }

      await page.close();
    }
  }

  // Hover verification across rows 0, 1, 2 on 1440 desktop
  const hoverPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await hoverPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await hoverPage.waitForTimeout(500);

  const rows = hoverPage.locator(".tile-projects .group\\/row");
  const rowCount = await rows.count();
  console.log(`Verifying hover across ${rowCount} project rows...`);

  const projectNames = ["appforge", "stream-mart", "sportz"];
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    await row.hover();
    await hoverPage.waitForTimeout(400); // 250ms crossfade

    const hoverCrop = path.join(artifactDir, `hover-${projectNames[i] || i}.png`);
    await hoverPage.locator(".tile-projects").screenshot({ path: hoverCrop });
    console.log(`Saved hover state for ${projectNames[i]}: ${hoverCrop}`);
  }

  // Verification metrics
  const domMetrics = await hoverPage.evaluate(() => {
    const linksTile = document.querySelector(".tile-links");
    const subtexts = Array.from(linksTile?.querySelectorAll("span") || [])
      .map((s) => s.textContent?.trim() || "")
      .filter((t) => t.includes("/in/"));

    const projectsTile = document.querySelector(".tile-projects .bento-tile");
    const tileRect = projectsTile?.getBoundingClientRect();
    const style = projectsTile ? window.getComputedStyle(projectsTile) : null;

    const rowElements = Array.from(document.querySelectorAll(".tile-projects .group\\/row"));
    const rowData = rowElements.map((r) => {
      const title = r.querySelector("span.font-medium")?.textContent?.trim();
      const summary = r.querySelector("p")?.textContent?.trim();
      const tags = Array.from(r.querySelectorAll("span.border")).map((t) => t.textContent?.trim());
      const icons = Array.from(r.querySelectorAll("a svg")).length;
      return { title, summary, summaryLen: summary?.length, tags, iconsCount: icons };
    });

    return {
      linkedinSubtext: subtexts[0] || "not found",
      tileBorder: style?.border,
      tileBorderRadius: style?.borderRadius,
      tileRect: tileRect ? { width: tileRect.width, height: tileRect.height } : null,
      rows: rowData,
    };
  });

  console.log("FINAL VERIFICATION DOM METRICS:\n", JSON.stringify(domMetrics, null, 2));

  await hoverPage.close();
  await browser.close();
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
