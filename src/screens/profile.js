// "My profile": the player's avatar and name, level and XP, awards, progress
// through the worlds, rewards, sources and settings (including sound).

import { REWARDS, CHARACTERS } from '../data/wardrobe.js';
import { AVATAR_PRIZES } from '../data/avatar.js';
import { store } from '../core/store.js';
import { refresh } from '../core/router.js';
import { t, tr, num, lang, setLang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { buzz } from '../core/feel.js';
import { play, SOUNDS } from '../core/sound.js';
import { renderAvatar } from '../avatar/draw.js';
import { icon } from '../components/icons.js';
import { drawAward } from '../components/awardArt.js';
import { toast } from '../components/toast.js';
import { level, stats, isItemUnlocked, regionUnlocked } from '../systems/progress.js';
import { awardSummary, latestAwards } from '../systems/rewards.js';

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

function renderReward(item, forWhom) {
  const open = isItemUnlocked(item);
  const need = item.need ? t('profile.needsAward', { name: tr(item.need.name) })
    : item.level ? t('profile.needsLevel', { n: num(item.level) }) : t('journey.needs', { n: num(item.stars) });
  return `
    <li class="row${open ? '' : ' row--locked'}">
      <span class="row__icon">${icon(open ? 'star' : 'lock', 22)}</span>
      <span class="row__main">
        <span class="row__name">${esc(tr(item.name))}</span>
        <span class="row__note">${forWhom} · ${open ? t('journey.unlocked') : need}</span>
      </span>
    </li>`;
}

// Set just before a redraw so the page stays where the player was.
let keepScroll = 0;
const percent = (value) => `${num(value)}${lang() === 'ar' ? '٪' : '%'}`;

const toggle = (pref, label, on) => `
  <button class="switch" role="switch" data-pref="${pref}" aria-checked="${on}"><span>${label}</span><i></i></button>`;

function renderSound(sound) {
  const off = sound.on ? '' : ' is-off';
  return `
    <section class="group" id="sound">
      <h2>${icon('sound', 22)} ${t('sound.title')}</h2>
      <div class="settings">
        ${toggle('sound.on', t('sound.on'), sound.on)}
        <label class="slider${off}">
          <span>${t('sound.volume')} <b data-volume>${percent(Math.round(sound.volume * 100))}</b></span>
          <input type="range" min="0" max="100" step="5" value="${Math.round(sound.volume * 100)}" data-volume-input aria-label="${t('sound.volume')}">
        </label>
        <div class="settings${off}">
          ${toggle('sound.answers', t('sound.answers'), sound.answers)}
          ${toggle('sound.rewards', t('sound.rewards'), sound.rewards)}
          ${toggle('sound.ui', t('sound.ui'), sound.ui)}
        </div>
        <div>
          <p class="row__note">${t('sound.preview')}</p>
          <div class="tiles previews">
            ${Object.keys(SOUNDS).map((name) => `<button class="tile" data-preview="${name}"><span class="tile__name">${t(`sound.name.${name}`)}</span></button>`).join('')}
          </div>
        </div>
        <p class="row__note">${t('sound.note')}</p>
      </div>
    </section>`;
}

export function mount(root) {
  const save = store.get();
  const lv = level(save);
  const totals = stats(save);
  const awards = awardSummary(save);
  const latest = latestAwards(6, save);
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
          <div class="stat">${icon('flame', 30)}<b>${num(awards.streak)}</b><span>${t('hud.streak')}</span></div>
        </div>

        <section class="group">
          <h2>${icon('trophy', 22)} ${t('tab.awards')}</h2>
          <div class="facts">
            <a class="fact" href="#/awards/achievements"><b>${num(awards.achievements)}<small> / ${num(awards.achievementsTotal)}</small></b><span>${t('awards.achievements')}</span></a>
            <a class="fact" href="#/awards/medals"><b>${num(awards.medals)}<small> / ${num(awards.medalsTotal)}</small></b><span>${t('awards.medals')}</span></a>
            <a class="fact" href="#/awards/challenges"><b>${num(awards.challenges)}</b><span>${t('awards.challengesDone')}</span></a>
            <div class="fact"><b>${num(awards.streak)}</b><span>${t('profile.streakNow')}</span></div>
            <div class="fact"><b>${num(awards.bestStreak)}</b><span>${t('profile.streakBest')}</span></div>
            <div class="fact"><b>${num(awards.xp)}</b><span>${t('profile.totalXp')}</span></div>
          </div>
          <span class="bar"><span style="width:${Math.round((awards.achievements / awards.achievementsTotal) * 100)}%"></span></span>
          <p class="row__note">${t('profile.achievementProgress', { done: num(awards.achievements), total: num(awards.achievementsTotal) })}</p>
          ${latest.length ? `
            <p class="row__note latest__title">${t('profile.latest')}</p>
            <div class="latest">
              ${latest.map(({ type, def }) => `
                <a class="latest__item" href="#/awards/${type === 'medal' ? 'medals' : 'achievements'}/${def.id}" aria-label="${esc(tr(def.name))}">
                  ${drawAward(type, def)}<span>${esc(tr(def.name))}</span>
                </a>`).join('')}
            </div>` : `<p class="row__note">${t('profile.noAwards')}</p>`}
          <a class="btn btn--star btn--wide" href="#/awards/achievements">${t('profile.viewAwards')}</a>
        </section>

        <section class="group">
          <h2>${t('profile.overall')}</h2>
          <span class="bar bar--big"><span style="width:${Math.max(totals.percent, totals.lessons ? 1 : 0)}%"></span></span>
          <p class="row__note">${t('profile.overallNote', { done: num(totals.lessons), total: num(totals.totalLessons), islands: num(totals.totalIslands) })}</p>
        </section>

        <section class="group">
          <h2>${t('journey.rewards')}</h2>
          <ul class="rows">
            ${AVATAR_PRIZES.map((item) => renderReward(item, t('tab.avatar'))).join('')}
            ${REWARDS.map((item) => renderReward(item, friends)).join('')}
          </ul>
        </section>

        <section class="group">
          <h2>${t('world.worlds')}</h2>
          <ul class="rows">${totals.regions.map(renderRegionRow).join('')}</ul>
        </section>

        ${renderSound(prefs.sound)}

        <section class="group">
          <h2>${t('journey.settings')}</h2>
          <div class="settings">
            <div class="seg" role="group" aria-label="${t('journey.language')}">
              <button class="seg__btn${lang() === 'ar' ? ' is-active' : ''}" data-lang="ar" lang="ar">العربية</button>
              <button class="seg__btn${lang() === 'en' ? ' is-active' : ''}" data-lang="en" lang="en">English</button>
            </div>
            ${toggle('motion', t('journey.lessMotion'), prefs.motion === 'reduced')}
            ${toggle('haptics', t('journey.haptics'), prefs.haptics)}
            <button class="btn btn--wide" data-action="reset">${t('journey.reset')}</button>
          </div>
        </section>

        <section class="group note">
          <h2>${t('journey.sourcesTitle')}</h2>
          <p>${t('journey.sourcesBody')}</p>
          <ul class="credits">
            <li>${t('credits.quran')}</li>
            <li>${t('credits.tafsir')}</li>
            <li>${t('credits.english')}</li>
            <li>${t('credits.hadith')}</li>
            <li>${t('credits.sound')}</li>
          </ul>
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

  // Keep the place on the page when a switch redraws the screen.
  const redrawInPlace = () => {
    keepScroll = root.scrollTop;
    refresh();
  };

  onClick(root, '[data-pref]', (button) => {
    const pref = button.dataset.pref;
    store.update((s) => {
      if (pref === 'motion') s.prefs.motion = s.prefs.motion === 'reduced' ? 'full' : 'reduced';
      else if (pref === 'haptics') s.prefs.haptics = !s.prefs.haptics;
      else if (pref.startsWith('sound.')) s.prefs.sound[pref.slice(6)] = !s.prefs.sound[pref.slice(6)];
    });
    buzz('tap');
    if (pref === 'sound.on' && store.get().prefs.sound.on) play('correct');
    redrawInPlace();
  });

  // Volume: saved as the slider moves; a sound is played when the finger lifts.
  const slider = root.querySelector('[data-volume-input]');
  slider.addEventListener('input', () => {
    store.update((s) => { s.prefs.sound.volume = Number(slider.value) / 100; });
    root.querySelector('[data-volume]').textContent = percent(Number(slider.value));
  });
  slider.addEventListener('change', () => play('correct', { preview: true }));

  onClick(root, '[data-preview]', (button) => {
    if (!play(button.dataset.preview, { preview: true })) toast(t('sound.silent'));
  });

  if (keepScroll) {
    root.scrollTop = keepScroll;
    keepScroll = 0;
  }

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
