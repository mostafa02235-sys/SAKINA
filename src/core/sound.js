// SAKINA's sound effects. Every sound is made here from a few soft notes
// (Web Audio), so there are no sound files and nothing borrowed from elsewhere.
//
//   play('correct')
//
// Sounds belong to a category the player can switch off in Settings:
//   answers — right and wrong answers
//   rewards — lessons, XP, islands, levels, achievements, medals, challenges
//   ui      — moving between screens

import { store } from './store.js';

// A note: frequency (Hz), start (s), length (s), wave shape, loudness 0..1
const n = (f, t, d, type = 'sine', g = 1) => ({ f, t, d, type, g });

// Note frequencies
const C5 = 523.25; const D5 = 587.33; const E5 = 659.25; const G5 = 783.99; const A5 = 880; const B5 = 987.77;
const C6 = 1046.5; const E6 = 1318.5; const G6 = 1568; const E4 = 329.63; const D4 = 293.66; const G4 = 392;

export const SOUNDS = {
  // A bright two-note "ding".
  correct: { cat: 'answers', notes: [n(E5, 0, 0.14, 'triangle'), n(B5, 0.1, 0.26, 'triangle')] },
  // Two low, soft notes stepping down: a gentle "not quite", never a buzzer.
  wrong: { cat: 'answers', notes: [n(E4, 0, 0.2, 'sine', 0.55), n(D4, 0.15, 0.3, 'sine', 0.45)] },

  xp: { cat: 'rewards', notes: [n(G5, 0, 0.08, 'triangle', 0.7), n(C6, 0.07, 0.16, 'triangle', 0.7)] },
  lesson: { cat: 'rewards', notes: [n(C5, 0, 0.14, 'triangle'), n(E5, 0.12, 0.14, 'triangle'), n(G5, 0.24, 0.14, 'triangle'), n(C6, 0.36, 0.4, 'triangle')] },
  island: { cat: 'rewards', notes: [n(G4, 0, 0.18, 'sine'), n(C5, 0.14, 0.18, 'sine'), n(E5, 0.28, 0.18, 'sine'), n(G5, 0.42, 0.18, 'sine'), n(C6, 0.56, 0.5, 'triangle')] },
  level: { cat: 'rewards', notes: [n(C5, 0, 0.1, 'triangle'), n(G5, 0.1, 0.1, 'triangle'), n(C6, 0.2, 0.12, 'triangle'), n(E6, 0.32, 0.12, 'triangle'), n(G6, 0.44, 0.5, 'sine', 0.8)] },
  achievement: { cat: 'rewards', notes: [n(E5, 0, 0.12, 'triangle'), n(A5, 0.11, 0.12, 'triangle'), n(E6, 0.22, 0.45, 'sine', 0.9)] },
  medal: { cat: 'rewards', notes: [n(C6, 0, 0.5, 'sine', 0.8), n(E6, 0.06, 0.5, 'sine', 0.7), n(G6, 0.12, 0.7, 'sine', 0.6)] },
  challenge: { cat: 'rewards', notes: [n(D5, 0, 0.1, 'triangle'), n(D5, 0.12, 0.1, 'triangle'), n(A5, 0.24, 0.14, 'triangle'), n(D5 * 2, 0.38, 0.45, 'triangle')] },

  nav: { cat: 'ui', notes: [n(A5, 0, 0.07, 'sine', 0.35)] },
};

/** The last few sounds played (newest last). Used by the automatic tests. */
export const played = [];

let context = null;
function audio() {
  if (!context) {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return null;
    context = new Audio();
  }
  if (context.state === 'suspended') context.resume().catch(() => {});
  return context;
}

/** Browsers only allow sound after a touch; call this on the first one. */
export function unlockSound() {
  audio();
}

/**
 * Play a sound if the player's settings allow it.
 * @param {object} [options]  preview: true plays it even when its category is off (used by Settings)
 * @returns {boolean} whether a sound was started
 */
export function play(name, { preview = false } = {}) {
  const sound = SOUNDS[name];
  const prefs = store.get().prefs.sound;
  if (!sound || prefs.volume <= 0) return false;
  if (!preview && (!prefs.on || !prefs[sound.cat])) return false;

  played.push(name);
  if (played.length > 30) played.shift();

  try {
    const ac = audio();
    if (!ac) return false;
    const now = ac.currentTime + 0.02;
    const master = ac.createGain();
    master.gain.value = prefs.volume * 0.3;
    master.connect(ac.destination);
    for (const note of sound.notes) {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = note.type;
      osc.frequency.value = note.f;
      // A quick fade in and a long fade out keeps every note soft, with no clicks.
      gain.gain.setValueAtTime(0.0001, now + note.t);
      gain.gain.linearRampToValueAtTime(note.g, now + note.t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.05);
    }
  } catch {
    // Sound is never essential: every sound also has something to see on screen.
    return false;
  }
  return true;
}
