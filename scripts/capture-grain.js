const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'grain-test');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--window-size=1440,960',
    '--hide-scrollbars',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const pages = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9232/json', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
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

  const evalCode = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true
    });
    return res?.result?.value;
  };

  const captureFull = async (filename) => {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
    console.log(`Saved ${filename} (${buffer.length} bytes)`);
  };

  const captureElement = async (selector, filename) => {
    const rect = await evalCode(`(() => {
      const el = document.querySelector("${selector}");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    })()`);

    if (!rect) {
      console.log(`Element ${selector} not found`);
      return;
    }

    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        scale: 1
      }
    });
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
    console.log(`Saved crop ${filename} (${buffer.length} bytes)`);
  };

  ws.onopen = async () => {
    console.log('Debugger connected. Ensuring navigation to http://localhost:3000 ...');
    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2000));

    console.log('Waiting for page render...');
    for (let i = 0; i < 40; i++) {
      const ready = await evalCode('Boolean(document.querySelector(".bento-grid-root"))');
      if (ready) break;
      await new Promise(r => setTimeout(r, 400));
    }
    await new Promise(r => setTimeout(r, 1500));

    // Determine mode from process arguments if passed
    const mode = process.argv[2] || 'before';

    // 1. Dark Mode
    await evalCode(`(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    })()`);
    await new Promise(r => setTimeout(r, 600));

    await captureFull(`${mode}-dark.png`);
    await captureElement('.tile-intro', `${mode}-dark-intro.png`);
    await captureElement('.tile-portrait', `${mode}-dark-portrait.png`);
    await captureElement('.tile-stack', `${mode}-dark-stack.png`);
    await captureElement('.tile-theme', `${mode}-dark-theme.png`);

    // 2. Light Mode
    await evalCode(`(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    })()`);
    await new Promise(r => setTimeout(r, 600));

    await captureFull(`${mode}-light.png`);
    await captureElement('.tile-intro', `${mode}-light-intro.png`);
    await captureElement('.tile-portrait', `${mode}-light-portrait.png`);
    await captureElement('.tile-stack', `${mode}-light-stack.png`);
    await captureElement('.tile-theme', `${mode}-light-theme.png`);

    ws.close();
    edge.kill();
    process.exit(0);
  };
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
