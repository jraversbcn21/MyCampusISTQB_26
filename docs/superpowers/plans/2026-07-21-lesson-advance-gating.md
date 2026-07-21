# Bloqueo del avance de lección hasta completarla — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que "Siguiente lección" solo navegue — y solo si la lección está marcada como
completada; sin marcar, botón atenuado y toast de aviso al clicar.

**Architecture:** Revocación de la semántica desplegada esta mañana. `completeAndAdvance`
se renombra a `advanceLesson` y pierde el completado: un guard sobre
`state.completedLessons` muestra un toast `warning` (patrón existente del bloqueo de
búsqueda en examen) y corta. `renderLesson()` emite el primario con clase `locked` +
`aria-disabled="true"` cuando la lección no está completada; `completeLesson()` lo
desbloquea in place. Los checks `N21` que afirmaban la delegación se reescriben para
afirmar lo contrario, e incluyen dos checks **comportamentales** (llaman a `advanceLesson`
de verdad en el arnés), no solo grep.

**Tech Stack:** JavaScript vanilla, CSS plano, arnés Node `scripts/verify-runtime.js`,
gate real-browser `scripts/validate-responsive.js` (Playwright, disponible en esta máquina
vía fallback APPDATA).

**Spec:** `docs/superpowers/specs/2026-07-21-lesson-advance-gating-design.md`

## Global Constraints

- **Sin build, sin package manager, sin dependencias.** Ficheros estáticos.
- **El XP y el completado viven exclusivamente en `completeLesson`.** `advanceLesson` no
  debe llamarlo nunca — un check lo afirma en negativo.
- **Nunca el atributo `disabled` real** en el primario: `aria-disabled="true"` + clase
  `locked`. El botón sigue enfocable y clicable para poder explicar el porqué.
- **Sin `pointer-events: none`** en `.locked` (mataría el toast). Un check lo afirma en
  negativo.
- **El toast es `warning`** — asertivo para lectores de pantalla desde la ronda 2, sin
  trabajo extra.
- **`TRANSLATIONS` pasa de 177 a 178 claves**, ES/EN emparejado (arnés lo fuerza). Conteo a
  actualizar en `CLAUDE.md` y `AGENTS.md`.
- **`js/content.js` no se toca.** Regla de fidelidad de contenido.
- **Orden del tail de `css/styles.css` intocable:** 480 tier → `(pointer: coarse)` →
  bloque 768 del `.bmc-fab` (¡nuevo desde esta mañana!) → reduced-motion →
  `:focus-visible` literalmente último. La regla nueva de este plan va en el cuerpo
  principal del fichero, no en el tail.
- **La etiqueta "Completar capítulo" se queda** (decisión del spec).
- **Comentarios en español**, estilo del repo.
- **Comando de verificación tras cada tarea:** `node scripts/verify-runtime.js`.

## File Structure

| Fichero | Cambio | Responsabilidad |
|---|---|---|
| `js/i18n.js` | Modify | 1 clave nueva × 2 idiomas |
| `js/app.js` | Modify | `advanceLesson` (rename+guard), template `renderLesson`, desbloqueo en `completeLesson` |
| `scripts/verify-runtime.js` | Modify | Reescritura de 2 checks `N21`, 4 checks nuevos (2 estáticos + 2 comportamentales), posible extensión del mock |
| `css/styles.css` | Modify | `.lesson-next-btn.locked` + neutralización de su hover |
| `CLAUDE.md`, `AGENTS.md` | Modify | Revocación registrada, conteo 178 |

---

### Task 1: Guard, rename y estado bloqueado (núcleo JS + i18n + checks)

**Files:**
- Modify: `js/i18n.js` (ES tras `lesson_finish_chapter`, ~línea 113; EN tras su par, ~línea 316)
- Modify: `js/app.js:442-452` (template), `js/app.js:472-485` (`completeLesson`), `js/app.js:487-501` (`completeAndAdvance` → `advanceLesson`)
- Test: `scripts/verify-runtime.js:1260-1265` (2 checks a reescribir) + checks nuevos en el mismo bloque `N21`

**Interfaces:**
- Consumes: `App.showToast(msg, type)` (`js/app.js:1173`); `i18n.t(key)`;
  `state.completedLessons` (array de topic ids); `navigateToLesson`/`navigate` existentes.
- Produces: `App.advanceLesson(topicId: string, chapterId: number, nextTopicId: string|null): void`;
  clave i18n `lesson_next_locked_toast`; el primario con `id="nextLessonBtn"` y estado
  `locked`/`aria-disabled` condicional — la Task 2 estiliza `.lesson-next-btn.locked`.

- [ ] **Step 1: Escribir los checks que fallan**

En `scripts/verify-runtime.js`, **sustituir** los dos checks de las líneas 1260-1265
(`cablea el primario a App.completeAndAdvance` y `completeAndAdvance delega…`) por:

```js
    check('N21 lección: la barra inferior cablea el primario a App.advanceLesson',
      /App\.advanceLesson\(/.test(actionsBlock));
    check('N21 lección: el primario emite locked/aria-disabled cuando la lección no está completada',
      /lesson-next-btn \$\{isCompleted \? '' : 'locked'\}/.test(appSrc)
      && /\$\{isCompleted \? '' : 'aria-disabled="true"'\}/.test(appSrc)
      && /id="nextLessonBtn"/.test(appSrc));
    check('N21 lección: advanceLesson NO completa — guard + toast warning + return, sin completeLesson',
      /advanceLesson\(topicId, chapterId, nextTopicId\)\s*\{[\s\S]{0,200}completedLessons\.includes\(topicId\)[\s\S]{0,160}showToast\(i18n\.t\('lesson_next_locked_toast'\), 'warning'\)[\s\S]{0,60}return;/.test(appSrc)
      && !/advanceLesson\(topicId, chapterId, nextTopicId\)\s*\{[\s\S]{0,700}this\.completeLesson\(/.test(appSrc)
      && /advanceLesson[\s\S]{0,700}this\.navigateToLesson\(chapterId, nextTopicId\)/.test(appSrc)
      && /advanceLesson[\s\S]{0,700}this\.navigate\('curriculum'\)/.test(appSrc));
    check('N21 lección: completeLesson desbloquea #nextLessonBtn in place',
      /completeLesson\(topicId, chapterId, xp\)\s*\{[\s\S]{0,900}getElementById\('nextLessonBtn'\)[\s\S]{0,220}classList\.remove\('locked'\)[\s\S]{0,140}removeAttribute\('aria-disabled'\)/.test(appSrc));
    check('N21 i18n: lesson_next_locked_toast definida en ES y EN',
      typeof ctx.TRANSLATIONS.es.lesson_next_locked_toast === 'string' && ctx.TRANSLATIONS.es.lesson_next_locked_toast.length > 0
      && typeof ctx.TRANSLATIONS.en.lesson_next_locked_toast === 'string' && ctx.TRANSLATIONS.en.lesson_next_locked_toast.length > 0);
```

Y añadir, inmediatamente después, los dos checks **comportamentales** (llaman al método
real sobre los módulos cargados — más fuertes que el grep):

```js
    // Comportamental (no grep): monkeypatch de navegación/toast sobre el App
    // cargado y llamada real a advanceLesson en ambos estados.
    {
      const ctx2 = loadApp();
      if (!ctx2.App.state) ctx2.App.state = {};
      ctx2.App.state.completedLessons = [];
      let navigated = false, toasted = false;
      ctx2.App.navigateToLesson = () => { navigated = true; };
      ctx2.App.showToast = () => { toasted = true; };
      ctx2.App.advanceLesson('1.1', 0, '1.2');
      check('N21 comportamiento: sin completar, avanzar no navega y muestra el aviso',
        !navigated && toasted);
      ctx2.App.state.completedLessons = ['1.1'];
      ctx2.App.advanceLesson('1.1', 0, '1.2');
      check('N21 comportamiento: con la lección completada, avanzar navega', navigated);
    }
```

**Nota sobre el mock:** los checks comportamentales existentes (p. ej. `N20c` llama a
`ctx.App.renderLesson(...)`) prueban que `loadApp()` deja `App` operable. Si
`ctx2.App.state` requiere otra inicialización, sigue el patrón de los checks
comportamentales ya presentes en el fichero en lugar de inventar uno.

- [ ] **Step 2: Ejecutar el arnés para verlos fallar**

Run: `node scripts/verify-runtime.js`
Expected: FAIL en los 7 checks nuevos/reescritos (el comportamental primero puede reventar
con `advanceLesson is not a function` — el arnés lo reporta como fallo del check o crash;
ambos son RED válidos, captúralo). Los 2 checks viejos ya no existen.

- [ ] **Step 3: Añadir la clave i18n**

`js/i18n.js`, tras `lesson_finish_chapter: "Completar capítulo",` (~línea 113):

```js
    lesson_next_locked_toast: "Marca la lección como completada para avanzar",
```

Tras `lesson_finish_chapter: "Finish chapter",` (~línea 316):

```js
    lesson_next_locked_toast: "Mark the lesson as complete to continue",
```

- [ ] **Step 4: Reescribir el método**

En `js/app.js`, sustituir el bloque completo de `completeAndAdvance` (líneas 487-501,
comentario incluido) por:

```js
  // Avanzar SOLO navega (revocación 2026-07-21, spec lesson-advance-gating):
  // la semántica original completar-y-avanzar regalaba el XP como efecto
  // colateral y vaciaba de sentido "Marcar como completada". El XP y el
  // completado viven exclusivamente en completeLesson. Guard primero: sin
  // lección marcada, toast warning (patrón del bloqueo de búsqueda en examen,
  // asertivo para AT) y no se navega.
  advanceLesson(topicId, chapterId, nextTopicId) {
    if (!this.state.completedLessons.includes(topicId)) {
      this.showToast(i18n.t('lesson_next_locked_toast'), 'warning');
      return;
    }
    if (nextTopicId) {
      this.navigateToLesson(chapterId, nextTopicId);
    } else {
      this.navigate('curriculum');
    }
    // El scroll al top evita aterrizar a media lección nueva (rama avanzar)
    // o a media pantalla en el listado de capítulos (rama cerrar capítulo).
    if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  },
```

- [ ] **Step 5: Actualizar el template**

En `renderLesson()`, sustituir el botón primario (líneas 448-451) por:

```js
        <button class="lesson-next-btn ${isCompleted ? '' : 'locked'}"
          ${isCompleted ? '' : 'aria-disabled="true"'}
          onclick="App.advanceLesson('${topicId}', ${chapterId}, ${nextArg})"
          id="nextLessonBtn">
          ${nextLabel}
        </button>
```

- [ ] **Step 6: Desbloqueo in place en `completeLesson`**

Dentro del `if (btn) { ... }` existente no — **después** de él, aún dentro del
`if (!includes)`, añadir:

```js
      const nextBtn = document.getElementById('nextLessonBtn');
      if (nextBtn && nextBtn.classList) {
        nextBtn.classList.remove('locked');
        nextBtn.removeAttribute('aria-disabled');
      }
```

**Si el mock del arnés no implementa `classList.remove` o `removeAttribute`** (revisa
`makeEl` al principio de `verify-runtime.js`), extiende el mock — es dev-only y extenderlo
es el patrón establecido. No degrades el código de producción para complacer al mock.

- [ ] **Step 7: Ejecutar el arnés para verlos pasar**

Run: `node scripts/verify-runtime.js`
Expected: todo verde, incluida la paridad `i18n (178/178)` y los checks `N20c` intactos
(el template cambió pero `_wrapLessonTables()` sigue al final de `renderLesson`).

- [ ] **Step 8: Commit**

```bash
git add js/i18n.js js/app.js scripts/verify-runtime.js
git commit -m "feat(lesson): avanzar exige leccion completada — guard + toast, XP solo en completar"
```

---

### Task 2: Estado visual bloqueado (CSS + check)

**Files:**
- Modify: `css/styles.css` (tras `.lesson-next-btn:hover`, ~línea 827 — cuerpo principal,
  lejos del tail)
- Test: `scripts/verify-runtime.js` (bloque `N21`, junto a los checks css existentes)

**Interfaces:**
- Consumes: la clase `locked` emitida por la Task 1.
- Produces: nada que consuman tareas posteriores.

- [ ] **Step 1: Escribir el check que falla**

En el bloque `N21` de `verify-runtime.js`, tras el check
`'N21 css: .lesson-next-btn usa --primary-dark…'`:

```js
    check('N21 css: estado locked — atenuado, not-allowed, SIN pointer-events none (mataría el toast)',
      /\.lesson-next-btn\.locked\s*\{[^}]*opacity:\s*0?\.\d+/.test(cssSrc)
      && /\.lesson-next-btn\.locked\s*\{[^}]*cursor:\s*not-allowed/.test(cssSrc)
      && !/\.lesson-next-btn\.locked\s*\{[^}]*pointer-events:\s*none/.test(cssSrc));
```

- [ ] **Step 2: Ejecutar el arnés para verlo fallar**

Run: `node scripts/verify-runtime.js`
Expected: FAIL solo en ese check.

- [ ] **Step 3: Añadir las reglas**

En `css/styles.css`, inmediatamente después de la línea de `.lesson-next-btn:hover`:

```css
/* Estado bloqueado (gating 2026-07-21): atenuado pero enfocable y clicable —
   nunca disabled real (no enfocable, no explica el porqué). El clic dispara
   el toast de aviso desde advanceLesson; por eso NO lleva pointer-events:none.
   WCAG 1.4.3 exime del ratio AA a controles inactivos (aria-disabled). */
.lesson-next-btn.locked { opacity: 0.55; cursor: not-allowed; }
.lesson-next-btn.locked:hover { transform: none; box-shadow: none; }
```

- [ ] **Step 4: Ejecutar arnés + contraste**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js`
Expected: ambos verdes.

- [ ] **Step 5: Commit**

```bash
git add css/styles.css scripts/verify-runtime.js
git commit -m "style(lesson): estado locked del boton de avance (atenuado, focusable, sin pointer-events)"
```

---

### Task 3: Documentación y verificación completa

**Files:**
- Modify: `CLAUDE.md` (sección "Lesson Flow & Mobile FAB (2026-07-21)" + viñeta de
  `TRANSLATIONS`)
- Modify: `AGENTS.md` (sección homónima + conteo)

**Interfaces:**
- Consumes: todo lo anterior. No produce código.

- [ ] **Step 1: Pasar los cinco gates**

```bash
node scripts/verify-runtime.js && node scripts/validate-contrast.js && node scripts/validate-content.js && node scripts/validate-questions.js && node scripts/validate-responsive.js
```
Expected: todos PASS. `validate-responsive.js` corre Chromium real en esta máquina
(fallback APPDATA) — si imprime `SKIP: Playwright no disponible`, repórtalo como SKIP, no
como éxito.

- [ ] **Step 2: Verificación de comportamiento en navegador real**

Con Playwright (script temporal fuera del repo, borrado al terminar), en 375px y desktop:

1. Lección sin completar: el primario se ve atenuado; clicarlo muestra el toast y **no**
   navega ni suma XP.
2. Clicar "Marcar como completada": XP sumado, botón de completar en verde, y el primario
   se ilumina **sin recargar** (in place).
3. Clicar el primario ya desbloqueado: navega a la siguiente lección, arriba del todo.
4. Última lección del capítulo sin completar: mismo bloqueo; completada, "Completar
   capítulo" vuelve al curriculum.
5. Lección ya completada visitada de nuevo: primario activo desde el primer render.
6. ES↔EN: el toast sale en el idioma activo.

- [ ] **Step 3: Actualizar `CLAUDE.md`**

En la sección "Lesson Flow & Mobile FAB (2026-07-21)": sustituir la viñeta de
`completeAndAdvance` por:

```markdown
- **`App.advanceLesson(topicId, chapterId, nextTopicId)`** (antes `completeAndAdvance`):
  **solo navega, y solo si la lección está en `completedLessons`** — sin marcar, toast
  `warning` (`lesson_next_locked_toast`) y no navega; el primario se emite atenuado
  (`locked` + `aria-disabled="true"`, nunca `disabled` real) y `completeLesson()` lo
  desbloquea in place (`#nextLessonBtn`). **Revocación consciente (misma tarde, tras
  probar en dispositivo real)** de la semántica completar-y-avanzar desplegada por la
  mañana: regalaba el XP como efecto colateral y vaciaba de sentido "Marcar como
  completada". El XP vive exclusivamente en `completeLesson`. No restaurar el
  encadenamiento. Spec: `2026-07-21-lesson-advance-gating-design.md`. Sigue vigente: el
  flujo **para** al cerrar capítulo, y el siguiente tema se deriva de `ch.topics`
  (`js/content.js` no se toca).
```

Y en la viñeta de `TRANSLATIONS` (sección UI/UX 2026-07-14): **177 → 178**, añadiendo
`lesson_next_locked_toast` a la lista de adiciones recientes.

- [ ] **Step 4: Actualizar `AGENTS.md`**

En su sección "Flujo de lección y FAB móvil (2026-07-21)": misma sustitución de la parte
de `completeAndAdvance` (adaptada a la prosa de esa entrada), el conteo de claves a 178, y
una línea final: la familia `N21` incluye ahora 2 checks comportamentales (llaman a
`advanceLesson` real con monkeypatch de navegación/toast), no solo grep.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md AGENTS.md
git commit -m "docs: registra la revocacion del completar-y-avanzar y el gating del avance"
```

---

## Después del merge (operacional, fuera del plan)

Push y deploy los hace el controlador con confirmación del usuario:
`git push origin master` y `vercel deploy --prod --yes` con
`$env:NODE_EXTRA_CA_CERTS="C:\Users\jorge.carreno_amaris\.certs\corporate-ca.pem"` (red
corporativa). Verificar tras el deploy que producción sirve `advanceLesson` y la clave
nueva, y que `ISTQB 2026/` sigue en 404.

## Notas de riesgo

- **El regex del check de desbloqueo** (`[\s\S]{0,900}` desde la firma de
  `completeLesson`) depende de que el desbloqueo quede dentro de ese radio. El método es
  corto; si lo reordenas, ajusta el radio antes que debilitar el patrón.
- **El comportamental muta `ctx2.App`** (monkeypatch): usa siempre un `loadApp()` fresco
  (`ctx2`), nunca el `ctx` compartido de los checks estáticos del bloque.
- **`aria-disabled` interpolado en el template** produce un atributo suelto en la línea
  del botón — HTML válido; no lo "arregles" moviéndolo a un `setAttribute` posterior, que
  introduciría un frame sin el atributo.
