// Achievements, medals and challenges: measuring progress and giving awards.
//
// Nothing here is given for tapping a button. syncRewards() looks at what the
// player has really done (finished lessons, correct answers, days of learning),
// compares it with each requirement in data/awards.js, and awards what has been
// reached. An award is stored with its date and can never be given twice.
//
// syncRewards() is called after every finished lesson and on every screen change.

import { store } from '../core/store.js';
import { REGIONS, findIsland, findRegion } from '../data/islands.js';
import { ACHIEVEMENTS, MEDALS, CHALLENGES, METRIC_LABELS } from '../data/awards.js';
import { stats, level, dayKey, regionUnlocked } from './progress.js';

/* ---------- Measuring ---------- */

/** Every number an award can ask for, taken from a save. */
function measure(save) {
  const s = stats(save);
  const c = save.counters;
  const ch = save.challenges;
  return {
    lessons: s.lessons, played: c.played, xp: s.xp, lessonXp: s.lessonXp, level: level(save).number,
    correct: c.correct, perfect: s.perfect, perfectRun: c.bestPerfectRun, reviews: c.reviews,
    explored: s.explored, islands: s.islands, perfectIslands: s.perfectIslands,
    worldsDone: s.regionsDone, worldsOpen: s.regionsOpen, worldsTouched: s.regionsTouched,
    worlds3: s.regions.filter((r) => r.lessons >= 3).length,
    worldsIsland: s.regions.filter((r) => r.done >= 1).length,
    streak: Math.max(c.bestStreak, s.streak), days: c.days,
    dailyDone: ch.totals.daily, weeklyDone: ch.totals.weekly, specialDone: Object.keys(ch.special).length,
    fullDays: ch.totals.fullDays,
    challenges: ch.totals.daily + ch.totals.weekly + Object.keys(ch.special).length,
    medals: Object.keys(save.earned.medals).length,
    dawn: c.dawn, friday: c.friday, comeback: c.comeback,
  };
}

const islandDone = (save, id) => {
  const island = findIsland(id);
  return island && island.ids.every((lessonId) => save.lessons[lessonId]) ? 1 : 0;
};

/** The current value of one metric (see the list at the top of data/awards.js). */
function read(save, m, metric) {
  if (metric in m) return m[metric];
  const [kind, rest] = [metric.slice(0, metric.indexOf(':')), metric.slice(metric.indexOf(':') + 1)];
  if (kind === 'c') return save.challenges.counts[rest] ?? 0;
  if (kind === 'i') return islandDone(save, rest);
  if (kind === 'set') return rest.split(',').reduce((n, id) => n + islandDone(save, id), 0);
  const region = findRegion(rest);
  if (!region) return 0;
  const entry = stats(save).regions[region.index];
  return kind === 'ri' ? entry.done : entry.lessons;
}

/** A sentence describing a requirement, e.g. "Lessons finished: 100". */
export function requirement(def, lang) {
  const { metric, goal } = def;
  const n = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en').format(goal);
  if (METRIC_LABELS[metric]) return `${METRIC_LABELS[metric][lang]}: ${n}`;
  const rest = metric.slice(metric.indexOf(':') + 1);
  if (metric.startsWith('i:')) return (lang === 'ar' ? 'أكمل جزيرة: ' : 'Finish the island: ') + (findIsland(rest)?.name[lang] ?? rest);
  if (metric.startsWith('set:')) return (lang === 'ar' ? 'أكمل الجزر: ' : 'Finish the islands: ') + rest.split(',').map((id) => findIsland(id)?.name[lang] ?? id).join(lang === 'ar' ? '، ' : ', ');
  if (metric.startsWith('c:')) {
    const challenge = CHALLENGES.find((c) => c.id === rest);
    return (lang === 'ar' ? `أكمل تحدّي «${challenge.name.ar}»، عدد المرّات: ` : `Complete the "${challenge.name.en}" challenge, times: `) + n;
  }
  const world = findRegion(rest)?.name[lang] ?? rest;
  if (metric.startsWith('ri:')) return (lang === 'ar' ? `جزر مكتملة في ${world}: ` : `Islands finished in ${world}: `) + n;
  return (lang === 'ar' ? `دروس مكتملة في ${world}: ` : `Lessons finished in ${world}: `) + n;
}

/* ---------- Time ---------- */

/** The Saturday on or before a date: SAKINA's week runs Saturday to Friday. */
function weekStart(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 1) % 7));
  return start;
}

/** When the current daily and weekly challenges end. */
export function deadlines(now = new Date()) {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const week = weekStart(now);
  week.setDate(week.getDate() + 7);
  return { daily: midnight - now, weekly: week - now };
}

/* ---------- Challenges ---------- */

const repeating = (kind) => CHALLENGES.filter((c) => c.kind === kind);

/** The metric a challenge counts right now ("world of the week" names its world here). */
function metricOf(challenge, save) {
  return challenge.metric === 'r:*' ? `r:${save.challenges.weekly.region}` : challenge.metric;
}

const active = (challenge, save) => challenge.metric !== 'r:*' || Boolean(findRegion(save.challenges.weekly.region));

/** Pick this week's world: one the player has opened that still has lessons to do. */
function pickWorld(save, weekKey) {
  const s = stats(save);
  const open = REGIONS.filter((region) => regionUnlocked(region, save)
    && region.islands.reduce((n, island) => n + island.ids.length, 0) - s.regions[region.index].lessons >= 8);
  if (!open.length) return null;
  const week = Math.floor(new Date(`${weekKey}T00:00`).getTime() / (7 * 86400000));
  return open[week % open.length].id;
}

/** Start a new day or week when the old one has ended. Returns true if anything changed. */
function rollOver(now) {
  const save = store.get();
  const today = dayKey(now);
  const week = dayKey(weekStart(now));
  const newDay = save.challenges.daily.key !== today;
  const newWeek = save.challenges.weekly.key !== week;
  if (!newDay && !newWeek) return false;

  const region = newWeek ? pickWorld(save, week) : save.challenges.weekly.region;
  const m = measure(save);
  // Each period remembers the numbers it started from; progress is counted from there.
  const snapshot = (kind, withRegion) => Object.fromEntries(repeating(kind)
    .map((c) => (c.metric === 'r:*' ? (withRegion ? `r:${withRegion}` : null) : c.metric))
    .filter(Boolean)
    .map((metric) => [metric, read(save, m, metric)]));

  store.update((draft) => {
    if (newDay) draft.challenges.daily = { key: today, base: snapshot('daily'), done: [] };
    if (newWeek) draft.challenges.weekly = { key: week, base: snapshot('weekly', region), done: [], region };
  });
  return true;
}

function progressOf(challenge, save, m) {
  if (challenge.kind === 'special') return read(save, m, challenge.metric);
  if (!active(challenge, save)) return 0;
  const metric = metricOf(challenge, save);
  const period = save.challenges[challenge.kind];
  return Math.max(0, read(save, m, metric) - (period.base[metric] ?? 0));
}

const isCompleted = (challenge, save) => (challenge.kind === 'special'
  ? Boolean(save.challenges.special[challenge.id])
  : save.challenges[challenge.kind].done.includes(challenge.id));

/* ---------- Giving awards ---------- */

/**
 * Check everything and give what has been earned.
 * @returns {object[]} what is new, in order: { type: 'challenge' | 'medal' | 'achievement', def }
 */
export function syncRewards(now = new Date()) {
  rollOver(now);
  const news = [];
  const stamp = now.toISOString();

  // Awards can lead to other awards (a challenge gives a medal, medals give an
  // achievement), so keep checking until a round finds nothing new.
  for (let round = 0; round < 8; round += 1) {
    const save = store.get();
    const m = measure(save);

    const challenges = CHALLENGES.filter((c) => !isCompleted(c, save) && progressOf(c, save, m) >= c.goal);
    const medals = MEDALS.filter((medal) => !save.earned.medals[medal.id] && read(save, m, medal.metric) >= medal.goal);
    const achievements = ACHIEVEMENTS.filter((a) => !save.earned.achievements[a.id] && read(save, m, a.metric) >= a.goal);
    if (!challenges.length && !medals.length && !achievements.length) break;

    store.update((draft) => {
      const state = draft.challenges;
      for (const c of challenges) {
        if (c.kind === 'special') state.special[c.id] = stamp;
        else {
          state[c.kind].done.push(c.id);
          state.totals[c.kind] += 1;
        }
        state.counts[c.id] = (state.counts[c.id] ?? 0) + 1;
        draft.bonusXp += c.xp;
      }
      const dailies = repeating('daily');
      if (dailies.every((c) => state.daily.done.includes(c.id)) && state.fullDayKey !== state.daily.key) {
        state.fullDayKey = state.daily.key;
        state.totals.fullDays += 1;
      }
      for (const medal of medals) draft.earned.medals[medal.id] = stamp;
      for (const a of achievements) {
        draft.earned.achievements[a.id] = stamp;
        draft.bonusXp += a.xp;
      }
    });

    news.push(
      ...challenges.map((def) => ({ type: 'challenge', def })),
      ...medals.map((def) => ({ type: 'medal', def })),
      ...achievements.map((def) => ({ type: 'achievement', def })),
    );
  }
  return news;
}

/** Count one correctly answered question. */
export function recordCorrectAnswer() {
  store.update((save) => { save.counters.correct += 1; });
}

/* ---------- For the screens ---------- */

const withProgress = (list, earned, save, m) => list.map((def) => {
  const have = Math.min(read(save, m, def.metric), def.goal);
  return { ...def, have, earned: earned[def.id] ?? null };
});

/** Every achievement with the player's progress and the date it was earned (or null). */
export function achievements(save = store.get()) {
  return withProgress(ACHIEVEMENTS, save.earned.achievements, save, measure(save));
}

/** Every medal with the player's progress and the date it was earned (or null). */
export function medals(save = store.get()) {
  return withProgress(MEDALS, save.earned.medals, save, measure(save));
}

/** The challenges on offer now, with progress, state and the medal each one leads to. */
export function challengeBoard(save = store.get()) {
  const m = measure(save);
  const row = (c) => {
    const done = isCompleted(c, save);
    const times = save.challenges.counts[c.id] ?? 0;
    const ladder = MEDALS.filter((medal) => medal.challenge === c.id);
    const world = c.metric === 'r:*' ? findRegion(save.challenges.weekly.region) : null;
    return {
      ...c,
      world,
      have: done ? c.goal : Math.min(progressOf(c, save, m), c.goal),
      done,
      times,
      // The medal being worked towards: the first one not yet earned.
      medal: ladder.find((medal) => !save.earned.medals[medal.id]) ?? ladder[ladder.length - 1],
      medalEarned: ladder.every((medal) => save.earned.medals[medal.id]),
    };
  };
  return {
    daily: repeating('daily').map(row),
    weekly: repeating('weekly').filter((c) => active(c, save)).map(row),
    special: repeating('special').map(row),
  };
}

/** Totals for the profile and the collection screen. */
export function awardSummary(save = store.get()) {
  const m = measure(save);
  return {
    achievements: Object.keys(save.earned.achievements).length, achievementsTotal: ACHIEVEMENTS.length,
    medals: m.medals, medalsTotal: MEDALS.length,
    challenges: m.challenges, streak: stats(save).streak, bestStreak: m.streak, xp: m.xp, correct: m.correct,
  };
}

/** The most recently earned achievements and medals, newest first. */
export function latestAwards(limit = 6, save = store.get()) {
  return [
    ...ACHIEVEMENTS.filter((a) => save.earned.achievements[a.id]).map((def) => ({ type: 'achievement', def, date: save.earned.achievements[def.id] })),
    ...MEDALS.filter((medal) => save.earned.medals[medal.id]).map((def) => ({ type: 'medal', def, date: save.earned.medals[def.id] })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
}
