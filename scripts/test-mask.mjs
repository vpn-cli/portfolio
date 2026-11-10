import sharp from "sharp";
import fs from "fs";

async function testMask() {
  const img = sharp("public/favicon.webp");
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const rgba = Buffer.alloc(width * height * 4);

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * 3;
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
      // smooth low-end ramp
      const factor = v < 4 ? Math.pow(v / 4, 1.5) : 1.0;
      const alphaFloat = (v / 255.0) * factor;
      const alphaByte = Math.min(255, Math.max(0, Math.round(alphaFloat * 255.0)));

      if (alphaByte === 0) {
        rgba[dstIdx] = 0;
        rgba[dstIdx + 1] = 0;
        rgba[dstIdx + 2] = 0;
        rgba[dstIdx + 3] = 0;
      } else {
        // Un-premultiply
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

  console.log("Tight bounds (alpha > 2):", { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  // Save masked full image
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png()
    .toFile("scripts/test_masked_full.png");

  // Crop tightly around the mark (small even padding) and center it on a square canvas
  // Width of mark:
  const markW = maxX - minX + 1;
  const markH = maxY - minY + 1;
  const maxDim = Math.max(markW, markH); // markW is 780

  // Small even padding: e.g. 5% of maxDim
  const padding = Math.round(maxDim * 0.05); // ~39px
  const squareSize = maxDim + 2 * padding; // ~858px

  console.log({ markW, markH, maxDim, padding, squareSize });

  // Extract the tightly cropped mark from rgba
  const croppedMark = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({
      left: minX,
      top: minY,
      width: markW,
      height: markH,
    })
    .png()
    .toBuffer();

  // Create square transparent canvas and composite cropped mark at center
  const posX = Math.round((squareSize - markW) / 2);
  const posY = Math.round((squareSize - markH) / 2);

  const squareLarge = await sharp({
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

  // Save 512x512
  await sharp(squareLarge)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile("scripts/test_icon_512.png");

  // Composite over pure white and pure black to inspect for halos
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: "scripts/test_icon_512.png" }])
    .png()
    .toFile("scripts/test_icon_on_white.png");

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 15, b: 15, alpha: 1 },
    },
  })
    .composite([{ input: "scripts/test_icon_512.png" }])
    .png()
    .toFile("scripts/test_icon_on_dark.png");

  console.log("Done generating test masked images!");
}

testMask().catch(console.error);
