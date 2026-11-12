// The SAKINA curriculum: which regions exist and what each island teaches.
//
// This file only says WHAT to teach (which surahs, ayah ranges or hadith books).
// tools/build-content.mjs turns it into lessons, copying every text word for
// word from the published sources listed in docs/CONTENT.md.
//
// Ranges: '78' = whole surah, '2:255-257' = ayat of a surah.
// Modes:  facts      – know the surahs of the mushaf
//         recite     – memorise ayat
//         understand – ayat with their meaning
//         hadith     – hadith from a named collection

export const REGIONS = [
  { id: 'learn', biome: 'meadow', name: { ar: 'عالم تعلُّم القرآن', en: 'Qur\'an Learning' }, about: { ar: 'تعرَّف على المصحف وسوره.', en: 'Get to know the mushaf and its surahs.' } },
  { id: 'memorize', biome: 'dawn', name: { ar: 'عالم حفظ القرآن', en: 'Qur\'an Memorisation' }, about: { ar: 'احفظ السور آيةً بعد آية.', en: 'Memorise surahs ayah by ayah.' } },
  { id: 'understand', biome: 'lagoon', name: { ar: 'عالم فهم القرآن', en: 'Qur\'an Understanding' }, about: { ar: 'افهم معاني الآيات من التفسير الميسَّر.', en: 'Understand the meanings of the ayat.' } },
  { id: 'prophets', biome: 'desert', name: { ar: 'عالم قصص الأنبياء', en: 'Stories of the Prophets' }, about: { ar: 'قصص الأنبياء عليهم السلام كما وردت في القرآن.', en: 'The stories of the prophets, peace be upon them, as told in the Qur\'an.' } },
  { id: 'sunnah', biome: 'garden', name: { ar: 'عالم السنّة الصحيحة', en: 'Authentic Sunnah' }, about: { ar: 'أحاديث من صحيح البخاري والأربعين النووية.', en: 'Hadith from Sahih al-Bukhari and an-Nawawi\'s Forty.' } },
  { id: 'manners', biome: 'orchard', name: { ar: 'عالم الآداب الإسلامية', en: 'Islamic Manners' }, about: { ar: 'آداب المسلم من القرآن والسنّة.', en: 'A Muslim\'s manners from the Qur\'an and Sunnah.' } },
  { id: 'adhkar', biome: 'night', name: { ar: 'عالم الأذكار والدعاء', en: 'Daily Adhkar' }, about: { ar: 'أدعية القرآن وأذكار من السنّة.', en: 'Supplications of the Qur\'an and adhkar from the Sunnah.' } },
  { id: 'prayer', biome: 'spring', name: { ar: 'عالم تعلُّم الصلاة', en: 'Prayer Learning' }, about: { ar: 'آيات الصلاة وأحاديث الوضوء والأذان والصلاة.', en: 'Ayat about prayer and hadith on wudu, the adhan and salah.' } },
  { id: 'history', biome: 'canyon', name: { ar: 'عالم السيرة والتاريخ', en: 'Islamic History' }, about: { ar: 'أحداث السيرة كما ذكرها القرآن والسنّة.', en: 'Events of the Seerah as mentioned in the Qur\'an and Sunnah.' } },
  { id: 'companions', biome: 'palm', name: { ar: 'عالم الصحابة', en: 'Companions of the Prophet' }, about: { ar: 'فضائل الصحابة رضي الله عنهم.', en: 'The virtues of the Companions, may Allah be pleased with them.' } },
  { id: 'knowledge', biome: 'aurora', name: { ar: 'عالم المعرفة الإسلامية', en: 'Islamic Knowledge' }, about: { ar: 'الإيمان والتوحيد والعلم.', en: 'Faith, the oneness of Allah, and knowledge.' } },
  { id: 'general', biome: 'harvest', name: { ar: 'عالم التربية الإسلامية', en: 'General Islamic Education' }, about: { ar: 'الصيام والزكاة والحج وفضائل القرآن.', en: 'Fasting, zakah, Hajj and the virtues of the Qur\'an.' } },
];

const q = (region, mode, name, ranges, extra = {}) => ({ region, mode, name, ranges, ...extra });
const h = (region, name, book, max, extra = {}) => ({ region, mode: 'hadith', name, book, max, ...extra });
// One island per surah (or group of short surahs); the name comes from the surah names.
const surahs = (region, mode, groups) => groups.map((g) => ({ region, mode, ranges: (Array.isArray(g) ? g : [g]).map(String) }));

const JUZ_30_FROM_END = [[114, 113, 112, 111, 110, 109], [108, 107, 106, 105, 104, 103], [102, 101, 100, 99], [98, 97, 96, 95], [94, 93, 92], [91, 90], 89, 88, [87, 86], 85, 84, 83, [82, 81], 80, 79, 78];
const JUZ_30_IN_ORDER = [78, 79, 80, [81, 82], 83, 84, 85, [86, 87], 88, 89, [90, 91], [92, 93, 94], [95, 96, 97, 98], [99, 100, 101, 102], [103, 104, 105, 106, 107, 108], [109, 110, 111, 112, 113, 114]];

export const ISLANDS = [
  /* ---------- 1. Qur'an Learning ---------- */
  q('learn', 'recite', { ar: 'جزيرة القرآن', en: 'Qur\'an Island' }, ['1', '112', '113', '114'], {
    id: 'quran', legacy: ['quran-meet', 'quran-fatiha', 'quran-ikhlas'], maxLessons: 12,
    about: { ar: 'تعرَّف على كتاب الله وسوره القصيرة.', en: 'Get to know the Book of Allah and its short surahs.' },
  }),
  { region: 'learn', mode: 'facts', groups: 10 },

  /* ---------- 2. Qur'an Memorisation ---------- */
  ...surahs('memorize', 'recite', JUZ_30_FROM_END),
  ...surahs('memorize', 'recite', [77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67]),
  ...surahs('memorize', 'recite', [66, 65, 64, 63, 62, 61, 60, 59, 58]),
  ...surahs('memorize', 'recite', [57, 56, 55, 54, 53, 52, 51, 50, 36, 32, 31, 18, 19, 25]),

  /* ---------- 3. Qur'an Understanding ---------- */
  q('understand', 'understand', { ar: 'الفاتحة وآية الكرسي وخواتيم البقرة', en: 'Al-Fatiha, Ayat al-Kursi and the end of Al-Baqarah' }, ['1', '2:255-257', '2:284-286']),
  ...surahs('understand', 'understand', JUZ_30_IN_ORDER),
  ...surahs('understand', 'understand', [67, 36, 55, 56, 61, 62, 64, 73, 76, 50, 32]),
  q('understand', 'understand', { ar: 'صفات المتقين في أوّل البقرة', en: 'The mindful, at the start of Al-Baqarah' }, ['2:1-20']),
  q('understand', 'understand', { ar: 'المؤمنون وصفاتهم', en: 'The believers and their qualities' }, ['23:1-11', '70:19-35', '8:2-4']),
  q('understand', 'understand', { ar: 'آيات التفكّر في خلق الله', en: 'Reflecting on Allah\'s creation' }, ['3:190-195', '30:20-27', '16:10-18']),
  q('understand', 'understand', { ar: 'خواتيم سورة الحشر وأوائل الحديد', en: 'The end of Al-Hashr and the start of Al-Hadid' }, ['59:18-24', '57:1-10']),

  /* ---------- 4. Stories of the Prophets ---------- */
  q('prophets', 'understand', { ar: 'آدم عليه السلام', en: 'Adam, peace be upon him' }, ['2:30-39', '7:11-25', '20:115-123']),
  q('prophets', 'understand', { ar: 'نوح عليه السلام في سورة نوح', en: 'Nuh, peace be upon him, in Surah Nuh' }, ['71']),
  q('prophets', 'understand', { ar: 'نوح عليه السلام والسفينة', en: 'Nuh, peace be upon him, and the ark' }, ['11:25-49']),
  q('prophets', 'understand', { ar: 'هود وصالح عليهما السلام', en: 'Hud and Salih, peace be upon them' }, ['11:50-68']),
  q('prophets', 'understand', { ar: 'إبراهيم عليه السلام وقومه', en: 'Ibrahim, peace be upon him, and his people' }, ['21:51-73']),
  q('prophets', 'understand', { ar: 'إبراهيم وإسماعيل عليهما السلام', en: 'Ibrahim and Isma\'il, peace be upon them' }, ['37:83-113']),
  q('prophets', 'understand', { ar: 'دعاء إبراهيم عليه السلام وبناء البيت', en: 'The prayers of Ibrahim, peace be upon him, and the building of the House' }, ['2:124-132', '14:35-41', '19:41-50']),
  q('prophets', 'understand', { ar: 'يوسف عليه السلام', en: 'Yusuf, peace be upon him' }, ['12']),
  q('prophets', 'understand', { ar: 'شعيب عليه السلام', en: 'Shu\'ayb, peace be upon him' }, ['11:84-95', '7:85-93']),
  q('prophets', 'understand', { ar: 'موسى عليه السلام في سورة طه', en: 'Musa, peace be upon him, in Surah Ta-Ha' }, ['20:9-98']),
  q('prophets', 'understand', { ar: 'موسى عليه السلام في سورة القصص', en: 'Musa, peace be upon him, in Surah Al-Qasas' }, ['28:3-43']),
  q('prophets', 'understand', { ar: 'موسى عليه السلام وفرعون في سورة الشعراء', en: 'Musa, peace be upon him, and Pharaoh in Surah Ash-Shu\'ara' }, ['26:10-68']),
  q('prophets', 'understand', { ar: 'موسى عليه السلام والخضر', en: 'Musa, peace be upon him, and Al-Khidr' }, ['18:60-82']),
  q('prophets', 'understand', { ar: 'داود وسليمان عليهما السلام', en: 'Dawud and Sulayman, peace be upon them' }, ['38:17-40', '21:78-82']),
  q('prophets', 'understand', { ar: 'سليمان عليه السلام وملكة سبأ', en: 'Sulayman, peace be upon him, and the Queen of Saba' }, ['27:15-44']),
  q('prophets', 'understand', { ar: 'أيوب ويونس عليهما السلام', en: 'Ayyub and Yunus, peace be upon them' }, ['38:41-44', '21:83-88', '37:139-148']),
  q('prophets', 'understand', { ar: 'زكريا ويحيى ومريم عليهم السلام', en: 'Zakariyya, Yahya and Maryam, peace be upon them' }, ['19:1-40']),
  q('prophets', 'understand', { ar: 'عيسى عليه السلام', en: 'Isa, peace be upon him' }, ['3:42-59', '5:110-120']),
  q('prophets', 'understand', { ar: 'أصحاب الكهف', en: 'The People of the Cave' }, ['18:9-26']),
  q('prophets', 'understand', { ar: 'صاحب الجنتين وذو القرنين', en: 'The owner of the two gardens, and Dhul-Qarnayn' }, ['18:32-44', '18:83-98']),
  q('prophets', 'understand', { ar: 'قارون وسبأ', en: 'Qarun and the people of Saba' }, ['28:76-84', '34:15-21']),
  h('prophets', { ar: 'أحاديث الأنبياء', en: 'Hadith about the prophets' }, 60, 2),

  /* ---------- 5. Authentic Sunnah ---------- */
  h('sunnah', { ar: 'بستان السنّة', en: 'Sunnah Garden' }, 81, 1, {
    id: 'sunnah', legacy: ['sunnah-intentions', 'sunnah-pillars'], lessons: 10,
    about: { ar: 'تعلَّم من أحاديث النبي ﷺ الصحيحة.', en: 'Learn from the authentic hadith of the Prophet ﷺ.' },
  }),
  h('sunnah', { ar: 'الأربعون النووية', en: 'An-Nawawi\'s Forty Hadith' }, 'nawawi', 3),
  h('sunnah', { ar: 'الرقاق: أحاديث ترقّق القلب', en: 'Ar-Riqaq: hadith that soften the heart' }, 81, 5),
  h('sunnah', { ar: 'الاعتصام بالكتاب والسنّة', en: 'Holding fast to the Qur\'an and Sunnah' }, 96, 2),
  h('sunnah', { ar: 'الهبة والهدية', en: 'Gifts and giving' }, 51, 1),
  h('sunnah', { ar: 'عيادة المريض', en: 'Visiting the sick' }, 75, 1),

  /* ---------- 6. Islamic Manners ---------- */
  q('manners', 'understand', { ar: 'آداب سورة الحجرات', en: 'The manners of Surah Al-Hujurat' }, ['49']),
  q('manners', 'understand', { ar: 'وصايا لقمان ووصايا سورة الإسراء', en: 'The advice of Luqman and of Surah Al-Isra' }, ['31:12-19', '17:23-39']),
  q('manners', 'understand', { ar: 'عباد الرحمن', en: 'The servants of the Most Compassionate' }, ['25:63-77']),
  q('manners', 'understand', { ar: 'البرّ والإحسان', en: 'Righteousness and kindness' }, ['2:177', '4:36', '2:83', '16:90-97']),
  h('manners', { ar: 'كتاب الأدب', en: 'The Book of Good Manners' }, 78, 6),
  h('manners', { ar: 'الاستئذان والسلام', en: 'Asking permission and greetings' }, 79, 2),
  h('manners', { ar: 'آداب الطعام', en: 'Manners of eating' }, 70, 2),

  /* ---------- 7. Daily Adhkar ---------- */
  q('adhkar', 'recite', { ar: 'أدعية «ربَّنا» في القرآن', en: 'The "Rabbana" supplications of the Qur\'an' },
    ['2:127-128', '2:201', '2:250', '2:286', '3:8-9', '3:16', '3:53', '3:147', '3:191-194', '7:23', '7:89', '7:126', '10:85-86', '14:38', '14:40-41', '18:10', '23:109', '25:65', '25:74', '40:7-9', '59:10', '60:4-5', '66:8']),
  q('adhkar', 'recite', { ar: 'أذكار قرآنية: آية الكرسي والمعوِّذات', en: 'Qur\'anic adhkar: Ayat al-Kursi and the protecting surahs' }, ['2:255', '2:285-286', '59:22-24', '112', '113', '114']),
  q('adhkar', 'understand', { ar: 'أدعية الأنبياء في القرآن', en: 'Supplications of the prophets in the Qur\'an' }, ['21:83-90', '20:25-35', '26:83-89', '71:26-28', '12:101']),
  q('adhkar', 'understand', { ar: 'فضل الذكر والدعاء في القرآن', en: 'The virtue of remembrance and supplication in the Qur\'an' }, ['33:41-44', '13:28', '2:152', '62:9-10', '7:205', '3:190-194', '18:23-24', '18:39', '40:60', '2:186']),
  h('adhkar', { ar: 'كتاب الدعوات', en: 'The Book of Supplications' }, 80, 4),
  h('adhkar', { ar: 'التهجّد وذكر الليل', en: 'Night prayer and remembrance' }, 19, 2),

  /* ---------- 8. Prayer Learning ---------- */
  q('prayer', 'understand', { ar: 'آيات الصلاة في القرآن', en: 'Ayat about prayer in the Qur\'an' }, ['2:238-239', '4:103', '11:114', '17:78-79', '20:14', '20:132', '29:45', '62:9-11', '23:1-11', '107']),
  q('prayer', 'understand', { ar: 'الطهارة والقبلة في القرآن', en: 'Purification and the qiblah in the Qur\'an' }, ['5:6', '4:43', '9:108', '2:142-150']),
  h('prayer', { ar: 'الوضوء', en: 'Wudu' }, 4, 3),
  h('prayer', { ar: 'كتاب الصلاة', en: 'The Book of Prayer' }, 8, 3),
  h('prayer', { ar: 'مواقيت الصلاة', en: 'The times of prayer' }, 9, 2),
  h('prayer', { ar: 'الأذان وصلاة الجماعة', en: 'The adhan and praying together' }, 10, 4),
  h('prayer', { ar: 'صلاة الجمعة والعيدين', en: 'Friday and Eid prayers' }, 11, 2),

  /* ---------- 9. Islamic History ---------- */
  q('history', 'understand', { ar: 'بداية الوحي ونشأة النبي ﷺ', en: 'The first revelation and the early life of the Prophet ﷺ' }, ['96:1-5', '74:1-7', '93', '94', '105', '106']),
  q('history', 'understand', { ar: 'الإسراء والهجرة', en: 'The Night Journey and the Hijrah' }, ['17:1', '53:1-18', '9:40', '8:30']),
  q('history', 'understand', { ar: 'غزوة بدر في القرآن', en: 'The Battle of Badr in the Qur\'an' }, ['3:121-129', '8:5-19', '8:41-44']),
  q('history', 'understand', { ar: 'غزوة الأحزاب في القرآن', en: 'The Battle of the Confederates in the Qur\'an' }, ['33:9-27']),
  q('history', 'understand', { ar: 'صلح الحديبية وسورة الفتح', en: 'Al-Hudaybiyah and Surah Al-Fath' }, ['48', '110']),
  q('history', 'understand', { ar: 'غزوة أُحد في القرآن', en: 'The Battle of Uhud in the Qur\'an' }, ['3:139-175']),
  q('history', 'understand', { ar: 'حُنين وتبوك في القرآن', en: 'Hunayn and Tabuk in the Qur\'an' }, ['9:25-27', '9:38-41', '9:117-120']),
  h('history', { ar: 'مناقب النبي ﷺ وصفاته', en: 'The merits and character of the Prophet ﷺ' }, 61, 3),
  h('history', { ar: 'فضائل المدينة', en: 'The virtues of Madinah' }, 29, 1),

  /* ---------- 10. Companions ---------- */
  q('companions', 'understand', { ar: 'الصحابة في القرآن', en: 'The Companions in the Qur\'an' }, ['48:18-19', '48:29', '9:100', '59:8-10', '9:117', '33:23', '57:10']),
  q('companions', 'understand', { ar: 'المهاجرون والأنصار في سورة الأنفال', en: 'The Muhajirun and the Ansar in Surah Al-Anfal' }, ['8:62-75']),
  q('companions', 'understand', { ar: 'بيت النبي ﷺ في سورة الأحزاب', en: 'The household of the Prophet ﷺ in Surah Al-Ahzab' }, ['33:21-24', '33:28-35']),
  h('companions', { ar: 'فضائل أصحاب النبي ﷺ', en: 'The virtues of the Companions of the Prophet ﷺ' }, 62, 4),
  h('companions', { ar: 'مناقب الأنصار', en: 'The merits of the Ansar' }, 63, 4),

  /* ---------- 11. Islamic Knowledge ---------- */
  q('knowledge', 'understand', { ar: 'أسماء الله وصفاته في القرآن', en: 'The names and attributes of Allah in the Qur\'an' }, ['59:22-24', '57:1-6', '2:255', '112', '6:59-60']),
  q('knowledge', 'understand', { ar: 'أركان الإيمان في القرآن', en: 'The pillars of faith in the Qur\'an' }, ['2:285', '4:136', '2:177', '35:1', '50:16-18', '82:10-12', '54:49-50']),
  h('knowledge', { ar: 'كتاب الإيمان', en: 'The Book of Faith' }, 2, 1),
  h('knowledge', { ar: 'كتاب العلم', en: 'The Book of Knowledge' }, 3, 1),
  h('knowledge', { ar: 'كتاب التوحيد', en: 'The Book of Tawhid' }, 97, 3),
  h('knowledge', { ar: 'بدء الخلق', en: 'The beginning of creation' }, 59, 2),

  /* ---------- 12. General Islamic Education ---------- */
  q('general', 'understand', { ar: 'رمضان والصيام في القرآن', en: 'Ramadan and fasting in the Qur\'an' }, ['2:183-187', '97']),
  q('general', 'understand', { ar: 'الحج في القرآن', en: 'Hajj in the Qur\'an' }, ['2:196-203', '22:26-37', '3:96-97']),
  q('general', 'understand', { ar: 'الصدقة والإنفاق في القرآن', en: 'Charity and giving in the Qur\'an' }, ['2:261-274', '9:60', '9:103']),
  h('general', { ar: 'كتاب الصوم', en: 'The Book of Fasting' }, 30, 3),
  h('general', { ar: 'كتاب الزكاة', en: 'The Book of Zakah' }, 24, 2),
  h('general', { ar: 'فضائل القرآن', en: 'The virtues of the Qur\'an' }, 66, 2),
];
