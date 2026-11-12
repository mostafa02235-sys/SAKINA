// One entry point for drawing either character.
//
//   renderCharacter('raccoon', save.characters.raccoon, { expression: 'cheer' })
//
// returns an SVG string. Layer order (back to front):
// tail, cape back, body, outfit front, arms, accessory, head.

import { drawRaccoon } from './raccoon.js';
import { drawCat } from './cat.js';
import { OUTFIT_BACK, OUTFIT_FRONT, ACCESSORY } from './parts.js';
import { esc } from '../core/dom.js';

const DRAWERS = { raccoon: drawRaccoon, cat: drawCat };

export function renderCharacter(kind, look, options = {}) {
  const { expression = 'happy', label = '', still = false } = options;
  const layers = DRAWERS[kind](look, expression);
  const back = OUTFIT_BACK[look.outfit]?.(look.outfitColor) ?? '';
  const front = OUTFIT_FRONT[look.outfit]?.(look.outfitColor) ?? '';
  const accessory = ACCESSORY[look.accessory]?.() ?? '';
  const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';

  return `
    <svg class="character character--${kind} is-${expression}${still ? ' is-still' : ''}"
         viewBox="0 0 200 230" ${a11y}>
      <ellipse class="ch-shadow" cx="100" cy="218" rx="52" ry="8" fill="#1d2a4d" opacity=".18"/>
      <g class="ch-all">
        ${layers.tail}
        ${back}
        <g class="ch-body">${layers.body}${front}${layers.arms}${accessory}</g>
        <g class="ch-head">${layers.head}</g>
      </g>
    </svg>`;
}
