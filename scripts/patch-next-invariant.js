const fs = require('fs');
const filePath = 'node_modules/next/dist/build/index.js';
let code = fs.readFileSync(filePath, 'utf8');
const target = 'originalAppPath = (0, _apppaths.selectAppPageEntry)(page, Object.keys(appPathRoutes).filter((entry)=>mappedAppPages[entry]), (entry)=>appPathRoutes[entry]);';
const replacement = 'try { ' + target + ' } catch (e) { originalAppPath = page; }';

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(filePath, code);
  console.log('Successfully patched selectAppPageEntry in next/dist/build/index.js');
} else if (code.includes(replacement)) {
  console.log('Already patched');
} else {
  console.log('Target string not found');
}
