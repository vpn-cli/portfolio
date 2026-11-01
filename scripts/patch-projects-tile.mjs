import fs from 'node:fs';

let code = fs.readFileSync('components/tiles/ProjectsTile.tsx', 'utf8');
code = code.replace(/\r\n/g, '\n');

// 1. Remove floating badge overlay
const badgeRegex = /\{\/\* Quick link badge overlay \*\/\}[\s\S]*?<\/div>\s*<\/div>/;
if (badgeRegex.test(code)) {
  code = code.replace(badgeRegex, '</div>');
}

// 2. Set description font size to 16px
code = code.replace(/text-\[13px\] sm:text-\[14px\]/g, 'text-[16px]');

// 3. Remove 1px border on stack tags
code = code.replace(/border border-\[var\(--border-subtle\)\]/g, 'border border-transparent');

fs.writeFileSync('components/tiles/ProjectsTile.tsx', code, 'utf8');
console.log('ProjectsTile patched v2');
