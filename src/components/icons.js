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
  flame: `<path d="M12 2.5c1 3.5 5.5 5.6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.2 1-3.6 2-4.8.4 1.6 1.2 2.4 2 2.6-.4-3 .2-6.3 1.5-8.8z" fill="#ff9a4d" ${base}/>`,
  play: `<path d="M8 5.5v13l11-6.5z" fill="#fff" ${base}/>`,
  world: `<path d="M3 11.5q1 5 4.5 5.5l1 3 1.8-2.8q1.5 3 1.9 3.8 1.5-1.5 2-3.9l1.5 1.7 1-2.4q3.3-.5 4.3-4.9z" fill="#8a6fb0" ${base}/><ellipse cx="12" cy="11" rx="9.5" ry="3.2" fill="#6fcf7c" ${base}/><path d="M12 10.5V5.5" ${base}/><path d="M12 5.5l4 1.5-4 1.5z" fill="#ff7a66" ${base}/>`,
  friends: `<ellipse cx="12" cy="15.5" rx="5" ry="4.2" fill="#f7ab5e" ${base}/><circle cx="5.5" cy="11" r="2.2" fill="#f7ab5e" ${base}/><circle cx="9.3" cy="6.8" r="2.2" fill="#f7ab5e" ${base}/><circle cx="14.7" cy="6.8" r="2.2" fill="#f7ab5e" ${base}/><circle cx="18.5" cy="11" r="2.2" fill="#f7ab5e" ${base}/>`,
  avatar: `<circle cx="12" cy="8" r="4.6" fill="#f1c9a5" ${base}/><path d="M3.5 21q0-7.5 8.5-7.5t8.5 7.5z" fill="#2fbf8f" ${base}/><path d="M7.6 7.4q.4-4.2 4.4-4.2t4.4 4.2q-2.2-1.8-4.4-1.8t-4.4 1.8z" fill="#3b2a20" ${base}/>`,
  retry: `<path d="M5 12a7 7 0 1 1 2.2 5.1" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M3 15.5l4 2 1.5-4.2" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  trophy: `<path d="M7 4h10v4.5a5 5 0 0 1-10 0z" fill="#ffbf3c" ${base}/><path d="M7 5.5H4.5q0 4 3 4.5M17 5.5h2.5q0 4-3 4.5M12 13.5V17M8 20.5h8l-1-3.5H9z" fill="#ffbf3c" ${base}/>`,
  sound: `<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="#8fd6cf" ${base}/><path d="M15.5 9q2 3 0 6M18 6.5q4 5.5 0 11" fill="none" ${base}/>`,
  journey: `<path d="M6 21V3.5" ${base}/><path d="M6 4.5h11.5l-2.8 4 2.8 4H6z" fill="#2fbf8f" ${base}/>`,
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
