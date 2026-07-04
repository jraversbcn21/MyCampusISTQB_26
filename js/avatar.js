/* ===================================================
   MyCampus ISTQB — Avatar Selector (Tester Profiles)
   =================================================== */

const AVATARS = [
  {
    id: 'meticuloso',
    emoji: '🧐',
    name: { es: 'El Meticuloso', en: 'The Meticulous One' },
    badge: { es: 'Validación profunda', en: 'Deep validation' },
    color: '#6C63FF',
    desc: {
      es: 'Se toma su tiempo y revisa cada detalle como si fuera crítico. Puede parecer lento, pero detecta defectos sutiles que otros pasan por alto. Es clave en fases de validación profunda y pruebas de regresión complejas.',
      en: "Takes their time and reviews every detail as if it were critical. May seem slow, but catches subtle defects others miss. Key during deep validation phases and complex regression testing."
    },
  },
  {
    id: 'tenaz',
    emoji: '🦊',
    name: { es: 'El Tenaz', en: 'The Tenacious One' },
    badge: { es: 'Bugs difíciles', en: 'Tough bugs' },
    color: '#FF6B35',
    desc: {
      es: 'No suelta un bug hasta entenderlo completamente. Reproduce errores difíciles, insiste donde otros abandonan y documenta con precisión. Es ideal para issues intermitentes o difíciles de replicar.',
      en: "Won't let go of a bug until they fully understand it. Reproduces hard-to-catch errors, keeps pushing where others give up, and documents with precision. Ideal for intermittent or hard-to-reproduce issues."
    },
  },
  {
    id: 'explorador',
    emoji: '🧭',
    name: { es: 'El Explorador', en: 'The Explorer' },
    badge: { es: 'Testing creativo', en: 'Creative testing' },
    color: '#00C896',
    desc: {
      es: 'Disfruta el testing no estructurado. Navega el sistema de forma creativa, buscando comportamientos inesperados. Es excelente encontrando bugs fuera de los casos de prueba tradicionales.',
      en: "Enjoys unstructured testing. Navigates the system creatively, looking for unexpected behavior. Excellent at finding bugs outside traditional test cases."
    },
  },
  {
    id: 'esceptico',
    emoji: '🦉',
    name: { es: 'El Escéptico', en: 'The Skeptic' },
    badge: { es: 'Prevención de errores', en: 'Error prevention' },
    color: '#9B59B6',
    desc: {
      es: 'No confía en nada hasta probarlo. Cuestiona requisitos, valida supuestos y desafía implementaciones. Ayuda a prevenir errores conceptuales antes de que lleguen a producción.',
      en: "Trusts nothing until it's proven. Questions requirements, validates assumptions, and challenges implementations. Helps prevent conceptual errors before they reach production."
    },
  },
  {
    id: 'automatizador',
    emoji: '🤖',
    name: { es: 'El Automatizador', en: 'The Automator' },
    badge: { es: 'Eficiencia y escala', en: 'Efficiency at scale' },
    color: '#00B4D8',
    desc: {
      es: 'Piensa en términos de eficiencia y repetibilidad. Busca constantemente qué se puede automatizar y cómo optimizar los pipelines de testing. Reduce esfuerzo manual y mejora cobertura a largo plazo.',
      en: "Thinks in terms of efficiency and repeatability. Constantly looks for what can be automated and how to optimize testing pipelines. Reduces manual effort and improves coverage over time."
    },
  },
  {
    id: 'empatico',
    emoji: '🌟',
    name: { es: 'El Usuario Empático', en: 'The Empathetic User' },
    badge: { es: 'Visión del usuario', en: 'User perspective' },
    color: '#FF9F43',
    desc: {
      es: 'Se pone en la piel del usuario final. Detecta problemas de usabilidad, flujos confusos y errores que afectan la experiencia. Aporta una visión más humana al proceso de calidad.',
      en: "Puts themselves in the end user's shoes. Spots usability issues, confusing flows, and errors that affect the experience. Brings a more human perspective to the quality process."
    },
  },
];

const AvatarSelector = {
  _userId: null,
  _pendingId: null,

  /* ===== INIT ===== */
  init(userId) {
    this._userId = userId;

    // Aplicar avatar guardado (si hay)
    const saved = this._getSavedId();
    if (saved) this._applyToSidebar(AVATARS.find(a => a.id === saved));

    // Click en el avatar del sidebar abre el modal
    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl) {
      avatarEl.style.cursor = 'pointer';
      avatarEl.title = i18n.t('change_avatar_title');
      avatarEl.addEventListener('click', () => this.openModal());
    }

    // Edición inline del nombre
    this._setupNameEdit();

    // Botones del modal
    document.getElementById('avatarModalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('avatarCancel').addEventListener('click', () => this.closeModal());
    document.getElementById('avatarSave').addEventListener('click', () => this._save());
  },

  /* ===== NAME EDIT ===== */
  _setupNameEdit() {
    const nameEl = document.getElementById('userName');
    if (!nameEl) return;

    // Agregar icono de edición justo al lado del nombre
    if (!nameEl.parentElement.querySelector('.name-edit-btn')) {
      const btn = document.createElement('button');
      btn.className = 'name-edit-btn';
      btn.innerHTML = '✏️';
      btn.title = i18n.t('edit_name_title');
      nameEl.insertAdjacentElement('afterend', btn);
      btn.addEventListener('click', (e) => { e.stopPropagation(); this._openNameEdit(); });
    }
  },

  _openNameEdit() {
    const nameEl = document.getElementById('userName');
    if (!nameEl || nameEl.tagName === 'INPUT') return;

    const currentName = nameEl.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'name-edit-input';
    input.maxLength = 30;

    nameEl.replaceWith(input);
    input.focus();
    input.select();

    const commit = () => {
      const newName = input.value.trim() || currentName;
      localStorage.setItem(`mycampus_displayname_${this._userId}`, newName);

      const span = document.createElement('span');
      span.className = 'user-name';
      span.id = 'userName';
      span.textContent = newName;
      input.replaceWith(span);
      this._setupNameEdit(); // re-bind edit button
    };

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
      if (e.key === 'Escape') { input.value = currentName; input.blur(); }
    });
  },

  /* ===== MODAL ===== */
  openModal() {
    this._pendingId = this._getSavedId();
    this._renderGrid();
    document.getElementById('avatar-modal').style.display = 'flex';
  },

  closeModal() {
    document.getElementById('avatar-modal').style.display = 'none';
    this._pendingId = null;
  },

  _renderGrid() {
    const grid = document.getElementById('avatarGrid');
    grid.innerHTML = AVATARS.map(a => `
      <div class="av-card ${this._pendingId === a.id ? 'selected' : ''}" data-id="${a.id}"
           style="--av-color: ${a.color}">
        <div class="av-emoji">${a.emoji}</div>
        <div class="av-info">
          <div class="av-name">${a.name[i18n.lang]}</div>
          <div class="av-badge">${a.badge[i18n.lang]}</div>
          <div class="av-desc">${a.desc[i18n.lang]}</div>
        </div>
        <div class="av-check">✓</div>
      </div>
    `).join('');

    grid.querySelectorAll('.av-card').forEach(card => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.av-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this._pendingId = card.dataset.id;
      });
    });
  },

  _save() {
    if (!this._pendingId) { this.closeModal(); return; }
    localStorage.setItem(`mycampus_avatar_${this._userId}`, this._pendingId);
    const avatar = AVATARS.find(a => a.id === this._pendingId);
    this._applyToSidebar(avatar);
    this.closeModal();
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast(`Avatar: ${avatar.name[i18n.lang]} 🎭`, 'success');
    }
  },

  /* ===== SIDEBAR ===== */
  _applyToSidebar(avatar) {
    if (!avatar) return;
    const el = document.getElementById('userAvatar');
    if (!el) return;
    el.innerHTML = `<span style="font-size:1.7rem;line-height:1">${avatar.emoji}</span>`;
    el.style.background = avatar.color + '22';
    el.style.border = `2px solid ${avatar.color}55`;
    el.style.borderRadius = '50%';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
  },

  /* ===== HELPERS ===== */
  _getSavedId() {
    return localStorage.getItem(`mycampus_avatar_${this._userId}`) || null;
  },

  getCurrentAvatar() {
    const id = this._getSavedId();
    return id ? AVATARS.find(a => a.id === id) : null;
  },
};
