# Global Search Dropdown — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la navegación forzada del buscador global del topbar por un dropdown de resultados que nunca saca al usuario de su vista salvo clic explícito.

**Architecture:** Un panel `#globalSearchResults` dentro de `.search-box` (topbar, `index.html`), renderizado por métodos nuevos `App._gs*` en `js/app.js` a partir de `GLOSSARY` y `CHAPTERS`. La navegación solo ocurre en dos acciones explícitas («Ver en glosario», clic en lección), ambas bloqueadas por un flag `App._examActive` cuando hay un examen en curso. Spec aprobado: `docs/superpowers/specs/2026-07-08-global-search-dropdown-design.md`.

**Tech Stack:** Vanilla JS + CSS (sin librerías, como todo el proyecto). Tests: checks nuevos `N11` en `scripts/verify-runtime.js` (harness Node con DOM mockeado, sin npm install).

## Global Constraints

- Repo sin build/framework: los ficheros se editan directamente, no hay compilación.
- Convención del proyecto: handlers inline `onclick="App.metodo(...)"` con llamadas a globales; helpers privados con prefijo `_`; elementos ocultos de inicio con `style="display:none"` inline.
- **La consulta del usuario nunca se interpola en HTML** (regla XSS del audit 2026-07-04). El contenido del panel procede solo de `GLOSSARY`/`CHAPTERS` (datos estáticos del repo).
- Toda cadena visible nueva pasa por `i18n.t()`, con clave ES/EN pareada en `js/i18n.js` (la paridad la exige el harness).
- Tras cada cambio en `js/` o `index.html`: `node scripts/verify-runtime.js` debe salir en verde (el hook pre-commit lo ejecuta también sobre lo staged y bloquea el commit si falla).
- Commits directos a `master` (práctica establecida del repo, sin PRs).
- Solo escritorio: en ≤768px `.search-box` ya está oculto (`css/styles.css:1278`) — no añadir nada móvil.

---

### Task 1: Dropdown básico — abre, cierra, muestra resultados y NO navega

**Files:**
- Modify: `index.html:181-184` (bloque `.search-box`)
- Modify: `css/styles.css:273-291` (sección topbar, tras `.search-input::placeholder`)
- Modify: `js/i18n.js` (objeto `TRANSLATIONS`, secciones `es` y `en`)
- Modify: `js/app.js:15` (propiedades de instancia), `js/app.js:1055` (nueva sección antes de `/* ===== LANGUAGE ===== */`), `js/app.js:1161-1193` (reemplazo del listener actual de `globalSearch` dentro de `init()`)
- Test: `scripts/verify-runtime.js` (nuevo bloque `N11` + exponer `CHAPTERS`/`GLOSSARY` en `loadApp`)

**Interfaces:**
- Consumes: `GLOSSARY` (entradas `{ term: {es,en}, def: {es,en}, chapter, source }`), `CHAPTERS` (`{ id, icon, title: {es,en}, topics: [{ id, title: {es,en}, xp }] }`), `LESSONS` (mapa por `topic.id`), `i18n.t(key)`, `i18n.lang`.
- Produces (Tasks 2 y 3 dependen de esto): campos de instancia `App._gsQuery` (string), `App._gsGlossary` (array de entradas de `GLOSSARY`, máx. 5), `App._gsContent` (array de `{ chapterId, topicId, icon, title }`, máx. 3), `App._gsExpanded` (índice numérico o `null`); métodos `App._onGlobalSearchInput(e)`, `App._renderGlobalSearch()`, `App._closeGlobalSearch(clearInput = false)`. Claves i18n `gs_glossary_header`, `gs_content_header`, `gs_no_results`, `gs_view_in_glossary`, `gs_exam_block_toast`.

- [ ] **Step 1: Exponer `CHAPTERS` y `GLOSSARY` en el harness**

En `scripts/verify-runtime.js`, dentro de `loadApp()`, la cadena `ret` (línea ~129) devuelve los globales cargados. Añadir dos entradas:

```js
  const ret = `return {
    App: typeof App !== 'undefined' ? App : undefined,
    Auth: typeof Auth !== 'undefined' ? Auth : undefined,
    Sync: typeof Sync !== 'undefined' ? Sync : undefined,
    Monitoring: typeof Monitoring !== 'undefined' ? Monitoring : undefined,
    i18n: typeof i18n !== 'undefined' ? i18n : undefined,
    TRANSLATIONS: typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : undefined,
    CHAPTERS: typeof CHAPTERS !== 'undefined' ? CHAPTERS : undefined,
    GLOSSARY: typeof GLOSSARY !== 'undefined' ? GLOSSARY : undefined
  };`;
```

- [ ] **Step 2: Escribir los checks N11 (fallarán)**

Añadir tras el bloque N10 (después de la línea ~483, antes del bloque `/* ---- N5 + P5 ---- */`):

```js
  /* ---- N11: buscador global — dropdown sin navegación forzada ---- */
  {
    // Teclear >2 chars con match de glosario: abre el panel, NO navega, NO toca #glossarySearch
    const ctx = loadApp();
    ctx.App.init(null);
    ctx.App.currentView = 'dashboard';
    const input = ctx.document.getElementById('globalSearch');
    const panel = ctx.document.getElementById('globalSearchResults');
    input.value = ctx.GLOSSARY[0].term.es.toLowerCase();
    fireEl(input, 'input', { target: input });
    check('N11 dropdown: teclear >2 chars con match abre el panel',
      panel.style.display === 'block' && panel.innerHTML.length > 0);
    check('N11 dropdown: el panel lista el término del glosario que coincide',
      ctx.App._gsGlossary.length > 0 && panel.innerHTML.includes(ctx.GLOSSARY[0].term.es));
    check('N11 dropdown: teclear NO cambia de vista (antes navegaba a glosario)',
      ctx.App.currentView === 'dashboard');
    check('N11 dropdown: teclear NO escribe en #glossarySearch',
      ctx.document.getElementById('glossarySearch').value === '');

    // Bajar a ≤2 chars cierra el panel
    input.value = 'pr';
    fireEl(input, 'input', { target: input });
    check('N11 dropdown: bajar a ≤2 chars cierra el panel',
      panel.style.display === 'none' && panel.innerHTML === '');
  }
  {
    // Match de curriculum: la sección Contenido lista el topic (con lección) correcto
    const ctx = loadApp();
    ctx.App.init(null);
    ctx.App.currentView = 'flashcards';
    const topic = ctx.CHAPTERS[3].topics[0];
    const input = ctx.document.getElementById('globalSearch');
    input.value = topic.title.es.toLowerCase();
    fireEl(input, 'input', { target: input });
    check('N11 contenido: un título de topic aparece en la sección Contenido',
      ctx.App._gsContent.some(c => c.topicId === topic.id && c.chapterId === ctx.CHAPTERS[3].id));
    check('N11 contenido: tampoco navega (antes saltaba a curriculum)',
      ctx.App.currentView === 'flashcards');
  }
  {
    // Sin matches: mensaje "sin resultados"; la consulta del usuario NUNCA acaba en innerHTML
    const ctx = loadApp();
    ctx.App.init(null);
    const input = ctx.document.getElementById('globalSearch');
    const panel = ctx.document.getElementById('globalSearchResults');
    input.value = '<img src=x onerror=alert(1)>zzz';
    fireEl(input, 'input', { target: input });
    check('N11 vacío: sin matches muestra el mensaje de sin resultados',
      panel.innerHTML.includes(ctx.i18n.t('gs_no_results')));
    check('N11 xss: la consulta del usuario no se interpola en el innerHTML del panel',
      !panel.innerHTML.includes('<img src=x'));
  }
```

- [ ] **Step 3: Ejecutar el harness y verificar que los N11 fallan**

Run: `node scripts/verify-runtime.js`
Expected: los checks N11 salen ❌ (y/o excepción por `_gsGlossary` undefined); todos los N1–N10 e i18n siguen ✅. Exit code 1.

- [ ] **Step 4: HTML — contenedor del panel**

En `index.html`, reemplazar el bloque `.search-box` (líneas 181-184):

```html
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" class="search-input" id="globalSearch" placeholder="Buscar..." data-i18n-placeholder="search_placeholder" />
          <div class="search-results" id="globalSearchResults" style="display:none"></div>
        </div>
```

- [ ] **Step 5: CSS — estilos del panel**

En `css/styles.css`, añadir `position: relative;` al bloque `.search-box` existente (línea 273):

```css
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  position: relative;
}
```

(Si el bloque actual no tiene la línea `border`, conservar el bloque tal cual esté y añadir solo `position: relative;` — no inventar propiedades.)

Y añadir tras `.search-input::placeholder` (línea 291):

```css
.search-results {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 320px;
  max-height: 420px;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  z-index: 300;
  padding: 6px;
}
.search-results-header {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text3);
  padding: 6px 10px 2px;
}
.search-result {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.search-result:hover { background: var(--bg4); }
.search-result-term { font-weight: 700; font-size: 0.85rem; }
.search-result-def {
  font-size: 0.8rem;
  color: var(--text2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.search-result.expanded .search-result-def {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}
.search-result-link {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
}
.search-result-lesson {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}
.search-no-results {
  padding: 12px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text3);
}
```

- [ ] **Step 6: i18n — claves nuevas**

En `js/i18n.js`, dentro de `TRANSLATIONS.es`, añadir un bloque nuevo (junto a las demás secciones comentadas):

```js
    // GLOBAL SEARCH
    gs_glossary_header: "Glosario",
    gs_content_header: "Contenido",
    gs_no_results: "Sin resultados",
    gs_view_in_glossary: "Ver en glosario →",
    gs_exam_block_toast: "Termina o abandona el examen antes de navegar",
```

Y el bloque espejo dentro de `TRANSLATIONS.en`:

```js
    // GLOBAL SEARCH
    gs_glossary_header: "Glossary",
    gs_content_header: "Content",
    gs_no_results: "No results",
    gs_view_in_glossary: "View in glossary →",
    gs_exam_block_toast: "Finish or quit the exam before navigating",
```

(`gs_exam_block_toast` se usa en la Task 3; definirla ya evita tocar i18n dos veces y el harness no exige "definida-pero-no-usada", solo lo inverso.)

- [ ] **Step 7: app.js — estado + render del panel**

En `js/app.js`, junto a las propiedades de instancia existentes (línea ~15, donde está `examTimer: null`), añadir:

```js
  _gsQuery: '',
  _gsGlossary: [],
  _gsContent: [],
  _gsExpanded: null,
```

Añadir una sección nueva antes de `/* ===== LANGUAGE ===== */` (línea ~1055):

```js
  /* ===== GLOBAL SEARCH (dropdown del topbar) ===== */
  _onGlobalSearchInput(e) {
    const q = e.target.value.toLowerCase().trim();
    if (q.length <= 2) { this._closeGlobalSearch(); return; }
    const lang = i18n.lang;
    this._gsQuery = q;
    this._gsExpanded = null;
    this._gsGlossary = GLOSSARY.filter(g =>
      g.term[lang].toLowerCase().includes(q) || g.def[lang].toLowerCase().includes(q)
    ).slice(0, 5);
    const content = [];
    CHAPTERS.forEach(ch => {
      const topics = ch.topics.filter(t => LESSONS[t.id]);
      if (!topics.length) return;
      if (ch.title[lang].toLowerCase().includes(q)) {
        content.push({ chapterId: ch.id, topicId: topics[0].id, icon: ch.icon, title: ch.title[lang] });
      }
      topics.forEach(t => {
        if (t.title[lang].toLowerCase().includes(q)) {
          content.push({ chapterId: ch.id, topicId: t.id, icon: ch.icon, title: t.title[lang] });
        }
      });
    });
    this._gsContent = content.slice(0, 3);
    this._renderGlobalSearch();
  },

  _renderGlobalSearch() {
    const panel = document.getElementById('globalSearchResults');
    const lang = i18n.lang;
    if (!this._gsGlossary.length && !this._gsContent.length) {
      panel.innerHTML = `<div class="search-no-results">${i18n.t('gs_no_results')}</div>`;
      panel.style.display = 'block';
      return;
    }
    let html = '';
    if (this._gsGlossary.length) {
      html += `<div class="search-results-header">${i18n.t('gs_glossary_header')}</div>`;
      html += this._gsGlossary.map((g, i) => {
        const expanded = this._gsExpanded === i;
        return `
        <div class="search-result${expanded ? ' expanded' : ''}" onclick="App._gsToggleTerm(${i})">
          <div class="search-result-term">${g.term[lang]}</div>
          <div class="search-result-def">${g.def[lang]}</div>
          ${expanded ? `<a class="search-result-link" onclick="event.stopPropagation();App._gsGoGlossary()">${i18n.t('gs_view_in_glossary')}</a>` : ''}
        </div>`;
      }).join('');
    }
    if (this._gsContent.length) {
      html += `<div class="search-results-header">${i18n.t('gs_content_header')}</div>`;
      html += this._gsContent.map(c => `
        <div class="search-result search-result-lesson" onclick="App._gsGoLesson(${c.chapterId}, '${c.topicId}')">
          <span>${c.icon}</span><span>${c.title}</span>
        </div>`).join('');
    }
    panel.innerHTML = html;
    panel.style.display = 'block';
  },

  _closeGlobalSearch(clearInput = false) {
    const panel = document.getElementById('globalSearchResults');
    panel.style.display = 'none';
    panel.innerHTML = '';
    this._gsExpanded = null;
    if (clearInput) document.getElementById('globalSearch').value = '';
  },
```

Notas de seguridad que el implementador debe respetar tal cual: la consulta `q` **no** aparece en ningún template string de `_renderGlobalSearch` — solo datos de `GLOSSARY`/`CHAPTERS`. `_gsToggleTerm`, `_gsGoGlossary` y `_gsGoLesson` se definen en las Tasks 2 y 3; los `onclick` que los referencian ya quedan en el HTML generado, pero nada los invoca todavía (el DOM mockeado no ejecuta `onclick`, y en navegador no se prueba hasta la Task 4).

- [ ] **Step 8: app.js — reemplazar el listener de `globalSearch` en `init()`**

Reemplazar el bloque completo `document.getElementById('globalSearch').addEventListener(...)` (líneas 1161-1193, desde `document.getElementById('globalSearch').addEventListener('input', (e) => {` hasta su `});` de cierre) por:

```js
    const gsInput = document.getElementById('globalSearch');
    gsInput.addEventListener('input', (e) => this._onGlobalSearchInput(e));
    gsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._closeGlobalSearch();
    });
    document.addEventListener('click', (e) => {
      if (!(e.target && e.target.closest && e.target.closest('.search-box'))) {
        this._closeGlobalSearch();
      }
    });
```

Con esto desaparecen del listener: el `navigate('glossary')`, el `navigate('curriculum')` y toda escritura en `#glossarySearch` (el buscador del glosario y el global quedan independientes; el global ya no lo limpia al borrarse — solo lo rellenará la acción explícita «Ver en glosario» de la Task 2).

- [ ] **Step 9: Ejecutar el harness y verificar que todo pasa**

Run: `node scripts/verify-runtime.js`
Expected: todos los checks ✅, incluidos los N11 nuevos y los de i18n (paridad 165/165 tras las 5 claves nuevas). Exit code 0.

- [ ] **Step 10: Commit**

```bash
git add index.html css/styles.css js/i18n.js js/app.js scripts/verify-runtime.js
git commit -m "feat(search): dropdown de resultados en el buscador global, sin navegación forzada"
```

(El hook pre-commit re-ejecuta el harness sobre lo staged; si bloquea, el fallo es real — no saltárselo.)

---

### Task 2: Interacciones del panel — expandir término, «Ver en glosario», ir a lección

**Files:**
- Modify: `js/app.js` (sección `/* ===== GLOBAL SEARCH ===== */` creada en Task 1)
- Test: `scripts/verify-runtime.js` (ampliar bloque N11)

**Interfaces:**
- Consumes (de Task 1): `App._gsQuery`, `App._gsGlossary`, `App._gsExpanded`, `App._renderGlobalSearch()`, `App._closeGlobalSearch(clearInput)`, claves i18n `gs_view_in_glossary`; `App.navigate(view)` y `App.navigateToLesson(chapterId, topicId)` existentes.
- Produces (Task 3 depende de esto): `App._gsToggleTerm(i)`, `App._gsGoGlossary()`, `App._gsGoLesson(chapterId, topicId)` — los dos últimos son los puntos donde Task 3 inserta el guard.

- [ ] **Step 1: Escribir los checks (fallarán)**

Añadir al final del bloque N11 en `scripts/verify-runtime.js`:

```js
  {
    // Expandir/colapsar un término dentro del panel
    const ctx = loadApp();
    ctx.App.init(null);
    const input = ctx.document.getElementById('globalSearch');
    const panel = ctx.document.getElementById('globalSearchResults');
    input.value = ctx.GLOSSARY[0].term.es.toLowerCase();
    fireEl(input, 'input', { target: input });

    ctx.App._gsToggleTerm(0);
    check('N11 expandir: el clic marca el resultado como expandido y muestra el enlace al glosario',
      ctx.App._gsExpanded === 0 &&
      panel.innerHTML.includes('search-result expanded') &&
      panel.innerHTML.includes(ctx.i18n.t('gs_view_in_glossary')));

    ctx.App._gsToggleTerm(0);
    check('N11 expandir: un segundo clic colapsa el término',
      ctx.App._gsExpanded === null && !panel.innerHTML.includes('search-result expanded'));
  }
  {
    // «Ver en glosario»: navega, aplica el filtro y limpia el buscador global
    const ctx = loadApp();
    ctx.App.init(null);
    ctx.App.currentView = 'dashboard';
    const input = ctx.document.getElementById('globalSearch');
    const panel = ctx.document.getElementById('globalSearchResults');
    input.value = ctx.GLOSSARY[0].term.es.toLowerCase();
    fireEl(input, 'input', { target: input });

    ctx.App._gsGoGlossary();
    check('N11 ver-en-glosario: navega a la vista de glosario', ctx.App.currentView === 'glossary');
    check('N11 ver-en-glosario: aplica el filtro en #glossarySearch',
      ctx.document.getElementById('glossarySearch').value === ctx.GLOSSARY[0].term.es.toLowerCase());
    check('N11 ver-en-glosario: cierra el panel y limpia el buscador global',
      panel.style.display === 'none' && input.value === '');
  }
  {
    // Clic en un resultado de Contenido: va directo a la lección
    const ctx = loadApp();
    ctx.App.init(null);
    const panel = ctx.document.getElementById('globalSearchResults');
    let navArgs = null;
    ctx.App.navigateToLesson = (c, t) => { navArgs = [c, t]; };
    const topic = ctx.CHAPTERS[3].topics[0];
    ctx.App._gsGoLesson(ctx.CHAPTERS[3].id, topic.id);
    check('N11 lección: el clic llama a navigateToLesson con chapterId/topicId correctos',
      navArgs !== null && navArgs[0] === ctx.CHAPTERS[3].id && navArgs[1] === topic.id);
    check('N11 lección: cierra el panel', panel.style.display === 'none');
  }
```

- [ ] **Step 2: Ejecutar el harness y verificar que los checks nuevos fallan**

Run: `node scripts/verify-runtime.js`
Expected: los 3 bloques nuevos fallan (`_gsToggleTerm is not a function`); N1–N10 y los N11 de la Task 1 siguen ✅. Exit code 1.

- [ ] **Step 3: Implementar los tres métodos**

En la sección `/* ===== GLOBAL SEARCH ===== */` de `js/app.js`, entre `_renderGlobalSearch()` y `_closeGlobalSearch()`, añadir:

```js
  _gsToggleTerm(i) {
    this._gsExpanded = this._gsExpanded === i ? null : i;
    this._renderGlobalSearch();
  },

  _gsGoGlossary() {
    document.getElementById('glossarySearch').value = this._gsQuery;
    this._closeGlobalSearch(true);
    this.navigate('glossary');
  },

  _gsGoLesson(chapterId, topicId) {
    this._closeGlobalSearch(true);
    this.navigateToLesson(chapterId, topicId);
  },
```

(Orden importante en `_gsGoGlossary`: rellenar `#glossarySearch` **antes** de `navigate('glossary')`, porque `renderGlossary()` lee ese input al pintar — si se navega primero, la vista aparece un instante sin filtrar.)

- [ ] **Step 4: Ejecutar el harness y verificar que todo pasa**

Run: `node scripts/verify-runtime.js`
Expected: todos ✅. Exit code 0.

- [ ] **Step 5: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(search): expandir términos in situ y navegación explícita desde el dropdown"
```

---

### Task 3: Guard de examen en curso (`App._examActive`)

**Files:**
- Modify: `js/app.js:15` (propiedad), `js/app.js:588` (`renderSimulatorMenu`), `js/app.js:719` (`launchExam`), `js/app.js:834` (`finishExam`), sección GLOBAL SEARCH (`_gsGoGlossary`/`_gsGoLesson`)
- Test: `scripts/verify-runtime.js` (ampliar bloque N11)

**Interfaces:**
- Consumes (de Tasks 1-2): `App._gsGoGlossary()`, `App._gsGoLesson()`, clave i18n `gs_exam_block_toast` (definida en Task 1); `App.showToast(msg, type)` existente (`js/app.js:1035`).
- Produces: `App._examActive` (boolean; `true` en `launchExam()`, `false` en `finishExam()` y en `renderSimulatorMenu()`), `App._gsBlockIfExam()` (devuelve `true` si bloqueó).

- [ ] **Step 1: Escribir los checks (fallarán)**

Añadir al final del bloque N11 en `scripts/verify-runtime.js`:

```js
  {
    // Ciclo de vida del flag _examActive
    const ctx = loadApp();
    ctx.App._initialized = true;
    ctx.App.state = ctx.App.loadState();
    ctx.App.examQuestions = [SAMPLE_Q]; ctx.App.examAnswers = { 0: 0 };
    ctx.App.examType = 'chapter'; ctx.App.examChapterId = null;
    ctx.App.examCurrentQ = 0; ctx.App.examReviewing = false;
    ctx.App.examTimeLeft = 0; ctx.App.examTimer = null;
    check('N11 examen: _examActive arranca en false', ctx.App._examActive === false);
    ctx.App.launchExam('t');
    check('N11 examen: launchExam activa _examActive', ctx.App._examActive === true);
    ctx.App.finishExam();
    check('N11 examen: finishExam desactiva _examActive', ctx.App._examActive === false);
    ctx.App._examActive = true;
    ctx.App.renderSimulatorMenu();
    check('N11 examen: volver al menú del simulador desactiva _examActive (sin bloqueo permanente)',
      ctx.App._examActive === false);
  }
  {
    // Con examen activo, las acciones que navegan quedan bloqueadas con toast
    const ctx = loadApp();
    ctx.App.init(null);
    ctx.App.currentView = 'simulator';
    const input = ctx.document.getElementById('globalSearch');
    input.value = ctx.GLOSSARY[0].term.es.toLowerCase();
    fireEl(input, 'input', { target: input });

    ctx.App._examActive = true;
    const toasts = [];
    ctx.App.showToast = (msg, kind) => toasts.push({ msg, kind });
    let navCalled = false;
    ctx.App.navigateToLesson = () => { navCalled = true; };

    ctx.App._gsGoGlossary();
    check('N11 guard: con examen activo, «Ver en glosario» no navega y avisa con toast',
      ctx.App.currentView === 'simulator' && toasts.length === 1 &&
      toasts[0].msg === ctx.i18n.t('gs_exam_block_toast'));

    ctx.App._gsGoLesson(0, ctx.CHAPTERS[0].topics[0].id);
    check('N11 guard: con examen activo, un resultado de lección tampoco navega',
      navCalled === false && toasts.length === 2);

    check('N11 guard: consultar el dropdown durante el examen sigue funcionando (no navega, no bloquea)',
      ctx.document.getElementById('globalSearchResults').innerHTML.length > 0);
  }
```

- [ ] **Step 2: Ejecutar el harness y verificar que los checks nuevos fallan**

Run: `node scripts/verify-runtime.js`
Expected: fallan los checks de `_examActive` (undefined ≠ false) y los del guard (navega en vez de bloquear). Exit code 1.

- [ ] **Step 3: Implementar el flag y el guard**

En `js/app.js`, junto a `examTimer: null` (línea ~15), añadir:

```js
  _examActive: false,
```

En `launchExam(title)` (línea ~719), como primera línea del cuerpo:

```js
    this._examActive = true;
```

En `finishExam()` (línea ~834), tras el `clearInterval` inicial:

```js
    this._examActive = false;
```

En `renderSimulatorMenu()` (línea ~588), como primera línea del cuerpo — si el menú del simulador se pinta, no hay examen en pantalla; sin esto, abandonar un examen de capítulo (sin temporizador) navegando por el sidebar dejaría el flag en `true` para siempre y el buscador bloqueado permanentemente:

```js
    this._examActive = false;
```

En la sección GLOBAL SEARCH, añadir el helper y usarlo como primera línea de las dos acciones que navegan:

```js
  _gsBlockIfExam() {
    if (!this._examActive) return false;
    this.showToast(i18n.t('gs_exam_block_toast'), 'warning');
    return true;
  },
```

```js
  _gsGoGlossary() {
    if (this._gsBlockIfExam()) return;
    document.getElementById('glossarySearch').value = this._gsQuery;
    this._closeGlobalSearch(true);
    this.navigate('glossary');
  },

  _gsGoLesson(chapterId, topicId) {
    if (this._gsBlockIfExam()) return;
    this._closeGlobalSearch(true);
    this.navigateToLesson(chapterId, topicId);
  },
```

- [ ] **Step 4: Ejecutar el harness y verificar que todo pasa**

Run: `node scripts/verify-runtime.js`
Expected: todos ✅. Exit code 0.

- [ ] **Step 5: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(search): bloquear la navegación del dropdown durante un examen en curso"
```

---

### Task 4: Verificación manual en navegador + sync de documentación

**Files:**
- Modify: `AGENTS.md` (sección "Architecture", nueva subsección), `CLAUDE.md` (resumen + cross-reference)
- No se toca código de la app en esta task salvo que la verificación manual encuentre un defecto (en cuyo caso: arreglar, añadir check al harness si es comportamiento runtime, re-verificar).

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: documentación sincronizada (regla del repo: CLAUDE.md resumen conciso que apunta a AGENTS.md para el detalle).

- [ ] **Step 1: Servir la app y verificar manualmente**

Run: `python -m http.server 8000` (desde la raíz del repo) y abrir `http://localhost:8000`.

Checklist (del spec, sección "Testing / verificación") — repetir en tema claro y oscuro, y en ES y EN:

- Desde el dashboard, teclear una palabra del glosario (p. ej. "prueba"): el panel aparece bajo el buscador, correctamente posicionado, sin cambiar de vista.
- Clic en un término → la definición se expande completa in situ; segundo clic la colapsa; «Ver en glosario» lleva al glosario ya filtrado y limpia el buscador global.
- Teclear el título de una lección (p. ej. "revisión"): aparece la sección Contenido; clic → abre esa lección directamente.
- Consulta sin resultados (p. ej. "zzzz"): mensaje de sin resultados.
- Escape y clic fuera cierran el panel; borrar el texto también.
- El panel se superpone correctamente al contenido de cada vista (dashboard, curriculum, flashcards, simulador, glosario, progreso, logros) — sin quedar por debajo de ningún elemento (z-index).
- Con muchos resultados el panel scrollea internamente (max-height).
- Empezar un examen de capítulo, teclear en el buscador: el panel abre y las definiciones se pueden expandir; «Ver en glosario» y los resultados de lección muestran el toast y NO navegan. Terminar el examen: la navegación desde el buscador vuelve a funcionar.
- Cambiar de idioma con el switcher ES/EN y repetir una búsqueda: encabezados, mensaje vacío y resultados salen en el idioma activo.

Si algo falla: arreglar, añadir check N11 si es comportamiento verificable en el harness, y volver a pasar `node scripts/verify-runtime.js` antes de seguir.

- [ ] **Step 2: Actualizar AGENTS.md**

En la sección "Architecture", añadir una subsección nueva (después de "Flashcard Carousel Animation (2026-07-07)"):

```markdown
### Global Search Dropdown (2026-07-08)

El buscador global del topbar (`#globalSearch`) ya **no navega forzosamente** al glosario/
curriculum mientras el usuario teclea (comportamiento original del listener en `App.init()`,
que además persistía la vista forzada vía `_saveCurrentView` y podía romper la pantalla de un
examen en curso al volver al simulador). Diseño completo:
`docs/superpowers/specs/2026-07-08-global-search-dropdown-design.md`.

- Con >2 caracteres se abre un panel `#globalSearchResults` (dentro de `.search-box`,
  solo escritorio — en ≤768px `.search-box` sigue oculto) con hasta 5 términos del
  `GLOSSARY` (definición recortada a 2 líneas por CSS `line-clamp`) y hasta 3 resultados
  de `CHAPTERS`/topics con lección. Lógica en la sección `/* ===== GLOBAL SEARCH ===== */`
  de `js/app.js` (`_onGlobalSearchInput`, `_renderGlobalSearch`, `_closeGlobalSearch`).
- Clic en un término lo **expande in situ** (`_gsToggleTerm`); el enlace «Ver en glosario»
  (`_gsGoGlossary`) es la única vía por la que el buscador global escribe en
  `#glossarySearch` (antes lo hacía en cada pulsación). Clic en un resultado de contenido →
  `_gsGoLesson` → `navigateToLesson()` directo a la lección.
- **Guard de examen:** `App._examActive` (true en `launchExam()`, false en `finishExam()` y
  en `renderSimulatorMenu()` — este último evita un bloqueo permanente si se abandona un
  examen de capítulo, sin temporizador, navegando por el sidebar). Con el flag activo,
  `_gsBlockIfExam()` bloquea las dos acciones que navegan con un toast
  (`gs_exam_block_toast`); expandir definiciones sigue funcionando.
- **XSS:** la consulta del usuario nunca se interpola en el `innerHTML` del panel — solo
  datos estáticos de `GLOSSARY`/`CHAPTERS`. Sin resaltado de coincidencias, deliberadamente.
  Verificado por un check N11.
- i18n: 5 claves nuevas `gs_*` (ES/EN). Verificado por los checks `N11` de
  `scripts/verify-runtime.js` (apertura/cierre, no-navegación, expandir, ambas acciones de
  navegación, ciclo de vida del guard, XSS); `loadApp()` del harness expone ahora también
  `CHAPTERS`/`GLOSSARY` para estos checks.
```

- [ ] **Step 3: Actualizar CLAUDE.md**

Añadir al final de CLAUDE.md (tras la sección "UI/UX Polish & Flashcard Carousel Animation (2026-07-07)"):

```markdown
## Global Search Dropdown (2026-07-08)

El buscador global del topbar ya no navega forzosamente al glosario/curriculum al teclear
(rompía el contexto del usuario y podía tumbar la pantalla de un examen en curso): ahora
abre un dropdown de resultados (glosario expandible in situ + lecciones), y solo navega con
un clic explícito — bloqueado con toast si hay un examen activo (`App._examActive`). Diseño:
`docs/superpowers/specs/2026-07-08-global-search-dropdown-design.md`; detalle completo:
`AGENTS.md` → "Global Search Dropdown". Verificado por los checks `N11` de
`scripts/verify-runtime.js`.
```

- [ ] **Step 4: Harness completo + commit final**

Run: `node scripts/verify-runtime.js`
Expected: todos ✅. Exit code 0.

```bash
git add AGENTS.md CLAUDE.md
git commit -m "docs: sync CLAUDE.md/AGENTS.md con el dropdown del buscador global"
git push origin master
```

(El push del resto de commits de las Tasks 1-3 va incluido aquí — regla de cierre de sesión del repo: nada sin commitear ni sin push.)
