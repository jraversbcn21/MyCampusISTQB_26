/* ===================================================
   MyCampus ISTQB — Onboarding Tour
   =================================================== */

const ONBOARDING_STEPS = [
  {
    target: null,
    title: '¡Bienvenido a MyCampus! 🎓',
    text: 'Tu plataforma de preparación para ISTQB Foundation Level v4.0. Te mostramos los módulos disponibles en menos de un minuto.',
    position: 'center',
  },
  {
    target: '[data-view="dashboard"]',
    title: '📊 Dashboard',
    text: 'Tu panel principal. Aquí ves tus estadísticas, el reto diario y tu nivel de preparación para el examen.',
    position: 'right',
  },
  {
    target: '[data-view="curriculum"]',
    title: '📚 Curriculum',
    text: '6 capítulos completos del temario ISTQB FL v4.0 con lecciones detalladas y seguimiento de progreso.',
    position: 'right',
  },
  {
    target: '[data-view="flashcards"]',
    title: '🃏 Flashcards',
    text: 'Repasa conceptos clave con tarjetas interactivas. Califica cada una como fácil, normal o difícil.',
    position: 'right',
  },
  {
    target: '[data-view="simulator"]',
    title: '📝 Simulacros',
    text: 'Practica con exámenes tipo ISTQB: examen completo (40 preguntas), rápido (20) o por capítulo.',
    position: 'right',
  },
  {
    target: '[data-view="glossary"]',
    title: '📖 Glosario',
    text: 'Todos los términos y definiciones del estándar ISTQB, con búsqueda instantánea.',
    position: 'right',
  },
  {
    target: '[data-view="progress"]',
    title: '📈 Progreso',
    text: 'Gráficas de rendimiento, historial de exámenes y registro de toda tu actividad.',
    position: 'right',
  },
  {
    target: '[data-view="achievements"]',
    title: '🏆 Logros',
    text: 'Desbloquea insignias y acumula XP completando lecciones, exámenes y rachas de estudio.',
    position: 'right',
  },
];

const Onboarding = {
  _step: 0,
  _userId: null,

  /* ===== PUBLIC ===== */
  start(userId) {
    this._userId = userId;
    const key = `mycampus_onboarding_v1_${userId}`;
    if (localStorage.getItem(key)) return; // Ya vio el tour

    this._step = 0;
    this._render();
    this._show();
  },

  _done() {
    localStorage.setItem(`mycampus_onboarding_v1_${this._userId}`, '1');
    this._hide();
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
          <button class="ob-skip" id="obSkip">Saltar tour</button>
        </div>
        <h3 class="ob-title" id="obTitle"></h3>
        <p class="ob-text" id="obText"></p>
        <div class="ob-footer">
          <div class="ob-dots" id="obDots"></div>
          <button class="ob-btn-next" id="obNext">Siguiente</button>
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
    document.getElementById('obTitle').textContent = step.title;
    document.getElementById('obText').textContent = step.text;
    document.getElementById('obNext').textContent = isLast ? '¡Comenzar! 🚀' : 'Siguiente →';

    // Dots
    const dots = document.getElementById('obDots');
    dots.innerHTML = ONBOARDING_STEPS.map((_, i) =>
      `<span class="ob-dot ${i === this._step ? 'active' : ''}"></span>`
    ).join('');

    // Posicionar
    if (step.target) {
      this._positionOnTarget(step);
    } else {
      this._positionCenter();
    }
  },

  _positionCenter() {
    const highlight = document.getElementById('onboarding-highlight');
    const tooltip = document.getElementById('onboarding-tooltip');
    highlight.style.display = 'none';

    const tw = 340;
    const th = tooltip.offsetHeight || 200;
    tooltip.style.left = `${(window.innerWidth - tw) / 2}px`;
    tooltip.style.top = `${(window.innerHeight - th) / 2}px`;
    tooltip.style.width = `${tw}px`;
  },

  _positionOnTarget(step) {
    const el = document.querySelector(step.target);
    if (!el) { this._positionCenter(); return; }

    const rect = el.getBoundingClientRect();
    const highlight = document.getElementById('onboarding-highlight');
    const tooltip = document.getElementById('onboarding-tooltip');
    const pad = 6;

    // Posicionar highlight sobre el elemento
    highlight.style.display = 'block';
    highlight.style.top    = `${rect.top - pad}px`;
    highlight.style.left   = `${rect.left - pad}px`;
    highlight.style.width  = `${rect.width + pad * 2}px`;
    highlight.style.height = `${rect.height + pad * 2}px`;

    // Posicionar tooltip a la derecha
    const tw = 300;
    let left = rect.right + 20;
    let top  = rect.top + rect.height / 2 - 80;

    // Si se sale por la derecha, ponerlo a la izquierda
    if (left + tw > window.innerWidth - 16) {
      left = rect.left - tw - 20;
    }
    // Ajuste vertical
    top = Math.max(16, Math.min(top, window.innerHeight - 220));

    tooltip.style.left  = `${left}px`;
    tooltip.style.top   = `${top}px`;
    tooltip.style.width = `${tw}px`;
  },
};
