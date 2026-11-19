import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, X, AlertCircle, Film, RefreshCw, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const GenerationStatusOverlay: React.FC = () => {
  const status = useAppStore((state) => state.generationStatus);
  const progress = useAppStore((state) => state.generationProgress);
  const cancelGeneration = useAppStore((state) => state.cancelGeneration);
  const activeVideo = useAppStore((state) => state.activeGeneratedVideo);

  if (status === 'idle') return null;

  const getStageDetails = () => {
    switch (status) {
      case 'analyzing':
        return {
          title: 'Stage 1: Semantic Analysis',
          desc: 'Deconstructing scene prompt, lighting vectors, and lens parameters...',
          icon: Sparkles,
          color: 'text-brand-yellow',
        };
      case 'storyboarding':
        return {
          title: 'Stage 2: Keyframe Storyboard',
          desc: 'Calculating camera blocking, spatial depth maps, and transitions...',
          icon: Layers,
          color: 'text-brand-orange',
        };
      case 'vectors':
        return {
          title: 'Stage 3: Optical Motion Simulation',
          desc: 'Synthesizing fluid motion vectors and 60fps frame interpolation...',
          icon: RefreshCw,
          color: 'text-sky-400',
        };
      case 'rendering':
        return {
          title: 'Stage 4: 4K Neural Rendering',
          desc: 'Applying volumetric Lumen reflections and anamorphic grain pass...',
          icon: Film,
          color: 'text-emerald-400',
        };
      case 'completed':
        return {
          title: 'Synthesis Complete!',
          desc: 'Video rendered successfully in full cinematic 4K 60fps.',
          icon: CheckCircle2,
          color: 'text-brand-yellow',
        };
      default:
        return {
          title: 'Generating Video',
          desc: 'Processing multi-pass neural rendering...',
          icon: Sparkles,
          color: 'text-brand-yellow',
        };
    }
  };

  const details = getStageDetails();
  const Icon = details.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="rounded-2xl bg-[#141414]/95 backdrop-blur-xl border border-brand-yellow/30 p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-black/60 border border-[#2b2b2b] text-brand-yellow">
              <Icon className={`w-5 h-5 ${status !== 'completed' ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">{details.title}</h4>
              <p className="text-xs text-muted mt-0.5">{details.desc}</p>
            </div>
          </div>

          {status !== 'completed' && (
            <button
              onClick={cancelGeneration}
              className="text-muted hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              title="Cancel generation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Processing Timeline</span>
            <span className="text-brand-yellow font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#202020] overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-brand-yellow via-[#FFE24D] to-brand-orange shadow-glow-yellow-sm"
            />
          </div>
        </div>

        {/* Status Stages checklist */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-[#202020] text-[10px] font-mono">
          <div className={`flex items-center gap-1 ${progress >= 15 ? 'text-brand-yellow font-bold' : 'text-zinc-600'}`}>
            <span>01</span>
            <span>Semantics</span>
          </div>
          <div className={`flex items-center gap-1 ${progress >= 35 ? 'text-brand-yellow font-bold' : 'text-zinc-600'}`}>
            <span>02</span>
            <span>Storyboard</span>
          </div>
          <div className={`flex items-center gap-1 ${progress >= 65 ? 'text-brand-yellow font-bold' : 'text-zinc-600'}`}>
            <span>03</span>
            <span>Vectors</span>
          </div>
          <div className={`flex items-center gap-1 ${progress >= 95 ? 'text-brand-yellow font-bold' : 'text-zinc-600'}`}>
            <span>04</span>
            <span>Lumen 4K</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
