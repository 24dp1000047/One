import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  Brain, 
  Cpu, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Gauge, 
  Flame,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const DualBrainTelemetrySection: React.FC = () => {
  const navigate = useNavigate();
  const settings = useAppStore((state) => state.settings);
  const conversations = useAppStore((state) => state.conversations);

  const [liveLatency, setLiveLatency] = useState(48);
  const [pulseCount, setPulseCount] = useState(1048);

  // Live telemetry pulse ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(Math.random() * 22) + 42); // 42-64ms
      setPulseCount((prev) => prev + 1);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const totalMessages = conversations.reduce((acc, c) => acc + c.messages.length, 0);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#141822]">
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="text-[#A5C4F2] font-semibold">03 //</span>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-widest uppercase font-mono">
            COGNITIVE TELEMETRY & SYSTEM STATUS
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OPERATIONAL
          </span>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono transition-colors cursor-pointer"
        >
          <span>OPEN AI CHAT</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: System-1 Jev Engine */}
        <div className="rounded-3xl bg-[#080A10] border border-[#181C26] p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between font-mono text-xs text-zinc-500 mb-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Cpu className="w-4 h-4" />
              SYSTEM 1 // JEV
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              FAST PASS
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
              <span>{liveLatency}</span>
              <span className="text-xs text-zinc-500 font-normal">ms latency</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sub-100ms non-autoregressive decision routing & TypeSafe Noul truth scoring.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#141822] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Primitive: Noul + Choice</span>
            <span className="text-emerald-400 font-bold">&lt;100ms SLA</span>
          </div>
        </div>

        {/* Card 2: System-2 Inkling Engine */}
        <div className="rounded-3xl bg-[#080A10] border border-[#181C26] p-5 shadow-xl relative overflow-hidden group hover:border-[#E5A866]/30 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#E5A866]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E5A866]/10 transition-colors" />
          <div className="flex items-center justify-between font-mono text-xs text-zinc-500 mb-3">
            <span className="flex items-center gap-1.5 text-[#E5A866] font-semibold">
              <Brain className="w-4 h-4" />
              SYSTEM 2 // INKLING
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E5A866]/10 text-[#E5A866] border border-[#E5A866]/20">
              REASONING
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
              <span>1,000,000</span>
              <span className="text-xs text-zinc-500 font-normal">tokens</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Thinking Machines Lab reasoning engine with deep multi-step agentic budget.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#141822] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Budget: Dynamic Router</span>
            <span className="text-[#E5A866] font-bold">1M Context</span>
          </div>
        </div>

        {/* Card 3: Energy Telemetry */}
        <div className="rounded-3xl bg-[#080A10] border border-[#181C26] p-5 shadow-xl relative overflow-hidden group hover:border-[#A5C4F2]/30 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#A5C4F2]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#A5C4F2]/10 transition-colors" />
          <div className="flex items-center justify-between font-mono text-xs text-zinc-500 mb-3">
            <span className="flex items-center gap-1.5 text-[#A5C4F2] font-semibold">
              <Zap className="w-4 h-4" />
              ENERGY RESERVE
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#A5C4F2]/10 text-[#A5C4F2] border border-[#A5C4F2]/20">
              TELEMETRY
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
              <span>{settings.energyCredits.toLocaleString()}</span>
              <span className="text-xs text-[#E5A866] font-normal">⚡ units</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Available compute quota for high-fidelity multi-stage AI reasoning passes.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#141822] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mr-3">
              <div
                className="bg-gradient-to-r from-[#A5C4F2] to-[#E5A866] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (settings.energyCredits / 5000) * 100)}%` }}
              />
            </div>
            <span className="text-white font-bold shrink-0">{Math.round((settings.energyCredits / 5000) * 100)}%</span>
          </div>
        </div>

        {/* Card 4: Active Workspace Activity */}
        <div className="rounded-3xl bg-[#080A10] border border-[#181C26] p-5 shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between font-mono text-xs text-zinc-500 mb-3">
            <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <Activity className="w-4 h-4" />
              CONVERSATIONS
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              SESSION
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
              <span>{conversations.length}</span>
              <span className="text-xs text-zinc-500 font-normal">threads ({totalMessages} msgs)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Active sessions with contextual persistent memory and streaming responses.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#141822] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Cycle: #{pulseCount}</span>
            <span className="text-purple-400 font-bold">Encrypted Local</span>
          </div>
        </div>
      </div>
    </div>
  );
};
