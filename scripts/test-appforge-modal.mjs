import { chromium } from "playwright-core";

async function test() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://appforge-studios.vercel.app/builder/demo", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  const askAiBtn = page.locator("text=Ask AI");
  await askAiBtn.click();
  await page.waitForTimeout(1000);

  const textareas = page.locator("textarea");
  const count = await textareas.count();
  console.log("Total textareas:", count);

  for (let i = 0; i < count; i++) {
    const box = await textareas.nth(i).boundingBox();
    const placeholder = await textareas.nth(i).getAttribute("placeholder");
    console.log(`Textarea ${i}: placeholder="${placeholder}", box=`, box);
  }

  // Find the AI copilot chat/modal container
  const modalInfo = await page.evaluate(() => {
    // Look for element containing "Ask AI" or chat interface
    const inputs = document.querySelectorAll("textarea");
    if (inputs.length < 2) return null;
    const aiInput = inputs[inputs.length - 1]; // usually the last textarea
    
    // Find the enclosing card or floating container
    let el = aiInput;
    let card = null;
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'absolute' || el.classList.contains('rounded-lg') || el.classList.contains('rounded-xl') || el.classList.contains('border')) {
        card = el;
      }
      el = el.parentElement;
    }
    return card ? {
      tag: card.tagName,
      className: card.className,
      rect: card.getBoundingClientRect(),
      innerHTMLPrefix: card.innerHTML.slice(0, 200)
    } : null;
  });

  console.log("Modal info:", JSON.stringify(modalInfo, null, 2));

  await browser.close();
}

test().catch(console.error);
