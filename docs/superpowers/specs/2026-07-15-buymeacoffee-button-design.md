# Botón flotante "Invítame un café" (Buy Me a Coffee) — Diseño

**Fecha:** 2026-07-15
**Estado:** Aprobado (brainstorming), pendiente de plan de implementación
**Autor:** Jorge + Claude

## Objetivo

Monetizar de forma no intrusiva MyCampus ISTQB antes del soft launch en Vercel,
añadiendo un botón flotante que enlace a la página de donaciones del creador en
Buy Me a Coffee (`https://buymeacoffee.com/jorgeborn3m`). Es un modelo de
propinas/donación: sin gating de contenido, sin fricción, sin infraestructura de
pago propia (BMC gestiona el cobro íntegro).

## Enfoque elegido

**Opción A — enlace propio auto-alojado.** Un elemento `<a>` estilizado por
nosotros, **sin** el script/widget de terceros de Buy Me a Coffee.

Razones frente al widget oficial (Opción B, descartada):

- Evita añadir otra dependencia CDN de terceros, que en este repo exige el ritual
  de versión fija + hash SRI + degradación no-op (patrón Supabase/Sentry). El
  widget de BMC no encaja limpio en ese patrón.
- Control total sobre accesibilidad, i18n y theming — todos los gates del proyecto
  se cumplen sin fricción.
- Menor superficie de privacidad: solo un enlace saliente, sin script embebido ni
  cookies de terceros en nuestra página.

## Decisiones cerradas (brainstorming)

| Aspecto | Decisión |
|---------|----------|
| Ubicación | Pill flotante fijo abajo-derecha (`bottom: 24px; right: 24px`) |
| Contenido | Icono ☕ (SVG) + texto **siempre** visible |
| Texto | ES: "Invítame un café" · EN: "Buy me a coffee" |
| Visibilidad | Visible en toda la app; **oculto durante examen activo** (`_examActive`) |
| Color | `--primary` (morado de marca), texto blanco |
| Destino | `https://buymeacoffee.com/jorgeborn3m`, `target="_blank"`, `rel="noopener noreferrer"` |

## Diseño detallado

### 1. Markup (`index.html`)

- Un `<a class="bmc-fab" href="https://buymeacoffee.com/jorgeborn3m"
  target="_blank" rel="noopener noreferrer" data-i18n="bmc_label">` situado en el
  shell (fuera de `.main`, como hermano de `<aside class="sidebar">` / `<main>`),
  para que su `position: fixed` sea global a todas las vistas.
- Icono: nuevo símbolo `#i-coffee` (taza estilo Lucide) añadido al sprite SVG
  inline, usado como
  `<svg class="icon" aria-hidden="true"><use href="#i-coffee"/></svg>`.
  **Prohibido emoji como icono de UI** (gate `N17`).
- El texto visible del `<a>` es su nombre accesible → **no** necesita `aria-label`
  ni `data-i18n-aria` aparte.

### 2. Estilos (`css/styles.css`)

- `.bmc-fab`: pill fijo `position: fixed; bottom: 24px; right: 24px`, fondo
  `var(--primary)`, texto blanco, `border-radius` completo (pill), sombra suave,
  `z-index` **por debajo** de `.toast-container` (que es 1000).
- **Resolución del solapamiento con toasts:** `.toast-container` vive hoy en
  `bottom: 24px; right: 24px` (mismo rincón). Se sube su `bottom` a
  `calc(24px + <alto del pill> + 12px)` para que los toasts se apilen **encima**
  del botón en lugar de taparlo. Justificación: los toasts son transitorios y
  llevan `aria-live` (feedback importante) → ganan el rincón; el botón es
  permanente → cede el hueco.
- Ocultación en examen: `body.exam-active .bmc-fab { display: none; }`.
- Touch target ≥44px: cubierto por el tamaño natural del pill (icono + texto),
  reforzado en el bloque `@media (pointer: coarse)` existente si hiciera falta.
- Hover: leve `translateY` + sombra. Bajo `prefers-reduced-motion` el bloque
  global existente ya colapsa la transición a `0.01ms !important` — no se añade
  nada específico.
- **Restricción de orden del CSS:** el bloque `:focus-visible` debe seguir siendo
  literalmente la última regla del archivo. Cualquier CSS nuevo se inserta **antes**
  del bloque de reduced-motion / `:focus-visible` del final.

### 3. Lógica de examen (`js/app.js`)

`_examActive` se asigna en 5 sitios (líneas ~20, ~126, ~604, ~736, ~864). Para
centralizar el toggle de visibilidad:

- Introducir un helper mínimo `_setExamActive(active)` que hace
  `this._examActive = active` **y**
  `document.body.classList.toggle('exam-active', active)`.
- Reemplazar las asignaciones directas `this._examActive = ...` por
  `this._setExamActive(...)`. La inicialización del objeto (línea ~20,
  `_examActive: false`) puede quedarse como está (el body arranca sin la clase).
- Único punto de verdad; sin listeners por-elemento (coherente con la política del
  repo de no añadir key/transition listeners a elementos regenerados).

### 4. i18n (`js/i18n.js`)

- Nueva clave `bmc_label` → ES `"Invítame un café"`, EN `"Buy me a coffee"`.
- `TRANSLATIONS` pasa de **174 → 175 claves** (paridad ES/EN, verificada por
  `scripts/verify-runtime.js`).

### 5. Privacidad (`privacy.html`)

- Al ser solo un enlace saliente (sin script embebido ni cookies de terceros en
  nuestra página), basta una línea breve **bilingüe (ES/EN)**: la app enlaza a Buy
  Me a Coffee, un servicio externo con su propia política de privacidad.
- Se actualiza en el **mismo commit** que el cambio (regla del repo: `privacy.html`
  debe mantenerse fiel al código).

### 6. Gates / verificación

- **Nuevo bloque de checks `N19` en `scripts/verify-runtime.js`:**
  - (a) `.bmc-fab` existe en `index.html` con `href` de BMC y `rel` con `noopener`.
  - (b) usa `#i-coffee` del sprite (no emoji).
  - (c) `bmc_label` presente en ES **y** EN.
  - (d) existe la regla `body.exam-active .bmc-fab { display: none }`.
- **Contraste:** el texto blanco sobre `--primary` (morado) debe pasar WCAG AA
  4.5:1 en ambos temas. Verificar; si `scripts/validate-contrast.js` no cubre ya
  ese par, añadir el par blanco-sobre-`--primary` como caso del validador.
- **Verificación real en navegador (Playwright):** el pill se ve fuera del examen,
  se oculta al entrar en un examen y reaparece al salir, no tapa los toasts cuando
  ambos coinciden, funciona en el drawer/móvil (≤768px), y el enlace abre el perfil
  correcto en pestaña nueva.

## Archivos tocados

- `index.html` — pill `.bmc-fab` + símbolo `#i-coffee` en el sprite.
- `css/styles.css` — estilos `.bmc-fab`, offset de `.toast-container`, regla de
  ocultación en examen.
- `js/app.js` — helper `_setExamActive()` + reemplazo de las 5 asignaciones.
- `js/i18n.js` — clave `bmc_label` (ES/EN).
- `privacy.html` — mención bilingüe del enlace externo.
- `scripts/verify-runtime.js` — checks `N19`.
- `scripts/validate-contrast.js` — par de contraste nuevo si es necesario.

## Fuera de alcance (YAGNI)

- El widget/script oficial de Buy Me a Coffee.
- Cualquier gating de contenido, suscripciones o contenido premium.
- Backend/infraestructura de pagos (BMC gestiona el cobro íntegro).
- Mostrar el botón en la pantalla de login (se decidió: solo dentro de la app).

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| El pill tapa los toasts (mismo rincón) | Subir `bottom` de `.toast-container` para apilarlos encima |
| Distracción/obstrucción durante el examen | Ocultar vía `body.exam-active .bmc-fab` |
| Emoji como icono rompería el gate `N17` | Icono SVG `#i-coffee` en el sprite |
| Texto blanco sobre morado por debajo de AA | Verificar contraste; añadir par al validador si falta |
| `privacy.html` desincronizado del código | Actualizar en el mismo commit |
