// The world map. SAKINA has many "worlds" (regions); the map shows the islands
// of one world at a time, joined by a trail of light. The player's avatar,
// Mr. Raccoon and Mr. Qattout (the "party") stand on one island and walk to the
// island the player taps before entering it.

import { REGIONS, findIsland, findRegion } from '../data/islands.js';
import { store } from '../core/store.js';
import { go, refresh } from '../core/router.js';
import { t, tr, num, lang, setLang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { buzz, reducedMotion } from '../core/feel.js';
import { drawIsland, drawRegionEmblem } from '../world/islandArt.js';
import { renderCharacter } from '../characters/index.js';
import { renderAvatar } from '../avatar/draw.js';
import { renderHud } from '../components/hud.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { islandStatus, islandProgress, lessonStatus, regionUnlocked, nextUp, stats } from '../systems/progress.js';

const WALK_MS = 1150;

function renderIsland(island, index, count) {
  const status = islandStatus(island);
  const progress = islandProgress(island);
  const pips = status === 'locked' ? '' : island.ids.map((_, i) => `<i class="pip pip--${lessonStatus(island, i)}"></i>`).join('');
  const note = status === 'locked'
    ? `<span class="isle__note">${icon('lock', 16)} ${t('world.locked')}</span>`
    : `<span class="pips" role="img" aria-label="${t('journey.lessonsDone', { done: num(progress.done), total: num(progress.total) })}">${pips}</span>
       <span class="isle__note">${icon('star', 16)} ${num(progress.stars)} / ${num(progress.maxStars)}</span>`;
  const trail = index < count - 1 ? `
    <svg class="isle__trail${status === 'done' ? ' is-walked' : ''}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="${index % 2 === 0 ? 'M31 0 C31 60 69 40 69 100' : 'M69 0 C69 60 31 40 31 100'}" vector-effect="non-scaling-stroke"/>
    </svg>` : '';

  return `
    <li class="isle isle--${status}" data-id="${island.id}" style="--i:${index % 7}">
      <button class="isle__button" data-island="${island.id}" data-status="${status}">
        <span class="isle__float">
          ${drawIsland(island)}
          ${status === 'locked' ? `<span class="isle__badge">${icon('lock', 26)}</span>` : ''}
        </span>
        <span class="isle__sign">
          <span class="isle__number">${num(index + 1)}</span>
          <span class="isle__name">${esc(tr(island.name))}</span>
          ${note}
        </span>
      </button>
      ${trail}
    </li>`;
}

function renderRegionTab(region, current, done) {
  const open = regionUnlocked(region);
  return `
    <button class="gate${region === current ? ' is-current' : ''}${open ? '' : ' is-locked'}" data-region="${region.id}"
            ${region === current ? 'aria-current="true"' : ''}>
      <span class="gate__art">${drawRegionEmblem(region)}${open ? '' : `<span class="gate__lock">${icon('lock', 18)}</span>`}</span>
      <span class="gate__name">${esc(tr(region.name))}</span>
      <span class="gate__count">${num(done)} / ${num(region.islands.length)}</span>
    </button>`;
}

/** The world to show: the one the player chose, or the one they are standing in. */
function shownRegion(save) {
  const chosen = findRegion(save.regionAt);
  if (chosen && regionUnlocked(chosen, save)) return chosen;
  return findIsland(save.partyAt)?.region ?? REGIONS[0];
}

/** Where the party stands in a world: their saved island, else the island they are working on. */
function partyHome(region, save) {
  const saved = findIsland(save.partyAt);
  if (saved && saved.region === region && islandStatus(saved, save) !== 'locked') return saved;
  return region.islands.find((island) => islandStatus(island, save) === 'open')
    ?? [...region.islands].reverse().find((island) => islandStatus(island, save) === 'done')
    ?? region.islands[0];
}

const PARTY_LINES = ['party.line1', 'party.line2', 'party.line3', 'party.line4'];

export function mount(root) {
  const save = store.get();
  const region = shownRegion(save);
  const totals = stats(save);
  const regionTotals = totals.regions[region.index];
  const next = nextUp(save);
  let standingOn = partyHome(region, save);
  let walking = false;
  let alive = true; // false once the player has left this screen

  const cta = next
    ? `<button class="btn btn--go world__cta" data-action="continue">
         <span class="btn__kicker">${t('world.continue')} · ${t('world.lessonN', { n: num(next.index + 1) })}</span>
         <span class="btn__title">${esc(tr(next.island.name))}</span>
         ${icon('play', 26)}
       </button>`
    : `<div class="world__done">${t('world.allDone')}</div>`;

  root.innerHTML = `
    <div class="view world" data-biome="${region.biome}">
      ${renderHud()}
      <nav class="gates" aria-label="${t('world.worlds')}">
        ${REGIONS.map((r) => renderRegionTab(r, region, totals.regions[r.index].done)).join('')}
      </nav>
      <div class="sky" aria-hidden="true">
        <span class="sun"></span>
        <span class="cloud cloud--a"></span>
        <span class="cloud cloud--b"></span>
        <span class="cloud cloud--c"></span>
        <span class="cloud cloud--d"></span>
      </div>
      <header class="world__banner">
        <h1>${esc(tr(region.name))}</h1>
        <p>${esc(tr(region.about))}</p>
        <span class="bar"><span style="width:${Math.round((regionTotals.done / regionTotals.total) * 100)}%"></span></span>
        <p class="world__count">${t('world.islandsDone', { done: num(regionTotals.done), total: num(regionTotals.total) })}</p>
      </header>
      <ol class="isles">
        ${region.islands.map((island, index) => renderIsland(island, index, region.islands.length)).join('')}
        <li class="party">
          <button class="party__float" data-action="party" aria-label="${t('party.label')}">
            ${renderCharacter('raccoon', save.characters.raccoon)}
            ${renderAvatar(save.avatar)}
            ${renderCharacter('cat', save.characters.cat)}
          </button>
          <p class="party__bubble" hidden></p>
        </li>
      </ol>
      <div class="world__dock">${cta}</div>
    </div>`;

  const party = root.querySelector('.party');
  const bubble = root.querySelector('.party__bubble');
  const sky = root.querySelector('.sky');
  const isleEl = (island) => root.querySelector(`.isle[data-id="${island.id}"]`);

  /** Put the party on an island. With `animate`, they walk there. */
  function placeParty(island, animate) {
    const li = isleEl(island);
    const float = li.querySelector('.isle__float');
    party.style.width = `${li.offsetWidth}px`;
    party.style.transitionDuration = animate ? `${WALK_MS}ms` : '0ms';
    party.style.transform = `translate(${li.offsetLeft}px, ${li.offsetTop + float.offsetHeight * 0.22}px)`;
    party.style.setProperty('--i', li.style.getPropertyValue('--i'));
  }

  function setWalking(on) {
    walking = on;
    party.classList.toggle('is-walking', on);
    party.querySelectorAll('.character, .avatar').forEach((el) => el.classList.toggle('is-walking', on));
  }

  /** Walk the party to an island, then call `done`. */
  function walkTo(island, done = () => {}) {
    if (island === standingOn) {
      if (store.get().partyAt !== island.id) store.update((s) => { s.partyAt = island.id; });
      return done();
    }
    store.update((s) => { s.partyAt = island.id; });
    standingOn = island;
    bubble.hidden = true;
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
    if (button.dataset.status === 'locked') {
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
    if (next.island.region !== region) {
      store.update((s) => { s.regionAt = next.island.region.id; s.partyAt = next.island.id; });
      return go(`lesson/${next.lessonId}`);
    }
    walkTo(next.island, () => go(`lesson/${next.lessonId}`));
  });

  onClick(root, '[data-region]', (button) => {
    const target = findRegion(button.dataset.region);
    if (target === region) return;
    if (!regionUnlocked(target)) {
      buzz('wrong');
      return toast(t('world.regionLocked', { name: tr(REGIONS[target.index - 1].islands[0].name) }));
    }
    buzz('tap');
    store.update((s) => { s.regionAt = target.id; });
    refresh();
  });

  // Tapping the party: one of the friends says something.
  let line = 0;
  onClick(root, '[data-action="party"]', () => {
    if (walking) return;
    buzz('tap');
    const speaker = line % 2 === 0 ? t('name.raccoon') : t('name.cat');
    bubble.textContent = `${speaker}: ${t(PARTY_LINES[line % PARTY_LINES.length], { name: store.get().profile.name || t('profile.friend') })}`;
    bubble.hidden = false;
    line += 1;
    clearTimeout(bubble.timer);
    bubble.timer = setTimeout(() => { bubble.hidden = true; }, 3200);
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

  // Only islands that are on screen keep animating; this keeps a world of 60 islands smooth.
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-away', !entry.isIntersecting));
  }, { root, rootMargin: '80px' });
  root.querySelectorAll('.isle').forEach((el) => watcher.observe(el));

  const onResize = () => placeParty(standingOn, false);
  window.addEventListener('resize', onResize);

  // Start with the party and the current world's tab in view. If they finished
  // their island while away and the next one is waiting, they walk over to it.
  placeParty(standingOn, false);
  if (standingOn.place > 0) isleEl(standingOn).scrollIntoView({ block: 'center' });
  root.querySelector('.gate.is-current')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  if (next && next.island.region === region && next.island !== standingOn && islandStatus(standingOn) === 'done') {
    setTimeout(() => alive && walkTo(next.island), 650);
  }

  return () => {
    alive = false;
    watcher.disconnect();
    window.removeEventListener('resize', onResize);
  };
}
