const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const cssRequests = [];

  page.on('response', response => {
    const url = response.url();
    if (url.includes('.css') || response.headers()['content-type']?.includes('text/css')) {
      cssRequests.push({
        url,
        status: response.status(),
        contentType: response.headers()['content-type']
      });
    }
  });

  const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  console.log('Main Page HTTP Status:', response.status());

  console.log('CSS Requests Count:', cssRequests.length);
  for (const css of cssRequests) {
    console.log(`CSS: ${css.url} -> Status ${css.status} (${css.contentType})`);
  }

  // Check computed styles to ensure CSS is actually applied to the DOM
  const bodyStyles = await page.evaluate(() => {
    const body = document.body;
    const computed = window.getComputedStyle(body);
    const heroTitle = document.querySelector('h1, h2');
    const heroTitleComputed = heroTitle ? window.getComputedStyle(heroTitle) : null;
    return {
      bodyBg: computed.backgroundColor,
      bodyColor: computed.color,
      bodyFont: computed.fontFamily,
      hasHeroTitle: !!heroTitle,
      heroTitleFont: heroTitleComputed?.fontFamily,
      heroTitleSize: heroTitleComputed?.fontSize,
      elementCount: document.querySelectorAll('*').length
    };
  });

  console.log('Computed styles inspection:', JSON.stringify(bodyStyles, null, 2));

  // Take a screenshot to confirm visually
  await page.screenshot({ path: 'public/grain-test/verify-dev-clean-styled.png', fullPage: false });
  console.log('Screenshot saved to public/grain-test/verify-dev-clean-styled.png');

  await browser.close();

  const allCssSuccess = cssRequests.length > 0 && cssRequests.every(c => c.status === 200);
  if (allCssSuccess && bodyStyles.elementCount > 10) {
    console.log('VERIFICATION SUCCESSFUL: CSS requests returned 200 and DOM is visibly styled.');
    process.exit(0);
  } else {
    console.error('VERIFICATION FAILED: CSS missing or failed to load.');
    process.exit(1);
  }
})();

