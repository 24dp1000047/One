import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  MessageSquare, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Cpu,
  Brain,
  Settings
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BrandName } from './BrandName';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const isCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const settings = useAppStore((state) => state.settings);
  const conversations = useAppStore((state) => state.conversations);
  const activeId = useAppStore((state) => state.activeConversationId);
  const setActiveId = useAppStore((state) => state.setActiveConversationId);
  const createConversation = useAppStore((state) => state.createConversation);
  const deleteConversation = useAppStore((state) => state.deleteConversation);
  const renameConversation = useAppStore((state) => state.renameConversation);
  const togglePin = useAppStore((state) => state.togglePinConversation);

  const navigate = useNavigate();
  const location = useLocation();

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

  const pinned = filtered.filter((c) => c.pinned);
  const unpinned = filtered.filter((c) => !c.pinned);

  return (
    <aside
      className={`relative z-30 flex flex-col h-screen border-r border-[#2A475E]/70 bg-[#171D25]/92 backdrop-blur-md transition-all duration-300 select-none overflow-hidden ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Subtle Internal Animated Ambient Steam Glow Orbs */}
      <div className="absolute top-10 -left-12 w-48 h-48 bg-[#66C0F4]/08 rounded-full blur-2xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-28 -right-12 w-48 h-48 bg-[#E5A866]/06 rounded-full blur-2xl pointer-events-none animate-pulse-subtle [animation-delay:3s]" />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between h-16 px-4 border-b border-[#2A475E]/70">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
          {/* Logo Icon with Animated Counter-Rotating Orbital Ring */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#1B2838] border border-[#2A475E] group-hover:border-[#66C0F4] transition-all duration-300 shrink-0 shadow-inner group-hover:shadow-[0_0_15px_rgba(102,192,244,0.4)]">
            <div className="w-5 h-5 rounded-full border border-[#66C0F4]/40 border-t-[#66C0F4] animate-spin [animation-duration:6s] absolute" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#66C0F4] animate-pulse shadow-[0_0_8px_#66C0F4]" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <BrandName className="font-bold text-lg tracking-wider text-white" />
                <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#5C7E10]/25 text-[#A4D007] border border-[#5C7E10]/50 uppercase tracking-widest font-semibold">
                  <span className="w-1 h-1 rounded-full bg-[#A4D007] animate-ping" />
                  STEAM AI
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 truncate font-mono tracking-tight flex items-center gap-1">
                <span>Dual-Brain Engine</span>
              </span>
            </div>
          )}
        </NavLink>

        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors hidden md:block cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Top Section: Dashboard & AI Chat Nav */}
      <div className="relative z-10 px-2.5 py-2.5 space-y-1 border-b border-[#2A475E]/70">
        <NavLink
          to="/"
          title={isCollapsed ? 'Dashboard' : undefined}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
              isActive && location.pathname === '/'
                ? 'bg-gradient-to-r from-[#2A475E]/70 to-[#1B2838]/60 text-white font-medium border border-[#66C0F4]/40 shadow-[0_0_12px_rgba(102,192,244,0.15)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`
          }
        >
          {location.pathname === '/' && (
            <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#66C0F4] shadow-[0_0_8px_#66C0F4] animate-pulse" />
          )}
          <LayoutDashboard className={`w-4 h-4 shrink-0 ${location.pathname === '/' ? 'text-[#66C0F4]' : 'text-zinc-500'}`} />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full min-w-0">
              <span className="truncate tracking-wider">Dashboard</span>
              <span className="text-[10px] text-zinc-400 font-mono">01</span>
            </div>
          )}
        </NavLink>

        <NavLink
          to="/chat"
          title={isCollapsed ? 'AI Chat' : undefined}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
              isActive || location.pathname.startsWith('/chat')
                ? 'bg-gradient-to-r from-[#2A475E]/70 to-[#1B2838]/60 text-white font-medium border border-[#66C0F4]/40 shadow-[0_0_12px_rgba(102,192,244,0.15)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`
          }
        >
          {location.pathname.startsWith('/chat') && (
            <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#66C0F4] shadow-[0_0_8px_#66C0F4] animate-pulse" />
          )}
          <MessageSquare className={`w-4 h-4 shrink-0 ${location.pathname.startsWith('/chat') ? 'text-[#66C0F4]' : 'text-zinc-500'}`} />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full min-w-0">
              <span className="truncate tracking-wider">AI Chat</span>
              <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#5C7E10]/25 text-[#A4D007] border border-[#5C7E10]/50 shadow-[0_0_8px_rgba(164,208,7,0.2)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A4D007] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#A4D007]" />
                </span>
                <span>Live</span>
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Primary Action: New Chat Button with Shimmer Sweep */}
      <div className="relative z-10 p-3 border-b border-[#2A475E]/70">
        {!isCollapsed ? (
          <button
            onClick={() => {
              createConversation();
              navigate('/chat');
              onCloseMobile?.();
            }}
            className="relative group overflow-hidden steam-button-primary flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(102,192,244,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
            <span>New Conversation</span>
          </button>
        ) : (
          <button
            onClick={() => {
              createConversation();
              navigate('/chat');
              onCloseMobile?.();
            }}
            title="New Conversation"
            className="relative group overflow-hidden steam-button-primary flex items-center justify-center w-11 h-10 mx-auto rounded-full font-semibold cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(102,192,244,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}

        {/* Search Conversations Input */}
        {!isCollapsed && (
          <div className="relative mt-2.5">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chat history..."
              className="w-full bg-[#101822] border border-[#2A475E] focus:border-[#66C0F4] rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none font-mono transition-colors"
            />
          </div>
        )}
      </div>

      {/* Conversations Navigation List */}
      <nav className="relative z-10 flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
        {!isCollapsed ? (
          <>
            {/* Pinned Section */}
            {pinned.length > 0 && (
              <div className="mb-3 space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
                  <Pin className="w-3 h-3 text-[#E5A866] animate-pulse" />
                  <span>Pinned Conversations</span>
                </div>
                {pinned.map((conv) => {
                  const isActive = conv.id === activeId;
                  const isEditing = editingId === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveId(conv.id);
                        navigate('/chat');
                        onCloseMobile?.();
                      }}
                      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-all duration-200 hover:translate-x-0.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#2A475E]/60 via-white/[0.05] to-transparent text-white font-medium border border-[#66C0F4]/40 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#66C0F4] shadow-[0_0_8px_#66C0F4] animate-pulse" />
                      )}

                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#66C0F4]' : 'text-zinc-500'}`} />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(conv.id, e as any)}
                            autoFocus
                            className="bg-black border border-white/20 rounded px-1.5 py-0.5 text-xs text-white w-full focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate">{conv.title}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                          <button
                            onClick={(e) => handleSaveEdit(conv.id, e)}
                            className="p-1 text-emerald-400 hover:text-white"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => handleStartEdit(conv.id, conv.title, e)}
                              className="p-1 text-zinc-500 hover:text-zinc-200"
                              title="Rename"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePin(conv.id);
                              }}
                              className="p-1 text-[#E5A866] hover:text-white"
                              title="Unpin"
                            >
                              <Pin className="w-3 h-3 fill-[#E5A866]" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                              }}
                              className="p-1 text-zinc-500 hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recent Conversations */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                Recent Chats
              </div>
              {unpinned.length === 0 && pinned.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500 font-mono">
                  No conversations yet.
                </div>
              ) : (
                unpinned.map((conv) => {
                  const isActive = conv.id === activeId;
                  const isEditing = editingId === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveId(conv.id);
                        navigate('/chat');
                        onCloseMobile?.();
                      }}
                      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-all duration-200 hover:translate-x-0.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#2A475E]/60 via-white/[0.05] to-transparent text-white font-medium border border-[#66C0F4]/40 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#66C0F4] shadow-[0_0_8px_#66C0F4] animate-pulse" />
                      )}

                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#66C0F4]' : 'text-zinc-500'}`} />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(conv.id, e as any)}
                            autoFocus
                            className="bg-black border border-white/20 rounded px-1.5 py-0.5 text-xs text-white w-full focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate">{conv.title}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                          <button
                            onClick={(e) => handleSaveEdit(conv.id, e)}
                            className="p-1 text-emerald-400 hover:text-white"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => handleStartEdit(conv.id, conv.title, e)}
                              className="p-1 text-zinc-500 hover:text-zinc-200"
                              title="Rename"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePin(conv.id);
                              }}
                              className="p-1 text-zinc-500 hover:text-[#E5A866]"
                              title="Pin"
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                              }}
                              className="p-1 text-zinc-500 hover:text-red-400"
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
          </>
        ) : (
          /* Collapsed View: Compact Icons */
          <div className="flex flex-col items-center space-y-2">
            {conversations.slice(0, 8).map((conv) => {
              const isActive = conv.id === activeId;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveId(conv.id);
                    navigate('/chat');
                  }}
                  title={conv.title}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20 shadow-md'
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Dual-Brain Engine Status & Telemetry */}
      <div className="relative z-10 p-3 border-t border-[#2A475E]/70 bg-[#101822]/90 backdrop-blur-md">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* Dual Brain Card */}
            <div className="p-2.5 rounded-2xl bg-[#171D25] border border-[#2A475E]/70 space-y-1.5 font-mono text-[10px]">
              <div className="flex items-center justify-between text-zinc-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                  </span>
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>System 1: Jev</span>
                </span>
                <span className="text-emerald-400 font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">&lt;100ms</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
                  </span>
                  <Brain className="w-3.5 h-3.5 text-[#E5A866]" />
                  <span>System 2: Inkling</span>
                </span>
                <span className="text-[#E5A866] font-mono text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">1M Context</span>
              </div>
            </div>

            {/* Energy Telemetry with Flowing Stream Animation */}
            <div className="p-2.5 rounded-2xl bg-[#171D25] border border-[#2A475E]/70">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400 flex items-center gap-1.5 font-mono text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-[#E5A866] animate-pulse" />
                  <span>Telemetry</span>
                </span>
                <span className="text-[#E5A866] font-mono font-bold text-[11px] flex items-center gap-1">
                  <span>{settings.energyCredits.toLocaleString()}</span>
                  <span className="animate-pulse">⚡</span>
                </span>
              </div>
              <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full animate-energy-stream rounded-full relative"
                  style={{ width: `${Math.min(100, (settings.energyCredits / 5000) * 100)}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_8px_#FFFFFF] rounded-full" />
                </div>
              </div>
            </div>

            {/* Profile Miniature */}
            <NavLink
              to="/settings"
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              <img
                src={settings.avatar}
                alt={settings.name}
                className="w-7 h-7 rounded-full object-cover border border-white/10"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">{settings.name}</span>
                <span className="text-[10px] text-zinc-500 truncate font-mono">{settings.handle}</span>
              </div>
            </NavLink>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <NavLink
              to="/settings"
              title={`${settings.name} (${settings.energyCredits} Energy)`}
              className="relative p-1 rounded-full hover:ring-2 hover:ring-[#A5C4F2] transition-all"
            >
              <img
                src={settings.avatar}
                alt={settings.name}
                className="w-7 h-7 rounded-full object-cover border border-white/10"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-black rounded-full" />
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};
