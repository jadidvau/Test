import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Layers, 
  Palette, 
  Maximize2, 
  Video, 
  Eye, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  Sliders,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ImageResolution, 
  LogoStyle, 
  LogoItem 
} from '../types/index.ts';
import { 
  STYLE_DESCRIPTIONS, 
  PRESET_COMPANIES,
  buildLogoPrompt
} from '../utils/logo-prompts.ts';

interface LogoGeneratorProps {
  onLogoGenerated: (logo: LogoItem) => void;
  onAnimateLogo: (logo: LogoItem) => void;
  onViewMockup: (logo: LogoItem) => void;
  recentLogo: LogoItem | null;
}

const STYLE_OPTIONS: { id: LogoStyle; label: string; badge: string; desc: string }[] = [
  { id: 'modern-minimal', label: 'Minimalist Vector', badge: 'Timeless', desc: 'Bold negative space & Swiss graphic precision' },
  { id: 'monogram-lettermark', label: 'Monogram Ligature', badge: 'Editorial', desc: 'Bespoke lettermark with interlocking typography' },
  { id: 'geometric-abstract', label: 'Geometric Abstract', badge: 'Tech', desc: 'Golden-ratio curves and dynamic planes' },
  { id: 'futuristic-cyber', label: 'Futuristic Cyber', badge: 'Next-Gen', desc: 'Aerodynamic emblem with neon laser optics' },
  { id: 'luxury-elegant', label: 'Luxury Insignia', badge: 'Haute', desc: 'Fine gold detailing & bespoke crest mark' },
  { id: 'vintage-retro', label: 'Vintage Heritage', badge: 'Artisanal', desc: 'Handcrafted mid-century linework & badge' },
  { id: 'badge-emblem', label: 'Corporate Crest', badge: 'Official', desc: 'Symmetrical circular seal & authoritative framing' },
  { id: 'organic-nature', label: 'Organic Botanical', badge: 'Eco', desc: 'Harmonious botanical curves & sustainable vibe' },
];

const COLOR_PALETTES = [
  { name: 'Neon Cyberpunk', value: 'Electric Cyan, Hot Violet, and Deep Obsidian' },
  { name: 'Monochrome Luxe', value: 'Ultra Clean Matte Black, Crisp Pure White, and Slate 900' },
  { name: 'Royal Gold & Navy', value: 'Champagne Gold, Deep Midnight Navy, and Ivory' },
  { name: 'Alpine Botanical', value: 'Earthy Sage Green, Terracotta Warmth, and Forest Moss' },
  { name: 'Solar Sunset', value: 'Vibrant Coral Orange, Crimson Pink, and Soft Peach' },
  { name: 'Quantum Indigo', value: 'Deep Electric Indigo, Cyan Glow, and Starfield Silver' },
];

export const LogoGenerator: React.FC<LogoGeneratorProps> = ({
  onLogoGenerated,
  onAnimateLogo,
  onViewMockup,
  recentLogo,
}) => {
  const [companyName, setCompanyName] = useState('Apex Dynamics');
  const [tagline, setTagline] = useState('Pioneering Motion Intelligence');
  const [industry, setIndustry] = useState('Artificial Intelligence & Autonomous Mobility');
  const [description, setDescription] = useState('High-performance neural hardware accelerating deep robotic navigation and spatial vision.');
  const [style, setStyle] = useState<LogoStyle>('futuristic-cyber');
  const [colorPalette, setColorPalette] = useState('Electric Cyan, Hot Violet, and Deep Obsidian');
  const [imageSize, setImageSize] = useState<ImageResolution>('2K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3'>('1:1');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedEngine, setSelectedEngine] = useState<'gemini-3.8-flash' | 'gemini-3-pro-image-preview'>('gemini-3.8-flash');

  // Apply a preset company
  const applyPreset = (preset: typeof PRESET_COMPANIES[0]) => {
    setCompanyName(preset.companyName);
    setIndustry(preset.industry);
    setDescription(preset.description);
    setTagline(preset.tagline || '');
    setStyle(preset.style);
    setColorPalette(preset.colorPalette);
    setImageSize(preset.imageSize);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrorMessage('Please enter a company name.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep(
      selectedEngine === 'gemini-3.8-flash'
        ? 'Synthesizing vector logo geometry with Gemini 3.8 Flash...'
        : 'Initializing Gemini 3 Pro model...'
    );

    try {
      // Step simulator for high fidelity feedback
      const stepTimer1 = setTimeout(() => setGenerationStep('Synthesizing brand geometry & typography...'), 1200);
      const stepTimer2 = setTimeout(() => setGenerationStep(`Rendering ${imageSize} high-resolution vector emblem...`), 2400);

      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          industry: industry.trim(),
          description: description.trim(),
          tagline: tagline.trim(),
          style,
          colorPalette,
          imageSize,
          aspectRatio,
          engine: selectedEngine,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate logo.');
      }

      const newLogo: LogoItem = {
        id: data.id,
        companyName: data.companyName,
        tagline: data.tagline,
        industry: data.industry,
        description: description.trim(),
        style: data.style,
        colorPalette,
        imageSize: data.imageSize,
        aspectRatio: data.aspectRatio,
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        rawBase64: data.rawBase64,
        mimeType: data.mimeType,
        createdAt: data.createdAt,
      };

      onLogoGenerated(newLogo);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#06b6d4', '#ec4899'],
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Quick fallback generator if user wants an instant preview even without external key
  const handleGenerateDemoFallback = () => {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <rect width="800" height="800" fill="#090d16"/>
      <defs>
        <radialGradient id="fglow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#6366f1" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#090d16" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="gbrand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#c084fc"/>
        </linearGradient>
      </defs>
      <circle cx="400" cy="350" r="280" fill="url(#fglow)"/>
      <g transform="translate(400, 340)">
        <polygon points="0,-130 112,-65 112,65 0,130 -112,65 -112,-65" fill="none" stroke="url(#gbrand)" stroke-width="8"/>
        <path d="M-60,-40 L0,-100 L60,-40 L30,40 L-30,40 Z" fill="url(#gbrand)"/>
        <circle cx="0" cy="0" r="24" fill="#ffffff" filter="drop-shadow(0 0 10px #38bdf8)"/>
      </g>
      <text x="400" y="580" font-family="'Space Grotesk', sans-serif" font-size="44" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="8">${companyName.toUpperCase()}</text>
      <text x="400" y="620" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="600" fill="#818cf8" text-anchor="middle" letter-spacing="10">${(tagline || industry).toUpperCase()}</text>
    </svg>`;

    const demoLogo: LogoItem = {
      id: `demo-${Date.now()}`,
      companyName,
      tagline,
      industry,
      description,
      style,
      colorPalette,
      imageSize,
      aspectRatio,
      prompt: buildLogoPrompt({ companyName, industry, description, tagline, style, colorPalette, imageSize, aspectRatio }),
      imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}`,
      createdAt: new Date().toISOString(),
    };

    onLogoGenerated(demoLogo);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro Hero Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Model: gemini-3-pro-image-preview</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300">Sizes: 1K, 2K, 4K</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">
              AI Corporate Logo Designer
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Describe your brand vision, select your aesthetic archetype, and generate production-ready 
              high-resolution logos with Gemini 3 Pro. Next, animate your mark into 60fps video with Gemini Omni Flash.
            </p>
          </div>

          {/* Preset Inspiration Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Presets:
            </span>
            {PRESET_COMPANIES.map((preset) => (
              <button
                key={preset.companyName}
                type="button"
                onClick={() => applyPreset(preset)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
              >
                {preset.companyName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleGenerate} className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Company Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Company Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Aetheria Labs"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tagline / Slogan (Optional)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Beyond Horizons"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Industry / Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Industry & Domain
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Deep Robotics, Quantum Computing, Luxury Fashion"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Brand Description & Vision */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Brand Description & Symbol Concept
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your brand represents, the core visual motif, symbolism, and desired feeling..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
              />
            </div>

            {/* MANDATORY AFFORDANCE: Image Size (1K, 2K, 4K) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Image Output Resolution
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  Configured: {imageSize}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Powered by <code className="text-indigo-300">gemini-3-pro-image-preview</code>. Choose higher resolutions for high-DPI retina screens and 4K video animation.
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                      imageSize === size
                        ? 'bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-base font-extrabold tracking-tight font-['Space_Grotesk']">
                      {size}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {size === '1K' ? '1024 × 1024' : size === '2K' ? '2048 × 2048' : '4096 × 4096 (Ultra)'}
                    </div>
                  </button>
                ))}
              </div>

              {/* AI Engine Selector (Free Tier vs Flagship) */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    AI Generation Engine
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    {selectedEngine === 'gemini-3.8-flash' ? 'Free Tier Enabled' : 'Billing Key Needed'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('gemini-3.8-flash')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedEngine === 'gemini-3.8-flash'
                        ? 'bg-emerald-950/30 border-emerald-500/80 text-white ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Gemini 3.8 Flash</span>
                    </div>
                    <div className="text-[10px] text-emerald-300/80 mt-0.5">
                      Fast Vector AI • Free Tier (No 429 errors)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedEngine('gemini-3-pro-image-preview')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedEngine === 'gemini-3-pro-image-preview'
                        ? 'bg-indigo-950/30 border-indigo-500/80 text-white ring-1 ring-indigo-500/30'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Maximize2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Gemini 3 Pro</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Pixel Diffusion • Paid Tier
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Style Archetypes Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Logo Design Style
                </label>
                <span className="text-[11px] text-slate-400">
                  {STYLE_OPTIONS.find((s) => s.id === style)?.badge}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STYLE_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStyle(item.id)}
                    className={`p-2.5 text-left rounded-xl border transition-all ${
                      style === item.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-tight text-slate-200">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-violet-400" />
                  Color Palette
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => setColorPalette(palette.value)}
                    className={`px-3 py-2 rounded-xl text-left border text-xs transition-all ${
                      colorPalette === palette.value
                        ? 'bg-violet-600/20 border-violet-500 text-white font-semibold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-slate-200 font-medium truncate">{palette.name}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{palette.value}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Toggle */}
            <div className="border-t border-slate-800/80 pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Aspect Ratio & Prompt Preview' : 'Show Aspect Ratio & Prompt Preview'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 pt-3 border-t border-slate-800/40">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Canvas Aspect Ratio
                    </label>
                    <div className="flex gap-2">
                      {(['1:1', '16:9', '4:3'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-3 py-1.5 text-xs rounded-lg border ${
                            aspectRatio === ratio
                              ? 'bg-indigo-600/30 border-indigo-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {ratio} {ratio === '1:1' ? '(Standard Logo)' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Generated Prompt for gemini-3-pro-image-preview:
                    </span>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed line-clamp-3">
                      {buildLogoPrompt({ companyName, industry, description, tagline, style, colorPalette, imageSize, aspectRatio })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="text-slate-400 text-[11px]">
                    You can configure GEMINI_API_KEY in the Secrets panel, or click "Generate Instant Demo" below to preview vector rendering immediately.
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateDemoFallback}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Generate Instant Demo Logo
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:via-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform active:scale-[0.99]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{generationStep || 'Generating Logo...'}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Logo ({imageSize} Resolution)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGenerateDemoFallback}
                disabled={isGenerating}
                title="Generate an instant SVG vector preview"
                className="px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Instant Demo</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Active Logo Preview & Quick Actions */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Active Logo Preview
              </h2>
              {recentLogo && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  {recentLogo.imageSize} • {recentLogo.aspectRatio}
                </span>
              )}
            </div>

            {recentLogo ? (
              <div className="space-y-4">
                {/* Visual Canvas Display */}
                <div className="relative group aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-center p-6 shadow-inner">
                  <img
                    src={recentLogo.imageUrl}
                    alt={`${recentLogo.companyName} Logo`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-slate-300">
                    {recentLogo.companyName}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-indigo-950/80 backdrop-blur-md border border-indigo-800/80 text-[10px] font-bold text-indigo-300">
                    {recentLogo.imageSize}
                  </div>
                </div>

                {/* Metadata summary */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300 font-semibold">
                    <span>{recentLogo.companyName}</span>
                    <span className="text-slate-400 font-normal">{recentLogo.industry}</span>
                  </div>
                  {recentLogo.tagline && (
                    <p className="text-slate-400 italic text-[11px]">"{recentLogo.tagline}"</p>
                  )}
                  <p className="text-slate-400 text-[11px] line-clamp-2">{recentLogo.prompt}</p>
                </div>

                {/* Next Steps: Animate or Mockup */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onAnimateLogo(recentLogo)}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-md shadow-violet-600/20 transition-all active:scale-[0.98]"
                  >
                    <Video className="w-4 h-4" />
                    <span>Animate to Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewMockup(recentLogo)}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-[0.98]"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>View in Mockups</span>
                  </button>
                </div>

                {/* Download Button */}
                <a
                  href={recentLogo.imageUrl}
                  download={`${recentLogo.companyName.toLowerCase().replace(/\s+/g, '-')}-logo-${recentLogo.imageSize}.png`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download Full Resolution ({recentLogo.imageSize})</span>
                </a>
              </div>
            ) : (
              <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                  <Wand2 className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-300">No Logo Generated Yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Fill out the brand brief on the left or click one of the presets to craft your identity in 1K, 2K, or 4K.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
