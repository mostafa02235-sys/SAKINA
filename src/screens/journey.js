// "My journey": level, stars, island progress, rewards and settings.

import { ISLANDS } from '../data/islands.js';
import { REWARDS } from '../data/wardrobe.js';
import { store } from '../core/store.js';
import { refresh } from '../core/router.js';
import { t, tr, num, lang, setLang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { level, totalStars, dayStreak, islandProgress, islandStatus, isItemUnlocked } from '../systems/progress.js';

function renderIslandRow(island) {
  const status = islandStatus(island);
  const progress = islandProgress(island);
  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const note = status === 'planned' ? t('world.soon')
    : status === 'locked' ? t('world.locked')
      : t('journey.lessonsDone', { done: num(progress.done), total: num(progress.total) });
  return `
    <li class="row row--${status}">
      <span class="row__dot" style="--c:${island.colors.grass}"></span>
      <span class="row__main">
        <span class="row__name">${esc(tr(island.name))}</span>
        <span class="row__note">${note}</span>
        ${status === 'open' || status === 'done' ? `<span class="bar"><span style="width:${percent}%"></span></span>` : ''}
      </span>
      ${status === 'open' || status === 'done' ? `<span class="row__stars">${icon('star', 18)} ${num(progress.stars)}</span>` : ''}
    </li>`;
}

export function mount(root) {
  const lv = level();
  const stars = totalStars();
  const lessonsDone = Object.keys(store.get().lessons).length;
  const toNext = lv.next
    ? t('journey.toNext', { n: num(lv.next.stars - stars), name: tr(lv.next.name) })
    : t('journey.topLevel');
  const levelPercent = lv.next ? Math.round((stars / lv.next.stars) * 100) : 100;

  root.innerHTML = `
    <div class="view journey">
      <header class="journey__head">
        <p class="journey__level">${t('journey.level', { n: num(lv.number) })}</p>
        <h1>${esc(tr(lv.name))}</h1>
        <span class="bar bar--big"><span style="width:${levelPercent}%"></span></span>
        <p class="journey__next">${toNext}</p>
      </header>

      <div class="journey__body">
        <div class="stats">
          <div class="stat">${icon('star', 30)}<b>${num(stars)}</b><span>${t('hud.stars')}</span></div>
          <div class="stat">${icon('flame', 30)}<b>${num(dayStreak())}</b><span>${t('hud.streak')}</span></div>
          <div class="stat">${icon('journey', 30)}<b>${num(lessonsDone)}</b><span>${t('journey.lessons')}</span></div>
        </div>

        <section class="group">
          <h2>${t('journey.islands')}</h2>
          <ul class="rows">${ISLANDS.map(renderIslandRow).join('')}</ul>
        </section>

        <section class="group">
          <h2>${t('journey.rewards')}</h2>
          <ul class="rows">${REWARDS.map((item) => `
            <li class="row${isItemUnlocked(item) ? '' : ' row--locked'}">
              <span class="row__icon">${icon(isItemUnlocked(item) ? 'star' : 'lock', 22)}</span>
              <span class="row__main">
                <span class="row__name">${esc(tr(item.name))}</span>
                <span class="row__note">${isItemUnlocked(item) ? t('journey.unlocked') : t('journey.needs', { n: num(item.stars) })}</span>
              </span>
            </li>`).join('')}</ul>
        </section>

        <section class="group note">
          <h2>${t('journey.sourcesTitle')}</h2>
          <p>${t('journey.sourcesBody')}</p>
        </section>

        <section class="group">
          <h2>${t('journey.settings')}</h2>
          <div class="settings">
            <div class="seg" role="group" aria-label="${t('journey.language')}">
              <button class="seg__btn${lang() === 'ar' ? ' is-active' : ''}" data-lang="ar" lang="ar">العربية</button>
              <button class="seg__btn${lang() === 'en' ? ' is-active' : ''}" data-lang="en" lang="en">English</button>
            </div>
            <button class="btn btn--wide" data-action="reset">${t('journey.reset')}</button>
          </div>
        </section>
      </div>
    </div>`;

  onClick(root, '[data-lang]', (button) => {
    setLang(button.dataset.lang);
    refresh();
  });

  // Starting over asks twice: the first tap turns the button into a confirmation.
  onClick(root, '[data-action="reset"]', (button) => {
    if (!button.classList.contains('btn--oops')) {
      button.classList.add('btn--oops');
      button.textContent = t('journey.resetConfirm');
      return;
    }
    store.reset();
    refresh();
    toast(t('journey.resetDone'));
  });
}
