// The world map: a sky of floating islands joined by a trail of light.
// Zad and Lulu (the "party") stand on one island and walk to the island
// the player taps before entering it.

import { ISLANDS, findIsland } from '../data/islands.js';
import { store } from '../core/store.js';
import { go, refresh } from '../core/router.js';
import { t, tr, num, lang, setLang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { buzz, reducedMotion } from '../core/feel.js';
import { drawIsland } from '../world/islandArt.js';
import { renderCharacter } from '../characters/index.js';
import { renderHud } from '../components/hud.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { islandStatus, islandProgress, lessonStatus, currentIsland, nextUp } from '../systems/progress.js';
import { CHARACTERS } from '../data/wardrobe.js';

const WALK_MS = 1150;

function signFor(island, status) {
  if (status === 'planned') return `<span class="isle__note">${t('world.soon')}</span>`;
  if (status === 'locked') return `<span class="isle__note">${icon('lock', 16)} ${t('world.locked')}</span>`;
  const progress = islandProgress(island);
  const pips = island.lessons.map((_, i) => `<i class="pip pip--${lessonStatus(island, i)}"></i>`).join('');
  return `
    <span class="pips" role="img" aria-label="${t('journey.lessonsDone', { done: num(progress.done), total: num(progress.total) })}">${pips}</span>
    <span class="isle__note">${icon('star', 16)} ${num(progress.stars)} / ${num(progress.maxStars)}</span>`;
}

function renderIsland(island, index) {
  const status = islandStatus(island);
  const trail = index < ISLANDS.length - 1 ? `
    <svg class="isle__trail${status === 'done' ? ' is-walked' : ''}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="${index % 2 === 0 ? 'M31 0 C31 60 69 40 69 100' : 'M69 0 C69 60 31 40 31 100'}" vector-effect="non-scaling-stroke"/>
    </svg>` : '';

  return `
    <li class="isle isle--${status}" data-id="${island.id}" style="--i:${index}">
      <button class="isle__button" data-island="${island.id}" data-status="${status}">
        <span class="isle__float">
          ${drawIsland(island)}
          ${status === 'locked' ? `<span class="isle__badge">${icon('lock', 26)}</span>` : ''}
        </span>
        <span class="isle__sign">
          <span class="isle__name">${esc(tr(island.name))}</span>
          ${signFor(island, status)}
        </span>
      </button>
      ${trail}
    </li>`;
}

/** The island where the party is standing: the saved one if still valid, else the current island. */
function partyHome() {
  const saved = findIsland(store.get().partyAt);
  if (saved && ['open', 'done'].includes(islandStatus(saved))) return saved;
  return currentIsland();
}

export function mount(root) {
  const save = store.get();
  const next = nextUp();
  let standingOn = partyHome();
  if (save.partyAt !== standingOn.id) store.update((s) => { s.partyAt = standingOn.id; });
  let walking = false;
  let alive = true; // false once the player has left this screen

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
        ${ISLANDS.map(renderIsland).join('')}
        <li class="party" aria-hidden="true">
          <div class="party__float">
            ${renderCharacter('raccoon', save.characters.raccoon, { label: tr(CHARACTERS.raccoon.name) })}
            ${renderCharacter('cat', save.characters.cat, { label: tr(CHARACTERS.cat.name) })}
          </div>
        </li>
      </ol>
      <div class="world__dock">${cta}</div>
    </div>`;

  const party = root.querySelector('.party');
  const sky = root.querySelector('.sky');
  const isleEl = (island) => root.querySelector(`.isle[data-id="${island.id}"]`);

  /** Put the party on an island. With `animate`, they walk there. */
  function placeParty(island, animate) {
    const li = isleEl(island);
    const float = li.querySelector('.isle__float');
    party.style.width = `${li.offsetWidth}px`;
    party.style.transitionDuration = animate ? `${WALK_MS}ms` : '0ms';
    party.style.transform = `translate(${li.offsetLeft}px, ${li.offsetTop + float.offsetHeight * 0.25}px)`;
    party.style.setProperty('--i', li.style.getPropertyValue('--i'));
  }

  function setWalking(on) {
    walking = on;
    party.classList.toggle('is-walking', on);
    party.querySelectorAll('.character').forEach((el) => el.classList.toggle('is-walking', on));
  }

  /** Walk the party to an island, then call `done`. */
  function walkTo(island, done = () => {}) {
    if (island === standingOn) return done();
    store.update((s) => { s.partyAt = island.id; });
    standingOn = island;
    if (reducedMotion()) {
      placeParty(island, false);
      return done();
    }
    setWalking(true);
    placeParty(island, true);
    isleEl(island).scrollIntoView({ block: 'center', behavior: 'smooth' });
    setTimeout(() => {
      if (!alive) return;
      setWalking(false);
      done();
    }, WALK_MS);
  }

  onClick(root, '[data-island]', (button) => {
    if (walking) return;
    const status = button.dataset.status;
    if (status === 'planned') return toast(t('world.soonToast'));
    if (status === 'locked') {
      buzz('wrong');
      button.classList.remove('is-nudged');
      void button.offsetWidth;
      button.classList.add('is-nudged');
      return toast(t('world.lockedToast'));
    }
    buzz('tap');
    const island = findIsland(button.dataset.island);
    walkTo(island, () => go(`island/${island.id}`));
  });

  onClick(root, '[data-action="continue"]', () => {
    if (walking) return;
    buzz('tap');
    walkTo(next.island, () => go(`lesson/${next.lesson.id}`));
  });

  onClick(root, '[data-action="switch-language"]', () => {
    setLang(lang() === 'ar' ? 'en' : 'ar');
    refresh();
  });

  // The sky moves more slowly than the islands, which gives the map depth.
  let ticking = false;
  root.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      sky.style.setProperty('--scroll', root.scrollTop);
      ticking = false;
    });
  }, { passive: true });

  // Keep the party in place if the screen is resized or rotated.
  const onResize = () => placeParty(standingOn, false);
  window.addEventListener('resize', onResize);

  // Start with the party in view. If they finished their island while away
  // and a new one is waiting, they walk over to it.
  placeParty(standingOn, false);
  isleEl(standingOn).scrollIntoView({ block: 'center' });
  if (next && next.island !== standingOn && islandStatus(standingOn) === 'done') {
    setTimeout(() => alive && walkTo(next.island), 650);
  }

  return () => {
    alive = false;
    window.removeEventListener('resize', onResize);
  };
}
