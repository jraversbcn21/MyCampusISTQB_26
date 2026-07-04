/* Arnés de verificación de runtime — dev-only, nunca servido al navegador.
   Carga los módulos reales de js/ en un DOM mínimo mockeado (sin navegador,
   sin npm install) y ejercita los comportamientos corregidos en la pasada de
   remediación 2026-07-04 y su re-auditoría. Hermano de validate-*.js: se
   ejecuta con `node scripts/verify-runtime.js` y sale con código 1 si algo
   falla. Si añades un fix de comportamiento en js/, añade aquí su chequeo. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORDER = ['config.js', 'i18n.js', 'content.js', 'questions.js', 'gamification.js',
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
      onAuthStateChange() { return { data: { subscription: {} } }; },
      getSession: async () => ({ data: { session: opts.session || { access_token: 'tok-mock' } } }),
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

/* ===== Carga de módulos con scope compartido (emula <script> secuenciales) ===== */
function loadApp(opts = {}) {
  const exclude = opts.exclude || [];
  const files = ORDER.filter(f => !exclude.includes(f));
  const src = files.map(f => fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')).join('\n;\n');

  const doc = makeDocument();
  const ls = opts.localStorage || makeLocalStorage();
  const sb = 'supabase' in opts ? opts.supabase : makeSupabaseMock();
  const calls = { fetches: [] };

  const win = {
    supabase: sb ? { createClient: () => sb } : undefined,
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
    i18n: typeof i18n !== 'undefined' ? i18n : undefined,
    TRANSLATIONS: typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : undefined
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
      for (const m of t.matchAll(/data-i18n(?:-placeholder|-title)?="([^"]+)"/g)) used.add(m[1]);
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
