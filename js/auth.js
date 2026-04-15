/* ===================================================
   MyCampus ISTQB — Authentication (Supabase)
   =================================================== */

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Auth = {
  user: null,
  _mode: 'login', // 'login' | 'register'

  /* ===== INIT ===== */
  async init() {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.user = session.user;
        await this._onAuthSuccess(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.user = null;
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

    this._bindEvents();
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
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
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
    this._hideAuthScreen();
    this._updateUserUI(user);
    window.CAMPUS_USER_ID = user.id;

    if (!App._initialized) {
      // Cargar progreso desde Supabase antes de iniciar la app
      const cloudState = await Sync.loadState(user.id);
      App.init(cloudState);
      AvatarSelector.init(user.id);
      setTimeout(() => Onboarding.start(user.id), 600);
    } else {
      const cloudState = await Sync.loadState(user.id);
      App.state = cloudState || App.loadState();
      App.updateSidebar();
      App.navigate('dashboard');
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
        avatarEl.innerHTML = `<img src="${avatar}" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
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

  _setLoading(loading) {
    document.getElementById('authSubmit').disabled = loading;
    document.getElementById('authGoogle').disabled = loading;
    document.getElementById('authSubmit').classList.toggle('loading', loading);
  },

  _switchMode(mode) {
    this._mode = mode;
    this._hideMessage();
    document.getElementById('tabLogin').classList.toggle('active', mode === 'login');
    document.getElementById('tabRegister').classList.toggle('active', mode === 'register');
    document.getElementById('authSubmit').textContent = mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta';
    document.getElementById('authForgot').style.display = mode === 'login' ? 'block' : 'none';
    document.getElementById('fieldName').style.display = mode === 'register' ? 'flex' : 'none';
  },

  /* ===== EVENT BINDING ===== */
  _bindEvents() {
    document.getElementById('tabLogin').addEventListener('click', () => this._switchMode('login'));
    document.getElementById('tabRegister').addEventListener('click', () => this._switchMode('register'));

    document.getElementById('authForm').addEventListener('submit', async (e) => {
      e.preventDefault();
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
            this._showMessage('✅ Revisa tu email para confirmar tu cuenta.', 'success');
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
      const email = document.getElementById('authEmail').value.trim();
      if (!email) {
        this._showMessage('Ingresa tu email primero.', 'error');
        return;
      }
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.href
      });
      if (error) {
        this._showMessage(this._getErrorMessage(error.message), 'error');
      } else {
        this._showMessage('✅ Se envió un link de recuperación a tu email.', 'success');
      }
    });
  },

  _getErrorMessage(msg) {
    if (!msg) return 'Ocurrió un error. Intenta nuevamente.';
    if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.';
    if (msg.includes('Email not confirmed')) return 'Confirma tu email antes de ingresar.';
    if (msg.includes('User already registered')) return 'Ya existe una cuenta con ese email.';
    if (msg.includes('Password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
    if (msg.includes('Unable to validate email')) return 'Formato de email inválido.';
    if (msg.includes('rate limit')) return 'Demasiados intentos. Espera unos minutos.';
    return msg;
  }
};
