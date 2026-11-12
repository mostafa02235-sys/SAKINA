// "My profile": the player's avatar and name, level and XP, progress through
// the worlds, achievement badges, rewards, sources and settings.

import { REGIONS } from '../data/islands.js';
import { REWARDS, CHARACTERS } from '../data/wardrobe.js';
import { AVATAR_REWARDS } from '../data/avatar.js';
import { store } from '../core/store.js';
import { refresh } from '../core/router.js';
import { t, tr, num, lang, setLang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { buzz } from '../core/feel.js';
import { renderAvatar } from '../avatar/draw.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { level, stats, badges, isItemUnlocked, regionUnlocked } from '../systems/progress.js';

function renderRegionRow(entry) {
  const { region, done, total } = entry;
  const open = regionUnlocked(region);
  const percent = Math.round((done / total) * 100);
  return `
    <li class="row${open ? '' : ' row--locked'}">
      <span class="row__dot" style="--c:${region.islands[0].look.grass}"></span>
      <span class="row__main">
        <span class="row__name">${esc(tr(region.name))}</span>
        <span class="row__note">${open ? t('world.islandsDone', { done: num(done), total: num(total) }) : t('world.locked')}</span>
        ${open ? `<span class="bar"><span style="width:${percent}%"></span></span>` : ''}
      </span>
      ${open ? '' : `<span class="row__icon">${icon('lock', 20)}</span>`}
    </li>`;
}

function renderBadge(b) {
  return `
    <li class="badge${b.earned ? ' is-earned' : ''}">
      <span class="badge__icon">${icon(b.earned ? b.icon : 'lock', 30)}</span>
      <span class="badge__name">${esc(tr(b.name))}</span>
      <span class="badge__need">${b.earned ? t('profile.earned') : `${esc(tr(b.need))} · ${num(b.have)} / ${num(b.goal)}`}</span>
    </li>`;
}

function renderReward(item, forWhom) {
  const open = isItemUnlocked(item);
  const need = item.level ? t('profile.needsLevel', { n: num(item.level) }) : t('journey.needs', { n: num(item.stars) });
  return `
    <li class="row${open ? '' : ' row--locked'}">
      <span class="row__icon">${icon(open ? 'star' : 'lock', 22)}</span>
      <span class="row__main">
        <span class="row__name">${esc(tr(item.name))}</span>
        <span class="row__note">${forWhom} · ${open ? t('journey.unlocked') : need}</span>
      </span>
    </li>`;
}

export function mount(root) {
  const save = store.get();
  const lv = level(save);
  const totals = stats(save);
  const earned = badges(save);
  const prefs = save.prefs;
  const friends = `${tr(CHARACTERS.raccoon.name)} · ${tr(CHARACTERS.cat.name)}`;

  root.innerHTML = `
    <div class="view journey">
      <header class="journey__head">
        <a class="profile__avatar" href="#/avatar" aria-label="${t('profile.editAvatar')}">${renderAvatar(save.avatar)}</a>
        <form class="profile__name" data-form="name">
          <label class="visually-hidden" for="player-name">${t('profile.name')}</label>
          <input id="player-name" name="name" type="text" maxlength="24" autocomplete="off" enterkeyhint="done"
                 value="${esc(save.profile.name)}" placeholder="${t('profile.namePlaceholder')}">
          <button class="chip chip--button" type="submit">${t('profile.saveName')}</button>
        </form>
        <p class="journey__level">${t('journey.level', { n: num(lv.number) })} · ${esc(tr(lv.name))}</p>
        <span class="bar bar--big"><span style="width:${lv.percent}%"></span></span>
        <p class="journey__next">${t('profile.xp', { xp: num(lv.xp), next: num(lv.next) })}</p>
      </header>

      <div class="journey__body">
        <div class="stats">
          <div class="stat">${icon('journey', 30)}<b>${num(totals.lessons)}</b><span>${t('journey.lessons')}</span></div>
          <div class="stat">${icon('world', 30)}<b>${num(totals.islands)}</b><span>${t('profile.islands')}</span></div>
          <div class="stat">${icon('star', 30)}<b>${num(totals.stars)}</b><span>${t('hud.stars')}</span></div>
          <div class="stat">${icon('flame', 30)}<b>${num(totals.streak)}</b><span>${t('hud.streak')}</span></div>
        </div>

        <section class="group">
          <h2>${t('profile.overall')}</h2>
          <span class="bar bar--big"><span style="width:${Math.max(totals.percent, totals.lessons ? 1 : 0)}%"></span></span>
          <p class="row__note">${t('profile.overallNote', { done: num(totals.lessons), total: num(totals.totalLessons), islands: num(totals.totalIslands) })}</p>
        </section>

        <section class="group">
          <h2>${t('profile.badges')} · ${num(earned.filter((b) => b.earned).length)} / ${num(earned.length)}</h2>
          <ul class="badges">${earned.map(renderBadge).join('')}</ul>
        </section>

        <section class="group">
          <h2>${t('journey.rewards')}</h2>
          <ul class="rows">
            ${AVATAR_REWARDS.map((item) => renderReward(item, t('tab.avatar'))).join('')}
            ${REWARDS.map((item) => renderReward(item, friends)).join('')}
          </ul>
        </section>

        <section class="group">
          <h2>${t('world.worlds')}</h2>
          <ul class="rows">${totals.regions.map(renderRegionRow).join('')}</ul>
        </section>

        <section class="group note">
          <h2>${t('journey.sourcesTitle')}</h2>
          <p>${t('journey.sourcesBody')}</p>
          <ul class="credits">
            <li>${t('credits.quran')}</li>
            <li>${t('credits.tafsir')}</li>
            <li>${t('credits.english')}</li>
            <li>${t('credits.hadith')}</li>
          </ul>
        </section>

        <section class="group">
          <h2>${t('journey.settings')}</h2>
          <div class="settings">
            <div class="seg" role="group" aria-label="${t('journey.language')}">
              <button class="seg__btn${lang() === 'ar' ? ' is-active' : ''}" data-lang="ar" lang="ar">العربية</button>
              <button class="seg__btn${lang() === 'en' ? ' is-active' : ''}" data-lang="en" lang="en">English</button>
            </div>
            <button class="switch" role="switch" data-pref="motion" aria-checked="${prefs.motion === 'reduced'}">
              <span>${t('journey.lessMotion')}</span><i></i>
            </button>
            <button class="switch" role="switch" data-pref="haptics" aria-checked="${prefs.haptics}">
              <span>${t('journey.haptics')}</span><i></i>
            </button>
            <button class="btn btn--wide" data-action="reset">${t('journey.reset')}</button>
          </div>
        </section>
      </div>
    </div>`;

  root.querySelector('[data-form="name"]').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = new FormData(event.target).get('name').trim().slice(0, 24);
    store.update((s) => { s.profile.name = name; });
    event.target.querySelector('input').blur();
    buzz('tap');
    toast(t('profile.nameSaved'));
  });

  onClick(root, '[data-lang]', (button) => {
    setLang(button.dataset.lang);
    refresh();
  });

  onClick(root, '[data-pref]', (button) => {
    store.update((s) => {
      if (button.dataset.pref === 'motion') s.prefs.motion = s.prefs.motion === 'reduced' ? 'full' : 'reduced';
      else s.prefs.haptics = !s.prefs.haptics;
    });
    buzz('tap');
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
