# Reduced Motion (I2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Honor `prefers-reduced-motion` app-wide (finding I2 of the 2026-07-14 UI review): today 0 of ~2000 CSS lines gate motion, with 3 infinite pulse animations (onboarding highlight, TTS button, exam-timer danger), a 3D flip, view fades, toast slides, and a JS-driven carousel.

**Architecture:** (1) One global "blunt" media block in `css/styles.css` — `animation-duration/transition-duration: 0.01ms !important` under `@media (prefers-reduced-motion: reduce)` — the industry-standard reset that neutralizes every current AND future animation, including the carousel's inline styles (stylesheet `!important` beats non-important inline). Placed immediately BEFORE the `:focus-visible` section so that section's "last in file" comment stays literally true (the media block only touches durations, no cascade interaction with `outline`). (2) A one-line guard in `_slideFlashcard` so the carousel's `setTimeout` sequencing collapses to 0ms too (CSS alone would leave ~500ms of dead delay); the `typeof matchMedia` guard keeps the mocked harness (no `matchMedia`) at 250ms so the 12 existing N10 timing checks are untouched. Gated by 2 new N15 static checks; verified in a real browser with Playwright's `emulateMedia({ reducedMotion: 'reduce' })` plus a no-regression pass without emulation.

**Tech Stack:** Vanilla CSS/JS; `scripts/verify-runtime.js` (N15); Playwright (`npx playwright`, available).

**Hook constraint (as in every 2026-07-14 block):** red N15 checks cannot be committed alone — Task 1 commits checks+implementation together with the red run captured as evidence.

## Global Constraints

- The timer-danger state must stay distinguishable without its pulse: it already is (color + tinted background + mono digits) — no extra work, but the docs note it (motion never was the only signal).
- No i18n changes; no behavior changes beyond the duration collapse.
- `node scripts/verify-runtime.js` (all green, incl. the 12 N10 carousel timing checks at their original 250ms) and `node scripts/validate-contrast.js` green at every commit; no `--no-verify`.

---

### Task 1: Global CSS block + carousel guard (N15 red→green)

**Files:**
- Modify: `scripts/verify-runtime.js` (new N15 block after N14), `css/styles.css` (one media block), `js/app.js` (one line in `_slideFlashcard`)

- [ ] **Step 1: Add the N15 checks (new block after the N14 block, same style)**

```js
  /* ---- N15: prefers-reduced-motion (I2, revisión UI 2026-07-14) ---- */
  {
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    // Bloque global "blunt": neutraliza toda animación/transición actual Y futura
    // (el !important gana incluso a los estilos inline del carrusel).
    check('N15 motion: styles.css define el bloque global prefers-reduced-motion',
      /@media \(prefers-reduced-motion: reduce\)[\s\S]{0,400}animation-duration:\s*0\.01ms !important[\s\S]{0,400}transition-duration:\s*0\.01ms !important/.test(cssSrc));
    // El CSS mata el movimiento pero no los setTimeout: sin esto el carrusel
    // metía ~500ms de retardo muerto con reduced-motion activo.
    check('N15 motion: el carrusel de flashcards colapsa su duración con prefers-reduced-motion',
      /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/.test(appSrc));
  }
```

- [ ] **Step 2: Red run** — `node scripts/verify-runtime.js` → exactly these 2 checks ❌, everything else ✅ (capture for the report).

- [ ] **Step 3: The CSS block** — insert in `css/styles.css` immediately BEFORE the `/* ===== FOCO VISIBLE (C1, ...) ===== */` comment block (so that section stays last in the file, keeping its own comment truthful):

```css
/* ===== MOVIMIENTO REDUCIDO (I2, revisión UI 2026-07-14) =====
   Bloque global estándar: con prefers-reduced-motion activo, toda animación y
   transición (actuales y futuras) colapsa a efectivamente-instantánea. El
   !important gana también a los estilos inline del carrusel de flashcards.
   El estado de peligro del timer sigue distinguible sin su pulso (color +
   fondo tintado). */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: The `js/app.js` edit** — in `_slideFlashcard` (line ~525), replace `const dur = 250;` with:

```js
    // I2: con prefers-reduced-motion, el CSS ya anula el movimiento — esto
    // elimina además el retardo muerto de los dos setTimeout. El typeof
    // protege el arnés mockeado (sin matchMedia), que se queda en 250ms.
    const dur = (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) ? 0 : 250;
```

- [ ] **Step 5: Green run + commit**

`node scripts/verify-runtime.js` → all green including both N15 AND the 12 N10 checks unchanged (the harness has no `matchMedia`, so `dur` stays 250 there — verify N10 still passes); `node scripts/validate-contrast.js` exit 0.

```bash
git add scripts/verify-runtime.js css/styles.css js/app.js
git commit -m "feat(a11y): honor prefers-reduced-motion globally and in the flashcard carousel"
```

---

### Task 2: Real-browser verification (Playwright, both modes — no commit expected)

**Files:** none committed; scripts/screenshots in the scratchpad only.

- [ ] **Step 1: With `page.emulateMedia({ reducedMotion: 'reduce' })`** (serve via `python -m http.server 8000`, bypass auth as in prior blocks: hide `#auth-screen`, show `#app-container`, `App.init()`):
  1. Flashcards view: `getComputedStyle(document.getElementById('flashcardInner')).transitionDuration` → `'0.01ms'` (the 3D flip is instant).
  2. Carousel: timestamp before clicking `#fcNext` and poll until the card counter changes → elapsed must be < 100ms (both `setTimeout`s at 0). Also `document.getElementById('flashcard').style.transition` during the swap contains `0ms`.
  3. Exam timer: `App.startFullExam?` — simpler: add class `danger` to `#examTimer` via evaluate and read `getComputedStyle(...).animationDuration` → `'0.01ms'`.
  4. Onboarding highlight (`#onboarding-highlight`): computed `animationDuration` → `'0.01ms'`.
- [ ] **Step 2: WITHOUT emulation (no-regression):** same probes → flip `0.5s`, carousel elapsed ≥ 450ms (two 250ms phases), timer/onboarding animations at their original durations. The carousel must still visibly slide.
- [ ] **Step 3: Report** — exact computed values and elapsed timings for both modes. Any failure: capture evidence, report DONE_WITH_CONCERNS/BLOCKED; do NOT patch code in this task.

---

### Task 3: Docs sync

**Files:** `AGENTS.md`, `CLAUDE.md`

- [ ] **Step 1:** AGENTS.md — I2 entry in the 2026-07-14 remediation narrative: the global blunt block (why: covers future animations, beats inline styles), its placement BEFORE the `:focus-visible` section (which must stay last), the carousel `dur` guard (and why the `typeof` protects the harness/N10), the timer-not-color-only note, the 2 N15 checks, real-browser verification in both modes. Mark I2 closed in the pending-blocks list (leaving I3/I7/I8 + recorded follow-ups open).
- [ ] **Step 2:** CLAUDE.md — summary mirror, no drift.
- [ ] **Step 3:** Final verification + commit:

```bash
node scripts/verify-runtime.js && node scripts/validate-contrast.js
git add AGENTS.md CLAUDE.md
git commit -m "docs: record the I2 reduced-motion remediation"
```

---

## Final Verification (after all tasks)

```bash
node scripts/verify-runtime.js      # all green, incl. 2 N15 + the untouched 12 N10
node scripts/validate-contrast.js   # exit 0
git log --oneline -3
```
Plus Task 2's dual-mode browser evidence reviewed by eye.
