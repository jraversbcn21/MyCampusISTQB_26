# Adaptabilidad móvil (320–480px) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a la app la capa móvil (320–480px) que hoy no tiene: tier de breakpoint nuevo, red de seguridad de texto, `dvh`, safe areas, drawer con comportamiento real, glosario apilado, tablas con scroll, flashcards en columna, tira de dots del examen, onboarding funcional en móvil — y dejar el hueco de gates resuelto (familia `N20` estática + `scripts/validate-responsive.js` con navegador real).

**Architecture:** SPA vanilla JS sin build. Cambios en `index.html`, `css/styles.css`, `js/app.js`, `js/onboarding.js`; gates en `scripts/verify-runtime.js` (familia nueva `N20`) y el script nuevo `scripts/validate-responsive.js` (Playwright, no-op si falta). TDD: cada tarea añade primero sus checks (rojos), luego la implementación (verdes).

**Tech Stack:** Vanilla JS, CSS, Node para validadores, Playwright/Chromium para `validate-responsive.js` y la verificación final.

**Spec:** `docs/superpowers/specs/2026-07-21-mobile-adaptability-design.md` (aprobada 2026-07-21, incluida la política Playwright).

## Global Constraints

- Cola de `css/styles.css`: el tier nuevo `@media (max-width: 480px)` va junto al bloque de 768px (después de él). El final del fichero sigue siendo, en orden: `(pointer: coarse)` → `(prefers-reduced-motion)` → `:focus-visible` literalmente último. No añadir nada después de `:focus-visible`.
- **PROHIBIDO** `overflow-x: hidden` en `html`/`body`/`.main`/`.views-container` como mitigación de desbordamiento (decisión de usuario; hay check que lo bloquea).
- **Todo toggle del drawer pasa por `App._setDrawerOpen(open)`** — nunca `classList` directo sobre `mobile-open` fuera de él (paralelo exacto a la regla `_setExamActive`; hay check).
- `js/content.js` NO se edita (fidelidad de contenido; las tablas se envuelven por DOM en render).
- Nada en `js/` puede depender de `transitionend`/`animationend`; todo scroll/animación nueva con guard de reduced-motion (patrón `matchMedia` existente en app.js ~línea 533).
- No tocar el mecanismo `composedPath()` del listener "clic fuera" del buscador; el cierre del drawer usa el scrim, NO ese listener.
- Elementos interactivos en templates `innerHTML`: `role="button" tabindex="0"` + keydown delegado.
- El harness mockea el DOM: `el.querySelector()`/`el.querySelectorAll()` sobre un nodo pueden devolver null/no existir, `el.children` no existe, `scrollIntoView` no existe — **todo acceso nuevo de ese tipo debe null-guardarse** (los puntos exactos están marcados en cada tarea).
- i18n: esta ronda no añade claves (si una tarea acaba necesitando una, pareja ES/EN + actualizar el conteo de 175 en CLAUDE.md en la misma tarea).
- Después de CADA tarea: `node scripts/verify-runtime.js` y, si tocó CSS, `node scripts/validate-contrast.js`. El hook pre-commit los fuerza sobre la copia staged.
- Anclas de línea del plan son "~" (aproximadas): confirmar con grep antes de editar.

---

### Task 1: Bloque 0a — Tier 480 (fusión del 500), paddings, grids y wraps (CSS + checks N20-tier)

**Files:**
- Modify: `scripts/verify-runtime.js` (nuevo bloque N20 tras el N19)
- Modify: `css/styles.css` (nuevo tier tras el bloque de 768px ~línea 1403; eliminar el bloque de 500px ~línea 1830)

- [ ] **Step 1: Checks N20-tier (fallando)**

Tras el bloque N19, añadir:

```js
  /* ---- N20: adaptabilidad móvil (2026-07-21) — tier 480 + invariantes ---- */
  {
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    const tier480 = cssSrc.indexOf('@media (max-width: 480px)');
    const coarseStart = cssSrc.indexOf('@media (pointer: coarse)');
    check('N20 tier: existe @media (max-width: 480px) y va antes del bloque coarse',
      tier480 >= 0 && coarseStart > tier480);
    check('N20 tier: el bloque de 500px fue fusionado (ya no existe)',
      !cssSrc.includes('@media (max-width: 500px)'));
    const t480 = tier480 >= 0 ? cssSrc.slice(tier480, coarseStart) : '';
    check('N20 tier: avatar-grid a 1 columna vive en el tier 480',
      /\.avatar-grid\s*\{\s*grid-template-columns:\s*1fr/.test(t480));
    check('N20 tier: stats-grid y results-stats colapsan a 1 columna',
      /\.stats-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*[;}]/.test(t480)
      && /\.results-stats\s*\{[^}]*grid-template-columns:\s*1fr\s*[;}]/.test(t480));
    check('N20 tier: filas flex envuelven (rating/results-actions/lesson-actions/exam-topbar/flashcard-stats)',
      ['.rating-btns', '.results-actions', '.lesson-actions', '.exam-topbar', '.flashcard-stats-row']
        .every(s => new RegExp(s.replace('.', '\\.') + '[^{]*\\{[^}]*flex-wrap:\\s*wrap').test(t480)));
    check('N20 tier: paddings reducidos (.view/.topbar/.exam-body/.auth-card)',
      /\.view\s*\{[^}]*padding:\s*12px/.test(t480) && /\.topbar\s*\{[^}]*padding:/.test(t480)
      && /\.exam-body\s*\{[^}]*padding:/.test(t480) && /\.auth-card\s*\{[^}]*padding:/.test(t480));
    check('N20 tier: prohibido overflow-x:hidden como mitigación en body/main/views-container',
      !/(?:^|[\s,])(?:body|html|\.main|\.views-container)[^{]*\{[^}]*overflow-x:\s*hidden/m.test(cssSrc));
  }
```

Nota: el último check pasa hoy (nadie declara eso) — es un candado, no un TDD rojo; los otros seis deben salir rojos.

- [ ] **Step 2: Verificar rojos** — `node scripts/verify-runtime.js` → los checks `N20 tier:*` en ❌ salvo el candado.

- [ ] **Step 3: Implementar el tier**

En `css/styles.css`, justo después del cierre del bloque `@media (max-width: 768px)` (~línea 1403), insertar:

```css
/* ===== TIER TELÉFONO (adaptabilidad móvil, 2026-07-21) =====
   Hasta hoy solo existía el tier tablet (768px); la franja 320–480px estaba
   sin tratar (el antiguo bloque de 500px —solo avatar-grid— está fusionado
   aquí). Criterio: recuperar ancho útil (paddings), colapsar a 1 columna lo
   que quedaba ilegible, y envolver las filas que no cabían. */
@media (max-width: 480px) {
  .view { padding: 12px; }
  .topbar { padding: 0 12px; }
  .topbar-left, .topbar-right { gap: 8px; }
  .card { padding: 16px; }
  .exam-body { padding: 16px; }
  .auth-card { padding: 24px 20px; }
  #auth-screen { padding: 12px; }
  .welcome-banner { padding: 20px; }
  .topic-list { padding: 8px 12px 16px; }
  .stats-grid { grid-template-columns: 1fr; }
  .results-stats { grid-template-columns: 1fr; }
  .rating-btns { flex-wrap: wrap; justify-content: center; }
  .results-actions { flex-wrap: wrap; }
  .lesson-actions { flex-wrap: wrap; gap: 12px; }
  .exam-topbar { flex-wrap: wrap; gap: 8px; }
  .flashcard-stats-row { flex-wrap: wrap; }
  .achievements-summary { padding: 16px; gap: 16px; }
  /* Fusionado del antiguo @media (max-width: 500px): */
  .avatar-grid { grid-template-columns: 1fr; }
}
```

Y **eliminar** el bloque `@media (max-width: 500px) { .avatar-grid ... }` (~línea 1830) junto con su comentario.

- [ ] **Step 4: Verificar verdes** — `node scripts/verify-runtime.js && node scripts/validate-contrast.js` → PASS (si algún check existente referencia el bloque de 500px, actualizarlo en este mismo commit y anotarlo para la review).

- [ ] **Step 5: Commit** — `feat(css): tier de breakpoint 480px — paddings, grids a 1 col y flex-wrap (móvil)`

---

### Task 2: Bloque 0b — Red de seguridad de texto + dvh + topbar (CSS/JS + checks)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N20)
- Modify: `css/styles.css` (reglas base, fuera de media queries, en las secciones de cada componente)
- Modify: `js/app.js` (`renderContinueStudying` ~línea 228: el `style="flex:1"`)

- [ ] **Step 1: Checks (fallando)**

Al final del bloque N20:

```js
    check('N20 texto: overflow-wrap en los contenedores de contenido',
      ['.lesson-content', '.glossary-def', '.exam-option', '.fc-question', '.fc-answer', '.activity-text']
        .every(s => new RegExp(s.replace('.', '\\.') + '[^{]*\\{[^}]*overflow-wrap:\\s*break-word').test(cssSrc)));
    check('N20 texto: .page-title trunca en vez de desbordar',
      /\.page-title\s*\{[^}]*text-overflow:\s*ellipsis/.test(cssSrc)
      && /\.topbar-left\s*\{[^}]*min-width:\s*0/.test(cssSrc));
    check('N20 dvh: cada 100vh lleva su pareja dvh (sidebar/body/main/app-container)',
      !/height:\s*100vh(?![\s\S]{0,80}height:\s*100dvh)/.test(cssSrc)
      && !/min-height:\s*100vh(?![\s\S]{0,80}min-height:\s*100dvh)/.test(cssSrc));
    check('N20 dvh: el modal de avatar usa dvh con fallback',
      /max-height:\s*88vh;\s*[\s\S]{0,40}max-height:\s*88dvh/.test(cssSrc));
```

- [ ] **Step 2: Verificar rojos.**

- [ ] **Step 3: Implementar**

**3a. dvh con fallback** — en los 4 sitios (`body` ~69, `.sidebar` ~81, `.main` ~250, `#app-container` ~1639) y `.avatar-modal-card` ~1664, convertir la declaración en par fallback+moderna, p. ej.:

```css
  height: 100vh;  /* fallback */
  height: 100dvh; /* el chrome móvil (URL bar) no roba el footer del sidebar */
```

(mismo patrón `min-height`/`max-height` donde corresponda).

**3b. Red de texto** — añadir a las reglas base existentes de cada selector (no en media query; inofensivo en desktop):

- `overflow-wrap: break-word` en: `.lesson-content` (~735), `.glossary-def` (~1185), `.search-result-def` (~339), `.exam-q-text` (~1037), `.exam-option` (~1039), `.fc-question` (~895), `.fc-answer` (~897), `.review-item-q` (~1131), `.activity-text` (~1239).
- `min-width: 0` en: `.topbar-left` (~269), `.chapter-info` (sección chapter-card), `.glossary-def`, `.activity-text`.
- `.page-title` (~272): añadir `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`.

**3c. app.js ~228** — `style="flex:1"` → `style="flex:1;min-width:0"`.

- [ ] **Step 4: Verificar verdes** (+ `validate-contrast.js`).

- [ ] **Step 5: Commit** — `fix(css): red de seguridad de texto (overflow-wrap/min-width:0), dvh y truncado del topbar`

---

### Task 3: Bloque 0c — Safe areas (meta + env insets + checks)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N20)
- Modify: `index.html` (meta viewport, línea 5)
- Modify: `css/styles.css` (`.bmc-fab`, `.toast-container`, `.sidebar`, `.topbar`)

- [ ] **Step 1: Checks (fallando)**

```js
    const htmlSrc20 = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N20 safearea: viewport-fit=cover en el meta viewport',
      /name="viewport"[^>]*viewport-fit=cover/.test(htmlSrc20));
    check('N20 safearea: .bmc-fab y .toast-container respetan el inset inferior',
      /\.bmc-fab\s*\{[^}]*env\(safe-area-inset-bottom/.test(cssSrc)
      && /\.toast-container\s*\{[^}]*env\(safe-area-inset-bottom/.test(cssSrc));
    check('N20 safearea: el sidebar reserva insets superior e inferior',
      /\.sidebar[^{]*\{[^}]*env\(safe-area-inset-top/.test(cssSrc)
      && /env\(safe-area-inset-bottom/.test(cssSrc.slice(cssSrc.indexOf('.sidebar-footer'))));
```

- [ ] **Step 2: Verificar rojos.**

- [ ] **Step 3: Implementar**

**3a.** Meta viewport → `content="width=device-width, initial-scale=1.0, viewport-fit=cover"`. **Mismo commit que los insets** (activar cover sin insets expone lo que hoy tapa el letterbox).

**3b.** Patrón `calc(base + env(..., 0px))`:

- `.bmc-fab`: `bottom: calc(24px + env(safe-area-inset-bottom, 0px)); right: calc(24px + env(safe-area-inset-right, 0px));`
- `.toast-container`: ídem con su base 80px/24px. **Ojo:** el comentario existente sobre el hueco del pill sigue siendo válido — mantener la diferencia de 56px entre ambos.
- `.sidebar`: `padding-top: env(safe-area-inset-top, 0px);` y en `.sidebar-footer` (~227): `padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));`
- `.topbar`: `padding-left/right: calc(24px + env(safe-area-inset-left/right, 0px))` — y el tier 480 de la Task 1 pasa su `padding: 0 12px` al mismo patrón con base 12px (ajustar allí si esta tarea aterriza después; coordinar en la review).

- [ ] **Step 4: Verificar verdes.**

- [ ] **Step 5: Commit** — `feat(css): safe areas — viewport-fit=cover + env() en fijos de borde (pill, toasts, sidebar, topbar)`

---

### Task 4: Bloque 1 — Drawer real: `_setDrawerOpen`, scrim, Escape, scroll-lock, inert, z-index (checks N20-drawer)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N20 + 1 check behavioral)
- Modify: `index.html` (nodo del scrim antes de `<aside id="sidebar">`)
- Modify: `css/styles.css` (`.sidebar-overlay` ~1354, `.topbar` z-index, `#sidebarToggle` oculto en móvil, `body.drawer-open`)
- Modify: `js/app.js` (`_setDrawerOpen`, `navigate` ~146, `init` ~1333-1348, keydown delegado)

- [ ] **Step 1: Checks (fallando)**

```js
    const appSrc20 = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N20 drawer: _setDrawerOpen existe y es el único que toca mobile-open',
      /_setDrawerOpen\(open\)/.test(appSrc20)
      && (appSrc20.match(/classList\.(add|remove|toggle)\('mobile-open'\)/g) || [])
          .length === (appSrc20.slice(appSrc20.indexOf('_setDrawerOpen(open)'),
                       appSrc20.indexOf('},', appSrc20.indexOf('_setDrawerOpen(open)')))
                       .match(/classList\.(add|remove|toggle)\('mobile-open'\)/g) || []).length);
    check('N20 drawer: el scrim existe en el HTML y deja de ser CSS muerto',
      /id="sidebarScrim"[^>]*class="sidebar-overlay"|class="sidebar-overlay"[^>]*id="sidebarScrim"/.test(htmlSrc20)
      && /sidebarScrim/.test(appSrc20));
    check('N20 drawer: scroll-lock del body y visibilidad del scrim por clase',
      /body\.drawer-open\s*\{[^}]*overflow:\s*hidden/.test(cssSrc)
      && /body\.drawer-open\s+\.sidebar-overlay|\.sidebar-overlay\.open/.test(cssSrc));
    check('N20 drawer: Escape cierra (rama en el keydown delegado)',
      /Escape[\s\S]{0,240}_setDrawerOpen\(false\)/.test(appSrc20));
    check('N20 drawer: inert al cerrar en móvil',
      /setAttribute\('inert'|removeAttribute\('inert'/.test(appSrc20) && /inert/.test(appSrc20));
    check('N20 drawer: #sidebarToggle oculto en el tier móvil',
      /@media \(max-width: 768px\)[\s\S]*?#sidebarToggle\s*\{\s*display:\s*none|\.sidebar-toggle\s*\{\s*display:\s*none/.test(cssSrc));
    check('N20 drawer: el topbar queda por encima del drawer (hamburguesa alcanzable)',
      (() => { const m = cssSrc.match(/\.topbar\s*\{[^}]*z-index:\s*(\d+)/); return m && Number(m[1]) > 100; })());
```

Check behavioral (bloque propio, tras el N20 estático):

```js
  /* ---- N20b: drawer behavioral — abrir/cerrar por _setDrawerOpen ---- */
  {
    const ctx = loadApp();
    ctx.App.state = ctx.App.loadState();
    ctx.App._setDrawerOpen(true);
    const sb = ctx.document.getElementById('sidebar');
    const body = ctx.document.body;
    check('N20b drawer: abrir pone mobile-open + drawer-open + aria-expanded',
      sb.classList.contains('mobile-open') && body.classList.contains('drawer-open')
      && ctx.document.getElementById('mobileMenuBtn')._attrs['aria-expanded'] === 'true');
    ctx.App._setDrawerOpen(false);
    check('N20b drawer: cerrar lo revierte y aplica inert',
      !sb.classList.contains('mobile-open') && !body.classList.contains('drawer-open')
      && sb._attrs && 'inert' in sb._attrs);
  }
```

(Adaptar el acceso a atributos al helper real del harness — mirar cómo N13/N16b leen `_attrs`; si el mock difiere, ajustar el check, no el código de producción.)

- [ ] **Step 2: Verificar rojos.**

- [ ] **Step 3: HTML — scrim**

En `index.html`, inmediatamente antes de `<aside id="sidebar">`:

```html
    <!-- Scrim del drawer móvil (2026-07-21): aprovecha la clase .sidebar-overlay
         que existía como CSS muerto. Decorativo: el cierre accesible es Escape. -->
    <div class="sidebar-overlay" id="sidebarScrim" aria-hidden="true"></div>
```

- [ ] **Step 4: CSS**

**4a.** `.sidebar-overlay` (~1354): añadir `display: none;` a la regla base y:

```css
body.drawer-open .sidebar-overlay { display: block; }
body.drawer-open { overflow: hidden; }
```

**4b.** `.topbar` (~264): `z-index: 50` → `z-index: 120;` con comentario:

```css
  /* 120 > sidebar (100): con el drawer abierto la hamburguesa sigue visible
     y clicable — siempre hay un control a la vista que cierra (2026-07-21). */
```

(El scrim queda en 99, bajo el drawer 100 — correcto. La barra de búsqueda móvil, z 60, queda bajo el drawer: correcto también, el drawer tapa la búsqueda.)

**4c.** En el bloque `@media (max-width: 768px)`: `#sidebarToggle { display: none; }` (el colapso a rail de 64px es affordance desktop; dentro del drawer solo confunde).

- [ ] **Step 5: JS — `_setDrawerOpen` y recableado**

En `js/app.js`, junto a `_setExamActive` (mismo estilo de comentario y de single-point-of-truth):

```js
  // Drawer móvil (2026-07-21): único punto de verdad, paralelo a _setExamActive.
  // Nadie más toca 'mobile-open'. inert al cerrar: el drawer trasladado fuera
  // de pantalla seguía teniendo 11 focusables tabulables.
  _setDrawerOpen(open) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobileMenuBtn');
    if (!sidebar) return;
    sidebar.classList[open ? 'add' : 'remove']('mobile-open');
    document.body.classList[open ? 'add' : 'remove']('drawer-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
    const isMobile = typeof matchMedia === 'function' && matchMedia('(max-width: 768px)').matches;
    if (open) {
      sidebar.removeAttribute('inert');
      const first = sidebar.querySelector && sidebar.querySelector('.nav-item');
      if (first && typeof first.focus === 'function') first.focus();
    } else {
      if (isMobile) sidebar.setAttribute('inert', '');
      if (menuBtn && typeof menuBtn.focus === 'function' && document.activeElement
          && sidebar.contains && sidebar.contains(document.activeElement)) menuBtn.focus();
    }
  },
```

Recableados (todos los toggles directos actuales pasan por él):

- `navigate` (~146-147): las dos líneas de "Close mobile sidebar" → `this._setDrawerOpen(false);`
- `init` `mobileMenuBtn` listener (~1336): → `this._setDrawerOpen(!document.getElementById('sidebar').classList.contains('mobile-open'));`
- `init` `.logo-icon` listener (~1340-1348): la rama else → `this._setDrawerOpen(true);`
- Listener nuevo del scrim (en `init`, junto al de mobileMenuBtn): `document.getElementById('sidebarScrim').addEventListener('click', () => this._setDrawerOpen(false));`
- Keydown delegado de `App.init()`: rama nueva — si `e.key === 'Escape'` y el sidebar tiene `mobile-open`, `this._setDrawerOpen(false)` (respetar las ramas Escape existentes: búsqueda y modal de avatar tienen prioridad si están abiertas — mirar el orden actual de las ramas y colocar la del drawer la última).
- Estado inicial: al final de `init()`, si es móvil (`matchMedia`), `sidebar.setAttribute('inert', '')` — y al cruzar a desktop no hace falta quitarlo por listener: `inert` en un sidebar visible de desktop sería un bug, así que sí hace falta — usar `matchMedia('(max-width: 768px)')` con `addEventListener('change', ...)` para quitar/poner `inert` al cruzar el breakpoint (guard `typeof matchMedia === 'function'` para el harness; este listener es de sistema, no de layout — permitido).

**Null-guards para el harness:** `sidebar.querySelector`, `sidebar.contains`, `first.focus`, `menuBtn.focus` — todos guardados como arriba.

- [ ] **Step 6: Verificar verdes + smoke** — harness + abrir en navegador: drawer abre con scrim, cierra por scrim/Escape/navegación, hamburguesa visible y clicable con el drawer abierto, body no scrollea de fondo.

- [ ] **Step 7: Commit** — `feat(ui): drawer móvil real — _setDrawerOpen, scrim, Escape, scroll-lock, inert y z-index del topbar`

---

### Task 5: Bloque 2a — Glosario apilado ≤480 (CSS + checks)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N20)
- Modify: `css/styles.css` (tier 480)

- [ ] **Step 1: Checks (fallando)**

```js
    check('N20 glosario: apilado en el tier 480 sin min-width fijos',
      /@media \(max-width: 480px\)[\s\S]*?\.glossary-item\s*\{[^}]*flex-direction:\s*column/.test(cssSrc)
      && /@media \(max-width: 480px\)[\s\S]*?\.glossary-term\s*\{[^}]*min-width:\s*0/.test(cssSrc)
      && /@media \(max-width: 480px\)[\s\S]*?\.glossary-chapter\s*\{[^}]*white-space:\s*normal/.test(cssSrc));
```

- [ ] **Step 2: Verificar rojo.**

- [ ] **Step 3: Implementar** — dentro del tier 480 de la Task 1:

```css
  /* Glosario: de fila de 3 columnas (min-widths fijos que desbordaban 320-414px)
     a apilado — término + chip de capítulo arriba, definición a ancho completo. */
  .glossary-item { flex-direction: column; gap: 6px; }
  .glossary-term { min-width: 0; }
  .glossary-chapter { min-width: 0; white-space: normal; align-self: flex-start; }
```

(El orden DOM ya es término → definición → chip; si el chip debe ir visualmente junto al término, usar `order` en CSS — decidirlo en implementación mirando el render real, sin tocar el template JS que N11 vigila.)

- [ ] **Step 4: Verificar verdes + smoke** (glosario a 320px sin scroll horizontal, definiciones a ancho completo).

- [ ] **Step 5: Commit** — `fix(css): glosario apilado en ≤480px — elimina los min-width que desbordaban todo ancho móvil`

---

### Task 6: Bloque 2b — Tablas de lección con scroll (`.table-scroll` en `renderLesson`) (JS/CSS + checks)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N20 + behavioral)
- Modify: `js/app.js` (`renderLesson`, tras asignar el innerHTML ~línea 428)
- Modify: `css/styles.css` (regla `.table-scroll` en la sección LESSON)

- [ ] **Step 1: Checks (fallando)**

```js
    check('N20 tablas: renderLesson envuelve las tablas en .table-scroll',
      /_wrapLessonTables/.test(appSrc20) && /table-scroll/.test(appSrc20));
    check('N20 tablas: la regla .table-scroll existe con overflow-x auto',
      /\.table-scroll\s*\{[^}]*overflow-x:\s*auto/.test(cssSrc));
```

Behavioral (dentro de un bloque que cargue App con el mock): renderizar una lección con tabla (p. ej. la 3.2) y comprobar que el HTML resultante de `#lessonContainer` contiene `class="table-scroll"` envolviendo `<table` — **si el mock no soporta `querySelectorAll` sobre el contenedor, el check se hace por string sobre el innerHTML** (mirar cómo N10 inspecciona el DOM de flashcards y seguir el mismo estilo).

- [ ] **Step 2: Verificar rojos.**

- [ ] **Step 3: Implementar**

**3a. JS** — en `renderLesson`, tras el `document.getElementById('lessonContainer').innerHTML = ...`, llamar a `this._wrapLessonTables()`:

```js
  // Tablas del contenido ISTQB (2026-07-21): js/content.js no se edita (regla
  // de fidelidad) — el wrapper de scroll se aplica por DOM al inyectar. Cubre
  // las 11 tablas que desbordaban en móvil y cualquier tabla futura.
  _wrapLessonTables() {
    const lc = document.querySelector('.lesson-content');
    if (!lc || typeof lc.querySelectorAll !== 'function') return; // harness mock
    lc.querySelectorAll('table').forEach((t) => {
      if (t.parentElement && t.parentElement.classList
          && t.parentElement.classList.contains('table-scroll')) return;
      const wrap = document.createElement('div');
      wrap.className = 'table-scroll';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
  },
```

**3b. CSS** — en la sección LESSON (junto a `table` ~780):

```css
/* Contenedor de scroll de tablas (aplicado por _wrapLessonTables en render).
   En desktop es inerte (nada desborda); en móvil da scroll local en vez de
   desbordar la página entera. */
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }
.table-scroll table { margin: 0; }
```

- [ ] **Step 4: Verificar verdes + smoke** (lección 3.2 a 320px: la tabla scrollea localmente, la página no).

- [ ] **Step 5: Commit** — `fix(ui): tablas de lección en contenedor de scroll — sin editar content.js (11 lecciones desbordaban)`

---

### Task 7: Bloque 3a — Flashcards: columna móvil, flechas sanas, altura que crece (CSS + checks)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N20)
- Modify: `css/styles.css` (`.flashcard-arena`/`.fc-arrow`/`.flashcard`/caras ~823-877; tier 480)

**Restricción dura:** el flip 3D, la animación de carrusel (N10, `setTimeout`-driven) y su rama reduced-motion (N15) deben seguir pasando. Cambios de mecanismo aquí exigen re-correr N10/N15 y smoke real.

- [ ] **Step 1: Checks (fallando)**

```js
    check('N20 flashcards: .fc-arrow no se aplasta (flex-shrink: 0, todos los anchos)',
      /\.fc-arrow\s*\{[^}]*flex-shrink:\s*0/.test(cssSrc));
    check('N20 flashcards: la tarjeta usa min-height, no height fija',
      /\.flashcard\s*\{[^}]*min-height:\s*280px/.test(cssSrc)
      && !/\.flashcard\s*\{[^}]*[^-]height:\s*280px/.test(cssSrc));
    check('N20 flashcards: caras apiladas por grid (crecen con el contenido)',
      /\.flashcard-front[\s\S]{0,200}grid-area:\s*1\s*\/\s*1/.test(cssSrc)
      || /\.flashcard-inner\s*\{[^}]*display:\s*grid/.test(cssSrc));
    check('N20 flashcards: arena en columna en el tier 480',
      /@media \(max-width: 480px\)[\s\S]*?\.flashcard-arena\s*\{[^}]*flex-direction:\s*column/.test(cssSrc));
```

- [ ] **Step 2: Verificar rojos.**

- [ ] **Step 3: Implementar**

**3a. Flechas (todos los anchos):** `.fc-arrow` (~832) añade `flex-shrink: 0;` — el aplastamiento (29×44 medido a 320px) es un bug, no un comportamiento de tier.

**3b. Altura que crece (todos los anchos) — mecanismo grid-stack:** las caras absolutas + `preserve-3d` impiden que el contenedor crezca. Sustituir el posicionamiento absoluto de las caras por apilado grid manteniendo el flip:

- `.flashcard` (~848): `height: 280px` → `min-height: 280px`; conserva `perspective`.
- El elemento interior que rota (según el DOM actual — verificar si es `.flashcard` mismo o un `.flashcard-inner`): `display: grid;` conservando `transform-style: preserve-3d` y la transición de rotación.
- `.flashcard-front`, `.flashcard-back` (~871): quitar `position: absolute; height: 100%;` → `grid-area: 1 / 1;` conservando `backface-visibility: hidden` y la rotación de la cara trasera. El contenedor ahora mide la cara más alta → las respuestas largas crecen en vez de desbordar.
- Verificar: flip por click/teclado, carrusel prev/next (N10), reduced-motion (N15), y el botón TTS posicionado dentro de la cara.

**3c. Tier 480 (columna):**

```css
  /* Flashcards: flechas laterales robaban ~140px de la tarjeta. En teléfono,
     tarjeta a ancho completo y controles debajo. */
  .flashcard-arena { flex-direction: column; gap: 12px; }
  .fc-arrow { width: 44px; height: 44px; }
```

(Las flechas y el contador quedan en fila debajo — si el DOM actual las tiene como hijos directos de la arena a ambos lados de la tarjeta, usar `order` para bajarlas: `#fcPrev { order: 2 } .flashcard { order: 1 } #fcNext { order: 3 }` más un contenedor visual si hace falta; decidir en implementación mirando el markup real de `index.html` ~367-382, **sin** mover nodos por JS.)

- [ ] **Step 4: Verificar verdes** — harness completo (N10/N15 especialmente) + smoke real: flip, carrusel, respuesta larga creciendo, reduced-motion.

- [ ] **Step 5: Commit** — `fix(ui): flashcards móvil — columna ≤480, flechas sin aplastar, altura que crece (grid-stack del flip)`

---

### Task 8: Bloque 3b — Tira horizontal de dots del examen (CSS/JS + checks)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N20)
- Modify: `css/styles.css` (tier 480)
- Modify: `js/app.js` (`renderExamDots` ~813 / `goToQuestion` ~839)

- [ ] **Step 1: Checks (fallando)**

```js
    check('N20 dots: tira horizontal en el tier 480 (nowrap + scroll)',
      /@media \(max-width: 480px\)[\s\S]*?\.exam-question-dots\s*\{[^}]*flex-wrap:\s*nowrap/.test(cssSrc)
      && /@media \(max-width: 480px\)[\s\S]*?\.exam-question-dots\s*\{[^}]*overflow-x:\s*auto/.test(cssSrc));
    check('N20 dots: auto-centrado del dot actual con guard de reduced-motion',
      /scrollIntoView/.test(appSrc20)
      && /prefers-reduced-motion[\s\S]{0,200}scrollIntoView|scrollIntoView[\s\S]{0,400}prefers-reduced-motion/.test(appSrc20)
      === false ? /_centerExamDot/.test(appSrc20) : /_centerExamDot/.test(appSrc20));
```

(Simplificar en implementación: el check real debe afirmar (a) `_centerExamDot` existe, (b) usa `scrollIntoView` con `behavior` condicionado a `matchMedia('(prefers-reduced-motion: reduce)')`, (c) `renderExamDots` o `goToQuestion` lo llaman. Escribirlo legible — el de arriba es la intención, no el literal.)

- [ ] **Step 2: Verificar rojos.**

- [ ] **Step 3: Implementar**

**3a. CSS (tier 480):**

```css
  /* Dots del examen: la parrilla envolvente media 408px de alto a 320px con
     los targets de 44px de I3. En teléfono: tira de una fila con scroll,
     el dot actual se auto-centra desde JS. Touch target intacto. */
  .exam-question-dots {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 6px; /* hueco para la scrollbar */
    -webkit-overflow-scrolling: touch;
  }
```

**3b. JS:**

```js
  // Tira de dots (2026-07-21): centra el dot actual en el scroll horizontal
  // del contenedor (solo hace algo cuando el tier 480 activa la tira; en la
  // parrilla desktop scrollIntoView con block:'nearest' es un no-op visual).
  _centerExamDot() {
    const dot = document.querySelector('.exam-dot.current');
    if (!dot || typeof dot.scrollIntoView !== 'function') return; // harness mock
    const reduced = typeof matchMedia === 'function'
      && matchMedia('(prefers-reduced-motion: reduce)').matches;
    dot.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  },
```

Llamarlo al final de `renderExamDots()` (o tras el focus-restore de `goToQuestion` — el implementador decide el punto único que cubra ambos flujos: avanzar con Siguiente también mueve el current). Verificar la clase real del dot actual en el template (~816) — si no es `.current`, usar la que sea.

**Nota roving tabindex:** los dots siguen siendo los mismos nodos con el mismo render — el roving + flechas de la ronda 2 (N18) no se toca; re-correr sus checks.

- [ ] **Step 4: Verificar verdes + smoke** (examen full a 320px: tira de ~52px de alto, dot actual centrado al navegar, sin animación bajo reduced-motion).

- [ ] **Step 5: Commit** — `feat(ui): dots del examen como tira horizontal en móvil con auto-centrado (guard reduced-motion)`

---

### Task 9: Bloque 4 — Onboarding móvil: drawer, clamp real, resize (JS + checks)

**Files:**
- Modify: `scripts/verify-runtime.js` (ampliar N20)
- Modify: `js/onboarding.js` (`start`/`_showStep`/`_positionCenter` ~185/`_positionOnTarget` ~192-223/`_finish`/`_skip`)

**Depende de:** Task 4 (`App._setDrawerOpen`).

- [ ] **Step 1: Checks (fallando)**

```js
    const obSrc = fs.readFileSync(path.join(ROOT, 'js', 'onboarding.js'), 'utf8');
    check('N20 onboarding: abre el drawer para los pasos del sidebar en móvil',
      /_setDrawerOpen\(true\)/.test(obSrc) && /_setDrawerOpen\(false\)/.test(obSrc));
    check('N20 onboarding: sin anchos/altos hardcodeados sin clamp (340px/220)',
      !/tw = 340(?!.*Math\.min)/.test(obSrc) && !/innerHeight - 220/.test(obSrc)
      && /Math\.min\(340/.test(obSrc) && /offsetHeight/.test(obSrc.slice(obSrc.indexOf('_positionOnTarget'))));
    check('N20 onboarding: listeners de resize añadidos y retirados simétricamente',
      (obSrc.match(/addEventListener\('resize'/g) || []).length === 1
      && (obSrc.match(/removeEventListener\('resize'/g) || []).length === 1
      && (obSrc.match(/addEventListener\('orientationchange'/g) || []).length === 1
      && (obSrc.match(/removeEventListener\('orientationchange'/g) || []).length === 1);
```

- [ ] **Step 2: Verificar rojos.**

- [ ] **Step 3: Implementar**

**3a. Drawer:** en `_showStep`, antes de posicionar: si el target del paso está dentro de `#sidebar` y `matchMedia('(max-width: 768px)').matches` → `App._setDrawerOpen(true)`; si el paso NO es de sidebar (o al `_finish`/`_skip`) → `App._setDrawerOpen(false)`. Guard `typeof App !== 'undefined' && App._setDrawerOpen`. El tour (z 10000+) queda por encima del scrim (99) y del drawer (100) — sin cambios de z necesarios; verificar visualmente que el spotlight (10001) resalta el nav-item del drawer abierto.

**3b. Clamp:** `tw = 340` → `const tw = Math.min(340, window.innerWidth - 32);` (ídem el `300` de `_positionOnTarget` → `Math.min(300, window.innerWidth - 32)`); el clamp vertical `window.innerHeight - 220` → medir tras asignar contenido: `const th = tooltip.offsetHeight || 220;` y clampar con `th` real. Invariante: el tooltip entero (y su botón Siguiente) dentro del viewport en ambos ejes, `left >= 16`, `top >= 16`.

**3c. Resize:** en `start()`: `this._onResize = () => this._showStep(this._current);` (o el índice que use el módulo) + `addEventListener('resize', this._onResize)` y `addEventListener('orientationchange', this._onResize)`; en `_finish()` y `_skip()` (o el punto común de salida si existe): los dos `removeEventListener`. Solo vivos durante el tour.

**3d. Red de seguridad:** si el target no existe o su rect queda fuera de viewport incluso tras abrir el drawer → degradar ese paso a tooltip centrado sin spotlight (ocultar `#onboarding-highlight`).

- [ ] **Step 4: Verificar verdes + smoke real** — tour completo a 375px: pasos del sidebar abren el drawer con el spotlight sobre el ítem real, tooltip siempre entero en pantalla, rotar el móvil (o redimensionar) recoloca, saltar/terminar cierra el drawer y retira listeners.

- [ ] **Step 5: Commit** — `fix(ui): onboarding funcional en móvil — abre el drawer, clamp real del tooltip y reposicionado en resize`

---

### Task 10: Gate con navegador real — `scripts/validate-responsive.js` (+ política no-op)

**Files:**
- Create: `scripts/validate-responsive.js`
- Modify: `scripts/verify-runtime.js` (check de que el script existe y declara el patrón no-op)

**Política aprobada:** patrón no-op — si Playwright no está disponible, el script lo dice y sale 0. **Fuera del pre-commit.** Paso manual obligatorio pre-release y tras cambios de layout (documentado en Task 11).

- [ ] **Step 1: Escribir el script**

Base: el arnés de la auditoría de 2026-07-21 (scratchpad de esa sesión). Estructura:

- Resolución de Playwright: `require('playwright')` dentro de try/catch; si falla, `console.log('SKIP: Playwright no disponible — gate responsive omitido (instalar: npm i -g playwright)')` y `process.exit(0)`.
- Servidor estático propio (`node:http` + `fs`, sirviendo el root del repo en un puerto libre) — sin depender de Python.
- Bypass de auth igual que el arnés: ocultar `#auth-screen`, mostrar `#app-container`, `localStorage.setItem('mycampus_onboarding_v1_undefined','1')`, `App.init()` vía `page.evaluate` (los módulos son `const` de script clásico: se accede como bare `App`, no `window.App`).
- Viewports: 320/375/414 × 720, `hasTouch: true, isMobile: true`.
- Asserts (cada uno imprime ✅/❌ y acumula fallos; exit 1 si hay alguno):
  1. `documentElement.scrollWidth <= clientWidth` en las 7 vistas (`dashboard`, `curriculum`, `flashcards`, `simulator`, `glossary`, `progress`, `achievements`) + lección con tabla (3.2) + examen full activo.
  2. `.fc-arrow` ≥ 44×44 y `.exam-dot` ≥ 44×44 (con `hasTouch` el bloque coarse aplica).
  3. `.exam-question-dots` ≤ 64px de alto a ≤480px.
  4. Drawer: `#sidebarScrim` visible con el drawer abierto; click en el scrim lo cierra; `#sidebar` tiene `inert` cerrado en móvil; `#mobileMenuBtn` clicable (elementFromPoint sobre su centro) con el drawer abierto.
  5. Glosario: `views-container.scrollWidth <= clientWidth`.
  6. Onboarding: borrar la clave de localStorage, relanzar el tour, y en cada paso afirmar que `#onboarding-tooltip` está íntegramente dentro del viewport (rect ≥ 0 y ≤ innerWidth/innerHeight) y avanzar con click en Siguiente.
- Al terminar: cerrar navegador y servidor.

- [ ] **Step 2: Check estático en verify-runtime.js**

```js
    check('N20 gate: validate-responsive.js existe y degrada no-op sin Playwright',
      fs.existsSync(path.join(ROOT, 'scripts', 'validate-responsive.js'))
      && /SKIP: Playwright no disponible/.test(fs.readFileSync(path.join(ROOT, 'scripts', 'validate-responsive.js'), 'utf8')));
```

- [ ] **Step 3: Correrlo de verdad** — `node scripts/validate-responsive.js` → todo ✅ (las Tasks 1-9 ya mergeadas). Si algo falla aquí, es un bug real de las tareas anteriores: arreglarlo antes de seguir.

- [ ] **Step 4: Commit** — `feat(scripts): gate responsive con navegador real (Playwright, no-op si falta) — validate-responsive.js`

---

### Task 11: Cierre — review final de rama, verificación manual y sincronización de docs

**Files:**
- Modify: `CLAUDE.md` (sección nueva "Adaptabilidad móvil (2026-07-21)" — resumen + constraints nuevas para agentes: tier 480, prohibición overflow-x, `_setDrawerOpen`, `.table-scroll`, política de validate-responsive)
- Modify: `AGENTS.md` (entrada completa con mecanismos y evidencia, como las rondas anteriores)
- Memoria del proyecto (`memory/`): actualizar `project_uiux_remediation.md` o crear entrada nueva del estado móvil

- [ ] **Step 1: Review final de rama completa** (subagente revisor, whole-branch diff contra el punto de partida) — como en todas las rondas; arreglar lo que encuentre antes de cerrar.
- [ ] **Step 2: Verificación manual en navegador real** — checklist de la spec: móvil 375 y 320 (drawer end-to-end, glosario, lección 3.2, examen completo con tira, flashcard con respuesta larga, tour completo), una pasada en landscape, ambos temas, reduced-motion activado para tira y tour.
- [ ] **Step 3: Los 5 gates en verde** — `validate-questions`, `validate-content`, `verify-runtime`, `validate-contrast`, `validate-responsive`.
- [ ] **Step 4: Docs + memoria + push** — CLAUDE.md/AGENTS.md sincronizados en el mismo commit final; commit y push de todo (direct-to-master, patrón del repo).
- [ ] **Step 5: Commit** — `docs: registra la ronda de adaptabilidad móvil (tier 480, drawer, gate responsive)`
