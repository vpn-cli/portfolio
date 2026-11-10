import sharp from "sharp";
import fs from "fs";

async function test130() {
  const rawSvg = fs.readFileSync("scripts/trace_t130.svg", "utf8");
  const match = rawSvg.match(/<path[^>]*d="([^"]+)"/);
  const pathD = match[1];
  const cx = 503.5, cy = 296.5;
  const w = 576, h = 322;
  const maxDim = Math.max(w, h);
  const pad = Math.round(maxDim * 0.05);
  const size = maxDim + 2 * pad;
  const vbX = Math.round(cx - size / 2);
  const vbY = Math.round(cy - size / 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${size} ${size}" width="${size}" height="${size}"><path fill="#E51926" d="${pathD}" /></svg>`;
  const p16 = await sharp(Buffer.from(svg)).resize(16, 16).raw().toBuffer({ resolveWithObject: true });
  const p32 = await sharp(Buffer.from(svg)).resize(32, 32).raw().toBuffer({ resolveWithObject: true });

  console.log("16x16:");
  for (let y = 0; y < 16; y++) {
    let row = "";
    for (let x = 0; x < 16; x++) {
      const a = p16.data[(y * 16 + x) * 4 + 3];
      if (a > 180) row += "##";
      else if (a > 80) row += "++";
      else if (a > 20) row += "..";
      else row += "  ";
    }
    console.log(row);
  }

  console.log("32x32:");
  for (let y = 0; y < 32; y++) {
    let row = "";
    for (let x = 0; x < 32; x++) {
      const a = p32.data[(y * 32 + x) * 4 + 3];
      if (a > 180) row += "##";
      else if (a > 80) row += "++";
      else if (a > 20) row += "..";
      else row += "  ";
    }
    console.log(row);
  }
}

test130().catch(console.error);
