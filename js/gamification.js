/* ===================================================
   MyCampus ISTQB — Gamification System
   =================================================== */

const LEVELS = [
  { level: 1, name: { es: "Aprendiz", en: "Apprentice" }, minXP: 0, maxXP: 100, icon: "🌱" },
  { level: 2, name: { es: "Explorador", en: "Explorer" }, minXP: 100, maxXP: 300, icon: "🔍" },
  { level: 3, name: { es: "Practicante", en: "Practitioner" }, minXP: 300, maxXP: 600, icon: "📚" },
  { level: 4, name: { es: "Analista", en: "Analyst" }, minXP: 600, maxXP: 1000, icon: "🎯" },
  { level: 5, name: { es: "Experto", en: "Expert" }, minXP: 1000, maxXP: 1500, icon: "⭐" },
  { level: 6, name: { es: "Maestro", en: "Master" }, minXP: 1500, maxXP: 2500, icon: "🏆" },
  { level: 7, name: { es: "ISTQB Ready", en: "ISTQB Ready" }, minXP: 2500, maxXP: 9999, icon: "🎓" },
];

const ACHIEVEMENTS = [
  {
    id: "first_lesson",
    icon: "📖",
    name: { es: "Primer Paso", en: "First Step" },
    desc: { es: "Completa tu primera lección", en: "Complete your first lesson" },
    xp: 50,
    check: (state) => state.lessonsCompleted >= 1
  },
  {
    id: "five_lessons",
    icon: "📚",
    name: { es: "Estudiante Dedicado", en: "Dedicated Student" },
    desc: { es: "Completa 5 lecciones", en: "Complete 5 lessons" },
    xp: 100,
    check: (state) => state.lessonsCompleted >= 5
  },
  {
    id: "all_lessons",
    icon: "🎓",
    name: { es: "Currículo Completo", en: "Full Curriculum" },
    desc: { es: "Completa todas las lecciones del curriculum", en: "Complete all curriculum lessons" },
    xp: 500,
    check: (state) => state.lessonsCompleted >= 16
  },
  {
    id: "first_exam",
    icon: "📝",
    name: { es: "Primer Examen", en: "First Exam" },
    desc: { es: "Completa tu primer simulacro", en: "Complete your first mock exam" },
    xp: 75,
    check: (state) => state.examsCompleted >= 1
  },
  {
    id: "pass_exam",
    icon: "✅",
    name: { es: "¡Aprobado!", en: "Passed!" },
    desc: { es: "Obtén una puntuación de 65% o más en un simulacro", en: "Score 65% or more on a mock exam" },
    xp: 150,
    check: (state) => state.bestScore >= 65
  },
  {
    id: "ace_exam",
    icon: "🌟",
    name: { es: "Excelencia", en: "Excellence" },
    desc: { es: "Obtén una puntuación de 80% o más en un simulacro", en: "Score 80% or more on a mock exam" },
    xp: 200,
    check: (state) => state.bestScore >= 80
  },
  {
    id: "perfect_exam",
    icon: "💯",
    name: { es: "¡Perfecto!", en: "Perfect!" },
    desc: { es: "Obtén una puntuación de 100% en un simulacro", en: "Score 100% on a mock exam" },
    xp: 500,
    check: (state) => state.bestScore >= 100
  },
  {
    id: "ten_flashcards",
    icon: "🃏",
    name: { es: "Memorizador", en: "Memorizer" },
    desc: { es: "Repasa 10 flashcards", en: "Review 10 flashcards" },
    xp: 50,
    check: (state) => state.flashcardsReviewed >= 10
  },
  {
    id: "fifty_flashcards",
    icon: "🧠",
    name: { es: "Mente Aguda", en: "Sharp Mind" },
    desc: { es: "Repasa 50 flashcards", en: "Review 50 flashcards" },
    xp: 150,
    check: (state) => state.flashcardsReviewed >= 50
  },
  {
    id: "all_flashcards",
    icon: "🏅",
    name: { es: "Maestro de Flashcards", en: "Flashcard Master" },
    desc: { es: "Repasa todas las flashcards al menos una vez", en: "Review all flashcards at least once" },
    xp: 200,
    check: (state) => state.flashcardsReviewed >= FLASHCARDS.length
  },
  {
    id: "streak_3",
    icon: "🔥",
    name: { es: "En Racha", en: "On Fire" },
    desc: { es: "Estudia 3 días consecutivos", en: "Study 3 consecutive days" },
    xp: 100,
    check: (state) => state.streak >= 3
  },
  {
    id: "streak_7",
    icon: "⚡",
    name: { es: "Semana Completa", en: "Full Week" },
    desc: { es: "Estudia 7 días consecutivos", en: "Study 7 consecutive days" },
    xp: 250,
    check: (state) => state.streak >= 7
  },
  {
    id: "streak_30",
    icon: "🌙",
    name: { es: "Mes Dedicado", en: "Dedicated Month" },
    desc: { es: "Estudia 30 días consecutivos", en: "Study 30 consecutive days" },
    xp: 1000,
    check: (state) => state.streak >= 30
  },
  {
    id: "five_exams",
    icon: "📊",
    name: { es: "Examinado", en: "Examined" },
    desc: { es: "Completa 5 simulacros", en: "Complete 5 mock exams" },
    xp: 200,
    check: (state) => state.examsCompleted >= 5
  },
  {
    id: "glossary_user",
    icon: "📖",
    name: { es: "Glosario Activo", en: "Active Glossary" },
    desc: { es: "Busca 10 términos en el glosario", en: "Search 10 terms in the glossary" },
    xp: 50,
    check: (state) => state.glossarySearches >= 10
  }
];

const Gamification = {
  getLevel(xp) {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
      if (xp >= lvl.minXP) current = lvl;
    }
    return current;
  },

  getLevelProgress(xp) {
    const lvl = this.getLevel(xp);
    const range = lvl.maxXP - lvl.minXP;
    const progress = xp - lvl.minXP;
    return Math.min(100, Math.round((progress / range) * 100));
  },

  checkAchievements(state, onUnlock) {
    const unlocked = state.achievements || [];
    const newlyUnlocked = [];

    for (const ach of ACHIEVEMENTS) {
      if (!unlocked.includes(ach.id) && ach.check(state)) {
        unlocked.push(ach.id);
        newlyUnlocked.push(ach);
        if (onUnlock) onUnlock(ach);
      }
    }

    state.achievements = unlocked;
    return newlyUnlocked;
  }
};
