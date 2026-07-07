# AGENTS.md

## Repository

- **GitHub:** https://github.com/jraversbcn21/MyCampusISTQB_26 — **public**, default branch `master`.
- No CI/CD, no PR review workflow currently configured — work happens as direct commits to `master` (this repo's actual practice so far, tracked here so an agent doesn't assume a branch/PR process that isn't there).
- **Git history was rewritten on 2026-07-02** (`git filter-repo` + force-push) to purge the `ISTQB 2026/` folder — copyrighted third-party PDFs (official syllabus, sample exam, reference book) that had been accidentally tracked since the initial commit of this public repo. **Every commit hash in the repo changed as a result.** Any SHA cited elsewhere in this doc from before that date is illustrative only — if you need the real current hash for a milestone, use `git log --oneline --grep="<commit message>"` rather than trusting a literal SHA.
- **Production-readiness pass (2026-07-02), current state:**
  - `ISTQB 2026/` is gitignored and untracked going forward (still present locally for content-audit work, never committed) — see "Reference Materials" below.
  - Supabase RLS on `user_progress` verified directly in the dashboard: `SELECT`/`INSERT`/`UPDATE` policies all scope on `auth.uid() = user_id`; no `DELETE` policy exists (default-deny, matches the app — it never deletes rows). Confirmed via the actual policy SQL, not just the "RLS enabled" toggle.
  - Supabase JS client pinned to an exact version with a Subresource Integrity hash (see "Supabase Backend" below) instead of a floating `@2` CDN tag.
  - Favicon, meta description, `theme-color`, Open Graph/Twitter tags added to `index.html`; stray dev `console.log` removed from `App.init()`.
  - `GLOSSARY` term display fixed to show only the active UI language (no more `"ES / EN"` slash pairs) — see "Glossary Schema" below for the underlying `term.es`/`term.en` schema change.
- **Architecture & security audit + remediation (2026-07-04):** full write-up at
  `docs/audit-2026-07-04-architecture-security.md` — read that first for the complete
  drift map, severity-ranked findings, and how each was verified. **A same-day independent
  re-audit (second pass, addendum in that same doc) found two of the closures partial and
  several sibling risks the first pass missed; all were fixed the same day** — the summary
  below describes the state after both passes:
  - The pre-commit gate is now **version-controlled** in `.githooks/pre-commit` and
    validates the **staged** copy of `js/questions.js`/`js/content.js` (not the working
    tree). A fresh clone activates it with `git config core.hooksPath .githooks` — that
    one command is the only per-clone setup this repo has.
  - `auth.js`: closed a refocus race where a repeated `SIGNED_IN` event for the same user
    (supabase-js can re-emit it on tab focus) overwrote `App.state` with a stale cloud copy
    and could cut off an in-progress exam; fixed a self-XSS via `avatar_url` (built the
    sidebar `<img>` through the DOM instead of `innerHTML`); guarded against the CDN script
    failing to load (previously an uncaught `TypeError` killed the whole app silently) and
    against any other required script failing to load (see "Script Load Order" below).
  - Second pass on the same theme: `Sync.loadState` is now **freshness-aware** — every
    `saveState` stamps `state._updatedAt` and the newer of localStorage-vs-cloud wins
    (a stale cloud copy used to clobber newer local progress on page load, the sibling of
    the refocus race above); a `visibilitychange→hidden` listener flushes a pending
    debounced save via a keepalive REST call; the script-load guard also covers `Sync`
    and a missing `config.js`; the remaining `innerHTML` sinks fed by `App.state`
    (activity log, exam history) are escaped via `escapeHtml()` in `app.js`.
  - Data hygiene: glossary chapter-tag map was missing chapter 6; the "Full Curriculum"
    achievement still required the pre-Phase-2 lesson count (16, not 22); two
    `localStorage.setItem` calls had no `try/catch` unlike the rest of the codebase;
    `examHistory` grew unbounded unlike `activityLog`; chapter 6's description still
    mentioned a non-syllabus concept ("tool adoption considerations") that Phase 2 had
    already purged from the lesson itself but not from the chapter description.
  - `scripts/validate-questions.js` and `scripts/validate-content.js` stay separate entry
    points (unchanged, still correct — see "Lesson Content Schema" below) but now share
    `scripts/lib/validate-utils.js` for the parts that were genuinely duplicated (loading
    browser globals from Node, the `FL-x.y.z` regex, the bilingual-field check).
  - i18n now genuinely covers the whole app: `onboarding.js`, `avatar.js`, and the auth
    screen were 100% hardcoded Spanish before this pass (contradicting the "i18n" section
    below, which was aspirational until now); ~35 ad-hoc `i18n.lang === 'es' ? ... : ...`
    ternaries in `app.js` were consolidated into `TRANSLATIONS`. The second pass caught
    the survivors the first one missed (visible "Salir" logout label, sidebar/topbar
    tooltips — now via `data-i18n-title` —, the streak toast suffix, the 'Estudiante'
    fallback, the glossary "Cap.N" tag), leaving **160 keys, all ES/EN paired**, enforced
    by `scripts/verify-runtime.js`. The auth screen needed its own standalone language
    switcher since it renders before `App` exists — see `i18n.setLang()`/`i18n.restore()`
    in `js/i18n.js`.
- **UI/UX polish pass (2026-07-07):** user-reported usability issues on small/short viewports,
  fixed same-day, all in `css/styles.css` unless noted:
  - **Sidebar clipped on short viewports:** `.sidebar` used `min-height: 100vh` with
    `overflow: hidden`. Since `min-height` doesn't force a flex container to a fixed size, if
    header + user-card + nav + footer's combined natural height exceeded the viewport, the
    whole `position: fixed` sidebar box grew taller than the screen — and since fixed elements
    don't scroll with the page, the footer (streak counter, **Salir**/logout button, privacy
    link) became permanently unreachable, with no scrollbar anywhere to get to it. Root-caused
    and fixed with three changes: `.sidebar` → `height: 100vh` (a real constraint, not a
    minimum) + `overflow-x: hidden; overflow-y: auto` (a scroll fallback for the sidebar itself,
    for the rare case even a fully collapsed nav doesn't leave enough room — e.g. a very short
    landscape-mobile viewport); `.sidebar-nav` → added `min-height: 0` (the classic flexbox
    gotcha: a flex item with `overflow-y: auto` needs this to actually be allowed to shrink
    below its content size and scroll internally, otherwise it ignores the constraint and
    expands anyway). Verified with Playwright reproducing the real sidebar markup at multiple
    viewport heights (480px, 667px portrait, 375px landscape) — confirmed the pre-fix box grew
    to 775px on a 480px-tall viewport (footer 295px off-screen, unreachable) and the post-fix
    box stays exactly at the viewport height with the nav scrolling internally and the footer
    always pinned/visible. Applies to both the desktop layout and the `≤768px` mobile drawer
    (`.sidebar.mobile-open`) — same underlying box, same fix.
  - **Progress view title too close to its content:** `#view-progress > h2` ("Mi Progreso")
    had no `margin-bottom`, unlike every other view's header wrapper (`.curriculum-header`,
    `.flashcards-header`, etc., all `margin-bottom: 28px` on the wrapper div) — this view's
    `<h2>` isn't wrapped in one, so it fell back to the browser's tiny default heading margin.
    Fixed with a single scoped rule, `#view-progress > h2 { margin-bottom: 20px; }`.

## Production Readiness — Status & Next Session

Full assessment and the two open items came out of the same 2026-07-04 conversation as the
audit above. Status:

- **Privacy policy: DONE.** `privacy.html` (see "Project Overview" below), linked from the
  auth screen and sidebar footer. Controller: Sid Maier (sidmaierlabs@gmail.com). Data
  residency: EU, West EU (Paris) Supabase region — confirmed, no international-transfer
  clause needed.
- **Error monitoring (Sentry free tier): DONE (2026-07-07).** Plan executed:
  `docs/superpowers/plans/2026-07-04-monitoring-and-signup-abuse.md` (Part A). See
  "Error Monitoring (Sentry)" above for the implementation; `privacy.html` (ES/EN)
  updated in the same commit.
- **Signup rate-limiting/captcha: B1 DONE (2026-07-07), gate resolved to soft launch —
  stopping here, no captcha.** Same plan document, Part B. The dashboard audit found:
  native rate limits (sign-ups/sign-ins 30 per 5 min, token refresh 150 per 5 min, OTP/
  magic-link verification 30 per 5 min) are adequate for a soft launch; native captcha
  and leaked-password protection are both off. The one real finding — the built-in email
  service's 2 emails/hour cap, which with "Confirm email" enabled would have blocked real
  signups from ever confirming — was **fixed** via custom SMTP (Brevo), see "Supabase
  Backend" above. Per the plan's own gate criterion, a soft launch (hand-shared link, no
  public announcement) doesn't need Cloudflare Turnstile — B2 is intentionally not done
  and shouldn't be started unless the launch plan changes to public/announced.

**To resume:** Parts A and B1 are both done; the plan is fully executed for a soft
launch. Only reopen Part B2 (Cloudflare Turnstile) if the launch plan changes to
public/announced — it needs a Cloudflare account and re-reading B2's deployment-order
warning in the plan doc before starting.

## Project Overview

MyCampus ISTQB is a **vanilla JavaScript SPA** — no framework, no build system, no package manager. Browser-based study platform for ISTQB CTFL v4.0.

`privacy.html` is a standalone bilingual static page (deliberately self-contained: own inline
CSS/JS, doesn't load `styles.css` or the app modules, so it works even if the app breaks). It
reuses the `mycampus_lang`/`mycampus_theme` localStorage keys so language and theme stay
coherent when navigating from the app. Linked from the auth screen and the sidebar footer via
the `privacy_link` i18n key. **Its statements about data handling must stay true to the code**
— if sync, auth providers, storage, or third-party services (CDN, fonts) change, update the
policy in the same commit and bump its "last updated" date.

## Running

Open `index.html` in a browser, or serve statically:

```bash
python -m http.server 8000
# → http://localhost:8000
```

No `npm install`, no compilation, no build step.

## Architecture

### Script Load Order (Critical)

The Sentry CDN bundle loads in `<head>`, before supabase-js, so `window.Sentry` is defined as early as possible (see "Error Monitoring (Sentry)" below). **Loading the bundle only defines the global — it does not yet capture anything.** Actual capture only starts once `Monitoring.init()` runs, which happens when `js/monitoring.js` executes in `<body>`, after `config.js`. That leaves a real gap: a synchronous top-level error thrown by the `<head>` supabase-js `<script>` itself, before `Monitoring.init()` has run, is not captured. Known and accepted for now (closing it would mean moving `config.js`/`monitoring.js` into `<head>`, ahead of supabase-js — a bigger reordering than this pass took on) — don't describe Sentry as covering the whole page lifecycle without this caveat. The rest load sequentially near the end of `<body>` in `index.html` (a code comment there points back to this section). Each exposes a global that later scripts depend on:

```
sentry-cdn (in <head>) → config.js → monitoring.js → i18n.js → content.js → questions.js → gamification.js → app.js → onboarding.js → avatar.js → sync.js → auth.js
```

**Do not reorder these.** Earlier modules are dependencies of later ones. In practice, reordering the current scripts among themselves wouldn't break anything today (they're all synchronous, no `defer`/`async`, so everything has executed by the time `DOMContentLoaded` fires regardless of order) — the real risk is one of them failing to load entirely (blocked, 404). `Auth._onAuthSuccess()` guards against that: it checks that `App`/`i18n`/`CHAPTERS`/`QUESTIONS`/`Gamification`/`AvatarSelector`/`Onboarding`/`Sync` are actually defined and shows a clear message instead of letting `App.init()` crash with an uncaught `ReferenceError` mid-render; a missing/failed `config.js` is covered separately by the top-level guard in `auth.js` (it feeds the same `_showLoadFailure()` path as a failed CDN load). Don't treat those guards as permission to actually reorder things, though — a future change could easily introduce a real top-level dependency.

### Module Pattern

Every module is a **global singleton object**. Naming is inconsistent:

| Global | File | Notes |
|--------|------|-------|
| `App` | `js/app.js` | Main controller. Also holds `_expandedChapters` (Set), `_currentCard` (TTS), `currentLesson` |
| `Auth` | `js/auth.js` | Entry point on DOMContentLoaded |
| `Monitoring` | `js/monitoring.js` | Sentry error monitoring, no-op if Sentry/DSN missing |
| `Sync` | `js/sync.js` | Cloud sync (4s debounce) |
| `Gamification` | `js/gamification.js` | XP, levels, badges |
| `AvatarSelector` | `js/avatar.js` | Avatar picker |
| `Onboarding` | `js/onboarding.js` | First-run tour |
| `i18n` | `js/i18n.js` | **lowercase** — not `I18n` |
| *(data)* | `js/content.js` | Chapters, lessons, glossary |
| *(data)* | `js/questions.js` | 120 exam questions |

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

Conflict resolution (since the 2026-07-04 second pass): every `Sync.saveState()` stamps
`state._updatedAt`; `Sync.loadState()` compares that stamp between the localStorage copy
and the cloud copy and **the newer one wins** (unstamped copies count as older than any
stamped one; ties go to the cloud, preserving multi-device behavior). A
`visibilitychange→hidden` listener in `sync.js` flushes a pending debounced save with a
keepalive REST call so closing the tab inside the 4s debounce doesn't leave the cloud stale.

### i18n

- `i18n.t(key)` in JS code
- `data-i18n="key"` for text content in HTML
- `data-i18n-placeholder="key"` for input placeholders
- Default language is Spanish (`i18n.lang = 'es'`)
- `data-i18n-title="key"` for `title` tooltips
- Translations defined in `TRANSLATIONS` object in `js/i18n.js` — 160 keys, all ES/EN paired,
  enforced by `scripts/verify-runtime.js` (parity, no used-but-undefined keys, no known
  hardcoded-language residues)
- `i18n.restore()` reads the saved language from `localStorage` and applies it; `i18n.setLang(lang)`
  sets + persists + applies. `Auth.init()` calls `restore()` before the login screen ever paints
  (the auth screen renders outside `App`, so it can't wait for `App.init()`'s own restore); the
  auth screen has its own `#authBtnES`/`#authBtnEN` switcher for exactly this reason. `App.setLang()`
  delegates to `i18n.setLang()` rather than duplicating the persist logic.
- Covers the whole app as of 2026-07-04, including `onboarding.js`, `avatar.js`, and the auth
  screen — before that pass, those three were 100% hardcoded Spanish. If you see hardcoded
  Spanish/English strings in those files (or a new `i18n.lang === 'es' ? ... : ...` ternary
  anywhere), that's new drift, not a pre-existing gap.

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

### Flashcard Carousel Animation (2026-07-07)

Clicking the prev/next arrows (`#fcPrev`/`#fcNext`) now slides the current card out and the
next one in from the opposite side, instead of swapping content instantly. Design:
`docs/superpowers/specs/2026-07-07-flashcard-carousel-animation-design.md`. Plan (executed via
subagent-driven-development, task review + final whole-branch review both clean, no
Critical/Important findings): `docs/superpowers/plans/2026-07-07-flashcard-carousel-animation.md`.

- **Direction:** next (→) slides the current card out **left**, new card enters from the
  **right**; prev (←) is the exact mirror. 50px distance, 250ms per phase (out, then in) —
  `App._slideFlashcard(direction, advance)` in `js/app.js`, driven entirely by inline styles
  (`transform`/`opacity`/`transition`) on `#flashcard`, not CSS classes.
- **Sequencing is `setTimeout`-based, not `transitionend`-based** — a deliberate, disclosed
  deviation from the design spec's prose, made during planning to match every other timed-UI
  call already in `js/app.js` (toasts, unlock notifications) and to stay testable against
  `scripts/verify-runtime.js`'s mocked DOM (no real CSS engine, no `transitionend` support).
  On-screen behavior is identical either way.
- **Independent of the 3D flip:** the slide transforms the outer `#flashcard`; the existing
  flip (`.flashcard-inner.flipped`, `App.flipFlashcard()`) transforms the inner
  `#flashcardInner`. Different elements, so the two animations can never conflict — confirmed
  by both the task and final reviewer.
- **Reentrancy guard:** `App._fcAnimating` (new state field, alongside `fcCards`/`fcIndex`/etc.)
  blocks overlapping animations from rapid clicks; reset to `false` in `initFlashcards()` on
  every view entry.
- **A real timing bug was found and fixed during planning, not left for a reviewer to catch:**
  `App.rateFlashcard()` used to synchronously check `fcIndex >= fcCards.length - 1` right after
  calling `nextFlashcard()` to decide whether to show the "deck completed" toast — this only
  worked because `nextFlashcard()` used to increment `fcIndex` synchronously. Once navigation
  became animated/deferred (~250ms), that check would have fired before the index actually
  moved. Fixed by giving `nextFlashcard(onAdvanced)` an optional callback, invoked once
  navigation has actually happened — whether that means "after the animated advance" or,
  at the literal last card, "immediately, since there's nothing to animate" — and moving the
  boundary check into it.
- `shuffleFlashcards()` and the deck `<select>` (`filterFlashcards()`) deliberately do **not**
  animate — they're a session reset, not a sequential navigation.
- Verified by 12 new `N10` checks in `scripts/verify-runtime.js` (direction, guard reentrancy,
  both deck boundaries, the `rateFlashcard` retiming) exercising the real loaded module against
  real timers, plus an ad hoc Playwright smoke check (not committed) confirming the visual
  direction and that the flip still works, including at the `≤768px` mobile width.
- Minor, non-blocking, recorded for any future touch to this area: no automated check for
  `rateFlashcard()` called when `fcIndex` is *already* the literal last card (verified correct
  by code trace during review, not by the harness); a narrow theoretical race exists if a user
  switches to a smaller deck within the 250ms out-phase of a pending navigation (pre-existing
  class of risk in this `setTimeout`-driven file, not newly introduced — a cheap future
  hardening would be a bounds check at the top of `renderFlashcard()`).

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
- `auth.js`'s `_onAuthSuccess()` (both the first-init and already-initialized branches) — `App.navigate(App.currentView || 'dashboard')` instead of hardcoded `'dashboard'`

### Sidebar Badge Fix

Empty `.nav-badge` elements (e.g., `#curriculumBadge`) are hidden via CSS: `.nav-badge:empty { display: none; }`

### Lesson Content Schema (`js/content.js`)

Every topic object in `CHAPTERS[i].topics[]` (22 total across 6 chapters: 5/4/2/5/5/1)
carries traceability fields alongside the pre-existing `id`/`title`/`xp`:
- `lo`: array of official learning-objective codes, format `FL-x.y.z` (e.g. `["FL-4.2.1","FL-4.2.2"]`)
- `source`: citation string, format `"Syllabus v4.0 §x.y"`

Every `LESSONS[id].es/en.content` HTML string ends with a footer paragraph:
`<p class="lesson-source">Fuente: ...</p>` (es) / `<p class="lesson-source">Source: ...</p>` (en),
styled by the `.lesson-content .lesson-source` CSS rule (`css/styles.css`).

**Any edit to `CHAPTERS`/`LESSONS` must be followed by `node scripts/validate-content.js`**
— it enforces topic counts per chapter, `lo`/`source` presence+format, and footer presence
in both languages for every topic. A sibling script to `validate-questions.js` (different
data shape, kept separate on purpose — don't try to merge them).

### Glossary Schema (`js/content.js`, `GLOSSARY` array)

107 entries, covering all 97 official ISTQB v4.0 syllabus keywords (verified by the same
`scripts/validate-content.js`). Each entry:
```js
{ term: { es: "...", en: "..." }, def: { es: "...", en: "..." }, chapter: "1"–"6", source: "..." }
```
- `term` is a bilingual object (not a single `"ES / EN"` string) — `App.renderGlossary()`,
  the letter filters, and both search bars (`js/app.js`) read `term[i18n.lang]` so only the
  active UI language is ever displayed, no slash pair. Changed 2026-07-02; if you see code or
  docs elsewhere referring to `term` as a plain string, it's stale.
- `source` cites official material, e.g. `"Syllabus v4.0 keywords §1 · §1.4.1"` or
  `"Foundations of software testing (ISTQB) — glosario"`. Same ground rule as everything
  else in this effort: never invent a citation.
- Letter-filter buttons in the glossary view rebuild on every render (including on language
  switch) so the A–Z grouping and the selected letter stay correct per language — don't
  reintroduce a "build once" cache here, it was a real bug (letters computed from the wrong
  language after switching).

### Question Bank Schema (`js/questions.js`)

120 questions in the `QUESTIONS` array, distributed by official ISTQB exam weight per
chapter: Cap0=24, Cap1=18, Cap2=12, Cap3=36, Cap4=24, Cap5=6 (0-indexed `chapter` field).

Every question with `id > 50` (i.e. everything beyond the original 50) additionally carries:
- `lo`: official learning-objective code, format `FL-x.y.z` (e.g. `"FL-4.2.2"`)
- `k`: cognitive level, `1` | `2` | `3` (K1 recall, K2 understand, K3 apply)
- `source`: citation string, format `"Syllabus v4.0 §x.y.z"`

**Any edit to this file must be followed by `node scripts/validate-questions.js`** — it
enforces the per-chapter counts, bilingual/structural integrity, and the `lo`/`k`/`source`
presence for `id > 50`. Treat a failing run as a blocker, not a warning.

### Supabase Backend

- Credentials in `js/config.js` (anon key — public, safe to commit)
- Table: `user_progress` (`user_id` UUID, `data` JSONB, `updated_at` timestamptz)
- RLS enabled and verified (2026-07-02): `SELECT`/`INSERT`/`UPDATE` policies all `auth.uid() = user_id`; no `DELETE` policy (default-deny)
- Supabase client loaded from CDN in `index.html`, pinned to an exact version + SRI hash (not a floating `@2` tag):
  `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.0/dist/umd/supabase.js" integrity="sha384-..." crossorigin="anonymous">`.
  To bump the version: resolve the new version, fetch the exact `/dist/umd/supabase.js` file (not the bare `@x.y.z` URL — jsdelivr's own file header warns "do NOT use SRI with dynamically generated files"), compute its sha384, cross-check the hash against a second CDN (e.g. unpkg) before trusting it, then update both the version and `integrity` attribute together.
- **Custom SMTP (2026-07-07): Brevo, resolves a real production blocker.** Supabase's
  built-in email service is rate-limited to **2 emails/hour** — with "Confirm email"
  enabled (it is, for this project), that ceiling meant real signups past the second
  in an hour would never receive their confirmation email. Configured under
  Authentication → Emails → SMTP Settings: host `smtp-relay.brevo.com`, port `587`,
  sender `sidmaierlabs@gmail.com` ("My Campus ISTQB"), username `b13600001@smtp-brevo.com`
  (Brevo's SMTP login, **not** the Supabase project name — that was a real mistake made
  and caught while setting this up, worth flagging if this is ever reconfigured). No
  custom domain was available, so Brevo was chosen over Resend specifically because its
  free tier verifies a single sender email (a verification link to that inbox) instead of
  requiring full domain DNS/DKIM verification. Verified end-to-end: a real signup's
  confirmation email arrived via Brevo's relay (`@<id>.brevosend.com` envelope domain)
  and the confirmation link worked.

### Error Monitoring (Sentry)

- `js/monitoring.js` (`Monitoring` global) wraps `@sentry/browser`, loaded as a pinned
  CDN bundle in `index.html`'s `<head>`, before supabase-js. Capture only starts once
  `Monitoring.init()` runs in `<body>` (see "Script Load Order" above for the known gap
  this leaves for the `<head>`'s own supabase-js `<script>`).
- **Never a hard dependency.** Same degradation pattern as the Supabase CDN guard in
  `auth.js`: if `window.Sentry` is missing (CDN blocked, offline, SRI mismatch) or
  `SENTRY_DSN` is undefined, `Monitoring.init()` no-ops silently and every other
  `Monitoring.*` call becomes a no-op too. The app must never depend on monitoring to
  function — verified by `scripts/verify-runtime.js`'s N9 checks.
- `SENTRY_DSN` lives in `js/config.js` next to the Supabase credentials — it's public by
  design, same class of secret as the Supabase anon key.
- `Sentry.init()` is called with `sendDefaultPii: false` and a `beforeSend` scrubber
  (`Monitoring._scrub`) that strips `user.email`/`user.username`/`user.ip_address` and
  redacts any email-shaped substring found anywhere in the event (message, breadcrumbs,
  extra context). Users are identified to Sentry **only** by their Supabase UUID
  (`Monitoring.identify(user.id)`, called from `auth.js`'s `_onAuthSuccess`); the
  UUID is cleared on `SIGNED_OUT` (`Monitoring.clearUser()`). Never email or name.
- **CDN pin (2026-07-07):** `https://browser.sentry-cdn.com/10.63.0/bundle.min.js`,
  `sha384-DK4NLLOVDh6BGBXQ48eIAFQ6DET3Y3pPMh/1xZBluw9YlZC9d51bMNXIerBn9sQM`. This is the
  minimal error-only bundle — no tracing, no session replay, consistent with the
  minimal-data-collection stance in `privacy.html`.
- **SRI verification method — documented deviation from the Supabase procedure above.**
  The Supabase pin is cross-checked against a second CDN (jsdelivr vs. unpkg) because the
  npm tarball is mirrored on both. `@sentry/browser`'s prebuilt CDN bundles are **not**
  published to the npm package (confirmed: no `bundle*.js` under the jsdelivr file
  listing for the package, only ESM/CJS builds) — the only official host is
  `browser.sentry-cdn.com` (Sentry's own Fastly-backed CDN), so there is no independent
  second mirror to diff against. Verified instead by: (1) fetching the file twice
  independently and confirming byte-identical content, and (2) matching the version+commit
  comment embedded in the bundle header (`/*! @sentry/browser 10.63.0 (2362e9f) | ... */`)
  against the commit SHA of the `10.63.0` tag in the public `getsentry/sentry-javascript`
  GitHub repo (`git ls-remote`/`git show-ref --tags`, or the GitHub API `git/refs/tags/…`).
  Pinned to `10.63.0` rather than the newer `10.64.0` published the same day this was
  written: the CDN returned `403` for `10.64.0` (propagation lag between npm publish and
  the Fastly-backed bundle host), confirmed by probing several adjacent versions.
- Any future version bump should repeat this same verification (double-fetch +
  GitHub tag match), not silently assume a second-CDN cross-check is available like the
  Supabase procedure — it isn't, for this package.

### Offline

Fully functional without cloud sync. Falls back silently to localStorage.

This covers *sync* failures only. Since 2026-07-04, the *auth* gate itself also degrades
instead of crashing: if the Supabase CDN script fails to load, `supabaseClient` stays `null`
and `Auth._showLoadFailure()` shows a message instead of an uncaught `TypeError` killing the
whole app. There's no working offline login, though — Supabase is required to authenticate
at all; this only prevents a silent, unexplained crash when it can't load.

## Conventions

- Private methods/helpers: prefix with `_` (e.g., `_onAuthSuccess`)
- Initial hidden elements use inline `style="display:none"` (not a CSS class)
- Single CSS file: `css/styles.css`
- All inline onclick handlers use global function calls (e.g., `onclick="App.navigate('curriculum')"`)

## No Tests or Linter

Manual browser testing only for app behavior/UI. There is no linter config, no type checking.

Three exceptions, all Node, dev-only, never served to the browser:
- `scripts/validate-questions.js` gates `js/questions.js` (see "Question Bank Schema" above).
- `scripts/validate-content.js` gates `CHAPTERS`/`LESSONS` in `js/content.js` (see "Lesson
  Content Schema" above). Both share `scripts/lib/validate-utils.js` for the parts that
  overlap, and both accept an optional file path argument (used by the pre-commit hook to
  validate the staged copy).
- `scripts/verify-runtime.js` loads the real `js/` modules into a mocked minimal DOM (no
  browser, no npm install) and exercises the behaviors fixed in the 2026-07-04 passes:
  sync freshness/flush, the script-load guards, the CDN-failure auth screen, state-derived
  `innerHTML` escaping, and the i18n residue/parity checks. If you fix a runtime behavior,
  add a check for it there.

The pre-commit gate is version-controlled at `.githooks/pre-commit` (activate once per clone:
`git config core.hooksPath .githooks`). It validates the **staged** copy of the two data
files — not the working tree — and runs `verify-runtime.js` whenever `js/`, `index.html`, or
the harness itself is staged. Commit is blocked on failure.

## Reference Materials

The `ISTQB 2026/` folder contains official ISTQB PDFs (syllabus, sample exams). Not part of the application code — do not modify. **Not version-controlled** (gitignored — this is copyrighted third-party material and must never be committed/pushed to the public repo). It exists only on this local checkout; a fresh clone won't have it. If a future content-audit session needs it, source your own copies of the PDFs into that folder first.

## ISTQB Content Fidelity Effort — Status & Next Session

Full spec: `docs/superpowers/specs/2026-07-01-content-and-question-bank-expansion-design.md`.
Ground rule for all three phases: every content item needs a `source` citation traceable
to official ISTQB material (syllabus PDFs, official sample exams) — never invent content.

- **Phase 1 (question bank 50→120): DONE, merged to `master`.**
  Plan: `docs/superpowers/plans/2026-07-01-phase1-question-bank.md`. All 7 tasks reviewed
  and approved; final whole-branch review found no Critical/Important issues.
- **Phase 2 (lesson content audit): DONE, merged to `master`.**
  Plan: `docs/superpowers/plans/2026-07-01-phase2-content-audit.md`.
  All 8 tasks reviewed and approved (2 required a glyph-labeling fix, 1 required a Critical
  content fix — see below); final whole-branch review found no Critical/Important issues.
  Audit trail with per-lesson verdicts: `docs/content-audit-report.md`.
- **Phase 3 (glossary expansion): DONE, merged to `master`.** `GLOSSARY` in
  `js/content.js` expanded from 48 to 107 terms, covering all 97/97 official syllabus
  keywords (verified by the extended `node scripts/validate-content.js`). `FLASHCARDS`
  was swept term-by-term against the syllabus and corrected where it contradicted v4.0 —
  see "Known corrections from Phase 3" below. Plan:
  `docs/superpowers/plans/2026-07-01-phase3-glossary.md`. Audit trail:
  `docs/content-audit-report.md` §"Fase 3 — Glosario y flashcards".
  (Commit hashes intentionally omitted here — see "Repository" section above: the 2026-07-02
  history purge changed every hash in this repo. Use `git log --oneline --grep=` to locate
  specific commits by message instead.)

**To resume this effort:** all three phases are content-complete and merged to `master`.
Post-merge, a separate maintenance pass (2026-07-02, not part of the content-fidelity effort)
fixed the glossary's ES/EN display and did a production-readiness pass — see "Repository"
section above for what changed and why. Remaining optional follow-up work is the Phase 1
minor gaps below (light BVA question coverage, missing FL-2.1.2 dedicated question) — not
blocking, just noted for a future content pass.

**Known minor gaps from Phase 1** (non-blocking, optional future cleanup):
- Chapter 4 (Test Analysis & Design) is light on boundary-value-analysis questions (only
  id 80, reusing the "1–100" domain already used by pre-existing id 15).
- Learning objective FL-2.1.2 has no dedicated question (folded into id 66's explanation).

**Real errors found and fixed during Phase 2** (useful precedent for how thorough the audit needs to be):
- Ch.2 lesson: false "4 test levels" claim (syllabus defines 5) — corrected.
- Ch.3 lesson: two distinct review roles (Gestor, Moderador) had been silently merged into one — split back out, all 6 roles now correct.
- Ch.4 lesson: a non-syllabus technique ("Prueba de Caso de Uso", confirmed removed in v4.0 via the syllabus's own changelog) and a self-contradictory worked BVA example (root-caused to OCR-corrupted source text with an unrecoverable comparison operator — fixed by removing the invented numeric example rather than guessing a replacement).
- Ch.6 lesson: non-official tool-category taxonomy, plus two non-v4.0 concepts ("false sense of security", "tool adoption considerations") — replaced/removed after independent grep + changelog verification.
- `FLASHCARDS` id 28's "false sense of security" (the one instance Phase 2 didn't touch, since `FLASHCARDS` was out of its scope) was fixed in Phase 3 — see below.

**Known corrections from Phase 3** (real errors found by the `GLOSSARY`/`FLASHCARDS` sweep;
full detail in `docs/content-audit-report.md` §"Fase 3"):
- `FLASHCARDS` id 9: "4 test levels" (same bug as the Phase 2 Ch.2 lesson fix, but this array wasn't in Phase 2's scope) — corrected to the official 5.
- `FLASHCARDS` id 14: a list including the informal review was mislabeled "formal reviews" — reworded to "review types" with the 4 official types (informal review, walkthrough, technical review, inspection).
- `FLASHCARDS` id 27: "24/7 availability" and "frees up testers" as automation benefits, neither in syllabus §6.2 — replaced with the 5 official benefits.
- `FLASHCARDS` id 28: "false sense of security" as an automation risk, absent from §6.2 — replaced with the 6 official risks.
- `FLASHCARDS` id 8: "Test Manager"/"Tester" presented as fixed job titles rather than the two roles the syllabus defines — reworded to match §1.4.5 (test management role, testing role).
- `FLASHCARDS` id 17: 2-value BVA mischaracterized as "min and max of each boundary" — corrected to the official definition per §4.2.2.
- `FLASHCARDS` id 18: "number of rules = 2^n" stated without qualification — clarified this only holds for a *full* (unminimized) decision table, per §4.2.3.
