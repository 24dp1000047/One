import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Zap, Sparkles, Code2, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const QuickActionCards: React.FC = () => {
  const navigate = useNavigate();
  const sendMessage = useAppStore((state) => state.sendMessage);
  const createConversation = useAppStore((state) => state.createConversation);

  const cards = [
    {
      code: '01',
      title: 'Dual-Brain Chat',
      subtitle: 'System 1 + System 2',
      description: 'Collaborate with Jev (<100ms) for instant intent classification and Thinking Machines Inkling for multi-step reasoning.',
      icon: MessageSquare,
      tag: 'CORE AI',
      color: '#A5C4F2',
      prompt: 'Hello! What can you help me with today?',
    },
    {
      code: '02',
      title: 'TypeSafe Noul Engine',
      subtitle: 'Probabilistic Truth Verifier',
      description: 'Evaluate factual & botanical criteria truth scores (0-100% True) on contested propositions with zero hallucination.',
      icon: Zap,
      tag: 'SUB-50MS',
      color: '#E5A866',
      prompt: 'Is a tomato a fruit?',
    },
    {
      code: '03',
      title: 'Choice Probability Matrix',
      subtitle: 'Categorical Distribution',
      description: 'Compute discrete probability distributions across complex scenario outcomes and multi-hypothesis questions.',
      icon: Sparkles,
      tag: 'PROBABILITY',
      color: '#9875D8',
      prompt: 'What color is the sky during severe tornado storm conditions?',
    },
    {
      code: '04',
      title: 'Code & Architecture Lab',
      subtitle: 'Technical Synthesis',
      description: 'High-speed code generation, algorithm optimization, and reasoning budget allocation for senior engineers.',
      icon: Code2,
      tag: 'HIGH-BUDGET',
      color: '#65C29A',
      prompt: 'Write a TypeScript debounce function with generic types and cancellation support.',
    },
  ];

  const handleCardClick = (prompt: string) => {
    createConversation(prompt);
    navigate('/chat');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#141822]">
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="text-[#A5C4F2] font-semibold">04 //</span>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-widest uppercase font-mono">
            COGNITIVE SPECIALIZATION HUBS
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.code}
              onClick={() => handleCardClick(card.prompt)}
              className="group relative flex flex-col justify-between p-5 rounded-3xl bg-[#080A10] hover:bg-[#0C0F17] border border-[#181C26] hover:border-white/20 cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 group-hover:text-white transition-colors">
                    {card.tag}
                  </span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${card.color}15`, border: `1px solid ${card.color}30` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs text-zinc-500 mb-0.5">{card.code} // {card.subtitle}</div>
                  <h3 className="font-sans font-bold text-base text-white group-hover:text-brand-yellow transition-colors">
                    {card.title}
                  </h3>
                </div>

                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#141822] flex items-center justify-between font-mono text-[11px] text-zinc-500">
                <span>Click to Launch</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
