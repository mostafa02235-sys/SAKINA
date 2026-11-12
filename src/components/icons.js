// SAKINA's small icon set, drawn in the same outlined style as the world.

const INK = '#1d2a4d';
const base = `stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;

const SHAPES = {
  star: `<path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.5 1.2 6.4L12 17.1l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z" fill="#ffbf3c" ${base}/>`,
  starEmpty: `<path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.5 1.2 6.4L12 17.1l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z" fill="#e3e6f2" ${base}/>`,
  lock: `<rect x="5" y="10.5" width="14" height="10.5" rx="3" fill="#cfd5ea" ${base}/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" ${base}/><circle cx="12" cy="15.6" r="1.6" fill="${INK}"/>`,
  back: `<path d="M14.5 5l-7 7 7 7" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  check: `<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>`,
  flame: `<path d="M12 2.5c1 3.5 5.5 5.6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.2 1-3.6 2-4.8.4 1.6 1.2 2.4 2 2.6-.4-3 .2-6.3 1.5-8.800z" fill="#ff9a4d" ${base}/>`,
  play: `<path d="M8 5.5v13l11-6.500z" fill="#fff" ${base}/>`,
  world: `<path d="M3 11.5q1 5 4.5 5.500l1 3 1.8-2.800q1.5 3 1.9 3.8 1.5-1.5 2-3.900l1.5 1.7 1-2.400q3.3-.5 4.3-4.900z" fill="#8a6fb0" ${base}/><ellipse cx="12" cy="11" rx="9.5" ry="3.2" fill="#6fcf7c" ${base}/><path d="M12 10.500V5.5" ${base}/><path d="M12 5.500l4 1.5-4 1.500z" fill="#ff7a66" ${base}/>`,
  friends: `<ellipse cx="12" cy="15.5" rx="5" ry="4.2" fill="#f7ab5e" ${base}/><circle cx="5.5" cy="11" r="2.2" fill="#f7ab5e" ${base}/><circle cx="9.3" cy="6.8" r="2.2" fill="#f7ab5e" ${base}/><circle cx="14.7" cy="6.8" r="2.2" fill="#f7ab5e" ${base}/><circle cx="18.5" cy="11" r="2.2" fill="#f7ab5e" ${base}/>`,
  journey: `<path d="M6 21V3.5" ${base}/><path d="M6 4.500h11.500l-2.8 4 2.8 4H6z" fill="#2fbf8f" ${base}/>`,
};

export function icon(name, size = 24) {
  return `<svg class="icon icon--${name}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${SHAPES[name] ?? ''}</svg>`;
}

/** Three stars in a row, `filled` of them gold. */
export function starRow(filled, size = 20) {
  let out = '<span class="star-row">';
  for (let i = 0; i < 3; i += 1) out += icon(i < filled ? 'star' : 'starEmpty', size);
  return out + '</span>';
}
