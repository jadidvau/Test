import React, { useState } from 'react';
import { 
  Eye, 
  Smartphone, 
  CreditCard, 
  Globe, 
  Shirt, 
  Building2, 
  Download, 
  Sparkles,
  Video
} from 'lucide-react';
import { LogoItem } from '../types/index.ts';

interface MockupStudioProps {
  selectedLogo: LogoItem | null;
  allLogos: LogoItem[];
  onSelectLogo: (logo: LogoItem) => void;
  onAnimateLogo: (logo: LogoItem) => void;
}

type MockupType = 'card' | 'app' | 'website' | 'merch' | 'billboard';

export const MockupStudio: React.FC<MockupStudioProps> = ({
  selectedLogo,
  allLogos,
  onSelectLogo,
  onAnimateLogo,
}) => {
  const [activeMockup, setActiveMockup] = useState<MockupType>('card');

  if (!selectedLogo && allLogos.length > 0) {
    onSelectLogo(allLogos[0]);
  }

  const logo = selectedLogo || allLogos[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Brand Identity Mockup Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">
            Real-World Brand Mockup Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Preview your AI-designed identity across physical business stationery, mobile app interfaces, luxury merchandise, and digital billboards.
          </p>
        </div>

        {logo && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAnimateLogo(logo)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-md shadow-violet-600/20 transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Animate this Mark</span>
            </button>
          </div>
        )}
      </div>

      {/* Select Logo Ribbon */}
      {allLogos.length > 1 && (
        <div className="mb-6 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-3 overflow-x-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 pl-2">
            Switch Logo:
          </span>
          <div className="flex items-center gap-2">
            {allLogos.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onSelectLogo(l)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                  logo?.id === l.id
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <img src={l.imageUrl} alt={l.companyName} className="w-4 h-4 object-contain" />
                <span>{l.companyName}</span>
                <span className="text-[10px] text-slate-500">({l.imageSize})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mockup Selector Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveMockup('card')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeMockup === 'card'
              ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-cyan-400" />
          <span>Matte Business Card</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMockup('app')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeMockup === 'app'
              ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>Mobile App Squircle</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMockup('website')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeMockup === 'website'
              ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>SaaS Platform Header</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMockup('merch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeMockup === 'merch'
              ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shirt className="w-4 h-4 text-cyan-400" />
          <span>Apparel & Merch</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMockup('billboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeMockup === 'billboard'
              ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>Urban Billboard</span>
        </button>
      </div>

      {/* Mockup Canvas Stage */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-12 shadow-2xl flex items-center justify-center min-h-[460px] relative overflow-hidden">
        {logo ? (
          <>
            {/* 1. Matte Business Card */}
            {activeMockup === 'card' && (
              <div className="relative group w-full max-w-lg aspect-[1.75/1] bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-8 shadow-2xl flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-20 h-20 p-2 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center justify-center">
                    <img src={logo.imageUrl} alt={logo.companyName} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                      FOUNDER & CEO
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Dr. Harrison Vance
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xl font-black tracking-tight text-white font-['Space_Grotesk']">
                    {logo.companyName}
                  </div>
                  {logo.tagline && (
                    <div className="text-xs text-indigo-400 font-medium tracking-wide">
                      {logo.tagline}
                    </div>
                  )}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80">
                    <span>contact@{logo.companyName.toLowerCase().replace(/\s+/g, '')}.com</span>
                    <span>San Francisco • Tokyo</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Mobile App Squircle */}
            {activeMockup === 'app' && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-48 h-48 rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 p-8 shadow-2xl flex items-center justify-center relative group hover:scale-105 transition-all duration-300 shadow-indigo-500/10">
                  <img src={logo.imageUrl} alt={logo.companyName} className="max-w-full max-h-full object-contain filter drop-shadow-xl" />
                  <div className="absolute inset-0 rounded-[36px] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">{logo.companyName}</h3>
                  <p className="text-xs text-slate-400">iOS & Android App Store Icon</p>
                </div>
              </div>
            )}

            {/* 3. SaaS Website Header */}
            {activeMockup === 'website' && (
              <div className="w-full max-w-2xl bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                {/* Browser bar */}
                <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <div className="mx-auto text-[11px] font-mono text-slate-400 bg-slate-950 px-4 py-0.5 rounded-md border border-slate-800">
                    https://{logo.companyName.toLowerCase().replace(/\s+/g, '')}.io
                  </div>
                </div>

                {/* Header nav bar */}
                <div className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={logo.imageUrl} alt={logo.companyName} className="w-8 h-8 object-contain" />
                    <span className="font-extrabold text-sm text-white font-['Space_Grotesk']">
                      {logo.companyName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                    <span className="text-white">Platform</span>
                    <span>Enterprise</span>
                    <span>Solutions</span>
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                      Get Started
                    </button>
                  </div>
                </div>

                {/* Hero preview */}
                <div className="p-8 text-center space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
                    Next-Generation Architecture
                  </span>
                  <h2 className="text-2xl font-black text-white font-['Space_Grotesk']">
                    {logo.tagline || `Accelerate with ${logo.companyName}`}
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto line-clamp-2">
                    {logo.description}
                  </p>
                </div>
              </div>
            )}

            {/* 4. Apparel & Merch */}
            {activeMockup === 'merch' && (
              <div className="relative w-80 h-96 bg-slate-950 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center shadow-2xl">
                {/* T-Shirt illustration outline */}
                <div className="absolute inset-4 border border-dashed border-slate-800/80 rounded-2xl pointer-events-none" />
                <div className="w-36 h-36 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                  <img src={logo.imageUrl} alt={logo.companyName} className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                </div>
                <div className="mt-4 text-center">
                  <div className="text-xs font-bold text-slate-300 font-['Space_Grotesk'] uppercase tracking-wider">
                    Official Brand Merchandise
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Heavyweight Organic Cotton • Chest Embroidery
                  </div>
                </div>
              </div>
            )}

            {/* 5. Urban Billboard */}
            {activeMockup === 'billboard' && (
              <div className="w-full max-w-xl aspect-[16/9] bg-gradient-to-b from-slate-950 via-slate-900 to-black rounded-2xl border-4 border-slate-800 p-8 flex flex-col items-center justify-center text-center relative shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
                <div className="w-24 h-24 mb-3">
                  <img src={logo.imageUrl} alt={logo.companyName} className="w-full h-full object-contain filter drop-shadow-2xl" />
                </div>
                <h2 className="text-2xl font-black text-white font-['Space_Grotesk'] tracking-tight">
                  {logo.companyName}
                </h2>
                <p className="text-xs text-cyan-400 font-semibold tracking-wider mt-1">
                  {logo.tagline || logo.industry}
                </p>
                <div className="absolute bottom-2 right-4 text-[10px] font-mono text-slate-600">
                  TIMES SQUARE DIGITAL BANNER • 4K
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-slate-500 text-sm">
            Generate or select a logo first to view mockups.
          </div>
        )}
      </div>
    </div>
  );
};
