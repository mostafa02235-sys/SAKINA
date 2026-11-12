// "My Avatar": the player builds their own character.
// Changes show at once on the big preview and are kept when "Save" is tapped.

import { store, DEFAULT_AVATAR } from '../core/store.js';
import { t, tr, num } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { buzz } from '../core/feel.js';
import { renderAvatar, randomAvatar } from '../avatar/draw.js';
import { AVATAR, VIEWS } from '../data/avatar.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { isItemUnlocked } from '../systems/progress.js';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// What each tab lets the player change: [setting, kind, palette or option list, show-when]
const TABS = [
  { id: 'face', controls: [['face', 'tiles'], ['skin', 'colours', 'skin'], ['eyes', 'tiles'], ['mood', 'tiles']] },
  { id: 'hair', controls: [['hair', 'tiles', null, (a) => a.head !== 'hijab'], ['hairColor', 'colours', 'hairColor', (a) => a.head !== 'hijab' && a.hair !== 'none'], ['head', 'tiles'], ['headColor', 'colours', 'cloth', (a) => a.head !== 'none']] },
  { id: 'clothes', controls: [['top', 'tiles'], ['topColor', 'colours', 'cloth'], ['bottomColor', 'colours', 'cloth', (a) => !['thobe', 'abaya'].includes(a.top)], ['scarf', 'tiles', null, (a) => a.head !== 'hijab'], ['scarfColor', 'colours', 'cloth', (a) => a.scarf !== 'none' && a.head !== 'hijab']] },
  { id: 'extras', controls: [['glasses', 'tiles'], ['pack', 'tiles'], ['packColor', 'colours', 'cloth', (a) => a.pack !== 'none'], ['extra', 'tiles']] },
];

export function mount(root) {
  const ui = { tab: 'face', view: 0, draft: { ...store.get().avatar } };
  const dirty = () => !same(ui.draft, store.get().avatar);

  root.innerHTML = `
    <div class="view creator">
      <h1 class="visually-hidden">${t('tab.avatar')}</h1>
      <div class="creator__stage">
        <button class="btn btn--round" data-action="turn" data-step="-1" aria-label="${t('avatar.turnLeft')}">${icon('back')}</button>
        <div class="creator__preview"></div>
        <button class="btn btn--round creator__turn-next" data-action="turn" data-step="1" aria-label="${t('avatar.turnRight')}">${icon('back')}</button>
      </div>
      <div class="creator__tabs" role="tablist"></div>
      <div class="panel"></div>
      <div class="lookbar"></div>
    </div>`;
  const preview = root.querySelector('.creator__preview');
  const tabs = root.querySelector('.creator__tabs');
  const panel = root.querySelector('.panel');
  const bar = root.querySelector('.lookbar');

  function drawPreview() {
    preview.innerHTML = renderAvatar(ui.draft, { view: VIEWS[ui.view], label: t('tab.avatar') });
  }

  function drawTabs() {
    tabs.innerHTML = TABS.map((tab) => `
      <button class="creator__tab${tab.id === ui.tab ? ' is-active' : ''}" role="tab" aria-selected="${tab.id === ui.tab}" data-tab="${tab.id}">${t(`avatar.tab.${tab.id}`)}</button>`).join('');
  }

  function drawPanel() {
    const tab = TABS.find((x) => x.id === ui.tab);
    panel.innerHTML = tab.controls.filter(([, , , when]) => !when || when(ui.draft)).map(([key, kind, palette]) => {
      const title = `<h2>${t(`avatar.${key}`)}</h2>`;
      if (kind === 'colours') {
        return `<section class="group">${title}<div class="swatches">${AVATAR[palette].map((colour, i) => `
          <button class="swatch${ui.draft[key] === colour ? ' is-active' : ''}" style="--c:${colour}" data-set="${key}" data-value="${colour}"
                  aria-pressed="${ui.draft[key] === colour}" aria-label="${t('friends.colorN', { n: num(i + 1) })}"></button>`).join('')}</div></section>`;
      }
      return `<section class="group">${title}<div class="tiles">${AVATAR[key].map((option) => {
        const open = isItemUnlocked(option);
        return `
          <button class="tile${ui.draft[key] === option.id ? ' is-active' : ''}${open ? '' : ' is-locked'}" data-set="${key}" data-value="${option.id}"
                  data-level="${option.level ?? ''}" aria-pressed="${ui.draft[key] === option.id}">
            <span class="tile__name">${esc(tr(option.name))}</span>
            ${open ? '' : `<span class="tile__lock">${icon('lock', 16)} ${t('journey.level', { n: num(option.level) })}</span>`}
          </button>`;
      }).join('')}</div></section>`;
    }).join('');
  }

  function drawBar() {
    bar.classList.toggle('is-dirty', dirty());
    bar.innerHTML = `
      <p class="lookbar__note" role="status">${dirty() ? t('friends.unsaved') : t('avatar.saved')}</p>
      <div class="lookbar__actions lookbar__actions--three">
        <button class="btn" data-action="random">${t('avatar.random')}</button>
        <button class="btn" data-action="reset">${t('avatar.reset')}</button>
        <button class="btn btn--go" data-action="save" ${dirty() ? '' : 'disabled'}>${t('avatar.save')}</button>
      </div>`;
  }

  const drawAll = () => { drawPreview(); drawTabs(); drawPanel(); drawBar(); };

  onClick(root, '[data-tab]', (button) => {
    ui.tab = button.dataset.tab;
    drawTabs();
    drawPanel();
  });

  onClick(root, '[data-set]', (button) => {
    if (button.classList.contains('is-locked')) {
      buzz('wrong');
      return toast(t('avatar.lockedToast', { n: num(Number(button.dataset.level)) }));
    }
    ui.draft[button.dataset.set] = button.dataset.value;
    if (ui.view === 2) ui.view = 0; // show the front again so the change is visible
    buzz('tap');
    drawPreview();
    drawPanel();
    drawBar();
  });

  onClick(root, '[data-action="turn"]', (button) => {
    ui.view = (ui.view + Number(button.dataset.step) + VIEWS.length) % VIEWS.length;
    buzz('tap');
    drawPreview();
  });

  onClick(root, '[data-action="random"]', () => {
    ui.draft = randomAvatar(AVATAR, (option) => isItemUnlocked(option));
    ui.view = 0;
    buzz('tap');
    drawAll();
  });

  onClick(root, '[data-action="reset"]', () => {
    ui.draft = { ...DEFAULT_AVATAR };
    ui.view = 0;
    buzz('tap');
    toast(t('avatar.resetToast'));
    drawAll();
  });

  onClick(root, '[data-action="save"]', () => {
    if (!dirty()) return;
    store.update((save) => { save.avatar = { ...ui.draft }; });
    buzz('reward');
    toast(t('avatar.savedToast'));
    drawBar();
  });

  // Swipe across the preview to turn the avatar.
  let startX = null;
  preview.addEventListener('pointerdown', (event) => { startX = event.clientX; });
  preview.addEventListener('pointerup', (event) => {
    if (startX == null) return;
    const dx = event.clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    ui.view = (ui.view + (dx < 0 ? 1 : -1) + VIEWS.length) % VIEWS.length;
    drawPreview();
  });
  preview.addEventListener('pointercancel', () => { startX = null; });

  drawAll();

  return () => {
    if (dirty()) toast(t('avatar.notSavedToast'));
  };
}
