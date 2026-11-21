export interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:5' | '21:9';
  style?: string;
  seed?: number;
  batchCount?: number;
  model?: string;
}

export interface GeneratedImagePayload {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: string;
  resolution: string;
  style: string;
  model: string;
  seed: number;
  createdAt: string;
  upscaled?: boolean;
}

export function calculateDimensions(aspectRatio: string = '16:9'): { width: number; height: number } {
  switch (aspectRatio) {
    case '1:1':
      return { width: 1024, height: 1024 };
    case '9:16':
      return { width: 768, height: 1344 };
    case '4:5':
      return { width: 896, height: 1152 };
    case '21:9':
      return { width: 1536, height: 640 };
    case '16:9':
    default:
      return { width: 1344, height: 768 };
  }
}

export async function generateFluxImageService(
  params: GenerateImageRequest
): Promise<{ success: boolean; images: GeneratedImagePayload[]; primaryImage: GeneratedImagePayload; executionTimeMs: number }> {
  const startTime = Date.now();
  const { prompt, negativePrompt, aspectRatio = '16:9', style = 'Cinematic 35mm', seed, batchCount = 1, model = 'ONᵉ Flux.1 Ultra' } = params;

  const { width, height } = calculateDimensions(aspectRatio);
  const baseSeed = seed && seed > 0 ? seed : Math.floor(Math.random() * 899999) + 100000;

  // Enrich prompt with chosen style tokens
  let enrichedPrompt = prompt.trim();
  if (style && !enrichedPrompt.toLowerCase().includes(style.toLowerCase())) {
    enrichedPrompt = `${enrichedPrompt}, ${style} style, photorealistic 8K UHD, volumetric optical lighting, sharp focus`;
  }

  const count = Math.min(4, Math.max(1, batchCount || 1));
  const images: GeneratedImagePayload[] = [];

  for (let i = 0; i < count; i++) {
    const currentSeed = baseSeed + i * 37;
    const encodedPrompt = encodeURIComponent(enrichedPrompt);
    // Flux.1 Neural Endpoint
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&seed=${currentSeed}&nologo=true`;

    images.push({
      id: `img-flux-${Date.now()}-${i}-${currentSeed}`,
      url: imageUrl,
      prompt: enrichedPrompt,
      negativePrompt: negativePrompt || 'blurry, low quality, deformed anatomy, extra fingers, text watermark, jpeg artifacts, plastic look',
      aspectRatio,
      resolution: `${width}x${height}`,
      style,
      model,
      seed: currentSeed,
      createdAt: 'Just now',
      upscaled: false,
    });
  }

  const executionTimeMs = Date.now() - startTime;

  return {
    success: true,
    images,
    primaryImage: images[0],
    executionTimeMs,
  };
}
