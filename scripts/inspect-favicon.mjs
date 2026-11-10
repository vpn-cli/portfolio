import sharp from "sharp";

async function inspect() {
  const image = sharp("public/favicon.webp");
  const meta = await image.metadata();
  console.log("Metadata:", meta);

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let maxR = 0, maxG = 0, maxB = 0;
  let minR = 255, minG = 255, minB = 255;
  let nonZeroCount = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > maxR) maxR = r;
    if (g > maxG) maxG = g;
    if (b > maxB) maxB = b;
    if (r < minR) minR = r;
    if (g < minG) minG = g;
    if (b < minB) minB = b;
    if (r > 5 || g > 5 || b > 5) nonZeroCount++;
  }

  console.log({ minR, minG, minB, maxR, maxG, maxB, nonZeroCount, totalPixels: width * height });

  // Threshold analysis
  for (const t of [2, 5, 10, 15, 25, 50, 100, 150, 200]) {
    let minX = width, maxX = 0, minY = height, maxY = 0;
    let count = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const val = Math.max(data[idx], data[idx + 1], data[idx + 2]);
        if (val >= t) {
          count++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    console.log(`Threshold ${t}: count=${count}, bbox=[${minX}, ${minY}, ${maxX}, ${maxY}], w=${maxX - minX + 1}, h=${maxY - minY + 1}`);
  }
}

inspect().catch(console.error);
