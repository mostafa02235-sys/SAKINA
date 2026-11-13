// The rules of progression: what is unlocked, how stars and XP are earned,
// and levels. (Achievements, medals and challenges are in systems/rewards.js.) Screens ask these functions; they never
// work it out themselves.
//
// Everything here is worked out from the list of completed lessons in the save,
// so XP, levels, badges and unlocks can only come from finishing lessons.

import { store } from '../core/store.js';
import { ISLANDS, REGIONS, findLesson, totalLessons } from '../data/islands.js';

export const MAX_STARS_PER_LESSON = 3;
const XP_PER_LESSON = 10;
const XP_PER_STAR = 5;
const XP_PER_ISLAND = 100;

export function lessonStars(lessonId, save = store.get()) {
  return save.lessons[lessonId]?.stars ?? 0;
}

export function islandProgress(island, save = store.get()) {
  let done = 0;
  let stars = 0;
  for (const id of island.ids) {
    const s = save.lessons[id]?.stars ?? 0;
    if (s > 0) done += 1;
    stars += s;
  }
  return { done, total: island.ids.length, stars, maxStars: island.ids.length * MAX_STARS_PER_LESSON };
}

const isDone = (island, save) => island.ids.every((id) => (save.lessons[id]?.stars ?? 0) > 0);

/** A region opens when the first island of the region before it is finished. */
export function regionUnlocked(region, save = store.get()) {
  if (region.index === 0) return true;
  return isDone(REGIONS[region.index - 1].islands[0], save);
}

/** 'locked' | 'open' | 'done' — islands of a region open one after another. */
export function islandStatus(island, save = store.get()) {
  if (isDone(island, save)) return 'done';
  if (!regionUnlocked(island.region, save)) return 'locked';
  const previous = island.region.islands[island.place - 1];
  return !previous || isDone(previous, save) ? 'open' : 'locked';
}

/** 'locked' | 'open' | 'done' — lessons open one after another. */
export function lessonStatus(island, index, save = store.get()) {
  if (lessonStars(island.ids[index], save) > 0) return 'done';
  if (islandStatus(island, save) === 'locked') return 'locked';
  return index === 0 || lessonStars(island.ids[index - 1], save) > 0 ? 'open' : 'locked';
}

function firstOpenLesson(island, save) {
  if (islandStatus(island, save) !== 'open') return null;
  const index = island.ids.findIndex((id) => (save.lessons[id]?.stars ?? 0) === 0);
  return index === -1 ? null : { island, index, lessonId: island.ids[index] };
}

/** The lesson the player should do next: on their island if possible, otherwise the first open one. */
export function nextUp(save = store.get()) {
  const here = ISLANDS.find((island) => island.id === save.partyAt);
  if (here) {
    const next = firstOpenLesson(here, save);
    if (next) return next;
    // Just finished this island: carry on with the next one in the same region.
    const following = here.region.islands[here.place + 1];
    if (following) {
      const after = firstOpenLesson(following, save);
      if (after) return after;
    }
  }
  for (const island of ISLANDS) {
    const next = firstOpenLesson(island, save);
    if (next) return next;
  }
  return null;
}

/** Stars for a finished lesson, from how many questions were right first time. */
export function starsForScore(firstTryCorrect, questionCount) {
  if (questionCount === 0 || firstTryCorrect === questionCount) return 3;
  return firstTryCorrect >= Math.ceil(questionCount / 2) ? 2 : 1;
}

/* ---------- Totals (worked out once per save) ---------- */

const cache = new WeakMap();

/** Everything countable about a save: lessons, stars, islands, worlds, XP. */
export function stats(save = store.get()) {
  if (cache.has(save)) return cache.get(save);
  let lessons = 0;
  let stars = 0;
  let perfect = 0;
  let islands = 0;
  let explored = 0;
  let perfectIslands = 0;
  let lessonXp = 0;
  const regions = [];
  for (const region of REGIONS) {
    let regionDone = 0;
    let regionLessons = 0;
    for (const island of region.islands) {
      let done = 0;
      let threes = 0;
      for (const id of island.ids) {
        const s = save.lessons[id]?.stars ?? 0;
        if (!s) continue;
        done += 1;
        stars += s;
        if (s === 3) threes += 1;
        lessonXp += XP_PER_LESSON + XP_PER_STAR * s;
      }
      regionLessons += done;
      perfect += threes;
      if (done > 0) explored += 1;
      if (done === island.ids.length) {
        regionDone += 1;
        lessonXp += XP_PER_ISLAND;
        if (threes === done) perfectIslands += 1;
      }
    }
    lessons += regionLessons;
    islands += regionDone;
    regions.push({ region, done: regionDone, total: region.islands.length, lessons: regionLessons });
  }
  const result = {
    lessons, stars, perfect, islands, explored, perfectIslands, regions,
    lessonXp, // XP from finished lessons and islands
    xp: lessonXp + (save.bonusXp ?? 0), // plus XP given by challenges and achievements
    regionsDone: regions.filter((r) => r.done === r.total).length,
    regionsOpen: REGIONS.filter((region) => regionUnlocked(region, save)).length,
    regionsTouched: regions.filter((r) => r.lessons > 0).length,
    totalLessons: totalLessons(), totalIslands: ISLANDS.length,
    percent: Math.floor((lessons / Math.max(1, totalLessons())) * 100),
    streak: dayStreak(save),
  };
  cache.set(save, result);
  return result;
}

export function totalStars(save = store.get()) {
  return stats(save).stars;
}

/* ---------- Levels ---------- */

// Level n starts at 50·n·(n−1) XP: 0, 100, 300, 600, 1000 … so levels keep coming
// through all 230+ islands without needing a table.
const xpForLevel = (n) => 50 * n * (n - 1);

const RANKS = [
  { from: 1, name: { ar: 'مسافر جديد', en: 'New traveller' } },
  { from: 3, name: { ar: 'مستكشف', en: 'Explorer' } },
  { from: 6, name: { ar: 'طالب علم', en: 'Seeker of knowledge' } },
  { from: 10, name: { ar: 'رفيق القرآن', en: 'Companion of the Qur\'an' } },
  { from: 16, name: { ar: 'حارس الجزر', en: 'Keeper of the islands' } },
  { from: 24, name: { ar: 'نجم سكينة', en: 'Star of SAKINA' } },
];

export function level(save = store.get()) {
  const { xp } = stats(save);
  let number = 1;
  while (xpForLevel(number + 1) <= xp) number += 1;
  const start = xpForLevel(number);
  const next = xpForLevel(number + 1);
  const rank = [...RANKS].reverse().find((r) => number >= r.from);
  return { number, name: rank.name, xp, start, next, toNext: next - xp, percent: Math.round(((xp - start) / (next - start)) * 100) };
}

/* ---------- Unlockable items ---------- */

/**
 * Is an item available to the player?
 * Wardrobe items for the two friends unlock with stars, avatar items with levels,
 * and prize items with the achievement or medal that gives them (`need`).
 */
export function isItemUnlocked(item, save = store.get()) {
  if (item.need) return Boolean(save.earned[item.need.kind]?.[item.need.id]);
  if (item.level) return level(save).number >= item.level;
  return stats(save).stars >= (item.stars ?? 0);
}

/* ---------- Days ---------- */

export function dayKey(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Number of days in a row (ending today or yesterday) with a finished lesson. */
export function dayStreak(save = store.get()) {
  const days = new Set(save.activeDays);
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (days.has(dayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

/* ---------- Finishing a lesson ---------- */

const DAY_MS = 86400000;

/**
 * Record a finished lesson. Keeps the player's best star count and updates the
 * counters that achievements and challenges are measured from.
 * Returns what changed so the lesson screen can celebrate it.
 */
export function completeLesson(lessonId, stars) {
  const before = store.get();
  const { island } = findLesson(lessonId);
  const was = { xp: stats(before).lessonXp, islandDone: isDone(island, before), lessonDone: lessonStars(lessonId, before) > 0 };
  const wasOpen = new Set(ISLANDS.filter((i) => islandStatus(i, before) !== 'locked').map((i) => i.id));
  const regionsOpen = new Set(REGIONS.filter((r) => regionUnlocked(r, before)).map((r) => r.id));

  store.update((save) => {
    const now = new Date();
    const today = dayKey(now);
    const best = Math.max(stars, save.lessons[lessonId]?.stars ?? 0);
    save.lessons[lessonId] = { stars: best, completedAt: now.toISOString() };

    const c = save.counters;
    c.played += 1;
    if (was.lessonDone) c.reviews += 1;
    c.perfectRun = stars === 3 ? c.perfectRun + 1 : 0;
    c.bestPerfectRun = Math.max(c.bestPerfectRun, c.perfectRun);
    if (now.getHours() >= 4 && now.getHours() < 8) c.dawn += 1;
    if (now.getDay() === 5) c.friday += 1;

    if (!save.activeDays.includes(today)) {
      const last = save.activeDays[save.activeDays.length - 1];
      if (last && (new Date(`${today}T00:00`) - new Date(`${last}T00:00`)) / DAY_MS >= 7) c.comeback += 1;
      save.activeDays.push(today);
      c.days += 1;
    }
    save.activeDays = save.activeDays.slice(-60);
    c.bestStreak = Math.max(c.bestStreak, dayStreak(save));
    save.inProgress = null;
  });

  const after = store.get();
  const islandFinished = !was.islandDone && isDone(island, after);
  return {
    stars,
    review: was.lessonDone,
    xp: stats(after).lessonXp - was.xp,
    islandFinished,
    unlockedIsland: islandFinished ? ISLANDS.find((i) => !wasOpen.has(i.id) && i.region === island.region && islandStatus(i, after) === 'open') ?? null : null,
    unlockedRegion: islandFinished ? REGIONS.find((r) => !regionsOpen.has(r.id) && regionUnlocked(r, after)) ?? null : null,
  };
}
