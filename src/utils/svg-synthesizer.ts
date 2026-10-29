import { LogoStyle } from '../types/index.ts';

interface SynthesizerOptions {
  companyName: string;
  tagline?: string;
  industry?: string;
  style: LogoStyle;
  colorPalette?: string;
}

export function synthesizeProceduralLogo(opts: SynthesizerOptions): string {
  const name = opts.companyName.trim();
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'LM';

  const subtext = (opts.tagline?.trim() || opts.industry?.trim() || 'CORPORATE IDENTITY').toUpperCase();

  // Style palettes
  let gradStart = '#00f2fe';
  let gradMid = '#4facfe';
  let gradEnd = '#6366f1';
  let accent = '#38bdf8';

  if (opts.style === 'luxury-elegant') {
    gradStart = '#f6d365';
    gradMid = '#fda085';
    gradEnd = '#d4af37';
    accent = '#f6d365';
  } else if (opts.style === 'organic-nature') {
    gradStart = '#84fab0';
    gradMid = '#8fd3f4';
    gradEnd = '#2e7d32';
    accent = '#84fab0';
  } else if (opts.style === 'modern-minimal') {
    gradStart = '#ffffff';
    gradMid = '#cbd5e1';
    gradEnd = '#94a3b8';
    accent = '#ffffff';
  } else if (opts.style === 'vintage-retro') {
    gradStart = '#ff9966';
    gradMid = '#ff5e62';
    gradEnd = '#8b4513';
    accent = '#ff9966';
  } else if (opts.style === 'geometric-abstract') {
    gradStart = '#8a2387';
    gradMid = '#e94057';
    gradEnd = '#f27121';
    accent = '#f27121';
  }

  // Symbol geometry based on style
  let symbolMarkup = '';

  if (opts.style === 'monogram-lettermark') {
    symbolMarkup = `
      <circle cx="0" cy="0" r="130" fill="none" stroke="url(#pGrad)" stroke-width="4" stroke-dasharray="16 8"/>
      <circle cx="0" cy="0" r="115" fill="none" stroke="url(#pGrad)" stroke-width="2"/>
      <text x="0" y="45" font-family="'Space Grotesk', serif" font-size="120" font-weight="900" fill="url(#pGrad)" text-anchor="middle" letter-spacing="4">${initials}</text>
    `;
  } else if (opts.style === 'geometric-abstract') {
    symbolMarkup = `
      <polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" fill="none" stroke="url(#pGrad)" stroke-width="6"/>
      <path d="M-60,-40 L0,-100 L60,-40 L30,40 L-30,40 Z" fill="url(#pGrad)" opacity="0.85"/>
      <circle cx="0" cy="0" r="26" fill="#ffffff" filter="drop-shadow(0 0 15px ${accent})"/>
    `;
  } else if (opts.style === 'luxury-elegant') {
    symbolMarkup = `
      <circle cx="0" cy="0" r="135" fill="none" stroke="url(#pGrad)" stroke-width="2.5" stroke-dasharray="3 7"/>
      <circle cx="0" cy="0" r="125" fill="none" stroke="url(#pGrad)" stroke-width="1.5"/>
      <polygon points="0,-85 6,-70 22,-70 9,-60 14,-45 0,-55 -14,-45 -9,-60 -22,-70 -6,-70" fill="url(#pGrad)"/>
      <text x="0" y="42" font-family="Georgia, serif" font-size="95" font-weight="700" fill="url(#pGrad)" text-anchor="middle" letter-spacing="6">${initials}</text>
      <line x1="-50" y1="65" x2="50" y2="65" stroke="url(#pGrad)" stroke-width="2"/>
    `;
  } else if (opts.style === 'organic-nature') {
    symbolMarkup = `
      <circle cx="0" cy="-20" r="85" fill="none" stroke="url(#pGrad)" stroke-width="3"/>
      <path d="M-90,60 C-70,-10 0,-70 0,-20 C0,30 -50,80 -90,60 Z" fill="url(#pGrad)" opacity="0.9"/>
      <path d="M90,60 C70,-10 0,-70 0,-20 C0,30 50,80 90,60 Z" fill="url(#pGrad)" opacity="0.7"/>
      <circle cx="0" cy="-20" r="20" fill="#ffffff" filter="drop-shadow(0 0 12px ${accent})"/>
    `;
  } else {
    // Default: futuristic aerodynamic cyber
    symbolMarkup = `
      <polygon points="0,-140 120,-60 120,60 0,140 -120,60 -120,-60" fill="none" stroke="url(#pGrad)" stroke-width="4" opacity="0.4"/>
      <path d="M0,-120 L90,50 L50,50 L0,-40 L-50,50 L-90,50 Z" fill="url(#pGrad)"/>
      <ellipse cx="0" cy="15" rx="75" ry="22" fill="none" stroke="#ffffff" stroke-width="6" stroke-dasharray="12 8" transform="rotate(-15)"/>
      <circle cx="0" cy="-15" r="22" fill="#ffffff" filter="drop-shadow(0 0 16px ${accent})"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#090d16"/>
  <defs>
    <radialGradient id="ambGlow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#090d16" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradStart}"/>
      <stop offset="50%" stop-color="${gradMid}"/>
      <stop offset="100%" stop-color="${gradEnd}"/>
    </linearGradient>
  </defs>
  <circle cx="400" cy="350" r="280" fill="url(#ambGlow)"/>
  <g transform="translate(400, 340)">
    ${symbolMarkup}
  </g>
  <text x="400" y="585" font-family="'Space Grotesk', -apple-system, sans-serif" font-size="44" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="8">${name.toUpperCase()}</text>
  <text x="400" y="628" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="${accent}" text-anchor="middle" letter-spacing="10">${subtext}</text>
</svg>`;
}
