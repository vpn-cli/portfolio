import { chromium } from "playwright-core";
import fs from "fs";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const urls = [
    { name: "projects", path: "/projects" },
    { name: "work-listing", path: "/work" },
    { name: "sockets", path: "/work/sockets" },
    { name: "stream-mart", path: "/work/stream-mart" },
    { name: "appforge", path: "/work/appforge" },
  ];

  const viewports = [
    { name: "desktop-dark", width: 1440, height: 900, dark: true },
    { name: "desktop-light", width: 1440, height: 900, dark: false },
    { name: "mobile-375-dark", width: 375, height: 812, dark: true },
    { name: "mobile-375-light", width: 375, height: 812, dark: false },
  ];

  if (!fs.existsSync("shots/redesign")) {
    fs.mkdirSync("shots/redesign", { recursive: true });
  }

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: vp.dark ? "dark" : "light",
    });
    const page = await context.newPage();

    for (const item of urls) {
      const url = `http://localhost:3001${item.path}`;
      const cssRequests = [];

      page.on("response", (res) => {
        const u = res.url();
        if (u.includes(".css") || res.headers()["content-type"]?.includes("text/css")) {
          cssRequests.push({ url: u, status: res.status() });
        }
      });

      console.log(`Testing ${url} on ${vp.name}...`);
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      console.log(`  -> Status: ${response?.status()}`);

      if (cssRequests.length > 0) {
        const all200 = cssRequests.every((c) => c.status === 200);
        console.log(`  -> CSS Requests (${cssRequests.length}) all 200: ${all200}`);
      }

      // Check headings and text
      const heading = await page.locator("h1").first().textContent();
      console.log(`  -> H1: "${heading?.trim()}"`);

      // Screenshot
      const shotPath = `shots/redesign/${item.name}-${vp.name}.png`;
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`  -> Saved screenshot: ${shotPath}`);
    }

    await context.close();
  }

  await browser.close();
  console.log("All visual and responsive checks complete!");
})();

