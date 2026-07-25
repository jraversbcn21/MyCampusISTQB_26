# Landing Pública (opción 1B) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar la pantalla de login (`#auth-screen`) en la landing pública del handoff (hero centrado + roadmap del syllabus), sin tocar la lógica de auth.

**Architecture:** HTML estático dentro de `index.html` (el `#auth-screen` existente se convierte en la página completa; la tarjeta de acceso actual se mueve intacta al hero con los mismos ids). CSS con tokens `--lp-*` scoped a `#auth-screen` (dark-only), fluido sin media queries. Textos como claves `lp_*` en `TRANSLATIONS`.

**Tech Stack:** Vanilla JS (sin build), `css/styles.css` único, i18n propio, gates: `scripts/verify-runtime.js` (nueva familia N24) + `scripts/validate-responsive.js` (Playwright).

**Spec:** `docs/superpowers/specs/2026-07-25-landing-redesign-design.md`
**Handoff (fuente de verdad visual):** `c:\Users\jorge.carreno_amaris\Desktop\design_handoff_landing_istqb` — README.md (medidas/tokens), `landing-desktop.png`/`landing-mobile.png` (resultado esperado), `reference-implementation/i18n.js` (textos definitivos).

## Global Constraints

- **Cero cambios de lógica/endpoints de auth**: `signInEmail`/`signUpEmail`/`signInGoogle`/validación/loading/mensajes intactos. Los ids `authForm`, `authEmail`, `authPassword`, `authName`, `authSubmit`, `authMessage`, `authForgot`, `authGoogle`, `tabLogin`, `tabRegister`, `fieldName`, `authBtnES`, `authBtnEN` se conservan.
- **Dark-only con hex fijos del handoff** (`--lp-bg:#0B0B12`, etc.), independiente de `data-theme`.
- **Sin media queries en la landing**: solo `clamp()`, `flex-wrap`, `auto-fit/minmax`.
- **Inputs a `font-size: 1rem` (16px)** — desviación deliberada de los 14px del handoff: el gate N13 y el auto-zoom de iOS lo exigen.
- **Tail de `css/styles.css` intacto**: nada nuevo después de `@media (prefers-reduced-motion)`; `:focus-visible` sigue siendo la última regla.
- **Checks nuevos anclados a reglas reales** (`/\.selector \{/` o `indexOf(...) !== -1` explícito), nunca `includes()` a secas (lección N19/N21).
- El hook pre-commit corre el harness con `js/`/`index.html` staged: **cada commit debe dejar `node scripts/verify-runtime.js` en verde** (los checks viejos que asserten sobre lo eliminado se actualizan en el MISMO commit que lo elimina).
- Commits directos a `master`, mensajes en español como el historial reciente.

---

### Task 1: Claves i18n `lp_*` + `navigator.language` en `restore()`

**Files:**
- Modify: `js/i18n.js` (bloques `es:`/`en:` de `TRANSLATIONS` + método `restore()`, ~línea 484)
- Test: `scripts/verify-runtime.js` (nueva sección N24-i18n; la paridad ES/EN ya es automática)

**Interfaces:**
- Produces: 35 claves nuevas usadas por el markup de Task 2: `lp_signin_link`, `lp_badge`, `lp_h1`, `lp_lede`, `lp_why_heading`, `lp_why{1,2,3}_title`, `lp_why{1,2,3}_body`, `lp_roadmap_title`, `lp_roadmap_intro`, `lp_included_label`, `lp_included_{1..4}`, `lp_ch{1..6}_title`, `lp_ch{1..6}_body`, `lp_cta_title`, `lp_cta_body`, `lp_cta_btn`, `lp_footer`, `auth_password_placeholder`. Conteo: 196 → 231.
- Produces: `i18n.restore()` que respeta `navigator.language` en primera visita (sin clave guardada).

- [ ] **Step 1: Escribir los checks N24-i18n (fallarán)**

En `scripts/verify-runtime.js`, al final de las familias N (tras N23), añadir una sección nueva siguiendo el patrón de las existentes (mira cómo N22 lee `js/auth.js` con `fs.readFileSync` y cómo las secciones behavioral cargan módulos en contexto mockeado — reutiliza el MISMO helper de carga que ya usa el harness para i18n en los checks de paridad):

```js
/* ---- N24: landing pública (2026-07-25) ---- */
{
  const i18nSrc = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');
  // restore(): rama de primera visita con navigator.language
  const restoreBody = i18nSrc.slice(i18nSrc.indexOf('restore()'));
  check('N24 i18n: restore() respeta navigator.language en primera visita',
    i18nSrc.indexOf('restore()') !== -1 && /navigator/.test(restoreBody.slice(0, restoreBody.indexOf('setLang'))));
  // Claves lp_* definidas (la paridad ES/EN la cubre el check global existente)
  for (const k of ['lp_signin_link', 'lp_h1', 'lp_cta_btn', 'lp_footer', 'auth_password_placeholder']) {
    check(`N24 i18n: clave ${k} definida`, new RegExp(`${k}:`).test(i18nSrc));
  }
}
```

Si el harness tiene un mecanismo para evaluar `i18n.js` en un sandbox (búscalo al principio del archivo), añade además el behavioral: sandbox con `localStorage` vacío y `navigator = { language: 'en-US' }` → tras `restore()`, `i18n.lang === 'en'`; y con `localStorage` conteniendo `mycampus_lang = 'es'` → `'es'` (la preferencia guardada manda). Si no existe tal mecanismo, los estáticos bastan — no lo inventes.

- [ ] **Step 2: Correr el harness y verificar que N24 falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL solo en los checks N24 nuevos.

- [ ] **Step 3: Añadir las claves a `TRANSLATIONS`**

En `js/i18n.js`, dentro de `es: { … }`, tras el bloque `// AUTH` existente (localízalo; si no existe, al final antes del cierre), añadir:

```js
    // LANDING PÚBLICA (2026-07-25)
    lp_signin_link: "Iniciar sesión",
    lp_badge: "ISTQB FOUNDATION LEVEL · SYLLABUS V4.0",
    lp_h1: "Todo lo que necesitas para aprobar, en un solo lugar.",
    lp_lede: "Teoría, práctica y exámenes simulados con tiempo siguiendo el syllabus oficial, en español e inglés.",
    lp_why_heading: "Por qué certificarse",
    lp_why1_title: "Un estándar internacional",
    lp_why1_body: "ISTQB es la certificación de testing más pedida en las búsquedas de QA, y Foundation Level es su puerta de entrada.",
    lp_why2_title: "Sin experiencia previa",
    lp_why2_body: "El syllabus empieza de cero: sirve tanto si cambias de carrera como si ya trabajas en testing.",
    lp_why3_title: "Un vocabulario común",
    lp_why3_body: "Terminas sabiendo nombrar técnicas, niveles y tipos de prueba como lo hace todo equipo de QA.",
    lp_roadmap_title: "Tu recorrido por el syllabus",
    lp_roadmap_intro: "Seis capítulos, en el mismo orden que el examen oficial. Siempre sabes dónde estás y qué te falta.",
    lp_included_label: "INCLUIDO EN CADA CAPÍTULO",
    lp_included_1: "Teoría escrita para el examen",
    lp_included_2: "Preguntas de práctica con explicación",
    lp_included_3: "Examen simulado con tiempo al final",
    lp_included_4: "Progreso guardado a medida que avanzas",
    lp_ch1_title: "Fundamentos del testing",
    lp_ch1_body: "Para qué sirve probar, los siete principios, el proceso de prueba y las habilidades que exige.",
    lp_ch2_title: "Testing en el ciclo de vida",
    lp_ch2_body: "Niveles y tipos de prueba, pruebas de mantenimiento y testing en equipos ágiles.",
    lp_ch3_title: "Pruebas estáticas",
    lp_ch3_body: "Revisiones y el proceso de revisión: detectar defectos antes de ejecutar una sola línea.",
    lp_ch4_title: "Análisis y diseño de pruebas",
    lp_ch4_body: "Particiones de equivalencia, valores límite, tablas de decisión, cobertura y testing exploratorio.",
    lp_ch5_title: "Gestión de las actividades de prueba",
    lp_ch5_body: "Planificación, estimación, análisis de riesgos, monitoreo, control y gestión de defectos.",
    lp_ch6_title: "Herramientas de prueba",
    lp_ch6_body: "Qué cubre realmente el soporte de herramientas y qué esperar al adoptarlas.",
    lp_cta_title: "Cuando quieras, empezamos",
    lp_cta_body: "Crea tu cuenta y abre el capítulo 1 ahora mismo.",
    lp_cta_btn: "Crear cuenta gratis",
    lp_footer: "MyCampus · ISTQB Foundation Level v4.0",
    auth_password_placeholder: "Contraseña",
```

Y el bloque equivalente dentro de `en: { … }` (mismas claves, textos del `reference-implementation/i18n.js` del handoff):

```js
    // PUBLIC LANDING (2026-07-25)
    lp_signin_link: "Sign in",
    lp_badge: "ISTQB FOUNDATION LEVEL · SYLLABUS V4.0",
    lp_h1: "Everything you need to pass, in one place.",
    lp_lede: "Theory, practice and timed mock exams following the official syllabus, in Spanish and English.",
    lp_why_heading: "Why get certified",
    lp_why1_title: "An international standard",
    lp_why1_body: "ISTQB is the most requested testing certification in QA job listings, and Foundation Level is its entry point.",
    lp_why2_title: "No experience required",
    lp_why2_body: "The syllabus starts from zero, so it works for career changers as much as for working testers.",
    lp_why3_title: "A shared vocabulary",
    lp_why3_body: "You leave able to name techniques, levels and test types the way every QA team does.",
    lp_roadmap_title: "Your route through the syllabus",
    lp_roadmap_intro: "Six chapters, in the same order as the official exam. You always know where you are and what is left.",
    lp_included_label: "INCLUDED IN EVERY CHAPTER",
    lp_included_1: "Theory written for the exam",
    lp_included_2: "Practice questions with explanations",
    lp_included_3: "Timed mock exam at the end",
    lp_included_4: "Progress saved as you go",
    lp_ch1_title: "Fundamentals of testing",
    lp_ch1_body: "What testing is for, the seven principles, the test process and the skills it takes.",
    lp_ch2_title: "Testing throughout the lifecycle",
    lp_ch2_body: "Test levels, test types, maintenance testing and testing in agile teams.",
    lp_ch3_title: "Static testing",
    lp_ch3_body: "Reviews and the review process: catching defects before a single line runs.",
    lp_ch4_title: "Test analysis and design",
    lp_ch4_body: "Equivalence partitioning, boundary values, decision tables, coverage and exploratory testing.",
    lp_ch5_title: "Managing the test activities",
    lp_ch5_body: "Planning, estimation, risk analysis, monitoring, control and defect management.",
    lp_ch6_title: "Test tools",
    lp_ch6_body: "What tool support really covers, and what to expect when adopting it.",
    lp_cta_title: "Ready when you are",
    lp_cta_body: "Create your account and open chapter 1 right away.",
    lp_cta_btn: "Create free account",
    lp_footer: "MyCampus · ISTQB Foundation Level v4.0",
    auth_password_placeholder: "Password",
```

- [ ] **Step 4: Reescribir `restore()`**

En `js/i18n.js` (~línea 484), reemplazar:

```js
  restore() {
    this.lang = localStorage.getItem('mycampus_lang') || 'es';
    this.apply();
  },
```

por:

```js
  // Primera visita (sin preferencia guardada): respeta el idioma del
  // navegador — navegador no-español arranca en EN. La preferencia guardada
  // sigue mandando. typeof-guard: el harness corre en Node sin navigator.
  restore() {
    const saved = localStorage.getItem('mycampus_lang');
    if (saved) {
      this.lang = saved;
    } else {
      const nav = (typeof navigator !== 'undefined' && navigator.language) || 'es';
      this.lang = nav.toLowerCase().startsWith('es') ? 'es' : 'en';
    }
    this.apply();
  },
```

- [ ] **Step 5: Correr el harness completo y verificar verde**

Run: `node scripts/verify-runtime.js`
Expected: PASS total (paridad incluida — si falla paridad, una clave ES/EN está desemparejada).

- [ ] **Step 6: Commit**

```bash
git add js/i18n.js scripts/verify-runtime.js
git commit -m "feat(landing): claves i18n lp_* y navigator.language en la primera visita (196 -> 231)"
```

---

### Task 2: Markup de la landing en `index.html` + fuentes

**Files:**
- Modify: `index.html` — línea 22 (link de Google Fonts), línea 8 (meta theme-color) y el bloque `#auth-screen` completo (líneas 70–125)
- Test: `scripts/verify-runtime.js` — checks N24-markup nuevos + **actualizar el check N17 de línea ~853** (lista `['auth-logo-icon', 'logo-icon']`)

**Interfaces:**
- Consumes: claves `lp_*` y `auth_password_placeholder` de Task 1.
- Produces: ids nuevos `lpSigninLink` y `lpCtaBtn` (los consume Task 4), id `acceso` en la tarjeta, clases `lp-*` (las consume Task 3), clase `sr-only` en los labels.

- [ ] **Step 1: Escribir los checks N24-markup (fallarán)**

Dentro de la sección N24 creada en Task 1, añadir:

```js
{
  const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const iReg = htmlSrc.indexOf('id="tabRegister"');
  const iLog = htmlSrc.indexOf('id="tabLogin"');
  check('N24 markup: tarjeta de acceso con id="acceso"', htmlSrc.includes('id="acceso"'));
  check('N24 markup: tabs en orden Registrarse -> Iniciar sesión', iReg !== -1 && iLog !== -1 && iReg < iLog);
  check('N24 markup: labels del form ocultos con sr-only',
    /class="sr-only" data-i18n="auth_email_label"/.test(htmlSrc)
    && /class="sr-only" data-i18n="auth_password_label"/.test(htmlSrc)
    && /class="sr-only" data-i18n="auth_name_label"/.test(htmlSrc));
  check('N24 markup: link de login del header presente', htmlSrc.includes('id="lpSigninLink"'));
  check('N24 markup: CTA final presente', htmlSrc.includes('id="lpCtaBtn"'));
  check('N24 markup: placeholder de contraseña via i18n',
    htmlSrc.includes('data-i18n-placeholder="auth_password_placeholder"'));
  check('N24 markup: fuentes Space Grotesk y Manrope en <head>',
    /Space\+Grotesk/.test(htmlSrc) && /Manrope/.test(htmlSrc));
  const lpBlock = htmlSrc.slice(htmlSrc.indexOf('id="auth-screen"'), htmlSrc.indexOf('id="app-container"'));
  check('N24 markup: un solo <h1> en la landing', (lpBlock.match(/<h1/g) || []).length === 1);
  check('N24 markup: authForgot arranca oculto (modo registro por defecto)',
    /id="authForgot"[^>]*style="display:none"/.test(htmlSrc) || /style="display:none"[^>]*id="authForgot"/.test(htmlSrc));
}
```

Y **actualizar el check N17 existente** (~línea 853): en la lista `['auth-logo-icon', 'logo-icon']` sustituir `'auth-logo-icon'` por `'lp-brand-icon'` (el logo del auth se convierte en la marca del header de la landing).

- [ ] **Step 2: Correr el harness y verificar que los N24-markup fallan** (y N17 también, hasta el Step 3)

Run: `node scripts/verify-runtime.js`
Expected: FAIL en N24-markup y en el N17 actualizado.

- [ ] **Step 3: Actualizar `<head>`**

Línea 22 — reemplazar el href de Google Fonts por:

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
```

Línea 8 — `<meta name="theme-color" content="#0B0B12" />` (alinea con el fondo de la landing; antes `#0B0B14`).

- [ ] **Step 4: Reemplazar el bloque `#auth-screen` completo (líneas 70–125)**

```html
  <!-- ============ LANDING PÚBLICA + AUTH (rediseño 2026-07-25, opción 1B) ============
       La tarjeta de acceso conserva TODOS los ids que auth.js usa. El default
       estático es modo registro (tab activo, submit "Crear cuenta", fieldName
       visible, authForgot oculto) — auth.js Task 4 pone _mode:'register' a juego. -->
  <div id="auth-screen">
    <header class="lp-header">
      <div class="lp-brand">
        <span class="lp-brand-icon"><svg class="icon" aria-hidden="true"><use href="#i-graduation-cap"/></svg></span>
        <span class="lp-wordmark">MyCampus</span>
      </div>
      <div class="lp-header-right">
        <a href="#acceso" class="lp-signin-link" id="lpSigninLink" data-i18n="lp_signin_link">Iniciar sesión</a>
        <div class="lp-lang">
          <button class="lang-btn active" id="authBtnES" aria-pressed="true">ES</button>
          <button class="lang-btn" id="authBtnEN" aria-pressed="false">EN</button>
        </div>
      </div>
    </header>

    <section class="lp-hero">
      <span class="lp-badge" data-i18n="lp_badge">ISTQB FOUNDATION LEVEL · SYLLABUS V4.0</span>
      <h1 class="lp-h1" data-i18n="lp_h1">Todo lo que necesitas para aprobar, en un solo lugar.</h1>
      <p class="lp-lede" data-i18n="lp_lede">Teoría, práctica y exámenes simulados con tiempo siguiendo el syllabus oficial, en español e inglés.</p>

      <div class="auth-card" id="acceso">
        <div class="auth-tabs">
          <button class="auth-tab active" id="tabRegister" data-i18n="auth_register_tab">Registrarse</button>
          <button class="auth-tab" id="tabLogin" data-i18n="auth_login_tab">Iniciar sesión</button>
        </div>

        <div id="authMessage" class="auth-message" style="display:none"></div>

        <form class="auth-form" id="authForm" autocomplete="on">
          <div class="auth-field" id="fieldName">
            <label for="authName" class="sr-only" data-i18n="auth_name_label">Nombre</label>
            <input type="text" id="authName" name="name" placeholder="¿Cómo te llamamos?" data-i18n-placeholder="auth_name_placeholder" autocomplete="name" />
          </div>
          <div class="auth-field">
            <label for="authEmail" class="sr-only" data-i18n="auth_email_label">Email</label>
            <input type="email" id="authEmail" name="email" placeholder="tu@email.com" data-i18n-placeholder="auth_email_placeholder" autocomplete="email" required />
          </div>
          <div class="auth-field">
            <label for="authPassword" class="sr-only" data-i18n="auth_password_label">Contraseña</label>
            <input type="password" id="authPassword" name="password" placeholder="Contraseña" data-i18n-placeholder="auth_password_placeholder" autocomplete="current-password" required />
          </div>
          <button type="submit" class="auth-btn-primary" id="authSubmit">Crear cuenta</button>
        </form>

        <div class="auth-divider"><span data-i18n="auth_divider">o continuar con</span></div>

        <button class="auth-btn-google" id="authGoogle">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8196H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20443Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59319 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
          </svg>
          <span data-i18n="auth_google_btn">Continuar con Google</span>
        </button>

        <div class="lp-auth-foot">
          <a href="#" class="auth-forgot" id="authForgot" style="display:none" data-i18n="auth_forgot_password">¿Olvidaste tu contraseña?</a>
          <a href="privacy.html" class="auth-privacy-link" data-i18n="privacy_link">Política de privacidad</a>
        </div>
      </div>
    </section>

    <section class="lp-why">
      <h2 class="sr-only" data-i18n="lp_why_heading">Por qué certificarse</h2>
      <div>
        <h3 data-i18n="lp_why1_title">Un estándar internacional</h3>
        <p data-i18n="lp_why1_body">ISTQB es la certificación de testing más pedida en las búsquedas de QA, y Foundation Level es su puerta de entrada.</p>
      </div>
      <div>
        <h3 data-i18n="lp_why2_title">Sin experiencia previa</h3>
        <p data-i18n="lp_why2_body">El syllabus empieza de cero: sirve tanto si cambias de carrera como si ya trabajas en testing.</p>
      </div>
      <div>
        <h3 data-i18n="lp_why3_title">Un vocabulario común</h3>
        <p data-i18n="lp_why3_body">Terminas sabiendo nombrar técnicas, niveles y tipos de prueba como lo hace todo equipo de QA.</p>
      </div>
    </section>

    <section class="lp-roadmap">
      <div class="lp-roadmap-intro">
        <h2 class="lp-h2" data-i18n="lp_roadmap_title">Tu recorrido por el syllabus</h2>
        <p data-i18n="lp_roadmap_intro">Seis capítulos, en el mismo orden que el examen oficial. Siempre sabes dónde estás y qué te falta.</p>
        <div class="lp-included">
          <span class="lp-included-label" data-i18n="lp_included_label">INCLUIDO EN CADA CAPÍTULO</span>
          <span data-i18n="lp_included_1">Teoría escrita para el examen</span>
          <span data-i18n="lp_included_2">Preguntas de práctica con explicación</span>
          <span data-i18n="lp_included_3">Examen simulado con tiempo al final</span>
          <span data-i18n="lp_included_4">Progreso guardado a medida que avanzas</span>
        </div>
      </div>
      <ol class="lp-timeline">
        <li class="lp-step">
          <div class="lp-step-rail" aria-hidden="true"><span class="lp-step-num">1</span><span class="lp-step-line"></span></div>
          <div class="lp-step-body">
            <h3 data-i18n="lp_ch1_title">Fundamentos del testing</h3>
            <p data-i18n="lp_ch1_body">Para qué sirve probar, los siete principios, el proceso de prueba y las habilidades que exige.</p>
          </div>
        </li>
        <li class="lp-step">
          <div class="lp-step-rail" aria-hidden="true"><span class="lp-step-num">2</span><span class="lp-step-line"></span></div>
          <div class="lp-step-body">
            <h3 data-i18n="lp_ch2_title">Testing en el ciclo de vida</h3>
            <p data-i18n="lp_ch2_body">Niveles y tipos de prueba, pruebas de mantenimiento y testing en equipos ágiles.</p>
          </div>
        </li>
        <li class="lp-step">
          <div class="lp-step-rail" aria-hidden="true"><span class="lp-step-num">3</span><span class="lp-step-line"></span></div>
          <div class="lp-step-body">
            <h3 data-i18n="lp_ch3_title">Pruebas estáticas</h3>
            <p data-i18n="lp_ch3_body">Revisiones y el proceso de revisión: detectar defectos antes de ejecutar una sola línea.</p>
          </div>
        </li>
        <li class="lp-step">
          <div class="lp-step-rail" aria-hidden="true"><span class="lp-step-num">4</span><span class="lp-step-line"></span></div>
          <div class="lp-step-body">
            <h3 data-i18n="lp_ch4_title">Análisis y diseño de pruebas</h3>
            <p data-i18n="lp_ch4_body">Particiones de equivalencia, valores límite, tablas de decisión, cobertura y testing exploratorio.</p>
          </div>
        </li>
        <li class="lp-step">
          <div class="lp-step-rail" aria-hidden="true"><span class="lp-step-num">5</span><span class="lp-step-line"></span></div>
          <div class="lp-step-body">
            <h3 data-i18n="lp_ch5_title">Gestión de las actividades de prueba</h3>
            <p data-i18n="lp_ch5_body">Planificación, estimación, análisis de riesgos, monitoreo, control y gestión de defectos.</p>
          </div>
        </li>
        <li class="lp-step">
          <div class="lp-step-rail" aria-hidden="true"><span class="lp-step-num">6</span></div>
          <div class="lp-step-body">
            <h3 data-i18n="lp_ch6_title">Herramientas de prueba</h3>
            <p data-i18n="lp_ch6_body">Qué cubre realmente el soporte de herramientas y qué esperar al adoptarlas.</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="lp-cta">
      <h2 class="lp-h2" data-i18n="lp_cta_title">Cuando quieras, empezamos</h2>
      <p data-i18n="lp_cta_body">Crea tu cuenta y abre el capítulo 1 ahora mismo.</p>
      <a class="lp-cta-btn" id="lpCtaBtn" href="#acceso" data-i18n="lp_cta_btn">Crear cuenta gratis</a>
    </section>

    <footer class="lp-footer">
      <span data-i18n="lp_footer">MyCampus · ISTQB Foundation Level v4.0</span>
      <a href="privacy.html" data-i18n="privacy_link">Política de privacidad</a>
    </footer>
  </div>
```

Notas de fidelidad al comportamiento actual que NO deben perderse:
- `fieldName` ya **no** lleva `style="display:none"` (el default estático es registro); `authForgot` **sí** lleva `style="display:none"`. `_switchMode` de auth.js sigue gobernando ambos al cambiar de tab.
- El orden interno de la tarjeta cambia (forgot pasa del medio a la fila inferior junto a privacidad) — es el orden del diseño.
- El número de paso (`lp-step-num`) es texto decorativo (`aria-hidden` en el rail); la numeración semántica la da el `<ol>`.

- [ ] **Step 5: Correr el harness completo**

Run: `node scripts/verify-runtime.js`
Expected: PASS total (N24-markup y N17 en verde; si algún check viejo asserta sobre el markup eliminado —p. ej. residuos i18n del `auth-logo-sub`— actualízalo en este mismo commit y anótalo).

- [ ] **Step 6: Commit**

```bash
git add index.html scripts/verify-runtime.js
git commit -m "feat(landing): markup de la landing publica — hero con la tarjeta de acceso, roadmap y CTA"
```

---

### Task 3: CSS de la landing (reescritura del bloque auth)

**Files:**
- Modify: `css/styles.css` —
  - reemplazar el bloque auth completo (`#auth-screen` … `.auth-btn-google:disabled`, líneas ~1564–1760),
  - eliminar las 2 líneas de auth del tier ≤480 (líneas ~1472–1473),
  - eliminar la regla `.auth-privacy-link` vieja (~2377–2386),
  - dejar intacto `#auth-screen .lang-btn` de `@media (pointer: coarse)` (sigue aplicando).
- Test: `scripts/verify-runtime.js` — checks N24-css nuevos + **actualizar N20** (~línea 1002: quitar `.auth-card` de la lista del tier) — el N13 de línea ~714 (`.auth-field input {` con 16px) debe seguir pasando SIN tocarlo.

**Interfaces:**
- Consumes: clases `lp-*`, `sr-only`, ids de Task 2.
- Produces: tokens `--lp-*` en `#auth-screen`; regla `html { scroll-behavior: smooth }` con guard reduced-motion (Task 4 confía en ella para el scroll suave).

- [ ] **Step 1: Escribir los checks N24-css y actualizar N20 (fallarán)**

En la sección N24:

```js
{
  const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
  check('N24 css: tokens --lp-* scoped a #auth-screen (dark-only)',
    /#auth-screen \{[^}]*--lp-bg: ?#0B0B12/i.test(cssSrc) && /--lp-accent: ?#6C4EF6/i.test(cssSrc));
  check('N24 css: #auth-screen ya no es position:fixed (landing scrolleable)',
    !/#auth-screen \{[^}]*position: ?fixed/.test(cssSrc));
  for (const sel of ['.lp-header \\{', '.lp-hero \\{', '.lp-why \\{', '.lp-timeline \\{', '.lp-cta-btn \\{', '.lp-footer \\{', '.sr-only \\{']) {
    check(`N24 css: regla real ${sel.replace(' \\{', '')}`, new RegExp(sel).test(cssSrc));
  }
  check('N24 css: scroll suave con guard de reduced-motion',
    /@media \(prefers-reduced-motion: no-preference\) \{\s*html \{ scroll-behavior: smooth; \}/.test(cssSrc));
  check('N24 css: la landing va antes del tail (reduced-motion sigue detrás)',
    cssSrc.indexOf('.lp-hero {') !== -1
    && cssSrc.indexOf('.lp-hero {') < cssSrc.indexOf('@media (prefers-reduced-motion: reduce)'));
  check('N24 css: paso activo del timeline', /\.lp-step:first-child \.lp-step-num \{/.test(cssSrc));
}
```

Actualizar el check N20 del tier (~1002–1006): eliminar `&& /\.auth-card\s*\{[^}]*padding:/.test(t480)` de la condición (la landing ya no tiene overrides en el tier).

- [ ] **Step 2: Correr el harness — N24-css debe fallar y N20 pasar tras su ajuste**

Run: `node scripts/verify-runtime.js`
Expected: FAIL solo en N24-css.

- [ ] **Step 3: Reemplazar el bloque auth por la sección de la landing**

Sustituir las líneas ~1564–1760 (desde `#auth-screen {` hasta `.auth-btn-google:disabled { … }` inclusive) por:

```css
/* ===================================================
   LANDING PÚBLICA + AUTH (rediseño 2026-07-25, opción 1B)
   Dark-only: tokens --lp-* fijos, independientes de data-theme.
   Fluida sin media queries (clamp/flex-wrap/auto-fit) de 320 a 1920px.
   =================================================== */

/* Scroll suave de los CTAs a #acceso. Guard explícito: el blunt block de
   reduced-motion anula transiciones pero NO scroll-behavior. */
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

#auth-screen {
  --lp-bg: #0B0B12;
  --lp-bg-alt: #0D0D15;
  --lp-surface: #15151F;
  --lp-surface-2: #1C1C2A;
  --lp-border: #262636;
  --lp-border-strong: #2A2A3D;
  --lp-border-subtle: #232333;
  --lp-border-section: #1E1E2C;
  --lp-accent: #6C4EF6;
  --lp-accent-hover: #7F66FF;
  --lp-accent-brand: #7C5CFC;
  --lp-accent-soft: rgba(108,78,246,.12);
  --lp-accent-soft-2: rgba(108,78,246,.16);
  --lp-accent-text: #B3A2FF;
  --lp-text: #E9E9F2;
  --lp-text-2: #C7C7DB;
  --lp-text-muted: #9A9AB4;
  --lp-text-dim: #7B7B96;
  --lp-text-faint: #6E6E88;
  --lp-link: #9F8BFF;
  --lp-link-hover: #BFB0FF;
  --lp-pad-x: clamp(16px, 4vw, 56px);
  width: 100%;
  min-height: 100vh;  /* fallback */
  min-height: 100dvh;
  background: var(--lp-bg);
  color: var(--lp-text);
  font-family: 'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ---- Header ---- */
.lp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px var(--lp-pad-x);
}
.lp-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--lp-text);
}
.lp-brand-icon { display: flex; }
.lp-brand-icon .icon {
  width: 24px;
  height: 24px;
  stroke-width: 1.8;
}
.lp-wordmark {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--lp-accent-brand);
}
.lp-header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}
.lp-signin-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 14px;
  font-weight: 600;
  color: var(--lp-link);
  text-decoration: none;
  transition: color 150ms ease;
}
.lp-signin-link:hover { color: var(--lp-link-hover); }
.lp-lang {
  display: flex;
  background: var(--lp-surface);
  border: 1px solid var(--lp-border);
  border-radius: 8px;
  padding: 3px;
}
/* .lang-btn es clase compartida con el topbar de la app — overrides scoped */
#auth-screen .lang-btn {
  font-size: 12px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 6px;
  color: var(--lp-text-muted);
}
#auth-screen .lang-btn.active {
  background: var(--lp-accent);
  color: #fff;
}

/* ---- Hero ---- */
.lp-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  padding: clamp(36px, 6vw, 90px) clamp(16px, 6vw, 80px) clamp(30px, 4vw, 56px);
  background: radial-gradient(120% 90% at 50% -10%, rgba(108,78,246,.18) 0%, rgba(11,11,18,0) 60%);
}
.lp-badge {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--lp-accent-text);
  background: var(--lp-accent-soft);
  border: 1px solid rgba(124,92,252,.32);
  padding: 7px 14px;
  border-radius: 999px;
}
.lp-h1 {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 700;
  font-size: clamp(34px, 8vw, 68px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  max-width: 22ch;
  text-wrap: balance;
  margin: 0;
}
.lp-lede {
  font-size: clamp(15px, 1.7vw, 19px);
  line-height: 1.6;
  color: var(--lp-text-muted);
  max-width: 52ch;
  margin: 0;
}

/* ---- Tarjeta de acceso (mismas clases que usa auth.js) ---- */
.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--lp-surface);
  border: 1px solid var(--lp-border);
  border-radius: 18px;
  padding: clamp(18px, 3vw, 26px);
  text-align: left;
  box-shadow: 0 24px 60px rgba(0,0,0,.45);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.auth-tabs {
  display: flex;
  background: var(--lp-surface-2);
  border-radius: 11px;
  padding: 4px;
  gap: 4px;
}
.auth-tab {
  flex: 1;
  min-height: 44px;
  padding: 10px;
  border: none;
  background: transparent;
  color: var(--lp-text-muted);
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}
.auth-tab.active {
  background: var(--lp-accent);
  color: #fff;
}

.auth-message {
  padding: 12px 14px;
  border-radius: 11px;
  font-size: 0.85rem;
  font-weight: 500;
}
.auth-message--error {
  background: rgba(244,67,54,0.12);
  color: #EF9A9A;
  border: 1px solid rgba(244,67,54,0.25);
}
.auth-message--success {
  background: rgba(76,175,80,0.12);
  color: #81C784;
  border: 1px solid rgba(76,175,80,0.25);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.auth-field input {
  padding: 13px 14px;
  background: var(--lp-surface-2);
  border: 1px solid var(--lp-border-strong);
  border-radius: 11px;
  color: var(--lp-text);
  font-size: 1rem; /* 16px — N13/iOS, desviación deliberada de los 14px del handoff */
  font-family: inherit;
  transition: border-color 150ms ease;
  outline: none;
}
.auth-field input::placeholder { color: var(--lp-text-faint); }
.auth-field input:focus { border-color: var(--lp-accent); }

.auth-btn-primary {
  min-height: 44px;
  padding: 14px;
  background: var(--lp-accent);
  color: #fff;
  border: none;
  border-radius: 11px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms ease, opacity 150ms ease;
}
.auth-btn-primary:hover:not(:disabled) { background: var(--lp-accent-hover); }
.auth-btn-primary:disabled,
.auth-btn-primary.loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--lp-text-dim);
  font-size: 12px;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--lp-border);
}

.auth-btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 44px;
  padding: 12px;
  background: var(--lp-surface-2);
  border: 1px solid var(--lp-border-strong);
  border-radius: 11px;
  color: var(--lp-text);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;
}
.auth-btn-google:hover:not(:disabled) {
  border-color: var(--lp-accent);
  background: var(--lp-surface);
}
.auth-btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.lp-auth-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.auth-forgot {
  font-size: 12px;
  color: var(--lp-link);
  text-decoration: none;
  transition: color 150ms ease;
}
.auth-forgot:hover { color: var(--lp-link-hover); }
.auth-privacy-link {
  margin-left: auto;
  font-size: 12px;
  color: var(--lp-text-dim);
  text-decoration: none;
  transition: color 150ms ease;
}
.auth-privacy-link:hover { color: var(--lp-link-hover); }

/* ---- Banda "por qué certificarse" ---- */
.lp-why {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  background: var(--lp-bg-alt);
  border-top: 1px solid var(--lp-border-section);
  border-bottom: 1px solid var(--lp-border-section);
  padding: clamp(30px, 4vw, 56px) var(--lp-pad-x);
}
.lp-why h3 {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 16px;
  margin: 0 0 8px;
}
.lp-why p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--lp-text-muted);
  margin: 0;
}

/* ---- Roadmap del syllabus ---- */
.lp-roadmap {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(24px, 4vw, 56px);
  padding: clamp(40px, 5vw, 80px) var(--lp-pad-x);
}
.lp-roadmap-intro { flex: 1 1 260px; }
.lp-h2 {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 700;
  font-size: clamp(24px, 3.6vw, 38px);
  letter-spacing: -0.025em;
  margin: 0 0 12px;
}
.lp-roadmap-intro > p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--lp-text-muted);
  margin: 0 0 20px;
}
.lp-included {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--lp-surface);
  border: 1px solid var(--lp-border-subtle);
  border-radius: 16px;
  padding: 20px;
}
.lp-included-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--lp-text-dim);
}
.lp-included span:not(.lp-included-label) {
  font-size: 14px;
  color: var(--lp-text-2);
}
.lp-timeline {
  flex: 1 1 340px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.lp-step {
  display: flex;
  gap: 16px;
}
.lp-step-rail {
  flex: 0 0 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.lp-step-num {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 14px;
  background: var(--lp-accent-soft-2);
  color: var(--lp-accent-text);
}
.lp-step:first-child .lp-step-num {
  background: var(--lp-accent);
  color: #fff;
}
.lp-step-line {
  flex: 1;
  width: 2px;
  background: var(--lp-border);
}
.lp-step-body { padding-bottom: 22px; }
.lp-step:last-child .lp-step-body { padding-bottom: 0; }
.lp-step-body h3 {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 17px;
  margin: 6px 0;
}
.lp-step-body p {
  font-size: 14px;
  line-height: 1.55;
  color: var(--lp-text-muted);
  margin: 0;
}

/* ---- CTA final + footer ---- */
.lp-cta {
  background: var(--lp-bg-alt);
  border-top: 1px solid var(--lp-border-section);
  text-align: center;
  padding: clamp(36px, 5vw, 72px) var(--lp-pad-x);
}
.lp-cta p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--lp-text-muted);
  max-width: 44ch;
  margin: 12px auto 24px;
}
.lp-cta-btn {
  display: inline-block;
  min-height: 44px;
  background: var(--lp-accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 12px;
  text-decoration: none;
  transition: background-color 150ms ease;
}
.lp-cta-btn:hover { background: var(--lp-accent-hover); }
.lp-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  padding: 22px var(--lp-pad-x);
  border-top: 1px solid var(--lp-border-section);
  font-size: 12px;
  color: var(--lp-text-faint);
}
.lp-footer a {
  color: var(--lp-text-faint);
  text-decoration: none;
  transition: color 150ms ease;
}
.lp-footer a:hover { color: var(--lp-link-hover); }
```

Notas:
- Los mensajes de error/success usan los hex del tema oscuro directamente (`#EF9A9A`/`#81C784` — mismos valores que `--danger-text`/`--success-text` dark) porque la landing no puede depender de tokens que cambian con `data-theme`.
- `#auth-screen` pierde `position:fixed`/`z-index:9999`/`display:flex` — es una página. `auth.js` (Task 4) pasa a mostrar con `display:'block'`.
- `.lp-brand-icon .icon` fija `stroke-width: 1.8` (el sprite usa el default 2).

- [ ] **Step 4: Eliminar los restos del CSS viejo**

1. En el tier ≤480 (~1472–1473): borrar `.auth-card { padding: 24px 20px; }` y `#auth-screen { padding: 12px; }`.
2. Borrar la regla vieja `.auth-privacy-link` + su `:hover` (~2377–2386) — la nueva vive en la sección de la landing.
3. Verificar que NO queden reglas `.auth-lang-switcher`, `.auth-logo`, `.auth-logo-icon`, `.auth-logo-title`, `.auth-logo-sub` (el markup ya no las usa): `grep -n "auth-logo\|auth-lang" css/styles.css` debe devolver vacío.

- [ ] **Step 5: Correr harness + validador de contraste**

Run: `node scripts/verify-runtime.js && node scripts/validate-contrast.js`
Expected: PASS ambos (contraste no parsea los `--lp-*` scoped; los checks N12/N13 viejos siguen en verde porque `.auth-field input` conserva `1rem`).

- [ ] **Step 6: Commit**

```bash
git add css/styles.css scripts/verify-runtime.js
git commit -m "feat(landing): estilos de la landing — tokens --lp-* dark-only, fluida sin media queries"
```

---

### Task 4: `auth.js` — modo registro por defecto, display block, CTAs

**Files:**
- Modify: `js/auth.js` — línea 19 (`_mode`), `init()` (~23–33), `_showAuthScreen()` (~105–108), `_setAuthLang()` (~290–297), `_bindEvents()` (~310)
- Test: `scripts/verify-runtime.js` — checks N24-auth

**Interfaces:**
- Consumes: ids `lpSigninLink`, `lpCtaBtn`, `acceso` (Task 2); scroll suave CSS (Task 3).
- Produces: helper `Auth._goToAuthCard(mode)` (privado; lo referencian los checks N24).

- [ ] **Step 1: Escribir los checks N24-auth (fallarán)**

En la sección N24 (los estáticos; para behavioral reutiliza el contexto con que N3/N7 cargan `Auth`):

```js
{
  const authSrc = fs.readFileSync(path.join(ROOT, 'js', 'auth.js'), 'utf8');
  check('N24 auth: _showAuthScreen muestra con display block (landing scrolleable)',
    /_showAuthScreen\(\) \{[^}]*'block'/.test(authSrc)
    && !/_showAuthScreen\(\) \{[^}]*'flex'/.test(authSrc));
  check('N24 auth: modo por defecto register', /_mode: 'register'/.test(authSrc));
  check('N24 auth: CTAs de la landing cableados (_goToAuthCard + lpSigninLink + lpCtaBtn)',
    /_goToAuthCard/.test(authSrc) && /lpSigninLink/.test(authSrc) && /lpCtaBtn/.test(authSrc));
  check('N24 auth: scrollIntoView y focus con typeof-guard (DOM mockeado)',
    /typeof card\.scrollIntoView === 'function'/.test(authSrc)
    && /typeof email\.focus === 'function'/.test(authSrc));
  check('N24 auth: aria-pressed sincronizado en el switcher',
    /aria-pressed/.test(authSrc));
  check('N24 auth: authSubmit se retraduce en init (gap preexistente)',
    /init\(\)[\s\S]{0,900}authSubmit/.test(authSrc));
}
```

Behavioral (mismo patrón de carga que N7): tras cargar `Auth` y llamar `ctx.Auth._switchMode('login')`, asertar que `tabLogin` tiene la clase `active` y `fieldName.style.display === 'none'`; tras `_switchMode('register')`, lo inverso. (Si N7 ya cubre parte, no dupliques — añade solo lo que falte.)

- [ ] **Step 2: Correr el harness y verificar que N24-auth falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL solo en N24-auth.

- [ ] **Step 3: Implementar los cambios en `auth.js`**

1. Línea 19: `_mode: 'login',` → `_mode: 'register', // 'login' | 'register' — la landing abre en registro (visitante nuevo)`

2. En `init()`, dentro del guard `if (typeof i18n !== 'undefined') { … }` existente, añadir al final del bloque:

```js
      // authSubmit no lleva data-i18n (su texto depende del modo) — sin esto,
      // un idioma restaurado distinto de ES lo dejaba en español al arrancar.
      document.getElementById('authSubmit').textContent =
        i18n.t(this._mode === 'login' ? 'auth_login_tab' : 'auth_submit_register');
      document.getElementById('authBtnES').setAttribute('aria-pressed', String(i18n.lang === 'es'));
      document.getElementById('authBtnEN').setAttribute('aria-pressed', String(i18n.lang === 'en'));
```

3. `_showAuthScreen()`: `style.display = 'flex'` → `style.display = 'block'`.

4. En `_setAuthLang(lang)`, tras los dos `classList.toggle`, añadir:

```js
    document.getElementById('authBtnES').setAttribute('aria-pressed', String(lang === 'es'));
    document.getElementById('authBtnEN').setAttribute('aria-pressed', String(lang === 'en'));
```

5. Nuevo método privado, junto a `_switchMode` (después de él):

```js
  // CTAs de la landing: llevan a la tarjeta en el modo pedido y enfocan el
  // email. El scroll suave lo da el CSS (scroll-behavior con guard de
  // reduced-motion); typeof-guards para el DOM mockeado del harness.
  _goToAuthCard(mode) {
    this._switchMode(mode);
    const card = document.getElementById('acceso');
    if (card && typeof card.scrollIntoView === 'function') {
      card.scrollIntoView({ block: 'center' });
    }
    const email = document.getElementById('authEmail');
    if (email && typeof email.focus === 'function') {
      email.focus({ preventScroll: true });
    }
  },
```

6. En `_bindEvents()`, tras los listeners de tabs (líneas ~311–312):

```js
    // Landing: header "Iniciar sesión" y CTA final "Crear cuenta gratis".
    // preventDefault: el href="#acceso" queda como fallback sin JS.
    const signinLink = document.getElementById('lpSigninLink');
    if (signinLink) signinLink.addEventListener('click', (e) => { e.preventDefault(); this._goToAuthCard('login'); });
    const ctaBtn = document.getElementById('lpCtaBtn');
    if (ctaBtn) ctaBtn.addEventListener('click', (e) => { e.preventDefault(); this._goToAuthCard('register'); });
```

- [ ] **Step 4: Correr el harness completo**

Run: `node scripts/verify-runtime.js`
Expected: PASS total. Atención a N3/N7: cargan `auth.js` real — si el mock no implementa `setAttribute` en esos elementos, amplía el mock del harness, no metas más guards en `auth.js` (`setAttribute` es DOM básico que i18n.apply ya usa).

- [ ] **Step 5: Prueba manual rápida en navegador**

Run: `python -m http.server 8000` y abrir `http://localhost:8000`.
Verificar: la landing renderiza completa; tab por defecto Registrarse con campo Nombre visible; "Iniciar sesión" del header hace scroll suave + cambia a login + enfoca email; "Crear cuenta gratis" igual con registro; ES/EN traduce toda la página al instante; con sesión iniciada se salta la landing (nota: el login real contra Supabase desde localhost NO funcionará — el redirect allowlist solo tiene producción — pero el toggle de pantallas se puede verificar con una sesión ya guardada o revisando que `_hideAuthScreen` no cambió).

- [ ] **Step 6: Commit**

```bash
git add js/auth.js scripts/verify-runtime.js
git commit -m "feat(landing): registro por defecto, CTAs con scroll al acceso y aria-pressed en el switcher"
```

---

### Task 5: Gate responsive de la landing

**Files:**
- Modify: `scripts/validate-responsive.js` — dentro del bucle de widths (justo tras el primer `page.goto(base, …)` de ~línea 136, ANTES de `bypassAuth(page)`), y un bloque desktop 1195 nuevo tras el bucle principal

**Interfaces:**
- Consumes: ids/clases de la landing (Task 2), CSS fluido (Task 3).

- [ ] **Step 1: Añadir los asserts de la landing en el bucle móvil**

Entre `page.goto(...)` y `bypassAuth(page)` insertar:

```js
      // LANDING PÚBLICA (2026-07-25): se mide ANTES del bypass de auth —
      // es la única vista que un usuario sin sesión ve.
      const lp = await page.evaluate(() => {
        const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { w: b.width, h: b.height }; };
        return {
          sw: document.documentElement.scrollWidth,
          cw: document.documentElement.clientWidth,
          signin: r(document.getElementById('lpSigninLink')),
          langES: r(document.getElementById('authBtnES')),
          tabReg: r(document.getElementById('tabRegister')),
          submit: r(document.getElementById('authSubmit')),
          cta: r(document.getElementById('lpCtaBtn')),
          steps: document.querySelectorAll('.lp-step').length,
        };
      });
      assert(width, 'landing sin scroll horizontal', lp.sw <= lp.cw, `sw=${lp.sw} cw=${lp.cw}`);
      const lpGe44 = (b) => b && b.h >= 44;
      assert(width, 'landing: targets ≥44px de alto (signin/lang/tab/submit/cta)',
        [lp.signin, lp.langES, lp.tabReg, lp.submit, lp.cta].every(lpGe44),
        JSON.stringify({ signin: lp.signin, langES: lp.langES, tabReg: lp.tabReg, submit: lp.submit, cta: lp.cta }));
      assert(width, 'landing: timeline con 6 pasos renderizados', lp.steps === 6);
```

(El `authBtnES` alcanza 44px por la regla `pointer: coarse` existente — los contextos del bucle llevan `hasTouch: true`.)

- [ ] **Step 2: Añadir la pasada desktop 1195**

Tras el bucle principal de widths (localiza dónde se cierra el `for` antes del resumen final), añadir:

```js
  // Landing a ancho desktop (1195 = captura del handoff): sin overflow.
  {
    const ctxDesk = await browser.newContext({ viewport: { width: 1195, height: 800 } });
    const pDesk = await ctxDesk.newPage();
    await pDesk.goto(base, { waitUntil: 'domcontentloaded' });
    const m = await pDesk.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    assert(1195, 'landing desktop sin scroll horizontal', m.sw <= m.cw, `sw=${m.sw} cw=${m.cw}`);
    await ctxDesk.close();
  }
```

Adapta nombres (`browser`, `base`, `assert`) a los reales del script — están definidos en su cabecera.

- [ ] **Step 3: Correr el gate completo**

Run: `node scripts/validate-responsive.js`
Expected: PASS (o `SKIP: Playwright no disponible` — en ese caso instala/verifica Playwright antes de seguir, este task no puede darse por hecho con un SKIP).

- [ ] **Step 4: Commit**

```bash
git add scripts/validate-responsive.js
git commit -m "test(landing): gate responsive de la landing — overflow, targets y timeline en 320-1195"
```

---

### Task 6: Verificación visual, documentación y despliegue

**Files:**
- Modify: `CLAUDE.md` (nueva sección tras "Celebración de módulo…"; actualizar el conteo i18n 196 → 231 en la sección i18n)
- No code changes salvo los que salgan de la verificación visual.

- [ ] **Step 1: Verificación visual contra el handoff**

Con `python -m http.server 8000` y Playwright (o manualmente en Chromium), capturar la landing a **1195px** y **390px** y compararlas lado a lado con `design_handoff_landing_istqb/design-reference/landing-desktop.png` y `landing-mobile.png`. El handoff es high-fidelity: tipografías, espaciados, radios y colores deben coincidir al pixel (única desviación esperada: inputs a 16px y el campo Nombre visible en registro). Corregir cualquier desviación en `css/styles.css` y re-correr `node scripts/verify-runtime.js` antes de commitear los ajustes.

- [ ] **Step 2: Correr TODOS los gates una última vez**

```bash
node scripts/validate-questions.js && node scripts/validate-content.js && node scripts/verify-runtime.js && node scripts/validate-contrast.js && node scripts/validate-responsive.js
```
Expected: PASS los cinco.

- [ ] **Step 3: Documentar en CLAUDE.md**

Añadir tras la sección de la celebración una sección "Landing pública (2026-07-25)" que cubra como mínimo: enfoque A (landing = `#auth-screen` transformado, tarjeta con ids intactos), tokens `--lp-*` scoped dark-only, fluida sin media queries, fuentes Space Grotesk/Manrope solo-landing, tab default registro, `navigator.language` en primera visita, la desviación 16px/N13, el traslado de la regla `.auth-privacy-link`, el gap de `authSubmit` en init arreglado, y el gate N24 + asserts responsive. Actualizar el conteo de claves en la sección i18n (196 → 231 con la fecha).

```bash
git add CLAUDE.md
git commit -m "docs: documenta la landing publica — enfoque, tokens lp, gates N24 y desviaciones deliberadas"
```

- [ ] **Step 4: Push y deploy**

```bash
git push
vercel deploy --prod --yes
```
Árbol limpio antes del deploy. En la red corporativa Inditex: `$env:NODE_EXTRA_CA_CERTS="C:\Users\<user>\.certs\corporate-ca.pem"` primero (nunca `NODE_TLS_REJECT_UNAUTHORIZED=0`).

- [ ] **Step 5: Verificar producción**

```bash
curl -s https://mycampusistqb.vercel.app/ | grep -c "lp-hero"
curl -s https://mycampusistqb.vercel.app/js/i18n.js | grep -c "lp_cta_btn"
```
Expected: ambos ≥ 1. Verificación manual final en el navegador (landing visible sin sesión, login intacto, ES/EN, scroll de CTAs).
