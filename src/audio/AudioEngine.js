class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.ambientGain = null;
    this.ambientNodes = [];
    this.volume = 0.55;
    this.muted = false;
    this.started = false;
    this.stepToggle = false;
    this.noiseBuffer = null;
  }

  async start() {
    if (this.started) {
      if (this.ctx?.state === 'suspended') await this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
      await this.ctx.resume();
      this.started = true;
      this.noiseBuffer = this.createNoiseBuffer(2);
      this.buildAmbient();
    } catch (error) {
      console.warn('Audio could not start', error);
    }
  }

  createNoiseBuffer(seconds) {
    const rate = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, rate * seconds, rate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    return buffer;
  }

  buildAmbient() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.0;
    ambientGain.connect(this.master);
    ambientGain.gain.setTargetAtTime(0.55, ctx.currentTime, 4);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.6;
    filter.connect(ambientGain);

    const droneA = ctx.createOscillator();
    droneA.type = 'sine';
    droneA.frequency.value = 55;
    const gainA = ctx.createGain();
    gainA.gain.value = 0.055;
    droneA.connect(gainA).connect(filter);

    const droneB = ctx.createOscillator();
    droneB.type = 'sine';
    droneB.frequency.value = 82.62;
    const gainB = ctx.createGain();
    gainB.gain.value = 0.028;
    droneB.connect(gainB).connect(filter);

    const droneC = ctx.createOscillator();
    droneC.type = 'triangle';
    droneC.frequency.value = 110.18;
    const gainC = ctx.createGain();
    gainC.gain.value = 0.012;
    droneC.connect(gainC).connect(filter);

    const slow = ctx.createOscillator();
    slow.type = 'sine';
    slow.frequency.value = 0.045;
    const slowDepth = ctx.createGain();
    slowDepth.gain.value = 0.012;
    slow.connect(slowDepth);
    slowDepth.connect(gainA.gain);

    const air = ctx.createBufferSource();
    air.buffer = this.noiseBuffer;
    air.loop = true;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = 'bandpass';
    airFilter.frequency.value = 620;
    airFilter.Q.value = 0.5;
    const airGain = ctx.createGain();
    airGain.gain.value = 0.045;
    air.connect(airFilter).connect(airGain).connect(ambientGain);

    const airLfo = ctx.createOscillator();
    airLfo.type = 'sine';
    airLfo.frequency.value = 0.07;
    const airLfoDepth = ctx.createGain();
    airLfoDepth.gain.value = 0.02;
    airLfo.connect(airLfoDepth);
    airLfoDepth.connect(airGain.gain);

    [droneA, droneB, droneC, slow, air, airLfo].forEach((node) => node.start());
    this.ambientNodes = [droneA, droneB, droneC, slow, air, airLfo];
    this.ambientGain = ambientGain;
  }

  setVolume(value) {
    this.volume = value;
    if (this.master && this.ctx) {
      const target = this.muted ? 0 : value;
      this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.08);
    }
  }

  tone({ frequency, endFrequency, type = 'sine', duration = 0.15, gain = 0.06, delay = 0 }) {
    if (!this.started || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    if (endFrequency) osc.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(env).connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  noise({ duration = 0.09, gain = 0.05, frequency = 700, q = 0.8, delay = 0 }) {
    if (!this.started || !this.ctx || !this.noiseBuffer) return;
    const ctx = this.ctx;
    const now = ctx.currentTime + delay;
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(gain, now + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter).connect(env).connect(this.master);
    source.start(now);
    source.stop(now + duration + 0.03);
  }

  footstep(running = false) {
    if (!this.started) return;
    this.stepToggle = !this.stepToggle;
    const base = running ? 520 : 390;
    this.noise({
      duration: running ? 0.075 : 0.09,
      gain: running ? 0.055 : 0.04,
      frequency: this.stepToggle ? base * 1.18 : base,
      q: 1.1,
    });
    this.tone({
      frequency: this.stepToggle ? 84 : 72,
      endFrequency: 48,
      type: 'sine',
      duration: 0.09,
      gain: running ? 0.035 : 0.024,
    });
  }

  hover() {
    this.tone({ frequency: 1240, endFrequency: 1480, duration: 0.07, gain: 0.022 });
  }

  interact() {
    this.tone({ frequency: 620, endFrequency: 980, duration: 0.13, gain: 0.05 });
    this.tone({ frequency: 1240, duration: 0.18, gain: 0.024, delay: 0.04 });
  }

  click() {
    this.tone({ frequency: 440, endFrequency: 520, duration: 0.06, gain: 0.03 });
  }

  panelOpen() {
    this.tone({
      frequency: 380,
      endFrequency: 940,
      type: 'triangle',
      duration: 0.24,
      gain: 0.045,
    });
    this.tone({ frequency: 1560, duration: 0.3, gain: 0.016, delay: 0.08 });
  }

  panelClose() {
    this.tone({ frequency: 760, endFrequency: 320, type: 'triangle', duration: 0.2, gain: 0.035 });
  }

  jump() {
    this.tone({ frequency: 190, endFrequency: 330, type: 'sine', duration: 0.16, gain: 0.035 });
  }

  land() {
    this.noise({ duration: 0.12, gain: 0.045, frequency: 280, q: 0.9 });
  }
}

export const audioEngine = new AudioEngine();
