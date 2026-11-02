import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "shots");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

const themes = ["dark", "light"];

(async () => {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
    args: ["--disable-service-workers"],
  });

  for (const vp of viewports) {
    for (const theme of themes) {
      console.log(`Capturing ${vp.name} in ${theme} mode...`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        colorScheme: theme,
        serviceWorkers: "block",
      });

      await context.route("**/sw.js", (route) => route.abort());

      const page = await context.newPage();

      let cssOk = false;
      page.on("response", (res) => {
        if (res.url().includes(".css") && res.status() === 200) {
          cssOk = true;
        }
      });

      await page.goto(`http://localhost:3000/projects?theme=${theme}`, {
        waitUntil: "domcontentloaded",
      });

      // Explicitly ensure theme class on root
      await page.evaluate((t) => {
        const root = document.documentElement;
        if (t === "light") {
          root.classList.remove("dark");
          root.classList.add("light");
          root.setAttribute("data-theme", "light");
          root.style.colorScheme = "light";
        } else {
          root.classList.remove("light");
          root.classList.add("dark");
          root.setAttribute("data-theme", "dark");
          root.style.colorScheme = "dark";
        }
      }, theme);

      // Wait 1.5s for poster images and dynamic diagram to settle
      await page.waitForTimeout(1500);

      const fileName = `projects-${vp.width}-${theme}.png`;
      const shotPath = path.join(outDir, fileName);
      await page.screenshot({ path: shotPath, fullPage: true });
      console.log(`Saved ${shotPath} (CSS 200: ${cssOk})`);

      await context.close();
    }
  }

  await browser.close();
  console.log("All 4 verification screenshots captured successfully.");
})();
