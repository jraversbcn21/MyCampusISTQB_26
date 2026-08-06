/* ===================================================
   MyCampus ISTQB — Main Application Controller
   =================================================== */

const App = {
  state: null,
  _initialized: false,
  currentView: 'dashboard',
  currentLesson: null,
  // Exam state
  examQuestions: [],
  examAnswers: {},
  examCurrentQ: 0,
  examType: 'full',
  examTimer: null,
  examTimeLeft: 0,
  examTimeTotal: 0,
  examReviewing: false,
  examChapterId: null,
  _examActive: false,
  // Flashcard state
  fcCards: [],
  fcIndex: 0,
  fcFlipped: false,
  fcStats: { hard: 0, ok: 0, easy: 0 },
  fcReviewed: new Set(),
  _fcAnimating: false,
  // Global search
  _gsQuery: '',
  _gsGlossary: [],
  _gsContent: [],
  _gsExpanded: null,
  _gsItems: [],
  _gsActive: -1,

  /* ===== STATE MANAGEMENT ===== */
  loadState() {
    try {
      const key = `mycampus_istqb_v1_${window.CAMPUS_USER_ID || 'default'}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      xp: 0,
      lessonsCompleted: 0,
      completedLessons: [],
      flashcardsReviewed: 0,
      examsCompleted: 0,
      bestScore: 0,
      streak: 0,
      lastStudyDate: null,
      achievements: [],
      examHistory: [],
      chapterProgress: {},
      chapterQuizPassed: {},
      glossarySearches: 0,
      activityLog: [],
      dailyChallengeDate: null,
      dailyChallengeCompleted: false,
      celebratedChapters: [],
      diplomaShown: false,
    };
  },

  saveState() {
    const userId = window.CAMPUS_USER_ID;
    if (typeof Sync !== 'undefined' && userId) {
      Sync.saveState(userId, this.state);
    } else {
      try {
        localStorage.setItem(`mycampus_istqb_v1_${userId || 'default'}`, JSON.stringify(this.state));
      } catch (e) {}
    }
  },

  addXP(amount, label) {
    const oldXP = this.state.xp;
    this.state.xp += amount;
    this.saveState();
    this.showXPPopup(`+${amount} XP`);
    this.addActivity(`${label}`, amount);

    const oldLvl = Gamification.getLevel(oldXP);
    const newLvl = Gamification.getLevel(this.state.xp);
    if (newLvl.level > oldLvl.level) {
      this.showToast(`🎉 ${i18n.t('level_up')} ${newLvl.icon} ${newLvl.name[i18n.lang]}`, 'success');
    }

    this.updateStreakAndDate();
    this.checkAchievements();
    this.updateSidebar();
  },

  updateStreakAndDate() {
    const today = new Date().toDateString();
    if (this.state.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (this.state.lastStudyDate === yesterday.toDateString()) {
        this.state.streak++;
      } else if (this.state.lastStudyDate !== today) {
        this.state.streak = 1;
      }
      this.state.lastStudyDate = today;
      this.saveState();
    }
  },

  addActivity(text, xp) {
    this.state.activityLog.unshift({
      text, xp,
      time: new Date().toLocaleString(i18n.t('date_locale'), { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    });
    if (this.state.activityLog.length > 20) this.state.activityLog.pop();
    this.saveState();
  },

  checkAchievements() {
    Gamification.checkAchievements(this.state, (ach) => {
      this.state.xp += ach.xp;
      this.showToast(`🏆 ${i18n.t('achievement_toast_prefix')}: ${ach.name[i18n.lang]} (+${ach.xp} XP)`, 'success');
      this.saveState();
    });
  },

  /* ===== NAVIGATION ===== */
  navigate(view, extra) {
    this._setExamActive(false);
    this.currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const viewEl = document.getElementById(`view-${view}`);
    if (viewEl) viewEl.classList.add('active');

    const navEl = document.querySelector(`[data-view="${view}"]`);
    if (navEl) navEl.classList.add('active');

    const titleMap = {
      dashboard: 'nav_dashboard', curriculum: 'nav_curriculum',
      flashcards: 'nav_flashcards', simulator: 'nav_simulator',
      glossary: 'nav_glossary', progress: 'nav_progress',
      achievements: 'nav_achievements', ranking: 'nav_ranking', lesson: 'nav_curriculum'
    };
    document.getElementById('pageTitle').textContent = i18n.t(titleMap[view] || view);

    // Cierra el drawer móvil — siempre vía el único punto de verdad (2026-07-21)
    this._setDrawerOpen(false);

    if (view === 'dashboard') this.renderDashboard();
    if (view === 'curriculum') this.renderCurriculum();
    if (view === 'flashcards') this.initFlashcards();
    if (view === 'simulator') this.renderSimulatorMenu();
    if (view === 'glossary') this.renderGlossary();
    if (view === 'progress') this.renderProgress();
    if (view === 'achievements') this.renderAchievements();
    if (view === 'ranking') this.renderRanking();
    if (view === 'lesson' && this.currentLesson) {
      this.renderLesson(this.currentLesson.chapterId, this.currentLesson.topicId);
    }

    this._saveCurrentView(view);
  },

  navigateToLesson(chapterId, topicId) {
    this.currentView = 'lesson';
    this.currentLesson = { chapterId, topicId };
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-lesson').classList.add('active');
    document.getElementById('pageTitle').textContent = i18n.t('nav_curriculum');
    if (!this._expandedChapters) this._expandedChapters = new Set();
    this._expandedChapters.add(chapterId);
    this.renderLesson(chapterId, topicId);
    this._saveCurrentView('lesson');
  },

  // Nombre visible del alumno: localStorage > metadata de Auth > prefijo del
  // email > fallback i18n. Extraído de updateSidebar (2026-07-25) para
  // reutilizarlo en el diploma sin duplicar la resolución.
  _getDisplayName() {
    if (typeof Auth !== 'undefined' && Auth.user) {
      const uid = Auth.user.id;
      const saved = localStorage.getItem(`mycampus_displayname_${uid}`);
      if (saved) return saved;
      const meta = Auth.user.user_metadata || {};
      return meta.full_name || meta.name || Auth.user.email?.split('@')[0] || i18n.t('student_fallback');
    }
    return i18n.t('student_fallback');
  },

  /* ===== SIDEBAR ===== */
  updateSidebar() {
    const lvl = Gamification.getLevel(this.state.xp);
    const progress = Gamification.getLevelProgress(this.state.xp);
    const displayName = this._getDisplayName();
    document.getElementById('userName').textContent = displayName;
    document.getElementById('userLevel').textContent = `${i18n.t('level_label')} ${lvl.level} · ${lvl.name[i18n.lang]}`;
    document.getElementById('xpFillSmall').style.width = progress + '%';
    document.getElementById('xpText').textContent = `${this.state.xp} XP`;
    document.getElementById('streakCount').textContent = this.state.streak;
    // Avatar: solo poner icono de nivel si no hay avatar personalizado
    if (typeof AvatarSelector === 'undefined' || !AvatarSelector.getCurrentAvatar()) {
      document.getElementById('userAvatar').textContent = lvl.icon;
    }

    // Update stats
    document.getElementById('statXP').textContent = this.state.xp + ' XP';
    document.getElementById('statExams').textContent = this.state.examsCompleted;
    document.getElementById('statFlashcards').textContent = this.state.flashcardsReviewed;

    const total = CHAPTERS.reduce((a, c) => a + c.topics.length, 0);
    const done = this.state.completedLessons.length;
    document.getElementById('statTopics').textContent = `${done}/${total}`;
    document.getElementById('statTopicsFill').style.width = (done / total * 100) + '%';
  },

  /* ===== DASHBOARD ===== */
  renderDashboard() {
    this.renderContinueStudying();
    this.renderDailyChallenge();
    this.renderReadiness();
    this.renderRecentAchievements();
  },

  renderContinueStudying() {
    const container = document.getElementById('continueStudying');
    const colors = ["#6C63FF","#00D2FF","#FF6B6B","#FFC107","#4CAF50","#9C27B0"];
    const html = CHAPTERS.map((ch, i) => {
      const done = ch.topics.filter(t => this.state.completedLessons.includes(t.id)).length;
      const pct = Math.round((done / ch.topics.length) * 100);
      return `
        <div class="continue-item" onclick="App.navigate('curriculum')" role="button" tabindex="0">
          <div class="continue-item-icon">${ch.icon}</div>
          <div style="flex:1;min-width:0">
            <div class="continue-item-title">${ch.title[i18n.lang]}</div>
            <div class="continue-item-sub">${done}/${ch.topics.length} ${i18n.t('topics_label')} · ${ch.duration[i18n.lang]}</div>
            <div class="continue-item-progress">
              <div class="continue-item-fill" style="width:${pct}%;background:${colors[i]}"></div>
            </div>
          </div>
          <span style="color:var(--text2);font-weight:700">${pct}%</span>
        </div>`;
    }).join('');
    container.innerHTML = html;
  },

  renderDailyChallenge() {
    const container = document.getElementById('dailyChallenge');
    const today = new Date().toDateString();
    const isDone = this.state.dailyChallengeDate === today && this.state.dailyChallengeCompleted;

    if (isDone) {
      container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--success-text)">${this._icon('check-circle')} ${i18n.t('challenge_completed_today')}</div>`;
      return;
    }

    const seed = new Date().getDate() + new Date().getMonth() * 31;
    const q = QUESTIONS[seed % QUESTIONS.length];
    const lang = i18n.lang;
    const letters = ['A', 'B', 'C', 'D'];

    // La respuesta correcta se queda en memoria (_dailyQuestion), no en el
    // atributo onclick — incrustarla en el DOM la dejaba legible con
    // "inspeccionar elemento" antes de responder.
    this._dailyQuestion = q;
    container.innerHTML = `
      <div class="dc-question">${q.q[lang]}</div>
      <div class="dc-options" id="dcOptions">
        ${q.options[lang].map((opt, i) => `
          <div class="dc-option" onclick="App.answerDailyChallenge(${i})" id="dcOpt${i}" role="button" tabindex="0">
            <span class="dc-label">${letters[i]}</span>${opt}
          </div>`).join('')}
      </div>`;
  },

  answerDailyChallenge(selected) {
    if (!this._dailyQuestion) return;
    const correct = this._dailyQuestion.correct;
    const opts = document.querySelectorAll('.dc-option');
    opts.forEach((o, i) => {
      o.onclick = null;
      if (i === correct) o.classList.add('correct');
      else if (i === selected && selected !== correct) o.classList.add('wrong');
    });
    const today = new Date().toDateString();
    this.state.dailyChallengeDate = today;
    this.state.dailyChallengeCompleted = true;
    this.saveState();
    if (selected === correct) {
      this.addXP(20, i18n.t('daily_challenge_completed_activity'));
    }
  },

  renderReadiness() {
    const totalLessons = CHAPTERS.reduce((a, c) => a + c.topics.length, 0);
    const done = this.state.completedLessons.length;
    const chPct = Math.round((done / totalLessons) * 100);

    const avgScore = this.state.examHistory.length > 0
      ? Math.round(this.state.examHistory.reduce((a, e) => a + e.score, 0) / this.state.examHistory.length)
      : 0;

    const fcPct = this.state.flashcardsReviewed;
    const readiness = Math.round((chPct * 0.5) + (avgScore * 0.35) + (Math.min(100, fcPct) * 0.15));

    const circle = document.getElementById('readinessCircle');
    const circumference = 2 * Math.PI * 40;
    const dash = (readiness / 100) * circumference;
    circle.style.strokeDasharray = `${dash} ${circumference}`;

    document.getElementById('readinessPercent').textContent = readiness + '%';
    document.getElementById('rChapters').textContent = `${done}/${totalLessons}`;
    document.getElementById('rScore').textContent = avgScore > 0 ? avgScore + '%' : '-';
    document.getElementById('rFlash').textContent = this.state.flashcardsReviewed;
  },

  renderRecentAchievements() {
    const container = document.getElementById('recentAchievements');
    const unlocked = this.state.achievements || [];
    const recent = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).slice(-6);
    if (recent.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon" aria-hidden="true">🏆</div><p>${i18n.t('no_achievements')}</p></div>`;
      return;
    }
    container.innerHTML = recent.map(a => `
      <div class="achievement-mini-item">
        <span>${a.icon}</span>
        <span>${a.name[i18n.lang]}</span>
      </div>`).join('');
  },

  /* ===== CURRICULUM ===== */
  renderCurriculum() {
    const grid = document.getElementById('chaptersGrid');
    const colors = ["#6C63FF","#00D2FF","#FF6B6B","#FFC107","#4CAF50","#9C27B0"];
    const colorsBg = [
      "rgba(108,99,255,0.15)","rgba(0,210,255,0.12)","rgba(255,107,107,0.12)",
      "rgba(255,193,7,0.12)","rgba(76,175,80,0.12)","rgba(156,39,176,0.12)"
    ];

    grid.innerHTML = CHAPTERS.map((ch, i) => {
      const done = ch.topics.filter(t => this.state.completedLessons.includes(t.id)).length;
      const total = ch.topics.length;
      const pct = Math.round((done / total) * 100);
      const circumference = 2 * Math.PI * 18;
      const dash = (pct / 100) * circumference;

      const topicsHtml = ch.topics.map(t => {
        const isCompleted = this.state.completedLessons.includes(t.id);
        const hasLesson = LESSONS[t.id];
        const statusClass = isCompleted ? 'done' : (hasLesson ? 'in-progress' : 'locked');
        const statusIcon = isCompleted ? this._icon('check') : (hasLesson ? this._icon('play') : this._icon('lock'));
        return `
          <div class="topic-item" ${hasLesson ? `onclick="App.navigateToLesson(${ch.id}, '${t.id}')" role="button" tabindex="0"` : ''}>
            <div class="topic-status ${statusClass}">${statusIcon}</div>
            <span class="topic-title">${t.title[i18n.lang]}</span>
            <span class="topic-xp">+${t.xp} XP</span>
          </div>`;
      }).join('');

      return `
        <div class="chapter-card" id="chapter-${i}">
          <div class="chapter-card-header" onclick="App.toggleChapter(${i})" role="button" tabindex="0" aria-expanded="${this._expandedChapters && this._expandedChapters.has(i) ? 'true' : 'false'}">
            <div class="chapter-number" style="background:${colorsBg[i]};color:${colors[i]}">${i + 1}</div>
            <div class="chapter-info">
              <div class="chapter-title">${ch.icon} ${ch.title[i18n.lang]}</div>
              <div class="chapter-meta">${total} ${i18n.t('topics_label')} · ${ch.duration[i18n.lang]}</div>
              <div class="chapter-meta" style="margin-top:2px;font-size:0.75rem">${ch.description[i18n.lang]}</div>
            </div>
            <div class="chapter-actions">
              <div class="chapter-progress-ring">
                <svg viewBox="0 0 44 44">
                  <circle class="cpring-bg" cx="22" cy="22" r="18"/>
                  <circle class="cpring-fill" cx="22" cy="22" r="18"
                    stroke="${colors[i]}"
                    stroke-dasharray="${dash} ${circumference}"
                    style="transform-origin:50% 50%;transform:rotate(-90deg)"/>
                </svg>
                <span class="cpring-text">${pct}%</span>
              </div>
              <span class="chapter-chevron">${this._icon('chevron-right')}</span>
            </div>
          </div>
          <div class="chapter-topics">
            <div class="topic-list">${topicsHtml}</div>
          </div>
        </div>`;
    }).join('');

    if (this._expandedChapters) {
      this._expandedChapters.forEach(i => {
        const card = document.getElementById(`chapter-${i}`);
        if (card) card.classList.add('open');
      });
    }
  },

  toggleChapter(i) {
    const card = document.getElementById(`chapter-${i}`);
    const isOpen = card.classList.toggle('open');
    const header = card.querySelector('.chapter-card-header');
    if (header) header.setAttribute('aria-expanded', String(isOpen));
    if (!this._expandedChapters) this._expandedChapters = new Set();
    if (isOpen) {
      this._expandedChapters.add(i);
    } else {
      this._expandedChapters.delete(i);
    }
  },

  /* ===== LESSON ===== */
  renderLesson(chapterId, topicId) {
    const ch = CHAPTERS[chapterId];
    const topic = ch.topics.find(t => t.id === topicId);
    const lesson = LESSONS[topicId];
    const lang = i18n.lang;
    const isCompleted = this.state.completedLessons.includes(topicId);

    const completedInCh = ch.topics.filter(t => this.state.completedLessons.includes(t.id)).length;
    const pct = Math.round((completedInCh / ch.topics.length) * 100);
    document.getElementById('lessonProgressFill').style.width = pct + '%';
    document.getElementById('lessonProgressText').textContent = pct + '%';

    const colors = ["#6C63FF","#00D2FF","#FF6B6B","#FFC107","#4CAF50","#9C27B0"];
    const color = colors[chapterId];

    const lessonData = lesson ? lesson[lang] : {
      title: topic.title[lang],
      chapterTag: ch.title[lang],
      content: `<div class="highlight-box">📚 ${i18n.t('lesson_content_wip')}</div>`
    };

    // Siguiente tema del capítulo (2026-07-21). Se deriva de ch.topics —
    // js/content.js no se toca (regla de fidelidad de contenido). Si es el
    // último del capítulo, el primario cierra el capítulo en vez de avanzar.
    const topicIdx = ch.topics.findIndex(t => t.id === topicId);
    const nextTopic = ch.topics[topicIdx + 1] || null;
    const nextLabel = nextTopic
      ? `${i18n.t('lesson_next')}<span class="next-topic-title">: ${escapeHtml(nextTopic.title[lang])}</span> →`
      : i18n.t('lesson_finish_chapter');
    const nextArg = nextTopic ? `'${nextTopic.id}'` : 'null';

    document.getElementById('lessonContainer').innerHTML = `
      <div class="lesson-title">${lessonData.title}</div>
      <div class="lesson-chapter-tag" style="background:rgba(${hexToRgb(color)},0.15);color:${color}">
        ${lessonData.chapterTag}
      </div>
      <div class="lesson-content">${lessonData.content}</div>
      <div class="lesson-actions">
        <button class="lesson-complete-btn ${isCompleted ? 'completed' : ''}"
          onclick="App.completeLesson('${topicId}', ${chapterId}, ${topic.xp})"
          id="completeLessonBtn">
          ${isCompleted ? i18n.t('lesson_completed') : (this._icon('star') + ' ' + i18n.t('lesson_complete') + ` (+${topic.xp} XP)`)}
        </button>
        <button class="lesson-next-btn ${isCompleted ? '' : 'locked'}"
          ${isCompleted ? '' : 'aria-disabled="true"'}
          onclick="App.advanceLesson('${topicId}', ${chapterId}, ${nextArg})"
          id="nextLessonBtn">
          ${nextLabel}
        </button>
      </div>`;
    this._wrapLessonTables();
  },

  // Tablas del contenido ISTQB (2026-07-21): js/content.js no se edita (regla
  // de fidelidad) — el wrapper de scroll se aplica por DOM al inyectar. Cubre
  // las 11 tablas que desbordaban en móvil y cualquier tabla futura.
  _wrapLessonTables() {
    const lc = document.querySelector('.lesson-content');
    if (!lc || typeof lc.querySelectorAll !== 'function') return; // harness mock
    lc.querySelectorAll('table').forEach((t) => {
      if (t.parentElement && t.parentElement.classList
          && t.parentElement.classList.contains('table-scroll')) return;
      const wrap = document.createElement('div');
      wrap.className = 'table-scroll';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
  },

  completeLesson(topicId, chapterId, xp) {
    if (!this.state.completedLessons.includes(topicId)) {
      this.state.completedLessons.push(topicId);
      this.state.lessonsCompleted = this.state.completedLessons.length;
      this.saveState();
      this.addXP(xp, `${i18n.t('lesson_completed_activity')}: ${topicId}`);
      this.checkAchievements();
      const btn = document.getElementById('completeLessonBtn');
      if (btn) {
        btn.textContent = i18n.t('lesson_completed');
        btn.classList.add('completed');
      }
      const nextBtn = document.getElementById('nextLessonBtn');
      if (nextBtn && nextBtn.classList) {
        nextBtn.classList.remove('locked');
        nextBtn.removeAttribute('aria-disabled');
      }
      this._maybeCelebrate(chapterId);
    }
  },

  // Avanzar SOLO navega (revocación 2026-07-21, spec lesson-advance-gating):
  // la semántica original completar-y-avanzar regalaba el XP como efecto
  // colateral y vaciaba de sentido "Marcar como completada". El XP y el
  // completado viven exclusivamente en completeLesson. Guard primero: sin
  // lección marcada, toast warning (patrón del bloqueo de búsqueda en examen,
  // asertivo para AT) y no se navega.
  advanceLesson(topicId, chapterId, nextTopicId) {
    if (!this.state.completedLessons.includes(topicId)) {
      this.showToast(i18n.t('lesson_next_locked_toast'), 'warning');
      return;
    }
    if (nextTopicId) {
      this.navigateToLesson(chapterId, nextTopicId);
    } else {
      this.navigate('curriculum');
    }
    // El scroll al top evita aterrizar a media lección nueva (rama avanzar)
    // o a media pantalla en el listado de capítulos (rama cerrar capítulo).
    // F5 (review final 2026-07-25): behavior: 'auto' explícito — el nuevo
    // `html { scroll-behavior: smooth }` global de la landing (guardado tras
    // reduced-motion) convertiría este salto en una animación no deseada.
    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'auto' });
  },

  /* ===== CELEBRATION (2026-07-25) =====
     Card de módulo completado + diploma de campus. El disparo vive en
     completeLesson (_maybeCelebrate); aquí solo la presentación. Spec:
     docs/superpowers/specs/2026-07-25-chapter-completion-celebration-design.md */

  // Disparo (spec 2026-07-25): al llegar un capítulo al 100%, celebrar UNA vez.
  // Si con él los 6 quedan al 100% → diploma (sustituye a la card del capítulo,
  // nunca dos popups). loadState() no fusiona defaults sobre estados guardados,
  // así que los estados anteriores a la feature llegan sin los campos nuevos —
  // guard de migración aquí, no en loadState (cubre también la copia de la nube).
  _maybeCelebrate(chapterId) {
    if (!Array.isArray(this.state.celebratedChapters)) this.state.celebratedChapters = [];
    if (typeof this.state.diplomaShown !== 'boolean') this.state.diplomaShown = false;
    if (!this._chapterComplete(chapterId)) return;
    if (this.state.celebratedChapters.includes(chapterId)) return;
    this.state.celebratedChapters.push(chapterId);
    const campusDone = CHAPTERS.every((ch, i) => this._chapterComplete(i));
    if (campusDone && !this.state.diplomaShown) {
      this.state.diplomaShown = true;
      this.saveState();
      this._showCelebration('diploma', chapterId);
    } else {
      this.saveState();
      this._showCelebration('chapter', chapterId);
    }
  },

  _chapterComplete(chapterId) {
    const ch = CHAPTERS[chapterId];
    return !!ch && ch.topics.every(t => this.state.completedLessons.includes(t.id));
  },

  // Primer capítulo POSTERIOR con alguna lección pendiente (y con contenido),
  // y su primera lección pendiente. Solo escaneo hacia delante — si todo lo
  // posterior está completo, el CTA cae al curriculum (decisión del spec).
  _nextChapterTarget(chapterId) {
    for (let c = chapterId + 1; c < CHAPTERS.length; c++) {
      const t = CHAPTERS[c].topics.find(
        tp => !this.state.completedLessons.includes(tp.id) && LESSONS[tp.id]);
      if (t) return { chapterId: c, topicId: t.id };
    }
    return null;
  },

  _showCelebration(kind, chapterId) {
    const modal = document.getElementById('celebration-modal');
    const card = document.getElementById('celebrationCard');
    if (!modal || !card) return;
    this._celebrReturnFocusEl = (typeof document.activeElement === 'object') ? document.activeElement : null;
    if (card.classList) card.classList.toggle('diploma', kind === 'diploma');
    card.innerHTML = kind === 'diploma' ? this._diplomaHtml() : this._chapterCardHtml(chapterId);
    modal.style.display = 'flex';
    if (kind === 'diploma') this._spawnConfetti();
    const cta = document.getElementById('celebrCta');
    if (cta && typeof cta.focus === 'function') cta.focus();
  },

  _chapterCardHtml(chapterId) {
    const lang = i18n.lang;
    const target = this._nextChapterTarget(chapterId);
    const steps = CHAPTERS.map((ch, i) => {
      const done = this._chapterComplete(i);
      const cls = done ? ' done' : (target && i === target.chapterId ? ' next' : '');
      return `<div class="celebr-step${cls}" aria-hidden="true">${done ? this._icon('check') : (i + 1)}</div>`;
    }).join('<div class="celebr-link" aria-hidden="true"></div>');
    const ctaLabel = target
      ? i18n.t('celebr_cta_next').replace('{n}', target.chapterId + 1)
      : i18n.t('celebr_cta_curriculum');
    const ctaAction = target
      ? `App._closeCelebration();App.navigateToLesson(${target.chapterId}, '${target.topicId}')`
      : `App._closeCelebration();App.navigate('curriculum')`;
    return `
      <div class="celebr-badge">${i18n.t('celebr_badge').replace('{n}', chapterId + 1)}</div>
      <h2 id="celebrationTitle">${i18n.t('celebr_title')} <span aria-hidden="true">🎉</span></h2>
      <p class="celebr-sub">${i18n.t('celebr_subtitle').replace('{ch}', CHAPTERS[chapterId].title[lang])}</p>
      <div class="celebr-path">${steps}</div>
      <p class="celebr-quote">${i18n.t('celebr_quote_' + chapterId)}</p>
      <button class="celebr-cta" id="celebrCta" onclick="${ctaAction}">${ctaLabel}</button>
      <button class="celebr-ghost" id="celebrStay" onclick="App._closeCelebration()">${i18n.t('celebr_cta_stay')}</button>`;
  },

  _diplomaHtml() {
    const lang = i18n.lang;
    // Único dato controlable por el usuario del template → escapeHtml (regla XSS).
    const name = escapeHtml(this._getDisplayName());
    const date = new Date().toLocaleDateString(i18n.t('date_locale'),
      { day: 'numeric', month: 'long', year: 'numeric' });
    const chips = CHAPTERS.map(ch =>
      `<span class="celebr-chip"><span aria-hidden="true">✓ </span>${ch.title[lang]}</span>`).join('');
    return `
      <div class="celebr-eyebrow">${i18n.t('diploma_eyebrow')}</div>
      <div class="celebr-medal" aria-hidden="true">🎓</div>
      <h2 id="celebrationTitle">${i18n.t('diploma_title')}</h2>
      <p class="celebr-body">${i18n.t('diploma_awarded_to')}</p>
      <div class="celebr-name">${name}</div>
      <div class="celebr-name-rule" aria-hidden="true"></div>
      <p class="celebr-body">${i18n.t('diploma_body')}</p>
      <div class="celebr-chips">${chips}</div>
      <div class="celebr-date">${date}</div>
      <button class="celebr-cta" id="celebrCta" onclick="App._closeCelebration();App.navigate('simulator')">${i18n.t('diploma_cta')}</button>
      <button class="celebr-ghost" id="celebrStay" onclick="App._closeCelebration()">${i18n.t('diploma_close')}</button>
      <div class="celebr-seal" aria-hidden="true">${this._icon('check')}</div>`;
  },

  _closeCelebration() {
    const modal = document.getElementById('celebration-modal');
    if (modal) modal.style.display = 'none';
    const conf = document.getElementById('celebrConfetti');
    if (conf) conf.innerHTML = '';
    if (this._celebrReturnFocusEl && typeof this._celebrReturnFocusEl.focus === 'function') {
      this._celebrReturnFocusEl.focus();
    }
    this._celebrReturnFocusEl = null;
  },

  _spawnConfetti() {
    // Guard reduced-motion (patrón _slideFlashcard): typeof mantiene al harness
    // mockeado (sin matchMedia) en el camino normal; con reduce activo no se
    // genera NINGUNA pieza — el respeto al usuario no depende solo del blunt
    // block CSS.
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const holder = document.getElementById('celebrConfetti');
    if (!holder) return;
    const colors = ['#6C63FF', '#00D2FF', '#FFC107', '#FF6B6B', '#4CAF50', '#A29DFF'];
    let html = '';
    for (let i = 0; i < 50; i++) {
      const left = (Math.random() * 100).toFixed(1);
      const delay = (Math.random() * 1.5).toFixed(2);
      const dur = (2.5 + Math.random() * 2).toFixed(2);
      const rot = Math.floor(Math.random() * 360);
      html += `<div class="celebr-confetti" style="left:${left}%;background:${colors[i % colors.length]};animation-delay:${delay}s;animation-duration:${dur}s;transform:rotate(${rot}deg)"></div>`;
    }
    holder.innerHTML = html;
    setTimeout(() => { if (holder) holder.innerHTML = ''; }, 6000);
  },

  /* ===== FLASHCARDS ===== */
  initFlashcards() {
    this.fcIndex = 0;
    this.fcFlipped = false;
    this.fcStats = { hard: 0, ok: 0, easy: 0 };
    this._fcAnimating = false;
    this.filterFlashcards();
    this.renderFlashcard();
  },

  filterFlashcards() {
    const deck = document.getElementById('flashcardDeck').value;
    if (deck === 'all') {
      this.fcCards = [...FLASHCARDS];
    } else {
      this.fcCards = FLASHCARDS.filter(f => f.chapter === parseInt(deck));
    }
  },

  shuffleFlashcards() {
    this.filterFlashcards();
    for (let i = this.fcCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.fcCards[i], this.fcCards[j]] = [this.fcCards[j], this.fcCards[i]];
    }
    this.fcIndex = 0;
    this.fcFlipped = false;
    this.renderFlashcard();
    this.showToast(i18n.t('flashcards_shuffled_toast'), 'info');
  },

  renderFlashcard() {
    if (!this.fcCards.length) return;
    const card = this.fcCards[this.fcIndex];
    const lang = i18n.lang;

    window.speechSynthesis.cancel();

    this._currentCard = { qText: card.q[lang], aText: card.a[lang], lang };

    document.getElementById('fcTag').textContent = card.chapterTag[lang];
    document.getElementById('fcQuestion').innerHTML = `${card.q[lang]}
      <button class="fc-tts-btn" onclick="App._handleTTS('question',event)" aria-label="${i18n.t('read_question_aria')}">🔇</button>`;
    document.getElementById('fcAnswer').innerHTML = `${card.a[lang]}
      <button class="fc-tts-btn" onclick="App._handleTTS('answer',event)" aria-label="${i18n.t('read_answer_aria')}">🔇</button>`;
    document.getElementById('cardCounter').textContent = `${this.fcIndex + 1}/${this.fcCards.length}`;

    const inner = document.getElementById('flashcardInner');
    inner.classList.remove('flipped');
    this.fcFlipped = false;

    document.getElementById('fcHard').textContent = this.fcStats.hard;
    document.getElementById('fcOk').textContent = this.fcStats.ok;
    document.getElementById('fcEasy').textContent = this.fcStats.easy;
  },

  flipFlashcard() {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.fc-tts-btn').forEach(b => {
      b.textContent = '🔇';
      b.classList.remove('fc-tts-playing');
    });
    const inner = document.getElementById('flashcardInner');
    this.fcFlipped = !this.fcFlipped;
    inner.classList.toggle('flipped', this.fcFlipped);
  },

  _slideFlashcard(direction, advance) {
    if (this._fcAnimating) return;
    this._fcAnimating = true;
    const card = document.getElementById('flashcard');
    const dist = 50;
    // I2: con prefers-reduced-motion, el CSS ya anula el movimiento — esto
    // elimina además el retardo muerto de los dos setTimeout. El typeof
    // protege el arnés mockeado (sin matchMedia), que se queda en 250ms.
    const dur = (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) ? 0 : 250;

    card.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
    card.style.transform = `translateX(${direction > 0 ? -dist : dist}px)`;
    card.style.opacity = '0';

    setTimeout(() => {
      advance();

      // Snap to the opposite edge with no transition, then force a reflow so the
      // browser registers that position before animating back to center — otherwise
      // it would just animate from the old (already translateX:0) state and never
      // look like it entered from the other side.
      card.style.transition = 'none';
      card.style.transform = `translateX(${direction > 0 ? dist : -dist}px)`;
      card.style.opacity = '0';
      void card.offsetWidth;

      card.style.transition = `transform ${dur}ms ease, opacity ${dur}ms ease`;
      card.style.transform = 'translateX(0)';
      card.style.opacity = '1';

      setTimeout(() => {
        card.style.transition = '';
        this._fcAnimating = false;
      }, dur);
    }, dur);
  },

  nextFlashcard(onAdvanced) {
    if (this.fcIndex < this.fcCards.length - 1) {
      this._slideFlashcard(1, () => {
        this.fcIndex++;
        this.renderFlashcard();
        if (onAdvanced) onAdvanced();
      });
    } else if (onAdvanced) {
      onAdvanced();
    }
  },

  prevFlashcard() {
    if (this.fcIndex > 0) {
      this._slideFlashcard(-1, () => {
        this.fcIndex--;
        this.renderFlashcard();
      });
    }
  },

  rateFlashcard(rating) {
    this.fcStats[rating]++;
    const cardId = this.fcCards[this.fcIndex].id;
    if (!this.fcReviewed.has(cardId)) {
      this.fcReviewed.add(cardId);
      this.state.flashcardsReviewed++;
      this.saveState();
      if (this.state.flashcardsReviewed % 5 === 0) {
        this.addXP(10, i18n.t('flashcards_reviewed_activity'));
      }
      this.checkAchievements();
    }
    this.nextFlashcard(() => {
      if (this.fcIndex >= this.fcCards.length - 1) {
        this.showToast(i18n.t('deck_completed_toast'), 'success');
      }
    });
  },

  /* ===== SIMULATOR ===== */
  renderSimulatorMenu() {
    this._setExamActive(false);
    document.getElementById('simMenu').style.display = '';
    document.getElementById('examMode').style.display = 'none';
    document.getElementById('examResults').style.display = 'none';
    document.getElementById('chapterSelector').style.display = 'none';

    const passed = this.state.chapterQuizPassed || {};
    const passedCount = Object.values(passed).filter(Boolean).length;
    const quickUnlocked = passedCount >= 3;
    const fullUnlocked = passedCount >= CHAPTERS.length;
    const lang = i18n.lang;

    document.getElementById('simCards').innerHTML = [
      {
        icon: '📋',
        title: i18n.t('exam_full'),
        desc: i18n.t('exam_full_desc'),
        tags: i18n.t('sim_full_tags'),
        type: 'full',
        locked: !fullUnlocked,
        lockMsg: `${i18n.t('unlock_all_chapters')} (${passedCount}/${CHAPTERS.length})`,
        btnClass: 'btn-primary'
      },
      {
        icon: '⚡',
        title: i18n.t('exam_quick'),
        desc: i18n.t('exam_quick_desc'),
        tags: i18n.t('sim_quick_tags'),
        type: 'quick',
        locked: !quickUnlocked,
        lockMsg: `${i18n.t('unlock_3_chapters')} (${passedCount}/3)`,
        btnClass: 'btn-secondary'
      },
      {
        icon: '🎯',
        title: i18n.t('exam_chapter'),
        desc: i18n.t('exam_chapter_desc'),
        tags: i18n.t('sim_chapter_tags'),
        type: 'chapter',
        locked: false,
        btnClass: 'btn-outline'
      }
    ].map(c => this._renderSimCard(c)).join('');

    const histEl = document.getElementById('examHistory');
    if (!this.state.examHistory.length) {
      histEl.innerHTML = `<div class="empty-state"><p>${i18n.t('no_exams_yet')}</p></div>`;
      return;
    }
    histEl.innerHTML = this.state.examHistory.slice().reverse().slice(0, 10).map(e => `
      <div class="exam-history-item">
        <span>${e.type === 'full' ? '📋' : e.type === 'quick' ? '⚡' : '🎯'}</span>
        <span>${escapeHtml(e.date)}</span>
        <span style="color:var(--text2)">${escapeHtml(e.questions)} ${i18n.t('questions_count_label')}</span>
        <span class="exam-history-score ${e.score >= 65 ? 'pass' : 'fail'}">${escapeHtml(e.score)}%</span>
      </div>`).join('');
  },

  _renderSimCard({ icon, title, desc, tags, type, locked, lockMsg, btnClass }) {
    const lang = i18n.lang;
    if (locked) {
      return `
        <div class="sim-card sim-card-locked">
          <div class="sim-lock-icon">${this._icon('lock')}</div>
          <div class="sim-card-icon">${icon}</div>
          <h3>${title}</h3>
          <p class="sim-lock-msg">${lockMsg}</p>
        </div>`;
    }
    return `
      <div class="sim-card" onclick="App.startExam('${type}')">
        <div class="sim-card-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="sim-card-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <button class="btn ${btnClass}">${i18n.t('start_exam')}</button>
      </div>`;
  },

  startExam(type) {
    if (type === 'chapter') {
      document.getElementById('simMenu').style.display = 'none';
      document.getElementById('chapterSelector').style.display = 'block';
      const list = document.getElementById('chapterSelectorList');
      const passed = this.state.chapterQuizPassed || {};
      list.innerHTML = CHAPTERS.map((ch, i) => {
        const isUnlocked = i === 0 || passed[i - 1];
        const isPassed = passed[i];
        const badge = isPassed ? ' ' + this._icon('check-circle') : (!isUnlocked ? ' ' + this._icon('lock') : '');
        return `<button class="chapter-sel-btn ${!isUnlocked ? 'locked' : ''}"
          onclick="${isUnlocked ? `App.startChapterExam(${i})` : ''}">
          ${ch.icon} ${ch.title[i18n.lang]}${badge}
        </button>`;
      }).join('');
      return;
    }

    let pool = [...QUESTIONS];
    let count = type === 'full' ? 40 : 20;
    let timeMin = type === 'full' ? 60 : 30;

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.examQuestions = pool.slice(0, Math.min(count, pool.length));
    this.examType = type;
    this.examAnswers = {};
    this.examCurrentQ = 0;
    this.examReviewing = false;
    this.examTimeLeft = timeMin * 60;
    this.launchExam(type === 'full' ? i18n.t('exam_full') : i18n.t('exam_quick'));
  },

  startChapterExam(chapterId) {
    document.getElementById('chapterSelector').style.display = 'none';
    this.examChapterId = chapterId;
    const pool = QUESTIONS.filter(q => q.chapter === chapterId);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.examQuestions = pool.slice(0, Math.min(10, pool.length));
    this.examType = 'chapter';
    this.examAnswers = {};
    this.examCurrentQ = 0;
    this.examReviewing = false;
    this.examTimeLeft = 0; // no limit
    this.launchExam(CHAPTERS[chapterId].title[i18n.lang]);
  },

  launchExam(title) {
    this._setExamActive(true);
    // Guardar el total permite calcular el tiempo usado en finishExam sin
    // depender de examTimeLeft > 0 (que es falso justo cuando el temporizador
    // se agota, y registraba time: 0 en un examen que consumió todo el tiempo).
    this.examTimeTotal = this.examTimeLeft;
    document.getElementById('simMenu').style.display = 'none';
    document.getElementById('examMode').style.display = 'block';
    document.getElementById('examResults').style.display = 'none';
    document.getElementById('examTitle').textContent = title;
    this.renderExamQuestion();
    this.renderExamDots();

    if (this.examTimer) clearInterval(this.examTimer);
    if (this.examTimeLeft > 0) {
      this.updateTimer();
      this.examTimer = setInterval(() => {
        this.examTimeLeft--;
        this.updateTimer();
        if (this.examTimeLeft <= 0) {
          clearInterval(this.examTimer);
          this.finishExam();
        }
      }, 1000);
    } else {
      document.getElementById('examTimer').textContent = '∞';
    }
  },

  updateTimer() {
    const min = Math.floor(this.examTimeLeft / 60).toString().padStart(2, '0');
    const sec = (this.examTimeLeft % 60).toString().padStart(2, '0');
    const timerEl = document.getElementById('examTimer');
    timerEl.textContent = `${min}:${sec}`;
    timerEl.className = 'exam-timer';
    if (this.examTimeLeft < 60) timerEl.classList.add('danger');
    else if (this.examTimeLeft < 300) timerEl.classList.add('warning');
  },

  renderExamQuestion() {
    const q = this.examQuestions[this.examCurrentQ];
    const lang = i18n.lang;
    const letters = ['A', 'B', 'C', 'D'];
    const selected = this.examAnswers[this.examCurrentQ];
    const isReviewing = this.examReviewing;

    document.getElementById('examBody').innerHTML = `
      <div class="exam-q-num">${i18n.t('question_label')} ${this.examCurrentQ + 1} ${i18n.t('of_label')} ${this.examQuestions.length}</div>
      <div class="exam-q-chapter">${CHAPTERS[q.chapter].icon} ${CHAPTERS[q.chapter].title[lang]}</div>
      <div class="exam-q-text">${q.q[lang]}</div>
      <div class="exam-options" id="examOptions">
        ${q.options[lang].map((opt, i) => {
          let cls = '';
          if (isReviewing) {
            if (i === q.correct) cls = 'correct';
            else if (i === selected && selected !== q.correct) cls = 'wrong';
          } else if (i === selected) cls = 'selected';
          return `
            <div class="exam-option ${cls}" ${isReviewing ? '' : `onclick="App.selectAnswer(${i})" role="button" tabindex="0" aria-pressed="${i === selected}"`} id="opt${i}">
              <div class="exam-option-letter">${letters[i]}</div>
              ${opt}
            </div>`;
        }).join('')}
      </div>
      <div class="exam-explanation ${isReviewing ? 'visible' : ''}" id="examExp">
        💡 ${q.explanation[lang]}
      </div>`;

    const pct = ((this.examCurrentQ + 1) / this.examQuestions.length) * 100;
    document.getElementById('examProgressFill').style.width = pct + '%';
    document.getElementById('examQCounter').textContent = `${this.examCurrentQ + 1} / ${this.examQuestions.length}`;

    document.getElementById('examPrev').disabled = this.examCurrentQ === 0;
    document.getElementById('examNext').textContent = this.examCurrentQ === this.examQuestions.length - 1
      ? i18n.t('end_exam')
      : i18n.t('next');
  },

  renderExamDots() {
    const dots = document.getElementById('examDots');
    dots.innerHTML = this.examQuestions.map((_, i) => {
      const cls = i === this.examCurrentQ ? 'current' : (this.examAnswers[i] !== undefined ? 'answered' : '');
      // Roving tabindex: un solo tab stop (el dot actual); las flechas mueven.
      return `<div class="exam-dot ${cls}" onclick="App.goToQuestion(${i})" role="button" tabindex="${i === this.examCurrentQ ? 0 : -1}"${i === this.examCurrentQ ? ' aria-current="true"' : ''} aria-label="${i18n.t('goto_question_aria')} ${i + 1}">${i + 1}</div>`;
    }).join('');
    // Punto único de auto-centrado: los cuatro flujos que mueven el dot actual
    // (Siguiente/Anterior, responder, click/teclado en un dot) re-renderizan
    // los dots pasando por aquí.
    this._centerExamDot();
  },

  // Tira de dots (2026-07-21): centra el dot actual en el scroll horizontal
  // del PROPIO contenedor (nunca scrollIntoView: arrastra también el scroll
  // vertical de ancestros —incluida la página— cuando la tira queda fuera de
  // pantalla, hallazgo I2 de la revisión). scrollTo acotado al contenedor es
  // un no-op real cuando no hay overflow (parrilla desktop).
  _centerExamDot() {
    const dot = document.querySelector('.exam-dot.current');
    const strip = dot && dot.parentElement;
    if (!strip || typeof strip.scrollTo !== 'function') return; // harness mock
    if (strip.scrollWidth <= strip.clientWidth) return; // sin overflow: nada que centrar
    const reduced = typeof matchMedia === 'function'
      && matchMedia('(prefers-reduced-motion: reduce)').matches;
    strip.scrollTo({
      left: dot.offsetLeft - (strip.clientWidth - dot.offsetWidth) / 2,
      behavior: reduced ? 'auto' : 'smooth',
    });
  },

  selectAnswer(optIndex) {
    this.examAnswers[this.examCurrentQ] = optIndex;
    this.renderExamQuestion();
    this.renderExamDots();
    // C1: renderExamQuestion regenera el innerHTML y destruye el nodo enfocado —
    // sin esto, responder con Enter devolvía el foco al body y el usuario de
    // teclado tenía que tabular desde el principio en cada pregunta.
    const opt = document.getElementById('opt' + optIndex);
    if (opt && typeof opt.focus === 'function') opt.focus();
  },

  goToQuestion(i) {
    this.examCurrentQ = i;
    this.renderExamQuestion();
    this.renderExamDots();
    // Mismo arreglo que selectAnswer: el re-render destruye el nodo enfocado.
    // El foco va al dot actual — es el tab stop del roving.
    const dots = document.getElementById('examDots');
    const dot = dots && dots.children && dots.children[i];
    if (dot && typeof dot.focus === 'function') dot.focus();
  },

  examNavNext() {
    if (this.examCurrentQ < this.examQuestions.length - 1) {
      this.examCurrentQ++;
      this.renderExamQuestion();
      this.renderExamDots();
    } else {
      this.finishExam();
    }
  },

  examNavPrev() {
    if (this.examCurrentQ > 0) {
      this.examCurrentQ--;
      this.renderExamQuestion();
      this.renderExamDots();
    }
  },

  finishExam() {
    if (this.examTimer) clearInterval(this.examTimer);
    this._setExamActive(false);
    const total = this.examQuestions.length;
    let correct = 0;
    this.examQuestions.forEach((q, i) => {
      if (this.examAnswers[i] === q.correct) correct++;
    });
    const score = Math.round((correct / total) * 100);
    const passed = score >= 65;
    const timeUsed = this.examTimeTotal > 0 ? this.examTimeTotal - Math.max(0, this.examTimeLeft) : 0;

    this.state.examsCompleted++;
    if (score > this.state.bestScore) this.state.bestScore = score;
    const date = new Date().toLocaleDateString(i18n.t('date_locale'));
    this.state.examHistory.push({ score, date, questions: total, type: this.examType, correct, time: timeUsed });
    if (this.state.examHistory.length > 50) this.state.examHistory.shift();

    // Handle chapter quiz unlock progression
    // El || {} de renderSimulatorMenu no protege este acceso: un estado
    // antiguo (nube) sin la clave reventaba aquí con TypeError y los
    // resultados del examen nunca llegaban a mostrarse.
    if (!this.state.chapterQuizPassed) this.state.chapterQuizPassed = {};
    if (this.examType === 'chapter' && this.examChapterId !== null && passed) {
      if (!this.state.chapterQuizPassed[this.examChapterId]) {
        this.state.chapterQuizPassed[this.examChapterId] = true;
        const passedCount = Object.values(this.state.chapterQuizPassed).filter(Boolean).length;
        const nextCh = CHAPTERS[this.examChapterId + 1];
        if (nextCh) {
          setTimeout(() => this.showToast(`🔓 ${i18n.t('unlocked_prefix')} ${nextCh.title[i18n.lang]}`, 'success'), 1200);
        }
        if (passedCount === 3) {
          setTimeout(() => this.showToast(`⚡ ${i18n.t('quick_exam_unlocked_toast')}`, 'success'), 2200);
        }
        if (passedCount === CHAPTERS.length) {
          setTimeout(() => this.showToast(`📋 ${i18n.t('full_exam_unlocked_toast')}`, 'success'), 2200);
        }
      }
    }

    this.saveState();
    this.checkAchievements();

    const xpEarned = Math.round(score * 0.5) + (passed ? 50 : 10);
    this.addXP(xpEarned, `${i18n.t('mock_exam_completed_activity')} (${score}%)`);

    document.getElementById('examMode').style.display = 'none';
    document.getElementById('examResults').style.display = 'block';
    document.getElementById('resultsEmoji').textContent = passed ? '🎉' : '💪';
    document.getElementById('resultsScore').textContent = score + '%';
    document.getElementById('resultsScore').style.color = passed ? 'var(--success-text)' : 'var(--danger-text)';
    const verdict = document.getElementById('resultsVerdict');
    verdict.textContent = passed ? i18n.t('exam_passed') : i18n.t('exam_failed');
    verdict.className = 'results-verdict ' + (passed ? 'pass' : 'fail');

    const minToPass = Math.ceil(total * 0.65);
    document.getElementById('resultsStats').innerHTML = `
      <div class="result-stat"><div class="result-stat-val text-success">${correct}</div><div class="result-stat-label">${i18n.t('correct_answers')}</div></div>
      <div class="result-stat"><div class="result-stat-val text-danger">${total - correct}</div><div class="result-stat-label">${i18n.t('wrong_answers')}</div></div>
      <div class="result-stat"><div class="result-stat-val">${score}%</div><div class="result-stat-label">${i18n.t('score_label')}</div></div>
      <div class="result-stat"><div class="result-stat-val text-primary">+${xpEarned}</div><div class="result-stat-label">${i18n.t('xp_gained')}</div></div>
    `;

    const lang = i18n.lang;
    const letters = ['A', 'B', 'C', 'D'];
    const wrongOnes = this.examQuestions.filter((q, i) => this.examAnswers[i] !== q.correct);
    document.getElementById('resultsReview').innerHTML = `
      <h3>${i18n.t('wrong_answers_review_title')} (${wrongOnes.length})</h3>
      ${wrongOnes.slice(0, 10).map(q => `
        <div class="review-item">
          <div class="review-item-q">${q.q[lang]}</div>
          <div class="review-item-wrong">✗ ${i18n.t('your_answer')}: ${q.options[lang][this.examAnswers[this.examQuestions.indexOf(q)]] || '—'}</div>
          <div class="review-item-correct">✓ ${i18n.t('correct_answer')}: ${q.options[lang][q.correct]}</div>
          <div class="review-item-exp">💡 ${q.explanation[lang]}</div>
        </div>`).join('')}`;
  },

  /* ===== GLOSSARY ===== */
  renderGlossary(filter = '') {
    const search = (document.getElementById('glossarySearch')?.value || '').toLowerCase();
    const lang = i18n.lang;
    const activeFilter = filter && filter !== 'all' ? filter : 'all';

    const letters = [...new Set(GLOSSARY.map(g => g.term[lang][0].toUpperCase()))].sort();
    const filtersEl = document.getElementById('glossaryFilters');
    if (filtersEl) {
      filtersEl.innerHTML = `<button class="filter-btn${activeFilter === 'all' ? ' active' : ''}" onclick="App.filterGlossary('all')">${i18n.t('all_label')}</button>` +
        letters.map(l => `<button class="filter-btn${activeFilter === l ? ' active' : ''}" onclick="App.filterGlossary('${l}')">${l}</button>`).join('');
    }

    let items = GLOSSARY;
    if (search) {
      items = items.filter(g => g.term[lang].toLowerCase().includes(search) || g.def[lang].toLowerCase().includes(search));
    }
    if (activeFilter !== 'all') {
      items = items.filter(g => g.term[lang][0].toUpperCase() === activeFilter);
    }

    document.getElementById('glossaryList').innerHTML = items.map(g => `
      <div class="glossary-item">
        <div class="glossary-term">${g.term[lang]}</div>
        <div class="glossary-def">${g.def[lang]}</div>
        <div class="glossary-chapter">${g.chapter ? i18n.t('glossary_ch_tag') + g.chapter : ''}</div>
      </div>`).join('') || `<div class="empty-state"><p>${i18n.t('no_terms_found')}</p></div>`;
  },

  filterGlossary(letter) {
    this.renderGlossary(letter);
    this.state.glossarySearches++;
    this.saveState();
  },

  /* ===== PROGRESS ===== */
  renderProgress() {
    const lang = i18n.lang;
    const totalLessons = CHAPTERS.reduce((a, c) => a + c.topics.length, 0);
    const done = this.state.completedLessons.length;
    const lvl = Gamification.getLevel(this.state.xp);
    const avgScore = this.state.examHistory.length > 0
      ? Math.round(this.state.examHistory.reduce((a, e) => a + e.score, 0) / this.state.examHistory.length)
      : 0;

    document.getElementById('progressStatsBig').innerHTML = `
      <div class="progress-stat-big"><div class="progress-stat-big-val text-primary">${this.state.xp}</div><div class="progress-stat-big-label">XP ${i18n.t('total_label')}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val text-warning">${lvl.icon} ${i18n.t('level_label')} ${lvl.level}</div><div class="progress-stat-big-label">${lvl.name[lang]}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val text-success">${done}/${totalLessons}</div><div class="progress-stat-big-label">${i18n.t('lessons_label')}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val" style="color:var(--secondary-text)">${this.state.examsCompleted}</div><div class="progress-stat-big-label">${i18n.t('nav_simulator')}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val text-warning">🔥 ${this.state.streak}</div><div class="progress-stat-big-label">${i18n.t('streak_label')}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val">${avgScore}%</div><div class="progress-stat-big-label">${i18n.t('avg_exam_score_label')}</div></div>
    `;

    const colors = ["#6C63FF","#00D2FF","#FF6B6B","#FFC107","#4CAF50","#9C27B0"];
    document.getElementById('chapterProgressBars').innerHTML = `<div class="chapter-progress-list">` +
      CHAPTERS.map((ch, i) => {
        const d = ch.topics.filter(t => this.state.completedLessons.includes(t.id)).length;
        const pct = Math.round((d / ch.topics.length) * 100);
        return `<div class="chapter-prog-item">
          <div class="chapter-prog-header">
            <span class="chapter-prog-title">${ch.icon} ${ch.title[lang]}</span>
            <span class="chapter-prog-pct">${pct}%</span>
          </div>
          <div class="chapter-prog-bar"><div class="chapter-prog-fill" style="width:${pct}%;background:${colors[i]}"></div></div>
        </div>`;
      }).join('') + `</div>`;

    // Bar chart for exams
    const recent = this.state.examHistory.slice(-8);
    if (recent.length) {
      document.getElementById('examPerformanceChart').innerHTML = `
        <div style="position:relative;display:flex;align-items:flex-end;gap:8px;height:120px;padding:0 0 24px 0">
          ${recent.map((e, i) => {
            const h = Math.round((e.score / 100) * 100);
            const color = e.score >= 65 ? 'var(--success)' : 'var(--danger)';
            const textColor = e.score >= 65 ? 'var(--success-text)' : 'var(--danger-text)';
            return `<div style="flex:1;height:${h}px;background:${color};border-radius:4px 4px 0 0;position:relative;min-width:20px" title="${escapeHtml(e.score)}%">
              <span style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:0.6rem;font-weight:700;color:${textColor};white-space:nowrap">${escapeHtml(e.score)}%</span>
              <span style="position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:0.6rem;color:var(--text3);white-space:nowrap">${escapeHtml(String(e.date).split('/').slice(0,2).join('/'))}</span>
            </div>`;
          }).join('')}
        </div>
        <div style="text-align:center;margin-top:8px;font-size:0.75rem;color:var(--text3)">${i18n.t('pass_line_label')}</div>`;
    } else {
      document.getElementById('examPerformanceChart').innerHTML = `<div class="empty-state"><p>${i18n.t('no_exams_yet')}</p></div>`;
    }

    const acts = this.state.activityLog;
    document.getElementById('activityLog').innerHTML = acts.length ? acts.map(a => `
      <div class="activity-item">
        <span class="activity-icon">${this._icon('star')}</span>
        <span class="activity-text">${escapeHtml(a.text)}</span>
        <span class="activity-xp">+${escapeHtml(a.xp)} XP</span>
        <span class="activity-time">${escapeHtml(a.time)}</span>
      </div>`).join('') : `<div class="empty-state"><p>${i18n.t('no_activities')}</p></div>`;
  },

  /* ===== ACHIEVEMENTS ===== */
  renderAchievements() {
    const unlocked = this.state.achievements || [];
    const totalXP = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).reduce((s, a) => s + a.xp, 0);
    const lang = i18n.lang;

    document.getElementById('achievementsSummary').innerHTML = `
      <div class="achievements-summary-icon" aria-hidden="true">🏆</div>
      <div class="achievements-summary-text">
        <h3>${unlocked.length} / ${ACHIEVEMENTS.length} ${i18n.t('achievements_unlocked_label')}</h3>
        <p>${totalXP} XP ${i18n.t('earned_from_achievements_label')}</p>
      </div>`;

    document.getElementById('achievementsGrid').innerHTML = ACHIEVEMENTS.map(a => {
      const isUnlocked = unlocked.includes(a.id);
      return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          ${isUnlocked ? `<div class="achievement-unlocked-badge">${this._icon('check')}</div>` : ''}
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-name">${a.name[lang]}</div>
          <div class="achievement-desc">${a.desc[lang]}</div>
          <div class="achievement-xp">+${a.xp} XP</div>
          <div style="font-size:0.7rem;color:${isUnlocked ? 'var(--success-text)' : 'var(--text3)'}">${isUnlocked ? this._icon('check') + ' ' + i18n.t('unlocked_on') : this._icon('lock') + ' ' + i18n.t('locked')}</div>
        </div>`;
    }).join('');
  },

  renderRanking() {},

  // Único punto de verdad para el estado de examen: setea el flag y refleja
  // en <body> la clase exam-active (CSS oculta el pill de apoyo durante el
  // examen). Sustituye las asignaciones directas a _examActive.
  _setExamActive(active) {
    this._examActive = active;
    document.body.classList.toggle('exam-active', active);
  },

  // Drawer móvil (2026-07-21): único punto de verdad, paralelo a _setExamActive.
  // Nadie más toca 'mobile-open'. inert al cerrar: el drawer trasladado fuera
  // de pantalla seguía teniendo 11 focusables tabulables.
  _setDrawerOpen(open) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobileMenuBtn');
    if (!sidebar) return;
    sidebar.classList[open ? 'add' : 'remove']('mobile-open');
    document.body.classList[open ? 'add' : 'remove']('drawer-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
    const isMobile = typeof matchMedia === 'function' && matchMedia('(max-width: 768px)').matches;
    if (open) {
      sidebar.removeAttribute('inert');
      const first = sidebar.querySelector && sidebar.querySelector('.nav-item');
      if (first && typeof first.focus === 'function') first.focus();
    } else {
      // Capturar el foco ANTES de poner inert: inert blurea síncronamente al
      // descendiente enfocado y el contains posterior ya vería <body>.
      const hadFocus = !!(document.activeElement && sidebar.contains
        && sidebar.contains(document.activeElement));
      if (isMobile) sidebar.setAttribute('inert', '');
      if (menuBtn && typeof menuBtn.focus === 'function' && hadFocus) menuBtn.focus();
    }
  },

  /* ===== ICONOS (I8, ronda 2) ===== */
  // Devuelve el <svg><use> de un símbolo del sprite de index.html, para
  // interpolar en templates innerHTML. name es SIEMPRE un literal interno,
  // nunca dato de usuario.
  _icon(name) {
    return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  },

  /* ===== TOASTS ===== */
  showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    // Un nodo con role="alert" insertado en un live region se anuncia
    // asertivo — los mensajes bloqueantes (guard de examen, errores) no
    // esperan a que el lector esté ocioso; success/info siguen polite.
    if (type === 'warning' || type === 'error') toast.setAttribute('role', 'alert');
    const icons = {
      success: this._icon('check-circle'),
      warning: this._icon('alert-triangle'),
      error: this._icon('x-circle'),
      info: this._icon('info'),
    };
    toast.innerHTML = `<span>${icons[type] || this._icon('info')}</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },

  showXPPopup(text) {
    const popup = document.getElementById('xpPopup');
    popup.textContent = text;
    popup.style.display = 'block';
    popup.style.animation = 'none';
    popup.offsetHeight; // reflow
    popup.style.animation = 'xpPop 0.6s ease forwards';
    setTimeout(() => { popup.style.display = 'none'; }, 700);
  },

  /* ===== GLOBAL SEARCH (dropdown del topbar) ===== */
  _onGlobalSearchInput(e) {
    const q = e.target.value.toLowerCase().trim();
    if (q.length <= 2) { this._closeGlobalSearch(); return; }
    const lang = i18n.lang;
    this._gsQuery = q;
    this._gsExpanded = null;
    this._gsActive = -1;
    this._gsGlossary = GLOSSARY.filter(g =>
      g.term[lang].toLowerCase().includes(q) || g.def[lang].toLowerCase().includes(q)
    ).slice(0, 5);
    const content = [];
    CHAPTERS.forEach(ch => {
      const topics = ch.topics.filter(t => LESSONS[t.id]);
      if (!topics.length) return;
      if (ch.title[lang].toLowerCase().includes(q)) {
        content.push({ chapterId: ch.id, topicId: topics[0].id, icon: ch.icon, title: ch.title[lang] });
      }
      topics.forEach(t => {
        if (t.title[lang].toLowerCase().includes(q)) {
          content.push({ chapterId: ch.id, topicId: t.id, icon: ch.icon, title: t.title[lang] });
        }
      });
    });
    this._gsContent = content.slice(0, 3);
    this._renderGlobalSearch();
  },

  _renderGlobalSearch() {
    const panel = document.getElementById('globalSearchResults');
    const input = document.getElementById('globalSearch');
    const lang = i18n.lang;
    // Lista plana de resultados accionables, en orden de render — es lo que
    // navegan las flechas (patrón ARIA combobox: el foco DOM no sale del input).
    this._gsItems = [
      ...this._gsGlossary.map((g, i) => ({ kind: 'term', idx: i })),
      ...this._gsContent.map(c => ({ kind: 'lesson', chapterId: c.chapterId, topicId: c.topicId })),
    ];
    if (this._gsActive >= this._gsItems.length) this._gsActive = this._gsItems.length - 1;
    let n = 0;
    if (!this._gsGlossary.length && !this._gsContent.length) {
      panel.innerHTML = `<div class="search-no-results">${i18n.t('gs_no_results')}</div>`;
      panel.style.display = 'block';
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-activedescendant', '');
      return;
    }
    let html = '';
    if (this._gsGlossary.length) {
      html += `<div class="search-results-header">${i18n.t('gs_glossary_header')}</div>`;
      html += this._gsGlossary.map((g, i) => {
        const expanded = this._gsExpanded === i;
        const active = this._gsActive === n;
        return `
        <div class="search-result${expanded ? ' expanded' : ''}${active ? ' gs-active' : ''}" id="gs-opt-${n++}" role="option" aria-selected="${active}" onclick="App._gsToggleTerm(${i})">
          <div class="search-result-term">${g.term[lang]}</div>
          <div class="search-result-def">${g.def[lang]}</div>
          ${expanded ? `<a class="search-result-link" onclick="event.stopPropagation();App._gsGoGlossary()">${i18n.t('gs_view_in_glossary')}</a>` : ''}
        </div>`;
      }).join('');
    }
    if (this._gsContent.length) {
      html += `<div class="search-results-header">${i18n.t('gs_content_header')}</div>`;
      html += this._gsContent.map(c => {
        const active = this._gsActive === n;
        return `
        <div class="search-result search-result-lesson${active ? ' gs-active' : ''}" id="gs-opt-${n++}" role="option" aria-selected="${active}" onclick="App._gsGoLesson(${c.chapterId}, '${c.topicId}')">
          <span>${c.icon}</span><span>${c.title}</span>
        </div>`;
      }).join('');
    }
    panel.innerHTML = html;
    panel.style.display = 'block';
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-activedescendant', this._gsActive >= 0 ? `gs-opt-${this._gsActive}` : '');
  },

  _gsToggleTerm(i) {
    this._gsExpanded = this._gsExpanded === i ? null : i;
    this._renderGlobalSearch();
  },

  // I7 (ronda 2): navegación por teclado del dropdown — patrón ARIA combobox.
  // El foco DOM permanece en el input; el "activo" es visual + aria-activedescendant.
  _gsMove(delta) {
    if (!this._gsItems.length) return;
    const next = this._gsActive + delta;
    if (next < 0 || next >= this._gsItems.length) return; // sin wrap: extremos se clavan
    this._gsActive = next;
    this._renderGlobalSearch();
  },

  _gsActivate() {
    const item = this._gsItems[this._gsActive];
    if (!item) return;
    if (item.kind === 'term') {
      // Primera activación expande; la segunda navega al glosario — así el
      // enlace "Ver en glosario" (un <a> sin href, no enfocable) tiene ruta
      // de teclado equivalente.
      if (this._gsExpanded === item.idx) this._gsGoGlossary();
      else this._gsToggleTerm(item.idx);
    } else {
      this._gsGoLesson(item.chapterId, item.topicId);
    }
  },

  _gsKeydown(e) {
    if (e.key === 'Escape') {
      this._closeGlobalSearch();
      this._closeMobileSearch();
      return;
    }
    const panel = document.getElementById('globalSearchResults');
    if (!panel || panel.style.display === 'none') return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this._gsMove(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter' && this._gsActive >= 0) {
      e.preventDefault();
      this._gsActivate();
    }
  },

  _gsBlockIfExam() {
    if (!this._examActive) return false;
    this.showToast(i18n.t('gs_exam_block_toast'), 'warning');
    return true;
  },

  _gsGoGlossary() {
    if (this._gsBlockIfExam()) return;
    document.getElementById('glossarySearch').value = this._gsQuery;
    this._closeGlobalSearch(true);
    this._closeMobileSearch(false);
    this.navigate('glossary');
  },

  _gsGoLesson(chapterId, topicId) {
    if (this._gsBlockIfExam()) return;
    this._closeGlobalSearch(true);
    this._closeMobileSearch(false);
    this.navigateToLesson(chapterId, topicId);
  },

  _closeGlobalSearch(clearInput = false) {
    const panel = document.getElementById('globalSearchResults');
    panel.style.display = 'none';
    panel.innerHTML = '';
    this._gsExpanded = null;
    this._gsActive = -1;
    this._gsItems = [];
    const input = document.getElementById('globalSearch');
    if (input) {
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-activedescendant', '');
    }
    if (clearInput) document.getElementById('globalSearch').value = '';
  },

  // I7 (ronda 2): cierra la barra de búsqueda móvil (si está abierta) y
  // devuelve el foco al botón que la abrió — salvo returnFocus=false (clic
  // fuera: robar el foco al elemento clicado sería peor que no devolverlo).
  _closeMobileSearch(returnFocus = true) {
    const box = document.querySelector('.search-box');
    if (!box || !box.classList.contains('mobile-open')) return;
    box.classList.remove('mobile-open');
    this._closeGlobalSearch();
    const btn = document.getElementById('mobileSearchBtn');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      if (returnFocus && typeof btn.focus === 'function') btn.focus();
    }
  },

  /* ===== LANGUAGE ===== */
  setLang(lang) {
    i18n.setLang(lang);
    document.getElementById('btnES').classList.toggle('active', lang === 'es');
    document.getElementById('btnEN').classList.toggle('active', lang === 'en');
    this.navigate(this.currentView);
  },

  /* ===== THEME ===== */
  toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') !== 'light';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeToggle').innerHTML = this._icon(isDark ? 'sun' : 'moon');
    try {
      localStorage.setItem('mycampus_theme', isDark ? 'light' : 'dark');
    } catch (e) {}
  },

  /* ===== INIT ===== */
  init(preloadedState) {
    this._initialized = true;
    this.state = preloadedState || this.loadState();

    // Restore lang (ya restaurado por Auth.init() antes del login, pero
    // i18n.restore() es idempotente — re-aplicar aquí es seguro)
    i18n.restore();
    document.getElementById('btnES').classList.toggle('active', i18n.lang === 'es');
    document.getElementById('btnEN').classList.toggle('active', i18n.lang === 'en');

    // Restore theme
    const savedTheme = localStorage.getItem('mycampus_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').innerHTML = this._icon(savedTheme === 'light' ? 'sun' : 'moon');

    this.updateSidebar();

    const saved = this._restoreSavedView();
    if (saved && saved.view === 'lesson' && saved.lesson) {
      this.currentLesson = saved.lesson;
      if (saved.expandedChapters) this._expandedChapters = new Set(saved.expandedChapters);
      this.navigateToLesson(saved.lesson.chapterId, saved.lesson.topicId);
    } else if (saved && saved.view && document.getElementById(`view-${saved.view}`)) {
      if (saved.expandedChapters) this._expandedChapters = new Set(saved.expandedChapters);
      this.navigate(saved.view);
    } else {
      this.navigate('dashboard');
    }

    // Event listeners
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
      this._setDrawerOpen(!document.getElementById('sidebar').classList.contains('mobile-open'));
    });
    document.querySelector('.logo-icon').addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
      } else if (typeof matchMedia === 'function' && matchMedia('(max-width: 768px)').matches) {
        // Solo abre el drawer en móvil (hallazgo C1): en desktop el logo no
        // colapsado no tiene affordance de apertura — sin el guard, el click
        // mutaba mobile-open/drawer-open también en desktop.
        this._setDrawerOpen(true);
      }
    });
    // Scrim del drawer (2026-07-21): clic fuera cierra. El scrim es decorativo
    // (aria-hidden); el cierre accesible es Escape en el keydown delegado.
    document.getElementById('sidebarScrim').addEventListener('click', () => this._setDrawerOpen(false));
    // Celebración (2026-07-25): Escape y clic en el scrim cierran. Mismo
    // patrón que el modal de avatar (listener propio en el elemento; el foco
    // de vuelta lo gestiona _closeCelebration).
    const celebrModal = document.getElementById('celebration-modal');
    if (celebrModal) {
      celebrModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._closeCelebration();
      });
      celebrModal.addEventListener('click', (e) => {
        if (e.target === celebrModal) this._closeCelebration();
      });
    }
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

    // Teclado (C1): los controles renderizados por plantilla son divs con
    // role="button" — innerHTML los regenera constantemente, así que un único
    // listener delegado en document los cubre todos, actuales y futuros.
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if (!t || !t.getAttribute) return;
      // Roving de los exam dots: flechas mueven pregunta y foco a la vez.
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && t.classList && t.classList.contains('exam-dot')) {
        e.preventDefault();
        const next = this.examCurrentQ + (e.key === 'ArrowRight' ? 1 : -1);
        if (next >= 0 && next < this.examQuestions.length) this.goToQuestion(next);
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && t.getAttribute('role') === 'button' && typeof t.click === 'function') {
        e.preventDefault(); // evita el scroll de Espacio y el doble disparo
        t.click();
        return;
      }
      // Drawer móvil (2026-07-21): rama Escape, la ÚLTIMA a propósito — la
      // búsqueda (#globalSearch, listener propio) y el modal de avatar
      // (#avatar-modal, listener propio) tienen prioridad y actúan en fases
      // anteriores; si el evento nace en ellos, aquí no se toca el drawer.
      if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')
            && t.id !== 'globalSearch'
            && !(typeof t.closest === 'function' && t.closest('#avatar-modal'))
            && !(typeof t.closest === 'function' && t.closest('#celebration-modal'))) {
          this._setDrawerOpen(false);
        }
      }
    });

    document.querySelectorAll('.nav-item[data-view]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(el.getAttribute('data-view'));
      });
    });

    document.getElementById('flashcard').addEventListener('click', () => this.flipFlashcard());
    document.getElementById('fcPrev').addEventListener('click', () => this.prevFlashcard());
    document.getElementById('fcNext').addEventListener('click', () => this.nextFlashcard());
    document.getElementById('shuffleBtn').addEventListener('click', () => this.shuffleFlashcards());
    document.getElementById('flashcardDeck').addEventListener('change', () => this.initFlashcards());

    document.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', () => this.rateFlashcard(btn.getAttribute('data-rating')));
    });

    document.getElementById('examNext').addEventListener('click', () => this.examNavNext());
    document.getElementById('examPrev').addEventListener('click', () => this.examNavPrev());
    document.getElementById('endExamBtn').addEventListener('click', () => {
      if (confirm(i18n.t('confirm_finish_exam'))) {
        this.finishExam();
      }
    });

    document.getElementById('glossarySearch').addEventListener('input', (e) => {
      this.renderGlossary();
      // Contar una búsqueda por transición a >2 caracteres, no una por
      // pulsación — teclear "testing" contaba 5 búsquedas y disparaba el
      // logro de glosario (10) con una sola consulta.
      if (e.target.value.length > 2) {
        if (!this._glossarySearchCounted) {
          this._glossarySearchCounted = true;
          this.state.glossarySearches++;
          this.saveState();
        }
      } else {
        this._glossarySearchCounted = false;
      }
    });

    const gsInput = document.getElementById('globalSearch');
    gsInput.addEventListener('input', (e) => this._onGlobalSearchInput(e));
    gsInput.addEventListener('keydown', (e) => this._gsKeydown(e));
    // I7: apertura/cierre de la barra de búsqueda móvil.
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    mobileSearchBtn.addEventListener('click', () => {
      const box = document.querySelector('.search-box');
      if (box.classList.contains('mobile-open')) { this._closeMobileSearch(); return; }
      box.classList.add('mobile-open');
      mobileSearchBtn.setAttribute('aria-expanded', 'true');
      if (typeof gsInput.focus === 'function') gsInput.focus();
    });
    document.getElementById('searchCloseBtn').addEventListener('click', () => this._closeMobileSearch());
    document.addEventListener('click', (e) => {
      // composedPath(), no e.target.closest(): un clic en un término del
      // dropdown dispara su onclick inline (_gsToggleTerm), que reemplaza
      // el innerHTML de #globalSearchResults *durante la fase de target*,
      // antes de que este listener (fase bubble en document) se ejecute.
      // Eso deja e.target — el nodo original ya sustituido — desconectado
      // del árbol, así que closest('.search-box') daba false y este
      // listener cerraba el panel justo al expandirlo. composedPath() se
      // captura antes del dispatch y no se ve afectado por esa mutación.
      const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
      const insideSearchBox = path.some(el => el.classList && el.classList.contains('search-box'));
      const onMobileBtn = path.some(el => el.id === 'mobileSearchBtn');
      if (!insideSearchBox && !onMobileBtn) {
        this._closeGlobalSearch();
        this._closeMobileSearch(false);
      }
    });

    // Welcome streak
    this.updateStreakAndDate();
    if (this.state.streak > 1) {
      setTimeout(() => this.showToast(`🔥 ${this.state.streak} ${i18n.t('streak_label')} — ${i18n.t('streak_keep_going')}`, 'success'), 1000);
    }

    // Drawer móvil (2026-07-21): en móvil el sidebar arranca cerrado (fuera de
    // pantalla) pero sus focusables seguían siendo tabulables — inert inicial.
    // Al cruzar el breakpoint se quita/pone: inert en el sidebar visible de
    // desktop sería un bug. Listener de sistema (no de layout) — permitido.
    // Guards por el arnés mockeado: sin matchMedia, o con un MediaQueryList
    // plano sin addEventListener.
    if (typeof matchMedia === 'function') {
      const mq = matchMedia('(max-width: 768px)');
      const sidebar = document.getElementById('sidebar');
      if (mq.matches && sidebar && !sidebar.classList.contains('mobile-open')) {
        sidebar.setAttribute('inert', '');
      }
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', (ev) => {
          const sb = document.getElementById('sidebar');
          if (!sb) return;
          if (ev.matches) {
            if (!sb.classList.contains('mobile-open')) sb.setAttribute('inert', '');
          } else {
            // Cruzar a desktop con el drawer abierto (p. ej. rotar una tablet
            // en 768px) dejaba mobile-open/drawer-open pegados — scrim y
            // scroll-lock atascados hasta un clic suelto (hallazgo I1). Cerrar
            // el drawer entero, no solo quitar inert.
            this._setDrawerOpen(false);
            sb.removeAttribute('inert');
          }
        });
      }

      // Rotación en móvil físico (2026-08-06): iOS Safari no re-clampa
      // window.scrollY contra la nueva altura del documento al rotar — con el
      // scroll casi al final de una lección, retrato→apaisado→retrato deja el
      // viewport más allá del contenido (pantalla en blanco, solo el FAB fixed)
      // hasta que un tap fuerza el re-clamp de WebKit. Reproducimos el tap:
      // sobre la mq de orientación (no la de 768px — el apaisado de un móvil
      // pequeño no cruza ese breakpoint) y tras el settle de 250ms estándar del
      // repo (el layout aún no está asentado cuando la mq dispara).
      const mqOrient = matchMedia('(orientation: portrait)');
      if (typeof mqOrient.addEventListener === 'function') {
        mqOrient.addEventListener('change', () => {
          // Ráfaga, no chequeo único: el overlay de diagnóstico demostró (en
          // dispositivo, 2026-08-06) que a los 250ms WebKit aún reporta un
          // estado sano y la corrupción del viewport llega después.
          [250, 700, 1300, 2000].forEach((ms) => setTimeout(() => this._clampScrollAfterRotate(), ms));
        });
      }
    }
  },

  // Re-sincroniza el scroll tras rotar si iOS lo dejó en estado inválido:
  // scrollY fuera de rango, O visual viewport desanclado del layout viewport
  // (offsetTop > 1 sin pinch-zoom — la firma que capturó el overlay:
  // scrollY=4719 = layout 1806 + drift 2913). Con pinch-zoom real (scale > 1)
  // no toca nada: un offsetTop grande ahí es legítimo. No-op absoluto en
  // rotaciones normales. El nudge son DOS scrollTo con valores distintos —
  // uno solo al valor vigente se optimiza a no-op y no re-engancha el visual
  // viewport (por eso el tap del usuario sí lo arreglaba). behavior:'auto'
  // explícito: html { scroll-behavior: smooth } es global y lo haría animado.
  _clampScrollAfterRotate() {
    if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') return;
    const vv = window.visualViewport;
    if (vv && vv.scale > 1.001) return; // zoom del usuario: jamás pelear con él
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const drift = vv ? vv.offsetTop : 0;
    const broken = window.scrollY > max || drift > 1;
    if (!broken) return;
    // Posición real del layout viewport (pageTop - offsetTop); sin
    // visualViewport, el propio scrollY. Clampada al documento actual.
    const layoutY = vv ? (vv.pageTop - vv.offsetTop) : window.scrollY;
    const target = Math.min(Math.max(0, Math.round(layoutY)), max);
    window.scrollTo({ top: target > 0 ? target - 1 : target + 1, behavior: 'auto' });
    window.scrollTo({ top: target, behavior: 'auto' });
  },

  /* ===== TTS (Text-to-Speech) ===== */
  _handleTTS(side, e) {
    if (e) e.stopPropagation();
    const card = this._currentCard;
    if (!card) return;
    const text = side === 'question' ? card.qText : card.aText;
    const langCode = card.lang === 'es' ? 'es' : 'en';

    const elementId = side === 'question' ? 'fcQuestion' : 'fcAnswer';
    const el = document.getElementById(elementId);
    const btn = el.querySelector('.fc-tts-btn');
    if (!btn) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      btn.textContent = '🔇';
      btn.classList.remove('fc-tts-playing');
      return;
    }

    btn.textContent = '🔊';
    btn.classList.add('fc-tts-playing');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const onEnd = () => {
      btn.textContent = '🔇';
      btn.classList.remove('fc-tts-playing');
    };
    utterance.onend = onEnd;
    utterance.onerror = onEnd;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this._setVoice(utterance, voices, langCode);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        this._setVoice(utterance, updatedVoices, langCode);
        window.speechSynthesis.speak(utterance);
      };
    }
  },

  _setVoice(utterance, voices, langCode) {
    const femaleKeywords = ['female', 'woman', 'mujer', 'femenina', 'girl'];
    let voice = voices.find(v =>
      v.lang.startsWith(langCode) && femaleKeywords.some(k => v.name.toLowerCase().includes(k.toLowerCase()))
    );
    if (!voice) voice = voices.find(v => v.lang.startsWith(langCode));
    if (voice) utterance.voice = voice;
  },

  /* ===== VIEW PERSISTENCE ===== */
  _saveCurrentView(view) {
    try {
      const data = { view };
      if (view === 'lesson' && this.currentLesson) {
        data.lesson = this.currentLesson;
      }
      if (this._expandedChapters && this._expandedChapters.size > 0) {
        data.expandedChapters = [...this._expandedChapters];
      }
      localStorage.setItem('mycampus_current_view', JSON.stringify(data));
    } catch (e) {}
  },

  _restoreSavedView() {
    try {
      const raw = localStorage.getItem('mycampus_current_view');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
};

// Utility
// Escape para valores que vienen de App.state cuando se interpolan en
// innerHTML: el estado se restaura de localStorage y de la fila JSONB del
// usuario en Supabase (escribible por él mismo vía la API), así que no es
// contenido de confianza como el de content.js/questions.js. Mismo criterio
// que el fix del avatar_url en auth.js: cerrar la clase, no solo un caso.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// Start authentication (Auth.init() luego llama App.init())
document.addEventListener('DOMContentLoaded', () => Auth.init());
