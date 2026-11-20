import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  Heart, 
  Eye, 
  Copy, 
  Wand2, 
  Play, 
  Sparkles, 
  Layers, 
  Check, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { INSPIRATION_GALLERY, VIDEO_STYLES } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { InspirationItem } from '../types';

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const setStudioPrompt = useAppStore((state) => state.setStudioPrompt);
  const setSelectedStyle = useAppStore((state) => state.setSelectedStyle);
  const addToast = useAppStore((state) => state.addToast);

  const [items, setItems] = useState<InspirationItem[]>(INSPIRATION_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Sci-Fi', 'Anime', 'Surreal', 'Commercial', 'Abstract'];

  const handleLike = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    addToast({ type: 'success', title: 'Prompt Copied' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemix = (item: InspirationItem) => {
    setStudioPrompt(item.prompt);
    setSelectedStyle(item.style);
    addToast({
      type: 'success',
      title: 'Prompt Loaded in Studio',
      message: `Remixing "${item.title}"`,
    });
    navigate('/studio');
  };

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#141822]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#A5C4F2] font-semibold">05 //</span>
            <span className="text-zinc-500 uppercase tracking-widest">SHOWCASE</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
              COMMUNITY ARCHIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight mt-1">
            Explore Community Showcase
          </h1>
          <p className="text-xs text-[#8A94A6] mt-1 font-light">
            Discover community-crafted animated videos, inspect lighting prompts, and remix scenes with 1-click.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5A866]" />
          <span>CURATED DAILY BY ONe EDITORIAL</span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompt keywords, creators or titles..."
            className="w-full bg-[#141414] border border-[#242424] focus:border-brand-yellow/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-muted focus:outline-none"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                  : 'bg-[#151515] border border-[#242424] text-zinc-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Styles Spotlight Carousel/Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-300 tracking-wide flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
          <span>Cinematic Style Presets</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {VIDEO_STYLES.map((style) => (
            <div
              key={style.id}
              onClick={() => {
                setSelectedStyle(style.name);
                navigate('/studio');
              }}
              className="p-3 rounded-xl bg-[#141414] border border-[#242424] hover:border-brand-yellow/50 cursor-pointer transition-all hover:-translate-y-0.5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate">{style.name}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.color }} />
              </div>
              <p className="text-[10px] text-muted line-clamp-2 leading-tight">{style.desc}</p>
              <span className="inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1c1c1c] text-brand-yellow border border-[#2b2b2b]">
                {style.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Community Gallery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-wide">
            Trending Inspirations ({filteredItems.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl bg-[#121212] border border-[#242424] hover:border-brand-yellow/40 overflow-hidden transition-all duration-300 shadow-xl hover:shadow-glow-yellow-sm hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-brand-yellow border border-white/10">
                    {item.style}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                    {item.aspectRatio}
                  </span>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => handleLike(item.id)}
                  className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white hover:text-brand-orange transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      item.isLiked ? 'fill-brand-orange text-brand-orange' : 'text-zinc-300'
                    }`}
                  />
                  <span className="text-[11px] font-mono">{item.likes}</span>
                </button>

                {/* Duration badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10">
                  {item.duration}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Creator */}
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={item.creator.avatar}
                      alt={item.creator.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#333333]"
                    />
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-medium text-white truncate">{item.creator.name}</span>
                      <span className="text-[10px] text-muted font-mono">{item.creator.handle}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white tracking-wide">{item.title}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-3">
                    "{item.prompt}"
                  </p>
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyPrompt(item.prompt, item.id)}
                      className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#2b2b2b] text-muted hover:text-white transition-colors"
                      title="Copy Prompt"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRemix(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-yellow text-black font-semibold text-xs shadow-glow-yellow-sm hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Remix</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
