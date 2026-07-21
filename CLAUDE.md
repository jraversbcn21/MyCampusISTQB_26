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

## Production Deployment (Vercel, 2026-07-20)

Live at **https://mycampusistqb.vercel.app** (Vercel project `mycampusistqb`). Deploys are
**manual via the Vercel CLI** (`vercel deploy --prod --yes`) — there is no Git integration,
so pushing to GitHub does not deploy. **`.vercelignore` is load-bearing:** the Vercel CLI
ignores `.gitignore`, and the first deploy briefly exposed the copyrighted `ISTQB 2026/`
PDFs (fixed same-hour: `.vercelignore` + redeploy + deleted the exposed deployment). Never
remove the `ISTQB 2026/` line. `privacy.html` declares Vercel as hosting processor.
Supabase Site URL/Redirect URLs point to the production domain (configured 2026-07-20;
signup + confirmation email + login verified end-to-end on the live URL — note localhost
is no longer allowlisted for OAuth). Full detail (re-linking a clone, Supabase URL config
and its follow-ups): `AGENTS.md` → "Deployment (Vercel)".

## Architecture

### Module Pattern

Each feature is a singleton object exposed as a global variable. All modules follow the same pattern: a plain object with an `init()` method and private helpers prefixed with `_`. Modules communicate through the global `App` object.

### State & Data Flow

```
User Action → App.* method → mutate App.state → App.saveState()
                                                   ├─→ localStorage (immediate)
                                                   └─→ Sync.saveState() (4s debounce → Supabase)
```

`App.state` is the single source of truth. All views read from it directly. On page load, state is restored from localStorage first, then reconciled with the cloud copy if the user is authenticated — the newer `_updatedAt` stamp wins, so a stale cloud copy never clobbers newer local progress (see the 2026-07-04 section).

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

All views are HTML sections in `index.html` toggled via the `.view.active` class (`css/styles.css` does `.view { display: none } / .view.active { display: block }` — nothing sets inline `display` on views). Navigation is handled by `App.navigate(viewName)` — valid names: `dashboard`, `curriculum`, `flashcards`, `simulator`, `glossary`, `progress`, `achievements`, `lesson`.

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

Five exceptions, all Node-only dev scripts never served to the browser:
- `scripts/validate-questions.js` gates `js/questions.js` — per-chapter question counts, structural integrity (bilingual fields, 4 options, valid `correct` index, unique ids), traceability (`lo`/`k`/`source` for every question added after id 50).
- `scripts/validate-content.js` gates `CHAPTERS`/`LESSONS`/`GLOSSARY`/`FLASHCARDS` in `js/content.js` — topic counts, `lo`/`source` presence, glossary keyword-completeness against the syllabus.
- `scripts/verify-runtime.js` — behavior harness: loads the real `js/` modules into a mocked minimal DOM (no browser, no npm install) and exercises sync freshness/flush, the script-load guards, the CDN-failure auth screen, `innerHTML` escaping of state-derived values, and i18n parity/residue checks. Run it after any change to `js/` or `index.html`; add a check when you fix a runtime behavior.
- `scripts/validate-contrast.js` (added 2026-07-14) gates `css/styles.css` — parses the theme token blocks and asserts WCAG AA 4.5:1 for every status-text/background pair in both themes, including `rgba()`-tinted backgrounds alpha-blended over the surface. It cannot see JS-inline text colors (`style="color:..."` set from `js/app.js` templates) — those are covered separately by the `N12` static check in `scripts/verify-runtime.js` (asserts `js/app.js` never sets `color:` to a raw `--success`/`--warning`/`--danger`/`--secondary` token as text). Together the two gate the full surface; run both after any change to theme tokens or status-text colors.
- `scripts/validate-responsive.js` (added 2026-07-21) — the only one needing a real browser: launches Playwright/Chromium at 320/375/414px with touch emulation and asserts zero horizontal overflow across all views, ≥44px touch targets, the exam dot strip's height, the full mobile drawer cycle, and the onboarding tour with its tooltip verified in-viewport at every step. Follows the repo's no-op dependency pattern — if Playwright isn't installed it prints `SKIP: Playwright no disponible` and exits 0. **Deliberately outside the pre-commit hook** (slow, adds a dependency) — run it manually before any release and after any layout change. What it can't see without a browser (the CSS/JS invariants behind the layout) is covered by the `N20`/`N20b`/`N20c` check families in `verify-runtime.js`.

Run the relevant one after any change:

```bash
node scripts/validate-questions.js
node scripts/validate-content.js
node scripts/verify-runtime.js
node scripts/validate-contrast.js
node scripts/validate-responsive.js   # manual pre-release step, not in pre-commit
```

The pre-commit gate is version-controlled at `.githooks/pre-commit` — activate it once per clone with `git config core.hooksPath .githooks` (the only per-clone setup this repo has). It validates the **staged** copy of the three gated files (`js/questions.js`, `js/content.js`, `css/styles.css`) and runs the runtime harness when `js/`, `index.html` or the harness itself is staged; the commit is blocked on failure. `validate-responsive.js` is deliberately not in the hook.

## ISTQB Content Fidelity Effort (complete, all 3 phases merged)

The question bank, lessons, and glossary were brought into closer alignment with the official **ISTQB CTFL v4.0 syllabus**, in three phases, all merged to `master`. Full design: `docs/superpowers/specs/2026-07-01-content-and-question-bank-expansion-design.md`. Full per-phase detail (known corrections, real errors found and fixed, remaining minor gaps) lives in `AGENTS.md` and `docs/content-audit-report.md` — this section is intentionally a summary only, to avoid the two files drifting out of sync with each other.

**Ground rule for this effort:** every new/changed piece of ISTQB content (question, lesson fact, glossary term) must cite a `source` traceable to official material (syllabus PDF, official sample exams) — never invent exam content. This rule is still active for any future content work.

| Phase | Status | Summary |
|-------|--------|---------|
| 1. Question bank (50 → 120) | ✅ Done | `js/questions.js`, 120 questions matching official exam-weight distribution (24/18/12/36/24/6). Every question added has `lo`/`k`/`source`. |
| 2. Lesson content audit | ✅ Done | All 22 lessons in `js/content.js` audited against the syllabus; every topic has `lo`/`source`; every lesson has a `.lesson-source` footer. Real errors found and fixed (test-level count, review roles, a non-syllabus technique, a non-official tool taxonomy) — detail in `AGENTS.md`. Gate: `node scripts/validate-content.js`. |
| 3. Glossary expansion | ✅ Done | `GLOSSARY` expanded to 107 terms, all 97/97 official v4.0 keywords covered. `FLASHCARDS` swept term-by-term for v4.0 fidelity. `GLOSSARY.term` is `{es, en}`, not a plain string. |

The two known minor gaps from Phase 1 (light BVA question coverage in Ch.4, no dedicated question for FL-2.1.2) were closed on 2026-07-14 by replacing three redundant questions (ids 43/17/31 → 121/122/123, all with official `lo`/`k`/`source`) — detail in `AGENTS.md`.

## Reliability & Security Remediation Pass (2026-07-04)

A follow-up audit (separate from the content-fidelity effort above) covered the app's runtime code — `auth.js`/`sync.js` reliability, XSS surface, script-load fragility, validator-script duplication, and i18n completeness. It was then **independently re-audited the same day** (second pass), which confirmed most closures but found two partial and several sibling risks — all fixed the same day. Full findings, verification, and the second-pass addendum: `docs/audit-2026-07-04-architecture-security.md`. Condensed summary: `AGENTS.md`'s "Repository" section. Highlights after both passes:

- `auth.js` no longer lets a stale cloud-state refetch overwrite recent local progress or interrupt an in-progress exam — on any path: the refocus re-emit (first pass) and the initial page load (second pass, via `_updatedAt` freshness stamps in `sync.js`, newest copy wins). A pending debounced save is flushed when the tab is hidden/closed.
- No `innerHTML` sink is fed unescaped user-controllable data: the avatar `<img>` (first pass) plus activity log and exam history from `App.state` (second pass, `escapeHtml()`).
- A failed load of the Supabase CDN script, `config.js`, or any other required script shows a clear message instead of crashing — and the auth screen stays functional (language switcher, form handlers) in that state.
- `i18n` covers the whole app — onboarding, avatar picker, and auth screen were Spanish-only before the first pass; the second pass caught the surviving hardcoded residues (logout label, tooltips, streak toast, name fallback, glossary chapter tag). 160 keys at the time (175 today — see the 2026-07-14 section below), ES/EN paired, enforced by `scripts/verify-runtime.js`.
- The pre-commit hook is version-controlled (`.githooks/`) and validates staged content; a new runtime harness (`scripts/verify-runtime.js`) makes the behavior fixes re-verifiable on any clone.

## Production Readiness — closed 2026-07-07 (pre-launch)

Historical: this was the gate for the 2026-07-20 launch, which has since happened — see
"Production Deployment (Vercel)" above for the live state. Both items from the 2026-07-04
conversation are resolved as of 2026-07-07. **Error monitoring (Sentry free tier): DONE** — see "Error Monitoring (Sentry)" above. **Signup rate-limiting/captcha review: DONE, resolved to soft launch** — the dashboard audit found native rate limits adequate and caught a real blocker (built-in email service capped at 2/hour with "Confirm email" on, meaning real signups couldn't confirm), fixed via custom SMTP (Brevo) — see "Backend (Supabase)" above. Captcha (Cloudflare Turnstile) was deliberately **not** added — the plan's own gate says a soft launch doesn't need it. Full detail and the decision gate: `docs/superpowers/plans/2026-07-04-monitoring-and-signup-abuse.md`; current status summary: `AGENTS.md` → "Production Readiness — closed 2026-07-07 (pre-launch)".

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
  whole-branch review both came back clean (no Critical/Important findings). Verified by the
  `N10` checks in `scripts/verify-runtime.js`.

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

## UI/UX Remediation — ui-ux-pro-max Review (2026-07-14)

A full UI/UX review of the app (done with the `ui-ux-pro-max` skill) produced a prioritized
findings list; four blocks were remediated the same day via subagent-driven-development, each
with its own plan, per-task reviews, a final whole-branch review (all four found and fixed
real issues), and real-browser Playwright verification. **This section is a summary only —
mechanisms, exact hex values, verification evidence, and the complete follow-up lists live in
`AGENTS.md`'s four matching entries and the four plan docs under `docs/superpowers/plans/`.**

| Block | Findings closed | Summary | Gate |
|-------|-----------------|---------|------|
| Contrast | C2 + I1 | Semantic `--success-text`/`--warning-text`/`--danger-text`/`--primary-text` tokens per theme (light-theme status text was 1.27–2.37:1); `--text3` raised to AA in both themes; a fix wave swapped 7 JS-inline text colors the CSS validator couldn't see | `validate-contrast.js` (pre-commit, staged CSS) + `N12` (JS-inline status text) |
| A11y quick wins | I6 + I5 + I4 | `aria-live="polite"` on `#toastContainer` (+ `aria-hidden` on the decorative `#xpPopup`); new `data-i18n-aria` mechanism naming five icon-only controls; four form inputs to 16px (kills iOS focus auto-zoom) | 12 `N13` checks |
| Keyboard operability | C1 | `#themeToggle` → real `<button>`; `role="button" tabindex="0"` on template-rendered divs + ONE delegated document keydown handler; global `:focus-visible`; `selectAnswer` focus restore; flashcard flip made keyboard-operable in the fix wave | 11 `N14` checks |
| Reduced motion | I2 | Global `prefers-reduced-motion` blunt block (durations + delays → 0.01ms `!important`, beats inline styles) + `matchMedia` guard collapsing the carousel's `setTimeout` sequencing | 2 `N15` checks |

**Round 2 (2026-07-15):** everything the review left open — **I3**, **I7**, **I8** and the
per-block recorded follow-ups — was closed in a second round (commits `2df5af2..2ab887d`,
same methodology). Summary: 44px touch targets via a `@media (pointer: coarse)` block
(touch only — desktop visuals unchanged); mobile global search (`#mobileSearchBtn` + a
full-width `.search-box.mobile-open` bar under the topbar, reusing the same
`#globalSearch` and its JS) plus a complete ARIA combobox pattern for the dropdown
(arrows/Enter/Escape, `aria-activedescendant`, no wrap, two-phase Enter on glossary
terms); an inline SVG sprite of `#i-*` symbols + `App._icon(name)` replacing every
structural emoji (26 at the time, 27 today with `#i-coffee`; decorative emojis that stay
carry `aria-hidden`); and the minor
follow-ups (avatar modal as a keyboard-operable `dialog`, `aria-expanded` on chapter
headers and `#mobileMenuBtn`, roving tabindex + `aria-current` on exam dots, assertive
`warning`/`error` toasts, new `--secondary-text` token as an extra
`validate-contrast.js` pair). New gates: the `N16`/`N16b`, `N17` and `N18` check
families in `scripts/verify-runtime.js`. Full mechanisms and evidence: `AGENTS.md` →
"UI/UX remediation ronda 2 (2026-07-15)", plus the spec/plan pair
`docs/superpowers/specs/2026-07-15-uiux-remediation-round2-design.md` /
`docs/superpowers/plans/2026-07-15-uiux-remediation-round2.md`.

**Editing constraints an agent must know (load-bearing):**

- The tail of `css/styles.css` is ordered on purpose — today: the `≤480px` tier, then
  `@media (pointer: coarse)`, then the reduced-motion block, then `:focus-visible`
  **literally last** (it must win the `outline` property over earlier equal-specificity
  `outline: none` input rules). Don't append CSS after it without reading those blocks'
  comments. See the Mobile Adaptability section below for the tier's own cascade caveat.
- New interactive elements in `innerHTML` templates: give them `role="button" tabindex="0"`
  — the delegated keydown listener in `App.init()` makes them keyboard-operable
  automatically; never add per-element key listeners (the templates are regenerated
  constantly).
- New icon-only controls: name them with `data-i18n-aria="key"` (the fourth i18n attribute
  mechanism — see `AGENTS.md` → "i18n").
- Structural icons: use the `#i-*` inline sprite in `index.html` (static HTML:
  `<svg class="icon" aria-hidden="true"><use href="#i-name"/></svg>`) or `App._icon(name)`
  in JS templates — do not reintroduce emojis as UI icons (the `N17` gate blocks it).
  Decorative emojis that stay must carry `aria-hidden`.
- Status-feedback text colors: use the `--*-text` tokens (or the `.text-success`/`.text-warning`/
  `.text-danger` utilities), never the raw `--success`/`--warning`/`--danger` tokens as text —
  the two-part gate blocks the commit otherwise.
- `TRANSLATIONS` currently has **175 keys** (ES/EN paired, harness-enforced). The two most
  recent additions were `achievement_toast_prefix` (round-2 final-review fix for the last
  hardcoded "Logro:" toast residue in `js/app.js`) and `bmc_label` (the Buy Me a Coffee
  button — see the Monetization section below).
- The `data-theme` attribute lives on `<body>`, not `<html>` (matters for browser automation
  assertions).
- Under reduced motion, `#xpPopup` never becomes visible — intentional and adjudicated
  (decorative, `aria-hidden`, XP info duplicated in the sidebar counter and toasts), not a bug.
- Nothing in `js/` may rely on `transitionend`/`animationend` without re-verifying under
  reduced motion (today everything is `setTimeout`-driven — that property is what makes the
  blunt block safe).

**Still open from the review (after round 2, 2026-07-15):** only three deliberate
leftovers — the avatar modal has no Tab focus-trap (Escape + focus-return do work; a
documented deliberate limit of round 2), the nested-TTS AT nit in `#flashcard` (decision
upheld: functionally safe, verified no double-fire), and the accent-as-text exceptions
(`.chapter-number` — large/bold text, 3:1 large-text threshold —, `.lesson-chapter-tag`,
and `.lesson-content code`, all pre-existing) — plus one minor follow-up: the structural
✓/✗ text glyphs left out of I8's scope (exam review, avatar `av-check`). All enumerated
with file pointers in `AGENTS.md` → "UI/UX remediation ronda 2 (2026-07-15)".

## Monetization — Buy Me a Coffee button (2026-07-15)

A floating "Invítame un café" / "Buy me a coffee" pill (bottom-right) links to the creator's
Buy Me a Coffee donations page, for a non-intrusive soft-launch monetization (tips, no content
gating, no payment infra of our own). Built via subagent-driven-development (spec + plan under
`docs/superpowers/`, per-task reviews, final whole-branch review, real-browser Playwright
verification). Design/plan: `docs/superpowers/specs/2026-07-15-buymeacoffee-button-design.md`,
`docs/superpowers/plans/2026-07-15-buymeacoffee-button.md`.

**Chosen approach: self-hosted outbound link, NOT the official BMC widget script** — avoids a
new third-party CDN dependency (which the repo's discipline would require pinning + SRI +
no-op degradation for) and keeps full control over a11y/i18n/theming. It's a plain
`<a href="https://buymeacoffee.com/jorgeborn3m" target="_blank" rel="noopener noreferrer">`.

Load-bearing details an agent must know:
- The pill lives **inside `#app-container`** (in `index.html`), so it hides automatically on
  the login screen (`#app-container` is `display:none` there — desired) and shows once signed
  in. During an exam it is hidden via `body.exam-active .bmc-fab { display:none }`.
- Exam visibility is driven by `App._setExamActive(active)` (`js/app.js`), the single point of
  truth that both sets `this._examActive` and toggles the `exam-active` class on `<body>`. The
  four former direct `this._examActive = …` assignments (navigate / renderSimulatorMenu /
  launchExam / finishExam) now route through it. Never reintroduce a direct assignment.
- Background is `var(--primary-dark)` (`#5a52d5`), **not** `--primary` (`#6C63FF`): white text
  on `--primary` is only 4.32:1 (fails AA); on `--primary-dark` it's 5.83:1 (passes). `color:#fff`
  is explicit because the icon `<svg>` uses `currentColor`. This pair is not a `--*-text` token
  so `validate-contrast.js` doesn't cover it — the AA choice is locked by the `N19` CSS check.
- The label's `data-i18n="bmc_label"` sits on the **inner `<span>`, never on the `<a>`**: the
  `<a>` also contains the `#i-coffee` `<svg>`, and `i18n.apply()` does `el.textContent = t(key)`,
  which would wipe the icon if the attribute were on the `<a>`. This was a real bug caught by the
  final review and fixed; the `N19` markup check now forbids `data-i18n` on the `<a>`.
- `.toast-container` was raised to a base of `bottom: 80px` (from 24px; today
  `calc(80px + env(safe-area-inset-bottom, 0px))`) so transient `aria-live` toasts
  stack **above** the persistent pill instead of overlapping it.
- Gate: the `N19` check family in `scripts/verify-runtime.js` (i18n key, `#i-coffee` sprite +
  markup, CSS tokens/offset/exam-hide, `_setExamActive` wiring, `privacy.html` mention).
  `privacy.html` declares the outbound link in ES and EN.

## Mobile Adaptability (2026-07-21)

The app had a tablet breakpoint (≤768px) but no phone one — real-browser measurement (Chromium,
touch emulation, 320/375/414px) found the glossary, lesson tables, exam dot navigator, flashcard
flip, sidebar drawer, and onboarding tour all overflowing or unusable below 768px. Fixed via
subagent-driven-development (11 tasks) plus a final whole-branch review that caught 1 Critical +
2 Important cross-task bugs (mobile-scoped state leaking into desktop), all fixed same-day. Spec:
`docs/superpowers/specs/2026-07-21-mobile-adaptability-design.md`; plan:
`docs/superpowers/plans/2026-07-21-mobile-adaptability.md`; full mechanism detail and the review
findings: `AGENTS.md` → "Mobile adaptability (2026-07-21)".

Load-bearing details an agent must know:
- **New `@media (max-width: 480px)` tier** in `css/styles.css`, right after the 768px block —
  the old `@media (max-width: 500px)` (`.avatar-grid` only) is folded into it. File tail order is
  unchanged: 480 tier → `(pointer: coarse)` → reduced-motion → `:focus-visible` literally last.
- **`App._setDrawerOpen(open)`** (parallel to `_setExamActive`) is the single point of truth for
  the mobile sidebar drawer — scrim, Escape, body scroll-lock, `inert` while closed. Nothing else
  may toggle `mobile-open` via `classList`. **The scrim's visibility/scroll-lock CSS
  (`body.drawer-open …`) must stay inside the `≤768px` media block** — it lived outside one until
  the final review caught a desktop bug (clicking the sidebar logo darkened the whole page).
- **`App._wrapLessonTables()`**, called at the end of `renderLesson()`, wraps every lesson
  `<table>` in a `.table-scroll` div by DOM manipulation — this is how mobile table scrolling
  works without ever editing `js/content.js` (content-fidelity rule stays intact).
  Do not add scroll wrappers by editing lesson HTML directly.
- **Flashcard flip is grid-stack, not absolute-positioned faces**: `.flashcard-inner` (not
  `.flashcard`) is the rotator; `.flashcard` is the perspective container **and** the element the
  2026-07-07 carousel translates via inline styles — two distinct elements, don't conflate them.
  Faces use `grid-area: 1/1` so the card grows with long content instead of clipping it.
- **`App._centerExamDot()`** (called from `renderExamDots()`, the single point all dot-moving
  flows funnel through) centers the mobile dot strip via `strip.scrollTo()` scoped to the dot
  container — **never `scrollIntoView`**, which was tried first and reverted because it drags the
  whole page's scroll position on desktop whenever the strip sits below the fold.
- Any new fixed-position, edge-anchored element must add `env(safe-area-inset-*)` insets (see
  `.bmc-fab`/`.toast-container`/`.sidebar` for the `calc(base + env(inset, 0px))` pattern) — the
  viewport meta now has `viewport-fit=cover`, so unprotected edges really do sit under a notch.
- Gate: `scripts/validate-responsive.js` (real-browser, manual pre-release step — see "No Tests,
  No Linter" above) + the `N20`/`N20b`/`N20c` check families in `verify-runtime.js`.
