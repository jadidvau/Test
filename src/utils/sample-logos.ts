import { LogoItem, VideoItem } from '../types/index.ts';

// Helper to make high-contrast, beautiful vector logo SVGs
function createSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const aetheriaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#090d16"/>
  <defs>
    <radialGradient id="glow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f2fe"/>
      <stop offset="100%" stop-color="#4facfe"/>
    </linearGradient>
    <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6b11ff"/>
      <stop offset="100%" stop-color="#00f2fe"/>
    </linearGradient>
  </defs>
  <circle cx="400" cy="360" r="300" fill="url(#glow)"/>
  <g transform="translate(400, 350)">
    <polygon points="0,-160 138,-80 138,80 0,160 -138,80 -138,-80" fill="none" stroke="url(#grad1)" stroke-width="6" opacity="0.4"/>
    <!-- Outer aerodynamic wings -->
    <path d="M0,-140 L120,60 L70,60 L0,-70 L-70,60 L-120,60 Z" fill="url(#grad1)"/>
    <!-- Inner orbital ring -->
    <ellipse cx="0" cy="20" rx="90" ry="26" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="14 10" transform="rotate(-20)"/>
    <!-- Core orb -->
    <circle cx="0" cy="-20" r="28" fill="#ffffff" filter="drop-shadow(0 0 15px #00f2fe)"/>
    <circle cx="0" cy="-20" r="14" fill="#090d16"/>
  </g>
  <!-- Typography -->
  <text x="400" y="600" font-family="'Space Grotesk', -apple-system, sans-serif" font-size="44" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="8">AETHERIA</text>
  <text x="400" y="640" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="16" font-weight="600" fill="#00f2fe" text-anchor="middle" letter-spacing="12">AUTONOMOUS SYSTEMS</text>
</svg>`;

const solsticeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#0e1713"/>
  <defs>
    <radialGradient id="sunGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#e0a96d" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0e1713" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd194"/>
      <stop offset="100%" stop-color="#d1913c"/>
    </linearGradient>
    <linearGradient id="leaf" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#55886d"/>
      <stop offset="100%" stop-color="#2d4f3e"/>
    </linearGradient>
  </defs>
  <circle cx="400" cy="350" r="280" fill="url(#sunGlow)"/>
  <g transform="translate(400, 350)">
    <!-- Solstice Sun Disc -->
    <circle cx="0" cy="-30" r="95" fill="none" stroke="url(#gold)" stroke-width="4"/>
    <circle cx="0" cy="-30" r="50" fill="url(#gold)" opacity="0.9"/>
    <!-- Organic botanical leaf arcs -->
    <path d="M-100,80 C-80,0 0,-80 0,-30 C0,40 -60,100 -100,80 Z" fill="url(#leaf)"/>
    <path d="M100,80 C80,0 0,-80 0,-30 C0,40 60,100 100,80 Z" fill="#3b6852"/>
    <!-- Central sprout vein -->
    <path d="M0,-30 Q0,80 0,110" stroke="url(#gold)" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
  <text x="400" y="590" font-family="'Space Grotesk', serif" font-size="42" font-weight="600" fill="#fdfbf7" text-anchor="middle" letter-spacing="10">SOLSTICE</text>
  <text x="400" y="630" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="500" fill="#d1913c" text-anchor="middle" letter-spacing="8">BOTANICAL HERBALS</text>
</svg>`;

const veloxSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#0d111d"/>
  <defs>
    <linearGradient id="vGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8a2387"/>
      <stop offset="50%" stop-color="#e94057"/>
      <stop offset="100%" stop-color="#f27121"/>
    </linearGradient>
    <linearGradient id="vGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>
  <g transform="translate(400, 340)">
    <!-- Isometric dynamic geometric V -->
    <path d="M-130,-100 L-40,-100 L0,0 L-40,80 L-130,80 L-60,0 Z" fill="url(#vGrad)"/>
    <path d="M130,-100 L40,-100 L0,0 L40,80 L130,80 L60,0 Z" fill="url(#vGrad2)"/>
    <!-- Overlapping center diamond -->
    <polygon points="0,-40 35,0 0,40 -35,0" fill="#ffffff" filter="drop-shadow(0 0 12px rgba(255,255,255,0.8))"/>
  </g>
  <text x="400" y="585" font-family="'Space Grotesk', sans-serif" font-size="46" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="10">VELOX</text>
  <text x="400" y="625" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="600" fill="#f27121" text-anchor="middle" letter-spacing="10">DISTRIBUTED CLOUD</text>
</svg>`;

const aureliusSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#0a0a0c"/>
  <defs>
    <linearGradient id="luxeGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f6d365"/>
      <stop offset="100%" stop-color="#fda085"/>
    </linearGradient>
  </defs>
  <g transform="translate(400, 340)">
    <!-- Fine luxury emblem -->
    <circle cx="0" cy="0" r="140" fill="none" stroke="url(#luxeGold)" stroke-width="3" stroke-dasharray="2 6"/>
    <circle cx="0" cy="0" r="130" fill="none" stroke="url(#luxeGold)" stroke-width="1.5"/>
    <!-- Interlocking M & A -->
    <path d="M-60,50 L-30,-50 L0,10 L30,-50 L60,50" fill="none" stroke="url(#luxeGold)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="-20" y1="15" x2="20" y2="15" stroke="url(#luxeGold)" stroke-width="4"/>
    <!-- Crown star -->
    <polygon points="0,-90 6,-75 22,-75 9,-65 14,-50 0,-60 -14,-50 -9,-65 -22,-75 -6,-75" fill="url(#luxeGold)"/>
  </g>
  <text x="400" y="580" font-family="Georgia, serif" font-size="36" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="12">MAISON AURELIUS</text>
  <text x="400" y="618" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#f6d365" text-anchor="middle" letter-spacing="10">GENÈVE • MCMLXXIV</text>
</svg>`;

export const INITIAL_LOGOS: LogoItem[] = [
  {
    id: 'seed-1',
    companyName: 'Aetheria Robotics',
    tagline: 'Beyond Horizons',
    industry: 'Autonomous Systems & Aerospace',
    description: 'Autonomous drones and orbital propulsion systems designed for extreme environments.',
    style: 'futuristic-cyber',
    colorPalette: 'Electric Cyan, Gunmetal Slate, and Obsidian Black',
    imageSize: '4K',
    aspectRatio: '1:1',
    prompt: 'Professional corporate logo design for Aetheria Robotics. Industry: Autonomous Systems & Aerospace. Style: cutting-edge futuristic corporate emblem, neon accents, high-tech cyber optics.',
    imageUrl: createSvgDataUrl(aetheriaSvg),
    createdAt: '2026-10-29T10:00:00.000Z',
    isFavorite: true,
  },
  {
    id: 'seed-2',
    companyName: 'Solstice Botanical',
    tagline: 'Nature in Equilibrium',
    industry: 'Organic Health & Herbal Elixirs',
    description: 'Cold-pressed adaptogenic herbals sourced ethically from alpine high-altitude gardens.',
    style: 'organic-nature',
    colorPalette: 'Sage Green, Terracotta, and Warm Cream',
    imageSize: '2K',
    aspectRatio: '1:1',
    prompt: 'Professional corporate logo design for Solstice Botanical. Style: organic fluid botanical curves, eco-friendly harmonious silhouette, sustainable earthy minimalism.',
    imageUrl: createSvgDataUrl(solsticeSvg),
    createdAt: '2026-10-29T10:15:00.000Z',
  },
  {
    id: 'seed-3',
    companyName: 'Velox Cloud',
    tagline: 'Zero Latency, Infinite Scale',
    industry: 'Distributed High-Performance Infrastructure',
    description: 'Ultra-low-latency edge computing architecture powering next-generation financial networks.',
    style: 'geometric-abstract',
    colorPalette: 'Deep Indigo, Royal Violet, and Pure White',
    imageSize: '2K',
    aspectRatio: '1:1',
    prompt: 'Professional corporate logo design for Velox Cloud. Style: abstract geometric icon symbol, mathematical golden ratio curves, modern tech aesthetic.',
    imageUrl: createSvgDataUrl(veloxSvg),
    createdAt: '2026-10-29T10:30:00.000Z',
    isFavorite: true,
  },
  {
    id: 'seed-4',
    companyName: 'Maison Aurelius',
    tagline: 'Crafting Eternity',
    industry: 'Fine Horology & Luxury Timepieces',
    description: 'Handcrafted Swiss-grade mechanical luxury watches made with reclaimed aerospace titanium.',
    style: 'luxury-elegant',
    colorPalette: 'Champagne Gold, Deep Emerald, and Onyx',
    imageSize: '4K',
    aspectRatio: '1:1',
    prompt: 'Professional corporate logo design for Maison Aurelius. Style: haute couture luxury insignia, delicate gold-leaf or platinum foil detailing.',
    imageUrl: createSvgDataUrl(aureliusSvg),
    createdAt: '2026-10-29T10:45:00.000Z',
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [];
