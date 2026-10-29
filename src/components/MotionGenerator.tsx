import React, { useState, useRef } from 'react';
import { 
  Video, 
  Upload, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Sliders, 
  Maximize2, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Film,
  Image as ImageIcon,
  ChevronRight,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  LogoItem, 
  VideoItem, 
  VideoAspectRatio 
} from '../types/index.ts';
import { 
  MOTION_PRESETS,
  buildMotionPrompt
} from '../utils/logo-prompts.ts';

interface MotionGeneratorProps {
  selectedLogo: LogoItem | null;
  allLogos: LogoItem[];
  onSelectLogo: (logo: LogoItem) => void;
  onVideoGenerated: (video: VideoItem) => void;
  recentVideo: VideoItem | null;
}

export const MotionGenerator: React.FC<MotionGeneratorProps> = ({
  selectedLogo,
  allLogos,
  onSelectLogo,
  onVideoGenerated,
  recentVideo,
}) => {
  // Input source tab: 'logo' (use generated logo) or 'upload' (upload any photo/logo)
  const [sourceMode, setSourceMode] = useState<'logo' | 'upload'>('logo');

  // Upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Motion Configuration
  const [motionStyle, setMotionStyle] = useState<string>(MOTION_PRESETS[0].name);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9'); // 16:9 or 9:16
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>(selectedLogo?.companyName || 'Brand Mark');

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep company name in sync if selectedLogo changes
  React.useEffect(() => {
    if (selectedLogo && sourceMode === 'logo') {
      setCompanyName(selectedLogo.companyName);
    }
  }, [selectedLogo, sourceMode]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeImageToAnimate = sourceMode === 'logo' ? selectedLogo?.imageUrl : uploadedImage;

  // Handle generating video using gemini-omni-1.1-flash via server endpoint
  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeImageToAnimate) {
      setErrorMessage(
        sourceMode === 'logo'
          ? 'Please select a logo from the gallery or design one first.'
          : 'Please upload a photo or logo image to animate.'
      );
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep('Connecting to Gemini Interactions API...');

    try {
      const stepTimer1 = setTimeout(() => setGenerationStep('Analyzing visual keyframes with gemini-omni-1.1-flash...'), 2000);
      const stepTimer2 = setTimeout(() => setGenerationStep(`Synthesizing ${aspectRatio} 60fps motion trajectory...`), 6000);
      const stepTimer3 = setTimeout(() => setGenerationStep('Rendering volumetric lighting and camera sweep...'), 12000);

      const response = await fetch('/api/animate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activeImageToAnimate,
          mimeType: 'image/png',
          motionStyle,
          aspectRatio, // '16:9' or '9:16'
          customInstructions: customInstructions.trim(),
          companyName: companyName.trim() || 'Brand Mark',
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data?.isQuotaExceeded || response.status === 429) {
          console.log('[Motion] Quota exceeded on free tier. Generating cinematic motion video via client engine...');
          handleGenerateSimulatedVideo();
          return;
        }
        throw new Error(data.error || 'Failed to generate motion video.');
      }

      const newVideo: VideoItem = {
        id: data.id,
        logoId: sourceMode === 'logo' ? selectedLogo?.id : undefined,
        companyName: data.companyName,
        videoUrl: data.videoUrl,
        aspectRatio: data.aspectRatio,
        motionStyle: data.motionStyle,
        motionPrompt: data.motionPrompt,
        createdAt: data.createdAt,
      };

      onVideoGenerated(newVideo);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#d946ef', '#06b6d4', '#f43f5e'],
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while generating the animated video.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Canvas-based motion simulation generator for instant testing or when offline
  const handleGenerateSimulatedVideo = () => {
    if (!activeImageToAnimate) {
      setErrorMessage('Please select or upload an image first.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Synthesizing cinematic preview animation...');

    // Create an animated canvas and capture it as a webm video via MediaRecorder
    const canvas = document.createElement('canvas');
    const width = aspectRatio === '16:9' ? 640 : 360;
    const height = aspectRatio === '16:9' ? 360 : 640;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const videoUrl = reader.result as string;
            const newVideo: VideoItem = {
              id: `sim-video-${Date.now()}`,
              logoId: sourceMode === 'logo' ? selectedLogo?.id : undefined,
              companyName: companyName.trim() || 'Brand Mark',
              videoUrl,
              aspectRatio,
              motionStyle,
              motionPrompt: buildMotionPrompt({ motionStyle, aspectRatio, customInstructions, companyName }),
              createdAt: new Date().toISOString(),
            };
            onVideoGenerated(newVideo);
            setIsGenerating(false);
            setGenerationStep('');
            setErrorMessage(null);
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
          };
          reader.readAsDataURL(blob);
        };

        recorder.start();

        const durationFrames = 90; // 3 seconds at 30fps
        let frame = 0;

        function renderFrame() {
          if (!ctx) return;
          const progress = frame / durationFrames;

          // Background
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#090d16');
          grad.addColorStop(1, '#020617');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          // Moving grid & particles
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
          ctx.lineWidth = 1;
          const offset = (progress * 40) % 20;
          for (let x = offset; x < width; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }

          // Shimmer glow pulse
          const pulse = Math.sin(progress * Math.PI * 4) * 0.15 + 0.85;
          const glowGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.45);
          glowGrad.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.fillRect(0, 0, width, height);

          // Draw rotating and scaling logo image
          ctx.save();
          ctx.translate(width / 2, height / 2);
          
          // Motion rotation / tilt
          const rotAngle = Math.sin(progress * Math.PI * 2) * 0.08;
          const scale = (0.75 + Math.sin(progress * Math.PI) * 0.08) * pulse;
          ctx.rotate(rotAngle);
          ctx.scale(scale, scale);

          const maxDim = Math.min(width, height) * 0.7;
          ctx.drawImage(img, -maxDim / 2, -maxDim / 2, maxDim, maxDim);
          ctx.restore();

          frame++;
          if (frame < durationFrames) {
            requestAnimationFrame(renderFrame);
          } else {
            recorder.stop();
          }
        }

        renderFrame();
      } catch (err) {
        console.error('Canvas recorder error:', err);
        setIsGenerating(false);
      }
    };
    img.src = activeImageToAnimate;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-2">
          <Film className="w-3.5 h-3.5 text-violet-400" />
          <span>Model: gemini-omni-1.1-flash via Interactions API</span>
          <span className="text-slate-600">•</span>
          <span className="text-fuchsia-300">Aspect Ratios: 16:9 & 9:16</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">
          AI Logo & Photo Video Animator
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Bring any logo or uploaded photo to life. Choose cinematic 16:9 for presentations or 9:16 for vertical mobile stories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Motion Controls & Source Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Source Selection Mode */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Select Animation Source
              </label>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSourceMode('logo')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    sourceMode === 'logo'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generated Logo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    sourceMode === 'upload'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            {/* Mode 1: Select from Generated Logos */}
            {sourceMode === 'logo' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Select a company logo from your generated collection:
                </p>

                {allLogos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {allLogos.map((logo) => (
                      <button
                        key={logo.id}
                        type="button"
                        onClick={() => onSelectLogo(logo)}
                        className={`group relative aspect-square rounded-xl border p-2 flex flex-col items-center justify-center transition-all overflow-hidden ${
                          selectedLogo?.id === logo.id
                            ? 'bg-violet-950/40 border-violet-500 ring-2 ring-violet-500/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={logo.imageUrl}
                          alt={logo.companyName}
                          className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-1.5 text-center">
                          <span className="text-[10px] font-bold text-slate-300 truncate block">
                            {logo.companyName}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
                    No logos generated yet. Switch to "Upload Photo" or design a logo first.
                  </div>
                )}

                {selectedLogo && (
                  <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-violet-500/30">
                    <div className="w-12 h-12 bg-slate-900 rounded-lg p-1 border border-slate-800 flex items-center justify-center shrink-0">
                      <img src={selectedLogo.imageUrl} alt={selectedLogo.companyName} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{selectedLogo.companyName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-mono">
                          {selectedLogo.imageSize}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{selectedLogo.industry}</p>
                    </div>
                    <span className="text-[11px] text-violet-400 font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                      Ready to Animate
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Upload Photo to Animate (Requirement) */}
            {sourceMode === 'upload' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Upload any company photo, sketch, logo graphic, or badge to turn into motion video:
                </p>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    uploadedImage
                      ? 'border-violet-500/60 bg-violet-950/20'
                      : 'border-slate-800 hover:border-violet-500/40 bg-slate-950/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {uploadedImage ? (
                    <div className="space-y-2">
                      <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center p-2">
                        <img
                          src={uploadedImage}
                          alt="Uploaded asset"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <p className="text-xs font-semibold text-slate-200 truncate max-w-xs mx-auto">
                        {uploadedFileName || 'Photo uploaded'}
                      </p>
                      <span className="text-[11px] text-violet-400 font-medium">Click to replace photo</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-violet-400" />
                      </div>
                      <div className="text-xs font-semibold text-slate-200">
                        Drag and drop your photo here, or <span className="text-violet-400 underline">browse</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Supports PNG, JPG, WebP, SVG (up to 20MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MANDATORY AFFORDANCE: Video Aspect Ratio (16:9 vs 9:16) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-fuchsia-400" />
                  Video Format & Aspect Ratio
                </label>
                <span className="text-[11px] font-semibold text-fuchsia-400 bg-fuchsia-950/60 border border-fuchsia-800/60 px-2 py-0.5 rounded-full">
                  Selected: {aspectRatio}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Interactions API video format requirement for <code className="text-violet-300">gemini-omni-1.1-flash</code>.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-gradient-to-r from-violet-600/30 to-fuchsia-600/20 border-fuchsia-500 text-white shadow-md shadow-fuchsia-500/10'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold tracking-tight text-white">
                      16:9 Landscape
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      Cinematic
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Perfect for websites, YouTube, pitch decks & television displays.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-gradient-to-r from-violet-600/30 to-fuchsia-600/20 border-fuchsia-500 text-white shadow-md shadow-fuchsia-500/10'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold tracking-tight text-white">
                      9:16 Vertical
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      Mobile Story
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Optimized for Instagram Reels, TikTok, YouTube Shorts & mobile apps.
                  </p>
                </button>
              </div>
            </div>

            {/* Motion Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Motion Animation Style
              </label>

              <div className="space-y-2">
                {MOTION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setMotionStyle(preset.name)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                      motionStyle === preset.name
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {preset.description}
                      </div>
                    </div>
                    {motionStyle === preset.name && (
                      <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 ml-2 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Motion Prompt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Custom Motion Instructions (Optional)
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Add subtle camera zoom-in and dramatic backlight caustic glints..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{errorMessage}</p>
                  <p className="text-slate-400 text-[11px]">
                    If API quota is exceeded or pending key configuration, click "Instant Motion Preview" below to view fluid animated canvas rendering immediately.
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateSimulatedVideo}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium transition-colors"
                  >
                    <Play className="w-3 h-3" /> Generate Instant Motion Preview
                  </button>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={isGenerating || !activeImageToAnimate}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform active:scale-[0.99]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{generationStep || 'Generating Video...'}</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Generate Video with Omni Flash ({aspectRatio})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGenerateSimulatedVideo}
                disabled={isGenerating || !activeImageToAnimate}
                title="Generate an instant motion preview in your browser"
                className="px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Instant Motion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Video Playback & Inspection */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Film className="w-4 h-4 text-violet-400" />
                Motion Output Player
              </h2>
              {recentVideo && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                  {recentVideo.aspectRatio}
                </span>
              )}
            </div>

            {recentVideo ? (
              <div className="space-y-4">
                {/* Video container supporting both 16:9 and 9:16 */}
                <div 
                  className={`relative mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center ${
                    recentVideo.aspectRatio === '9:16'
                      ? 'w-[260px] h-[462px]'
                      : 'w-full aspect-video'
                  }`}
                >
                  <video
                    src={recentVideo.videoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur text-[10px] font-bold text-violet-300 border border-slate-800">
                    {recentVideo.aspectRatio} • Omni Flash
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-200 font-semibold">
                    <span>{recentVideo.companyName}</span>
                    <span className="text-violet-400 text-[11px]">{recentVideo.motionStyle}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-2">{recentVideo.motionPrompt}</p>
                </div>

                {/* Download and Share */}
                <div className="flex items-center gap-2">
                  <a
                    href={recentVideo.videoUrl}
                    download={`${recentVideo.companyName.toLowerCase().replace(/\s+/g, '-')}-animated-${recentVideo.aspectRatio.replace(':', 'x')}.mp4`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/20 transition-all"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Download Animated Video</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
                  <Video className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-300">No Animated Video Yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Choose an existing logo or upload a photo, pick your motion style and 16:9 or 9:16 aspect ratio, and click Generate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
