// "Friends": dress and colour Zad and Lulu.
//
// Changes are tried on straight away but are only kept when the player taps
// "Save look". "Restore" undoes unsaved changes; with nothing unsaved it brings
// back the look from before the last save.

import { store } from '../core/store.js';
import { t, tr, num } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { buzz } from '../core/feel.js';
import { renderCharacter } from '../characters/index.js';
import { EXPRESSIONS } from '../characters/parts.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { isItemUnlocked } from '../systems/progress.js';
import { CHARACTERS, OUTFITS, OUTFIT_COLORS, ACCESSORIES, EXPRESSION_NAMES } from '../data/wardrobe.js';

const KINDS = ['raccoon', 'cat'];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function swatches(field, colors, current) {
  return `<div class="swatches">${colors.map((color, i) => `
    <button class="swatch${color === current ? ' is-active' : ''}" style="--c:${color}"
            data-set="${field}" data-value="${color}" aria-pressed="${color === current}"
            aria-label="${t('friends.colorN', { n: num(i + 1) })}"></button>`).join('')}</div>`;
}

function tiles(field, items, current) {
  return `<div class="tiles">${items.map((item) => {
    const open = isItemUnlocked(item);
    return `
      <button class="tile${item.id === current ? ' is-active' : ''}${open ? '' : ' is-locked'}"
              data-set="${field}" data-value="${item.id}" data-stars="${item.stars}"
              aria-pressed="${item.id === current}">
        <span class="tile__name">${esc(tr(item.name))}</span>
        ${open ? '' : `<span class="tile__lock">${icon('lock', 16)} ${num(item.stars)} ${icon('star', 16)}</span>`}
      </button>`;
  }).join('')}</div>`;
}

export function mount(root) {
  const ui = {
    who: 'raccoon',
    expression: 'happy',
    walking: false,
    draft: structuredClone(store.get().characters), // what is on screen, not yet saved
  };
  const saved = () => store.get().characters;
  const dirty = () => !same(ui.draft, saved());

  root.innerHTML = `
    <div class="view friends">
      <h1 class="visually-hidden">${t('tab.friends')}</h1>
      <div class="stage"></div>
      <div class="panel"></div>
      <div class="lookbar"></div>
    </div>`;
  const stage = root.querySelector('.stage');
  const panel = root.querySelector('.panel');
  const lookbar = root.querySelector('.lookbar');

  function drawStage() {
    stage.innerHTML = KINDS.map((kind) => `
      <button class="stage__spot${ui.who === kind ? ' is-chosen' : ''}" data-who="${kind}" aria-pressed="${ui.who === kind}">
        ${renderCharacter(kind, ui.draft[kind], {
          expression: ui.who === kind ? ui.expression : 'happy',
          walking: ui.who === kind && ui.walking,
        })}
        <span class="stage__name">${esc(tr(CHARACTERS[kind].name))}</span>
        <span class="stage__role">${esc(tr(CHARACTERS[kind].role))}</span>
      </button>`).join('') + '<span class="stage__ground" aria-hidden="true"></span>';
  }

  function drawPanel() {
    const look = ui.draft[ui.who];
    const catalog = CHARACTERS[ui.who];
    const name = tr(catalog.name);
    panel.innerHTML = `
      <section class="group">
        <h2>${t('friends.fur', { name })}</h2>
        ${swatches('fur', catalog.fur, look.fur)}
      </section>
      <section class="group">
        <h2>${t('friends.marks')}</h2>
        ${swatches('marks', catalog.marks, look.marks)}
      </section>
      <section class="group">
        <h2>${t('friends.outfit')}</h2>
        ${tiles('outfit', OUTFITS, look.outfit)}
        ${look.outfit === 'none' ? '' : swatches('outfitColor', OUTFIT_COLORS, look.outfitColor)}
      </section>
      <section class="group">
        <h2>${t('friends.accessory')}</h2>
        ${tiles('accessory', ACCESSORIES, look.accessory)}
      </section>
      <section class="group">
        <h2>${t('friends.expression')}</h2>
        <div class="tiles">${EXPRESSIONS.map((id) => `
          <button class="tile${ui.expression === id ? ' is-active' : ''}" data-expression="${id}"
                  aria-pressed="${ui.expression === id}">
            <span class="tile__name">${esc(tr(EXPRESSION_NAMES[id]))}</span>
          </button>`).join('')}</div>
      </section>
      <section class="group">
        <h2>${t('friends.move')}</h2>
        <div class="tiles">
          <button class="tile${ui.walking ? '' : ' is-active'}" data-walk="off" aria-pressed="${!ui.walking}">
            <span class="tile__name">${t('friends.stand')}</span>
          </button>
          <button class="tile${ui.walking ? ' is-active' : ''}" data-walk="on" aria-pressed="${ui.walking}">
            <span class="tile__name">${t('friends.walk')}</span>
          </button>
        </div>
      </section>`;
  }

  function drawLookbar() {
    const canRestore = dirty() || store.get().previousCharacters != null;
    lookbar.classList.toggle('is-dirty', dirty());
    lookbar.innerHTML = `
      <p class="lookbar__note" role="status">${dirty() ? t('friends.unsaved') : t('friends.allSaved')}</p>
      <div class="lookbar__actions">
        <button class="btn" data-action="restore" ${canRestore ? '' : 'disabled'}>${t('friends.restore')}</button>
        <button class="btn btn--go" data-action="save" ${dirty() ? '' : 'disabled'}>${t('friends.save')}</button>
      </div>`;
  }

  function drawAll() {
    drawStage();
    drawPanel();
    drawLookbar();
  }

  function choose(kind) {
    if (ui.who === kind) return;
    ui.who = kind;
    ui.expression = 'happy';
    ui.walking = false;
    buzz('tap');
    drawAll();
  }

  let swiped = false; // a swipe also produces a click; this lets us ignore it
  onClick(root, '[data-who]', (button) => {
    if (!swiped) choose(button.dataset.who);
  });

  onClick(root, '[data-set]', (button) => {
    if (button.classList.contains('is-locked')) {
      buzz('wrong');
      return toast(t('friends.lockedToast', { n: num(Number(button.dataset.stars)) }));
    }
    ui.draft[ui.who][button.dataset.set] = button.dataset.value;
    buzz('tap');
    drawAll();
  });

  onClick(root, '[data-expression]', (button) => {
    ui.expression = button.dataset.expression;
    drawStage();
    drawPanel();
  });

  onClick(root, '[data-walk]', (button) => {
    ui.walking = button.dataset.walk === 'on';
    drawStage();
    drawPanel();
  });

  onClick(root, '[data-action="save"]', () => {
    if (!dirty()) return;
    store.update((save) => {
      save.previousCharacters = save.characters;
      save.characters = structuredClone(ui.draft);
    });
    ui.expression = 'cheer';
    buzz('reward');
    toast(t('friends.savedToast'));
    drawAll();
  });

  onClick(root, '[data-action="restore"]', () => {
    if (dirty()) {
      ui.draft = structuredClone(saved());
      toast(t('friends.undoneToast'));
    } else if (store.get().previousCharacters) {
      // Swap the saved look with the one before it, so Restore can also be undone.
      store.update((save) => {
        [save.characters, save.previousCharacters] = [save.previousCharacters, save.characters];
      });
      ui.draft = structuredClone(saved());
      toast(t('friends.restoredToast'));
    } else {
      return;
    }
    buzz('tap');
    drawAll();
  });

  // Swipe across the stage to switch between Zad and Lulu.
  let startX = null;
  stage.addEventListener('pointerdown', (event) => { startX = event.clientX; });
  stage.addEventListener('pointerup', (event) => {
    if (startX == null) return;
    const dx = event.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 48) {
      swiped = true;
      setTimeout(() => { swiped = false; }, 80);
      choose(ui.who === 'raccoon' ? 'cat' : 'raccoon');
    }
  });
  stage.addEventListener('pointercancel', () => { startX = null; });

  drawAll();

  // Leaving with unsaved changes: say so, rather than losing them silently.
  return () => {
    if (dirty()) toast(t('friends.notSavedToast'));
  };
}
