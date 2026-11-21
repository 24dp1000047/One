import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Clock, Plus, Zap, Bot, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const RecentConversationsSection: React.FC = () => {
  const navigate = useNavigate();
  const conversations = useAppStore((state) => state.conversations);
  const setActiveId = useAppStore((state) => state.setActiveConversationId);
  const createConversation = useAppStore((state) => state.createConversation);

  const displayList = conversations.slice(0, 4);

  const handleOpenChat = (id: string) => {
    setActiveId(id);
    navigate('/chat');
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#141822]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#A5C4F2]" />
            Recent Conversations
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
            {conversations.length} THREADS
          </span>
        </div>

        <button
          onClick={() => {
            createConversation();
            navigate('/chat');
          }}
          className="flex items-center gap-1.5 text-xs text-brand-yellow hover:text-white font-mono transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>START NEW THREAD</span>
        </button>
      </div>

      {/* Grid of Conversation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayList.map((conv) => {
          const lastMsg = conv.messages[conv.messages.length - 1];
          return (
            <div
              key={conv.id}
              onClick={() => handleOpenChat(conv.id)}
              className="group relative flex flex-col justify-between p-5 rounded-3xl bg-[#1B2838] hover:bg-[#20344A] border border-[#2A475E] hover:border-[#66C0F4]/70 cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 text-white font-medium">
                    <MessageSquare className="w-3.5 h-3.5 text-[#66C0F4]" />
                    {conv.messages.length} messages
                  </span>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {conv.updatedAt || 'Recent'}
                  </span>
                </div>

                <h3 className="font-sans font-semibold text-sm text-white group-hover:text-[#66C0F4] transition-colors line-clamp-1">
                  {conv.title}
                </h3>

                <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                  {lastMsg ? lastMsg.content : 'No messages in this conversation yet.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#141822] flex items-center justify-between font-mono text-[11px] text-zinc-500">
                <span className="text-emerald-400/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Jev + Inkling
                </span>
                <span className="flex items-center gap-1 text-zinc-400 group-hover:text-white transition-colors">
                  <span>Resume</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
