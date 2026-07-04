/* ===================================================
   MyCampus ISTQB — Authentication (Supabase)
   =================================================== */

// Si el CDN de supabase-js no llegó a cargar (bloqueado, offline en la
// primera visita, fallo de SRI), no reventamos aquí — Auth.init() lo detecta
// y muestra un mensaje en vez de dejar la app entera sin arrancar. El typeof
// de SUPABASE_URL cubre el caso hermano: config.js ausente o fallido, que
// antes mataba este archivo entero en el parseo (ReferenceError) y dejaba
// la pantalla de login muerta sin mensaje.
let supabaseClient = null;
if (window.supabase && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
  const { createClient } = window.supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const Auth = {
  user: null,
  _mode: 'login', // 'login' | 'register'
  _authInProgress: false,

  /* ===== INIT ===== */
  async init() {
    // Restaurar idioma ANTES de mostrar nada: la pantalla de login no vive
    // dentro de App, así que no puede esperar a App.init() para traducirse.
    // Guardado tras el typeof: si i18n.js no llegó a cargar, seguimos con la
    // pantalla de login en su español hardcodeado en vez de romper aquí.
    if (typeof i18n !== 'undefined') {
      i18n.restore();
      document.getElementById('authBtnES').classList.toggle('active', i18n.lang === 'es');
      document.getElementById('authBtnEN').classList.toggle('active', i18n.lang === 'en');
    }

    // Listeners ANTES del early-return de fallo de carga: los handlers ya
    // comprueban !supabaseClient por su cuenta, y sin esto la ruta de fallo
    // dejaba el switcher de idioma muerto y el <form> sin el preventDefault
    // del handler de submit (una submission nativa haría GET con name=email/
    // password en la URL — hoy lo frena el botón deshabilitado, pero no debe
    // depender de eso).
    this._bindEvents();

    if (!supabaseClient) {
      this._showLoadFailure();
      return;
    }

    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // supabase-js puede re-emitir SIGNED_IN para el mismo usuario al
        // recuperar el foco de la pestaña (refresh de token). Si ya está
        // inicializada la app para este usuario, ignorarlo: si no, el
        // else-branch de _onAuthSuccess pisa App.state con la copia de la
        // nube (pudiendo perder XP no sincronizado aún) y re-navega la vista
        // actual, cortando un examen en curso.
        const sameUserAlreadyLoaded = App._initialized && this.user && this.user.id === session.user.id;
        this.user = session.user;
        if (sameUserAlreadyLoaded) return;
        await this._onAuthSuccess(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.user = null;
        this._authInProgress = false;
        this._showAuthScreen();
      }
    });

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      this.user = session.user;
      await this._onAuthSuccess(session.user);
    } else {
      this._showAuthScreen();
    }
  },

  /* ===== AUTH ACTIONS ===== */
  async signInEmail(email, password) {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  async signUpEmail(email, password, name) {
    const options = name ? { data: { full_name: name } } : {};
    const { data, error } = await supabaseClient.auth.signUp({ email, password, options });
    if (error) throw error;
    if (data.user && !data.session) return 'confirm';
    return 'ok';
  },

  async signInGoogle() {
    const cleanUrl = window.location.origin + window.location.pathname;
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: cleanUrl }
    });
    if (error) throw error;
  },

  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  /* ===== UI ===== */
  _showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
  },

  _hideAuthScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
  },

  async _onAuthSuccess(user) {
    if (this._authInProgress) return;
    this._authInProgress = true;

    // Si algún <script> de index.html falló al cargar (reordenado, bloqueado,
    // 404), mejor avisar aquí con un mensaje claro que dejar que App.init()
    // reviente más adelante con un error críptico a mitad de un render.
    // Sync incluido: no se usa dentro de App.init(), pero este mismo método
    // lo llama unas líneas más abajo — sin él aquí, un sync.js caído pasaba
    // la guarda, reventaba con ReferenceError y dejaba _authInProgress
    // atascado en true (logins posteriores retornaban en silencio).
    const required = { App: typeof App, i18n: typeof i18n, CHAPTERS: typeof CHAPTERS,
      QUESTIONS: typeof QUESTIONS, Gamification: typeof Gamification,
      AvatarSelector: typeof AvatarSelector, Onboarding: typeof Onboarding,
      Sync: typeof Sync };
    const missing = Object.keys(required).filter(k => required[k] === 'undefined');
    if (missing.length) {
      console.error('[Auth] Módulos requeridos no cargados (¿se reordenó o falló algún <script> de index.html?):', missing.join(', '));
      const msg = typeof i18n !== 'undefined'
        ? i18n.t('auth_missing_modules_msg')
        : 'Error al cargar la aplicación. Recarga la página; si el problema persiste, contacta soporte.';
      this._showMessage(msg, 'error');
      this._authInProgress = false;
      return;
    }

    this._hideAuthScreen();
    this._updateUserUI(user);
    window.CAMPUS_USER_ID = user.id;

    // Limpiar tokens OAuth del URL para no contaminar futuros logins
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }

    if (!App._initialized) {
      // Iniciar la app inmediatamente con estado local para que los clicks funcionen
      const localState = App.loadState();
      App.init(localState);
      AvatarSelector.init(user.id);
      setTimeout(() => Onboarding.start(user.id), 600);

      // Sincronizar con Supabase en segundo plano sin bloquear la UI.
      // loadState ya resolvió qué copia gana (frescura por _updatedAt) y dejó
      // la caché localStorage coherente; aquí solo queda no pisar progreso
      // que el usuario haya hecho MIENTRAS resolvía este fetch (su App.state
      // en memoria tendría un sello más nuevo) y no re-navegar si hay un
      // examen en marcha.
      Sync.loadState(user.id).then(cloudState => {
        if (cloudState && (cloudState._updatedAt || 0) >= ((App.state && App.state._updatedAt) || 0)) {
          App.state = cloudState;
          App.updateSidebar();
          const examEl = document.getElementById('examMode');
          const examRunning = examEl && examEl.style.display === 'block';
          if (!examRunning) App.navigate(App.currentView || 'dashboard');
        }
      }).catch(e => {
        console.warn('[Auth] Sync en segundo plano falló:', e.message);
      }).finally(() => {
        this._authInProgress = false;
      });
    } else {
      Sync.loadState(user.id).then(cloudState => {
        App.state = cloudState || App.loadState();
        App.updateSidebar();
        App.navigate(App.currentView || 'dashboard');
      }).catch(() => {
        App.state = App.loadState();
        App.updateSidebar();
        App.navigate(App.currentView || 'dashboard');
      }).finally(() => {
        this._authInProgress = false;
      });
    }
  },

  _updateUserUI(user) {
    const meta = user.user_metadata || {};
    const savedName = localStorage.getItem(`mycampus_displayname_${user.id}`);
    const name = savedName || meta.full_name || meta.name || user.email?.split('@')[0] || 'Estudiante';
    const avatar = meta.avatar_url || meta.picture || null;

    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.textContent = name;

    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl) {
      if (avatar) {
        // avatar_url viene de user_metadata, que el propio usuario puede
        // editar (updateUser) — construir el <img> vía DOM en vez de
        // interpolarlo en innerHTML evita que un valor malicioso se
        // interprete como marcado.
        avatarEl.textContent = '';
        const img = document.createElement('img');
        img.src = avatar;
        img.alt = 'avatar';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        avatarEl.appendChild(img);
      } else {
        avatarEl.textContent = name.charAt(0).toUpperCase();
      }
    }
  },

  _showMessage(text, type) {
    const el = document.getElementById('authMessage');
    el.textContent = text;
    el.className = `auth-message auth-message--${type}`;
    el.style.display = 'block';
  },

  _hideMessage() {
    document.getElementById('authMessage').style.display = 'none';
  },

  _showLoadFailure() {
    const msg = typeof i18n !== 'undefined'
      ? i18n.t('auth_load_failure_msg')
      : 'No se pudo cargar el servicio de autenticación. Comprueba tu conexión a internet y recarga la página.';
    this._showMessage(msg, 'error');
    document.getElementById('authSubmit').disabled = true;
    document.getElementById('authGoogle').disabled = true;
  },

  _setLoading(loading) {
    document.getElementById('authSubmit').disabled = loading;
    document.getElementById('authGoogle').disabled = loading;
    document.getElementById('authSubmit').classList.toggle('loading', loading);
  },

  _setAuthLang(lang) {
    i18n.setLang(lang);
    document.getElementById('authBtnES').classList.toggle('active', lang === 'es');
    document.getElementById('authBtnEN').classList.toggle('active', lang === 'en');
    // authSubmit depende del modo (login/registro), no solo del idioma —
    // data-i18n lo pisaría con el texto de login siempre. Se refresca aquí.
    document.getElementById('authSubmit').textContent = this._mode === 'login' ? i18n.t('auth_login_tab') : i18n.t('auth_submit_register');
  },

  _switchMode(mode) {
    this._mode = mode;
    this._hideMessage();
    document.getElementById('tabLogin').classList.toggle('active', mode === 'login');
    document.getElementById('tabRegister').classList.toggle('active', mode === 'register');
    document.getElementById('authSubmit').textContent = mode === 'login' ? i18n.t('auth_login_tab') : i18n.t('auth_submit_register');
    document.getElementById('authForgot').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('fieldName').style.display = mode === 'register' ? 'flex' : 'none';
  },

  /* ===== EVENT BINDING ===== */
  _bindEvents() {
    document.getElementById('tabLogin').addEventListener('click', () => this._switchMode('login'));
    document.getElementById('tabRegister').addEventListener('click', () => this._switchMode('register'));

    document.getElementById('authBtnES').addEventListener('click', () => this._setAuthLang('es'));
    document.getElementById('authBtnEN').addEventListener('click', () => this._setAuthLang('en'));

    document.getElementById('authForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!supabaseClient) { this._showLoadFailure(); return; }
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const name = document.getElementById('authName').value.trim();
      if (!email || !password) return;

      this._hideMessage();
      this._setLoading(true);

      try {
        if (this._mode === 'login') {
          await this.signInEmail(email, password);
        } else {
          const result = await this.signUpEmail(email, password, name);
          if (result === 'confirm') {
            this._showMessage(i18n.t('auth_confirm_email_msg'), 'success');
            this._setLoading(false);
            return;
          }
        }
      } catch (err) {
        this._showMessage(this._getErrorMessage(err.message), 'error');
        this._setLoading(false);
      }
    });

    document.getElementById('authGoogle').addEventListener('click', async () => {
      if (!supabaseClient) { this._showLoadFailure(); return; }
      this._hideMessage();
      this._setLoading(true);
      try {
        await this.signInGoogle();
      } catch (err) {
        this._showMessage(this._getErrorMessage(err.message), 'error');
        this._setLoading(false);
      }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          if (window.CAMPUS_USER_ID && App.state) {
            await Sync.flushNow(window.CAMPUS_USER_ID, App.state);
          }
        } catch (e) {
          console.warn('Error al guardar estado antes de logout:', e);
        }
        await this.signOut();
      });
    }

    document.getElementById('authForgot').addEventListener('click', async (e) => {
      e.preventDefault();
      if (!supabaseClient) { this._showLoadFailure(); return; }
      const email = document.getElementById('authEmail').value.trim();
      if (!email) {
        this._showMessage(i18n.t('auth_enter_email_first'), 'error');
        return;
      }
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.href
      });
      if (error) {
        this._showMessage(this._getErrorMessage(error.message), 'error');
      } else {
        this._showMessage(i18n.t('auth_reset_sent_msg'), 'success');
      }
    });
  },

  _getErrorMessage(msg) {
    if (!msg) return i18n.t('auth_err_generic');
    if (msg.includes('Invalid login credentials')) return i18n.t('auth_err_invalid_credentials');
    if (msg.includes('Email not confirmed')) return i18n.t('auth_err_email_not_confirmed');
    if (msg.includes('User already registered')) return i18n.t('auth_err_already_registered');
    if (msg.includes('Password should be at least')) return i18n.t('auth_err_password_length');
    if (msg.includes('Unable to validate email')) return i18n.t('auth_err_invalid_email');
    if (msg.includes('rate limit')) return i18n.t('auth_err_rate_limit');
    return msg;
  }
};
