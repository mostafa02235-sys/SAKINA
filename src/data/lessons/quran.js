// Lessons for Qur'an Island.
//
// CONTENT RULES (see docs/CONTENT.md):
//  - Qur'an text follows the Hafs reading, written in standard (imla'i) spelling with full
//    vowel marks, and is checked word for word against a published mushaf text before release.
//  - Every hadith carries its collection and number.
//  - "talk" steps are our own educational explanation and are labelled as such on screen.
//  - English lines under ayat are a plain rendering of the meaning, not a formal translation.

const HAFS = { ar: 'رواية حفص عن عاصم', en: 'Hafs reading' };

export const QURAN_LESSONS = [
  {
    id: 'quran-meet',
    title: { ar: 'تعرَّف على القرآن', en: 'Meet the Qur\'an' },
    steps: [
      {
        type: 'talk', who: 'raccoon', mood: 'curious',
        text: {
          ar: 'لولو، ما هذا الكتاب المنير الذي يحبّه كلّ من في الجزيرة؟',
          en: 'Lulu, what is this glowing book that everyone on the island loves?',
        },
      },
      {
        type: 'talk', who: 'cat', mood: 'happy',
        text: {
          ar: 'إنه القرآن الكريم، كلام الله تعالى. أنزله الله على نبيّنا محمد ﷺ بواسطة جبريل عليه السلام، باللغة العربية.',
          en: 'It is the Qur\'an, the word of Allah. Allah revealed it to our Prophet Muhammad ﷺ through the angel Jibril (peace be upon him), in the Arabic language.',
        },
      },
      {
        type: 'talk', who: 'cat', mood: 'happy',
        text: {
          ar: 'في القرآن ١١٤ سورة. أوّلها سورة الفاتحة، وآخرها سورة الناس.',
          en: 'The Qur\'an has 114 surahs. The first is Surah Al-Fatiha and the last is Surah An-Nas.',
        },
      },
      {
        type: 'source', kind: 'hadith',
        intro: { ar: 'قال رسول الله ﷺ:', en: 'The Messenger of Allah ﷺ said:' },
        arabic: ['خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ'],
        meaning: { en: 'The best of you are those who learn the Qur\'an and teach it.' },
        reference: {
          ar: 'صحيح البخاري ٥٠٢٧ — عن عثمان بن عفان رضي الله عنه',
          en: 'Sahih al-Bukhari 5027 — narrated by Uthman ibn Affan (may Allah be pleased with him)',
        },
      },
      {
        type: 'quiz',
        question: { ar: 'كم عدد سور القرآن الكريم؟', en: 'How many surahs are in the Qur\'an?' },
        options: [{ ar: '٣٠', en: '30' }, { ar: '١١٤', en: '114' }, { ar: '٩٩', en: '99' }],
        answer: 1,
        why: {
          ar: 'في القرآن ١١٤ سورة، وهو مقسَّم إلى ٣٠ جزءًا.',
          en: 'The Qur\'an has 114 surahs. It is also divided into 30 parts (juz\').',
        },
      },
      {
        type: 'quiz',
        question: { ar: 'ما أوّل سورة في المصحف؟', en: 'Which surah comes first in the mushaf?' },
        options: [
          { ar: 'سورة الناس', en: 'Surah An-Nas' },
          { ar: 'سورة الإخلاص', en: 'Surah Al-Ikhlas' },
          { ar: 'سورة الفاتحة', en: 'Surah Al-Fatiha' },
        ],
        answer: 2,
        why: { ar: 'الفاتحة هي أوّل سورة، والناس هي آخر سورة.', en: 'Al-Fatiha is the first surah and An-Nas is the last.' },
      },
      {
        type: 'quiz',
        question: { ar: 'بأيّ لغة نزل القرآن الكريم؟', en: 'In which language was the Qur\'an revealed?' },
        options: [{ ar: 'العربية', en: 'Arabic' }, { ar: 'الفارسية', en: 'Persian' }, { ar: 'التركية', en: 'Turkish' }],
        answer: 0,
        why: { ar: 'نزل القرآن باللغة العربية.', en: 'The Qur\'an was revealed in Arabic.' },
      },
      {
        type: 'quiz',
        question: {
          ar: 'أكمل الحديث: «خيركم من تعلّم القرآن و…»',
          en: 'Complete the hadith: "The best of you are those who learn the Qur\'an and …"',
        },
        options: [
          { ar: 'علَّمه', en: 'teach it' },
          { ar: 'كتبه فقط', en: 'only write it down' },
          { ar: 'احتفظ به لنفسه', en: 'keep it to themselves' },
        ],
        answer: 0,
        why: {
          ar: 'نتعلّم القرآن ثم نعلّمه لغيرنا. (صحيح البخاري ٥٠٢٧)',
          en: 'We learn the Qur\'an and then share it with others. (Sahih al-Bukhari 5027)',
        },
      },
    ],
  },

  {
    id: 'quran-fatiha',
    title: { ar: 'سورة الفاتحة', en: 'Surah Al-Fatiha' },
    steps: [
      {
        type: 'talk', who: 'raccoon', mood: 'happy',
        text: {
          ar: 'الفاتحة معناها «الافتتاح»، فهي أوّل سورة في المصحف، ونقرؤها في صلاتنا كلّ يوم.',
          en: 'Al-Fatiha means "The Opening". It is the first surah in the mushaf, and we recite it in our prayers every day.',
        },
      },
      {
        type: 'source', kind: 'quran',
        arabic: [
          'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
          'الرَّحْمَٰنِ الرَّحِيمِ',
          'مَالِكِ يَوْمِ الدِّينِ',
          'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
          'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
          'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        ],
        firstAyah: 1,
        meaning: {
          en: 'In the name of Allah, the Most Compassionate, the Most Merciful. All praise is for Allah, Lord of all the worlds. The Most Compassionate, the Most Merciful. Master of the Day of Judgement. You alone we worship, and You alone we ask for help. Guide us to the straight path: the path of those You have blessed, not of those who earned anger, nor of those who went astray.',
        },
        reference: { ar: 'سورة الفاتحة، الآيات ١–٧', en: 'Surah Al-Fatiha (1), ayat 1–7' },
        reading: HAFS,
      },
      {
        type: 'talk', who: 'cat', mood: 'calm',
        text: {
          ar: 'في الفاتحة سبع آيات. نحمد الله فيها، ونقول له إننا نعبده وحده، ونسأله أن يهدينا الصراط المستقيم.',
          en: 'Al-Fatiha has seven ayat. In it we praise Allah, tell Him that we worship Him alone, and ask Him to guide us to the straight path.',
        },
      },
      {
        type: 'quiz',
        question: { ar: 'كم عدد آيات سورة الفاتحة؟', en: 'How many ayat are in Surah Al-Fatiha?' },
        options: [{ ar: '٥', en: '5' }, { ar: '٧', en: '7' }, { ar: '١٠', en: '10' }],
        answer: 1,
        why: { ar: 'سورة الفاتحة سبع آيات.', en: 'Surah Al-Fatiha has seven ayat.' },
      },
      {
        type: 'quiz',
        question: { ar: 'ما معنى اسم «الفاتحة»؟', en: 'What does the name "Al-Fatiha" mean?' },
        options: [
          { ar: 'الافتتاح', en: 'The Opening' },
          { ar: 'النور', en: 'The Light' },
          { ar: 'الفجر', en: 'The Dawn' },
        ],
        answer: 0,
        why: { ar: 'سُمّيت الفاتحة لأن المصحف يُفتتح بها.', en: 'It is called Al-Fatiha because the mushaf opens with it.' },
      },
      {
        type: 'quiz',
        question: { ar: 'أكمل الآية:', en: 'Complete the ayah:' },
        prompt: 'الْحَمْدُ لِلَّهِ رَبِّ …',
        scripture: true,
        options: ['النَّاسِ', 'الْعَالَمِينَ', 'الْفَلَقِ'],
        answer: 1,
        why: { ar: 'سورة الفاتحة، الآية ٢.', en: 'Surah Al-Fatiha, ayah 2.' },
      },
      {
        type: 'quiz',
        question: { ar: 'ماذا نطلب من الله في هذه الآية؟', en: 'What do we ask Allah for in this ayah?' },
        prompt: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        options: [
          { ar: 'مالًا كثيرًا', en: 'Great wealth' },
          { ar: 'سفرًا طويلًا', en: 'A long journey' },
          { ar: 'الهداية إلى الطريق المستقيم', en: 'Guidance to the straight path' },
        ],
        answer: 2,
        why: { ar: 'سورة الفاتحة، الآية ٦.', en: 'Surah Al-Fatiha, ayah 6.' },
      },
    ],
  },

  {
    id: 'quran-ikhlas',
    title: { ar: 'سورة الإخلاص', en: 'Surah Al-Ikhlas' },
    steps: [
      {
        type: 'talk', who: 'cat', mood: 'happy',
        text: {
          ar: 'سورة الإخلاص قصيرة، أربع آيات فقط، لكن معناها عظيم: الله واحد لا شريك له.',
          en: 'Surah Al-Ikhlas is short, only four ayat, but its meaning is immense: Allah is One, with no partner.',
        },
      },
      {
        type: 'source', kind: 'quran',
        arabic: [
          'قُلْ هُوَ اللَّهُ أَحَدٌ',
          'اللَّهُ الصَّمَدُ',
          'لَمْ يَلِدْ وَلَمْ يُولَدْ',
          'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        ],
        firstAyah: 1,
        meaning: {
          en: 'Say: He is Allah, the One. Allah, the Eternal Refuge on whom all depend. He does not beget, nor was He begotten. And there is none comparable to Him.',
        },
        reference: { ar: 'سورة الإخلاص، الآيات ١–٤', en: 'Surah Al-Ikhlas (112), ayat 1–4' },
        reading: HAFS,
      },
      {
        type: 'source', kind: 'hadith',
        intro: { ar: 'قال رسول الله ﷺ عن هذه السورة:', en: 'The Messenger of Allah ﷺ said about this surah:' },
        arabic: ['وَالَّذِي نَفْسِي بِيَدِهِ إِنَّهَا لَتَعْدِلُ ثُلُثَ الْقُرْآنِ'],
        meaning: { en: 'By the One in whose hand is my soul, it is equal to one third of the Qur\'an.' },
        reference: {
          ar: 'صحيح البخاري ٥٠١٣ — عن أبي سعيد الخدري رضي الله عنه',
          en: 'Sahih al-Bukhari 5013 — narrated by Abu Sa\'id al-Khudri (may Allah be pleased with him)',
        },
      },
      {
        type: 'quiz',
        question: { ar: 'كم عدد آيات سورة الإخلاص؟', en: 'How many ayat are in Surah Al-Ikhlas?' },
        options: [{ ar: '٣', en: '3' }, { ar: '٤', en: '4' }, { ar: '٦', en: '6' }],
        answer: 1,
        why: { ar: 'سورة الإخلاص أربع آيات.', en: 'Surah Al-Ikhlas has four ayat.' },
      },
      {
        type: 'quiz',
        question: { ar: 'ما أهمّ ما تعلّمنا إيّاه سورة الإخلاص؟', en: 'What is the main lesson of Surah Al-Ikhlas?' },
        options: [
          { ar: 'أن الله واحد لا مثيل له', en: 'Allah is One and nothing is like Him' },
          { ar: 'قصة سفينة نوح عليه السلام', en: 'The story of the ark of Nuh (peace be upon him)' },
          { ar: 'أحكام الصيام', en: 'The rules of fasting' },
        ],
        answer: 0,
        why: { ar: 'السورة كلّها عن توحيد الله تعالى.', en: 'The whole surah is about the oneness of Allah.' },
      },
      {
        type: 'quiz',
        question: { ar: 'أكمل الآية:', en: 'Complete the ayah:' },
        prompt: 'قُلْ هُوَ اللَّهُ …',
        scripture: true,
        options: ['أَحَدٌ', 'الصَّمَدُ', 'كُفُوًا'],
        answer: 0,
        why: { ar: 'سورة الإخلاص، الآية ١.', en: 'Surah Al-Ikhlas, ayah 1.' },
      },
      {
        type: 'quiz',
        question: {
          ar: 'أخبرنا النبي ﷺ أن سورة الإخلاص تعدل…',
          en: 'The Prophet ﷺ told us that Surah Al-Ikhlas is equal to…',
        },
        options: [
          { ar: 'نصف القرآن', en: 'half of the Qur\'an' },
          { ar: 'ثلث القرآن', en: 'a third of the Qur\'an' },
          { ar: 'ربع القرآن', en: 'a quarter of the Qur\'an' },
        ],
        answer: 1,
        why: { ar: 'صحيح البخاري ٥٠١٣.', en: 'Sahih al-Bukhari 5013.' },
      },
    ],
  },
];
