import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Zap, 
  Menu,
  Volume2,
  VolumeX,
  Radio
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
  const audioMixer = useAppStore((state) => state.audioMixer);
  const toggleAudioSynth = useAppStore((state) => state.toggleAudioSynth);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Derive title from pathname
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'User Dashboard', code: '01' };
    if (path.startsWith('/chat')) return { title: 'Dual-Brain AI Chat', code: '02' };
    if (path.startsWith('/settings')) return { title: 'Workspace Settings', code: '03' };
    return { title: 'User Dashboard', code: '01' };
  };

  const pageInfo = getPageInfo();

  const notifications = [
    {
      id: 1,
      title: 'Dual-Brain Pipeline Active',
      desc: 'TypeSafe Jev System-1 (<100ms) and Thinking Machines Inkling are online.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      title: 'Reasoning Budget Optimized',
      desc: 'Automatic intent routing calibrated for high-precision responses.',
      time: '1h ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Session Restored',
      desc: 'Previous conversations safely loaded from local cache.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-[#171D25]/95 backdrop-blur-xl border-b border-[#2A475E]/70">
      {/* Left: Mobile Toggle & Page Titles */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="text-[#66C0F4] font-semibold">{pageInfo.code}</span>
          <span className="text-zinc-600">/</span>
          <h1 className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white font-mono">
            {pageInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Search, Energy, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1B2838] border border-[#2A475E] hover:border-[#66C0F4]/60 text-xs text-[#C7D5E0] hover:text-white transition-all cursor-pointer font-mono"
        >
          <Search className="w-3.5 h-3.5 text-[#66C0F4]" />
          <span className="hidden sm:inline text-[11px]">SEARCH</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono text-zinc-400 bg-black/30 border border-[#2A475E] rounded-full">
            ⌘K
          </kbd>
        </button>

        {/* AI Orb Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B2838] border border-[#2A475E] text-[11px] font-mono">
          <span 
            className={`w-1.5 h-1.5 rounded-full ${
              orbState === 'generating'
                ? 'bg-[#66C0F4] animate-ping'
                : orbState === 'thinking'
                ? 'bg-[#E5A866] animate-pulse'
                : 'bg-[#5C7E10] shadow-[0_0_8px_#5C7E10]'
            }`}
          />
          <span className="text-[#C7D5E0] capitalize">{orbState}</span>
        </div>

        {/* Ambient Web Audio Synthesizer Quick Toggle */}
        <button
          onClick={toggleAudioSynth}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full capsule-control text-xs font-mono transition-all cursor-pointer ${
            audioMixer.isPlayingSynth
              ? 'border-pink-500/50 bg-pink-500/10 text-pink-300 shadow-sm shadow-pink-500/20'
              : 'text-zinc-400 hover:text-white'
          }`}
          title={audioMixer.isPlayingSynth ? 'Synthesizer Active (Click to Pause)' : 'Start Ambient Synthesizer'}
        >
          {audioMixer.isPlayingSynth ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span className="hidden md:inline text-[10px] text-pink-300">SYNTH LIVE</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[10px]">SYNTH OFF</span>
            </>
          )}
        </button>

        {/* Energy Balance Pill */}
        <div 
          onClick={() => navigate('/settings')}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full capsule-control hover:border-[#E5A866]/40 text-xs font-mono transition-all"
          title="Your available ONᵉ Energy credits"
        >
          <Zap className="w-3.5 h-3.5 text-[#E5A866]" />
          <span className="text-white font-medium">{settings.energyCredits.toLocaleString()}</span>
          <span className="text-zinc-500 text-[10px]">⚡</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-zinc-400 hover:text-white rounded-full capsule-control transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E5A866] animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#090C12] border border-[#1A1F2C] shadow-2xl p-3.5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#181C26] mb-2 font-mono text-xs">
                <span className="font-semibold text-white tracking-widest uppercase">Telemetry</span>
                <span className="text-[10px] text-[#A5C4F2]">1 Unread</span>
              </div>
              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      n.unread ? 'bg-[#A5C4F2]/10 border border-[#A5C4F2]/20' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium text-white mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <button
          onClick={() => navigate('/settings')}
          className="relative rounded-full ring-1 ring-white/10 hover:ring-[#A5C4F2] transition-all overflow-hidden cursor-pointer"
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
