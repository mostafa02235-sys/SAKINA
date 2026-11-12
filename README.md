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

**Phase 1**
- The world map: five floating islands, a trail between them, locked /
  coming-soon states, and a "continue" button that knows the next lesson.
- Zad the raccoon and Lulu the cat, drawn in code as original SVG characters.
- Lessons: explanation, Qur'an and hadith source cards, quizzes with feedback,
  1–3 stars per lesson, wrong answers repeated once.
- Progression: lessons open in order, finishing an island opens the next,
  stars unlock rewards and raise the player's level, day streak.
- Arabic (right-to-left) and English, switchable at any time.

**Phase 2**
- A real Android app with icon, splash screen, Back-button handling and an
  automatic signed APK build.
- Zad and Lulu walk between islands; tapping an island sends them there
  before entering it. The sky moves with depth as the map scrolls, screens
  zoom in and out as you go deeper or back, and each island's sign shows one
  dot per lesson.
- Walking animation and eight expressions: happy, curious, surprised,
  cheering, calm, sad, angry, oops.
- Friends screen: changes preview instantly, **Save look** keeps them and
  **Restore** undoes unsaved changes or brings back the previous saved look.
  Swipe the stage to switch character.
- Save system: progress, looks, position on the map and preferences are kept
  on the device, with a backup copy and recovery from a damaged save.
- Loading screen, error screen, "less motion" and vibration preferences,
  layouts checked from 320 px phones to tablets.

Content so far: Qur'an Island (3 lessons) and Sunnah Garden (2 lessons).
The other three islands are visible as "coming soon".

## Where things live

```
index.html              the single page, with the loading screen
assets/                 app icon (fonts are added here by the build)
android/                the Android app project that packs all of this into an APK
.github/workflows/      the automatic APK build
docs/CONTENT.md         rules for Qur'an and hadith content — read before adding lessons
src/
  main.js               starts the app, lists the screens
  core/                 save data, navigation, language, motion and vibration, small helpers
  data/
    islands.js          the islands and their order
    lessons/            lesson content, one file per island
    wardrobe.js         colours, outfits, accessories, character names
    strings.js          every interface word in Arabic and English
  systems/progress.js   all unlock, star and level rules
  characters/           how Zad and Lulu are drawn
  world/                how islands and their landmarks are drawn
  components/           tab bar, top strip, icons, toast
  screens/              world, island, lesson, friends, journey
  styles/               tokens.css holds every colour and size; one file per screen
```

## Common changes

- **Add a lesson:** add an object to the island's file in `src/data/lessons/`.
  Follow `docs/CONTENT.md`.
- **Open a coming-soon island:** write its lessons, attach them in
  `src/data/islands.js`, and remove `planned: true`.
- **Rename a character or add colours:** `src/data/wardrobe.js`.
- **Change the look:** `src/styles/tokens.css`.
- **Add an outfit or accessory:** draw it in `src/characters/parts.js`, list it
  in `src/data/wardrobe.js`.

## Next milestones

1. Content for the Oasis of the Prophets, Daily Life Springs and the Lighthouse
   of Knowledge, reviewed by a qualified teacher.
2. Audio recitation for ayat, from a licensed reciter recording.
3. More lesson types: matching, ordering ayat, listening.
4. Accounts and cloud sync so progress follows the player between devices.
5. A private signing key and a Google Play listing (see `android/signing/README.md`).
