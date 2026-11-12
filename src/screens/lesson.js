// The lesson player. A lesson is a list of steps (see data/lessons/):
//   talk   — Zad or Lulu explains something (our own educational wording)
//   source — an ayah or hadith shown exactly, with its reference
//   quiz   — a multiple-choice question
// Questions answered wrongly come back once more at the end.

import { findLesson } from '../data/islands.js';
import { CHARACTERS } from '../data/wardrobe.js';
import { store } from '../core/store.js';
import { go } from '../core/router.js';
import { t, tr, num, lang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { renderCharacter } from '../characters/index.js';
import { icon, starRow } from '../components/icons.js';
import { lessonStatus, starsForScore, completeLesson, nextUp } from '../systems/progress.js';

const arabicDigits = new Intl.NumberFormat('ar-EG', { useGrouping: false });

function character(kind, expression) {
  return renderCharacter(kind, store.get().characters[kind], { expression });
}

/* ---------- Step bodies ---------- */

function renderTalk(step) {
  const name = tr(CHARACTERS[step.who].name);
  return `
    <div class="talk talk--${step.who}">
      <div class="talk__speaker">${character(step.who, step.mood)}</div>
      <div class="talk__bubble">
        <span class="tag tag--explain">${t('lesson.explains', { name })}</span>
        <p>${esc(tr(step.text))}</p>
      </div>
    </div>`;
}

function renderSource(step) {
  const isQuran = step.kind === 'quran';
  const lines = step.arabic.map((line, i) => (isQuran
    ? `${esc(line)} <span class="ayah-no">﴿${arabicDigits.format(step.firstAyah + i)}﴾</span>`
    : `«${esc(line)}»`)).join(' ');
  const meaning = step.meaning?.[lang()] ?? ''; // shown only when written for this language

  return `
    <article class="source source--${step.kind}">
      <header class="source__head">
        <span class="tag">${t(isQuran ? 'lesson.quran' : 'lesson.hadith')}</span>
      </header>
      ${step.intro ? `<p class="source__intro">${esc(tr(step.intro))}</p>` : ''}
      <p class="scripture" lang="ar" dir="rtl">${lines}</p>
      ${meaning ? `
        <div class="source__meaning">
          <span class="source__label">${t('lesson.meaning')}</span>
          <p>${esc(meaning)}</p>
        </div>` : ''}
      ${step.note ? `<p class="source__note">${esc(tr(step.note))}</p>` : ''}
      <footer class="source__ref">${esc(tr(step.reference))}${step.reading ? ` · ${esc(tr(step.reading))}` : ''}</footer>
    </article>`;
}

function renderQuiz(step, state) {
  const answered = state.phase === 'feedback';
  const options = step.options.map((option, i) => {
    let cls = 'option';
    if (step.scripture) cls += ' option--scripture';
    if (state.selected === i) cls += ' is-selected';
    if (answered && i === step.answer) cls += ' is-correct';
    if (answered && state.selected === i && i !== step.answer) cls += ' is-wrong';
    return `
      <button class="${cls}" data-option="${i}" ${answered ? 'disabled' : ''}
              aria-pressed="${state.selected === i}" ${step.scripture ? 'lang="ar" dir="rtl"' : ''}>
        ${esc(tr(option))}
      </button>`;
  }).join('');

  return `
    <div class="quiz">
      <h2 class="quiz__question">${esc(tr(step.question))}</h2>
      ${step.prompt ? `<p class="quiz__prompt scripture" lang="ar" dir="rtl">${esc(step.prompt)}</p>` : ''}
      <div class="quiz__options">${options}</div>
    </div>`;
}

/* ---------- Footers ---------- */

function renderFooter(step, state) {
  if (step.type !== 'quiz') {
    return `<div class="lesson__foot"><button class="btn btn--go btn--wide" data-action="next">${t('lesson.continue')}</button></div>`;
  }
  if (state.phase !== 'feedback') {
    return `<div class="lesson__foot"><button class="btn btn--go btn--wide" data-action="check" ${state.selected == null ? 'disabled' : ''}>${t('lesson.check')}</button></div>`;
  }
  const right = state.selected === step.answer;
  return `
    <div class="lesson__foot feedback feedback--${right ? 'right' : 'wrong'}" role="status">
      <div class="feedback__row">
        <div class="feedback__friend">${character(right ? 'raccoon' : 'cat', right ? 'cheer' : 'oops')}</div>
        <div>
          <p class="feedback__title">${t(right ? 'lesson.right' : 'lesson.wrong')}</p>
          <p class="feedback__why">${esc(tr(step.why))}</p>
        </div>
      </div>
      <button class="btn ${right ? 'btn--go' : 'btn--oops'} btn--wide" data-action="next">${t('lesson.continue')}</button>
    </div>`;
}

/* ---------- Finish ---------- */

function renderFinish(found, result) {
  const next = nextUp();
  const unlocks = [
    ...result.newItems.map((item) => t('finish.newItem', { name: tr(item.name) })),
    ...(result.unlockedIsland ? [t('finish.newIsland', { name: tr(result.unlockedIsland.name) })] : []),
  ];

  return `
    <div class="view finish">
      <div class="finish__stars">${starRow(result.stars, 58)}</div>
      <h1 class="finish__title">${t('finish.title')}</h1>
      <p class="finish__lesson">${esc(tr(found.lesson.title))}</p>
      <div class="finish__friends">
        ${character('raccoon', 'cheer')}
        ${character('cat', 'cheer')}
      </div>
      ${result.gained > 0 ? `<p class="finish__gain">${icon('star', 22)} ${t('finish.gained', { n: num(result.gained) })}</p>` : ''}
      ${unlocks.length ? `<ul class="finish__unlocks">${unlocks.map((line) => `<li>${esc(line)}</li>`).join('')}</ul>` : ''}
      <div class="finish__actions">
        ${next ? `<button class="btn btn--go btn--wide" data-go="lesson/${next.lesson.id}">${t('finish.next')}</button>` : ''}
        ${result.newItems.length ? `<button class="btn btn--star btn--wide" data-go="friends">${t('finish.wardrobe')}</button>` : ''}
        <button class="btn btn--wide" data-go="island/${found.island.id}">${t('finish.back', { name: tr(found.island.name) })}</button>
      </div>
    </div>`;
}

/* ---------- The player ---------- */

export function mount(root, [lessonId]) {
  const found = findLesson(lessonId);
  if (!found || lessonStatus(found.island, found.index) === 'locked') return go('world');

  const steps = found.lesson.steps;
  const questionCount = steps.filter((step) => step.type === 'quiz').length;
  const state = {
    queue: steps.map((step) => ({ step, retry: false })),
    position: 0,
    phase: 'step', // 'step' | 'feedback'
    selected: null,
    firstTryCorrect: 0,
  };

  function draw() {
    const { step } = state.queue[state.position];
    const body = step.type === 'talk' ? renderTalk(step)
      : step.type === 'source' ? renderSource(step)
        : renderQuiz(step, state);
    const percent = Math.round((state.position / state.queue.length) * 100);

    root.innerHTML = `
      <div class="view lesson lesson--${step.type}">
        <div class="lesson__top">
          <a class="btn btn--round" href="#/island/${found.island.id}" aria-label="${t('lesson.leave')}">${icon('close')}</a>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"
               aria-label="${esc(tr(found.lesson.title))}">
            <span class="progress__fill" style="width:${Math.max(percent, 6)}%"></span>
          </div>
        </div>
        <div class="lesson__body">${body}</div>
        ${renderFooter(step, state)}
      </div>`;
    root.scrollTop = 0;
  }

  function advance() {
    state.position += 1;
    state.phase = 'step';
    state.selected = null;
    if (state.position < state.queue.length) return draw();
    const result = completeLesson(lessonId, starsForScore(state.firstTryCorrect, questionCount));
    root.innerHTML = renderFinish(found, result);
    root.scrollTop = 0;
  }

  onClick(root, '[data-option]', (button) => {
    if (state.phase === 'feedback') return;
    state.selected = Number(button.dataset.option);
    root.querySelectorAll('[data-option]').forEach((el) => {
      const on = el === button;
      el.classList.toggle('is-selected', on);
      el.setAttribute('aria-pressed', on);
    });
    root.querySelector('[data-action="check"]').disabled = false;
  });

  onClick(root, '[data-action="check"]', () => {
    const entry = state.queue[state.position];
    const right = state.selected === entry.step.answer;
    if (right && !entry.retry) state.firstTryCorrect += 1;
    if (!right && !entry.retry) state.queue.push({ step: entry.step, retry: true });
    state.phase = 'feedback';
    draw();
    root.querySelector('.feedback [data-action="next"]')?.focus({ preventScroll: true });
  });

  onClick(root, '[data-action="next"]', advance);
  onClick(root, '[data-go]', (button) => go(button.dataset.go));

  draw();
}
