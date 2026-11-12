// Small helpers shared by every screen.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Make any text safe to place inside HTML. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

/** Listen for clicks on any element matching `selector` inside `root`. */
export function onClick(root, selector, handler) {
  root.addEventListener('click', (event) => {
    const target = event.target.closest(selector);
    if (target && root.contains(target)) handler(target, event);
  });
}

/** Mix a hex colour toward white (amount > 0) or toward ink-dark (amount < 0). */
export function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const target = amount >= 0 ? 255 : 20;
  const k = Math.abs(amount);
  const mix = (c) => Math.round(c + (target - c) * k);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

let counter = 0;
/** Unique id for SVG clip paths and gradients, so several drawings can share a page. */
export function uid(prefix = 'id') {
  counter += 1;
  return `${prefix}-${counter}`;
}
