const fs = require('fs');

const linkedinPath = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z';

// 1. index.mjs
const mjsPath = 'node_modules/react-icons/si/index.mjs';
let mjs = fs.readFileSync(mjsPath, 'utf8');
if (!mjs.includes('SiLinkedin')) {
  mjs += `\nexport function SiLinkedin (props) {\n  return GenIcon({"tag":"svg","attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"${linkedinPath}"}}]})(props);\n};\n`;
  fs.writeFileSync(mjsPath, mjs);
}

// 2. index.js
const jsPath = 'node_modules/react-icons/si/index.js';
let js = fs.readFileSync(jsPath, 'utf8');
if (!js.includes('SiLinkedin')) {
  js += `\nmodule.exports.SiLinkedin = function SiLinkedin (props) {\n  return GenIcon({"tag":"svg","attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"${linkedinPath}"}}]})(props);\n};\n`;
  fs.writeFileSync(jsPath, js);
}

// 3. index.d.ts
const dtsPath = 'node_modules/react-icons/si/index.d.ts';
let dts = fs.readFileSync(dtsPath, 'utf8');
if (!dts.includes('SiLinkedin')) {
  dts += '\nexport declare const SiLinkedin: IconType;\n';
  fs.writeFileSync(dtsPath, dts);
}

console.log('Successfully added SiLinkedin to react-icons/si');
