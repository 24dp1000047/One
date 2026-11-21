// Web Audio API Synthesizer Engine for Project ONe
// Generates live procedural ambient soundscapes, sci-fi audio stems, and tactile UI feedback.

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Stems
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;

  private shimmerGain: GainNode | null = null;
  private shimmerOsc1: OscillatorNode | null = null;
  private shimmerOsc2: OscillatorNode | null = null;
  private shimmerLfo: OscillatorNode | null = null;
  private shimmerLfoGain: GainNode | null = null;

  private atmoGain: GainNode | null = null;
  private atmoSource: AudioBufferSourceNode | null = null;
  private atmoFilter: BiquadFilterNode | null = null;

  // Stored volume multipliers (0 to 1)
  private masterVolVal: number = 0.6;
  private droneVolVal: number = 0.7;
  private shimmerVolVal: number = 0.5;
  private atmoVolVal: number = 0.4;
  private sfxEnabledVal: boolean = true;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getByteFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public startAtmosphere(): void {
    if (this.isRunning) return;

    try {
      const ctx = this.ensureContext();
      this.isRunning = true;

      // Master output & Analyser
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.masterVolVal, ctx.currentTime + 1.2);

      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(ctx.destination);

      // --- STEM 1: SUB-BASS CINEMA DRONE ---
      this.droneGain = ctx.createGain();
      this.droneGain.gain.setValueAtTime(this.droneVolVal, ctx.currentTime);

      this.droneFilter = ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(120, ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(3.5, ctx.currentTime);

      this.droneOsc1 = ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(43.65, ctx.currentTime); // F1

      this.droneOsc2 = ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(87.3, ctx.currentTime); // F2 octave

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      // --- STEM 2: HARMONIC SHIMMER & CHORD PADS ---
      this.shimmerGain = ctx.createGain();
      this.shimmerGain.gain.setValueAtTime(this.shimmerVolVal, ctx.currentTime);

      const shimmerFilter = ctx.createBiquadFilter();
      shimmerFilter.type = 'bandpass';
      shimmerFilter.frequency.setValueAtTime(520, ctx.currentTime);
      shimmerFilter.Q.setValueAtTime(1.8, ctx.currentTime);

      this.shimmerOsc1 = ctx.createOscillator();
      this.shimmerOsc1.type = 'sine';
      this.shimmerOsc1.frequency.setValueAtTime(261.63, ctx.currentTime); // Middle C

      this.shimmerOsc2 = ctx.createOscillator();
      this.shimmerOsc2.type = 'triangle';
      this.shimmerOsc2.frequency.setValueAtTime(392.0, ctx.currentTime); // G4 fifth

      // Slow Breathing LFO for Shimmer Pad
      this.shimmerLfo = ctx.createOscillator();
      this.shimmerLfo.type = 'sine';
      this.shimmerLfo.frequency.setValueAtTime(0.18, ctx.currentTime); // ~5.5s cycle

      this.shimmerLfoGain = ctx.createGain();
      this.shimmerLfoGain.gain.setValueAtTime(180, ctx.currentTime);
      this.shimmerLfo.connect(this.shimmerLfoGain);
      this.shimmerLfoGain.connect(shimmerFilter.frequency);

      this.shimmerOsc1.connect(shimmerFilter);
      this.shimmerOsc2.connect(shimmerFilter);
      shimmerFilter.connect(this.shimmerGain);
      this.shimmerGain.connect(this.masterGain);

      this.shimmerLfo.start();
      this.shimmerOsc1.start();
      this.shimmerOsc2.start();

      // --- STEM 3: ATMOSPHERIC RAIN & SOLAR WIND (Noise buffer) ---
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.atmoSource = ctx.createBufferSource();
      this.atmoSource.buffer = noiseBuffer;
      this.atmoSource.loop = true;

      this.atmoFilter = ctx.createBiquadFilter();
      this.atmoFilter.type = 'bandpass';
      this.atmoFilter.frequency.setValueAtTime(800, ctx.currentTime);
      this.atmoFilter.Q.setValueAtTime(0.8, ctx.currentTime);

      this.atmoGain = ctx.createGain();
      this.atmoGain.gain.setValueAtTime(this.atmoVolVal * 0.25, ctx.currentTime);

      this.atmoSource.connect(this.atmoFilter);
      this.atmoFilter.connect(this.atmoGain);
      this.atmoGain.connect(this.masterGain);

      this.atmoSource.start();
    } catch (e) {
      console.warn('AudioContext autoplay locked until user interaction', e);
    }
  }

  public stopAtmosphere(): void {
    if (!this.isRunning || !this.ctx) return;

    try {
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      }

      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.shimmerOsc1?.stop();
          this.shimmerOsc2?.stop();
          this.shimmerLfo?.stop();
          this.atmoSource?.stop();

          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.shimmerOsc1?.disconnect();
          this.shimmerOsc2?.disconnect();
          this.shimmerLfo?.disconnect();
          this.atmoSource?.disconnect();
        } catch (_) {}

        this.isRunning = false;
      }, 550);
    } catch (e) {
      this.isRunning = false;
    }
  }

  public setVolumes(master: number, drone: number, shimmer: number, atmo: number): void {
    this.masterVolVal = master / 100;
    this.droneVolVal = drone / 100;
    this.shimmerVolVal = shimmer / 100;
    this.atmoVolVal = atmo / 100;

    if (!this.ctx || !this.isRunning) return;

    const t = this.ctx.currentTime;
    if (this.masterGain) this.masterGain.gain.setTargetAtTime(this.masterVolVal, t, 0.05);
    if (this.droneGain) this.droneGain.gain.setTargetAtTime(this.droneVolVal, t, 0.05);
    if (this.shimmerGain) this.shimmerGain.gain.setTargetAtTime(this.shimmerVolVal, t, 0.05);
    if (this.atmoGain) this.atmoGain.gain.setTargetAtTime(this.atmoVolVal * 0.25, t, 0.05);
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabledVal = enabled;
  }

  public playClick(freq = 1200): void {
    if (!this.sfxEnabledVal) return;
    try {
      const ctx = this.ensureContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (_) {}
  }

  public playWhoosh(): void {
    if (!this.sfxEnabledVal) return;
    try {
      const ctx = this.ensureContext();
      const bufferSize = ctx.sampleRate * 0.3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.15);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.12);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (_) {}
  }
}

export const audioSynth = new AudioSynthEngine();
