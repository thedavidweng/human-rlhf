// Three physical sounds, synthesised on demand: a typewriter key, a rubber stamp, a station chime.
// Plus one background track, which follows the same switch.
import { MUSIC } from "../data/music";

const STORAGE_KEY = "human-rlhf:sound";

let ctx: AudioContext | undefined;
let noiseBuffer: AudioBuffer | undefined;

export function readSoundPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

let enabled = readSoundPreference();

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Private mode: the preference just won't persist.
  }
  syncMusic();
}

let music: HTMLAudioElement | undefined;
let musicWanted = false;

/** Call from a click or key press: browsers only let audio start after one. */
export function startMusic() {
  musicWanted = true;
  syncMusic();
}

function syncMusic() {
  if (!musicWanted || !enabled || document.hidden) return music?.pause();
  music ??= Object.assign(new Audio(MUSIC.file), { loop: true, volume: 0.3, preload: "none" });
  void music.play();
}

// A hidden tab goes quiet and picks up where it left off when it comes back.
document.addEventListener("visibilitychange", syncMusic);

function audio(): AudioContext | undefined {
  if (!enabled) return;
  ctx ??= new AudioContext({ latencyHint: "interactive" });
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noise(ac: AudioContext): AudioBufferSourceNode {
  if (!noiseBuffer) {
    noiseBuffer = ac.createBuffer(1, ac.sampleRate * 0.25, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer;
  return src;
}

/** Percussive envelope: near-instant attack, exponential decay. */
function env(ac: AudioContext, at: number, peak: number, decay: number): GainNode {
  const g = ac.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(peak, at + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  g.connect(ac.destination);
  return g;
}

function burst(ac: AudioContext, at: number, filter: BiquadFilterType, freq: number, q: number, peak: number, decay: number) {
  const src = noise(ac);
  const f = ac.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  f.Q.value = q;
  src.connect(f).connect(env(ac, at, peak, decay));
  src.start(at, Math.random() * 0.15, decay + 0.02);
}

function thump(ac: AudioContext, at: number, from: number, to: number, peak: number, decay: number) {
  const osc = ac.createOscillator();
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + decay * 0.6);
  osc.connect(env(ac, at, peak, decay));
  osc.start(at);
  osc.stop(at + decay + 0.02);
}

/** A single typewriter key: bright click over a small wooden body. */
export function playKey() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  burst(ac, t, "bandpass", 3400, 1.4, 0.22, 0.028);
  thump(ac, t, 260, 140, 0.12, 0.05);
}

/** Rubber stamp landing on paper: low thunk, then a soft paper slap. */
export function playStamp() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  thump(ac, t, 150, 52, 0.5, 0.16);
  burst(ac, t, "lowpass", 1100, 0.7, 0.3, 0.07);
  burst(ac, t + 0.012, "bandpass", 2400, 0.9, 0.05, 0.05);
}

/** Two-note public-address chime, the kind that precedes an announcement. */
export function playChime() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  const notes: [number, number][] = [
    [659.25, 0],
    [523.25, 0.45]
  ];
  for (const [freq, offset] of notes) {
    // Bell partials, slightly inharmonic so it rings rather than beeps.
    for (const [ratio, peak, decay] of [
      [1, 0.16, 1.8],
      [2.01, 0.05, 1.1],
      [3.02, 0.02, 0.6]
    ]) {
      const osc = ac.createOscillator();
      osc.frequency.value = freq * ratio;
      const g = ac.createGain();
      const at = t + offset;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(peak, at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
      osc.connect(g).connect(ac.destination);
      osc.start(at);
      osc.stop(at + decay + 0.05);
    }
  }
}
