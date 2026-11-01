const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  const resumeLink = page.locator('a[aria-label="View resume PDF"]');
  const count = await resumeLink.count();
  if (count === 0) {
    console.error('ERROR: Resume link with aria-label="View resume PDF" not found!');
    process.exit(1);
  }

  const href = await resumeLink.getAttribute('href');
  console.log('Resume href attribute:', href);
  if (href !== '/resume.pdf') {
    console.error(`ERROR: Expected href="/resume.pdf", got "${href}"`);
    process.exit(1);
  }

  // Click-test: wait for new page (target="_blank")
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    resumeLink.click(),
  ]);

  await newPage.waitForLoadState('networkidle');
  const finalUrl = newPage.url();
  console.log('Opened new page URL:', finalUrl);

  const response = await page.request.get(finalUrl);
  console.log('HTTP Status:', response.status());
  console.log('X-Robots-Tag:', response.headers()['x-robots-tag']);
  console.log('Content-Type:', response.headers()['content-type']);

  if (response.status() === 200 && response.headers()['x-robots-tag'] === 'noindex') {
    console.log('SUCCESS: Resume click-test passed with 200 OK and X-Robots-Tag: noindex!');
  } else {
    console.error('FAIL: Status or header mismatch');
  }

  await browser.close();
})();
