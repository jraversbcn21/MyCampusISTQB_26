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
    removeAttribute(k) { delete el._attrs[k]; },
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
  const calls = { upserts: [], deletes: [] };
  const client = {
    _calls: calls,
    auth: {
      onAuthStateChange(cb) { calls.authStateCb = cb; return { data: { subscription: {} } }; },
      getSession: async () => ({ data: { session: 'session' in opts ? opts.session : { access_token: 'tok-mock' } } }),
      signOut: async () => ({ error: null }),
    },
    from(table) {
      const chain = {
        select() { return chain; },
        order() { return chain; },
        limit() { return chain; },
        gt() { return chain; },
        eq() { return chain; },
        single: async () => opts.singleResult || { data: null, error: { code: 'PGRST116' } },
        upsert: async (row) => { calls.upserts.push({ table, ...row }); return { error: null }; },
        delete() { calls.deletes.push({ table }); return { eq: async () => ({ error: null }) }; },
        // Los selects de lista/count se esperan directamente (thenable): consumen
        // opts.selectQueue en orden, o un resultado vacío por defecto.
        then(resolve) {
          resolve((opts.selectQueue && opts.selectQueue.length)
            ? opts.selectQueue.shift()
            : { data: [], count: 0, error: null });
        },
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
  const nav = opts.navigator || {};
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
  const globals = fn(win, doc, ls, { replaceState() {} }, fetchMock, () => true, nav);
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
    ctx.Sync._reconciled = true; // flujo normal: ya reconciliado con la nube
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
    // (Anclas grep-ables, no números de línea: la ronda móvil de 2026-07-21 desplazó
    //  app.js ~55 líneas y dejó obsoletas las citas literales que había aquí.)
    //   1. .chapter-number (en renderCurriculum) — texto grande/bold sobre tinte, umbral
    //      AA de texto grande (3:1), no 4.5:1.
    //   2. .lesson-chapter-tag (en renderLesson) — color:${color} hex de acento de
    //      capítulo sobre su propio tinte rgba 0.15 (hex literal: este regex de
    //      tokens var() no lo ve).
    //   3. .lesson-content code (en css/styles.css) — color: var(--secondary) en
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
    check('N17 iconos: la nav del sidebar usa el sprite (8 nav-icons)',
      (htmlSrc.match(/class="nav-icon"><svg class="icon" aria-hidden="true"><use href="#i-/g) || []).length === 8);
    check('N17 iconos: los 4 stat-icons usan el sprite',
      (htmlSrc.match(/class="stat-icon"><svg class="icon" aria-hidden="true"><use href="#i-/g) || []).length === 4);
    check('N17 iconos: logo, toggles, logout, búsqueda y flechas usan el sprite',
      ['lp-brand-icon', 'logo-icon'].every(c => new RegExp(`class="${c}"><svg class="icon"`).test(htmlSrc))
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
    // Recableado 2026-07-21 (N20): la sincronización de aria-expanded vive
    // ahora dentro de _setDrawerOpen (único punto de verdad del drawer), no
    // en cada listener — mismo comportamiento, un solo sitio.
    check('N18 expanded: #mobileMenuBtn refleja el estado del drawer',
      /id="mobileMenuBtn"[^>]*aria-expanded="false"|aria-expanded="false"[^>]*id="mobileMenuBtn"/.test(htmlSrc)
      && /menuBtn\.setAttribute\('aria-expanded', String\(open\)\)/.test(appSrc));
    check('N18 teclado: los continue-item del dashboard llevan role/tabindex',
      /class="continue-item" onclick="App\.navigate\('curriculum'\)" role="button" tabindex="0"/.test(appSrc));
    // Recableado 2026-07-21 (N20): navigate() cierra vía _setDrawerOpen(false),
    // que sincroniza aria-expanded por dentro (antes lo hacía a mano en línea).
    check('N18 expanded: navigate() cierra el drawer sincronizando aria-expanded',
      (() => {
        const nav = appSrc.slice(appSrc.indexOf('navigate(view, extra)'), appSrc.indexOf('navigateToLesson'));
        return /_setDrawerOpen\(false\)/.test(nav);
      })());
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
      // Base 80px, hoy dentro de calc(80px + env(safe-area-inset-bottom))
      // (safe areas N20, Task 3) — se acepta cualquiera de las dos formas.
      /\.toast-container\s*\{[^}]*bottom:\s*(?:80px|calc\(80px\s*\+\s*env\(safe-area-inset-bottom)/.test(cssSrc));
    check('N19 css: el pill se oculta durante el examen',
      /body\.exam-active\s+\.bmc-fab\s*\{[^}]*display:\s*none/.test(cssSrc));
    check('N19 css: las reglas del pill van antes del bloque reduced-motion',
      // Ancla a una regla real (/\.bmc-fab \{/), no a cualquier mención del
      // selector: la primera aparición literal de ".bmc-fab" en el fichero
      // es un COMENTARIO (línea ~101, muy anterior a reduced-motion), así
      // que un includes()/indexOf() sobre el texto plano pasaba siempre —
      // incluso si se borrasen todas las reglas .bmc-fab reales. Mismo
      // patrón de ancla que usa el check de cascada N21.
      // '@media (prefers-reduced-motion: reduce)' (no el genérico "...motion"
      // a secas) porque la landing (Task 3, 2026-07-25) añadió un segundo
      // media query de motion — '@media (prefers-reduced-motion: no-preference)'
      // — antes en el fichero, que un indexOf genérico encontraría primero.
      /\.bmc-fab \{/.test(cssSrc)
      && cssSrc.indexOf('.bmc-fab {') < cssSrc.indexOf('@media (prefers-reduced-motion: reduce)'));
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
    // Con prefijo #avatar-modal obligatorio: la base .avatar-grid { 1fr 1fr }
    // vive DESPUÉS del tier en el fichero y a igual especificidad ganaba la
    // cascada (regresión real cazada por el usuario el 2026-07-21: dos
    // columnas de 155px en un teléfono de 412px).
    check('N20 tier: avatar-grid a 1 columna en el tier 480, con id que gana la cascada',
      /#avatar-modal \.avatar-grid\s*\{\s*grid-template-columns:\s*1fr/.test(t480));
    check('N20 tier: stats-grid y results-stats colapsan a 1 columna',
      /\.stats-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*[;}]/.test(t480)
      && /\.results-stats\s*\{[^}]*grid-template-columns:\s*1fr\s*[;}]/.test(t480));
    check('N20 tier: filas flex envuelven (rating/results-actions/lesson-actions/exam-topbar/flashcard-stats)',
      ['.rating-btns', '.results-actions', '.lesson-actions', '.exam-topbar', '.flashcard-stats-row']
        .every(s => new RegExp(s.replace('.', '\\.') + '[^{]*\\{[^}]*flex-wrap:\\s*wrap').test(t480)));
    check('N20 tier: paddings reducidos (.view/.topbar/.exam-body)',
      // .topbar usa longhand padding-left/right con base 12px (safe areas,
      // Task 3): padding(?:-left)? acepta shorthand o longhand, 12px la base.
      // .auth-card ya no tiene override en el tier (landing, Task 3 2026-07-25).
      /\.view\s*\{[^}]*padding:\s*12px/.test(t480) && /\.topbar\s*\{[^}]*padding(?:-left)?:[^};]*12px/.test(t480)
      && /\.exam-body\s*\{[^}]*padding:/.test(t480));
    check('N20 tier: prohibido overflow-x:hidden como mitigación en body/main/views-container',
      !/(?:^|[\s,])(?:body|html|\.main|\.views-container)[^{]*\{[^}]*overflow-x:\s*hidden/m.test(cssSrc));
    /* --- Task 2: red de seguridad de texto + dvh + topbar (reglas base, fuera de media queries) --- */
    check('N20 texto: overflow-wrap en los 9 contenedores de contenido',
      ['.lesson-content', '.glossary-def', '.search-result-def', '.exam-q-text', '.exam-option',
       '.fc-question', '.fc-answer', '.review-item-q', '.activity-text']
        .every(s => new RegExp(s.replace('.', '\\.') + '[^{]*\\{[^}]*overflow-wrap:\\s*break-word').test(cssSrc)));
    check('N20 texto: .page-title trunca y los flex-items estrechables llevan min-width: 0',
      /\.page-title\s*\{[^}]*white-space:\s*nowrap/.test(cssSrc)
      && /\.page-title\s*\{[^}]*text-overflow:\s*ellipsis/.test(cssSrc)
      && ['.topbar-left', '.chapter-info', '.glossary-def', '.activity-text']
        .every(s => new RegExp(s.replace('.', '\\.') + '[^{]*\\{[^}]*min-width:\\s*0\\s*[;}]').test(cssSrc)));
    // Cada declaración vh de altura completa (100vh/88vh) debe ir seguida de su
    // gemela dvh dentro de la misma regla (patrón fallback: vh para navegadores
    // sin dvh, dvh moderna que descuenta el chrome del navegador móvil).
    const vhDecls = [...cssSrc.matchAll(/(min-height|max-height|height):\s*(100|88)vh\b/g)];
    check('N20 dvh: cada vh lleva su pareja dvh inmediata (body/sidebar/main/app-container/modal)',
      vhDecls.length >= 5 && vhDecls.every(m =>
        new RegExp(m[1] + ':\\s*' + m[2] + 'dvh').test(
          cssSrc.slice(m.index + m[0].length, m.index + m[0].length + 140))));
    check('N20 dvh: el modal de avatar usa dvh con fallback',
      /max-height:\s*88vh;[^}]{0,80}max-height:\s*88dvh/.test(cssSrc));
    /* --- Task 3: safe areas (viewport-fit=cover + env() en los fijos de borde) --- */
    const htmlSrc20 = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N20 safearea: viewport-fit=cover en el meta viewport',
      /name="viewport"[^>]*viewport-fit=cover/.test(htmlSrc20));
    check('N20 safearea: .bmc-fab y .toast-container respetan el inset inferior',
      /\.bmc-fab\s*\{[^}]*env\(safe-area-inset-bottom/.test(cssSrc)
      && /\.toast-container\s*\{[^}]*env\(safe-area-inset-bottom/.test(cssSrc));
    // Anclado con \s*\{: ".sidebar-footer {" no debe casar como ".sidebar {",
    // y el inset inferior se exige en la regla del footer (no en cualquier
    // regla posterior del fichero, que daría falso verde con .bmc-fab).
    check('N20 safearea: el sidebar reserva insets superior (.sidebar) e inferior (.sidebar-footer)',
      /\.sidebar\s*\{[^}]*env\(safe-area-inset-top/.test(cssSrc)
      && /\.sidebar-footer\s*\{[^}]*env\(safe-area-inset-bottom/.test(cssSrc));
    /* --- Task 4: drawer real (_setDrawerOpen, scrim, Escape, inert, z-index) --- */
    const appSrc20 = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    // Único punto de verdad (regla paralela a _setExamActive): fuera del cuerpo
    // de _setDrawerOpen, las únicas mutaciones de 'mobile-open' permitidas son
    // las de la barra de búsqueda móvil (I7, receptor `box.`) — el drawer del
    // sidebar solo muta dentro. El cuerpo usa acceso computado
    // classList[open ? 'add' : 'remove'], de ahí la alternativa en el regex.
    const dsStart = appSrc20.indexOf('_setDrawerOpen(open)');
    const dsEnd = dsStart >= 0 ? appSrc20.indexOf('\n  },', dsStart) : -1;
    const dsBody = dsStart >= 0 && dsEnd > dsStart ? appSrc20.slice(dsStart, dsEnd) : '';
    const outsideDs = dsStart >= 0 ? appSrc20.slice(0, dsStart) + appSrc20.slice(dsEnd) : appSrc20;
    const mobMutRe = /^.*classList(?:\[[^\]]*\]|\.(?:add|remove|toggle))\('mobile-open'\).*$/gm;
    check('N20 drawer: _setDrawerOpen existe y es el único que muta mobile-open en el sidebar',
      dsBody !== ''
      && (dsBody.match(mobMutRe) || []).length >= 1
      && (outsideDs.match(mobMutRe) || []).every(line => /\bbox\.classList\./.test(line)));
    check('N20 drawer: el scrim existe en el HTML y deja de ser CSS muerto',
      (/id="sidebarScrim"[^>]*class="sidebar-overlay"|class="sidebar-overlay"[^>]*id="sidebarScrim"/.test(htmlSrc20))
      && /sidebarScrim/.test(appSrc20));
    check('N20 drawer: scroll-lock del body y visibilidad del scrim por clase drawer-open',
      /body\.drawer-open\s*\{[^}]*overflow:\s*hidden/.test(cssSrc)
      && /body\.drawer-open\s+\.sidebar-overlay\s*\{[^}]*display:\s*block/.test(cssSrc));
    check('N20 drawer: Escape cierra el drawer (rama en el keydown delegado)',
      /Escape[\s\S]{0,400}_setDrawerOpen\(false\)/.test(appSrc20));
    check('N20 drawer: inert al cerrar en móvil (y retirada al abrir / cruzar a desktop)',
      /setAttribute\('inert'/.test(appSrc20) && /removeAttribute\('inert'/.test(appSrc20));
    // El colapso a rail de 64px es affordance de desktop; dentro del drawer
    // móvil solo confunde — el botón se oculta en el tier 768.
    const m768 = cssSrc.slice(cssSrc.indexOf('@media (max-width: 768px)'), tier480 >= 0 ? tier480 : cssSrc.length);
    check('N20 drawer: #sidebarToggle oculto en el tier móvil',
      /#sidebarToggle\s*\{[^}]*display:\s*none/.test(m768));
    check('N20 drawer: el topbar queda por encima del drawer (hamburguesa alcanzable)',
      (() => { const m = cssSrc.match(/\.topbar\s*\{[^}]*z-index:\s*(\d+)/); return !!m && Number(m[1]) > 100; })());
    check('N20 glosario: apilado en el tier 480 sin min-width fijos',
      /\.glossary-item\s*\{[^}]*flex-direction:\s*column/.test(t480)
      && /\.glossary-term\s*\{[^}]*min-width:\s*0/.test(t480)
      && /\.glossary-chapter\s*\{[^}]*white-space:\s*normal/.test(t480)
      && /\.glossary-chapter\s*\{[^}]*min-width:\s*0/.test(t480));
    check('N20 tablas: renderLesson envuelve las tablas en .table-scroll',
      /_wrapLessonTables/.test(appSrc20) && /table-scroll/.test(appSrc20));
    check('N20 tablas: la regla .table-scroll existe con overflow-x auto',
      /\.table-scroll\s*\{[^}]*overflow-x:\s*auto/.test(cssSrc));
    /* --- Task 7: flashcards — flechas sanas, altura que crece (grid-stack), columna móvil --- */
    check('N20 flashcards: .fc-arrow no se aplasta (flex-shrink: 0, todos los anchos)',
      /\.fc-arrow\s*\{[^}]*flex-shrink:\s*0/.test(cssSrc));
    check('N20 flashcards: la tarjeta usa min-height, no height fija',
      /\.flashcard\s*\{[^}]*min-height:\s*280px/.test(cssSrc)
      && !/\.flashcard\s*\{[^}]*[^-]height:\s*280px/.test(cssSrc));
    // Grid-stack del flip: el rotador real es .flashcard-inner (no .flashcard,
    // que es el contenedor de perspectiva y el que traslada el carrusel N10).
    // Las caras dejan el position:absolute (que fijaba la altura) y se apilan
    // en la misma celda; el mecanismo 3D (preserve-3d, backface-visibility,
    // rotateY de la cara trasera) debe sobrevivir intacto.
    check('N20 flashcards: caras apiladas por grid conservando el flip 3D',
      /\.flashcard-inner\s*\{[^}]*display:\s*grid/.test(cssSrc)
      && /\.flashcard-inner\s*\{[^}]*transform-style:\s*preserve-3d/.test(cssSrc)
      && /\.flashcard-front,\s*\.flashcard-back\s*\{[^}]*grid-area:\s*1\s*\/\s*1/.test(cssSrc)
      && /\.flashcard-front,\s*\.flashcard-back\s*\{[^}]*backface-visibility:\s*hidden/.test(cssSrc)
      && !/\.flashcard-front,\s*\.flashcard-back\s*\{[^}]*position:\s*absolute/.test(cssSrc)
      && /\.flashcard-back\s*\{[^}]*transform:\s*rotateY\(180deg\)/.test(cssSrc));
    // Las flechas son hijos directos de la arena flanqueando la tarjeta (sin
    // contenedor propio): flex-direction:column las apilaría en vertical una
    // por línea — el apilado real es wrap + tarjeta a ancho completo (fuerza
    // el salto de línea) + order para bajar las flechas, sin mover nodos.
    check('N20 flashcards: tarjeta a ancho completo y flechas en fila debajo en el tier 480 (wrap + order)',
      /\.flashcard-arena\s*\{[^}]*flex-wrap:\s*wrap/.test(t480)
      && /\.flashcard\s*\{[^}]*width:\s*100%/.test(t480)
      && /\.flashcard\s*\{[^}]*order:\s*1/.test(t480)
      && /\.fc-prev\s*\{[^}]*order:\s*2/.test(t480)
      && /\.fc-next\s*\{[^}]*order:\s*3/.test(t480));
    /* --- Task 8: dots del examen — tira horizontal ≤480 + auto-centrado --- */
    check('N20 dots: tira horizontal en el tier 480 (nowrap + scroll local)',
      /\.exam-question-dots\s*\{[^}]*flex-wrap:\s*nowrap/.test(t480)
      && /\.exam-question-dots\s*\{[^}]*overflow-x:\s*auto/.test(t480));
    // Tres afirmaciones en un check: (a) _centerExamDot existe (el indexOf busca
    // la DEFINICIÓN '  _centerExamDot() {' — una llamada sería 'this._…' y no
    // casa); (b) centra con scrollTo del PROPIO contenedor —no scrollIntoView,
    // que arrastraba el scroll vertical de la página en desktop (hallazgo I2
    // de la revisión final)— y condiciona behavior al matchMedia de
    // prefers-reduced-motion; (c) lo llama renderExamDots o goToQuestion —
    // renderExamDots es el punto único real: los cuatro flujos que mueven el
    // dot actual (Siguiente/Anterior, responder, click/teclado en un dot)
    // pasan por él.
    const cedStart = appSrc20.indexOf('  _centerExamDot() {');
    const cedBody = cedStart >= 0
      ? appSrc20.slice(cedStart, appSrc20.indexOf('\n  },', cedStart)) : '';
    const methodBody = (name) => {
      const s = appSrc20.indexOf(name);
      return s >= 0 ? appSrc20.slice(s, appSrc20.indexOf('\n  },', s)) : '';
    };
    check('N20 dots: _centerExamDot centra el contenedor propio (no scrollIntoView) con guard reduced-motion',
      cedBody !== ''
      && !/scrollIntoView/.test(cedBody)
      && /strip\.scrollTo\(\{/.test(cedBody)
      && /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/.test(cedBody)
      && /behavior:\s*reduced\s*\?\s*'auto'\s*:\s*'smooth'/.test(cedBody)
      && (/this\._centerExamDot\(\)/.test(methodBody('renderExamDots() {'))
          || /this\._centerExamDot\(\)/.test(methodBody('goToQuestion(i) {'))));
    /* --- Task 9: onboarding móvil — drawer, clamp real del tooltip, resize --- */
    const obSrc = fs.readFileSync(path.join(ROOT, 'js', 'onboarding.js'), 'utf8');
    // (a) Los pasos del sidebar abren el drawer en móvil y el tour lo cierra al
    // salir — siempre vía App._setDrawerOpen con el guard de existencia (regla
    // N20 drawer: nadie toca 'mobile-open' por classList fuera de app.js).
    check('N20 onboarding: abre el drawer en pasos del sidebar (móvil) y lo cierra al salir, vía _setDrawerOpen guardado',
      /App\._setDrawerOpen\(true\)/.test(obSrc)
      && /App\._setDrawerOpen\(false\)/.test(obSrc)
      && /typeof App !== 'undefined' && App\._setDrawerOpen/.test(obSrc)
      && !/classList\.(add|remove|toggle)\('mobile-open'\)/.test(obSrc));
    // (b) Sin geometría hardcodeada sin clamp: los anchos 340/300 pasan por
    // Math.min contra el viewport, y el clamp vertical usa el offsetHeight
    // real del tooltip (medido tras asignar contenido), no el 220 mágico.
    check('N20 onboarding: anchos clampados (Math.min 340/300) y alto vertical por offsetHeight real, no 220 fijo',
      !/tw = 340;/.test(obSrc) && !/tw = 300;/.test(obSrc)
      && !/innerHeight - 220/.test(obSrc)
      && /Math\.min\(340,/.test(obSrc) && /Math\.min\(300,/.test(obSrc)
      && /offsetHeight/.test(obSrc.slice(obSrc.indexOf('_positionOnTarget'))));
    // (c) Reposicionado en vivo: listeners de resize/orientationchange añadidos
    // en start() y retirados en el punto único de salida (_done) — 1/1 por
    // evento, simétricos, solo vivos durante el tour.
    check('N20 onboarding: listeners resize/orientationchange añadidos y retirados simétricamente (1/1 por evento)',
      (obSrc.match(/addEventListener\('resize'/g) || []).length === 1
      && (obSrc.match(/removeEventListener\('resize'/g) || []).length === 1
      && (obSrc.match(/addEventListener\('orientationchange'/g) || []).length === 1
      && (obSrc.match(/removeEventListener\('orientationchange'/g) || []).length === 1);
    /* --- Task 10: gate con navegador real — existe y degrada no-op --- */
    const respPath = path.join(ROOT, 'scripts', 'validate-responsive.js');
    check('N20 gate: validate-responsive.js existe y degrada no-op sin Playwright',
      fs.existsSync(respPath)
      && /SKIP: Playwright no disponible/.test(fs.readFileSync(respPath, 'utf8')));
  }

  /* ---- N20b: drawer behavioral — abrir/cerrar solo vía _setDrawerOpen ---- */
  {
    // matchMedia global simulando móvil: dentro de new Function, el `matchMedia`
    // bare de los módulos resuelve al global de Node — así la rama isMobile
    // (inert al cerrar) se ejercita de verdad. Se retira en finally para no
    // contaminar el resto de bloques.
    global.matchMedia = () => ({ matches: true, addEventListener() {} });
    try {
      const ctx = loadApp();
      ctx.App.state = ctx.App.loadState();
      const sb = ctx.document.getElementById('sidebar');
      const body = ctx.document.body;
      const menuBtn = ctx.document.getElementById('mobileMenuBtn');
      const has = typeof ctx.App._setDrawerOpen === 'function';
      if (has) ctx.App._setDrawerOpen(true);
      check('N20b drawer: abrir pone mobile-open + drawer-open + aria-expanded=true (sin inert)',
        has && sb.classList.contains('mobile-open') && body.classList.contains('drawer-open')
        && menuBtn._attrs['aria-expanded'] === 'true' && !('inert' in sb._attrs));
      if (has) ctx.App._setDrawerOpen(false);
      check('N20b drawer: cerrar lo revierte, aria-expanded=false y aplica inert (móvil)',
        has && !sb.classList.contains('mobile-open') && !body.classList.contains('drawer-open')
        && menuBtn._attrs['aria-expanded'] === 'false' && 'inert' in sb._attrs);
    } finally {
      delete global.matchMedia;
    }
  }

  /* ---- N20c: tablas de lección behavioral — _wrapLessonTables envuelve por DOM ---- */
  {
    // El innerHTML del mock es una string inerte (asignarlo no crea nodos), así
    // que la envoltura real NO es observable vía renderLesson + inspección del
    // string del contenedor — un check por string sería un check falso. En su
    // lugar: (a) se espía el cableado renderLesson → _wrapLessonTables, y (b) se
    // siembra el mock cacheado de '.lesson-content' con una <table> artesanal
    // (parentNode que graba insertBefore) y se ejercita el método de producción
    // de verdad: crea el div.table-scroll, lo inserta ante la tabla, la adopta,
    // y no re-envuelve si el padre ya es .table-scroll.
    const ctx = loadApp();
    ctx.App.state = ctx.App.loadState();
    const has = typeof ctx.App._wrapLessonTables === 'function';

    let wrapCalled = false;
    if (has) {
      const orig = ctx.App._wrapLessonTables;
      ctx.App._wrapLessonTables = function () { wrapCalled = true; return orig.apply(this); };
      ctx.App.renderLesson(0, ctx.CHAPTERS[0].topics[0].id);
      ctx.App._wrapLessonTables = orig;
    }
    check('N20c tablas: renderLesson invoca _wrapLessonTables tras inyectar la lección',
      has && wrapCalled);

    const inserted = [];
    const table = {
      tagName: 'TABLE', parentElement: null,
      parentNode: { insertBefore(w, ref) { inserted.push({ w, ref }); } },
    };
    const lc = ctx.document.querySelector('.lesson-content'); // mock cacheado en _qs…
    lc.querySelectorAll = sel => (sel === 'table' ? [table] : []); // …enriquecido aquí
    if (has) ctx.App._wrapLessonTables();
    const wrap = inserted.length === 1 ? inserted[0].w : null;
    check('N20c tablas: la tabla queda envuelta en un div.table-scroll insertado en su lugar',
      has && wrap !== null && wrap.tagName === 'DIV' && wrap.className === 'table-scroll'
      && inserted[0].ref === table && wrap._children.includes(table));

    // Idempotencia: padre ya .table-scroll (className en el mock no alimenta
    // classList, así que se simula el contains de un DOM real).
    table.parentElement = { classList: { contains: c => c === 'table-scroll' } };
    if (has) ctx.App._wrapLessonTables();
    check('N20c tablas: no re-envuelve una tabla ya envuelta (idempotente)',
      has && inserted.length === 1);
  }

  /* ---- N21: botón "siguiente lección" + FAB del café en móvil (2026-07-21) ---- */
  {
    const ctx = loadApp();
    check('N21 i18n: lesson_next y lesson_finish_chapter definidas en ES y EN',
      ['lesson_next', 'lesson_finish_chapter'].every(k =>
        typeof ctx.TRANSLATIONS.es[k] === 'string' && ctx.TRANSLATIONS.es[k].length > 0
        && typeof ctx.TRANSLATIONS.en[k] === 'string' && ctx.TRANSLATIONS.en[k].length > 0));

    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');

    // Acotado al template de renderLesson, NO a app.js entero: advanceLesson
    // llama legítimamente a navigate('curriculum') al cerrar capítulo, y un check
    // global lo confundiría con el botón duplicado que se eliminó.
    const actionsBlock = (appSrc.match(/<div class="lesson-actions">[\s\S]*?<\/div>`/) || [''])[0];
    check('N21 lección: la barra inferior ya no duplica el "Volver al curriculum"',
      actionsBlock.length > 0 && !/App\.navigate\('curriculum'\)/.test(actionsBlock));
    check('N21 lección: la barra inferior cablea el primario a App.advanceLesson',
      /App\.advanceLesson\(/.test(actionsBlock));
    check('N21 lección: el primario emite locked/aria-disabled cuando la lección no está completada',
      /lesson-next-btn \$\{isCompleted \? '' : 'locked'\}/.test(appSrc)
      && /\$\{isCompleted \? '' : 'aria-disabled="true"'\}/.test(appSrc)
      && /id="nextLessonBtn"/.test(appSrc));
    check('N21 lección: advanceLesson NO completa — guard + toast warning + return, sin completeLesson',
      /advanceLesson\(topicId, chapterId, nextTopicId\)\s*\{[\s\S]{0,200}completedLessons\.includes\(topicId\)[\s\S]{0,160}showToast\(i18n\.t\('lesson_next_locked_toast'\), 'warning'\)[\s\S]{0,60}return;/.test(appSrc)
      && !/advanceLesson\(topicId, chapterId, nextTopicId\)\s*\{[\s\S]{0,700}this\.completeLesson\(/.test(appSrc)
      && /advanceLesson[\s\S]{0,700}this\.navigateToLesson\(chapterId, nextTopicId\)/.test(appSrc)
      && /advanceLesson[\s\S]{0,700}this\.navigate\('curriculum'\)/.test(appSrc));
    check('N21 lección: completeLesson desbloquea #nextLessonBtn in place',
      /completeLesson\(topicId, chapterId, xp\)\s*\{[\s\S]{0,900}getElementById\('nextLessonBtn'\)[\s\S]{0,220}classList\.remove\('locked'\)[\s\S]{0,140}removeAttribute\('aria-disabled'\)/.test(appSrc));
    check('N21 i18n: lesson_next_locked_toast definida en ES y EN',
      typeof ctx.TRANSLATIONS.es.lesson_next_locked_toast === 'string' && ctx.TRANSLATIONS.es.lesson_next_locked_toast.length > 0
      && typeof ctx.TRANSLATIONS.en.lesson_next_locked_toast === 'string' && ctx.TRANSLATIONS.en.lesson_next_locked_toast.length > 0);

    // Comportamental (no grep): monkeypatch de navegación/toast sobre el App
    // cargado y llamada real a advanceLesson en ambos estados.
    {
      const ctx2 = loadApp();
      ctx2.App.state = ctx2.App.loadState();
      ctx2.App.state.completedLessons = [];
      let navigated = false, toasted = false;
      ctx2.App.navigateToLesson = () => { navigated = true; };
      ctx2.App.showToast = () => { toasted = true; };
      ctx2.App.advanceLesson('1.1', 0, '1.2');
      check('N21 comportamiento: sin completar, avanzar no navega y muestra el aviso',
        !navigated && toasted);
      ctx2.App.state.completedLessons = ['1.1'];
      ctx2.App.advanceLesson('1.1', 0, '1.2');
      check('N21 comportamiento: con la lección completada, avanzar navega', navigated);
    }

    /* --- Task 3: estilo del botón primario --- */
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    check('N21 css: .lesson-next-btn usa --primary-dark (AA: blanco sobre él 5.83:1; sobre --primary sería 4.32:1)',
      /\.lesson-next-btn\s*\{[^}]*background:\s*var\(--primary-dark\)/.test(cssSrc)
      && /\.lesson-next-btn\s*\{[^}]*color:\s*#fff/.test(cssSrc));
    check('N21 css: estado locked — atenuado, not-allowed, SIN pointer-events none (mataría el toast)',
      /\.lesson-next-btn\.locked\s*\{[^}]*opacity:\s*0?\.\d+/.test(cssSrc)
      && /\.lesson-next-btn\.locked\s*\{[^}]*cursor:\s*not-allowed/.test(cssSrc)
      && !/\.lesson-next-btn\.locked\s*\{[^}]*pointer-events:\s*none/.test(cssSrc));
    check('N21 css: el título del siguiente tema se oculta en el tier 480',
      /@media \(max-width: 480px\)[\s\S]*?\.next-topic-title\s*\{[^}]*display:\s*none/.test(cssSrc));
    check('N21 css: las reglas nuevas van antes del bloque reduced-motion',
      // '...motion: reduce)' específico, no el genérico "...motion" a secas: la
      // landing (Task 3, 2026-07-25) añadió antes en el fichero un segundo media
      // query de motion — '@media (prefers-reduced-motion: no-preference)' —
      // que un indexOf genérico encontraría primero (mismo ajuste que N19/N21-fab).
      cssSrc.includes('.lesson-next-btn')
      && cssSrc.indexOf('.lesson-next-btn') < cssSrc.indexOf('@media (prefers-reduced-motion: reduce)'));

    /* --- Task 4: FAB del café solo-icono en móvil + colchón --- */
    // El tier 768 se aísla por su cierre a columna 0: las reglas anidadas
    // cierran con "\n  }" (indentado) y no matchean "\n}".
    // Hallazgo revisión final (2026-07-21): el override de .bmc-fab vivía
    // dentro de ESTE primer bloque 768, con la misma especificidad (0,1,0)
    // que la regla base .bmc-fab (~800 líneas después) — como los media
    // queries no aportan especificidad, ganaba el orden de aparición y la
    // base (más tardía) lo machacaba en silencio. El fix lo mueve a un
    // SEGUNDO bloque "@media (max-width: 768px)" propio, situado DESPUÉS de
    // la base .bmc-fab (para ganar la cascada de verdad) y ANTES de
    // reduced-motion. Por eso este check ya no puede mirar solo el primer
    // bloque 768 — recoge TODOS los bloques 768 del fichero.
    const tier768Blocks = cssSrc.match(/@media \(max-width: 768px\) \{[\s\S]*?\n\}/g) || [];
    const tier768 = tier768Blocks.join('\n');
    check('N21 css: en ≤768px el pill del café se reduce a círculo de 48px solo-icono',
      /\.bmc-fab\s*\{[^}]*width:\s*48px/.test(tier768)
      && /\.bmc-fab\s*\{[^}]*height:\s*48px/.test(tier768)
      && /\.bmc-fab\s*\{[^}]*border-radius:\s*50%/.test(tier768)
      && /\.bmc-fab span\s*\{[^}]*display:\s*none/.test(tier768));
    check('N21 css: .lesson-actions gana colchón inferior en ≤768px (safe-area incluida)',
      /\.lesson-actions\s*\{[^}]*padding-bottom:\s*calc\(72px\s*\+\s*env\(safe-area-inset-bottom/.test(tier768));
    // Prueba directa de la cascada (no solo de que el texto exista, que es
    // justo lo que el N21 original no distinguía): el override 48px/50% debe
    // aparecer DESPUÉS de la base .bmc-fab { ... } y ANTES de reduced-motion,
    // para que su orden de aparición gane de verdad.
    const idxBaseFabMatch = /\.bmc-fab \{\r?\n\s*position: fixed;/.exec(cssSrc);
    const idxBaseFab = idxBaseFabMatch ? idxBaseFabMatch.index : -1;
    const idxOverrideFab = cssSrc.indexOf('.bmc-fab { padding: 0; width: 48px;');
    // '...motion: reduce)' específico, no el genérico "...motion" a secas: la
    // landing (Task 3, 2026-07-25) añadió antes en el fichero un segundo media
    // query de motion — '@media (prefers-reduced-motion: no-preference)' —
    // que un indexOf genérico encontraría primero (mismo ajuste que N19).
    const idxReducedMotion = cssSrc.indexOf('@media (prefers-reduced-motion: reduce)');
    check('N21 css: el override móvil de .bmc-fab va DESPUÉS de la base y ANTES de reduced-motion (gana la cascada)',
      idxBaseFab >= 0 && idxOverrideFab > idxBaseFab && idxOverrideFab < idxReducedMotion);

    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N21 a11y: el <a> del café lleva data-i18n-aria (al ocultar el span perdería su nombre accesible)',
      /<a class="bmc-fab"[^>]*data-i18n-aria="bmc_label"/.test(htmlSrc));
  }

  /* ---- N22: el estado vacío de un arranque limpio no pisa la nube (2026-07-22) ----
     Bug: al re-loguearse tras "Clear site data", init() sella un estado vacío con
     _updatedAt fresco ANTES de reconciliar; loadState lo veía "más nuevo" que la nube
     y lo subía encima del progreso real. Fix: (1) loadState acepta un override de
     localTs (el snapshot pre-init, 0 en arranque limpio); (2) gate _reconciled que
     difiere el push a la nube hasta terminar la reconciliación. */
  {
    // (1) Repro: local vacío sellado fresco + nube con progreso real. Con override
    // ts=0 (arranque limpio) la nube debe ganar y el vacío NO debe subirse.
    const ls = makeLocalStorage();
    ls.setItem('mycampus_istqb_v1_u1', JSON.stringify({ xp: 0, completedLessons: [], _updatedAt: 9999 }));
    const sb = makeSupabaseMock({ singleResult: { data: { data: { xp: 750, _updatedAt: 1000 } }, error: null } });
    const ctx = loadApp({ supabase: sb, localStorage: ls });
    const res = await ctx.Sync.loadState('u1', 0);
    check('N22 sync: con override ts=0 la nube gana pese al vacío recién sellado', !!res && res.xp === 750);
    check('N22 sync: el estado vacío NO se sube por encima de la nube',
      !sb._calls.upserts.some(u => u.data && u.data.xp === 0));
    check('N22 sync: la caché localStorage se corrige con la copia de la nube',
      JSON.parse(ls.getItem('mycampus_istqb_v1_u1')).xp === 750);
  }
  {
    // (3) Multi-dispositivo con el nuevo parámetro: local genuinamente más nuevo
    // (su override refleja progreso real) sigue ganando y re-subiéndose.
    const ls = makeLocalStorage();
    ls.setItem('mycampus_istqb_v1_u1', JSON.stringify({ xp: 500, _updatedAt: 2000 }));
    const sb = makeSupabaseMock({ singleResult: { data: { data: { xp: 100, _updatedAt: 1000 } }, error: null } });
    const ctx = loadApp({ supabase: sb, localStorage: ls });
    const res = await ctx.Sync.loadState('u1', 2000);
    check('N22 sync: con override, local realmente más nuevo sigue ganando (multi-dispositivo)',
      !!res && res.xp === 500 && sb._calls.upserts.some(u => u.data && u.data.xp === 500));
  }
  {
    // (2) Gate de push: con _reconciled=false, saveState persiste en localStorage
    // pero NO deja push pendiente ni empuja keepalive al ocultar la pestaña.
    const ctx = loadApp();
    ctx.window.CAMPUS_USER_ID = 'u1';
    ctx.Sync._reconciled = false;
    ctx.Sync._saveTimer = null;
    ctx.Sync.saveState('u1', { xp: 10 });
    check('N22 gate: con _reconciled=false, saveState no deja push pendiente', ctx.Sync._saveTimer == null);
    check('N22 gate: con _reconciled=false, saveState sí persiste en localStorage',
      JSON.parse(ctx.localStorage.getItem('mycampus_istqb_v1_u1')).xp === 10);
    ctx.App.state = { xp: 10 };
    ctx.document.visibilityState = 'hidden';
    (ctx.document._listeners['visibilitychange'] || []).forEach(fn => fn());
    await new Promise(r => setTimeout(r, 20));
    check('N22 gate: con _reconciled=false, ocultar la pestaña no empuja keepalive',
      ctx.calls.fetches.length === 0);
    // Reconciliado: sí vuelve a programar push.
    ctx.Sync._reconciled = true;
    ctx.Sync.saveState('u1', { xp: 20 });
    check('N22 gate: con _reconciled=true, saveState vuelve a programar push', ctx.Sync._saveTimer != null);
    clearTimeout(ctx.Sync._saveTimer);
  }
  {
    // Decisión de aplicar la nube tras reconciliar (Auth._shouldApplyCloud). Puro:
    // cubre la ruta .then/finally de _onAuthSuccess que el arnés no puede correr
    // entera (App.init necesita un DOM real). El bug del guard viejo estaba aquí:
    // el sello fresco que init estampa sobre el vacío hacía la nube "más vieja".
    const ctx = loadApp();
    const cloud = { xp: 750, _updatedAt: 1000 };
    // Arranque limpio: sin base local (preInitTs 0), init selló el vacío fresco
    // (appStateTs 5000 = postInitTs 5000). El guard viejo NO aplicaba la nube; el
    // nuevo sí, porque no había base local.
    check('N22 apply: arranque sin base local → se aplica la nube (aunque init selló el vacío)',
      ctx.Auth._shouldApplyCloud(cloud, false, 5000, 5000) === true);
    // Con base local real y sin cambio in-window (appStateTs === postInitTs): aplicar.
    check('N22 apply: base local real sin cambio in-window → se aplica la copia ganadora',
      ctx.Auth._shouldApplyCloud(cloud, true, 5000, 5000) === true);
    // Con base local real y cambio in-window genuino (appStateTs > postInitTs): conservar local.
    check('N22 apply: base local real con cambio in-window → se conserva el estado local',
      ctx.Auth._shouldApplyCloud(cloud, true, 6000, 5000) === false);
    // Usuario nuevo sin fila en la nube: conservar local.
    check('N22 apply: sin copia en la nube (usuario nuevo) → se conserva el estado local',
      ctx.Auth._shouldApplyCloud(null, false, 5000, 5000) === false);
  }
  {
    // (4) Estáticos: la firma y el cableado del fix están presentes.
    const syncSrc = fs.readFileSync(path.join(ROOT, 'js', 'sync.js'), 'utf8');
    const authSrc = fs.readFileSync(path.join(ROOT, 'js', 'auth.js'), 'utf8');
    check('N22 estático: loadState acepta el override de localTs',
      /loadState\(\s*userId\s*,\s*\w+/.test(syncSrc));
    check('N22 estático: saveState respeta el gate _reconciled',
      /_reconciled/.test(syncSrc) && /if\s*\(\s*!\s*this\._reconciled\s*\)/.test(syncSrc));
    check('N22 estático: auth pasa el ts pre-init, usa _shouldApplyCloud y maneja _reconciled',
      /Sync\.loadState\(\s*user\.id\s*,/.test(authSrc)
      && /_shouldApplyCloud\(/.test(authSrc)
      && /Sync\._reconciled\s*=\s*false/.test(authSrc)
      && /Sync\._reconciled\s*=\s*true/.test(authSrc));
  }

  /* ---- N23: celebración de módulo completado + diploma de campus (2026-07-25) ---- */
  {
    const ctx = loadApp();
    const keys = ['celebr_badge', 'celebr_title', 'celebr_subtitle',
      'celebr_quote_0', 'celebr_quote_1', 'celebr_quote_2',
      'celebr_quote_3', 'celebr_quote_4', 'celebr_quote_5',
      'celebr_cta_next', 'celebr_cta_curriculum', 'celebr_cta_stay',
      'diploma_eyebrow', 'diploma_title', 'diploma_awarded_to',
      'diploma_body', 'diploma_cta', 'diploma_close'];
    check('N23 i18n: las 18 claves de celebración definidas y no vacías en ES y EN',
      keys.every(k => typeof ctx.TRANSLATIONS.es[k] === 'string' && ctx.TRANSLATIONS.es[k].length > 0
        && typeof ctx.TRANSLATIONS.en[k] === 'string' && ctx.TRANSLATIONS.en[k].length > 0));
  }

  /* --- Task 2: markup + CSS --- */
  {
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('N23 markup: #celebration-modal es role=dialog aria-modal etiquetado por celebrationTitle',
      /<div id="celebration-modal"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="celebrationTitle"/.test(htmlSrc));
    check('N23 markup: la capa de confetti es decorativa (aria-hidden)',
      /<div id="celebrConfetti"[^>]*aria-hidden="true"/.test(htmlSrc));

    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    // Ancla a la regla real (/\.selector \{/), nunca includes() — lección N19/N21.
    const idxCelebrCard = cssSrc.search(/\.celebration-card \{/);
    check('N23 css: .celebration-card existe y va antes del bloque reduced-motion',
      // '...motion: reduce)' específico — ver nota N19/N21 (la landing, Task 3
      // 2026-07-25, añadió antes un segundo media query de motion "no-preference"
      // que un indexOf genérico encontraría primero).
      idxCelebrCard >= 0 && idxCelebrCard < cssSrc.indexOf('@media (prefers-reduced-motion: reduce)'));
    check('N23 css: el CTA usa --primary-dark con texto blanco (AA 5.83:1; --primary fallaría)',
      /\.celebr-cta\s*\{[^}]*background:\s*var\(--primary-dark\)/.test(cssSrc)
      && /\.celebr-cta\s*\{[^}]*color:\s*#fff/.test(cssSrc));
    check('N23 css: los toasts quedan por encima del modal (z-index 6000 > 5000)',
      /\.toast-container\s*\{[^}]*z-index:\s*6000/.test(cssSrc));
    check('N23 css: el override móvil lleva prefijo #celebration-modal (id gana la cascada; el tier va antes que la base)',
      /@media \(max-width: 480px\)[\s\S]*?#celebration-modal \.celebration-card\s*\{/.test(cssSrc));
    check('N23 css: los chips usan el par success validado (fondo tintado + --success-text)',
      /\.celebr-chip\s*\{[^}]*background:\s*rgba\(76,\s*175,\s*80,\s*0?\.12\)/.test(cssSrc)
      && /\.celebr-chip\s*\{[^}]*color:\s*var\(--success-text\)/.test(cssSrc));

    /* --- Task 3: JS del modal --- */
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N23 xss: el nombre del diploma pasa por escapeHtml (dato controlable por el usuario)',
      /escapeHtml\(this\._getDisplayName\(\)\)/.test(appSrc));
    check('N23 motion: el confetti no se genera bajo prefers-reduced-motion (guard matchMedia, patrón _slideFlashcard)',
      /_spawnConfetti\(\)\s*\{[\s\S]{0,400}?matchMedia\('\(prefers-reduced-motion: reduce\)'\)/.test(appSrc));
    check('N23 a11y: Escape y clic en el scrim cierran el modal de celebración',
      /getElementById\('celebration-modal'\)[\s\S]{0,400}?Escape[\s\S]{0,200}?_closeCelebration/.test(appSrc)
      && /e\.target === celebrModal[\s\S]{0,100}?_closeCelebration/.test(appSrc));
    check('N23 a11y: el drawer ignora Escape nacido dentro del modal de celebración',
      /t\.closest\('#celebration-modal'\)/.test(appSrc));
    check('N23 sidebar: updateSidebar usa el helper _getDisplayName (sin IIFE duplicada)',
      /const displayName = this\._getDisplayName\(\)/.test(appSrc));
  }

  /* --- Task 4: disparo en completeLesson --- */
  const quiet = (c) => {
    c.App.updateSidebar = () => {};
    c.App.showXPPopup = () => {};
    c.App.showToast = () => {};
    c.App.checkAchievements = () => {};
  };
  {
    const ctx2 = loadApp();
    quiet(ctx2);
    ctx2.App.state = ctx2.App.loadState();
    const ch0 = ctx2.CHAPTERS[0].topics.map(t => t.id);
    ctx2.App.state.completedLessons = ch0.slice(0, -1);
    const shown = [];
    ctx2.App._showCelebration = (kind, chId) => shown.push([kind, chId]);
    ctx2.App.completeLesson(ch0[ch0.length - 1], 0, 10);
    check('N23 trigger: cerrar un capítulo dispara la card una vez',
      shown.length === 1 && shown[0][0] === 'chapter' && shown[0][1] === 0);
    check('N23 trigger: el capítulo queda marcado en celebratedChapters',
      Array.isArray(ctx2.App.state.celebratedChapters) && ctx2.App.state.celebratedChapters.includes(0));
    ctx2.App.completeLesson(ch0[ch0.length - 1], 0, 10);
    check('N23 trigger: repetir la lección ya completada no re-dispara', shown.length === 1);
    ctx2.App._maybeCelebrate(0); // llamada directa: capítulo completo Y ya celebrado
    check('N23 trigger: _maybeCelebrate con capítulo ya celebrado no re-dispara (dedup propio)', shown.length === 1);
    const ch1 = ctx2.CHAPTERS[1].topics.map(t => t.id);
    ctx2.App.completeLesson(ch1[0], 1, 10);
    check('N23 trigger: completar sin cerrar capítulo no celebra', shown.length === 1);
  }
  {
    // Diploma: todo el campus completo salvo la última lección del cap. 5.
    const ctx2 = loadApp();
    quiet(ctx2);
    ctx2.App.state = ctx2.App.loadState();
    const all = ctx2.CHAPTERS.flatMap(ch => ch.topics.map(t => t.id));
    const last = all[all.length - 1];
    ctx2.App.state.completedLessons = all.filter(id => id !== last);
    const shown = [];
    ctx2.App._showCelebration = (kind) => shown.push(kind);
    ctx2.App.completeLesson(last, 5, 10);
    check('N23 diploma: cerrar el campus muestra SOLO el diploma (sustituye a la card)',
      shown.length === 1 && shown[0] === 'diploma');
    check('N23 diploma: diplomaShown queda persistido', ctx2.App.state.diplomaShown === true);
    check('N23 diploma: el capítulo que cierra también queda en celebratedChapters (no habrá card después)',
      ctx2.App.state.celebratedChapters.includes(5));
  }
  {
    // Migración: estado guardado antes de esta feature (sin los campos nuevos).
    const ctx2 = loadApp();
    quiet(ctx2);
    ctx2.App.state = ctx2.App.loadState();
    delete ctx2.App.state.celebratedChapters;
    delete ctx2.App.state.diplomaShown;
    const ch0 = ctx2.CHAPTERS[0].topics.map(t => t.id);
    ctx2.App.state.completedLessons = ch0.slice(0, -1);
    const shown = [];
    ctx2.App._showCelebration = (kind) => shown.push(kind);
    let threw = false;
    try { ctx2.App.completeLesson(ch0[ch0.length - 1], 0, 10); } catch (e) { threw = true; }
    check('N23 migración: un estado legado sin los campos nuevos no revienta y celebra',
      !threw && shown.length === 1);
  }

  /* ---- N24: landing pública (2026-07-25) ---- */
  {
    const i18nSrc = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');
    // restore(): rama de primera visita con navigator.language, antes de setLang
    // (setLang no existe en restore() hoy, pero el ancla mantiene el chequeo
    // robusto si restore() creciera más adelante).
    const restoreBody = i18nSrc.slice(i18nSrc.indexOf('restore()'));
    const beforeApply = restoreBody.slice(0, restoreBody.indexOf('apply()'));
    check('N24 i18n: restore() respeta navigator.language en primera visita',
      i18nSrc.indexOf('restore()') !== -1 && /navigator/.test(beforeApply));
    // Claves lp_* + auth_password_placeholder definidas en TRANSLATIONS
    // (la paridad ES/EN la cubre el check global "i18n: paridad ES/EN" más abajo).
    for (const k of ['lp_signin_link', 'lp_badge', 'lp_h1', 'lp_lede', 'lp_why_heading',
      'lp_why1_title', 'lp_why1_body', 'lp_why2_title', 'lp_why2_body', 'lp_why3_title', 'lp_why3_body',
      'lp_roadmap_title', 'lp_roadmap_intro', 'lp_included_label',
      'lp_included_1', 'lp_included_2', 'lp_included_3', 'lp_included_4',
      'lp_ch1_title', 'lp_ch1_body', 'lp_ch2_title', 'lp_ch2_body', 'lp_ch3_title', 'lp_ch3_body',
      'lp_ch4_title', 'lp_ch4_body', 'lp_ch5_title', 'lp_ch5_body', 'lp_ch6_title', 'lp_ch6_body',
      'lp_cta_title', 'lp_cta_body', 'lp_cta_btn', 'lp_footer', 'auth_password_placeholder']) {
      check(`N24 i18n: clave ${k} definida`, new RegExp(`\\b${k}:`).test(i18nSrc));
    }

    // Behavioral: loadApp() acepta un navigator mockeado (ver cambio en loadApp
    // arriba) — mismo sandbox que usan los checks N1/N22, sin reinventar carga.
    {
      const ctx = loadApp({ navigator: { language: 'en-US' } });
      ctx.i18n.restore();
      check('N24 i18n: restore() con navigator.language="en-US" y sin preferencia guardada arranca en EN',
        ctx.i18n.lang === 'en');
    }
    {
      const ls = makeLocalStorage();
      ls.setItem('mycampus_lang', 'es');
      const ctx = loadApp({ navigator: { language: 'en-US' }, localStorage: ls });
      ctx.i18n.restore();
      check('N24 i18n: la preferencia guardada (es) manda sobre navigator.language',
        ctx.i18n.lang === 'es');
    }
    {
      const ctx = loadApp({ navigator: {} });
      ctx.i18n.restore();
      check('N24 i18n: sin navigator.language (o navigator ausente) cae a "es" por defecto',
        ctx.i18n.lang === 'es');
    }

    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const iReg = htmlSrc.indexOf('id="tabRegister"');
    const iLog = htmlSrc.indexOf('id="tabLogin"');
    check('N24 markup: tarjeta de acceso con id="acceso"', htmlSrc.includes('id="acceso"'));
    check('N24 markup: tabs en orden Registrarse -> Iniciar sesión', iReg !== -1 && iLog !== -1 && iReg < iLog);
    check('N24 markup: labels del form ocultos con sr-only',
      /class="sr-only" data-i18n="auth_email_label"/.test(htmlSrc)
      && /class="sr-only" data-i18n="auth_password_label"/.test(htmlSrc)
      && /class="sr-only" data-i18n="auth_name_label"/.test(htmlSrc));
    check('N24 markup: link de login del header presente', htmlSrc.includes('id="lpSigninLink"'));
    check('N24 markup: CTA final presente', htmlSrc.includes('id="lpCtaBtn"'));
    check('N24 markup: placeholder de contraseña via i18n',
      htmlSrc.includes('data-i18n-placeholder="auth_password_placeholder"'));
    check('N24 markup: fuentes Space Grotesk y Manrope en <head>',
      /Space\+Grotesk/.test(htmlSrc) && /Manrope/.test(htmlSrc));
    const lpBlock = htmlSrc.slice(htmlSrc.indexOf('id="auth-screen"'), htmlSrc.indexOf('id="app-container"'));
    check('N24 markup: un solo <h1> en la landing', (lpBlock.match(/<h1/g) || []).length === 1);
    check('N24 markup: authForgot arranca oculto (modo registro por defecto)',
      /id="authForgot"[^>]*style="display:none"/.test(htmlSrc) || /style="display:none"[^>]*id="authForgot"/.test(htmlSrc));

    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    check('N24 css: tokens --lp-* scoped a #auth-screen (dark-only)',
      /#auth-screen \{[^}]*--lp-bg: ?#0B0B12/i.test(cssSrc) && /--lp-accent: ?#6C4EF6/i.test(cssSrc));
    check('N24 css: #auth-screen ya no es position:fixed (landing scrolleable)',
      !/#auth-screen \{[^}]*position: ?fixed/.test(cssSrc));
    for (const sel of ['.lp-header \\{', '.lp-hero \\{', '.lp-why \\{', '.lp-timeline \\{', '.lp-cta-btn \\{', '.lp-footer \\{', '.sr-only \\{']) {
      check(`N24 css: regla real ${sel.replace(' \\{', '')}`, new RegExp(sel).test(cssSrc));
    }
    check('N24 css: scroll suave con guard de reduced-motion',
      /@media \(prefers-reduced-motion: no-preference\) \{\s*html \{ scroll-behavior: smooth; \}/.test(cssSrc));
    check('N24 css: la landing va antes del tail (reduced-motion sigue detrás)',
      cssSrc.indexOf('.lp-hero {') !== -1
      && cssSrc.indexOf('.lp-hero {') < cssSrc.indexOf('@media (prefers-reduced-motion: reduce)'));
    check('N24 css: paso activo del timeline', /\.lp-step:first-child \.lp-step-num \{/.test(cssSrc));

    /* ---- N24-auth: landing pública — auth.js (registro por defecto, CTAs, aria-pressed) ---- */
    const authSrc = fs.readFileSync(path.join(ROOT, 'js', 'auth.js'), 'utf8');
    check('N24 auth: _showAuthScreen muestra con display block (landing scrolleable)',
      /_showAuthScreen\(\) \{[^}]*'block'/.test(authSrc)
      && !/_showAuthScreen\(\) \{[^}]*'flex'/.test(authSrc));
    check('N24 auth: modo por defecto register', /_mode: 'register'/.test(authSrc));
    check('N24 auth: CTAs de la landing cableados (_goToAuthCard + lpSigninLink + lpCtaBtn)',
      /_goToAuthCard/.test(authSrc) && /lpSigninLink/.test(authSrc) && /lpCtaBtn/.test(authSrc));
    check('N24 auth: scrollIntoView y focus con typeof-guard (DOM mockeado)',
      /typeof card\.scrollIntoView === 'function'/.test(authSrc)
      && /typeof email\.focus === 'function'/.test(authSrc));
    check('N24 auth: aria-pressed sincronizado en el switcher',
      /aria-pressed/.test(authSrc));
    check('N24 auth: authSubmit se retraduce en init (gap preexistente)',
      /init\(\)[\s\S]{0,900}authSubmit/.test(authSrc));

    // Behavioral: mismo patrón de carga que N7 (loadApp con supabase mock por defecto).
    {
      const ctx = loadApp();
      ctx.Auth._switchMode('login');
      check('N24 auth behavioral: _switchMode(login) activa tabLogin y oculta fieldName',
        ctx.document.getElementById('tabLogin').classList.contains('active')
        && ctx.document.getElementById('fieldName').style.display === 'none');
      ctx.Auth._switchMode('register');
      check('N24 auth behavioral: _switchMode(register) activa tabRegister y muestra fieldName',
        ctx.document.getElementById('tabRegister').classList.contains('active')
        && ctx.document.getElementById('fieldName').style.display === 'flex');
    }
    // Behavioral: init() retraduce authSubmit y sincroniza aria-pressed según i18n.lang.
    // supabase: null (mismo patrón que N7) para tomar la rama _showLoadFailure y no
    // depender de un session.user simulado que este arnés no modela.
    {
      const ls = makeLocalStorage();
      ls.setItem('mycampus_lang', 'en');
      const ctx = loadApp({ localStorage: ls, supabase: null });
      await ctx.Auth.init();
      check('N24 auth behavioral: init() retraduce authSubmit al idioma restaurado',
        ctx.document.getElementById('authSubmit').textContent === ctx.i18n.t('auth_submit_register'));
      check('N24 auth behavioral: init() sincroniza aria-pressed en authBtnES/EN',
        ctx.document.getElementById('authBtnES').getAttribute('aria-pressed') === 'false'
        && ctx.document.getElementById('authBtnEN').getAttribute('aria-pressed') === 'true');
    }
    // Behavioral: los CTAs de la landing cambian de modo, hacen scroll y enfocan el email.
    // El mock de document NO implementa scrollIntoView (motivo real del typeof-guard en
    // auth.js) — el primer click confirma que _goToAuthCard no revienta sin él; luego se
    // añade uno ad-hoc para confirmar que SÍ se invoca cuando el DOM real lo soporta.
    {
      const ctx = loadApp();
      ctx.Auth._bindEvents();
      const signin = ctx.document.getElementById('lpSigninLink');
      let threw = false;
      try { fireEl(signin, 'click', { preventDefault() {} }); } catch (e) { threw = true; }
      check('N24 auth behavioral: lpSigninLink no revienta sin scrollIntoView en el mock (guard) y cambia a login',
        !threw && ctx.document.getElementById('tabLogin').classList.contains('active'));

      let scrolled = false, focused = false;
      const card = ctx.document.getElementById('acceso');
      card.scrollIntoView = () => { scrolled = true; };
      const email = ctx.document.getElementById('authEmail');
      email.focus = () => { focused = true; };
      const cta = ctx.document.getElementById('lpCtaBtn');
      fireEl(cta, 'click', { preventDefault() {} });
      check('N24 auth behavioral: lpCtaBtn cambia a register, hace scroll y enfoca email cuando el mock los soporta',
        ctx.document.getElementById('tabRegister').classList.contains('active') && scrolled && focused);
    }
    // Behavioral: _setAuthLang sincroniza aria-pressed al cambiar idioma en runtime.
    {
      const ctx = loadApp();
      ctx.Auth._setAuthLang('en');
      check('N24 auth behavioral: _setAuthLang(en) pone aria-pressed=true en authBtnEN y false en authBtnES',
        ctx.document.getElementById('authBtnEN').getAttribute('aria-pressed') === 'true'
        && ctx.document.getElementById('authBtnES').getAttribute('aria-pressed') === 'false');
      ctx.Auth._setAuthLang('es');
      check('N24 auth behavioral: _setAuthLang(es) pone aria-pressed=true en authBtnES y false en authBtnEN',
        ctx.document.getElementById('authBtnES').getAttribute('aria-pressed') === 'true'
        && ctx.document.getElementById('authBtnEN').getAttribute('aria-pressed') === 'false');
    }
  }

  /* ---- N25: login siempre al dashboard (2026-07-26) ---- */
  {
    const authSrc = fs.readFileSync(path.join(ROOT, 'js', 'auth.js'), 'utf8');
    check('N25 auth: helper _clearSavedView definido con try/catch',
      /_clearSavedView\(\) \{/.test(authSrc)
      && /_clearSavedView\(\) \{[^}]*try[^}]*mycampus_current_view/.test(authSrc));
    const signedOutBranch = authSrc.slice(authSrc.indexOf("'SIGNED_OUT'"), authSrc.indexOf('getSession'));
    check('N25 auth: SIGNED_OUT limpia la vista guardada',
      authSrc.indexOf("'SIGNED_OUT'") !== -1 && /_clearSavedView\(\)/.test(signedOutBranch));
    const showAuthBody = authSrc.slice(authSrc.indexOf('_showAuthScreen() {'), authSrc.indexOf('_hideAuthScreen'));
    check('N25 auth: _showAuthScreen NO limpia (ruta de fallo de CDN)',
      authSrc.indexOf('_showAuthScreen() {') !== -1 && !/_clearSavedView/.test(showAuthBody));

    // La rama "if (session)" de init() y todo _onAuthSuccess (recarga CON sesión
    // activa) no deben limpiar la vista guardada — View Persistence sigue vivo
    // para F5 a mitad de lección. Estático: complementa los behaviorales de abajo.
    const getSessionIdx = authSrc.indexOf('getSession()');
    const elseIdx = authSrc.indexOf('} else {', getSessionIdx);
    const ifSessionBranch = authSrc.slice(getSessionIdx, elseIdx);
    check('N25 auth: la rama "if (session)" de init() no limpia la vista guardada',
      getSessionIdx !== -1 && elseIdx !== -1 && !/_clearSavedView/.test(ifSessionBranch));
    // Ancla al final al literal de la DEFINICIÓN de _shouldApplyCloud (con su
    // segundo parámetro, "hadLocalBase"), no al call site dentro de
    // _onAuthSuccess ("this._shouldApplyCloud(cloudState, preInitLocalTs > 0,"
    // ~línea 203) — ese call site aparece ANTES y corta el slice ~34 líneas
    // pronto, perdiendo el resto del .then/.catch/.finally de la rama
    // `if (!App._initialized)` y TODA la rama `else` (código real hallado en
    // code review: con el ancla vieja, reintroducir `_clearSavedView()` en esa
    // reconciliación no lo detectaba el gate).
    const onAuthSuccessDefIdx = authSrc.indexOf('async _onAuthSuccess(user) {');
    const shouldApplyCloudDefIdx = authSrc.indexOf('_shouldApplyCloud(cloudState, hadLocalBase');
    const onAuthSuccessBody = authSrc.slice(onAuthSuccessDefIdx, shouldApplyCloudDefIdx);
    check('N25 auth: _onAuthSuccess no limpia la vista guardada',
      onAuthSuccessDefIdx !== -1 && shouldApplyCloudDefIdx !== -1 && !/_clearSavedView/.test(onAuthSuccessBody));

    // Behaviorales — reutilizan el mecanismo de N7/N9: Auth.init() con supabase
    // y localStorage mockeados; sb._calls.authStateCb dispara los eventos de auth.
    {
      // (2) Boot sin sesión elimina la clave.
      const ls = makeLocalStorage();
      ls.setItem('mycampus_current_view', JSON.stringify({ view: 'simulator' }));
      const sb = makeSupabaseMock({ session: null });
      const ctx = loadApp({ supabase: sb, localStorage: ls });
      await ctx.Auth.init();
      check('N25 behavioral: boot sin sesión elimina mycampus_current_view',
        ctx.localStorage.getItem('mycampus_current_view') === null);
    }
    {
      // (1) SIGNED_OUT elimina la clave. Se re-siembra DESPUÉS del init() (que ya
      // la limpia por sí solo, cf. check anterior) para aislar el mecanismo bajo
      // prueba: el propio handler de SIGNED_OUT, no el boot sin sesión.
      const ls = makeLocalStorage();
      const sb = makeSupabaseMock({ session: null });
      const ctx = loadApp({ supabase: sb, localStorage: ls });
      await ctx.Auth.init();
      ls.setItem('mycampus_current_view', JSON.stringify({ view: 'simulator' }));
      check('N25 behavioral (sanity): la clave está sembrada antes de SIGNED_OUT',
        ctx.localStorage.getItem('mycampus_current_view') !== null);
      sb._calls.authStateCb('SIGNED_OUT', null);
      check('N25 behavioral: SIGNED_OUT elimina mycampus_current_view',
        ctx.localStorage.getItem('mycampus_current_view') === null);
    }
    {
      // (3) Boot CON sesión no la elimina. App "ya inicializada" (mismo patrón
      // que N9) toma la rama corta de _onAuthSuccess a la que init() delega tras
      // `if (session)` — cubre la invariante real sin recorrer todo App.init(),
      // fuera de alcance del DOM mínimo mockeado de este arnés.
      const ls = makeLocalStorage();
      ls.setItem('mycampus_current_view', JSON.stringify({ view: 'simulator' }));
      const sb = makeSupabaseMock();
      const ctx = loadApp({ supabase: sb, localStorage: ls });
      ctx.App._initialized = true;
      const user = { id: 'u1', email: 'a@b.c', user_metadata: {} };
      await ctx.Auth._onAuthSuccess(user);
      check('N25 behavioral: boot CON sesión no borra mycampus_current_view',
        ctx.localStorage.getItem('mycampus_current_view') !== null);
    }
  }

  /* ---- N26: clamp del scroll tras rotar (2026-08-06) ---- */
  // Bug en iOS Safari (móvil físico): al rotar retrato→apaisado→retrato con el
  // scroll casi al final de una lección, WebKit no re-clampa window.scrollY
  // contra la nueva altura del documento — pantalla en blanco (solo el FAB
  // fixed) hasta que un tap fuerza el re-clamp. El fix reproduce el tap:
  // listener sobre matchMedia('(orientation: portrait)') que, tras el settle
  // de 250ms estándar del repo, clampa scrollY solo si quedó fuera de rango.
  {
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N26 estático: init() registra el listener de orientación con los guards del arnés',
      /matchMedia\('\(orientation: portrait\)'\)/.test(appSrc));
    // Evidencia de dispositivo (overlay 2026-08-06): a los 250ms WebKit aún
    // reportaba scrollY=max (sano) y la corrupción llegó después — un chequeo
    // único la esquiva. Ráfaga de chequeos cubriendo la ventana de la
    // restauración tardía de iOS.
    check('N26 estático: el listener programa la ráfaga de chequeos 250/700/1300/2000ms (la corrupción llega tarde)',
      /\[250, 700, 1300, 2000\]\.forEach\(\(ms\) => setTimeout\(\(\) => this\._clampScrollAfterRotate\(\), ms\)\)/.test(appSrc));
    check("N26 estático: el clamp usa behavior:'auto' (scroll-behavior:smooth global lo haría animado)",
      /_clampScrollAfterRotate\(\) \{[\s\S]*?behavior: 'auto'/.test(appSrc));

    // Comportamental: re-sincroniza cuando scrollY quedó fuera de rango O cuando
    // el visual viewport se desancló del layout viewport (vvOffTop > 1 sin
    // pinch-zoom — la firma exacta que capturó el overlay en el dispositivo).
    // El nudge son DOS scrollTo distintos: uno solo al valor actual se optimiza
    // a no-op y no re-engancha el visual viewport (por eso el tap sí funciona).
    {
      const ctx = loadApp();
      const scrolls = [];
      ctx.window.scrollTo = (arg) => { scrolls.push(arg); };
      ctx.window.innerHeight = 800;
      ctx.document.documentElement.scrollHeight = 2000; // max válido = 1200

      ctx.window.scrollY = 5000; // más allá del final → re-sync al máximo
      ctx.App._clampScrollAfterRotate();
      check('N26 comportamiento: sobre-scrolleado → nudge de 2 scrolls acabando en max con behavior auto',
        scrolls.length === 2 && scrolls[0].top === 1199 && scrolls[1].top === 1200
        && scrolls.every(s => s.behavior === 'auto'));

      scrolls.length = 0;
      ctx.window.scrollY = 500; // dentro de rango, sin drift → no toca nada
      ctx.App._clampScrollAfterRotate();
      check('N26 comportamiento: scroll válido → no-op (cero impacto en rotaciones normales)',
        scrolls.length === 0);

      // La firma del dispositivo: scrollY parece válido pero el visual viewport
      // quedó desanclado (pageTop - offsetTop = scroll real del layout).
      ctx.window.scrollY = 1200;
      ctx.window.visualViewport = { scale: 1, offsetTop: 500, pageTop: 1700, height: 300 };
      ctx.App._clampScrollAfterRotate();
      check('N26 comportamiento: drift del visual viewport sin pinch-zoom → re-sync al scroll real del layout',
        scrolls.length === 2 && scrolls[1].top === 1200);

      scrolls.length = 0;
      ctx.window.visualViewport = { scale: 2, offsetTop: 500, pageTop: 1700, height: 300 };
      ctx.App._clampScrollAfterRotate();
      check('N26 comportamiento: con pinch-zoom real (scale>1) nunca toca el scroll del usuario',
        scrolls.length === 0);

      delete ctx.window.visualViewport;
      ctx.window.scrollY = 100; // documento más corto que el viewport → max 0
      ctx.document.documentElement.scrollHeight = 600;
      ctx.App._clampScrollAfterRotate();
      check('N26 comportamiento: documento más corto que el viewport → acaba en 0, nunca negativo',
        scrolls.length === 2 && scrolls[1].top === 0 && scrolls.every(s => s.top >= 0));

      delete ctx.window.scrollTo; // arnés/navegador sin scrollTo → no revienta
      let threw = false;
      try { ctx.App._clampScrollAfterRotate(); } catch (e) { threw = true; }
      check('N26 comportamiento: sin window.scrollTo el método es no-op (guard typeof)', !threw);
    }
  }

  /* ---- N27: ranking global por XP (2026-08-06) ---- */
  {
    const ctx = loadApp();
    const rkKeys = ['nav_ranking', 'rk_intro', 'rk_publish_note', 'rk_name_label',
      'rk_name_placeholder', 'rk_join', 'rk_leave', 'rk_rename', 'rk_error', 'rk_offline',
      'rk_empty', 'rk_loading', 'rk_pos_header', 'rk_name_header', 'rk_xp_header',
      'rk_your_position', 'rk_you', 'rk_name_invalid', 'rk_left_toast'];
    check('N27 i18n: claves rk_* definidas en ES y EN',
      rkKeys.every(k => ctx.TRANSLATIONS.es[k] && ctx.TRANSLATIONS.en[k]));
  }

  {
    const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const appSrc = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
    check('N27 markup: símbolo #i-podium en el sprite',
      /<symbol id="i-podium" viewBox="0 0 24 24">/.test(htmlSrc));
    check('N27 markup: nav-item data-view="ranking" con icono sprite y data-i18n',
      /data-view="ranking"[\s\S]{0,200}#i-podium[\s\S]{0,200}data-i18n="nav_ranking"/.test(htmlSrc));
    check('N27 markup: vista view-ranking con #rankingContent dentro',
      /<div class="view" id="view-ranking">[\s\S]{0,400}id="rankingContent"/.test(htmlSrc));
    check('N27 nav: navigate() despacha renderRanking y titleMap tiene ranking',
      /if \(view === 'ranking'\) this\.renderRanking\(\);/.test(appSrc)
      && /ranking: 'nav_ranking'/.test(appSrc));
  }

  // Comportamental: opt-in / opt-out / fetch contra el mock.
  {
    const ctx = loadApp();
    ctx.App.state = ctx.App.loadState();
    ctx.App.state.xp = 777;
    ctx.window.CAMPUS_USER_ID = 'u-rk';
    // Auth.user es lo que leen las acciones:
    ctx.Auth.user = { id: 'u-rk', email: 'a@b.c', user_metadata: {} };
    let saved = 0; ctx.App.saveState = () => { saved++; };
    ctx.App.renderRanking = () => {}; // Task 5; aquí solo datos
    ctx.App.showToast = () => {};

    check('N27 estado: _rankingEnsureState migra estados legados (defaults false/\'\')',
      (ctx.App._rankingEnsureState(), ctx.App.state.rankingOptIn === false
        && ctx.App.state.rankingName === ''));

    // Los awaits van directos: el cuerpo principal del arnés es async
    // (mismo patrón que los checks N25 con _onAuthSuccess).
    await ctx.App.rankingJoin('  Jorge C  ');
    const up = ctx.supabase._calls.upserts.find(u => u.table === 'leaderboard');
    check('N27 join: upsert a leaderboard con nombre limpio y xp del estado',
      up && up.display_name === 'Jorge C' && up.xp === 777 && up.user_id === 'u-rk');
    check('N27 join: activa rankingOptIn, guarda rankingName y persiste',
      ctx.App.state.rankingOptIn === true && ctx.App.state.rankingName === 'Jorge C'
      && saved > 0);

    const before = ctx.supabase._calls.upserts.length;
    await ctx.App.rankingJoin('');
    check('N27 join: nombre vacío → rechazado sin tocar Supabase',
      ctx.supabase._calls.upserts.length === before);
    await ctx.App.rankingJoin('x'.repeat(31));
    check('N27 join: nombre de 31 chars → rechazado',
      ctx.supabase._calls.upserts.length === before);

    await ctx.App.rankingLeave();
    check('N27 leave: DELETE en leaderboard y flag a false (el nombre se conserva)',
      ctx.supabase._calls.deletes.some(d => d.table === 'leaderboard')
      && ctx.App.state.rankingOptIn === false && ctx.App.state.rankingName === 'Jorge C');
  }

  {
    const sb = makeSupabaseMock({ selectQueue: [
      { data: [{ user_id: 'a', display_name: 'Ana', xp: 900 }], count: 60, error: null },
      { count: 7, error: null },
    ] });
    const ctx = loadApp({ supabase: sb });
    ctx.App.state = ctx.App.loadState();
    ctx.App.state.xp = 100; ctx.App.state.rankingOptIn = true; ctx.App.state.rankingName = 'Yo';
    ctx.Auth.user = { id: 'u-rk', email: 'a@b.c', user_metadata: {} };
    const res = await ctx.App._rankingFetch();
    check('N27 fetch: top + total + posición propia (superiores + 1) cuando estoy fuera del top',
      res.rows.length === 1 && res.total === 60 && res.myPos === 8);
  }

  // renderRanking: XSS: nombres ajenos escapados; render de tabla y panel opt-in.
  {
    const sb = makeSupabaseMock({ selectQueue: [
      { data: [
        { user_id: 'evil', display_name: '<img src=x onerror=alert(1)>', xp: 999 },
        { user_id: 'u-rk', display_name: 'Yo', xp: 777 },
      ], count: 2, error: null },
    ] });
    const ctx = loadApp({ supabase: sb });
    ctx.App.state = ctx.App.loadState();
    ctx.App.state.xp = 777; ctx.App.state.rankingOptIn = true; ctx.App.state.rankingName = 'Yo';
    ctx.Auth.user = { id: 'u-rk', email: 'a@b.c', user_metadata: {} };
    await ctx.App.renderRanking();
    const html = ctx.document.getElementById('rankingContent').innerHTML;
    check('N27 xss: display_name ajeno escapado en el innerHTML',
      !html.includes('<img src=x') && html.includes('&lt;img'));
    check('N27 render: fila propia resaltada (clase rk-me) y botón de salir presente',
      html.includes('rk-me') && html.includes('App.rankingLeave()'));
  }
  {
    const ctx = loadApp();
    ctx.App.state = ctx.App.loadState();
    ctx.Auth.user = { id: 'u-rk', email: 'a@b.c', user_metadata: {} };
    await ctx.App.renderRanking();
    const html = ctx.document.getElementById('rankingContent').innerHTML;
    check('N27 render: sin participar → panel de opt-in con nota de privacidad y botón Participar',
      html.includes('App.rankingJoin') && html.includes('rk-publish-note')
      && html.includes('id="rkNameInput"'));
  }

  {
    // Sync: upsert del ranking tras el push del progreso, gated por el flag,
    // y nunca bloqueante.
    const ctx = loadApp();
    ctx.Sync._reconciled = true;
    const st = { xp: 500, rankingOptIn: true, rankingName: 'Yo', _updatedAt: 1 };
    await ctx.Sync._push('u-rk', st);
    const tables = ctx.supabase._calls.upserts.map(u => u.table);
    check('N27 sync: con optIn el push sube progreso Y ranking (en ese orden)',
      tables.indexOf('user_progress') !== -1
      && tables.indexOf('leaderboard') > tables.indexOf('user_progress'));

    const before = ctx.supabase._calls.upserts.filter(u => u.table === 'leaderboard').length;
    await ctx.Sync._push('u-rk', { xp: 500, rankingOptIn: false, _updatedAt: 2 });
    check('N27 sync: sin optIn el push no toca leaderboard',
      ctx.supabase._calls.upserts.filter(u => u.table === 'leaderboard').length === before);
  }
  {
    // Un fallo del upsert del ranking no rompe el push del progreso.
    const sb = makeSupabaseMock();
    const origFrom = sb.from.bind(sb);
    sb.from = (table) => {
      if (table === 'leaderboard') return { upsert: async () => { throw new Error('boom'); } };
      return origFrom(table);
    };
    const ctx = loadApp({ supabase: sb });
    ctx.Sync._reconciled = true;
    let threw = false;
    try { await ctx.Sync._push('u-rk', { xp: 1, rankingOptIn: true, rankingName: 'Yo', _updatedAt: 3 }); }
    catch (e) { threw = true; }
    check('N27 sync: el upsert del ranking reventando no propaga ni impide el push',
      !threw && sb._calls.upserts.some(u => u.table === 'user_progress'));

    // Cobertura directa: sin esto, un futuro borrado del try/catch interno de
    // _pushRanking pasaría el check de arriba igualmente (el catch externo de
    // _push se lo tragaría con el mismo resultado observable). Llamando a
    // _pushRanking en aislamiento se prueba SU propio try/catch, no el ajeno.
    let threwDirect = false;
    try { await ctx.Sync._pushRanking('u-rk', { xp: 1, rankingOptIn: true, rankingName: 'Yo' }); }
    catch (e) { threwDirect = true; }
    check('N27 sync: _pushRanking en aislamiento nunca lanza (catch propio, no el de _push)',
      !threwDirect);

    /* ---- N27 css/responsive (Task 7) ---- */
    const cssSrc = fs.readFileSync(path.join(ROOT, 'css', 'styles.css'), 'utf8');
    check('N27 css: .ranking-table definida antes del bloque reduced-motion (orden del tail)',
      /\.ranking-table \{/.test(cssSrc)
      && cssSrc.search(/\.ranking-table \{/) < cssSrc.search(/@media \(prefers-reduced-motion: reduce\)/));
    check('N27 css: fila propia resaltada y botones táctiles de ≥44px',
      /\.rk-me \{/.test(cssSrc) && /\.rk-join-btn, \.rk-rename-btn, \.rk-leave-btn \{/.test(cssSrc));
    check('N27 responsive: la vista ranking entra en el barrido del gate',
      /'achievements', 'ranking'/.test(fs.readFileSync(path.join(ROOT, 'scripts', 'validate-responsive.js'), 'utf8')));
    // Anclado al bloque del tier 480, no a cssSrc entero: sin esto, mover las
    // reglas fuera del tier (a la sección base o al tier 768) deja pasar el
    // check igual porque solo mira si el texto aparece en algún sitio del
    // fichero — no si está DENTRO del media query que le da la especificidad
    // de id que necesita para ganar la cascada. Ver la nota de especificidad
    // de id en el propio tier (~1531).
    const t480start = cssSrc.indexOf('@media (max-width: 480px)');
    const t480 = cssSrc.slice(t480start, cssSrc.indexOf('/* ===== UTILITY', t480start));
    check('N27 css: overrides del tier 480 con prefijo #view-ranking (especificidad de id — ganan a la base posterior) (dentro del tier)',
      /#view-ranking \.ranking-optin, #view-ranking \.ranking-controls \{/.test(t480));
    check('N27 css: input del nombre a fila completa en el tier 480 (móvil: los botones caen debajo) (dentro del tier)',
      (() => {
        const m = t480.match(/#view-ranking \.ranking-controls #rkNameInput \{([^}]*)\}/);
        return !!m && /flex-basis:\s*100%/.test(m[1])
          && /#view-ranking \.ranking-controls \.rk-rename-btn,\s*\n?\s*#view-ranking \.ranking-controls \.rk-leave-btn \{[^}]*flex:\s*1/.test(t480);
      })());
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
