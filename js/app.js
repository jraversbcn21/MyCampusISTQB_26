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
  examReviewing: false,
  examChapterId: null,
  // Flashcard state
  fcCards: [],
  fcIndex: 0,
  fcFlipped: false,
  fcStats: { hard: 0, ok: 0, easy: 0 },
  fcReviewed: new Set(),

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
    };
  },

  saveState() {
    const userId = window.CAMPUS_USER_ID;
    if (typeof Sync !== 'undefined' && userId) {
      Sync.saveState(userId, this.state);
    } else {
      localStorage.setItem(`mycampus_istqb_v1_${userId || 'default'}`, JSON.stringify(this.state));
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
      time: new Date().toLocaleString(i18n.lang === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    });
    if (this.state.activityLog.length > 20) this.state.activityLog.pop();
    this.saveState();
  },

  checkAchievements() {
    Gamification.checkAchievements(this.state, (ach) => {
      this.state.xp += ach.xp;
      this.showToast(`🏆 Logro: ${ach.name[i18n.lang]} (+${ach.xp} XP)`, 'success');
      this.saveState();
    });
  },

  /* ===== NAVIGATION ===== */
  navigate(view, extra) {
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
      achievements: 'nav_achievements', lesson: 'nav_curriculum'
    };
    document.getElementById('pageTitle').textContent = i18n.t(titleMap[view] || view);

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('mobile-open');

    if (view === 'dashboard') this.renderDashboard();
    if (view === 'curriculum') this.renderCurriculum();
    if (view === 'flashcards') this.initFlashcards();
    if (view === 'simulator') this.renderSimulatorMenu();
    if (view === 'glossary') this.renderGlossary();
    if (view === 'progress') this.renderProgress();
    if (view === 'achievements') this.renderAchievements();
  },

  navigateToLesson(chapterId, topicId) {
    this.currentLesson = { chapterId, topicId };
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-lesson').classList.add('active');
    document.getElementById('pageTitle').textContent = i18n.t('nav_curriculum');
    this.renderLesson(chapterId, topicId);
  },

  /* ===== SIDEBAR ===== */
  updateSidebar() {
    const lvl = Gamification.getLevel(this.state.xp);
    const progress = Gamification.getLevelProgress(this.state.xp);
    // Nombre: localStorage > metadata de Auth > email prefix
    const displayName = (() => {
      if (typeof Auth !== 'undefined' && Auth.user) {
        const uid = Auth.user.id;
        const saved = localStorage.getItem(`mycampus_displayname_${uid}`);
        if (saved) return saved;
        const meta = Auth.user.user_metadata || {};
        return meta.full_name || meta.name || Auth.user.email?.split('@')[0] || 'Estudiante';
      }
      return 'Estudiante';
    })();
    document.getElementById('userName').textContent = displayName;
    document.getElementById('userLevel').textContent = `${i18n.lang === 'es' ? 'Nivel' : 'Level'} ${lvl.level} · ${lvl.name[i18n.lang]}`;
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
        <div class="continue-item" onclick="App.navigate('curriculum')">
          <div class="continue-item-icon">${ch.icon}</div>
          <div style="flex:1">
            <div class="continue-item-title">${ch.title[i18n.lang]}</div>
            <div class="continue-item-sub">${done}/${ch.topics.length} ${i18n.lang === 'es' ? 'temas' : 'topics'} · ${ch.duration[i18n.lang]}</div>
            <div class="continue-item-progress">
              <div class="continue-item-fill" style="width:${pct}%;background:${colors[i]}"></div>
            </div>
          </div>
          <span style="color:${colors[i]};font-weight:700">${pct}%</span>
        </div>`;
    }).join('');
    container.innerHTML = html;
  },

  renderDailyChallenge() {
    const container = document.getElementById('dailyChallenge');
    const today = new Date().toDateString();
    const isDone = this.state.dailyChallengeDate === today && this.state.dailyChallengeCompleted;

    if (isDone) {
      container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--success)">✅ ${i18n.lang === 'es' ? '¡Desafío completado hoy!' : 'Challenge completed today!'}</div>`;
      return;
    }

    const seed = new Date().getDate() + new Date().getMonth() * 31;
    const q = QUESTIONS[seed % QUESTIONS.length];
    const lang = i18n.lang;
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="dc-question">${q.q[lang]}</div>
      <div class="dc-options" id="dcOptions">
        ${q.options[lang].map((opt, i) => `
          <div class="dc-option" onclick="App.answerDailyChallenge(${i}, ${q.correct})" id="dcOpt${i}">
            <span class="dc-label">${letters[i]}</span>${opt}
          </div>`).join('')}
      </div>`;
  },

  answerDailyChallenge(selected, correct) {
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
      this.addXP(20, i18n.lang === 'es' ? 'Desafío diario completado' : 'Daily challenge completed');
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
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🏆</div><p>${i18n.t('no_achievements')}</p></div>`;
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
        const statusIcon = isCompleted ? '✓' : (hasLesson ? '▶' : '🔒');
        return `
          <div class="topic-item" onclick="${hasLesson ? `App.navigateToLesson(${ch.id}, '${t.id}')` : ''}">
            <div class="topic-status ${statusClass}">${statusIcon}</div>
            <span class="topic-title">${t.title[i18n.lang]}</span>
            <span class="topic-xp">+${t.xp} XP</span>
          </div>`;
      }).join('');

      return `
        <div class="chapter-card" id="chapter-${i}">
          <div class="chapter-card-header" onclick="App.toggleChapter(${i})">
            <div class="chapter-number" style="background:${colorsBg[i]};color:${colors[i]}">${i + 1}</div>
            <div class="chapter-info">
              <div class="chapter-title">${ch.icon} ${ch.title[i18n.lang]}</div>
              <div class="chapter-meta">${total} ${i18n.lang === 'es' ? 'temas' : 'topics'} · ${ch.duration[i18n.lang]}</div>
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
                <span class="cpring-text" style="color:${colors[i]}">${pct}%</span>
              </div>
              <span class="chapter-chevron">▶</span>
            </div>
          </div>
          <div class="chapter-topics">
            <div class="topic-list">${topicsHtml}</div>
          </div>
        </div>`;
    }).join('');
  },

  toggleChapter(i) {
    const card = document.getElementById(`chapter-${i}`);
    card.classList.toggle('open');
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
      content: `<div class="highlight-box">📚 ${i18n.lang === 'es' ? 'Contenido en preparación. Usa las flashcards y el simulacro para estudiar este tema.' : 'Content in preparation. Use flashcards and exam simulator to study this topic.'}</div>`
    };

    document.getElementById('lessonContainer').innerHTML = `
      <div class="lesson-title">${lessonData.title}</div>
      <div class="lesson-chapter-tag" style="background:rgba(${hexToRgb(color)},0.15);color:${color}">
        ${lessonData.chapterTag}
      </div>
      <div class="lesson-content">${lessonData.content}</div>
      <div class="lesson-actions">
        <button class="btn btn-ghost" onclick="App.navigate('curriculum')">← ${i18n.t('back_curriculum')}</button>
        <button class="lesson-complete-btn ${isCompleted ? 'completed' : ''}"
          onclick="App.completeLesson('${topicId}', ${chapterId}, ${topic.xp})"
          id="completeLessonBtn">
          ${isCompleted ? i18n.t('lesson_completed') : ('⭐ ' + i18n.t('lesson_complete') + ` (+${topic.xp} XP)`)}
        </button>
      </div>`;
  },

  completeLesson(topicId, chapterId, xp) {
    if (!this.state.completedLessons.includes(topicId)) {
      this.state.completedLessons.push(topicId);
      this.state.lessonsCompleted = this.state.completedLessons.length;
      this.saveState();
      this.addXP(xp, `${i18n.lang === 'es' ? 'Lección completada' : 'Lesson completed'}: ${topicId}`);
      this.checkAchievements();
      const btn = document.getElementById('completeLessonBtn');
      if (btn) {
        btn.textContent = i18n.t('lesson_completed');
        btn.classList.add('completed');
      }
    }
  },

  /* ===== FLASHCARDS ===== */
  initFlashcards() {
    this.fcIndex = 0;
    this.fcFlipped = false;
    this.fcStats = { hard: 0, ok: 0, easy: 0 };
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
    this.showToast(i18n.lang === 'es' ? '🔀 Flashcards mezcladas' : '🔀 Flashcards shuffled', 'info');
  },

  renderFlashcard() {
    if (!this.fcCards.length) return;
    const card = this.fcCards[this.fcIndex];
    const lang = i18n.lang;

    document.getElementById('fcTag').textContent = card.chapterTag[lang];
    document.getElementById('fcQuestion').textContent = card.q[lang];
    document.getElementById('fcAnswer').textContent = card.a[lang];
    document.getElementById('cardCounter').textContent = `${this.fcIndex + 1}/${this.fcCards.length}`;

    const inner = document.getElementById('flashcardInner');
    inner.classList.remove('flipped');
    this.fcFlipped = false;

    document.getElementById('fcHard').textContent = this.fcStats.hard;
    document.getElementById('fcOk').textContent = this.fcStats.ok;
    document.getElementById('fcEasy').textContent = this.fcStats.easy;
  },

  flipFlashcard() {
    const inner = document.getElementById('flashcardInner');
    this.fcFlipped = !this.fcFlipped;
    inner.classList.toggle('flipped', this.fcFlipped);
  },

  nextFlashcard() {
    if (this.fcIndex < this.fcCards.length - 1) {
      this.fcIndex++;
      this.renderFlashcard();
    }
  },

  prevFlashcard() {
    if (this.fcIndex > 0) {
      this.fcIndex--;
      this.renderFlashcard();
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
        this.addXP(10, i18n.lang === 'es' ? 'Flashcards repasadas' : 'Flashcards reviewed');
      }
      this.checkAchievements();
    }
    this.nextFlashcard();
    if (this.fcIndex >= this.fcCards.length - 1) {
      this.showToast(i18n.lang === 'es' ? '🎉 ¡Mazo completado!' : '🎉 Deck completed!', 'success');
    }
  },

  /* ===== SIMULATOR ===== */
  renderSimulatorMenu() {
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
        title: lang === 'es' ? 'Examen Completo' : 'Full Exam',
        desc: lang === 'es' ? '40 preguntas · 60 minutos · Simula el examen real' : '40 questions · 60 minutes · Real exam simulation',
        tags: lang === 'es' ? ['40 preguntas', '60 min', 'Todos los temas'] : ['40 questions', '60 min', 'All topics'],
        type: 'full',
        locked: !fullUnlocked,
        lockMsg: lang === 'es' ? `Aprueba todos los capítulos (${passedCount}/${CHAPTERS.length})` : `Pass all chapters (${passedCount}/${CHAPTERS.length})`,
        btnClass: 'btn-primary'
      },
      {
        icon: '⚡',
        title: lang === 'es' ? 'Examen Rápido' : 'Quick Exam',
        desc: lang === 'es' ? '20 preguntas · 30 minutos · Repaso veloz' : '20 questions · 30 minutes · Quick review',
        tags: lang === 'es' ? ['20 preguntas', '30 min', 'Aleatorio'] : ['20 questions', '30 min', 'Random'],
        type: 'quick',
        locked: !quickUnlocked,
        lockMsg: lang === 'es' ? `Aprueba 3 capítulos (${passedCount}/3)` : `Pass 3 chapters (${passedCount}/3)`,
        btnClass: 'btn-secondary'
      },
      {
        icon: '🎯',
        title: lang === 'es' ? 'Quiz por Capítulo' : 'Chapter Quiz',
        desc: lang === 'es' ? 'Sin límite de tiempo · Avanza por el curriculum' : 'No time limit · Progress through the curriculum',
        tags: lang === 'es' ? ['Sin límite', 'Por tema'] : ['No limit', 'By topic'],
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
        <span>${e.date}</span>
        <span style="color:var(--text2)">${e.questions} ${lang === 'es' ? 'preguntas' : 'questions'}</span>
        <span class="exam-history-score ${e.score >= 65 ? 'pass' : 'fail'}">${e.score}%</span>
      </div>`).join('');
  },

  _renderSimCard({ icon, title, desc, tags, type, locked, lockMsg, btnClass }) {
    const lang = i18n.lang;
    if (locked) {
      return `
        <div class="sim-card sim-card-locked">
          <div class="sim-lock-icon">🔒</div>
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
        <button class="btn ${btnClass}">${lang === 'es' ? 'Iniciar' : 'Start'}</button>
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
        const badge = isPassed ? ' ✅' : (!isUnlocked ? ' 🔒' : '');
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
    this.launchExam(type === 'full' ? i18n.lang === 'es' ? 'Examen Completo' : 'Full Exam' : i18n.lang === 'es' ? 'Examen Rápido' : 'Quick Exam');
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
            <div class="exam-option ${cls}" onclick="${isReviewing ? '' : `App.selectAnswer(${i})`}" id="opt${i}">
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
      ? (i18n.lang === 'es' ? 'Finalizar' : 'Finish')
      : i18n.t('next');
  },

  renderExamDots() {
    const dots = document.getElementById('examDots');
    dots.innerHTML = this.examQuestions.map((_, i) => {
      const cls = i === this.examCurrentQ ? 'current' : (this.examAnswers[i] !== undefined ? 'answered' : '');
      return `<div class="exam-dot ${cls}" onclick="App.goToQuestion(${i})">${i + 1}</div>`;
    }).join('');
  },

  selectAnswer(optIndex) {
    this.examAnswers[this.examCurrentQ] = optIndex;
    this.renderExamQuestion();
    this.renderExamDots();
  },

  goToQuestion(i) {
    this.examCurrentQ = i;
    this.renderExamQuestion();
    this.renderExamDots();
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
    const total = this.examQuestions.length;
    let correct = 0;
    this.examQuestions.forEach((q, i) => {
      if (this.examAnswers[i] === q.correct) correct++;
    });
    const score = Math.round((correct / total) * 100);
    const passed = score >= 65;
    const timeUsed = this.examTimeLeft > 0 ? (this.examType === 'full' ? 3600 : 1800) - this.examTimeLeft : 0;

    this.state.examsCompleted++;
    if (score > this.state.bestScore) this.state.bestScore = score;
    const date = new Date().toLocaleDateString(i18n.lang === 'es' ? 'es-ES' : 'en-US');
    this.state.examHistory.push({ score, date, questions: total, type: this.examType, correct, time: timeUsed });

    // Handle chapter quiz unlock progression
    if (this.examType === 'chapter' && this.examChapterId !== null && passed) {
      if (!this.state.chapterQuizPassed[this.examChapterId]) {
        this.state.chapterQuizPassed[this.examChapterId] = true;
        const passedCount = Object.values(this.state.chapterQuizPassed).filter(Boolean).length;
        const nextCh = CHAPTERS[this.examChapterId + 1];
        if (nextCh) {
          setTimeout(() => this.showToast(`🔓 ${i18n.lang === 'es' ? 'Desbloqueado:' : 'Unlocked:'} ${nextCh.title[i18n.lang]}`, 'success'), 1200);
        }
        if (passedCount === 3) {
          setTimeout(() => this.showToast(`⚡ ${i18n.lang === 'es' ? '¡Examen Rápido desbloqueado!' : 'Quick Exam unlocked!'}`, 'success'), 2200);
        }
        if (passedCount === CHAPTERS.length) {
          setTimeout(() => this.showToast(`📋 ${i18n.lang === 'es' ? '¡Simulacro Final desbloqueado!' : 'Full Exam unlocked!'}`, 'success'), 2200);
        }
      }
    }

    this.saveState();
    this.checkAchievements();

    const xpEarned = Math.round(score * 0.5) + (passed ? 50 : 10);
    this.addXP(xpEarned, i18n.lang === 'es' ? `Simulacro completado (${score}%)` : `Mock exam completed (${score}%)`);

    document.getElementById('examMode').style.display = 'none';
    document.getElementById('examResults').style.display = 'block';
    document.getElementById('resultsEmoji').textContent = passed ? '🎉' : '💪';
    document.getElementById('resultsScore').textContent = score + '%';
    document.getElementById('resultsScore').style.color = passed ? 'var(--success)' : 'var(--danger)';
    const verdict = document.getElementById('resultsVerdict');
    verdict.textContent = passed ? i18n.t('exam_passed') : i18n.t('exam_failed');
    verdict.className = 'results-verdict ' + (passed ? 'pass' : 'fail');

    const minToPass = Math.ceil(total * 0.65);
    document.getElementById('resultsStats').innerHTML = `
      <div class="result-stat"><div class="result-stat-val text-success">${correct}</div><div class="result-stat-label">${i18n.t('correct_answers')}</div></div>
      <div class="result-stat"><div class="result-stat-val text-danger">${total - correct}</div><div class="result-stat-label">${i18n.t('wrong_answers')}</div></div>
      <div class="result-stat"><div class="result-stat-val">${score}%</div><div class="result-stat-label">${i18n.t('score_label')}</div></div>
      <div class="result-stat"><div class="result-stat-val text-primary">+${xpEarned}</div><div class="result-stat-label">XP ${i18n.lang === 'es' ? 'ganados' : 'earned'}</div></div>
    `;

    const lang = i18n.lang;
    const letters = ['A', 'B', 'C', 'D'];
    const wrongOnes = this.examQuestions.filter((q, i) => this.examAnswers[i] !== q.correct);
    document.getElementById('resultsReview').innerHTML = `
      <h3>${i18n.lang === 'es' ? 'Revisión de respuestas incorrectas' : 'Review of wrong answers'} (${wrongOnes.length})</h3>
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

    const letters = [...new Set(GLOSSARY.map(g => g.term[0].toUpperCase()))].sort();
    const filtersEl = document.getElementById('glossaryFilters');
    if (filtersEl && !filtersEl.hasChildNodes()) {
      filtersEl.innerHTML = `<button class="filter-btn active" onclick="App.filterGlossary('all', this)">${i18n.lang === 'es' ? 'Todos' : 'All'}</button>` +
        letters.map(l => `<button class="filter-btn" onclick="App.filterGlossary('${l}', this)">${l}</button>`).join('');
    }

    let items = GLOSSARY;
    if (search) {
      items = items.filter(g => g.term.toLowerCase().includes(search) || g.def[lang].toLowerCase().includes(search));
    }
    if (filter && filter !== 'all') {
      items = items.filter(g => g.term[0].toUpperCase() === filter);
    }

    const chapterNames = { '1': 'Cap.1', '2': 'Cap.2', '3': 'Cap.3', '4': 'Cap.4', '5': 'Cap.5' };
    document.getElementById('glossaryList').innerHTML = items.map(g => `
      <div class="glossary-item">
        <div class="glossary-term">${g.term}</div>
        <div class="glossary-def">${g.def[lang]}</div>
        <div class="glossary-chapter">${chapterNames[g.chapter] || ''}</div>
      </div>`).join('') || `<div class="empty-state"><p>${i18n.lang === 'es' ? 'No se encontraron términos' : 'No terms found'}</p></div>`;
  },

  filterGlossary(letter, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
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
      <div class="progress-stat-big"><div class="progress-stat-big-val text-primary">${this.state.xp}</div><div class="progress-stat-big-label">XP ${lang === 'es' ? 'Total' : 'Total'}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val" style="color:var(--warning)">${lvl.icon} ${lang === 'es' ? 'Nivel' : 'Level'} ${lvl.level}</div><div class="progress-stat-big-label">${lvl.name[lang]}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val text-success">${done}/${totalLessons}</div><div class="progress-stat-big-label">${lang === 'es' ? 'Lecciones' : 'Lessons'}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val" style="color:var(--secondary)">${this.state.examsCompleted}</div><div class="progress-stat-big-label">${lang === 'es' ? 'Simulacros' : 'Exams'}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val" style="color:var(--warning)">🔥 ${this.state.streak}</div><div class="progress-stat-big-label">${i18n.t('streak_label')}</div></div>
      <div class="progress-stat-big"><div class="progress-stat-big-val">${avgScore}%</div><div class="progress-stat-big-label">${lang === 'es' ? 'Promedio examen' : 'Avg exam score'}</div></div>
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
            return `<div style="flex:1;height:${h}px;background:${color};border-radius:4px 4px 0 0;position:relative;min-width:20px" title="${e.score}%">
              <span style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:0.6rem;font-weight:700;color:${color};white-space:nowrap">${e.score}%</span>
              <span style="position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:0.6rem;color:var(--text3);white-space:nowrap">${e.date.split('/').slice(0,2).join('/')}</span>
            </div>`;
          }).join('')}
        </div>
        <div style="text-align:center;margin-top:8px;font-size:0.75rem;color:var(--text3)">${lang === 'es' ? 'Línea de aprobado: 65%' : 'Pass line: 65%'}</div>`;
    } else {
      document.getElementById('examPerformanceChart').innerHTML = `<div class="empty-state"><p>${i18n.t('no_exams_yet')}</p></div>`;
    }

    const acts = this.state.activityLog;
    document.getElementById('activityLog').innerHTML = acts.length ? acts.map(a => `
      <div class="activity-item">
        <span class="activity-icon">⭐</span>
        <span class="activity-text">${a.text}</span>
        <span class="activity-xp">+${a.xp} XP</span>
        <span class="activity-time">${a.time}</span>
      </div>`).join('') : `<div class="empty-state"><p>${i18n.t('no_activities')}</p></div>`;
  },

  /* ===== ACHIEVEMENTS ===== */
  renderAchievements() {
    const unlocked = this.state.achievements || [];
    const totalXP = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).reduce((s, a) => s + a.xp, 0);
    const lang = i18n.lang;

    document.getElementById('achievementsSummary').innerHTML = `
      <div class="achievements-summary-icon">🏆</div>
      <div class="achievements-summary-text">
        <h3>${unlocked.length} / ${ACHIEVEMENTS.length} ${lang === 'es' ? 'logros desbloqueados' : 'achievements unlocked'}</h3>
        <p>${totalXP} XP ${lang === 'es' ? 'ganados en logros' : 'earned from achievements'}</p>
      </div>`;

    document.getElementById('achievementsGrid').innerHTML = ACHIEVEMENTS.map(a => {
      const isUnlocked = unlocked.includes(a.id);
      return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          ${isUnlocked ? '<div class="achievement-unlocked-badge">✓</div>' : ''}
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-name">${a.name[lang]}</div>
          <div class="achievement-desc">${a.desc[lang]}</div>
          <div class="achievement-xp">+${a.xp} XP</div>
          <div style="font-size:0.7rem;color:${isUnlocked ? 'var(--success)' : 'var(--text3)'}">${isUnlocked ? '✓ ' + i18n.t('unlocked_on') : '🔒 ' + i18n.t('locked')}</div>
        </div>`;
    }).join('');
  },

  /* ===== TOASTS ===== */
  showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
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

  /* ===== LANGUAGE ===== */
  setLang(lang) {
    i18n.lang = lang;
    localStorage.setItem('mycampus_lang', lang);
    document.getElementById('btnES').classList.toggle('active', lang === 'es');
    document.getElementById('btnEN').classList.toggle('active', lang === 'en');
    i18n.apply();
    this.navigate(this.currentView);
  },

  /* ===== THEME ===== */
  toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') !== 'light';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('mycampus_theme', isDark ? 'light' : 'dark');
  },

  /* ===== INIT ===== */
  init(preloadedState) {
    this._initialized = true;
    this.state = preloadedState || this.loadState();

    // Restore lang
    const savedLang = localStorage.getItem('mycampus_lang') || 'es';
    i18n.lang = savedLang;
    document.getElementById('btnES').classList.toggle('active', savedLang === 'es');
    document.getElementById('btnEN').classList.toggle('active', savedLang === 'en');
    i18n.apply();

    // Restore theme
    const savedTheme = localStorage.getItem('mycampus_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').textContent = savedTheme === 'light' ? '☀️' : '🌙';

    this.updateSidebar();
    this.navigate('dashboard');

    // Event listeners
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });
    document.querySelector('.logo-icon').addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
      } else {
        sidebar.classList.add('mobile-open');
      }
    });
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

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
      if (confirm(i18n.lang === 'es' ? '¿Seguro que deseas finalizar el examen?' : 'Are you sure you want to finish the exam?')) {
        this.finishExam();
      }
    });

    document.getElementById('glossarySearch').addEventListener('input', (e) => {
      this.renderGlossary();
      if (e.target.value.length > 2) {
        this.state.glossarySearches++;
        this.saveState();
      }
    });

    document.getElementById('globalSearch').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const glossarySearchEl = document.getElementById('glossarySearch');

      if (q.length <= 2) {
        // Bug fix: limpiar el glosario cuando se borra la búsqueda
        if (glossarySearchEl.value) {
          glossarySearchEl.value = '';
          if (this.currentView === 'glossary') this.renderGlossary();
        }
        return;
      }

      // Buscar en términos Y definiciones del glosario
      const glossaryMatch = GLOSSARY.find(g =>
        g.term.toLowerCase().includes(q) || g.def[i18n.lang].toLowerCase().includes(q)
      );
      if (glossaryMatch) {
        // Bug fix: setear el valor ANTES de navegar para evitar flash sin filtro
        glossarySearchEl.value = q;
        this.navigate('glossary');
        return;
      }

      // Buscar en títulos de capítulos y temas del curriculum
      const chapterMatch = CHAPTERS.find(ch =>
        ch.title[i18n.lang].toLowerCase().includes(q) ||
        ch.topics.some(t => t.title[i18n.lang].toLowerCase().includes(q))
      );
      if (chapterMatch) {
        this.navigate('curriculum');
      }
    });

    // Stripe/monetization placeholder
    console.log('MyCampus ISTQB v1.0 — Listo para monetización');

    // Welcome streak
    this.updateStreakAndDate();
    if (this.state.streak > 1) {
      setTimeout(() => this.showToast(`🔥 ${this.state.streak} ${i18n.t('streak_label')} — ¡Sigue así!`, 'success'), 1000);
    }
  }
};

// Utility
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// Start authentication (Auth.init() luego llama App.init())
document.addEventListener('DOMContentLoaded', () => Auth.init());
