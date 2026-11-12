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

  // An open Qur'an on its stand, glowing.
  bookstand: () => `
    <circle cx="120" cy="62" r="34" fill="#ffe28a" opacity=".45"/>
    <path d="M100 100 L136 70 M140 100 L104 70" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M100 100 L136 70 M140 100 L104 70" fill="none" stroke="#b9783d" stroke-width="4" stroke-linecap="round"/>
    <path d="M120 74 Q102 60 82 66 V46 Q102 40 120 54 Q138 40 158 46 V66 Q138 60 120 74 Z" fill="#fff9ec" ${line}/>
    <path d="M120 54 V74" ${thin}/>
    <path d="M90 54 Q102 50 112 58 M128 58 Q138 50 150 54" fill="none" stroke="#1f8a70" stroke-width="3" stroke-linecap="round"/>`,

  // A library with tall arched shelves.
  library: () => `
    <rect x="72" y="44" width="96" height="56" rx="5" fill="#fff9ec" ${line}/>
    <path d="M66 46 L120 20 L174 46 Z" fill="#8a74cf" ${line}/>
    <path d="M84 100 V68 Q94 56 104 68 V100 Z M110 100 V68 Q120 56 130 68 V100 Z M136 100 V68 Q146 56 156 68 V100 Z" fill="#8fd6cf" ${thin}/>
    <path d="M88 82 H100 M114 82 H126 M140 82 H152" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="120" cy="36" r="5" fill="#ffbf3c" ${thin}/>`,

  // A tall minaret beside a small prayer hall.
  minaret: () => `
    <rect x="112" y="66" width="62" height="34" rx="4" fill="#fff9ec" ${line}/>
    <path d="M118 66 Q143 34 168 66 Z" fill="#2f93b0" ${line}/>
    <path d="M136 100 V84 Q143 76 150 84 V100 Z" fill="#ffe28a" ${thin}/>
    <rect x="70" y="30" width="22" height="70" rx="4" fill="#fff9ec" ${line}/>
    <rect x="64" y="46" width="34" height="8" rx="3" fill="#2f93b0" ${thin}/>
    <path d="M68 30 Q81 8 94 30 Z" fill="#2f93b0" ${line}/>
    <path d="M81 12 V4" ${line}/><circle cx="81" cy="3" r="4" fill="#ffbf3c" ${thin}/>
    <rect x="77" y="64" width="8" height="12" rx="4" fill="#8fd6cf" ${thin}/>`,

  // A big standing lantern.
  lantern: () => `
    <circle cx="120" cy="62" r="40" fill="#ffe28a" opacity=".4"/>
    <path d="M106 34 Q120 14 134 34" fill="none" ${line}/>
    <path d="M100 40 H140 L134 32 H106 Z" fill="#b9783d" ${line}/>
    <rect x="100" y="40" width="40" height="50" rx="8" fill="#fff3b8" ${line}/>
    <path d="M120 40 V90 M100 64 H140" ${thin}/>
    <rect x="96" y="90" width="48" height="10" rx="4" fill="#b9783d" ${line}/>
    ${palm(186, 100, 0.6)}`,

  // A stone bridge over a stream.
  bridge: () => `
    <path d="M58 104 Q120 86 182 104" fill="none" stroke="#bfeeff" stroke-width="14" stroke-linecap="round"/>
    <path d="M70 100 Q120 44 170 100 H152 Q120 68 88 100 Z" fill="#fff9ec" ${line}/>
    <path d="M84 84 V72 M102 70 V58 M120 66 V54 M138 70 V58 M156 84 V72" ${thin}/>
    <path d="M80 74 Q120 38 160 74" fill="none" ${line}/>
    ${palm(46, 100, 0.6)}`,

  // A wooden boat resting on the shore.
  boat: () => `
    <path d="M64 78 H176 Q170 102 150 102 H90 Q70 102 64 78 Z" fill="#b9783d" ${line}/>
    <path d="M72 88 H168" ${thin}/>
    <path d="M120 78 V28" ${line}/>
    <path d="M124 32 Q160 50 124 72 Z" fill="#fff9ec" ${line}/>
    <path d="M116 38 Q92 54 116 72 Z" fill="#ffbf3c" ${line}/>`,

  // A camp of tents.
  tent: () => `
    <path d="M56 100 L84 62 L112 100 Z" fill="#ff7a66" ${line}/>
    <path d="M84 62 L78 100 H90 Z" fill="#fff9ec" ${thin}/>
    <path d="M104 100 L140 48 L176 100 Z" fill="#fff9ec" ${line}/>
    <path d="M140 48 L130 100 H150 Z" fill="#c98a6b" ${line}/>
    <path d="M140 48 V36" ${line}/><path d="M140 36 l12 4 l-12 4 Z" fill="#2fbf8f" ${thin}/>
    <circle cx="96" cy="102" r="5" fill="#ffbf3c" ${thin}/>`,

  // A stone well with a little roof.
  well: () => `
    <path d="M92 60 V84 M148 60 V84" ${line}/>
    <path d="M82 62 L120 38 L158 62 Z" fill="#c0785f" ${line}/>
    <path d="M120 62 V78" ${thin}/><rect x="113" y="76" width="14" height="12" rx="3" fill="#b9783d" ${thin}/>
    <path d="M90 84 H150 V100 Q120 108 90 100 Z" fill="#cfd5ea" ${line}/>
    <path d="M90 92 H150 M106 84 V102 M134 84 V102" ${thin}/>
    ${palm(182, 100, 0.65)}`,

  // Rolling dunes under a low sun.
  dunes: () => `
    <circle cx="150" cy="52" r="20" fill="#ffbf3c" ${line}/>
    <path d="M50 100 Q84 54 118 100 Z" fill="#f4d98c" ${line}/>
    <path d="M96 100 Q140 60 186 100 Z" fill="#eec06a" ${line}/>
    <path d="M70 86 Q84 74 98 86" fill="none" ${thin}/>
    ${palm(60, 100, 0.55)}`,

  // Fruit trees in rows.
  orchard: () => `
    ${[70, 120, 170].map((x, i) => `
      <path d="M${x} 100 V${70 - i * 3}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
      <path d="M${x} 100 V${70 - i * 3}" fill="none" stroke="#b9783d" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${x}" cy="${56 - i * 3}" r="22" fill="${i === 1 ? '#3fa863' : '#6fcf7c'}" ${line}/>
      <circle cx="${x - 8}" cy="${52 - i * 3}" r="4" fill="#ff7a66" ${thin}/><circle cx="${x + 8}" cy="${60 - i * 3}" r="4" fill="#ffbf3c" ${thin}/>`).join('')}`,

  // Market stalls with striped awnings.
  market: () => `
    <rect x="62" y="70" width="48" height="30" rx="3" fill="#fff9ec" ${line}/>
    <path d="M56 70 L64 50 H108 L116 70 Z" fill="#ff7a66" ${line}/>
    <path d="M76 50 L72 70 M96 50 L100 70" stroke="#fff9ec" stroke-width="6"/>
    <rect x="128" y="64" width="52" height="36" rx="3" fill="#fff9ec" ${line}/>
    <path d="M122 64 L130 42 H178 L186 64 Z" fill="#2fbf8f" ${line}/>
    <path d="M144 42 L140 64 M164 42 L168 64" stroke="#fff9ec" stroke-width="6"/>
    <circle cx="76" cy="86" r="5" fill="#ffbf3c" ${thin}/><circle cx="92" cy="86" r="5" fill="#ff7a66" ${thin}/>
    <circle cx="146" cy="84" r="5" fill="#b57be0" ${thin}/><circle cx="162" cy="84" r="5" fill="#ffbf3c" ${thin}/>`,

  // A dome for watching the stars.
  observatory: () => `
    <path d="M150 30 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z M70 26 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe28a" ${thin}/>
    <rect x="84" y="70" width="72" height="30" rx="4" fill="#fff9ec" ${line}/>
    <path d="M86 70 Q120 22 154 70 Z" fill="#8a74cf" ${line}/>
    <path d="M118 40 L146 22 L152 32 L126 50 Z" fill="#cfd5ea" ${line}/>
    <path d="M112 100 V86 Q120 78 128 86 V100 Z" fill="#ffe28a" ${thin}/>`,

  // A mountain with a snowy top.
  mountain: () => `
    <path d="M52 100 L104 30 L140 78 L152 62 L188 100 Z" fill="#b9a6a0" ${line}/>
    <path d="M104 30 L88 52 L98 58 L106 50 L116 58 L122 54 Z" fill="#fff9ec" ${line}/>
    <path d="M96 100 Q104 84 116 100 Z" fill="${INK}" opacity=".5"/>
    ${palm(64, 102, 0.5)}`,
};
