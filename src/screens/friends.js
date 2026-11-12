// "Friends": dress and colour Zad and Lulu. Every tap is saved straight away.

import { store } from '../core/store.js';
import { t, tr, num } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { renderCharacter } from '../characters/index.js';
import { EXPRESSIONS } from '../characters/parts.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { isItemUnlocked } from '../systems/progress.js';
import { CHARACTERS, OUTFITS, OUTFIT_COLORS, ACCESSORIES, EXPRESSION_NAMES } from '../data/wardrobe.js';

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
  const ui = { who: 'raccoon', expression: 'happy' };

  root.innerHTML = `
    <div class="view friends">
      <h1 class="visually-hidden">${t('tab.friends')}</h1>
      <div class="stage"></div>
      <div class="panel"></div>
    </div>`;
  const stage = root.querySelector('.stage');
  const panel = root.querySelector('.panel');

  function drawStage() {
    const looks = store.get().characters;
    stage.innerHTML = ['raccoon', 'cat'].map((kind) => `
      <button class="stage__spot${ui.who === kind ? ' is-chosen' : ''}" data-who="${kind}" aria-pressed="${ui.who === kind}">
        ${renderCharacter(kind, looks[kind], { expression: ui.who === kind ? ui.expression : 'happy' })}
        <span class="stage__name">${esc(tr(CHARACTERS[kind].name))}</span>
        <span class="stage__role">${esc(tr(CHARACTERS[kind].role))}</span>
      </button>`).join('') + '<span class="stage__ground" aria-hidden="true"></span>';
  }

  function drawPanel() {
    const look = store.get().characters[ui.who];
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
      </section>`;
  }

  onClick(root, '[data-who]', (button) => {
    ui.who = button.dataset.who;
    ui.expression = 'happy';
    drawStage();
    drawPanel();
  });

  onClick(root, '[data-set]', (button) => {
    if (button.classList.contains('is-locked')) {
      return toast(t('friends.lockedToast', { n: num(Number(button.dataset.stars)) }));
    }
    store.update((save) => { save.characters[ui.who][button.dataset.set] = button.dataset.value; });
    drawStage();
    drawPanel();
  });

  onClick(root, '[data-expression]', (button) => {
    ui.expression = button.dataset.expression;
    drawStage();
    drawPanel();
  });

  drawStage();
  drawPanel();
}
