import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

async function verify() {
  console.log("Verifying StreamMart case study in real browser...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  const cssRequests = [];
  page.on("response", (res) => {
    if (res.request().resourceType() === "stylesheet" || res.url().includes(".css")) {
      cssRequests.push({ url: res.url(), status: res.status() });
    }
  });

  const res = await page.goto("http://localhost:3000/work/stream-mart", {
    waitUntil: "networkidle",
  });

  console.log(`Page status: ${res.status()}`);
  console.log(`CSS responses count: ${cssRequests.length}`);
  for (const r of cssRequests) {
    console.log(`  CSS ${r.status}: ${r.url.slice(0, 80)}`);
  }

  // Check for the "Diagram" label on the page
  const diagramBadge = await page.locator("text=Diagram").first().isVisible();
  console.log(`"Diagram" label visible: ${diagramBadge}`);

  // Check for Next.js Client UI, API Gateway, Payment Service, Neon PostgreSQL, Apache Kafka
  const hasClient = await page.locator("text=Next.js Client UI").first().isVisible();
  const hasGateway = await page.locator("text=API Gateway").first().isVisible();
  const hasPayment = await page.locator("text=Payment Service").first().isVisible();
  const hasKafka = await page.locator("text=Apache Kafka Cluster").first().isVisible();
  const hasOutbox = await page.locator("text=Transactional Outbox Pattern").first().isVisible();
  console.log(`Architecture boxes visible: Client=${hasClient}, Gateway=${hasGateway}, Payment=${hasPayment}, Kafka=${hasKafka}, Outbox=${hasOutbox}`);

  // Check metrics
  const metric5 = await page.locator("text=5").first().isVisible();
  const metric3 = await page.locator("text=3").first().isVisible();
  const metricGuarantee = await page.locator("text=At-least-once").first().isVisible();
  console.log(`Metrics: 5=${metric5}, 3=${metric3}, At-least-once=${metricGuarantee}`);

  // Check real code excerpts
  const codeHasDrizzle = await page.locator("text=await db.transaction").first().isVisible();
  const hasCopyButton = await page.locator("text=Copy").first().isVisible();
  console.log(`Real code excerpt visible: ${codeHasDrizzle}, Copy button visible: ${hasCopyButton}`);

  // Check bugs
  const bug1 = await page.locator("text=81b4778").first().isVisible();
  const bug2 = await page.locator("text=204ba26").first().isVisible();
  const bug3 = await page.locator("text=a50d3a9").first().isVisible();
  console.log(`Bug commit hashes: 81b4778=${bug1}, 204ba26=${bug2}, a50d3a9=${bug3}`);

  // Take full desktop screenshot
  const shotsDir = path.resolve("shots/stream-mart-verification");
  if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });

  await page.screenshot({ path: path.join(shotsDir, "stream-mart-desktop.png"), fullPage: true });
  console.log("Saved: shots/stream-mart-verification/stream-mart-desktop.png");

  // Take mobile 390x844 screenshot
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "dark",
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000/work/stream-mart", { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: path.join(shotsDir, "stream-mart-mobile.png"), fullPage: true });
  console.log("Saved: shots/stream-mart-verification/stream-mart-mobile.png");

  await mobileContext.close();
  await context.close();
  await browser.close();
  console.log("Verification finished successfully!");
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
