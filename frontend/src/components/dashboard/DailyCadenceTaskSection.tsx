import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  Trash2, 
  Share2, 
  Calendar, 
  Zap, 
  Brain, 
  Flame, 
  RotateCcw, 
  ShieldAlert, 
  ChevronRight, 
  Check, 
  TrendingUp, 
  Layers, 
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

export interface DailyTaskItem {
  id: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  category: 'Engineering' | 'Research' | 'Creative' | 'Deep Work' | 'Operations';
  estimatedMinutes: number;
  status: 'pending' | 'completed' | 'carried_over' | 'blocked';
  anchoredToWeb?: boolean;
  createdAt: string;
}

export interface DayCadenceRecord {
  date: string;
  morningBriefing?: string;
  eveningRetrospective?: string;
  tasks: DailyTaskItem[];
  velocity: number;
  energyEarned: number;
  reflectionNotes?: string;
  sealedAt?: string;
}

export const DailyCadenceTaskSection: React.FC = () => {
  const addToast = useAppStore((state) => state.addToast);

  // Cadence Phase: 'morning' (AM) | 'evening' (PM) | 'history'
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'history'>(() => {
    const hour = new Date().getHours();
    return hour >= 17 || hour < 4 ? 'evening' : 'morning';
  });

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Current Day's Tasks
  const [tasks, setTasks] = useState<DailyTaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('one_daily_tasks_current');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'task-1',
        title: 'Architect 3D Spider Web vector clustering and gravitational physics',
        priority: 'P0',
        category: 'Engineering',
        estimatedMinutes: 90,
        status: 'completed',
        anchoredToWeb: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-2',
        title: 'Fine-tune Jev System-1 typed confidence interval boundaries',
        priority: 'P1',
        category: 'Research',
        estimatedMinutes: 45,
        status: 'pending',
        anchoredToWeb: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-3',
        title: 'Calibrate Steami atmospheric steam auroras and telemetry bar',
        priority: 'P2',
        category: 'Creative',
        estimatedMinutes: 30,
        status: 'pending',
        anchoredToWeb: false,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'P0' | 'P1' | 'P2'>('P1');
  const [newCategory, setNewCategory] = useState<'Engineering' | 'Research' | 'Creative' | 'Deep Work' | 'Operations'>('Engineering');
  const [newDuration, setNewDuration] = useState<number>(45);

  // Morning briefing state
  const [morningBriefing, setMorningBriefing] = useState<string>(() => {
    return localStorage.getItem('one_daily_morning_briefing') || '';
  });
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);

  // Evening debrief state
  const [reflectionNotes, setReflectionNotes] = useState<string>(() => {
    return localStorage.getItem('one_daily_evening_reflections') || '';
  });
  const [eveningRetro, setEveningRetro] = useState<string>(() => {
    return localStorage.getItem('one_daily_evening_retro') || '';
  });
  const [isGeneratingRetro, setIsGeneratingRetro] = useState(false);

  // History & Streaks
  const [history, setHistory] = useState<DayCadenceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('one_daily_cadence_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        date: 'Yesterday',
        velocity: 100,
        energyEarned: 240,
        tasks: [
          { id: 'h1', title: 'Deploy Steami UI theme and site-wide background', priority: 'P0', category: 'Engineering', estimatedMinutes: 60, status: 'completed', createdAt: '' },
          { id: 'h2', title: 'Verify OpenRouter Decisions API with Jev model', priority: 'P1', category: 'Research', estimatedMinutes: 45, status: 'completed', createdAt: '' },
        ],
        morningBriefing: 'Focus on production UI stability and high-impact shader pipeline.',
        eveningRetrospective: 'All milestones completed with 100% velocity. System-1 responsiveness validated.',
        sealedAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
  });

  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('one_daily_cadence_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Save tasks on change
  useEffect(() => {
    localStorage.setItem('one_daily_tasks_current', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('one_daily_morning_briefing', morningBriefing);
  }, [morningBriefing]);

  useEffect(() => {
    localStorage.setItem('one_daily_evening_reflections', reflectionNotes);
  }, [reflectionNotes]);

  useEffect(() => {
    localStorage.setItem('one_daily_evening_retro', eveningRetro);
  }, [eveningRetro]);

  // Derived metrics
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const velocityScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalMinutes = tasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);

  // Add a new task
  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;

    audioSynth.playClick(1400);
    const newTask: DailyTaskItem = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      category: newCategory,
      estimatedMinutes: newDuration,
      status: 'pending',
      anchoredToWeb: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    addToast({ type: 'info', title: 'Task Added', message: 'Added to daily mission plan.' });
  };

  // Toggle task status
  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        if (nextStatus === 'completed') {
          audioSynth.playNotification(980);
        } else {
          audioSynth.playClick(900);
        }
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Mark task as carried over or blocked
  const handleSetStatus = (id: string, status: DailyTaskItem['status']) => {
    audioSynth.playClick(1100);
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    audioSynth.playClick(700);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Anchor a task onto the 3D Spider Web as an active Vector Node
  const handleAnchorToWeb = (task: DailyTaskItem) => {
    audioSynth.playWhoosh();
    try {
      const saved = localStorage.getItem('one_spiderweb_user_topics');
      const existing = saved ? JSON.parse(saved) : [];

      // Check if already anchored
      const alreadyExists = existing.some((node: any) => node.label === task.title);
      if (!alreadyExists) {
        // Map category to spider web category
        let webCat: 'logic' | 'code' | 'creative' | 'concept' = 'logic';
        if (task.category === 'Engineering') webCat = 'code';
        if (task.category === 'Creative') webCat = 'creative';
        if (task.category === 'Research' || task.category === 'Deep Work') webCat = 'logic';
        if (task.category === 'Operations') webCat = 'concept';

        const angle = (existing.length * 53 + 30) * (Math.PI / 180);
        const radius = 1.35 + (existing.length % 3) * 0.45;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 0.45 + (Math.sin(angle * 2) * 0.35);

        const newNode = {
          id: `task-vector-${task.id}`,
          label: task.title,
          searchQueryTitle: `[Mission] ${task.title}`,
          category: webCat,
          prompt: `Today's Daily Task: ${task.title} (Priority: ${task.priority}, Category: ${task.category})`,
          x,
          y,
          z,
          similarity: 0.94,
          subLabel: `AM Mission • ${task.priority}`,
          searchTimestamp: 'Today Focus',
          badgeType: 'ai',
        };

        const updated = [newNode, ...existing];
        localStorage.setItem('one_spiderweb_user_topics', JSON.stringify(updated));
        
        // Dispatch custom event to notify UserVectorEmbeddingSpace in real time
        window.dispatchEvent(new CustomEvent('one_spiderweb_update', { detail: newNode }));
      }

      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, anchoredToWeb: true } : t)));
      addToast({ type: 'success', title: 'Anchored to 3D Web', message: `"${task.title.slice(0, 30)}..." anchored to 3D Spider Web!` });
    } catch (e) {
      console.error('Error anchoring to web', e);
    }
  };

  // Generate AI Morning Mission Briefing
  const handleGenerateMorningBriefing = async () => {
    if (tasks.length === 0) {
      addToast({ type: 'warning', title: 'Goals Required', message: 'Add at least one goal before generating briefing.' });
      return;
    }

    setIsGeneratingBriefing(true);
    audioSynth.playNotification(740);

    try {
      const response = await fetch('http://localhost:5000/api/daily-task/morning-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tasks.map(t => ({ title: t.title, priority: t.priority, category: t.category })),
          date: todayStr,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMorningBriefing(data.briefing);
        audioSynth.playNotification(1100);
        addToast({ type: 'success', title: 'Briefing Generated', message: 'AI Morning Briefing generated by Jev + Inkling.' });
      } else {
        throw new Error('Backend offline');
      }
    } catch {
      // Procedural fallback if backend is offline
      const topTask = tasks.find(t => t.priority === 'P0') || tasks[0];
      const fallback = `### 🎯 Tactical Mission Directive (${todayStr})
**1. Priority Focus (Eat the Frog):**
Start immediately with **"${topTask.title}"**. Dedicate your first 90-minute uninterrupted deep-work block to eliminate this critical constraint.

**2. ⚡ Energy & Cadence Strategy:**
- Total planned focus: **${totalMinutes} minutes** across **${tasks.length} objectives**.
- Recommended execution window: Tackling high-friction technical reasoning before 13:00, saving lighter operations for the afternoon.

**3. 🚀 Cognitive Affirmation:**
*"Precision in focus creates velocity in outcomes. Conquer the primary vector first."*`;
      setMorningBriefing(fallback);
      audioSynth.playNotification(1000);
      addToast({ type: 'info', title: 'Briefing Synthesized', message: 'Morning Briefing synthesized (Local Mode).' });
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  // Generate AI Evening Retrospective
  const handleGenerateEveningRetro = async () => {
    setIsGeneratingRetro(true);
    audioSynth.playNotification(650);

    const completed = tasks.filter(t => t.status === 'completed').map(t => t.title);
    const pending = tasks.filter(t => t.status !== 'completed').map(t => t.title);

    try {
      const response = await fetch('http://localhost:5000/api/daily-task/evening-debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTasks: completed,
          pendingTasks: pending,
          reflections: reflectionNotes,
          date: todayStr,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEveningRetro(data.retrospective);
        audioSynth.playNotification(1250);
        addToast({ type: 'success', title: 'Debrief Synthesized', message: `Evening Debrief synthesized! +${data.energyAwarded} ⚡ Energy reserve awarded.` });
      } else {
        throw new Error('Backend offline');
      }
    } catch {
      // Procedural fallback
      const fallback = `### 🌙 Evening Standup Retrospective (${todayStr})
- **🏆 Day's Wins & Impact:** Successfully completed **${completed.length} / ${totalCount}** focus goals (${velocityScore}% velocity). High-leverage progress anchored into vector memory.
- **🔍 Cognitive Diagnosis:** ${pending.length > 0 ? `Carrying over ${pending.length} item(s). Recommended to convert them to tomorrow morning's kickoff without cognitive guilt.` : 'Clean sweep! Zero carry-over debt.'}
- **🔋 Evening Rest Cadence:** Disconnect from active code loops. The mind consolidates architecture during downtime. Prepare for tomorrow's vector cycle.`;
      setEveningRetro(fallback);
      audioSynth.playNotification(1100);
      addToast({ type: 'info', title: 'Retrospective Synthesized', message: `Evening Retrospective synthesized (Velocity: ${velocityScore}%).` });
    } finally {
      setIsGeneratingRetro(false);
    }
  };

  // Seal & Archive Today's Day Log
  const handleSealDayLog = () => {
    audioSynth.playNotification(1320);
    const record: DayCadenceRecord = {
      date: todayStr,
      morningBriefing,
      eveningRetrospective: eveningRetro,
      tasks: [...tasks],
      velocity: velocityScore,
      energyEarned: 150 + completedCount * 30,
      reflectionNotes,
      sealedAt: new Date().toISOString(),
    };

    const updatedHistory = [record, ...history.filter(h => h.date !== todayStr)];
    setHistory(updatedHistory);
    localStorage.setItem('one_daily_cadence_history', JSON.stringify(updatedHistory));

    const nextStreak = streakCount + 1;
    setStreakCount(nextStreak);
    localStorage.setItem('one_daily_cadence_streak', nextStreak.toString());

    addToast({ type: 'success', title: 'Day Log Sealed', message: `🔥 ${nextStreak}-Day Streak maintained!` });
    setActiveTab('history');
  };

  return (
    <div className="relative rounded-3xl bg-[#141822]/90 backdrop-blur-xl border border-[#2A475E]/80 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
      {/* Steami Ambient Aurora Glow */}
      <div 
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: activeTab === 'morning' 
            ? 'radial-gradient(circle, #E5A866, transparent 70%)' 
            : activeTab === 'evening'
            ? 'radial-gradient(circle, #66C0F4, transparent 70%)'
            : 'radial-gradient(circle, #818CF8, transparent 70%)'
        }}
      />

      {/* Header: Title, Live Cadence Indicator & Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#2A475E]/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#E5A866] tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E5A866] animate-pulse" />
              02 // DAILY CADENCE // MISSION CONTROL
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#66C0F4]" />
              {todayStr}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Dual-Brain Daily Task System
            <span className="text-xs font-mono font-normal text-zinc-400 hidden sm:inline">
              (AM Kickoff & PM Standup)
            </span>
          </h2>
        </div>

        {/* Quick Metrics & Cadence Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5A866]/10 border border-[#E5A866]/30 text-[#E5A866] font-mono text-xs shadow-inner">
            <Flame className="w-4 h-4 fill-[#E5A866]" />
            <span>{streakCount} Day Streak</span>
          </div>

          {/* Velocity Progress Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1B2838] border border-[#2A475E] text-zinc-300 font-mono text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Velocity: <strong className="text-emerald-400 font-bold">{velocityScore}%</strong> ({completedCount}/{totalCount})</span>
          </div>

          {/* Tab Navigation */}
          <div className="inline-flex p-1 rounded-2xl bg-[#0F141C] border border-[#2A475E]/80 shadow-inner">
            <button
              onClick={() => {
                audioSynth.playClick(1100);
                setActiveTab('morning');
              }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${
                activeTab === 'morning'
                  ? 'bg-gradient-to-r from-[#E5A866] to-[#F59E0B] text-black shadow-lg shadow-[#E5A866]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>🌅 Morning (AM)</span>
            </button>

            <button
              onClick={() => {
                audioSynth.playClick(1000);
                setActiveTab('evening');
              }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${
                activeTab === 'evening'
                  ? 'bg-gradient-to-r from-[#66C0F4] to-[#38BDF8] text-black shadow-lg shadow-[#66C0F4]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>🌙 Evening (PM)</span>
            </button>

            <button
              onClick={() => {
                audioSynth.playClick(900);
                setActiveTab('history');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-[#818CF8] to-[#A78BFA] text-white shadow-lg shadow-[#818CF8]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: 🌅 MORNING KICKOFF (AM Focus & Mission Planning) */}
      {activeTab === 'morning' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Mission Creator Bar */}
          <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-[#1B2838]/80 border border-[#2A475E] space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter high-impact mission goal for today (e.g., 'Implement 3D Spider Web gravitation')..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0E1622] border border-[#2A475E] text-white text-sm focus:outline-none focus:border-[#E5A866] placeholder-zinc-500 font-sans"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A866] to-[#F59E0B] text-black font-semibold text-xs font-mono flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ ADD GOAL</span>
              </button>
            </div>

            {/* Parameter Selectors: Priority, Category, Estimated Time */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider mr-1">Parameters:</span>
              
              {/* Priority */}
              {(['P0', 'P1', 'P2'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    audioSynth.playClick(1200);
                    setNewPriority(p);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    newPriority === p
                      ? p === 'P0' 
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                        : p === 'P1'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {p === 'P0' ? '🔥 P0 (Critical)' : p === 'P1' ? '⚡ P1 (High)' : '🌱 P2 (Normal)'}
                </button>
              ))}

              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

              {/* Category */}
              {(['Engineering', 'Research', 'Creative', 'Deep Work'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    audioSynth.playClick(1100);
                    setNewCategory(cat);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    newCategory === cat
                      ? 'bg-[#66C0F4]/20 border-[#66C0F4] text-[#66C0F4] font-medium'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

              {/* Duration */}
              {[25, 45, 90, 120].map((dur) => (
                <button
                  type="button"
                  key={dur}
                  onClick={() => {
                    audioSynth.playClick(1000);
                    setNewDuration(dur);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    newDuration === dur
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-medium'
                      : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {dur}m
                </button>
              ))}
            </div>
          </form>

          {/* Two-Column Layout: Task Checklist + AI Morning Briefing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Morning Mission List (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                <span>TODAY'S MISSIONS ({tasks.length})</span>
                <span>TOTAL FOCUS: ~{totalMinutes} MIN</span>
              </div>

              {tasks.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#1B2838]/50 border border-dashed border-[#2A475E] text-center space-y-2">
                  <Sun className="w-8 h-8 text-[#E5A866] mx-auto opacity-60 animate-bounce" />
                  <p className="text-white text-sm font-medium">No Morning Goals Planned Yet</p>
                  <p className="text-zinc-500 text-xs">Add your high-priority goals above to ignite today's cognitive session.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                        task.status === 'completed'
                          ? 'bg-[#16212E]/60 border-[#2A475E]/40 opacity-75'
                          : 'bg-[#1B2838] border-[#2A475E] hover:border-[#E5A866]/50 shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleStatus(task.id)}
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                            task.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-400 text-black'
                              : 'bg-black/40 border-zinc-600 hover:border-[#E5A866]'
                          }`}
                        >
                          {task.status === 'completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        {/* Title & Metadata */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium text-white line-clamp-1 transition-all ${
                              task.status === 'completed' ? 'line-through text-zinc-500' : ''
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                task.priority === 'P0'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : task.priority === 'P1'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-sky-500/20 text-sky-400'
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-zinc-400">{task.category}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.estimatedMinutes}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Anchor to 3D Web & Delete */}
                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          onClick={() => handleAnchorToWeb(task)}
                          title="Anchor this goal as an active glowing node on the 3D Spider Web"
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                            task.anchoredToWeb
                              ? 'bg-[#E5A866]/20 text-[#E5A866] border border-[#E5A866]/40'
                              : 'bg-white/5 hover:bg-[#E5A866]/20 text-zinc-400 hover:text-[#E5A866] border border-white/5'
                          }`}
                        >
                          <Share2 className="w-3 h-3" />
                          <span className="hidden sm:inline">{task.anchoredToWeb ? 'Anchored' : 'To Web'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: AI Morning Mission Briefing Card (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-[#1B2838] to-[#121A24] border border-[#2A475E] space-y-4 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#E5A866]" />
                    <span className="font-mono text-xs font-semibold text-white tracking-wide">
                      AI MORNING BRIEFING
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Jev + Inkling
                  </span>
                </div>

                {morningBriefing ? (
                  <div className="text-xs text-zinc-300 font-sans leading-relaxed space-y-2 whitespace-pre-line bg-[#0E1622]/80 p-3.5 rounded-xl border border-white/5 max-h-72 overflow-y-auto">
                    {morningBriefing}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2 text-zinc-400 text-xs">
                    <Sparkles className="w-6 h-6 text-[#E5A866] mx-auto animate-pulse opacity-70" />
                    <p>Generate a structured tactical strategy for today's goals using the dual-brain engine.</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateMorningBriefing}
                disabled={isGeneratingBriefing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E5A866] to-[#F59E0B] text-black font-semibold text-xs font-mono flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingBriefing ? 'Synthesizing Tactics...' : '⚡ Generate AI Morning Briefing'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 🌙 EVENING REVIEW (PM Standup & Retrospective) */}
      {activeTab === 'evening' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Debrief Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1B2838] to-[#162738] border border-[#2A475E] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#66C0F4]/10 border border-[#66C0F4]/30 flex items-center justify-center text-[#66C0F4] shrink-0">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Daily Standup Reconciliation</h3>
                <p className="text-xs text-zinc-400">Reconcile today's task outcomes, log learnings, and award energy reserves.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateEveningRetro}
                disabled={isGeneratingRetro}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#66C0F4] to-[#38BDF8] text-black font-semibold text-xs font-mono flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingRetro ? 'Analyzing...' : '🌙 Synthesize Evening Standup'}</span>
              </button>

              <button
                onClick={handleSealDayLog}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Seal Day Log</span>
              </button>
            </div>
          </div>

          {/* Two-Column Grid: Task Outcome Selectors + Reflection/AI Retrospective */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Task Outcome Status (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                <span>RECONCILE TODAY'S TASKS</span>
                <span className="text-emerald-400 font-bold">{completedCount} of {totalCount} Completed</span>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      task.status === 'completed'
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : task.status === 'blocked'
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : task.status === 'carried_over'
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-[#1B2838] border-[#2A475E]'
                    }`}
                  >
                    <div className="min-w-0 flex-1 mr-3">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-emerald-300 line-through' : 'text-white'} line-clamp-1`}>
                        {task.title}
                      </p>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {task.category} • {task.priority}
                      </span>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSetStatus(task.id, 'completed')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          task.status === 'completed'
                            ? 'bg-emerald-500 text-black font-bold'
                            : 'bg-black/40 text-zinc-400 hover:text-white border border-white/5'
                        }`}
                      >
                        Done
                      </button>

                      <button
                        onClick={() => handleSetStatus(task.id, 'carried_over')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          task.status === 'carried_over'
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-black/40 text-zinc-400 hover:text-white border border-white/5'
                        }`}
                      >
                        Rollover
                      </button>

                      <button
                        onClick={() => handleSetStatus(task.id, 'blocked')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          task.status === 'blocked'
                            ? 'bg-rose-500 text-white font-bold'
                            : 'bg-black/40 text-zinc-400 hover:text-white border border-white/5'
                        }`}
                      >
                        Blocked
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reflection Log Area */}
              <div className="pt-3 space-y-2">
                <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#66C0F4]" />
                  <span>Evening Reflection & Breakthrough Notes</span>
                </label>
                <textarea
                  rows={3}
                  value={reflectionNotes}
                  onChange={(e) => setReflectionNotes(e.target.value)}
                  placeholder="What were today's key wins, architectural breakthroughs, or blockers encountered?..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#0E1622] border border-[#2A475E] text-white text-xs font-sans placeholder-zinc-500 focus:outline-none focus:border-[#66C0F4] leading-relaxed"
                />
              </div>
            </div>

            {/* Right: AI Evening Retrospective Summary (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-[#1B2838] to-[#121A24] border border-[#2A475E] space-y-4 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#66C0F4]" />
                    <span className="font-mono text-xs font-semibold text-white tracking-wide">
                      AI EVENING RETROSPECTIVE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#66C0F4]/10 text-[#66C0F4] border border-[#66C0F4]/20">
                    Velocity: {velocityScore}%
                  </span>
                </div>

                {eveningRetro ? (
                  <div className="text-xs text-zinc-300 font-sans leading-relaxed space-y-2 whitespace-pre-line bg-[#0E1622]/80 p-3.5 rounded-xl border border-white/5 max-h-72 overflow-y-auto">
                    {eveningRetro}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2 text-zinc-400 text-xs">
                    <Moon className="w-6 h-6 text-[#66C0F4] mx-auto opacity-70 animate-pulse" />
                    <p>Click "Synthesize Evening Standup" to compile today's cognitive velocity and unlock daily telemetry energy.</p>
                  </div>
                )}
              </div>

              {/* Energy Bonus Alert */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs font-mono text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>Cognitive Energy Award</span>
                </span>
                <span className="font-bold">+{150 + completedCount * 30} ⚡ Telemetry</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 📜 HISTORY & STREAK ANALYTICS */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span>ARCHIVED CADENCE LOGS</span>
            <span className="text-[#818CF8]">{history.length} Day(s) Recorded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((record, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[#1B2838] border border-[#2A475E] space-y-3 hover:border-[#818CF8]/50 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#66C0F4]" />
                    {record.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {record.velocity}% Velocity
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      +{record.energyEarned} ⚡
                    </span>
                  </div>
                </div>

                {record.eveningRetrospective && (
                  <p className="text-xs text-zinc-300 line-clamp-3 bg-[#0E1622] p-2.5 rounded-xl border border-white/5 font-sans">
                    {record.eveningRetrospective.replace(/[#*]/g, '')}
                  </p>
                )}

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>{record.tasks.length} objectives logged</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Sealed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
