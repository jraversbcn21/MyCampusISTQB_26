# UI/UX Remediation — Round 2 (I3 + I7 + I8 + follow-ups menores) — Design

**Fecha:** 2026-07-15
**Origen:** hallazgos pendientes de la revisión `ui-ux-pro-max` del 2026-07-14 (ver
`AGENTS.md` → entradas de los cuatro bloques de esa fecha) más los follow-ups menores
registrados en las mismas entradas.
**Alcance acordado:** todo lo pendiente — I3, I7, I8 y los ~9 follow-ups menores — en una
sola ronda con cuatro bloques.
**Guidelines de referencia** (skill `ui-ux-pro-max`): touch targets ≥44×44px con
separación ≥8px (el requisito aplica a punteros imprecisos; en desktop con ratón no es
obligatorio cambiar el visual), no depender solo de hover, un único set de iconos SVG con
stroke consistente (no emojis como iconos estructurales), patrón ARIA combobox para
autocompletado con teclado.

## Bloque 1 — I3: Touch targets (<44px)

**Problema:** `.lang-btn` mide ~24px de alto (padding 4px 8px, fuente 0.75rem, gap 2px),
`.exam-dot` 28×28px con gap 6px, y `.name-edit-btn` tiene `opacity: 0` fuera de hover —
invisible en táctil (donde no hay hover) e invisible también como tab stop de teclado.

**Decisión de enfoque (elegida entre tres):** agrandar físicamente **solo en táctil** vía
`@media (pointer: coarse)`. Se descartó la expansión de hit-area invisible
(pseudo-elementos con inset negativo) para lang-btns y dots porque sus separaciones
actuales (2px / 6px) harían solapar las áreas de toque de controles adyacentes,
provocando toques erróneos; y se descartó agrandar en todas partes porque cambiaría el
visual de desktop sin necesidad (el requisito de 44px es para punteros imprecisos).

**Diseño:**

- Nuevo bloque `@media (pointer: coarse)` en `css/styles.css`, insertado **antes** del
  bloque `@media (prefers-reduced-motion: reduce)` — restricción de orden de la cola del
  fichero: reduced-motion y después `:focus-visible` literalmente al final deben seguir
  siendo los dos últimos bloques (ver CLAUDE.md → constraints de edición).
- `.lang-btn` → `min-height: 44px; min-width: 44px` (padding acorde); `.lang-switcher`
  gap 2px → 8px.
- `.exam-dot` → `width: 44px; height: 44px`; `.exam-question-dots` gap 6px → 8px. En un
  examen de 40 preguntas la parrilla envuelve en más filas en móvil — aceptable y
  esperado, `flex-wrap` ya existe.
- `.name-edit-btn` → `opacity: 0.7` (siempre visible en táctil). **No** se agranda
  físicamente a 44px (es un botón inline junto al nombre dentro del user-card y romper
  su layout no compensa): su área de toque se amplía con padding/pseudo-elemento, que en
  este caso concreto sí es seguro porque no tiene controles adyacentes que solapar.
- Fuera del media query (todos los dispositivos): la regla ya sugerida en AGENTS.md,
  `.user-card:focus-within .name-edit-btn, .name-edit-btn:focus-visible { opacity: 0.7; }`
  — el botón deja de ser un tab stop invisible para teclado.

**En desktop con ratón, todo queda visualmente idéntico a hoy.**

## Bloque 2 — I7: Búsqueda global en móvil + teclado del dropdown + nombre accesible

**Problema:** `.search-box { display: none }` en ≤768px sin ninguna alternativa móvil; el
dropdown de resultados (2026-07-08) no tiene soporte de teclado; `#globalSearch` solo
tiene el placeholder como "nombre" (anti-patrón placeholder-as-label).

**Decisión de enfoque (elegida entre tres para el UX móvil):** icono de búsqueda en el
topbar móvil que despliega una barra a ancho completo bajo el topbar, con el mismo
dropdown actual. Se descartó meter el buscador en el drawer (resultados estrechos, el
drawer se cierra al navegar) y mantener el input siempre visible encogido (topbar móvil
sobrecargado, input inútil de estrecho).

**Diseño:**

- **Móvil (≤768px):** nuevo botón `#mobileSearchBtn` en el topbar (icono de búsqueda —
  SVG por el Bloque 3), visible solo ≤768px (oculto en desktop, donde `.search-box` sigue
  igual que hoy). `.search-box` deja de ser `display: none` en ≤768px: pasa a ser una
  barra a ancho completo posicionada bajo el topbar, oculta por defecto y visible con la
  clase `.mobile-open`. **Se reutiliza el mismo `#globalSearch` y todo el JS existente**
  (`_onGlobalSearchInput`, `_renderGlobalSearch`, `_closeGlobalSearch`, guard de examen
  `_examActive`) — cero duplicación de estado ni de listeners.
- **Ciclo de foco móvil:** al abrir, el foco va al input; `Escape` o un botón ✕ dentro de
  la barra cierran y devuelven el foco a `#mobileSearchBtn`. El listener "clic fuera
  cierra" existente (basado en `composedPath()`, no tocar ese mecanismo — ver AGENTS.md)
  debe seguir funcionando y además cerrar la barra móvil.
- **Teclado del dropdown (aplica también en desktop):** patrón ARIA combobox —
  `#globalSearch` recibe `role="combobox"`, `aria-expanded`, `aria-controls`,
  `aria-activedescendant`; `#globalSearchResults` recibe `role="listbox"`; cada resultado
  `role="option"` con id estable (`gs-opt-N`). `ArrowDown`/`ArrowUp` mueven la selección
  activa (clase visual, p. ej. `.gs-active`, con estilo que pase contraste en ambos
  temas), `Enter` activa el resultado seleccionado (misma acción que su click), `Escape`
  cierra el panel. El listener de teclado va **directo** sobre `#globalSearch` — es un
  elemento estático de `index.html`, no un template regenerado, así que no viola la regla
  "solo delegación para nodos de template" (esa regla existe porque los templates se
  regeneran; este input no).
- **Nombre accesible:** `data-i18n-aria="global_search_aria"` en `#globalSearch` (clave
  nueva). El botón móvil y el ✕ también con claves i18n nuevas. ~3 claves nuevas ES/EN
  (p. ej. `global_search_aria`, `mobile_search_aria`, `close_search_aria` — nombres
  exactos a fijar en el plan); la paridad la vigila el harness.
- El guard de examen no cambia: con `_examActive`, las acciones que navegan siguen
  bloqueadas con toast; expandir definiciones sigue funcionando — también desde teclado.

## Bloque 3 — I8: Emojis estructurales → sprite SVG inline

**Problema:** emojis como iconos estructurales (dependientes de la fuente del sistema,
inconsistentes entre plataformas, no tematizables): logo 🎓, 7 iconos de nav, 🔍, ☰ (×2),
⏻, ✕, ←/→, 4 stat-icons, ✏️, más los que generan los templates JS (toast ✅⚠️❌ℹ️,
dropdown 📖/📚, verdicto de resultados).

**Alcance elegido:** estructurales **más** templates JS (opción amplia, elegida
explícitamente sobre la mínima).

**Diseño:**

- **Sprite:** un `<svg>` oculto (`display:none aria-hidden="true"`) al inicio de `<body>`
  en `index.html`, con un `<symbol id="i-<nombre>" viewBox="0 0 24 24">` por icono.
  Iconos estilo **Lucide** (paths pegados inline — sin build, sin CDN, coherente con la
  política del repo), `fill="none" stroke="currentColor" stroke-width="2"` — un único
  estilo de set, stroke consistente. ~22 símbolos.
- **Uso en HTML estático:** `<svg class="icon" aria-hidden="true"><use href="#i-home"/></svg>`.
  Superficies: logo (auth + sidebar), 7 nav-icons, búsqueda (desktop y el nuevo
  `#mobileSearchBtn`), ☰ del sidebar toggle y del menú móvil, ⏻ logout, ✕ del modal de
  avatar (y el ✕ de la barra de búsqueda móvil del Bloque 2), ←/→ del carrusel de
  flashcards, 4 stat-icons del dashboard.
- **Uso en templates JS:** helper `App._icon(name)` en `js/app.js` que devuelve el string
  `<svg class="icon" aria-hidden="true"><use href="#i-…"/></svg>` para interpolar en
  `innerHTML`. Superficies reales verificadas en el código (el dropdown de búsqueda no
  tiene emojis y el verdicto de resultados es solo texto — no están en el alcance):
  - Icono de **tipo** de toast (`showToast`, ~app.js:1058: ✅⚠️❌ℹ️ →
    check-circle/alert-triangle/x-circle/info).
  - Iconos de estado del curriculum (~app.js:343: ✓/▶/🔒 → check/play/lock) y el
    chevron de cabecera de capítulo (~app.js:372: ▶ → chevron, conservando la rotación
    CSS de abierto/cerrado).
  - Badges del menú de exámenes (~app.js:687: ✅/🔒 → check-circle/lock).
  - ✅ del reto diario completado (~app.js:244) y ⭐ del botón de completar lección
    (~app.js:433) y del activity log (~app.js:1019) → check-circle/star.
  - El ✏️ de editar nombre — que se crea por DOM en `js/avatar.js` (`_setupNameEdit`,
    ya es un `<button>` real), no en HTML estático: su `innerHTML` pasa a
    `App._icon('pencil')`.
  El nombre que recibe `_icon()` es siempre un literal interno — nunca dato de usuario
  (sin superficie XSS nueva).
- **Se quedan como emojis (contenido, no estructura):** emojis de celebración dentro de
  mensajes de toast (🎉🔓⚡🔥📋 — van dentro del texto traducido), iconos de
  nivel/logros/avatares (vienen de los datos de `gamification.js`/`avatar.js`), el emoji
  grande decorativo de la cabecera de resultados (`.results-emoji`).
- **A11y:** todos los `<svg>` de icono llevan `aria-hidden="true"` — los controles ya
  tienen nombre accesible por `data-i18n-aria` (I5, 2026-07-14) o texto visible adyacente.
  Al pasar el icono de tipo de toast a SVG `aria-hidden`, el follow-up "el emoji del toast
  no está oculto al live region" queda cerrado de gratis.
- **Theming y tamaño:** color por `currentColor` (hereda del texto — funciona en ambos
  temas sin tokens nuevos); tamaño por CSS (`.icon { width: 1em; height: 1em; }` como
  base + ajustes puntuales donde el emoji actual tenía un font-size específico, p. ej.
  logo y stat-icons). Alineación a la línea base del texto adyacente.

## Bloque 4 — Follow-ups menores (9 ítems de AGENTS.md)

1. **Modal de avatar accesible por teclado:** `#userAvatar` → `role="button" tabindex="0"`
   + aria-label i18n nueva (el handler delegado de Enter/Space lo cubre gratis); las
   `.av-card` (template de `avatar.js`) → `role="button" tabindex="0"` (ídem); el modal →
   `role="dialog" aria-modal="true"`; al abrir, foco al botón de cerrar; `Escape` cierra;
   al cerrar, el foco vuelve a `#userAvatar`. **Límite deliberado:** sin focus-trap
   completo (ciclado de Tab dentro del modal) — se documenta como pendiente menor, no se
   implementa en esta ronda.
2. **`aria-expanded` en cabeceras de capítulo:** `renderCurriculum()` emite el atributo
   desde `_expandedChapters` al renderizar, y `toggleChapter()` lo sincroniza a mano al
   alternar la clase (no re-renderiza).
3. **Colores crudos usados como texto:** (a) nuevo token `--secondary-text` por tema para
   el stat de exámenes completados de la vista de progreso (~app.js:969), con valores AA
   validados; **entra en `scripts/validate-contrast.js`** como par adicional. (b) Los
   porcentajes que hoy usan los acentos de capítulo (`colors = ["#6C63FF", ...]`) como
   color de **texto** (continue-list del curriculum y barras de capítulo de progreso)
   pasan a `var(--text2)`; el acento se queda solo en fills/barras (que no son texto y no
   están en el alcance AA de texto).
4. **Politeness type-aware en toasts:** los toasts `warning`/`error` llevan
   `role="alert"` en el propio nodo (anuncio asertivo estándar al insertarse); el
   contenedor `#toastContainer` sigue `aria-live="polite"` para success/info. Sin segundo
   contenedor.
5. **Roving tabindex + `aria-current` en exam dots:** el dot actual `tabindex="0"
   aria-current="true"`, el resto `tabindex="-1"`; `ArrowLeft`/`ArrowRight` mueven el foco
   entre dots — extensión del keydown delegado existente en `App.init()` (mismo listener,
   una rama más; **no** listeners por elemento — los dots se regeneran en cada render).
6. **Focus tras `goToQuestion()`:** tras su re-render, el foco se restaura al dot actual
   (paralelo al arreglo ya hecho en `selectAnswer()` → `#optN`).
7. **`continue-item` del dashboard:** `role="button" tabindex="0"` en el template — el
   handler delegado lo cubre.
8. **`#mobileMenuBtn` como toggle:** `aria-expanded` sincronizado al abrir/cerrar el
   drawer móvil (corrige la imprecisión del label estático "Abrir menú" cuando ya está
   abierto). El label i18n no cambia.
9. **Nit del TTS anidado en `#flashcard`:** se queda como está — ya adjudicado
   (funcionalmente seguro, verificado sin doble disparo); reestructurar el DOM de la
   flashcard es desproporcionado. Solo se re-documenta en AGENTS.md como decisión
   mantenida.

## Errores y degradación

- Nada de esta ronda añade dependencias externas ni rutas de red nuevas — el sprite es
  inline y `_icon()` es puro string. Sin cambios en `sync.js`/`auth.js`/backends →
  `privacy.html` no necesita cambios.
- `_icon(name)` con nombre desconocido: devuelve string vacío (degradación silenciosa,
  coherente con el patrón no-op del repo) — los llamadores siempre usan literales, así
  que solo pasaría por error de programación y lo cazan los checks estáticos.
- El harness mockeado (`verify-runtime.js`) no tiene `matchMedia` en algunos paths — los
  cambios de este spec no dependen de `matchMedia` en JS (el media query de I3 es
  CSS-only), así que no hay interacción con el guard existente del carrusel.

## Testing y gates

- **Checks estáticos nuevos en `scripts/verify-runtime.js`:**
  - `N16` (I3+I7): bloque `pointer: coarse` presente con las reglas de 44px; regla de
    focus del name-edit-btn; `#mobileSearchBtn` existe con aria i18n; `.search-box` ya no
    es `display:none` a secas en el media query de 768px; atributos combobox/listbox en
    el HTML/JS; handler de teclado del dropdown presente; `Escape`/focus-restore.
  - `N17` (I8): sprite presente en `index.html` con los símbolos esperados; cero emojis
    estructurales restantes en las superficies migradas (nav, stat-icons, topbar, logo);
    `App._icon` definido y usado por `showToast`, los iconos de estado del curriculum,
    los badges del menú de exámenes y el activity log; `avatar.js` usa `App._icon` para
    el ✏️; todos los `<svg class="icon">` con `aria-hidden`.
  - `N18` (follow-ups): `role`/`tabindex`/`aria` de avatar (`#userAvatar`, `.av-card`,
    dialog), `aria-expanded` en cabeceras de capítulo y en `#mobileMenuBtn`,
    `role="alert"` condicional en `showToast`, roving tabindex + `aria-current` +
    rama de flechas en el keydown delegado, focus-restore de `goToQuestion`,
    `continue-item` con role/tabindex, y el swap de colores de texto del ítem 3.
- **`scripts/validate-contrast.js`** ampliado con el par `--secondary-text` (ambos
  temas). Los pares existentes no cambian.
- **i18n:** ~6 claves nuevas ES/EN (búsqueda ×3, avatar ×1, y las que surjan en el plan);
  la paridad y los residuos los vigila el harness como siempre. `TRANSLATIONS` pasa de
  170 a las que resulten — actualizar el conteo en CLAUDE.md/AGENTS.md al cerrar.
- **Verificación en navegador real (Playwright/Chromium):** móvil 375px (barra de
  búsqueda desplegable end-to-end, touch targets medidos ≥44px, drawer + aria-expanded) y
  desktop (combobox por teclado con pulsaciones reales, roving de dots, modal de avatar
  con Escape/focus-restore), en ambos temas. Captura del before/after de iconos.
- **Ejecución:** subagent-driven-development, todos los subagentes con `model: "fable"`
  (Fable 5), review por tarea + review final de rama completa — el patrón de las rondas
  anteriores, que en este repo ha cazado issues reales en cada ronda.

## Restricciones que los implementadores deben respetar (heredadas)

- Cola de `css/styles.css`: el nuevo bloque `pointer: coarse` va **antes** del bloque de
  reduced-motion; `:focus-visible` sigue literalmente al final.
- Elementos interactivos en templates `innerHTML`: `role="button" tabindex="0"` + handler
  delegado — nunca listeners por elemento.
- Texto de estado: tokens `--*-text` o utilidades `.text-*`, nunca los tokens crudos.
- Nada en `js/` puede depender de `transitionend`/`animationend` (reduced-motion).
- No tocar el mecanismo `composedPath()` del listener "clic fuera" del buscador.
- El atributo `data-theme` vive en `<body>`.
- Cada cambio a `js/`/`index.html`/`css/styles.css` pasa por sus validadores antes de
  commit (el hook los fuerza sobre la copia staged).
