// Draws a floating island: a grassy top, a rocky underside, one landmark and
// some small decoration. Canvas is 240 x 210; the top surface is centred on (120, 100).
//
// Each island's look (colours, landmark, underside shape, decoration) comes
// from the catalog, so 230+ islands are drawn by this one function.

import { LANDMARKS } from './landmarks.js';

const INK = '#1d2a4d';
const line = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
const thin = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

// Four different undersides: [outline, shaded facets]
const UNDERSIDES = [
  ['M26 102 Q36 146 66 150 L76 178 L92 152 Q108 190 124 200 Q140 182 148 154 L162 170 L172 148 Q206 142 214 102 Z',
    'M92 152 Q108 190 124 200 Q118 170 122 120 L84 120 Z M172 148 Q206 142 214 102 L176 112 Z'],
  ['M26 102 Q30 138 58 146 L70 166 L84 150 Q100 170 112 196 L128 160 Q150 176 160 150 Q198 146 214 102 Z',
    'M84 150 Q100 170 112 196 L128 160 L120 118 L80 118 Z M160 150 Q198 146 214 102 L170 112 Z'],
  ['M26 102 Q44 132 60 136 Q70 168 96 172 Q110 204 126 172 Q156 170 166 140 Q200 134 214 102 Z',
    'M96 172 Q110 204 126 172 L122 118 L92 118 Z M166 140 Q200 134 214 102 L172 110 Z'],
  ['M26 102 Q34 150 62 152 L66 184 L86 158 L100 188 L116 160 Q134 196 150 158 L166 172 L174 146 Q204 140 214 102 Z',
    'M100 188 L116 160 Q134 196 150 158 L140 118 L104 118 Z M174 146 Q204 140 214 102 L178 110 Z'],
];

const bush = (x, y, color) => `<path d="M${x - 12} ${y} q-2 -12 8 -10 q4 -10 12 -2 q10 -2 6 12 Z" fill="${color}" ${thin}/>`;
const DECOR = [
  () => '',
  (c) => bush(44, 108, c.grassDeep) + bush(200, 104, c.grassDeep),
  () => `<path d="M34 108 l8 -12 l10 4 l4 10 Z" fill="#cfd5ea" ${thin}/><path d="M192 108 l6 -9 l9 3 l2 8 Z" fill="#cfd5ea" ${thin}/>`,
  () => [[40, 106, '#ff7a66'], [52, 112, '#ffbf3c'], [196, 108, '#f06fa5'], [206, 102, '#fff9ec']].map(([x, y, f]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${f}" ${thin}/>`).join(''),
  () => `<path d="M42 108 V78" ${line}/><path d="M42 78 l16 6 l-16 6 Z" fill="#ff7a66" ${thin}/>`,
  (c) => `<path d="M200 106 V86" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M200 106 V86" fill="none" stroke="#b9783d" stroke-width="3" stroke-linecap="round"/><circle cx="200" cy="78" r="13" fill="${c.grassDeep}" ${thin}/>`,
];

export function drawIsland(island, { label = '' } = {}) {
  const c = island.look;
  const [outline, facets] = UNDERSIDES[c.shape % UNDERSIDES.length];
  const landmark = LANDMARKS[c.mark]?.(c) ?? '';
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';

  return `
    <svg class="island-art" viewBox="0 0 240 210" ${a11y}>
      <path d="${outline}" fill="${c.rock}" ${line}/>
      <path d="${facets}" fill="${c.rockDeep}" opacity=".55"/>
      <path d="M22 100 Q22 128 44 122 Q56 138 74 126 Q92 142 112 128 Q132 144 150 128
               Q170 140 184 124 Q204 132 218 100 Z" fill="${c.grassDeep}" ${line}/>
      <ellipse cx="120" cy="98" rx="98" ry="27" fill="${c.grass}" ${line}/>
      <ellipse cx="96" cy="92" rx="46" ry="9" fill="#fff" opacity=".22"/>
      <g${c.flip ? ' transform="translate(240 0) scale(-1 1)"' : ''}>${landmark}</g>
      ${DECOR[c.deco % DECOR.length](c)}
    </svg>`;
}

/** A small emblem for a region: its first island's colours and landmark. */
export function drawRegionEmblem(region) {
  return drawIsland(region.islands[0]);
}
