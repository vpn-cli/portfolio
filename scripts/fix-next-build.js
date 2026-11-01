const fs = require('fs');
const filePath = 'node_modules/next/dist/build/index.js';
let code = fs.readFileSync(filePath, 'utf8');

// Replace the try/catch selectAppPageEntry
const oldBlock = `try { originalAppPath = (0, _apppaths.selectAppPageEntry)(page, Object.keys(appPathRoutes).filter((entry)=>mappedAppPages[entry]), (entry)=>appPathRoutes[entry]); } catch (e) { originalAppPath = page; }
                            pagePath = mappedAppPages[originalAppPath].replace(/^private-next-app-dir/, '');`;

const newBlock = `try {
  originalAppPath = (0, _apppaths.selectAppPageEntry)(page, Object.keys(appPathRoutes).filter((entry)=>mappedAppPages[entry]), (entry)=>appPathRoutes[entry]);
} catch (e) {
  originalAppPath = mappedAppPages[page + '/page'] ? (page + '/page') : page;
}
pagePath = (mappedAppPages[originalAppPath] || mappedAppPages[page] || mappedAppPages['/_not-found/page'] || '').replace(/^private-next-app-dir/, '');`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, code);
  console.log('Successfully patched build/index.js with robust fallback!');
} else {
  console.log('Target block not found');
}
