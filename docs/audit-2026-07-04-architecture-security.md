# Auditoría de arquitectura y seguridad — 2026-07-04

Auditoría técnica de MyCampusISTQB_26 (SPA vanilla JS, sin build, sin tests
automatizados salvo dos validadores de contenido) enfocada en: drift entre
`AGENTS.md`/`CLAUDE.md` y el código real, riesgos específicos del stack
(XSS, acoplamiento por globals, ausencia de red de seguridad, orden de carga
de scripts, proceso de repo sin CI/PR), duplicación real de código, e i18n.

Todos los hallazgos de esta auditoría fueron remediados el mismo día
(commits `2e5f721`…`6897b1a` en `master`). Esta tabla es el registro de qué
se encontró, qué severidad tenía y cómo quedó cerrado — no un backlog
pendiente.

## Cómo se verificó

Cada fix se verificó con evidencia, no solo con lectura de código:
- `node --check` en todos los módulos tocados.
- Los dos validadores de contenido (`scripts/validate-questions.js`,
  `scripts/validate-content.js`) en verde tras cada cambio.
- Para los fixes de comportamiento (carrera de refocus en `auth.js`, XSS del
  avatar, guarda de scripts faltantes), un arnés de Playwright ad-hoc
  (Chromium real, `window.supabase` mockeado, sin credenciales ni red reales)
  que reproduce el bug contra el código **anterior** al fix (vía `git stash`)
  y confirma que el mismo test falla sin el fix y pasa con él. El arnés vivió
  en un scratchpad de sesión, no se commiteó — no es parte del repo.
- Para i18n (P5): recorrido de las 8 vistas + pantalla de login + onboarding
  + selector de avatar en ES y EN, comprobando ausencia de residuos del otro
  idioma.

## Drift doc-vs-código encontrado

| # | Afirmación del doc | Realidad encontrada | Resolución |
|---|---|---|---|
| D1 | CLAUDE.md: *"all UI strings go through i18n"* | Falso: `onboarding.js`, `avatar.js` y la pantalla de auth eran 100% español hardcodeado; ~35 ternarios `i18n.lang === 'es' ? … : …` en `app.js` evadían `TRANSLATIONS` | **Cerrado (P5, `6897b1a`)** — la afirmación ahora es literalmente cierta; 152 claves i18n, todas ES/EN pareadas |
| D2 | — | 11 claves i18n definidas pero nunca usadas (huérfanas) | **Cerrado (P5)** — 4 reutilizadas ajustando texto al ya mostrado, 7 eliminadas por no tener hueco real sin inventar features |
| D3 | *"Offline / graceful degradation… falls back silently"* | Si el CDN de `supabase-js` no cargaba, `const { createClient } = window.supabase` lanzaba un `TypeError` no capturado al parsear `auth.js`, dejando la app entera muerta sin mensaje | **Cerrado (P2, `2e5f721`)** — guarda `if (window.supabase)`, mensaje claro vía `_showLoadFailure()` |
| D4 | Logro *"Currículo Completo"* = *"completa todas las lecciones"* | Umbral hardcodeado en 16, fósil de antes de que Phase 2 expandiera el currículo a 22 lecciones | **Cerrado (P3, `601122f`)** — `CHAPTERS.reduce(...)` calculado, no literal |
| D5 | Glosario cubre capítulos 1–6 | El mapa de etiquetas de capítulo en `app.js` (`renderGlossary`) no incluía `'6'` — el término de automatización de pruebas se mostraba sin etiqueta | **Cerrado (P3)** |
| D6 | Ch.6 lesson: *"tool adoption considerations"* purgado en Phase 2 (no es concepto v4.0) | La **descripción** del capítulo (no la lección) seguía mencionándolo — Phase 2 no tocó `description`, solo `LESSONS` | **Cerrado (P3)** — reescrita reutilizando el contenido ya validado (§6.1/§6.2) |

## Riesgos por severidad

### Alto

- **Carrera de refocus en `auth.js`** — `supabase-js` puede re-emitir
  `SIGNED_IN` para el mismo usuario al recuperar el foco de la pestaña
  (refresh de token). El código pisaba `App.state` con la copia de la nube
  (pérdida de XP no sincronizado, <4s de debounce) y re-navegaba la vista
  actual, cortando un examen en curso. **Cerrado (P2)** — guarda
  `sameUserAlreadyLoaded`; verificado: sin el fix, XP se resetea a 0 y el
  examen se cierra; con el fix, ninguno de los dos ocurre.
- **Ausencia de gate mecánico** — los validadores de contenido solo corrían
  si alguien se acordaba de ejecutarlos manualmente; nada bloqueaba un commit
  que los rompiera. **Cerrado (P1)** — hook `.git/hooks/pre-commit` (ver
  advertencia de alcance más abajo).

### Medio

- **XSS vía `avatar_url`** — `user_metadata.avatar_url` (editable por el
  propio usuario vía `updateUser()`) se interpolaba en `innerHTML` sin
  escapar; un valor como `x" onerror="…"` rompía el atributo `src` e
  inyectaba un handler ejecutable. **Cerrado (P2)** — `createElement('img')`
  + `.src` en vez de template string; verificado con el mismo payload:
  el canario de ejecución se disparaba en el código viejo y no en el nuevo.
- **`localStorage.setItem` sin `try/catch`** en dos rutas de guardado
  (`app.js`, `sync.js`), a diferencia del resto del código — un quota lleno
  o modo privado abortaba silenciosamente la acción que lo disparó.
  **Cerrado (P3)**.
- **`examHistory` sin cota** — crecía indefinidamente, a diferencia de
  `activityLog` (capado a 20). **Cerrado (P3)** — cap a 50.
- **Sin red de seguridad ante fallo de carga de un `<script>`** — si un
  módulo fallaba (bloqueado, 404, reorden que introdujera una dependencia
  real), `App.init()` reventaba con un `ReferenceError` no capturado a mitad
  de un render, sin explicación. **Cerrado (P6)** — guarda en
  `_onAuthSuccess()` que verifica los globals esperados y muestra un mensaje
  claro; verificado bloqueando `content.js` con Playwright: antes,
  `ReferenceError: CHAPTERS is not defined` sin capturar; después, mensaje
  limpio y sin excepción.

### Bajo

- **Duplicación real en el arnés de validadores** — `eval` vs `new Function`
  para cargar los globals de navegador desde Node, el regex `FL-x.y.z`
  copiado dos veces, el mismo bucle de chequeo bilingüe repetido 4 veces.
  **Cerrado (P4)** — `scripts/lib/validate-utils.js`; verificado con salida
  byte-idéntica entre el validador viejo y el nuevo, en datos reales y en
  5 clases de error inyectadas en copias aisladas.

## Duplicación identificada (no la ya documentada como intencional)

La separación `validate-content.js`/`validate-questions.js` como *entry
points* sigue siendo correcta (formas de datos distintas, documentado así a
propósito en `AGENTS.md`). Lo que estaba duplicado era el arnés alrededor:
carga de globals, regex de LO, chequeo bilingüe, patrón de reporte de
errores — consolidado en `scripts/lib/validate-utils.js` sin tocar los datos
ni fusionar los validadores.

## Advertencias de alcance (leer antes de asumir que algo está "resuelto del todo")

- **El hook de P1 no está versionado.** Vive en `.git/hooks/pre-commit`,
  fuera del árbol de trabajo — un clon nuevo del repo **no lo hereda
  automáticamente**. Si se quiere que sea compartido, hay que moverlo a un
  directorio versionado (`.githooks/`) y activar `core.hooksPath`, lo cual
  no se hizo porque implica tocar `git config` y no se pidió explícitamente.
- **La guarda de P6 no valida el orden de scripts en sí** — se comprobó que
  reordenar los `<script>` actuales (todos síncronos, sin `defer`/`async`)
  no rompe nada hoy, porque `DOMContentLoaded` no dispara hasta que todos ya
  ejecutaron. El riesgo real es que un script **falle** por completo
  (bloqueado, 404), no que cambie de posición — la guarda cubre ese caso.
- **P5 tradujo contenido de producto (UI copy), no contenido ISTQB.** La
  regla de sourcing del proyecto ("nunca inventar contenido examinable")
  no aplica a textos de onboarding/avatar/auth — son copy de producto, no
  material de examen.

## Qué no se tocó (fuera de alcance de esta pasada)

- El ternario redundante `card.lang === 'es' ? 'es' : 'en'` en
  `App._handleTTS` (equivale a `card.lang` directamente) — no es
  duplicación de texto de usuario, es un detalle de código menor, dejado
  fuera para no ampliar el diff más allá de lo pedido.
- Mover el hook de P1 a un directorio versionado + `core.hooksPath` — ver
  advertencia de alcance arriba.
