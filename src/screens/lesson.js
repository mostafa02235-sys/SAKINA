// The lesson player. It shows the steps made by systems/engine.js:
//   goal   — the lesson's title, objective and difficulty
//   talk   — Mr. Raccoon or Mr. Qattout frames the lesson (our own wording, labelled as such)
//   source — an ayah or hadith shown exactly, with its reference
//   quiz   — a multiple-choice or true/false question
// Questions answered wrongly come back once more at the end. Progress inside a
// lesson is saved after every step, so an unfinished lesson can be continued.

import { findLesson, loadIsland } from '../data/islands.js';
import { CHARACTERS } from '../data/wardrobe.js';
import { store } from '../core/store.js';
import { go } from '../core/router.js';
import { t, tr, num, lang } from '../core/i18n.js';
import { esc, onClick } from '../core/dom.js';
import { buzz } from '../core/feel.js';
import { renderCharacter } from '../characters/index.js';
import { renderAvatar } from '../avatar/draw.js';
import { icon, starRow } from '../components/icons.js';
import { toast } from '../components/toast.js';
import { buildSteps } from '../systems/engine.js';
import { lessonStatus, lessonStars, starsForScore, completeLesson, nextUp, level } from '../systems/progress.js';

const arabicDigits = new Intl.NumberFormat('ar-EG', { useGrouping: false });

function character(kind, expression) {
  return renderCharacter(kind, store.get().characters[kind], { expression });
}

/* ---------- Step bodies ---------- */

function renderGoal(step, reviewing) {
  const dots = [1, 2, 3].map((n) => `<i${n <= step.level ? ' class="on"' : ''}></i>`).join('');
  return `
    <div class="goal">
      <div class="goal__me">${renderAvatar(store.get().avatar)}</div>
      <article class="goal__card">
        <span class="tag tag--explain">${t(reviewing ? 'lesson.reviewing' : 'lesson.goal')}</span>
        <h1>${esc(tr(step.title))}</h1>
        <p>${esc(tr(step.objective))}</p>
        <p class="goal__level">${t('lesson.level', { n: num(step.level) })} <span class="level">${dots}</span></p>
      </article>
    </div>`;
}

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

function renderVerses(step) {
  return step.verses.map((verse) => {
    const meaning = verse.meaning?.[lang()];
    return `
      ${verse.basmala ? '<p class="scripture basmala" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>' : ''}
      <p class="scripture" lang="ar" dir="rtl">${esc(verse.t)} <span class="ayah-no">﴿${arabicDigits.format(verse.n)}﴾</span></p>
      ${meaning ? `
        <div class="source__meaning">
          <span class="source__label">${t('lesson.meaning')} · ${esc(tr(step.meaningCredit))}</span>
          <p>${esc(meaning)}</p>
          ${lang() === 'en' && verse.notes ? `<p class="source__notes">${esc(verse.notes)}</p>` : ''}
        </div>` : ''}`;
  }).join('');
}

function renderSource(step) {
  const isQuran = step.kind === 'quran';
  let body;
  if (step.verses) {
    body = renderVerses(step);
  } else {
    const lines = step.arabic.map((text, i) => (isQuran
      ? `${esc(text)} <span class="ayah-no">﴿${arabicDigits.format(step.firstAyah + i)}﴾</span>`
      : step.plain ? esc(text) : `«${esc(text)}»`)).join(' ');
    const meaning = step.meaning?.[lang()] ?? ''; // shown only when written for this language
    body = `
      <p class="scripture${step.plain ? ' scripture--long' : ''}" lang="ar" dir="rtl">${lines}</p>
      ${meaning ? `<div class="source__meaning"><span class="source__label">${t('lesson.meaning')}</span><p>${esc(meaning)}</p></div>` : ''}
      ${step.englishPending && lang() === 'en' ? `<p class="source__note">${t('lesson.englishPending')}</p>` : ''}`;
  }

  return `
    <article class="source source--${step.kind}">
      <header class="source__head">
        <span class="tag">${t(isQuran ? 'lesson.quran' : 'lesson.hadith')}</span>
      </header>
      ${step.intro ? `<p class="source__intro">${esc(tr(step.intro))}</p>` : ''}
      ${body}
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
    <div class="quiz${step.tf ? ' quiz--tf' : ''}">
      <h2 class="quiz__question">${esc(tr(step.question))}</h2>
      ${step.statement ? `<p class="quiz__statement">${esc(tr(step.statement))}</p>` : ''}
      ${step.prompt ? `<p class="quiz__prompt scripture" lang="ar" dir="rtl">${esc(step.prompt)}</p>` : ''}
      ${(step.pair ?? []).map((text, i) => `<p class="quiz__prompt scripture" lang="ar" dir="rtl">${step.pair.length > 1 ? `<span class="quiz__n">${num(i + 1)}</span>` : ''}${esc(text)}</p>`).join('')}
      ${step.note ? `<p class="quiz__note">${esc(tr(step.note))}</p>` : ''}
      <div class="quiz__options">${options}</div>
    </div>`;
}

/* ---------- Footers ---------- */

function renderFooter(step, state) {
  if (step.type !== 'quiz') {
    return `<div class="lesson__foot"><button class="btn btn--go btn--wide" data-action="next">${t(step.type === 'goal' ? 'lesson.begin' : 'lesson.continue')}</button></div>`;
  }
  if (state.phase !== 'feedback') {
    return `<div class="lesson__foot"><button class="btn btn--go btn--wide" data-action="check" ${state.selected == null ? 'disabled' : ''}>${t('lesson.check')}</button></div>`;
  }
  const right = state.selected === step.answer;
  return `
    <div class="lesson__foot feedback feedback--${right ? 'right' : 'wrong'}" role="status">
      <div class="feedback__row">
        <div class="feedback__friend">${character(right ? 'raccoon' : 'cat', right ? 'cheer' : state.queue[state.position].retry ? 'sad' : 'oops')}</div>
        <div>
          <p class="feedback__title">${t(right ? 'lesson.right' : 'lesson.wrong')}</p>
          <p class="feedback__why">${esc(tr(step.why))}</p>
        </div>
      </div>
      <button class="btn ${right ? 'btn--go' : 'btn--oops'} btn--wide" data-action="next">${t('lesson.continue')}</button>
    </div>`;
}

/* ---------- Finish ---------- */

function renderFinish(found, lesson, result) {
  const next = nextUp();
  const lv = level();
  const name = store.get().profile.name;
  const news = [
    ...(result.levelUp ? [t('finish.levelUp', { n: num(result.levelUp) })] : []),
    ...result.newBadges.map((b) => t('finish.newBadge', { name: tr(b.name) })),
    ...result.newItems.map((item) => t('finish.newItem', { name: tr(item.name) })),
    ...(result.unlockedIsland ? [t('finish.newIsland', { name: tr(result.unlockedIsland.name) })] : []),
    ...(result.unlockedRegion ? [t('finish.newRegion', { name: tr(result.unlockedRegion.name) })] : []),
  ];
  // A friend says something that fits what just happened.
  const line = result.islandFinished ? 'finish.sayIsland' : result.stars === 3 ? 'finish.sayPerfect' : 'finish.sayGood';
  const speaker = result.islandFinished ? 'raccoon' : 'cat';
  const hasAvatarItem = result.newItems.some((item) => item.level);

  return `
    <div class="view finish">
      <div class="finish__stars">${starRow(result.stars, 58)}</div>
      <h1 class="finish__title">${t(result.islandFinished ? 'finish.islandTitle' : 'finish.title')}</h1>
      <p class="finish__lesson">${esc(tr(lesson.title))}</p>
      <div class="finish__friends">
        ${character('raccoon', 'cheer')}
        <div class="finish__me">${renderAvatar(store.get().avatar, { mood: 'grin' })}</div>
        ${character('cat', news.length ? 'surprised' : 'cheer')}
      </div>
      <p class="finish__say"><b>${t(`name.${speaker}`)}:</b> ${t(line, { name: name || t('profile.friend') })}</p>
      <div class="finish__xp">
        <span>${icon('star', 22)} ${t('finish.xp', { n: num(result.xp) })}</span>
        <span class="bar"><span style="width:${lv.percent}%"></span></span>
        <span>${t('journey.level', { n: num(lv.number) })} · ${t('finish.toNext', { n: num(lv.toNext) })}</span>
      </div>
      ${news.length ? `<ul class="finish__unlocks">${news.map((text) => `<li>${esc(text)}</li>`).join('')}</ul>` : ''}
      <div class="finish__actions">
        ${next ? `<button class="btn btn--go btn--wide" data-go="lesson/${next.lessonId}">${t('finish.next')}</button>` : ''}
        ${result.newItems.length ? `<button class="btn btn--star btn--wide" data-go="${hasAvatarItem ? 'avatar' : 'friends'}">${t('finish.wardrobe')}</button>` : ''}
        <button class="btn btn--wide" data-go="island/${found.island.id}">${t('finish.back', { name: tr(found.island.name) })}</button>
      </div>
    </div>`;
}

/* ---------- The player ---------- */

export function mount(root, [lessonId]) {
  const found = findLesson(lessonId);
  if (!found || lessonStatus(found.island, found.index) === 'locked') return go('world');
  const reviewing = lessonStars(lessonId) > 0;
  let alive = true;

  root.innerHTML = `<div class="view lesson"><p class="loading">${t('app.loading')}</p></div>`;

  loadIsland(found.island.id).then(({ lessons, pool }) => {
    if (!alive) return;
    const lesson = lessons[found.index];
    const steps = buildSteps(lesson, pool);
    const questionCount = steps.filter((step) => step.type === 'quiz').length;

    // Continue an unfinished lesson where the player stopped.
    const saved = store.get().inProgress;
    const resume = saved && saved.lessonId === lessonId && saved.position > 0 && saved.position < steps.length + saved.retries.length ? saved : null;
    const state = {
      queue: [...steps.map((step) => ({ step, retry: false })), ...(resume?.retries ?? []).filter((i) => steps[i]).map((i) => ({ step: steps[i], retry: true }))],
      position: resume?.position ?? 0,
      phase: 'step', // 'step' | 'feedback'
      selected: null,
      firstTryCorrect: resume?.right ?? 0,
    };
    if (resume) toast(t('lesson.resumed'));

    const remember = () => store.update((s) => {
      s.inProgress = {
        lessonId,
        position: state.position,
        right: state.firstTryCorrect,
        retries: state.queue.filter((entry) => entry.retry).map((entry) => steps.indexOf(entry.step)),
      };
      s.partyAt = found.island.id;
    });

    function draw() {
      const { step } = state.queue[state.position];
      const body = step.type === 'goal' ? renderGoal(step, reviewing)
        : step.type === 'talk' ? renderTalk(step)
          : step.type === 'source' ? renderSource(step)
            : renderQuiz(step, state);
      const percent = Math.round((state.position / state.queue.length) * 100);

      root.innerHTML = `
        <div class="view lesson lesson--${step.type}">
          <div class="lesson__top">
            <a class="btn btn--round" href="#/island/${found.island.id}" aria-label="${t('lesson.leave')}">${icon('close')}</a>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"
                 aria-label="${esc(tr(lesson.title))}">
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
      if (state.position < state.queue.length) {
        remember();
        return draw();
      }
      const result = completeLesson(lessonId, starsForScore(state.firstTryCorrect, questionCount));
      root.innerHTML = renderFinish(found, lesson, result);
      root.scrollTop = 0;
      buzz('reward');
    }

    onClick(root, '[data-option]', (button) => {
      if (state.phase === 'feedback') return;
      state.selected = Number(button.dataset.option);
      buzz('tap');
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
      buzz(right ? 'right' : 'wrong');
      state.phase = 'feedback';
      draw();
      root.querySelector('.feedback [data-action="next"]')?.focus({ preventScroll: true });
    });

    onClick(root, '[data-action="next"]', advance);
    onClick(root, '[data-go]', (button) => go(button.dataset.go));

    draw();
  }).catch((error) => {
    console.error(error);
    if (!alive) return;
    root.innerHTML = `
      <div class="view oops-screen">
        <h1>${t('error.title')}</h1>
        <p>${t('error.body')}</p>
        <a class="btn btn--go" href="#/island/${found.island.id}">${t('finish.back', { name: tr(found.island.name) })}</a>
      </div>`;
  });

  return () => { alive = false; };
}
