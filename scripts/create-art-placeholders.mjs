import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'art');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const svgs = [
  {
    name: 'art-01.svg',
    title: 'Vector Flow',
    year: '2025',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181a20" />
      <stop offset="100%" stop-color="#0f1013" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g1)"/>
  <circle cx="400" cy="300" r="180" fill="none" stroke="#2d313a" stroke-width="2"/>
  <circle cx="400" cy="300" r="120" fill="none" stroke="#f97316" stroke-width="1.5" stroke-dasharray="6 8"/>
  <line x1="120" y1="300" x2="680" y2="300" stroke="#262932" stroke-width="1.5"/>
  <line x1="400" y1="60" x2="400" y2="540" stroke="#262932" stroke-width="1.5"/>
  <rect x="330" y="230" width="140" height="140" fill="#f97316" fill-opacity="0.12" stroke="#f97316" stroke-width="1.5" transform="rotate(45 400 300)"/>
  <circle cx="400" cy="300" r="4" fill="#fb923c"/>
  <text x="36" y="565" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#64748b" letter-spacing="1.5">01 · VECTOR FLOW &amp; AXIS</text>
</svg>`
  },
  {
    name: 'art-02.svg',
    title: 'Contour Waves',
    year: '2025',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#16181f" />
      <stop offset="100%" stop-color="#0d0e12" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g2)"/>
  <path d="M80 440 Q 240 180, 400 340 T 720 160" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
  <path d="M80 470 Q 240 210, 400 370 T 720 190" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-opacity="0.6"/>
  <path d="M80 500 Q 240 240, 400 400 T 720 220" fill="none" stroke="#1d4ed8" stroke-width="1" stroke-opacity="0.3"/>
  <circle cx="400" cy="340" r="5" fill="#60a5fa"/>
  <circle cx="720" cy="160" r="7" fill="#3b82f6"/>
  <text x="36" y="565" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#64748b" letter-spacing="1.5">02 · TOPOGRAPHIC CONTOUR</text>
</svg>`
  },
  {
    name: 'art-03.svg',
    title: 'Isometric Void',
    year: '2024',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14171d" />
      <stop offset="100%" stop-color="#0b0d11" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g3)"/>
  <g stroke="#334155" stroke-width="1.5" fill="none">
    <line x1="200" y1="160" x2="400" y2="80"/>
    <line x1="400" y1="80" x2="600" y2="160"/>
    <line x1="600" y1="160" x2="400" y2="240"/>
    <line x1="400" y1="240" x2="200" y2="160"/>
    <line x1="200" y1="160" x2="200" y2="400"/>
    <line x1="400" y1="240" x2="400" y2="480"/>
    <line x1="600" y1="160" x2="600" y2="400"/>
    <line x1="200" y1="400" x2="400" y2="480"/>
    <line x1="400" y1="480" x2="600" y2="400"/>
  </g>
  <polygon points="400,120 540,180 400,240 260,180" fill="#10b981" fill-opacity="0.18" stroke="#10b981" stroke-width="1.5"/>
  <text x="36" y="565" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#64748b" letter-spacing="1.5">03 · ISOMETRIC MONOLITH</text>
</svg>`
  },
  {
    name: 'art-04.svg',
    title: 'Fractal Prism',
    year: '2024',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1816" />
      <stop offset="100%" stop-color="#0f0e0c" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g4)"/>
  <g fill="none" stroke="#f59e0b" stroke-width="1.5">
    <polygon points="400,100 500,260 300,260" stroke-opacity="0.9"/>
    <polygon points="400,180 540,400 260,400" stroke-opacity="0.5"/>
    <polygon points="400,260 580,510 220,510" stroke-opacity="0.25"/>
  </g>
  <circle cx="400" cy="310" r="5" fill="#f59e0b"/>
  <text x="36" y="565" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#64748b" letter-spacing="1.5">04 · TRIANGULAR TENSION</text>
</svg>`
  },
  {
    name: 'art-05.svg',
    title: 'Vertical Resonance',
    year: '2024',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181520" />
      <stop offset="100%" stop-color="#0c0914" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g5)"/>
  <line x1="80" y1="480" x2="720" y2="480" stroke="#332a45" stroke-width="2"/>
  <line x1="220" y1="480" x2="220" y2="180" stroke="#8b5cf6" stroke-width="2.5"/>
  <line x1="320" y1="480" x2="320" y2="240" stroke="#a78bfa" stroke-width="2"/>
  <line x1="420" y1="480" x2="420" y2="110" stroke="#c4b5fd" stroke-width="3"/>
  <line x1="520" y1="480" x2="520" y2="300" stroke="#7c3aed" stroke-width="1.5"/>
  <line x1="620" y1="480" x2="620" y2="210" stroke="#6d28d9" stroke-width="2"/>
  <circle cx="420" cy="110" r="6" fill="#c4b5fd"/>
  <text x="36" y="565" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#64748b" letter-spacing="1.5">05 · HARMONIC CADENCE</text>
</svg>`
  },
  {
    name: 'art-06.svg',
    title: 'Orbital Duality',
    year: '2023',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1418" />
      <stop offset="100%" stop-color="#100a0d" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g6)"/>
  <circle cx="400" cy="300" r="150" fill="none" stroke="#f43f5e" stroke-width="1.5"/>
  <circle cx="350" cy="300" r="120" fill="none" stroke="#fb7185" stroke-width="1" stroke-dasharray="6 6"/>
  <circle cx="450" cy="300" r="120" fill="none" stroke="#fda4af" stroke-width="1" stroke-dasharray="3 5"/>
  <circle cx="400" cy="300" r="6" fill="#f43f5e"/>
  <text x="36" y="565" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#64748b" letter-spacing="1.5">06 · ORBITAL DUALITY</text>
</svg>`
  }
];

for (const item of svgs) {
  const filePath = path.join(dir, item.name);
  fs.writeFileSync(filePath, item.svg, 'utf8');
}

console.log('Successfully written ' + svgs.length + ' art SVG files to public/art');
