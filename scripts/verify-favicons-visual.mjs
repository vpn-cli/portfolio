import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = "verification-screenshots";
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Convert local image files to base64 data URIs for embedding in verification templates
function toDataUri(filePath, mime = "image/png") {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

async function run() {
  console.log("=== Running Favicons Visual Verification ===");

  const icon16Uri = toDataUri("scripts/small-16.png");
  const icon32Uri = toDataUri("scripts/small-32.png");
  const icon180Uri = toDataUri("app/apple-icon.png");
  const icon512Uri = toDataUri("app/icon.png");

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // 1. Generate Side-by-side comparison page in Light Theme
  const pageLight = await context.newPage();
  const htmlSideBySideLight = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Favicon & Icons Verification — Light Theme</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #F4F5F7; color: #18181B; padding: 48px; }
    h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
    p.desc { font-size: 14px; color: #71717A; margin-bottom: 36px; }
    .card { background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); margin-bottom: 32px; }
    .grid { display: flex; align-items: flex-end; justify-content: flex-start; gap: 40px; flex-wrap: wrap; }
    .item { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .item-label { font-size: 13px; font-weight: 500; color: #52525B; }
    .item-sub { font-size: 11px; color: #A1A1AA; }
    .icon-box { background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .badge { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: #EEF2FF; color: #4338CA; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>Favicon & App Icon System — Light Background Audit</h1>
  <p class="desc">Verifying 16px, 32px (crisp solid red core) and 180px, 512px (smooth glowing mark on transparency/near-black). No black fringe or halo.</p>
  
  <div class="card">
    <div class="grid">
      <!-- 16px -->
      <div class="item">
        <div class="icon-box" style="width: 72px; height: 72px;">
          <img src="${icon16Uri}" width="16" height="16" style="image-rendering: pixelated;" alt="16px Favicon">
        </div>
        <div class="item-label">16 × 16 px</div>
        <div class="item-sub">1x native tab</div>
        <span class="badge">Small (Solid Core)</span>
      </div>

      <!-- 16px zoomed -->
      <div class="item">
        <div class="icon-box" style="width: 88px; height: 88px;">
          <img src="${icon16Uri}" width="48" height="48" style="image-rendering: pixelated;" alt="16px Zoomed">
        </div>
        <div class="item-label">16 px (3x zoom)</div>
        <div class="item-sub">Pixel grid clarity</div>
        <span class="badge">Pixel-sharp</span>
      </div>

      <!-- 32px -->
      <div class="item">
        <div class="icon-box" style="width: 88px; height: 88px;">
          <img src="${icon32Uri}" width="32" height="32" alt="32px Favicon">
        </div>
        <div class="item-label">32 × 32 px</div>
        <div class="item-sub">Retina tab icon</div>
        <span class="badge">Small (Solid Core)</span>
      </div>

      <!-- 32px zoomed -->
      <div class="item">
        <div class="icon-box" style="width: 112px; height: 112px;">
          <img src="${icon32Uri}" width="64" height="64" alt="32px Zoomed">
        </div>
        <div class="item-label">32 px (2x zoom)</div>
        <div class="item-sub">High-DPI tab preview</div>
        <span class="badge">Retina Sharp</span>
      </div>

      <!-- 180px -->
      <div class="item">
        <div class="icon-box" style="padding: 12px; background: #F4F5F7;">
          <img src="${icon180Uri}" width="180" height="180" alt="Apple Touch Icon">
        </div>
        <div class="item-label">180 × 180 px</div>
        <div class="item-sub">apple-icon.png (iOS tile)</div>
        <span class="badge">Large (Glow on Squircle)</span>
      </div>

      <!-- 512px -->
      <div class="item">
        <div class="icon-box" style="padding: 12px; background: #FFFFFF; border-style: dashed;">
          <img src="${icon512Uri}" width="256" height="256" alt="512px Icon">
        </div>
        <div class="item-label">512 × 512 px</div>
        <div class="item-sub">icon.png (PWA / Master, scaled 50%)</div>
        <span class="badge">Large (Glowing Mark)</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  await pageLight.setContent(htmlSideBySideLight);
  await pageLight.screenshot({ path: `${OUTPUT_DIR}/icons-side-by-side-light.png`, fullPage: true });
  console.log(`Saved ${OUTPUT_DIR}/icons-side-by-side-light.png`);

  // 2. Generate Side-by-side comparison page in Dark Theme
  const pageDark = await context.newPage();
  const htmlSideBySideDark = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Favicon & Icons Verification — Dark Theme</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0B0D11; color: #F4F5F7; padding: 48px; }
    h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #FFFFFF; }
    p.desc { font-size: 14px; color: #A1A1AA; margin-bottom: 36px; }
    .card { background: #12141A; border: 1px solid #27272A; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); margin-bottom: 32px; }
    .grid { display: flex; align-items: flex-end; justify-content: flex-start; gap: 40px; flex-wrap: wrap; }
    .item { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .item-label { font-size: 13px; font-weight: 500; color: #D4D4D8; }
    .item-sub { font-size: 11px; color: #71717A; }
    .icon-box { background: #181B22; border: 1px solid #2E333D; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .badge { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: rgba(229,25,38,0.15); color: #FF4D55; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>Favicon & App Icon System — Dark Background Audit</h1>
  <p class="desc">Verifying 16px, 32px (crisp solid red core) and 180px, 512px (smooth glowing mark on transparency/near-black). Vibrant contrast on dark UI.</p>
  
  <div class="card">
    <div class="grid">
      <!-- 16px -->
      <div class="item">
        <div class="icon-box" style="width: 72px; height: 72px;">
          <img src="${icon16Uri}" width="16" height="16" style="image-rendering: pixelated;" alt="16px Favicon">
        </div>
        <div class="item-label">16 × 16 px</div>
        <div class="item-sub">1x native tab</div>
        <span class="badge">Small (Solid Core)</span>
      </div>

      <!-- 16px zoomed -->
      <div class="item">
        <div class="icon-box" style="width: 88px; height: 88px;">
          <img src="${icon16Uri}" width="48" height="48" style="image-rendering: pixelated;" alt="16px Zoomed">
        </div>
        <div class="item-label">16 px (3x zoom)</div>
        <div class="item-sub">Pixel grid clarity</div>
        <span class="badge">Pixel-sharp</span>
      </div>

      <!-- 32px -->
      <div class="item">
        <div class="icon-box" style="width: 88px; height: 88px;">
          <img src="${icon32Uri}" width="32" height="32" alt="32px Favicon">
        </div>
        <div class="item-label">32 × 32 px</div>
        <div class="item-sub">Retina tab icon</div>
        <span class="badge">Small (Solid Core)</span>
      </div>

      <!-- 32px zoomed -->
      <div class="item">
        <div class="icon-box" style="width: 112px; height: 112px;">
          <img src="${icon32Uri}" width="64" height="64" alt="32px Zoomed">
        </div>
        <div class="item-label">32 px (2x zoom)</div>
        <div class="item-sub">High-DPI tab preview</div>
        <span class="badge">Retina Sharp</span>
      </div>

      <!-- 180px -->
      <div class="item">
        <div class="icon-box" style="padding: 12px; background: #0B0D11;">
          <img src="${icon180Uri}" width="180" height="180" alt="Apple Touch Icon">
        </div>
        <div class="item-label">180 × 180 px</div>
        <div class="item-sub">apple-icon.png (iOS tile)</div>
        <span class="badge">Large (Glow on Squircle)</span>
      </div>

      <!-- 512px -->
      <div class="item">
        <div class="icon-box" style="padding: 12px; background: #12141A; border-style: dashed;">
          <img src="${icon512Uri}" width="256" height="256" alt="512px Icon">
        </div>
        <div class="item-label">512 × 512 px</div>
        <div class="item-sub">icon.png (PWA / Master, scaled 50%)</div>
        <span class="badge">Large (Glowing Mark)</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  await pageDark.setContent(htmlSideBySideDark);
  await pageDark.screenshot({ path: `${OUTPUT_DIR}/icons-side-by-side-dark.png`, fullPage: true });
  console.log(`Saved ${OUTPUT_DIR}/icons-side-by-side-dark.png`);

  // 3. Browser Tab Bar Screenshot — LIGHT THEME
  const pageTabLight = await context.newPage();
  const htmlBrowserTabLight = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Browser Tab Bar — Light Theme</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
    body { background: #E2E4E8; padding: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
    
    .window {
      width: 860px;
      background: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08);
      overflow: hidden;
      border: 1px solid #D1D5DB;
    }

    .titlebar {
      background: #DEE1E6;
      height: 42px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      position: relative;
    }

    .window-controls {
      display: flex;
      gap: 8px;
      margin-right: 18px;
    }
    .win-btn { width: 12px; height: 12px; border-radius: 50%; }
    .btn-close { background: #FF5F56; border: 1px solid #E0443E; }
    .btn-min { background: #FFBD2E; border: 1px solid #DEA123; }
    .btn-max { background: #27C93F; border: 1px solid #1AAB29; }

    .tabs-container {
      display: flex;
      align-items: flex-end;
      height: 100%;
      flex: 1;
      gap: 4px;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 9px;
      background: #FFFFFF;
      height: 34px;
      padding: 0 14px;
      border-radius: 8px 8px 0 0;
      width: 240px;
      box-shadow: 0 -1px 3px rgba(0,0,0,0.04);
      position: relative;
    }

    .tab-favicon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tab-title {
      font-size: 12px;
      color: #202124;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .tab-close {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #5F6368;
      font-size: 14px;
      line-height: 1;
    }

    .new-tab {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5F6368;
      font-size: 18px;
      border-radius: 50%;
      margin-bottom: 3px;
    }

    .toolbar {
      background: #FFFFFF;
      height: 44px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      border-bottom: 1px solid #E5E7EB;
    }

    .nav-buttons {
      display: flex;
      gap: 10px;
      color: #5F6368;
      font-size: 15px;
    }

    .address-bar {
      flex: 1;
      height: 30px;
      background: #F1F3F4;
      border-radius: 15px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      font-size: 13px;
      color: #202124;
      gap: 8px;
    }

    .lock-icon { font-size: 11px; color: #5F6368; }

    .content-preview {
      height: 120px;
      background: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748B;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div style="margin-bottom: 24px; text-align: center;">
    <h2 style="font-size: 18px; font-weight: 600; color: #1F2937;">Light Browser Tab Verification</h2>
    <p style="font-size: 13px; color: #6B7280; margin-top: 4px;">Crisp red V favicon rendered at native 16px on light tab background (#FFFFFF)</p>
  </div>

  <div class="window">
    <div class="titlebar">
      <div class="window-controls">
        <div class="win-btn btn-close"></div>
        <div class="win-btn btn-min"></div>
        <div class="win-btn btn-max"></div>
      </div>
      <div class="tabs-container">
        <div class="tab">
          <div class="tab-favicon">
            <img src="${icon16Uri}" width="16" height="16" alt="favicon">
          </div>
          <div class="tab-title">Vipin Kaushik — Senior Product Designer</div>
          <div class="tab-close">×</div>
        </div>
        <div class="new-tab">+</div>
      </div>
    </div>
    <div class="toolbar">
      <div class="nav-buttons">
        <span>←</span>
        <span>→</span>
        <span>↻</span>
      </div>
      <div class="address-bar">
        <span class="lock-icon">🔒</span>
        <span>vipinkaushik.dev</span>
      </div>
    </div>
    <div class="content-preview">
      <span>Homepage content renders below address bar</span>
    </div>
  </div>
</body>
</html>`;

  await pageTabLight.setContent(htmlBrowserTabLight);
  await pageTabLight.screenshot({ path: `${OUTPUT_DIR}/browser-tab-light.png` });
  console.log(`Saved ${OUTPUT_DIR}/browser-tab-light.png`);

  // 4. Browser Tab Bar Screenshot — DARK THEME
  const pageTabDark = await context.newPage();
  const htmlBrowserTabDark = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Browser Tab Bar — Dark Theme</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
    body { background: #0A0A0C; padding: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
    
    .window {
      width: 860px;
      background: #1E1F22;
      border-radius: 10px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4);
      overflow: hidden;
      border: 1px solid #2B2D31;
    }

    .titlebar {
      background: #111214;
      height: 42px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      position: relative;
    }

    .window-controls {
      display: flex;
      gap: 8px;
      margin-right: 18px;
    }
    .win-btn { width: 12px; height: 12px; border-radius: 50%; }
    .btn-close { background: #ED6A5F; border: 1px solid #CF544B; }
    .btn-min { background: #F5BF4F; border: 1px solid #D59F3D; }
    .btn-max { background: #62C554; border: 1px solid #4CA73F; }

    .tabs-container {
      display: flex;
      align-items: flex-end;
      height: 100%;
      flex: 1;
      gap: 4px;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 9px;
      background: #1E1F22;
      height: 34px;
      padding: 0 14px;
      border-radius: 8px 8px 0 0;
      width: 240px;
      box-shadow: 0 -1px 3px rgba(0,0,0,0.2);
      position: relative;
    }

    .tab-favicon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tab-title {
      font-size: 12px;
      color: #E3E5E8;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .tab-close {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #949BA4;
      font-size: 14px;
      line-height: 1;
    }

    .new-tab {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #949BA4;
      font-size: 18px;
      border-radius: 50%;
      margin-bottom: 3px;
    }

    .toolbar {
      background: #1E1F22;
      height: 44px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      border-bottom: 1px solid #2B2D31;
    }

    .nav-buttons {
      display: flex;
      gap: 10px;
      color: #949BA4;
      font-size: 15px;
    }

    .address-bar {
      flex: 1;
      height: 30px;
      background: #111214;
      border-radius: 15px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      font-size: 13px;
      color: #DBDEE1;
      gap: 8px;
    }

    .lock-icon { font-size: 11px; color: #949BA4; }

    .content-preview {
      height: 120px;
      background: #16171A;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #72767D;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div style="margin-bottom: 24px; text-align: center;">
    <h2 style="font-size: 18px; font-weight: 600; color: #F3F4F6;">Dark Browser Tab Verification</h2>
    <p style="font-size: 13px; color: #9CA3AF; margin-top: 4px;">Crisp red V favicon rendered at native 16px on dark tab background (#1E1F22)</p>
  </div>

  <div class="window">
    <div class="titlebar">
      <div class="window-controls">
        <div class="win-btn btn-close"></div>
        <div class="win-btn btn-min"></div>
        <div class="win-btn btn-max"></div>
      </div>
      <div class="tabs-container">
        <div class="tab">
          <div class="tab-favicon">
            <img src="${icon16Uri}" width="16" height="16" alt="favicon">
          </div>
          <div class="tab-title">Vipin Kaushik — Senior Product Designer</div>
          <div class="tab-close">×</div>
        </div>
        <div class="new-tab">+</div>
      </div>
    </div>
    <div class="toolbar">
      <div class="nav-buttons">
        <span>←</span>
        <span>→</span>
        <span>↻</span>
      </div>
      <div class="address-bar">
        <span class="lock-icon">🔒</span>
        <span>vipinkaushik.dev</span>
      </div>
    </div>
    <div class="content-preview">
      <span>Homepage content renders below address bar</span>
    </div>
  </div>
</body>
</html>`;

  await pageTabDark.setContent(htmlBrowserTabDark);
  await pageTabDark.screenshot({ path: `${OUTPUT_DIR}/browser-tab-dark.png` });
  console.log(`Saved ${OUTPUT_DIR}/browser-tab-dark.png`);

  // 5. Test against running live server on port 3100
  const livePage = await context.newPage();
  await livePage.goto("http://localhost:3100/", { waitUntil: "domcontentloaded" });
  await livePage.waitForTimeout(1000);
  await livePage.screenshot({ path: `${OUTPUT_DIR}/homepage-port3100-light.png` });
  console.log(`Saved ${OUTPUT_DIR}/homepage-port3100-light.png`);

  await livePage.evaluate(() => {
    document.documentElement.classList.add("dark");
  });
  await livePage.waitForTimeout(500);
  await livePage.screenshot({ path: `${OUTPUT_DIR}/homepage-port3100-dark.png` });
  console.log(`Saved ${OUTPUT_DIR}/homepage-port3100-dark.png`);

  await browser.close();
  console.log("=== All Visual Verification Screenshots Captured Successfully! ===");
}

run().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
