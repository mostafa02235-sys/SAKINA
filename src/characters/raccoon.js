// Zad the raccoon — SAKINA's curious explorer.
// Recognisable by: the swept-back mask, the ringed tail, the three-spike
// hair tuft and the pointed cheek fur.

import { shade } from '../core/dom.js';
import { INK, outlined, tube, drawFace } from './parts.js';

export function drawRaccoon(look, expression) {
  const fur = look.fur;
  const marks = look.marks;
  const light = shade(fur, 0.72);
  const armsUp = expression === 'cheer';

  const armL = armsUp ? 'M70 152 Q50 138 46 116' : 'M70 152 Q56 166 62 184';
  const armR = armsUp ? 'M130 152 Q150 138 154 116' : 'M130 152 Q144 166 138 184';

  const eye = (x, lx, ly) => `
    <circle cx="${x}" cy="0" r="13" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <circle cx="${x + lx}" cy="${ly}" r="7.5" fill="${INK}"/>
    <circle cx="${x + lx + 3}" cy="${ly - 3}" r="2.6" fill="#fff"/>`;

  return {
    tail: `
      <g class="ch-tail" style="transform-origin: 122px 178px">
        ${tube('M120 178 Q176 190 170 126', fur, 30)}
        <path d="M120 178 Q176 190 170 126" pathLength="100" fill="none" stroke="${marks}" stroke-width="30"
              stroke-dasharray="13 15" stroke-dashoffset="-22"/>
        <path d="M120 178 Q176 190 170 126" pathLength="100" fill="none" stroke="${marks}" stroke-width="30"
              stroke-linecap="round" stroke-dasharray="0.1 200" stroke-dashoffset="-99.9"/>
      </g>`,
    body: `
      <ellipse cx="80" cy="211" rx="17" ry="10" fill="${marks}" ${outlined}/>
      <ellipse cx="120" cy="211" rx="17" ry="10" fill="${marks}" ${outlined}/>
      <ellipse cx="100" cy="172" rx="40" ry="42" fill="${fur}" ${outlined}/>
      <ellipse cx="100" cy="180" rx="24" ry="27" fill="${light}"/>`,
    arms: tube(armL, marks, 15) + tube(armR, marks, 15),
    head: `
      <path d="M86 44 L92 22 L100 38 L109 18 L114 44 Z" fill="${marks}" ${outlined}/>
      <circle cx="56" cy="54" r="19" fill="${fur}" ${outlined}/>
      <circle cx="56" cy="56" r="9" fill="${marks}"/>
      <circle cx="144" cy="54" r="19" fill="${fur}" ${outlined}/>
      <circle cx="144" cy="56" r="9" fill="${marks}"/>
      <path d="M100 38 C140 38 162 62 160 92 L178 106 L158 114 C148 134 124 144 100 144
               C76 144 52 134 42 114 L22 106 L40 92 C38 62 60 38 100 38 Z" fill="${fur}" ${outlined}/>
      <path d="M100 42 C107 56 106 70 100 82 C94 70 93 56 100 42 Z" fill="${marks}"/>
      <ellipse cx="70" cy="92" rx="27" ry="19" transform="rotate(-20 70 92)" fill="${marks}"/>
      <ellipse cx="130" cy="92" rx="27" ry="19" transform="rotate(20 130 92)" fill="${marks}"/>
      <ellipse cx="100" cy="116" rx="27" ry="21" fill="${light}"/>
      <ellipse cx="100" cy="104" rx="9" ry="6.5" fill="${INK}"/>
      ${drawFace({ cx: 100, cy: 90, eyeGap: 29, mouthY: 116, eye }, expression)}`,
  };
}
