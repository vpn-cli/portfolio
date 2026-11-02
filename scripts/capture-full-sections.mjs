import { chromium } from "playwright-core";
import fs from "fs";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const runs = [
    { name: "sockets-dark-full", path: "/work/sockets?theme=dark", width: 1440, height: 900, dark: true },
    { name: "sockets-light-full", path: "/work/sockets?theme=light", width: 1440, height: 900, dark: false },
    { name: "sockets-mobile-375", path: "/work/sockets?theme=dark", width: 375, height: 812, dark: true },
    { name: "stream-mart-full", path: "/work/stream-mart?theme=dark", width: 1440, height: 900, dark: true },
    { name: "appforge-full", path: "/work/appforge?theme=dark", width: 1440, height: 900, dark: true },
    { name: "work-listing-full", path: "/work?theme=dark", width: 1440, height: 900, dark: true },
  ];

  for (const r of runs) {
    const context = await browser.newContext({
      viewport: { width: r.width, height: r.height },
      colorScheme: r.dark ? "dark" : "light",
    });
    const page = await context.newPage();
    const url = `http://localhost:3001${r.path}`;
    await page.goto(url, { waitUntil: "networkidle" });

    // Set theme explicitly
    await page.evaluate((isDark) => {
      const root = document.documentElement;
      if (isDark) {
        root.classList.remove("light");
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
        root.setAttribute("data-theme", "light");
        root.style.colorScheme = "light";
      }
    }, r.dark);

    await page.waitForTimeout(500);

    const outPath = `shots/redesign/${r.name}.png`;
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved full page screenshot: ${outPath}`);

    await context.close();
  }

  await browser.close();
  console.log("Full page captures complete!");
})();

