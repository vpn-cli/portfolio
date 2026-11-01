const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const VIEWPORTS = [
  { name: 'desktop-1920', width: 1920, height: 1080, mobile: false },
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'desktop-1024', width: 1024, height: 768, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
];

async function capture() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--hide-scrollbars',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const pages = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9224/json', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
  });

  const p = pages.find(x => x.type === 'page' && x.url.includes('3000'));
  const ws = new WebSocket(p.webSocketDebuggerUrl);

  let idCounter = 1;
  const send = (method, params = {}) => {
    const id = idCounter++;
    return new Promise((resolve) => {
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  ws.onopen = async () => {
    for (const vp of VIEWPORTS) {
      console.log(`Setting device metrics for ${vp.name} (${vp.width}x${vp.height})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });

      await new Promise(r => setTimeout(r, 1200));

      const screenshot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });

      fs.writeFileSync(`public/screenshots/${vp.name}.png`, Buffer.from(screenshot.data, 'base64'));
      console.log(`Saved public/screenshots/${vp.name}.png`);
    }

    edge.kill();
    process.exit(0);
  };
}

capture();
