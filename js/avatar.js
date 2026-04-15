/* ===================================================
   MyCampus ISTQB — Avatar Selector (Tester Profiles)
   =================================================== */

const AVATARS = [
  {
    id: 'meticuloso',
    emoji: '🧐',
    name: 'El Meticuloso',
    badge: 'Validación profunda',
    color: '#6C63FF',
    desc: 'Se toma su tiempo y revisa cada detalle como si fuera crítico. Puede parecer lento, pero detecta defectos sutiles que otros pasan por alto. Es clave en fases de validación profunda y pruebas de regresión complejas.',
  },
  {
    id: 'tenaz',
    emoji: '🦊',
    name: 'El Tenaz',
    badge: 'Bugs difíciles',
    color: '#FF6B35',
    desc: 'No suelta un bug hasta entenderlo completamente. Reproduce errores difíciles, insiste donde otros abandonan y documenta con precisión. Es ideal para issues intermitentes o difíciles de replicar.',
  },
  {
    id: 'explorador',
    emoji: '🧭',
    name: 'El Explorador',
    badge: 'Testing creativo',
    color: '#00C896',
    desc: 'Disfruta el testing no estructurado. Navega el sistema de forma creativa, buscando comportamientos inesperados. Es excelente encontrando bugs fuera de los casos de prueba tradicionales.',
  },
  {
    id: 'esceptico',
    emoji: '🦉',
    name: 'El Escéptico',
    badge: 'Prevención de errores',
    color: '#9B59B6',
    desc: 'No confía en nada hasta probarlo. Cuestiona requisitos, valida supuestos y desafía implementaciones. Ayuda a prevenir errores conceptuales antes de que lleguen a producción.',
  },
  {
    id: 'automatizador',
    emoji: '🤖',
    name: 'El Automatizador',
    badge: 'Eficiencia y escala',
    color: '#00B4D8',
    desc: 'Piensa en términos de eficiencia y repetibilidad. Busca constantemente qué se puede automatizar y cómo optimizar los pipelines de testing. Reduce esfuerzo manual y mejora cobertura a largo plazo.',
  },
  {
    id: 'empatico',
    emoji: '🌟',
    name: 'El Usuario Empático',
    badge: 'Visión del usuario',
    color: '#FF9F43',
    desc: 'Se pone en la piel del usuario final. Detecta problemas de usabilidad, flujos confusos y errores que afectan la experiencia. Aporta una visión más humana al proceso de calidad.',
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
      avatarEl.title = 'Cambiar avatar';
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
      btn.title = 'Editar nombre';
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
          <div class="av-name">${a.name}</div>
          <div class="av-badge">${a.badge}</div>
          <div class="av-desc">${a.desc}</div>
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
      App.showToast(`Avatar: ${avatar.name} 🎭`, 'success');
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
