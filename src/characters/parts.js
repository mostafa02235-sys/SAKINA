// Drawing pieces shared by both characters: faces, outfits and accessories.
// Everything is drawn on a 200 x 230 canvas with the feet near y = 212.

export const INK = '#1d2a4d';
export const LINE = 5; // outline thickness, the same on every shape

/** A limb or tail: one thick rounded line with an ink outline around it. */
export function tube(d, color, width, extra = '') {
  return `
    <path d="${d}" fill="none" stroke="${INK}" stroke-width="${width + LINE * 2}" stroke-linecap="round" ${extra}/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
}

const stroke = `stroke="${INK}" stroke-width="${LINE}" stroke-linejoin="round" stroke-linecap="round"`;
export const outlined = stroke;

/* ---------- Faces ---------- */

// Each expression describes brows, eyes and mouth. Coordinates are relative
// to a face whose eyes sit at (-eyeGap, 0) and (+eyeGap, 0).
export const EXPRESSIONS = ['happy', 'curious', 'cheer', 'calm', 'oops'];

function brow(x, tilt, lift) {
  const dx = 11;
  const y = -22 - lift;
  return `<path d="M${x - dx} ${y + tilt} Q${x} ${y - 3} ${x + dx} ${y - tilt}" fill="none" ${stroke}/>`;
}

function closedEye(x, smiling) {
  return smiling
    ? `<path d="M${x - 11} 3 Q${x} -11 ${x + 11} 3" fill="none" ${stroke}/>`
    : `<path d="M${x - 11} -2 Q${x} 9 ${x + 11} -2" fill="none" ${stroke}/>`;
}

/**
 * @param {object} face  { cx, cy, eyeGap, mouthY, eye: (x, lookX, lookY) => svg, mouthStyle }
 * @param {string} expression
 */
export function drawFace(face, expression) {
  const { cx, cy, eyeGap, mouthY, eye } = face;
  const L = -eyeGap;
  const R = eyeGap;
  let brows = '';
  let eyes = '';
  let mouth = '';
  let extra = '';
  const my = mouthY - cy;

  const smile = (w, depth) => `<path d="M${-w} ${my} Q0 ${my + depth} ${w} ${my}" fill="none" ${stroke}/>`;

  switch (expression) {
    case 'curious':
      brows = brow(L, 2, 0) + brow(R, -3, 6);
      eyes = eye(L, 3, -3) + eye(R, 3, -3);
      mouth = `<ellipse cx="2" cy="${my + 4}" rx="5" ry="6" fill="${INK}"/>`;
      break;
    case 'cheer':
      brows = brow(L, 0, 4) + brow(R, 0, 4);
      eyes = closedEye(L, true) + closedEye(R, true);
      mouth = `
        <path d="M-13 ${my - 2} Q0 ${my + 24} 13 ${my - 2} Z" fill="#7a2f45" ${stroke}/>
        <path d="M-6 ${my + 8} Q0 ${my + 3} 6 ${my + 8} Q0 ${my + 16} -6 ${my + 8} Z" fill="#ff8fa3"/>`;
      break;
    case 'calm':
      eyes = closedEye(L, false) + closedEye(R, false);
      mouth = smile(8, 7);
      break;
    case 'oops':
      brows = brow(L, -5, 0) + brow(R, 5, 0);
      eyes = eye(L, 0, 4) + eye(R, 0, 4);
      mouth = `<path d="M-11 ${my + 4} Q-5 ${my - 3} 0 ${my + 4} Q5 ${my + 11} 11 ${my + 4}" fill="none" ${stroke}/>`;
      extra = `<path d="M${R + 26} -30 q-8 14 0 17 q8 -3 0 -17 Z" fill="#9fdcff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
      break;
    case 'happy':
    default:
      eyes = eye(L, 0, 0) + eye(R, 0, 0);
      mouth = smile(11, 11);
  }

  const blinks = expression === 'cheer' || expression === 'calm' ? '' : ' ch-blink';
  return `
    <g transform="translate(${cx} ${cy})">
      ${brows}
      <g class="ch-eyes${blinks}">${eyes}</g>
      ${mouth}
      ${extra}
    </g>`;
}

/* ---------- Outfits (worn around the neck and shoulders) ---------- */

export const OUTFIT_BACK = {
  cape: (color) => `
    <path d="M66 142 L36 204 Q100 224 164 204 L134 142 Z" fill="${color}" ${stroke}/>`,
};

export const OUTFIT_FRONT = {
  scarf: (color) => `
    <path d="M118 152 L134 184 L120 178 L112 190 L104 156 Z" fill="${color}" ${stroke}/>
    <path d="M62 138 Q100 158 138 138 L140 152 Q100 174 60 152 Z" fill="${color}" ${stroke}/>`,
  cape: (color) => `
    <path d="M64 140 Q100 158 136 140 L136 150 Q100 168 64 150 Z" fill="${color}" ${stroke}/>
    <circle cx="100" cy="158" r="7" fill="#ffbf3c" stroke="${INK}" stroke-width="4"/>`,
};

/* ---------- Accessories ---------- */

function starPath(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.48;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`);
  }
  return points.join(' ');
}

export const ACCESSORY = {
  satchel: () => `
    <path d="M74 150 L128 192" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>
    <path d="M74 150 L128 192" fill="none" stroke="#b9783d" stroke-width="5" stroke-linecap="round"/>
    <rect x="112" y="182" width="30" height="25" rx="8" fill="#d99a55" ${stroke}/>
    <path d="M112 190 Q127 202 142 190" fill="none" ${stroke}/>
    <circle cx="127" cy="197" r="3" fill="${INK}"/>`,
  starpin: () => `
    <polygon points="${starPath(80, 168, 12)}" fill="#ffbf3c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
  lantern: () => `
    <path d="M150 172 q8 -12 16 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle class="ch-glow" cx="158" cy="192" r="24" fill="#ffe28a" opacity=".45"/>
    <path d="M148 178 h20 l-3 -6 h-14 Z" fill="#b9783d" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="147" y="178" width="22" height="26" rx="5" fill="#fff3b8" stroke="${INK}" stroke-width="4"/>
    <path d="M158 178 v26 M147 191 h22" stroke="${INK}" stroke-width="3"/>
    <rect x="145" y="204" width="26" height="6" rx="3" fill="#b9783d" stroke="${INK}" stroke-width="4"/>`,
};
