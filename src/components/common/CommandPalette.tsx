import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Home, 
  MessageSquare, 
  Video, 
  Sparkles, 
  Compass, 
  FolderKanban, 
  Settings, 
  Wand2, 
  PlusCircle, 
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Actions';
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC = () => {
  const isOpen = useAppStore((state) => state.isCommandPaletteOpen);
  const setIsOpen = useAppStore((state) => state.setCommandPaletteOpen);
  const createConversation = useAppStore((state) => state.createConversation);
  const enhanceStudioPrompt = useAppStore((state) => state.enhanceStudioPrompt);
  const startVideoGeneration = useAppStore((state) => state.startVideoGeneration);
  const resetAllToFactoryDefaults = useAppStore((state) => state.resetAllToFactoryDefaults);
  const addToast = useAppStore((state) => state.addToast);

  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'nav-home',
      title: 'Home Dashboard',
      subtitle: 'Overview, AI Orb, universal prompt, quick stats',
      category: 'Navigation',
      icon: <Home className="w-4 h-4 text-brand-yellow" />,
      action: () => navigate('/'),
    },
    {
      id: 'nav-chat',
      title: 'AI Chat Studio',
      subtitle: 'Conversational assistant with script & prompt ideation',
      category: 'Navigation',
      icon: <MessageSquare className="w-4 h-4 text-sky-400" />,
      action: () => navigate('/chat'),
    },
    {
      id: 'nav-video',
      title: 'Text-to-Video Studio',
      subtitle: 'Split-screen director mode, storyboard & timeline',
      category: 'Navigation',
      icon: <Video className="w-4 h-4 text-brand-orange" />,
      action: () => navigate('/studio'),
      badge: 'Hot',
    },
    {
      id: 'nav-playground',
      title: 'Creative Playground',
      subtitle: 'A/B prompt experimentation and parameter testing',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: () => navigate('/playground'),
    },
    {
      id: 'nav-explore',
      title: 'Explore Community Showcase',
      subtitle: 'Trending AI videos, animations and reusable prompts',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      action: () => navigate('/explore'),
    },
    {
      id: 'nav-creations',
      title: 'My Creations',
      subtitle: 'Saved video projects, favorites and render history',
      category: 'Navigation',
      icon: <FolderKanban className="w-4 h-4 text-purple-400" />,
      action: () => navigate('/creations'),
    },
    {
      id: 'nav-settings',
      title: 'Settings & Workspace',
      subtitle: 'Appearance, default render settings, profile',
      category: 'Navigation',
      icon: <Settings className="w-4 h-4 text-zinc-400" />,
      action: () => navigate('/settings'),
    },
    {
      id: 'action-new-chat',
      title: 'New AI Chat Session',
      subtitle: 'Initialize a fresh conversation thread',
      category: 'Actions',
      icon: <PlusCircle className="w-4 h-4 text-brand-yellow" />,
      action: () => {
        createConversation();
        navigate('/chat');
      },
    },
    {
      id: 'action-enhance',
      title: 'Magic Prompt Enhancer',
      subtitle: 'Enhance studio prompt with cinematic lighting descriptors',
      category: 'Actions',
      icon: <Wand2 className="w-4 h-4 text-brand-orange" />,
      action: () => {
        navigate('/studio');
        enhanceStudioPrompt();
      },
    },
    {
      id: 'action-generate',
      title: 'Quick Video Render',
      subtitle: 'Launch multi-stage simulation with active settings',
      category: 'Actions',
      icon: <Zap className="w-4 h-4 text-brand-yellow" />,
      action: () => {
        navigate('/studio');
        startVideoGeneration();
      },
      badge: 'Fast',
    },
    {
      id: 'action-reset',
      title: 'Reset Demo Data',
      subtitle: 'Restore initial demo projects and conversations',
      category: 'Actions',
      icon: <RotateCcw className="w-4 h-4 text-rose-400" />,
      action: () => {
        resetAllToFactoryDefaults();
      },
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-full max-w-xl rounded-2xl bg-[#121212] border border-[#2b2b2b] shadow-2xl overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#242424] bg-[#161616]">
              <Search className="w-5 h-5 text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownList}
                placeholder="Type a command or search pages..."
                className="w-full bg-transparent text-white placeholder-muted focus:outline-none text-sm tracking-wide"
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-muted bg-[#202020] border border-[#303030] rounded">
                ESC
              </kbd>
            </div>

            {/* Command List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-muted text-sm">
                  No matching commands found.
                </div>
              ) : (
                filtered.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-brand-yellow/15 text-white border border-brand-yellow/30'
                          : 'text-zinc-300 hover:bg-[#1a1a1a] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-black/40 text-brand-yellow' : 'bg-[#1b1b1b]'}`}>
                          {cmd.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium tracking-wide truncate">{cmd.title}</span>
                            {cmd.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-yellow/20 text-brand-yellow font-semibold">
                                {cmd.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted truncate">{cmd.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-brand-yellow translate-x-1' : 'text-transparent'}`} />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-[#202020] bg-[#0d0d0d] text-[11px] text-muted font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-yellow">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                <span>ONe Omni-4</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
