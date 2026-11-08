class DiwaliAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private fuseGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : this.volume * 0.25, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
    }
  }

  public playDiyaLight() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(880, t);
    bellOsc.frequency.exponentialRampToValueAtTime(440, t + 1.2);
    bellGain.gain.setValueAtTime(this.volume * 0.35, t);
    bellGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    bellOsc.connect(bellGain);
    bellGain.connect(this.ctx.destination);
    bellOsc.start(t);
    bellOsc.stop(t + 1.2);

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.linearRampToValueAtTime(900, t + 0.15);
    filter.frequency.linearRampToValueAtTime(200, t + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  public startFuseBurn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.85 ? 1 : 0.2);
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const bqFilter = this.ctx.createBiquadFilter();
    bqFilter.type = 'bandpass';
    bqFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
    bqFilter.Q.setValueAtTime(3, this.ctx.currentTime);

    this.fuseGain = this.ctx.createGain();
    this.fuseGain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);

    noiseSource.connect(bqFilter);
    bqFilter.connect(this.fuseGain);
    this.fuseGain.connect(this.ctx.destination);

    noiseSource.start();
    (this as unknown as { _fuseSource: AudioBufferSourceNode })._fuseSource = noiseSource;
  }

  public stopFuseBurn() {
    try {
      const source = (this as unknown as { _fuseSource?: AudioBufferSourceNode })._fuseSource;
      if (source && this.ctx) {
        if (this.fuseGain) {
          this.fuseGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
        }
        setTimeout(() => {
          source.stop();
          (this as unknown as { _fuseSource?: AudioBufferSourceNode })._fuseSource = undefined;
        }, 120);
      }
    } catch {}
  }

  public playRocketLaunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = 'sawtooth';
    whistle.frequency.setValueAtTime(300, t);
    whistle.frequency.exponentialRampToValueAtTime(2400, t + 1.2);
    whistle.frequency.exponentialRampToValueAtTime(4200, t + 2.0);

    whistleGain.gain.setValueAtTime(0.01, t);
    whistleGain.gain.linearRampToValueAtTime(this.volume * 0.45, t + 0.3);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

    whistle.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);
    whistle.start(t);
    whistle.stop(t + 2.2);

    const bufferSize = this.ctx.sampleRate * 2.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.8;
    }
    const roar = this.ctx.createBufferSource();
    roar.buffer = buffer;

    const roarFilter = this.ctx.createBiquadFilter();
    roarFilter.type = 'lowpass';
    roarFilter.frequency.setValueAtTime(150, t);
    roarFilter.frequency.exponentialRampToValueAtTime(1200, t + 1.0);
    roarFilter.frequency.exponentialRampToValueAtTime(300, t + 2.2);

    const roarGain = this.ctx.createGain();
    roarGain.gain.setValueAtTime(0.01, t);
    roarGain.gain.linearRampToValueAtTime(this.volume * 0.65, t + 0.4);
    roarGain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

    roar.connect(roarFilter);
    roarFilter.connect(roarGain);
    roarGain.connect(this.ctx.destination);
    roar.start(t);
  }

  public playFireworkExplosion(intensity: 'grand' | 'medium' | 'small' = 'grand') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const mult = intensity === 'grand' ? 1.0 : intensity === 'medium' ? 0.7 : 0.45;

    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(130, t);
    bassOsc.frequency.exponentialRampToValueAtTime(32, t + 0.8);

    bassGain.gain.setValueAtTime(this.volume * mult * 0.85, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    bassOsc.connect(bassGain);
    bassGain.connect(this.ctx.destination);
    bassOsc.start(t);
    bassOsc.stop(t + 1.2);

    const blastBufferSize = this.ctx.sampleRate * 0.5;
    const blastBuffer = this.ctx.createBuffer(1, blastBufferSize, this.ctx.sampleRate);
    const blastData = blastBuffer.getChannelData(0);
    for (let i = 0; i < blastBufferSize; i++) {
      blastData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }
    const blastSource = this.ctx.createBufferSource();
    blastSource.buffer = blastBuffer;
    const blastFilter = this.ctx.createBiquadFilter();
    blastFilter.type = 'lowpass';
    blastFilter.frequency.setValueAtTime(800, t);

    const blastGain = this.ctx.createGain();
    blastGain.gain.setValueAtTime(this.volume * mult * 0.7, t);
    blastGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    blastSource.connect(blastFilter);
    blastFilter.connect(blastGain);
    blastGain.connect(this.ctx.destination);
    blastSource.start(t);

    const crackleDuration = intensity === 'grand' ? 2.5 : 1.5;
    const crackleBufferSize = Math.floor(this.ctx.sampleRate * crackleDuration);
    const crackleBuffer = this.ctx.createBuffer(1, crackleBufferSize, this.ctx.sampleRate);
    const crackleData = crackleBuffer.getChannelData(0);
    for (let i = 0; i < crackleBufferSize; i++) {
      const decay = 1 - (i / crackleBufferSize);
      const isPop = Math.random() > (0.97 - 0.02 * decay);
      crackleData[i] = isPop ? (Math.random() * 2 - 1) * decay : (Math.random() * 2 - 1) * 0.04 * decay;
    }
    const crackleSource = this.ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;

    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'highpass';
    crackleFilter.frequency.setValueAtTime(1400, t + 0.15);

    const crackleGain = this.ctx.createGain();
    crackleGain.gain.setValueAtTime(0.001, t);
    crackleGain.gain.linearRampToValueAtTime(this.volume * mult * 0.5, t + 0.2);
    crackleGain.gain.exponentialRampToValueAtTime(0.0001, t + crackleDuration);

    crackleSource.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.ctx.destination);
    crackleSource.start(t + 0.1);
  }

  public playLanternRelease() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.09);
      gain.gain.setValueAtTime(0.001, t + idx * 0.09);
      gain.gain.linearRampToValueAtTime(this.volume * 0.2, t + idx * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.09);
      osc.stop(t + idx * 0.09 + 1.4);
    });
  }

  public playGiftOpen() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);
      gain.gain.setValueAtTime(0.01, t + i * 0.07);
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, t + i * 0.07 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 1.2);
    });
  }

  public playAllDiyasLit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const chords = [
      [220, 440, 660, 880],
      [277.18, 554.37, 830.61, 1108.73],
      [329.63, 659.25, 987.77, 1318.51]
    ];
    chords.forEach((chord, step) => {
      chord.forEach((f) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + step * 0.35);
        gain.gain.setValueAtTime(0.001, t + step * 0.35);
        gain.gain.linearRampToValueAtTime(this.volume * 0.2, t + step * 0.35 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + step * 0.35 + 2.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + step * 0.35);
        osc.stop(t + step * 0.35 + 2.8);
      });
    });
  }

  public startAmbient() {
    if (this.isAmbientPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.2, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    const freqs = [73.42, 110, 146.83, 220];
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f + (Math.random() * 0.5 - 0.25), this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15 + i * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      oscGain.gain.setValueAtTime(0.12 / (i + 1), this.ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.ambientGain);
      osc.start();
    });

    this.isAmbientPlaying = true;
  }
}

export const audioManager = new DiwaliAudioManager();
