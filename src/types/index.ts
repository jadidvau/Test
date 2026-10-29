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

export interface LogoItem {
  id: string;
  companyName: string;
  tagline?: string;
  industry: string;
  description: string;
  style: LogoStyle;
  colorPalette?: string;
  imageSize: ImageResolution;
  aspectRatio: string;
  prompt: string;
  imageUrl: string;
  rawBase64?: string;
  mimeType?: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface VideoItem {
  id: string;
  logoId?: string;
  companyName: string;
  videoUrl: string;
  thumbnailUrl?: string;
  aspectRatio: VideoAspectRatio;
  motionStyle: string;
  motionPrompt: string;
  createdAt: string;
  isFavorite?: boolean;
}

export type ActiveTab = 'design' | 'animate' | 'mockups' | 'gallery';
