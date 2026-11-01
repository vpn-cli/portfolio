const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function getChunks(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getChunks(file));
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(file);
      const gzipped = zlib.gzipSync(content);
      results.push({
        file: path.relative(process.cwd(), file),
        name: path.basename(file),
        rawKB: (content.length / 1024).toFixed(2),
        gzipKB: (gzipped.length / 1024).toFixed(2),
        bytes: content.length,
        gzipBytes: gzipped.length
      });
    }
  });
  return results;
}

const chunks = getChunks(path.join('.next', 'static', 'chunks'));
chunks.sort((a, b) => b.gzipBytes - a.gzipBytes);
console.log('Top chunks:');
chunks.slice(0, 15).forEach(c => {
  console.log(`${c.name.padEnd(35)} Raw: ${c.rawKB.padStart(7)} KB | Gzip: ${c.gzipKB.padStart(6)} KB`);
});
