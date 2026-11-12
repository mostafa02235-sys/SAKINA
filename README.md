# SAKINA · سكينة

An interactive world for learning the Qur'an and the authentic Sunnah.
Zad the raccoon and Lulu the cat travel between floating islands; each island
is a place of learning, and new islands open as lessons are completed.

## Run it

SAKINA is a plain web app: no install and no build step.

- **On your computer:** in this folder run `python3 -m http.server 8000`, then
  open <http://localhost:8000>. (Opening `index.html` by double-click will not
  work, because browsers block JavaScript modules from `file://`.)
- **Online, free:** on GitHub open *Settings → Pages*, choose *Deploy from a
  branch*, pick `main` and `/ (root)`. The app appears at
  `https://<your-username>.github.io/SAKINA/`.

## What is built (milestone 1)

- The world map: five floating islands, a trail between them, locked /
  coming-soon states, and a "continue" button that knows the next lesson.
- Zad and Lulu, drawn in code as original SVG characters with five expressions
  and idle animation.
- Friends screen: fur and marking colours, outfits, accessories (unlocked by
  stars) and expression preview for each character.
- Lessons: explanation, Qur'an and hadith source cards, quizzes with feedback,
  1–3 stars per lesson, wrong answers repeated once.
- Progression: lessons open in order, finishing an island opens the next,
  stars unlock rewards and raise the player's level, day streak.
- Arabic (right-to-left) and English, switchable at any time.
- Progress saved on the device.

Content so far: Qur'an Island (3 lessons) and Sunnah Garden (2 lessons).
The other three islands are visible as "coming soon".

## Where things live

```
index.html              the single page
assets/                 app icon
docs/CONTENT.md         rules for Qur'an and hadith content — read before adding lessons
src/
  main.js               starts the app, lists the screens
  core/                 save data, navigation, language, small helpers
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
5. Android packaging.
