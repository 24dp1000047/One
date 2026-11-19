import React from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Clock, 
  Compass, 
  Sparkles, 
  ChevronUp, 
  ChevronDown,
  Wand2 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CameraMotion, Scene } from '../../types';

export const StoryboardEditor: React.FC = () => {
  const scenes = useAppStore((state) => state.scenes);
  const updateScene = useAppStore((state) => state.updateScene);
  const addScene = useAppStore((state) => state.addScene);
  const removeScene = useAppStore((state) => state.removeScene);
  const generateStoryboard = useAppStore((state) => state.generateStoryboardFromPrompt);
  const studioPrompt = useAppStore((state) => state.studioPrompt);

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 0), 0);

  const cameraOptions: CameraMotion[] = [
    'Slow Orbit',
    'Pan Right',
    'Pan Left',
    'FPV Drone Dive',
    'Cinematic Crane Up',
    'Hyperlapse Zoom',
    'Static',
  ];

  return (
    <div className="space-y-4 rounded-2xl bg-[#121212] border border-[#242424] p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-brand-yellow" />
          <h3 className="text-sm font-semibold text-white tracking-wide">Storyboard Scenes</h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1c1c1c] text-muted border border-[#2d2d2d]">
            {scenes.length} Scenes • {totalDuration}s Total
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => generateStoryboard(studioPrompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] border border-[#2c2c2c] text-xs text-zinc-300 hover:text-white transition-colors"
            title="Auto-regenerate scenes from current prompt"
          >
            <Wand2 className="w-3.5 h-3.5 text-brand-orange" />
            <span>Re-Synthesize</span>
          </button>

          <button
            type="button"
            onClick={addScene}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-yellow text-black font-semibold text-xs shadow-glow-yellow-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scene</span>
          </button>
        </div>
      </div>

      {/* Scene Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {scenes.map((scene, idx) => (
          <div
            key={scene.id}
            className="group flex flex-col justify-between rounded-xl bg-[#161616] border border-[#262626] hover:border-brand-yellow/40 p-3.5 space-y-3 transition-all"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-black/60 border border-brand-yellow/40 flex items-center justify-center text-brand-yellow text-xs font-mono font-bold">
                  {scene.sceneNumber}
                </span>
                <span className="text-xs font-semibold text-white">Scene {scene.sceneNumber}</span>
              </div>

              <div className="flex items-center gap-1">
                {/* Duration Input */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 border border-[#2b2b2b] text-[11px] font-mono text-zinc-300">
                  <Clock className="w-3 h-3 text-brand-yellow" />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={scene.duration}
                    onChange={(e) => updateScene(scene.id, { duration: Math.max(1, Number(e.target.value)) })}
                    className="w-7 bg-transparent text-white focus:outline-none text-center"
                  />
                  <span>s</span>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removeScene(scene.id)}
                  disabled={scenes.length <= 1}
                  className="p-1 text-muted hover:text-rose-400 rounded hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Remove scene"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Visual */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50 border border-[#2b2b2b]">
              <img
                src={scene.thumbnail}
                alt={`Scene ${scene.sceneNumber}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-brand-yellow border border-white/10">
                {scene.cameraMotion}
              </div>
            </div>

            {/* Camera Motion Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-muted flex items-center gap-1">
                <Compass className="w-3 h-3 text-brand-yellow" />
                Camera Motion
              </label>
              <select
                value={scene.cameraMotion}
                onChange={(e) => updateScene(scene.id, { cameraMotion: e.target.value as CameraMotion })}
                className="w-full bg-[#111111] border border-[#2b2b2b] text-zinc-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-brand-yellow font-mono cursor-pointer"
              >
                {cameraOptions.map((cam) => (
                  <option key={cam} value={cam}>
                    {cam}
                  </option>
                ))}
              </select>
            </div>

            {/* Scene Prompt Description (Editable) */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-muted">Scene Prompt</label>
              <textarea
                rows={2}
                value={scene.prompt}
                onChange={(e) => updateScene(scene.id, { prompt: e.target.value })}
                className="w-full bg-[#111111] border border-[#2b2b2b] rounded-lg p-2 text-xs text-white placeholder-muted focus:outline-none focus:border-brand-yellow resize-none leading-relaxed"
                placeholder="Scene visual instructions..."
              />
            </div>

            {/* Visual Notes (Editable) */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-muted">Lighting & FX Notes</label>
              <input
                type="text"
                value={scene.visualNotes}
                onChange={(e) => updateScene(scene.id, { visualNotes: e.target.value })}
                className="w-full bg-[#111111] border border-[#2b2b2b] rounded-lg px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-brand-yellow"
                placeholder="e.g. Amber volumetric haze..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
