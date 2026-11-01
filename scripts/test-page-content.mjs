import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const browser = await Browser.launch();
const page = await browser.newPage({ width: 1440, height: 900 });
await page.goto('http://localhost:3001');
await sleep(2500);

const html = await page.eval(() => document.documentElement.outerHTML);
console.log('HTML length:', html.length);
console.log('Title:', await page.eval(() => document.title));
console.log('BentoTile count:', await page.eval(() => document.querySelectorAll('.bento-tile').length));
console.log('Selected work heading:', await page.eval(() => {
  const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Selected work'));
  return el ? el.outerHTML : 'NOT FOUND';
}));

await browser.close();
