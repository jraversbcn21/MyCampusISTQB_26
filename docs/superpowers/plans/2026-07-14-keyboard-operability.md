# Keyboard Operability (C1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every primary interactive control operable by keyboard (finding C1 of the 2026-07-14 UI review): exam options/dots, daily-challenge options, dashboard stat-cards, curriculum chapter headers and topic items (scope extension approved 2026-07-14), and the theme toggle — plus a visible focus indicator app-wide.

**Architecture:** Three mechanisms. (1) `#themeToggle` becomes a real `<button>` (native keyboard for free). (2) Template-rendered interactive `<div>`s get `role="button" tabindex="0"` in their `innerHTML` templates plus ONE delegated `keydown` listener on `document` in `App.init()` (Enter/Space over `[role="button"]` → `click()`) — a single listener survives every `innerHTML` regeneration and covers future templates too. (3) A global `:focus-visible` rule at the END of `css/styles.css` (deliberate: several input rules declare `outline: none` at equal specificity 0-1-0; being later in the file, the new rule wins the `outline` property on keyboard focus). Plus one keyboard-UX repair: `selectAnswer()` re-renders `innerHTML`, destroying the focused node — it now restores focus to the clicked option. Gated by N14 static checks; verified with a real-browser Playwright keyboard pass.

**Tech Stack:** Vanilla JS/CSS; `scripts/verify-runtime.js` (N14); Playwright (`npx playwright`, available).

**Hook constraint (same as the previous blocks):** the pre-commit hook runs the harness when `js/`, `index.html`, or the harness is staged — red N14 checks cannot be committed alone; each task commits checks+implementation together with the red run captured as evidence.

## Global Constraints

- New i18n key (both language objects, adjacent to the other `*_aria` keys added 2026-07-14): `goto_question_aria`: ES `"Ir a la pregunta"` / EN `"Go to question"` → **170 keys total**.
- `role`/`tabindex` go ONLY on elements that are actually interactive: the `topic-item` template must apply them only in its `hasLesson` branch; exam options only when NOT in review mode.
- No behavior changes beyond the specified focus-restore in `selectAnswer()`; all existing `onclick`s stay.
- Deliberately out of scope (recorded in Task 4, not silently dropped): `aria-expanded` on chapter headers (needs sync in `toggleChapter`, which today only toggles a class); focus management in `goToQuestion()` (question change, focus stays acceptable); keyboard support in the global-search dropdown (belongs to the I7 follow-up); the prior block's recorded minors (toast emoji aria-hidden, assertive toasts, `#globalSearch` label).
- `node scripts/verify-runtime.js` and `node scripts/validate-contrast.js` green at every commit; no `--no-verify`.

---

### Task 1: Exam surface + delegated handler + visible focus

**Files:**
- Modify: `scripts/verify-runtime.js` (new N14 block after N13), `js/app.js` (2 templates, `selectAnswer`, 1 listener in `init`), `js/i18n.js` (1 key ×2), `css/styles.css` (`:focus-visible` rule at end of file)

**Interfaces:**
- Produces: the delegated `[role="button"]` keydown pattern (Task 2 reuses it — no more JS needed there); the `:focus-visible` rule; key `goto_question_aria`.

- [ ] **Step 1: Add the N14 checks (after the N13 block, same style)**

```js
  /* ---- N14: teclado (C1, revisión UI 2026-07-14) — chequeos estáticos ---- */
  {
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    // Un único listener delegado en document cubre todos los divs role="button"
    // de las plantillas innerHTML (que se regeneran constantemente).
    check('N14 teclado: handler delegado Enter/Espacio→click sobre [role="button"] en app.js',
      /e\.key === 'Enter'/.test(appSrc) && /getAttribute\('role'\) === 'button'/.test(appSrc));
    check('N14 teclado: las opciones del examen llevan role/tabindex/aria-pressed cuando son interactivas',
      /onclick="App\.selectAnswer\(\$\{i\}\)" role="button" tabindex="0" aria-pressed="\$\{i === selected\}"/.test(appSrc));
    check('N14 teclado: los dots del examen llevan role/tabindex y aria-label i18n',
      /onclick="App\.goToQuestion\(\$\{i\}\)" role="button" tabindex="0" aria-label="\$\{i18n\.t\('goto_question_aria'\)\} \$\{i \+ 1\}"/.test(appSrc));
    check('N14 teclado: selectAnswer restaura el foco tras regenerar el innerHTML',
      /getElementById\('opt' \+ optIndex\)/.test(appSrc));
    check('N14 teclado: styles.css define :focus-visible con outline visible',
      /:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--primary\)/.test(cssSrc));
  }
```

- [ ] **Step 2: Red run** — `node scripts/verify-runtime.js` → exactly these 5 checks ❌, rest ✅. Capture for the report.

- [ ] **Step 3: The `js/app.js` edits**

(a) Exam option template (`renderExamQuestion`, lines ~784-788) — the whole attribute group is conditional so review-mode options stay inert:

```js
          return `
            <div class="exam-option ${cls}" ${isReviewing ? '' : `onclick="App.selectAnswer(${i})" role="button" tabindex="0" aria-pressed="${i === selected}"`} id="opt${i}">
              <div class="exam-option-letter">${letters[i]}</div>
              ${opt}
            </div>`;
```

(b) Exam dot template (`renderExamDots`, line ~809):

```js
      return `<div class="exam-dot ${cls}" onclick="App.goToQuestion(${i})" role="button" tabindex="0" aria-label="${i18n.t('goto_question_aria')} ${i + 1}">${i + 1}</div>`;
```

(c) `selectAnswer` (lines ~813-817) — focus restore:

```js
  selectAnswer(optIndex) {
    this.examAnswers[this.examCurrentQ] = optIndex;
    this.renderExamQuestion();
    this.renderExamDots();
    // C1: renderExamQuestion regenera el innerHTML y destruye el nodo enfocado —
    // sin esto, responder con Enter devolvía el foco al body y el usuario de
    // teclado tenía que tabular desde el principio en cada pregunta.
    const opt = document.getElementById('opt' + optIndex);
    if (opt && typeof opt.focus === 'function') opt.focus();
  },
```

(d) Delegated listener in `App.init()`, next to the existing `themeToggle` click listener (~line 1220):

```js
    // Teclado (C1): los controles renderizados por plantilla son divs con
    // role="button" — innerHTML los regenera constantemente, así que un único
    // listener delegado en document los cubre todos, actuales y futuros.
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if ((e.key === 'Enter' || e.key === ' ') && t && t.getAttribute && t.getAttribute('role') === 'button' && typeof t.click === 'function') {
        e.preventDefault(); // evita el scroll de Espacio y el doble disparo
        t.click();
      }
    });
```

- [ ] **Step 4: i18n key** — add `goto_question_aria` to both language objects per Global Constraints (harness parity → 170/170).

- [ ] **Step 5: `:focus-visible` at the very END of `css/styles.css`**

```css
/* ===== FOCO VISIBLE (C1, revisión UI 2026-07-14) =====
   Al final del fichero a propósito: varias reglas de inputs declaran
   outline: none con la misma especificidad (0-1-0) — al ir después, esta
   regla gana la propiedad outline cuando el foco viene de teclado. */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

- [ ] **Step 6: Green run + commit**

`node scripts/verify-runtime.js` (all green, 170/170) and `node scripts/validate-contrast.js` (exit 0).

```bash
git add scripts/verify-runtime.js js/app.js js/i18n.js css/styles.css
git commit -m "feat(a11y): keyboard-operable exam (options/dots), delegated key handler, visible focus"
```

---

### Task 2: Remaining surfaces (daily challenge, stat-cards, curriculum, theme toggle)

**Files:**
- Modify: `scripts/verify-runtime.js` (extend N14), `js/app.js` (3 templates), `index.html` (5 edits), `css/styles.css` (`.theme-btn` reset)

**Interfaces:**
- Consumes: the delegated handler from Task 1 (no new JS listeners needed).

- [ ] **Step 1: Extend the N14 block (after Task 1's checks, inside the same block)**

```js
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N14 teclado: las opciones del desafío diario llevan role/tabindex',
      /id="dcOpt\$\{i\}" role="button" tabindex="0"/.test(appSrc));
    check('N14 teclado: los topics del curriculum llevan role/tabindex SOLO cuando tienen lección',
      /navigateToLesson\(\$\{ch\.id\}, '\$\{t\.id\}'\)" role="button" tabindex="0"/.test(appSrc));
    check('N14 teclado: las cabeceras de capítulo llevan role/tabindex',
      /toggleChapter\(\$\{i\}\)" role="button" tabindex="0"/.test(appSrc));
    check('N14 teclado: las 4 stat-cards del dashboard llevan role/tabindex',
      (htmlSrc.match(/class="stat-card" onclick="App\.navigate\('[a-z]+'\)" role="button" tabindex="0"/g) || []).length === 4);
    check('N14 teclado: #themeToggle es un <button> real, no un div',
      /<button[^>]*id="themeToggle"/.test(htmlSrc) && !/<div[^>]*id="themeToggle"/.test(htmlSrc));
```
Note: `appSrc` must be re-read after Task 1 only if this runs standalone — it doesn't: this code appends inside the same N14 block where `appSrc`/`cssSrc` are already defined; only `htmlSrc` is new.

- [ ] **Step 2: Red run** — exactly these 5 new checks ❌. Capture.

- [ ] **Step 3: `js/app.js` template edits**

(a) Daily challenge (line ~261):
```js
          <div class="dc-option" onclick="App.answerDailyChallenge(${i})" id="dcOpt${i}" role="button" tabindex="0">
```
(b) Topic item (line ~345) — attributes only in the `hasLesson` branch:
```js
          <div class="topic-item" ${hasLesson ? `onclick="App.navigateToLesson(${ch.id}, '${t.id}')" role="button" tabindex="0"` : ''}>
```
(c) Chapter header (line ~354):
```js
          <div class="chapter-card-header" onclick="App.toggleChapter(${i})" role="button" tabindex="0">
```
(`toggleChapter` only toggles a class — no re-render, so no focus-restore needed here, verified during planning.)

- [ ] **Step 4: `index.html` edits**

- The 4 stat-cards (lines ~208, 216, 221, 226): `<div class="stat-card" onclick="App.navigate('...')">` → add ` role="button" tabindex="0"` right after the onclick, matching the N14 regex order exactly.
- Theme toggle (line ~190): `<div class="theme-btn" id="themeToggle" title="Cambiar tema" data-i18n-title="theme_toggle_title">🌙</div>` → `<button class="theme-btn" id="themeToggle" title="Cambiar tema" data-i18n-title="theme_toggle_title" data-i18n-aria="theme_toggle_title">🌙</button>` (reuses the existing key — no new i18n).

- [ ] **Step 5: `.theme-btn` CSS reset** (buttons bring default border/background):

In the `.theme-btn` rule (`css/styles.css`, ~line 386), add two declarations: `background: none; border: none;` (everything else in the rule stays).

- [ ] **Step 6: Green run + commit**

`node scripts/verify-runtime.js` all green (10 N14 checks) and `node scripts/validate-contrast.js` exit 0.

```bash
git add scripts/verify-runtime.js js/app.js index.html css/styles.css
git commit -m "feat(a11y): keyboard-operable daily challenge, stat-cards, curriculum, theme toggle"
```

---

### Task 3: Real-browser keyboard verification (Playwright — no commit expected)

**Files:** none committed. Throwaway script + screenshots in the scratchpad only.

- [ ] **Step 1: Drive the real app with the keyboard**

Serve the repo (`python -m http.server 8000`, background, kill afterwards). In Chromium via `npx playwright`: bypass the auth gate from the console context (`document.getElementById('auth-screen').style.display='none'; document.getElementById('app-container').style.display=''; App.init();`), then verify each surface **with real key presses** (not `.click()`):

1. **Exam:** `App.navigate('simulator')`, start a chapter exam (`App.startChapterExam(0)`), focus `#opt1` and press `Enter` → the option gains `selected`, AND focus is back on `#opt1` after the re-render (the Task 1 restore). Press `Space` on a dot → question changes.
2. **Theme toggle:** Tab to `#themeToggle` (or focus it), press `Enter` → `data-theme` flips on `<html>`.
3. **Daily challenge (dashboard):** focus a `.dc-option`, `Enter` → answered state appears.
4. **Curriculum:** focus a `.chapter-card-header`, `Enter` → chapter expands; focus a `.topic-item`, `Enter` → lesson view renders.
5. **Focus visibility:** focus a stat-card and screenshot — the 2px outline must be clearly visible in BOTH themes (toggle `data-theme` and re-screenshot).

- [ ] **Step 2: Read the screenshots and report**

View every screenshot; report observed behavior per surface. Any failure here is a real defect: STOP, report it with the screenshot, and the controller decides the fix loop — do not patch code inside this task.

---

### Task 4: Docs sync

**Files:**
- Modify: `AGENTS.md`, `CLAUDE.md`

- [ ] **Step 1: AGENTS.md** — i18n key count 169 → **170** (the `goto_question_aria` key); a C1 entry in the 2026-07-14 remediation narrative: the three mechanisms (real button, delegated `[role="button"]` handler + why it survives `innerHTML` regeneration, end-of-file `:focus-visible` and why placement matters), the `selectAnswer` focus-restore, the surfaces covered, the 10 N14 checks, and the recorded out-of-scope items (aria-expanded on chapter headers, `goToQuestion` focus, search-dropdown keyboard → I7).

- [ ] **Step 2: CLAUDE.md** — mirror in summary (count + one paragraph pointing to AGENTS.md).

- [ ] **Step 3: Final verification + commit**

```bash
node scripts/verify-runtime.js && node scripts/validate-contrast.js
grep -n "169" AGENTS.md CLAUDE.md   # only historical-checkpoint mentions may remain
git add AGENTS.md CLAUDE.md
git commit -m "docs: record the C1 keyboard-operability remediation"
```

---

## Final Verification (after all tasks)

```bash
node scripts/verify-runtime.js      # all green, incl. 10 N14 checks, i18n 170/170
node scripts/validate-contrast.js   # exit 0
git log --oneline -4
```
Plus Task 3's real-keyboard evidence reviewed by eye.
