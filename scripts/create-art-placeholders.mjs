import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'art');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const svgs = [
  {
    name: 'art-01',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#111318"/>
  <circle cx="200" cy="150" r="90" fill="none" stroke="#252932" stroke-width="2"/>
  <circle cx="200" cy="150" r="65" fill="none" stroke="#ea580c" stroke-width="3" stroke-dasharray="6 6"/>
  <line x1="40" y1="150" x2="360" y2="150" stroke="#2b303c" stroke-width="1.5"/>
  <line x1="200" y1="25" x2="200" y2="275" stroke="#2b303c" stroke-width="1.5"/>
  <rect x="160" y="110" width="80" height="80" fill="#ea580c" fill-opacity="0.25" stroke="#f97316" stroke-width="2" transform="rotate(45 200 150)"/>
  <circle cx="200" cy="150" r="6" fill="#fb923c"/>
  <text x="20" y="282" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="1">01 · VECTOR FLOW &amp; AXIS</text>
</svg>`
  },
  {
    name: 'art-02',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#111318"/>
  <path d="M30 225 Q 120 80, 200 160 T 370 70" fill="none" stroke="#38bdf8" stroke-width="4"/>
  <path d="M30 240 Q 120 95, 200 175 T 370 85" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-opacity="0.8"/>
  <path d="M30 255 Q 120 110, 200 190 T 370 100" fill="none" stroke="#0369a1" stroke-width="2" stroke-opacity="0.5"/>
  <circle cx="200" cy="160" r="8" fill="#38bdf8"/>
  <circle cx="370" cy="70" r="10" fill="#0ea5e9"/>
  <text x="20" y="282" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="1">02 · TOPOGRAPHIC CONTOUR</text>
</svg>`
  },
  {
    name: 'art-03',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#111318"/>
  <path d="M 200 60 L 275 90 L 200 120 L 125 90 Z" fill="#34d399" fill-opacity="0.35" stroke="#34d399" stroke-width="2"/>
  <path d="M 90 80 L 200 35 L 310 80 L 200 125 Z" fill="none" stroke="#10b981" stroke-width="2"/>
  <path d="M 90 80 L 90 205 L 200 250 L 200 125 Z" fill="none" stroke="#10b981" stroke-width="2"/>
  <path d="M 310 80 L 310 205 L 200 250" fill="none" stroke="#10b981" stroke-width="2"/>
  <text x="20" y="282" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="1">03 · ISOMETRIC MONOLITH</text>
</svg>`
  },
  {
    name: 'art-04',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#111318"/>
  <path d="M 200 40 L 320 220 L 80 220 Z" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="3"/>
  <path d="M 200 85 L 280 205 L 120 205 Z" fill="#fbbf24" fill-opacity="0.3" stroke="#fbbf24" stroke-width="2.5"/>
  <path d="M 200 130 L 240 190 L 160 190 Z" fill="#fde047" fill-opacity="0.5" stroke="#fde047" stroke-width="2"/>
  <circle cx="200" cy="165" r="8" fill="#fef08a"/>
  <circle cx="200" cy="40" r="5" fill="#f59e0b"/>
  <circle cx="320" cy="220" r="5" fill="#f59e0b"/>
  <circle cx="80" cy="220" r="5" fill="#f59e0b"/>
  <text x="20" y="282" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="1">04 · TRIANGULAR TENSION</text>
</svg>`
  },
  {
    name: 'art-05',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#111318"/>
  <path d="M 30 220 L 370 220" stroke="#3b2d54" stroke-width="2"/>
  <rect x="50" y="140" width="18" height="80" rx="9" fill="#7c3aed"/>
  <rect x="85" y="100" width="18" height="120" rx="9" fill="#9333ea"/>
  <rect x="120" y="70" width="18" height="150" rx="9" fill="#a855f7"/>
  <rect x="155" y="45" width="20" height="175" rx="10" fill="#c084fc"/>
  <rect x="190" y="25" width="20" height="195" rx="10" fill="#e9d5ff"/>
  <rect x="225" y="55" width="20" height="165" rx="10" fill="#c084fc"/>
  <rect x="260" y="90" width="18" height="130" rx="9" fill="#a855f7"/>
  <rect x="295" y="125" width="18" height="95" rx="9" fill="#9333ea"/>
  <rect x="330" y="160" width="18" height="60" rx="9" fill="#7c3aed"/>
  <circle cx="200" cy="15" r="6" fill="#f3e8ff"/>
  <text x="20" y="282" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="1">05 · HARMONIC CADENCE</text>
</svg>`
  },
  {
    name: 'art-06',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="400" height="300" fill="#111318"/>
  <circle cx="200" cy="145" r="90" fill="none" stroke="#be123c" stroke-width="2"/>
  <circle cx="160" cy="145" r="65" fill="#f43f5e" fill-opacity="0.3" stroke="#f43f5e" stroke-width="3"/>
  <circle cx="240" cy="145" r="65" fill="#fb7185" fill-opacity="0.3" stroke="#fb7185" stroke-width="3"/>
  <ellipse cx="200" cy="145" rx="20" ry="40" fill="#fda4af" fill-opacity="0.6" stroke="#ffffff" stroke-width="2"/>
  <circle cx="200" cy="145" r="8" fill="#ffffff"/>
  <text x="20" y="282" font-family="system-ui, sans-serif" font-size="9" font-weight="600" fill="#94a3b8" letter-spacing="1">06 · ORBITAL DUALITY</text>
</svg>`
  }
];

(async () => {
  for (const item of svgs) {
    const svgPath = path.join(dir, item.name + '.svg');
    const webpPath = path.join(dir, item.name + '.webp');
    fs.writeFileSync(svgPath, item.svg, 'utf8');
    await sharp(Buffer.from(item.svg)).webp({ quality: 95 }).toFile(webpPath);
  }
  console.log('Successfully written and rendered 6 vibrant 400x300 art files');
})();
