// Web Audio API Procedural Sound Engine for Diwali Wonderland
// 100% self-contained: no external audio files required, zero latency, offline ready.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private bgmInterval: number | null = null;
  private fuseNoiseNode: AudioNode | null = null;
  private fuseGainNode: GainNode | null = null;

  constructor() {}

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master BGM gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      // Master SFX gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;

    if (this.ctx && this.bgmGain && this.sfxGain) {
      const now = this.ctx.currentTime;
      if (this.isMuted) {
        this.bgmGain.gain.setTargetAtTime(0, now, 0.08);
        this.sfxGain.gain.setTargetAtTime(0, now, 0.08);
      } else {
        this.bgmGain.gain.setTargetAtTime(0.28, now, 0.15);
        this.sfxGain.gain.setTargetAtTime(0.6, now, 0.15);
        if (!this.isBgmPlaying) {
          this.startBGM();
        }
      }
    }
    return !this.isMuted;
  }

  public unmute(): void {
    if (this.isMuted) {
      this.toggleMute();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft Indian meditative Tanpura drone & ambient bell harmonics
  public startBGM(): void {
    this.initContext();
    if (this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
    this.isBgmPlaying = true;

    // Root notes in D (traditional classical Indian scale: D - A - D' - F#)
    const rootFreq = 146.83; // D3
    const droneFreqs = [rootFreq * 0.5, rootFreq, rootFreq * 1.5, rootFreq * 2]; // D2, D3, A3, D4

    this.bgmOscillators = [];

    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 4, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start();
      this.bgmOscillators.push({ osc, gain });
    });

    const bellPitches = [293.66, 369.99, 440.0, 554.37, 587.33, 659.25];
    let noteStep = 0;

    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || !this.isBgmPlaying || this.isMuted) return;
      const pitch = bellPitches[noteStep % bellPitches.length];
      noteStep++;
      this.playGentleChime(pitch, 0.035, 3.5);
    }, 3800);
  }

  public stopBGM(): void {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmOscillators.forEach(({ osc, gain }) => {
      try {
        if (this.ctx) {
          gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
          setTimeout(() => osc.stop(), 600);
        }
      } catch {
        // ignore
      }
    });
    this.bgmOscillators = [];
    this.isBgmPlaying = false;
  }

  private playGentleChime(freq: number, volume: number = 0.05, duration: number = 2.5): void {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.bgmGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  public playMatchStrike(): void {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  public startFuseSound(): void {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.fuseNoiseNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const crackle = Math.random() > 0.94 ? (Math.random() * 2 - 1) * 1.5 : (Math.random() * 0.2 - 0.1);
      data[i] = crackle;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(3200, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(3, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    const targetVol = this.isMuted ? 0 : 0.35;
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.1);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
    this.fuseNoiseNode = noise;
    this.fuseGainNode = gain;
  }

  public stopFuseSound(): void {
    if (this.fuseGainNode && this.ctx) {
      this.fuseGainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    }
    setTimeout(() => {
      if (this.fuseNoiseNode) {
        try {
          (this.fuseNoiseNode as AudioBufferSourceNode).stop();
        } catch {
          // ignore
        }
        this.fuseNoiseNode = null;
        this.fuseGainNode = null;
      }
    }, 120);
  }

  public playRocketLaunch(): void {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const duration = 1.8;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.8);

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(250, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(1400, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);

    gain.connect(this.sfxGain);

    osc.start(now);
    noise.start(now);

    osc.stop(now + duration);
    noise.stop(now + duration);
  }

  public playFireworkBurst(intensity: 'heavy' | 'medium' | 'sparkle' = 'heavy'): void {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();

    boomOsc.type = 'sine';
    const startFreq = intensity === 'heavy' ? 110 : 85;
    boomOsc.frequency.setValueAtTime(startFreq, now);
    boomOsc.frequency.exponentialRampToValueAtTime(28, now + 0.45);

    const boomVol = intensity === 'heavy' ? 0.65 : 0.45;
    boomGain.gain.setValueAtTime(boomVol, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);

    boomOsc.start(now);
    boomOsc.stop(now + 0.65);

    const noiseLen = intensity === 'heavy' ? 0.8 : 0.5;
    const bufferSize = Math.floor(this.ctx.sampleRate * noiseLen);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const isSparkle = Math.random() > 0.88;
      data[i] = isSparkle ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 0.1 - 0.05);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(2400, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseLen);

    noise.connect(highpass);
    highpass.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(now + 0.04);
  }

  public playDiyaLight(): void {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const baseFreq = 528;
    [baseFreq, baseFreq * 1.5, baseFreq * 2.02].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18 / (i + 1), now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  public playGiftOpen(): void {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.06 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.85);
    });
  }

  public playClick(): void {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, now);
    osc.frequency.exponentialRampToValueAtTime(392, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const sound = new AudioEngine();
