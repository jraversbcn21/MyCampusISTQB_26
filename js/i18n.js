/* ===================================================
   MyCampus ISTQB — Internationalization (ES/EN)
   =================================================== */

const TRANSLATIONS = {
  es: {
    // NAV
    nav_main: "Principal",
    nav_dashboard: "Dashboard",
    nav_curriculum: "Curriculum",
    nav_flashcards: "Flashcards",
    nav_simulator: "Simulacros",
    nav_resources: "Recursos",
    nav_glossary: "Glosario",
    nav_progress: "Progreso",
    nav_achievements: "Logros",
    streak_label: "días seguidos",

    // DASHBOARD
    welcome_title: "¡Bienvenido a MyCampus ISTQB!",
    welcome_sub: "Tu centro de preparación para la certificación ISTQB Foundation Level v4.0",
    stat_chapters: "Capítulos",
    stat_flashcards_studied: "Flashcards repasadas",
    stat_exams: "Simulacros completados",
    stat_xp: "Experiencia total",
    continue_studying: "Continuar estudiando",
    daily_challenge: "Desafío diario",
    exam_readiness: "Preparación para el examen",
    chapters_completed: "Capítulos completados",
    avg_score: "Promedio en exámenes",
    flashcards_mastered: "Flashcards dominadas",
    recent_achievements: "Logros recientes",
    see_all: "Ver todo",

    // CURRICULUM
    curriculum_title: "Plan de Estudio ISTQB FL v4.0",
    curriculum_sub: "Basado en el Syllabus oficial ISTQB CTFL v4.0.1 — 6 capítulos · 1135 minutos de estudio",
    back_curriculum: "Volver al curriculum",

    // CHAPTERS (short)
    all_decks: "Todos los mazos",
    ch1_short: "Cap. 1 · Fundamentos",
    ch2_short: "Cap. 2 · SDLC",
    ch3_short: "Cap. 3 · Testing Estático",
    ch4_short: "Cap. 4 · Técnicas",
    ch5_short: "Cap. 5 · Gestión",
    ch6_short: "Cap. 6 · Herramientas",

    // FLASHCARDS
    flashcards_title: "Flashcards",
    flashcards_sub: "Repasa conceptos clave con tarjetas de memoria interactivas",
    shuffle: "Mezclar",
    click_to_flip: "Haz clic para ver la respuesta",
    rate_card: "¿Qué tan bien lo sabías?",
    rating_hard: "Difícil",
    rating_ok: "Regular",
    rating_easy: "Fácil",

    // SIMULATOR
    simulator_title: "Simulacros de Examen",
    simulator_sub: "Practica con preguntas tipo ISTQB Foundation Level v4.0",
    exam_full: "Examen Completo",
    exam_full_desc: "40 preguntas · 60 minutos · Simula el examen real",
    exam_quick: "Examen Rápido",
    exam_quick_desc: "20 preguntas · 30 minutos · Repaso veloz",
    exam_chapter: "Por Capítulo",
    exam_chapter_desc: "10 preguntas · Sin límite · Enfocado en un tema",
    start_exam: "Iniciar examen",
    exam_history: "Historial de simulacros",
    select_chapter: "Selecciona un capítulo",
    cancel: "Cancelar",
    end_exam: "Finalizar",
    previous: "Anterior",
    next: "Siguiente",
    results_title: "Resultado del examen",
    new_exam: "Nuevo examen",
    study_more: "Seguir estudiando",

    // GLOSSARY
    glossary_title: "Glosario ISTQB",
    glossary_sub: "Términos y definiciones clave para la certificación Foundation Level",
    glossary_search_placeholder: "Buscar término...",
    search_placeholder: "Buscar...",

    // PROGRESS
    progress_title: "Mi Progreso",
    overview: "Resumen general",
    chapter_progress: "Progreso por capítulo",
    exam_performance: "Rendimiento en exámenes",
    activity_log: "Actividad reciente",

    // ACHIEVEMENTS
    achievements_title: "Logros y Recompensas",
    achievements_sub: "Desbloquea insignias completando actividades de estudio",

    // MISC
    lesson_complete: "Marcar como completada",
    lesson_completed: "✓ Completada",
    xp_gained: "XP ganados",
    level_up: "¡Subiste de nivel!",
    no_exams_yet: "Aún no has realizado ningún simulacro",
    no_activities: "Aún no hay actividad registrada",
    exam_passed: "¡Aprobado! Listo para el examen real 🎉",
    exam_failed: "Sigue practicando, ¡tú puedes! 💪",
    pass_score: "Puntuación mínima: 65%",
    correct_answers: "Respuestas correctas",
    wrong_answers: "Respuestas incorrectas",
    time_used: "Tiempo utilizado",
    score_label: "Puntuación",
    question_label: "Pregunta",
    of_label: "de",
    your_answer: "Tu respuesta",
    correct_answer: "Respuesta correcta",
    explanation: "Explicación",
    no_achievements: "Aún no has desbloqueado logros",
    start_studying: "¡Empieza a estudiar para ganar tus primeros logros!",
    unlocked_on: "Desbloqueado",
    locked: "Bloqueado",
  },

  en: {
    // NAV
    nav_main: "Main",
    nav_dashboard: "Dashboard",
    nav_curriculum: "Curriculum",
    nav_flashcards: "Flashcards",
    nav_simulator: "Exams",
    nav_resources: "Resources",
    nav_glossary: "Glossary",
    nav_progress: "Progress",
    nav_achievements: "Achievements",
    streak_label: "day streak",

    // DASHBOARD
    welcome_title: "Welcome to MyCampus ISTQB!",
    welcome_sub: "Your preparation hub for the ISTQB Foundation Level v4.0 certification",
    stat_chapters: "Chapters",
    stat_flashcards_studied: "Flashcards reviewed",
    stat_exams: "Exams completed",
    stat_xp: "Total experience",
    continue_studying: "Continue studying",
    daily_challenge: "Daily challenge",
    exam_readiness: "Exam readiness",
    chapters_completed: "Chapters completed",
    avg_score: "Average exam score",
    flashcards_mastered: "Flashcards mastered",
    recent_achievements: "Recent achievements",
    see_all: "See all",

    // CURRICULUM
    curriculum_title: "ISTQB FL v4.0 Study Plan",
    curriculum_sub: "Based on the official ISTQB CTFL v4.0.1 Syllabus — 6 chapters · 1135 minutes of study",
    back_curriculum: "Back to curriculum",

    // CHAPTERS (short)
    all_decks: "All decks",
    ch1_short: "Ch. 1 · Fundamentals",
    ch2_short: "Ch. 2 · SDLC",
    ch3_short: "Ch. 3 · Static Testing",
    ch4_short: "Ch. 4 · Techniques",
    ch5_short: "Ch. 5 · Management",
    ch6_short: "Ch. 6 · Tools",

    // FLASHCARDS
    flashcards_title: "Flashcards",
    flashcards_sub: "Review key concepts with interactive memory cards",
    shuffle: "Shuffle",
    click_to_flip: "Click to see the answer",
    rate_card: "How well did you know it?",
    rating_hard: "Hard",
    rating_ok: "OK",
    rating_easy: "Easy",

    // SIMULATOR
    simulator_title: "Exam Simulator",
    simulator_sub: "Practice with ISTQB Foundation Level v4.0 style questions",
    exam_full: "Full Exam",
    exam_full_desc: "40 questions · 60 minutes · Simulates the real exam",
    exam_quick: "Quick Exam",
    exam_quick_desc: "20 questions · 30 minutes · Fast review",
    exam_chapter: "By Chapter",
    exam_chapter_desc: "10 questions · No time limit · Topic focused",
    start_exam: "Start exam",
    exam_history: "Exam history",
    select_chapter: "Select a chapter",
    cancel: "Cancel",
    end_exam: "Finish",
    previous: "Previous",
    next: "Next",
    results_title: "Exam result",
    new_exam: "New exam",
    study_more: "Keep studying",

    // GLOSSARY
    glossary_title: "ISTQB Glossary",
    glossary_sub: "Key terms and definitions for the Foundation Level certification",
    glossary_search_placeholder: "Search term...",
    search_placeholder: "Search...",

    // PROGRESS
    progress_title: "My Progress",
    overview: "General overview",
    chapter_progress: "Progress by chapter",
    exam_performance: "Exam performance",
    activity_log: "Recent activity",

    // ACHIEVEMENTS
    achievements_title: "Achievements & Rewards",
    achievements_sub: "Unlock badges by completing study activities",

    // MISC
    lesson_complete: "Mark as complete",
    lesson_completed: "✓ Completed",
    xp_gained: "XP earned",
    level_up: "Level up!",
    no_exams_yet: "You haven't taken any exams yet",
    no_activities: "No activity recorded yet",
    exam_passed: "Passed! Ready for the real exam 🎉",
    exam_failed: "Keep practicing, you can do it! 💪",
    pass_score: "Minimum passing score: 65%",
    correct_answers: "Correct answers",
    wrong_answers: "Wrong answers",
    time_used: "Time used",
    score_label: "Score",
    question_label: "Question",
    of_label: "of",
    your_answer: "Your answer",
    correct_answer: "Correct answer",
    explanation: "Explanation",
    no_achievements: "No achievements unlocked yet",
    start_studying: "Start studying to earn your first achievements!",
    unlocked_on: "Unlocked",
    locked: "Locked",
  }
};

// i18n helpers
const i18n = {
  lang: 'es',
  t(key) {
    return (TRANSLATIONS[this.lang] && TRANSLATIONS[this.lang][key]) ||
           (TRANSLATIONS['es'] && TRANSLATIONS['es'][key]) || key;
  },
  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    document.documentElement.lang = this.lang;
  }
};
