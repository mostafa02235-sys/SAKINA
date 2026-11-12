# Islamic content rules

SAKINA teaches the Qur'an and the Sunnah, so every piece of religious content is
handled with care. These rules apply to everyone who adds or edits a lesson.

## The three kinds of text

Every lesson step is exactly one of these, and the app labels each one on screen:

| Step type | What it is | How it appears |
| --- | --- | --- |
| `source` with `kind: 'quran'` | The words of the Qur'an, unchanged | Green card, surah name and ayah numbers |
| `source` with `kind: 'hadith'` | The words of the Prophet ﷺ from an authentic collection | Brown card, collection and hadith number |
| `talk` | Our own simple explanation, spoken by Zad or Lulu | Speech bubble tagged "explains" |

Never put Qur'an or hadith wording inside a `talk` step, and never put our own
wording inside a `source` step.

## Rules

1. **Qur'an text** follows the Hafs reading, in standard spelling with full vowel
   marks. Copy it from a trusted mushaf source and compare it word for word.
   Never type an ayah from memory and never let a tool generate it.
2. **Hadith** must come from an authentic source and carry the collection name,
   hadith number and narrator. Quote the Arabic wording of the collection you cite.
   If only part of a hadith is quoted, say so in the step's `note`.
3. **Never invent** a narration, a virtue, a story or a ruling. If you cannot
   find a reliable source, leave it out.
4. **Meanings in English** under an ayah are a plain rendering of the meaning and
   are labelled "Meaning". They are not the Qur'an itself.
5. **Respectful language:** ﷺ after the Prophet's name, "peace be upon him" for
   prophets and angels, "may Allah be pleased with him/her" for Companions.
6. **Characters** are learners and friends. They never recite as authorities,
   give rulings, or appear in depictions of prophets or Companions.
7. **Matters scholars differ on** stay out of children's lessons, or are
   presented neutrally after review by a qualified teacher.

## Review log

Text checked against a published source on 2026-11-12. A qualified teacher
should still review every lesson before public release.

| Lesson | Content | Checked against |
| --- | --- | --- |
| quran-fatiha | Al-Fatiha 1–7 | Uthmani Hafs text from the `all-quran` open dataset (words match; the app uses standard spelling) |
| quran-ikhlas | Al-Ikhlas 1–4 | King Saud University Qur'an project (quran.ksu.edu.sa) |
| quran-meet | Sahih al-Bukhari 5027 | sunnah.com |
| quran-ikhlas | Sahih al-Bukhari 5013 | hadithunlocked.com |
| sunnah-intentions | Sahih al-Bukhari 1 | en.tohed.com (Bukhari 1) and sunnah.com (Muslim 1907, which has a slightly different wording) |
| sunnah-pillars | Sahih al-Bukhari 8 | sunnah.com |

Still to be reviewed by a qualified teacher: all explanation (`talk`) text, all
quiz wording, and the English meanings.
