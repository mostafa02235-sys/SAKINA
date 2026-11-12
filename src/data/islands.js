// The floating islands of SAKINA, in the order the player travels through them.
//
// To add an island: add an entry here, write its lessons in data/lessons/,
// and (optionally) draw a landmark for it in world/landmarks.js.
// An island with `planned: true` is shown in the sky as "coming soon".

import { QURAN_LESSONS } from './lessons/quran.js';
import { SUNNAH_LESSONS } from './lessons/sunnah.js';

export const ISLANDS = [
  {
    id: 'quran',
    name: { ar: 'جزيرة القرآن', en: 'Qur\'an Island' },
    about: { ar: 'تعرَّف على كتاب الله وسوره القصيرة.', en: 'Get to know the Book of Allah and its short surahs.' },
    landmark: 'academy',
    colors: { grass: '#6fcf7c', grassDeep: '#3fa863', rock: '#8a6fb0', rockDeep: '#5f4a86' },
    lessons: QURAN_LESSONS,
  },
  {
    id: 'sunnah',
    name: { ar: 'بستان السنّة', en: 'Sunnah Garden' },
    about: { ar: 'تعلَّم من أحاديث النبي ﷺ الصحيحة.', en: 'Learn from the authentic hadith of the Prophet ﷺ.' },
    landmark: 'garden',
    colors: { grass: '#9ad36a', grassDeep: '#5faf4e', rock: '#b9815a', rockDeep: '#8a5a3c' },
    lessons: SUNNAH_LESSONS,
  },
  {
    id: 'prophets',
    name: { ar: 'واحة الأنبياء', en: 'Oasis of the Prophets' },
    about: { ar: 'قصص الأنبياء عليهم السلام.', en: 'Stories of the prophets, peace be upon them.' },
    landmark: 'oasis',
    colors: { grass: '#f2cf7a', grassDeep: '#d9a84c', rock: '#c98a6b', rockDeep: '#99604a' },
    lessons: [],
    planned: true,
  },
  {
    id: 'daily',
    name: { ar: 'ينابيع يوم المسلم', en: 'Daily Life Springs' },
    about: { ar: 'الوضوء والصلاة وآداب اليوم.', en: 'Wudu, prayer and everyday manners.' },
    landmark: 'spring',
    colors: { grass: '#7fd6c2', grassDeep: '#45a996', rock: '#6f8fc0', rockDeep: '#4a6696' },
    lessons: [],
    planned: true,
  },
  {
    id: 'knowledge',
    name: { ar: 'منارة العلم', en: 'Lighthouse of Knowledge' },
    about: { ar: 'تاريخ الإسلام وعلومه.', en: 'Islamic history and knowledge.' },
    landmark: 'lighthouse',
    colors: { grass: '#b7a6e8', grassDeep: '#8a74cf', rock: '#70608f', rockDeep: '#4c3f68' },
    lessons: [],
    planned: true,
  },
];

export function findIsland(id) {
  return ISLANDS.find((island) => island.id === id);
}

export function findLesson(lessonId) {
  for (const island of ISLANDS) {
    const index = island.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index !== -1) return { island, lesson: island.lessons[index], index };
  }
  return null;
}
