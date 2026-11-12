// SAKINA starts here: pick the screen for the current address and draw it.
//
// To add a screen: create src/screens/<name>.js exporting mount(root, params),
// then add it to SCREENS below. It is reachable at #/<name>.
// mount() may return a function; it is called when the player leaves the screen.

import { startRouter, parseRoute, go } from './core/router.js';
import { applyDocumentLanguage, t } from './core/i18n.js';
import { applyMotionPreference, reducedMotion } from './core/feel.js';
import { findLesson } from './data/islands.js';
import { renderTabbar } from './components/tabbar.js';
import * as world from './screens/world.js';
import * as island from './screens/island.js';
import * as lesson from './screens/lesson.js';
import * as friends from './screens/friends.js';
import * as journey from './screens/journey.js';

const SCREENS = { world, island, lesson, friends, journey };

// How deep each screen is in the world: moving deeper zooms in, moving back zooms out.
const DEPTH = { world: 0, friends: 0, journey: 0, island: 1, lesson: 2 };

const screenEl = document.getElementById('screen');
const tabbarEl = document.getElementById('tabbar');

let leaveCurrent = null;
let currentName = null;

function draw(name, params) {
  leaveCurrent?.();
  leaveCurrent = null;

  applyDocumentLanguage();
  applyMotionPreference();
  renderTabbar(tabbarEl, name);

  // Each visit gets a fresh host element, so a screen's click handlers
  // disappear with it when the player moves on.
  const host = document.createElement('div');
  host.className = 'host';
  screenEl.replaceChildren(host);

  try {
    leaveCurrent = SCREENS[name].mount(host, params) ?? null;
  } catch (error) {
    console.error(error);
    host.innerHTML = `
      <div class="view oops-screen">
        <h1>${t('error.title')}</h1>
        <p>${t('error.body')}</p>
        <a class="btn btn--go" href="#/world">${t('nav.backToWorld')}</a>
      </div>`;
  }
  currentName = name;
}

function show(route) {
  const name = SCREENS[route.name] ? route.name : 'world';
  const from = currentName;
  const direction = from == null || DEPTH[name] === DEPTH[from] ? 'same'
    : DEPTH[name] > DEPTH[from] ? 'in' : 'out';

  if (from == null || reducedMotion() || !document.startViewTransition) return draw(name, route.params);

  document.documentElement.dataset.nav = direction;
  document.startViewTransition(() => draw(name, route.params));
}

// The phone's Back button (called by the Android app): go up one level.
// Returns false on the world map, which tells Android to leave the app.
window.sakinaBack = () => {
  const route = parseRoute();
  if (route.name === 'world' || !SCREENS[route.name]) return false;
  if (route.name === 'lesson') {
    const found = findLesson(route.params[0]);
    go(found ? `island/${found.island.id}` : 'world');
  } else {
    go('world');
  }
  return true;
};

document.documentElement.classList.toggle('no-view-transitions', !document.startViewTransition);
startRouter(show);

// The first screen is drawn: take the loading screen away.
window.sakinaReady = true;
document.getElementById('boot')?.remove();
