// One island up close: its landmark and the path of lessons across it.

import { findIsland } from '../data/islands.js';
import { store } from '../core/store.js';
import { go } from '../core/router.js';
import { t, tr, num } from '../core/i18n.js';
import { esc, onClick, shade } from '../core/dom.js';
import { drawIsland } from '../world/islandArt.js';
import { renderCharacter } from '../characters/index.js';
import { icon, starRow } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { islandStatus, islandProgress, lessonStatus, lessonStars } from '../systems/progress.js';

function renderLesson(island, lesson, index) {
  const status = lessonStatus(island, index);
  const badge = status === 'done'
    ? icon('check', 30)
    : status === 'locked' ? icon('lock', 28) : `<b>${num(index + 1)}</b>`;
  const under = status === 'done'
    ? starRow(lessonStars(lesson.id), 18)
    : `<span class="stone__hint">${t(status === 'open' ? 'island.start' : 'island.lessonLocked')}</span>`;

  return `
    <li class="stone stone--${status}">
      <button class="stone__button" data-lesson="${lesson.id}" data-status="${status}">
        <span class="stone__disc">${badge}</span>
        <span class="stone__text">
          <span class="stone__title">${esc(tr(lesson.title))}</span>
          ${under}
        </span>
      </button>
    </li>`;
}

export function mount(root, [islandId]) {
  const island = findIsland(islandId);
  if (!island || ['locked', 'planned'].includes(islandStatus(island))) return go('world');

  const save = store.get();
  const progress = islandProgress(island);
  const finished = progress.done === progress.total;

  root.innerHTML = `
    <div class="view island" style="--grass:${island.colors.grass}; --grass-deep:${island.colors.grassDeep}; --grass-soft:${shade(island.colors.grass, 0.55)}">
      <div class="island__sky">
        <div class="topbar">
          <a class="btn btn--round" href="#/world" aria-label="${t('nav.backToWorld')}">${icon('back')}</a>
          <span class="chip">${icon('star', 18)} ${num(progress.stars)} / ${num(progress.maxStars)}</span>
        </div>
        <div class="island__hero">${drawIsland(island)}</div>
        <h1 class="island__name">${esc(tr(island.name))}</h1>
        <p class="island__about">${esc(tr(island.about))}</p>
      </div>

      <section class="island__ground" aria-label="${t('island.lessons')}">
        <ol class="stones">
          ${island.lessons.map((lesson, index) => renderLesson(island, lesson, index)).join('')}
        </ol>
        <div class="island__friends">
          ${renderCharacter('raccoon', save.characters.raccoon, { expression: finished ? 'cheer' : 'happy' })}
          <p class="bubble">${t(finished ? 'island.finished' : 'island.cheer')}</p>
          ${renderCharacter('cat', save.characters.cat, { expression: finished ? 'cheer' : 'curious' })}
        </div>
      </section>
    </div>`;

  onClick(root, '[data-lesson]', (button) => {
    if (button.dataset.status === 'locked') return toast(t('island.lockedToast'));
    go(`lesson/${button.dataset.lesson}`);
  });
}
