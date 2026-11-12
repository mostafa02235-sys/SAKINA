// Language handling. Interface words live in data/strings.js;
// lesson content carries its own { ar, en } pairs and is read with tr().

import { store } from './store.js';
import { STRINGS } from '../data/strings.js';

export function lang() {
  const chosen = store.get().prefs.lang;
  if (chosen) return chosen;
  return (navigator.language || 'ar').toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

export function setLang(next) {
  store.update((s) => { s.prefs.lang = next; });
}

/** Interface string by key, with optional {placeholders}. */
export function t(key, vars = {}) {
  const entry = STRINGS[key];
  if (!entry) return key;
  return (entry[lang()] ?? entry.en).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
}

/** Pick the current language out of a { ar, en } content object. */
export function tr(pair) {
  if (pair == null) return '';
  if (typeof pair === 'string') return pair;
  return pair[lang()] ?? pair.en ?? '';
}

/** Numbers shown to the player, in the digits of their language. */
export function num(n) {
  return new Intl.NumberFormat(lang() === 'ar' ? 'ar-EG' : 'en').format(n);
}

export function applyDocumentLanguage() {
  const l = lang();
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
}
