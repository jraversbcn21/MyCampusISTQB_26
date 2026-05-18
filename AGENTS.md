# AGENTS.md

## Project Overview

MyCampus ISTQB is a **vanilla JavaScript SPA** — no framework, no build system, no package manager. Browser-based study platform for ISTQB CTFL v4.0.

## Running

Open `index.html` in a browser, or serve statically:

```bash
python -m http.server 8000
# → http://localhost:8000
```

No `npm install`, no compilation, no build step.

## Architecture

### Script Load Order (Critical)

Scripts are loaded sequentially in `index.html` (lines 464–473). Each exposes a global that later scripts depend on:

```
config.js → i18n.js → content.js → questions.js → gamification.js → app.js → onboarding.js → avatar.js → sync.js → auth.js
```

**Do not reorder these.** Earlier modules are dependencies of later ones.

### Module Pattern

Every module is a **global singleton object**. Naming is inconsistent:

| Global | File | Notes |
|--------|------|-------|
| `App` | `js/app.js` | Main controller. Also holds `_expandedChapters` (Set), `_currentCard` (TTS), `currentLesson` |
| `Auth` | `js/auth.js` | Entry point on DOMContentLoaded |
| `Sync` | `js/sync.js` | Cloud sync (4s debounce) |
| `Gamification` | `js/gamification.js` | XP, levels, badges |
| `AvatarSelector` | `js/avatar.js` | Avatar picker |
| `Onboarding` | `js/onboarding.js` | First-run tour |
| `i18n` | `js/i18n.js` | **lowercase** — not `I18n` |
| *(data)* | `js/content.js` | Chapters, lessons, glossary |
| *(data)* | `js/questions.js` | 100+ exam questions |

All modules follow the same pattern: a plain object with an `init()` method and private helpers prefixed with `_`.

### Entry Point

`Auth.init()` is called on `DOMContentLoaded`. On successful auth, it calls `App.init()`.

### State & Data Flow

```
User Action → App.* method → mutate App.state → App.saveState()
                                                   ├→ localStorage (immediate)
                                                   └→ Sync.saveState() (4s debounce → Supabase)
```

`App.state` is the single source of truth. Views read from it directly.

### i18n

- `i18n.t(key)` in JS code
- `data-i18n="key"` for text content in HTML
- `data-i18n-placeholder="key"` for input placeholders
- Default language is Spanish (`i18n.lang = 'es'`)
- Translations defined in `TRANSLATIONS` object in `js/i18n.js`

### Views

HTML sections in `index.html` toggled by `App.navigate(viewName)`. Valid names:

`dashboard`, `curriculum`, `lesson`, `flashcards`, `simulator`, `glossary`, `progress`, `achievements`

### Flashcard TTS

Each flashcard has a mute/unmute button (🔇/🔊) on both question and answer sides, positioned at bottom-right via CSS. Uses the native **Web Speech API** (SpeechSynthesis) — no external libraries.

- `App._handleTTS(side, e)` — toggles speech for question/answer; calls `e.stopPropagation()` to prevent card flip
- `App._setVoice(utterance, voices, langCode)` — selects female voice matching active language (ES/EN), with fallbacks: female match → any language match → system default
- `App.renderFlashcard()` stores card text in `this._currentCard` and renders TTS buttons via `innerHTML`
- `App.flipFlashcard()` cancels speech and resets all TTS buttons
- CSS: `.fc-tts-btn` (absolute, bottom-right), `.fc-tts-playing` (green pulse animation via `@keyframes fc-tts-pulse`)

### Curriculum Expanded State

Chapters stay expanded when navigating to a lesson and back via `App._expandedChapters` (a `Set` of chapter indices).

- `App.toggleChapter(i)` — adds/removes chapter index from `_expandedChapters`
- `App.navigateToLesson()` — adds the chapter to `_expandedChapters` before rendering
- `App.renderCurriculum()` — restores `open` class on chapters in the set after HTML rebuild

### View Persistence

Saves current view to `localStorage` key `mycampus_current_view`. Restores on init.

- `App._saveCurrentView(view)` — serializes view name, lesson data, and expanded chapters to JSON
- `App._restoreSavedView()` — reads and parses saved view; returns `null` on error/missing
- `App.init()` — calls `_restoreSavedView()`, restores lesson with topic, falls back to `'dashboard'`
- `App.navigateToLesson()` — sets `this.currentView = 'lesson'` (critical for post-sync re-navigation)
- `App.navigate()` — handles `'lesson'` view by calling `renderLesson()` with stored `currentLesson`
- `auth.js` line 113, 117 — `App.navigate(App.currentView || 'dashboard')` instead of hardcoded `'dashboard'`

### Sidebar Badge Fix

Empty `.nav-badge` elements (e.g., `#curriculumBadge`) are hidden via CSS: `.nav-badge:empty { display: none; }`

### Supabase Backend

- Credentials in `js/config.js` (anon key — public, safe to commit)
- Table: `user_progress` (`user_id` UUID, `data` JSONB, `updated_at` timestamptz)
- RLS must be enabled so users can only access their own row
- Supabase client loaded from CDN in `index.html` line 8

### Offline

Fully functional without cloud sync. Falls back silently to localStorage.

## Conventions

- Private methods/helpers: prefix with `_` (e.g., `_onAuthSuccess`)
- Initial hidden elements use inline `style="display:none"` (not a CSS class)
- Single CSS file: `css/styles.css`
- All inline onclick handlers use global function calls (e.g., `onclick="App.navigate('curriculum')"`)

## No Tests or Linter

Manual browser testing only. There is no test suite, no linter config, no type checking.

## Reference Materials

The `ISTQB 2026/` folder contains official ISTQB PDFs (syllabus, sample exams). Not part of the application code — do not modify.
