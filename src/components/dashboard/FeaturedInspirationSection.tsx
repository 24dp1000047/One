import React from 'react';
import { useNavigate } from 'react-router-dom';
import { INSPIRATION_GALLERY } from '../../data/mockData';
import { Sparkles, Heart, Eye, ArrowUpRight, Copy, Wand2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const FeaturedInspirationSection: React.FC = () => {
  const navigate = useNavigate();
  const setStudioPrompt = useAppStore((state) => state.setStudioPrompt);
  const setSelectedStyle = useAppStore((state) => state.setSelectedStyle);
  const addToast = useAppStore((state) => state.addToast);

  const items = INSPIRATION_GALLERY.slice(0, 3);

  const handleRemix = (item: typeof INSPIRATION_GALLERY[0]) => {
    setStudioPrompt(item.prompt);
    setSelectedStyle(item.style);
    addToast({
      type: 'success',
      title: 'Prompt Loaded in Studio',
      message: `Remixing "${item.title}" by ${item.creator.name}`,
    });
    navigate('/studio');
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-brand-orange" />
          <h2 className="text-lg font-semibold text-white tracking-wide">Featured Inspiration</h2>
          <span className="text-xs font-mono text-muted">Community Masterpieces</span>
        </div>

        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1.5 text-xs text-brand-orange hover:underline font-medium"
        >
          <span>Explore All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between rounded-2xl bg-[#121212] border border-[#242424] hover:border-brand-orange/40 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-glow-orange-sm hover:-translate-y-1"
          >
            {/* Visual Header */}
            <div className="relative aspect-video w-full overflow-hidden bg-black/50">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                {item.style}
              </div>

              <div className="absolute top-2.5 right-2.5 flex items-center gap-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-white/10">
                <Heart className="w-3 h-3 text-brand-orange fill-brand-orange" />
                <span>{item.likes}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                {/* Creator info */}
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={item.creator.avatar}
                    alt={item.creator.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#333333]"
                  />
                  <span className="text-xs text-zinc-300 font-medium truncate">{item.creator.name}</span>
                  <span className="text-[10px] text-muted font-mono">{item.creator.handle}</span>
                </div>

                <h3 className="text-sm font-semibold text-white tracking-wide">{item.title}</h3>
                <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                  "{item.prompt}"
                </p>
              </div>

              {/* Remix Button */}
              <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleRemix(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-brand-orange text-zinc-200 hover:text-black font-semibold text-xs transition-all border border-[#2e2e2e] hover:border-transparent"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Remix Prompt</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
