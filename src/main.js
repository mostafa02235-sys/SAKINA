// SAKINA starts here: pick the screen for the current address and draw it.
//
// To add a screen: create src/screens/<name>.js exporting mount(root, params),
// then add it to SCREENS below. It is reachable at #/<name>.

import { startRouter } from './core/router.js';
import { applyDocumentLanguage } from './core/i18n.js';
import { renderTabbar } from './components/tabbar.js';
import * as world from './screens/world.js';
import * as island from './screens/island.js';
import * as lesson from './screens/lesson.js';
import * as friends from './screens/friends.js';
import * as journey from './screens/journey.js';

const SCREENS = { world, island, lesson, friends, journey };

const screenEl = document.getElementById('screen');
const tabbarEl = document.getElementById('tabbar');

function show(route) {
  const name = SCREENS[route.name] ? route.name : 'world';
  applyDocumentLanguage();
  renderTabbar(tabbarEl, name);

  // Each visit gets a fresh host element, so a screen's click handlers
  // disappear with it when the player moves on.
  const host = document.createElement('div');
  host.className = 'host';
  screenEl.replaceChildren(host);
  SCREENS[name].mount(host, route.params);
}

startRouter(show);
