/* ===================================================
   MyCampus ISTQB — Error Monitoring (Sentry)
   =================================================== */

// Igual que el resto de guardas de carga del repo (auth.js con supabase-js):
// si el CDN de Sentry no llegó a cargar (bloqueado, offline, SRI fallida) o
// falta el DSN en config.js, Monitoring queda en no-op silencioso. La app
// JAMÁS debe depender del monitoreo para funcionar.
const Monitoring = {
  _enabled: false,

  init() {
    if (this._enabled) return;
    if (!window.Sentry || typeof SENTRY_DSN === 'undefined') return;
    window.Sentry.init({
      dsn: SENTRY_DSN,
      sendDefaultPii: false,
      sampleRate: 1.0,
      beforeSend: (event) => Monitoring._scrub(event),
    });
    this._enabled = true;
  },

  // Identifica al usuario SOLO por su UUID de Supabase (pseudónimo) —
  // nunca email ni nombre. Llamado desde auth.js tras un login correcto.
  identify(userId) {
    if (!this._enabled) return;
    window.Sentry.setUser({ id: userId });
  },

  clearUser() {
    if (!this._enabled) return;
    window.Sentry.setUser(null);
  },

  _EMAIL_RE: /[^\s@'"<>]+@[^\s@'"<>]+\.[^\s@'"<>]+/g,

  // Scrubbing de PII antes de enviar cualquier evento: quita el email/username
  // que Sentry pudiera adjuntar automáticamente y redacta cualquier string
  // con forma de email dentro del evento (mensaje, breadcrumbs, contexto).
  _scrub(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
      delete event.user.ip_address;
    }
    Monitoring._redactDeep(event, 0);
    return event;
  },

  // depth acotado: un evento de Sentry es JSON serializable (sin ciclos),
  // el límite es solo una salvaguarda barata contra una estructura inesperada.
  _redactDeep(obj, depth) {
    if (!obj || typeof obj !== 'object' || depth > 8) return;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string') {
        obj[key] = val.replace(Monitoring._EMAIL_RE, '[redacted-email]');
      } else if (val && typeof val === 'object') {
        Monitoring._redactDeep(val, depth + 1);
      }
    }
  },
};

Monitoring.init();
