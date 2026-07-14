# A11y Quick Wins (I6+I5+I4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close three findings from the 2026-07-14 UI review: **I6** — toasts are invisible to screen readers (no live region; the exam-guard toast is the *only* feedback when navigation is blocked); **I5** — five icon-only controls have no accessible name; **I4** — form inputs under 16px trigger iOS auto-zoom on focus.

**Architecture:** A fourth attribute handler in `i18n.apply()` (`data-i18n-aria` → `aria-label`, mirroring the existing `data-i18n-title` block) so accessible names are bilingual and switch with the language; 4 new i18n keys (165→169); static attributes in `index.html` (live region on `#toastContainer`, `aria-hidden` on the decorative `#xpPopup`, `data-i18n-aria` on the five controls); four CSS `font-size` bumps to `1rem`. All gated by new `N13` static checks in `scripts/verify-runtime.js` following the exact `N11 fix`/`N12` pattern.

**Tech Stack:** Vanilla JS/CSS; `scripts/verify-runtime.js` harness; Playwright (`npx playwright`, available) for a visual spot-check.

**Hook constraint that shapes task structure:** the pre-commit hook runs `verify-runtime.js` whenever `js/`, `index.html`, or the harness itself is staged — so a red N13 check **cannot be committed on its own** (it would block its own commit). Each task therefore adds its checks, captures the red run as evidence, implements, and commits checks+implementation together (green at commit time). `--no-verify` stays forbidden.

## Global Constraints

- All new user-facing strings go through i18n: ES/EN paired keys (the harness parity check enforces this automatically once the keys exist).
- New keys and their exact values (insert adjacent to the existing `collapse_menu_title`/tooltip keys in each language object of `js/i18n.js`):
  - `mobile_menu_aria`: ES `"Abrir menú"` / EN `"Open menu"`
  - `fc_prev_aria`: ES `"Tarjeta anterior"` / EN `"Previous card"`
  - `fc_next_aria`: ES `"Tarjeta siguiente"` / EN `"Next card"`
  - `close_label`: ES `"Cerrar"` / EN `"Close"`
- No behavior/logic changes anywhere — attributes, one applier block, four CSS declarations only.
- Explicitly out of scope (recorded, not silently dropped): `#themeToggle` stays a `<div>` (converting it to `<button>` belongs to the C1 keyboard-operability block); `.name-edit-input`'s 0.85rem stays (the name-edit feature is hover-only, unreachable on touch — finding I3, future block); the search box stays hidden ≤768px (finding I7).
- `node scripts/verify-runtime.js` and `node scripts/validate-contrast.js` green at every commit.

---

### Task 1: Live region + accessible names (I6 + I5)

**Files:**
- Modify: `scripts/verify-runtime.js` (new N13 a11y block, after the N12 block)
- Modify: `js/i18n.js` (aria block in `apply()`, 4 keys ×2 languages)
- Modify: `index.html` (7 attribute edits)

**Interfaces:**
- Consumes: `i18n.apply()`'s existing structure (`js/i18n.js:396-410`).
- Produces: `data-i18n-aria` as a project-wide mechanism (documented in Task 3); keys `mobile_menu_aria`, `fc_prev_aria`, `fc_next_aria`, `close_label`.

- [ ] **Step 1: Add the N13 a11y checks to `scripts/verify-runtime.js`**

Insert after the closing `}` of the N12 block (search for `N12 contraste:`), same style:

```js
  /* ---- N13: accesibilidad — live region, nombres accesibles (I6+I5, revisión UI 2026-07-14) ---- */
  {
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const i18nSrc = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');

    // I6: el toast del guard de examen es el ÚNICO feedback cuando se bloquea la
    // navegación — sin live region, un lector de pantalla no se entera de nada.
    check('N13 a11y: #toastContainer es live region (aria-live="polite")',
      /id="toastContainer"[^>]*aria-live="polite"|aria-live="polite"[^>]*id="toastContainer"/.test(htmlSrc));
    // El popup de XP es decorativo (su información llega también por toasts/contadores);
    // sin aria-hidden duplicaría anuncios o metería ruido en el lector.
    check('N13 a11y: #xpPopup está oculto para lectores (aria-hidden="true")',
      /id="xpPopup"[^>]*aria-hidden="true"|aria-hidden="true"[^>]*id="xpPopup"/.test(htmlSrc));
    // I5: mecanismo data-i18n-aria — cuarto bloque del applier, espejo de data-i18n-title.
    check('N13 a11y: i18n.apply() aplica data-i18n-aria como aria-label',
      /data-i18n-aria/.test(i18nSrc) && /setAttribute\('aria-label'/.test(i18nSrc));
    // I5: los cinco controles icon-only llevan nombre accesible i18n.
    for (const [id, key] of [
      ['mobileMenuBtn', 'mobile_menu_aria'],
      ['fcPrev', 'fc_prev_aria'],
      ['fcNext', 'fc_next_aria'],
      ['avatarModalClose', 'close_label'],
      ['sidebarToggle', 'collapse_menu_title'],
    ]) {
      const re = new RegExp(`id="${id}"[^>]*data-i18n-aria="${key}"|data-i18n-aria="${key}"[^>]*id="${id}"`);
      check(`N13 a11y: #${id} lleva data-i18n-aria="${key}"`, re.test(htmlSrc));
    }
  }
```

- [ ] **Step 2: Run the harness to capture the red baseline**

Run: `node scripts/verify-runtime.js`
Expected: exactly the 8 new N13 checks ❌ (live region, xpPopup, applier, 5 controls), everything else ✅. Save this output for the report — it proves the checks detect today's real gaps.

- [ ] **Step 3: Extend `i18n.apply()`**

In `js/i18n.js`, after the `data-i18n-title` block (lines 405-408) and before the `document.documentElement.lang` line:

```js
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', this.t(key));
    });
```

- [ ] **Step 4: Add the 4 keys to both language objects**

Per Global Constraints, in both `es:` and `en:` objects of `TRANSLATIONS`, adjacent to the existing tooltip keys (`collapse_menu_title` etc.). Bilingual parity is enforced by the existing harness check.

- [ ] **Step 5: The 7 `index.html` attribute edits**

| Line (approx.) | Element | Add |
|---|---|---|
| 107 | `<button class="sidebar-toggle" id="sidebarToggle" ...>` | `data-i18n-aria="collapse_menu_title"` |
| 177 | `<button class="mobile-menu-btn" id="mobileMenuBtn">` | `data-i18n-aria="mobile_menu_aria" data-i18n-title="mobile_menu_aria"` |
| 333 | `<button class="fc-arrow fc-prev" id="fcPrev">` | `data-i18n-aria="fc_prev_aria"` |
| 346 | `<button class="fc-arrow fc-next" id="fcNext">` | `data-i18n-aria="fc_next_aria"` |
| 472 | `<div class="toast-container" id="toastContainer">` | `aria-live="polite"` |
| 475 | `<div class="xp-popup" id="xpPopup">` | `aria-hidden="true"` |
| 482 | `<button class="avatar-modal-close" id="avatarModalClose">` | `data-i18n-aria="close_label"` |

- [ ] **Step 6: Green run + commit (checks + implementation together — see hook constraint)**

Run: `node scripts/verify-runtime.js` → all green including the 8 N13 checks and the i18n parity check at 169/169.

```bash
git add scripts/verify-runtime.js js/i18n.js index.html
git commit -m "feat(a11y): live region for toasts and i18n aria-labels for icon-only controls"
```
(The hook re-runs the harness on this staging — it must pass.)

---

### Task 2: Inputs at 16px (I4)

**Files:**
- Modify: `scripts/verify-runtime.js` (extend the N13 block)
- Modify: `css/styles.css` (4 `font-size` declarations)

**Interfaces:**
- Consumes: the N13 block created in Task 1 (append inside it or as a sibling block right after).

- [ ] **Step 1: Add the font-size checks**

Append inside the N13 block (after the `for` loop):

```js
    // I4: inputs <16px provocan auto-zoom en iOS al enfocar. 1rem = 16px (html base).
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    for (const sel of ['.search-input {', '.select-input {', '.search-input-full {', '.auth-field input {']) {
      const i = cssSrc.indexOf(sel);
      const block = i >= 0 ? cssSrc.slice(i, cssSrc.indexOf('}', i)) : '';
      check(`N13 a11y: ${sel.replace(' {', '')} usa font-size: 1rem (sin auto-zoom iOS)`,
        /font-size:\s*1rem/.test(block));
    }
```
(Selector strings include the trailing ` {` so `.search-input {` cannot match `.search-input-full {` or `.search-input::placeholder`.)

- [ ] **Step 2: Red run**

Run: `node scripts/verify-runtime.js` → exactly the 4 new checks ❌ (0.85 / 0.875 / 0.9 / 0.95rem today), rest ✅. Capture for the report.

- [ ] **Step 3: The 4 CSS edits (`font-size` only, nothing else in each rule)**

| Selector | Current | New |
|---|---|---|
| `.search-input` | `font-size: 0.85rem;` | `font-size: 1rem;` |
| `.select-input` | `font-size: 0.875rem;` | `font-size: 1rem;` |
| `.search-input-full` | `font-size: 0.9rem;` | `font-size: 1rem;` |
| `.auth-field input` | `font-size: 0.95rem;` | `font-size: 1rem;` |

- [ ] **Step 4: Green run + contrast validator (styles.css changed → hook runs it)**

Run: `node scripts/verify-runtime.js` (all green) and `node scripts/validate-contrast.js` (exit 0 — font sizes don't affect it, safety net).

- [ ] **Step 5: Playwright visual spot-check (scratchpad, NOT committed)**

Serve the repo (`python -m http.server 8000`, background, kill afterwards) and screenshot: the auth screen (fields at 1rem — check no overflow in the 420px card) and, via a scratchpad test page linking the real stylesheet, the topbar search box (fixed 200px width) and the flashcards deck `<select>`. Look at the screenshots (Read them) and confirm nothing overflows or wraps. Report what you see.

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-runtime.js css/styles.css
git commit -m "fix(a11y): 16px form inputs to stop iOS focus auto-zoom"
```

---

### Task 3: Docs sync

**Files:**
- Modify: `AGENTS.md`, `CLAUDE.md`

**Interfaces:** consumes Tasks 1–2 being committed (docs must describe reality).

- [ ] **Step 1: AGENTS.md**

- i18n section: `data-i18n-aria="key"` added to the attribute list (sets `aria-label`, bilingual, switches with language); key count updated wherever stated (165 → **169**, noting the 4 `*_aria`/`close_label` keys added 2026-07-14).
- UI/UX section: add an entry under the 2026-07-14 remediation narrative: I6 (toastContainer live region + xpPopup aria-hidden and why), I5 (the five controls + the applier mechanism), I4 (the four inputs to 1rem, iOS auto-zoom), all gated by N13; out-of-scope notes (themeToggle→C1, name-edit-input→I3, search-hidden-mobile→I7) so the pending blocks stay visible.

- [ ] **Step 2: CLAUDE.md**

Mirror in summary form: the i18n bullet (attribute list + 169 keys) and one short paragraph in the UI/UX section pointing to AGENTS.md.

- [ ] **Step 3: Consistency grep**

Run:
```bash
grep -n "165" AGENTS.md CLAUDE.md
grep -n "data-i18n-aria" AGENTS.md CLAUDE.md
```
Expected: no stale "165 keys" claims remain (other uses of the number 165, if any, are unrelated — judge by context); both files mention the new attribute.

- [ ] **Step 4: Final verification + commit**

```bash
node scripts/verify-runtime.js && node scripts/validate-contrast.js
git add AGENTS.md CLAUDE.md
git commit -m "docs: record the a11y quick wins (live region, aria-labels, 16px inputs)"
```

---

## Final Verification (after all tasks)

```bash
node scripts/verify-runtime.js      # all green, incl. 12 N13 checks, i18n 169/169
node scripts/validate-contrast.js   # exit 0, untouched
git log --oneline -4
```
Plus the Task 2 screenshots reviewed by eye, and a quick manual sanity pass: switch language on the auth screen and confirm (dev tools) that `aria-label` values switch with it.
