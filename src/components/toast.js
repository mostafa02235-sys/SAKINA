// A short message that appears above the tab bar and leaves by itself.

import { esc } from '../core/dom.js';

let timer = null;

export function toast(message) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.getElementById('app').append(el);
  }
  el.innerHTML = esc(message);
  el.classList.remove('is-showing');
  void el.offsetWidth; // restart the animation when messages arrive back to back
  el.classList.add('is-showing');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('is-showing'), 2600);
}
