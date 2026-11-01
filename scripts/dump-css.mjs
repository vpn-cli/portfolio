import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  const cssDump = await page.evaluate(() => {
    const sheets = [];
    for (const s of Array.from(document.styleSheets)) {
      try {
        let text = '';
        for (const r of Array.from(s.cssRules || [])) {
          text += r.cssText + '\n';
        }
        sheets.push({ href: s.href, rulesCount: (s.cssRules || []).length, textSnippet: text.slice(0, 1000) });
      } catch (e) {
        sheets.push({ href: s.href, error: e.message });
      }
    }
    return sheets;
  });

  console.log(JSON.stringify(cssDump, null, 2));
  await browser.close();
}

main().catch(console.error);
