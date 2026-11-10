import sharp from "sharp";
import potrace from "potrace";
import pngToIco from "png-to-ico";
import fs from "fs";
import path from "path";

async function main() {
  console.log("=== Generating Favicon and Icons from public/favicon.webp ===");
  const sourcePath = path.resolve("public/favicon.webp");
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found at ${sourcePath}`);
  }

  // 1. Load source image
  const img = sharp(sourcePath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  console.log(`Source image dimensions: ${width}x${height}, channels: ${info.channels}`);

  // 2. Alpha derivation from brightness + unpremultiplying
  const rgba = Buffer.alloc(width * height * 4);
  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * info.channels;
    const dstIdx = i * 4;
    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const v = Math.max(r, g, b);

    if (v === 0) {
      rgba[dstIdx] = 0;
      rgba[dstIdx + 1] = 0;
      rgba[dstIdx + 2] = 0;
      rgba[dstIdx + 3] = 0;
    } else {
      // Smooth fade-in for very faint glow to eliminate noise/discretization
      const factor = v < 4 ? Math.pow(v / 4, 1.5) : 1.0;
      const alphaFloat = (v / 255.0) * factor;
      const alphaByte = Math.min(255, Math.max(0, Math.round(alphaFloat * 255.0)));

      if (alphaByte === 0) {
        rgba[dstIdx] = 0;
        rgba[dstIdx + 1] = 0;
        rgba[dstIdx + 2] = 0;
        rgba[dstIdx + 3] = 0;
      } else {
        // Un-premultiply so no dark halo or fringe appears over any background
        const unR = Math.min(255, Math.max(0, Math.round(r / alphaFloat)));
        const unG = Math.min(255, Math.max(0, Math.round(g / alphaFloat)));
        const unB = Math.min(255, Math.max(0, Math.round(b / alphaFloat)));

        rgba[dstIdx] = unR;
        rgba[dstIdx + 1] = unG;
        rgba[dstIdx + 2] = unB;
        rgba[dstIdx + 3] = alphaByte;

        const x = i % width;
        const y = Math.floor(i / width);
        if (alphaByte > 2) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  const markW = maxX - minX + 1;
  const markH = maxY - minY + 1;
  console.log(`Tight bounding box of glowing mark: [${minX}, ${minY}, ${maxX}, ${maxY}], w=${markW}, h=${markH}`);

  // Crop tightly around the mark (small even padding) and center it on a square canvas
  const maxDim = Math.max(markW, markH);
  const padding = Math.round(maxDim * 0.05); // 5% small even padding
  const squareSize = maxDim + 2 * padding;

  const croppedMark = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({
      left: minX,
      top: minY,
      width: markW,
      height: markH,
    })
    .png()
    .toBuffer();

  const posX = Math.round((squareSize - markW) / 2);
  const posY = Math.round((squareSize - markH) / 2);

  // Large version master on square transparent canvas
  const largeMasterBuf = await sharp({
    create: {
      width: squareSize,
      height: squareSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: croppedMark,
        left: posX,
        top: posY,
      },
    ])
    .png()
    .toBuffer();

  // 3. Generate app/icon.png at 512x512 (large version, transparent background)
  const icon512Path = path.resolve("app/icon.png");
  await sharp(largeMasterBuf)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(icon512Path);
  console.log(`Saved ${icon512Path} (512x512)`);

  // 4. Generate app/apple-icon.png at 180x180 (large version on near-black rounded square background)
  // Apple squircle/rounded rectangle: 180x180, rx=40
  // Large mark scaled to fit comfortably inside the rounded square (e.g. 152x152, leaving 14px padding)
  const appleMark = await sharp(largeMasterBuf)
    .resize(152, 152, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const bgSvg = `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="180" rx="40" ry="40" fill="#0b0d11" />
  </svg>`;

  const bgBuf = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  const appleIcon180Path = path.resolve("app/apple-icon.png");
  await sharp(bgBuf)
    .composite([
      {
        input: appleMark,
        left: Math.round((180 - 152) / 2),
        top: Math.round((180 - 152) / 2),
      },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(appleIcon180Path);
  console.log(`Saved ${appleIcon180Path} (180x180)`);

  // 5. Small version (used at 16px and 32px):
  // Crisp, solid red version of the same V shape without glow (trace bright core of mark and fill with mark's red #E51926)
  const bwData = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) {
    const v = Math.max(data[i * info.channels], data[i * info.channels + 1], data[i * info.channels + 2]);
    bwData[i] = v >= 130 ? 0 : 255;
  }
  const bwPng = await sharp(bwData, { raw: { width, height, channels: 1 } }).png().toBuffer();

  const tracedSvg = await new Promise((resolve, reject) => {
    potrace.trace(bwPng, { threshold: 128 }, (err, svg) => {
      if (err) return reject(err);
      resolve(svg);
    });
  });

  const pathMatch = tracedSvg.match(/<path[^>]*d="([^"]+)"/);
  if (!pathMatch) {
    throw new Error("Failed to extract SVG path from potrace output");
  }
  const pathD = pathMatch[1];

  // Silhouette bounding box: w=576, h=322, cx=503.5, cy=296.5
  const coreW = 576;
  const coreH = 322;
  const coreMaxDim = Math.max(coreW, coreH);
  const corePad = Math.round(coreMaxDim * 0.05); // 5% padding
  const coreCanvasSize = coreMaxDim + 2 * corePad;
  const coreVbX = Math.round(503.5 - coreCanvasSize / 2);
  const coreVbY = Math.round(296.5 - coreCanvasSize / 2);

  const smallSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${coreVbX} ${coreVbY} ${coreCanvasSize} ${coreCanvasSize}" width="${coreCanvasSize}" height="${coreCanvasSize}">
    <path fill="#E51926" d="${pathD}" />
  </svg>`;

  const png16 = await sharp(Buffer.from(smallSvg))
    .resize(16, 16)
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();

  const png32 = await sharp(Buffer.from(smallSvg))
    .resize(32, 32)
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();

  // Save standalone PNGs for inspection / verification
  await sharp(png16).toFile("scripts/small-16.png");
  await sharp(png32).toFile("scripts/small-32.png");

  // Generate multi-resolution app/favicon.ico
  const icoBuf = await pngToIco([png16, png32]);
  const faviconPath = path.resolve("app/favicon.ico");
  fs.writeFileSync(faviconPath, icoBuf);
  console.log(`Saved ${faviconPath} containing 16x16 and 32x32 (${icoBuf.length} bytes)`);

  // 6. Remove conflicting public/favicon.ico if exists
  const publicFavicon = path.resolve("public/favicon.ico");
  if (fs.existsSync(publicFavicon)) {
    fs.unlinkSync(publicFavicon);
    console.log(`Removed conflicting ${publicFavicon}`);
  }

  console.log("=== Favicon generation completed successfully! ===");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
