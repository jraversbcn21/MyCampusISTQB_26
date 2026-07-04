# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyCampus ISTQB is a browser-based study platform for the ISTQB Certified Tester Foundation Level (CTFL) v4.0 certification. It is a **vanilla JavaScript SPA** — no framework, no build system, no package manager.

**Repo:** https://github.com/jraversbcn21/MyCampusISTQB_26 — public, default branch `master`, no CI/PR workflow (direct commits). Full repo/GitHub notes, security posture, and the 2026-07-02 git-history rewrite (all commit hashes changed that day) are documented in `AGENTS.md` — read that first if you need any pre-2026-07-02 commit reference.

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
| `js/i18n.js` | `i18n` | Spanish/English translations; all UI strings go through this (verified end-to-end 2026-07-04 — onboarding, avatar picker, and the auth screen used to be Spanish-only) |
| `js/avatar.js` | `AvatarSelector` | Tester personality avatar picker |
| `js/onboarding.js` | `Onboarding` | First-run guided tour |

### Views

All views are HTML sections in `index.html` toggled via `display` style. Navigation is handled by `App.navigate(viewName)` — valid names: `dashboard`, `curriculum`, `flashcards`, `simulator`, `glossary`, `progress`, `achievements`, `lesson`.

### Backend (Supabase)

- Config in `js/config.js` — contains the Supabase URL and anon key.
- The single table used is `user_progress` with columns: `user_id` (UUID), `data` (JSONB), `updated_at` (timestamptz).
- Row Level Security enabled and verified (2026-07-02): `SELECT`/`INSERT`/`UPDATE` policies all scope on `auth.uid() = user_id`, no `DELETE` policy (default-deny).
- Client script pinned to an exact version + SRI hash in `index.html` (not a floating CDN tag) — see `AGENTS.md` for the exact update procedure when bumping it.
- Google OAuth redirect URL is handled and cleaned by `auth.js` to prevent hash pollution in the URL after login.

### Offline / Graceful Degradation

The app is fully functional without cloud sync. If Supabase is unavailable or the user is logged out, all state persists in `localStorage`. `Sync` always falls back silently. If the Supabase CDN script itself fails to load, `Auth` shows a clear message instead of crashing (there's no offline login, though — Supabase is required to authenticate at all).

## No Tests, No Linter

There is no test suite and no linter configuration for the application itself. Manual browser testing is the only testing mechanism for UI/behavior changes.

Two exceptions, both Node-only dev scripts never served to the browser:
- `scripts/validate-questions.js` gates `js/questions.js` — per-chapter question counts, structural integrity (bilingual fields, 4 options, valid `correct` index, unique ids), traceability (`lo`/`k`/`source` for every question added after id 50).
- `scripts/validate-content.js` gates `CHAPTERS`/`LESSONS`/`GLOSSARY`/`FLASHCARDS` in `js/content.js` — topic counts, `lo`/`source` presence, glossary keyword-completeness against the syllabus.

Run the relevant one after any change to that file:

```bash
node scripts/validate-questions.js
node scripts/validate-content.js
```

Since 2026-07-04 a local `.git/hooks/pre-commit` runs the relevant script automatically when its file is staged and blocks the commit on failure — but it's **not version-controlled**, so a fresh clone of this repo won't have it until someone sets it up again.

## ISTQB Content Fidelity Effort (complete, all 3 phases merged)

The question bank, lessons, and glossary were brought into closer alignment with the official **ISTQB CTFL v4.0 syllabus**, in three phases, all merged to `master`. Full design: `docs/superpowers/specs/2026-07-01-content-and-question-bank-expansion-design.md`. Full per-phase detail (known corrections, real errors found and fixed, remaining minor gaps) lives in `AGENTS.md` and `docs/content-audit-report.md` — this section is intentionally a summary only, to avoid the two files drifting out of sync with each other.

**Ground rule for this effort:** every new/changed piece of ISTQB content (question, lesson fact, glossary term) must cite a `source` traceable to official material (syllabus PDF, official sample exams) — never invent exam content. This rule is still active for any future content work.

| Phase | Status | Summary |
|-------|--------|---------|
| 1. Question bank (50 → 120) | ✅ Done | `js/questions.js`, 120 questions matching official exam-weight distribution (24/18/12/36/24/6). Every question added has `lo`/`k`/`source`. |
| 2. Lesson content audit | ✅ Done | All 22 lessons in `js/content.js` audited against the syllabus; every topic has `lo`/`source`; every lesson has a `.lesson-source` footer. Real errors found and fixed (test-level count, review roles, a non-syllabus technique, a non-official tool taxonomy) — detail in `AGENTS.md`. Gate: `node scripts/validate-content.js`. |
| 3. Glossary expansion | ✅ Done | `GLOSSARY` expanded to 107 terms, all 97/97 official v4.0 keywords covered. `FLASHCARDS` swept term-by-term for v4.0 fidelity. `GLOSSARY.term` is `{es, en}`, not a plain string. |

Known non-blocking gaps (light BVA question coverage in Ch.4, no dedicated question for FL-2.1.2) are tracked in `AGENTS.md`, not repeated here.

## Reliability & Security Remediation Pass (2026-07-04)

A follow-up audit (separate from the content-fidelity effort above) covered the app's runtime code — `auth.js`/`sync.js` reliability, XSS surface, script-load fragility, validator-script duplication, and i18n completeness. Full findings and how each was verified: `docs/audit-2026-07-04-architecture-security.md`. Condensed summary, in case you only need the "what changed" version: `AGENTS.md`'s "Repository" section. Highlights:

- `auth.js` no longer lets a stale cloud-state refetch overwrite recent local progress or interrupt an in-progress exam, no longer builds the avatar `<img>` via `innerHTML` (was a self-XSS vector through `avatar_url`), and shows a clear message instead of crashing if the Supabase CDN script or any other required script fails to load.
- `i18n` now actually covers the whole app — onboarding, the avatar picker, and the auth screen were Spanish-only before this pass, despite the "Key Modules" table above already claiming full i18n coverage.
- A local (unversioned) pre-commit hook now runs the content validators automatically instead of that being a manual step.
