// "Awards": the player's collection, in three tabs.
//   Challenges   — daily, weekly and special challenges with live progress
//   Achievements — every achievement, by category
//   Medals       — the medal collection, by rarity
// Tapping an achievement or medal opens a sheet with its details.

import { store } from '../core/store.js';
import { go } from '../core/router.js';
import { t, tr, num, lang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { buzz } from '../core/feel.js';
import { icon } from '../components/icons.js';
import { drawBadge, drawMedal } from '../components/awardArt.js';
import { CATEGORIES, RARITIES } from '../data/awards.js';
import { achievements, medals, challengeBoard, awardSummary, deadlines, requirement } from '../systems/rewards.js';

const TABS = ['challenges', 'achievements', 'medals'];

const bar = (have, goal) => `<span class="bar"><span style="width:${Math.round((Math.min(have, goal) / goal) * 100)}%"></span></span>`;

function timeLeft(ms) {
  const minutes = Math.max(1, Math.ceil(ms / 60000));
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days >= 1) return t('awards.endsDays', { d: num(days), h: num(hours) });
  return t('awards.endsHours', { h: num(hours), m: num(minutes % 60) });
}

function shortDate(iso) {
  return new Intl.DateTimeFormat(lang() === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

/* ---------- Challenges ---------- */

function renderChallenge(c) {
  const about = tr(c.about).replace('{world}', c.world ? tr(c.world.name) : '');
  const medalLine = c.medalEarned
    ? t('awards.medalAll')
    : c.kind === 'special' ? tr(c.medal.name) : `${tr(c.medal.name)} · ${num(Math.min(c.times, c.medal.goal))} / ${num(c.medal.goal)}`;
  return `
    <li class="challenge${c.done ? ' is-done' : ''}">
      <button class="challenge__medal" data-open="medal:${c.medal.id}" aria-label="${esc(tr(c.medal.name))}">
        ${drawMedal(c.medal, { locked: !store.get().earned.medals[c.medal.id] })}
      </button>
      <div class="challenge__main">
        <h3>${esc(tr(c.name))}</h3>
        <p class="challenge__about">${esc(about)}</p>
        ${bar(c.have, c.goal)}
        <p class="challenge__meta">
          <span>${c.done ? `${icon('check', 16)} ${t('awards.done')}` : `${num(c.have)} / ${num(c.goal)}`}</span>
          <span>${t('celebrate.xp', { n: num(c.xp) })}</span>
        </p>
        <p class="challenge__reward">${t('awards.medalReward')}: ${esc(medalLine)}</p>
      </div>
    </li>`;
}

function renderChallenges() {
  const board = challengeBoard();
  const left = deadlines();
  const section = (title, list, clock) => `
    <section class="group">
      <h2>${title}${clock ? `<span class="clock" data-clock="${clock}">${timeLeft(left[clock])}</span>` : ''}</h2>
      <ul class="challenges">${list.map(renderChallenge).join('')}</ul>
    </section>`;
  return section(t('awards.daily'), board.daily, 'daily')
    + section(t('awards.weekly'), board.weekly, 'weekly')
    + section(t('awards.special'), board.special, null);
}

/* ---------- Achievements and medals ---------- */

function tile(type, item) {
  const earned = Boolean(item.earned);
  return `
    <li>
      <button class="award${earned ? ' is-earned' : ''}" data-open="${type}:${item.id}">
        ${type === 'medal' ? drawMedal(item, { locked: !earned }) : drawBadge(item, { locked: !earned })}
        <span class="award__name">${esc(tr(item.name))}</span>
        ${earned ? `<span class="award__note">${type === 'medal' ? shortDate(item.earned) : t('profile.earned')}</span>` : bar(item.have, item.goal)}
      </button>
    </li>`;
}

function renderAchievements() {
  const all = achievements();
  return CATEGORIES.map((category) => {
    const list = all.filter((a) => a.cat === category.id);
    return `
      <section class="group">
        <h2>${esc(tr(category.name))}<span class="clock">${num(list.filter((a) => a.earned).length)} / ${num(list.length)}</span></h2>
        <ul class="awards-grid">${list.map((a) => tile('achievement', a)).join('')}</ul>
      </section>`;
  }).join('');
}

function renderMedals() {
  const all = medals();
  return RARITIES.map((rarity) => {
    const list = all.filter((m) => m.rarity === rarity.id);
    return `
      <section class="group">
        <h2><span class="rarity rarity--${rarity.id}">${esc(tr(rarity.name))}</span><span class="clock">${num(list.filter((m) => m.earned).length)} / ${num(list.length)}</span></h2>
        <ul class="awards-grid">${list.map((m) => tile('medal', m)).join('')}</ul>
      </section>`;
  }).join('');
}

/* ---------- Detail sheet ---------- */

function renderSheet(type, item) {
  const earned = Boolean(item.earned);
  const kind = type === 'medal'
    ? `<span class="rarity rarity--${item.rarity}">${esc(tr(RARITIES.find((r) => r.id === item.rarity).name))}</span>`
    : esc(tr(CATEGORIES.find((c) => c.id === item.cat).name));
  const reward = [item.xp ? t('celebrate.xp', { n: num(item.xp) }) : '', item.item ? t('celebrate.item') : ''].filter(Boolean).join(' · ');
  return `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(tr(item.name))}">
      <div class="sheet__card">
        <button class="btn btn--round sheet__close" data-close aria-label="${t('awards.close')}">${icon('close')}</button>
        <div class="sheet__art${earned ? ' is-earned' : ''}">${type === 'medal' ? drawMedal(item, { locked: !earned }) : drawBadge(item, { locked: !earned })}</div>
        <p class="sheet__kind">${kind}</p>
        <h2>${esc(tr(item.name))}</h2>
        <p>${esc(tr(item.about))}</p>
        <div class="sheet__need">
          <span class="source__label">${t('awards.requirement')}</span>
          <p>${esc(requirement(item, lang()))}</p>
          ${bar(item.have, item.goal)}
          <p class="sheet__count">${num(item.have)} / ${num(item.goal)}</p>
        </div>
        <p class="sheet__state">${earned ? `${icon('check', 18)} ${t('awards.earnedOn', { date: shortDate(item.earned) })}` : `${icon('lock', 18)} ${t('awards.locked')}`}</p>
        ${reward ? `<p class="sheet__reward">${t('awards.reward')}: ${esc(reward)}</p>` : ''}
      </div>
    </div>`;
}

/* ---------- The screen ---------- */

export function mount(root, [tabParam, openParam]) {
  const tab = TABS.includes(tabParam) ? tabParam : 'challenges';
  const sum = awardSummary();

  root.innerHTML = `
    <div class="view awards">
      <header class="awards__head">
        <h1>${t('tab.awards')}</h1>
        <div class="awards__stats">
          <div><b>${num(sum.achievements)}<small> / ${num(sum.achievementsTotal)}</small></b><span>${t('awards.achievements')}</span></div>
          <div><b>${num(sum.medals)}<small> / ${num(sum.medalsTotal)}</small></b><span>${t('awards.medals')}</span></div>
          <div><b>${num(sum.challenges)}</b><span>${t('awards.challengesDone')}</span></div>
        </div>
      </header>
      <div class="creator__tabs awards__tabs" role="tablist">
        ${TABS.map((id) => `<a class="creator__tab${id === tab ? ' is-active' : ''}" role="tab" aria-selected="${id === tab}" href="#/awards/${id}">${t(`awards.${id}`)}</a>`).join('')}
      </div>
      <div class="awards__body">
        ${tab === 'challenges' ? renderChallenges() : tab === 'achievements' ? renderAchievements() : renderMedals()}
      </div>
    </div>`;

  let sheet = null;
  const closeSheet = () => { sheet?.remove(); sheet = null; };
  function openSheet(type, id) {
    const item = (type === 'medal' ? medals() : achievements()).find((entry) => entry.id === id);
    if (!item) return;
    closeSheet();
    // The sheet sits on top of the whole app, above the tab bar.
    const app = document.getElementById('app');
    app.insertAdjacentHTML('beforeend', renderSheet(type, item));
    sheet = app.lastElementChild;
    sheet.addEventListener('click', (event) => {
      if (event.target === sheet || event.target.closest('[data-close]')) closeSheet();
    });
    sheet.querySelector('[data-close]').focus({ preventScroll: true });
  }

  onClick(root, '[data-open]', (button) => {
    buzz('tap');
    const [type, id] = button.dataset.open.split(':');
    openSheet(type, id);
  });

  // A link such as #/awards/medals/m-island-1 opens that item straight away.
  if (openParam) openSheet(tab === 'medals' ? 'medal' : 'achievement', openParam);

  // Keep the countdowns fresh; when a day or week ends, draw the new challenges.
  const timer = setInterval(() => {
    const left = deadlines();
    const today = store.get().challenges.daily.key;
    root.querySelectorAll('[data-clock]').forEach((el) => { el.textContent = timeLeft(left[el.dataset.clock]); });
    if (tab === 'challenges' && new Date().toDateString() !== new Date(`${today}T00:00`).toDateString()) go('awards/challenges');
  }, 30000);

  return () => {
    clearInterval(timer);
    closeSheet();
  };
}
