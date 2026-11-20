import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Sliders, 
  Bell, 
  Zap, 
  Database, 
  RotateCcw, 
  Check, 
  Copy, 
  Eye, 
  EyeOff, 
  Save 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AspectRatio, Resolution } from '../types';

export const Settings: React.FC = () => {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const resetAll = useAppStore((state) => state.resetAllToFactoryDefaults);
  const projects = useAppStore((state) => state.projects);
  const conversations = useAppStore((state) => state.conversations);
  const addToast = useAppStore((state) => state.addToast);

  const [name, setName] = useState(settings.name);
  const [handle, setHandle] = useState(settings.handle);
  const [bio, setBio] = useState(settings.bio);
  const [accentColor, setAccentColor] = useState<'yellow' | 'orange'>(settings.accentColor);
  const [themeMode, setThemeMode] = useState<'dark' | 'oled'>(settings.themeMode);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [defaultResolution, setDefaultResolution] = useState<Resolution>(settings.defaultResolution);
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<AspectRatio>(settings.defaultAspectRatio);
  const [showApiToken, setShowApiToken] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      handle,
      bio,
      accentColor,
      themeMode,
      soundEnabled,
      defaultResolution,
      defaultAspectRatio,
    });
  };

  const handleRefillEnergy = () => {
    updateSettings({
      energyCredits: settings.energyCredits + 1000,
    });
    addToast({
      type: 'success',
      title: 'Energy Refilled!',
      message: 'Added +1,000 ONe Energy credits to your creative balance.',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#141822]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#A5C4F2] font-semibold">07 //</span>
            <span className="text-zinc-500 uppercase tracking-widest">PREFERENCES</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
              V4.0.9 LIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight mt-1">
            Workspace & Preferences
          </h1>
          <p className="text-xs text-[#8A94A6] mt-1 font-light">
            Manage your director profile, interface accents, rendering engine defaults and system telemetry.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="pill-action flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-xs tracking-wide cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Forms */}
        <div className="md:col-span-8 space-y-6">
          {/* 1. Profile Settings */}
          <div className="rounded-2xl bg-[#121212] border border-[#242424] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1f1f1f] text-sm font-semibold text-white">
              <User className="w-4 h-4 text-brand-yellow" />
              <span>Director Profile</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={settings.avatar}
                alt={settings.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-yellow/40 shadow-glow-yellow-sm"
              />
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-300">Creator Avatar</span>
                <p className="text-[11px] text-muted">
                  Synchronized with your ONe community showcase profile.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2b2b2b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">Handle</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2b2b2b] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-yellow"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Bio & Director Statement</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#181818] border border-[#2b2b2b] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-yellow resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* 2. Theme & Visual Preferences */}
          <div className="rounded-2xl bg-[#121212] border border-[#242424] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1f1f1f] text-sm font-semibold text-white">
              <Palette className="w-4 h-4 text-brand-orange" />
              <span>Theme & Interface Accent</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Accent Color */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-medium">Signature Accent Color</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccentColor('yellow')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      accentColor === 'yellow'
                        ? 'bg-brand-yellow/15 border-brand-yellow text-brand-yellow shadow-glow-yellow-sm'
                        : 'bg-[#181818] border-[#292929] text-zinc-400'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-brand-yellow" />
                    <span>ONe Yellow</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccentColor('orange')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      accentColor === 'orange'
                        ? 'bg-brand-orange/15 border-brand-orange text-brand-orange shadow-glow-orange-sm'
                        : 'bg-[#181818] border-[#292929] text-zinc-400'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-brand-orange" />
                    <span>Special Orange</span>
                  </button>
                </div>
              </div>

              {/* Theme Darkness */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-medium">Dark Mode Intensity</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      themeMode === 'dark'
                        ? 'bg-[#1f1f1f] border-brand-yellow text-white shadow-sm'
                        : 'bg-[#181818] border-[#292929] text-zinc-400'
                    }`}
                  >
                    Futuristic Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('oled')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      themeMode === 'oled'
                        ? 'bg-[#1f1f1f] border-brand-yellow text-white shadow-sm'
                        : 'bg-[#181818] border-[#292929] text-zinc-400'
                    }`}
                  >
                    OLED Pure Black
                  </button>
                </div>
              </div>
            </div>

            {/* Sound toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1f1f1f]">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-white">Audio & Interface Chimes</span>
                <p className="text-[11px] text-muted">Play simulated futuristic audio cues on generation events</p>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-brand-yellow cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Engine Defaults */}
          <div className="rounded-2xl bg-[#121212] border border-[#242424] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1f1f1f] text-sm font-semibold text-white">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Studio Engine Defaults</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Default Aspect Ratio</label>
                <select
                  value={defaultAspectRatio}
                  onChange={(e) => setDefaultAspectRatio(e.target.value as AspectRatio)}
                  className="w-full bg-[#181818] border border-[#2b2b2b] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-yellow"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Vertical (Stories)</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="21:9">21:9 Cinema Ultra-Wide</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Default Render Resolution</label>
                <select
                  value={defaultResolution}
                  onChange={(e) => setDefaultResolution(e.target.value as Resolution)}
                  className="w-full bg-[#181818] border border-[#2b2b2b] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-yellow"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="4K">4K Cinema Master (Recommended)</option>
                </select>
              </div>
            </div>

            {/* API Token display */}
            <div className="pt-2 border-t border-[#1f1f1f] space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium flex items-center justify-between">
                <span>ONe API Token (Client Prototype)</span>
                <button
                  type="button"
                  onClick={() => setShowApiToken(!showApiToken)}
                  className="text-[11px] text-brand-yellow hover:underline flex items-center gap-1"
                >
                  {showApiToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showApiToken ? 'Hide' : 'Reveal'}
                </button>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type={showApiToken ? 'text' : 'password'}
                  value={settings.apiTokens}
                  readOnly
                  className="flex-1 bg-[#181818] border border-[#2b2b2b] rounded-xl px-3 py-2 text-xs font-mono text-zinc-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(settings.apiTokens);
                    addToast({ type: 'success', title: 'API Key Copied' });
                  }}
                  className="p-2 rounded-xl bg-[#202020] hover:bg-[#282828] text-white border border-[#303030]"
                  title="Copy Token"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Workspace telemetry & Danger Zone */}
        <div className="md:col-span-4 space-y-6">
          {/* Energy Card */}
          <div className="rounded-2xl bg-gradient-to-b from-[#181818] to-[#121212] border border-[#2b2b2b] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-yellow" />
                ONe Energy Balance
              </span>
              <span className="text-sm font-bold text-brand-yellow font-mono">
                {settings.energyCredits.toLocaleString()} ⚡
              </span>
            </div>

            <div className="space-y-1">
              <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-yellow to-brand-orange rounded-full"
                  style={{ width: `${Math.min(100, (settings.energyCredits / 5000) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-muted">
                <span>0</span>
                <span>Max 5,000 ⚡</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefillEnergy}
              className="w-full py-2 px-3 rounded-xl bg-[#202020] hover:bg-brand-yellow hover:text-black border border-[#303030] hover:border-transparent text-xs font-semibold text-zinc-200 transition-all shadow-sm"
            >
              Refill Energy (+1,000 ⚡)
            </button>
          </div>

          {/* Storage Telemetry */}
          <div className="rounded-2xl bg-[#121212] border border-[#242424] p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Database className="w-4 h-4 text-sky-400" />
              <span>Workspace Quota</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between text-muted">
                <span>Cloud Scratch Storage</span>
                <span className="text-white">14.2 GB / 50 GB</span>
              </div>
              <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: '28.4%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-[#1f1f1f] grid grid-cols-2 gap-2 text-[11px] font-mono text-muted">
              <div>
                <span>Creations:</span>
                <span className="text-white block font-bold mt-0.5">{projects.length} videos</span>
              </div>
              <div>
                <span>Chat Threads:</span>
                <span className="text-white block font-bold mt-0.5">{conversations.length} active</span>
              </div>
            </div>
          </div>

          {/* Danger Zone: Factory Reset */}
          <div className="rounded-2xl bg-[#150f0f] border border-rose-500/20 p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              <span>Factory Reset</span>
            </h4>
            <p className="text-[11px] text-muted leading-relaxed">
              Reset all local storage, restore initial showcase demo projects, and reload factory presets.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
            >
              Restore Default State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
