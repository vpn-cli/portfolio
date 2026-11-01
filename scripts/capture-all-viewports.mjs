import fs from 'node:fs';
import path from 'node:path';
import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const outDir = path.resolve(process.cwd(), 'shots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const browser = await Browser.launch();

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const vp of viewports) {
  // 1. Dark Mode
  const pageDark = await browser.newPage({ width: vp.width, height: vp.height });
  await pageDark.goto('http://localhost:3000');
  await pageDark.eval(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await sleep(1200);
  const darkBuf = await pageDark.screenshot({ format: 'png', fullPage: vp.width < 1024 });
  const darkPath = path.join(outDir, `${vp.name}-dark.png`);
  fs.writeFileSync(darkPath, darkBuf);
  console.log(`Saved ${darkPath}`);
  await pageDark.close();

  // 2. Light Mode
  const pageLight = await browser.newPage({ width: vp.width, height: vp.height });
  await pageLight.goto('http://localhost:3000');
  await pageLight.eval(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await sleep(1200);
  const lightBuf = await pageLight.screenshot({ format: 'png', fullPage: vp.width < 1024 });
  const lightPath = path.join(outDir, `${vp.name}-light.png`);
  fs.writeFileSync(lightPath, lightBuf);
  console.log(`Saved ${lightPath}`);
  await pageLight.close();
}

await browser.close();
console.log('All viewports captured successfully in light and dark mode!');
