# Celebración de módulo completado + diploma de campus — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modal de felicitación al completar cada módulo (card «Camino de módulos») y diploma clásico con confetti al completar los 6, cada uno una sola vez por usuario, persistido y sincronizado.

**Architecture:** Modal estático único `#celebration-modal` en `index.html` (patrón `#avatar-modal`), contenido interior construido por JS en `App` (`_showCelebration`), disparo al final de `completeLesson()` cuando un capítulo llega al 100%. Estado en dos campos nuevos de `App.state` que viajan en el JSONB existente (nada cambia en `sync.js`/Supabase).

**Tech Stack:** Vanilla JS (singletons globales), CSS único `css/styles.css`, harness `scripts/verify-runtime.js` (familia N23), sin dependencias nuevas.

**Spec:** `docs/superpowers/specs/2026-07-25-chapter-completion-celebration-design.md`

## Global Constraints

- **NO desplegar a producción.** Revisión de Jorge en local primero; `vercel deploy` solo tras su OK explícito.
- No tocar `js/content.js` ni `js/questions.js`.
- No reordenar los `<script>` de `index.html`.
- CSS: nada después de `:focus-visible`; la sección nueva va en el cuerpo del archivo (tras el CSS del avatar-modal, ~línea 1914); overrides móviles DENTRO del tier `@media (max-width: 480px)` existente **con prefijo `#celebration-modal`** (especificidad de id — lección avatar-grid: el tier va antes en el archivo y a igual especificidad perdería).
- Sin tokens CSS nuevos. CTA primario: `background: var(--primary-dark); color: #fff` (blanco sobre `--primary` falla AA). Dorado solo en bordes/decoración, nunca color de texto (N12).
- Texto de estado solo con tokens `--*-text`.
- Emojis (🎉 🎓 ✓ decorativos) siempre con `aria-hidden="true"` (regla N17).
- i18n: toda cadena visible por clave en `TRANSLATIONS` (ES y EN, paridad forzada por el harness). Nada de ternarios `i18n.lang === 'es' ? … : …`.
- El nombre del estudiante es dato controlable por el usuario → `escapeHtml()` antes de interpolarlo en `innerHTML`.
- Checks de orden CSS anclados a `/\.selector \{/` — nunca `includes(selector)` (lección N19/N21).
- Cada commit debe pasar el hook de pre-commit (`.githooks/pre-commit` ejecuta el harness): commitea el check N23 nuevo y su implementación **juntos**.
- Commits directos a `master` (práctica del repo). Mensajes en español como los existentes.

---

### Task 1: Claves i18n de la celebración (18 nuevas, 178 → 196)

**Files:**
- Modify: `js/i18n.js` (objeto `TRANSLATIONS`, bloques `es:` y `en:`)
- Test: `scripts/verify-runtime.js` (nueva sección N23, primer check)

**Interfaces:**
- Produces: claves `celebr_badge`, `celebr_title`, `celebr_subtitle`, `celebr_quote_0`…`celebr_quote_5`, `celebr_cta_next`, `celebr_cta_curriculum`, `celebr_cta_stay`, `diploma_eyebrow`, `diploma_title`, `diploma_awarded_to`, `diploma_body`, `diploma_cta`, `diploma_close`. Los placeholders `{n}` (número de módulo, 1-based) y `{ch}` (título del capítulo) se sustituyen en JS con `.replace()` (Task 3).

- [ ] **Step 1: Escribir el check N23 que falla**

Al final de `scripts/verify-runtime.js`, después del bloque N22 y **antes** del bloque final de paridad i18n (busca `/* ---- i18n` o la línea `const es = Object.keys(ctx.TRANSLATIONS.es)` ~1441 y añade la sección N23 antes de ese bloque, siguiendo el patrón de secciones existente):

```js
  /* ---- N23: celebración de módulo completado + diploma de campus (2026-07-25) ---- */
  {
    const ctx = loadApp();
    const keys = ['celebr_badge', 'celebr_title', 'celebr_subtitle',
      'celebr_quote_0', 'celebr_quote_1', 'celebr_quote_2',
      'celebr_quote_3', 'celebr_quote_4', 'celebr_quote_5',
      'celebr_cta_next', 'celebr_cta_curriculum', 'celebr_cta_stay',
      'diploma_eyebrow', 'diploma_title', 'diploma_awarded_to',
      'diploma_body', 'diploma_cta', 'diploma_close'];
    check('N23 i18n: las 18 claves de celebración definidas y no vacías en ES y EN',
      keys.every(k => typeof ctx.TRANSLATIONS.es[k] === 'string' && ctx.TRANSLATIONS.es[k].length > 0
        && typeof ctx.TRANSLATIONS.en[k] === 'string' && ctx.TRANSLATIONS.en[k].length > 0));
  }
```

- [ ] **Step 2: Verificar que falla**

Run: `node scripts/verify-runtime.js`
Expected: `❌ N23 i18n: las 18 claves…` (el resto en verde).

- [ ] **Step 3: Añadir las claves a `js/i18n.js`**

En el bloque `es:` (junto a las claves `lesson_*`, mantén la agrupación por secciones con un comentario `// CELEBRACIÓN`):

```js
    // CELEBRACIÓN (módulo completado + diploma, 2026-07-25)
    celebr_badge: "Módulo {n} · Superado",
    celebr_title: "¡Enhorabuena!",
    celebr_subtitle: "Has dominado {ch}",
    celebr_quote_0: "Cada test que entiendes hoy es un bug que evitas mañana. ¡Sigue así!",
    celebr_quote_1: "El testing acompaña al software durante toda su vida — tú ya sabes cuándo y cómo.",
    celebr_quote_2: "Un buen tester encuentra defectos sin ejecutar una sola línea de código. Vas camino de serlo.",
    celebr_quote_3: "Dominar las técnicas es pasar de probar por intuición a probar con precisión.",
    celebr_quote_4: "Gestionar el testing es gestionar el riesgo — y tú ya tienes el mapa.",
    celebr_quote_5: "Las herramientas multiplican al tester que sabe lo que hace. Como tú.",
    celebr_cta_next: "Empezar Módulo {n} →",
    celebr_cta_curriculum: "Ir al curriculum →",
    celebr_cta_stay: "Quedarme aquí",
    diploma_eyebrow: "MyCampus ISTQB · CTFL v4.0",
    diploma_title: "Diploma de Finalización",
    diploma_awarded_to: "Se otorga el presente diploma a",
    diploma_body: "por completar con éxito los 6 módulos del campus de preparación para la certificación ISTQB Foundation Level.",
    diploma_cta: "Ponte a prueba: Simulacro de examen →",
    diploma_close: "Cerrar",
```

En el bloque `en:` (misma posición relativa):

```js
    // CELEBRATION (module completed + diploma, 2026-07-25)
    celebr_badge: "Module {n} · Passed",
    celebr_title: "Congratulations!",
    celebr_subtitle: "You've mastered {ch}",
    celebr_quote_0: "Every test you understand today is a bug you prevent tomorrow. Keep it up!",
    celebr_quote_1: "Testing walks with software through its whole life — now you know when and how.",
    celebr_quote_2: "A great tester finds defects without running a single line of code. You're on your way.",
    celebr_quote_3: "Mastering techniques means moving from testing by intuition to testing with precision.",
    celebr_quote_4: "Managing testing is managing risk — and you now hold the map.",
    celebr_quote_5: "Tools multiply the tester who knows what they're doing. Like you.",
    celebr_cta_next: "Start Module {n} →",
    celebr_cta_curriculum: "Go to curriculum →",
    celebr_cta_stay: "Stay here",
    diploma_eyebrow: "MyCampus ISTQB · CTFL v4.0",
    diploma_title: "Diploma of Completion",
    diploma_awarded_to: "This diploma is awarded to",
    diploma_body: "for successfully completing all 6 modules of the ISTQB Foundation Level preparation campus.",
    diploma_cta: "Put yourself to the test: Exam simulator →",
    diploma_close: "Close",
```

- [ ] **Step 4: Verificar que pasa**

Run: `node scripts/verify-runtime.js`
Expected: todo en verde, incluida la paridad (`i18n: paridad ES/EN (196/196)`).

- [ ] **Step 5: Commit**

```bash
git add js/i18n.js scripts/verify-runtime.js
git commit -m "feat(i18n): claves de la celebracion de modulo y el diploma (178 -> 196)"
```

---

### Task 2: Markup del modal + CSS completo

**Files:**
- Modify: `index.html` (tras el cierre de `#avatar-modal`, ~línea 536, antes de `</div><!-- end #app-container -->`)
- Modify: `css/styles.css` (sección nueva tras el CSS del avatar-modal ~línea 1914; línea 1341 `.toast-container`; tier `@media (max-width: 480px)` ~línea 1460)
- Test: `scripts/verify-runtime.js` (sección N23)

**Interfaces:**
- Produces: `#celebration-modal` (scrim/dialog), `#celebrConfetti` (capa confetti), `#celebrationCard` (card vacía que rellena JS), clases `.celebration-card`, `.celebration-card.diploma`, `.celebr-badge/.celebr-sub/.celebr-path/.celebr-step(.done|.next)/.celebr-link/.celebr-quote/.celebr-cta/.celebr-ghost/.celebr-eyebrow/.celebr-medal/.celebr-name/.celebr-name-rule/.celebr-body/.celebr-chips/.celebr-chip/.celebr-date/.celebr-seal/.celebr-confetti`, keyframes `celebrFall`.

- [ ] **Step 1: Escribir los checks N23 estáticos que fallan**

Dentro de la sección N23 de `scripts/verify-runtime.js` (tras el check i18n de Task 1):

```js
    /* --- Task 2: markup + CSS --- */
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N23 markup: #celebration-modal es role=dialog aria-modal etiquetado por celebrationTitle',
      /<div id="celebration-modal"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="celebrationTitle"/.test(htmlSrc));
    check('N23 markup: la capa de confetti es decorativa (aria-hidden)',
      /<div id="celebrConfetti"[^>]*aria-hidden="true"/.test(htmlSrc));

    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    // Ancla a la regla real (/\.selector \{/), nunca includes() — lección N19/N21.
    const idxCelebrCard = cssSrc.search(/\.celebration-card \{/);
    check('N23 css: .celebration-card existe y va antes del bloque reduced-motion',
      idxCelebrCard >= 0 && idxCelebrCard < cssSrc.indexOf('@media (prefers-reduced-motion'));
    check('N23 css: el CTA usa --primary-dark con texto blanco (AA 5.83:1; --primary fallaría)',
      /\.celebr-cta\s*\{[^}]*background:\s*var\(--primary-dark\)/.test(cssSrc)
      && /\.celebr-cta\s*\{[^}]*color:\s*#fff/.test(cssSrc));
    check('N23 css: los toasts quedan por encima del modal (z-index 6000 > 5000)',
      /\.toast-container\s*\{[^}]*z-index:\s*6000/.test(cssSrc));
    check('N23 css: el override móvil lleva prefijo #celebration-modal (id gana la cascada; el tier va antes que la base)',
      /@media \(max-width: 480px\)[\s\S]*?#celebration-modal \.celebration-card\s*\{/.test(cssSrc));
    check('N23 css: los chips usan el par success validado (fondo tintado + --success-text)',
      /\.celebr-chip\s*\{[^}]*background:\s*rgba\(76,\s*175,\s*80,\s*0?\.12\)/.test(cssSrc)
      && /\.celebr-chip\s*\{[^}]*color:\s*var\(--success-text\)/.test(cssSrc));
```

Nota: `htmlSrc` y `cssSrc` ya se declaran con esos nombres dentro del bloque N21 — la sección N23 es un bloque `{}` propio, así que no colisionan.

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: los 7 checks nuevos en ❌; todo lo demás en verde.

- [ ] **Step 3: Añadir el markup a `index.html`**

Justo después del `</div>` que cierra `#avatar-modal` (línea ~536) y antes de `</div><!-- end #app-container -->`:

```html
  <!-- CELEBRATION MODAL (2026-07-25): card de módulo completado + diploma de
       campus. Mismo patrón que #avatar-modal (scrim, Escape, foco). El interior
       lo construye App._showCelebration() — es dinámico (capítulo, nombre, fecha). -->
  <div id="celebration-modal" style="display:none" role="dialog" aria-modal="true" aria-labelledby="celebrationTitle">
    <div id="celebrConfetti" class="celebr-confetti-layer" aria-hidden="true"></div>
    <div class="celebration-card" id="celebrationCard"></div>
  </div>
```

- [ ] **Step 4: Añadir el CSS**

**4a.** En `css/styles.css`, línea 1341, cambia el `z-index` de `.toast-container` de `1000` a `6000` y documenta por qué (los toasts de logro/level-up se disparan en el mismo `completeLesson` que abre el modal — deben verse por encima de su scrim; 6000 > 5000 del modal, y siguen bajo el onboarding 9999+):

```css
/* z-index 6000 (2026-07-25): por encima de los modales (5000) — los toasts de
   logro/level-up saltan en el mismo completeLesson que abre la celebración y
   deben verse sobre su scrim. Siguen bajo el tour de onboarding (9999+). */
.toast-container { position: fixed; bottom: calc(80px + env(safe-area-inset-bottom, 0px)); right: calc(24px + env(safe-area-inset-right, 0px)); display: flex; flex-direction: column; gap: 8px; z-index: 6000; }
```

**4b.** Sección nueva inmediatamente después del bloque `.avatar-modal-footer { … }` (~línea 1914+, antes de la sección de onboarding):

```css
/* ===== CELEBRATION MODAL (2026-07-25) =====
   Card «Camino de módulos» + diploma de campus. Patrón #avatar-modal (scrim
   fixed, z-index 5000). CTA con --primary-dark (blanco sobre --primary falla
   AA — regla .bmc-fab/.lesson-next-btn). El dorado del diploma es SOLO
   decorativo (bordes, sello, halo) — nunca color de texto (regla N12); los
   textos de estado usan tokens --*-text. */
#celebration-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  padding: 16px;
  overflow: hidden;
}
.celebration-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  width: 100%;
  max-width: 420px;
  max-height: 88vh;  /* fallback */
  max-height: 88dvh;
  overflow-y: auto;
  box-shadow: var(--shadow);
  text-align: center;
  position: relative;
}
.celebration-card h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
  margin: 4px 0;
}
.celebration-card.diploma {
  max-width: 520px;
  border: 2px solid rgba(255,193,7,0.55);
  outline: 1px solid rgba(255,193,7,0.25);
  outline-offset: 5px;
}

/* --- card de módulo --- */
.celebr-badge {
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--secondary-text);
  border: 1px solid rgba(0,210,255,0.4);
  border-radius: 999px;
  padding: 4px 12px;
  margin-bottom: 10px;
}
.celebr-sub { color: var(--text2); font-size: 0.9rem; }
.celebr-path {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 18px 0 8px;
}
.celebr-step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  border: 1px solid var(--border);
  color: var(--text2);
  flex-shrink: 0;
}
.celebr-step.done {
  background: var(--primary-dark);
  color: #fff;
  border: none;
  box-shadow: 0 0 14px rgba(108,99,255,0.6);
}
.celebr-step.next { border: 2px dashed var(--secondary); color: var(--secondary-text); }
.celebr-link { flex: 0 0 10px; height: 2px; background: var(--surface2); }
.celebr-quote {
  color: var(--primary-text);
  font-size: 0.95rem;
  font-style: italic;
  margin: 14px 0 18px;
  line-height: 1.5;
}
.celebr-cta {
  background: var(--primary-dark);
  color: #fff;
  border: none;
  padding: 12px 22px;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: var(--font);
}
.celebr-cta:hover { filter: brightness(1.1); }
.celebr-ghost {
  display: block;
  margin: 12px auto 0;
  background: none;
  border: none;
  color: var(--text3);
  font-size: 0.85rem;
  cursor: pointer;
  font-family: var(--font);
}
.celebr-ghost:hover { text-decoration: underline; color: var(--text2); }

/* --- diploma --- */
.celebr-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--warning-text);
  margin-bottom: 8px;
}
.celebr-medal {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
  background: radial-gradient(circle at 35% 30%, rgba(255,213,79,0.35), rgba(255,193,7,0.12));
  box-shadow: 0 0 26px rgba(255,193,7,0.45);
}
.celebr-name { font-size: 1.25rem; color: var(--primary-text); font-weight: 600; margin: 12px 0 2px; }
.celebr-name-rule { width: 180px; height: 1px; background: var(--border); margin: 6px auto 12px; }
.celebr-body { color: var(--text2); font-size: 0.9rem; line-height: 1.55; margin-bottom: 14px; }
.celebr-chips {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.celebr-chip {
  font-size: 0.72rem;
  color: var(--success-text);
  background: rgba(76,175,80,0.12);
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
}
.celebr-date { font-size: 0.78rem; color: var(--text3); margin-bottom: 16px; }
.celebr-seal {
  position: absolute;
  bottom: 16px;
  right: 18px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #FFD54F, #B8860B);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1A1A2E;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

/* --- confetti (solo lo genera JS en el diploma; bajo reduced-motion no se
       genera NINGUNA pieza — guard matchMedia en _spawnConfetti — y además el
       blunt block global anularía la animación) --- */
.celebr-confetti-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.celebr-confetti {
  position: absolute;
  top: -20px;
  width: 9px;
  height: 14px;
  border-radius: 2px;
  animation: celebrFall 3s linear forwards;
}
@keyframes celebrFall {
  to { transform: translateY(110vh) rotate(540deg); }
}
```

**4c.** Dentro del tier `@media (max-width: 480px)` existente (~línea 1460, junto al override `#avatar-modal .avatar-grid`), con prefijo de id (misma razón documentada allí):

```css
  /* Celebración (2026-07-25): prefijo #celebration-modal por especificidad —
     este tier va ANTES de la sección base en el archivo (misma lección que
     #avatar-modal .avatar-grid). */
  #celebration-modal .celebration-card { padding: 24px 16px; }
  #celebration-modal .celebr-step { width: 32px; height: 32px; font-size: 0.8rem; }
  #celebration-modal .celebr-link { flex-basis: 6px; }
```

- [ ] **Step 5: Verificar que pasan todos los checks**

Run: `node scripts/verify-runtime.js`
Expected: todo verde (los 7 nuevos incluidos).

Run: `node scripts/validate-contrast.js`
Expected: OK (no hay pares de tokens nuevos; los usados ya están validados).

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css scripts/verify-runtime.js
git commit -m "feat(ui): markup y estilos del modal de celebracion y el diploma"
```

---

### Task 3: JS del modal — `_showCelebration`, cierre, confetti, foco y Escape

**Files:**
- Modify: `js/app.js` (helper `_getDisplayName` + refactor de `updateSidebar` ~línea 179; métodos nuevos junto a la sección LESSON; wiring en `init()` junto al listener del scrim del drawer ~línea 1456; rama Escape del drawer ~línea 1481)
- Test: `scripts/verify-runtime.js` (sección N23)

**Interfaces:**
- Consumes: claves i18n de Task 1; ids/clases de Task 2; `escapeHtml()` (global en `app.js`), `App._icon(name)`, `CHAPTERS`, `LESSONS`.
- Produces: `App._showCelebration(kind, chapterId)` con `kind ∈ {'chapter','diploma'}` (lo llama Task 4); `App._closeCelebration()`; `App._getDisplayName()` → string; `App._nextChapterTarget(chapterId)` → `{chapterId, topicId} | null`; `App._chapterComplete(i)` → boolean. (`_chapterComplete`/`_nextChapterTarget` se definen aquí porque `_chapterCardHtml` los necesita; Task 4 los reutiliza.)

- [ ] **Step 1: Escribir los checks N23 estáticos que fallan**

En la sección N23 de `scripts/verify-runtime.js`:

```js
    /* --- Task 3: JS del modal --- */
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N23 xss: el nombre del diploma pasa por escapeHtml (dato controlable por el usuario)',
      /escapeHtml\(this\._getDisplayName\(\)\)/.test(appSrc));
    check('N23 motion: el confetti no se genera bajo prefers-reduced-motion (guard matchMedia, patrón _slideFlashcard)',
      /_spawnConfetti\(\)\s*\{[\s\S]{0,400}?matchMedia\('\(prefers-reduced-motion: reduce\)'\)/.test(appSrc));
    check('N23 a11y: Escape y clic en el scrim cierran el modal de celebración',
      /getElementById\('celebration-modal'\)[\s\S]{0,400}?Escape[\s\S]{0,200}?_closeCelebration/.test(appSrc)
      && /e\.target === celebrModal[\s\S]{0,100}?_closeCelebration/.test(appSrc));
    check('N23 a11y: el drawer ignora Escape nacido dentro del modal de celebración',
      /t\.closest\('#celebration-modal'\)/.test(appSrc));
    check('N23 sidebar: updateSidebar usa el helper _getDisplayName (sin IIFE duplicada)',
      /const displayName = this\._getDisplayName\(\)/.test(appSrc));
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: los 5 checks nuevos en ❌.

- [ ] **Step 3: Extraer `_getDisplayName` y refactorizar `updateSidebar`**

En `js/app.js`, añade el helper justo **antes** de `updateSidebar()` (~línea 175):

```js
  // Nombre visible del alumno: localStorage > metadata de Auth > prefijo del
  // email > fallback i18n. Extraído de updateSidebar (2026-07-25) para
  // reutilizarlo en el diploma sin duplicar la resolución.
  _getDisplayName() {
    if (typeof Auth !== 'undefined' && Auth.user) {
      const uid = Auth.user.id;
      const saved = localStorage.getItem(`mycampus_displayname_${uid}`);
      if (saved) return saved;
      const meta = Auth.user.user_metadata || {};
      return meta.full_name || meta.name || Auth.user.email?.split('@')[0] || i18n.t('student_fallback');
    }
    return i18n.t('student_fallback');
  },
```

Y en `updateSidebar()` sustituye la IIFE completa (`const displayName = (() => { … })();`, líneas ~179–188) por:

```js
    const displayName = this._getDisplayName();
```

- [ ] **Step 4: Añadir los métodos del modal**

En `js/app.js`, tras `advanceLesson()` (~línea 513), añade:

```js
  /* ===== CELEBRATION (2026-07-25) =====
     Card de módulo completado + diploma de campus. El disparo vive en
     completeLesson (_maybeCelebrate); aquí solo la presentación. Spec:
     docs/superpowers/specs/2026-07-25-chapter-completion-celebration-design.md */

  _chapterComplete(chapterId) {
    const ch = CHAPTERS[chapterId];
    return !!ch && ch.topics.every(t => this.state.completedLessons.includes(t.id));
  },

  // Primer capítulo POSTERIOR con alguna lección pendiente (y con contenido),
  // y su primera lección pendiente. Solo escaneo hacia delante — si todo lo
  // posterior está completo, el CTA cae al curriculum (decisión del spec).
  _nextChapterTarget(chapterId) {
    for (let c = chapterId + 1; c < CHAPTERS.length; c++) {
      const t = CHAPTERS[c].topics.find(
        tp => !this.state.completedLessons.includes(tp.id) && LESSONS[tp.id]);
      if (t) return { chapterId: c, topicId: t.id };
    }
    return null;
  },

  _showCelebration(kind, chapterId) {
    const modal = document.getElementById('celebration-modal');
    const card = document.getElementById('celebrationCard');
    if (!modal || !card) return;
    this._celebrReturnFocusEl = (typeof document.activeElement === 'object') ? document.activeElement : null;
    if (card.classList) card.classList.toggle('diploma', kind === 'diploma');
    card.innerHTML = kind === 'diploma' ? this._diplomaHtml() : this._chapterCardHtml(chapterId);
    modal.style.display = 'flex';
    if (kind === 'diploma') this._spawnConfetti();
    const cta = document.getElementById('celebrCta');
    if (cta && typeof cta.focus === 'function') cta.focus();
  },

  _chapterCardHtml(chapterId) {
    const lang = i18n.lang;
    const target = this._nextChapterTarget(chapterId);
    const steps = CHAPTERS.map((ch, i) => {
      const done = this._chapterComplete(i);
      const cls = done ? ' done' : (target && i === target.chapterId ? ' next' : '');
      return `<div class="celebr-step${cls}" aria-hidden="true">${done ? this._icon('check') : (i + 1)}</div>`;
    }).join('<div class="celebr-link" aria-hidden="true"></div>');
    const ctaLabel = target
      ? i18n.t('celebr_cta_next').replace('{n}', target.chapterId + 1)
      : i18n.t('celebr_cta_curriculum');
    const ctaAction = target
      ? `App._closeCelebration();App.navigateToLesson(${target.chapterId}, '${target.topicId}')`
      : `App._closeCelebration();App.navigate('curriculum')`;
    return `
      <div class="celebr-badge">${i18n.t('celebr_badge').replace('{n}', chapterId + 1)}</div>
      <h2 id="celebrationTitle">${i18n.t('celebr_title')} <span aria-hidden="true">🎉</span></h2>
      <p class="celebr-sub">${i18n.t('celebr_subtitle').replace('{ch}', CHAPTERS[chapterId].title[lang])}</p>
      <div class="celebr-path">${steps}</div>
      <p class="celebr-quote">${i18n.t('celebr_quote_' + chapterId)}</p>
      <button class="celebr-cta" id="celebrCta" onclick="${ctaAction}">${ctaLabel}</button>
      <button class="celebr-ghost" id="celebrStay" onclick="App._closeCelebration()">${i18n.t('celebr_cta_stay')}</button>`;
  },

  _diplomaHtml() {
    const lang = i18n.lang;
    // Único dato controlable por el usuario del template → escapeHtml (regla XSS).
    const name = escapeHtml(this._getDisplayName());
    const date = new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB',
      { day: 'numeric', month: 'long', year: 'numeric' });
    const chips = CHAPTERS.map(ch =>
      `<span class="celebr-chip"><span aria-hidden="true">✓ </span>${ch.title[lang]}</span>`).join('');
    return `
      <div class="celebr-eyebrow">${i18n.t('diploma_eyebrow')}</div>
      <div class="celebr-medal" aria-hidden="true">🎓</div>
      <h2 id="celebrationTitle">${i18n.t('diploma_title')}</h2>
      <p class="celebr-body">${i18n.t('diploma_awarded_to')}</p>
      <div class="celebr-name">${name}</div>
      <div class="celebr-name-rule" aria-hidden="true"></div>
      <p class="celebr-body">${i18n.t('diploma_body')}</p>
      <div class="celebr-chips">${chips}</div>
      <div class="celebr-date">${date}</div>
      <button class="celebr-cta" id="celebrCta" onclick="App._closeCelebration();App.navigate('simulator')">${i18n.t('diploma_cta')}</button>
      <button class="celebr-ghost" id="celebrStay" onclick="App._closeCelebration()">${i18n.t('diploma_close')}</button>
      <div class="celebr-seal" aria-hidden="true">${this._icon('check')}</div>`;
  },

  _closeCelebration() {
    const modal = document.getElementById('celebration-modal');
    if (modal) modal.style.display = 'none';
    const conf = document.getElementById('celebrConfetti');
    if (conf) conf.innerHTML = '';
    if (this._celebrReturnFocusEl && typeof this._celebrReturnFocusEl.focus === 'function') {
      this._celebrReturnFocusEl.focus();
    }
    this._celebrReturnFocusEl = null;
  },

  _spawnConfetti() {
    // Guard reduced-motion (patrón _slideFlashcard): typeof mantiene al harness
    // mockeado (sin matchMedia) en el camino normal; con reduce activo no se
    // genera NINGUNA pieza — el respeto al usuario no depende solo del blunt
    // block CSS.
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const holder = document.getElementById('celebrConfetti');
    if (!holder) return;
    const colors = ['#6C63FF', '#00D2FF', '#FFC107', '#FF6B6B', '#4CAF50', '#A29DFF'];
    let html = '';
    for (let i = 0; i < 50; i++) {
      const left = (Math.random() * 100).toFixed(1);
      const delay = (Math.random() * 1.5).toFixed(2);
      const dur = (2.5 + Math.random() * 2).toFixed(2);
      const rot = Math.floor(Math.random() * 360);
      html += `<div class="celebr-confetti" style="left:${left}%;background:${colors[i % colors.length]};animation-delay:${delay}s;animation-duration:${dur}s;transform:rotate(${rot}deg)"></div>`;
    }
    holder.innerHTML = html;
    setTimeout(() => { if (holder) holder.innerHTML = ''; }, 6000);
  },
```

- [ ] **Step 5: Wiring en `init()` y en la rama Escape del drawer**

**5a.** En `App.init()`, justo después del listener del scrim del drawer (`sidebarScrim`, ~línea 1456):

```js
    // Celebración (2026-07-25): Escape y clic en el scrim cierran. Mismo
    // patrón que el modal de avatar (listener propio en el elemento; el foco
    // de vuelta lo gestiona _closeCelebration).
    const celebrModal = document.getElementById('celebration-modal');
    if (celebrModal) {
      celebrModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._closeCelebration();
      });
      celebrModal.addEventListener('click', (e) => {
        if (e.target === celebrModal) this._closeCelebration();
      });
    }
```

**5b.** En la rama Escape del drawer del keydown delegado (~línea 1485), añade el modal de celebración a las exclusiones (mismo motivo que `#avatar-modal` — si el evento nace dentro del modal, su listener propio ya actuó y el drawer no debe tocarse):

```js
        if (sidebar && sidebar.classList.contains('mobile-open')
            && t.id !== 'globalSearch'
            && !(typeof t.closest === 'function' && t.closest('#avatar-modal'))
            && !(typeof t.closest === 'function' && t.closest('#celebration-modal'))) {
```

- [ ] **Step 6: Verificar que pasan**

Run: `node scripts/verify-runtime.js`
Expected: todo verde (los 5 de Task 3 incluidos). El check i18n de residuos no debe protestar (no hay ternarios de idioma nuevos).

- [ ] **Step 7: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(celebracion): modal de modulo y diploma — render, foco, Escape y confetti"
```

---

### Task 4: Disparo en `completeLesson` + estado persistido

**Files:**
- Modify: `js/app.js` (`loadState()` defaults ~línea 43; `completeLesson()` ~línea 474; método nuevo `_maybeCelebrate`)
- Test: `scripts/verify-runtime.js` (sección N23, checks comportamentales)

**Interfaces:**
- Consumes: `App._showCelebration(kind, chapterId)`, `App._chapterComplete(i)` (Task 3).
- Produces: campos de estado `celebratedChapters: number[]` y `diplomaShown: boolean` (viajan en el JSONB existente; `sync.js` no se toca); `App._maybeCelebrate(chapterId)`.

- [ ] **Step 1: Escribir los checks comportamentales que fallan**

En la sección N23 de `scripts/verify-runtime.js` (patrón monkeypatch de N21; se neutralizan los colaterales de UI de `completeLesson` — sidebar, popup, toasts — para que el mock de DOM no interfiera):

```js
    /* --- Task 4: disparo en completeLesson --- */
    const quiet = (c) => {
      c.App.updateSidebar = () => {};
      c.App.showXPPopup = () => {};
      c.App.showToast = () => {};
      c.App.checkAchievements = () => {};
    };
    {
      const ctx2 = loadApp();
      quiet(ctx2);
      ctx2.App.state = ctx2.App.loadState();
      const ch0 = ctx2.CHAPTERS[0].topics.map(t => t.id);
      ctx2.App.state.completedLessons = ch0.slice(0, -1);
      const shown = [];
      ctx2.App._showCelebration = (kind, chId) => shown.push([kind, chId]);
      ctx2.App.completeLesson(ch0[ch0.length - 1], 0, 10);
      check('N23 trigger: cerrar un capítulo dispara la card una vez',
        shown.length === 1 && shown[0][0] === 'chapter' && shown[0][1] === 0);
      check('N23 trigger: el capítulo queda marcado en celebratedChapters',
        Array.isArray(ctx2.App.state.celebratedChapters) && ctx2.App.state.celebratedChapters.includes(0));
      ctx2.App.completeLesson(ch0[ch0.length - 1], 0, 10);
      check('N23 trigger: repetir la lección ya completada no re-dispara', shown.length === 1);
      const ch1 = ctx2.CHAPTERS[1].topics.map(t => t.id);
      ctx2.App.completeLesson(ch1[0], 1, 10);
      check('N23 trigger: completar sin cerrar capítulo no celebra', shown.length === 1);
    }
    {
      // Diploma: todo el campus completo salvo la última lección del cap. 5.
      const ctx2 = loadApp();
      quiet(ctx2);
      ctx2.App.state = ctx2.App.loadState();
      const all = ctx2.CHAPTERS.flatMap(ch => ch.topics.map(t => t.id));
      const last = all[all.length - 1];
      ctx2.App.state.completedLessons = all.filter(id => id !== last);
      const shown = [];
      ctx2.App._showCelebration = (kind) => shown.push(kind);
      ctx2.App.completeLesson(last, 5, 10);
      check('N23 diploma: cerrar el campus muestra SOLO el diploma (sustituye a la card)',
        shown.length === 1 && shown[0] === 'diploma');
      check('N23 diploma: diplomaShown queda persistido', ctx2.App.state.diplomaShown === true);
      check('N23 diploma: el capítulo que cierra también queda en celebratedChapters (no habrá card después)',
        ctx2.App.state.celebratedChapters.includes(5));
    }
    {
      // Migración: estado guardado antes de esta feature (sin los campos nuevos).
      const ctx2 = loadApp();
      quiet(ctx2);
      ctx2.App.state = ctx2.App.loadState();
      delete ctx2.App.state.celebratedChapters;
      delete ctx2.App.state.diplomaShown;
      const ch0 = ctx2.CHAPTERS[0].topics.map(t => t.id);
      ctx2.App.state.completedLessons = ch0.slice(0, -1);
      const shown = [];
      ctx2.App._showCelebration = (kind) => shown.push(kind);
      let threw = false;
      try { ctx2.App.completeLesson(ch0[ch0.length - 1], 0, 10); } catch (e) { threw = true; }
      check('N23 migración: un estado legado sin los campos nuevos no revienta y celebra',
        !threw && shown.length === 1);
    }
```

- [ ] **Step 2: Verificar que fallan**

Run: `node scripts/verify-runtime.js`
Expected: los 8 checks nuevos en ❌ (`celebratedChapters`/`_maybeCelebrate` no existen aún).

- [ ] **Step 3: Añadir los defaults de estado**

En `loadState()` (~línea 43), añade al objeto por defecto, tras `dailyChallengeCompleted: false,`:

```js
      celebratedChapters: [],
      diplomaShown: false,
```

- [ ] **Step 4: Implementar `_maybeCelebrate` y engancharlo a `completeLesson`**

Método nuevo justo antes de `_chapterComplete` (sección CELEBRATION de Task 3):

```js
  // Disparo (spec 2026-07-25): al llegar un capítulo al 100%, celebrar UNA vez.
  // Si con él los 6 quedan al 100% → diploma (sustituye a la card del capítulo,
  // nunca dos popups). loadState() no fusiona defaults sobre estados guardados,
  // así que los estados anteriores a la feature llegan sin los campos nuevos —
  // guard de migración aquí, no en loadState (cubre también la copia de la nube).
  _maybeCelebrate(chapterId) {
    if (!Array.isArray(this.state.celebratedChapters)) this.state.celebratedChapters = [];
    if (typeof this.state.diplomaShown !== 'boolean') this.state.diplomaShown = false;
    if (!this._chapterComplete(chapterId)) return;
    if (this.state.celebratedChapters.includes(chapterId)) return;
    this.state.celebratedChapters.push(chapterId);
    const campusDone = CHAPTERS.every((ch, i) => this._chapterComplete(i));
    if (campusDone && !this.state.diplomaShown) {
      this.state.diplomaShown = true;
      this.saveState();
      this._showCelebration('diploma', chapterId);
    } else {
      this.saveState();
      this._showCelebration('chapter', chapterId);
    }
  },
```

Y en `completeLesson()`, como **última línea dentro del `if`** de lección nueva (tras el desbloqueo de `nextBtn`):

```js
      this._maybeCelebrate(chapterId);
```

- [ ] **Step 5: Verificar que pasan**

Run: `node scripts/verify-runtime.js`
Expected: todo verde — los 8 comportamentales de Task 4 y **sin regresiones** en N1/N2/N21/N22 (el `saveState` extra de `_maybeCelebrate` ocurre dentro de la ventana ya reconciliada; el gate `_reconciled` no se toca).

- [ ] **Step 6: Commit**

```bash
git add js/app.js scripts/verify-runtime.js
git commit -m "feat(celebracion): disparo al completar capitulo — una vez, diploma con los 6"
```

---

### Task 5: Documentación + verificación local completa (sin deploy)

**Files:**
- Modify: `CLAUDE.md` (sección nueva tras «Lesson Flow & Mobile FAB (2026-07-21)»; actualizar el recuento i18n «178» de la sección i18n)
- Run: los 5 validadores + prueba manual en navegador

- [ ] **Step 1: Actualizar `CLAUDE.md`**

En la sección **i18n**, actualiza el recuento: `**178 keys**` → `**196 keys**` y añade al historial de crecimiento: `→ 196 (2026-07-25 celebración de módulo/diploma)`.

Tras la sección «Lesson Flow & Mobile FAB (2026-07-21)», añade:

```markdown
## Celebración de módulo + diploma de campus (2026-07-25)

Modal centrado al completar módulos. Spec:
`docs/superpowers/specs/2026-07-25-chapter-completion-celebration-design.md`.

- **Disparo en `completeLesson` → `App._maybeCelebrate(chapterId)`**: al llegar un
  capítulo al 100% (aunque se complete en desorden), una sola vez por usuario —
  `state.celebratedChapters` (array) y `state.diplomaShown` (bool), persistidos en el
  JSONB existente (sync intacto). Si con él los 6 quedan al 100% → **diploma**, que
  sustituye a la card (nunca dos popups). Guard de migración dentro de
  `_maybeCelebrate` (estados legados y copias de nube sin los campos nuevos) — no en
  `loadState`, que no fusiona defaults sobre estados guardados.
- **`#celebration-modal`** estático en `index.html` (patrón avatar-modal: Escape con
  listener propio + exclusión en la rama drawer del keydown delegado, clic en scrim,
  foco al CTA al abrir y de vuelta al cerrar). Interior por JS: card «Camino de
  módulos» (`_chapterCardHtml`) o diploma (`_diplomaHtml`, clase `diploma`).
- **CTA de la card** → primera lección pendiente del siguiente capítulo (escaneo solo
  hacia delante; sin pendientes posteriores → curriculum). **CTA del diploma** →
  `navigate('simulator')`.
- **Confetti solo en el diploma**, generado por JS con guard
  `matchMedia('(prefers-reduced-motion: reduce)')` (patrón `_slideFlashcard` — con
  reduce NO se genera ninguna pieza); autolimpieza a los 6s y al cerrar.
- **`_getDisplayName()`** — resolución del nombre extraída de `updateSidebar` (IIFE)
  y reutilizada por el diploma **con `escapeHtml`** (dato controlable por el usuario).
- **`.toast-container` subió a `z-index: 6000`** (antes 1000): los toasts de
  logro/level-up saltan en el mismo `completeLesson` que abre el modal (5000) y deben
  verse sobre su scrim. Siguen bajo el onboarding (9999+).
- CSS en sección propia tras el avatar-modal; overrides móviles dentro del tier 480
  **con prefijo `#celebration-modal`** (especificidad de id — misma lección que
  `#avatar-modal .avatar-grid`; el tier va antes que la base en el archivo).
- Gate: familia **N23** en `verify-runtime.js` (i18n, markup/CSS anclado a
  `/\.celebration-card \{/`, XSS del nombre, guard reduced-motion, Escape/drawer, y
  comportamentales: card una vez, no-recelebración, diploma sustituye a la card,
  migración de estado legado).
```

- [ ] **Step 2: Ejecutar la batería completa**

```bash
node scripts/validate-questions.js
node scripts/validate-content.js
node scripts/verify-runtime.js
node scripts/validate-contrast.js
node scripts/validate-responsive.js
```

Expected: todo OK (responsive puede decir `SKIP: Playwright no disponible` — si es así, anótalo en el resumen final para que Jorge lo sepa).

- [ ] **Step 3: Prueba manual en local (Jorge revisa aquí — NO desplegar)**

```bash
python -m http.server 8000
```

Guion de prueba en `http://localhost:8000` con el usuario de pruebas (email `hahomi5121@kierko.com`, password `Test7890` — login email+password, no necesita el allowlist de redirects):

1. Completar las 5 lecciones del Módulo 1 → al marcar la última, card «Camino de módulos» centrada: badge, 🎉, paso 1 iluminado, paso 2 en cian punteado, frase del módulo 1, CTA «Empezar Módulo 2 →».
2. CTA → aterriza en la primera lección del Módulo 2. Volver, recargar, re-entrar en la última lección del Módulo 1 → **no** se re-muestra.
3. Escape / clic fuera / «Quedarme aquí» → cierra sin navegar y el foco vuelve.
4. Completar los módulos 2–6 → al cerrar el 6º, **diploma** (no card): borde dorado, nombre del usuario, chips verdes de los 6 módulos, fecha, confetti cayendo unos segundos, CTA → Simulacros.
5. Verificar en ambos temas (toggle), en EN (switcher), en móvil (device toolbar 375px) y con reduced-motion emulado (DevTools → Rendering → prefers-reduced-motion) → sin confetti.
6. Toast de logro visible POR ENCIMA del scrim al dispararse junto al modal.

- [ ] **Step 4: Commit de la documentación**

```bash
git add CLAUDE.md
git commit -m "docs: documenta la celebracion de modulo y el diploma de campus"
```

- [ ] **Step 5: Cierre — recordatorio explícito**

**NO ejecutar `vercel deploy`.** El trabajo queda en local/`master` pendiente de la revisión de Jorge; el deploy es un paso posterior y manual tras su OK.
