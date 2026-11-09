import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ART_SOURCE_DIR = path.resolve('art-source');
const PUBLIC_ART_DIR = path.resolve('public/art');

if (!fs.existsSync(PUBLIC_ART_DIR)) {
  fs.mkdirSync(PUBLIC_ART_DIR, { recursive: true });
}

// Map each file to clean lowercase output filename and quality setting
const FILES = [
  {
    input: 'cat.PNG',
    output: 'cat-nom.webp',
    slug: 'cat-nom',
    maxLongEdge: 2048,
    quality: 85,
  },
  {
    input: 'clove.jpg',
    output: 'clove-valorant.webp',
    slug: 'clove-valorant',
    maxLongEdge: 2400,
    quality: 84,
  },
  {
    input: 'edward_elric.png',
    output: 'edward-elric.webp',
    slug: 'edward-elric',
    maxLongEdge: 2400,
    quality: 82,
  },
  {
    input: 'froggy.jpg',
    output: 'cosmic-frog-wizard.webp',
    slug: 'cosmic-frog-wizard',
    maxLongEdge: 2400,
    quality: 84,
  },
  {
    input: 'hall_day_poster.png',
    output: 'hall-day-joker-poster.webp',
    slug: 'hall-day-joker-poster',
    maxLongEdge: 2000,
    quality: 78,
  },
];

async function processAll() {
  console.log('--- Processing Artworks ---');
  const results = [];

  for (const item of FILES) {
    const inputPath = path.join(ART_SOURCE_DIR, item.input);
    const outputPath = path.join(PUBLIC_ART_DIR, item.output);

    const sourceMeta = await sharp(inputPath).metadata();
    const isLandscape = sourceMeta.width >= sourceMeta.height;
    const resizeOpts = isLandscape
      ? { width: Math.min(sourceMeta.width, item.maxLongEdge) }
      : { height: Math.min(sourceMeta.height, item.maxLongEdge) };

    // Process image: resize, strip metadata (no withMetadata), encode to webp
    const processedBuffer = await sharp(inputPath)
      .resize({
        ...resizeOpts,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: item.quality,
        effort: 6,
      })
      .toBuffer();

    fs.writeFileSync(outputPath, processedBuffer);

    // Verify metadata was completely stripped
    const verifyMeta = await sharp(processedBuffer).metadata();
    const sizeKB = (processedBuffer.length / 1024).toFixed(1);

    // Generate base64 blurDataURL for next/image blur placeholder
    const blurBuffer = await sharp(processedBuffer)
      .resize({ width: 16 })
      .webp({ quality: 20 })
      .toBuffer();
    const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    results.push({
      slug: item.slug,
      file: item.output,
      width: verifyMeta.width,
      height: verifyMeta.height,
      sizeKB: `${sizeKB} KB`,
      hasExif: !!verifyMeta.exif,
      hasGps: !!verifyMeta.exif && verifyMeta.exif.includes('GPS'),
      blurDataURL,
    });

    console.log(`✓ Processed ${item.input} -> ${item.output}`);
    console.log(`  Dimensions: ${verifyMeta.width}x${verifyMeta.height}px | Size: ${sizeKB} KB | EXIF: ${!!verifyMeta.exif}`);
  }

  console.log('\n--- Summary Table ---');
  console.table(results.map(r => ({
    file: r.file,
    dimensions: `${r.width}x${r.height}`,
    size: r.sizeKB,
    exifStripped: !r.hasExif,
  })));

  // Output JSON for content/artworks.ts generation
  fs.writeFileSync(
    path.join(ART_SOURCE_DIR, 'processed-summary.json'),
    JSON.stringify(results, null, 2)
  );
}

processAll().catch(err => {
  console.error('Processing failed:', err);
  process.exit(1);
});

