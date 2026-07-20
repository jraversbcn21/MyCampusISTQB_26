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
  - The pre-commit gate became **version-controlled** in `.githooks/pre-commit` this pass
    (see "No Tests or Linter" below for the activation command and what it validates).
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
    `scripts/lib/validate-utils.js` (see "No Tests or Linter" below for what it covers).
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
- **2026-07-14 session index** (detail in the four entries below plus the ISTQB section):
  the two Phase-1 question-bank gaps were closed (ids 43/17/31 → 121/122/123 — see "ISTQB
  Content Fidelity Effort" below); a full UI/UX review with the `ui-ux-pro-max` skill
  produced a prioritized findings list, and four remediation blocks were executed the same
  day — **contrast (C2+I1)**, **a11y quick wins (I6+I5+I4)**, **keyboard operability (C1)**,
  **reduced motion (I2)** — each via subagent-driven-development with per-task reviews, a
  final whole-branch review, and real-browser Playwright verification. Net new permanent
  gates: `scripts/validate-contrast.js` (hooked on staged CSS) and the `N12`–`N15` check
  families in `scripts/verify-runtime.js`; i18n grew to 170 keys. **Still open from that
  review:** I3, I7, I8 plus the per-block recorded follow-ups — the consolidated pending
  list lives at the end of the "Reduced motion — I2" entry below. **UPDATE 2026-07-15:
  all of it CLOSED** by round 2 — see the "UI/UX remediation ronda 2 (2026-07-15)" entry
  below for what closed, the new gates (`N16`–`N18`), and the three deliberate leftovers.
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
- **Contrast remediation (2026-07-14):** fixed two findings from a UI/UX review done with the
  `ui-ux-pro-max` skill (plan: `docs/superpowers/plans/2026-07-14-contrast-remediation.md`),
  via subagent-driven-development in 4 tasks:
  - **C2 — status-feedback text illegible in the light theme:** badges, daily-challenge
    feedback (`.dc-option.correct`/`.wrong`), flashcard ratings, exam-history scores,
    results verdicts, and the streak counter all reused the raw `--success`/`--warning`/
    `--danger`/`--primary` base tokens as `color:` on light tinted backgrounds — fine in the
    dark theme (those tokens were tuned for it) but 1.27–2.37:1 in the light theme, near
    invisible. Fixed by introducing four semantic `*-text` tokens
    (`--success-text`/`--warning-text`/`--danger-text`/`--primary-text`), defined per theme
    and swapped into all 25 `color:` usages that were status feedback (`background:` and
    `border-color:` untouched — no visual redesign of fills/borders, only the text color).
    Dark keeps its existing values (`#81C784`/`#FFD54F`/`#EF9A9A`, already passing) plus one
    new value (`--primary-text: #A29DFF`, since the old `--primary`/`#8b85ff` only reached
    4.21:1 on the badge tint); light gets four new dark-enough values:
    `--success-text: #1B5E20`, `--warning-text: #7A5600`, `--danger-text: #B71C1C`,
    `--primary-text: #4F46C4`.
  - **I1 — `--text3` below AA in both themes:** bumped `--text3` from `#6666AA` to
    `#8C8CC8` (dark) and from `#8888AA` to `#666688` (light), clearing 4.5:1 against both
    `--surface` and the worst-case `--bg4` background in both themes.
  - **Validator:** `scripts/validate-contrast.js` (written first, red against the
    pre-remediation palette, then green — see "No Tests or Linter" below) now gates
    `css/styles.css` in the pre-commit hook, same staged-copy pattern as the other two
    validators.
  - **Visual verification:** Playwright screenshots of the auth screen and a throwaway
    representative-elements page (badges, `dc-option`, ratings, streak widget, exam-history/
    verdict, `--text2` vs `--text3`) in both themes, reviewed by eye. Confirmed status text
    legible in light and dark visually unchanged. The dark `--text2`/`--text3` pair
    (`#9999BB`/`#8C8CC8`) was checked specifically for the hierarchy-compression risk the
    plan flagged: at equal font size the two raw tokens read as similarly prominent (`
    --text3`'s slightly more saturated blue-purple hue can make it look as vivid as
    `--text2` despite its lower luminance-contrast ratio, 5.18:1 vs 5.89:1) — but every real
    usage in the app pairs `--text3` with a smaller font-size (e.g. `.activity-time`
    0.72rem next to `.activity-text`'s default size), which restores the intended
    dimmer/secondary read. No fallback needed; the plan's documented fallback
    (`#8484C4`) was not applied. Screenshots were scratchpad-only, not committed.
  - **Fix wave (final whole-branch review, same day):** the CSS-token pass above only swapped
    `color:` usages inside `css/styles.css`; `scripts/validate-contrast.js` can't see JS-inline
    text colors, so it missed a sibling problem: 7 places in `js/app.js` set
    `style="color:..."` (or `.style.color =`) directly to a raw `--success`/`--warning`/
    `--danger` token as *text* — progress-view Level and 🔥 streak big-stats (~967/970),
    daily-challenge "completed today" caption (~244), exam results score (~893), exam-
    performance bar-chart value labels (~995/997), achievement "unlocked" caption (~1039).
    Same failure mode as C2, just invisible to a CSS-only validator. Swapped each to the
    matching `--success-text`/`--warning-text`/`--danger-text` token, or to the existing
    `.text-success`/`.text-warning` utility class where a sibling stat already used that idiom
    (the two big-stats). `background:`/`border-color:` (e.g. the exam-performance bar fill)
    were deliberately left on the raw tokens — only text color was in scope, no visual
    redesign of fills. Regression-guarded by a new `N12` static check in
    `scripts/verify-runtime.js` (TDD: red against pre-fix `app.js`, green after), asserting
    `js/app.js` contains no `color:var(--success|warning|danger)` (optional whitespace after
    the colon) as inline text. **The gate for this whole remediation is therefore two-part:**
    `scripts/validate-contrast.js` for the CSS token pairs (hooked on staged `css/styles.css`)
    and `N12` in `scripts/verify-runtime.js` for JS-inline status text (hooked on staged
    `js/`) — neither alone covers both surfaces. **Known follow-up, still open and out of
    scope:** `var(--secondary)` (the progress view's exams-completed stat, ~969) and the
    chapter accent-color arrays (`colors = ["#6C63FF", ...]`, used as text in the curriculum
    continue-list percentage and the progress chapter-bar percentage) are still raw tokens/
    hex used as text and fail AA in the light theme — pre-existing, not addressed by either
    gate, pending a future pass. **CLOSED 2026-07-15** (round 2: `--secondary-text` token,
    accent percentages moved to `var(--text2)`/`var(--primary-text)`, `N12` widened to
    `--secondary`; three deliberate accent-as-text exceptions remain, enumerated in the
    "UI/UX remediation ronda 2" entry below).
- **A11y quick wins (2026-07-14):** fixed three more findings from the same `ui-ux-pro-max`
  review that produced the contrast remediation above (plan:
  `docs/superpowers/plans/2026-07-14-a11y-quickwins.md`), via subagent-driven-development:
  - **I6 — exam-guard toast invisible to screen readers:** the toast shown when navigation
    is blocked during an active exam was the *only* feedback the user got, and with no live
    region a screen reader never announced it. Added `aria-live="polite"` to
    `#toastContainer`. Alongside it, `#xpPopup` — a decorative visual flourish whose
    information (XP gained) already reaches the user through toasts/counters — got
    `aria-hidden="true"` so it doesn't duplicate announcements or add noise.
  - **I5 — five icon-only controls with no accessible name:** `#sidebarToggle`,
    `#mobileMenuBtn`, `#fcPrev`, `#fcNext`, and `#avatarModalClose` render only a glyph
    (`☰`, `←`, `→`, `✕`), so screen readers had nothing to announce. Fixed by introducing
    `data-i18n-aria="key"` as a fourth i18n attribute mechanism, alongside `data-i18n`/
    `data-i18n-placeholder`/`data-i18n-title` — a fourth block in `i18n.apply()` that does
    `el.setAttribute('aria-label', this.t(key))`, so the label re-applies on every language
    switch like the other three. `#sidebarToggle` reuses the existing `collapse_menu_title`
    key; the other four needed new keys (`mobile_menu_aria`, `fc_prev_aria`, `fc_next_aria`,
    `close_label`), and `#mobileMenuBtn` also gained a matching `title` via
    `data-i18n-title="mobile_menu_aria"` (it previously had no tooltip at all). See "i18n"
    below for the full attribute list and the key-count history (169 after this block; the
    keyboard-operability block below added one more → 170, the current total).
  - **I4 — iOS focus auto-zoom on form inputs:** `.search-input`, `.select-input`,
    `.search-input-full`, and `.auth-field input` were below 16px, which makes iOS Safari
    auto-zoom the viewport on focus (a jarring, disorienting UX on mobile). Raised all four
    to `font-size: 1rem` (16px at the app's base font size).
  - **Gate:** all of the above is regression-guarded by 12 new `N13` static checks in
    `scripts/verify-runtime.js` — the live region and `aria-hidden` attributes, the
    `data-i18n-aria` mechanism itself, each of the five controls' `data-i18n-aria`, and each
    of the four inputs' `font-size: 1rem`.
  - **Out of scope at the time (tracked here so pending blocks stay visible):**
    `#themeToggle` was still a `<div>` rather than a real button/checkbox, not reachable or
    operable by keyboard alone — finding **C1**, blocked then, since **CLOSED** by the
    keyboard-operability block below (same day). `.name-edit-input` stays at `0.85rem`
    (below the 16px iOS threshold) — deliberately
    excluded from the I4 fix above because it's a hover-only-revealed edit affordance, not a
    primary input; finding **I3**, pending. The global search box is still hidden entirely at
    `≤768px` (no mobile equivalent) — finding **I7**, pending. **UPDATE 2026-07-15: I3 and
    I7 both CLOSED** by round 2 — see the "UI/UX remediation ronda 2" entry below.
  - **Minors from this block's final whole-branch review (recorded, still open):** the toast
    icon emoji is not hidden from the live region (`showToast`'s template renders
    `<span>${icon}</span>` without `aria-hidden`, so screen readers announce e.g. "warning
    sign" before the message — mildly noisy); `#toastContainer`'s `polite` politeness defers
    the exam-guard block toast until the reader is idle — `polite` is a defensible
    non-interrupting default, but a type-aware map (`warning`/`error` → assertive) would
    surface genuinely blocking messages faster; `#globalSearch` has no accessible name beyond
    its placeholder (placeholder-as-label anti-pattern — the name disappears once the user
    types; adjacent to **I7**, fold into that block); `mobile_menu_aria`'s static "Abrir
    menú"/"Open menu" label is slightly inaccurate when the drawer is already open (it's a
    toggle). **UPDATE 2026-07-15: all four minors CLOSED** by round 2 (toast icons are now
    `aria-hidden` SVGs via `_icon`; `warning`/`error` toasts get `role="alert"`;
    `#globalSearch` has a real i18n `aria-label`; `#mobileMenuBtn` carries a synced
    `aria-expanded`) — see the "UI/UX remediation ronda 2" entry below.
- **Keyboard operability — C1 (2026-07-14):** closed finding **C1** of the same
  `ui-ux-pro-max` review: neither the theme toggle nor any of the app's template-rendered
  controls (exam options/dots, daily-challenge options, dashboard stat-cards, curriculum
  chapter headers and topic items) was reachable or operable by keyboard, and there was no
  visible focus indicator anywhere. Plan:
  `docs/superpowers/plans/2026-07-14-keyboard-operability.md`, built via
  subagent-driven-development. Three mechanisms:
  - **A real `<button>` for the theme toggle:** `#themeToggle` was a `<div>`; it's now a
    `<button class="theme-btn">` with a CSS reset (`background: none; border: none` in
    `.theme-btn`) so it looks exactly as before but is natively focusable/activatable.
  - **`role="button" tabindex="0"` on the template-rendered divs + ONE delegated key
    handler:** exam options carry them only when not reviewing, plus `aria-pressed`
    reflecting the selected state; exam dots also get an i18n `aria-label`
    (`goto_question_aria` → "Ir a la pregunta N"); daily-challenge options; the 4 dashboard
    stat-cards (static, in `index.html`); chapter headers; topic items only in the
    `hasLesson` branch (locked topics stay non-focusable). Activation comes from a single
    delegated `keydown` listener on `document`, registered in `App.init()`: Enter/Space over
    a `[role="button"]` target calls `preventDefault()` (no page scroll on Space, no double
    fire) and forwards to `.click()`, which triggers the existing inline `onclick`.
    Delegation is the load-bearing choice: these divs are regenerated by `innerHTML` on
    every re-render, so per-element listeners would be wiped constantly — one
    document-level listener survives every regeneration and covers future surfaces for
    free.
  - **Global `:focus-visible` outline (2px solid `var(--primary)`, 2px offset) at the very
    END of `css/styles.css`:** placement is load-bearing — several input rules declare
    `outline: none` at the same specificity (0-1-0), and coming later in the file is what
    makes the focus rule win the `outline` property when focus comes from the keyboard.
  - **Keyboard-UX repair:** `selectAnswer()` re-renders the question via `innerHTML`,
    destroying the focused node — answering with Enter used to dump focus back to `<body>`,
    forcing a keyboard user to Tab from the top on every question. It now restores focus to
    the answered option (`#optN`) after the re-render.
  - **Gate:** 11 new `N14` static checks in `scripts/verify-runtime.js` — the delegated
    handler, each surface's `role`/`tabindex` (including the not-reviewing and `hasLesson`
    conditions and the dots' i18n `aria-label`), the `selectAnswer` focus restore, the
    `:focus-visible` rule, `#themeToggle` being a real `<button>`, and the flashcard being
    keyboard-flippable (see the fix wave below). `TRANSLATIONS` grew
    to **170 keys** (new key: `goto_question_aria`) — see "i18n" below.
  - **Real-browser verification (2026-07-14):** Playwright/Chromium with real key presses
    (`page.keyboard.press`, never `.click()`) confirmed all 5 surfaces — exam option via
    Enter (with focus verified restored after the re-render), exam dot via Space, theme
    toggle, daily-challenge option, curriculum (chapter open + topic → lesson) — plus a
    21-Tab walk over the full cycle (sidebar toggle → nav → logout → privacy link → search →
    lang buttons → theme toggle → stat-cards → card-links → dc-options) with no focus trap,
    and screenshots of the visible 2px outline in both themes. Note for future assertions:
    the `data-theme` attribute lives on `<body>`, not `<html>`.
  - **Fix wave (final whole-branch review, same day):** the review found the flashcard flip
    keyboard-dead — `#flashcard` was a click-only `<div>` (its click listener is attached in
    `App.init()`), so a keyboard user could never reveal the answer. **FIXED** riding the
    block's own machinery: `role="button" tabindex="0" data-i18n-aria="click_to_flip"` on
    `#flashcard` in `index.html` — the delegated Enter/Space handler covers it for free, and
    `click_to_flip` is an existing key applied by the existing `data-i18n-aria` mechanism (no
    new i18n). Safe with the inner TTS `<button>`s: they carry no explicit `role` attribute
    (the delegated handler ignores them) and `_handleTTS` calls `stopPropagation()`, so their
    native Enter→click never bubbles into a flip. Guarded by the 11th `N14` check (TDD: red
    against the pre-fix `index.html`, green after).
  - **Recorded out of scope / follow-ups, still open:** chapter headers carry no
    `aria-expanded` (adding it needs a state sync in `toggleChapter`); `goToQuestion()` does
    no focus management after its re-render (only `selectAnswer` got the repair); the
    global-search dropdown's results have no keyboard support (folded into finding **I7**);
    answered daily-challenge options stay focusable-but-inert (`onclick` is nulled but
    `role`/`tabindex` remain — exact parity with mouse behavior, a cosmetic AT nit). Found by
    the final whole-branch review and recorded here: avatar personalization is
    keyboard-inaccessible end-to-end (`#userAvatar` is a div opening the modal via a JS click
    listener only, and the `.av-card` selection cards are click-only divs — only
    Save/Cancel/Close are real buttons); `.name-edit-btn` is an invisible tab stop
    (`opacity: 0` outside hover hides even the focus ring — queue with **I3**; suggested
    one-liner: `.user-card:focus-within .name-edit-btn, .name-edit-btn:focus-visible {
    opacity: 0.7; }`); the dashboard `continue-item` divs are click-only, though
    keyboard-equivalent paths exist via the curriculum (consistency nit); roving tabindex +
    `aria-current` for the exam dots as future polish. From the fix wave's re-review:
    `#flashcard` is now the one `role="button"` element with focusable descendants (the TTS
    buttons) — functionally safe (verified: no double-fire, native TTS operation unaffected)
    but ARIA authoring practice discourages nested interactive content and some AT may
    expose the inner buttons inconsistently; revisit alongside the other AT nits. The prior
    blocks' recorded minors (I3, I7, the raw `--secondary`/chapter-accent text colors from
    the contrast fix wave) stay open. **UPDATE 2026-07-15: this whole follow-up list is
    CLOSED** by round 2 (chapter-header `aria-expanded`, `goToQuestion` focus restore,
    combobox keyboard support, avatar modal + `.av-card` keyboard access, `.name-edit-btn`
    focus visibility, `continue-item` role/tabindex, roving tabindex + `aria-current` on
    the dots) — except two upheld decisions: the answered daily-challenge options'
    focusable-but-inert parity nit and the nested-TTS AT nit, both deliberately kept as-is.
    See the "UI/UX remediation ronda 2" entry below.
- **Reduced motion — I2 (2026-07-14):** closed finding **I2** of the same `ui-ux-pro-max`
  review: nothing in the app honored `prefers-reduced-motion` — three infinite pulse
  animations (onboarding highlight, TTS button, exam-timer danger), the 3D flashcard flip,
  view fades, toast slides, and the JS-driven carousel all ran at full motion regardless of
  the OS setting. Plan: `docs/superpowers/plans/2026-07-14-reduced-motion.md`, built via
  subagent-driven-development. Two mechanisms:
  - **A global "blunt" media block in `css/styles.css`:** under
    `@media (prefers-reduced-motion: reduce)`, `*, *::before, *::after` get
    `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`,
    `transition-duration: 0.01ms !important`, `scroll-behavior: auto !important`, plus
    `animation-delay`/`transition-delay` collapsed too (future-proofing: no delay exists in
    the file today, but a future `animation: foo .5s 2s` would otherwise still stall 2s
    under reduce) — the
    industry-standard reset. Chosen over per-animation gating because it neutralizes every
    current AND future animation/transition, and a stylesheet `!important` beats even the
    carousel's (non-important) inline styles. Placement is deliberate: immediately BEFORE
    the `:focus-visible` section, which must stay literally last in the file (the cascade
    rationale in its own comment — see the C1 block above; the media block only touches
    durations, so it has no cascade interaction with `outline`).
  - **A duration guard in `_slideFlashcard` (`js/app.js`):** `dur` is now
    `(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) ? 0 : 250`.
    The CSS block kills the visible motion but not the two `setTimeout`s that sequence the
    carousel — without this line, reduced-motion users still ate ~500ms of dead delay per
    arrow click. The `typeof matchMedia` guard is what keeps the mocked harness (which has
    no `matchMedia`) on the 250ms path, so the `N10` carousel timing checks run unchanged.
    **Safety property this relies on (verified in the final review):** nothing in `js/`
    listens to `transitionend`/`animationend` — every animation sequence is
    `setTimeout`-driven, so collapsing durations can't strand JS waiting on an event. If
    future work ever adds such a listener, re-verify it under reduce mode (at 0.01ms the
    event still fires, but it's the one pattern that could make the blunt block subtle).
  - **Intentional behavior (adjudicated, not a bug):** under reduced motion, `#xpPopup`
    never becomes visible — its finite `forwards` animation completes instantly at the
    final keyframe, which is `opacity: 0`. Accepted deliberately: the popup is purely
    decorative, `aria-hidden="true"` (a11y quick wins block above), and the XP information
    is duplicated in the sidebar XP counter and the toasts. Recorded here explicitly so it
    doesn't get filed as a bug later.
  - **Not motion-only signaling:** the exam timer's danger state stays distinguishable
    without its pulse (danger text color + tinted background) — motion was never the only
    signal, so no extra work was needed there.
  - **Gate:** 2 new `N15` static checks in `scripts/verify-runtime.js` — the global media
    block in `css/styles.css`, and the `matchMedia` guard in `js/app.js`.
  - **Real-browser dual-mode verification (2026-07-14):** Playwright/Chromium, one context
    with `page.emulateMedia({ reducedMotion: 'reduce' })` and one without. With reduce: flip
    transition 0.01ms, carousel 7.2ms end-to-end (both `setTimeout`s at 0), timer-danger and
    onboarding-highlight animations 0.01ms (iteration count capped to 1), and `#xpPopup`
    never lingers visible (matches the adjudication above). Without (no-regression pass):
    flip 0.5s, carousel 515.9ms total with a mid-flight `translateX` sample proving the
    slide genuinely still animates, timer pulse 1s, onboarding pulse 2s/infinite. No
    regressions.
  - **Pending blocks from the 2026-07-14 review:** **I2 is now closed.** **I3** (touch
    targets under 44px: lang switcher ~24px, exam dots 28px; plus the hover-only name-edit
    button, invisible on touch), **I7** (global search hidden at ≤768px with no mobile
    alternative), and **I8** (emojis used as structural icons — nav/topbar/stats/logo; the
    review's pragmatic fix is an inline SVG sprite, e.g. Lucide, keeping decorative emojis
    with `aria-hidden`) stay open, along with the recorded follow-ups above (the C1
    follow-up list and the contrast fix wave's raw `--secondary`/chapter-accent text
    colors). **UPDATE 2026-07-15: I3, I7, I8 and the recorded follow-ups are all CLOSED**
    by round 2 — see the next entry.
- **UI/UX remediation ronda 2 (2026-07-15):** closed everything the 2026-07-14 review left
  open — **I3**, **I7**, **I8** and the per-block minor follow-ups — in four blocks
  (commits `2df5af2..4879e14` on `master`, subagent-driven-development with per-task
  reviews, same methodology as round 1). Spec:
  `docs/superpowers/specs/2026-07-15-uiux-remediation-round2-design.md`; plan:
  `docs/superpowers/plans/2026-07-15-uiux-remediation-round2.md`.
  - **I3 — touch targets:** new `@media (pointer: coarse)` block in `css/styles.css`,
    inserted **before** the reduced-motion block (file-tail ordering constraint holds:
    reduced-motion, then `:focus-visible` literally last). In it: `.lang-btn` and
    `.exam-dot` grow to ≥44px, `.lang-switcher`/`.exam-question-dots` gaps to 8px,
    `.name-edit-btn` always visible on touch. Outside the media query (all devices), the
    global rule `.user-card:focus-within .name-edit-btn, .name-edit-btn:focus-visible`
    makes the edit button visible to keyboard focus — it's no longer an invisible tab
    stop. Desktop with a mouse is visually unchanged. Gate: 7 `N16 táctil` checks.
  - **I7 — mobile search + combobox keyboard support:** `#mobileSearchBtn` in the topbar
    (visible ≤768px only, with `data-i18n-aria` and a synced `aria-expanded`) opens
    `.search-box` as a full-width bar under the topbar via the `.mobile-open` class —
    **reusing the same `#globalSearch` input and all its existing JS** (zero duplicated
    state/listeners). `App._closeMobileSearch()` closes it (Escape or `#searchCloseBtn`)
    and returns focus to the button. The results dropdown got the full ARIA combobox
    pattern (desktop too): `role="combobox"`/`aria-controls`/`aria-expanded`/
    `aria-activedescendant` on the input, `role="listbox"` panel with stable `gs-opt-N`
    `role="option"` ids, state in `App._gsItems`/`_gsActive`, keyboard in
    `_gsMove`/`_gsActivate`/`_gsKeydown` — arrows move without wrap, Enter on a glossary
    term is two-phase (first expands in place, second navigates to the glossary — the
    keyboard-equivalent of the non-focusable "Ver en glosario" link), Escape closes.
    Active option styled via `.gs-active`. The exam guard and the `composedPath()`
    click-outside mechanism are untouched. 4 new i18n keys — `global_search_aria`,
    `mobile_search_aria`, `close_search_aria`, plus `achievement_toast_prefix` (added by
    the final-review fix for the last hardcoded "Logro:" toast residue in `js/app.js`) —
    bring `TRANSLATIONS` to **174 keys**.
    Gate: 10 `N16 móvil`/`N16 combobox` static checks + 2 `N16b` behavioral checks.
  - **I8 — structural emojis → inline SVG sprite:** a hidden sprite (`display:none`,
    `aria-hidden`) with **26 Lucide-style `#i-*` symbols** as the first element of
    `<body>` in `index.html`; `.icon` class (1em, `currentColor` — theme-proof by
    inheritance); `App._icon(name)` helper for `innerHTML` templates (returns
    `<svg class="icon" aria-hidden="true"><use href="#i-…"/></svg>`; unknown name →
    empty string; the name is always an internal literal, never user data — no new XSS
    surface). Migrated: the static HTML (logo ×2, 7 nav-icons, search icons, sidebar/
    mobile-menu toggles, logout, avatar-modal and mobile-search ✕, carousel arrows,
    4 stat-icons) and the JS templates (toast type icons, curriculum check/play/lock +
    chapter chevron, exam-menu badges, daily-challenge check, lesson-complete/activity
    star, the theme toggle's sun/moon at runtime, and the ✏️ pencil in `avatar.js`).
    Decorative emojis that stay carry `aria-hidden` (`.welcome-emoji`, `.streak-fire`,
    `#resultsEmoji`, the empty-state 🏆); content emojis inside translated toast strings
    and the gamification/avatar data emojis stay as-is by design. Gate: 14 `N17` checks
    (including "no structural emojis left on the migrated surfaces").
    Real-browser verification (Task 13, 41 Playwright checks) found one real I8
    regression: `.theme-btn` and `.name-edit-btn` declared no `color`, so their
    `currentColor` SVGs inherited the UA black (1.18:1 in dark theme) — fixed in
    `4879e14` with an explicit color on both rules plus the 14th `N17` check. The final
    whole-branch review then audited all 11 icon-hosting `<button>` rules and confirmed
    every one declares a color.
  - **Minor follow-ups (the ~9 recorded across the 2026-07-14 entries):** avatar modal is
    a `role="dialog" aria-modal="true"` with `aria-labelledby`, Escape-to-close and focus
    returned to `#userAvatar` (launcher and `.av-card`s carry `role="button" tabindex="0"`
    — covered by the existing delegated handler); `aria-expanded` on chapter headers —
    `renderCurriculum()` emits it from the `_expandedChapters` Set and `toggleChapter()`
    syncs it manually (it only toggles the class, it does NOT re-render) — and on
    `#mobileMenuBtn` (synced in its own listener, in `navigate()`'s drawer-close, and in
    the `.logo-icon` open path); dashboard `continue-item`s keyboard-operable; roving
    tabindex + `aria-current="true"` on exam dots with ArrowLeft/ArrowRight navigation (a
    new branch of the delegated keydown — no per-element listeners) and focus restored to
    the current dot after `goToQuestion()`'s re-render; `warning`/`error` toasts get
    `role="alert"` on the node (assertive inside the still-`polite` `#toastContainer`);
    contrast: new `--secondary-text` token (`#00D2FF` dark / `#007A99` light, added as a
    pair in `scripts/validate-contrast.js`), curriculum continue-list percentages and
    `.cpring-text` moved to `var(--text2)`, `.chapter-prog-pct` to `var(--primary-text)`,
    and the `N12` check widened to also ban `var(--secondary)` as inline text in
    `app.js`. Gate: 14 `N18` checks.
  - **Deliberate limits / still open after this round:** (1) the avatar modal has **no
    Tab focus-trap** (Escape + focus-return work; cycling Tab inside the dialog was a
    documented deliberate limit of this round — minor pending); (2) the nested-TTS AT nit
    in `#flashcard` stays as-is — decision upheld (functionally safe, verified no
    double-fire; restructuring the flashcard DOM is disproportionate); (3) three
    pre-existing, deliberate **accent/raw-color-as-text exceptions**, outside both
    contrast gates and enumerated in the `N12` comment in `scripts/verify-runtime.js`:
    `.chapter-number` (`js/app.js` ~358 — large/bold text on a tint, large-text AA
    threshold 3:1), `.lesson-chapter-tag` (`js/app.js` ~429 — `color:${color}` chapter-
    accent hex over its own 0.15 rgba tint; a hex literal, invisible to the `N12` token
    regex) and `.lesson-content code` (`css/styles.css` ~783 — `color: var(--secondary)`
    in CSS, with no `validate-contrast.js` pair); and (4) a new minor follow-up out of
    I8's scope: two **structural ✓/✗ text glyphs** remain — the exam review's
    correct/wrong markers (`js/app.js` ~933–934) and the avatar selection's `.av-check`
    (`js/avatar.js` ~191) still use text characters as icons. The final whole-branch
    review found more glyphs/emojis to queue with this same follow-up: the TTS buttons'
    🔇/🔊 (`js/app.js`, genuinely icon-only), the ← arrow of the "Volver al curriculum"
    button (`index.html` and `js/app.js`), the 🔴🟡🟢 markers of the fc-stats block
    (`index.html`), and — borderline, data-icon family — the 📋⚡🎯 of the exam history.
    Additional follow-ups from the final review: (5) `.av-card` does not expose its
    selected state to AT (only the `selected` class; candidate: `aria-pressed`) — queue
    with the AT nits; (6) **A2, pre-existing:** the open mobile drawer physically covers
    `#mobileMenuBtn`, making touch-close impossible (keyboard and nav-item close do
    work); suggested fix: click-outside closes the drawer; (7) `aria-current="true"` on
    the exam dots could become the more semantic `"step"` — a one-liner, BUT the `N18`
    check pins `"true"`: change both at the same time; (8) `.auth-lang-switcher` has no
    gap between ES/EN at 44px on touch (WCAG-conformant by size; a guideline deviation);
    (9) generalize the `N17` color check to every button rule hosting an `svg.icon`
    (today all 11 audited hosts declare a color).

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

**Pre-soft-production review (2026-07-10):** spot-checked every "Cerrado"/CONFIRMADO
fix from the 2026-07-04 audit (both passes) against the current code — not just
reread the doc — plus a fresh run of all three harnesses (`verify-runtime.js`,
`validate-questions.js`, `validate-content.js`), all green. No new findings; every
prior closure still holds. Full detail: `docs/audit-2026-07-04-architecture-security.md`
→ "Adéndum: revisión pre-soft-production (2026-07-10)". **Verdict: ready for soft
production** under the existing gate (soft launch = hand-shared link, no public
announcement; B2/captcha intentionally still not implemented under that gate).

**LAUNCHED (2026-07-20):** the soft launch happened — the app is **live at
https://mycampusistqb.vercel.app** with the auth cycle verified end-to-end on the
production URL (signup, Brevo confirmation email, login). See "Deployment (Vercel)"
below for the hosting setup, the `.vercelignore` incident, and the manual-deploy
workflow. The soft-launch gate above is unchanged: B2/captcha stays not-implemented
unless the launch becomes public/announced.

## Deployment (Vercel) — 2026-07-20

The app is in production at **https://mycampusistqb.vercel.app** — Vercel project
`mycampusistqb` under the account `jorgeborn3-3085` (Vercel CLI login), deployed from the
local working copy with the Vercel CLI. Key facts an agent must know:

- **Deploys are manual, CLI-driven:** `vercel deploy --prod --yes` from the repo root.
  There is **no Git integration** — pushing to GitHub does *not* deploy anything. After
  any change that should reach users, deploy explicitly (and only from a clean, committed
  tree so production matches a commit).
- **`.vercelignore` is load-bearing — never remove the `ISTQB 2026/` line.** The Vercel
  CLI does **not** respect `.gitignore` when uploading: the very first production deploy
  (2026-07-20) publicly exposed the copyrighted PDFs in the local-only `ISTQB 2026/`
  folder (verified: a direct file URL returned 200). Fixed the same hour by adding
  `.vercelignore` (which also excludes `docs/`, `scripts/`, `.githooks/`, `.claude/`,
  `AGENTS.md`, `CLAUDE.md` — nothing the browser needs), redeploying, and **deleting the
  exposed deployment** (`vercel rm <deployment-url>`; verified 404 afterwards on both the
  production alias and the removed deployment's own URL).
- The project is linked via the `.vercel/` folder (gitignored, per-clone). Re-link on a
  fresh clone with `vercel link --yes --project mycampusistqb`. The CLI also drops a
  `.env.local` with a `VERCEL_OIDC_TOKEN` (gitignored, harmless, not used by the app).
- **`privacy.html` declares Vercel** as the hosting processor (ES/EN, section 4) as of
  2026-07-20 — hosting is a third-party service, so the same-commit policy rule applied.
- **Supabase URL configuration: DONE (2026-07-20, dashboard task, not code):** `auth.js`
  builds `redirectTo` from `window.location.origin`, so the code needs no change
  per-domain. Jorge set Supabase → Authentication → URL Configuration to the production
  domain: **Site URL** = `https://mycampusistqb.vercel.app` (was localhost) and the same
  URL as the single **Redirect URLs** allowlist entry. **Verified end-to-end on the live
  URL the same day:** signup, confirmation email delivery (Brevo SMTP) and login all
  work. Two known follow-ups, suggested but not applied: `http://localhost:8000` is no
  longer allowlisted (add it to Redirect URLs if login needs testing in local dev —
  until then, local OAuth will bounce to production), and the allowlist entry could be
  widened to `https://mycampusistqb.vercel.app/**` for robustness (not critical — the
  Site URL fallback lands on the same domain anyway).

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
- `data-i18n-aria="key"` for `aria-label` (added 2026-07-14, I5 of the a11y quick wins
  block above) — fourth block in `i18n.apply()`, same shape as `data-i18n-title`:
  `el.setAttribute('aria-label', this.t(key))`, so it re-applies on language switch like
  every other `data-i18n-*` mechanism
- Translations defined in `TRANSLATIONS` object in `js/i18n.js` — **174 keys** (160 after
  the 2026-07-04 remediation, +5 `gs_*` keys for the 2026-07-08 global search dropdown →
  165, +4 more — `mobile_menu_aria`, `fc_prev_aria`, `fc_next_aria`, `close_label` — added
  2026-07-14 for the `data-i18n-aria` rollout above → 169, +1 — `goto_question_aria`, the
  exam dots' label from the same day's C1 keyboard-operability block → 170, +3 —
  `global_search_aria`, `mobile_search_aria`, `close_search_aria` — added 2026-07-15 for
  the I7 mobile-search/combobox block of the UI/UX remediation round 2 → 173, +1 —
  `achievement_toast_prefix`, the round-2 final-review fix for the last hardcoded
  "Logro:" toast residue → 174), all ES/EN
  paired, enforced by
  `scripts/verify-runtime.js` (parity, no used-but-undefined keys, no known
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

### Monetization — Buy Me a Coffee button (2026-07-15)

A floating "Invítame un café" / "Buy me a coffee" pill (bottom-right) linking to the creator's
Buy Me a Coffee donations page (`https://buymeacoffee.com/jorgeborn3m`), for a non-intrusive
soft-launch monetization: tips only, no content gating, no payment infrastructure of our own
(BMC handles the charge end to end). Built via subagent-driven-development, subagents on Opus.
Design/plan: `docs/superpowers/specs/2026-07-15-buymeacoffee-button-design.md`,
`docs/superpowers/plans/2026-07-15-buymeacoffee-button.md`.

**Approach — self-hosted outbound link, NOT the official BMC widget script.** Rejected the
widget because it's a third-party CDN script, which this repo's discipline requires pinning +
SRI + no-op degradation for; a plain `<a target="_blank" rel="noopener noreferrer">` gives full
control over a11y/i18n/theming and zero new dependency/privacy surface.

Load-bearing mechanics:
- **Markup** (`index.html`): the pill is an `<a class="bmc-fab">` placed **inside
  `#app-container`** (right after `</main>`), so `#app-container { display:none }` on the login
  screen hides it automatically (desired — no pill before sign-in) and it appears once signed in.
  Its icon is a `#i-coffee` Lucide-style symbol added to the inline SVG sprite (no emoji — the
  `N17` gate forbids emojis as UI icons).
- **i18n**: label key `bmc_label` (ES "Invítame un café" / EN "Buy me a coffee"), the 175th
  `TRANSLATIONS` key. `data-i18n="bmc_label"` sits on the **inner `<span>`, never on the `<a>`** —
  the `<a>` also wraps the icon `<svg>`, and `i18n.apply()` does `el.textContent = t(key)`, which
  would delete the icon if the attribute were on the `<a>`. This was a real bug the final
  whole-branch review caught (the icon vanished at startup and on every language switch); the fix
  moved the attribute to the span and the `N19` markup check now forbids `data-i18n` on the `<a>`.
- **Exam hiding**: `App._setExamActive(active)` (`js/app.js`) is the single source of truth — it
  sets `this._examActive` and toggles `document.body.classList` `exam-active`; CSS
  `body.exam-active .bmc-fab { display:none }` hides the pill mid-exam. The four former direct
  `this._examActive = …` assignments (navigate / renderSimulatorMenu / launchExam / finishExam)
  now route through it; the read-only guard (`if (!this._examActive) return false`) is unchanged.
- **Contrast**: background `var(--primary-dark)` (`#5a52d5`), not `--primary` (`#6C63FF`): white
  on `--primary` is 4.32:1 (fails AA), on `--primary-dark` 5.83:1 (passes). `color:#fff` explicit
  (the icon `<svg>` uses `currentColor`). Not a `--*-text` token pair, so `validate-contrast.js`
  doesn't cover it — the choice is locked by the `N19` CSS check instead.
- **Toast overlap**: `.toast-container` raised to `bottom: 80px` (from 24px) so transient
  `aria-live` toasts stack above the persistent pill rather than colliding at the same corner.
- **Privacy**: `privacy.html` declares the outbound link to BMC in both ES and EN (section 4).
- **Gates**: the `N19` check family in `scripts/verify-runtime.js`. **Verification**: 4 validators
  green + real-browser Playwright (Chrome), 18/18 — including a regression assertion that the
  `#i-coffee` icon survives `i18n.apply()` and ES↔EN toggling (the exact bug above).

### Global Search Dropdown (2026-07-08)

The global search box in the topbar (`#globalSearch`) no longer **forces navigation** to the
glossary/curriculum while the user types (the original listener in `App.init()` did this, and
also persisted the forced view via `_saveCurrentView`, which could break an in-progress exam
screen on return to the simulator). Full design:
`docs/superpowers/specs/2026-07-08-global-search-dropdown-design.md`.

- With more than 2 characters, a `#globalSearchResults` panel opens (inside `.search-box`,
  desktop only — `.search-box` stays hidden at ≤768px) with up to 5 `GLOSSARY` terms
  (definition clamped to 2 lines via CSS `line-clamp`) and up to 3 `CHAPTERS`/topic matches
  with a lesson. Logic lives in the `/* ===== GLOBAL SEARCH ===== */` section of `js/app.js`
  (`_onGlobalSearchInput`, `_renderGlobalSearch`, `_closeGlobalSearch`).
- Clicking a term **expands it in place** (`_gsToggleTerm`); the "View in glossary" link
  (`_gsGoGlossary`) is the *only* path by which the global search box writes into
  `#glossarySearch` (previously it did so on every keystroke). Clicking a content result →
  `_gsGoLesson` → `navigateToLesson()` straight to the lesson.
- **Exam guard:** `App._examActive` (true in `launchExam()`, false in `finishExam()`). The plan's
  original design also reset it in `renderSimulatorMenu()`, but that alone only fires when the
  destination view is `'simulator'` — a chapter exam (no timer) abandoned via any *other* sidebar
  link would have left the flag stuck `true` forever, permanently blocking the dropdown app-wide.
  Fixed during task review by resetting `_examActive = false` unconditionally as the first
  statement of `App.navigate(view)` itself (`js/app.js`), which covers all 7 destinations;
  `renderSimulatorMenu()`'s own reset is now redundant but kept, harmless. With the flag active,
  `_gsBlockIfExam()` blocks the two navigating actions with a toast (`gs_exam_block_toast`);
  expanding definitions still works.
- **XSS:** the user's query is never interpolated into the panel's `innerHTML` — only static
  `GLOSSARY`/`CHAPTERS` data is. No match highlighting, deliberately. Verified by an `N11` check.
- i18n: 5 new `gs_*` keys (ES/EN). Verified by the `N11` checks in
  `scripts/verify-runtime.js` (open/close, no forced navigation, expand, both navigating
  actions, the guard's lifecycle, XSS); the harness's `loadApp()` now also exposes
  `CHAPTERS`/`GLOSSARY` for these checks.

**Real defect found and fixed during manual browser verification (2026-07-08), not caught by
the mocked-DOM harness:** the document-level "click outside closes the panel" listener used
`e.target.closest('.search-box')`. Clicking a glossary result's `onclick="App._gsToggleTerm(i)"`
re-renders `#globalSearchResults`' `innerHTML` synchronously *during the click's target phase*
— which detaches the original clicked node from the DOM tree — *before* the event finishes
bubbling up to this listener on `document` (bubble phase). By the time the listener ran,
`e.target` was that now-disconnected node, so `.closest('.search-box')` returned `null` and the
panel closed immediately after every attempt to expand a term (visually: a flash-open then
instant close). Confirmed live with a Playwright-driven Chromium session (`e.target.isConnected
=== false` at the document listener) before fixing. Fixed by switching the check to
`e.composedPath()`, which is captured before dispatch starts and is unaffected by DOM mutations
made by earlier handlers in the same dispatch:
```js
const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
const insideSearchBox = path.some(el => el.classList && el.classList.contains('search-box'));
```
Not reproducible in `scripts/verify-runtime.js`'s mocked DOM: the mock's elements have no real
parent/child linkage, no `closest()`, no `composedPath()`, and its `fireEl()` helper invokes a
single element's listeners directly rather than dispatching a bubbling event — so there is no
way for that harness to observe a node's connectedness changing mid-dispatch. A static regression
check was added instead (same pattern as the existing `N5`/i18n static checks further down in
the file): `N11 fix: el listener "clic fuera" del buscador global usa composedPath(), no
e.target.closest()`, asserting the fixed code is present. Verified red (fails) against the
pre-fix source, green against the fix.

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
  Content Schema" above). Both share `scripts/lib/validate-utils.js` for the parts that were
  genuinely duplicated (loading browser globals from Node, the `FL-x.y.z` regex, the
  bilingual-field check), and both accept an optional file path argument (used by the
  pre-commit hook to validate the staged copy).
- `scripts/verify-runtime.js` loads the real `js/` modules into a mocked minimal DOM (no
  browser, no npm install) and exercises the behaviors fixed in the 2026-07-04 passes:
  sync freshness/flush, the script-load guards, the CDN-failure auth screen, state-derived
  `innerHTML` escaping, and the i18n residue/parity checks. If you fix a runtime behavior,
  add a check for it there.
- `scripts/validate-contrast.js` (added 2026-07-14) gates `css/styles.css` — parses the
  `:root` and `[data-theme="light"]` custom-property blocks and asserts WCAG AA 4.5:1 for
  every status-text/background pair in **both** themes, including `rgba()`-tinted
  backgrounds alpha-blended over `--surface` (the same real-render math a CSS engine would
  use, not a naive token-vs-token check). Same family as the other two: Node stdlib only,
  optional file-path argument for the staged copy, exit 1 on failure. Run it after any
  change to theme tokens or status-text colors. It only sees `css/styles.css`, though — it
  cannot detect JS-inline `style="color:..."` set from `js/app.js` templates; that surface
  is covered by the `N12` check in `verify-runtime.js` below. See "Contrast remediation
  (2026-07-14)" below for what both were built to catch.

The pre-commit gate is version-controlled at `.githooks/pre-commit` (activate once per clone:
`git config core.hooksPath .githooks`). It validates the **staged** copy of the three data
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
section above for what changed and why. The Phase 1
minor gaps (light BVA question coverage, missing FL-2.1.2 dedicated question) were closed
on 2026-07-14 — see below. No follow-up content work is currently pending.

**Phase 1 minor gaps — CLOSED (2026-07-14).** Both gaps were resolved by **replacing three
redundant/flawed questions** (bank stays at 120, per-chapter distribution intact, validator
unchanged — new ids are > 50 so the `lo`/`k`/`source` rule covers them automatically).
Design: `docs/superpowers/specs/2026-07-14-question-bank-gap-closure-design.md`.
- **BVA in Ch.4:** the original gap note undercounted — ids 15, 80 *and* 38 were all BVA,
  but all three were 2-value BVA (two on the same 1–100 domain). Replaced id 17 (decision
  tables were over-represented at 6 questions, and it carried the same unqualified
  "2^n rules" imprecision Phase 3 fixed in FLASHCARDS id 18) with id 122 (3-value BVA
  applied, fresh 10–50 domain), and id 31 (near-duplicate of id 20) with id 123 (the
  syllabus's own "x ≤ 10 miscoded as x = 10" defect-detection example). Both FL-4.2.2/K3,
  source "Syllabus v4.0 §4.2.2". BVA now has 5 questions; state transition keeps 4.
- **FL-2.1.2:** replaced id 43 (a literal duplicate of id 11 — same stem, same essential
  answer) with id 121 (FL-2.1.2/K1, the four good testing practices of §2.1.2; the three
  distractors are direct negations of the other three official practices).
  Source "Syllabus v4.0 §2.1.2".

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
