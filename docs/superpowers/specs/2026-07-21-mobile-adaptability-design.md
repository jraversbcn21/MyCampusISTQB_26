# Adaptabilidad móvil (320–480px) — Design

**Fecha:** 2026-07-21
**Origen:** revisión de adaptabilidad móvil solicitada por el usuario (que reportó
onboarding, flashcards, glosario, barra lateral y footer del sidebar rotos en su móvil),
confirmada por una auditoría triple (CSS, HTML estructural, templates JS) **verificada
empíricamente en Chromium real** a 320/375/414px con emulación táctil, midiendo
`scrollWidth` contra viewport en las 7 vistas, barriendo las 22 lecciones y probando el
comportamiento del drawer.

**Diagnóstico raíz:** la app no tiene capa móvil, tiene capa tablet. Todo el responsive
vive en `≤768px` (drawer, buscador colapsado, stats a 2 col); por debajo solo existe
`@media (max-width: 500px)` con **una** regla (`.avatar-grid`) y el bloque
`(pointer: coarse)` que solo *agranda*. La franja 320–480px está sin tratar. Tres causas
raíz: (1) no existe tier de breakpoint de teléfono, (2) no hay red de seguridad de texto
(`overflow-wrap`/`min-width:0` — hay exactamente UN `min-width:0` en toda la hoja),
(3) `100vh` en vez de `dvh` en 4 sitios.

**Hallazgos confirmados con medición (los números son medidos, no estimados):**

| # | Hallazgo | Medida a 320px | Medida a 414px |
|---|----------|----------------|----------------|
| 1 | Glosario desborda (min-widths fijos de `.glossary-term`/`.glossary-chapter`) | fila pide 384px en 286px; def. estrangulada a 76px | aún desborda 41px |
| 2 | Dots del examen (40 × 44×44 del bloque coarse) | bloque de **408px de alto** | 304px |
| 3 | Tablas de lección sin contenedor de scroll | **11 de 16 lecciones con tabla desbordan** (peor: 3.2, 427px en 288px) | — |
| 4 | Topbar desborda (padding 24px + cluster derecho ~187px fijos, título sin `min-width:0`) | 20px de scroll de página | 0 (justo) |
| 5 | Flechas flashcard sin `flex-shrink:0` | aplastadas a **29×44** (target táctil roto); tarjeta 183px con `height:280px` fija | 32×44 |
| 6 | Drawer sin comportamiento de drawer: sin scrim (`.sidebar-overlay` es CSS muerto — ningún JS la crea), no cierra al tocar fuera, sin bloqueo de scroll, **11 focusables tabulables estando cerrado** (sin `inert`), hamburguesa tapada por el propio drawer (z 50 vs 100) | verificado | verificado |
| 7 | Onboarding roto: 7/8 pasos apuntan al sidebar trasladado a `translateX(-100%)` → spotlight en `left≈-266px`; tooltip con ancho fijo 340/300px sin clamp (negativo bajo 356px); clamp vertical asume 220px de alto → botón "Siguiente" inalcanzable en `position:fixed` | por código | por código |
| 8 | Cero `resize`/`orientationchange` en todo `js/` | por código | — |
| 9 | `100vh` en `body`, `.sidebar`, `.main`, `#app-container` → footer del sidebar (racha 🔥, logout, privacidad) bajo el chrome del navegador móvil — reintroduce por vía móvil el bug de viewports cortos arreglado el 2026-07-07 | por código | — |
| 10 | Sin `env(safe-area-inset-*)` en ningún sitio; `.bmc-fab` a `bottom:24px` cae en la zona del indicador de gestos iOS | por código | — |
| 11 | Grids que nunca llegan a 1 col (`.stats-grid` para en `1fr 1fr`, `.results-stats` en 2) y filas flex sin `flex-wrap` (`.rating-btns`, `.results-actions`, `.lesson-actions`, `.exam-topbar`, `.flashcard-stats-row`) | por código | — |
| 12 | Cero `overflow-wrap`/`word-break` en toda la hoja (tokens ISTQB tipo `FL-2.1.2` sin punto de ruptura) | por código | — |

**Lo que está bien y sirve de modelo:** el selector de avatar (grid→1col a 500px, el
único `min-width:0`, modal con max-width+overflow) y las opciones de respuesta del examen
(envuelven bien). El bloque `(pointer: coarse)` hace bien su trabajo donde aplica.

**Decisiones ya tomadas con el usuario (2026-07-21):**

1. **Dots del examen → tira horizontal** de una sola fila con scroll horizontal y el dot
   actual auto-centrado (408px de alto → ~52px, tamaño táctil intacto). Descartado:
   panel bajo demanda; encogerlos (regresaría I3).
2. **Flechas de flashcards → debajo de la tarjeta** (la tarjeta toma el ancho completo,
   ~140px más de texto). Swipe queda como mejora futura, no sustituto. Descartado:
   superponerlas sobre la tarjeta.
3. **Onboarding → el tour abre el drawer** para los pasos que apuntan al sidebar y
   resalta el ítem real (enseña a navegar de verdad). Descartado: degradar a tarjetas
   centradas sin spotlight.
4. **RECHAZADO `overflow-x: hidden` en body** como red: taparía desbordamientos en vez
   de arreglarlos y cegaría al gate de verificación. Si algo desborda, debe notarse.

## Bloque 0 — Fundación (va primero; desbloquea el resto)

- **Nuevo tier `@media (max-width: 480px)`** en `css/styles.css`. Posición: junto al
  bloque de 768px, siempre ANTES de `(pointer: coarse)` → reduced-motion →
  `:focus-visible` (la cola ordenada del fichero no se toca). El bloque de 500px
  existente (avatar-grid) se **fusiona** en el de 480 (una regla, mismo efecto práctico;
  un tier menos que mantener) — actualizar el comentario y los checks que lo mencionen.
- **Red de seguridad de texto:** `overflow-wrap: break-word` en los contenedores de
  texto de contenido (`.lesson-content`, `.glossary-def`, `.exam-q-text`, `.exam-option`,
  `.fc-question`, `.fc-answer`, `.search-result-def`, `.activity-text`, `.review-item-q`);
  `min-width: 0` en los hijos flex portadores de texto que hoy no pueden encoger
  (`.topbar-left`/`.page-title`, `.chapter-info`, `.glossary-def`, `.activity-text`,
  el `style="flex:1"` de `renderContinueStudying` ~app.js:228).
- **`100vh` → `dvh` con fallback** en los 4 sitios (`body:69`, `.sidebar:81`,
  `.main:250`, `#app-container:1639`): dos declaraciones consecutivas
  (`100vh` y luego `100dvh` — el fallback estándar sin dependencias). También
  `.avatar-modal-card { max-height: 88vh }` → `88dvh` (mismo patrón, landscape).
- **Safe areas:** `viewport-fit=cover` en el meta viewport + `env(safe-area-inset-*)`
  con fallback en los fijos de borde: `.bmc-fab` (bottom/right), `.toast-container`
  (bottom/right), `.sidebar` (padding-top del header y padding-bottom del footer),
  `.topbar` (padding lateral en landscape). Nota: al añadir `viewport-fit=cover` estos
  insets dejan de ser teóricos — deben entrar en el mismo commit que el meta.
- **Paddings que no encogen**, dentro del tier 480: `.view` 16→12px, `.topbar` 24→12px,
  `.exam-body` 28→16px, `.auth-card` 40/36→24/20px, `.welcome-banner` 32→20px,
  `.card` 20→16px. (Valores exactos ajustables en el plan; el criterio es recuperar
  20–60px de ancho útil sin romper el ritmo de espaciado.)
- **Grids/filas del tier 480:** `.stats-grid` y `.results-stats` → `1fr`;
  `flex-wrap: wrap` en `.rating-btns`, `.results-actions`, `.lesson-actions`,
  `.exam-topbar`, `.flashcard-stats-row` (alineado con sus hermanas que ya lo declaran).

## Bloque 1 — Navegación: drawer y topbar

- **Scrim:** aprovechar la clase `.sidebar-overlay` ya definida (CSS muerto hoy): `App`
  crea el nodo una vez (estático en `index.html`, oculto por defecto — preferible a
  crearlo por JS: menos superficie en el harness mockeado) y lo activa junto a
  `mobile-open`. Tap en el scrim cierra. `aria-hidden="true"` (es decorativo).
- **Cierre:** tocar fuera (el scrim lo resuelve), `Escape` (rama nueva en el keydown
  delegado existente de `App.init()` — nunca listener nuevo), y navegar (ya existe).
  Un único punto de entrada/salida `App._setDrawerOpen(open)` — el patrón
  `_setExamActive` ya validado en este repo: toggla clase, scrim, `aria-expanded` de
  `#mobileMenuBtn`, bloqueo de scroll y foco.
- **Bloqueo de scroll del body** mientras el drawer está abierto (clase en `<body>`,
  p. ej. `drawer-open`, CSS `overflow: hidden` — sin tocar estilos inline por JS).
- **Focus/a11y:** al abrir, foco al primer ítem de nav; al cerrar, foco de vuelta a
  `#mobileMenuBtn`. Cerrado en móvil: `inert` en `#sidebar` (con fallback
  documentado: si `inert` no está soportado, `visibility: hidden` vía la misma media
  query al terminar la transición — decidir mecanismo exacto en el plan) para que sus
  11 focusables dejen de ser tabulables fuera de pantalla.
- **Z-index:** la hamburguesa debe quedar alcanzable con el drawer abierto (subir
  `.topbar` o mover el botón por encima del scrim — resolver en el plan; el invariante
  es "siempre hay un control visible que cierra").
- **`#sidebarToggle` (colapso desktop) se oculta en ≤768px:** colapsar a rail de 64px es
  una affordance desktop que dentro del drawer móvil solo confunde (hoy deja un drawer
  de 64px inusable).
- **Topbar:** `min-width: 0` + `text-overflow: ellipsis; white-space: nowrap` en
  `.page-title`; en el tier 480 el cluster derecho pierde el gap sobrante. Con el
  padding 24→12 del Bloque 0, el desbordamiento de 20px a 320px queda eliminado —
  el gate lo verifica midiendo.

## Bloque 2 — Superficies de lectura: glosario y tablas

- **Glosario ≤480px:** `.glossary-item` pasa de fila a **apilado** (término arriba en
  peso fuerte, definición debajo a ancho completo, chip de capítulo como badge inline
  junto al término); se anulan los `min-width` de 200px/60px y el `nowrap` del chip en
  ese tier. En ≥481px no cambia nada.
- **Tablas de lección:** en `renderLesson`, tras inyectar `lessonData.content`, una
  pasada DOM envuelve cada `<table>` de `.lesson-content` en
  `<div class="table-scroll">` (`overflow-x: auto` + `-webkit-overflow-scrolling`,
  indicación visual de scroll opcional en el plan). **Un solo punto, cero ediciones a
  `js/content.js`** (el contenido ISTQB con fuente citada no se toca), cubre las 11
  tablas desbordantes y cualquier tabla futura. El wrapper se aplica siempre (no solo
  móvil): en desktop es inerte porque nada desborda.

## Bloque 3 — Superficies de estudio: flashcards y examen

- **Flashcards ≤768px** (el layout de flechas laterales ya es cuestionable en tablet
  estrecho; decidir tier exacto en el plan, default 480): `.flashcard-arena` pasa a
  columna — tarjeta a ancho completo arriba, fila de controles debajo (← contador →).
  `flex-shrink: 0` en `.fc-arrow` en TODOS los anchos (el aplastamiento es un bug, no
  un comportamiento de tier). `.flashcard` pasa de `height: 280px` a
  `min-height: 280px` + las caras absolutas del flip 3D revisadas para que el
  contenedor crezca con el contenido (restricción: el mecanismo de flip +
  `preserve-3d` + la animación de carrusel de 2026-07-07 deben seguir funcionando,
  incluida su rama reduced-motion — el plan detalla el mecanismo de altura).
- **Dots del examen ≤480px (decisión 1):** `.exam-question-dots` pasa a
  `flex-wrap: nowrap; overflow-x: auto` en una sola fila; al navegar/renderizar, el dot
  actual se auto-centra con `scrollIntoView({ inline: 'center', block: 'nearest' })` —
  **con guard de reduced-motion** (comportamiento `auto`, no `smooth`, bajo
  `prefers-reduced-motion`; nada de `transitionend`). El roving tabindex + flechas de
  la ronda 2 sigue funcionando (los dots siguen siendo los mismos nodos). En desktop no
  cambia nada (la parrilla envolvente actual es correcta ahí).
- **`.exam-topbar` ≤480px:** envuelve (del Bloque 0) — título a fila completa, timer y
  "Finalizar" debajo.

## Bloque 4 — Onboarding (último a propósito: depende del drawer del Bloque 1)

- **Pasos que apuntan al sidebar (decisión 3):** en móvil (media query JS
  `matchMedia('(max-width: 768px)')`, coherente con el breakpoint del drawer), el tour
  llama a `App._setDrawerOpen(true)` antes de posicionar el spotlight sobre el ítem
  real, y lo cierra al pasar a un paso que no es de sidebar y al terminar/saltar el
  tour. El scrim del drawer y el overlay del tour coexisten — orden de z-index a fijar
  en el plan (el tour va encima, z 10000+ vs scrim 99).
- **Tooltip:** ancho `min(340px, calc(100vw - 32px))` (ídem el de 300px); posición
  clampada a viewport en ambos ejes usando **`offsetHeight` real medido** (el clamp
  hardcodeado de 220px desaparece). El botón "Siguiente" debe ser siempre alcanzable —
  ese es el invariante, no el mecanismo.
- **Reposicionamiento:** listener de `resize` + `orientationchange` (los primeros del
  proyecto) **solo activos mientras el tour corre** (se añaden en `start()`, se quitan
  en `_finish()`/`_skip()` — sin listeners globales permanentes nuevos), que recalculan
  spotlight y tooltip del paso actual.
- Si el target de un paso no es visible ni abriendo el drawer (elemento `display:none`
  en móvil), el paso degrada a tooltip centrado sin spotlight — red de seguridad, no
  camino esperado.

## Errores y degradación

- Cero dependencias nuevas de runtime. Sin cambios en `sync.js`/`auth.js`/proveedores →
  `privacy.html` no cambia.
- `scrollIntoView` con objeto de opciones: soportado en todos los navegadores objetivo;
  si faltara, la tira de dots simplemente no auto-centra (no-op, coherente con el repo).
- `inert`: soporte universal en navegadores actuales; el fallback elegido en el plan
  debe degradar a "no peor que hoy".
- `dvh`: el par declaración-fallback garantiza que navegadores sin `dvh` quedan
  exactamente como hoy.

## Testing y gates

**Problema estructural que esta ronda debe dejar resuelto:** `verify-runtime.js` corre
en DOM mockeado sin layout — **ningún gate actual puede detectar una regresión
responsive**; por eso esto derivó sin que nadie lo viera. Patrón de dos partes, como en
contraste (validate-contrast + N12):

- **`N20` (estáticos, en `verify-runtime.js`, entran al pre-commit):** existe el tier
  480 y el de 500 ya no (fusionado); `.glossary-term`/`.glossary-chapter` sin
  `min-width` en px efectivo a ≤480; cero `100vh` sin su pareja `dvh` en
  `css/styles.css`; `viewport-fit=cover` presente; `env(safe-area-inset` presente en
  `.bmc-fab`; `.sidebar-overlay` referenciada desde `js/` (deja de ser CSS muerto);
  `_setDrawerOpen` existe y los toggles directos de `mobile-open` fuera de él están
  prohibidos (paralelo al check de `_setExamActive`); wrapper `.table-scroll` aplicado
  en `renderLesson`; `flex-shrink: 0` en `.fc-arrow`; `min-height` (no `height`) en
  `.flashcard`; clamp de viewport en `onboarding.js` (sin `340px`/`220` hardcodeados
  sueltos); listeners de resize del tour añadidos/retirados simétricamente.
- **`scripts/validate-responsive.js` (nuevo, navegador real):** Playwright/Chromium
  headless, emulación táctil, 320/375/414px. Afirma: (a) `documentElement.scrollWidth
  <= clientWidth` en las 7 vistas + lección con tabla + examen activo; (b) targets
  táctiles ≥44px en flechas de flashcards y dots; (c) tira de dots ≤ ~60px de alto en
  móvil; (d) drawer: scrim presente, cierra al tocar fuera, `inert`/no-tabulable
  cerrado, hamburguesa clicable abierto; (e) glosario sin scroll horizontal en su
  contenedor; (f) onboarding: tooltip íntegramente dentro del viewport en cada paso.
  **Política de dependencia (propuesta, pendiente de OK del usuario):** mismo patrón
  no-op del repo — el script detecta si Playwright está disponible y si no, se salta
  con mensaje claro; **fuera del pre-commit** (lento y con dependencia); documentado en
  CLAUDE.md/AGENTS.md como paso manual obligatorio pre-release y tras cambios de
  layout. La base ya existe (el arnés de la auditoría de hoy); promoverla es barato.
- **Los 4 validadores existentes** siguen pasando; `validate-contrast.js` no necesita
  pares nuevos (esta ronda no toca colores de texto; si el badge del glosario apilado
  acaba necesitando uno, se añade en el plan).
- **i18n:** en principio 0 claves nuevas (no hay strings nuevos visibles; si el plan
  añade indicador de scroll de tablas u otro texto, claves ES/EN + conteo actualizado
  en CLAUDE.md).
- **Verificación manual en navegador real** al cierre: móvil 375 y 320 (drawer
  end-to-end, glosario, lección 3.2, examen completo con tira de dots, flashcards con
  respuesta larga, tour completo), landscape en al menos una pasada, ambos temas,
  reduced-motion activado para la tira de dots y el tour.
- **Ejecución:** subagent-driven-development, subagentes con `model: "fable"`
  (Fable 5, modelo de sesión elegido para este trabajo), review por tarea + review
  final de rama completa — el patrón que en este repo ha cazado issues reales en todas
  las rondas.

## Restricciones que los implementadores deben respetar (heredadas + nuevas)

- Cola de `css/styles.css`: tier 480 junto al de 768; `(pointer: coarse)` →
  reduced-motion → `:focus-visible` siguen siendo, en ese orden, el final del fichero.
- Elementos interactivos en templates `innerHTML`: `role="button" tabindex="0"` +
  keydown delegado — nunca listeners por elemento.
- Nada en `js/` puede depender de `transitionend`/`animationend`; todo lo animado nuevo
  (auto-centrado de dots, apertura de drawer) con guard de reduced-motion.
- No tocar el mecanismo `composedPath()` del listener "clic fuera" del buscador; el
  cierre del drawer usa el scrim, no ese listener.
- Iconos: sprite `#i-*` / `App._icon()`; los emojis decorativos que quedan (p. ej. 🔥
  de la racha) conservan `aria-hidden`.
- `js/content.js` no se edita (regla de fidelidad de contenido; las tablas se envuelven
  por DOM en render).
- El atributo `data-theme` vive en `<body>`.
- **NUEVA:** prohibido `overflow-x: hidden` en `html`/`body`/`.main`/`.views-container`
  como mitigación de desbordamiento (decisión 4; candidato a check estático).
- **NUEVA:** todo toggle del drawer pasa por `_setDrawerOpen` (paralelo exacto a la
  regla de `_setExamActive`).
- Cada cambio a `js/`/`index.html`/`css/styles.css` pasa por sus validadores antes de
  commit (el hook los fuerza sobre la copia staged).
