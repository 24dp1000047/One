import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, Image as ImageIcon, Eye, Wand2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const RecentProjectsSection: React.FC = () => {
  const navigate = useNavigate();
  const generatedImages = useAppStore((state) => state.generatedImages);
  const toggleFavoriteImage = useAppStore((state) => state.toggleFavoriteImage);
  const setActiveGeneratedImage = useAppStore((state) => state.setActiveGeneratedImage);
  const setImagePrompt = useAppStore((state) => state.setImagePrompt);
  const setSelectedImageStyle = useAppStore((state) => state.setSelectedImageStyle);
  const addToast = useAppStore((state) => state.addToast);

  const displayImages = generatedImages.slice(0, 4);

  const handleOpenInStudio = (img: typeof generatedImages[0]) => {
    setActiveGeneratedImage(img);
    setImagePrompt(img.prompt);
    setSelectedImageStyle(img.style);
    addToast({
      type: 'info',
      title: 'Image Loaded in Studio',
      message: 'Active image, parameters and prompt ready for remixing.',
    });
    navigate('/studio');
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#141822]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-[#A5C4F2] font-semibold">03 //</span>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-widest uppercase font-mono">
            Recent Image Generations
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
            {generatedImages.length} SYNTHESIZED
          </span>
        </div>

        <NavLink
          to="/creations"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono transition-colors"
        >
          <span>VIEW GALLERY</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayImages.map((img) => (
          <div
            key={img.id}
            onClick={() => handleOpenInStudio(img)}
            className="group relative rounded-3xl bg-[#080A10] border border-[#181C26] hover:border-white/25 overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            {/* Thumbnail Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-black/60">
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover overlay with Inspect/Remix button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full pill-action text-xs font-semibold shadow-lg transition-transform group-hover:scale-105">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in Studio</span>
                </div>
              </div>

              {/* Badges on Thumbnail */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#A5C4F2] font-bold border border-white/10">
                  {img.resolution}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/10">
                  {img.aspectRatio}
                </span>
                {img.upscaled && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    4K AI
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteImage(img.id);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-[#E5A866] transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    img.isFavorite ? 'fill-[#E5A866] text-[#E5A866]' : 'text-zinc-400'
                  }`}
                />
              </button>
            </div>

            {/* Info Container */}
            <div className="p-4 space-y-2">
              <h3 className="font-medium text-xs sm:text-sm text-white line-clamp-1 group-hover:text-[#A5C4F2] transition-colors">
                {img.prompt}
              </h3>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="text-zinc-400">{img.style}</span>
                <span>{img.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
