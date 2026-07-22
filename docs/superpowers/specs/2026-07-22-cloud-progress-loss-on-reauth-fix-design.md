# Fix: pérdida permanente de progreso en la nube al re-loguearse (estado vacío pisa la nube)

**Fecha:** 2026-07-22
**Tipo:** Bugfix (pérdida de datos) — no es feature.
**Alcance aprobado por el dueño:** solo el fix + su regresión. El export/import manual queda como follow-up aparte.
**Ejecución:** directa con TDD (sin subagentes).

## Síntoma reportado

Un usuario con "medio campus hecho" hace **Application → Storage → Clear site data** en el
inspector, vuelve a iniciar sesión, y su progreso **no vuelve** — ni en local ni en la nube.
La copia de Supabase, que debería restaurarlo, aparece vacía.

## Causa raíz (confirmada por lectura de código)

En el arranque tras "Clear site data", con `App._initialized === false`
(`auth.js:_onAuthSuccess`):

1. `auth.js:153` — `App.loadState()` lee un localStorage vacío → devuelve el estado inicial
   por defecto (`xp:0`, todo vacío, **sin `_updatedAt`**).
2. `auth.js:154` — `App.init(estadoVacío)` corre **síncronamente**. Dentro, en `app.js:1564`,
   `init()` llama a `updateStreakAndDate()`.
3. `app.js:92-104` — como el estado vacío tiene `lastStudyDate === null` (`!== today`), entra
   en la rama, fija la racha y llama a `saveState()`.
4. `sync.js:70-84` — `saveState()` **sella el estado vacío con `_updatedAt = Date.now()`
   (fresco)** y lo escribe en localStorage al instante.
5. `auth.js:164` — arranca en segundo plano `Sync.loadState()`, que **relee** localStorage →
   encuentra el estado vacío con sello fresco (`localTs = ahora`). La nube tiene el progreso
   real pero con sello más viejo (`cloudTs < localTs`).
6. `sync.js:42-45` — como `localTs > cloudTs`, ejecuta `_push(userId, local)` → **sobrescribe
   la nube con el estado vacío**. Progreso destruido en la nube y en local.

**La invariante violada:** el mecanismo de frescura por `_updatedAt` asume "local con sello
más nuevo = progreso real más nuevo del usuario". Esa invariante se rompe porque
`updateStreakAndDate()` sella un estado **vacío** durante `init()`, **antes** de que la nube
se reconcilie con local en esta sesión.

### Race secundario (red lenta)

El `saveState()` del paso 4 también programa un push con debounce de 4 s. Si el fetch de
reconciliación tarda >4 s (red lenta), ese push del estado vacío puede aterrizar en la nube
**antes** de que `loadState` haga su `SELECT`, con el mismo resultado. Por eso el fix necesita
dos capas.

## Fix (dos capas, defense-in-depth)

### Capa 1 — la decisión de frescura usa un snapshot pre-init, no una relectura

`Sync.loadState` deja de fiarse de lo que haya en localStorage en el momento de resolver (ya
mutado por `init()`) y usa como autoridad el timestamp local **capturado antes de que `App.init`
pueda escribir**.

- `Sync.loadState(userId, localTsOverride)` — nuevo segundo parámetro **opcional**. Cuando se
  pasa, se usa como `localTs` en la comparación de frescura, en vez de
  `(local && local._updatedAt) || 0`.
- `auth.js:_onAuthSuccess`, rama fresca (`!App._initialized`): capturar
  `const preInitLocalTs = (localState && localState._updatedAt) || 0;` **en la línea 153,
  antes de `App.init`** (importante: no basta con guardar la referencia `localState` — `init`
  la muta; hay que guardar el número). Pasar `preInitLocalTs` a `Sync.loadState(user.id, preInitLocalTs)`.
- Rama ya inicializada (`App._initialized`, `auth.js:178`): pasar
  `(App.state && App.state._updatedAt) || 0`.
- Compatibilidad: sin el parámetro, el comportamiento es idéntico al actual (relee de
  `local`), así que ningún otro llamador se rompe.

Efecto: arranque vacío tras "clear" → `preInitLocalTs = 0` → `0 > cloudTs` es falso → **gana la
nube**, se restaura y se re-cachea en localStorage. El caso multi-dispositivo (local con
progreso real y sello genuino más nuevo) sigue ganando, porque su `preInitLocalTs` es real.

### Capa 2 — no empujar a la nube antes de reconciliar (gate `_reconciled`)

Ningún push originado por `App` (streak de arranque, cambios en la ventana previa a la
reconciliación) debe llegar a la nube hasta que la reconciliación termine. Escribir en
localStorage sí (no perdemos nada local); solo se difiere el push a la nube.

- `Sync._reconciled` — flag de módulo, inicial `false`.
- `Sync.saveState(userId, state)`: sella `_updatedAt` y escribe localStorage **siempre**
  (como hoy); pero **solo programa el push con debounce si `this._reconciled === true`**.
- El listener de `visibilitychange` (`sync.js:138`) y `flushNow` también respetan
  `_reconciled` (no hacen push keepalive mientras esté `false`).
- **No se toca el `_push` interno de `loadState`** (la re-subida cuando local gana
  legítimamente ES la reconciliación): el gate vive en `saveState`/visibilitychange/flush,
  no dentro de `_push`.
- `auth.js:_onAuthSuccess`: poner `Sync._reconciled = false` justo antes de llamar a
  `Sync.loadState` (ambas ramas) y `Sync._reconciled = true` en el `.finally` de la
  reconciliación (se ejecuta también en error → nunca deja el push bloqueado para siempre).
  Tras ponerlo a `true`, disparar un `App.saveState()` para volcar el estado ya reconciliado
  (más cualquier cambio hecho en la ventana) a la nube.

Efecto: aunque el debounce de 4 s del streak de arranque expire, no empuja nada mientras
`_reconciled` sea `false`; y en cuanto la nube se reconcilia, el estado correcto se vuelca.

### Capa 3 — la decisión de "aplicar la nube" no se deja engañar por el sello de init

Al trazar la ruta real `_onAuthSuccess` → `.then` → `.finally` (que el arnés no puede correr
entera, porque `App.init` necesita un DOM real) aparece el mismo bug por otra puerta: el guard
original del `.then` (`cloudState._updatedAt >= App.state._updatedAt`) compara contra
`App.state`, que init ya selló fresco sobre el vacío (T1) — la nube real es más vieja
(Tcloud < T1) → el guard es falso → `App.state` se queda vacío → el `.finally` hace
`App.saveState()` y **re-sube el vacío a la nube**.

Se reemplaza ese guard por `Auth._shouldApplyCloud(cloudState, hadLocalBase, appStateTs,
postInitTs)`, un helper **puro y testeable**:

- Sin `cloudState` (usuario nuevo, sin fila en la nube): no aplicar, conservar local.
- **Sin base local** (`preInitLocalTs === 0`, arranque tras "Clear site data"): aplicar
  **siempre** la nube — cualquier acción hecha en la ventana se hizo sobre un estado vacío
  incompleto y no debe pisar el progreso real.
- Con base local real: aplicar la copia ganadora salvo que el usuario haya hecho un cambio
  genuino en la ventana (`appStateTs > postInitTs`, siendo `postInitTs` el sello de `App.state`
  capturado justo tras `App.init`).

`postInitTs` se captura en `auth.js` inmediatamente después de `App.init`; `hadLocalBase` es
`preInitLocalTs > 0`.

### Por qué las capas y no una

- Capa 1 sola: no cubre el race de red lenta (el push con debounce del estado vacío no pasa
  por `loadState`), ni la re-subida del vacío por el `.finally`.
- Capa 2 sola: evita empujar el vacío, pero `loadState` seguiría pudiendo elegir mal si releyera
  el localStorage ya mutado. Capa 1 endurece esa decisión.
- Capa 3 sola: sin Capa 1, `loadState` ya habría re-subido el vacío antes de decidir aplicar.

Juntas garantizan: **ningún estado local pre-reconciliación puede pisar la nube, la decisión
de frescura no se deja engañar por escrituras de `init()`, y el estado que finalmente se vuelca
es el reconciliado.**

## Preservación de comportamientos existentes

- Multi-dispositivo (nube más nueva gana / local real más nuevo gana): intacto — verificado
  por los checks N1 existentes, que deben seguir en verde.
- Cambios hechos por el usuario en la ventana de reconciliación (con base local real):
  preservados por `Auth._shouldApplyCloud` (Capa 3) más el volcado final de la Capa 2.
- Racha de bienvenida: se sigue calculando; solo se difiere su push a la nube.

## Regresión — familia `N22` en `scripts/verify-runtime.js`

Comportamentales (calcando el patrón de N1, con `makeSupabaseMock({ singleResult })` +
`_calls.upserts`):

1. **Repro del bug:** localStorage con estado vacío sellado fresco (`_updatedAt` alto), nube
   con datos reales (`_updatedAt` bajo). `Sync.loadState('u1', 0)` → resultado = datos de la
   nube (xp real), y **no** hay upsert que suba el estado vacío por encima de la nube.
2. **Gate de push:** con `Sync._reconciled = false`, `Sync.saveState` escribe localStorage
   pero **no** deja push pendiente (ni upsert ni fetch keepalive tras `visibilitychange`).
   Con `_reconciled = true`, sí.
3. **Multi-dispositivo intacto:** `Sync.loadState('u1', 2000)` con nube en `_updatedAt:1000`
   → gana local (re-sube). (Refuerza N1 con el nuevo parámetro.)

Decisión de aplicar la nube (`Auth._shouldApplyCloud`, puro — cubre la ruta `.then`/`.finally`
que el arnés no puede correr entera):

4. Arranque sin base local (`hadLocalBase=false`) con la nube sellada más vieja que el vacío
   de init → aplica la nube (el guard viejo no lo hacía).
5. Base local real sin cambio in-window → aplica; con cambio in-window → conserva local;
   sin copia en la nube → conserva local.

Estáticos:

6. `Sync.loadState` acepta y respeta el segundo parámetro (override de `localTs`).
7. `auth.js` captura el ts pre-init, lo pasa a `loadState`, usa `_shouldApplyCloud`, y pone
   `_reconciled` a `false` antes y a `true` en el `.finally`.

## Fuera de alcance

- Export/import manual de progreso a archivo (follow-up aparte, decidido por el dueño).
- Cualquier cambio en el modelo de datos o en el esquema de Supabase.

## Docs a actualizar en el mismo commit

- `CLAUDE.md` — nota del fix bajo la sección de State & Data Flow / arquitectura de sync.
- `AGENTS.md` — detalle de la causa raíz y el gate `_reconciled` (donde vive el detalle de sync).
