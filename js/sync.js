/* ===================================================
   MyCampus ISTQB — Supabase Progress Sync
   =================================================== */

const Sync = {
  _saveTimer: null,
  _dirty: false, // hay cambios locales aún no confirmados en Supabase
  _DEBOUNCE_MS: 4000, // Espera 4s de inactividad antes de guardar en Supabase
  // Gate anti-pérdida (2026-07-22): mientras sea false, saveState/flush/visibilitychange
  // escriben en localStorage pero NO empujan a la nube. Se pone a false justo antes de
  // reconciliar (auth.js) y a true al terminar. Sin esto, el estado vacío que init()
  // sella durante el arranque limpio podía subirse por encima del progreso real de la
  // nube (el push del debounce de 4s ganaba la carrera en redes lentas). El _push
  // interno de loadState (la re-subida cuando local gana legítimamente) NO pasa por
  // aquí: es la propia reconciliación.
  _reconciled: false,

  /* ===== LOAD ===== */
  // Carga el progreso desde Supabase. Si no hay datos en la nube,
  // sube los de localStorage (migración de usuario existente).
  // Si AMBAS copias existen, gana la más nueva por _updatedAt (sellado en
  // saveState): una nube obsoleta (pushes fallidos en la sesión anterior,
  // pestaña cerrada dentro del debounce) no debe pisar progreso local.
  // localTsOverride (2026-07-22): frescura autoritativa capturada ANTES de que App.init
  // pueda escribir. En el arranque limpio el estado local real era vacío/sin sello (ts 0),
  // pero para cuando este fetch resuelve, init() ya ha reescrito localStorage con un sello
  // fresco — releerlo aquí engañaría la decisión. Cuando se pasa el override se usa como
  // localTs; sin él, se mantiene el comportamiento previo (releer de local).
  async loadState(userId, localTsOverride) {
    const localKey = `mycampus_istqb_v1_${userId}`;
    let local = null;
    try {
      const cached = localStorage.getItem(localKey);
      if (cached) local = JSON.parse(cached);
    } catch (e) {}

    try {
      const { data, error } = await supabaseClient
        .from('user_progress')
        .select('data')
        .eq('user_id', userId)
        .single();

      // PGRST116 = fila no encontrada (usuario nuevo)
      if (error && error.code !== 'PGRST116') throw error;

      if (data?.data) {
        const cloud = data.data;
        // Copias sin sello (anteriores a este mecanismo) cuentan como 0:
        // una nube sin fecha nunca gana a una copia local sellada, y en
        // empate (0-0, o misma copia) gana la nube — conserva el
        // comportamiento multi-dispositivo original.
        const cloudTs = cloud._updatedAt || 0;
        const localTs = (localTsOverride !== undefined)
          ? localTsOverride
          : ((local && local._updatedAt) || 0);
        if (local && localTs > cloudTs) {
          // La copia local es más nueva: re-subirla en vez de perderla.
          await this._push(userId, local);
          return local;
        }
        try {
          localStorage.setItem(localKey, JSON.stringify(cloud));
        } catch (e) {}
        return cloud;
      }

      // Sin datos en la nube: intentar migrar desde localStorage
      if (local) {
        // Subir a Supabase para que quede persistido
        await this._push(userId, local);
        return local;
      }
    } catch (e) {
      console.warn('[Sync] loadState falló, usando localStorage:', e.message);
      // Fallback a localStorage si hay error de red
      if (local) return local;
    }

    return null; // Sin datos → App usará estado inicial
  },

  /* ===== SAVE (debounced) ===== */
  // Guarda inmediatamente en localStorage y programa guardado en Supabase
  saveState(userId, state) {
    // Sello de frescura: es lo que permite a loadState decidir qué copia
    // gana cuando localStorage y la nube divergen.
    state._updatedAt = Date.now();

    // localStorage inmediato (funciona offline)
    try {
      localStorage.setItem(`mycampus_istqb_v1_${userId}`, JSON.stringify(state));
    } catch (e) {}

    // Gate anti-pérdida: antes de reconciliar con la nube no se empuja nada (el
    // estado aún puede ser el vacío/parcial del arranque). localStorage ya quedó
    // guardado arriba; la próxima carga reconciliará. No se marca _dirty, así el
    // listener de visibilitychange tampoco empuja.
    if (!this._reconciled) return;

    // Supabase con debounce
    this._dirty = true;
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this._push(userId, state), this._DEBOUNCE_MS);
  },

  /* ===== PUSH INMEDIATO ===== */
  // Llamado al cerrar sesión para no perder el último estado
  async flushNow(userId, state) {
    clearTimeout(this._saveTimer);
    // Gate anti-pérdida: si aún no se reconció con la nube, no empujar el estado
    // (podría ser el pre-reconciliación y pisaría el progreso real). localStorage
    // ya está al día por saveState; la próxima carga reconciliará.
    if (!this._reconciled) return;
    if (state) await this._push(userId, state);
  },

  /* ===== INTERNAL ===== */
  async _push(userId, state) {
    try {
      const { error } = await supabaseClient
        .from('user_progress')
        .upsert(
          { user_id: userId, data: state, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
      this._dirty = false;

      // Ranking (2026-08-06): proyección {nombre, xp} si el usuario participa.
      // Posterior e independiente: su fallo jamás bloquea el progreso.
      if (state && state.rankingOptIn) await this._pushRanking(userId, state);
    } catch (e) {
      console.warn('[Sync] push a Supabase falló:', e.message);
    }
  },

  // Upsert de la fila propia en leaderboard. Nunca lanza. El flush keepalive de
  // visibilitychange NO lo replica (deliberado, spec): el siguiente sync con
  // sesión abierta pone la tabla al día.
  async _pushRanking(userId, state) {
    try {
      const { error } = await supabaseClient
        .from('leaderboard')
        .upsert(
          { user_id: userId, display_name: state.rankingName, xp: state.xp,
            updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
    } catch (e) {
      console.warn('[Sync] push del ranking falló (no bloquea el progreso):', e.message);
    }
  },

  // Push directo al REST de Supabase con keepalive: al ocultarse/cerrarse la
  // pestaña un fetch normal puede cortarse a medias, y supabase-js no expone
  // keepalive. Solo se usa desde el listener de visibilitychange de abajo.
  async _pushKeepalive(userId, state) {
    try {
      const { data } = await supabaseClient.auth.getSession();
      const token = data && data.session && data.session.access_token;
      if (!token) return;
      await fetch(`${SUPABASE_URL}/rest/v1/user_progress?on_conflict=user_id`, {
        method: 'POST',
        keepalive: true,
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ user_id: userId, data: state, updated_at: new Date().toISOString() }),
      });
      this._dirty = false;
    } catch (e) {}
  },
};

// Flush del debounce cuando la pestaña se oculta (cambio de app, cierre):
// sin esto, el progreso de los últimos 4s solo queda en localStorage y la
// nube se queda obsoleta — justo el escenario del que loadState ahora se
// defiende, pero mejor no producirlo. visibilitychange→hidden es más fiable
// que beforeunload (cubre también móvil/cambio de pestaña).
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'hidden') return;
  if (!Sync._reconciled || !Sync._dirty || !window.CAMPUS_USER_ID) return;
  if (typeof App === 'undefined' || !App.state) return;
  clearTimeout(Sync._saveTimer);
  Sync._pushKeepalive(window.CAMPUS_USER_ID, App.state);
});
