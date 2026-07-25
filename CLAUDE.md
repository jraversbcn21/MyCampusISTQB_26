# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository. It is the **single official project document** — there is no `AGENTS.md` (it was
folded into this file on 2026-07-22). Detailed specs/plans/audits still live under `docs/`
(`docs/superpowers/specs/`, `docs/superpowers/plans/`, `docs/audit-*.md`,
`docs/content-audit-report.md`) and are pointed to from the relevant sections below.

## Project Overview

MyCampus ISTQB is a browser-based study platform for the ISTQB Certified Tester Foundation
Level (CTFL) v4.0 certification. It is a **vanilla JavaScript SPA** — no framework, no build
system, no package manager.

Live in production at **https://mycampusistqb.vercel.app** (soft launch 2026-07-20).

### Repository

- **GitHub:** https://github.com/jraversbcn21/MyCampusISTQB_26 — **public**, default branch
  `master`.
- **No CI/CD, no PR review workflow** — work happens as direct commits to `master` (the repo's
  actual practice; tracked here so an agent doesn't assume a branch/PR process that isn't there).
- **Git history was rewritten on 2026-07-02** (`git filter-repo` + force-push) to purge the
  `ISTQB 2026/` folder — copyrighted third-party PDFs (official syllabus, sample exam, reference
  book) accidentally tracked since the repo's initial commit. **Every commit hash in the repo
  changed as a result.** Any SHA cited in this doc from before that date is illustrative only —
  to find the real current hash for a milestone, use `git log --oneline --grep="<message>"`
  rather than trusting a literal SHA.

## Running the Project

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

There is no build step. No `npm install`, no compilation.

## Production Deployment (Vercel, 2026-07-20)

Live at **https://mycampusistqb.vercel.app** — Vercel project `mycampusistqb` under the account
`jorgeborn3-3085` (Vercel CLI login), deployed from the local working copy with the Vercel CLI.

- **Deploys are manual, CLI-driven:** `vercel deploy --prod --yes` from the repo root. There is
  **no Git integration** — pushing to GitHub does *not* deploy anything. After any change that
  should reach users, deploy explicitly, and only from a clean, committed tree so production
  matches a commit.
- **`.vercelignore` is load-bearing — never remove the `ISTQB 2026/` line.** The Vercel CLI does
  **not** respect `.gitignore` when uploading. The very first production deploy (2026-07-20)
  publicly exposed the copyrighted PDFs in the local-only `ISTQB 2026/` folder (verified: a direct
  file URL returned 200). Fixed the same hour by adding `.vercelignore` (which also excludes
  `docs/`, `scripts/`, `.githooks/`, `.claude/`, `CLAUDE.md` — nothing the browser needs),
  redeploying, and **deleting the exposed deployment** (`vercel rm <deployment-url>`; verified 404
  afterward on both the production alias and the removed deployment's own URL).
- **`privacy.html` declares Vercel** as the hosting processor (ES/EN, section 4) — hosting is a
  third-party service, so the same-commit policy rule (see Privacy Policy below) applies.
- **Supabase URL configuration (dashboard task, not code):** `auth.js` builds `redirectTo` from
  `window.location.origin`, so the code needs no per-domain change. Supabase → Authentication →
  URL Configuration is set to the production domain: **Site URL** = `https://mycampusistqb.vercel.app`
  and the same URL as the single **Redirect URLs** allowlist entry. Verified end-to-end on the
  live URL (signup, Brevo confirmation email, login). Two known follow-ups, suggested but not
  applied: `http://localhost:8000` is no longer allowlisted (add it back to Redirect URLs if login
  needs testing in local dev — until then local OAuth bounces to production); the allowlist entry
  could be widened to `https://mycampusistqb.vercel.app/**` for robustness (not critical — the
  Site URL fallback lands on the same domain anyway).
- The project is linked via the `.vercel/` folder (gitignored, per-clone). Re-link on a fresh
  clone with `vercel link --yes --project mycampusistqb`. The CLI also drops a `.env.local` with a
  `VERCEL_OIDC_TOKEN` (gitignored, harmless, not used by the app).

### Corporate-network TLS interception (Inditex) — deploy workaround

On the Inditex corporate network the CLI dies with `TypeError: fetch failed` /
`SELF_SIGNED_CERT_IN_CHAIN` — a TLS-interception issue, not a Vercel/project problem. The network
runs an SSL-inspecting proxy: `api.vercel.com` arrives signed by `CN=Inditex SSL Proxy RSA 2025`
instead of its real CA. Browsers accept it (Windows trusts the corporate root via group policy)
but **Node.js ships its own CA list and ignores the Windows certificate store**, so every Node
tool (Vercel CLI, npm) fails. Symptom that identifies it: DNS resolves fine, but `curl` fails
instantly with exit 35 (~0.15s, not a timeout). The VPN doesn't *block* the deploy — it just
routes you through this same inspecting proxy, so the CA workaround is required whenever you're
on the corporate path.

**Fix — point Node at the Windows trust store, never disable TLS verification:**

```powershell
# One-off (current shell):
$env:NODE_EXTRA_CA_CERTS="C:\Users\<user>\.certs\corporate-ca.pem"; vercel deploy --prod --yes
# Persistent (new shells only):
setx NODE_EXTRA_CA_CERTS "C:\Users\<user>\.certs\corporate-ca.pem"
```

Generate the bundle by exporting the Windows root store to PEM (≈105 certs on Jorge's machine,
including `Inditex Corporate Root CA v3`):

```powershell
$certs = Get-ChildItem Cert:\LocalMachine\Root, Cert:\LocalMachine\CA, Cert:\CurrentUser\Root |
         Sort-Object Thumbprint -Unique
$sb = New-Object System.Text.StringBuilder
foreach ($c in $certs) {
  [void]$sb.AppendLine("-----BEGIN CERTIFICATE-----")
  [void]$sb.AppendLine([Convert]::ToBase64String($c.RawData,'InsertLineBreaks'))
  [void]$sb.AppendLine("-----END CERTIFICATE-----")
}
[IO.File]::WriteAllText("$env:USERPROFILE\.certs\corporate-ca.pem", $sb.ToString())
```

`NODE_EXTRA_CA_CERTS` **adds** to Node's trust list — it keeps full certificate validation. Do
**not** reach for `NODE_TLS_REJECT_UNAUTHORIZED=0`: that turns verification off entirely and would
ship deploy credentials over an unverified channel. Keep the `.pem` outside the repo (never
commit/deploy it). The 2026-07-20 launch deploy worked because it ran from a different network;
the 2026-07-22 deploy worked over the VPN with this CA bundle.

## Architecture

### Script Load Order (Critical)

The Sentry CDN bundle loads in `<head>`, before supabase-js, so `window.Sentry` is defined as
early as possible. **Loading the bundle only defines the global — it does not yet capture
anything.** Capture starts once `Monitoring.init()` runs, when `js/monitoring.js` executes in
`<body>` after `config.js`. That leaves a real gap: a synchronous top-level error thrown by the
`<head>` supabase-js `<script>` itself, before `Monitoring.init()` has run, is not captured.
Known and accepted (closing it would mean moving `config.js`/`monitoring.js` into `<head>` ahead
of supabase-js) — don't describe Sentry as covering the whole page lifecycle without this caveat.
The rest load sequentially near the end of `<body>`:

```
sentry-cdn (in <head>) → config.js → monitoring.js → i18n.js → content.js → questions.js → gamification.js → app.js → onboarding.js → avatar.js → sync.js → auth.js
```

**Do not reorder these.** Earlier modules are dependencies of later ones. In practice reordering
the current scripts wouldn't break anything today (all synchronous, no `defer`/`async`) — the real
risk is one failing to load entirely (blocked, 404). `Auth._onAuthSuccess()` guards against that:
it checks that `App`/`i18n`/`CHAPTERS`/`QUESTIONS`/`Gamification`/`AvatarSelector`/`Onboarding`/
`Sync` are actually defined and shows a clear message instead of letting `App.init()` crash with
an uncaught `ReferenceError` mid-render; a missing/failed `config.js` is covered separately by the
top-level guard in `auth.js` (same `_showLoadFailure()` path as a failed CDN load). Don't treat
those guards as permission to reorder — a future change could introduce a real top-level dependency.

### Module Pattern

Every module is a **global singleton object** — a plain object with an `init()` method and private
helpers prefixed with `_`. Modules communicate through the global `App` object. Naming is
inconsistent (note `i18n` is lowercase, not `I18n`).

| Global | File | Responsibility |
|--------|------|----------------|
| `App` | `js/app.js` | Main controller: state, navigation, view rendering. Also holds `_expandedChapters` (Set), `_currentCard` (TTS), `currentLesson` |
| `Auth` | `js/auth.js` | Supabase auth (email + Google OAuth), session handling. Entry point on `DOMContentLoaded` |
| `Monitoring` | `js/monitoring.js` | Sentry error monitoring; no-op if the Sentry CDN/DSN is missing |
| `Sync` | `js/sync.js` | Debounced cloud save/load to Supabase `user_progress` (4s debounce) |
| `Gamification` | `js/gamification.js` | XP, levels (7 tiers), achievement badges |
| `i18n` | `js/i18n.js` | Spanish/English translations; all UI strings go through this |
| `AvatarSelector` | `js/avatar.js` | Tester-personality avatar picker |
| `Onboarding` | `js/onboarding.js` | First-run guided tour |
| *(data)* | `js/content.js` | Curriculum chapters, lessons, glossary |
| *(data)* | `js/questions.js` | Exam question bank (120 questions) |

### Entry Point

`Auth.init()` is called on `DOMContentLoaded`. On successful auth it calls `App.init()`.

### State & Data Flow

```
User Action → App.* method → mutate App.state → App.saveState()
                                                   ├─→ localStorage (immediate)
                                                   └─→ Sync.saveState() (4s debounce → Supabase)
```

`App.state` is the single source of truth. All views read from it directly.

**Conflict resolution (since the 2026-07-04 second pass):** every `Sync.saveState()` stamps
`state._updatedAt`; `Sync.loadState()` compares that stamp between the localStorage copy and the
cloud copy and **the newer one wins** (unstamped copies count as older than any stamped one; ties
go to the cloud, preserving multi-device behavior). A `visibilitychange→hidden` listener in
`sync.js` flushes a pending debounced save via a keepalive REST call so closing the tab inside the
4s debounce doesn't leave the cloud stale.

**Freshness-decision hazard (2026-07-22 fix) — read before touching sync/auth reconciliation.**
The "newer local wins" rule is only safe if the local timestamp it trusts reflects *real user
progress*. It does not, by default, at fresh login: `App.init()` calls `updateStreakAndDate()`
(`app.js:1564`), which for a default/empty state (`lastStudyDate === null`) calls `saveState()`,
stamping `App.state._updatedAt` fresh **and** writing that empty state to localStorage — all
synchronously, before the background cloud reconciliation runs. See the next section.

### Persistence — cloud progress loss on re-login (2026-07-22)

Bug reported on real use: a user with progress does **Inspector → Application → Storage → Clear
site data**, logs back in, and their progress **does not come back** — and the Supabase copy is
**destroyed**. Spec: `docs/superpowers/specs/2026-07-22-cloud-progress-loss-on-reauth-fix-design.md`.
Executed directly with TDD (no subagents); a manual export/import backup was deliberately deferred
as a separate follow-up.

**Root cause.** With `App._initialized === false` (`auth.js:_onAuthSuccess`):
1. `App.loadState()` over an empty localStorage returns the default initial state **without
   `_updatedAt`**.
2. `App.init(emptyState)` runs synchronously; at `app.js:1564` `updateStreakAndDate()` enters its
   branch (`lastStudyDate === null`) and calls `saveState()`.
3. `Sync.saveState` stamps the empty state with `_updatedAt = Date.now()` (fresh) and writes it to
   localStorage.
4. The background `Sync.loadState()` **re-reads** that freshly-stamped empty state
   (`localTs = now`), sees it as newer than the real cloud (`cloudTs` older) → `_push` uploads the
   empty state over the cloud.

It manifested through **three doors**: (a) `loadState`'s internal re-push; (b) the 4s-debounce push
from init's `saveState` (wins the race on slow networks, before `loadState`'s `SELECT`); (c)
`_onAuthSuccess`'s `.finally`, whose guard `cloudState._updatedAt >= App.state._updatedAt` was also
fooled by the fresh stamp (cloud looked "older" than the empty state) → it didn't apply the cloud
and re-dumped the empty `App.state`.

**Fix in three layers (all load-bearing — do not collapse to one):**
- **Layer 1 — `Sync.loadState(userId, localTsOverride)`:** the freshness decision uses the local
  timestamp captured **before** `App.init` can write, not a re-read of the already-mutated
  localStorage. `auth.js` captures `preInitLocalTs` before `App.init` (a *number*, not the object
  reference — `init` mutates the object) and passes it (0 on a clean boot → the cloud wins). Without
  the override the behavior is identical to before (no other caller breaks).
- **Layer 2 — gate `Sync._reconciled`** (initial `false`): `saveState` always stamps and writes
  localStorage, but only schedules the cloud push when `_reconciled === true`; `flushNow` and the
  `visibilitychange` listener respect it too. `auth.js` sets `_reconciled = false` before
  reconciling (both branches) and `= true` in the `.finally` (runs on error too → never leaves the
  push blocked forever), then does `App.saveState()` to flush the reconciled state. **The internal
  `_push` inside `loadState` is NOT gated** — it *is* the reconciliation; the gate lives only on
  App-originated pushes (init streak, in-window changes).
- **Layer 3 — `Auth._shouldApplyCloud(cloudState, hadLocalBase, appStateTs, postInitTs)`** (pure,
  testable — the harness can't run `App.init`): replaces the `.then` guard. No `cloudState` → don't
  apply (new user). `hadLocalBase === false` (clean boot, `preInitLocalTs === 0`) → **always** apply
  the cloud (any in-window action was taken on an incomplete empty state). Real local base → apply
  unless the user made a genuine in-window change (`appStateTs > postInitTs`, with `postInitTs`
  captured just after `App.init`).

**Why the app must be online for the problem scenario:** "Clear site data" also wipes the session;
there is no offline login (Supabase is required to authenticate), so an empty boot after clear is
always online with `preInitLocalTs === 0` → the cloud wins. No clear+offline combination can produce
an authenticated empty session.

**Editing constraints an agent must know:**
- Do **not** re-read localStorage or `App.state` for the freshness decision during background
  reconciliation — always use the pre-init stamp captured in `auth.js` before `App.init`. Any new
  automatic `saveState()` inside `App.init` reintroduces the contamination — it must sit behind the
  `_reconciled` gate.
- The `_reconciled` gate lives in `saveState`/`flushNow`/`visibilitychange`, **never inside
  `_push`** (that would break `loadState`'s legitimate re-push).
- Regression gate: the **`N22`** family in `scripts/verify-runtime.js` (bug repro via
  `Sync.loadState('u1', 0)` with a populated cloud → empty not uploaded, cloud wins; push gate:
  `_reconciled=false` schedules no timer/keepalive, `=true` does; `_shouldApplyCloud` in its 4 cases
  incl. the no-local-base boot the old guard failed; plus static wiring checks). The existing `N2`
  check now sets `Sync._reconciled = true` because it tests the already-reconciled flush. `N1`
  (multi-device) is intact.

### i18n

- `i18n.t(key)` in JS code
- `data-i18n="key"` — text content in HTML
- `data-i18n-placeholder="key"` — input placeholders
- `data-i18n-title="key"` — `title` tooltips
- `data-i18n-aria="key"` — `aria-label` (added 2026-07-14; a fourth block in `i18n.apply()` doing
  `el.setAttribute('aria-label', this.t(key))`, so it re-applies on language switch like the others)
- Default language is Spanish (`i18n.lang = 'es'`).
- Translations live in `TRANSLATIONS` in `js/i18n.js` — **231 keys**, all ES/EN paired, enforced by
  `scripts/verify-runtime.js` (parity, no used-but-undefined keys, no known hardcoded-language
  residues). The count grew over time: 160 after the 2026-07-04 remediation → 165 (2026-07-08 global
  search `gs_*`) → 170 (2026-07-14 a11y `data-i18n-aria` keys + `goto_question_aria`) → 174/175
  (2026-07-15 round-2 mobile-search/combobox + `achievement_toast_prefix` + `bmc_label`) → 177/178
  (2026-07-21 `lesson_next`/`lesson_finish_chapter`/`lesson_next_locked_toast`) → 196 (2026-07-25
  celebración de módulo/diploma) → 231 (2026-07-25 landing pública, claves `lp_*` + the public-landing
  section further below).
- `i18n.restore()` reads the saved language from localStorage and applies it; `i18n.setLang(lang)`
  sets + persists + applies. `Auth.init()` calls `restore()` before the login screen ever paints
  (the auth screen renders outside `App`, so it can't wait for `App.init()`'s own restore) — the
  auth screen has its own `#authBtnES`/`#authBtnEN` switcher for exactly this reason.
  `App.setLang()` delegates to `i18n.setLang()` rather than duplicating persist logic.
- **Covers the whole app since 2026-07-04**, including `onboarding.js`, `avatar.js`, and the auth
  screen — before that pass those three were 100% hardcoded Spanish. Any hardcoded Spanish/English
  string in those files (or a new `i18n.lang === 'es' ? … : …` ternary anywhere) is new drift, not a
  pre-existing gap.

### Key Modules

See the Module Pattern table above. `js/content.js`/`js/questions.js` are pure data (schemas under
"Data Schemas" below).

### Views

All views are HTML sections in `index.html` toggled via the `.view.active` class (`css/styles.css`
does `.view { display: none } / .view.active { display: block }` — nothing sets inline `display` on
views). Navigation is `App.navigate(viewName)`. Valid names: `dashboard`, `curriculum`, `lesson`,
`flashcards`, `simulator`, `glossary`, `progress`, `achievements`.

### Flashcard TTS

Each flashcard has a mute/unmute button on both question and answer sides, positioned bottom-right
via CSS. Uses the native **Web Speech API** (SpeechSynthesis) — no external libraries.
- `App._handleTTS(side, e)` — toggles speech; calls `e.stopPropagation()` to prevent card flip.
- `App._setVoice(utterance, voices, langCode)` — female voice matching active language, with
  fallbacks (female match → any language match → system default).
- `App.renderFlashcard()` stores card text in `this._currentCard` and renders TTS buttons via
  `innerHTML`; `App.flipFlashcard()` cancels speech and resets all TTS buttons.
- CSS: `.fc-tts-btn` (absolute, bottom-right), `.fc-tts-playing` (green pulse via `@keyframes
  fc-tts-pulse`).

### Flashcard Carousel Animation (2026-07-07)

Clicking prev/next (`#fcPrev`/`#fcNext`) slides the current card out and the next in from the
opposite side, instead of an instant content swap. Design/plan under `docs/superpowers/` for
`2026-07-07-flashcard-carousel-animation`.
- **Direction:** next (→) slides current card out left, new card in from the right; prev (←) is the
  mirror. 50px distance, 250ms per phase (out, then in) — `App._slideFlashcard(direction, advance)`,
  driven entirely by inline styles (`transform`/`opacity`/`transition`) on `#flashcard`, not CSS
  classes.
- **Sequencing is `setTimeout`-based, not `transitionend`-based** — a deliberate deviation to match
  every other timed-UI call in `js/app.js` and to stay testable against the mocked DOM in
  `verify-runtime.js`. On-screen behavior is identical either way. (This `setTimeout`-only property
  is also what makes the reduced-motion blunt block safe — see UI/UX below.)
- **Independent of the 3D flip:** the slide transforms the outer `#flashcard`; the flip
  (`.flashcard-inner.flipped`, `App.flipFlashcard()`) transforms the inner element. Two distinct
  elements — don't conflate them (this matters again for the mobile grid-stack flip below).
- **Reentrancy guard:** `App._fcAnimating` blocks overlapping animations from rapid clicks; reset to
  `false` in `initFlashcards()` on every view entry.
- `shuffleFlashcards()` and the deck `<select>` deliberately do **not** animate (session reset, not
  sequential navigation). A retiming bug was fixed during planning: `rateFlashcard()`'s "deck
  completed" boundary check moved into a `nextFlashcard(onAdvanced)` callback so it fires after the
  index actually moves (it used to rely on synchronous increment).
- Gate: the `N10` checks in `scripts/verify-runtime.js` (17 today — direction, guard reentrancy,
  both deck boundaries, the `rateFlashcard` retiming).

### Curriculum Expanded State

Chapters stay expanded when navigating to a lesson and back via `App._expandedChapters` (a `Set` of
chapter indices). `toggleChapter(i)` adds/removes; `navigateToLesson()` adds the chapter before
rendering; `renderCurriculum()` restores the `open` class after HTML rebuild (and emits
`aria-expanded` from the Set — `toggleChapter` syncs it manually since it only toggles the class,
it does NOT re-render).

### View Persistence

Saves the current view to the localStorage key `mycampus_current_view`, restores on init.
`_saveCurrentView(view)` serializes view name + lesson data + expanded chapters to JSON;
`_restoreSavedView()` reads/parses (returns `null` on error/missing); `App.init()` restores the
lesson with topic or falls back to `'dashboard'`. `navigateToLesson()` sets
`this.currentView = 'lesson'` (critical for post-sync re-navigation). `auth.js`'s
`_onAuthSuccess()` navigates to `App.currentView || 'dashboard'` (both branches) instead of a
hardcoded `'dashboard'`.

### Privacy Policy

`privacy.html` is a standalone bilingual (ES/EN) static page — deliberately self-contained (own
inline CSS/JS, no `styles.css`, no app modules) so it renders even if the app itself breaks. It
reuses the `mycampus_lang`/`mycampus_theme` localStorage keys for a coherent language/theme, and is
linked from the auth screen and sidebar footer via the `privacy_link` i18n key. **Its statements
about data handling (providers, storage region, retention) must stay accurate to the code** — update
it in the same commit as any change to sync, auth providers, storage, or third-party services (CDN,
fonts, hosting), and bump its "last updated" date. Controller: Sid Maier
(sidmaierlabs@gmail.com). Data residency: EU, West EU (Paris) Supabase region — no international-
transfer clause needed.

### Backend (Supabase)

- Credentials in `js/config.js` (anon key + `SENTRY_DSN` — both public by design, safe to commit).
- Single table `user_progress`: `user_id` (UUID), `data` (JSONB), `updated_at` (timestamptz).
- **RLS enabled and verified (2026-07-02)** directly in the dashboard via the actual policy SQL (not
  just the "RLS enabled" toggle): `SELECT`/`INSERT`/`UPDATE` policies all scope on
  `auth.uid() = user_id`; **no `DELETE` policy** (default-deny — matches the app, which never
  deletes rows).
- **Supabase client pinned to an exact version + SRI hash** in `index.html` (not a floating `@2`
  tag): `@supabase/supabase-js@2.110.0/dist/umd/supabase.js` with an `integrity="sha384-…"`
  `crossorigin="anonymous"`. **To bump the version:** resolve the new version, fetch the exact
  `/dist/umd/supabase.js` file (not the bare `@x.y.z` URL — jsdelivr's own header warns "do NOT use
  SRI with dynamically generated files"), compute its sha384, cross-check the hash against a second
  CDN (e.g. unpkg) before trusting it, then update version + `integrity` together.
- Google OAuth redirect URL is handled and cleaned by `auth.js` to prevent hash pollution after
  login.
- **Custom SMTP (2026-07-07): Brevo, resolves a real production blocker.** Supabase's built-in email
  service is rate-limited to **2 emails/hour** — with "Confirm email" enabled (it is), real signups
  past the second in an hour would never receive their confirmation email. Configured under
  Authentication → Emails → SMTP Settings: host `smtp-relay.brevo.com`, port `587`, sender
  `sidmaierlabs@gmail.com` ("My Campus ISTQB"), username `b13600001@smtp-brevo.com` (Brevo's SMTP
  login, **not** the Supabase project name — a real mistake made and caught while setting this up).
  No custom domain was available, so Brevo was chosen over Resend because its free tier verifies a
  single sender email instead of full domain DNS/DKIM. Verified end-to-end (a real signup's
  confirmation arrived via Brevo's relay and the link worked).

### Error Monitoring (Sentry)

`js/monitoring.js` (`Monitoring`) wraps `@sentry/browser`, loaded as a pinned CDN bundle in
`index.html`'s `<head>` before supabase-js. Capture starts only once `Monitoring.init()` runs in
`<body>` (see Script Load Order for the known `<head>` gap).
- **Never a hard dependency.** Same no-op degradation as the Supabase CDN guard: if `window.Sentry`
  is missing (CDN blocked, offline, SRI mismatch) or `SENTRY_DSN` is undefined, `init()` no-ops and
  every `Monitoring.*` call becomes a no-op. Verified by the `N9` checks.
- `Sentry.init()` runs with `sendDefaultPii: false` and a `beforeSend` scrubber
  (`Monitoring._scrub`) that strips `user.email`/`user.username`/`user.ip_address` and redacts any
  email-shaped substring anywhere in the event. Users are identified **only** by their Supabase UUID
  (`Monitoring.identify(user.id)` from `_onAuthSuccess`; cleared on `SIGNED_OUT` via `clearUser()`).
  Never email or name.
- **CDN pin (2026-07-07):** `https://browser.sentry-cdn.com/10.63.0/bundle.min.js`,
  `sha384-DK4NLLOVDh6BGBXQ48eIAFQ6DET3Y3pPMh/1xZBluw9YlZC9d51bMNXIerBn9sQM`. The minimal error-only
  bundle — no tracing, no session replay, consistent with `privacy.html`'s minimal-data stance.
- **SRI verification — documented deviation from the Supabase procedure.** `@sentry/browser`'s
  prebuilt CDN bundles are **not** published to the npm package (only ESM/CJS builds), and the only
  official host is `browser.sentry-cdn.com` — so there is no second mirror to diff against. Verified
  instead by (1) fetching the file twice and confirming byte-identical content, and (2) matching the
  version+commit comment in the bundle header (`/*! @sentry/browser 10.63.0 (2362e9f) | … */`)
  against the `10.63.0` tag's commit SHA in the public `getsentry/sentry-javascript` repo. Pinned to
  `10.63.0` not `10.64.0` (the CDN returned `403` for `10.64.0` — propagation lag). Any future bump
  must repeat this (double-fetch + GitHub tag match), not assume a second-CDN cross-check exists.

### Offline / Graceful Degradation

Fully functional without cloud sync — falls back silently to localStorage. Since 2026-07-04 the
*auth* gate also degrades instead of crashing: if the Supabase CDN script fails to load,
`supabaseClient` stays `null` and `Auth._showLoadFailure()` shows a message instead of an uncaught
`TypeError` killing the app. There's no working offline login, though — Supabase is required to
authenticate at all; this only prevents a silent crash when it can't load.

### Monetization — Buy Me a Coffee button (2026-07-15)

A floating "Invítame un café" / "Buy me a coffee" pill (bottom-right) links to
`https://buymeacoffee.com/jorgeborn3m` for non-intrusive soft-launch tips (no content gating, no
payment infra of our own). **Chosen approach: self-hosted outbound link, NOT the official BMC widget
script** — avoids a new third-party CDN dependency (which the repo's discipline would require pinning
+ SRI + no-op degradation for) and keeps full control over a11y/i18n/theming. It's a plain
`<a target="_blank" rel="noopener noreferrer">`. Design/plan under `docs/superpowers/` for
`2026-07-15-buymeacoffee-button`.

Load-bearing details:
- The pill lives **inside `#app-container`** (`index.html`, right after `</main>`), so it hides
  automatically on the login screen (`#app-container` is `display:none` there) and shows once signed
  in. During an exam it's hidden via `body.exam-active .bmc-fab { display:none }`.
- **Exam visibility is driven by `App._setExamActive(active)`** (`js/app.js`) — the single source of
  truth that both sets `this._examActive` and toggles the `exam-active` class on `<body>`. The four
  former direct `this._examActive = …` assignments (navigate / renderSimulatorMenu / launchExam /
  finishExam) route through it. Never reintroduce a direct assignment (the `N19` gate forbids it).
- Background is `var(--primary-dark)` (`#5a52d5`), **not** `--primary` (`#6C63FF`): white text on
  `--primary` is 4.32:1 (fails AA); on `--primary-dark` it's 5.83:1 (passes). `color:#fff` is
  explicit because the icon `<svg>` uses `currentColor`. Not a `--*-text` token pair, so
  `validate-contrast.js` doesn't cover it — the AA choice is locked by the `N19` CSS check.
- The label's `data-i18n="bmc_label"` sits on the **inner `<span>`, never on the `<a>`**: the `<a>`
  also contains the `#i-coffee` `<svg>`, and `i18n.apply()` does `el.textContent = t(key)`, which
  would wipe the icon if the attribute were on the `<a>`. A real bug the final review caught; the
  `N19` markup check now forbids `data-i18n` on the `<a>`. (In ≤768px the pill collapses to an
  icon-only 48px circle — see Lesson Flow & Mobile FAB for the accessible-name handling there.)
- `.toast-container` was raised to `bottom: 80px` (today `calc(80px + env(safe-area-inset-bottom,
  0px))`) so transient `aria-live` toasts stack **above** the persistent pill.
- Gate: the `N19` family in `scripts/verify-runtime.js`. `privacy.html` declares the outbound link
  (ES/EN, section 4).

### Global Search Dropdown (2026-07-08)

The topbar's global search box (`#globalSearch`) no longer forces navigation to the
glossary/curriculum while typing (the old listener did, and persisted the forced view via
`_saveCurrentView`, which could break an in-progress exam screen). Design:
`docs/superpowers/specs/2026-07-08-global-search-dropdown-design.md`.
- With >2 chars a `#globalSearchResults` panel opens inside `.search-box` (on mobile that box opens
  as a full-width bar under the topbar via `#mobileSearchBtn` — see UI/UX round 2 / I7) with up to 5
  `GLOSSARY` terms (definition clamped to 2 lines) and up to 3 `CHAPTERS`/topic matches with a
  lesson. Logic in the `GLOBAL SEARCH` section of `js/app.js`.
- Clicking a term **expands it in place** (`_gsToggleTerm`); the "View in glossary" link
  (`_gsGoGlossary`) is the *only* path that writes into `#glossarySearch`. Clicking a content result
  → `_gsGoLesson` → `navigateToLesson()`.
- **Exam guard:** `App._examActive` is set/cleared only through `App._setExamActive` (reset
  unconditionally as the first statement of `navigate()`, covering every destination — a chapter
  exam abandoned via any sidebar link used to leave the flag stuck `true` and block the dropdown
  app-wide). With the flag active, `_gsBlockIfExam()` blocks the two navigating actions with a toast;
  expanding definitions still works.
- **XSS:** the user's query is never interpolated into the panel's `innerHTML` — only static
  `GLOSSARY`/`CHAPTERS` data. No match highlighting, deliberately.
- Gate: the `N11` checks in `scripts/verify-runtime.js`, plus manual Chromium (Playwright)
  verification that caught a real defect the mocked DOM couldn't: the document-level "click outside
  closes it" listener used `e.target.closest('.search-box')`, which broke because expanding a term
  re-renders the panel's `innerHTML` mid-click and detaches the original target before the event
  bubbles to `document`. Fixed with `e.composedPath()` (captured before dispatch, unaffected by DOM
  mutations) plus a static `N11` regression check. Not reproducible in the mocked DOM (no real
  parent/child linkage, no `composedPath()`), hence the static check.

## Data Schemas

**Ground rule for all ISTQB content** (still active for any future content work): every new/changed
question, lesson fact, or glossary term must cite a `source` traceable to official material
(syllabus PDF, official sample exams) — **never invent exam content.**

### Lesson Content Schema (`js/content.js`)

Every topic in `CHAPTERS[i].topics[]` (22 total across 6 chapters: 5/4/2/5/5/1) carries, alongside
`id`/`title`/`xp`:
- `lo`: array of official learning-objective codes, format `FL-x.y.z` (e.g. `["FL-4.2.1","FL-4.2.2"]`)
- `source`: citation string, format `"Syllabus v4.0 §x.y"`

Every `LESSONS[id].es/en.content` HTML string ends with a footer:
`<p class="lesson-source">Fuente: …</p>` (es) / `Source: …` (en). **Any edit to `CHAPTERS`/`LESSONS`
must be followed by `node scripts/validate-content.js`** — it enforces per-chapter topic counts,
`lo`/`source` presence+format, and footer presence in both languages. Sibling of
`validate-questions.js` (different data shape, kept separate on purpose — don't merge them).

### Glossary Schema (`js/content.js`, `GLOSSARY` array)

107 entries, covering all 97 official ISTQB v4.0 syllabus keywords (verified by
`validate-content.js`). Each: `{ term: { es, en }, def: { es, en }, chapter: "1"–"6", source }`.
- `term` is a **bilingual object, not a single `"ES / EN"` string** (changed 2026-07-02) —
  `renderGlossary()`, the letter filters, and both search bars read `term[i18n.lang]` so only the
  active language is displayed. Code/docs referring to `term` as a plain string are stale.
- Letter-filter buttons rebuild on every render (including language switch) so the A–Z grouping and
  selected letter stay correct per language — don't reintroduce a "build once" cache (it was a real
  bug: letters computed from the wrong language after switching).

### Question Bank Schema (`js/questions.js`)

120 questions in `QUESTIONS`, distributed by official ISTQB exam weight per chapter (0-indexed):
Cap0=24, Cap1=18, Cap2=12, Cap3=36, Cap4=24, Cap5=6. Every question with `id > 50` also carries
`lo` (`FL-x.y.z`), `k` (cognitive level 1|2|3 = K1 recall / K2 understand / K3 apply), and `source`.
**Any edit must be followed by `node scripts/validate-questions.js`** — per-chapter counts,
bilingual/structural integrity, `lo`/`k`/`source` presence for `id > 50`. A failing run is a
blocker, not a warning.

## Conventions

- Private methods/helpers prefixed with `_` (e.g. `_onAuthSuccess`).
- Initial hidden elements use inline `style="display:none"` (not a CSS class) — except views, which
  toggle via `.view.active`.
- Single CSS file: `css/styles.css`.
- All inline onclick handlers use global function calls (e.g. `onclick="App.navigate('curriculum')"`).
- The `data-theme` attribute lives on `<body>`, not `<html>` (matters for browser-automation
  assertions).
- Dead-code note: an empty `<span class="nav-badge" id="curriculumBadge">` (scaffolding for a
  never-implemented counter that no JS ever wrote to) and its CSS were deleted in the 2026-07-21
  dead-code sweep. If a nav counter is ever wanted, recover the markup from history
  (`git log -S nav-badge`) rather than re-inventing it.

## No Tests, No Linter

There is no test suite or linter for the application itself — manual browser testing is the primary
mechanism for UI changes. Five exceptions, all Node-only dev scripts never served to the browser:

- **`scripts/validate-questions.js`** gates `js/questions.js` — see Question Bank Schema.
- **`scripts/validate-content.js`** gates `CHAPTERS`/`LESSONS`/`GLOSSARY`/`FLASHCARDS` in
  `js/content.js` — see Lesson Content / Glossary schemas. Shares `scripts/lib/validate-utils.js`
  with `validate-questions.js` (loading browser globals from Node, the `FL-x.y.z` regex, the
  bilingual-field check); both accept an optional staged-file path argument.
- **`scripts/verify-runtime.js`** — behavior harness: loads the real `js/` modules into a mocked
  minimal DOM (no browser, no npm install) and exercises sync freshness/flush, the script-load
  guards, the CDN-failure auth screen, `innerHTML` escaping of state-derived values, i18n
  parity/residue, and the `N*` regression families below. Run it after any change to `js/` or
  `index.html`; add a check when you fix a runtime behavior.
- **`scripts/validate-contrast.js`** (2026-07-14) gates `css/styles.css` — parses the `:root` and
  `[data-theme="light"]` custom-property blocks and asserts WCAG AA 4.5:1 for every
  status-text/background pair in **both** themes, including `rgba()`-tinted backgrounds
  alpha-blended over `--surface` (the same real-render math a CSS engine would use). It cannot see
  JS-inline text colors (`style="color:…"` from `js/app.js` templates) — those are covered by the
  `N12` static check in `verify-runtime.js`. Together the two gate the full surface.
- **`scripts/validate-responsive.js`** (2026-07-21) — **the only gate needing a real browser.**
  Launches Playwright/Chromium at 320/375/414px with touch emulation, serves the repo from its own
  `node:http` server, bypasses the auth gate, and asserts: zero horizontal overflow across the 7
  views + a tabled lesson + an active exam, ≥44px touch targets, the exam dot-strip height, the full
  drawer open/scrim/close/inert cycle, the avatar modal at 1 column, the `.bmc-fab`
  `getComputedStyle` (`padding:0`/`border-radius:50%`, proving the mobile circle wins the cascade at
  runtime — this FAB check runs at four widths 320/375/414/600, all ≤768), and the whole onboarding
  tour (tooltip in-viewport and ≤25% over the spotlight at every
  step). No-op dependency pattern: without Playwright it prints `SKIP: Playwright no disponible` and
  exits 0. **Deliberately outside the pre-commit hook** (slow, adds a dependency) — run it manually
  before any release and after any layout change. What it can't see without a browser is covered by
  the `N20`/`N20b`/`N20c` families in `verify-runtime.js`.

```bash
node scripts/validate-questions.js
node scripts/validate-content.js
node scripts/verify-runtime.js
node scripts/validate-contrast.js
node scripts/validate-responsive.js   # manual pre-release step, not in pre-commit
```

**Pre-commit gate** version-controlled at `.githooks/pre-commit` — activate once per clone with
`git config core.hooksPath .githooks` (the only per-clone setup this repo has). It validates the
**staged** copy of the three gated files (`js/questions.js`, `js/content.js`, `css/styles.css`) and
runs the runtime harness when `js/`, `index.html`, or the harness itself is staged; the commit is
blocked on failure. `validate-responsive.js` is deliberately not in the hook.

## Reference Materials

The `ISTQB 2026/` folder contains official ISTQB PDFs (syllabus, sample exams). Not part of the
application code — do not modify. **Not version-controlled** (gitignored — copyrighted third-party
material, must never be committed/pushed to the public repo, and must stay in `.vercelignore`). It
exists only on this local checkout; a fresh clone won't have it. A future content-audit session must
source its own copies first.

## ISTQB Content Fidelity Effort — complete (all 3 phases merged)

The question bank, lessons, and glossary were brought into closer alignment with the official
**ISTQB CTFL v4.0 syllabus**, in three phases, all merged to `master`. Full spec:
`docs/superpowers/specs/2026-07-01-content-and-question-bank-expansion-design.md`. Per-phase plans
under `docs/superpowers/plans/`; audit trail with per-lesson verdicts in
`docs/content-audit-report.md`. Built via subagent-driven-development.

| Phase | Status | Summary |
|-------|--------|---------|
| 1. Question bank (50 → 120) | ✅ Done | 120 questions matching official exam-weight distribution (24/18/12/36/24/6). Every added question has `lo`/`k`/`source`. |
| 2. Lesson content audit | ✅ Done | All 22 lessons audited; every topic has `lo`/`source`; every lesson has a `.lesson-source` footer. Real errors found and fixed (below). |
| 3. Glossary expansion (48 → 107) | ✅ Done | All 97/97 official v4.0 keywords covered. `FLASHCARDS` swept term-by-term for v4.0 fidelity. `GLOSSARY.term` is `{es, en}`. |

**Phase 1 minor gaps — CLOSED (2026-07-14).** Both gaps (light BVA coverage in Ch.4 — the
pre-existing BVA questions ids 15/80/38 were all 2-value on the same 1–100 domain; no dedicated
FL-2.1.2 question) were closed by **replacing three redundant/flawed questions** (bank stays at 120,
distribution intact, new ids > 50 so the `lo`/`k`/`source` rule covers them):
- **id 17 → id 122** — decision tables were over-represented (6 questions) and id 17 carried the same
  unqualified "2^n rules" imprecision Phase 3 fixed; id 122 is 3-value BVA applied on a fresh 10–50
  domain. **FL-4.2.2/K3, source "Syllabus v4.0 §4.2.2".**
- **id 31 → id 123** — id 31 was a near-duplicate of id 20; id 123 is the syllabus's own "x ≤ 10
  miscoded as x = 10" defect-detection example. **FL-4.2.2/K3, source "Syllabus v4.0 §4.2.2".**
- **id 43 → id 121** — id 43 was a literal duplicate of id 11 (same stem/answer); id 121 covers the
  four good testing practices of §2.1.2 (its three distractors are direct negations of the other
  three official practices). **FL-2.1.2/K1, source "Syllabus v4.0 §2.1.2".**

Result: BVA now has 5 questions; state transition keeps 4. Design:
`docs/superpowers/specs/2026-07-14-question-bank-gap-closure-design.md`. No content work currently
pending.

**Real errors found and fixed during Phase 2** (precedent for how thorough the audit needs to be):
Ch.2 lesson's false "4 test levels" (syllabus defines 5); Ch.3's two review roles (Gestor, Moderador)
silently merged into one, split back out; Ch.4's non-syllabus "Prueba de Caso de Uso" (removed in
v4.0) and an OCR-corrupted self-contradictory BVA example; Ch.6's non-official tool taxonomy plus two
non-v4.0 concepts ("false sense of security", "tool adoption considerations"). **Phase 3** fixed
`FLASHCARDS` errors the same sweep found (ids 9, 14, 27, 28, 8, 17, 18 — e.g. "4 test levels", a
mislabeled "formal reviews" list, non-syllabus automation benefits/risks, unqualified "2^n rules").
Full detail: `docs/content-audit-report.md`.

## Reliability & Security Remediation Pass (2026-07-04)

A follow-up audit (separate from the content effort) covered the runtime code — `auth.js`/`sync.js`
reliability, XSS surface, script-load fragility, validator duplication, and i18n completeness. It was
**independently re-audited the same day** (second pass), which found two partial closures and several
sibling risks — all fixed the same day. Full write-up (drift map, severity-ranked findings, how each
was verified, plus a pre-soft-production spot-check addendum from 2026-07-10):
`docs/audit-2026-07-04-architecture-security.md`. Highlights after both passes:
- `auth.js` no longer lets a stale cloud-state refetch overwrite recent local progress or interrupt
  an in-progress exam — on any path: the refocus re-emit (first pass) and the initial page load
  (second pass, via `_updatedAt` freshness stamps in `sync.js`). A pending debounced save is flushed
  on tab hide/close. (See also the 2026-07-22 fix above, which closed a hole this freshness
  mechanism still had at fresh login.)
- No `innerHTML` sink is fed unescaped user-controllable data: the avatar `<img>` (built through the
  DOM, first pass) plus activity log and exam history from `App.state` (`escapeHtml()`, second pass).
- A failed load of the Supabase CDN script, `config.js`, or any required script shows a clear message
  instead of crashing — and the auth screen stays functional (language switcher, form handlers).
- `i18n` covers the whole app (onboarding, avatar picker, auth screen were Spanish-only before;
  ~35 ad-hoc ternaries consolidated into `TRANSLATIONS`).
- Data hygiene: glossary chapter-tag map was missing chapter 6; the "Full Curriculum" achievement
  still required the pre-Phase-2 lesson count (16, not 22); two `localStorage.setItem` calls lacked
  `try/catch`; `examHistory` grew unbounded (now capped like `activityLog`); chapter 6's description
  still mentioned a non-syllabus concept Phase 2 had purged from the lesson.
- The pre-commit hook became version-controlled (`.githooks/`); the runtime harness
  (`scripts/verify-runtime.js`) makes the behavior fixes re-verifiable on any clone.

## Production Readiness — closed 2026-07-07 (pre-launch, historical)

Was the gate for the 2026-07-20 launch, which has since happened (see Production Deployment above).
Both items from the 2026-07-04 conversation resolved. Plan:
`docs/superpowers/plans/2026-07-04-monitoring-and-signup-abuse.md`.
- **Error monitoring (Sentry free tier): DONE** — see Error Monitoring above; `privacy.html` (ES/EN)
  updated in the same commit.
- **Signup rate-limiting/captcha: DONE, resolved to soft launch.** The dashboard audit found native
  rate limits adequate (sign-ups/sign-ins 30 per 5 min, token refresh 150 per 5 min, OTP 30 per
  5 min) and caught the real blocker (the built-in email 2/hour cap, fixed via Brevo SMTP). Supabase's
  native captcha **and leaked-password protection are both currently off** (security-posture note).
  **Captcha (Cloudflare Turnstile) was deliberately NOT added** — the plan's own gate says a soft launch
  (hand-shared link, no public announcement) doesn't need it. **Only reopen Part B2 (Turnstile) if
  the launch becomes public/announced** — it needs a Cloudflare account and re-reading B2's
  deployment-order warning in the plan doc first.

## UI/UX Remediation — ui-ux-pro-max Review (2026-07-14 + round 2 2026-07-15)

A full UI/UX review (with the `ui-ux-pro-max` skill) produced a prioritized findings list;
everything was remediated across two rounds via subagent-driven-development, each block with its own
plan, per-task reviews, a final whole-branch review (each round found and fixed real cross-task
issues), and real-browser Playwright verification. Specs/plans under `docs/superpowers/` for
`2026-07-14-*` and `2026-07-15-uiux-remediation-round2`.

**Round 1 (2026-07-14):**

| Block | Findings | Summary | Gate |
|-------|----------|---------|------|
| Contrast | C2 + I1 | Semantic `--success-text`/`--warning-text`/`--danger-text`/`--primary-text` tokens per theme (light-theme status text was 1.27–2.37:1); `--text3` raised to AA (`#8C8CC8` dark / `#666688` light); a fix wave swapped 7 JS-inline text colors the CSS validator couldn't see | `validate-contrast.js` + `N12` |
| A11y quick wins | I6 + I5 + I4 | `aria-live="polite"` on `#toastContainer` (+ `aria-hidden` on decorative `#xpPopup`); the `data-i18n-aria` mechanism naming five icon-only controls; four form inputs to 16px (kills iOS focus auto-zoom) | 12 `N13` checks |
| Keyboard operability | C1 | `#themeToggle` → real `<button>`; `role="button" tabindex="0"` on template-rendered divs + ONE delegated `document` keydown handler; global `:focus-visible`; `selectAnswer` focus restore; keyboard-operable flashcard flip | 11 `N14` checks |
| Reduced motion | I2 | Global `prefers-reduced-motion` blunt block (durations + delays → 0.01ms `!important`, beats inline styles) + `matchMedia` guard collapsing the carousel's `setTimeout` sequencing | 2 `N15` checks |

Exact token values (recoverable from `css/styles.css`, recorded here for completeness): light theme
`--success-text:#1B5E20` / `--warning-text:#7A5600` / `--danger-text:#B71C1C` / `--primary-text:#4F46C4`;
dark theme kept `#81C784`/`#FFD54F`/`#EF9A9A` and added `--primary-text:#A29DFF`. The round-2
`--secondary-text` pair is `#00D2FF` dark / `#007A99` light. Reduced-motion notes: the exam-timer
danger state stays distinguishable without its pulse (danger text color + tinted background — motion
was never the only signal); and the `_slideFlashcard` `typeof matchMedia` guard deliberately keeps the
mocked harness (no `matchMedia`) on the 250ms path so the `N10` timing checks run unchanged.

**Round 2 (2026-07-15)** closed everything round 1 left open (I3, I7, I8 + per-block follow-ups),
commits `2df5af2..4879e14`:
- **I3 — touch targets:** a `@media (pointer: coarse)` block (touch only — desktop visuals
  unchanged): `.lang-btn`/`.exam-dot` ≥44px, gaps to 8px, `.name-edit-btn` always visible on touch;
  plus an all-devices rule making the edit button visible to keyboard focus. **Editing hazard:** the
  coarse block's hit-area expansion on `.name-edit-btn` uses a `margin: -17px` shorthand that silently
  kills the base `margin-left`, so an explicit `margin-left: -9px` follows it (17 − 9 = 8px visual gap,
  matching desktop; hit area stays 44×44) — don't tidy the shorthand or the pencil glues to the
  username on touch.
- **I7 — mobile search + combobox:** `#mobileSearchBtn` (≤768px, `data-i18n-aria` + synced
  `aria-expanded`) opens `.search-box` as a full-width `.mobile-open` bar under the topbar, **reusing
  the same `#globalSearch` input and all its JS**. `App._closeMobileSearch()` (Escape/`#searchCloseBtn`)
  returns focus to the button. The dropdown got the full ARIA combobox pattern (desktop too):
  `role="combobox"`/`aria-controls`/`aria-expanded`/`aria-activedescendant`, `role="listbox"` panel
  with stable `gs-opt-N` `role="option"` ids, arrows without wrap, two-phase Enter on glossary terms,
  Escape to close.
- **I8 — structural emojis → inline SVG sprite:** a hidden sprite (`display:none`, `aria-hidden`) of
  Lucide-style `#i-*` symbols (26 originally; `#i-coffee` added later by the BMC round — note the
  `N17` check hardcodes the original 26-name list, so a symbol added later isn't gate-protected) as
  the first element of `<body>`; `.icon` class (1em, `currentColor` — theme-proof); `App._icon(name)`
  for `innerHTML` templates (unknown name → empty string; the name is always an internal literal,
  never user data). All structural HTML + JS-template emojis migrated; decorative emojis that stay
  carry `aria-hidden`. A real regression it caught: `.theme-btn`/`.name-edit-btn` declared no `color`,
  so their `currentColor` SVGs inherited UA black (1.18:1 in dark) — fixed with explicit colors + the
  14th `N17` check.
- **Minor follow-ups:** avatar modal as a `role="dialog" aria-modal` with Escape + focus-return
  (launcher/`.av-card` keyboard-operable via the delegated handler); `aria-expanded` on chapter
  headers and `#mobileMenuBtn`; dashboard `continue-item`s keyboard-operable; roving tabindex +
  `aria-current` on exam dots (ArrowLeft/Right in the delegated keydown); assertive `role="alert"` on
  `warning`/`error` toasts; new `--secondary-text` token (extra `validate-contrast.js` pair).
- New gates: the `N16`/`N16b`, `N17`, `N18` families.

**Editing constraints an agent must know (load-bearing):**

- **The tail of `css/styles.css` is ordered on purpose.** Today: the `≤480px` tier (~1453) →
  `@media (pointer: coarse)` (~2199) → **the `.bmc-fab` `≤768px` override block** (~2281) →
  reduced-motion (~2292) → `:focus-visible` **literally last** (~2309 — it must win the `outline`
  property over earlier equal-specificity `outline: none` input rules). The `.bmc-fab` override sits
  there — *after* the pill's base rule (~2238), not back in the main `≤768px` tier — because media
  queries add no specificity: two rules at the same specificity resolve by source order, so a
  same-specificity override placed *before* its target silently loses. That was a real bug (found in
  the 2026-07-21 final review): the override lived ~800 lines before the base rule, so
  `padding:0`/`border-radius:50%` were dead declarations and the FAB only *looked* circular by
  coincidence. **Do not "tidy" this block back into the main `≤768px` tier** — it silently
  reintroduces the bug. Don't append CSS after `:focus-visible`.
- **New interactive elements in `innerHTML` templates:** give them `role="button" tabindex="0"` — the
  delegated keydown listener in `App.init()` (Enter/Space over a `[role="button"]` → `preventDefault`
  + `.click()`) makes them keyboard-operable automatically. Never add per-element key listeners (the
  templates are regenerated constantly, so per-element listeners get wiped; one document-level
  listener survives every regeneration).
- **New icon-only controls:** name them with `data-i18n-aria="key"`.
- **Structural icons:** use the `#i-*` inline sprite (static HTML:
  `<svg class="icon" aria-hidden="true"><use href="#i-name"/></svg>`) or `App._icon(name)` in JS
  templates — do not reintroduce emojis as UI icons (the `N17` gate blocks it). Decorative emojis
  that stay must carry `aria-hidden`.
- **Status-feedback text colors:** use the `--*-text` tokens (or `.text-success`/`.text-warning`/
  `.text-danger`), never the raw `--success`/`--warning`/`--danger`/`--secondary` tokens as text —
  the two-part gate (`validate-contrast.js` + `N12`) blocks the commit otherwise.
- **Reduced motion:** `#xpPopup` never becomes visible (intentional and adjudicated — decorative,
  `aria-hidden`, XP duplicated in the sidebar counter and toasts). Nothing in `js/` may rely on
  `transitionend`/`animationend` without re-verifying under reduced motion — today everything is
  `setTimeout`-driven, which is what makes the blunt block safe.

**Still open (deliberate leftovers after round 2 + the mobile round):** the avatar modal has no Tab
focus-trap (Escape + focus-return work); the nested-TTS AT nit in `#flashcard` (decision upheld —
functionally safe, verified no double-fire); three pre-existing accent/raw-color-as-text exceptions
enumerated in the `N12` comment in `verify-runtime.js` (`.chapter-number` — large/bold, 3:1 threshold;
`.lesson-chapter-tag` — a hex literal invisible to the token regex; `.lesson-content code` —
`var(--secondary)` in CSS with no validator pair); and a handful of structural ✓/✗ and icon-only
emoji glyphs left out of I8's scope (exam-review markers, avatar `.av-check`, TTS 🔇/🔊, the "Volver"
← arrow, fc-stats 🔴🟡🟢) queued for a future minor pass. The answered daily-challenge options'
focusable-but-inert parity is an upheld decision, not a bug.

## Mobile Adaptability (2026-07-21)

The app had a tablet breakpoint (≤768px) but no phone one — a real-browser Chromium audit (touch
emulation, 320/375/414px) found the glossary, lesson tables, exam dot navigator, flashcard flip,
sidebar drawer, and onboarding tour all overflowing or unusable below 768px. Fixed via
subagent-driven-development (11 tasks) plus a final whole-branch review that caught 1 Critical +
2 Important cross-task bugs (mobile-scoped state leaking into desktop), all fixed same-day. Spec/plan
under `docs/superpowers/` for `2026-07-21-mobile-adaptability`.

- **New `@media (max-width: 480px)` tier** in `css/styles.css`, right after the 768px block (the old
  `@media (max-width: 500px)` — `.avatar-grid` only — was folded in). Reduced paddings,
  `.stats-grid`/`.results-stats` to 1 column, `flex-wrap` on rows that never wrapped. File-tail order
  as in the UI/UX editing constraints above.
- **Avatar-grid cascade — the same source-order trap as `.bmc-fab`.** Folding the old
  `@media (max-width: 500px)` into the 480 tier moved it *before* the avatar-modal CSS section, so at
  equal specificity the base `.avatar-grid { 1fr 1fr }` (~line 1812) silently won by source order and
  rendered 2 squeezed columns on a phone. Fixed by giving the tier rule **id specificity —
  `#avatar-modal .avatar-grid`** (order-independent); the `N20` tier check now requires the
  `#avatar-modal` prefix. **Do not "simplify" `#avatar-modal .avatar-grid` back to `.avatar-grid`** —
  it reintroduces the 2-column regression. General lesson: **merging a media block changes its cascade
  position — check what its rules used to beat.**
- **Text safety net (all widths):** `overflow-wrap: break-word` on 9 content containers and
  `min-width: 0` on 4 flex items that couldn't shrink before; `.page-title` truncates with an
  ellipsis.
- **`100vh` → `dvh` with a fallback pair** (`vh` kept, `dvh` added right after) at the 4 `100vh` sites
  (`body`, `.sidebar`, `.main`, `#app-container`) + `.avatar-modal-card`'s `88vh` — `dvh` discounts
  the mobile URL bar, so the sidebar footer no longer lands under the browser chrome. Related
  load-bearing invariant from the 2026-07-07 short-viewport fix: `.sidebar` uses a real `height`
  (not `min-height`, which doesn't force a fixed size and let the fixed box grow past the viewport,
  making the footer unreachable) + `overflow-y: auto`, and **`.sidebar-nav` keeps `min-height: 0`**
  (the flexbox gotcha that actually lets the nav shrink and scroll internally) — don't "tidy" that
  `min-height: 0` away.
- **Safe areas:** `viewport-fit=cover` on the viewport meta **in the same commit** as
  `env(safe-area-inset-*)` insets on every edge-fixed element (`.bmc-fab`, `.toast-container`,
  `.sidebar`/`.sidebar-footer`, `.topbar`) — activating `cover` without the insets would have exposed
  what the pre-`cover` letterboxing hid by accident. **Any new fixed-position, edge-anchored element
  must add `env(safe-area-inset-*)` insets** (see the `calc(base + env(inset, 0px))` pattern).
- **`App._setDrawerOpen(open)`** (parallel to `_setExamActive`) is the single source of truth for the
  mobile sidebar drawer — scrim (`#sidebarScrim`), Escape (a branch in the delegated keydown, last in
  priority after search/avatar-modal), body scroll-lock, `inert` on the sidebar while closed on
  mobile. Nothing else may toggle `mobile-open` via `classList`. `.topbar` was raised to
  `z-index: 120` so `#mobileMenuBtn` stays reachable with the drawer open; `#sidebarToggle` (desktop
  collapse-to-rail) hides on mobile. `#sidebarScrim` reuses the previously-dead `.sidebar-overlay`
  CSS; `inert` covers 11 focusables that were tabbable off-screen before. **The scrim's
  visibility/scroll-lock CSS (`body.drawer-open …`) must stay inside the `≤768px` media block** — it
  lived outside one until the final review caught a desktop bug (clicking the sidebar logo darkened the
  whole page); the logo-icon open branch is now also `matchMedia('(max-width: 768px)')`-guarded.
  **Crossing back above 768px (e.g. rotating a tablet) with the drawer open must close it:** the
  breakpoint-change listener's desktop branch calls `App._setDrawerOpen(false)` — it used to only
  remove `inert`, leaving `mobile-open`/`drawer-open` stuck.
- **`App._wrapLessonTables()`**, called at the end of `renderLesson()`, wraps every lesson `<table>`
  in a `.table-scroll` div (`overflow-x: auto`) by DOM manipulation — this is how mobile table
  scrolling works **without ever editing `js/content.js`** (content-fidelity rule intact). Do not add
  scroll wrappers by editing lesson HTML directly. (11 of 16 tabled lessons overflowed at 320px before
  this.)
- **Glossary stacks at ≤480px** instead of overflowing (`.glossary-item` was 3 columns with a
  `min-width:200px` term + `min-width:60px; white-space:nowrap` chapter chip that never fit a phone).
  The chapter chip is visually reordered next to the term via CSS `order`, but **the DOM order
  (term → definition → chip) is untouched** — the round-2 `N11` checks guard that DOM order, so don't
  reorder the markup itself.
- **Flashcard flip is grid-stack, not absolute-positioned faces:** `.flashcard-inner` (not
  `.flashcard`) is the rotator; `.flashcard` is the perspective container **and** the element the
  2026-07-07 carousel translates via inline styles — two distinct elements, don't conflate them. Faces
  use `grid-area: 1/1` so the card grows with long content instead of clipping it. `.fc-arrow` gained
  `flex-shrink: 0` at all widths; at ≤480px the arrows drop below the full-width card via `flex-wrap`
  + CSS `order` (tab order stays prev→card→next — a documented WCAG 2.4.3 nit at that one breakpoint).
- **`App._centerExamDot()`** (called from `renderExamDots()`, the single point all dot-moving flows
  funnel through) centers the mobile dot strip via `strip.scrollTo()` scoped to the dot container —
  **never `scrollIntoView`**, which was tried first and reverted because it drags the whole page's
  scroll on desktop whenever the strip sits below the fold.
- **Onboarding tour works on mobile:** `_updateStep()` opens the drawer (via `_setDrawerOpen`, gated)
  before positioning a sidebar-target step and closes it for the welcome step and on finish/skip;
  tooltip widths clamped to `innerWidth - 32`, vertical clamp measures real `offsetHeight`, a third
  "below the target" placement when neither side fits; `resize`/`orientationchange` listeners live
  only for the tour's duration. A drawer-just-opened step needs an extra `setTimeout` (50ms
  reduced-motion / 250ms normal, **never `transitionend`**) before measuring — the drawer's transform
  transition hasn't settled when position is computed synchronously.
- Gate: `scripts/validate-responsive.js` (real-browser, manual pre-release) + the `N20`/`N20b`/`N20c`
  families in `verify-runtime.js`.

## Lesson Flow & Mobile FAB (2026-07-21)

Two usability defects reported on a real device after the mobile round. Spec/plan under
`docs/superpowers/` for `2026-07-21-lesson-next-button-and-mobile-fab` and
`2026-07-21-lesson-advance-gating-design.md`.

- **Lesson bottom bar** went from `[← Volver] [Completada]` to `[Marcar como completada] [Siguiente
  lección: <tema> →]` (primary on the right). The bottom "Volver al curriculum" was an exact duplicate
  of the one in `.lesson-nav` (`index.html:342`) and was removed — the top one stays.
- **`App.advanceLesson(topicId, chapterId, nextTopicId)`** (formerly `completeAndAdvance`) **only
  navigates, and only if the lesson is already in `completedLessons`.** If not, guard clause → toast
  `warning` (`lesson_next_locked_toast`) and `return` without touching `completeLesson` or state. If
  completed, it branches: `navigateToLesson(chapterId, nextTopicId)` if there's a next topic, or
  `navigate('curriculum')` if it's the chapter's last lesson (**product decision, still current:** the
  flow **stops** at chapter close, it doesn't chain into the next chapter). The next topic is derived
  from `ch.topics` inside `renderLesson()` — **`js/content.js` is not touched.** The primary is
  emitted dimmed (`locked` + `aria-disabled="true"`, never a real `disabled` — so the click still
  reaches the guard and fires the toast) when the lesson isn't completed, and `completeLesson()`
  unlocks it **in place** on the same `#nextLessonBtn` without re-rendering. On a successful advance it
  does `window.scrollTo(0, 0)` (guarded by a `typeof` check for the mocked-DOM harness) so you don't
  land mid-lesson. **Deliberate revocation
  (same afternoon, after testing on a real device)** of the morning's complete-and-advance chaining:
  it gave XP as a side effect and made "Marcar como completada" meaningless. **XP lives exclusively in
  `completeLesson`.** Do not restore the chaining.
- **`.lesson-next-btn` uses `--primary-dark`, not `--primary`** (white on `#6C63FF` is 4.32:1, fails
  AA; on `#5a52d5` it's 5.83:1). So it does **not** reuse `.btn-primary`, which carries that
  pre-existing failure. Same criterion as `.bmc-fab`. In the 480 tier `.next-topic-title` is hidden
  (button becomes "Siguiente lección →").
- **Icon-only coffee FAB in ≤768px** (48px circle — with its text it overlapped the lesson buttons).
  Its accessible name moves to `data-i18n-aria="bmc_label"` **on the `<a>`** — compatible with the
  `N19` check that forbids `data-i18n` there (its regex requires `data-i18n=` with the immediate `=`,
  which `data-i18n-aria="` doesn't satisfy). The span is hidden with the descendant selector
  `.bmc-fab span`, **not** a dedicated class, because `N19` literally requires `<span
  data-i18n="bmc_label">`.
- **`.lesson-actions` gains `padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px))`** in
  ≤768px (48px circle + 24px offset). Deliberately only on the lesson view.
- **Presence guard in the CSS-order checks (`N19`/`N21`).** The "new rules come before the
  reduced-motion block" check used `cssSrc.indexOf(selector) < cssSrc.indexOf('@media
  (prefers-reduced-motion')`; if `selector` is absent, `indexOf` returns `-1` and `-1 < anything` is
  `true` — the check passed vacuously even if the whole rule was deleted. Both checks now anchor to
  `/\.selector \{/` (a real rule, not any mention — a comment mentioning the selector used to satisfy
  a naive `includes(selector)`). **Lesson: always anchor to `/\.selector \{/`, never
  `includes(selector)`.**
- Gate: the `N21` family (17 checks — 2 behavioral: they load a real `App` via `loadApp()`,
  monkeypatch `navigateToLesson`/`showToast`, and call `App.advanceLesson()` for real, first with
  `completedLessons = []` asserting no-nav + toast, then with the lesson added asserting nav), plus
  the re-anchored `N19` and the new cascade assert in `validate-responsive.js`.

## Celebración de módulo + diploma de campus (2026-07-25)

Modal centrado al completar módulos. Spec:
`docs/superpowers/specs/2026-07-25-chapter-completion-celebration-design.md`.

- **Disparo en `completeLesson` → `App._maybeCelebrate(chapterId)`**: al llegar un
  capítulo al 100% (aunque se complete en desorden), una sola vez por usuario —
  `state.celebratedChapters` (array) y `state.diplomaShown` (bool), persistidos en el
  JSONB existente (sync intacto). Si con él los 6 quedan al 100% → **diploma**, que
  sustituye a la card (nunca dos popups). Guard de migración dentro de
  `_maybeCelebrate` (estados legados y copias de nube sin los campos nuevos) — no en
  `loadState`, que no fusiona defaults sobre estados guardados.
- **`#celebration-modal`** estático en `index.html` (patrón avatar-modal: Escape con
  listener propio + exclusión en la rama drawer del keydown delegado, clic en scrim,
  foco al CTA al abrir y de vuelta al cerrar). Interior por JS: card «Camino de
  módulos» (`_chapterCardHtml`) o diploma (`_diplomaHtml`, clase `diploma`).
- **CTA de la card** → primera lección pendiente del siguiente capítulo (escaneo solo
  hacia delante; sin pendientes posteriores → curriculum). **CTA del diploma** →
  `navigate('simulator')`.
- **Fecha del diploma vía `i18n.t('date_locale')`** (`es-ES`/`en-US`), no un ternario de
  idioma — el plan original proponía `lang === 'es' ? 'es-ES' : 'en-GB'`, revisado y
  corregido durante la implementación porque reinventaba un mecanismo ya existente
  (usado también en `activityLog`) e introducía el patrón `i18n.lang === 'es' ? … : …`
  que este documento marca como drift.
- **Sin celebración retroactiva (decisión deliberada):** el disparo vive dentro de
  `completeLesson()`, que no se re-ejecuta sobre lecciones ya marcadas. Un usuario con
  un capítulo ya completo antes de este despliegue no verá su card al recargar; si
  tenía **los 6** completos, nunca disparará el diploma automáticamente (nadie vuelve a
  marcar la última lección). Ningún catch-up retroactivo implementado — quedaría como
  trabajo nuevo si se necesita.
- **Confetti solo en el diploma**, generado por JS con guard
  `matchMedia('(prefers-reduced-motion: reduce)')` (patrón `_slideFlashcard` — con
  reduce NO se genera ninguna pieza); autolimpieza a los 6s y al cerrar.
- **`_getDisplayName()`** — resolución del nombre extraída de `updateSidebar` (IIFE)
  y reutilizada por el diploma **con `escapeHtml`** (dato controlable por el usuario).
- **`.toast-container` subió a `z-index: 6000`** (antes 1000): los toasts de
  logro/level-up saltan en el mismo `completeLesson` que abre el modal (5000) y deben
  verse sobre su scrim. Siguen bajo el onboarding (9999+).
- CSS en sección propia tras el avatar-modal; overrides móviles dentro del tier 480
  **con prefijo `#celebration-modal`** (especificidad de id — misma lección que
  `#avatar-modal .avatar-grid`; el tier va antes que la base en el archivo).
- Gate: familia **N23** en `verify-runtime.js` (i18n, markup/CSS anclado a
  `/\.celebration-card \{/`, XSS del nombre, guard reduced-motion, Escape/drawer, y
  comportamentales: card una vez, no-recelebración, diploma sustituye a la card,
  migración de estado legado).

## Landing pública (2026-07-25)

Rediseño de la pantalla de acceso sin sesión — de un formulario centrado a una landing
completa (header, hero con la tarjeta de acceso, banda "por qué certificarse", roadmap del
syllabus y CTA final). Handoff de diseño (high-fidelity, no code) en
`design_handoff_landing_istqb/design-reference/` (`landing-desktop.png` 1195px,
`landing-mobile.png` 390px) — local al puesto de Jorge, no versionado en el repo. Spec/plan:
`docs/superpowers/specs/2026-07-25-landing-redesign-design.md` y
`docs/superpowers/plans/2026-07-25-landing-redesign.md`. Implementado en 5 tasks
(subagent-driven-development) + este Task 6 de verificación/documentación.

- **Enfoque A: `#auth-screen` transformado, no una página nueva.** El div `#auth-screen`
  existente pasa de ser un formulario centrado a la landing entera
  (`header.lp-header` → `section.lp-hero` con `.auth-card#acceso` dentro → `section.lp-why` →
  `section.lp-roadmap` → `section.lp-cta` → `footer.lp-footer`). La tarjeta de acceso
  **conserva todos sus ids** (`authForm`, `authEmail`, `authPassword`, `authSubmit`,
  `authGoogle`, `authForgot`, `authMessage`, `tabLogin`/`tabRegister`, `fieldName`) — `auth.js`
  no tuvo que aprender ids nuevos, solo comportamiento nuevo (ver más abajo). Los tabs se
  invirtieron en el DOM (Registrarse primero) para que el orden visual siga el handoff;
  `auth.js` depende solo de los ids, no del orden del DOM. El logo y el switcher ES/EN que
  antes vivían dentro de la tarjeta se movieron al header (`#authBtnES`/`#authBtnEN`, mismos
  ids) — no se duplican.
- **Tokens `--lp-*` scoped a `#auth-screen`, dark-only.** No van a `:root` — son fijos
  (`--lp-bg:#0B0B12`, `--lp-surface:#15151F`, `--lp-accent:#6C4EF6`, etc.), independientes de
  `data-theme`, para igualar el handoff sin que el tema claro los toque.
  `scripts/validate-contrast.js` solo parsea `:root`/`[data-theme="light"]`, así que no
  interfiere con este bloque (documentado como decisión, no como agujero de cobertura).
- **Fluida sin media queries** (`clamp()`, `flex-wrap`, `auto-fit/minmax`) de 320 a 1920px —
  decisión de arquitectura explícita del Task 3, no un descuido: por eso `.lp-signin-link`
  del header sigue visible a 390px aunque el mockup móvil del handoff no lo muestre (ver
  desviaciones más abajo). El bloque de auth se reescribió en el sitio donde ya vivía
  (~1564–1760 de `css/styles.css`); los overrides móviles de auth de los tiers ≤768/≤480 se
  eliminaron enteros — nada de este rediseño se añadió al tail del archivo, así que la cadena
  `≤480 → pointer:coarse → .bmc-fab → reduced-motion → :focus-visible` sigue intacta.
- **Fuentes Space Grotesk/Manrope, solo-landing.** El `<link>` de Google Fonts ya existente se
  amplió con `Space+Grotesk:wght@500;700` y `Manrope:wght@400;500;600;700` (comparte
  `display=swap` con la carga existente — no es una segunda petición). `#auth-screen` declara
  `font-family: 'Manrope', …` como base; títulos, wordmark y números de paso (`.lp-h1`,
  `.lp-why h3`, `.lp-roadmap-intro h2`, `.lp-step-num`, `.lp-timeline h3`) usan Space Grotesk.
  El resto de la app (dashboard, lecciones, etc.) sigue en Inter — estas dos fuentes no se
  aplican fuera de `#auth-screen`.
- **Tab por defecto: Registrarse, no Iniciar sesión.** `Auth._mode` arranca en `'register'`
  (antes `'login'`) — la landing recibe visitantes nuevos, no gente que vuelve. `authForgot`
  mantiene su comportamiento previo (oculto en modo registro; la fila inferior de la tarjeta
  muestra solo el link de privacidad en ese tab) — **no es un bug nuevo del rediseño**, ya
  documentado como decisión en el spec.
- **`navigator.language` en la primera visita.** `i18n.restore()` ahora consulta
  `navigator.language` cuando no hay preferencia guardada en localStorage (antes caía siempre
  a `'es'`); una preferencia guardada sigue mandando sobre el idioma del navegador, y la
  ausencia de `navigator` (o de `navigator.language`) cae a `'es'` por defecto. Cambio de
  comportamiento global deliberado — hoy cualquier visitante nuevo con navegador en inglés
  arranca en EN en vez de en ES.
- **CTAs con scroll + foco, no solo cambio de tab.** `#lpSigninLink` (header) y `#lpCtaBtn`
  (banda final) llaman a `Auth._goToAuthCard(mode)`: cambia de tab (`_switchMode`), hace
  `card.scrollIntoView({ block: 'center' })` sobre `#acceso` y pone el foco en `#authEmail`
  (`{ preventScroll: true }`, para no pelear con el scroll recién hecho). Verificado con
  Playwright real: click en `#lpSigninLink` → tab login activo + email enfocado + tarjeta en
  viewport; click en `#lpCtaBtn` → tab registro activo + email enfocado + campo Nombre visible.
- **Gap de `authSubmit` en `init()` arreglado.** `authSubmit` no lleva `data-i18n` (su texto
  depende del modo login/registro, no solo del idioma), así que restaurar un idioma no-ES en
  `Auth.init()` dejaba el botón en español hasta el primer cambio de tab. `init()` ahora
  fija `authSubmit.textContent` explícitamente según `this._mode` justo después de
  `i18n.restore()`.
- **`.auth-privacy-link` reubicada, no duplicada.** La regla vieja (vivía suelta cerca del
  tail del archivo, ~2377–2386 antes del rediseño) se borró entera; la única regla para esa
  clase ahora vive dentro de la sección CSS de la landing (hoy ~línea 1868), junto al resto de
  `.lp-auth-foot`/`.auth-forgot`.
- **Desviación deliberada — inputs a 16px.** El handoff pide 14px; los `<input>` de la
  tarjeta van a `font-size: 1rem` (16px) porque el gate `N13` y el auto-zoom de iOS lo exigen
  (mismo criterio que el resto de la app, ver UI/UX Remediation). Apenas perceptible al ojo.
- **Desviación deliberada — campo Nombre visible en Registrarse.** El handoff no lo muestra
  en su mockup de alta fidelidad, pero el campo ya existía en la tarjeta original y sigue
  siendo necesario para el registro real (`auth.js` lo usa) — se mantiene visible solo en modo
  registro (`display:none` en login), como ya funcionaba antes del rediseño.
- **Verificación visual (Task 6):** capturas Playwright reales a 1195px y 390px comparadas
  sección por sección contra el handoff (header, hero, tarjeta, banda "por qué", roadmap/
  timeline, CTA, footer) — tipografías, colores, radios y espaciados coinciden al pixel salvo
  las dos desviaciones deliberadas de arriba. No se necesitó ningún ajuste de CSS. Un tercer
  punto se observó y se documenta pero **no se trata como bug**: `.lp-signin-link` es visible
  en el header a 390px (el mockup móvil del handoff no lo muestra), consecuencia directa de la
  decisión "fluida sin media queries" del Task 3 — ocultarlo requeriría introducir un media
  query que esa decisión de arquitectura excluye explícitamente.
- Gate: familia **N24** en `verify-runtime.js` (claves i18n `lp_*` definidas, markup de la
  tarjeta con `id="acceso"`, `restore()` respetando `navigator.language` en sus tres casos) +
  checks de landing en `scripts/validate-responsive.js` (sin scroll horizontal a
  320/375/414/600/1195px, targets ≥44px en signin/lang/tab/submit/cta, timeline con los 6
  pasos renderizados).
