// The player's saved game. Everything that must survive closing the app lives here:
// progress, completed lessons, the player's avatar and name, character looks and preferences. Unlocked islands
// and rewards are worked out from the completed lessons (see systems/progress.js),
// so they can never disagree with them.
//
// Saved on the device (localStorage). Each write also keeps the previous copy as a
// backup, and a damaged save falls back to that backup instead of losing everything.

const SAVE_KEY = 'sakina.save.v1';
const BACKUP_KEY = 'sakina.save.backup';
const SAVE_VERSION = 4;

const HEX = /^#[0-9a-f]{6}$/i;

export const DEFAULT_LOOKS = {
  raccoon: { fur: '#8f96b3', marks: '#39406a', outfit: 'scarf', outfitColor: '#ff7a66', accessory: 'none' },
  cat: { fur: '#f7ab5e', marks: '#d9722f', outfit: 'none', outfitColor: '#4a6fd6', accessory: 'none' },
};

// The player's own avatar. Each value is the id of an option in data/avatar.js, or a colour.
export const DEFAULT_AVATAR = {
  face: 'round', skin: '#f1c9a5', hair: 'short', hairColor: '#3b2a20', eyes: 'round', mood: 'happy',
  head: 'none', headColor: '#2f93b0', top: 'tshirt', topColor: '#2fbf8f', bottomColor: '#39406a',
  glasses: 'none', pack: 'none', packColor: '#ff7a66', scarf: 'none', scarfColor: '#ffbf3c', extra: 'none',
};

function cleanAvatar(avatar) {
  const out = { ...DEFAULT_AVATAR };
  if (!avatar || typeof avatar !== 'object') return out;
  for (const key of Object.keys(DEFAULT_AVATAR)) {
    const value = avatar[key];
    const isColour = HEX.test(DEFAULT_AVATAR[key]);
    if (isColour ? HEX.test(value) : typeof value === 'string' && /^[a-z0-9-]{1,20}$/.test(value)) out[key] = value;
  }
  return out;
}

export const DEFAULT_SOUND = { on: true, volume: 0.7, answers: true, rewards: true, ui: true };

// Things that cannot be worked out from the list of finished lessons.
const DEFAULT_COUNTERS = {
  played: 0, // lessons completed, reviews included
  reviews: 0, // finished lessons played again
  correct: 0, // questions answered correctly
  perfectRun: 0, // 3-star lessons in a row, right now
  bestPerfectRun: 0,
  bestStreak: 0, // longest run of days in a row
  days: 0, // days with at least one finished lesson
  dawn: 0, // lessons finished between 4 and 8 in the morning
  friday: 0, // lessons finished on a Friday
  comeback: 0, // returns after a week or more away
};

function defaultChallenges() {
  return {
    daily: { key: null, base: {}, done: [] }, // key = the day these belong to
    weekly: { key: null, base: {}, done: [], region: null }, // key = the Saturday the week began
    special: {}, // challenge id -> date completed
    counts: {}, // challenge id -> times completed (this is what medals are earned from)
    totals: { daily: 0, weekly: 0, fullDays: 0 },
    fullDayKey: null,
  };
}

const count = (value) => (Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);
const dateMap = (map) => Object.fromEntries(Object.entries(map ?? {}).filter(([id, date]) => /^[\w:.-]{1,40}$/.test(id) && typeof date === 'string'));
const numberMap = (map) => Object.fromEntries(Object.entries(map ?? {}).filter(([id]) => /^[\w:.*-]{1,40}$/.test(id)).map(([id, n]) => [id, count(n)]));
const idList = (list) => (Array.isArray(list) ? list.filter((id) => typeof id === 'string').slice(0, 20) : []);

function cleanChallenges(saved) {
  const base = defaultChallenges();
  if (!saved || typeof saved !== 'object') return base;
  const period = (p) => ({ key: typeof p?.key === 'string' ? p.key : null, base: numberMap(p?.base), done: idList(p?.done) });
  return {
    daily: period(saved.daily),
    weekly: { ...period(saved.weekly), region: typeof saved.weekly?.region === 'string' ? saved.weekly.region : null },
    special: dateMap(saved.special),
    counts: numberMap(saved.counts),
    totals: { daily: count(saved.totals?.daily), weekly: count(saved.totals?.weekly), fullDays: count(saved.totals?.fullDays) },
    fullDayKey: typeof saved.fullDayKey === 'string' ? saved.fullDayKey : null,
  };
}

function defaultSave() {
  return {
    version: SAVE_VERSION,
    prefs: {
      lang: null, // null = follow the device language until the player chooses
      motion: 'full', // 'full' | 'reduced'
      haptics: true,
      sound: { ...DEFAULT_SOUND },
    },
    lessons: {}, // lessonId -> { stars: 1..3, completedAt: ISO date }
    activeDays: [], // 'YYYY-MM-DD' strings, most recent last
    characters: structuredClone(DEFAULT_LOOKS),
    previousCharacters: null, // the look before the last "Save look", for "Restore"
    partyAt: null, // id of the island where the player and friends are standing
    regionAt: null, // id of the region shown on the map
    profile: { name: '' }, // the player's chosen name
    avatar: { ...DEFAULT_AVATAR },
    inProgress: null, // an unfinished lesson: { lessonId, position, right, retries: [step numbers] }
    counters: { ...DEFAULT_COUNTERS },
    bonusXp: 0, // XP given by challenges and achievements (lesson XP is worked out from `lessons`)
    earned: { achievements: {}, medals: {} }, // id -> date earned; an entry is never removed
    challenges: defaultChallenges(),
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

function cleanProgress(p) {
  if (!p || typeof p.lessonId !== 'string' || !Number.isInteger(p.position) || p.position < 0) return null;
  return {
    lessonId: p.lessonId,
    position: p.position,
    right: Number.isInteger(p.right) ? p.right : 0,
    retries: Array.isArray(p.retries) ? p.retries.filter(Number.isInteger).slice(0, 30) : [],
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
  const sound = { ...DEFAULT_SOUND, ...(typeof prefs.sound === 'object' && prefs.sound ? prefs.sound : {}) };
  prefs.sound = {
    on: sound.on !== false,
    volume: Number.isFinite(sound.volume) ? Math.min(1, Math.max(0, sound.volume)) : DEFAULT_SOUND.volume,
    answers: sound.answers !== false, rewards: sound.rewards !== false, ui: sound.ui !== false,
  };

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
    regionAt: typeof saved.regionAt === 'string' ? saved.regionAt : null,
    profile: { name: typeof saved.profile?.name === 'string' ? saved.profile.name.slice(0, 24) : '' },
    avatar: cleanAvatar(saved.avatar),
    inProgress: cleanProgress(saved.inProgress),
    // Saves from before achievements existed start their counters from what is known.
    counters: Object.fromEntries(Object.keys(DEFAULT_COUNTERS).map((key) => [key, count(saved.counters?.[key])
      || (saved.counters ? 0 : key === 'played' ? Object.keys(lessons).length : key === 'days' ? (saved.activeDays?.length ?? 0) : 0)])),
    bonusXp: count(saved.bonusXp),
    earned: { achievements: dateMap(saved.earned?.achievements), medals: dateMap(saved.earned?.medals) },
    challenges: cleanChallenges(saved.challenges),
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

  /** Erase progress and looks. Preferences, the player's name and avatar are kept. */
  reset() {
    state = { ...defaultSave(), prefs: state.prefs, profile: state.profile, avatar: state.avatar };
    persist();
    listeners.forEach((fn) => fn(state));
  },
};
