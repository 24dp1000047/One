import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Video, 
  Sparkles, 
  Compass, 
  FolderKanban, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Plus
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Sidebar: React.FC = () => {
  const isCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const settings = useAppStore((state) => state.settings);
  const projects = useAppStore((state) => state.projects);
  const createConversation = useAppStore((state) => state.createConversation);
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
    },
    {
      to: '/chat',
      label: 'AI Chat',
      icon: MessageSquare,
      badge: 'v4',
    },
    {
      to: '/studio',
      label: 'Video Studio',
      icon: Video,
      highlight: true,
      badge: 'Cinema',
    },
    {
      to: '/playground',
      label: 'Playground',
      icon: Sparkles,
    },
    {
      to: '/explore',
      label: 'Explore',
      icon: Compass,
    },
    {
      to: '/creations',
      label: 'My Creations',
      icon: FolderKanban,
      count: projects.length,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col h-screen border-r border-[#222222] bg-[#0c0c0c] transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#1f1f1f]">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#333333] group-hover:border-brand-yellow/50 transition-all duration-300 shrink-0 shadow-inner">
            <div className="absolute inset-0 rounded-xl bg-brand-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            <div className="w-5 h-5 rounded-full border-2 border-brand-yellow flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-wider text-white">ONe</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-yellow/15 text-brand-yellow font-bold uppercase tracking-widest border border-brand-yellow/30">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-muted truncate font-light tracking-tight">One space. Infinite possibilities.</span>
            </div>
          )}
        </NavLink>

        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Action: New Studio Video / Chat */}
      <div className="p-3">
        {!isCollapsed ? (
          <NavLink
            to="/studio"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-yellow via-[#FFE24D] to-brand-orange text-black font-semibold text-xs tracking-wide shadow-glow-yellow-sm hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Video</span>
          </NavLink>
        ) : (
          <NavLink
            to="/studio"
            title="Create Video"
            className="flex items-center justify-center w-12 h-10 mx-auto rounded-xl bg-brand-yellow text-black font-semibold hover:brightness-110 active:scale-95 transition-all shadow-glow-yellow-sm"
          >
            <Plus className="w-5 h-5" />
          </NavLink>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={isCollapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#181818] text-white font-semibold border border-brand-yellow/30 shadow-inner'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {/* Left active yellow pip */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-brand-yellow shadow-glow-yellow-sm" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-brand-yellow' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              />

              {!isCollapsed && (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="truncate tracking-wide">{item.label}</span>
                  <div className="flex items-center gap-1.5 ml-2">
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange font-semibold border border-brand-orange/30">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#202020] text-zinc-400 border border-[#2b2b2b]">
                        {item.count}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Energy Telemetry & User Card */}
      <div className="p-3 border-t border-[#1f1f1f] bg-[#090909]/60">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* ONe Energy Card */}
            <div className="p-2.5 rounded-xl bg-[#141414] border border-[#242424]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400 flex items-center gap-1 font-mono text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-brand-yellow" />
                  ONe Energy
                </span>
                <span className="text-brand-yellow font-mono font-bold text-[11px]">
                  {settings.energyCredits.toLocaleString()} ⚡
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-yellow to-brand-orange rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (settings.energyCredits / 5000) * 100)}%` }}
                />
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
                className="w-8 h-8 rounded-full object-cover border border-[#333333]"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">{settings.name}</span>
                <span className="text-[10px] text-muted truncate font-mono">{settings.handle}</span>
              </div>
            </NavLink>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <NavLink
              to="/settings"
              title={`${settings.name} (${settings.energyCredits} Energy)`}
              className="relative p-1 rounded-full hover:ring-2 hover:ring-brand-yellow transition-all"
            >
              <img
                src={settings.avatar}
                alt={settings.name}
                className="w-8 h-8 rounded-full object-cover border border-[#333333]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-black rounded-full" />
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};
