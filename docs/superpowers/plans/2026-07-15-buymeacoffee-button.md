# Botón flotante Buy Me a Coffee — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un pill flotante abajo-derecha que enlaza a la página de donaciones del creador en Buy Me a Coffee, visible en toda la app y oculto durante el examen.

**Architecture:** Enfoque A (enlace propio auto-alojado, sin script de terceros). Un `<a>` `position: fixed` en el shell de `index.html`, estilizado con tokens de marca, con icono SVG del sprite inline y texto i18n. La ocultación en examen se hace vía una clase `exam-active` en `<body>`, toggled por un helper `App._setExamActive()` que centraliza las asignaciones a `_examActive`.

**Tech Stack:** Vanilla JS SPA, sin build. CSS con tokens de tema. i18n propio (`TRANSLATIONS`). Gate estático `scripts/verify-runtime.js` (checks `N19` nuevos) + hook pre-commit.

## Global Constraints

Copiadas verbatim del spec y de CLAUDE.md/AGENTS.md — aplican a **todas** las tareas:

- **Sin scripts/CDN de terceros nuevos.** Enlace saliente puro (`<a>`), nada de `widget.prod.min.js`.
- **Icono = sprite SVG inline, nunca emoji como icono de UI** (gate `N17`). Uso: `<svg class="icon" aria-hidden="true"><use href="#i-nombre"/></svg>`.
- **i18n obligatorio, ES/EN pareado.** `TRANSLATIONS` pasa de 174 → **175 claves**; la paridad la verifica `verify-runtime.js`.
- **Color de marca, pero AA obligatorio.** Blanco sobre `--primary` (`#6C63FF`) es solo **4.32:1 (falla AA 4.5:1)**. Se usa `--primary-dark` (`#5a52d5`, mismo valor en ambos temas) como fondo → blanco sobre él es **5.83:1 (pasa AA)**. El texto/icono van en `color: #fff` explícito (los SVG usan `currentColor`).
- **Orden del CSS load-bearing:** el bloque `@media (prefers-reduced-motion)` y luego `:focus-visible` son **literalmente las últimas reglas** de `css/styles.css`. Todo CSS nuevo se inserta **antes** de esos dos bloques.
- **Ningún commit puede dejar `verify-runtime.js` en rojo** — el hook pre-commit lo corre al hacer stage de `js/` o `index.html`. Cada tarea comitea ya en verde.
- **`privacy.html` fiel al código:** cualquier servicio/enlace externo se refleja en el mismo commit.
- **Destino del enlace:** `https://buymeacoffee.com/jorgeborn3m`, `target="_blank"`, `rel="noopener noreferrer"`.
- **Sin listeners por-elemento** en elementos de plantilla; el pill es estático en el shell, así que no aplica, pero no añadir handlers de teclado ad-hoc.

## File Structure

| Archivo | Responsabilidad del cambio |
|---------|----------------------------|
| `js/i18n.js` | Clave `bmc_label` (ES/EN) |
| `index.html` | Símbolo `#i-coffee` en el sprite + markup `.bmc-fab` |
| `css/styles.css` | Estilos `.bmc-fab`, offset de `.toast-container`, regla de ocultación en examen |
| `js/app.js` | Helper `_setExamActive()` + reemplazo de las 4 asignaciones a `_examActive` |
| `privacy.html` | Mención bilingüe del enlace externo a BMC |
| `scripts/verify-runtime.js` | Bloque de checks `N19` (una parte por tarea) |

Cada tarea añade su(s) propio(s) check(s) al bloque `N19`, en orden TDD (rojo → verde) dentro de la misma tarea.

---

### Task 1: Clave i18n `bmc_label` + scaffold del bloque N19

**Files:**
- Modify: `js/i18n.js` (objetos `es` y `en` de `TRANSLATIONS`)
- Modify: `scripts/verify-runtime.js` (nuevo bloque `N19`, insertado tras el bloque `N18` que termina en la línea ~912, antes del bloque `/* ---- N5 + P5 ... */`)

**Interfaces:**
- Produces: clave i18n `bmc_label` (usada por el markup de la Task 2 vía `data-i18n="bmc_label"`).

- [ ] **Step 1: Escribir el check que falla**

En `scripts/verify-runtime.js`, insertar un bloque nuevo justo después del cierre `}` del bloque `N18` (línea ~912) y antes de `/* ---- N5 + P5: chequeos estáticos de i18n ---- */`:

```js
  /* ---- N19: botón flotante Buy Me a Coffee (2026-07-15) ---- */
  {
    const ctx = loadApp();
    check('N19 i18n: bmc_label definido en ES y EN',
      typeof ctx.TRANSLATIONS.es.bmc_label === 'string' && ctx.TRANSLATIONS.es.bmc_label.length > 0
      && typeof ctx.TRANSLATIONS.en.bmc_label === 'string' && ctx.TRANSLATIONS.en.bmc_label.length > 0);
  }
```

- [ ] **Step 2: Correr el harness y ver que falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en `N19 i18n: bmc_label definido en ES y EN` (y también fallará la paridad ES/EN si solo existiera en uno — aquí no existe en ninguno todavía).

- [ ] **Step 3: Implementar la clave en ambos idiomas**

En `js/i18n.js`, en el objeto `es` (añadir justo después de `streak_label: "días seguidos",`, línea ~17):

```js
    bmc_label: "Invítame un café",
```

En el objeto `en`, después de la línea equivalente `streak_label: "..."`:

```js
    bmc_label: "Buy me a coffee",
```

- [ ] **Step 4: Correr el harness y ver que pasa**

Run: `node scripts/verify-runtime.js`
Expected: PASS en `N19 i18n: bmc_label ...` y en `i18n: paridad ES/EN (175/175)`.

- [ ] **Step 5: Commit**

```bash
git add js/i18n.js scripts/verify-runtime.js
git commit -m "feat(i18n): clave bmc_label (ES/EN) + scaffold N19"
```

---

### Task 2: Símbolo `#i-coffee` + markup del pill flotante

**Files:**
- Modify: `index.html` (sprite SVG, tras el último `<symbol>` en la línea ~66; y el shell, tras `</main>` en la línea ~503)
- Modify: `scripts/verify-runtime.js` (añadir checks al bloque `N19`)

**Interfaces:**
- Consumes: clave i18n `bmc_label` (Task 1); símbolo `#i-coffee` (creado aquí).
- Produces: elemento `<a class="bmc-fab">` (estilizado en Task 3, ocultado por `body.exam-active` en Tasks 3+4).

- [ ] **Step 1: Escribir los checks que fallan**

En `scripts/verify-runtime.js`, dentro del bloque `N19` (tras el check de Task 1, antes del `}` de cierre), añadir:

```js
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N19 icono: símbolo #i-coffee presente en el sprite',
      htmlSrc.includes('id="i-coffee"'));
    check('N19 markup: .bmc-fab enlaza a buymeacoffee con rel/target seguros',
      /<a class="bmc-fab"[^>]*href="https:\/\/buymeacoffee\.com\/jorgeborn3m"/.test(htmlSrc)
      && /class="bmc-fab"[^>]*target="_blank"/.test(htmlSrc)
      && /class="bmc-fab"[^>]*rel="noopener noreferrer"/.test(htmlSrc));
    check('N19 markup: .bmc-fab usa el sprite #i-coffee y la clave i18n (sin emoji)',
      /<a class="bmc-fab"[\s\S]*?<use href="#i-coffee"\/>[\s\S]*?<\/a>/.test(htmlSrc)
      && /<a class="bmc-fab"[^>]*data-i18n="bmc_label"/.test(htmlSrc)
      && !/<a class="bmc-fab"[^>]*>[\s\S]*?☕/.test(htmlSrc));
```

- [ ] **Step 2: Correr el harness y ver que falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en los tres checks nuevos (`N19 icono`, `N19 markup: ...`).

- [ ] **Step 3: Añadir el símbolo al sprite**

En `index.html`, tras el último `<symbol>` del sprite (el `id="i-moon"`, línea ~66) y antes de `</svg>`, añadir el icono de taza estilo Lucide:

```html
    <symbol id="i-coffee" viewBox="0 0 24 24"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></symbol>
```

- [ ] **Step 4: Añadir el markup del pill**

En `index.html`, justo después de `</main>` (línea ~503) y antes de `<div class="toast-container" ...>` (línea ~506), añadir:

```html
  <!-- Botón de apoyo (Buy Me a Coffee). Enlace saliente, sin script de terceros.
       position: fixed global; se oculta en examen vía body.exam-active. -->
  <a class="bmc-fab" href="https://buymeacoffee.com/jorgeborn3m" target="_blank" rel="noopener noreferrer" data-i18n="bmc_label">
    <svg class="icon" aria-hidden="true"><use href="#i-coffee"/></svg>
    <span>Invítame un café</span>
  </a>
```

- [ ] **Step 5: Correr el harness y ver que pasa**

Run: `node scripts/verify-runtime.js`
Expected: PASS en `N19 icono`, `N19 markup: .bmc-fab enlaza ...`, `N19 markup: .bmc-fab usa el sprite ...`. El check `N17` de emojis sigue verde (no se añadió ninguno).

- [ ] **Step 6: Commit**

```bash
git add index.html scripts/verify-runtime.js
git commit -m "feat(ui): pill flotante Buy Me a Coffee + símbolo #i-coffee"
```

---

### Task 3: Estilos del pill + offset de toasts + ocultación en examen (CSS)

**Files:**
- Modify: `css/styles.css` (regla `.toast-container` en la línea ~1303; y nuevas reglas insertadas **antes** del bloque `@media (prefers-reduced-motion)` del final)
- Modify: `scripts/verify-runtime.js` (checks al bloque `N19`)

**Interfaces:**
- Consumes: `.bmc-fab` (Task 2); tokens `--primary-dark`, `--shadow`/`--radius` existentes.
- Produces: la regla `body.exam-active .bmc-fab { display: none }` (activada por Task 4).

- [ ] **Step 1: Escribir los checks que fallan**

En `scripts/verify-runtime.js`, dentro del bloque `N19`, añadir:

```js
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    check('N19 css: .bmc-fab es fixed y usa --primary-dark (AA: blanco sobre él = 5.83:1)',
      /\.bmc-fab\s*\{[^}]*position:\s*fixed/.test(cssSrc)
      && /\.bmc-fab\s*\{[^}]*background:\s*var\(--primary-dark\)/.test(cssSrc)
      && /\.bmc-fab\s*\{[^}]*color:\s*#fff/.test(cssSrc));
    check('N19 css: los toasts se apilan por encima del pill (no en bottom:24px a secas)',
      /\.toast-container\s*\{[^}]*bottom:\s*80px/.test(cssSrc));
    check('N19 css: el pill se oculta durante el examen',
      /body\.exam-active\s+\.bmc-fab\s*\{[^}]*display:\s*none/.test(cssSrc));
    check('N19 css: las reglas del pill van antes del bloque reduced-motion',
      cssSrc.indexOf('.bmc-fab') < cssSrc.indexOf('@media (prefers-reduced-motion'));
```

- [ ] **Step 2: Correr el harness y ver que falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en los cuatro checks `N19 css: ...`.

- [ ] **Step 3: Subir el offset de `.toast-container`**

En `css/styles.css`, línea ~1303, cambiar:

```css
.toast-container { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 1000; }
```

por (subir `bottom` para que los toasts se apilen encima del pill, que ocupa ~44px + margen):

```css
/* bottom: 80px (no 24px) deja hueco al pill .bmc-fab, que vive en bottom:24px
   con ~44px de alto. Los toasts (transitorios, aria-live) ganan el rincón. */
.toast-container { position: fixed; bottom: 80px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 1000; }
```

- [ ] **Step 4: Añadir las reglas del pill**

En `css/styles.css`, **antes** del comentario `/* ===== MOVIMIENTO REDUCIDO (I2 ...) ===== */` del final del archivo, añadir:

```css
/* ===== BOTÓN DE APOYO (Buy Me a Coffee, 2026-07-15) =====
   Pill flotante abajo-derecha. Fondo --primary-dark (no --primary): blanco
   sobre #6C63FF es 4.32:1 (falla AA), sobre #5a52d5 es 5.83:1 (pasa). color:#fff
   explícito porque el SVG del icono usa currentColor. z-index bajo los toasts
   (1000). Se oculta en examen vía body.exam-active. Hover solo mueve/sombrea
   (no aclara el fondo, que bajaría el contraste); reduced-motion lo colapsa. */
.bmc-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  background: var(--primary-dark);
  color: #fff;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.bmc-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.bmc-fab .icon { width: 1.15em; height: 1.15em; }
body.exam-active .bmc-fab { display: none; }
```

- [ ] **Step 5: Correr el harness y ver que pasa**

Run: `node scripts/verify-runtime.js`
Expected: PASS en los cuatro checks `N19 css: ...`.

- [ ] **Step 6: Commit**

```bash
git add css/styles.css scripts/verify-runtime.js
git commit -m "feat(ui): estilos del pill Buy Me a Coffee + offset de toasts + ocultación en examen"
```

---

### Task 4: Helper `_setExamActive()` + toggle de la clase `exam-active` (JS)

**Files:**
- Modify: `js/app.js` (nuevo helper + reemplazo de las 4 asignaciones en las líneas ~126, ~604, ~736, ~864)
- Modify: `scripts/verify-runtime.js` (checks al bloque `N19`)

**Interfaces:**
- Consumes: la regla CSS `body.exam-active .bmc-fab` (Task 3); la propiedad `_examActive` (existente, línea ~20, se mantiene como default `false`).
- Produces: método `App._setExamActive(active: boolean)` que setea `this._examActive` y togglea `document.body.classList` `'exam-active'`.

- [ ] **Step 1: Escribir los checks que fallan**

En `scripts/verify-runtime.js`, dentro del bloque `N19`, añadir:

```js
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N19 examen: _setExamActive setea el flag y togglea la clase del body',
      /_setExamActive\(active\)\s*\{[\s\S]{0,160}this\._examActive = active[\s\S]{0,160}document\.body\.classList\.toggle\('exam-active', active\)/.test(appSrc));
    check('N19 examen: launchExam/finishExam/navigate/renderSimulatorMenu usan el helper',
      (appSrc.match(/this\._setExamActive\((true|false)\)/g) || []).length >= 4
      && !/this\._examActive = true/.test(appSrc));
```

- [ ] **Step 2: Correr el harness y ver que falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en los dos checks `N19 examen: ...`.

- [ ] **Step 3: Añadir el helper**

En `js/app.js`, añadir el método justo antes de `_icon(name)` (línea ~1068) — o en cualquier punto del objeto `App`; se sugiere junto a la navegación. Insertar:

```js
  // Único punto de verdad para el estado de examen: setea el flag y refleja
  // en <body> la clase exam-active (CSS oculta el pill de apoyo durante el
  // examen). Sustituye las asignaciones directas a _examActive.
  _setExamActive(active) {
    this._examActive = active;
    document.body.classList.toggle('exam-active', active);
  },
```

- [ ] **Step 4: Reemplazar las 4 asignaciones directas**

En `js/app.js`, reemplazar cada una de estas líneas (NO tocar la línea ~20 `_examActive: false,` de la definición del objeto):

- Línea ~126 (en `navigate`): `this._examActive = false;` → `this._setExamActive(false);`
- Línea ~604 (en `renderSimulatorMenu`): `this._examActive = false;` → `this._setExamActive(false);`
- Línea ~736 (en `launchExam`): `this._examActive = true;` → `this._setExamActive(true);`
- Línea ~864 (en `finishExam`): `this._examActive = false;` → `this._setExamActive(false);`

- [ ] **Step 5: Correr el harness y ver que pasa**

Run: `node scripts/verify-runtime.js`
Expected: PASS en los dos checks `N19 examen: ...`. Ningún otro check (p.ej. el guard de examen `N?` que lee `_examActive`) se rompe: el valor de la propiedad no cambia, solo su vía de asignación.

- [ ] **Step 6: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(ui): _setExamActive togglea body.exam-active para ocultar el pill en examen"
```

---

### Task 5: Mención en la política de privacidad

**Files:**
- Modify: `privacy.html` (sección 4 en ES, línea ~114-126; su equivalente en EN, línea ~204-216)
- Modify: `scripts/verify-runtime.js` (check al bloque `N19`)

**Interfaces:**
- Consumes: nada nuevo.
- Produces: nada consumido aguas abajo (cierre de documentación).

- [ ] **Step 1: Escribir el check que falla**

En `scripts/verify-runtime.js`, dentro del bloque `N19`, añadir:

```js
    const privacySrc = fs.readFileSync(path.join(ROOT, 'privacy.html'), 'utf8');
    check('N19 privacidad: privacy.html menciona Buy Me a Coffee (ES y EN)',
      (privacySrc.match(/Buy Me a Coffee/g) || []).length >= 2);
```

- [ ] **Step 2: Correr el harness y ver que falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en `N19 privacidad: ...`.

- [ ] **Step 3: Añadir la mención (ES)**

En `privacy.html`, dentro del `<ul>` de la sección 4 en español, tras el `<li>` de `jsDelivr` (línea ~125, antes de `</ul>`), añadir:

```html
        <li><strong>Buy Me a Coffee</strong>: la aplicación muestra un enlace de
        apoyo voluntario a esta plataforma externa de donaciones. Solo si haces clic
        y sales de la aplicación, Buy Me a Coffee recibe tus datos según su propia
        política de privacidad; mientras no lo pulses, no se le envía nada.</li>
```

- [ ] **Step 4: Añadir la mención (EN)**

En `privacy.html`, dentro del `<ul>` de la sección 4 en inglés (línea ~204-216), tras el `<li>` de `jsDelivr`, añadir:

```html
        <li><strong>Buy Me a Coffee</strong>: the app shows a voluntary support
        link to this external donations platform. Only if you click through and
        leave the app does Buy Me a Coffee receive your data, under its own privacy
        policy; as long as you don't click it, nothing is sent to them.</li>
```

- [ ] **Step 5: Correr el harness y ver que pasa**

Run: `node scripts/verify-runtime.js`
Expected: PASS en `N19 privacidad: ...`.

- [ ] **Step 6: Commit**

```bash
git add privacy.html scripts/verify-runtime.js
git commit -m "docs(privacy): declara el enlace externo a Buy Me a Coffee (ES/EN)"
```

---

### Task 6: Verificación en navegador real + validadores + revisión de rama

**Files:**
- Ninguno de código (verificación). Posibles fixes puntuales si algo falla.

- [ ] **Step 1: Correr los cuatro validadores**

```bash
node scripts/validate-questions.js
node scripts/validate-content.js
node scripts/verify-runtime.js
node scripts/validate-contrast.js
```
Expected: los cuatro en verde. (`validate-contrast.js` no cubre el par blanco-sobre-`--primary-dark` porque no es un token `--*-text`; el AA de ese par queda documentado —5.83:1— y bloqueado por el check `N19 css`.)

- [ ] **Step 2: Verificación en navegador real (Playwright/Chromium)**

Servir con `python -m http.server 8000` y verificar en `http://localhost:8000`:
- El pill se ve abajo-derecha en dashboard, curriculum, glosario, progreso, logros.
- Al iniciar un examen (`launchExam`) el pill desaparece; al salir/terminar reaparece.
- Cuando aparece un toast, el toast se apila **encima** del pill sin taparlo.
- En viewport ≤768px el pill no tapa contenido crítico ni el `#xpPopup`.
- Click en el pill abre `https://buymeacoffee.com/jorgeborn3m` en pestaña nueva.
- Contraste del texto legible en tema claro y oscuro.
- El label cambia ES↔EN con el switcher de idioma.

- [ ] **Step 3: Revisión de rama completa**

Invocar `superpowers:requesting-code-review` sobre el diff completo de la feature. Resolver cualquier hallazgo Critical/Important antes de dar por cerrada la feature.

- [ ] **Step 4: Push**

```bash
git push origin master
```

---

## Self-Review (autor del plan)

**Cobertura del spec:**
- Markup + `#i-coffee` → Task 2. ✅
- Estilos `.bmc-fab` + offset toasts + ocultación examen → Task 3. ✅
- `_setExamActive` + reemplazo asignaciones → Task 4. ✅
- i18n `bmc_label` (174→175) → Task 1. ✅
- `privacy.html` bilingüe → Task 5. ✅
- Checks `N19` → repartidos por tarea. ✅
- Contraste AA → resuelto vía `--primary-dark` (5.83:1), documentado y bloqueado por `N19 css`; `validate-contrast.js` no aplica (no es par de token `--*-text`) → decisión explícita en Task 6 Step 1. ✅
- Verificación en navegador → Task 6. ✅

**Escaneo de placeholders:** sin TBD/TODO. Todos los pasos con código real y comandos con salida esperada.

**Consistencia de tipos/nombres:** `bmc_label`, `.bmc-fab`, `#i-coffee`, `_setExamActive(active)`, clase `exam-active` — usados idénticos en todas las tareas y checks.

**Decisión de alcance:** una sola feature, un solo plan.
