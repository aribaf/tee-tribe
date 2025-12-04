
const product1 = '/assets/product-1.jpg';
const product2 = '/assets/product-2.jpg';
const product3 = '/assets/product-3.jpg';
const product4 = '/assets/product-4.jpg';
const product5 = '/assets/product-5.jpg';
const product6 = '/assets/product-6.jpg';
const product7 = '/assets/product-7.jpg';
const product8 = '/assets/product-8.jpg';
const product9 = '/assets/product-9.jpg';
const product10 = '/assets/product-10.jpg';
const product11 = '/assets/product-11.jpg';
const product12 = '/assets/product-12.jpg';
const product13 = '/assets/product-13.jpg';
const product14 = '/assets/product-14.jpg';
const product15 = '/assets/product-15.jpg';
const product16 = '/assets/product-16.jpg';
const product17 = '/assets/product-17.jpg';
const product18 = '/assets/product-18.jpg';
const product19 = '/assets/product-19.jpg';
const product20 = '/assets/product-20.jpg';
const product21 = '/assets/product-21.jpg';
const product22 = '/assets/product-22.jpg';
const product23 = '/assets/product-23.jpg';
const product24 = '/assets/product-24.jpg';
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  slug: string;
  sizes: string[];
  colors: string[];
  category: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Neon Geometry',
    price: 2500,
    description: 'Bold geometric patterns in neon green. A statement piece for the fearless.',
    image: product1,
    slug: 'neon-geometry',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Graphic',
  },
  {
    id: '2',
    name: 'Tribal Flame',
    price: 2800,
    description: 'Ancient tribal patterns meet modern neon aesthetics. Wear your heritage with pride.',
    image: product2,
    slug: 'tribal-flame',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Tribal',
  },
  {
    id: '3',
    name: 'Urban Typography',
    price: 2600,
    description: 'Street-inspired typography with angular brutalist design. Make your voice heard.',
    image: product3,
    slug: 'urban-typography',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Typography',
  },
  {
    id: '4',
    name: 'Abstract Wave',
    price: 2700,
    description: 'Flowing abstract patterns in neon orange. Ride the wave of style.',
    image: product1,
    slug: 'abstract-wave',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Abstract',
  },
  {
    id: '5',
    name: 'Digital Grid',
    price: 2900,
    description: 'Cyberpunk-inspired grid design. Enter the matrix.',
    image: product2,
    slug: 'digital-grid',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Tech',
  },
  {
    id: '6',
    name: 'Neon Burst',
    price: 2550,
    description: 'Explosive energy captured in neon colors. Be unstoppable.',
    image: product3,
    slug: 'neon-burst',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Graphic',
  },
  {
    id: '7',
    name: 'Geo Bandana',
    price: 1500,
    description: 'Bold geometric bandana with vibrant neon patterns. Stand out from the crowd.',
    image: product4,
    slug: 'geo-bandana',
    sizes: ['One Size'],
    colors: ['Black'],
    category: 'Accessories',
  },
  {
    id: '8',
    name: 'Abstract Shapes',
    price: 2650,
    description: 'Minimalist cool print with abstract shapes and neon accents. Modern elegance.',
    image: product5,
    slug: 'abstract-shapes',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Abstract',
  },
  {
    id: '9',
    name: 'Neon Skull',
    price: 2850,
    description: 'Edgy skull design with electric neon glow. Unleash your dark side.',
    image: product6,
    slug: 'neon-skull',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Graphic',
  },
  {
    id: '10',
    name: 'Paisley Bandana',
    price: 1600,
    description: 'Traditional paisley with neon twist. Classic meets modern.',
    image: product7,
    slug: 'paisley-bandana',
    sizes: ['One Size'],
    colors: ['Black'],
    category: 'Accessories',
  },
  {
    id: '11',
    name: 'Vaporwave Grid',
    price: 2950,
    description: 'Retro vaporwave aesthetic with neon grid. Enter the digital dimension.',
    image: product8,
    slug: 'vaporwave-grid',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Tech',
  },
  {
    id: '12',
    name: 'Lightning Strike',
    price: 2750,
    description: 'Electric lightning bolt with neon glow. Channel pure energy.',
    image: product9,
    slug: 'lightning-strike',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Graphic',
  },
  {
    id: '13',
    name: 'Cosmic Nebula',
    price: 2850,
    description: 'Stunning cosmic nebula clouds in vibrant purple and blue. Enter the universe.',
    image: product10,
    slug: 'cosmic-nebula',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Space',
  },
  {
    id: '14',
    name: 'Memphis 80s',
    price: 2600,
    description: 'Retro 80s Memphis design with bold geometric shapes. Back to the future.',
    image: product11,
    slug: 'memphis-80s',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Teal'],
    category: 'Retro',
  },
  {
    id: '15',
    name: 'Mountain Sunset',
    price: 2550,
    description: 'Majestic mountain silhouette with neon sunset gradient. Nature meets neon.',
    image: product12,
    slug: 'mountain-sunset',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Nature',
  },
  {
    id: '16',
    name: 'Street Graffiti',
    price: 2950,
    description: 'Bold street art graffiti in neon green and magenta. Urban energy.',
    image: product13,
    slug: 'street-graffiti',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Pink'],
    category: 'Urban',
  },
  {
    id: '17',
    name: 'Great Wave',
    price: 2800,
    description: 'Japanese-inspired wave pattern with electric blue neon. Timeless art.',
    image: product14,
    slug: 'great-wave',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue'],
    category: 'Japanese',
  },
  {
    id: '18',
    name: 'Cyber City',
    price: 3000,
    description: 'Cyberpunk city skyline with neon pink and blue. Future is now.',
    image: product15,
    slug: 'cyber-city',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Cyberpunk',
  },
  {
    id: '19',
    name: 'Neon Tiger',
    price: 2700,
    description: 'Minimalist tiger face in neon orange line art. Fierce elegance.',
    image: product16,
    slug: 'neon-tiger',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Minimalist',
  },
  {
    id: '20',
    name: 'Psychedelic Shroom',
    price: 2650,
    description: 'Trippy psychedelic mushroom pattern in neon rainbow colors. Expand your mind.',
    image: product17,
    slug: 'psychedelic-shroom',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Multi'],
    category: 'Psychedelic',
  },
  {
    id: '21',
    name: 'Pixel Arcade',
    price: 2500,
    description: 'Retro arcade pixel art in neon green and pink. Game on.',
    image: product18,
    slug: 'pixel-arcade',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Gaming',
  },
  {
    id: '22',
    name: 'Liquid Chrome',
    price: 2900,
    description: 'Abstract liquid metal chrome in holographic rainbow. Future aesthetic.',
    image: product19,
    slug: 'liquid-chrome',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Metallic'],
    category: 'Abstract',
  },
  {
    id: '23',
    name: 'Dragon Fire',
    price: 2950,
    description: 'Gothic dragon with electric blue flames. Mythical power.',
    image: product20,
    slug: 'dragon-fire',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Fantasy',
  },
  {
    id: '24',
    name: 'Retro Palms',
    price: 2600,
    description: 'Vintage sunset palm trees in coral pink and teal. Summer vibes.',
    image: product21,
    slug: 'retro-palms',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Teal'],
    category: 'Retro',
  },
  {
    id: '25',
    name: 'Sacred Geometry',
    price: 2750,
    description: 'Intricate mandala pattern in neon gold and cyan. Spiritual energy.',
    image: product22,
    slug: 'sacred-geometry',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'Spiritual',
  },
  {
    id: '26',
    name: 'Glitch Error',
    price: 2850,
    description: 'Digital glitch art in neon pink and green. System override.',
    image: product23,
    slug: 'glitch-error',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Pink'],
    category: 'Digital',
  },
  {
    id: '27',
    name: 'Space Explorer',
    price: 2950,
    description: 'Astronaut floating in galaxy with pink and blue nebula. Explore infinity.',
    image: product24,
    slug: 'space-explorer',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Purple'],
    category: 'Space',
  },
];

export const getProductBySlug = (slug: string) => {
  return products.find((p) => p.slug === slug);
};

export const getProductById = (id: string) => {
  return products.find((p) => p.id === id);
};
