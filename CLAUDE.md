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
| `js/monitoring.js` | `Monitoring` | Sentry error monitoring; no-op if the CDN/DSN is missing |
| `js/sync.js` | `Sync` | Debounced cloud save/load to Supabase `user_progress` table |
| `js/content.js` | *(data)* | Curriculum chapters, lessons, glossary |
| `js/questions.js` | *(data)* | Exam question bank (120 questions) |
| `js/gamification.js` | `Gamification` | XP, levels (7 tiers), achievement badges |
| `js/i18n.js` | `i18n` | Spanish/English translations; all UI strings go through this (verified end-to-end 2026-07-04 — onboarding, avatar picker, and the auth screen used to be Spanish-only) |
| `js/avatar.js` | `AvatarSelector` | Tester personality avatar picker |
| `js/onboarding.js` | `Onboarding` | First-run guided tour |

### Views

All views are HTML sections in `index.html` toggled via `display` style. Navigation is handled by `App.navigate(viewName)` — valid names: `dashboard`, `curriculum`, `flashcards`, `simulator`, `glossary`, `progress`, `achievements`, `lesson`.

### Privacy Policy

`privacy.html` is a standalone bilingual (ES/EN) static page — deliberately self-contained (own inline CSS/JS, no `styles.css`, no app modules) so it renders even if the app itself breaks. It reuses the `mycampus_lang`/`mycampus_theme` localStorage keys for a coherent language/theme, and is linked from the auth screen and sidebar footer via the `privacy_link` i18n key. Its claims about data handling (providers, storage region, retention) must stay accurate to the code — update it in the same commit as any change to sync, auth providers, or third-party services. Full detail (controller identity, EU data residency): `AGENTS.md` → "Production Readiness".

### Backend (Supabase)

- Config in `js/config.js` — contains the Supabase URL and anon key.
- The single table used is `user_progress` with columns: `user_id` (UUID), `data` (JSONB), `updated_at` (timestamptz).
- Row Level Security enabled and verified (2026-07-02): `SELECT`/`INSERT`/`UPDATE` policies all scope on `auth.uid() = user_id`, no `DELETE` policy (default-deny).
- Client script pinned to an exact version + SRI hash in `index.html` (not a floating CDN tag) — see `AGENTS.md` for the exact update procedure when bumping it.
- Google OAuth redirect URL is handled and cleaned by `auth.js` to prevent hash pollution in the URL after login.
- Custom SMTP via Brevo (2026-07-07) — the built-in email service's 2/hour cap was blocking real signup confirmations. Full detail: `AGENTS.md` → "Supabase Backend".

### Error Monitoring (Sentry)

`js/monitoring.js` (`Monitoring`) wraps a pinned Sentry Browser SDK CDN bundle (loaded in `<head>`, before supabase-js, so it captures errors from every later script). It is never a hard dependency — same no-op degradation pattern as the Supabase CDN guard — and it never reports email/name, only the Supabase UUID (`Monitoring.identify()`/`clearUser()`, called from `auth.js`). Full detail, including the SRI verification method (documented deviation from the Supabase cross-CDN procedure — Sentry's prebuilt bundles have no second mirror): `AGENTS.md` → "Error Monitoring (Sentry)".

### Offline / Graceful Degradation

The app is fully functional without cloud sync. If Supabase is unavailable or the user is logged out, all state persists in `localStorage`. `Sync` always falls back silently. If the Supabase CDN script itself fails to load, `Auth` shows a clear message instead of crashing (there's no offline login, though — Supabase is required to authenticate at all).

## No Tests, No Linter

There is no test suite and no linter configuration for the application itself. Manual browser testing remains the primary mechanism for UI changes.

Three exceptions, all Node-only dev scripts never served to the browser:
- `scripts/validate-questions.js` gates `js/questions.js` — per-chapter question counts, structural integrity (bilingual fields, 4 options, valid `correct` index, unique ids), traceability (`lo`/`k`/`source` for every question added after id 50).
- `scripts/validate-content.js` gates `CHAPTERS`/`LESSONS`/`GLOSSARY`/`FLASHCARDS` in `js/content.js` — topic counts, `lo`/`source` presence, glossary keyword-completeness against the syllabus.
- `scripts/verify-runtime.js` — behavior harness: loads the real `js/` modules into a mocked minimal DOM (no browser, no npm install) and exercises sync freshness/flush, the script-load guards, the CDN-failure auth screen, `innerHTML` escaping of state-derived values, and i18n parity/residue checks. Run it after any change to `js/` or `index.html`; add a check when you fix a runtime behavior.

Run the relevant one after any change:

```bash
node scripts/validate-questions.js
node scripts/validate-content.js
node scripts/verify-runtime.js
```

The pre-commit gate is version-controlled at `.githooks/pre-commit` — activate it once per clone with `git config core.hooksPath .githooks` (the only per-clone setup this repo has). It validates the **staged** copy of the two data files and runs the runtime harness when `js/` or `index.html` is staged; the commit is blocked on failure.

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

A follow-up audit (separate from the content-fidelity effort above) covered the app's runtime code — `auth.js`/`sync.js` reliability, XSS surface, script-load fragility, validator-script duplication, and i18n completeness. It was then **independently re-audited the same day** (second pass), which confirmed most closures but found two partial and several sibling risks — all fixed the same day. Full findings, verification, and the second-pass addendum: `docs/audit-2026-07-04-architecture-security.md`. Condensed summary: `AGENTS.md`'s "Repository" section. Highlights after both passes:

- `auth.js` no longer lets a stale cloud-state refetch overwrite recent local progress or interrupt an in-progress exam — on any path: the refocus re-emit (first pass) and the initial page load (second pass, via `_updatedAt` freshness stamps in `sync.js`, newest copy wins). A pending debounced save is flushed when the tab is hidden/closed.
- No `innerHTML` sink is fed unescaped user-controllable data: the avatar `<img>` (first pass) plus activity log and exam history from `App.state` (second pass, `escapeHtml()`).
- A failed load of the Supabase CDN script, `config.js`, or any other required script shows a clear message instead of crashing — and the auth screen stays functional (language switcher, form handlers) in that state.
- `i18n` covers the whole app — onboarding, avatar picker, and auth screen were Spanish-only before the first pass; the second pass caught the surviving hardcoded residues (logout label, tooltips, streak toast, name fallback, glossary chapter tag). 160 keys, ES/EN paired, enforced by `scripts/verify-runtime.js`.
- The pre-commit hook is version-controlled (`.githooks/`) and validates staged content; a new runtime harness (`scripts/verify-runtime.js`) makes the behavior fixes re-verifiable on any clone.

## Production Readiness — Status

Both items from the 2026-07-04 conversation are resolved as of 2026-07-07. **Error monitoring (Sentry free tier): DONE** — see "Error Monitoring (Sentry)" above. **Signup rate-limiting/captcha review: DONE, resolved to soft launch** — the dashboard audit found native rate limits adequate and caught a real blocker (built-in email service capped at 2/hour with "Confirm email" on, meaning real signups couldn't confirm), fixed via custom SMTP (Brevo) — see "Backend (Supabase)" above. Captcha (Cloudflare Turnstile) was deliberately **not** added — the plan's own gate says a soft launch doesn't need it. Full detail and the decision gate: `docs/superpowers/plans/2026-07-04-monitoring-and-signup-abuse.md`; current status summary: `AGENTS.md` → "Production Readiness — Status & Next Session".

## UI/UX Polish & Flashcard Carousel Animation (2026-07-07)

A round of user-reported usability fixes, all in `css/styles.css` unless noted, full detail in
`AGENTS.md`'s "Repository" and "Architecture" sections:

- **Sidebar clipped on short viewports:** on screens/windows short enough that the sidebar's
  content (header + user card + nav + footer) exceeded the viewport height, the footer — streak
  counter, **Salir**/logout button, privacy link — became unreachable, with no scrollbar to get
  to it. Fixed by constraining `.sidebar` to a real `height: 100vh` (was `min-height`, which
  doesn't force a fixed size) so the nav list correctly scrolls internally instead, plus a
  scroll fallback on the sidebar itself for extreme cases. Applies to both desktop and the
  `≤768px` mobile drawer.
- **Progress view title spacing:** "Mi Progreso" had no margin below it, unlike every other
  view's header — added.
- **Flashcards carousel animation:** clicking the prev/next arrows now slides the current card
  out and the next one in from the opposite side (50px + fade, 250ms/phase), instead of an
  instant content swap — independent of the existing 3D flip. Design, plan, and full mechanism
  detail: `docs/superpowers/specs/2026-07-07-flashcard-carousel-animation-design.md`,
  `docs/superpowers/plans/2026-07-07-flashcard-carousel-animation.md`, `AGENTS.md` → "Flashcard
  Carousel Animation". Built via subagent-driven-development; task review and final
  whole-branch review both came back clean (no Critical/Important findings). Verified by 12 new
  checks in `scripts/verify-runtime.js` (`N10`).

## Global Search Dropdown (2026-07-08)

The topbar's global search box no longer forces navigation to the glossary/curriculum while
typing (it used to break the user's context and could knock down an in-progress exam screen):
it now opens a results dropdown (glossary terms expandable in place, plus lesson matches), and
only navigates on an explicit click — blocked with a toast if an exam is active
(`App._examActive`). Design: `docs/superpowers/specs/2026-07-08-global-search-dropdown-design.md`;
full detail: `AGENTS.md` → "Global Search Dropdown". Verified by the `N11` checks in
`scripts/verify-runtime.js`, plus manual verification in a real Chromium browser (Playwright)
on 2026-07-08 — which caught a real defect the mocked-DOM harness couldn't: the panel's "click
outside closes it" listener used `e.target.closest()`, which broke because expanding a term
replaces the panel's `innerHTML` mid-click and detaches the original target before the event
reaches `document`; fixed with `e.composedPath()` (unaffected by that mutation) plus a static
regression check in `scripts/verify-runtime.js` (full mechanism in `AGENTS.md`).
