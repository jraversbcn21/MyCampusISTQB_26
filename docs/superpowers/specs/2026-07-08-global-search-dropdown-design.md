# Diseño — Dropdown de resultados en el buscador global (topbar)

**Fecha:** 2026-07-08
**Autor:** Jorge + Claude
**Estado:** Aprobado (pendiente revisión de spec por usuario)

## Problema

El buscador global del topbar (`#globalSearch`, `index.html`) hoy **navega forzosamente** en
cada pulsación de tecla (listener `input` en `js/app.js:1161-1193`, no al pulsar Enter):

1. Con más de 2 caracteres, si la consulta coincide con un término o definición del
   `GLOSSARY`, copia el texto a `#glossarySearch` y ejecuta `App.navigate('glossary')` —
   el usuario es expulsado de la vista en la que estaba (dashboard, flashcards, curriculum…)
   mientras aún está escribiendo.
2. Si no hay match en glosario pero sí en títulos de `CHAPTERS`/topics, navega a
   `curriculum` **sin filtrar ni resaltar nada** — el usuario llega a la lista completa y
   tiene que encontrar la coincidencia por su cuenta.
3. Si no coincide nada: silencio total, cero feedback.

Problemas concretos, por gravedad:

- **Bug colateral con el simulador:** si hay un examen en curso y el usuario teclea en el
  buscador, es sacado a glosario; al volver a "Simulador", `App.navigate('simulator')` llama
  a `renderSimulatorMenu()` (`js/app.js:142`), que oculta `#examMode` y repinta el menú —
  la pantalla del examen en curso se pierde. El buscador global es hoy una vía para romper
  un examen sin querer.
- **Navegación sin consentimiento:** el usuario que solo quiere consultar una palabra pierde
  su contexto. Además la vista forzada se persiste vía `_saveCurrentView()`, así que hasta
  al recargar la página reaparece en glosario.
- Se dispara a mitad de palabra (con "tes" ya navegó) y el caso "sin resultados" no da
  ningún feedback.

## Solución elegida

Un **dropdown de resultados** anclado bajo el buscador — el patrón estándar de búsqueda
global. El usuario consulta sin moverse de su vista; solo navega si hace clic explícito en
una acción que navega. Se descartaron dos alternativas: (B) mantener el salto de vista pero
solo al pulsar Enter — barato, pero el usuario sigue perdiendo su contexto y curriculum
sigue sin mostrar qué coincidió; (C) dejarlo como está — descartada por todo lo anterior.

## Comportamiento esperado

### Apertura y cierre

- Al escribir **más de 2 caracteres** en `#globalSearch`, se abre un panel desplegable
  anclado bajo `.search-box`. **Nunca se navega automáticamente**: se elimina por completo
  el `navigate('glossary')`/`navigate('curriculum')` del listener actual, y el buscador
  global deja de escribir en `#glossarySearch` por su cuenta.
- El panel se cierra con **Escape**, con **clic fuera** del panel/buscador, o cuando la
  consulta queda en ≤2 caracteres.
- **Solo escritorio:** en ≤768px `.search-box` ya está oculto por CSS
  (`css/styles.css:1278`) — no hay comportamiento móvil que diseñar.

### Contenido del panel

Dos secciones, cada una con encabezado propio (keys i18n nuevas):

- **Glosario:** hasta **5 términos** cuyo `term[i18n.lang]` o `def[i18n.lang]` contengan la
  consulta (misma lógica de match que hoy). Cada resultado muestra el término y su
  definición **recortada a ~2 líneas** (CSS `line-clamp`).
- **Contenido:** hasta **3 resultados** de `CHAPTERS` — capítulos cuyo título coincida o
  topics cuyo título coincida — mostrando icono del capítulo + título del topic (o del
  capítulo).
- Si ninguna sección tiene resultados: mensaje "sin resultados" (key i18n nueva).

### Interacción con los resultados

- **Clic en un término de glosario → expande in situ.** La definición completa se muestra
  dentro del propio dropdown (quitando el recorte), sin salir de la vista actual — el caso
  de uso principal: consultar una palabra desde el dashboard sin moverse. Debajo de la
  definición expandida aparece un enlace **«Ver en glosario»** que sí navega: rellena
  `#glossarySearch` con la consulta y llama a `App.navigate('glossary')` (única situación
  en la que el buscador global toca `#glossarySearch`). Clic de nuevo en el término lo
  vuelve a colapsar.
- **Clic en un resultado de Contenido → `App.navigateToLesson(chapterId, topicId)`**,
  directo a la lección (mejora sobre hoy, que dejaba al usuario en la lista sin filtrar).
  Para un match a nivel de capítulo (título del capítulo, no de un topic concreto), se
  navega al primer topic del capítulo.
- Tras cualquier navegación desde el dropdown: se cierra el panel y se limpia
  `#globalSearch`.

### Guard de examen en curso

- Nuevo flag explícito **`App._examActive`**: se pone a `true` en `launchExam()` y a
  `false` en `finishExam()`. Es más fiable que inspeccionar `examTimer` (los exámenes de
  capítulo no tienen límite de tiempo y no dependen del interval) o que inspeccionar el DOM.
- Si `_examActive` es `true` y el usuario pulsa una acción del dropdown **que navega**
  («Ver en glosario» o un resultado de Contenido), no se navega: se muestra un toast
  («Termina o abandona el examen primero», key i18n nueva) vía el `showToast()` existente.
- Consultar definiciones expandiéndolas en el dropdown sigue funcionando durante un examen
  — no navega, no hay riesgo.

## Mecanismo técnico

- **`index.html`:** contenedor `#globalSearchResults` dentro de `.search-box`, inicialmente
  `style="display:none"` (convención del proyecto para elementos ocultos de inicio).
- **`css/styles.css`:** estilos del panel — `position: absolute` respecto a `.search-box`
  (que pasa a `position: relative`), ancho ≥ el del input, `z-index` por encima del
  contenido de la vista, tema claro/oscuro vía las variables CSS existentes
  (`--surface`/`--border`/`--text`…), scroll interno con `max-height` si hay muchos
  resultados, `line-clamp` para el recorte de definiciones.
- **`js/app.js`:**
  - Nuevo helper `App._renderGlobalSearch(q)` que construye el HTML del panel a partir de
    `GLOSSARY` y `CHAPTERS`, y reemplazo del cuerpo del listener `input` actual.
  - Listeners nuevos: `keydown` (Escape) en el input, `click` en `document` para el cierre
    por clic fuera, delegación de clics dentro del panel (expandir/colapsar término,
    «Ver en glosario», resultado de lección).
  - Estado de expansión: qué término está expandido se guarda en un campo de instancia
    (p. ej. `App._gsExpanded`), se resetea en cada re-render de la consulta.
  - `App._examActive` en `launchExam()`/`finishExam()` + el guard en las acciones que
    navegan.
- **Seguridad (XSS):** el contenido interpolado en el panel procede de `GLOSSARY`/`CHAPTERS`
  (datos estáticos del repo, no estado del usuario). La consulta del usuario **no se
  interpola en HTML** — sin resaltado de coincidencias en v1, precisamente para no abrir
  superficie `innerHTML` nueva (regla del audit 2026-07-04). Si en el futuro se añade
  resaltado, debe pasar por `escapeHtml()`.
- **`js/i18n.js`:** ~5 keys nuevas, ES/EN pareadas (encabezado sección glosario, encabezado
  sección contenido, «Ver en glosario», «sin resultados», toast del guard de examen). La
  paridad la exige ya `scripts/verify-runtime.js`.
- Sin librerías externas, sin navegación por flechas de teclado en v1 (YAGNI) — vanilla JS
  + CSS, mismo estilo que el resto del proyecto.

**Explícitamente fuera de alcance:** el buscador interno del glosario (`#glossarySearch`)
no cambia; el contador de logro `glossarySearches` no se toca (las búsquedas del dropdown
no cuentan para el logro de glosario — solo las hechas en la propia vista, como hoy);
no hay búsqueda sobre `FLASHCARDS` ni `QUESTIONS`; no hay versión móvil.

## Testing / verificación

Checks nuevos en `scripts/verify-runtime.js` (regla del proyecto: cada comportamiento
runtime arreglado se vuelve re-verificable), ejercitando el módulo real contra el DOM
mockeado:

- Teclear >2 caracteres en `#globalSearch` **ya no cambia** `App.currentView` ni escribe en
  `#glossarySearch`.
- El panel se abre con match de glosario, con match de curriculum, y muestra el mensaje
  vacío sin matches; se cierra al bajar a ≤2 caracteres.
- «Ver en glosario» navega a glosario **y** aplica el filtro; un resultado de Contenido
  llama a `navigateToLesson` con los ids correctos.
- Con `_examActive = true`, las acciones que navegan quedan bloqueadas
  (`currentView` no cambia) y se emite el toast; `launchExam()`/`finishExam()`
  activan/desactivan el flag.
- Ningún valor derivado del input del usuario acaba en el `innerHTML` del panel.

Verificación manual en navegador (escritorio, tema claro y oscuro, ES y EN): posición y
solapamiento del panel sobre cada vista, expansión/colapso de definiciones, cierre por
Escape/clic fuera, y el flujo completo durante un examen en curso.
