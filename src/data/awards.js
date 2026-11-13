// Achievements, challenges and medals: what exists and what each one asks for.
//
// Everything here is data. Each entry names a METRIC (a number the app already
// tracks, see systems/rewards.js) and the GOAL that number must reach.
// To add an achievement, medal or challenge, add one line; nothing else changes.
//
// Metrics: lessons, played, xp, lessonXp, level, correct, perfect, perfectRun,
//   reviews, explored, islands, perfectIslands, worldsDone, worldsOpen,
//   worldsTouched, worlds3, worldsIsland, streak, days, dailyDone, weeklyDone,
//   specialDone, fullDays, challenges, medals, dawn, friday, comeback
//   r:<world>   lessons finished in a world        ri:<world>  islands finished in a world
//   i:<island>  1 when that island is finished     set:<a>,<b> how many of those islands are finished
//   c:<challenge> how many times a challenge has been completed

/* ---------- Achievements ---------- */

export const CATEGORIES = [
  { id: 'learning', name: { ar: 'التعلّم', en: 'Learning' }, color: '#4a6fd6', shape: 'circle' },
  { id: 'quran', name: { ar: 'تعلّم القرآن', en: 'Qur\'an learning' }, color: '#1f8a70', shape: 'octagram' },
  { id: 'lessons', name: { ar: 'إتمام الدروس', en: 'Lesson completion' }, color: '#2fbf8f', shape: 'square' },
  { id: 'islands', name: { ar: 'استكشاف الجزر', en: 'Island exploration' }, color: '#2f93b0', shape: 'hexagon' },
  { id: 'daily', name: { ar: 'التعلّم اليومي', en: 'Daily learning' }, color: '#ffbf3c', shape: 'sun' },
  { id: 'challenges', name: { ar: 'التحدّيات', en: 'Challenges' }, color: '#ff7a66', shape: 'shield' },
  { id: 'consistency', name: { ar: 'المواظبة', en: 'Consistency' }, color: '#f0892a', shape: 'diamond' },
  { id: 'special', name: { ar: 'إنجازات خاصة', en: 'Special' }, color: '#b57be0', shape: 'scallop' },
];

// XP given for an achievement, by its tier (1 = first of its kind … 4 = hardest).
export const TIER_XP = [0, 20, 40, 80, 150];

// id, category, emblem, tier, metric, goal, Arabic name, English name, Arabic description, English description, [item]
const A = (id, cat, emblem, tier, metric, goal, ar, en, aboutAr, aboutEn, item) => ({
  id, cat, emblem, tier, metric, goal, xp: TIER_XP[tier], name: { ar, en }, about: { ar: aboutAr, en: aboutEn }, ...(item ? { item } : {}),
});

export const ACHIEVEMENTS = [
  // Learning
  A('first-steps', 'learning', 'steps', 1, 'lessons', 1, 'الخطوة الأولى', 'First Steps', 'أكملتَ أوّل درس في رحلتك.', 'You finished the first lesson of your journey.'),
  A('dedicated-learner', 'learning', 'bolt', 1, 'xp', 500, 'المتعلّم المجتهد', 'Dedicated Learner', 'نقاط خبرتك تكبر مع كل درس.', 'Your XP grows with every lesson.'),
  A('xp-2000', 'learning', 'bolt', 2, 'xp', 2000, 'جامع النقاط', 'XP Collector', 'اجتهادك يظهر في نقاطك.', 'Your effort shows in your points.'),
  A('xp-10000', 'learning', 'bolt', 3, 'xp', 10000, 'كنز الخبرة', 'XP Treasure', 'عشرة آلاف نقطة من التعلّم.', 'Ten thousand points of learning.'),
  A('level-5', 'learning', 'gem', 1, 'level', 5, 'المستوى الخامس', 'Level Five', 'وصلتَ إلى المستوى الخامس.', 'You reached level five.'),
  A('level-10', 'learning', 'gem', 2, 'level', 10, 'المستوى العاشر', 'Level Ten', 'وصلتَ إلى المستوى العاشر.', 'You reached level ten.'),
  A('level-20', 'learning', 'gem', 3, 'level', 20, 'المستوى العشرون', 'Level Twenty', 'وصلتَ إلى المستوى العشرين.', 'You reached level twenty.'),
  A('correct-50', 'learning', 'target', 1, 'correct', 50, 'ذهن حاضر', 'Sharp Mind', 'إجاباتك الصحيحة تتزايد.', 'Your correct answers are adding up.'),
  A('correct-500', 'learning', 'target', 2, 'correct', 500, 'إجابات واثقة', 'Confident Answers', 'تجيب بثقة ومعرفة.', 'You answer with confidence.'),
  A('correct-2000', 'learning', 'target', 3, 'correct', 2000, 'بحر الإجابات', 'Sea of Answers', 'ألفا إجابة صحيحة.', 'Two thousand correct answers.'),

  // Lesson completion
  A('lessons-10', 'lessons', 'book', 1, 'lessons', 10, 'عشرة دروس', 'Ten Lessons', 'أكملتَ عشرة دروس.', 'You finished ten lessons.'),
  A('lessons-50', 'lessons', 'book', 2, 'lessons', 50, 'خمسون درسًا', 'Fifty Lessons', 'أكملتَ خمسين درسًا.', 'You finished fifty lessons.'),
  A('lessons-100', 'lessons', 'trophy', 3, 'lessons', 100, 'بطل التعلّم', 'Learning Champion', 'مئة درس! جائزتك قبّعة التخرّج لشخصيّتك.', 'A hundred lessons! Your prize is a graduation cap for your avatar.', 'graduate'),
  A('lessons-500', 'lessons', 'book', 3, 'lessons', 500, 'خمسمئة درس', 'Five Hundred Lessons', 'أكملتَ خمسمئة درس.', 'You finished five hundred lessons.'),
  A('lessons-1000', 'lessons', 'book', 4, 'lessons', 1000, 'ألف درس', 'A Thousand Lessons', 'ألف درس من العلم النافع.', 'A thousand lessons of beneficial knowledge.'),
  A('perfect-10', 'lessons', 'star', 1, 'perfect', 10, 'إتقان', 'Mastery', 'عشرة دروس بثلاث نجوم.', 'Ten lessons with three stars.'),
  A('perfect-100', 'lessons', 'star', 2, 'perfect', 100, 'إتقان كبير', 'Great Mastery', 'مئة درس بثلاث نجوم.', 'A hundred lessons with three stars.'),
  A('perfect-run-5', 'lessons', 'star', 3, 'perfectRun', 5, 'خمسة متقنة متتالية', 'Five in a Row', 'خمسة دروس متتالية بلا خطأ.', 'Five lessons in a row without a mistake.'),
  A('reviewer', 'lessons', 'check', 1, 'reviews', 10, 'المراجِع', 'The Reviewer', 'المراجعة تثبّت ما تعلّمتَه.', 'Reviewing makes what you learned stay.'),

  // Qur'an learning
  A('quran-explorer', 'quran', 'compass', 1, 'r:learn', 10, 'مستكشف القرآن', 'Qur\'an Explorer', 'بدأتَ رحلتك في عالم تعلُّم القرآن.', 'Your journey through Qur\'an Learning has begun.'),
  A('first-light', 'quran', 'lantern', 1, 'i:quran', 1, 'نور البداية', 'First Light', 'أكملتَ جزيرة القرآن.', 'You finished Qur\'an Island.'),
  A('surah-friend', 'quran', 'book', 2, 'r:learn', 50, 'صديق السور', 'Friend of the Surahs', 'تعرّفتَ على كثير من سور المصحف.', 'You have met many surahs of the mushaf.'),
  A('mushaf-map', 'quran', 'book', 4, 'ri:learn', 11, 'خريطة المصحف', 'Map of the Mushaf', 'أكملتَ كل جزر عالم تعلُّم القرآن.', 'You finished every island of Qur\'an Learning.'),
  A('hifz-10', 'quran', 'quill', 1, 'r:memorize', 10, 'بداية الحفظ', 'Memorisation Begins', 'عشرة دروس في عالم الحفظ.', 'Ten lessons in the Memorisation world.'),
  A('short-surahs', 'quran', 'moon', 2, 'i:memorize-1', 1, 'قصار السور', 'The Short Surahs', 'أكملتَ أوّل جزيرة في عالم الحفظ.', 'You finished the first island of the Memorisation world.'),
  A('hifz-100', 'quran', 'quill', 2, 'r:memorize', 100, 'حافظ مجتهد', 'Diligent Memoriser', 'مئة درس في عالم الحفظ.', 'A hundred lessons in the Memorisation world.'),
  A('hifz-300', 'quran', 'quill', 3, 'r:memorize', 300, 'همّة الحافظ', 'A Memoriser\'s Resolve', 'ثلاثمئة درس في عالم الحفظ.', 'Three hundred lessons in the Memorisation world.'),
  A('meanings-10', 'quran', 'leaf', 1, 'r:understand', 10, 'بداية الفهم', 'Understanding Begins', 'عشرة دروس في عالم فهم القرآن.', 'Ten lessons in Qur\'an Understanding.'),
  A('meanings-100', 'quran', 'leaf', 2, 'r:understand', 100, 'القارئ المتأمّل', 'Reflective Reader', 'مئة درس في عالم فهم القرآن.', 'A hundred lessons in Qur\'an Understanding.'),

  // Island exploration
  A('knowledge-explorer', 'islands', 'compass', 1, 'explored', 10, 'مستكشف المعرفة', 'Knowledge Explorer', 'تعلّمتَ في عشر جزر. جائزتك راية المستكشف لشخصيّتك.', 'You have learned on ten islands. Your prize is an explorer\'s flag for your avatar.', 'flag'),
  A('island-voyager', 'islands', 'compass', 2, 'explored', 50, 'رحّالة الجزر', 'Island Voyager', 'تعلّمتَ في خمسين جزيرة.', 'You have learned on fifty islands.'),
  A('island-master', 'islands', 'island', 1, 'islands', 1, 'سيّد الجزيرة', 'Island Master', 'أكملتَ جزيرة كاملة.', 'You finished a whole island.'),
  A('islands-5', 'islands', 'island', 2, 'islands', 5, 'خمس جزر', 'Five Islands', 'أكملتَ خمس جزر.', 'You finished five islands.'),
  A('islands-20', 'islands', 'island', 3, 'islands', 20, 'عشرون جزيرة', 'Twenty Islands', 'أكملتَ عشرين جزيرة.', 'You finished twenty islands.'),
  A('islands-100', 'islands', 'island', 4, 'islands', 100, 'مئة جزيرة', 'A Hundred Islands', 'أكملتَ مئة جزيرة.', 'You finished a hundred islands.'),
  A('flawless-island', 'islands', 'gem', 2, 'perfectIslands', 1, 'جزيرة متقنة', 'Flawless Island', 'كل دروس جزيرة واحدة بثلاث نجوم.', 'Every lesson of one island with three stars.'),
  A('whole-world', 'islands', 'mountain', 3, 'worldsDone', 1, 'عالَم كامل', 'A Whole World', 'أكملتَ كل جزر عالَم واحد.', 'You finished every island of one world.'),
  A('world-opener', 'islands', 'key', 2, 'worldsOpen', 6, 'فاتح العوالم', 'World Opener', 'فتحتَ ستة عوالم.', 'You opened six worlds.'),
  A('every-gate', 'islands', 'key', 3, 'worldsOpen', 12, 'كل الأبواب مفتوحة', 'Every Gate Open', 'فتحتَ كل عوالم سكينة.', 'You opened every world of SAKINA.'),

  // Daily learning
  A('daily-first', 'daily', 'sun', 1, 'dailyDone', 1, 'تحدّي اليوم', 'Today\'s Challenge', 'أكملتَ أوّل تحدٍّ يومي.', 'You completed your first daily challenge.'),
  A('daily-25', 'daily', 'sun', 2, 'dailyDone', 25, 'نشاط يومي', 'Daily Energy', 'خمسة وعشرون تحدّيًا يوميًّا.', 'Twenty-five daily challenges.'),
  A('full-day', 'daily', 'calendar', 1, 'fullDays', 1, 'يوم كامل', 'A Full Day', 'أكملتَ كل تحدّيات يوم واحد.', 'You completed every challenge of one day.'),
  A('full-days-7', 'daily', 'calendar', 2, 'fullDays', 7, 'سبعة أيام كاملة', 'Seven Full Days', 'سبعة أيام أكملتَ فيها كل التحدّيات.', 'Seven days with every challenge completed.'),
  A('days-30', 'daily', 'calendar', 3, 'days', 30, 'ثلاثون يومًا من التعلّم', 'Thirty Days of Learning', 'تعلّمتَ في ثلاثين يومًا.', 'You learned on thirty different days.'),
  A('days-100', 'daily', 'calendar', 4, 'days', 100, 'مئة يوم من التعلّم', 'A Hundred Days of Learning', 'تعلّمتَ في مئة يوم.', 'You learned on a hundred different days.'),

  // Challenges
  A('challenge-winner', 'challenges', 'trophy', 1, 'challenges', 10, 'بطل التحدّيات', 'Challenge Winner', 'عشرة تحدّيات! جائزتك كأس تحمله شخصيّتك.', 'Ten challenges! Your prize is a trophy for your avatar to carry.', 'trophy'),
  A('challenges-50', 'challenges', 'trophy', 2, 'challenges', 50, 'خمسون تحدّيًا', 'Fifty Challenges', 'أكملتَ خمسين تحدّيًا.', 'You completed fifty challenges.'),
  A('weekly-first', 'challenges', 'flag', 1, 'weeklyDone', 1, 'تحدّي الأسبوع', 'Weekly Challenge', 'أكملتَ أوّل تحدٍّ أسبوعي.', 'You completed your first weekly challenge.'),
  A('weekly-10', 'challenges', 'flag', 2, 'weeklyDone', 10, 'عشرة تحدّيات أسبوعية', 'Ten Weekly Challenges', 'أكملتَ عشرة تحدّيات أسبوعية.', 'You completed ten weekly challenges.'),
  A('special-first', 'challenges', 'shield', 1, 'specialDone', 1, 'تحدٍّ خاص', 'Special Challenge', 'أكملتَ أوّل تحدٍّ خاص.', 'You completed your first special challenge.'),
  A('special-all', 'challenges', 'shield', 3, 'specialDone', 8, 'كل التحدّيات الخاصة', 'Every Special Challenge', 'أكملتَ كل التحدّيات الخاصة.', 'You completed every special challenge.'),
  A('medal-collector', 'challenges', 'heart', 1, 'medals', 5, 'جامع الأوسمة', 'Medal Collector', 'خمسة أوسمة في مجموعتك.', 'Five medals in your collection.'),
  A('medal-cabinet', 'challenges', 'heart', 3, 'medals', 20, 'خزانة الأوسمة', 'Medal Cabinet', 'عشرون وسامًا في مجموعتك.', 'Twenty medals in your collection.'),

  // Consistency
  A('streak-3', 'consistency', 'flame', 1, 'streak', 3, 'ثلاثة أيام متتالية', 'Three-Day Streak', 'تعلّمتَ ثلاثة أيام متتالية.', 'You learned three days in a row.'),
  A('seven-day-streak', 'consistency', 'flame', 2, 'streak', 7, 'أسبوع متواصل', 'Seven-Day Streak', 'تعلّمتَ سبعة أيام متتالية.', 'You learned seven days in a row.'),
  A('streak-14', 'consistency', 'calendar', 2, 'streak', 14, 'أسبوعان متواصلان', 'Two-Week Streak', 'تعلّمتَ أربعة عشر يومًا متتاليًا.', 'You learned fourteen days in a row.'),
  A('streak-30', 'consistency', 'flame', 3, 'streak', 30, 'شهر متواصل', 'Thirty-Day Streak', 'تعلّمتَ ثلاثين يومًا متتاليًا.', 'You learned thirty days in a row.'),
  A('streak-100', 'consistency', 'flame', 4, 'streak', 100, 'مئة يوم متواصلة', 'Hundred-Day Streak', 'تعلّمتَ مئة يوم متتالية.', 'You learned a hundred days in a row.'),

  // Special
  A('early-blessing', 'special', 'sun', 1, 'dawn', 1, 'بركة البكور', 'Early Blessing', 'أكملتَ درسًا في الصباح الباكر.', 'You finished a lesson early in the morning.'),
  A('morning-friend', 'special', 'sun', 2, 'dawn', 10, 'صديق الصباح', 'Friend of the Morning', 'عشرة دروس في الصباح الباكر.', 'Ten lessons early in the morning.'),
  A('friday-lesson', 'special', 'moon', 1, 'friday', 1, 'درس الجمعة', 'Friday Lesson', 'أكملتَ درسًا يوم الجمعة.', 'You finished a lesson on a Friday.'),
  A('blessed-fridays', 'special', 'moon', 2, 'friday', 10, 'جمعات مباركة', 'Blessed Fridays', 'عشرة دروس في أيام الجمعة.', 'Ten lessons on Fridays.'),
  A('welcome-back', 'special', 'heart', 1, 'comeback', 1, 'عودة حميدة', 'Welcome Back', 'عدتَ إلى التعلّم بعد غياب. أهلًا بك!', 'You came back to learning after time away. Welcome!'),
  A('world-traveller', 'special', 'mountain', 2, 'worldsTouched', 6, 'مسافر بين العوالم', 'World Traveller', 'تعلّمتَ في ستة عوالم مختلفة.', 'You have learned in six different worlds.'),
  A('keeper-of-forty', 'special', 'lantern', 3, 'set:sunnah-2,sunnah-3,sunnah-4', 3, 'حافظ الأربعين', 'Keeper of the Forty', 'أكملتَ جزر الأربعين النووية الثلاث.', 'You finished the three islands of an-Nawawi\'s Forty.'),
];

/* ---------- Challenges ---------- */

// Daily and weekly challenges count what you do from the moment they start.
// Special challenges have no time limit and are completed once.
const C = (id, kind, emblem, ribbon, metric, goal, xp, ar, en, aboutAr, aboutEn, medal) => ({
  id, kind, emblem, ribbon, metric, goal, xp, name: { ar, en }, about: { ar: aboutAr, en: aboutEn }, medal,
});

export const CHALLENGES = [
  C('d-lessons', 'daily', 'book', '#2fbf8f', 'played', 3, 15, 'ثلاثة دروس', 'Three lessons', 'أكمل ثلاثة دروس اليوم.', 'Complete three lessons today.', { ar: 'المثابر', en: 'Persistence' }),
  C('d-xp', 'daily', 'bolt', '#4a6fd6', 'lessonXp', 50, 15, 'خمسون نقطة خبرة', 'Fifty XP', 'اكسب ٥٠ نقطة خبرة من دروس جديدة اليوم.', 'Earn 50 XP from new lessons today.', { ar: 'الطاقة', en: 'Spark' }),
  C('d-correct', 'daily', 'target', '#ff7a66', 'correct', 10, 15, 'عشر إجابات صحيحة', 'Ten correct answers', 'أجب عن عشرة أسئلة إجابة صحيحة اليوم.', 'Answer ten questions correctly today.', { ar: 'الدقّة', en: 'Accuracy' }),
  C('d-explore', 'daily', 'compass', '#b57be0', 'explored', 1, 15, 'جزيرة جديدة', 'A new island', 'أكمل أوّل درس لك في جزيرة لم تتعلّم فيها من قبل.', 'Finish your first lesson on an island you have not learned on before.', { ar: 'الرحّالة', en: 'Wayfarer' }),

  C('w-lessons', 'weekly', 'trophy', '#1f8a70', 'played', 20, 60, 'عشرون درسًا', 'Twenty lessons', 'أكمل عشرين درسًا هذا الأسبوع.', 'Complete twenty lessons this week.', { ar: 'الهمّة', en: 'Resolve' }),
  C('w-islands', 'weekly', 'island', '#2f93b0', 'islands', 2, 60, 'جزيرتان كاملتان', 'Two whole islands', 'أكمل جزيرتين هذا الأسبوع.', 'Finish two islands this week.', { ar: 'الفاتح', en: 'Pathfinder' }),
  C('w-xp', 'weekly', 'sun', '#f0892a', 'lessonXp', 300, 60, 'ثلاثمئة نقطة خبرة', 'Three hundred XP', 'اكسب ٣٠٠ نقطة خبرة من دروس جديدة هذا الأسبوع.', 'Earn 300 XP from new lessons this week.', { ar: 'الاجتهاد', en: 'Diligence' }),
  // The world for this one changes every week (chosen from the worlds you have opened).
  C('w-world', 'weekly', 'flag', '#f06fa5', 'r:*', 8, 60, 'عالَم الأسبوع', 'World of the week', 'أكمل ثمانية دروس جديدة في: {world}.', 'Finish eight new lessons in: {world}.', { ar: 'المتخصّص', en: 'Specialist' }),

  C('s-quran', 'special', 'moon', '#1f8a70', 'r:learn', 30, 150, 'تحدّي معرفة القرآن', 'Qur\'an knowledge challenge', 'أكمل ثلاثين درسًا في عالم تعلُّم القرآن.', 'Finish thirty lessons in Qur\'an Learning.', { ar: 'وسام خريطة السور', en: 'Surah Map Medal', rarity: 'gold' }),
  C('s-memorise', 'special', 'quill', '#c2648c', 'ri:memorize', 3, 150, 'تحدّي الحفظ', 'Memorisation challenge', 'أكمل ثلاث جزر في عالم حفظ القرآن.', 'Finish three islands in Qur\'an Memorisation.', { ar: 'وسام الحافظ', en: 'Memoriser\'s Medal', rarity: 'gold' }),
  C('s-meanings', 'special', 'leaf', '#2aa3a8', 'r:understand', 40, 150, 'تحدّي الفهم', 'Understanding challenge', 'أكمل أربعين درسًا في عالم فهم القرآن.', 'Finish forty lessons in Qur\'an Understanding.', { ar: 'وسام التأمّل', en: 'Reflection Medal', rarity: 'gold' }),
  C('s-prophets', 'special', 'mountain', '#d9a84c', 'ri:prophets', 2, 150, 'تحدّي قصص الأنبياء', 'Stories of the Prophets challenge', 'أكمل جزيرتين في عالم قصص الأنبياء.', 'Finish two islands in Stories of the Prophets.', { ar: 'وسام قصص الأنبياء', en: 'Prophets\' Stories Medal', rarity: 'gold' }),
  C('s-sunnah', 'special', 'lantern', '#5faf4e', 'ri:sunnah', 2, 150, 'تحدّي السنّة', 'Sunnah challenge', 'أكمل جزيرتين في عالم السنّة الصحيحة.', 'Finish two islands in Authentic Sunnah.', { ar: 'وسام السنّة', en: 'Sunnah Medal', rarity: 'gold' }),
  C('s-history', 'special', 'shield', '#c9744f', 'ri:history', 1, 150, 'تحدّي السيرة والتاريخ', 'Islamic history challenge', 'أكمل جزيرة في عالم السيرة والتاريخ.', 'Finish one island in Islamic History.', { ar: 'وسام السيرة', en: 'Seerah Medal', rarity: 'gold' }),
  C('s-mixed', 'special', 'gem', '#7a5fd0', 'worlds3', 6, 200, 'تحدّي المعرفة الشاملة', 'Mixed knowledge challenge', 'أكمل ثلاثة دروس على الأقل في ستة عوالم مختلفة.', 'Finish at least three lessons in six different worlds.', { ar: 'وسام المعرفة الشاملة', en: 'All-Round Knowledge Medal', rarity: 'special' }),
  C('s-tour', 'special', 'compass', '#e0932a', 'worldsIsland', 8, 250, 'جولة العوالم', 'World tour', 'أكمل جزيرة واحدة على الأقل في ثمانية عوالم مختلفة.', 'Finish at least one island in eight different worlds.', { ar: 'وسام جولة العوالم', en: 'World Tour Medal', rarity: 'special' }),
];

/* ---------- Medals ---------- */

export const RARITIES = [
  { id: 'bronze', name: { ar: 'برونزي', en: 'Bronze' } },
  { id: 'silver', name: { ar: 'فضّي', en: 'Silver' } },
  { id: 'gold', name: { ar: 'ذهبي', en: 'Gold' } },
  { id: 'special', name: { ar: 'خاص', en: 'Special' } },
];

// A repeating challenge gives a better medal the more times it is completed.
const STEPS = { daily: [[1, 'bronze'], [7, 'silver'], [30, 'gold']], weekly: [[1, 'bronze'], [4, 'silver'], [12, 'gold']] };
const RANK = { bronze: { ar: 'البرونزي', en: 'Bronze' }, silver: { ar: 'الفضّي', en: 'Silver' }, gold: { ar: 'الذهبي', en: 'Gold' } };

const challengeMedals = CHALLENGES.flatMap((ch) => (ch.kind === 'special'
  ? [{
    id: `m-${ch.id}`, rarity: ch.medal.rarity, emblem: ch.emblem, ribbon: ch.ribbon, metric: `c:${ch.id}`, goal: 1, challenge: ch.id,
    name: { ar: ch.medal.ar, en: ch.medal.en }, about: { ar: `يُمنح عند إكمال: ${ch.name.ar}.`, en: `Awarded for completing: ${ch.name.en}.` },
  }]
  : STEPS[ch.kind].map(([times, rarity]) => ({
    id: `m-${ch.id}-${times}`, rarity, emblem: ch.emblem, ribbon: ch.ribbon, metric: `c:${ch.id}`, goal: times, challenge: ch.id,
    name: { ar: `وسام ${ch.medal.ar} ${RANK[rarity].ar}`, en: `${RANK[rarity].en} ${ch.medal.en} Medal` },
    about: { ar: `يُمنح عند إكمال تحدّي «${ch.name.ar}».`, en: `Awarded for completing the "${ch.name.en}" challenge.` },
  }))));

const M = (id, rarity, emblem, ribbon, metric, goal, ar, en, aboutAr, aboutEn, item) => ({
  id, rarity, emblem, ribbon, metric, goal, name: { ar, en }, about: { ar: aboutAr, en: aboutEn }, ...(item ? { item } : {}),
});

const milestoneMedals = [
  M('m-island-1', 'bronze', 'mountain', '#2f93b0', 'islands', 1, 'وسام الجزيرة الأولى', 'First Island Medal', 'لإكمال أوّل جزيرة.', 'For finishing your first island.'),
  M('m-streak-7', 'bronze', 'flame', '#f0892a', 'streak', 7, 'وسام الأسبوع', 'Week Medal', 'لسبعة أيام متتالية من التعلّم.', 'For seven days of learning in a row.'),
  M('m-islands-10', 'silver', 'mountain', '#2f93b0', 'islands', 10, 'وسام العشر جزر', 'Ten Islands Medal', 'لإكمال عشر جزر.', 'For finishing ten islands.'),
  M('m-lessons-100', 'silver', 'steps', '#2fbf8f', 'lessons', 100, 'وسام المئة درس', 'Hundred Lessons Medal', 'لإكمال مئة درس.', 'For finishing a hundred lessons.'),
  M('m-flawless', 'silver', 'star', '#ffbf3c', 'perfectIslands', 1, 'وسام الإتقان', 'Mastery Medal', 'لجزيرة كل دروسها بثلاث نجوم. معه نظّارة ذهبية لشخصيّتك.', 'For an island with three stars in every lesson. It comes with gold glasses for your avatar.', 'gold'),
  M('m-full-7', 'silver', 'calendar', '#ff7a66', 'fullDays', 7, 'وسام الأيام الكاملة', 'Full Days Medal', 'لسبعة أيام أكملتَ فيها كل التحدّيات اليومية.', 'For seven days with every daily challenge completed.'),
  M('m-lessons-500', 'gold', 'steps', '#2fbf8f', 'lessons', 500, 'وسام الخمسمئة درس', 'Five Hundred Lessons Medal', 'لإكمال خمسمئة درس.', 'For finishing five hundred lessons.'),
  M('m-streak-30', 'gold', 'flame', '#f0892a', 'streak', 30, 'وسام الشهر', 'Month Medal', 'لثلاثين يومًا متتاليًا من التعلّم.', 'For thirty days of learning in a row.'),
  M('m-world', 'gold', 'key', '#4a6fd6', 'worldsDone', 1, 'وسام العالَم الكامل', 'Whole World Medal', 'لإكمال كل جزر عالَم واحد.', 'For finishing every island of one world.'),
  M('m-lessons-1000', 'special', 'steps', '#2fbf8f', 'lessons', 1000, 'وسام الألف درس', 'Thousand Lessons Medal', 'لإكمال ألف درس.', 'For finishing a thousand lessons.'),
  M('m-streak-100', 'special', 'flame', '#f0892a', 'streak', 100, 'وسام المئة يوم', 'Hundred Days Medal', 'لمئة يوم متتالية من التعلّم.', 'For a hundred days of learning in a row.'),
];

export const MEDALS = [...challengeMedals, ...milestoneMedals];

/* ---------- How a requirement is described ---------- */

export const METRIC_LABELS = {
  lessons: { ar: 'دروس جديدة مكتملة', en: 'New lessons finished' },
  played: { ar: 'دروس مكتملة', en: 'Lessons completed' },
  xp: { ar: 'مجموع نقاط الخبرة', en: 'Total XP' },
  lessonXp: { ar: 'نقاط خبرة من دروس جديدة', en: 'XP from new lessons' },
  level: { ar: 'المستوى', en: 'Level' },
  correct: { ar: 'إجابات صحيحة', en: 'Correct answers' },
  perfect: { ar: 'دروس بثلاث نجوم', en: 'Lessons with three stars' },
  perfectRun: { ar: 'دروس متتالية بثلاث نجوم', en: 'Three-star lessons in a row' },
  reviews: { ar: 'دروس راجعتَها', en: 'Lessons reviewed' },
  explored: { ar: 'جزر تعلّمتَ فيها', en: 'Islands you have learned on' },
  islands: { ar: 'جزر مكتملة', en: 'Islands finished' },
  perfectIslands: { ar: 'جزر كل دروسها بثلاث نجوم', en: 'Islands with three stars in every lesson' },
  worldsDone: { ar: 'عوالم مكتملة', en: 'Worlds finished' },
  worldsOpen: { ar: 'عوالم مفتوحة', en: 'Worlds opened' },
  worldsTouched: { ar: 'عوالم تعلّمتَ فيها', en: 'Worlds you have learned in' },
  worlds3: { ar: 'عوالم أكملتَ فيها ٣ دروس', en: 'Worlds with 3 lessons finished' },
  worldsIsland: { ar: 'عوالم أكملتَ فيها جزيرة', en: 'Worlds with an island finished' },
  streak: { ar: 'أيام متتالية (أفضل رقم)', en: 'Days in a row (best)' },
  days: { ar: 'أيام التعلّم', en: 'Days of learning' },
  dailyDone: { ar: 'تحدّيات يومية مكتملة', en: 'Daily challenges completed' },
  weeklyDone: { ar: 'تحدّيات أسبوعية مكتملة', en: 'Weekly challenges completed' },
  specialDone: { ar: 'تحدّيات خاصة مكتملة', en: 'Special challenges completed' },
  fullDays: { ar: 'أيام أكملتَ فيها كل التحدّيات', en: 'Days with every challenge completed' },
  challenges: { ar: 'تحدّيات مكتملة', en: 'Challenges completed' },
  medals: { ar: 'أوسمة', en: 'Medals' },
  dawn: { ar: 'دروس بين ٤ و٨ صباحًا', en: 'Lessons between 4 and 8 a.m.' },
  friday: { ar: 'دروس يوم الجمعة', en: 'Lessons on a Friday' },
  comeback: { ar: 'عودة بعد غياب أسبوع أو أكثر', en: 'Returns after a week or more away' },
};

/** Avatar items given by an achievement or medal: item id -> what gives it. */
export const ITEM_SOURCES = Object.fromEntries([
  ...ACHIEVEMENTS.filter((a) => a.item).map((a) => [a.item, { kind: 'achievements', id: a.id, name: a.name }]),
  ...MEDALS.filter((m) => m.item).map((m) => [m.item, { kind: 'medals', id: m.id, name: m.name }]),
]);
