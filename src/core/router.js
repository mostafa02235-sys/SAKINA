// A tiny hash router: "#/island/quran" -> { name: 'island', params: ['quran'] }.

let onChange = () => {};

export function parseRoute() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return { name: parts[0] || 'world', params: parts.slice(1).map(decodeURIComponent) };
}

export function go(path) {
  const target = '#/' + path.replace(/^\/+/, '');
  if (location.hash === target) onChange(parseRoute());
  else location.hash = target;
}

export function startRouter(handler) {
  onChange = handler;
  window.addEventListener('hashchange', () => onChange(parseRoute()));
  onChange(parseRoute());
}

/** Draw the current screen again (after a language change, for example). */
export function refresh() {
  onChange(parseRoute());
}
