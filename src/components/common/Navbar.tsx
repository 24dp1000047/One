import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Zap, 
  Menu, 
  Sparkles, 
  Check, 
  ExternalLink,
  SlidersHorizontal 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const setCommandPaletteOpen = useAppStore((state) => state.setCommandPaletteOpen);
  const settings = useAppStore((state) => state.settings);
  const orbState = useAppStore((state) => state.orbState);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Derive title from pathname
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Dashboard', subtitle: 'Workspace Overview' };
    if (path.startsWith('/chat')) return { title: 'AI Chat Studio', subtitle: 'Director Conversation' };
    if (path.startsWith('/studio')) return { title: 'Text-to-Video Studio', subtitle: 'Generative Engine' };
    if (path.startsWith('/playground')) return { title: 'Creative Playground', subtitle: 'A/B Experimentation' };
    if (path.startsWith('/explore')) return { title: 'Explore', subtitle: 'Community Gallery' };
    if (path.startsWith('/creations')) return { title: 'My Creations', subtitle: 'Rendered Archive' };
    if (path.startsWith('/settings')) return { title: 'Settings', subtitle: 'Preferences & System' };
    return { title: 'ONe Studio', subtitle: 'Creative Workspace' };
  };

  const pageInfo = getPageInfo();

  const notifications = [
    {
      id: 1,
      title: 'Render Completed',
      desc: 'Neon Odyssey: Shinjuku 2099 is ready in 4K 60fps.',
      time: '12m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Prompt Optimization',
      desc: 'Magic Enhancer upgraded your prompt with 35mm anamorphic tags.',
      time: '1h ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Weekly Allowance',
      desc: 'Added +1,000 ONe Energy to your creative account.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-6 bg-[#090909]/80 backdrop-blur-xl border-b border-[#1f1f1f]">
      {/* Left: Mobile Toggle & Page Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 text-muted hover:text-white rounded-lg hover:bg-white/5 md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-semibold tracking-wide text-white">
              {pageInfo.title}
            </h1>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-zinc-600" />
            <span className="hidden sm:inline-block text-xs text-muted font-light">
              {pageInfo.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Search, Orb State, Energy, Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] text-xs text-muted hover:text-zinc-200 transition-all shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-muted" />
          <span className="hidden sm:inline text-xs">Search actions...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-[#222222] border border-[#303030] rounded">
            ⌘K
          </kbd>
        </button>

        {/* AI Orb Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141414] border border-[#242424] text-[11px] font-mono">
          <span 
            className={`w-2 h-2 rounded-full ${
              orbState === 'generating'
                ? 'bg-brand-orange animate-ping'
                : orbState === 'thinking'
                ? 'bg-brand-yellow animate-pulse'
                : 'bg-emerald-400'
            }`}
          />
          <span className="text-zinc-300 capitalize">{orbState}</span>
        </div>

        {/* Energy Balance Pill */}
        <div 
          onClick={() => navigate('/settings')}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#181818] to-[#121212] border border-[#292929] hover:border-brand-yellow/40 text-xs font-mono transition-all"
          title="Your available ONe Energy credits for rendering"
        >
          <Zap className="w-3.5 h-3.5 text-brand-yellow" />
          <span className="text-white font-medium">{settings.energyCredits.toLocaleString()}</span>
          <span className="text-muted text-[10px] hidden sm:inline">⚡</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-muted hover:text-white rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-[#2b2b2b]"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#141414] border border-[#2b2b2b] shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#242424] mb-2 px-1">
                <span className="text-xs font-semibold text-white tracking-wide">Notifications</span>
                <span className="text-[10px] font-mono text-brand-yellow">1 Unread</span>
              </div>
              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      n.unread ? 'bg-brand-yellow/10 border border-brand-yellow/20' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium text-white mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[10px] font-mono text-muted">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-muted line-clamp-2">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <button
          onClick={() => navigate('/settings')}
          className="relative rounded-full ring-1 ring-border hover:ring-brand-yellow transition-all overflow-hidden"
        >
          <img
            src={settings.avatar}
            alt={settings.name}
            className="w-8 h-8 object-cover rounded-full"
          />
        </button>
      </div>
    </header>
  );
};
