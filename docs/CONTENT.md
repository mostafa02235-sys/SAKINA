# Islamic content: sources and rules

SAKINA teaches the Qur'an and the Sunnah, so no religious text in the app is
written by the developers or by an AI. Every ayah, meaning and hadith is copied
word for word from a published source by `tools/build-content.mjs`.

## Sources

| What | Source | Licence / terms |
| --- | --- | --- |
| Qur'an text (Hafs, standard spelling with full vowel marks) | Tanzil Project, tanzil.net, via github.com/risan/quran-json | CC BY 3.0; verbatim copies only, credit and link to tanzil.net |
| Surah names, order, ayah counts, Makkan/Madinan | Tanzil Project metadata | same |
| Arabic meanings | At-Tafsir al-Muyassar, King Fahd Complex, via github.com/spa5k/tafsir_api | credited in the app |
| English meanings | Rowwad Translation Center, QuranEnc.com, version 1.0.19 | QuranEnc terms: unmodified, credited, version stated |
| Hadith | Sahih al-Bukhari and an-Nawawi's Forty, Arabic text as published on sunnah.com, via github.com/AhmedBaset/hadith-json | credited in the app |

The app shows these credits on the Profile screen under "About our sources".

## What the build tool does and does not do

- It **selects and groups** texts according to `tools/curriculum.mjs`
  (which surahs, ayah ranges or hadith books each island teaches).
- It **never writes or changes** an ayah, a tafsir line, a translation or a hadith.
- The basmala that Tanzil places before ayah 1 of a surah is shown on its own
  line, because it is not part of that ayah.
- Bukhari hadith are cited by **collection and book** (for example "Sahih
  al-Bukhari, Book of Good Manners"). The dataset's running index does not match
  the standard hadith numbering, so no hadith number is shown for them.
  An-Nawawi's Forty uses its own well-known numbering (1–42).

## How exercises are made

`src/systems/engine.js` builds every question from the lesson's own texts:
completing an ayah or hadith, choosing the next ayah, matching an ayah to its
meaning, true/false about order, and questions from the mushaf's own data (surah
order, ayah counts). Wrong options are other real ayat or hadith from the same
island. Ayat that repeat within a surah are not used for order questions.

What Mr. Raccoon and Mr. Qattout say is framing only ("let's memorise…"), and
is labelled "explains" on screen.

## What has and has not been reviewed

Checked automatically on every build and test run:
- 234 islands, each with 10–15 lessons; all names and titles unique.
- Every lesson has source text, at least one multiple-choice and one
  true/false question, distinct options and a reference.

**Not yet reviewed by a qualified teacher — please do this before public release:**
1. **Hadith selection (about 600 lessons).** Hadith were chosen automatically:
   only from chosen books of Sahih al-Bukhari, short, with the Prophet's ﷺ
   words quoted, and with a filter that leaves out subjects unsuited to young
   children. A filter is not a teacher: some chosen texts are fragments of a
   longer narration or need context.
2. **Thematic ayah ranges.** The ranges for prophets' stories, history and
   manners were chosen by the developer; a few may start or end an ayah early
   or late for their theme.
3. **An-Nawawi's Forty** includes hadith that an-Nawawi graded hasan as well as
   sahih; each text states its own source at the end.
4. **English hadith meanings are not included** (no translation with clear
   reuse terms was available). English mode shows the Arabic text.
5. **Prayer Learning** teaches ayat and hadith about prayer; it does not yet
   teach the steps of wudu and salah as a how-to. That needs lessons written
   and checked by a teacher.
6. The five hand-written lessons from Phase 1 (see the review log below).

## Rules for anyone adding content

1. Never type an ayah or hadith from memory, and never let a tool generate one.
   Add it to `tools/curriculum.mjs` and let the build copy it from the source.
2. Hand-written explanation goes in `talk` steps only, never inside a source card.
3. Respectful language: ﷺ after the Prophet's name, "peace be upon him" for
   prophets and angels, "may Allah be pleased with him/her" for Companions.
4. The characters and the player's avatar are learners. They never give rulings
   and are never shown as prophets or Companions.

## Rebuilding the content

```
git clone --depth 1 https://github.com/risan/quran-json
git clone --depth 1 --filter=blob:none --sparse https://github.com/spa5k/tafsir_api    # then: git sparse-checkout set tafsir/ar-tafsir-muyassar
git clone --depth 1 --filter=blob:none --sparse https://github.com/AhmedBaset/hadith-json  # then: git sparse-checkout set db/by_book
node tools/build-content.mjs quran-json tafsir_api hadith-json
```

Built from: quran-json 6523a9a, tafsir_api eb82bb6, hadith-json 70b83d6.

## Review log for the hand-written lessons (Phase 1)

Text checked against a published source on 2026-11-12.

| Lesson | Content | Checked against |
| --- | --- | --- |
| quran-fatiha | Al-Fatiha 1–7 | Uthmani Hafs text (words match; the app uses standard spelling) |
| quran-ikhlas | Al-Ikhlas 1–4 | King Saud University Qur'an project |
| quran-meet | Sahih al-Bukhari 5027 | sunnah.com |
| quran-ikhlas | Sahih al-Bukhari 5013 | hadithunlocked.com |
| sunnah-intentions | Sahih al-Bukhari 1 | en.tohed.com; Muslim 1907 has a slightly different wording |
| sunnah-pillars | Sahih al-Bukhari 8 | sunnah.com |
