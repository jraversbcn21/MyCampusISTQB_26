# Login siempre al dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que todo login/registro aterrice siempre en el dashboard, conservando la restauración de vista en recargas con sesión.

**Architecture:** Limpiar `mycampus_current_view` en los dos puntos de `js/auth.js` donde Supabase confirma que no hay sesión (rama `SIGNED_OUT` + rama else de `getSession()`); el flujo existente hace el resto. Gate N25 behavioral en el harness.

**Tech Stack:** Vanilla JS, `scripts/verify-runtime.js` (harness Node con DOM mockeado que ya captura `calls.authStateCb`).

**Spec:** `docs/superpowers/specs/2026-07-26-login-always-dashboard-design.md`

## Global Constraints

- CERO cambios en `_onAuthSuccess`, `_showAuthScreen`, `_showLoadFailure`, View Persistence de `js/app.js`, ni en ningún flujo de sync.
- La limpieza NUNCA va dentro de `_showAuthScreen()` (la ruta de fallo de CDN la mostraría sin saber si hay sesión).
- `removeItem` con `try/catch` (disciplina del repo para localStorage).
- Checks anclados a contenido real; el commit debe dejar `node scripts/verify-runtime.js` en verde (hook pre-commit).

---

### Task 1: Limpieza de vista guardada al quedarse sin sesión + gate N25 + docs

**Files:**
- Modify: `js/auth.js` (rama `SIGNED_OUT` ~línea 65-70; rama else de `getSession()` ~línea 78)
- Modify: `CLAUDE.md` (sección "View Persistence")
- Test: `scripts/verify-runtime.js` (nueva familia N25, tras N24)

**Interfaces:**
- Produces: helper privado `Auth._clearSavedView()` (lo referencian los checks N25).

- [ ] **Step 1: Escribir los checks N25 (fallarán)**

Al final de la sección N24 de `scripts/verify-runtime.js`, nueva sección N25. Estáticos:

```js
/* ---- N25: login siempre al dashboard (2026-07-26) ---- */
{
  const authSrc = fs.readFileSync(path.join(ROOT, 'js', 'auth.js'), 'utf8');
  check('N25 auth: helper _clearSavedView definido con try/catch',
    /_clearSavedView\(\) \{/.test(authSrc)
    && /_clearSavedView\(\) \{[^}]*try[^}]*mycampus_current_view/.test(authSrc));
  const signedOutBranch = authSrc.slice(authSrc.indexOf("'SIGNED_OUT'"), authSrc.indexOf('getSession'));
  check('N25 auth: SIGNED_OUT limpia la vista guardada',
    authSrc.indexOf("'SIGNED_OUT'") !== -1 && /_clearSavedView\(\)/.test(signedOutBranch));
  const showAuthBody = authSrc.slice(authSrc.indexOf('_showAuthScreen() {'), authSrc.indexOf('_hideAuthScreen'));
  check('N25 auth: _showAuthScreen NO limpia (ruta de fallo de CDN)',
    authSrc.indexOf('_showAuthScreen() {') !== -1 && !/_clearSavedView/.test(showAuthBody));
}
```

Behaviorales (reutiliza el mecanismo con el que N3/N7 cargan `Auth` con supabase mockeado — el mock ya captura el callback en `calls.authStateCb` y el harness inyecta localStorage mockeado):

```js
// (1) SIGNED_OUT elimina mycampus_current_view
//     - siembra ctx.localStorage con mycampus_current_view = '{"view":"simulator"}'
//     - corre Auth.init() (getSession mockeado → sesión null o como haga N7)
//     - dispara sb._calls.authStateCb('SIGNED_OUT', null)
//     - check: localStorage ya no contiene la clave
// (2) Boot sin sesión elimina la clave
//     - siembra la clave, Auth.init() con getSession → { session: null }
//     - check: clave eliminada tras el await de init
// (3) Boot CON sesión NO la elimina (protege View Persistence en recarga)
//     - siembra la clave, Auth.init() con getSession → sesión válida
//     - check: la clave SIGUE presente
```

Adapta la mecánica exacta (nombres `ctx`, `sb`, cómo se espera el async de init) a lo que ya
hacen los checks existentes que ejecutan `Auth.init()` — el patrón está en N3/N7 y en la
sección que dispara `authStateCb('SIGNED_OUT', …)` (~línea 369 hoy). Para el caso (3), ten en
cuenta que `_onAuthSuccess` arranca App/Sync mockeados — si el camino completo no es viable en
el mock, es válido asertar el punto equivalente: que ninguna línea de la rama `if (session)`
ni de `_onAuthSuccess` llama a `_clearSavedView` (estático), más los behaviorales (1) y (2).

- [ ] **Step 2: Correr el harness y verificar que N25 falla**

Run: `node scripts/verify-runtime.js`
Expected: FAIL solo en N25.

- [ ] **Step 3: Implementar en `js/auth.js`**

Nuevo helper privado, junto a `_showAuthScreen` (antes de él):

```js
  // Al quedarse sin sesión (logout, expiración, boot sin token) la vista
  // guardada se descarta: el siguiente login debe aterrizar SIEMPRE en el
  // dashboard (decisión 2026-07-26). La recarga CON sesión no pasa por aquí,
  // así que View Persistence sigue funcionando para F5 a mitad de estudio.
  // NO llamar desde _showAuthScreen: la ruta de fallo de CDN la muestra sin
  // saber si hay sesión y no debe borrar la vista de un usuario logueado.
  _clearSavedView() {
    try {
      localStorage.removeItem('mycampus_current_view');
    } catch (e) {}
  },
```

En la rama `SIGNED_OUT` (tras `this._authInProgress = false;`):

```js
        this._clearSavedView();
```

En la rama else de `getSession()`:

```js
    } else {
      this._clearSavedView();
      this._showAuthScreen();
    }
```

- [ ] **Step 4: Correr el harness completo**

Run: `node scripts/verify-runtime.js`
Expected: PASS total (N1–N25).

- [ ] **Step 5: Actualizar CLAUDE.md**

En la sección "View Persistence", añadir al final:

> Desde 2026-07-26 la vista guardada se **descarta al quedarse sin sesión**
> (`Auth._clearSavedView()` en la rama `SIGNED_OUT` y en el boot sin sesión — nunca en
> `_showAuthScreen`, que también se muestra en la ruta de fallo de CDN sin saber si hay
> sesión): todo login/registro aterriza siempre en el dashboard. La restauración de vista
> queda solo para recargas CON sesión activa (F5 a mitad de lección). Gate: familia `N25`.

- [ ] **Step 6: Commit**

```bash
git add js/auth.js scripts/verify-runtime.js CLAUDE.md
git commit -m "fix(auth): login y registro aterrizan siempre en el dashboard"
```
