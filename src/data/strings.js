// Every word of the interface, in Arabic and English.
// {name}, {n} and similar are filled in by t() in core/i18n.js.

export const STRINGS = {
  'app.name': { ar: 'سكينة', en: 'SAKINA' },

  'tab.world': { ar: 'العالم', en: 'World' },
  'tab.friends': { ar: 'الأصدقاء', en: 'Friends' },
  'tab.journey': { ar: 'رحلتي', en: 'My journey' },

  'hud.stars': { ar: 'نجوم', en: 'Stars' },
  'hud.streak': { ar: 'أيام متتالية', en: 'Days in a row' },

  'nav.backToWorld': { ar: 'العودة إلى العالم', en: 'Back to the world' },

  'world.continue': { ar: 'أكمل الرحلة', en: 'Continue the journey' },
  'world.allDone': { ar: 'أتممتَ كل الدروس المتاحة. جزر جديدة في الطريق إن شاء الله!', en: 'You have finished every lesson so far. New islands are on the way, in sha Allah!' },
  'world.soon': { ar: 'قريبًا', en: 'Coming soon' },
  'world.locked': { ar: 'مغلقة', en: 'Locked' },
  'world.soonToast': { ar: 'هذه الجزيرة ما زالت قيد البناء.', en: 'This island is still being built.' },
  'world.lockedToast': { ar: 'أكمل دروس الجزيرة السابقة لتفتح هذه الجزيرة.', en: 'Finish the previous island to open this one.' },

  'island.lessons': { ar: 'الدروس', en: 'Lessons' },
  'island.start': { ar: 'ابدأ الدرس', en: 'Start lesson' },
  'island.lessonLocked': { ar: 'أكمل الدرس السابق أولًا', en: 'Finish the previous lesson first' },
  'island.lockedToast': { ar: 'أكمل الدرس السابق أولًا.', en: 'Finish the previous lesson first.' },
  'island.cheer': { ar: 'هيّا نتعلّم معًا!', en: 'Let\'s learn together!' },
  'island.finished': { ar: 'أتممنا هذه الجزيرة، الحمد لله!', en: 'We finished this island, alhamdulillah!' },

  'lesson.leave': { ar: 'الخروج من الدرس', en: 'Leave lesson' },
  'lesson.explains': { ar: 'شرح {name}', en: '{name} explains' },
  'lesson.quran': { ar: 'القرآن الكريم', en: 'The Qur\'an' },
  'lesson.hadith': { ar: 'حديث صحيح', en: 'Authentic hadith' },
  'lesson.meaning': { ar: 'المعنى', en: 'Meaning' },
  'lesson.continue': { ar: 'متابعة', en: 'Continue' },
  'lesson.check': { ar: 'تحقّق', en: 'Check' },
  'lesson.right': { ar: 'أحسنت!', en: 'Well done!' },
  'lesson.wrong': { ar: 'ليس تمامًا', en: 'Not quite' },

  'finish.title': { ar: 'أتممتَ الدرس!', en: 'Lesson complete!' },
  'finish.gained': { ar: 'نجوم جديدة: {n}', en: 'New stars: {n}' },
  'finish.newItem': { ar: 'فُتح في خزانة الأصدقاء: {name}', en: 'Unlocked for your friends: {name}' },
  'finish.newIsland': { ar: 'فُتحت جزيرة جديدة: {name}', en: 'New island open: {name}' },
  'finish.next': { ar: 'الدرس التالي', en: 'Next lesson' },
  'finish.wardrobe': { ar: 'جرّب الجديد على الأصدقاء', en: 'Try it on your friends' },
  'finish.back': { ar: 'العودة إلى {name}', en: 'Back to {name}' },

  'friends.fur': { ar: 'لون فرو {name}', en: '{name}\'s fur colour' },
  'friends.marks': { ar: 'لون العلامات', en: 'Markings colour' },
  'friends.outfit': { ar: 'الملابس', en: 'Outfit' },
  'friends.accessory': { ar: 'الإكسسوار', en: 'Accessory' },
  'friends.expression': { ar: 'جرّب تعبيرًا', en: 'Try an expression' },
  'friends.colorN': { ar: 'اللون {n}', en: 'Colour {n}' },
  'friends.lockedToast': { ar: 'النجوم المطلوبة لفتح هذا: {n}', en: 'Stars needed to unlock this: {n}' },

  'journey.level': { ar: 'المستوى {n}', en: 'Level {n}' },
  'journey.toNext': { ar: 'النجوم الباقية لتصبح «{name}»: {n}', en: 'Stars to go to become "{name}": {n}' },
  'journey.topLevel': { ar: 'وصلتَ إلى أعلى مستوى حاليًا.', en: 'You have reached the highest level for now.' },
  'journey.lessons': { ar: 'دروس مكتملة', en: 'Lessons done' },
  'journey.islands': { ar: 'الجزر', en: 'Islands' },
  'journey.lessonsDone': { ar: 'الدروس: {done} من {total}', en: 'Lessons: {done} of {total}' },
  'journey.rewards': { ar: 'المكافآت', en: 'Rewards' },
  'journey.unlocked': { ar: 'مفتوحة', en: 'Unlocked' },
  'journey.needs': { ar: 'النجوم المطلوبة: {n}', en: 'Stars needed: {n}' },
  'journey.sourcesTitle': { ar: 'عن مصادرنا', en: 'About our sources' },
  'journey.sourcesBody': {
    ar: 'الآيات تُعرض بنصّها من المصحف مع اسم السورة ورقم الآية، والأحاديث من الصحيحين مع رقم الحديث. أمّا ما يقوله زاد ولولو فهو شرح تعليمي مبسّط، ويظهر دائمًا تحت علامة «شرح».',
    en: 'Ayat are shown in their own words from the mushaf with the surah and ayah number, and hadith come from the two Sahih collections with their numbers. What Zad and Lulu say is a simple educational explanation, and it always appears under an "explains" label.',
  },
  'journey.settings': { ar: 'الإعدادات', en: 'Settings' },
  'journey.language': { ar: 'اللغة', en: 'Language' },
  'journey.reset': { ar: 'البدء من جديد', en: 'Start over' },
  'journey.resetConfirm': { ar: 'اضغط مرة أخرى لحذف كل التقدّم', en: 'Tap again to erase all progress' },
  'journey.resetDone': { ar: 'بدأتَ من جديد.', en: 'Progress cleared.' },
};
