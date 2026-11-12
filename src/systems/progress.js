// The rules of progression: what is unlocked, how stars and XP are earned,
// levels, and achievement badges. Screens ask these functions; they never
// work it out themselves.
//
// Everything here is worked out from the list of completed lessons in the save,
// so XP, levels, badges and unlocks can only come from finishing lessons.

import { store } from '../core/store.js';
import { ISLANDS, REGIONS, findLesson, totalLessons } from '../data/islands.js';
import { REWARDS } from '../data/wardrobe.js';
import { AVATAR_REWARDS } from '../data/avatar.js';

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

/** Everything countable about a save: lessons, stars, islands, regions, XP. */
export function stats(save = store.get()) {
  if (cache.has(save)) return cache.get(save);
  let lessons = 0;
  let stars = 0;
  let perfect = 0;
  let islands = 0;
  let xp = 0;
  const regions = [];
  for (const region of REGIONS) {
    let regionDone = 0;
    for (const island of region.islands) {
      let done = 0;
      for (const id of island.ids) {
        const s = save.lessons[id]?.stars ?? 0;
        if (!s) continue;
        done += 1;
        stars += s;
        if (s === 3) perfect += 1;
        xp += XP_PER_LESSON + XP_PER_STAR * s;
      }
      lessons += done;
      if (done === island.ids.length) {
        regionDone += 1;
        xp += XP_PER_ISLAND;
      }
    }
    islands += regionDone;
    regions.push({ region, done: regionDone, total: region.islands.length });
  }
  const result = {
    lessons, stars, perfect, islands, xp, regions,
    regionsDone: regions.filter((r) => r.done === r.total).length,
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

/* ---------- Achievement badges ---------- */

const badge = (id, icon, name, need, value, goal) => ({ id, icon, name, need, value, goal });
export const BADGES = [
  badge('first-step', 'star', { ar: 'الخطوة الأولى', en: 'First step' }, { ar: 'أكمل أوّل درس', en: 'Finish your first lesson' }, (s) => s.lessons, 1),
  badge('ten-lessons', 'star', { ar: 'عشرة دروس', en: 'Ten lessons' }, { ar: 'أكمل ١٠ دروس', en: 'Finish 10 lessons' }, (s) => s.lessons, 10),
  badge('fifty-lessons', 'star', { ar: 'خمسون درسًا', en: 'Fifty lessons' }, { ar: 'أكمل ٥٠ درسًا', en: 'Finish 50 lessons' }, (s) => s.lessons, 50),
  badge('hundred-lessons', 'star', { ar: 'مئة درس', en: 'A hundred lessons' }, { ar: 'أكمل ١٠٠ درس', en: 'Finish 100 lessons' }, (s) => s.lessons, 100),
  badge('five-hundred', 'star', { ar: 'خمسمئة درس', en: 'Five hundred lessons' }, { ar: 'أكمل ٥٠٠ درس', en: 'Finish 500 lessons' }, (s) => s.lessons, 500),
  badge('first-island', 'world', { ar: 'أوّل جزيرة', en: 'First island' }, { ar: 'أكمل جزيرة كاملة', en: 'Finish a whole island' }, (s) => s.islands, 1),
  badge('five-islands', 'world', { ar: 'خمس جزر', en: 'Five islands' }, { ar: 'أكمل ٥ جزر', en: 'Finish 5 islands' }, (s) => s.islands, 5),
  badge('twenty-islands', 'world', { ar: 'عشرون جزيرة', en: 'Twenty islands' }, { ar: 'أكمل ٢٠ جزيرة', en: 'Finish 20 islands' }, (s) => s.islands, 20),
  badge('hundred-islands', 'world', { ar: 'مئة جزيرة', en: 'A hundred islands' }, { ar: 'أكمل ١٠٠ جزيرة', en: 'Finish 100 islands' }, (s) => s.islands, 100),
  badge('first-world', 'journey', { ar: 'عالَم كامل', en: 'A whole world' }, { ar: 'أكمل كل جزر عالَم واحد', en: 'Finish every island of one world' }, (s) => s.regionsDone, 1),
  badge('perfect-ten', 'star', { ar: 'إتقان', en: 'Mastery' }, { ar: 'احصل على ٣ نجوم في ١٠ دروس', en: 'Get 3 stars in 10 lessons' }, (s) => s.perfect, 10),
  badge('perfect-hundred', 'star', { ar: 'إتقان كبير', en: 'Great mastery' }, { ar: 'احصل على ٣ نجوم في ١٠٠ درس', en: 'Get 3 stars in 100 lessons' }, (s) => s.perfect, 100),
  badge('streak-3', 'flame', { ar: 'ثلاثة أيام', en: 'Three days' }, { ar: 'تعلَّم ٣ أيام متتالية', en: 'Learn 3 days in a row' }, (s) => s.streak, 3),
  badge('streak-7', 'flame', { ar: 'أسبوع كامل', en: 'A full week' }, { ar: 'تعلَّم ٧ أيام متتالية', en: 'Learn 7 days in a row' }, (s) => s.streak, 7),
  badge('streak-30', 'flame', { ar: 'شهر كامل', en: 'A full month' }, { ar: 'تعلَّم ٣٠ يومًا متتاليًا', en: 'Learn 30 days in a row' }, (s) => s.streak, 30),
];

/** Every badge with how far along the player is. */
export function badges(save = store.get()) {
  const s = stats(save);
  return BADGES.map((b) => {
    const have = Math.min(b.value(s), b.goal);
    return { ...b, have, earned: have >= b.goal };
  });
}

/* ---------- Unlockable items ---------- */

/** Wardrobe items for Mr. Raccoon and Mr. Qattout unlock with stars; avatar items with levels. */
export function isItemUnlocked(item, save = store.get()) {
  if (item.level) return level(save).number >= item.level;
  return stats(save).stars >= (item.stars ?? 0);
}

/* ---------- Days ---------- */

function dayKey(date) {
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

/**
 * Record a finished lesson. Keeps the player's best star count.
 * Returns what changed so the lesson screen can celebrate it.
 */
export function completeLesson(lessonId, stars) {
  const before = store.get();
  const { island } = findLesson(lessonId);
  const was = { stats: stats(before), level: level(before).number, badges: badges(before), islandDone: isDone(island, before) };
  const wasOpen = new Set(ISLANDS.filter((i) => islandStatus(i, before) !== 'locked').map((i) => i.id));
  const regionsOpen = new Set(REGIONS.filter((r) => regionUnlocked(r, before)).map((r) => r.id));

  store.update((save) => {
    const best = Math.max(stars, save.lessons[lessonId]?.stars ?? 0);
    save.lessons[lessonId] = { stars: best, completedAt: new Date().toISOString() };
    const today = dayKey(new Date());
    if (!save.activeDays.includes(today)) save.activeDays.push(today);
    save.activeDays = save.activeDays.slice(-60);
    save.inProgress = null;
  });

  const after = store.get();
  const now = { stats: stats(after), level: level(after).number };
  const islandFinished = !was.islandDone && isDone(island, after);
  return {
    stars,
    xp: now.stats.xp - was.stats.xp,
    levelUp: now.level > was.level ? now.level : null,
    newBadges: badges(after).filter((b, i) => b.earned && !was.badges[i].earned),
    newItems: [
      ...REWARDS.filter((item) => item.stars > was.stats.stars && item.stars <= now.stats.stars),
      ...AVATAR_REWARDS.filter((item) => item.level > was.level && item.level <= now.level),
    ],
    islandFinished,
    unlockedIsland: islandFinished ? ISLANDS.find((i) => !wasOpen.has(i.id) && i.region === island.region && islandStatus(i, after) === 'open') ?? null : null,
    unlockedRegion: islandFinished ? REGIONS.find((r) => !regionsOpen.has(r.id) && regionUnlocked(r, after)) ?? null : null,
  };
}
