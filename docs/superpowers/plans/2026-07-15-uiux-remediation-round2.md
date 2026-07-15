# UI/UX Remediation Round 2 (I3+I7+I8+follow-ups) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar los hallazgos pendientes de la revisión ui-ux-pro-max 2026-07-14: touch targets ≥44px en táctil (I3), búsqueda global en móvil + teclado combobox (I7), emojis estructurales → sprite SVG inline (I8), y los 9 follow-ups menores de AGENTS.md.

**Architecture:** SPA vanilla JS sin build. Todo va a `index.html`, `css/styles.css`, `js/app.js`, `js/avatar.js`, `js/i18n.js`; los gates son checks estáticos/behaviorales en `scripts/verify-runtime.js` (familias nuevas N16/N17/N18) y un par nuevo en `scripts/validate-contrast.js`. TDD: cada tarea añade primero sus checks (rojos), luego la implementación (verdes).

**Tech Stack:** Vanilla JS, CSS, sprite SVG inline (paths estilo Lucide pegados a mano), Node para los validadores, Playwright para la verificación final en navegador real.

**Spec:** `docs/superpowers/specs/2026-07-15-uiux-remediation-round2-design.md`

## Global Constraints

- Cola de `css/styles.css`: el nuevo bloque `@media (pointer: coarse)` se inserta ANTES del bloque `@media (prefers-reduced-motion: reduce)`; `:focus-visible` sigue literalmente al final del fichero. No añadir nada después de `:focus-visible`.
- Elementos interactivos en templates `innerHTML`: `role="button" tabindex="0"` + el handler delegado de `App.init()` — nunca listeners de teclado por elemento.
- Texto de estado: tokens `--*-text` o utilidades `.text-*`, nunca `--success`/`--warning`/`--danger`/`--secondary` crudos como color de texto.
- Nada en `js/` puede depender de `transitionend`/`animationend`.
- No tocar el mecanismo `composedPath()` del listener "clic fuera" del buscador global (solo extenderlo donde este plan lo indica explícitamente).
- El atributo `data-theme` vive en `<body>`, no en `<html>`.
- Claves i18n siempre en pareja ES/EN en `TRANSLATIONS` (`js/i18n.js`). Al final de este plan hay 173 claves (170 + `global_search_aria`, `mobile_search_aria`, `close_search_aria`).
- Después de CADA tarea: `node scripts/verify-runtime.js` en verde. Si la tarea toca `css/styles.css`: también `node scripts/validate-contrast.js`. El hook de pre-commit los fuerza igualmente sobre la copia staged.
- El harness mockea el DOM: `getElementById`/`querySelector` auto-crean elementos; `el.querySelector()` devuelve `null` y `el.children` no existe — todo código nuevo que use esos accesos tras un render debe null-guardarse (los puntos exactos están marcados en cada tarea).
- Mensajes de commit: en español o inglés siguiendo el estilo del repo (`feat(a11y):`, `fix(css):`, `docs:`…).

---

### Task 1: I3 — Touch targets en táctil (CSS + checks N16)

**Files:**
- Modify: `scripts/verify-runtime.js` (añadir bloque N16-táctil después del bloque N15, ~línea 752)
- Modify: `css/styles.css` (regla de foco cerca de `.name-edit-btn` ~línea 1784; bloque `pointer: coarse` justo antes del bloque reduced-motion ~línea 2011)

**Interfaces:**
- Produces: bloque `@media (pointer: coarse)` en `css/styles.css` que tareas posteriores no deben mover; checks `N16 táctil:*`.

- [ ] **Step 1: Añadir los checks N16-táctil (fallando)**

En `scripts/verify-runtime.js`, después del bloque `/* ---- N15 ... ---- */` (que termina ~línea 752) y antes del bloque `/* ---- N5 + P5 ... ---- */`, insertar:

```js
  /* ---- N16: objetivos táctiles (I3) + búsqueda móvil (I7) — ronda 2, 2026-07-15 ---- */
  {
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    const coarseStart = cssSrc.indexOf('@media (pointer: coarse)');
    const motionStart = cssSrc.indexOf('@media (prefers-reduced-motion: reduce)');
    check('N16 táctil: existe el bloque @media (pointer: coarse)', coarseStart >= 0);
    // Orden de la cola del fichero: coarse ANTES de reduced-motion (y :focus-visible sigue último).
    check('N16 táctil: el bloque coarse va antes del bloque reduced-motion',
      coarseStart >= 0 && motionStart > coarseStart);
    const coarse = coarseStart >= 0 ? cssSrc.slice(coarseStart, motionStart) : '';
    check('N16 táctil: .lang-btn crece a ≥44px en táctil',
      /\.lang-btn\s*\{[^}]*min-height:\s*44px/.test(coarse) && /\.lang-btn\s*\{[^}]*min-width:\s*44px/.test(coarse));
    check('N16 táctil: .exam-dot crece a 44px en táctil',
      /\.exam-dot\s*\{[^}]*width:\s*44px/.test(coarse) && /\.exam-dot\s*\{[^}]*height:\s*44px/.test(coarse));
    check('N16 táctil: separación ≥8px entre targets (lang-switcher y exam-question-dots)',
      /\.lang-switcher\s*\{[^}]*gap:\s*8px/.test(coarse) && /\.exam-question-dots\s*\{[^}]*gap:\s*8px/.test(coarse));
    check('N16 táctil: .name-edit-btn siempre visible en táctil',
      /\.name-edit-btn\s*\{[^}]*opacity:\s*0\.7/.test(coarse));
    check('N16 táctil: .name-edit-btn visible con foco de teclado (en cualquier dispositivo)',
      /\.user-card:focus-within \.name-edit-btn/.test(cssSrc) && /\.name-edit-btn:focus-visible/.test(cssSrc));
  }
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — los 7 checks `N16 táctil:*` en ❌ (el resto en ✅).

- [ ] **Step 3: Implementar el CSS**

En `css/styles.css`, justo después de `.name-edit-btn:hover { opacity: 1 !important; }` (~línea 1784), añadir:

```css
/* I3 (ronda 2): el botón deja de ser un tab stop invisible — visible cuando
   el foco de teclado está en él o dentro del user-card. */
.user-card:focus-within .name-edit-btn,
.name-edit-btn:focus-visible { opacity: 0.7; }
```

Justo ANTES del comentario `/* ===== MOVIMIENTO REDUCIDO (I2, ...) ===== */` (~línea 2011), insertar:

```css
/* ===== OBJETIVOS TÁCTILES (I3, revisión UI 2026-07-14, ronda 2) =====
   El requisito de 44×44px aplica a punteros imprecisos: con pointer: coarse
   los targets crecen físicamente (expandir el hit-area invisible solaparía
   los vecinos: ES/EN estaban a 2px, los dots a 6px). En desktop con ratón
   el visual no cambia. Este bloque va ANTES del de reduced-motion a propósito
   — reduced-motion y :focus-visible deben seguir siendo los dos últimos. */
@media (pointer: coarse) {
  .lang-switcher { gap: 8px; }
  .lang-btn {
    min-height: 44px;
    min-width: 44px;
    padding: 4px 10px;
  }
  .exam-question-dots { gap: 8px; }
  .exam-dot {
    width: 44px;
    height: 44px;
    font-size: 0.8rem;
  }
  /* Sin hover en táctil el botón era invisible e inalcanzable. No se agranda
     a 44px (rompería el layout inline del user-card): se amplía su hit-area
     con padding+margen negativo (aquí sí es seguro: no tiene controles
     adyacentes que solapar). */
  .name-edit-btn {
    opacity: 0.7;
    padding: 17px;
    margin: -17px;
  }
}
```

- [ ] **Step 4: Verificar que pasan**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js`
Expected: PASS — todo en ✅ (validate-contrast no cambia: no se tocaron tokens).

- [ ] **Step 5: Commit**

```bash
git add css/styles.css scripts/verify-runtime.js
git commit -m "feat(a11y): touch targets de 44px en punteros coarse (I3)"
```

---

### Task 2: I7a — Barra de búsqueda móvil (HTML + CSS + JS + i18n + checks N16)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar el bloque N16 de la Task 1; ampliar el regex de claves usadas ~línea 766)
- Modify: `index.html` (topbar ~líneas 180-185)
- Modify: `css/styles.css` (sección TOPBAR ~línea 280; bloque `@media (max-width: 768px)` ~línea 1350)
- Modify: `js/app.js` (`_closeGlobalSearch` ~línea 1157; `init()` ~líneas 1282-1301)
- Modify: `js/i18n.js` (3 claves nuevas en ambos bloques ES y EN)

**Interfaces:**
- Consumes: `App._closeGlobalSearch(clearInput)`, `App._onGlobalSearchInput(e)` (existentes).
- Produces: `App._closeMobileSearch(returnFocus = true)` (usada por la Task 3 en el handler de Escape); ids `#mobileSearchBtn`, `#searchCloseBtn`; clase `.search-box.mobile-open`; claves i18n `global_search_aria`, `mobile_search_aria`, `close_search_aria`.

- [ ] **Step 1: Añadir los checks N16-móvil (fallando)**

Dentro del bloque N16 creado en la Task 1, después del último `check(...)`, añadir:

```js
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N16 móvil: #mobileSearchBtn existe con nombre accesible i18n y aria-expanded',
      /id="mobileSearchBtn"[^>]*data-i18n-aria="mobile_search_aria"|data-i18n-aria="mobile_search_aria"[^>]*id="mobileSearchBtn"/.test(htmlSrc)
      && /id="mobileSearchBtn"[^>]*aria-expanded="false"|aria-expanded="false"[^>]*id="mobileSearchBtn"/.test(htmlSrc));
    check('N16 móvil: #searchCloseBtn existe con nombre accesible i18n',
      /id="searchCloseBtn"[^>]*data-i18n-aria="close_search_aria"|data-i18n-aria="close_search_aria"[^>]*id="searchCloseBtn"/.test(htmlSrc));
    check('N16 móvil: #globalSearch tiene nombre accesible real (no solo placeholder)',
      /id="globalSearch"[^>]*data-i18n-aria="global_search_aria"|data-i18n-aria="global_search_aria"[^>]*id="globalSearch"/.test(htmlSrc));
    check('N16 móvil: .search-box tiene modo móvil (.mobile-open) en vez de display:none a secas',
      /\.search-box\.mobile-open\s*\{\s*display:\s*flex/.test(cssSrc));
    check('N16 móvil: App._closeMobileSearch existe y devuelve el foco al botón',
      /_closeMobileSearch\(returnFocus = true\)/.test(appSrc) && /_closeMobileSearch/.test(appSrc.slice(appSrc.indexOf("key === 'Escape'"))));
```

- [ ] **Step 2: Ampliar el regex de claves i18n usadas para cubrir `data-i18n-aria`**

En `scripts/verify-runtime.js` ~línea 766, cambiar:

```js
      for (const m of t.matchAll(/data-i18n(?:-placeholder|-title)?="([^"]+)"/g)) used.add(m[1]);
```

por:

```js
      for (const m of t.matchAll(/data-i18n(?:-placeholder|-title|-aria)?="([^"]+)"/g)) used.add(m[1]);
```

- [ ] **Step 3: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — los 5 checks `N16 móvil:*` en ❌ y ningún otro check roto (el regex ampliado solo añade claves ya definidas al conjunto `used`).

- [ ] **Step 4: HTML — botón móvil, botón de cierre y nombre accesible**

En `index.html`, sustituir el bloque topbar-right actual (~líneas 180-185):

```html
      <div class="topbar-right">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-input" id="globalSearch" placeholder="Buscar..." data-i18n-placeholder="search_placeholder" />
          <div class="search-results" id="globalSearchResults" style="display:none"></div>
        </div>
```

por:

```html
      <div class="topbar-right">
        <button class="mobile-search-btn" id="mobileSearchBtn" data-i18n-aria="mobile_search_aria" data-i18n-title="mobile_search_aria" aria-expanded="false">🔍</button>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-input" id="globalSearch" placeholder="Buscar..." data-i18n-placeholder="search_placeholder" data-i18n-aria="global_search_aria" />
          <button class="search-close-btn" id="searchCloseBtn" data-i18n-aria="close_search_aria">✕</button>
          <div class="search-results" id="globalSearchResults" style="display:none"></div>
        </div>
```

(Los glifos 🔍/✕ son provisionales: la Task 5 los sustituye por el sprite.)

- [ ] **Step 5: CSS — modo móvil de la barra**

En `css/styles.css`, sección TOPBAR, después de la regla `.search-no-results { ... }` (~línea 361), añadir:

```css
/* I7 (ronda 2): botón que abre la búsqueda en móvil y botón de cierre de la
   barra. Ocultos en desktop; el bloque de 768px los muestra. */
.mobile-search-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
}
.search-close-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text2);
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 8px;
}
```

En el bloque `@media (max-width: 768px)` (~línea 1339), sustituir la línea:

```css
  .search-box { display: none; }
```

por:

```css
  /* I7: la búsqueda ya no desaparece — barra a ancho completo bajo el topbar,
     toggled por #mobileSearchBtn. Mismo #globalSearch, mismo JS. */
  .mobile-search-btn { display: inline-flex; align-items: center; justify-content: center; }
  .search-box {
    display: none;
    position: fixed;
    top: var(--topbar-h);
    left: 0;
    right: 0;
    z-index: 60;
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 10px 16px;
  }
  .search-box.mobile-open { display: flex; }
  .search-box .search-input { flex: 1; width: auto; }
  .search-box .search-results { left: 8px; right: 8px; width: auto; }
  .search-close-btn { display: inline-flex; }
```

- [ ] **Step 6: JS — toggle, cierre y ciclo de foco**

En `js/app.js`, después de `_closeGlobalSearch(clearInput = false) { ... }` (~línea 1163), añadir el método:

```js
  // I7 (ronda 2): cierra la barra de búsqueda móvil (si está abierta) y
  // devuelve el foco al botón que la abrió — salvo returnFocus=false (clic
  // fuera: robar el foco al elemento clicado sería peor que no devolverlo).
  _closeMobileSearch(returnFocus = true) {
    const box = document.querySelector('.search-box');
    if (!box || !box.classList.contains('mobile-open')) return;
    box.classList.remove('mobile-open');
    this._closeGlobalSearch();
    const btn = document.getElementById('mobileSearchBtn');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      if (returnFocus && typeof btn.focus === 'function') btn.focus();
    }
  },
```

En `init()`, sustituir el bloque actual del buscador global (~líneas 1282-1301):

```js
    const gsInput = document.getElementById('globalSearch');
    gsInput.addEventListener('input', (e) => this._onGlobalSearchInput(e));
    gsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._closeGlobalSearch();
    });
```

por:

```js
    const gsInput = document.getElementById('globalSearch');
    gsInput.addEventListener('input', (e) => this._onGlobalSearchInput(e));
    gsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this._closeGlobalSearch();
        this._closeMobileSearch();
      }
    });
    // I7: apertura/cierre de la barra de búsqueda móvil.
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    mobileSearchBtn.addEventListener('click', () => {
      const box = document.querySelector('.search-box');
      if (box.classList.contains('mobile-open')) { this._closeMobileSearch(); return; }
      box.classList.add('mobile-open');
      mobileSearchBtn.setAttribute('aria-expanded', 'true');
      if (typeof gsInput.focus === 'function') gsInput.focus();
    });
    document.getElementById('searchCloseBtn').addEventListener('click', () => this._closeMobileSearch());
```

Y en el listener "clic fuera" existente (justo debajo), sustituir:

```js
      if (!insideSearchBox) {
        this._closeGlobalSearch();
      }
```

por:

```js
      const onMobileBtn = path.some(el => el.id === 'mobileSearchBtn');
      if (!insideSearchBox && !onMobileBtn) {
        this._closeGlobalSearch();
        this._closeMobileSearch(false);
      }
```

(NO tocar el cálculo de `path` con `composedPath()` — solo la condición.)

- [ ] **Step 7: i18n — 3 claves nuevas**

En `js/i18n.js`, en el bloque `// GLOBAL SEARCH` del objeto **es**, añadir tras `gs_exam_block_toast`:

```js
    global_search_aria: "Buscar en el contenido",
    mobile_search_aria: "Abrir búsqueda",
    close_search_aria: "Cerrar búsqueda",
```

Y en el bloque `// GLOBAL SEARCH` del objeto **en**:

```js
    global_search_aria: "Search the content",
    mobile_search_aria: "Open search",
    close_search_aria: "Close search",
```

- [ ] **Step 8: Verificar que pasan**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js`
Expected: PASS — todos ✅, incluida la paridad i18n (173/173).

- [ ] **Step 9: Commit**

```bash
git add index.html css/styles.css js/app.js js/i18n.js scripts/verify-runtime.js
git commit -m "feat(a11y): búsqueda global accesible en móvil con barra desplegable (I7)"
```

---

### Task 3: I7b — Teclado combobox del dropdown (JS + CSS + checks N16)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar el bloque N16 + 1 check behavioral)
- Modify: `index.html` (atributos ARIA estáticos en `#globalSearch` y `#globalSearchResults`)
- Modify: `js/app.js` (sección GLOBAL SEARCH ~líneas 1074-1163 y el keydown de `init()`)
- Modify: `css/styles.css` (estilo `.gs-active`)

**Interfaces:**
- Consumes: `App._gsToggleTerm(i)`, `App._gsGoGlossary()`, `App._gsGoLesson(chapterId, topicId)`, `App._closeMobileSearch()` (Task 2).
- Produces: `App._gsItems` (array plano de resultados accionables), `App._gsActive` (índice activo, -1 = ninguno), `App._gsMove(delta)`, `App._gsActivate()`. La Task 13 verifica esto con teclado real.

- [ ] **Step 1: Añadir los checks N16-combobox (fallando)**

Dentro del bloque N16, al final, añadir:

```js
    check('N16 combobox: #globalSearch declara role/aria-controls/aria-expanded',
      /id="globalSearch"[^>]*role="combobox"|role="combobox"[^>]*id="globalSearch"/.test(htmlSrc)
      && /aria-controls="globalSearchResults"/.test(htmlSrc));
    check('N16 combobox: el panel de resultados es role="listbox"',
      /id="globalSearchResults"[^>]*role="listbox"|role="listbox"[^>]*id="globalSearchResults"/.test(htmlSrc));
    check('N16 combobox: los resultados llevan id estable y role="option"',
      /id="gs-opt-\$\{/.test(appSrc) && /role="option"/.test(appSrc));
    check('N16 combobox: flechas/Enter/aria-activedescendant implementados',
      /_gsMove/.test(appSrc) && /_gsActivate/.test(appSrc) && /ArrowDown/.test(appSrc) && /aria-activedescendant/.test(appSrc));
    check('N16 combobox: estilo visible del resultado activo',
      /\.search-result\.gs-active/.test(cssSrc));
```

Y después del cierre del bloque N16 (fuera de él), añadir este check behavioral como bloque propio:

```js
  /* ---- N16b: combobox behavioral — flechas mueven el activo, Enter expande ---- */
  {
    const ctx = loadApp();
    ctx.App.state = ctx.App.loadState();
    const input = ctx.document.getElementById('globalSearch');
    const term = ctx.GLOSSARY[0].term.es.slice(0, 4).toLowerCase();
    input.value = term;
    ctx.App._onGlobalSearchInput({ target: input });
    const noop = () => {};
    ctx.App._gsKeydown({ key: 'ArrowDown', preventDefault: noop });
    check('N16b combobox: ArrowDown activa el primer resultado y actualiza aria-activedescendant',
      ctx.App._gsActive === 0 && input._attrs['aria-activedescendant'] === 'gs-opt-0');
    ctx.App._gsKeydown({ key: 'Enter', preventDefault: noop });
    check('N16b combobox: Enter sobre un término lo expande in place',
      ctx.App._gsExpanded === 0);
  }
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — los checks `N16 combobox:*` y `N16b` en ❌ (N16b puede fallar con TypeError de `_gsKeydown` no definido — cuenta como rojo válido).

- [ ] **Step 3: HTML — atributos ARIA estáticos**

En `index.html` (dentro del bloque ya editado en la Task 2):

- Al input `#globalSearch` añadir: `role="combobox" aria-autocomplete="list" aria-controls="globalSearchResults" aria-expanded="false"`.
- Al div `#globalSearchResults` añadir: `role="listbox"`.

- [ ] **Step 4: JS — estado activo, render con roles, navegación y activación**

En `js/app.js`:

**4a.** En el bloque de estado de búsqueda global (~línea 28), añadir dos campos:

```js
  // Global search
  _gsQuery: '',
  _gsGlossary: [],
  _gsContent: [],
  _gsExpanded: null,
  _gsItems: [],
  _gsActive: -1,
```

**4b.** En `_onGlobalSearchInput`, tras `this._gsExpanded = null;` añadir `this._gsActive = -1;`.

**4c.** Sustituir `_renderGlobalSearch()` completo por:

```js
  _renderGlobalSearch() {
    const panel = document.getElementById('globalSearchResults');
    const input = document.getElementById('globalSearch');
    const lang = i18n.lang;
    // Lista plana de resultados accionables, en orden de render — es lo que
    // navegan las flechas (patrón ARIA combobox: el foco DOM no sale del input).
    this._gsItems = [
      ...this._gsGlossary.map((g, i) => ({ kind: 'term', idx: i })),
      ...this._gsContent.map(c => ({ kind: 'lesson', chapterId: c.chapterId, topicId: c.topicId })),
    ];
    if (this._gsActive >= this._gsItems.length) this._gsActive = this._gsItems.length - 1;
    let n = 0;
    if (!this._gsGlossary.length && !this._gsContent.length) {
      panel.innerHTML = `<div class="search-no-results">${i18n.t('gs_no_results')}</div>`;
      panel.style.display = 'block';
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-activedescendant', '');
      return;
    }
    let html = '';
    if (this._gsGlossary.length) {
      html += `<div class="search-results-header">${i18n.t('gs_glossary_header')}</div>`;
      html += this._gsGlossary.map((g, i) => {
        const expanded = this._gsExpanded === i;
        const active = this._gsActive === n;
        const id = `gs-opt-${n++}`;
        return `
        <div class="search-result${expanded ? ' expanded' : ''}${active ? ' gs-active' : ''}" id="${id}" role="option" aria-selected="${active}" onclick="App._gsToggleTerm(${i})">
          <div class="search-result-term">${g.term[lang]}</div>
          <div class="search-result-def">${g.def[lang]}</div>
          ${expanded ? `<a class="search-result-link" onclick="event.stopPropagation();App._gsGoGlossary()">${i18n.t('gs_view_in_glossary')}</a>` : ''}
        </div>`;
      }).join('');
    }
    if (this._gsContent.length) {
      html += `<div class="search-results-header">${i18n.t('gs_content_header')}</div>`;
      html += this._gsContent.map(c => {
        const active = this._gsActive === n;
        const id = `gs-opt-${n++}`;
        return `
        <div class="search-result search-result-lesson${active ? ' gs-active' : ''}" id="${id}" role="option" aria-selected="${active}" onclick="App._gsGoLesson(${c.chapterId}, '${c.topicId}')">
          <span>${c.icon}</span><span>${c.title}</span>
        </div>`;
      }).join('');
    }
    panel.innerHTML = html;
    panel.style.display = 'block';
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-activedescendant', this._gsActive >= 0 ? `gs-opt-${this._gsActive}` : '');
  },
```

**4d.** Añadir tras `_gsToggleTerm` los tres métodos:

```js
  // I7 (ronda 2): navegación por teclado del dropdown — patrón ARIA combobox.
  // El foco DOM permanece en el input; el "activo" es visual + aria-activedescendant.
  _gsMove(delta) {
    if (!this._gsItems.length) return;
    const next = this._gsActive + delta;
    if (next < 0 || next >= this._gsItems.length) return; // sin wrap: extremos se clavan
    this._gsActive = next;
    this._renderGlobalSearch();
  },

  _gsActivate() {
    const item = this._gsItems[this._gsActive];
    if (!item) return;
    if (item.kind === 'term') {
      // Primera activación expande; la segunda navega al glosario — así el
      // enlace "Ver en glosario" (un <a> sin href, no enfocable) tiene ruta
      // de teclado equivalente.
      if (this._gsExpanded === item.idx) this._gsGoGlossary();
      else this._gsToggleTerm(item.idx);
    } else {
      this._gsGoLesson(item.chapterId, item.topicId);
    }
  },

  _gsKeydown(e) {
    if (e.key === 'Escape') {
      this._closeGlobalSearch();
      this._closeMobileSearch();
      return;
    }
    const panel = document.getElementById('globalSearchResults');
    if (!panel || panel.style.display === 'none') return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this._gsMove(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter' && this._gsActive >= 0) {
      e.preventDefault();
      this._gsActivate();
    }
  },
```

**4e.** En `_closeGlobalSearch`, tras `this._gsExpanded = null;` añadir:

```js
    this._gsActive = -1;
    this._gsItems = [];
    const input = document.getElementById('globalSearch');
    if (input) {
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-activedescendant', '');
    }
```

**4f.** En `init()`, sustituir el keydown del input añadido en la Task 2:

```js
    gsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this._closeGlobalSearch();
        this._closeMobileSearch();
      }
    });
```

por:

```js
    gsInput.addEventListener('keydown', (e) => this._gsKeydown(e));
```

- [ ] **Step 5: CSS — estilo del activo**

En `css/styles.css`, tras `.search-result:hover { background: var(--bg4); }` (~línea 328), añadir:

```css
/* I7 (ronda 2): resultado activo por teclado (aria-activedescendant). El
   outline interior lo hace visible también en el tema claro. */
.search-result.gs-active {
  background: var(--bg4);
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}
```

- [ ] **Step 6: Verificar que pasan**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js`
Expected: PASS — todos ✅, incluidos `N16 combobox:*`, `N16b` y los `N11` existentes (el render conserva los onclick y la estructura que N11 verifica).

- [ ] **Step 7: Commit**

```bash
git add index.html js/app.js css/styles.css scripts/verify-runtime.js
git commit -m "feat(a11y): navegación por teclado del dropdown de búsqueda (patrón combobox, I7)"
```

---

### Task 4: I8a — Sprite SVG + clase .icon + helper App._icon (checks N17)

**Files:**
- Modify: `scripts/verify-runtime.js` (nuevo bloque N17 tras el N16b)
- Modify: `index.html` (sprite como primer hijo de `<body>`)
- Modify: `css/styles.css` (clase `.icon` en la sección UTILITY ~línea 1354)
- Modify: `js/app.js` (helper `_icon` junto a `showToast`, ~línea 1053)

**Interfaces:**
- Produces: símbolos `#i-<nombre>` (lista exacta abajo), clase CSS `.icon`, `App._icon(name) → string '<svg class="icon" aria-hidden="true"><use href="#i-<name>"/></svg>'`. Tasks 5-11 los consumen.

- [ ] **Step 1: Añadir los checks N17 (fallando)**

Tras el bloque N16b, añadir:

```js
  /* ---- N17: iconos SVG estructurales (I8) — sprite inline, sin emojis de UI ---- */
  {
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    const SYMBOLS = ['graduation-cap', 'home', 'book', 'layers', 'file-text', 'book-open',
      'bar-chart', 'trophy', 'menu', 'search', 'x', 'power', 'arrow-left', 'arrow-right',
      'star', 'pencil', 'check', 'check-circle', 'alert-triangle', 'x-circle', 'info',
      'lock', 'play', 'chevron-right', 'sun', 'moon'];
    check('N17 iconos: sprite inline presente con los 26 símbolos',
      SYMBOLS.every(s => htmlSrc.includes(`id="i-${s}"`)));
    check('N17 iconos: el sprite está oculto y fuera del árbol de accesibilidad',
      /<svg[^>]*style="display:none"[^>]*aria-hidden="true"|<svg[^>]*aria-hidden="true"[^>]*style="display:none"/.test(htmlSrc));
    check('N17 iconos: App._icon definido con aria-hidden',
      /_icon\(name\)/.test(appSrc) && /class="icon" aria-hidden="true"><use href="#i-\$\{name\}"/.test(appSrc));
    check('N17 iconos: clase .icon definida (currentColor, 1em)',
      /\.icon\s*\{[^}]*stroke:\s*currentColor/.test(cssSrc) && /\.icon\s*\{[^}]*width:\s*1em/.test(cssSrc));
  }
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — los 4 checks `N17 iconos:*` en ❌.

- [ ] **Step 3: Sprite en index.html**

Como PRIMER hijo de `<body>` (antes del contenedor de auth), insertar:

```html
  <!-- Sprite de iconos (I8, ronda 2): símbolos estilo Lucide, inline (sin build
       ni CDN). Uso: <svg class="icon" aria-hidden="true"><use href="#i-nombre"/></svg>
       o App._icon('nombre') en templates JS. fill/stroke los pone la clase .icon. -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
    <symbol id="i-graduation-cap" viewBox="0 0 24 24"><path d="M22 10v6"/><path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></symbol>
    <symbol id="i-layers" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></symbol>
    <symbol id="i-file-text" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></symbol>
    <symbol id="i-book-open" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></symbol>
    <symbol id="i-bar-chart" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></symbol>
    <symbol id="i-trophy" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></symbol>
    <symbol id="i-power" viewBox="0 0 24 24"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></symbol>
    <symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></symbol>
    <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></symbol>
    <symbol id="i-pencil" viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></symbol>
    <symbol id="i-check-circle" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></symbol>
    <symbol id="i-alert-triangle" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></symbol>
    <symbol id="i-x-circle" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></symbol>
    <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></symbol>
    <symbol id="i-lock" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></symbol>
    <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
    <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></symbol>
  </svg>
```

- [ ] **Step 4: Clase .icon en CSS**

En `css/styles.css`, sección `/* ===== UTILITY ===== */` (~línea 1354), tras las utilidades `.text-*`, añadir:

```css
/* I8 (ronda 2): iconos del sprite. 1em → heredan tamaño del font-size del
   contenedor (los wrappers .nav-icon/.stat-icon/etc. conservan los suyos) y
   currentColor → heredan el color del texto en ambos temas. */
.icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.125em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}
```

- [ ] **Step 5: Helper en app.js**

En `js/app.js`, justo antes de `showToast` (~línea 1054), añadir:

```js
  /* ===== ICONOS (I8, ronda 2) ===== */
  // Devuelve el <svg><use> de un símbolo del sprite de index.html, para
  // interpolar en templates innerHTML. name es SIEMPRE un literal interno,
  // nunca dato de usuario.
  _icon(name) {
    return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  },
```

- [ ] **Step 6: Verificar que pasan**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css js/app.js scripts/verify-runtime.js
git commit -m "feat(ui): sprite SVG inline estilo Lucide + helper App._icon (I8)"
```

---

### Task 5: I8b — Swaps en el HTML estático (checks N17)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar bloque N17)
- Modify: `index.html` (todas las superficies estáticas listadas abajo)

**Interfaces:**
- Consumes: símbolos del sprite y clase `.icon` (Task 4).

- [ ] **Step 1: Añadir los checks (fallando)**

Al final del bloque N17:

```js
    check('N17 iconos: la nav del sidebar usa el sprite (7 nav-icons)',
      (htmlSrc.match(/class="nav-icon"><svg class="icon" aria-hidden="true"><use href="#i-/g) || []).length === 7);
    check('N17 iconos: los 4 stat-icons usan el sprite',
      (htmlSrc.match(/class="stat-icon"><svg class="icon" aria-hidden="true"><use href="#i-/g) || []).length === 4);
    check('N17 iconos: logo, toggles, logout, búsqueda y flechas usan el sprite',
      ['auth-logo-icon', 'logo-icon'].every(c => new RegExp(`class="${c}"><svg class="icon"`).test(htmlSrc))
      && !/id="sidebarToggle"[^>]*>&#9776;|id="mobileMenuBtn"[^>]*>&#9776;/.test(htmlSrc)
      && /id="mobileSearchBtn"[^>]*><svg class="icon"/.test(htmlSrc)
      && /class="logout-icon"><svg class="icon"/.test(htmlSrc)
      && !/id="fcPrev"[^>]*>&#8592;|id="fcNext"[^>]*>&#8594;/.test(htmlSrc)
      && !/id="avatarModalClose"[^>]*>✕|id="searchCloseBtn"[^>]*>✕/.test(htmlSrc));
    check('N17 iconos: los emojis decorativos que se quedan llevan aria-hidden',
      /class="welcome-emoji" aria-hidden="true"/.test(htmlSrc)
      && /id="resultsEmoji" aria-hidden="true"|aria-hidden="true"[^>]*id="resultsEmoji"/.test(htmlSrc)
      && /class="streak-fire" aria-hidden="true"/.test(htmlSrc));
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — los 4 checks nuevos en ❌.

- [ ] **Step 3: Swaps en index.html**

Cada emoji/glifo se sustituye por `<svg class="icon" aria-hidden="true"><use href="#i-…"/></svg>` DENTRO de su span/button contenedor (los wrappers conservan sus font-size, que dimensionan el icono vía 1em):

| Ubicación (línea aprox.) | Antes | Símbolo |
|---|---|---|
| 46 `.auth-logo-icon` | 🎓 | `#i-graduation-cap` |
| 101 `.logo-icon` | 🎓 | `#i-graduation-cap` |
| 107 `#sidebarToggle` | `&#9776;` | `#i-menu` |
| 127 nav dashboard | 🏠 | `#i-home` |
| 131 nav curriculum | 📚 | `#i-book` |
| 136 nav flashcards | 🃏 | `#i-layers` |
| 140 nav simulator | 📝 | `#i-file-text` |
| 145 nav glossary | 📖 | `#i-book-open` |
| 149 nav progress | 📊 | `#i-bar-chart` |
| 153 nav achievements | 🏆 | `#i-trophy` |
| 165 `.logout-icon` | ⏻ | `#i-power` |
| 177 `#mobileMenuBtn` | `&#9776;` | `#i-menu` |
| 180 `#mobileSearchBtn` | 🔍 | `#i-search` |
| 182 `.search-icon` | 🔍 | `#i-search` |
| (Task 2) `#searchCloseBtn` | ✕ | `#i-x` |
| 190 `#themeToggle` | 🌙 | `#i-moon` (estático inicial; el JS lo actualiza en Task 6) |
| 209/217/222/227 `.stat-icon` | 📚🃏📝⭐ | `#i-book` / `#i-layers` / `#i-file-text` / `#i-star` |
| 333 `#fcPrev` | `&#8592;` | `#i-arrow-left` |
| 346 `#fcNext` | `&#8594;` | `#i-arrow-right` |
| 482 `#avatarModalClose` | ✕ | `#i-x` |

Ejemplo del patrón (nav dashboard):

```html
        <span class="nav-icon"><svg class="icon" aria-hidden="true"><use href="#i-home"/></svg></span>
```

Además, marcar los emojis decorativos que SE QUEDAN:

- Línea ~204: `<div class="welcome-emoji">🚀</div>` → `<div class="welcome-emoji" aria-hidden="true">🚀</div>`
- Línea ~160: `<span class="streak-fire">🔥</span>` → `<span class="streak-fire" aria-hidden="true">🔥</span>`
- Línea ~408: `<div class="results-emoji" id="resultsEmoji">🎉</div>` → `<div class="results-emoji" id="resultsEmoji" aria-hidden="true">🎉</div>`

NO tocar: `#userAvatar` (👤 — lo gestiona avatar.js con emojis de datos), los emojis dentro de textos `data-i18n`, ni el SVG de Google del botón de auth.

- [ ] **Step 4: Verificar que pasan + smoke visual**

Run: `node scripts/verify-runtime.js`
Expected: PASS.
Abrir `index.html` en un navegador (o `python -m http.server 8000`) y comprobar de un vistazo que sidebar/topbar/stats renderizan iconos (trazo, no emoji) en ambos temas.

- [ ] **Step 5: Commit**

```bash
git add index.html scripts/verify-runtime.js
git commit -m "feat(ui): iconos estructurales del HTML estático al sprite SVG (I8)"
```

---

### Task 6: I8c — Swaps en templates JS (app.js + avatar.js, checks N17)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar bloque N17)
- Modify: `js/app.js` (líneas exactas abajo)
- Modify: `js/avatar.js` (línea 112)

**Interfaces:**
- Consumes: `App._icon(name)` (Task 4).

- [ ] **Step 1: Añadir los checks (fallando)**

Al final del bloque N17 (añadir `const avSrc = fs.readFileSync(path.join(ROOT, 'js', 'avatar.js'), 'utf8');` al principio del bloque):

```js
    check('N17 iconos: showToast usa _icon para el icono de tipo',
      /success: this\._icon\('check-circle'\)/.test(appSrc) && /warning: this\._icon\('alert-triangle'\)/.test(appSrc)
      && !/success: '✅'/.test(appSrc));
    check('N17 iconos: estados del curriculum (check/play/lock) vía _icon',
      /this\._icon\('check'\)/.test(appSrc) && /this\._icon\('play'\)/.test(appSrc) && /this\._icon\('lock'\)/.test(appSrc));
    check('N17 iconos: chevron de capítulo vía _icon',
      /class="chapter-chevron">\$\{this\._icon\('chevron-right'\)\}/.test(appSrc));
    check('N17 iconos: toggle de tema vía _icon (sun/moon), sin emojis',
      /this\._icon\(.{0,40}'sun'.{0,20}'moon'\)/.test(appSrc) && !/'☀️'/.test(appSrc) && !/'🌙'/.test(appSrc));
    check('N17 iconos: el lápiz de editar nombre usa App._icon',
      /App\._icon\('pencil'\)/.test(avSrc) && !/'✏️'/.test(avSrc));
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — los 5 checks nuevos en ❌.

- [ ] **Step 3: Swaps en js/app.js**

Todos dentro de métodos de `App` (los `map` son arrow functions → `this` = App):

**3a. `renderDailyChallenge` (~244):** `✅ ${i18n.t('challenge_completed_today')}` → `${this._icon('check-circle')} ${i18n.t('challenge_completed_today')}`

**3b. `renderCurriculum` (~343):**
```js
        const statusIcon = isCompleted ? this._icon('check') : (hasLesson ? this._icon('play') : this._icon('lock'));
```

**3c. `renderCurriculum` (~372):** `<span class="chapter-chevron">▶</span>` → `<span class="chapter-chevron">${this._icon('chevron-right')}</span>`
(La rotación de apertura vive en el CSS sobre `.chapter-chevron` — el span se conserva, así que sigue funcionando; verificar visualmente en el Step 5.)

**3d. `renderLesson` (~433):** `('⭐ ' + i18n.t('lesson_complete') + ...)` → `(this._icon('star') + ' ' + i18n.t('lesson_complete') + ...)`

**3e. `_renderSimCard` (~662):** `<div class="sim-lock-icon">🔒</div>` → `<div class="sim-lock-icon">${this._icon('lock')}</div>`

**3f. `startExam` (~687):**
```js
        const badge = isPassed ? ' ' + this._icon('check-circle') : (!isUnlocked ? ' ' + this._icon('lock') : '');
```

**3g. `renderRecentAchievements` (~313):** `<div class="empty-state-icon">🏆</div>` → `<div class="empty-state-icon" aria-hidden="true">🏆</div>`

**3h. `renderProgress` (~1019):** `<span class="activity-icon">⭐</span>` → `<span class="activity-icon">${this._icon('star')}</span>`

**3i. `renderAchievements` (~1043):** `'<div class="achievement-unlocked-badge">✓</div>'` → `` `<div class="achievement-unlocked-badge">${this._icon('check')}</div>` ``

**3j. `renderAchievements` (~1048):** `${isUnlocked ? '✓ ' + i18n.t('unlocked_on') : '🔒 ' + i18n.t('locked')}` → `${isUnlocked ? this._icon('check') + ' ' + i18n.t('unlocked_on') : this._icon('lock') + ' ' + i18n.t('locked')}`

**3k. `showToast` (~1058):**
```js
    const icons = {
      success: this._icon('check-circle'),
      warning: this._icon('alert-triangle'),
      error: this._icon('x-circle'),
      info: this._icon('info'),
    };
    toast.innerHTML = `<span>${icons[type] || this._icon('info')}</span><span>${msg}</span>`;
```
(El SVG ya es `aria-hidden` → cierra de gratis el follow-up "emoji del toast no oculto al live region".)

**3l. `toggleTheme` (~1177):** `document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';` → `document.getElementById('themeToggle').innerHTML = this._icon(isDark ? 'sun' : 'moon');`

**3m. `init` (~1197):** `document.getElementById('themeToggle').textContent = savedTheme === 'light' ? '☀️' : '🌙';` → `document.getElementById('themeToggle').innerHTML = this._icon(savedTheme === 'light' ? 'sun' : 'moon');`

NO tocar: emojis dentro de mensajes de toast (🎉🔓⚡📋🔥 en las llamadas a `showToast`), `ch.icon`/`lvl.icon`/`a.icon`/`avatar.emoji` (datos), `💡` de la explicación del examen (contenido), `resultsEmoji` (ya decorativo con aria-hidden).

- [ ] **Step 4: Swap en js/avatar.js (~112)**

`btn.innerHTML = '✏️';` → `btn.innerHTML = App._icon('pencil');`
(El orden de carga garantiza `App`: app.js va antes que avatar.js — ver "Script Load Order" en AGENTS.md.)

- [ ] **Step 5: Verificar que pasan + smoke visual**

Run: `node scripts/verify-runtime.js`
Expected: PASS — incluidos los N10 del carrusel y N11 del buscador (no se tocó su lógica).
Smoke en navegador: toast (provocar uno con el shuffle de flashcards), curriculum abierto (candados/play/check + chevron rotando), toggle de tema alternando sol/luna, lápiz de nombre visible al hacer hover.

- [ ] **Step 6: Commit**

```bash
git add js/app.js js/avatar.js scripts/verify-runtime.js
git commit -m "feat(ui): iconos estructurales de los templates JS al sprite SVG (I8)"
```

---

### Task 7: Follow-up — Modal de avatar accesible por teclado (checks N18)

**Files:**
- Modify: `scripts/verify-runtime.js` (nuevo bloque N18 tras el N17)
- Modify: `index.html` (`#userAvatar` ~línea 111; `#avatar-modal` ~líneas 478-481)
- Modify: `js/avatar.js` (`init`, `openModal`, `closeModal`, `_renderGrid`)

**Interfaces:**
- Consumes: handler delegado Enter/Espacio de `App.init()` (existente, cubre los nuevos `role="button"`); clave i18n `change_avatar_title` (existente).

- [ ] **Step 1: Añadir los checks N18 (fallando)**

Tras el bloque N17:

```js
  /* ---- N18: follow-ups menores (ronda 2, 2026-07-15) ---- */
  {
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    const avSrc = fs.readFileSync(path.join(ROOT, 'js', 'avatar.js'), 'utf8');
    // Avatar: apertura por teclado + dialog + Escape + foco de vuelta.
    check('N18 avatar: #userAvatar es operable por teclado con nombre i18n',
      /id="userAvatar"[^>]*role="button" tabindex="0"|role="button" tabindex="0"[^>]*id="userAvatar"/.test(htmlSrc)
      && /id="userAvatar"[^>]*data-i18n-aria="change_avatar_title"|data-i18n-aria="change_avatar_title"[^>]*id="userAvatar"/.test(htmlSrc));
    check('N18 avatar: el modal declara role="dialog" aria-modal',
      /id="avatar-modal"[^>]*role="dialog" aria-modal="true"|role="dialog" aria-modal="true"[^>]*id="avatar-modal"/.test(htmlSrc)
      && /aria-labelledby="avatarModalTitle"/.test(htmlSrc));
    check('N18 avatar: las av-card llevan role/tabindex (el handler delegado las cubre)',
      /class="av-card[^"]*" role="button" tabindex="0"/.test(avSrc));
    check('N18 avatar: Escape cierra y el foco vuelve al lanzador',
      /key === 'Escape'/.test(avSrc) && /_returnFocusEl/.test(avSrc));
  }
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — los 4 checks `N18 avatar:*` en ❌.

- [ ] **Step 3: HTML**

Línea ~111:

```html
      <div class="user-avatar" id="userAvatar" role="button" tabindex="0" data-i18n-aria="change_avatar_title" data-i18n-title="change_avatar_title">👤</div>
```

Líneas ~478-481 (modal): añadir atributos al contenedor y un id al `<h2>`:

```html
  <div id="avatar-modal" style="display:none" role="dialog" aria-modal="true" aria-labelledby="avatarModalTitle">
    <div class="avatar-modal-card">
      <div class="avatar-modal-header">
        <h2 id="avatarModalTitle" data-i18n="avatar_modal_title">Elige tu perfil de tester</h2>
```

- [ ] **Step 4: js/avatar.js**

**4a.** En `init()` (~líneas 87-92): el `avatarEl.title = i18n.t('change_avatar_title');` ya es redundante (lo aplica `data-i18n-title`, que además se re-aplica al cambiar de idioma — el JS estático no). Eliminar esa línea y dejar el listener de click como está. Añadir después del bloque de botones del modal:

```js
    // Escape cierra el modal (ronda 2). El foco de vuelta lo gestiona closeModal().
    document.getElementById('avatar-modal').addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
```

**4b.** `openModal()`:

```js
  openModal() {
    this._pendingId = this._getSavedId();
    this._renderGrid();
    // Guardar el lanzador para devolverle el foco al cerrar (ronda 2).
    this._returnFocusEl = (typeof document.activeElement === 'object') ? document.activeElement : null;
    document.getElementById('avatar-modal').style.display = 'flex';
    const closeBtn = document.getElementById('avatarModalClose');
    if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
  },
```

**4c.** `closeModal()`:

```js
  closeModal() {
    document.getElementById('avatar-modal').style.display = 'none';
    this._pendingId = null;
    if (this._returnFocusEl && typeof this._returnFocusEl.focus === 'function') this._returnFocusEl.focus();
    this._returnFocusEl = null;
  },
```

**4d.** En `_renderGrid()` (~línea 172), el template de las cards:

```js
      <div class="av-card ${this._pendingId === a.id ? 'selected' : ''}" role="button" tabindex="0" data-id="${a.id}"
           style="--av-color: ${a.color}">
```

(El handler delegado de app.js convierte Enter/Espacio en `.click()`, que dispara el listener por card que `_renderGrid` ya re-ata en cada render — no añadir listeners de teclado propios.)

Límite deliberado (spec): SIN focus-trap de Tab dentro del modal — queda documentado en la Task 12.

- [ ] **Step 5: Verificar que pasan**

Run: `node scripts/verify-runtime.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html js/avatar.js scripts/verify-runtime.js
git commit -m "feat(a11y): modal de avatar operable por teclado (dialog, Escape, foco de vuelta)"
```

---

### Task 8: Follow-ups — aria-expanded (capítulos y menú móvil) + continue-item (checks N18)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar bloque N18)
- Modify: `index.html` (`#mobileMenuBtn` ~línea 177)
- Modify: `js/app.js` (`renderContinueStudying` ~223, `renderCurriculum` ~354, `toggleChapter` ~389, `init` ~1217)

**Interfaces:**
- Consumes: handler delegado (existente); `App._expandedChapters` (Set existente).

- [ ] **Step 1: Añadir los checks (fallando)**

Al final del bloque N18:

```js
    check('N18 expanded: las cabeceras de capítulo llevan aria-expanded desde el Set',
      /toggleChapter\(\$\{i\}\)" role="button" tabindex="0" aria-expanded="\$\{/.test(appSrc));
    check('N18 expanded: toggleChapter sincroniza aria-expanded (no re-renderiza)',
      /setAttribute\('aria-expanded', String\(isOpen\)\)/.test(appSrc));
    check('N18 expanded: #mobileMenuBtn refleja el estado del drawer',
      /id="mobileMenuBtn"[^>]*aria-expanded="false"|aria-expanded="false"[^>]*id="mobileMenuBtn"/.test(htmlSrc)
      && /mobileMenuBtn'\)\.setAttribute\('aria-expanded'/.test(appSrc));
    check('N18 teclado: los continue-item del dashboard llevan role/tabindex',
      /class="continue-item" onclick="App\.navigate\('curriculum'\)" role="button" tabindex="0"/.test(appSrc));
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — los 4 checks nuevos en ❌.

- [ ] **Step 3: Implementación**

**3a. `renderCurriculum` (~354):**

```js
          <div class="chapter-card-header" onclick="App.toggleChapter(${i})" role="button" tabindex="0" aria-expanded="${this._expandedChapters && this._expandedChapters.has(i) ? 'true' : 'false'}">
```

**3b. `toggleChapter` (~389)** — OJO: NO re-renderiza (solo alterna la clase), así que el atributo se sincroniza a mano; `el.querySelector` devuelve `null` en el harness → null-guard:

```js
  toggleChapter(i) {
    const card = document.getElementById(`chapter-${i}`);
    const isOpen = card.classList.toggle('open');
    const header = card.querySelector('.chapter-card-header');
    if (header) header.setAttribute('aria-expanded', String(isOpen));
    if (!this._expandedChapters) this._expandedChapters = new Set();
    if (isOpen) {
      this._expandedChapters.add(i);
    } else {
      this._expandedChapters.delete(i);
    }
  },
```

**3c. `index.html` (~177):** añadir `aria-expanded="false"` al `#mobileMenuBtn`.

**3d. `init` (~1217):**

```js
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
      const open = document.getElementById('sidebar').classList.toggle('mobile-open');
      document.getElementById('mobileMenuBtn').setAttribute('aria-expanded', String(open));
    });
```

**3e. `renderContinueStudying` (~223):**

```js
        <div class="continue-item" onclick="App.navigate('curriculum')" role="button" tabindex="0">
```

- [ ] **Step 4: Verificar que pasan**

Run: `node scripts/verify-runtime.js`
Expected: PASS (el check N14 de cabeceras de capítulo usa `toggleChapter(${i})" role="button" tabindex="0"` — sigue matcheando porque el aria-expanded va después).

- [ ] **Step 5: Commit**

```bash
git add index.html js/app.js scripts/verify-runtime.js
git commit -m "feat(a11y): aria-expanded en capítulos y menú móvil; continue-items operables por teclado"
```

---

### Task 9: Follow-ups — Roving tabindex + aria-current en exam dots, foco tras goToQuestion (checks N18)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N18 + MODIFICAR un check N14 existente, ~línea 719)
- Modify: `js/app.js` (`renderExamDots` ~808, `goToQuestion` ~827, handler delegado en `init` ~1233)

**Interfaces:**
- Consumes: `App.examCurrentQ`, `App.examQuestions`, `App.goToQuestion(i)` (existentes).

- [ ] **Step 1: Actualizar el check N14 de los dots y añadir los N18 (fallando)**

En el bloque N14 (~línea 719), SUSTITUIR:

```js
    check('N14 teclado: los dots del examen llevan role/tabindex y aria-label i18n',
      /onclick="App\.goToQuestion\(\$\{i\}\)" role="button" tabindex="0" aria-label="\$\{i18n\.t\('goto_question_aria'\)\} \$\{i \+ 1\}"/.test(appSrc));
```

por:

```js
    check('N14 teclado: los dots del examen llevan role, tabindex rotativo y aria-label i18n',
      /onclick="App\.goToQuestion\(\$\{i\}\)" role="button" tabindex="\$\{i === this\.examCurrentQ \? 0 : -1\}"/.test(appSrc)
      && /aria-label="\$\{i18n\.t\('goto_question_aria'\)\} \$\{i \+ 1\}"/.test(appSrc));
```

Al final del bloque N18, añadir:

```js
    check('N18 dots: el dot actual lleva aria-current',
      /aria-current="true"/.test(appSrc));
    check('N18 dots: flechas Izq/Der navegan entre preguntas desde un dot',
      /classList\.contains\('exam-dot'\)/.test(appSrc) && /ArrowRight/.test(appSrc) && /ArrowLeft/.test(appSrc));
    check('N18 dots: goToQuestion restaura el foco tras el re-render',
      /goToQuestion\(i\)\s*\{[\s\S]{0,400}focus\(\)/.test(appSrc));
```

- [ ] **Step 2: Verificar el estado**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — el check N14 modificado y los 3 N18 nuevos en ❌.

- [ ] **Step 3: Implementación**

**3a. `renderExamDots` (~808):**

```js
  renderExamDots() {
    const dots = document.getElementById('examDots');
    dots.innerHTML = this.examQuestions.map((_, i) => {
      const cls = i === this.examCurrentQ ? 'current' : (this.examAnswers[i] !== undefined ? 'answered' : '');
      // Roving tabindex: un solo tab stop (el dot actual); las flechas mueven.
      return `<div class="exam-dot ${cls}" onclick="App.goToQuestion(${i})" role="button" tabindex="${i === this.examCurrentQ ? 0 : -1}"${i === this.examCurrentQ ? ' aria-current="true"' : ''} aria-label="${i18n.t('goto_question_aria')} ${i + 1}">${i + 1}</div>`;
    }).join('');
  },
```

**3b. `goToQuestion` (~827)** — `dots.children` no existe en el harness → guard encadenado:

```js
  goToQuestion(i) {
    this.examCurrentQ = i;
    this.renderExamQuestion();
    this.renderExamDots();
    // Mismo arreglo que selectAnswer: el re-render destruye el nodo enfocado.
    // El foco va al dot actual — es el tab stop del roving.
    const dots = document.getElementById('examDots');
    const dot = dots && dots.children && dots.children[i];
    if (dot && typeof dot.focus === 'function') dot.focus();
  },
```

**3c. Handler delegado en `init` (~1233)** — añadir la rama de flechas ANTES de la de Enter/Espacio:

```js
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if (!t || !t.getAttribute) return;
      // Roving de los exam dots: flechas mueven pregunta y foco a la vez.
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && t.classList && t.classList.contains('exam-dot')) {
        e.preventDefault();
        const next = this.examCurrentQ + (e.key === 'ArrowRight' ? 1 : -1);
        if (next >= 0 && next < this.examQuestions.length) this.goToQuestion(next);
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && t.getAttribute('role') === 'button' && typeof t.click === 'function') {
        e.preventDefault(); // evita el scroll de Espacio y el doble disparo
        t.click();
      }
    });
```

- [ ] **Step 4: Verificar que pasan**

Run: `node scripts/verify-runtime.js`
Expected: PASS — incluidos los checks N14 (el modificado y el resto) y los behaviorales de examen existentes.

- [ ] **Step 5: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(a11y): roving tabindex + aria-current en exam dots; foco tras goToQuestion"
```

---

### Task 10: Follow-up — Politeness type-aware en toasts (checks N18)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N18)
- Modify: `js/app.js` (`showToast` ~1054)

- [ ] **Step 1: Añadir el check (fallando)**

Al final del bloque N18:

```js
    check('N18 toasts: warning/error se anuncian asertivos (role="alert" en el nodo)',
      /type === 'warning' \|\| type === 'error'/.test(appSrc) && /setAttribute\('role', 'alert'\)/.test(appSrc));
```

- [ ] **Step 2: Verificar que falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — 1 check nuevo en ❌.

- [ ] **Step 3: Implementación**

En `showToast` (tras `toast.className = ...`):

```js
    // Un nodo con role="alert" insertado en un live region se anuncia
    // asertivo — los mensajes bloqueantes (guard de examen, errores) no
    // esperan a que el lector esté ocioso; success/info siguen polite.
    if (type === 'warning' || type === 'error') toast.setAttribute('role', 'alert');
```

- [ ] **Step 4: Verificar que pasa**

Run: `node scripts/verify-runtime.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(a11y): toasts warning/error asertivos via role=alert"
```

---

### Task 11: Follow-up — Token --secondary-text + acentos como texto (contrast + N12 + N18)

**Files:**
- Modify: `scripts/validate-contrast.js` (par nuevo en `PAIRS`, ~línea 55)
- Modify: `scripts/verify-runtime.js` (regex N12 ~línea 668 + su comentario; check N18 nuevo)
- Modify: `css/styles.css` (tokens en `:root` y `[data-theme="light"]`; `.chapter-prog-pct` ~línea 1179; `.cpring-text` ~línea 656)
- Modify: `js/app.js` (`renderContinueStudying` ~232, `renderCurriculum` ~370, `renderProgress` ~977)

- [ ] **Step 1: Añadir el par de contraste y los checks (fallando)**

En `scripts/validate-contrast.js`, dentro de `PAIRS`, tras la línea de `text2`:

```js
  ['progress exams stat (secondary)', 'secondary-text', 'surface'],
```

En `scripts/verify-runtime.js` (~línea 668), SUSTITUIR el check N12:

```js
    check('N12 contraste: app.js no usa color:var(--success|warning|danger) crudo como texto inline',
      !/color:\s*var\(--(success|warning|danger)\)/.test(appSrc));
```

por:

```js
    check('N12 contraste: app.js no usa color:var(--success|warning|danger|secondary) crudo como texto inline',
      !/color:\s*var\(--(success|warning|danger|secondary)\)/.test(appSrc));
```

y actualizar su comentario: eliminar las frases "Deliberadamente NO cubre var(--secondary) ni los arrays..." y sustituirlas por:

```js
    // Desde la ronda 2 (2026-07-15) cubre también var(--secondary); los acentos de
    // capítulo como texto (continue-list %, cpring %) se migraron a var(--text2) y
    // los guarda el check N18 de abajo. Única excepción restante, deliberada: el
    // número de capítulo (.chapter-number) — texto grande/bold sobre tinte (umbral
    // AA de texto grande, 3:1), registrado en AGENTS.md.
```

Al final del bloque N18:

```js
    check('N18 contraste: los porcentajes de continue-list/cpring ya no usan el acento como texto',
      !/style="color:\$\{colors\[i\]\}/.test(appSrc));
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/validate-contrast.js` → FAIL: `falta el token --secondary-text` en ambos temas.
Run: `node scripts/verify-runtime.js` → FAIL: N12 (var(--secondary) aún presente, línea 977) y el N18 nuevo.

- [ ] **Step 3: Implementación**

**3a. Tokens.** En `:root` (tras `--primary-text: #A29DFF;`):

```css
  --secondary-text: #00D2FF;
```

(En dark, el propio `--secondary` ya cumple AA de sobra sobre `--surface` — se materializa como token para que el par quede validado y el tema claro pueda divergir.)

En `[data-theme="light"]` (tras `--primary-text: #4F46C4;`):

```css
  --secondary-text: #007A99;
```

Si `validate-contrast.js` reportara <4.5:1 con ese valor, oscurecer de 1 en 1 en el canal G/B (p. ej. `#00708C`) hasta verde — el validador es la fuente de verdad.

**3b. `js/app.js` ~977:** `style="color:var(--secondary)"` → `style="color:var(--secondary-text)"`

**3c. `js/app.js` ~232 (continue-list %):**

```js
          <span style="color:var(--text2);font-weight:700">${pct}%</span>
```

**3d. `js/app.js` ~370 (cpring %):** quitar el estilo inline —

```js
                <span class="cpring-text">${pct}%</span>
```

y en `css/styles.css`, en la regla `.cpring-text` (~línea 656), fijar `color: var(--text2);` (añadirla o sustituir la que hubiera).

**3e. `css/styles.css` ~1179:** `.chapter-prog-pct { color: var(--primary); ... }` → `color: var(--primary-text);` (mismo cambio de clase que hizo la remediación C2 con los demás).

NO tocar: `background:${colors[i]}` (fills de barras/anillos — no son texto) ni `.chapter-number` (~355; texto grande/bold, umbral 3:1, excepción registrada).

- [ ] **Step 4: Verificar que pasan**

Run: `node scripts/validate-contrast.js && node scripts/verify-runtime.js`
Expected: PASS — el par `secondary-text` ≥4.5:1 en ambos temas; N12 ampliado y N18 en verde.

- [ ] **Step 5: Commit**

```bash
git add css/styles.css js/app.js scripts/validate-contrast.js scripts/verify-runtime.js
git commit -m "fix(contrast): token --secondary-text y porcentajes de acento a tokens AA"
```

---

### Task 12: Documentación (CLAUDE.md, AGENTS.md, corrección del spec)

**Files:**
- Modify: `CLAUDE.md` (sección "UI/UX Remediation — ui-ux-pro-max Review (2026-07-14)")
- Modify: `AGENTS.md` (sección "Repository": nueva entrada de la ronda 2; actualizar las listas de pendientes de las entradas de 2026-07-14; sección "i18n": conteo de claves)
- Modify: `docs/superpowers/specs/2026-07-15-uiux-remediation-round2-design.md` (corrección puntual)

- [ ] **Step 1: Corregir el spec**

En el ítem 2 del Bloque 4 del spec, la afirmación "Como cada toggle regenera el HTML completo, el atributo siempre queda fresco — no hace falta sync manual en `toggleChapter()`" es INCORRECTA (`toggleChapter` solo alterna la clase, no re-renderiza — se descubrió al planificar). Sustituirla por: "`renderCurriculum()` emite el atributo desde `_expandedChapters` al renderizar, y `toggleChapter()` lo sincroniza a mano al alternar la clase (no re-renderiza)."

- [ ] **Step 2: Actualizar CLAUDE.md**

En la sección de la revisión UI/UX:
- Añadir una fila-resumen o párrafo "Ronda 2 (2026-07-15)": I3, I7, I8 y follow-ups cerrados; gates nuevos `N16`/`N17`/`N18` + par `--secondary-text` en `validate-contrast.js`.
- Actualizar "Still open from the review" — quedan SOLO: focus-trap de Tab en el modal de avatar (límite deliberado), nit del TTS anidado (decisión mantenida), `.chapter-number` con acento como texto grande (excepción 3:1 registrada).
- `TRANSLATIONS`: 170 → **173 claves**.
- Añadir a las editing constraints: "Iconos estructurales: sprite `#i-*` de `index.html` + `App._icon(name)` en templates JS — no reintroducir emojis como iconos de UI (gate `N17`); los emojis decorativos que se quedan llevan `aria-hidden`."

- [ ] **Step 3: Actualizar AGENTS.md**

- Nueva entrada "**UI/UX remediation ronda 2 (2026-07-15)**" en la sección Repository, con: los 4 bloques ejecutados, mecanismos clave (media query `pointer: coarse` y su posición en la cola del fichero; barra móvil reutilizando `#globalSearch`; patrón combobox con `_gsItems`/`_gsActive`; sprite + `_icon`; roving tabindex), los gates nuevos y la lista de restos abiertos (los 3 del Step 2).
- En las entradas de 2026-07-14: marcar I3/I7/I8 y los follow-ups como CERRADOS con puntero a la nueva entrada (no borrar el histórico).
- Sección "i18n": conteo 170 → 173 con las 3 claves nuevas nombradas.

- [ ] **Step 4: Gates completos**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js && node scripts/validate-questions.js && node scripts/validate-content.js`
Expected: PASS todos.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md AGENTS.md docs/superpowers/specs/2026-07-15-uiux-remediation-round2-design.md
git commit -m "docs: registra la ronda 2 de remediación UI/UX (I3+I7+I8+follow-ups)"
```

---

### Task 13: Verificación en navegador real (Playwright)

**Files:**
- Scratchpad only (scripts y screenshots NO se committean — mismo criterio que las rondas anteriores).

Servir con `python -m http.server 8000` y conducir Chromium con Playwright, con **pulsaciones de teclado reales** (`page.keyboard.press`, nunca `.click()` para los flujos de teclado). Verificar y anotar resultados:

- [ ] **Móvil (viewport 375×667):**
  - `#mobileSearchBtn` visible; al activarlo la barra aparece bajo el topbar, el foco queda en `#globalSearch`, `aria-expanded="true"`.
  - Teclear ≥3 letras abre el dropdown a ancho casi completo; `Escape` cierra barra y panel y el foco vuelve al botón; el ✕ hace lo mismo.
  - Medir con `getBoundingClientRect()` (emulando `pointer: coarse` — usar un contexto móvil con `hasTouch: true`): `.lang-btn` y `.exam-dot` ≥44px en ambos ejes; gap computado ≥8px.
  - `.name-edit-btn` visible (opacity 0.7) sin hover.
  - `#mobileMenuBtn` alterna `aria-expanded` al abrir/cerrar el drawer.
- [ ] **Desktop (1280×800):**
  - Combobox: teclear en `#globalSearch`, `ArrowDown`×2 mueve `.gs-active` y `aria-activedescendant`; `Enter` expande término; `Enter` de nuevo navega al glosario; `Escape` cierra. Con examen activo, `Enter` sobre un resultado de lección muestra el toast de bloqueo y NO navega.
  - Exam dots: `Tab` entra en el dot actual (único tab stop), `ArrowRight`/`ArrowLeft` mueven pregunta y foco, `aria-current` sigue al actual.
  - Modal de avatar: `Tab` hasta `#userAvatar`, `Enter` abre, el foco cae en el botón de cierre, `Enter`/`Espacio` sobre una av-card la selecciona, `Escape` cierra y el foco vuelve a `#userAvatar`.
  - Toast warning (guard de examen) lleva `role="alert"`; los success no.
- [ ] **Ambos temas (recordar: `data-theme` vive en `<body>`):**
  - Iconos SVG renderizan con el color del texto en sidebar/topbar/stats/toasts/curriculum; el chevron de capítulo rota al abrir; el toggle de tema alterna sol/luna.
  - `.gs-active` visible en claro y oscuro; screenshots del antes/después de iconos al scratchpad.
- [ ] **No-regresión:** flip y carrusel de flashcards (con y sin reduced-motion), 21-Tab walk del ciclo completo sin trampa de foco, examen completo con teclado.

Si algo falla: arreglar, re-correr los gates de la tarea correspondiente y re-verificar aquí antes de dar la ronda por cerrada.

---

## Self-Review (hecho al escribir el plan)

- **Cobertura del spec:** I3→Task 1; I7→Tasks 2-3; I8→Tasks 4-6; follow-ups 1-9→Tasks 7-11 (ítem 9/TTS: solo documentación, Task 12); testing/gates→en cada tarea + Task 13; docs→Task 12. Sin huecos.
- **Correcciones al spec detectadas al planificar:** `toggleChapter` no re-renderiza (Task 8 sincroniza a mano; Task 12 corrige el spec). El toggle de tema (☀️/🌙 desde JS) y los badges ✓/🔒 de achievements/sim-lock son emojis estructurales no listados explícitamente en el spec — se incluyen en la Task 6 (mismo principio del Bloque 3 del spec). `.chapter-prog-pct` usaba `var(--primary)`, no un acento — Task 11 lo lleva a `--primary-text`.
- **Consistencia de tipos/nombres:** `App._icon(name)`, `App._closeMobileSearch(returnFocus)`, `App._gsKeydown(e)`, `App._gsMove(delta)`, `App._gsActivate()`, `App._gsItems`, `App._gsActive`, `AvatarSelector._returnFocusEl` — usados con la misma firma en todas las tareas que los citan.
