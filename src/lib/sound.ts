// Web Audio API Synthesizer for instant, zero-dependency sound effects

const SOUND_STORAGE_KEY = "human_rlhf_sound_enabled";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(SOUND_STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "true" : "false");
}

// 1. Social Credit Sound: Pentatonic bell chime with shimmering gong resonance
export function playSocialCreditSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Pentatonic notes: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + index * 0.08);

    gain.gain.setValueAtTime(0, now + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.6);
  });

  // Gong bass drone
  const gongOsc = ctx.createOscillator();
  const gongGain = ctx.createGain();
  gongOsc.type = "triangle";
  gongOsc.frequency.setValueAtTime(130.81, now); // C3
  gongGain.gain.setValueAtTime(0.3, now);
  gongGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  gongOsc.connect(gongGain);
  gongGain.connect(ctx.destination);
  gongOsc.start(now);
  gongOsc.stop(now + 1.2);
}

// 2. Democracy Sound: Rock power chord and triumphant brass fanfare
export function playDemocracySound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Power chord: E3 (164.8Hz), B3 (246.9Hz), E4 (329.6Hz), G#4 (415.3Hz)
  const freqs = [164.81, 246.94, 329.63, 415.3];

  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now);

    // Distortion filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.9);
  });

  // Trumpet blast on top
  const trumpet = ctx.createOscillator();
  const trumpetGain = ctx.createGain();
  trumpet.type = "square";
  trumpet.frequency.setValueAtTime(659.25, now + 0.15); // E5
  trumpet.frequency.setValueAtTime(830.61, now + 0.35); // G#5
  trumpet.frequency.setValueAtTime(987.77, now + 0.55); // B5
  trumpetGain.gain.setValueAtTime(0, now + 0.15);
  trumpetGain.gain.linearRampToValueAtTime(0.15, now + 0.18);
  trumpetGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

  trumpet.connect(trumpetGain);
  trumpetGain.connect(ctx.destination);
  trumpet.start(now + 0.15);
  trumpet.stop(now + 1.1);
}

// 3. Click feedback sound
export function playClickSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}

// 4. Test Completion Fanfare
export function playFinishSound(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const chords = [
    [523.25, 659.25, 783.99], // C major
    [587.33, 739.99, 880.0],  // D major
    [659.25, 830.61, 987.77], // E major
    [783.99, 987.77, 1174.66, 1318.51] // G major triumphant
  ];

  chords.forEach((chord, i) => {
    const time = now + i * 0.18;
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.5);
    });
  });
}
