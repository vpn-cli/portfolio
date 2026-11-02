import { chromium } from "playwright-core";

async function inspectBuilderDetails() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto("https://appforge-studios.vercel.app/builder/demo", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("input, textarea, button")).map(el => ({
      tag: el.tagName,
      placeholder: el.getAttribute("placeholder"),
      ariaLabel: el.getAttribute("aria-label"),
      text: el.innerText ? el.innerText.trim() : "",
      className: el.className,
    }));
  });
  console.log("Inputs & Buttons count:", inputs.length);
  console.log("Inputs / Textareas:", inputs.filter(i => i.tag === "INPUT" || i.tag === "TEXTAREA"));
  console.log("Relevant buttons:", inputs.filter(i => i.tag === "BUTTON" && i.text.length > 0 && i.text.length < 30));

  await browser.close();
}

inspectBuilderDetails().catch(console.error);

