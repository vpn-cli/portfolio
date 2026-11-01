const { spawn } = require('child_process');
const http = require('http');

function parseRgb(str) {
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
}

function srgbToLin(c) {
  c = c / 255.0;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relLuminance(rgb) {
  return 0.2126 * srgbToLin(rgb[0]) + 0.7152 * srgbToLin(rgb[1]) + 0.0722 * srgbToLin(rgb[2]);
}

function contrastRatio(rgb1, rgb2) {
  let l1 = relLuminance(rgb1);
  let l2 = relLuminance(rgb2);
  if (l1 < l2) [l1, l2] = [l2, l1];
  return (l1 + 0.05) / (l2 + 0.05);
}

async function verifyContrast() {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9242',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const pages = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9242/json', res => {
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

  const evalCode = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true
    });
    return res?.result?.value;
  };

  ws.onopen = async () => {
    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise(r => setTimeout(r, 2000));

    for (let i = 0; i < 30; i++) {
      const ready = await evalCode('Boolean(document.querySelector(".tile-intro"))');
      if (ready) break;
      await new Promise(r => setTimeout(r, 400));
    }

    const testThemes = ['dark', 'light'];

    for (const theme of testThemes) {
      console.log(`\n=================== ${theme.toUpperCase()} THEME WCAG CONTRAST ===================`);
      await evalCode(`(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add('${theme}');
        document.documentElement.setAttribute('data-theme', '${theme}');
        document.documentElement.style.colorScheme = '${theme}';
      })()`);
      await new Promise(r => setTimeout(r, 600));

      const results = await evalCode(`(() => {
        function getByText(text) {
          const all = Array.from(document.querySelectorAll('*'));
          const el = all.find(e => e.children.length === 0 && e.textContent.includes(text));
          if (!el) return { label: text, error: 'not found' };
          const cs = window.getComputedStyle(el);
          let parent = el.parentElement;
          let bg = 'rgb(21, 21, 21)';
          while (parent) {
            const pcs = window.getComputedStyle(parent);
            if (pcs.backgroundColor && pcs.backgroundColor !== 'rgba(0, 0, 0, 0)' && pcs.backgroundColor !== 'transparent') {
              bg = pcs.backgroundColor;
              break;
            }
            parent = parent.parentElement;
          }
          return {
            label: text,
            text: el.innerText.trim(),
            color: cs.color,
            bg: bg,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight
          };
        }

        return [
          getByText('Available for Select Projects'),
          getByText('Core engineering toolchain'),
          getByText('Appearance')
        ];
      })()`);

      for (const item of results) {
        if (item.error) {
          console.log(`${item.label}: ${item.error}`);
          continue;
        }
        const textRgb = parseRgb(item.color);
        const bgRgb = parseRgb(item.bg);
        const cr = contrastRatio(textRgb, bgRgb);
        const pass = cr >= 4.5;
        console.log(`Label: "${item.label}"`);
        console.log(`  Rendered Text: "${item.text}" | Font: ${item.fontSize} / ${item.fontWeight}`);
        console.log(`  Foreground Color: ${item.color}`);
        console.log(`  Background Color: ${item.bg}`);
        console.log(`  Contrast Ratio: ${cr.toFixed(2)}:1 [WCAG AA 4.5:1: ${pass ? 'PASSED (PASS)' : 'FAILED'}]`);
      }
    }

    ws.close();
    edge.kill();
    process.exit(0);
  };
}

verifyContrast().catch(console.error);
