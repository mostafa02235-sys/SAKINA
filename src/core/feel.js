// How the app feels in the hand: motion preference and small vibrations.

import { store } from './store.js';

/** True when animations should be kept to a minimum. */
export function reducedMotion() {
  return store.get().prefs.motion === 'reduced'
    || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/** Tell the stylesheet about the player's motion preference. */
export function applyMotionPreference() {
  document.documentElement.dataset.motion = store.get().prefs.motion;
}

const PATTERNS = { tap: 12, right: 30, wrong: [35, 60, 35], reward: [20, 40, 20, 40, 60] };

/** A short vibration, if the player allows it and the device can do it. */
export function buzz(kind = 'tap') {
  if (!store.get().prefs.haptics) return;
  try {
    navigator.vibrate?.(PATTERNS[kind] ?? PATTERNS.tap);
  } catch {
    // Vibration is a nicety; never let it interrupt the app.
  }
}
