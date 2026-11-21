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
import { BrandName } from './BrandName';

export const Sidebar: React.FC = () => {
  const isCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const settings = useAppStore((state) => state.settings);
  const projects = useAppStore((state) => state.projects);
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Potential',
      code: '01',
      icon: Home,
    },
    {
      to: '/studio',
      label: 'Studio Engine',
      code: '02',
      icon: Video,
      badge: 'Cinema',
    },
    {
      to: '/chat',
      label: 'AI Director',
      code: '03',
      icon: MessageSquare,
    },
    {
      to: '/playground',
      label: 'Playground',
      code: '04',
      icon: Sparkles,
    },
    {
      to: '/explore',
      label: 'Showcase',
      code: '05',
      icon: Compass,
    },
    {
      to: '/creations',
      label: 'Archive',
      code: '06',
      icon: FolderKanban,
      count: projects.length,
    },
    {
      to: '/settings',
      label: 'Settings',
      code: '07',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col h-screen border-r border-[#141822] bg-[#05070C] transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#141822]">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#090C12] border border-[#222836] group-hover:border-[#A5C4F2]/50 transition-all duration-300 shrink-0 shadow-inner">
            <div className="w-4 h-4 rounded-full border border-[#A5C4F2] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E5A866] animate-pulse" />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <BrandName className="font-bold text-xl tracking-wider text-white" />
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 border border-white/10 uppercase tracking-widest">
                  v4.0
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 truncate font-mono tracking-tight">One space. Infinite possibilities.</span>
            </div>
          )}
        </NavLink>

        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors hidden md:block cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Action: Create Video Pill */}
      <div className="p-3">
        {!isCollapsed ? (
          <NavLink
            to="/studio"
            className="pill-action flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Video</span>
          </NavLink>
        ) : (
          <NavLink
            to="/studio"
            title="Create Video"
            className="pill-action flex items-center justify-center w-11 h-10 mx-auto rounded-full font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
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
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                isActive
                  ? 'bg-white/10 text-white font-medium border border-white/15 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {/* Active pip */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[#A5C4F2] shadow-[0_0_8px_#A5C4F2]" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-[#A5C4F2]' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              />

              {!isCollapsed && (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="truncate tracking-wider">{item.label}</span>
                  <div className="flex items-center gap-1.5 ml-2 font-mono">
                    <span className="text-[10px] text-zinc-600">{item.code}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#E5A866]/15 text-[#E5A866] border border-[#E5A866]/30">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 border border-white/10">
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
      <div className="p-3 border-t border-[#141822] bg-[#05070C]">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* ONe Energy Card */}
            <div className="p-2.5 rounded-2xl bg-[#090C12] border border-[#181C26]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400 flex items-center gap-1 font-mono text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-[#E5A866]" />
                  Telemetry
                </span>
                <span className="text-[#E5A866] font-mono font-bold text-[11px]">
                  {settings.energyCredits.toLocaleString()} ⚡
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E5A866] to-[#A5C4F2] rounded-full"
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
