/**
 * Utility functions and pure logic for Logo and Motion prompt building,
 * validation, and resolution handling.
 */

export type ImageResolution = '1K' | '2K' | '4K';
export type VideoAspectRatio = '16:9' | '9:16';
export type LogoStyle = 
  | 'modern-minimal' 
  | 'monogram-lettermark' 
  | 'geometric-abstract' 
  | 'futuristic-cyber' 
  | 'luxury-elegant' 
  | 'vintage-retro' 
  | 'badge-emblem' 
  | 'organic-nature';

export interface LogoGenerationOptions {
  companyName: string;
  industry: string;
  description: string;
  tagline?: string;
  style: LogoStyle;
  colorPalette?: string;
  imageSize: ImageResolution;
  aspectRatio?: '1:1' | '16:9' | '4:3';
}

export interface MotionGenerationOptions {
  motionStyle: string;
  aspectRatio: VideoAspectRatio;
  duration?: '5s' | '10s';
  customInstructions?: string;
  companyName?: string;
}

export const VALID_IMAGE_SIZES: ImageResolution[] = ['1K', '2K', '4K'];
export const VALID_VIDEO_ASPECT_RATIOS: VideoAspectRatio[] = ['16:9', '9:16'];

export const STYLE_DESCRIPTIONS: Record<LogoStyle, string> = {
  'modern-minimal': 'ultra-clean minimalist vector logo, bold negative space, timeless precision, sharp geometric curves, swiss graphic design standard, solid background',
  'monogram-lettermark': 'sophisticated interlocking typographic monogram lettermark, bespoke serif or sans-serif ligature, premium brand mark, balanced vector glyphs',
  'geometric-abstract': 'abstract geometric icon symbol, mathematical golden ratio curves, modern tech aesthetic, dynamic isometric planes, clean sharp lines',
  'futuristic-cyber': 'cutting-edge futuristic corporate emblem, neon accents, high-tech cyber optics, angular aerodynamic form, cybernetic precision',
  'luxury-elegant': 'haute couture luxury insignia, delicate gold-leaf or platinum foil detailing, bespoke timeless elegance, refined high-end typography',
  'vintage-retro': 'heritage artisanal craft emblem, hand-inked line work, timeless classic badge aesthetic, rich authentic patina, mid-century warmth',
  'badge-emblem': 'authoritative circular heraldic crest badge, balanced typography framing, university/aerospace seal aesthetic, pristine vector symmetry',
  'organic-nature': 'organic fluid botanical curves, eco-friendly harmonious silhouette, sustainable earthy minimalism, zen balance'
};

export const MOTION_PRESETS = [
  {
    id: 'smooth-3d-spin',
    name: '3D Extrusion & Metallic Spin',
    description: 'Logo transforms into 3D metallic volume, gently rotating with elegant studio lighting sweep.',
    prompt: 'Cinematic 3D animation of the logo: the 2D logo smoothly extrudes into a polished 3D metallic sculptural emblem, rotating with gentle acceleration against a sleek dark studio environment with volumetric light sweeps reflecting off its beveled edges.'
  },
  {
    id: 'neon-glow-pulse',
    name: 'Cyber Neon Pulse & Energy Reveal',
    description: 'Electric neon currents outline the logo contours, bursting into vibrant glowing illumination.',
    prompt: 'Vibrant motion graphic reveal: luminous neon laser filaments trace the precise contours of the logo, pulsating with electric energy before blooming into full vibrant illumination with soft ambient atmospheric smoke.'
  },
  {
    id: 'liquid-gold-flow',
    name: 'Liquid Flow & Shimmering Solidify',
    description: 'Molten liquid metal droplets flow and coalesce into the sharp, pristine company logo.',
    prompt: 'High-end luxury motion design: fluid droplets of molten liquid shimmer and coalesce together, smoothly solidifying into the crisp, flawless geometry of the logo with radiant caustic light glints.'
  },
  {
    id: 'kinetic-particle-burst',
    name: 'Kinetic Particle Assembly',
    description: 'Swirling microscopic stardust particles gravitate together in vortex motion to form the mark.',
    prompt: 'Dynamic particle convergence: thousands of shimmering crystalline particles swirl in a gravitational vortex, seamlessly locking into place to construct the exact logo mark, culminating in a subtle cinematic pulse.'
  },
  {
    id: 'minimal-draw-reveal',
    name: 'Architectural Line Draw & Snap',
    description: 'Crisp architectural draft lines draw the geometry cleanly, then fill with bold corporate brand color.',
    prompt: 'Crisp minimalist motion: precise technical drawing pen lines sketch the exact geometry of the emblem on screen, followed by a smooth vibrant color wash filling the shape with a confident, satisfying spring snap.'
  }
];

export const PRESET_COMPANIES = [
  {
    companyName: 'Aetheria Robotics',
    industry: 'Autonomous Systems & Aerospace',
    description: 'Autonomous drones and orbital propulsion systems designed for extreme environments.',
    tagline: 'Beyond Horizons',
    style: 'futuristic-cyber' as LogoStyle,
    colorPalette: 'Electric Cyan, Gunmetal Slate, and Obsidian Black',
    imageSize: '2K' as ImageResolution
  },
  {
    companyName: 'Solstice Botanical',
    industry: 'Organic Health & Herbal Elixirs',
    description: 'Cold-pressed adaptogenic herbals sourced ethically from alpine high-altitude gardens.',
    tagline: 'Nature in Equilibrium',
    style: 'organic-nature' as LogoStyle,
    colorPalette: 'Sage Green, Terracotta, and Warm Cream',
    imageSize: '2K' as ImageResolution
  },
  {
    companyName: 'Velox Cloud',
    industry: 'Distributed High-Performance Infrastructure',
    description: 'Ultra-low-latency edge computing architecture powering next-generation financial networks.',
    tagline: 'Zero Latency, Infinite Scale',
    style: 'geometric-abstract' as LogoStyle,
    colorPalette: 'Deep Indigo, Royal Violet, and Pure White',
    imageSize: '1K' as ImageResolution
  },
  {
    companyName: 'Maison Aurelius',
    industry: 'Fine Horology & Luxury Timepieces',
    description: 'Handcrafted Swiss-grade mechanical luxury watches made with reclaimed aerospace titanium.',
    tagline: 'Crafting Eternity',
    style: 'luxury-elegant' as LogoStyle,
    colorPalette: 'Champagne Gold, Deep Emerald, and Onyx',
    imageSize: '4K' as ImageResolution
  }
];

/**
 * Validates that an image resolution string is one of 1K, 2K, or 4K.
 */
export function validateImageSize(size: string): ImageResolution {
  if (size === '1K' || size === '2K' || size === '4K') {
    return size;
  }
  return '2K';
}

/**
 * Validates video aspect ratio is either '16:9' or '9:16'.
 */
export function validateVideoAspectRatio(ratio: string): VideoAspectRatio {
  if (ratio === '16:9' || ratio === '9:16') {
    return ratio;
  }
  return '16:9';
}

/**
 * Builds the comprehensive prompt for gemini-3-pro-image-preview.
 */
export function buildLogoPrompt(opts: LogoGenerationOptions): string {
  const styleKeywords = STYLE_DESCRIPTIONS[opts.style] || STYLE_DESCRIPTIONS['modern-minimal'];
  const paletteText = opts.colorPalette?.trim() 
    ? `Color palette: ${opts.colorPalette.trim()}.` 
    : 'Professional, harmonious corporate color scheme with high contrast against neutral backdrop.';
  const taglineText = opts.tagline?.trim() 
    ? `Include or reflect the spirit of the tagline "${opts.tagline.trim()}".` 
    : '';

  return [
    `Professional corporate logo design for "${opts.companyName.trim()}".`,
    `Industry & Domain: ${opts.industry.trim()}.`,
    `Company Profile & Vibe: ${opts.description.trim()}.`,
    taglineText,
    `Visual Style: ${styleKeywords}.`,
    paletteText,
    `Requirements: Clean iconic graphic symbol, centered vector logo presentation, iconic emblem, sharp crisp edges, professional typography of "${opts.companyName.trim()}" integrated or cleanly positioned below the symbol, pristine commercial branding presentation, master brand identity standard, no watermarks, no distorted artifacts, high resolution commercial graphic.`
  ].filter(Boolean).join(' ');
}

/**
 * Builds the motion animation prompt for gemini-omni-1.1-flash.
 */
export function buildMotionPrompt(opts: MotionGenerationOptions): string {
  const preset = MOTION_PRESETS.find(p => p.name === opts.motionStyle || p.id === opts.motionStyle);
  const baseMotion = preset ? preset.prompt : opts.motionStyle;
  const custom = opts.customInstructions?.trim() ? ` Additional direction: ${opts.customInstructions.trim()}.` : '';
  const framing = opts.aspectRatio === '9:16' 
    ? 'Framed vertically in 9:16 aspect ratio with the logo centered for mobile display.' 
    : 'Framed horizontally in cinematic 16:9 widescreen format.';

  return [
    baseMotion,
    custom,
    framing,
    'Ensure smooth continuous motion, 60fps cinematic fluidity, high fidelity lighting, flawless loop or settle into the final brand mark without camera wobble.'
  ].filter(Boolean).join(' ');
}
