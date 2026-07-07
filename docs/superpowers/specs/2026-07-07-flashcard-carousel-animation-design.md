# Diseño — Animación de carrusel en la navegación de Flashcards

**Fecha:** 2026-07-07
**Autor:** Jorge + Claude
**Estado:** Aprobado (pendiente revisión de spec por usuario)

## Objetivo

Hoy, al navegar entre flashcards con las flechas ← / → (`js/app.js`, `App.nextFlashcard()` /
`App.prevFlashcard()`), el contenido de la card cambia instantáneamente — no hay ninguna
transición, a diferencia del flip pregunta/respuesta que sí anima (rotación 3D de 0.5s en
`.flashcard-inner`). Se pide añadir una animación tipo carrusel: la card actual sale hacia un
lado y la siguiente entra desde el lado contrario, con la dirección determinada por qué flecha
se ha clicado.

## Comportamiento esperado

- **Flecha derecha (siguiente):** la card actual sale por la **izquierda**; la nueva card entra
  desde la **derecha**.
- **Flecha izquierda (anterior):** espejo — la card actual sale por la **derecha**; la nueva
  entra desde la **izquierda**.
- Movimiento **sutil** (~50px) combinado con fade — la card nunca sale completamente de la
  vista. Se descarta un carrusel "de ancho completo" (como un slider de imágenes clásico) por
  ser más código, más riesgo de overflow horizontal/responsive, y desproporcionado frente al
  resto de transiciones sutiles ya existentes en el campus (p. ej. el flip de 0.5s, los
  `hover: translateY(-2px)` en cards de la app).
- **Límites del mazo** (flecha izquierda en la primera card, flecha derecha en la última): sin
  cambios — el clic no hace nada, igual que hoy (`nextFlashcard`/`prevFlashcard` ya guardan este
  caso comprobando `fcIndex`).
- El **flip** (clic en la card para ver la respuesta, `App.flipFlashcard()`) no cambia. Sigue
  siendo la rotación 3D existente en `.flashcard-inner`. La animación de carrusel se aplica al
  elemento padre `.flashcard`, así que ambas transiciones son independientes (transforman
  elementos distintos) y no interfieren entre sí.
- `App.rateFlashcard(rating)` ya llama internamente a `this.nextFlashcard()` tras registrar la
  puntuación — al animar `nextFlashcard()`, calificar una card (Difícil/Regular/Fácil) hereda
  automáticamente la misma animación de salida, sin lógica adicional.

**Explícitamente fuera de alcance:** `shuffleFlashcards()` (botón "Mezclar") y el cambio de
mazo vía `<select id="flashcardDeck">` (que dispara `initFlashcards()`) no llevan esta
animación. Son un reinicio de la sesión de repaso, no una navegación secuencial entre cards
adyacentes — mantienen el render instantáneo actual.

## Mecanismo técnico

Toda la lógica vive en `js/app.js` (sección `/* ===== FLASHCARDS ===== */`) y `css/styles.css`
(sección `/* ===== FLASHCARDS ===== */`). No se tocan `index.html` ni ningún otro módulo.

1. **Salida:** al clicar una flecha, se aplica a `#flashcard` una transición
   `transform: translateX(±50px); opacity: 0` (250ms, easing consistente con el resto del
   sitio).
2. **Swap de contenido:** cuando esa transición termina (`transitionend`), se ejecuta la
   actualización real — incrementar/decrementar `this.fcIndex` y llamar a la
   `renderFlashcard()` existente (sin cambios). Como esto ocurre mientras la card está en
   `opacity: 0`, el cambio de contenido (pregunta, tag de capítulo, contador, stats) es
   invisible para el usuario — ningún salto visual.
3. **Entrada:** inmediatamente después del swap, la card se "teleporta" sin transición a la
   posición opuesta (offset contrario + `opacity: 0`), se fuerza un reflow síncrono
   (`void el.offsetWidth`) para que el navegador registre esa posición de partida, y a
   continuación se reactiva la transición hacia `translateX(0) / opacity: 1`. El resultado
   visual es el de una card entrando desde el lado contrario al que salió la anterior.
4. **Guard de reentrancia:** un flag de instancia (`this._fcAnimating`) evita que clics
   rápidos repetidos en las flechas interrumpan o solapen animaciones a medias. Mientras el
   flag esté activo, `nextFlashcard()`/`prevFlashcard()` ignoran el clic (igual que ya ignoran
   los clics en los límites del mazo).
5. Los estilos inline de transición se limpian (`element.style.transition = ''`) al terminar
   la animación de entrada, para no dejar residuos que interfieran con otros estados del
   elemento (p. ej. si en el futuro se le añaden más transiciones).

No se usan librerías externas ni Web Animations API — mismo estilo que el resto del proyecto
(vanilla JS + CSS transitions, ya usado en el propio flip).

## Testing / verificación

No hay suite de tests automatizados para comportamiento visual en este proyecto (ver
`CLAUDE.md` → "No Tests, No Linter"). La verificación será manual en navegador:

- Navegar varias cards adelante y atrás, confirmando dirección correcta de salida/entrada en
  cada flecha.
- Clicar rápido y repetidamente una flecha para confirmar que el guard de reentrancia evita
  animaciones solapadas o estados visuales rotos.
- Confirmar que calificar una card (Difícil/Regular/Fácil) anima igual que clicar "siguiente".
- Confirmar que en la primera/última card, la flecha correspondiente sigue sin hacer nada.
- Confirmar que el flip pregunta/respuesta se sigue viendo igual (sin interferencia de la
  nueva animación).
- Repetir en móvil (breakpoint `≤768px`, `.flashcard { width: 100%; }`) para descartar overflow
  horizontal por el desplazamiento de 50px en pantallas estrechas.
