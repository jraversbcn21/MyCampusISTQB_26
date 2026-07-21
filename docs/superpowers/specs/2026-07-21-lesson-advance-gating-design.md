# Bloqueo del avance de lección hasta completarla — Diseño

**Fecha:** 2026-07-21 (misma tarde del despliegue de la ronda anterior)
**Estado:** aprobado, pendiente de plan de implementación
**Origen:** feedback del usuario tras probar en móvil y desktop la feature del botón
"Siguiente lección" desplegada esta mañana (spec
`2026-07-21-lesson-next-button-and-mobile-fab-design.md`).

## Problema

La ronda anterior hizo que "Siguiente lección" **completara y avanzara en un clic**
(`completeAndAdvance`), decisión tomada en brainstorming. Probada en dispositivo real, el
usuario la revocó: el estudiante puede avanzar sin haber marcado la lección y recibe el XP
como efecto colateral, lo que vacía de sentido el botón "Marcar como completada" y el acto
deliberado de cerrar una lección.

**Regla nueva:** "Siguiente lección" solo navega, y solo si la lección ya está marcada como
completada. El XP y el completado viven exclusivamente en "Marcar como completada".

## Decisiones (tomadas con el usuario)

| Decisión | Elegido | Descartado |
|---|---|---|
| Comportamiento sin completar | **Atenuado + toast al clicar**: el botón se ve bloqueado antes de intentar, y explica el porqué al intentarlo | Solo toast (no se ve el bloqueo hasta clicar); `disabled` real (ni enfocable ni explica — el peor en accesibilidad) |
| Icono de candado | **No** — la atenuación comunica el estado; añadir un símbolo al sprite sería scope creep | `#i-lock` en el sprite (posible después si se echa en falta) |
| Etiqueta de última lección | **"Completar capítulo" se queda** — con la nueva semántica es literal: el capítulo se completa al marcar su última lección | Renombrarla |

**Nota histórica deliberada:** la sección "Lesson Flow & Mobile FAB (2026-07-21)" de
`CLAUDE.md`/`AGENTS.md` documenta la semántica vieja como "decisión de producto". Esta
revocación debe quedar registrada en esas mismas secciones para que un agente futuro no
"restaure" el completar-y-avanzar creyéndolo la intención vigente.

## Diseño

### `js/app.js`

**`completeAndAdvance(topicId, chapterId, xp, nextTopicId)` → `advanceLesson(topicId, chapterId, nextTopicId)`.**
Ya no recibe `xp` ni llama a `completeLesson`. Guard al frente:

```js
if (!this.state.completedLessons.includes(topicId)) {
  this.showToast(i18n.t('lesson_next_locked_toast'), 'warning');
  return;
}
```

Si pasa: `navigateToLesson(chapterId, nextTopicId)` o `navigate('curriculum')` si
`nextTopicId` es `null`, con el `scrollTo(0, 0)` guardado por `typeof` cubriendo ambas
ramas (sin cambios respecto a hoy).

El toast `warning` reutiliza el patrón existente del bloqueo de búsqueda en examen
(`js/app.js:1327`, gate `N11`) y es `aria-live` asertivo desde la ronda 2 — un lector de
pantalla anuncia el aviso sin trabajo extra.

**`renderLesson()`:** el botón primario gana `id="nextLessonBtn"` y, si la lección no está
completada, la clase `locked` y `aria-disabled="true"`. Nunca el atributo `disabled`: el
botón sigue enfocable y clicable para poder explicar el porqué.

**`completeLesson()`:** además de actualizar `#completeLessonBtn` in place (como hoy),
desbloquea `#nextLessonBtn` in place — quita `locked` y `aria-disabled`. Sin re-render
completo, sin perder la posición de scroll.

### `css/styles.css`

`.lesson-next-btn.locked { opacity: 0.55; cursor: not-allowed; }`, junto a la regla base de
`.lesson-next-btn`. Sin `pointer-events: none` (mataría el toast). WCAG 1.4.3 exime del
ratio AA a los controles marcados inactivos (`aria-disabled`), así que la atenuación es
legítima; el estado activo conserva el 5.83:1 de `--primary-dark` intacto.

### `js/i18n.js`

Una clave nueva, ES/EN emparejada — `TRANSLATIONS` pasa de **177 a 178**:

- `lesson_next_locked_toast` — "Marca la lección como completada para avanzar" /
  "Mark the lesson as complete to continue"

### Casos

- **Lección ya completada** (visitada de nuevo): botón activo desde el primer render;
  avanzar jamás re-otorga XP (sin cambios).
- **Última lección del capítulo:** mismo guard; "Completar capítulo" navega al curriculum
  solo si la lección está marcada.
- **Cambio de idioma sobre la lección:** `setLang` re-renderiza la vista (mecanismo
  existente), así que etiqueta y estado `locked` se regeneran coherentes.

## Verificación

**Los checks `N21` afectados se reescriben, no se parchean:** hoy afirman que
`completeAndAdvance` delega en `completeLesson` — exactamente lo contrario de la nueva
semántica. Tras el cambio deben afirmar:

1. `advanceLesson` existe, **no** llama a `completeLesson`, y contiene el guard
   (`completedLessons.includes` + `showToast` + `return`).
2. El template de `renderLesson` cablea el primario a `App.advanceLesson` y emite
   `locked`/`aria-disabled` condicionales.
3. `completeLesson` desbloquea `#nextLessonBtn` (quita clase y atributo).
4. `lesson_next_locked_toast` definida en ES y EN.
5. CSS: existe `.lesson-next-btn.locked` con `opacity` y `cursor: not-allowed`, antes del
   bloque reduced-motion (con guard de presencia, como los demás).

El resto de la familia `N21` (FAB, colchón, cascada) no se toca. Gates completos tras el
cambio: los cuatro validadores Node + `validate-responsive.js` (Chromium real) + prueba
manual del flujo bloqueado/desbloqueado en móvil.

## Documentación

- `CLAUDE.md` y `AGENTS.md`: actualizar la sección "Lesson Flow & Mobile FAB (2026-07-21)"
  — semántica nueva, renombrado del método, la revocación registrada como tal, conteo
  177 → 178.
- `privacy.html`: sin cambios.

## Fuera de alcance

- Icono de candado en el sprite.
- Cualquier cambio en el botón "Marcar como completada" más allá del desbloqueo in place.
- El wrap de etiquetas en 481–768px (deuda aceptada de la ronda anterior, sin relación).
