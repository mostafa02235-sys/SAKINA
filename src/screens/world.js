// The world map: a sky of floating islands joined by a trail of light.

import { ISLANDS } from '../data/islands.js';
import { store } from '../core/store.js';
import { go, refresh } from '../core/router.js';
import { t, tr, num, lang, setLang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { drawIsland } from '../world/islandArt.js';
import { renderCharacter } from '../characters/index.js';
import { renderHud } from '../components/hud.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { islandStatus, islandProgress, currentIsland, nextUp } from '../systems/progress.js';
import { CHARACTERS } from '../data/wardrobe.js';

function signFor(island, status) {
  const progress = islandProgress(island);
  if (status === 'planned') return `<span class="isle__note">${t('world.soon')}</span>`;
  if (status === 'locked') return `<span class="isle__note">${icon('lock', 16)} ${t('world.locked')}</span>`;
  return `<span class="isle__note">${icon('star', 16)} ${num(progress.stars)} / ${num(progress.maxStars)}</span>`;
}

function renderIsland(island, index, here) {
  const status = islandStatus(island);
  const save = store.get();
  const friends = here ? `
    <div class="isle__friends">
      ${renderCharacter('raccoon', save.characters.raccoon, { label: tr(CHARACTERS.raccoon.name) })}
      ${renderCharacter('cat', save.characters.cat, { label: tr(CHARACTERS.cat.name) })}
    </div>` : '';
  const trail = index < ISLANDS.length - 1 ? `
    <svg class="isle__trail${status === 'done' ? ' is-walked' : ''}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="${index % 2 === 0 ? 'M31 0 C31 60 69 40 69 100' : 'M69 0 C69 60 31 40 31 100'}" vector-effect="non-scaling-stroke"/>
    </svg>` : '';

  return `
    <li class="isle isle--${status}${here ? ' is-here' : ''}" style="--i:${index}">
      <button class="isle__button" data-island="${island.id}" data-status="${status}">
        <span class="isle__float">
          ${drawIsland(island)}
          ${status === 'locked' ? `<span class="isle__badge">${icon('lock', 26)}</span>` : ''}
          ${friends}
        </span>
        <span class="isle__sign">
          <span class="isle__name">${esc(tr(island.name))}</span>
          ${signFor(island, status)}
        </span>
      </button>
      ${trail}
    </li>`;
}

export function mount(root) {
  const here = currentIsland();
  const next = nextUp();

  const cta = next
    ? `<button class="btn btn--go world__cta" data-action="continue">
         <span class="btn__kicker">${t('world.continue')}</span>
         <span class="btn__title">${esc(tr(next.lesson.title))}</span>
         ${icon('play', 26)}
       </button>`
    : `<div class="world__done">${t('world.allDone')}</div>`;

  root.innerHTML = `
    <div class="view world">
      ${renderHud()}
      <div class="sky" aria-hidden="true">
        <span class="sun"></span>
        <span class="cloud cloud--a"></span>
        <span class="cloud cloud--b"></span>
        <span class="cloud cloud--c"></span>
        <span class="cloud cloud--d"></span>
      </div>
      <h1 class="visually-hidden">${t('tab.world')}</h1>
      <ol class="isles">
        ${ISLANDS.map((island, index) => renderIsland(island, index, island === here)).join('')}
      </ol>
      <div class="world__dock">${cta}</div>
    </div>`;

  onClick(root, '[data-island]', (button) => {
    const status = button.dataset.status;
    if (status === 'planned') return toast(t('world.soonToast'));
    if (status === 'locked') {
      button.classList.remove('is-nudged');
      void button.offsetWidth;
      button.classList.add('is-nudged');
      return toast(t('world.lockedToast'));
    }
    go(`island/${button.dataset.island}`);
  });

  onClick(root, '[data-action="continue"]', () => go(`lesson/${next.lesson.id}`));

  onClick(root, '[data-action="switch-language"]', () => {
    setLang(lang() === 'ar' ? 'en' : 'ar');
    refresh();
  });

  // Start with the player's current island in view.
  root.querySelector('.isle.is-here')?.scrollIntoView({ block: 'center' });
}
