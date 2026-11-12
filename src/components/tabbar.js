// The three main sections of the app, always one tap away.

import { icon } from './icons.js';
import { t } from '../core/i18n.js';

const TABS = [
  { route: 'world', icon: 'world', label: 'tab.world' },
  { route: 'friends', icon: 'friends', label: 'tab.friends' },
  { route: 'journey', icon: 'journey', label: 'tab.journey' },
];

// Screens that belong to a tab without being the tab itself.
const PARENT = { island: 'world' };

export function renderTabbar(el, routeName) {
  const hidden = routeName === 'lesson';
  el.hidden = hidden;
  if (hidden) return;
  const active = PARENT[routeName] ?? routeName;

  el.innerHTML = TABS.map((tab) => `
    <a class="tab${tab.route === active ? ' is-active' : ''}" href="#/${tab.route}"
       ${tab.route === active ? 'aria-current="page"' : ''}>
      <span class="tab__icon">${icon(tab.icon, 30)}</span>
      <span class="tab__label">${t(tab.label)}</span>
    </a>`).join('');
}
