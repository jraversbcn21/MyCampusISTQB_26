/* ===================================================
   MyCampus ISTQB — Supabase Progress Sync
   =================================================== */

const Sync = {
  _saveTimer: null,
  _dirty: false, // hay cambios locales aún no confirmados en Supabase
  _DEBOUNCE_MS: 4000, // Espera 4s de inactividad antes de guardar en Supabase

  /* ===== LOAD ===== */
  // Carga el progreso desde Supabase. Si no hay datos en la nube,
  // sube los de localStorage (migración de usuario existente).
  // Si AMBAS copias existen, gana la más nueva por _updatedAt (sellado en
  // saveState): una nube obsoleta (pushes fallidos en la sesión anterior,
  // pestaña cerrada dentro del debounce) no debe pisar progreso local.
  async loadState(userId) {
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
        const localTs = (local && local._updatedAt) || 0;
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

    // Supabase con debounce
    this._dirty = true;
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this._push(userId, state), this._DEBOUNCE_MS);
  },

  /* ===== PUSH INMEDIATO ===== */
  // Llamado al cerrar sesión para no perder el último estado
  async flushNow(userId, state) {
    clearTimeout(this._saveTimer);
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
    } catch (e) {
      console.warn('[Sync] push a Supabase falló:', e.message);
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
  if (!Sync._dirty || !window.CAMPUS_USER_ID) return;
  if (typeof App === 'undefined' || !App.state) return;
  clearTimeout(Sync._saveTimer);
  Sync._pushKeepalive(window.CAMPUS_USER_ID, App.state);
});
