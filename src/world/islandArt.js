// Draws a floating island: a grassy top, a rocky underside and one landmark.
// Canvas is 240 x 210; the walkable top surface is centred on (120, 100).

import { LANDMARKS } from './landmarks.js';

const INK = '#1d2a4d';
const line = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

export function drawIsland(island, { label = '' } = {}) {
  const c = island.colors;
  const landmark = LANDMARKS[island.landmark]?.(c) ?? '';
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';

  return `
    <svg class="island-art" viewBox="0 0 240 210" ${a11y}>
      <!-- rocky underside -->
      <path d="M26 102 Q36 146 66 150 L76 178 L92 152 Q108 190 124 200 Q140 182 148 154
               L162 170 L172 148 Q206 142 214 102 Z" fill="${c.rock}" ${line}/>
      <path d="M92 152 Q108 190 124 200 Q118 170 122 120 L84 120 Z" fill="${c.rockDeep}" opacity=".55"/>
      <path d="M172 148 Q206 142 214 102 L176 112 Z" fill="${c.rockDeep}" opacity=".55"/>
      <!-- grassy top with an overhanging edge -->
      <path d="M22 100 Q22 128 44 122 Q56 138 74 126 Q92 142 112 128 Q132 144 150 128
               Q170 140 184 124 Q204 132 218 100 Z" fill="${c.grassDeep}" ${line}/>
      <ellipse cx="120" cy="98" rx="98" ry="27" fill="${c.grass}" ${line}/>
      <ellipse cx="96" cy="92" rx="46" ry="9" fill="#fff" opacity=".22"/>
      ${landmark}
    </svg>`;
}
