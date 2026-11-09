import fs from 'fs';

const summary = JSON.parse(fs.readFileSync('art-source/processed-summary.json', 'utf8'));

const metadata = {
  'cat-nom': {
    title: 'Nom',
    medium: 'Digital Sketch',
    year: '2024',
    note: 'Playful character doodle in monochrome.',
    alt: 'Monochrome digital sketch of a cat with wide eyes playfully biting a human hand, with the word NOM.',
  },
  'clove-valorant': {
    title: 'Clove',
    medium: 'Digital Illustration',
    year: '2024',
    note: 'Character portrait study of Clove from Valorant.',
    alt: 'Digital character illustration of Clove from Valorant extending a hand surrounded by glowing pink energy and floating butterflies.',
  },
  'edward-elric': {
    title: 'Edward Elric',
    medium: 'Digital Painting',
    year: '2024',
    note: 'Action illustration of Fullmetal Alchemist performing transmutation.',
    alt: 'Dynamic digital illustration of Edward Elric from Fullmetal Alchemist with a mechanical automail arm unleashing transmutation lightning.',
  },
  'cosmic-frog-wizard': {
    title: 'Cosmic Frog Wizard',
    medium: 'Digital Illustration',
    year: '2024',
    note: 'Whimsical illustration of a wizard frog drifting through starry space.',
    alt: 'Digital illustration of a small green frog in a purple wizard hat and starry cape riding a wooden staff across a colorful nebula.',
  },
  'hall-day-joker-poster': {
    title: 'Hall Day: Why So Serious?',
    medium: 'Poster Design',
    year: '2024',
    note: 'Event poster designed for IIT Kharagpur hall day party.',
    alt: 'Campus hall day party poster featuring a laughing Joker face with red brushstroke text reading Why so serious.',
  },
};

const artworks = summary.map((item) => {
  const meta = metadata[item.slug];
  return {
    slug: item.slug,
    file: item.file,
    title: meta.title,
    medium: meta.medium,
    year: meta.year,
    note: meta.note,
    width: item.width,
    height: item.height,
    alt: meta.alt,
    blurDataURL: item.blurDataURL,
  };
});

const fileContent = `export interface Artwork {
  slug: string;
  file: string;
  title: string;
  medium: string;
  year: string;
  note?: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
}

export const artworks: Artwork[] = ${JSON.stringify(artworks, null, 2)};
`;

fs.writeFileSync('content/artworks.ts', fileContent, 'utf8');
console.log('content/artworks.ts generated successfully');
