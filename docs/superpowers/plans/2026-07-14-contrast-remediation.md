# Contrast Remediation (C2 + I1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the two contrast findings from the 2026-07-14 UI review — status-feedback text illegible in the light theme (ratios 1.27–2.37:1) and `--text3` below WCAG AA in both themes — via semantic *-text tokens, plus a committed validator so this class of bug can't regress.

**Architecture:** Four new semantic text tokens (`--success-text`, `--warning-text`, `--danger-text`, `--primary-text`) defined per theme in `css/styles.css`'s `:root` / `[data-theme="light"]` blocks; every `color:` usage of a status color swaps to them (backgrounds/borders untouched). A new Node dev script `scripts/validate-contrast.js` (same family as the existing validators — no npm deps, never served to the browser) parses the token blocks and asserts WCAG AA ratios; written FIRST so it fails red against the current palette, then goes green with the fix. `--text3` is bumped in both themes. Final visual pass with Playwright in both themes.

**Tech Stack:** Vanilla CSS custom properties; Node (stdlib only) validator; `.githooks/pre-commit` extension; Playwright (`npx playwright`, v1.61 verified available) for visual verification.

**Design decisions (derived and WCAG-verified during planning, sRGB relative-luminance formula):**

| Token | Dark (`:root`) | Light (`[data-theme="light"]`) | Worst-case ratio dark / light |
|---|---|---|---|
| `--success-text` | `#81C784` (current hex, now tokenized) | `#1B5E20` | 5.88 / 6.52 (on 20% tint) |
| `--warning-text` | `#FFD54F` (idem) | `#7A5600` | 7.27 / 6.00 (on 20% tint) |
| `--danger-text` | `#EF9A9A` (idem) | `#B71C1C` | 6.09 / 5.03 (on 20% tint) |
| `--primary-text` | `#A29DFF` (new; `#8b85ff` gave 4.21 on badge tint) | `#4F46C4` | 5.37 / 5.44 (on 20% tint) |
| `--text3` | `#6666AA` → `#8C8CC8` | `#8888AA` → `#666688` | 4.69 (on `--bg4`) / 5.11 (on `#F5F6FF`) |

Rejected: `#2E7D32`/`#C62828` (Material 800s — fail 4.5 on the 20% tinted badge backgrounds at 4.25/4.31); reusing `--primary-dark` `#5A52D5` as light `--primary-text` (passes at 4.54 but with no headroom, and it would couple hover semantics to text semantics).

Deliberately out of scope (recorded, not silently dropped): the white letter on `.exam-option.correct/.wrong` solid circles (iconographic, redundant with border+bg), the `.rating-*:hover` solid-background transient states, `.r-dot` legend dots (color-only but paired with text), and the dark-theme hierarchy compression between `--text2` `#9999BB` and the new `--text3` `#8C8CC8` (visually checked in Task 4; if it reads wrong, the fallback is `#8484C4` which still passes on `--surface` at 4.66 though not on `--bg4`).

## Global Constraints

- Every changed `color:` must meet WCAG AA 4.5:1 against its real rendered background **in both themes** — including translucent rgba() backgrounds, which must be evaluated alpha-blended over the surface behind them.
- Only text `color:` declarations change. `background:`, `border-color:`, and the base palette tokens (`--success`, `--warning`, `--danger`, `--primary`, `--primary-light`) keep their current values and uses — they still drive borders, fills, and tints everywhere.
- No visual redesign: dark theme keeps its exact current status-text colors (they already pass — they just move into tokens); only `--primary-text` dark is a new value.
- `scripts/validate-contrast.js`: Node stdlib only, no npm install, follows the existing validator conventions (Spanish console output, exit 1 on failure, optional file-path argument for the staged copy — same as `validate-questions.js`).
- `node scripts/verify-runtime.js` must stay green (safety net; no `js/` or `index.html` changes are expected in Tasks 1–3).
- Do not bypass the pre-commit hook (`--no-verify` forbidden).

---

### Task 1: Contrast validator (red first)

**Files:**
- Create: `scripts/validate-contrast.js`

**Interfaces:**
- Consumes: `css/styles.css` `:root` and `[data-theme="light"]` custom-property blocks (regex-parsed).
- Produces: `node scripts/validate-contrast.js [optional-css-path]` → exit 0/1. Task 2 makes it pass; Task 3 extends its pair list via the `PAIRS` array; Task 4's hook change invokes it with the staged-copy path.

- [ ] **Step 1: Write the validator**

```js
/* Validador de contraste WCAG — arnés de desarrollo (no se sirve al navegador).
   Parsea los tokens de :root y [data-theme="light"] en css/styles.css y
   comprueba que cada par texto/fondo real (incluyendo fondos rgba() mezclados
   sobre la superficie) cumple AA 4.5:1 en AMBOS temas. Igual que los otros
   validadores: acepta una ruta opcional (copia staged) y sale con 1 si falla. */
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'css', 'styles.css');
const css = fs.readFileSync(SRC, 'utf8');

function block(re) {
  const m = css.match(re);
  if (!m) { console.error('No se encontró el bloque de tokens esperado'); process.exit(1); }
  const vars = {};
  for (const [, name, val] of m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[name.trim()] = val.trim();
  return vars;
}
const dark = block(/:root\s*\{([^}]+)\}/);
const light = { ...dark, ...block(/\[data-theme="light"\]\s*\{([^}]+)\}/) };

function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(fg, bg) {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
function blendOver(fg, alpha, bg) {
  return fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));
}

// Cada par: [etiqueta, token de texto, fondo]. El fondo es un token o
// {tint: token-base, alpha, over: token-superficie} para fondos rgba().
const PAIRS = [
  ['badge/verdict/history success', 'success-text', { tint: 'success', alpha: 0.2, over: 'surface' }],
  ['dc-option correct (tinte .1)', 'success-text', { tint: 'success', alpha: 0.1, over: 'surface' }],
  ['success sobre superficie', 'success-text', 'surface'],
  ['badge/rating/streak warning', 'warning-text', { tint: 'warning', alpha: 0.2, over: 'surface' }],
  ['exam-timer warning (tinte .1)', 'warning-text', { tint: 'warning', alpha: 0.1, over: 'surface' }],
  ['warning sobre superficie', 'warning-text', 'surface'],
  ['badge/rating danger', 'danger-text', { tint: 'danger', alpha: 0.2, over: 'surface' }],
  ['dc-option wrong / timer danger (tinte .1)', 'danger-text', { tint: 'danger', alpha: 0.1, over: 'surface' }],
  ['danger sobre superficie', 'danger-text', 'surface'],
  ['badge-primary (+20 XP)', 'primary-text', { tint: 'primary', alpha: 0.2, over: 'surface' }],
  ['glossary-term / primary sobre superficie', 'primary-text', 'surface'],
  ['text3 sobre superficie', 'text3', 'surface'],
  ['text3 sobre bg4 (peor caso)', 'text3', 'bg4'],
  ['text2 sobre superficie (guardia)', 'text2', 'surface'],
];

let errors = [];
for (const [themeName, vars] of [['oscuro', dark], ['claro', light]]) {
  for (const [label, fgTok, bgSpec] of PAIRS) {
    if (!vars[fgTok]) { errors.push(`[${themeName}] falta el token --${fgTok}`); continue; }
    const fg = hexToRgb(vars[fgTok]);
    const bg = typeof bgSpec === 'string'
      ? hexToRgb(vars[bgSpec])
      : blendOver(hexToRgb(vars[bgSpec.tint]), bgSpec.alpha, hexToRgb(vars[bgSpec.over]));
    const r = ratio(fg, bg);
    const ok = r >= 4.5;
    console.log(`  [${themeName}] ${label}: ${r.toFixed(2)}:1 ${ok ? '✅' : '❌'}`);
    if (!ok) errors.push(`[${themeName}] ${label}: ${r.toFixed(2)}:1 < 4.5:1`);
  }
}
if (errors.length) { console.error(`\n❌ ${errors.length} pares fallan AA:`); errors.forEach(e => console.error('  - ' + e)); process.exit(1); }
console.log('\n✅ Todos los pares de contraste cumplen AA en ambos temas.');
```

- [ ] **Step 2: Run it to verify it fails (red) against the current palette**

Run: `node scripts/validate-contrast.js`
Expected: exit 1. The four `*-text` tokens don't exist yet → "falta el token" errors for both themes, plus `text3` pairs failing (oscuro `text3 sobre bg4` ≈ 2.83, claro ≈ 3.17/3.42). This is the red baseline proving the validator detects today's real defects.

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-contrast.js
git commit -m "test(contrast): WCAG AA validator for theme text tokens (red against current palette)"
```
Note: this script is not yet wired into the pre-commit hook (Task 4 does that), so committing it red does not block anything.

---

### Task 2: Semantic *-text tokens and color swaps (green)

**Files:**
- Modify: `css/styles.css` (token blocks at :root/`[data-theme="light"]`, plus the exact `color:` lines listed below)

**Interfaces:**
- Consumes: the validator from Task 1.
- Produces: tokens `--success-text`, `--warning-text`, `--danger-text`, `--primary-text` available to all CSS.

- [ ] **Step 1: Add the four tokens to both theme blocks**

In `:root` (after the `--danger: #f44336;` line, `css/styles.css:13`):

```css
  --success-text: #81C784;
  --warning-text: #FFD54F;
  --danger-text: #EF9A9A;
  --primary-text: #A29DFF;
```

In `[data-theme="light"]` (after `--text3`, before `--shadow`):

```css
  --success-text: #1B5E20;
  --warning-text: #7A5600;
  --danger-text: #B71C1C;
  --primary-text: #4F46C4;
```

- [ ] **Step 2: Swap every status text `color:` to its token — complete list, `color:` only**

| Line (pre-edit) | Selector | Change `color:` to |
|---|---|---|
| 231 | `.streak-count` | `var(--warning-text)` |
| 455 | `.badge-primary` | `var(--primary-text)` |
| 456 | `.badge-success` | `var(--success-text)` |
| 457 | `.badge-warning` | `var(--warning-text)` |
| 458 | `.badge-danger` | `var(--danger-text)` |
| 587 | `.dc-option.correct` | `var(--success-text)` |
| 588 | `.dc-option.wrong` | `var(--danger-text)` |
| 878 | `.rating-hard` | `var(--danger-text)` |
| 880 | `.rating-ok` | `var(--warning-text)` |
| 882 | `.rating-easy` | `var(--success-text)` |
| 931 | `.exam-history-score.pass` | `var(--success-text)` |
| 932 | `.exam-history-score.fail` | `var(--danger-text)` |
| 978 | `.exam-timer.warning` | `var(--warning-text)` |
| 979 | `.exam-timer.danger` | `var(--danger-text)` |
| 1081 | `.results-verdict.pass` | `var(--success-text)` |
| 1082 | `.results-verdict.fail` | `var(--danger-text)` |
| 1091 | `.review-item-correct` | `var(--success-text)` |
| 1092 | `.review-item-wrong` | `var(--danger-text)` |
| 1142 | `.glossary-term` | `var(--primary-text)` |
| 1347 | `.text-success` | `var(--success-text)` |
| 1348 | `.text-danger` | `var(--danger-text)` |
| 1349 | `.text-warning` | `var(--warning-text)` |
| 1446 | `.auth-message--error` | `var(--danger-text)` |
| 1451 | `.auth-message--success` | `var(--success-text)` |
| 1936 | `.logout-btn:hover` | `var(--danger-text)` |

Everything else on those lines (backgrounds, borders, font sizes, the `:hover` solid-background rating states at 879/881/883, `border-color: var(--danger)` at 1935) stays exactly as is.

- [ ] **Step 3: Run the validator — the token pairs must now pass; text3 still red**

Run: `node scripts/validate-contrast.js`
Expected: all `*-text` pairs ✅ in both themes; the two `text3` pairs still ❌ (fixed in Task 3), so exit is still 1. Confirm the failure list contains ONLY text3 pairs.

- [ ] **Step 4: Commit**

```bash
git add css/styles.css
git commit -m "fix(css): semantic *-text tokens make status feedback legible in the light theme"
```

---

### Task 3: `--text3` AA bump (validator fully green)

**Files:**
- Modify: `css/styles.css:23` (`:root` `--text3`) and `css/styles.css:46` (`[data-theme="light"]` `--text3`)

**Interfaces:**
- Consumes: validator; Produces: nothing downstream.

- [ ] **Step 1: Change the two token values**

- `:root`: `--text3: #6666AA;` → `--text3: #8C8CC8;`
- `[data-theme="light"]`: `--text3: #8888AA;` → `--text3: #666688;`

- [ ] **Step 2: Run the validator — fully green now**

Run: `node scripts/validate-contrast.js`
Expected: exit 0, every pair ✅ in both themes, closing line "✅ Todos los pares de contraste cumplen AA en ambos temas."

- [ ] **Step 3: Run the runtime harness as a safety net**

Run: `node scripts/verify-runtime.js`
Expected: all green (CSS-only change; guards against accidental damage elsewhere).

- [ ] **Step 4: Commit**

```bash
git add css/styles.css
git commit -m "fix(css): raise --text3 to WCAG AA in both themes"
```

---

### Task 4: Hook wiring, visual verification, docs

**Files:**
- Modify: `.githooks/pre-commit` (one line — the hook's existing `check()` helper already implements the staged-copy pattern)
- Modify: `AGENTS.md` (add the validator to "No Tests or Linter"; record this remediation in the UI/UX section), `CLAUDE.md` (mirror: validator list + one-line remediation note)

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Extend the pre-commit hook**

In `.githooks/pre-commit`, after the existing two `check` calls (lines 31–32):

```sh
check "js/questions.js" "scripts/validate-questions.js"
check "js/content.js" "scripts/validate-content.js"
check "css/styles.css" "scripts/validate-contrast.js"
```

(The `check()` helper at the top of the hook already handles the staged-copy extraction via `git show :file`, the abort message, and the tmpfile cleanup — and `validate-contrast.js` accepts the file-path argument by design, Task 1.)

Verify the gate actually blocks: temporarily set `--text3: #8888AA;` back in the light block, `git add css/styles.css`, attempt `git commit -m "tmp"` → the hook must abort citing validate-contrast; then restore the value and `git reset` the staging.

- [ ] **Step 2: Visual verification with Playwright (both themes)**

Serve the app (`python -m http.server 8000`) and use `npx playwright` (v1.61, verified installed) with a small throwaway script in the scratchpad — NOT committed — that: opens `http://localhost:8000`, and on the auth screen alone (no login needed for a token check) screenshots both themes by toggling `localStorage.mycampus_theme`/`data-theme`; then injects `document.documentElement.setAttribute('data-theme','light')` and screenshots the app shell if a session is available. At minimum capture: auth screen (error message state if reproducible), and — via direct DOM injection of representative elements (`badge-warning`, `dc-option.correct`, `streak-count`) into a test page that links `css/styles.css` — the status elements in both themes. Confirm by eye: legible status text in light, no broken look in dark, and that the new dark `--text3` doesn't visually collapse into `--text2` (fallback documented in the design table if it does).

- [ ] **Step 3: Update docs**

- `AGENTS.md` → "No Tests or Linter": add `scripts/validate-contrast.js` as a fourth dev script (what it gates, the staged-copy hook trigger). UI section: add a "Contrast remediation (2026-07-14)" entry summarizing the tokens and the two findings (C2/I1) from the ui-ux-pro-max review.
- `CLAUDE.md` → mirror both (validator list in "No Tests, No Linter"; one paragraph in the UI/UX section referencing AGENTS.md for detail).

- [ ] **Step 4: Final verification and commit**

```bash
node scripts/validate-contrast.js && node scripts/verify-runtime.js
git add .githooks/pre-commit AGENTS.md CLAUDE.md
git commit -m "chore(hooks)+docs: gate css contrast in pre-commit and record the remediation"
```

---

## Final Verification (after all tasks)

```bash
node scripts/validate-contrast.js    # exit 0, all pairs AA in both themes
node scripts/verify-runtime.js       # unchanged, green
git log --oneline -5                 # the 4 commits above
```
Plus the Task 4 Playwright screenshots reviewed by a human eye (the validator proves ratios, not aesthetics).
