import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Pin, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface ChatSidebarProps {
  onCloseMobile?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onCloseMobile }) => {
  const conversations = useAppStore((state) => state.conversations);
  const activeId = useAppStore((state) => state.activeConversationId);
  const setActiveId = useAppStore((state) => state.setActiveConversationId);
  const createConversation = useAppStore((state) => state.createConversation);
  const deleteConversation = useAppStore((state) => state.deleteConversation);
  const renameConversation = useAppStore((state) => state.renameConversation);
  const togglePin = useAppStore((state) => state.togglePinConversation);

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#171D25] border-r border-[#2A475E]/70">
      {/* Header with New Chat */}
      <div className="p-4 space-y-3 border-b border-[#2A475E]/70">
        <button
          onClick={() => {
            createConversation();
            onCloseMobile?.();
          }}
          className="steam-button-primary flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Cinematic Chat</span>
        </button>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-[#1B2838] border border-[#2A475E] focus:border-[#66C0F4] rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted">
            No chats found. Click "New Cinematic Chat" to begin.
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = conv.id === activeId;
            const isEditing = editingId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveId(conv.id);
                  onCloseMobile?.();
                }}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  isActive
                    ? 'bg-[#1a1a1a] text-white border border-brand-yellow/30 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-brand-yellow shadow-glow-yellow-sm" />
                )}

                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-brand-yellow' : 'text-muted group-hover:text-zinc-300'
                    }`}
                  />

                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-[#111] border border-brand-yellow/50 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <div className="min-w-0">
                      <p className="truncate tracking-wide">{conv.title}</p>
                      <span className="text-[10px] text-muted font-mono block">{conv.updatedAt}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => handleSaveEdit(conv.id, e)}
                        className="p-1 text-emerald-400 hover:bg-emerald-400/10 rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="p-1 text-muted hover:text-white rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(conv.id);
                        }}
                        className={`p-1 rounded hover:bg-white/10 ${
                          conv.pinned ? 'text-brand-yellow opacity-100' : 'text-muted hover:text-white'
                        }`}
                        title={conv.pinned ? 'Unpin' : 'Pin conversation'}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleStartEdit(conv.id, conv.title, e)}
                        className="p-1 text-muted hover:text-white rounded hover:bg-white/10"
                        title="Rename"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="p-1 text-muted hover:text-rose-400 rounded hover:bg-white/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1f1f1f] flex items-center justify-between text-[11px] font-mono text-muted">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
          <span>Local Engine</span>
        </span>
        <span>{conversations.length} Threads</span>
      </div>
    </div>
  );
};
