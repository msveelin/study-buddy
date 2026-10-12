# Study Buddy

A local web app that teaches a complete beginner, in order:

| # | Course | Lessons | What it covers |
|---|--------|---------|----------------|
| 1 | **Using the Computer** 🖥️ | 12 | Parts of a computer, turning it on and off, the desktop, windows, programs, what to do when stuck. Reading + quizzes. |
| 2 | **Mouse Basics** 🖱️ | 12 | Point, click, double-click, right-click, drag, scroll, select text, menus and window buttons, as little games in a built-in mouse trainer. |
| 3 | **Keyboard & Touch Typing** ⌨️ | 26 | Finger-by-finger practice with a live on-screen keyboard, speed and accuracy targets, plus the universal keyboard shortcuts (Ctrl+C/V/Z/S...) with a shortcut trainer. |
| 4 | **Files and Folders** 📁 | 11 | Files, folders, extensions, Documents/Downloads, USB and cloud, practised in a pretend File Explorer (new folder, rename, cut/copy/paste, drag, Recycle Bin, search). |
| 5 | **Internet and Email** 🌍 | 15 | Browser parts, searching well, email, passwords, scams and safe downloads, practised in a pretend browser and a pretend inbox (including a spot-the-phishing exercise). |
| 6 | **Settings and Housekeeping** ⚙️ | 12 | Wallpaper, text size, brightness, Wi-Fi, keyboard language, uninstalling junk programs, Windows Update and printers, in a pretend Settings app. |
| 7 | **Microsoft Word Basics** 📝 | 13 | How real Word works, plus a built-in practice editor that imitates the Word toolbar and checks each task. |
| 8 | **Excel Basics** 📊 | 9 | Cells, formulas (SUM, AVERAGE, MAX...), formatting and a budget project in a pretend spreadsheet with a working formula engine. |
| 9 | **Introduction to Programming** 💻 | 17 | JavaScript in a built-in code playground with automatic output checks and beginner-friendly error messages. |
| 10 | **Web Development** 🌐 | 28 | HTML, CSS and JavaScript in a live-preview playground with automatic checks. |

Beginner helpers built into the app:

- **Welcome tour** on first visit (and again from the Help page).
- **Help & Glossary** page: 100+ plain-language definitions with search, a guide to common icons and buttons, a shortcut cheat sheet, and "how to use this site".
- **Bigger text** switch (welcome page and Help page).
- **Read aloud** button on every reading lesson, using the browser's built-in voice.
- **"First time on a computer?"** steps on the welcome page.

Progress (completed lessons, quiz scores, typing speed history) is saved in a local MySQL database.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 20 (standalone components, signals), Apollo Angular, marked, Lucide icons (inline SVG via `core/icon.ts`) |
| API | Django 5.0 + graphene-django (GraphQL at `http://127.0.0.1:8000/graphql/`) |
| Database | MySQL/MariaDB from XAMPP 8.2 (`C:\xampp`), database `study_buddy`, user `root`, no password |

Django is pinned to 5.0.x on purpose: XAMPP 8.2 ships MariaDB 10.4, and Django 5.1+ refuses anything older than MariaDB 10.5.

## Running it

Double-click **`run.bat`**. It does everything in one go:

1. starts MySQL from XAMPP if it is not already running (and waits for it),
2. on a fresh machine, creates the Python environment and installs the web packages,
3. creates the database if missing, applies migrations and reloads the course content,
4. starts the Django API and the Angular app in two minimised windows,
5. waits for the app to compile, then opens <http://localhost:4200> in your browser.

Double-click **`stop.bat`** to shut all three down again. (`start-all.cmd` and the single `start-*.cmd` scripts still work if you prefer separate windows.)

Or start the pieces yourself:

```bash
start-mysql.cmd      # MySQL from XAMPP (or use the XAMPP Control Panel)
start-backend.cmd    # Django on http://127.0.0.1:8000
start-frontend.cmd   # Angular on http://localhost:4200
```

Close the windows to stop everything. Progress stays in the database.

## First-time setup (already done on this machine)

```bash
# backend
cd backend
python -m venv venv
venv\Scripts\pip install -r requirements.txt
venv\Scripts\python manage.py createdb      # creates the study_buddy database
venv\Scripts\python manage.py migrate
venv\Scripts\python manage.py seed          # loads all course content

# frontend
cd ../frontend
npm install
```

## Editing the lessons

All course content is plain Python data in `backend/learning/content/`:

- `computer_course.py`, `mouse_course.py`, `typing_course.py`, `files_course.py`, `internet_course.py`,
  `settings_course.py`, `word_course.py`, `excel_course.py`, `programming_course.py`, `webdev_course.py`
- `practice.py` (flashcards, extra questions and exercises for the Practice page)

The course order is the `COURSES` list in `content/__init__.py`. After editing, run `venv\Scripts\python manage.py seed` again. Lessons are matched by `slug`, so learner progress is kept.

Lesson kinds and the `data` each one expects (every practice kind takes `tasks[{instruction, check}]` and ticks each task off as the learner does it):

| kind | data |
|------|------|
| `reading` | none (markdown in `content`) |
| `typing` | `text`, `keys`, `targetWpm`, `targetAccuracy` |
| `quiz` | `passScore`, `questions[{q, options, answer, explain}]` |
| `mouse` | `tasks[{type, ...}]` – types: `hover`, `click`, `doubleClick`, `rightClick {menuItem}`, `drag`, `scroll`, `selectText {text}`, `menu {menu, item}`, `window`, each with an optional `count` |
| `shortcuts` | `combos[{keys, name}]` for the key trainer, **or** `editor {text, tasks}` for copy/paste practice – checks: `countOccurrences`, `textIncludes`, `textEquals` |
| `files` | `fs` (nested dict: folder = dict, file = `"file"`), `bin[{name, from}]`, `tasks` – checks: `exists {path, kind}`, `notExists`, `inBin {name}`, `notInBin`, `binEmpty`, `opened {path}`, `visited {path}` |
| `browser` | `sites {url: {title, body (markdown), keywords}}`, `home`, `tasks` – checks: `visited {url}`, `onPage`, `tabsAtLeast {n}`, `searched {includes}`, `bookmarked {url}`, `wentBack`, `closedTab {url}`, `refreshed` |
| `email` | `account`, `contacts`, `files`, `inbox[{id, from, address, subject, body, date}]`, `tasks` – checks: `sent {to, subjectIncludes, minWords, attachment, replyTo}`, `opened {id}`, `spam {id}`, `notSpam {id}`, `deleted {id}`, `starred {id}` |
| `settings` | `tasks` – checks: `wallpaper {value}`, `theme {value}`, `brightnessMin {value}`, `textScale {value}`, `nightLight`, `wifiOn`, `wifi {ssid}`, `language {value}`, `autoTime`, `uninstalled {app}`, `notUninstalled {app}`, `checkedUpdates`, `updated`, `printerAdded {name}`, `printerDefault {name}` |
| `sheet` | `cells {A1: value}`, `tasks` – checks: `cellEquals {cell, value}`, `cellFormula {cell, includes}`, `cellBold`, `cellItalic`, `cellFill`, `cellFilled`, `cellNumber`, `rangeFilled {range}`. Formulas: `+ - * / ( )`, cell refs, `SUM`, `AVERAGE`, `MIN`, `MAX`, `COUNT` over ranges |
| `word` | `starterHtml`, `tasks` – checks: `containsText`, `notContainsText`, `containsTextAny`, `minWords`, `style`, `tag`, `list`, `anyStyle` |
| `code` | `starter`, `solution`, `tests[{type, value}]` – `outputIncludes`, `outputEquals`, `outputLines`, `outputMatches` |
| `web` | `html`, `css`, `js`, `checks[{type, label, ...}]` – `textIncludes`, `count`, `attr`, `attrExists`, `css`, `clickThen`, `typeClickThen` |

The glossary and icon guide on the Help page live in `frontend/src/app/core/glossary.ts`; the tour steps are in `frontend/src/app/core/tour.ts`.

## Practice: flashcards, quizzes, tests and exercises

The **Practice** page (sidebar, or `/practice`) is for memory jogging after a lesson:

- **Flashcards** use spaced repetition (Leitner boxes). "Got it" moves a card up a box and it comes back later (1, 3, 7, then 30 days); "Not yet" sends it back to box 1 and to the end of the session. Box 5 counts as mastered.
- **Quick quiz**: 8 random questions from the course's question bank with an instant explanation after each answer.
- **Test**: 15 random questions against the clock (45 s each), no feedback until you submit, 80% to pass.
- **Exercises**: short tasks in the same typing / Word / code / web playgrounds as the lessons.

All of it is plain data in `backend/learning/content/practice.py`, keyed by course slug, using the `card()`, `q()` and `*_ex()` helpers at the top of that file. Every lesson quiz's questions are added to the question bank automatically. Run `venv\Scripts\python manage.py seed` after editing; cards and questions are matched by `key`, so review history is kept. `manage.py test learning` runs the practice tests.

## Useful URLs

- App: <http://localhost:4200>
- Help & Glossary: <http://localhost:4200/help>
- GraphiQL explorer: <http://127.0.0.1:8000/graphql/>
- Django admin: <http://127.0.0.1:8000/admin/> (create a user first with `manage.py createsuperuser`)
- phpMyAdmin: start Apache from the XAMPP Control Panel, then <http://localhost/phpmyadmin>

## Project layout

```
backend/
  config/            Django settings and URLs
  learning/
    models.py        Learner, Course, Module, Lesson, LessonProgress, TypingAttempt, practice models
    schema.py        GraphQL queries and mutations
    content/         all lesson content + practice.py
    management/commands/  createdb, seed
frontend/
  src/app/
    core/            GraphQL client, learner session, markdown pipe, prefs (big text, tour), glossary, read-aloud, tour
    pages/           welcome, dashboard, course, lesson, help, practice
    lessons/         typing-trainer, quiz, word-editor, code-playground, web-playground,
                     mouse-trainer, shortcut-trainer, file-explorer, browser-sim, email-sim, settings-sim, sheet-editor
```
