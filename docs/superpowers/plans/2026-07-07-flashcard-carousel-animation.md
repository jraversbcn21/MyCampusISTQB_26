# Flashcard Carousel Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a directional slide+fade "carousel" transition to the Flashcards prev/next
arrows, so the current card visibly exits and the next one enters from the opposite side,
instead of the content swapping instantly.

**Architecture:** All changes live in `js/app.js` (`App.nextFlashcard`/`App.prevFlashcard`)
plus one new helper method `App._slideFlashcard(direction, advance)`. The animation is driven
by inline styles (`transform`/`opacity`/`transition`) set directly on `#flashcard`, sequenced
with `setTimeout` (matching this codebase's existing pattern for timed UI sequencing — see
`js/app.js` lines 818/821/824/998/1008/1154 — no `transitionend` listeners, no new
dependencies). A reentrancy guard (`App._fcAnimating`) prevents overlapping animations from
rapid clicks. The 3D flip (`.flashcard-inner.flipped`) is untouched — it transforms a
different element (`#flashcardInner`, a child of `#flashcard`), so the two animations can
never conflict.

**Tech Stack:** Vanilla JS, inline CSS transitions (no new CSS file changes, no libraries).

## Global Constraints

- No new dependencies, no build step — this project has none (`CLAUDE.md`).
- No test framework exists for `js/`; behavior is verified via `scripts/verify-runtime.js`
  (a hand-rolled mock-DOM harness) — extend it rather than inventing a new test mechanism.
  Run `node scripts/verify-runtime.js` after any `js/` change; it must exit 0.
- Slide distance: **50px**. Transition duration: **250ms** per phase (out, then in) —
  exact values from the approved design spec
  (`docs/superpowers/specs/2026-07-07-flashcard-carousel-animation-design.md`).
- Direction (approved in the design spec): clicking **next (→)** slides the current card out
  **left** and the new one in from the **right**; clicking **prev (←)** is the mirror (out
  right, in left).
- **Deviation from the design spec, called out here for transparency:** the spec describes the
  swap happening on a `transitionend` event. This plan uses `setTimeout(fn, 250)` instead,
  matching every other timed-sequencing call already in `js/app.js` (none of them use
  `transitionend`). This is an internal sequencing detail only — the on-screen behavior
  (direction, distance, timing, guard) is identical to what was approved.
- Out of scope (per spec): `shuffleFlashcards()` and the deck `<select>` keep their current
  instant render — no animation.

---

### Task 1: Slide animation on flashcard prev/next navigation

**Files:**
- Modify: `js/app.js:20-25` (add `_fcAnimating` state field)
- Modify: `js/app.js:446-452` (`initFlashcards` — reset the guard on view entry)
- Modify: `js/app.js:511-523` (`nextFlashcard`/`prevFlashcard` — route through the new helper)
- Modify: `js/app.js:525-541` (`rateFlashcard` — fix a real timing bug this change would
  otherwise introduce, see note below)
- Modify: `scripts/verify-runtime.js` (new check block, following the existing `N1`…`N9`
  convention)

**Interfaces:**
- Produces: `App._slideFlashcard(direction, advance)` — `direction` is `1` (next) or `-1`
  (prev); `advance` is a zero-arg callback that performs the actual index change + re-render
  (called once, mid-animation, while the card is at `opacity: 0`).
- Produces: `App.nextFlashcard(onAdvanced?)` — the optional `onAdvanced` callback fires once
  navigation has actually happened (whether that means "after the animated advance" or,
  at the last card, "immediately, since there's nothing to animate"). `prevFlashcard` does
  **not** get this parameter — nothing calls it with a follow-up dependency, so it stays as
  today (YAGNI).

**Why `rateFlashcard` needs a change:** today, `rateFlashcard` calls `this.nextFlashcard()`
and then *synchronously* checks `this.fcIndex >= this.fcCards.length - 1` to decide whether to
show the "deck completed" toast — this works today because `nextFlashcard` currently
increments `fcIndex` synchronously. Once `nextFlashcard` defers the index change to the
animation's `advance()` callback (~250ms later), that synchronous check would run *before*
the index has actually moved, so the toast would stop firing when it should. Task 1 fixes
this by moving the check into the new `onAdvanced` callback (see Step 5b) — the on-screen
behavior (when the toast appears) is unchanged, only correctly re-timed to match the new
async navigation.

- [ ] **Step 1: Write the new (failing) checks in `scripts/verify-runtime.js`**

  Add this block immediately after the existing `N9` monitoring block (i.e., right before the
  `/* ---- N5 + P5: chequeos estáticos de i18n ---- */` block, so it keeps the file's
  chronological `N`-numbering convention):

  ```js
  /* ---- N10: carrusel de flashcards (slide direccional en next/prev) ---- */
  const FC = (n) => ({
    id: 9000 + n, chapter: 0,
    q: { es: `pregunta ${n}`, en: `question ${n}` },
    a: { es: `respuesta ${n}`, en: `answer ${n}` },
    chapterTag: { es: `Cap. ${n}`, en: `Ch. ${n}` },
  });
  {
    const ctx = loadApp();
    ctx.App.initFlashcards();
    check('N10 init: _fcAnimating arranca en false tras initFlashcards()',
      ctx.App._fcAnimating === false);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2), FC(3)];
    ctx.App.fcIndex = 0;
    ctx.App.fcStats = { hard: 0, ok: 0, easy: 0 };
    ctx.App._fcAnimating = false;
    const card = ctx.document.getElementById('flashcard');

    ctx.App.nextFlashcard();
    check('N10 next: activa el guard y desplaza la card actual hacia la izquierda',
      ctx.App._fcAnimating === true && card.style.transform === 'translateX(-50px)' && card.style.opacity === '0');
    check('N10 next: el índice no avanza hasta que termina la salida', ctx.App.fcIndex === 0);

    await new Promise(r => setTimeout(r, 260));
    check('N10 next: tras la salida, el índice avanza', ctx.App.fcIndex === 1);
    check('N10 next: la nueva card entra desde la derecha hacia el centro',
      card.style.transform === 'translateX(0)' && card.style.opacity === '1');
    check('N10 next: el guard sigue activo mientras entra', ctx.App._fcAnimating === true);

    await new Promise(r => setTimeout(r, 260));
    check('N10 next: al terminar de entrar, el guard se libera', ctx.App._fcAnimating === false);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2), FC(3)];
    ctx.App.fcIndex = 2;
    ctx.App.fcStats = { hard: 0, ok: 0, easy: 0 };
    ctx.App._fcAnimating = false;
    const card = ctx.document.getElementById('flashcard');

    ctx.App.prevFlashcard();
    check('N10 prev: desplaza la card actual hacia la derecha (espejo de next)',
      card.style.transform === 'translateX(50px)' && card.style.opacity === '0');

    await new Promise(r => setTimeout(r, 260));
    check('N10 prev: el índice retrocede', ctx.App.fcIndex === 1);
    await new Promise(r => setTimeout(r, 260));
    check('N10 prev: el guard se libera al terminar', ctx.App._fcAnimating === false);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2), FC(3)];
    ctx.App.fcIndex = 0;
    ctx.App.fcStats = { hard: 0, ok: 0, easy: 0 };
    ctx.App._fcAnimating = false;

    ctx.App.nextFlashcard(); // arranca animación, guard activo
    ctx.App.nextFlashcard(); // debe ignorarse por el guard
    check('N10 guard: un segundo clic mientras anima no avanza el índice dos veces',
      ctx.App.fcIndex === 0);
    await new Promise(r => setTimeout(r, 520)); // deja terminar el ciclo completo
    check('N10 guard: tras el ciclo completo, solo avanzó una vez', ctx.App.fcIndex === 1);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2)];
    ctx.App.fcIndex = ctx.App.fcCards.length - 1;
    ctx.App._fcAnimating = false;
    ctx.App.nextFlashcard(); // última card: no debe iniciar animación
    check('N10 límite: flecha siguiente en la última card no activa el guard ni mueve el índice',
      ctx.App._fcAnimating === false && ctx.App.fcIndex === 1);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2)];
    ctx.App.fcIndex = 0;
    ctx.App._fcAnimating = false;
    ctx.App.prevFlashcard(); // primera card: no debe iniciar animación
    check('N10 límite: flecha anterior en la primera card no activa el guard ni mueve el índice',
      ctx.App._fcAnimating === false && ctx.App.fcIndex === 0);
  }
  {
    // rateFlashcard() llama internamente a nextFlashcard() — debe heredar la misma
    // animación, y el aviso de "mazo completado" debe esperar a que el índice avance
    // de verdad, no evaluarse antes de que la animación lo mueva (el bug real que
    // Step 5b corrige: hoy ese chequeo es síncrono justo después de la llamada).
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2)]; // 2 cards: calificar la 1ª debe llegar a la última
    ctx.App.fcIndex = 0;
    ctx.App.fcStats = { hard: 0, ok: 0, easy: 0 };
    ctx.App.fcReviewed = new Set();
    ctx.App._fcAnimating = false;
    ctx.App.state = { flashcardsReviewed: 0 };
    ctx.App.saveState = () => {};
    ctx.App.checkAchievements = () => {};
    const toasts = [];
    ctx.App.showToast = (msg, kind) => toasts.push({ msg, kind });
    const card = ctx.document.getElementById('flashcard');

    ctx.App.rateFlashcard('easy');
    check('N10 rateFlashcard: hereda la animación de nextFlashcard()',
      ctx.App._fcAnimating === true && card.style.transform === 'translateX(-50px)');
    check('N10 rateFlashcard: el aviso de mazo completado NO se dispara antes de que el índice avance',
      toasts.length === 0);

    await new Promise(r => setTimeout(r, 260));
    check('N10 rateFlashcard: al llegar a la última card, se dispara el aviso de mazo completado',
      ctx.App.fcIndex === 1 && toasts.length === 1);

    await new Promise(r => setTimeout(r, 260));
  }
  ```

- [ ] **Step 2: Run the harness and confirm the new checks fail**

  Run: `node scripts/verify-runtime.js`
  Expected: every `N10 …` line prints `❌` (current `nextFlashcard`/`prevFlashcard` change
  `fcIndex` synchronously with no style changes and no `_fcAnimating` field exists yet, so
  `card.style.transform` is `undefined` and `ctx.App._fcAnimating` is `undefined`). All
  pre-existing checks (`N1`…`N9`, i18n) still print `✅` — confirms the new block is additive
  and doesn't break anything by itself.

- [ ] **Step 3: Add the `_fcAnimating` state field**

  In `js/app.js`, lines 20-25, add the new field to the existing flashcard state block:

  ```js
  // Flashcard state
  fcCards: [],
  fcIndex: 0,
  fcFlipped: false,
  fcStats: { hard: 0, ok: 0, easy: 0 },
  fcReviewed: new Set(),
  _fcAnimating: false,
  ```

- [ ] **Step 4: Reset the guard whenever the Flashcards view is (re)entered**

  In `js/app.js`, `initFlashcards()` (currently lines 446-452):

  ```js
  initFlashcards() {
    this.fcIndex = 0;
    this.fcFlipped = false;
    this.fcStats = { hard: 0, ok: 0, easy: 0 };
    this._fcAnimating = false;
    this.filterFlashcards();
    this.renderFlashcard();
  },
  ```

- [ ] **Step 5: Implement `_slideFlashcard` and route `nextFlashcard`/`prevFlashcard` through it**

  In `js/app.js`, replace the current `nextFlashcard`/`prevFlashcard` (lines 511-523) with:

  ```js
  _slideFlashcard(direction, advance) {
    if (this._fcAnimating) return;
    this._fcAnimating = true;
    const card = document.getElementById('flashcard');
    const dist = 50;
    const dur = 250;

    card.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
    card.style.transform = `translateX(${direction > 0 ? -dist : dist}px)`;
    card.style.opacity = '0';

    setTimeout(() => {
      advance();

      // Snap to the opposite edge with no transition, then force a reflow so the
      // browser registers that position before animating back to center — otherwise
      // it would just animate from the old (already translateX:0) state and never
      // look like it entered from the other side.
      card.style.transition = 'none';
      card.style.transform = `translateX(${direction > 0 ? dist : -dist}px)`;
      card.style.opacity = '0';
      void card.offsetWidth;

      card.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
      card.style.transform = 'translateX(0)';
      card.style.opacity = '1';

      setTimeout(() => {
        card.style.transition = '';
        this._fcAnimating = false;
      }, dur);
    }, dur);
  },

  nextFlashcard(onAdvanced) {
    if (this.fcIndex < this.fcCards.length - 1) {
      this._slideFlashcard(1, () => {
        this.fcIndex++;
        this.renderFlashcard();
        if (onAdvanced) onAdvanced();
      });
    } else if (onAdvanced) {
      onAdvanced();
    }
  },

  prevFlashcard() {
    if (this.fcIndex > 0) {
      this._slideFlashcard(-1, () => {
        this.fcIndex--;
        this.renderFlashcard();
      });
    }
  },
  ```

  `nextFlashcard`'s existing caller — the arrow click handler (`js/app.js` ~line 1085:
  `document.getElementById('fcNext').addEventListener('click', () => this.nextFlashcard());`)
  — calls it with no argument, so `onAdvanced` is `undefined` and the `if (onAdvanced)` guards
  are no-ops there. Only `rateFlashcard` (Step 5b) passes a callback.

- [ ] **Step 5b: Fix `rateFlashcard`'s "deck completed" check to wait for the real navigation**

  In `js/app.js`, `rateFlashcard` (currently lines 525-541), move the trailing boundary check
  into `nextFlashcard`'s new `onAdvanced` callback instead of running it synchronously right
  after the call (see the "Why `rateFlashcard` needs a change" note above the file list):

  ```js
  rateFlashcard(rating) {
    this.fcStats[rating]++;
    const cardId = this.fcCards[this.fcIndex].id;
    if (!this.fcReviewed.has(cardId)) {
      this.fcReviewed.add(cardId);
      this.state.flashcardsReviewed++;
      this.saveState();
      if (this.state.flashcardsReviewed % 5 === 0) {
        this.addXP(10, i18n.t('flashcards_reviewed_activity'));
      }
      this.checkAchievements();
    }
    this.nextFlashcard(() => {
      if (this.fcIndex >= this.fcCards.length - 1) {
        this.showToast(i18n.t('deck_completed_toast'), 'success');
      }
    });
  },
  ```

- [ ] **Step 6: Run the harness again and confirm everything passes**

  Run: `node scripts/verify-runtime.js`
  Expected: `✅ Todos los chequeos de runtime pasan.`, exit code 0 — every `N10 …` line now
  `✅`, and no pre-existing check (`N1`…`N9`, i18n) regressed.

- [ ] **Step 7: Manual real-browser smoke check (visual confirmation, not committed)**

  The automated checks above verify timing/state logic against a mocked DOM (no real CSS
  engine — see the harness's own doc comment at the top of `scripts/verify-runtime.js`). To
  actually see the slide direction and confirm the flip still works, run a throwaway
  Playwright script — do **not** add this file to the repo, it's a one-off verification aid.

  Create `<scratchpad>/fc-smoke.html` (any temp directory works; nothing here is committed):

  ```html
  <!DOCTYPE html>
  <html lang="es">
  <head>
  <meta charset="UTF-8">
  <title>Flashcard carousel smoke test</title>
  <link rel="stylesheet" href="file:///C:/repositorio/MyCampusISTQB_26/css/styles.css">
  <script src="file:///C:/repositorio/MyCampusISTQB_26/js/app.js"></script>
  </head>
  <body style="background:#0F0F1A">
    <div class="flashcard-arena">
      <button class="fc-arrow fc-prev" id="fcPrev">&#8592;</button>
      <div class="flashcard" id="flashcard">
        <div class="flashcard-inner" id="flashcardInner">
          <div class="flashcard-front">
            <div class="fc-chapter-tag" id="fcTag">CAP. 1</div>
            <div class="fc-question" id="fcQuestion">Pregunta de prueba</div>
            <div class="fc-hint">Haz clic para ver la respuesta</div>
          </div>
          <div class="flashcard-back">
            <div class="fc-answer" id="fcAnswer">Respuesta de prueba</div>
          </div>
        </div>
      </div>
      <button class="fc-arrow fc-next" id="fcNext">&#8594;</button>
    </div>
    <script>
      // Bypass renderFlashcard()'s data dependencies (FLASHCARDS/i18n) — this is a
      // pure visual check of the slide mechanism + flip independence, not the data flow.
      App.fcCards = [1, 2, 3];
      App.fcIndex = 0;
      document.getElementById('flashcard').addEventListener('click', () => {
        document.getElementById('flashcardInner').classList.toggle('flipped');
      });
      document.getElementById('fcNext').addEventListener('click', () => {
        App._slideFlashcard(1, () => {
          document.getElementById('fcQuestion').textContent = 'Card #' + (App.fcIndex + 2);
        });
      });
      document.getElementById('fcPrev').addEventListener('click', () => {
        App._slideFlashcard(-1, () => {
          document.getElementById('fcQuestion').textContent = 'Card #' + App.fcIndex;
        });
      });
    </script>
  </body>
  </html>
  ```

  Then, using the pinned Chromium install already used earlier in this project's session
  (adjust the executablePath if it differs on the machine running this step):

  ```js
  const { chromium } = require('C:/Users/jorge.carreno_amaris/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
  (async () => {
    const browser = await chromium.launch({
      executablePath: 'C:/Users/jorge.carreno_amaris/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'
    });
    const page = await browser.newPage({ viewport: { width: 800, height: 400 } });
    await page.goto('file:///<path-to>/fc-smoke.html');

    await page.click('#fcNext');
    await page.waitForTimeout(50);
    const midOut = await page.locator('#flashcard').evaluate(el => el.style.transform);
    console.log('mid slide-out (expect translateX(-50px)):', midOut);

    await page.waitForTimeout(500);
    const question = await page.locator('#fcQuestion').textContent();
    console.log('question after next (expect "Card #2"):', question);

    await page.click('#flashcard');
    await page.waitForTimeout(600);
    const flipped = await page.locator('#flashcardInner').evaluate(el => el.classList.contains('flipped'));
    console.log('flip still works independently of slide (expect true):', flipped);

    // Mobile check: the spec calls for re-testing at the ≤768px breakpoint (css/styles.css
    // sets .flashcard { width: 100%; } there) to rule out horizontal overflow from the 50px
    // translateX during the animation.
    await page.setViewportSize({ width: 375, height: 700 });
    await page.click('#fcPrev');
    await page.waitForTimeout(50);
    const noOverflowMidAnim = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    console.log('no horizontal overflow mid-animation at 375px (expect true):', noOverflowMidAnim);

    await browser.close();
  })();
  ```

  Expected console output: `mid slide-out` shows `translateX(-50px)`, `question after next`
  shows `Card #2`, `flip still works` shows `true`, `no horizontal overflow mid-animation`
  shows `true`. If any of these don't match, do not proceed to Step 8 — re-check Step 5's
  implementation against the design spec's direction table before continuing.

- [ ] **Step 8: Commit**

  ```bash
  git add js/app.js scripts/verify-runtime.js
  git commit -m "$(cat <<'EOF'
  feat(flashcards): slide+fade carousel animation on prev/next navigation

  Clicking the arrows now slides the current card out and the next one in
  from the opposite side, instead of swapping content instantly. Driven by
  inline styles + setTimeout (matching this file's existing timed-UI
  pattern), independent of the existing 3D flip. A reentrancy guard
  (_fcAnimating) prevents overlapping animations from rapid clicks.

  rateFlashcard's "deck completed" check moved into nextFlashcard's new
  onAdvanced callback — it used to run synchronously right after the call,
  which relied on fcIndex updating immediately; now that the index update
  is deferred to the animation, the check is re-timed to match.

  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  EOF
  )"
  ```

  (Note: the scratchpad smoke-test HTML/script from Step 7 is intentionally not part of this
  commit — it's a throwaway verification aid, not project code.)
