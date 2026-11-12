# SAKINA · سكينة

An interactive world for learning the Qur'an and the authentic Sunnah.
Zad the raccoon and Lulu the cat travel between floating islands; each island
is a place of learning, and new islands open as lessons are completed.

## Install on an Android phone

1. On the phone, open this link in the browser:
   **<https://github.com/mostafa02235-sys/SAKINA/releases/latest/download/SAKINA.apk>**
2. When the download finishes, tap the file (**SAKINA.apk**).
3. The first time, Android asks to allow installs from your browser:
   tap **Settings**, switch on **Allow from this source**, then go back.
4. Tap **Install**. If Play Protect shows a warning about an unknown
   developer, choose **Install anyway** (the app is not on Google Play yet).
5. Open **SAKINA** from the home screen.

To update later, repeat the same steps: the new version installs over the old
one and progress is kept. Works on Android 7.0 and newer.

## How the APK is built

Every change pushed to `main` that touches the app starts the **Build Android
APK** workflow (`.github/workflows/android.yml`). It can also be started by
hand: *Actions → Build Android APK → Run workflow*. When it finishes (about
two minutes) the APK is available in two places:

- **Releases** page: `SAKINA.apk`, the direct download used above.
- The workflow run page, under **Artifacts** (a zip containing the APK).

After each build the workflow also installs the APK on an Android emulator
and checks that it opens, survives the Back button and a full restart, and
still has its saved data (`android/smoke-test.sh`).

The Android project lives in `android/`. It is a small native app that shows
the SAKINA screens from files packed inside the APK, so the app works without
internet. You do not edit anything in `android/` to change the app itself:
change the files in `src/`, push, and the next APK contains the change.

## Run it in a browser (for development)

- **On your computer:** in this folder run `python3 -m http.server 8000`, then
  open <http://localhost:8000>. (Opening `index.html` by double-click will not
  work, because browsers block JavaScript modules from `file://`.)

## What is built

**Phase 1–2:** the floating-island world, Mr. Raccoon and Mr. Qattout as
original characters with expressions and walking, lessons with quizzes and
stars, Arabic and English, a real Android app with an automatic APK build.

**Phase 3**
- **234 islands in 12 worlds**, each island with 10–15 lessons (2,798 lessons).
  Worlds: Qur'an Learning, Memorisation, Understanding, Stories of the Prophets,
  Authentic Sunnah, Manners, Adhkar, Prayer, History, Companions, Knowledge,
  General Education. Worlds and islands unlock as lessons are finished.
- **Verified content:** every ayah, meaning and hadith is copied from a
  published source (see `docs/CONTENT.md`, including what still needs a
  teacher's review).
- **Lesson engine:** goal and difficulty for each lesson, source cards,
  multiple-choice and true/false exercises built from the texts, continue an
  unfinished lesson, review finished ones.
- **My Avatar:** face shapes, skin tones, hairstyles, eyes, expressions,
  outfits including thobe, abaya, hijab, kufi and ghutra, glasses, bags,
  scarves; turn the avatar around, randomise, reset, save. The avatar appears
  on the map, in lessons, on the finish screen and on the profile.
- **Profile:** editable name, level and XP, lessons and islands done, overall
  progress, 15 achievement badges, rewards.
- **Progression:** XP and levels come only from finished lessons; badges and
  unlockable avatar items follow from them.
- Islands differ in colours, underside shape, decoration and one of 18
  landmarks; each world has its own sky.

## Where things live

```
index.html              the single page, with the loading screen
assets/                 app icon (fonts are added here by the build)
content/                generated lesson data: catalog.json + one file per island
tools/                  curriculum.mjs (what each island teaches) and build-content.mjs
android/                the Android app project that packs all of this into an APK
.github/workflows/      the automatic APK build
docs/CONTENT.md         rules for Qur'an and hadith content — read before adding lessons
src/
  main.js               starts the app, lists the screens
  core/                 save data, navigation, language, motion and vibration, small helpers
  data/
    islands.js          loads the catalog and island files (islands load only when opened)
    lessons/            the five hand-written lessons from Phase 1
    avatar.js           every avatar option
    wardrobe.js         colours, outfits, accessories, character names
    strings.js          every interface word in Arabic and English
  systems/progress.js   unlock, star, XP, level and badge rules
  systems/engine.js     builds each lesson's steps and exercises from its texts
  avatar/               how the player's avatar is drawn
  characters/           how Zad and Lulu are drawn
  world/                how islands and their landmarks are drawn
  components/           tab bar, top strip, icons, toast
  screens/              world, island, lesson, avatar, friends, profile
  styles/               tokens.css holds every colour and size; one file per screen
```

## Common changes

- **Add or change islands:** edit `tools/curriculum.mjs`, then rebuild the
  content (commands in `docs/CONTENT.md`). Never type religious text by hand.
- **Rename a character or add colours:** `src/data/wardrobe.js` and the two
  `name.` lines in `src/data/strings.js`.
- **Add an avatar option:** list it in `src/data/avatar.js`, draw it in
  `src/avatar/draw.js`.
- **Change the look:** `src/styles/tokens.css`.

## Next milestones

1. Teacher review of the hadith selection and thematic ranges (`docs/CONTENT.md`).
2. Hand-written, reviewed how-to lessons for wudu and salah.
3. Audio recitation for ayat, from a licensed reciter recording.
4. English meanings for hadith from a source with clear reuse terms.
5. Accounts and cloud sync; a private signing key and a Google Play listing.
