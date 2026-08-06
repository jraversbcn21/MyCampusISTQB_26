/* Gate responsive con navegador real — arnés de desarrollo (no se sirve al navegador).
   Levanta un servidor estático propio sobre el root del repo, abre la app en
   Chromium (Playwright) emulando teléfonos/tablet (320/375/414/600 × 720,
   táctil — 600 cubre la banda 481-768px, añadida en la revisión final del
   2026-07-21, sin gate previo) y afirma los invariantes móviles de la ronda
   2026-07-21: sin scroll horizontal en las 7 vistas + lección con tabla +
   examen activo, touch targets ≥ 44px, tira de dots ≤ 64px (solo dentro del
   tier ≤480; a 600 la parrilla envolvente de la regla base es el
   comportamiento esperado), drawer end-to-end (scrim/inert/hamburguesa),
   glosario apilado, modal de avatar (1 columna solo ≤480) y tour de
   onboarding íntegramente en viewport.

   POLÍTICA NO-OP (aprobada en la spec): si Playwright no está disponible, el
   script lo dice y sale 0 — NUNCA rompe un entorno sin él. Por eso queda FUERA
   del pre-commit: es un paso MANUAL obligatorio antes de cada release y tras
   cualquier cambio de layout (la familia N20 de verify-runtime.js cubre lo
   estático en cada commit; esto cubre lo que solo un navegador real puede ver).

   Cómo correr:   node scripts/validate-responsive.js
   Requisitos:    npm i -g playwright  +  npx playwright install chromium */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

/* ---- Resolución de Playwright (patrón no-op) ----
   require('playwright') no resuelve la instalación global de npm en Windows
   (no está en las rutas de node_modules del repo): segundo intento contra
   %APPDATA%\npm\node_modules. Si tampoco, SKIP y exit 0. */
let playwright = null;
try {
  playwright = require('playwright');
} catch (e) {
  try {
    playwright = require(path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'playwright'));
  } catch (e2) { playwright = null; }
}
if (!playwright) {
  console.log('SKIP: Playwright no disponible — gate responsive omitido (instalar: npm i -g playwright && npx playwright install chromium)');
  process.exit(0);
}

const ROOT = path.join(__dirname, '..');
const WIDTHS = [320, 375, 414, 600]; // × 720, hasTouch + isMobile — 600 cubre la banda 481-768 (hallazgo revisión final, sin gate previo)
const VIEWS = ['dashboard', 'curriculum', 'flashcards', 'simulator', 'glossary', 'progress', 'achievements', 'ranking'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

let failures = [];
function assert(vp, label, ok, detail) {
  console.log(`  [${vp}px] ${label} ${ok ? '✅' : '❌'}${!ok && detail ? ` — ${detail}` : ''}`);
  if (!ok) failures.push(`[${vp}px] ${label}${detail ? ` — ${detail}` : ''}`);
}

/* Servidor estático propio (sin depender de Python): root del repo, puerto
   efímero de 127.0.0.1 (listen(0) y se lee el asignado). */
function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath;
      try { urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
      catch (e) { res.writeHead(400); res.end(); return; }
      const fp = path.normalize(path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath));
      if (!fp.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      fs.readFile(fp, (err, data) => {
        if (err) { res.writeHead(404); res.end('not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

/* Bypass de auth (mismo mecanismo que el arnés de la auditoría 2026-07-21):
   los módulos son const de script clásico — en page.evaluate se accede como
   bare `App`/`LESSONS`, NO window.App. La clave de onboarding se pone ANTES
   de App.init() para que el tour no arranque solo (se lanza a mano en (f)). */
async function bypassAuth(page) {
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('mycampus_onboarding_v1_undefined', '1');
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    App.init();
  });
  await page.waitForTimeout(300);
}

const measureDoc = () => {
  const de = document.documentElement;
  return { sw: de.scrollWidth, cw: de.clientWidth };
};

(async () => {
  const t0 = Date.now();
  const { server, port } = await startServer();
  const base = `http://127.0.0.1:${port}/index.html`;

  let browser;
  try {
    browser = await playwright.chromium.launch();
  } catch (e) {
    server.close();
    console.log('SKIP: Playwright no disponible — Chromium sin instalar (npx playwright install chromium)');
    process.exit(0);
  }

  try {
    for (const width of WIDTHS) {
      console.log(`\nViewport ${width}×720 (hasTouch, isMobile):`);
      const context = await browser.newContext({
        viewport: { width, height: 720 }, hasTouch: true, isMobile: true, locale: 'es-ES',
      });
      // Sin red externa (CDNs de Sentry/Supabase abortadas): determinista y
      // rápido; los guards de carga de la app degradan limpio sin ellas.
      await context.route('**/*', route => {
        let host = '';
        try { host = new URL(route.request().url()).hostname; } catch (e) {}
        return host === '127.0.0.1' ? route.continue() : route.abort();
      });

      const page = await context.newPage();
      await page.goto(base, { waitUntil: 'domcontentloaded' });

      /* ---- LANDING PÚBLICA (2026-07-25): se mide ANTES del bypass de auth —
         es la única vista que un usuario sin sesión ve. ---- */
      const lp = await page.evaluate(() => {
        const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { w: b.width, h: b.height }; };
        return {
          sw: document.documentElement.scrollWidth,
          cw: document.documentElement.clientWidth,
          signin: r(document.getElementById('lpSigninLink')),
          langES: r(document.getElementById('authBtnES')),
          tabReg: r(document.getElementById('tabRegister')),
          submit: r(document.getElementById('authSubmit')),
          cta: r(document.getElementById('lpCtaBtn')),
          steps: document.querySelectorAll('.lp-step').length,
        };
      });
      assert(width, 'landing sin scroll horizontal', lp.sw <= lp.cw, `sw=${lp.sw} cw=${lp.cw}`);
      const lpGe44 = (b) => b && b.h >= 44;
      assert(width, 'landing: targets ≥44px de alto (signin/lang/tab/submit/cta)',
        [lp.signin, lp.langES, lp.tabReg, lp.submit, lp.cta].every(lpGe44),
        JSON.stringify({ signin: lp.signin, langES: lp.langES, tabReg: lp.tabReg, submit: lp.submit, cta: lp.cta }));
      assert(width, 'landing: timeline con 6 pasos renderizados', lp.steps === 6);

      await bypassAuth(page);

      /* ---- (a) Sin scroll horizontal en las 7 vistas + (b) targets + (e) glosario ---- */
      for (const view of VIEWS) {
        await page.evaluate(v => App.navigate(v), view);
        // Flashcards: medir EN REPOSO — el translateX inline de un slide en
        // curso extiende scrollWidth transitoriamente (handover Task 7).
        await page.waitForTimeout(view === 'flashcards' ? 700 : 250);
        const m = await page.evaluate(measureDoc);
        assert(width, `vista '${view}' sin scroll horizontal`, m.sw <= m.cw,
          `scrollWidth ${m.sw} > clientWidth ${m.cw}`);

        if (view === 'glossary') {
          const g = await page.evaluate(() => {
            const vc = document.getElementById('viewsContainer');
            return { sw: vc.scrollWidth, cw: vc.clientWidth };
          });
          assert(width, 'glosario: views-container sin desbordamiento', g.sw <= g.cw,
            `scrollWidth ${g.sw} > clientWidth ${g.cw}`);
        }

        if (view === 'flashcards') {
          const fc = await page.evaluate(() => {
            const p = document.getElementById('fcPrev').getBoundingClientRect();
            const n = document.getElementById('fcNext').getBoundingClientRect();
            return { p: [p.width, p.height], n: [n.width, n.height] };
          });
          const ok44 = v => v[0] >= 43.5 && v[1] >= 43.5; // 0.5px de tolerancia subpíxel
          assert(width, 'flashcards: flechas fcPrev/fcNext ≥ 44×44', ok44(fc.p) && ok44(fc.n),
            `fcPrev ${fc.p.map(Math.round).join('×')}, fcNext ${fc.n.map(Math.round).join('×')}`);
        }
      }

      /* ---- (a bis) Lección con tabla: scroll local del wrapper, no de la página ---- */
      const lesson = await page.evaluate(() => {
        const key = Object.keys(LESSONS).find(k => LESSONS[k].es && LESSONS[k].es.content.includes('<table'));
        if (!key) return { found: false };
        let chIdx = -1;
        CHAPTERS.forEach((ch, i) => { if (ch.topics.some(t => t.id === key)) chIdx = i; });
        App.navigateToLesson(chIdx, key);
        return { found: true, key };
      });
      await page.waitForTimeout(250);
      const lm = await page.evaluate(() => {
        const de = document.documentElement;
        return {
          sw: de.scrollWidth, cw: de.clientWidth,
          wrapped: !!document.querySelector('#lessonContainer .table-scroll table'),
        };
      });
      assert(width, `lección con tabla (${lesson.key || '??'}) sin scroll horizontal`,
        lesson.found && lm.sw <= lm.cw, `scrollWidth ${lm.sw} > clientWidth ${lm.cw}`);
      assert(width, 'lección: tabla envuelta en .table-scroll', lm.wrapped);

      /* ---- (d) Drawer end-to-end: inert cerrado, scrim, hamburguesa alcanzable ---- */
      await page.evaluate(() => App.navigate('dashboard'));
      await page.waitForTimeout(150);
      const closed0 = await page.evaluate(() => ({
        inert: document.getElementById('sidebar').hasAttribute('inert'),
        aria: document.getElementById('mobileMenuBtn').getAttribute('aria-expanded'),
      }));
      assert(width, 'drawer cerrado: #sidebar con inert en móvil', closed0.inert);
      assert(width, 'drawer cerrado: aria-expanded="false"', closed0.aria === 'false',
        `aria-expanded="${closed0.aria}"`);

      await page.click('#mobileMenuBtn');
      await page.waitForTimeout(350); // transición del drawer: 0.2s
      const open = await page.evaluate(() => {
        const btn = document.getElementById('mobileMenuBtn');
        const r = btn.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        const sbRect = document.getElementById('sidebar').getBoundingClientRect();
        return {
          scrim: getComputedStyle(document.getElementById('sidebarScrim')).display,
          mobileOpen: document.getElementById('sidebar').classList.contains('mobile-open'),
          bodyClass: document.body.classList.contains('drawer-open'),
          aria: btn.getAttribute('aria-expanded'),
          btnHit: !!hit && (hit === btn || btn.contains(hit)),
          sidebarRight: sbRect.right,
        };
      });
      assert(width, 'drawer abierto: scrim visible + clases mobile-open/drawer-open',
        open.scrim === 'block' && open.mobileOpen && open.bodyClass,
        `scrim display:${open.scrim}, mobile-open:${open.mobileOpen}, drawer-open:${open.bodyClass}`);
      assert(width, 'drawer abierto: aria-expanded="true"', open.aria === 'true',
        `aria-expanded="${open.aria}"`);
      assert(width, 'drawer abierto: #mobileMenuBtn alcanzable (elementFromPoint)', open.btnHit);

      // Cerrar clicando el scrim: punto a la derecha del drawer, bajo el topbar.
      const scrimX = Math.min(width - 6, Math.round(open.sidebarRight + (width - open.sidebarRight) / 2));
      await page.mouse.click(scrimX, 400);
      await page.waitForTimeout(300);
      const closed1 = await page.evaluate(() => ({
        mobileOpen: document.getElementById('sidebar').classList.contains('mobile-open'),
        bodyClass: document.body.classList.contains('drawer-open'),
        inert: document.getElementById('sidebar').hasAttribute('inert'),
        aria: document.getElementById('mobileMenuBtn').getAttribute('aria-expanded'),
        scrim: getComputedStyle(document.getElementById('sidebarScrim')).display,
      }));
      assert(width, 'click en el scrim cierra el drawer (clases revertidas + scrim oculto)',
        !closed1.mobileOpen && !closed1.bodyClass && closed1.scrim === 'none',
        `mobile-open:${closed1.mobileOpen}, drawer-open:${closed1.bodyClass}, scrim:${closed1.scrim}`);
      assert(width, 'tras cerrar: inert repuesto y aria-expanded="false"',
        closed1.inert && closed1.aria === 'false',
        `inert:${closed1.inert}, aria-expanded="${closed1.aria}"`);

      /* ---- (h) FAB de apoyo (Buy Me a Coffee): la cascada gana de verdad ----
         Prueba de regresión permanente para el hallazgo de la revisión final
         (2026-07-21): el override .bmc-fab del tier ≤768 vivía ANTES de la
         regla base .bmc-fab en el fichero — misma especificidad (0,1,0), así
         que ganaba el orden de aparición y la base (más tardía) machacaba en
         silencio su padding/border-radius. El check N19 de verify-runtime.js
         solo comprobaba que el TEXTO de la declaración existiera en el
         fichero fuente, así que daba verde sobre CSS muerto (el círculo de
         48px solo parecía correcto porque border-radius:999px de la base
         también clampa a círculo en una caja de 48×48). Esto mide el estilo
         COMPUTADO real en Chromium, no el texto — la única forma de probar
         que la cascada gana de verdad. Los cuatro anchos de WIDTHS
         (320/375/414/600) caen dentro del tier ≤768, así que se comprueban
         los cuatro; el `width <= 768` explícito evita que un futuro ancho de
         escritorio añadido a WIDTHS falsee el chequeo en silencio. */
      if (width <= 768) {
        const fab = await page.evaluate(() => {
          const el = document.querySelector('.bmc-fab');
          if (!el) return null;
          const cs = getComputedStyle(el);
          if (cs.display === 'none') return { hidden: true };
          return { hidden: false, padding: cs.padding, borderRadius: cs.borderRadius };
        });
        assert(width, '.bmc-fab móvil: override gana la cascada (padding 0px + border-radius 50%)',
          !!fab && !fab.hidden && fab.padding === '0px' && fab.borderRadius === '50%',
          !fab ? 'no se encontró .bmc-fab'
            : fab.hidden ? 'el FAB está oculto (display:none)'
            : `padding:${fab.padding}, border-radius:${fab.borderRadius}`);
      }

      /* ---- (g) Modal de avatar: 1 columna en teléfono (≤480) ----
         Cobertura añadida el 2026-07-21 tras una regresión real que este gate
         no vio: la regla del tier perdía la cascada contra la base 1fr 1fr
         (que va después en el fichero) y el usuario encontró dos columnas de
         155px en un teléfono de 412px, con el texto a una palabra por línea. */
      const av = await page.evaluate(() => {
        // API real del módulo, no el click en #userAvatar: su listener lo
        // cablea el flujo de auth que el bypass se salta.
        AvatarSelector.openModal();
        const grid = document.querySelector('.avatar-grid');
        const modal = document.getElementById('avatar-modal');
        if (!grid || !modal || getComputedStyle(modal).display === 'none') return null;
        const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        const desc = document.querySelector('.av-desc');
        const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        AvatarSelector.closeModal();
        return { cols, descW: desc ? desc.getBoundingClientRect().width : null, overflow };
      });
      // La regla de 1 columna es del tier ≤480 (#avatar-modal .avatar-grid);
      // a anchos mayores (p.ej. 600, banda 481-768 añadida en la revisión
      // final) la base 1fr 1fr aplica legítimamente — solo se exige la
      // ausencia de scroll horizontal, no el número de columnas.
      const av1col = width <= 480;
      assert(width, av1col
        ? 'modal de avatar: grid a 1 columna y sin scroll horizontal'
        : 'modal de avatar: sin scroll horizontal (2 columnas es lo esperado fuera del tier 480)',
        !!av && (!av1col || av.cols === 1) && av.overflow <= 0,
        av ? `${av.cols} col, desc ${Math.round(av.descW)}px, overflow ${av.overflow}` : 'modal no abrió');

      /* ---- (a ter + b + c) Examen full activo: overflow, dot ≥ 44, tira ≤ 64 ---- */
      await page.evaluate(() => { App.navigate('simulator'); App.startExam('full'); });
      await page.waitForTimeout(500); // render + auto-centrado (smooth) del dot
      const ex = await page.evaluate(() => {
        const de = document.documentElement;
        const strip = document.querySelector('.exam-question-dots');
        const dot = document.querySelector('.exam-dot');
        const dr = dot ? dot.getBoundingClientRect() : null;
        return {
          sw: de.scrollWidth, cw: de.clientWidth,
          stripH: strip ? strip.getBoundingClientRect().height : -1,
          dot: dr ? [dr.width, dr.height] : null,
        };
      });
      assert(width, 'examen full activo sin scroll horizontal', ex.sw <= ex.cw,
        `scrollWidth ${ex.sw} > clientWidth ${ex.cw}`);
      assert(width, 'examen: .exam-dot ≥ 44×44 (tier coarse)',
        !!ex.dot && ex.dot[0] >= 43.5 && ex.dot[1] >= 43.5,
        ex.dot ? `dot ${ex.dot.map(Math.round).join('×')}` : 'sin .exam-dot');
      // La tira de una sola fila (nowrap + scroll) es una regla del tier
      // ≤480 (ver comentario junto a .exam-question-dots en styles.css); a
      // anchos mayores (p.ej. 600, banda 481-768 añadida en la revisión
      // final) la parrilla envolvente de la regla base es el comportamiento
      // esperado y crece en alto con los ~40 dots — no es un defecto.
      if (width <= 480) {
        assert(width, 'examen: tira .exam-question-dots ≤ 64px de alto',
          ex.stripH >= 0 && ex.stripH <= 64, `alto ${Math.round(ex.stripH)}px`);
      } else {
        assert(width, 'examen: tira .exam-question-dots presente (parrilla envolvente fuera del tier 480, sin límite de alto)',
          ex.stripH >= 0, `alto ${Math.round(ex.stripH)}px`);
      }

      await page.close();

      /* ---- (f) Onboarding completo — solo a 320 y 375 (el tour son 8 pasos con
         esperas de reposicionado; correrlo también a 414 no añade cobertura de
         clamp — 414 es el ancho más holgado — y alarga el gate ~8s). ---- */
      if (width === 320 || width === 375) {
        const page2 = await context.newPage();
        await page2.goto(base, { waitUntil: 'domcontentloaded' });
        await bypassAuth(page2);
        await page2.evaluate(() => {
          localStorage.removeItem('mycampus_onboarding_v1_undefined');
          App.navigate('dashboard');
          Onboarding.start(undefined); // clave: mycampus_onboarding_v1_undefined
        });
        await page2.waitForTimeout(350);

        const readTour = () => page2.evaluate(() => {
          const t = document.getElementById('onboarding-tooltip');
          const r = t.getBoundingClientRect();
          // Solape tooltip/spotlight: a 412px el flip derecha/izquierda del
          // tooltip acababa clampado tapando el 91% del anillo — el usuario
          // no veía qué módulo se le señalaba (reporte del 2026-07-21). El
          // modo "debajo del target" lo elimina; este assert lo vigila.
          const h = document.getElementById('onboarding-highlight');
          let coverage = 0;
          if (h && h.style.display !== 'none') {
            const hr = h.getBoundingClientRect();
            const ox = Math.max(0, Math.min(r.right, hr.right) - Math.max(r.left, hr.left));
            const oy = Math.max(0, Math.min(r.bottom, hr.bottom) - Math.max(r.top, hr.top));
            const hArea = hr.width * hr.height;
            coverage = hArea > 0 ? (ox * oy) / hArea : 0;
          }
          return {
            left: r.left, top: r.top, right: r.right, bottom: r.bottom,
            iw: innerWidth, ih: innerHeight, coverage,
            drawer: document.getElementById('sidebar').classList.contains('mobile-open')
              && document.body.classList.contains('drawer-open'),
          };
        });
        // Invariante de clamp (Task 9): tooltip ENTERO dentro del viewport con
        // margen de 16px (tolerancia 0.5px por subpíxel).
        const inVp = r => r.left >= 15.5 && r.top >= 15.5
          && r.right <= r.iw - 15.5 && r.bottom <= r.ih - 15.5;
        const fmt = r => `rect ${Math.round(r.left)},${Math.round(r.top)}→${Math.round(r.right)},${Math.round(r.bottom)} en ${r.iw}×${r.ih}`;

        const steps = await page2.evaluate(() => ONBOARDING_STEPS.length); // 8: bienvenida + 7 sidebar
        let tourOk = true, drawerOk = true, coverOk = true, badStep = -1, badRect = '';
        let badCover = '';
        const s0 = await readTour();
        if (!inVp(s0)) { tourOk = false; badStep = 0; badRect = fmt(s0); }
        for (let i = 1; i < steps; i++) {
          await page2.click('#obNext');
          // ≥300ms: al entrar al PRIMER paso del sidebar el tooltip se
          // reposiciona tras ~250ms (espera del transform del drawer).
          await page2.waitForTimeout(450);
          const s = await readTour();
          if (!inVp(s) && tourOk) { tourOk = false; badStep = i; badRect = fmt(s); }
          if (!s.drawer) drawerOk = false; // pasos 1..7: todos señalan el sidebar
          if (s.coverage > 0.25 && coverOk) {
            coverOk = false;
            badCover = `paso ${i}: tooltip tapa el ${Math.round(s.coverage * 100)}% del spotlight`;
          }
        }
        assert(width, `onboarding: tooltip íntegro en viewport en los ${steps} pasos`,
          tourOk, `paso ${badStep}: ${badRect}`);
        assert(width, 'onboarding: pasos del sidebar con el drawer abierto', drawerOk);
        assert(width, 'onboarding: el tooltip no tapa el spotlight (≤25%)', coverOk, badCover);

        await page2.click('#obNext'); // último click: "Empezar" → _done()
        await page2.waitForTimeout(300);
        const done = await page2.evaluate(() => ({
          aria: document.getElementById('mobileMenuBtn').getAttribute('aria-expanded'),
          drawer: document.getElementById('sidebar').classList.contains('mobile-open'),
          tooltip: document.getElementById('onboarding-tooltip').style.display,
          key: localStorage.getItem('mycampus_onboarding_v1_undefined'),
        }));
        assert(width, 'onboarding: al terminar cierra el drawer (aria-expanded="false") y marca la clave',
          done.aria === 'false' && !done.drawer && done.tooltip === 'none' && done.key === '1',
          `aria="${done.aria}", drawer:${done.drawer}, tooltip:${done.tooltip}, clave:${done.key}`);
        await page2.close();
      }

      await context.close();
    }

    /* ---- Landing a ancho desktop (1195 = captura del handoff): sin overflow. ---- */
    {
      const ctxDesk = await browser.newContext({ viewport: { width: 1195, height: 800 }, locale: 'es-ES' });
      // Mismo abort de red externa que los demás contextos (~129-133): sin él
      // esta pasada depende de que Sentry/Supabase respondan por CDN real y
      // puede colgarse/fallar por timeout en redes sin salida.
      await ctxDesk.route('**/*', route => {
        let host = '';
        try { host = new URL(route.request().url()).hostname; } catch (e) {}
        return host === '127.0.0.1' ? route.continue() : route.abort();
      });
      const pDesk = await ctxDesk.newPage();
      await pDesk.goto(base, { waitUntil: 'domcontentloaded' });
      const m = await pDesk.evaluate(measureDoc);
      assert(1195, 'landing desktop sin scroll horizontal', m.sw <= m.cw, `sw=${m.sw} cw=${m.cw}`);
      await ctxDesk.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n(duración: ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  if (failures.length) {
    console.error(`\n❌ ${failures.length} chequeo(s) responsive fallan:`);
    failures.forEach(f => console.error('  - ' + f));
    process.exit(1);
  }
  console.log(`✅ Todos los chequeos responsive pasan en ${WIDTHS.join('/')}.`);
})().catch(e => { console.error('❌ El gate responsive reventó:', e); process.exit(1); });
