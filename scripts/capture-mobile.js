const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function captureMobile() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
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
      await new Promise(r => setTimeout(r, 1500));
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
        const rect = JSON.parse(msg.result.result.value);
        console.log('Mobile rect:', rect);
        await new Promise(r => setTimeout(r, 400));
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
        fs.writeFileSync('public/comparisons/tile-portrait-mobile-390.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved tile-portrait-mobile-390.png');
        ws.close();
        edge.kill();
        resolve();
      }
    };
  });
}

captureMobile().catch(console.error);
