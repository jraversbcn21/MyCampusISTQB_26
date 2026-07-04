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
    exam_chapter: "Quiz por Capítulo",
    exam_chapter_desc: "Sin límite de tiempo · Avanza por el curriculum",
    start_exam: "Iniciar",
    exam_history: "Historial de simulacros",
    sim_full_tags: ["40 preguntas", "60 min", "Todos los temas"],
    sim_quick_tags: ["20 preguntas", "30 min", "Aleatorio"],
    sim_chapter_tags: ["Sin límite", "Por tema"],
    unlock_all_chapters: "Aprueba todos los capítulos",
    unlock_3_chapters: "Aprueba 3 capítulos",
    confirm_finish_exam: "¿Seguro que deseas finalizar el examen?",
    wrong_answers_review_title: "Revisión de respuestas incorrectas",
    mock_exam_completed_activity: "Simulacro completado",
    quick_exam_unlocked_toast: "¡Examen Rápido desbloqueado!",
    full_exam_unlocked_toast: "¡Simulacro Final desbloqueado!",
    unlocked_prefix: "Desbloqueado:",
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
    correct_answers: "Respuestas correctas",
    wrong_answers: "Respuestas incorrectas",
    score_label: "Puntuación",
    question_label: "Pregunta",
    of_label: "de",
    your_answer: "Tu respuesta",
    correct_answer: "Respuesta correcta",
    no_achievements: "Aún no has desbloqueado logros",
    unlocked_on: "Desbloqueado",
    locked: "Bloqueado",
    level_label: "Nivel",
    topics_label: "temas",
    challenge_completed_today: "¡Desafío completado hoy!",
    daily_challenge_completed_activity: "Desafío diario completado",
    lesson_content_wip: "Contenido en preparación. Usa las flashcards y el simulacro para estudiar este tema.",
    lesson_completed_activity: "Lección completada",
    flashcards_shuffled_toast: "🔀 Flashcards mezcladas",
    flashcards_reviewed_activity: "Flashcards repasadas",
    deck_completed_toast: "🎉 ¡Mazo completado!",
    date_locale: "es-ES",
    read_question_aria: "Leer pregunta",
    read_answer_aria: "Leer respuesta",
    questions_count_label: "preguntas",
    all_label: "Todos",
    no_terms_found: "No se encontraron términos",
    total_label: "Total",
    lessons_label: "Lecciones",
    avg_exam_score_label: "Promedio examen",
    pass_line_label: "Línea de aprobado: 65%",
    achievements_unlocked_label: "logros desbloqueados",
    earned_from_achievements_label: "ganados en logros",
    onboarding_skip: "Saltar tour",
    onboarding_next: "Siguiente →",
    onboarding_start: "¡Comenzar! 🚀",
    change_avatar_title: "Cambiar avatar",
    edit_name_title: "Editar nombre",
    avatar_modal_title: "Elige tu perfil de tester",
    avatar_modal_sub: "Tu avatar refleja tu estilo como tester. Puedes cambiarlo cuando quieras.",
    avatar_save: "Guardar avatar",
    logout_label: "Salir",
    logout_title: "Cerrar sesión",
    collapse_menu_title: "Colapsar menú",
    theme_toggle_title: "Cambiar tema",
    streak_keep_going: "¡Sigue así!",
    student_fallback: "Estudiante",
    glossary_ch_tag: "Cap.",
    privacy_link: "Política de privacidad",

    // AUTH
    auth_login_tab: "Iniciar sesión",
    auth_register_tab: "Registrarse",
    auth_submit_register: "Crear cuenta",
    auth_name_label: "Nombre",
    auth_name_placeholder: "¿Cómo te llamamos?",
    auth_email_label: "Email",
    auth_email_placeholder: "tu@email.com",
    auth_password_label: "Contraseña",
    auth_forgot_password: "¿Olvidaste tu contraseña?",
    auth_divider: "o continuar con",
    auth_google_btn: "Continuar con Google",
    auth_confirm_email_msg: "✅ Revisa tu email para confirmar tu cuenta.",
    auth_enter_email_first: "Ingresa tu email primero.",
    auth_reset_sent_msg: "✅ Se envió un link de recuperación a tu email.",
    auth_err_generic: "Ocurrió un error. Intenta nuevamente.",
    auth_err_invalid_credentials: "Email o contraseña incorrectos.",
    auth_err_email_not_confirmed: "Confirma tu email antes de ingresar.",
    auth_err_already_registered: "Ya existe una cuenta con ese email.",
    auth_err_password_length: "La contraseña debe tener al menos 6 caracteres.",
    auth_err_invalid_email: "Formato de email inválido.",
    auth_err_rate_limit: "Demasiados intentos. Espera unos minutos.",
    auth_load_failure_msg: "No se pudo cargar el servicio de autenticación. Comprueba tu conexión a internet y recarga la página.",
    auth_missing_modules_msg: "Error al cargar la aplicación. Recarga la página; si el problema persiste, contacta soporte.",
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
    exam_chapter: "Chapter Quiz",
    exam_chapter_desc: "No time limit · Progress through the curriculum",
    start_exam: "Start",
    exam_history: "Exam history",
    sim_full_tags: ["40 questions", "60 min", "All topics"],
    sim_quick_tags: ["20 questions", "30 min", "Random"],
    sim_chapter_tags: ["No limit", "By topic"],
    unlock_all_chapters: "Pass all chapters",
    unlock_3_chapters: "Pass 3 chapters",
    confirm_finish_exam: "Are you sure you want to finish the exam?",
    wrong_answers_review_title: "Review of wrong answers",
    mock_exam_completed_activity: "Mock exam completed",
    quick_exam_unlocked_toast: "Quick Exam unlocked!",
    full_exam_unlocked_toast: "Full Exam unlocked!",
    unlocked_prefix: "Unlocked:",
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
    correct_answers: "Correct answers",
    wrong_answers: "Wrong answers",
    score_label: "Score",
    question_label: "Question",
    of_label: "of",
    your_answer: "Your answer",
    correct_answer: "Correct answer",
    no_achievements: "No achievements unlocked yet",
    unlocked_on: "Unlocked",
    locked: "Locked",
    level_label: "Level",
    topics_label: "topics",
    challenge_completed_today: "Challenge completed today!",
    daily_challenge_completed_activity: "Daily challenge completed",
    lesson_content_wip: "Content in preparation. Use flashcards and exam simulator to study this topic.",
    lesson_completed_activity: "Lesson completed",
    flashcards_shuffled_toast: "🔀 Flashcards shuffled",
    flashcards_reviewed_activity: "Flashcards reviewed",
    deck_completed_toast: "🎉 Deck completed!",
    date_locale: "en-US",
    read_question_aria: "Read question",
    read_answer_aria: "Read answer",
    questions_count_label: "questions",
    all_label: "All",
    no_terms_found: "No terms found",
    total_label: "Total",
    lessons_label: "Lessons",
    avg_exam_score_label: "Avg exam score",
    pass_line_label: "Pass line: 65%",
    achievements_unlocked_label: "achievements unlocked",
    earned_from_achievements_label: "earned from achievements",
    onboarding_skip: "Skip tour",
    onboarding_next: "Next →",
    onboarding_start: "Let's start! 🚀",
    change_avatar_title: "Change avatar",
    edit_name_title: "Edit name",
    avatar_modal_title: "Choose your tester profile",
    avatar_modal_sub: "Your avatar reflects your style as a tester. You can change it anytime.",
    avatar_save: "Save avatar",
    logout_label: "Log out",
    logout_title: "Log out",
    collapse_menu_title: "Collapse menu",
    theme_toggle_title: "Toggle theme",
    streak_keep_going: "Keep it up!",
    student_fallback: "Student",
    glossary_ch_tag: "Ch.",
    privacy_link: "Privacy policy",

    // AUTH
    auth_login_tab: "Log in",
    auth_register_tab: "Sign up",
    auth_submit_register: "Create account",
    auth_name_label: "Name",
    auth_name_placeholder: "What should we call you?",
    auth_email_label: "Email",
    auth_email_placeholder: "you@email.com",
    auth_password_label: "Password",
    auth_forgot_password: "Forgot your password?",
    auth_divider: "or continue with",
    auth_google_btn: "Continue with Google",
    auth_confirm_email_msg: "✅ Check your email to confirm your account.",
    auth_enter_email_first: "Enter your email first.",
    auth_reset_sent_msg: "✅ A recovery link was sent to your email.",
    auth_err_generic: "Something went wrong. Please try again.",
    auth_err_invalid_credentials: "Incorrect email or password.",
    auth_err_email_not_confirmed: "Confirm your email before signing in.",
    auth_err_already_registered: "An account with that email already exists.",
    auth_err_password_length: "Password must be at least 6 characters.",
    auth_err_invalid_email: "Invalid email format.",
    auth_err_rate_limit: "Too many attempts. Wait a few minutes.",
    auth_load_failure_msg: "The authentication service failed to load. Check your internet connection and reload the page.",
    auth_missing_modules_msg: "Error loading the app. Reload the page; if the problem persists, contact support.",
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
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
    document.documentElement.lang = this.lang;
  },
  // Restaura el idioma guardado y lo aplica. Se llama al arrancar, antes de
  // que exista sesión — la pantalla de auth debe verse en el idioma correcto
  // sin depender de que el usuario ya haya iniciado sesión.
  restore() {
    this.lang = localStorage.getItem('mycampus_lang') || 'es';
    this.apply();
  },
  setLang(lang) {
    this.lang = lang;
    try {
      localStorage.setItem('mycampus_lang', lang);
    } catch (e) {}
    this.apply();
  }
};
