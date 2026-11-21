import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Sparkles, Compass, ArrowUpRight } from 'lucide-react';

export const QuickActionCards: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      code: '01',
      title: 'Studio Engine',
      subtitle: 'Split-Screen Synthesis',
      description: 'Generate multi-scene animated videos with synchronized camera movements, storyboard cards, and multi-track timelines.',
      icon: Video,
      link: '/studio',
      tag: 'CINEMA',
      color: '#A5C4F2',
    },
    {
      code: '02',
      title: 'AI Director',
      subtitle: 'Script & Screenplay',
      description: 'Brainstorm screenplay arcs, camera blocking, lighting descriptors, and export scripts straight to video synthesis.',
      icon: MessageSquare,
      link: '/chat',
      tag: 'OMNI-4',
      color: '#E5A866',
    },
    {
      code: '03',
      title: 'Playground',
      subtitle: 'Generative Physics',
      description: 'Perform A/B prompt variations, test chaos factors and motion parameters side-by-side with instant visual feedback.',
      icon: Sparkles,
      link: '/playground',
      tag: 'LAB MATRIX',
      color: '#9875D8',
    },
    {
      code: '04',
      title: 'Showcase',
      subtitle: 'Global Gallery',
      description: 'Explore trending creations from digital directors across the globe. Inspect prompts, remix styles, and study camera setups.',
      icon: Compass,
      link: '/explore',
      tag: 'TRENDING',
      color: '#65C29A',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.code}
            onClick={() => navigate(card.link)}
            className="group relative flex flex-col justify-between p-5 rounded-3xl bg-[#080A10] hover:bg-[#0C0F17] border border-[#181C26] hover:border-white/20 cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <div className="space-y-4">
              {/* Header: Code & Tag */}
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-500 font-semibold">{card.code} //</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 tracking-wider">
                  {card.tag}
                </span>
              </div>

              {/* Icon & Title */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white group-hover:text-[#A5C4F2] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-medium text-white tracking-wide font-sans group-hover:text-[#A5C4F2] transition-colors">
                  {card.title}
                </h3>
                <span className="text-[11px] font-mono text-zinc-500 block">{card.subtitle}</span>
              </div>

              <p className="text-xs text-[#8A94A6] leading-relaxed line-clamp-3 font-light">
                {card.description}
              </p>
            </div>

            {/* Bottom link */}
            <div className="pt-4 mt-2 border-t border-[#141822] flex items-center justify-between text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
              <span>EXPLORE</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-zinc-500 group-hover:text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
