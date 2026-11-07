import { chromium } from "playwright-core";

async function runNormalFlow() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__POSTHOG_DEBUG = true;
    window.__posthogEvents = [];
  });

  console.log("[Test 1] Navigating to http://localhost:3100/ ...");
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });

  const byteTile = page.locator('[aria-label="Pat Byte"]');
  await byteTile.waitFor({ state: "visible", timeout: 10000 });

  console.log("[Test 1] Scrolling Byte tile into view...");
  await byteTile.scrollIntoViewIfNeeded();

  console.log("[Test 1] Waiting 2 seconds for byte_viewed and byte_scene_loaded...");
  await page.waitForTimeout(2000);

  console.log("[Test 1] Patting Byte 5 times (600ms apart)...");
  for (let i = 1; i <= 5; i++) {
    await byteTile.click();
    console.log(`[Test 1] Pat ${i}/5 clicked`);
    await page.waitForTimeout(600);
  }

  console.log("[Test 1] Waiting 4s for pat batch flush...");
  await page.waitForTimeout(4000);

  const events = await page.evaluate(() => {
    return window.__posthogEvents || [];
  });

  console.log("\n================ ORDERED POSTHOG EVENTS ================");
  console.log(JSON.stringify(events, null, 2));
  console.log("========================================================\n");

  await browser.close();
  return events;
}

async function runNoWebGLFlow() {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  const page = await context.newPage();

  // Mock WebGL disabled
  await page.addInitScript(() => {
    window.__POSTHOG_DEBUG = true;
    window.__posthogEvents = [];
    // Disable WebGL
    HTMLCanvasElement.prototype.getContext = function (type) {
      if (type.includes("webgl")) return null;
      return null;
    };
    delete window.WebGLRenderingContext;
  });

  console.log("[Test 2: no_webgl] Navigating to http://localhost:3100/ ...");
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });

  const byteTile = page.locator(".w-full.h-full.relative.overflow-hidden");
  await byteTile.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const events = await page.evaluate(() => {
    return window.__posthogEvents || [];
  });

  const posterSvg = page.locator('svg[viewBox="0 0 200 200"]');
  const isPosterVisible = await posterSvg.isVisible();

  console.log("\n================ NO_WEBGL TEST RESULTS ================");
  console.log("Fallback BytePoster SVG visible:", isPosterVisible);
  console.log("Events:", JSON.stringify(events, null, 2));
  console.log("========================================================\n");

  await browser.close();
}

async function main() {
  await runNormalFlow();
  await runNoWebGLFlow();
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
