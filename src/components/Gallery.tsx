import React, { useState } from 'react';
import { 
  Layers, 
  Video, 
  Eye, 
  Download, 
  Search, 
  Filter, 
  Sparkles, 
  Film, 
  Maximize2,
  Trash2,
  Check
} from 'lucide-react';
import { LogoItem, VideoItem, ImageResolution } from '../types/index.ts';

interface GalleryProps {
  logos: LogoItem[];
  videos: VideoItem[];
  onSelectLogoForAnimation: (logo: LogoItem) => void;
  onSelectLogoForMockup: (logo: LogoItem) => void;
  onDeleteLogo?: (id: string) => void;
  onDeleteVideo?: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  logos,
  videos,
  onSelectLogoForAnimation,
  onSelectLogoForMockup,
  onDeleteLogo,
  onDeleteVideo,
}) => {
  const [galleryTab, setGalleryTab] = useState<'logos' | 'videos'>('logos');
  const [searchQuery, setSearchQuery] = useState('');
  const [resolutionFilter, setResolutionFilter] = useState<string>('all');
  const [aspectFilter, setAspectFilter] = useState<string>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<VideoItem | null>(null);

  // Filter logos
  const filteredLogos = logos.filter((logo) => {
    const matchesSearch = 
      logo.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logo.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      logo.style.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRes = resolutionFilter === 'all' || logo.imageSize === resolutionFilter;
    return matchesSearch && matchesRes;
  });

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = 
      video.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.motionStyle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAspect = aspectFilter === 'all' || video.aspectRatio === aspectFilter;
    return matchesSearch && matchesAspect;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Brand Kit & Media Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">
            Your Creative Gallery
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Access and download all your AI-crafted corporate logos and motion videos in full fidelity.
          </p>
        </div>

        {/* Tab switch between Logos and Videos */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setGalleryTab('logos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              galleryTab === 'logos'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Logos ({logos.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setGalleryTab('videos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              galleryTab === 'videos'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({videos.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${galleryTab === 'logos' ? 'logos by name, style, industry...' : 'videos by company or style...'}`}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Resolution or Aspect Filter */}
        {galleryTab === 'logos' ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Size:
            </span>
            {['all', '1K', '2K', '4K'].map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolutionFilter(res)}
                className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                  resolutionFilter === res
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {res === 'all' ? 'All Sizes' : res}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Aspect:
            </span>
            {['all', '16:9', '9:16'].map((asp) => (
              <button
                key={asp}
                type="button"
                onClick={() => setAspectFilter(asp)}
                className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                  aspectFilter === asp
                    ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {asp === 'all' ? 'All Formats' : asp}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Grid */}
      {galleryTab === 'logos' ? (
        filteredLogos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLogos.map((logo) => (
              <div
                key={logo.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
              >
                {/* Logo Canvas Preview */}
                <div className="relative aspect-square bg-slate-950 flex items-center justify-center p-6 border-b border-slate-800/80">
                  <img
                    src={logo.imageUrl}
                    alt={logo.companyName}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-indigo-950/80 backdrop-blur border border-indigo-800/80 text-[10px] font-bold text-indigo-300">
                    {logo.imageSize}
                  </div>
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] font-medium text-slate-400">
                    {logo.style.replace('-', ' ')}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-white text-base font-['Space_Grotesk'] truncate">
                      {logo.companyName}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {logo.industry}
                    </p>
                    {logo.tagline && (
                      <p className="text-[11px] text-indigo-400 italic truncate mt-0.5">
                        "{logo.tagline}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/60">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectLogoForAnimation(logo)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Animate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectLogoForMockup(logo)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Mockup</span>
                      </button>
                    </div>

                    <a
                      href={logo.imageUrl}
                      download={`${logo.companyName.toLowerCase().replace(/\s+/g, '-')}-logo-${logo.imageSize}.png`}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download {logo.imageSize}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No logos match your search filter.
          </div>
        )
      ) : (
        /* Video Gallery */
        filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
              >
                {/* Video Container */}
                <div 
                  className={`relative bg-slate-950 flex items-center justify-center border-b border-slate-800/80 overflow-hidden cursor-pointer ${
                    video.aspectRatio === '9:16' ? 'h-[360px]' : 'aspect-video'
                  }`}
                  onClick={() => setActiveVideoModal(video)}
                >
                  <video
                    src={video.videoUrl}
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-fuchsia-950/80 backdrop-blur border border-fuchsia-800/80 text-[10px] font-bold text-fuchsia-300">
                    {video.aspectRatio}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg">
                      <Film className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-white text-base font-['Space_Grotesk'] truncate">
                      {video.companyName}
                    </h3>
                    <p className="text-xs text-violet-400 font-medium truncate mt-0.5">
                      {video.motionStyle}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {video.motionPrompt}
                    </p>
                  </div>

                  <a
                    href={video.videoUrl}
                    download={`${video.companyName.toLowerCase().replace(/\s+/g, '-')}-animated-${video.aspectRatio.replace(':', 'x')}.mp4`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Video ({video.aspectRatio})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No animated videos generated yet. Head over to the "Animate Video" tab to create your first 16:9 or 9:16 motion video!
          </div>
        )
      )}

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">
                  {activeVideoModal.companyName}
                </h3>
                <p className="text-xs text-violet-400">{activeVideoModal.motionStyle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div 
              className={`mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center ${
                activeVideoModal.aspectRatio === '9:16' ? 'w-[280px] h-[500px]' : 'w-full aspect-video'
              }`}
            >
              <video
                src={activeVideoModal.videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={activeVideoModal.videoUrl}
                download={`${activeVideoModal.companyName.toLowerCase().replace(/\s+/g, '-')}-animated-${activeVideoModal.aspectRatio.replace(':', 'x')}.mp4`}
                className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Video</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
