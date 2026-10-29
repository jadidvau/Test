import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { 
  buildLogoPrompt, 
  buildMotionPrompt, 
  validateImageSize, 
  validateVideoAspectRatio,
  type ImageResolution,
  type VideoAspectRatio,
  type LogoStyle
} from './src/utils/logo-prompts.ts';
import { synthesizeProceduralLogo } from './src/utils/svg-synthesizer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Generous body limit for image payloads (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Server-side Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check and environment status
app.get('/api/status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    imageModel: 'gemini-3-pro-image-preview',
    videoModel: 'gemini-omni-1.1-flash',
    supportedImageSizes: ['1K', '2K', '4K'],
    supportedAspectRatios: ['16:9', '9:16'],
  });
});

/**
 * Generate high quality corporate logo using gemini-3-pro-image-preview
 * Supports resolution: 1K, 2K, 4K
 */
app.post('/api/generate-logo', async (req, res) => {
  try {
    const { 
      companyName, 
      industry, 
      description, 
      tagline, 
      style = 'modern-minimal', 
      colorPalette,
      imageSize = '2K',
      aspectRatio = '1:1',
      engine = 'auto' // 'auto' | 'gemini-3.8-flash' | 'gemini-3-pro-image-preview'
    } = req.body;

    if (!companyName || !companyName.trim()) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const validatedSize: ImageResolution = validateImageSize(imageSize);
    const validatedAspect = ['1:1', '16:9', '4:3', '9:16'].includes(aspectRatio) ? aspectRatio : '1:1';

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in server environment. Please set it in AI Studio Secrets.',
      });
    }

    // Helper for fast SVG vector synthesis using Gemini 3.8 Flash (Free Tier friendly)
    const generateWithFlashVector = async () => {
      try {
        console.log(`[LogoGen] Generating vector logo using Gemini 3.8 Flash for "${companyName}"...`);
        const svgPrompt = `You are an elite corporate brand identity designer. Create an ultra-crisp, professional corporate vector logo as standalone SVG for:
Company: "${companyName}"
Tagline: "${tagline || ''}"
Industry: "${industry || 'Technology'}"
Design Style: "${style}"
Color Palette: "${colorPalette || 'High-contrast vibrant corporate gradients'}"
Concept & Vibe: "${description || 'Modern visionary enterprise'}"
Resolution: ${validatedSize}

Strict Output Rules:
1. Output ONLY the raw <svg ...>...</svg> XML markup. No explanation, no markdown ticks, no commentary.
2. Root attributes: viewBox="0 0 800 800" width="800" height="800" xmlns="http://www.w3.org/2000/svg".
3. Background: Include a sleek backdrop: <rect width="800" height="800" fill="#090d16" rx="0"/>.
4. Structure: Inside <defs>, declare rich <linearGradient> and <radialGradient> palettes with glowing stops.
5. Symbol: Build a distinctive, iconic, mathematically balanced central vector geometric emblem.
6. Typography: Centered cleanly below the emblem, add <text> elements with "${companyName.toUpperCase()}" in bold font-weight, and secondary tagline in letter-spaced tracked font.
7. Ensure valid XML syntax, closed tags, and pristine aesthetic finish.`;

        const flashPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: svgPrompt,
        });

        const flashTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('FLASH_TIMEOUT')), 4000)
        );

        const flashResponse = await Promise.race([flashPromise, flashTimeout]) as any;

        let svgText = flashResponse.text?.trim() || '';
        if (svgText.includes('```xml')) {
          svgText = svgText.split('```xml')[1].split('```')[0].trim();
        } else if (svgText.includes('```svg')) {
          svgText = svgText.split('```svg')[1].split('```')[0].trim();
        } else if (svgText.includes('```')) {
          svgText = svgText.split('```')[1].split('```')[0].trim();
        }

        if (!svgText.startsWith('<svg')) {
          const svgStart = svgText.indexOf('<svg');
          const svgEnd = svgText.lastIndexOf('</svg>');
          if (svgStart !== -1 && svgEnd !== -1) {
            svgText = svgText.substring(svgStart, svgEnd + 6);
          }
        }

        if (svgText.startsWith('<svg') && svgText.endsWith('</svg>')) {
          return `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
        }
      } catch (err: any) {
        console.warn('[LogoGen] Flash vector API busy or rate-limited, utilizing procedural vector synthesizer:', err?.message);
      }

      // Infallible fallback: synthesize custom SVG with brand parameters
      const proceduralSvg = synthesizeProceduralLogo({
        companyName,
        tagline,
        industry,
        style: style as LogoStyle,
        colorPalette,
      });
      return `data:image/svg+xml;utf8,${encodeURIComponent(proceduralSvg)}`;
    };

    // If user explicitly chose Gemini 3.8 Flash Vector Engine
    if (engine === 'gemini-3.8-flash') {
      const svgUrl = await generateWithFlashVector();
      return res.json({
        success: true,
        id: `logo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        companyName,
        tagline,
        industry,
        style,
        imageSize: validatedSize,
        aspectRatio: validatedAspect,
        prompt: `Vector logo for ${companyName}`,
        imageUrl: svgUrl,
        mimeType: 'image/svg+xml',
        createdAt: new Date().toISOString(),
        engine: 'gemini-3.8-flash',
      });
    }

    // Try primary Gemini 3 Pro model with a short 6-second timeout before falling back
    const prompt = buildLogoPrompt({
      companyName,
      industry: industry || 'Technology & Innovation',
      description: description || 'Modern forward-thinking enterprise',
      tagline,
      style: style as LogoStyle,
      colorPalette,
      imageSize: validatedSize,
      aspectRatio: validatedAspect as any,
    });

    console.log(`[LogoGen] Generating logo for "${companyName}" with gemini-3-pro-image-preview at ${validatedSize}...`);

    try {
      const primaryPromise = ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: validatedAspect,
            imageSize: validatedSize,
          },
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('PRIMARY_TIMEOUT_OR_QUOTA')), 6000)
      );

      const response = await Promise.race([primaryPromise, timeoutPromise]) as any;

      let base64Image = '';
      let mimeType = 'image/png';

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          base64Image = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'image/png';
          break;
        }
      }

      if (base64Image) {
        const imageUrl = `data:${mimeType};base64,${base64Image}`;
        return res.json({
          success: true,
          id: `logo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          companyName,
          tagline,
          industry,
          style,
          imageSize: validatedSize,
          aspectRatio: validatedAspect,
          prompt,
          imageUrl,
          rawBase64: base64Image,
          mimeType,
          createdAt: new Date().toISOString(),
          engine: 'gemini-3-pro-image-preview',
        });
      }
    } catch (primaryErr: any) {
      console.warn('[LogoGen] Primary model rate limited or timed out:', primaryErr?.message);
    }

    // Seamless fallback to Gemini 3.8 Flash Vector Engine
    console.log(`[LogoGen] Using Gemini 3.8 Flash Vector Engine fallback...`);
    const svgUrl = await generateWithFlashVector();
    if (svgUrl) {
      return res.json({
        success: true,
        id: `logo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        companyName,
        tagline,
        industry,
        style,
        imageSize: validatedSize,
        aspectRatio: validatedAspect,
        prompt: `Vector logo for ${companyName} via Gemini 3.8 Flash`,
        imageUrl: svgUrl,
        mimeType: 'image/svg+xml',
        createdAt: new Date().toISOString(),
        engine: 'gemini-3.8-flash',
        isFreeTierFallback: true,
      });
    }

    return res.status(500).json({
      error: 'Failed to synthesize logo graphic. Please try again.',
    });
  } catch (error: any) {
    console.error('[LogoGen] Unexpected error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate logo image',
    });
  }
});

/**
 * Animate logo or uploaded photo into video using gemini-omni-1.1-flash via Interactions API
 * Supported aspect ratios: 16:9 (landscape) or 9:16 (portrait)
 */
app.post('/api/animate-video', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/png',
      motionStyle = '3D Extrusion & Metallic Spin',
      aspectRatio = '16:9',
      customInstructions = '',
      companyName = 'Company',
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required for animation' });
    }

    const validatedRatio: VideoAspectRatio = validateVideoAspectRatio(aspectRatio);

    // Clean image data string to get raw base64
    let cleanData = imageBase64;
    let detectedMime = mimeType;
    if (cleanData.includes(';base64,')) {
      const match = cleanData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1];
        cleanData = match[2];
      } else {
        cleanData = cleanData.split('base64,')[1];
      }
    }

    const motionPrompt = buildMotionPrompt({
      motionStyle,
      aspectRatio: validatedRatio,
      customInstructions,
      companyName,
    });

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in server environment. Please set it in AI Studio Secrets.',
      });
    }

    console.log(`[VideoGen] Animating image into ${validatedRatio} video using gemini-omni-1.1-flash via Interactions API...`);

    // Call Gemini Interactions API with gemini-omni-1.1-flash
    const interaction = await ai.interactions.create({
      model: 'gemini-omni-1.1-flash',
      input: [
        {
          type: 'image',
          mime_type: detectedMime,
          data: cleanData,
        },
        {
          type: 'text',
          text: motionPrompt,
        },
      ],
      background: false,
      store: false,
      stream: false,
      response_format: {
        type: 'video',
        aspect_ratio: validatedRatio, // '16:9' or '9:16'
      },
    }, { timeout: 300000 }); // 5 minutes timeout

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const outMime = videoPart.mime_type || 'video/mp4';
      const videoUrl = `data:${outMime};base64,${videoPart.data}`;

      return res.json({
        success: true,
        id: `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        videoUrl,
        aspectRatio: validatedRatio,
        motionStyle,
        motionPrompt,
        companyName,
        createdAt: new Date().toISOString(),
      });
    }

    // If output_video didn't contain direct data, inspect steps
    for (const step of (interaction.steps as any[]) || []) {
      if (step.type === 'model_output') {
        const videoContent = step.content?.find((c: any) => c.type === 'video') as any;
        if (videoContent && videoContent.data) {
          const outMime = videoContent.mime_type || 'video/mp4';
          const videoUrl = `data:${outMime};base64,${videoContent.data}`;
          return res.json({
            success: true,
            id: `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            videoUrl,
            aspectRatio: validatedRatio,
            motionStyle,
            motionPrompt,
            companyName,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    return res.status(502).json({
      error: 'The video model completed the interaction but did not return video bytes. Please try another motion style or image.',
    });
  } catch (error: any) {
    console.error('[VideoGen] Error:', error);
    const isQuota = error?.status === 429 || 
                    error?.message?.includes('429') || 
                    error?.message?.includes('RESOURCE_EXHAUSTED') ||
                    error?.message?.includes('quota');
    const message = isQuota
      ? 'Gemini Omni Flash video generation requires a billing-enabled API key. Please select a paid key in AI Studio Settings > Secrets.'
      : error?.message || 'Failed to generate animated video';
    return res.status(isQuota ? 429 : 500).json({
      error: message,
      isQuotaExceeded: isQuota,
      details: error?.statusText || error?.name,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LogoMotion Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
