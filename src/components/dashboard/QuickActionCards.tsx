import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Sparkles, Compass, ArrowUpRight, Flame } from 'lucide-react';

export const QuickActionCards: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Text-to-Video Studio',
      description: 'Generate multi-scene animated videos with synchronized camera movements, storyboard cards, and multi-track timelines.',
      icon: Video,
      link: '/studio',
      badge: 'Director Core',
      accent: 'yellow',
      gradient: 'from-brand-yellow/10 via-transparent to-transparent',
    },
    {
      title: 'AI Chat & Scripting',
      description: 'Brainstorm screenplay arcs, camera blocking, lighting descriptors, and export scripts straight to video synthesis.',
      icon: MessageSquare,
      link: '/chat',
      badge: 'Omni-4 Model',
      accent: 'blue',
      gradient: 'from-sky-500/10 via-transparent to-transparent',
    },
    {
      title: 'Creative Playground',
      description: 'Perform A/B prompt variations, test chaos factors and motion parameters side-by-side with instant visual feedback.',
      icon: Sparkles,
      link: '/playground',
      badge: 'Lab Mode',
      accent: 'orange',
      gradient: 'from-brand-orange/10 via-transparent to-transparent',
    },
    {
      title: 'Community Gallery',
      description: 'Explore trending creations from digital directors across the globe. Inspect prompts, remix styles, and study camera setups.',
      icon: Compass,
      link: '/explore',
      badge: 'Trending',
      accent: 'emerald',
      gradient: 'from-emerald-500/10 via-transparent to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => navigate(card.link)}
            className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#121212] hover:bg-[#161616] border border-[#242424] hover:border-brand-yellow/40 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-glow-yellow-sm hover:-translate-y-1 overflow-hidden"
          >
            {/* Ambient hover gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

            <div className="relative z-10 space-y-3">
              {/* Header: Icon + Badge */}
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#2d2d2d] group-hover:border-brand-yellow/50 text-white group-hover:text-brand-yellow transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#1e1e1e] border border-[#303030] text-zinc-300">
                  {card.badge}
                </span>
              </div>

              {/* Title & Desc */}
              <div>
                <h3 className="text-base font-semibold text-white tracking-wide group-hover:text-brand-yellow transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-3">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Bottom link prompt */}
            <div className="relative z-10 pt-4 mt-2 border-t border-[#1e1e1e] flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
              <span>Open Studio</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-yellow" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
