# Botón "Siguiente lección" + FAB del café en móvil — Diseño

**Fecha:** 2026-07-21
**Estado:** aprobado, pendiente de plan de implementación
**Origen:** dos defectos de usabilidad reportados por el usuario sobre dispositivo real
(capturas de desktop y de móvil), tras la ronda de adaptabilidad móvil del mismo día.

## Problema

**1. No hay forma de avanzar a la siguiente lección.** Al terminar una lección, la barra
inferior ofrece solo "← Volver al curriculum" y "Marcar como completada". Para continuar
estudiando el alumno debe volver al curriculum, localizar el capítulo y abrir el siguiente
tema. El flujo natural de estudio —leer, completar, continuar— cuesta tres interacciones y
un cambio de contexto.

Además, el "Volver al curriculum" está **duplicado**: ya existe uno arriba, en `.lesson-nav`
(`index.html:342`), junto a la barra de progreso del capítulo.

**2. El pill "Invítame un café" solapa los botones de la lección en móvil.** El FAB es
`position: fixed` abajo-derecha y, con su texto, mide ~200px de ancho. En la vista de
lección tapa parcial o totalmente el botón "Marcar como completada" / "✓ Completada", que
está alineado a la derecha. Confirmado en la captura del usuario (iPhone, producción).

## Decisiones de diseño

Todas tomadas con el usuario durante el brainstorming:

| Decisión | Elegido | Descartado |
|---|---|---|
| Semántica del botón nuevo | **Completar y avanzar** en un solo clic | Solo avanzar sin completar |
| Fin de capítulo | **Parar**: el primario pasa a "Completar capítulo" y vuelve al curriculum | Saltar al primer tema del capítulo siguiente |
| Solape del FAB | **Icono-solo en móvil + colchón inferior** en la lección | Arrastrable; ocultar el FAB en la lección |
| Barra inferior | **Dos botones**, quitando el "Volver" duplicado | Mantener los tres |
| Color del primario | **`--primary`** | Verde (se confundiría con el estado "completada") |
| Alcance del colchón | **Solo `.lesson-actions`** | Extenderlo a las demás vistas |

El **arrastrable** se descartó explícitamente: exige JS de drag, persistencia de posición y
deja sin salida a quien navega con teclado (no hay gesto de arrastre con Tab), lo que
rompería la línea de accesibilidad del repo.

## Mejora 1 — Botón "Siguiente lección"

### Layout

`renderLesson()` (`js/app.js:432-439`) pasa de tres a dos acciones:

```
[✓ Marcar como completada]              [Siguiente lección: 1.2 ¿Por qué…? →]
```

- Primario a la derecha (convención LTR), fondo `--primary`.
- Secundario a la izquierda: el botón de completar existente, conservando su estado verde
  "✓ Completada" como indicador visual.
- Se elimina el `← Volver al curriculum` de `.lesson-actions`. Sigue disponible arriba, en
  `.lesson-nav`, que no se toca.

En la **última lección del capítulo** el primario pasa a `[Completar capítulo →]` y navega
a `curriculum`.

### Lógica

Nuevo método `App.completeAndAdvance(topicId, chapterId, xp, nextTopicId)`:

1. Delega en `completeLesson(topicId, chapterId, xp)` — XP, logros, `saveState()`, sin
   duplicar nada de esa lógica.
2. Si `nextTopicId` existe → `navigateToLesson(chapterId, nextTopicId)`.
   Si no → `navigate('curriculum')`.

El siguiente tema se calcula por el índice del topic dentro de `ch.topics`, en
`renderLesson()`. **No se edita `js/content.js`** — la regla de fidelidad de contenido queda
intacta.

`completeLesson()` es idempotente (comprueba `includes(topicId)` antes de añadir), así que
pulsar el primario en una lección ya completada avanza sin re-otorgar XP.

**Riesgo anotado para la implementación:** `completeLesson()` escribe sobre
`#completeLessonBtn` (`textContent` + `classList`) justo antes de que naveguemos y
regeneremos el DOM. Es inofensivo —el nodo se descarta— pero conviene verificarlo en vez de
asumirlo.

### Móvil

En ≤480px se oculta el título del siguiente tema; el botón queda `Siguiente lección →`.
Motivo: truncado con ellipsis se lee mal (`Siguiente lección: 1.2 ¿Por qué es n…`). Se
implementa con un `<span>` interno para el título y una regla `display: none` en el tier
480, no con `text-overflow`.

`.lesson-actions` ya tiene `flex-wrap: wrap; gap: 12px` en el tier 480 (ronda móvil del
2026-07-21), así que los dos botones apilan solos si no caben.

### i18n

Dos claves nuevas, ES/EN emparejadas:

- `lesson_next` — "Siguiente lección" / "Next lesson"
- `lesson_finish_chapter` — "Completar capítulo" / "Finish chapter"

`TRANSLATIONS` pasa de **175 a 177 keys**. Hay que actualizar el conteo en `CLAUDE.md` y en
`AGENTS.md`, que hoy dicen 175.

Se reutilizan las existentes `lesson_complete` ("Marcar como completada") y
`lesson_completed` ("✓ Completada").

## Mejora 2 — FAB del café en móvil

### Icono-solo en ≤768px

```css
.bmc-fab { padding: 0; width: 48px; height: 48px; border-radius: 50%; justify-content: center; }
.bmc-fab span { display: none; }
```

- 48px cumple el mínimo de 44px de touch target (I3).
- Contraste sin cambios: `--primary-dark` + `#fff` = 5.83:1 (AA). El icono usa
  `currentColor`, por eso el `color: #fff` explícito sigue siendo necesario.
- El pill con texto se mantiene **intacto en desktop**.

### Accesibilidad

Al ocultar el texto, el `<a>` se quedaría sin nombre accesible. Se le añade
`data-i18n-aria="bmc_label"` — el cuarto mecanismo de atributos i18n del repo
(`js/i18n.js:429-432` hace `el.setAttribute('aria-label', t(key))`).

**Verificado contra el gate `N19`:** su check de la línea 941 prohíbe
`/<a class="bmc-fab"[^>]*\sdata-i18n=/`, que exige el `=` inmediatamente tras `data-i18n`.
`data-i18n-aria="…"` no coincide. **No hay que tocar el gate.**

### Por qué `.bmc-fab span` y no una clase

El check `N19` de la línea 940 exige literalmente `/<span data-i18n="bmc_label">/`, con el
`>` pegado a la comilla. Añadir `class="bmc-label"` al span —antes o después del
atributo— rompería ese regex y obligaría a modificar el gate. El selector descendente
`.bmc-fab span` logra lo mismo sin tocarlo. El FAB contiene un único `<span>`, así que la
ambigüedad del selector es teórica.

### Colchón inferior

`.lesson-actions` gana, dentro del bloque ≤768px:

```css
padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
```

72px = 48px del FAB + 24px de su offset inferior. El `env()` sigue el patrón
`calc(base + env(inset, 0px))` que el repo aplica a todo fijo de borde desde que el meta
viewport lleva `viewport-fit=cover`.

Esto garantiza que ni al final del scroll quede un botón bajo el FAB.

### Alcance deliberado

El colchón se aplica **solo a la lección**, que es lo reportado. Otras vistas con acciones
alineadas a la derecha al final del scroll podrían tener el mismo roce; queda fuera de
alcance por decisión explícita del usuario. Si aparece, se trata como defecto aparte.

## Orden en `css/styles.css`

El tail del fichero está ordenado a propósito: tier 480 → `(pointer: coarse)` →
reduced-motion → `:focus-visible` **literalmente último**. Ninguna regla de este diseño se
añade después del bloque reduced-motion; el check `N19` que asserta
`indexOf('.bmc-fab') < indexOf('@media (prefers-reduced-motion')` debe seguir pasando.

## Verificación

**Nueva familia `N21` en `scripts/verify-runtime.js`:**

1. `lesson_next` y `lesson_finish_chapter` definidas en ES y EN.
2. `renderLesson` emite el botón primario cableado a `App.completeAndAdvance`.
3. El bloque `.lesson-actions` **del template de `renderLesson`** ya no contiene un
   `onclick="App.navigate('curriculum')"` (el duplicado murió). El check debe acotarse a
   ese template, no a `js/app.js` entero: `completeAndAdvance` llama legítimamente a
   `navigate('curriculum')` al cerrar un capítulo, y un check global lo confundiría con el
   botón eliminado.
4. `completeAndAdvance` existe y delega en `completeLesson` (no duplica la lógica de XP).
5. El primario usa `--primary`, no el token de éxito.
6. CSS: el tier ≤768 reduce `.bmc-fab` a círculo y oculta su `span`.
7. CSS: `.lesson-actions` tiene el `padding-bottom` con `env(safe-area-inset-bottom)`.
8. Markup: el `<a class="bmc-fab">` lleva `data-i18n-aria="bmc_label"`.

**Gates existentes que deben seguir en verde:** los 8 checks `N19` (sin modificarlos), la
paridad i18n ES/EN, `validate-contrast.js`, `validate-content.js`,
`validate-questions.js`.

**Real-browser:** `node scripts/validate-responsive.js` antes del deploy, más verificación
manual en 320/375/414px de que (a) el primario avanza de lección, (b) en la última lección
del capítulo vuelve al curriculum, y (c) el FAB ya no solapa ningún botón.

## Documentación a sincronizar

- `CLAUDE.md`: sección nueva para esta ronda; conteo de `TRANSLATIONS` 175 → 177.
- `AGENTS.md`: entrada con los mecanismos (`completeAndAdvance`, el porqué de
  `.bmc-fab span`, el colchón) y el conteo de claves.
- `privacy.html`: **sin cambios** — el enlace saliente a Buy Me a Coffee no se altera, solo
  su presentación visual.

## Fuera de alcance

- Extender el colchón a otras vistas (decisión explícita del usuario).
- El glifo `✓` de texto en `lesson_completed`, que es un follow-up menor conocido de I8
  (glifos ✓/✗ estructurales fuera del alcance del sprite de iconos).
- Cualquier cambio en la navegación superior (`.lesson-nav`).
