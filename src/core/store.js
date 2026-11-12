// The player's saved game. Everything that must survive a reload lives here.
// Saved in the browser (localStorage); swapping this file for a server-backed
// version later would not require changing any screen.

const SAVE_KEY = 'sakina.save.v1';

function defaultSave() {
  return {
    lang: null, // null = follow the device language until the player chooses
    lessons: {}, // lessonId -> { stars: 1..3, completedAt: ISO date }
    activeDays: [], // 'YYYY-MM-DD' strings, most recent last
    characters: {
      raccoon: { fur: '#8f96b3', marks: '#39406a', outfit: 'scarf', outfitColor: '#ff7a66', accessory: 'none' },
      cat: { fur: '#f7ab5e', marks: '#d9722f', outfit: 'none', outfitColor: '#4a6fd6', accessory: 'none' },
    },
  };
}

function load() {
  const base = defaultSave();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    // Merge so that saves from older versions pick up newly added fields.
    return {
      ...base,
      ...saved,
      characters: {
        raccoon: { ...base.characters.raccoon, ...saved.characters?.raccoon },
        cat: { ...base.characters.cat, ...saved.characters?.cat },
      },
    };
  } catch {
    return base;
  }
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode). The app still works for this visit.
  }
}

export const store = {
  get() {
    return state;
  },

  /** Change the save. `change` receives a draft copy to mutate. */
  update(change) {
    const draft = structuredClone(state);
    change(draft);
    state = draft;
    persist();
    listeners.forEach((fn) => fn(state));
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  reset() {
    const lang = state.lang;
    state = { ...defaultSave(), lang };
    persist();
    listeners.forEach((fn) => fn(state));
  },
};
