# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyCampus ISTQB is a browser-based study platform for the ISTQB Certified Tester Foundation Level (CTFL) v4.0 certification. It is a **vanilla JavaScript SPA** — no framework, no build system, no package manager.

## Running the Project

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

There is no build step. No `npm install`, no compilation.

## Architecture

### Module Pattern

Each feature is a singleton object exposed as a global variable. All modules follow the same pattern: a plain object with an `init()` method and private helpers prefixed with `_`. Modules communicate through the global `App` object.

### State & Data Flow

```
User Action → App.* method → mutate App.state → App.saveState()
                                                   ├─→ localStorage (immediate)
                                                   └─→ Sync.saveState() (4s debounce → Supabase)
```

`App.state` is the single source of truth. All views read from it directly. On page load, state is restored from localStorage first, then optionally overwritten by the cloud copy if the user is authenticated.

### Key Modules

| File | Module | Responsibility |
|------|--------|----------------|
| `js/app.js` | `App` | Main controller: state, navigation, view rendering |
| `js/auth.js` | `Auth` | Supabase auth (email + Google OAuth), session handling |
| `js/sync.js` | `Sync` | Debounced cloud save/load to Supabase `user_progress` table |
| `js/content.js` | *(data)* | Curriculum chapters, lessons, glossary |
| `js/questions.js` | *(data)* | Exam question bank (100+ questions) |
| `js/gamification.js` | `Gamification` | XP, levels (7 tiers), achievement badges |
| `js/i18n.js` | `i18n` | Spanish/English translations; all UI strings go through this |
| `js/avatar.js` | `AvatarSelector` | Tester personality avatar picker |
| `js/onboarding.js` | `Onboarding` | First-run guided tour |

### Views

All views are HTML sections in `index.html` toggled via `display` style. Navigation is handled by `App.navigate(viewName)` — valid names: `dashboard`, `curriculum`, `flashcards`, `simulator`, `glossary`, `progress`, `achievements`, `lesson`.

### Backend (Supabase)

- Config in `js/config.js` — contains the Supabase URL and anon key.
- The single table used is `user_progress` with columns: `user_id` (UUID), `data` (JSONB), `updated_at` (timestamptz).
- Row Level Security must be enabled in Supabase so users can only access their own row.
- Google OAuth redirect URL is handled and cleaned by `auth.js` to prevent hash pollution in the URL after login.

### Offline / Graceful Degradation

The app is fully functional without cloud sync. If Supabase is unavailable or the user is logged out, all state persists in `localStorage`. `Sync` always falls back silently.

## No Tests, No Linter

There is no test suite and no linter configuration. Manual browser testing is the only testing mechanism.
