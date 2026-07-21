# Botón "Siguiente lección" + FAB del café en móvil — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el alumno pueda completar una lección y saltar a la siguiente en un clic, y que
el pill "Invítame un café" deje de solapar los botones de la lección en móvil.

**Architecture:** Dos cambios independientes sobre la vista de lección. (1) `renderLesson()`
emite una barra inferior de dos botones —completar (secundario) y avanzar (primario)— y un
nuevo método `App.completeAndAdvance()` encadena completar + navegar, delegando en los
métodos ya existentes `completeLesson()` y `navigateToLesson()`. (2) En ≤768px el FAB se
reduce por CSS a un círculo solo-icono y `.lesson-actions` gana un colchón inferior.

**Tech Stack:** JavaScript vanilla (sin framework, sin build). CSS plano con custom
properties. Verificación con el arnés Node `scripts/verify-runtime.js` (checks estáticos y de
comportamiento sobre un DOM mockeado) y `scripts/validate-responsive.js` (Playwright, manual).

**Spec:** `docs/superpowers/specs/2026-07-21-lesson-next-button-and-mobile-fab-design.md`

## Global Constraints

- **No hay build ni package manager.** No añadir dependencias, no crear `package.json`.
  Todo se sirve como ficheros estáticos.
- **No se edita `js/content.js`.** Regla de fidelidad de contenido ISTQB. El "siguiente
  tema" se deriva en `renderLesson()` del array `ch.topics` que ya existe.
- **Contraste AA obligatorio para texto.** Blanco sobre `--primary` (`#6C63FF`) es **4.32:1
  y FALLA AA**; sobre `--primary-dark` (`#5a52d5`) es **5.83:1 y pasa**. El botón primario
  nuevo usa `--primary-dark`, igual que `.bmc-fab`. **No usar la clase `.btn-primary`**, que
  arrastra el fallo preexistente.
- **Orden del tail de `css/styles.css` intocable:** tier 480 → `(pointer: coarse)` →
  reduced-motion → `:focus-visible` **literalmente último**. Ninguna regla de este plan se
  añade después del bloque reduced-motion.
- **Los 8 checks `N19` no se modifican** y deben seguir en verde. Dos consecuencias que ya
  están resueltas en el diseño y no deben "arreglarse" de otra forma:
  - El span del FAB **no lleva clase** (el check exige literalmente
    `<span data-i18n="bmc_label">`); se usa el selector `.bmc-fab span`.
  - El `<a>` **sí puede** llevar `data-i18n-aria` (el check prohíbe `data-i18n=` con el `=`
    inmediato, que `data-i18n-aria="` no satisface).
- **`TRANSLATIONS` se mantiene ES/EN emparejado.** Pasa de 175 a 177 claves; el conteo está
  escrito en `CLAUDE.md` y `AGENTS.md` y hay que actualizarlo.
- **Iconos:** no reintroducir emojis como iconos de UI (gate `N17`). Las flechas de texto
  `←`/`→` sí están aceptadas (`←` ya se usa en "Volver al curriculum").
- **Comando de verificación tras cada tarea:** `node scripts/verify-runtime.js`.

## File Structure

| Fichero | Cambio | Responsabilidad |
|---|---|---|
| `js/i18n.js` | Modify | 2 claves nuevas × 2 idiomas |
| `js/app.js` | Modify | Template de `.lesson-actions` en `renderLesson()` + método `completeAndAdvance()` |
| `css/styles.css` | Modify | `.lesson-next-btn`; ocultar el título en tier 480; FAB círculo + colchón en tier 768 |
| `index.html` | Modify | `data-i18n-aria` en el `<a class="bmc-fab">` |
| `scripts/verify-runtime.js` | Modify | Nueva familia de checks `N21` |
| `CLAUDE.md`, `AGENTS.md` | Modify | Sincronización de documentación |

No se crean ficheros nuevos.

---

### Task 1: Claves i18n

**Files:**
- Modify: `js/i18n.js:110-111` (ES) y `js/i18n.js:311-312` (EN)
- Test: `scripts/verify-runtime.js` (bloque `N21` nuevo, al final, antes del bloque
  `/* ---- N5 + P5: chequeos estáticos de i18n ---- */` de la línea ~1237)

**Interfaces:**
- Produces: claves `lesson_next` y `lesson_finish_chapter`, consumidas por la Task 2 vía
  `i18n.t('lesson_next')` / `i18n.t('lesson_finish_chapter')`.

- [ ] **Step 1: Escribir el check que falla**

Insertar en `scripts/verify-runtime.js` **justo antes** de la línea que abre el bloque
`/* ---- N5 + P5: chequeos estáticos de i18n ---- */`:

```js
  /* ---- N21: botón "siguiente lección" + FAB del café en móvil (2026-07-21) ---- */
  {
    const ctx = loadApp();
    check('N21 i18n: lesson_next y lesson_finish_chapter definidas en ES y EN',
      ['lesson_next', 'lesson_finish_chapter'].every(k =>
        typeof ctx.TRANSLATIONS.es[k] === 'string' && ctx.TRANSLATIONS.es[k].length > 0
        && typeof ctx.TRANSLATIONS.en[k] === 'string' && ctx.TRANSLATIONS.en[k].length > 0));
  }
```

- [ ] **Step 2: Ejecutar el arnés para verlo fallar**

Run: `node scripts/verify-runtime.js`
Expected: FAIL — línea `❌ N21 i18n: lesson_next y lesson_finish_chapter definidas en ES y EN`
y salida final `❌ 1 chequeo(s) fallando.` (exit code 1).

- [ ] **Step 3: Añadir las claves ES**

En `js/i18n.js`, tras la línea 111 (`lesson_completed: "✓ Completada",`):

```js
    lesson_next: "Siguiente lección",
    lesson_finish_chapter: "Completar capítulo",
```

- [ ] **Step 4: Añadir las claves EN**

En `js/i18n.js`, tras la línea 312 (`lesson_completed: "✓ Completed",`):

```js
    lesson_next: "Next lesson",
    lesson_finish_chapter: "Finish chapter",
```

- [ ] **Step 5: Ejecutar el arnés para verlo pasar**

Run: `node scripts/verify-runtime.js`
Expected: PASS en el check `N21 i18n`, y el check existente
`i18n: paridad ES/EN (177/177)` reflejando el nuevo conteo. Salida final
`✅ Todos los chequeos de runtime pasan.`

- [ ] **Step 6: Commit**

```bash
git add js/i18n.js scripts/verify-runtime.js
git commit -m "feat(i18n): claves lesson_next y lesson_finish_chapter (175 -> 177)"
```

---

### Task 2: Barra de acciones y `completeAndAdvance`

**Files:**
- Modify: `js/app.js:426-441` (template de `renderLesson`) y `js/app.js:459-472`
  (añadir el método nuevo tras `completeLesson`)
- Test: `scripts/verify-runtime.js` (ampliar el bloque `N21` de la Task 1)

**Interfaces:**
- Consumes: `i18n.t('lesson_next')`, `i18n.t('lesson_finish_chapter')` (Task 1);
  `escapeHtml(value)` (declaración global en `js/app.js:1647`, hoisted, accesible desde
  `renderLesson`); `this.completeLesson(topicId, chapterId, xp)`;
  `this.navigateToLesson(chapterId, topicId)`; `this.navigate('curriculum')`.
- Produces: `App.completeAndAdvance(topicId: string, chapterId: number, xp: number,
  nextTopicId: string|null): void` — invocado desde el `onclick` del botón primario.
  La clase CSS `.lesson-next-btn` y el `<span class="next-topic-title">` que la Task 3
  estiliza.

- [ ] **Step 1: Escribir los checks que fallan**

Añadir dentro del bloque `N21` de `scripts/verify-runtime.js`, tras el check de i18n:

```js
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');

    // Acotado al template de renderLesson, NO a app.js entero: completeAndAdvance
    // llama legítimamente a navigate('curriculum') al cerrar capítulo, y un check
    // global lo confundiría con el botón duplicado que se eliminó.
    const actionsBlock = (appSrc.match(/<div class="lesson-actions">[\s\S]*?<\/div>`/) || [''])[0];
    check('N21 lección: la barra inferior ya no duplica el "Volver al curriculum"',
      actionsBlock.length > 0 && !/App\.navigate\('curriculum'\)/.test(actionsBlock));
    check('N21 lección: la barra inferior cablea el primario a App.completeAndAdvance',
      /App\.completeAndAdvance\(/.test(actionsBlock));
    check('N21 lección: completeAndAdvance delega en completeLesson y bifurca a navigateToLesson/curriculum',
      /completeAndAdvance\(topicId, chapterId, xp, nextTopicId\)\s*\{[\s\S]{0,400}this\.completeLesson\(/.test(appSrc)
      && /completeAndAdvance[\s\S]{0,400}this\.navigateToLesson\(chapterId, nextTopicId\)/.test(appSrc)
      && /completeAndAdvance[\s\S]{0,400}this\.navigate\('curriculum'\)/.test(appSrc));
```

- [ ] **Step 2: Ejecutar el arnés para verlos fallar**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en los tres checks nuevos (`❌ 3 chequeo(s) fallando.`). El primero falla
porque el template todavía contiene `App.navigate('curriculum')`.

- [ ] **Step 3: Reescribir el template de la barra de acciones**

En `js/app.js`, dentro de `renderLesson()`, **antes** de la asignación de
`document.getElementById('lessonContainer').innerHTML` (es decir, tras el bloque
`const lessonData = ...` que termina en la línea 424), insertar el cálculo del siguiente
tema:

```js
    // Siguiente tema del capítulo (2026-07-21). Se deriva de ch.topics —
    // js/content.js no se toca (regla de fidelidad de contenido). Si es el
    // último del capítulo, el primario cierra el capítulo en vez de avanzar.
    const topicIdx = ch.topics.findIndex(t => t.id === topicId);
    const nextTopic = ch.topics[topicIdx + 1] || null;
    const nextLabel = nextTopic
      ? `${i18n.t('lesson_next')}<span class="next-topic-title">: ${escapeHtml(nextTopic.title[lang])}</span>`
      : i18n.t('lesson_finish_chapter');
    const nextArg = nextTopic ? `'${nextTopic.id}'` : 'null';
```

Después, sustituir el bloque `<div class="lesson-actions">` (líneas 432-439) por:

```js
      <div class="lesson-actions">
        <button class="lesson-complete-btn ${isCompleted ? 'completed' : ''}"
          onclick="App.completeLesson('${topicId}', ${chapterId}, ${topic.xp})"
          id="completeLessonBtn">
          ${isCompleted ? i18n.t('lesson_completed') : (this._icon('star') + ' ' + i18n.t('lesson_complete') + ` (+${topic.xp} XP)`)}
        </button>
        <button class="lesson-next-btn"
          onclick="App.completeAndAdvance('${topicId}', ${chapterId}, ${topic.xp}, ${nextArg})">
          ${nextLabel} →
        </button>
      </div>`;
```

Nota: el `← ${i18n.t('back_curriculum')}` de la barra inferior desaparece. El "Volver al
curriculum" de arriba (`index.html:342`, dentro de `.lesson-nav`) **no se toca**.

- [ ] **Step 4: Añadir el método `completeAndAdvance`**

En `js/app.js`, inmediatamente después del cierre de `completeLesson()` (línea 472, la que
cierra con `},`):

```js
  // Completar + avanzar en un clic (2026-07-21). completeLesson es idempotente
  // (comprueba includes antes de añadir), así que re-pulsarlo en una lección ya
  // completada avanza sin re-otorgar XP. El scroll al top evita aterrizar a
  // media lección nueva; el guard es por el DOM mockeado del arnés.
  completeAndAdvance(topicId, chapterId, xp, nextTopicId) {
    this.completeLesson(topicId, chapterId, xp);
    if (nextTopicId) {
      this.navigateToLesson(chapterId, nextTopicId);
      if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
    } else {
      this.navigate('curriculum');
    }
  },
```

- [ ] **Step 5: Ejecutar el arnés para verlos pasar**

Run: `node scripts/verify-runtime.js`
Expected: los tres checks `N21 lección` en verde. Los checks `N20c` existentes sobre
`renderLesson`/`_wrapLessonTables` deben seguir pasando (el template cambió, pero la llamada
a `this._wrapLessonTables()` del final de `renderLesson` se conserva intacta).

- [ ] **Step 6: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(lesson): boton 'siguiente leccion' que completa y avanza en un clic"
```

---

### Task 3: Estilo del botón primario

**Files:**
- Modify: `css/styles.css` (tras la línea 806, `.lesson-complete-btn.completed`) y dentro
  del bloque `@media (max-width: 480px)` que abre en la línea 1428
- Test: `scripts/verify-runtime.js` (ampliar el bloque `N21`)

**Interfaces:**
- Consumes: la clase `.lesson-next-btn` y el `<span class="next-topic-title">` emitidos por
  la Task 2. Tokens `--primary-dark`, `--radius-sm`, `--transition`.

- [ ] **Step 1: Escribir los checks que fallan**

Añadir dentro del bloque `N21`, tras los checks de la Task 2:

```js
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    check('N21 css: .lesson-next-btn usa --primary-dark (AA: blanco sobre él 5.83:1; sobre --primary sería 4.32:1)',
      /\.lesson-next-btn\s*\{[^}]*background:\s*var\(--primary-dark\)/.test(cssSrc)
      && /\.lesson-next-btn\s*\{[^}]*color:\s*#fff/.test(cssSrc));
    check('N21 css: el título del siguiente tema se oculta en el tier 480',
      /@media \(max-width: 480px\)[\s\S]*?\.next-topic-title\s*\{[^}]*display:\s*none/.test(cssSrc));
    check('N21 css: las reglas nuevas van antes del bloque reduced-motion',
      cssSrc.indexOf('.lesson-next-btn') < cssSrc.indexOf('@media (prefers-reduced-motion'));
```

- [ ] **Step 2: Ejecutar el arnés para verlos fallar**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en los tres checks `N21 css` (`❌ 3 chequeo(s) fallando.`).

- [ ] **Step 3: Añadir la regla del botón**

En `css/styles.css`, inmediatamente después de la línea 806
(`.lesson-complete-btn.completed { background: var(--success); }`):

```css
/* Primario de avance de lección (2026-07-21). --primary-dark, no --primary:
   blanco sobre #6C63FF es 4.32:1 (falla AA), sobre #5a52d5 es 5.83:1 (pasa) —
   mismo criterio que .bmc-fab. Por eso NO reutiliza .btn-primary, que arrastra
   ese fallo. En el tier 480 se oculta .next-topic-title y queda "Siguiente
   lección →" a secas (truncar con ellipsis se leía mal). */
.lesson-next-btn {
  background: var(--primary-dark);
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
}
.lesson-next-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,99,255,0.4); }
```

- [ ] **Step 4: Ocultar el título en el tier 480**

Dentro del bloque `@media (max-width: 480px)` (abre en la línea 1428), junto a la regla
existente `.lesson-actions { flex-wrap: wrap; gap: 12px; }`:

```css
  /* "Siguiente lección: 1.2 ¿Por qué es n…" se lee mal truncado; en teléfono
     el botón queda "Siguiente lección →" a secas. */
  .next-topic-title { display: none; }
```

- [ ] **Step 5: Ejecutar el arnés y el validador de contraste**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js`
Expected: los tres checks `N21 css` en verde; `validate-contrast.js` sin regresiones
(no cubre este par —no es un token `--*-text`— pero debe seguir pasando).

- [ ] **Step 6: Commit**

```bash
git add css/styles.css scripts/verify-runtime.js
git commit -m "style(lesson): boton primario de avance con --primary-dark (AA 5.83:1)"
```

---

### Task 4: FAB del café solo-icono en móvil + colchón

**Files:**
- Modify: `index.html:511` (atributo `data-i18n-aria` en el `<a class="bmc-fab">`)
- Modify: `css/styles.css`, dentro del bloque `@media (max-width: 768px)` (abre en la línea
  1380, cierra en la 1421) — insertar antes del `}` de cierre
- Test: `scripts/verify-runtime.js` (ampliar el bloque `N21`)

**Interfaces:**
- Consumes: la clave `bmc_label` ya existente; el mecanismo `data-i18n-aria` de
  `js/i18n.js:429-432`, que hace `el.setAttribute('aria-label', this.t(key))`.

- [ ] **Step 1: Escribir los checks que fallan**

Añadir dentro del bloque `N21`, tras los checks de la Task 3:

```js
    // El tier 768 se aísla por su cierre a columna 0: las reglas anidadas
    // cierran con "\n  }" (indentado) y no matchean "\n}".
    const tier768 = (cssSrc.match(/@media \(max-width: 768px\) \{[\s\S]*?\n\}/) || [''])[0];
    check('N21 css: en ≤768px el pill del café se reduce a círculo de 48px solo-icono',
      /\.bmc-fab\s*\{[^}]*width:\s*48px/.test(tier768)
      && /\.bmc-fab\s*\{[^}]*height:\s*48px/.test(tier768)
      && /\.bmc-fab\s*\{[^}]*border-radius:\s*50%/.test(tier768)
      && /\.bmc-fab span\s*\{[^}]*display:\s*none/.test(tier768));
    check('N21 css: .lesson-actions gana colchón inferior en ≤768px (safe-area incluida)',
      /\.lesson-actions\s*\{[^}]*padding-bottom:\s*calc\(72px\s*\+\s*env\(safe-area-inset-bottom/.test(tier768));

    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N21 a11y: el <a> del café lleva data-i18n-aria (al ocultar el span perdería su nombre accesible)',
      /<a class="bmc-fab"[^>]*data-i18n-aria="bmc_label"/.test(htmlSrc));
```

- [ ] **Step 2: Ejecutar el arnés para verlos fallar**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en los tres checks nuevos (`❌ 3 chequeo(s) fallando.`).

- [ ] **Step 3: Añadir el nombre accesible en el markup**

En `index.html`, línea 511, añadir el atributo `data-i18n-aria` (el resto de la línea no
cambia):

```html
  <a class="bmc-fab" data-i18n-aria="bmc_label" href="https://buymeacoffee.com/jorgeborn3m" target="_blank" rel="noopener noreferrer">
```

**No** añadir `class` al `<span>` de dentro ni `data-i18n` al `<a>`: ambas cosas rompen
checks `N19` (ver Global Constraints).

- [ ] **Step 4: Añadir las reglas del tier 768**

En `css/styles.css`, dentro del bloque `@media (max-width: 768px)`, justo antes del `}` de
cierre de la línea 1421 (tras `.readiness-chart { flex-direction: column; }`):

```css
  /* El pill solapaba los botones de la lección en móvil (reportado sobre
     dispositivo real, 2026-07-21): en teléfono/tablet se reduce a un círculo
     de 48px solo-icono. 48px ≥ 44px (I3). El nombre accesible lo aporta el
     data-i18n-aria del <a>, porque al ocultar el span el enlace se quedaría
     sin texto. Selector descendente y no una clase en el span: el check N19
     exige literalmente <span data-i18n="bmc_label">. */
  .bmc-fab { padding: 0; width: 48px; height: 48px; border-radius: 50%; justify-content: center; }
  .bmc-fab span { display: none; }
  /* Colchón para que ningún botón quede bajo el FAB al final del scroll.
     72px = 48 del círculo + 24 de su offset inferior. Deliberadamente solo en
     la lección: extenderlo a otras vistas queda fuera de alcance. */
  .lesson-actions { padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)); }
```

- [ ] **Step 5: Ejecutar el arnés para verlos pasar**

Run: `node scripts/verify-runtime.js`
Expected: los tres checks nuevos en verde **y los 8 checks `N19` intactos en verde**.
Salida final `✅ Todos los chequeos de runtime pasan.`

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css scripts/verify-runtime.js
git commit -m "fix(mobile): el FAB del cafe pasa a solo-icono y deja de solapar la leccion"
```

---

### Task 5: Verificación en navegador real y sincronización de documentación

**Files:**
- Modify: `CLAUDE.md` (conteo de claves 175 → 177; sección nueva)
- Modify: `AGENTS.md` (conteo de claves; entrada con los mecanismos)

**Interfaces:**
- Consumes: todo lo anterior. No produce código.

- [ ] **Step 1: Pasar todos los gates**

Run:
```bash
node scripts/verify-runtime.js && node scripts/validate-contrast.js && node scripts/validate-content.js && node scripts/validate-questions.js
```
Expected: los cuatro terminan en verde, exit code 0.

- [ ] **Step 2: Verificación en navegador real**

Run: `node scripts/validate-responsive.js`
Expected: PASS, o `SKIP: Playwright no disponible` (exit 0) si Playwright no está instalado.

Además, verificación manual — servir con `python -m http.server 8000` y comprobar en
320/375/414px y en desktop:

1. El botón primario avanza a la siguiente lección **y** la marca como completada (+XP).
2. En la última lección de un capítulo (p. ej. `1.5`) el primario dice "Completar capítulo"
   y vuelve al curriculum.
3. En una lección ya completada, el primario avanza sin volver a sumar XP.
4. Tras avanzar, la lección nueva aparece desde arriba (no a media página).
5. En ≤768px el FAB es un círculo y **no** solapa ningún botón, ni al final del scroll.
6. En ≤480px el botón dice "Siguiente lección →" sin el título del tema.
7. Con VoiceOver/NVDA (o inspeccionando el DOM), el FAB anuncia "Invítame un café".
8. Cambiar ES↔EN reetiqueta ambos botones y el `aria-label` del FAB.

- [ ] **Step 3: Actualizar `CLAUDE.md`**

Dos ediciones:

1. En la sección "UI/UX Remediation — ui-ux-pro-max Review (2026-07-14)", en la viñeta de
   `TRANSLATIONS`, sustituir "**175 keys**" por "**177 keys**" y añadir a la lista de
   añadidos recientes `lesson_next` y `lesson_finish_chapter`.
2. Añadir una sección nueva al final del fichero:

```markdown
## Lesson Flow & Mobile FAB (2026-07-21)

Dos defectos de usabilidad reportados sobre dispositivo real, tras la ronda de adaptabilidad
móvil. Spec: `docs/superpowers/specs/2026-07-21-lesson-next-button-and-mobile-fab-design.md`;
plan: `docs/superpowers/plans/2026-07-21-lesson-next-button-and-mobile-fab.md`.

- **Barra inferior de la lección**: pasa de `[← Volver] [Completada]` a
  `[Marcar como completada] [Siguiente lección →]`. El "Volver al curriculum" de abajo era
  un duplicado del de `.lesson-nav` (`index.html:342`) y se eliminó — el de arriba sigue.
- **`App.completeAndAdvance(topicId, chapterId, xp, nextTopicId)`** encadena
  `completeLesson()` + `navigateToLesson()`, o `navigate('curriculum')` si es la última
  lección del capítulo (decisión de producto: el flujo **para** al cerrar capítulo, no salta
  al siguiente). El siguiente tema se deriva de `ch.topics` en `renderLesson()` — `js/content.js`
  no se toca.
- **`.lesson-next-btn` usa `--primary-dark`, no `--primary`**: blanco sobre `#6C63FF` es
  4.32:1 (falla AA), sobre `#5a52d5` es 5.83:1 (pasa). Por eso **no** reutiliza `.btn-primary`,
  que arrastra ese fallo preexistente. Mismo criterio que `.bmc-fab`.
- **FAB del café solo-icono en ≤768px** (círculo de 48px): con el texto solapaba los botones
  de la lección. El nombre accesible pasa a `data-i18n-aria="bmc_label"` en el `<a>` —
  compatible con el gate `N19`, cuyo regex exige `data-i18n=` con el `=` inmediato. El span
  se oculta con el selector `.bmc-fab span` y **no** con una clase propia, porque `N19` exige
  literalmente `<span data-i18n="bmc_label">`.
- **`.lesson-actions` gana `padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px))`**
  en ≤768px. Deliberadamente solo en la lección.
- Gate: la familia `N21` en `scripts/verify-runtime.js`.
```

- [ ] **Step 4: Actualizar `AGENTS.md`**

Dos ediciones:

1. Buscar la mención del conteo de claves (`grep -n "175" AGENTS.md`) y actualizarla a 177,
   añadiendo `lesson_next` y `lesson_finish_chapter` a la lista de claves recientes.
2. Añadir esta entrada al final de la sección de arquitectura, junto a la de
   "Mobile adaptability (2026-07-21)":

```markdown
### Flujo de lección y FAB móvil (2026-07-21)

Reportado sobre dispositivo real tras la ronda de adaptabilidad móvil.

**Barra inferior de la lección.** `renderLesson()` emitía
`[← Volver al curriculum] [Marcar como completada]`; el "Volver" era un duplicado exacto del
que vive en `.lesson-nav` (`index.html:342`) y se eliminó. Hoy emite
`[Marcar como completada] [Siguiente lección: <tema> →]`, con el primario a la derecha.

**`App.completeAndAdvance(topicId, chapterId, xp, nextTopicId)`.** Delega en
`completeLesson()` (XP, logros, `saveState()` — no duplica nada) y después bifurca:
`navigateToLesson(chapterId, nextTopicId)` si hay siguiente, o `navigate('curriculum')` si es
la última lección del capítulo. **Decisión de producto: el flujo para al cerrar capítulo**, no
encadena con el capítulo siguiente. `completeLesson()` es idempotente, así que avanzar por una
lección ya completada no re-otorga XP. Hace `window.scrollTo(0, 0)` tras navegar (guardado con
un `typeof` por el DOM mockeado del arnés) para no aterrizar a media lección.

El siguiente tema se deriva de `ch.topics` dentro de `renderLesson()`: **`js/content.js` no se
toca**, la regla de fidelidad de contenido queda intacta.

**`.lesson-next-btn` usa `--primary-dark`, no `--primary`.** Blanco sobre `#6C63FF` es 4.32:1
(falla AA); sobre `#5a52d5` es 5.83:1 (pasa). Por eso **no** reutiliza `.btn-primary`, que
arrastra ese fallo preexistente en el resto de la app. Mismo criterio que `.bmc-fab`. En el
tier 480 se oculta `.next-topic-title` y el botón queda "Siguiente lección →" a secas —
truncar el título con ellipsis se leía mal.

**FAB del café solo-icono en ≤768px.** Con su texto (~200px) solapaba los botones de la
lección. En el tier 768 pasa a círculo de 48px (≥44px, I3). Dos detalles atados a los gates:

- El nombre accesible pasa a `data-i18n-aria="bmc_label"` **en el `<a>`**. Compatible con el
  check `N19` que prohíbe `data-i18n` ahí: su regex exige `data-i18n=` con el `=` inmediato,
  que `data-i18n-aria="` no satisface.
- El span se oculta con el selector descendente `.bmc-fab span`, **no** con una clase propia:
  el check `N19` exige literalmente `<span data-i18n="bmc_label">` y cualquier atributo extra
  lo rompería.

**`.lesson-actions` gana `padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px))`** en
≤768px (48 del círculo + 24 de su offset). Deliberadamente **solo en la lección**: extenderlo
a otras vistas quedó fuera de alcance por decisión explícita.

Gate: familia `N21` en `scripts/verify-runtime.js` (10 checks). `privacy.html` no cambia — el
enlace saliente es el mismo, solo cambia su presentación.
```

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md AGENTS.md
git commit -m "docs: sincroniza CLAUDE.md/AGENTS.md con el flujo de leccion y el FAB movil"
```

---

## Notas de riesgo para quien implemente

- **`completeLesson()` toca `#completeLessonBtn` justo antes de navegar.** Escribe
  `textContent` y `classList` sobre un nodo que `renderLesson()` va a regenerar de inmediato.
  Es inofensivo, pero **verifícalo en el navegador** (paso 2.1 de la Task 5) en lugar de
  asumirlo: si aparece un parpadeo del texto del botón, muévelo a un `if` que compruebe que
  no vamos a navegar.
- **`escapeHtml` está declarada en `js/app.js:1647`**, después del objeto `App`. Es una
  declaración de función (hoisted en el scope del script), así que `renderLesson` puede
  llamarla sin problema. No la muevas.
- **El regex `tier768` del check depende de que el bloque `@media (max-width: 768px)` cierre
  con un `}` en columna 0.** Si alguien reindenta el fichero, ese check dará un falso
  negativo silencioso (buscaría sobre una cadena vacía). Si falla sin motivo aparente,
  revisa la indentación antes que la regla CSS.
- **No confundir `.flashcard` con `.flashcard-inner`** ni tocar el tail de `styles.css`
  después del bloque reduced-motion (ver Global Constraints).
