import React, { useRef, useEffect, useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sliders, 
  Activity, 
  Sparkles, 
  Radio, 
  Music, 
  Waves, 
  Headphones,
  Check
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { audioSynth } from '../../utils/audioSynth';

export const SoundDesignStudio: React.FC = () => {
  const audioMixer = useAppStore((state) => state.audioMixer);
  const updateAudioMixer = useAppStore((state) => state.updateAudioMixer);
  const toggleAudioSynth = useAppStore((state) => state.toggleAudioSynth);
  const addToast = useAppStore((state) => state.addToast);

  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMood, setActiveMood] = useState<'cyber' | 'deep' | 'ambient' | 'tense'>('cyber');

  // Real-time Web Audio Spectrogram Visualizer
  useEffect(() => {
    const canvas = spectrumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#05070D';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 15; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Sample real frequency data or generate responsive bars
      const freqData = audioSynth.getByteFrequencyData();
      const numBars = 36;
      const barWidth = (width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        let value = 0;
        if (audioMixer.isPlayingSynth && freqData.length > 0) {
          const sampleIdx = Math.floor((i / numBars) * freqData.length * 0.7);
          value = freqData[sampleIdx] || 0;
        } else {
          // Subtle idle noise
          value = Math.sin(Date.now() * 0.003 + i * 0.3) * 6 + 10;
        }

        const barHeight = Math.max(3, (value / 255) * (height - 10));
        const x = i * (barWidth + 2) + 2;
        const y = height - barHeight;

        // Gradient from Ice Blue (#A5C4F2) to Amber (#FFD600)
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(165, 196, 242, 0.3)');
        grad.addColorStop(0.7, 'rgba(165, 196, 242, 0.9)');
        grad.addColorStop(1, '#FFD600');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Peak dot
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y - 2, barWidth, 1.5);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [audioMixer.isPlayingSynth]);

  const moodPresets = [
    {
      id: 'cyber',
      name: 'Cyberpunk Atmosphere',
      desc: 'Heavy 40Hz sub-drone with resonant metallic sweeps',
      drone: 85,
      shimmer: 60,
      atmo: 50,
      bpm: 90,
    },
    {
      id: 'deep',
      name: 'Deep Space Void',
      desc: 'Hypnotic low rumble with cosmic solar wind',
      drone: 95,
      shimmer: 30,
      atmo: 70,
      bpm: 65,
    },
    {
      id: 'ambient',
      name: 'Ethereal Shimmer',
      desc: 'Floating ambient chords and crystalline harmonics',
      drone: 45,
      shimmer: 90,
      atmo: 40,
      bpm: 78,
    },
    {
      id: 'tense',
      name: 'Cinematic Tension',
      desc: 'Subtle pulsating bass and high-pass texture',
      drone: 70,
      shimmer: 75,
      atmo: 80,
      bpm: 110,
    },
  ];

  const applyMood = (mood: typeof moodPresets[0]) => {
    setActiveMood(mood.id as any);
    updateAudioMixer({
      droneVolume: mood.drone,
      shimmerVolume: mood.shimmer,
      atmosphereVolume: mood.atmo,
      tempoBpm: mood.bpm,
    });
    audioSynth.playClick(1200);
    addToast({
      type: 'info',
      title: `Soundscape: ${mood.name}`,
      message: 'Synthesizer stem gains configured.',
    });
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#040608] border border-[#181C26] overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#141822] bg-[#07090F]/90 backdrop-blur-md z-10 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-pink-400">
            <Radio className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Spatial Audio & Synthesizer</span>
          </div>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400 text-[11px]">Web Audio API Procedural Sound Engine</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudioSynth}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              audioMixer.isPlayingSynth
                ? 'bg-pink-500/20 border border-pink-400 text-pink-300 shadow-lg shadow-pink-500/20'
                : 'bg-white/10 hover:bg-white/15 border border-white/20 text-white'
            }`}
          >
            {audioMixer.isPlayingSynth ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE SYNTH</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START SYNTHESIZER</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Spectrogram + Stem Mixer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 items-start">
        {/* Left Column: Real-time FFT Spectrogram & Mood Presets */}
        <div className="lg:col-span-6 space-y-4">
          {/* Spectrogram Canvas */}
          <div className="p-4 rounded-xl bg-[#06080F] border border-[#141822] space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 text-pink-400">
                <Activity className="w-3.5 h-3.5" />
                REAL-TIME SPECTRAL FREQUENCY (20Hz - 20kHz)
              </span>
              <span className="text-zinc-500">
                {audioMixer.isPlayingSynth ? 'LIVE BUFFER' : 'IDLE'}
              </span>
            </div>

            <canvas
              ref={spectrumCanvasRef}
              width={480}
              height={120}
              className="w-full h-[120px] rounded-lg border border-white/5"
            />

            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pt-1">
              <span>SUB-BASS (40Hz)</span>
              <span>LOW-MID</span>
              <span>PRESENCE (4kHz)</span>
              <span>AIR (16kHz)</span>
            </div>
          </div>

          {/* Mood Presets */}
          <div className="space-y-2">
            <div className="font-mono text-xs text-zinc-400 tracking-wider uppercase">
              Atmospheric Soundscape Presets
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {moodPresets.map((m) => (
                <button
                  key={m.id}
                  onClick={() => applyMood(m)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    activeMood === m.id
                      ? 'bg-pink-500/10 border-pink-400/50 ring-1 ring-pink-400/20'
                      : 'bg-[#080B12] hover:bg-[#0D121F] border-[#181C26]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-medium text-xs text-white">
                      {m.name}
                    </span>
                    {activeMood === m.id && (
                      <Check className="w-3.5 h-3.5 text-pink-400" />
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5 line-clamp-1">
                    {m.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 4-Stem Fader Console */}
        <div className="lg:col-span-6 space-y-4">
          <div className="font-mono text-xs text-zinc-400 tracking-wider uppercase">
            Multitrack Stem Mixer Consoles
          </div>

          <div className="space-y-4 bg-[#06080F] border border-[#141822] p-4 rounded-xl">
            {/* Master Volume */}
            <div className="space-y-1.5 pb-2 border-b border-[#141822]">
              <div className="flex justify-between font-mono text-xs text-zinc-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <Headphones className="w-3.5 h-3.5 text-white" />
                  MASTER GAIN
                </span>
                <span className="text-white font-bold">{audioMixer.masterVolume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={audioMixer.masterVolume}
                onChange={(e) => updateAudioMixer({ masterVolume: parseInt(e.target.value) })}
                className="w-full accent-white bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Stem 1: Sub Drone */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-pink-400" />
                  Stem 1: Sub-Bass Cinema Drone (43.6Hz F1)
                </span>
                <span className="text-pink-400 font-semibold">{audioMixer.droneVolume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={audioMixer.droneVolume}
                onChange={(e) => updateAudioMixer({ droneVolume: parseInt(e.target.value) })}
                className="w-full accent-pink-400 bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Stem 2: Shimmer Pad */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#A5C4F2]" />
                  Stem 2: Harmonic Shimmer & Breathing LFO
                </span>
                <span className="text-[#A5C4F2] font-semibold">{audioMixer.shimmerVolume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={audioMixer.shimmerVolume}
                onChange={(e) => updateAudioMixer({ shimmerVolume: parseInt(e.target.value) })}
                className="w-full accent-[#A5C4F2] bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Stem 3: Atmosphere Rain/Noise */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" />
                  Stem 3: Cosmic Wind & Foley Rain Texture
                </span>
                <span className="text-[#FFD600] font-semibold">{audioMixer.atmosphereVolume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={audioMixer.atmosphereVolume}
                onChange={(e) => updateAudioMixer({ atmosphereVolume: parseInt(e.target.value) })}
                className="w-full accent-[#FFD600] bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Tactile SFX Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#141822]">
              <span className="font-mono text-xs text-zinc-400">
                Tactile UI Mechanical Audio Clicks
              </span>
              <button
                onClick={() => {
                  audioSynth.playClick(1400);
                  updateAudioMixer({ sfxEnabled: !audioMixer.sfxEnabled });
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors cursor-pointer ${
                  audioMixer.sfxEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-zinc-500'
                }`}
              >
                {audioMixer.sfxEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
