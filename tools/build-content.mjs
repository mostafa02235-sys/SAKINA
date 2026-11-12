// Builds SAKINA's lesson content from published sources.
//
//   node tools/build-content.mjs <quran-json dir> <tafsir_api dir> <hadith-json dir>
//
// Sources (see docs/CONTENT.md for licences and credits):
//   quran-json  https://github.com/risan/quran-json   Tanzil text, QuranEnc translation
//   tafsir_api  https://github.com/spa5k/tafsir_api   At-Tafsir al-Muyassar
//   hadith-json https://github.com/AhmedBaset/hadith-json  Sahih al-Bukhari, an-Nawawi's Forty
//
// Output:
//   content/catalog.json        every region and island (small; loaded at start-up)
//   content/islands/<id>.json   one island's lessons and texts (loaded when opened)
//
// RULE: this script never writes or alters religious text. It only selects,
// copies and groups what the sources contain.

import fs from 'node:fs';
import path from 'node:path';
import { REGIONS, ISLANDS } from './curriculum.mjs';

const [quranDir, tafsirDir, hadithDir] = process.argv.slice(2);
if (!hadithDir) {
  console.error('usage: node tools/build-content.mjs <quran-json> <tafsir_api> <hadith-json>');
  process.exit(1);
}
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const OUT = path.resolve('content');

/* ---------- Sources ---------- */
const QURAN = readJson(path.join(quranDir, 'data/tanzil/simple.json'));
const CHAPTERS = readJson(path.join(quranDir, 'data/tanzil/chapters.json')).chapters;
const ENGLISH = readJson(path.join(quranDir, 'data/quranenc/english_rwwad.json'));
const TAFSIR = {};
for (let s = 1; s <= 114; s += 1) TAFSIR[s] = readJson(path.join(tafsirDir, `tafsir/ar-tafsir-muyassar/${s}.json`));
const BUKHARI = readJson(path.join(hadithDir, 'db/by_book/the_9_books/bukhari.json'));
const NAWAWI = readJson(path.join(hadithDir, 'db/by_book/forties/nawawi40.json'));

const BASMALA = QURAN['1'][0].text;

// Some ayat occur more than once in a surah (refrains). Exercises about order or
// ayah numbers are only asked for ayat whose wording is unique in their surah.
const REPEATED = new Set();
for (const [s, rows] of Object.entries(QURAN)) {
  const seen = new Map();
  rows.forEach((row) => seen.set(row.text, (seen.get(row.text) ?? 0) + 1));
  rows.forEach((row) => { if (seen.get(row.text) > 1) REPEATED.add(`${s}:${row.verse}`); });
}
const arNum = (n) => new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(n);
const surah = (n) => CHAPTERS[n - 1];

/* ---------- Qur'an items ---------- */

// Tanzil prefixes the basmala to ayah 1 of each surah (except 1 and 9). It is not part
// of that ayah, so it is separated here and shown on its own line by the app.
function ayahItem(s, a) {
  const row = QURAN[s][a - 1];
  let text = row.text;
  let basmala = false;
  if (a === 1 && s !== 1 && s !== 9 && text.startsWith(BASMALA + ' ')) {
    text = text.slice(BASMALA.length + 1);
    basmala = true;
  }
  // The tafsir source repeats a surah introduction before "[التفسير]" on the first ayat; the tafsir itself follows it.
  const rawTafsir = TAFSIR[s][a - 1].text;
  const marker = rawTafsir.indexOf('[التفسير]');
  const tafsir = (marker === -1 ? rawTafsir : rawTafsir.slice(marker + '[التفسير]'.length)).trim();
  const en = ENGLISH[s][a - 1];
  const item = { k: 'q', s, a, t: text, m: tafsir, e: en.text, u: REPEATED.has(`${s}:${a}`) ? 0 : 1 };
  if (basmala) item.b = 1;
  if (en.footnotes) item.f = en.footnotes;
  return item;
}

function parseRange(range) {
  const [s, span] = String(range).split(':');
  const n = Number(s);
  if (!span) return { s: n, from: 1, to: surah(n).total_verses };
  const [from, to] = span.split('-').map(Number);
  return { s: n, from, to: to ?? from };
}

/** Split ayat into lessons: consecutive ayat of one range, within a size budget. */
function chunk(ranges, budget, maxAyat) {
  const lessons = [];
  for (const r of ranges) {
    let current = [];
    let size = 0;
    for (let a = r.from; a <= r.to; a += 1) {
      const len = QURAN[r.s][a - 1].text.length;
      if (current.length && (size + len > budget || current.length >= maxAyat)) {
        lessons.push(current);
        current = [];
        size = 0;
      }
      current.push({ s: r.s, a });
      size += len;
    }
    if (current.length) lessons.push(current);
  }
  return lessons;
}

// A lesson count is usable when it can be dealt into islands of 10 to 15 lessons.
const usable = (count, max = 15) => {
  if (count < 10) return false;
  const islands = Math.ceil(count / max);
  return Math.floor(count / islands) >= 10;
};

function planLessons(ranges, mode, maxLessons = 15) {
  const maxAyat = mode === 'recite' ? 6 : 4;
  const preferred = mode === 'recite' ? 260 : 210;
  const budgets = [preferred, 320, 180, 400, 140, 500, 110, 620, 80, 760, 50, 1];
  for (const budget of budgets) {
    const lessons = chunk(ranges, budget, maxAyat);
    if (maxLessons < 15 ? lessons.length >= 10 && lessons.length <= maxLessons : usable(lessons.length)) return lessons;
  }
  const one = chunk(ranges, 1, 1);
  if (one.length > 15 && maxLessons === 15) return one.slice(0, Math.floor(one.length / 15) * 15); // very rare
  throw new Error(`Cannot make 10-15 lessons from ${JSON.stringify(ranges)} (${one.length} ayat)`);
}

function deal(lessons, max = 15) {
  const islands = Math.ceil(lessons.length / max);
  const size = Math.ceil(lessons.length / islands);
  const out = [];
  for (let i = 0; i < islands; i += 1) out.push(lessons.slice(i * size, (i + 1) * size));
  return out;
}

/* ---------- Hadith items ---------- */

// Hadith on subjects that are not for a young children's first lessons are left out
// of the automatic selection. A teacher should still review what remains.
const SKIP = /نكاح|جماع|يجامع|حيض|حائض|حاضت|جنابة|جنب|زنا|زنى|يزني|فرج|عورة|قتل|يقتل|قتال|قاتل|سيف|دماء|رجم|جلد|حدود|الدجال|يباشر|متعة|خمر|طلاق|طلق|جارية|رقبة|يضرب|ضرب|بول|غائط|الخلاء|ضراط|احتلام|لعن|سحر|عذاب القبر|يهود|نصار/;

const strip = (text) => text.normalize('NFC').replace(/[ً-ْٰـ]/g, '');
const tidy = (text) => text.replace(/[‎‏]/g, '').replace(/\s+/g, ' ').replace(/\s+([،.:؛])/g, '$1').trim();

function bukhariItem(hadith) {
  const full = tidy(hadith.arabic);
  const quote = full.match(/"\s*([^"]{12,})\s*"/);
  if (!quote) return null;
  const said = tidy(quote[1]).replace(/[.،]+$/, '').trim();
  const words = said.split(' ').length;
  if (words < 5 || words > 50 || full.length > 640) return null;
  if (SKIP.test(strip(full))) return null;
  // Keep only texts where the quoted words follow a mention of the Prophet ﷺ.
  if (!/رسول الله|النبي/.test(strip(full.slice(0, full.indexOf('"'))))) return null;
  // `n` is this dataset's running index, NOT the standard hadith number, so it is never shown.
  return { k: 'h', src: 'bukhari', n: hadith.idInBook, book: hadith.chapterId, t: full, q: said };
}

function nawawiItem(hadith) {
  const full = tidy(hadith.arabic).replace(/\s*\.$/, '').trim();
  const quote = full.match(/"\s*([^"]{12,})\s*"/);
  const item = { k: 'h', src: 'nawawi', n: hadith.idInBook, t: full };
  if (quote) item.q = tidy(quote[1]).replace(/[.،]+$/, '').trim();
  return item;
}

const usedHadith = new Set();
const seenText = new Set();
const BOOKS = Object.fromEntries(BUKHARI.chapters.map((c) => [c.id, { ar: tidy(c.arabic), en: tidy(c.english) }]));
function pickHadith(book, count) {
  if (book === 'nawawi') return NAWAWI.hadiths.map(nawawiItem);
  const out = [];
  for (const hadith of BUKHARI.hadiths) {
    if (hadith.chapterId !== book || usedHadith.has(hadith.idInBook)) continue;
    const item = bukhariItem(hadith);
    if (!item) continue;
    const key = strip(item.q).slice(0, 40);
    if (seenText.has(key)) continue; // Bukhari repeats hadith under several headings
    seenText.add(key);
    out.push(item);
    if (out.length === count) break;
  }
  out.forEach((item) => usedHadith.add(item.n));
  return out;
}

/* ---------- Names, titles, objectives ---------- */

const listAr = (names) => (names.length <= 3 ? names.join(' و') : `من ${names[0]} إلى ${names[names.length - 1]}`);
const listEn = (names) => (names.length <= 3 ? names.join(', ').replace(/, ([^,]*)$/, ' and $1') : `${names[0]} to ${names[names.length - 1]}`);

function spanLabel(group) {
  const first = group[0];
  const last = group[group.length - 1];
  const ar = first.a === last.a ? `الآية ${arNum(first.a)}` : `الآيات ${arNum(first.a)}–${arNum(last.a)}`;
  const en = first.a === last.a ? `ayah ${first.a}` : `ayat ${first.a}–${last.a}`;
  return {
    ar: `سورة ${surah(first.s).name}، ${ar}`,
    en: `Surah ${surah(first.s).transliteration}, ${en}`,
  };
}

const WORDS = {
  recite: {
    title: { ar: 'حفظ', en: 'Memorise' },
    objective: { ar: 'أن تحفظ {x} وتتلوها بترتيبها الصحيح.', en: 'Memorise {x} and recite them in the right order.' },
  },
  understand: {
    title: { ar: 'معاني', en: 'Meanings' },
    objective: { ar: 'أن تفهم معنى {x} وتربط كل آية بمعناها.', en: 'Understand {x} and connect each ayah to its meaning.' },
  },
};

/* ---------- Island looks ---------- */

const BIOMES = {
  meadow: { grass: ['#6fcf7c', '#7ed68a', '#62c487'], rock: ['#8a6fb0', '#7d78b8'], marks: ['academy', 'bookstand', 'library'] },
  dawn: { grass: ['#f6b38a', '#f4a09a', '#f7c27e'], rock: ['#9a6a8f', '#a8748a'], marks: ['minaret', 'lantern', 'bookstand', 'academy'] },
  lagoon: { grass: ['#7fd6c2', '#6ccfd0', '#8ad8b4'], rock: ['#6f8fc0', '#6a84b0'], marks: ['spring', 'lighthouse', 'bridge', 'boat'] },
  desert: { grass: ['#f2cf7a', '#eec06a', '#f4d98c'], rock: ['#c98a6b', '#b97f63'], marks: ['oasis', 'tent', 'well', 'dunes', 'boat'] },
  garden: { grass: ['#9ad36a', '#a8d95c', '#8fcf74'], rock: ['#b9815a', '#a97752'], marks: ['garden', 'lantern', 'well', 'bookstand'] },
  orchard: { grass: ['#b9dd6a', '#c9e07a', '#a6d864'], rock: ['#c0785f', '#b06c58'], marks: ['orchard', 'garden', 'market', 'bridge'] },
  night: { grass: ['#8f9fe0', '#9a8fe0', '#7fa6e6'], rock: ['#5c5f9a', '#56588c'], marks: ['lantern', 'observatory', 'minaret', 'lighthouse'] },
  spring: { grass: ['#8fdcc0', '#7fd2cf', '#9be0b0'], rock: ['#7c93b8', '#7088ae'], marks: ['spring', 'minaret', 'well', 'academy'] },
  canyon: { grass: ['#e8b07a', '#e0a070', '#eebd86'], rock: ['#a86a58', '#9a6050'], marks: ['mountain', 'tent', 'dunes', 'market'] },
  palm: { grass: ['#8fd08a', '#9ad67c', '#84c890'], rock: ['#b08a5f', '#a27f56'], marks: ['oasis', 'orchard', 'tent', 'well'] },
  aurora: { grass: ['#b7a6e8', '#a9b0ee', '#c2a0e4'], rock: ['#70608f', '#665a88'], marks: ['lighthouse', 'observatory', 'library', 'bookstand'] },
  harvest: { grass: ['#f0c85a', '#e8d064', '#f4bc5e'], rock: ['#a8804e', '#9c7448'], marks: ['market', 'orchard', 'mountain', 'garden'] },
};

const hex = (n) => n.toString(16).padStart(2, '0');
function darker(color, k) {
  const n = parseInt(color.slice(1), 16);
  return `#${hex(Math.round(((n >> 16) & 255) * k))}${hex(Math.round(((n >> 8) & 255) * k))}${hex(Math.round((n & 255) * k))}`;
}

// Each island's look is chosen from its position, so it never changes between builds.
function lookFor(biome, index) {
  const b = BIOMES[biome];
  const grass = b.grass[index % b.grass.length];
  const rock = b.rock[(index >> 1) % b.rock.length];
  return {
    grass, grassDeep: darker(grass, 0.74), rock, rockDeep: darker(rock, 0.7),
    mark: b.marks[index % b.marks.length],
    shape: (index * 3 + (index >> 2)) % 4,
    deco: (index * 5 + 1) % 6,
    flip: index % 3 === 1 ? 1 : 0,
  };
}

/* ---------- Build ---------- */

const catalog = { regions: REGIONS.map(({ biome, ...rest }) => ({ ...rest, biome })), islands: [], surahs: CHAPTERS.map((c) => ({ name: c.name, tr: c.transliteration, en: c.translation, type: c.type, count: c.total_verses })) };
const files = {};
const regionCount = {};
const usedIds = new Set();

function addIsland(spec, island, lessons, extra = {}) {
  const regionIndex = (regionCount[spec.region] = (regionCount[spec.region] ?? 0) + 1);
  const id = island.id ?? `${spec.region}-${regionIndex}`;
  if (usedIds.has(id)) throw new Error(`Duplicate island id ${id}`);
  usedIds.add(id);
  const legacy = spec.legacy ?? [];
  const total = legacy.length + lessons.length;
  if (total < 10 || total > 15) throw new Error(`${id} has ${total} lessons`);
  const biome = REGIONS.find((r) => r.id === spec.region).biome;
  catalog.islands.push({
    id, r: spec.region, mode: spec.mode, name: island.name, about: island.about,
    ids: [...legacy, ...lessons.map((_, i) => `${id}.${i + 1}`)],
    look: lookFor(biome, regionIndex - 1),
  });
  files[id] = {
    id,
    lessons: lessons.map((lesson, i) => ({ id: `${id}.${i + 1}`, ...lesson })),
    ...extra,
  };
}

function quranIslands(spec) {
  const ranges = spec.ranges.map(parseRange);
  const names = [...new Set(ranges.map((r) => r.s))].map((s) => surah(s));
  const lessons = planLessons(ranges, spec.mode, spec.maxLessons ?? 15);
  const parts = spec.maxLessons ? [lessons] : deal(lessons);
  const baseName = spec.name ?? {
    ar: `${names.length > 1 ? 'سور' : 'سورة'} ${listAr(names.map((c) => c.name))}`,
    en: `Surah${names.length > 1 ? 's' : ''} ${listEn(names.map((c) => c.transliteration))}`,
  };

  parts.forEach((part, p) => {
    const items = [];
    const built = part.map((group, i) => {
      const indexes = group.map((ref) => items.push(ayahItem(ref.s, ref.a)) - 1);
      const span = spanLabel(group);
      const words = WORDS[spec.mode];
      return {
        mode: spec.mode,
        title: { ar: `${words.title.ar}: ${span.ar}`, en: `${words.title.en}: ${span.en}` },
        objective: { ar: words.objective.ar.replace('{x}', span.ar), en: words.objective.en.replace('{x}', span.en) },
        level: 1 + Math.min(2, Math.floor((i * 3) / part.length)),
        items: indexes,
      };
    });
    const suffix = parts.length > 1 ? { ar: ` (${arNum(p + 1)})`, en: ` (${p + 1})` } : { ar: '', en: '' };
    const first = part[0][0];
    const last = part[part.length - 1].slice(-1)[0];
    const prefix = spec.mode === 'recite' && !spec.name ? { ar: 'حفظ ', en: 'Memorise ' } : spec.mode === 'understand' && !spec.name ? { ar: 'معاني ', en: 'Meanings of ' } : { ar: '', en: '' };
    const about = spec.about ?? (names.length === 1
      ? { ar: `سورة ${names[0].name}، من الآية ${arNum(first.a)} إلى الآية ${arNum(last.a)}.`, en: `Surah ${names[0].transliteration}, ayah ${first.a} to ayah ${last.a}.` }
      : { ar: `آيات من ${listAr(names.map((c) => `سورة ${c.name}`))}.`, en: `Ayat from ${listEn(names.map((c) => `Surah ${c.transliteration}`))}.` });
    addIsland(spec, {
      id: spec.id,
      name: { ar: prefix.ar + baseName.ar + suffix.ar, en: prefix.en + baseName.en + suffix.en },
      about,
    }, built, { items });
  });
}

function factsIslands(spec) {
  for (let g = 0; g < spec.groups; g += 1) {
    const numbers = [];
    for (let s = Math.floor((g * 114) / spec.groups) + 1; s <= Math.floor(((g + 1) * 114) / spec.groups); s += 1) numbers.push(s);
    const first = surah(numbers[0]);
    const last = surah(numbers[numbers.length - 1]);
    const items = numbers.map((s) => ayahItem(s, 1));
    const lessons = numbers.map((s, i) => ({
      mode: 'facts',
      title: { ar: `بطاقة سورة ${surah(s).name}`, en: `Meet Surah ${surah(s).transliteration}` },
      objective: {
        ar: `أن تعرف ترتيب سورة ${surah(s).name} في المصحف وعدد آياتها وهل هي مكية أم مدنية.`,
        en: `Know where Surah ${surah(s).transliteration} comes in the mushaf, how many ayat it has, and whether it is Makkan or Madinan.`,
      },
      level: 1 + Math.min(2, Math.floor((g * 3) / spec.groups)),
      surah: s,
      items: [i],
    }));
    addIsland(spec, {
      name: { ar: `سور المصحف: من ${first.name} إلى ${last.name}`, en: `Surahs of the mushaf: ${first.transliteration} to ${last.transliteration}` },
      about: { ar: `تعرَّف على السور من ${arNum(numbers[0])} إلى ${arNum(numbers[numbers.length - 1])}.`, en: `Meet surahs ${numbers[0]} to ${numbers[numbers.length - 1]}.` },
    }, lessons, { items });
  }
}

const openings = new Set();
function hadithIslands(spec) {
  const perIsland = spec.lessons ?? (spec.book === 'nawawi' ? 14 : 12);
  const picked = pickHadith(spec.book, perIsland * spec.max);
  const islands = Math.min(spec.max, Math.floor(picked.length / perIsland));
  if (islands < spec.max) console.warn(`  note: "${spec.name.en}" filled ${islands} of ${spec.max} islands (${picked.length} suitable hadith)`);
  for (let p = 0; p < islands; p += 1) {
    const items = picked.slice(p * perIsland, (p + 1) * perIsland);
    const lessons = items.map((item, i) => {
      // Bukhari hadith are cited by collection and book; an-Nawawi's Forty by its own numbering.
      const source = item.src === 'nawawi'
        ? { ar: `الأربعون النووية، الحديث ${arNum(item.n)}`, en: `An-Nawawi's Forty, hadith ${item.n}` }
        : { ar: `صحيح البخاري، ${BOOKS[item.book].ar}`, en: `Sahih al-Bukhari, Book of ${BOOKS[item.book].en}` };
      item.ref = source;
      const words = (item.q ?? item.t).split(' ');
      let take = 5;
      let opening = words.slice(0, take).join(' ');
      while (openings.has(opening) && take < words.length) opening = words.slice(0, (take += 2)).join(' ');
      openings.add(opening);
      return {
        mode: 'hadith',
        title: { ar: `«${opening}${take < words.length ? '…' : ''}»`, en: `${spec.name.en}${islands > 1 ? ` (${p + 1})` : ''}: hadith ${i + 1}` },
        objective: { ar: `أن تحفظ نصّ الحديث وتعرف مصدره: ${source.ar}.`, en: `Learn the wording of the hadith and know its source: ${source.en}.` },
        level: 1 + Math.min(2, Math.floor((i * 3) / items.length)),
        items: [i],
      };
    });
    const suffix = islands > 1 ? { ar: ` (${arNum(p + 1)})`, en: ` (${p + 1})` } : { ar: '', en: '' };
    const first = items[0].n;
    const last = items[items.length - 1].n;
    const book = spec.book === 'nawawi' ? { ar: 'الأربعين النووية', en: 'an-Nawawi\'s Forty' } : { ar: 'صحيح البخاري', en: 'Sahih al-Bukhari' };
    addIsland(spec, {
      id: spec.id,
      name: { ar: spec.name.ar + suffix.ar, en: spec.name.en + suffix.en },
      about: spec.about ?? (spec.book === 'nawawi'
        ? { ar: `الأحاديث ${arNum(first)} إلى ${arNum(last)} من ${book.ar}.`, en: `Hadith ${first} to ${last} of ${book.en}.` }
        : { ar: `أحاديث من ${book.ar}، ${BOOKS[spec.book].ar}.`, en: `Hadith from ${book.en}, Book of ${BOOKS[spec.book].en}.` }),
    }, lessons, { items });
  }
}

for (const spec of ISLANDS) {
  if (spec.mode === 'facts') factsIslands(spec);
  else if (spec.mode === 'hadith') hadithIslands(spec);
  else quranIslands(spec);
}

/* ---------- Checks: the build fails rather than ship broken content ---------- */
const names = new Set();
const lessonIds = new Set();
const titles = new Set();
let repeats = 0;
for (const island of catalog.islands) {
  if (names.has(island.name.ar) || names.has(island.name.en)) throw new Error(`Duplicate island name: ${island.name.en}`);
  names.add(island.name.ar);
  names.add(island.name.en);
  if (island.ids.length < 10 || island.ids.length > 15) throw new Error(`${island.id}: ${island.ids.length} lessons`);
  for (const id of island.ids) {
    if (lessonIds.has(id)) throw new Error(`Duplicate lesson id ${id}`);
    lessonIds.add(id);
  }
  for (const lesson of files[island.id].lessons) {
    if (titles.has(lesson.title.ar)) {
      // The same ayat can appear under two themes; the theme is added so every title stays unique.
      lesson.title = { ar: `${lesson.title.ar} — ${island.name.ar}`, en: `${lesson.title.en} — ${island.name.en}` };
      repeats += 1;
    }
    if (titles.has(lesson.title.ar)) throw new Error(`Duplicate lesson title: ${lesson.title.ar}`);
    titles.add(lesson.title.ar);
    if (!lesson.items.length) throw new Error(`${lesson.id} has no content`);
  }
}
if (catalog.islands.length < 220) throw new Error(`Only ${catalog.islands.length} islands`);

/* ---------- Write ---------- */
fs.rmSync(path.join(OUT, 'islands'), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'islands'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'catalog.json'), JSON.stringify(catalog));
let bytes = 0;
for (const [id, file] of Object.entries(files)) {
  const text = JSON.stringify(file);
  bytes += text.length;
  fs.writeFileSync(path.join(OUT, 'islands', `${id}.json`), text);
}

const perRegion = REGIONS.map((r) => `${r.id} ${regionCount[r.id] ?? 0}`).join(', ');
const hadithLessons = catalog.islands.filter((i) => i.mode === 'hadith').reduce((n, i) => n + files[i.id].lessons.length, 0);
console.log(`islands: ${catalog.islands.length}  (${perRegion})`);
console.log(`lessons: ${lessonIds.size}  (hadith lessons: ${hadithLessons}; lessons whose ayat also appear under another theme: ${repeats})`);
console.log(`catalog: ${(fs.statSync(path.join(OUT, 'catalog.json')).size / 1024).toFixed(0)} KB, islands: ${(bytes / 1048576).toFixed(1)} MB`);
