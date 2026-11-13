// Draws achievement badges and medals in SAKINA's outlined cartoon style.
//
// A badge is: the shape and colour of its category + a ring coloured by its
// tier + an emblem. A medal is: a ribbon + a disc shaped by its rarity + an
// emblem. So every definition in data/awards.js gets its own picture without
// anyone having to draw it by hand.

import { CATEGORIES } from '../data/awards.js';

const INK = '#1d2a4d';
const PAPER = '#fff9ec';

/* ---------- Emblems (drawn on a 24 x 24 grid) ---------- */

const s = `stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`;
const EMBLEMS = {
  book: (f) => `<path d="M12 7C9.5 5.2 6 5 3.5 6v12c2.5-1 6-.8 8.5 1 2.5-1.8 6-2 8.5-1V6C18 5 14.5 5.2 12 7z" fill="${f}" ${s}/><path d="M12 7v12" ${s}/>`,
  star: (f) => `<path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.5 1.2 6.4L12 17.1l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z" fill="${f}" ${s}/>`,
  flame: (f) => `<path d="M12 2.5c1 3.5 5.5 5.6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.2 1-3.6 2-4.8.4 1.6 1.2 2.4 2 2.6-.4-3 .2-6.3 1.5-8.8z" fill="${f}" ${s}/>`,
  island: (f) => `<path d="M3 11.5q1 5 4.5 5.5l1 3 1.8-2.8q1.5 3 1.9 3.8 1.5-1.5 2-3.9l1.5 1.7 1-2.4q3.3-.5 4.3-4.9z" fill="#8a6fb0" ${s}/><ellipse cx="12" cy="11" rx="9.5" ry="3.2" fill="${f}" ${s}/>`,
  flag: (f) => `<path d="M6 21V3.5" ${s}/><path d="M6 4.5h11.5l-2.8 4 2.8 4H6z" fill="${f}" ${s}/>`,
  moon: (f) => `<path d="M15 3a9 9 0 1 0 6 15.5A8 8 0 0 1 15 3z" fill="${f}" ${s}/>`,
  sun: (f) => `<circle cx="12" cy="12" r="4.6" fill="${f}" ${s}/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3L7 7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" ${s}/>`,
  target: (f) => `<circle cx="12" cy="12" r="9" fill="#fff" ${s}/><circle cx="12" cy="12" r="5.6" fill="${f}" ${s}/><circle cx="12" cy="12" r="2" fill="${INK}"/>`,
  bolt: (f) => `<path d="M13 2L5 13.5h5.5L9.5 22 19 10h-5.5z" fill="${f}" ${s}/>`,
  compass: (f) => `<circle cx="12" cy="12" r="9" fill="#fff" ${s}/><path d="M15.8 8.2l-2.3 5.3-5.3 2.3 2.3-5.3z" fill="${f}" ${s}/>`,
  mountain: (f) => `<path d="M2.5 19.5L9 7l4 6.5 2.5-3.5 6 9.5z" fill="${f}" ${s}/><path d="M7 11l2 1.5 2-1.5" fill="none" ${s}/>`,
  calendar: (f) => `<rect x="4" y="5" width="16" height="15" rx="2.5" fill="#fff" ${s}/><path d="M4 9.5h16V7.5A2.5 2.5 0 0 0 17.5 5h-11A2.5 2.5 0 0 0 4 7.5z" fill="${f}" ${s}/><path d="M8 3v3.5M16 3v3.5M8.5 14.5l2.5 2.5 4.5-4.5" fill="none" ${s}/>`,
  lantern: (f) => `<path d="M9 5q3-4 6 0" fill="none" ${s}/><path d="M7.5 7.5h9L15 5H9z" fill="#b9783d" ${s}/><rect x="7.5" y="7.5" width="9" height="11" rx="2" fill="${f}" ${s}/><path d="M12 7.5v11" ${s}/><rect x="6.5" y="18.5" width="11" height="2.5" rx="1.2" fill="#b9783d" ${s}/>`,
  quill: (f) => `<path d="M19.5 3.5C13 4 7.5 8.5 6 16l1.5 1.5c7-1 11-6 12-14z" fill="${f}" ${s}/><path d="M4 20.5l3.5-4.5M10 13l3.5.5" fill="none" ${s}/>`,
  trophy: (f) => `<path d="M7 4h10v4.5a5 5 0 0 1-10 0z" fill="${f}" ${s}/><path d="M7 5.5H4.5q0 4 3 4.5M17 5.5h2.5q0 4-3 4.5M12 13.5V17M8 20.5h8l-1-3.5H9z" fill="${f}" ${s}/>`,
  gem: (f) => `<path d="M6.5 4h11l4 5.5L12 21 2.5 9.5z" fill="${f}" ${s}/><path d="M2.5 9.5h19M9 9.5L12 21l3-11.5M9 9.5L10 4M15 9.5L14 4" fill="none" ${s}/>`,
  shield: (f) => `<path d="M12 2.5l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z" fill="${f}" ${s}/><path d="M8.5 12l2.5 2.5 4.5-4.5" fill="none" ${s}/>`,
  leaf: (f) => `<path d="M4.5 19.5C4 10 10 4.5 20 4.5 20 14 14.5 20 4.5 19.5z" fill="${f}" ${s}/><path d="M4.5 19.5L14 10" ${s}/>`,
  key: (f) => `<circle cx="8" cy="8" r="4.5" fill="${f}" ${s}/><path d="M11.2 11.2l8.3 8.3M16 16l2.5-2.5M18.5 18.5L20.5 16.5" fill="none" ${s}/>`,
  heart: (f) => `<path d="M12 20.5C5 15.5 3 12 3 8.5A4.5 4.5 0 0 1 12 6.5 4.5 4.5 0 0 1 21 8.5c0 3.5-2 7-9 12z" fill="${f}" ${s}/>`,
  check: (f) => `<circle cx="12" cy="12" r="9" fill="${f}" ${s}/><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`,
  steps: (f) => `<path d="M3 20.5V16h5v-4.5h5V7h5V3.5h3v17z" fill="${f}" ${s}/>`,
};

/** The names of every emblem that can be used in data/awards.js. */
export const EMBLEM_NAMES = Object.keys(EMBLEMS);

const emblem = (name, fill, x, y, scale) => `<g transform="translate(${x} ${y}) scale(${scale})">${(EMBLEMS[name] ?? EMBLEMS.star)(fill)}</g>`;

/* ---------- Shapes ---------- */

const point = (cx, cy, r, a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
const polygon = (n, r, cx, cy, rot = -Math.PI / 2) => Array.from({ length: n }, (_, i) => point(cx, cy, r, rot + (i * 2 * Math.PI) / n)).join(' ');
const starburst = (n, outer, inner, cx, cy) => Array.from({ length: n * 2 }, (_, i) => point(cx, cy, i % 2 ? inner : outer, -Math.PI / 2 + (i * Math.PI) / n)).join(' ');

const outline = `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
const SHAPES = {
  circle: (f) => `<circle cx="50" cy="50" r="42" fill="${f}" ${outline}/>`,
  square: (f) => `<rect x="9" y="9" width="82" height="82" rx="20" fill="${f}" ${outline}/>`,
  hexagon: (f) => `<polygon points="${polygon(6, 45, 50, 50)}" fill="${f}" ${outline}/>`,
  octagram: (f) => `<polygon points="${starburst(8, 46, 37, 50, 50)}" fill="${f}" ${outline}/>`,
  sun: (f) => `<polygon points="${starburst(12, 46, 38, 50, 50)}" fill="${f}" ${outline}/>`,
  shield: (f) => `<path d="M50 6 L88 19 V50 C88 73 71 88 50 95 C29 88 12 73 12 50 V19 Z" fill="${f}" ${outline}/>`,
  diamond: (f) => `<polygon points="${polygon(4, 47, 50, 50)}" fill="${f}" ${outline}/>`,
  scallop: (f) => `<polygon points="${starburst(10, 46, 40, 50, 50)}" fill="${f}" ${outline}/>`,
};

const TIER_RING = ['#cd8a52', '#cd8a52', '#c3cce0', '#ffbf3c', '#b57be0'];
const GREY = { fill: '#d9ddea', ring: '#c3c8d8', emblem: '#eef1fa' };

/* ---------- Achievement badge ---------- */

export function drawBadge(def, { locked = false } = {}) {
  const category = CATEGORIES.find((c) => c.id === def.cat);
  const fill = locked ? GREY.fill : category.color;
  const ring = locked ? GREY.ring : TIER_RING[def.tier];
  const pips = Array.from({ length: def.tier }, (_, i) => `<circle cx="${50 + (i - (def.tier - 1) / 2) * 9}" cy="83" r="3.2" fill="${ring}" stroke="${INK}" stroke-width="1.5"/>`).join('');
  return `
    <svg class="award-art award-art--badge${locked ? ' is-locked' : ''}" viewBox="0 0 100 100" aria-hidden="true">
      ${SHAPES[category.shape](fill)}
      <circle cx="50" cy="48" r="29" fill="${ring}" stroke="${INK}" stroke-width="3"/>
      <circle cx="50" cy="48" r="23" fill="${locked ? '#f3f5fb' : PAPER}" stroke="${INK}" stroke-width="2.5"/>
      ${emblem(def.emblem, locked ? GREY.emblem : category.color, 31, 29, 1.58)}
      ${pips}
    </svg>`;
}

/* ---------- Medal ---------- */

const METAL = {
  bronze: { main: '#d08b4f', light: '#f0c39a', deep: '#a9683a' },
  silver: { main: '#b9c2d8', light: '#eef1f8', deep: '#8f99b4' },
  gold: { main: '#ffbf3c', light: '#ffe9a8', deep: '#e0932a' },
  special: { main: '#b57be0', light: '#ecd9fb', deep: '#8452b8' },
};

const DISC = {
  bronze: (m) => `<circle cx="50" cy="84" r="36" fill="${m.main}" ${outline}/>`,
  silver: (m) => `<polygon points="${starburst(16, 38, 33.5, 50, 84)}" fill="${m.main}" ${outline}/>`,
  gold: (m) => `<polygon points="${starburst(10, 40, 32, 50, 84)}" fill="${m.main}" ${outline}/>`,
  special: (m) => `<polygon points="${starburst(8, 41, 30, 50, 84)}" fill="${m.deep}" ${outline}/><polygon points="${polygon(8, 33, 50, 84, Math.PI / 8)}" fill="${m.main}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
};

function darker(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.round(v * 0.72).toString(16).padStart(2, '0');
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`;
}

export function drawMedal(def, { locked = false } = {}) {
  const metal = locked ? { main: GREY.fill, light: '#f3f5fb', deep: GREY.ring } : METAL[def.rarity];
  const ribbon = locked ? GREY.ring : def.ribbon;
  return `
    <svg class="award-art award-art--medal award-art--${def.rarity}${locked ? ' is-locked' : ''}" viewBox="0 0 100 126" aria-hidden="true">
      <path d="M26 3 H47 L57 52 H37 Z" fill="${ribbon}" ${outline}/>
      <path d="M74 3 H53 L43 52 H63 Z" fill="${locked ? GREY.fill : darker(ribbon)}" ${outline}/>
      ${DISC[def.rarity](metal)}
      <circle cx="50" cy="84" r="24" fill="${metal.light}" stroke="${INK}" stroke-width="2.5"/>
      ${emblem(def.emblem, locked ? GREY.emblem : metal.main, 32, 66, 1.5)}
      ${def.rarity === 'special' && !locked ? '<path d="M14 58l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z M86 100l1.2 3.2 3.2 1.2-3.2 1.2-1.2 3.2-1.2-3.2-3.2-1.2 3.2-1.2z" fill="#ffe28a" stroke="#1d2a4d" stroke-width="1.5" stroke-linejoin="round"/>' : ''}
    </svg>`;
}

/** The picture for any award: { type: 'achievement' | 'medal', def }. */
export function drawAward(type, def, options) {
  return type === 'medal' ? drawMedal(def, options) : drawBadge(def, options);
}
