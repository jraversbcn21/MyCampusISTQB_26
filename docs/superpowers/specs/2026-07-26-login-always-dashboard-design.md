# Login/registro siempre al dashboard

**Fecha:** 2026-07-26

## Problema

La vista actual se persiste en localStorage (`mycampus_current_view`, feature View
Persistence) y **sobrevive al logout**. Al volver a iniciar sesión, `App.init()`
(app.js:1570-1580) y la re-navegación post-sync de `_onAuthSuccess`
(`App.navigate(App.currentView || 'dashboard')`) restauran esa vista guardada — un usuario
que cerró sesión en Simulacros aterriza en Simulacros al volver a entrar. Reportado por
Jorge tras probar el login en producción (2026-07-26).

## Decisiones cerradas con Jorge

1. **Login/registro (interactivo) → SIEMPRE dashboard.** Sin excepciones.
2. **F5/recarga con sesión activa → conserva el comportamiento actual** (View Persistence
   devuelve a la lección/vista donde estabas). La feature no se toca para ese caso.

## Diseño

**Mecanismo: limpiar `mycampus_current_view` en el momento de quedarse sin sesión**, no al
hacer login. Con la clave ausente, el flujo existente ya hace lo correcto sin más cambios:
`App.init()` cae a `navigate('dashboard')` y la re-navegación post-sync resuelve a
`'dashboard'` porque `App.currentView` ya es `'dashboard'`.

**Dos puntos de limpieza en `js/auth.js`** — los dos sitios donde Supabase confirma que no
hay sesión:

1. Rama `SIGNED_OUT` de `onAuthStateChange` (~línea 65): cubre logout manual y expiración
   de sesión.
2. Rama `else` de `getSession()` en `init()` (~línea 78): cubre arrancar sin sesión (token
   borrado a mano, primer arranque tras limpiar credenciales) para que un login posterior
   en esa pestaña no herede una vista vieja.

El `removeItem` va con `try/catch` (disciplina del repo para localStorage).

**Deliberadamente NO se limpia dentro de `_showAuthScreen()`:** la ruta de fallo de CDN
(`_showLoadFailure`) también muestra esa pantalla y ahí no se sabe si el usuario tiene
sesión — un fallo temporal de red no debe borrar la vista guardada de alguien logueado.

**Intacto:** View Persistence en recarga con sesión; `_expandedChapters`; todo el flujo de
sync/reconciliación (`_onAuthSuccess` no se toca); registro (usuario nuevo no tiene vista
guardada — ya aterrizaba en dashboard).

## Verificación

Familia **N25** en `scripts/verify-runtime.js` (behavioral — el harness ya captura el
callback de `onAuthStateChange` en `calls.authStateCb` y mockea localStorage):

- Disparar `SIGNED_OUT` → `mycampus_current_view` eliminada.
- Boot sin sesión (getSession → null) → eliminada.
- Boot CON sesión → la clave **sobrevive** (la recarga no limpia — protege la decisión 2).
- Estático: el `removeItem` existe en las dos ramas y NO en `_showAuthScreen`.

Actualizar la sección View Persistence de CLAUDE.md en el mismo cambio. Deploy a Vercel al
terminar (afecta a usuarios).

## Fuera de alcance

- Cambiar el comportamiento de recarga con sesión.
- Cualquier otro aspecto del flujo de auth o de la landing.
