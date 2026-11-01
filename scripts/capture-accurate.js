const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function captureAccurate() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1440,1200',
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
  const ws = new WebSocket(p.webSocketDebuggerUrl);

  return new Promise((resolve) => {
    ws.onopen = async () => {
      await new Promise(r => setTimeout(r, 1200));
      // Without scrolling, since window height is 1200, row 2 is fully visible in viewport!
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: '(() => { const el = document.querySelector(".tile-portrait"); return JSON.stringify(el.getBoundingClientRect()); })()',
          returnByValue: true
        }
      }));
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 1) {
        const rect = JSON.parse(msg.result.result.value);
        console.log('Direct rect:', rect);
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.captureScreenshot',
          params: {
            clip: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              scale: 1
            }
          }
        }));
      } else if (msg.id === 2) {
        fs.writeFileSync('public/comparisons/tile-portrait-perfect.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved tile-portrait-perfect.png');
        ws.close();
        edge.kill();
        resolve();
      }
    };
  });
}

captureAccurate().catch(console.error);
