// Everything the player can change about Mr. Raccoon and Mr. Qattout.
// `stars` is how many stars must be earned before an item unlocks (0 = from the start).

export const CHARACTERS = {
  raccoon: {
    name: { ar: 'مستر راكون', en: 'Mr. Raccoon' },
    role: { ar: 'الراكون المستكشف الفضولي', en: 'The curious explorer raccoon' },
    fur: ['#8f96b3', '#b08d6e', '#7fb5a8', '#c79bd1', '#e59a7a', '#6f88c9', '#a9b36a', '#d7d9e6'],
    marks: ['#39406a', '#5a3b2e', '#2c5a57', '#5d3a73', '#7a3b34', '#26386b'],
  },
  cat: {
    name: { ar: 'مستر قطّوط', en: 'Mr. Qattout' },
    role: { ar: 'القطّ الذكي المرح', en: 'The clever, cheerful cat' },
    fur: ['#f7ab5e', '#f2d9b0', '#b9bfd6', '#f5a3b5', '#8fd0c0', '#d9b38c', '#9fb4f0', '#ffffff'],
    marks: ['#d9722f', '#8a5a3c', '#5b6288', '#c85a7a', '#3f8f80', '#3a4a8a'],
  },
};

export const OUTFIT_COLORS = ['#ff7a66', '#4a6fd6', '#2fbf8f', '#ffbf3c', '#b57be0', '#f06fa5'];

export const OUTFITS = [
  { id: 'none', name: { ar: 'بدون', en: 'None' }, stars: 0 },
  { id: 'scarf', name: { ar: 'وشاح', en: 'Scarf' }, stars: 0 },
  { id: 'cape', name: { ar: 'عباءة المغامر', en: 'Explorer cape' }, stars: 6 },
];

export const ACCESSORIES = [
  { id: 'none', name: { ar: 'بدون', en: 'None' }, stars: 0 },
  { id: 'satchel', name: { ar: 'حقيبة الرحلة', en: 'Travel satchel' }, stars: 3 },
  { id: 'starpin', name: { ar: 'نجمة الإتقان', en: 'Star badge' }, stars: 9 },
  { id: 'lantern', name: { ar: 'فانوس', en: 'Lantern' }, stars: 12 },
];

export const EXPRESSION_NAMES = {
  happy: { ar: 'سعيد', en: 'Happy' },
  curious: { ar: 'فضولي', en: 'Curious' },
  cheer: { ar: 'متحمّس', en: 'Cheering' },
  calm: { ar: 'مطمئن', en: 'Calm' },
  oops: { ar: 'أوه!', en: 'Oops' },
  surprised: { ar: 'مندهش', en: 'Surprised' },
  sad: { ar: 'حزين', en: 'Sad' },
  angry: { ar: 'غاضب', en: 'Angry' },
};

/** Every item that needs stars, used to announce new unlocks. */
export const REWARDS = [...OUTFITS, ...ACCESSORIES].filter((item) => item.stars > 0)
  .sort((a, b) => a.stars - b.stars);
