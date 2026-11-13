// The celebration shown when something is earned: a challenge completed, a
// medal, an achievement, or a new level. Items are shown one at a time.
//
//   celebrate([{ type: 'medal', def }, { type: 'level', level: 4 }])

import { t, tr, num } from '../core/i18n.js';
import { esc } from '../core/dom.js';
import { buzz } from '../core/feel.js';
import { play } from '../core/sound.js';
import { store } from '../core/store.js';
import { drawBadge, drawMedal } from './awardArt.js';
import { renderAvatar } from '../avatar/draw.js';
import { CATEGORIES, RARITIES, MEDALS } from '../data/awards.js';

const CONFETTI = ['#ffbf3c', '#2fbf8f', '#ff7a66', '#4a6fd6', '#b57be0', '#f06fa5'];
const confetti = () => Array.from({ length: 18 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 6) * 0.12}s;--c:${CONFETTI[i % CONFETTI.length]};--r:${(i * 47) % 360}deg"></i>`).join('');

let queue = [];
let overlay = null;

/**
 * A completed challenge and the medal it has just earned are shown together,
 * with the medal as the picture.
 */
function arrange(items) {
  const out = [];
  const used = new Set();
  for (const item of items) {
    if (used.has(item)) continue;
    if (item.type === 'challenge') {
      const medal = items.find((other) => other.type === 'medal' && other.def.challenge === item.def.id && !used.has(other));
      if (medal) used.add(medal);
      out.push({ ...item, medal: medal?.def ?? null });
    } else {
      out.push(item);
    }
  }
  return out;
}

function card(item) {
  if (item.type === 'level') {
    return {
      sound: 'level', kicker: t('celebrate.level'), title: t('journey.level', { n: num(item.level) }),
      art: `<div class="celebrate__avatar">${renderAvatar(store.get().avatar, { mood: 'grin' })}</div>`,
      text: t('celebrate.levelText'), reward: '',
    };
  }
  const { def } = item;
  if (item.type === 'challenge') {
    // No new medal this time: show the one being worked towards, still locked.
    const next = item.medal ?? MEDALS.filter((m) => m.challenge === def.id).find((m) => !store.get().earned.medals[m.id]);
    const times = store.get().challenges.counts[def.id] ?? 0;
    return {
      sound: item.medal ? 'medal' : 'challenge',
      kicker: t('celebrate.challenge'),
      title: tr(def.name),
      art: next ? drawMedal(next, { locked: !item.medal }) : drawMedal(MEDALS.filter((m) => m.challenge === def.id).pop()),
      text: item.medal ? t('celebrate.medalWon', { name: tr(item.medal.name) })
        : next ? t('celebrate.medalNext', { name: tr(next.name), have: num(times), goal: num(next.goal) }) : '',
      reward: t('celebrate.xp', { n: num(def.xp) }),
    };
  }
  if (item.type === 'medal') {
    return {
      sound: 'medal', kicker: `${t('celebrate.medal')} · ${tr(RARITIES.find((r) => r.id === def.rarity).name)}`,
      title: tr(def.name), art: drawMedal(def), text: tr(def.about), reward: def.item ? t('celebrate.item') : '',
    };
  }
  return {
    sound: 'achievement', kicker: `${t('celebrate.achievement')} · ${tr(CATEGORIES.find((c) => c.id === def.cat).name)}`,
    title: tr(def.name), art: drawBadge(def), text: tr(def.about),
    reward: t('celebrate.xp', { n: num(def.xp) }) + (def.item ? ` · ${t('celebrate.item')}` : ''),
  };
}

function showNext() {
  const item = queue.shift();
  if (!item) return closeCelebration();
  const c = card(item);
  overlay.innerHTML = `
    <div class="celebrate__confetti" aria-hidden="true">${confetti()}</div>
    <div class="celebrate__card">
      <p class="celebrate__kicker">${esc(c.kicker)}</p>
      <div class="celebrate__art">${c.art}</div>
      <h2 class="celebrate__title">${esc(c.title)}</h2>
      ${c.text ? `<p class="celebrate__text">${esc(c.text)}</p>` : ''}
      ${c.reward ? `<p class="celebrate__reward">${esc(c.reward)}</p>` : ''}
      <button class="btn btn--go btn--wide" data-celebrate="next">${t('lesson.continue')}</button>
      ${queue.length ? `<button class="celebrate__skip" data-close>${t('celebrate.skip', { n: num(queue.length) })}</button>` : '<span data-close hidden></span>'}
    </div>`;
  play(c.sound);
  buzz('reward');
  overlay.querySelector('[data-celebrate]').focus({ preventScroll: true });
}

export function closeCelebration() {
  queue = [];
  overlay?.remove();
  overlay = null;
}

export function celebrate(items) {
  if (!items?.length) return;
  queue.push(...arrange(items));
  if (overlay) return; // already showing: the new ones follow
  overlay = document.createElement('div');
  overlay.className = 'celebrate';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) closeCelebration();
    else if (event.target.closest('[data-celebrate]')) showNext();
  });
  document.getElementById('app').append(overlay);
  showNext();
}
