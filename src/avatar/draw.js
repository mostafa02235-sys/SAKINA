// Draws the player's avatar: a small cartoon person in the same outlined style
// as Mr. Raccoon and Mr. Qattout. Canvas 200 x 260, feet near y = 246.
//
//   renderAvatar(save.avatar, { view: 'front', mood: 'grin' })
//
// Views: 'front', 'left', 'right' (the face turns) and 'back'.

import { shade, esc } from '../core/dom.js';

const INK = '#1d2a4d';
const line = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
const thin = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;

const tube = (d, color, width) => `
  <path d="${d}" fill="none" stroke="${INK}" stroke-width="${width + 10}" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;

/* ---------- Head ---------- */

const FACES = {
  round: '<ellipse cx="100" cy="86" rx="52" ry="50"',
  oval: '<ellipse cx="100" cy="86" rx="46" ry="54"',
  square: '<rect x="50" y="38" width="100" height="98" rx="30"',
  heart: '<path d="M100 36 C138 36 154 60 151 86 C148 116 124 138 100 138 C76 138 52 116 49 86 C46 60 62 36 100 36 Z"',
};

const HAIR_TOP = 'M48 82 C44 44 72 26 100 26 C128 26 156 44 152 82 C142 62 124 54 100 54 C76 54 58 62 48 82 Z';

const HAIR_BACK = {
  long: (c) => `<path d="M42 84 C38 40 70 22 100 22 C130 22 162 40 158 84 L162 152 Q132 162 100 160 Q68 162 38 152 Z" fill="${c}" ${line}/>`,
  pony: (c) => `<path d="M146 60 Q184 72 176 130 Q162 118 150 96 Z" fill="${c}" ${line}/>`,
  bun: (c) => `<circle cx="100" cy="24" r="17" fill="${c}" ${line}/>`,
};

const HAIR_FRONT = {
  short: (c) => `<path d="${HAIR_TOP}" fill="${c}" ${line}/>`,
  long: (c) => `<path d="${HAIR_TOP}" fill="${c}" ${line}/>`,
  bun: (c) => `<path d="${HAIR_TOP}" fill="${c}" ${line}/>`,
  pony: (c) => `<path d="${HAIR_TOP}" fill="${c}" ${line}/>`,
  spiky: (c) => `<path d="M48 80 L52 46 L64 58 L72 28 L88 48 L100 20 L112 48 L128 28 L136 58 L148 46 L152 80 C140 62 122 54 100 54 C78 54 60 62 48 80 Z" fill="${c}" ${line}/>`,
  curly: (c) => `
    <path d="${HAIR_TOP}" fill="${c}" ${line}/>
    <circle cx="60" cy="56" r="15" fill="${c}" ${line}/><circle cx="80" cy="40" r="16" fill="${c}" ${line}/>
    <circle cx="102" cy="34" r="16" fill="${c}" ${line}/><circle cx="124" cy="40" r="16" fill="${c}" ${line}/>
    <circle cx="142" cy="56" r="15" fill="${c}" ${line}/>
    <path d="M58 62 Q100 40 144 62 Q124 52 100 52 Q76 52 58 62 Z" fill="${c}"/>`,
  side: (c) => `<path d="M46 86 C42 44 74 24 106 26 C136 28 158 50 153 86 C148 68 138 58 126 54 C106 72 78 74 46 86 Z" fill="${c}" ${line}/>`,
  none: () => '',
};

// The whole back of the head, for the back view.
const HEAD_BACK = (c) => `<path d="M48 90 C44 46 72 26 100 26 C128 26 156 46 152 90 C150 120 128 138 100 138 C72 138 50 120 48 90 Z" fill="${c}" ${line}/>`;

const HEADWEAR_BACK = {
  ghutra: (c) => `<path d="M42 78 C38 36 70 18 100 18 C130 18 162 36 158 78 L170 160 Q150 170 134 160 L128 108 L72 108 L66 160 Q50 170 30 160 Z" fill="${c}" ${line}/>`,
  hijab: (c) => `<path d="M100 20 C144 20 164 52 162 92 C160 130 152 152 140 168 L60 168 C48 152 40 130 38 92 C36 52 56 20 100 20 Z" fill="${c}" ${line}/>`,
};

const HEADWEAR = {
  cap: (c) => `
    <path d="M52 70 C52 40 74 26 100 26 C126 26 148 40 148 70 Z" fill="${c}" ${line}/>
    <path d="M48 68 H152 Q180 70 174 86 Q140 76 100 76 Q66 76 48 78 Z" fill="${shade(c, -0.18)}" ${line}/>
    <circle cx="100" cy="27" r="5" fill="${shade(c, -0.18)}" ${thin}/>`,
  beanie: (c) => `
    <path d="M50 68 C50 36 74 22 100 22 C126 22 150 36 150 68 Z" fill="${c}" ${line}/>
    <rect x="46" y="60" width="108" height="18" rx="9" fill="${shade(c, 0.35)}" ${line}/>
    <circle cx="100" cy="18" r="10" fill="${shade(c, 0.35)}" ${line}/>`,
  kufi: (c) => `
    <path d="M56 64 C58 40 78 28 100 28 C122 28 142 40 144 64 Z" fill="${c}" ${line}/>
    <path d="M56 56 Q100 44 144 56" fill="none" ${thin}/>`,
  ghutra: (c) => `
    <path d="M50 74 C50 42 74 24 100 24 C126 24 150 42 150 74 C136 58 120 52 100 52 C80 52 64 58 50 74 Z" fill="${c}" ${line}/>
    <path d="M56 54 Q100 32 144 54" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`,
  explorer: (c) => `
    <ellipse cx="100" cy="58" rx="68" ry="13" fill="${c}" ${line}/>
    <path d="M64 58 C64 30 80 20 100 20 C120 20 136 30 136 58 Z" fill="${c}" ${line}/>
    <path d="M65 50 H135" fill="none" stroke="${shade(c, -0.3)}" stroke-width="7"/>`,
  graduate: () => `
    <path d="M62 50 V66 Q100 80 138 66 V50" fill="#39406a" ${line}/>
    <path d="M36 44 L100 22 L164 44 L100 66 Z" fill="#39406a" ${line}/>
    <path d="M100 44 L150 52 V74" fill="none" stroke="#ffbf3c" stroke-width="4" stroke-linecap="round"/>
    <circle cx="150" cy="78" r="5" fill="#ffbf3c" ${thin}/>`,
  hijab: () => '',
  none: () => '',
};

function eye(style, x, y) {
  switch (style) {
    case 'almond':
      return `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" fill="${INK}"/><circle cx="${x + 2.5}" cy="${y - 2}" r="2" fill="#fff"/>
              <path d="M${x - 9} ${y - 4} Q${x} ${y - 11} ${x + 10} ${y - 5}" fill="none" ${thin}/>`;
    case 'sparkle':
      return `<circle cx="${x}" cy="${y}" r="9" fill="${INK}"/><circle cx="${x + 3}" cy="${y - 3}" r="3" fill="#fff"/><circle cx="${x - 3}" cy="${y + 3}" r="1.6" fill="#fff"/>`;
    case 'sleepy':
      return `<circle cx="${x}" cy="${y + 1}" r="7" fill="${INK}"/><rect x="${x - 9}" y="${y - 9}" width="18" height="8" fill="var(--avatar-skin)"/>
              <path d="M${x - 9} ${y - 1} H${x + 9}" fill="none" ${thin}/>`;
    default:
      return `<circle cx="${x}" cy="${y}" r="7" fill="${INK}"/><circle cx="${x + 2.5}" cy="${y - 2.5}" r="2.2" fill="#fff"/>`;
  }
}

function face(config, mood, dx) {
  const cx = 100 + dx;
  const L = cx - 20;
  const R = cx + 20;
  const y = 90;
  const brow = (x, tilt, lift) => `<path d="M${x - 9} ${y - 17 - lift + tilt} Q${x} ${y - 21 - lift} ${x + 9} ${y - 17 - lift - tilt}" fill="none" ${thin}/>`;
  const closed = (x) => `<path d="M${x - 8} ${y} Q${x} ${y + 8} ${x + 8} ${y}" fill="none" ${thin}/>`;
  let eyes = eye(config.eyes, L, y) + eye(config.eyes, R, y);
  let brows = brow(L, 0, 0) + brow(R, 0, 0);
  let mouth;
  switch (mood) {
    case 'grin':
      mouth = `<path d="M${cx - 13} 111 Q${cx} 131 ${cx + 13} 111 Z" fill="#7a2f45" ${thin}/><path d="M${cx - 6} 120 Q${cx} 116 ${cx + 6} 120 Q${cx} 126 ${cx - 6} 120 Z" fill="#ff8fa3"/>`;
      brows = brow(L, 0, 3) + brow(R, 0, 3);
      break;
    case 'calm':
      eyes = closed(L) + closed(R);
      mouth = `<path d="M${cx - 8} 114 Q${cx} 121 ${cx + 8} 114" fill="none" ${thin}/>`;
      break;
    case 'surprised':
      brows = brow(L, 1, 6) + brow(R, -1, 6);
      mouth = `<ellipse cx="${cx}" cy="118" rx="6" ry="8" fill="#7a2f45" ${thin}/>`;
      break;
    case 'sad':
      brows = brow(L, 5, 0) + brow(R, -5, 0);
      mouth = `<path d="M${cx - 9} 121 Q${cx} 112 ${cx + 9} 121" fill="none" ${thin}/>`;
      break;
    default:
      mouth = `<path d="M${cx - 11} 112 Q${cx} 124 ${cx + 11} 112" fill="none" ${thin}/>`;
  }
  const glasses = {
    round: `<circle cx="${L}" cy="${y}" r="13" fill="#fff" fill-opacity=".25" ${thin}/><circle cx="${R}" cy="${y}" r="13" fill="#fff" fill-opacity=".25" ${thin}/><path d="M${L + 13} ${y} H${R - 13}" ${thin}/>`,
    square: `<rect x="${L - 13}" y="${y - 11}" width="26" height="22" rx="5" fill="#fff" fill-opacity=".25" ${thin}/><rect x="${R - 13}" y="${y - 11}" width="26" height="22" rx="5" fill="#fff" fill-opacity=".25" ${thin}/><path d="M${L + 13} ${y} H${R - 13}" ${thin}/>`,
    gold: `<circle cx="${L}" cy="${y}" r="13" fill="#fff" fill-opacity=".3" stroke="#e0932a" stroke-width="5"/><circle cx="${R}" cy="${y}" r="13" fill="#fff" fill-opacity=".3" stroke="#e0932a" stroke-width="5"/><path d="M${L + 13} ${y} H${R - 13}" stroke="#e0932a" stroke-width="5" stroke-linecap="round"/>`,
    star: `<circle cx="${L}" cy="${y}" r="13" fill="#ffbf3c" fill-opacity=".55" ${thin}/><circle cx="${R}" cy="${y}" r="13" fill="#ffbf3c" fill-opacity=".55" ${thin}/><path d="M${L + 13} ${y} H${R - 13}" ${thin}/>`,
  }[config.glasses] ?? '';
  return `
    <ellipse cx="${cx - 32}" cy="106" rx="8" ry="5" fill="#ff8fa3" opacity=".45"/>
    <ellipse cx="${cx + 32}" cy="106" rx="8" ry="5" fill="#ff8fa3" opacity=".45"/>
    ${brows}<g class="av-eyes">${eyes}</g>
    <path d="M${cx - 2 + dx * 0.3} 101 q${2 + dx * 0.2} 3 ${4 + dx * 0.2} 0" fill="none" ${thin}/>
    ${mouth}${glasses}`;
}

/* ---------- Body ---------- */

const LONG = new Set(['thobe', 'abaya']);

function body(config, back) {
  const skin = config.skin;
  const top = config.topColor;
  const deep = shade(top, -0.22);
  const long = LONG.has(config.top);
  const sleeve = config.top === 'tshirt' ? skin : top;
  const armL = 'M72 156 Q54 174 58 200';
  const armR = 'M128 156 Q146 174 142 200';

  const legs = `
    <ellipse cx="86" cy="246" rx="15" ry="8" fill="${INK}"/><ellipse cx="114" cy="246" rx="15" ry="8" fill="${INK}"/>
    ${long ? '' : `<rect x="76" y="198" width="21" height="44" rx="8" fill="${config.bottomColor}" ${line}/><rect x="103" y="198" width="21" height="44" rx="8" fill="${config.bottomColor}" ${line}/>`}`;

  const torso = long
    ? `<path d="M70 148 Q100 138 130 148 L${config.top === 'abaya' ? 148 : 140} 240 Q100 250 ${config.top === 'abaya' ? 52 : 60} 240 Z" fill="${top}" ${line}/>`
    : `<path d="M70 148 Q100 138 130 148 L136 206 Q100 214 64 206 Z" fill="${config.top === 'jacket' ? '#fff9ec' : top}" ${line}/>`;

  let detail = '';
  if (!back) {
    if (config.top === 'shirt') detail = `<path d="M88 146 L100 160 L112 146" fill="#fff" ${thin}/><path d="M100 162 V206" ${thin}/><circle cx="100" cy="176" r="2.5" fill="${INK}"/><circle cx="100" cy="192" r="2.5" fill="${INK}"/>`;
    if (config.top === 'jacket') detail = `<path d="M70 148 Q84 142 92 146 L88 208 Q74 208 64 206 Z" fill="${top}" ${line}/><path d="M130 148 Q116 142 108 146 L112 208 Q126 208 136 206 Z" fill="${top}" ${line}/>`;
    if (config.top === 'hoodie') detail = `<path d="M82 146 Q100 166 118 146" fill="${deep}" ${thin}/><path d="M82 186 H118 V202 H82 Z" fill="${deep}" ${thin}/><path d="M95 160 V172 M105 160 V172" ${thin}/>`;
    if (config.top === 'thobe') detail = `<path d="M100 146 V184" ${thin}/><circle cx="100" cy="160" r="2.5" fill="${INK}"/><circle cx="100" cy="172" r="2.5" fill="${INK}"/>`;
    if (config.top === 'abaya') detail = `<path d="M100 150 V240" fill="none" stroke="${deep}" stroke-width="4"/><path d="M60 232 Q100 242 140 232" fill="none" stroke="${deep}" stroke-width="4"/>`;
    if (config.top === 'tshirt') detail = `<path d="M86 146 Q100 156 114 146" fill="none" ${thin}/>`;
  }

  const shortSleeves = config.top === 'tshirt'
    ? tube('M72 156 Q64 162 62 172', top, 16) + tube('M128 156 Q136 162 138 172', top, 16) : '';
  const arms = `${tube(armL, sleeve, 14)}${tube(armR, sleeve, 14)}${shortSleeves}
    <circle cx="58" cy="202" r="9" fill="${skin}" ${thin}/><circle cx="142" cy="202" r="9" fill="${skin}" ${thin}/>`;

  const hood = config.top === 'hoodie' ? `<path d="M68 150 Q100 118 132 150 Q100 162 68 150 Z" fill="${deep}" ${line}/>` : '';
  return { legs, torso: torso + detail, arms, hood };
}

function pack(config, back) {
  const c = config.packColor;
  if (config.pack === 'backpack') {
    return back
      ? `<rect x="68" y="146" width="64" height="62" rx="16" fill="${c}" ${line}/><rect x="80" y="172" width="40" height="24" rx="8" fill="${shade(c, -0.2)}" ${thin}/><path d="M86 146 Q100 132 114 146" fill="none" ${line}/>`
      : `<path d="M78 148 L74 204 M122 148 L126 204" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>
         <path d="M78 148 L74 204 M122 148 L126 204" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
  }
  if (config.pack === 'satchel') {
    return back
      ? `<path d="M126 150 L74 196" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M126 150 L74 196" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`
      : `<path d="M74 150 L128 196" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M74 150 L128 196" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
         <rect x="114" y="188" width="32" height="26" rx="8" fill="${c}" ${line}/><path d="M114 197 Q130 208 146 197" fill="none" ${thin}/>`;
  }
  return '';
}

const EXTRA = {
  trophy: `<path d="M128 176 h28 v9 a14 14 0 0 1 -28 0 Z" fill="#ffbf3c" ${thin}/><path d="M128 179 h-6 q0 9 8 10 M156 179 h6 q0 9 -8 10" fill="none" ${thin}/><path d="M142 199 v7 M133 209 h18" fill="none" ${line}/>`,
  flag: `<path d="M58 206 V140" fill="none" ${line}/><path d="M58 142 l26 9 l-26 9 Z" fill="#ff7a66" ${thin}/>`,
  book: `<rect x="40" y="186" width="34" height="26" rx="4" fill="#2f93b0" ${line}/><path d="M57 186 V212" ${thin}/><path d="M46 194 H52 M62 194 H68" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  lantern: `<circle cx="142" cy="222" r="22" fill="#ffe28a" opacity=".45"/><path d="M134 208 q8 -10 16 0" fill="none" ${thin}/><rect x="132" y="208" width="20" height="24" rx="5" fill="#fff3b8" ${thin}/><path d="M142 208 v24" ${thin}/><rect x="130" y="232" width="24" height="6" rx="3" fill="#b9783d" ${thin}/>`,
  badge: `<path d="M84 162 l-4 -14 h12 Z" fill="#ff7a66" ${thin}/><circle cx="86" cy="170" r="10" fill="#ffbf3c" ${thin}/><circle cx="86" cy="170" r="4" fill="#fff"/>`,
};

/* ---------- The avatar ---------- */

export function renderAvatar(config, options = {}) {
  const { view = 'front', mood = config.mood, label = '', still = false } = options;
  const back = view === 'back';
  const dx = view === 'left' ? -10 : view === 'right' ? 10 : 0;
  const hijab = config.head === 'hijab';
  const hair = hijab ? '' : config.hairColor;
  const b = body(config, back);
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';

  let head;
  if (back) {
    const cover = hijab ? HEADWEAR_BACK.hijab(config.headColor)
      : config.head === 'ghutra' ? `${HEADWEAR_BACK.hijab(config.headColor)}<path d="M56 54 Q100 32 144 54" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`
        : `${(HAIR_BACK[config.hair] ?? (() => ''))(hair)}${HEAD_BACK(config.hair === 'none' ? config.skin : hair)}`;
    head = `${cover}${hijab || config.head === 'ghutra' ? '' : HEADWEAR[config.head]?.(config.headColor) ?? ''}`;
  } else {
    const ears = hijab ? '' : `<circle cx="${50 - dx * 0.5}" cy="92" r="10" fill="${config.skin}" ${line}/><circle cx="${150 - dx * 0.5}" cy="92" r="10" fill="${config.skin}" ${line}/>`;
    const skull = hijab
      ? `<ellipse cx="${100 + dx * 0.4}" cy="90" rx="40" ry="44" fill="${config.skin}" ${line}/>`
      : `${FACES[config.face] ?? FACES.round} fill="${config.skin}" ${line}/>`;
    head = `
      ${hijab ? HEADWEAR_BACK.hijab(config.headColor) : ''}
      ${config.head === 'ghutra' ? HEADWEAR_BACK.ghutra(config.headColor) : ''}
      ${hijab ? '' : (HAIR_BACK[config.hair] ?? (() => ''))(hair)}
      ${ears}${skull}
      ${hijab ? '' : `<g transform="translate(${dx * 0.35} 0)">${(HAIR_FRONT[config.hair] ?? HAIR_FRONT.none)(hair)}</g>`}
      ${HEADWEAR[config.head]?.(config.headColor) ?? ''}
      ${face(config, mood, dx)}`;
  }

  const scarf = config.scarf === 'scarf' && !hijab
    ? `<path d="M68 140 Q100 158 132 140 L134 152 Q100 172 66 152 Z" fill="${config.scarfColor}" ${line}/>${back ? '' : `<path d="M112 154 L126 186 L112 180 L106 190 L100 158 Z" fill="${config.scarfColor}" ${line}/>`}`
    : '';

  return `
    <svg class="avatar avatar--${view}${still ? ' is-still' : ''}" viewBox="0 0 200 260" style="--avatar-skin:${config.skin}" ${a11y}>
      <ellipse cx="100" cy="250" rx="50" ry="8" fill="${INK}" opacity=".16"/>
      <g class="av-all">
        ${back ? '' : pack(config, false) && config.pack === 'backpack' ? `<rect x="62" y="150" width="76" height="50" rx="16" fill="${config.packColor}" ${line}/>` : ''}
        ${b.legs}${b.hood}
        <rect x="91" y="130" width="18" height="20" rx="6" fill="${config.skin}" ${line}/>
        ${b.torso}${back ? '' : pack(config, false)}${b.arms}
        ${back ? pack(config, true) : EXTRA[config.extra] ?? ''}
        ${scarf}
        <g class="av-head">${head}</g>
      </g>
    </svg>`;
}

/** A random avatar from the options the player has unlocked. */
export function randomAvatar(catalog, allowed) {
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const id = (key) => pick(catalog[key].filter(allowed)).id;
  return {
    face: id('face'), skin: pick(catalog.skin), hair: id('hair'), hairColor: pick(catalog.hairColor), eyes: id('eyes'), mood: id('mood'),
    head: id('head'), headColor: pick(catalog.cloth), top: id('top'), topColor: pick(catalog.cloth), bottomColor: pick(catalog.cloth),
    glasses: id('glasses'), pack: id('pack'), packColor: pick(catalog.cloth), scarf: id('scarf'), scarfColor: pick(catalog.cloth), extra: id('extra'),
  };
}
