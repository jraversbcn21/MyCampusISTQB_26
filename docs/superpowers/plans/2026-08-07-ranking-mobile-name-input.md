# Campo de nombre legible en `.ranking-controls` en móvil — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** En ≤480px, el input del nombre en `.ranking-controls` ocupa su propia fila a ancho completo (los botones caen debajo a partes iguales), de modo que el nombre guardado se vea entero en móvil.

**Architecture:** Fix CSS puro en el tier `@media (max-width: 480px)` de `css/styles.css`, dentro del bloque de ranking ya existente (~línea 1536), con prefijo `#view-ranking` (trampa de cascada: el tier va ANTES que la sección base RANKING ~2479, sin el id la regla base ganaría por orden de fuente). Gate estático nuevo en la familia N27 de `scripts/verify-runtime.js`. Sin cambios en JS ni markup.

**Tech Stack:** CSS vanilla, Node (verify-runtime.js), Playwright/Chromium solo para la evidencia visual.

**Spec:** `docs/superpowers/specs/2026-08-07-ranking-mobile-name-input-design.md`

## Global Constraints

- Prefijo `#view-ranking` obligatorio en todo override del tier 480 de ranking (CLAUDE.md, "el tercer caso del cascade trap").
- Checks de orden/presencia de CSS anclados a regla real `/#view-ranking \.ranking-controls #rkNameInput \{/`, **nunca** `includes()` (lección N19/N21).
- No tocar `.ranking-optin` (ya es columna con `align-items: stretch`).
- No añadir CSS después del bloque `:focus-visible` del tail del archivo (aquí no aplica: se edita dentro del tier 480, muy antes del tail).
- Pre-commit hook activo: al commitear `css/styles.css` + `scripts/verify-runtime.js` correrán solos `validate-contrast.js` y el arnés — un fallo bloquea el commit.

---

### Task 1: Override CSS del tier 480 + check N27 (TDD)

**Files:**
- Modify: `scripts/verify-runtime.js` (bloque `N27 css/responsive`, tras el check de la línea ~2052)
- Modify: `css/styles.css` (tier ≤480px, bloque ranking, tras la línea ~1537)

**Interfaces:**
- Consumes: `cssSrc` (ya definido en el bloque N27 css de verify-runtime.js, línea ~2044).
- Produces: nada que consuman tareas posteriores (Task 2 solo verifica visualmente).

- [ ] **Step 1: Escribir el check que falla**

En `scripts/verify-runtime.js`, justo después del check `'N27 css: overrides del tier 480 con prefijo #view-ranking …'` (~línea 2053), añadir:

```js
    check('N27 css: input del nombre a fila completa en el tier 480 (móvil: los botones caen debajo)',
      (() => {
        const m = cssSrc.match(/#view-ranking \.ranking-controls #rkNameInput \{([^}]*)\}/);
        return !!m && /flex-basis:\s*100%/.test(m[1])
          && /#view-ranking \.ranking-controls \.rk-rename-btn,\s*\n?\s*#view-ranking \.ranking-controls \.rk-leave-btn \{[^}]*flex:\s*1/.test(cssSrc);
      })());
```

- [ ] **Step 2: Verificar que falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL con exactamente 1 check en rojo — `N27 css: input del nombre a fila completa en el tier 480 …` (el resto en verde).

- [ ] **Step 3: Añadir el CSS mínimo**

En `css/styles.css`, dentro del tier `@media (max-width: 480px)`, justo después de `#view-ranking .ranking-table th, #view-ranking .ranking-table td { padding: 8px; }` (~línea 1537), añadir:

```css
  /* Fix 2026-08-07: en el panel de controles (estado opt-in) el input comparte
     fila flex con dos botones anchos y, con min-width:0, se encogía a ~60px en
     vez de saltar de línea (solo se veía "Joi" de "Jorge Indi"). A fila
     completa el nombre se ve entero; los botones caen debajo a partes iguales
     (el flex-wrap de la base los apila si aun así no cupieran). */
  #view-ranking .ranking-controls #rkNameInput { flex-basis: 100%; }
  #view-ranking .ranking-controls .rk-rename-btn,
  #view-ranking .ranking-controls .rk-leave-btn { flex: 1; }
```

- [ ] **Step 4: Verificar que pasa**

Run: `node scripts/verify-runtime.js`
Expected: PASS — todos los checks en verde, incluido el nuevo.

- [ ] **Step 5: Gates de CSS restantes**

Run: `node scripts/validate-contrast.js`
Expected: PASS (no hay colores nuevos, pero el gate corre en el hook igualmente — verificarlo antes).

- [ ] **Step 6: Commit**

```bash
git add css/styles.css scripts/verify-runtime.js
git commit -m "fix(ranking): input del nombre a fila completa en movil (tier 480)"
```

(El pre-commit hook re-ejecuta contrast + arnés sobre lo staged; si bloquea, NO usar --no-verify — diagnosticar.)

---

### Task 2: Evidencia visual a 390px + sync CLAUDE.md + deploy

**Files:**
- Create (temporal, en el scratchpad de la sesión — NUNCA en el repo): `rk-visual.js`
- Modify: `CLAUDE.md` (sección "Ranking global por XP", párrafo "Pulido post-lanzamiento")

**Interfaces:**
- Consumes: el CSS de Task 1 ya committeado.
- Produces: captura PNG como evidencia; CLAUDE.md sincronizado; deploy a producción.

- [ ] **Step 1: Script de evidencia visual (temporal, scratchpad)**

Escribir `rk-visual.js` en el directorio scratchpad de la sesión con este contenido (adaptación mínima del server + bypass de `scripts/validate-responsive.js`; `supabaseClient` es un `let` de script clásico en `js/auth.js:11`, así que la asignación bare desde `page.evaluate` lo stubea):

```js
const http = require('http');
const fs = require('fs');
const path = require('path');
const REPO = 'C:/repositorio/MyCampusISTQB_26';
let playwright;
try { playwright = require('playwright'); }
catch (e) { playwright = require(require.resolve('playwright', { paths: [REPO] })); }

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const fp = path.normalize(path.join(REPO, urlPath === '/' ? 'index.html' : urlPath));
      if (!fp.startsWith(path.normalize(REPO))) { res.writeHead(403); res.end(); return; }
      fs.readFile(fp, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

(async () => {
  const { server, port } = await startServer();
  const browser = await playwright.chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-ES' });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/index.html`);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('mycampus_onboarding_v1_undefined', '1');
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    App.init();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    supabaseClient = {};                       // truthy: pasa el guard de renderRanking
    App.state.rankingOptIn = true;
    App.state.rankingName = 'Jorge Indi';
    App._rankingFetch = async () => ({
      rows: [
        { user_id: 'me', display_name: 'Jorge Indi', xp: 3830 },
        { user_id: 'u2', display_name: 'Josemir', xp: 330 }
      ],
      myPos: 1, total: 2
    });
    App.navigate('ranking');
  });
  await page.waitForTimeout(400);
  const inputBox = await page.locator('#rkNameInput').boundingBox();
  const cardBox = await page.locator('.ranking-controls').boundingBox();
  console.log(`input width: ${inputBox.width}px / panel: ${cardBox.width}px`);
  if (inputBox.width < cardBox.width * 0.8) {
    console.error('FAIL: el input no ocupa la fila completa');
    process.exitCode = 1;
  } else {
    console.log('OK: input a fila completa');
  }
  await page.screenshot({ path: path.join(__dirname, 'rk-390.png') });
  await browser.close();
  server.close();
})();
```

- [ ] **Step 2: Ejecutarlo y revisar la captura**

Run: `node <scratchpad>/rk-visual.js`
Expected: `OK: input a fila completa` con el ancho del input ≥80% del panel; abrir/adjuntar `rk-390.png` y confirmar visualmente: input con "Jorge Indi" entero en su fila, "Guardar nombre" y "Salir del ranking" debajo a partes iguales. Si Playwright no está disponible ni siquiera vía `require.resolve` desde el repo, anotarlo y verificar en el dispositivo real tras el deploy (mismo criterio que el fix de rotación 2026-08-06).

- [ ] **Step 3: Sync CLAUDE.md**

En la sección "Ranking global por XP (2026-08-06)", ampliar el párrafo **"Pulido post-lanzamiento"** añadiendo al final (antes de "Verificado en producción…", dejando esa frase como cierre):

```markdown
En móvil (reporte de Jorge en dispositivo real, 2026-08-07): en `.ranking-controls` el
input del nombre compartía fila con los dos botones y con `min-width: 0` se encogía a
~60px en vez de saltar de línea (de "Jorge Indi" solo se veía "Joi") — en el tier 480,
`#view-ranking .ranking-controls #rkNameInput` pasa a `flex-basis: 100%` (fila propia) y
los botones a `flex: 1` (segunda fila a partes iguales). Se descartó mostrar iniciales:
el campo es el input editable del rename, no un display. Check propio en N27.
```

- [ ] **Step 4: Commit de docs**

```bash
git add CLAUDE.md
git commit -m "docs: sincroniza CLAUDE.md — fix movil del input del nombre del ranking"
```

- [ ] **Step 5: Deploy a producción**

Árbol limpio y committeado, luego:

```powershell
vercel deploy --prod --yes
```

Si estamos en la red corporativa Inditex y falla con `fetch failed`/`SELF_SIGNED_CERT_IN_CHAIN`:

```powershell
$env:NODE_EXTRA_CA_CERTS="$env:USERPROFILE\.certs\corporate-ca.pem"; vercel deploy --prod --yes
```

(Nunca `NODE_TLS_REJECT_UNAUTHORIZED=0`.)

- [ ] **Step 6: Push**

```bash
git push
```

Expected: master al día en GitHub; producción desplegada desde el mismo commit.
