// The strip at the top of the world: name, stars, day streak, language.

import { icon } from './icons.js';
import { t, num, lang } from '../core/i18n.js';
import { totalStars, dayStreak } from '../systems/progress.js';

export function renderHud() {
  const other = lang() === 'ar' ? 'English' : 'العربية';
  return `
    <header class="hud">
      <div class="hud__brand">
        <span class="hud__name">${t('app.name')}</span>
      </div>
      <div class="hud__stats">
        <span class="chip" title="${t('hud.stars')}">${icon('star', 20)}<b>${num(totalStars())}</b>
          <span class="visually-hidden">${t('hud.stars')}</span></span>
        <span class="chip" title="${t('hud.streak')}">${icon('flame', 20)}<b>${num(dayStreak())}</b>
          <span class="visually-hidden">${t('hud.streak')}</span></span>
        <button class="chip chip--button" data-action="switch-language" lang="${lang() === 'ar' ? 'en' : 'ar'}">${other}</button>
      </div>
    </header>`;
}
