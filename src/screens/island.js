// One island up close: its landmark and the path of lessons across it.
// The island's lessons are loaded when the screen opens.

import { findIsland, loadIsland } from '../data/islands.js';
import { store } from '../core/store.js';
import { go } from '../core/router.js';
import { t, tr, num } from '../core/i18n.js';
import { esc, onClick, shade } from '../core/dom.js';
import { drawIsland } from '../world/islandArt.js';
import { renderCharacter } from '../characters/index.js';
import { renderAvatar } from '../avatar/draw.js';
import { icon, starRow } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { islandStatus, islandProgress, lessonStatus, lessonStars } from '../systems/progress.js';

function renderLesson(island, lesson, index, resumeId) {
  const status = lessonStatus(island, index);
  const badge = status === 'done' ? icon('check', 30) : status === 'locked' ? icon('lock', 28) : `<b>${num(index + 1)}</b>`;
  const hint = status === 'done' ? t('island.review')
    : status === 'locked' ? t('island.lessonLocked')
      : lesson.id === resumeId ? t('island.resume') : t('island.start');
  const level = `<span class="level" aria-label="${t('lesson.level', { n: num(lesson.level ?? 1) })}">${[1, 2, 3].map((n) => `<i${n <= (lesson.level ?? 1) ? ' class="on"' : ''}></i>`).join('')}</span>`;

  return `
    <li class="stone stone--${status}">
      <button class="stone__button" data-lesson="${lesson.id}" data-status="${status}">
        <span class="stone__disc">${badge}</span>
        <span class="stone__text">
          <span class="stone__title">${esc(tr(lesson.title))}</span>
          <span class="stone__meta">
            ${status === 'done' ? starRow(lessonStars(lesson.id), 18) : ''}
            <span class="stone__hint">${hint}</span>
            ${level}
          </span>
        </span>
      </button>
    </li>`;
}

export function mount(root, [islandId]) {
  const island = findIsland(islandId);
  if (!island || islandStatus(island) === 'locked') return go('world');

  const save = store.get();
  const progress = islandProgress(island);
  const finished = progress.done === progress.total;
  const look = island.look;
  let alive = true;

  root.innerHTML = `
    <div class="view island" style="--grass:${look.grass}; --grass-deep:${look.grassDeep}; --grass-soft:${shade(look.grass, 0.55)}">
      <div class="island__sky">
        <div class="topbar">
          <a class="btn btn--round" href="#/world" aria-label="${t('nav.backToWorld')}">${icon('back')}</a>
          <span class="chip">${icon('star', 18)} ${num(progress.stars)} / ${num(progress.maxStars)}</span>
        </div>
        <div class="island__hero">${drawIsland(island)}</div>
        <p class="island__region">${esc(tr(island.region.name))}</p>
        <h1 class="island__name">${esc(tr(island.name))}</h1>
        <p class="island__about">${esc(tr(island.about))}</p>
      </div>

      <section class="island__ground" aria-label="${t('island.lessons')}">
        <span class="bar"><span style="width:${Math.round((progress.done / progress.total) * 100)}%"></span></span>
        <p class="island__count">${t('journey.lessonsDone', { done: num(progress.done), total: num(progress.total) })}</p>
        <ol class="stones"><li class="loading">${t('app.loading')}</li></ol>
        <div class="island__friends">
          ${renderCharacter('raccoon', save.characters.raccoon, { expression: finished ? 'cheer' : 'happy' })}
          <div>
            <p class="bubble">${t(finished ? 'island.finished' : 'island.cheer')}</p>
            <div class="island__me">${renderAvatar(save.avatar, { mood: finished ? 'grin' : save.avatar.mood })}</div>
          </div>
          ${renderCharacter('cat', save.characters.cat, { expression: finished ? 'cheer' : 'curious' })}
        </div>
      </section>
    </div>`;

  const list = root.querySelector('.stones');
  loadIsland(island.id).then(({ lessons }) => {
    if (!alive) return;
    const resumeId = store.get().inProgress?.lessonId;
    list.innerHTML = lessons.map((lesson, index) => renderLesson(island, lesson, index, resumeId)).join('');
    list.querySelector('.stone--open')?.scrollIntoView({ block: 'center' });
  }).catch(() => {
    if (!alive) return;
    list.innerHTML = `<li class="loading">${t('error.body')} <button class="btn" data-action="retry">${t('error.retry')}</button></li>`;
  });

  onClick(root, '[data-lesson]', (button) => {
    if (button.dataset.status === 'locked') return toast(t('island.lockedToast'));
    go(`lesson/${button.dataset.lesson}`);
  });
  onClick(root, '[data-action="retry"]', () => go(`island/${island.id}`));

  return () => { alive = false; };
}
