import fs from 'node:fs';
import path from 'node:path';
import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const browser = await Browser.launch();
const page = await browser.newPage({ width: 1440, height: 900 });
await page.goto('http://localhost:3000');
await sleep(1500);

const screenshot = await page.screenshot({ format: 'png' });
fs.writeFileSync('shots/live-cdp-1440.png', screenshot);
console.log('Saved shots/live-cdp-1440.png');

await browser.close();
