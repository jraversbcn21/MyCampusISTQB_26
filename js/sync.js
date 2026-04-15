/* ===================================================
   MyCampus ISTQB — Supabase Progress Sync
   =================================================== */

const Sync = {
  _saveTimer: null,
  _DEBOUNCE_MS: 4000, // Espera 4s de inactividad antes de guardar en Supabase

  /* ===== LOAD ===== */
  // Carga el progreso desde Supabase. Si no hay datos en la nube,
  // sube los de localStorage (migración de usuario existente).
  async loadState(userId) {
    try {
      const { data, error } = await supabaseClient
        .from('user_progress')
        .select('data')
        .eq('user_id', userId)
        .single();

      // PGRST116 = fila no encontrada (usuario nuevo)
      if (error && error.code !== 'PGRST116') throw error;

      if (data?.data) {
        // Actualizar caché local
        localStorage.setItem(`mycampus_istqb_v1_${userId}`, JSON.stringify(data.data));
        return data.data;
      }

      // Sin datos en la nube: intentar migrar desde localStorage
      const localKey = `mycampus_istqb_v1_${userId}`;
      const cached = localStorage.getItem(localKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Subir a Supabase para que quede persistido
        await this._push(userId, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('[Sync] loadState falló, usando localStorage:', e.message);
      // Fallback a localStorage si hay error de red
      const cached = localStorage.getItem(`mycampus_istqb_v1_${userId}`);
      if (cached) return JSON.parse(cached);
    }

    return null; // Sin datos → App usará estado inicial
  },

  /* ===== SAVE (debounced) ===== */
  // Guarda inmediatamente en localStorage y programa guardado en Supabase
  saveState(userId, state) {
    // localStorage inmediato (funciona offline)
    localStorage.setItem(`mycampus_istqb_v1_${userId}`, JSON.stringify(state));

    // Supabase con debounce
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
    } catch (e) {
      console.warn('[Sync] push a Supabase falló:', e.message);
    }
  },
};
