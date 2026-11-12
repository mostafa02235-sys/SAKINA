// Lulu the cat — Zad's quick-witted friend.
// Recognisable by: the tall ears, the patch over one eye, the three
// forehead stripes, green almond eyes and the curled tail with a dipped tip.

import { shade } from '../core/dom.js';
import { INK, outlined, tube, drawFace } from './parts.js';

export function drawCat(look, expression) {
  const fur = look.fur;
  const marks = look.marks;
  const light = shade(fur, 0.8);
  const armsUp = expression === 'cheer';

  const armL = armsUp ? 'M76 156 Q58 142 54 120' : 'M76 156 Q64 170 70 188';
  const armR = armsUp ? 'M124 156 Q142 142 146 120' : 'M124 156 Q136 170 130 188';

  const eye = (x, lx, ly) => `
    <ellipse cx="${x}" cy="0" rx="12" ry="15" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="${x + lx * 0.7}" cy="${ly * 0.7}" rx="8.5" ry="11.5" fill="#35c08f"/>
    <ellipse cx="${x + lx * 0.7}" cy="${ly * 0.7}" rx="3.6" ry="9" fill="${INK}"/>
    <circle cx="${x + lx * 0.7 + 3.5}" cy="${ly * 0.7 - 5}" r="2.6" fill="#fff"/>`;

  const tailPath = 'M126 196 Q176 204 172 162 Q170 138 185 130';

  return {
    tail: `
      <g class="ch-tail" style="transform-origin: 128px 196px">
        ${tube(tailPath, fur, 13)}
        <path d="${tailPath}" pathLength="100" fill="none" stroke="${marks}" stroke-width="13"
              stroke-linecap="round" stroke-dasharray="26 200" stroke-dashoffset="-74"/>
      </g>`,
    body: `
      <ellipse cx="84" cy="212" rx="14" ry="9" fill="${light}" ${outlined}/>
      <ellipse cx="116" cy="212" rx="14" ry="9" fill="${light}" ${outlined}/>
      <ellipse cx="100" cy="176" rx="32" ry="39" fill="${fur}" ${outlined}/>
      <ellipse cx="100" cy="168" rx="16" ry="21" fill="${light}"/>`,
    arms: tube(armL, fur, 12) + tube(armR, fur, 12),
    head: `
      <path d="M46 74 L50 18 L92 46 Z" fill="${fur}" ${outlined}/>
      <path d="M56 58 L58 36 L76 48 Z" fill="#ffb3c1"/>
      <path d="M154 74 L150 18 L108 46 Z" fill="${marks}" ${outlined}/>
      <path d="M144 58 L142 36 L124 48 Z" fill="#ffb3c1"/>
      <path d="M100 40 C140 40 162 62 162 92 C162 124 134 140 100 140
               C66 140 38 124 38 92 C38 62 60 40 100 40 Z" fill="${fur}" ${outlined}/>
      <path d="M104 43 C140 44 159 64 159 90 C159 104 150 116 136 118 C116 120 104 104 104 84 Z" fill="${marks}"/>
      <path d="M72 50 l3 13 M86 46 l1 14" fill="none" stroke="${marks}" stroke-width="6" stroke-linecap="round"/>
      <path d="M58 54 l5 12" fill="none" stroke="${marks}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="100" cy="116" rx="20" ry="14" fill="${light}"/>
      <path d="M94 104 h12 l-6 7 Z" fill="#ff8fa3" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M40 104 l-20 -5 M40 112 l-20 3 M160 104 l20 -5 M160 112 l20 3"
            fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      ${drawFace({ cx: 100, cy: 88, eyeGap: 28, mouthY: 116, eye }, expression)}`,
  };
}
