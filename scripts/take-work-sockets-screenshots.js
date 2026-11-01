const { spawn } = require('child_process');
const http = require('http');
const { chromium } = require('playwright-core');

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(check, 500);
        }
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Server start timed out'));
        } else {
          setTimeout(check, 500);
        }
      });
    };
    check();
  });
}

(async () => {
  console.log('Starting Next.js production server...');
  const server = spawn('npm.cmd', ['run', 'start'], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer('http://localhost:3000/work/sockets');
    console.log('Server is ready on port 3000.');

    const browser = await chromium.launch({ channel: 'msedge' });

    // ━━━ 1. DESKTOP (1440x900) ━━━
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktopPage.goto('http://localhost:3000/work/sockets', { waitUntil: 'networkidle' });

    // Desktop Dark
    await desktopPage.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: 'public/work-sockets-desktop-dark.png', fullPage: true });
    console.log('Captured work-sockets-desktop-dark.png');

    // Desktop Light
    await desktopPage.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: 'public/work-sockets-desktop-light.png', fullPage: true });
    console.log('Captured work-sockets-desktop-light.png');
    await desktopPage.close();

    // ━━━ 2. MOBILE (375x812) ━━━
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobilePage.goto('http://localhost:3000/work/sockets', { waitUntil: 'networkidle' });

    // Mobile Dark
    await mobilePage.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: 'public/work-sockets-mobile-dark.png', fullPage: true });
    console.log('Captured work-sockets-mobile-dark.png');

    // Mobile Light
    await mobilePage.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: 'public/work-sockets-mobile-light.png', fullPage: true });
    console.log('Captured work-sockets-mobile-light.png');
    await mobilePage.close();

    await browser.close();
    console.log('All case study screenshots captured successfully!');
  } finally {
    // Kill the server process tree
    if (server.pid) {
      spawn('taskkill', ['/pid', server.pid.toString(), '/T', '/F']);
    }
  }
})();
