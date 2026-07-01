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
| `js/questions.js` | *(data)* | Exam question bank (120 questions) |
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

There is no test suite and no linter configuration for the application itself. Manual browser testing is the only testing mechanism for UI/behavior changes.

The one exception is `scripts/validate-questions.js`, a Node-only dev script (never served to the browser) that gates edits to `js/questions.js`. It checks: per-chapter question counts against the target distribution, structural integrity (bilingual fields, 4 options, valid `correct` index, unique ids), and traceability (`lo`/`k`/`source` present for every question added after id 50). Run it after any change to the question bank:

```bash
node scripts/validate-questions.js
```

## ISTQB Content Fidelity Effort (in progress)

The question bank, lessons, and glossary are being brought into closer alignment with the official **ISTQB CTFL v4.0 syllabus**, in three phases. Full design and rationale: `docs/superpowers/specs/2026-07-01-content-and-question-bank-expansion-design.md`.

**Ground rule for this effort:** every new/changed piece of ISTQB content (question, lesson fact, glossary term) must cite a `source` traceable to official material (syllabus PDF, official sample exams) — never invent exam content.

| Phase | Status | Summary |
|-------|--------|---------|
| 1. Question bank (50 → 120) | ✅ Done (merged to `master`) | `js/questions.js` expanded to 120 questions matching official exam-weight distribution per chapter (24/18/12/36/24/6). Every question added has `lo` (learning-objective code), `k` (cognitive level), `source`. Plan: `docs/superpowers/plans/2026-07-01-phase1-question-bank.md`. |
| 2. Lesson content audit | ⏳ Not started | Audit the 28 lessons in `js/content.js` against the syllabus; add `lo`/`source` fields to `CHAPTERS` topics; add a lesson-source footer in the UI. See spec §"Fase 2". |
| 3. Glossary expansion | ⏳ Not started | Expand `GLOSSARY` in `js/content.js` with official syllabus keywords; add `source` per term. See spec §"Fase 3". |

**Known minor gaps from Phase 1** (non-blocking, worth revisiting in a future content pass):
- Chapter 4 (Test Analysis & Design) is light on boundary-value-analysis questions (only 1, reusing the "1–100" domain already used by a pre-existing question) — consider adding 1–2 more with a different domain.
- Learning objective FL-2.1.2 (SDLC good practices) has no dedicated question, only a mention folded into another question's explanation.

**To resume this effort:** brainstorm/plan Phase 2 next, following the same spec → plan → `superpowers:subagent-driven-development` workflow used for Phase 1 (one implementer + one reviewer subagent per chapter/task, reviewer independently re-verifies content against the syllabus text, not just internal consistency).
