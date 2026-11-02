import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import fs from 'node:fs';

const browser = await Browser.launch();
const page = await browser.newPage({ width: 1440, height: 900 });
await page.goto('http://localhost:3000');
await sleep(1500);

const rects = await page.eval(() => {
  const p = document.querySelector('.tile-projects');
  const b = p.querySelector('.bento-tile');
  const l = document.querySelector('.tile-links');
  const pr = p.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  const lr = l ? l.getBoundingClientRect() : null;
  const toObj = (r) => r ? ({ x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, right: r.right, bottom: r.bottom, left: r.left }) : null;
  return { pr: toObj(pr), br: toObj(br), lr: toObj(lr) };
});
console.log('Rects:', rects);

const pClip = {
  x: Math.round(rects.br.x - 10),
  y: Math.round(rects.br.y - 10),
  width: Math.round(rects.br.width + 20),
  height: Math.round(rects.br.height + 20),
  scale: 1
};
const shot = await page.screenshot({ format: 'png', clip: pClip });
fs.writeFileSync('shots/crop-projects-exact.png', shot);
console.log('Saved shots/crop-projects-exact.png');

await browser.close();
