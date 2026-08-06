# Ranking global por XP — diseño

**Fecha:** 2026-08-06
**Estado:** aprobado por Jorge (bloques 1 y 2 validados en conversación)
**Enfoque elegido:** Opción A — tabla dedicada `leaderboard` en Supabase (descartadas: B,
función `security definer` sobre `user_progress` — riesgo innecesario sobre los datos de
progreso; C, backend agregador — sobredimensionado).

## Objetivo

Nueva categoría **«Ranking»** en el nav: una clasificación global por XP acumulado donde los
usuarios que lo deseen se comparan con el resto. Participación **opt-in con nombre elegido**
(decisión de privacidad: hay usuarios reales cuyo nombre visible actual puede derivar del
nombre real de Google o del prefijo del email — no se expone nada sin consentimiento
explícito). Clasificación única por **XP total** (sin periodos semanales/mensuales: no existe
historial de XP con fechas y no se va a introducir; posible feature futuro separado).

## Decisiones cerradas

| Decisión | Valor |
|---|---|
| Identidad | Opt-in explícito; el usuario elige el nombre a mostrar (editable después) |
| Clasificación | Solo XP total; top 50 + posición propia si estás fuera del top |
| Fuente de datos | Tabla nueva `leaderboard`; `user_progress` y su RLS quedan intactos |
| Fuente de verdad del XP | `App.state.xp` — la tabla es una proyección refrescada por el sync |
| Visibilidad | Solo usuarios autenticados de la app (RLS `to authenticated`), nunca público anónimo |
| Opt-out | Borra la fila en el momento (limpio para GDPR) |

## Modelo de datos (SQL de dashboard, tarea manual como `user_progress`)

```sql
create table public.leaderboard (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 30),
  xp           integer not null default 0 check (xp >= 0 and xp <= 500000),
  updated_at   timestamptz not null default now()
);

alter table public.leaderboard enable row level security;

create policy "leaderboard_insert_own" on public.leaderboard
  for insert to authenticated with check (auth.uid() = user_id);
create policy "leaderboard_update_own" on public.leaderboard
  for update to authenticated using (auth.uid() = user_id);
create policy "leaderboard_delete_own" on public.leaderboard
  for delete to authenticated using (auth.uid() = user_id);
create policy "leaderboard_select_all" on public.leaderboard
  for select to authenticated using (true);

create index leaderboard_xp_desc on public.leaderboard (xp desc);
```

Notas:
- El `CHECK` de `xp` es una **cota de cordura anti-flexing**, no un máximo teórico: el XP es
  acumulable sin techo (reto diario +20, flashcards +10, exámenes repetibles), así que
  500 000 solo mata los valores absurdos inyectados por consola. Ajustable si algún usuario
  legítimo se acercara (hoy el top real está en ~3 000).
- El fraude fino (inflarse el XP dentro de la cota) no se puede impedir sin backend propio:
  el cliente escribe su XP. Riesgo asumido para un soft launch — igual que hoy puede
  falsearse el progreso propio; la cota limita el daño visible.
- `on delete cascade`: borrar un usuario en Supabase limpia su entrada del ranking sola.
- Verificación manual en el dashboard con el SQL real de las políticas (mismo procedimiento
  que la verificación RLS de `user_progress` del 2026-07-02), documentada en CLAUDE.md.

## Estado nuevo en `App.state`

- `rankingOptIn` (bool, default `false`) y `rankingName` (string, default `''`). Viajan en el
  JSONB existente → multi-dispositivo y conflicto-resolución gratis.
- **Guard de migración en el punto de uso** (estados legados y copias de nube sin los campos),
  nunca en `loadState` — misma lección que `celebratedChapters` (no fusiona defaults sobre
  estados guardados).

## Flujos

**Opt-in:** en la vista Ranking sin participar → panel con explicación de qué se publica
(nombre elegido + XP, visible para usuarios autenticados), campo de nombre pre-rellenado con
`App._getDisplayName()` (editable, 1–30 chars, validado también en cliente) y botón
«Participar» → `INSERT` de la fila + `rankingOptIn = true` / `rankingName` en el estado +
`saveState()`.

**Opt-out:** botón discreto «Salir del ranking» → `DELETE` de la fila propia +
`rankingOptIn = false` + `saveState()`. El nombre elegido se conserva en el estado por si
vuelve a entrar.

**Cambio de nombre:** edición en la propia vista → `UPDATE` de `display_name` + estado.

**Actualización del XP:** enganchada al ciclo de sync existente. Cuando `Sync` completa su
push debounced y `rankingOptIn === true`, hace un upsert de `{user_id, display_name, xp,
updated_at}` a `leaderboard`. **Posterior e independiente:** con su propio `catch`; un fallo
del upsert del ranking jamás bloquea ni contamina el sync del progreso. Sin tráfico extra
apreciable (mismo debounce de 4 s). El desfase de segundos entre XP real y tabla es
irrelevante para un ranking.

**Render de la vista:** `SELECT display_name, xp FROM leaderboard ORDER BY xp DESC LIMIT 50`
con `count: 'exact'` (supabase-js devuelve el total M en la misma petición) + (si participas
y no apareces en el top) un `count` de filas con `xp > <tuyo>` para «Tu posición: #N de M»
(N = superiores + 1). Fila propia resaltada si está en el top.

**Flush al cerrar la pestaña:** el listener `visibilitychange→hidden` de `sync.js` (keepalive
REST) **no** replica el upsert del ranking — deliberado: mantenerlo simple; la tabla se pone
al día en el siguiente sync con sesión abierta y el desfase es aceptable en un ranking.

## UI

- Item «Ranking» en el nav del sidebar (tras Achievements) + vista `ranking` en
  `index.html` — patrón `.view`/`App.navigate` (9.º nombre válido). `_saveCurrentView`
  la persiste como cualquier otra.
- Icono `#i-podium` nuevo en el sprite (patrón I8; **no** `#i-trophy`, que ya existe y lo
  usa el nav de Logros; jamás emoji como icono — gate N17. Ojo: el check N17 hardcodea la
  lista original de 26 símbolos, así que el símbolo nuevo se protege desde la familia N27,
  como se hizo con `#i-coffee`/N19).
- Top 50 en tabla semántica (`<table>` con `<th scope>`) — posición, nombre, XP. Sin
  medallas-emoji; posiciones como texto.
- **XSS (punto crítico):** los `display_name` ajenos son datos controlados por otros usuarios
  entrando a `innerHTML` — **todos pasan por `escapeHtml()`**, sin excepción (disciplina N4).
- i18n: claves `rk_*` ES/EN pareadas (paridad forzada por el arnés). A11y: targets ≥44px,
  tokens `--*-text` para colores de estado, interactivos de template con
  `role="button" tabindex="0"` (keydown delegado existente). Móvil: sin overflow horizontal a
  320/375/414 (la tabla es estrecha: nº + nombre truncable con ellipsis + XP; si hiciera
  falta, patrón `.table-scroll`).
- Degradación: sin `supabaseClient` o con el `SELECT` fallando → mensaje claro de «ranking no
  disponible» en la vista (patrón no-op del repo), nunca una excepción.

## Privacidad (mismo commit — regla del repo)

Sección nueva en `privacy.html` ES/EN: feature voluntario; qué se publica (solo el nombre
elegido y el XP); a quién (solo usuarios autenticados de la app); que puede cambiarse el
nombre o salir en cualquier momento y salir borra el dato inmediatamente; bump de la fecha
«última actualización».

## Gates (familia N27 en `verify-runtime.js`)

- i18n: claves `rk_*` definidas y pareadas (la paridad global ya lo cubre; check de las
  claves usadas en los flujos).
- **Comportamental XSS:** render del top con un `display_name` malicioso
  (`<img onerror=…>`) → el HTML resultante lo contiene escapado.
- Comportamental opt-in/opt-out contra el mock de Supabase: «Participar» → INSERT con el
  nombre elegido y flag `true`; «Salir» → DELETE y flag `false`.
- Comportamental sync: con `rankingOptIn = false` el push no toca `leaderboard`; con `true`
  hace el upsert **después** del push de progreso; un upsert que revienta no impide que el
  push de progreso complete.
- Estáticos: vista registrada en nav/navigate; `#i-trophy` presente en el sprite; guard de
  migración del estado presente (anclado a regla real, nunca `includes()` — lección N19/N21).
- `validate-responsive.js`: la vista `ranking` entra en el barrido de overflow y targets.

## Fuera de alcance (explícito)

- Rankings por periodo (semana/mes) — requeriría historial de XP con fechas; feature futuro.
- Avatares/niveles en la tabla — solo nombre y XP en v1.
- Anti-fraude real (validación server-side del XP) — imposible sin backend propio; cota de
  cordura como mitigación.
- Paginación más allá del top 50.
