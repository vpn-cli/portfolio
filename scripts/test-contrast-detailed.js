const fs = require('fs');

// Relative Luminance formula per W3C WCAG 2.1
function srgbToLin(c) {
  const v = c / 255.0;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function getLuminance(r, g, b) {
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}

function getContrast(rgb1, rgb2) {
  let l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  let l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  if (l1 < l2) [l1, l2] = [l2, l1];
  return (l1 + 0.05) / (l2 + 0.05);
}

console.log('=== WCAG 2.1 CONTRAST AUDIT FOR MUTED LABELS ===\n');

// Dark Mode Tokens:
// Surface: #151515 (21, 21, 21)
// Primary Text: #f2f2f2 (242, 242, 242)
// Secondary Text: #a3a3a3 (163, 163, 163)
// Canvas Background: #0b0b0b (11, 11, 11)

// Light Mode Tokens:
// Surface: #FDFDFD (253, 253, 253)
// Primary Text: #121316 (18, 19, 22)
// Secondary Text: #636672 (99, 102, 114)
// Canvas Background: #ECEEF1 (236, 238, 241)

const auditItems = [
  {
    theme: 'Dark',
    label: '"Available for Select Projects" (Intro tile mono line)',
    textColor: [163, 163, 163],
    surfaceColor: [21, 21, 21],
    canvasColor: [11, 11, 11]
  },
  {
    theme: 'Dark',
    label: '"Core engineering toolchain" (Stack tile footer)',
    textColor: [163, 163, 163],
    surfaceColor: [21, 21, 21],
    canvasColor: [11, 11, 11]
  },
  {
    theme: 'Dark',
    label: '"Appearance" (Theme toggle footer)',
    textColor: [163, 163, 163],
    surfaceColor: [21, 21, 21],
    canvasColor: [11, 11, 11]
  },
  {
    theme: 'Light',
    label: '"Available for Select Projects" (Intro tile mono line)',
    textColor: [99, 102, 114],
    surfaceColor: [253, 253, 253],
    canvasColor: [236, 238, 241]
  },
  {
    theme: 'Light',
    label: '"Core engineering toolchain" (Stack tile footer)',
    textColor: [99, 102, 114],
    surfaceColor: [253, 253, 253],
    canvasColor: [236, 238, 241]
  },
  {
    theme: 'Light',
    label: '"Appearance" (Theme toggle footer)',
    textColor: [99, 102, 114],
    surfaceColor: [253, 253, 253],
    canvasColor: [236, 238, 241]
  }
];

for (const item of auditItems) {
  const crOnSurface = getContrast(item.textColor, item.surfaceColor);
  const crOnCanvas = getContrast(item.textColor, item.canvasColor);
  const passAA = crOnSurface >= 4.5;
  console.log(`[${item.theme} Mode] ${item.label}:`);
  console.log(`   On Tile Surface: ${crOnSurface.toFixed(2)}:1  [WCAG AA: ${passAA ? 'PASS (>=4.5:1)' : 'FAIL'}]`);
  console.log(`   On Canvas BG:   ${crOnCanvas.toFixed(2)}:1  [WCAG AA: ${crOnCanvas >= 4.5 ? 'PASS' : 'FAIL'}]`);
}

