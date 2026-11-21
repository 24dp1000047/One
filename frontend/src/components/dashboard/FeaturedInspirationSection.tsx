import React from 'react';
import { useNavigate } from 'react-router-dom';
import { INSPIRATION_GALLERY } from '../../data/mockData';
import { Heart, Eye, ArrowUpRight, Wand2 } from 'lucide-react';
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
      <div className="flex items-center justify-between pb-2 border-b border-[#141822]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-[#E5A866] font-semibold">04 //</span>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-widest uppercase font-mono">
            Featured Inspiration
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">COMMUNITY ARCHIVE</span>
        </div>

        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono transition-colors cursor-pointer"
        >
          <span>EXPLORE ALL</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between rounded-3xl bg-[#080A10] border border-[#181C26] hover:border-white/20 overflow-hidden transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            {/* Visual Header */}
            <div className="relative aspect-video w-full overflow-hidden bg-black/60">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A10] via-transparent to-black/40" />

              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#A5C4F2] border border-white/10">
                {item.style}
              </div>

              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-white/10">
                <Heart className="w-3 h-3 text-[#E5A866] fill-[#E5A866]" />
                <span>{item.likes}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                {/* Creator info */}
                <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                  <img
                    src={item.creator.avatar}
                    alt={item.creator.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/10"
                  />
                  <span className="text-zinc-300 font-medium truncate">{item.creator.name}</span>
                  <span className="text-[10px] text-zinc-600">{item.creator.handle}</span>
                </div>

                <h3 className="text-sm font-medium text-white tracking-wide font-sans">{item.title}</h3>
                <p className="text-xs text-[#8A94A6] mt-1.5 line-clamp-2 leading-relaxed font-light">
                  "{item.prompt}"
                </p>
              </div>

              {/* Remix Button */}
              <div className="pt-3 border-t border-[#141822] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleRemix(item)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#A5C4F2] text-zinc-300 hover:text-black font-mono text-xs transition-all border border-white/10 hover:border-transparent cursor-pointer"
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
