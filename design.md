# Design System & Invariants

## Film Grain Overlay (Locked)
- The fixed full-viewport `body::after` film grain overlay is an intentional signature and MUST NOT be removed, commented out, or altered by any antislop or Hallmark pass.
- CSS: `position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;`
- Texture: SVG `feTurbulence` data URI (`type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'`), `background-size: 200px 200px`.
- Opacity & blend mode:
  - Light mode: `--grain-opacity: 0.06; --grain-blend: multiply;`
  - Dark mode: `--grain-opacity: 0.09; --grain-blend: screen;`
