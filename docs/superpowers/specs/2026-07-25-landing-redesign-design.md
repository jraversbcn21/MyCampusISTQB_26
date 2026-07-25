# Rediseño de la landing pública (opción 1B — hero centrado, roadmap protagonista)

**Fecha:** 2026-07-25
**Handoff de diseño:** `c:\Users\jorge.carreno_amaris\Desktop\design_handoff_landing_istqb`
(README.md + `design-reference/LandingB.dc.html` + capturas + `reference-implementation/`).
El handoff es la fuente de verdad de medidas, colores y textos; este spec cubre la **adaptación
al stack real del repo** (vanilla JS, sin build) y las decisiones tomadas con Jorge.

## Objetivo

Hoy `mycampusistqb.vercel.app` muestra solo la tarjeta de login/registro. La landing pública
debe explicar qué es el sitio, qué es el ISTQB, qué incluye el campus y el recorrido de los
6 capítulos del syllabus v4.0, con el formulario de acceso visible en el hero.

**No cambia la funcionalidad de auth.** Mismos campos, tabs, Google, "¿Olvidaste tu
contraseña?" y privacidad. Solo cambia el marco visual.

## Decisiones cerradas con Jorge

1. **Campos del form:** se conservan todos los actuales (incluido Nombre en Registrarse);
   los labels pasan a `.sr-only` (solo lectores de pantalla) — visualmente solo placeholders,
   como el diseño.
2. **Header:** además del selector ES/EN lleva enlace "Iniciar sesión" (resuelve la
   inconsistencia interna del handoff a favor de la sección Interactions).
3. **Fuentes:** Space Grotesk + Manrope **solo en la landing**; la app autenticada sigue en
   Inter. Un usuario logueado no descarga las fuentes nuevas (no hay texto visible que las use).
4. **Tema:** landing dark-only con los hex fijos del handoff, independiente de
   `data-theme`. El tema del usuario se respeta una vez dentro de la app.

## Enfoque elegido (A)

La landing es **HTML estático dentro de `index.html`**, transformando el `#auth-screen`
existente. La tarjeta de acceso actual se mueve intacta al hero (mismos ids), así `auth.js`
no cambia su lógica y el toggle de sesión sigue siendo el mismo `#auth-screen`.

Descartados: página separada `landing.html` (duplicaría form y chequeo de sesión, flash de
redirección) y render por JS (la landing es 100% estática; generarla por JS añade superficie
de error).

## Sección 1 — Markup (`index.html`)

```
#auth-screen                          ← deja de ser flex centrado; página scrolleable
├─ header.lp-header
│  ├─ .lp-brand: birrete (sprite #i-graduation-cap, 24px) + wordmark "MyCampus"
│  └─ .lp-header-right:
│     ├─ a.lp-signin-link "Iniciar sesión"  (data-i18n="lp_signin_link")
│     └─ .lp-lang: ES/EN (ids authBtnES/authBtnEN existentes + aria-pressed)
├─ section.lp-hero
│  ├─ span.lp-badge "ISTQB FOUNDATION LEVEL · SYLLABUS V4.0"
│  ├─ h1.lp-h1 (único h1)
│  ├─ p.lp-lede
│  └─ .auth-card#acceso               ← tarjeta ACTUAL movida aquí, ids intactos:
│     auth-tabs (tabRegister PRIMERO en el DOM, tabLogin después),
│     authMessage, authForm (fieldName + email + password), authSubmit,
│     divider, authGoogle, fila inferior: authForgot + link privacidad
├─ section.lp-why        — 3 items, h2 sr-only (jerarquía de headings correcta)
├─ section.lp-roadmap    — h2 + intro + tarjeta "INCLUIDO EN CADA CAPÍTULO"
│                          + ol.lp-timeline (6 pasos, paso 1 activo)
├─ section.lp-cta        — h2 + párrafo + botón "Crear cuenta gratis"
└─ footer.lp-footer      — "MyCampus · ISTQB Foundation Level v4.0" + privacidad
```

Adaptaciones deliberadas respecto al handoff:

- La tarjeta conserva su estructura interna actual: labels con nueva utilidad `.sr-only`;
  el campo Nombre sigue existiendo (visible solo en Registrarse, como hoy).
- El logo y el switcher ES/EN que hoy viven dentro de la tarjeta se van al header (no se
  duplican).
- Tabs invertidos en el DOM (Registrarse primero) para que el orden visual coincida con el
  diseño; `auth.js` solo depende de ids, no del orden.
- `authForgot` mantiene su comportamiento actual (oculto en modo registro → la fila inferior
  muestra solo Privacidad en ese tab).
- `authMessage` se queda dentro de la tarjeta, encima del form.
- `_showLoadFailure()` (CDN caído) sigue funcionando: mismos ids, misma tarjeta.

## Sección 2 — CSS, tokens y fuentes

**Fuentes.** El `<link>` de Google Fonts existente se amplía con
`Space+Grotesk:wght@500;700` y `Manrope:wght@400;500;600;700` (`display=swap` ya está).
`#auth-screen` declara `font-family: 'Manrope', …` — todo lo de dentro hereda Manrope;
títulos, wordmark y números de paso usan Space Grotesk.

**Tokens.** Los colores del handoff van como custom properties **scoped a `#auth-screen`**
(`--lp-bg:#0B0B12`, `--lp-surface:#15151F`, `--lp-accent:#6C4EF6`, etc. — tabla completa en
el README del handoff), no a `:root`:

- Dark-only garantizado (no dependen de `data-theme`).
- `validate-contrast.js` solo parsea `:root`/`[data-theme="light"]` → no interfiere.
  Contraste verificado en el handoff (`#9A9AB4` sobre `#0B0B12` = 6.2:1 AA); se
  re-verificará con browser real.

**Ubicación.** El bloque de auth actual (`#auth-screen`…`.auth-btn-google`, ~1564–1760 de
`css/styles.css`) se **reescribe en el sitio donde está**. Nada se añade al tail del archivo
(la cadena `≤480 → pointer:coarse → .bmc-fab → reduced-motion → :focus-visible` queda
intacta). Los overrides móviles de auth en los tiers ≤768/≤480 se eliminan: el diseño nuevo
es **fluido sin media queries** (`clamp()`, `flex-wrap`, `auto-fit/minmax`), verificado
320–1920px sin overflow.

**Piezas clave:**

- `#auth-screen`: de `position:fixed` + flex centrado → bloque scrolleable normal con fondo
  `--lp-bg` (`#app-container` sigue `display:none` debajo, como hoy).
- Tarjeta: mismas clases restyled bajo scope `#auth-screen` — surface `#15151F`, borde
  `#262636`, radius 18, sombra `0 24px 60px rgba(0,0,0,.45)`, max-width 420. Inputs
  `#1C1C2A` / borde `#2A2A3D` / radius 11 / focus `#6C4EF6`. Tab activo `#6C4EF6`. Botón
  primario full-width, hover `#7F66FF`, `transition: background-color 150ms ease`, sin
  transform.
- Nueva utilidad `.sr-only`.
- H1 `clamp(34px,8vw,68px)` + `text-wrap:balance` (progressive enhancement).
- Timeline: círculos 34px, conector 2px flex, paso 1 sólido / 2–6 `rgba(108,78,246,.16)`.
- Targets táctiles ≥44px en botones y tabs.
- `:focus-visible` global sigue siendo la última regla del archivo y cubre los controles
  nuevos.
- Medidas exactas de cada bloque (paddings, gaps, tamaños): sección "Screens / Views" y
  "Design Tokens" del README del handoff — es high-fidelity, recrear al pixel.

## Sección 3 — i18n y `auth.js`

**i18n (~35 claves nuevas, 196 → ~231).**

- Prefijo `lp_`: `lp_signin_link`, `lp_badge`, `lp_h1`, `lp_lede`, 3×`lp_why*_title/body`,
  `lp_roadmap_title/intro`, `lp_included_label` + `lp_included_1..4`,
  6×`lp_ch*_title/body`, `lp_cta_title/body/btn`, `lp_footer`. Todo estático con
  `data-i18n` → `i18n.apply()` re-traduce al cambiar idioma sin JS extra. Textos
  definitivos: `reference-implementation/i18n.js` del handoff (español neutral).
- El badge es idéntico ES/EN — se define en ambos (gate de paridad).
- La tarjeta reutiliza sus claves existentes. Cambio: placeholder de contraseña pasa de
  `••••••••` a "Contraseña"/"Password" vía nueva clave `auth_password_placeholder`
  (`data-i18n-placeholder`).
- **Primera visita respeta `navigator.language`**: si no hay idioma guardado y el navegador
  no es `es*`, arranca en EN. Cambio en `i18n.restore()`; la preferencia guardada sigue
  mandando. Cambio de comportamiento global deliberado (hoy siempre ES).
- `i18n.setLang()` actualiza además `document.documentElement.lang` y el `aria-pressed` de
  los botones ES/EN.

**`auth.js` (mínimo, cero lógica de auth).**

- `_showAuthScreen`: `display:'flex'` → `'block'`.
- Tab por defecto: `register` (el visitante de la landing es nuevo).
- Listeners nuevos: "Iniciar sesión" del header → scroll a `#acceso` +
  `_switchMode('login')` + focus email; "Crear cuenta gratis" del CTA → igual con
  `register`. Scroll suave vía CSS `scroll-behavior:smooth` **dentro de
  `@media (prefers-reduced-motion: no-preference)`** (el blunt block global mata
  transiciones pero no scroll-behavior — el guard explícito es necesario). El focus usa
  `preventScroll`.
- `_showLoadFailure`, validación, loading, mensajes: intactos.

**Usuario autenticado:** sin cambios — `_onAuthSuccess` oculta `#auth-screen` y muestra la
app, como hoy.

## Sección 4 — Verificación y despliegue

- **Nueva familia `N24`** en `scripts/verify-runtime.js`:
  - Paridad/residuos i18n (automático al añadir claves).
  - Markup anclado: `#acceso` existe, tabs en orden Registrarse→Iniciar sesión, labels
    `.sr-only`, link del header presente, un solo `<h1>`.
  - CSS anclado a `/#auth-screen \{/` con tokens `--lp-*` (regla real, nunca
    `includes()` — lección N19/N21).
  - Fuentes nuevas en `<head>`; guard reduced-motion del scroll; `display:'block'` en
    auth.js.
  - Comportamental: `_switchMode` sigue alternando bien con el DOM mockeado.
  - **Auditar y actualizar los checks existentes** que asserten sobre el markup/CSS de auth
    viejo (p. ej. pantalla de fallo de CDN, display 'flex').
- **`scripts/validate-responsive.js`**: asserts de la landing **antes del bypass de auth** —
  sin overflow horizontal a 320/375/414 (+ una pasada a 1195), targets ≥44px en
  header/tabs/CTAs.
- Verificación manual Playwright contra `landing-desktop.png` / `landing-mobile.png`
  (high-fidelity) antes de desplegar.
- Commits directos a master con el hook pre-commit; al final **deploy explícito a Vercel**
  (`vercel deploy --prod --yes`, árbol limpio). `privacy.html` no cambia (Google Fonts ya
  se usa; ningún proveedor nuevo).

## Fuera de alcance

- Capturas del campus en el bloque 4 (el handoff pide diseño previo antes de improvisarlo).
- Las propuestas descartadas 1A/1C.
- Cualquier cambio de lógica/endpoints de auth.
