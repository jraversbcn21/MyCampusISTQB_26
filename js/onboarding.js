/* ===================================================
   MyCampus ISTQB — Onboarding Tour
   =================================================== */

const ONBOARDING_STEPS = [
  {
    target: null,
    title: { es: '¡Bienvenido a MyCampus! 🎓', en: 'Welcome to MyCampus! 🎓' },
    text: {
      es: 'Tu plataforma de preparación para ISTQB Foundation Level v4.0. Te mostramos los módulos disponibles en menos de un minuto.',
      en: "Your preparation platform for the ISTQB Foundation Level v4.0 certification. We'll show you the available modules in under a minute."
    },
    position: 'center',
  },
  {
    target: '[data-view="dashboard"]',
    title: { es: '📊 Dashboard', en: '📊 Dashboard' },
    text: {
      es: 'Tu panel principal. Aquí ves tus estadísticas, el reto diario y tu nivel de preparación para el examen.',
      en: 'Your main panel. Here you can see your stats, the daily challenge, and your exam readiness level.'
    },
    position: 'right',
  },
  {
    target: '[data-view="curriculum"]',
    title: { es: '📚 Curriculum', en: '📚 Curriculum' },
    text: {
      es: '6 capítulos completos del temario ISTQB FL v4.0 con lecciones detalladas y seguimiento de progreso.',
      en: 'All 6 chapters of the ISTQB FL v4.0 syllabus, with detailed lessons and progress tracking.'
    },
    position: 'right',
  },
  {
    target: '[data-view="flashcards"]',
    title: { es: '🃏 Flashcards', en: '🃏 Flashcards' },
    text: {
      es: 'Repasa conceptos clave con tarjetas interactivas. Califica cada una como fácil, normal o difícil.',
      en: 'Review key concepts with interactive cards. Rate each one as easy, OK, or hard.'
    },
    position: 'right',
  },
  {
    target: '[data-view="simulator"]',
    title: { es: '📝 Simulacros', en: '📝 Exam Simulator' },
    text: {
      es: 'Practica con exámenes tipo ISTQB: examen completo (40 preguntas), rápido (20) o por capítulo.',
      en: 'Practice with ISTQB-style exams: full exam (40 questions), quick exam (20), or by chapter.'
    },
    position: 'right',
  },
  {
    target: '[data-view="glossary"]',
    title: { es: '📖 Glosario', en: '📖 Glossary' },
    text: {
      es: 'Todos los términos y definiciones del estándar ISTQB, con búsqueda instantánea.',
      en: 'All the terms and definitions from the ISTQB standard, with instant search.'
    },
    position: 'right',
  },
  {
    target: '[data-view="progress"]',
    title: { es: '📈 Progreso', en: '📈 Progress' },
    text: {
      es: 'Gráficas de rendimiento, historial de exámenes y registro de toda tu actividad.',
      en: 'Performance charts, exam history, and a log of all your activity.'
    },
    position: 'right',
  },
  {
    target: '[data-view="achievements"]',
    title: { es: '🏆 Logros', en: '🏆 Achievements' },
    text: {
      es: 'Desbloquea insignias y acumula XP completando lecciones, exámenes y rachas de estudio.',
      en: 'Unlock badges and earn XP by completing lessons, exams, and study streaks.'
    },
    position: 'right',
  },
];

const Onboarding = {
  _step: 0,
  _userId: null,
  _onResize: null, // handler de resize/orientationchange, solo vivo durante el tour

  /* ===== PUBLIC ===== */
  start(userId) {
    this._userId = userId;
    const key = `mycampus_onboarding_v1_${userId}`;
    if (localStorage.getItem(key)) return; // Ya vio el tour

    this._step = 0;
    // Reposicionado en vivo (adaptabilidad móvil, 2026-07-21): rotar el móvil
    // o redimensionar dejaba tooltip y spotlight donde estaban. Se re-muestra
    // el paso actual; los listeners solo viven durante el tour (_done los
    // retira — es el punto único de salida: skip, click en overlay y el
    // "Empezar" final pasan todos por él).
    this._onResize = () => this._updateStep();
    window.addEventListener('resize', this._onResize);
    window.addEventListener('orientationchange', this._onResize);
    this._render();
    this._show();
  },

  _done() {
    // Retirar los listeners de reposicionado (el guard de removeEventListener
    // cubre el arnés, cuyo mock de window solo tiene addEventListener).
    if (this._onResize && typeof window.removeEventListener === 'function') {
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('orientationchange', this._onResize);
    }
    this._onResize = null;
    // Si el tour abrió el drawer móvil para señalar el sidebar, cerrarlo al
    // salir — siempre vía el único punto de verdad (regla _setDrawerOpen).
    if (typeof App !== 'undefined' && App._setDrawerOpen) App._setDrawerOpen(false);
    // _hide() primero: si setItem revienta (quota llena, modo privado), el
    // tour debe cerrarse igualmente — peor repetirlo mañana que dejarlo
    // pegado en pantalla hoy.
    this._hide();
    try {
      localStorage.setItem(`mycampus_onboarding_v1_${this._userId}`, '1');
    } catch (e) {}
  },

  /* ===== RENDER ===== */
  _render() {
    if (document.getElementById('onboarding-overlay')) return;

    document.body.insertAdjacentHTML('beforeend', `
      <div id="onboarding-overlay"></div>
      <div id="onboarding-highlight"></div>
      <div id="onboarding-tooltip">
        <div class="ob-header">
          <span class="ob-step-count" id="obStepCount"></span>
          <button class="ob-skip" id="obSkip">${i18n.t('onboarding_skip')}</button>
        </div>
        <h3 class="ob-title" id="obTitle"></h3>
        <p class="ob-text" id="obText"></p>
        <div class="ob-footer">
          <div class="ob-dots" id="obDots"></div>
          <button class="ob-btn-next" id="obNext"></button>
        </div>
      </div>
    `);

    document.getElementById('obSkip').addEventListener('click', () => this._done());
    document.getElementById('obNext').addEventListener('click', () => this._nextStep());
    document.getElementById('onboarding-overlay').addEventListener('click', () => this._done());
  },

  _show() {
    document.getElementById('onboarding-overlay').style.display = 'block';
    document.getElementById('onboarding-tooltip').style.display = 'block';
    this._updateStep();
  },

  _hide() {
    const overlay = document.getElementById('onboarding-overlay');
    const tooltip = document.getElementById('onboarding-tooltip');
    const highlight = document.getElementById('onboarding-highlight');
    if (overlay) overlay.style.display = 'none';
    if (tooltip) tooltip.style.display = 'none';
    if (highlight) highlight.style.display = 'none';
  },

  _nextStep() {
    this._step++;
    if (this._step >= ONBOARDING_STEPS.length) {
      this._done();
      return;
    }
    this._updateStep();
  },

  _updateStep() {
    const step = ONBOARDING_STEPS[this._step];
    const isLast = this._step === ONBOARDING_STEPS.length - 1;
    const total = ONBOARDING_STEPS.length;

    // Contenido
    document.getElementById('obStepCount').textContent = this._step === 0 ? '' : `${this._step} / ${total - 1}`;
    document.getElementById('obTitle').textContent = step.title[i18n.lang];
    document.getElementById('obText').textContent = step.text[i18n.lang];
    document.getElementById('obNext').textContent = isLast ? i18n.t('onboarding_start') : i18n.t('onboarding_next');

    // Dots
    const dots = document.getElementById('obDots');
    dots.innerHTML = ONBOARDING_STEPS.map((_, i) =>
      `<span class="ob-dot ${i === this._step ? 'active' : ''}"></span>`
    ).join('');

    // Drawer móvil (2026-07-21): los pasos que señalan ítems del sidebar solo
    // se ven en móvil con el drawer abierto — abrirlo ANTES de medir y
    // posicionar. _setDrawerOpen es idempotente: entre pasos consecutivos del
    // sidebar el drawer no parpadea. Para el paso centrado (bienvenida) y al
    // volver a un paso no-sidebar, se cierra. Guards: App puede no existir en
    // el arnés y matchMedia tampoco (patrón del carrusel en app.js).
    const targetEl = step.target ? document.querySelector(step.target) : null;
    const inSidebar = !!(targetEl && typeof targetEl.closest === 'function'
      && targetEl.closest('#sidebar'));
    const isMobile = typeof matchMedia === 'function'
      && matchMedia('(max-width: 768px)').matches;
    let drawerJustOpened = false;
    if (typeof App !== 'undefined' && App._setDrawerOpen) {
      if (inSidebar && isMobile) {
        // Solo si aún no está abierto: _setDrawerOpen(true) roba el foco al
        // primer .nav-item en cada llamada — repetirla en cada paso del
        // sidebar se lo quitaría al botón Siguiente entre paso y paso.
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList && !sidebar.classList.contains('mobile-open')) {
          drawerJustOpened = true;
          App._setDrawerOpen(true);
        }
      } else {
        App._setDrawerOpen(false);
      }
    }

    // Posicionar. Si el drawer se ACABA de abrir, su transform (0.2s) aún no
    // ha llegado: getBoundingClientRect daría el nav-item fuera de pantalla y
    // la red de seguridad degradaría el paso a centrado. Se espera a que
    // asiente con setTimeout (regla del repo: nada de transitionend); con
    // reduced-motion la transición es ~0 pero el primer recálculo de estilo
    // puede no haber ocurrido aún — 50ms garantizan un frame pintado.
    const position = () => {
      const tooltip = document.getElementById('onboarding-tooltip');
      if (!tooltip || tooltip.style.display === 'none') return; // el tour se cerró durante la espera
      const s = ONBOARDING_STEPS[this._step];
      if (!s) return;
      if (s.target) this._positionOnTarget(s);
      else this._positionCenter();
    };
    if (drawerJustOpened) {
      const reduced = typeof matchMedia === 'function'
        && matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(position, reduced ? 50 : 250);
    } else {
      position();
    }
  },

  _positionCenter() {
    const highlight = document.getElementById('onboarding-highlight');
    const tooltip = document.getElementById('onboarding-tooltip');
    highlight.style.display = 'none';

    // Clamp real (2026-07-21): los 340px fijos desbordaban en viewports
    // <372px. Ancho primero, alto DESPUÉS (offsetHeight depende del ancho
    // aplicado y del contenido ya asignado en _updateStep).
    const tw = Math.min(340, window.innerWidth - 32);
    tooltip.style.width = `${tw}px`;
    const th = tooltip.offsetHeight || 200; // 0 solo en el arnés mockeado
    tooltip.style.left = `${Math.max(16, (window.innerWidth - tw) / 2)}px`;
    tooltip.style.top = `${Math.max(16, (window.innerHeight - th) / 2)}px`;
  },

  _positionOnTarget(step) {
    const el = document.querySelector(step.target);
    if (!el) { this._positionCenter(); return; }

    const rect = el.getBoundingClientRect();
    // Red de seguridad (2026-07-21): si el target queda completamente fuera
    // del viewport incluso tras abrir el drawer (o mide 0×0 por estar
    // oculto), degradar a tooltip centrado sin spotlight en vez de señalar
    // al vacío (_positionCenter ya oculta el highlight).
    const offViewport = rect.bottom <= 0 || rect.top >= window.innerHeight
      || rect.right <= 0 || rect.left >= window.innerWidth
      || (rect.width === 0 && rect.height === 0);
    if (offViewport) { this._positionCenter(); return; }

    const highlight = document.getElementById('onboarding-highlight');
    const tooltip = document.getElementById('onboarding-tooltip');
    const pad = 6;

    // Posicionar highlight sobre el elemento
    highlight.style.display = 'block';
    highlight.style.top    = `${rect.top - pad}px`;
    highlight.style.left   = `${rect.left - pad}px`;
    highlight.style.width  = `${rect.width + pad * 2}px`;
    highlight.style.height = `${rect.height + pad * 2}px`;

    // Tooltip junto al target. Clamp real (2026-07-21): ancho contra el
    // viewport, y el alto se mide (offsetHeight, con el contenido y el
    // ancho ya aplicados) en vez del 220 mágico de antes.
    const tw = Math.min(300, window.innerWidth - 32);
    tooltip.style.width = `${tw}px`;
    const th = tooltip.offsetHeight || 220; // 0 solo en el arnés mockeado

    // Tres colocaciones, en orden de preferencia: derecha, izquierda, y —
    // cuando no cabe a ningún lado (móvil: el drawer ocupa casi todo el
    // ancho) — DEBAJO del target, o encima si no queda alto. Antes el flip
    // derecha/izquierda acababa clampado ENCIMA del propio target (91% del
    // spotlight tapado a 412px): el usuario no veía qué módulo se le estaba
    // señalando.
    const fitsRight = rect.right + 20 + tw <= window.innerWidth - 16;
    const fitsLeft  = rect.left - tw - 20 >= 16;
    let left, top;
    if (fitsRight) {
      left = rect.right + 20;
      top  = rect.top + rect.height / 2 - 80;
    } else if (fitsLeft) {
      left = rect.left - tw - 20;
      top  = rect.top + rect.height / 2 - 80;
    } else {
      left = rect.left;
      top  = rect.bottom + pad + 12;
      if (top + th > window.innerHeight - 16) {
        top = rect.top - pad - th - 12; // encima si no cabe debajo
      }
    }
    // Clamp final en ambos ejes: el tooltip ENTERO (botón Siguiente
    // incluido) queda dentro del viewport, con margen mínimo de 16px.
    left = Math.max(16, Math.min(left, window.innerWidth - tw - 16));
    top  = Math.max(16, Math.min(top, window.innerHeight - th - 16));

    tooltip.style.left  = `${left}px`;
    tooltip.style.top   = `${top}px`;
  },
};
