const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const SIZES = [
  { name: '1920', w: 1920, h: 1080 },
  { name: '1440', w: 1440, h: 900 },
  { name: '1024', w: 1024, h: 768 },
  { name: '768', w: 768, h: 1024 },
  { name: '390', w: 390, h: 844 },
];

async function captureSize({ name, w, h }) {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--window-size=${w},${h}`,
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const pages = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
  });

  const p = pages.find(x => x.type === 'page' && x.url.includes('3000'));
  if (!p) {
    console.error('No page found for', name);
    edge.kill();
    return;
  }
  const ws = new WebSocket(p.webSocketDebuggerUrl);

  return new Promise((resolve) => {
    ws.onopen = async () => {
      await new Promise(r => setTimeout(r, 1200));
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: '(() => { const el = document.querySelector(".tile-portrait"); if (!el) return null; el.scrollIntoView({ block: "center" }); return JSON.stringify(el.getBoundingClientRect()); })()',
          returnByValue: true
        }
      }));
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 1) {
        if (!msg.result || !msg.result.result || !msg.result.result.value) {
          console.error(`[${name}] Could not get rect`);
          ws.close();
          edge.kill();
          return resolve();
        }
        const rect = JSON.parse(msg.result.result.value);
        console.log(`[${name}] rect:`, rect);
        // Wait a tiny moment after scrollIntoView
        await new Promise(r => setTimeout(r, 300));
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.captureScreenshot',
          params: {
            clip: {
              x: Math.max(0, rect.x),
              y: Math.max(0, rect.y),
              width: rect.width,
              height: rect.height,
              scale: 1
            }
          }
        }));
      } else if (msg.id === 2) {
        fs.writeFileSync(`public/comparisons/tile-portrait-${name}.png`, Buffer.from(msg.result.data, 'base64'));
        console.log(`Saved tile-portrait-${name}.png`);
        ws.close();
        edge.kill();
        resolve();
      }
    };
  });
}

async function runAll() {
  for (const s of SIZES) {
    await captureSize(s);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('All viewports captured successfully!');
}

runAll().catch(console.error);
