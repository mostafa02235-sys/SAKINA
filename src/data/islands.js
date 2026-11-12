// The world's data: regions, islands and their lessons.
//
// Two levels of loading keep 230+ islands light:
//   content/catalog.json        every region and island (names, looks, lesson ids).
//                               Small; loaded once when the app starts.
//   content/islands/<id>.json   one island's lesson texts. Loaded only when the
//                               player opens that island, then kept for a while.
//
// The content files are produced by tools/build-content.mjs from published
// sources. To add or change islands, edit tools/curriculum.mjs and run the tool.

import { QURAN_LESSONS } from './lessons/quran.js';
import { SUNNAH_LESSONS } from './lessons/sunnah.js';

export const REGIONS = [];
export const ISLANDS = [];
export const SURAHS = [];

const islandById = new Map();
const lessonHome = new Map(); // lesson id -> { island, index }

// Lessons written by hand (Phase 1). They sit at the start of their islands.
const HAND_WRITTEN = new Map([...QURAN_LESSONS, ...SUNNAH_LESSONS].map((lesson) => [lesson.id, lesson]));

export async function loadCatalog() {
  const response = await fetch('content/catalog.json');
  if (!response.ok) throw new Error(`catalog: ${response.status}`);
  const catalog = await response.json();

  SURAHS.push(...catalog.surahs);
  catalog.regions.forEach((region, index) => REGIONS.push({ ...region, index, islands: [] }));
  const regionById = new Map(REGIONS.map((region) => [region.id, region]));

  catalog.islands.forEach((raw, order) => {
    const region = regionById.get(raw.r);
    const island = { ...raw, region, order, place: region.islands.length };
    region.islands.push(island);
    ISLANDS.push(island);
    islandById.set(island.id, island);
    island.ids.forEach((id, index) => lessonHome.set(id, { island, index }));
  });
}

export function findIsland(id) {
  return islandById.get(id) ?? null;
}

export function findRegion(id) {
  return REGIONS.find((region) => region.id === id) ?? null;
}

/** Which island a lesson belongs to, and its position there. */
export function findLesson(lessonId) {
  return lessonHome.get(lessonId) ?? null;
}

export function totalLessons() {
  return lessonHome.size;
}

const loaded = new Map(); // island id -> Promise of its content
const KEEP = 6;

/**
 * An island's lessons and texts.
 * @returns {Promise<{ lessons: object[], pool: object[] }>} lessons in order; pool = all texts of the island
 */
export function loadIsland(id) {
  if (loaded.has(id)) return loaded.get(id);
  const island = islandById.get(id);
  const promise = fetch(`content/islands/${id}.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`island ${id}: ${response.status}`);
      return response.json();
    })
    .then((file) => {
      const built = new Map(file.lessons.map((lesson) => [lesson.id, lesson]));
      const lessons = island.ids.map((lessonId) => built.get(lessonId) ?? HAND_WRITTEN.get(lessonId)).filter(Boolean);
      return { lessons, pool: file.items ?? [] };
    });
  promise.catch(() => loaded.delete(id)); // a failed load can be tried again
  loaded.set(id, promise);
  if (loaded.size > KEEP) loaded.delete(loaded.keys().next().value);
  return promise;
}
