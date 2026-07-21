/* Arnés de verificación de runtime — dev-only, nunca servido al navegador.
   Carga los módulos reales de js/ en un DOM mínimo mockeado (sin navegador,
   sin npm install) y ejercita los comportamientos corregidos en la pasada de
   remediación 2026-07-04 y su re-auditoría. Hermano de validate-*.js: se
   ejecuta con `node scripts/verify-runtime.js` y sale con código 1 si algo
   falla. Si añades un fix de comportamiento en js/, añade aquí su chequeo. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORDER = ['config.js', 'monitoring.js', 'i18n.js', 'content.js', 'questions.js', 'gamification.js',
  'app.js', 'onboarding.js', 'avatar.js', 'sync.js', 'auth.js'];

/* ===== Mock DOM mínimo ===== */
function makeEl(id) {
  const el = {
    id, tagName: 'DIV', style: {}, dataset: {}, _attrs: {}, _listeners: {}, _children: [],
    innerHTML: '', textContent: '', value: '', placeholder: '', title: '', disabled: false,
    offsetHeight: 0,
    classList: {
      _s: new Set(),
      add(...c) { c.forEach(x => this._s.add(x)); },
      remove(...c) { c.forEach(x => this._s.delete(x)); },
      contains(c) { return this._s.has(c); },
      toggle(c, force) {
        const on = force === undefined ? !this._s.has(c) : !!force;
        on ? this._s.add(c) : this._s.delete(c);
        return on;
      },
    },
    addEventListener(t, fn) { (el._listeners[t] = el._listeners[t] || []).push(fn); },
    appendChild(c) { el._children.push(c); return c; },
    removeChild() {}, remove() {}, focus() {}, select() {}, blur() {},
    setAttribute(k, v) { el._attrs[k] = v; },
    getAttribute(k) { return k in el._attrs ? el._attrs[k] : null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    insertAdjacentHTML() {}, insertAdjacentElement() {}, replaceWith() {},
    getBoundingClientRect() { return { top: 0, left: 0, right: 100, bottom: 40, width: 100, height: 40 }; },
  };
  return el;
}

function makeDocument() {
  const doc = {
    _els: new Map(), _qs: new Map(), _listeners: {}, visibilityState: 'visible',
    getElementById(id) {
      if (!this._els.has(id)) this._els.set(id, makeEl(id));
      return this._els.get(id);
    },
    querySelector(sel) {
      if (!this._qs.has(sel)) this._qs.set(sel, makeEl('qs:' + sel));
      return this._qs.get(sel);
    },
    querySelectorAll() { return []; },
    addEventListener(t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); },
    createElement(tag) { const e = makeEl(''); e.tagName = tag.toUpperCase(); return e; },
    body: makeEl('body'),
    documentElement: makeEl('html'),
  };
  return doc;
}

function makeLocalStorage() {
  const store = new Map();
  return {
    getItem(k) { return store.has(k) ? store.get(k) : null; },
    setItem(k, v) { store.set(k, String(v)); },
    removeItem(k) { store.delete(k); },
  };
}

function makeSupabaseMock(opts = {}) {
  const calls = { upserts: [] };
  const client = {
    _calls: calls,
    auth: {
      onAuthStateChange(cb) { calls.authStateCb = cb; return { data: { subscription: {} } }; },
      getSession: async () => ({ data: { session: 'session' in opts ? opts.session : { access_token: 'tok-mock' } } }),
      signOut: async () => ({ error: null }),
    },
    from() {
      const chain = {
        select() { return chain; },
        eq() { return chain; },
        single: async () => opts.singleResult || { data: null, error: { code: 'PGRST116' } },
        upsert: async (row) => { calls.upserts.push(row); return { error: null }; },
      };
      return chain;
    },
  };
  return client;
}

function makeSentryMock(opts = {}) {
  const calls = { inits: [], setUsers: [] };
  const client = {
    _calls: calls,
    init(initOpts) {
      calls.inits.push(initOpts);
      if (opts.throwOnInit) throw new Error('sdk-init-boom');
    },
    setUser(u) { calls.setUsers.push(u); },
  };
  return client;
}

/* ===== Carga de módulos con scope compartido (emula <script> secuenciales) ===== */
function loadApp(opts = {}) {
  const exclude = opts.exclude || [];
  const files = ORDER.filter(f => !exclude.includes(f));
  const src = files.map(f => fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')).join('\n;\n');

  const doc = makeDocument();
  const ls = opts.localStorage || makeLocalStorage();
  const sb = 'supabase' in opts ? opts.supabase : makeSupabaseMock();
  const sentry = 'sentry' in opts ? opts.sentry : undefined;
  const calls = { fetches: [] };

  const win = {
    supabase: sb ? { createClient: () => sb } : undefined,
    Sentry: sentry,
    location: { origin: 'http://localhost', pathname: '/', hash: '', href: 'http://localhost/' },
    speechSynthesis: { cancel() {}, speak() {}, getVoices() { return []; }, speaking: false },
    innerWidth: 1280, innerHeight: 800,
    addEventListener() {},
  };
  const fetchMock = (url, init) => { calls.fetches.push({ url, init }); return Promise.resolve({ ok: true }); };
  const ret = `return {
    App: typeof App !== 'undefined' ? App : undefined,
    Auth: typeof Auth !== 'undefined' ? Auth : undefined,
    Sync: typeof Sync !== 'undefined' ? Sync : undefined,
    Monitoring: typeof Monitoring !== 'undefined' ? Monitoring : undefined,
    i18n: typeof i18n !== 'undefined' ? i18n : undefined,
    TRANSLATIONS: typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : undefined,
    CHAPTERS: typeof CHAPTERS !== 'undefined' ? CHAPTERS : undefined,
    GLOSSARY: typeof GLOSSARY !== 'undefined' ? GLOSSARY : undefined
  };`;
  const fn = new Function('window', 'document', 'localStorage', 'history', 'fetch', 'confirm', 'navigator',
    `${src}\n;${ret}`);
  const globals = fn(win, doc, ls, { replaceState() {} }, fetchMock, () => true, {});
  return { ...globals, document: doc, localStorage: ls, window: win, supabase: sb, calls };
}

/* ===== Reporte ===== */
let failures = 0;
function check(name, ok) {
  console.log(`${ok ? '✅' : '❌'} ${name}`);
  if (!ok) failures++;
}
const fireEl = (el, type, ev) => (el._listeners[type] || []).forEach(fn => fn(ev));

const SAMPLE_Q = {
  id: 9999, chapter: 0, correct: 0,
  q: { es: 'p', en: 'q' },
  options: { es: ['a', 'b', 'c', 'd'], en: ['a', 'b', 'c', 'd'] },
  explanation: { es: 'e', en: 'e' },
};

(async () => {
  /* ---- N1: frescura local vs nube en Sync.loadState ---- */
  {
    const ls = makeLocalStorage();
    ls.setItem('mycampus_istqb_v1_u1', JSON.stringify({ xp: 500, _updatedAt: 2000 }));
    const sb = makeSupabaseMock({ singleResult: { data: { data: { xp: 100, _updatedAt: 1000 } }, error: null } });
    const ctx = loadApp({ supabase: sb, localStorage: ls });
    const res = await ctx.Sync.loadState('u1');
    check('N1 sync: la copia local más nueva gana sobre la nube obsoleta', !!res && res.xp === 500);
    check('N1 sync: la caché localStorage no se machaca con la copia vieja',
      JSON.parse(ls.getItem('mycampus_istqb_v1_u1')).xp === 500);
    check('N1 sync: la copia local ganadora se re-sube a la nube',
      sb._calls.upserts.some(u => u.data && u.data.xp === 500));
  }

  /* ---- N1: la nube más nueva sigue ganando (no romper el caso multi-dispositivo) ---- */
  {
    const ls = makeLocalStorage();
    ls.setItem('mycampus_istqb_v1_u1', JSON.stringify({ xp: 500, _updatedAt: 1000 }));
    const sb = makeSupabaseMock({ singleResult: { data: { data: { xp: 900, _updatedAt: 2000 } }, error: null } });
    const ctx = loadApp({ supabase: sb, localStorage: ls });
    const res = await ctx.Sync.loadState('u1');
    check('N1 sync: la nube más nueva sigue ganando (multi-dispositivo intacto)', !!res && res.xp === 900);
  }

  /* ---- N2: flush del debounce al ocultarse la pestaña ---- */
  {
    const ctx = loadApp();
    ctx.window.CAMPUS_USER_ID = 'u1';
    ctx.App.state = { xp: 42 };
    ctx.Sync.saveState('u1', ctx.App.state); // deja un push pendiente (debounce 4s)
    ctx.document.visibilityState = 'hidden';
    (ctx.document._listeners['visibilitychange'] || []).forEach(fn => fn());
    await new Promise(r => setTimeout(r, 20));
    const pushed = ctx.calls.fetches.length > 0 || ctx.supabase._calls.upserts.length > 0;
    check('N2 flush: ocultar la pestaña con guardado pendiente dispara el push', pushed);
  }

  /* ---- N3: sync.js ausente no revienta _onAuthSuccess ni atasca _authInProgress ---- */
  {
    const ctx = loadApp({ exclude: ['sync.js'] });
    let threw = false;
    try {
      await ctx.Auth._onAuthSuccess({ id: 'u1', email: 'a@b.c', user_metadata: {} });
    } catch (e) { threw = true; }
    check('N3 guarda: Sync ausente → mensaje limpio, sin excepción', !threw);
    check('N3 guarda: _authInProgress queda liberado (el login no se atasca)', ctx.Auth._authInProgress === false);
    check('N3 guarda: se muestra el mensaje de error al usuario',
      (ctx.document.getElementById('authMessage').textContent || '').length > 0);
  }

  /* ---- N7: fallo del CDN deja la pantalla de auth operativa (switcher + preventDefault) ---- */
  {
    const ctx = loadApp({ supabase: null });
    await ctx.Auth.init();
    const form = ctx.document.getElementById('authForm');
    check('N7 cdn-fail: el handler de submit queda registrado (preventDefault activo)',
      (form._listeners['submit'] || []).length === 1);
    check('N7 cdn-fail: el switcher de idioma sigue vivo',
      (ctx.document.getElementById('authBtnES')._listeners['click'] || []).length === 1);
    check('N7 cdn-fail: el botón de submit queda deshabilitado',
      ctx.document.getElementById('authSubmit').disabled === true);
  }

  /* ---- N4: estado restaurado (nube/localStorage) no se interpola como HTML ---- */
  {
    const ctx = loadApp();
    ctx.App.state = ctx.App.loadState();
    ctx.App.state.activityLog = [{ text: '<img src=x onerror=alert(1)>', xp: 5, time: '<b>t</b>' }];
    ctx.App.state.examHistory = [{ score: '<i>99</i>', date: '<u>01/01</u>', questions: 40, type: 'full', correct: 1, time: 0 }];
    ctx.App.renderProgress();
    ctx.App.renderSimulatorMenu();
    const act = ctx.document.getElementById('activityLog').innerHTML;
    const hist = ctx.document.getElementById('examHistory').innerHTML;
    check('N4 escape: activityLog no interpola HTML del estado', !act.includes('<img src=x') && !act.includes('<b>t</b>'));
    check('N4 escape: historial de exámenes no interpola HTML del estado', !hist.includes('<u>01/01</u>') && !hist.includes('<i>99</i>'));
  }

  /* ---- N8c: finishExam sobrevive a un estado antiguo sin chapterQuizPassed ---- */
  {
    const ctx = loadApp();
    ctx.App._initialized = true;
    ctx.App.state = ctx.App.loadState();
    delete ctx.App.state.chapterQuizPassed;
    ctx.App.examType = 'chapter'; ctx.App.examChapterId = 0;
    ctx.App.examQuestions = [SAMPLE_Q]; ctx.App.examAnswers = { 0: 0 };
    ctx.App.examCurrentQ = 0; ctx.App.examReviewing = false;
    ctx.App.examTimeLeft = 0; ctx.App.examTimer = null;
    let threw = false;
    try { ctx.App.finishExam(); } catch (e) { threw = true; }
    check('N8c finishExam: no revienta con estado antiguo sin chapterQuizPassed', !threw);
  }

  /* ---- N8a: la respuesta correcta del reto diario no viaja en el DOM ---- */
  {
    const ctx = loadApp();
    ctx.App.state = ctx.App.loadState();
    ctx.App.renderDailyChallenge();
    const html = ctx.document.getElementById('dailyChallenge').innerHTML;
    check('N8a reto diario: el índice correcto no está incrustado en onclick',
      html.length > 0 && !/answerDailyChallenge\(\s*\d+\s*,/.test(html));
  }

  /* ---- N8b: examen agotado por tiempo registra el tiempo real, no 0 ---- */
  {
    const ctx = loadApp();
    ctx.App._initialized = true;
    ctx.App.state = ctx.App.loadState();
    ctx.App.examQuestions = [SAMPLE_Q]; ctx.App.examAnswers = {};
    ctx.App.examType = 'quick'; ctx.App.examCurrentQ = 0; ctx.App.examReviewing = false;
    ctx.App.examTimeLeft = 1800;
    ctx.App.launchExam('t');
    ctx.App.examTimeLeft = 0; // simular agotamiento del temporizador
    ctx.App.finishExam();
    const last = ctx.App.state.examHistory[ctx.App.state.examHistory.length - 1];
    check('N8b timeUsed: agotar el tiempo registra 1800s, no 0', last && last.time === 1800);
  }

  /* ---- N8d: una búsqueda de glosario cuenta una vez, no una por pulsación ---- */
  {
    const ctx = loadApp();
    ctx.App.init(null);
    const search = ctx.document.getElementById('glossarySearch');
    const before = ctx.App.state.glossarySearches;
    for (const v of ['tes', 'test', 'testi', 'testin']) {
      search.value = v;
      fireEl(search, 'input', { target: search });
    }
    check('N8d glosario: 4 pulsaciones de una misma búsqueda cuentan 1, no 4',
      ctx.App.state.glossarySearches - before === 1);
  }

  /* ---- N9: Monitoring (Sentry) nunca puede tumbar la app ni filtrar PII ---- */
  {
    const ctx = loadApp({ sentry: undefined });
    let threw = false;
    try { ctx.App.init(null); } catch (e) { threw = true; }
    check('N9 monitoring: sin window.Sentry, la app carga sin excepción y App inicializa',
      !threw && ctx.App._initialized === true);
    check('N9 monitoring: Monitoring queda deshabilitado sin window.Sentry',
      !!ctx.Monitoring && ctx.Monitoring._enabled === false);
  }
  {
    // Sentry.init() puede reventar (SDK con bug, opción inesperada tras un
    // bump de versión) — no debe tumbar la carga de la app.
    const sentry = makeSentryMock({ throwOnInit: true });
    let threw = false;
    const ctx = loadApp({ sentry });
    try { ctx.App.init(null); } catch (e) { threw = true; }
    check('N9 monitoring: si Sentry.init() lanza excepción, la app carga igual',
      !threw && ctx.App._initialized === true);
    check('N9 monitoring: Monitoring queda deshabilitado si Sentry.init() lanza excepción',
      ctx.Monitoring._enabled === false);
  }
  {
    const sentry = makeSentryMock();
    const ctx = loadApp({ sentry });
    const init = sentry._calls.inits[0];
    check('N9 monitoring: con window.Sentry presente, init() llama a Sentry.init con el DSN y sin PII por defecto',
      sentry._calls.inits.length === 1 && typeof init.dsn === 'string' && init.dsn.length > 0 &&
      init.sendDefaultPii === false && typeof init.beforeSend === 'function');
    const event = {
      user: { id: 'u1', email: 'real-user@example.com', username: 'realuser' },
      message: 'Fallo al procesar contacto: real-user@example.com',
      extra: {
        note: 'contactar a otro-user@example.com por favor',
        // Cadena real que aparecería en un stack frame de nuestra propia
        // dependencia CDN: no debe confundirse con un email (regresión real,
        // encontrada en code review).
        stackUrl: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.0/dist/umd/supabase.js:12:34',
      },
    };
    // A través de init.beforeSend, no de Monitoring._scrub directamente: así
    // el chequeo falla si Sentry.init() se llega a conectar a un scrubber
    // distinto del que _scrub implementa.
    const scrubbed = init.beforeSend(event);
    check('N9 monitoring: beforeSend elimina el email/username del evento de usuario',
      !scrubbed.user.email && !scrubbed.user.username);
    check('N9 monitoring: beforeSend redacta emails incrustados en mensaje/contexto',
      !scrubbed.message.includes('real-user@example.com') &&
      !scrubbed.extra.note.includes('otro-user@example.com'));
    check('N9 monitoring: beforeSend NO corrompe una URL de CDN versionada (falso positivo real)',
      scrubbed.extra.stackUrl === 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.0/dist/umd/supabase.js:12:34');
  }
  {
    // A diferencia del bloque N3 (que excluye sync.js a propósito para
    // probar la guarda de módulos faltantes), este recorre el camino feliz
    // completo de auth.js para comprobar que identify()/clearUser() se
    // conectan de verdad — antes de este chequeo, ningún test llegaba a
    // ejecutar esas dos líneas de auth.js.
    const sentry = makeSentryMock();
    // session: null → Auth.init() toma la rama _showAuthScreen() (sin
    // autologin), dejando solo registrado el listener de onAuthStateChange
    // que necesitamos para disparar SIGNED_OUT manualmente más abajo.
    const sb = makeSupabaseMock({ session: null });
    const ctx = loadApp({ sentry, supabase: sb });
    await ctx.Auth.init();

    // App ya "inicializada": toma la rama corta de _onAuthSuccess y evita
    // recorrer todo App.init() (fuera de alcance de este chequeo — el mock
    // de DOM mínimo no modela cada elemento que ese render toca).
    ctx.App._initialized = true;
    const user = { id: 'uuid-1234', email: 'test@example.com', user_metadata: {} };
    await ctx.Auth._onAuthSuccess(user);
    check('N9 monitoring: identify() se llama con el UUID de Supabase tras un login correcto',
      sentry._calls.setUsers.some(u => u && u.id === 'uuid-1234' && !u.email));

    sb._calls.authStateCb('SIGNED_OUT', null);
    check('N9 monitoring: clearUser() se llama al cerrar sesión (SIGNED_OUT)',
      sentry._calls.setUsers[sentry._calls.setUsers.length - 1] === null);
  }

  /* ---- N10: carrusel de flashcards (slide direccional en next/prev) ---- */
  const FC = (n) => ({
    id: 9000 + n, chapter: 0,
    q: { es: `pregunta ${n}`, en: `question ${n}` },
    a: { es: `respuesta ${n}`, en: `answer ${n}` },
    chapterTag: { es: `Cap. ${n}`, en: `Ch. ${n}` },
  });
  {
    const ctx = loadApp();
    ctx.App.initFlashcards();
    check('N10 init: _fcAnimating arranca en false tras initFlashcards()',
      ctx.App._fcAnimating === false);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2), FC(3)];
    ctx.App.fcIndex = 0;
    ctx.App.fcStats = { hard: 0, ok: 0, easy: 0 };
    ctx.App._fcAnimating = false;
    const card = ctx.document.getElementById('flashcard');

    ctx.App.nextFlashcard();
    check('N10 next: activa el guard y desplaza la card actual hacia la izquierda',
      ctx.App._fcAnimating === true && card.style.transform === 'translateX(-50px)' && card.style.opacity === '0');
    check('N10 next: el índice no avanza hasta que termina la salida', ctx.App.fcIndex === 0);

    await new Promise(r => setTimeout(r, 260));
    check('N10 next: tras la salida, el índice avanza', ctx.App.fcIndex === 1);
    check('N10 next: la nueva card entra desde la derecha hacia el centro',
      card.style.transform === 'translateX(0)' && card.style.opacity === '1');
    check('N10 next: el guard sigue activo mientras entra', ctx.App._fcAnimating === true);

    await new Promise(r => setTimeout(r, 260));
    check('N10 next: al terminar de entrar, el guard se libera', ctx.App._fcAnimating === false);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2), FC(3)];
    ctx.App.fcIndex = 2;
    ctx.App.fcStats = { hard: 0, ok: 0, easy: 0 };
    ctx.App._fcAnimating = false;
    const card = ctx.document.getElementById('flashcard');

    ctx.App.prevFlashcard();
    check('N10 prev: desplaza la card actual hacia la derecha (espejo de next)',
      card.style.transform === 'translateX(50px)' && card.style.opacity === '0');

    await new Promise(r => setTimeout(r, 260));
    check('N10 prev: el índice retrocede', ctx.App.fcIndex === 1);
    await new Promise(r => setTimeout(r, 260));
    check('N10 prev: el guard se libera al terminar', ctx.App._fcAnimating === false);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2), FC(3)];
    ctx.App.fcIndex = 0;
    ctx.App.fcStats = { hard: 0, ok: 0, easy: 0 };
    ctx.App._fcAnimating = false;

    ctx.App.nextFlashcard(); // arranca animación, guard activo
    ctx.App.nextFlashcard(); // debe ignorarse por el guard
    check('N10 guard: un segundo clic mientras anima no avanza el índice dos veces',
      ctx.App.fcIndex === 0);
    await new Promise(r => setTimeout(r, 520)); // deja terminar el ciclo completo
    check('N10 guard: tras el ciclo completo, solo avanzó una vez', ctx.App.fcIndex === 1);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2)];
    ctx.App.fcIndex = ctx.App.fcCards.length - 1;
    ctx.App._fcAnimating = false;
    ctx.App.nextFlashcard(); // última card: no debe iniciar animación
    check('N10 límite: flecha siguiente en la última card no activa el guard ni mueve el índice',
      ctx.App._fcAnimating === false && ctx.App.fcIndex === 1);
  }
  {
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2)];
    ctx.App.fcIndex = 0;
    ctx.App._fcAnimating = false;
    ctx.App.prevFlashcard(); // primera card: no debe iniciar animación
    check('N10 límite: flecha anterior en la primera card no activa el guard ni mueve el índice',
      ctx.App._fcAnimating === false && ctx.App.fcIndex === 0);
  }
  {
    // rateFlashcard() llama internamente a nextFlashcard() — debe heredar la misma
    // animación, y el aviso de "mazo completado" debe esperar a que el índice avance
    // de verdad, no evaluarse antes de que la animación lo mueva (el bug real que
    // Step 5b corrige: hoy ese chequeo es síncrono justo después de la llamada).
    const ctx = loadApp();
    ctx.App.fcCards = [FC(1), FC(2)]; // 2 cards: calificar la 1ª debe llegar a la última
    ctx.App.fcIndex = 0;
    ctx.App.fcStats = { hard: 0, ok: 0, easy: 0 };
    ctx.App.fcReviewed = new Set();
    ctx.App._fcAnimating = false;
    ctx.App.state = { flashcardsReviewed: 0 };
    ctx.App.saveState = () => {};
    ctx.App.checkAchievements = () => {};
    const toasts = [];
    ctx.App.showToast = (msg, kind) => toasts.push({ msg, kind });
    const card = ctx.document.getElementById('flashcard');

    ctx.App.rateFlashcard('easy');
    check('N10 rateFlashcard: hereda la animación de nextFlashcard()',
      ctx.App._fcAnimating === true && card.style.transform === 'translateX(-50px)');
    check('N10 rateFlashcard: el aviso de mazo completado NO se dispara antes de que el índice avance',
      toasts.length === 0);

    await new Promise(r => setTimeout(r, 260));
    check('N10 rateFlashcard: al llegar a la última card, se dispara el aviso de mazo completado',
      ctx.App.fcIndex === 1 && toasts.length === 1);

    await new Promise(r => setTimeout(r, 260));
  }

  /* ---- N11: buscador global — dropdown sin navegación forzada ---- */
  {
    // Teclear >2 chars con match de glosario: abre el panel, NO navega, NO toca #glossarySearch
    const ctx = loadApp();
    ctx.App.init(null);
    ctx.App.currentView = 'dashboard';
    const input = ctx.document.getElementById('globalSearch');
    const panel = ctx.document.getElementById('globalSearchResults');
    input.value = ctx.GLOSSARY[0].term.es.toLowerCase();
    fireEl(input, 'input', { target: input });
    check('N11 dropdown: teclear >2 chars con match abre el panel',
      panel.style.display === 'block' && panel.innerHTML.length > 0);
    check('N11 dropdown: el panel lista el término del glosario que coincide',
      ctx.App._gsGlossary.length > 0 && panel.innerHTML.includes(ctx.GLOSSARY[0].term.es));
    check('N11 dropdown: teclear NO cambia de vista (antes navegaba a glosario)',
      ctx.App.currentView === 'dashboard');
    check('N11 dropdown: teclear NO escribe en #glossarySearch',
      ctx.document.getElementById('glossarySearch').value === '');

    // Bajar a ≤2 chars cierra el panel
    input.value = 'pr';
    fireEl(input, 'input', { target: input });
    check('N11 dropdown: bajar a ≤2 chars cierra el panel',
      panel.style.display === 'none' && panel.innerHTML === '');
  }
  {
    // Match de curriculum: la sección Contenido lista el topic (con lección) correcto
    const ctx = loadApp();
    ctx.App.init(null);
    ctx.App.currentView = 'flashcards';
    const topic = ctx.CHAPTERS[3].topics[0];
    const input = ctx.document.getElementById('globalSearch');
    input.value = topic.title.es.toLowerCase();
    fireEl(input, 'input', { target: input });
    check('N11 contenido: un título de topic aparece en la sección Contenido',
      ctx.App._gsContent.some(c => c.topicId === topic.id && c.chapterId === ctx.CHAPTERS[3].id));
    check('N11 contenido: tampoco navega (antes saltaba a curriculum)',
      ctx.App.currentView === 'flashcards');
  }
  {
    // Sin matches: mensaje "sin resultados"; la consulta del usuario NUNCA acaba en innerHTML
    const ctx = loadApp();
    ctx.App.init(null);
    const input = ctx.document.getElementById('globalSearch');
    const panel = ctx.document.getElementById('globalSearchResults');
    input.value = '<img src=x onerror=alert(1)>zzz';
    fireEl(input, 'input', { target: input });
    check('N11 vacío: sin matches muestra el mensaje de sin resultados',
      panel.innerHTML.includes(ctx.i18n.t('gs_no_results')));
    check('N11 xss: la consulta del usuario no se interpola en el innerHTML del panel',
      !panel.innerHTML.includes('<img src=x'));
  }
  {
    // Expandir/colapsar un término dentro del panel
    const ctx = loadApp();
    ctx.App.init(null);
    const input = ctx.document.getElementById('globalSearch');
    const panel = ctx.document.getElementById('globalSearchResults');
    input.value = ctx.GLOSSARY[0].term.es.toLowerCase();
    fireEl(input, 'input', { target: input });

    ctx.App._gsToggleTerm(0);
    check('N11 expandir: el clic marca el resultado como expandido y muestra el enlace al glosario',
      ctx.App._gsExpanded === 0 &&
      panel.innerHTML.includes('search-result expanded') &&
      panel.innerHTML.includes(ctx.i18n.t('gs_view_in_glossary')));

    ctx.App._gsToggleTerm(0);
    check('N11 expandir: un segundo clic colapsa el término',
      ctx.App._gsExpanded === null && !panel.innerHTML.includes('search-result expanded'));
  }
  {
    // «Ver en glosario»: navega, aplica el filtro y limpia el buscador global
    const ctx = loadApp();
    ctx.App.init(null);
    ctx.App.currentView = 'dashboard';
    const input = ctx.document.getElementById('globalSearch');
    const panel = ctx.document.getElementById('globalSearchResults');
    input.value = ctx.GLOSSARY[0].term.es.toLowerCase();
    fireEl(input, 'input', { target: input });

    ctx.App._gsGoGlossary();
    check('N11 ver-en-glosario: navega a la vista de glosario', ctx.App.currentView === 'glossary');
    check('N11 ver-en-glosario: aplica el filtro en #glossarySearch',
      ctx.document.getElementById('glossarySearch').value === ctx.GLOSSARY[0].term.es.toLowerCase());
    check('N11 ver-en-glosario: cierra el panel y limpia el buscador global',
      panel.style.display === 'none' && input.value === '');
  }
  {
    // Clic en un resultado de Contenido: va directo a la lección
    const ctx = loadApp();
    ctx.App.init(null);
    const panel = ctx.document.getElementById('globalSearchResults');
    let navArgs = null;
    ctx.App.navigateToLesson = (c, t) => { navArgs = [c, t]; };
    const topic = ctx.CHAPTERS[3].topics[0];
    ctx.App._gsGoLesson(ctx.CHAPTERS[3].id, topic.id);
    check('N11 lección: el clic llama a navigateToLesson con chapterId/topicId correctos',
      navArgs !== null && navArgs[0] === ctx.CHAPTERS[3].id && navArgs[1] === topic.id);
    check('N11 lección: cierra el panel', panel.style.display === 'none');
  }
  {
    // Ciclo de vida del flag _examActive
    const ctx = loadApp();
    ctx.App._initialized = true;
    ctx.App.state = ctx.App.loadState();
    ctx.App.examQuestions = [SAMPLE_Q]; ctx.App.examAnswers = { 0: 0 };
    ctx.App.examType = 'chapter'; ctx.App.examChapterId = null;
    ctx.App.examCurrentQ = 0; ctx.App.examReviewing = false;
    ctx.App.examTimeLeft = 0; ctx.App.examTimer = null;
    check('N11 examen: _examActive arranca en false', ctx.App._examActive === false);
    ctx.App.launchExam('t');
    check('N11 examen: launchExam activa _examActive', ctx.App._examActive === true);
    ctx.App.finishExam();
    check('N11 examen: finishExam desactiva _examActive', ctx.App._examActive === false);
    ctx.App._examActive = true;
    ctx.App.renderSimulatorMenu();
    check('N11 examen: volver al menú del simulador desactiva _examActive (sin bloqueo permanente)',
      ctx.App._examActive === false);
    ctx.App._examActive = true;
    ctx.App.navigate('progress');
    check('N11 examen: navegar a otra vista desactiva _examActive (no quedar bloqueado permanente)',
      ctx.App._examActive === false);
  }
  {
    // Con examen activo, las acciones que navegan quedan bloqueadas con toast
    const ctx = loadApp();
    ctx.App.init(null);
    ctx.App.currentView = 'simulator';
    const input = ctx.document.getElementById('globalSearch');
    input.value = ctx.GLOSSARY[0].term.es.toLowerCase();
    fireEl(input, 'input', { target: input });

    ctx.App._examActive = true;
    const toasts = [];
    ctx.App.showToast = (msg, kind) => toasts.push({ msg, kind });
    let navCalled = false;
    ctx.App.navigateToLesson = () => { navCalled = true; };

    ctx.App._gsGoGlossary();
    check('N11 guard: con examen activo, «Ver en glosario» no navega y avisa con toast',
      ctx.App.currentView === 'simulator' && toasts.length === 1 &&
      toasts[0].msg === ctx.i18n.t('gs_exam_block_toast'));

    ctx.App._gsGoLesson(0, ctx.CHAPTERS[0].topics[0].id);
    check('N11 guard: con examen activo, un resultado de lección tampoco navega',
      navCalled === false && toasts.length === 2);

    check('N11 guard: consultar el dropdown durante el examen sigue funcionando (no navega, no bloquea)',
      ctx.document.getElementById('globalSearchResults').innerHTML.length > 0);
  }
  {
    // Fix 2026-07-08 encontrado en verificación manual con navegador real
    // (no reproducible en el DOM mockeado de este arnés, que no linka
    // padres/hijos ni soporta bubbling real): el listener de "clic fuera"
    // del buscador global usaba e.target.closest('.search-box'), pero el
    // onclick inline de un resultado (_gsToggleTerm) reemplaza el innerHTML
    // de #globalSearchResults *durante la fase de target*, antes de que
    // este listener (fase bubble, en document) llegue a ejecutarse. Eso
    // deja e.target — el nodo ya sustituido — desconectado del árbol para
    // cuando el bubble llega a document, así que closest() daba false y el
    // propio clic para expandir un término cerraba el panel al instante.
    // composedPath() se captura antes del dispatch, así que no le afecta
    // esa mutación. Chequeo estático porque el runtime no es reproducible aquí.
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N11 fix: el listener "clic fuera" del buscador global usa composedPath(), no e.target.closest()',
      /composedPath/.test(appSrc) && !/e\.target\.closest\('\.search-box'\)/.test(appSrc));
  }

  /* ---- N12: contraste — texto inline en app.js no usa tokens raw success/warning/danger ---- */
  {
    // scripts/validate-contrast.js sólo ve los pares de tokens de css/styles.css;
    // no ve el color de texto inline que ponen las plantillas de app.js (style="color:...").
    // Este chequeo estático es su complemento: guarda que ningún span/div de texto en
    // app.js vuelva a usar var(--success)/var(--warning)/var(--danger) —que sólo cumplen
    // AA en dark— como color de TEXTO; debe usarse el token *-text (o su clase .text-*).
    // Desde la ronda 2 (2026-07-15) cubre también var(--secondary); los acentos de
    // capítulo como texto (continue-list %, cpring %) se migraron a var(--text2) y
    // los guarda el check N18 de abajo. Tres excepciones restantes, deliberadas y
    // preexistentes (registradas en AGENTS.md → "UI/UX remediation ronda 2"):
    //   1. .chapter-number (js/app.js ~358) — texto grande/bold sobre tinte, umbral
    //      AA de texto grande (3:1), no 4.5:1.
    //   2. .lesson-chapter-tag (js/app.js ~429) — color:${color} hex de acento de
    //      capítulo sobre su propio tinte rgba 0.15 (hex literal: este regex de
    //      tokens var() no lo ve).
    //   3. .lesson-content code (css/styles.css ~783) — color: var(--secondary) en
    //      CSS, fuera del alcance de este check (solo mira app.js) y sin par en
    //      validate-contrast.js.
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N12 contraste: app.js no usa color:var(--success|warning|danger|secondary) crudo como texto inline',
      !/color:\s*var\(--(success|warning|danger|secondary)\)/.test(appSrc));
  }

  /* ---- N13: accesibilidad — live region, nombres accesibles (I6+I5, revisión UI 2026-07-14) ---- */
  {
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const i18nSrc = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');

    // I6: el toast del guard de examen es el ÚNICO feedback cuando se bloquea la
    // navegación — sin live region, un lector de pantalla no se entera de nada.
    check('N13 a11y: #toastContainer es live region (aria-live="polite")',
      /id="toastContainer"[^>]*aria-live="polite"|aria-live="polite"[^>]*id="toastContainer"/.test(htmlSrc));
    // El popup de XP es decorativo (su información llega también por toasts/contadores);
    // sin aria-hidden duplicaría anuncios o metería ruido en el lector.
    check('N13 a11y: #xpPopup está oculto para lectores (aria-hidden="true")',
      /id="xpPopup"[^>]*aria-hidden="true"|aria-hidden="true"[^>]*id="xpPopup"/.test(htmlSrc));
    // I5: mecanismo data-i18n-aria — cuarto bloque del applier, espejo de data-i18n-title.
    check('N13 a11y: i18n.apply() aplica data-i18n-aria como aria-label',
      /data-i18n-aria/.test(i18nSrc) && /setAttribute\('aria-label'/.test(i18nSrc));
    // I5: los cinco controles icon-only llevan nombre accesible i18n.
    for (const [id, key] of [
      ['mobileMenuBtn', 'mobile_menu_aria'],
      ['fcPrev', 'fc_prev_aria'],
      ['fcNext', 'fc_next_aria'],
      ['avatarModalClose', 'close_label'],
      ['sidebarToggle', 'collapse_menu_title'],
    ]) {
      const re = new RegExp(`id="${id}"[^>]*data-i18n-aria="${key}"|data-i18n-aria="${key}"[^>]*id="${id}"`);
      check(`N13 a11y: #${id} lleva data-i18n-aria="${key}"`, re.test(htmlSrc));
    }

    // I4: inputs <16px provocan auto-zoom en iOS al enfocar. 1rem = 16px (html base).
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    for (const sel of ['.search-input {', '.select-input {', '.search-input-full {', '.auth-field input {']) {
      const i = cssSrc.indexOf(sel);
      const block = i >= 0 ? cssSrc.slice(i, cssSrc.indexOf('}', i)) : '';
      check(`N13 a11y: ${sel.replace(' {', '')} usa font-size: 1rem (sin auto-zoom iOS)`,
        /font-size:\s*1rem/.test(block));
    }
  }

  /* ---- N14: teclado (C1, revisión UI 2026-07-14) — chequeos estáticos ---- */
  {
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    // Un único listener delegado en document cubre todos los divs role="button"
    // de las plantillas innerHTML (que se regeneran constantemente).
    check('N14 teclado: handler delegado Enter/Espacio→click sobre [role="button"] en app.js',
      /e\.key === 'Enter'/.test(appSrc) && /getAttribute\('role'\) === 'button'/.test(appSrc));
    check('N14 teclado: las opciones del examen llevan role/tabindex/aria-pressed cuando son interactivas',
      /onclick="App\.selectAnswer\(\$\{i\}\)" role="button" tabindex="0" aria-pressed="\$\{i === selected\}"/.test(appSrc));
    check('N14 teclado: los dots del examen llevan role, tabindex rotativo y aria-label i18n',
      /onclick="App\.goToQuestion\(\$\{i\}\)" role="button" tabindex="\$\{i === this\.examCurrentQ \? 0 : -1\}"/.test(appSrc)
      && /aria-label="\$\{i18n\.t\('goto_question_aria'\)\} \$\{i \+ 1\}"/.test(appSrc));
    check('N14 teclado: selectAnswer restaura el foco tras regenerar el innerHTML',
      /getElementById\('opt' \+ optIndex\)/.test(appSrc));
    check('N14 teclado: styles.css define :focus-visible con outline visible',
      /:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--primary\)/.test(cssSrc));
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N14 teclado: las opciones del desafío diario llevan role/tabindex',
      /id="dcOpt\$\{i\}" role="button" tabindex="0"/.test(appSrc));
    check('N14 teclado: los topics del curriculum llevan role/tabindex SOLO cuando tienen lección',
      /navigateToLesson\(\$\{ch\.id\}, '\$\{t\.id\}'\)" role="button" tabindex="0"/.test(appSrc));
    check('N14 teclado: las cabeceras de capítulo llevan role/tabindex',
      /toggleChapter\(\$\{i\}\)" role="button" tabindex="0"/.test(appSrc));
    check('N14 teclado: las 4 stat-cards del dashboard llevan role/tabindex',
      (htmlSrc.match(/class="stat-card" onclick="App\.navigate\('[a-z]+'\)" role="button" tabindex="0"/g) || []).length === 4);
    check('N14 teclado: #themeToggle es un <button> real, no un div',
      /<button[^>]*id="themeToggle"/.test(htmlSrc) && !/<div[^>]*id="themeToggle"/.test(htmlSrc));
    check('N14 teclado: la flashcard es volteable por teclado (role/tabindex/aria en #flashcard)',
      /id="flashcard"[^>]*role="button" tabindex="0" data-i18n-aria="click_to_flip"|role="button" tabindex="0" data-i18n-aria="click_to_flip"[^>]*id="flashcard"/.test(htmlSrc));
  }

  /* ---- N15: prefers-reduced-motion (I2, revisión UI 2026-07-14) ---- */
  {
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    // Bloque global "blunt": neutraliza toda animación/transición actual Y futura
    // (el !important gana incluso a los estilos inline del carrusel).
    check('N15 motion: styles.css define el bloque global prefers-reduced-motion',
      /@media \(prefers-reduced-motion: reduce\)[\s\S]{0,400}animation-duration:\s*0\.01ms !important[\s\S]{0,400}transition-duration:\s*0\.01ms !important/.test(cssSrc));
    // El CSS mata el movimiento pero no los setTimeout: sin esto el carrusel
    // metía ~500ms de retardo muerto con reduced-motion activo.
    check('N15 motion: el carrusel de flashcards colapsa su duración con prefers-reduced-motion',
      /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/.test(appSrc));
  }

  /* ---- N16: objetivos táctiles (I3) + búsqueda móvil (I7) — ronda 2, 2026-07-15 ---- */
  {
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    const coarseStart = cssSrc.indexOf('@media (pointer: coarse)');
    const motionStart = cssSrc.indexOf('@media (prefers-reduced-motion: reduce)');
    check('N16 táctil: existe el bloque @media (pointer: coarse)', coarseStart >= 0);
    // Orden de la cola del fichero: coarse ANTES de reduced-motion (y :focus-visible sigue último).
    check('N16 táctil: el bloque coarse va antes del bloque reduced-motion',
      coarseStart >= 0 && motionStart > coarseStart);
    const coarse = coarseStart >= 0 ? cssSrc.slice(coarseStart, motionStart) : '';
    check('N16 táctil: .lang-btn crece a ≥44px en táctil',
      /\.lang-btn\s*\{[^}]*min-height:\s*44px/.test(coarse) && /\.lang-btn\s*\{[^}]*min-width:\s*44px/.test(coarse));
    check('N16 táctil: .exam-dot crece a 44px en táctil',
      /\.exam-dot\s*\{[^}]*width:\s*44px/.test(coarse) && /\.exam-dot\s*\{[^}]*height:\s*44px/.test(coarse));
    check('N16 táctil: separación ≥8px entre targets (lang-switcher y exam-question-dots)',
      /\.lang-switcher\s*\{[^}]*gap:\s*8px/.test(coarse) && /\.exam-question-dots\s*\{[^}]*gap:\s*8px/.test(coarse));
    check('N16 táctil: .name-edit-btn siempre visible en táctil',
      /\.name-edit-btn\s*\{[^}]*opacity:\s*0\.7/.test(coarse));
    check('N16 táctil: .name-edit-btn visible con foco de teclado (en cualquier dispositivo)',
      /\.user-card:focus-within \.name-edit-btn/.test(cssSrc) && /\.name-edit-btn:focus-visible/.test(cssSrc));
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N16 móvil: #mobileSearchBtn existe con nombre accesible i18n y aria-expanded',
      /id="mobileSearchBtn"[^>]*data-i18n-aria="mobile_search_aria"|data-i18n-aria="mobile_search_aria"[^>]*id="mobileSearchBtn"/.test(htmlSrc)
      && /id="mobileSearchBtn"[^>]*aria-expanded="false"|aria-expanded="false"[^>]*id="mobileSearchBtn"/.test(htmlSrc));
    check('N16 móvil: #searchCloseBtn existe con nombre accesible i18n',
      /id="searchCloseBtn"[^>]*data-i18n-aria="close_search_aria"|data-i18n-aria="close_search_aria"[^>]*id="searchCloseBtn"/.test(htmlSrc));
    check('N16 móvil: #globalSearch tiene nombre accesible real (no solo placeholder)',
      /id="globalSearch"[^>]*data-i18n-aria="global_search_aria"|data-i18n-aria="global_search_aria"[^>]*id="globalSearch"/.test(htmlSrc));
    check('N16 móvil: .search-box tiene modo móvil (.mobile-open) en vez de display:none a secas',
      /\.search-box\.mobile-open\s*\{\s*display:\s*flex/.test(cssSrc));
    check('N16 móvil: App._closeMobileSearch existe y devuelve el foco al botón',
      /_closeMobileSearch\(returnFocus = true\)/.test(appSrc) && /_closeMobileSearch/.test(appSrc.slice(appSrc.indexOf("key === 'Escape'"))));
    check('N16 combobox: #globalSearch declara role/aria-controls/aria-expanded',
      /id="globalSearch"[^>]*role="combobox"|role="combobox"[^>]*id="globalSearch"/.test(htmlSrc)
      && /aria-controls="globalSearchResults"/.test(htmlSrc));
    check('N16 combobox: el panel de resultados es role="listbox"',
      /id="globalSearchResults"[^>]*role="listbox"|role="listbox"[^>]*id="globalSearchResults"/.test(htmlSrc));
    check('N16 combobox: los resultados llevan id estable y role="option"',
      /id="gs-opt-\$\{/.test(appSrc) && /role="option"/.test(appSrc));
    check('N16 combobox: flechas/Enter/aria-activedescendant implementados',
      /_gsMove/.test(appSrc) && /_gsActivate/.test(appSrc) && /ArrowDown/.test(appSrc) && /aria-activedescendant/.test(appSrc));
    check('N16 combobox: estilo visible del resultado activo',
      /\.search-result\.gs-active/.test(cssSrc));
  }

  /* ---- N16b: combobox behavioral — flechas mueven el activo, Enter expande ---- */
  {
    const ctx = loadApp();
    ctx.App.state = ctx.App.loadState();
    const input = ctx.document.getElementById('globalSearch');
    const term = ctx.GLOSSARY[0].term.es.slice(0, 4).toLowerCase();
    input.value = term;
    ctx.App._onGlobalSearchInput({ target: input });
    const noop = () => {};
    ctx.App._gsKeydown({ key: 'ArrowDown', preventDefault: noop });
    check('N16b combobox: ArrowDown activa el primer resultado y actualiza aria-activedescendant',
      ctx.App._gsActive === 0 && input._attrs['aria-activedescendant'] === 'gs-opt-0');
    ctx.App._gsKeydown({ key: 'Enter', preventDefault: noop });
    check('N16b combobox: Enter sobre un término lo expande in place',
      ctx.App._gsExpanded === 0);
  }

  /* ---- N17: iconos SVG estructurales (I8) — sprite inline, sin emojis de UI ---- */
  {
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    const SYMBOLS = ['graduation-cap', 'home', 'book', 'layers', 'file-text', 'book-open',
      'bar-chart', 'trophy', 'menu', 'search', 'x', 'power', 'arrow-left', 'arrow-right',
      'star', 'pencil', 'check', 'check-circle', 'alert-triangle', 'x-circle', 'info',
      'lock', 'play', 'chevron-right', 'sun', 'moon'];
    check('N17 iconos: sprite inline presente con los 26 símbolos',
      SYMBOLS.every(s => htmlSrc.includes(`id="i-${s}"`)));
    check('N17 iconos: el sprite está oculto y fuera del árbol de accesibilidad',
      /<svg[^>]*style="display:none"[^>]*aria-hidden="true"|<svg[^>]*aria-hidden="true"[^>]*style="display:none"/.test(htmlSrc));
    check('N17 iconos: App._icon definido con aria-hidden',
      /_icon\(name\)/.test(appSrc) && /class="icon" aria-hidden="true"><use href="#i-\$\{name\}"/.test(appSrc));
    check('N17 iconos: clase .icon definida (currentColor, 1em)',
      /\.icon\s*\{[^}]*stroke:\s*currentColor/.test(cssSrc) && /\.icon\s*\{[^}]*width:\s*1em/.test(cssSrc));
    check('N17 iconos: la nav del sidebar usa el sprite (7 nav-icons)',
      (htmlSrc.match(/class="nav-icon"><svg class="icon" aria-hidden="true"><use href="#i-/g) || []).length === 7);
    check('N17 iconos: los 4 stat-icons usan el sprite',
      (htmlSrc.match(/class="stat-icon"><svg class="icon" aria-hidden="true"><use href="#i-/g) || []).length === 4);
    check('N17 iconos: logo, toggles, logout, búsqueda y flechas usan el sprite',
      ['auth-logo-icon', 'logo-icon'].every(c => new RegExp(`class="${c}"><svg class="icon"`).test(htmlSrc))
      && !/id="sidebarToggle"[^>]*>&#9776;|id="mobileMenuBtn"[^>]*>&#9776;/.test(htmlSrc)
      && /id="mobileSearchBtn"[^>]*><svg class="icon"/.test(htmlSrc)
      && /class="logout-icon"><svg class="icon"/.test(htmlSrc)
      && !/id="fcPrev"[^>]*>&#8592;|id="fcNext"[^>]*>&#8594;/.test(htmlSrc)
      && !/id="avatarModalClose"[^>]*>✕|id="searchCloseBtn"[^>]*>✕/.test(htmlSrc));
    check('N17 iconos: los emojis decorativos que se quedan llevan aria-hidden',
      /class="welcome-emoji" aria-hidden="true"/.test(htmlSrc)
      && /id="resultsEmoji" aria-hidden="true"|aria-hidden="true"[^>]*id="resultsEmoji"/.test(htmlSrc)
      && /class="streak-fire" aria-hidden="true"/.test(htmlSrc));
    const avSrc = fs.readFileSync(path.join(ROOT, 'js', 'avatar.js'), 'utf8');
    check('N17 iconos: showToast usa _icon para el icono de tipo',
      /success: this\._icon\('check-circle'\)/.test(appSrc) && /warning: this\._icon\('alert-triangle'\)/.test(appSrc)
      && !/success: '✅'/.test(appSrc));
    check('N17 iconos: estados del curriculum (check/play/lock) vía _icon',
      /this\._icon\('check'\)/.test(appSrc) && /this\._icon\('play'\)/.test(appSrc) && /this\._icon\('lock'\)/.test(appSrc));
    check('N17 iconos: chevron de capítulo vía _icon',
      /class="chapter-chevron">\$\{this\._icon\('chevron-right'\)\}/.test(appSrc));
    check('N17 iconos: toggle de tema vía _icon (sun/moon), sin emojis',
      /this\._icon\(.{0,40}'sun'.{0,20}'moon'\)/.test(appSrc) && !/'☀️'/.test(appSrc) && !/'🌙'/.test(appSrc));
    check('N17 iconos: el lápiz de editar nombre usa App._icon',
      /App\._icon\('pencil'\)/.test(avSrc) && !/'✏️'/.test(avSrc));
    check('N17 iconos: .theme-btn y .name-edit-btn declaran color (los SVG currentColor no heredan negro UA)',
      /\.theme-btn\s*\{[^}]*color:\s*var\(--text\)/.test(cssSrc) && /\.name-edit-btn\s*\{[^}]*color:\s*var\(--text2\)/.test(cssSrc));
  }

  /* ---- N18: follow-ups menores (ronda 2, 2026-07-15) ---- */
  {
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    const avSrc = fs.readFileSync(path.join(ROOT, 'js', 'avatar.js'), 'utf8');
    // Avatar: apertura por teclado + dialog + Escape + foco de vuelta.
    check('N18 avatar: #userAvatar es operable por teclado con nombre i18n',
      /id="userAvatar"[^>]*role="button" tabindex="0"|role="button" tabindex="0"[^>]*id="userAvatar"/.test(htmlSrc)
      && /id="userAvatar"[^>]*data-i18n-aria="change_avatar_title"|data-i18n-aria="change_avatar_title"[^>]*id="userAvatar"/.test(htmlSrc));
    check('N18 avatar: el modal declara role="dialog" aria-modal',
      /id="avatar-modal"[^>]*role="dialog" aria-modal="true"|role="dialog" aria-modal="true"[^>]*id="avatar-modal"/.test(htmlSrc)
      && /aria-labelledby="avatarModalTitle"/.test(htmlSrc));
    check('N18 avatar: las av-card llevan role/tabindex (el handler delegado las cubre)',
      /class="av-card[^"]*" role="button" tabindex="0"/.test(avSrc));
    check('N18 avatar: Escape cierra y el foco vuelve al lanzador',
      /key === 'Escape'/.test(avSrc) && /_returnFocusEl/.test(avSrc));
    check('N18 expanded: las cabeceras de capítulo llevan aria-expanded desde el Set',
      /toggleChapter\(\$\{i\}\)" role="button" tabindex="0" aria-expanded="\$\{/.test(appSrc));
    check('N18 expanded: toggleChapter sincroniza aria-expanded (no re-renderiza)',
      /setAttribute\('aria-expanded', String\(isOpen\)\)/.test(appSrc));
    check('N18 expanded: #mobileMenuBtn refleja el estado del drawer',
      /id="mobileMenuBtn"[^>]*aria-expanded="false"|aria-expanded="false"[^>]*id="mobileMenuBtn"/.test(htmlSrc)
      && /mobileMenuBtn'\)\.setAttribute\('aria-expanded'/.test(appSrc));
    check('N18 teclado: los continue-item del dashboard llevan role/tabindex',
      /class="continue-item" onclick="App\.navigate\('curriculum'\)" role="button" tabindex="0"/.test(appSrc));
    check('N18 expanded: navigate() cierra el drawer sincronizando aria-expanded',
      /remove\('mobile-open'\);?\s*\n?\s*document\.getElementById\('mobileMenuBtn'\)\.setAttribute\('aria-expanded', 'false'\)/.test(appSrc));
    check('N18 dots: el dot actual lleva aria-current',
      /aria-current="true"/.test(appSrc));
    check('N18 dots: flechas Izq/Der navegan entre preguntas desde un dot',
      /classList\.contains\('exam-dot'\)/.test(appSrc) && /ArrowRight/.test(appSrc) && /ArrowLeft/.test(appSrc));
    check('N18 dots: goToQuestion restaura el foco tras el re-render',
      /goToQuestion\(i\)\s*\{[\s\S]{0,400}focus\(\)/.test(appSrc));
    check('N18 toasts: warning/error se anuncian asertivos (role="alert" en el nodo)',
      /type === 'warning' \|\| type === 'error'/.test(appSrc) && /setAttribute\('role', 'alert'\)/.test(appSrc));
    check('N18 contraste: los porcentajes de continue-list/cpring ya no usan el acento como texto',
      !/style="color:\$\{colors\[i\]\}/.test(appSrc));
  }

  /* ---- N19: botón flotante Buy Me a Coffee (2026-07-15) ---- */
  {
    const ctx = loadApp();
    check('N19 i18n: bmc_label definido en ES y EN',
      typeof ctx.TRANSLATIONS.es.bmc_label === 'string' && ctx.TRANSLATIONS.es.bmc_label.length > 0
      && typeof ctx.TRANSLATIONS.en.bmc_label === 'string' && ctx.TRANSLATIONS.en.bmc_label.length > 0);
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N19 icono: símbolo #i-coffee presente en el sprite',
      htmlSrc.includes('id="i-coffee"'));
    check('N19 markup: .bmc-fab enlaza a buymeacoffee con rel/target seguros',
      /<a class="bmc-fab"[^>]*href="https:\/\/buymeacoffee\.com\/jorgeborn3m"/.test(htmlSrc)
      && /class="bmc-fab"[^>]*target="_blank"/.test(htmlSrc)
      && /class="bmc-fab"[^>]*rel="noopener noreferrer"/.test(htmlSrc));
    check('N19 markup: .bmc-fab usa el sprite #i-coffee y la clave i18n en un span (no en el <a>, si no i18n.apply borra el icono; sin emoji)',
      /<a class="bmc-fab"[\s\S]*?<use href="#i-coffee"\/>[\s\S]*?<\/a>/.test(htmlSrc)
      && /<span data-i18n="bmc_label">/.test(htmlSrc)
      && !/<a class="bmc-fab"[^>]*\sdata-i18n=/.test(htmlSrc)
      && !/<a class="bmc-fab"[^>]*>[\s\S]*?☕/.test(htmlSrc));
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    check('N19 css: .bmc-fab es fixed y usa --primary-dark (AA: blanco sobre él = 5.83:1)',
      /\.bmc-fab\s*\{[^}]*position:\s*fixed/.test(cssSrc)
      && /\.bmc-fab\s*\{[^}]*background:\s*var\(--primary-dark\)/.test(cssSrc)
      && /\.bmc-fab\s*\{[^}]*color:\s*#fff/.test(cssSrc));
    check('N19 css: los toasts se apilan por encima del pill (no en bottom:24px a secas)',
      /\.toast-container\s*\{[^}]*bottom:\s*80px/.test(cssSrc));
    check('N19 css: el pill se oculta durante el examen',
      /body\.exam-active\s+\.bmc-fab\s*\{[^}]*display:\s*none/.test(cssSrc));
    check('N19 css: las reglas del pill van antes del bloque reduced-motion',
      cssSrc.indexOf('.bmc-fab') < cssSrc.indexOf('@media (prefers-reduced-motion'));
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N19 examen: _setExamActive setea el flag y togglea la clase del body',
      /_setExamActive\(active\)\s*\{[\s\S]{0,160}this\._examActive = active[\s\S]{0,160}document\.body\.classList\.toggle\('exam-active', active\)/.test(appSrc));
    check('N19 examen: launchExam/finishExam/navigate/renderSimulatorMenu usan el helper',
      (appSrc.match(/this\._setExamActive\((true|false)\)/g) || []).length >= 4
      && !/this\._examActive = true/.test(appSrc));
    const privacySrc = fs.readFileSync(path.join(ROOT, 'privacy.html'), 'utf8');
    check('N19 privacidad: privacy.html menciona Buy Me a Coffee (ES y EN)',
      (privacySrc.match(/Buy Me a Coffee/g) || []).length >= 2);
  }

  /* ---- N20: adaptabilidad móvil (2026-07-21) — tier 480 + invariantes ---- */
  {
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    const tier480 = cssSrc.indexOf('@media (max-width: 480px)');
    const coarseStart = cssSrc.indexOf('@media (pointer: coarse)');
    check('N20 tier: existe @media (max-width: 480px) y va antes del bloque coarse',
      tier480 >= 0 && coarseStart > tier480);
    check('N20 tier: el bloque de 500px fue fusionado (ya no existe)',
      // Con { al final: el tier lo menciona en un comentario (eso está bien),
      // lo prohibido es que exista como bloque @media real.
      !/@media \(max-width: 500px\)\s*\{/.test(cssSrc));
    // El tier acaba donde empieza la sección UTILITY que lo sigue — así el
    // slice no arrastra CSS ajeno y los checks afirman "dentro del tier".
    const tierEnd = cssSrc.indexOf('/* ===== UTILITY', tier480 >= 0 ? tier480 : 0);
    const t480 = tier480 >= 0 && tierEnd > tier480 ? cssSrc.slice(tier480, tierEnd) : '';
    check('N20 tier: avatar-grid a 1 columna vive en el tier 480',
      /\.avatar-grid\s*\{\s*grid-template-columns:\s*1fr/.test(t480));
    check('N20 tier: stats-grid y results-stats colapsan a 1 columna',
      /\.stats-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*[;}]/.test(t480)
      && /\.results-stats\s*\{[^}]*grid-template-columns:\s*1fr\s*[;}]/.test(t480));
    check('N20 tier: filas flex envuelven (rating/results-actions/lesson-actions/exam-topbar/flashcard-stats)',
      ['.rating-btns', '.results-actions', '.lesson-actions', '.exam-topbar', '.flashcard-stats-row']
        .every(s => new RegExp(s.replace('.', '\\.') + '[^{]*\\{[^}]*flex-wrap:\\s*wrap').test(t480)));
    check('N20 tier: paddings reducidos (.view/.topbar/.exam-body/.auth-card)',
      /\.view\s*\{[^}]*padding:\s*12px/.test(t480) && /\.topbar\s*\{[^}]*padding:/.test(t480)
      && /\.exam-body\s*\{[^}]*padding:/.test(t480) && /\.auth-card\s*\{[^}]*padding:/.test(t480));
    check('N20 tier: prohibido overflow-x:hidden como mitigación en body/main/views-container',
      !/(?:^|[\s,])(?:body|html|\.main|\.views-container)[^{]*\{[^}]*overflow-x:\s*hidden/m.test(cssSrc));
  }

  /* ---- N5 + P5: chequeos estáticos de i18n ---- */
  {
    const ctx = loadApp();
    const es = Object.keys(ctx.TRANSLATIONS.es), en = Object.keys(ctx.TRANSLATIONS.en);
    check(`i18n: paridad ES/EN (${es.length}/${en.length})`,
      es.length === en.length && es.every(k => en.includes(k)));

    const uiFiles = ['js/app.js', 'js/auth.js', 'js/avatar.js', 'js/onboarding.js', 'index.html'];
    const used = new Set();
    for (const f of uiFiles) {
      const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
      for (const m of t.matchAll(/i18n\.t\('([^']+)'\)/g)) used.add(m[1]);
      for (const m of t.matchAll(/data-i18n(?:-placeholder|-title|-aria)?="([^"]+)"/g)) used.add(m[1]);
    }
    const undef = [...used].filter(k => !es.includes(k));
    check(`i18n: sin claves usadas-pero-no-definidas${undef.length ? ' (' + undef.join(', ') + ')' : ''}`,
      undef.length === 0);

    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    const authSrc = fs.readFileSync(path.join(ROOT, 'js', 'auth.js'), 'utf8');
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('i18n: sin "¡Sigue así!" hardcodeado en app.js', !appSrc.includes('¡Sigue así!'));
    check('i18n: sin fallback \'Estudiante\' hardcodeado en app.js/auth.js',
      !appSrc.includes("'Estudiante'") && !authSrc.includes("'Estudiante'"));
    check('i18n: sin "Logro:" hardcodeado en app.js', !appSrc.includes('Logro:'));
    check('i18n: la etiqueta visible del logout usa data-i18n',
      /class="logout-label"[^>]*data-i18n=|data-i18n="[^"]*"[^>]*class="logout-label"/.test(htmlSrc)
      || /<span class="logout-label" data-i18n=/.test(htmlSrc));
    check('i18n: tooltips del sidebar/topbar usan data-i18n-title',
      ['sidebarToggle', 'logoutBtn', 'themeToggle'].every(id =>
        new RegExp(`id="${id}"[^>]*data-i18n-title=|data-i18n-title="[^"]*"[^>]*id="${id}"`).test(htmlSrc)));
    check('i18n: sin ternarios i18n.lang sueltos en js/',
      !ORDER.some(f => /i18n\.lang === '(es|en)' \?/.test(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8'))));
  }

  console.log(failures ? `\n❌ ${failures} chequeo(s) fallando.` : '\n✅ Todos los chequeos de runtime pasan.');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error('❌ El arnés reventó:', e); process.exit(1); });
