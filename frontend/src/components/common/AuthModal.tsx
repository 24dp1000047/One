import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  AtSign, 
  Eye, 
  EyeOff, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const AVATAR_PRESETS = [
  {
    id: 'av-1',
    label: 'Cyber Artist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'av-2',
    label: 'Visionary',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'av-3',
    label: 'Prompt Architect',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
  },
  {
    id: 'av-4',
    label: 'Neural Creator',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
  },
];

export const AuthModal: React.FC = () => {
  const isOpen = useAppStore((state) => state.authModalOpen);
  const mode = useAppStore((state) => state.authModalMode);
  const setAuthModalOpen = useAppStore((state) => state.setAuthModalOpen);
  const login = useAppStore((state) => state.login);
  const demoLogin = useAppStore((state) => state.demoLogin);
  const addToast = useAppStore((state) => state.addToast);

  const [currentMode, setCurrentMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);

  useEffect(() => {
    setCurrentMode(mode);
    setErrorMessage(null);
  }, [mode, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setAuthModalOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (currentMode === 'register' && !name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    if (currentMode === 'register' && password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        currentMode === 'login'
          ? 'http://localhost:5000/api/auth/login'
          : 'http://localhost:5000/api/auth/register';

      const payload =
        currentMode === 'login'
          ? { email: email.trim().toLowerCase(), password }
          : {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password,
              handle: handle.trim()
                ? handle.startsWith('@')
                  ? handle
                  : `@${handle}`
                : undefined,
              avatar: selectedAvatar,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication request failed.');
      }

      // Success
      login(data.user, data.token);
    } catch (err: any) {
      console.warn('Auth submission error:', err);
      // Fallback if backend server is unreachable
      if (err.message && err.message.includes('Failed to fetch')) {
        setErrorMessage('Backend server offline. Try Demo Login or start backend on :5000.');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => setAuthModalOpen(false)}
      />

      {/* Modal Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-[#171D25] border border-[#2A475E] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-[#C7D5E0]"
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#66C0F4] via-[#E5A866] to-[#5C7E10]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2A475E]/60 bg-[#1B2838]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#66C0F4]/10 border border-[#66C0F4]/40 flex items-center justify-center text-[#66C0F4]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-sm font-semibold tracking-wider uppercase text-white font-mono">
                {currentMode === 'login' ? 'Sign In to ONᵉ' : 'Create ONᵉ Account'}
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                {currentMode === 'login'
                  ? 'Access your dual-brain models & workspace'
                  : 'Join the next-generation AI creative studio'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 mx-5 mt-4 bg-[#12171F] border border-[#2A475E]/50 rounded-xl font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setCurrentMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              currentMode === 'login'
                ? 'bg-[#1B2838] text-white border border-[#66C0F4]/50 shadow-sm shadow-[#66C0F4]/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              currentMode === 'register'
                ? 'bg-[#1B2838] text-white border border-[#E5A866]/50 shadow-sm shadow-[#E5A866]/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div className="flex-1">
              <span className="font-semibold">Authentication Error:</span> {errorMessage}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {/* Registration Extra Fields: Name & Handle */}
          {currentMode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full pl-9 pr-3 py-2 bg-[#1B2838] border border-[#2A475E] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#66C0F4] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Creator Handle <span className="text-zinc-500">(Optional)</span>
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@alex_creator"
                    className="w-full pl-9 pr-3 py-2 bg-[#1B2838] border border-[#2A475E] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#66C0F4] transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Choose Avatar Persona
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_PRESETS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`relative rounded-xl p-1 border transition-all cursor-pointer ${
                        selectedAvatar === av.url
                          ? 'border-[#66C0F4] ring-2 ring-[#66C0F4]/40 bg-[#66C0F4]/10'
                          : 'border-[#2A475E] hover:border-zinc-500 bg-[#1B2838]'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="w-full h-11 object-cover rounded-lg"
                      />
                      {selectedAvatar === av.url && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#66C0F4] flex items-center justify-center text-[#171D25]">
                          <CheckCircle2 className="w-3 h-3 text-[#171D25]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@onestudio.ai"
                className="w-full pl-9 pr-3 py-2 bg-[#1B2838] border border-[#2A475E] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#66C0F4] transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Password
              </label>
              {currentMode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alex@onestudio.ai');
                    setPassword('password123');
                    addToast({
                      type: 'info',
                      title: 'Credentials Autofilled',
                      message: 'alex@onestudio.ai / password123',
                    });
                  }}
                  className="text-[10px] text-[#66C0F4] hover:underline cursor-pointer font-mono"
                >
                  Autofill Demo?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={currentMode === 'login' ? '••••••••' : 'Min 6 characters'}
                className="w-full pl-9 pr-10 py-2 bg-[#1B2838] border border-[#2A475E] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#66C0F4] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#66C0F4] to-[#4B9CD3] hover:from-[#7ad0ff] hover:to-[#57a9e3] text-[#171D25] font-semibold text-xs font-mono tracking-wider uppercase transition-all shadow-lg shadow-[#66C0F4]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#171D25] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{currentMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A475E]/60" />
            </div>
            <span className="relative px-3 bg-[#171D25] text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Or Instant Access
            </span>
          </div>

          {/* 1-Click Quick Demo Login */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1B2838] border border-[#E5A866]/50 hover:border-[#E5A866] text-[#E5A866] hover:bg-[#E5A866]/10 font-mono text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-[#E5A866]/10"
          >
            <Zap className="w-3.5 h-3.5 fill-[#E5A866]" />
            <span>⚡ Quick Demo Login (Alex Vance)</span>
          </button>
        </form>

        {/* Modal Footer Security Note */}
        <div className="p-3 bg-[#12171F]/80 border-t border-[#2A475E]/50 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5C7E10]" />
          <span>Local Sha-256 Auth &bull; Session cached securely in browser</span>
        </div>
      </div>
    </div>
  );
};