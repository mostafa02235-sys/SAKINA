// The player's saved game. Everything that must survive closing the app lives here:
// progress, completed lessons, character looks and preferences. Unlocked islands
// and rewards are worked out from the completed lessons (see systems/progress.js),
// so they can never disagree with them.
//
// Saved on the device (localStorage). Each write also keeps the previous copy as a
// backup, and a damaged save falls back to that backup instead of losing everything.

const SAVE_KEY = 'sakina.save.v1';
const BACKUP_KEY = 'sakina.save.backup';
const SAVE_VERSION = 2;

const HEX = /^#[0-9a-f]{6}$/i;

export const DEFAULT_LOOKS = {
  raccoon: { fur: '#8f96b3', marks: '#39406a', outfit: 'scarf', outfitColor: '#ff7a66', accessory: 'none' },
  cat: { fur: '#f7ab5e', marks: '#d9722f', outfit: 'none', outfitColor: '#4a6fd6', accessory: 'none' },
};

function defaultSave() {
  return {
    version: SAVE_VERSION,
    prefs: {
      lang: null, // null = follow the device language until the player chooses
      motion: 'full', // 'full' | 'reduced'
      haptics: true,
    },
    lessons: {}, // lessonId -> { stars: 1..3, completedAt: ISO date }
    activeDays: [], // 'YYYY-MM-DD' strings, most recent last
    characters: structuredClone(DEFAULT_LOOKS),
    previousCharacters: null, // the look before the last "Save look", for "Restore"
    partyAt: null, // id of the island where Zad and Lulu are standing
  };
}

function cleanLook(look, fallback) {
  const out = { ...fallback };
  if (!look || typeof look !== 'object') return out;
  for (const key of ['fur', 'marks', 'outfitColor']) if (HEX.test(look[key])) out[key] = look[key];
  for (const key of ['outfit', 'accessory']) if (typeof look[key] === 'string') out[key] = look[key];
  return out;
}

function cleanLooks(looks) {
  return {
    raccoon: cleanLook(looks?.raccoon, DEFAULT_LOOKS.raccoon),
    cat: cleanLook(looks?.cat, DEFAULT_LOOKS.cat),
  };
}

/** Turn whatever was stored (any older version, possibly incomplete) into a valid save. */
function normalise(saved) {
  const base = defaultSave();
  if (!saved || typeof saved !== 'object') return base;

  const prefs = { ...base.prefs, ...(saved.prefs ?? {}) };
  if (saved.lang && !saved.prefs) prefs.lang = saved.lang; // version 1 kept the language at the top level
  if (!['ar', 'en', null].includes(prefs.lang)) prefs.lang = null;
  if (!['full', 'reduced'].includes(prefs.motion)) prefs.motion = 'full';
  prefs.haptics = prefs.haptics !== false;

  const lessons = {};
  for (const [id, entry] of Object.entries(saved.lessons ?? {})) {
    const stars = Math.round(Number(entry?.stars));
    if (stars >= 1 && stars <= 3) lessons[id] = { stars, completedAt: entry.completedAt ?? null };
  }

  return {
    version: SAVE_VERSION,
    prefs,
    lessons,
    activeDays: Array.isArray(saved.activeDays) ? saved.activeDays.filter((d) => typeof d === 'string').slice(-60) : [],
    characters: cleanLooks(saved.characters),
    previousCharacters: saved.previousCharacters ? cleanLooks(saved.previousCharacters) : null,
    partyAt: typeof saved.partyAt === 'string' ? saved.partyAt : null,
  };
}

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return undefined; // unreadable or damaged
  }
}

function load() {
  const main = read(SAVE_KEY);
  if (main) return normalise(main);
  if (main === undefined) {
    const backup = read(BACKUP_KEY);
    if (backup) return normalise(backup);
  }
  return defaultSave();
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    const previous = localStorage.getItem(SAVE_KEY);
    if (previous) localStorage.setItem(BACKUP_KEY, previous);
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable or full. The app still works for this visit.
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

  /** Erase progress and looks. Preferences (language, motion) are kept. */
  reset() {
    state = { ...defaultSave(), prefs: state.prefs };
    persist();
    listeners.forEach((fn) => fn(state));
  },
};
