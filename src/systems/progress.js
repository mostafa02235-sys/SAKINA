// The rules of progression: what is unlocked, how stars are earned,
// and what the player's level is. Screens ask these functions; they never
// work it out themselves.

import { store } from '../core/store.js';
import { ISLANDS, findLesson } from '../data/islands.js';
import { REWARDS } from '../data/wardrobe.js';

export const MAX_STARS_PER_LESSON = 3;

export function lessonStars(lessonId, save = store.get()) {
  return save.lessons[lessonId]?.stars ?? 0;
}

export function totalStars(save = store.get()) {
  return Object.values(save.lessons).reduce((sum, entry) => sum + entry.stars, 0);
}

export function islandProgress(island, save = store.get()) {
  const done = island.lessons.filter((lesson) => lessonStars(lesson.id, save) > 0).length;
  const stars = island.lessons.reduce((sum, lesson) => sum + lessonStars(lesson.id, save), 0);
  return { done, total: island.lessons.length, stars, maxStars: island.lessons.length * MAX_STARS_PER_LESSON };
}

/** 'planned' | 'locked' | 'open' | 'done' */
export function islandStatus(island, save = store.get()) {
  if (island.planned) return 'planned';
  const index = ISLANDS.indexOf(island);
  const previous = ISLANDS[index - 1];
  if (previous) {
    const before = islandProgress(previous, save);
    if (before.done < before.total) return 'locked';
  }
  const now = islandProgress(island, save);
  return now.done === now.total ? 'done' : 'open';
}

/** 'locked' | 'open' | 'done' — lessons open one after another. */
export function lessonStatus(island, index, save = store.get()) {
  if (islandStatus(island, save) === 'locked') return 'locked';
  if (lessonStars(island.lessons[index].id, save) > 0) return 'done';
  const previous = island.lessons[index - 1];
  return !previous || lessonStars(previous.id, save) > 0 ? 'open' : 'locked';
}

/** The island and lesson the player should do next, or null when everything is finished. */
export function nextUp(save = store.get()) {
  for (const island of ISLANDS) {
    if (island.planned) continue;
    const index = island.lessons.findIndex((_, i) => lessonStatus(island, i, save) === 'open');
    if (index !== -1) return { island, lesson: island.lessons[index], index };
  }
  return null;
}

/** The island where Zad and Lulu are standing on the world map. */
export function currentIsland(save = store.get()) {
  const next = nextUp(save);
  if (next) return next.island;
  const available = ISLANDS.filter((island) => !island.planned);
  return available[available.length - 1];
}

/** Stars for a finished lesson, from how many questions were right first time. */
export function starsForScore(firstTryCorrect, questionCount) {
  if (questionCount === 0 || firstTryCorrect === questionCount) return 3;
  return firstTryCorrect >= Math.ceil(questionCount / 2) ? 2 : 1;
}

export function isItemUnlocked(item, save = store.get()) {
  return totalStars(save) >= item.stars;
}

const LEVELS = [
  { stars: 0, name: { ar: 'مسافر جديد', en: 'New traveller' } },
  { stars: 3, name: { ar: 'مستكشف', en: 'Explorer' } },
  { stars: 9, name: { ar: 'طالب علم', en: 'Seeker of knowledge' } },
  { stars: 15, name: { ar: 'رفيق القرآن', en: 'Companion of the Qur\'an' } },
];

export function level(save = store.get()) {
  const stars = totalStars(save);
  let index = 0;
  LEVELS.forEach((entry, i) => { if (stars >= entry.stars) index = i; });
  const next = LEVELS[index + 1] ?? null;
  return { number: index + 1, name: LEVELS[index].name, stars, next };
}

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Number of days in a row (ending today or yesterday) with a finished lesson. */
export function dayStreak(save = store.get()) {
  const days = new Set(save.activeDays);
  const cursor = new Date();
  if (!days.has(today())) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  for (;;) {
    const pad = (n) => String(n).padStart(2, '0');
    const key = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())}`;
    if (!days.has(key)) return count;
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
}

/**
 * Record a finished lesson. Keeps the player's best star count.
 * Returns what changed so the lesson screen can celebrate it.
 */
export function completeLesson(lessonId, stars) {
  const before = store.get();
  const found = findLesson(lessonId);
  const starsBefore = totalStars(before);
  const islandWasDone = islandStatus(found.island, before) === 'done';
  const nextIsland = ISLANDS[ISLANDS.indexOf(found.island) + 1];
  const nextWasLocked = nextIsland && islandStatus(nextIsland, before) === 'locked';

  store.update((save) => {
    const best = Math.max(stars, save.lessons[lessonId]?.stars ?? 0);
    save.lessons[lessonId] = { stars: best, completedAt: new Date().toISOString() };
    if (!save.activeDays.includes(today())) save.activeDays.push(today());
    save.activeDays = save.activeDays.slice(-60);
  });

  const after = store.get();
  const starsAfter = totalStars(after);
  const newItems = REWARDS.filter((item) => item.stars > starsBefore && item.stars <= starsAfter);
  const islandFinished = !islandWasDone && islandStatus(found.island, after) === 'done';
  const unlockedIsland = nextWasLocked && islandStatus(nextIsland, after) !== 'locked' ? nextIsland : null;

  return { stars, gained: starsAfter - starsBefore, newItems, islandFinished, unlockedIsland };
}
