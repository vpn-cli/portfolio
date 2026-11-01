import fs from 'node:fs';

function replaceIn(path, search, replacement) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  content = content.replace(search, replacement);
  fs.writeFileSync(path, content, 'utf8');
}

// ContactTile.tsx
replaceIn('components/tiles/ContactTile.tsx', 'text-[14px] sm:text-[16px] 2xl:text-[18px]', 'text-[16px]');
replaceIn('components/tiles/ContactTile.tsx', 'text-[13px] sm:text-[14px]', 'text-[16px]');

// LinksTile.tsx
replaceIn('components/tiles/LinksTile.tsx', 'text-[14px] sm:text-[15px]', 'text-[16px]');

// ProjectsTile.tsx
replaceIn('components/tiles/ProjectsTile.tsx', 'text-[20px] sm:text-[23px] xl:text-[25px] 2xl:text-[28px]', 'text-[20px]');
replaceIn('components/tiles/ProjectsTile.tsx', 'text-[14px] sm:text-[15px]', 'text-[16px]');

// IntroTile.tsx
replaceIn('components/tiles/IntroTile.tsx', 'text-[18px] sm:text-[19px] xl:text-[20px] 2xl:text-[22px]', 'text-[18px] xl:text-[20px]');

// AboutTile.tsx
replaceIn('components/tiles/AboutTile.tsx', 'text-[17px] sm:text-[19px] xl:text-[21px] 2xl:text-[24px]', 'text-[18px] xl:text-[20px]');

console.log('Font sizes normalized');

