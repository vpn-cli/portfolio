import { Browser } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const browser = await Browser.launch();
const page = await browser.newPage({ width: 768, height: 1024 });
await page.goto('http://localhost:3000');

const res = await page.eval(() => {
  const W = 768;
  const shown = (el) => {
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05;
  };
  const layerOf = (el) => {
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const pos = getComputedStyle(p).position;
      if (pos === 'fixed' || pos === 'sticky') return 'fixed';
    }
    return 'flow';
  };
  const all = [...document.querySelectorAll('*')];
  const boxes = [];
  for (const el of all) {
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    boxes.push({ el: el.tagName + '.' + (typeof el.className === 'string' ? el.className.split(' ').slice(0, 2).join('.') : ''), l: Math.round(r.left), r: Math.round(r.right), layer: layerOf(el) });
  }
  const flow = boxes.filter(b => b.layer !== 'fixed');
  const framed = flow.filter(b => b.r - b.l < W * 0.97 && b.l >= -1 && b.r <= W + 1);
  const lefts = framed.map(b => b.l).sort((a, b) => a - b);
  const pct = (arr, p) => arr[Math.floor(p * (arr.length - 1))];
  const L = pct(lefts, 0.02);
  const R = W - pct(framed.map(b => b.r).sort((a, b) => a - b), 0.98);

  const lowestLeft = framed.filter(b => b.l <= 55).slice(0, 10);
  return { L, R, totalFramed: framed.length, lowestLeft };
});

console.log(JSON.stringify(res, null, 2));
await browser.close();
