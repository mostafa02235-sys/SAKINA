// SAKINA starts here: pick the screen for the current address and draw it.
//
// To add a screen: create src/screens/<name>.js exporting mount(root, params),
// then add it to SCREENS below. It is reachable at #/<name>.
// mount() may return a function; it is called when the player leaves the screen.

import { startRouter, parseRoute, go } from './core/router.js';
import { applyDocumentLanguage, t } from './core/i18n.js';
import { applyMotionPreference, reducedMotion } from './core/feel.js';
import { findLesson, loadCatalog } from './data/islands.js';
import { renderTabbar } from './components/tabbar.js';
import * as world from './screens/world.js';
import * as island from './screens/island.js';
import * as lesson from './screens/lesson.js';
import * as friends from './screens/friends.js';
import * as avatar from './screens/avatar.js';
import * as profile from './screens/profile.js';
import * as awards from './screens/awards.js';
import { syncRewards } from './systems/rewards.js';
import { celebrate, closeCelebration } from './components/celebrate.js';
import { play, unlockSound } from './core/sound.js';

const SCREENS = { world, island, lesson, friends, avatar, profile, awards, journey: profile };

// How deep each screen is in the world: moving deeper zooms in, moving back zooms out.
const DEPTH = { world: 0, friends: 0, avatar: 0, profile: 0, awards: 0, journey: 0, island: 1, lesson: 2 };

// Was there a saved game when the app opened? (Reported once at start-up.)
const returningPlayer = localStorage.getItem('sakina.save.v1') != null;

const screenEl = document.getElementById('screen');
const tabbarEl = document.getElementById('tabbar');

let leaveCurrent = null;
let currentName = null;

function draw(name, params) {
  leaveCurrent?.();
  leaveCurrent = null;
  closeCelebration();

  // Start a new day's challenges if the day has changed, and give anything
  // that has been earned (for example by answers in a lesson that was left).
  let news = [];
  try {
    news = syncRewards();
  } catch (error) {
    console.error(error);
  }

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
  if (currentName && currentName !== name && name !== 'lesson') play('nav');
  currentName = name;
  if (news.length && name !== 'lesson') celebrate(news);
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
  // First close whatever is open on top of the screen.
  const open = document.querySelector('.celebrate [data-close], .sheet [data-close]');
  if (open) {
    open.click();
    return true;
  }
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

// Browsers only allow sound after the first touch.
window.addEventListener('pointerdown', unlockSound, { once: true, capture: true });

// The list of worlds and islands is needed before anything can be drawn.
// If it cannot be read, the loading screen turns into its "try again" message.
loadCatalog().then(() => {
  startRouter(show);
  window.sakinaReady = true;
  console.info(`SAKINA ready: screen=${currentName} returning=${returningPlayer}`);
  document.getElementById('boot')?.remove();
}).catch((error) => {
  console.error(error);
  document.getElementById('boot')?.classList.add('has-error');
});
