import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { LogoGenerator } from './components/LogoGenerator.tsx';
import { MotionGenerator } from './components/MotionGenerator.tsx';
import { MockupStudio } from './components/MockupStudio.tsx';
import { Gallery } from './components/Gallery.tsx';
import { LogoItem, VideoItem, ActiveTab } from './types/index.ts';
import { INITIAL_LOGOS, INITIAL_VIDEOS } from './utils/sample-logos.ts';
import { Sparkles, Video, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('design');
  const [logos, setLogos] = useState<LogoItem[]>(INITIAL_LOGOS);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);

  const [selectedLogo, setSelectedLogo] = useState<LogoItem | null>(INITIAL_LOGOS[0] || null);
  const [recentLogo, setRecentLogo] = useState<LogoItem | null>(INITIAL_LOGOS[0] || null);
  const [recentVideo, setRecentVideo] = useState<VideoItem | null>(null);

  // Parse query params for autostart or tab navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ActiveTab | null;
    if (tabParam && ['design', 'animate', 'mockups', 'gallery'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleLogoGenerated = (newLogo: LogoItem) => {
    setLogos((prev) => [newLogo, ...prev]);
    setRecentLogo(newLogo);
    setSelectedLogo(newLogo);
  };

  const handleVideoGenerated = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
    setRecentVideo(newVideo);
  };

  const handleAnimateLogo = (logo: LogoItem) => {
    setSelectedLogo(logo);
    setActiveTab('animate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewMockup = (logo: LogoItem) => {
    setSelectedLogo(logo);
    setActiveTab('mockups');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logoCount={logos.length}
        videoCount={videos.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'design' && (
          <LogoGenerator
            onLogoGenerated={handleLogoGenerated}
            onAnimateLogo={handleAnimateLogo}
            onViewMockup={handleViewMockup}
            recentLogo={recentLogo}
          />
        )}

        {activeTab === 'animate' && (
          <MotionGenerator
            selectedLogo={selectedLogo}
            allLogos={logos}
            onSelectLogo={setSelectedLogo}
            onVideoGenerated={handleVideoGenerated}
            recentVideo={recentVideo}
          />
        )}

        {activeTab === 'mockups' && (
          <MockupStudio
            selectedLogo={selectedLogo}
            allLogos={logos}
            onSelectLogo={setSelectedLogo}
            onAnimateLogo={handleAnimateLogo}
          />
        )}

        {activeTab === 'gallery' && (
          <Gallery
            logos={logos}
            videos={videos}
            onSelectLogoForAnimation={handleAnimateLogo}
            onSelectLogoForMockup={handleViewMockup}
            onDeleteLogo={(id) => setLogos((prev) => prev.filter((l) => l.id !== id))}
            onDeleteVideo={(id) => setVideos((prev) => prev.filter((v) => v.id !== id))}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300 font-['Space_Grotesk']">
              LogoMotion Studio
            </span>
            <span className="text-slate-600">•</span>
            <span>Vector Identity & Video Generation</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>gemini-3-pro-image-preview (1K/2K/4K)</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3 text-fuchsia-400" />
              <span>gemini-omni-1.1-flash (16:9 / 9:16)</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
