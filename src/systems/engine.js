// The lesson engine: turns a lesson's source texts into the steps the player sees.
//
// A lesson from content/islands/*.json only names its texts (ayat or a hadith).
// This file adds the framing (goal, a short introduction) and builds the
// exercises FROM those texts. It never writes religious content of its own:
// every option in every question is a piece of the source text, a number or
// name taken from the mushaf's own data, or the meaning supplied by the source.
//
// Questions are built from a seed (the lesson id), so a lesson always has the
// same questions, which is what lets an unfinished lesson be continued later.

import { SURAHS } from '../data/islands.js';

const arDigits = new Intl.NumberFormat('ar-EG', { useGrouping: false });
const AR = (n) => arDigits.format(n);

/* ---------- Small tools ---------- */

function seeded(text) {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i += 1) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function shuffled(list, random) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const bare = (text) => text.replace(/[ً-ْٰـ]/g, '').trim();
const words = (text) => text.split(' ').filter(Boolean);
/** The last `count` words, marked as a continuation. */
const tail = (text, count) => {
  const w = words(text);
  return w.length <= count ? text : `… ${w.slice(-count).join(' ')}`;
};
const clip = (text, count) => {
  const w = words(text);
  return w.length <= count ? text : `${w.slice(0, count).join(' ')} …`;
};

/** A multiple-choice question whose options are shuffled; `correct` is listed first. */
function choice(random, question, options, extra = {}) {
  // Options must look different on screen (two long texts can share their first words).
  const shown = options.map((o) => bare(typeof o === 'string' ? o : o.ar));
  if (new Set(shown).size !== shown.length) return null;
  const order = shuffled(options.map((_, i) => i), random);
  return { type: 'quiz', question, options: order.map((i) => options[i]), answer: order.indexOf(0), ...extra };
}

const TRUE_FALSE = [{ ar: 'صحيح', en: 'True' }, { ar: 'خطأ', en: 'False' }];
function trueFalse(statement, isTrue, extra = {}) {
  return { type: 'quiz', tf: true, question: { ar: 'صحيح أم خطأ؟', en: 'True or false?' }, options: TRUE_FALSE, answer: isTrue ? 0 : 1, ...extra, ...statement };
}

/** Up to `count` other texts that are really different from `own`. */
function others(pool, own, count, random, key = (x) => x) {
  const taken = new Set([bare(key(own))]);
  const out = [];
  for (const candidate of shuffled(pool, random)) {
    const k = bare(key(candidate));
    if (!k || taken.has(k)) continue;
    taken.add(k);
    out.push(candidate);
    if (out.length === count) break;
  }
  return out;
}

/* ---------- References ---------- */

function surahName(s) {
  return { ar: `سورة ${SURAHS[s - 1].name}`, en: `Surah ${SURAHS[s - 1].tr}` };
}

function ayahRef(item) {
  const name = surahName(item.s);
  return { ar: `${name.ar}، الآية ${AR(item.a)}`, en: `${name.en}, ayah ${item.a}` };
}

function spanRef(items) {
  const first = items[0];
  const last = items[items.length - 1];
  if (first.a === last.a) return ayahRef(first);
  const name = surahName(first.s);
  return { ar: `${name.ar}، الآيات ${AR(first.a)}–${AR(last.a)}`, en: `${name.en}, ayat ${first.a}–${last.a}` };
}

const TANZIL = { ar: 'نصّ مشروع تنزيل', en: 'Tanzil Project text' };
const MUYASSAR = { ar: 'التفسير الميسَّر', en: 'At-Tafsir al-Muyassar' };
const ROWWAD = { ar: 'ترجمة مركز روّاد الترجمة', en: 'Rowwad Translation Center' };

/* ---------- Source cards ---------- */

function quranCards(items, withMeaning) {
  const cards = [];
  let group = [];
  let size = 0;
  const flush = () => {
    if (!group.length) return;
    cards.push({
      type: 'source', kind: 'quran',
      verses: group.map((item) => ({ t: item.t, n: item.a, basmala: item.b === 1, meaning: withMeaning ? { ar: item.m, en: item.e } : null, notes: withMeaning ? item.f ?? null : null })),
      meaningCredit: withMeaning ? { ar: MUYASSAR.ar, en: ROWWAD.en } : null,
      reference: spanRef(group),
      reading: TANZIL,
    });
    group = [];
    size = 0;
  };
  for (const item of items) {
    const sameSurah = !group.length || group[group.length - 1].s === item.s;
    if (!sameSurah || size + item.t.length > (withMeaning ? 220 : 380) || group.length >= (withMeaning ? 2 : 4)) flush();
    group.push(item);
    size += item.t.length;
  }
  flush();
  return cards;
}

/* ---------- Exercises on ayat ---------- */

function ending(text) {
  const w = words(text);
  const take = w.length > 7 ? 2 : 1;
  return { start: w.slice(0, -take).join(' '), end: w.slice(-take).join(' ') };
}

function completeAyah(random, item, pool) {
  if (words(item.t).length < 3) return null;
  const own = ending(item.t);
  const wrong = others(pool.filter((p) => p !== item && words(p.t).length >= 2), own.end, 2, random, (x) => (typeof x === 'string' ? x : ending(x.t).end));
  if (wrong.length < 2) return null;
  return choice(random, { ar: 'أكمل الآية:', en: 'Complete the ayah:' },
    [own.end, ...wrong.map((p) => ending(p.t).end)],
    { prompt: `${tail(own.start, 14)} …`, scripture: true, why: ayahRef(item) });
}

function nextAyah(random, item, next, pool) {
  if (!item.u || !next.u) return null;
  const wrong = others(pool.filter((p) => p !== item && p !== next), next, 2, random, (x) => x.t);
  if (wrong.length < 2) return null;
  return choice(random, { ar: 'ما الآية التي تأتي بعد هذه الآية؟', en: 'Which ayah comes after this one?' },
    [next, ...wrong].map((p) => clip(p.t, 10)),
    { prompt: clip(item.t, 14), scripture: true, why: ayahRef(next) });
}

function orderTrueFalse(random, a, b) {
  if (!a.u || !b.u || bare(a.t) === bare(b.t)) return null;
  const isTrue = random() < 0.5;
  const [first, second] = isTrue ? [a, b] : [b, a];
  return trueFalse({
    statement: { ar: 'الآية الثانية تأتي مباشرةً بعد الآية الأولى:', en: 'The second ayah comes directly after the first:' },
    pair: [clip(first.t, 12), clip(second.t, 12)],
  }, isTrue, { why: { ar: `${ayahRef(a).ar} ثم ${ayahRef(b).ar}`, en: `${ayahRef(a).en}, then ${ayahRef(b).en}` } });
}

function numberTrueFalse(random, item) {
  if (!item.u) return null;
  const isTrue = random() < 0.5;
  const shown = isTrue ? item.a : item.a + 1;
  const name = surahName(item.s);
  return trueFalse({
    statement: { ar: `هذه هي الآية رقم ${AR(shown)} من ${name.ar}:`, en: `This is ayah number ${shown} of ${name.en}:` },
    pair: [clip(item.t, 16)],
  }, isTrue, { why: ayahRef(item) });
}

function endingTrueFalse(random, item, pool) {
  if (words(item.t).length < 3) return null;
  const own = ending(item.t);
  const wrong = others(pool.filter((p) => p !== item && words(p.t).length >= 2), own.end, 1, random, (x) => (typeof x === 'string' ? x : ending(x.t).end));
  const isTrue = !wrong.length || random() < 0.5;
  const shown = isTrue ? own.end : ending(wrong[0].t).end;
  return trueFalse({
    statement: { ar: 'تنتهي هذه الآية بالكلمات المعروضة:', en: 'This ayah ends with the words shown:' },
    pair: [`${tail(own.start, 12)} …`, shown],
  }, isTrue, { why: ayahRef(item) });
}

/* ---------- Exercises on meanings ---------- */

const meaningOf = (item) => ({ ar: clip(item.m, 34), en: clip(item.e, 40) });

function whichMeaning(random, item, pool) {
  const wrong = others(pool.filter((p) => p !== item && bare(p.t) !== bare(item.t)), item, 2, random, (x) => x.m);
  if (wrong.length < 2) return null;
  return choice(random, { ar: 'ما معنى هذه الآية؟', en: 'What does this ayah mean?' },
    [item, ...wrong].map(meaningOf), { prompt: clip(item.t, 18), why: ayahRef(item) });
}

function whichAyah(random, item, pool) {
  const wrong = others(pool.filter((p) => p !== item && p.m !== item.m), item, 2, random, (x) => x.t);
  if (wrong.length < 2) return null;
  return choice(random, { ar: 'أيّ آية لها هذا المعنى؟', en: 'Which ayah has this meaning?' },
    [item, ...wrong].map((p) => clip(p.t, 10)), { note: meaningOf(item), scripture: true, why: ayahRef(item) });
}

function meaningTrueFalse(random, item, pool) {
  const wrong = others(pool.filter((p) => p !== item && bare(p.t) !== bare(item.t)), item, 1, random, (x) => x.m);
  const isTrue = !wrong.length || random() < 0.5;
  return trueFalse({
    statement: { ar: 'هذا المعنى هو معنى هذه الآية:', en: 'This meaning belongs to this ayah:' },
    pair: [clip(item.t, 14)],
    note: meaningOf(isTrue ? item : wrong[0]),
  }, isTrue, { why: ayahRef(item) });
}

/* ---------- Lessons about a surah (from the mushaf's own data) ---------- */

function factsSteps(random, lesson, items) {
  const n = lesson.surah;
  const info = SURAHS[n - 1];
  const name = surahName(n);
  const makkan = info.type === 'meccan';
  const kind = makkan ? { ar: 'مكية', en: 'Makkan' } : { ar: 'مدنية', en: 'Madinan' };
  const before = n > 1 ? surahName(n - 1) : null;
  const after = n < 114 ? surahName(n + 1) : null;
  const place = before && after
    ? { ar: `تأتي بعد ${before.ar} وقبل ${after.ar}.`, en: `It comes after ${before.en} and before ${after.en}.` }
    : before ? { ar: `هي آخر سورة في المصحف، وتأتي بعد ${before.ar}.`, en: `It is the last surah of the mushaf, after ${before.en}.` }
      : { ar: `هي أوّل سورة في المصحف، وبعدها ${after.ar}.`, en: `It is the first surah of the mushaf, followed by ${after.en}.` };

  const steps = [
    {
      type: 'talk', who: 'cat', mood: 'happy',
      text: {
        ar: `${name.ar} هي السورة رقم ${AR(n)} في المصحف. عدد آياتها ${AR(info.count)}، وهي سورة ${kind.ar}.`,
        en: `${name.en} is surah number ${n} in the mushaf. It has ${info.count} ayat and it is a ${kind.en} surah.`,
      },
    },
    ...quranCards(items, false).map((card) => ({ ...card, intro: { ar: `أوّل ${name.ar}:`, en: `The opening of ${name.en}:` } })),
    { type: 'talk', who: 'raccoon', mood: 'curious', text: place },
  ];

  const counts = [...new Set([info.count + 3, Math.max(3, info.count - 2), info.count + 10, info.count * 2])].filter((c) => c !== info.count).slice(0, 2);
  const numbers = [...new Set([n + 1, n - 1, n + 10, n + 3])].filter((x) => x >= 1 && x <= 114 && x !== n).slice(0, 2);
  const questions = [
    choice(random, { ar: `كم عدد آيات ${name.ar}؟`, en: `How many ayat are in ${name.en}?` },
      [info.count, ...counts].map((c) => ({ ar: AR(c), en: String(c) })), { why: { ar: `${name.ar}: ${AR(info.count)} آية.`, en: `${name.en}: ${info.count} ayat.` } }),
    trueFalse({ statement: { ar: `${name.ar} سورة مدنية.`, en: `${name.en} is a Madinan surah.` } }, !makkan,
      { why: { ar: `${name.ar} سورة ${kind.ar}.`, en: `${name.en} is ${kind.en}.` } }),
    choice(random, { ar: `ما ترتيب ${name.ar} في المصحف؟`, en: `What number is ${name.en} in the mushaf?` },
      [n, ...numbers].map((x) => ({ ar: AR(x), en: String(x) })), { why: { ar: `${name.ar} هي السورة رقم ${AR(n)}.`, en: `${name.en} is surah number ${n}.` } }),
  ];
  if (after) {
    const wrong = shuffled([n + 2, n + 3, n - 1, n - 2].filter((x) => x >= 1 && x <= 114), random).slice(0, 2).map(surahName);
    questions.push(choice(random, { ar: `ما السورة التي تأتي بعد ${name.ar}؟`, en: `Which surah comes after ${name.en}?` },
      [after, ...wrong], { why: { ar: `بعد ${name.ar} تأتي ${after.ar}.`, en: `After ${name.en} comes ${after.en}.` } }));
  }
  if (before) {
    const isTrue = random() < 0.5;
    questions.push(trueFalse({
      statement: isTrue
        ? { ar: `${before.ar} تأتي قبل ${name.ar} مباشرةً.`, en: `${before.en} comes directly before ${name.en}.` }
        : { ar: `${name.ar} تأتي قبل ${before.ar} مباشرةً.`, en: `${name.en} comes directly before ${before.en}.` },
    }, isTrue, { why: { ar: `${before.ar} ثم ${name.ar}.`, en: `${before.en}, then ${name.en}.` } }));
  }
  return [...steps, ...questions];
}

/* ---------- Lessons on a hadith ---------- */

function halves(text) {
  const w = words(text);
  const cut = Math.max(2, Math.ceil(w.length / 2));
  return { start: w.slice(0, cut).join(' '), end: w.slice(cut).join(' ') };
}

function hadithSteps(random, lesson, items, pool) {
  const item = items[0];
  // Very short sayings are practised together with the rest of the text around them.
  const said = item.q && words(item.q).length >= 5 ? item.q : item.t;
  const steps = [
    {
      type: 'talk', who: 'cat', mood: 'calm',
      text: { ar: `هذا الحديث من ${item.ref.ar}. اقرأه بتمهّل أكثر من مرة.`, en: `This hadith is from ${item.ref.en}. Read it slowly, more than once.` },
    },
    { type: 'source', kind: 'hadith', arabic: [item.t], plain: true, reference: item.ref, englishPending: true },
  ];

  const questions = [];
  const rivals = pool.filter((p) => p !== item && words(p.q ?? p.t).length >= 4);
  const own = halves(said);
  if (own.end) {
    const wrong = others(rivals, own.end, 2, random, (x) => (typeof x === 'string' ? x : halves(x.q ?? x.t).end));
    if (wrong.length === 2) {
      questions.push(choice(random, { ar: 'أكمل الحديث:', en: 'Complete the hadith:' },
        [own.end, ...wrong.map((p) => halves(p.q ?? p.t).end)].map((t) => clip(t, 14)),
        { prompt: `${clip(own.start, 16).replace(/ …$/, '')} …`, scripture: true, why: item.ref }));
      questions.push(choice(random, { ar: 'بأيّ الكلمات يبدأ هذا النص؟', en: 'With which words does this text begin?' },
        [own.start, ...wrong.map((p) => halves(p.q ?? p.t).start)].map((t) => clip(t, 10)),
        { prompt: `… ${clip(own.end, 16)}`, scripture: true, why: item.ref }));
    }
    const other = others(rivals, own.end, 1, random, (x) => (typeof x === 'string' ? x : halves(x.q ?? x.t).end))[0];
    for (let i = 0; i < 2; i += 1) {
      const isTrue = !other || random() < 0.5;
      questions.push(trueFalse({
        statement: { ar: 'هذان الجزءان من الحديث نفسه:', en: 'These two parts belong to the same hadith:' },
        pair: i === 0
          ? [clip(own.start, 12), clip(isTrue ? own.end : halves(other.q ?? other.t).end, 12)]
          : [clip(isTrue ? own.start : halves(other.q ?? other.t).start, 12), clip(own.end, 12)],
      }, isTrue, { why: item.ref }));
    }
  }
  const w = words(said);
  const last = w[w.length - 1];
  const otherLast = others(rivals, last, 2, random, (x) => (typeof x === 'string' ? x : words(x.q ?? x.t).slice(-1)[0]));
  if (otherLast.length === 2) {
    questions.push(choice(random, { ar: 'ما آخر كلمة في هذا النص؟', en: 'What is the last word of this text?' },
      [last, ...otherLast.map((p) => words(p.q ?? p.t).slice(-1)[0])],
      { prompt: `${clip(w.slice(0, -1).join(' '), 16).replace(/ …$/, '')} …`, scripture: true, why: item.ref }));
  }
  const made = questions.filter(Boolean);
  if (!made.some((q) => q.tf)) {
    const wrongWord = otherLast[0] ? words(otherLast[0].q ?? otherLast[0].t).slice(-1)[0] : null;
    const isTrue = !wrongWord || random() < 0.5;
    made.push(trueFalse({
      statement: { ar: 'ينتهي هذا النص بالكلمة المعروضة:', en: 'This text ends with the word shown:' },
      pair: [`${tail(w.slice(0, -1).join(' '), 12)} …`, isTrue ? last : wrongWord],
    }, isTrue, { why: item.ref }));
  }
  return [...steps, ...made.slice(0, 5)];
}

/* ---------- Putting a lesson together ---------- */

function ayatSteps(random, lesson, items, pool) {
  const understand = lesson.mode === 'understand';
  const span = spanRef(items);
  const intro = understand
    ? { ar: `هيّا نفهم معنى ${span.ar}. اقرأ كل آية ثم اقرأ معناها.`, en: `Let's understand ${span.en}. Read each ayah, then its meaning.` }
    : { ar: `هيّا نحفظ ${span.ar}. اقرأ الآيات بتمهّل ثلاث مرات قبل أن تكمل.`, en: `Let's memorise ${span.en}. Read the ayat slowly three times before you go on.` };
  const steps = [
    { type: 'talk', who: understand ? 'cat' : 'raccoon', mood: understand ? 'curious' : 'happy', text: intro },
    ...quranCards(items, understand),
  ];

  const made = [];
  const add = (q) => { if (q) made.push(q); };
  const order = shuffled(items, random);

  if (understand) {
    add(whichMeaning(random, order[0], pool));
    add(meaningTrueFalse(random, order[order.length - 1], pool));
    if (order[1]) add(whichAyah(random, order[1], pool));
    add(completeAyah(random, order[0], pool));
    if (order[1]) add(meaningTrueFalse(random, order[1], pool));
  } else {
    add(completeAyah(random, order[0], pool));
    if (items.length > 1) {
      const i = Math.floor(random() * (items.length - 1));
      add(nextAyah(random, items[i], items[i + 1], pool));
      const j = Math.floor(random() * (items.length - 1));
      add(orderTrueFalse(random, items[j], items[j + 1]));
    }
    add(numberTrueFalse(random, order[order.length - 1]));
    if (order[1]) add(completeAyah(random, order[1], pool));
    add(endingTrueFalse(random, order[order.length > 2 ? 2 : 0], pool));
  }

  // Every lesson has at least one multiple-choice and one true/false question.
  if (!made.some((q) => q.tf)) add(endingTrueFalse(random, order[0], pool) ?? numberTrueFalse(random, order[0]));
  if (!made.some((q) => !q.tf)) add(completeAyah(random, order[0], pool) ?? whichMeaning(random, order[0], pool));
  return [...steps, ...made.slice(0, 6)];
}

/**
 * @param {object} lesson  one lesson from an island file (or a hand-written lesson with `steps`)
 * @param {object[]} pool  every text of the island (used for wrong options)
 * @returns {object[]} the steps for the lesson player
 */
export function buildSteps(lesson, pool) {
  const goal = { type: 'goal', title: lesson.title, objective: lesson.objective, level: lesson.level ?? 1 };
  if (lesson.steps) return [goal, ...lesson.steps];

  const random = seeded(lesson.id);
  const items = lesson.items.map((i) => pool[i]);
  const body = lesson.mode === 'facts' ? factsSteps(random, lesson, items)
    : lesson.mode === 'hadith' ? hadithSteps(random, lesson, items, pool)
      : ayatSteps(random, lesson, items, pool);
  return [goal, ...body];
}
