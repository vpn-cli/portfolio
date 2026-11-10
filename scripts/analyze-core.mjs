import sharp from "sharp";
import potrace from "potrace";
import fs from "fs";

async function analyzeCore() {
  const image = sharp("public/favicon.webp");
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's test different threshold masks for the core
  // In the core, brightness is high. What threshold isolates the core silhouette best?
  // Let's create black-and-white bitmap buffers for thresholds 140, 160, 180, 200, 220
  for (const t of [140, 160, 180, 200, 210, 220]) {
    const bwData = Buffer.alloc(width * height);
    let count = 0;
    for (let i = 0; i < width * height; i++) {
      const idx = i * 3;
      const v = Math.max(data[idx], data[idx + 1], data[idx + 2]);
      if (v >= t) {
        bwData[i] = 0; // black for potrace foreground
        count++;
      } else {
        bwData[i] = 255; // white for potrace background
      }
    }

    const pngBuf = await sharp(bwData, { raw: { width, height, channels: 1 } }).png().toBuffer();

    await new Promise((resolve, reject) => {
      potrace.trace(pngBuf, { threshold: 128 }, (err, svg) => {
        if (err) return reject(err);
        fs.writeFileSync(`scripts/trace_t${t}.svg`, svg);
        console.log(`Threshold ${t}: pixel count ${count}, svg length ${svg.length}`);
        resolve();
      });
    });
  }
}

analyzeCore().catch(console.error);
