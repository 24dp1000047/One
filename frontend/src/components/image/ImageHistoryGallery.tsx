import React from 'react';
import { 
  Sparkles, 
  Heart, 
  Download, 
  ArrowUpRight, 
  Layers, 
  Clock, 
  Trash2 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { GeneratedImage } from '../../types';
import { audioSynth } from '../../utils/audioSynth';

export const ImageHistoryGallery: React.FC = () => {
  const generatedImages = useAppStore((state) => state.generatedImages);
  const activeGeneratedImage = useAppStore((state) => state.activeGeneratedImage);
  const setActiveGeneratedImage = useAppStore((state) => state.setActiveGeneratedImage);
  const toggleFavoriteImage = useAppStore((state) => state.toggleFavoriteImage);
  const setImagePrompt = useAppStore((state) => state.setImagePrompt);
  const addToast = useAppStore((state) => state.addToast);

  const handleRemix = (img: GeneratedImage) => {
    setImagePrompt(img.prompt);
    setActiveGeneratedImage(img);
    audioSynth.playClick(1200);
    addToast({
      type: 'info',
      title: 'Prompt Remixed',
      message: 'Loaded prompt and settings into generator.',
    });
  };

  return (
    <div className="rounded-3xl bg-[#07090F] border border-[#181C26] p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141822] pb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#A5C4F2]" />
          <span className="font-semibold text-white tracking-wider uppercase">
            Image History & Output Matrix
          </span>
          <span className="text-zinc-500">({generatedImages.length})</span>
        </div>

        <span className="text-[11px] text-zinc-500 hidden sm:inline">
          Click any output to inspect, upscale, or remix
        </span>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {generatedImages.map((img) => {
          const isActive = activeGeneratedImage?.id === img.id;
          return (
            <div
              key={img.id}
              onClick={() => setActiveGeneratedImage(img)}
              className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 shadow-md ${
                isActive
                  ? 'border-[#E5A866] ring-2 ring-[#E5A866]/30 shadow-[#E5A866]/10 scale-[1.02]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-white">
                  {img.aspectRatio}
                </span>
                {img.upscaled && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 text-[9px] font-mono">
                    4K
                  </span>
                )}
              </div>

              {/* Hover Actions */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteImage(img.id);
                  }}
                  className={`p-1.5 rounded-full bg-black/70 backdrop-blur-md transition-colors ${
                    img.isFavorite ? 'text-red-400' : 'text-white hover:text-red-400'
                  }`}
                  title="Favorite"
                >
                  <Heart className={`w-3 h-3 ${img.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemix(img);
                  }}
                  className="p-1.5 rounded-full bg-black/70 backdrop-blur-md text-white hover:text-[#E5A866] transition-colors"
                  title="Remix Prompt"
                >
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
