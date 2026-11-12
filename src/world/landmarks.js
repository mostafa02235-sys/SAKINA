// One landmark per island. Each stands on the island top, base line near y = 100,
// centred on x = 120. Add a new function here to give a new island its own look.

const INK = '#1d2a4d';
const line = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
const thin = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

function palm(x, y, scale = 1) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <path d="M0 0 Q-4 -22 2 -44" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>
      <path d="M0 0 Q-4 -22 2 -44" fill="none" stroke="#b9783d" stroke-width="5" stroke-linecap="round"/>
      <path d="M2 -44 Q-18 -58 -30 -42 Q-14 -46 2 -44 Z" fill="#3fa863" ${thin}/>
      <path d="M2 -44 Q22 -58 34 -42 Q18 -46 2 -44 Z" fill="#3fa863" ${thin}/>
      <path d="M2 -44 Q-10 -68 -26 -62 Q-10 -58 2 -44 Z" fill="#6fcf7c" ${thin}/>
      <path d="M2 -44 Q14 -68 30 -62 Q14 -58 2 -44 Z" fill="#6fcf7c" ${thin}/>
    </g>`;
}

export const LANDMARKS = {
  // Qur'an Island: a small domed academy with a lit doorway.
  academy: () => `
    <rect x="50" y="64" width="18" height="34" rx="3" fill="#fff9ec" ${line}/>
    <path d="M48 64 Q59 46 70 64 Z" fill="#2f93b0" ${line}/>
    <rect x="172" y="64" width="18" height="34" rx="3" fill="#fff9ec" ${line}/>
    <path d="M170 64 Q181 46 192 64 Z" fill="#2f93b0" ${line}/>
    <rect x="78" y="58" width="84" height="42" rx="4" fill="#fff9ec" ${line}/>
    <path d="M86 58 Q120 6 154 58 Z" fill="#2f93b0" ${line}/>
    <path d="M100 44 Q120 18 140 44" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <path d="M120 26 V14" ${line}/>
    <circle cx="120" cy="12" r="5" fill="#ffbf3c" ${thin}/>
    <path d="M108 100 V82 Q120 66 132 82 V100 Z" fill="#ffe28a" ${line}/>
    <rect x="86" y="70" width="10" height="14" rx="5" fill="#8fd6cf" ${thin}/>
    <rect x="144" y="70" width="10" height="14" rx="5" fill="#8fd6cf" ${thin}/>`,

  // Sunnah Garden: palms, an arched gate and flowers.
  garden: () => `
    ${palm(70, 98, 1)}
    ${palm(176, 100, 0.8)}
    <path d="M100 100 V72 Q120 46 140 72 V100 H130 V76 Q120 64 110 76 V100 Z" fill="#fff9ec" ${line}/>
    <circle cx="120" cy="54" r="5" fill="#ffbf3c" ${thin}/>
    <circle cx="90" cy="102" r="5" fill="#ff7a66" ${thin}/>
    <circle cx="152" cy="104" r="5" fill="#ffbf3c" ${thin}/>
    <circle cx="48" cy="102" r="4" fill="#f06fa5" ${thin}/>
    <circle cx="198" cy="100" r="4" fill="#ff7a66" ${thin}/>`,

  // Oasis of the Prophets: a tent beside a palm and a pool.
  oasis: () => `
    ${palm(64, 96, 0.95)}
    <path d="M92 100 L130 50 L168 100 Z" fill="#fff9ec" ${line}/>
    <path d="M130 50 L120 100 H140 Z" fill="#c98a6b" ${line}/>
    <path d="M130 50 V40" ${line}/>
    <path d="M130 40 l12 4 l-12 4 Z" fill="#ff7a66" ${thin}/>
    <ellipse cx="186" cy="102" rx="18" ry="6" fill="#8fd6cf" ${thin}/>`,

  // Daily Life Springs: a fountain whose water runs off the island edge.
  spring: () => `
    <path d="M170 110 Q178 150 172 196" fill="none" stroke="#bfeeff" stroke-width="12" stroke-linecap="round" opacity=".85"/>
    <ellipse cx="120" cy="96" rx="44" ry="12" fill="#bfeeff" ${line}/>
    <path d="M104 96 V76 H136 V96" fill="#fff9ec" ${line}/>
    <ellipse cx="120" cy="76" rx="24" ry="7" fill="#bfeeff" ${line}/>
    <path d="M120 74 V58" ${line}/>
    <path d="M120 58 Q104 50 100 70 M120 58 Q136 50 140 70" fill="none" stroke="#bfeeff" stroke-width="5" stroke-linecap="round"/>
    <circle cx="120" cy="56" r="5" fill="#fff9ec" ${thin}/>`,

  // Lighthouse of Knowledge: a striped tower with a warm lamp.
  lighthouse: () => `
    <path d="M120 34 L40 14 V54 Z" fill="#ffe28a" opacity=".5"/>
    <path d="M120 34 L200 14 V54 Z" fill="#ffe28a" opacity=".5"/>
    <path d="M104 100 L110 46 H130 L136 100 Z" fill="#fff9ec" ${line}/>
    <path d="M107.5 70 H132.5 L134 84 H106 Z" fill="#8a74cf"/>
    <path d="M104 100 L110 46 H130 L136 100 Z" fill="none" ${line}/>
    <rect x="106" y="24" width="28" height="22" rx="4" fill="#ffe28a" ${line}/>
    <path d="M102 24 Q120 4 138 24 Z" fill="#8a74cf" ${line}/>
    <path d="M114 100 V90 Q120 82 126 90 V100 Z" fill="#70608f" ${thin}/>`,
};
