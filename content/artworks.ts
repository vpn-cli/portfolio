export interface Artwork {
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

export const artworks: Artwork[] = [
  {
    "slug": "cat-nom",
    "file": "cat-nom.webp",
    "title": "Nom",
    "medium": "Digital Sketch",
    "year": "2024",
    "note": "Playful character doodle in monochrome.",
    "width": 2048,
    "height": 2048,
    "alt": "Monochrome digital sketch of a cat with wide eyes playfully biting a human hand, with the word NOM.",
    "blurDataURL": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQABAABUB8JaQAAlqERC9IAAD+6pbphbaQoEJIvIb1+BehDGIOfOSWVeCJ3FlZCugovqugAAA="
  },
  {
    "slug": "clove-valorant",
    "file": "clove-valorant.webp",
    "title": "Clove",
    "medium": "Digital Illustration",
    "year": "2024",
    "note": "Character portrait study of Clove from Valorant.",
    "width": 1920,
    "height": 2400,
    "alt": "Digital character illustration of Clove from Valorant extending a hand surrounded by glowing pink energy and floating butterflies.",
    "blurDataURL": "data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAABQBACdASoQABQAPzmEuVOvKKWisAgB4CcJbACdMoMh1E5P3H2flxJb3zagAMxMrjfUQTsWNkxgQ2RRjEyEBOhQ8HsUMvSslogtnBHjUFwAqpDyQVBKgNg3Feldl86uzjD16Yf8Orl0uf2akWm3Ke8ZhaIiWTtz2k/fzM2AR/BcdgfP/6gAAA=="
  },
  {
    "slug": "edward-elric",
    "file": "edward-elric.webp",
    "title": "Edward Elric",
    "medium": "Digital Painting",
    "year": "2024",
    "note": "Action illustration of Fullmetal Alchemist performing transmutation.",
    "width": 2400,
    "height": 1800,
    "alt": "Dynamic digital illustration of Edward Elric from Fullmetal Alchemist with a mechanical automail arm unleashing transmutation lightning.",
    "blurDataURL": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAACQAQCdASoQAAwABUB8JagCdABV8gAA/k7CO2UQi7omsPBLEEFApMKO7xR0tpbqF2XAqd6p3gV7eACaSP4k4yzohHcLiNuzBjbrPvMW/7fLZX4Q6iK+B0bgkH2iAAAA"
  },
  {
    "slug": "cosmic-frog-wizard",
    "file": "cosmic-frog-wizard.webp",
    "title": "Cosmic Frog Wizard",
    "medium": "Digital Illustration",
    "year": "2024",
    "note": "Whimsical illustration of a wizard frog drifting through starry space.",
    "width": 2400,
    "height": 1004,
    "alt": "Digital illustration of a small green frog in a purple wizard hat and starry cape riding a wooden staff across a colorful nebula.",
    "blurDataURL": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACwAQCdASoQAAcABUB8JbACdACEx5roAP2LqkPRtMjUD4TGq17Bc0SJfaYxYYjZO/Q/fFQuz9VFFnngM8hoAAAA"
  },
  {
    "slug": "hall-day-joker-poster",
    "file": "hall-day-joker-poster.webp",
    "title": "Hall Day: Why So Serious?",
    "medium": "Poster Design",
    "year": "2024",
    "note": "Event poster designed for IIT Kharagpur hall day party.",
    "width": 1556,
    "height": 2000,
    "alt": "Campus hall day party poster featuring a laughing Joker face with red brushstroke text reading Why so serious.",
    "blurDataURL": "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAAAQBACdASoQABUAPzmGuVOvKSWisAgB4CcJbACdMoR3ACZUosl/WAoMAAD+g78P5yb4RdmiDn7W69HyQ+3JaII95tiliPmY+5V0sMo1Aq34RVxJA2xh6N8BTu2Boh4YW225bbUlz36q0c3L6/q2q7yoWXC1DotWsNiWqTeSzcJlZXhUdOp4S8mpcyqNpZB36gAAAA=="
  }
];
