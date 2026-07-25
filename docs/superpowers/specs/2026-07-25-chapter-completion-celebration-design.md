# Celebración de módulo completado + diploma de campus — Diseño

**Fecha:** 2026-07-25
**Estado:** aprobado por Jorge (brainstorming con visual companion; mockups en
`.superpowers/brainstorm/1604-1784982376/content/`)

## Qué se construye

Dos celebraciones nuevas, mostradas como modal centrado sobre scrim:

1. **Card de módulo completado** — aparece la primera vez que un capítulo llega al
   100% de lecciones completadas. Estilo elegido: **"Camino de módulos"** (mockup B):
   badge «Módulo N · Superado», título «¡Enhorabuena! 🎉», subtítulo «Has dominado
   <capítulo>», un camino horizontal de 6 pasos conectados (completados iluminados en
   morado, el siguiente en cian punteado, pendientes apagados), una frase
   inspiracional propia de cada módulo, CTA primario «Empezar Módulo N+1 →» y
   secundario «Quedarme aquí».
2. **Diploma de campus completado** — aparece (en lugar de la card normal) cuando el
   capítulo que se cierra deja los 6 al 100%. Estilo elegido: **"Diploma clásico"**
   (mockup A) **+ los chips verdes de módulos del mockup B**: borde dorado doble tipo
   pergamino, eyebrow «MyCampus ISTQB · CTFL v4.0», medalla 🎓, título «Diploma de
   Finalización», nombre del estudiante con línea de firma, cuerpo «por completar con
   éxito los 6 módulos…», los 6 módulos como chips verdes ✓, fecha localizada, sello
   dorado en la esquina, CTA primario «Ponte a prueba: Simulacro de examen →» y
   secundario «Cerrar». **Con lluvia de confetti animada** al abrirse.

Cada celebración se muestra **una sola vez por usuario** (persistido y sincronizado a
la nube).

## Decisiones cerradas (con alternativas descartadas)

| Decisión | Elegido | Descartado |
|---|---|---|
| Trigger | Al llegar el capítulo al 100% (en `completeLesson`, sea cual sea la lección que lo cierra) | Ligarlo al clic en «Terminar capítulo» (se pierde con orden libre); combinación de ambos |
| Frecuencia | Una vez por módulo, persistido en `App.state` | Re-mostrar; botón re-visualizador en Logros |
| Diploma | Exige los 6 capítulos al 100%, sea cual sea el que cierre el campus; sustituye a la card normal de ese capítulo | Ligarlo al cap. 6 literal; cascada de dos popups |
| CTA de la card | Directo a la 1ª lección no completada del siguiente capítulo | Curriculum con capítulo expandido |
| Arquitectura | Modal estático único en `index.html` + controlador en `App` (patrón avatar-modal) | Construcción 100% JS; toast central |

## Arquitectura

### Estado (js/app.js)

Dos campos nuevos en `App.state`, con guard de migración para estados existentes
(`this.state.celebratedChapters = this.state.celebratedChapters || []`, ídem bool):

- `celebratedChapters: number[]` — ids de capítulo cuya celebración ya se mostró.
- `diplomaShown: boolean` — el diploma ya se mostró.

Se marcan **en el momento de mostrar** y se persisten con `saveState()` → localStorage
inmediato + push a la nube por el mecanismo existente (campos dentro del mismo JSONB
de `user_progress`; Supabase no se toca). Ningún cambio en `sync.js`.

### Disparo (completeLesson)

Al final de `completeLesson()` (tras `checkAchievements()`), solo cuando la lección
acaba de marcarse (dentro del `if` de no-repetido):

```
si capítulo(chapterId) está al 100%
   y chapterId ∉ celebratedChapters:
     si los 6 capítulos están al 100% y !diplomaShown:
         diplomaShown = true; celebratedChapters += chapterId; saveState()
         _showCelebration('diploma', chapterId)
     si no:
         celebratedChapters += chapterId; saveState()
         _showCelebration('chapter', chapterId)
```

Consecuencias del diseño:
- Orden libre cubierto: cerrar el capítulo desde una lección intermedia también celebra.
- Usuarios existentes: sin celebración retroactiva de capítulos ya completos
  (`completeLesson` no puede re-dispararse sobre lecciones ya marcadas); si solo les
  faltaba parte de un capítulo, al cerrarlo se celebra con normalidad, y si era el
  último del campus, reciben el diploma.
- El diploma sustituye a la card del capítulo que cierra el campus (nunca dos popups).
- Los toasts del mismo `completeLesson` (logro, level-up) conviven: el
  `.toast-container` queda por encima del modal (z-index).

### Modal (index.html + js/app.js)

- `#celebration-modal` estático en `index.html`, inmediatamente después de
  `#avatar-modal`: `role="dialog" aria-modal="true"
  aria-labelledby="celebrationTitle"`, `style="display:none"`, scrim propio (mismo
  patrón visual que el avatar-modal), y dentro una `.celebration-card` vacía que JS
  rellena.
- `App._showCelebration(kind, chapterId)` construye el interior por `innerHTML`
  (contenido dinámico: título del capítulo, camino de 6 pasos según
  `completedLessons`, nombre del alumno, fecha). `kind = 'chapter' | 'diploma'`; el
  diploma añade la clase `diploma` a la card.
- Solo se interpolan datos internos (`CHAPTERS`, `i18n`) y el nombre del alumno, que
  pasa por `escapeHtml()` (viene de localStorage/metadata de Auth → dato controlable
  por el usuario; regla XSS del repo).
- `App._closeCelebration()` cierra, restaura el foco y limpia el confetti.
- Nombre del alumno: se extrae la resolución inline de `updateSidebar()` (IIFE
  localStorage > metadata Auth > prefijo email > fallback i18n) a un helper
  **`App._getDisplayName()`**, usado por ambos sitios — mejora puntual, sin cambio de
  comportamiento en la sidebar.

### CTAs

- **Card de módulo.** Primario: 1ª lección **no completada** del siguiente capítulo
  (`navigateToLesson(next, topicId)`); «siguiente» = primer capítulo tras `chapterId`
  con lecciones pendientes; si no existe (orden libre, resto completo), fallback
  `navigate('curriculum')` y el texto del CTA pasa a la clave genérica de curriculum.
  El paso «siguiente» del camino visual apunta a ese mismo capítulo. Secundario
  «Quedarme aquí»: cierra sin navegar.
- **Diploma.** Primario: `navigate('simulator')`. Secundario «Cerrar».
- Cerrar por Escape/scrim = quedarse donde estabas.

### Accesibilidad

Mismo contrato que el avatar-modal:
- Al abrir: foco al CTA primario. Al cerrar: foco de vuelta al elemento que lo tenía.
- Escape cierra: rama nueva en el **keydown delegado** de `App.init()`, con prioridad
  sobre el drawer y al nivel del avatar-modal (un solo modal puede estar abierto a la
  vez en la práctica; la rama de celebración se evalúa antes que el drawer).
- Clic en el scrim cierra. Botones reales (`<button>`), no divs.
- Emojis del diseño (🎉 🎓 y los ✓ decorativos) con `aria-hidden="true"` — la regla
  N17 permite emojis decorativos así marcados; no se usan como icono funcional.
- Sin focus-trap de Tab — paridad deliberada con el avatar-modal (leftover documentado
  en CLAUDE.md); si algún día se añade allí, añadirlo aquí también.

### Confetti (solo diploma)

- ~50 piezas `<div>` generadas por JS al abrir, colores de la paleta
  (`#6C63FF #00D2FF #FFC107 #FF6B6B #4CAF50 #A29DFF`), animación CSS de caída con
  duraciones/posiciones variadas, `pointer-events: none`, contenedor `aria-hidden`.
- Autolimpieza por `setTimeout` (~6s) y también al cerrar el modal.
- **Guard `matchMedia('(prefers-reduced-motion: reduce)')`** al estilo del carrusel:
  con reduced-motion **no se genera ninguna pieza** (además el blunt block CSS ya
  anularía la animación). El guard usa `typeof matchMedia` para que el harness
  mockeado (sin `matchMedia`) siga el camino normal, como `_slideFlashcard`.
- Sin `Math.random()`-dependencia testeable: el harness no verifica posiciones, solo
  presencia/ausencia según el guard.

### i18n (js/i18n.js)

~18 claves nuevas ES/EN (178 → ~196), paridad forzada por el harness. Grupos:
- Card: `celebr_badge` («Módulo {n} · Superado» — interpolación en JS), `celebr_title`,
  `celebr_subtitle`, `celebr_quote_0`…`celebr_quote_5` (una frase inspiracional por
  módulo, tono motivador, sin contenido examinable — no aplica la regla de fuentes
  ISTQB), `celebr_cta_next`, `celebr_cta_curriculum` (fallback), `celebr_cta_stay`.
- Diploma: `diploma_eyebrow`, `diploma_title`, `diploma_awarded_to`, `diploma_body`,
  `diploma_cta`, `diploma_close`.
- Los nombres de módulo de chips/camino salen de `CHAPTERS[i].title[lang]` (ya
  bilingües, no se duplican claves).
- Fecha: `new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', …)`.

### CSS (css/styles.css)

- Sección nueva `/* ===== CELEBRATION MODAL ===== */` en el cuerpo principal del
  archivo (junto al CSS del avatar-modal), **nunca en el tail** — el orden del tail
  (480 → coarse → bmc-fab → reduced-motion → :focus-visible último) no se toca.
- Ajustes móviles dentro de los tiers **existentes** ≤768/≤480 (card a ancho casi
  completo, camino de pasos más compacto, chips en 2 filas).
- **Sin tokens nuevos**: CTA primario con `--primary-dark` (blanco sobre `--primary`
  falla AA — regla `.bmc-fab`/`.lesson-next-btn`); chips con el par ya validado
  `rgba(76,175,80,0.12)` + `var(--success-text)`; el dorado (`--warning` y derivados)
  solo en bordes/decoración, **nunca como color de texto** (regla N12); textos en
  `--text`/`--text2`/`--primary-text`.
- El modal debe verse bien en **ambos temas** (los mockups son del oscuro; el claro
  usa los mismos tokens).
- z-index: scrim/modal por encima del contenido y del `.bmc-fab`; `.toast-container`
  por encima del modal.

## Verificación

### Familia N23 en scripts/verify-runtime.js (gate de pre-commit)

Comportamentales (cargando `App` real con el patrón `loadApp()` de N21):
1. Completar la última lección pendiente de un capítulo → `_showCelebration('chapter', …)`
   llamado, capítulo añadido a `celebratedChapters`.
2. Repetir la condición (capítulo ya en `celebratedChapters`) → no se re-muestra.
3. Completar una lección sin cerrar capítulo → no se muestra nada.
4. Cerrar el último capítulo con los otros 5 al 100% → `_showCelebration('diploma', …)`
   y **no** la card normal; `diplomaShown = true`.
5. `diplomaShown = true` → no se re-muestra el diploma.
6. Guard de migración: estado sin `celebratedChapters` no revienta.

Estáticos:
7. Confetti tras guard `matchMedia` reduced-motion (regex sobre `js/app.js`).
8. `escapeHtml` aplicado al nombre en `_showCelebration`.
9. Markup: `#celebration-modal` con `role="dialog"`, `aria-modal`, `aria-labelledby`.
10. Rama Escape del modal en el keydown delegado.
11. CSS: reglas ancladas a `/\.celebration-card \{/` (nunca `includes()` — lección
    N19/N21) y orden: sección de celebración **antes** del tier ≤768.
12. CTA primario del modal usa `--primary-dark` (no `--primary`).

La paridad ES/EN de las claves nuevas la cubre el check de i18n existente.

### Manual (pre-cierre, en local)

- `node scripts/verify-runtime.js` + hook de pre-commit.
- `node scripts/validate-responsive.js` (Playwright) — y valorar añadirle un check del
  modal a 320/375/414px si el coste es bajo (opcional, no bloqueante).
- Prueba real en `python -m http.server 8000` con el usuario de pruebas
  (hahomi5121@kierko.com): completar un capítulo → card; completar los 6 → diploma con
  confetti; verificar una-sola-vez tras recargar; ambos temas; ES/EN; móvil (device
  toolbar); reduced-motion (emulación en DevTools).

## Despliegue

**Sin deploy a producción en esta fase.** Jorge revisa en local primero; `vercel
deploy --prod` solo tras su OK explícito (y entonces mismo procedimiento de siempre:
árbol limpio y commiteado). `privacy.html` no se toca (sin proveedores ni datos
nuevos).

## Fuera de alcance

- Re-visualizar el diploma desde Logros/Progreso (descartado en brainstorming;
  posible follow-up).
- Focus-trap de Tab en modales (paridad con avatar-modal, leftover global).
- Logro/badge de gamificación nuevo ligado al diploma (ya existe el logro de
  curriculum completo; no se duplica).
