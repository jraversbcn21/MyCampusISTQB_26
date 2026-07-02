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

Scripts are loaded sequentially in `index.html` (lines 475–484). Each exposes a global that later scripts depend on:

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

### Offline

Fully functional without cloud sync. Falls back silently to localStorage.

## Conventions

- Private methods/helpers: prefix with `_` (e.g., `_onAuthSuccess`)
- Initial hidden elements use inline `style="display:none"` (not a CSS class)
- Single CSS file: `css/styles.css`
- All inline onclick handlers use global function calls (e.g., `onclick="App.navigate('curriculum')"`)

## No Tests or Linter

Manual browser testing only for app behavior/UI. There is no linter config, no type checking.

Two exceptions: `scripts/validate-questions.js` gates `js/questions.js` (see "Question Bank
Schema" above), and `scripts/validate-content.js` gates `CHAPTERS`/`LESSONS` in `js/content.js`
(see "Lesson Content Schema" above). Both are Node, dev-only, never served to the browser.

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
