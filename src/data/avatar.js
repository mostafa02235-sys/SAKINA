// Everything the player can choose for "My Avatar".
// `level` is the player level needed to unlock an option (none = from the start).
// To add an option: list it here, then draw it in src/avatar/draw.js.

const opt = (id, ar, en, level) => ({ id, name: { ar, en }, ...(level ? { level } : {}) });

export const AVATAR = {
  face: [opt('round', 'دائري', 'Round'), opt('oval', 'بيضاوي', 'Oval'), opt('square', 'مربّع', 'Square'), opt('heart', 'قلب', 'Heart')],
  skin: ['#fbe0c8', '#f1c9a5', '#e0ac86', '#c98d62', '#a56c43', '#7b4b2a', '#573218'],
  hair: [
    opt('short', 'قصير', 'Short'), opt('spiky', 'شائك', 'Spiky'), opt('curly', 'مجعّد', 'Curly'), opt('side', 'جانبي', 'Side sweep'),
    opt('long', 'طويل', 'Long'), opt('bun', 'كعكة', 'Bun'), opt('pony', 'ذيل حصان', 'Ponytail'), opt('none', 'بدون', 'None'),
  ],
  hairColor: ['#3b2a20', '#1d1a22', '#6b4226', '#a8642f', '#d9a441', '#b5432f', '#8a8f9c', '#f1ead8'],
  eyes: [opt('round', 'دائرية', 'Round'), opt('almond', 'لوزية', 'Almond'), opt('sparkle', 'لامعة', 'Sparkly'), opt('sleepy', 'هادئة', 'Sleepy')],
  mood: [opt('happy', 'سعيد', 'Happy'), opt('grin', 'ضاحك', 'Laughing'), opt('calm', 'مطمئن', 'Calm'), opt('surprised', 'مندهش', 'Surprised'), opt('sad', 'حزين', 'Sad')],
  head: [
    opt('none', 'بدون', 'None'), opt('cap', 'قبّعة', 'Cap'), opt('beanie', 'قبّعة صوف', 'Beanie'), opt('kufi', 'طاقية', 'Kufi'),
    opt('hijab', 'حجاب', 'Hijab'), opt('ghutra', 'غترة وعقال', 'Ghutra'), opt('explorer', 'قبّعة المستكشف', 'Explorer hat', 3),
  ],
  top: [
    opt('tshirt', 'قميص قصير', 'T-shirt'), opt('shirt', 'قميص', 'Shirt'), opt('jacket', 'سترة', 'Jacket'), opt('hoodie', 'سترة بقلنسوة', 'Hoodie'),
    opt('thobe', 'ثوب', 'Thobe'), opt('abaya', 'عباءة', 'Abaya'),
  ],
  cloth: ['#2fbf8f', '#4a6fd6', '#ff7a66', '#ffbf3c', '#b57be0', '#f06fa5', '#2f93b0', '#39406a', '#8a5a3c', '#ffffff', '#1d2a4d'],
  glasses: [opt('none', 'بدون', 'None'), opt('round', 'دائرية', 'Round'), opt('square', 'مربّعة', 'Square'), opt('star', 'نجمية', 'Star glasses', 5)],
  pack: [opt('none', 'بدون', 'None'), opt('backpack', 'حقيبة ظهر', 'Backpack'), opt('satchel', 'حقيبة كتف', 'Satchel', 2)],
  scarf: [opt('none', 'بدون', 'None'), opt('scarf', 'وشاح', 'Scarf')],
  extra: [opt('none', 'بدون', 'None'), opt('book', 'كتاب', 'Book'), opt('lantern', 'فانوس', 'Lantern', 4), opt('badge', 'وسام النجمة', 'Star medal', 6)],
};

/** Which palette each colour setting uses. */
export const COLOUR_OF = { skin: 'skin', hairColor: 'hairColor', headColor: 'cloth', topColor: 'cloth', bottomColor: 'cloth', packColor: 'cloth', scarfColor: 'cloth' };

/** Every option that has to be earned, lowest level first. */
export const AVATAR_REWARDS = Object.values(AVATAR).flat()
  .filter((option) => typeof option === 'object' && option.level)
  .sort((a, b) => a.level - b.level);

export const VIEWS = ['front', 'right', 'back', 'left'];
