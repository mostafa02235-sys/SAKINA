// Lessons for Sunnah Garden. Content rules are described in docs/CONTENT.md.

export const SUNNAH_LESSONS = [
  {
    id: 'sunnah-intentions',
    objective: { ar: 'أن تعرف معنى السنّة وحديث «إنما الأعمال بالنيات».', en: 'Know what the Sunnah is and the hadith \"Actions are only by intentions\".' },
    level: 1,
    title: { ar: 'النيّة أوّلًا', en: 'Intentions first' },
    steps: [
      {
        type: 'talk', who: 'raccoon', mood: 'curious',
        text: { ar: 'مستر قطّوط، ما معنى «السنّة»؟', en: 'Mr. Qattout, what does "the Sunnah" mean?' },
      },
      {
        type: 'talk', who: 'cat', mood: 'happy',
        text: {
          ar: 'السنّة هي طريقة نبيّنا محمد ﷺ: ما قاله، وما فعله، وما أقرّه. ونتعلّمها من الأحاديث الصحيحة.',
          en: 'The Sunnah is the way of our Prophet Muhammad ﷺ: what he said, what he did, and what he approved of. We learn it from authentic hadith.',
        },
      },
      {
        type: 'source', kind: 'hadith',
        intro: { ar: 'قال رسول الله ﷺ:', en: 'The Messenger of Allah ﷺ said:' },
        arabic: ['إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى'],
        meaning: { en: 'Actions are only by intentions, and each person will have only what they intended.' },
        reference: {
          ar: 'صحيح البخاري ١ (وهذا لفظه)، وهو في صحيح مسلم ١٩٠٧ — عن عمر بن الخطاب رضي الله عنه',
          en: 'Sahih al-Bukhari 1 (this wording); also in Sahih Muslim 1907 — narrated by Umar ibn al-Khattab (may Allah be pleased with him)',
        },
        note: { ar: 'هذا جزء من الحديث.', en: 'This is the opening part of the hadith.' },
      },
      {
        type: 'talk', who: 'cat', mood: 'calm',
        text: {
          ar: 'النيّة هي ما تقصده في قلبك. فحين تعمل خيرًا، اجعل قصدك أن يرضى الله عنك.',
          en: 'An intention (niyyah) is what you mean in your heart. When you do something good, do it to please Allah.',
        },
      },
      {
        type: 'quiz',
        question: { ar: 'ما هي السنّة؟', en: 'What is the Sunnah?' },
        options: [
          { ar: 'طريقة النبي ﷺ: أقواله وأفعاله وما أقرّه', en: 'The way of the Prophet ﷺ: his words, actions and approvals' },
          { ar: 'اسم سورة في القرآن', en: 'The name of a surah in the Qur\'an' },
          { ar: 'اسم شهر من الشهور', en: 'The name of a month' },
        ],
        answer: 0,
        why: { ar: 'السنّة هي طريقة النبي ﷺ.', en: 'The Sunnah is the way of the Prophet ﷺ.' },
      },
      {
        type: 'quiz',
        question: { ar: 'أين تكون النيّة؟', en: 'Where is the intention?' },
        options: [
          { ar: 'في اليد', en: 'In the hand' },
          { ar: 'في القلب', en: 'In the heart' },
          { ar: 'على الورق', en: 'On paper' },
        ],
        answer: 1,
        why: { ar: 'النيّة ما تقصده في قلبك.', en: 'The intention is what you mean in your heart.' },
      },
      {
        type: 'quiz',
        question: { ar: 'أكمل الحديث: «إنما الأعمال بـ…»', en: 'Complete the hadith: "Actions are only by …"' },
        options: [
          { ar: 'الأشكال', en: 'appearances' },
          { ar: 'الأقوال', en: 'words' },
          { ar: 'النيّات', en: 'intentions' },
        ],
        answer: 2,
        why: { ar: 'صحيح البخاري ١.', en: 'Sahih al-Bukhari 1.' },
      },
      {
        type: 'quiz', tf: true,
        question: { ar: 'صحيح أم خطأ؟', en: 'True or false?' },
        statement: { ar: 'النيّة تكون في القلب.', en: 'The intention is in the heart.' },
        options: [{ ar: 'صحيح', en: 'True' }, { ar: 'خطأ', en: 'False' }],
        answer: 0,
        why: { ar: 'النيّة ما تقصده في قلبك.', en: 'The intention is what you mean in your heart.' },
      },
    ],
  },

  {
    id: 'sunnah-pillars',
    objective: { ar: 'أن تعرف أركان الإسلام الخمسة من حديث ابن عمر رضي الله عنهما.', en: 'Know the five pillars of Islam from the hadith of Ibn Umar.' },
    level: 1,
    title: { ar: 'أركان الإسلام الخمسة', en: 'The five pillars of Islam' },
    steps: [
      {
        type: 'talk', who: 'raccoon', mood: 'happy',
        text: {
          ar: 'كلّ بناء قويّ يقوم على أعمدة. والإسلام مبنيّ على خمسة أركان!',
          en: 'Every strong building stands on pillars. Islam is built on five!',
        },
      },
      {
        type: 'source', kind: 'hadith',
        intro: { ar: 'قال رسول الله ﷺ:', en: 'The Messenger of Allah ﷺ said:' },
        arabic: [
          'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ',
        ],
        meaning: {
          en: 'Islam is built on five: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing the prayer, giving zakah, the Hajj, and fasting Ramadan.',
        },
        reference: {
          ar: 'صحيح البخاري ٨ وصحيح مسلم ١٦ — عن عبد الله بن عمر رضي الله عنهما',
          en: 'Sahih al-Bukhari 8 and Sahih Muslim 16 — narrated by Abdullah ibn Umar (may Allah be pleased with them both)',
        },
      },
      {
        type: 'talk', who: 'cat', mood: 'happy',
        text: {
          ar: 'إذن الأركان خمسة: الشهادتان، والصلاة، والزكاة، وصوم رمضان، والحجّ لمن استطاع.',
          en: 'So the pillars are five: the two testimonies of faith, the prayer, zakah, fasting Ramadan, and Hajj for those who are able.',
        },
      },
      {
        type: 'quiz',
        question: { ar: 'كم عدد أركان الإسلام؟', en: 'How many pillars does Islam have?' },
        options: [{ ar: '٣', en: '3' }, { ar: '٥', en: '5' }, { ar: '٧', en: '7' }],
        answer: 1,
        why: { ar: '«بُني الإسلام على خمس».', en: '"Islam is built on five."' },
      },
      {
        type: 'quiz',
        question: { ar: 'ما الركن الأوّل من أركان الإسلام؟', en: 'What is the first pillar of Islam?' },
        options: [
          { ar: 'الشهادتان', en: 'The two testimonies of faith' },
          { ar: 'الحجّ', en: 'Hajj' },
          { ar: 'الزكاة', en: 'Zakah' },
        ],
        answer: 0,
        why: {
          ar: 'أن نشهد أن لا إله إلا الله وأن محمدًا رسول الله.',
          en: 'To testify that there is no god but Allah and that Muhammad is the Messenger of Allah.',
        },
      },
      {
        type: 'quiz',
        question: { ar: 'في أيّ شهر نصوم؟', en: 'In which month do we fast?' },
        options: [
          { ar: 'شوّال', en: 'Shawwal' },
          { ar: 'محرّم', en: 'Muharram' },
          { ar: 'رمضان', en: 'Ramadan' },
        ],
        answer: 2,
        why: { ar: 'صوم رمضان ركن من أركان الإسلام.', en: 'Fasting Ramadan is one of the pillars of Islam.' },
      },
      {
        type: 'quiz',
        question: { ar: 'أيّ هذه ليس من أركان الإسلام الخمسة؟', en: 'Which of these is not one of the five pillars?' },
        options: [
          { ar: 'إقام الصلاة', en: 'Establishing the prayer' },
          { ar: 'الذهاب إلى السوق', en: 'Going to the market' },
          { ar: 'إيتاء الزكاة', en: 'Giving zakah' },
        ],
        answer: 1,
        why: {
          ar: 'الأركان: الشهادتان، الصلاة، الزكاة، صوم رمضان، الحجّ.',
          en: 'The pillars: the testimonies, prayer, zakah, fasting Ramadan, and Hajj.',
        },
      },
      {
        type: 'quiz', tf: true,
        question: { ar: 'صحيح أم خطأ؟', en: 'True or false?' },
        statement: { ar: 'أركان الإسلام سبعة.', en: 'Islam has seven pillars.' },
        options: [{ ar: 'صحيح', en: 'True' }, { ar: 'خطأ', en: 'False' }],
        answer: 1,
        why: { ar: '«بُني الإسلام على خمس».', en: '"Islam is built on five."' },
      },
    ],
  },
];
