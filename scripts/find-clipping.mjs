import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(500);

  const analysis = await page.evaluate(() => {
    const tileProjects = document.querySelector('.tile-projects');
    const bentoTile = tileProjects.querySelector('.bento-tile');
    const inner = bentoTile.firstElementChild;

    const bentoGrid = document.querySelector('.bento-grid-root');
    const gridComputed = window.getComputedStyle(bentoGrid);

    // Let's check bounding boxes
    const tpRect = tileProjects.getBoundingClientRect();
    const btRect = bentoTile.getBoundingClientRect();
    const inRect = inner.getBoundingClientRect();

    // Check all ancestors of tile-projects
    let cur = tileProjects;
    const ancestors = [];
    while (cur && cur !== document.body) {
      ancestors.push({
        tag: cur.tagName,
        className: cur.className,
        overflow: window.getComputedStyle(cur).overflow,
        overflowX: window.getComputedStyle(cur).overflowX,
        width: cur.offsetWidth,
        clientWidth: cur.clientWidth,
        scrollWidth: cur.scrollWidth,
        rect: cur.getBoundingClientRect(),
      });
      cur = cur.parentElement;
    }

    // Check inner children
    const childrenInfo = [];
    for (const child of bentoTile.querySelectorAll('*')) {
      const r = child.getBoundingClientRect();
      if (r.right > btRect.right) {
        childrenInfo.push({
          tag: child.tagName,
          className: child.className,
          right: r.right,
          overflowAmount: r.right - btRect.right
        });
      }
    }

    return {
      gridCols: gridComputed.gridTemplateColumns,
      tpRect,
      btRect,
      inRect,
      ancestors,
      childrenInfo,
      bentoTileStyles: {
        width: bentoTile.style.width,
        computedWidth: window.getComputedStyle(bentoTile).width,
        borderRadius: window.getComputedStyle(bentoTile).borderRadius,
        border: window.getComputedStyle(bentoTile).border,
      }
    };
  });

  console.log(JSON.stringify(analysis, null, 2));
  await browser.close();
}

main().catch(console.error);
